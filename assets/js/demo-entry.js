/* Diarito 2.20.0 — diary conversations, fragment corrections and second Output. */
(() => {
  'use strict';

  let app;
  let dialog;
  let opener;
  let state;
  let feedSelection = null;
  let feedMenu = null;
  let feedOrigin = null;
  let updateQueued = false;
  const store = () => window.DStore;
  const t = (es, ko) => app.t(es, ko);
  const e = value => app.esc(String(value ?? ''));
  const icon = name => app.icon(name);
  const own = post => post && store().currentUser()?.id === post.authorId;
  const original = post => post.originalContent ?? post.content ?? '';
  const localized = value => typeof value === 'object' && value !== null
    ? value[document.documentElement.lang === 'ko' ? 'ko' : 'es'] || value.es || value.ko || ''
    : String(value ?? '');

  const freshState = postId => ({
    postId, filter: 'all', editor: false, selected: null, edits: [],
    type: 'replace', replacement: '', explanation: '', search: '', insertAt: 'after',
    comment: '', rewrite: '', error: '', editorError: '', aiMessage: '',
    aiBusy: false, discard: false, submitted: false
  });

  function errorText(error) {
    const code = error?.code || error?.message;
    const copy = {
      CORRECTION_OVERLAP: ['Este cambio se superpone con otro. Elegí un fragmento distinto.', '다른 수정과 겹칩니다. 다른 부분을 선택해 주세요.'],
      OVERLAPPING_EDITS: ['Estos fragmentos se superponen. Guardá cada parte una sola vez.', '수정 부분이 겹칩니다. 각 부분은 한 번만 추가해 주세요.'],
      ACCEPTED_OVERLAP: ['Ya aceptaste un cambio sobre este fragmento. No se aplicó esta sugerencia.', '이 부분에 이미 수락한 수정이 있습니다. 이 제안은 적용되지 않았어요.'],
      CORRECTION_CONFLICT: ['Ya aceptaste otro cambio sobre este fragmento.', '이 부분에 이미 다른 수정을 수락했어요.'],
      INVALID_RANGE: ['El fragmento ya no coincide con el original. Volvé a seleccionarlo.', '선택한 부분이 원문과 일치하지 않습니다. 다시 선택해 주세요.'],
      INVALID_EDIT: ['Revisá el fragmento y el texto de la corrección.', '선택한 부분과 수정 내용을 확인해 주세요.'],
      DUPLICATE_CORRECTION: ['Esta corrección ya está publicada.', '이미 등록된 수정입니다.'],
      DUPLICATE_EDIT: ['Este cambio ya está incluido en la corrección.', '이미 포함된 수정입니다.'],
      OWN_CORRECTION: ['Las sugerencias humanas son para los diarios de otros miembros.', '다른 회원의 일기에 수정 제안을 남길 수 있어요.'],
      NOT_FOUND: ['Este contenido ya no está disponible.', '이 콘텐츠는 더 이상 볼 수 없어요.'],
      POST_NOT_FOUND: ['Este diario ya no está disponible.', '이 일기는 더 이상 볼 수 없어요.'],
      FORBIDDEN: ['No tenés acceso a esta acción.', '이 작업을 수행할 수 없어요.'],
      AUTH_REQUIRED: ['Iniciá sesión para participar.', '참여하려면 로그인해 주세요.'],
      BLOCKED: ['No se puede interactuar con este miembro.', '이 회원과 소통할 수 없어요.'],
      STORAGE_FULL: ['El navegador se quedó sin espacio. Guardá una copia de tus datos y liberá espacio.', '브라우저 저장 공간이 부족합니다. 데이터를 백업한 후 공간을 확보해 주세요.'],
      STORAGE_UNAVAILABLE: ['El navegador no permite guardar los cambios. Revisá los permisos de almacenamiento.', '브라우저에서 저장할 수 없어요. 저장 공간 권한을 확인해 주세요.'],
      EMPTY_CORRECTION: ['Agregá al menos un cambio antes de enviar.', '보내기 전에 수정을 하나 이상 추가해 주세요.'],
      EXPLANATION_REQUIRED: ['Explicá brevemente por qué sugerís el cambio.', '수정을 제안하는 이유를 짧게 설명해 주세요.'],
      CONTENT_INVALID: ['Revisá el contenido y su extensión antes de guardar.', '저장하기 전에 내용과 길이를 확인해 주세요.'],
      AI_PRIVATE: ['Cambiá la visibilidad a Solo IA o Comunidad para habilitar la revisión.', '피드백을 받으려면 공개 범위를 AI만 또는 커뮤니티로 바꿔 주세요.'],
      EMPTY_CONTENT: ['Escribí algo antes de guardar.', '저장하기 전에 내용을 입력해 주세요.']
    };
    return copy[code] ? t(...copy[code]) : t('No se pudo guardar. Revisá los datos e intentá de nuevo.', '저장하지 못했습니다. 내용을 확인하고 다시 시도해 주세요.');
  }

  function timeHTML(iso) {
    return `<time class="entry-time" datetime="${e(iso)}" title="${e(app.fullTime(iso))}">${e(app.time(iso))}</time>`;
  }

  function statusLabel(status) {
    if (status === 'accepted') return t('Aceptada', '수락함');
    if (status === 'ignored') return t('Ignorada', '건너뜀');
    return t('Por revisar', '검토 대기');
  }

  function typeLabel(type) {
    return ({
      replace: t('Reemplazar', '바꾸기'), delete: t('Eliminar', '삭제'),
      insert: t('Agregar', '추가'), alternative: t('Otra forma de decirlo', '다른 표현')
    })[type] || t('Corrección', '수정');
  }

  function diffHTML(edit) {
    return `${edit.original ? `<del class="diarito-correction-diff__removed">${e(edit.original)}</del>` : ''}${edit.original && edit.replacement ? ' ' : ''}${edit.replacement ? `<ins class="diarito-correction-diff__added">${e(edit.replacement)}</ins>` : ''}`;
  }

  function replyHeader(reply, kind, preview = false) {
    const author = store().user(reply.authorId);
    const ai = reply.source === 'ai-demo';
    const authorName = ai ? t('Diarito IA · demo', 'Diarito AI · 데모') : author?.name || author?.username || t('Miembro', '회원');
    const liked = (reply.likes || []).includes(store().currentUser()?.id);
    const postId = reply.postId;
    return `<div class="diarito-thread__identity entry-reply__identity">
      ${ai ? `<span class="diarito-avatar diarito-avatar--sm" aria-hidden="true">${icon('sparkles')}</span>` : app.avatar(author, 'sm')}
      <div class="entry-reply__person"><strong>${e(authorName)}</strong><span>${ai ? e(t('Sugerencias de ejemplo', '예시 제안')) : `@${e(author?.username || 'miembro')}`} <span aria-hidden="true">·</span> ${timeHTML(reply.createdAt)}</span></div>
      <div class="entry-reply__actions">
        <span class="entry-reply__kind" title="${e(kind === 'correction' ? t('Corrección', '수정') : t('Comentario', '댓글'))}">${icon(kind === 'correction' ? 'pencil' : 'comment')}</span>
        ${!ai ? `<button type="button" class="diarito-feed-action entry-reply__like" ${preview ? `data-entry-open="${e(postId)}"` : `data-entry-action="like" data-kind="${kind}" data-id="${e(reply.id)}"`} aria-pressed="${liked}" aria-label="${e(t('Me gusta', '좋아요'))}">${icon('heart')}<span>${(reply.likes || []).length}</span></button>` : ''}
        ${!preview && !ai && store().currentUser()?.id !== reply.authorId ? `<details class="entry-reply-menu"><summary aria-label="${e(t('Más opciones', '더 보기'))}">${icon('menu-dots')}</summary><div><button type="button" data-entry-action="report" data-kind="${kind}" data-id="${e(reply.id)}">${e(t('Reportar', '신고'))}</button><button type="button" data-entry-action="block" data-id="${e(reply.authorId)}">${e(t('Bloquear miembro', '회원 차단'))}</button></div></details>` : ''}
      </div>
    </div>`;
  }

  function replyHTML(reply, kind, post, preview = false) {
    if (kind === 'comment') {
      return `<article class="diarito-thread__reply entry-reply" data-reply-id="${e(reply.id)}">${replyHeader(reply, kind, preview)}<p class="diarito-thread__comment entry-comment">${e(reply.content)}</p></article>`;
    }
    return `<article class="diarito-thread__reply entry-reply" data-reply-id="${e(reply.id)}">${replyHeader(reply, kind, preview)}
      <div class="entry-correction-group">
        ${(reply.edits || []).map(edit => `<section class="entry-correction-edit">
          ${edit.type === 'alternative' ? `<span class="entry-edit-label">${e(t('También podés decir…', '이렇게도 말할 수 있어요…'))}</span>` : ''}
          <p class="entry-diff" lang="${e(post.language)}">${diffHTML(edit)}</p>
          ${edit.explanation ? `<p class="diarito-thread__explanation">${e(localized(edit.explanation))}</p>` : ''}
          ${!preview && own(post) ? `<div class="entry-edit-review"><span class="entry-status entry-status--${e(edit.status || 'pending')}">${e(statusLabel(edit.status))}</span>${edit.status === 'pending' || !edit.status ? `<button type="button" class="diarito-button diarito-button--secondary" data-entry-action="accept" data-id="${e(reply.id)}" data-edit="${e(edit.id)}">${icon('check')}${e(t('Aceptar', '수락'))}</button><button type="button" class="diarito-button diarito-button--ghost" data-entry-action="ignore" data-id="${e(reply.id)}" data-edit="${e(edit.id)}">${e(t('Ignorar', '건너뛰기'))}</button>` : ''}</div>` : ''}
        </section>`).join('')}
      </div>
    </article>`;
  }

  function allReplies(postId) {
    const replies = store().replies(postId);
    return [
      ...(replies.comments || []).map(reply => ({ reply, kind: 'comment' })),
      ...(replies.corrections || []).map(reply => ({ reply, kind: 'correction' }))
    ].sort((a, b) => new Date(a.reply.createdAt) - new Date(b.reply.createdAt));
  }

  function replyPreview(postId, limit = 2) {
    if (!app) return '';
    const post = store().post(postId);
    if (!post) return '';
    const replies = allReplies(postId);
    if (!replies.length) return '';
    const preview = replies.slice(-limit);
    return `<div class="diarito-thread entry-preview">${preview.map(({ reply, kind }) => replyHTML(reply, kind, post, true)).join('')}${replies.length > limit ? `<button type="button" class="diarito-button diarito-button--ghost entry-preview__more" data-entry-open="${e(postId)}">${e(t(`Ver las ${replies.length} respuestas`, `답글 ${replies.length}개 모두 보기`))}</button>` : ''}</div>`;
  }

  function sentenceRanges(text) {
    const ranges = [];
    const regex = /[^.!?。！？\n]+(?:[.!?。！？]+|(?=\n|$))/gu;
    let match;
    while ((match = regex.exec(text))) {
      const leading = match[0].length - match[0].trimStart().length;
      const clean = match[0].trim();
      if (clean) ranges.push({ start: match.index + leading, end: match.index + leading + clean.length, text: clean });
    }
    if (!ranges.length && text.trim()) {
      const start = text.indexOf(text.trim());
      ranges.push({ start, end: start + text.trim().length, text: text.trim() });
    }
    return ranges;
  }

  function occurrences(text, query) {
    if (!query) return [];
    const found = [];
    let from = 0;
    while (from <= text.length) {
      const start = text.indexOf(query, from);
      if (start < 0) break;
      found.push({ start, end: start + query.length, text: query });
      from = start + Math.max(1, query.length);
    }
    return found;
  }

  function fragmentEditor(post) {
    if (!state.editor) return '';
    const ranges = sentenceRanges(original(post));
    const matches = occurrences(original(post), state.search);
    const selected = state.selected;
    return `<section class="entry-editor" aria-labelledby="entry-editor-title">
      <div class="entry-section-heading"><div><h3 id="entry-editor-title">${e(t('Sugerí una corrección', '수정 제안하기'))}</h3><p>${e(t('Podés reunir varios fragmentos en una sola respuesta.', '여러 부분의 수정을 하나의 답글로 모을 수 있어요.'))}</p></div><button type="button" class="diarito-button diarito-button--icon" data-entry-action="cancel-editor" aria-label="${e(t('Cerrar editor de correcciones', '수정 편집기 닫기'))}">${icon('cross-small')}</button></div>
      <form id="entry-correction-form" class="entry-form" novalidate>
        <label class="diarito-field"><span class="diarito-label">${e(t('Elegí una oración', '문장 선택'))}</span><select class="diarito-select diarito-select--compact" id="entry-sentence"><option value="">${e(t('Seleccioná texto arriba o elegí una oración', '위에서 텍스트를 선택하거나 문장을 골라 주세요'))}</option>${ranges.map(range => `<option value="${range.start}:${range.end}" ${selected?.start === range.start && selected?.end === range.end ? 'selected' : ''}>${e(range.text.length > 100 ? range.text.slice(0, 98) + '…' : range.text)}</option>`).join('')}</select></label>
        <div class="entry-fragment-search"><label class="diarito-field" for="entry-fragment"><span class="diarito-label">${e(t('O indicá un fragmento exacto', '또는 정확한 부분 입력'))}</span><input class="diarito-input diarito-input--compact" id="entry-fragment" value="${e(state.search)}" autocomplete="off"></label><button type="button" class="diarito-button diarito-button--secondary" data-entry-action="locate">${e(t('Seleccionar', '선택'))}</button></div>
        ${matches.length > 1 ? `<label class="diarito-field"><span class="diarito-label">${e(t('El texto aparece varias veces. ¿Cuál querés cambiar?', '같은 표현이 여러 번 나옵니다. 어느 부분을 수정할까요?'))}</span><select class="diarito-select diarito-select--compact" id="entry-occurrence"><option value="">${e(t('Elegí una aparición', '위치를 선택해 주세요'))}</option>${matches.map((range, index) => `<option value="${range.start}:${range.end}" ${selected?.start === range.start && selected?.end === range.end ? 'selected' : ''}>${e(t(`Aparición ${index + 1}`, `${index + 1}번째`))} · ${e(original(post).slice(Math.max(0, range.start - 20), Math.min(original(post).length, range.end + 24)).replace(/\n/g, ' '))}</option>`).join('')}</select></label>` : ''}
        <div class="entry-selection" aria-live="polite"><span>${e(t('Fragmento seleccionado', '선택한 부분'))}</span><q>${selected ? e(selected.text) : e(t('Todavía no seleccionaste un fragmento.', '아직 선택한 부분이 없어요.'))}</q></div>
        <label class="diarito-field"><span class="diarito-label">${e(t('Tipo de cambio', '수정 방식'))}</span><select class="diarito-select diarito-select--compact" id="entry-change-type">${['replace', 'delete', 'insert', 'alternative'].map(type => `<option value="${type}" ${state.type === type ? 'selected' : ''}>${e(typeLabel(type))}</option>`).join('')}</select></label>
        ${state.type === 'insert' ? `<label class="diarito-field"><span class="diarito-label">${e(t('Ubicación', '추가 위치'))}</span><select class="diarito-select diarito-select--compact" id="entry-insert-at"><option value="after" ${state.insertAt === 'after' ? 'selected' : ''}>${e(t('Después del fragmento', '선택한 부분 뒤'))}</option><option value="before" ${state.insertAt === 'before' ? 'selected' : ''}>${e(t('Antes del fragmento', '선택한 부분 앞'))}</option></select><span class="diarito-help">${e(t('Incluí los espacios y signos de puntuación que hagan falta.', '필요한 공백과 문장 부호도 함께 입력해 주세요.'))}</span></label>` : ''}
        ${state.type !== 'delete' ? `<label class="diarito-field" for="entry-replacement"><span class="diarito-label">${e(state.type === 'insert' ? t('Texto para agregar', '추가할 내용') : t('Reemplazar por', '바꿀 표현'))}</span><textarea class="diarito-textarea entry-small-textarea" id="entry-replacement" maxlength="2000" lang="${e(post.language)}">${e(state.replacement)}</textarea></label>` : ''}
        <label class="diarito-field" for="entry-explanation"><span class="diarito-label">${e(t('¿Por qué? Ayudá a entender el cambio.', '왜 이렇게 고치나요? 이유를 설명해 주세요.'))}</span><textarea class="diarito-textarea entry-small-textarea" id="entry-explanation" maxlength="1500">${e(state.explanation)}</textarea></label>
        <p class="entry-error" id="entry-editor-error" role="alert" ${state.editorError ? '' : 'hidden'}>${e(state.editorError)}</p>
        <div class="entry-form-actions"><button type="button" class="diarito-button diarito-button--secondary" data-entry-action="stage">${icon('plus')}${e(t('Agregar otro cambio', '수정 하나 더 추가'))}</button><button type="submit" class="diarito-button diarito-button--primary">${e(t('Enviar corrección', '수정 보내기'))}</button></div>
      </form>
      ${state.edits.length ? `<div class="entry-staged"><h4>${e(t(`${state.edits.length} ${state.edits.length === 1 ? 'cambio' : 'cambios'} en esta respuesta`, `이 답글의 수정 ${state.edits.length}개`))}</h4><div class="entry-correction-group">${state.edits.map((edit, index) => `<div class="entry-staged__item"><div><p class="entry-diff" lang="${e(post.language)}">${diffHTML(edit)}</p><p class="diarito-thread__explanation">${e(edit.explanation)}</p></div><button type="button" class="diarito-button diarito-button--icon" data-entry-action="remove-staged" data-index="${index}" aria-label="${e(t('Quitar este cambio', '이 수정 삭제'))}">${icon('cross-small')}</button></div>`).join('')}</div></div>` : ''}
    </section>`;
  }

  function reviewSection(post, corrections) {
    if (!own(post) || !corrections.length) return '';
    const edits = corrections.flatMap(correction => correction.edits || []);
    const accepted = edits.filter(edit => edit.status === 'accepted').length;
    const pending = edits.filter(edit => !edit.status || edit.status === 'pending').length;
    let clean;
    try { clean = store().cleanText(post.id); } catch (_) { clean = original(post); }
    return `<section class="entry-review" id="entry-review" aria-labelledby="entry-review-title">
      <div class="entry-section-heading"><div><span class="entry-kicker">${e(t('Original · Corrección · Reescritura', '원문 · 피드백 · 다시 쓰기'))}</span><h3 id="entry-review-title">${e(t('Hacelo tuyo', '내 표현으로 만들기'))}</h3><p>${e(t(`${accepted} ${accepted === 1 ? 'cambio aceptado' : 'cambios aceptados'}${pending ? ` · ${pending} por revisar` : ''}. Tu original está guardado.`, `수락한 수정 ${accepted}개${pending ? ` · 검토 대기 ${pending}개` : ''}. 원문은 그대로 보관돼요.`))}</p></div></div>
      <h4>${e(t('Versión limpia', '수정된 글'))}</h4><div class="entry-clean" lang="${e(post.language)}">${e(clean)}</div>
      <form id="entry-rewrite-form" class="entry-form"><label class="diarito-field" for="entry-rewrite"><span class="diarito-label">${e(t('Ahora, volvé a escribirlo con lo que aprendiste.', '배운 내용을 활용해 다시 써 보세요.'))}</span><textarea class="diarito-textarea" id="entry-rewrite" required minlength="3" maxlength="12000" lang="${e(post.language)}" placeholder="${e(t('Probá una oración nueva o reescribí tu diario…', '새로운 문장을 만들거나 일기를 다시 써 보세요…'))}">${e(state.rewrite)}</textarea><span class="diarito-help">${e(t('Tu reescritura se guarda aparte; no reemplaza el diario original.', '다시 쓴 글은 원문을 바꾸지 않고 별도로 저장돼요.'))}</span></label><button type="submit" class="diarito-button diarito-button--primary">${icon('check')}${e(t('Guardar reescritura', '다시 쓴 글 저장'))}</button></form>
      ${(post.rewrites || []).length ? `<div class="entry-rewrites"><h4>${e(t('Tus intentos', '내가 다시 쓴 글'))}</h4>${[...(post.rewrites || [])].reverse().map(rewrite => `<article><div>${timeHTML(rewrite.createdAt)}</div><p lang="${e(post.language)}">${e(rewrite.content)}</p></article>`).join('')}</div>` : ''}
    </section>`;
  }

  function render() {
    if (!state || !dialog) return;
    const post = store().post(state.postId);
    const scroll = dialog.querySelector('.entry-dialog__scroll')?.scrollTop || 0;
    const focused = dialog.contains(document.activeElement) ? document.activeElement.id : '';
    if (!post) {
      dialog.innerHTML = `<div class="entry-unavailable"><h2>${e(t('Este diario no está disponible', '이 일기를 볼 수 없어요'))}</h2><p>${e(t('Puede ser privado o haber sido retirado.', '비공개로 변경되었거나 삭제되었을 수 있어요.'))}</p><button type="button" class="diarito-button diarito-button--primary" data-entry-action="close">${e(t('Cerrar', '닫기'))}</button></div>`;
      return;
    }
    const user = store().currentUser();
    const author = store().user(post.authorId);
    const isOwn = own(post);
    const canCorrect = user && !isOwn && post.visibility === 'community';
    const replies = allReplies(post.id);
    const corrections = replies.filter(item => item.kind === 'correction').map(item => item.reply);
    const comments = replies.filter(item => item.kind === 'comment').map(item => item.reply);
    const shown = replies.filter(item => state.filter === 'all' || item.kind === state.filter);
    const visibility = post.visibility === 'community' ? t('Comunidad', '커뮤니티') : post.visibility === 'ai' ? t('Solo IA', 'AI만') : t('Privado', '비공개');
    dialog.innerHTML = `<header class="entry-dialog__header"><div><span class="entry-kicker">${e(t('Un momento de tu mundo', '나의 일상 한 조각'))}</span><h2 id="entry-dialog-title">${e(t('Diario y conversación', '일기와 대화'))}</h2></div><button type="button" class="diarito-button diarito-button--icon" data-entry-action="close" aria-label="${e(t('Cerrar diario', '일기 닫기'))}">${icon('cross-small')}</button></header>
      <div class="entry-dialog__scroll">
        <article class="entry-full-post">
          <header class="entry-post-header">${app.avatar(author, 'sm')}<div><a href="#profile/${encodeURIComponent(post.authorId)}" data-entry-action="profile" data-id="${e(post.authorId)}"><strong>${e(author?.name || author?.username)}</strong></a><span>@${e(author?.username)} <span aria-hidden="true">·</span> ${timeHTML(post.createdAt)}</span></div><span class="entry-visibility">${icon(post.visibility === 'community' ? 'globe' : 'lock')}${e(visibility)}</span></header>
          ${post.title ? `<h3 class="entry-post-title">${e(post.title)}</h3>` : ''}
          <div class="entry-original" lang="${e(post.language)}" tabindex="0" aria-label="${e(t('Texto original del diario', '일기 원문'))}">${e(original(post))}</div>
          ${post.photo ? `<img class="entry-photo" src="${e(post.photo)}" alt="${e(t('Foto adjunta al diario', '일기에 첨부된 사진'))}" loading="lazy">` : ''}
          <div class="entry-post-meta"><span class="diarito-tag">${e(app.language(post.language))}</span><span>${e(app.fullTime(post.createdAt))}</span></div>
          <div class="entry-toolbar">
            ${post.visibility === 'community' ? `<button type="button" class="diarito-feed-action" data-entry-action="like" data-kind="post" data-id="${e(post.id)}" aria-pressed="${(post.likes || []).includes(user?.id)}">${icon('heart')}<span>${(post.likes || []).length}</span><span class="entry-button-label">${e(t('Me gusta', '좋아요'))}</span></button>
            <button type="button" class="diarito-feed-action" data-entry-action="focus-comments">${icon('comment')}<span>${comments.length}</span><span class="entry-button-label">${e(t('Comentarios', '댓글'))}</span></button>` : ''}
            <button type="button" class="diarito-feed-action" data-entry-action="save-word">${icon('bookmark')}<span class="entry-button-label">${e(t('Guardar expresión', '표현 저장'))}</span></button>
            ${canCorrect ? `<button type="button" class="diarito-button diarito-button--secondary entry-toolbar__last" data-entry-action="correct">${icon('pencil')}${e(t('Corregir', '수정 제안'))}</button>` : ''}
            ${isOwn ? `<button type="button" class="diarito-button diarito-button--ghost entry-toolbar__last" data-entry-action="edit">${icon('pencil')}${e(t('Editar diario', '일기 편집'))}</button>` : ''}
            ${!isOwn ? `<button type="button" class="diarito-feed-action" data-entry-action="report" data-kind="post" data-id="${e(post.id)}" aria-label="${e(t('Reportar diario', '일기 신고'))}" title="${e(t('Reportar diario', '일기 신고'))}">${icon('flag')}</button>` : ''}
          </div>
          ${canCorrect ? `<p class="entry-hint">${e(t('Seleccioná un fragmento y hacé clic derecho para corregirlo. También podés usar el botón Corregir.', '텍스트를 선택한 뒤 마우스 오른쪽 버튼으로 수정할 수 있어요. 수정 제안 버튼도 사용할 수 있어요.'))}</p>` : ''}
          <div class="entry-selection-toolbar" id="entry-selection-toolbar" hidden><span>${e(t('Texto seleccionado', '선택한 텍스트'))}</span>${canCorrect ? `<button type="button" class="diarito-button diarito-button--secondary" data-entry-action="correct-selection">${icon('pencil')}${e(t('Corregir selección', '선택 부분 수정'))}</button>` : ''}<button type="button" class="diarito-button diarito-button--ghost" data-entry-action="save-selection">${icon('bookmark')}${e(t('Guardar', '저장'))}</button></div>
        </article>
        <p class="entry-error" id="entry-general-error" role="alert" ${state.error ? '' : 'hidden'}>${e(state.error)}</p>
        ${isOwn && post.visibility !== 'private' ? `<section class="entry-ai"><div><h3>${e(t('Revisá tu diario', '일기 확인하기'))}</h3><p>${e(t('IA · demo: esta revisión usa ejemplos programados; todavía no hay un modelo de IA conectado.', 'AI · 데모: 미리 준비한 예시로만 피드백을 제공하며, 실제 AI 모델은 연결되어 있지 않아요.'))}</p></div><button type="button" class="diarito-button diarito-button--secondary" data-entry-action="ai" ${state.aiBusy ? 'disabled' : ''}>${icon('sparkles')}${e(t('Revisar con IA · demo', 'AI로 확인 · 데모'))}</button>${state.aiMessage ? `<p class="entry-ai__message" role="status">${e(state.aiMessage)}</p>` : ''}</section>` : isOwn && post.visibility === 'private' ? `<p class="entry-hint entry-private-hint">${icon('lock')}${e(t('Este diario es privado. Para habilitar la revisión, cambiá su visibilidad a Solo IA o Comunidad.', '이 일기는 비공개예요. 피드백을 받으려면 공개 범위를 AI만 또는 커뮤니티로 바꿔 주세요.'))}</p>` : ''}
        ${fragmentEditor(post)}
        <section class="entry-conversation" aria-labelledby="entry-conversation-title"><div class="entry-section-heading"><h3 id="entry-conversation-title">${e(t('Conversación', '대화'))}</h3><span class="entry-count">${replies.length}</span></div><div class="entry-filters" role="group" aria-label="${e(t('Filtrar respuestas', '답글 필터'))}">${[['all', t('Todo', '전체'), replies.length], ['comment', t('Comentarios', '댓글'), comments.length], ['correction', t('Correcciones', '수정'), corrections.length]].map(([filter, label, count]) => `<button type="button" class="diarito-button ${state.filter === filter ? 'diarito-button--secondary' : 'diarito-button--ghost'}" data-entry-action="filter" data-entry-filter="${filter}" aria-pressed="${state.filter === filter}">${e(label)} <span>${count}</span></button>`).join('')}</div>
          <div class="entry-replies">${shown.length ? shown.map(({ reply, kind }) => replyHTML(reply, kind, post)).join('') : `<p class="entry-empty">${e(state.filter === 'correction' ? t('Todavía no hay correcciones. Cada sugerencia puede ayudar a aprender.', '아직 수정 제안이 없어요. 작은 제안도 배움에 도움이 됩니다.') : state.filter === 'comment' ? t('Todavía no hay comentarios.', '아직 댓글이 없어요.') : t('Esta historia todavía no tiene respuestas.', '아직 이 이야기에 답글이 없어요.'))}</p>`}</div>
          ${post.visibility === 'community' && user ? `<form id="entry-comment-form" class="entry-form entry-comment-form"><label class="diarito-field" for="entry-comment"><span class="diarito-label">${e(t('Sumate a la conversación', '대화에 참여해 보세요'))}</span><textarea class="diarito-textarea entry-small-textarea" id="entry-comment" required maxlength="2000" placeholder="${e(t('Una pregunta, una experiencia o unas palabras de ánimo…', '질문, 경험, 따뜻한 응원을 나눠 주세요…'))}">${e(state.comment)}</textarea></label><button type="submit" class="diarito-button diarito-button--primary">${e(t('Comentar', '댓글 남기기'))}</button></form>` : ''}
        </section>
        ${reviewSection(post, corrections)}
      </div>
      <div class="entry-context-menu" id="entry-context-menu" role="menu" aria-label="${e(t('Acciones sobre el texto', '선택한 텍스트 작업'))}" hidden>${canCorrect ? ['replace', 'delete', 'insert', 'alternative'].map(type => `<button type="button" role="menuitem" data-entry-action="context-correct" data-type="${type}">${icon(type === 'delete' ? 'cross-small' : type === 'insert' ? 'plus' : 'pencil')}${e(typeLabel(type))}</button>`).join('') : ''}<button type="button" role="menuitem" data-entry-action="save-selection">${icon('bookmark')}${e(t('Guardar expresión', '표현 저장'))}</button></div>
      ${state.discard ? `<div class="entry-discard" role="alertdialog" aria-labelledby="entry-discard-title" aria-describedby="entry-discard-description"><div><h3 id="entry-discard-title">${e(state.discard === 'editor' ? t('¿Descartar esta corrección?', '이 수정 제안을 취소할까요?') : t('¿Salir sin enviar?', '보내지 않고 나갈까요?'))}</h3><p id="entry-discard-description">${e(t('Los cambios que estás preparando todavía no se guardaron.', '작성 중인 내용은 아직 저장되지 않았어요.'))}</p><div class="entry-form-actions"><button type="button" class="diarito-button diarito-button--secondary" data-entry-action="keep-writing">${e(t('Seguir escribiendo', '계속 쓰기'))}</button><button type="button" class="diarito-button diarito-button--primary" data-entry-action="discard">${e(state.discard === 'editor' ? t('Descartar corrección', '수정 취소') : t('Salir', '나가기'))}</button></div></div></div>` : ''}`;
    const scroller = dialog.querySelector('.entry-dialog__scroll');
    if (scroller) scroller.scrollTop = scroll;
    for (const section of dialog.querySelectorAll('.entry-dialog__header, .entry-dialog__scroll, .entry-context-menu')) section.inert = state.discard;
    if (focused) dialog.querySelector(`#${CSS.escape(focused)}`)?.focus({ preventScroll: true });
  }

  function hasDraft() {
    return !!(state?.edits.length || (state?.replacement.trim() && state.replacement !== state.selected?.text) || state?.explanation.trim() || state?.comment.trim() || state?.rewrite.trim());
  }

  function close(force = false) {
    if (!dialog?.open) return;
    if (!force && state && store().post(state.postId) && hasDraft()) {
      state.discard = 'close';
      render();
      dialog.querySelector('[data-entry-action="keep-writing"]')?.focus();
      return;
    }
    dialog.close();
    state = null;
    opener?.focus?.({ preventScroll: true });
  }

  function open(postId, options = {}) {
    if (!app) throw new Error('DEntry.init(app) must run first.');
    const post = store().post(postId);
    if (!post) return app.toast('Este diario no está disponible.', '이 일기를 볼 수 없어요.');
    if (state && state.postId !== postId && hasDraft()) {
      app.toast('Guardá o cerrá el borrador actual antes de abrir otro diario.', '다른 일기를 열기 전에 작성 중인 내용을 저장하거나 닫아 주세요.');
      return;
    }
    if (!dialog.open) opener = document.activeElement;
    if (!state || state.postId !== postId) state = freshState(postId);
    state.error = '';
    const currentFeedSelection = !dialog.open ? readFeedSelection() : null;
    const incoming = options.selection || (options.correct && (currentFeedSelection?.postId === postId ? currentFeedSelection.selection : feedSelection?.postId === postId ? feedSelection.selection : null));
    if (options.correct && incoming && !own(post) && post.visibility === 'community' && validSelection(post, incoming)) {
      state.selected = { start: incoming.start, end: incoming.end, text: incoming.text };
      state.search = incoming.text;
      if (['replace', 'delete', 'insert', 'alternative'].includes(options.correctionType)) state.type = options.correctionType;
      state.replacement = ['replace', 'alternative'].includes(state.type) ? incoming.text : '';
    }
    feedSelection = null;
    hideFeedMenu();
    if (options.review) state.filter = 'correction';
    render();
    if (!dialog.open) dialog.showModal();
    if (options.correct && !own(post) && post.visibility === 'community') beginCorrection(undefined, true);
    else dialog.querySelector('[data-entry-action="close"]')?.focus({ preventScroll: true });
    if (options.review) dialog.querySelector('.entry-conversation')?.scrollIntoView({ block: 'start' });
  }

  function readSelection() {
    const text = dialog?.querySelector('.entry-original');
    return selectionWithin(text);
  }

  function selectionWithin(text, limit = Infinity) {
    const selected = window.getSelection();
    if (!selected || !text || !selected.rangeCount || selected.isCollapsed) return null;
    const range = selected.getRangeAt(0);
    if (!text.contains(range.startContainer) || !text.contains(range.endContainer)) return null;
    const before = range.cloneRange();
    before.selectNodeContents(text);
    before.setEnd(range.startContainer, range.startOffset);
    const start = before.toString().length;
    const chosen = range.toString();
    if (!chosen.trim() || start + chosen.length > limit) return null;
    return { start, end: start + chosen.length, text: chosen };
  }

  function validSelection(post, selection) {
    return Number.isInteger(selection.start) && Number.isInteger(selection.end) && selection.start >= 0 && selection.end > selection.start && selection.end <= original(post).length && typeof selection.text === 'string' && selection.text.trim() && original(post).slice(selection.start, selection.end) === selection.text;
  }

  function readFeedSelection() {
    const selected = window.getSelection();
    if (!selected?.rangeCount || selected.isCollapsed) return null;
    const range = selected.getRangeAt(0);
    const ancestor = range.commonAncestorContainer;
    const element = ancestor.nodeType === 1 ? ancestor : ancestor.parentElement;
    const paragraph = element?.closest?.('.app-post-text');
    const card = paragraph?.closest('article[data-post-id]');
    if (!card) return null;
    const post = store().post(card.dataset.postId);
    if (!post || own(post) || post.visibility !== 'community') return null;
    // Feed text is the original prefix; the UI's appended ellipsis is never editable.
    const limit = original(post).length > 540 ? original(post).slice(0, 540).trimEnd().length : original(post).length;
    const selection = selectionWithin(paragraph, limit);
    if (!selection || !validSelection(post, selection)) return null;
    return { postId: post.id, selection, paragraph };
  }

  function captureSelection() {
    if (!dialog?.open) {
      const chosen = readFeedSelection();
      if (chosen) feedSelection = chosen;
      return;
    }
    if (!state) return;
    const selected = readSelection();
    const toolbar = dialog.querySelector('#entry-selection-toolbar');
    if (selected) {
      state.selected = selected;
      if (toolbar) toolbar.hidden = false;
    }
  }

  function beginCorrection(type, useSelection = false) {
    const post = store().post(state.postId);
    if (!post || own(post) || post.visibility !== 'community') return;
    const selected = readSelection() || (useSelection ? state.selected : null);
    state.editor = true;
    state.editorError = '';
    if (type) state.type = type;
    if (selected) {
      state.selected = selected;
      state.search = selected.text;
      state.replacement = state.type === 'replace' || state.type === 'alternative' ? selected.text : '';
    }
    render();
    dialog.querySelector('.entry-editor')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    dialog.querySelector(selected && state.type !== 'delete' ? '#entry-replacement' : '#entry-sentence')?.focus({ preventScroll: true });
  }

  function setSelected(range) {
    state.selected = range;
    state.search = range?.text || '';
    state.replacement = range && (state.type === 'replace' || state.type === 'alternative') ? range.text : '';
    state.editorError = '';
    render();
  }

  function stageEdit() {
    const post = store().post(state.postId);
    if (!post) throw new Error('NOT_FOUND');
    const selected = state.selected;
    if (!selected || original(post).slice(selected.start, selected.end) !== selected.text) {
      state.editorError = t('Seleccioná primero el fragmento que querés corregir.', '먼저 수정할 부분을 선택해 주세요.');
      return false;
    }
    if (state.type !== 'delete' && !state.replacement.trim()) {
      state.editorError = t('Escribí la nueva expresión.', '새로운 표현을 입력해 주세요.');
      return false;
    }
    if (!state.explanation.trim()) {
      state.editorError = t('Agregá una explicación breve para que la otra persona pueda aprender.', '상대방이 배울 수 있도록 짧게 이유를 설명해 주세요.');
      return false;
    }
    const edit = {
      start: selected.start, end: selected.end, original: selected.text,
      replacement: state.type === 'delete' ? '' : state.replacement,
      explanation: state.explanation.trim(), type: state.type
    };
    if (state.type === 'insert') {
      edit.start = edit.end = state.insertAt === 'before' ? selected.start : selected.end;
      edit.original = '';
    }
    if (edit.original === edit.replacement) {
      state.editorError = t('La sugerencia es igual al original. Modificá la expresión antes de enviarla.', '제안이 원문과 같아요. 표현을 바꾼 후 보내 주세요.');
      return false;
    }
    const overlapping = state.edits.some(previous => {
      if (edit.start === edit.end && previous.start === previous.end) return edit.start === previous.start;
      if (edit.start === edit.end) return edit.start > previous.start && edit.start < previous.end;
      if (previous.start === previous.end) return previous.start > edit.start && previous.start < edit.end;
      return edit.start < previous.end && previous.start < edit.end;
    });
    if (overlapping) {
      state.editorError = t('Este fragmento se superpone con un cambio que ya agregaste.', '이미 추가한 수정과 겹치는 부분이에요.');
      return false;
    }
    state.edits.push(edit);
    state.selected = null;
    state.search = '';
    state.replacement = '';
    state.explanation = '';
    state.editorError = '';
    return true;
  }

  function refreshApp() {
    app.render();
    render();
  }

  async function action(button) {
    const name = button.dataset.entryAction;
    const post = store().post(state.postId);
    if (name === 'close') return close();
    if (name === 'discard') {
      if (state.discard !== 'editor') return close(true);
      state.discard = false; state.editor = false; state.edits = [];
      state.selected = null; state.search = ''; state.replacement = ''; state.explanation = ''; state.editorError = '';
      render(); return;
    }
    if (name === 'keep-writing') { state.discard = false; render(); return; }
    if (!post) return;
    try {
      state.error = '';
      if (name === 'profile') { close(); if (!dialog.open) app.navigate(`profile/${post.authorId}`); }
      else if (name === 'filter') { state.filter = button.dataset.entryFilter; render(); }
      else if (name === 'like') { store().toggleLike(button.dataset.kind, button.dataset.id); refreshApp(); }
      else if (name === 'correct') beginCorrection(undefined, true);
      else if (name === 'correct-selection') beginCorrection(undefined, true);
      else if (name === 'context-correct') beginCorrection(button.dataset.type, true);
      else if (name === 'cancel-editor') {
        if (state.edits.length || state.explanation.trim() || (state.replacement && state.replacement !== state.selected?.text)) {
          state.discard = 'editor';
        } else { state.editor = false; state.replacement = ''; state.search = ''; state.selected = null; }
        render();
        if (state.discard) dialog.querySelector('[data-entry-action="keep-writing"]')?.focus();
      } else if (name === 'locate') {
        const found = occurrences(original(post), state.search);
        state.selected = found.length === 1 ? found[0] : null;
        state.editorError = found.length ? (found.length > 1 ? t('Elegí una de las apariciones de abajo.', '아래에서 위치를 선택해 주세요.') : '') : t('Ese fragmento no aparece exactamente en el original.', '원문에서 정확히 일치하는 표현을 찾지 못했어요.');
        if (state.selected && ['replace', 'alternative'].includes(state.type)) state.replacement = state.selected.text;
        render();
      } else if (name === 'stage') {
        stageEdit(); render();
        dialog.querySelector(state.editorError ? '#entry-editor-error' : '#entry-sentence')?.focus({ preventScroll: true });
      } else if (name === 'remove-staged') { state.edits.splice(Number(button.dataset.index), 1); render(); }
      else if (name === 'accept' || name === 'ignore') {
        store().reviewEdit(button.dataset.id, button.dataset.edit, name === 'accept' ? 'accepted' : 'ignored');
        refreshApp();
        if (name === 'accept') app.toast('Cambio aceptado. Tu versión limpia ya se actualizó.', '수정을 수락했어요. 수정된 글이 업데이트되었습니다.');
      } else if (name === 'ai') {
        state.aiBusy = true; state.aiMessage = ''; render();
        const group = await store().runAICheck(post.id);
        state.aiBusy = false;
        state.aiMessage = group ? t('Sugerencias de ejemplo listas. Revisá cada cambio antes de aceptarlo.', '예시 제안이 준비됐어요. 각 수정을 확인하고 수락해 주세요.') : t('La demo no encontró un ejemplo programado para este texto. Eso no significa que esté libre de errores; una revisión completa necesita conectar un modelo de IA.', '이 글에 맞는 예시를 찾지 못했어요. 오류가 없다는 뜻은 아니며, 전체 검토를 위해서는 실제 AI 모델 연결이 필요해요.');
        state.filter = 'correction'; refreshApp();
      } else if (name === 'focus-comments') {
        state.filter = 'comment'; render();
        const target = dialog.querySelector('#entry-comment') || dialog.querySelector('.entry-conversation');
        target?.scrollIntoView({ block: 'center', behavior: 'smooth' }); target?.focus({ preventScroll: true });
      } else if (name === 'save-word' || name === 'save-selection') {
        const selected = readSelection() || state.selected;
        hideContext();
        app.saveWord(selected?.text || '', post.id);
      } else if (name === 'report') { hideContext(); app.report(button.dataset.kind, button.dataset.id); }
      else if (name === 'block') { hideContext(); app.block(button.dataset.id); }
      else if (name === 'edit') {
        close();
        if (!dialog.open) app.editPost(post.id);
      }
    } catch (error) {
      state.aiBusy = false;
      state.error = errorText(error);
      render();
      dialog.querySelector('#entry-general-error')?.scrollIntoView({ block: 'center' });
    }
  }

  function hideContext() {
    const menu = dialog?.querySelector('#entry-context-menu');
    if (menu) menu.hidden = true;
    hideFeedMenu();
  }

  function hideFeedMenu() { if (feedMenu) feedMenu.hidden = true; }

  function showFeedContext(event) {
    if (dialog.open || !event.target.closest?.('.app-post-text')) return;
    const chosen = readFeedSelection();
    if (!chosen) return;
    event.preventDefault();
    feedSelection = chosen;
    feedOrigin = chosen.paragraph;
    if (!feedMenu) {
      feedMenu = document.createElement('div');
      feedMenu.id = 'entry-feed-menu';
      feedMenu.className = 'entry-context-menu entry-context-menu--feed';
      feedMenu.setAttribute('role', 'menu');
      document.body.append(feedMenu);
    }
    feedMenu.setAttribute('aria-label', t('Corregir el texto seleccionado', '선택한 텍스트 수정'));
    feedMenu.innerHTML = `${['replace', 'delete', 'insert', 'alternative'].map(type => `<button type="button" role="menuitem" data-entry-feed-action="${type}">${icon(type === 'delete' ? 'cross-small' : type === 'insert' ? 'plus' : 'pencil')}${e(typeLabel(type))}</button>`).join('')}<button type="button" role="menuitem" data-entry-feed-action="save">${icon('bookmark')}${e(t('Guardar expresión', '표현 저장'))}</button>`;
    const anchor = window.getSelection()?.getRangeAt(0)?.getBoundingClientRect();
    feedMenu.hidden = false;
    const x = event.clientX || anchor?.left || 8;
    const y = event.clientY || anchor?.bottom || 8;
    feedMenu.style.left = `${Math.max(8, Math.min(x, window.innerWidth - feedMenu.offsetWidth - 8))}px`;
    feedMenu.style.top = `${Math.max(8, Math.min(y, window.innerHeight - feedMenu.offsetHeight - 8))}px`;
    feedMenu.querySelector('button')?.focus({ preventScroll: true });
  }

  function showContext(event) {
    const selected = readSelection();
    if (!selected || !state) return;
    event.preventDefault();
    state.selected = selected;
    const menu = dialog.querySelector('#entry-context-menu');
    const anchor = window.getSelection()?.getRangeAt(0)?.getBoundingClientRect();
    const x = event.clientX || anchor?.left || 8;
    const y = event.clientY || anchor?.bottom || 8;
    menu.hidden = false;
    menu.style.left = `${Math.max(8, Math.min(x, window.innerWidth - menu.offsetWidth - 8))}px`;
    menu.style.top = `${Math.max(8, Math.min(y, window.innerHeight - menu.offsetHeight - 8))}px`;
    menu.querySelector('button')?.focus({ preventScroll: true });
  }

  async function submit(event) {
    const form = event.target;
    if (!['entry-comment-form', 'entry-correction-form', 'entry-rewrite-form'].includes(form.id)) return;
    event.preventDefault();
    try {
      state.error = '';
      if (form.id === 'entry-comment-form') {
        if (!state.comment.trim()) return;
        store().addComment(state.postId, state.comment.trim());
        state.comment = '';
        state.filter = 'all';
        app.toast('Comentario publicado.', '댓글을 등록했어요.');
      } else if (form.id === 'entry-correction-form') {
        const currentChanged = state.type === 'delete' && state.selected || state.explanation.trim() || state.replacement && state.replacement !== state.selected?.text;
        if ((currentChanged || !state.edits.length) && !stageEdit()) { render(); return; }
        store().addCorrection(state.postId, { edits: state.edits, source: 'human' });
        state.edits = [];
        state.editor = false;
        state.selected = null;
        state.search = '';
        state.replacement = '';
        state.explanation = '';
        state.filter = 'correction';
        app.toast('Corrección enviada. Todos tus cambios quedaron en la misma respuesta.', '수정 제안을 보냈어요. 모든 수정이 하나의 답글에 담겼어요.');
      } else {
        if (!state.rewrite.trim()) return;
        store().saveRewrite(state.postId, state.rewrite.trim());
        state.rewrite = '';
        app.toast('Reescritura guardada. Completaste un ciclo de aprendizaje.', '다시 쓴 글을 저장했어요. 학습 사이클을 완성했어요.');
      }
      refreshApp();
    } catch (error) {
      if (form.id === 'entry-correction-form') state.editorError = errorText(error);
      else state.error = errorText(error);
      render();
    }
  }

  function init(application) {
    if (app) return;
    app = application;
    dialog = document.querySelector('#entry-dialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'entry-dialog';
      document.body.append(dialog);
    }
    dialog.classList.add('entry-dialog');
    dialog.setAttribute('aria-labelledby', 'entry-dialog-title');
    dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
    dialog.addEventListener('click', event => {
      const button = event.target.closest('[data-entry-action]');
      if (button) { event.preventDefault(); action(button); }
      if (!event.target.closest('.entry-context-menu')) hideContext();
    });
    dialog.addEventListener('submit', submit);
    dialog.addEventListener('input', event => {
      if (!state) return;
      const keys = { 'entry-comment': 'comment', 'entry-rewrite': 'rewrite', 'entry-replacement': 'replacement', 'entry-explanation': 'explanation', 'entry-fragment': 'search' };
      const key = keys[event.target.id];
      if (key) {
        state[key] = event.target.value;
        if (key === 'search') state.selected = null;
      }
    });
    dialog.addEventListener('change', event => {
      if (!state) return;
      if (event.target.id === 'entry-sentence' || event.target.id === 'entry-occurrence') {
        const [start, end] = event.target.value.split(':').map(Number);
        const post = store().post(state.postId);
        if (post && Number.isFinite(start) && Number.isFinite(end)) setSelected({ start, end, text: original(post).slice(start, end) });
        else setSelected(null);
      } else if (event.target.id === 'entry-change-type') {
        state.type = event.target.value;
        state.replacement = state.type === 'delete' || state.type === 'insert' ? '' : state.selected?.text || '';
        render();
      } else if (event.target.id === 'entry-insert-at') state.insertAt = event.target.value;
    });
    dialog.addEventListener('contextmenu', event => { if (event.target.closest('.entry-original')) showContext(event); });
    dialog.addEventListener('keydown', event => {
      const menu = dialog.querySelector('#entry-context-menu');
      if (!menu || menu.hidden) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); hideContext(); dialog.querySelector('.entry-original')?.focus(); }
      if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault();
        const buttons = [...menu.querySelectorAll('button')];
        const index = buttons.indexOf(document.activeElement);
        buttons[(index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length]?.focus();
      }
    });
    document.addEventListener('selectionchange', captureSelection);
    document.addEventListener('contextmenu', showFeedContext);
    document.addEventListener('pointerdown', event => {
      if (dialog.open || event.button !== 0 || event.target.closest?.('#entry-feed-menu')) return;
      hideFeedMenu();
      // A normal Corregir button press must retain the selection made just before it.
      if (!event.target.closest?.('[data-action="correct"]')) feedSelection = null;
    });
    document.addEventListener('keydown', event => {
      if (!feedMenu || feedMenu.hidden) return;
      if (event.key === 'Escape') {
        event.preventDefault(); hideFeedMenu();
        if (feedOrigin) { feedOrigin.tabIndex = -1; feedOrigin.focus({ preventScroll: true }); }
      } else if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault();
        const buttons = [...feedMenu.querySelectorAll('button')];
        const index = buttons.indexOf(document.activeElement);
        buttons[(index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length]?.focus();
      }
    });
    document.addEventListener('click', event => {
      const feedAction = event.target.closest('[data-entry-feed-action]');
      if (feedAction && feedSelection) {
        event.preventDefault();
        const { postId, selection } = feedSelection;
        const type = feedAction.dataset.entryFeedAction;
        hideFeedMenu();
        if (type === 'save') app.saveWord(selection.text, postId);
        else open(postId, { correct: true, selection, correctionType: type });
        return;
      }
      const trigger = event.target.closest('[data-entry-open]');
      if (trigger && !dialog.contains(trigger)) { event.preventDefault(); open(trigger.dataset.entryOpen); }
    });
    document.addEventListener('diarito:languagechange', () => { if (dialog.open) render(); });
    window.addEventListener('resize', hideContext);
    window.addEventListener('scroll', hideFeedMenu, { passive: true });
    window.addEventListener('hashchange', () => { feedSelection = null; hideFeedMenu(); });
    document.addEventListener('diarito:datachange', () => {
      if (!dialog.open || updateQueued) return;
      updateQueued = true;
      queueMicrotask(() => { updateQueued = false; if (dialog.open && state) render(); });
    });
  }

  window.DEntry = { init, open, close, replyPreview, refresh: render };
})();
