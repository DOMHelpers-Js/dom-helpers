[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Specialized State Factories

## Quick Start (30 seconds)

```javascript
// Async state — handles loading/error/data automatically
const userData = state(null);  // Use base state() for async pattern

async function loadUser(id) {
  userData.loading = true;
  try {
    const data = await fetch(`/api/users/${id}`).then(r => r.json());
    batch(() => { userData.data = data; userData.loading = false; });
  } catch (err) {
    batch(() => { userData.error = err.message; userData.loading = false; });
  }
}

// Form state — tracks values, errors, and touched fields
const loginForm = state({
  values: { email: '', password: '' },
  errors: {},
  touched: {},
  isSubmitting: false
});
```

---

## What are Specialized State Factories?

Specialized state factories are **pre-configured reactive state objects** built for common patterns. Instead of creating a plain `state()` and manually adding all the properties and logic for common scenarios, these factories give you a head start with exactly the right structure.

The reactive system includes these specialized factories:

- **`form()`** — form state with values, errors, touched tracking, and validation helpers
- **`async()`** — async state with `data`, `loading`, `error`, and computed `isSuccess`/`isError`
- **`store()`** — state with named getters and actions (Vuex/Redux-like pattern)
- **`component()`** — full component lifecycle with state, computed, watch, effects, and cleanup
- **`collection()`** — reactive list with add/remove/update/clear helpers
- **`createState()`** — state with automatic DOM bindings

Each factory is a shortcut. Everything they do, you could build with `state()`, `computed()`, `effect()`, and `watch()` — they just package it for you conveniently.

---

## `form()` — Form State

### What is `form()`?

`form()` creates a reactive state designed for handling HTML forms. It automatically sets up:

- `values` — object holding the current field values
- `errors` — object holding validation errors per field
- `touched` — object tracking which fields the user has interacted with
- `isSubmitting` — boolean for form submission state
- `isValid` — computed: true when there are no errors
- `isDirty` — computed: true when any field has been touched

```javascript
const loginForm = form({ email: '', password: '' });

// Form structure you get automatically:
// loginForm.values.email     → current email value
// loginForm.values.password  → current password value
// loginForm.errors.email     → email error message (or undefined)
// loginForm.touched.email    → true if user touched the field
// loginForm.isSubmitting     → true while submitting
// loginForm.isValid          → computed: no errors present
// loginForm.isDirty          → computed: user changed something
```

### Syntax

```javascript
// Create form state
const myForm = form(initialValues);

// Where initialValues is a plain object of field: defaultValue pairs
const contactForm = form({
  name: '',
  email: '',
  message: '',
  newsletter: false
});
```

### Complete Form Example

```javascript
// HTML:
// <form id="login-form">
//   <input id="email-input" type="email">
//   <p id="email-error" class="error"></p>
//   <input id="password-input" type="password">
//   <p id="password-error" class="error"></p>
//   <button id="submit-btn" type="submit">Login</button>
// </form>

const loginForm = form({ email: '', password: '' });

// Track field values
document.getElementById('email-input').addEventListener('input', (e) => {
  loginForm.values.email = e.target.value;
  loginForm.touched.email = true;
  validateEmail();
});

document.getElementById('password-input').addEventListener('input', (e) => {
  loginForm.values.password = e.target.value;
  loginForm.touched.password = true;
  validatePassword();
});

// Validation functions
function validateEmail() {
  const email = loginForm.values.email;
  if (!email) {
    loginForm.errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    loginForm.errors.email = 'Please enter a valid email';
  } else {
    delete loginForm.errors.email;
  }
}

function validatePassword() {
  const password = loginForm.values.password;
  if (!password) {
    loginForm.errors.password = 'Password is required';
  } else if (password.length < 8) {
    loginForm.errors.password = 'Password must be at least 8 characters';
  } else {
    delete loginForm.errors.password;
  }
}

// Reactive display of errors (only show if field was touched)
effect(() => {
  const emailErrorEl = document.getElementById('email-error');
  emailErrorEl.textContent = loginForm.touched.email ? (loginForm.errors.email || '') : '';
  emailErrorEl.hidden = !loginForm.touched.email || !loginForm.errors.email;
});

effect(() => {
  const passwordErrorEl = document.getElementById('password-error');
  passwordErrorEl.textContent = loginForm.touched.password ? (loginForm.errors.password || '') : '';
  passwordErrorEl.hidden = !loginForm.touched.password || !loginForm.errors.password;
});

// Disable submit button when invalid or submitting
effect(() => {
  document.getElementById('submit-btn').disabled = !loginForm.isValid || loginForm.isSubmitting;
  document.getElementById('submit-btn').textContent = loginForm.isSubmitting ? 'Logging in...' : 'Login';
});

// Submit handler
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validate all fields first
  validateEmail();
  validatePassword();

  if (!loginForm.isValid) return;

  loginForm.isSubmitting = true;

  try {
    await submitLogin(loginForm.values.email, loginForm.values.password);
    // Success — redirect or show success message
  } catch (err) {
    loginForm.errors.general = err.message;
  } finally {
    loginForm.isSubmitting = false;
  }
});
```

### Why Use `form()` vs Plain `state()`?

Both approaches work. Here's the comparison:

#### Using plain `state()`:
```javascript
const loginState = state({
  email: '',
  password: '',
  emailError: '',
  passwordError: '',
  emailTouched: false,
  passwordTouched: false,
  isSubmitting: false
});

// Must manually compute isValid, isDirty yourself
```

#### Using `form()`:
```javascript
const loginForm = form({ email: '', password: '' });
// Gets values, errors, touched structure + isValid + isDirty computed for free
// Cleaner naming: loginForm.values.email vs loginState.email
// Consistent structure across all forms in your app
```

`form()` shines when:
✅ You need a consistent form state structure
✅ You want `isValid` and `isDirty` computed for free
✅ Multiple forms in your app — same structure everywhere
✅ You prefer `form.values.email` over flat `form.email`

---

## `async()` — Async State

### What is `async()`?

`async()` creates a reactive state designed for async operations like API calls. It provides:

- `data` — the fetched/loaded data (starts as your initial value)
- `loading` — boolean, true while the operation is running
- `error` — any error that occurred (null if no error)
- `isSuccess` — computed: data loaded, not loading, no error
- `isError` — computed: not loading and error exists
- `$execute(fn)` — run an async function and automatically manage loading/error/data
- `$reset()` — reset back to initial state

```javascript
const userState = async(null);
// userState.data      → null (initial)
// userState.loading   → false
// userState.error     → null
// userState.isSuccess → false
// userState.isError   → false
```

### Syntax

```javascript
// Create async state
const myAsyncState = async(initialData);

// Execute an async operation
await execute(myAsyncState, async (signal) => {
  const response = await fetch('/api/data', { signal });
  return response.json();
});

// Or use the instance method
await myAsyncState.$execute(async () => {
  return await fetchSomeData();
});
```

> **Note:** `execute()` is the non-`$` prefixed function available from the namespace methods module.

### Complete Async Example

```javascript
const usersData = async(null);

// Effect: react to loading state
effect(() => {
  document.getElementById('loading').hidden = !usersData.loading;
  document.getElementById('user-list').hidden = usersData.loading;
});

// Effect: react to error state
effect(() => {
  const errorEl = document.getElementById('error-message');
  errorEl.hidden = !usersData.isError;
  errorEl.textContent = usersData.error?.message || '';
});

// Effect: react to success state
effect(() => {
  if (!usersData.isSuccess) return;

  const list = document.getElementById('user-list');
  list.innerHTML = usersData.data
    .map(user => `<li>${user.name} — ${user.email}</li>`)
    .join('');
});

// Load users
async function loadUsers() {
  await execute(usersData, async () => {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Failed to load users');
    return response.json();
  });
}

// Retry button
document.getElementById('retry-btn').addEventListener('click', loadUsers);

// Load on page start
loadUsers();
```

### Building the Async Pattern with Plain `state()`

You can also build async state manually — it's more explicit:

```javascript
// Manual approach
const usersState = state({
  data: null,
  loading: false,
  error: null
});

computed(usersState, {
  isSuccess() { return !this.loading && !this.error && this.data !== null; },
  isError() { return !this.loading && this.error !== null; }
});

async function loadUsers() {
  usersState.loading = true;
  usersState.error = null;
  try {
    const data = await fetch('/api/users').then(r => r.json());
    batch(() => {
      usersState.data = data;
      usersState.loading = false;
    });
  } catch (err) {
    batch(() => {
      usersState.error = err;
      usersState.loading = false;
    });
  }
}
```

Both approaches work. `async()` packages this pattern for you.

---

## `store()` — State Store with Actions

### What is `store()`?

`store()` creates state with **named getters** (computed properties) and **actions** (methods that modify state). This is inspired by patterns like Vuex or Redux, where state changes go through named actions.

```javascript
const counterStore = store(
  // Initial state
  { count: 0, step: 1 },

  // Options
  {
    // Getters (computed properties)
    getters: {
      doubled() { return this.count * 2; },
      label() { return `Count: ${this.count}`; }
    },

    // Actions (methods that modify state)
    actions: {
      increment(state) { state.count += state.step; },
      decrement(state) { state.count -= state.step; },
      reset(state) { state.count = 0; },
      setStep(state, newStep) { state.step = newStep; }
    }
  }
);

// Use the store
console.log(counterStore.count);    // 0
console.log(counterStore.doubled);  // 0 (getter)
console.log(counterStore.label);    // "Count: 0" (getter)

counterStore.increment();   // count → 1
counterStore.increment();   // count → 2
counterStore.setStep(5);    // step → 5
counterStore.increment();   // count → 7
counterStore.reset();       // count → 0
```

### Complete Store Example

```javascript
const authStore = store(
  {
    user: null,
    token: null,
    isLoading: false,
    error: null
  },
  {
    getters: {
      isLoggedIn() { return this.user !== null && this.token !== null; },
      userName() { return this.user?.name || 'Guest'; },
      userRole() { return this.user?.role || 'visitor'; },
      isAdmin() { return this.user?.role === 'admin'; }
    },
    actions: {
      async login(state, email, password) {
        state.isLoading = true;
        state.error = null;
        try {
          const res = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
          });
          const { user, token } = await res.json();
          batch(() => {
            state.user = user;
            state.token = token;
            state.isLoading = false;
          });
        } catch (err) {
          batch(() => {
            state.error = err.message;
            state.isLoading = false;
          });
        }
      },
      logout(state) {
        batch(() => {
          state.user = null;
          state.token = null;
          state.error = null;
        });
      }
    }
  }
);

// React to auth state
effect(() => {
  document.getElementById('user-name').textContent = authStore.userName;
  document.getElementById('login-btn').hidden = authStore.isLoggedIn;
  document.getElementById('logout-btn').hidden = !authStore.isLoggedIn;
  document.getElementById('admin-panel').hidden = !authStore.isAdmin;
});

// Buttons
document.getElementById('login-btn').addEventListener('click', () => {
  authStore.login('user@example.com', 'password');
});
document.getElementById('logout-btn').addEventListener('click', () => {
  authStore.logout();
});
```

---

## `component()` — Full Component Lifecycle

### What is `component()`?

`component()` creates a fully self-contained reactive component with its own state, computed properties, watchers, effects, DOM bindings, and lifecycle hooks. It groups everything related to one UI element into a single object.

```javascript
const counter = component({
  // Initial state
  state: {
    count: 0,
    step: 1
  },

  // Computed properties
  computed: {
    doubled() { return this.count * 2; },
    label() { return `Count: ${this.count}`; }
  },

  // Watchers
  watch: {
    count(newVal) {
      if (newVal >= 10) console.log('Reached 10!');
    }
  },

  // Effects
  effects: {
    updateDisplay() {
      document.getElementById('count').textContent = this.count;
      document.getElementById('doubled').textContent = this.doubled;
    }
  },

  // DOM bindings (auto-connected effects)
  bindings: {
    '#count': () => counter.count,
    '#doubled': () => counter.doubled,
    '#count-btn': { disabled: () => counter.count >= 10 }
  },

  // Actions (methods)
  actions: {
    increment(state) { state.count += state.step; },
    decrement(state) { state.count -= state.step; },
    reset(state) { state.count = 0; }
  },

  // Lifecycle
  mounted() {
    console.log('Counter component mounted!');
  },
  unmounted() {
    console.log('Counter component destroyed!');
  }
});

// Use the component
counter.increment();    // count → 1
counter.decrement();    // count → 0
counter.count = 5;      // Direct access still works

// Clean up when done
destroy(counter);       // Calls unmounted(), stops all effects
```

### When to Use `component()` vs Other Approaches

- **`state()` + `effect()`** — for simple, one-off reactive connections
- **`store()`** — for shared application state accessed by multiple parts
- **`component()`** — for self-contained UI widgets that manage their own lifecycle

`component()` is ideal when:
✅ A UI section has its own state, logic, and cleanup
✅ You want to encapsulate everything in one place
✅ The component will be mounted and unmounted dynamically
✅ You want automatic cleanup when the component is destroyed

---

## `collection()` — Reactive List

### What is `collection()`?

`collection()` creates a reactive state built around an array of items. It provides a clean API for adding, removing, updating, and clearing items.

```javascript
const todoList = collection([
  { id: 1, text: 'Buy groceries', done: false },
  { id: 2, text: 'Walk the dog', done: true }
]);

// items property holds the array
console.log(todoList.items.length);  // 2
console.log(todoList.items[0].text); // "Buy groceries"
```

### Collection Methods

```javascript
const tasks = collection([]);

// $add — add an item
tasks.add({ id: 1, text: 'First task', done: false });
tasks.add({ id: 2, text: 'Second task', done: false });

// $remove — remove by reference or predicate
tasks.remove(item => item.id === 1);   // Remove by condition
tasks.remove(specificItem);            // Remove by reference

// $update — update matching item
tasks.update(
  item => item.id === 2,               // Find condition
  { done: true }                        // Updates to apply
);

// $clear — remove all items
tasks.clear();

// Access the array directly
console.log(tasks.items.length);
console.log(tasks.items.map(t => t.text));
```

### Complete Collection Example

```javascript
const shoppingList = collection([]);

// Add items
shoppingList.add({ id: 1, name: 'Apples', quantity: 6, checked: false });
shoppingList.add({ id: 2, name: 'Bread', quantity: 1, checked: false });
shoppingList.add({ id: 3, name: 'Milk', quantity: 2, checked: false });

// Computed property: how many unchecked
computed(shoppingList, {
  remaining() {
    return this.items.filter(item => !item.checked).length;
  },
  allDone() {
    return this.items.length > 0 && this.items.every(item => item.checked);
  }
});

// Render the list
effect(() => {
  const listEl = document.getElementById('shopping-list');
  listEl.innerHTML = shoppingList.items.map(item => `
    <li class="${item.checked ? 'checked' : ''}">
      <input type="checkbox" data-id="${item.id}" ${item.checked ? 'checked' : ''}>
      ${item.name} (${item.quantity})
    </li>
  `).join('');
});

effect(() => {
  document.getElementById('remaining').textContent = `${shoppingList.remaining} items remaining`;
  document.getElementById('clear-btn').hidden = !shoppingList.allDone;
});

// Handle checkbox clicks
document.getElementById('shopping-list').addEventListener('change', (e) => {
  if (e.target.type === 'checkbox') {
    const id = parseInt(e.target.dataset.id);
    shoppingList.$update(item => item.id === id, { checked: e.target.checked });
  }
});

// Clear checked items
document.getElementById('clear-btn').addEventListener('click', () => {
  shoppingList.items = shoppingList.items.filter(item => !item.checked);
});
```

---

## `createState()` — State With Automatic DOM Bindings

### What is `createState()`?

`createState()` creates reactive state that is immediately connected to DOM elements through automatic bindings. It's a combination of `state()` and DOM binding setup in one call.

```javascript
// HTML:
// <span id="counter">0</span>
// <span id="status">offline</span>
// <button id="toggle-btn">Toggle</button>

const app = createState(
  // Initial values
  { count: 0, status: 'offline' },

  // Binding definitions: selector → state key
  {
    '#counter': 'count',
    '#status': 'status',
    '#toggle-btn': {
      textContent: () => app.status === 'online' ? 'Go Offline' : 'Go Online',
      className: () => `btn btn-${app.status}`
    }
  }
);

// Now changing state automatically updates DOM:
app.count = 5;          // #counter shows "5"
app.status = 'online';  // #status shows "online", button updates
```

### Binding Definition Formats

```javascript
const app = createState(
  { count: 0, name: 'Alice', isActive: true },
  {
    // Simple: maps element content to a state key
    '#count-display': 'count',
    '#name-display': 'name',

    // Computed: arrow function returning a value
    '#greeting': () => `Hello, ${app.name}!`,
    '#label': () => app.isActive ? 'Active' : 'Inactive',

    // Multiple properties for one element
    '#status-badge': {
      textContent: () => app.isActive ? 'Active' : 'Inactive',
      className: () => app.isActive ? 'badge badge-green' : 'badge badge-gray',
      'aria-label': () => `Status: ${app.isActive ? 'active' : 'inactive'}`
    }
  }
);
```

---

## Quick Comparison: Which Factory to Use?

```
Your data is...
│
├── A group of related values (user, cart, settings)
│   └── Use: state()
│
├── Values that need "loading / error / data" tracking
│   └── Use: async() or state() with manual loading pattern
│
├── Form input fields with validation
│   └── Use: form()
│
├── A list of items with add/remove/update
│   └── Use: collection()
│
├── Shared state with named operations
│   └── Use: store()
│
├── Self-contained UI widget with lifecycle
│   └── Use: component()
│
├── State that should auto-connect to DOM immediately
│   └── Use: createState()
│
└── A single primitive value
    └── Use: ref()
```

---

## Real-World Example: A Complete Feature

Here's a user profile feature using multiple factories together:

```javascript
// Shared auth store — who's logged in
const authStore = store(
  { user: null, token: null },
  {
    getters: {
      isLoggedIn() { return !!this.user; },
      userName() { return this.user?.name || 'Guest'; }
    },
    actions: {
      setUser(state, user, token) {
        batch(() => { state.user = user; state.token = token; });
      },
      logout(state) {
        batch(() => { state.user = null; state.token = null; });
      }
    }
  }
);

// Profile data
const profileData = async(null);

// Edit form
const editForm = form({ name: '', bio: '', email: '' });

// User's posts
const userPosts = collection([]);

// Connect everything with effects
effect(() => {
  document.getElementById('user-name').textContent = authStore.userName;
  document.getElementById('login-section').hidden = authStore.isLoggedIn;
  document.getElementById('profile-section').hidden = !authStore.isLoggedIn;
});

effect(() => {
  document.getElementById('loading').hidden = !profileData.loading;
  if (profileData.isSuccess) {
    document.getElementById('profile-view').hidden = false;
    document.getElementById('avatar').src = profileData.data.avatar;
  }
});

effect(() => {
  const postList = document.getElementById('post-list');
  postList.innerHTML = userPosts.items
    .map(post => `<article><h3>${post.title}</h3><p>${post.excerpt}</p></article>`)
    .join('');
});

// Load profile when logged in
watch(authStore, {
  async isLoggedIn(isLoggedIn) {
    if (isLoggedIn) {
      await execute(profileData, () => fetch(`/api/users/${authStore.user.id}`).then(r => r.json()));
      if (profileData.isSuccess) {
        userPosts.items = profileData.data.posts || [];

        // Pre-fill edit form
        batch(() => {
          editForm.values.name = profileData.data.name;
          editForm.values.bio = profileData.data.bio;
          editForm.values.email = profileData.data.email;
        });
      }
    }
  }
});
```

---

## Summary

The reactive system provides purpose-built factories for common patterns:

| Factory | Creates | Built-in Features |
|---------|---------|------------------|
| `state(obj)` | Plain reactive object | Proxy, deep reactivity |
| `ref(value)` | Single-value reactive | `.value` accessor |
| `form(values)` | Form state | `values`, `errors`, `touched`, `isValid`, `isDirty` |
| `async(initial)` | Async operation state | `data`, `loading`, `error`, `isSuccess`, `isError` |
| `store(state, opts)` | State with actions | `getters` (computed) + `actions` (methods) |
| `component(config)` | Full UI component | state + computed + watch + effects + lifecycle |
| `collection(items)` | Reactive list | `$add`, `$remove`, `$update`, `$clear` |
| `createState(state, bindings)` | State with DOM bindings | Automatic DOM sync |

**The principle:** All factories are built on `state()`. They're conveniences, not replacements. You can always use `state()` + `computed()` + `effect()` + `watch()` to do everything yourself — factories just make common patterns faster and more consistent.

---

## What's Next?

Now that you know all the state factories, let's look at advanced reactive patterns — storage integration, cleanup strategies, error handling, and architectural best practices.

Continue to: [08 — Advanced Patterns](./08_advanced_patterns.md)