# Understanding `untrack()` - A Beginner's Guide

## What is `untrack()`?

`untrack()` is a **dependency control function** in the Reactive library that runs a function without tracking any reactive dependencies. State accessed inside `untrack()` won't cause the current effect to re-run when that state changes.

Think of it as **reading in stealth mode** - you can read reactive state without creating a dependency on it, so changes to that state won't trigger re-execution.

---

## Syntax

```js
// Using the shortcut
const result = untrack(fn)

// Using the full namespace
const result = ReactiveUtils.untrack(fn)
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`untrack()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.untrack()`) - Explicit and clear

**Parameters:**
- `fn` (Function): Function to run without dependency tracking

**Returns:**
- The return value of the function

---

## Why Does This Exist?

### The Problem with Automatic Tracking

Effects automatically track all reactive state they read:

```javascript
// All reactive reads create dependencies
const app = state({
  count: 0,
  debug: false,
  timestamp: Date.now()
});

effect(() => {
  console.log('Count:', app.count);

  // We just want to read debug, not depend on it
  if (app.debug) {
    console.log('Debug info:', app.timestamp);
  }
});

app.count = 5;      // Effect runs ✓
app.debug = true;   // Effect runs ✗ (don't want this!)
app.timestamp = Date.now(); // Effect runs ✗ (don't want this!)
```

**What's the Real Issue?**

**Problems:**
- Can't read state without creating dependency
- Effect runs when it shouldn't
- Unnecessary re-executions
- Performance waste
- Can cause infinite loops

---

### The Solution with `untrack()`

When you use `untrack()`, you read state without dependencies:

```javascript
// Read without creating dependencies
const app = state({
  count: 0,
  debug: false,
  timestamp: Date.now()
});

effect(() => {
  console.log('Count:', app.count);

  // Read debug without tracking
  const isDebug = untrack(() => app.debug);
  if (isDebug) {
    const ts = untrack(() => app.timestamp);
    console.log('Debug info:', ts);
  }
});

app.count = 5;      // Effect runs ✓
app.debug = true;   // Effect does NOT run ✓
app.timestamp = Date.now(); // Effect does NOT run ✓
```

**Benefits:**
- Read without dependencies
- Prevent unwanted re-runs
- Avoid infinite loops
- Better performance
- Precise dependency control

---

## How Does It Work?

### Under the Hood

`untrack()` temporarily disables dependency tracking:

```
untrack(fn)
        ↓
