# Understanding `effect()` - A Beginner's Guide

## What is `effect()`?

`effect()` is a **fundamental function** in the Reactive library that allows you to **automatically run code whenever reactive data changes**. It creates a "side effect" - code that reacts to changes in your reactive state.

Think of it as **setting up a listener** that automatically re-runs whenever any reactive data it uses changes. It's the bridge between your reactive state and the things that should happen when that state updates.

---

## Why Does This Exist?

### The Problem with Manual Updates

Let's say you have a reactive state and you want to update the UI when data changes:

```javascript
// Reactive state
const counter = state({
  count: 0
});

// Update the DOM manually
document.getElementById('counter').textContent = counter.count;

// When you change the count...
counter.count = 5;

// The DOM doesn't update automatically!
// You have to manually update it again:
document.getElementById('counter').textContent = counter.count; // Tedious!
```

**What's the Real Issue?**

**Problems:**
- You have to manually update the DOM every time the state changes
- It's easy to forget to update all the places that depend on that data
- The code becomes repetitive and error-prone
- You have to track which parts of the UI depend on which data
- When state changes, nothing automatically reacts to it

**Why This Becomes a Problem:**
As your app grows, this leads to several issues:
❌ Forgetting to update the UI in some places
❌ Writing the same update logic over and over
❌ Hard to maintain - changes require updating multiple places
❌ Easy to introduce bugs when data and UI get out of sync
❌ No automatic synchronization between data and behavior

In other words, **you have reactive data, but nothing is actually reacting to it**.
The state can notify - **but you haven't told it what to do when changes happen**.

---

### The Solution with `effect()`

When you use `effect()`, your code **automatically re-runs** whenever the reactive data it reads changes:

```javascript
// Reactive state
const counter = state({
  count: 0
});

// Create an effect that automatically runs whenever counter.count changes
effect(() => {
  document.getElementById('counter').textContent = counter.count;
});

// Now when you change the count...
counter.count = 5; // The effect automatically re-runs and updates the DOM!
counter.count = 10; // Updates again automatically!
```

**What Just Happened?**
With `effect()`:
- The effect runs immediately when created (displays the initial value)
- It tracks which reactive properties it reads (in this case, `counter.count`)
- Whenever those properties change, the effect automatically re-runs
- The DOM stays in sync with your data automatically

**Benefits:**
- Changes trigger updates automatically
- No need to manually track dependencies
- Write the update logic once, it works forever
- The UI (or any side effect) stays perfectly synchronized with state
- Less code, fewer bugs

---

## How Does It Work?

### The Magic: Dependency Tracking

When you create an effect, the reactive system **automatically tracks** which reactive properties your effect reads.

Think of it as the system **watching and remembering** what data you use:

```
1. Effect runs → Reads counter.count
                ↓
2. System tracks: "This effect depends on counter.count"
                ↓
3. counter.count changes
                ↓
4. System knows: "This effect needs to re-run!"
                ↓
5. Effect automatically re-runs
```

**What happens internally:**

1. When the effect **runs** the first time, the system enters "tracking mode"
2. Every reactive property you **read** gets registered as a dependency
3. When any of those properties **change**, the effect is queued to re-run
4. The effect **re-runs**, and the process repeats

This is why you don't need to manually specify dependencies - the system automatically detects them!

---

## Syntax

```js
// Using the shortcut
effect(() => {
  // Your code here
})

// Using the full namespace
ReactiveUtils.effect(() => {
  // Your code here
})
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`effect()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.effect()`) - Explicit and clear

**Parameters:**
- `fn` (Function): The function to run. This function will execute immediately and re-run whenever any reactive data it reads changes.

**Returns:**
- A cleanup function that you can call to stop the effect from running

---

## Basic Usage

### Creating a Simple Effect

The simplest way to use `effect()` is to pass a function that reads reactive data:

```js
const user = state({
  name: 'John',
  age: 25
});

// Using the shortcut style
effect(() => {
  console.log('User: ' + user.name);
});

// Or using the namespace style
ReactiveUtils.effect(() => {
  console.log('User: ' + user.name);
});

