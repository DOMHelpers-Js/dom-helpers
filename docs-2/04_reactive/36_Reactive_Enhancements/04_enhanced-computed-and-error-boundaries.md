[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Enhanced Computed Properties and Error Boundaries

## Part 1: Enhanced Computed Properties

### What Changed?

After enhancements load, `state.$computed()` gains two production features:

1. **Smart caching** — computed values are cached and only recalculated when their dependencies change
2. **Circular dependency detection** — if computed A depends on computed B which depends on computed A, you get a clear error instead of an infinite loop

---

### How Caching Works

Each computed property tracks a `dirty` flag and a `tick` number:

```
state.$computed('total', fn)
   ↓
Creates metadata:
{
  key: 'total',
  fn: fn,
  computing: false,  // cycle detection flag
  value: undefined,  // cached result
  dirty: true,       // needs recalculation?
  tick: 0            // which flush cycle last computed
}
```

When you read `state.total`:

```
state.total (getter fires)
   ↓
Is it dirty OR has the tick changed?
├── YES → recalculate:
│         1. Set computing = true
│         2. Push onto computedStack
│         3. Call fn() → get new value
│         4. Cache the result, mark dirty = false
│         5. Update tick
│         6. Set computing = false, pop stack
│         7. Return cached value
│
└── NO  → return cached value immediately
```

**The benefit:** If multiple effects read the same computed property in the same tick, it's only calculated once:

```javascript
const state = ReactiveUtils.state({ price: 100, tax: 0.2 });

state.$computed('total', function() {
  console.log('Computing total...');  // Only runs once per tick
  return this.price + (this.price * this.tax);
});

// Both effects read state.total in the same tick
ReactiveUtils.effect(() => {
  document.getElementById('display1').textContent = state.total;
});

ReactiveUtils.effect(() => {
  document.getElementById('display2').textContent = `$${state.total}`;
});

state.price = 200;
// "Computing total..." logged ONCE, not twice
// Both effects get the cached value: 240
```

---

### Circular Dependency Detection

If computed properties form a circular chain, the system catches it:

```javascript
const state = ReactiveUtils.state({ x: 1 });

state.$computed('a', function() {
  return this.b + 1;  // 'a' depends on 'b'
});

state.$computed('b', function() {
  return this.a + 1;  // 'b' depends on 'a' — CIRCULAR!
});

// When you try to read state.a:
console.log(state.a);
// Throws: [Enhancements] Circular dependency: a → b → a
```

**How it works:**

```
Reading state.a
   ↓
Push 'a' onto computedStack: [a]
   ↓
fn() runs → reads this.b
   ↓
Push 'b' onto computedStack: [a, b]
   ↓
fn() runs → reads this.a
   ↓
'a' is already computing!
   ↓
Throw: "Circular dependency: a → b → a"
```

The `computedStack` tracks which computed properties are currently being evaluated, creating a chain that's included in the error message for easy debugging.

---

### Read-Only Protection

Enhanced computed properties warn you if you try to set them:

```javascript
state.$computed('doubled', function() {
  return this.count * 2;
});

state.doubled = 99;
// Console warning: [Enhancements] Cannot set computed property "doubled".
// Computed properties are read-only.
```

The value is **not** changed — it remains the computed result.

---

## Part 2: Error Boundaries

### What is an Error Boundary?

An error boundary wraps a function so that if it throws an error, the error is caught and handled instead of crashing the entire reactive system.

Think of it as a **circuit breaker** — one bad effect trips its own breaker without affecting the rest of the house.

---

### The ErrorBoundary Class

```javascript
const boundary = new ReactiveUtils.ErrorBoundary({
  onError: (error, context) => { /* handle error */ },
  fallback: (error, context) => { /* return fallback value */ },
  retry: true,          // whether to retry on failure (default: true)
  maxRetries: 3,        // max retry attempts (default: 3)
  retryDelay: 0         // milliseconds between retries (default: 0)
});
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onError` | Function | console.error | Called when an error occurs |
| `fallback` | Function | undefined | Returns a fallback value on final failure |
| `retry` | Boolean | `true` | Whether to retry failed calls |
| `maxRetries` | Number | `3` | Maximum retry attempts |
| `retryDelay` | Number | `0` | Delay between retries (ms) |

---

### safeEffect — Effect with Error Boundary

`safeEffect` wraps an effect in an error boundary, so it won't crash if it throws:

```javascript
const state = ReactiveUtils.state({ data: null });

const dispose = ReactiveUtils.safeEffect(() => {
  // If state.data is null, this will throw
  document.getElementById('name').textContent = state.data.name;
}, {
  errorBoundary: {
    onError: (error, context) => {
      console.warn('Effect failed:', error.message);
      console.log('Attempt:', context.attempt, 'of', context.maxRetries);
    },
    fallback: (error) => {
      document.getElementById('name').textContent = 'Loading...';
    },
    maxRetries: 2
  }
});
```

**What happens when the effect throws:**

```
safeEffect runs
   ↓
fn() throws: "Cannot read properties of null"
   ↓
ErrorBoundary catches it
   ↓
onError called: { attempt: 1, maxRetries: 2, willRetry: true }
   ↓
Retry attempt 1 → still throws
   ↓
onError called: { attempt: 2, maxRetries: 2, willRetry: false }
   ↓
No more retries → fallback called
   ↓
Fallback sets text to "Loading..."
   ↓
No crash — other effects continue working ✅
```

---

### safeWatch — Watcher with Error Boundary

`safeWatch` does the same for watchers:

```javascript
ReactiveUtils.safeWatch(state, 'data', (newVal) => {
  // This might throw if processing fails
  const processed = processData(newVal);
  document.getElementById('output').textContent = processed;
}, {
  errorBoundary: {
    onError: (error) => {
      console.warn('Watch callback failed:', error.message);
    },
    retry: false  // Don't retry watchers
  }
});
```

**Syntax:**

```javascript
ReactiveUtils.safeWatch(state, keyOrFn, callback, options);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `state` | Reactive state | The state to watch |
| `keyOrFn` | String or Function | Property key or getter function |
| `callback` | Function | Called when the value changes |
| `options` | Object | `{ errorBoundary: { ... } }` |

---

### Using ErrorBoundary Directly

You can use the `ErrorBoundary` class to wrap any function:

```javascript
const boundary = new ReactiveUtils.ErrorBoundary({
  onError: (error, context) => {
    console.error(`Error in ${context.type}:`, error.message);
  },
  maxRetries: 1,
  fallback: () => 'default value'
});

const safeFn = boundary.wrap(riskyFunction, { type: 'my-function' });

const result = safeFn();
// If riskyFunction throws:
// 1. onError is called
// 2. Retries once
// 3. If still failing, returns 'default value'
```

---

### The context Object

The `onError` and `fallback` callbacks receive a `context` object:

```javascript
{
  type: 'effect',          // or 'watch', or custom
  created: 1708041600000,  // when the boundary was created
  attempt: 2,              // current retry attempt
  maxRetries: 3,           // max allowed retries
  willRetry: true          // whether another retry will happen
}
```

---

### Error Boundary Flow

```
boundary.wrap(fn)
   ↓
Returns a wrapped function
   ↓
When called:
   ↓
attempt()
   ↓
try { fn() }
   ↓
Success? → return result
   ↓
Catch error:
   ↓
retries++ → onError(error, context)
   ↓
Should retry? (retry = true AND retries < maxRetries)
├── YES → attempt() again (immediate or delayed)
│         ├── retryDelay = 0 → synchronous retry
│         └── retryDelay > 0 → setTimeout(attempt, delay)
│
└── NO  → Has fallback?
          ├── YES → return fallback(error, context)
          └── NO  → return undefined (no crash)
```

---

## Common Mistakes

### ❌ Relying on circular computed properties

```javascript
// ❌ These form a cycle — will throw
state.$computed('a', function() { return this.b + 1; });
state.$computed('b', function() { return this.a + 1; });

// ✅ Restructure to avoid cycles
state.$computed('a', function() { return this.x + 1; });
state.$computed('b', function() { return this.a + 1; });
// b depends on a, a depends on x — no cycle
```

### ❌ Using safeEffect for everything

```javascript
// ❌ Overkill — only use safeEffect when errors are expected
const dispose = ReactiveUtils.safeEffect(() => {
  document.getElementById('name').textContent = state.name;
  // This won't throw — state.name is always a string
});

// ✅ Use regular effect for safe operations
const dispose = ReactiveUtils.effect(() => {
  document.getElementById('name').textContent = state.name;
});

// ✅ Use safeEffect when working with external/unpredictable data
const dispose = ReactiveUtils.safeEffect(() => {
  const parsed = JSON.parse(state.rawInput);
  renderData(parsed);
});
```

### ❌ Expecting computed to update immediately after state change

```javascript
state.count = 5;

// The computed may still be cached from the previous tick
// It updates when read in a new effect cycle
ReactiveUtils.effect(() => {
  // Here, state.doubled is guaranteed to be fresh
  console.log(state.doubled);
});
```

---

## Key Takeaways

1. **Computed caching** — values are calculated once per tick, no matter how many effects read them
2. **Circular detection** — clear error messages with the dependency chain (`a → b → a`)
3. **Read-only protection** — setting a computed property logs a warning and is ignored
4. **safeEffect** — effect that catches errors, retries, and falls back gracefully
5. **safeWatch** — watcher with the same error boundary protection
6. **ErrorBoundary class** — reusable error handling with retry and fallback
7. **One bad effect doesn't crash others** — error isolation is the core benefit

---

## What's next?

Let's explore async effects with automatic cancellation and the enhanced async state for race-condition-safe data fetching.

Let's continue!