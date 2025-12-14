# Understanding `patchArray()` - A Beginner's Guide

## What is `patchArray()`?

`patchArray(obj, key)` manually patches an array property to make it ReactiveUtils. Use this when you add arrays to state after creation.

Think of it as **manual array enabler** - make this array ReactiveUtils.

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
ReactiveUtils.patchArray(obj, key)
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

// Make it reactive
ReactiveUtils.patchArray(state, 'items');

// Now reactive!
state.items.push(1); // Triggers effects
```

### Patch Multiple Arrays

```javascript
const state = ReactiveUtils.state({});

state.list1 = [];
state.list2 = [];

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

### Q: What if I forget to patch?

**Answer:** Array methods won't trigger reactivity:

```javascript
state.items = [];
state.items.push(1); // Silent - no reactivity

ReactiveUtils.patchArray(state, 'items');
state.items.push(2); // Now works!
```

### Q: Can I patch nested arrays?

**Answer:** Yes, patch at each level:

```javascript
state.data = [{ items: [] }];
ReactiveUtils.patchArray(state, 'data');
ReactiveUtils.patchArray(state.data[0], 'items');
```

---

## Summary

### What `patchArray()` Does:

1. ✅ Makes array reactive
2. ✅ Patches all array methods
3. ✅ For arrays added later
4. ✅ Manual control

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

// Make it reactive
ReactiveUtils.patchArray(state, 'items');

// Now works!
state.items.push(1);
```

---

**Remember:** Only needed for arrays added AFTER state creation. Arrays in initial state are automatic! 🎉
