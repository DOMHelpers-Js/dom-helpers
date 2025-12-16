# 05_dh-reactive-cleanup.js - Complete API Reference

A comprehensive guide to the Cleanup Module's public API, organized from beginner to advanced usage.

---

## 🎯 Core Concept

**What is this module?**  
A memory management system that ensures your reactive effects, watchers, and computed properties are properly removed when you're done with them.

**Why does it exist?**  
Without it, every effect you create stays in memory forever—even after you "clean it up." This causes memory leaks in long-running applications.

**When should you use it?**  
Always! Load it after your reactive library and it works automatically. No changes to your code required.

---

## 📚 API Categories

The API is organized into three levels:

1. **Automatic APIs** - Work behind the scenes (no code changes needed)
2. **Helper APIs** - Tools for managing multiple cleanups
3. **Advanced APIs** - Debugging and manual control

---

## 1️⃣ Automatic APIs

These work automatically once the module is loaded. You don't need to change your code.

### `ReactiveUtils.effect(fn)` ✨ Enhanced

**What it does:**  
Creates a reactive effect that runs whenever its dependencies change. Now properly cleans up when disposed.

**Returns:**  
A cleanup function that removes the effect from memory.

```javascript
const state = ReactiveUtils.state({ count: 0 });

// Create an effect
const cleanup = ReactiveUtils.effect(() => {
  console.log('Count is:', state.count);
});
// Logs: "Count is: 0"

state.count = 5;
// Logs: "Count is: 5"

// Clean it up
cleanup();

// This update does NOT trigger the effect anymore
state.count = 10;
// (no log - effect is truly gone)
```

**Before cleanup module:**
```javascript
cleanup(); // Just sets currentEffect = null
state.count = 10; // Effect STILL runs! Memory leak!
```

**After cleanup module:**
```javascript
cleanup(); // Removes effect from all dependency tracking
state.count = 10; // Effect does NOT run. Clean memory!
```

---

### `state.$watch(key, callback)` ✨ Enhanced

**What it does:**  
Watches a specific property and calls your callback when it changes. Now cleans up properly.

**Returns:**  
A cleanup function.

```javascript
const state = ReactiveUtils.state({ name: 'Alice' });

const cleanup = state.$watch('name', (newName, oldName) => {
  console.log(`Name changed from ${oldName} to ${newName}`);
});

state.name = 'Bob';
// Logs: "Name changed from Alice to Bob"

cleanup(); // Remove the watcher

state.name = 'Charlie';
// (no log - watcher is removed)
```

**Why this matters:**  
If you create watchers in a component and forget to clean them up, they'll keep running even after the component is destroyed. This module fixes that.

---

### `state.$computed(key, fn)` ✨ Enhanced

**What it does:**  
Creates a computed property that updates when its dependencies change. Now tracks cleanup internally.

```javascript
const state = ReactiveUtils.state({
  firstName: 'John',
  lastName: 'Doe'
});

state.$computed('fullName', function() {
  return `${this.firstName} ${this.lastName}`;
});

console.log(state.fullName); // "John Doe"

state.firstName = 'Jane';
console.log(state.fullName); // "Jane Doe"
```

**Cleanup:**  
Computed properties are cleaned up automatically when you call `state.$cleanup()` or when the state is destroyed.

---

### `state.$cleanup()` ⭐ New Method

**What it does:**  
Removes all effects, watchers, and computed properties tracking this state.

**When to use:**  
When you're done with a state object and want to free memory.

```javascript
const state = ReactiveUtils.state({ value: 0 });

// Create some effects
const cleanup1 = ReactiveUtils.effect(() => console.log(state.value));
const cleanup2 = ReactiveUtils.effect(() => console.log(state.value * 2));

// Create a computed
state.$computed('doubled', function() {
  return this.value * 2;
});

// Clean up EVERYTHING tracking this state
state.$cleanup();

// Now all effects and computed properties are removed
state.value = 10; // Nothing happens - all tracking removed
```

**Real-world use case:**
```javascript
function createWidget(config) {
  const state = ReactiveUtils.state(config);
  
  // ... set up effects, watches, computed properties
  
  return {
    state,
    destroy() {
      state.$cleanup(); // Clean up everything at once
    }
  };
}
```

---

### `component.$destroy()` ✨ Enhanced

**What it does:**  
If you're using `ReactiveUtils.component()`, the `$destroy()` method now automatically cleans up all internal state.

```javascript
const counter = ReactiveUtils.component({
  state: { count: 0 },
  
  watch: {
    count(newVal) {
      console.log('Count:', newVal);
    }
  },
  
  effects: {
    logDouble() {
      console.log('Double:', this.count * 2);
    }
  }
});

counter.count = 5;
// Logs: "Count: 5"
// Logs: "Double: 10"

counter.$destroy(); // Cleans up ALL effects and watches

counter.count = 10;
// (no logs - everything is cleaned up)
```

