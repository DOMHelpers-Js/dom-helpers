# The Module Loader — The Recommended Way to Load DOM Helpers

If you are new to DOM Helpers JS, start here. The Module Loader is a small built-in utility that takes care of loading the library's modules for you — in the right order, without duplicates, and without you having to think about which module depends on which. It is the recommended approach for the vast majority of projects.

---

## The Problem With Loading Modules Manually

DOM Helpers JS is not one big file — it is a collection of focused modules, each covering a specific area:

| Module | What it provides |
|---|---|
| `core` | `Elements`, `Collections`, `Selector`, `createElement` |
| `reactive` | `ReactiveUtils`, reactive state and effects |
| `form` | `Forms`, form validation and submission |
| `animation` | `Animation`, transitions and effects |
| `conditions` | `Conditions`, conditional rendering |
| `enhancers` | Index-based updates, array distribution, collection shortcuts |
| `native-enhance` | Enhanced `document.getElementById`, `querySelector`, `getElementsBy*` |
| `storage` | `StorageUtils`, localStorage and sessionStorage helpers |
| `spa` | `Router`, client-side routing |
| `async` | `AsyncHelpers`, fetch wrappers, debounce, throttle |

Some modules depend on others. For example, `reactive` needs `core` to be loaded first. `native-enhance` needs both `core` and `enhancers`. If you load them in the wrong order, the page breaks.

This means if you manage loading manually with `<script>` tags, you have to know all the rules and keep track of them yourself:

```html
<!-- Manual loading — you must get this exactly right -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.enhancers.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.animation.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.native-enhance.min.js"></script>
```

This is fragile. The URLs are long. The order matters. Add a new module and you need to figure out where it fits. Swap two tags by accident and things fail silently.

With the Module Loader, you write this instead:

```js
await load('reactive', 'animation', 'native-enhance');
```

That is it. One line. The loader handles the rest.

---

## What the Module Loader Does

The Module Loader is a single small file you load once. After that, you call `load()` with the names of the modules you want. It:

1. **Figures out the correct load order automatically.** You list what you need — it resolves the dependencies behind the scenes.
2. **Injects missing dependencies.** If you ask for `native-enhance`, it loads `core` and `enhancers` first even if you did not mention them.
3. **Never loads the same module twice.** If a module is already available on the page — loaded by any means — the loader skips it silently.
4. **Handles concurrent requests safely.** If two parts of your code both try to load the same module at the same time, only one network request is made.
5. **Gives you clear error messages.** If you misspell a module name or have a network failure, the error tells you exactly what went wrong and what the valid options are.

---

## How it Works Internally (Simply Explained)

The loader knows about every module and its dependencies. This knowledge is stored as a simple map called the **dependency graph**:

```
core             → no dependencies
storage          → no dependencies
spa              → no dependencies
enhancers        → needs core
reactive         → needs core
conditions       → needs core
form             → needs core
animation        → needs core
async            → needs core
native-enhance   → needs core AND enhancers
```

When you call `load('native-enhance', 'reactive')`, the loader runs a **topological sort** — a standard algorithm that takes a list of things with dependencies and produces an ordered list where each item comes after everything it depends on.

For `load('native-enhance', 'reactive')` the sorted result is:

```
core  →  enhancers  →  native-enhance  →  reactive
```

The loader then works through this list one step at a time. Before loading each module it checks whether it is already present on `window`. If it is, that step is skipped. If not, it fetches and runs the module file, then moves to the next.

This is the entire mechanism. There is nothing magic about it — just a dependency graph, a sort algorithm, and a sequential load loop. The result is that **you only ever need to say what you want, not how to get it**.

---

## Dependency Graph at a Glance

```
┌──────────────────────────────────────────────────────────────┐
│                         STANDALONE                            │
│          core           storage           spa                 │
└─────────────────────────────┬────────────────────────────────┘
                              │  (core is required by)
          ┌───────────────────┼──────────────────────┐
          │           │       │        │              │
      enhancers  reactive   form  animation  conditions  async
          │
          │  (enhancers is also required by)
          │
    native-enhance
```

