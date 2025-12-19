# Understanding `state()` - A Beginner's Guide

## What is `state()`?

`state()` is the **most fundamental function** in the Reactive library. It takes a regular JavaScript object and transforms it into a **reactive object** - one that can automatically detect when its properties change and trigger updates throughout your application.

Think of it as **upgrading a plain object to a smart object** - it becomes self-aware and can notify other parts of your code when something changes.

---

## Syntax

```js
// Using the shortcut
state({ property: value, ... })

// Using the full namespace
ReactiveUtils.state({ property: value, ... })
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`state()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.state()`) - Explicit and clear

**Parameters:**
- An object with initial properties and values

**Returns:**
- A reactive proxy object with the same properties, plus special methods (starting with `$`)

---

## Why Does This Exist?

### The Problem with Regular Objects

Let's say you have a regular JavaScript object:

```javascript
// Regular object - no special powers
const user = {
  name: 'John',
  age: 25
};

// You can read values
console.log(user.name); // "John"

// You can update values
user.name = 'Jane'; // Changed, but nobody knows!
console.log(user.name); // "Jane"
```

At first glance, this looks perfectly fine. JavaScript lets you read and write values easily.
But there's a hidden limitation.

**What's the Real Issue?**

**Problems:**
- When you change `user.name`, nothing else in your code knows about it - the change happens silently
- JavaScript does not notify other parts of your code that something changed
- You can't automatically update the screen
- You can't automatically run code when values change
- You have to manually check for changes everywhere
- The object changes, but nothing reacts to it

**Why This Becomes a Problem:**

As your app grows, this leads to several issues:
❌ Changes are invisible to the rest of your application
❌ The UI doesn't update unless you manually tell it to
❌ You can't easily run side effects when data changes
❌ You end up writing extra code just to "check" for changes
❌ Data and UI easily get out of sync

In other words, **regular objects have no awareness of change**.
They store data — **but they don't communicate**.

---

### The Solution with `state()`

When you wrap an object with `state()`, it becomes **reactive**:

```javascript
// Reactive object - now it has superpowers! ✨
const user = state({
  name: 'John',
  age: 25
});

// You can now attach logic that automatically runs whenever the state changes
effect(() => {
  console.log('Name is: ' + user.name);
});
// Immediately logs: "Name is: John"

// Now change the value
user.name = 'Jane';
// Automatically logs: "Name is: Jane"
```

**What Just Happened?**

With `state()`:
- Changes are detected automatically
- Any code that depends on the changed value re-runs by itself
- You don't need to manually track or trigger updates
- The UI stays in sync with your data

**Benefits:**
- Changes are automatically detected
- Code can automatically respond to changes
- You can build reactive user interfaces
- Less manual work, fewer bugs
- Data and UI stay synchronized

---

## How Does It Work?

### The Magic: JavaScript Proxies

When you call `state()`, it doesn't just return your object - it **wraps it in a Proxy**.

Think of a Proxy as a **smart wrapper** that sits between you and your data:

```
You  →  [Proxy Wrapper]  →  Your Data
        ↓
    Watches & Notifies
    when things change!
```

**What happens:**

1. When you **read** a property (`user.name`), the Proxy notices and tracks it
2. When you **write** a property (`user.name = 'Jane'`), the Proxy notices and triggers updates
3. Any code that depends on that property automatically re-runs

This is completely transparent - you use the reactive object exactly like a normal object, but it has special powers behind the scenes!

---

## Basic Usage

### Creating Reactive State

The simplest way to use `state()` is to wrap a plain JavaScript object:

```js
// Using the shortcut style
const myState = state({
  message: 'Hello',
  count: 0,
  isActive: true
});

// Or using the namespace style
const myState = ReactiveUtils.state({
  message: 'Hello',
  count: 0,
  isActive: true
});
```

That's it! Now `myState` is reactive - it can detect and respond to changes.

### Accessing Properties

Access properties exactly like a normal object:

```javascript
console.log(myState.message); // "Hello"
console.log(myState.count);   // 0
console.log(myState.isActive); // true

// Use in expressions
const greeting = myState.message + ', World!';
const doubled = myState.count * 2;
```

### Updating Properties

Update properties exactly like a normal object:

```javascript
myState.message = 'Hi there!';
myState.count = 5;
myState.isActive = false;

// Increment/decrement
myState.count++;
myState.count--;

// Arithmetic operations
myState.count = myState.count * 2;
```

**The difference:** When you change them, any reactive code (like effects) will automatically detect these changes and respond!

### Using with Effects

State becomes truly powerful when combined with effects:

```js
const counter = state({
  count: 0
});

// Effect runs whenever counter.count changes
effect(() => {
  console.log('Count is now: ' + counter.count);
  document.getElementById('display').textContent = counter.count;
});

