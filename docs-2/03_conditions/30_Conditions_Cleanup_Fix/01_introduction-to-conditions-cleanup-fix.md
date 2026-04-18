[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Conditions Cleanup Fix — Introduction

## Quick Start (30 seconds)

```javascript
// Just load the module — your existing code is automatically fixed
// <script src="09_dh-conditions-cleanup-fix.js"></script>

// Use Conditions normally — event listeners are now properly cleaned up
const cleanup = Conditions.whenState(
  () => isActive.value,
  {
    'true':  { addEventListener: { click: handleClick } },
    'false': { classList: { add: 'disabled' } }
  },
  '.btn'
);

// destroy() now removes ALL event listeners — no memory leaks
cleanup.destroy();
```

---

## What Is the Cleanup Fix?

The Cleanup Fix is a **drop-in patch** for the Conditions module. It enhances `whenState()` and `watch()` so that calling `cleanup.destroy()` properly removes **all event listeners** that were attached through conditional configs.

Simply put — you load this file after the core Conditions module, and event listener cleanup just works. No API changes, no code rewrites. Your existing code stays the same, but now it cleans up properly.

---

## Why Does This Exist?

### The Situation: Event Listeners and destroy()

When you use `addEventListener` inside a Conditions config, the core module attaches listeners to elements as conditions are applied. Each time the state changes, the **previous** condition's listeners are removed and the **new** condition's listeners are attached.

That works great while the watcher is active. But when you call `cleanup.destroy()`, the watcher stops — and the **last applied** condition's listeners remain on the elements:

```javascript
const cleanup = Conditions.whenState(
  () => status.value,
  {
    'active': {
      classList: { add: 'active' },
      addEventListener: { click: handleClick }
    },
    'inactive': {
      classList: { remove: 'active' }
    }
  },
  '.btn'
);

// State changes work fine — listeners are swapped correctly
status.value = 'active';    // click handler attached
status.value = 'inactive';  // click handler removed, no new one
status.value = 'active';    // click handler attached again

// But when we destroy the watcher...
cleanup.destroy();

// The click handler from the last 'active' condition
// is still attached to .btn
```

This isn't a bug in the design — `destroy()` stops the **reactive effect** (so state changes no longer trigger updates). The listeners from the last applied condition simply remain because nothing explicitly removes them at that point.

### With the Cleanup Fix

The same code now fully cleans up:

```javascript
// Same setup — no changes needed
const cleanup = Conditions.whenState(
  () => status.value,
  {
    'active': {
      classList: { add: 'active' },
      addEventListener: { click: handleClick }
    },
    'inactive': {
      classList: { remove: 'active' }
    }
  },
  '.btn'
);

status.value = 'active';  // click handler attached

// Now destroy properly removes everything
cleanup.destroy();

// .btn has NO lingering event listeners
```

**What changed?**
- The module **tracks** which elements receive event listeners
- On `destroy()`, it **removes all tracked listeners first**, then calls the original destroy
- The result: complete, leak-free cleanup

---

## Mental Model

Think of it like a **hotel checkout system**.

```
Without the fix (no final checkout):
├── Guest checks in → room key works, lights turn on
├── Guest uses room services → orders room service, uses WiFi
├── Guest leaves → key is deactivated
└── But room services are still active!
   → WiFi still allocated, room service still on standby
   → Resources wasted until someone manually resets the room

With the fix (proper checkout):
├── Guest checks in → room key works, lights turn on
├── Guest uses room services → orders room service, uses WiFi
├── Guest checks out:
│   ├── Step 1: Cancel all room services (WiFi, room service)
│   ├── Step 2: Deactivate room key
│   └── Step 3: Mark room as available
└── Room is fully reset — ready for the next guest
```

The Cleanup Fix adds that **proper checkout step** — it cancels all "services" (event listeners) before deactivating the "room key" (stopping the reactive effect).

---

## How Does It Work?

```
You call: Conditions.whenState(valueFn, conditions, selector)
   ↓
1️⃣ Enhanced whenState creates a Set to track elements
   ↓
   trackedElements = new Set()
   ↓
2️⃣ Resolves selector → finds DOM elements → adds them to the Set
   ↓
3️⃣ Calls the ORIGINAL whenState (everything works as before)
   ↓
4️⃣ Returns an enhanced cleanup object:
   ├── update()  → tracks elements + calls original update
   └── destroy() → enhanced 3-step process:
       ├── Step 1: Remove all _whenStateListeners from tracked elements
       ├── Step 2: Call original destroy() (stops reactive effect)
       └── Step 3: Set isDestroyed = true (prevents double-destroy)
```

### The Tracking Mechanism

Every element that receives event listeners through Conditions gets a `_whenStateListeners` array. This array stores details about each listener:

```javascript
element._whenStateListeners = [
  { event: 'click',     handler: handleClick,  options: undefined },
  { event: 'mouseover', handler: handleHover,  options: { passive: true } }
];
```

The Cleanup Fix reads this array and calls `removeEventListener()` for each entry — using the exact same `event`, `handler`, and `options` that were used when the listener was added.

### The isDestroyed Flag

```
First destroy() call:
├── isDestroyed === false → proceed
├── Clean up listeners
├── Call original destroy
└── isDestroyed = true

Second destroy() call:
├── isDestroyed === true → return immediately
└── No error, no double-cleanup
```

This makes `destroy()` **idempotent** — safe to call multiple times without side effects.

---

## Syntax

The Cleanup Fix has **no new syntax** for `whenState()` or `watch()`. They work exactly the same as before:

```javascript
// whenState — same API, enhanced cleanup
const cleanup = Conditions.whenState(valueFn, conditions, selector, options);
cleanup.destroy();  // Now properly removes all listeners

// watch — same API, enhanced cleanup
const cleanup = Conditions.watch(valueFn, conditions, selector);
cleanup.destroy();  // Now properly removes all listeners
```

### New Utility Methods

The module adds three utility methods to `Conditions`:

```javascript
// Check for elements with active listeners (debugging)
const leaks = Conditions.checkListenerLeaks();

// Remove ALL Conditions listeners from ALL elements (emergency)
const count = Conditions.cleanupAllListeners();

// Restore original whenState/watch without the fix (testing)
Conditions.restoreCleanupFix();
```

---

## Basic Usage

### Using whenState() — Automatic Fix

```javascript
const isActive = state(false);

const cleanup = Conditions.whenState(
  () => isActive.value,
  {
    'true': {
      textContent: 'Active',
      addEventListener: { click: () => console.log('Clicked!') }
    },
    'false': {
      textContent: 'Inactive'
    }
  },
  '#myButton'
);

// Toggle state — listeners are managed automatically
isActive.value = true;   // click listener attached
isActive.value = false;  // click listener removed by core
isActive.value = true;   // click listener attached again

// Destroy — ALL listeners properly removed
cleanup.destroy();
// #myButton has no lingering click handlers
```

### Using watch() — Also Fixed

```javascript
const theme = state('light');

const cleanup = Conditions.watch(
  () => theme.value,
  {
    'dark': {
      style: { backgroundColor: '#1a1a1a' },
      addEventListener: { click: toggleTheme }
    },
    'light': {
      style: { backgroundColor: '#fff' },
      addEventListener: { click: toggleTheme }
    }
  },
  '.theme-toggle'
);

// Cleanup works properly
cleanup.destroy();
```

### Checking for Listener Leaks

```javascript
// Set up some watchers
const cleanup1 = Conditions.whenState(stateA, condA, '.btn-a');
const cleanup2 = Conditions.whenState(stateB, condB, '.btn-b');

// Check — should find active listeners
const leaks = Conditions.checkListenerLeaks();
console.log(leaks.length);  // 2

// Clean up
cleanup1.destroy();
cleanup2.destroy();

// Check again — should be clean
Conditions.checkListenerLeaks();
// Console: ✓ No listener leaks detected
```

### Emergency Cleanup

```javascript
// When cleanup references are lost or something goes wrong
const count = Conditions.cleanupAllListeners();
// Console: Emergency cleanup: removed listeners from N element(s)
```

---

## The Cleanup Object

The enhanced cleanup object returned by `whenState()` and `watch()`:

```javascript
const cleanup = Conditions.whenState(valueFn, conditions, selector);

// Methods
cleanup.update();    // Re-evaluates the condition (tracks new elements too)
cleanup.destroy();   // Removes all listeners, stops watcher, marks destroyed

// Behavior
cleanup.destroy();   // First call — full cleanup
cleanup.destroy();   // Second call — no-op (safe, no errors)
cleanup.destroy();   // Third call — still safe
```

### destroy() Step by Step

```
cleanup.destroy()
   ↓
1️⃣ Check: isDestroyed?
   ├── Yes → return immediately (no-op)
   └── No → continue
   ↓
2️⃣ For each tracked element:
   ├── Read element._whenStateListeners array
   ├── Call removeEventListener(event, handler, options) for each
   └── Clear the array
   ↓
3️⃣ Call original cleanup.destroy()
   └── Stops the reactive effect
   ↓
4️⃣ Set isDestroyed = true
   └── Future destroy() calls are no-ops
```

---

## Utility Methods

### Conditions.checkListenerLeaks()

Scans **every element** in the document for active `_whenStateListeners`. Returns an array of objects describing what it found:

```javascript
const leaks = Conditions.checkListenerLeaks();

// Each item in the array:
// {
//   element: <DOM Element>,
//   listenerCount: 2,
//   listeners: [
//     { event: 'click', handler: fn, options: undefined },
//     { event: 'mouseover', handler: fn, options: { passive: true } }
//   ]
// }
```

**When to use:** During development, after cleanup, in tests.

### Conditions.cleanupAllListeners()

Removes **all** `_whenStateListeners` from **all** elements in the entire document. This is the emergency button:

```javascript
const count = Conditions.cleanupAllListeners();
console.log(count);  // Number of elements that were cleaned
```

**When to use:** Emergency situations, lost cleanup references, before page navigation in SPAs.

### Conditions.restoreCleanupFix()

Removes the patch and restores the original `whenState()` and `watch()` methods:

```javascript
Conditions.restoreCleanupFix();
// Original methods restored
// checkListenerLeaks, cleanupAllListeners, restoreCleanupFix removed
```

**When to use:** Testing, debugging, comparing behavior with and without the fix.

---

## Integration

### Automatic Updates

When loaded, the module automatically updates all references to `whenState` and `watch` across the ecosystem:

```
Conditions.whenState  → Enhanced (patched)
Conditions.watch      → Enhanced (patched)
   ↓
Elements.whenState    → Updated to enhanced version
Collections.whenState → Updated to enhanced version
Selector.whenState    → Updated to enhanced version
   ↓
Global whenState      → Updated to enhanced version
Global whenWatch      → Updated to enhanced version
```

This means the fix works no matter which API surface you use:

```javascript
// All of these get proper listener cleanup:
Conditions.whenState(valueFn, conditions, selector);
Elements.whenState(valueFn, conditions, selector);
Collections.whenState(valueFn, conditions, selector);
whenState(valueFn, conditions, selector);  // Global shortcut
```

### Works with Batch States

Since Batch States (module 08) calls `whenState()` internally, the fix automatically applies to all batch methods:

```javascript
const cleanup = Conditions.whenWatches([
  [() => a.value, condA, '.btn-a'],
  [() => b.value, condB, '.btn-b']
]);

// All listeners from all watchers properly cleaned
cleanup.destroy();
```

---

## Load Order

```html
<!-- 1. Core Conditions (required) -->
<script src="01_dh-conditional-rendering.js"></script>

<!-- 2. Optional extensions (loaded before cleanup fix) -->
<script src="02_dh-conditions-default.js"></script>
<script src="03_dh-conditions-collection-extension.js"></script>
<script src="05_dh-conditions-global-shortcut.js"></script>
<script src="08_dh-conditions-batch-states.js"></script>

<!-- 3. Cleanup Fix (after all other Conditions modules) -->
<script src="09_dh-conditions-cleanup-fix.js"></script>
```

Loading it last ensures it patches the final versions of `whenState()` and `watch()`, including any modifications made by other extensions.

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | Drop-in patch that ensures `destroy()` removes all event listeners |
| **How** | Tracks elements in a `Set`, removes `_whenStateListeners` on destroy |
| **API changes** | None — existing code works exactly the same, just cleans up properly |
| **Enhanced methods** | `whenState()` and `watch()` — both automatically patched |
| **Idempotent destroy** | Safe to call `destroy()` multiple times — no errors |
| **checkListenerLeaks()** | Debug utility — finds elements with active listeners |
| **cleanupAllListeners()** | Emergency utility — removes all Conditions listeners globally |
| **restoreCleanupFix()** | Testing utility — removes the patch, restores originals |
| **Integration** | Automatically updates Elements, Collections, Selector, and global shortcuts |
| **Performance** | Minimal — `Set` for tracking (O(1) add/delete), one cleanup pass on destroy |

> **Simple Rule to Remember:** Load this module after the core Conditions module, and `destroy()` will properly remove all event listeners. No code changes needed — it's a transparent fix that prevents memory leaks from lingering event listeners.