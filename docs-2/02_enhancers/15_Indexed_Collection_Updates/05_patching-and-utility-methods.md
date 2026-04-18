[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# IndexedUpdates Object — Utility Methods

## Quick Start (30 seconds)

```javascript
// Check if a collection supports indexed updates
IndexedUpdates.hasSupport(myCollection);  // true or false

// Manually patch a raw collection
const raw = document.querySelectorAll('.item');
IndexedUpdates.patch(raw);

// Now it supports indexed .update()
raw.update({
  [0]: { textContent: 'First' },
  [-1]: { textContent: 'Last' }
});
```

---

## The IndexedUpdates Object

When the module loads, it creates a global `IndexedUpdates` object with utility methods. You can also access it via `DOMHelpers.IndexedUpdates`.

```javascript
console.log(IndexedUpdates.version);  // "1.1.0"
```

---

## Methods Reference

### patch(collection)

Manually adds indexed update support to any collection. This is useful when you have a collection from external code or a raw `NodeList` that wasn't created through `queryAll()`.

```javascript
// A raw NodeList from native DOM
const rawList = document.querySelectorAll('.card');

// Patch it to support indexed updates
IndexedUpdates.patch(rawList);

// Now you can use indexed .update()
rawList.update({
  style: { padding: '16px' },
  [0]: { classList: { add: ['featured'] } }
});
```

**What it does:**
- Replaces the collection's `.update()` method with the indexed-aware version
- Marks the collection with `_hasIndexedUpdateSupport` to prevent double-patching
- Returns the patched collection

**Safe to call multiple times:**

```javascript
IndexedUpdates.patch(collection);
IndexedUpdates.patch(collection);  // No-op — already patched
```

`patchCollectionUpdate(collection)` is the full name — `patch()` is a convenient alias.

---

### hasSupport(collection)

Checks whether a collection already has indexed update support:

```javascript
const items = queryAll('.item');

if (IndexedUpdates.hasSupport(items)) {
  console.log('Ready for indexed updates!');
}
```

```javascript
// A raw NodeList doesn't have support by default
const raw = document.querySelectorAll('.item');
console.log(IndexedUpdates.hasSupport(raw));  // false

// After patching
IndexedUpdates.patch(raw);
console.log(IndexedUpdates.hasSupport(raw));  // true
```

**Returns:** `true` if the collection has the `_hasIndexedUpdateSupport` flag, `false` otherwise.

---

### updateCollectionWithIndices(collection, updates)

The core function that processes the update object — separating bulk from indexed, and applying both. You can call it directly if needed:

```javascript
const buttons = queryAll('.btn');

IndexedUpdates.updateCollectionWithIndices(buttons, {
  disabled: true,
  [0]: { disabled: false }
});
```

Most of the time you won't call this directly — the patched `.update()` method uses it internally. But it's available if you want to apply indexed updates to a collection without patching it permanently.

---

### restore()

Removes the module's patches from `querySelectorAll()` and `queryAll()`, restoring them to their original behavior:

```javascript
// Remove all patches
IndexedUpdates.restore();
// Console: [Indexed Updates] Restored original functions

// Now queryAll() returns collections without indexed update support
const items = queryAll('.item');
// items.update() works as standard bulk-only update
```

**When to use:** Primarily useful for debugging or if you need to temporarily disable the module's behavior.

---

## Automatic Patching — What Happens on Load

When the module loads, it **automatically patches** five things. You don't need to do anything — collections from these sources automatically support indexed updates:

### 1. `querySelectorAll()` — Patched

```javascript
// Collections from querySelectorAll automatically support indexed updates
querySelectorAll('.btn').update({
  [0]: { textContent: 'First' }
});
```

### 2. `queryAll()` — Patched

```javascript
// Same for the short alias
queryAll('.btn').update({
  [0]: { textContent: 'First' }
});
```

### 3. `Collections.update()` — Patched

```javascript
// Collections helper also works with indexed updates
Collections.ClassName.btn.update({
  style: { padding: '10px' },
  [0]: { textContent: 'Special' }
});
```

The module detects colon-based selector syntax (like `".btn:0"`) and forwards those to the original Collections handler instead.

### 4. `Selector.update()` — Patched

```javascript
// Selector helper works too
Selector.queryAll('.item').update({
  [0]: { textContent: 'First' }
});
```

The module detects CSS-selector-style keys (starting with `#`, `.`, or containing `[`) and forwards those to the original Selector handler.

### 5. `EnhancedUpdateUtility.enhanceCollectionWithUpdate()` — Patched

This is the deepest patch — it ensures that **any collection enhanced in the future** (by any module) automatically gets indexed update support.

```
EnhancedUpdateUtility.enhanceCollectionWithUpdate(collection)
   ↓
Original: adds .update() to collection
   ↓
Patch: also adds indexed update support
```

---

## How Patching Works Internally

```
Module loads
   ↓
1️⃣ Saves references to original functions
   ├── originalQSA = global.querySelectorAll
   └── originalQSAShort = global.queryAll
   ↓
2️⃣ Replaces them with enhanced versions
   ├── global.querySelectorAll = enhancedQuerySelectorAll
   └── global.queryAll = enhancedQSA
   ↓
3️⃣ Enhanced versions:
   a) Call the original function to get the collection
   b) Run patchCollectionUpdate() on the result
   c) Return the patched collection
   ↓
4️⃣ patchCollectionUpdate():
   a) Check _hasIndexedUpdateSupport flag (skip if already patched)
   b) Store reference to original .update() method
   c) Replace .update() with updateCollectionWithIndices
   d) Set _hasIndexedUpdateSupport = true
```

---

## Access Points

```javascript
// Direct global access
IndexedUpdates.version;
IndexedUpdates.patch(collection);
IndexedUpdates.hasSupport(collection);
IndexedUpdates.restore();

// Via DOMHelpers
DOMHelpers.IndexedUpdates.version;
DOMHelpers.IndexedUpdates.patch(collection);
DOMHelpers.IndexedUpdates.hasSupport(collection);
DOMHelpers.IndexedUpdates.restore();
```

---

## Summary

| Method | What It Does | Returns |
|--------|-------------|---------|
| `patch(collection)` | Adds indexed update support to a collection | The patched collection |
| `hasSupport(collection)` | Checks if a collection supports indexed updates | `boolean` |
| `updateCollectionWithIndices(col, updates)` | Core function — applies bulk + indexed updates | The collection |
| `restore()` | Removes patches from queryAll/querySelectorAll | `undefined` |

| Auto-Patched | On Load |
|-------------|---------|
| `querySelectorAll()` | Collections auto-support indexed updates |
| `queryAll()` | Collections auto-support indexed updates |
| `Collections.update()` | Indexed updates work with Collections |
| `Selector.update()` | Indexed updates work with Selector |
| `EnhancedUpdateUtility` | Future collections auto-patched |

> **Simple Rule to Remember:** The module patches everything automatically — just load it and indexed updates work on any collection from `queryAll()`, `Collections`, or `Selector`. Use `IndexedUpdates.patch()` only for raw collections from external code.