---

## 2️⃣ Helper APIs

Tools for managing multiple cleanups in complex scenarios.

### `ReactiveCleanup.collector()` 🔧

**What it does:**  
Creates a cleanup collector that lets you group multiple cleanup functions together.

**When to use:**  
When you have multiple effects, watchers, or subscriptions that should all be cleaned up together.

**Returns:**  
A collector object with these methods:

#### `collector.add(cleanup)`

Add a cleanup function to the collector.

```javascript
const collector = ReactiveCleanup.collector();

// Add multiple cleanups
collector.add(ReactiveUtils.effect(() => { ... }));
collector.add(state.$watch('value', () => { ... }));
collector.add(() => console.log('Custom cleanup'));

console.log(collector.size); // 3
```

#### `collector.cleanup()`

Run all collected cleanup functions.

```javascript
collector.cleanup(); // Calls all 3 cleanup functions
console.log(collector.size); // 0 (cleanups are cleared)
```

#### `collector.size` (getter)

Returns the number of cleanups currently collected.

#### `collector.disposed` (getter)

Returns `true` if the collector has been disposed.

**Real-world example:**
```javascript
class TodoList {
  constructor() {
    this.state = ReactiveUtils.state({
      todos: [],
      filter: 'all'
    });
    
    this.cleanups = ReactiveCleanup.collector();
    
    // Watch for filter changes
    this.cleanups.add(
      this.state.$watch('filter', (newFilter) => {
        this.renderFiltered(newFilter);
      })
    );
    
    // Effect for rendering
    this.cleanups.add(
      ReactiveUtils.effect(() => {
        this.render(this.state.todos);
      })
    );
  }
  
  destroy() {
    this.cleanups.cleanup(); // Clean up everything
  }
}
```

---

### `ReactiveCleanup.scope(fn)` 🎯

**What it does:**  
Creates a cleanup scope where all reactive operations are automatically collected.

**When to use:**  
When you want to create multiple effects temporarily and clean them all up at once.

**Returns:**  
A cleanup function that disposes everything created inside the scope.

```javascript
const cleanup = ReactiveCleanup.scope((collect) => {
  const state = ReactiveUtils.state({ count: 0 });
  
  // Everything you collect is automatically tracked
  collect(
    ReactiveUtils.effect(() => {
      console.log('Effect 1:', state.count);
    })
  );
  
  collect(
    ReactiveUtils.effect(() => {
      console.log('Effect 2:', state.count * 2);
    })
  );
  
  collect(
    state.$watch('count', (newVal) => {
      console.log('Watch:', newVal);
    })
  );
});

// Later, clean up everything at once
cleanup(); // All 3 reactive operations are disposed
```

**Real-world example:**
```javascript
function mountComponent(element, props) {
  const cleanup = ReactiveCleanup.scope((collect) => {
    const state = ReactiveUtils.state(props);
    
    // All effects are auto-collected
    collect(ReactiveUtils.effect(() => {
      element.textContent = state.message;
    }));
    
    collect(state.$watch('theme', (theme) => {
      element.className = theme;
    }));
  });
  
  return cleanup; // Return the cleanup function
}

// Mount component
const unmount = mountComponent(document.querySelector('#app'), {
  message: 'Hello',
  theme: 'dark'
});

// When done, unmount
unmount(); // All effects cleaned up
```

---

## 3️⃣ Advanced APIs

For debugging, testing, and manual control.

### `ReactiveCleanup.test()` 🧪

**What it does:**  
Runs an automated test to verify cleanup is working properly.

**When to use:**  
During development to verify the cleanup system is functioning.

```javascript
ReactiveCleanup.test();

// Console output:
// [Cleanup] Running cleanup test...
// ✅ Cleanup test PASSED - disposed effects not called
//    Initial runs: 100, Update runs: 0
```

**What it tests:**
- Creates 100 effects
- Disposes all of them
- Updates the state
- Verifies the disposed effects don't run

---

### `ReactiveCleanup.debug(enable)` 🐛

**What it does:**  
Enables debug mode to log cleanup operations.

**When to use:**  
When you suspect memory leaks or want to understand cleanup behavior.

**Parameters:**
- `enable` (boolean) - `true` to enable, `false` to disable. Default: `true`

```javascript
// Enable debug mode
ReactiveCleanup.debug(true);
// [Cleanup] Debug mode enabled
// [Cleanup] Use ReactiveCleanup.getStats() for statistics

// Now you'll see detailed logs of cleanup operations

// Disable debug mode
ReactiveCleanup.debug(false);
```

