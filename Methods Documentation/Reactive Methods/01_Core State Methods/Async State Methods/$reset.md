# Understanding `$reset()` - A Beginner's Guide

## What is `$reset()`?

`$reset()` is a method that resets an async state back to its initial configuration. It restores the `data` to its initial value, clears any errors, and sets loading to false.

Think of it as **the reset button** - it returns everything to how it was when you first created the async state.

---

## Why Does This Exist?

### The Problem: Manually Clearing State

Without `$reset()`, you'd need to manually clear each property:

```javascript
// ❌ Manual - tedious and error-prone
const state = ReactiveUtils.async([]);

// After loading data...
state.data = [];      // Remember the initial value!
state.error = null;
state.loading = false;

// ✅ With $reset() - one call
state.$reset();
```

**Why this matters:**
- Reset everything in one call
- No need to remember initial values
- Consistent behavior
- Less code
- Can't forget to clear a property

---

## How Does It Work?

### The Reset Process

```javascript
const state = ReactiveUtils.async(initialValue);

state.$reset()
    ↓
Sets data = initialValue
Sets error = null
Sets loading = false
    ↓
Everything back to initial state
```

**Important:** The `data` is reset to whatever **initial value** you passed when creating the async state, not always to `null`.

---

## Basic Usage

### Reset to Null

```javascript
// Create with null as initial value
const userLoader = ReactiveUtils.async(null);

// Load data
await userLoader.$execute(async () => {
  const response = await fetch('/api/user');
  return response.json();
});
console.log(userLoader.data); // { id: 1, name: 'John' }

// Reset back to null
userLoader.$reset();
console.log(userLoader.data);    // null (initial value)
console.log(userLoader.error);   // null
console.log(userLoader.loading); // false
```

### Reset to Empty Array

```javascript
// Create with empty array as initial value
const items = ReactiveUtils.async([]);

// Load items
await items.$execute(async () => {
  const response = await fetch('/api/items');
  return response.json();
});
console.log(items.data); // [item1, item2, item3]

// Reset back to empty array
items.$reset();
console.log(items.data); // [] (initial value)
```

### Reset to Empty Object

```javascript
// Create with empty object as initial value
const config = ReactiveUtils.async({});

// Load config
await config.$execute(async () => {
  const response = await fetch('/api/config');
  return response.json();
});
console.log(config.data); // { theme: 'dark', lang: 'en' }

// Reset back to empty object
config.$reset();
console.log(config.data); // {} (initial value)
```

### Reset After Error

```javascript
const fetcher = ReactiveUtils.async(null);

try {
  await fetcher.$execute(async () => {
    throw new Error('Failed!');
  });
} catch (e) {
  console.log(fetcher.error); // Error: Failed!
  console.log(fetcher.data);  // null
}

// Reset clears the error
fetcher.$reset();
console.log(fetcher.error); // null
console.log(fetcher.data);  // null (initial value)
```

---

## Understanding Initial Values

The initial value determines what `data` becomes after reset:

```javascript
// Example 1: null
const a = ReactiveUtils.async(null);
await a.$execute(async () => 'some data');
a.$reset();
console.log(a.data); // null

// Example 2: empty array
const b = ReactiveUtils.async([]);
await b.$execute(async () => [1, 2, 3]);
b.$reset();
console.log(b.data); // []

// Example 3: default object
const c = ReactiveUtils.async({ status: 'idle' });
await c.$execute(async () => ({ status: 'active', count: 5 }));
c.$reset();
console.log(c.data); // { status: 'idle' }

// Example 4: default number
const d = ReactiveUtils.async(0);
await d.$execute(async () => 42);
d.$reset();
console.log(d.data); // 0
```

---

## Simple Examples Explained

### Example 1: User Profile with Clear Button