**Standalone modules** — `core`, `storage`, and `spa` have no dependencies. Load them directly.

**Core-dependent modules** — `reactive`, `form`, `animation`, `conditions`, `async`, and `enhancers` all need `core`. You do not need to list `core` yourself — it is added automatically.

**Two-level dependency** — `native-enhance` needs both `core` and `enhancers`. Again, you do not need to list either — just request `native-enhance` and both are loaded first.

**Optional enhancements** — `conditions` and `form` work with just `core`, but gain extra reactive features when `reactive` is also loaded. The loader does **not** add `reactive` automatically in this case — you must request it explicitly if you want those features.

---

## Your First Load Call

### Loading a single module

The most common use case. You want one module, and you want the loader to handle its dependencies:

```js
// Load reactive — core is loaded first automatically
await load('reactive');

// From this point on, ReactiveUtils is available globally
const state = ReactiveUtils.state({ count: 0 });
```

```js
// Load native-enhance — core and enhancers are loaded first automatically
await load('native-enhance');

// From this point on, all document.getElementById / querySelector etc. are enhanced
const btn = document.getElementById('saveBtn');
btn.update({ disabled: false });
```

```js
// Load a standalone module — no dependencies, loads immediately
await load('storage');

StorageUtils.set('theme', 'dark');
```

### Loading multiple modules

Pass multiple names in a single call. Order of the arguments does not matter — the loader resolves the correct sequence:

```js
// Load reactive and animation for a page that needs both
await load('reactive', 'animation');
```

```js
// Load everything a dashboard page needs
await load('reactive', 'conditions', 'storage');
```

```js
// Load in any order you like — the result is identical
await load('animation', 'native-enhance', 'reactive');
// Same as:
await load('reactive', 'animation', 'native-enhance');
// Same as:
await load('native-enhance', 'reactive', 'animation');
```

All three calls above produce the same load sequence: `core → enhancers → native-enhance → reactive → animation`.

### Seeing automatic dependency injection

You never need to list `core` or `enhancers` manually — just ask for what your code actually uses:

```js
// You write:
await load('form');

// Loader resolves and loads in this order:
//   1. core      ← added automatically (form depends on it)
//   2. form      ← what you asked for

// Result: Forms, Elements, and Collections are all available
```

```js
// You write:
await load('native-enhance');

// Loader resolves and loads in this order:
//   1. core           ← added automatically
//   2. enhancers      ← added automatically (native-enhance depends on it)
//   3. native-enhance ← what you asked for
```

```js
// You write:
await load('reactive', 'form', 'conditions');

// Loader resolves and loads in this order:
//   1. core        ← added once (shared dep of all three)
//   2. reactive
//   3. form
//   4. conditions

// Note: core appears only once even though all three depend on it
```

---

## The Loader vs Manual CDN Tags — Side by Side

Here is the same setup written both ways. Judge for yourself which you would rather maintain.

**Scenario:** A contact page that uses form validation, async data fetching, and reactive state.

### Manual CDN approach

```html
<!-- You must know and maintain this exact order -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.form.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.async.min.js"></script>
<script src="./contact.js"></script>
```

Problems with this approach:
- Five tags to write and keep in sync.
- If you add `conditions` later, you have to know it goes after `core` — easy to get wrong.
- The full CDN URL appears on every line. Change the version number and you change five lines.
- No feedback if something is missing or misordered — it just silently fails.

### Module Loader approach

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.loader.esm.min.js"></script>
<script type="module" src="./contact.js"></script>
```

**contact.js:**
```js
await DOMHelpersLoader.load('reactive', 'form', 'async');

