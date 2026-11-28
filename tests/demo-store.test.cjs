'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const {webcrypto}=require('node:crypto');
const seed=fs.readFileSync(path.join(__dirname,'../assets/js/demo-seed.js'),'utf8');
const store=fs.readFileSync(path.join(__dirname,'../assets/js/demo-store.js'),'utf8');
function app(storage=new Map()) {
  const events=[];const failures={write:false};
  const context={console,Date,Math,JSON,TextEncoder,Uint8Array,Array,Object,Error,Set,RegExp,Number,String,
    crypto:webcrypto,document:{dispatchEvent:event=>events.push(event.type)},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options?.detail;}},
    addEventListener(){},localStorage:{getItem:key=>storage.has(key)?storage.get(key):null,setItem(key,value){if(failures.write){const e=new Error('quota');e.name='QuotaExceededError';throw e;}storage.set(key,value);},removeItem:key=>storage.delete(key)}};
  context.window=context;vm.createContext(context);vm.runInContext(seed,context);vm.runInContext(store,context);
  return {D:context.DStore,storage,failures,events};
}
const pass='DiaritoDemo1!';
async function user(D,username='tester'){return D.register({username,email:username+'@example.test',password:pass});}
function post(D,content,visibility='community'){return D.createPost({content,language:'es',visibility,communityConfirmed:visibility==='community'});}
function edit(original,fragment,replacement,offset){const start=offset===undefined?original.indexOf(fragment):offset;return{start,end:start+fragment.length,original:fragment,replacement,explanation:'Una explicación concreta.',type:!fragment?'insert':!replacement?'delete':'replace'};}
function code(expected){return error=>error.code===expected;}

test('fixtures have >=20 community stories, safe offsets, chronological replies, and no plaintext password',()=>{
  const {D,storage}=app();const db=D.init();assert.ok(db.posts.filter(p=>p.visibility==='community').length>=20);assert.ok(db.users.length>=10);
  assert.ok(db.posts.every(p=>p.content.length>250));
  assert.ok(!storage.get(D.storageKey).includes(pass));
  for(const c of db.corrections){const p=db.posts.find(p=>p.id===c.postId);assert.ok(Date.parse(c.createdAt)>=Date.parse(p.createdAt));for(const e of c.edits)assert.equal(p.originalContent.slice(e.start,e.end),e.original);}
  for(const c of db.comments){const p=db.posts.find(p=>p.id===c.postId);assert.ok(Date.parse(c.createdAt)>=Date.parse(p.createdAt));assert.ok(Date.parse(c.createdAt)<=Date.now());}
  assert.equal(D.currentUser(),null);assert.equal(D.user('user-sowon').email,undefined);
});

test('registration/login use case-insensitive unique identities, hashed passwords and suspended-user checks',async()=>{
  const {D}=app();D.init();const u=await user(D,'tester');assert.equal(D.currentUser().id,u.id);assert.equal(D.currentUser().auth,undefined);
  assert.ok(D.db().users.find(x=>x.id===u.id).auth.hash.length===64);
  await assert.rejects(user(D,'TESTER'),code('USERNAME_TAKEN'));
  await assert.rejects(D.register({username:'other',email:'TESTER@example.test',password:pass}),code('EMAIL_TAKEN'));
  await assert.rejects(D.login('tester','wrongpassword'),code('INVALID_CREDENTIALS'));
  D.logout();await D.login('TESTER@EXAMPLE.TEST',pass);assert.equal(D.currentUser().id,u.id);
  await D.login('moderator',pass);D.setUserSuspended(u.id,true);
  await assert.rejects(D.login('tester',pass),code('USER_SUSPENDED'));D.setUserSuspended(u.id,false);await D.login('tester',pass);assert.equal(D.currentUser().id,u.id);
});

test('onboarding validates language pair, cannot escalate role, and challenge completion persists',async()=>{
  const {D,storage}=app();D.init();const u=await user(D);
  assert.throws(()=>D.completeOnboarding({name:'Test',nativeLanguage:'es',targetLanguage:'es',level:'beginner',goals:['travel'],learnerType:'writing'}),code('PROFILE_INVALID'));
  const profile=D.completeOnboarding({name:'Test',nativeLanguage:'es',targetLanguage:'ko',level:'intermediate',goals:['connection'],learnerType:'writing',photo:'',role:'admin'});
  assert.equal(profile.role,'member');assert.equal(profile.onboardingComplete,true);
  D.createPost({title:'My first question',content:'오늘은 친구를 만났어요.',language:'ko',visibility:'private',promptId:'daily-1'});
  assert.equal(D.currentUser().firstChallengeComplete,true);
  const reload=app(storage).D;reload.init();assert.equal(reload.currentUser().id,u.id);assert.equal(reload.currentUser().firstChallengeComplete,true);
});

