# All CDN Links - DOM Helpers JS

## Available Modules

| Module | Gzipped | Standalone? | Globals Exposed |
|--------|---------|-------------|-----------------|
| **Full Bundle** | 34.9 KB | Yes | `Elements`, `Collections`, `Selector`, `createElement`, `ReactiveUtils`, `ReactiveState`, `StorageUtils` |
| **Core** | 9.6 KB | Yes | `Elements`, `Collections`, `Selector`, `createElement` |
| **Enhancers** | 8.5 KB | Requires Core | Extends `Elements`, `Collections`, `Selector` |
| **Conditions** | 7.3 KB | Requires Core | Extends `Elements`, `Collections`, `Selector` |
| **Reactive** | 11.9 KB | Requires Core | `ReactiveUtils`, `ReactiveState` |
| **Storage** | 1.4 KB | Yes | `StorageUtils` |

---

## 1. Full Bundle

Includes everything. Use this if you need all features.

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.min.js"></script>
```

---

## 2. Core Only

`Elements`, `Collections`, `Selector`, `createElement`. Foundation for all other modules.

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.core.min.js"></script>
```

---

## 3. Storage Only

`StorageUtils` — localStorage/sessionStorage with auto-save, watching, and namespacing.
Fully standalone, no other modules required.

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.storage.min.js"></script>
```

---

## 4. Enhancers Only

Bulk DOM updates, shortcuts, indexed operations. **Requires Core.**

```html
<!-- Core first -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.core.min.js"></script>
<!-- Then Enhancers -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.enhancers.min.js"></script>
```

---

## 5. Conditions Only

Conditional rendering, state-based DOM updates. **Requires Core.**

```html
<!-- Core first -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.core.min.js"></script>
<!-- Then Conditions -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.conditions.min.js"></script>
```

---

## 6. Reactive Only

Reactive state, forms, watchers, computed properties. **Requires Core.**

```html
<!-- Core first -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.core.min.js"></script>
<!-- Then Reactive -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.reactive.min.js"></script>
```

---

## Common Combinations

### Core + Storage (11 KB total)
Lightweight DOM access with persistent storage.
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.storage.min.js"></script>
```

### Core + Reactive (21.5 KB total)
DOM access with reactive state management.
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.reactive.min.js"></script>
```

### Core + Enhancers (18.1 KB total)
DOM access with bulk update helpers.
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.enhancers.min.js"></script>
```

### Core + Conditions (16.9 KB total)
DOM access with conditional rendering.
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.conditions.min.js"></script>
```

### Core + Reactive + Storage (23 KB total)
Reactive state with persistent storage.
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.reactive.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.storage.min.js"></script>
```

### Core + All Modules (same as Full Bundle ~35 KB)
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.enhancers.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.conditions.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.reactive.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.4.1/dist/dom-helpers.storage.min.js"></script>
```

---

## unpkg (Alternative CDN)

Same files, available immediately after npm publish.

```html
<!-- Full Bundle -->
<script src="https://unpkg.com/dom-helpers-js@2.4.1/dist/dom-helpers.min.js"></script>

<!-- Core -->
<script src="https://unpkg.com/dom-helpers-js@2.4.1/dist/dom-helpers.core.min.js"></script>

<!-- Storage (standalone) -->
<script src="https://unpkg.com/dom-helpers-js@2.4.1/dist/dom-helpers.storage.min.js"></script>

<!-- Enhancers (after core) -->
<script src="https://unpkg.com/dom-helpers-js@2.4.1/dist/dom-helpers.enhancers.min.js"></script>

<!-- Conditions (after core) -->
<script src="https://unpkg.com/dom-helpers-js@2.4.1/dist/dom-helpers.conditions.min.js"></script>

<!-- Reactive (after core) -->
<script src="https://unpkg.com/dom-helpers-js@2.4.1/dist/dom-helpers.reactive.min.js"></script>
```

---

## npm / ESM (Bundlers)

```bash
npm install dom-helpers-js
```

```js
// Full package
import { Elements, StorageUtils, ReactiveUtils } from 'dom-helpers-js';

// Sub-path imports (only load what you need)
import { StorageUtils } from 'dom-helpers-js/storage';
import { Elements }     from 'dom-helpers-js/core';
import { ReactiveUtils } from 'dom-helpers-js/reactive';
import { Elements }     from 'dom-helpers-js/enhancers';
import { Elements }     from 'dom-helpers-js/conditions';

// CommonJS
const { StorageUtils } = require('dom-helpers-js/storage');
```

---

## Size Reference

| Bundle | Raw | Gzipped |
|--------|-----|---------|
| Full Bundle | 190 KB | 34.9 KB |
| Core | 53 KB | 9.6 KB |
| Enhancers | 47 KB | 8.5 KB |
| Conditions | 41 KB | 7.3 KB |
| Reactive | 47 KB | 11.9 KB |
| Storage | 4.4 KB | 1.4 KB |

---

## Rules

- **Core, Storage, and Full Bundle are standalone** — no dependencies
- **Enhancers, Conditions, and Reactive require Core** — always load Core first
- **Order matters** — Core must appear before dependent modules in the HTML
- **Do not mix Full Bundle with individual modules** — they overlap