// All three modules ready — start the page
initContactForm();
```

Benefits:
- Two tags in HTML regardless of how many modules you use.
- The CDN URL appears exactly once (on the loader).
- Add `conditions` later? Just add it to the `load()` call. Nothing else changes.
- Misspell a module name? You get a clear error: *Unknown module: "conditons". Available modules: core, storage, spa, enhancers, ...*
- Wrong order? Impossible — the loader always resolves the correct sequence.

---

## How to Load the Loader

There are two loader files — one for modern ES module projects and one for classic script projects.

| File | Use with | Syntax |
|---|---|---|
| `dom-helpers.loader.esm.min.js` | `<script type="module">` | `await load()` |
| `dom-helpers.loader.min.js` | `<script src="...">` (classic) | `.then(function() {})` |

---

### Pattern A — ESM inline import

The loader is imported directly inside your own script file. The `load` function is a named export.

**index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My App</title>
</head>
<body>
  <p>Count: <strong id="count">0</strong></p>
  <button id="btn-inc">+1</button>
  <button id="btn-dec">-1</button>
  <button id="btn-reset">Reset</button>

  <!-- Single entry point — app.js handles everything -->
  <script type="module" src="./app.js"></script>
</body>
</html>
```

**app.js**
```js
import { load }        from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.loader.esm.min.js';
import { createStore } from './store.js';
import { initUI }      from './ui.js';

// Load only what this page needs — core resolved automatically
await load('reactive');

// Library is ready — start the app
const store = createStore();
initUI(store);
```

**store.js**
```js
export function createStore() {
  return ReactiveUtils.store(
    { count: 0 },
    {
      actions: {
        increment(state) { state.count++; },
        decrement(state) { state.count--; },
        reset(state)     { state.count = 0; }
      }
    }
  );
}
```

**ui.js**
```js
export function initUI(store) {
  ReactiveUtils.effect(() => {
    document.getElementById('count').textContent = store.count;
  });

  document.getElementById('btn-inc').onclick   = () => store.increment();
  document.getElementById('btn-dec').onclick   = () => store.decrement();
  document.getElementById('btn-reset').onclick = () => store.reset();
}
```

Best for: projects where your app is split across multiple `.js` files and you have a clear entry point.

---

### Pattern B — ESM script tag in HTML

The loader is loaded as its own `<script type="module" src="...">` tag. It sets `window.DOMHelpersLoader` automatically, so your app script uses it without an import statement.

**index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My App</title>
</head>
<body>
  <p>Count: <strong id="count">0</strong></p>
  <button id="btn-inc">+1</button>
  <button id="btn-dec">-1</button>
  <button id="btn-reset">Reset</button>

  <!-- 1. Load the loader — sets DOMHelpersLoader on window -->
  <script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.loader.esm.min.js"></script>

  <!-- 2. App entry point — DOMHelpersLoader is already available -->
  <script type="module" src="./app.js"></script>
</body>
</html>
```

**app.js**
```js
// No import needed — DOMHelpersLoader is already on window
import { createStore } from './store.js';
import { initUI }      from './ui.js';

await DOMHelpersLoader.load('reactive');

const store = createStore();
initUI(store);
```

`store.js` and `ui.js` are identical to Pattern A.

> Both script tags use `type="module"`, which means the browser runs them in the order they appear. The loader tag runs first and sets `DOMHelpersLoader` on `window`. Your `app.js` runs second and finds it already there. This ordering is guaranteed by the HTML spec.

Best for: multi-page sites where the loader tag lives in a shared HTML template. Every page includes the same loader tag and the browser caches it — after the first page load it costs nothing.

```html
<!-- _layout.html — included on every page -->
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.loader.esm.min.js"></script>
```

---

### Pattern C — Classic script (no `type="module"`)

No `type="module"` anywhere. Everything runs in classic global scope. Use `.then()` instead of `await`.

**index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My App</title>
</head>
<body>
  <p>Count: <strong id="count">0</strong></p>
  <button id="btn-inc">+1</button>
  <button id="btn-dec">-1</button>
  <button id="btn-reset">Reset</button>

  <!-- 1. Load the classic loader — sets DOMHelpersLoader on window -->
  <script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.loader.min.js"></script>

  <!-- 2. Load your module files — safe to load before the library,
       they only define functions, they do not call them yet -->
  <script src="./store.js"></script>
  <script src="./ui.js"></script>

  <!-- 3. Load library modules then start the app -->
  <script>
    DOMHelpersLoader.load('reactive').then(function() {
      var store = createStore();
      initUI(store);
    });
  </script>
</body>
</html>
```

