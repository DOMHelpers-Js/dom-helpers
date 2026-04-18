[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# What Is DOM Helpers

## Welcome

DOM Helpers is a modular JavaScript library for working with the browser's DOM. It is built for developers who write JavaScript directly — without a framework, without a build step, without a virtual DOM.

Its goal is simple: make DOM access, DOM updates, state-driven rendering, form handling, animations, async utilities, SPA routing, and browser storage more structured, more consistent, and easier to maintain as a project grows.

---

## What DOM Helpers Is Not

Before explaining what the library provides, it helps to be clear about what it is not.

DOM Helpers is not a framework. It does not impose a component model or dictate how you structure your application. It works directly with the browser's DOM APIs — you still use the same elements, the same events, and the same browser APIs you already know.

It is not a compilation target. There is no JSX, no templates, no syntax transformation. You write plain JavaScript.

It is not opinionated about your application structure. It provides tools. How you organize those tools in your project is your decision.

---

## What DOM Helpers Provides

DOM Helpers is organized into ten modules. Each module addresses one concern:

### core — Find elements and update them

The core module gives you three helpers for accessing DOM elements:

- **Elements** — access any element by its `id` attribute, with automatic caching
- **Collections** — access groups of elements by class name, tag name, or `name` attribute
- **Selector** — access elements using full CSS selectors

Every element returned by these helpers has a `.update()` method attached to it. This method accepts a configuration object and applies any combination of changes — text content, styles, classes, attributes, event listeners — in a single, consistent call.

```javascript
// Access an element and update it
Elements.myButton.update({
  textContent: 'Loading...',
  disabled: true,
  style: { opacity: '0.7' }
});

// Access a group and update each element
Collections.ClassName.cards.forEach(card => {
  card.update({ classList: { add: 'visible' } });
});
```

---

### enhancers — Shortcuts and extended capabilities

The enhancers module adds convenience tools on top of the core. These include:

- `Id()` — a short global function for element access by ID
- `ClassName`, `TagName`, `Name` — global shortcuts for collection access
- `query()`, `queryAll()` — global functions for CSS selector access
- Bulk property updaters — update the same property across many elements in one call
- `Elements.update()` — update multiple elements with different properties in one call

```javascript
// Id shortcut — concise element access
Id('submitBtn').update({ disabled: true, textContent: 'Saving...' });

// Collection shortcut — no Collections. prefix needed
ClassName.btn.forEach(btn => btn.update({ disabled: false }));

// Bulk updater — same property, many elements, one call
Elements.textContent({
  title: 'Dashboard',
  subtitle: 'Welcome back',
  footer: '© 2024'
});
```

---

### native-enhance — DOM Helpers power through native browser APIs

The native-enhance module silently upgrades `document.getElementById`, `document.getElementsBy*`, and `document.querySelector` so that every element they return comes pre-equipped with `.update()` and all DOM Helpers methods — without changing a single line of your existing code.

```javascript
// Your existing code — unchanged
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

No migration needed. Load the module and your existing DOM calls immediately gain the full API.

---

### reactive — Reactive state and automatic updates

The reactive module lets you create JavaScript objects whose property changes automatically trigger effects, recompute derived values, and update the DOM — without any manual calls.

The recommended way to use reactive is through the **global shortcut functions** — no `ReactiveUtils.` prefix needed:

```javascript
// Create reactive state
const app = state({ count: 0, theme: 'light', user: null });

// Effects run automatically when the state they read changes
effect(() => {
  Elements.countDisplay.textContent = app.count;
  Elements.incrementBtn.disabled = app.count >= 10;
});

// Computed values update automatically
const doubled = computed(app, {
  value: function() { return this.count * 2; }
});

// Watch a specific property
watch(app, 'theme', (newTheme) => {
  Elements.body.update({ className: 'theme-' + newTheme });
});

// Group multiple changes into one update cycle
batch(() => {
  app.count = 0;
  app.theme = 'light';
});
```

---

### conditions — State-driven DOM rendering

The conditions module lets you describe what the DOM should look like for each possible state value. When the state changes, conditions automatically applies the matching configuration.

Instead of writing `if`/`else` blocks that reach into the DOM:

```javascript
// Without conditions — logic and DOM mixed together
if (status === 'loading') {
  document.getElementById('panel').textContent = 'Loading...';
  document.getElementById('panel').className = 'panel loading';
} else if (status === 'done') {
  document.getElementById('panel').textContent = 'Ready';
  document.getElementById('panel').className = 'panel ready';
}
```

You declare the mapping once:

```javascript
// With conditions — each state is a clear, self-contained block
Conditions.whenState(
  () => status.value,
  {
    'loading': { '#panel': { textContent: 'Loading...', className: 'panel loading' } },
    'done':    { '#panel': { textContent: 'Ready',      className: 'panel ready'  } }
  }
);
```

When `status.value` changes, conditions applies the right configuration automatically.

---

### storage — Browser storage with a clean interface

The storage module (`StorageUtils`) wraps `localStorage` and `sessionStorage` with a simpler API. It handles JSON serialization automatically, supports namespaces to organize keys, and can watch for storage changes across browser tabs.

```javascript
// Save any JavaScript value — no JSON.stringify needed
StorageUtils.save('user', { name: 'Alice', role: 'admin' });

// Load it back — correct type, no JSON.parse needed
const user = StorageUtils.load('user');  // → { name: 'Alice', role: 'admin' }

// Watch for changes in other tabs
StorageUtils.watch('theme', (newTheme) => {
  Elements.body.update({ className: newTheme });
});
```

---

### dom-form — Form handling without the boilerplate

The DOM Form module (`Forms`) gives every form in your page a clean API for reading values, validating fields, and submitting data — without manually wiring up each input.

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

No manual `querySelector` for each field. No custom serialization loop. No separate validation library needed.

---

### animation — Animations directly on elements

The animation module adds `fadeIn`, `fadeOut`, `slideUp`, `slideDown`, `transform`, and a chainable `.animate()` builder directly onto every element and collection returned by the core.

```javascript
// Fade an element in
await Elements.myPanel.fadeIn();

// Slide a sidebar closed
await Elements.sidebar.slideUp({ duration: 400 });

// Chain a sequence of animations
await Elements.notification
  .animate()
  .fadeIn({ duration: 200 })
  .delay(3000)
  .fadeOut({ duration: 300 })
  .play();

// Animate a collection with stagger
await Collections.ClassName.cards.fadeIn({ duration: 300, stagger: 100 });
```

No CSS class juggling. No `setTimeout` chains. Animations are awaitable and composable.

---

### async — Async utilities for real-world patterns

The async module (`AsyncHelpers`) provides utilities for the most common async patterns: debouncing, throttling, fetch with timeout and retry, sleep, parallel execution, and async event handler wrappers.

```javascript
// Debounce a search input — wait until typing stops
const search = AsyncHelpers.debounce((e) => {
  fetchResults(e.target.value);
}, 400);

input.addEventListener('input', search);

// Fetch with timeout and automatic retry
const data = await AsyncHelpers.fetchJSON('/api/products', {
  timeout: 5000,
  retries: 2
});

// Wrap an async handler with automatic loading state
button.addEventListener('click', AsyncHelpers.asyncHandler(async () => {
  await saveData();
}, { loadingClass: 'saving' }));
```

---

### spa — Client-side routing for Single Page Applications

The SPA Router module (`Router`) turns any static HTML page into a multi-page application with real URLs, browser history, animated view transitions, and navigation guards — all without a page reload.

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
```

Add auth protection in one line:

```javascript
Router.requireAuth(() => !!localStorage.getItem('token'), '/login');
```

Works on any static host. Zero dependencies. Zero server configuration required in hash mode.

---

## How the Ten Modules Relate

Each module has a distinct responsibility. None of them overlap:

```
User interaction
      ↓
SPA Router — intercepts navigation, mounts views, runs lifecycle hooks
      ↓
Reactive — state changes trigger effects and computed values
      ↓
Conditions — maps state to DOM configurations, applies them automatically
      ↓
Core + Enhancers — find elements and apply changes via .update()
      ↓
Native Enhance — upgrades getElementById/querySelector with .update()
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

You do not need all ten modules. Start with what you need today — add the others as your project grows.

---

## A Concrete First Look

Here is a notification system built with DOM Helpers: it shows a message when the user clicks a button, then fades it out after three seconds.

```html
<button id="notifyBtn">Show Notification</button>
<div id="notification" style="display: none;"></div>
```

```javascript
Id('notifyBtn').update({
  addEventListener: {
    click: async () => {
      // Show and populate
      Elements.notification.update({
        textContent: 'Changes saved successfully.',
        style: { display: 'block', backgroundColor: '#d4edda', color: '#155724', padding: '12px' }
      });

      // Animate out after 3 seconds
      await Elements.notification.animate()
        .delay(3000)
        .fadeOut({ duration: 300 })
        .play();

      Elements.notification.update({ style: { display: 'none' } });
    }
  }
});
```

No `document.getElementById`. No `addEventListener` called separately. No `setTimeout` chains for animation. One consistent pattern for everything.

---

## Who This Is For

DOM Helpers is for developers who:

- Write JavaScript directly, without a framework
- Want more structure than raw DOM manipulation provides
- Work on interactive pages where elements respond to user actions, data loads, and stored preferences
- Want form handling, animations, and async utilities without pulling in separate libraries for each
- Need client-side routing without the overhead of a full SPA framework
- Want persistence handled cleanly without building their own localStorage wrapper

If you are building a static page with minimal interactivity, you may not need this library. If you are building interactive pages — with routing, forms, animations, and state-driven UI — DOM Helpers provides the structure to do that cleanly with plain JavaScript.

---

## This Getting Started Section

This section prepares you to understand and use DOM Helpers correctly. It covers:

1. **[Why DOM Helpers Exists](./02_why-dom-helpers-exists.md)** — the specific problems in plain JavaScript that motivated this library
2. **[Architecture Overview](./03_architecture-overview.md)** — the ten modules explained in depth, with code for each
3. **[Why Modules Are Separated](./04_why-modules-are-separated.md)** — why the structure is designed the way it is, and why it matters for learning
4. **[Recommended Usage](./05_recommended-usage.md)** — the access patterns, update patterns, and conventions that lead to clean code
5. **[How Modules Work Together](./06_how-modules-work-together.md)** — complete examples showing all modules in a real flow
6. **[Plain JavaScript vs DOM Helpers](./07_plain-js-vs-dom-helpers.md)** — the same feature built twice, explained clearly
7. **[Reactive](./09_reactive.md)** — reactive state, effects, computed values, and the recommended shortcut-first approach
8. **[What to Learn Next](./08_whats-next.md)** — a guided path through the full module documentation

Read these in order. Each page builds on the previous one.

---

## Begin

The next page explains why DOM Helpers was built — starting from real friction points in plain JavaScript.

- **[Why DOM Helpers Exists](./02_why-dom-helpers-exists.md)**
