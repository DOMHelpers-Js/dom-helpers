# Understanding Reactive Utility Functions - A Beginner's Guide

## What are Reactive Utility Functions?

The Reactive library provides several **utility functions** for advanced reactive operations. These functions give you fine-grained control over reactivity, allowing you to pause/resume updates, check reactive status, access raw values, manually trigger updates, and more.

Think of them as **power tools** for the reactive system - while most of the time the automatic reactivity works perfectly, these utilities let you take manual control when needed.

---

## Overview of Utility Functions

### Batch Operations
- **`pause()`** - Pause reactive updates
- **`resume(flush)`** - Resume reactive updates
- **`untrack(fn)`** - Run function without tracking dependencies

### Inspection & Conversion
- **`isReactive(value)`** - Check if a value is reactive
- **`toRaw(value)`** - Get the raw non-reactive value

### Manual Control
- **`notify(state, key)`** - Manually trigger reactive updates
- **`updateAll(state, updates)`** - Update state and DOM together

---

## `pause()` and `resume()`

### What are they?

`pause()` and `resume()` give you manual control over when reactive updates happen. `pause()` stops effects from running, and `resume()` starts them again.

### Syntax

```js
// Using the shortcut
pause()
resume(flush)

// Using the full namespace
ReactiveUtils.pause()
ReactiveUtils.resume(flush)
```

**Parameters:**
- `flush` (Boolean, optional): If `true`, immediately runs all pending effects when resuming

**Returns:**
- `pause()`: Nothing
- `resume()`: Nothing

### When to Use

Use `pause()` and `resume()` when you need manual control over update timing:

```js
const app = state({
  count: 0,
  step: 1,
  total: 0
});

effect(() => {
  console.log('Effect:', app.count, app.step, app.total);
});

// Pause reactivity
pause();

// Make changes - effects don't run
app.count = 10;
app.step = 5;
app.total = 50;

// Resume and flush effects
resume(true);
// Effect runs once: "Effect: 10 5 50"
```

### Use Cases

**Use Case 1: Manual Update Control**

```js
const data = state({ items: [] });

effect(() => {
  renderList(data.items);
});

function loadLargeDataset(items) {
  pause();

  // Add items without triggering renders
  items.forEach(item => {
    data.items.push(item);
  });

  // Resume and render once
  resume(true);
}
```

**Use Case 2: Complex Calculations**

```js
const calc = state({
  a: 0,
  b: 0,
  c: 0,
  result: 0
});

effect(() => {
  updateResultDisplay(calc.result);
});

function calculate(values) {
  pause();

  calc.a = values.a;
  calc.b = values.b;
  calc.c = values.c;
  calc.result = (calc.a + calc.b) * calc.c;

  resume(true); // Display updates once
}
```

**Common Pitfalls:**

```js
// WRONG - forget to resume
pause();
state.count = 10;
// Effects stuck paused!

// RIGHT - always resume
pause();
try {
  state.count = 10;
} finally {
  resume(true);
}
```

---

## `untrack()`

### What is it?

`untrack()` runs a function without tracking any reactive dependencies. State accessed inside `untrack()` won't trigger the current effect to re-run when it changes.

### Syntax

```js
// Using the shortcut
const result = untrack(fn)

// Using the full namespace
const result = ReactiveUtils.untrack(fn)
```

**Parameters:**
- `fn` (Function): Function to run without dependency tracking

**Returns:**
- The return value of the function

### When to Use

Use `untrack()` to read state without creating dependencies:

```js
const user = state({
  name: 'John',
  email: 'john@example.com',
  lastLogin: new Date()
});

effect(() => {
  // This effect only re-runs when name or email change
  console.log('User:', user.name, user.email);

  // Read lastLogin without making it a dependency
  const lastLogin = untrack(() => user.lastLogin);
  console.log('Last login was:', lastLogin);
  // Changes to lastLogin won't trigger this effect
});

user.name = 'Jane';      // Effect runs
user.email = 'jane@...'; // Effect runs
user.lastLogin = new Date(); // Effect does NOT run
```

