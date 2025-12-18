# Understanding `$update()` - A Beginner's Guide

## What is `$update()`?

`$update()` is an **instance method on reactive state objects** that performs mixed state and DOM updates in a single call. It automatically detects whether you're updating state properties or DOM elements based on the key pattern, and handles both intelligently.

Think of it as a **universal update button on your data**:
1. Call `$update()` on your reactive state
2. Pass an object with updates
3. Keys that look like selectors → update DOM
4. Regular keys → update state properties
5. Everything updates automatically!

It's like having a smart assistant who knows whether you're talking about data or display and handles both!

---

## Why Does This Exist?

### The Old Way (Without `$update()`)

You had to update state and DOM separately:

```javascript
const state = ReactiveUtils.state({ count: 0, status: 'idle' });

// Update state
state.count = 5;
state.status = 'active';

// Update DOM manually
document.getElementById('counter').textContent = 5;
document.getElementById('status').textContent = 'active';

// Or use separate function
ReactiveUtils.updateAll(state, {
  count: 5,
  status: 'active',
  '#counter': 5,
  '#status': 'active'
});
```

**Problems:**
- Separate state and DOM updates (if manual)
- Must use standalone function for mixed updates
- Less intuitive when working with state objects
- Not obvious it's a method on the state

### The New Way (With `$update()`)

With `$update()`, it's a method directly on the state:

```javascript
const state = ReactiveUtils.state({ count: 0, status: 'idle' });

// Update state AND DOM together
state.$update({
  count: 5,              // Updates state.count
  status: 'active',      // Updates state.status
  '#counter': 5,         // Updates DOM element
  '#status': 'active'    // Updates DOM element
});

// Everything updated in one call! ✨
```

**Benefits:**
- Method directly on state object
- Single call for state and DOM
- Automatic detection of what to update
- More intuitive and object-oriented
- Cleaner, more readable code
- No external references needed

---

## How Does It Work?

`$update()` is a method available on all reactive state objects:

```javascript
const state = ReactiveUtils.state({ count: 0 });

// state.$update is available
state.$update({
  count: 10,        // Regular key → state property
  '#display': 10    // Starts with # → DOM element
});

// Internally:
// 1. Calls ReactiveUtils.updateAll(this, updates)
// 2. Examines each key
// 3. Selector-like keys (#, ., [, >) → update DOM
// 4. Regular keys → update state
// 5. All batched together for performance
```

**Key concept:** It's the same as `ReactiveUtils.updateAll()` but as a method on the state object!

---

## Syntax

### Basic Syntax

```javascript
state.$update({
  // State properties (no special prefix)
  propertyName: value,
  
  // DOM by ID (starts with #)
  '#element-id': value,
  
  // DOM by class (starts with .)
  '.class-name': value,
  
  // DOM by selector (contains [, >, etc.)
  'div[data-id="1"]': value
})
```

**Parameters:**
- `updates` (object) - Object with properties to update
  - Regular keys update state
  - Selector keys update DOM

**Returns:** The state object (for chaining)

---

## Update Detection Rules

### State Property Updates

Regular property names update state:

```javascript
state.$update({
  count: 10,           // Updates state.count
  name: 'John',        // Updates state.name
  'user.email': 'a@b'  // Updates nested state.user.email
});
```

---

### DOM Element Updates

Keys with special characters update DOM:

```javascript
state.$update({
  '#counter': 42,           // ID selector
  '.status': 'Active',      // Class selector
  'div[data-id="1"]': 'X',  // Attribute selector
  'nav > ul': '<li>...</li>' // Descendant selector
});
```

---

## Simple Examples Explained

### Example 1: Basic Mixed Update

```javascript
const counter = ReactiveUtils.state({ count: 0 });

ReactiveUtils.effect(() => {
  console.log('State count:', counter.count);
});

// Update state and DOM together
counter.$update({
  count: 5,           // Updates state
  '#counter': 5,      // Updates DOM element
  '#status': 'Active' // Updates another DOM element
});

// Logs: "State count: 5"
// Also updates #counter and #status in DOM
```

---

### Example 2: Form Submission

