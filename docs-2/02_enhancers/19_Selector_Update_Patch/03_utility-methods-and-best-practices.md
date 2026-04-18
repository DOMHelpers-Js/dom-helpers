[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# IndexSelection Utility Methods and Best Practices

## Quick Start (30 seconds)

```javascript
// Check if a collection is enhanced
IndexSelection.isEnhanced(myCollection);  // true or false

// Manually enhance a raw collection
const raw = document.querySelectorAll('.item');
const enhanced = IndexSelection.enhance(raw);
enhanced[0].update({ textContent: 'First' });

// Access element at index (with negative support)
const last = IndexSelection.at(myCollection, -1);
last.update({ textContent: 'Last' });
```

---

## The IndexSelection Object

The module exports a global `IndexSelection` object (also on `DOMHelpers.IndexSelection`):

```javascript
IndexSelection.version;  // "2.0.0"
```

---

## Utility Methods

### enhance(collection)

Manually wrap any collection with Proxy-based index access and index-aware `.update()`:

```javascript
// A raw NodeList from native DOM
const raw = document.querySelectorAll('.item');

// Enhance it
const enhanced = IndexSelection.enhance(raw);

// Now index access returns enhanced elements
enhanced[0].update({ textContent: 'First' });
enhanced.at(-1).update({ textContent: 'Last' });

// And .update() supports bulk + index
enhanced.update({
  style: { padding: '8px' },
  0: { classList: { add: ['first'] } }
});
```

Safe to call on already-enhanced collections — checks `_indexSelectionEnhanced` flag.

---

### enhanceElement(element)

Ensure a single element has `.update()`:

```javascript
const raw = document.getElementById('myDiv');
const enhanced = IndexSelection.enhanceElement(raw);

enhanced.update({
  textContent: 'Updated!',
  style: { color: 'blue' },
  classList: { add: ['enhanced'] }
});
```

Uses `EnhancedUpdateUtility` if available, falls back to a basic `.update()` implementation.

---

### isEnhanced(collection)

Check whether a collection has been enhanced by this module:

```javascript
const items = Collections.ClassName.item;

if (IndexSelection.isEnhanced(items)) {
  // Safe to use index access with .update()
  items[0].update({ textContent: 'Enhanced!' });
}
```

**Returns:** `true` if the collection has `_indexSelectionEnhanced === true`.

---

### at(collection, index)

Access an element at a specific index with negative index support:

```javascript
const items = Collections.ClassName.item;

// Positive index
IndexSelection.at(items, 0).update({ textContent: 'First' });

// Negative index
IndexSelection.at(items, -1).update({ textContent: 'Last' });
IndexSelection.at(items, -2).update({ textContent: 'Second to last' });
```

The returned element is auto-enhanced with `.update()`. Returns `null` if index is out of range.

---

### update(collection, updates)

Apply updates to a collection — wraps it first if not already enhanced:

```javascript
const raw = document.querySelectorAll('.item');

IndexSelection.update(raw, {
  style: { padding: '8px' },
  0: { textContent: 'First' },
  '-1': { textContent: 'Last' }
});
```

This is a convenience method — it calls `enhance()` first, then `.update()`.

---

### reinitialize()

Re-run the initialization to hook into Collections and Selector helpers:

```javascript
// Useful if DOM Helpers loads after this module
IndexSelection.reinitialize();
```

---

## Best Practices

### 1. Use Index Access for Individual Element Updates

```javascript
// ✅ Clean — each element updated individually
const cards = Collections.ClassName.card;
cards[0].update({ textContent: 'Featured' });
cards[1].update({ textContent: 'Standard' });
cards.at(-1).update({ textContent: 'Last' });
```

### 2. Use .update() for Shared + Individual in One Call

```javascript
// ✅ Efficient — bulk and index in one call
Collections.ClassName.btn.update({
  style: { padding: '10px', borderRadius: '4px' },
  0: { textContent: 'Save', style: { backgroundColor: 'green' } },
  1: { textContent: 'Cancel', style: { backgroundColor: 'red' } }
});
```

### 3. Use String Keys for Negative Indices in .update()

```javascript
// ✅ String key for negative index
items.update({
  '-1': { textContent: 'Last' }
});

// ✅ Also works with computed property syntax
items.update({
  [-1]: { textContent: 'Last' }
});
```

### 4. Use .at() for Negative Index Direct Access

```javascript
// ✅ Clean — .at(-1) returns the last element
items.at(-1).update({ classList: { add: ['last'] } });

// Also works
items.at(-2).update({ style: { fontStyle: 'italic' } });
```

### 5. Check Enhancement Before Using Advanced Features

```javascript
if (IndexSelection.isEnhanced(collection)) {
  collection[0].update({ textContent: 'Safe to use!' });
}
```

---

## Complete API Reference

### IndexSelection Object

| Property/Method | What It Does |
|----------------|-------------|
| `.version` | Module version (`"2.0.0"`) |
| `.enhance(collection)` | Wrap a collection with Proxy + index-aware `.update()` |
| `.enhanceElement(element)` | Add `.update()` to a single element |
| `.isEnhanced(collection)` | Check if collection has this module's enhancements |
| `.at(collection, index)` | Get enhanced element at index (supports negative) |
| `.update(collection, updates)` | Enhance and update a collection |
| `.reinitialize()` | Re-hook into Collections and Selector helpers |

### Access Points

```javascript
// Global
IndexSelection.version;

// Via DOMHelpers
DOMHelpers.IndexSelection.version;
```

### What Gets Hooked

| Internal Method | What Changes |
|----------------|-------------|
| `Collections.helper._enhanceCollection()` | Wraps output with Proxy + index-aware update |
| `Collections.helper._enhanceCollectionWithUpdate()` | Wraps output with Proxy + index-aware update |
| `Selector.helper._enhanceNodeList()` | Wraps output with Proxy + index-aware update |
| `Selector.helper._enhanceCollectionWithUpdate()` | Wraps output with Proxy + index-aware update |

### Fallback .update() Supported Keys

| Key | What It Does |
|-----|-------------|
| `style` | CSS properties from an object |
| `classList` | Add/remove/toggle/replace classes |
| `setAttribute` | Set HTML attributes |
| `removeAttribute` | Remove HTML attributes |
| `dataset` | Set data-* attributes |
| `addEventListener` | Add event listeners |
| `on*` | Set event handler properties |
| Methods | Call element methods |
| Properties | Direct property assignment |
| Fallback | `setAttribute()` for unknown keys |

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **Deep hooking** | Patches internal `_enhanceCollection` and `_enhanceNodeList` |
| **Proxy wrapping** | `collection[index]` auto-enhances elements |
| **`.at()` enhanced** | Negative index support with auto-enhancement |
| **Index-aware `.update()`** | Bulk (string keys) + index (numeric keys) |
| **Utility methods** | `enhance()`, `enhanceElement()`, `isEnhanced()`, `at()`, `update()` |
| **Auto-init** | Hooks in automatically when loaded |
| **reinitialize()** | Re-hook if core library loads later |

> **Simple Rule to Remember:** This module works at the deepest level — hooking into core internal helpers so that **every** collection from Collections or Selector gets Proxy-based index access (elements auto-enhanced with `.update()`) and an index-aware `.update()` method. Use `IndexSelection.enhance()` for raw collections from external code.