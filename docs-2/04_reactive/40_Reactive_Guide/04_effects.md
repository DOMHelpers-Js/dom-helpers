[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Effects — Reacting to State Changes

## Quick Start (30 seconds)

```javascript
const app = state({ count: 0, name: 'World' });

// Create an effect — it runs immediately, then re-runs when dependencies change
effect(() => {
  document.getElementById('greeting').textContent = `Hello, ${app.name}! Count: ${app.count}`;
});

// Change state — the effect runs automatically
app.name = 'Alice';  // Effect re-runs
app.count = 5;       // Effect re-runs again
```

---

## What is `effect()`?

`effect()` creates a **reactive side effect** — a function that runs automatically whenever the reactive data it reads changes.

Think of it as saying: **"Whenever any of this data changes, run this code."**

You don't subscribe to specific properties. You don't configure what to watch. You just write normal JavaScript code that reads from reactive state, and the system figures out what to watch automatically.

```javascript
const app = state({ count: 0, name: 'Alice' });

effect(() => {
  // This function reads app.count and app.name
  // So it will re-run whenever count OR name changes
  console.log(`${app.name}: ${app.count}`);
});
```

That's it. No configuration. No subscription lists. Pure, automatic tracking.

---

## Syntax

```javascript
// Create a reactive effect
const stopEffect = effect(() => {
  // Any reactive state read here is tracked as a dependency
  // This function runs immediately, then again when tracked data changes
});

// Stop the effect (opt out of future re-runs)
stopEffect();
```

**Parameters:**
- A function that contains your reactive code

**Returns:**
- A cleanup/stop function — call it to stop the effect from running

---

## Why Does This Exist?

### The Problem with Manual Event Listeners

Keeping UI in sync with data manually is fragile:

```javascript
let user = { name: 'Alice', role: 'user', isActive: true };

// You must remember to update every display manually
function updateName(newName) {
  user.name = newName;
  document.getElementById('display-name').textContent = newName;
  document.getElementById('nav-name').textContent = newName;
  document.getElementById('greeting').textContent = `Hello, ${newName}`;
  document.title = `${newName}'s Dashboard`;
}

// And every other property needs its own update function
function updateRole(newRole) {
  user.role = newRole;
  document.getElementById('role-badge').textContent = newRole;
  document.getElementById('admin-link').hidden = newRole !== 'admin';
}
```

**What's the Real Issue?**

```
Property changes
      ↓
You must manually call the right update function
      ↓
That function must know about every display
      ↓
Add a new display → update the function
Change a property elsewhere → call update functions everywhere
      ↓
One missed call → stale UI
App grows → unmaintainable update functions
```

**Problems:**
❌ Every property change requires calling update functions
❌ Forget a call and the UI silently shows wrong data
❌ Adding UI elements means editing update functions
❌ Update functions grow endlessly as app grows
❌ Hard to know what needs updating from where

### The Solution with `effect()`

```javascript
const user = state({ name: 'Alice', role: 'user', isActive: true });

// Describe what the name display should look like
effect(() => {
  document.getElementById('display-name').textContent = user.name;
  document.getElementById('nav-name').textContent = user.name;
  document.getElementById('greeting').textContent = `Hello, ${user.name}`;
  document.title = `${user.name}'s Dashboard`;
});

// Describe what the role display should look like
effect(() => {
  document.getElementById('role-badge').textContent = user.role;
  document.getElementById('admin-link').hidden = user.role !== 'admin';
});

// Now just change the data anywhere — effects run automatically
user.name = 'Bob';    // Both displays update — no function calls needed
user.role = 'admin';  // Role display updates — no function calls needed
```

**What Just Happened?**

```
user.name = 'Bob'
      ↓
Proxy intercepts the write
      ↓
Finds effects that read "name"
      ↓
Re-runs them automatically
      ↓
