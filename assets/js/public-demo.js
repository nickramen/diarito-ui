/* Public pages share account state, relative times and the activity leaderboard. */
(() => {
  'use strict';
  const root = document.documentElement;
  const t = (es,ko) => root.lang === 'ko' ? ko : es;
  const esc = value => String(value ?? '').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let storageReady = false;
  let storageFailure = null;
  let account = null;
  function readAccount() {
    if (!window.DStore) return;
    try { DStore.init(); account=DStore.currentUser(); storageReady=true; storageFailure=null; }
    catch(error) { account=null;storageReady=false;storageFailure=error; }
  }
  function activityHref() { return account ? 'app.html#feed' : 'signup.html'; }
  function updateNavigation() {
    const publicNavs = [...document.querySelectorAll('.landing-nav, .landing-mobile-nav__panel nav')];
    const footer = document.querySelector('.landing-footer__column > [data-i18n="footerDiarito"]')?.parentElement;
    if (footer) publicNavs.push(footer);
    publicNavs.forEach(nav=>{
      let link=nav.querySelector('a[href="leaderboard.html"]');
      if(!link){link=document.createElement('a');link.href='leaderboard.html';link.dataset.i18n='navLeaderboard';nav.append(link);}
      link.textContent=t('Leaderboard','활동 순위');
      if(location.pathname.endsWith('/leaderboard.html'))link.setAttribute('aria-current','page');
    });
    const info=document.querySelector('.landing-footer__column > [data-i18n="footerInfo"]')?.parentElement;
    if(info && !info.querySelector('a[href="guidelines.html"]')){
      const link=document.createElement('a');link.href='guidelines.html';link.dataset.publicGuidelines='';info.append(link);
    }
    document.querySelectorAll('[data-public-guidelines]').forEach(el=>{el.textContent=t('Normas de la comunidad','커뮤니티 가이드라인');});
    document.querySelectorAll('.landing-header__actions, .landing-mobile-nav__actions').forEach(group=>{
      let login=group.querySelector('[data-public-account],a[href="login.html"]');
      const signup=group.querySelector('a[href="signup.html"]');
      if(login){
        login.dataset.publicAccount='';
        login.href=account?'app.html#feed':'login.html';
        login.removeAttribute('data-i18n');
        login.innerHTML=`<i class="fi fi-rr-${account?'notebook':'sign-in-alt'}" aria-hidden="true"></i> ${account?t('Mi Diarito','내 Diarito'):t('Iniciar sesión','로그인')}`;
      }
      if(signup)signup.hidden=!!account;
    });
    document.querySelectorAll('[data-public-diary] a[aria-describedby="feed-action-hint"]').forEach(link=>{link.href=activityHref();});
    const hint=document.getElementById('feed-action-hint');
    if(hint){hint.removeAttribute('data-i18n');hint.textContent=account?t('Abrí tu feed para participar.','내 피드에서 참여해 보세요.'):t('Creá una cuenta para participar.','계정을 만들고 참여해 보세요.');}
  }
  function updateTimes() {
    document.querySelectorAll('time[data-relative-time]').forEach(el=>{
      if(el.dataset.demoAgeMinutes && !el.dataset.publicTimeAnchored){
        const age=Number(el.dataset.demoAgeMinutes);
        if(Number.isFinite(age)&&age>=0){el.dateTime=new Date(Date.now()-age*60000).toISOString();el.dataset.relativeTime=el.dateTime;}
        el.dataset.publicTimeAnchored='true';
      }
      const timestamp=Date.parse(el.dateTime||el.dataset.relativeTime);
      if(!Number.isFinite(timestamp))return;
      const minutes=Math.max(0,Math.floor((Date.now()-timestamp)/60000));
      let value=minutes,unit=t('min','분');
      if(minutes>=525600){value=Math.floor(minutes/525600);unit=t('y','년');}
      else if(minutes>=1440){value=Math.floor(minutes/1440);unit=t('d','일');}
      else if(minutes>=60){value=Math.floor(minutes/60);unit=t('h','시간');}
      el.textContent=minutes===0?t('ahora','지금'):`${value}${unit}`;
      const full=new Intl.DateTimeFormat(root.lang==='ko'?'ko-KR':'es-GT',{dateStyle:'long',timeStyle:'short'}).format(new Date(timestamp));
      el.title=full;el.setAttribute('aria-label',full);
    });
  }
  function localizedPublicCopy() {
    document.querySelectorAll('[data-public-copy]').forEach(el=>{
      const value=root.lang==='ko'?el.dataset.ko:el.dataset.es;
      if(value)el.textContent=value;
    });
    const page=document.querySelector('[data-public-page]')?.dataset.publicPage;
    if(page==='guidelines'){
      document.title=`${t('Normas de la comunidad','커뮤니티 가이드라인')} · Diarito`;
      document.querySelector('meta[name="description"]')?.setAttribute('content',t('Normas de Diarito para compartir historias, corregir con respeto y cuidar a la comunidad.','이야기를 나누고 서로 존중하며 교정하고 커뮤니티를 지키기 위한 Diarito 가이드라인이에요.'));
    }
    if(page==='leaderboard'){
      document.title=`${t('Leaderboard','활동 순위')} · Diarito`;
      document.querySelector('meta[name="description"]')?.setAttribute('content',t('La actividad de escritura de la comunidad de Diarito, calculada con los diarios visibles en esta demo local.','로컬 데모에서 볼 수 있는 일기로 집계한 Diarito 커뮤니티의 쓰기 활동이에요.'));
    }
  }
  function renderLeaderboard() {
    const mount=document.querySelector('[data-public-leaderboard]');
    if(!mount)return;
    if(!storageReady){
      mount.innerHTML=`<div class="public-activity-empty"><h2>${t('No pudimos leer la actividad','활동을 불러올 수 없어요')}</h2><p>${storageFailure?.code==='STATE_CORRUPT'?t('Los datos guardados no se pudieron leer. No los borramos.','저장된 데이터를 읽을 수 없어요. 데이터는 삭제되지 않았어요.'):t('Habilitá el almacenamiento de este navegador para recorrer la demo.','데모를 보려면 브라우저 저장 기능을 허용해 주세요.')}</p></div>`;
      return;
    }
    const counts=new Map();
    DStore.visiblePosts({visibility:'community'}).forEach(post=>counts.set(post.authorId,(counts.get(post.authorId)||0)+1));
    const rows=Array.from(counts,([id,count])=>({person:DStore.user(id),count})).filter(row=>row.person&&!row.person.suspended).sort((a,b)=>b.count-a.count||a.person.username.localeCompare(b.person.username));
    if(!rows.length){mount.innerHTML=`<div class="public-activity-empty"><h2>${t('La primera historia está por escribirse','첫 이야기를 기다리고 있어요')}</h2><p>${t('Compartí un diario con la comunidad para empezar.','커뮤니티에 일기를 공유하며 시작해 보세요.')}</p></div>`;return;}
    mount.innerHTML=`<div class="public-activity-table-wrap"><table class="public-activity-table"><caption class="diarito-visually-hidden">${t('Miembros ordenados por cantidad de diarios comunitarios visibles.','공개된 커뮤니티 일기 수를 기준으로 정렬한 회원 목록이에요.')}</caption><thead><tr><th scope="col">${t('Lugar','순위')}</th><th scope="col">${t('Miembro','회원')}</th><th scope="col" class="public-activity-language">${t('Practica','학습 언어')}</th><th scope="col" class="public-activity-count">${t('Diarios compartidos','공유한 일기')}</th></tr></thead><tbody>${rows.map(({person,count},index)=>`<tr><td class="public-activity-rank">${index+1}</td><td><a class="public-activity-person" href="${account?`app.html#profile/${encodeURIComponent(person.id)}`:'signup.html'}"><span class="diarito-avatar" aria-hidden="true">${esc((person.name||person.username).slice(0,1).toUpperCase())}</span><span><strong>${esc(person.name||person.username)}</strong><span>@${esc(person.username)}${person.id===account?.id?` · ${t('vos','나')}`:''}</span></span></a></td><td class="public-activity-language">${person.targetLanguage==='ko'?t('Coreano','한국어'):t('Español','스페인어')}</td><td class="public-activity-count"><strong>${count}</strong></td></tr>`).join('')}</tbody></table></div>
    <div class="public-activity-footer"><p>${t('Cuenta solo diarios de Comunidad visibles en este navegador. No mide nivel de idioma ni calidad de las correcciones.','이 브라우저에서 볼 수 있는 커뮤니티 일기만 집계해요. 언어 실력이나 교정의 품질을 평가하지 않아요.')}</p><a class="diarito-button diarito-button--primary" href="${account?'app.html#write':'signup.html'}">${t('Escribir mi diario','내 일기 쓰기')}</a></div>`;
  }
  function refresh() {readAccount();updateNavigation();updateTimes();localizedPublicCopy();renderLeaderboard();}
  refresh();
  document.addEventListener('diarito:languagechange',()=>{updateNavigation();updateTimes();localizedPublicCopy();renderLeaderboard();});
  window.addEventListener('diarito:datachange',refresh);
  document.addEventListener('diarito:datachange',refresh);
  window.addEventListener('storage',event=>{if(event.key==='diarito-demo-v1'||event.key==='diarito-demo-session')refresh();});
})();
