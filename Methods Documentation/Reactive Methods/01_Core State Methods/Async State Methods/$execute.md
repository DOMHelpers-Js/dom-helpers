# Understanding `$execute()` - A Beginner's Guide

## What is `$execute()`?

`$execute()` is a method for async state that executes an async function and automatically tracks loading, error, and data states. It's used with async states created by `async()` or `asyncState()`.

Think of it as **async executor** - you pass it a function to run, and it handles all the state management automatically.

---

## Why Does This Exist?

### The Problem: Manual Async State Management

Without `$execute()`, you manually manage loading/error states:

```javascript
// ❌ Manual - tedious
const state = ReactiveUtils.state({
  data: null,
  loading: false,
  error: null
});

async function loadData() {
  state.loading = true;
  state.error = null;
  try {
    const response = await fetch('/api/data');
    state.data = await response.json();
  } catch (err) {
    state.error = err;
  } finally {
    state.loading = false;
  }
}

// ✅ With async() and $execute() - automatic
const state = ReactiveUtils.async(null);

state.$execute(async () => {
  const response = await fetch('/api/data');
  return response.json();
}); // Automatically manages loading/error/data
```

**Why this matters:**
- Automatic loading state
- Automatic error handling
- Cleaner code
- Less boilerplate
- Consistent pattern

---

## How Does It Work?

### The Async Flow

```javascript
const state = ReactiveUtils.async(null);

state.$execute(async () => { ... })
    ↓
Sets loading = true, error = null
    ↓
Runs your async function
    ↓
Success? → Sets data = result, loading = false
Error?   → Sets error = e, loading = false, throws error
```

---

## Basic Usage

### Simple Async Call

```javascript
// 1. Create async state with initial value
const userLoader = ReactiveUtils.async(null);

// 2. Execute by passing an async function
await userLoader.$execute(async () => {
  const response = await fetch('/api/user');
  return response.json();
});

console.log(userLoader.loading); // false
console.log(userLoader.data);    // User data
console.log(userLoader.error);   // null
```

### With Parameters (Using Closures)

```javascript
const userLoader = ReactiveUtils.async(null);

// Execute with parameter via closure
const userId = 123;
await userLoader.$execute(async () => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
});

console.log(userLoader.data); // User 123 data
```

### Multiple Executions

```javascript
const search = ReactiveUtils.async(null);

// First search
await search.$execute(async () => {
  const response = await fetch(`/api/search?q=react`);
  return response.json();
});
console.log(search.data); // React results

// Second search
await search.$execute(async () => {
  const response = await fetch(`/api/search?q=vue`);
  return response.json();
});
console.log(search.data); // Vue results
```

---

## Simple Examples Explained

### Example 1: User Profile Loader

```javascript
const profile = ReactiveUtils.async(null);

// Show loading state
ReactiveUtils.effect(() => {
  const display = document.getElementById('profile');

  if (profile.loading) {
    display.innerHTML = '<p>Loading...</p>';
  } else if (profile.error) {
    display.innerHTML = `<p class="error">${profile.error.message}</p>`;
  } else if (profile.data) {
    display.innerHTML = `
      <h2>${profile.data.name}</h2>
      <p>${profile.data.email}</p>
    `;
  }
});

// Load user
document.getElementById('load-btn').onclick = async () => {
  const userId = 123;
  
  try {
    await profile.$execute(async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('User not found');
      return response.json();
    });
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
};
```

---

### Example 2: Search with Debounce

```javascript
const searchResults = ReactiveUtils.async(null);

let searchTimeout;

document.getElementById('search').oninput = (e) => {
  const query = e.target.value;

  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    if (query.length >= 3) {
      await searchResults.$execute(async () => {
        const response = await fetch(`/api/search?q=${query}`);
        return response.json();
      });
    }
  }, 300);
};

// Display results
ReactiveUtils.effect(() => {
  const resultsDiv = document.getElementById('results');

  if (searchResults.loading) {
    resultsDiv.innerHTML = '<p>Searching...</p>';
  } else if (searchResults.data) {
    resultsDiv.innerHTML = searchResults.data
      .map(item => `<div>${item.title}</div>`)
      .join('');
  }
});
```

---

### Example 3: Form Submission

```javascript
const formSubmitter = ReactiveUtils.async(null);

document.getElementById('contact-form').onsubmit = async (e) => {
  e.preventDefault();

  const formData = {
    name: e.target.name.value,
    email: e.target.email.value,
    message: e.target.message.value
  };

  try {
    await formSubmitter.$execute(async () => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      return response.json();
    });

    alert('Submitted successfully!');
    e.target.reset();
  } catch (error) {
    alert('Failed to submit: ' + error.message);
  }
};

// Disable submit while loading
ReactiveUtils.effect(() => {
  document.getElementById('submit-btn').disabled = formSubmitter.loading;
});
```

---

## Real-World Example: Product Catalog