### Use Cases

**Use Case 1: Logging Without Dependencies**

```js
const data = state({
  count: 0,
  debug: false
});

effect(() => {
  console.log('Count changed:', data.count);

  // Log debug info without tracking it
  if (untrack(() => data.debug)) {
    console.log('Debug mode enabled');
    console.log('Stack trace:', new Error().stack);
  }
});

data.count = 5;    // Effect runs
data.debug = true; // Effect does NOT run
```

**Use Case 2: Reading Configuration**

```js
const app = state({
  items: [],
  config: {
    itemsPerPage: 10,
    sortOrder: 'asc'
  }
});

effect(() => {
  // Effect only depends on items
  const items = app.items;

  // Read config without dependency
  const config = untrack(() => app.config);

  renderItems(items, config);
});

app.items.push({ id: 1 }); // Effect runs
app.config.itemsPerPage = 20; // Effect does NOT run
```

**Use Case 3: Preventing Infinite Loops**

```js
const counter = state({ count: 0, history: [] });

effect(() => {
  // Track count changes
  console.log('Count:', counter.count);

  // Update history without creating dependency
  untrack(() => {
    counter.history.push(counter.count);
  });
});

counter.count = 5; // Effect runs, history updated
// No infinite loop!
```

---

## `isReactive()`

### What is it?

`isReactive()` checks if a value is a reactive state object.

### Syntax

```js
// Using the shortcut
const result = isReactive(value)

// Using the full namespace
const result = ReactiveUtils.isReactive(value)
```

**Parameters:**
- `value` (Any): Value to check

**Returns:**
- `true` if the value is reactive, `false` otherwise

### When to Use

Use `isReactive()` to check if you're working with reactive state:

```js
const reactive = state({ count: 0 });
const plain = { count: 0 };

console.log(isReactive(reactive)); // true
console.log(isReactive(plain));    // false
console.log(isReactive(null));     // false
console.log(isReactive(123));      // false
```

### Use Cases

**Use Case 1: Type Guards**

```js
function processData(data) {
  if (isReactive(data)) {
    // It's reactive - can use reactive methods
    data.$computed('total', function() {
      return this.items.reduce((sum, item) => sum + item.value, 0);
    });
  } else {
    // Plain object - convert to reactive
    data = state(data);
  }

  return data;
}
```

**Use Case 2: Conditional Logic**

```js
function updateValue(obj, key, value) {
  if (isReactive(obj)) {
    // Use reactive assignment
    obj[key] = value;
  } else {
    // Use plain assignment
    Object.assign(obj, { [key]: value });
  }
}
```

**Use Case 3: Debugging**

```js
function debugState(label, value) {
  console.log(`[${label}]`, {
    isReactive: isReactive(value),
    value: isReactive(value) ? toRaw(value) : value
  });
}

debugState('User State', userState);
// [User State] { isReactive: true, value: { name: 'John', ... } }
```

---

## `toRaw()`

### What is it?

`toRaw()` extracts the raw, non-reactive value from a reactive state object. This is useful when you need to serialize, compare, or pass data to APIs that don't expect reactive proxies.

### Syntax

```js
// Using the shortcut
const rawValue = toRaw(reactiveValue)

// Using the full namespace
const rawValue = ReactiveUtils.toRaw(reactiveValue)
```

**Parameters:**
- `value` (Any): Value to extract raw data from

**Returns:**
- The raw, non-reactive value (or the original value if not reactive)

### When to Use

Use `toRaw()` when you need the plain JavaScript value:

```js
const user = state({
  name: 'John',
  email: 'john@example.com'
});

// Get raw value
const rawUser = toRaw(user);

console.log(isReactive(user));    // true
console.log(isReactive(rawUser)); // false

// rawUser is a plain object
console.log(rawUser); // { name: 'John', email: 'john@example.com' }
```

