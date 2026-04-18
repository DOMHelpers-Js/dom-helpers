# DOM Helpers JS — Module Loader

The module loader is a small utility that lets you load individual DOM Helpers modules in any order, without worrying about dependencies. It automatically resolves what needs to load first, skips anything already loaded, and gives you a single `load()` call instead of multiple script tags managed by hand.

---

## The Problem It Solves

DOM Helpers JS is split into independent modules — `core`, `reactive`, `animation`, `form`, and so on. Some modules depend on others being loaded first:

```
reactive  → needs core
animation → needs core
form      → needs core
enhancers → needs core
conditions → needs core
native-enhance → needs core AND enhancers
```

Without the loader, you have to manage this yourself. Write the tags in the wrong order and things break silently:

```html
<!-- Wrong order — reactive loads before core, window.Elements does not exist yet -->
<script src="dom-helpers.reactive.min.js"></script>
<script src="dom-helpers.core.min.js"></script>
```

The loader removes this problem entirely. You list what you want, it figures out the rest.

---

## Dependency Graph

```
Standalone — no dependencies:
  core
  storage
  spa

Requires core:
  core → enhancers
  core → reactive
  core → conditions
  core → form
  core → animation
  core → async

Requires core + enhancers:
  core → enhancers → native-enhance
```

Optional enhancements (not hard dependencies):
- `conditions` works with core alone but gains reactive features if `reactive` is also loaded
- `form` works with core alone (non-reactive) but gains reactive form features if `reactive` is also loaded

---

## Two Loader Files

Two builds are provided — one for each world:

| File | For | Script type |
|---|---|---|
| `dom-helpers.loader.esm.min.js` | ES module world | `<script type="module">` |
| `dom-helpers.loader.min.js` | Classic script world | `<script src="...">` |

Both have identical behaviour — same dependency graph, same error messages, same deduplication. Only the internal mechanism differs (dynamic `import()` vs `<script>` tag injection).

---

## Pattern 1 — Inline Import

Load the loader and your app modules in a single inline script block. The `load` function is imported directly as a named export.

**When to use:** You prefer explicit imports and want everything declared in one place.

### File structure

```
my-app/
  index.html
  app.js       ← entry point — imports load, store, ui
  store.js     ← exports createStore()
  ui.js        ← exports initUI()
```

### index.html

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

### app.js

```js
import { load }        from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.loader.esm.min.js';
import { createStore } from './store.js';
import { initUI }      from './ui.js';

// Load only what this page needs — core resolved automatically
await load('reactive');

// Library globals available from this point onwards
const store = createStore();
initUI(store);
```

### store.js

```js
export function createStore() {
  return ReactiveUtils.store(
    { count: 0, user: null },
    {
      actions: {
        increment(state)      { state.count++; },
        decrement(state)      { state.count--; },
        reset(state)          { state.count = 0; },
        login(state, name)    { state.user = name; },
        logout(state)         { state.user = null; }
      }
    }
  );
}
```

### ui.js

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

### What happens at load time

```
Browser parses index.html
  → finds <script type="module" src="./app.js">
  → downloads app.js (deferred, non-blocking)
  → app.js imports load from loader  → downloads loader
  → app.js imports createStore from store.js
  → app.js imports initUI from ui.js
  → await load('reactive')
      → loader resolves: core first, then reactive
      → imports core  → window.Elements, window.Collections etc. set
      → imports reactive → window.ReactiveUtils set
  → createStore() — ReactiveUtils available ✓
  → initUI(store) — ReactiveUtils.effect() available ✓
```

---

## Pattern 2 — Src Attribute (Deferred)

Load the loader as a separate `<script type="module" src="...">` tag. It sets `DOMHelpersLoader` on `window`, so the next script block uses it without an import statement. The loader file is cached by the browser — on pages that include it, it costs nothing after the first load.

**When to use:** You prefer the familiar `<script src>` style for the loader itself, or you want to include the loader in a shared HTML template without coupling it to a specific `app.js`.

### File structure

```
my-app/
  index.html
  app.js       ← entry point — uses DOMHelpersLoader from window
  store.js     ← exports createStore()    (identical to Pattern 1)
  ui.js        ← exports initUI()         (identical to Pattern 1)
```

### index.html

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
  <script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.loader.esm.min.js"></script>

  <!-- 2. App entry point — DOMHelpersLoader is available -->
  <script type="module" src="./app.js"></script>
</body>
</html>
```

### app.js

```js
// No import of load needed — DOMHelpersLoader is already on window
import { createStore } from './store.js';
import { initUI }      from './ui.js';

// Both module scripts are deferred and run in document order —
// DOMHelpersLoader is guaranteed to be set before this script runs
await DOMHelpersLoader.load('reactive');

