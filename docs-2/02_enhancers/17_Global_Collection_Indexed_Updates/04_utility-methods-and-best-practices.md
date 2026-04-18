[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Utility Methods and Best Practices

## Quick Start (30 seconds)

```javascript
// Check if a collection has indexed update support
GlobalShortcutsIndexedUpdates.hasSupport(ClassName.btn);  // true

// Manually enhance a raw collection
const raw = document.getElementsByClassName('item');
const enhanced = GlobalShortcutsIndexedUpdates.createEnhancedCollectionWithUpdate(raw);
enhanced.update({
  [0]: { textContent: 'First' }
});
```

---

## The GlobalShortcutsIndexedUpdates Object

The module exports a utility object accessible globally and via `DOMHelpers`:

```javascript
GlobalShortcutsIndexedUpdates.version;  // "1.1.0"

// Also via DOMHelpers
DOMHelpers.GlobalShortcutsIndexedUpdates.version;
```

---

## Utility Methods

### hasSupport(collection)

Check whether a collection has indexed update support:

```javascript
const buttons = ClassName.btn;

if (GlobalShortcutsIndexedUpdates.hasSupport(buttons)) {
  buttons.update({
    [0]: { textContent: 'First' }
  });
}
```

**Returns:** `true` if the collection has the `_hasIndexedUpdateSupport` flag.

---

### createEnhancedCollectionWithUpdate(collection)

Manually wrap any array-like collection with indexed update support:

```javascript
// A raw HTMLCollection from native DOM
const rawItems = document.getElementsByClassName('item');

// Enhance it
const items = GlobalShortcutsIndexedUpdates.createEnhancedCollectionWithUpdate(rawItems);

// Now it supports indexed updates
items.update({
  style: { padding: '8px' },
  [0]: { classList: { add: ['first'] } }
});

// Plus array methods
items.forEach((el, i) => console.log(i, el.textContent));
```

**What gets added:**
- `.update()` with bulk + index support
- `.length` property
- Numeric index access (auto-enhanced elements)
- `.forEach()`, `.map()`, `.filter()`
- `for...of` iterator

**Safe to call on already-enhanced collections** — it checks the `_hasIndexedUpdateSupport` flag and skips if already enhanced.

---

### updateCollectionWithIndices(collection, updates)

The core update function. You can call it directly if needed:

```javascript
const cards = ClassName.card;

GlobalShortcutsIndexedUpdates.updateCollectionWithIndices(cards, {
  style: { padding: '16px' },
  [0]: { classList: { add: ['featured'] } }
});
```

Most of the time you don't need to call this directly — the patched `.update()` method uses it internally.

---

### patchGlobalShortcut(originalProxy)

Wraps a Proxy so that any collection it returns is automatically enhanced:

```javascript
// Patch a custom proxy
const myProxy = new Proxy(myTarget, myHandler);
const patched = GlobalShortcutsIndexedUpdates.patchGlobalShortcut(myProxy);

// Collections returned by the patched proxy are auto-enhanced
const collection = patched.someProperty;
collection.update({ [0]: { textContent: 'Works!' } });
```

This is what the module uses internally to patch `ClassName`, `TagName`, and `Name`.

---

## How Patching Works Internally

```
Module loads
   ↓
1️⃣ Check dependencies (Collections, ClassName/TagName/Name, EnhancedUpdateUtility)
   ↓
2️⃣ For each global shortcut (ClassName, TagName, Name):
   a) Wrap the existing Proxy in a new Proxy (via patchGlobalShortcut)
   b) The new Proxy intercepts property access and function calls
   c) When a collection is returned, wrap it with createEnhancedCollectionWithUpdate
   d) Replace the global variable with the patched Proxy
   ↓
3️⃣ Update DOMHelpers references to match
   ↓
Done — all future ClassName.x / TagName.x / Name.x return enhanced collections
```

### The Proxy Interception

```javascript
// When you write:
ClassName.btn

// The patched Proxy:
// 1. Gets the original collection from ClassName.btn
// 2. Checks: does it have .length? (yes → it's a collection)
// 3. Checks: already enhanced? (no → needs wrapping)
// 4. Wraps it with createEnhancedCollectionWithUpdate()
// 5. Returns the enhanced collection
```

---

## Update Fallback Chain

When applying updates to individual elements, the module tries three approaches in order:

```
Apply update to element
   ↓
1️⃣ Does element have .update()? → Use element.update(updates)
   ↓ No
2️⃣ Is EnhancedUpdateUtility available? → Use applyEnhancedUpdate()
   ↓ No
3️⃣ Use basic fallback (handles style, classList, setAttribute, direct properties)
```

This means the module works even without `EnhancedUpdateUtility`, though with reduced functionality.

---

## Best Practices

### 1. Load Dependencies in Order

```html
<!-- ✅ Correct order -->
<script src="01_dh-core.js"></script>
<script src="02_dh-collection-shortcuts.js"></script>
<script src="06_dh-global-collection-indexed-updates.js"></script>
```

### 2. Use Bulk for Shared, Index for Individual

```javascript
// ✅ Good — shared in bulk, individual by index
ClassName.card.update({
  style: { padding: '16px', borderRadius: '8px' },
  [0]: { textContent: 'Featured' },
  [1]: { textContent: 'Standard' }
});

// ❌ Redundant — same style repeated in each index
ClassName.card.update({
  [0]: { style: { padding: '16px', borderRadius: '8px' }, textContent: 'Featured' },
  [1]: { style: { padding: '16px', borderRadius: '8px' }, textContent: 'Standard' }
});
```

### 3. Use Negative Indices for End-Based Targeting

```javascript
// ✅ Clean — works regardless of collection size
ClassName.item.update({
  [-1]: { classList: { add: ['last'] } }
});
```

### 4. Use Bracket Notation for Hyphenated Class Names

```javascript
// ✅ Bracket notation for hyphens
ClassName['nav-link'].update({...});
ClassName['menu-item'].update({...});

// ✅ Dot notation for simple names
ClassName.btn.update({...});
ClassName.card.update({...});
```

### 5. Build Update Objects Dynamically When Needed

```javascript
const items = ClassName.item;
const config = {
  classList: { add: ['processed'] }
};

// Add index-specific updates based on data
const labels = ['Home', 'Products', 'About', 'Contact'];
labels.forEach((label, i) => {
  config[i] = { textContent: label };
});

items.update(config);
```

---

## Complete API Reference

### GlobalShortcutsIndexedUpdates Object

| Property/Method | What It Does |
|----------------|-------------|
| `.version` | Module version (`"1.1.0"`) |
| `.hasSupport(collection)` | Check if collection has indexed update support |
| `.createEnhancedCollectionWithUpdate(col)` | Wrap a raw collection with indexed updates |
| `.updateCollectionWithIndices(col, updates)` | Core update function |
| `.patchGlobalShortcut(proxy)` | Patch a Proxy to auto-enhance returned collections |

### Patched Globals

| Global | What Changes |
|--------|-------------|
| `ClassName` | Collections support indexed `.update()` |
| `TagName` | Collections support indexed `.update()` |
| `Name` | Collections support indexed `.update()` |
| `DOMHelpers.ClassName` | Updated to match patched `ClassName` |
| `DOMHelpers.TagName` | Updated to match patched `TagName` |
| `DOMHelpers.Name` | Updated to match patched `Name` |

### Enhanced Collection Methods

| Method/Property | Description |
|----------------|-------------|
| `.update({...})` | Bulk + indexed update |
| `.length` | Element count |
| `[index]` | Access element (auto-enhanced) |
| `.forEach(cb)` | Iterate over elements |
| `.map(cb)` | Transform elements |
| `.filter(cb)` | Filter elements |
| `for...of` | Iterator support |

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **GlobalShortcutsIndexedUpdates** | Utility object with version, hasSupport, and enhancement methods |
| **Auto-patching** | `ClassName`, `TagName`, `Name` patched on load via Proxy wrapping |
| **Manual enhancement** | `createEnhancedCollectionWithUpdate()` for raw collections |
| **Fallback chain** | `.update()` → `EnhancedUpdateUtility` → basic fallback |
| **DOMHelpers access** | `DOMHelpers.GlobalShortcutsIndexedUpdates` |

> **Simple Rule to Remember:** The module patches everything automatically — just load it and `ClassName.btn.update()` supports indexed targeting. Use `GlobalShortcutsIndexedUpdates.createEnhancedCollectionWithUpdate()` only for raw collections from external code. Use `hasSupport()` to check if a collection is already enhanced.