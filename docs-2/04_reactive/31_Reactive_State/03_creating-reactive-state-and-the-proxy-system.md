[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Creating Reactive State and the Proxy System

Let's understand **how** reactive state works under the hood — the Proxy system, dependency tracking, deep reactivity, and batching.

---

## How state() works

When you call `ReactiveUtils.state()`, here's what happens:

```
ReactiveUtils.state({ count: 0, name: 'Alice' })
   ↓
1️⃣ Check: is the input an object?
   ├── Not an object → return as-is (no proxy)
   └── Is an object → continue
   ↓
2️⃣ Check: is it already reactive?
   ├── Already reactive → return as-is (no double-wrapping)
   └── Not reactive → continue
   ↓
3️⃣ Check: is it a built-in type to skip?
   ├── Date, RegExp, Promise, etc. → return as-is
   ├── DOM Node or Element → return as-is
   └── Plain object or array → continue
   ↓
4️⃣ Create a Proxy around the object
   ├── get trap → tracks reads (dependency collection)
   └── set trap → triggers updates (change notification)
   ↓
5️⃣ Add instance methods ($computed, $watch, $batch, etc.)
   ↓
6️⃣ Return the proxy
```

---

## The Proxy — what it is

A JavaScript `Proxy` is a wrapper around an object that lets you intercept operations like reading and writing properties.

```javascript
const original = { count: 0 };

const proxy = new Proxy(original, {
  get(obj, key) {
    console.log(`Someone read "${key}"`);
    return obj[key];
  },
  set(obj, key, value) {
    console.log(`Someone set "${key}" to ${value}`);
    obj[key] = value;
    return true;
  }
});

proxy.count;       // Console: Someone read "count"
proxy.count = 5;   // Console: Someone set "count" to 5
```

The reactive system uses this mechanism to **detect reads** (for dependency tracking) and **detect writes** (for triggering updates).

---

## The get trap — dependency tracking

When you read a property from a reactive object inside an effect, the system records: "This effect depends on this property."

```javascript
const app = ReactiveUtils.state({ count: 0 });

ReactiveUtils.effect(() => {
  console.log(app.count);  // get trap fires → dependency recorded
});
```

### What happens inside the get trap

```
app.count is read
   ↓
1️⃣ Is there a currently running effect?
   ├── No → just return the value (no tracking)
   └── Yes → continue
   ↓
2️⃣ Create a dependency entry for "count" if it doesn't exist
   ↓
3️⃣ Add the current effect to the dependency set for "count"
   ↓
4️⃣ Return the value
```

**Think of it as a sign-up sheet:**

```
Property "count" — who's watching:
├── Effect 1 (the console.log effect)
├── Effect 3 (some other effect)
└── Effect 7 (another effect)

Property "name" — who's watching:
├── Effect 2
└── Effect 5
```

Each property keeps its own list of effects that depend on it.

---

## The set trap — triggering updates

When you write to a property, the system notifies all effects that depend on it.

```javascript
app.count = 5;  // set trap fires → effects notified
```

### What happens inside the set trap

```
app.count = 5
   ↓
1️⃣ Is the new value the same as the old value?
   ├── Yes → do nothing (no unnecessary updates)
   └── No → continue
   ↓
2️⃣ Store the new value on the original object
   ↓
3️⃣ Check: do any computed properties depend on "count"?
   ├── Yes → mark them as dirty (need recalculation)
   └── No → skip
   ↓
4️⃣ Look up the dependency set for "count"
   ↓
5️⃣ Queue each effect for re-execution
   ↓
6️⃣ If not batching, run all queued effects now
```

### Same-value optimization

```javascript
app.count = 5;
app.count = 5;  // No effect re-runs — value didn't actually change
```

The set trap checks `if (obj[key] === value) return true;` before doing anything. This prevents unnecessary re-renders.

---

## Deep reactivity

Nested objects are automatically made reactive when you access them:

```javascript
const app = ReactiveUtils.state({
  user: {
    profile: {
      name: 'Alice'
    }
  }
});

// When you access app.user, the system wraps it in a Proxy too
// When you access app.user.profile, that gets wrapped too
// All the way down the chain
```

### How deep reactivity works

```
app.user.profile.name = 'Bob'
   ↓
app.user          → get trap fires → returns reactive proxy of user
   ↓
   .profile       → get trap fires → returns reactive proxy of profile
   ↓
      .name = 'Bob'  → set trap fires → triggers effects
```

Each nested object gets its own Proxy the first time it's accessed. This is called **lazy deep reactivity** — objects are only wrapped when actually needed.

### Objects that are NOT made deeply reactive

```javascript
const app = ReactiveUtils.state({
  createdAt: new Date(),           // Skipped — Date is a built-in
  controller: new AbortController(), // Skipped — AbortController
  pattern: /test/i,                // Skipped — RegExp
  element: document.body           // Skipped — DOM element
});

// These are stored as-is inside the reactive object
// The PROPERTY is tracked, but the object itself isn't proxied
app.createdAt = new Date();  // Triggers effects (property change)
app.createdAt.setHours(12);  // Does NOT trigger effects (Date mutation)
```

---

## Batching — grouping updates

When you change multiple properties, each change would normally trigger its effects immediately. Batching groups them into a single flush:

```javascript
const app = ReactiveUtils.state({ firstName: 'Alice', lastName: 'Smith' });

ReactiveUtils.effect(() => {
  console.log(`${app.firstName} ${app.lastName}`);
});

// Without batching:
app.firstName = 'Bob';    // Effect runs: "Bob Smith"
app.lastName = 'Jones';   // Effect runs: "Bob Jones"
// Two runs — intermediate state visible

// With batching:
ReactiveUtils.batch(() => {
  app.firstName = 'Bob';   // Queued, not run yet
  app.lastName = 'Jones';  // Queued, not run yet
});
// Effect runs once: "Bob Jones"
// One run — only final state visible
```

### How batching works

```
batch(() => { ... })
   ↓
1️⃣ Increment batchDepth (now > 0)
   ↓
2️⃣ Run the function
   ├── app.firstName = 'Bob'  → effect queued (not run)
   └── app.lastName = 'Jones' → effect queued (not run)
   ↓
3️⃣ Decrement batchDepth (back to 0)
   ↓
4️⃣ Flush: run all queued effects once
   └── Effect runs with final state: "Bob Jones"
```

### Nested batching

Batches can be nested. Effects only flush when the outermost batch completes:

```javascript
ReactiveUtils.batch(() => {
  app.a = 1;
  ReactiveUtils.batch(() => {
    app.b = 2;
    app.c = 3;
  });
  // Inner batch finished, but outer batch still active
  // Effects NOT flushed yet
  app.d = 4;
});
// NOW effects flush — all four changes processed at once
```

---

## The toRaw() utility

Sometimes you need the original, unwrapped object:

```javascript
const app = ReactiveUtils.state({ count: 0 });

// Through the state object
const raw = app.$raw;
console.log(raw);  // { count: 0 } — the original plain object

// Through the utility function
const raw2 = ReactiveUtils.toRaw(app);
console.log(raw2); // { count: 0 }
```

### When to use toRaw()

```javascript
// Sending to an API — don't send the Proxy
fetch('/api/save', {
  method: 'POST',
  body: JSON.stringify(app.$raw)  // Send the plain object
});

// Comparing objects
if (ReactiveUtils.toRaw(stateA) === ReactiveUtils.toRaw(stateB)) {
  console.log('Same underlying object');
}
```

---

## The isReactive() utility

Check whether an object is reactive:

```javascript
const app = ReactiveUtils.state({ count: 0 });
const plain = { count: 0 };

console.log(ReactiveUtils.isReactive(app));    // true
console.log(ReactiveUtils.isReactive(plain));  // false
```

---

## Pause and resume

For advanced scenarios, you can manually pause and resume reactivity:

```javascript
// Pause — changes won't trigger effects
ReactiveUtils.pause();

app.a = 1;
app.b = 2;
app.c = 3;
// No effects run during pause

// Resume — flush pending updates
ReactiveUtils.resume(true);  // true = flush now
// All queued effects run at once
```

---

## Untrack — reading without tracking

Sometimes you want to read a reactive property without creating a dependency:

```javascript
ReactiveUtils.effect(() => {
  // This read IS tracked — effect will re-run when name changes
  const name = app.name;

  // This read is NOT tracked — effect won't re-run when count changes
  const count = ReactiveUtils.untrack(() => app.count);

  console.log(`${name}: ${count}`);
});

app.name = 'Bob';   // Effect re-runs (name is tracked)
app.count = 99;     // Effect does NOT re-run (count was untracked)
```

---

## Key takeaways

1. **state()** wraps a plain object in a Proxy that tracks reads and writes
2. **get trap** records which effects depend on which properties
3. **set trap** notifies all dependent effects when a property changes
4. **Deep reactivity** — nested objects are automatically made reactive
5. **Same-value check** — changing a property to the same value does nothing
6. **Built-in types** (Date, RegExp, DOM nodes) are skipped and stored as-is
7. **Batching** groups multiple changes into a single flush
8. **toRaw()** gives you the original unwrapped object
9. **isReactive()** checks if an object is reactive
10. **untrack()** reads a property without creating a dependency

---

## What's next?

Now that you understand how the Proxy system works, let's explore:
- Effects, computed properties, and watchers in depth
- Instance methods for advanced state control
- Specialized state factories

Let's continue!