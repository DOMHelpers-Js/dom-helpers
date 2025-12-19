### What's an Effect?

An **effect** is code that automatically runs whenever the data it uses changes.

```javascript
const counter = ReactiveUtils.state({ count: 0 });

// Create an effect - runs immediately
ReactiveUtils.effect(() => {
  console.log('Count is: ' + counter.count);
});
// Logs: "Count is: 0"

// Change the data
counter.count = 5;
// Automatically logs: "Count is: 5"

counter.count = 10;
// Automatically logs: "Count is: 10"
```

**How it works:**

1. The effect function runs immediately
2. While running, it reads `counter.count`
3. The reactive system remembers: "This effect depends on `counter.count`"
4. When `counter.count` changes, the effect automatically runs again

### Real Example: Updating the Screen

```javascript
const user = ReactiveUtils.state({
  firstName: 'John',
  lastName: 'Doe'
});

// Effect that updates the screen
ReactiveUtils.effect(() => {
  const fullName = user.firstName + ' ' + user.lastName;
  document.getElementById('username').textContent = fullName;
});
// Screen immediately shows: "John Doe"

user.firstName = 'Jane';
// Screen automatically updates to: "Jane Doe"
```

---

## Adding Computed Properties

**Computed properties** are values that are calculated from other values and automatically update when dependencies change.

### Using `$computed()`

```javascript
const cart = ReactiveUtils.state({
  items: [
    { name: 'Apple', price: 1.50, quantity: 3 },
    { name: 'Banana', price: 0.75, quantity: 5 }
  ]
});

// Add a computed property
cart.$computed('total', function() {
  return this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
});

console.log(cart.total); // 8.25

// Change the data
cart.items[0].quantity = 5;

console.log(cart.total); // 11.25 (automatically recalculated!)
```

**What happened:**

1. We defined how to calculate `total`
2. When we access `cart.total`, it calculates the value
3. The result is cached (saved)
4. When `items` changes, the cache is invalidated
5. Next time we access `cart.total`, it recalculates

### Why Use Computed?

Instead of this:

```javascript
// ❌ Manual calculation every time
function getTotal() {
  return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

console.log(getTotal()); // Have to call function
console.log(getTotal()); // Calculate again
console.log(getTotal()); // Calculate again (wasteful!)
```

Do this:

```javascript
// ✅ Automatic calculation, cached result
cart.$computed('total', function() {
  return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

console.log(cart.total); // Calculates
console.log(cart.total); // Uses cached value (fast!)
console.log(cart.total); // Uses cached value (fast!)
```

---

## Watching for Changes

**Watchers** let you run code when a specific property changes, and you get both the old and new values.

### Using `$watch()`

```javascript
const user = ReactiveUtils.state({
  email: 'old@example.com'
});

// Watch for email changes
user.$watch('email', (newEmail, oldEmail) => {
  console.log(`Email changed from ${oldEmail} to ${newEmail}`);
});

user.email = 'new@example.com';
// Logs: "Email changed from old@example.com to new@example.com"
```

### Real Example: Form Validation

```javascript
const form = ReactiveUtils.state({
  password: '',
  passwordError: ''
});

// Watch password and validate it
form.$watch('password', (newPassword) => {
  if (newPassword.length < 8) {
    form.passwordError = 'Password must be at least 8 characters';
  } else {
    form.passwordError = '';
  }
});

form.password = 'hi';
console.log(form.passwordError); // "Password must be at least 8 characters"

form.password = 'secure123';
console.log(form.passwordError); // "" (empty - no error)
```

---

## Working with Nested Objects

One of the powerful features of `state()` is **deep reactivity** - nested objects automatically become reactive too!

### Nested Objects Become Reactive Automatically

```javascript
const app = ReactiveUtils.state({
  user: {
    profile: {
      name: 'Alice',
      age: 30
    },
    settings: {
      theme: 'dark'
    }
  }
});

// Effect watching nested property
ReactiveUtils.effect(() => {
  console.log('Theme: ' + app.user.settings.theme);
});
// Logs: "Theme: dark"

// Change nested property - still reactive!
app.user.settings.theme = 'light';
// Logs: "Theme: light"
```

