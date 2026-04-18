[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Real-World Examples, Diagnostics, and API Reference

Let's see cleanup patterns solving real problems, explore the diagnostic tools, and wrap up with the complete API reference.

---

## Example 1: Tab Panel — Show/Hide Panels

### The scenario

A tabbed interface where each panel has its own reactive effects. When a tab is switched, the previous panel's effects should stop.

```javascript
const panels = {};

function createPanel(name, data) {
  const state = ReactiveUtils.state({ items: data, filter: '' });

  const cleanup = ReactiveCleanup.scope(register => {
    register(
      ReactiveUtils.effect(() => {
        const filtered = state.items.filter(i =>
          i.name.includes(state.filter)
        );
        document.getElementById(`${name}-list`).innerHTML =
          filtered.map(i => `<div>${i.name}</div>`).join('');
      })
    );

    register(
      ReactiveUtils.effect(() => {
        document.getElementById(`${name}-count`).textContent =
          `${state.items.length} items`;
      })
    );
  });

  panels[name] = { state, cleanup };
}

function removePanel(name) {
  if (panels[name]) {
    panels[name].cleanup();  // All effects for this panel stop
    delete panels[name];
  }
}

// Create panels
createPanel('users', [{ name: 'Alice' }, { name: 'Bob' }]);
createPanel('products', [{ name: 'Widget' }, { name: 'Gadget' }]);

// Later, remove the users panel
removePanel('users');
// Effects for users panel are fully disposed
// Products panel continues working
```

**Key pattern:** Each panel owns a `scope` cleanup function. Removing the panel calls it.

---

## Example 2: Modal Dialog — Temporary Effects

### The scenario

A modal that creates effects when opened and disposes them when closed.

```javascript
function openModal(data) {
  const state = ReactiveUtils.state({
    isVisible: true,
    content: data
  });

  const collector = ReactiveCleanup.collector();

  // Effect: render modal content
  collector.add(
    ReactiveUtils.effect(() => {
      document.getElementById('modalContent').textContent = state.content;
    })
  );

  // Effect: animate backdrop
  collector.add(
    ReactiveUtils.effect(() => {
      document.getElementById('backdrop').style.opacity =
        state.isVisible ? '1' : '0';
    })
  );

  // Close function
  function close() {
    state.isVisible = false;

    setTimeout(() => {
      collector.cleanup();  // Dispose all effects
      document.getElementById('modal').remove();
    }, 300);  // Wait for fade-out animation
  }

  return { state, close };
}

const modal = openModal('Hello!');

// Later:
modal.close();
// Effects cleaned up after animation
```

**Key pattern:** Collector gathers effects during modal creation, `.cleanup()` on close.

---

## Example 3: Component Lifecycle

### The scenario

A component that creates effects in its setup and cleans them up when destroyed.

```javascript
function createCounter(elementId) {
  const counter = ReactiveUtils.component({
    state: { count: 0 },
    actions: {
      increment() { this.count++; },
      decrement() { this.count--; }
    }
  });

  // Create effects for this component
  ReactiveUtils.effect(() => {
    const el = document.getElementById(elementId);
    if (el) el.textContent = counter.count;
  });

  ReactiveUtils.effect(() => {
    const btn = document.getElementById(`${elementId}-reset`);
    if (btn) btn.disabled = counter.count === 0;
  });

  return counter;
}

const myCounter = createCounter('counter1');

myCounter.increment();
myCounter.increment();

// When done with the counter:
myCounter.$destroy();
// Component teardown + $cleanup() runs automatically
// Both effects are disposed
```

**Key pattern:** Enhanced `$destroy()` automatically calls `$cleanup()` — no manual disposal needed.

---

## Example 4: Interval + Effect Cleanup

### The scenario

An effect paired with a `setInterval` that both need cleanup.

```javascript
function createLiveClock(elementId) {
  const state = ReactiveUtils.state({ time: new Date() });

  const collector = ReactiveCleanup.collector();

  // Update time every second
  const intervalId = setInterval(() => {
    state.time = new Date();
  }, 1000);

  // Register the interval cleanup
  collector.add(() => clearInterval(intervalId));

  // Register the effect
  collector.add(
    ReactiveUtils.effect(() => {
      document.getElementById(elementId).textContent =
        state.time.toLocaleTimeString();
    })
  );

  return () => collector.cleanup();
}

const stopClock = createLiveClock('clock');

// Later:
stopClock();
// Interval cleared + effect disposed
```

**Key pattern:** Collectors can hold **any cleanup function**, not just effect disposals. Here we mix `clearInterval` with effect disposal.

---

## Example 5: Watcher with Cleanup

### The scenario

Watching for a specific condition and stopping once it's met.

```javascript
const state = ReactiveUtils.state({ progress: 0 });

const stopWatching = state.$watch('progress', (newVal) => {
  console.log(`Progress: ${newVal}%`);

  if (newVal >= 100) {
    console.log('Complete!');
    stopWatching();  // Stop watching once done
  }
});

state.progress = 25;   // Logs: "Progress: 25%"
state.progress = 50;   // Logs: "Progress: 50%"
state.progress = 100;  // Logs: "Progress: 100%" and "Complete!"
state.progress = 101;  // Nothing logged — watcher was disposed
```

**Key pattern:** `$watch` returns a dispose function that can be called conditionally.

---

## Example 6: Dynamic List of Effects

### The scenario

Creating and removing effects as items are added and removed from a list.

```javascript
const effectMap = new Map();  // itemId → dispose function

function trackItem(id, state) {
  // Dispose existing effect for this id if any
  if (effectMap.has(id)) {
    effectMap.get(id)();
  }

  // Create a new effect
  const dispose = ReactiveUtils.effect(() => {
    const el = document.getElementById(`item-${id}`);
    if (el) el.textContent = state.items.find(i => i.id === id)?.name;
  });

  effectMap.set(id, dispose);
}

function untrackItem(id) {
  if (effectMap.has(id)) {
    effectMap.get(id)();  // Dispose the effect
    effectMap.delete(id);
  }
}

function untrackAll() {
  effectMap.forEach(dispose => dispose());
  effectMap.clear();
}
```

**Key pattern:** Store dispose functions in a `Map` keyed by item ID for targeted cleanup.

---

## Diagnostic Tools

The cleanup system includes tools for testing and debugging.

---

### ReactiveCleanup.debug(enable?)

Enables or disables debug mode. When enabled, logs additional information about cleanup operations.

```javascript
ReactiveCleanup.debug();       // Enable debug mode
ReactiveCleanup.debug(true);   // Enable debug mode
ReactiveCleanup.debug(false);  // Disable debug mode
```

**Returns:** the CleanupAPI (for chaining)

---

### ReactiveCleanup.getStats()

Returns information about the cleanup system.

```javascript
const stats = ReactiveCleanup.getStats();
console.log(stats);
// {
//   message: 'Cleanup system active',
//   note: 'WeakMaps prevent direct counting, but cleanup is working properly'
// }
```

Because the registries use `WeakMap`, individual entries can't be counted (WeakMaps don't have a `.size` property). The stats confirm the system is active.