### Use Cases

**Use Case 1: API Requests**

```js
const form = state({
  username: '',
  email: '',
  password: ''
});

async function submitForm() {
  // Get raw data for API
  const rawData = toRaw(form);

  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rawData) // Plain object, not proxy
  });
}
```

**Use Case 2: localStorage**

```js
const settings = state({
  theme: 'light',
  language: 'en',
  notifications: true
});

function saveSettings() {
  const rawSettings = toRaw(settings);
  localStorage.setItem('settings', JSON.stringify(rawSettings));
}

function loadSettings() {
  const saved = localStorage.getItem('settings');
  if (saved) {
    const rawSettings = JSON.parse(saved);
    Object.assign(settings, rawSettings);
  }
}
```

**Use Case 3: Deep Comparisons**

```js
const state1 = state({ name: 'John', age: 25 });
const state2 = state({ name: 'John', age: 25 });

// Proxies are different objects
console.log(state1 === state2); // false

// Compare raw values
console.log(
  JSON.stringify(toRaw(state1)) === JSON.stringify(toRaw(state2))
); // true
```

**Use Case 4: Cloning**

```js
const original = state({
  items: [1, 2, 3],
  nested: { value: 42 }
});

// Deep clone the raw data
const cloned = state(JSON.parse(JSON.stringify(toRaw(original))));

// Independent copies
cloned.items.push(4);
console.log(original.items); // [1, 2, 3]
console.log(cloned.items);   // [1, 2, 3, 4]
```

---

## `notify()`

### What is it?

`notify()` manually triggers reactive updates for a specific property or all properties of a reactive state. This is useful when you modify nested objects/arrays that reactivity can't detect automatically.

### Syntax

```js
// Using the shortcut
notify(state, key)
notify(state) // Notify all

// Using the full namespace
ReactiveUtils.notify(state, key)
ReactiveUtils.notify(state) // Notify all
```

**Parameters:**
- `state` (Object): The reactive state object
- `key` (String, optional): Specific property to notify for (omit to notify all)

**Returns:**
- Nothing

### When to Use

Use `notify()` to manually trigger updates:

```js
const data = state({
  items: [1, 2, 3],
  config: { theme: 'light' }
});

effect(() => {
  console.log('Items:', data.items);
});

// Modify array in place - reactivity might not detect
data.items[0] = 100;

// Manually notify
notify(data, 'items');
// Effect runs: "Items: [100, 2, 3]"
```

### Use Cases

**Use Case 1: Array Mutations**

```js
const todos = state({ items: [] });

effect(() => {
  renderTodos(todos.items);
});

function sortTodos() {
  // In-place sort doesn't trigger reactivity
  todos.items.sort((a, b) => a.priority - b.priority);

  // Manually notify
  notify(todos, 'items');
}
```

**Use Case 2: Nested Object Changes**

```js
const user = state({
  profile: { name: 'John', settings: { theme: 'light' } }
});

effect(() => {
  applyTheme(user.profile.settings.theme);
});

function updateNestedSetting(key, value) {
  user.profile.settings[key] = value;

  // Notify the top-level property
  notify(user, 'profile');
}
```

**Use Case 3: Batch Manual Updates**

```js
const game = state({
  score: 0,
  level: 1,
  health: 100
});

effect(() => {
  updateGameUI(game);
});

function applyPowerup(powerup) {
  // Direct modifications
  game.score += powerup.scoreBonus;
  game.health += powerup.healthBonus;

  // Notify all properties at once
  notify(game);
}
```

**Use Case 4: External Libraries**

```js
const chart = state({
  data: { labels: [], values: [] }
});

effect(() => {
  renderChart(chart.data);
});

function updateChartData(newData) {
  // External library modifies data
  externalChartLib.updateData(chart.data, newData);

  // Manually trigger update
  notify(chart, 'data');
}
```

