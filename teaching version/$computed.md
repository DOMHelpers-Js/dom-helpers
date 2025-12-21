# `state.$computed()` - Add Cached, Reactive Computed Properties

> **You are a senior JavaScript engineer teaching a beginner**

---

## The Problem: Recalculating Derived Values Over and Over

Imagine you have a shopping cart. You need to calculate the total price based on items. If you recalculate every single time someone asks for the total, you're wasting CPU cycles!

Here's what happens **WITHOUT** `$computed()`:

```javascript
const cart = state({
  items: [
    { name: 'Laptop', price: 999, quantity: 1 },
    { name: 'Mouse', price: 29, quantity: 2 }
  ]
});

// Calculate total (every time you need it!)
function getTotal() {
  return cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
}

// Used in multiple places
console.log('Total:', getTotal());  // Recalculates
console.log('With tax:', getTotal() * 1.1);  // Recalculates again
console.log('Formatted:', `$${getTotal().toFixed(2)}`);  // Recalculates again!

// In an effect, it recalculates on EVERY re-run
effect(() => {
  document.getElementById('total').textContent = getTotal(); // Recalculates
  document.getElementById('tax').textContent = getTotal() * 0.1; // Recalculates again!
});
```

**The Real Issues:**
- Calculation runs **every single time** you access it
- Expensive calculations waste CPU
- Same calculation repeated in multiple places
- No caching/memoization

---

## The Solution: `$computed()` - Calculate Once, Cache Until Dependencies Change

`$computed()` creates a **computed property** that:
1. Calculates the value **only once**
2. **Caches** the result
3. Recalculates **only when** dependencies change
4. Is **reactive** (can be used in effects, watchers, bindings)

```javascript
const cart = state({
  items: [
    { name: 'Laptop', price: 999, quantity: 1 },
    { name: 'Mouse', price: 29, quantity: 2 }
  ]
});

// ✅ Add computed property (calculates once, caches result)
cart.$computed('total', function() {
  console.log('Calculating total...'); // See when it recalculates
  return this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
});

// Access it like a normal property (no function call!)
console.log('Total:', cart.total);  // Logs "Calculating total...", returns 1057
console.log('Total:', cart.total);  // Returns cached 1057 (doesn't recalculate!)
console.log('Total:', cart.total);  // Returns cached 1057 (doesn't recalculate!)

// Only recalculates when items change
cart.items.push({ name: 'Keyboard', price: 79, quantity: 1 });
console.log('Total:', cart.total);  // Logs "Calculating total...", returns 1136
console.log('Total:', cart.total);  // Returns cached 1136 (doesn't recalculate!)
```

**Think of it like this:**
- **Function**: Runs every time you call it
- **Computed**: Runs once, remembers result, only re-runs when dependencies change

---

## How It Works Under the Hood

When you call `$computed(key, fn)`:

```
state.$computed('total', function() { return this.items.reduce(...) })
        ↓
1. Create a computed property on state
2. First access: Run function, track dependencies (items)
3. Cache the result
4. Return cached value on subsequent accesses
5. When dependencies change: Mark as "dirty"
6. Next access: Recalculate, cache, return
```

**Example:**
```javascript
cart.$computed('total', function() {
  return this.items.reduce((sum, i) => sum + i.price, 0);
});

// First access
cart.total;  // Runs function, tracks 'items', caches result

// More accesses
cart.total;  // Returns cache
cart.total;  // Returns cache

// Dependency changes
cart.items.push({ price: 100 });  // Marks 'total' as dirty

// Next access
cart.total;  // Recalculates, caches new result
```

**The magic:** The function tracks which properties you access (`this.items`). When those properties change, the computed value knows to recalculate!

---

## When to Use `$computed()`

### ✅ Use Case 1: Shopping Cart Totals

Calculate subtotal, tax, shipping, total.

```javascript
const cart = state({
  items: [],
  couponCode: ''
});

// Subtotal (sum of all items)
cart.$computed('subtotal', function() {
  return this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
});

// Discount (10% if code is SAVE10)
cart.$computed('discount', function() {
  if (this.couponCode === 'SAVE10') {
    return this.subtotal * 0.1;
  }
  return 0;
});

// Tax (10% of subtotal minus discount)
cart.$computed('tax', function() {
  return (this.subtotal - this.discount) * 0.1;
});

// Shipping (free over $50)
cart.$computed('shipping', function() {
  return this.subtotal > 50 ? 0 : 5.99;
});

// Total (everything combined)
cart.$computed('total', function() {
  return this.subtotal - this.discount + this.tax + this.shipping;
});

// Add items
cart.items.push({ name: 'Laptop', price: 999, quantity: 1 });

// Access computed values (only calculate when needed!)
console.log('Subtotal:', cart.subtotal);  // 999
console.log('Tax:', cart.tax);            // 99.9
console.log('Shipping:', cart.shipping);  // 0 (over $50)
console.log('Total:', cart.total);        // 1098.9

// Apply coupon
cart.couponCode = 'SAVE10';
console.log('Discount:', cart.discount);  // 99.9
console.log('Total:', cart.total);        // 999 (recalculated!)
```

