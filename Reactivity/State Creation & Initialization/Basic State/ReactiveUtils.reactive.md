# Understanding `reactive()` - A Beginner's Guide

## What is `reactive()`?

`reactive()` is a **builder pattern function** in the Reactive library that provides a **chainable API** for creating complex reactive systems. It allows you to define state, computed properties, watchers, effects, bindings, and actions all in one fluent, easy-to-read chain.

Think of it as **a construction toolkit** - instead of calling multiple functions separately, you chain them together to build your complete reactive system step by step.

---

## Syntax

```js
// Using the shortcut
reactive(initialState)
  .computed({ ... })
  .watch({ ... })
  .effect(() => { ... })
  .bind({ ... })
  .actions({ ... })
  .build()

// Using the full namespace
ReactiveUtils.reactive(initialState)
  .computed({ ... })
  .watch({ ... })
  .effect(() => { ... })
  .bind({ ... })
  .actions({ ... })
  .build()
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`reactive()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.reactive()`) - Explicit and clear

**Parameters:**
- `initialState` (Object): The initial state properties

**Builder Methods:**
- `.computed(definitions)` - Add computed properties
- `.watch(definitions)` - Add watchers
- `.effect(fn)` - Add an effect
- `.bind(definitions)` - Add DOM bindings
- `.action(name, fn)` - Add a single action
- `.actions(definitions)` - Add multiple actions
- `.build()` - Finalize and return the state object
- `.destroy()` - Clean up all effects, watchers, and bindings

**Returns:**
- The builder object (for chaining), or the state object when `.build()` is called

---

## Why Does This Exist?

### The Problem with Multiple Function Calls

When building a complex reactive system, you typically need many separate function calls:

```javascript
// Step 1: Create state
const counter = state({
  count: 0,
  step: 1
});

// Step 2: Add computed properties
counter.$computed('doubled', function() {
  return this.count * 2;
});

// Step 3: Add watchers
counter.$watch('count', (newValue) => {
  console.log('Count changed to:', newValue);
});

// Step 4: Add effects
effect(() => {
  document.getElementById('count').textContent = counter.count;
});

// Step 5: Add actions
counter.increment = function() {
  this.count += this.step;
};

counter.decrement = function() {
  this.count -= this.step;
};

// This works, but it's scattered and verbose
```

**What's the Real Issue?**

**Problems:**
- Configuration is scattered across multiple statements
- Hard to see the complete picture at a glance
- No clear structure or organization
- Difficult to understand what belongs together
- More verbose than necessary
- No easy way to clean up everything at once

**Why This Becomes a Problem:**

For complex reactive systems:
❌ Related configuration is spread out
❌ No clear structure or grouping
❌ Hard to understand dependencies
❌ Cleanup requires tracking multiple cleanup functions
❌ Less readable and maintainable

In other words, **you have to piece together the complete system from scattered parts**.
The configuration should be unified and clear.

---

### The Solution with `reactive()`

When you use `reactive()`, you define everything in one clear, structured chain:

```javascript
// One clear chain: Everything together
const counter = reactive({
  count: 0,
  step: 1
})
  .computed({
    doubled() {
      return this.count * 2;
    }
  })
  .watch({
    count(newValue) {
      console.log('Count changed to:', newValue);
    }
  })
  .effect(() => {
    document.getElementById('count').textContent = counter.state.count;
  })
  .actions({
    increment(state) {
      state.count += state.step;
    },
    decrement(state) {
      state.count -= state.step;
    }
  })
  .build();

// Clean, structured, and easy to understand
// Cleanup is simple: counter.destroy()
```

**What Just Happened?**

With `reactive()`:
- All configuration in one place
- Clear structure and organization
- Easy to see the complete system
- Fluent, readable syntax
- Built-in cleanup with `.destroy()`

**Benefits:**
- Unified configuration
- Chainable, fluent API
- Better code organization
- Clear mental model
- Easy cleanup
- More maintainable

---

## How Does It Work?

### Under the Hood

`reactive()` creates a builder object with chainable methods:

```
reactive(initialState)
        ↓
