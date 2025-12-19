# Understanding `createState()` - A Beginner's Guide

## What is `createState()`?

`createState()` is a **convenience function** in the Reactive library that creates reactive state **with automatic DOM bindings**. It combines state creation and DOM binding in one step, making it perfect for quick UI updates without writing separate effects.

Think of it as **state() + automatic UI sync** - you define your state and tell it which DOM elements to update, all in one call.

---

## Syntax

```js
// Using the shortcut
createState(initialState, bindings)

// Using the full namespace
ReactiveUtils.createState(initialState, bindings)
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`createState()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.createState()`) - Explicit and clear

**Parameters:**
- `initialState` (Object): The initial state properties
- `bindings` (Object, optional): DOM bindings definition
  - Key: Any CSS selector
    - ID selector: `'#myElement'`
    - Class selector: `'.myClass'`
    - Tag selector: `'div'`, `'button'`
    - Attribute selector: `'[data-id="123"]'`
    - Any valid CSS selector: `'div.container > p'`
  - Value: Property name (string) or function that returns a value

**Returns:**
- A reactive state object with automatic DOM bindings set up

---

## Why Does This Exist?

### The Problem with Manual Binding

When creating reactive state and binding it to the DOM, you typically need two steps:

```javascript
// Step 1: Create state
const counter = state({
  count: 0,
  message: 'Hello'
});

// Step 2: Create effects for DOM binding
effect(() => {
  document.getElementById('count').textContent = counter.count;
});

effect(() => {
  document.getElementById('message').textContent = counter.message;
});

// This works, but it's verbose
```

**What's the Real Issue?**

**Problems:**
- Two separate steps (create state, then bind)
- Repetitive effect creation for simple bindings
- More code for straightforward UI updates
- Have to remember to create effects for each binding
- Cluttered code for simple use cases

**Why This Becomes a Problem:**

For simple UI updates:
❌ Too much boilerplate code
❌ State and UI bindings are defined separately
❌ Easy to forget to create an effect for a binding
❌ Code feels unnecessarily verbose

In other words, **you have to write more code than necessary for simple cases**.
The state creation and DOM binding should be simpler.

---

### The Solution with `createState()`

When you use `createState()`, you define state and bindings in one call:

```javascript
// One step: Create state WITH bindings
const counter = createState(
  // State
  {
    count: 0,
    message: 'Hello'
  },
  // Bindings
  {
    '#count': 'count',        // Bind counter.count to #count
    '#message': 'message'     // Bind counter.message to #message
  }
);

// DOM updates automatically when state changes
counter.count = 5;     // #count updates automatically
counter.message = 'Hi'; // #message updates automatically
```

**What Just Happened?**

With `createState()`:
- State and bindings defined together
- DOM bindings created automatically
- Less code for simple use cases
- Cleaner and more readable

**Benefits:**
- One-step state + binding creation
- Less boilerplate code
- Clear and concise
- Perfect for simple UI updates
- All reactive features of `state()`

---

## How Does It Work?

### Under the Hood

`createState()` creates reactive state and then calls `$bind()` internally:

```
createState(state, bindings)
        ↓
1. Creates reactive state from initialState
2. Calls state.$bind(bindings)
3. Returns the reactive state with bindings active
        ↓
State with automatic DOM updates
```

**What happens:**

1. Creates a reactive state object
2. If bindings are provided, sets up automatic DOM updates
3. Each binding creates an effect that updates the specified DOM element
4. Returns the state object

---

## Basic Usage

### Creating State with Bindings

The simplest way to use `createState()` is with property bindings:

```js
// Using the shortcut style
const app = createState(
  {
    title: 'My App',
    count: 0
  },
  {
    '#title': 'title',    // Simple property binding
    '#count': 'count'
  }
);

// Or using the namespace style
const app = ReactiveUtils.createState(
  {
    title: 'My App',
    count: 0
  },
  {
    '#title': 'title',
    '#count': 'count'
  }
);

// Changes automatically update the DOM
app.title = 'Updated App'; // #title updates
app.count = 5;             // #count updates
```

### Without Bindings

You can also use `createState()` without bindings (works like `state()`):

```js
const myState = createState({
  name: 'John',
  age: 25
});