const store = createStore();
initUI(store);
```

`store.js` and `ui.js` are **identical** to Pattern 1 — they do not change between patterns.

### Multi-page sites

The loader tag can live in a shared HTML template. Every page gets it for free, and the browser caches it after the first request:

```html
<!-- _layout.html / base.html / header.html -->
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.loader.esm.min.js"></script>
```

Each page then has its own `app.js` with its own `DOMHelpersLoader.load()` call, loading only what that specific page needs.

---

## Pattern 3 — Classic Script

No `type="module"` anywhere. Everything runs in classic global scope. Module files expose themselves via `window` instead of `export`, and `.then()` replaces `await`.

**When to use:** You need broad browser compatibility, you are working in an existing codebase that does not use ES modules, or you prefer the traditional script tag workflow.

### File structure

```
my-app/
  index.html
  store.js     ← sets window.createStore (no export)
  ui.js        ← sets window.initUI      (no export)
```

### index.html

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
  <script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.loader.min.js"></script>

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

### store.js

```js
// Classic script — expose via window instead of export
window.createStore = function() {
  return ReactiveUtils.store(
    { count: 0, user: null },
    {
      actions: {
        increment(state)      { state.count++; },
        decrement(state)      { state.count--; },
        reset(state)          { state.count = 0; },
        login(state, name)    { state.user = name; },
        logout(state)         { state.user = null; }
      }
    }
  );
};
```

### ui.js

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
> Because `ReactiveUtils` is referenced inside function bodies — not at the top level of the file. The files only define functions. `ReactiveUtils` is only accessed when those functions are actually called, which happens inside `.then()` after the library has loaded.

---

## API Reference

### `load(...modules)`

Loads one or more modules in the correct dependency order.

```js
// ESM world
import { load } from 'dom-helpers.loader.esm.min.js';
await load('reactive', 'animation');

// Classic world
DOMHelpersLoader.load('reactive', 'animation').then(function() { ... });
```

**Parameters**

| Parameter | Type | Description |
|---|---|---|
| `...modules` | `string` | One or more module names. Order does not matter. |

**Available module names**

| Name | What it provides | Dependencies |
|---|---|---|
| `core` | `Elements`, `Collections`, `Selector`, `createElement` | none |
| `reactive` | `ReactiveUtils`, `ReactiveState` | `core` |
| `storage` | `StorageUtils` | none |
| `spa` | `Router` | none |
| `enhancers` | Bulk updaters, collection shortcuts, ID shortcut | `core` |
| `conditions` | `Conditions`, conditional rendering | `core` |
| `form` | `Forms`, form validation and submission | `core` |
| `animation` | `Animation`, transitions and effects | `core` |
| `async` | `AsyncHelpers`, fetch, debounce, throttle | `core` |
| `native-enhance` | Patches `document.getElementById` and friends | `core` + `enhancers` |

**Returns**

`Promise<void>` — resolves when all requested modules and their dependencies are ready.

**Errors**

```js
// No arguments
await load();
// [dom-helpers/loader] load() called with no arguments.
// Available modules: core, storage, spa, enhancers, ...

// Unknown module name
await load('typo');
// [dom-helpers/loader] Unknown module: "typo".
// Available modules: core, storage, spa, enhancers, ...

// Network failure
await load('reactive');
// [dom-helpers/loader] Failed to load module "reactive".
// URL: https://cdn.../dom-helpers.reactive.esm.min.js
// Check your network connection or verify the URL is reachable.
```

---

## Behaviour Details

### Argument order does not matter

The loader always resolves the correct sequence regardless of what order you write the arguments:

```js
// These three calls produce identical results
await load('animation', 'reactive', 'core', 'native-enhance');
await load('core', 'enhancers', 'reactive', 'animation', 'native-enhance');
await load('native-enhance', 'animation', 'reactive');
```

The resolved sequence is always: `core → enhancers → reactive → animation → native-enhance`.

### Dependencies are injected automatically

You never need to explicitly list dependencies. The loader adds them for you:

```js
// You write:
await load('native-enhance');

// Loader resolves and loads in order:
//   core          (dep of native-enhance, via enhancers)
//   enhancers     (dep of native-enhance)
//   native-enhance
```

### Already-loaded modules are skipped

If a module is already on `window` — loaded by any means, including a direct `<script>` tag, a previous `load()` call, or the full bundle — the loader skips it silently. No duplicate network requests, no double initialisation.

```js
// Core already loaded via <script src="dom-helpers.core.min.js">
await load('reactive');
// → skips core (already on window), loads only reactive
```

### Concurrent calls share one request

If `load()` is called twice at the same time for the same module, only one network request is made. Both callers wait on the same promise:

```js
// Both of these run at the same time
load('reactive');
load('reactive'); // shares the same in-progress request — not loaded twice
```

### Optional enhancements require explicit requests

Some modules work without their optional dependencies but gain extra features when they are present. The loader does **not** add these automatically — you must request them explicitly:

```js
// conditions works, but without reactive features
await load('conditions');

// conditions with reactive features — request both
await load('reactive', 'conditions');

// form in non-reactive mode
await load('form');

