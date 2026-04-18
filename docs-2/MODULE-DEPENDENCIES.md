# Module Dependencies — DOM Helpers JS

> **Who this page is for:** complete beginners who have never used this library before.
> No prior experience required. Every technical term is explained before it is used.

---

## What is a dependency?

Before we talk about modules, let us explain one word: **dependency**.

A dependency is something a piece of software *needs in order to work*.

Think of it like making a sandwich. Before you can put filling between two slices of bread, you need the bread first. The filling *depends on* the bread. If you try to add the filling without the bread, nothing holds together.

In this library, some modules work on their own — they are their own bread. Others only work *after* you have already loaded a different module. That first module is the dependency. Load it first, and everything works. Skip it, and the module that needs it cannot do its job.

---

## The modules at a glance

DOM Helpers JS is split into **11 modules** (plus a full bundle that includes them all, and a **Module Loader** that handles dependency resolution for you automatically).

Each module does one focused job. You only load the ones you need. Smaller pages load faster — every kilobyte counts.

Here is a quick summary before we go deeper:

| Module | What it does | Needs | Size (gzipped) |
|---|---|---|---|
| **Full Bundle** | Everything in one file | Nothing — standalone | ~49.7 KB |
| **Loader** | Loads modules on demand, resolves deps automatically | Nothing — standalone | ~1 KB |
| **Core** | The foundation — selects and works with page elements | Nothing — standalone | ~9.6 KB |
| **Storage** | Saves and reads data in the browser | Nothing — standalone | ~1.3 KB |
| **SPA Router** | Handles page navigation without full reloads | Nothing — standalone | ~3.9 KB |
| **Enhancers** | Adds bulk and shortcut operations to Core | Core | ~8.4 KB |
| **Reactive** | Adds live, auto-updating state to your page | Core | ~11.5 KB |
| **Form** | Reads, validates, and submits HTML forms | Core | ~6.5 KB |
| **Animation** | Fades, slides, transforms, and chains animations | Core | ~4.8 KB |
| **Async** | Debounce, throttle, fetch helpers, timers | Core | ~3.9 KB |
| **Conditions** | Shows and hides elements based on rules | Core (+ Reactive recommended) | ~7.2 KB |
| **Native Enhance** | Makes browser built-in selectors return enhanced elements | Core + Enhancers | ~2.2 KB |

---

## Group 1 — Standalone modules

These modules have **no dependencies**. Load them in any order, by themselves, and they just work.

### Core

Core is the starting point for almost everything else in the library. It gives you four tools — `Elements`, `Collections`, `Selector`, and `createElement` — that let you find, read, and change things on your web page.

If you are only loading one module, this is the one. If you load any other module (except Storage, SPA Router, or the Full Bundle), you must load Core first.

**Size:** ~9.6 KB gzipped.

---

### Storage

Storage lets you save data in the browser so it persists even after the user closes the tab. It supports auto-save, watching for changes, and keeping data organised under named groups (called namespaces).

It has no connection to Core and no connection to any other module. You can use it entirely on its own.

**Size:** ~1.3 KB gzipped.

---

### SPA Router

SPA stands for *Single-Page Application* — a website where clicking a link changes what is shown on screen without doing a full page reload. The SPA Router module handles that navigation: it watches the browser address bar, reads the path, and calls the right part of your code.

Like Storage, it is completely standalone. It does not need Core to function.

**Size:** ~3.9 KB gzipped.

---

## Group 2 — Modules that need Core

These modules extend what Core can do. They **must be loaded after Core**. Think of them as extra tools that only make sense once you have the foundation in place.

### Enhancers

Enhancers adds a wide set of shortcut and bulk-update operations to the `Elements`, `Collections`, and `Selector` objects that Core gives you. Instead of changing one element at a time, you can update dozens in a single call.

Enhancers does not add any new named objects — it quietly expands the ones Core already gave you. The same references just gain extra abilities.

**Needs:** Core.

**Size:** ~8.4 KB gzipped.

---

### Reactive

Reactive adds *live state* to your page. A live state is a value that, when it changes, automatically updates every part of the page that depends on it — without you writing any extra code to keep things in sync.

Reactive also bundles its own built-in versions of async helpers, form handling, and storage — versions that are state-aware and integrate directly with reactive data. See the special note below for what this means in practice.

**Needs:** Core.

**Size:** ~11.5 KB gzipped.

---

### Form

Form gives you a clean way to read values out of HTML forms, validate what the user typed, and submit data. It wraps the browser's built-in form behaviour in a more convenient interface.

This is the *non-reactive* version. It works independently. If you are already using the Reactive module, you do not need to load this separately — Reactive already includes a more powerful, state-aware form handler.

**Needs:** Core.

**Size:** ~6.5 KB gzipped.

---

### Animation

Animation gives you ready-made effects: fade in, fade out, slide up, slide down, slide toggle, transforms, and chains of animations that play one after another. It includes 30 different easing curves (the mathematical shapes that control how fast or slow an animation moves at each point).

**Needs:** Core.

**Size:** ~4.8 KB gzipped.

---

### Async

Async provides helpers for timing-sensitive and network-related tasks. Debounce delays a function so it only fires after the user stops typing (useful for search inputs). Throttle limits how often a function can run. It also includes a smarter version of `fetch` for loading data from a server, plus utilities like `sleep`, `parallelAll`, and `raceWithTimeout`.

This is the *non-reactive* version. If you are using the Reactive module, you do not need this separately — Reactive already includes its own state-aware async helpers.

**Needs:** Core.

**Size:** ~3.9 KB gzipped.

