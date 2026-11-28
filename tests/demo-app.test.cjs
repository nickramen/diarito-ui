'use strict';
// Controller integration checks: real persistent Store plus narrowly mocked DOM boundaries.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {webcrypto}=require('node:crypto');
const read=name=>fs.readFileSync(path.join(__dirname,'../assets/js',name),'utf8');
const password='DiaritoDemo1!';
function environment() {
  const memory=new Map(),nodes=new Map(),revoked=[],encodes=[];
  const element=()=>({innerHTML:'',textContent:'',hidden:false,disabled:false,attributes:{},setAttribute(name,value){this.attributes[name]=value;},focus(){},click(){},addEventListener(){},querySelector(){return null;}});
  const root={lang:'es',dataset:{theme:'light'}};
  for(const id of ['.demo-skip','#app-main','#app-header','#app-sidebar','#app-mobile-nav','#app-aside','#demo-banner','#app-toast','#utility-dialog','#privacy-help','#community-consent','#word-count','#photo-preview','#diary-photo','#editor-error','#backup-file'])nodes.set(id,element());
  const document={documentElement:root,activeElement:element(),title:'',querySelector:selector=>nodes.get(selector)||null,addEventListener(){},dispatchEvent(){},createElement(type){
    if(type==='canvas')return{width:0,height:0,getContext:()=>({fillRect(){},drawImage(){}}),toDataURL(mime,quality){encodes.push({width:this.width,height:this.height,quality});return 'data:image/jpeg;base64,'+'A'.repeat(Math.ceil(this.width*this.height*quality));}};
    return element();
  }};
  const location={hash:'#feed',href:'app.html',replace(value){this.href=value;}};
  class FormData {
    constructor(form){this.values=form.entries();}
    [Symbol.iterator](){return this.values[Symbol.iterator]();}
    get(key){return this.values.find(([k])=>key===k)?.[1]??null;}
    getAll(key){return this.values.filter(([k])=>key===k).map(([,value])=>value);}
  }
  const context={console,Date,Math,JSON,TextEncoder,Uint8Array,Array,Object,Error,Set,Map,RegExp,Number,String,Promise,FormData,crypto:webcrypto,document,location,
    Image:class{constructor(){this.width=4000;this.height=3000;}async decode(){}},
    URL:{createObjectURL:()=> 'blob:fixture',revokeObjectURL:source=>revoked.push(source)},
    CustomEvent:class{constructor(type,options){this.type=type;this.detail=options?.detail;}},Event:class{},
    localStorage:{getItem:key=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,value),removeItem:key=>memory.delete(key)},
    addEventListener(){},setTimeout:()=>1,clearTimeout(){},scrollTo(){},DEntry:{open(){},close(){},init(){}}};
  context.window=context;vm.createContext(context);
  vm.runInContext(read('demo-seed.js'),context);vm.runInContext(read('demo-store.js'),context);
  const exposed='captureDraft,readDraft,bindEditor,renderEditor,renderSettings,bindSettings,renderAdmin,renderProfile,renderConnections,resizePhoto,visibleNotifications,memberAvailable,handleAction';
  vm.runInContext(read('demo-app.js').replace('  window.DApp={',`  window.__appTest={${exposed}};\n  window.DApp={`),context);
  context.DStore.init();
  function editor(data={}) {
    const fields={title:'',content:'Un día que quiero recordar.',language:'es',visibility:'community',communityConfirmed:true,...data};
    const elements=Object.fromEntries(Object.entries(fields).map(([name,value])=>[name,{value:typeof value==='boolean'?'on':value,checked:!!value,readOnly:false,addEventListener(){},dispatchEvent(){},focus(){}}]));
    const button=element(),status=element();
    const form={dataset:{draftKey:`diarito-draft-${context.DStore.currentUser().id}-challenge`,postId:'',challenge:'true'},elements,isConnected:true,
      querySelector:selector=>selector==='[type=submit]'?button:selector==='.app-draft-status'?status:null,addEventListener(){},
      entries:()=>Object.entries(elements).filter(([key,field])=>key!=='communityConfirmed'||field.checked).map(([key,field])=>[key,field.value])};
    nodes.set('#diary-form',form);return{form,button,status};
  }
  return {D:context.DStore,A:context.DApp,T:context.__appTest,context,nodes,memory,root,location,revoked,encodes,editor};
}

