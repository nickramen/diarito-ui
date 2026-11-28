'use strict';
// Integration at the controller boundary: real Store, input/change/submit events,
// a minimal dialog harness, and no browser or third-party DOM implementation.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
const read = name => fs.readFileSync(path.join(__dirname, '../assets/js/', name), 'utf8');

function environment() {
  const memory = new Map();
  const dialogListeners = new Map();
  const documentListeners = new Map();
  let activeSelection = { rangeCount: 0, isCollapsed: true };
  const created = [];
  const dialog = {
    open: false, innerHTML: '', classList: { add() {} },
    setAttribute() {}, contains() { return false; }, querySelector() { return null; }, querySelectorAll() { return []; },
    showModal() { this.open = true; }, close() { this.open = false; },
    addEventListener(type, listener) {
      if (!dialogListeners.has(type)) dialogListeners.set(type, []);
      dialogListeners.get(type).push(listener);
    }
  };
  const document = {
    documentElement: { lang: 'es' }, activeElement: { focus() {} },
    body: { append() {} },
    createElement() {
      const node = { hidden: true, innerHTML: '', style: {}, offsetWidth: 210, offsetHeight: 230, setAttribute() {}, querySelector() { return null; }, querySelectorAll() { return []; } };
      created.push(node); return node;
    },
    querySelector() { return dialog; },
    addEventListener(type, listener) {
      if (!documentListeners.has(type)) documentListeners.set(type, []);
      documentListeners.get(type).push(listener);
    },
    dispatchEvent(event) { for (const listener of documentListeners.get(event.type) || []) listener(event); }
  };
  const context = {
    console, Date, Math, JSON, TextEncoder, Uint8Array, Array, Object, Error, Set, RegExp, Number, String,
    crypto: webcrypto, document, queueMicrotask, CSS: { escape: value => value },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options?.detail; } },
    addEventListener() {}, getSelection: () => activeSelection, innerWidth: 1200, innerHeight: 800,
    localStorage: { getItem: key => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: key => memory.delete(key) }
  };
  context.window = context;
  vm.createContext(context);
  for (const file of ['demo-seed.js', 'demo-store.js', 'demo-entry.js']) vm.runInContext(read(file), context);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const app = {
    t: (es, ko) => document.documentElement.lang === 'ko' ? ko : es,
    esc, icon: () => '', avatar: () => '<span>avatar</span>', time: () => '2h', fullTime: iso => iso,
    language: code => code, toast() {}, render() {}, report() {}, block() {}, saveWord() {}, editPost() {}, navigate() {}
  };
  context.DStore.init();
  context.DEntry.init(app);
  const tick = () => new Promise(resolve => setImmediate(resolve));
  async function emit(type, target) {
    for (const listener of dialogListeners.get(type) || []) listener({ target, preventDefault() {}, stopPropagation() {} });
    await tick();
  }
  const input = (id, value) => emit('input', { id, value });
  const change = (id, value) => emit('change', { id, value });
  const click = (action, extra = {}) => {
    const button = { dataset: { entryAction: action, ...extra } };
    return emit('click', { closest: selector => selector === '[data-entry-action]' ? button : null });
  };
  const submit = id => emit('submit', { id });
  function selectFeed(post, start, end) {
    const content = post.originalContent;
    const visible = content.length > 540 ? content.slice(0, 540).trimEnd() + '…' : content;
    const card = { dataset: { postId: post.id } };
    let textNode;
    const paragraph = { nodeType: 1, textContent: visible, focus() {}, contains: node => node === textNode, closest: selector => selector === '.app-post-text' ? paragraph : selector === 'article[data-post-id]' ? card : null };
    textNode = { nodeType: 3, parentElement: paragraph };
    const range = {
      commonAncestorContainer: textNode, startContainer: textNode, endContainer: textNode, startOffset: start, endOffset: end,
      toString: () => visible.slice(start, end), getBoundingClientRect: () => ({ left: 50, bottom: 100 }),
      cloneRange: () => ({ prefix: '', selectNodeContents() {}, setEnd(node, offset) { this.prefix = visible.slice(0, offset); }, toString() { return this.prefix; } })
    };
    activeSelection = { rangeCount: 1, isCollapsed: start === end, getRangeAt: () => range };
    return paragraph;
  }
  return { D: context.DStore, E: context.DEntry, dialog, input, change, click, submit, tick, document, selectFeed, created, collapseSelection: () => { activeSelection = { rangeCount: 0, isCollapsed: true }; } };
}