---

### ReactiveCleanup.test()

Runs a built-in self-test that verifies cleanup is working correctly.

```javascript
ReactiveCleanup.test();
```

**What the test does:**

```
1️⃣ Creates a reactive state { count: 0 }
   ↓
2️⃣ Creates 100 effects that read state.count
   ↓
3️⃣ Immediately disposes all 100 effects
   ↓
4️⃣ Updates state.count
   ↓
5️⃣ Checks: did any disposed effect run?
   ├── NO  → ✅ "Cleanup test PASSED"
   └── YES → ❌ "Cleanup test FAILED"
```

Run this in the browser console to verify the cleanup system is working in your environment.

---

## Best Practices

### ✅ Use scope for self-contained setups

```javascript
// ✅ Clean, one-function-in one-function-out
function createWidget() {
  return ReactiveCleanup.scope(register => {
    register(ReactiveUtils.effect(() => { ... }));
    register(ReactiveUtils.effect(() => { ... }));
  });
}

const destroy = createWidget();
// Later: destroy();
```

### ✅ Use collector when effects are added over time

```javascript
// ✅ Effects added incrementally
const collector = ReactiveCleanup.collector();

button.addEventListener('click', () => {
  collector.add(
    ReactiveUtils.effect(() => { ... })
  );
});

// Later: collector.cleanup();
```

### ✅ Mix different cleanup types in a collector

```javascript
// ✅ Collectors accept any function, not just effect disposals
collector.add(dispose);                        // Effect disposal
collector.add(() => clearInterval(timerId));   // Timer cleanup
collector.add(() => element.remove());         // DOM cleanup
collector.add(() => socket.close());           // Connection cleanup
```

### ✅ Let components handle their own cleanup

```javascript
// ✅ $destroy() automatically calls $cleanup()
const comp = ReactiveUtils.component({ state: { ... } });
// Just call $destroy() — no manual cleanup needed
comp.$destroy();
```

### ❌ Don't create effects without cleanup in dynamic contexts

