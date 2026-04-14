# How to Load DOM Helpers JS — The Four Approaches

DOM Helpers JS gives you four ways to load the library into a page: **Classic**, **Deferred**, **Named Imports**, and the **Module Loader**. Each one affects when the library is available, how it interacts with the rest of your scripts, and how much code the browser downloads.

This guide covers all four — what they do, when to use them, and the practical patterns you will actually write.

---

## Approach 1 — Classic

### What it is

A plain `<script src="...">` tag. The browser fetches the file, runs it, and moves on. All of the library's tools are attached to the global `window` object so they are available in every script on the page.

### How it works

The browser parses HTML from top to bottom. When it hits a classic `<script>` tag it **stops parsing**, downloads the file, executes it, and only then continues. This is called render-blocking — the page does not appear until the script has finished loading and running.

### Pattern A — Script in the `<head>` (render-blocking)

The most common mistake. The script blocks the page from rendering, and your DOM does not exist yet when the library runs.

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Browser stops here. Downloads the library. Runs it.
       Your <body> content does not exist yet at this point. -->
  <script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.full-spa.min.js"></script>
</head>
<body>
  <button id="btn">Click me</button>

  <script>
    // This runs immediately after the library tag above.
    // Elements, Collections etc. are available — that part is fine.
    // But document.getElementById('btn') returns null here
    // because the <body> has not been parsed yet.
    const btn = Elements.get('#btn'); // null — too early
  </script>
</body>
</html>
```

If you put the library in `<head>` and need to touch the DOM, wait for it to be ready first using `DOMContentLoaded`.

### Pattern B — Script in `<head>` with `DOMContentLoaded`

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.full-spa.min.js"></script>
  <script>
    // The library is loaded. Now wait for the DOM to be ready
    // before doing anything with it.
    document.addEventListener('DOMContentLoaded', function () {
      const btn = Elements.get('#btn');
      btn.on('click', function () {
        console.log('clicked');
      });
    });
  </script>
</head>
<body>
  <button id="btn">Click me</button>
</body>
</html>
```

The page still blocks on the library download, but your code no longer runs before the DOM exists.

### Pattern C — Scripts at the bottom of `<body>`

The classic fix for both problems. The HTML is already parsed before the browser reaches the script tags, so the DOM is ready and there is no need for `DOMContentLoaded`.

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <button id="btn">Click me</button>

  <!-- Load the library last, just before </body>.
       The DOM is already built at this point. -->
  <script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.full-spa.min.js"></script>
  <script>
    // No DOMContentLoaded needed — the DOM already exists.
    const btn = Elements.get('#btn');
    btn.on('click', function () {
      console.log('clicked');
    });
  </script>
</body>
</html>
```

This is the standard Classic setup. Simple and reliable.

### Pattern D — `defer` attribute

`defer` is a native HTML attribute that gives you non-blocking loading on a plain `<script src>` tag — no `type="module"` required. The browser downloads the file in the background and runs it after the DOM is fully parsed, in the order the tags appear.

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Downloads in the background. Runs after the DOM is parsed.
       Scripts execute in the order they appear, top to bottom. -->
  <script defer src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.full-spa.min.js"></script>
  <script defer src="app.js"></script>
</head>
<body>
  <button id="btn">Click me</button>
</body>
</html>
```

**app.js**
```js
// Runs after the DOM is ready and after the library script has executed.
// No DOMContentLoaded needed.
const btn = Elements.get('#btn');
btn.on('click', function () {
  console.log('clicked');
});
```

`defer` guarantees execution order — the library script always runs before `app.js` because it appears first in the HTML. That makes it safe to use the library directly in `app.js` without any extra waiting.

This is the best Classic pattern when you need IE11 compatibility but still want non-blocking loading. It behaves almost identically to the Deferred approach (`type="module"`), without the module system.

> **`defer` vs bottom-of-`<body>`** — both achieve DOM-ready execution, but `defer` starts the download earlier (while the `<head>` is still being parsed) so the file arrives sooner. On slow connections this is a meaningful difference.

### Pattern E — `async` attribute (and why not to use it for the library)

`async` also downloads in the background, but it runs the script the instant the download finishes — regardless of whether the DOM is ready or other scripts have run.