// Changes automatically trigger the effect
counter.count = 5;  // Effect runs, updates DOM
counter.count = 10; // Effect runs again
```

---

## Deep Reactivity

State objects support **deep reactivity** - nested objects are automatically made reactive:

```js
const app = state({
  user: {
    name: 'John',
    address: {
      city: 'New York',
      country: 'USA'
    }
  }
});

effect(() => {
  console.log('City: ' + app.user.address.city);
});

// Deep changes are tracked!
app.user.address.city = 'Los Angeles'; // Effect re-runs!
```

**How it works:**
- When you access a nested object, it's automatically converted to a reactive proxy
- All levels of nesting are reactive
- You can track changes at any depth

### Adding New Properties

New properties added to reactive objects are also reactive:

```js
const user = state({
  name: 'John'
});

// Add a new property
user.email = 'john@example.com';

// Add a new nested object
user.profile = {
  bio: 'Developer',
  avatar: 'avatar.jpg'
};

// The new properties are automatically reactive
effect(() => {
  console.log('Bio: ' + user.profile.bio);
});

user.profile.bio = 'Senior Developer'; // Effect re-runs!
```

---

## Working with Arrays

Arrays in reactive state are fully reactive and support all standard array methods:

```js
const todos = state({
  items: ['Task 1', 'Task 2', 'Task 3']
});

effect(() => {
  console.log('Todo count: ' + todos.items.length);
  console.log('Todos: ' + todos.items.join(', '));
});

// Array mutations trigger updates
todos.items.push('Task 4');     // Effect re-runs
todos.items.pop();              // Effect re-runs
todos.items[0] = 'Updated';     // Effect re-runs
todos.items.splice(1, 1);       // Effect re-runs
```

### Reactive Array Methods

All array methods work and trigger updates:

```js
const list = state({
  numbers: [1, 2, 3, 4, 5]
});

// Mutating methods (trigger updates)
list.numbers.push(6);
list.numbers.pop();
list.numbers.shift();
list.numbers.unshift(0);
list.numbers.splice(2, 1);
list.numbers.sort();
list.numbers.reverse();

// Non-mutating methods (don't modify, return new array)
const filtered = list.numbers.filter(n => n > 2);
const mapped = list.numbers.map(n => n * 2);
const found = list.numbers.find(n => n === 3);
```

---

## Common Use Cases

### Use Case 1: Counter Application

Simple counter with reactive updates:

```js
const counter = state({
  count: 0
});

effect(() => {
  document.getElementById('counter').textContent = counter.count;
});

document.getElementById('increment').onclick = () => {
  counter.count++; // DOM updates automatically
};

document.getElementById('decrement').onclick = () => {
  counter.count--;
};

document.getElementById('reset').onclick = () => {
  counter.count = 0;
};
```

### Use Case 2: User Authentication

Track login state and user information:

```js
const auth = state({
  user: null,
  isLoggedIn: false,
  token: null
});

effect(() => {
  const loginPanel = document.getElementById('login-panel');
  const userPanel = document.getElementById('user-panel');

  if (auth.isLoggedIn) {
    loginPanel.style.display = 'none';
    userPanel.style.display = 'block';
    document.getElementById('username').textContent = auth.user.name;
  } else {
    loginPanel.style.display = 'block';
    userPanel.style.display = 'none';
  }
});

// Login function
function login(username, password) {
  // Simulate API call
  auth.$batch(() => {
    auth.user = { name: username, id: 123 };
    auth.isLoggedIn = true;
    auth.token = 'abc123';
  });
}

// Logout function
function logout() {
  auth.$batch(() => {
    auth.user = null;
    auth.isLoggedIn = false;
    auth.token = null;
  });
}
```

### Use Case 3: Shopping Cart

Manage cart items with computed totals:

```js
const cart = state({
  items: [
    { name: 'Apple', price: 1.5, quantity: 3 },
    { name: 'Banana', price: 0.8, quantity: 5 }
  ],
  taxRate: 0.1
});

// Add computed properties
cart.$computed('subtotal', function() {
  return this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
});

cart.$computed('tax', function() {
  return this.subtotal * this.taxRate;
});

cart.$computed('total', function() {
  return this.subtotal + this.tax;
});

// Display totals
effect(() => {
  document.getElementById('subtotal').textContent = `$${cart.subtotal.toFixed(2)}`;
  document.getElementById('tax').textContent = `$${cart.tax.toFixed(2)}`;
  document.getElementById('total').textContent = `$${cart.total.toFixed(2)}`;
});

// Add item
function addToCart(item) {
  cart.items.push(item);
}

// Update quantity
function updateQuantity(index, quantity) {
  cart.items[index].quantity = quantity;
}
```

### Use Case 4: Form Management

Handle form state with validation:

```js
const form = state({
  username: '',
  email: '',
  password: '',
  errors: {}
});

// Computed property for form validity
form.$computed('isValid', function() {
  return Object.keys(this.errors).length === 0 &&
         this.username && this.email && this.password;
});

