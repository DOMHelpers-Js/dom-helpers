# Understanding `asyncState()` - A Beginner's Guide

## What is `asyncState()`?

`asyncState()` (also called `async()`) is a **specialized state function** in the Reactive library designed specifically for managing **asynchronous operations**. It automatically handles loading states, error states, and data states - the three core aspects of any async operation.

Think of it as **a smart container for async data** - it tracks whether data is loading, if an error occurred, and what the actual data is, all with reactive properties that update your UI automatically.

---

## Syntax

```js
// Using the shortcut
asyncState(initialValue)

// Using the full namespace
ReactiveUtils.async(initialValue)
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`asyncState()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.async()`) - Explicit and clear

**Parameters:**
- `initialValue` (Any, optional): The initial value for the data (defaults to `null`)

**Returns:**
- A reactive state object with:
  - `data` - The actual data (initially `initialValue`)
  - `loading` - Boolean indicating if operation is in progress
  - `error` - Error object if operation failed, `null` otherwise
  - `isSuccess` - Computed: `true` if data loaded successfully
  - `isError` - Computed: `true` if an error occurred
  - `$execute(fn)` - Method to execute an async function
  - `$reset()` - Method to reset to initial state

---

## Why Does This Exist?

### The Problem with Manual Async State Management

When fetching data from an API, you need to track multiple states manually:

```javascript
// Manual async state management - verbose and error-prone
const state = state({
  data: null,
  loading: false,
  error: null
});

async function fetchUsers() {
  // Set loading
  state.loading = true;
  state.error = null;

  try {
    const response = await fetch('/api/users');
    const data = await response.json();
    // Set data
    state.data = data;
  } catch (e) {
    // Set error
    state.error = e;
  } finally {
    // Clear loading
    state.loading = false;
  }
}

// Check state manually
if (state.loading) {
  console.log('Loading...');
} else if (state.error) {
  console.log('Error:', state.error);
} else if (state.data) {
  console.log('Success:', state.data);
}

// Too much boilerplate for a common pattern!
```

**What's the Real Issue?**

**Problems:**
- Must manually create `data`, `loading`, and `error` properties every time
- Must manually set `loading = true` at the start
- Must manually handle errors with try/catch
- Must manually set `loading = false` in finally
- Must manually check success/error states
- Easy to forget steps or make mistakes
- Lots of repetitive boilerplate code

**Why This Becomes a Problem:**

For every async operation:
❌ Same boilerplate code repeated everywhere
❌ Easy to forget to set loading states
❌ Easy to forget error handling
❌ No standard pattern for checking success/error
❌ Verbose and error-prone

In other words, **async operations require too much manual state management**.
There should be a standard, automated way to handle async states.

---

### The Solution with `asyncState()`

When you use `asyncState()`, all the boilerplate is handled automatically:

```javascript
// Automatic async state management - clean and simple
const users = asyncState(null);

// Execute async operation
await users.$execute(async () => {
  const response = await fetch('/api/users');
  return await response.json();
});

// State is managed automatically!
// - users.loading is automatically true while fetching
// - users.data is automatically set on success
// - users.error is automatically set on failure
// - users.loading is automatically false when done

// Check state easily
if (users.loading) {
  console.log('Loading...');
} else if (users.isError) {
  console.log('Error:', users.error);
} else if (users.isSuccess) {
  console.log('Success:', users.data);
}

// Clean, standardized, and automatic!
```

**What Just Happened?**

With `asyncState()`:
- `loading`, `error`, and `data` properties created automatically
- `$execute()` method handles the entire async flow
- Loading state set automatically
- Errors caught and stored automatically
- Data stored automatically on success
- Computed properties `isSuccess` and `isError` for easy checks

**Benefits:**
- No boilerplate code
- Automatic state management
- Built-in error handling
- Standard async pattern
- Less code, fewer bugs
- Reactive properties for UI updates

---

## How Does It Work?

### Under the Hood

`asyncState()` creates a reactive state with automatic async handling:

```
asyncState(initialValue)
        ↓
