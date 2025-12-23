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

### Using with Effects

State becomes truly powerful when combined with effects:

```js
const counter = state({
  count: 0
});
```
Here, ***counter*** is no longer a plain object.
It is a reactive proxy that can:
- Detect when properties are **read**
- Detect when properties are **written**
- **Notify** any dependent logic when a value changes
At this point, nothing reacts yet — the state is just ready.



An effect is a function that automatically re-runs whenever the reactive data it uses changes.
You don’t tell it when to run — it figures that out by itself.

```js
// Effect runs whenever counter.count changes
effect(() => {
  console.log('Count is now: ' + counter.count);
  document.getElementById('display').textContent = counter.count;
});
```
This effect does two important things:
- Reads counter.count
- Uses that value to:
  Log to the console
  Update the DOM
Because counter.count is read inside the effect, the reactive system automatically:
Registers the effect as a dependency of counter.count
Remembers:
“This effect depends on counter.count”
The effect also runs immediately once to establish the initial state.


```js
// Changes automatically trigger the effect
counter.count = 5;  // Effect runs, updates DOM
counter.count = 10; // Effect runs again
```

When these lines executes:
The proxy detects a write to counter.count
The reactive system looks up:
“Who depends on counter.count?”
All matching effects are automatically re-run

Result:
Console updates
DOM updates
No manual calls
No event wiring


---

# Deep Reactivity

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

### Use Case 6: Real-time Dashboard

Monitor live data and statistics:

```js
const dashboard = state({
  users: {
    online: 0,
    total: 0
  },
  metrics: {
    pageViews: 0,
    revenue: 0
  },
  alerts: []
});

// Computed for conversion rate
dashboard.$computed('conversionRate', function() {
  return this.users.total > 0
    ? (this.users.online / this.users.total) * 100
    : 0;
});

// Update dashboard display
effect(() => {
  document.getElementById('online-users').textContent = dashboard.users.online;
  document.getElementById('total-users').textContent = dashboard.users.total;
  document.getElementById('page-views').textContent = dashboard.metrics.pageViews;
  document.getElementById('revenue').textContent = `$${dashboard.metrics.revenue.toFixed(2)}`;
  document.getElementById('conversion').textContent = `${dashboard.conversionRate.toFixed(1)}%`;
});

// Simulate live updates
setInterval(() => {
  dashboard.users.online = Math.floor(Math.random() * 100);
  dashboard.metrics.pageViews += Math.floor(Math.random() * 10);
}, 2000);
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

### Pattern 5: Cross-Component State

Share state across multiple components:

```js
// Shared global state
const appState = state({
  currentUser: null,
  notifications: [],
  theme: 'light'
});

// Component 1: Header
function HeaderComponent() {
  effect(() => {
    const userDisplay = document.getElementById('header-user');
    if (appState.currentUser) {
      userDisplay.textContent = appState.currentUser.name;
    } else {
      userDisplay.textContent = 'Guest';
    }
  });

  effect(() => {
    const notifBadge = document.getElementById('notif-badge');
    notifBadge.textContent = appState.notifications.length;
    notifBadge.style.display = appState.notifications.length > 0 ? 'block' : 'none';
  });
}

// Component 2: Sidebar
function SidebarComponent() {
  effect(() => {
    document.getElementById('sidebar').className = appState.theme;
  });
}

// Both components react to the same state!
appState.currentUser = { name: 'Alice' };  // Header updates
appState.notifications.push({ msg: 'New message' });  // Badge updates
appState.theme = 'dark';  // Sidebar updates
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

## Real-World Example: Task Manager

Here's a complete task management application using reactive state:

```js
// Application state
const taskManager = state({
  tasks: [],
  filter: 'all', // 'all', 'active', 'completed'
  editingId: null
});

// Computed properties
taskManager.$computed('activeTasks', function() {
  return this.tasks.filter(task => !task.completed);
});

taskManager.$computed('completedTasks', function() {
  return this.tasks.filter(task => task.completed);
});

taskManager.$computed('filteredTasks', function() {
  switch (this.filter) {
    case 'active': return this.activeTasks;
    case 'completed': return this.completedTasks;
    default: return this.tasks;
  }
});

taskManager.$computed('stats', function() {
  return {
    total: this.tasks.length,
    active: this.activeTasks.length,
    completed: this.completedTasks.length
  };
});

// Render task list
effect(() => {
  const container = document.getElementById('task-list');
  container.innerHTML = '';

  taskManager.filteredTasks.forEach(task => {
    const taskEl = document.createElement('div');
    taskEl.className = `task ${task.completed ? 'completed' : ''}`;
    taskEl.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''}
             onchange="toggleTask(${task.id})">
      <span ondblclick="startEdit(${task.id})">${task.text}</span>
      <button onclick="deleteTask(${task.id})">Delete</button>
    `;
    container.appendChild(taskEl);
  });
});