**HTML:**
```html
<form>
  <input id="email" type="email">
  <button id="submit-btn">Submit</button>
  <div id="message"></div>
</form>
```

**JavaScript:**
```javascript
const form = ReactiveUtils.state({
  email: '',
  isSubmitting: false,
  message: ''
});

async function handleSubmit() {
  // Set loading state
  form.$update({
    isSubmitting: true,
    '#submit-btn': {
      textContent: 'Submitting...',
      disabled: true
    },
    '#message': 'Please wait...'
  });
  
  try {
    await submitToServer(form.email);
    
    // Success state
    form.$update({
      isSubmitting: false,
      message: 'Success!',
      '#submit-btn': {
        textContent: 'Submit',
        disabled: false
      },
      '#message': '✅ Submitted successfully!'
    });
    
  } catch (error) {
    // Error state
    form.$update({
      isSubmitting: false,
      message: error.message,
      '#submit-btn': {
        textContent: 'Submit',
        disabled: false
      },
      '#message': '❌ Error: ' + error.message
    });
  }
}
```

---

### Example 3: Live Counter

**HTML:**
```html
<div id="counter">0</div>
<div id="doubled">0</div>
<button onclick="increment()">+</button>
<button onclick="decrement()">-</button>
```

**JavaScript:**
```javascript
const counter = ReactiveUtils.state({ count: 0 });

// Computed
counter.$computed('doubled', function() {
  return this.count * 2;
});

function increment() {
  counter.$update({
    count: counter.count + 1,
    '#counter': counter.count + 1,
    '#doubled': (counter.count + 1) * 2
  });
}

function decrement() {
  counter.$update({
    count: counter.count - 1,
    '#counter': counter.count - 1,
    '#doubled': (counter.count - 1) * 2
  });
}

window.increment = increment;
window.decrement = decrement;
```

---

### Example 4: Dashboard Update

**HTML:**
```html
<div class="dashboard">
  <div id="users-count">0</div>
  <div id="sales-count">0</div>
  <div id="revenue">$0</div>
  <div class="status">Idle</div>
  <div class="last-updated">Never</div>
</div>
```

**JavaScript:**
```javascript
const dashboard = ReactiveUtils.state({
  users: 0,
  sales: 0,
  revenue: 0,
  status: 'idle',
  lastUpdated: null
});

async function refreshDashboard() {
  // Set loading state
  dashboard.$update({
    status: 'loading',
    '.status': 'Loading...'
  });
  
  // Fetch data
  const data = await fetch('/api/dashboard').then(r => r.json());
  const timestamp = new Date().toLocaleTimeString();
  
  // Update everything at once
  dashboard.$update({
    // State
    users: data.users,
    sales: data.sales,
    revenue: data.revenue,
    status: 'updated',
    lastUpdated: new Date(),
    
    // DOM
    '#users-count': data.users.toLocaleString(),
    '#sales-count': data.sales.toLocaleString(),
    '#revenue': `$${data.revenue.toLocaleString()}`,
    '.status': 'Updated',
    '.last-updated': `Last update: ${timestamp}`
  });
}
```

---

### Example 5: Theme Switcher

**HTML:**
```html
<button id="theme-toggle">Toggle Theme</button>
<div id="current-theme">light</div>
```

**JavaScript:**
```javascript
const settings = ReactiveUtils.state({
  theme: 'light',
  fontSize: 16,
  animations: true
});

function toggleTheme() {
  const newTheme = settings.theme === 'light' ? 'dark' : 'light';
  
  settings.$update({
    theme: newTheme,
    '#current-theme': newTheme,
    'body': {
      className: `theme-${newTheme}`
    }
  });
  
  // Save to localStorage
  localStorage.setItem('theme', newTheme);
}

document.getElementById('theme-toggle').onclick = toggleTheme;
```

---

## Real-World Example: Todo App Manager