```javascript
const profile = ReactiveUtils.async(null);

// Display profile
ReactiveUtils.effect(() => {
  const display = document.getElementById('profile');

  if (profile.loading) {
    display.innerHTML = '<p>Loading...</p>';
  } else if (profile.error) {
    display.innerHTML = `<p class="error">${profile.error.message}</p>`;
  } else if (profile.data) {
    display.innerHTML = `
      <div class="profile">
        <h2>${profile.data.name}</h2>
        <p>${profile.data.email}</p>
        <button onclick="clearProfile()">Clear Profile</button>
      </div>
    `;
  } else {
    display.innerHTML = '<p class="empty">No profile loaded</p>';
  }
});

// Load profile
document.getElementById('load-btn').onclick = async () => {
  const userId = 123;
  
  await profile.$execute(async () => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('User not found');
    return response.json();
  });
};

// Clear profile - resets to null
window.clearProfile = () => {
  profile.$reset();
};
```

**What happens:**
- Initially: `profile.data` is `null`
- After load: `profile.data` has user object
- After reset: `profile.data` is `null` again

---

### Example 2: Search with Clear

```javascript
const searchResults = ReactiveUtils.async([]);

const searchInput = document.getElementById('search');
const clearBtn = document.getElementById('clear-search');

// Search on input
searchInput.oninput = async (e) => {
  const query = e.target.value.trim();

  if (query.length >= 3) {
    await searchResults.$execute(async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      return response.json();
    });
  } else if (query.length === 0) {
    searchResults.$reset(); // Reset to empty array
  }
};

// Clear button
clearBtn.onclick = () => {
  searchInput.value = '';
  searchResults.$reset(); // Reset to empty array
};

// Display results
ReactiveUtils.effect(() => {
  const resultsDiv = document.getElementById('results');

  if (searchResults.loading) {
    resultsDiv.innerHTML = '<p class="spinner">Searching...</p>';
  } else if (searchResults.error) {
    resultsDiv.innerHTML = `<p class="error">Error: ${searchResults.error.message}</p>`;
  } else if (searchResults.data.length > 0) {
    resultsDiv.innerHTML = searchResults.data
      .map(item => `
        <div class="result">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      `)
      .join('');
  } else {
    // Empty array but no error means either initial state or no results
    resultsDiv.innerHTML = searchInput.value 
      ? '<p>No results found</p>' 
      : '';
  }
});
```

**What happens:**
- Initially: `searchResults.data` is `[]`
- After search: `searchResults.data` has results array
- After reset: `searchResults.data` is `[]` again

---

### Example 3: Form Submission with Reset

```javascript
const formSubmitter = ReactiveUtils.async(null);

// Submit form
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

    // Success
    alert('Message sent successfully!');
    e.target.reset();
    
    // Reset after 2 seconds to clear success message
    setTimeout(() => {
      formSubmitter.$reset();
    }, 2000);
    
  } catch (error) {
    alert('Failed to send: ' + error.message);
  }
};

// Show submission status
ReactiveUtils.effect(() => {
  const statusDiv = document.getElementById('status');
  const submitBtn = document.getElementById('submit-btn');

  if (formSubmitter.loading) {
    statusDiv.innerHTML = '<p class="loading">Sending message...</p>';
    statusDiv.className = 'status loading';
    submitBtn.disabled = true;
  } else if (formSubmitter.error) {
    statusDiv.innerHTML = `<p class="error">✗ Error: ${formSubmitter.error.message}</p>`;
    statusDiv.className = 'status error';
    submitBtn.disabled = false;
  } else if (formSubmitter.data) {
    statusDiv.innerHTML = '<p class="success">✓ Message sent successfully!</p>';
    statusDiv.className = 'status success';
    submitBtn.disabled = false;
  } else {
    statusDiv.innerHTML = '';
    statusDiv.className = 'status';
    submitBtn.disabled = false;
  }
});
```

**What happens:**
- Initially: `formSubmitter.data` is `null`
- During submit: `formSubmitter.loading` is `true`
- After success: `formSubmitter.data` has response
- After reset: `formSubmitter.data` is `null` again

---

### Example 4: Image Gallery with Album Selector