**store.js**
```js
// Classic script — expose via window instead of export
window.createStore = function() {
  return ReactiveUtils.store(
    { count: 0 },
    {
      actions: {
        increment: function(state) { state.count++; },
        decrement: function(state) { state.count--; },
        reset:     function(state) { state.count = 0; }
      }
    }
  );
};
```

**ui.js**
```js
// Classic script — expose via window instead of export
window.initUI = function(store) {
  ReactiveUtils.effect(function() {
    document.getElementById('count').textContent = store.count;
  });

  document.getElementById('btn-inc').onclick   = function() { store.increment(); };
  document.getElementById('btn-dec').onclick   = function() { store.decrement(); };
  document.getElementById('btn-reset').onclick = function() { store.reset(); };
};
```

> **Why is it safe to load `store.js` and `ui.js` before calling `load()`?**
> Because `ReactiveUtils` is referenced inside function bodies — not at the top level of the file. The files only define functions. `ReactiveUtils` is only accessed when those functions are actually called, which happens inside `.then()` after the library has fully loaded.

Best for: projects that need to support older browsers, existing codebases that do not use ES modules, or any situation where `type="module"` is not available.

---

## Pattern Comparison

| | Pattern A | Pattern B | Pattern C |
|---|---|---|---|
| Loader access | `import { load }` | `window.DOMHelpersLoader` | `window.DOMHelpersLoader` |
| `type="module"` required | Yes | Yes | No |
| Code shared via | `export` / `import` | `export` / `import` | `window` |
| Async syntax | `await` | `await` | `.then()` |
| Loader file | `loader.esm.min.js` | `loader.esm.min.js` | `loader.min.js` |
| IE11 support | No | No | Yes |

---

## Loading Modules for Different Pages

In a multi-page website, each page typically needs different modules. Each page's script requests only what it needs:

```js
// home/app.js — landing page: animated hero, reactive counter
await DOMHelpersLoader.load('reactive', 'animation');
```

```js
// contact/app.js — contact page: form validation, async submission
await DOMHelpersLoader.load('form', 'async');
```

```js
// dashboard/app.js — dashboard: reactive state, conditional UI, local storage
await DOMHelpersLoader.load('reactive', 'conditions', 'storage');
```

```js
// account/app.js — account settings: forms, storage, native DOM enhancement
await DOMHelpersLoader.load('form', 'storage', 'native-enhance');
```

Each page downloads only the modules it actually uses. The browser cache means any module shared between pages — like `core` — is only downloaded once across the whole site visit.

---

## Optional Enhancements — When to Load Both

Two modules behave differently depending on whether `reactive` is also loaded:

**`conditions`** — works with core alone (static conditional rendering). Gains reactive automatic re-evaluation when `reactive` is also loaded.

**`form`** — works with core alone (standard form handling). Gains reactive form fields and automatic DOM updates when `reactive` is also loaded.

The loader does **not** add `reactive` automatically for these — you decide:

```js
// conditions — static mode only
await load('conditions');

// conditions — with reactive auto-update
await load('reactive', 'conditions');
```

```js
// form — standard mode
await load('form');

// form — with reactive fields
await load('reactive', 'form');
```

If you are unsure, load `reactive` alongside them. The overhead is small and you gain the full feature set.

---

## What Happens After `load()` Resolves

