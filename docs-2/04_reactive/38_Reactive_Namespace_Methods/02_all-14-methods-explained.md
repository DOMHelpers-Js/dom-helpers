[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# All 14 Methods Explained

Every namespace method with its instance-style equivalent, parameters, and return value.

---

## Core State Methods

### ReactiveUtils.set(state, updates)

Sets state values. Supports functional updates (pass a function to compute the new value from the old value).

```javascript
const state = ReactiveUtils.state({ count: 0, name: 'Alice' });

// Set a static value
ReactiveUtils.set(state, { name: 'Bob' });

// Set with a function (receives the previous value)
ReactiveUtils.set(state, { count: prev => prev + 1 });

console.log(state.count);  // 1
console.log(state.name);   // 'Bob'
```

| | Details |
|---|---|
| **Instance equivalent** | `state.$set(updates)` |
| **Parameters** | `state` — reactive state, `updates` — object with values or functions |
| **Returns** | The state |

---

### ReactiveUtils.cleanup(state)

Disposes all effects, watchers, and computed properties associated with a state.

```javascript
const state = ReactiveUtils.state({ count: 0 });

ReactiveUtils.effect(() => {
  console.log(state.count);
});

state.count = 1;  // Logs: 1

ReactiveUtils.cleanup(state);

state.count = 2;  // Nothing logged — effects are disposed
```

| | Details |
|---|---|
| **Instance equivalent** | `state.$cleanup()` |
| **Parameters** | `state` — reactive state |
| **Returns** | `undefined` |

---

### ReactiveUtils.getRaw(state)

Gets the raw, non-reactive version of the state object. Useful when you need to pass state data to an external library that doesn't work with proxies.

```javascript
const state = ReactiveUtils.state({ name: 'Alice', age: 30 });

const raw = ReactiveUtils.getRaw(state);
console.log(raw);  // { name: 'Alice', age: 30 } — plain object, no proxy
```

**How it works internally:**

```
ReactiveUtils.getRaw(state)
   ↓
1️⃣ Does state.$raw exist?
   ├── YES → return state.$raw
   └── NO  ↓
2️⃣ Does ReactiveUtils.toRaw exist?
   ├── YES → return ReactiveUtils.toRaw(state)
   └── NO  → return state (as-is)
```

| | Details |
|---|---|
| **Instance equivalent** | `state.$raw` (property, not method) |
| **Parameters** | `state` — reactive state |
| **Returns** | The raw object |

---

## Async State Methods

### ReactiveUtils.execute(asyncState, fn)

Runs an async function with automatic cancellation and race condition prevention.

```javascript
const users = ReactiveUtils.asyncState([]);

await ReactiveUtils.execute(users, async (signal) => {
  const response = await fetch('/api/users', { signal });
  return response.json();
});

console.log(users.data);       // [...users]
console.log(users.isSuccess);  // true
```

| | Details |
|---|---|
| **Instance equivalent** | `asyncState.$execute(fn)` |
| **Parameters** | `asyncState` — async reactive state, `fn` — async function receiving AbortSignal |
| **Returns** | Promise with `{ success, data/error/stale/aborted }` |

---

### ReactiveUtils.abort(asyncState)

Cancels the current in-flight async operation.

```javascript
const users = ReactiveUtils.asyncState([]);

ReactiveUtils.execute(users, async (signal) => {
  const response = await fetch('/api/users', { signal });
  return response.json();
});

// Cancel the request
ReactiveUtils.abort(users);

console.log(users.loading);  // false
```

| | Details |
|---|---|
| **Instance equivalent** | `asyncState.$abort()` |
| **Parameters** | `asyncState` — async reactive state |
| **Returns** | `undefined` |

---

### ReactiveUtils.reset(asyncState)

Resets async state to its initial values. Also aborts any in-flight request.

```javascript
const users = ReactiveUtils.asyncState([]);

await ReactiveUtils.execute(users, fetchUsers);
console.log(users.data);  // [...users]

ReactiveUtils.reset(users);
console.log(users.data);      // [] (initial value)
console.log(users.loading);   // false
console.log(users.error);     // null
```

| | Details |
|---|---|
| **Instance equivalent** | `asyncState.$reset()` |
| **Parameters** | `asyncState` — async reactive state |
| **Returns** | `undefined` |

---

### ReactiveUtils.refetch(asyncState)

Re-runs the last function passed to `$execute`.

```javascript
const users = ReactiveUtils.asyncState([]);

await ReactiveUtils.execute(users, async (signal) => {
  const res = await fetch('/api/users', { signal });
  return res.json();
});

// Later, refresh the data:
await ReactiveUtils.refetch(users);
```

| | Details |
|---|---|
| **Instance equivalent** | `asyncState.$refetch()` |
| **Parameters** | `asyncState` — async reactive state |
| **Returns** | Promise (or `undefined` if no previous function) |

---

## Component Method

### ReactiveUtils.destroy(component)

Destroys a component, cleaning up all effects, watchers, and resources.

```javascript
const counter = ReactiveUtils.component({
  state: { count: 0 },
  actions: {
    increment() { this.count++; }
  }
});

counter.increment();
console.log(counter.count);  // 1

ReactiveUtils.destroy(counter);
// Component is fully torn down
```

| | Details |
|---|---|
| **Instance equivalent** | `component.$destroy()` |
| **Parameters** | `component` — reactive component |
| **Returns** | `undefined` |

---

## Storage Methods

### ReactiveUtils.save(state)

Forces an immediate save of the state to storage.

```javascript
const state = ReactiveUtils.state({ theme: 'dark' });
ReactiveUtils.autoSave(state, 'settings');

state.theme = 'light';

// Force save immediately (bypasses debounce)
ReactiveUtils.save(state);
```

| | Details |
|---|---|
| **Instance equivalent** | `state.$save()` |
| **Parameters** | `state` — storage-enabled reactive state |
| **Returns** | `true` on success, `false` on error |

---

### ReactiveUtils.load(state)

Loads data from storage, overwriting the current state.

```javascript
ReactiveUtils.load(state);
console.log(state.theme);  // Loaded from localStorage
```

| | Details |
|---|---|
| **Instance equivalent** | `state.$load()` |
| **Parameters** | `state` — storage-enabled reactive state |
| **Returns** | `true` if data was found, `false` if not |

---

### ReactiveUtils.clear(state)

Removes this state's data from storage.

```javascript
ReactiveUtils.clear(state);
// localStorage key is removed
```

| | Details |
|---|---|
| **Instance equivalent** | `state.$clear()` |
| **Parameters** | `state` — storage-enabled reactive state |
| **Returns** | `true` on success, `false` on error |

---

### ReactiveUtils.exists(state)

Checks if saved data exists in storage.

```javascript
if (ReactiveUtils.exists(state)) {
  console.log('Saved data found');
}
```

| | Details |
|---|---|
| **Instance equivalent** | `state.$exists()` |
| **Parameters** | `state` — storage-enabled reactive state |
| **Returns** | `true` or `false` |

---

### ReactiveUtils.stopAutoSave(state)

Pauses automatic saving. State changes won't be persisted until `startAutoSave` is called.

```javascript
ReactiveUtils.stopAutoSave(state);

state.count = 99;  // NOT saved

ReactiveUtils.startAutoSave(state);
```

| | Details |
|---|---|
| **Instance equivalent** | `state.$stopAutoSave()` |
| **Parameters** | `state` — storage-enabled reactive state |
| **Returns** | The state |

---

### ReactiveUtils.startAutoSave(state)

Resumes automatic saving after it was paused.

```javascript
ReactiveUtils.startAutoSave(state);
state.count = 100;  // Saved again
```

| | Details |
|---|---|
| **Instance equivalent** | `state.$startAutoSave()` |
| **Parameters** | `state` — storage-enabled reactive state |
| **Returns** | The state |

---

### ReactiveUtils.storageInfo(state)

Gets information about the stored data.

```javascript
const info = ReactiveUtils.storageInfo(state);
console.log(info);
// {
//   key: 'settings',
//   namespace: 'myApp',
//   storage: 'localStorage',
//   exists: true,
//   size: 256,
//   sizeKB: 0.3
// }
```

| | Details |
|---|---|
| **Instance equivalent** | `state.$storageInfo()` |
| **Parameters** | `state` — storage-enabled reactive state |
| **Returns** | Object with key, namespace, storage, exists, size, sizeKB |

---

## Quick Reference: All 14 Methods

| Namespace Method | Instance Equivalent | Category |
|-----------------|-------------------|----------|
| `ReactiveUtils.set(state, updates)` | `state.$set(updates)` | Core |
| `ReactiveUtils.cleanup(state)` | `state.$cleanup()` | Core |
| `ReactiveUtils.getRaw(state)` | `state.$raw` | Core |
| `ReactiveUtils.execute(async, fn)` | `asyncState.$execute(fn)` | Async |
| `ReactiveUtils.abort(async)` | `asyncState.$abort()` | Async |
| `ReactiveUtils.reset(async)` | `asyncState.$reset()` | Async |
| `ReactiveUtils.refetch(async)` | `asyncState.$refetch()` | Async |
| `ReactiveUtils.destroy(comp)` | `component.$destroy()` | Component |
| `ReactiveUtils.save(state)` | `state.$save()` | Storage |
| `ReactiveUtils.load(state)` | `state.$load()` | Storage |
| `ReactiveUtils.clear(state)` | `state.$clear()` | Storage |
| `ReactiveUtils.exists(state)` | `state.$exists()` | Storage |
| `ReactiveUtils.stopAutoSave(state)` | `state.$stopAutoSave()` | Storage |
| `ReactiveUtils.startAutoSave(state)` | `state.$startAutoSave()` | Storage |
| `ReactiveUtils.storageInfo(state)` | `state.$storageInfo()` | Storage |

---

## Error Handling

Every namespace method validates its arguments before calling the instance method. If the state doesn't have the required `$` method, a console error is logged and a safe fallback is returned:

```javascript
const plainObject = { count: 0 };  // NOT a reactive state

ReactiveUtils.save(plainObject);
// Console: [Namespace Methods] Invalid state or $save not available
// Returns: false (no crash)

ReactiveUtils.cleanup(plainObject);
// Console: [Namespace Methods] Invalid state or $cleanup not available
// Returns: undefined (no crash)
```

This makes namespace methods safe to call even if you're unsure whether a state has a particular feature enabled.

---

## Key Takeaways

1. **14 methods** — 3 core, 4 async, 1 component, 7 storage (minus `getRaw` = 14 with it being the 15th, counted as part of core)
2. **Identical behavior** — namespace methods are thin wrappers around `$` methods
3. **Built-in validation** — safe to call even on invalid states
4. **State is always the first argument** — `ReactiveUtils.method(state, ...args)`

---

## What's next?

Let's see real-world usage patterns, where all methods are available, and the complete API reference.

Let's continue!