```javascript
const gallery = ReactiveUtils.async(null);

const albums = ['nature', 'architecture', 'portraits', 'wildlife'];

// Create album buttons
albums.forEach(albumId => {
  const btn = document.createElement('button');
  btn.textContent = albumId.charAt(0).toUpperCase() + albumId.slice(1);
  btn.className = 'album-btn';
  btn.dataset.album = albumId;
  
  btn.onclick = async () => {
    // Update active state
    document.querySelectorAll('.album-btn').forEach(b => {
      b.classList.remove('active');
    });
    btn.classList.add('active');

    // Load album photos
    await gallery.$execute(async () => {
      const response = await fetch(`/api/albums/${albumId}/photos`);
      if (!response.ok) throw new Error('Failed to load album');
      return response.json();
    });
  };
  
  document.getElementById('albums').appendChild(btn);
});

// Clear gallery button
document.getElementById('clear-gallery').onclick = () => {
  gallery.$reset(); // Reset to null
  
  // Remove active state from all buttons
  document.querySelectorAll('.album-btn').forEach(b => {
    b.classList.remove('active');
  });
};

// Display gallery
ReactiveUtils.effect(() => {
  const container = document.getElementById('gallery');
  const clearBtn = document.getElementById('clear-gallery');

  if (gallery.loading) {
    container.innerHTML = '<div class="loading">Loading photos...</div>';
    clearBtn.style.display = 'none';
  } else if (gallery.error) {
    container.innerHTML = `<div class="error">Error: ${gallery.error.message}</div>`;
    clearBtn.style.display = 'none';
  } else if (gallery.data) {
    container.innerHTML = `
      <div class="gallery-grid">
        ${gallery.data.map(photo => `
          <div class="photo-card">
            <img src="${photo.thumbnailUrl}" alt="${photo.title}">
            <p class="photo-title">${photo.title}</p>
          </div>
        `).join('')}
      </div>
    `;
    clearBtn.style.display = 'block';
  } else {
    container.innerHTML = '<p class="empty-state">Select an album to view photos</p>';
    clearBtn.style.display = 'none';
  }
});
```

**What happens:**
- Initially: `gallery.data` is `null`, shows "Select an album"
- After album load: `gallery.data` has photos array
- After reset: `gallery.data` is `null` again, shows "Select an album"

---

## Real-World Example: Multi-Step Data Loader

```javascript
// Create async states with appropriate initial values
const categories = ReactiveUtils.async([]);
const products = ReactiveUtils.async([]);
const selectedProduct = ReactiveUtils.async(null);

// Load categories on page load
async function loadCategories() {
  await categories.$execute(async () => {
    const response = await fetch('/api/categories');
    return response.json();
  });
}

// Load products for a category
async function loadProducts(categoryId) {
  // Reset products to empty array
  products.$reset();
  
  await products.$execute(async () => {
    const response = await fetch(`/api/categories/${categoryId}/products`);
    return response.json();
  });
}

// Load product details
async function loadProductDetails(productId) {
  // Reset previous product
  selectedProduct.$reset();
  
  await selectedProduct.$execute(async () => {
    const response = await fetch(`/api/products/${productId}`);
    return response.json();
  });
}

// Category selector
ReactiveUtils.effect(() => {
  const select = document.getElementById('category-select');
  
  if (categories.data.length > 0) {
    select.innerHTML = `
      <option value="">Select a category</option>
      ${categories.data.map(cat => 
        `<option value="${cat.id}">${cat.name}</option>`
      ).join('')}
    `;
  }
});

select.onchange = (e) => {
  const categoryId = e.target.value;
  if (categoryId) {
    loadProducts(categoryId);
  } else {
    products.$reset(); // Clear products
    selectedProduct.$reset(); // Clear selected product
  }
};

// Product list
ReactiveUtils.effect(() => {
  const list = document.getElementById('product-list');
  
  if (products.loading) {
    list.innerHTML = '<p>Loading products...</p>';
  } else if (products.data.length > 0) {
    list.innerHTML = products.data.map(product => `
      <div class="product-item" onclick="loadProductDetails(${product.id})">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
      </div>
    `).join('');
  } else if (products.data.length === 0) {
    list.innerHTML = '<p>No products in this category</p>';
  }
});

// Product details
ReactiveUtils.effect(() => {
  const details = document.getElementById('product-details');
  
  if (selectedProduct.loading) {
    details.innerHTML = '<p>Loading details...</p>';
  } else if (selectedProduct.data) {
    details.innerHTML = `
      <div class="product-details">
        <h2>${selectedProduct.data.name}</h2>
        <p class="price">$${selectedProduct.data.price}</p>
        <p class="description">${selectedProduct.data.description}</p>
        <button onclick="selectedProduct.$reset()">Close</button>
      </div>
    `;
  } else {
    details.innerHTML = '';
  }
});

// Initialize
loadCategories();
```