### Deep Nesting Works Too

```javascript
const data = ReactiveUtils.state({
  level1: {
    level2: {
      level3: {
        value: 'deep'
      }
    }
  }
});

ReactiveUtils.effect(() => {
  console.log(data.level1.level2.level3.value);
});
// Logs: "deep"

data.level1.level2.level3.value = 'very deep';
// Logs: "very deep"
```

---

## Batching Updates

Sometimes you want to make multiple changes but only trigger updates once at the end.

### Using `$batch()`

```javascript
const counter = ReactiveUtils.state({
  count: 0,
  step: 1,
  multiplier: 2
});

ReactiveUtils.effect(() => {
  console.log('Count:', counter.count);
});

// Without batching - triggers 3 times
counter.count = 1;     // Logs: "Count: 1"
counter.count = 2;     // Logs: "Count: 2"
counter.count = 3;     // Logs: "Count: 3"

// With batching - triggers only once at the end
counter.$batch(() => {
  counter.count = 10;
  counter.count = 20;
  counter.count = 30;
});
// Only logs once: "Count: 30"
```

### Why Batch?

**Performance!** If you're making many changes, batching prevents unnecessary re-renders.

```javascript
const todos = ReactiveUtils.state({
  items: []
});

// Add 100 todos with batching
todos.$batch(() => {
  for (let i = 0; i < 100; i++) {
    todos.items.push({ id: i, text: `Todo ${i}` });
  }
});
// UI updates only once after all 100 are added!
```

---

## Getting the Raw Object

Sometimes you need the original, non-reactive object (for example, to send data to an API).

### Using `$raw`

```javascript
const user = ReactiveUtils.state({
  name: 'John',
  age: 25,
  password: 'secret123'
});

// Get the raw, non-reactive object
const rawUser = user.$raw;

console.log(rawUser); 
// { name: 'John', age: 25, password: 'secret123' }

// Send to API (you want raw data, not the Proxy)
fetch('/api/user', {
  method: 'POST',
  body: JSON.stringify(rawUser)
});
```

---

## Practical Examples

### Example 1: Simple Counter

```javascript
// Create reactive state
const counter = ReactiveUtils.state({
  count: 0
});

// Update screen automatically
ReactiveUtils.effect(() => {
  document.getElementById('counter').textContent = counter.count;
});

// Button clicks
document.getElementById('increment').onclick = () => {
  counter.count++;
};

document.getElementById('decrement').onclick = () => {
  counter.count--;
};
```

### Example 2: User Profile with Computed

```javascript
const user = ReactiveUtils.state({
  firstName: 'John',
  lastName: 'Doe',
  age: 25
});

// Computed full name
user.$computed('fullName', function() {
  return this.firstName + ' ' + this.lastName;
});

// Computed age category
user.$computed('ageCategory', function() {
  if (this.age < 18) return 'Minor';
  if (this.age < 65) return 'Adult';
  return 'Senior';
});

console.log(user.fullName);     // "John Doe"
console.log(user.ageCategory);  // "Adult"

user.firstName = 'Jane';
console.log(user.fullName);     // "Jane Doe" (auto-updated!)

user.age = 70;
console.log(user.ageCategory);  // "Senior" (auto-updated!)
```

### Example 3: Shopping Cart

```javascript
const cart = ReactiveUtils.state({
  items: [],
  taxRate: 0.08
});

// Computed subtotal
cart.$computed('subtotal', function() {
  return this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
});

// Computed tax
cart.$computed('tax', function() {
  return this.subtotal * this.taxRate;
});

// Computed total
cart.$computed('total', function() {
  return this.subtotal + this.tax;
});

// Update display automatically
ReactiveUtils.effect(() => {
  document.getElementById('subtotal').textContent = '$' + cart.subtotal.toFixed(2);
  document.getElementById('tax').textContent = '$' + cart.tax.toFixed(2);
  document.getElementById('total').textContent = '$' + cart.total.toFixed(2);
});

// Add items
cart.items.push({ name: 'Apple', price: 1.50, quantity: 3 });
cart.items.push({ name: 'Banana', price: 0.75, quantity: 5 });
// Display automatically updates!
```