After `await load(...)` resolves, every module you requested (and its dependencies) is available as a global on `window`. You use them directly by name — no import needed, no namespace prefix:

```js
await load('reactive', 'form', 'animation', 'storage');

// All of these are now available:
ReactiveUtils.state({ ... })
ReactiveUtils.effect(() => { ... })
Forms.get('#signup')
Animation.fade(element, 'in')
StorageUtils.set('key', value)

// Core globals are always available when any core-dependent module loads:
Elements.myButton
Collections.ClassName('card')
Selector.query('#main')
createElement('div', { className: 'container' })
```

---

## Structuring Your App Files

A common question: how do I split my code across multiple files when `ReactiveUtils`, `Elements` etc. are not available until `load()` resolves?

The answer is simple: **use globals inside function bodies, not at the top level of your files.**

```js
// store.js

// ✓ Correct — ReactiveUtils is accessed when createStore() is called,
//   which happens after load() resolves in app.js
export function createStore() {
  return ReactiveUtils.store({ count: 0 }, {
    actions: {
      increment(state) { state.count++; },
      decrement(state) { state.count--; }
    }
  });
}

// ✗ Wrong — ReactiveUtils does not exist yet when this file is first parsed
const store = ReactiveUtils.store({ count: 0 }, { ... }); // ReferenceError
```

```js
// app.js — the only file that calls load()
import { load }        from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.loader.esm.min.js';
import { createStore } from './store.js';
import { initUI }      from './ui.js';

// Imports above are safe — they only define functions, they do not call them
await load('reactive');

// load() has resolved — ReactiveUtils is on window — now call the functions
const store = createStore();
initUI(store);
```

Your `store.js` and `ui.js` files do not need to know anything about the loader. They just use the globals. `app.js` is the only file responsible for loading the library.

---

## API Reference

### `load(...modules)`

```js
// Pattern A — named import
import { load } from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.loader.esm.min.js';
await load('reactive');

// Pattern B — via window
await DOMHelpersLoader.load('reactive');

// Pattern C — classic script
DOMHelpersLoader.load('reactive').then(function() { ... });
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `...modules` | string | Yes | One or more module names. Order does not matter. |

**Module names**

| Name | Globals it provides | Auto-loads |
|---|---|---|
| `core` | `Elements`, `Collections`, `Selector`, `createElement` | — |
| `reactive` | `ReactiveUtils` | `core` |
| `form` | `Forms` | `core` |
| `animation` | `Animation` | `core` |
| `conditions` | `Conditions` | `core` |
| `enhancers` | `BulkPropertyUpdaters` + collection extensions | `core` |
| `async` | `AsyncHelpers` | `core` |
| `native-enhance` | Enhanced `document.getElementById` / `querySelector` / `getElementsBy*` | `core`, `enhancers` |
| `storage` | `StorageUtils` | — |
| `spa` | `Router` | — |

**Returns:** `Promise<void>` — resolves when all requested modules and their dependencies are fully initialised.

**Errors**

```js
// No arguments
await load();
// Error: [dom-helpers/loader] load() called with no arguments.
// Available modules: core, storage, spa, enhancers, reactive, ...

// Unrecognised module name
await load('reative'); // typo
// Error: [dom-helpers/loader] Unknown module: "reative".
// Available modules: core, storage, spa, enhancers, reactive, ...

// Network failure
await load('animation');
// Error: [dom-helpers/loader] Failed to load module "animation".
// URL: https://cdn.../dom-helpers.animation.esm.min.js
// Check your network connection or verify the CDN URL is reachable.
```

---

## Behaviour Reference

### Argument order never matters

```js
// These three calls produce identical results
await load('native-enhance', 'reactive', 'animation');
await load('animation', 'reactive', 'native-enhance');
await load('reactive', 'native-enhance', 'animation');

