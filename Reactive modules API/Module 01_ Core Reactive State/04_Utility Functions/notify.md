# Understanding `notify()` - A Beginner's Guide

## What is `notify()`?

`notify()` is a **manual trigger function** in the Reactive library that manually notifies dependencies to re-run their effects. It's useful when you modify state in ways that reactivity can't automatically detect, like direct array mutations or nested object changes.

Think of it as **manually ringing the bell** - when reactivity doesn't catch a change, you can manually trigger the update yourself.

---

## Syntax

```js
// Using the shortcut
notify(state, key)
notify(state)  // Notify all properties

// Using the full namespace
ReactiveUtils.notify(state, key)
ReactiveUtils.notify(state)  // Notify all
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`notify()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.notify()`) - Explicit and clear

**Parameters:**
- `state` (Object): The reactive state object
- `key` (String, optional): Specific property to notify for (omit to notify all)

**Returns:**
- Nothing

---

## Basic Usage

### Notify Single Property

```js
// Using the shortcut style
const data = state({
  items: [1, 2, 3],
  count: 0
});

effect(() => {
  console.log('Items:', data.items);
});

// Direct mutation - reactivity might not detect
data.items[0] = 100;

// Manually notify
notify(data, 'items');
// Effect runs: "Items: [100, 2, 3]"

// Or using the namespace style
ReactiveUtils.notify(data, 'items');
```

### Notify All Properties

```js
const app = state({
  count: 0,
  message: '',
  items: []
});

effect(() => {
  console.log('App:', app.count, app.message, app.items.length);
});

// Multiple direct changes
app.items[0] = 'new';
app.items.length = 5;

// Notify all properties
notify(app);
// Effect runs with all changes
```

### Array Mutations

```js
const todos = state({ items: [] });

effect(() => {
  console.log('Todos:', todos.items.length);
});

// In-place sort doesn't trigger reactivity
todos.items.sort((a, b) => a.priority - b.priority);

// Manually notify
notify(todos, 'items');
```

---

## Common Use Cases

### Use Case 1: Array In-Place Sorting

```js
const list = state({
  items: [
    { name: 'Bob', age: 30 },
    { name: 'Alice', age: 25 },
    { name: 'Charlie', age: 35 }
  ]
});

effect(() => {
  renderList(list.items);
});

function sortByAge() {
  list.items.sort((a, b) => a.age - b.age);
  notify(list, 'items'); // Trigger re-render
}

function sortByName() {
  list.items.sort((a, b) => a.name.localeCompare(b.name));
  notify(list, 'items'); // Trigger re-render
}
```

### Use Case 2: Nested Object Changes

```js
const user = state({
  profile: {
    name: 'John',
    settings: { theme: 'light' }
  }
});

effect(() => {
  applyTheme(user.profile.settings.theme);
});

function updateNestedSetting(key, value) {
  user.profile.settings[key] = value;
  notify(user, 'profile'); // Notify top-level property
}

updateNestedSetting('theme', 'dark');
```

### Use Case 3: Array Index Assignment

```js
const grid = state({
  cells: Array(9).fill(null)
});

effect(() => {
  renderGrid(grid.cells);
});

function setCell(index, value) {
  grid.cells[index] = value;
  notify(grid, 'cells'); // Trigger update
}

setCell(0, 'X');
setCell(4, 'O');
```

### Use Case 4: External Library Integration

```js
const chart = state({
  data: { labels: [], values: [] }
});

effect(() => {
  renderChart(chart.data);
});

function updateChartData(newData) {
  // External library modifies data in place
  externalChartLib.processData(chart.data, newData);

  // Manually trigger update
  notify(chart, 'data');
}
```

### Use Case 5: Batch Manual Changes

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
  // Multiple direct modifications
  game.score += powerup.scoreBonus;
  game.health = Math.min(100, game.health + powerup.healthBonus);

  // Notify all at once
  notify(game);
}
```

---

## Advanced Patterns

