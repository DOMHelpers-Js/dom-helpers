[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# What is Reactive Cleanup?

## Quick Start (30 seconds)

```javascript
// Create an effect and get a dispose function
const dispose = ReactiveUtils.effect(() => {
  console.log('Count:', state.count);
});

// Later, when you no longer need this effect:
dispose();

// Now state.count changes won't trigger the effect anymore
state.count = 99;  // Nothing logged
```

That's the core idea — every effect returns a **dispose function** that stops it from running.

---

## What is Reactive Cleanup?

**Reactive Cleanup** is a system that patches the DOMHelpers reactive library to provide **proper lifecycle management** for effects, watchers, and computed properties. It ensures that when you're done with a reactive effect, you can fully dispose of it — removing it from all dependency tracking so it never runs again.

Simply put, it's the "off switch" for reactive effects. Without it, effects could keep running even after you no longer need them.

---

## Why Does This Exist?

### The Challenge Without Cleanup

Imagine you have a dashboard with multiple panels. Each panel creates reactive effects to update the UI:

```javascript
function createPanel(data) {
  const state = ReactiveUtils.state({ items: data });

  // This effect renders the panel
  ReactiveUtils.effect(() => {
    document.getElementById('panel').innerHTML =
      state.items.map(i => `<div>${i.name}</div>`).join('');
  });

  // This effect tracks the count
  ReactiveUtils.effect(() => {
    document.getElementById('count').textContent = state.items.length;
  });
}
```

Now the user navigates away, and you remove the panel from the DOM. The HTML is gone — but the effects are still alive. Every time `state.items` changes, those effects try to update DOM elements that no longer exist.

**What's the real issue?**

```
Without cleanup:

Panel created → Effects registered
   ↓
Panel removed from DOM
   ↓
Effects still alive in memory
   ↓
state.items changes → Effects run → Try to update removed DOM
   ↓
❌ Wasted CPU cycles
❌ Potential errors (accessing removed elements)
❌ Memory held by closures that will never be freed
❌ Over time, hundreds of "zombie" effects accumulate
```

### The Cleanup Approach

```javascript
function createPanel(data) {
  const state = ReactiveUtils.state({ items: data });

  const dispose1 = ReactiveUtils.effect(() => {
    document.getElementById('panel').innerHTML =
      state.items.map(i => `<div>${i.name}</div>`).join('');
  });

  const dispose2 = ReactiveUtils.effect(() => {
    document.getElementById('count').textContent = state.items.length;
  });

  // Return a cleanup function
  return function destroyPanel() {
    dispose1();  // Stop the render effect
    dispose2();  // Stop the count effect
  };
}

const destroyPanel = createPanel(myData);

// Later, when removing the panel:
destroyPanel();  // Both effects are fully disposed
```

**What happens:**

```
With cleanup:

Panel created → Effects registered → dispose functions returned
   ↓
Panel removed from DOM → dispose() called
   ↓
Effects unregistered from all state dependencies
   ↓
state.items changes → Nothing happens ✅
   ↓
✅ No wasted CPU
✅ No errors
✅ Memory can be garbage collected
✅ Clean, predictable lifecycle
```

---

## Mental Model

Think of reactive effects as **magazine subscriptions**.

When you subscribe (create an effect), you receive updates every time a new issue comes out (state changes). Without cleanup, cancelling your subscription means throwing the magazines in the bin — but the publisher keeps sending them. They pile up at your door, wasting resources.

The Cleanup system is the **proper cancellation process**. When you call `dispose()`, you tell the publisher (the state) to stop sending updates to you (the effect). No more deliveries. No more pile-up.

---

## What Does the Cleanup System Add?

The cleanup module patches the existing reactive library. After it loads, here's what changes:

```
Before cleanup loads:              After cleanup loads:
──────────────────────             ──────────────────────
effect(() => { ... })              effect(() => { ... })
  → returns undefined                → returns dispose()

state.$watch(key, fn)              state.$watch(key, fn)
  → returns undefined                → returns dispose()

No $cleanup method                 state.$cleanup()
                                     → disposes ALL effects for this state

No collector utility               ReactiveCleanup.collector()
                                     → groups multiple dispose functions

No scope utility                   ReactiveCleanup.scope(fn)
                                     → auto-collects disposals

component.$destroy()               component.$destroy()
  → basic teardown                   → teardown + $cleanup()

reactive().build().destroy()       reactive().build().destroy()
  → basic teardown                   → teardown + $cleanup()
```

---

## How It Works (High Level)

The cleanup system introduces two registries using `WeakMap`:

```
┌─────────────────────────────────────────────────┐
│  effectRegistry (WeakMap)                       │
│  Maps each effect → { states, disposed }        │
│  Tracks which states/keys each effect depends on│
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  stateRegistry (WeakMap)                        │
│  Maps each state → { effects }                  │
│  Tracks which effects are watching each key     │
└─────────────────────────────────────────────────┘
```

When an effect is created:

```
1️⃣ Effect runs → accesses state.count
   ↓
2️⃣ effectRegistry records: "this effect depends on state.count"
   ↓
3️⃣ stateRegistry records: "state.count is watched by this effect"
```

When `dispose()` is called:

```
1️⃣ Effect marked as disposed
   ↓
2️⃣ effectRegistry: removes all state/key associations
   ↓
3️⃣ stateRegistry: removes this effect from all state keys
   ↓
4️⃣ Effect will never run again
```

**Why WeakMap?** Because WeakMaps allow garbage collection. When a state or effect object is no longer referenced anywhere else in your code, the WeakMap entry is automatically cleaned up by the browser. No manual memory management needed.

---

## Where Does It Come From?

### Available on these globals:

```javascript
ReactiveCleanup              // The cleanup API object
ReactiveCleanup.collector()  // Create a cleanup collector
ReactiveCleanup.scope(fn)    // Create a cleanup scope
ReactiveCleanup.patchState() // Patch an existing state
ReactiveCleanup.isActive()   // Check if an effect is active
ReactiveCleanup.getStats()   // Get system stats
ReactiveCleanup.debug()      // Enable debug mode
ReactiveCleanup.test()       // Run the built-in test

// Also on ReactiveUtils:
ReactiveUtils.cleanup         // Same as ReactiveCleanup
ReactiveUtils.collector()     // Same as ReactiveCleanup.collector()
ReactiveUtils.scope(fn)       // Same as ReactiveCleanup.scope()
```

### Patched methods (transparent — no API change):

```javascript
ReactiveUtils.effect(fn)      // Now returns dispose()
ReactiveUtils.state(obj)      // Now adds $cleanup()
state.$watch(key, fn)         // Now returns dispose()
state.$computed(key, fn)      // Now tracked for cleanup
component.$destroy()          // Now calls $cleanup() automatically
```

---

## Big Picture: How Cleanup Fits In

```
DOMHelpers Reactive System
│
├── 01_dh-reactive.js           → Core reactive state & effects
├── 02_dh-reactive-array-patch  → Array mutation reactivity
├── 03_dh-reactive-collections  → Collection management
├── 04_dh-reactive-form         → Form state management
├── 05_dh-reactive-cleanup      → Lifecycle & memory management ← YOU ARE HERE
```

The cleanup module sits on top of the reactive core. It doesn't replace the reactive system — it **enhances** it with proper disposal capabilities for production use.

---

## Key Takeaways

1. **Every `effect()` now returns a `dispose` function** that stops the effect from running
2. **`state.$cleanup()`** disposes all effects associated with a state
3. **WeakMaps** are used internally so garbage collection works naturally
4. **Components and builders** automatically call `$cleanup()` on destroy
5. **The cleanup system is transparent** — existing code works without changes, but now you can properly clean up when needed
6. **No zombie effects** — disposed effects never run again, even if their dependencies change

---

## What's next?

Let's walk through effect disposal and state cleanup step by step with detailed examples.

Let's continue!