All name displays show "Bob" ✨
```

**Benefits:**
✅ Change data anywhere — effects run automatically
✅ Add a new display? Just create a new effect — no function changes
✅ UI can never be out of sync with data
✅ No update functions to maintain
✅ Clear separation: data is here, reactions are there

---

## Mental Model

### A Spreadsheet Formula

`effect()` works exactly like a formula in a spreadsheet.

```
Spreadsheet:
┌────────────────────────────────────────────────┐
│  Cell A1: 5                                     │
│  Cell A2: 10                                    │
│  Cell A3: =A1 + A2   ← Formula                  │
│                                                  │
│  When A1 changes to 7:                          │
│  Cell A3 automatically becomes 17               │
│  (You didn't update A3 — it updated itself)     │
└────────────────────────────────────────────────┘

effect():
┌────────────────────────────────────────────────┐
│  state: { a: 5, b: 10 }                        │
│                                                  │
│  effect(() => {                                  │
│    display.textContent = state.a + state.b;     │
│  })  ← Formula                                  │
│                                                  │
│  When state.a changes to 7:                     │
│  display shows 17 automatically                 │
│  (You didn't update display — effect did)       │
└────────────────────────────────────────────────┘
```

Just like spreadsheet formulas, effects describe a **relationship** between data and output. When the data changes, the output updates automatically.

---

## How Does It Work?

### Automatic Dependency Tracking

When `effect()` runs your function, it sets a global "currently running effect" marker. During execution, every reactive state read goes through the Proxy's GET trap, which checks for this marker and records the dependency.

```
effect(() => {
  console.log(app.count);  // Step 1: Read app.count
})

During execution:
  ┌──────────────────────────────────┐
  │  currentEffect = this effect     │
  │                                  │
  │  app.count is read               │
  │    ↓                             │
  │  Proxy GET trap fires            │
  │    ↓                             │
  │  Record: count → [this effect]   │
  └──────────────────────────────────┘

When app.count changes:
  ┌──────────────────────────────────┐
  │  app.count = 5                   │
  │    ↓                             │
  │  Proxy SET trap fires            │
  │    ↓                             │
  │  Look up: who depends on count?  │
  │    ↓                             │
  │  Found: [this effect]            │
  │    ↓                             │
  │  Queue effect for re-run         │
  └──────────────────────────────────┘
```

### Effects Run Immediately

When you create an effect, it runs **once immediately**. This is how dependencies are discovered — the system watches what you read on the first run.

```javascript
const app = state({ count: 0 });

effect(() => {
  console.log('Running!', app.count);
});
// Logs immediately: "Running! 0"

app.count = 1;
// Logs: "Running! 1"
```

This immediate run is intentional — it sets up the initial state of your UI and discovers dependencies at the same time.

### Re-running and Re-tracking

After each re-run, the effect's dependency list is **refreshed**. This allows dependencies to change dynamically:

```javascript
const app = state({ showCount: true, count: 5, name: 'Alice' });

effect(() => {
  if (app.showCount) {
    console.log('Count:', app.count);  // Reads count
  } else {
    console.log('Name:', app.name);    // Reads name
  }
});
// Output: "Count: 5" (depends on showCount and count)

app.count = 10;
// Output: "Count: 10" (count is tracked)

app.showCount = false;
// Output: "Name: Alice" (now depends on showCount and name — not count)

app.count = 99;
// No output! count is no longer tracked (showCount is false)

app.name = 'Bob';
// Output: "Name: Bob" (name is now tracked)
```

---

## Basic Usage

### Step 1 — The Simplest Effect

```javascript
const app = state({ count: 0 });

effect(() => {
  console.log('Count changed to:', app.count);
});
// Logs: "Count changed to: 0" (runs immediately)

app.count = 1;  // Logs: "Count changed to: 1"
app.count = 2;  // Logs: "Count changed to: 2"
```

### Step 2 — Effects With DOM

```javascript
// HTML: <h1 id="title"></h1>

const page = state({ title: 'Welcome' });

effect(() => {
  document.getElementById('title').textContent = page.title;
  document.title = page.title;  // Browser tab title too
});
// Both are set to "Welcome" immediately

page.title = 'Dashboard';
// Both update to "Dashboard" automatically
```

### Step 3 — Multiple States in One Effect

```javascript
const user = state({ name: 'Alice' });
const ui = state({ theme: 'light' });

effect(() => {
  // This effect reads from two different state objects
  document.body.className = `user-${user.name} theme-${ui.theme}`;
});
// Sets: "user-Alice theme-light"

user.name = 'Bob';
// Sets: "user-Bob theme-light" (re-ran because user.name changed)

ui.theme = 'dark';
// Sets: "user-Bob theme-dark" (re-ran because ui.theme changed)
```

### Step 4 — Stopping an Effect

Effects run until you stop them. Use the return value to get a stop function:

```javascript
const app = state({ count: 0 });

// Create the effect and capture the stop function
const stopCounting = effect(() => {
  console.log('Count:', app.count);
});
// Logs: "Count: 0"

app.count = 1;  // Logs: "Count: 1"
app.count = 2;  // Logs: "Count: 2"

// Stop the effect — it won't run anymore
stopCounting();

app.count = 3;  // No output — effect is stopped
app.count = 4;  // No output — effect is stopped
```

### Step 5 — Conditional Effects

You can conditionally display different information:

```javascript
const app = state({ isLoggedIn: false, user: null });

effect(() => {
  const header = document.getElementById('header');

  if (app.isLoggedIn) {
    header.textContent = `Welcome, ${app.user?.name}!`;
    header.className = 'header-logged-in';
  } else {
    header.textContent = 'Please log in';
    header.className = 'header-guest';
  }
});
```

---

## Deep Dive: Effects and Performance

### Only Tracked Properties Trigger Re-runs

Effects are efficient by design — they only re-run when properties they actually read change:

```javascript
const app = state({ a: 1, b: 2, c: 3, d: 4 });

effect(() => {
  // Only reads `a` and `b`
  console.log(app.a, app.b);
});

app.a = 10;  // ✅ Re-runs — reads `a`
app.b = 20;  // ✅ Re-runs — reads `b`
app.c = 30;  // ❌ Doesn't re-run — never reads `c`
app.d = 40;  // ❌ Doesn't re-run — never reads `d`
```

This means you can put large state objects in one place, and individual effects only pay attention to exactly what they need.

### Multiple Focused Effects vs One Large Effect

Prefer multiple focused effects over one massive one:

```javascript
const app = state({ name: '', email: '', theme: 'light', count: 0 });

// ❌ One large effect — runs for ANY state change
effect(() => {
  document.getElementById('name-display').textContent = app.name;
  document.getElementById('email-display').textContent = app.email;
  document.body.className = app.theme;
  document.getElementById('counter').textContent = app.count;
});

// ✅ Multiple focused effects — each runs only when its data changes
effect(() => {
  document.getElementById('name-display').textContent = app.name;
  document.getElementById('email-display').textContent = app.email;
});

effect(() => {
  document.body.className = app.theme;
});

effect(() => {
  document.getElementById('counter').textContent = app.count;
});
```

With the multiple effect approach:
- Changing `app.count` only runs the counter effect
- Changing `app.theme` only runs the theme effect
- Less unnecessary DOM work

### Effects Don't Run for Unchanged Values

If you set a property to the same value, effects don't re-run:

```javascript
const app = state({ status: 'active' });

effect(() => {
  console.log('Status:', app.status);
});
// Logs: "Status: active"

app.status = 'active';  // Same value — no re-run
app.status = 'inactive';  // Different value — re-runs
```

---

## Deep Dive: Common Effect Patterns

### DOM Text Content

```javascript
effect(() => {
  document.getElementById('count').textContent = app.count;
});
```

### DOM Attribute

```javascript
effect(() => {
  const btn = document.getElementById('submit');
  btn.disabled = !app.isFormValid;
  btn.setAttribute('aria-label', app.isFormValid ? 'Submit form' : 'Form incomplete');
});
```

### CSS Classes

```javascript
effect(() => {
  const panel = document.getElementById('panel');
  panel.classList.toggle('active', app.isOpen);
  panel.classList.toggle('loading', app.isLoading);
  panel.classList.toggle('error', !!app.error);
});
```

### Show/Hide Elements

```javascript
effect(() => {
  document.getElementById('loading-spinner').hidden = !app.isLoading;
  document.getElementById('content').hidden = app.isLoading;
  document.getElementById('error-message').hidden = !app.error;
});
```

### Logging for Debugging

```javascript
effect(() => {
  // Useful during development to track state changes
  console.log('[State Update]', {
    count: app.count,
    name: app.name,
    isLoading: app.isLoading
  });
});
```

### Syncing to localStorage

```javascript
effect(() => {
  localStorage.setItem('user-theme', app.theme);
  localStorage.setItem('user-language', app.language);
});
```

### Updating Multiple Related Elements

```javascript
const cart = state({ items: [], total: 0 });

effect(() => {
  const count = cart.items.length;
  const total = cart.total;

  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
  document.getElementById('checkout-btn').disabled = count === 0;
  document.getElementById('empty-cart-msg').hidden = count > 0;
});
```

---

## Deep Dive: Effects and Cleanup

### Stopping Effects When No Longer Needed

When a component is removed from the page, its effects should stop to prevent memory leaks:

```javascript
function createWidget() {
  const data = state({ value: 0 });

  const stopEffect = effect(() => {
    document.getElementById('widget-value').textContent = data.value;
  });

  // Return a destroy function
  return {
    data,
    destroy() {
      stopEffect();  // Stop the effect when widget is removed
    }
  };
}

const widget = createWidget();
widget.data.value = 42;  // Updates display

// Later, when widget is removed:
widget.destroy();        // Effect stops — no more updates, no memory leak
```

### Managing Multiple Effect Cleanups

```javascript
const stoppers = [];

stoppers.push(effect(() => { /* effect 1 */ }));
stoppers.push(effect(() => { /* effect 2 */ }));
stoppers.push(effect(() => { /* effect 3 */ }));

// Stop all effects at once
function cleanup() {
  stoppers.forEach(stop => stop());
}
```

---

## Common Mistakes

### Mistake 1: Reading State Outside an Effect

```javascript
const app = state({ count: 0 });

// ❌ Not reactive — this is a snapshot
const snapshot = app.count;
console.log(snapshot);  // 0 — won't change

// ✅ Reactive — this re-runs when count changes
effect(() => {
  console.log(app.count);  // Re-reads on every run
});
```

### Mistake 2: Creating Infinite Loops

```javascript
const app = state({ count: 0 });

// ❌ This creates an infinite loop!
effect(() => {
  app.count++;  // Reading AND writing the same property
  // Reading triggers tracking, writing triggers re-run, which reads, which writes...
});

// ✅ Separate reads and writes
effect(() => {
  console.log(app.count);  // Only read
});

// Change state from elsewhere
document.getElementById('btn').addEventListener('click', () => {
  app.count++;  // Only write, outside the effect
});
```

### Mistake 3: Async Work Inside Effects

```javascript
// ❌ Async work in effects is tricky — only synchronous reads are tracked
effect(async () => {
  const name = app.name;       // Tracked ✅
  await fetch('/api');          // Async boundary
  const data = app.extraData;  // This may NOT be tracked ❌ (after await)
});

// ✅ Read all reactive data synchronously first
effect(() => {
  const name = app.name;       // Tracked ✅
  const id = app.userId;       // Tracked ✅

  // Then do async work with captured values
  fetch(`/api/users/${id}`).then(res => res.json()).then(data => {
    app.userData = data;  // Write back to state
  });
});
```

### Mistake 4: Forgetting That Effects Run Immediately

```javascript
const app = state({ isReady: false });

// This runs RIGHT NOW — app.isReady is false
effect(() => {
  if (app.isReady) {
    initSomething();  // Won't run on first call
  }
});

// Later:
app.isReady = true;  // NOW initSomething() runs
```

This is expected behavior — understand that the initial run may not do anything if the data isn't ready yet.

---

## Summary

- `effect()` creates a function that runs automatically when reactive state it reads changes
- Effects run **immediately** when created — this discovers dependencies and sets initial state
- Dependencies are tracked **automatically** — just read reactive state inside the effect
- Only properties that were **actually read** trigger re-runs — efficient by design
- Dynamic dependencies are supported — what an effect watches can change between runs
- Effects return a **stop function** — call it to prevent future re-runs (important for cleanup)
- Prefer **multiple focused effects** over one large effect for better performance
- Avoid **reading and writing the same property** inside an effect — causes infinite loops
- Async code inside effects needs care — only synchronous reads are reliably tracked

**The mental model:** Effects are like spreadsheet formulas — they describe what the output should be based on input data. When input changes, output updates automatically.

---

## What's Next?

Now that you understand effects, let's explore **computed properties and watchers** — two powerful tools for deriving values and responding to specific changes.

Continue to: [05 — Computed Properties and Watch](./05_computed_and_watch.md)