Creates reactive state with:
  - data: initialValue
  - loading: false
  - error: null
  - isSuccess (computed)
  - isError (computed)
  - $execute(fn) method
  - $reset() method
        ↓
When you call $execute(fn):
  1. Sets loading = true
  2. Sets error = null
  3. Calls your async function
  4. If success: Sets data = result
  5. If error: Sets error = exception
  6. Finally: Sets loading = false
        ↓
Your UI updates automatically!
```

**What happens:**

1. Creates reactive state with `data`, `loading`, `error`
2. Adds computed properties `isSuccess` and `isError`
3. Provides `$execute()` method that:
   - Sets loading state before execution
   - Clears previous errors
   - Executes your async function
   - Stores the result in `data` on success
   - Stores the error in `error` on failure
   - Clears loading state when complete
4. Provides `$reset()` to clear everything

---

## Basic Usage

### Creating Async State

The simplest way to use `asyncState()`:

```js
// Using the shortcut style
const users = asyncState(null);

// Or using the namespace style
const users = ReactiveUtils.async(null);

// Or with an initial value
const users = asyncState([]);

console.log(users.data);    // null (or [])
console.log(users.loading); // false
console.log(users.error);   // null
```

### Executing Async Operations

Use `$execute()` to run async functions:

```js
const users = asyncState(null);

// Execute an async operation
await users.$execute(async () => {
  const response = await fetch('/api/users');
  return await response.json();
});

// After execution:
console.log(users.data);    // The fetched users
console.log(users.loading); // false
console.log(users.isSuccess); // true
```

### Handling Errors

Errors are caught automatically:

```js
const users = asyncState(null);

await users.$execute(async () => {
  throw new Error('Network error!');
});

// After execution:
console.log(users.data);    // null
console.log(users.error);   // Error: Network error!
console.log(users.isError); // true
```

### Resetting State

Reset to initial state:

```js
const users = asyncState(null);

await users.$execute(async () => {
  return ['Alice', 'Bob'];
});

console.log(users.data); // ['Alice', 'Bob']

users.$reset();

console.log(users.data);    // null (back to initial)
console.log(users.loading); // false
console.log(users.error);   // null
```

### Reactive UI Updates

Combine with effects for automatic UI updates:

```js
const users = asyncState(null);

effect(() => {
  if (users.loading) {
    document.getElementById('status').textContent = 'Loading...';
  } else if (users.isError) {
    document.getElementById('status').textContent = 'Error: ' + users.error.message;
  } else if (users.isSuccess) {
    document.getElementById('status').textContent = 'Loaded ' + users.data.length + ' users';
  }
});

// Start loading
await users.$execute(async () => {
  const response = await fetch('/api/users');
  return await response.json();
});
// UI updates automatically!
```

---

## Common Use Cases

### Use Case 1: Fetching API Data

Load data from an API:

```js
const posts = asyncState([]);

// Bind to UI
effect(() => {
  const container = document.getElementById('posts');

  if (posts.loading) {
    container.innerHTML = '<p>Loading posts...</p>';
  } else if (posts.isError) {
    container.innerHTML = `<p class="error">Error: ${posts.error.message}</p>`;
  } else if (posts.isSuccess) {
    container.innerHTML = posts.data.map(post => `
      <div class="post">
        <h3>${post.title}</h3>
        <p>${post.body}</p>
      </div>
    `).join('');
  }
});

// Fetch posts
async function fetchPosts() {
  await posts.$execute(async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  });
}

fetchPosts();
```

### Use Case 2: Form Submission

Handle form submission with loading state:

```js
const submitState = asyncState(null);

async function handleSubmit(formData) {
  await submitState.$execute(async () => {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error('Submission failed');
    }

    return await response.json();
  });

  if (submitState.isSuccess) {
    alert('Form submitted successfully!');
  }
}

