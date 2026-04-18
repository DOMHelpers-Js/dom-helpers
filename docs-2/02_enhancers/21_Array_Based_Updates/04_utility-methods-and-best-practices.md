[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Utility Methods and Best Practices

## Quick Start (30 seconds)

```javascript
// Manually enhance a raw collection
const items = document.querySelectorAll('.item');
ArrayBasedUpdates.enhance(items);
items.update({ textContent: ['A', 'B', 'C'] });

// Check if a collection has array support
ArrayBasedUpdates.hasSupport(items);  // true

// Check if an update config contains arrays
ArrayBasedUpdates.containsArrayValues({ textContent: ['A', 'B'] });  // true

// Re-initialize all patches
ArrayBasedUpdates.reinitialize();
```

---

## ArrayBasedUpdates.enhance(collection)

### What Does It Do?

Manually adds array-based `.update()` support to a collection. This is useful when you have a collection that wasn't obtained through the auto-patched query functions.

### Syntax

```javascript
const enhanced = ArrayBasedUpdates.enhance(collection);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `collection` | `NodeList`, `HTMLCollection`, `Array` | The collection to enhance |

**Returns:** The same collection, now with array-aware `.update()`.

### When to Use It

```javascript
// Collections from patched functions are already enhanced:
const items = querySelectorAll('.item');  // ✅ Already enhanced

// But collections from native DOM methods are NOT:
const raw = document.querySelectorAll('.item');  // ❌ Not enhanced

// Use enhance() to add support:
ArrayBasedUpdates.enhance(raw);  // ✅ Now enhanced
raw.update({ textContent: ['A', 'B', 'C'] });
```

### Example: Enhancing a Dynamic Collection

```javascript
// You got a collection from a third-party library
const elements = someLibrary.getElements();

// Enhance it for array updates
ArrayBasedUpdates.enhance(elements);

// Now you can use arrays
elements.update({
  style: { color: ['red', 'blue', 'green'] }
});
```

### How It Works

```
ArrayBasedUpdates.enhance(collection)
   ↓
1️⃣ Save reference to existing .update() (if any)
   ↓
2️⃣ Create enhanced .update() that:
   ├── Detects numeric keys → delegates to original
   ├── Detects arrays → distributes
   └── No arrays → delegates to original or bulk
   ↓
3️⃣ Set collection.update = enhanced version
   ↓
4️⃣ Set collection._hasArrayUpdateSupport = true
   ↓
5️⃣ Return collection
```

The module always re-enhances, even if the collection already had an `.update()`. This ensures array support overrides previous versions while preserving their functionality through delegation.

---

## ArrayBasedUpdates.hasSupport(collection)

### What Does It Do?

Checks whether a collection has array-based update support enabled. Returns `true` or `false`.

### Syntax

```javascript
const supported = ArrayBasedUpdates.hasSupport(collection);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `collection` | `any` | The collection to check |

**Returns:** `boolean`

### Example

```javascript
const enhanced = querySelectorAll('.item');
const raw = document.querySelectorAll('.item');

console.log(ArrayBasedUpdates.hasSupport(enhanced));  // true
console.log(ArrayBasedUpdates.hasSupport(raw));        // false

// Enhance the raw one
ArrayBasedUpdates.enhance(raw);
console.log(ArrayBasedUpdates.hasSupport(raw));        // true
```

### Conditional Enhancement

```javascript
function safeArrayUpdate(collection, updates) {
  if (!ArrayBasedUpdates.hasSupport(collection)) {
    ArrayBasedUpdates.enhance(collection);
  }
  collection.update(updates);
}
```

---

## ArrayBasedUpdates.containsArrayValues(config)

### What Does It Do?

Scans an update configuration object to check if it contains **any** array values — including nested ones inside `style`, `dataset`, or `classList`. This is the same detection function the module uses internally.

### Syntax

```javascript
const hasArrays = ArrayBasedUpdates.containsArrayValues(config);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `object` | The update configuration to check |

**Returns:** `boolean`

### Examples

```javascript
// No arrays — bulk mode
ArrayBasedUpdates.containsArrayValues({
  textContent: 'Hello',
  style: { color: 'red' }
});
// false

// Top-level array
ArrayBasedUpdates.containsArrayValues({
  textContent: ['A', 'B', 'C']
});
// true

// Nested array inside style
ArrayBasedUpdates.containsArrayValues({
  textContent: 'Hello',
  style: { color: ['red', 'blue'] }
});
// true

// Nested array inside dataset
ArrayBasedUpdates.containsArrayValues({
  dataset: { id: ['1', '2', '3'] }
});
// true
```

---

## ArrayBasedUpdates.getValueForIndex(value, elementIndex, totalElements)

### What Does It Do?

Returns the appropriate value for a specific element index. This is the core distribution function — it picks the right value from an array, or returns the static value unchanged.

### Syntax

```javascript
const result = ArrayBasedUpdates.getValueForIndex(value, elementIndex, totalElements);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | `any` | The value (array or static) |
| `elementIndex` | `number` | The element's position in the collection |
| `totalElements` | `number` | Total number of elements |

**Returns:** The appropriate value for this index.

### Examples

```javascript
const colors = ['red', 'blue', 'green'];

// Within bounds — returns array[index]
ArrayBasedUpdates.getValueForIndex(colors, 0, 5);  // 'red'
ArrayBasedUpdates.getValueForIndex(colors, 1, 5);  // 'blue'
ArrayBasedUpdates.getValueForIndex(colors, 2, 5);  // 'green'

// Beyond bounds — returns last value
ArrayBasedUpdates.getValueForIndex(colors, 3, 5);  // 'green'
ArrayBasedUpdates.getValueForIndex(colors, 4, 5);  // 'green'

// Static value — returns as-is regardless of index
ArrayBasedUpdates.getValueForIndex('bold', 0, 5);  // 'bold'
ArrayBasedUpdates.getValueForIndex('bold', 3, 5);  // 'bold'
```

---

## ArrayBasedUpdates.processUpdatesForElement(updates, elementIndex, totalElements)

### What Does It Do?

Takes a full update configuration and processes it for one specific element — resolving all arrays to their corresponding index value while leaving static values unchanged.

### Syntax

```javascript
const processed = ArrayBasedUpdates.processUpdatesForElement(updates, elementIndex, totalElements);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `updates` | `object` | Full update configuration |
| `elementIndex` | `number` | Element's position |
| `totalElements` | `number` | Total elements count |

**Returns:** A new object with all arrays resolved for this index.

### Example

```javascript
const updates = {
  textContent: ['A', 'B', 'C'],
  style: {
    color: ['red', 'blue', 'green'],
    padding: '10px'
  }
};

// Process for element 0
const el0 = ArrayBasedUpdates.processUpdatesForElement(updates, 0, 3);
console.log(el0);
// { textContent: 'A', style: { color: 'red', padding: '10px' } }

// Process for element 1
const el1 = ArrayBasedUpdates.processUpdatesForElement(updates, 1, 3);
console.log(el1);
// { textContent: 'B', style: { color: 'blue', padding: '10px' } }

// Process for element 2
const el2 = ArrayBasedUpdates.processUpdatesForElement(updates, 2, 3);
console.log(el2);
// { textContent: 'C', style: { color: 'green', padding: '10px' } }
```

---

## ArrayBasedUpdates.applyArrayBasedUpdates(collection, updates)

### What Does It Do?

The low-level function that runs the full array distribution pipeline — converts the collection to an array, processes updates per element, and applies them. You can use this directly without needing `.update()` on the collection.

### Syntax

```javascript
ArrayBasedUpdates.applyArrayBasedUpdates(collection, updates);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `collection` | `NodeList`, `HTMLCollection`, `Array` | Target elements |
| `updates` | `object` | Update configuration with arrays |

**Returns:** The collection.

### Example

```javascript
// Apply directly to a raw DOM collection
const items = document.querySelectorAll('.item');

ArrayBasedUpdates.applyArrayBasedUpdates(items, {
  textContent: ['First', 'Second', 'Third'],
  style: { color: ['red', 'blue', 'green'] }
});
```

---

## ArrayBasedUpdates.initialize() / reinitialize()

### What Do They Do?

Both point to the same function. They re-run the patching process — wrapping all query functions and collection shortcuts with array support. Useful if modules were loaded in an unusual order or after dynamic module loading.

### Syntax

```javascript
ArrayBasedUpdates.initialize();    // Same function
ArrayBasedUpdates.reinitialize();  // Same function
```

**Returns:** `boolean` — `true` if at least one system was patched.

### Example

```javascript
// After dynamically loading another DOMHelpers module
loadScript('some-new-enhancer.js', () => {
  ArrayBasedUpdates.reinitialize();
  // Now the new module's outputs also get array support
});
```

### What Gets Patched

```
reinitialize()
   ↓
Patches (with retry):
├── Selector.queryAll       → enhanced with array support
├── querySelectorAll        → enhanced with array support
├── queryAll                → enhanced with array support
├── Collections.ClassName   → Proxy with array support
├── Collections.TagName     → Proxy with array support
├── Collections.Name        → Proxy with array support
├── ClassName (global)      → Proxy with array support
├── TagName (global)        → Proxy with array support
└── Name (global)           → Proxy with array support
```

---

## Complete API Reference

| Method | What It Does | Returns |
|--------|-------------|---------|
| `enhance(collection)` | Add array support to a collection | Enhanced collection |
| `hasSupport(collection)` | Check if collection has array support | `boolean` |
| `containsArrayValues(config)` | Check if config has any arrays | `boolean` |
| `getValueForIndex(value, index, total)` | Get value for specific element index | The resolved value |
| `processUpdatesForElement(updates, index, total)` | Process full config for one element | Resolved config object |
| `applyArrayBasedUpdates(collection, updates)` | Apply array updates directly | Collection |
| `isDistributableArray(value)` | Check if value is a non-empty array | `boolean` |
| `createEnhancedUpdateMethod(original)` | Create array-aware update function | Function |
| `initialize()` / `reinitialize()` | Re-run all patches | `boolean` |
| `version` | Module version string | `'1.1.0-fixed'` |

---

## Best Practices

### 1. Let Auto-Patching Do the Work

In most cases, you don't need to call `enhance()` manually — the module patches all standard query functions automatically:

```javascript
// ✅ Just use the patched functions normally
querySelectorAll('.item').update({
  textContent: ['A', 'B', 'C']
});

ClassName.item.update({
  style: { color: ['red', 'blue', 'green'] }
});
```

### 2. Use enhance() Only for Raw Collections

```javascript
// Only needed when you bypass the patched functions
const raw = document.querySelectorAll('.item');
ArrayBasedUpdates.enhance(raw);
raw.update({ textContent: ['A', 'B', 'C'] });
```

### 3. Match Array Length to Element Count When Possible

```javascript
const items = querySelectorAll('.item');  // 5 elements

// ✅ Clear intent — one value per element
items.update({
  textContent: ['A', 'B', 'C', 'D', 'E']  // 5 values for 5 elements
});

// ✅ Also fine — intentionally using last-value-repeats
items.update({
  style: { fontWeight: ['bold', 'normal'] }
  // First: bold, rest: normal — this is the intended pattern
});
```

### 4. Use .map() for Data Transformation

```javascript
const users = [
  { name: 'Alice', role: 'admin' },
  { name: 'Bob', role: 'user' },
  { name: 'Carol', role: 'user' }
];

querySelectorAll('.user-row').update({
  textContent: users.map(u => u.name),
  classList: {
    add: users.map(u => `role-${u.role}`)
  }
});
```

### 5. Combine with Array.from() for Computed Patterns

```javascript
const count = 10;

querySelectorAll('.item').update({
  style: {
    // Rainbow colors
    backgroundColor: Array.from({ length: count }, (_, i) =>
      `hsl(${i * (360 / count)}, 70%, 80%)`
    ),
    // Alternating rows
    opacity: Array.from({ length: count }, (_, i) =>
      i % 2 === 0 ? '1' : '0.8'
    )
  }
});
```

### 6. Use reinitialize() Sparingly

```javascript
// Only needed if load order was unusual
// or after dynamically loading new modules
ArrayBasedUpdates.reinitialize();
```

---

## Integration with Other DOMHelpers Modules

The Array-Based Updates module works seamlessly with all collection-returning systems:

```javascript
// With Selector.queryAll
Selector.queryAll('.item').update({
  textContent: ['A', 'B', 'C']
});

// With Global Query
queryAll('.item').update({
  style: { color: ['red', 'blue', 'green'] }
});

// With Collection Shortcuts
ClassName.card.update({
  dataset: { index: ['0', '1', '2'] }
});

TagName.li.update({
  textContent: ['Item 1', 'Item 2', 'Item 3']
});

Name.field.update({
  value: ['Alice', 'Bob', 'Carol']
});
```

---

## Summary

| Category | Key Methods | Purpose |
|----------|------------|---------|
| **Enhancement** | `enhance()` | Add array support to raw collections |
| **Detection** | `hasSupport()`, `containsArrayValues()` | Check capabilities |
| **Distribution** | `getValueForIndex()`, `processUpdatesForElement()` | Core distribution logic |
| **Direct Apply** | `applyArrayBasedUpdates()` | Low-level update without `.update()` |
| **Initialization** | `initialize()`, `reinitialize()` | Re-run patches |

> **Simple Rule to Remember:** The module auto-patches everything, so you rarely need the utility methods. Use `enhance()` for raw collections, `hasSupport()` for debugging, and `reinitialize()` only when load order causes issues. For everyday use, just pass arrays in your `.update()` calls and let the module handle the rest.