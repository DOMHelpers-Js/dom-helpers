[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Understanding the Basic Example

Let's break down a simple, real-world example step by step so you understand exactly how reactive state works.

---

## The scenario

You have a greeting card that shows a user's name and a message:

```html
<h1 id="greeting">Hello!</h1>
<p id="message">Welcome to our app.</p>
<button id="changeBtn">Change Name</button>
```

After the user logs in, you want to personalize the greeting and keep it in sync as data changes.

---

## The goal

Create reactive state that automatically updates the UI whenever the name changes. No manual DOM updates needed.

---

## The code

```javascript
// Step 1: Create reactive state
const app = ReactiveUtils.state({
  name: 'World',
  mood: 'happy'
});

// Step 2: Set up automatic UI updates
ReactiveUtils.effect(() => {
  document.getElementById('greeting').textContent = `Hello, ${app.name}!`;
});

ReactiveUtils.effect(() => {
  document.getElementById('message').textContent =
    app.mood === 'happy' ? 'Great to see you!' : 'Hope your day gets better.';
});

// Step 3: Change data — UI updates automatically
document.getElementById('changeBtn').addEventListener('click', () => {
  app.name = 'Alice';
});
```

Let's break this down **part by part**.

---

## Part 1: Creating the state

```javascript
const app = ReactiveUtils.state({
  name: 'World',
  mood: 'happy'
});
```

### What does `ReactiveUtils.state()` do?

It takes a plain JavaScript object and returns a **reactive version** of it.

### What does "reactive" mean here?

It means the object now **tracks every read and write**. When you read `app.name`, the system notes that you accessed it. When you change `app.name`, the system knows to notify anyone who was reading it.

### What does the returned object look like?

Exactly like the original:

```javascript
console.log(app.name);   // 'World'
console.log(app.mood);   // 'happy'
console.log(typeof app); // 'object'
```

You can't tell the difference by looking at it. But under the hood, it's a `Proxy` that intercepts every property access.

### The result

```
Plain object:                    Reactive object:
{ name: 'World', mood: 'happy' }  →  Same data, but now tracked
                                     Reads are detected
                                     Writes trigger updates
```

---

## Part 2: Setting up effects

```javascript
ReactiveUtils.effect(() => {
  document.getElementById('greeting').textContent = `Hello, ${app.name}!`;
});
```

### What does `ReactiveUtils.effect()` do?

It takes a function and:

1. **Runs it immediately** (right now)
2. **Tracks which reactive properties** the function reads
3. **Re-runs it automatically** whenever those properties change

### What happens when this runs?

```
1️⃣ effect() calls your function immediately
   ↓
2️⃣ Your function reads app.name
   ↓
3️⃣ The reactive system detects: "This effect depends on app.name"
   ↓
4️⃣ It registers: "When app.name changes, re-run this effect"
   ↓
5️⃣ The greeting element shows: "Hello, World!"
```

### The auto-tracking magic

Notice that you never told the system which properties to watch. You didn't write `watch('name', ...)` or `subscribe('name', ...)`. The system figured it out **automatically** by running your function and seeing which properties it accessed.

This is called **dependency auto-tracking** — the system discovers dependencies by observation, not by declaration.

### The second effect

```javascript
ReactiveUtils.effect(() => {
  document.getElementById('message').textContent =
    app.mood === 'happy' ? 'Great to see you!' : 'Hope your day gets better.';
});
```

This effect depends on `app.mood`. The system tracks this independently.

### Result after setup

```
Effect 1: depends on app.name
   → Currently shows: "Hello, World!"

Effect 2: depends on app.mood
   → Currently shows: "Great to see you!"
```

---

## Part 3: Changing data

```javascript
document.getElementById('changeBtn').addEventListener('click', () => {
  app.name = 'Alice';
});
```

### What happens when the button is clicked?

```
1️⃣ Button click fires
   ↓
2️⃣ app.name = 'Alice' is executed
   ↓
3️⃣ The Proxy intercepts the write
   ↓
4️⃣ The system checks: "Who depends on 'name'?"
   ↓
5️⃣ Finds: Effect 1 depends on 'name'
   ↓
6️⃣ Re-runs Effect 1
   ↓
7️⃣ greeting element now shows: "Hello, Alice!"
```

### What does NOT happen?

- Effect 2 does **not** re-run (it depends on `mood`, not `name`)
- No manual DOM update needed
- No `updateUI()` call required

### The targeted update

This is a key feature of reactive state: **only the effects that depend on the changed property re-run**. If you have 50 effects but only 2 read `name`, only those 2 re-run when `name` changes.

---

## The complete flow

**Before button click:**

```
┌──────────────────────────────┐
│  Hello, World!               │  ← Effect 1 (depends on name)
│                              │
│  Great to see you!           │  ← Effect 2 (depends on mood)
│                              │
│  [ Change Name ]             │
└──────────────────────────────┘
```

**After button click:**

```
┌──────────────────────────────┐
│  Hello, Alice!               │  ← Effect 1 re-ran (name changed)
│                              │
│  Great to see you!           │  ← Effect 2 unchanged (mood didn't change)
│                              │
│  [ Change Name ]             │
└──────────────────────────────┘
```

---

## Reading the code out loud

When you read reactive state code, read it like this:

```javascript
const app = ReactiveUtils.state({ name: 'World' });
```

> "Create a reactive state object with a `name` property set to 'World'."

```javascript
ReactiveUtils.effect(() => {
  document.getElementById('greeting').textContent = `Hello, ${app.name}!`;
});
```

> "Whenever `app.name` changes, update the greeting element's text."

```javascript
app.name = 'Alice';
```

> "Set name to 'Alice' — all effects watching name will re-run."

The code is **self-documenting** — it reads like a description of what should happen.

---

## The three key parts

Every reactive setup has three parts:

### 1. State (the data)

```javascript
const app = ReactiveUtils.state({
  name: 'World'
});
```

The single source of truth for your data.

### 2. Effects (the reactions)

```javascript
ReactiveUtils.effect(() => {
  // Do something with app.name
});
```

Code that runs automatically when state changes.

### 3. Mutations (the changes)

```javascript
app.name = 'Alice';
```

Simple property assignments that trigger the whole chain.

```
State → Effects → Mutations → State → Effects → ...
  ↑                                               │
  └───────────────────────────────────────────────┘
```

---

## Common beginner mistakes

### ❌ Mistake 1: Forgetting to use reactive state

```javascript
// WRONG — plain object, no reactivity
const app = { name: 'World' };

ReactiveUtils.effect(() => {
  console.log(app.name);  // Runs once, never again
});

app.name = 'Alice';  // Nothing happens — plain object can't trigger effects
```

```javascript
// RIGHT — reactive state
const app = ReactiveUtils.state({ name: 'World' });

ReactiveUtils.effect(() => {
  console.log(app.name);  // Runs now, and again when name changes
});

app.name = 'Alice';  // Effect re-runs automatically
```

### ❌ Mistake 2: Reading the property outside the effect

```javascript
// WRONG — name is read OUTSIDE the effect, so it's not tracked
const name = app.name;

ReactiveUtils.effect(() => {
  document.getElementById('greeting').textContent = name;
  // Uses the captured string 'World', not app.name
  // This effect has NO reactive dependencies
});

app.name = 'Alice';  // Effect doesn't re-run — it never read app.name
```

```javascript
// RIGHT — read inside the effect
ReactiveUtils.effect(() => {
  document.getElementById('greeting').textContent = app.name;
  // Reads app.name directly — dependency is tracked
});

app.name = 'Alice';  // Effect re-runs
```

### ❌ Mistake 3: Replacing the entire state object

```javascript
let app = ReactiveUtils.state({ name: 'World' });

ReactiveUtils.effect(() => {
  console.log(app.name);
});

// WRONG — creates a new reactive object, but effects still watch the old one
app = ReactiveUtils.state({ name: 'Alice' });
// The effect doesn't re-run because it's watching the OLD object

// RIGHT — change the property on the existing state
app.name = 'Alice';
// The effect re-runs because you changed the property it watches
```

---

## Key takeaways

1. **`state()`** creates a reactive object that tracks reads and writes
2. **`effect()`** runs a function immediately, then re-runs it when its dependencies change
3. **Dependencies are tracked automatically** — no manual subscription needed
4. **Only relevant effects re-run** — changing `name` doesn't affect effects watching `mood`
5. **State mutations are simple assignments** — `app.name = 'Alice'` triggers the whole chain
6. **Read properties inside effects** — that's how dependencies are detected

---

## What's next?

Now that you understand the basic flow, let's explore:
- How the Proxy system works under the hood
- Effects, computed properties, and watchers in depth
- Instance methods for advanced state control

Let's continue!