// Bind submit button
effect(() => {
  const button = document.getElementById('submit');
  button.disabled = submitState.loading;
  button.textContent = submitState.loading ? 'Submitting...' : 'Submit';
});
```

### Use Case 3: User Authentication

Manage login state:

```js
const loginState = asyncState(null);

async function login(username, password) {
  await loginState.$execute(async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    return await response.json();
  });

  if (loginState.isSuccess) {
    console.log('Logged in:', loginState.data);
    // Store token, redirect, etc.
  }
}

// UI binding
effect(() => {
  const loginBtn = document.getElementById('loginBtn');
  const errorMsg = document.getElementById('errorMsg');

  loginBtn.disabled = loginState.loading;
  loginBtn.textContent = loginState.loading ? 'Logging in...' : 'Login';

  if (loginState.isError) {
    errorMsg.textContent = loginState.error.message;
    errorMsg.style.display = 'block';
  } else {
    errorMsg.style.display = 'none';
  }
});
```

### Use Case 4: Image Upload

Handle file upload with progress:

```js
const uploadState = asyncState(null);

async function uploadFile(file) {
  await uploadState.$execute(async () => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return await response.json();
  });

  if (uploadState.isSuccess) {
    console.log('Upload complete:', uploadState.data.url);
  }
}

// UI binding
effect(() => {
  const status = document.getElementById('uploadStatus');

  if (uploadState.loading) {
    status.textContent = 'Uploading...';
    status.className = 'loading';
  } else if (uploadState.isError) {
    status.textContent = 'Upload failed: ' + uploadState.error.message;
    status.className = 'error';
  } else if (uploadState.isSuccess) {
    status.textContent = 'Upload complete!';
    status.className = 'success';
  }
});
```

### Use Case 5: Search with Debouncing

Search with automatic loading states:

```js
const searchState = asyncState([]);
let searchTimeout;

async function search(query) {
  // Debounce
  clearTimeout(searchTimeout);

  if (!query.trim()) {
    searchState.$reset();
    return;
  }

  searchTimeout = setTimeout(async () => {
    await searchState.$execute(async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      return await response.json();
    });
  }, 300);
}

// UI binding
effect(() => {
  const results = document.getElementById('results');

  if (searchState.loading) {
    results.innerHTML = '<div class="spinner">Searching...</div>';
  } else if (searchState.isError) {
    results.innerHTML = `<div class="error">Search failed</div>`;
  } else if (searchState.isSuccess) {
    if (searchState.data.length === 0) {
      results.innerHTML = '<div>No results found</div>';
    } else {
      results.innerHTML = searchState.data.map(item => `
        <div class="result">${item.title}</div>
      `).join('');
    }
  }
});

// Bind to input
document.getElementById('searchInput').oninput = (e) => {
  search(e.target.value);
};
```

---

## Advanced Patterns

### Pattern 1: Multiple Async States

Manage multiple async operations:

```js
const users = asyncState([]);
const posts = asyncState([]);
const comments = asyncState([]);

async function loadAll() {
  await Promise.all([
    users.$execute(() => fetch('/api/users').then(r => r.json())),
    posts.$execute(() => fetch('/api/posts').then(r => r.json())),
    comments.$execute(() => fetch('/api/comments').then(r => r.json()))
  ]);

  if (users.isSuccess && posts.isSuccess && comments.isSuccess) {
    console.log('All data loaded!');
  }
}
```

### Pattern 2: Retry Logic

Add retry functionality:

```js
const data = asyncState(null);

async function fetchWithRetry(maxRetries = 3) {
  let attempts = 0;

  while (attempts < maxRetries) {
    await data.$execute(async () => {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed');
      return await response.json();
    });

    if (data.isSuccess) {
      return;
    }

    attempts++;
    console.log(`Retry ${attempts}/${maxRetries}`);
    await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
  }

  console.error('Max retries reached');
}
```

### Pattern 3: Polling

Poll for updates:

```js
const liveData = asyncState(null);
let pollingInterval;