const password = 'DiaritoDemo1!';
const register = (D, username) => D.register({ username, email: `${username}@example.test`, password });
const select = (env, start, end) => env.change('entry-occurrence', `${start}:${end}`);

test('UI stages two precise repeated fragments after a surrogate pair into one correction and preserves the original through review', async () => {
  const env = environment();
  const { D, E, dialog } = env;
  await register(D, 'entry_author');
  const original = '오늘 📝 café. Después tomé café. Fue un buen día.';
  const post = D.createPost({ content: original, language: 'es', visibility: 'community', communityConfirmed: true });
  await register(D, 'entry_helper');
  E.open(post.id, { correct: true });
  const first = original.indexOf('café');
  const second = original.lastIndexOf('café');
  await select(env, first, first + 4);
  await env.input('entry-replacement', 'un café');
  await env.input('entry-explanation', 'Usamos el artículo para presentar la bebida.');
  await env.click('stage');
  await select(env, second, second + 4);
  await env.input('entry-replacement', 'té');
  await env.input('entry-explanation', 'Una alternativa para este segundo fragmento.');
  await env.submit('entry-correction-form');
  const groups = D.replies(post.id).corrections;
  assert.equal(groups.length, 1);
  assert.equal(groups[0].edits.length, 2);
  assert.equal(groups[0].edits[0].start, first);
  assert.equal(groups[0].edits[1].start, second);
  assert.equal((dialog.innerHTML.match(/class="entry-correction-group"/g) || []).length, 1);
  assert.ok(dialog.innerHTML.includes('data-entry-filter="correction"'));
  assert.ok(!dialog.innerHTML.includes(' data-filter='), 'detail filters must not trigger the app feed filter');
  await D.login('entry_author', password);
  await env.tick();
  for (const edit of groups[0].edits) await env.click('accept', { id: groups[0].id, edit: edit.id });
  assert.equal(D.cleanText(post.id), '오늘 📝 un café. Después tomé té. Fue un buen día.');
  assert.equal(D.post(post.id).originalContent, original);
  await env.input('entry-rewrite', 'Hoy escribí y tomé una taza de té.');
  await env.submit('entry-rewrite-form');
  assert.equal(D.post(post.id).rewrites.length, 1);
  assert.equal(D.post(post.id).originalContent, original);
});

test('UI insertion and deletion retain exact boundaries; overlapping staged edits do not get submitted', async () => {
  const env = environment();
  const { D, E, dialog } = env;
  await register(D, 'insert_author');
  const content = 'Quiero ir un parque hoy.';
  const post = D.createPost({ content, language: 'es', visibility: 'community', communityConfirmed: true });
  await register(D, 'insert_helper');
  E.open(post.id, { correct: true });
  const park = content.indexOf('un parque');
  await select(env, park, park + 9);
  await env.change('entry-change-type', 'insert');
  await env.change('entry-insert-at', 'before');
  await env.input('entry-replacement', 'a ');
  await env.input('entry-explanation', 'El destino se introduce con a.');
  await env.click('stage');
  const today = content.indexOf(' hoy');
  await select(env, today, today + 4);
  await env.change('entry-change-type', 'delete');
  await env.input('entry-explanation', 'En este ejemplo quitamos la referencia temporal.');
  await env.click('stage');
  await select(env, today, today + 4);
  await env.input('entry-explanation', 'El mismo fragmento no debe duplicarse.');
  await env.click('stage');
  assert.ok(dialog.innerHTML.includes('se superpone con un cambio'));
  assert.equal(D.replies(post.id).corrections.length, 0);
  // Clear the rejected current fragment, keeping the two valid staged edits.
  await env.input('entry-explanation', '');
  await env.change('entry-sentence', '');
  await env.submit('entry-correction-form');
  const group = D.replies(post.id).corrections[0];
  assert.equal(group.edits.length, 2);
  assert.equal(group.edits[0].original, '');
  assert.equal(group.edits[0].start, group.edits[0].end);
  await D.login('insert_author', password);
  for (const edit of group.edits) await env.click('accept', { id: group.id, edit: edit.id });
  assert.equal(D.cleanText(post.id), 'Quiero ir a un parque.');
});