// Watch for validation
form.$watch('email', (newValue) => {
  if (!newValue.includes('@')) {
    form.errors.email = 'Invalid email address';
  } else {
    delete form.errors.email;
  }
});

form.$watch('password', (newValue) => {
  if (newValue.length < 8) {
    form.errors.password = 'Password must be at least 8 characters';
  } else {
    delete form.errors.password;
  }
});

// Bind to inputs
document.getElementById('username').oninput = (e) => {
  form.username = e.target.value;
};

document.getElementById('email').oninput = (e) => {
  form.email = e.target.value;
};

document.getElementById('password').oninput = (e) => {
  form.password = e.target.value;
};

// Submit button state
effect(() => {
  document.getElementById('submit').disabled = !form.isValid;
});
```

### Use Case 5: Theme Switcher

Manage application theme:

```js
const settings = state({
  theme: 'light',
  fontSize: 14,
  language: 'en'
});

// Apply theme
effect(() => {
  document.body.setAttribute('data-theme', settings.theme);
  localStorage.setItem('theme', settings.theme);
});

// Apply font size
effect(() => {
  document.body.style.fontSize = settings.fontSize + 'px';
  localStorage.setItem('fontSize', settings.fontSize);
});

// Load from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  settings.theme = savedTheme;
}

const savedFontSize = localStorage.getItem('fontSize');
if (savedFontSize) {
  settings.fontSize = parseInt(savedFontSize);
}

// Toggle theme
document.getElementById('theme-toggle').onclick = () => {
  settings.theme = settings.theme === 'light' ? 'dark' : 'light';
};
```

---

## Advanced Patterns

### Pattern 1: Nested State Objects

Create complex state structures:

```js
const app = state({
  user: {
    id: 1,
    name: 'John',
    preferences: {
      theme: 'dark',
      notifications: true
    }
  },
  settings: {
    language: 'en',
    timezone: 'UTC'
  }
});

// Access nested properties
console.log(app.user.preferences.theme); // "dark"

// Update nested properties
app.user.preferences.theme = 'light';

// Create effects on nested data
effect(() => {
  document.body.className = app.user.preferences.theme;
});
```

### Pattern 2: State Factory Functions

Create reusable state factories:

```js
function createCounter(initialValue = 0) {
  const counter = state({
    value: initialValue
  });

  // Add methods
  counter.increment = function() {
    this.value++;
  };

  counter.decrement = function() {
    this.value--;
  };

  counter.reset = function() {
    this.value = initialValue;
  };

  // Add computed
  counter.$computed('isPositive', function() {
    return this.value > 0;
  });

  return counter;
}

// Use the factory
const counter1 = createCounter(0);
const counter2 = createCounter(10);

counter1.increment();
console.log(counter1.value); // 1

counter2.decrement();
console.log(counter2.value); // 9
```

### Pattern 3: Multiple State Objects

Organize state by concern:

```js
// User state
const userState = state({
  id: null,
  name: '',
  isLoggedIn: false
});

// App state
const appState = state({
  loading: false,
  error: null,
  notifications: []
});

// UI state
const uiState = state({
  sidebarOpen: false,
  modalVisible: false,
  theme: 'light'
});

// Effects can depend on multiple states
effect(() => {
  if (userState.isLoggedIn && !appState.loading) {
    console.log('User is ready');
  }
});
```

### Pattern 4: State with Persistence

Automatically save state to localStorage:

```js
const app = state({
  theme: 'light',
  sidebar: true,
  language: 'en'
});

// Save to localStorage on changes
effect(() => {
  const stateToSave = {
    theme: app.theme,
    sidebar: app.sidebar,
    language: app.language
  };
  localStorage.setItem('appState', JSON.stringify(stateToSave));
});

// Load from localStorage on init
function loadState() {
  const saved = localStorage.getItem('appState');
  if (saved) {
    const parsed = JSON.parse(saved);
    app.$batch(() => {
      app.theme = parsed.theme;
      app.sidebar = parsed.sidebar;
      app.language = parsed.language;
    });
  }
}

loadState();
```

## Summary

**`state()` is the foundation of reactive programming.**

Key takeaways:
- ✅ Converts regular objects into **reactive** objects
- ✅ Both **shortcut** (`state()`) and **namespace** (`ReactiveUtils.state()`) styles are valid
- ✅ Automatically **tracks** when properties are read
- ✅ Automatically **notifies** when properties change
- ✅ Works with **nested objects** and **arrays**
- ✅ Provides powerful methods: `$computed`, `$watch`, `$batch`, `$bind`, etc.
- ✅ Integrates seamlessly with **effects** for automatic updates
- ✅ Use exactly like normal objects - no special syntax

**Remember:** `state()` is the foundation of reactivity. It makes your data "smart" so it can automatically trigger updates when values change. Combined with `effect()`, it creates truly reactive applications! 🎉

➡️ Next, learn about [`effect()`](effect.md) to make your state truly reactive, or explore [`ref()`](ref.md) for single values!
