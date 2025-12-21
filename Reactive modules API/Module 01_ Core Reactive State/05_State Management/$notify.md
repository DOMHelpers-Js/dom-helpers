# Understanding `state.$notify()` - A Beginner's Guide

## What is `state.$notify()`?

`state.$notify()` is a **state instance method** that manually triggers reactive updates for a specific property or all properties. It's useful when you modify state in ways that reactivity can't automatically detect, like direct array mutations or nested object changes.

Think of it as **manually ringing the update bell** - when automatic reactivity misses a change, you can manually trigger the update yourself.

---

## Syntax

```js
state.$notify(key)
state.$notify()  // Notify all properties
```

**Parameters:**
- `key` (String, optional): Specific property to notify for (omit to notify all)

**Returns:**
- The state object (for chaining)

---

## Why Does This Exist?

### The Problem with Undetected Changes

Some state modifications don't trigger reactivity automatically:

```javascript
// Reactivity doesn't detect these changes
const data = state({
  items: [1, 2, 3],
  nested: { value: 10 }
});

effect(() => {
  console.log('Items:', data.items);
});

// Direct index assignment - might not trigger reactivity
data.items[0] = 100;

// In-place sort - doesn't trigger reactivity
data.items.sort((a, b) => b - a);

// Effects don't run - changes not detected!
```

**What's the Real Issue?**

**Problems:**
- Direct array mutations not detected
- In-place array operations not tracked
- Deep nested changes missed
- External libraries modifying state
- Manual changes need manual notification

---

### The Solution with `$notify()`

When you use `$notify()`, you manually trigger the updates:

```javascript
// With $notify() - manual triggering
const data = state({
  items: [1, 2, 3]
});

effect(() => {
  console.log('Items:', data.items);
});

// Direct mutation
data.items[0] = 100;

// Manually notify that items changed
data.$notify('items');
// Effect runs: "Items: [100, 2, 3]"

// In-place sort
data.items.sort((a, b) => b - a);

// Manually notify
data.$notify('items');
// Effect runs with sorted array
```

**Benefits:**
- Control over update timing
- Works with any modification
- Fixes undetected changes
- Simple and explicit

---

## How Does It Work?

### Under the Hood

`$notify()` manually triggers dependency updates:

```
state.$notify(key)
        ↓
1. Find all effects watching this property
2. Queue them for execution
3. Flush the update queue
        ↓
Effects run with current state
```

---

## Basic Usage

### Notify Single Property

```js
const data = state({
  items: [1, 2, 3],
  count: 0
});

effect(() => {
  console.log('Items:', data.items);
});

// Direct mutation - not auto-detected
data.items[0] = 100;

// Manually notify the 'items' property changed
data.$notify('items');
// Effect runs: "Items: [100, 2, 3]"
```

### Notify All Properties

```js
const app = state({
  count: 0,
  message: '',
  items: []
});

effect(() => {
  console.log('State:', app.count, app.message, app.items.length);
});

// Multiple direct changes
app.items[0] = 'new';
app.items.length = 5;

// Notify all properties at once
app.$notify();
// Effect runs with all changes
```

### Chaining with Notify

```js
const list = state({ items: [3, 1, 2] });

effect(() => {
  console.log('Sorted:', list.items);
});

// Chain sort and notify
list.items.sort((a, b) => a - b);
list.$notify('items');
// Effect runs with sorted array: [1, 2, 3]
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
  // Re-render list whenever items change
  renderList(list.items);
});

// Sort by age (in-place modification)
function sortByAge() {
  // In-place sort doesn't trigger reactivity
  list.items.sort((a, b) => a.age - b.age);

  // Manually notify to trigger re-render
  list.$notify('items');
}

// Sort by name
function sortByName() {
  list.items.sort((a, b) => a.name.localeCompare(b.name));
  list.$notify('items');
}

sortByAge(); // List re-renders sorted by age
```

### Use Case 2: Array Reverse

```js
const todos = state({
  items: [
    { id: 1, text: 'First' },
    { id: 2, text: 'Second' },
    { id: 3, text: 'Third' }
  ]
});

effect(() => {
  renderTodoList(todos.items);
});

// Reverse the order
function reverseList() {
  // In-place reverse
  todos.items.reverse();

  // Notify to trigger update
  todos.$notify('items');
}

reverseList(); // List re-renders in reverse order
```

### Use Case 3: Direct Index Assignment

```js
const grid = state({
  cells: Array(9).fill(null) // Tic-tac-toe grid
});

effect(() => {
  // Re-render grid
  renderGrid(grid.cells);
});

// Set a cell value
function setCell(index, value) {
  // Direct index assignment
  grid.cells[index] = value;

  // Notify to trigger render
  grid.$notify('cells');
}

setCell(0, 'X'); // Grid re-renders
setCell(4, 'O'); // Grid re-renders
```

### Use Case 4: External Library Integration

```js
const chart = state({
  data: {
    labels: ['Jan', 'Feb', 'Mar'],
    values: [10, 20, 30]
  }
});

effect(() => {
  // Re-render chart when data changes
  renderChart(chart.data);
});

// Update chart using external library
function updateChartData(newData) {
  // External library modifies data in-place
  externalChartLib.processData(chart.data, newData);

  // Manually trigger update
  chart.$notify('data');
}

updateChartData({ values: [15, 25, 35] });
// Chart re-renders with new data
```

### Use Case 5: Batch Manual Changes

