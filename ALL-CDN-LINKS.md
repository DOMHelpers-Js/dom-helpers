# All CDN Links - DOM Helpers JS

## Available Modules

| Module | Gzipped | Standalone? | Globals Exposed |
|--------|---------|-------------|-----------------|
| **Full Bundle** | 44.6 KB | Yes | `Elements`, `Collections`, `Selector`, `createElement`, `ReactiveUtils`, `ReactiveState`, `StorageUtils`, `Forms`, `FormEnhancements`, `Animation`, `AsyncHelpers` |
| **Core** | 9.6 KB | Yes | `Elements`, `Collections`, `Selector`, `createElement` |
| **Enhancers** | 8.4 KB | Requires Core | Extends `Elements`, `Collections`, `Selector` |
| **Conditions** | 7.2 KB | Requires Core | Extends `Elements`, `Collections`, `Selector` |
| **Reactive** | 11.5 KB | Requires Core | `ReactiveUtils`, `ReactiveState` |
| **Storage** | 1.3 KB | Yes | `StorageUtils` |
| **Native Enhance** | 2.1 KB | Requires Core + Enhancers | Patches `document.getElementById`, `getElementsByClassName/TagName/Name`, `querySelector/querySelectorAll` |

> **New in v2.6.0:** The full bundle now includes the Form module (`Forms`, `FormEnhancements`), Animation module (`Animation`), and Async utilities (`AsyncHelpers`). These are bundled into the full build only — use the full bundle or load the source files directly for script-tag usage.

---

## 1. Full Bundle

Includes everything. Use this if you need all features.

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.min.js"></script>
```

---

## 2. Core Only

`Elements`, `Collections`, `Selector`, `createElement`. Foundation for all other modules.

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>
```

---

## 3. Storage Only

`StorageUtils` — localStorage/sessionStorage with auto-save, watching, and namespacing.
Fully standalone, no other modules required.

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.storage.min.js"></script>
```

---

## 4. Enhancers Only

Bulk DOM updates, shortcuts, indexed operations. **Requires Core.**

```html
<!-- Core first -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>
<!-- Then Enhancers -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.enhancers.min.js"></script>
```

---

## 5. Conditions Only

Conditional rendering, state-based DOM updates. **Requires Core.**

```html
<!-- Core first -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>
<!-- Then Conditions -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.conditions.min.js"></script>
```

---

## 6. Reactive Only

Reactive state, forms, watchers, computed properties. **Requires Core.**

```html
<!-- Core first -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>
<!-- Then Reactive -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.reactive.min.js"></script>
```

---

## 7. Native Enhance

Patches `document.getElementById`, `getElementsByClassName`, `getElementsByTagName`, `getElementsByName`, `querySelector`, and `querySelectorAll` to return DOM Helpers enhanced elements/collections. **Requires Core + Enhancers.**

```html
<!-- Core first -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>
<!-- Then Enhancers -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.enhancers.min.js"></script>
<!-- Then Native Enhance -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.native-enhance.min.js"></script>
```

Or add it on top of the Full Bundle:

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.native-enhance.min.js"></script>
```

---

## 8. Form Module (v2.6.0)

`Forms`, `FormEnhancements` — non-reactive form handling with values, validation, serialization, and enhanced submission. Included in the full bundle. For script-tag usage, load from `src/`:

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.min.js"></script>
```

Or load source files directly (requires your own build step or a bundler):

```html
<!-- Core -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/src/01_core/01_dh-core.js"></script>
<!-- Form base -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/src/07_dom-form/01_dh-form.js"></script>
<!-- Form enhancements (optional — loading states, retry, declarative forms) -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/src/07_dom-form/02_dh-form-enhance.js"></script>
```

**Globals:** `Forms`, `FormEnhancements`

---

## 9. Animation Module (v2.6.0)

`Animation` — CSS transition-based animations: fadeIn/Out, slideUp/Down/Toggle, transform, animation chains, stagger support, 30 named easing curves. Included in the full bundle.

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.min.js"></script>
```

Or load from source:

```html
<!-- Core -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/src/01_core/01_dh-core.js"></script>
<!-- Animation -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/src/08_animation/01_dh-animation.js"></script>
```

**Globals:** `Animation`

---

## 10. Async Utilities Module (v2.6.0)

