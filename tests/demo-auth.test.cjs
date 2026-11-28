'use strict';
// Controller-boundary checks with the real local data store and a small DOM harness.
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const { webcrypto } = require('node:crypto');
const source = file => fs.readFileSync(path.join(__dirname, '../assets/js/', file), 'utf8');
function element(dataset = {}) {
  return {
    dataset, listeners: new Map(), attributes: {}, disabled: false, value: '', hidden: false,
    textContent: '', innerHTML: '', focused: false,
    addEventListener(type, listener) { this.listeners.set(type, listener); },
    setAttribute(name, value) { this.attributes[name] = value; },
    focus() { this.focused = true; },
    async click() { await this.listeners.get('click')?.({ currentTarget: this, preventDefault() {} }); }
  };
}
function environment({ language = 'es', collision = false } = {}) {
  const memory = new Map();
  const failures = { write: false };
  const redirects = [];
  const fresh = element();
  const error = element();
  const form = element();
  const password = element();
  const input = element();
  const toggle = element();
  const submit = element();
  const demos = [element({ demoLogin: 'sowon' }), element({ demoLogin: 'moderator' })];
  const controls = [fresh, toggle, submit, ...demos];
  form.reportValidity = () => true;
  const mount = element({ demoAuth: 'login' });
  mount.querySelector = selector => ({
    '[data-auth-form]': form, form,
    '[data-password-toggle]': toggle,
    '[data-demo-fresh]': fresh,
    '#auth-password': password,
    input
  })[selector] || null;
  mount.querySelectorAll = selector => selector === 'button' ? controls : selector === '[data-demo-login]' ? demos : [];
  const events = new Map();
  const meta = element();
  const document = {
    documentElement: { lang: language }, title: '',
    querySelector: selector => selector === '[data-demo-auth]' ? mount : selector.startsWith('meta[') ? meta : null,
    querySelectorAll: () => [],
    getElementById: id => id === 'auth-error' ? error : null,
    addEventListener(type, listener) { events.set(type, listener); },
    dispatchEvent(event) { events.get(event.type)?.(event); }
  };
  const context = {
    console, Date, Math, JSON, TextEncoder, Uint8Array, Array, Object, Error, Set, RegExp, Number, String,
    crypto: webcrypto, document,
    location: { assign: value => redirects.push(value), replace: value => redirects.push(value) },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options?.detail; } },
    addEventListener() {},
    localStorage: {
      getItem: key => memory.get(key) ?? null,
      setItem(key, value) { if (failures.write) { const err = new Error('quota'); err.name = 'QuotaExceededError'; throw err; } memory.set(key, value); },
      removeItem: key => memory.delete(key)
    }
  };
  context.window = context;
  vm.createContext(context);
  for (const file of ['demo-seed.js', 'demo-store.js']) vm.runInContext(source(file), context);
  const real = context.DStore;
  const attempts = [];
  context.DStore = { ...real, async register(options) {
    attempts.push(options);
    if (collision && attempts.length === 1) { const err = new Error('USERNAME_TAKEN'); err.code = 'USERNAME_TAKEN'; throw err; }
    return real.register(options);
  } };
  vm.runInContext(source('demo-auth.js'), context);
  return { D: real, mount, fresh, controls, error, redirects, failures, memory, attempts };
}

test('fresh demo button uses real registration, creates a persistent account and routes to onboarding', async () => {
  const env = environment();
  const before = env.D.db().users.length;
  assert.ok(env.mount.innerHTML.includes('Empezar demo desde cero'));
  assert.ok(env.mount.innerHTML.includes('contraseña de prueba:'));
  await env.fresh.click();
  const user = env.D.currentUser();
  assert.equal(env.attempts.length, 1);
  assert.ok(/^demo_[a-z0-9]+$/.test(user.username));
  assert.ok(user.username.length <= 24);
  assert.equal(user.email, `${user.username}@diarito.demo`);
  assert.equal(user.onboardingComplete, false);
  assert.equal(user.firstChallengeComplete, false);
  assert.equal(env.D.db().users.length, before + 1);
  assert.deepEqual(env.redirects, ['onboarding.html']);
  assert.ok(!env.memory.get(env.D.storageKey).includes('DiaritoDemo1!'));
  env.D.logout();
  await env.D.login(user.username, 'DiaritoDemo1!');
  assert.equal(env.D.currentUser().id, user.id);
});

test('fresh demo retries identity collisions through registration instead of bypassing validation', async () => {
  const env = environment({ collision: true });
  const before = env.D.db().users.length;
  await env.fresh.click();
  assert.equal(env.attempts.length, 2);
  assert.equal(env.D.db().users.length, before + 1);
  assert.deepEqual(env.redirects, ['onboarding.html']);
});

test('fresh demo storage failure re-enables controls, localizes error and leaves no session', async () => {
  const env = environment({ language: 'ko' });
  const before = env.D.db().users.length;
  env.failures.write = true;
  await env.fresh.click();
  assert.equal(env.D.currentUser(), null);
  assert.equal(env.D.db().users.length, before);
  assert.deepEqual(env.redirects, []);
  assert.ok(env.controls.every(control => control.disabled === false));
  assert.equal(env.error.hidden, false);
  assert.ok(env.error.textContent.includes('저장 공간이 부족'));
});