1. Creates reactive state
2. Returns builder object
        ↓
.computed() → Adds computed properties → Returns builder
.watch()    → Adds watchers → Returns builder
.effect()   → Adds effects → Returns builder
.bind()     → Adds DOM bindings → Returns builder
.actions()  → Adds action methods → Returns builder
        ↓
.build() → Returns final state with destroy() method
```

**What happens:**

1. `reactive()` creates the initial reactive state
2. Each builder method adds functionality and returns the builder for chaining
3. All cleanup functions are tracked internally
4. `.build()` returns the state object with a `destroy()` method
5. Calling `destroy()` cleans up all effects, watchers, and bindings at once

---

## Basic Usage

### Simple Builder Chain

The most basic usage involves chaining a few methods:

```js
// Using the shortcut style
const app = reactive({
  count: 0
})
  .computed({
    doubled() {
      return this.count * 2;
    }
  })
  .build();

// Or using the namespace style
const app = ReactiveUtils.reactive({
  count: 0
})
  .computed({
    doubled() {
      return this.count * 2;
    }
  })
  .build();

// Use the state
console.log(app.count);    // 0
console.log(app.doubled);  // 0
app.count = 5;
console.log(app.doubled);  // 10
```

### Adding Actions

Actions are methods that modify state:

```js
const counter = reactive({
  count: 0
})
  .actions({
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    },
    reset(state) {
      state.count = 0;
    }
  })
  .build();

// Use actions
counter.increment();  // count = 1
counter.increment();  // count = 2
counter.decrement();  // count = 1
counter.reset();      // count = 0
```

### Adding Watchers

Watch for specific property changes:

```js
const user = reactive({
  name: 'John',
  age: 25
})
  .watch({
    name(newValue, oldValue) {
      console.log(`Name changed from ${oldValue} to ${newValue}`);
    },
    age(newValue) {
      console.log(`Age is now ${newValue}`);
    }
  })
  .build();

user.name = 'Jane'; // Logs: "Name changed from John to Jane"
user.age = 26;      // Logs: "Age is now 26"
```

### Adding Effects

Add effects that run when dependencies change:

```js
const app = reactive({
  message: 'Hello'
})
  .effect(() => {
    document.getElementById('message').textContent = app.message;
  })
  .build();

app.message = 'Hello, World!'; // DOM updates automatically
```

### Adding DOM Bindings

Automatically bind state to DOM elements:

```js
const app = reactive({
  title: 'My App',
  count: 0
})
  .bind({
    '#title': 'title',
    '#count': 'count'
  })
  .build();

app.title = 'New Title'; // #title updates
app.count = 5;           // #count updates
```

### Cleanup with destroy()

The builder tracks all cleanup functions:

```js
const app = reactive({
  count: 0
})
  .watch({
    count(val) {
      console.log('Count:', val);
    }
  })
  .effect(() => {
    console.log('Effect running');
  })
  .build();

// Later, clean up everything
app.destroy(); // Stops all watchers and effects
```

---

## Summary

**`reactive()` provides a chainable builder pattern for creating reactive systems.**

Key takeaways:
- ✅ **Chainable API** for building complex reactive systems
- ✅ Both **shortcut** (`reactive()`) and **namespace** (`ReactiveUtils.reactive()`) styles are valid
- ✅ **Unified configuration** - everything in one place
- ✅ Supports `.computed()`, `.watch()`, `.effect()`, `.bind()`, and `.actions()`
- ✅ Call `.build()` to get the final state object
- ✅ Built-in **cleanup** with `.destroy()`
- ✅ More **readable and maintainable** than scattered configuration
- ✅ Actions receive state as first parameter
- ⚠️ Don't forget to call `.build()` at the end
- ⚠️ Remember to call `.destroy()` when cleaning up

**Remember:** `reactive()` is perfect for building complex reactive systems with a clean, structured API. It brings together all reactive features in one fluent chain, making your code more organized and easier to understand! 🎉
