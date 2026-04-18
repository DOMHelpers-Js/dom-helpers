[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Selector Update Patch (Index Selection) — Introduction

## Quick Start (30 seconds)

```javascript
// After loading this module, elements accessed by index
// automatically have .update()

const items = Collections.ClassName.item;

// Index access — element is auto-enhanced
items[0].update({ textContent: 'First', style: { color: 'red' } });
items[1].update({ textContent: 'Second', style: { color: 'blue' } });

// Negative index via .at()
items.at(-1).update({ textContent: 'Last Item' });

// Mixed bulk + index updates
items.update({
  classList: { add: ['styled'] },       // ALL elements
  0: { textContent: 'First' },          // Element 0 only
  '-1': { textContent: 'Last' }         // Last element only
});
```

---

## What Is This Module?

The Selector Update Patch (also called Index Selection) enhances collections from the **core library's internal helpers** — `Collections.helper` and `Selector.helper` — so that:

1. **Elements accessed by index automatically get `.update()`** — `collection[0].update({...})` just works
2. **Negative indices work via `.at()`** — `collection.at(-1)` returns the last element, enhanced
3. **Collection `.update()` supports bulk + index mixing** — shared properties for all elements plus individual overrides by position

Simply put, this module makes every collection in the core library **index-aware** — elements accessed by position are automatically enhanced, and `.update()` can target specific indices.

---

## How Is This Different from Other Modules?

Other enhancer modules (like Indexed Collection Updates or Global Collection Indexed Updates) patch **specific access points** — `queryAll()`, `ClassName`, `TagName`, etc. This module patches at a **deeper level** — it hooks into the internal `_enhanceCollection` and `_enhanceNodeList` methods that the core helpers use to create collections.

```
Other modules patch here:
├── queryAll()               ← Global Query collections
├── ClassName / TagName       ← Collection Shortcut collections
└── Selector.queryAll()      ← Selector collections

This module patches here:
├── Collections.helper._enhanceCollection()      ← Internal factory
├── Collections.helper._enhanceCollectionWithUpdate()  ← Internal factory
├── Selector.helper._enhanceNodeList()            ← Internal factory
└── Selector.helper._enhanceCollectionWithUpdate() ← Internal factory
```

This means **any collection created by the core helpers** — regardless of which API surface you use — gets the enhanced behavior automatically.

---

## What Gets Enhanced?

### Index Access via Proxy

Collections are wrapped in a `Proxy` that intercepts numeric index access:

```
collection[0]
   ↓
Proxy intercepts the access
   ↓
1️⃣ Get the raw element from the underlying collection
   ↓
2️⃣ Call ensureElementHasUpdate(element)
   ↓
3️⃣ Return the enhanced element (with .update())
```

```javascript
// Before this module:
const items = Collections.ClassName.item;
items[0];  // Raw element — no .update()

// After this module:
const items = Collections.ClassName.item;
items[0];  // Enhanced element — has .update()!
items[0].update({ textContent: 'Hello', style: { color: 'blue' } });
```

### .at() Method Enhancement

The `.at()` method is also intercepted to auto-enhance its return value:

```javascript
items.at(0);   // First element — enhanced
items.at(-1);  // Last element — enhanced
items.at(-2);  // Second to last — enhanced
```

### Index-Aware .update()

The collection's `.update()` method is replaced with one that separates bulk from index updates:

```javascript
items.update({
  // Non-numeric keys → BULK (all elements)
  style: { padding: '8px' },
  classList: { add: ['base'] },

  // Numeric keys → INDEX (specific elements)
  0: { textContent: 'First' },
  1: { textContent: 'Second' },
  '-1': { textContent: 'Last' }
});
```

---

## How It Hooks In

```
Module loads
   ↓
1️⃣ Check: Collections or Selector exists?
   └── No → Exit with warning
   ↓
2️⃣ Hook Collections.helper:
   ├── Wrap _enhanceCollection → adds Proxy + index-aware update
   └── Wrap _enhanceCollectionWithUpdate → adds Proxy + index-aware update
   ↓
3️⃣ Hook Selector.helper:
   ├── Wrap _enhanceNodeList → adds Proxy + index-aware update
   └── Wrap _enhanceCollectionWithUpdate → adds Proxy + index-aware update
   ↓
4️⃣ All future collections from core helpers are automatically enhanced
   ↓
Console: [Index Selection] v2.0.0 initialized
```

### Auto-Initialization

The module initializes automatically:
- If the DOM is still loading → waits for `DOMContentLoaded`
- If the DOM is already ready → initializes immediately

---

## Works with All Core Collection Sources

```javascript
// Collections.ClassName
Collections.ClassName.btn[0].update({ textContent: 'Click' });

// Collections.TagName
Collections.TagName.li.at(-1).update({ classList: { add: ['last'] } });

// Collections.Name
Collections.Name.email[0].update({ placeholder: 'Your email' });

// Selector.queryAll
Selector.queryAll('.card')[0].update({ style: { border: '2px solid gold' } });
```

---

## The .update() Fallback Chain

When enhancing an element with `.update()`, the module tries three approaches:

```
ensureElementHasUpdate(element)
   ↓
1️⃣ Already enhanced? (_hasUpdateMethod or _hasEnhancedUpdateMethod)
   → Return as-is
   ↓
2️⃣ global.enhanceElementWithUpdate exists?
   → Use it
   ↓
3️⃣ EnhancedUpdateUtility.enhanceElementWithUpdate exists?
   → Use it
   ↓
4️⃣ None available? → Add basic .update() method (fallback)
```

The fallback `.update()` method supports:

| Key | What It Does |
|-----|-------------|
| `style` | Set CSS properties from an object |
| `classList` | Add, remove, toggle, replace classes |
| `setAttribute` | Set HTML attributes |
| `removeAttribute` | Remove HTML attributes |
| `dataset` | Set data-* attributes |
| `addEventListener` | Add event listeners |
| `on*` properties | Set event handler properties |
| Any method | Call element methods |
| Any property | Direct property assignment |
| Fallback | `setAttribute()` for unknown keys |

---

## Load Order

```html
<!-- 1. Core library (provides Collections, Selector) -->
<script src="01_dh-core.js"></script>

<!-- 2. This module -->
<script src="08_dh-selector-update-patch.js"></script>
```

If neither `Collections` nor `Selector` exists, the module exits with a warning.

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | Hooks into core internal helpers to add index access enhancement + index-aware .update() |
| **Proxy wrapping** | `collection[0]` auto-enhances the element with `.update()` |
| **Negative indices** | `.at(-1)` returns the last element, enhanced |
| **Bulk + index .update()** | String keys → all elements, numeric keys → specific elements |
| **Deep hooking** | Patches `_enhanceCollection` and `_enhanceNodeList` internally |
| **All sources** | Works with Collections.ClassName, Collections.TagName, Selector.queryAll, etc. |
| **Auto-init** | Runs automatically when loaded |

> **Simple Rule to Remember:** This module makes every collection element accessible by index with `.update()` — `collection[0].update({...})` just works. Use `.at(-1)` for the last element. The collection's `.update()` supports both bulk (string keys for all) and index (numeric keys for one) updates.