// Change the name
user.name = 'Jane'; // Effect re-runs, prints: "User: Jane"
```

**What happens:**
1. The effect runs immediately when created
2. It reads `user.name`, so the system tracks this dependency
3. When `user.name` changes, the effect automatically re-runs
4. The console log shows the updated value

### Updating the DOM

The most common use of effects is to keep the DOM synchronized with state:

```js
const app = state({
  message: 'Hello, World!',
  count: 0
});

// Update the message element
effect(() => {
  document.getElementById('message').textContent = app.message;
});

// Update the counter element
effect(() => {
  document.getElementById('counter').textContent = app.count;
});

// Now any changes automatically update the DOM:
app.message = 'Hello, React!'; // DOM updates automatically
app.count = 5; // DOM updates automatically
```

### Multiple Dependencies

An effect can depend on multiple reactive properties:

```js
const user = state({
  firstName: 'John',
  lastName: 'Doe',
  age: 25
});

// This effect depends on THREE properties
effect(() => {
  const fullName = user.firstName + ' ' + user.lastName;
  const info = fullName + ' is ' + user.age + ' years old';
  document.getElementById('userInfo').textContent = info;
});

// Changing ANY of these properties will re-run the effect:
user.firstName = 'Jane';  // Effect re-runs
user.lastName = 'Smith';  // Effect re-runs
user.age = 30;           // Effect re-runs
```

The system automatically tracks all dependencies - you don't need to list them manually!

---

## Advanced Usage

### Conditional Dependencies

Effects track dependencies **dynamically** based on what code actually runs:

```js
const app = state({
  showDetails: false,
  name: 'John',
  email: 'john@example.com'
});

effect(() => {
  console.log('Name: ' + app.name);

  // This only runs when showDetails is true
  if (app.showDetails) {
    console.log('Email: ' + app.email);
  }
});

// When showDetails is false:
app.email = 'new@example.com'; // Effect does NOT re-run (email not tracked)
app.name = 'Jane';             // Effect DOES re-run

// When showDetails is true:
app.showDetails = true;        // Effect re-runs
app.email = 'jane@example.com'; // Now effect DOES re-run (email is tracked)
```

Dependencies are tracked **dynamically** based on the code path that executes.

### Cleanup Functions

Effects can return a cleanup function that runs before the effect re-runs or when it's stopped:

```js
const app = state({
  query: ''
});

effect(() => {
  console.log('Searching for: ' + app.query);

  // Set up a timer
  const timerId = setTimeout(() => {
    console.log('Search completed for: ' + app.query);
  }, 1000);

  // Return cleanup function
  return () => {
    console.log('Cleaning up previous search');
    clearTimeout(timerId);
  };
});

// When app.query changes:
// 1. Cleanup function runs (clears old timer)
// 2. Effect re-runs (starts new timer)
app.query = 'javascript'; // Cleanup runs, then effect re-runs
```

**Use cleanup for:**
- Clearing timers
- Canceling network requests
- Removing event listeners
- Cleaning up subscriptions

### Stopping an Effect

The `effect()` function returns a cleanup function that stops the effect from running:

```js
const counter = state({ count: 0 });

// Create effect and get the stop function
const stop = effect(() => {
  console.log('Count is: ' + counter.count);
});

counter.count = 1; // Effect runs: "Count is: 1"
counter.count = 2; // Effect runs: "Count is: 2"

// Stop the effect
stop();

counter.count = 3; // Effect does NOT run (it's stopped)
counter.count = 4; // Effect does NOT run (it's stopped)
```

This is useful when you want to:
- Clean up effects when a component is destroyed
- Temporarily disable automatic updates
- Prevent memory leaks

### Nested Effects

You can create effects inside other effects, but be careful:

```js
const outer = state({ value: 1 });
const inner = state({ value: 10 });

effect(() => {
  console.log('Outer effect: ' + outer.value);

  // Creating an effect inside another effect
  effect(() => {
    console.log('Inner effect: ' + inner.value);
  });
});

// This creates a NEW inner effect every time outer.value changes!
// Usually NOT what you want - can lead to memory leaks
```

**Best practice:** Avoid creating effects inside other effects. Instead, create all effects at the same level.

---

## Common Patterns

### Pattern 1: DOM Updates

Keep DOM elements synchronized with state:

```js
const state = state({ count: 0 });

effect(() => {
  document.getElementById('counter').textContent = state.count;
});

