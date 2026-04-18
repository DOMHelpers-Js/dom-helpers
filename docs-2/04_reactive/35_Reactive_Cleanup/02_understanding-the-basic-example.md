[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Understanding the Basic Example

Let's break down how effect disposal and state cleanup actually work, step by step.

---

## The Full Example

```javascript
const state = ReactiveUtils.state({ count: 0, name: 'Alice' });

// Create an effect — it returns a dispose function
const dispose = ReactiveUtils.effect(() => {
  console.log(`Count is ${state.count}`);
});
// Logs: "Count is 0" (runs immediately)

state.count = 1;
// Logs: "Count is 1" (effect re-runs)

// Dispose the effect
dispose();

state.count = 2;
// Nothing logged — the effect is gone
```

Now let's understand each part.

---

## Step-by-Step Breakdown

### 1️⃣ Creating the State

```javascript
const state = ReactiveUtils.state({ count: 0, name: 'Alice' });
```

After the cleanup module is loaded, `ReactiveUtils.state()` is enhanced. It creates a reactive state **and** patches it with cleanup support:

```
ReactiveUtils.state({ count: 0, name: 'Alice' })
   ↓
1️⃣ Calls the original state() to create the reactive proxy
   ↓
2️⃣ Patches the state with cleanup tracking:
   ├── Enhanced $watch (returns dispose)
   ├── Enhanced $computed (tracked for cleanup)
   ├── Adds $cleanup() method
   └── Marks as __cleanupPatched (prevents double-patching)
   ↓
3️⃣ Returns the enhanced state
```

The state now has a `$cleanup()` method that didn't exist before.

---

### 2️⃣ Creating an Effect

```javascript
const dispose = ReactiveUtils.effect(() => {
  console.log(`Count is ${state.count}`);
});
```

The enhanced `effect()` function does several things:

```
ReactiveUtils.effect(fn)
   ↓
1️⃣ Creates an internal execute() function
   ↓
2️⃣ Creates a dispose() function
   ↓
3️⃣ Runs execute() immediately:
   ├── Sets up dependency tracking
   ├── Runs fn() — your effect body
   │   └── fn() accesses state.count
   │       └── Triggers the proxy's get trap
   │           └── Registers: "this effect depends on state.count"
   └── Records the dependency in both registries:
       ├── effectRegistry: effect → { state, 'count' }
       └── stateRegistry: state → { 'count': [effect] }
   ↓
4️⃣ Returns the dispose() function
```

**Key insight:** The `dispose` function is unique to this specific effect. Calling it removes only this effect — other effects on the same state continue working.

---

### 3️⃣ The Effect Re-runs

```javascript
state.count = 1;
// Logs: "Count is 1"
```

When `state.count` changes:

```
state.count = 1
   ↓
Proxy set trap fires
   ↓
Looks up stateRegistry for key 'count'
   ↓
Finds our effect in the set
   ↓
Runs the effect → console.log('Count is 1')
```

This is the normal reactive behavior — the cleanup system doesn't change how effects fire, it just adds the ability to stop them.

---

### 4️⃣ Disposing the Effect

```javascript
dispose();
```

This is where the cleanup system does its work:

```
dispose()
   ↓
1️⃣ Marks isDisposed = true (internal flag)
   ↓
2️⃣ Calls unregisterEffect(execute):
   ├── Looks up effectRegistry for this effect
   │   └── Finds: depends on state.count
   ├── Goes to stateRegistry → state → 'count'
   │   └── Removes this effect from the set
   ├── If the set is now empty, removes the key entry
   └── Clears the effect's state tracking
   ↓
3️⃣ Effect is fully disconnected

Before dispose:
stateRegistry[state]['count'] = { effect1 }
                                    ↑ our effect

After dispose:
stateRegistry[state]['count'] = { }
                                  ↑ empty — our effect is gone
```

---

### 5️⃣ State Changes After Disposal

```javascript
state.count = 2;
// Nothing logged
```

When `state.count` changes now:

```
state.count = 2
   ↓
Proxy set trap fires
   ↓
Looks up effects for key 'count'
   ↓
Set is empty — no effects to run
   ↓
Nothing happens ✅
```

The effect is completely removed from the system. It won't run, and it won't consume memory (the garbage collector can reclaim it).

---

## Using $watch with Cleanup

The `$watch` method is also enhanced to return a dispose function:

```javascript
const state = ReactiveUtils.state({ name: 'Alice' });

// $watch now returns a dispose function
const stopWatching = state.$watch('name', (newVal, oldVal) => {
  console.log(`Name changed: ${oldVal} → ${newVal}`);
});

state.name = 'Bob';
// Logs: "Name changed: Alice → Bob"

// Stop watching
stopWatching();

state.name = 'Charlie';
// Nothing logged — watcher is disposed
```

**How it works internally:** The enhanced `$watch` creates an `enhancedEffect` under the hood, so it gets the same disposal capabilities.

---

## Using $cleanup on a State

The `$cleanup()` method is the "nuclear option" — it disposes **all** effects associated with a state at once.

```javascript
const state = ReactiveUtils.state({ x: 0, y: 0 });

// Create multiple effects
ReactiveUtils.effect(() => console.log('x:', state.x));
ReactiveUtils.effect(() => console.log('y:', state.y));
ReactiveUtils.effect(() => console.log('sum:', state.x + state.y));

state.x = 1;  // All three effects run

// Clean up everything at once
state.$cleanup();

state.x = 2;  // Nothing runs — all effects are disposed
state.y = 3;  // Nothing runs
```

**What $cleanup does:**

```
state.$cleanup()
   ↓
1️⃣ Cleans up all computed property cleanups
   ↓
2️⃣ Looks up stateRegistry for this state
   ↓
3️⃣ For every key (x, y, etc.):
   └── For every effect in the set:
       └── Calls unregisterEffect(effect)
   ↓
4️⃣ Clears all effect sets
   ↓
All effects are disconnected from this state
```

---

## Dispose Is Idempotent

Calling `dispose()` multiple times is safe — it only runs once:

```javascript
const dispose = ReactiveUtils.effect(() => {
  console.log(state.count);
});

dispose();  // Disposes the effect
dispose();  // Does nothing (already disposed)
dispose();  // Does nothing (already disposed)
```

The same is true for `$cleanup()` and collector `.cleanup()`. They all check their disposed flag before doing anything.

---

## Enhanced $computed with Cleanup

The `$computed` method is also tracked. If you redefine a computed property, the old one is cleaned up first:

```javascript
const state = ReactiveUtils.state({ items: [1, 2, 3] });

// Create a computed property
state.$computed('total', function() {
  return this.items.reduce((sum, n) => sum + n, 0);
});

console.log(state.total);  // 6

// Redefine it — the old computed is cleaned up first
state.$computed('total', function() {
  return this.items.length;
});

console.log(state.total);  // 3

// $cleanup removes computed properties too
state.$cleanup();
```

---

## Common Mistakes

### ❌ Forgetting to capture the dispose function

```javascript
// ❌ dispose function is lost — you can never clean this up
ReactiveUtils.effect(() => {
  console.log(state.count);
});

// ✅ Capture the dispose function
const dispose = ReactiveUtils.effect(() => {
  console.log(state.count);
});
```

If you never need to clean up the effect (e.g., it runs for the entire app lifetime), it's fine to skip capturing the dispose function. But for dynamic UI where things come and go, always capture it.

### ❌ Calling dispose inside the effect itself

```javascript
// ❌ Don't try to dispose an effect from within itself
const dispose = ReactiveUtils.effect(() => {
  if (state.count > 10) {
    dispose();  // This may cause unexpected behavior
  }
});

// ✅ Use a condition and dispose from outside
const dispose = ReactiveUtils.effect(() => {
  console.log(state.count);
});

// Check from outside and dispose when needed
if (shouldStop) {
  dispose();
}
```

### ❌ Assuming $cleanup resets state values

```javascript
const state = ReactiveUtils.state({ count: 5 });

state.$cleanup();

// ❌ $cleanup does NOT reset values
console.log(state.count);  // Still 5

// $cleanup only removes effects and computed properties
// Values remain unchanged
```

---

## Key Takeaways

1. **`effect()` now returns a `dispose()` function** — call it to stop the effect
2. **`$watch()` also returns a `dispose()` function** — same pattern
3. **`state.$cleanup()`** disposes ALL effects and computed properties for that state
4. **Dispose is idempotent** — calling it multiple times is safe
5. **$cleanup does not reset values** — it only removes reactive subscriptions
6. **Always capture `dispose`** when effects are temporary (dynamic UI, components, panels)
7. **Two registries** (effectRegistry + stateRegistry) enable precise cleanup in both directions

---

## What's next?

Let's explore the cleanup utilities — collectors, scopes, and how to manage many dispose functions at once.

Let's continue!