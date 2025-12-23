# Understanding `state()` - A Beginner's Guide

## Quick Start (30 seconds)

Want to make your JavaScript objects reactive? Here's how:

```js
// Create reactive state
const user = state({
  name: 'John',
  age: 25
});

// Automatically update UI when data changes
effect(() => {
  document.getElementById('display').textContent = user.name;
});

// Just change the value - UI updates automatically!
user.name = 'Jane'; // Display updates to "Jane"
```

**That's it!** The `state()` function transforms regular objects into reactive objects that automatically notify your UI when values change.

---

## What is `state()`?

`state()` is the **most fundamental function** in the Reactive library. It takes a regular JavaScript object and transforms it into a **reactive object** - one that can automatically detect when its properties change and trigger updates throughout your application.

**A reactive state:**
- Detects when properties are read
- Detects when properties are writes
- Automatically notifies effects, computed values, and watchers

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

At first glance, this looks perfectly fine. JavaScript lets you read and write values easily. But there's a hidden limitation.

**What's the Real Issue?**

```
Regular Object Change Flow:
┌─────────────┐
│ user.name   │
│   = 'Jane'  │
└──────┬──────┘
       │
       ▼
   [SILENCE]
       │
       ▼
 Nothing happens
 No notifications
 No UI updates
 No side effects
```

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

In other words, **regular objects have no awareness of change**. They store data — **but they don't communicate**.

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

```
Reactive State Change Flow:
┌─────────────┐
│ user.name   │
│   = 'Jane'  │
└──────┬──────┘
       │
       ▼
 [PROXY DETECTS]
       │
       ▼
 Notifies all
 watching effects
       │
       ▼
✅ UI updates
✅ Side effects run
✅ Computed values refresh
```

With `state()`:
- Changes are detected automatically
- Any code that depends on the changed value re-runs by itself
- You don't need to manually track or trigger updates
- The UI stays in sync with your data

**Benefits:**
- ✅ Changes are automatically detected
- ✅ Code can automatically respond to changes
- ✅ You can build reactive user interfaces
- ✅ Less manual work, fewer bugs
- ✅ Data and UI stay synchronized

---

## Mental Model

Think of `state()` like a **smart home system**:

```
Regular Object (Dumb House):
┌──────────────────────┐
│  Temperature: 20°C   │  ← You can read it
│  Lights: On          │  ← You can change it
│  Door: Closed        │
└──────────────────────┘
     No sensors
     No automation
     No reactions

Reactive State (Smart House):
┌──────────────────────┐
│  Temperature: 20°C   │ ←─┐
│  Lights: On          │ ←─┼─ Sensors watching
│  Door: Closed        │ ←─┘
└──────────────────────┘
         │
         ▼
   ┌─────────────┐
   │  Controller │
   └──────┬──────┘
          │
          ▼
When temperature changes:
  ✓ Thermostat adjusts
  ✓ Notification sent
  ✓ Logs recorded

When door opens:
  ✓ Lights turn on
  ✓ Alarm checks status
  ✓ Camera starts recording
```

**Key Insight:** Just like a smart home automatically reacts to changes (door opens → lights turn on), reactive state automatically triggers updates (data changes → UI updates).

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

**Under the Hood:**

```
state({ name: 'John' })
        │
        ▼
┌───────────────────┐
│   Proxy Layer     │
├───────────────────┤
│ GET handler  ───► Track dependency
│ SET handler  ───► Trigger effects
│ DELETE handler ─► Trigger effects
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  Original Object  │
│  { name: 'John' } │
└───────────────────┘
```

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

 
## Using with Effects

State becomes truly powerful when combined with effects:

```javascript
const counter = state({
  count: 0
});
```

Here, `counter` is no longer a plain object. It is a reactive proxy that can:
* Detect when properties are read
* Detect when properties are written
* Notify any dependent logic when a value changes

At this point, nothing reacts yet — the state is just ready.

An effect is a function that automatically re-runs whenever the reactive data it uses changes. You don't tell it when to run — it figures that out by itself.

```javascript
// Effect runs whenever counter.count changes
effect(() => {
  console.log('Count is now: ' + counter.count);
  document.getElementById('display').textContent = counter.count;
});
```

This effect does two important things:
* Reads `counter.count`
* Uses that value to:
  * Log to the console
  * Update the DOM

Because `counter.count` is read inside the effect, the reactive system automatically:
* Registers the effect as a dependency of `counter.count`
* Remembers: "This effect depends on `counter.count`"

The effect also runs immediately once to establish the initial state.

```javascript
// Changes automatically trigger the effect
counter.count = 5;  // Effect runs, updates DOM
counter.count = 10; // Effect runs again
```

When these lines execute:
* The proxy detects a write to `counter.count`
* The reactive system looks up: "Who depends on `counter.count`?"
* All matching effects are automatically re-run

