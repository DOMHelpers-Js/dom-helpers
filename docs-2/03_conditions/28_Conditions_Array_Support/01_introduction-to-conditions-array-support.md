[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Conditions Array Support — Introduction

## Quick Start (30 seconds)

```javascript
// Each element gets its own value from the array
Conditions.apply('active', {
  'active': {
    textContent: ['Apple', 'Banana', 'Cherry'],
    style: { color: ['red', 'yellow', 'pink'] }
  }
}, '.fruit-item');

// Element 0: textContent="Apple", color="red"
// Element 1: textContent="Banana", color="yellow"
// Element 2: textContent="Cherry", color="pink"
```

---

## What Is Conditions Array Support?

The Conditions Array Support module enhances the Conditions system so that when you put **arrays** inside a condition config, each array value is **distributed** to the corresponding element in the collection.

Without this module, all elements in a collection get the **same** config. With it, you can give each element **its own unique** values — different text, different colors, different classes — all in one call.

```
Without array support:
textContent: 'Hello'
├── Element 0 → "Hello"
├── Element 1 → "Hello"
└── Element 2 → "Hello"    ← All same

With array support:
textContent: ['A', 'B', 'C']
├── Element 0 → "A"
├── Element 1 → "B"
└── Element 2 → "C"        ← Each unique
```

The module works **automatically** — it detects arrays in your config and distributes them. No API changes needed. Your existing non-array configs continue to work exactly as before.

---

## Syntax

```javascript
// Just use arrays in your condition configs — that's it!
Conditions.apply(value, {
  'condition': {
    textContent: ['value1', 'value2', 'value3'],   // Array → distributed
    style: { color: 'blue' }                        // Non-array → all elements
  }
}, selector);
```

**No new methods** are added to the `Conditions.apply()` signature. The module enhances the existing method transparently.

**Additional utility methods:**

| Method | Description |
|--------|-------------|
| `Conditions.hasArrayValues(config)` | Check if a config contains arrays |
| `Conditions.applyWithArrays(elements, config)` | Apply array config directly (no condition matching) |
| `Conditions.restoreArraySupport()` | Revert to original `apply()` behavior |

---

## Why Does This Exist?

### The Situation: Unique Values Per Element

Imagine you have a list of items and want each one to show different text and a different color. Without array support, you'd need index-specific overrides for every single element:

```javascript
// Without array support — verbose and rigid
Conditions.apply('show', {
  'show': {
    0: { textContent: 'Apple',  style: { color: 'red' } },
    1: { textContent: 'Banana', style: { color: 'yellow' } },
    2: { textContent: 'Cherry', style: { color: 'pink' } }
  }
}, '.fruit');
```

This works, but it gets tedious with many elements and doesn't scale. If you have 20 items, you'd need 20 index entries.

### With Array Support

One property, one array — the module distributes automatically:

```javascript
// With array support — clean and scalable
Conditions.apply('show', {
  'show': {
    textContent: ['Apple', 'Banana', 'Cherry'],
    style: { color: ['red', 'yellow', 'pink'] }
  }
}, '.fruit');
```

Same result, much less code. And if your data comes from an API or a state variable, arrays are the natural format.

---

## Mental Model

Think of it like **dealing cards**.

```
Config without arrays (bulk):
├── Same card to everyone
└── All players hold: Ace of Spades

Config with arrays (distribution):
├── Player 0 gets → Card 0 (Ace of Hearts)
├── Player 1 gets → Card 1 (King of Diamonds)
├── Player 2 gets → Card 2 (Queen of Clubs)
└── Player 3 gets → Card 3 (Jack of Spades)

If you run out of cards (array shorter than players):
├── Player 0 gets → Card 0 (Ace)
├── Player 1 gets → Card 1 (King)
├── Player 2 gets → Card 1 (King)  ← Last card repeats
└── Player 3 gets → Card 1 (King)  ← Last card repeats
```

Non-array values are like a rule that applies to **everyone**. Array values are like individual items dealt **one per player**.

---

## How Does It Work?

```
Conditions.apply(value, conditions, selector)
   ↓
1️⃣ Find matching condition (same as before)
   ↓
2️⃣ Get the matching config object
   ↓
3️⃣ Separate config into:
   ├── Non-numeric keys → sharedProps (bulk or array distribution)
   └── Numeric keys → indexProps (index-specific overrides)
   ↓
4️⃣ Check sharedProps for arrays:
   ├── containsArrayValues(sharedProps)?
   │   ├── YES → Array Distribution Mode
   │   │   └── For each element at index i:
   │   │       processUpdatesForElement(sharedProps, i, total)
   │   │       → Arrays pick value[i], non-arrays stay as-is
   │   │
   │   └── NO → Bulk Mode (original behavior)
   │       └── All elements get the same sharedProps
   ↓
5️⃣ Apply indexProps to specific elements (same as before)
```

### Key Detail: How Array Detection Works

The `containsArrayValues()` function recursively checks the config for any array values:

```javascript
{
  textContent: ['A', 'B'],           // ← Array found! → true
  style: { color: 'red' }            // Not an array
}
// containsArrayValues → true

{
  textContent: 'Hello',
  style: { color: 'red' }
}
// containsArrayValues → false (no arrays anywhere)

{
  textContent: 'Hello',
  style: { color: ['red', 'blue'] }  // ← Nested array found! → true
}
// containsArrayValues → true (checks nested objects too)
```

### Key Detail: How Distribution Works

For each element, `processUpdatesForElement()` creates an individual config by picking the right value from each array:

```
Config: {
  textContent: ['A', 'B', 'C'],
  style: {
    color: ['red', 'blue', 'green'],
    fontWeight: 'bold'               ← Not an array, stays as-is
  }
}

For element at index 1:
processUpdatesForElement(config, 1, 3) →
{
  textContent: 'B',                  ← Picked array[1]
  style: {
    color: 'blue',                   ← Picked array[1]
    fontWeight: 'bold'               ← Unchanged (not an array)
  }
}
```

### Key Detail: Last Value Repeats

If the array has fewer values than elements, the **last value** in the array is used for all remaining elements:

```
Array: ['A', 'B']
Elements: 5

Element 0 → 'A'   (array[0])
Element 1 → 'B'   (array[1])
Element 2 → 'B'   (array[1] — last value repeats)
Element 3 → 'B'   (array[1] — last value repeats)
Element 4 → 'B'   (array[1] — last value repeats)
```

If the array has more values than elements, the extra values are simply ignored.

---

## Basic Usage

### Array Distribution for Text

```javascript
Conditions.apply('show', {
  'show': {
    textContent: ['First Item', 'Second Item', 'Third Item']
  }
}, '.item');

// Element 0 → "First Item"
// Element 1 → "Second Item"
// Element 2 → "Third Item"
```

### Array Distribution for Styles

```javascript
Conditions.apply('colored', {
  'colored': {
    style: {
      color: ['red', 'blue', 'green'],
      fontSize: ['14px', '16px', '18px']
    }
  }
}, '.item');

// Element 0 → color: red, fontSize: 14px
// Element 1 → color: blue, fontSize: 16px
// Element 2 → color: green, fontSize: 18px
```

### Mixed Arrays and Static Values

Arrays are distributed per-element. Non-array values apply to all:

```javascript
Conditions.apply('active', {
  'active': {
    textContent: ['Item 1', 'Item 2', 'Item 3'],    // Array → distributed
    classList: { add: 'active' },                     // Static → all elements
    style: {
      color: ['red', 'blue', 'green'],               // Array → distributed
      fontWeight: 'bold'                              // Static → all elements
    }
  }
}, '.item');

// All elements get: classList.add('active'), fontWeight: 'bold'
// Each element gets unique: textContent and color
```

### Combined with Index-Specific Overrides

Array distribution works alongside numeric index keys:

```javascript
Conditions.apply('active', {
  'active': {
    // Arrays distributed across all
    textContent: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
    style: { color: ['red', 'blue', 'green', 'orange'] },

    // Index-specific overrides (applied after distribution)
    0:  { style: { fontWeight: 'bold', fontSize: '20px' } },
    -1: { classList: { add: 'last-item' } }
  }
}, '.item');

// Element 0: text="Item 1", color="red", fontWeight="bold", fontSize="20px"
// Element 1: text="Item 2", color="blue"
// Element 2: text="Item 3", color="green"
// Element 3: text="Item 4", color="orange", class="last-item"
```

---

## Supported Property Types with Arrays

### Direct Properties

```javascript
{
  textContent: ['Text 1', 'Text 2', 'Text 3'],
  innerHTML: ['<b>Bold 1</b>', '<b>Bold 2</b>', '<b>Bold 3</b>'],
  value: ['Value A', 'Value B', 'Value C'],
  placeholder: ['Enter A', 'Enter B', 'Enter C']
}
```

### Style Object

```javascript
{
  style: {
    color: ['red', 'blue', 'green'],
    fontSize: ['14px', '16px', '18px'],
    backgroundColor: ['#fee', '#eef', '#efe'],
    padding: '10px'  // Non-array: same for all
  }
}
```

### classList Operations

```javascript
{
  classList: {
    add: [
      ['class-a1', 'class-a2'],   // Element 0 gets both
      ['class-b1'],                // Element 1 gets one
      ['class-c1', 'class-c2']    // Element 2 gets both
    ],
    remove: ['old-1', 'old-2', 'old-3']
  }
}
```

### Dataset

```javascript
{
  dataset: {
    id: ['id-1', 'id-2', 'id-3'],
    type: ['type-a', 'type-b', 'type-c']
  }
}
// Element 0: data-id="id-1", data-type="type-a"
// Element 1: data-id="id-2", data-type="type-b"
// Element 2: data-id="id-3", data-type="type-c"
```

---

## Utility Methods

### Conditions.hasArrayValues(config)

Check if a config object contains any array values (at any nesting level):

```javascript
Conditions.hasArrayValues({
  textContent: 'Hello',
  style: { color: 'red' }
});
// false — no arrays

Conditions.hasArrayValues({
  textContent: ['A', 'B', 'C']
});
// true — textContent is an array

Conditions.hasArrayValues({
  style: { color: ['red', 'blue'] }
});
// true — nested array detected
```

### Conditions.applyWithArrays(elements, config)

Apply a config with array distribution directly — **without condition matching**. Useful when you already have elements and config ready:

```javascript
const items = document.querySelectorAll('.item');

Conditions.applyWithArrays(items, {
  textContent: ['Apple', 'Banana', 'Cherry'],
  style: {
    backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffe66d']
  }
});
```

If the config has no arrays, it falls back to a standard bulk update.

### Conditions.restoreArraySupport()

Revert `Conditions.apply()` to its original behavior (before this module patched it):

```javascript
Conditions.restoreArraySupport();
// Array distribution is now disabled for Conditions.apply()
```

---

## What Gets Patched

The module patches `Conditions.apply()` (from the standalone apply module) to use array-aware collection application. It also provides enhanced versions of:

- `enhancedApplyManually()` — array-aware replacement for the Collection Extension's manual fallback
- `enhancedApplyToCollection()` — array-aware replacement for the standalone apply's collection logic

These are stored on `Conditions.arraySupport` and `global.ConditionsArraySupport` for programmatic access.

---

## Load Order

```html
<!-- 1. Array-based updates engine (required) -->
<script src="10_dh-array-based-updates.js"></script>

<!-- 2. Core Conditions (required) -->
<script src="01_dh-conditional-rendering.js"></script>

<!-- 3. Standalone Apply (required for patching) -->
<script src="04_dh-conditions-apply-index-support.js"></script>

<!-- 4. Array Support (this module — after all dependencies) -->
<script src="07_dh-conditions-array-support.js"></script>
```

Both `Conditions.js` and `ArrayBasedUpdates` must be loaded before this module.

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | Adds array distribution to Conditions — each element gets its own value |
| **Automatic** | Detects arrays in configs and distributes them — no API changes |
| **Distribution** | `array[i]` goes to `element[i]` |
| **Last value repeats** | If array is shorter than elements, last value fills the rest |
| **Mixed support** | Arrays are distributed, non-arrays apply to all elements |
| **Nested arrays** | Works inside `style`, `dataset`, `classList` objects |
| **Index overrides** | Numeric keys still work — applied after array distribution |
| **hasArrayValues()** | Utility to check if a config contains arrays |
| **applyWithArrays()** | Apply array config directly without condition matching |
| **restoreArraySupport()** | Revert to original behavior |
| **Requires** | `Conditions.js` + `ArrayBasedUpdates` |

> **Simple Rule to Remember:** If a property value in your condition config is an **array**, each element in the collection gets its **own value** from that array. If it's **not an array**, all elements get the **same value**. Arrays and non-arrays can be mixed freely in the same config. The last array value repeats if there are more elements than values.