// Works like regular state
console.log(myState.name); // "John"
myState.age = 30;
```

### Function Bindings

Use functions for computed bindings:

```js
const user = createState(
  {
    firstName: 'John',
    lastName: 'Doe'
  },
  {
    '#fullName': function() {
      return this.firstName + ' ' + this.lastName;
    }
  }
);

// Changes update the computed binding
user.firstName = 'Jane'; // #fullName shows "Jane Doe"
user.lastName = 'Smith'; // #fullName shows "Jane Smith"
```

### Multiple Property Bindings

Bind multiple properties to one element:

```js
const app = createState(
  {
    isActive: true,
    message: 'Ready'
  },
  {
    '#status': {
      textContent: 'message',
      className: function() {
        return this.isActive ? 'active' : 'inactive';
      }
    }
  }
);
```

### Different Selector Types

You can use any valid CSS selector for bindings:

```js
const app = createState(
  {
    title: 'My App',
    count: 0,
    status: 'active',
    message: 'Hello'
  },
  {
    // ID selector
    '#appTitle': 'title',

    // Class selector (binds to ALL elements with this class)
    '.counter-display': 'count',

    // Tag selector (binds to ALL matching tags)
    'h1': 'title',

    // Attribute selector
    '[data-role="status"]': 'status',

    // Complex selector
    'div.container > p.message': 'message',

    // Multiple selectors (comma-separated)
    '.primary-heading, .secondary-heading': function() {
      return `${this.title} - ${this.count}`;
    }
  }
);
```

**Important:** When a selector matches multiple elements (like class or tag selectors), the binding applies to **all matching elements**.

---

## Common Use Cases

### Use Case 1: Simple Counter

Display counter value automatically:

```js
const counter = createState(
  { count: 0 },
  { '#display': 'count' }
);

// Button handlers
document.getElementById('increment').onclick = () => {
  counter.count++;  // DOM updates automatically
};

document.getElementById('decrement').onclick = () => {
  counter.count--;  // DOM updates automatically
};

document.getElementById('reset').onclick = () => {
  counter.count = 0;  // DOM updates automatically
};
```

### Use Case 2: Form Inputs

Sync form data with display:

```js
const form = createState(
  {
    username: '',
    email: '',
    age: 0
  },
  {
    '#usernameDisplay': 'username',
    '#emailDisplay': 'email',
    '#ageDisplay': 'age',
    '#summary': function() {
      return `${this.username} (${this.email}), Age: ${this.age}`;
    }
  }
);

// Bind inputs
document.getElementById('usernameInput').oninput = (e) => {
  form.username = e.target.value;
};

document.getElementById('emailInput').oninput = (e) => {
  form.email = e.target.value;
};

document.getElementById('ageInput').oninput = (e) => {
  form.age = parseInt(e.target.value) || 0;
};
```

### Use Case 3: Live Search

Display search results count:

```js
const search = createState(
  {
    query: '',
    results: [],
    isSearching: false
  },
  {
    '#query': 'query',
    '#resultCount': function() {
      return `Found ${this.results.length} results`;
    },
    '#searchStatus': function() {
      return this.isSearching ? 'Searching...' : 'Ready';
    }
  }
);

document.getElementById('searchInput').oninput = (e) => {
  search.query = e.target.value;
  performSearch(search.query);
};

async function performSearch(query) {
  search.isSearching = true;
  const results = await fetch(`/api/search?q=${query}`).then(r => r.json());
  search.results = results;
  search.isSearching = false;
}
```

### Use Case 4: Status Messages

Show dynamic status updates:

```js
const app = createState(
  {
    status: 'idle',
    message: '',
    progress: 0
  },
  {
    '#status': 'status',
    '#message': 'message',
    '#progress': function() {
      return `${this.progress}%`;
    }
  }
);

async function uploadFile(file) {
  app.status = 'uploading';
  app.message = 'Uploading file...';
  app.progress = 0;

  // Simulate upload with progress
  for (let i = 0; i <= 100; i += 10) {
    await new Promise(resolve => setTimeout(resolve, 200));
    app.progress = i;
  }

  app.status = 'complete';
  app.message = 'Upload complete!';
}
```

### Use Case 5: Shopping Cart Badge

Update cart item count badge:

```js
const cart = createState(
  {
    items: [],
    total: 0
  },
  {
    '#cartBadge': function() {
      return this.items.length;
    },
    '#cartTotal': function() {
      return `$${this.total.toFixed(2)}`;
    }
  }
);