---

### `ReactiveCleanup.getStats()` 📊

**What it does:**  
Returns statistics about the cleanup system.

**Returns:**  
An object with diagnostic information.

```javascript
const stats = ReactiveCleanup.getStats();
console.log(stats);
// {
//   message: 'Cleanup system active',
//   note: 'WeakMaps prevent direct counting, but cleanup is working properly'
// }
```

**Note:**  
Due to WeakMaps (which prevent memory leaks), we can't count exact numbers. But the system provides status information.

---

### `ReactiveCleanup.patchState(state)` 🔧

**What it does:**  
Manually patches an existing reactive state to use the cleanup system.

**When to use:**  
Rarely needed—the module automatically patches new states. Use this if you have states created before loading the cleanup module.

```javascript
// State created before cleanup module loaded
const oldState = ReactiveUtils.state({ value: 0 });

// Manually patch it
ReactiveCleanup.patchState(oldState);

// Now it supports cleanup
oldState.$cleanup();
```

---

### `ReactiveCleanup.isActive(effectFn)` ✔️

**What it does:**  
Checks if an effect is still active (not disposed).

**Parameters:**
- `effectFn` - The effect function to check

**Returns:**  
`true` if active, `false` if disposed

```javascript
const effect = ReactiveUtils.effect(() => {
  console.log('Running');
});

console.log(ReactiveCleanup.isActive(effect)); // true

const cleanup = effect; // effect returns its cleanup function
cleanup();

console.log(ReactiveCleanup.isActive(effect)); // false
```

---

## 🎓 Quick Reference Card

```javascript
// ============================================
// AUTOMATIC (No code changes needed)
// ============================================

const cleanup = ReactiveUtils.effect(() => ...);
cleanup(); // ✅ Now properly removes from memory

const cleanup = state.$watch('key', callback);
cleanup(); // ✅ Now properly removes watcher

state.$cleanup(); // ✅ New: Remove all tracking


// ============================================
// HELPERS (For managing multiple cleanups)
// ============================================

// Collector pattern
const collector = ReactiveCleanup.collector();
collector.add(cleanup1);
collector.add(cleanup2);
collector.cleanup(); // Clean all at once

// Scope pattern
const cleanup = ReactiveCleanup.scope((collect) => {
  collect(effect1);
  collect(watch1);
});
cleanup(); // Clean all at once


// ============================================
// ADVANCED (Debugging and testing)
// ============================================

ReactiveCleanup.test();           // Test cleanup
ReactiveCleanup.debug(true);      // Enable debug
ReactiveCleanup.getStats();       // Get stats
ReactiveCleanup.patchState(state); // Manual patch
ReactiveCleanup.isActive(effect); // Check if active
```

---

## 🚀 Common Patterns

### Pattern 1: Simple Component

```javascript
function createCounter() {
  const state = ReactiveUtils.state({ count: 0 });
  
  const cleanup = ReactiveUtils.effect(() => {
    document.querySelector('#count').textContent = state.count;
  });
  
  return {
    state,
    destroy: cleanup // Just return the cleanup function
  };
}
```

### Pattern 2: Complex Component

```javascript
function createDashboard() {
  const state = ReactiveUtils.state({ /* ... */ });
  const cleanups = ReactiveCleanup.collector();
  
  // Add multiple effects
  cleanups.add(ReactiveUtils.effect(() => { /* ... */ }));
  cleanups.add(ReactiveUtils.effect(() => { /* ... */ }));
  cleanups.add(state.$watch('user', () => { /* ... */ }));
  
  return {
    state,
    destroy: () => cleanups.cleanup()
  };
}
```

### Pattern 3: Temporary Scope

```javascript
function showModal() {
  const cleanup = ReactiveCleanup.scope((collect) => {
    const state = ReactiveUtils.state({ /* ... */ });
    
    collect(ReactiveUtils.effect(() => { /* render */ }));
    collect(state.$watch('closed', () => { /* animate out */ }));
  });
  
  // When modal closes
  modal.onClose = cleanup;
}
```

---

## ✅ Summary

**You get these automatically:**
- `ReactiveUtils.effect()` - Now cleans up properly
- `state.$watch()` - Now cleans up properly
- `state.$cleanup()` - Remove all tracking for a state
- `component.$destroy()` - Enhanced with automatic cleanup

**Helper tools you can use:**
- `ReactiveCleanup.collector()` - Group multiple cleanups
- `ReactiveCleanup.scope()` - Auto-collect in a scope

**Debug tools:**
- `ReactiveCleanup.test()` - Verify it works
- `ReactiveCleanup.debug()` - Enable logging
- `ReactiveCleanup.getStats()` - Get system info

That's it! Load the module and your memory leaks are gone. 🎉
