/* Diarito MVP V1. Browser-local demo. No server authentication or remote AI. */
(() => {
  'use strict';
  const S = window.DStore;
  const root = document.documentElement;
  const $ = (s, scope = document) => scope.querySelector(s);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const t = (es, ko) => root.lang === 'ko' ? (ko ?? es) : es;
  const countLabel = (count, singular, plural, ko) => t(count===1?singular:plural,ko);
  const icon = name => `<i class="fi fi-rr-${esc(name)}" aria-hidden="true"></i>`;
  const language = code => code === 'ko' ? t('Coreano', '한국어') : t('Español', '스페인어');
  const level = code => ({ beginner:t('Principiante','초급'), intermediate:t('Intermedio','중급'), advanced:t('Avanzado','고급') }[code] || t('Principiante','초급'));
  const visibility = code => ({ private:t('Solo yo','나만 보기'), ai:t('Solo IA · privado','AI만 · 비공개'), community:t('Comunidad','커뮤니티') }[code] || code);
  const localized = value => value && typeof value === 'object' ? value[root.lang] || value.es || '' : value || '';
  const goalOptions = [
    ['daily','Contar mi día con más confianza','내 하루를 자신 있게 이야기하기'],
    ['connect','Conectar con otras personas','다른 사람들과 소통하기'],
    ['travel','Prepararme para viajar','여행 준비하기'],
    ['work','Usar el idioma en el trabajo o estudio','일이나 공부에서 언어 사용하기'],
    ['culture','Entender mejor la cultura','문화를 더 잘 이해하기']
  ];
  const goalKey = value => ({'daily-life':'daily',connection:'connect'})[value] || value;
  const time = iso => {
    const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    if (!Number.isFinite(seconds)) return '';
    if (seconds < 60) return t('ahora','방금');
    for (const [size,unit] of [[31536000,'y'],[86400,'d'],[3600,'h'],[60,'min']]) if (seconds >= size) return Math.floor(seconds / size) + unit;
    return '';
  };
  const fullTime = iso => new Date(iso).toLocaleString(root.lang === 'ko' ? 'ko-KR':'es-HN', {dateStyle:'medium',timeStyle:'short'});
  const safePhoto = source => typeof source === 'string' && /^(assets\/images\/[\w./-]+|data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+)$/.test(source) ? source : '';
  const avatar = (user, size = '') => {
    const person = user || {name:'D'};
    const photo = safePhoto(person.photo);
    const initials = (person.name || person.username || 'D').split(/\s+/).slice(0,2).map(x => Array.from(x)[0]).join('');
    return `<span class="app-avatar ${size ? 'app-avatar--' + esc(size.replace(/^--/,'')) : ''}" aria-hidden="true">${photo ? `<img src="${esc(photo)}" alt="" loading="lazy">` : esc(initials)}</span>`;
  };
  let route = 'feed', filter = 'all', profileTab = 'diaries', toastTimer, modalOpener, lastCreatedId;
  const drafts = new Map();
  let editorPhoto = '', editorToken = '', photoRequest = 0;
  const me = () => S.currentUser();
  const db = () => S.db();
  const profileHref = id => `#profile/${encodeURIComponent(id)}`;
  function memberAvailable(userId, state=db()) {
    const viewer=me(), person=state.users.find(u=>u.id===userId);
    return !!person && !person.suspended && (!viewer || person.id===viewer.id || (!(viewer.blockedUserIds||[]).includes(person.id) && !(person.blockedUserIds||[]).includes(viewer.id)));
  }
  function visibleNotifications(state=db()) {
    return state.notifications.filter(n=>n.userId===me()?.id && (n.type==='report' || (
      (!n.actorId || memberAvailable(n.actorId,state)) && (!n.postId || S.post(n.postId)) &&
      (!n.commentId || state.comments.some(c=>c.id===n.commentId&&!c.hidden)) &&
      (!n.correctionId || state.corrections.some(c=>c.id===n.correctionId&&!c.hidden))
    )));
  }
  function errorMessage(error) {
    const code = error?.code || error?.message;
    const errors = {
      STORAGE_FULL:t('No hay espacio para guardar. Exportá una copia y quitá alguna foto antes de volver a intentar.','저장 공간이 부족해요. 백업을 내보내고 사진 일부를 지운 후 다시 시도해 주세요.'),
      STORAGE_UNAVAILABLE:t('El navegador no permite guardar datos. Habilitá el almacenamiento para continuar.','브라우저 저장이 차단되어 있어요. 저장을 허용해 주세요.'),
      AUTH_REQUIRED:t('Iniciá sesión para continuar.','계속하려면 로그인해 주세요.'),
      COMMUNITY_CONFIRMATION_REQUIRED:t('Confirmá que querés compartir este diario con la comunidad.','커뮤니티 공개 안내를 확인해 주세요.'),
      CORRECTIONS_EXIST:t('Este diario ya tiene correcciones. Conservamos el original; usá la reescritura para crear una nueva versión.','첨삭이 있는 일기는 원문을 보존해요. 다시 쓰기로 새 버전을 만들어 주세요.'),
      INVALID_CONTENT:t('Completá el texto y revisá su extensión antes de guardar.','저장하기 전에 내용과 길이를 확인해 주세요.'),
      FORBIDDEN:t('Tu cuenta no puede realizar esta acción.','이 작업을 수행할 권한이 없어요.'),
      USER_SUSPENDED:t('Esta cuenta está suspendida en la demo.','이 데모 계정은 이용이 정지되어 있어요.'),
      INVALID_BACKUP:t('El archivo no es una copia válida de esta demo.','올바른 데모 백업 파일이 아니에요.'),
      NOT_FOUND:t('Este contenido ya no está disponible.','이 콘텐츠를 찾을 수 없어요.'),
      INVALID_NAME:t('Escribí un nombre válido.','올바른 이름을 입력해 주세요.'),
      DUPLICATE_COLLECTION:t('Ya tenés una colección con ese nombre.','같은 이름의 컬렉션이 있어요.'),
      WORD_EXISTS:t('Esta expresión ya está en esa colección. Elegí otra colección o cambiá la expresión.','이미 이 컬렉션에 저장한 표현이에요. 다른 컬렉션이나 표현을 선택해 주세요.'),
      PHOTO_INVALID:t('Elegí una imagen JPG, PNG o WebP de hasta 5 MB. Si no se puede reducir, probá con una más pequeña.','5MB 이하의 JPG, PNG, WebP 이미지를 선택해 주세요. 줄일 수 없으면 더 작은 사진을 사용해 주세요.'),
      PROFILE_INVALID:t('Revisá tus idiomas, nivel y objetivos. Cada objetivo puede tener hasta 100 caracteres.','언어, 수준, 목표를 확인해 주세요. 목표는 각각 100자까지 입력할 수 있어요.'),
      STATE_CORRUPT:t('No pudimos leer los datos guardados. No los borramos: conservá una copia antes de restaurarlos.','저장한 데이터를 읽을 수 없어요. 삭제하지 않았으니 복원 전에 백업을 보관해 주세요.'),
      LANGUAGE_INVALID:t('Elegí español o coreano para este diario.','일기 언어로 스페인어나 한국어를 선택해 주세요.'),
      VISIBILITY_INVALID:t('Elegí Solo yo, Solo IA o Comunidad.','나만 보기, AI만, 커뮤니티 중에서 선택해 주세요.'),
      USER_NOT_FOUND:t('Este miembro no está disponible para interactuar.','이 회원과 지금 소통할 수 없어요.')
    };
    const aliases={PUBLICATION_CONFIRMATION_REQUIRED:'COMMUNITY_CONFIRMATION_REQUIRED',CONTENT_HAS_CORRECTIONS:'CORRECTIONS_EXIST',CONTENT_INVALID:'INVALID_CONTENT',IMPORT_INVALID:'INVALID_BACKUP',POST_NOT_FOUND:'NOT_FOUND',COLLECTION_EXISTS:'DUPLICATE_COLLECTION'};
    return errors[aliases[code]||code] || t('No pudimos guardar el cambio. Revisá los datos e intentá de nuevo.','변경을 저장하지 못했어요. 입력 내용을 확인하고 다시 시도해 주세요.');
  }
  function toast(es, ko) {
    const el = $('#app-toast'); if (!el) return;
    el.textContent = t(es,ko); el.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => {el.hidden=true;}, 4500);
  }
  function navigate(next) { if (location.hash.slice(1) === next) render(); else location.hash = next; }
  function utility(title, body, onReady) {
    const dialog = $('#utility-dialog');
    modalOpener = document.activeElement;
    dialog.innerHTML = `<div class="utility-dialog__head"><h2 id="utility-title">${esc(title)}</h2><button class="diarito-button diarito-button--icon" data-close-utility aria-label="${t('Cerrar','닫기')}">${icon('cross-small')}</button></div>${body}`;
    if (!dialog.open) dialog.showModal();
    $('[data-close-utility]',dialog).addEventListener('click',()=>dialog.close());
    if(onReady) onReady(dialog);
  }
  function confirmAction(title, message, action, button=t('Confirmar','확인')) {
    utility(title, `<p>${esc(message)}</p><p class="app-error" role="alert" hidden></p><div class="app-actions"><button class="diarito-button diarito-button--primary" data-confirm>${esc(button)}</button><button class="diarito-button diarito-button--secondary" data-cancel>${t('Cancelar','취소')}</button></div>`, dialog => {
      $('[data-cancel]',dialog).onclick = () => dialog.close();
      $('[data-confirm]',dialog).onclick = async e => {
        e.currentTarget.disabled=true;
        try { await action(); dialog.close(); render(); }
        catch(error) { const el=$('.app-error',dialog);el.textContent=errorMessage(error);el.hidden=false; e.target.disabled=false; }
      };
    });
  }
  function heading(title, subtitle='', action='') { return `<div class="app-heading"><div><h1>${esc(title)}</h1>${subtitle ? `<p>${esc(subtitle)}</p>`:''}</div>${action}</div>`; }
  function empty(title,body,action='') { return `<div class="app-empty">${icon('book-open-cover')}<h2>${esc(title)}</h2><p>${esc(body)}</p>${action}</div>`; }
  const actionButton = (action, label, className='secondary',extra='') => `<button class="diarito-button diarito-button--${className}" data-action="${action}" ${extra}>${label}</button>`;
  function navLink(hash, symbol, label, count=0) {
    return `<a class="app-nav-link" href="#${hash}" ${route.split('/')[0]===hash?'aria-current="page"':''}>${icon(symbol)}<span>${label}</span>${count?`<span class="app-count">${count}</span>`:''}</a>`;
  }
  function renderShell() {
    const user=me(), state=db(); if(!user)return;
    const unread=visibleNotifications(state).filter(n=>!n.read).length;
    const skip=$('.demo-skip');if(skip)skip.textContent=t('Ir al contenido','본문으로 건너뛰기');
    $('#app-mobile-nav').setAttribute('aria-label',t('Navegación de la app','앱 메뉴'));
    const name=user.name||user.username;
    $('#demo-banner').innerHTML = `${t('Demo local · los datos quedan en este navegador.','로컬 데모 · 데이터는 이 브라우저에 저장돼요.')} <span class="app-banner-detail">${t('Perfiles de ejemplo e IA simulada.','예시 프로필 · AI 첨삭 시뮬레이션.')}</span> <a href="#settings">${t('Guardar copia','백업')}</a>`;
    $('#app-header').innerHTML = `<a class="app-brand" href="#feed"><span class="app-brand__mark" aria-hidden="true"></span>Diarito</a><div class="app-header__actions"><a href="#challenge" class="diarito-button diarito-button--ghost app-header__question">${icon('interrogation')}${t('Pregunta del día','오늘의 질문')}</a><button data-action="language" class="diarito-button diarito-button--secondary" aria-label="${t('Cambiar a coreano','스페인어로 변경')}">${root.lang==='ko'?'한국어':'ESP'}</button><button data-action="theme" class="diarito-button diarito-button--icon" aria-label="${t('Cambiar tema','테마 변경')}" aria-pressed="${root.dataset.theme==='dark'}">${icon(root.dataset.theme==='dark'?'sun':'moon')}</button><details class="app-menu"><summary aria-label="${t('Menú de cuenta','계정 메뉴')}">${avatar(user,'sm')}</summary><div class="app-menu__panel"><a href="#profile">${t('Mi perfil','내 프로필')}</a><a href="#collections">${t('Mis colecciones','내 컬렉션')}</a><a href="#leaderboard">${t('Leaderboard','리더보드')}</a><a href="#connections">${t('Conexiones','친구')}</a><a href="#settings">${t('Configuración','설정')}</a>${user.role==='admin'?`<a href="#admin">${t('Moderación','신고 관리')}</a>`:''}<a href="index.html">${t('Sitio web','웹사이트')}</a><button data-action="logout">${t('Cerrar sesión','로그아웃')}</button></div></details></div>`;
    $('#app-sidebar').innerHTML = `<nav aria-label="${t('Navegación de la app','앱 메뉴')}">${navLink('feed','home',t('Comunidad','커뮤니티'))}${navLink('diary','book-alt',t('Mi diario','내 일기'))}${navLink('write','edit',t('Escribir','일기 쓰기'))}${navLink('collections','bookmark',t('Colecciones','컬렉션'))}${navLink('notifications','bell',t('Notificaciones','알림'),unread)}${navLink('connections','users',t('Conexiones','친구'))}${navLink('leaderboard','trophy',t('Leaderboard','리더보드'))}${navLink('profile','user',t('Mi perfil','내 프로필'))}</nav><div class="app-sidebar__bottom">${navLink('settings','settings',t('Configuración','설정'))}${user.role==='admin'?navLink('admin','shield-check',t('Moderación','신고 관리')):''}${navLink('guidelines','heart',t('Reglas de comunidad','커뮤니티 가이드'))}<a class="app-nav-link" href="index.html">${icon('globe')}${t('Volver al sitio','웹사이트로')}</a></div><div class="app-sidebar__user">${avatar(user,'sm')}<div><strong>${esc(name)}</strong><div class="app-small">@${esc(user.username)}</div></div></div>`;
    $('#app-mobile-nav').innerHTML = `${navLink('feed','home',t('Comunidad','커뮤니티'))}${navLink('diary','book-alt',t('Mi diario','내 일기'))}${navLink('write','edit',t('Escribir','쓰기'))}${navLink('notifications','bell',t('Avisos','알림'),unread)}${navLink('profile','user',t('Perfil','프로필'))}`;
    const own=state.posts.filter(p=>p.authorId===user.id&&!p.hidden);
    const corrected=own.reduce((count,p)=>count+S.replies(p.id).corrections.length,0);
    const rewritten=own.filter(p=>p.rewrites?.length).length;
    const people=state.users.filter(u=>u.id!==user.id&&u.role!=='admin'&&memberAvailable(u.id,state)).slice(0,3);
    $('#app-aside').innerHTML = `<section class="app-aside-section"><h2>${t('Tu vida también enseña.','내 일상이 배움이 되는 곳.')}</h2><p>${t('Una historia pequeña es suficiente para empezar.','작은 이야기 하나면 충분해요.')}</p><a href="#write" class="diarito-button diarito-button--primary">${icon('edit')}${t('Escribí un diarito','일기 쓰기')}</a></section><section class="app-aside-section"><h2>${t('Hacelo tuyo','내 것으로 만들기')}</h2><ol class="app-oio"><li><span>${own.length?'✓':'1'}</span><div>${t('Escribí tu historia','내 이야기 쓰기')}<div class="app-small">${own.length} ${countLabel(own.length,'diario','diarios','개의 일기')}</div></div></li><li><span>${corrected?'✓':'2'}</span><div>${t('Entendé la corrección','첨삭 이해하기')}<div class="app-small">${corrected} ${countLabel(corrected,'respuesta con correcciones','respuestas con correcciones','개의 첨삭')}</div></div></li><li><span>${rewritten?'✓':'3'}</span><div>${t('Volvé a escribir','다시 써 보기')}<div class="app-small">${rewritten} ${countLabel(rewritten,'diario reescrito','diarios reescritos','개의 다시 쓴 일기')}</div></div></li></ol></section><section class="app-aside-section"><h2>${t('Mundos por conocer','함께 배울 사람들')}</h2>${people.map(u=>`<div class="app-person-row">${avatar(u,'sm')}<div><a href="${profileHref(u.id)}">${esc(u.name)}</a><p class="app-small">${language(u.nativeLanguage)} · ${t('aprende','학습')} ${language(u.targetLanguage)}</p></div></div>`).join('')}</section><p class="app-small">Diarito · ${t('Beta de demostración','데모 베타')}<br>${t('Coreano ↔ Español','한국어 ↔ 스페인어')}<br><a href="#guidelines">${t('Cuidemos este espacio','이 공간을 함께 지켜요')}</a></p>`;
  }
  function repliesPreview(postId) {
    const result=S.replies(postId);
    const replies=[...result.comments.map(r=>({...r,kind:'comment'})),...result.corrections.map(r=>({...r,kind:'correction'}))].sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt));
    if(!replies.length)return '';
    return `<div class="app-preview-replies">${replies.slice(0,2).map(r=>{
      const user=S.user(r.authorId), ai=r.source==='ai-demo';
      return `<div class="app-reply-preview"><div class="app-reply-preview__head">${ai?`<span class="app-avatar app-avatar--sm">${icon('sparkles')}</span>`:avatar(user,'sm')}<a href="${ai?'#settings':profileHref(r.authorId)}">${ai?t('IA · demo','AI · 데모'):esc(user?.name||user?.username||t('Miembro','회원'))}</a><time datetime="${esc(r.createdAt)}" title="${esc(fullTime(r.createdAt))}">${time(r.createdAt)}</time>${icon(r.kind==='comment'?'comment':'pencil')}</div>${r.kind==='comment'?`<p>${esc(r.content.length>180?r.content.slice(0,180)+'…':r.content)}</p>`:`<div class="diarito-correction-diff">${r.edits.slice(0,2).map(e=>`<span>${e.original?`<del class="diarito-correction-diff__removed">${esc(e.original)}</del> `:''}${e.replacement?`<ins class="diarito-correction-diff__added">${esc(e.replacement)}</ins>`:''}</span>`).join('<br>')}${r.edits.length>2?`<br><span class="app-small">+${r.edits.length-2} ${countLabel(r.edits.length-2,'cambio','cambios','개 수정')}</span>`:''}</div>`}</div>`;
    }).join('')}<button class="app-read-more" data-action="open" data-id="${esc(postId)}">${t('Ver más','더 보기')} · ${replies.length} ${countLabel(replies.length,'respuesta','respuestas','개의 답글')}</button></div>`;
  }
  function postCard(post) {
    const user=S.user(post.authorId), self=post.authorId===me().id;
    const rs=S.replies(post.id), count=rs.comments.length+rs.corrections.length;
    const content=post.originalContent??post.content;
    const truncated=content.length>540;
    const photo=safePhoto(post.photo);
    const pending=rs.corrections.reduce((n,c)=>n+c.edits.filter(e=>e.status==='pending').length,0);
    return `<article class="app-feed-post" data-post-id="${esc(post.id)}"><header class="app-post-head">${avatar(user)}<div class="app-post-person"><a href="${profileHref(post.authorId)}">${esc(user?.name||user?.username||'Diarito')}</a><div class="app-post-meta"><span>@${esc(user?.username)}</span><span>· ${language(user?.nativeLanguage)} → ${language(user?.targetLanguage)}</span><span>· ${level(user?.level)}</span><time datetime="${esc(post.createdAt)}" title="${esc(fullTime(post.createdAt))}">· ${time(post.createdAt)}</time></div></div><details class="app-menu"><summary aria-label="${t('Opciones del diario','일기 옵션')}">${icon('menu-dots')}</summary><div class="app-menu__panel">${self?`<button data-action="edit" data-id="${esc(post.id)}">${icon('pencil')}${t('Editar / privacidad','편집 / 공개 범위')}</button><button data-action="delete-post" data-id="${esc(post.id)}">${icon('trash')}${t('Eliminar','삭제')}</button>`:`<button data-action="report-post" data-id="${esc(post.id)}">${icon('flag')}${t('Reportar diario','일기 신고')}</button><button data-action="block" data-id="${esc(post.authorId)}">${icon('ban')}${t('Bloquear usuario','사용자 차단')}</button>`}</div></details></header>${post.title?`<h2 class="app-post-title">${esc(post.title)}</h2>`:''}<p class="app-post-text" lang="${esc(post.language)}">${esc(truncated?content.slice(0,540).trimEnd()+'…':content)}</p>${truncated?`<button class="app-read-more" data-action="open" data-id="${esc(post.id)}">${t('Leer el diario completo','일기 전체 읽기')}</button>`:''}${photo?`<img class="app-post-photo" src="${esc(photo)}" alt="${t('Foto que acompaña el diario','일기에 첨부된 사진')}" loading="lazy">`:''}<div class="app-post-tags"><span class="diarito-tag">${language(post.language)}</span><span class="diarito-tag">${visibility(post.visibility)}</span>${post.promptId?`<span class="diarito-tag">${t('Pregunta del día','오늘의 질문')}</span>`:''}${self&&pending?`<span class="diarito-tag">${pending} ${t('por revisar','개 검토 대기')}</span>`:''}${post.rewrites?.length?`<span class="diarito-tag">${t('Reescrito','다시 씀')}</span>`:''}</div><div class="app-post-actions"><button class="diarito-feed-action" data-action="like" data-id="${esc(post.id)}" aria-label="${t('Me gusta','좋아요')}" aria-pressed="${(post.likes||[]).includes(me().id)}">${icon('heart')}<span>${post.likes?.length||0}</span></button><button class="diarito-feed-action" data-action="open" data-id="${esc(post.id)}" aria-label="${t('Ver respuestas','답글 보기')}">${icon('comment')}<span>${count}</span></button><button class="diarito-feed-action" data-action="save-expression" data-id="${esc(post.id)}" aria-label="${t('Guardar expresión','표현 저장')}">${icon('bookmark')}</button><button class="diarito-button diarito-button--ghost app-correct" data-action="${self?'review':'correct'}" data-id="${esc(post.id)}">${icon(self?'check':'pencil')}${self?t('Revisar','검토'):t('Corregir','첨삭')}</button></div>${repliesPreview(post.id)}</article>`;
  }
  function filterTabs(items, current=filter, attr='filter') { return `<div class="app-tabs" role="group" aria-label="${t('Filtrar','필터')}">${items.map(([key,label])=>`<button data-${attr}="${key}" aria-pressed="${key===current}">${label}</button>`).join('')}</div>`; }
  function renderFeed() {
    let posts=S.visiblePosts({visibility:'community'});
    if(filter!=='all')posts=posts.filter(p=>p.language===filter);
    const ownPrivate=lastCreatedId&&S.post(lastCreatedId)?.visibility!=='community'?S.post(lastCreatedId):null;
    return `${heading(t('Nuestros mundos, conectados.','우리의 이야기가 만나는 곳.'),t('Historias reales para practicar. Comunidad de ejemplo en esta demo.','일상으로 연습해요. 데모에는 예시 커뮤니티가 포함되어 있어요.'))}<div class="app-prompt">${icon('sun')}<div><strong>${t('Pregunta del día','오늘의 질문')}</strong><p>${t('¿Qué cosa te hizo feliz hoy?','오늘 당신을 행복하게 한 일은 무엇인가요?')}</p></div><a href="#challenge" class="diarito-button diarito-button--secondary">${t('Responder','답하기')}</a></div>${filterTabs([['all',t('Todos','전체')],['es',t('Español','스페인어')],['ko',t('Coreano','한국어')]])}${ownPrivate?`<div class="app-inline-notice">${t('Tu nuevo diario es privado. Este bloque solo aparece para vos.','새 일기는 비공개예요. 이 영역은 나에게만 보여요.')}</div>${postCard(ownPrivate)}`:''}<div id="feed-list">${posts.length?posts.map(postCard).join(''):empty(t('No hay diarios todavía','아직 일기가 없어요'),t('Probá con otro idioma o compartí tu primera historia.','다른 언어를 선택하거나 첫 이야기를 나눠 주세요.'))}</div><p class="app-small" style="text-align:center;margin-top:1.5rem">${posts.length} ${countLabel(posts.length,'diario · del más reciente al más antiguo','diarios · del más reciente al más antiguo','개의 일기 · 최신순')}</p>`;
  }
  function renderDiary() {
    let posts=S.visiblePosts({authorId:me().id});
    if(filter!=='all')posts=posts.filter(p=>p.visibility===filter);
    return heading(t('Mi diario','내 일기'),t('Tu historia original, tus cambios y lo que aprendés.','처음 쓴 이야기, 받은 첨삭, 그리고 배운 것들.'),`<a href="#write" class="diarito-button diarito-button--primary">${icon('plus')}${t('Escribir','쓰기')}</a>`)+filterTabs([['all',t('Todos','전체')],['private',t('Privados','비공개')],['ai',t('Solo IA','AI만')],['community',t('Comunidad','커뮤니티')]])+(posts.length?posts.map(postCard).join(''):empty(t('Todo empieza con unas palabras','몇 마디로 시작해 보세요'),t('Podés guardar un diario solo para vos o compartirlo cuando estés lista.','나만의 일기로 간직하거나 준비가 되면 나눌 수 있어요.'),`<a href="#challenge" class="diarito-button diarito-button--primary">${t('Responder la pregunta del día','오늘의 질문에 답하기')}</a>`));
  }
  function draftKey(id, challenge) { return `diarito-draft-${me().id}-${id|| (challenge?'challenge':'diary')}`; }
  function readDraft(key) {
    let value;
    try {value=drafts.has(key)?drafts.get(key):JSON.parse(localStorage.getItem(key)||'null');}catch{return null;}
    if(!value||typeof value!=='object'||typeof value.content!=='string'||typeof value.title!=='string'||!['es','ko'].includes(value.language)||!['private','ai','community'].includes(value.visibility))return null;
    return {...value,photo:safePhoto(value.photo)};
  }
  function captureDraft(form) {
    if(!form||form.dataset.saved==='true'||!form.dataset.draftKey)return;
    const data=Object.fromEntries(new FormData(form));
    const draft={title:data.title,content:data.content,language:data.language,visibility:data.visibility,communityConfirmed:!!data.communityConfirmed,photo:editorPhoto};
    drafts.set(form.dataset.draftKey,draft);
    const status=$('.app-draft-status',form);
    try {localStorage.setItem(form.dataset.draftKey,JSON.stringify(draft));if(status)status.textContent=t('Borrador guardado en este navegador','이 브라우저에 초안을 저장했어요');}
    catch {if(status)status.textContent=t('Borrador temporal: no queda espacio. Guardá sin foto o exportá una copia.','임시 초안: 저장 공간이 부족해요. 사진 없이 저장하거나 백업해 주세요.');}
  }
  function renderEditor(id, challenge=false) {
    const post=id?S.post(id):null;
    if(id&&(!post||post.authorId!==me().id))return empty(t('No encontramos ese diario','일기를 찾을 수 없어요'),t('Volvé a tu diario para elegir otra entrada.','내 일기에서 다른 글을 선택해 주세요.'));
    const hasCorrections=post&&(db().corrections.some(c=>c.postId===id)||post.rewrites?.length>0);
    const key=draftKey(id,challenge), saved=readDraft(key);
    const data=saved||{title:post?.title||'',content:post?.originalContent??post?.content??'',language:post?.language||me().targetLanguage,visibility:post?.visibility||(challenge?'community':'private'),photo:post?.photo||'',communityConfirmed:false};
    if(hasCorrections)data.content=post.originalContent??post.content;
    editorPhoto=data.photo||''; editorToken=key;
    return `${challenge?`<div class="app-steps-line"><span>${t('Tu cuenta','계정')}</span><span>${t('Tu perfil','프로필')}</span><span class="is-active">${t('Tu primer diarito','첫 일기')}</span></div>`:''}${heading(id?t('Editar diario','일기 편집'):challenge?t('Un pequeño momento. Tu primer diarito.','작은 순간으로 시작하는 첫 일기.'):t('Escribí sobre tu día.','오늘의 이야기를 써 보세요.'),challenge?t('¿Qué cosa te hizo feliz hoy? Contalo en el idioma que estás aprendiendo.','오늘 무엇이 당신을 행복하게 했나요? 배우고 있는 언어로 써 보세요.'):t('No hace falta que salga perfecto. Escribí con las palabras que tenés.','완벽할 필요 없어요. 지금 아는 말로 써 보세요.'))}<form id="diary-form" class="app-form" data-draft-key="${esc(key)}" data-post-id="${esc(id||'')}" data-challenge="${challenge}"><label class="diarito-field"><span class="diarito-label">${t('Título','제목')} <span class="app-muted">(${t('opcional','선택')})</span></span><input class="diarito-input diarito-input--compact" name="title" maxlength="120" value="${esc(data.title)}" placeholder="${t('Un momento que quiero recordar','기억하고 싶은 순간')}"></label><label class="diarito-field"><span class="diarito-label">${t('Tu diario','일기 내용')}</span><textarea class="diarito-textarea app-editor-text" name="content" maxlength="12000" required ${hasCorrections?'readonly':''} placeholder="${data.language==='ko'?'오늘은…':'Hoy…'}" lang="${esc(data.language)}">${esc(data.content)}</textarea></label>${hasCorrections?`<p class="app-inline-notice">${t('Este texto ya tiene correcciones o reescrituras. El original se conserva: podés ajustar el título, la foto o la privacidad, y escribir una nueva versión desde Revisar.','이미 첨삭이나 다시 쓴 글이 있어 원문은 보존돼요. 제목, 사진, 공개 범위는 바꿀 수 있고 검토에서 새 버전을 쓸 수 있어요.')}</p>`:''}<div class="app-form-row"><label class="diarito-field"><span class="diarito-label">${t('Idioma del diario','일기 언어')}</span><select class="diarito-select diarito-select--compact" name="language"><option value="ko" ${data.language==='ko'?'selected':''}>${language('ko')}</option><option value="es" ${data.language==='es'?'selected':''}>${language('es')}</option></select></label><label class="diarito-field"><span class="diarito-label">${t('¿Quién puede verlo?','누가 볼 수 있나요?')}</span><select class="diarito-select diarito-select--compact" name="visibility">${['private','ai','community'].map(v=>`<option value="${v}" ${v===data.visibility?'selected':''}>${visibility(v)}</option>`).join('')}</select></label></div><div id="privacy-help" class="app-inline-notice"></div><label class="diarito-choice" id="community-consent" ${data.visibility!=='community'?'hidden':''}><input type="checkbox" name="communityConfirmed" ${data.communityConfirmed?'checked':''}><span>${t('Entiendo que otros miembros podrán leer este diario y sugerir correcciones. No incluí información sensible.','다른 회원이 이 일기를 읽고 첨삭할 수 있음을 이해했어요. 민감한 정보를 포함하지 않았어요.')}</span></label><label class="diarito-field"><span class="diarito-label">${t('Una foto para tu historia','이야기에 담을 사진')} (${t('opcional','선택')})</span><input class="diarito-input" type="file" id="diary-photo" accept="image/png,image/jpeg,image/webp"><span class="app-form-help">${t('JPG, PNG o WebP · hasta 5 MB. Se reduce para cuidar el espacio.','JPG, PNG, WebP · 최대 5MB. 저장 공간에 맞게 줄여요.')}</span></label><div id="photo-preview">${photoPreview()}</div><p class="app-error" id="editor-error" role="alert" hidden></p><div class="app-form-footer"><div><div class="app-small" id="word-count"></div><div class="app-small app-draft-status">${saved?t('Borrador recuperado','초안을 불러왔어요'):t('El borrador se guarda mientras escribís','작성 중에 초안이 저장돼요')}</div></div><button class="diarito-button diarito-button--primary" type="submit">${t('Guardar diario','일기 저장')}</button></div>${!id&&!data.content?`<button type="button" class="diarito-button diarito-button--ghost" data-action="sample-text">${t('Usar un texto de ejemplo para probar la corrección','첨삭을 체험할 예문 사용')}</button>`:''}</form>`;
  }
  function photoPreview() { return editorPhoto?`<div class="app-photo-preview"><img src="${esc(safePhoto(editorPhoto))}" alt="${t('Vista previa de tu foto','사진 미리보기')}"><button type="button" class="diarito-button diarito-button--ghost" data-action="remove-photo">${t('Quitar foto','사진 제거')}</button></div>`:''; }
  function updatePrivacy() {
    const form=$('#diary-form');if(!form)return;
    const v=form.elements.visibility.value;
    $('#privacy-help').textContent = v==='community'?t('Comunidad: tu historia podrá recibir comentarios y correcciones de otras personas. Podés cambiar la privacidad después.','커뮤니티: 다른 사람이 댓글과 첨삭을 남길 수 있어요. 공개 범위는 나중에 바꿀 수 있어요.'):v==='ai'?t('Solo IA: tu diario sigue privado. En esta demo la revisión es una simulación local; no se envía a una IA.','AI만: 일기는 비공개로 유지돼요. 이 데모는 로컬 시뮬레이션이며 AI에 전송하지 않아요.'):t('Solo yo: este diario no aparece en la comunidad ni se analiza con IA.','나만 보기: 커뮤니티에 표시되지 않고 AI 검토도 하지 않아요.');
    $('#community-consent').hidden=v!=='community';
    form.elements.communityConfirmed.required=v==='community';
  }
  async function resizePhoto(file, max=1200) {
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024)throw new Error('PHOTO_INVALID');
    const src=URL.createObjectURL(file);
    try {
      const img=new Image();img.src=src;await img.decode();
      if(!img.width||!img.height)throw new Error('PHOTO_INVALID');
      let scale=Math.min(1,max/Math.max(img.width,img.height));
      const canvas=document.createElement('canvas'),context=canvas.getContext('2d');
      if(!context)throw new Error('PHOTO_INVALID');
      for(let attempt=0;attempt<6;attempt++){
        canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));
        context.fillStyle='#ffffff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(img,0,0,canvas.width,canvas.height);
        for(const quality of [.78,.65,.5]){const encoded=canvas.toDataURL('image/jpeg',quality);if(encoded.length<=350000&&safePhoto(encoded))return encoded;}
        scale*=.75;
      }
      throw new Error('PHOTO_INVALID');
    }
    finally {URL.revokeObjectURL(src);}
  }
  function bindEditor() {
    const form=$('#diary-form');if(!form)return;
    updatePrivacy();
    const count=()=>{$('#word-count').textContent=`${form.elements.content.value.trim().length} / 12,000 ${t('caracteres','자')}`;};count();
    form.addEventListener('input',()=>{captureDraft(form);count();});
    form.elements.visibility.onchange=()=>{updatePrivacy();captureDraft(form);};
    form.elements.language.onchange=()=>{form.elements.content.lang=form.elements.language.value;captureDraft(form);};
    $('#diary-photo').onchange=async e=>{
      const file=e.target.files[0], token=editorToken,request=++photoRequest;if(!file)return;
      const button=$('[type=submit]',form);button.disabled=true;form.dataset.photoBusy='true';
      try {const value=await resizePhoto(file);if(token!==editorToken||request!==photoRequest||!form.isConnected)return;editorPhoto=value;$('#photo-preview').innerHTML=photoPreview();captureDraft(form);}
      catch(error) {if(form.isConnected){toast(errorMessage(error));e.target.value='';}}
      finally {if(form.isConnected&&request===photoRequest){form.dataset.photoBusy='false';button.disabled=false;}}
    };
    form.onsubmit=e=>{
      e.preventDefault();if(form.dataset.saved==='true'||form.dataset.photoBusy==='true')return;const button=$('[type=submit]',form);button.disabled=true;
      const values=Object.fromEntries(new FormData(form));
      const payload={title:values.title.trim(),content:form.elements.content.readOnly?values.content:values.content.trim(),language:values.language,visibility:values.visibility,photo:editorPhoto,communityConfirmed:!!values.communityConfirmed};
      try {
        let post;if(form.dataset.postId){post=S.updatePost(form.dataset.postId,payload);}else{if(form.dataset.challenge==='true')payload.promptId='daily-1';post=S.createPost(payload);}
        // A hashchange/beforeunload can still see this form after a successful save.
        // Mark it first so navigation cannot resurrect the consumed draft.
        form.dataset.saved='true';drafts.delete(form.dataset.draftKey);
        try{localStorage.removeItem(form.dataset.draftKey);}catch{/* The diary is already persisted. Do not invite a duplicate submission. */}
        lastCreatedId=post.id;
        navigate('feed');toast('Tu diarito quedó guardado. Ya podés revisarlo y volver a escribir.','일기를 저장했어요. 첨삭을 검토하고 다시 써 보세요.');
      } catch(error) {const el=$('#editor-error');el.textContent=errorMessage(error);el.hidden=false;button.disabled=false;}
    };
  }
  function renderProfile(id) {
    const user=id?S.user(id):me(); if(!user)return empty(t('Perfil no disponible','프로필을 찾을 수 없어요'),t('Este usuario no está disponible en la demo.','데모에서 이 사용자를 찾을 수 없어요.'));
    const self=user.id===me().id;
    if(!self&&!memberAvailable(user.id)){
      const blocked=(me().blockedUserIds||[]).includes(user.id);
      return empty(t('Perfil no disponible','프로필을 볼 수 없어요'),blocked?t('Este miembro está bloqueado. Podés desbloquearlo para volver a ver sus publicaciones.','이 회원을 차단했어요. 차단을 해제하면 게시물을 다시 볼 수 있어요.'):t('Este perfil no está disponible para interactuar.','이 프로필과 지금 소통할 수 없어요.'),blocked?actionButton('unblock',t('Desbloquear','차단 해제'),'secondary',`data-id="${esc(user.id)}"`):'');
    }
    const all=S.visiblePosts({authorId:user.id}), posts=self?all:all.filter(p=>p.visibility==='community');
    const corrections=db().corrections.filter(c=>c.authorId===user.id&&c.source==='human'&&!c.hidden&&S.post(c.postId));
    const connection=db().connections.find(c=>(c.fromId===me().id&&c.toId===user.id)||(c.toId===me().id&&c.fromId===user.id));
    const blocked=(me().blockedUserIds||[]).includes(user.id);
    return `<header class="app-profile-header"><div class="app-profile-top">${avatar(user,'lg')}<div class="app-actions">${self?`<a class="diarito-button diarito-button--secondary" href="#settings">${t('Editar perfil','프로필 편집')}</a>`:`${actionButton('connect',connection?.status==='accepted'?t('Conectados','친구'):connection?t('Solicitud pendiente','요청 대기'):t('Conectar','친구 요청'),'secondary',`data-id="${esc(user.id)}" ${connection?'disabled':''}`)}${actionButton(blocked?'unblock':'block',blocked?t('Desbloquear','차단 해제'):t('Bloquear','차단'),'ghost',`data-id="${esc(user.id)}"`)}`}</div></div><h1>${esc(user.name||user.username)}</h1><div class="app-small">@${esc(user.username)} ${user.fixture?`· ${t('Perfil de ejemplo','예시 프로필')}`:''}</div>${user.bio?`<p>${esc(user.bio)}</p>`:''}<p>${language(user.nativeLanguage)} · ${t('Aprendiendo','학습 중')} ${language(user.targetLanguage)} · ${level(user.level)}</p><div class="app-profile-stats"><div><strong>${posts.length}</strong>${countLabel(posts.length,'diario','diarios','일기')}</div><div><strong>${corrections.length}</strong>${countLabel(corrections.length,'aporte','aportes','첨삭')}</div><div><strong>${posts.filter(p=>p.rewrites?.length).length}</strong>${countLabel(posts.filter(p=>p.rewrites?.length).length,'reescritura','reescrituras','다시 쓰기')}</div></div></header>${filterTabs([['diaries',self?t('Mis diarios','내 일기'):t('Diarios públicos','공개 일기')],['corrections',t('Correcciones dadas','남긴 첨삭')]],profileTab,'profile-tab')}${profileTab==='diaries'?(posts.length?posts.map(postCard).join(''):empty(t('Todavía no hay diarios','아직 일기가 없어요'),self?t('Escribí tu primera historia.','첫 이야기를 써 보세요.'):t('Los diarios privados solo los ve su autor.','비공개 일기는 작성자만 볼 수 있어요.'))):(corrections.length?corrections.map(c=>`<div class="app-section"><p class="app-small">${t('Corrección en','첨삭한 일기')} ${esc(S.post(c.postId)?.title||t('un diario','제목 없는 일기'))} · ${time(c.createdAt)}</p><div class="diarito-correction-diff">${c.edits.map(e=>`<del class="diarito-correction-diff__removed">${esc(e.original)}</del> <ins class="diarito-correction-diff__added">${esc(e.replacement)}</ins>`).join('<br>')}</div><button class="app-read-more" data-action="open" data-id="${esc(c.postId)}">${t('Ver diario','일기 보기')}</button></div>`).join(''):empty(t('Compartí lo que sabés','내 언어를 나눠 주세요'),t('Tus correcciones a otros diarios aparecerán acá.','다른 일기에 남긴 첨삭이 여기에 표시돼요.')))}`;
  }
  function renderCollections(id) {
    const collections=db().collections.filter(c=>c.userId===me().id);
    if(!id)return `${heading(t('Mis colecciones','내 컬렉션'),t('Palabras y expresiones que querés hacer tuyas.','내 것으로 만들고 싶은 단어와 표현.'),actionButton('new-collection',`${icon('plus')}${t('Crear','만들기')}`,'primary'))}${collections.length?`<div class="app-collection-grid">${collections.map(c=>`<button class="app-collection" data-action="collection" data-id="${esc(c.id)}">${icon('folder')}<strong>${esc(c.name)}</strong><span class="app-small">${c.words.length} ${countLabel(c.words.length,'expresión','expresiones','개의 표현')}</span></button>`).join('')}</div>`:empty(t('Guardá una expresión que te guste','마음에 드는 표현을 저장해 보세요'),t('Creá una colección y agregá palabras desde cualquier diario o manualmente.','컬렉션을 만들고 일기에서 표현을 저장하거나 직접 추가해 보세요.'))}<p class="app-small" style="margin-top:1.5rem">${t('Un cuaderno simple de expresiones. Las tarjetas y la repetición espaciada quedan para más adelante.','간단한 표현 노트예요. 플래시카드와 간격 반복은 추후 제공될 예정이에요.')}</p>`;
    const collection=collections.find(c=>c.id===id);if(!collection)return empty(t('Colección no encontrada','컬렉션을 찾을 수 없어요'),'');
    return `<a class="app-read-more" href="#collections">${t('Todas las colecciones','전체 컬렉션')}</a>${heading(collection.name,`${collection.words.length} ${countLabel(collection.words.length,'expresión guardada','expresiones guardadas','개의 저장한 표현')}`,actionButton('add-word',`${icon('plus')}${t('Agregar','추가')}`,'primary',`data-id="${esc(id)}"`))}<div class="app-actions">${actionButton('rename-collection',t('Renombrar','이름 바꾸기'),'ghost',`data-id="${esc(id)}"`)}${actionButton('delete-collection',t('Eliminar colección','컬렉션 삭제'),'ghost',`data-id="${esc(id)}"`)}</div>${collection.words.length?collection.words.map(w=>`<article class="app-word"><header><h3 lang="${esc(w.language)}">${esc(w.term)}</h3><button class="diarito-button diarito-button--icon" data-action="delete-word" data-id="${esc(id)}" data-word-id="${esc(w.id)}" aria-label="${t('Eliminar expresión','표현 삭제')}">${icon('trash')}</button></header><p>${esc(w.meaning)}</p>${w.example?`<blockquote>${esc(w.example)}</blockquote>`:''}<span class="diarito-tag">${language(w.language)}</span>${w.postId&&S.post(w.postId)?`<button class="app-read-more" data-action="open" data-id="${esc(w.postId)}">${t('Ver contexto','문맥 보기')}</button>`:''}</article>`).join(''):empty(t('Tu primera expresión te espera','첫 표현을 저장해 보세요'),t('Podés guardar una palabra, una frase y el contexto en el que la aprendiste.','단어, 문장, 배운 문맥을 함께 기록할 수 있어요.'))}`;
  }
  function collectionForm(id) {
    const collection=id?db().collections.find(c=>c.id===id&&c.userId===me().id):null;
    utility(id?t('Renombrar colección','컬렉션 이름 바꾸기'):t('Nueva colección','새 컬렉션'),`<form class="app-form"><label class="diarito-field"><span class="diarito-label">${t('Nombre','이름')}</span><input class="diarito-input diarito-input--compact" name="name" required maxlength="60" value="${esc(collection?.name||'')}" placeholder="${t('Cosas de todos los días','매일 쓰는 표현')}"></label><p class="app-error" role="alert" hidden></p><button type="submit" class="diarito-button diarito-button--primary">${t('Guardar','저장')}</button></form>`,dialog=>{$('form',dialog).onsubmit=e=>{e.preventDefault();try{const name=new FormData(e.target).get('name').trim();id?S.renameCollection(id,name):S.createCollection(name);dialog.close();render();}catch(err){$('.app-error',dialog).hidden=false;$('.app-error',dialog).textContent=errorMessage(err);}};});
  }
  function saveWord(text='',postId='',collectionId='') {
    if(!me())return;
    const collections=db().collections.filter(c=>c.userId===me().id);
    utility(t('Guardar una expresión','표현 저장'),`<form class="app-form"><label class="diarito-field"><span class="diarito-label">${t('Palabra o expresión','단어 또는 표현')}</span><input class="diarito-input" name="term" required maxlength="300" value="${esc(text)}"></label><label class="diarito-field"><span class="diarito-label">${t('Significado / tu nota','뜻 / 내 메모')}</span><input class="diarito-input" name="meaning" maxlength="500"></label><label class="diarito-field"><span class="diarito-label">${t('Ejemplo o contexto','예문이나 문맥')}</span><textarea class="diarito-textarea" style="min-height:5rem" name="example" maxlength="1000"></textarea></label><div class="app-form-row"><label class="diarito-field"><span class="diarito-label">${t('Idioma','언어')}</span><select name="language" class="diarito-select">${['ko','es'].map(l=>`<option value="${l}" ${l===(S.post(postId)?.language||me().targetLanguage)?'selected':''}>${language(l)}</option>`).join('')}</select></label><label class="diarito-field"><span class="diarito-label">${t('Colección','컬렉션')}</span><select class="diarito-select" name="collectionId">${collections.map(c=>`<option value="${esc(c.id)}" ${c.id===collectionId?'selected':''}>${esc(c.name)}</option>`).join('')}<option value="new">${t('Crear una colección','새 컬렉션 만들기')}</option></select></label></div><label class="diarito-field" id="new-collection-field" ${collections.length?'hidden':''}><span class="diarito-label">${t('Nombre de la colección','컬렉션 이름')}</span><input class="diarito-input" name="collectionName" maxlength="60" value="${t('Mis primeras palabras','나의 첫 단어')}"></label><p class="app-error" role="alert" hidden></p><button class="diarito-button diarito-button--primary" type="submit">${t('Guardar expresión','표현 저장')}</button></form>`,dialog=>{
      const form=$('form',dialog);form.elements.collectionId.onchange=()=>{$('#new-collection-field',dialog).hidden=form.elements.collectionId.value!=='new';};
      form.onsubmit=e=>{e.preventDefault();const values=Object.fromEntries(new FormData(form));try {let id=values.collectionId;if(id==='new')id=S.createCollection(values.collectionName.trim()).id;S.addWord(id,{term:values.term.trim(),meaning:values.meaning.trim(),example:values.example.trim(),language:values.language,postId:postId||null});dialog.close();toast('Expresión guardada en tu colección.','컬렉션에 표현을 저장했어요.');if(route.startsWith('collections'))render();}catch(err){$('.app-error',dialog).hidden=false;$('.app-error',dialog).textContent=errorMessage(err);}};
    });
  }
  function renderConnections() {
    const state=db(),all=state.connections.filter(c=>(c.fromId===me().id||c.toId===me().id)&&memberAvailable(c.fromId===me().id?c.toId:c.fromId,state));
    const pending=all.filter(c=>c.toId===me().id&&c.status==='pending');
    const accepted=all.filter(c=>c.status==='accepted');
    const sent=all.filter(c=>c.fromId===me().id&&c.status==='pending');
    const row=(c,actions=false)=>{const u=S.user(c.fromId===me().id?c.toId:c.fromId);return `<div class="app-person-row">${avatar(u)}<div><a href="${profileHref(u.id)}">${esc(u.name||u.username)}</a><p class="app-small">@${esc(u.username)}</p></div>${actions?`${actionButton('accept-connection',t('Aceptar','수락'),'primary',`data-id="${esc(c.id)}"`)}${actionButton('decline-connection',t('Ignorar','거절'),'ghost',`data-id="${esc(c.id)}"`)}`:`<span class="app-small">${c.status==='accepted'?t('Conectados','친구'):t('Pendiente','대기 중')}</span>`}</div>`;};
    return `${heading(t('Conexiones','친구'),t('Conocé a las personas detrás de las historias.','이야기 너머의 사람들을 만나 보세요.'))}${pending.length?`<section class="app-section"><h2>${t('Solicitudes recibidas','받은 요청')}</h2>${pending.map(c=>row(c,true)).join('')}</section>`:''}<section class="app-section"><h2>${t('Tus conexiones','내 친구')}</h2>${accepted.length?accepted.map(c=>row(c)).join(''):empty(t('Un idioma también conecta','언어는 사람을 이어 줘요'),t('Visitá un perfil y enviá una solicitud de conexión. En la demo, la otra cuenta puede aceptarla desde este navegador.','프로필에서 친구 요청을 보내세요. 데모에서는 같은 브라우저의 다른 계정으로 로그인해 수락할 수 있어요.'))}</section>${sent.length?`<section class="app-section"><h2>${t('Solicitudes enviadas','보낸 요청')}</h2>${sent.map(c=>row(c)).join('')}</section>`:''}<p class="app-small">${t('En V1, conectar no cambia la privacidad de los diarios. Las opciones son Solo yo, Solo IA y Comunidad.','V1에서는 친구 관계가 일기 공개 범위를 바꾸지 않아요. 나만 보기, AI만, 커뮤니티 중에서 선택해요.')}</p>`;
  }
  function leaderboardMarkup() {
    const posts=S.visiblePosts({visibility:'community'});
    const users=db().users.filter(u=>!u.suspended&&u.role!=='admin'&&!(me()?.blockedUserIds||[]).includes(u.id)).map(u=>({user:u,count:posts.filter(p=>p.authorId===u.id).length})).filter(r=>r.count>0).sort((a,b)=>b.count-a.count||a.user.username.localeCompare(b.user.username));
    return `<table class="app-table"><thead><tr><th scope="col">#</th><th scope="col">${t('Miembro','회원')}</th><th scope="col">${t('Diarios públicos','공개 일기')}</th></tr></thead><tbody>${users.map((r,i)=>`<tr><td>${i+1}</td><td><div class="app-person-row">${avatar(r.user,'sm')}<div><a href="${profileHref(r.user.id)}">${esc(r.user.name||r.user.username)}</a><p class="app-small">@${esc(r.user.username)}</p></div></div></td><td>${r.count}</td></tr>`).join('')}</tbody></table>`;
  }
  function renderLeaderboard() {return `${heading(t('Cada historia cuenta.','이야기 하나하나가 소중해요.'),t('Leaderboard de actividad · diarios compartidos en esta demo.','활동 리더보드 · 데모에서 공유한 일기 수.'))}<p class="app-inline-notice">${t('Un vistazo a quienes están escribiendo. No califica el nivel de idioma ni la calidad de las correcciones. Perfiles y actividad iniciales de ejemplo.','함께 쓰는 사람들을 만나 보세요. 언어 실력이나 첨삭 품질을 평가하지 않아요. 초기 프로필과 활동은 예시예요.')}</p>${leaderboardMarkup()}`;}
  function notificationText(n) {
    const actor=S.user(n.actorId); const name=actor?.name||actor?.username||'Diarito';
    const labels={correction:t('sugirió una corrección en tu diario.','님이 내 일기에 첨삭을 남겼어요.'),comment:t('comentó tu diario.','님이 내 일기에 댓글을 남겼어요.'),accepted:t('aceptó tu corrección.','님이 내 첨삭을 수락했어요.'),correction_accepted:t('aceptó tu corrección.','님이 내 첨삭을 수락했어요.'),connection_request:t('quiere conectar con vos.','님이 친구 요청을 보냈어요.'),connection_accepted:t('aceptó tu solicitud.','님이 친구 요청을 수락했어요.'),rewrite:t('volvió a escribir su diario.','님이 일기를 다시 썼어요.')};
    return `${name} ${labels[n.type]||t('tiene una novedad para vos.','님의 새 소식이 있어요.')}`;
  }
  function renderNotifications() {
    const notes=visibleNotifications().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
    return `${heading(t('Notificaciones','알림'),t('Los pequeños intercambios que te ayudan a aprender.','배움을 돕는 작은 교류들.'),actionButton('read-notifications',t('Marcar leídas','모두 읽음'),'ghost'))}${notes.length?notes.map(n=>`<article class="app-notification ${n.read?'':'is-unread'}">${avatar(S.user(n.actorId),'sm')}<div><p>${esc(notificationText(n))}</p><time class="app-small" datetime="${esc(n.createdAt)}" title="${esc(fullTime(n.createdAt))}">${time(n.createdAt)}</time>${n.postId&&S.post(n.postId)?`<button class="app-read-more" data-action="open" data-id="${esc(n.postId)}">${t('Ver diario','일기 보기')}</button>`:n.type.startsWith('connection')?`<a class="app-read-more" href="#connections">${t('Ver conexiones','친구 보기')}</a>`:''}</div></article>`).join(''):empty(t('Por acá está tranquilo','아직 조용해요'),t('Te avisaremos cuando alguien comente, corrija o acepte una corrección tuya.','댓글, 첨삭, 첨삭 수락 소식을 여기에서 확인할 수 있어요.'))}`;
  }
  function report(kind,id) {
    utility(t('Reportar contenido','콘텐츠 신고'),`<form class="app-form"><p>${t('Contanos qué pasa. El reporte se revisa desde la cuenta moderadora de esta demo.','문제가 무엇인지 알려 주세요. 데모 관리자 계정에서 신고를 검토할 수 있어요.')}</p><label class="diarito-field"><span class="diarito-label">${t('Motivo','신고 이유')}</span><select name="reason" class="diarito-select"><option value="harassment">${t('Acoso o falta de respeto','괴롭힘 / 무례함')}</option><option value="private-info">${t('Información personal','개인정보')}</option><option value="spam">${t('Spam','스팸')}</option><option value="inappropriate">${t('Contenido inapropiado','부적절한 콘텐츠')}</option><option value="other">${t('Otro motivo','기타')}</option></select></label><label class="diarito-field"><span class="diarito-label">${t('Detalles (opcional)','상세 내용 (선택)')}</span><textarea name="details" class="diarito-textarea" maxlength="1000"></textarea></label><p class="app-error" role="alert" hidden></p><button class="diarito-button diarito-button--primary" type="submit">${t('Enviar reporte','신고 제출')}</button></form>`,dialog=>{$('form',dialog).onsubmit=e=>{e.preventDefault();const v=Object.fromEntries(new FormData(e.target));try{S.report(kind,id,`${v.reason}${v.details.trim()?': '+v.details.trim():''}`);dialog.close();toast('Reporte enviado para revisión.','검토할 수 있도록 신고를 보냈어요.');}catch(err){$('.app-error',dialog).hidden=false;$('.app-error',dialog).textContent=errorMessage(err);}};});
  }
  function block(id) {confirmAction(t('Bloquear a este miembro','이 회원 차단'),t('Dejarás de ver sus diarios y respuestas, y no podrá interactuar con vos en esta demo. Podés desbloquearlo en Configuración.','이 회원의 일기와 답글이 숨겨지고 데모에서 서로 소통할 수 없어요. 설정에서 해제할 수 있어요.'),()=>{S.blockUser(id);window.DEntry?.close();toast('Usuario bloqueado.','사용자를 차단했어요.');},t('Bloquear','차단'));}
  function profileGoalFields(user) {
    const selected=[...new Set((user.goals||[]).filter(g=>typeof g==='string').map(goalKey))];
    const options=goalOptions.map(([key,es,ko])=>[key,t(es,ko)]);
    for(const key of selected)if(!options.some(([value])=>value===key))options.push([key,key]);
    return `<fieldset style="border:0;padding:0;margin:0;display:grid;gap:.6rem"><legend class="diarito-label" style="margin-bottom:.5rem">${t('Tus objetivos de aprendizaje','학습 목표')}</legend>${options.map(([key,label])=>`<label class="diarito-choice"><input type="checkbox" name="goals" value="${esc(key)}" ${selected.includes(key)?'checked':''}><span>${esc(label)}</span></label>`).join('')}</fieldset><label class="diarito-field"><span class="diarito-label">${t('Agregar otro objetivo (opcional)','다른 목표 추가 (선택)')}</span><input name="customGoal" class="diarito-input diarito-input--compact" maxlength="100" placeholder="${t('Algo que querés poder expresar…','표현하고 싶은 것이 있나요?')}"><span class="app-form-help">${t('Hasta 100 caracteres. Tus objetivos seleccionados se conservan.','100자까지 입력할 수 있어요. 선택한 목표는 그대로 보관돼요.')}</span></label>`;
  }
  function renderSettings() {
    const user=me();const blocked=(user.blockedUserIds||[]).map(id=>S.user(id)).filter(Boolean);
    return `${heading(t('Tu cuenta, a tu manera.','나에게 맞는 계정 설정.'),t('Perfil y preferencias de esta demo.','데모 프로필과 환경 설정.'))}<form id="profile-form" class="app-form"><div class="app-person-row">${avatar(user,'lg')}<div><strong>@${esc(user.username)}</strong><p class="app-small">${esc(user.email)}</p></div></div><label class="diarito-field"><span class="diarito-label">${t('Nombre','이름')}</span><input class="diarito-input diarito-input--compact" name="name" required maxlength="60" value="${esc(user.name)}"></label><label class="diarito-field"><span class="diarito-label">${t('Sobre vos','소개')}</span><textarea class="diarito-textarea" name="bio" maxlength="300" style="min-height:5rem">${esc(user.bio)}</textarea></label><div class="app-form-row"><label class="diarito-field"><span class="diarito-label">${t('Idioma nativo','모국어')}</span><select class="diarito-select diarito-select--compact" name="nativeLanguage">${['es','ko'].map(l=>`<option value="${l}" ${l===user.nativeLanguage?'selected':''}>${language(l)}</option>`).join('')}</select></label><label class="diarito-field"><span class="diarito-label">${t('Nivel aproximado','현재 수준')}</span><select class="diarito-select diarito-select--compact" name="level">${['beginner','intermediate','advanced'].map(l=>`<option value="${l}" ${l===user.level?'selected':''}>${level(l)}</option>`).join('')}</select></label></div><p class="app-form-help">${t('En esta beta, el idioma de práctica es el otro idioma del par español / coreano.','이 베타에서는 스페인어와 한국어 중 모국어가 아닌 언어를 연습해요.')}</p>${profileGoalFields(user)}<label class="diarito-field"><span class="diarito-label">${t('Cómo te gusta practicar','좋아하는 연습 방식')}</span><select name="learnerType" class="diarito-select diarito-select--compact">${[['writing',t('Escribiendo y reflexionando','쓰고 생각하기')],['conversation',t('Conversando con personas','사람들과 대화하기')],['examples',t('Con ejemplos y contexto','예문과 문맥으로 배우기')],['exploring',t('Todavía estoy descubriéndolo','아직 알아가는 중이에요')]].map(([key,label])=>`<option value="${key}" ${(user.learnerType==='mixed'?'exploring':user.learnerType)===key?'selected':''}>${label}</option>`).join('')}</select></label><label class="diarito-field"><span class="diarito-label">${t('Cambiar foto (opcional)','사진 바꾸기 (선택)')}</span><input class="diarito-input" type="file" name="photo" accept="image/png,image/jpeg,image/webp"></label><p class="app-error" role="alert" hidden></p><div><button class="diarito-button diarito-button--primary" type="submit">${t('Guardar perfil','프로필 저장')}</button></div></form><section class="app-section"><h2>${t('Cuidar tu espacio','내 공간 지키기')}</h2>${blocked.length?blocked.map(u=>`<div class="app-person-row">${avatar(u,'sm')}<div>@${esc(u.username)}</div>${actionButton('unblock',t('Desbloquear','차단 해제'),'secondary',`data-id="${esc(u.id)}"`)}</div>`).join(''):`<p class="app-small">${t('No tenés usuarios bloqueados.','차단한 사용자가 없어요.')}</p>`}</section><section class="app-section"><h2>${t('Tu demo, también mañana','내일도 이어지는 데모')}</h2><p class="app-form-help">${t('Los datos se guardan en este navegador y esta dirección. Exportá una copia para conservarlos o llevarlos a otro equipo. La copia contiene todas las cuentas y diarios locales, incluidos los privados: guardala para vos.','데이터는 이 브라우저와 주소에 저장돼요. 다른 기기로 옮기려면 백업을 내보내세요. 백업에는 비공개 일기를 포함한 모든 로컬 계정과 일기가 있으므로 개인적으로 보관해 주세요.')}</p><div class="app-actions" style="margin-top:1rem">${actionButton('export',`${icon('download')}${t('Exportar copia','백업 내보내기')}`)}${actionButton('import',`${icon('upload')}${t('Importar copia','백업 가져오기')}`)}<input id="backup-file" type="file" accept="application/json,.json" hidden></div></section><section class="app-section"><h2>${t('Sobre esta versión','이 버전 안내')}</h2><p class="app-form-help">${t('Diarito 2.20.0 · MVP V1 demo. Registro, diarios, interacciones y moderación funcionan de forma local. La IA es una simulación con ejemplos; no analiza cualquier texto. No hay correo de verificación, recuperación por email ni sincronización entre dispositivos. Usá una contraseña exclusiva para la demo.','Diarito 2.20.0 · MVP V1 데모. 회원가입, 일기, 소통, 관리 기능은 로컬에서 동작해요. AI는 예문 기반 시뮬레이션이며 모든 글을 분석하지는 못해요. 이메일 인증, 이메일 비밀번호 재설정, 기기 간 동기화는 없어요. 데모 전용 비밀번호를 사용해 주세요.')}</p><button class="diarito-button diarito-button--secondary" style="margin-top:1rem" data-action="logout">${t('Cerrar sesión','로그아웃')}</button></section>`;
  }
  function bindSettings() {
    const form=$('#profile-form');if(!form)return;
    form.onsubmit=async e=>{e.preventDefault();const button=$('[type=submit]',form);button.disabled=true;const values=new FormData(form),data=Object.fromEntries(values);try{const goals=[...new Set(values.getAll('goals').map(goalKey))];const customGoal=data.customGoal.trim();if(customGoal.length>100)throw new Error('PROFILE_INVALID');if(customGoal)goals.push(customGoal);const patch={name:data.name.trim(),bio:data.bio.trim(),nativeLanguage:data.nativeLanguage,targetLanguage:data.nativeLanguage==='ko'?'es':'ko',level:data.level,goals:[...new Set(goals)],learnerType:data.learnerType};if(data.photo?.size)patch.photo=await resizePhoto(data.photo,256);S.updateProfile(patch);render();toast('Perfil actualizado.','프로필을 수정했어요.');}catch(error){$('.app-error',form).hidden=false;$('.app-error',form).textContent=errorMessage(error);button.disabled=false;}};
    $('#backup-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>10*1024*1024)throw new Error('INVALID_BACKUP');const contents=await file.text();confirmAction(t('Restaurar una copia','백업 복원'),t('Esto reemplaza los datos actuales de la demo y cierra tu sesión. Exportá primero si necesitás conservarlos.','현재 데모 데이터를 교체하고 로그아웃해요. 지금 데이터를 보관하려면 먼저 내보내세요.'),()=>{S.importData(contents);location.href='login.html';},t('Restaurar','복원'));}catch(error){toast(errorMessage(error));}};
  }
  function renderAdmin() {
    if(me().role!=='admin')return empty(t('Acceso restringido','접근 제한'),t('Esta pantalla es para la cuenta moderadora.','관리자 계정 전용 화면이에요.'));
    const state=db(), reports=state.reports.filter(r=>r.status!=='resolved'&&r.status!=='dismissed');
    return `${heading(t('Moderación','커뮤니티 관리'),t('Revisá reportes y protegé el espacio de aprendizaje.','신고를 검토하고 배움의 공간을 지켜 주세요.'))}<p class="app-inline-notice">${t('Panel local de demostración. Las decisiones afectan únicamente a los datos de este navegador.','로컬 데모 관리 화면이에요. 조치는 이 브라우저 데이터에만 적용돼요.')}</p><section class="app-section"><h2>${t('Reportes pendientes','검토 대기 신고')} (${reports.length})</h2>${reports.length?reports.map(r=>{
      const kind=r.kind||r.targetType, targetId=r.targetId||r.contentId;
      const target=(kind==='post'?state.posts:kind==='correction'?state.corrections:kind==='comment'?state.comments:state.users).find(x=>x.id===targetId);
      const excerpt=target?.content||target?.originalContent||target?.edits?.map(e=>e.original+' → '+e.replacement).join('\n')||target?.username||'';
      const author=state.users.find(u=>u.id===(kind==='user'?target?.id:target?.authorId));
      return `<article class="app-report"><h3>${esc(({post:t('Diario','일기'),correction:t('Corrección','첨삭'),comment:t('Comentario','댓글'),user:t('Usuario','사용자')})[kind]||kind)} · ${time(r.createdAt)}</h3><p>${esc(r.reason)}</p>${excerpt?`<blockquote class="app-small">${esc(excerpt.slice(0,500))}</blockquote>`:''}<div class="app-actions">${kind!=='user'&&target?actionButton('resolve-report',t('Ocultar contenido','콘텐츠 숨김'),'secondary',`data-id="${esc(r.id)}" data-resolution="hide"`):''}${author&&author.role!=='admin'&&!author.suspended?actionButton('resolve-report',t('Suspender autor','작성자 정지'),'secondary',`data-id="${esc(r.id)}" data-resolution="suspend"`):''}${kind!=='user'&&target?actionButton('resolve-report',t('Eliminar contenido','콘텐츠 삭제'),'ghost',`data-id="${esc(r.id)}" data-resolution="remove"`):''}${actionButton('resolve-report',t('Desestimar','기각'),'ghost',`data-id="${esc(r.id)}" data-resolution="dismiss"`)}</div></article>`;
    }).join(''):`<p class="app-small">${t('No hay reportes pendientes.','대기 중인 신고가 없어요.')}</p>`}</section><section class="app-section"><h2>${t('Miembros','회원')}</h2>${state.users.filter(u=>u.role!=='admin').map(u=>`<div class="app-person-row">${avatar(u,'sm')}<div><strong>${esc(u.name||u.username)}</strong><p class="app-small">@${esc(u.username)} · ${u.suspended?t('Suspendido','정지됨'):t('Activo','활성')}</p></div>${actionButton('suspend',u.suspended?t('Reactivar','이용 재개'):t('Suspender','정지'),'secondary',`data-id="${esc(u.id)}" data-suspended="${!!u.suspended}"`)}</div>`).join('')}</section>`;
  }
  function renderGuidelines() {
    const entries=[
      [t('Escribí con libertad. Compartí con cuidado.','자유롭게 쓰고, 신중하게 나눠요.'),t('Tu diario puede ser íntimo. Antes de publicarlo, evitá direcciones, teléfonos, datos de otras personas o cualquier detalle que no quieras compartir. Solo yo y Solo IA mantienen el diario privado.','일기에는 개인적인 이야기가 담길 수 있어요. 공개 전에 주소, 연락처, 타인의 개인정보, 공유하고 싶지 않은 내용을 확인해 주세요. 나만 보기와 AI만은 비공개예요.')],
      [t('Corregí la frase, cuidá a la persona.','문장을 고치되 사람을 존중해요.'),t('Explicá con amabilidad. No te burles del nivel, el acento, la edad o el origen de nadie. Una forma distinta de expresarse no siempre es un error.','친절하게 설명해 주세요. 실력, 억양, 나이, 출신을 비웃지 마세요. 다르게 말한다고 항상 틀린 것은 아니에요.')],
      [t('Ofrecé contexto, no autoridad absoluta.','단정하기보다 문맥을 나눠요.'),t('Para una alternativa natural, escribí “También podés decir…” y explicá cuándo la usarías. La persona que escribió decide qué acepta.','자연스러운 대안은 “이렇게도 말할 수 있어요”와 함께 언제 쓰는지 알려 주세요. 수락 여부는 작성자가 결정해요.')],
      [t('No hay lugar para el acoso.','괴롭힘은 허용되지 않아요.'),t('No publiques amenazas, odio, contenido sexual no solicitado, spam ni información personal ajena. Podés reportar diarios, comentarios y correcciones, o bloquear a un usuario.','위협, 혐오, 원치 않는 성적 콘텐츠, 스팸, 타인의 개인정보를 게시하지 마세요. 일기, 댓글, 첨삭을 신고하거나 사용자를 차단할 수 있어요.')],
      [t('Una demo para aprender juntos.','함께 배우기 위한 데모.'),t('Los perfiles iniciales son ficticios. La revisión de IA es una simulación limitada. La protección real de cuentas, los permisos y la moderación compartida necesitan un servidor antes de una beta pública.','초기 프로필은 가상이에요. AI 검토는 제한된 시뮬레이션이에요. 공개 베타 전에 실제 계정 보호, 접근 제어, 공동 관리 서버가 필요해요.')]
    ];
    return `${heading(t('Cuidemos este espacio.','이 공간을 함께 지켜요.'),t('Para equivocarnos, entender y volver a intentar.','틀려 보고, 이해하고, 다시 시도하는 곳.'))}<div class="app-guidelines">${entries.map(([title,body])=>`<h2>${esc(title)}</h2><p>${esc(body)}</p>`).join('')}</div>`;
  }
  function render() {
    const user=me();if(!user){location.replace('login.html');return;}
    if(!user.onboardingComplete){location.replace('onboarding.html');return;}
    try{route=decodeURIComponent(location.hash.slice(1)||'feed');}catch{route='feed';}
    if(!/^(feed|diary|write|challenge|edit|profile|collections|connections|leaderboard|notifications|settings|admin|guidelines|entry)(\/[^/]{1,120})?$/.test(route))route='feed';
    if(!user.firstChallengeComplete&&!['challenge','settings','guidelines'].includes(route)){location.hash='challenge';return;}
    renderShell();const [page,id]=route.split('/');const main=$('#app-main');
    const views={feed:renderFeed,diary:renderDiary,write:()=>renderEditor(null,false),challenge:()=>renderEditor(null,true),edit:()=>renderEditor(id,false),profile:()=>renderProfile(id),collections:()=>renderCollections(id),connections:renderConnections,leaderboard:renderLeaderboard,notifications:renderNotifications,settings:renderSettings,admin:renderAdmin,guidelines:renderGuidelines,entry:renderFeed};
    main.innerHTML=(Object.hasOwn(views,page)?views[page]:renderFeed)();
    document.title=`${{feed:t('Comunidad','커뮤니티'),diary:t('Mi diario','내 일기'),write:t('Escribir','쓰기'),challenge:t('Pregunta del día','오늘의 질문'),profile:t('Perfil','프로필'),collections:t('Colecciones','컬렉션'),leaderboard:'Leaderboard',notifications:t('Notificaciones','알림'),settings:t('Configuración','설정'),admin:t('Moderación','관리')}[page]||'Mi Diarito'} · Diarito`;
    bindEditor();bindSettings();
    if(page==='entry'&&id)window.DEntry?.open(id);
  }
  async function handleAction(button) {
    const action=button.dataset.action,id=button.dataset.id;
    switch(action) {
      case 'language': captureDraft($('#diary-form')); root.lang=root.lang==='ko'?'es':'ko';localStorage.setItem('diarito-language',root.lang);render();document.dispatchEvent(new CustomEvent('diarito:languagechange',{detail:{language:root.lang}}));break;
      case 'theme':root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';localStorage.setItem('diarito-theme',root.dataset.theme);renderShell();break;
      case 'logout':captureDraft($('#diary-form'));S.logout();location.href='login.html';break;
      case 'open':window.DEntry.open(id);break;
      case 'correct':window.DEntry.open(id,{correct:true});break;
      case 'review':window.DEntry.open(id,{review:true});break;
      case 'like':S.toggleLike('post',id);render();break;
      case 'edit':navigate(`edit/${id}`);break;
      case 'delete-post':confirmAction(t('Eliminar diario','일기 삭제'),t('Se eliminarán este diario, sus respuestas y sus reescrituras de la demo. Esta acción no se puede deshacer.','일기와 답글, 다시 쓴 글이 데모에서 삭제돼요. 되돌릴 수 없어요.'),()=>S.deletePost(id),t('Eliminar diario','일기 삭제'));break;
      case 'report-post':report('post',id);break;
      case 'block':block(id);break;
      case 'unblock':S.unblockUser(id);render();toast('Usuario desbloqueado.','차단을 해제했어요.');break;
      case 'connect':S.requestConnection(id);render();toast('Solicitud enviada.','친구 요청을 보냈어요.');break;
      case 'accept-connection':S.respondConnection(id,true);render();break;
      case 'decline-connection':S.respondConnection(id,false);render();break;
      case 'read-notifications':S.markNotificationsRead();render();break;
      case 'new-collection':collectionForm();break;
      case 'rename-collection':collectionForm(id);break;
      case 'delete-collection':confirmAction(t('Eliminar colección','컬렉션 삭제'),t('Se eliminará esta colección con sus expresiones guardadas.','이 컬렉션과 저장된 표현이 삭제돼요.'),()=>{S.deleteCollection(id);navigate('collections');},t('Eliminar','삭제'));break;
      case 'collection':navigate(`collections/${id}`);break;
      case 'add-word':saveWord('','',id);break;
      case 'save-expression':window.DEntry.open(id);saveWord('',id);break;
      case 'delete-word':confirmAction(t('Eliminar expresión','표현 삭제'),t('¿Querés quitar esta expresión de tu colección?','컬렉션에서 이 표현을 삭제할까요?'),()=>S.removeWord(id,button.dataset.wordId),t('Eliminar','삭제'));break;
      case 'remove-photo':photoRequest++;editorPhoto='';const photoForm=$('#diary-form');photoForm.dataset.photoBusy='false';$('[type=submit]',photoForm).disabled=false;$('#photo-preview').innerHTML='';$('#diary-photo').value='';captureDraft($('#diary-form'));break;
      case 'sample-text': {
        const form=$('#diary-form');form.elements.content.value=form.elements.language.value==='ko'?'오늘 저는 친구를 만났어요. 같이 커피를 마시고 오래 이야기했어요. 어제 친구를 만나서 커피를 마셔요. 작은 시간이었지만 마음이 따뜻해졌어요.':'Hoy me hizo feliz encontrar a una amiga que no veía desde hace meses. Ayer fui a un cafetería cerca de mi casa. Pedimos café y hablamos de nuestros planes. Estoy muy feliz porque mi amiga es muy amable. Quiero ir un parque con ella la próxima semana.';form.elements.content.dispatchEvent(new Event('input',{bubbles:true}));form.elements.content.focus();break;
      }
      case 'export':{
        const backup=S.exportData?S.exportData():JSON.stringify(db(),null,2);const data=typeof backup==='string'?backup:JSON.stringify(backup,null,2);const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`diarito-demo-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);toast('Copia exportada. Guardala en un lugar privado.','백업을 내보냈어요. 개인적으로 보관해 주세요.');break;
      }
      case 'import':$('#backup-file').click();break;
      case 'resolve-report':{const resolution=button.dataset.resolution;confirmAction(t('Resolver reporte','신고 처리'),t('Esta decisión se guardará en el historial de moderación de la demo.','이 결정은 데모 신고 처리 기록에 저장돼요.'),()=>S.resolveReport(id,resolution));break;}
      case 'suspend':confirmAction(button.dataset.suspended==='true'?t('Reactivar usuario','사용자 이용 재개'):t('Suspender usuario','사용자 이용 정지'),t('El cambio se aplica a los accesos e interacciones de esta cuenta en la demo.','데모에서 이 계정의 접근과 소통에 적용돼요.'),()=>S.setUserSuspended(id,button.dataset.suspended!=='true'));break;
    }
  }
  window.DApp={t,esc,icon,avatar,time,fullTime,language,toast,render,report,block,saveWord,editPost:id=>navigate(`edit/${id}`),navigate,errorMessage,localized,visibility,utility};
  document.addEventListener('DOMContentLoaded',()=>{
    try{S.init();}catch(error){$('#app-main').innerHTML=empty(t('No pudimos abrir tus datos','데이터를 열 수 없어요'),t('No borramos tu información. Revisá si el navegador permite almacenamiento o restaurá una copia desde otra sesión.','데이터는 삭제하지 않았어요. 브라우저 저장 설정을 확인해 주세요.'));return;}
    root.lang=localStorage.getItem('diarito-language')==='ko'?'ko':'es';root.dataset.theme=localStorage.getItem('diarito-theme')==='dark'?'dark':'light';
    window.DEntry?.init(window.DApp);
    $('#utility-dialog').addEventListener('close',()=>{if(modalOpener?.isConnected)modalOpener.focus();});
    document.addEventListener('click',e=>{
      if(e.target.closest('.demo-skip')){e.preventDefault();const main=$('#app-main');main?.focus({preventScroll:true});main?.scrollIntoView({block:'start'});return;}
      const button=e.target.closest('[data-action]');
      if(button&&!button.disabled){e.preventDefault();Promise.resolve(handleAction(button)).catch(err=>toast(errorMessage(err)));return;}
      const f=e.target.closest('[data-filter]');if(f){filter=f.dataset.filter;render();}
      const p=e.target.closest('[data-profile-tab]');if(p){profileTab=p.dataset.profileTab;render();}
    });
    window.addEventListener('hashchange',()=>{captureDraft($('#diary-form'));filter='all';render();window.scrollTo({top:0});$('#app-main')?.focus({preventScroll:true});});
    window.addEventListener('storage',e=>{if(e.key==='diarito-demo-v1'||e.key==='diarito-demo-session'){captureDraft($('#diary-form'));window.DEntry?.close();render();}});
    window.addEventListener('beforeunload',()=>captureDraft($('#diary-form')));
    render();
  });
})();