```javascript
const todoApp = ReactiveUtils.state({
  todos: [
    { id: 1, text: 'Learn Reactive', done: false },
    { id: 2, text: 'Build app', done: true }
  ],
  filter: 'all',
  input: '',
  nextId: 3
});

// Computed properties
todoApp
  .$computed('filteredTodos', function() {
    if (this.filter === 'all') return this.todos;
    if (this.filter === 'active') return this.todos.filter(t => !t.done);
    return this.todos.filter(t => t.done);
  })
  .$computed('activeCount', function() {
    return this.todos.filter(t => !t.done).length;
  })
  .$computed('completedCount', function() {
    return this.todos.filter(t => t.done).length;
  });

// Add todo
function addTodo() {
  if (!todoApp.input.trim()) return;
  
  const newTodo = {
    id: todoApp.nextId,
    text: todoApp.input,
    done: false
  };
  
  const newTodos = [...todoApp.todos, newTodo];
  
  todoApp.$update({
    // State updates
    todos: newTodos,
    input: '',
    nextId: todoApp.nextId + 1,
    
    // DOM updates
    '#todo-input': '',
    '#todo-list': renderTodoList(newTodos, todoApp.filter),
    '#active-count': todoApp.activeCount + 1,
    '#total-count': newTodos.length
  });
}

// Toggle todo
function toggleTodo(id) {
  const newTodos = todoApp.todos.map(todo =>
    todo.id === id ? { ...todo, done: !todo.done } : todo
  );
  
  todoApp.$update({
    // State
    todos: newTodos,
    
    // DOM
    '#todo-list': renderTodoList(newTodos, todoApp.filter),
    '#active-count': newTodos.filter(t => !t.done).length,
    '#completed-count': newTodos.filter(t => t.done).length
  });
}

// Delete todo
function deleteTodo(id) {
  const newTodos = todoApp.todos.filter(t => t.id !== id);
  
  todoApp.$update({
    // State
    todos: newTodos,
    
    // DOM
    '#todo-list': renderTodoList(newTodos, todoApp.filter),
    '#active-count': newTodos.filter(t => !t.done).length,
    '#total-count': newTodos.length
  });
}

// Set filter
function setFilter(filter) {
  todoApp.$update({
    // State
    filter: filter,
    
    // DOM - update filter buttons
    '#filter-all': {
      className: filter === 'all' ? 'active' : ''
    },
    '#filter-active': {
      className: filter === 'active' ? 'active' : ''
    },
    '#filter-completed': {
      className: filter === 'completed' ? 'active' : ''
    },
    
    // Update list
    '#todo-list': renderTodoList(todoApp.todos, filter)
  });
}

// Clear completed
function clearCompleted() {
  const newTodos = todoApp.todos.filter(t => !t.done);
  
  todoApp.$update({
    // State
    todos: newTodos,
    
    // DOM
    '#todo-list': renderTodoList(newTodos, todoApp.filter),
    '#total-count': newTodos.length,
    '#completed-count': 0
  });
}

// Helper to render todo list HTML
function renderTodoList(todos, filter) {
  const filtered = filter === 'all' ? todos :
    filter === 'active' ? todos.filter(t => !t.done) :
    todos.filter(t => t.done);
  
  if (filtered.length === 0) {
    return '<p class="empty">No todos to show</p>';
  }
  
  return filtered.map(todo => `
    <div class="todo-item ${todo.done ? 'done' : ''}">
      <input 
        type="checkbox" 
        ${todo.done ? 'checked' : ''}
        onchange="window.toggleTodo(${todo.id})"
      >
      <span>${todo.text}</span>
      <button onclick="window.deleteTodo(${todo.id})">Delete</button>
    </div>
  `).join('');
}

// Make functions global for onclick handlers
window.addTodo = addTodo;
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
window.setFilter = setFilter;
window.clearCompleted = clearCompleted;

// Initial render
todoApp.$update({
  '#todo-list': renderTodoList(todoApp.todos, todoApp.filter),
  '#active-count': todoApp.activeCount,
  '#completed-count': todoApp.completedCount,
  '#total-count': todoApp.todos.length
});
```

---

## Real-World Example: Live Search with Results

