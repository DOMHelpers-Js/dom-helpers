# Understanding `refs()` - A Beginner's Guide

## What is `refs()`?

`refs()` is a **convenient helper function** in the Reactive library that creates **multiple reactive references at once**. Instead of calling `ref()` multiple times, you can create several refs in a single call.

Think of it as a **batch creator for refs** - it takes an object with initial values and returns an object where each property is a reactive ref.

---

## Syntax

```js
// Using the shortcut
refs({ name: value, ... })

// Using the full namespace
ReactiveUtils.refs({ name: value, ... })
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`refs()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.refs()`) - Explicit and clear

**Parameters:**
- An object where keys are ref names and values are initial values

**Returns:**
- An object where each property is a reactive ref with a `.value` property

---

## Why Does This Exist?

### The Problem with Creating Multiple Refs

When you need multiple refs, calling `ref()` repeatedly becomes verbose:

```javascript
// Creating multiple refs one by one - repetitive
const count = ref(0);
const message = ref('');
const isLoading = ref(false);
const userId = ref(null);
const theme = ref('light');
```

**What's the Real Issue?**

**Problems:**
- Repetitive code - calling `ref()` over and over
- Multiple const declarations
- Easy to miss declaring a ref
- Harder to see all refs at a glance
- More lines of code for a simple task

**Why This Becomes a Problem:**

When managing multiple simple values:
❌ Too much boilerplate for related refs
❌ Hard to see which refs belong together
❌ More code to maintain
❌ Easy to make typos when creating many refs

In other words, **creating many refs individually is tedious**.
You end up with lots of repetitive declarations.

---

### The Solution with `refs()`

When you use `refs()`, you can create multiple reactive references in one clean declaration:

```javascript
// Creating multiple refs at once - clean and organized
const { count, message, isLoading, userId, theme } = refs({
  count: 0,
  message: '',
  isLoading: false,
  userId: null,
  theme: 'light'
});

// All refs are ready to use!
console.log(count.value);      // 0
console.log(message.value);    // ''
console.log(isLoading.value);  // false
```

**What Just Happened?**

With `refs()`:
- All refs created in a single call
- Clean, organized structure
- Easy to see all related refs
- Less code, same functionality

**Benefits:**
- Less boilerplate
- Better organization
- Clear grouping of related refs
- Easier to maintain
- All the reactivity benefits of individual refs

---

## How Does It Work?

### Under the Hood

`refs()` is a simple wrapper that calls `ref()` for each property in the object:

```
refs({ count: 0, name: '' })
        ↓
{
  count: ref(0),
  name: ref('')
}
        ↓
Destructure to:
const { count, name } = refs({ count: 0, name: '' })
```

**What happens:**

1. You pass an object with initial values
2. `refs()` loops through each property
3. For each property, it calls `ref(value)`
4. Returns an object with all the refs
5. You destructure to get individual refs

**Important:** Each ref works exactly like a ref created with `ref()` - they're completely independent!

---

## Basic Usage

### Creating Multiple Refs

The most common way to use `refs()` is with destructuring:

```js
// Shortcut style
const { count, message, isActive } = refs({
  count: 0,
  message: 'Hello',
  isActive: true
});

// Or using namespace style
const { count, message, isActive } = ReactiveUtils.refs({
  count: 0,
  message: 'Hello',
  isActive: true
});

// Now use them like normal refs
console.log(count.value);     // 0
console.log(message.value);   // "Hello"
console.log(isActive.value);  // true
```

**What happens:**
1. `refs()` creates a ref for each property
2. Destructuring extracts each ref into its own variable
3. Each variable is an independent reactive ref

### Accessing and Updating Values

Use `.value` on each ref just like individual refs:

```js
const { count, name, isLoading } = refs({
  count: 0,
  name: 'John',
  isLoading: false
});

// Read values
console.log(count.value);    // 0
console.log(name.value);     // "John"
console.log(isLoading.value); // false

// Update values
count.value = 10;
name.value = 'Jane';
isLoading.value = true;

// Use in expressions
count.value++;
const greeting = 'Hello, ' + name.value;
```

### Using with Effects

Each ref works independently with effects:

```js
const { count, message } = refs({
  count: 0,
  message: 'Ready'
});

