# All CDN Links — DOM Helpers JS v2.9.1

## Available Modules

| Module | Gzipped | Standalone? | Globals Exposed |
|--------|---------|-------------|-----------------|
| **Full Bundle** | ~49.7 KB | Yes | `Elements`, `Collections`, `Selector`, `createElement`, `ReactiveUtils`, `StorageUtils`, `Forms`, `Animation`, `AsyncHelpers`, `Router` |
| **Core** | ~9.6 KB | Yes | `Elements`, `Collections`, `Selector`, `createElement` |
| **Enhancers** | ~8.4 KB | Requires Core | Extends `Elements`, `Collections`, `Selector` |
| **Reactive** | ~11.5 KB | Requires Core | `ReactiveUtils` |
| **Conditions** | ~7.2 KB | Requires Core + Reactive *(recommended)* | Extends `Elements`, `Collections`, `Selector` |
| **Storage** | ~1.3 KB | Yes | `StorageUtils` |
| **Native Enhance** | ~2.2 KB | Requires Core + Enhancers | Patches `getElementById`, `getElementsBy*`, `querySelector/All` |
| **Form** | ~6.5 KB | Requires Core | `Forms` |
| **Animation** | ~4.8 KB | Requires Core | `Animation` |
| **Async** | ~3.9 KB | Requires Core | `AsyncHelpers` |
| **SPA Router** | ~3.9 KB | Yes | `Router` |

---

## Loading the Full Bundle

### 1. Classic
Globals on `window`, render-blocking.

```html
<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.full-spa.min.js"></script>

<!-- unpkg -->
<script src="https://unpkg.com/dom-helpers-js@2.9.2/dist/dom-helpers.full-spa.min.js"></script>
```

---

### 2. Deferred
Globals on `window`, non-blocking — page renders before the library executes.

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.full-spa.esm.min.js"></script>
```

---

### 3. Named Imports
Explicit named imports — ideal for modular multi-file projects.

```html
<script type="module">
  import { Elements, Collections, Selector, createElement,
           ReactiveUtils, ReactiveState, StorageUtils,
           Forms, Animation, AsyncHelpers, Router }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.full-spa.esm.min.js';

</script>
```

> **Modular projects:** Load the library once in your entry point (`app.js`) using approach 2 or 3 — all globals are then available across every file without repeating the CDN URL.

**Globals:** `Elements`, `Collections`, `Selector`, `createElement`, `ReactiveUtils`, `ReactiveState`, `StorageUtils`, `Forms`, `Animation`, `AsyncHelpers`, `Router`

---

## Loading Individual Modules

Load only the modules you need. Order matters — always respect the dependency chain.

---

### Core Only

`Elements`, `Collections`, `Selector`, `createElement`. The foundation — all other modules require this.

**Classic**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.min.js"></script>
```

**Deferred**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js"></script>
```

**Named Imports**
```html
<script type="module">
  import { Elements, Collections, Selector, createElement }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js';
</script>
```

---

### Storage Only

`StorageUtils` — localStorage/sessionStorage with auto-save, watching, and namespacing. **Fully standalone.**

**Classic**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.storage.min.js"></script>
```

**Deferred**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.storage.esm.min.js"></script>
```

**Named Imports**
```html
<script type="module">
  import { StorageUtils }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.storage.esm.min.js';
</script>
```

---

### SPA Router Only

`Router` — hash/history routing, guards, transitions. **Fully standalone.**

**Classic**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.spa.min.js"></script>
```

**Deferred**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.spa.esm.min.js"></script>
```

**Named Imports**
```html
<script type="module">
  import { Router }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.spa.esm.min.js';
</script>
```

---

### Enhancers Only

Bulk DOM updates, shortcuts, indexed operations. **Requires Core.**

**Classic**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.enhancers.min.js"></script>
```

**Deferred**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.enhancers.esm.min.js"></script>
```

**Named Imports**
```html
<script type="module">
  import { Elements, Collections, Selector , createElement }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js';
  import 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.enhancers.esm.min.js';
</script>
```

> Enhancers extends `Elements`, `Collections`, and `Selector` in place — it adds no new named exports. Load it as a side-effect after Core; the same references gain the extra methods automatically.

---

### Reactive Only

Reactive state, computed properties, watchers. **Requires Core.**

**Classic**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.min.js"></script>
```

**Deferred**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.esm.min.js"></script>
```

**Named Imports**
```html
<script type="module">
  import { Elements, Collections, Selector , createElement }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js';
  import { ReactiveUtils }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.esm.min.js';
</script>
```

---

### Conditions Only

Conditional rendering, state-based DOM visibility. **Requires Core. Load Reactive first for reactive+static mode.**

**Classic**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.conditions.min.js"></script>
```

**Deferred**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.conditions.esm.min.js"></script>
```

**Named Imports**
```html
<script type="module">
  import { Elements, Collections, Selector , createElement }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js';
  import { ReactiveUtils }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.esm.min.js';
  import 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.conditions.esm.min.js';
</script>
```

> Conditions extends `Elements`, `Collections`, and `Selector` in place — it adds no new named exports. Load it as a side-effect; the same references gain conditional rendering methods automatically.

---

### Native Enhance Only

Patches `getElementById`, `getElementsBy*`, `querySelector/All` to return enhanced elements. **Requires Core + Enhancers.**

**Classic**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.enhancers.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.native-enhance.min.js"></script>
```