// form with reactive form features — request both
await load('reactive', 'form');
```

### Base URL is auto-detected

The loader derives its base URL from its own file location (`import.meta.url` in the ESM build, `document.currentScript.src` in the classic build). All module files are loaded from the same directory as the loader. This means the loader works on any CDN, any version, any custom host — zero hardcoded URLs.

**Classic loader fallback:** if `document.currentScript` is `null` (which can happen when the classic loader is injected dynamically rather than included in the original HTML), the loader falls back to the pinned jsDelivr CDN URL for the current version (`dom-helpers-js@2.10.0`). In practice this only affects dynamically injected script scenarios — the normal `<script src="...">` usage always resolves `document.currentScript` correctly.

---

## Building Modular Apps

The loader is designed to support modular app architecture — splitting your code across multiple files, each with a clear responsibility.

### Recommended structure

```
my-app/
  index.html          ← HTML shell + single script tag
  app.js              ← entry point: loads library, imports modules, starts app
  store.js            ← state and actions
  ui.js               ← DOM updates and event wiring
  router.js           ← page routing logic       (optional)
  api.js              ← data fetching             (optional)
```

### Key rules

**1. Library globals are used inside functions — not at the top level of your files.**

```js
// ✓ Safe — ReactiveUtils is only accessed when createStore() is called
export function createStore() {
  return ReactiveUtils.store({ count: 0 }, { ... });
}

// ✗ Unsafe — ReactiveUtils might not exist yet when this file is parsed
const store = ReactiveUtils.store({ count: 0 }, { ... });
```

**2. `await load()` before calling any function that uses the library.**

```js
import { createStore } from './store.js'; // safe to import before load()

await load('reactive');   // library ready

const store = createStore(); // ✓ ReactiveUtils available
```

**3. Your module files (store.js, ui.js etc.) do not need to know which pattern is used.**

`store.js` and `ui.js` are identical whether you use Pattern 1 or Pattern 2. The pattern choice lives only in `app.js` and `index.html`.

### Splitting across pages

Each page loads only what it needs:

```js
// home/app.js
await load('reactive', 'animation');

// contact/app.js
await load('form', 'async');

// dashboard/app.js
await load('reactive', 'storage', 'conditions');
```

---

## Pattern Comparison

| | Pattern 1 | Pattern 2 | Pattern 3 |
|---|---|---|---|
| Loader access | `import { load }` | `window.DOMHelpersLoader` | `window.DOMHelpersLoader` |
| `type="module"` required | Yes | Yes | No |
| `store.js` shares code via | `export` | `export` | `window` |
| Async syntax | `await` | `await` | `.then()` |
| Loader file | `loader.esm.min.js` | `loader.esm.min.js` | `loader.min.js` |
| IE11 support | No | No | Yes |
| `store.js` / `ui.js` differ between patterns | No | No | Yes |

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge | IE11 |
|---|---|---|---|---|---|
| Pattern 1 (ESM loader + `import`) | 61+ | 60+ | 10.1+ | 16+ | No |
| Pattern 2 (ESM loader + `src` tag) | 61+ | 60+ | 10.1+ | 16+ | No |
| Pattern 3 (classic loader + `.then()`) | All | All | All | All | Yes* |

*IE11 requires a `Promise` polyfill as it does not support Promises natively.

---

## Frequently Asked Questions

**Does loading `storage` also load `core`?**

No. `storage` is standalone — it has no dependency on `core`. Load it directly:

```js
await load('storage'); // just storage, nothing else
```

**Can I mix the loader with direct `<script>` tags?**

Yes. The loader checks `window` before loading anything. If a module is already present from a direct script tag, it is skipped:

```html
<script src="dom-helpers.core.min.js"></script>
<script src="dom-helpers.loader.min.js"></script>
<script>
  DOMHelpersLoader.load('reactive', 'animation').then(function() {
    // core was already on window — only reactive and animation were loaded
  });
</script>
```

**What if I call `load()` twice with overlapping modules?**

Safe. Already-loaded modules are skipped:

```js
await load('reactive', 'animation');
await load('animation', 'form'); // animation skipped, only form loaded
```

**Can I use the ESM loader without a server?**

No. ES modules require a server (even a local one like `npx serve` or VS Code Live Server) because browsers block `import` from `file://` URLs. Pattern 3 (classic script) works without a server.

**I get `DOMHelpersLoader is not defined` in Pattern 2. Why?**

The second script must also use `type="module"`. Classic scripts run before module scripts, so `DOMHelpersLoader` is not set yet when a classic script executes:

```html
<!-- ✗ Wrong — classic script runs before the module loader -->
<script type="module" src="loader.esm.min.js"></script>
<script>
  DOMHelpersLoader.load('reactive'); // undefined
</script>

<!-- ✓ Correct — both module scripts run in document order -->
<script type="module" src="loader.esm.min.js"></script>
<script type="module" src="./app.js"></script>
```
