# Understanding `component()` - A Beginner's Guide

## What is `component()`?

`component()` is a **component creation function** in the Reactive library that provides a **declarative, configuration-based approach** to building reactive components. It allows you to define all aspects of a component - state, computed properties, watchers, effects, bindings, actions, and lifecycle hooks - in one clean configuration object.

Think of it as **a complete component factory** - you provide a configuration blueprint, and it builds a fully-functional reactive component with lifecycle management.

---

## Syntax

```js
// Using the shortcut
component({
  state: { ... },
  computed: { ... },
  watch: { ... },
  effects: { ... },
  bindings: { ... },
  actions: { ... },
  mounted() { ... },
  unmounted() { ... }
})

// Using the full namespace
ReactiveUtils.component({
  state: { ... },
  computed: { ... },
  watch: { ... },
  effects: { ... },
  bindings: { ... },
  actions: { ... },
  mounted() { ... },
  unmounted() { ... }
})
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`component()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.component()`) - Explicit and clear

**Configuration Object:**
- `state` (Object, optional): Initial state properties
- `computed` (Object, optional): Computed property definitions
- `watch` (Object, optional): Watcher definitions
- `effects` (Object, optional): Effect functions
- `bindings` (Object, optional): DOM binding definitions
- `actions` (Object, optional): Action method definitions
- `mounted` (Function, optional): Called after component is created
- `unmounted` (Function, optional): Called when component is destroyed

**Returns:**
- A reactive state object with all configured features and a `$destroy()` method

---

## Why Does This Exist?

### The Problem with Manual Component Setup

When creating a component manually, you need to set up many things separately:

```javascript
// Step 1: Create state
const counter = state({
  count: 0,
  step: 1
});

// Step 2: Add computed
counter.$computed('doubled', function() {
  return this.count * 2;
});

// Step 3: Add watchers
counter.$watch('count', (val) => {
  console.log('Count:', val);
});

// Step 4: Add effects
effect(() => {
  document.getElementById('count').textContent = counter.count;
});

// Step 5: Add methods
counter.increment = function() {
  this.count += this.step;
};

counter.decrement = function() {
  this.count -= this.step;
};

// Step 6: Initialize
console.log('Counter initialized');

// Step 7: Remember to clean up
counter.$destroy = function() {
  // Manual cleanup needed
};

// Scattered, verbose, and error-prone
```

**What's the Real Issue?**

**Problems:**
- Component setup is scattered across multiple statements
- No standard structure or pattern
- Easy to forget lifecycle management
- No clear initialization or cleanup points
- Hard to see the complete component at a glance
- Manual cleanup management is error-prone

**Why This Becomes a Problem:**

For reusable components:
❌ No consistent component structure
❌ Lifecycle management is manual
❌ Easy to forget cleanup
❌ Hard to understand component boundaries
❌ Difficult to reuse patterns

In other words, **building components requires too much boilerplate and manual work**.
There should be a standard, declarative way to define components.

---

### The Solution with `component()`

When you use `component()`, you define everything in one configuration object:

```javascript
// One clear configuration: Everything together
const counter = component({
  // State
  state: {
    count: 0,
    step: 1
  },

  // Computed properties
  computed: {
    doubled() {
      return this.count * 2;
    }
  },

  // Watchers
  watch: {
    count(val) {
      console.log('Count:', val);
    }
  },

  // DOM bindings
  bindings: {
    '#count': 'count'
  },

  // Actions
  actions: {
    increment(state) {
      state.count += state.step;
    },
    decrement(state) {
      state.count -= state.step;
    }
  },

  // Lifecycle
  mounted() {
    console.log('Counter initialized');
  },

  unmounted() {
    console.log('Counter cleaned up');
  }
});

// Use it
counter.increment();

