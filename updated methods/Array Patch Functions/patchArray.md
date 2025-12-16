# Understanding `patchArray()` - A Beginner's Guide

## What is `patchArray()`?

`patchArray(state, key)` manually patches an array property to make it reactive. Use this when you add arrays to state after creation.

Think of it as **manual array enabler** - make this array reactive.

---

## How to Call It

There are multiple ways to call `patchArray()`:

```javascript
// ✅ Recommended: Via ReactiveUtils (matches other methods)
ReactiveUtils.patchArray(state, 'items');

// ✅ Alternative: Global function (legacy)
patchReactiveArray(state, 'items');

// ✅ Via Elements namespace
Elements.patchArray(state, 'items');

// ✅ Via Collections namespace
Collections.patchArray(state, 'items');

// ✅ Via Selector namespace
Selector.patchArray(state, 'items');
```

**All methods do the same thing!** Use whichever fits your code style.

---

## Why Does This Exist?

### The Problem: Arrays Added Later

Arrays added to state after creation aren't automatically reactive:

```javascript
// ❌ Without patchArray - not reactive
const state = ReactiveUtils.state({
  name: 'John'
});

state.items = []; // Not automatically reactive
state.items.push(1); // Doesn't trigger reactivity

// ✅ With patchArray - now reactive
state.items = [];
ReactiveUtils.patchArray(state, 'items');
state.items.push(1); // Triggers reactivity!
```

**Why this matters:**
- Dynamic array addition
- Runtime array creation
- Manual control
- Edge case handling

---

## How Does It Work?

### The PatchArray Process

```javascript
ReactiveUtils.patchArray(state, key)
    ↓
Wraps array methods (push, pop, etc.)
    ↓
Methods now trigger reactivity
```

---

## Basic Usage

### Patch Single Array

```javascript
const state = ReactiveUtils.state({
  count: 0
});

// Add array later
state.items = [];

// Make it reactive (choose your preferred method)
ReactiveUtils.patchArray(state, 'items');
// OR: patchReactiveArray(state, 'items');

// Now reactive!
state.items.push(1); // Triggers effects
```

### Patch Multiple Arrays

```javascript
const state = ReactiveUtils.state({});

state.list1 = [];
state.list2 = [];

// Patch both arrays
ReactiveUtils.patchArray(state, 'list1');
ReactiveUtils.patchArray(state, 'list2');
```

---

## Simple Examples

### Example 1: Conditional Array Creation

```javascript
const state = ReactiveUtils.state({
  showAdvanced: false
});

function enableAdvanced() {
  state.showAdvanced = true;

  // Create array when needed
  if (!state.advancedItems) {
    state.advancedItems = [];
    ReactiveUtils.patchArray(state, 'advancedItems');
  }
}

// Display
ReactiveUtils.effect(() => {
  if (state.showAdvanced && state.advancedItems) {
    const container = document.getElementById('advanced');
    container.innerHTML = state.advancedItems
      .map(item => `<div>${item}</div>`)
      .join('');
  }
});
```

---

### Example 2: Dynamic Property Addition

```javascript
const dataState = ReactiveUtils.state({
  selectedCategory: null
});

function loadCategory(category) {
  dataState.selectedCategory = category;

  // Add array for this category
  const key = `${category}Items`;
  if (!dataState[key]) {
    dataState[key] = [];
    ReactiveUtils.patchArray(dataState, key);
  }

  // Load data
  loadCategoryData(category).then(data => {
    dataState[key].push(...data);
  });
}
```

---

### Example 3: Using Different API Styles

```javascript
const state = ReactiveUtils.state({
  user: { name: 'John' }
});

// Style 1: ReactiveUtils (most common)
state.todos = [];
ReactiveUtils.patchArray(state, 'todos');

// Style 2: Global function
state.notes = [];
patchReactiveArray(state, 'notes');

// Style 3: Elements namespace
state.bookmarks = [];
Elements.patchArray(state, 'bookmarks');

// All three arrays are now reactive!
state.todos.push({ task: 'Buy milk' });
state.notes.push({ text: 'Meeting at 3pm' });
state.bookmarks.push({ url: 'example.com' });
```