**What happens:**
- Categories reset to `[]`
- Products reset to `[]` when category changes
- Selected product resets to `null` when closed or when category changes

---

## Common Patterns

### Pattern 1: Simple Reset

```javascript
state.$reset();
```

### Pattern 2: Reset Before New Load

```javascript
// Clear old data before loading new
state.$reset();

await state.$execute(async () => {
  // Load new data
});
```

### Pattern 3: Reset on Cancel/Close

```javascript
closeBtn.onclick = () => {
  state.$reset();
};

cancelBtn.onclick = () => {
  state.$reset();
};
```

### Pattern 4: Reset After Success

```javascript
await state.$execute(async () => {
  // Submit data
});

if (state.data && !state.error) {
  // Success - reset after showing message
  setTimeout(() => {
    state.$reset();
  }, 2000);
}
```

### Pattern 5: Conditional Reset

```javascript
// Reset only if has error
if (state.error) {
  state.$reset();
}

// Reset only if has data
if (state.data) {
  state.$reset();
}

// Reset if specific condition
if (shouldClear) {
  state.$reset();
}
```

### Pattern 6: Reset Multiple States

```javascript
// Clear related states together
function clearAll() {
  searchResults.$reset();
  selectedItem.$reset();
  filters.$reset();
}
```

---

## Common Questions

### Q: When should I use `$reset()`?

**Answer:** Use it whenever you want to return the async state to its initial configuration:

```javascript
// Clear search results
searchResults.$reset();

// Clear after form submission
formSubmitter.$reset();

// Clear when closing modal
modal.$reset();

// Clear when navigating away
onRouteChange(() => {
  pageData.$reset();
});

// Clear on logout
onLogout(() => {
  userData.$reset();
  settings.$reset();
});
```

### Q: Does it cancel pending requests?

**Answer:** No, `$reset()` only clears the state. Any ongoing async operation continues:

```javascript
// Start long request
state.$execute(async () => {
  await delay(5000);
  return 'data';
});

// Reset immediately
state.$reset(); // State cleared, but request still running

// When request completes, it will update state again
```

If you need cancellation, you must implement it yourself:

```javascript
let cancelled = false;

const request = state.$execute(async () => {
  await delay(1000);
  if (cancelled) throw new Error('Cancelled');
  return 'data';
});

// Cancel
cancelled = true;
state.$reset();
```

### Q: What exactly gets reset?

**Answer:** All three properties:

```javascript
state.$reset();

// After reset:
console.log(state.data);    // Initial value (from async(initialValue))
console.log(state.error);   // null
console.log(state.loading); // false
```

### Q: Can I reset only specific properties?

**Answer:** No, `$reset()` resets everything. For partial reset, set properties manually:

```javascript
// Reset only error
state.error = null;

// Reset only data to initial value
state.data = initialValue;

// Reset only loading
state.loading = false;
```

### Q: What if I forget the initial value?

**Answer:** Choose meaningful initial values when creating the async state:

```javascript
// ✅ Good - clear intention
const users = ReactiveUtils.async([]);      // List of users
const user = ReactiveUtils.async(null);     // Single user
const count = ReactiveUtils.async(0);       // Counter
const config = ReactiveUtils.async({});     // Configuration

// ❌ Less clear
const state = ReactiveUtils.async(undefined); // What is this?
```