// Update stats display
effect(() => {
  document.getElementById('total-count').textContent = taskManager.stats.total;
  document.getElementById('active-count').textContent = taskManager.stats.active;
  document.getElementById('completed-count').textContent = taskManager.stats.completed;
});

// Update filter buttons
effect(() => {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === taskManager.filter);
  });
});

// Actions
function addTask(text) {
  taskManager.tasks.push({
    id: Date.now(),
    text: text,
    completed: false,
    createdAt: new Date()
  });
}

function toggleTask(id) {
  const task = taskManager.tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
  }
}

function deleteTask(id) {
  const index = taskManager.tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    taskManager.tasks.splice(index, 1);
  }
}

function setFilter(filter) {
  taskManager.filter = filter;
}

function clearCompleted() {
  taskManager.tasks = taskManager.activeTasks;
}

// Initialize with sample data
addTask('Learn reactive programming');
addTask('Build a task manager');
addTask('Master state management');
```

---

## FAQ

**Q: When should I use `state()` vs `ref()`?**

A: Use `state()` when you have **multiple related properties** in an object. Use `ref()` when you have a **single primitive value**:

```js
// ✅ Good use of state() - multiple properties
const user = state({ name: 'John', age: 25, email: 'john@example.com' });

// ✅ Good use of ref() - single value
const count = ref(0);
const message = ref('Hello');
```

**Q: Can I use `state()` with class instances?**

A: Yes, but be careful with methods that rely on `this`:

```js
class User {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return `Hello, ${this.name}`;
  }
}

const user = state(new User('John'));
console.log(user.greet()); // Works fine
```

**Q: Does `state()` work with arrays directly?**

A: Yes! You can create a reactive array directly:

```js
// Both work:
const todos = state({ items: [] }); // Object with array property
const items = state([]); // Direct array (becomes reactive)

// But the object approach is more common for adding methods
```

**Q: How do I check if something is a reactive state?**

A: Check for the presence of `$` methods:

```js
const obj = state({ name: 'John' });

console.log(typeof obj.$watch === 'function'); // true
console.log(typeof obj.$computed === 'function'); // true
```

**Q: Can I make state read-only?**

A: Yes, use computed properties or expose only getters:

```js
const internal = state({ value: 0 });

const readonly = {
  get value() { return internal.value; }
};

// Users can read but not write
console.log(readonly.value); // 0
readonly.value = 10; // Won't update internal state
```

**Q: How do I reset state to initial values?**

A: Store the initial values and create a reset method:

```js
const initialState = { count: 0, name: '' };
const app = state({ ...initialState });

app.reset = function() {
  Object.assign(this, initialState);
};

// Later...
app.reset(); // Back to initial values
```

**Q: Does `state()` work with getters and setters?**

A: Yes, but they may not be reactive. Consider using computed properties instead:

```js
const user = state({
  firstName: 'John',
  lastName: 'Doe'
});

// ✅ Use computed for derived values
user.$computed('fullName', function() {
  return `${this.firstName} ${this.lastName}`;
});
```

**Q: Can I serialize reactive state to JSON?**

A: Yes, `JSON.stringify()` works but only includes data properties:

```js
const user = state({ name: 'John', age: 25 });

const json = JSON.stringify(user);
console.log(json); // {"name":"John","age":25}

// Methods and computed properties are not included
```

**Q: How do I debug reactive state?**

A: Use `console.log()`, browser DevTools, or add watchers:

```js
const app = state({ count: 0 });

// Watch all changes
app.$watch('count', (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

// Or use debugger
effect(() => {
  debugger; // Pauses when effect runs
  console.log(app.count);
});
```

---

## Summary

**`state()` is the foundation of reactive programming.**

Key takeaways:

✅ Converts regular objects into **reactive** objects
✅ Both **shortcut** (`state()`) and **namespace** (`ReactiveUtils.state()`) styles are valid
✅ Automatically **tracks** when properties are read
✅ Automatically **notifies** when properties change
✅ Works with **nested objects** and **arrays**
✅ Provides powerful methods: `$computed`, `$watch`, `$batch`, `$bind`, etc.
✅ Integrates seamlessly with **effects** for automatic updates
✅ Use exactly like normal objects - no special syntax

**Mental Model:** Think of `state()` as a **smart home system** - it watches for changes and automatically triggers reactions throughout your application.

**Remember:** `state()` is the foundation of reactivity. It makes your data "smart" so it can automatically trigger updates when values change. Combined with `effect()`, it creates truly reactive applications!

**Next Steps:**
- Learn about [`effect()`](../02_Effects/01_effect.md) to make your state truly reactive
- Explore [`ref()`](03_ref.md) for single values
- Check out [`$computed`](../03_Computed/01_computed.md) for derived values
- Master [`$watch`](../04_Watchers/01_watch.md) for observing changes