// Use a button to increment
document.getElementById('btn').onclick = () => {
  state.count++; // DOM updates automatically
};
```

### Pattern 2: Derived Values

Show computed values in the UI:

```js
const cart = state({
  items: [
    { price: 10, quantity: 2 },
    { price: 20, quantity: 1 }
  ]
});

effect(() => {
  const total = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  document.getElementById('total').textContent = `Total: $${total}`;
});
```

### Pattern 3: Side Effects

Perform actions when state changes:

```js
const settings = state({
  theme: 'light'
});

effect(() => {
  // Apply theme to document
  document.body.className = settings.theme;

  // Save to localStorage
  localStorage.setItem('theme', settings.theme);

  console.log('Theme changed to: ' + settings.theme);
});
```

### Pattern 4: Logging and Debugging

Track state changes during development:

```js
const app = state({
  user: null,
  isLoading: false,
  error: null
});

// Development logging
effect(() => {
  console.log('App State:', {
    user: app.user,
    isLoading: app.isLoading,
    error: app.error
  });
});
```

### Pattern 5: API Synchronization

Keep data synchronized with a server:

```js
const todos = state({
  items: []
});

effect(() => {
  // Save todos to server whenever they change
  if (todos.items.length > 0) {
    fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify(todos.items)
    });
  }
});
```

---

## Effect vs Watch vs Computed

The reactive library provides several ways to react to changes. Here's when to use each:

### `effect()`
- **Purpose:** Run side effects when data changes
- **Use when:** You need to update the DOM, make API calls, log data, or perform any action
- **Returns:** Cleanup function

```js
effect(() => {
  console.log('Count changed to: ' + state.count);
  document.getElementById('counter').textContent = state.count;
});
```


**Quick Guide:**
- Need to **do something** when data changes? → Use `effect()`

---

## Performance Tips

### Tip 1: Keep Effects Small and Focused

**Bad:**
```js
// One large effect doing many things
effect(() => {
  document.getElementById('name').textContent = user.name;
  document.getElementById('email').textContent = user.email;
  document.getElementById('age').textContent = user.age;
  document.getElementById('status').textContent = user.status;
});
// Re-runs for ANY property change
```

**Good:**
```js
// Separate effects for different concerns
effect(() => {
  document.getElementById('name').textContent = user.name;
});

effect(() => {
  document.getElementById('email').textContent = user.email;
});
// Each effect only re-runs when its specific dependency changes
```

### Tip 2: Avoid Unnecessary Reads

Only read reactive properties that you actually need:

**Bad:**
```js
effect(() => {
  const name = user.name; // Tracked
  const email = user.email; // Tracked
  const age = user.age; // Tracked

  // But only using name
  document.getElementById('display').textContent = name;
});
// Re-runs when email or age change (unnecessarily)
```

**Good:**
```js
effect(() => {
  // Only read what you need
  document.getElementById('display').textContent = user.name;
});
// Only re-runs when name changes
```

### Tip 3: Use Batch for Multiple Updates

When updating multiple properties, use `$batch()` to run effects only once:

**Bad:**
```js
// Without batching - effects run 3 times
user.name = 'Jane';
user.email = 'jane@example.com';
user.age = 30;
```

**Good:**
```js
// With batching - effects run only once after all updates
user.$batch(() => {
  user.name = 'Jane';
  user.email = 'jane@example.com';
  user.age = 30;
});
```

### Tip 4: Clean Up Effects When Done

Always clean up effects when they're no longer needed:

```js
// In a component or module
const stops = [];

// Create effects
stops.push(effect(() => { /* ... */ }));
stops.push(effect(() => { /* ... */ }));

// When component unmounts or is destroyed
function cleanup() {
  stops.forEach(stop => stop());
}
```

---

## Common Pitfalls

### Pitfall 1: Infinite Loops

**Problem:** Modifying reactive state inside an effect that reads that same state:

```js
const counter = state({ count: 0 });

// DON'T DO THIS!
effect(() => {
  console.log(counter.count);
  counter.count++; // Infinite loop! Effect triggers itself
});
```

**Solution:** Don't modify the same state you're reading in an effect, or use conditions:

```js
effect(() => {
  console.log(counter.count);

  // Only increment once
  if (counter.count === 0) {
    counter.count++;
  }
});
```

### Pitfall 2: Reading State Outside Effect

**Problem:** Reading state before creating the effect:

```js
// This value is NOT reactive
const name = user.name;

