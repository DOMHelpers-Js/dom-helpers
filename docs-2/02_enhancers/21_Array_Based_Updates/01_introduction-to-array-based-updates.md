[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Array-Based Updates — Introduction

## Quick Start (30 seconds)

```javascript
// 3 elements with class "item" — give each one a DIFFERENT text
querySelectorAll('.item').update({
  textContent: ['Apple', 'Banana', 'Cherry']
});

// Each element gets its own value:
// Element 0 → 'Apple'
// Element 1 → 'Banana'
// Element 2 → 'Cherry'

// Mix arrays (per-element) with static values (all elements)
querySelectorAll('.item').update({
  textContent: ['Apple', 'Banana', 'Cherry'],     // Different for each
  style: {
    color: ['red', 'yellow', 'pink'],              // Different for each
    padding: '10px'                                // Same for all
  }
});
```

---

## What Is the Array-Based Updates Module?

When you use `.update()` on a collection, normally every element gets the **same** values. That's great for bulk styling, but what about when you need each element to get a **different** value?

The Array-Based Updates module adds a simple, powerful idea: **if a value is an array, distribute it across the elements** — element 0 gets the first value, element 1 gets the second, element 2 gets the third, and so on.

Simply put, instead of writing a loop to give each element its own text, color, or data, you just pass an **array** and the module handles the distribution automatically.

---

## Syntax

```javascript
// Array values are distributed — one per element
collection.update({
  textContent: ['Value 1', 'Value 2', 'Value 3']
});

// Static values go to ALL elements
collection.update({
  textContent: 'Same for everyone'
});

// Mix both freely
collection.update({
  textContent: ['Different', 'For', 'Each'],   // Array → distributed
  style: { padding: '10px' }                    // Static → all elements
});
```

---

## Why Does This Exist?

### The Manual Way — Looping Through Elements

When you need each element to show different content, you'd normally write a loop:

```javascript
const items = document.querySelectorAll('.item');
const names = ['Apple', 'Banana', 'Cherry'];
const colors = ['red', 'yellow', 'pink'];

items.forEach((element, index) => {
  element.textContent = names[index];
  element.style.color = colors[index];
  element.style.padding = '10px';
  element.style.borderRadius = '4px';
  element.classList.add('fruit');
});
```

This works, but notice:

- You have to manage the `index` yourself
- You mix per-element values (`names[index]`) with shared values (`'10px'`)
- Adding more properties means more lines inside the loop
- The loop logic obscures what you're actually setting

### The Array-Based Way — Let the Module Handle It

```javascript
querySelectorAll('.item').update({
  textContent: ['Apple', 'Banana', 'Cherry'],
  style: {
    color: ['red', 'yellow', 'pink'],
    padding: '10px',
    borderRadius: '4px'
  },
  classList: { add: 'fruit' }
});
```

**What changed?**

- No loop, no index management
- Arrays are automatically distributed — one value per element
- Static values (`'10px'`, `'4px'`, `'fruit'`) go to all elements
- Everything is in one declarative object

---

## Mental Model

Think of it like a **mail carrier delivering packages on a street**.

```
Your update object = the mail carrier's delivery list

Street: [House 0]  [House 1]  [House 2]

textContent: ['Apple', 'Banana', 'Cherry']
   → House 0 gets 'Apple'
   → House 1 gets 'Banana'
   → House 2 gets 'Cherry'

style.padding: '10px'
   → House 0 gets '10px'
   → House 1 gets '10px'
   → House 2 gets '10px'
```

- **Array values** = individual packages, one per house
- **Static values** = bulk delivery, same for every house
- The mail carrier (the module) figures out who gets what

---

## How Does It Work?

When you call `.update()` on an enhanced collection, the module follows this decision flow:

```
collection.update(updates)
   ↓
1️⃣ Are there numeric keys (0, 1, '-1')?
   ├── Yes → Use index-based updates (delegate to original .update())
   └── No → continue
   ↓
2️⃣ Are there any array values in the updates?
   ├── Yes → Array distribution mode
   └── No → Bulk update mode (same value for all)
   ↓
Array distribution mode:
   ↓
3️⃣ For each element (index 0, 1, 2, ...):
   ├── Process the updates object for this index
   │   ├── Array value? → pick value[index]
   │   └── Static value? → use as-is
   └── Apply the processed updates to this element
   ↓
4️⃣ Return the collection
```

### The Key Function: `getValueForIndex`

This is the heart of the distribution logic:

```
getValueForIndex(value, elementIndex, totalElements)
   ↓
Is value an array?
   ├── No → return value as-is (static)
   └── Yes:
       ├── index < array.length? → return array[index]
       └── index >= array.length? → return array[last] (repeat last value)
```

**The "repeat last value" rule** is important — if you have 5 elements but only 3 values in the array, elements 3 and 4 get the **last** array value:

```javascript
// Array: ['A', 'B', 'C'], Elements: 5
// Element 0 → 'A'
// Element 1 → 'B'
// Element 2 → 'C'
// Element 3 → 'C' (last value repeats)
// Element 4 → 'C' (last value repeats)
```

---

## Basic Usage

### Different Text for Each Element

```javascript
// HTML: <div class="card"></div> × 3
querySelectorAll('.card').update({
  textContent: ['Featured', 'Popular', 'New']
});
// Card 0 → 'Featured'
// Card 1 → 'Popular'
// Card 2 → 'New'
```

### Different Styles for Each Element

```javascript
querySelectorAll('.item').update({
  style: {
    color: ['red', 'blue', 'green'],
    fontSize: ['14px', '16px', '18px']
  }
});
// Item 0 → color: red, fontSize: 14px
// Item 1 → color: blue, fontSize: 16px
// Item 2 → color: green, fontSize: 18px
```

### Mixed Arrays and Static Values

```javascript
querySelectorAll('.btn').update({
  textContent: ['Save', 'Cancel', 'Help'],       // Different
  style: {
    backgroundColor: ['green', 'red', 'blue'],   // Different
    padding: '10px',                              // Same for all
    borderRadius: '4px',                          // Same for all
    color: 'white'                                // Same for all
  }
});
```

### With Collection Shortcuts

```javascript
// Works with ClassName
ClassName.item.update({
  textContent: ['A', 'B', 'C']
});

// Works with TagName
TagName.li.update({
  style: { color: ['red', 'blue', 'green'] }
});

// Works with Selector.queryAll
Selector.queryAll('.card').update({
  dataset: { index: ['0', '1', '2'] }
});
```

---

## What Gets Patched?

The module automatically patches these query functions so their collections support array distribution:

```
Module loads
   ↓
Patches (with retry logic):
├── Selector.queryAll()
├── querySelectorAll() (global)
├── queryAll() (global)
├── Collections.ClassName  (Proxy)
├── Collections.TagName    (Proxy)
├── Collections.Name       (Proxy)
├── ClassName (global shortcut, Proxy)
├── TagName (global shortcut, Proxy)
└── Name (global shortcut, Proxy)
```

The "retry logic" means the module tries to patch immediately, again on `DOMContentLoaded`, and again after a 100ms delay — ensuring it works regardless of load order.

---

## Access Points

```javascript
// Global
ArrayBasedUpdates.version;  // '1.1.0-fixed'

// Via DOMHelpers namespace
DOMHelpers.ArrayBasedUpdates.version;
```

---

## Load Order

```html
<!-- 1. Core library -->
<script src="01_dh-core.js"></script>

<!-- 2. Other enhancers (optional) -->
<script src="..."></script>

<!-- 3. Array-Based Updates (last enhancer recommended) -->
<script src="10_dh-array-based-updates.js"></script>
```

The module uses aggressive patching with retry logic, so it works even if loaded before other modules. However, loading it **last** among enhancers is recommended for the cleanest integration.

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | Pass arrays in `.update()` to give each element a different value |
| **Array values** | Distributed — element 0 gets `array[0]`, element 1 gets `array[1]`, etc. |
| **Static values** | Applied to ALL elements (bulk) |
| **Mixed** | Arrays and static values work together freely |
| **Short array** | Last value repeats for remaining elements |
| **Long array** | Extra values are ignored |
| **Auto-patching** | All query functions and collection shortcuts are enhanced automatically |

> **Simple Rule to Remember:** If the value is an **array**, each element gets its own item from the array. If the value is **not an array**, every element gets the same value. You can mix both in a single `.update()` call.