[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Reactive Array Patch

## What is it?

The Reactive Array Patch makes **array mutation methods** — like `push()`, `pop()`, `splice()`, `sort()`, and others — work automatically with reactive state.

Without this patch, calling `app.items.push('new item')` modifies the array but **doesn't trigger effects**. With the patch, it triggers effects just like you'd expect.

Simply put — load this file after the core Reactive module, and array methods "just work" with reactivity.

---

## Why does this exist?

### The situation: arrays and reactivity

The core reactive system tracks property **reads** and **writes** using a JavaScript Proxy. When you do `state.count = 5`, the Proxy's `set` trap fires and triggers effects.

But array methods like `push()`, `pop()`, and `sort()` **mutate the array in place** — they don't reassign the property. The Proxy's `set` trap never fires:

```javascript
const app = ReactiveUtils.state({ items: ['Apple', 'Banana'] });

ReactiveUtils.effect(() => {
  console.log('Items:', app.items.length);
});
// Output: "Items: 2"

// This modifies the array in place — the set trap doesn't fire
app.items.push('Cherry');
// No output — effect doesn't re-run!

console.log(app.items.length);  // 3 — the data changed, but nobody was notified
```

### What's happening under the hood

```
app.items = ['new array'];     ← Property REASSIGNMENT → set trap fires → effects run ✅

app.items.push('new item');    ← In-place MUTATION → set trap does NOT fire → effects silent ❌
```

The array itself changed, but the **property** `items` still points to the same array object. From the Proxy's perspective, nothing was reassigned.

### With the Array Patch

```javascript
// Just load the patch — no code changes needed
// <script src="02_dh-reactive-array-patch.js"></script>

const app = ReactiveUtils.state({ items: ['Apple', 'Banana'] });

ReactiveUtils.effect(() => {
  console.log('Items:', app.items.length);
});
// Output: "Items: 2"

app.items.push('Cherry');
// Output: "Items: 3" ← Effect re-runs automatically!

app.items.pop();
// Output: "Items: 2" ← Works again!

app.items.sort();
// Output: "Items: 2" ← Even sort triggers the effect!
```

---

## Mental model: The notification bell

Think of reactive state as a system where changing a value **rings a notification bell** so everyone listening knows about the change.

```
Without the patch:
├── state.count = 5            → Bell rings! 🔔 (property reassigned)
├── state.items = [1, 2, 3]    → Bell rings! 🔔 (property reassigned)
├── state.items.push(4)        → Silence... 🔇 (array mutated in place)
├── state.items.pop()          → Silence... 🔇 (array mutated in place)
└── state.items.sort()         → Silence... 🔇 (array mutated in place)

With the patch:
├── state.count = 5            → Bell rings! 🔔
├── state.items = [1, 2, 3]    → Bell rings! 🔔
├── state.items.push(4)        → Bell rings! 🔔 (patch makes it ring)
├── state.items.pop()          → Bell rings! 🔔 (patch makes it ring)
└── state.items.sort()         → Bell rings! 🔔 (patch makes it ring)
```

The patch **wraps** each array mutation method so that after the original method runs, it reassigns the property with a copy of the updated array — which triggers the Proxy's set trap and rings the bell.

---

## How does it work?

```
You call: app.items.push('Cherry')
   ↓
1️⃣ The patched push() runs the ORIGINAL Array.prototype.push
   → The array now contains ['Apple', 'Banana', 'Cherry']
   ↓
2️⃣ The patched push() creates a copy: [...this]
   → A new array: ['Apple', 'Banana', 'Cherry']
   ↓
3️⃣ The patched push() REASSIGNS the property: state.items = newArray
   → The Proxy's set trap fires
   ↓
4️⃣ All effects watching "items" re-run
   ↓
5️⃣ The original return value is returned
   → push returns 3 (the new length)
```

### Which methods are patched?

All nine array mutation methods:

| Method | What it does |
|--------|-------------|
| `push()` | Add items to the end |
| `pop()` | Remove the last item |
| `shift()` | Remove the first item |
| `unshift()` | Add items to the beginning |
| `splice()` | Add/remove items at any position |
| `sort()` | Sort the array |
| `reverse()` | Reverse the array |
| `fill()` | Fill with a value |
| `copyWithin()` | Copy part of the array to another position |

Non-mutating methods like `map()`, `filter()`, `slice()`, and `find()` are **not patched** — they don't modify the array, so they don't need patching.

---

## How the patch is applied

### Automatic patching (on state creation)

When you load the module, it replaces `ReactiveUtils.state()` with an enhanced version. Every time you create reactive state, array properties are **automatically detected and patched**:

```javascript
// This now automatically patches the "items" array
const app = ReactiveUtils.state({
  items: [1, 2, 3],
  tags: ['a', 'b'],
  name: 'Alice'  // Not an array — not patched
});

app.items.push(4);  // Triggers effects ✅
app.tags.push('c'); // Triggers effects ✅
```

### Deep patching

Arrays inside nested objects are also patched:

```javascript
const app = ReactiveUtils.state({
  user: {
    favorites: ['Pizza', 'Sushi'],
    settings: {
      recentSearches: ['js', 'css']
    }
  }
});

app.user.favorites.push('Tacos');              // Triggers effects ✅
app.user.settings.recentSearches.push('html'); // Triggers effects ✅
```

### Re-patching on replacement

If you replace an array entirely, the new array is automatically patched too:

```javascript
const app = ReactiveUtils.state({ items: [1, 2, 3] });

// Replace the array
app.items = [10, 20, 30];  // New array — triggers effects

// The new array is also patched
app.items.push(40);  // Still triggers effects ✅
```

This works because the module sets up a `$watch` on the property — when the value changes, it re-patches the new array.

---

## The double-patch prevention

Each array gets a hidden `__patched` flag to prevent patching the same array twice:

```javascript
const arr = [1, 2, 3];
// After patching:
// arr.__patched = true (non-enumerable, non-configurable)

// If the patch code encounters this array again, it skips it
```

This ensures that even if a property is accessed multiple times, the methods are only wrapped once.

---

## Syntax

The patch has **no new syntax** for daily use. You just use arrays normally:

```javascript
const app = ReactiveUtils.state({ items: [] });

// All of these now trigger effects automatically
app.items.push('item');
app.items.pop();
app.items.shift();
app.items.unshift('first');
app.items.splice(0, 1, 'replaced');
app.items.sort();
app.items.reverse();
app.items.fill('x');
```

### Manual patching

For arrays created after state initialization, use `patchReactiveArray()`:

```javascript
// Add a new array property after state creation
app.newList = ['a', 'b', 'c'];

// Manually patch it
ReactiveUtils.patchArray(app, 'newList');

// Now it works
app.newList.push('d');  // Triggers effects ✅
```

---

## Load order

```html
<!-- 1. Reactive State (required) -->
<script src="01_dh-reactive.js"></script>

<!-- 2. Array Patch (must come after reactive state) -->
<script src="02_dh-reactive-array-patch.js"></script>
```

---

## Key takeaways

1. **Problem:** Array mutation methods (`push`, `pop`, etc.) don't trigger reactive effects
2. **Solution:** The patch wraps each method to reassign the property after mutation
3. **Automatic:** Just load the file — arrays in `state()` are patched automatically
4. **Deep:** Nested arrays are also patched
5. **Re-patching:** Replacing an array re-patches the new one via `$watch`
6. **9 methods patched:** push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin
7. **No double-patching:** `__patched` flag prevents wrapping methods twice
8. **Manual option:** `ReactiveUtils.patchArray(state, key)` for arrays added later

---

## What's next?

Let's break down a basic example step by step, then explore real-world patterns and the manual patching API.

Let's continue!