test('post privacy and publication confirmation apply at read and mutation boundaries',async()=>{
  const {D}=app();D.init();const owner=await user(D,'owner');const secret=post(D,'A private story.','private'),ai=post(D,'Ayer voy al parque.','ai');
  assert.throws(()=>D.createPost({content:'Hello',language:'es',visibility:'community'}),code('PUBLICATION_CONFIRMATION_REQUIRED'));
  const pub=post(D,'A community story.');assert.ok(D.post(secret.id));
  await user(D,'visitor');assert.equal(D.post(secret.id),null);assert.equal(D.post(ai.id),null);assert.ok(D.post(pub.id));
  assert.ok(D.visiblePosts({authorId:owner.id}).every(p=>p.visibility==='community'));
  assert.throws(()=>D.addComment(secret.id,'hi'),code('POST_NOT_FOUND'));assert.throws(()=>D.updatePost(pub.id,{title:'changed'}),code('FORBIDDEN'));
  assert.throws(()=>D.runAICheck(ai.id),code('FORBIDDEN'));
  await D.login('owner',pass);assert.throws(()=>D.runAICheck(secret.id),code('AI_PRIVATE'));
  D.updatePost(pub.id,{visibility:'private'});await D.login('visitor',pass);assert.equal(D.post(pub.id),null);
});

test('grouped corrections preserve offsets for repeated fragments, accepted changes and original/rewrite',async()=>{
  const {D}=app();D.init();await user(D,'author');const original='Yo tengo 25 años. Yo tengo un reunión. Tengo una amiga.';const p=post(D,original);
  await user(D,'helper');const e1=edit(original,'un reunión','una reunión'),e2=edit(original,'Tengo','Tengo también',original.lastIndexOf('Tengo'));
  const c=D.addCorrection(p.id,{edits:[e1,e2],source:'human'});assert.equal(c.edits.length,2);
  assert.throws(()=>D.addCorrection(p.id,{edits:[{...e1,start:0}],source:'human'}),code('INVALID_RANGE'));
  assert.throws(()=>D.addCorrection(p.id,{edits:[e1,e1],source:'human'}),code('OVERLAPPING_EDITS'));
  const competing=D.addCorrection(p.id,{edits:[edit(original,'un reunión','otra reunión')],source:'human'});
  await D.login('author',pass);D.reviewEdit(c.id,c.edits[0].id,'accepted');D.reviewEdit(c.id,c.edits[1].id,'accepted');
  assert.equal(D.cleanText(p.id),'Yo tengo 25 años. Yo tengo una reunión. Tengo también una amiga.');
  assert.throws(()=>D.reviewEdit(competing.id,competing.edits[0].id,'accepted'),code('CORRECTION_CONFLICT'));
  D.reviewEdit(competing.id,competing.edits[0].id,'ignored');
  assert.equal(D.post(p.id).originalContent,original);
  D.saveRewrite(p.id,'Hoy tuve una reunión y después conversé con una amiga.');assert.equal(D.post(p.id).rewrites.length,1);assert.equal(D.post(p.id).originalContent,original);
  assert.throws(()=>D.updatePost(p.id,{content:'Overwritten'}),code('CONTENT_HAS_CORRECTIONS'));
  assert.throws(()=>D.addCorrection(p.id,{edits:[e1],source:'human'}),code('OWN_CORRECTION'));
  await D.login('helper',pass);assert.ok(D.db().notifications.some(n=>n.userId===D.currentUser().id&&n.type==='accepted'));
});

test('insert/delete operations at boundaries apply in stable order',async()=>{
  const {D}=app();D.init();await user(D,'author');const p=post(D,'Quiero ir un parque hoy.');await user(D,'helper');
  const c=D.addCorrection(p.id,{edits:[edit(p.content,'','a ',10),edit(p.content,' hoy','')]});
  await D.login('author',pass);for(const e of c.edits)D.reviewEdit(c.id,e.id,'accepted');assert.equal(D.cleanText(p.id),'Quiero ir a un parque.');
});