`AsyncHelpers` — debounce, throttle, sanitize, sleep, enhanced fetch with retry/timeout, asyncHandler, parallelAll, raceWithTimeout. Included in the full bundle.

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.min.js"></script>
```

Or load from source:

```html
<!-- Core -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/src/01_core/01_dh-core.js"></script>
<!-- Async -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/src/09_async/01_dh-async.js"></script>
```

**Globals:** `AsyncHelpers` (also extends `Elements`, `Collections`, `Selector` with async methods)

---

## Common Combinations

### Core + Storage (10.9 KB total)
Lightweight DOM access with persistent storage.
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.storage.min.js"></script>
```

### Core + Reactive (21.1 KB total)
DOM access with reactive state management.
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.reactive.min.js"></script>
```

### Core + Enhancers (18.0 KB total)
DOM access with bulk update helpers.
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.enhancers.min.js"></script>
```

### Core + Conditions (16.8 KB total)
DOM access with conditional rendering.
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.conditions.min.js"></script>
```

### Core + Reactive + Storage (22.4 KB total)
Reactive state with persistent storage.
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.reactive.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.storage.min.js"></script>
```

### Core + All Modules (same as Full Bundle ~44.6 KB)
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.enhancers.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.conditions.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.reactive.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.storage.min.js"></script>
```

---

## unpkg (Alternative CDN)

Same files, available immediately after npm publish.

```html
<!-- Full Bundle -->
<script src="https://unpkg.com/dom-helpers-js@2.6.0/dist/dom-helpers.min.js"></script>

<!-- Core -->
<script src="https://unpkg.com/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>

<!-- Storage (standalone) -->
<script src="https://unpkg.com/dom-helpers-js@2.6.0/dist/dom-helpers.storage.min.js"></script>

<!-- Enhancers (after core) -->
<script src="https://unpkg.com/dom-helpers-js@2.6.0/dist/dom-helpers.enhancers.min.js"></script>

<!-- Conditions (after core) -->
<script src="https://unpkg.com/dom-helpers-js@2.6.0/dist/dom-helpers.conditions.min.js"></script>

<!-- Reactive (after core) -->
<script src="https://unpkg.com/dom-helpers-js@2.6.0/dist/dom-helpers.reactive.min.js"></script>

<!-- Native Enhance (after core + enhancers) -->
<script src="https://unpkg.com/dom-helpers-js@2.6.0/dist/dom-helpers.native-enhance.min.js"></script>
```

---

## npm / ESM (Bundlers)

```bash
npm install dom-helpers-js
```

```js
// Full package
import { Elements, StorageUtils, ReactiveUtils, Forms, Animation, AsyncHelpers } from 'dom-helpers-js';

// Sub-path imports (only load what you need)
import { StorageUtils }  from 'dom-helpers-js/storage';
import { Elements }      from 'dom-helpers-js/core';
import { ReactiveUtils } from 'dom-helpers-js/reactive';
import { Elements }      from 'dom-helpers-js/enhancers';
import { Elements }      from 'dom-helpers-js/conditions';
import 'dom-helpers-js/native-enhance';

// CommonJS
const { StorageUtils } = require('dom-helpers-js/storage');
```

---

## Size Reference

| Bundle | Raw | Gzipped |
|--------|-----|---------|
| Full Bundle | 211 KB | 44.6 KB |
| Core | 52 KB | 9.6 KB |
| Enhancers | 44 KB | 8.4 KB |
| Conditions | 32 KB | 7.2 KB |
| Reactive | 44 KB | 11.5 KB |
| Storage | 4.0 KB | 1.3 KB |
| Native Enhance | 10 KB | 2.1 KB |

> The full bundle size increased from ~35 KB to ~44.6 KB (gzipped) in v2.6.0 due to the addition of the Form, Animation, and Async modules.

---

## Rules

- **Core, Storage, and Full Bundle are standalone** — no dependencies
- **Enhancers, Conditions, and Reactive require Core** — always load Core first
- **Native Enhance requires Core + Enhancers** — always load both before Native Enhance
- **Form, Animation, and Async modules are included in the Full Bundle** — for script-tag-only usage without a bundler, load their source files from `src/` after Core
- **Order matters** — Core must appear before dependent modules in the HTML
- **Do not mix Full Bundle with individual modules** — they overlap
- **Native Enhance can be added on top of the Full Bundle** — it only patches native methods
