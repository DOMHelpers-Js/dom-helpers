[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Manual Patching and API Reference

Everything you need to know about manually patching arrays and the complete API surface.

---

## When you need manual patching

Arrays that exist **at the time of state creation** are patched automatically. But sometimes arrays are added later:

```javascript
const app = ReactiveUtils.state({ name: 'Alice' });

// This array was added AFTER state creation — not automatically patched
app.scores = [90, 85, 92];

app.scores.push(88);  // Won't trigger effects ❌
```

This is where `patchArray()` comes in.

---

## patchReactiveArray() / patchArray()

### Syntax

```javascript
// Global function
patchReactiveArray(state, key);

// Or through ReactiveUtils
ReactiveUtils.patchArray(state, key);

// Or through Elements, Collections, Selector
Elements.patchArray(state, key);
Collections.patchArray(state, key);
Selector.patchArray(state, key);
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `state` | Reactive object | The reactive state containing the array |
| `key` | String | The property name of the array to patch |

### Returns

`undefined`

### Example

```javascript
const app = ReactiveUtils.state({ name: 'Alice' });

// Add an array after creation
app.scores = [90, 85, 92];

// Manually patch it
ReactiveUtils.patchArray(app, 'scores');

// Now it works
ReactiveUtils.effect(() => {
  console.log('Scores:', app.scores.length);
});

app.scores.push(88);  // Effect re-runs: "Scores: 4" ✅
app.scores.pop();      // Effect re-runs: "Scores: 3" ✅
```

---

## When to use manual patching

### Scenario 1: Arrays added after state creation

```javascript
const app = ReactiveUtils.state({ user: 'Alice' });

// Later in your code, you add an array
app.history = [];
ReactiveUtils.patchArray(app, 'history');

app.history.push('visited /home');  // Triggers effects ✅
```

### Scenario 2: Arrays received from an API

```javascript
const app = ReactiveUtils.state({ data: null });

// After API response
const response = await fetch('/api/items');
app.data = await response.json();  // data is now an array

ReactiveUtils.patchArray(app, 'data');
app.data.push(newItem);  // Triggers effects ✅
```

### Scenario 3: Arrays replaced with a new reference

When you replace an array entirely, the automatic `$watch` should re-patch it. But if you need to be sure:

```javascript
app.items = fetchedItems;
ReactiveUtils.patchArray(app, 'items');  // Ensure the new array is patched
```

---

## Comparing: auto-patched vs manual

```
Automatic (at state creation time):
const app = ReactiveUtils.state({
  items: [1, 2, 3]     ← Patched automatically
});

Manual (after state creation):
app.newItems = [4, 5, 6];
ReactiveUtils.patchArray(app, 'newItems');  ← Must patch manually
```

---

## Complete API reference

### Module behavior

| What | Detail |
|------|--------|
| **Patches** | `ReactiveUtils.state()` — enhanced with array auto-patching |
| **Requires** | `ReactiveUtils` (from `01_dh-reactive.js`) |
| **Detects** | `Elements`, `Collections`, `Selector` — patches their `.state()` too |

### Patched array methods

| Method | Original behavior | Patched behavior |
|--------|------------------|-----------------|
| `push(...items)` | Adds items, returns new length | Same + triggers effects |
| `pop()` | Removes last, returns it | Same + triggers effects |
| `shift()` | Removes first, returns it | Same + triggers effects |
| `unshift(...items)` | Adds to start, returns new length | Same + triggers effects |
| `splice(start, count, ...items)` | Removes/adds, returns removed | Same + triggers effects |
| `sort(compareFn?)` | Sorts in place, returns array | Same + triggers effects |
| `reverse()` | Reverses in place, returns array | Same + triggers effects |
| `fill(value, start?, end?)` | Fills with value, returns array | Same + triggers effects |
| `copyWithin(target, start?, end?)` | Copies within, returns array | Same + triggers effects |

### Methods NOT patched (don't need it)

| Method | Why no patch needed |
|--------|-------------------|
| `map()` | Returns a new array, doesn't mutate |
| `filter()` | Returns a new array, doesn't mutate |
| `slice()` | Returns a new array, doesn't mutate |
| `find()` | Returns an element, doesn't mutate |
| `findIndex()` | Returns an index, doesn't mutate |
| `every()` | Returns a boolean, doesn't mutate |
| `some()` | Returns a boolean, doesn't mutate |
| `reduce()` | Returns a value, doesn't mutate |
| `forEach()` | Returns undefined, doesn't mutate |
| `includes()` | Returns a boolean, doesn't mutate |
| `indexOf()` | Returns an index, doesn't mutate |
| `concat()` | Returns a new array, doesn't mutate |
| `flat()` | Returns a new array, doesn't mutate |
| `flatMap()` | Returns a new array, doesn't mutate |

To use non-mutating methods reactively, **reassign the result**:

```javascript
app.items = app.items.filter(i => i.active);  // Triggers effects ✅
```

### Exported functions

| Function | Available on | Purpose |
|----------|-------------|---------|
| `patchReactiveArray(state, key)` | `global` (window) | Manually patch an array property |
| `ReactiveUtils.patchArray(state, key)` | `ReactiveUtils` | Same function |
| `Elements.patchArray(state, key)` | `Elements` (if loaded) | Same function |
| `Collections.patchArray(state, key)` | `Collections` (if loaded) | Same function |
| `Selector.patchArray(state, key)` | `Selector` (if loaded) | Same function |

### Internal mechanisms

| Mechanism | What it does |
|-----------|-------------|
| `__patched` flag | Hidden boolean on each array, prevents double-patching |
| `$watch(key, ...)` | Watches for array replacement, re-patches the new array |
| `[...this]` copy | After mutation, creates a copy and reassigns to trigger the set trap |

---

## Load order

```html
<!-- 1. DOMHelpers Core (optional) -->
<script src="01_dh-elements.js"></script>
<script src="02_dh-collections.js"></script>
<script src="03_dh-selector.js"></script>

<!-- 2. Reactive State (required) -->
<script src="04_reactive/01_dh-reactive.js"></script>

<!-- 3. Array Patch (must come after reactive state) -->
<script src="04_reactive/02_dh-reactive-array-patch.js"></script>
```

---

## Common questions

### Does this affect performance?

Each mutation method creates a shallow copy (`[...this]`) and reassigns the property. For small to medium arrays (under a few thousand items), this is negligible. For very large arrays with frequent mutations, consider batching:

```javascript
ReactiveUtils.batch(() => {
  for (let i = 0; i < 1000; i++) {
    app.items.push(i);
  }
});
// Only one effect re-run instead of 1000
```

### Does this work with nested arrays?

Arrays inside nested objects are patched at creation time:

```javascript
const app = ReactiveUtils.state({
  matrix: {
    rows: [[1, 2], [3, 4]]
  }
});

app.matrix.rows.push([5, 6]);  // Triggers effects ✅
```

However, the **inner arrays** (`[1, 2]`, `[3, 4]`) are not individually patched by default. To trigger effects when mutating an inner array, reassign:

```javascript
// Inner array mutation — reassign to trigger
app.matrix.rows[0] = [...app.matrix.rows[0], 99];
```

### Can I un-patch an array?

There's no built-in un-patch function. The `__patched` flag prevents re-patching, and the wrapped methods simply add a reassignment step. The overhead is minimal enough that un-patching isn't typically needed.

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | Patches 9 array mutation methods to trigger reactive effects |
| **How** | Wraps each method to reassign the property after mutation |
| **Auto** | Arrays in `state()` are patched automatically at creation |
| **Manual** | `ReactiveUtils.patchArray(state, key)` for arrays added later |
| **Returns** | Original return values are preserved |
| **Prevention** | `__patched` flag stops double-wrapping |
| **Re-patch** | `$watch` detects array replacement and patches the new array |
| **Non-mutating** | `filter`, `map`, `slice`, etc. — reassign the result instead |

---

## Congratulations!

You've completed the Reactive Array Patch learning path. You now understand:

- ✅ Why array methods don't trigger effects by default
- ✅ How the patch wraps mutation methods with reassignment
- ✅ Which 9 methods are patched and what they return
- ✅ How automatic patching works at state creation
- ✅ When and how to use manual patching
- ✅ Real-world patterns for lists, queues, and sortable data
- ✅ Best practices for mutating vs non-mutating methods

**Your reactive arrays are ready for production!**