```javascript
const search = ReactiveUtils.state({
  query: '',
  results: [],
  isSearching: false,
  error: null,
  totalResults: 0,
  searchTime: 0
});

// Debounced search
let searchTimeout;

function handleSearchInput(event) {
  const query = event.target.value;
  
  search.$update({
    query: query,
    '#search-input': query
  });
  
  // Debounce search
  clearTimeout(searchTimeout);
  
  if (!query.trim()) {
    search.$update({
      results: [],
      totalResults: 0,
      '#results': '<p class="empty">Enter a search term</p>',
      '#result-count': ''
    });
    return;
  }
  
  searchTimeout = setTimeout(() => performSearch(query), 300);
}

async function performSearch(query) {
  const startTime = Date.now();
  
  // Set loading state
  search.$update({
    isSearching: true,
    error: null,
    '#results': '<div class="loading">Searching...</div>',
    '#search-status': 'Searching...'
  });
  
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    const searchTime = Date.now() - startTime;
    
    // Update with results
    search.$update({
      // State
      isSearching: false,
      results: data.results,
      totalResults: data.total,
      searchTime: searchTime,
      
      // DOM
      '#results': renderResults(data.results),
      '#result-count': `${data.total} results (${searchTime}ms)`,
      '#search-status': `Found ${data.total} results`,
      '.search-box': {
        className: 'search-box has-results'
      }
    });
    
  } catch (error) {
    // Update with error
    search.$update({
      // State
      isSearching: false,
      error: error.message,
      results: [],
      
      // DOM
      '#results': `<div class="error">❌ ${error.message}</div>`,
      '#search-status': 'Search failed',
      '#result-count': ''
    });
  }
}

function renderResults(results) {
  if (results.length === 0) {
    return '<p class="empty">No results found</p>';
  }
  
  return results.map(result => `
    <div class="result-item">
      <h3>${result.title}</h3>
      <p>${result.description}</p>
      <a href="${result.url}">View →</a>
    </div>
  `).join('');
}

// Attach event listener
document.getElementById('search-input').addEventListener('input', handleSearchInput);
```

---

## Real-World Example: Multi-Step Form

```javascript
const wizard = ReactiveUtils.state({
  currentStep: 1,
  totalSteps: 3,
  formData: {
    personal: { name: '', email: '', phone: '' },
    address: { street: '', city: '', country: '' },
    payment: { cardNumber: '', expiry: '', cvv: '' }
  },
  errors: {},
  isValid: false
});

function goToStep(step) {
  wizard.$update({
    // State
    currentStep: step,
    
    // DOM - Update step indicators
    '.step-indicator': {
      className: 'step-indicator'
    },
    [`#step-${step}-indicator`]: {
      className: 'step-indicator active'
    },
    
    // Show/hide step content
    '.step-content': {
      style: { display: 'none' }
    },
    [`#step-${step}-content`]: {
      style: { display: 'block' }
    },
    
    // Update buttons
    '#prev-btn': {
      disabled: step === 1,
      style: { display: step === 1 ? 'none' : 'block' }
    },
    '#next-btn': {
      textContent: step === wizard.totalSteps ? 'Submit' : 'Next',
      style: { display: 'block' }
    }
  });
}

function nextStep() {
  if (validateCurrentStep()) {
    const nextStep = Math.min(wizard.currentStep + 1, wizard.totalSteps);
    goToStep(nextStep);
  } else {
    wizard.$update({
      '#error-message': 'Please fix the errors before continuing',
      '.error-message': {
        style: { display: 'block' }
      }
    });
  }
}

function prevStep() {
  const prevStep = Math.max(wizard.currentStep - 1, 1);
  goToStep(prevStep);
}

function validateCurrentStep() {
  // Validation logic here
  return true;
}

// Initialize
goToStep(1);
```

---

## Common Beginner Questions

### Q: What's the difference between `$update()` and `ReactiveUtils.updateAll()`?

**Answer:** They do the same thing, just different syntax:

```javascript
const state = ReactiveUtils.state({ count: 0 });

// Method 1: $update (on state object)
state.$update({
  count: 5,
  '#counter': 5
});

// Method 2: ReactiveUtils.updateAll (standalone)
ReactiveUtils.updateAll(state, {
  count: 5,
  '#counter': 5
});