## Dependency Tracking Illustration

Think of the reactive system as maintaining a dependency map:

```
counter.count → [Effect #1, Effect #2, Effect #3]
    │
    └─ When counter.count changes, notify all subscribers
```

Here's a more concrete example with multiple effects:

```javascript
const counter = state({ count: 0 });

// Effect #1: Updates console
effect(() => {
  console.log('Count: ' + counter.count);
});

// Effect #2: Updates DOM element
effect(() => {
  document.getElementById('display').textContent = counter.count;
});

// Effect #3: Checks if count is even
effect(() => {
  const isEven = counter.count % 2 === 0;
  console.log('Is even: ' + isEven);
});
```

**Dependency map after setup:**

```
counter.count
    ├─→ Effect #1 (console log)
    ├─→ Effect #2 (DOM update)
    └─→ Effect #3 (even check)
```

**What happens when you write `counter.count = 5`:**

1. **Proxy intercepts:** "Someone is writing to `counter.count`"
2. **System looks up:** "I have 3 effects watching `counter.count`"
3. **Notification cascade:** All three effects re-run automatically
4. **Result:** Console shows new count, DOM updates, even check runs

This is why you never need to manually call effects or wire up event listeners — the reactive system maintains these relationships and handles notifications for you.

Result:
* Console updates
* DOM updates
* No manual calls
* No event wiring

---

## Deep Reactivity

State objects support deep reactivity - nested objects are automatically made reactive: Reactive state in this system is deep by default. This means that nested objects automatically participate in reactivity, without any extra configuration or manual wrapping.

You don't need to call `state()` for every level — the system handles it for you.

Although only the top-level object is passed to `state()`, all nested objects (user, address) become reactive as well. There is no difference in how you use them — you access properties normally.

```javascript
const app = state({
  user: {
    name: 'John',
    address: {
      city: 'New York',
      country: 'USA'
    }
  }
});
```

What matters here is what gets read inside the effect:
1. `app.user`
2. `app.user.address`
3. `app.user.address.city`

Each read is automatically tracked by the reactive system. The effect is now subscribed specifically to `address.city`.

```javascript
effect(() => {
  console.log('City: ' + app.user.address.city);
});
```

Deep changes are tracked! Even though this change happens several levels deep:
1. The proxy detects the write
2. The system finds all effects that depend on `address.city`
3. Those effects re-run automatically

```javascript
app.user.address.city = 'Los Angeles'; // Effect re-runs!
```

## How it works:

* When you access a nested object, it's automatically converted to a reactive proxy
* All levels of nesting are reactive
* You can track changes at any depth

## Why This Matters

Without deep reactivity, you would need to manually wrap every nested level in `state()`:

```javascript
const app = state({
  user: state({
    address: state({
      city: 'New York'
    })
  })
});
```

This becomes tedious and error-prone, especially with deeply nested data structures. You'd need to remember to wrap every object at every level, or reactivity would break at that point.

Deep reactivity removes that complexity entirely. When you create a reactive state object, the system automatically makes all nested objects reactive too. You write code the way you naturally think about data structures.

## The Difference in Practice

**Without deep reactivity (manual wrapping):**
```javascript
// You have to wrap each level
const app = state({
  user: state({
    profile: state({
      settings: state({
        theme: 'dark'
      })
    })
  })
});
```

**With deep reactivity (automatic):**
```javascript
// Just wrap the top level, everything else is handled
const app = state({
  user: {
    profile: {
      settings: {
        theme: 'dark'
      }
    }
  }
});

// Changes at any depth still work
app.user.profile.settings.theme = 'light'; // ✅ Triggers effects
```

## Benefits

* ✅ **Clean, natural data structures** — Write objects the way you normally would
* ✅ **No repetitive `state()` calls** — One call at the top level is enough
* ✅ **Works with real-world nested data** — API responses, configurations, and data models often have deep nesting
* ✅ **Fine-grained updates** — Only effects that depend on the specific changed property re-run, not everything

## Real-World Example

When you fetch data from an API, it often comes deeply nested:

```javascript
const app = state({
  currentUser: {
    id: 123,
    profile: {
      name: 'Jane Doe',
      avatar: 'avatar.jpg'
    },
    preferences: {
      notifications: {
        email: true,
        push: false
      }
    }
  }
});

// This works immediately, no extra setup
effect(() => {
  if (app.currentUser.preferences.notifications.email) {
    console.log('Email notifications enabled');
  }
});

// Change deep property, effect runs automatically
app.currentUser.preferences.notifications.email = false;
```

## Key Takeaway

Deep reactivity allows you to treat complex, nested data as a single reactive unit. You don't need to think about "making things reactive" at each level — you just work with your data naturally, and the reactive system tracks everything automatically, no matter how deep.

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