### Q: Does reset trigger effects?

**Answer:** Yes, because it changes the reactive properties:

```javascript
const state = ReactiveUtils.async(null);

ReactiveUtils.effect(() => {
  console.log('Data changed:', state.data);
});

// This triggers the effect
state.$reset(); // Logs: "Data changed: null"
```

---

## Tips for Success

### 1. Choose Meaningful Initial Values

```javascript
// ✅ Use initial values that make sense
const items = ReactiveUtils.async([]);           // Empty array for lists
const user = ReactiveUtils.async(null);          // null for single objects
const count = ReactiveUtils.async(0);            // 0 for numbers
const settings = ReactiveUtils.async({});        // Empty object for configs
const status = ReactiveUtils.async('idle');      // Default status
```

### 2. Reset Before Loading New Data

```javascript
// ✅ Clear old data first
async function loadUser(userId) {
  userState.$reset(); // Clear previous user
  
  await userState.$execute(async () => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  });
}
```

### 3. Reset on Clear Actions

```javascript
// ✅ Clear buttons should reset
clearBtn.onclick = () => {
  searchResults.$reset();
};

closeBtn.onclick = () => {
  modal.$reset();
};
```

### 4. Reset Related States Together

```javascript
// ✅ Clear all related data
function clearSearch() {
  searchQuery.$reset();
  searchResults.$reset();
  selectedItem.$reset();
  filters.$reset();
}
```

### 5. Reset After Temporary Success Messages

```javascript
// ✅ Show success, then reset
await state.$execute(async () => {
  // Submit
});

if (state.data) {
  // Show success for 3 seconds
  setTimeout(() => {
    state.$reset();
  }, 3000);
}
```

### 6. Don't Forget to Reset on Navigation

```javascript
// ✅ Clean up when leaving
window.addEventListener('beforeunload', () => {
  pageData.$reset();
  tempState.$reset();
});
```

---

## Comparison: Before and After Reset

```javascript
const state = ReactiveUtils.async({ status: 'idle' });

// 1. Initial state
console.log(state.data);    // { status: 'idle' }
console.log(state.error);   // null
console.log(state.loading); // false

// 2. During execution
const promise = state.$execute(async () => {
  await delay(1000);
  return { status: 'active', count: 5 };
});
console.log(state.loading); // true

// 3. After execution
await promise;
console.log(state.data);    // { status: 'active', count: 5 }
console.log(state.error);   // null
console.log(state.loading); // false

// 4. After reset
state.$reset();
console.log(state.data);    // { status: 'idle' } (back to initial)
console.log(state.error);   // null
console.log(state.loading); // false
```

---

## Summary

### What `$reset()` Does:

1. ✅ Sets `data` back to the **initial value** (from `async(initialValue)`)
2. ✅ Sets `error` to `null`
3. ✅ Sets `loading` to `false`
4. ✅ Returns state to initial configuration
5. ✅ Triggers reactive updates

### When to Use It:

- Clearing search results
- After form submissions
- Closing modals/dialogs
- Cancel operations
- Navigation/route changes
- Logout scenarios
- Starting fresh
- Clearing errors

### The Basic Pattern:

```javascript
// 1. Create with initial value
const state = ReactiveUtils.async(initialValue);

// 2. Load data
await state.$execute(async () => {
  const res = await fetch('/api/data');
  return res.json();
});
console.log(state.data); // Loaded data

// 3. Reset to initial value
state.$reset();
console.log(state.data);    // initialValue (back to start)
console.log(state.error);   // null
console.log(state.loading); // false
```

### Key Takeaway:

**`$reset()` restores the `data` property to whatever initial value you passed to `async(initialValue)`. It's not always `null` - it depends on what you specified when creating the async state!**

---

**Remember:** `$reset()` is your reset button. It clears errors, stops loading, and returns data to its initial value. Perfect for clearing state and starting fresh! 🎉