### Example 4: Form with Validation

```javascript
const loginForm = ReactiveUtils.state({
  email: '',
  password: '',
  emailError: '',
  passwordError: ''
});

// Computed: is form valid?
loginForm.$computed('isValid', function() {
  return this.email && 
         this.password && 
         !this.emailError && 
         !this.passwordError;
});

// Watch email and validate
loginForm.$watch('email', (newEmail) => {
  if (!newEmail) {
    loginForm.emailError = 'Email is required';
  } else if (!newEmail.includes('@')) {
    loginForm.emailError = 'Email must be valid';
  } else {
    loginForm.emailError = '';
  }
});

// Watch password and validate
loginForm.$watch('password', (newPassword) => {
  if (!newPassword) {
    loginForm.passwordError = 'Password is required';
  } else if (newPassword.length < 8) {
    loginForm.passwordError = 'Password must be at least 8 characters';
  } else {
    loginForm.passwordError = '';
  }
});

// Update submit button state
ReactiveUtils.effect(() => {
  document.getElementById('submit-btn').disabled = !loginForm.isValid;
});

// Test it
loginForm.email = 'test';
console.log(loginForm.emailError); // "Email must be valid"
console.log(loginForm.isValid);    // false

loginForm.email = 'test@example.com';
loginForm.password = 'secure123';
console.log(loginForm.isValid);    // true
```

---

## Instance Methods Reference

Every state object created with `state()` has these helpful methods:

### `$computed(name, function)`
Add a computed property that automatically recalculates when dependencies change.

```javascript
state.$computed('propertyName', function() {
  return /* calculated value */;
});
```

### `$watch(property, callback)`
Watch a property for changes and run a callback.

```javascript
state.$watch('propertyName', (newValue, oldValue) => {
  // Do something with the change
});
```

### `$batch(function)`
Make multiple changes and trigger updates only once at the end.

```javascript
state.$batch(() => {
  state.prop1 = 'value1';
  state.prop2 = 'value2';
  state.prop3 = 'value3';
});
```

### `$notify(property)`
Manually trigger updates for a property (rare, but sometimes useful).

```javascript
state.$notify('propertyName');
```

### `$raw`
Get the original, non-reactive object.

```javascript
const rawObject = state.$raw;
```

### `$update(updates)`
Update multiple properties at once (can also update DOM elements).

```javascript
state.$update({
  name: 'John',
  age: 30,
  '#element': { textContent: 'Updated!' }
});
```

### `$set(updates)`
Update properties using functions.

```javascript
state.$set({
  count: (current) => current + 1,
  name: 'New Name'
});
```

---

## Common Beginner Questions

### Q: What's the difference between `state()` and `createState()`?

**Answer:**

- **`state()`** = Creates reactive data only (no automatic DOM updates)
- **`createState()`** = Creates reactive data + automatic DOM connections

```javascript
// state() - You handle UI updates
const data1 = ReactiveUtils.state({ count: 0 });
ReactiveUtils.effect(() => {
  document.getElementById('counter').textContent = data1.count;
});

// createState() - DOM updates automatically
const data2 = ReactiveUtils.createState(
  { count: 0 },
  { '#counter': 'count' }
);
```

**Use `state()` when:**
- You want more control
- You're not updating the DOM
- You're using it with a framework like React/Vue
- You need reactive data for logic only

**Use `createState()` when:**
- You want automatic DOM updates
- You're building vanilla JS apps
- You want less code

### Q: Can I use arrays with `state()`?

**Answer:** Yes, but you need the `reactive-array-support.js` module for array methods (push, pop, etc.) to be ReactiveUtils.

```javascript
// With array support loaded
const todos = ReactiveUtils.state({
  items: []
});

ReactiveUtils.effect(() => {
  console.log('Todo count:', todos.items.length);
});

todos.items.push({ text: 'New todo' });
// Effect runs, logs new count!
```