```html
<!-- Do not do this for the library. -->
<script async src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.full-spa.min.js"></script>
<script async src="app.js"></script>
```

The problem: `app.js` might finish downloading before the library does and execute first. When it tries to call `Elements.get(...)`, `Elements` does not exist yet and you get a `ReferenceError`.

`async` gives you no execution order guarantees at all. Two `async` scripts race each other on every page load — which one wins depends on network conditions at that moment.

**When is `async` actually useful?** For truly independent scripts that do not depend on anything else and nothing depends on them — analytics snippets, third-party widgets, ad tags. DOM Helpers JS is a dependency, so `async` is the wrong tool here.

```
Timing overview for a script in <head>:

Plain <script>:   ████ parse HTML  |STOP| ←download→ ←run→ | resume parse ████
defer:            ████ parse HTML ←download in background→  | ←run→ | ████
async:            ████ parse HTML ←download in background→ |←run→| ████ (interrupts)
type="module":    ████ parse HTML ←download in background→  | ←run→ | ████
```

`defer` and `type="module"` behave the same in terms of timing. The difference is that `type="module"` also enables the ES module system (`import`/`export`), while `defer` keeps everything in classic global scope.

### When to use Classic

- Single-file projects and quick demos
- You need to support old browsers (including IE11)
- You want the simplest possible setup with no module system

### Trade-offs

- **Render-blocking by default.** A plain `<script src>` in `<head>` blocks the page. Fix it with `defer`, bottom-of-`<body>`, or `DOMContentLoaded`.
- **Do not use `async` for the library.** It gives no execution order guarantees — your own scripts may run before the library finishes loading.
- **All tools are global.** `Elements`, `Collections`, `Selector`, etc. all land on `window`. Convenient, but there is nothing stopping another script from accidentally overwriting them.

---

## Approach 2 — Deferred

### What it is

Adding `type="module"` to a script tag makes it deferred by default. The browser downloads it in the background while the page continues parsing, then runs it after the DOM is fully built. All the library's tools still end up on `window`, just like Classic — but without blocking the page.

### How it works

`type="module"` changes two things:

1. **Non-blocking download.** The file is fetched in parallel with HTML parsing.
2. **Runs after the DOM is ready.** Execution is deferred until the page is fully parsed — the equivalent of wrapping everything in `DOMContentLoaded`, automatically.

### Pattern — Deferred load

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Downloaded in the background. Does not block rendering.
       Runs automatically after the DOM is ready. -->
  <script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.full-spa.esm.min.js"></script>
</head>
<body>
  <button id="btn">Click me</button>

  <!-- This script also needs type="module" if it relies on the library,
       because module scripts execute after all module scripts are loaded. -->
  <script type="module">
    // No DOMContentLoaded needed.
    // The library has run and the DOM is ready.
    const btn = Elements.get('#btn');
    btn.on('click', function () {
      console.log('clicked');
    });
  </script>
</body>
</html>
```

Notice: both the library tag and your own script use `type="module"`. This ensures your script runs after the library has executed. If your script uses `type="module"` but the library tag does not (or vice versa), execution order is not guaranteed.

### Pattern — Deferred with multiple pages

Load the library once per page. Because the tools land on `window`, every inline script and every classic script on that page can use them.

```html
<head>
  <script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.full-spa.esm.min.js"></script>