### Use Case 4: Theme Switcher

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
---

## Performance Tips

### Tip 1: Use `$batch()` for Multiple Updates

When updating multiple properties, batch them to trigger effects only once:

```js
const user = state({
  firstName: 'John',
  lastName: 'Doe',
  age: 25
});

effect(() => {
  console.log(`${user.firstName} ${user.lastName}, Age: ${user.age}`);
});

// ❌ Bad: Triggers effect 3 times
user.firstName = 'Jane';
user.lastName = 'Smith';
user.age = 30;

// ✅ Good: Triggers effect only once
user.$batch(() => {
  user.firstName = 'Jane';
  user.lastName = 'Smith';
  user.age = 30;
});
```

### Tip 2: Use Computed Properties for Derived Values

Don't recalculate values in effects - use computed properties:

```js
const cart = state({
  items: [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 }
  ]
});

// ❌ Bad: Recalculates every time
effect(() => {
  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById('total').textContent = total;
});

// ✅ Good: Cached computed property
cart.$computed('total', function() {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

effect(() => {
  document.getElementById('total').textContent = cart.total;
});
```

### Tip 3: Avoid Unnecessary Deep Nesting

Flat structures are easier to work with and more performant:

```js
// ❌ Harder to work with
const app = state({
  data: {
    user: {
      profile: {
        settings: {
          theme: 'dark'
        }
      }
    }
  }
});

// ✅ Better: Flatter structure
const app = state({
  userTheme: 'dark',
  userProfile: {},
  userSettings: {}
});
```

### Tip 4: Clean Up Effects When Done

If you create effects dynamically, clean them up when no longer needed:

```js
const counter = state({ count: 0 });

function createWatcher() {
  const cleanup = effect(() => {
    console.log('Count:', counter.count);
  });

  // Return cleanup function
  return cleanup;
}

const stop = createWatcher();

// Later, when done...
stop(); // Stops watching
```

---

## Common Pitfalls

### Pitfall 1: Forgetting State is a Proxy

**Problem:** Trying to use methods that check object identity:

```js
const original = { name: 'John' };
const reactive = state(original);

// ❌ These won't work as expected
console.log(reactive === original); // false (proxy !== original)
console.log(Object.keys(reactive)); // May include proxy internals
```

**Solution:** Treat reactive state as the source of truth, not the original object:

```js
// ✅ Use the reactive version
const user = state({ name: 'John' });
console.log(user.name); // Works perfectly
user.name = 'Jane'; // Updates are tracked
```

### Pitfall 2: Destructuring Loses Reactivity

**Problem:** Destructuring breaks the reactive connection:

```js
const user = state({ name: 'John', age: 25 });

// ❌ Destructured values are NOT reactive
const { name, age } = user;

effect(() => {
  console.log(name); // Won't update when user.name changes
});
```

**Solution:** Always access properties through the state object:

```js
// ✅ Access through the object
effect(() => {
  console.log(user.name); // Reactive!
});
```

### Pitfall 3: Mutating Arrays Without Triggering Updates

**Problem:** Directly assigning array indices sometimes doesn't trigger:

```js
const list = state({ items: [1, 2, 3] });

// ⚠️ May not always trigger reliably in all browsers
list.items[10] = 100; // Sparse array
```

**Solution:** Use array methods or explicit updates:

```js
// ✅ Use array methods
list.items.push(100);

// ✅ Or splice
list.items.splice(10, 0, 100);
```

### Pitfall 4: Creating Effects Inside Effects

**Problem:** Creating effects inside other effects can lead to memory leaks:

```js
const user = state({ name: 'John' });

// ❌ Bad: Creates new effect on every run
effect(() => {
  effect(() => {
    console.log(user.name);
  });
});
```

**Solution:** Create effects at the top level or clean them up:

```js
// ✅ Good: Top-level effect
effect(() => {
  console.log(user.name);
});
```

### Pitfall 5: Infinite Loops

**Problem:** Modifying state inside an effect that watches that same state:

```js
const counter = state({ count: 0 });

// ❌ Infinite loop!
effect(() => {
  console.log(counter.count);
  counter.count++; // Triggers effect again!
});
```

**Solution:** Use watchers with guards or separate concerns:

```js
// ✅ Use $watch with conditional logic
counter.$watch('count', (newValue) => {
  if (newValue < 10) {
    // Safe: watch doesn't re-trigger on its own changes
    counter.count++;
  }
});
```
---

## Summary

**Mental Model:** Think of `state()` as a **smart home system** - it watches for changes and automatically triggers reactions throughout your application.

**Remember:** `state()` is the foundation of reactivity. It makes your data "smart" so it can automatically trigger updates when values change. Combined with `effect()`, it creates truly reactive applications!