test('saving the first challenge consumes the draft even when navigation captures the old form again',async()=>{
  const env=environment(),{D,T,memory}=env;
  await D.register({username:'app_author',email:'app_author@example.test',password});
  D.completeOnboarding({name:'Autora',nativeLanguage:'ko',targetLanguage:'es',level:'beginner',goals:['daily'],learnerType:'exploring'});
  const {form,button}=env.editor();T.captureDraft(form);assert.ok(memory.get(form.dataset.draftKey));T.bindEditor();form.onsubmit({preventDefault(){}});
  assert.equal(D.currentUser().firstChallengeComplete,true);assert.equal(form.dataset.saved,'true');assert.equal(button.disabled,true);
  assert.equal(memory.has(form.dataset.draftKey),false);T.captureDraft(form);assert.equal(memory.has(form.dataset.draftKey),false);assert.equal(T.readDraft(form.dataset.draftKey),null);
  const count=D.visiblePosts({authorId:D.currentUser().id}).length;form.onsubmit({preventDefault(){}});assert.equal(D.visiblePosts({authorId:D.currentUser().id}).length,count);
});

test('hidden corrections still lock the exact original; stale draft text cannot replace it',async()=>{
  const env=environment(),{D,T,memory}=env;
  await D.login('sowon',password);const owner=D.currentUser();const p=D.createPost({content:'  Tengo un reunión.  ',language:'es',visibility:'community',communityConfirmed:true});
  await D.login('mateo',password);const c=D.addCorrection(p.id,{edits:[{start:8,end:18,original:'un reunión',replacement:'una reunión',explanation:'Reunión es femenino.',type:'replace'}]});
  await D.login('moderator',password);D.setContentHidden('correction',c.id,true);await D.login('sowon',password);
  assert.equal(D.replies(p.id).corrections.length,0);
  memory.set(`diarito-draft-${owner.id}-${p.id}`,JSON.stringify({title:'Draft',content:'Texto diferente',language:'es',visibility:'community',photo:''}));
  const html=T.renderEditor(p.id,false);assert.match(html,/readonly/);assert.match(html,/  Tengo un reunión\.  /);assert.ok(!html.includes('Texto diferente'));
  const {form}=env.editor({title:'Otro título',content:p.originalContent});form.dataset.postId=p.id;form.dataset.challenge='false';form.elements.content.readOnly=true;T.bindEditor();form.onsubmit({preventDefault(){}});
  assert.equal(D.post(p.id).title,'Otro título');assert.equal(D.post(p.id).originalContent,p.originalContent);
});

test('image resizing honors the storage byte budget and always releases temporary URLs',async()=>{
  const env=environment();const value=await env.T.resizePhoto({type:'image/jpeg',size:500000});
  assert.ok(value.length<=350000);assert.ok(env.encodes.length>1);assert.ok(env.encodes.some(x=>x.width<1200));assert.equal(env.revoked.length,1);
  await assert.rejects(env.T.resizePhoto({type:'image/jpeg',size:6*1024*1024}),error=>error.message==='PHOTO_INVALID');
  env.context.Image=class{constructor(){this.width=0;this.height=0;}async decode(){throw new Error('decode failed');}};
  await assert.rejects(env.T.resizePhoto({type:'image/png',size:100}));assert.equal(env.revoked.length,2);
});

test('settings show localized canonical goal choices, preserve multi-goal data and recognize exploring',async()=>{
  const env=environment(),{D,T,nodes,root}=env;await D.login('sowon',password);D.updateProfile({learnerType:'exploring'});
  let html=T.renderSettings();assert.match(html,/name="goals" value="daily" checked/);assert.match(html,/name="goals" value="connect" checked/);assert.match(html,/value="exploring" selected/);assert.match(html,/name="customGoal"[^>]*maxlength="100"/);assert.ok(!html.includes('daily-life'));
  root.lang='ko';html=T.renderSettings();assert.match(html,/내 하루를 자신 있게 이야기하기/);
  const button={disabled:false},error={hidden:true,textContent:''};
  const values=[['name','소원'],['bio',''],['nativeLanguage','ko'],['level','intermediate'],['goals','daily'],['goals','travel'],['customGoal','친구와 일상을 이야기하기'],['learnerType','exploring']];
  const form={entries:()=>values,querySelector:selector=>selector==='[type=submit]'?button:error};nodes.set('#profile-form',form);T.bindSettings();await form.onsubmit({preventDefault(){}});
  assert.equal(JSON.stringify(D.currentUser().goals),JSON.stringify(['daily','travel','친구와 일상을 이야기하기']));assert.equal(D.currentUser().learnerType,'exploring');
});

