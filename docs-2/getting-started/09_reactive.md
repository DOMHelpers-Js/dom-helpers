[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Reactive

## What Is Reactive

The reactive module is a self-contained system for managing application state. It lets you create JavaScript objects whose property changes are automatically tracked. When a tracked property changes, any code that depends on it — effects, computed values, DOM bindings — updates automatically without any manual calls.

Simply put: instead of writing code that says "update the UI every time I change this value," you write code that says "this UI element displays this value" — and the reactive system keeps them in sync.

---

## The Recommended Way to Use Reactive

The reactive module exposes all its functions on the `ReactiveUtils` namespace. However, the recommended approach throughout DOM Helpers is to use the **global shortcut functions** — the same functions available without any prefix.

Instead of:

```javascript
// Namespace form — works, but verbose
const app = ReactiveUtils.state({ count: 0 });
ReactiveUtils.effect(() => console.log(app.count));
ReactiveUtils.batch(() => { app.count = 1; });
```

Use the shortcut form:

```javascript
// Shortcut form — recommended
const app = state({ count: 0 });
effect(() => console.log(app.count));
batch(() => { app.count = 1; });
```

Both are identical in behavior. The shortcut form is cleaner and is what all documentation examples use. Use it consistently.

---

## The Core Functions

### `state()` — Create Reactive State

`state()` wraps a plain JavaScript object and makes it reactive. Any property you read inside an `effect()` is automatically tracked. When that property changes, the effect re-runs.

```javascript
// Create reactive state
const user = state({
  name: 'Alice',
  email: 'alice@example.com',
  isLoggedIn: false,
  role: 'viewer'
});

// Change properties normally — no special setter needed
user.name = 'Bob';
user.isLoggedIn = true;
```

The object you get back looks and works like a normal JavaScript object. You read and write properties the same way. The reactivity happens behind the scenes.

---

### `effect()` — React to State Changes

`effect()` takes a function and runs it immediately. It also tracks every reactive property the function reads. When any of those properties change, the function runs again automatically.

```javascript
const counter = state({ value: 0 });

// This runs immediately, then again every time counter.value changes
effect(() => {
  Elements.display.textContent = counter.value;
  Elements.incrementBtn.disabled = counter.value >= 10;
});

// Somewhere else in your code:
counter.value++;  // → the effect runs automatically, DOM updates
counter.value++;  // → runs again
```

Effects are the primary way to connect reactive state to DOM updates.

```javascript
// Multiple state values in one effect — runs when any of them change
const app = state({ count: 0, user: null, loading: false });

effect(() => {
  if (app.loading) {
    Elements.panel.update({ textContent: 'Loading...', className: 'panel loading' });
    return;
  }

  if (!app.user) {
    Elements.panel.update({ textContent: 'Not signed in', className: 'panel empty' });
    return;
  }

  Elements.panel.update({
    textContent: 'Welcome, ' + app.user.name,
    className: 'panel ready'
  });
});
```

---

### `computed()` — Derived Values

`computed()` creates a value that is derived from reactive state and updates automatically when its dependencies change.

```javascript
const cart = state({ items: [], taxRate: 0.08 });

const totals = computed(cart, {
  subtotal: function() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  },
  tax: function() {
    return this.subtotal * this.taxRate;
  },
  total: function() {
    return this.subtotal + this.tax;
  }
});

// totals.subtotal, totals.tax, totals.total update automatically
// when cart.items or cart.taxRate changes

effect(() => {
  Elements.subtotalDisplay.textContent = '$' + totals.subtotal.toFixed(2);
  Elements.taxDisplay.textContent      = '$' + totals.tax.toFixed(2);
  Elements.totalDisplay.textContent    = '$' + totals.total.toFixed(2);
});
```

---

### `watch()` — Observe a Specific Property

`watch()` calls a callback when a specific property on a reactive object changes. Unlike `effect()`, it does not run immediately — it only calls the callback when the value actually changes.

```javascript
const settings = state({ theme: 'light', language: 'en', fontSize: 16 });

// Watch a single property — callback receives new and old value
watch(settings, 'theme', (newTheme, oldTheme) => {
  Elements.body.update({ className: 'theme-' + newTheme });
  StorageUtils.save('theme', newTheme);
  console.log('Theme changed from', oldTheme, 'to', newTheme);
});

watch(settings, 'fontSize', (newSize) => {
  Elements.body.update({ style: { fontSize: newSize + 'px' } });
  StorageUtils.save('fontSize', newSize);
});

// Trigger the watchers
settings.theme = 'dark';     // → watch callback runs
settings.fontSize = 18;      // → watch callback runs
```

Use `watch()` when you want to respond to a specific property change — especially for side effects like saving to storage or logging — without the full re-evaluation that `effect()` performs.

---

### `batch()` — Group Multiple Changes

`batch()` groups several state changes so that effects and watchers run only once after all the changes are applied, instead of once per individual change.

```javascript
const form = state({ name: '', email: '', phone: '', role: 'viewer' });

// Without batch — effects run 4 times
form.name  = '';
form.email = '';
form.phone = '';
form.role  = 'viewer';

// With batch — effects run once, after all four changes
batch(() => {
  form.name  = '';
  form.email = '';
  form.phone = '';
  form.role  = 'viewer';
});
```

Use `batch()` whenever you reset multiple properties at once, or when a single logical operation modifies several state values.

```javascript
function resetDashboard() {
  batch(() => {
    app.user = null;
    app.count = 0;
    app.notifications = [];
    app.loading = false;
    app.error = null;
  });
}
```

---

### `ref()` — A Single Reactive Value

`ref()` creates a reactive container for a single primitive value. Access and set it through its `.value` property.

```javascript
// Create a reactive single value
const count = ref(0);
const theme = ref('light');
const isOpen = ref(false);

// Read it
console.log(count.value);   // 0
console.log(theme.value);   // 'light'

// Change it — triggers any effects that read .value
count.value = 5;
theme.value = 'dark';
isOpen.value = !isOpen.value;

// Use in an effect
effect(() => {
  Elements.countDisplay.textContent = count.value;
});
```

Use `ref()` when your state is a single value rather than an object with multiple properties.

---

### `refs()` — Multiple Reactive Values at Once

`refs()` creates several reactive single-value containers from one object definition.

```javascript
// Create multiple refs at once
const { count, theme, isOpen, userName } = refs({
  count:    0,
  theme:    'light',
  isOpen:   false,
  userName: ''
});

// Each is an independent ref with its own .value
count.value   = 1;
theme.value   = 'dark';
isOpen.value  = true;
userName.value = 'Alice';

effect(() => {
  Elements.greeting.textContent = 'Hello, ' + userName.value;
});
```

---

## Using Reactive with DOM Helpers Core

Reactive state and DOM Helpers core work naturally together. Effects read reactive state and use the core to apply DOM changes:

```javascript
const app = state({
  user: null,
  notifications: [],
  loading: false
});

// Effect connects state to DOM via the core
effect(() => {
  if (app.loading) {
    Elements.update({
      mainContent:   { style: { opacity: '0.5' } },
      loadingSpinner: { style: { display: 'block' } }
    });
    return;
  }

  Elements.update({
    mainContent:    { style: { opacity: '1' } },
    loadingSpinner: { style: { display: 'none' } },
    notificationCount: { textContent: app.notifications.length }
  });

  if (app.user) {
    Elements.update({
      userName:  { textContent: app.user.name },
      userAvatar: { setAttribute: { src: app.user.avatar } },
      loginArea:  { style: { display: 'none' } },
      userArea:   { style: { display: 'block' } }
    });
  }
});

// State changes anywhere trigger the effect
async function loadUser() {
  app.loading = true;
  const data = await fetch('/api/user').then(r => r.json());
  batch(() => {
    app.user = data.user;
    app.notifications = data.notifications;
    app.loading = false;
  });
}
```

---

## Using Reactive with Conditions

Reactive state and Conditions work together particularly well. Reactive state provides the value that Conditions watches, and Conditions maps that value to DOM configurations:

```javascript
// Reactive state holds the current status
const ui = state({ status: 'idle' });

// Conditions declares what each status looks like in the DOM
Conditions.whenState(
  () => ui.status,
  {
    'idle': {
      '#submitBtn':   { textContent: 'Submit', disabled: false },
      '#spinner':     { style: { display: 'none' } },
      '#successMsg':  { style: { display: 'none' } },
      '#errorMsg':    { style: { display: 'none' } }
    },
    'loading': {
      '#submitBtn':   { textContent: 'Submitting...', disabled: true },
      '#spinner':     { style: { display: 'block' } },
      '#successMsg':  { style: { display: 'none' } },
      '#errorMsg':    { style: { display: 'none' } }
    },
    'success': {
      '#submitBtn':   { textContent: 'Submit Again', disabled: false },
      '#spinner':     { style: { display: 'none' } },
      '#successMsg':  { style: { display: 'block' } },
      '#errorMsg':    { style: { display: 'none' } }
    },
    'error': {
      '#submitBtn':   { textContent: 'Try Again', disabled: false },
      '#spinner':     { style: { display: 'none' } },
      '#successMsg':  { style: { display: 'none' } },
      '#errorMsg':    { style: { display: 'block' } }
    }
  }
);

// Event handler only changes state — Conditions handles the DOM
Id('myForm').update({
  addEventListener: {
    submit: async (e) => {
      e.preventDefault();
      ui.status = 'loading';
      try {
        await submitForm();
        ui.status = 'success';
      } catch {
        ui.status = 'error';
      }
    }
  }
});
```

---

## Using Reactive with Storage

Reactive state and storage connect cleanly: storage loads initial state, reactive state holds it, and watchers persist changes:

```javascript
// Load saved preferences into reactive state
const prefs = state({
  theme:    StorageUtils.load('theme', 'light'),
  fontSize: StorageUtils.load('fontSize', 16),
  language: StorageUtils.load('language', 'en')
});

// Apply initial state to DOM
effect(() => {
  Elements.body.update({
    className: 'theme-' + prefs.theme,
    style: { fontSize: prefs.fontSize + 'px' }
  });
});

// Persist changes automatically
watch(prefs, 'theme',    (v) => StorageUtils.save('theme', v));
watch(prefs, 'fontSize', (v) => StorageUtils.save('fontSize', v));
watch(prefs, 'language', (v) => StorageUtils.save('language', v));

// User changes a preference — DOM updates and storage saves in one step
Id('themeToggle').update({
  addEventListener: {
    click: () => {
      prefs.theme = prefs.theme === 'light' ? 'dark' : 'light';
      // effect re-runs → DOM updates
      // watch callback runs → storage saves
    }
  }
});
```

---

## Available Shortcut Functions

All of the following are available globally — no prefix, no import:

| Function | What it does |
|---|---|
| `state(object)` | Create a reactive object |
| `effect(fn)` | Run a function now and re-run it when its reactive dependencies change |
| `computed(state, { key: fn })` | Derive values from state that update automatically |
| `watch(state, 'key', fn)` | Call a function when a specific property changes |
| `batch(fn)` | Group multiple state changes into one update cycle |
| `ref(value)` | Create a reactive container for a single value |
| `refs({ key: value })` | Create multiple reactive single-value containers at once |

All of these are equivalent to the same function on `ReactiveUtils`. The shortcut form is the recommended way to use them throughout your code.

---

## Key Rules for Using Reactive

**Rule 1 — Always use the shortcut form.**
Write `state()`, `effect()`, `computed()` — not `ReactiveUtils.state()`, `ReactiveUtils.effect()`. The shortcut form is the standard across all DOM Helpers documentation and examples.

**Rule 2 — Read reactive properties inside effects.**
An effect only tracks the properties it reads during its execution. If you read `app.count` inside an effect, that effect will re-run when `app.count` changes. If you do not read it inside the effect, it will not trigger.

**Rule 3 — Use `batch()` for multiple simultaneous changes.**
If you change five properties in a row, you get five effect runs. Wrap them in `batch()` to get one run. Use batch for any reset, initialization, or multi-property update.

**Rule 4 — Use `watch()` for side effects on specific properties.**
When you want to save to storage, log, or call an API when one specific property changes — use `watch()`. When you want to update the DOM based on several properties — use `effect()`.

**Rule 5 — Connect reactive state to the DOM through effects or Conditions.**
Reactive state does not touch the DOM directly. Effects read state and use the core (`Elements.update()`, `Id().update()`) to apply changes. Or use Conditions to declare the mapping once and have it apply automatically.

---

## What's Next

The reactive module has deep documentation covering every feature:

- **[Reactive State](../04_reactive/31_Reactive_State/01_what-is-reactive-state.md)** — `state()`, effects, computed, watch in depth
- **[Reactive Utils Shortcut](../04_reactive/39_Reactive_Utils_Shortcut/01_what-is-the-standalone-api.md)** — the full shortcut API and all available global functions
- **[Reactive Guide](../04_reactive/40_Reactive_Guide/01_reactive_introduction.md)** — a complete walkthrough from basics to advanced patterns
- **[Reactive with DOM Helpers Core](../04_reactive/40_Reactive_Guide/11_reactive_with_dom_helpers_core.md)** — combining reactive state with element access and updates
- **[Reactive with Conditions](../04_reactive/40_Reactive_Guide/13_reactive_with_conditions.md)** — state-driven rendering at its most structured

Or continue with the learning path:

- **[What to Learn Next](./08_whats-next.md)** — the full guided path through all documentation