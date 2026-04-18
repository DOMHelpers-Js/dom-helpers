[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Architecture Overview

## How DOM Helpers Is Organized

DOM Helpers is not a single file with every feature packed into it. It is organized into ten distinct modules, each with a specific responsibility. Understanding what each module does — and why — is the most important step before learning individual APIs.

```
DOM Helpers
├── core            — Find and update DOM elements
├── enhancers       — Shortcuts and convenience tools that extend the core
├── native-enhance  — Upgrade native browser APIs with .update() automatically
├── reactive        — Reactive state, effects, computed values, and DOM binding
├── conditions      — Declarative logic for state-driven DOM changes
├── storage         — Browser storage with a clean, structured interface
├── dom-form        — Form reading, validation, and submission
├── animation       — Awaitable animations on elements and collections
├── async           — Debounce, throttle, fetch, sleep, and async utilities
└── spa             — Client-side routing for Single Page Applications
```

Each module has a different job. None of them tries to do everything.

---

## The Core Module

**Responsibility:** Finding DOM elements and updating them.

The core is the foundation. Every other module builds on top of it or works alongside it. It contains three helpers:

- **Elements** — accesses elements by their `id` attribute. Uses internal caching so each element is only looked up once.
- **Collections** — accesses groups of elements by class name, tag name, or `name` attribute. Returns live, enhanced collections.
- **Selector** — accesses elements using full CSS selectors, for cases where ID or class access is not enough.

Every element returned by the core automatically has a `.update()` method attached to it. This method accepts a single configuration object and applies any combination of changes — text, styles, classes, attributes, event listeners — in one call.

```javascript
// Access by ID — .update() is already there
Elements.myButton.update({
  textContent: 'Loading...',
  disabled: true,
  style: { opacity: '0.6' }
});

// Access by class
Collections.ClassName.cards.forEach(card => {
  card.update({ classList: { add: 'loaded' } });
});

// Access by CSS selector
Selector.query('.form-group input').update({
  setAttribute: { placeholder: 'Enter your email' }
});
```

The core is where all DOM interaction happens. It does not manage application logic, storage, or routing. It focuses entirely on giving you clean access to your elements.

---

## The Enhancers Module

**Responsibility:** Providing shortcuts and extended capabilities that build on the core.

The enhancers are optional tools that make common operations more concise. They do not introduce new concepts — they make existing ones faster to write.

**Id Shortcut** — A global `Id()` function for the shortest possible element access:

```javascript
Id('myButton').update({ textContent: 'Save' });
```

**Collection Shortcuts** — Global `ClassName`, `TagName`, and `Name` variables that remove the `Collections.` prefix:

```javascript
ClassName.btn.forEach(el => el.update({ disabled: true }));
ClassName.btn[-1].update({ textContent: 'Last Button' });  // negative index
```

**Global Query** — Global `query()` / `queryAll()` for selector access without the `Selector.` prefix:

```javascript
query('#title').update({ textContent: 'Hello' });
queryAll('.card').update({ style: { opacity: '1' } });
```

**Bulk Property Updaters** — Update the same property across many elements in one call:

```javascript
Elements.textContent({
  title: 'Welcome Back',
  subtitle: 'Your data is ready',
  footer: '© 2024'
});
```

**Elements.update()** — Apply full update objects to multiple ID-based elements at once:

```javascript
Elements.update({
  userName:   { textContent: user.name },
  userAvatar: { setAttribute: { src: user.avatar } },
  loginBtn:   { style: { display: 'none' } },
  logoutBtn:  { style: { display: 'block' } }
});
```

---

## The Native Enhance Module

**Responsibility:** Upgrading native browser DOM APIs so they return fully-enhanced elements automatically.

The native-enhance module silently patches `document.getElementById`, `document.getElementsBy*`, and `document.querySelector` so that every element they return comes pre-equipped with `.update()` and all DOM Helpers methods — without changing a single line of your existing code.

```javascript
// Your existing code — completely unchanged
const btn = document.getElementById('submitBtn');

// But now the returned element has full DOM Helpers power
btn.update({
  textContent: 'Saving...',
  disabled: true,
  style: { opacity: '0.6' }
});

// getElementsByClassName also returns enhanced elements
const cards = document.getElementsByClassName('card');
cards[0].update({ classList: { add: 'highlighted' } });

// querySelector too
const panel = document.querySelector('.main-panel');
panel.update({ style: { display: 'none' } });
```

This module is ideal for projects that already use native APIs extensively and want to adopt DOM Helpers gradually — without refactoring existing code.

---

## The Reactive Module

**Responsibility:** Managing reactive state that automatically propagates changes through your application and into the DOM.

The reactive module provides a system where JavaScript objects become "reactive" — they track their own changes and automatically run side effects, recompute derived values, and update the DOM when their properties change.

The recommended way to use the reactive module is through the **global shortcut functions** — no `ReactiveUtils.` prefix needed:

```javascript
// Create reactive state
const app = state({ count: 0, user: null, theme: 'light' });

// Run code automatically whenever accessed state changes
effect(() => {
  Elements.countDisplay.textContent = app.count;
  Elements.incrementBtn.disabled = app.count >= 10;
});

// Computed values — derived automatically from state
const doubled = computed(app, {
  value: function() { return this.count * 2; }
});

// Watch a specific property for changes
watch(app, 'theme', (newTheme) => {
  Elements.body.update({ className: 'theme-' + newTheme });
});

// Batch multiple state changes into one update cycle
batch(() => {
  app.count = 0;
  app.user = null;
  app.theme = 'light';
});
```

Available global shortcut functions: `state`, `effect`, `computed`, `watch`, `batch`, `ref`, `refs`.

---

## The Conditions Module

**Responsibility:** Mapping application state to DOM changes declaratively.

Instead of writing `if`/`else` blocks that reach into the DOM every time something changes, you describe what the DOM should look like for each possible state — and Conditions applies the right configuration automatically.

```javascript
Conditions.whenState(
  () => userStatus.value,
  {
    'loading': {
      '#statusPanel': { textContent: 'Loading...', className: 'panel loading' }
    },
    'online': {
      '#statusPanel': { textContent: 'Connected', className: 'panel online' }
    },
    'offline': {
      '#statusPanel': { textContent: 'Disconnected', className: 'panel offline' }
    }
  }
);
```

When `userStatus.value` changes, Conditions automatically finds the matching branch and applies it. This keeps logic out of your DOM update functions and keeps DOM update configurations out of your logic.

---

## The Storage Module

**Responsibility:** Reading and writing browser storage with a clean, structured interface.

`StorageUtils` wraps `localStorage` and `sessionStorage` with a straightforward API. It handles JSON serialization automatically, supports namespaces to prevent key collisions, and provides cross-tab watching.

```javascript
// Save any JavaScript value directly
StorageUtils.save('user', { name: 'Alice', role: 'admin' });

// Load it back — correct types, no JSON.parse needed
const user = StorageUtils.load('user');  // → { name: 'Alice', role: 'admin' }

// Watch for changes (including from other tabs)
StorageUtils.watch('theme', (newTheme) => {
  Elements.body.update({ className: newTheme });
});
```

---

## The DOM Form Module

**Responsibility:** Reading, validating, and submitting HTML forms without boilerplate.

`Forms` gives every form in your page a clean API — no manual `querySelector` per field, no custom serialization, no separate validation library.

```javascript
// Read all form values instantly
const data = Forms.loginForm.values;
// → { email: 'user@example.com', password: 'secret' }

// Validate before submitting
const { isValid, errors } = Forms.loginForm.validate();

// Submit with a single call
await Forms.loginForm.submitData({
  url: '/api/login',
  onSuccess: (result) => Router.go('/dashboard'),
  onError:   (err)    => showError(err.message)
});
```

---

## The Animation Module

**Responsibility:** Adding awaitable, composable animations directly onto elements and collections.

The animation module extends every element and collection returned by the core with `fadeIn`, `fadeOut`, `slideUp`, `slideDown`, `transform`, and a chainable `.animate()` builder.

```javascript
// Fade an element in
await Elements.myPanel.fadeIn();

// Slide a sidebar closed
await Elements.sidebar.slideUp({ duration: 400 });

// Chain a full animation sequence — awaitable
await Elements.notification
  .animate()
  .fadeIn({ duration: 200 })
  .delay(3000)
  .fadeOut({ duration: 300 })
  .play();

// Staggered collection animation
await Collections.ClassName.cards.fadeIn({ duration: 300, stagger: 100 });
```

No CSS class juggling. No `setTimeout` chains. All animations are promises — you can `await` them and chain logic after they complete.

---

## The Async Module

**Responsibility:** Utilities for the most common async patterns in browser JavaScript.

`AsyncHelpers` provides debounce, throttle, fetch with timeout and retry, sleep, parallel execution, and async event handler wrappers — the patterns you write repeatedly in every project.

```javascript
// Debounce a search input
const search = AsyncHelpers.debounce((e) => {
  fetchResults(e.target.value);
}, 400);

input.addEventListener('input', search);

// Fetch with timeout and retry
const data = await AsyncHelpers.fetchJSON('/api/products', {
  timeout: 5000,
  retries: 2
});

// Wrap an async handler — automatic loading state, error handling
button.addEventListener('click', AsyncHelpers.asyncHandler(async () => {
  await saveData();
}, { loadingClass: 'saving' }));
```

---

## The SPA Module

**Responsibility:** Client-side routing for Single Page Applications.

`Router` turns any static HTML page into a multi-page application with real URLs, browser history, animated view transitions, and navigation guards — without a page reload and without server configuration (in hash mode).

```javascript
Router
  .define([
    { path: '/',         view: '#home-template',  title: 'Home' },
    { path: '/about',    view: '#about-template', title: 'About' },
    { path: '/user/:id', view: '#user-template',
      onEnter: (params) => loadUser(params.id) },
    { path: '*',         view: '#404-template',   title: 'Not Found' },
  ])
  .mount('#app')
  .setTransition('fade')
  .start({ mode: 'hash' });

// Auth protection in one line
Router.requireAuth(() => !!localStorage.getItem('token'), '/login');
```

The router is split into four optional sub-modules: core routing, view transitions, declarative links (`[data-route]`), and navigation guards.

---

## How the Ten Modules Relate

Think of the ten modules as a layered system, where each layer has a distinct role:

```
User interaction
      ↓
SPA Router — intercepts navigation, mounts views, runs lifecycle hooks
      ↓
Reactive — state changes trigger effects and computed values automatically
      ↓
Conditions — maps state values to DOM configurations, applies them
      ↓
Core + Enhancers — find elements and apply changes via .update()
      ↓
Native Enhance — upgrades getElementById / querySelector with .update()
      ↓
DOM (browser)
      ↑
Animation — adds awaitable animations to elements and collections
      ↑
DOM Form — reads, validates, and submits forms cleanly
      ↑
Async — debounce, throttle, fetch, sleep, parallel utilities
      ↑
Storage — persists state, loads saved values on startup, watches across tabs
```

- The **core** talks directly to the DOM — it is the only module that touches HTML elements.
- The **enhancers** sit in front of the core and make access and updates shorter.
- **Native Enhance** extends the native browser APIs so they return enhanced elements automatically.
- The **reactive** module manages state. When state changes, effects run and the DOM reflects the new state.
- The **conditions** module maps state values to DOM configurations and applies them automatically.
- The **storage** module persists data and loads it on startup, feeding initial values into reactive state.
- The **dom-form** module handles form interaction without boilerplate.
- The **animation** module adds awaitable animations without CSS class juggling.
- The **async** module covers the utility patterns that appear in every real project.
- The **SPA** module handles client-side routing and navigation for multi-page apps.

Each layer does its job. None of them overlap into another layer's territory. This is what keeps the codebase predictable as it grows.

---

## Why Ten Modules Instead of One

A single file with every feature would be simpler to load. But it would be harder to understand, harder to maintain, and impossible to use selectively.

With ten modules:

- You can use only what your project needs. A simple static page might only use the core. A complex SPA might use all ten.
- Each module can be learned independently. You do not need to understand the router or reactive to learn element access.
- When something goes wrong, you know which module to look at. A DOM update issue is in the core. A routing issue is in the SPA module. A form submission issue is in dom-form.
- Each module can be improved or updated without touching the others.

This modularity is intentional. It is not a technical limitation — it is a design decision that makes the library easier to learn and easier to use correctly.

---

## What's Next

The next section goes deeper into why modules are broken into sub-modules, and why that matters for how you learn and use the library.

- **[Why Modules Are Separated](./04_why-modules-are-separated.md)** — sub-modules, selective learning, and scalable architecture
