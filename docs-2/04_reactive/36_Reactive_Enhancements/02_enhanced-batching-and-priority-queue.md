[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Enhanced Batching and Priority Queue

## What is Enhanced Batching?

The enhanced batching system adds a **priority-based update queue** to the reactive system. Instead of running effects in whatever order they were registered, updates are now scheduled by priority: computed properties run first, then watchers, then regular effects.

It also includes **infinite loop detection** to catch situations where an effect modifies state that triggers itself.

---

## Why Priority Matters

Consider this scenario:

```javascript
const state = ReactiveUtils.state({ price: 100, taxRate: 0.2 });

state.$computed('total', function() {
  return this.price + (this.price * this.taxRate);
});

ReactiveUtils.effect(() => {
  document.getElementById('total').textContent = `$${state.total}`;
});
```

When `state.price` changes, two things need to happen:
1. The `total` computed property needs to recalculate
2. The effect needs to re-render the UI

**The order matters:**

```
❌ Without priority (unpredictable order):

state.price = 200
   ↓
Effect runs FIRST → reads state.total → gets STALE value (120)
   ↓
Computed recalculates → total is now 240
   ↓
UI shows wrong value!

✅ With priority queue:

state.price = 200
   ↓
Priority 1 (COMPUTED): total recalculates → 240
   ↓
Priority 2 (WATCH): watchers run with correct values
   ↓
Priority 3 (EFFECT): effect reads state.total → gets 240 ✅
   ↓
UI shows correct value!
```

---

## The Priority Levels

```javascript
const PRIORITY = {
  COMPUTED: 1,    // Run first — computed properties
  WATCH: 2,       // Run second — watchers
  EFFECT: 3       // Run last — regular effects
};
```

```
Update Queue:
┌─────────────────────────────────────────┐
│  Priority 1 (COMPUTED)                  │
│  ├── total recalculation               │
│  └── other computed properties          │
├─────────────────────────────────────────┤
│  Priority 2 (WATCH)                     │
│  ├── state.$watch('price', ...)        │
│  └── other watchers                     │
├─────────────────────────────────────────┤
│  Priority 3 (EFFECT)                    │
│  ├── UI rendering effects              │
│  └── side-effect functions             │
└─────────────────────────────────────────┘
         ↑
   Processed top-to-bottom
```

---

## How the Queue Works

### Step-by-Step

```javascript
const state = ReactiveUtils.state({ count: 0 });

state.$computed('doubled', function() { return this.count * 2; });

state.$watch('count', (n) => console.log('Watched:', n));

ReactiveUtils.effect(() => {
  console.log('Effect:', state.doubled);
});

state.count = 5;
```

**What happens when `state.count = 5`:**

```
1️⃣ state.count = 5 (proxy set trap fires)
   ↓
2️⃣ queueUpdate() is called for each dependent:
   ├── 'doubled' computed    → added to queue at Priority 1
   ├── $watch callback       → added to queue at Priority 2
   └── effect function       → added to queue at Priority 3
   ↓
3️⃣ isFlushPending is false → schedule flush via queueMicrotask
   ↓
4️⃣ Current synchronous code finishes
   ↓
5️⃣ Microtask runs → flushQueue():
   ├── Sort priorities: [1, 2, 3]
   ├── Run Priority 1: computed 'doubled' recalculates → 10
   ├── Run Priority 2: watcher logs "Watched: 5"
   └── Run Priority 3: effect logs "Effect: 10"
   ↓
6️⃣ Queue is empty → flushCount reset to 0
```

---

## queueMicrotask — Why Not setTimeout?

The queue uses `queueMicrotask()` instead of `setTimeout()`:

```
JavaScript Event Loop:
┌──────────────────────────────────────┐
│  1. Synchronous code                 │
│     state.count = 5                  │
│     state.name = 'Alice'             │
├──────────────────────────────────────┤
│  2. Microtasks (queueMicrotask)      │  ← Queue flushes HERE
│     All queued updates run           │
│     Before any rendering             │
├──────────────────────────────────────┤
│  3. Rendering                        │
│     Browser paints the screen        │
├──────────────────────────────────────┤
│  4. Macrotasks (setTimeout)          │
│     Too late — screen already painted │
└──────────────────────────────────────┘
```

By using `queueMicrotask`, all updates are processed **before** the browser paints. This means the UI always shows the final, consistent state — never an intermediate one.

---

## Infinite Loop Detection

If an effect modifies state that triggers itself, it creates an infinite loop. The queue detects this:

```javascript
const state = ReactiveUtils.state({ count: 0 });

// ❌ This effect modifies the state it depends on
ReactiveUtils.effect(() => {
  state.count = state.count + 1;  // Reads count, then sets count
  // This triggers itself, which triggers itself, which...
});

// After 100 flushes, the system stops and logs:
// [Enhancements] Infinite update loop detected.
// An effect may be modifying state that triggers itself.
```

**How it works:**

```
flushQueue() called
   ↓
flushCount++ (now 1)
   ↓
Run effects → effect modifies state → queues new updates
   ↓
flushQueue() called again
   ↓
flushCount++ (now 2)
   ↓
...repeats...
   ↓
flushCount reaches 100
   ↓
STOP! Clear the queue, reset counter, log error.
```

The `MAX_FLUSH_COUNT` is set to 100 — more than enough for legitimate cascading updates, but catches true infinite loops.

---

## Using the Enhanced Batch

The `enhancedBatch` function wraps the existing batch:

```javascript
ReactiveEnhancements.batch(() => {
  state.x = 1;
  state.y = 2;
  state.z = 3;
  // Effects run once after all three assignments
});
```

This works the same as the original `ReactiveUtils.batch()`, but within the enhanced queueing system.

---

## Using queueUpdate Directly (Advanced)

For advanced use cases, you can manually queue updates with a specific priority:

```javascript
const { queueUpdate, PRIORITY } = ReactiveEnhancements;

// Queue something to run at computed priority (first)
queueUpdate(() => {
  console.log('This runs first');
}, PRIORITY.COMPUTED);

// Queue something to run at effect priority (last)
queueUpdate(() => {
  console.log('This runs last');
}, PRIORITY.EFFECT);

// Queue something at watcher priority (middle)
queueUpdate(() => {
  console.log('This runs second');
}, PRIORITY.WATCH);
```

---

## Common Mistakes

### ❌ Modifying state inside an effect that reads it

```javascript
// ❌ Creates an infinite loop — caught after 100 iterations
ReactiveUtils.effect(() => {
  state.count++;  // Reads AND writes count
});

// ✅ If you need to derive a value, use a computed property
state.$computed('doubled', function() {
  return this.count * 2;  // Only reads — never writes
});
```

### ❌ Assuming effects run synchronously

```javascript
state.count = 5;

// ❌ The effect hasn't run yet — it's queued as a microtask
console.log(document.getElementById('output').textContent);
// May still show old value

// ✅ If you need to run something after effects flush,
//    use queueMicrotask or await a tick:
state.count = 5;
queueMicrotask(() => {
  console.log(document.getElementById('output').textContent);
  // Now it shows the updated value
});
```

---

## Key Takeaways

1. **Priority queue**: Computed (1) → Watch (2) → Effect (3) — guaranteed order
2. **queueMicrotask**: Updates flush before the browser paints
3. **Infinite loop detection**: Stops after 100 flushes with a clear error message
4. **Consistent state**: Effects always see fully-updated computed values
5. **Batching**: Multiple state changes in the same tick are grouped into one flush

---

## What's next?

Let's explore deep reactivity for Map and Set collections.

Let's continue!