// Cleanup is built-in
counter.$destroy(); // Calls unmounted() and cleans up everything
```

**What Just Happened?**

With `component()`:
- Everything in one configuration object
- Clear structure and organization
- Built-in lifecycle hooks
- Automatic cleanup management
- Easy to understand and reuse

**Benefits:**
- Declarative component definition
- Standard component structure
- Built-in lifecycle management
- Automatic cleanup on destroy
- More maintainable and reusable
- Clear component boundaries

---

## How Does It Work?

### Under the Hood

`component()` processes the configuration object and sets up everything:

```
component(config)
        ↓
1. Create reactive state from config.state
2. Add computed properties from config.computed
3. Set up watchers from config.watch
4. Set up effects from config.effects
5. Set up DOM bindings from config.bindings
6. Add action methods from config.actions
7. Call config.mounted() if provided
        ↓
Returns state with $destroy() method
        ↓
state.$destroy() → Cleans up everything + calls config.unmounted()
```

**What happens:**

1. Creates reactive state from the `state` property
2. Adds all configured features (computed, watch, effects, bindings, actions)
3. Tracks all cleanup functions internally
4. Calls the `mounted()` hook if provided
5. Returns the state object with a `$destroy()` method
6. When `$destroy()` is called, cleans up all effects/watchers/bindings and calls `unmounted()`

---

## Basic Usage

### Simple Component

The simplest component with just state and actions:

```js
// Using the shortcut style
const counter = component({
  state: {
    count: 0
  },

  actions: {
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    }
  }
});

// Or using the namespace style
const counter = ReactiveUtils.component({
  state: {
    count: 0
  },

  actions: {
    increment(state) {
      state.count++;
    }
  }
});

// Use it
counter.increment();
console.log(counter.count); // 1
```

### Component with Computed

Add computed properties:

```js
const user = component({
  state: {
    firstName: 'John',
    lastName: 'Doe'
  },

  computed: {
    fullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  }
});

console.log(user.fullName); // "John Doe"
user.firstName = 'Jane';
console.log(user.fullName); // "Jane Doe"
```

### Component with Watchers

React to state changes:

```js
const app = component({
  state: {
    message: 'Hello'
  },

  watch: {
    message(newValue, oldValue) {
      console.log(`Message changed from "${oldValue}" to "${newValue}"`);
    }
  }
});

app.message = 'Hi'; // Logs: Message changed from "Hello" to "Hi"
```

### Component with DOM Bindings

Automatically bind to DOM:

```js
const app = component({
  state: {
    title: 'My App',
    count: 0
  },

  bindings: {
    '#title': 'title',
    '#count': 'count'
  }
});

app.title = 'New Title'; // #title updates
app.count = 5;           // #count updates
```

### Component with Lifecycle Hooks

Use mounted and unmounted:

```js
const timer = component({
  state: {
    seconds: 0
  },

  mounted() {
    console.log('Timer started');
    this.intervalId = setInterval(() => {
      this.seconds++;
    }, 1000);
  },

  unmounted() {
    console.log('Timer stopped');
    clearInterval(this.intervalId);
  }
});

// Later...
timer.$destroy(); // Stops timer and logs "Timer stopped"
```
---

## Summary

**`component()` provides a declarative way to create reactive components.**

Key takeaways:
- ✅ **Declarative configuration** - define components with a config object
- ✅ Both **shortcut** (`component()`) and **namespace** (`ReactiveUtils.component()`) styles are valid
- ✅ Supports **state**, **computed**, **watch**, **effects**, **bindings**, and **actions**
- ✅ Built-in **lifecycle hooks**: `mounted()` and `unmounted()`
- ✅ Automatic **cleanup** with `$destroy()` method
- ✅ Clear **component boundaries** and structure
- ✅ Perfect for **reusable components**
- ✅ Actions receive state as first parameter
- ⚠️ Use regular functions for hooks (not arrow functions)
- ⚠️ Always call `$destroy()` when removing components

**Remember:** `component()` is perfect for building structured, reusable reactive components with a clear lifecycle. It provides a standard pattern for component creation that's easy to understand and maintain! 🎉