function startPolling(intervalMs = 5000) {
  // Initial fetch
  fetchData();

  // Poll
  pollingInterval = setInterval(() => {
    fetchData();
  }, intervalMs);
}

function stopPolling() {
  clearInterval(pollingInterval);
}

async function fetchData() {
  await liveData.$execute(async () => {
    const response = await fetch('/api/live-data');
    return await response.json();
  });
}

// Start polling
startPolling(5000);

// Stop when done
// stopPolling();
```

### Pattern 4: Dependent Requests

Chain async operations:

```js
const user = asyncState(null);
const userPosts = asyncState([]);

async function loadUserAndPosts(userId) {
  // First, load user
  await user.$execute(async () => {
    const response = await fetch(`/api/users/${userId}`);
    return await response.json();
  });

  // Then, load their posts
  if (user.isSuccess) {
    await userPosts.$execute(async () => {
      const response = await fetch(`/api/users/${userId}/posts`);
      return await response.json();
    });
  }
}
```

---

## Performance Tips

### Tip 1: Reuse AsyncState Objects

Don't create new async states for every request:

```js
// Good - reuse
const userData = asyncState(null);

async function loadUser(id) {
  await userData.$execute(() => fetchUser(id));
}

// Call multiple times with same state
loadUser(1);
// later...
loadUser(2);
```

### Tip 2: Use $reset() When Appropriate

Clear old data before new requests:

```js
const searchResults = asyncState([]);

async function search(query) {
  searchResults.$reset(); // Clear old results
  await searchResults.$execute(() => fetchSearch(query));
}
```

### Tip 3: Combine with Computed

Use computed for derived values:

```js
const users = asyncState([]);

// Add computed property
users.$computed('count', function() {
  return this.data ? this.data.length : 0;
});

effect(() => {
  console.log('User count:', users.count);
});
```

---

## Common Pitfalls

### Pitfall 1: Forgetting await

**Problem:** Not awaiting `$execute()`:

```js
// WRONG - not awaited
users.$execute(async () => {
  return await fetch('/api/users').then(r => r.json());
});
console.log(users.data); // Still null!

// RIGHT - awaited
await users.$execute(async () => {
  return await fetch('/api/users').then(r => r.json());
});
console.log(users.data); // Has data
```

### Pitfall 2: Not Returning from $execute

**Problem:** Forgetting to return the result:

```js
// WRONG - no return
await users.$execute(async () => {
  const data = await fetch('/api/users').then(r => r.json());
  // Forgot to return!
});
console.log(users.data); // undefined

// RIGHT - return the data
await users.$execute(async () => {
  const data = await fetch('/api/users').then(r => r.json());
  return data; // Return it!
});
console.log(users.data); // Has data
```

### Pitfall 3: Modifying State Directly

**Problem:** Setting data/loading/error directly:

```js
// WRONG - don't modify directly
users.data = someData;
users.loading = true;

// RIGHT - use $execute or $reset
await users.$execute(async () => {
  return someData;
});
```

### Pitfall 4: Not Handling Errors

**Problem:** Assuming success without checking:

```js
// BAD - might fail
await users.$execute(fetchUsers);
const firstUser = users.data[0]; // Error if users.data is null!

// GOOD - check state
await users.$execute(fetchUsers);
if (users.isSuccess) {
  const firstUser = users.data[0]; // Safe
}
```

---

## Real-World Example

Here's a complete example using `asyncState()`:

```js
// Create async state for a user dashboard
const userProfile = asyncState(null);
const userPosts = asyncState([]);
const userStats = asyncState(null);