**Why this works:** Computed properties can depend on OTHER computed properties! `total` depends on `subtotal`, `discount`, `tax`, and `shipping`.

---

### ✅ Use Case 2: User Full Name and Initials

Derive display values from user data.

```javascript
const user = state({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com'
});

// Full name
user.$computed('fullName', function() {
  return `${this.firstName} ${this.lastName}`;
});

// Initials
user.$computed('initials', function() {
  return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
});

// Username (from email)
user.$computed('username', function() {
  return this.email.split('@')[0];
});

// Display name (fullName or username)
user.$computed('displayName', function() {
  return this.fullName || this.username || 'Anonymous';
});

console.log(user.fullName);    // "John Doe"
console.log(user.initials);    // "JD"
console.log(user.username);    // "john.doe"
console.log(user.displayName); // "John Doe"

// Change name
user.firstName = 'Jane';
console.log(user.fullName);    // "Jane Doe" (recalculated!)
console.log(user.initials);    // "JD" (recalculated!)
```

**Why this works:** Computed properties make it easy to derive display values without storing them separately.

---

### ✅ Use Case 3: Todo List Statistics

Calculate filtered lists and counts.

```javascript
const todos = state({
  items: [
    { id: 1, text: 'Buy milk', completed: false },
    { id: 2, text: 'Call dentist', completed: true },
    { id: 3, text: 'Finish project', completed: false }
  ],
  filter: 'all'
});

// Active todos
todos.$computed('activeTodos', function() {
  return this.items.filter(todo => !todo.completed);
});

// Completed todos
todos.$computed('completedTodos', function() {
  return this.items.filter(todo => todo.completed);
});

// Filtered todos (based on current filter)
todos.$computed('filteredTodos', function() {
  if (this.filter === 'active') return this.activeTodos;
  if (this.filter === 'completed') return this.completedTodos;
  return this.items;
});

// Counts
todos.$computed('activeCount', function() {
  return this.activeTodos.length;
});

todos.$computed('completedCount', function() {
  return this.completedTodos.length;
});

// Progress percentage
todos.$computed('progressPercent', function() {
  if (this.items.length === 0) return 0;
  return Math.round((this.completedCount / this.items.length) * 100);
});

console.log('Active:', todos.activeCount);       // 2
console.log('Completed:', todos.completedCount); // 1
console.log('Progress:', todos.progressPercent); // 33%

// Toggle a todo
todos.items[0].completed = true;
console.log('Active:', todos.activeCount);       // 1 (recalculated!)
console.log('Progress:', todos.progressPercent); // 67% (recalculated!)
```

**Why this works:** Statistics update automatically when todos change. No manual recalculation!

---

### ✅ Use Case 4: Form Validation

Compute form validity from field errors.

```javascript
const form = state({
  fields: {
    email: '',
    password: '',
    confirmPassword: ''
  },
  errors: {},
  touched: {}
});

// Is email valid?
form.$computed('isEmailValid', function() {
  return this.fields.email && this.fields.email.includes('@');
});

// Is password valid?
form.$computed('isPasswordValid', function() {
  return this.fields.password && this.fields.password.length >= 8;
});

// Do passwords match?
form.$computed('doPasswordsMatch', function() {
  return this.fields.password === this.fields.confirmPassword;
});

// Is entire form valid?
form.$computed('isFormValid', function() {
  return this.isEmailValid &&
         this.isPasswordValid &&
         this.doPasswordsMatch &&
         Object.keys(this.errors).length === 0;
});

// Can submit?
form.$computed('canSubmit', function() {
  return this.isFormValid && !this.isSubmitting;
});

// Update fields
form.fields.email = 'john@example.com';
form.fields.password = 'secret123';
form.fields.confirmPassword = 'secret123';

console.log('Can submit?', form.canSubmit); // true
```

**Why this works:** Form validity is a derived value. Computed properties keep it in sync automatically.

---

### ✅ Use Case 5: Game Stats

Calculate player stats from base values.

```javascript
const player = state({
  level: 5,
  baseHealth: 100,
  baseAttack: 10,
  baseDefense: 5,
  equipment: {
    weapon: { attack: 15 },
    armor: { defense: 10 }
  },
  buffs: []
});

// Max health (increases with level)
player.$computed('maxHealth', function() {
  return this.baseHealth + (this.level * 20);
});

// Total attack (base + weapon + buffs)
player.$computed('totalAttack', function() {
  let attack = this.baseAttack + (this.equipment.weapon?.attack || 0);
  this.buffs.forEach(buff => {
    if (buff.type === 'attack') attack += buff.value;
  });
  return attack;
});

// Total defense (base + armor + buffs)
player.$computed('totalDefense', function() {
  let defense = this.baseDefense + (this.equipment.armor?.defense || 0);
  this.buffs.forEach(buff => {
    if (buff.type === 'defense') defense += buff.value;
  });
  return defense;
});

// Power rating (overall strength)
player.$computed('powerRating', function() {
  return this.totalAttack + this.totalDefense + this.level;
});

console.log('Max Health:', player.maxHealth);     // 200
console.log('Total Attack:', player.totalAttack); // 25
console.log('Total Defense:', player.totalDefense); // 15
console.log('Power:', player.powerRating);        // 45

// Level up
player.level = 10;
console.log('Max Health:', player.maxHealth);     // 300 (recalculated!)
console.log('Power:', player.powerRating);        // 50 (recalculated!)
```