```javascript
const products = ReactiveUtils.async([]);

const filters = ReactiveUtils.state({
  category: 'all',
  minPrice: 0,
  maxPrice: 1000,
  sortBy: 'name'
});

// Load products when filters change
ReactiveUtils.effect(() => {
  // Capture current filter values
  const currentFilters = {
    category: filters.category,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sortBy: filters.sortBy
  };

  products.$execute(async () => {
    const params = new URLSearchParams(currentFilters);
    const response = await fetch(`/api/products?${params}`);
    return response.json();
  });
});

// Display products
ReactiveUtils.effect(() => {
  const container = document.getElementById('products');

  if (products.loading) {
    container.innerHTML = '<div class="loading">Loading products...</div>';
    return;
  }

  if (products.error) {
    container.innerHTML = `<div class="error">Error: ${products.error.message}</div>`;
    return;
  }

  if (products.data && products.data.length > 0) {
    container.innerHTML = products.data
      .map(p => `
        <div class="product">
          <h3>${p.name}</h3>
          <p>$${p.price}</p>
          <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      `)
      .join('');
  } else {
    container.innerHTML = '<p>No products found</p>';
  }
});

// Filter controls
document.getElementById('category').onchange = (e) => {
  filters.category = e.target.value;
};

document.getElementById('sort').onchange = (e) => {
  filters.sortBy = e.target.value;
};
```

---

## Common Patterns

### Pattern 1: Simple Execute

```javascript
await state.$execute(async () => {
  const res = await fetch('/api/data');
  return res.json();
});
```

### Pattern 2: Execute with Parameters (via Closures)

```javascript
const userId = 123;
const userData = await state.$execute(async () => {
  const res = await fetch(`/api/users/${userId}`);
  return res.json();
});
```

### Pattern 3: Execute on Event

```javascript
button.onclick = () => {
  state.$execute(async () => {
    const res = await fetch('/api/data');
    return res.json();
  });
};
```

### Pattern 4: Check Result and Handle Errors

```javascript
try {
  await state.$execute(async () => {
    const res = await fetch('/api/data');
    return res.json();
  });
  console.log('Success:', state.data);
} catch (error) {
  console.error('Error:', state.error);
}
```

### Pattern 5: Using the Returned Value

```javascript
const result = await state.$execute(async () => {
  const res = await fetch('/api/data');
  return res.json();
});

console.log('Immediate result:', result);
console.log('State data:', state.data); // Same as result
```

---

## Common Questions

### Q: Can I call `$execute()` multiple times?

**Answer:** Yes! Each call runs a new async function:

```javascript
await state.$execute(async () => {
  return fetch('/api/data/1').then(r => r.json());
});

await state.$execute(async () => {
  return fetch('/api/data/2').then(r => r.json());
});
```

### Q: Does it cancel previous executions?

**Answer:** No, all run independently. You need to handle cancellation yourself:

```javascript
let currentRequest = 0;

async function loadData(query) {
  const requestId = ++currentRequest;

  await state.$execute(async () => {
    const res = await fetch(`/api/search?q=${query}`);
    const data = await res.json();
    
    // Check if this is still the latest request
    if (requestId !== currentRequest) {
      throw new Error('Request cancelled');
    }
    
    return data;
  });
}
```

### Q: Can I await it?

**Answer:** Yes! It returns a promise:

```javascript
const result = await state.$execute(async () => {
  return fetch('/api/data').then(r => r.json());
});

console.log('Done!', result);
```

### Q: How do I pass parameters to my async function?

**Answer:** Use closures to capture variables:

```javascript
const userId = 123;
const sortBy = 'name';

await state.$execute(async () => {
  // userId and sortBy are available via closure
  const res = await fetch(`/api/users/${userId}?sort=${sortBy}`);
  return res.json();
});
```

### Q: What if my function throws an error?

**Answer:** The error is caught, stored in `state.error`, and re-thrown:

```javascript
try {
  await state.$execute(async () => {
    throw new Error('Something failed');
  });
} catch (error) {
  console.log(state.error); // Error: Something failed
  console.log(error);       // Same error
}
```

---

## Understanding Async State Properties

### `data` - The Result

```javascript
const state = ReactiveUtils.async(null);

await state.$execute(async () => {
  return { name: 'John', age: 30 };
});

console.log(state.data); // { name: 'John', age: 30 }
```

### `loading` - Loading State

```javascript
console.log(state.loading); // false

const promise = state.$execute(async () => {
  await new Promise(r => setTimeout(r, 1000));
  return 'done';
});

console.log(state.loading); // true

await promise;
console.log(state.loading); // false
```

### `error` - Error State

```javascript
try {
  await state.$execute(async () => {
    throw new Error('Failed!');
  });
} catch (e) {
  console.log(state.error); // Error: Failed!
  console.log(state.error.message); // 'Failed!'
}
```

### `isSuccess` - Computed Property

```javascript
// After successful execution
await state.$execute(async () => 'success');
console.log(state.isSuccess); // true (data !== null, !loading, !error)

// After error
try {
  await state.$execute(async () => { throw new Error('fail'); });
} catch (e) {}
console.log(state.isSuccess); // false (has error)
```

### `isError` - Computed Property