1. Save current effect context
2. Set current effect to null
3. Execute fn (reads don't track)
4. Restore effect context
        ↓
Returns fn result, no dependencies created
```

---

## Basic Usage

### Reading Without Dependencies

```js
// Using the shortcut style
const user = state({
  name: 'John',
  email: 'john@example.com',
  lastLogin: new Date()
});

effect(() => {
  console.log('User:', user.name);

  // Read email without tracking
  const email = untrack(() => user.email);
  console.log('Email:', email);
});

user.name = 'Jane';  // Effect runs
user.email = 'jane@example.com'; // Effect does NOT run

// Or using the namespace style
effect(() => {
  console.log('User:', user.name);
  const email = ReactiveUtils.untrack(() => user.email);
});
```

### Returning Values

```js
const config = state({
  apiUrl: 'https://api.example.com',
  timeout: 5000
});

effect(() => {
  // Get URL without tracking
  const url = untrack(() => config.apiUrl);
  console.log('Using API:', url);
});

config.timeout = 10000; // Effect runs (tracked)
config.apiUrl = 'https://api2.example.com'; // Effect does NOT run
```

### Multiple Reads

```js
const data = state({
  value: 0,
  debug: false,
  verbose: false,
  timestamp: Date.now()
});

effect(() => {
  console.log('Value:', data.value);

  // Read multiple values without tracking
  untrack(() => {
    if (data.debug) {
      console.log('Debug mode');
      if (data.verbose) {
        console.log('Verbose mode');
        console.log('Timestamp:', data.timestamp);
      }
    }
  });
});

data.value = 10;   // Effect runs
data.debug = true; // Effect does NOT run
data.verbose = true; // Effect does NOT run
data.timestamp = Date.now(); // Effect does NOT run
```

---

## Common Use Cases

### Use Case 1: Configuration Reading

```js
const app = state({
  items: [],
  config: {
    itemsPerPage: 10,
    sortOrder: 'asc'
  }
});

effect(() => {
  const items = app.items;

  // Read config without dependency
  const config = untrack(() => app.config);

  renderItems(items, config);
});

app.items.push({ id: 1 }); // Effect runs
app.config.itemsPerPage = 20; // Effect does NOT run
```

### Use Case 2: Debug Logging

```js
const counter = state({
  count: 0,
  debugMode: false
});

effect(() => {
  console.log('Count changed:', counter.count);

  // Log debug info without tracking
  untrack(() => {
    if (counter.debugMode) {
      console.log('Stack trace:', new Error().stack);
      console.log('Timestamp:', Date.now());
    }
  });
});

counter.count = 5;       // Effect runs
counter.debugMode = true; // Effect does NOT run
```

### Use Case 3: Preventing Infinite Loops

```js
const data = state({
  value: 0,
  history: []
});

effect(() => {
  console.log('Value:', data.value);

  // Update history without creating dependency
  untrack(() => {
    data.history.push(data.value);
  });
});

data.value = 5;  // Effect runs, adds to history
data.value = 10; // Effect runs, adds to history
// No infinite loop!
```

### Use Case 4: Conditional Dependencies

```js
const ui = state({
  isLoggedIn: false,
  userName: 'Guest',
  theme: 'light'
});

effect(() => {
  if (ui.isLoggedIn) {
    // Only track userName when logged in
    console.log('User:', ui.userName);
  } else {
    // Don't track userName when logged out
    const name = untrack(() => ui.userName);
    console.log('Guest mode');
  }

  // Always track theme
  document.body.className = ui.theme;
});

ui.userName = 'John'; // Effect does NOT run (logged out)
ui.isLoggedIn = true; // Effect runs
ui.userName = 'Jane'; // Effect runs (now logged in)
```

### Use Case 5: Performance Optimization

```js
const stats = state({
  activeUsers: 0,
  totalUsers: 1000,
  metadata: {
    lastUpdated: Date.now(),
    region: 'US',
    server: 'prod'
  }
});

effect(() => {
  console.log('Active users:', stats.activeUsers);

  // Read metadata without tracking
  const meta = untrack(() => stats.metadata);
  console.log('Region:', meta.region);
});

stats.activeUsers = 100; // Effect runs
stats.metadata.lastUpdated = Date.now(); // Effect does NOT run
stats.metadata.server = 'staging'; // Effect does NOT run
```

---

## Advanced Patterns

### Pattern 1: Selective Tracking

```js
function createSelectiveEffect(state, trackedKeys) {
  effect(() => {
    // Only track specific keys
    trackedKeys.forEach(key => {
      console.log(key, state[key]);
    });

    // Read other keys without tracking
    untrack(() => {
      Object.keys(state).forEach(key => {
        if (!trackedKeys.includes(key)) {
          console.log('Untracked:', key, state[key]);
        }
      });
    });
  });
}

const app = state({ a: 1, b: 2, c: 3 });
createSelectiveEffect(app, ['a', 'b']);
// Tracks: a, b
// Doesn't track: c
```

### Pattern 2: Snapshot Reading

```js
function getStateSnapshot(state) {
  return untrack(() => toRaw(state));
}

const data = state({ count: 0, items: [] });

effect(() => {
  console.log('Effect running');

  // Get snapshot without dependency
  const snapshot = getStateSnapshot(data);
  console.log('Snapshot:', snapshot);
});

data.count = 5; // Effect runs once
data.items.push(1); // Effect runs
// Snapshot reads don't create dependencies
```

### Pattern 3: Conditional Untracking

```js
function smartRead(state, key, shouldTrack = true) {
  if (shouldTrack) {
    return state[key];
  } else {
    return untrack(() => state[key]);
  }
}

const app = state({ value: 0, config: {} });

effect(() => {
  const value = smartRead(app, 'value', true);
  const config = smartRead(app, 'config', false);

  console.log(value, config);
});
```

### Pattern 4: Untracked Comparison

```js
const data = state({
  current: 0,
  previous: 0
});

effect(() => {
  const current = data.current;

  // Read previous without tracking
  const previous = untrack(() => data.previous);

  if (current !== previous) {
    console.log(`Changed from ${previous} to ${current}`);
    untrack(() => {
      data.previous = current;
    });
  }
});
```

---

## Performance Tips

### Tip 1: Untrack Large Objects

```js
// GOOD - untrack large config objects
effect(() => {
  const items = data.items;
  const config = untrack(() => data.config);
  render(items, config);
});

// BAD - tracking large unused object
effect(() => {
  const items = data.items;
  const config = data.config; // Tracked unnecessarily
  render(items, config);
});
```

### Tip 2: Untrack Debug Code

```js
// GOOD - untrack debug reads
effect(() => {
  processData(state.data);

  untrack(() => {
    if (state.debugMode) {
      console.log('Debug:', state.debugInfo);
    }
  });
});
```

### Tip 3: Untrack Metadata

```js
// GOOD - untrack metadata
effect(() => {
  renderUser(user.profile);

  const meta = untrack(() => user.metadata);
  logMetadata(meta);
});
```

---

## Common Pitfalls

### Pitfall 1: Untracking Required Dependencies

```js
// WRONG - untracking needed dependency
effect(() => {
  const value = untrack(() => state.value);
  display(value); // Won't update when value changes!
});

// RIGHT - track what you need
effect(() => {
  const value = state.value; // Tracked
  display(value);
});
```

### Pitfall 2: Partial Untracking

```js
// WRONG - inconsistent tracking
effect(() => {
  if (state.flag) {
    const value = untrack(() => state.value);
    // value changes won't trigger when flag is true
  } else {
    const value = state.value;
    // value changes WILL trigger when flag is false
  }
});

// RIGHT - consistent tracking
effect(() => {
  const value = state.value; // Always tracked
  if (state.flag) {
    // Use value...
  }
});
```

### Pitfall 3: Untracking Everything

```js
// WRONG - untracking entire effect
effect(() => {
  untrack(() => {
    processData(state.data);
  });
  // Effect never re-runs!
});

// RIGHT - track what should trigger
effect(() => {
  const data = state.data; // Tracked
  untrack(() => {
    const debug = state.debug; // Not tracked
    if (debug) console.log(data);
  });
});
```

---

## Summary

**`untrack()` reads reactive state without creating dependencies.**

Key takeaways:
- ✅ **Read without dependencies** - state won't trigger re-runs
- ✅ Both **shortcut** (`untrack()`) and **namespace** (`ReactiveUtils.untrack()`) styles are valid
- ✅ Takes a **function** to run
- ✅ Returns the **function's result**
- ✅ Prevents **unwanted re-runs**
- ✅ Avoids **infinite loops**
- ✅ Great for **config**, **debug logs**, **metadata**
- ⚠️ Don't untrack **required dependencies**
- ⚠️ Use carefully - breaks reactivity intentionally
- ⚠️ Only for **optional reads**

**Remember:** `untrack()` is for reading state you don't want to depend on. Use it for configuration, debug info, metadata, or to prevent infinite loops! 🎉

➡️ Next, explore [`pause()`](pause.md) for pausing reactivity or [`effect()`](effect.md) for reactive side effects!