effect(() => {
  // This won't update when user.name changes!
  document.getElementById('name').textContent = name;
});
```

**Solution:** Read reactive state INSIDE the effect:

```js
effect(() => {
  // Read inside the effect - now it's tracked
  document.getElementById('name').textContent = user.name;
});
```

### Pitfall 3: Forgetting to Stop Effects

**Problem:** Creating effects without cleaning them up:

```js
function showUser(userId) {
  // Creates a new effect every time
  effect(() => {
    document.getElementById('user').textContent = users[userId].name;
  });
}

// Calling this 100 times creates 100 effects!
showUser(1);
showUser(2);
showUser(3);
// Memory leak!
```

**Solution:** Keep track of and clean up effects:

```js
let currentEffect = null;

function showUser(userId) {
  // Stop the previous effect
  if (currentEffect) {
    currentEffect();
  }

  // Create new effect and save the stop function
  currentEffect = effect(() => {
    document.getElementById('user').textContent = users[userId].name;
  });
}
```

### Pitfall 4: Creating Effects in Effects

**Problem:** Nested effect creation leads to exponential growth:

```js
effect(() => {
  // Creates a new inner effect EVERY time outer.value changes
  effect(() => {
    console.log(inner.value);
  });

  console.log(outer.value);
});
```

**Solution:** Create effects at the same level:

```js
effect(() => {
  console.log(outer.value);
});

effect(() => {
  console.log(inner.value);
});
```

---

## Real-World Example

Here's a complete example showing `effect()` in a real application:

```js
// Application state
const app = state({
  user: null,
  isLoggedIn: false,
  notifications: [],
  theme: 'light'
});

// Effect 1: Update UI when login status changes
effect(() => {
  const loginBtn = document.getElementById('loginBtn');
  const userPanel = document.getElementById('userPanel');

  if (app.isLoggedIn) {
    loginBtn.style.display = 'none';
    userPanel.style.display = 'block';
  } else {
    loginBtn.style.display = 'block';
    userPanel.style.display = 'none';
  }
});

// Effect 2: Display user name
effect(() => {
  if (app.user) {
    document.getElementById('userName').textContent = app.user.name;
  }
});

// Effect 3: Show notification count
effect(() => {
  const badge = document.getElementById('notificationBadge');
  const count = app.notifications.length;

  if (count > 0) {
    badge.textContent = count;
    badge.style.display = 'block';
  } else {
    badge.style.display = 'none';
  }
});

// Effect 4: Apply theme
effect(() => {
  document.body.setAttribute('data-theme', app.theme);
  localStorage.setItem('theme', app.theme);
});

// Effect 5: Save state to localStorage
effect(() => {
  const stateToSave = {
    user: app.user,
    isLoggedIn: app.isLoggedIn,
    theme: app.theme
  };

  localStorage.setItem('appState', JSON.stringify(stateToSave));
});

// Now when you update the state, everything updates automatically:
app.user = { name: 'John Doe', id: 123 };
app.isLoggedIn = true;
app.notifications = [{ text: 'Welcome!' }];
app.theme = 'dark';
```

---

## Summary

**`effect()` is the bridge between reactive data and reactive behavior.**

Key takeaways:
- ✅ Effects **automatically run** when reactive dependencies change
- ✅ Dependencies are **tracked automatically** - no manual configuration needed
- ✅ Perfect for **DOM updates**, **side effects**, and **synchronization**
- ✅ Can return a **cleanup function** for teardown logic
- ✅ Returns a **stop function** to disable the effect
- ✅ Use multiple small effects rather than one large effect
- ⚠️ Avoid modifying state that the effect reads (infinite loops)
- ⚠️ Always clean up effects when done to prevent memory leaks

**Remember:** `effect()` makes your application **truly reactive**. While `state()` creates reactive data that can detect changes, `effect()` is what makes things actually happen in response to those changes. Together, they form the foundation of reactive programming! 🎉

➡️ Next, you might want to learn about [`$watch()`](watch.md) for more targeted observation or [`$computed()`](computed.md) for derived values.
