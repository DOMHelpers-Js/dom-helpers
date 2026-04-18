[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Creating Reactive State

## Quick Start (30 seconds)

```javascript
// The simplest possible reactive state
const counter = state({ count: 0 });

// Use it like a normal object
counter.count++;

// React to changes
effect(() => {
  console.log('Count:', counter.count);
});
```

---

## What is `state()`?

`state()` is the **foundation of the entire reactive system**. It takes a plain JavaScript object and returns a reactive version of it — an object that tracks every read and write automatically.

Everything else in the reactive system (effects, computed properties, watchers, forms, collections) builds on top of `state()`.

Think of `state()` as the "on switch" for reactivity. Without it, your data is static. With it, your data is alive and connected.

---

## Syntax

```javascript
// Basic state creation
const myState = state(initialObject);

// With multiple properties
const app = state({
  name: 'Alice',
  age: 25,
  isLoggedIn: false
});

// Nested objects — deep reactivity is automatic
const store = state({
  user: {
    profile: {
      name: 'Alice'
    }
  },
  settings: {
    theme: 'light'
  }
});
```

**Parameters:**
- `initialObject` — A plain JavaScript object with your starting values

**Returns:**
- A reactive Proxy that behaves exactly like your original object

---

## Why Does This Exist?

### Working With `state()` vs Plain JavaScript

When you need reactive behavior, `state()` is your go-to tool. Here's the contrast in a real scenario:

#### Plain JavaScript — Managing State Manually

```javascript
// Plain JavaScript approach
let user = {
  name: 'Alice',
  email: 'alice@example.com',
  role: 'user'
};

function updateName(newName) {
  user.name = newName;
  // Must manually update every display
  document.getElementById('header-name').textContent = newName;
  document.getElementById('profile-name').textContent = newName;
  document.getElementById('nav-name').textContent = newName;
  document.title = `Profile - ${newName}`;
}

function updateRole(newRole) {
  user.role = newRole;
  // Must manually update role-related UI
  document.getElementById('role-badge').textContent = newRole;
  document.getElementById('admin-panel').hidden = newRole !== 'admin';
  document.getElementById('user-menu').className = `menu menu-${newRole}`;
}
```

At first glance, this looks manageable. But there's a hidden problem.

**What's the Real Issue?**

```
User changes name
      ↓
You must remember every place that shows the name
      ↓
Update each one manually in the right function
      ↓
Miss one? → UI is out of sync
Add a new display? → Update the function
Change another property? → Write another update block
      ↓
Code grows. Bugs appear. Syncing becomes fragile.
```

**Problems:**
❌ Every property change needs its own manual update block
❌ Adding new UI elements means updating existing functions
❌ Easy to forget a display — UI silently shows wrong data
❌ Functions grow longer as the app grows

#### The Solution with `state()`

```javascript
// Reactive approach
const user = state({
  name: 'Alice',
  email: 'alice@example.com',
  role: 'user'
});

// Describe the relationships once
effect(() => {
  document.getElementById('header-name').textContent = user.name;
  document.getElementById('profile-name').textContent = user.name;
  document.getElementById('nav-name').textContent = user.name;
  document.title = `Profile - ${user.name}`;
});

effect(() => {
  document.getElementById('role-badge').textContent = user.role;
  document.getElementById('admin-panel').hidden = user.role !== 'admin';
  document.getElementById('user-menu').className = `menu menu-${user.role}`;
});

// Now updates are trivial
user.name = 'Bob';    // All name displays update automatically
user.role = 'admin';  // All role displays update automatically
```

**What Just Happened?**

```
user.name = 'Bob'
      ↓
Proxy intercepts the write
      ↓
Finds all effects that read "name"
      ↓
Re-runs them automatically
      ↓
All displays show "Bob"
```

**Benefits:**
✅ Change `user.name` once — all displays update
✅ Add a new display? Just read `user.name` in an effect — no function changes
✅ The UI can never be out of sync
✅ Update logic stays clean and simple

---

## Mental Model

### A Live Database with Automatic Notifications

Think of reactive state as a **live database table with subscriptions**.

```
Regular JavaScript object:
┌───────────────────────────────────┐
│  user = { name: "Alice" }         │
│                                   │
│  (A static record. Changing it    │
│   notifies nobody. You must call  │
│   updateEverything() manually.)   │
└───────────────────────────────────┘

Reactive state:
┌───────────────────────────────────┐
│  user = state({ name: "Alice" })  │
│                                   │
│  SUBSCRIPTIONS:                   │
│  ├── Header display               │
│  ├── Profile display              │
│  ├── Navigation display           │
│  └── Page title                   │
│                                   │
│  (Change "name" → all subscribers │
│   update automatically, instantly)│
└───────────────────────────────────┘
```

You don't manage the subscriptions yourself. The reactive system records them automatically when an effect reads a property.

---

## How Does It Work?

### The Proxy Wrapper

When you call `state({ count: 0 })`, the system:

1. Takes your plain object `{ count: 0 }`
2. Wraps it in a JavaScript `Proxy`
3. Returns the Proxy (which looks and acts like the original)

```
state({ count: 0 })
         ↓
┌─────────────────────────────────────┐
│  Proxy wraps your object            │
│                                     │
│  GET trap: "count" was read         │
│    → if inside effect, record dep   │
│                                     │
│  SET trap: "count" was written      │
│    → find all deps for "count"      │
│    → queue them for re-run          │
└─────────────────────────────────────┘
         ↓
Your effects re-run automatically
```

You use the object normally — `app.count`, `app.count = 5`. The Proxy does all the work invisibly.

### Deep Reactivity

Nested objects become reactive automatically. You don't need to call `state()` on nested objects:

```
state({
  user: {              ← Wrapped in Proxy automatically
    profile: {         ← Wrapped in Proxy automatically
      name: 'Alice'    ← Each access tracked
    }
  }
})
```

The system recursively wraps nested plain objects in Proxies when they are first accessed.

### What Doesn't Get Wrapped

Some built-in JavaScript types are intentionally skipped — they would break if proxied:

```javascript
const app = state({
  // These are stored as-is, NOT wrapped in Proxy:
  createdAt: new Date(),          // Date objects
  data: new Map(),                 // Map objects
  tags: new Set(),                 // Set objects
  request: new AbortController(),  // AbortController
  element: document.querySelector('#app'),  // DOM elements

  // But the PROPERTY holding them is still reactive:
  count: 0,  // This IS tracked
  name: ''   // This IS tracked
});

// Assigning a new Date triggers effects:
app.createdAt = new Date();  // ✅ Tracked — property changed

// But modifying the Date internally does NOT:
app.createdAt.setFullYear(2025);  // ❌ Not tracked — internal mutation
```

---

## Basic Usage

### Creating Simple State

```javascript
// Boolean state
const visibility = state({ isVisible: true });

// String state
const theme = state({ mode: 'light' });

// Number state
const score = state({ points: 0, highScore: 0 });

// Mixed state
const app = state({
  isLoading: false,
  count: 0,
  name: '',
  tags: []
});
```

### Creating Nested State

```javascript
// Deeply nested — all levels are reactive
const userProfile = state({
  personal: {
    name: 'Alice',
    age: 25,
    address: {
      city: 'New York',
      country: 'USA'
    }
  },
  settings: {
    notifications: true,
    privacy: 'public',
    theme: 'light'
  }
});

// Reading nested values
console.log(userProfile.personal.name);         // "Alice"
console.log(userProfile.personal.address.city); // "New York"

// Writing nested values — all reactive
userProfile.personal.name = 'Bob';
userProfile.personal.address.city = 'Los Angeles';
userProfile.settings.theme = 'dark';
```

### Reading State

```javascript
const app = state({
  count: 5,
  name: 'DOMHelpers',
  items: ['a', 'b', 'c']
});

// Read exactly like a plain object
console.log(app.count);        // 5
console.log(app.name);         // "DOMHelpers"
console.log(app.items[0]);     // "a"
console.log(app.items.length); // 3

// Works with destructuring too
const { count, name } = app;
console.log(count);  // 5 (note: this is a snapshot — not reactive)
```

> **Important:** Destructuring extracts a snapshot of the value at that moment. The variable `count` above will not update when `app.count` changes. To keep reactivity, always read through the state object inside an effect.

### Writing State

```javascript
const app = state({ count: 0, name: 'Alice' });

// Direct assignment — the simplest way
app.count = 5;
app.name = 'Bob';

// Increment
app.count++;
app.count += 10;

// Using set() for functional updates
set(app, {
  count: prev => prev + 1,   // Increment by 1
  name: prev => prev.trim()  // Transform current value
});
```

### Checking If Something Is Reactive

```javascript
import { isReactive } from '...'; // or use global isReactive

const plain = { count: 0 };
const reactive = state({ count: 0 });

console.log(isReactive(plain));    // false
console.log(isReactive(reactive)); // true
```

### Getting the Raw Object

Sometimes you need the original, unwrapped object — for example when sending to an API:

```javascript
const user = state({
  name: 'Alice',
  email: 'alice@example.com'
});

// Get the raw (non-reactive) object
const rawUser = getRaw(user);
console.log(rawUser);  // { name: 'Alice', email: 'alice@example.com' }

// Common use: sending to API
fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify(getRaw(user))  // Send plain object, not proxy
});
```

---

## Deep Dive: Creating State for Different Scenarios

### Form Data State

```javascript
const loginForm = state({
  email: '',
  password: '',
  rememberMe: false,
  isSubmitting: false,
  error: null
});

// Track form input
document.getElementById('email').addEventListener('input', (e) => {
  loginForm.email = e.target.value;
});

document.getElementById('password').addEventListener('input', (e) => {
  loginForm.password = e.target.value;
});

// Show error if it appears
effect(() => {
  const errorEl = document.getElementById('error-message');
  errorEl.textContent = loginForm.error || '';
  errorEl.hidden = !loginForm.error;
});

// Disable button while submitting
effect(() => {
  document.getElementById('submit-btn').disabled = loginForm.isSubmitting;
});
```

### UI State

```javascript
const ui = state({
  sidebarOpen: false,
  activeTab: 'overview',
  modalOpen: false,
  notifications: []
});

// Toggle sidebar
document.getElementById('toggle-sidebar').addEventListener('click', () => {
  ui.sidebarOpen = !ui.sidebarOpen;
});

// React to sidebar state
effect(() => {
  document.getElementById('sidebar').classList.toggle('open', ui.sidebarOpen);
  document.getElementById('content').classList.toggle('shifted', ui.sidebarOpen);
});
```

### Application Data State

```javascript
const store = state({
  users: [],
  products: [],
  currentUser: null,
  cart: {
    items: [],
    total: 0
  }
});

// Update cart total when items change
effect(() => {
  store.cart.total = store.cart.items.reduce((sum, item) => sum + item.price, 0);
});
```

### Multiple Independent States

You can have as many independent reactive states as you need:

```javascript
// Each state is independent
const uiState = state({ theme: 'light', sidebarOpen: false });
const userData = state({ name: '', email: '', isLoggedIn: false });
const cartData = state({ items: [], coupon: null });
const settingsData = state({ notifications: true, language: 'en' });

// Effects can read from multiple states
effect(() => {
  // This effect depends on both uiState AND userData
  document.title = userData.isLoggedIn
    ? `Welcome, ${userData.name} — ${uiState.theme} mode`
    : 'Please log in';
});
```

---

## Deep Dive: State Initialization Patterns

### Initializing with Default Values

```javascript
// Always provide sensible defaults
const app = state({
  isLoading: false,    // Not null or undefined — be explicit
  data: null,          // null is a valid "empty" state
  error: null,
  count: 0,
  name: '',
  items: [],
  config: {}
});
```

Providing explicit initial values makes your state predictable and self-documenting.

### Initializing From an API Response

```javascript
// Start with defaults, then fill in with data
const userState = state({
  isLoading: true,
  name: '',
  email: '',
  avatar: null
});

// Fetch real data
async function loadUser(userId) {
  userState.isLoading = true;
  try {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();

    userState.name = user.name;
    userState.email = user.email;
    userState.avatar = user.avatar;
  } catch (err) {
    console.error('Failed to load user:', err);
  } finally {
    userState.isLoading = false;
  }
}
```

### Initializing From LocalStorage

```javascript
// Load saved preferences or use defaults
const savedTheme = localStorage.getItem('theme') || 'light';
const savedLanguage = localStorage.getItem('language') || 'en';

const preferences = state({
  theme: savedTheme,
  language: savedLanguage,
  fontSize: 16
});

// Save when preferences change
effect(() => {
  localStorage.setItem('theme', preferences.theme);
  localStorage.setItem('language', preferences.language);
});
```

---

## Common Pitfalls

### Pitfall 1: Mutating Nested Arrays With Direct Methods

```javascript
const app = state({ items: [] });

// This may NOT trigger reactive updates (depends on array patching):
app.items.push('new item');  // ⚠️ Might not be tracked

// This IS always tracked — reassign the array:
app.items = [...app.items, 'new item'];  // ✅ Always works
```

> **Note:** The reactive array patch module (`02_dh-reactive-array-patch.js`) adds reactivity to array mutation methods. If it's loaded, `push`, `pop`, `splice`, etc. will work reactively. If not, reassigning the array is the safe approach.

### Pitfall 2: Replacing State Entirely

```javascript
const user = state({ name: 'Alice', age: 25 });

// ❌ This breaks the reactive connection
user = state({ name: 'Bob', age: 30 });  // Can't reassign const

// ❌ This replaces the object and may lose tracking
// (Avoid reassigning the state variable itself)

// ✅ Update properties instead
user.name = 'Bob';
user.age = 30;

// ✅ Or use set() for multiple properties
set(user, { name: 'Bob', age: 30 });
```

### Pitfall 3: Reading State Outside an Effect

```javascript
const app = state({ count: 0 });

// ❌ Reading outside an effect — not reactive
const count = app.count;  // Snapshot at this moment
// `count` will always be 0, even if app.count changes

// ✅ Reading inside an effect — reactive
effect(() => {
  const count = app.count;  // Re-reads on every run
  console.log(count);
});
```

---

## Summary

- `state()` is the foundation of the reactive system — it creates a reactive object from a plain JavaScript object
- Use it like a normal object — dot notation for reading and writing
- Deep reactivity works automatically — nested objects are reactive too
- Some built-in types (Date, Map, Set, DOM elements) are stored as-is, but the properties holding them remain reactive
- Use `getRaw()` when you need the unwrapped, plain object (e.g., for JSON serialization)
- Use `isReactive()` to check if something is reactive
- Always initialize with explicit default values — `''`, `null`, `false`, `0`, `[]`, `{}`
- Update properties directly (`app.count = 5`) or use `set()` for functional updates

**The rule:** Create state once, update properties directly, and let effects handle the rest.

---

## What's Next?

Now that you know how to create reactive state, let's look at all the ways to update it — from direct assignment to functional updates and batching multiple changes together.

Continue to: [03 — Updating State](./03_updating_state.md)