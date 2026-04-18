[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Reactive State

## What is it?

`ReactiveUtils.state()` lets you create **reactive objects** — JavaScript objects that automatically know when their properties change and can trigger updates in response.

Instead of manually tracking every change and updating the UI yourself, you describe the state of your app as an object, and the reactive system takes care of keeping everything in sync.

Think of it as giving your plain JavaScript objects **superpowers** — they can now detect changes, run side effects, compute derived values, and even update the DOM automatically.

---

## Why does this exist?

Imagine you're building a counter with a display:

```html
<span id="count">0</span>
<button id="increment">+1</button>
```

### The old-fashioned way

Without reactive state, you manage everything manually:

```javascript
let count = 0;

document.getElementById('increment').addEventListener('click', () => {
  count++;
  document.getElementById('count').textContent = count;
});
```

That works for one counter. But what if you need to:
- Show the count in multiple places?
- Show a "doubled" value alongside it?
- Disable a button when count reaches 10?
- Log every change?

```javascript
let count = 0;

function updateUI() {
  document.getElementById('count').textContent = count;
  document.getElementById('doubledCount').textContent = count * 2;
  document.getElementById('countBadge').textContent = count;
  document.getElementById('increment').disabled = count >= 10;
}

document.getElementById('increment').addEventListener('click', () => {
  count++;
  updateUI();
  console.log('Count changed to:', count);
});
```

**Problems:**
- ❌ You must remember to call `updateUI()` every time `count` changes
- ❌ Forget one call and the UI goes out of sync
- ❌ The `updateUI` function grows with every new display element
- ❌ Hard to trace which changes trigger which updates

### The Reactive State way

```javascript
const app = ReactiveUtils.state({ count: 0 });

// This effect runs automatically whenever app.count changes
ReactiveUtils.effect(() => {
  document.getElementById('count').textContent = app.count;
  document.getElementById('doubledCount').textContent = app.count * 2;
  document.getElementById('countBadge').textContent = app.count;
  document.getElementById('increment').disabled = app.count >= 10;
});

document.getElementById('increment').addEventListener('click', () => {
  app.count++;  // Just change the value — UI updates automatically
});
```

**What changed?**
- ✅ Change `app.count` anywhere — all displays update automatically
- ✅ No manual `updateUI()` calls needed
- ✅ The system tracks which effects depend on which properties
- ✅ Impossible for the UI to go out of sync

---

## How is this different from a plain object?

A plain JavaScript object is **passive** — it just holds data. A reactive object is **active** — it detects reads and writes and triggers reactions.

```javascript
// Plain object — passive
const plain = { count: 0 };
plain.count = 5;  // Nothing happens. No one is notified.

// Reactive object — active
const reactive = ReactiveUtils.state({ count: 0 });
reactive.count = 5;  // Any effects watching "count" re-run automatically
```

**The key difference:** You use a reactive object exactly like a plain object (`object.property`), but behind the scenes, a JavaScript `Proxy` intercepts every read and write to power the reactive system.

---

## Mental model: The smart whiteboard

Think of reactive state like a **smart whiteboard** in a meeting room.

```
Plain object (regular whiteboard):
├── You write "Sales: $5000" on the board
├── Nobody notices
├── You have to tap everyone on the shoulder
└── "Hey, I updated the sales number. Go update your reports."

Reactive object (smart whiteboard):
├── You write "Sales: $5000" on the board
├── The board detects the change automatically
├── It notifies everyone who's watching "Sales"
└── Their reports update instantly — no tapping required
```

You write on the whiteboard the same way. The only difference is that the **smart whiteboard** knows who's watching and notifies them for you.

---

## The big picture

The Reactive State module provides several layers of tools:

```
Level 1: Core Primitives
├── state()       → Create a reactive object
├── effect()      → Run code when reactive data changes
├── ref()         → Single reactive value wrapper
└── batch()       → Group multiple changes into one update

Level 2: Derived State
├── $computed()   → Values calculated from other state
├── $watch()      → Callbacks that fire on changes
└── $notify()     → Manually trigger updates

Level 3: Instance Methods
├── $update()     → Update state + DOM in one call
├── $set()        → Functional updates with transformers
├── $bind()       → Connect state to DOM elements
├── $batch()      → Batch updates on a specific state
└── $raw          → Access the original unwrapped object

Level 4: Specialized Factories
├── ref()         → Single value with .value
├── collection()  → Reactive lists with $add/$remove/$clear
├── form()        → Form state with validation/errors/touched
└── async()       → Async state with loading/error/data

Level 5: Architecture
├── store()       → State + getters + actions
├── component()   → State + computed + watch + bindings + lifecycle
└── reactive()    → Chainable builder pattern
```

You don't need to learn all of these at once. Start with `state()` and `effect()` — that's the foundation everything else is built on.

---

## The basic syntax

### Creating reactive state

```javascript
const app = ReactiveUtils.state({
  count: 0,
  name: 'World',
  isActive: true
});
```

**One argument:** A plain JavaScript object with your initial values.

**Returns:** A reactive proxy that looks and acts like the original object, but tracks all reads and writes.

### Reading and writing

```javascript
// Reading — exactly like a plain object
console.log(app.count);     // 0
console.log(app.name);      // 'World'

// Writing — exactly like a plain object
app.count = 5;
app.name = 'DOMHelpers';
app.isActive = false;
```

No special getters or setters needed. Just use the object normally.

### Reacting to changes

```javascript
// This function runs once immediately, then re-runs
// whenever any reactive property it reads changes
ReactiveUtils.effect(() => {
  console.log(`Count is ${app.count}`);
});

// Output: "Count is 0" (runs immediately)

app.count = 1;   // Output: "Count is 1" (re-runs automatically)
app.count = 2;   // Output: "Count is 2" (re-runs automatically)
```

---

## What you can make reactive

Almost any plain object:

```javascript
// Simple values
const counter = ReactiveUtils.state({ count: 0 });

// Nested objects — deep reactivity is automatic
const user = ReactiveUtils.state({
  name: 'Alice',
  address: {
    city: 'NYC',
    zip: '10001'
  }
});

user.address.city = 'LA';  // Triggers updates — nested properties are reactive too

// Objects with arrays
const app = ReactiveUtils.state({
  todos: ['Learn Reactive', 'Build app'],
  count: 2
});
```

### What is NOT made reactive

The system intelligently skips certain built-in types that shouldn't be proxied:

- `Date`, `RegExp`, `Error`
- `Map`, `Set`, `WeakMap`, `WeakSet`
- `Promise`, `AbortController`, `AbortSignal`
- DOM elements (`Node`, `Element`)

These are stored as-is inside your reactive object, but the **property** holding them is still tracked:

```javascript
const app = ReactiveUtils.state({
  createdAt: new Date(),    // Date is stored as-is
  element: document.body    // DOM element stored as-is
});

// But the property is still reactive:
app.createdAt = new Date();  // Triggers effects watching "createdAt"
```

---

## Integration with DOMHelpers

The reactive API is available through multiple access points:

```javascript
// Direct access
ReactiveUtils.state({ count: 0 });
ReactiveUtils.effect(() => { /* ... */ });

// Through Elements (if loaded)
Elements.state({ count: 0 });
Elements.effect(() => { /* ... */ });

// Through Collections (if loaded)
Collections.state({ count: 0 });

// Through Selector (if loaded)
Selector.state({ count: 0 });
```

All access points use the same underlying system. Choose whichever fits your code organization.

---

## Key principles

### 1. State is just an object

```javascript
const app = ReactiveUtils.state({ name: 'Alice', age: 30 });

// Use it like any object
console.log(app.name);    // 'Alice'
app.age = 31;             // Just assign normally
```

### 2. Effects auto-track their dependencies

```javascript
ReactiveUtils.effect(() => {
  // The system knows this effect depends on app.name
  // because it reads app.name during execution
  document.title = app.name;
});
```

### 3. Changes trigger targeted updates

```javascript
app.name = 'Bob';  // Only effects that read "name" re-run
app.age = 31;      // Only effects that read "age" re-run
```

### 4. Deep reactivity is automatic

```javascript
const app = ReactiveUtils.state({
  user: { profile: { name: 'Alice' } }
});

// Nested changes are tracked too
app.user.profile.name = 'Bob';  // Triggers effects
```

---

## When you'll use this

**Dynamic UIs:**
```javascript
const ui = ReactiveUtils.state({ theme: 'light', sidebar: 'open' });

ReactiveUtils.effect(() => {
  document.body.className = ui.theme;
});

ui.theme = 'dark';  // Body class updates automatically
```

**Form handling:**
```javascript
const form = ReactiveUtils.state({
  email: '',
  password: '',
  isValid: false
});
```

**Data dashboards:**
```javascript
const dashboard = ReactiveUtils.state({
  users: 1500,
  revenue: 45000,
  activeNow: 230
});
```

**Shopping carts:**
```javascript
const cart = ReactiveUtils.state({
  items: [],
  total: 0,
  itemCount: 0
});
```

---

## The golden rule

> *"Change the state, and everything that depends on it updates automatically. You never manually sync the UI — the reactive system does it for you."*

---

## What's next?

Now that you understand **what** reactive state is and **why** it exists, let's learn:
- How to break down a basic example step by step
- How the Proxy system works under the hood
- Effects, computed properties, and watchers
- Instance methods for advanced control
- Specialized factories for common patterns

Let's dive deeper!