// Effect tracks count.value
effect(() => {
  console.log('Count: ' + count.value);
});

// Separate effect tracks message.value
effect(() => {
  console.log('Message: ' + message.value);
});

// Updates trigger only the relevant effects
count.value = 5;     // Only first effect runs
message.value = 'Go!'; // Only second effect runs
```

---

## Common Use Cases

### Use Case 1: Form Fields

Perfect for managing multiple form inputs:

```js
const { username, email, password } = refs({
  username: '',
  email: '',
  password: ''
});

// Bind to inputs
document.getElementById('username').oninput = (e) => {
  username.value = e.target.value;
};

document.getElementById('email').oninput = (e) => {
  email.value = e.target.value;
};

document.getElementById('password').oninput = (e) => {
  password.value = e.target.value;
};

// Display in real-time
effect(() => {
  console.log('Form data:', {
    username: username.value,
    email: email.value,
    password: password.value
  });
});
```

### Use Case 2: UI State Flags

Manage multiple boolean flags for UI state:

```js
const { isLoading, isError, isSuccess, isVisible } = refs({
  isLoading: false,
  isError: false,
  isSuccess: false,
  isVisible: true
});

// Show/hide based on flags
effect(() => {
  document.getElementById('loader').style.display =
    isLoading.value ? 'block' : 'none';
});

effect(() => {
  document.getElementById('error').style.display =
    isError.value ? 'block' : 'none';
});

effect(() => {
  document.getElementById('success').style.display =
    isSuccess.value ? 'block' : 'none';
});