**Why this works:** Game stats derive from multiple sources. Computed properties handle complex calculations automatically.

---

## How `$computed()` Interacts With Other Features

### With Effects - Triggers When Computed Changes

```javascript
const cart = state({ items: [] });

cart.$computed('total', function() {
  return this.items.reduce((sum, i) => sum + i.price, 0);
});

effect(() => {
  console.log('Total is:', cart.total);  // Tracks 'total'
});

cart.items.push({ price: 100 });
// items changes → total recalculates → effect runs
```

**Lesson:** Computed properties are reactive! You can use them in effects.

---

### With Bindings - Auto-Updates DOM

```javascript
const user = state({ firstName: 'John', lastName: 'Doe' });

user.$computed('fullName', function() {
  return `${this.firstName} ${this.lastName}`;
});

user.$bind({
  '#full-name': 'fullName'  // Bind to computed property
});

user.firstName = 'Jane';
// firstName changes → fullName recalculates → binding updates DOM
```

**Lesson:** You can bind to computed properties just like regular properties!

---

### With Watch - Watch Computed Values

```javascript
const todos = state({ items: [] });

todos.$computed('activeCount', function() {
  return this.items.filter(t => !t.completed).length;
});

todos.$watch('activeCount', function(newCount, oldCount) {
  console.log(`Active todos: ${oldCount} → ${newCount}`);
});

todos.items.push({ text: 'Buy milk', completed: false });
// Logs: "Active todos: 0 → 1"
```

**Lesson:** You can watch computed properties to react to derived values!

---

## When NOT to Use `$computed()`

### ❌ Don't Use for Async Operations

```javascript
// ❌ WRONG: Computed can't be async
state.$computed('data', async function() {
  return await fetch('/api/data').then(r => r.json());
});

// ✅ RIGHT: Use async state or regular property
async function loadData() {
  const data = await fetch('/api/data').then(r => r.json());
  state.data = data;
}
```

**Why:** Computed properties must return values synchronously!

---

### ❌ Don't Modify State Inside Computed

```javascript
// ❌ WRONG: Side effects in computed
state.$computed('total', function() {
  this.lastCalculated = new Date(); // Don't modify state!
  return this.items.reduce((sum, i) => sum + i.price, 0);
});

// ✅ RIGHT: Pure calculation only
state.$computed('total', function() {
  return this.items.reduce((sum, i) => sum + i.price, 0);
});
```

**Why:** Computed functions should be **pure** (no side effects). Only calculate and return!

---

## Comparison with Related Methods

| Approach | Caches? | Reactive? | Recalculates When? |
|----------|---------|-----------|-------------------|
| Function | ❌ No | ❌ No | Every call |
| `computed()` (global) | ✅ Yes | ✅ Yes | Dependencies change |
| `$computed()` (instance) | ✅ Yes | ✅ Yes | Dependencies change |
| `effect()` | ❌ No | ✅ Yes | Dependencies change |

**When to use which:**
- **Function** - Simple, one-off calculations
- **`computed()`** - Global computed values
- **`$computed()`** - Add computed property to state instance
- **`effect()`** - Side effects (DOM updates, logging), not values

---

## Quick Mental Model

Think of computed as **"lazy calculation with memory"**:

```javascript
// Regular function: No memory
function getTotal() {
  console.log('Calculating...');
  return items.reduce((sum, i) => sum + i.price, 0);
}

getTotal(); // Logs "Calculating..."
getTotal(); // Logs "Calculating..." (again!)
getTotal(); // Logs "Calculating..." (again!)

// Computed: Has memory!
state.$computed('total', function() {
  console.log('Calculating...');
  return this.items.reduce((sum, i) => sum + i.price, 0);
});

state.total; // Logs "Calculating..."
state.total; // Returns cache (no log)
state.total; // Returns cache (no log)
```

**Remember:**
- Computed = Calculate once, cache, recalculate only when needed
- Use `this` to access state properties
- Returns a value (synchronous only)
- Can depend on other computed properties

---

## Summary

**`state.$computed()` adds a cached, reactive computed property that only recalculates when its dependencies change.**

**When to use it:**
- ✅ Derived values (fullName from firstName + lastName)
- ✅ Expensive calculations (cart totals, statistics)
- ✅ Filtered/transformed arrays
- ✅ Form validation status
- ✅ Chain computeds (total depends on subtotal, tax, shipping)

**When NOT to use it:**
- ❌ Async operations (use regular properties + async functions)
- ❌ Side effects (use `effect()` or `$watch()`)
- ❌ Don't modify state inside computed functions

**One-sentence summary:**
Use `$computed()` for expensive calculations that should only run when their inputs change - automatic caching and reactivity! 🎯

---

➡️ **Next:** Learn about [`$watch()`]($watch.md) for reacting to specific property changes!
