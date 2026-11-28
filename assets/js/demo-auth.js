/* Diarito 2.20.0 · browser-local account and onboarding flows. */
(() => {
  'use strict';
  const mount = document.querySelector('[data-demo-auth]');
  if (!mount) return;
  const page = mount.dataset.demoAuth;
  const store = window.DStore;
  const root = document.documentElement;
  const t = (es, ko) => root.lang === 'ko' ? ko : es;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
  let busy = false;
  let error = '';
  let showPassword = false;
  let user = null;
  let draft = null;
  let step = 1;
  const values = { username: '', email: '', identifier: '', password: '' };
  let guidelinesAccepted = false;
  const goalOptions = [
    ['daily', 'Contar mi día con más confianza', '내 하루를 자신 있게 이야기하기'],
    ['connect', 'Conectar con otras personas', '다른 사람들과 소통하기'],
    ['travel', 'Prepararme para viajar', '여행 준비하기'],
    ['work', 'Usar el idioma en el trabajo o estudio', '일이나 공부에서 언어 사용하기'],
    ['culture', 'Entender mejor la cultura', '문화를 더 잘 이해하기']
  ];
  const learnerOptions = [
    ['writing', 'Escribir y volver a intentarlo', '직접 쓰고 다시 도전하기'],
    ['examples', 'Ver ejemplos y comparar', '예문을 보고 비교하기'],
    ['conversation', 'Conversar y recibir explicaciones', '대화하며 설명 듣기'],
    ['exploring', 'Todavía estoy descubriéndolo', '아직 알아가는 중이에요']
  ];
  const field = (name, label, input, hint = '') => `<label class="diarito-field" for="auth-${name}"><span class="diarito-label">${label}</span>${input}${hint ? `<span class="diarito-help" id="hint-${name}">${hint}</span>` : ''}</label>`;
  const input = (name, type, extra = '') => `<input class="diarito-input diarito-input--compact" id="auth-${name}" name="${name}" type="${type}" value="${esc(values[name])}" ${extra}>`;
  const button = (text, variant = 'primary', extra = '') => `<button class="diarito-button diarito-button--${variant}" ${extra}>${text}</button>`;
  const localNote = () => `<p class="auth-notice" id="auth-local-note">${t('Demo local: usá una contraseña de prueba. Tu cuenta y tus diarios se guardan solo en este navegador.', '로컬 데모예요. 테스트용 비밀번호를 사용하세요. 계정과 일기는 이 브라우저에만 저장돼요.')}</p>`;
  const errorBox = () => `<p class="auth-error" id="auth-error" role="alert" aria-live="assertive" ${error ? '' : 'hidden'}>${esc(error)}</p>`;
  function setError(message, focus = true) {
    error = message;
    const box = document.getElementById('auth-error');
    if (box) { box.textContent = message; box.hidden = !message; if (focus && message) { box.tabIndex = -1; box.focus(); } }
  }
  function friendlyError(err) {
    const code = err?.code || err?.message;
    const messages = {
      USERNAME_TAKEN: ['Ese nombre de usuario ya está en uso. Probá otro.', '이미 사용 중인 사용자 이름이에요. 다른 이름을 입력해 주세요.'],
      EMAIL_TAKEN: ['Ya existe una cuenta con ese correo. Iniciá sesión.', '이미 가입된 이메일이에요. 로그인해 주세요.'],
      INVALID_USERNAME: ['Usá de 3 a 24 letras, números o guiones bajos para tu usuario.', '사용자 이름은 영문 소문자, 숫자, 밑줄로 3~24자 입력해 주세요.'],
      INVALID_EMAIL: ['Revisá tu dirección de correo electrónico.', '이메일 주소를 확인해 주세요.'],
      WEAK_PASSWORD: ['Elegí una contraseña de al menos 8 caracteres.', '8자 이상의 비밀번호를 입력해 주세요.'],
      INVALID_PASSWORD: ['Elegí una contraseña de al menos 8 caracteres.', '8자 이상의 비밀번호를 입력해 주세요.'],
      INVALID_CREDENTIALS: ['El usuario, correo o contraseña no coinciden.', '사용자 이름, 이메일 또는 비밀번호가 일치하지 않아요.'],
      AUTH_FAILED: ['El usuario, correo o contraseña no coinciden.', '사용자 이름, 이메일 또는 비밀번호가 일치하지 않아요.'],
      USER_SUSPENDED: ['Esta cuenta está suspendida en la demo.', '이 데모 계정은 정지되어 있어요.'],
      ACCOUNT_SUSPENDED: ['Esta cuenta está suspendida en la demo.', '이 데모 계정은 정지되어 있어요.'],
      STORAGE_FULL: ['El navegador no tiene espacio disponible. Liberá espacio antes de continuar.', '브라우저 저장 공간이 부족해요. 공간을 확보한 후 다시 시도해 주세요.'],
      STORAGE_ERROR: ['No pudimos guardar los datos. Comprobá que el almacenamiento del navegador esté habilitado.', '데이터를 저장하지 못했어요. 브라우저 저장 기능이 허용되어 있는지 확인해 주세요.'],
      STORAGE_CORRUPT: ['Los datos guardados no se pudieron leer. No los borramos: podés conservarlos antes de reiniciar la demo.', '저장된 데이터를 읽을 수 없어요. 데이터는 삭제되지 않았으니 초기화 전에 보관해 주세요.'],
      INVALID_PROFILE: ['Completá tu nombre y elegí los dos idiomas y tu nivel.', '이름, 두 언어, 학습 수준을 모두 입력해 주세요.'],
      AUTH_REQUIRED: ['Iniciá sesión para continuar.', '계속하려면 로그인해 주세요.']
    };
    const aliases = { USERNAME_INVALID: 'INVALID_USERNAME', EMAIL_INVALID: 'INVALID_EMAIL', PASSWORD_SHORT: 'WEAK_PASSWORD', STORAGE_UNAVAILABLE: 'STORAGE_ERROR', STATE_CORRUPT: 'STORAGE_CORRUPT', PROFILE_INVALID: 'INVALID_PROFILE' };
    if (code === 'CRYPTO_UNAVAILABLE') return t('Abrí esta demo desde HTTPS o localhost para habilitar el acceso con contraseña.', '비밀번호 로그인을 사용하려면 HTTPS 또는 localhost에서 데모를 열어 주세요.');
    const message = messages[aliases[code] || code];
    return message ? t(...message) : t('No pudimos completar la acción. Revisá los datos e intentá de nuevo.', '작업을 완료하지 못했어요. 입력 내용을 확인하고 다시 시도해 주세요.');
  }
  function destination(account) {
    return !account.onboardingComplete ? 'onboarding.html' : !account.firstChallengeComplete ? 'app.html#challenge' : 'app.html#feed';
  }
  function updateMeta() {
    const title = page === 'login' ? t('Iniciar sesión', '로그인') : page === 'signup' ? t('Crear cuenta', '회원가입') : t('Tu perfil', '내 프로필');
    document.title = `${title} · Diarito`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('Creá tu cuenta de demostración y practicá español o coreano con tu propio diario.', '데모 계정을 만들고 나만의 일기로 스페인어나 한국어를 연습해 보세요.'));
    const story = {
      onboardingKicker: ['Un espacio para tu historia', '내 이야기를 위한 공간'],
      onboardingStory: ['Tu mundo, expresado.', '내 세상을 내 말로.'],
      onboardingStoryBody: ['Unas preguntas para acompañarte desde tu primer diario.', '첫 일기부터 함께하기 위해 몇 가지를 알려주세요.']
    };
    document.querySelectorAll('[data-auth-copy]').forEach(el => { const copy = story[el.dataset.authCopy]; if (copy) el.textContent = t(...copy); });
  }
  function renderAuth() {
    const signup = page === 'signup';
    mount.innerHTML = `<h1>${signup ? t('Crear cuenta', '회원가입') : t('Iniciar sesión', '로그인')}</h1>
      <form class="auth-form auth-form--compact" aria-describedby="auth-local-note auth-error" data-auth-form>
        ${signup ? field('username', t('Nombre de usuario', '사용자 이름'), input('username','text','autocomplete="username" minlength="3" maxlength="24" pattern="[a-zA-Z0-9_]{3,24}" required aria-describedby="hint-username" autocapitalize="none" spellcheck="false"'),t('Tu @usuario: letras, números y guion bajo.', '나만의 @이름: 영문, 숫자, 밑줄을 사용할 수 있어요.')) + field('email',t('Correo electrónico','이메일'),input('email','email','autocomplete="email" maxlength="254" required')) : field('identifier',t('Correo o nombre de usuario','이메일 또는 사용자 이름'),input('identifier','text','autocomplete="username" maxlength="254" required autocapitalize="none" spellcheck="false"'))}
        <div class="diarito-field"><label class="diarito-label" for="auth-password">${t('Contraseña','비밀번호')}</label><div class="auth-password-wrap">${input('password',showPassword?'text':'password',`autocomplete="${signup?'new':'current'}-password" ${signup?'minlength="8"':''} maxlength="200" required ${signup?'aria-describedby="hint-password"':''}`)}<button class="auth-password-toggle" type="button" data-password-toggle aria-label="${showPassword ? t('Ocultar contraseña','비밀번호 숨기기') : t('Mostrar contraseña','비밀번호 보기')}" aria-pressed="${showPassword}"><i class="fi fi-rr-${showPassword?'eye-crossed':'eye'}" aria-hidden="true"></i></button></div>${signup?`<span id="hint-password" class="diarito-help">${t('Al menos 8 caracteres. Usá una contraseña de prueba.','8자 이상 입력하세요. 테스트용 비밀번호를 사용해 주세요.')}</span>`:''}</div>
        ${signup?`<label class="diarito-choice auth-consent"><input type="checkbox" name="guidelines" ${guidelinesAccepted?'checked':''} required><span>${t('Leí las','이 데모의')} <a href="guidelines.html" target="_blank" rel="noopener">${t('normas de convivencia de esta demo','커뮤니티 안내')}</a>${t('.','를 읽었어요.')}</span></label>`:''}
        ${errorBox()}
        ${button(signup?t('Crear cuenta','계정 만들기'):t('Iniciar sesión','로그인'),'primary','type="submit" data-auth-submit')}
      </form>
      ${localNote()}
      <p class="auth-switch">${signup?t('¿Ya tenés cuenta?','이미 계정이 있나요?'):t('¿Todavía no tenés cuenta?','아직 계정이 없나요?')} <a href="${signup?'login':'signup'}.html">${signup?t('Iniciá sesión','로그인'):t('Registrate','회원가입')}</a></p>
      ${!signup?`<div class="auth-demo-access"><span class="diarito-help">${t('¿Solo querés recorrer la demo?','먼저 데모를 둘러볼까요?')}</span>${button(t('Entrar como Sowon','소원으로 체험하기'),'secondary','type="button" data-demo-login="sowon"')}${button(t('Empezar demo desde cero','처음부터 데모 시작하기'),'secondary','type="button" data-demo-fresh aria-describedby="fresh-demo-note"')}<p class="diarito-help auth-demo-note" id="fresh-demo-note">${t('Desde cero crea una cuenta ficticia nueva. Tu usuario aparece en el perfil; contraseña de prueba:','처음부터 시작하면 새 가상 계정이 만들어져요. 사용자 이름은 프로필에서 확인할 수 있어요. 테스트 비밀번호:')} <code>DiaritoDemo1!</code></p><details><summary>${t('Acceso de moderación','운영자 체험')}</summary><p>${t('Cuenta de prueba para revisar reportes y moderar contenido.','신고 검토와 콘텐츠 관리를 위한 테스트 계정이에요.')}</p>${button(t('Entrar como moderador','운영자로 체험하기'),'ghost','type="button" data-demo-login="moderator"')}</details></div>`:''}`;
    bindAuth();
  }
  function captureValues() {
    mount.querySelectorAll('[data-auth-form] input[name]').forEach(el => { if (el.name in values) values[el.name] = el.value; if (el.name === 'guidelines') guidelinesAccepted = el.checked; });
  }
  function setBusy(on) {
    busy = on;
    mount.querySelectorAll('button').forEach(el => { el.disabled = on; });
    mount.querySelector('form')?.setAttribute('aria-busy', String(on));
  }
  function bindAuth() {
    const form = mount.querySelector('[data-auth-form]');
    form.addEventListener('input', () => { captureValues(); if (error) setError('', false); });
    mount.querySelector('[data-password-toggle]').addEventListener('click', event => {
      showPassword = !showPassword;
      const password = mount.querySelector('#auth-password');
      password.type = showPassword ? 'text' : 'password';
      const control = event.currentTarget;
      control.setAttribute('aria-pressed', String(showPassword));
      control.setAttribute('aria-label', showPassword?t('Ocultar contraseña','비밀번호 숨기기'):t('Mostrar contraseña','비밀번호 보기'));
      control.querySelector('i').className = `fi fi-rr-${showPassword?'eye-crossed':'eye'}`;
    });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (busy || !form.reportValidity()) return;
      captureValues(); setError('', false); setBusy(true);
      try {
        const account = page === 'signup' ? await store.register({ username:values.username.trim().toLowerCase(), email:values.email.trim(), password:values.password }) : await store.login(values.identifier.trim(), values.password);
        values.password = '';
        location.assign(destination(account));
      } catch (err) { setBusy(false); setError(friendlyError(err)); }
    });
    mount.querySelector('[data-demo-fresh]')?.addEventListener('click', async () => {
      if (busy) return;
      setError('', false); setBusy(true);
      try {
        let account;
        for (let attempt = 0; attempt < 3; attempt++) {
          const suffix = Date.now().toString(36).slice(-7) + Math.random().toString(36).slice(2, 8);
          const username = `demo_${suffix}`;
          try {
            account = await store.register({ username, email: `${username}@diarito.demo`, password: 'DiaritoDemo1!' });
            break;
          } catch (err) {
            if (!['USERNAME_TAKEN', 'EMAIL_TAKEN'].includes(err?.code) || attempt === 2) throw err;
          }
        }
        location.assign(destination(account));
      } catch (err) { setBusy(false); setError(friendlyError(err)); }
    });
    mount.querySelectorAll('[data-demo-login]').forEach(control => control.addEventListener('click', async () => {
      if (busy) return;
      setError('',false); setBusy(true);
      try { const account = await store.login(control.dataset.demoLogin, 'DiaritoDemo1!'); location.assign(destination(account)); }
      catch (err) { setBusy(false); setError(friendlyError(err)); }
    }));
  }
  function draftKey() { return `diarito-onboarding-${user.id}`; }
  function saveDraft() {
    try { localStorage.setItem(draftKey(), JSON.stringify({ ...draft, step })); }
    catch { setError(t('No se pudo guardar tu avance en este navegador. Podés continuar, pero mantené esta página abierta.','이 브라우저에 진행 상황을 저장할 수 없어요. 계속할 수 있지만 이 페이지를 열어 두세요.'),false); }
  }
  function option(value, label, selected) { return `<option value="${value}" ${selected===value?'selected':''}>${label}</option>`; }
  function onboardingFirst() {
    return `${field('name',t('¿Cómo te llamás?','어떻게 불러드릴까요?'),`<input class="diarito-input diarito-input--compact" id="auth-name" name="name" maxlength="60" autocomplete="name" value="${esc(draft.name)}" required>`)}
      <div class="auth-form-grid">
        ${field('nativeLanguage',t('Idioma natal','모국어'),`<select class="diarito-select diarito-select--compact" id="auth-nativeLanguage" name="nativeLanguage" required>${option('es',t('Español','스페인어'),draft.nativeLanguage)}${option('ko',t('Coreano','한국어'),draft.nativeLanguage)}</select>`)}
        ${field('targetLanguage',t('Quiero aprender','학습 언어'),`<select class="diarito-select diarito-select--compact" id="auth-targetLanguage" name="targetLanguage" required>${option('ko',t('Coreano','한국어'),draft.targetLanguage)}${option('es',t('Español','스페인어'),draft.targetLanguage)}</select>`)}
      </div>
      ${field('level',t('Mi nivel aproximado','현재 학습 수준'),`<select class="diarito-select diarito-select--compact" id="auth-level" name="level" required>${option('beginner',t('Principiante','초급'),draft.level)}${option('intermediate',t('Intermedio','중급'),draft.level)}${option('advanced',t('Avanzado','고급'),draft.level)}</select>`,t('No es un examen. Podés cambiarlo después.','시험이 아니에요. 나중에 변경할 수 있어요.'))}`;
  }
  function onboardingSecond() {
    return `<fieldset class="auth-fieldset"><legend class="diarito-label">${t('¿Qué te gustaría lograr?','무엇을 이루고 싶나요?')}</legend><p class="diarito-help">${t('Elegí una o varias opciones.','하나 이상 골라 주세요.')}</p><div class="onboarding-choices">${goalOptions.map(([value,es,ko])=>`<label class="diarito-choice onboarding-choice"><input type="checkbox" name="goals" value="${value}" ${draft.goals.includes(value)?'checked':''}><span>${t(es,ko)}</span></label>`).join('')}</div></fieldset>
    ${field('learnerType',t('¿Qué te ayuda a aprender?','어떻게 배울 때 도움이 되나요?'),`<select class="diarito-select diarito-select--compact" id="auth-learnerType" name="learnerType" required>${learnerOptions.map(([value,es,ko])=>option(value,t(es,ko),draft.learnerType)).join('')}</select>`,t('Es tu preferencia de hoy; podés cambiarla cuando quieras.','지금의 선호도를 알려주세요. 언제든 바꿀 수 있어요.'))}`;
  }
  function onboardingThird() {
    return `<div class="onboarding-photo"><span class="onboarding-avatar">${draft.photo?`<img src="${esc(draft.photo)}" alt="${t('Vista previa de tu foto','프로필 사진 미리보기')}">`:`<span aria-hidden="true">${esc((draft.name||user.username||'D').trim().slice(0,1).toUpperCase())}</span>`}</span><div><strong>${esc(draft.name||user.username)}</strong><span>@${esc(user.username)}</span></div></div>
      <label class="diarito-field" for="auth-photo"><span class="diarito-label">${t('Tu foto de perfil (opcional)','프로필 사진 (선택)')}</span><input class="auth-file-input" type="file" id="auth-photo" name="photo" accept="image/jpeg,image/png,image/webp" aria-describedby="hint-photo"><span class="diarito-help" id="hint-photo">${t('JPG, PNG o WebP · hasta 2 MB. Si no subís una foto, usaremos tu inicial.','JPG, PNG, WebP · 최대 2MB. 사진이 없으면 이름의 첫 글자가 표시돼요.')}</span></label>
      ${draft.photo?button(t('Quitar foto','사진 삭제'),'ghost','type="button" data-remove-photo'):''}
      <div class="onboarding-next"><i class="fi fi-rr-edit" aria-hidden="true"></i><div><strong>${t('Tu primer pequeño desafío','첫 번째 작은 도전')}</strong><p>${t('Respondé la pregunta del día en el idioma que aprendés. Así empieza tu primer diario.','학습 중인 언어로 오늘의 질문에 답해 보세요. 그렇게 첫 일기가 시작돼요.')}</p></div></div>`;
  }
  function renderOnboarding(focusHeading = false) {
    const titles = [t('Empecemos por vos','먼저, 나를 소개해요'),t('A tu manera','나에게 맞는 배움'),t('Dale una cara a tu historia','내 이야기의 얼굴')];
    const descriptions = [t('Unas bases para acompañar lo que querés expresar.','내가 표현하고 싶은 이야기를 함께 준비해요.'),t('Tu vida y tus intereses marcan el camino.','내 삶과 관심사에서 시작해요.'),t('Ya casi estamos. Este será tu espacio.','거의 다 됐어요. 이제 나만의 공간이 생겨요.')];
    mount.innerHTML = `<div class="onboarding-progress" aria-label="${t('Progreso de tu perfil','프로필 설정 진행')} ${step}/3"><span class="diarito-kicker">${t('Tu perfil','내 프로필')} · ${step}/3</span><div class="onboarding-progress__track" aria-hidden="true">${[1,2,3].map(n=>`<span class="${n<=step?'is-complete':''}"></span>`).join('')}</div></div>
      <h1 tabindex="-1" id="onboarding-heading">${titles[step-1]}</h1><p class="auth-intro-small">${descriptions[step-1]}</p>
      <form class="auth-form auth-form--compact" data-onboarding-form aria-describedby="auth-error">
        ${step===1?onboardingFirst():step===2?onboardingSecond():onboardingThird()}
        ${errorBox()}
        <div class="onboarding-controls">${step>1?button(t('Atrás','이전'),'secondary','type="button" data-onboarding-back'):''}${button(step===3?t('Empezar mi primer diario','첫 일기 시작하기'):t('Continuar','계속'),'primary','type="submit" data-auth-submit')}</div>
      </form>
      <p class="auth-notice">${t('Guardamos tu avance en este navegador.','진행 상황은 이 브라우저에 저장돼요.')}</p>
      ${button(t('Cerrar sesión','로그아웃'),'ghost','type="button" data-onboarding-logout')}`;
    bindOnboarding();
    if (focusHeading) document.getElementById('onboarding-heading').focus();
  }
  function captureDraft() {
    const form = mount.querySelector('[data-onboarding-form]');
    if (!form) return;
    for (const name of ['name','nativeLanguage','targetLanguage','level','learnerType']) {
      const el=form.elements.namedItem(name);
      if (el) draft[name]=el.value;
    }
    if (step===2) draft.goals=Array.from(form.querySelectorAll('[name="goals"]:checked'),el=>el.value);
  }
  async function readPhoto(file) {
    if (!['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('PHOTO_TYPE');
    if (file.size > 2*1024*1024) throw new Error('PHOTO_SIZE');
    const url=URL.createObjectURL(file);
    try {
      const img=new Image();
      await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('PHOTO_INVALID'));img.src=url;});
      if (!img.naturalWidth || !img.naturalHeight) throw new Error('PHOTO_INVALID');
      const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;
      const ctx=canvas.getContext('2d');
      const size=Math.min(img.naturalWidth,img.naturalHeight);
      ctx.fillStyle='#ffffff';ctx.fillRect(0,0,256,256);
      ctx.drawImage(img,(img.naturalWidth-size)/2,(img.naturalHeight-size)/2,size,size,0,0,256,256);
      return canvas.toDataURL('image/jpeg',.82);
    } finally {URL.revokeObjectURL(url);}
  }
  function bindOnboarding() {
    const form=mount.querySelector('[data-onboarding-form]');
    form.addEventListener('input',()=>{captureDraft();saveDraft();if(error)setError('',false);});
    form.addEventListener('change',event=>{
      if(event.target.name==='nativeLanguage') form.elements.targetLanguage.value=event.target.value==='es'?'ko':'es';
      if(event.target.name==='targetLanguage') form.elements.nativeLanguage.value=event.target.value==='es'?'ko':'es';
      captureDraft();saveDraft();
    });
    form.addEventListener('submit',async event=>{
      event.preventDefault();if(busy || !form.reportValidity())return;
      captureDraft();setError('',false);
      if(step===1 && !draft.name.trim()){setError(t('Escribí el nombre que querés mostrar.','표시할 이름을 입력해 주세요.'));return;}
      if(step===2 && !draft.goals.length){setError(t('Elegí al menos un objetivo para continuar.','계속하려면 목표를 하나 이상 선택해 주세요.'));return;}
      if(step<3){step++;saveDraft();renderOnboarding(true);return;}
      setBusy(true);
      try {
        await store.completeOnboarding({name:draft.name.trim(),nativeLanguage:draft.nativeLanguage,targetLanguage:draft.targetLanguage,level:draft.level,goals:draft.goals,learnerType:draft.learnerType,photo:draft.photo||''});
        localStorage.removeItem(draftKey());
        location.assign('app.html#challenge');
      } catch(err){setBusy(false);setError(friendlyError(err));}
    });
    mount.querySelector('[data-onboarding-back]')?.addEventListener('click',()=>{captureDraft();step--;error='';saveDraft();renderOnboarding(true);});
    mount.querySelector('[data-remove-photo]')?.addEventListener('click',()=>{draft.photo='';saveDraft();renderOnboarding();});
    mount.querySelector('#auth-photo')?.addEventListener('change',async event=>{
      const file=event.target.files[0];if(!file)return;
      setError('',false);setBusy(true);
      try{draft.photo=await readPhoto(file);saveDraft();renderOnboarding();}
      catch(err){setError(err.message==='PHOTO_SIZE'?t('La foto debe pesar menos de 2 MB.','사진은 2MB 이하여야 해요.'):t('Elegí una imagen JPG, PNG o WebP válida.','올바른 JPG, PNG, WebP 이미지를 선택해 주세요.'));event.target.value='';}
      finally{setBusy(false);}
    });
    mount.querySelector('[data-onboarding-logout]').addEventListener('click',()=>{captureDraft();saveDraft();store.logout();location.assign('login.html');});
  }
  function render() { updateMeta();page==='onboarding'?renderOnboarding():renderAuth(); }
  try {
    if(!store)throw new Error('STORE_UNAVAILABLE');
    store.init();
    user=store.currentUser();
    if(page==='onboarding'){
      if(!user){location.replace('login.html');return;}
      if(user.onboardingComplete){location.replace(destination(user));return;}
      let saved={};
      try{saved=JSON.parse(localStorage.getItem(draftKey())||'{}')||{};}catch{}
      draft={name:user.name||'',nativeLanguage:user.nativeLanguage||'es',targetLanguage:user.targetLanguage||'ko',level:user.level||'beginner',goals:[],learnerType:'exploring',photo:'',...saved};
      draft.goals=Array.isArray(draft.goals)?draft.goals.filter(goal=>goalOptions.some(item=>item[0]===goal)):[];
      if(!['es','ko'].includes(draft.nativeLanguage))draft.nativeLanguage='es';
      draft.targetLanguage=draft.nativeLanguage==='es'?'ko':'es';
      if(!['beginner','intermediate','advanced'].includes(draft.level))draft.level='beginner';
      if(typeof draft.photo!=='string'||!draft.photo.startsWith('data:image/'))draft.photo='';
      step=Math.max(1,Math.min(3,Number(saved.step)||1));
    } else if(user){location.replace(destination(user));return;}
    render();
    if (page !== 'onboarding') mount.querySelector('input')?.focus({ preventScroll: true });
  } catch(err) {
    mount.innerHTML=`<h1>${t('No pudimos abrir la demo','데모를 열 수 없어요')}</h1><p class="auth-error" role="alert">${esc(friendlyError(err))}</p><a class="diarito-link" href="index.html">${t('Volver al inicio','홈으로 돌아가기')}</a>`;
    return;
  }
  document.addEventListener('diarito:languagechange',()=>{
    if(busy)return;
    if(page==='onboarding')captureDraft();else captureValues();
    error='';render();
  });
})();