test('blocked or suspended profiles and connections do not offer impossible interactions',async()=>{
  const env=environment(),{D,T}=env;await D.login('sowon',password);D.blockUser('user-mateo');let html=T.renderProfile('user-mateo');assert.ok(!html.includes('data-action="connect"'));assert.match(html,/data-action="unblock"/);
  await D.login('mateo',password);html=T.renderProfile('user-sowon');assert.ok(!html.includes('data-action="connect"'));assert.ok(!html.includes('data-action="unblock"'));
  await D.login('moderator',password);D.setUserSuspended('user-lucia',true);await D.login('sowon',password);assert.ok(!T.renderConnections().includes('user-lucia'));assert.ok(!T.renderProfile('user-lucia').includes('data-action="connect"'));
});

test('moderation only offers supported report actions; malformed routes recover to the feed',async()=>{
  const env=environment(),{D,T,A,location,nodes}=env;await D.login('sowon',password);D.report('user','user-lucia','Spam de prueba.');await D.login('moderator',password);
  const html=T.renderAdmin();assert.ok(!html.includes('data-resolution="hide"'));assert.ok(!html.includes('data-resolution="remove"'));assert.match(html,/data-resolution="suspend"/);assert.match(html,/data-resolution="dismiss"/);
  for(const hash of ['#%E0%A4%A','#__proto__','#constructor','#feed/one/two']){location.hash=hash;assert.doesNotThrow(()=>A.render());assert.match(nodes.get('#app-main').innerHTML,/Nuestros mundos/);}
});

test('actual repository errors have actionable messages in both UI languages',()=>{
  const {A,root}=environment();
  for(const lang of ['es','ko']){root.lang=lang;for(const code of ['PUBLICATION_CONFIRMATION_REQUIRED','CONTENT_HAS_CORRECTIONS','CONTENT_INVALID','IMPORT_INVALID','COLLECTION_EXISTS','WORD_EXISTS','PHOTO_INVALID','PROFILE_INVALID'])assert.notEqual(A.errorMessage({code}),A.errorMessage({code:'UNKNOWN_TEST'}));}
});


test('single-item counts and navigation accessibility labels follow the interface language',async()=>{
  const env=environment(),{D,A,nodes,root,location}=env;
  await D.register({username:'copy_author',email:'copy_author@example.test',password});
  D.completeOnboarding({name:'Autora',nativeLanguage:'ko',targetLanguage:'es',level:'beginner',goals:['daily'],learnerType:'exploring'});
  const p=D.createPost({content:'Ayer voy al parque.',language:'es',visibility:'community',communityConfirmed:true,promptId:'daily-1'});
  D.runAICheck(p.id);D.saveRewrite(p.id,'Ayer fui al parque.');A.render();
  const sidebar=nodes.get('#app-aside').innerHTML;
  assert.match(sidebar,/1 diario<\/div>/);assert.match(sidebar,/1 respuesta con correcciones/);assert.match(sidebar,/1 diario reescrito/);
  assert.ok(!sidebar.includes('1 diarios'));assert.match(nodes.get('#app-main').innerHTML,/1 respuesta<\/button>/);
  const c=D.createCollection('Palabras');D.addWord(c.id,{term:'parque',language:'es'});location.hash='#collections';A.render();assert.match(nodes.get('#app-main').innerHTML,/1 expresión<\/span>/);
  root.lang='ko';A.render();assert.equal(nodes.get('.demo-skip').textContent,'본문으로 건너뛰기');assert.equal(nodes.get('#app-mobile-nav').attributes['aria-label'],'앱 메뉴');
});
