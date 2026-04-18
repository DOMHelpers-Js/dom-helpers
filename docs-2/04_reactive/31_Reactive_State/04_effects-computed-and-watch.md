[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Effects, Computed, and Watch

These are the three ways to **react** to state changes. Each serves a different purpose.

---

## Quick comparison

| Tool | What it does | When it runs | Returns |
|------|-------------|-------------|---------|
| `effect()` | Runs a function when dependencies change | Immediately + on every change | Cleanup function |
| `$computed()` | Calculates a derived value lazily | Only when the value is read | The state (for chaining) |
| `$watch()` | Calls a callback when a specific property changes | Only when the watched value changes | Cleanup function |

---

## effect() — Run code when state changes

### What is it?

`effect()` takes a function, runs it immediately, and then re-runs it automatically whenever any reactive property it read changes.

### Syntax

```javascript
const cleanup = ReactiveUtils.effect(() => {
  // This code runs now, and re-runs when dependencies change
});

// Later: stop the effect
cleanup();
```

### Basic example

```javascript
const app = ReactiveUtils.state({ count: 0 });

const stop = ReactiveUtils.effect(() => {
  console.log('Count is:', app.count);
});
// Output: "Count is: 0" (runs immediately)

app.count = 1;  // Output: "Count is: 1"
app.count = 2;  // Output: "Count is: 2"

// Stop watching
stop();

app.count = 3;  // No output — effect was cleaned up
```

### How dependency tracking works

```javascript
const app = ReactiveUtils.state({ name: 'Alice', age: 30, color: 'blue' });

ReactiveUtils.effect(() => {
  // This effect reads name and age, but NOT color
  console.log(`${app.name} is ${app.age}`);
});

app.name = 'Bob';    // Effect re-runs (name is a dependency)
app.age = 31;        // Effect re-runs (age is a dependency)
app.color = 'red';   // Effect does NOT re-run (color is not a dependency)
```

The system only tracks properties that are **actually read** during the effect's execution.

### DOM updates with effects

```javascript
const app = ReactiveUtils.state({ theme: 'light' });

ReactiveUtils.effect(() => {
  document.body.className = app.theme === 'dark' ? 'dark-mode' : 'light-mode';
});

app.theme = 'dark';  // Body class changes automatically
```

### Multiple effects

```javascript
const app = ReactiveUtils.state({ count: 0, name: 'World' });

// Effect 1 — watches count
ReactiveUtils.effect(() => {
  document.getElementById('counter').textContent = app.count;
});

// Effect 2 — watches name
ReactiveUtils.effect(() => {
  document.getElementById('greeting').textContent = `Hello, ${app.name}`;
});

// Effect 3 — watches both
ReactiveUtils.effect(() => {
  document.title = `${app.name} (${app.count})`;
});

app.count = 5;
// Effect 1 re-runs ✅ (depends on count)
// Effect 2 does NOT re-run (depends on name, not count)
// Effect 3 re-runs ✅ (depends on both)
```

### Bulk effects

Create multiple effects at once:

```javascript
const cleanup = ReactiveUtils.effects({
  updateTitle: () => {
    document.title = app.name;
  },
  updateCounter: () => {
    document.getElementById('count').textContent = app.count;
  },
  updateTheme: () => {
    document.body.className = app.theme;
  }
});

// Stop all effects at once
cleanup();
```

---

## $computed() — Derived values

### What is it?

A computed property is a value that is **calculated from other state**. It's lazy — it only recalculates when one of its dependencies changes AND someone reads it.

### Syntax

```javascript
const app = ReactiveUtils.state({ price: 100, taxRate: 0.1 });

// Add a computed property
app.$computed('total', function() {
  return this.price + (this.price * this.taxRate);
});

console.log(app.total);  // 110
```

### How it works

```
app.total is read
   ↓
1️⃣ Is the computed marked as "dirty"?
   ├── No → return cached value (fast!)
   └── Yes → continue
   ↓
2️⃣ Run the compute function
   ↓
3️⃣ Cache the result
   ↓
4️⃣ Mark as "clean"
   ↓
5️⃣ Return the value
```

### The "dirty" mechanism

```javascript
const app = ReactiveUtils.state({ firstName: 'Alice', lastName: 'Smith' });

app.$computed('fullName', function() {
  console.log('Computing fullName...');
  return `${this.firstName} ${this.lastName}`;
});

console.log(app.fullName);  // "Computing fullName..." → "Alice Smith"
console.log(app.fullName);  // "Alice Smith" (no log — uses cached value!)
console.log(app.fullName);  // "Alice Smith" (still cached)

app.firstName = 'Bob';      // Marks fullName as "dirty"

console.log(app.fullName);  // "Computing fullName..." → "Bob Smith" (recalculated)
console.log(app.fullName);  // "Bob Smith" (cached again)
```

The computed function only runs when:
1. A dependency changed (marked dirty), AND
2. Someone actually reads the computed value

### Computed in effects

Computed properties work seamlessly with effects:

```javascript
const cart = ReactiveUtils.state({ price: 50, quantity: 2, taxRate: 0.08 });

cart.$computed('subtotal', function() {
  return this.price * this.quantity;
});

cart.$computed('total', function() {
  return this.subtotal * (1 + this.taxRate);
});

ReactiveUtils.effect(() => {
  document.getElementById('total').textContent = `$${cart.total.toFixed(2)}`;
});
// Shows: "$108.00"

cart.quantity = 3;
// subtotal recalculates → total recalculates → effect re-runs
// Shows: "$162.00"
```

### Chaining computed

`$computed()` returns the state object, so you can chain:

```javascript
const app = ReactiveUtils.state({ width: 10, height: 5 })
  .$computed('area', function() { return this.width * this.height; })
  .$computed('perimeter', function() { return 2 * (this.width + this.height); })
  .$computed('isSquare', function() { return this.width === this.height; });

console.log(app.area);      // 50
console.log(app.perimeter);  // 30
console.log(app.isSquare);   // false
```

### Functional API for computed

You can also add computed properties using the functional API:

```javascript
const app = ReactiveUtils.state({ count: 0 });

ReactiveUtils.computed(app, {
  doubled: function() { return this.count * 2; },
  isEven: function() { return this.count % 2 === 0; }
});

console.log(app.doubled);  // 0
console.log(app.isEven);   // true
```

---

## $watch() — React to specific changes

### What is it?

`$watch()` calls a callback whenever a specific property (or computed expression) changes. Unlike `effect()`, it gives you both the **new** and **old** values.

### Syntax — watch a property by name

```javascript
const app = ReactiveUtils.state({ count: 0 });

const stop = app.$watch('count', (newValue, oldValue) => {
  console.log(`count changed from ${oldValue} to ${newValue}`);
});

app.count = 5;   // "count changed from 0 to 5"
app.count = 10;  // "count changed from 5 to 10"

// Stop watching
stop();
app.count = 20;  // No output — watcher stopped
```

### Syntax — watch a computed expression

```javascript
const app = ReactiveUtils.state({ firstName: 'Alice', lastName: 'Smith' });

const stop = app.$watch(
  function() { return `${this.firstName} ${this.lastName}`; },
  (newValue, oldValue) => {
    console.log(`Name changed from "${oldValue}" to "${newValue}"`);
  }
);

app.firstName = 'Bob';  // "Name changed from "Alice Smith" to "Bob Smith""
```

### Effect vs Watch — when to use which

```javascript
const app = ReactiveUtils.state({ count: 0 });

// EFFECT — run side effects, no old/new comparison
ReactiveUtils.effect(() => {
  document.getElementById('count').textContent = app.count;
});

// WATCH — react to changes with old/new values
app.$watch('count', (newVal, oldVal) => {
  console.log(`Changed: ${oldVal} → ${newVal}`);
  if (newVal > 100) alert('Count is very high!');
});
```

**Use `effect()`** when you want to keep the DOM in sync with state.

**Use `$watch()`** when you need to know what changed (old vs new) or want to run logic only when a specific property changes.

### Functional API for watch

```javascript
const app = ReactiveUtils.state({ count: 0, name: 'Alice' });

const cleanup = ReactiveUtils.watch(app, {
  count: (newVal, oldVal) => console.log('count:', oldVal, '→', newVal),
  name: (newVal, oldVal) => console.log('name:', oldVal, '→', newVal)
});

app.count = 5;       // "count: 0 → 5"
app.name = 'Bob';    // "name: Alice → Bob"

// Stop all watchers
cleanup();
```

---

## Combining all three

Here's how effect, computed, and watch work together:

```javascript
const app = ReactiveUtils.state({
  items: [],
  taxRate: 0.08
});

// Computed — derived values
app.$computed('itemCount', function() {
  return this.items.length;
});

app.$computed('subtotal', function() {
  return this.items.reduce((sum, item) => sum + item.price, 0);
});

app.$computed('total', function() {
  return this.subtotal * (1 + this.taxRate);
});

// Effect — keep DOM in sync
ReactiveUtils.effect(() => {
  document.getElementById('count').textContent = app.itemCount;
  document.getElementById('subtotal').textContent = `$${app.subtotal.toFixed(2)}`;
  document.getElementById('total').textContent = `$${app.total.toFixed(2)}`;
});

// Watch — react to specific changes
app.$watch('itemCount', (newCount, oldCount) => {
  if (newCount > oldCount) {
    showNotification('Item added to cart!');
  }
});

// Everything works together
app.items.push({ name: 'Widget', price: 25 });
// 1. itemCount, subtotal, total recalculate
// 2. Effect re-runs — DOM updates
// 3. Watch fires — notification shown
```

---

## Common patterns

### Pattern 1: Conditional effects

```javascript
ReactiveUtils.effect(() => {
  if (app.isLoggedIn) {
    document.getElementById('profile').style.display = 'block';
    document.getElementById('loginBtn').style.display = 'none';
  } else {
    document.getElementById('profile').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'block';
  }
});
```

### Pattern 2: Computed validation

```javascript
const form = ReactiveUtils.state({ email: '', password: '' });

form.$computed('isValid', function() {
  return this.email.includes('@') && this.password.length >= 8;
});

ReactiveUtils.effect(() => {
  document.getElementById('submitBtn').disabled = !form.isValid;
});
```

### Pattern 3: Watch for side effects

```javascript
app.$watch('theme', (newTheme) => {
  localStorage.setItem('theme', newTheme);
});

app.$watch('language', (newLang) => {
  document.documentElement.lang = newLang;
});
```

---

## Key takeaways

1. **effect()** — runs immediately, re-runs on dependency changes, auto-tracks dependencies
2. **$computed()** — lazy derived values, only recalculates when dirty AND read
3. **$watch()** — explicit property watching, gives old and new values
4. **Effects are for DOM updates** — keep the UI in sync
5. **Computed is for derived data** — avoid manual recalculation
6. **Watch is for reactions** — side effects that need old/new comparison
7. **All three return cleanup functions** — call them to stop watching

---

## What's next?

Now let's explore the instance methods that every reactive object gets:
- `$update()` for mixed state + DOM updates
- `$set()` for functional updates
- `$batch()` for grouped changes
- `$bind()` for connecting state to DOM

Let's continue!