---

## Real-World Example: Plugin System

```javascript
const appState = ReactiveUtils.state({
  plugins: new Map()
});

function registerPlugin(name, plugin) {
  // Each plugin can have its own array
  if (plugin.needsArray) {
    const arrayKey = `${name}Data`;
    appState[arrayKey] = [];
    
    // Patch with your preferred method
    ReactiveUtils.patchArray(appState, arrayKey);

    // Plugin can now use reactive array
    plugin.init(appState[arrayKey]);
  }

  appState.plugins.set(name, plugin);
}

// Display plugin data
function displayPluginData(pluginName) {
  const arrayKey = `${pluginName}Data`;

  ReactiveUtils.effect(() => {
    if (appState[arrayKey]) {
      const container = document.getElementById(`plugin-${pluginName}`);
      container.innerHTML = appState[arrayKey]
        .map(item => `<div>${item}</div>`)
        .join('');
    }
  });
}

// Usage
registerPlugin('analytics', {
  needsArray: true,
  init: (dataArray) => {
    // Plugin can push data to reactive array
    setInterval(() => {
      dataArray.push({ 
        event: 'pageview', 
        timestamp: Date.now() 
      });
    }, 5000);
  }
});

displayPluginData('analytics');
```

---

## Common Patterns

### Pattern 1: Add and Patch

```javascript
state.newArray = [];
ReactiveUtils.patchArray(state, 'newArray');
```

### Pattern 2: Conditional Creation

```javascript
if (!state.items) {
  state.items = [];
  ReactiveUtils.patchArray(state, 'items');
}
```

### Pattern 3: Dynamic Keys

```javascript
const key = 'dynamicArray';
state[key] = [];
ReactiveUtils.patchArray(state, key);
```

### Pattern 4: Helper Function

```javascript
function addReactiveArray(state, key, initialItems = []) {
  state[key] = initialItems;
  ReactiveUtils.patchArray(state, key);
  return state[key];
}

// Usage
addReactiveArray(state, 'todos', [
  { id: 1, task: 'First todo' }
]);
```

---

## API Reference

### Method Signatures

All these methods have the same signature:

```javascript
// Via ReactiveUtils (recommended)
ReactiveUtils.patchArray(state, key)

// Via global function (legacy)
patchReactiveArray(state, key)

// Via Elements
Elements.patchArray(state, key)

// Via Collections
Collections.patchArray(state, key)

// Via Selector
Selector.patchArray(state, key)
```

### Parameters

- **`state`** (Object) - The reactive state object
- **`key`** (String) - The property name containing the array

### Returns

- `undefined` - Patches the array in place

### Example

```javascript
const state = ReactiveUtils.state({ count: 0 });
state.items = [1, 2, 3];

// Patch the array
ReactiveUtils.patchArray(state, 'items');

// Now array methods trigger reactivity
state.items.push(4); // ✅ Reactive
```

---

## Common Questions

### Q: When do I need patchArray()?

**Answer:** Only when adding arrays AFTER state creation:

```javascript
// DON'T NEED: arrays in initial state are automatic
const state = ReactiveUtils.state({
  items: [] // Automatic
});

// DO NEED: arrays added later
state.newItems = [];
ReactiveUtils.patchArray(state, 'newItems'); // Manual
```

---

### Q: What if I forget to patch?

**Answer:** Array methods won't trigger reactivity:

```javascript
state.items = [];
state.items.push(1); // Silent - no reactivity

ReactiveUtils.patchArray(state, 'items');
state.items.push(2); // Now works!
```

---

### Q: Can I patch nested arrays?

**Answer:** Yes, patch at each level:

```javascript
state.data = [{ items: [] }];
ReactiveUtils.patchArray(state, 'data');
ReactiveUtils.patchArray(state.data[0], 'items');
```

