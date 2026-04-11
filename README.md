# DOM Helpers JS

High-performance vanilla JavaScript DOM utilities with intelligent caching, reactive state management, conditional rendering, animations, async utilities, and a built-in SPA router.

[![npm version](https://img.shields.io/npm/v/dom-helpers-js.svg)](https://www.npmjs.com/package/dom-helpers-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![jsDelivr](https://data.jsdelivr.com/v1/package/gh/DOMHelpers-Js/dom-helpers/badge)](https://www.jsdelivr.com/package/gh/DOMHelpers-Js/dom-helpers)

---

## Features

- **Smart Element Access** — ID, class, tag, and name-based DOM access with automatic caching
- **Reactive State** — Vue-like reactivity with computed properties, watchers, and stores
- **Chainable Updates** — Universal `.update()` method for updating any property at once
- **High Performance** — Intelligent caching, fine-grained change detection, WeakMap tracking
- **Zero Dependencies** — Pure vanilla JavaScript, no external libraries
- **Modular** — Load only what you need via individual dist files or the full bundle
- **CDN Ready** — Drop-in `<script>` tag or npm install
- **Native Enhance** — Patches `getElementById`, `getElementsBy*`, `querySelector/All` to return enhanced elements
- **Form Module** — Non-reactive form handling: values, validation, serialization, enhanced submission
- **Animation Module** — CSS transition animations: fadeIn/Out, slideUp/Down, transforms, chains, stagger
- **Async Utilities** — debounce, throttle, enhanced fetch, parallelAll, raceWithTimeout, sanitize
- **SPA Router** — Client-side routing with hash/history mode, guards, transitions, declarative links *(v2.9.0)*

---

## Installation

No install, no build step. Pick the approach that fits your project.

---

### 1. Classic *(simplest)*

One script tag, all globals available immediately on `window`:

```html
<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.full-spa.min.js"></script>

<!-- unpkg -->
<script src="https://unpkg.com/dom-helpers-js@2.9.2/dist/dom-helpers.full-spa.min.js"></script>
```

```html
<script>
  Elements.title.update({ textContent: 'Hello!' });
  const state = ReactiveUtils.state({ count: 0 });
</script>
```

**Globals:** `Elements`, `Collections`, `Selector`, `createElement`, `ReactiveUtils`, `ReactiveState`, `StorageUtils`, `Forms`, `Animation`, `AsyncHelpers`, `Router`

---

### 2. Deferred *(globals + non-blocking)*

Same globals as Classic, but the script is deferred — page renders before the library executes. Two equivalent forms:

```html
<!-- inline import -->
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.full-spa.esm.min.js';
</script>

<!-- or shorter — src attribute, identical result -->
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.full-spa.esm.min.js"></script>
```

```html
<script type="module">
  Elements.title.update({ textContent: 'Hello!' });
  const state = ReactiveUtils.state({ count: 0 });
</script>
```

---

### 3. Modular *(structured projects)*

Build multi-file projects without a bundler. Load the library **once** in your entry point — all globals are available in every file with no repeated CDN URLs:

```html
<!-- index.html -->
<script type="module" src="./app.js"></script>
```

```js
// app.js — load library once as side-effect, then import your own modules
import 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.full-spa.esm.min.js';

import { initRouter } from './router.js';
import { createStore } from './store.js';

const store = createStore();
initRouter(store);
```

```js
// store.js — no CDN import needed, ReactiveUtils already on window
export function createStore() {
  return ReactiveUtils.store(
    { user: null, cart: [] },
    { actions: { login(state, user) { state.user = user; } } }
  );
}
```

```js
// router.js — no CDN import needed, Router already on window
export function initRouter(store) {
  Router.define([
    { path: '/',      view: '#home',  title: 'Home' },
    { path: '/about', view: '#about', title: 'About' },
    { path: '*',      view: '#404',   title: 'Not Found' }
  ]);
  Router.mount('#app').start({ mode: 'hash' });
}
```

```js
// pages/home.js — any file, any depth — just use globals directly
export function mountHome(store, onCleanup) {
  Elements.title.update({ textContent: 'Home' });
  const unwatch = store.$watch('count', val => {
    Elements.counter.update({ textContent: val });
  });
  onCleanup(() => unwatch?.());
}
```

> One CDN import in the entire project. Every other file stays clean.

---

### 4. Named Imports *(explicit dependencies)*

Import only the names your file actually uses. Each import comes from its own individual module file — only those files are downloaded.

```html
<!-- index.html -->
<script type="module" src="./app.js"></script>
```

```js
// app.js — import exactly what you need from each module file
import { Elements, Collections, Selector, createElement }
  from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js';
import { ReactiveUtils }
  from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.esm.min.js';
import { Router }
  from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.spa.esm.min.js';
import { StorageUtils }
  from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.storage.esm.min.js';
```

Pass them explicitly to the modules that need them:

```js
// store.js — receives ReactiveUtils as a parameter
export function createStore(ReactiveUtils) {
  return ReactiveUtils.store(
    { user: null, cart: [] },
    { actions: { login(state, user) { state.user = user; } } }
  );
}
```

```js
// router.js — receives Router as a parameter
export function initRouter(store, Router) {
  Router.define([
    { path: '/',      view: '#home',  title: 'Home' },
    { path: '/about', view: '#about', title: 'About' },
    { path: '*',      view: '#404',   title: 'Not Found' }
  ]);
  Router.mount('#app').start({ mode: 'hash' });
}
```

> **What gets downloaded:** only the module files you import — not the full bundle.
>
> **Note:** Enhancers, Conditions, and Native Enhance extend existing objects in place and have no new named exports. Load them as side-effects:
> ```js
> import 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.enhancers.esm.min.js';
> import 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.conditions.esm.min.js';
> ```

> For the full list of per-module named exports and combination examples, see [ALL-CDN-LINKS.md](./ALL-CDN-LINKS.md).

---

## Quick Start

### Classic

```html
<!DOCTYPE html>
<html>
<body>
  <h1 id="title">Hello</h1>
  <button id="counter">Count: 0</button>
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>

  <script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.full-spa.min.js"></script>
  <script>
    // Access by ID
    Elements.title.update({ textContent: 'Welcome!', style: { color: 'blue' } });

    // Access by class
    Collections.ClassName.card.update({ style: { padding: '10px', background: '#f0f0f0' } });

    // Reactive counter
    const state = ReactiveUtils.state({ count: 0 });
    Elements.counter.addEventListener('click', () => {
      state.count++;
      Elements.counter.textContent = `Count: ${state.count}`;
    });
  </script>
</body>
</html>
```

### Modular

```html
<!-- index.html — load library once, then your entry point -->
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.full-spa.esm.min.js"></script>
<script type="module" src="./app.js"></script>
```

```js
// app.js — all globals already available, just import your own modules
import { initUI } from './ui.js';

initUI();
```

```js
// ui.js — no CDN import needed, globals are on window
export function initUI() {
  // Access by ID
  Elements.title.update({ textContent: 'Welcome!', style: { color: 'blue' } });

  // Access by class
  Collections.ClassName.card.update({ style: { padding: '10px', background: '#f0f0f0' } });

  // Reactive counter
  const state = ReactiveUtils.state({ count: 0 });
  Elements.counter.addEventListener('click', () => {
    state.count++;
    Elements.counter.textContent = `Count: ${state.count}`;
  });
}
```

### Named Imports

```html
<!-- index.html -->
<script type="module" src="./app.js"></script>
```

```js
// app.js — import only what you need, from individual module files
import { Elements, Collections }
  from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js';
import { ReactiveUtils }
  from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.esm.min.js';

// Access by ID
Elements.title.update({ textContent: 'Welcome!', style: { color: 'blue' } });

// Access by class
Collections.ClassName.card.update({ style: { padding: '10px', background: '#f0f0f0' } });

// Reactive counter
const state = ReactiveUtils.state({ count: 0 });
Elements.counter.addEventListener('click', () => {
  state.count++;
  Elements.counter.textContent = `Count: ${state.count}`;
});
```

### SPA in 10 lines

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.full-spa.min.js"></script>
<script>
  Router.define([
    { path: '/',      view: '#home',  title: 'Home' },
    { path: '/about', view: '#about', title: 'About' },
    { path: '*',      view: '#404',   title: 'Not Found' }
  ]);

  Router.mount('#app').start({ mode: 'hash' });
</script>
```

---

## Module Reference

### Module 01 — Core

Foundation for all other modules. Provides `Elements`, `Collections`, `Selector`, `createElement`.

```javascript
// Access by ID
Elements.myButton.update({
  textContent: 'Submit',
  style: { color: 'white', backgroundColor: '#007bff' },
  disabled: false,
  addEventListener: ['click', handleClick]
});

// Bulk update multiple IDs at once
Elements.update({
  title:    { textContent: 'New Title', style: { fontSize: '24px' } },
  subtitle: { textContent: 'New Subtitle' },
  button:   { disabled: false }
});

// Access by class name
Collections.ClassName.card.forEach(el => console.log(el.textContent));
Collections.ClassName.card.update({ style: { border: '1px solid #ccc' } });

// Access by tag
Collections.TagName.div.update({ style: { margin: '0' } });

// Access by name attribute
Collections.Name.username.update({ placeholder: 'Enter username' });

// querySelector / querySelectorAll
const header = Selector.query('#header');
header.update({ textContent: 'Updated' });

const inputs = Selector.queryAll('input[required]');
inputs.update({ classList: { add: 'required-field' } });

// createElement
const btn = createElement('button', {
  textContent: 'Click Me',
  className: 'btn',
  addEventListener: ['click', () => alert('Hi')]
});
```

---

### Module 02 — Enhancers

Bulk DOM updates, shortcuts, indexed operations. **Requires Core.**

```javascript
// Bulk text update for multiple IDs
Elements.textContent({ title: 'New Title', desc: 'New Description' });

// Bulk style update
Elements.style({ title: { color: 'blue' }, desc: { color: 'gray' } });

// Index-based updates
Collections.ClassName.items[0].update({ style: { fontWeight: 'bold' } });
Collections.ClassName.items[-1].update({ style: { opacity: '0.5' } }); // last item
```

---

### Module 03 — Reactive

Vue-like reactivity: state, computed properties, watchers, forms, stores. **Requires Core.**

```javascript
// Basic state
const state = ReactiveUtils.state({ count: 0, name: 'John' });

state.$watch('count', (newVal, oldVal) => {
  Elements.counter.update({ textContent: `Count: ${newVal}` });
});

state.count++; // triggers watcher

// Computed properties
state.$computed('doubled', function() { return this.count * 2; });
console.log(state.doubled); // auto-updated

// Store pattern
const store = ReactiveUtils.store(
  { user: null, cart: [] },
  {
    getters:  { isLoggedIn() { return this.user !== null; } },
    actions:  { login(state, user) { state.user = user; } }
  }
);
store.login({ name: 'Alice' });
console.log(store.isLoggedIn); // true
```

---

### Module 04 — Conditions

Conditional rendering and state-based DOM visibility. **Requires Core.**

```javascript
ConditionalRendering.apply(element, {
  condition: state.isLoggedIn,
  true:  { style: { display: 'block' } },
  false: { style: { display: 'none' } }
});
```

---

### Module 05 — Storage

`StorageUtils` — localStorage/sessionStorage with namespacing, watching, and auto-save. **Standalone.**

```javascript
StorageUtils.set('user', { name: 'Alice', role: 'admin' });
const user = StorageUtils.get('user');
StorageUtils.watch('theme', (newVal) => applyTheme(newVal));
```

---

### Module 06 — Native Enhance

Patches native DOM methods to return enhanced elements. **Requires Core + Enhancers.**

```javascript
// After loading native-enhance, native methods return enhanced elements:
const btn = document.getElementById('submit-btn');
btn.update({ textContent: 'Submit', disabled: false }); // .update() available

const cards = document.getElementsByClassName('card');
cards.update({ classList: { add: 'loaded' } });

const inputs = document.querySelectorAll('input[required]');
inputs.update({ classList: { add: 'required-field' } });
```

---

### Module 07 — Form

`Forms` — proxy-based form access, values, validation, serialization, enhanced submission. **Requires Core.**

```javascript
const form = Forms.contactForm; // access by id="contactForm"

// Read / write values
const data = form.values; // { name: 'Alice', email: '...', ... }
form.values = { name: 'Bob' };

// Validate
const result = form.validate({
  email:   { required: true, email: true },
  message: { required: true, minLength: 10 }
});
if (!result.isValid) return;

// Submit via fetch
await form.submitData({
  url:            '/api/contact',
  successMessage: 'Message sent!',
  resetOnSuccess: true,
  retryAttempts:  2
});

// Declarative — zero JS required
// <form id="contactForm" data-enhanced data-submit-url="/api/contact" data-success-message="Done!">
```

---

### Module 08 — Animation

CSS transition animations on every element and collection. **Requires Core.**

```javascript
await Elements.modal.fadeIn({ duration: 300, easing: 'ease-out-cubic' });
await Elements.notification.fadeOut();
await Elements.panel.slideToggle();
await Elements.card.transform({ translateX: '100px', scale: 1.05 });

// Animation chains
await Elements.toast.animate()
  .fadeIn({ duration: 250 })
  .delay(3000)
  .fadeOut({ duration: 200 })
  .play();

// Stagger collections
await Collections.ClassName.card.fadeIn({ duration: 400, stagger: 80 });

// Inside .update()
Elements.card.update({ textContent: 'Updated!', fadeIn: { duration: 500 } });

// Standalone
await Animation.fadeIn(document.querySelector('.hero'), { duration: 600 });
```

30 named easing curves — `ease-out-back`, `ease-in-expo`, `ease-in-out-cubic`, and more.

---

### Module 09 — Async

`AsyncHelpers` — debounce, throttle, fetch, sanitize, and more. **Requires Core.**

```javascript
// Debounce
const search = AsyncHelpers.debounce(async (q) => {
  const results = await AsyncHelpers.fetchJSON(`/api/search?q=${q}`);
  renderResults(results);
}, 350);

// Throttle
const onScroll = AsyncHelpers.throttle(() => updateProgress(), 16);
window.addEventListener('scroll', onScroll, { passive: true });

// Enhanced fetch — timeout, retry, exponential backoff
const data = await AsyncHelpers.fetch('/api/data', {
  retries: 3, retryDelay: 1000, exponentialBackoff: true, timeout: 10000
});

// Parallel requests
const [users, orders] = await AsyncHelpers.parallelAll([
  AsyncHelpers.fetchJSON('/api/users'),
  AsyncHelpers.fetchJSON('/api/orders')
]);

// Async button handler with automatic loading state
button.addEventListener('click', AsyncHelpers.asyncHandler(async () => {
  await saveData();
}, { errorHandler: (err) => alert(err.message) }));

// Sanitize user input
const safe = AsyncHelpers.sanitize(userInput, { removeScripts: true, removeEvents: true });
```

---

### Module 10 — SPA Router

Client-side routing with hash/history mode, guards, transitions, and declarative components. **Standalone.**

```javascript
Router.define([
  {
    path: '/',
    view: '#view-home',
    title: 'Home',
  },
  {
    path: '/user/:id',
    view: '#view-user',
    title: 'Profile',
    onEnter(params, query, onCleanup) {
      Elements.userName.update({ textContent: params.id });
      const timer = setInterval(tick, 1000);
      onCleanup(() => clearInterval(timer)); // auto-cleanup on leave
    }
  },
  {
    path: '/admin',
    view: '#view-admin',
    guard: () => isLoggedIn() || Router.go('/login'),
  },
  { path: '*', view: '#view-404', title: '404' }
]);

Router.beforeEach((to, from, next) => {
  console.log('Navigating to', to.path);
  next(); // must call next() to proceed
});

Router.afterEach((to) => {
  analytics.track(to.path);
});

Router.mount('#app').start({ mode: 'hash', scrollToTop: true });

// Navigate programmatically
Router.go('/user/42');
Router.back();
Router.replace('/login');

// Declarative links in HTML
// <router-link to="/about">About</router-link>
// <router-view></router-view>
```

---

## Universal `.update()` Method

Every element and collection has `.update()` — a single method that handles any DOM property:

```javascript
element.update({
  // Content
  textContent: 'Text',
  innerHTML: '<b>HTML</b>',

  // Properties
  value: 'input value',
  disabled: true,
  checked: true,

  // Styles
  style: { color: 'red', backgroundColor: '#f0f0f0' },

  // Classes
  classList: { add: ['a', 'b'], remove: 'old', toggle: 'active' },

  // Attributes
  setAttribute: { 'data-id': '123', 'aria-label': 'Button' },

  // Dataset
  dataset: { userId: '123', role: 'admin' },

  // Events
  addEventListener: ['click', handleClick],

  // Animation keys (when Animation module loaded)
  fadeIn:      { duration: 300 },
  slideDown:   { easing: 'ease-out-cubic' },
  transform:   { translateX: '100px', scale: 1.1 }
});
```

---

## Size Reference

| Bundle | Gzipped |
|--------|---------|
| **Full Bundle** (`full-spa`) | ~49.7 KB |
| Core | ~9.6 KB |
| Enhancers | ~8.4 KB |
| Reactive | ~11.5 KB |
| Conditions | ~7.2 KB |
| Storage | ~1.3 KB |
| Native Enhance | ~2.2 KB |
| Form | ~6.5 KB |
| Animation | ~4.8 KB |
| Async | ~3.9 KB |
| SPA Router | ~3.9 KB |

---

## Browser Support

- Chrome / Edge — latest 2 versions
- Firefox — latest 2 versions
- Safari — latest 2 versions
- Opera — latest 2 versions

---

## License

MIT © DOMHelpers-Js

---

## Links

- [GitHub Repository](https://github.com/DOMHelpers-Js/dom-helpers)
- [npm Package](https://www.npmjs.com/package/dom-helpers-js)
- [All CDN Links](./ALL-CDN-LINKS.md)
