[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Cleanup Methods Deep Dive

When you have many effects to dispose, managing individual `dispose()` functions gets tedious. The cleanup system provides **collectors** and **scopes** to group disposals together.

---

## The Collector

### What is it?

A **collector** is a container that gathers multiple dispose functions and cleans them all up at once.

### Syntax

```javascript
const collector = ReactiveCleanup.collector();
// or
const collector = ReactiveUtils.collector();
```

### Basic Example

```javascript
const state = ReactiveUtils.state({ x: 0, y: 0, z: 0 });
const collector = ReactiveCleanup.collector();

// Add dispose functions to the collector
collector.add(
  ReactiveUtils.effect(() => console.log('x:', state.x))
);

collector.add(
  ReactiveUtils.effect(() => console.log('y:', state.y))
);

collector.add(
  ReactiveUtils.effect(() => console.log('z:', state.z))
);

console.log(collector.size);  // 3

// Clean up all at once
collector.cleanup();

state.x = 1;  // Nothing happens
state.y = 2;  // Nothing happens
state.z = 3;  // Nothing happens
```

### How it works

```
collector = ReactiveCleanup.collector()
   ↓
Creates an internal array: cleanups = []
   ↓
collector.add(dispose1)  → cleanups = [dispose1]
collector.add(dispose2)  → cleanups = [dispose1, dispose2]
collector.add(dispose3)  → cleanups = [dispose1, dispose2, dispose3]
   ↓
collector.cleanup()
   ↓
1️⃣ Marks collector as disposed
2️⃣ Calls each cleanup function in order:
   ├── dispose1()
   ├── dispose2()
   └── dispose3()
3️⃣ Clears the array: cleanups = []
```

### Collector Properties and Methods

| Property/Method | Returns | Description |
|-----------------|---------|-------------|
| `.add(cleanup)` | Collector | Add a dispose function (chainable) |
| `.cleanup()` | — | Run all dispose functions and clear |
| `.size` | Number | How many dispose functions are stored |
| `.disposed` | Boolean | Whether `.cleanup()` has been called |

### Chaining .add()

The `.add()` method returns the collector, so you can chain:

```javascript
const collector = ReactiveCleanup.collector();

collector
  .add(ReactiveUtils.effect(() => console.log(state.x)))
  .add(ReactiveUtils.effect(() => console.log(state.y)))
  .add(ReactiveUtils.effect(() => console.log(state.z)));
```

### Safety Features

**Adding to a disposed collector logs a warning:**

```javascript
const collector = ReactiveCleanup.collector();
collector.cleanup();

collector.add(someDispose);
// Console: [Cleanup] Cannot add to disposed collector
```

**Errors in individual cleanups don't stop the rest:**

```javascript
const collector = ReactiveCleanup.collector();

collector.add(() => { throw new Error('oops'); });
collector.add(() => console.log('This still runs'));

collector.cleanup();
// Console error: [Cleanup] Collector error: Error: oops
// Console: "This still runs"  ← still executes
```

**Cleanup is idempotent:**

```javascript
collector.cleanup();  // Runs all cleanups
collector.cleanup();  // Does nothing (already disposed)
```

---

## The Scope

### What is it?

A **scope** is a function that automatically creates a collector, gives you a way to register cleanups, and returns a single cleanup function.

Think of it as a streamlined version of the collector pattern.

### Syntax

```javascript
const cleanup = ReactiveCleanup.scope(register => {
  // Use register() to add cleanup functions
  register(dispose1);
  register(dispose2);
});

// Later:
cleanup();  // Disposes everything registered inside
```

### Basic Example

```javascript
const state = ReactiveUtils.state({ count: 0, name: 'Alice' });

const cleanup = ReactiveCleanup.scope(register => {
  register(
    ReactiveUtils.effect(() => {
      console.log('Count:', state.count);
    })
  );

  register(
    ReactiveUtils.effect(() => {
      console.log('Name:', state.name);
    })
  );

  register(
    state.$watch('count', (newVal) => {
      console.log('Count watched:', newVal);
    })
  );
});

state.count = 1;  // Effects and watcher run

// One call cleans up everything
cleanup();

state.count = 2;  // Nothing runs
```

### How it works

```
ReactiveCleanup.scope(fn)
   ↓
1️⃣ Creates a collector internally
   ↓
2️⃣ Calls fn(register), where register = (cleanup) => collector.add(cleanup)
   ↓
3️⃣ Your code calls register() to add dispose functions
   ↓
4️⃣ Returns a function: () => collector.cleanup()
```

### When to use scope vs collector

```
Use scope when:
├── You create all effects upfront in one place
├── You want the simplest possible API
└── You just need one cleanup function at the end

Use collector when:
├── You add effects over time (not all at once)
├── You need to check .size or .disposed
└── You want more control over the collector lifecycle
```

---

## Patching Existing State

### ReactiveCleanup.patchState(state)

If you created a state **before** the cleanup module loaded, or if a state somehow wasn't patched, you can manually patch it:

```javascript
// A state created before cleanup loaded
const oldState = someExistingState;

// Patch it to add cleanup support
ReactiveCleanup.patchState(oldState);

// Now it has $cleanup()
oldState.$cleanup();
```

**Returns:** the patched state

**Safety:** If the state is already patched (`__cleanupPatched` flag), calling `patchState` again does nothing. No double-patching.

---

## Checking Effect Status

### ReactiveCleanup.isActive(effectFn)

Checks whether a specific effect is still active (not disposed).

```javascript
const dispose = ReactiveUtils.effect(() => {
  console.log(state.count);
});

// The effect function is the internal execute function,
// not your callback. Use the dispose reference to check:
console.log(ReactiveCleanup.isActive(dispose));
```

**Returns:** `true` if the effect is active, `false` if disposed

---

## Enhanced Component and Builder Destroy

### Components

When the cleanup module loads, it enhances `ReactiveUtils.component()` so that `$destroy()` automatically calls `$cleanup()`:

```javascript
const counter = ReactiveUtils.component({
  state: { count: 0 },
  actions: {
    increment() { this.count++; }
  }
});

ReactiveUtils.effect(() => {
  console.log('Component count:', counter.count);
});

counter.increment();
// Logs: "Component count: 1"

// Destroy the component — effects are cleaned up automatically
counter.$destroy();

counter.count = 99;
// Nothing logged — $cleanup() was called inside $destroy()
```

**What happens inside the enhanced $destroy:**

```
component.$destroy()
   ↓
1️⃣ Calls the original $destroy() (teardown, lifecycle hooks)
   ↓
2️⃣ Calls this.$cleanup() (disposes all effects for this state)
```

### Reactive Builder

The builder pattern is also enhanced:

```javascript
const app = ReactiveUtils.reactive({ count: 0 })
  .computed('doubled', function() { return this.count * 2; })
  .build();

ReactiveUtils.effect(() => {
  console.log('Doubled:', app.doubled);
});

// Destroy the built state — effects are cleaned up
app.destroy();
```

---

## How the Registries Work Together

The two registries are mirrors of each other — one indexed by effect, the other by state:

```
effectRegistry (WeakMap)
─────────────────────────
effectA → {
  states: Map {
    state1 → Set { 'count', 'name' },
    state2 → Set { 'items' }
  },
  disposed: false
}

stateRegistry (WeakMap)
─────────────────────────
state1 → {
  effects: Map {
    'count' → Set { effectA, effectB },
    'name'  → Set { effectA }
  }
}
state2 → {
  effects: Map {
    'items' → Set { effectA, effectC }
  }
}
```

**Disposing effectA:**
- effectRegistry: marks effectA as disposed, clears its states
- stateRegistry: removes effectA from state1['count'], state1['name'], state2['items']

**Calling state1.$cleanup():**
- stateRegistry: for every key in state1, disposes every effect
- effectRegistry: each affected effect is fully unregistered

This bidirectional tracking ensures that no matter which direction you clean up from (effect → state, or state → effects), everything stays consistent.

---

## Common Mistakes

### ❌ Forgetting to use the collector in dynamic scenarios

```javascript
// ❌ Individual disposes are hard to manage when you have many
function createDashboard() {
  const d1 = ReactiveUtils.effect(() => { ... });
  const d2 = ReactiveUtils.effect(() => { ... });
  const d3 = ReactiveUtils.effect(() => { ... });
  const d4 = ReactiveUtils.effect(() => { ... });
  // You have to remember and call all four
}

// ✅ Use a collector or scope
function createDashboard() {
  return ReactiveCleanup.scope(register => {
    register(ReactiveUtils.effect(() => { ... }));
    register(ReactiveUtils.effect(() => { ... }));
    register(ReactiveUtils.effect(() => { ... }));
    register(ReactiveUtils.effect(() => { ... }));
  });
}

const destroyDashboard = createDashboard();
// Later: destroyDashboard(); — one call cleans up everything
```

### ❌ Adding non-functions to a collector

```javascript
// ❌ This won't do anything — only functions are accepted
collector.add('not a function');
collector.add(42);

// ✅ Only add dispose functions
collector.add(dispose);
collector.add(() => console.log('custom cleanup'));
```

### ❌ Expecting $cleanup to reset state values

```javascript
const state = ReactiveUtils.state({ count: 5 });

state.$cleanup();

// ❌ Values are NOT reset
console.log(state.count);  // 5

// $cleanup only removes effects and computed properties
// To reset values, use $update or reassign manually
```

---

## Key Takeaways

1. **Collector** — gathers multiple dispose functions, cleans up all at once with `.cleanup()`
2. **Scope** — shorthand for creating a collector, registering cleanups, and returning one dispose function
3. **patchState** — manually adds cleanup support to an existing state
4. **isActive** — checks if an effect is still running
5. **Component $destroy** and **builder destroy** automatically call `$cleanup()`
6. **Two WeakMap registries** enable bidirectional cleanup (effect → state and state → effects)
7. **All cleanup operations are idempotent** — calling them multiple times is safe
8. **Collector errors are caught** — one failing cleanup won't break the rest

---

## What's next?

Let's see real-world cleanup patterns, the diagnostic tools, and the complete API reference.

Let's continue!