</head>
```

Then in any `<script type="module">` block on the page:

```js
// Elements, Collections, Selector etc. are already on window.
// No import needed — just use them.
const form = Forms.get('#contact-form');
```

### When to use Deferred

- Most websites and web apps — it is the recommended default
- You want the simplicity of Classic (globals on `window`) without the render-blocking penalty
- Multi-page sites where the same library tag appears on every page

### Trade-offs

- **Modern browsers only.** `type="module"` is not supported in IE11. For most projects this is not a concern.
- **Module scripts have their own scope.** Variables declared with `let` or `const` inside a `<script type="module">` block are not global. Only the library's own tools get placed on `window`.
- **Strict mode is automatic.** Module scripts always run in strict mode. Code that relies on sloppy-mode behavior (undeclared variables, `with` statements, etc.) will throw errors.
- **ESM version only.** You must use the `.esm.min.js` CDN link. The classic `.min.js` link is not compatible with `type="module"`.

---

## Approach 3 — Named Imports

### What it is

Instead of loading the full bundle, you use `import { ... } from '...'` to pull in only the specific tools your project needs. Nothing else is downloaded. This is the native JavaScript module system — the same syntax used in Node.js and modern front-end frameworks.

Like Deferred, module scripts are non-blocking and run after the DOM is ready.

### How it works

You write a `<script type="module">` block and declare exactly what you need at the top with `import` statements. The browser fetches only the module files you reference.

### Pattern A — Importing from the full bundle

When you need most of the library, import from the full bundle file. You only write what you actually use, but you are still downloading the full bundle.

```html
<script type="module">
  import { Elements, Forms, Router }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.full-spa.esm.min.js';

  // Only Elements, Forms, and Router are bound — but the full file was downloaded.
  const form = Forms.get('#signup');
  form.onSubmit(function (data) {
    console.log(data);
  });
</script>
```

### Pattern B — Importing from individual module files (true partial loading)

When you want the browser to download only what you need, import from the individual module files. Each `import` line is a separate network request — only include lines for modules you actually use.

```html
<script type="module">
  // Only Core and Forms are downloaded. Nothing else.
  import { Elements, Collections, Selector, createElement }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.core.esm.min.js';

  import { Forms }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.form.esm.min.js';

  const form = Forms.get('#signup');
  form.onSubmit(function (data) {
    console.log(data);
  });
</script>
```

### Pattern C — Entry-point file for multi-file projects

In a project split across multiple `.js` files, import the library once in your main entry-point file and use it from there. You do not repeat the CDN URL in every file.

**index.html**
```html
<script type="module" src="app.js"></script>
```

**app.js** (your entry point)
```js
import { Elements, Forms, Router }
  from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.full-spa.esm.min.js';

// Wire up your pages
import './pages/home.js';
import './pages/contact.js';
```

**pages/contact.js**
```js
// Re-import from the same CDN URL.
// The browser caches the module — it is NOT downloaded again.
import { Forms }
  from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.full-spa.esm.min.js';

const form = Forms.get('#contact-form');
form.onSubmit(function (data) {
  console.log(data);
});
```

The browser's module cache means the same URL is only fetched once regardless of how many files import from it.

### Pattern D — Side-effect modules (Enhancers, Conditions, Native Enhance)

Some modules extend existing tools without adding new named exports — they just need to run. Import them without binding a name.

```html
<script type="module">
  import { Elements, Collections, Selector, createElement }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.core.esm.min.js';

  // Enhancers extends Elements, Collections, and Selector in place.
  // No named export — import it as a side effect.
  import 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.enhancers.esm.min.js';

  // Elements now has the extra methods that Enhancers adds.
  Elements.get('#list').addClasses('active', 'visible');
