[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Core Functions — Deep Dive

## The core group

These functions form the foundation of the reactive system. They are **always available** after loading the Standalone API — no optional modules needed:

| Global function | What it does | Namespace equivalent |
|----------------|--------------|---------------------|
| `state()` | Create reactive state | `ReactiveUtils.state()` |
| `createState()` | Create state with DOM bindings | `ReactiveUtils.createState()` |
| `effect()` | Create a reactive side effect | `ReactiveUtils.effect()` |
| `batch()` | Group multiple updates together | `ReactiveUtils.batch()` |
| `computed()` | Add computed properties to state | `ReactiveUtils.computed()` |
| `watch()` | Watch specific state properties | `ReactiveUtils.watch()` |
| `effects()` | Create multiple effects at once | `ReactiveUtils.effects()` |
| `ref()` | Create a single reactive reference | `ReactiveUtils.ref()` |
| `refs()` | Create multiple refs at once | `ReactiveUtils.refs()` |
| `collection()` | Create a reactive collection | `ReactiveUtils.collection()` |
| `list()` | Alias for `collection()` | `ReactiveUtils.list()` |
| `patchArray()` | Manually patch array for reactivity | `ReactiveUtils.patchArray()` |
| `isReactive()` | Check if a value is reactive | `ReactiveUtils.isReactive()` |
| `toRaw()` | Get the raw (non-reactive) value | `ReactiveUtils.toRaw()` |
| `notify()` | Manually trigger a state update | `ReactiveUtils.notify()` |
| `pause()` | Pause all reactivity | `ReactiveUtils.pause()` |
| `resume()` | Resume reactivity | `ReactiveUtils.resume()` |
| `untrack()` | Run a function without tracking | `ReactiveUtils.untrack()` |

Let's go through each one.

---

## `state()` — Create reactive state

### What it does

Creates a reactive object. When any property of this object changes, any `effect()` or `watch()` that reads it automatically re-runs.

### Syntax

```javascript
const myState = state(initialValues);
```

### Example

```javascript
const app = state({
  userName: 'Alice',
  count: 0,
  isLoggedIn: true
});

// Read values normally:
console.log(app.userName);  // 'Alice'

// Change values normally:
app.count = 5;              // triggers any effects watching count
```

### Before vs after

```
Without Standalone API:
  const app = ReactiveUtils.state({ count: 0 });

With Standalone API:
  const app = state({ count: 0 });
```

---

## `createState()` — Create state with DOM bindings

### What it does

Creates reactive state AND automatically binds it to DOM elements. When state changes, the DOM updates automatically — no manual effect needed.

### Syntax

```javascript
const myState = createState(initialValues, bindings);
```

### Example

```javascript
// HTML: <span id="counter">0</span>

const counter = createState(
  { count: 0 },
  { '#counter': 'count' }  // bind #counter to the count property
);

counter.count = 5;
// DOM automatically shows: 5
```

### When to use

Use `createState()` when you want automatic DOM updates without writing a manual `effect()`.
Use `state()` when you need full control over what happens on changes.

---

## `effect()` — Create a reactive side effect

### What it does

Runs a function immediately, and then re-runs it automatically whenever any reactive state it reads changes.

### Syntax

```javascript
effect(() => {
  // This runs now, and again whenever state it reads changes
});
```

### Example

```javascript
const user = state({ name: 'Alice', age: 25 });

effect(() => {
  // Runs immediately (prints "Alice is 25")
  // Runs again whenever user.name or user.age changes
  console.log(user.name + ' is ' + user.age);
});

user.name = 'Bob';   // Effect re-runs: "Bob is 25"
user.age = 30;       // Effect re-runs: "Bob is 30"
```

### The flow

```
1. effect() runs the function immediately
   ↓
2. While running, it tracks which reactive properties were read
   ↓
3. Any time those properties change, the function runs again
   ↓
4. New dependencies are tracked on the re-run
```

---

## `batch()` — Group multiple updates together

### What it does

Groups multiple state changes into a single update. Without `batch()`, each change triggers effects independently. With `batch()`, effects only run once after all changes are done.

### Syntax

```javascript
batch(() => {
  // All changes here happen as one atomic update
});
```

### Why it matters

```javascript
const form = state({ name: '', email: '', age: 0 });

effect(() => {
  console.log('Form changed!');
});

// WITHOUT batch: effect runs 3 times
form.name = 'Alice';    // Effect runs → "Form changed!"
form.email = 'a@b.com'; // Effect runs → "Form changed!"
form.age = 25;          // Effect runs → "Form changed!"

// WITH batch: effect runs only ONCE
batch(() => {
  form.name = 'Alice';
  form.email = 'a@b.com';
  form.age = 25;
});
// Effect runs once → "Form changed!"
```

### The mental model

Think of `batch()` as hitting "pause" on notifications, making all your changes, then hitting "play" — everyone gets one update instead of three.

---

## `computed()` — Add computed properties to state

### What it does

Adds derived (calculated) properties to a state object. Computed properties automatically update when the values they depend on change.

### Syntax

```javascript
computed(myState, {
  propertyName: function() {
    return /* calculated value using this.otherProperty */;
  }
});
```

### Example

```javascript
const cart = state({
  price: 10,
  quantity: 3
});

computed(cart, {
  total: function() {
    return this.price * this.quantity;
  },
  summary: function() {
    return this.quantity + ' items for $' + this.total;
  }
});

console.log(cart.total);    // 30
console.log(cart.summary);  // "3 items for $30"

cart.quantity = 5;
console.log(cart.total);    // 50 (automatically updated)
console.log(cart.summary);  // "5 items for $50"
```

---

## `watch()` — Watch specific state properties

### What it does

Watches specific properties on a state object and calls a callback when they change. Unlike `effect()`, `watch()` targets specific properties and gives you the old value alongside the new one.

### Syntax

```javascript
watch(myState, {
  propertyName: (newValue, oldValue) => {
    // Called when propertyName changes
  }
});
```

### Example

```javascript
const settings = state({
  theme: 'light',
  language: 'en',
  fontSize: 14
});

watch(settings, {
  theme: (newTheme, oldTheme) => {
    console.log('Theme changed from', oldTheme, 'to', newTheme);
    document.body.className = 'theme-' + newTheme;
  },
  fontSize: (newSize) => {
    document.body.style.fontSize = newSize + 'px';
  }
});

settings.theme = 'dark';
// Console: "Theme changed from light to dark"
// Body class: "theme-dark"

settings.fontSize = 16;
// Body font-size: 16px
```

### `watch()` vs `effect()`

| | `effect()` | `watch()` |
|--|-----------|-----------|
| **Targets** | Any reactive value read inside | Specific named properties |
| **Old value** | ❌ Not available | ✅ Provided as second argument |
| **Runs immediately** | ✅ Yes | ❌ Only on change |
| **Best for** | DOM updates, side effects | Reacting to specific property changes |

---

## `effects()` — Create multiple effects at once

### What it does

Creates several named effects in one call. Useful for organizing related side effects together.

### Syntax

```javascript
effects({
  effectName: () => {
    // side effect code
  },
  anotherEffect: () => {
    // more side effect code
  }
});
```

### Example

```javascript
const dashboard = state({
  user: null,
  stats: { views: 0, clicks: 0 }
});

effects({
  updateTitle: () => {
    document.title = dashboard.user
      ? 'Dashboard - ' + dashboard.user.name
      : 'Dashboard';
  },
  updateStats: () => {
    document.getElementById('views').textContent = dashboard.stats.views;
    document.getElementById('clicks').textContent = dashboard.stats.clicks;
  }
});
```

---

## `ref()` — Create a single reactive reference

### What it does

Creates a reactive container for a single value. Access the value with `.value`.

### Syntax

```javascript
const myRef = ref(initialValue);
myRef.value;         // read
myRef.value = newValue;  // write
```

### Example

```javascript
const count = ref(0);

effect(() => {
  console.log('Count:', count.value);
});

count.value = 5;   // Effect re-runs: "Count: 5"
count.value++;     // Effect re-runs: "Count: 6"
```

### When to use `ref()` vs `state()`

```
ref()   → best for a single primitive value (number, string, boolean)
state() → best for an object with multiple properties
```

---

## `refs()` — Create multiple refs at once

### What it does

Creates multiple reactive references in a single call. Returns an object where each key maps to a ref.

### Syntax

```javascript
const { ref1, ref2, ref3 } = refs({
  ref1: initialValue1,
  ref2: initialValue2,
  ref3: initialValue3
});
```

### Example

```javascript
const { username, email, isLoggedIn } = refs({
  username: '',
  email: '',
  isLoggedIn: false
});

effect(() => {
  if (isLoggedIn.value) {
    console.log('Logged in as:', username.value);
  }
});

username.value = 'Alice';
email.value = 'alice@example.com';
isLoggedIn.value = true;
// Effect runs: "Logged in as: Alice"
```

---

## `collection()` and `list()` — Reactive collections

### What they do

Create a reactive array-like collection with helper methods. `list()` is an alias for `collection()`.

### Syntax

```javascript
const items = collection(initialArray);
// OR
const items = list(initialArray);
```

### Example

```javascript
const todos = collection([
  { id: 1, text: 'Buy groceries', done: false },
  { id: 2, text: 'Read a book', done: false }
]);

effect(() => {
  const count = todos.items.filter(t => !t.done).length;
  document.getElementById('remaining').textContent =
    count + ' tasks remaining';
});

todos.add({ id: 3, text: 'Go for a walk', done: false });
// Effect re-runs with updated count
```

---

## `patchArray()` — Manually patch array reactivity

### What it does

When you have a regular array inside reactive state, its mutating methods (like `.push()`, `.splice()`) won't automatically trigger effects. `patchArray()` fixes this by patching those methods to notify the reactive system.

### Syntax

```javascript
patchArray(myState, 'propertyName');
```

### Example

```javascript
const state = state({ items: ['a', 'b', 'c'] });

// Without patchArray: push() doesn't trigger effects
state.items.push('d');  // ❌ Effect may not re-run

// With patchArray:
patchArray(state, 'items');
state.items.push('d');  // ✅ Effect re-runs
```

---

## Utility functions

### `isReactive()` — Check if a value is reactive

```javascript
const s = state({ count: 0 });
const plain = { count: 0 };

console.log(isReactive(s));     // true
console.log(isReactive(plain)); // false
```

### `toRaw()` — Get the non-reactive value

Returns the plain object behind the reactive proxy. Useful when you need to pass data somewhere without reactive tracking.

```javascript
const s = state({ count: 0, name: 'Alice' });

const raw = toRaw(s);
console.log(raw);  // { count: 0, name: 'Alice' } (plain object)

// Modifying raw does NOT trigger effects
raw.count = 99;    // No effects run
```

### `notify()` — Manually trigger an update

Forces effects to re-run for a specific property, even if its value didn't change.

```javascript
const s = state({ count: 0 });

effect(() => {
  console.log('Count:', s.count);
});

// Manually trigger, even though count didn't change:
notify(s, 'count');   // Effect re-runs: "Count: 0"
```

### `pause()` and `resume()` — Control reactivity globally

```javascript
pause();  // All effects stop running

s.count = 10;  // No effects triggered
s.count = 20;  // No effects triggered

resume(true);  // Resume + flush any pending updates
// Effects catch up with the latest values
```

### `untrack()` — Read without tracking

Reads reactive values inside a function without registering them as dependencies.

```javascript
const s = state({ count: 0, debug: false });

effect(() => {
  // Reading s.count IS tracked → effect re-runs when count changes
  const value = s.count;

  // Reading s.debug is NOT tracked → effect does NOT re-run when debug changes
  const shouldLog = untrack(() => s.debug);

  if (shouldLog) console.log('Count:', value);
});
```

---

## A complete example using core functions

Here's everything working together:

```javascript
// State
const store = state({
  items: [],
  filter: 'all',
  searchText: ''
});

// Computed
computed(store, {
  filteredItems: function() {
    return this.items.filter(item => {
      const matchesFilter = this.filter === 'all' || item.category === this.filter;
      const matchesSearch = item.name.includes(this.searchText);
      return matchesFilter && matchesSearch;
    });
  },
  itemCount: function() {
    return this.filteredItems.length;
  }
});

// Effects
effects({
  renderList: () => {
    const list = document.getElementById('itemList');
    list.innerHTML = store.filteredItems
      .map(item => `<li>${item.name}</li>`)
      .join('');
  },
  updateCount: () => {
    document.getElementById('count').textContent =
      store.itemCount + ' items';
  }
});

// Watch a specific property
watch(store, {
  filter: (newFilter) => {
    console.log('Filter changed to:', newFilter);
  }
});

// Update state efficiently
function addItem(item) {
  batch(() => {
    store.items.push(item);
    store.filter = 'all';
    store.searchText = '';
  });
}
```

---

## Key takeaways

1. **`state()`** — creates a reactive object; all properties are tracked automatically
2. **`effect()`** — runs immediately and re-runs when tracked state changes
3. **`batch()`** — groups changes to run effects only once, not once per change
4. **`computed()`** — adds derived properties that recalculate automatically
5. **`watch()`** — targets specific properties and gives you old + new values
6. **`ref()`/`refs()`** — single or multiple reactive values (use `.value` to access)
7. **`collection()`/`list()`** — reactive arrays with helper methods
8. **`toRaw()`/`untrack()`** — escape hatches to work outside the reactive system
9. **`pause()`/`resume()`** — temporarily freeze and unfreeze all reactivity

---

## What's next?

Now let's look at the **advanced functions** that come from optional modules:
- `safeEffect()` and `safeWatch()` — effects with error boundaries
- `asyncEffect()` — async effects with automatic cancellation
- `asyncState()` — race-condition-safe async data loading
- `ErrorBoundary` — structured error handling for reactive code
- `DevTools` — debugging and monitoring tools
- `collector()` and `scope()` — managing cleanup

Let's continue! 🚀