function addToCart(item) {
  cart.items.push(item);
  cart.total += item.price;
}

function removeFromCart(index) {
  const item = cart.items[index];
  cart.total -= item.price;
  cart.items.splice(index, 1);
}
```

### Use Case 6: Multiple Elements with Class Selector

Update all elements with a specific class:

```js
const app = createState(
  {
    userName: 'John Doe',
    userRole: 'Admin',
    lastLogin: new Date().toLocaleString()
  },
  {
    // Bind to ALL elements with class 'user-name'
    '.user-name': 'userName',

    // Bind to ALL elements with class 'user-role'
    '.user-role': 'userRole',

    // Function binding to multiple elements
    '.last-login': function() {
      return `Last login: ${this.lastLogin}`;
    }
  }
);

// If you have multiple elements like:
// <span class="user-name"></span>
// <div class="user-name"></div>
// <p class="user-name"></p>
// All will update automatically when userName changes

app.userName = 'Jane Smith'; // Updates ALL .user-name elements
```

---

## Advanced Patterns

### Pattern 1: Nested Property Bindings

Bind to nested state properties:

```js
const app = createState(
  {
    user: {
      profile: {
        name: 'John',
        email: 'john@example.com'
      }
    }
  },
  {
    '#userName': function() {
      return this.user.profile.name;
    },
    '#userEmail': function() {
      return this.user.profile.email;
    }
  }
);

// Update nested properties
app.user.profile.name = 'Jane'; // Bindings update
```

### Pattern 2: Conditional Bindings

Show/hide elements based on state:

```js
const app = createState(
  {
    isLoggedIn: false,
    user: null
  },
  {
    '#loginPanel': {
      style: function() {
        return { display: this.isLoggedIn ? 'none' : 'block' };
      }
    },
    '#userPanel': {
      style: function() {
        return { display: this.isLoggedIn ? 'block' : 'none' };
      }
    },
    '#userName': function() {
      return this.user ? this.user.name : '';
    }
  }
);
```

### Pattern 3: List Bindings

Bind array data:

```js
const app = createState(
  {
    items: ['Apple', 'Banana', 'Orange']
  },
  {
    '#itemList': function() {
      return this.items.join(', ');
    },
    '#itemCount': function() {
      return `${this.items.length} items`;
    }
  }
);

app.items.push('Grape'); // Bindings update
```

### Pattern 4: Computed Display

Complex computed values for display:

```js
const data = createState(
  {
    numbers: [1, 2, 3, 4, 5]
  },
  {
    '#sum': function() {
      return this.numbers.reduce((a, b) => a + b, 0);
    },
    '#average': function() {
      const sum = this.numbers.reduce((a, b) => a + b, 0);
      return (sum / this.numbers.length).toFixed(2);
    },
    '#max': function() {
      return Math.max(...this.numbers);
    },
    '#min': function() {
      return Math.min(...this.numbers);
    }
  }
);
```

---

## Performance Tips

### Tip 1: Use Property Bindings for Simple Cases

For simple property display, use string bindings (more efficient):

**More efficient:**
```js
createState(
  { name: 'John' },
  { '#name': 'name' }  // Direct property binding
);
```

**Less efficient:**
```js
createState(
  { name: 'John' },
  { '#name': function() { return this.name; } }  // Unnecessary function
);
```

### Tip 2: Combine Related Bindings

Group related bindings to one element:

```js
createState(
  { name: 'John', age: 25 },
  {
    '#userInfo': {
      textContent: function() {
        return `${this.name}, ${this.age}`;
      },
      className: function() {
        return this.age >= 18 ? 'adult' : 'minor';
      }
    }
  }
);
```

### Tip 3: Use $computed for Complex Calculations

For expensive calculations, use `$computed` instead of function bindings:

```js
const app = createState(
  { numbers: [1, 2, 3, 4, 5] }
);

app.$computed('sum', function() {
  return this.numbers.reduce((a, b) => a + b, 0);
});

app.$bind({
  '#sum': 'sum'  // Uses cached computed value
});
```

---

## Common Pitfalls

### Pitfall 1: Forgetting Return in Function Bindings

**Problem:** Function bindings must return a value:

```js
// WRONG
createState(
  { name: 'John' },
  {
    '#name': function() {
      this.name;  // No return!
    }
  }
);