</script>
```

### When to use Named Imports

- Projects with multiple `.js` files
- You want to download only the modules your project actually uses
- You want each file to declare its own dependencies explicitly

### Trade-offs

- **Tools are not automatically global.** `Elements`, `Forms`, etc. only exist inside the script that imported them. Other scripts need their own `import` — or use the entry-point pattern above.
- **More to write upfront.** For a quick demo, writing `import` lines is more friction than a single `<script src>` tag.
- **Load order still matters for individual modules.** When importing from individual files, dependencies must be loaded first. Always import Core before Enhancers, Reactive before Conditions, and so on. See the CDN reference for the full dependency chain.
- **Same modern-browser requirement as Deferred.** No IE11.

---

## Side-by-Side Comparison

| | Classic | Classic + `defer` | Deferred (`type="module"`) | Named Imports | Loader |
|---|---|---|---|---|---|
| **Tag syntax** | `<script src="...">` | `<script defer src="...">` | `<script type="module" src="...">` | `<script type="module"> import { } </script>` | `load('reactive')` |
| **Blocks page rendering?** | Yes | No | No | No | No |
| **Execution order guaranteed?** | Yes (blocks) | Yes (order of appearance) | Yes (order of appearance) | Yes (order of appearance) | Yes (sequential) |
| **DOM ready when it runs?** | Not guaranteed | Always | Always | Always | Always |
| **Tools available globally?** | Yes — on `window` | Yes — on `window` | Yes — on `window` | No — only in the importing script | Yes — on `window` |
| **What gets downloaded?** | Full bundle | Full bundle | Full bundle | Only the modules you import | Only the modules you request |
| **Works in IE11?** | Yes | Yes | No | No | Classic loader: Yes |
| **Strict mode?** | No | No | Yes (automatic) | Yes (automatic) | Depends on loader variant |
| **Dependency resolution?** | Manual | Manual | Manual | Manual | Automatic |
| **Module system (`import`/`export`)?** | No | No | Yes | Yes | Optional |
| **Best for** | Quick demos, simplest setup | Old-browser support + non-blocking | Most websites and apps | Multi-file projects, minimal payload | Pick-and-mix modules, no bundler |

---

## Approach 4 — Module Loader

### What it is

A small utility (~867–973 B gzipped) that lets you request only the modules your page needs and resolves the correct load order automatically. You never write multiple `<script>` tags or think about which module must come before which.

### How it works

You call `load('reactive', 'animation')` and the loader walks the dependency graph, loads `core` first (automatically, because both need it), then loads the two modules you asked for. If anything is already on `window` it is silently skipped.

### ESM variant — `<script type="module">`

```html
<head>
  <script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.loader.esm.min.js"></script>
</head>
<body>
  <!-- ... -->
  <script type="module" src="./app.js"></script>
</body>
```

```js
// app.js — use the window global set by the loader src tag
await DOMHelpersLoader.load('reactive', 'animation');

// OR — import load directly
import { load } from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.loader.esm.min.js';
await load('reactive', 'animation');
```

### Classic script variant — plain `<script>`

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.loader.min.js"></script>
<script>
  DOMHelpersLoader.load('reactive', 'animation').then(function() {
    var state = ReactiveUtils.state({ count: 0 });
  });
</script>
```

### Available module names

`core`, `storage`, `spa`, `enhancers`, `reactive`, `conditions`, `form`, `animation`, `async`, `native-enhance`

### When to use the Loader

- You only need 2–3 modules and do not want the overhead of the full bundle
- You want auto-resolved dependencies — no hand-managed script order
- You are building a multi-page site where different pages need different modules
- You want pick-and-mix module loading without setting up a bundler

### Trade-offs

- **Globals on `window`**, same as Classic and Deferred — not scoped like Named Imports
- **Sequential loading** — modules load one after another (dependencies first). Independent modules that could be parallelised are not currently loaded in parallel
- **Tiny extra file** — the loader itself adds ~867–973 B gzipped on top of the modules it loads

> For the full loader API and advanced patterns (multi-file apps, classic script apps, FAQ), see [module-loader.md](./module-loader.md).

---

## Decision Guide

**Do you need IE11 or old-browser support?**
Use Classic. It is the only approach that works everywhere. If you also want auto-resolved module loading, use the Classic Script Loader variant.

**Do you have a project split across multiple `.js` files, or do you want to download only what you use, with explicit imports?**
Use Named Imports. Import once per file, rely on the browser's module cache to avoid duplicate downloads.

**Do you want pick-and-mix modules without managing load order yourself and without a bundler?**
Use the Module Loader. Call `load('reactive', 'animation')` — dependencies resolved automatically, only those modules downloaded.

**Does none of the above apply — you just want to get something working quickly?**
Use Deferred. One tag in `<head>`, everything available globally, no render-blocking.

**Are you unsure?**
Use Deferred and switch to Named Imports or the Loader later if the project grows.

---

## Recommendation for Getting Started

Start with **Deferred**.

```html
<head>
  <script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/dom-helpers.full-spa.esm.min.js"></script>
</head>
```

Then write your own code in a `<script type="module">` block anywhere in the page:

```html
<script type="module">
  // The DOM is ready. The library is loaded. Start here.
  const btn = Elements.get('#btn');
  btn.on('click', function () {
    console.log('clicked');
  });
</script>
```

No `DOMContentLoaded`. No script placement worries. No render-blocking. When the project grows and you want finer control over what gets loaded, Named Imports is the natural next step.
