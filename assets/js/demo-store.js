/* Diarito local demo repository. This is browser storage, not server authentication or secure access control. */
(() => {
  'use strict';
  const KEY = 'diarito-demo-v1';
  const SESSION_KEY = 'diarito-demo-session';
  const ITERATIONS = 120000;
  const MAX_IMAGE = 350000;
  const clone = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  const now = () => new Date().toISOString();
  const id = prefix => prefix + '-' + (window.crypto?.randomUUID ? window.crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
  let state;
  function fail(code) { const error = new Error(code); error.code = code; throw error; }
  function storageError(error) {
    if (error?.code && typeof error.code === 'string') throw error;
    fail(error?.name === 'QuotaExceededError' || error?.code === 22 ? 'STORAGE_FULL' : 'STORAGE_UNAVAILABLE');
  }
  function get(key) { try { return localStorage.getItem(key); } catch(error) { storageError(error); } }
  function set(key,value) { try { localStorage.setItem(key,value); } catch(error) { storageError(error); } }
  function remove(key) { try { localStorage.removeItem(key); } catch(error) { storageError(error); } }
  function validState(value) {
    try {
      const tables=['users','posts','comments','corrections','notifications','collections','connections','reports'];
      if (!value || value.version !== 1 || !tables.every(key => Array.isArray(value[key]))) return false;
      const hasText=(x,max=20000)=>typeof x==='string'&&x.length<=max;
      const isDate=x=>typeof x==='string'&&Number.isFinite(Date.parse(x));
      const ids=new Map();
      for(const table of tables){const rows=value[table];if(rows.some(x=>!x||!hasText(x.id,100)||!x.id)||new Set(rows.map(x=>x.id)).size!==rows.length)return false;ids.set(table,new Set(rows.map(x=>x.id)));}
      if(value.users.some(u=>!hasText(u.username,24)||!/^[a-z0-9_]{3,24}$/.test(u.username)||!hasText(u.email,254)||!u.auth||!/^[a-f0-9]{64}$/.test(u.auth.hash)||!/^(?:[a-f0-9]{2}){16,32}$/.test(u.auth.salt)||!Number.isInteger(u.auth.iterations)||u.auth.iterations<10000||u.auth.iterations>1000000||!Array.isArray(u.blockedUserIds)||!Array.isArray(u.goals)||!['member','admin'].includes(u.role)||!['es','ko'].includes(u.nativeLanguage)||!['es','ko'].includes(u.targetLanguage)||u.nativeLanguage===u.targetLanguage||!['beginner','intermediate','advanced'].includes(u.level)||!isDate(u.createdAt)))return false;
      if(new Set(value.users.map(u=>u.username.toLowerCase())).size!==value.users.length||new Set(value.users.map(u=>u.email.toLowerCase())).size!==value.users.length)return false;
      if(value.posts.some(p=>!hasText(p.originalContent)||!hasText(p.content)||!hasText(p.title,120)||!ids.get('users').has(p.authorId)||!['private','ai','community'].includes(p.visibility)||!['es','ko'].includes(p.language)||!Array.isArray(p.rewrites)||!Array.isArray(p.likes)||!isDate(p.createdAt)||p.rewrites.some(r=>!r||!hasText(r.content)||!isDate(r.createdAt))))return false;
      if(value.comments.some(c=>!ids.get('users').has(c.authorId)||!ids.get('posts').has(c.postId)||!hasText(c.content,4000)||!Array.isArray(c.likes)||!isDate(c.createdAt)))return false;
      if(value.corrections.some(c=>{
        const p=value.posts.find(p=>p.id===c.postId);
        return !p||!ids.get('users').has(c.authorId)||!Array.isArray(c.likes)||!isDate(c.createdAt)||!['human','ai-demo'].includes(c.source)||!Array.isArray(c.edits)||c.edits.some(e=>!e||!e.id||!Number.isInteger(e.start)||!Number.isInteger(e.end)||e.start<0||e.end<e.start||e.end>p.originalContent.length||p.originalContent.slice(e.start,e.end)!==e.original||!hasText(e.replacement,4000)||!['pending','accepted','ignored'].includes(e.status)||!(hasText(e.explanation,2000)||(e.explanation&&hasText(e.explanation.es,2000)&&hasText(e.explanation.ko,2000))));
      }))return false;
      if(value.collections.some(c=>!ids.get('users').has(c.userId)||!hasText(c.name,80)||!Array.isArray(c.words)||c.words.some(w=>!w||!hasText(w.term,300)||!hasText(w.meaning,1000)||!hasText(w.example,2000)||!['es','ko'].includes(w.language))))return false;
      if(value.notifications.some(n=>!ids.get('users').has(n.userId)||!hasText(n.type,100)||!isDate(n.createdAt)))return false;
      if(value.connections.some(c=>!ids.get('users').has(c.fromId)||!ids.get('users').has(c.toId)||!['pending','accepted'].includes(c.status)))return false;
      if(value.reports.some(r=>!ids.get('users').has(r.userId)||!['post','comment','correction','user'].includes(r.kind)||!hasText(r.reason,2000)||!['open','resolved'].includes(r.status)))return false;
      return true;
    } catch (_) { return false; }
  }
  function load() {
    const raw = get(KEY);
    if (raw === null) {
      if (!window.DemoSeed?.create) fail('SEED_UNAVAILABLE');
      const initial = window.DemoSeed.create();
      set(KEY,JSON.stringify(initial));
      state = initial;
    } else {
      let loaded;
      try { loaded = JSON.parse(raw); } catch (_) { fail('STATE_CORRUPT'); }
      if (!validState(loaded)) fail('STATE_CORRUPT');
      state = loaded;
    }
    return state;
  }
  function init() { load(); return clone(state); }
  function ensure() { if (!state) load(); return state; }
  function sessionId() {
    const raw = get(SESSION_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw).userId || null; } catch (_) { return null; }
  }
  function current(data = ensure()) { const u = data.users.find(u=>u.id===sessionId()); return u && !u.suspended ? u : null; }
  function required(data) { const u=current(data); if (!u) fail('AUTH_REQUIRED'); return u; }
  function ownUser(u) { if (!u) return null; const result=clone(u); delete result.auth; return result; }
  function publicUser(u) {
    if (!u) return null;
    const result=ownUser(u);
    delete result.email; delete result.blockedUserIds; delete result.goals; delete result.learnerType;
    return result;
  }
  function notifyChange() { document.dispatchEvent(new CustomEvent('diarito:datachange')); }
  function transaction(callback) {
    load();
    const draft=clone(state);
    const result=callback(draft);
    const serialized=JSON.stringify(draft);
    set(KEY,serialized); // Only replace memory after successful persistence.
    state=draft;
    notifyChange();
    return clone(result);
  }
  function isBlocked(data,actorId,otherId) {
    if (!actorId || actorId===otherId) return false;
    const a=data.users.find(u=>u.id===actorId), b=data.users.find(u=>u.id===otherId);
    return !!(a?.blockedUserIds.includes(otherId) || b?.blockedUserIds.includes(actorId));
  }
  function canRead(data,post,viewer=current(data)) {
    if (!post || post.hidden || !data.users.some(u=>u.id===post.authorId && !u.suspended)) return false;
    if (isBlocked(data,viewer?.id,post.authorId)) return false;
    return post.authorId===viewer?.id || post.visibility==='community';
  }
  function readable(data,postId) { const p=data.posts.find(p=>p.id===postId); if (!canRead(data,p)) fail('POST_NOT_FOUND'); return p; }
  function ownPost(data,postId) { const me=required(data),p=data.posts.find(p=>p.id===postId); if (!p || p.authorId!==me.id) fail('FORBIDDEN'); return p; }
  function activeUser(data,userId) { const u=data.users.find(u=>u.id===userId); if (!u || u.suspended) fail('USER_NOT_FOUND'); return u; }
  function text(value,maximum=20000,allowEmpty=false) {
    if (typeof value!=='string' || value.length>maximum || (!allowEmpty && !value.trim())) fail('CONTENT_INVALID');
    return value;
  }
  function photo(value) {
    if (!value) return '';
    if (typeof value!=='string' || value.length>MAX_IMAGE || !(/^(data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+|assets\/images\/[A-Za-z0-9_.-]+)$/.test(value))) fail('PHOTO_INVALID');
    return value;
  }
  function event(data,userId,type,actorId,postId=null,extras={}) {
    if (!userId || userId===actorId) return;
    data.notifications.unshift({id:id('notification'),userId,actorId,type,postId,read:false,createdAt:now(),...extras});
  }
  function updateStatus(data,postId) {
    const p=data.posts.find(p=>p.id===postId); if (!p) return;
    const edits=data.corrections.filter(c=>c.postId===postId && !c.hidden).flatMap(c=>c.edits);
    p.correctionStatus=edits.some(e=>e.status==='pending')?'pending':edits.some(e=>e.status==='accepted')?'reviewed':edits.length?'reviewed':'none';
  }
  function intersects(a,b) {
    if (a.start===a.end && b.start===b.end) return a.start===b.start;
    if (a.start===a.end) return a.start>b.start && a.start<b.end;
    if (b.start===b.end) return b.start>a.start && b.start<a.end;
    return a.start<b.end && b.start<a.end;
  }
  function validEdits(original,edits) {
    if (!Array.isArray(edits) || edits.length===0 || edits.length>20) fail('EMPTY_CORRECTION');
    const parsed=edits.map(e=> {
      if (!Number.isInteger(e.start) || !Number.isInteger(e.end) || e.start<0 || e.end<e.start || e.end>original.length || original.slice(e.start,e.end)!==e.original) fail('INVALID_RANGE');
      text(e.replacement,4000,true);
      if (e.original===e.replacement) fail('EMPTY_CORRECTION');
      let explanation;
      if (typeof e.explanation==='string') explanation=text(e.explanation,2000).trim();
      else if (e.explanation && typeof e.explanation.es==='string' && typeof e.explanation.ko==='string') explanation={es:text(e.explanation.es,2000),ko:text(e.explanation.ko,2000)};
      else fail('EXPLANATION_REQUIRED');
      return {id:id('edit'),start:e.start,end:e.end,original:e.original,replacement:e.replacement,explanation,type:['replace','delete','insert','alternative'].includes(e.type)?e.type:(e.start===e.end?'insert':!e.replacement?'delete':'replace'),status:'pending'};
    });
    for(let i=0;i<parsed.length;i++) for(let j=i+1;j<parsed.length;j++) if(intersects(parsed[i],parsed[j])) fail('OVERLAPPING_EDITS');
    return parsed.sort((a,b)=>a.start-b.start || a.end-b.end);
  }
  function correctionIn(data,postId,options) {
    const me=required(data),p=readable(data,postId);
    const source=options.source==='ai-demo'?'ai-demo':'human';
    if (source==='ai-demo') {
      if (p.authorId!==me.id) fail('FORBIDDEN');
      if (p.visibility==='private') fail('AI_PRIVATE');
    } else {
      if (p.authorId===me.id) fail('OWN_CORRECTION');
      if (p.visibility!=='community') fail('FORBIDDEN');
    }
    const edits=validEdits(p.originalContent,options.edits);
    const group={id:id('correction'),postId,authorId:me.id,source,edits,createdAt:now(),likes:[],hidden:false,fixture:false};
    data.corrections.push(group);
    updateStatus(data,postId);
    event(data,p.authorId,'correction',me.id,postId,{correctionId:group.id});
    return group;
  }
  function bytesToHex(bytes) { return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join(''); }
  function hexToBytes(hex) { return new Uint8Array(hex.match(/.{2}/g).map(x=>parseInt(x,16))); }
  async function hashPassword(password,salt,iterations=ITERATIONS) {
    if (!window.crypto?.subtle) fail('CRYPTO_UNAVAILABLE');
    const key=await window.crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
    const bits=await window.crypto.subtle.deriveBits({name:'PBKDF2',salt:hexToBytes(salt),iterations,hash:'SHA-256'},key,256);
    return bytesToHex(new Uint8Array(bits));
  }
  function equal(a,b) { if (a.length!==b.length) return false; let result=0;for(let i=0;i<a.length;i++)result|=a.charCodeAt(i)^b.charCodeAt(i);return result===0; }
  async function register({username,email,password}) {
    username=String(username||'').trim().toLowerCase();email=String(email||'').trim().toLowerCase();
    if (!/^[a-z0-9_]{3,24}$/.test(username)) fail('USERNAME_INVALID');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length>254) fail('EMAIL_INVALID');
    if (typeof password!=='string' || password.length<8 || password.length>256) fail('PASSWORD_SHORT');
    if (!window.crypto?.getRandomValues) fail('CRYPTO_UNAVAILABLE');
    const salt=bytesToHex(window.crypto.getRandomValues(new Uint8Array(16)));
    const hash=await hashPassword(password,salt);
    const created=transaction(data=>{
      if(data.users.some(u=>u.username.toLowerCase()===username)) fail('USERNAME_TAKEN');
      if(data.users.some(u=>u.email.toLowerCase()===email)) fail('EMAIL_TAKEN');
      const user={id:id('user'),username,email,name:username,nativeLanguage:'es',targetLanguage:'ko',level:'beginner',goals:[],learnerType:'',bio:'',photo:'',role:'member',onboardingComplete:false,firstChallengeComplete:false,createdAt:now(),suspended:false,blockedUserIds:[],fixture:false,auth:{salt,hash,iterations:ITERATIONS}};
      data.users.push(user);return ownUser(user);
    });
    set(SESSION_KEY,JSON.stringify({userId:created.id,createdAt:now()}));notifyChange();return created;
  }
  async function login(identifier,password) {
    load();const key=String(identifier||'').trim().toLowerCase();
    const user=state.users.find(u=>u.username.toLowerCase()===key || u.email.toLowerCase()===key);
    if (!user || typeof password!=='string') fail('INVALID_CREDENTIALS');
    const hash=await hashPassword(password,user.auth.salt,user.auth.iterations);
    if (!equal(hash,user.auth.hash)) fail('INVALID_CREDENTIALS');
    load();const fresh=state.users.find(u=>u.id===user.id);
    if (!fresh || fresh.auth.hash!==user.auth.hash) fail('INVALID_CREDENTIALS');
    if (fresh.suspended) fail('USER_SUSPENDED');
    set(SESSION_KEY,JSON.stringify({userId:user.id,createdAt:now()}));notifyChange();return ownUser(fresh);
  }
  function profilePatch(user,patch,complete=false) {
    const next={};
    for (const field of ['name','bio','country']) if(Object.hasOwn(patch,field)) next[field]=text(patch[field],field==='bio'?500:80,field!=='name').trim();
    for (const field of ['nativeLanguage','targetLanguage']) if(Object.hasOwn(patch,field)) { if(!['es','ko'].includes(patch[field]))fail('PROFILE_INVALID');next[field]=patch[field]; }
    if ((next.nativeLanguage||user.nativeLanguage)===(next.targetLanguage||user.targetLanguage)) fail('PROFILE_INVALID');
    if (Object.hasOwn(patch,'level')) { if(!['beginner','intermediate','advanced'].includes(patch.level))fail('PROFILE_INVALID');next.level=patch.level; }
    if (Object.hasOwn(patch,'goals')) { if(!Array.isArray(patch.goals) || patch.goals.length>10 || patch.goals.some(g=>typeof g!=='string'||g.length>100))fail('PROFILE_INVALID');next.goals=[...new Set(patch.goals)]; }
    if (Object.hasOwn(patch,'learnerType')) next.learnerType=text(patch.learnerType,100,true);
    if (Object.hasOwn(patch,'photo')) next.photo=photo(patch.photo);
    Object.assign(user,next);
    if(complete){if(!user.name || !user.goals.length || !user.learnerType)fail('PROFILE_INVALID');user.onboardingComplete=true;}
    return ownUser(user);
  }
  function newPost(data,options) {
    const me=required(data);const content=text(options.content,20000);const title=text(options.title||'',120,true);
    if(!['es','ko'].includes(options.language))fail('LANGUAGE_INVALID');
    const visibility=options.visibility||'private';if(!['private','ai','community'].includes(visibility))fail('VISIBILITY_INVALID');
    if(visibility==='community' && options.communityConfirmed!==true)fail('PUBLICATION_CONFIRMATION_REQUIRED');
    const p={id:id('post'),authorId:me.id,title,content,originalContent:content,language:options.language,photo:photo(options.photo),visibility,createdAt:now(),updatedAt:null,promptId:options.promptId||null,likes:[],rewrites:[],revisions:[],hidden:false,fixture:false,correctionStatus:'none'};
    data.posts.push(p);if(options.promptId==='daily-1' || options.promptId==='daily-happy')me.firstChallengeComplete=true;return p;
  }
  function updatePost(postId,patch) {
    return transaction(data=>{
      const p=ownPost(data,postId);
      if(Object.hasOwn(patch,'content') && patch.content!==p.content){
        if(data.corrections.some(c=>c.postId===postId) || p.rewrites.length)fail('CONTENT_HAS_CORRECTIONS');
        const content=text(patch.content,20000);p.revisions=p.revisions||[];p.revisions.push({content:p.originalContent,createdAt:p.updatedAt||p.createdAt});p.content=content;p.originalContent=content;
      }
      if(Object.hasOwn(patch,'title'))p.title=text(patch.title,120,true);
      if(Object.hasOwn(patch,'photo'))p.photo=photo(patch.photo);
      if(Object.hasOwn(patch,'language')){if(!['es','ko'].includes(patch.language))fail('LANGUAGE_INVALID');p.language=patch.language;}
      if(Object.hasOwn(patch,'visibility')){
        if(!['private','ai','community'].includes(patch.visibility))fail('VISIBILITY_INVALID');
        if(patch.visibility==='community'&&p.visibility!=='community'&&patch.communityConfirmed!==true)fail('PUBLICATION_CONFIRMATION_REQUIRED');
        p.visibility=patch.visibility;
      }
      p.updatedAt=now();return p;
    });
  }
  function deletePostIn(data,postId) {
    const correctionIds=data.corrections.filter(c=>c.postId===postId).map(c=>c.id),commentIds=data.comments.filter(c=>c.postId===postId).map(c=>c.id);
    data.posts=data.posts.filter(p=>p.id!==postId);data.comments=data.comments.filter(c=>c.postId!==postId);data.corrections=data.corrections.filter(c=>c.postId!==postId);data.notifications=data.notifications.filter(n=>n.postId!==postId);
    data.reports=data.reports.filter(r=>r.targetId!==postId&&!correctionIds.includes(r.targetId)&&!commentIds.includes(r.targetId));
    data.collections.forEach(c=>c.words.forEach(w=>{if(w.postId===postId)w.postId=null;}));
  }
  function replies(postId) {
    const data=ensure(),p=readable(data,postId),me=current(data);
    const visible=c=>c.postId===p.id&&!c.hidden&&data.users.some(u=>u.id===c.authorId&&!u.suspended)&&!isBlocked(data,me?.id,c.authorId);
    const sort=(a,b)=>Date.parse(a.createdAt)-Date.parse(b.createdAt);
    return clone({comments:data.comments.filter(visible).sort(sort),corrections:data.corrections.filter(visible).sort(sort)});
  }
  function resolveTarget(data,kind,targetId) {
    const key={post:'posts',comment:'comments',correction:'corrections',user:'users'}[kind];
    if(!key)fail('CONTENT_INVALID');const target=data[key].find(x=>x.id===targetId);if(!target)fail('NOT_FOUND');return target;
  }
  function readableTarget(data,kind,targetId) {
    const target=resolveTarget(data,kind,targetId);
    if(kind==='post')readable(data,targetId);
    else if(kind==='comment'||kind==='correction'){readable(data,target.postId);if(target.hidden||isBlocked(data,current(data)?.id,target.authorId))fail('NOT_FOUND');activeUser(data,target.authorId);}
    return target;
  }
  function ownCollection(data,collectionId) {const me=required(data),c=data.collections.find(c=>c.id===collectionId&&c.userId===me.id);if(!c)fail('FORBIDDEN');return c;}
  const aiRules = [
    ['es',/\bun cafetería\b/gi,'una cafetería','«Cafetería» es femenino: una cafetería.','cafetería는 여성 명사이므로 una를 써요.'],
    ['es',/\bun reunión\b/gi,'una reunión','«Reunión» es un sustantivo femenino: una reunión.','reunión은 여성 명사이므로 una를 써요.'],
    ['es',/\bun presentación\b/gi,'una presentación','«Presentación» es femenino: una presentación.','presentación은 여성 명사이므로 una를 써요.'],
    ['es',/\bmucho paciencia\b/gi,'mucha paciencia','«Paciencia» es femenino: mucha paciencia.','paciencia는 여성 명사이므로 mucha를 써요.'],
    ['es',/\bdemasiado agua\b/gi,'demasiada agua','«Agua» es femenino aunque use el artículo «el».','agua는 el과 함께 쓰지만 여성 명사예요.'],
    ['es',/\b[Aa]yer voy\b/g,'Ayer fui','Para una acción terminada ayer, usamos el pretérito «fui».','어제 끝난 행동은 과거형 fui로 표현해요.'],
    ['es',/\b[Aa]yer tengo\b/g,'Ayer tuve','«Ayer» sitúa esta acción terminada en el pasado: tuve.','어제의 완료된 일은 과거형 tuve를 써요.'],
    ['es',/\bir un parque\b/gi,'ir a un parque','«Ir» necesita «a» para indicar el destino.','ir 다음에 목적지를 나타낼 때 전치사 a를 써요.'],
    ['ko',/어제 친구를 만나서 커피를 마셔요/g,'어제 친구를 만나서 커피를 마셨어요','El evento ocurrió ayer: 마셨어요 marca el pasado.','어제 있었던 일이므로 과거형 마셨어요를 써요.'],
    ['ko',/어제 학교에 가요/g,'어제 학교에 갔어요','«어제» indica ayer; 갔어요 expresa la acción en pasado.','어제 있었던 일이므로 과거형 갔어요를 써요.'],
    ['ko',/저는 커피을/g,'저는 커피를','Después de una vocal, el objeto lleva 를.','커피처럼 모음으로 끝나는 명사 뒤에는 를을 써요.'],
    ['ko',/회사 가는 길에/g,'회사에 가는 길에','La partícula 에 marca el destino con 가다.','목적지를 나타내는 조사 에를 넣으면 더 완전해져요.'],
    ['ko',/책를/g,'책을','«책» termina en consonante: usamos 을.','책은 받침이 있으므로 을을 써요.']
  ].filter(rule=>rule[3]);
  function runAICheck(postId) {
    return transaction(data=>{
      const p=ownPost(data,postId);if(p.visibility==='private')fail('AI_PRIVATE');
      const me=required(data);const edits=[];
      for(const [language,regex,replacement,es,ko]of aiRules){
        if(language!==p.language)continue;regex.lastIndex=0;
        for(const match of p.originalContent.matchAll(regex)){
          const start=match.index,end=start+match[0].length;
          if(edits.some(e=>intersects(e,{start,end})))continue;
          edits.push({start,end,original:match[0],replacement:typeof replacement==='function'?replacement(match):replacement,explanation:{es,ko},type:'replace'});
        }
      }
      const prior=data.corrections.find(c=>c.postId===postId&&c.source==='ai-demo'&&c.authorId===me.id&&!c.hidden);
      if(prior)return prior;
      if(!edits.length)return null;
      return correctionIn(data,postId,{edits:edits.slice(0,20),source:'ai-demo'});
    });
  }
  const api = {
    init, register,login,
    db:()=>clone(ensure()),currentUser:()=>ownUser(current()),user:userId=>publicUser(ensure().users.find(u=>u.id===userId)),
    logout(){remove(SESSION_KEY);notifyChange();},
    updateProfile:patch=>transaction(data=>profilePatch(required(data),patch)),
    completeOnboarding:patch=>transaction(data=>profilePatch(required(data),patch,true)),
    createPost:options=>transaction(data=>newPost(data,options)),updatePost,
    deletePost:postId=>transaction(data=>{ownPost(data,postId);deletePostIn(data,postId);return true;}),
    visiblePosts({authorId,visibility}={}){const data=ensure();return clone(data.posts.filter(p=>canRead(data,p)&&(!authorId||p.authorId===authorId)&&(!visibility||p.visibility===visibility)).sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt)));},
    post(postId){const data=ensure(),p=data.posts.find(p=>p.id===postId);return canRead(data,p)?clone(p):null;},replies,
    addComment:(postId,content)=>transaction(data=>{const me=required(data),p=readable(data,postId);if(p.visibility!=='community')fail('FORBIDDEN');const c={id:id('comment'),postId,authorId:me.id,content:text(content,4000).trim(),createdAt:now(),likes:[],hidden:false,fixture:false};data.comments.push(c);event(data,p.authorId,'comment',me.id,postId,{commentId:c.id});return c;}),
    toggleLike:(kind,targetId)=>transaction(data=>{const me=required(data);if(!['post','comment','correction'].includes(kind))fail('CONTENT_INVALID');const target=readableTarget(data,kind,targetId);target.likes=target.likes||[];const index=target.likes.indexOf(me.id);if(index>=0)target.likes.splice(index,1);else target.likes.push(me.id);return target.likes;}),
    addCorrection:(postId,options)=>transaction(data=>correctionIn(data,postId,options)),
    reviewEdit:(correctionId,editId,status)=>transaction(data=>{
      if(!['accepted','ignored'].includes(status))fail('CONTENT_INVALID');const c=resolveTarget(data,'correction',correctionId),p=ownPost(data,c.postId),edit=c.edits.find(e=>e.id===editId);if(!edit)fail('NOT_FOUND');if(c.hidden)fail('FORBIDDEN');
      if(status==='accepted'){
        if(p.originalContent.slice(edit.start,edit.end)!==edit.original)fail('INVALID_RANGE');
        const accepted=data.corrections.filter(x=>x.postId===p.id&&!x.hidden).flatMap(x=>x.edits).filter(e=>e.status==='accepted'&&e.id!==editId);
        if(accepted.some(e=>intersects(e,edit)))fail('CORRECTION_CONFLICT');
      }
      if(edit.status!==status){edit.status=status;edit.reviewedAt=now();if(status==='accepted')event(data,c.authorId,'accepted',p.authorId,p.id,{correctionId:c.id});}
      updateStatus(data,p.id);return c;
    }),
    cleanText(postId){const data=ensure(),p=readable(data,postId);let content=p.originalContent;const accepted=data.corrections.filter(c=>c.postId===postId&&!c.hidden).flatMap(c=>c.edits).filter(e=>e.status==='accepted').sort((a,b)=>b.start-a.start||b.end-a.end);for(const e of accepted)content=content.slice(0,e.start)+e.replacement+content.slice(e.end);return content;},
    saveRewrite:(postId,content)=>transaction(data=>{const p=ownPost(data,postId);const rewrite={id:id('rewrite'),content:text(content,20000),createdAt:now()};p.rewrites.push(rewrite);return rewrite;}),runAICheck,
    report:(kind,targetId,reason)=>transaction(data=>{const me=required(data),target=readableTarget(data,kind,targetId);text(reason,2000);if((target.authorId||target.id)===me.id)fail('OWN_REPORT');const duplicate=data.reports.find(r=>r.userId===me.id&&r.kind===kind&&r.targetId===targetId&&r.status==='open');if(duplicate)return duplicate;const report={id:id('report'),userId:me.id,kind,targetId,reason:reason.trim(),status:'open',createdAt:now()};data.reports.push(report);data.users.filter(u=>u.role==='admin'&&!u.suspended).forEach(u=>event(data,u.id,'report',me.id,kind==='post'?targetId:target.postId||null,{reportId:report.id}));return report;}),
    blockUser:userId=>transaction(data=>{const me=required(data);activeUser(data,userId);if(me.id===userId)fail('FORBIDDEN');if(!me.blockedUserIds.includes(userId))me.blockedUserIds.push(userId);data.connections=data.connections.filter(c=>!((c.fromId===me.id&&c.toId===userId)||(c.fromId===userId&&c.toId===me.id)));return ownUser(me);}),
    unblockUser:userId=>transaction(data=>{const me=required(data);me.blockedUserIds=me.blockedUserIds.filter(x=>x!==userId);return ownUser(me);}),
    requestConnection:userId=>transaction(data=>{const me=required(data);activeUser(data,userId);if(me.id===userId||isBlocked(data,me.id,userId))fail('FORBIDDEN');const existing=data.connections.find(c=>(c.fromId===me.id&&c.toId===userId)||(c.fromId===userId&&c.toId===me.id));if(existing)return existing;const c={id:id('connection'),fromId:me.id,toId:userId,status:'pending',createdAt:now()};data.connections.push(c);event(data,userId,'connection_request',me.id,null,{connectionId:c.id});return c;}),
    respondConnection:(connectionId,accept)=>transaction(data=>{const me=required(data),c=data.connections.find(c=>c.id===connectionId);if(!c||c.toId!==me.id||c.status!=='pending')fail('FORBIDDEN');if(isBlocked(data,c.fromId,c.toId))fail('FORBIDDEN');if(accept){c.status='accepted';c.acceptedAt=now();event(data,c.fromId,'connection_accepted',me.id,null,{connectionId:c.id});}else data.connections=data.connections.filter(x=>x.id!==c.id);return c;}),
    removeConnection:connectionId=>transaction(data=>{const me=required(data),c=data.connections.find(c=>c.id===connectionId);if(!c||![c.toId,c.fromId].includes(me.id))fail('FORBIDDEN');data.connections=data.connections.filter(x=>x.id!==connectionId);return true;}),
    createCollection:name=>transaction(data=>{const me=required(data);name=text(name,80).trim();if(data.collections.some(c=>c.userId===me.id&&c.name.toLowerCase()===name.toLowerCase()))fail('COLLECTION_EXISTS');const c={id:id('collection'),userId:me.id,name,createdAt:now(),words:[]};data.collections.push(c);return c;}),
    renameCollection:(collectionId,name)=>transaction(data=>{const c=ownCollection(data,collectionId);name=text(name,80).trim();if(data.collections.some(x=>x.userId===c.userId&&x.id!==c.id&&x.name.toLowerCase()===name.toLowerCase()))fail('COLLECTION_EXISTS');c.name=name;return c;}),
    deleteCollection:collectionId=>transaction(data=>{ownCollection(data,collectionId);data.collections=data.collections.filter(c=>c.id!==collectionId);return true;}),
    addWord:(collectionId,options)=>transaction(data=>{const c=ownCollection(data,collectionId);if(!['es','ko'].includes(options.language))fail('LANGUAGE_INVALID');if(options.postId)readable(data,options.postId);const word={id:id('word'),term:text(options.term,300).trim(),meaning:text(options.meaning||'',1000,true),example:text(options.example||'',2000,true),language:options.language,postId:options.postId||null,createdAt:now()};if(c.words.some(w=>w.term===word.term&&w.language===word.language))fail('WORD_EXISTS');c.words.push(word);return word;}),
    removeWord:(collectionId,wordId)=>transaction(data=>{const c=ownCollection(data,collectionId);c.words=c.words.filter(w=>w.id!==wordId);return c;}),
    markNotificationsRead:()=>transaction(data=>{const me=required(data);data.notifications.filter(n=>n.userId===me.id).forEach(n=>n.read=true);return true;}),
    resolveReport:(reportId,action)=>transaction(data=>{
      const admin=required(data);if(admin.role!=='admin')fail('FORBIDDEN');const r=data.reports.find(r=>r.id===reportId);if(!r)fail('NOT_FOUND');if(!['dismiss','hide','remove','suspend'].includes(action))fail('CONTENT_INVALID');
      if(action!=='dismiss'){
        const target=resolveTarget(data,r.kind,r.targetId);
        if(action==='suspend'){const u=data.users.find(u=>u.id===(r.kind==='user'?target.id:target.authorId));if(!u||u.id===admin.id||u.role==='admin')fail('FORBIDDEN');u.suspended=true;}
        else if(r.kind==='user')fail('CONTENT_INVALID');
        else if(action==='hide')target.hidden=true;
        else if(r.kind==='post')deletePostIn(data,target.id);
        else {const key=r.kind==='comment'?'comments':'corrections';data[key]=data[key].filter(x=>x.id!==target.id);updateStatus(data,target.postId);}
      }
      // Keep the moderation audit even if content deletion cascaded its open report.
      r.status='resolved';r.action=action;r.resolvedAt=now();r.resolvedBy=admin.id;if(!data.reports.some(x=>x.id===r.id))data.reports.push(r);return r;
    }),
    setUserSuspended:(userId,suspended)=>transaction(data=>{const admin=required(data);if(admin.role!=='admin')fail('FORBIDDEN');const u=data.users.find(u=>u.id===userId);if(!u||u.id===admin.id||u.role==='admin')fail('FORBIDDEN');u.suspended=!!suspended;return publicUser(u);}),
    setContentHidden:(kind,targetId,hidden)=>transaction(data=>{const admin=required(data);if(admin.role!=='admin'||kind==='user')fail('FORBIDDEN');const target=resolveTarget(data,kind,targetId);target.hidden=!!hidden;if(kind==='correction')updateStatus(data,target.postId);return target;}),
    exportData:()=>JSON.stringify(ensure(),null,2),
    importData(value){let parsed;try{parsed=typeof value==='string'?JSON.parse(value):clone(value);}catch(_){fail('IMPORT_INVALID');}if(!validState(parsed))fail('IMPORT_INVALID');set(KEY,JSON.stringify(parsed));state=parsed;remove(SESSION_KEY);notifyChange();return true;},
    storageKey:KEY,sessionKey:SESSION_KEY
  };
  window.DStore=Object.freeze(api);
  window.addEventListener('storage',event=>{if(event.key===KEY||event.key===SESSION_KEY){try{load();notifyChange();}catch(error){document.dispatchEvent(new CustomEvent('diarito:storageerror',{detail:{code:error.code}}));}}});
})();