test('reply content is escaped, filter retains drafts, and an unavailable post can always close', async () => {
  const env = environment();
  const { D, E, dialog } = env;
  const author = await register(D, 'safe_author');
  const post = D.createPost({ content: 'Una historia pública.', language: 'es', visibility: 'community', communityConfirmed: true });
  await register(D, 'safe_helper');
  D.addComment(post.id, '<img src=x onerror=alert(1)>');
  E.open(post.id);
  assert.ok(dialog.innerHTML.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(!dialog.innerHTML.includes('<img src=x'));
  await env.input('entry-comment', 'Un comentario todavía sin enviar.');
  await env.click('filter', { entryFilter: 'correction' });
  assert.ok(dialog.innerHTML.includes('Un comentario todavía sin enviar.'));
  D.blockUser(author.id);
  await env.tick();
  E.close();
  assert.equal(dialog.open, false, 'a blocked/unavailable entry must not trap the discard prompt');
});

test('feed context menu preserves selected occurrence, rejects appended ellipsis and passes selection to the normal Corregir button', async () => {
  const env = environment();
  const { D, E, dialog, document } = env;
  await register(D, 'feed_author');
  const content = '📝 café. Otro café. ' + 'Un día tranquilo. '.repeat(40);
  const post = D.createPost({ content, language: 'es', visibility: 'community', communityConfirmed: true });
  await register(D, 'feed_helper');
  const boundary = content.slice(0, 540).trimEnd().length;
  const ellipsisParagraph = env.selectFeed(post, boundary, boundary + 1);
  let intercepted = false;
  document.dispatchEvent({ type: 'contextmenu', target: ellipsisParagraph, preventDefault() { intercepted = true; }, clientX: 100, clientY: 100 });
  assert.equal(intercepted, false, 'the visual truncation ellipsis cannot become a correction target');
  const second = content.lastIndexOf('café');
  const paragraph = env.selectFeed(post, second, second + 4);
  document.dispatchEvent({ type: 'contextmenu', target: paragraph, preventDefault() { intercepted = true; }, clientX: 100, clientY: 100 });
  assert.equal(intercepted, true);
  const menu = env.created[0];
  assert.equal(menu.hidden, false);
  assert.ok(menu.innerHTML.includes('data-entry-feed-action="delete"'));
  const button = { dataset: { entryFeedAction: 'delete' } };
  document.dispatchEvent({ type: 'click', target: { closest: selector => selector === '[data-entry-feed-action]' ? button : null }, preventDefault() {} });
  assert.equal(dialog.open, true);
  assert.ok(dialog.innerHTML.includes('value="delete" selected'));
  await env.input('entry-explanation', 'Eliminamos solamente la segunda aparición.');
  await env.submit('entry-correction-form');
  const correction = D.replies(post.id).corrections[0];
  assert.equal(correction.edits[0].start, second);
  assert.equal(correction.edits[0].original, 'café');
  assert.equal(correction.edits[0].replacement, '');
  E.close();
  env.selectFeed(post, second, second + 4);
  document.dispatchEvent({ type: 'selectionchange' });
  env.collapseSelection();
  E.open(post.id, { correct: true });
  assert.ok(dialog.innerHTML.includes('<q>café</q>'), 'a button click after selection collapse retains the feed fragment');
});
