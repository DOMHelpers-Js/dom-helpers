# All CDN Links — DOM Helpers JS v2.9.0

## Available Modules

| Module | Gzipped | Standalone? | Globals Exposed |
|--------|---------|-------------|-----------------|
| **Full Bundle** | ~49.7 KB | Yes | `Elements`, `Collections`, `Selector`, `createElement`, `ReactiveUtils`, `ReactiveState`, `StorageUtils`, `Forms`, `Animation`, `AsyncHelpers`, `Router` |
| **Core** | ~9.6 KB | Yes | `Elements`, `Collections`, `Selector`, `createElement` |
| **Enhancers** | ~8.4 KB | Requires Core | Extends `Elements`, `Collections`, `Selector` |
| **Reactive** | ~11.5 KB | Requires Core | `ReactiveUtils`, `ReactiveState` |
| **Conditions** | ~7.2 KB | Requires Core + Reactive *(recommended)* | Extends `Elements`, `Collections`, `Selector` |
| **Storage** | ~1.3 KB | Yes | `StorageUtils` |
| **Native Enhance** | ~2.2 KB | Requires Core + Enhancers | Patches `getElementById`, `getElementsBy*`, `querySelector/All` |
| **Form** | ~6.5 KB | Requires Core | `Forms` |
| **Animation** | ~4.8 KB | Requires Core | `Animation` |
| **Async** | ~3.9 KB | Requires Core | `AsyncHelpers` |
| **SPA Router** | ~3.9 KB | Yes | `Router` |

---

## 1. Full Bundle *(recommended)*

Everything included — all 10 modules in a single file.

```html
<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.full-spa.min.js"></script>

<!-- unpkg -->
<script src="https://unpkg.com/dom-helpers-js@2.9.0/dist/dom-helpers.full-spa.min.js"></script>
```

**Globals:** `Elements`, `Collections`, `Selector`, `createElement`, `ReactiveUtils`, `ReactiveState`, `StorageUtils`, `Forms`, `Animation`, `AsyncHelpers`, `Router`

---

## 2. Core Only

`Elements`, `Collections`, `Selector`, `createElement`. The foundation — all other modules require this.

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.core.min.js"></script>
```

---

## 3. Storage Only

`StorageUtils` — localStorage/sessionStorage with auto-save, watching, and namespacing.
**Fully standalone**, no Core required.

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.storage.min.js"></script>
```

---

## 4. SPA Router Only

`Router` — hash/history routing, guards, transitions, `<router-view>`, `<router-link>`.
**Fully standalone**, no Core required.

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.spa.min.js"></script>
```

---

## 5. Enhancers Only

Bulk DOM updates, shortcuts, indexed operations. **Requires Core.**

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.enhancers.min.js"></script>
```

---

## 6. Conditions Only

Conditional rendering, state-based DOM visibility. **Requires Core.**

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.conditions.min.js"></script>
```

---

## 7. Reactive Only

Reactive state, computed properties, watchers, reactive forms and storage. **Requires Core.**

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.reactive.min.js"></script>
```

---

## 8. Native Enhance Only

Patches `document.getElementById`, `getElementsByClassName/TagName/Name`, `querySelector`, `querySelectorAll` to return DOM Helpers enhanced elements. **Requires Core + Enhancers.**

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.enhancers.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.native-enhance.min.js"></script>
```

---

## 9. Form Only

`Forms` — proxy-based form access, values, validation, serialization, enhanced submission pipeline. **Requires Core.**

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.form.min.js"></script>
```

---

## 10. Animation Only

`Animation` — fadeIn/Out, slideUp/Down/Toggle, transform, animation chains, stagger support, 30 named easing curves. **Requires Core.**

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.animation.min.js"></script>
```

---

## 11. Async Only

`AsyncHelpers` — debounce, throttle, sanitize, sleep, enhanced fetch with retry/timeout, asyncHandler, parallelAll, raceWithTimeout. **Requires Core.**

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.async.min.js"></script>
```

---

## Common Combinations

### Core + Storage (~10.9 KB)
Lightweight DOM access with persistent storage.
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.storage.min.js"></script>
```

### Core + Reactive (~21.1 KB)
DOM access with reactive state management.
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.reactive.min.js"></script>
```

### Core + Enhancers (~18.0 KB)
DOM access with bulk update helpers.
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.enhancers.min.js"></script>
```

### Core + Reactive + Storage (~22.4 KB)
Reactive state with persistent storage.
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.reactive.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.storage.min.js"></script>
```

### Core + SPA Router (~13.5 KB)
Minimal SPA — just routing with basic DOM access.
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.spa.min.js"></script>
```

### Core + Reactive + SPA (~25 KB)
Reactive SPA without form/animation/async overhead.
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.reactive.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.spa.min.js"></script>
```

### Everything à la carte (same as Full Bundle)
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.enhancers.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.reactive.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.conditions.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.storage.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.native-enhance.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.form.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.animation.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.async.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.spa.min.js"></script>
```

---

## npm / ESM (Bundlers)

```bash
npm install dom-helpers-js
```

```js
// Full package (default — all modules)
import { Elements, Collections, Selector, ReactiveUtils, StorageUtils, Forms, Animation, AsyncHelpers, Router } from 'dom-helpers-js';

// Sub-path imports — load only what you need
import { Elements }      from 'dom-helpers-js/core';
import { Elements }      from 'dom-helpers-js/enhancers';
import { Elements }      from 'dom-helpers-js/conditions';
import { ReactiveUtils } from 'dom-helpers-js/reactive';
import { StorageUtils }  from 'dom-helpers-js/storage';
import { Forms }         from 'dom-helpers-js/form';
import { Animation }     from 'dom-helpers-js/animation';
import { AsyncHelpers }  from 'dom-helpers-js/async';
import { Router }        from 'dom-helpers-js/spa';
import 'dom-helpers-js/native-enhance';

// CommonJS
const { Elements }      = require('dom-helpers-js/core');
const { ReactiveUtils } = require('dom-helpers-js/reactive');
const { Router }        = require('dom-helpers-js/spa');
```

---

## Size Reference

| Bundle | Raw | Gzipped |
|--------|-----|---------|
| Full Bundle (`full-spa`) | ~233 KB | ~49.7 KB |
| Core | ~52 KB | ~9.6 KB |
| Enhancers | ~44 KB | ~8.4 KB |
| Reactive | ~44 KB | ~11.5 KB |
| Conditions | ~32 KB | ~7.2 KB |
| Storage | ~4.0 KB | ~1.3 KB |
| Native Enhance | ~10 KB | ~2.2 KB |
| Form | ~30 KB | ~6.5 KB |
| Animation | ~22 KB | ~4.8 KB |
| Async | ~18 KB | ~3.9 KB |
| SPA Router | ~12.5 KB | ~3.9 KB |

---

## Load Order Rules

- **Core, Storage, and SPA Router are standalone** — no dependencies, load them first or alone
- **Enhancers, Reactive, Conditions, Form, Animation, Async require Core** — always load Core first
- **Load Reactive before Conditions** — Conditions detects ReactiveUtils at init time; loading Reactive first enables reactive+static mode
- **Native Enhance requires Core + Enhancers** — load both before Native Enhance
- **Order matters** — always respect the dependency chain when loading individually
- **Do not mix Full Bundle with individual modules** — they overlap and will double-load code
- **Use the Full Bundle** when you need most features; use individual modules to minimize payload