---

### Q: Which method should I use?

**Answer:** Use whichever fits your code style:

```javascript
// ✅ Most common - matches other ReactiveUtils methods
ReactiveUtils.patchArray(state, 'items');

// ✅ Good for global scope / simple scripts
patchReactiveArray(state, 'items');

// ✅ Good if you're using Elements namespace
Elements.patchArray(state, 'items');
```

**Recommendation:** Use `ReactiveUtils.patchArray()` for consistency with other methods like `ReactiveUtils.state()`, `ReactiveUtils.effect()`, etc.

---

### Q: Does it work with nested paths?

**Answer:** No, patch each level separately:

```javascript
// ❌ Won't work - nested path
ReactiveUtils.patchArray(state, 'user.todos');

// ✅ Works - patch directly
state.user.todos = [];
ReactiveUtils.patchArray(state.user, 'todos');
```

---

## Comparison: All Available Methods

| Method | Best For | Example |
|--------|----------|---------|
| `ReactiveUtils.patchArray()` | General use, consistency | `ReactiveUtils.patchArray(state, 'items')` |
| `patchReactiveArray()` | Global scope, legacy | `patchReactiveArray(state, 'items')` |
| `Elements.patchArray()` | ID-based element code | `Elements.patchArray(state, 'items')` |
| `Collections.patchArray()` | Class-based code | `Collections.patchArray(state, 'items')` |
| `Selector.patchArray()` | Query selector code | `Selector.patchArray(state, 'items')` |

---

## Complete Usage Example

```javascript
// Create state
const appState = ReactiveUtils.state({
  user: { name: 'John' },
  settings: { theme: 'dark' }
});

// Add arrays later
appState.todos = [];
appState.notes = [];
appState.user.favorites = [];

// Patch all arrays (choose your preferred style)
ReactiveUtils.patchArray(appState, 'todos');
ReactiveUtils.patchArray(appState, 'notes');
ReactiveUtils.patchArray(appState.user, 'favorites');

// Now all arrays are reactive
appState.todos.push({ task: 'Buy milk', done: false });
appState.notes.push({ text: 'Meeting notes' });
appState.user.favorites.push('JavaScript');

// Display todos
ReactiveUtils.effect(() => {
  const container = document.getElementById('todos');
  container.innerHTML = appState.todos
    .map(todo => `
      <div class="todo ${todo.done ? 'done' : ''}">
        ${todo.task}
      </div>
    `)
    .join('');
});

// Display counts
ReactiveUtils.effect(() => {
  document.getElementById('todo-count').textContent = 
    `${appState.todos.length} todos`;
  document.getElementById('note-count').textContent = 
    `${appState.notes.length} notes`;
  document.getElementById('favorite-count').textContent = 
    `${appState.user.favorites.length} favorites`;
});
```

---

## Summary

### What `patchArray()` Does:

1. ✅ Makes array reactive
2. ✅ Patches all array methods
3. ✅ For arrays added later
4. ✅ Manual control

### Multiple Ways to Call:

```javascript
// All equivalent - choose your style
ReactiveUtils.patchArray(state, 'items')  // Recommended
patchReactiveArray(state, 'items')        // Legacy
Elements.patchArray(state, 'items')       // Elements namespace
Collections.patchArray(state, 'items')    // Collections namespace
Selector.patchArray(state, 'items')       // Selector namespace
```

### When to Use It:

- Arrays added after creation
- Dynamic array properties
- Conditional arrays
- Plugin systems
- Runtime array addition

### The Basic Pattern:

```javascript
const state = ReactiveUtils.state({});

// Add array later
state.items = [];

// Make it reactive (your choice!)
ReactiveUtils.patchArray(state, 'items');

// Now works!
state.items.push(1);
```

---

**Remember:** Only needed for arrays added AFTER state creation. Arrays in initial state are automatic! Choose whichever API style you prefer - they all work the same way! 🎉