### Pattern 1: Conditional Notification

```js
function updateWithNotify(state, key, value, shouldNotify = true) {
  state[key] = value;

  if (shouldNotify) {
    notify(state, key);
  }
}

updateWithNotify(data, 'count', 10, true);  // Notifies
updateWithNotify(data, 'total', 100, false); // Doesn't notify
```

### Pattern 2: Debounced Notifications

```js
let notifyTimeout;

function debouncedNotify(state, key, delay = 300) {
  clearTimeout(notifyTimeout);
  notifyTimeout = setTimeout(() => {
    notify(state, key);
  }, delay);
}

// Multiple rapid changes
data.items[0] = 1;
debouncedNotify(data, 'items');
data.items[1] = 2;
debouncedNotify(data, 'items');
// Only notifies once after delay
```

### Pattern 3: Tracked Mutations

```js
function mutateWithTracking(state, key, mutationFn) {
  const before = JSON.stringify(toRaw(state[key]));

  mutationFn(state[key]);

  const after = JSON.stringify(toRaw(state[key]));

  if (before !== after) {
    notify(state, key);
  }
}

mutateWithTracking(data, 'items', (items) => {
  items.reverse();
  items.sort();
});
```

---

## Performance Tips

### Tip 1: Notify Specific Properties

```js
// GOOD - notify only what changed
notify(state, 'items');

// BAD - notifies everything
notify(state);
```

### Tip 2: Batch Before Notifying

```js
// GOOD - batch then notify
batch(() => {
  data.items[0] = 1;
  data.items[1] = 2;
  data.items[2] = 3;
});
notify(data, 'items');

// BAD - notify each time
data.items[0] = 1;
notify(data, 'items');
data.items[1] = 2;
notify(data, 'items');
```

### Tip 3: Use State Methods First

```js
// GOOD - use reactive methods
state.$update({ count: 10, total: 100 });

// ONLY use notify when necessary
state.items.sort();
notify(state, 'items');
```

---

## Common Pitfalls

### Pitfall 1: Over-Notifying

```js
// WRONG - unnecessary notify
state.count = 10; // Already reactive
notify(state, 'count'); // Redundant!

// RIGHT - only notify for undetected changes
state.items.sort(); // Not detected
notify(state, 'items'); // Necessary
```

### Pitfall 2: Wrong Property Key

```js
// WRONG - notifying wrong property
state.items.push(1);
notify(state, 'count'); // Wrong property!

// RIGHT - notify the changed property
notify(state, 'items');
```

### Pitfall 3: Forgetting to Notify

```js
// WRONG - mutation without notify
state.items.reverse();
// Effects won't run!

// RIGHT - notify after mutation
state.items.reverse();
notify(state, 'items');
```

---

## When to Use

### ✅ Use `notify()` when:
- Sorting arrays in place
- Reversing arrays in place
- Direct index assignment to arrays
- External libraries modify state
- Modifying deeply nested objects
- Batch manual updates

### ❌ Don't use `notify()` when:
- Regular reactive assignments work
- Using state methods like `$update()`
- Using array methods like `push()`, `pop()`
- State change is already detected

---

## Summary

**`notify()` manually triggers reactive updates for state changes.**

Key takeaways:
- ✅ **Manual trigger** for reactive updates
- ✅ Both **shortcut** (`notify()`) and **namespace** (`ReactiveUtils.notify()`) styles are valid
- ✅ Takes **state** and optional **key**
- ✅ Omit key to **notify all** properties
- ✅ Great for **array mutations**, **sorting**, **external libs**
- ⚠️ Only use when reactivity **doesn't auto-detect**
- ⚠️ Notify the **correct property**
- ⚠️ Don't **over-notify** - use reactive methods first

**Remember:** Use `notify()` only when reactivity can't automatically detect your changes, like in-place array sorting or external library modifications! 🎉

➡️ Next, explore [`state()`](state.md) for reactive state or [`batch()`](batch.md) for batching updates!