// UI bindings
effect(() => {
  const profileSection = document.getElementById('profile');

  if (userProfile.loading) {
    profileSection.innerHTML = '<div class="spinner">Loading profile...</div>';
  } else if (userProfile.isError) {
    profileSection.innerHTML = `
      <div class="error">
        <p>Failed to load profile: ${userProfile.error.message}</p>
        <button onclick="retryLoadProfile()">Retry</button>
      </div>
    `;
  } else if (userProfile.isSuccess) {
    const user = userProfile.data;
    profileSection.innerHTML = `
      <div class="profile">
        <img src="${user.avatar}" alt="${user.name}">
        <h2>${user.name}</h2>
        <p>${user.email}</p>
        <p>Member since: ${new Date(user.joinedAt).toLocaleDateString()}</p>
      </div>
    `;
  }
});

effect(() => {
  const postsSection = document.getElementById('posts');

  if (userPosts.loading) {
    postsSection.innerHTML = '<div class="spinner">Loading posts...</div>';
  } else if (userPosts.isError) {
    postsSection.innerHTML = '<div class="error">Failed to load posts</div>';
  } else if (userPosts.isSuccess) {
    if (userPosts.data.length === 0) {
      postsSection.innerHTML = '<p>No posts yet</p>';
    } else {
      postsSection.innerHTML = userPosts.data.map(post => `
        <article class="post">
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <footer>
            <span>${post.likes} likes</span>
            <span>${post.comments} comments</span>
          </footer>
        </article>
      `).join('');
    }
  }
});

effect(() => {
  const statsSection = document.getElementById('stats');

  if (userStats.isSuccess) {
    const stats = userStats.data;
    statsSection.innerHTML = `
      <div class="stats">
        <div class="stat">
          <span class="label">Posts</span>
          <span class="value">${stats.totalPosts}</span>
        </div>
        <div class="stat">
          <span class="label">Followers</span>
          <span class="value">${stats.followers}</span>
        </div>
        <div class="stat">
          <span class="label">Following</span>
          <span class="value">${stats.following}</span>
        </div>
      </div>
    `;
  }
});

// Load all user data
async function loadUserDashboard(userId) {
  // Load profile, posts, and stats in parallel
  await Promise.all([
    userProfile.$execute(async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      return await response.json();
    }),

    userPosts.$execute(async () => {
      const response = await fetch(`/api/users/${userId}/posts`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      return await response.json();
    }),

    userStats.$execute(async () => {
      const response = await fetch(`/api/users/${userId}/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    })
  ]);

  console.log('Dashboard loaded');
}

// Retry function
async function retryLoadProfile() {
  const userId = new URLSearchParams(window.location.search).get('user');
  await userProfile.$execute(async () => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
  });
}

// Refresh posts
async function refreshPosts() {
  const userId = userProfile.data?.id;
  if (!userId) return;

  await userPosts.$execute(async () => {
    const response = await fetch(`/api/users/${userId}/posts`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return await response.json();
  });
}

// Initialize dashboard
const userId = new URLSearchParams(window.location.search).get('user') || '1';
loadUserDashboard(userId);

// Refresh posts every 30 seconds
setInterval(refreshPosts, 30000);
```

---

## Summary

**`asyncState()` provides automatic state management for async operations.**

Key takeaways:
- ✅ **Automatic async state management** - no boilerplate
- ✅ Both **shortcut** (`asyncState()`) and **namespace** (`ReactiveUtils.async()`) styles are valid
- ✅ Provides `data`, `loading`, and `error` properties automatically
- ✅ **Computed properties** `isSuccess` and `isError` for easy checks
- ✅ **$execute(fn)** method handles entire async flow automatically
- ✅ **$reset()** method to clear state
- ✅ Perfect for **API calls**, **form submissions**, and **any async operation**
- ✅ Integrates seamlessly with **effects** for reactive UI updates
- ⚠️ Always **return** the result from your async function
- ⚠️ **Check state** before accessing data (use `isSuccess`)

**Remember:** `asyncState()` eliminates async boilerplate and provides a standard pattern for handling loading states, errors, and data. It's the perfect tool for any async operation in your reactive application! 🎉

➡️ Next, explore [`component()`](component.md) for component-based async management or [`store()`](store.md) for organized state with async actions!