// Simulate async operation
async function fetchData() {
  isLoading.value = true;
  isError.value = false;

  try {
    await fetch('/api/data');
    isSuccess.value = true;
  } catch (error) {
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
}
```

### Use Case 3: Counters and Statistics

Track multiple numeric values:

```js
const { clicks, views, likes, shares } = refs({
  clicks: 0,
  views: 0,
  likes: 0,
  shares: 0
});

// Display all stats
effect(() => {
  document.getElementById('stats').innerHTML = `
    Clicks: ${clicks.value}<br>
    Views: ${views.value}<br>
    Likes: ${likes.value}<br>
    Shares: ${shares.value}
  `;
});

// Update individual counters
document.getElementById('like-btn').onclick = () => {
  likes.value++;
};

document.getElementById('share-btn').onclick = () => {
  shares.value++;
};
```

### Use Case 4: Game State

Manage game variables:

```js
const { score, lives, level, time } = refs({
  score: 0,
  lives: 3,
  level: 1,
  time: 60
});

// Display game state
effect(() => {
  document.getElementById('score').textContent = score.value;
  document.getElementById('lives').textContent = lives.value;
  document.getElementById('level').textContent = level.value;
  document.getElementById('time').textContent = time.value;
});

// Game logic
function collectCoin() {
  score.value += 10;
}

function loseLife() {
  lives.value--;
  if (lives.value === 0) {
    alert('Game Over!');
  }
}

function levelUp() {
  level.value++;
  score.value += 100;
}
```

### Use Case 5: Settings and Preferences

Track user preferences:

```js
const { theme, fontSize, language, notifications } = refs({
  theme: 'light',
  fontSize: 14,
  language: 'en',
  notifications: true
});

// Apply theme
effect(() => {
  document.body.setAttribute('data-theme', theme.value);
});

// Apply font size
effect(() => {
  document.body.style.fontSize = fontSize.value + 'px';
});

// Save to localStorage
effect(() => {
  localStorage.setItem('settings', JSON.stringify({
    theme: theme.value,
    fontSize: fontSize.value,
    language: language.value,
    notifications: notifications.value
  }));
});

// Update settings
theme.value = 'dark';
fontSize.value = 16;
```

---

## Advanced Usage

### Grouping Related Refs

You can create multiple groups of refs for better organization:

```js
// User-related refs
const user = refs({
  id: null,
  name: '',
  email: '',
  isLoggedIn: false
});

// UI-related refs
const ui = refs({
  sidebarOpen: false,
  modalVisible: false,
  theme: 'light'
});

// Use them
console.log(user.name.value);
console.log(ui.theme.value);

user.isLoggedIn.value = true;
ui.sidebarOpen.value = true;
```

### Without Destructuring

You can use refs without destructuring if you prefer:

```js
const formRefs = refs({
  username: '',
  email: '',
  password: ''
});

// Access through the object
console.log(formRefs.username.value);
formRefs.email.value = 'user@example.com';

// Useful when passing around as a group
function validateForm(refs) {
  return refs.username.value && refs.email.value && refs.password.value;
}

if (validateForm(formRefs)) {
  console.log('Form is valid');
}
```

### Combining with Individual Refs

You can mix `refs()` with individual `ref()` calls:

```js
// Create some refs together
const { count, message } = refs({
  count: 0,
  message: 'Hello'
});

// Create others individually
const userId = ref(null);
const isActive = ref(true);

// All work the same way
effect(() => {
  console.log(count.value, message.value, userId.value, isActive.value);
});
```

### Dynamic Ref Creation

Create refs from dynamic data:

```js
// From configuration
const config = {
  maxRetries: 3,
  timeout: 5000,
  enableCache: true
};

const settings = refs(config);

// Now all config values are reactive
settings.maxRetries.value = 5;
settings.enableCache.value = false;
```

---

## Performance Tips

### Tip 1: Group Related Refs

Keep related refs together for better organization:

**Good:**
```js
// All form fields together
const { username, email, password, confirmPassword } = refs({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});
```

**Also Good:**
```js
// Separate logical groups
const formFields = refs({ username: '', email: '' });
const formState = refs({ isSubmitting: false, errors: null });
```

### Tip 2: Use Meaningful Names

Choose clear names that describe what the ref holds:

**Bad:**
```js
const { x, y, z, flag } = refs({
  x: 0,
  y: '',
  z: false,
  flag: null
});
```

**Good:**
```js
const { count, message, isActive, userId } = refs({
  count: 0,
  message: '',
  isActive: false,
  userId: null
});
```

### Tip 3: Don't Overuse refs()

If you only need one or two refs, use `ref()` directly:

**Overkill:**
```js
const { count } = refs({ count: 0 }); // Just use ref(0)
```

**Better:**
```js
const count = ref(0); // Simpler for single ref
```

**Good use of refs():**
```js
const { count, message, isLoading } = refs({
  count: 0,
  message: '',
  isLoading: false
});
```

### Tip 4: Initialize with Correct Types

Initialize refs with the correct data type:

```js
const { count, name, isActive, items } = refs({
  count: 0,          // Number
  name: '',          // String
  isActive: false,   // Boolean
  items: []          // Array
});
```

---

## Common Pitfalls

### Pitfall 1: Forgetting to Destructure

**Problem:** Not destructuring means you have to access refs through the object:

```js
// Without destructuring
const myRefs = refs({
  count: 0,
  message: ''
});

// Have to use nested access (verbose)
console.log(myRefs.count.value);
myRefs.message.value = 'Hello';
```

**Better:** Destructure for cleaner code:

```js
// With destructuring
const { count, message } = refs({
  count: 0,
  message: ''
});

// Cleaner access
console.log(count.value);
message.value = 'Hello';
```

### Pitfall 2: Forgetting .value

**Problem:** Same as with `ref()` - forgetting to use `.value`:

```js
const { count } = refs({ count: 0 });

// WRONG
console.log(count);    // Ref object, not the value
count = 5;             // Error! Can't reassign const

// RIGHT
console.log(count.value); // 0
count.value = 5;          // Correct!
```

### Pitfall 3: Name Conflicts

**Problem:** Destructuring can cause name conflicts:

```js
const count = 10; // Existing variable

// ERROR: Can't redeclare count
const { count, message } = refs({
  count: 0,
  message: ''
});
```

**Solution:** Rename during destructuring:

```js
const count = 10; // Existing variable

// Rename the ref
const { count: refCount, message } = refs({
  count: 0,
  message: ''
});

console.log(count);         // 10 (original variable)
console.log(refCount.value); // 0 (ref)
```

### Pitfall 4: Mutating Object/Array Refs

**Problem:** Same issue as `ref()` - mutating doesn't trigger updates:

```js
const { items } = refs({
  items: [1, 2, 3]
});

// WRONG - mutating doesn't trigger effects
items.value.push(4); // No update!

// RIGHT - replace the array
items.value = [...items.value, 4]; // Triggers effects!
```

### Pitfall 5: Over-Destructuring

**Problem:** Destructuring too many refs at once can be hard to read:

```js
// Hard to read and maintain
const { a, b, c, d, e, f, g, h, i, j, k, l, m } = refs({
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7,
  h: 8, i: 9, j: 10, k: 11, l: 12, m: 13
});
```

**Better:** Group into logical chunks:

```js
// More organized
const coordinates = refs({ x: 0, y: 0, z: 0 });
const colors = refs({ r: 0, g: 0, b: 0 });
const sizes = refs({ width: 100, height: 50 });
```

---

## Real-World Example

Here's a complete example showing `refs()` in a real application:

```js
// Create all app state refs at once
const {
  // User state
  username,
  isLoggedIn,

  // UI state
  currentPage,
  sidebarOpen,
  theme,

  // Form state
  searchQuery,
  filterType,

  // Loading states
  isLoading,
  isError,

  // Counters
  unreadCount,
  totalItems
} = refs({
  username: '',
  isLoggedIn: false,
  currentPage: 'home',
  sidebarOpen: false,
  theme: 'light',
  searchQuery: '',
  filterType: 'all',
  isLoading: false,
  isError: false,
  unreadCount: 0,
  totalItems: 0
});

// Display username
effect(() => {
  const display = document.getElementById('username-display');
  if (isLoggedIn.value) {
    display.textContent = username.value;
  } else {
    display.textContent = 'Guest';
  }
});

// Apply theme
effect(() => {
  document.body.setAttribute('data-theme', theme.value);
  localStorage.setItem('theme', theme.value);
});

// Toggle sidebar
effect(() => {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open', sidebarOpen.value);
});

// Show loading indicator
effect(() => {
  document.getElementById('loader').style.display =
    isLoading.value ? 'block' : 'none';
});

// Display unread count
effect(() => {
  const badge = document.getElementById('unread-badge');
  if (unreadCount.value > 0) {
    badge.textContent = unreadCount.value;
    badge.style.display = 'block';
  } else {
    badge.style.display = 'none';
  }
});

// Page navigation
effect(() => {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.style.display = 'none';
  });

  // Show current page
  const activePage = document.getElementById(currentPage.value);
  if (activePage) {
    activePage.style.display = 'block';
  }
});