### Q: Do I need to create a new effect every time?

**Answer:** No! Create effects once during setup. They'll continue watching and re-running automatically.

```javascript
// ✅ Create effect once
const counter = ReactiveUtils.state({ count: 0 });

ReactiveUtils.effect(() => {
  console.log(counter.count);
});

// Then just change the data - effect runs automatically
counter.count = 1;  // Effect runs
counter.count = 2;  // Effect runs
counter.count = 3;  // Effect runs
```

### Q: Can I have multiple states?

**Answer:** Absolutely! Create as many as you need.

```javascript
const user = ReactiveUtils.state({ name: 'John' });
const cart = ReactiveUtils.state({ items: [] });
const settings = ReactiveUtils.state({ theme: 'dark' });

// They're all independent
```

### Q: What happens if I change multiple properties?

**Answer:** Each change triggers its dependent effects. Use `$batch()` to combine them.

```javascript
const state = ReactiveUtils.state({ a: 0, b: 0 });

ReactiveUtils.effect(() => {
  console.log('a =', state.a);
});

ReactiveUtils.effect(() => {
  console.log('b =', state.b);
});

// Triggers both effects
state.a = 1;  // Logs: "a = 1"
state.b = 2;  // Logs: "b = 2"

// Batch to trigger only once at the end
state.$batch(() => {
  state.a = 10;
  state.b = 20;
});
// Logs: "a = 10", then "b = 20"
```

---

## Tips for Beginners

### 1. Start with Simple State

Don't overcomplicate your first states:

```javascript
// ✅ Good for beginners
const counter = ReactiveUtils.state({ count: 0 });

// ❌ Too complex at first
const complexState = ReactiveUtils.state({
  user: { profile: { settings: { theme: { colors: {} } } } }
});
```

### 2. Use Effects to See Changes

Add console.log effects to understand what's happening:

```javascript
const state = ReactiveUtils.state({ value: 0 });

ReactiveUtils.effect(() => {
  console.log('Value changed to:', state.value);
});

state.value = 5; // See it log!
```

### 3. Computed for Calculations

If you're calculating something from state, use computed:

```javascript
// ❌ Calculating manually
const total = state.price * state.quantity;

// ✅ Use computed instead
state.$computed('total', function() {
  return this.price * this.quantity;
});
```

### 4. Watch for Side Effects

Use `$watch()` when a change should trigger something specific:

```javascript
state.$watch('theme', (newTheme) => {
  document.body.className = 'theme-' + newTheme;
});
```

### 5. Debug with `$raw`

If something seems weird, check the raw object:

```javascript
console.log('Reactive:', state);
console.log('Raw:', state.$raw);
```

---

## When to Use `state()`

### ✅ Use `state()` when:

- You need reactive data without automatic DOM updates
- You're building application logic
- You're using it with other libraries/frameworks
- You want maximum control and flexibility
- You need computed properties and watchers
- You're managing complex data structures

### ❌ Don't use `state()` when:

- You just need static data (use regular objects)
- You want automatic DOM updates (use `createState()` instead)
- You're working with lists (use `collection()` from reactive-collections)
- You're building forms (use `form()` from reactive-forms)

---

## Summary

### What `state()` Does:

1. ✅ Takes a regular object and makes it reactive
2. ✅ Tracks when properties are read and written
3. ✅ Automatically re-runs effects when dependencies change
4. ✅ Supports computed properties that auto-update
5. ✅ Supports watchers that detect specific changes
6. ✅ Works with nested objects (deep reactivity)

### The Basic Pattern:

```javascript
// 1. Create reactive state
const myState = ReactiveUtils.state({
  // your data here
});

// 2. Add computed properties (optional)
myState.$computed('calculatedValue', function() {
  return /* calculation */;
});

// 3. Watch for changes (optional)
myState.$watch('property', (newVal, oldVal) => {
  // respond to change
});

// 4. Create effects that use the state
ReactiveUtils.effect(() => {
  // this code runs when dependencies change
});

// 5. Just change the data - everything updates automatically!
myState.property = 'new value';
```
