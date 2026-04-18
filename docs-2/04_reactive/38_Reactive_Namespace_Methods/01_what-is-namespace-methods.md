[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# What is Namespace Methods?

## Quick Start (30 seconds)

```javascript
const state = ReactiveUtils.state({ count: 0 });

// Instance style (with $):
state.$set({ count: 5 });

// Namespace style (without $):
ReactiveUtils.set(state, { count: 5 });

// Both do exactly the same thing!
```

---

## What is Namespace Methods?

**Namespace Methods** is a module that adds **14 namespace-level functions** to `ReactiveUtils`. These functions let you call `$` instance methods using a different syntax — passing the state as the first argument instead of calling the method on the state itself.

Simply put, instead of writing `state.$save()`, you can write `ReactiveUtils.save(state)`. Both do the same thing.

---

## Why Does This Exist?

### Two Styles, Same Result

Some developers prefer calling methods on a namespace (like `ReactiveUtils.save(state)`) rather than on the object itself (like `state.$save()`). This module gives you the choice.

**Instance style (the `$` methods):**

```javascript
state.$set({ count: 5 });
state.$cleanup();
state.$save();
asyncState.$execute(fetchFn);
component.$destroy();
```

**Namespace style (this module adds these):**

```javascript
ReactiveUtils.set(state, { count: 5 });
ReactiveUtils.cleanup(state);
ReactiveUtils.save(state);
ReactiveUtils.execute(asyncState, fetchFn);
ReactiveUtils.destroy(component);
```

**Why namespace style can be useful:**

```
Instance style:                    Namespace style:
state.$save()                      ReactiveUtils.save(state)
│                                  │
├── Method lives ON the object     ├── Method lives on the utility
├── Must check if method exists    ├── Validates internally
└── Familiar OOP pattern           └── Familiar functional pattern
```

✅ Both styles are valid. Use whichever reads better in your code.

---

## Mental Model

Think of instance methods like **asking a person directly**:

> "Hey state, save yourself!" → `state.$save()`

And namespace methods like **asking a manager**:

> "Hey ReactiveUtils, please save this state for me." → `ReactiveUtils.save(state)`

The result is identical — the state gets saved. It's just a matter of who you're talking to.

---

## The 14 Methods

The module adds 14 namespace-level methods, organized into 4 categories:

```
Namespace Methods (14 total)
│
├── Core State (3)
│   ├── ReactiveUtils.set(state, updates)
│   ├── ReactiveUtils.cleanup(state)
│   └── ReactiveUtils.getRaw(state)
│
├── Async State (4)
│   ├── ReactiveUtils.execute(asyncState, fn)
│   ├── ReactiveUtils.abort(asyncState)
│   ├── ReactiveUtils.reset(asyncState)
│   └── ReactiveUtils.refetch(asyncState)
│
├── Component (1)
│   └── ReactiveUtils.destroy(component)
│
└── Storage (7)
    ├── ReactiveUtils.save(state)
    ├── ReactiveUtils.load(state)
    ├── ReactiveUtils.clear(state)
    ├── ReactiveUtils.exists(state)
    ├── ReactiveUtils.stopAutoSave(state)
    ├── ReactiveUtils.startAutoSave(state)
    └── ReactiveUtils.storageInfo(state)
```

---

## How It Works

Each namespace method is a thin wrapper that:

1. **Validates** the state has the corresponding `$` method
2. **Calls** the `$` method on the state
3. **Returns** the result

```
ReactiveUtils.save(state)
   ↓
1️⃣ Does state exist? Does state.$save exist?
   ├── NO  → console.error, return false
   └── YES ↓
2️⃣ return state.$save()
```

That's it. No magic, no transformation — just a convenient alias with built-in validation.

---

## Where Are These Methods Available?

The module copies all 14 methods to every available namespace:

```
ReactiveUtils.save(state)     ← Always available
Elements.save(state)          ← If Elements is loaded
Collections.save(state)       ← If Collections is loaded
Selector.save(state)          ← If Selector is loaded
save(state)                   ← Global, if effect() is global
```

So you can use whichever namespace feels natural:

```javascript
// All identical:
ReactiveUtils.save(state);
Elements.save(state);
Collections.save(state);
Selector.save(state);
save(state);
```

---

## Instance Methods Still Work

This module **adds** namespace methods — it does not **replace** instance methods. Both styles continue to work:

```javascript
// Instance style — always works
state.$save();
state.$cleanup();
asyncState.$execute(fn);

// Namespace style — now also works
ReactiveUtils.save(state);
ReactiveUtils.cleanup(state);
ReactiveUtils.execute(asyncState, fn);
```

---

## Big Picture: How This Fits In

```
DOMHelpers Reactive System
│
├── 01_dh-reactive.js                → Core (adds $set, $cleanup, $raw, etc.)
├── 05_dh-reactive-cleanup.js        → Cleanup (adds $cleanup)
├── 06_dh-reactive-enhancements.js   → Async (adds $execute, $abort, etc.)
├── 07_dh-reactive-storage.js        → Storage (adds $save, $load, etc.)
├── 08_dh-reactive-namespace-methods → Aliases for all the above ← YOU ARE HERE
```

This module loads last and wraps all the `$` methods that previous modules added.

---

## Key Takeaways

1. **14 namespace-level methods** — aliases for `$` instance methods
2. **Same functionality** — `ReactiveUtils.save(state)` is identical to `state.$save()`
3. **Built-in validation** — each method checks if the state has the required `$` method
4. **Available everywhere** — ReactiveUtils, Elements, Collections, Selector, and globals
5. **Non-destructive** — instance `$` methods still work as before
6. **Choose your style** — use whichever syntax you prefer

---

## What's next?

Let's see all 14 methods with complete examples and their instance-style equivalents.

Let's continue!