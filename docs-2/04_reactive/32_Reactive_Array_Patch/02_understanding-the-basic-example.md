[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Understanding the Basic Example

Let's break down exactly what happens when you use array methods with reactive state — before and after the patch.

---

## The scenario

You have a simple list where users can add and remove items:

```html
<ul id="list"></ul>
<span id="count">0 items</span>
<button id="addBtn">Add Item</button>
<button id="removeBtn">Remove Last</button>
```

---

## The code

```javascript
const app = ReactiveUtils.state({
  items: ['Apple', 'Banana']
});

// Keep the UI in sync
ReactiveUtils.effect(() => {
  document.getElementById('count').textContent = `${app.items.length} items`;

  document.getElementById('list').innerHTML = app.items
    .map(item => `<li>${item}</li>`)
    .join('');
});

// Add item
document.getElementById('addBtn').addEventListener('click', () => {
  app.items.push('Cherry');
});

// Remove last item
document.getElementById('removeBtn').addEventListener('click', () => {
  app.items.pop();
});
```

Let's break this down **part by part**.

---

## Part 1: Creating state with an array

```javascript
const app = ReactiveUtils.state({
  items: ['Apple', 'Banana']
});
```

### What happens when the patch is loaded

```
ReactiveUtils.state({ items: ['Apple', 'Banana'] })
   ↓
1️⃣ The enhanced state() calls the original state() to create the reactive proxy
   ↓
2️⃣ patchArrayProperties() scans the object for array properties
   ├── "items" is an array → patch it
   └── Done scanning
   ↓
3️⃣ patchArrayMethods() wraps all 9 mutation methods on the array
   ├── push()     → wrapped
   ├── pop()      → wrapped
   ├── shift()    → wrapped
   ├── unshift()  → wrapped
   ├── splice()   → wrapped
   ├── sort()     → wrapped
   ├── reverse()  → wrapped
   ├── fill()     → wrapped
   └── copyWithin() → wrapped
   ↓
4️⃣ __patched = true (prevents double-wrapping)
   ↓
5️⃣ $watch('items', ...) set up for re-patching on replacement
   ↓
6️⃣ Return the reactive state
```

After this, `app.items` is a reactive array whose mutation methods automatically trigger effects.

---

## Part 2: Setting up the effect

```javascript
ReactiveUtils.effect(() => {
  document.getElementById('count').textContent = `${app.items.length} items`;

  document.getElementById('list').innerHTML = app.items
    .map(item => `<li>${item}</li>`)
    .join('');
});
```

### What happens

```
1️⃣ The effect runs immediately
   ↓
2️⃣ It reads app.items (the Proxy's get trap fires)
   ↓
3️⃣ The system records: "This effect depends on 'items'"
   ↓
4️⃣ It reads app.items.length and iterates with .map()
   ↓
5️⃣ The DOM updates:
   ├── count shows: "2 items"
   └── list shows: <li>Apple</li><li>Banana</li>
```

---

## Part 3: Adding an item with push()

```javascript
document.getElementById('addBtn').addEventListener('click', () => {
  app.items.push('Cherry');
});
```

### What happens when the button is clicked

```
app.items.push('Cherry')
   ↓
1️⃣ The PATCHED push() is called (not the original)
   ↓
2️⃣ It calls the ORIGINAL Array.prototype.push('Cherry')
   → The array is now: ['Apple', 'Banana', 'Cherry']
   → push returns 3 (the new length)
   ↓
3️⃣ The patched push() creates a copy: [...this]
   → A new array: ['Apple', 'Banana', 'Cherry']
   ↓
4️⃣ The patched push() reassigns: state.items = newArray
   → The Proxy's set trap fires!
   ↓
5️⃣ The system checks: "Who depends on 'items'?"
   → Found: the effect from Part 2
   ↓
6️⃣ The effect re-runs
   ├── count shows: "3 items"
   └── list shows: <li>Apple</li><li>Banana</li><li>Cherry</li>
   ↓
7️⃣ The return value (3) is returned to the caller
```

### The key insight

The patched `push()` does two things:
1. Calls the real `push()` to actually modify the array
2. Reassigns the property with a copy — which triggers the Proxy

---

## Part 4: Removing an item with pop()

```javascript
document.getElementById('removeBtn').addEventListener('click', () => {
  app.items.pop();
});
```

### What happens

```
app.items.pop()
   ↓
1️⃣ The PATCHED pop() calls the ORIGINAL pop()
   → Removes 'Cherry', array is now: ['Apple', 'Banana']
   → pop returns 'Cherry' (the removed item)
   ↓
2️⃣ Creates a copy and reassigns: state.items = [...this]
   → Set trap fires!
   ↓
3️⃣ Effect re-runs
   ├── count shows: "2 items"
   └── list shows: <li>Apple</li><li>Banana</li>
   ↓
4️⃣ Returns 'Cherry' (the original return value)
```

---

## The complete flow

**Initial state:**

```
┌──────────────────────────┐
│  • Apple                 │
│  • Banana                │
│                          │
│  2 items                 │
│                          │
│  [Add Item] [Remove Last]│
└──────────────────────────┘
```

**After clicking "Add Item":**

```
┌──────────────────────────┐
│  • Apple                 │
│  • Banana                │
│  • Cherry                │  ← New item
│                          │
│  3 items                 │  ← Count updated
│                          │
│  [Add Item] [Remove Last]│
└──────────────────────────┘
```

**After clicking "Remove Last":**

```
┌──────────────────────────┐
│  • Apple                 │
│  • Banana                │
│                          │
│  2 items                 │  ← Count updated
│                          │
│  [Add Item] [Remove Last]│
└──────────────────────────┘
```

Every array operation triggers the effect — the UI stays perfectly in sync.

---

## Each patched method — what it returns

The patch preserves the original return values:

```javascript
const app = ReactiveUtils.state({ items: [3, 1, 2] });

// push returns the new length
const len = app.items.push(4);       // len = 4, effect re-runs ✅

// pop returns the removed item
const last = app.items.pop();        // last = 4, effect re-runs ✅

// shift returns the removed first item
const first = app.items.shift();     // first = 3, effect re-runs ✅

// unshift returns the new length
const len2 = app.items.unshift(0);   // len2 = 3, effect re-runs ✅

// splice returns the removed items
const removed = app.items.splice(0, 1);  // removed = [0], effect re-runs ✅

// sort returns the sorted array
const sorted = app.items.sort();     // sorted = [1, 2], effect re-runs ✅

// reverse returns the reversed array
const rev = app.items.reverse();     // rev = [2, 1], effect re-runs ✅
```

---

## Common beginner mistakes

### ❌ Mistake 1: Loading the patch before the reactive module

```html
<!-- WRONG — patch needs ReactiveUtils to exist -->
<script src="02_dh-reactive-array-patch.js"></script>
<script src="01_dh-reactive.js"></script>

<!-- RIGHT — reactive first, then patch -->
<script src="01_dh-reactive.js"></script>
<script src="02_dh-reactive-array-patch.js"></script>
```

### ❌ Mistake 2: Expecting non-mutating methods to trigger effects

```javascript
// These do NOT trigger effects (they return new arrays, they don't mutate)
const filtered = app.items.filter(x => x > 5);   // No effect re-run
const mapped = app.items.map(x => x * 2);         // No effect re-run
const sliced = app.items.slice(0, 2);              // No effect re-run

// To update state with the result, reassign:
app.items = app.items.filter(x => x > 5);  // This triggers effects ✅
```

### ❌ Mistake 3: Expecting dynamically added arrays to be patched

```javascript
const app = ReactiveUtils.state({ name: 'Alice' });

// Added AFTER state creation — not automatically patched
app.scores = [90, 85, 92];
app.scores.push(88);  // Won't trigger effects ❌

// Fix: manually patch it
ReactiveUtils.patchArray(app, 'scores');
app.scores.push(88);  // Now it works ✅
```

---

## Key takeaways

1. **Push, pop, splice, sort, etc.** all trigger effects automatically after loading the patch
2. The patch works by **reassigning the property** with a copy after mutation
3. **Return values** from array methods are preserved
4. **Load order matters** — reactive module first, then array patch
5. Non-mutating methods (`filter`, `map`, `slice`) don't need patching — reassign the result instead
6. Arrays added **after** state creation need manual patching with `patchArray()`

---

## What's next?

Let's see real-world examples and best practices, then explore the manual patching API.

Let's continue!