// RIGHT
createState(
  { name: 'John' },
  {
    '#name': function() {
      return this.name;  // Returns the value
    }
  }
);
```

### Pitfall 2: Binding to Non-Existent Elements

**Problem:** Binding to elements that don't exist yet:

```js
// Element doesn't exist yet
const app = createState(
  { message: 'Hello' },
  { '#message': 'message' }  // No error, but no effect
);

// Create element later
document.body.innerHTML = '<div id="message"></div>';
// Binding already ran, element still empty
```

**Solution:** Create bindings after DOM is ready:

```js
document.addEventListener('DOMContentLoaded', () => {
  const app = createState(
    { message: 'Hello' },
    { '#message': 'message' }
  );
});
```

### Pitfall 3: Modifying State in Binding Functions

**Problem:** Binding functions should only read, not write:

```js
// BAD
createState(
  { count: 0 },
  {
    '#count': function() {
      this.count++;  // DON'T modify state in bindings!
      return this.count;
    }
  }
);

// GOOD
createState(
  { count: 0 },
  {
    '#count': function() {
      return this.count;  // Just read and return
    }
  }
);
```

---

## Real-World Example

Here's a complete example using `createState()`:

```js
// Create state with bindings
const todoApp = createState(
  // State
  {
    newTodoText: '',
    todos: [],
    filter: 'all'
  },

  // Bindings
  {
    '#todoCount': function() {
      const active = this.todos.filter(t => !t.completed).length;
      return `${active} item${active !== 1 ? 's' : ''} left`;
    },

    '#filterStatus': 'filter',

    '#completedCount': function() {
      const completed = this.todos.filter(t => t.completed).length;
      return completed > 0 ? `${completed} completed` : '';
    }
  }
);

// Add computed for filtered todos
todoApp.$computed('filteredTodos', function() {
  if (this.filter === 'active') {
    return this.todos.filter(t => !t.completed);
  }
  if (this.filter === 'completed') {
    return this.todos.filter(t => t.completed);
  }
  return this.todos;
});

// Display todos
effect(() => {
  const list = document.getElementById('todoList');
  list.innerHTML = '';

  todoApp.filteredTodos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" ${todo.completed ? 'checked' : ''}
             onchange="toggleTodo(${index})">
      <span class="${todo.completed ? 'completed' : ''}">${todo.text}</span>
      <button onclick="removeTodo(${index})">×</button>
    `;
    list.appendChild(li);
  });
});

// Functions
function addTodo() {
  if (todoApp.newTodoText.trim()) {
    todoApp.todos.push({
      text: todoApp.newTodoText.trim(),
      completed: false
    });
    todoApp.newTodoText = '';
  }
}

function toggleTodo(index) {
  todoApp.todos[index].completed = !todoApp.todos[index].completed;
}

function removeTodo(index) {
  todoApp.todos.splice(index, 1);
}

function setFilter(filter) {
  todoApp.filter = filter;
}

// Bind input
document.getElementById('newTodo').oninput = (e) => {
  todoApp.newTodoText = e.target.value;
};

document.getElementById('newTodo').onkeypress = (e) => {
  if (e.key === 'Enter') {
    addTodo();
  }
};
```

---

## Summary

**`createState()` combines state creation with automatic DOM bindings.**

Key takeaways:
- ✅ Creates **reactive state** with **automatic DOM bindings**
- ✅ Both **shortcut** (`createState()`) and **namespace** (`ReactiveUtils.createState()`) styles are valid
- ✅ **One-step** state and binding creation
- ✅ Less boilerplate than state() + effects
- ✅ Supports **property bindings** (strings) and **function bindings**
- ✅ Perfect for **simple UI synchronization**
- ✅ Can be used without bindings (works like `state()`)
- ⚠️ Function bindings must return a value
- ⚠️ Ensure DOM elements exist before creating bindings
- ⚠️ Don't modify state in binding functions

**Remember:** `createState()` is perfect when you need reactive state with automatic DOM updates. It combines the power of `state()` with built-in `$bind()`, saving you from writing repetitive effects for simple UI updates! 🎉

➡️ Next, explore [`state()`](state.md) for more control or [`component()`](component.md) for component-based state management!
