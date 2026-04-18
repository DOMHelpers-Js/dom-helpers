[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# What is the Standalone API?

## What is it?

The **Standalone API** lets you use all of DOMHelpers' reactive functions **without typing a namespace prefix**.

Instead of:
```javascript
ReactiveUtils.state({ count: 0 });
ReactiveUtils.effect(() => console.log(state.count));
ReactiveUtils.batch(() => { state.a = 1; state.b = 2; });
```

You can write:
```javascript
state({ count: 0 });
effect(() => console.log(myState.count));
batch(() => { myState.a = 1; myState.b = 2; });
```

**Same result. Less typing. Cleaner code.**

---

## Why does this exist?

Every reactive tool in DOMHelpers lives on the `ReactiveUtils` namespace. That's great for clarity, but after a while it gets repetitive to type `ReactiveUtils.` before every function.

### The full-namespace way

```javascript
const user = ReactiveUtils.state({ name: '', email: '' });

ReactiveUtils.effect(() => {
  console.log('User changed:', user.name);
});

ReactiveUtils.batch(() => {
  user.name = 'Alice';
  user.email = 'alice@example.com';
});

const fullName = ReactiveUtils.computed(user, {
  full: function() { return this.name + ' ' + this.email; }
});
```

That's `ReactiveUtils.` written **4 times** for a simple example.

### The standalone way

```javascript
const user = state({ name: '', email: '' });

effect(() => {
  console.log('User changed:', user.name);
});

batch(() => {
  user.name = 'Alice';
  user.email = 'alice@example.com';
});

const fullName = computed(user, {
  full: function() { return this.name + ' ' + this.email; }
});
```

**Identical result.** Zero namespace noise.

---

## The core idea: a shortcut layer

The Standalone API is a **thin bridge** between global functions and `ReactiveUtils`. Every function it exposes is just an alias:

```
global.state  →  ReactiveUtils.state
global.effect →  ReactiveUtils.effect
global.batch  →  ReactiveUtils.batch
global.watch  →  ReactiveUtils.watch
   ...           ...
```

Nothing is reimplemented. Nothing works differently. It's simply assigning the exact same functions to shorter names you can call without a prefix.

---

## How it works (the simple picture)

```
Without Standalone API:
┌─────────────────────────────────────────────┐
│ ReactiveUtils.state({ count: 0 })           │
│       ↑                                     │
│  Must reach into namespace each time        │
└─────────────────────────────────────────────┘

With Standalone API loaded:
┌─────────────────────────────────────────────┐
│ state({ count: 0 })                         │
│   ↓                                         │
│ global.state = ReactiveUtils.state  ← same  │
└─────────────────────────────────────────────┘
```

You call `state()`. The Standalone API already pointed that name at `ReactiveUtils.state`. Everything works exactly as before.

---

## Why not just always use `ReactiveUtils.something`?

You can! `ReactiveUtils.state()` will always work.

The Standalone API is for when you want:

✅ **Cleaner code** — less clutter when you're doing a lot of reactive work
✅ **Faster writing** — especially during prototyping or small scripts
✅ **Familiar style** — feels like working with plain functions
✅ **Portable patterns** — code looks similar to other reactive libraries

It's a comfort choice, not a requirement.

---

## What gets exposed?

The Standalone API covers every area of the reactive system:

```
Standalone API exposes:
│
├── Core State
│   ├── state()          Create reactive state
│   ├── createState()    Create state with DOM bindings
│   ├── effect()         Create reactive effect
│   └── batch()          Group multiple updates
│
├── Computed & Watch
│   ├── computed()       Add computed properties
│   ├── watch()          Watch state changes
│   └── effects()        Create multiple effects
│
├── Refs & Collections
│   ├── ref()            Single reactive reference
│   ├── refs()           Multiple refs at once
│   ├── collection()     Reactive collection
│   └── list()           Alias for collection
│
├── Forms
│   ├── form()           Reactive form
│   ├── createForm()     Alias for form
│   └── validators       Built-in form validators
│
├── Store & Component
│   ├── store()          State store with actions
│   ├── component()      Reactive component
│   └── reactive()       Builder pattern
│
├── Async (if loaded)
│   ├── asyncState()     Async state with race prevention
│   ├── asyncEffect()    Async effect with AbortSignal
│   ├── safeEffect()     Effect with error boundary
│   └── safeWatch()      Watch with error boundary
│
├── Utilities
│   ├── isReactive()     Check if value is reactive
│   ├── toRaw()          Get non-reactive value
│   ├── notify()         Manually trigger update
│   ├── pause()          Pause all reactivity
│   ├── resume()         Resume reactivity
│   └── untrack()        Run without dependency tracking
│
├── Cleanup (if loaded)
│   ├── collector()      Group disposals together
│   └── scope()          Auto-collecting scope
│
├── Error Handling (if loaded)
│   └── ErrorBoundary    Error boundary class
│
├── Dev Tools (if loaded)
│   └── DevTools         Debug and monitoring tools
│
└── Storage (if loaded)
    ├── autoSave()       Add auto-save to state
    ├── withStorage()    Alias for autoSave
    ├── reactiveStorage() Reactive storage proxy
    └── watchStorage()   Watch a storage key
```

That's the entire reactive system — accessible as plain global functions.

---

## When should you use the Standalone API?

✅ **Use it when:**
- You're writing reactive code frequently in a file
- You want cleaner, less verbose code
- You're prototyping or writing small scripts
- You prefer a functional coding style

❌ **Skip it when:**
- You're working in a large codebase where global pollution is a concern
- You want maximum explicitness about where functions come from
- You already have a global function named `state` or `effect`

---

## Important: load order matters

The Standalone API must be loaded **after** all other reactive modules. It reads from whatever `ReactiveUtils` contains at load time:

```html
<!-- Load in this order: -->
<script src="01_dh-reactive.js"></script>
<script src="02_dh-reactive-ref.js"></script>
<script src="03_dh-reactive-collections.js"></script>
<script src="04_dh-reactive-form.js"></script>
<script src="05_dh-reactive-cleanup.js"></script>
<script src="06_dh-reactive-enhancements.js"></script>
<script src="07_dh-reactive-storage.js"></script>
<script src="08_dh-reactive-namespace-methods.js"></script>

<!-- Load this LAST: -->
<script src="09_dh-reactiveUtils-shortcut.js"></script>
```

If you load it too early, it won't find the advanced functions and they won't be available as globals.

---

## A quick comparison

| Style | Code | Works? |
|-------|------|--------|
| Namespace | `ReactiveUtils.state({ count: 0 })` | ✅ Always |
| Standalone | `state({ count: 0 })` | ✅ After loading shortcut |
| Instance | `const s = state({}); s.$watch(...)` | ✅ Instance methods still work |

All three styles can be used together. They all operate on the same underlying reactive system.

---

## Key takeaways

1. **A shortcut layer** — exposes all `ReactiveUtils` functions as plain global functions
2. **Nothing changes** — the same functions, just without the `ReactiveUtils.` prefix
3. **Optional** — `ReactiveUtils.method()` always works; this is just convenience
4. **Load last** — must be included after all other reactive modules
5. **Covers everything** — state, effects, computed, forms, storage, cleanup, async, and more
6. **Safe** — never overwrites existing globals (uses `typeof x === 'undefined'` checks for some)

---

## What's next?

Now that you understand **what** the Standalone API is and **why** it exists, let's look at:
- How the global function concept actually works
- The difference between "always available" and "conditionally available" functions
- How to start writing reactive code without any namespace prefixes

Let's continue! 🚀