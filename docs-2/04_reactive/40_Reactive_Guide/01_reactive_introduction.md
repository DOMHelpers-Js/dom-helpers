[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Introduction to Reactive State

## Quick Start (30 seconds)

```javascript
// Create reactive state
const app = state({ count: 0 });

// React to changes automatically
effect(() => {
  document.getElementById('counter').textContent = app.count;
});

// Change the state — the DOM updates itself
app.count = 5;
// The element now shows "5" — no manual DOM update needed
```

That's it. Change a value. Everything that depends on it updates. Automatically.

---

## What is Reactive State?

Reactive state is a **JavaScript object with superpowers**.

A regular object just holds data. A reactive object holds data **and** automatically tells everything that depends on it when something changes.

Think of it like this:

- **Regular object** — a notebook. You write in it, but nobody else knows unless you tell them.
- **Reactive object** — a shared live document. The moment you type, everyone watching sees the change instantly.

In practice, this means:

```javascript
// Regular object — "dead" data
const plain = { count: 0 };
plain.count = 5;  // Nothing happens. Nobody knows.

// Reactive object — "live" data
const app = state({ count: 0 });
app.count = 5;  // Everything watching "count" updates automatically ✨
```

You use reactive state **exactly like a regular object** — same dot notation, same assignment. The reactive system works invisibly behind the scenes.

---

## Syntax

```javascript
// Create reactive state (shortcut API)
const myState = state(initialObject);

// Update state with functional updates (non-$ method)
set(myState, { key: newValue });
set(myState, { key: prev => prev + 1 });

// React to state changes
effect(() => {
  // Code here runs when any accessed state changes
});

// Batch multiple updates together
batch(() => {
  myState.a = 1;
  myState.b = 2;
  // Only one update cycle runs, not two
});
```

---

## Why Does This Exist?

### The Problem with Manual DOM Updates

Imagine you're building a simple counter that shows in three places:

```javascript
// The old way — manual DOM management
let count = 0;

function increment() {
  count++;

  // Must update every display manually
  document.getElementById('counter').textContent = count;
  document.getElementById('badge').textContent = count;
  document.getElementById('header-count').textContent = count;

  // Must update derived values manually
  document.getElementById('doubled').textContent = count * 2;

  // Must handle disabled states manually
  document.getElementById('btn').disabled = count >= 10;

  // Easy to forget one — and then the UI is out of sync
}
```

**Problems:**
❌ You must remember every place that displays `count`
❌ Forget one, and the UI shows the wrong data
❌ Adding a new display means updating this function
❌ The function grows endlessly as the app grows
❌ Impossible to trace which changes cause which updates

### The Reactive Solution

```javascript
// The reactive way — describe what should happen, not when
const app = state({ count: 0 });

// Describe the relationship once
effect(() => {
  document.getElementById('counter').textContent = app.count;
  document.getElementById('badge').textContent = app.count;
  document.getElementById('header-count').textContent = app.count;
  document.getElementById('doubled').textContent = app.count * 2;
  document.getElementById('btn').disabled = app.count >= 10;
});

// Now just change the data — everything updates automatically
function increment() {
  app.count++;  // One line. Done.
}
```

**Benefits:**
✅ Change `app.count` once — all displays update
✅ The system tracks dependencies automatically
✅ Adding a new display just means reading `app.count` in an effect
✅ The UI can never go out of sync
✅ Your update logic stays simple and focused

---

## Mental Model

### The Smart Notification Board

Think of reactive state like a **smart notification board** in an office.

```
Regular Data (Paper Notice):
┌─────────────────────────────────────────────┐
│  Notice: Sales = $5000                      │
│                                             │
│  (Nobody knows this changed. You must       │
│   personally walk to each desk and tell     │
│   each person to update their reports.)     │
└─────────────────────────────────────────────┘

Reactive State (Digital Board):
┌─────────────────────────────────────────────┐
│  LIVE: Sales = $5000                        │
│                                             │
│  → Subscribed: Sales Report   ← auto-update │
│  → Subscribed: Dashboard      ← auto-update │
│  → Subscribed: Email Alert    ← auto-update │
│                                             │
│  (Change "Sales" once — all subscribers     │
│   update instantly and automatically.)      │
└─────────────────────────────────────────────┘
```

You update the board the same way in both cases. The difference is that the **smart board** knows who's watching and notifies them for you. You never have to walk around.

---

## How Does It Work?

The magic comes from a built-in JavaScript feature called a **Proxy**.

```
You create a plain object:
{ count: 0 }
          ↓
The reactive system wraps it in a Proxy:
Proxy({ count: 0 })
          ↓
Every read is intercepted:
  app.count  →  "Who's asking? Record them as a dependency."
          ↓
Every write is intercepted:
  app.count = 5  →  "Notify all recorded dependencies."
          ↓
Dependencies re-run automatically
```

**Step by step:**

1️⃣ **You create state**
```javascript
const app = state({ count: 0 });
```
Behind the scenes: a Proxy wraps your object. The original object is preserved inside.

2️⃣ **You create an effect**
```javascript
effect(() => {
  console.log(app.count);  // Reading app.count
});
```
When the effect runs, it reads `app.count`. The Proxy records: "this effect depends on `count`."

3️⃣ **You change the state**
```javascript
app.count = 5;
```
The Proxy intercepts the write. It finds all effects that depend on `count`. It re-runs them.

4️⃣ **The effect re-runs automatically**
```javascript
// console.log fires again with the new value: 5
```

You never called the effect. The system did it for you.

```
User writes: app.count = 5
                  ↓
     Proxy intercepts the write
                  ↓
     Find all effects using "count"
                  ↓
     Queue those effects for re-run
                  ↓
     Effects re-execute with new value
                  ↓
     UI updates automatically ✨
```

---

## Basic Usage

### Step 1 — The Minimal Example

```javascript
// Create a state object
const app = state({ message: 'Hello' });

// Read it like a normal object
console.log(app.message);  // "Hello"

// Write to it like a normal object
app.message = 'Hello, World!';
console.log(app.message);  // "Hello, World!"
```

Nothing special yet — it behaves exactly like a plain object.

### Step 2 — Add an Effect

```javascript
const app = state({ message: 'Hello' });

// This runs immediately, then re-runs whenever app.message changes
effect(() => {
  console.log('Message:', app.message);
});
// Output: "Message: Hello" (runs immediately)

app.message = 'Hi there!';
// Output: "Message: Hi there!" (runs automatically)

app.message = 'Goodbye!';
// Output: "Message: Goodbye!" (runs automatically again)
```

The effect **automatically re-runs** — you never called it manually the second or third time.

### Step 3 — Multiple Properties

```javascript
const user = state({
  name: 'Alice',
  age: 25,
  isAdmin: false
});

// This effect depends on name and age
effect(() => {
  console.log(`${user.name} is ${user.age} years old`);
});
// Output: "Alice is 25 years old"

user.name = 'Bob';
// Output: "Bob is 25 years old" (re-runs because name changed)

user.age = 30;
// Output: "Bob is 30 years old" (re-runs because age changed)

user.isAdmin = true;
// No output — this effect doesn't read isAdmin, so it doesn't re-run
```

**Key insight:** Effects only re-run when a property they **actually read** changes. Changing `isAdmin` doesn't re-run the effect because it never reads `isAdmin`.

### Step 4 — DOM Integration

```javascript
// HTML:
// <p id="greeting"></p>
// <button id="changeBtn">Change</button>

const app = state({ name: 'World' });

// Describe the DOM relationship
effect(() => {
  document.getElementById('greeting').textContent = `Hello, ${app.name}!`;
});
// Page shows: "Hello, World!"

document.getElementById('changeBtn').addEventListener('click', () => {
  app.name = 'Alice';
  // Page automatically shows: "Hello, Alice!"
  // You didn't touch the DOM — the effect handled it
});
```

### Step 5 — Nested Objects

Deep reactivity works automatically. You don't need to do anything special.

```javascript
const store = state({
  user: {
    profile: {
      name: 'Alice',
      bio: 'Developer'
    }
  }
});

effect(() => {
  console.log('Name:', store.user.profile.name);
});
// Output: "Name: Alice"

// Nested property changes are tracked too
store.user.profile.name = 'Bob';
// Output: "Name: Bob" (automatically re-ran)
```

---

## Deep Dive: Dependency Tracking

### How Effects Know What to Watch

Effects don't take a list of dependencies — they figure it out themselves.

```javascript
const app = state({ a: 1, b: 2, c: 3 });

// This effect reads `a` and `b`, but NOT `c`
effect(() => {
  console.log(app.a + app.b);
});

app.a = 10;  // ✅ Re-runs — effect reads `a`
app.b = 20;  // ✅ Re-runs — effect reads `b`
app.c = 99;  // ❌ Does NOT re-run — effect never read `c`
```

This is called **automatic dependency tracking**. The system records which properties were accessed during the last execution of the effect, and only re-runs when those specific properties change.

### Dynamic Dependencies

Dependencies can even change between runs:

```javascript
const app = state({ showName: true, name: 'Alice', age: 25 });

effect(() => {
  if (app.showName) {
    console.log('Name:', app.name);  // Reads `name`
  } else {
    console.log('Age:', app.age);    // Reads `age`
  }
});
// Output: "Name: Alice"

app.name = 'Bob';
// Output: "Name: Bob" (reads name, so reruns)

app.showName = false;
// Output: "Age: 25" (now reads age instead)

app.name = 'Charlie';
// No output — effect now reads `age`, not `name`

app.age = 30;
// Output: "Age: 30" (effect reads `age` now)
```

The effect adapts to whatever it reads on each run.

---

## Deep Dive: The `set()` Method

### Functional Updates with `set()`

The `set()` function lets you update state using the **current value** without reading it directly:

```javascript
const counter = state({ count: 0, score: 100 });

// Direct assignment
counter.count = 5;

// Functional update — receives the current value
set(counter, {
  count: prev => prev + 1,   // prev is the current count
  score: prev => prev * 2    // prev is the current score
});

console.log(counter.count);  // 6
console.log(counter.score);  // 200
```

**When is `set()` useful?**

When you need to increment, toggle, or transform based on the current value — especially inside callbacks where you might not have the latest value:

```javascript
const app = state({ clicks: 0 });

document.addEventListener('click', () => {
  // Safe — always uses the current value
  set(app, { clicks: prev => prev + 1 });

  // Also works, but in rapid async scenarios,
  // you'd always have the current value with set()
});
```

---

## Deep Dive: The `batch()` Function

### Grouping Updates for Efficiency

When you change multiple state properties, each change normally triggers updates. `batch()` groups them all into a single update cycle:

```javascript
const app = state({ name: 'Alice', age: 25, city: 'NYC' });

effect(() => {
  console.log(`${app.name}, ${app.age}, ${app.city}`);
});
// Output: "Alice, 25, NYC"

// Without batch — effect runs 3 times
app.name = 'Bob';   // Effect runs
app.age = 30;       // Effect runs again
app.city = 'LA';    // Effect runs again

// With batch — effect runs once
batch(() => {
  app.name = 'Bob';
  app.age = 30;
  app.city = 'LA';
});
// Effect runs once with all three changes applied
// Output: "Bob, 30, LA"
```

Use `batch()` when making several related changes that should be treated as one update.

---

## Common Mistakes

### Mistake 1: Creating effects outside the reactive context

```javascript
// ❌ This doesn't track dependencies
const app = state({ count: 0 });
const value = app.count;  // Reading outside an effect — nothing tracks this
console.log(value);       // Logs "0" but won't update when count changes

// ✅ This tracks dependencies correctly
effect(() => {
  const value = app.count;  // Reading inside an effect — tracked!
  console.log(value);
});
```

### Mistake 2: Forgetting that effects run immediately

```javascript
// Effects run IMMEDIATELY when created — not only on changes
const app = state({ count: 0 });

effect(() => {
  console.log('Count is:', app.count);
});
// This logs right now: "Count is: 0"
// Then again whenever count changes
```

### Mistake 3: Changing non-tracked properties and expecting re-runs

```javascript
const app = state({ a: 1, b: 2 });

effect(() => {
  console.log(app.a);  // Only reads `a`
});

app.b = 99;  // ❌ Effect does NOT re-run — it never read `b`
app.a = 10;  // ✅ Effect re-runs — it reads `a`
```

---

## Summary

- **Reactive state** is a regular JavaScript object wrapped in a Proxy that tracks reads and writes
- **Effects** automatically re-run when the reactive properties they read change
- **Dependency tracking** is automatic — no configuration needed
- **Deep reactivity** works out of the box — nested objects are reactive too
- **`set()`** lets you do functional updates using the previous value
- **`batch()`** groups multiple changes into a single update cycle
- **The shortcut API** (`state()`, `effect()`, `batch()`, `set()`) is the recommended way to use the reactive system — clean, readable, and concise

The core pattern is simple:
```
Create state → Describe reactions → Change state → Everything updates ✨
```

---

## What's Next?

In the next section, we'll explore all the ways to create reactive state — from simple objects to deeply nested structures, from single values to collections.

Continue to: [02 — Creating Reactive State](./02_creating_state.md)