// Resolved sequence is always: core → enhancers → native-enhance → reactive → animation
```

### Already-loaded modules are always skipped

```js
// First call — loads core, then reactive
await load('reactive');

// Second call — core and reactive already on window, only animation loaded
await load('reactive', 'animation');

// Mixing loader with a direct script tag is also fine
// <script src="dom-helpers.core.min.js"> already ran
await load('reactive'); // → skips core (already present), loads only reactive
```

### Concurrent calls share one request

```js
// Both calls run at the same time — only one network request for 'reactive' is made
load('reactive');
load('reactive');
```

### Base URL is auto-detected

The loader reads its own file URL at runtime and loads all module files from the same directory. This means it works on any CDN, any version, any custom host — you never need to configure a base URL.

---

## Frequently Asked Questions

**Do I need to list `core` every time?**

No. Any module that depends on `core` adds it automatically. The only time you would explicitly load `core` on its own is if you want only the core utilities without any other module:

```js
await load('core');
// Elements, Collections, Selector, createElement available — nothing else
```

**Can I still use manual `<script>` tags alongside the loader?**

Yes. The loader checks `window` before every load. If a module is already there from a manual tag, it is skipped:

```html
<script src="dom-helpers.core.min.js"></script>
<script src="dom-helpers.loader.min.js"></script>
<script>
  DOMHelpersLoader.load('reactive', 'animation').then(function() {
    // core was already loaded manually — only reactive and animation were fetched
  });
</script>
```

**What if I call `load()` twice with overlapping modules?**

Safe. Already-loaded modules are always skipped:

```js
await load('reactive', 'animation');
await load('animation', 'form'); // animation skipped — only form is loaded
```

**Can I use the loader without a CDN?**

Yes. Copy the loader file and the module files you need into your project's `dist/` folder. The loader auto-detects its base URL from its own file path, so it will look for module files in the same directory — no configuration needed.

**Can I use the ESM loader without a local server?**

No. Browsers block ES module imports from `file://` URLs. Use a local dev server such as `npx serve` or the VS Code Live Server extension. The classic script loader (Pattern C) works without a server.

**Does the loader work with `import { X } from '...'` named imports?**

The loader and named imports serve different purposes. The loader puts everything on `window` — you do not use `import { Elements } from '...'` alongside it. Named imports are a separate pattern where you import directly from module CDN URLs and get the tools as local variables. See the [loading approaches guide](./loading-approaches.md) for a full comparison.

---

## Quick-Start Cheatsheet

```js
// Single module (dependencies injected automatically)
await load('reactive');

// Multiple modules (any order)
await load('reactive', 'form', 'animation');

// Everything for a fully-featured page
await load('reactive', 'form', 'async', 'conditions', 'storage', 'native-enhance');

// Standalone modules — no core needed
await load('storage');
await load('spa');

// Optional enhancement — request both to get reactive features
await load('reactive', 'conditions');
await load('reactive', 'form');

// Classic script equivalent
DOMHelpersLoader.load('reactive', 'form').then(function() {
  // ready
});
```

---

## When Manual Loading Makes Sense

The Module Loader is the recommended default, but there are situations where manual CDN tags or named imports are a better fit:

- **You are loading the full bundle anyway.** If your page uses most of the library, loading `dom-helpers.full-spa.esm.min.js` as a single tag is simpler than listing every module name.
- **You want tree-shaking.** In a build-tool project (Vite, Webpack, Rollup), named imports from individual module files let the bundler eliminate unused code. The loader is designed for direct CDN use without a build step.
- **You need IE11 and cannot use Promises.** The classic loader requires a Promise polyfill in IE11. A set of plain `<script>` tags in the right order works without any polyfill.
- **You have a performance-critical single-module page.** One direct `<script src="dom-helpers.reactive.esm.min.js">` tag after a `<script src="dom-helpers.core.esm.min.js">` tag is marginally faster than going through the loader on the very first load — but the difference is negligible for any normal page.

For everything else, use the loader.