```javascript
// After successful execution
await state.$execute(async () => 'success');
console.log(state.isError); // false

// After error
try {
  await state.$execute(async () => { throw new Error('fail'); });
} catch (e) {}
console.log(state.isError); // true (!loading && error !== null)
```

---

## The `$reset()` Method

Reset async state back to initial values:

```javascript
const state = ReactiveUtils.async(null);

await state.$execute(async () => 'data');
console.log(state.data);    // 'data'
console.log(state.loading); // false

state.$reset();
console.log(state.data);    // null (back to initial value)
console.log(state.loading); // false
console.log(state.error);   // null
```

---

## Tips for Success

### 1. Always Check Loading State

```javascript
// ✅ Show loading indicator
ReactiveUtils.effect(() => {
  const loader = document.getElementById('loader');
  loader.style.display = state.loading ? 'block' : 'none';
});
```

### 2. Handle Errors Properly

```javascript
// ✅ Try-catch for error handling
try {
  await state.$execute(async () => {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error('API Error');
    return res.json();
  });
} catch (error) {
  console.error('Failed:', error);
  // state.error is also set
}
```

### 3. Use Effects for Auto-Loading

```javascript
// ✅ Auto-reload when dependency changes
const userId = ReactiveUtils.ref(1);

ReactiveUtils.effect(() => {
  const id = userId.value;
  
  state.$execute(async () => {
    const res = await fetch(`/api/users/${id}`);
    return res.json();
  });
});

// Changing userId triggers reload
userId.value = 2; // Automatically fetches new user
```

### 4. Capture Variables in Closures

```javascript
// ✅ Capture variables before async operation
function loadUser(id) {
  const capturedId = id; // Capture current value
  
  return state.$execute(async () => {
    const res = await fetch(`/api/users/${capturedId}`);
    return res.json();
  });
}
```

### 5. Use Computed Properties

```javascript
// ✅ Use isSuccess and isError
ReactiveUtils.effect(() => {
  if (state.isSuccess) {
    console.log('Data loaded successfully:', state.data);
  }
  
  if (state.isError) {
    console.error('Failed to load:', state.error);
  }
});
```

---

## Complete Real-World Example: Todo App

```javascript
// Create async states
const todos = ReactiveUtils.async([]);
const saveTodo = ReactiveUtils.async(null);

// Load todos on startup
async function loadTodos() {
  await todos.$execute(async () => {
    const response = await fetch('/api/todos');
    return response.json();
  });
}

// Add new todo
async function addTodo(text) {
  await saveTodo.$execute(async () => {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, completed: false })
    });
    
    if (!response.ok) throw new Error('Failed to save');
    return response.json();
  });
  
  // Reload todos after saving
  if (saveTodo.isSuccess) {
    await loadTodos();
  }
}

// Display todos
ReactiveUtils.effect(() => {
  const container = document.getElementById('todos');
  
  if (todos.loading) {
    container.innerHTML = '<div class="loading">Loading todos...</div>';
    return;
  }
  
  if (todos.error) {
    container.innerHTML = `<div class="error">Error: ${todos.error.message}</div>`;
    return;
  }
  
  if (todos.data && todos.data.length > 0) {
    container.innerHTML = todos.data
      .map(todo => `
        <div class="todo ${todo.completed ? 'completed' : ''}">
          <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                 onchange="toggleTodo(${todo.id})">
          <span>${todo.text}</span>
        </div>
      `)
      .join('');
  } else {
    container.innerHTML = '<p>No todos yet</p>';
  }
});

// Form submission
document.getElementById('todo-form').onsubmit = async (e) => {
  e.preventDefault();
  const input = e.target.todo;
  
  if (input.value.trim()) {
    await addTodo(input.value.trim());
    
    if (saveTodo.isSuccess) {
      input.value = '';
    } else {
      alert('Failed to add todo');
    }
  }
};

// Disable submit button while saving
ReactiveUtils.effect(() => {
  document.getElementById('submit-btn').disabled = 
    saveTodo.loading || todos.loading;
});

// Initial load
loadTodos();
```

---

## Summary

### What `$execute()` Does:

1. ✅ Takes an **async function** as parameter
2. ✅ Sets `loading = true`, `error = null`
3. ✅ Runs your async function
4. ✅ On success: sets `data = result`, `loading = false`
5. ✅ On error: sets `error = e`, `loading = false`, re-throws error
6. ✅ Returns promise with the result

### When to Use It:

- API calls
- Data fetching
- Form submission
- Any async operation
- When you need automatic loading/error states

### The Basic Pattern:

```javascript
// 1. Create async state
const state = ReactiveUtils.async(null);

// 2. Execute with async function
await state.$execute(async () => {
  const res = await fetch('/api/data');
  return res.json();
});

// 3. Check results
if (state.error) {
  console.error(state.error);
} else {
  console.log(state.data);
}
```

### Key Differences from Other Libraries:

- ❌ **NOT** `$execute(data)` - passing data directly
- ✅ **YES** `$execute(async () => getData())` - passing async function
- Use closures to pass parameters to your function

---

**Remember:** `$execute()` takes a **function to run**, not data to pass. It automatically manages loading, error, and data states. Perfect for async operations! 🎉