---

## `updateAll()`

### What is it?

`updateAll()` is a **unified update function** that can update both state properties and DOM elements in a single call. It automatically distinguishes between state keys and CSS selectors.

### Syntax

```js
// Using the shortcut
updateAll(state, updates)

// Using the full namespace
ReactiveUtils.updateAll(state, updates)
```

**Parameters:**
- `state` (Object): The reactive state object
- `updates` (Object): Object with state keys and/or CSS selectors as keys, values to set as values

**Returns:**
- The state object

### When to Use

Use `updateAll()` to update state and DOM together:

```js
const app = state({
  count: 0,
  message: 'Hello'
});

// Update state AND DOM in one call
updateAll(app, {
  // State updates (no special prefix)
  count: 10,
  message: 'Updated',

  // DOM updates (CSS selectors)
  '#counter': 10,
  '#message': 'Updated',
  '.status': 'Active'
});
```

### How It Works

`updateAll()` checks each key:
- If it starts with `#`, `.`, or contains `[` or `>` → DOM selector
- Otherwise → state property

```js
updateAll(app, {
  // State properties
  name: 'John',
  age: 25,

  // DOM selectors
  '#userName': 'John',
  '.user-age': 25,
  '[data-role="status"]': 'active'
});
```

### Use Cases

**Use Case 1: Form Sync**

```js
const form = state({
  username: '',
  email: ''
});

function updateFormAndDisplay(data) {
  updateAll(form, {
    // Update state
    username: data.username,
    email: data.email,

    // Update display
    '#userDisplay': data.username,
    '#emailDisplay': data.email
  });
}
```

**Use Case 2: Dashboard Updates**

```js
const dashboard = state({
  visitors: 0,
  revenue: 0
});

function updateDashboard(data) {
  updateAll(dashboard, {
    // Update state
    visitors: data.visitors,
    revenue: data.revenue,

    // Update UI directly
    '#visitorsCount': data.visitors.toLocaleString(),
    '#revenueAmount': `$${data.revenue.toFixed(2)}`,
    '.last-updated': new Date().toLocaleTimeString()
  });
}
```

**Use Case 3: Nested State Updates**

```js
const app = state({
  user: {
    name: '',
    email: ''
  }
});

updateAll(app, {
  // Nested state (dot notation)
  'user.name': 'John',
  'user.email': 'john@example.com',

  // DOM
  '#userName': 'John'
});
```

---

## Summary Table

| Function | Purpose | Returns |
|----------|---------|---------|
| `pause()` | Pause reactive updates | Nothing |
| `resume(flush)` | Resume reactive updates | Nothing |
| `untrack(fn)` | Run without tracking | Function result |
| `isReactive(value)` | Check if reactive | Boolean |
| `toRaw(value)` | Get raw value | Raw object |
| `notify(state, key)` | Trigger updates | Nothing |
| `updateAll(state, updates)` | Update state + DOM | State object |

---

## Summary

**Reactive utility functions provide fine-grained control over the reactive system.**

Key takeaways:
- ✅ Both **shortcut** and **namespace** (`ReactiveUtils.*`) styles are valid
- ✅ **`pause()`/`resume()`** - Manual update control
- ✅ **`untrack()`** - Read without dependencies
- ✅ **`isReactive()`** - Type checking
- ✅ **`toRaw()`** - Extract plain values
- ✅ **`notify()`** - Manual update triggers
- ✅ **`updateAll()`** - Unified state + DOM updates
- ⚠️ Use `pause()`/`resume()` in try/finally
- ⚠️ `untrack()` breaks reactivity intentionally
- ⚠️ Always pair `pause()` with `resume()`

**Remember:** These utilities are power tools for advanced scenarios. Most of the time, automatic reactivity works perfectly. Use these when you need manual control! 🎉

➡️ Next, explore [`batch()`](batch.md) for performance optimization or [`state()`](state.md) for core reactive state!