test('AI demo is deterministic, labeled, bounded and duplicate checks do not append',async()=>{
  const {D}=app();D.init();await user(D);const p=post(D,'Ayer voy al parque. Mi amiga tiene mucho paciencia.','ai');
  const first=D.runAICheck(p.id);assert.equal(first.source,'ai-demo');assert.equal(first.edits.length,2);
  const second=D.runAICheck(p.id);assert.equal(first.id,second.id);assert.equal(D.db().corrections.filter(c=>c.postId===p.id).length,1);
  const good=post(D,'Hoy fui al parque y hablé con mi amiga.','ai');assert.equal(D.runAICheck(good.id),null);
  const korean=D.createPost({content:'어제 학교에 가요. 저는 커피을 마셨어요.',language:'ko',visibility:'ai'});assert.equal(D.runAICheck(korean.id).edits.length,2);
});

test('blocking is reciprocal in discovery/replies and connections respect recipient ownership',async()=>{
  const {D}=app();D.init();const a=await user(D,'person_a');const p=post(D,'A public story.');const b=await user(D,'person_b');D.addComment(p.id,'A kind response.');
  const connection=D.requestConnection(a.id);assert.equal(connection.status,'pending');assert.throws(()=>D.respondConnection(connection.id,true),code('FORBIDDEN'));
  await D.login('person_a',pass);D.respondConnection(connection.id,true);assert.equal(D.db().connections.find(c=>c.id===connection.id).status,'accepted');
  D.blockUser(b.id);assert.equal(D.replies(p.id).comments.length,0);assert.ok(!D.db().connections.some(c=>c.id===connection.id));
  await D.login('person_b',pass);assert.equal(D.post(p.id),null);assert.throws(()=>D.requestConnection(a.id),code('FORBIDDEN'));
  await D.login('person_a',pass);D.unblockUser(b.id);assert.equal(D.replies(p.id).comments.length,1);
});

test('moderation is admin-only, hides reports and suspends accounts; author deletion cascades',async()=>{
  const {D}=app();D.init();await user(D,'report_author');const p=post(D,'An entry for moderation.');const author=D.currentUser();
  await user(D,'reporter');const report=D.report('post',p.id,'Contenido de prueba para moderación.');assert.throws(()=>D.resolveReport(report.id,'hide'),code('FORBIDDEN'));
  await D.login('moderator',pass);D.resolveReport(report.id,'hide');assert.equal(D.post(p.id),null);D.setContentHidden('post',p.id,false);assert.ok(D.post(p.id));D.setUserSuspended(author.id,true);assert.equal(D.post(p.id),null);D.setUserSuspended(author.id,false);
  await D.login('report_author',pass);D.deletePost(p.id);assert.ok(!D.db().posts.some(x=>x.id===p.id));assert.ok(!D.db().comments.some(x=>x.postId===p.id));
});

test('collections are scoped to their owner and deletion does not erase another member data',async()=>{
  const {D}=app();D.init();await user(D,'collector');const c=D.createCollection('Mi vocabulario');const w=D.addWord(c.id,{term:'a tu ritmo',meaning:'자기 속도에 맞게',language:'es'});
  assert.throws(()=>D.addWord(c.id,{term:'a tu ritmo',language:'es'}),code('WORD_EXISTS'));
  await user(D,'stranger');assert.throws(()=>D.removeWord(c.id,w.id),code('FORBIDDEN'));assert.throws(()=>D.deleteCollection(c.id),code('FORBIDDEN'));
  await D.login('collector',pass);D.renameCollection(c.id,'Expresiones');D.removeWord(c.id,w.id);assert.equal(D.db().collections.find(x=>x.id===c.id).words.length,0);D.deleteCollection(c.id);assert.ok(!D.db().collections.some(x=>x.id===c.id));
});

test('quota failures leave prior persisted and in-memory data intact; corrupted state is never erased',async()=>{
  const {D,storage,failures}=app();D.init();await user(D);const before=D.exportData();failures.write=true;
  assert.throws(()=>post(D,'Should not be saved.'),code('STORAGE_FULL'));assert.equal(D.exportData(),before);assert.equal(JSON.parse(storage.get(D.storageKey)).posts.length,JSON.parse(before).posts.length);
  failures.write=false;storage.set(D.storageKey,'broken json');const other=app(storage);assert.throws(()=>other.D.init(),code('STATE_CORRUPT'));assert.equal(storage.get(D.storageKey),'broken json');
});

test('backup roundtrip retains work and logs out; invalid imports do not replace state',async()=>{
  const {D}=app();D.init();await user(D);const p=post(D,'Keep this entry.');const backup=D.exportData();D.deletePost(p.id);D.importData(backup);assert.equal(D.currentUser(),null);
  await D.login('tester',pass);assert.equal(D.post(p.id).content,'Keep this entry.');const before=D.exportData();assert.throws(()=>D.importData('{"version":1}'),code('IMPORT_INVALID'));assert.equal(D.exportData(),before);
});