// Both work identically!
```

**Use `$update()`** when working with state objects (more intuitive)
**Use `ReactiveUtils.updateAll()`** when you need the standalone function

---

### Q: How does it detect state vs DOM?

**Answer:** By examining the key pattern:

```javascript
state.$update({
  'count': 10,           // No special chars → state
  'user.name': 'John',   // Dot notation → nested state
  
  '#element': 'value',   // Starts with # → DOM
  '.class': 'value',     // Starts with . → DOM
  'div[id]': 'value'     // Contains [ or > → DOM
});
```

---

### Q: Can I update nested state properties?

**Answer:** Yes, use dot notation:

```javascript
state.$update({
  'user.profile.name': 'John',
  'settings.theme': 'dark',
  '#display': 'Updated nested properties'
});
```

---

### Q: Does it batch updates automatically?

**Answer:** Yes! All updates are batched:

```javascript
state.$update({
  prop1: 1,
  prop2: 2,
  prop3: 3,
  '#element': 'value'
});

// Only 1 effect run for all state changes
// DOM updated once
```

---

### Q: Can I update multiple element properties?

**Answer:** Yes, pass an object:

```javascript
state.$update({
  count: 10,
  '#button': {
    textContent: 'Click me',
    disabled: false,
    className: 'btn-primary'
  }
});
```

---

## Tips for Beginners

### 1. Use for Quick State + UI Updates

```javascript
// ✅ Perfect for quick synchronized updates
state.$update({
  status: 'loading',
  '#status': 'Loading...',
  '#spinner': { style: { display: 'block' } }
});
```

---

### 2. Combine State and DOM Logic

```javascript
function saveData() {
  state.$update({
    isSaving: true,
    lastSaved: new Date(),
    '#save-btn': 'Saving...',
    '#status': '💾 Saving changes...'
  });
}
```

---

### 3. Update Multiple Elements with Same Class

```javascript
// Updates ALL elements with class="price"
state.$update({
  price: 99.99,
  '.price': '$99.99',
  '.currency': 'USD'
});
```

---

### 4. Keep Related Updates Together

```javascript
// ✅ Good - related updates grouped
state.$update({
  count: count + 1,
  '#count-display': count + 1,
  '#count-message': `Count is now ${count + 1}`
});

// ❌ Avoid mixing unrelated updates
state.$update({
  userTheme: 'dark',
  cartTotal: 99.99,
  notificationCount: 5
  // These aren't related!
});
```

---

### 5. Use with Async Operations

```javascript
async function loadData() {
  state.$update({
    loading: true,
    '#content': 'Loading...'
  });
  
  const data = await fetchData();
  
  state.$update({
    loading: false,
    data: data,
    '#content': renderData(data)
  });
}
```

---

## Summary

### What `$update()` Does:

1. ✅ Updates both state and DOM in one call
2. ✅ Method on reactive state objects
3. ✅ Automatic detection (state vs DOM)
4. ✅ Batches all updates for performance
5. ✅ Supports nested properties and selectors
6. ✅ Same as `ReactiveUtils.updateAll()` but more convenient

### When to Use It:

- Quick state and DOM synchronization
- Form submissions and status updates
- Loading states
- Real-time data updates
- When you want convenience over separation

### The Basic Pattern:

```javascript
state.$update({
  // State properties (no special prefix)
  propertyName: value,
  'nested.property': value,
  
  // DOM by ID (starts with #)
  '#element-id': value,
  
  // DOM by class (starts with .)
  '.class-name': value,
  
  // Multiple element properties
  '#element': {
    textContent: 'text',
    disabled: false
  }
});
```

### Quick Reference:

```javascript
// State only
state.$update({ count: 5 });

// DOM only
state.$update({ '#counter': 5 });

// Both
state.$update({
  count: 5,
  '#counter': 5
});

// Complex
state.$update({
  count: 5,
  '#counter': { textContent: 5, className: 'active' }
});
```

**Remember:** `$update()` is your all-in-one updater method - one call to update both your data and your display. Smart detection, automatic batching, maximum convenience! 🎉