// Event handlers
document.getElementById('theme-toggle').onclick = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};

document.getElementById('sidebar-toggle').onclick = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

document.getElementById('search').oninput = (e) => {
  searchQuery.value = e.target.value;
};

document.getElementById('filter-select').onchange = (e) => {
  filterType.value = e.target.value;
};

// Login function
async function login(user) {
  isLoading.value = true;
  isError.value = false;

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    username.value = user;
    isLoggedIn.value = true;
    currentPage.value = 'dashboard';
  } catch (error) {
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
}

// Logout function
function logout() {
  username.value = '';
  isLoggedIn.value = false;
  currentPage.value = 'home';
  unreadCount.value = 0;
}

// Update notification count
function addNotification() {
  unreadCount.value++;
}
```

---

## Summary

**`refs()` is the convenient way to create multiple reactive references at once.**

Key takeaways:
- ✅ Creates **multiple refs** in a single call
- ✅ Use with **destructuring** for clean code
- ✅ Both **shortcut** (`refs()`) and **namespace** (`ReactiveUtils.refs()`) styles are valid
- ✅ Each ref works **independently** - just like `ref()`
- ✅ Always use **`.value`** to access or update values
- ✅ Perfect for **grouping related refs** (form fields, UI flags, settings)
- ✅ Reduces **boilerplate** compared to multiple `ref()` calls
- ⚠️ Don't forget `.value` when reading or writing
- ⚠️ Watch out for name conflicts when destructuring
- ⚠️ For single refs, just use `ref()` directly

**Remember:** `refs()` is just a convenience wrapper around `ref()`. It doesn't change how refs work - it just makes creating multiple refs cleaner and more organized. Use it when you have several related simple values to track! 🎉

➡️ Next, you might want to learn about [`ref()`](ref.md) for single values or [`collection()`](collection.md) for reactive arrays.