```js
const game = state({
  score: 0,
  level: 1,
  health: 100,
  items: []
});

effect(() => {
  // Update game UI
  updateGameUI(game);
});

// Apply powerup effects
function applyPowerup(powerup) {
  // Multiple direct modifications
  game.score += powerup.scoreBonus;
  game.health = Math.min(100, game.health + powerup.healthBonus);

  // Add items directly
  powerup.items.forEach(item => {
    game.items[game.items.length] = item;
  });

  // Notify all properties changed
  game.$notify();
}

applyPowerup({
  scoreBonus: 100,
  healthBonus: 20,
  items: ['shield', 'sword']
});
// UI updates once with all changes
```

---

## Advanced Patterns

### Pattern 1: Conditional Notification

```js
const data = state({ items: [], dirty: false });

// Only notify if actually changed
function updateItems(newItems) {
  const changed = JSON.stringify(data.items) !== JSON.stringify(newItems);

  if (changed) {
    data.items = newItems;
    data.dirty = true;
    data.$notify('items');
  }
}

updateItems([1, 2, 3]); // Notifies
updateItems([1, 2, 3]); // Doesn't notify (same)
```

### Pattern 2: Debounced Notification

```js
const state = state({ items: [] });
let notifyTimeout;

// Debounce notifications
function debouncedNotify(key, delay = 300) {
  clearTimeout(notifyTimeout);
  notifyTimeout = setTimeout(() => {
    state.$notify(key);
  }, delay);
}

// Multiple rapid changes
state.items[0] = 1;
debouncedNotify('items');

state.items[1] = 2;
debouncedNotify('items');

state.items[2] = 3;
debouncedNotify('items');
// Only notifies once after delay
```

### Pattern 3: Tracked Mutations

```js
const list = state({ items: [1, 2, 3] });

// Track and notify mutations
function mutateWithNotify(property, mutationFn) {
  // Save state before mutation
  const before = JSON.stringify(toRaw(list[property]));

  // Apply mutation
  mutationFn(list[property]);

  // Check if actually changed
  const after = JSON.stringify(toRaw(list[property]));

  // Only notify if changed
  if (before !== after) {
    list.$notify(property);
  }
}

mutateWithNotify('items', (items) => {
  items.reverse();
  items.sort();
});
// Only notifies if array actually changed
```

### Pattern 4: Bulk Notifications

```js
const app = state({
  data1: [],
  data2: [],
  data3: []
});

// Notify multiple properties
function notifyMultiple(...keys) {
  if (keys.length === 0) {
    app.$notify(); // Notify all
  } else {
    keys.forEach(key => app.$notify(key));
  }
}

// Modify multiple arrays
app.data1.push(1);
app.data2.push(2);
app.data3.push(3);

// Notify all three
notifyMultiple('data1', 'data2', 'data3');
```

---

## Performance Tips

### Tip 1: Notify Specific Properties

```js
// GOOD - notify only what changed
data.items.sort();
data.$notify('items');

// BAD - notifies everything unnecessarily
data.items.sort();
data.$notify(); // Overkill for single property
```

### Tip 2: Batch Before Notifying

```js
// GOOD - batch changes, then notify once
data.$batch(() => {
  data.items[0] = 1;
  data.items[1] = 2;
  data.items[2] = 3;
});
data.$notify('items');

// BAD - notify after each change
data.items[0] = 1;
data.$notify('items');
data.items[1] = 2;
data.$notify('items');
data.items[2] = 3;
data.$notify('items');
```

### Tip 3: Use Reactive Methods First

```js
// GOOD - use reactive methods (auto-detected)
data.items.push(item);     // Reactive
data.items.splice(0, 1);   // Reactive
data.items = [...data.items, item]; // Reactive

// ONLY use $notify when necessary
data.items.sort();         // Not reactive
data.$notify('items');     // Necessary
```

---

## Common Pitfalls

### Pitfall 1: Over-Notifying

```js
// WRONG - unnecessary notify
data.count = 10;          // Already reactive
data.$notify('count');    // Redundant!

// RIGHT - only notify undetected changes
data.items.sort();        // Not reactive
data.$notify('items');    // Necessary
```

### Pitfall 2: Wrong Property Key

```js
// WRONG - notifying wrong property
data.items.push(1);       // Modifies items
data.$notify('count');    // Wrong property!

// RIGHT - notify the changed property
data.items.sort();
data.$notify('items');    // Correct
```

### Pitfall 3: Forgetting to Notify

```js
// WRONG - mutation without notify
data.items.reverse();
// Effects won't run!

// RIGHT - notify after mutation
data.items.reverse();
data.$notify('items');
```

---

## When to Use

### ✅ Use `$notify()` when:
- Sorting arrays in-place (`.sort()`, `.reverse()`)
- Direct index assignment (`arr[0] = value`)
- External libraries modify state
- In-place array modifications
- Deep nested object changes

### ❌ Don't use `$notify()` when:
- Regular reactive assignments work
- Using array methods like `.push()`, `.pop()`, `.splice()`
- Using state methods like `$update()`, `$set()`
- Change is already auto-detected

---

## Summary

**`state.$notify()` manually triggers reactive updates.**

Key takeaways:
- ✅ **Manual trigger** for reactive updates on state instance
- ✅ Takes optional **property key**
- ✅ Omit key to **notify all** properties
- ✅ Returns **state** for chaining
- ✅ Great for **sorting**, **reversing**, **index assignment**, **external libs**
- ⚠️ Only use when reactivity **doesn't auto-detect**
- ⚠️ Notify the **correct property**
- ⚠️ Don't **over-notify** - use reactive methods first

**Remember:** Use `$notify()` only when reactivity can't automatically detect your changes, like in-place sorting or external library modifications! 🎉

➡️ Next, explore [`$batch()`]($batch.md) for batching updates or [`$watch()`]($watch.md) for watching changes!