---

## Group 3 — Modules that need Core and a parent module

These modules sit at the end of the chain. They need more than just Core before they can be loaded.

### Conditions

Conditions lets you show and hide elements on the page based on rules you define — for example, show a warning panel only when a certain value is true, or hide a button unless a condition is met.

Conditions works on its own with just Core, but it gains a much more powerful mode when the Reactive module is also present. In that mode, it can watch live state and update the page automatically whenever a rule's outcome changes. Loading Reactive before Conditions turns this extra mode on.

**Needs:** Core. Reactive is strongly recommended for full functionality.

**Size:** ~7.2 KB gzipped.

---

### Native Enhance

Native Enhance patches the browser's own element-selection methods — `getElementById`, `getElementsBy*`, `querySelector`, and `querySelectorAll` — so they return enhanced elements instead of plain browser elements. After loading this module, you get the library's full set of helpers on *any* element you select, even using the browser's built-in functions.

This module needs both Core and Enhancers to be loaded first, because it patches those already-enhanced objects into the native methods.

**Needs:** Core + Enhancers.

**Size:** ~2.2 KB gzipped.

---

## Special case — The Reactive module

The Reactive module behaves differently depending on what else is loaded alongside it. This is worth understanding before you decide what to include.

### Reactive already includes Async, Form, and Storage

When you load Reactive, you automatically get reactive-aware versions of async helpers, form handling, and storage. These built-in versions are more capable than the standalone modules — they can track changes and stay in sync with your reactive state.

This means:

- If you are using Reactive and need form handling, **do not load the Form module separately** — Reactive already covers it.
- If you are using Reactive and need storage, **do not load Storage separately** — Reactive already covers it.
- If you are using Reactive and need async helpers, **do not load Async separately** — Reactive already covers it.

Only load the standalone Form, Storage, or Async modules if you are *not* using Reactive.

| What you want | Use Reactive? | Load Form / Storage / Async separately? |
|---|---|---|
| Form handling, no live state | No | Yes — load Form module |
| Storage, no live state | No | Yes — load Storage module |
| Async helpers, no live state | No | Yes — load Async module |
| All of the above, with live state | Yes | No — already included in Reactive |

### No problem if you load both

If your project already loads the standalone Form, Storage, or Async modules alongside Reactive, nothing breaks. The library detects the situation and handles it automatically. Both sets load and run correctly — the reactive versions simply take over in reactive contexts.

### Conditions gets a power-up from Reactive

As mentioned above, loading Reactive before Conditions gives Conditions access to live state. It can then watch reactive values and update the page automatically when rules change. If Reactive is not present, Conditions still works — it just evaluates rules once, at load time, rather than watching them continuously.

**Always load Reactive before Conditions** to get the full reactive+static mode.

---

## Load order rule

When loading multiple modules manually, follow this order:

```
1. Core            (always first, if you are using it)
2. Storage         (can go anywhere — no dependencies)
3. SPA Router      (can go anywhere — no dependencies)
4. Enhancers       (after Core)
5. Reactive        (after Core, and before Conditions)
6. Form            (after Core — skip if using Reactive)
7. Animation       (after Core)
8. Async           (after Core — skip if using Reactive)
9. Conditions      (after Core, ideally after Reactive)
10. Native Enhance (after Core + Enhancers)
```

You do not need to load every module — only the ones your project actually uses. The order above applies to whichever subset you choose.

**Two shortcuts:**

- If you need most features, load the **Full Bundle** — one file, everything included, no ordering to think about.
- If you want a specific subset, use the **Module Loader** — it resolves the order automatically:
  ```js
  await load('reactive', 'native-enhance', 'animation');
  // → loads: core → enhancers → reactive → animation → native-enhance
  ```

---

## The Module Loader

The loader (`dom-helpers.loader.esm.min.js` / `dom-helpers.loader.min.js`) is a tiny utility (~1 KB gzipped) that takes care of the dependency chain for you. Instead of writing multiple `<script>` tags in the right order, you call `load()` with the modules you want:

```js
// ESM — type="module" environments
import { load } from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.loader.esm.min.js';
await load('reactive', 'conditions', 'native-enhance');
// loads: core → enhancers → reactive → conditions → native-enhance (correct order, automatically)

// Classic — plain <script> tags
DOMHelpersLoader.load('reactive', 'conditions', 'native-enhance').then(function() {
  // all modules ready on window
});
```

**Rules that the loader enforces for you:**

- Core is always loaded before any module that needs it
- Enhancers is loaded before Native Enhance
- Reactive is loaded before Conditions when both are requested
- Already-loaded modules (by any means) are silently skipped — never fetched twice
- Argument order in `load()` does not matter — the correct sequence is resolved from the graph

See [module-loader.md](./module-loader.md) for the full API and usage patterns.

---

## Dependency map

Here is a visual summary showing which modules depend on which:

```
Core  ────────────────────────────────────────────────────────┐
  │                                                           │
  ├── Enhancers ──────── Native Enhance (needs Core + Enhancers)
  │
  ├── Reactive ─────────────────────────────────┐
  │                                             │
  ├── Conditions (works alone; better with Reactive)
  │
  ├── Form
  ├── Animation
  └── Async

Storage     (standalone — no connection to Core)
SPA Router  (standalone — no connection to Core)
```

---

*This page covers module loading and dependencies only. For usage examples and API details, see the main README. For loader patterns and API, see [module-loader.md](./module-loader.md). For all CDN URLs, see [ALL-CDN-LINKS.md](./ALL-CDN-LINKS.md).*