**Deferred**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.enhancers.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.native-enhance.esm.min.js"></script>
```

**Named Imports**
```html
<script type="module">
  import { Elements, Collections, Selector , createElement }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js';
  import 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.enhancers.esm.min.js';
  import 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.native-enhance.esm.min.js';
</script>
```

> Native Enhance patches `getElementById`, `getElementsBy*`, and `querySelector/All` globally — it adds no new named exports. Load it as a side-effect; native DOM methods gain enhanced return values automatically.

---

### Form Only

`Forms` — form access, values, validation, serialization, enhanced submission. **Requires Core.**

**Classic**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.form.min.js"></script>
```

**Deferred**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.form.esm.min.js"></script>
```

**Named Imports**
```html
<script type="module">
  import { Elements, Collections, Selector , createElement }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js';
  import { Forms }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.form.esm.min.js';
</script>
```

---

### Animation Only

`Animation` — fadeIn/Out, slideUp/Down/Toggle, transform, chains, stagger, 30 easing curves. **Requires Core.**

**Classic**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.animation.min.js"></script>
```

**Deferred**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.animation.esm.min.js"></script>
```

**Named Imports**
```html
<script type="module">
  import { Elements, Collections, Selector , createElement }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js';
  import { Animation }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.animation.esm.min.js';
</script>
```

---

### Async Only

`AsyncHelpers` — debounce, throttle, sanitize, sleep, enhanced fetch, parallelAll, raceWithTimeout. **Requires Core.**

**Classic**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.async.min.js"></script>
```

**Deferred**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.async.esm.min.js"></script>
```

**Named Imports**
```html
<script type="module">
  import { Elements, Collections, Selector , createElement }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js';
  import { AsyncHelpers }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.async.esm.min.js';
</script>
```

---

## Common Combinations

### Core + Storage (~10.9 KB)
Lightweight DOM access with persistent storage.

**Classic**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.storage.min.js"></script>
```
**Deferred**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.storage.esm.min.js"></script>
```
**Named Imports**
```html
<script type="module">
  import { Elements, Collections, Selector , createElement }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js';
  import { StorageUtils }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.storage.esm.min.js';
</script>
```

---

### Core + Reactive (~21.1 KB)
DOM access with reactive state management.

**Classic**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.min.js"></script>
```
**Deferred**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.esm.min.js"></script>
```
**Named Imports**
```html
<script type="module">
  import { Elements, Collections, Selector , createElement }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js';
  import { ReactiveUtils }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.esm.min.js';
</script>
```

---

### Core + Enhancers (~18.0 KB)
DOM access with bulk update helpers.

**Classic**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.enhancers.min.js"></script>
```
**Deferred**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.enhancers.esm.min.js"></script>
```
**Named Imports**
```html
<script type="module">
  import { Elements, Collections, Selector , createElement }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js';
  import 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.enhancers.esm.min.js';
</script>
```

> Enhancers adds no new named exports — it extends the Core objects in place, so a side-effect import is correct here.

---

### Core + Reactive + Storage (~22.4 KB)
Reactive state with persistent storage.

**Classic**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.storage.min.js"></script>
```
**Deferred**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.storage.esm.min.js"></script>
```
**Named Imports**
```html
<script type="module">
  import { Elements, Collections, Selector , createElement }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js';
  import { ReactiveUtils }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.esm.min.js';
  import { StorageUtils }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.storage.esm.min.js';
</script>
```

---

### Core + SPA Router (~13.5 KB)
Minimal SPA — just routing with basic DOM access.

**Classic**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.spa.min.js"></script>
```
**Deferred**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.spa.esm.min.js"></script>
```
**Named Imports**
```html
<script type="module">
  import { Elements, Collections, Selector , createElement }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js';
  import { Router }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.spa.esm.min.js';
</script>
```

---

### Core + Reactive + SPA (~25 KB)
Reactive SPA without form/animation/async overhead.

**Classic**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.spa.min.js"></script>
```
**Deferred**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.spa.esm.min.js"></script>
```
**Named Imports**
```html
<script type="module">
  import { Elements, Collections, Selector , createElement }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js';
  import { ReactiveUtils }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.esm.min.js';
  import { Router }
    from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.spa.esm.min.js';
</script>
```

---

### Everything à la carte (same as Full Bundle)

**Classic**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.enhancers.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.conditions.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.storage.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.native-enhance.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.form.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.animation.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.async.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.spa.min.js"></script>
```

**Deferred**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.enhancers.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.conditions.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.storage.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.native-enhance.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.form.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.animation.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.async.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.spa.esm.min.js"></script>
```

**Named Imports**

> When importing everything, use the full bundle — not 10 individual files. One request, same result.
>
> For **true partial loading** (download only what you need), use Named Imports from individual module files:
> ```html
> <script type="module">
>   import { Elements, Collections, Selector, createElement }
>     from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js';
>   import { ReactiveUtils }
>     from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.esm.min.js';
>   import { Router }
>     from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.spa.esm.min.js';
>   import { StorageUtils }
>     from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.storage.esm.min.js';
>   import { Forms }
>     from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.form.esm.min.js';
>   import { Animation }
>     from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.animation.esm.min.js';
>   import { AsyncHelpers }
>     from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.async.esm.min.js';
>   import 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.enhancers.esm.min.js';
>   import 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.conditions.esm.min.js';
>   import 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.native-enhance.esm.min.js';
> </script>
> ```
> Each file is downloaded separately — only include the lines you actually need.

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
