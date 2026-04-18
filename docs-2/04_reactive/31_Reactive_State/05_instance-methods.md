[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Instance Methods

Every reactive object created with `state()` automatically gets a set of **instance methods** — methods you can call directly on the state object. They all start with `$` to distinguish them from your own data properties.

---

## Quick reference

| Method | What it does |
|--------|-------------|
| `$computed(key, fn)` | Add a computed property |
| `$watch(keyOrFn, callback)` | Watch a property for changes |
| `$batch(fn)` | Group changes into one update |
| `$update(updates)` | Update state + DOM together |
| `$set(updates)` | Functional updates with transformers |
| `$bind(bindings)` | Connect state to DOM elements |
| `$notify(key?)` | Manually trigger updates |
| `$raw` | Access the original unwrapped object |

---

## $computed() and $watch()

These were covered in detail in the previous section. Quick recap:

```javascript
const app = ReactiveUtils.state({ price: 100, taxRate: 0.1 });

// Computed — derived value
app.$computed('total', function() {
  return this.price * (1 + this.taxRate);
});

// Watch — react to changes
app.$watch('price', (newVal, oldVal) => {
  console.log(`Price: ${oldVal} → ${newVal}`);
});
```

---

## $batch() — Group changes

### What is it?

`$batch()` lets you make multiple state changes that only trigger effects **once**, after all changes are complete.

### Syntax

```javascript
app.$batch(function() {
  this.firstName = 'Bob';
  this.lastName = 'Jones';
  this.age = 31;
});
// Effects run once with all three changes applied
```

### Why use it?

Without batching, each assignment triggers effects immediately:

```javascript
const app = ReactiveUtils.state({ firstName: 'Alice', lastName: 'Smith' });

ReactiveUtils.effect(() => {
  console.log(`${app.firstName} ${app.lastName}`);
});

// Without $batch — effect runs twice
app.firstName = 'Bob';    // "Bob Smith"
app.lastName = 'Jones';   // "Bob Jones"

// With $batch — effect runs once
app.$batch(function() {
  this.firstName = 'Bob';
  this.lastName = 'Jones';
});
// "Bob Jones" — only the final state
```

### The `this` context

Inside `$batch()`, `this` refers to the state object:

```javascript
app.$batch(function() {
  this.count++;           // Same as app.count++
  this.name = 'Updated';  // Same as app.name = 'Updated'
});
```

---

## $update() — Mixed state + DOM updates

### What is it?

`$update()` lets you update **state properties** and **DOM elements** in a single call. It automatically detects whether each key is a state property or a CSS selector.

### Syntax

```javascript
app.$update({
  // State properties (plain keys)
  count: 5,
  name: 'Alice',

  // DOM elements (keys that look like selectors)
  '#counter': { textContent: '5' },
  '.status': { style: { color: 'green' } }
});
```

### How it detects selectors vs state

```
Key starts with '#' → DOM selector (ID)
Key starts with '.' → DOM selector (class)
Key contains '[' or '>' → DOM selector (complex CSS)
Everything else → State property
```

### Example

```javascript
const app = ReactiveUtils.state({
  userName: 'Alice',
  score: 0
});

// Update state AND DOM in one call
app.$update({
  // State updates
  userName: 'Bob',
  score: 100,

  // DOM updates
  '#playerName': { textContent: 'Bob' },
  '#scoreDisplay': { textContent: '100' },
  '.status-badge': { style: { color: 'gold' } }
});
```

### Nested state with dot notation

```javascript
const app = ReactiveUtils.state({
  user: { profile: { name: 'Alice' } }
});

app.$update({
  'user.profile.name': 'Bob'  // Updates nested property
});

console.log(app.user.profile.name);  // 'Bob'
```

### Everything runs in a batch

All updates inside `$update()` are automatically batched — effects only run once after all changes are applied.

---

## $set() — Functional updates

### What is it?

`$set()` lets you update properties using **functions** that receive the current value and return the new value. This is useful when the new value depends on the old one.

### Syntax

```javascript
app.$set({
  count: (current) => current + 1,
  name: 'Alice'  // Static values work too
});
```

### Why use it?

When you need to update based on the current value:

```javascript
const app = ReactiveUtils.state({ count: 0, scores: [80, 90] });

// Without $set — must read and write separately
app.count = app.count + 1;

// With $set — function receives current value
app.$set({
  count: (current) => current + 1,
  name: 'Updated'  // Mix functions and static values
});
```

### Nested properties

```javascript
const app = ReactiveUtils.state({
  settings: { volume: 50 }
});

app.$set({
  'settings.volume': (current) => Math.min(100, current + 10)
});

console.log(app.settings.volume);  // 60
```

### Batched

Like `$update()`, all changes in `$set()` are automatically batched.

---

## $bind() — Connect state to DOM

### What is it?

`$bind()` creates **reactive bindings** between state properties and DOM elements. When state changes, the DOM updates automatically.

### Syntax

```javascript
const cleanup = app.$bind({
  '#elementId': 'propertyName',              // Simple binding
  '#another': function() { return this.x; }, // Computed binding
  '.class': {                                 // Multiple properties
    textContent: 'propertyName',
    style: function() { return { color: this.isActive ? 'green' : 'red' }; }
  }
});

// Later: remove all bindings
cleanup();
```

### Simple string binding

Map a state property directly to an element's text:

```javascript
const app = ReactiveUtils.state({ count: 0 });

app.$bind({
  '#counter': 'count'  // #counter shows app.count
});

app.count = 42;  // #counter automatically shows "42"
```

### Function binding

Use a function for computed displays:

```javascript
const app = ReactiveUtils.state({ firstName: 'Alice', lastName: 'Smith' });

app.$bind({
  '#fullName': function() {
    return `${this.firstName} ${this.lastName}`;
  }
});

app.firstName = 'Bob';  // #fullName shows "Bob Smith"
```

### Multi-property binding

Bind different properties of a DOM element:

```javascript
const app = ReactiveUtils.state({ name: 'Alice', isOnline: true });

app.$bind({
  '#userCard': {
    textContent: 'name',
    style: function() {
      return {
        borderColor: this.isOnline ? 'green' : 'gray'
      };
    }
  }
});
```

### Nested property binding

```javascript
const app = ReactiveUtils.state({
  user: { profile: { name: 'Alice' } }
});

app.$bind({
  '#userName': 'user.profile.name'
});
```

---

## $notify() — Manual trigger

### What is it?

`$notify()` manually triggers all effects that depend on a specific property (or all properties). Useful when you've mutated an object or array in place.

### Syntax

```javascript
// Notify effects watching a specific property
app.$notify('items');

// Notify ALL effects (no argument)
app.$notify();
```

### When to use it

Array mutations like `push()`, `pop()`, and `splice()` modify the array **in place** without reassigning the property. The reactive system doesn't detect in-place mutations automatically:

```javascript
const app = ReactiveUtils.state({ items: [1, 2, 3] });

ReactiveUtils.effect(() => {
  console.log('Items:', app.items.length);
});

// This does NOT trigger the effect:
app.items.push(4);  // Array mutated in place, property not reassigned

// Solution: manually notify
app.$notify('items');
// Effect re-runs: "Items: 4"
```

---

## $raw — Access the original object

### What is it?

`$raw` is a **getter** (not a method) that returns the original, unwrapped plain object.

### Syntax

```javascript
const app = ReactiveUtils.state({ count: 0, name: 'Alice' });

const original = app.$raw;
console.log(original);  // { count: 0, name: 'Alice' }
```

### When to use it

```javascript
// Serializing state
const json = JSON.stringify(app.$raw);

// Sending to an API
fetch('/api/save', {
  method: 'POST',
  body: JSON.stringify(app.$raw)
});

// Passing to a function that doesn't need reactivity
someLibrary.init(app.$raw);
```

---

## Common patterns

### Pattern 1: Initialize and bind

```javascript
const app = ReactiveUtils.state({ count: 0, name: 'World' });

app.$bind({
  '#count': 'count',
  '#greeting': function() { return `Hello, ${this.name}!`; }
});
```

### Pattern 2: Batch + update

```javascript
app.$batch(function() {
  this.firstName = data.firstName;
  this.lastName = data.lastName;
  this.email = data.email;
  this.role = data.role;
});
```

### Pattern 3: Functional increment

```javascript
app.$set({
  count: (c) => c + 1,
  lastUpdated: new Date().toISOString()
});
```

---

## Key takeaways

1. **$computed** and **$watch** — derived values and change reactions
2. **$batch** — group changes, effects run once at the end
3. **$update** — update state + DOM in one call, auto-detects selectors
4. **$set** — functional updates where new value depends on old
5. **$bind** — reactive DOM bindings that auto-update
6. **$notify** — manually trigger effects (for in-place mutations)
7. **$raw** — get the original unwrapped object
8. All methods starting with **$** are non-enumerable — they won't show up in `Object.keys()` or `for...in` loops

---

## What's next?

Now let's explore the specialized state factories:
- `ref()` for single values
- `collection()` for reactive lists
- `form()` for form state management
- `async()` for loading/error/data patterns

Let's continue!