```javascript
// ❌ In a function called many times — effects accumulate
function renderItem(item) {
  ReactiveUtils.effect(() => {
    // This effect is never disposed!
  });
}

// ✅ Return the dispose function or use a collector
function renderItem(item) {
  return ReactiveUtils.effect(() => {
    // Caller is responsible for disposal
  });
}
```

---

## Complete API Reference

### Patched Methods (Transparent Enhancements)

| Method | Change | Returns |
|--------|--------|---------|
| `ReactiveUtils.effect(fn)` | Now supports disposal | `dispose()` function |
| `ReactiveUtils.state(obj)` | Adds `$cleanup` + enhanced `$watch`/`$computed` | Reactive state |
| `state.$watch(key, fn)` | Now supports disposal | `dispose()` function |
| `state.$computed(key, fn)` | Tracked for cleanup; old cleaned up on redefine | State (chainable) |
| `component.$destroy()` | Now calls `$cleanup()` automatically | — |
| `builder.build().destroy()` | Now calls `$cleanup()` automatically | — |

### New Instance Method

| Method | Description |
|--------|-------------|
| `state.$cleanup()` | Dispose all effects and computed properties for this state |

### Cleanup API (ReactiveCleanup)

| Method | Returns | Description |
|--------|---------|-------------|
| `.collector()` | Collector object | Create a cleanup collector |
| `.scope(fn)` | `cleanup()` function | Create a cleanup scope |
| `.patchState(state)` | State | Manually add cleanup support to a state |
| `.isActive(effectFn)` | Boolean | Check if an effect is still active |
| `.getStats()` | Object | Get system status |
| `.debug(enable?)` | CleanupAPI | Enable/disable debug mode |
| `.test()` | — | Run the built-in self-test |

### Collector Object

| Property/Method | Returns | Description |
|-----------------|---------|-------------|
| `.add(cleanup)` | Collector | Add a dispose function (chainable) |
| `.cleanup()` | — | Run all dispose functions and clear |
| `.size` | Number | Number of registered cleanups |
| `.disposed` | Boolean | Whether cleanup has been called |

### Also Available On

```javascript
ReactiveUtils.cleanup     // Same as ReactiveCleanup
ReactiveUtils.collector() // Same as ReactiveCleanup.collector()
ReactiveUtils.scope(fn)   // Same as ReactiveCleanup.scope(fn)
```

---

## Load Order

```html
<!-- 1. Reactive State (required) -->
<script src="04_reactive/01_dh-reactive.js"></script>

<!-- 2. Array Patch (recommended) -->
<script src="04_reactive/02_dh-reactive-array-patch.js"></script>

<!-- 3. Collections, Forms (optional) -->
<script src="04_reactive/03_dh-reactive-collections.js"></script>
<script src="04_reactive/04_dh-reactive-form.js"></script>

<!-- 4. Cleanup System (must come AFTER reactive core) -->
<script src="04_reactive/05_dh-reactive-cleanup.js"></script>
```

**Order matters:** The cleanup module patches `ReactiveUtils.state()` and `ReactiveUtils.effect()`, so it must load after the reactive core. It also patches `component()` and `reactive()` if they exist, so load it after those too.

---

## Module Architecture

```
05_dh-reactive-cleanup.js (single IIFE)
│
├── STEP 1: Verify ReactiveUtils exists
├── STEP 2: Create effectRegistry + stateRegistry (WeakMaps)
├── STEP 3: Enhanced effect() with dispose support
├── STEP 4: Enhanced state() with $cleanup, $watch, $computed
├── STEP 5: Patch ReactiveUtils.state and .effect
├── STEP 6: Enhanced component.$destroy
├── STEP 7: Enhanced reactive builder .destroy
├── STEP 8: Cleanup utilities (collector, scope, patchState, isActive)
├── STEP 9: Export to ReactiveCleanup + ReactiveUtils
└── STEP 10: Diagnostic tools (debug, test, getStats)
```

---

## Congratulations!

You've completed the Reactive Cleanup learning path. You now understand:

- ✅ Why cleanup exists — preventing zombie effects and memory leaks
- ✅ How `effect()` and `$watch()` return dispose functions
- ✅ How `$cleanup()` disposes all effects for a state
- ✅ How collectors group multiple dispose functions
- ✅ How scopes provide a clean setup-and-teardown pattern
- ✅ How components and builders auto-cleanup on destroy
- ✅ The dual WeakMap registry architecture
- ✅ Diagnostic tools for testing and debugging

**Your reactive lifecycle management is production-ready!**