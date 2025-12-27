# Understanding `store()` - A Beginner's Guide

## What is `store()`?

`store()` is a **structured state management function** in the Reactive library that creates a reactive state with **organized getters (computed properties)** and **actions (methods)**. It's designed for managing application-level state with a clear separation between state, computed values, and actions.

Think of it as **creating a mini-store** for your application - a centralized place to manage state with defined ways to read derived values and modify state.

---

## Syntax

```js
// Using the shortcut
store(initialState, options)

// Using the full namespace
ReactiveUtils.store(initialState, options)
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`store()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.store()`) - Explicit and clear

**Parameters:**
- `initialState` (Object): The initial state properties
- `options` (Object): Configuration object with optional properties:
  - `getters` (Object): Computed properties (functions that return derived values)
  - `actions` (Object): Methods to modify state (functions that receive state as first parameter)

**Returns:**
- A reactive state object with:
  - All initial state properties (reactive)
  - All getters added as computed properties
  - All actions added as methods

---

## Why Does This Exist?

### The Problem with Unstructured State

When managing complex application state, you often end up with scattered logic:

```javascript
// Scattered state management - hard to maintain
const appState = state({
  count: 0,
  items: [],
  filter: 'all'
});

// Computed values defined separately
appState.$computed('filteredItems', function() {
  return this.filter === 'all'
    ? this.items
    : this.items.filter(i => i.type === this.filter);
});

// Actions defined separately
function incrementCount() {
  appState.count++;
}

function addItem(item) {
  appState.items.push(item);
}

function setFilter(filter) {
  appState.filter = filter;
}
```

**What's the Real Issue?**

**Problems:**
- State, computed values, and actions are scattered across your code
- No clear structure or organization
- Hard to see what belongs together
- Difficult to maintain and reason about
- No standard pattern for state management

**Why This Becomes a Problem:**

As your application grows:
❌ State logic is spread across multiple files
❌ Hard to understand what actions are available
❌ Difficult to track which computed properties exist
❌ No clear ownership or responsibility
❌ Inconsistent patterns across different parts of the app

In other words, **you have reactive state, but no structure**.
Everything works, but it's disorganized.

---

### The Solution with `store()`

When you use `store()`, you get **organized, structured state management**:

```javascript
// Organized state management - clear and maintainable
const appStore = store(
  // Initial state
  {
    count: 0,
    items: [],
    filter: 'all'
  },
  // Options
  {
    // Getters (computed properties)
    getters: {
      filteredItems() {
        return this.filter === 'all'
          ? this.items
          : this.items.filter(i => i.type === this.filter);
      },
      itemCount() {
        return this.items.length;
      }
    },

    // Actions (methods)
    actions: {
      increment(state) {
        state.count++;
      },
      addItem(state, item) {
        state.items.push(item);
      },
      setFilter(state, filter) {
        state.filter = filter;
      }
    }
  }
);

// Use the store
console.log(appStore.filteredItems); // Access computed property
appStore.increment();                 // Call action
appStore.addItem({ type: 'todo' });  // Call action with parameter
```

**What Just Happened?**

With `store()`:
- All state, getters, and actions are defined in one place
- Clear structure and organization
- Easy to see what's available
- Consistent pattern for state management

**Benefits:**
- Organized and maintainable
- Clear separation of concerns
- Easy to understand and modify
- Consistent API across your app
- All reactive features of `state()`

---

## How Does It Work?

### Under the Hood

`store()` creates a reactive state and adds getters (as computed properties) and actions (as methods):

```
store(state, { getters, actions })
        ↓
1. Creates reactive state
2. Adds getters as $computed properties
3. Adds actions as methods on state
        ↓
Returns enhanced reactive state
```

**What happens:**

1. `store()` creates a reactive state from `initialState`
2. Each getter in `options.getters` becomes a computed property
3. Each action in `options.actions` becomes a method on the state
4. Actions receive the state as their first parameter
5. Returns the enhanced reactive state

---

## Basic Usage

### Creating a Store

The simplest way to use `store()` is to define state, getters, and actions:

```js
// Using the shortcut style
const counter = store(
  { count: 0 },
  {
    getters: {
      double() {
        return this.count * 2;
      }
    },
    actions: {
      increment(state) {
        state.count++;
      }
    }
  }
);

// Or using the namespace style
const counter = ReactiveUtils.store(
  { count: 0 },
  {
    getters: {
      double() {
        return this.count * 2;
      }
    },
    actions: {
      increment(state) {
        state.count++;
      }
    }
  }
);
```

### Accessing State

Access state properties directly:

```js
const userStore = store(
  {
    name: 'John',
    age: 25,
    email: 'john@example.com'
  }
);

console.log(userStore.name);  // "John"
console.log(userStore.age);   // 25
console.log(userStore.email); // "john@example.com"
```

### Using Getters

Access getters like normal properties (they're computed):

```js
const cart = store(
  {
    items: [
      { price: 10, quantity: 2 },
      { price: 20, quantity: 1 }
    ]
  },
  {
    getters: {
      total() {
        return this.items.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);
      }
    }
  }
);

console.log(cart.total); // 40 (automatically calculated)

// When state changes, getters update automatically
cart.items[0].quantity = 5;
console.log(cart.total); // 120 (automatically recalculated)
```

### Calling Actions

Call actions like methods:

```js
const todoStore = store(
  { todos: [] },
  {
    actions: {
      addTodo(state, text) {
        state.todos.push({
          id: Date.now(),
          text: text,
          completed: false
        });
      },
      toggleTodo(state, id) {
        const todo = state.todos.find(t => t.id === id);
        if (todo) {
          todo.completed = !todo.completed;
        }
      }
    }
  }
);

// Call actions
todoStore.addTodo('Learn reactive stores');
todoStore.toggleTodo(todoStore.todos[0].id);
```
---

## Summary

**`store()` provides structured state management with clear organization.**

Key takeaways:
- ✅ Creates **reactive state** with **getters** and **actions**
- ✅ Both **shortcut** (`store()`) and **namespace** (`ReactiveUtils.store()`) styles are valid
- ✅ **Getters** become computed properties (cached, reactive)
- ✅ **Actions** receive state as first parameter
- ✅ Perfect for **application-level state** management
- ✅ Clear **separation of concerns** (state, getters, actions)
- ✅ Organized and **maintainable** code structure
- ⚠️ Use actions to modify state (not direct modification)
- ⚠️ Getters should only read, never write
- ⚠️ Actions receive state as first parameter

**Remember:** `store()` is ideal when you need organized state management. It combines the reactivity of `state()` with a clear structure for computed values (getters) and state modifications (actions). Perfect for application stores! 🎉
