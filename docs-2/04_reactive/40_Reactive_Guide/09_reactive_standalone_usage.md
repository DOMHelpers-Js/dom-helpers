[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Reactive as a Standalone Library

## Quick Demonstration

```html
<!-- Drop this one script into any existing project -->
<script src="01_dh-reactive.js"></script>

<script>
  // Now you have reactive state — in any project
  const app = state({ count: 0, message: 'Hello' });

  effect(() => {
    document.getElementById('counter').textContent = app.count;
  });

  app.count = 5;  // Counter updates automatically ✨
</script>
```

That's it. One file. Any project. Reactive state.

---

## What This Section Is About

This section answers a simple question:

**"Do I need to install the full DOM Helpers library to use Reactive?"**

The answer is: **No.**

Reactive is a standalone module. It works independently in any JavaScript project — existing or new, small or large, with vanilla JS, jQuery, or any other setup.

What you'll learn in this section:

1. How to use Reactive by itself
2. What Reactive gives you without any other dependencies
3. How to add Reactive to an existing project in minutes
4. When standalone Reactive is enough
5. When combining with full DOM Helpers becomes valuable (for new projects)

---

## What Reactive Gives You Standalone

When you load just the Reactive module (with the shortcut API), you get:

```
Standalone Reactive API:
│
├── State Creation
│   ├── state(obj)          — Create reactive object
│   ├── ref(value)          — Single reactive value
│   ├── refs(defs)          — Multiple refs
│   └── createState(state, bindings) — State with DOM bindings
│
├── Reactions
│   ├── effect(fn)          — Run code when state changes
│   ├── watch(state, defs)  — Watch specific properties
│   └── computed(state, defs) — Derived values
│
├── Updates
│   ├── set(state, updates) — Functional updates
│   └── batch(fn)           — Group multiple changes
│
├── Utilities
│   ├── isReactive(val)     — Check if reactive
│   ├── getRaw(state)       — Get plain object
│   ├── notify(state, key)  — Manual trigger
│   ├── untrack(fn)         — Read without tracking
│   ├── pause() / resume()  — Pause reactivity
│   └── toRaw(state)        — Same as getRaw
│
├── Specialized Factories
│   ├── form(values)        — Form state
│   ├── async(initial)      — Async data state
│   ├── store(state, opts)  — Store with actions
│   ├── component(config)   — Full component lifecycle
│   └── collection(items)   — Reactive list
│
└── Persistence (if storage module loaded)
    ├── autoSave(state, key)
    ├── save(state)
    ├── load(state)
    └── clear(state)
```

This is a complete reactive system. You do not need any other module to use it.

---

## What Standalone Reactive Does NOT Give You

Without the DOM Helpers modules (Core, Enhancers, Conditions), you don't have:

- `element.update({...})` — the enhanced update method
- `Elements.textContent({...})` — bulk ID-based updates
- `ClassName.button.update({...})` — collection shortcuts
- `Id('myButton')` — shorthand element access
- `queryAll('.card').update({...})` — query with update chaining
- Array distribution across collections
- Index-based collection updates
- `Conditions.whenState(...)` — declarative conditionals

For DOM manipulation, you use **plain JavaScript** or whatever you already have.

This is perfectly fine for most cases. Reactive handles the *state* layer. You handle the *DOM* layer however you prefer.

---

## Syntax: Standalone Reactive

### Loading (any existing project)

```html
<!-- Load reactive modules in order -->
<script src="path/to/01_dh-reactive.js"></script>

<!-- Optional: load the shortcut API for cleaner syntax -->
<script src="path/to/09_dh-reactiveUtils-shortcut.js"></script>
```

### Core API in standalone mode

```javascript
// Create state
const app = state({ count: 0, name: 'Alice' });

// React to changes
effect(() => {
  document.getElementById('count').textContent = app.count;
});

// Update state
app.count = 5;       // Direct assignment
set(app, { count: prev => prev + 1 });  // Functional

// Batch multiple changes
batch(() => {
  app.count = 0;
  app.name = 'Bob';
});
```

---

## Why Does Standalone Reactive Exist?

### Dropping Reactive Into an Existing Project

Most real-world projects already have DOM manipulation code. They use vanilla JS, jQuery, Bootstrap components, or custom frameworks.

Adding a new library to such projects is a significant decision. It must:
- Not break anything existing
- Require minimal changes
- Deliver immediate value

Reactive is designed exactly for this. It is **additive** — you add it alongside what you have, not instead of it.

```
Your existing project:
│
├── jQuery for DOM manipulation       ← Stays unchanged
├── Bootstrap components              ← Stays unchanged
├── Custom utility functions          ← Stays unchanged
│
└── + Reactive                        ← Added alongside
    └── Handles state tracking only
        └── DOM manipulation = you still use jQuery/vanilla/etc.
```

No migration. No rewrite. Just better state management.

---

## Mental Model

### Reactive as the State Layer

Think of Reactive as the **"brain"** and your existing DOM code as the **"hands"**.

```
Without Reactive:
┌─────────────────────────────────────────────────────┐
│  Your JS code                                        │
│                                                      │
│  let count = 0;      ← State lives in a variable    │
│                                                      │
│  function increment() {                              │
│    count++;                                          │
│    updateEveryDisplay();  ← Must manually connect   │
│  }                                                   │
└─────────────────────────────────────────────────────┘

With Reactive added:
┌─────────────────────────────────────────────────────┐
│  const app = state({ count: 0 });  ← Smart state   │
│                                                      │
│  effect(() => {                                      │
│    updateEveryDisplay();  ← Connected automatically │
│  });                                                 │
│                                                      │
│  function increment() {                              │
│    app.count++;   ← Just change state — done        │
│  }                                                   │
└─────────────────────────────────────────────────────┘
```

Your DOM code stays the same. Reactive just makes your state smarter.

---

## Basic Usage: Standalone

### Example 1 — Counter (Simplest Case)

```html
<p>Count: <span id="count">0</span></p>
<button id="inc">+1</button>
<button id="dec">-1</button>
<button id="reset">Reset</button>
```

```javascript
const counter = state({ count: 0 });

// Describe what the display should show — reactive
effect(() => {
  document.getElementById('count').textContent = counter.count;
});

// Buttons just change the state — that's all
document.getElementById('inc').addEventListener('click', () => {
  set(counter, { count: prev => prev + 1 });
});

document.getElementById('dec').addEventListener('click', () => {
  set(counter, { count: prev => prev - 1 });
});

document.getElementById('reset').addEventListener('click', () => {
  counter.count = 0;
});
```

**What's happening:** The effect describes the relationship between `counter.count` and the DOM display. Changing the state fires the effect. The buttons only touch state — never the DOM directly.

### Example 2 — Dynamic List

```html
<ul id="todo-list"></ul>
<input id="todo-input" type="text" placeholder="New todo...">
<button id="add-btn">Add</button>
<p id="count-display"></p>
```

```javascript
const todos = state({ items: [], nextId: 1 });

// Render the list whenever items change
effect(() => {
  const list = document.getElementById('todo-list');
  list.innerHTML = todos.items
    .map(item => `
      <li>
        <input type="checkbox" data-id="${item.id}" ${item.done ? 'checked' : ''}>
        <span style="text-decoration: ${item.done ? 'line-through' : 'none'}">${item.text}</span>
        <button data-remove="${item.id}">✕</button>
      </li>
    `)
    .join('');

  // Show count
  const remaining = todos.items.filter(t => !t.done).length;
  document.getElementById('count-display').textContent =
    `${remaining} of ${todos.items.length} remaining`;
});

// Add todo
document.getElementById('add-btn').addEventListener('click', () => {
  const input = document.getElementById('todo-input');
  const text = input.value.trim();
  if (!text) return;

  set(todos, {
    items: prev => [...prev, { id: todos.nextId, text, done: false }],
    nextId: prev => prev + 1
  });
  input.value = '';
});

// Delegate clicks in the list
document.getElementById('todo-list').addEventListener('click', (e) => {
  const removeId = e.target.dataset.remove;
  const checkId = e.target.dataset.id;

  if (removeId) {
    set(todos, { items: prev => prev.filter(t => t.id !== parseInt(removeId)) });
  }
  if (checkId) {
    set(todos, {
      items: prev => prev.map(t =>
        t.id === parseInt(checkId) ? { ...t, done: !t.done } : t
      )
    });
  }
});
```

**What's happening:** Reactive manages the list state. When any item changes, the effect re-renders the entire list. The DOM manipulation is plain JavaScript — `innerHTML`, `addEventListener`, `dataset`. No DOM Helpers needed.

### Example 3 — Theme Toggle

```javascript
// Works in any project with any existing styling
const theme = state({ current: 'light' });

effect(() => {
  document.documentElement.setAttribute('data-theme', theme.current);
  document.body.className = `theme-${theme.current}`;

  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = theme.current === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
  }
});

document.getElementById('theme-toggle').addEventListener('click', () => {
  set(theme, { current: prev => prev === 'light' ? 'dark' : 'light' });
});

// Restore saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) theme.current = savedTheme;

// Save when changed
watch(theme, {
  current(newTheme) {
    localStorage.setItem('theme', newTheme);
  }
});
```

### Example 4 — Async Data Loading

```javascript
const userData = state({
  data: null,
  loading: false,
  error: null
});

computed(userData, {
  isSuccess() { return !this.loading && !this.error && this.data !== null; },
  isError() { return !this.loading && this.error !== null; }
});

// Loading state display
effect(() => {
  document.getElementById('spinner').hidden = !userData.loading;
  document.getElementById('error-msg').hidden = !userData.isError;
  document.getElementById('user-card').hidden = !userData.isSuccess;

  if (userData.isError) {
    document.getElementById('error-msg').textContent = userData.error;
  }

  if (userData.isSuccess) {
    document.getElementById('user-name').textContent = userData.data.name;
    document.getElementById('user-email').textContent = userData.data.email;
  }
});

async function loadUser(id) {
  batch(() => {
    userData.loading = true;
    userData.error = null;
  });

  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error('User not found');
    const data = await response.json();
    batch(() => {
      userData.data = data;
      userData.loading = false;
    });
  } catch (err) {
    batch(() => {
      userData.error = err.message;
      userData.loading = false;
    });
  }
}

loadUser(1);
```

---

## Adding Reactive to an Existing jQuery Project

Reactive and jQuery work side by side. You don't replace jQuery — you use Reactive for state management and jQuery for DOM updates (as you already do).

```html
<!-- Existing jQuery setup — unchanged -->
<script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
<link rel="stylesheet" href="your-existing-styles.css">
<script src="your-existing-code.js"></script>

<!-- Add Reactive alongside -->
<script src="01_dh-reactive.js"></script>
<script src="09_dh-reactiveUtils-shortcut.js"></script>

<script>
  // Your existing jQuery code still works
  $(document).ready(function() { /* ... */ });

  // NEW: add reactive state for the parts you want to improve
  const appState = state({ user: null, notifications: 0 });

  // React to state changes using jQuery for DOM
  effect(() => {
    if (appState.user) {
      $('#user-name').text(appState.user.name);
      $('#user-avatar').attr('src', appState.user.avatar);
      $('#logged-in-section').show();
      $('#logged-out-section').hide();
    } else {
      $('#logged-in-section').hide();
      $('#logged-out-section').show();
    }
  });

  effect(() => {
    const count = appState.notifications;
    $('#notification-badge').text(count).toggle(count > 0);
  });

  // Your existing jQuery events still fire — they just update state
  $('#logout-btn').on('click', function() {
    appState.user = null;  // State change → reactive effects run
  });
</script>
```

**Key point:** You write effects using Reactive for tracking, and jQuery for DOM manipulation. Both co-exist. Reactive handles **what to do when state changes**. jQuery handles **how to change the DOM**.

---

## Adding Reactive to a Vanilla JS Project

```javascript
// Existing vanilla JS — unchanged
const existingUtils = {
  show: (id) => document.getElementById(id).style.display = 'block',
  hide: (id) => document.getElementById(id).style.display = 'none',
  setText: (id, text) => document.getElementById(id).textContent = text
};

// Add reactive state alongside existing code
const userState = state({ isLoggedIn: false, username: '' });

// Use your existing utilities inside effects
effect(() => {
  if (userState.isLoggedIn) {
    existingUtils.show('dashboard');
    existingUtils.hide('login-form');
    existingUtils.setText('greeting', `Hello, ${userState.username}!`);
  } else {
    existingUtils.hide('dashboard');
    existingUtils.show('login-form');
  }
});

// Login function just sets state
function loginUser(username) {
  batch(() => {
    userState.isLoggedIn = true;
    userState.username = username;
  });
}

// No change to how DOM manipulation works — same utility functions
// But now they're called automatically when state changes
```

---

## When Standalone Reactive Is Enough

Reactive standalone is the right choice when:

✅ **You're adding to an existing project** — minimal change, immediate benefit
✅ **The project already has DOM manipulation utilities** — keep using them
✅ **You only need state tracking and reactive effects** — Reactive covers this perfectly
✅ **You use jQuery** — React from Reactive, manipulate from jQuery
✅ **The project has strict "don't add libraries" rules** — one small file is easier to justify
✅ **You're prototyping** — get reactive state fast, worry about DOM helpers later
✅ **Server-rendered HTML** — Reactive adds interactivity without replacing your HTML generation

---

## When to Consider Adding DOM Helpers

For **new projects** being built from scratch, or when you're ready to take the next step, combining Reactive with the full DOM Helpers library gives you:

- `element.update({...})` — chainable updates with 13 specialized handlers
- `Elements.textContent({ id1: 'text', id2: 'text' })` — bulk ID-based updates
- `ClassName.card.update({ textContent: ['A', 'B', 'C'] })` — array distribution across collections
- `queryAll('.items').update({ [0]: {...}, [1]: {...} })` — index-based updates
- `Conditions.whenState(...)` — declarative conditional rendering
- Fine-grained change detection — DOM only updates when values actually change

These are not requirements. They're upgrades that make complex DOM manipulation cleaner and less repetitive.

The next sections show exactly how this works in practice.

---

## Summary

- **Reactive is fully standalone** — load one file, get a complete reactive system
- **Works in any project** — vanilla JS, jQuery, Bootstrap, or custom setups
- **Non-invasive** — add it alongside existing code, not instead of it
- **Handles state, not DOM** — your existing DOM code keeps working
- **Scales with your needs** — start small, add DOM Helpers modules when ready
- **The shortcut API** (`state()`, `set()`, `effect()`) works without any namespace

**The simple rule:**
- Existing project → add Reactive alone, use your existing DOM tools
- New project → use Reactive + DOM Helpers together from the start

Continue to: [10 — Reactive With Plain JS DOM](./10_reactive_with_plain_js_dom.md)