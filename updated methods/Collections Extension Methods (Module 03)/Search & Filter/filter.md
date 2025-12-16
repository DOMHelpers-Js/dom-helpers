# Understanding `filter()` - A Beginner's Guide

## What is `filter()`?

`filter()` is a method for reactive collections that returns all items matching a condition. It works like JavaScript's array `filter()` but on reactive collections.

Think of it as **collection filter** - get all matching items.

---

## Why Does This Exist?

### The Problem: Filtering Collections

You need to get subset of items matching criteria:

```javascript
// ❌ Without filter - manual loop
const users = ReactiveUtils.collection([
  { name: 'John', active: true },
  { name: 'Jane', active: false },
  { name: 'Bob', active: true }
]);

const active = [];
for (let user of users) {
  if (user.active) {
    active.push(user);
  }
}

// ✅ With filter() - clean
const active = users.filter(u => u.active);
```

**Why this matters:**
- Cleaner syntax
- Familiar array method
- Returns all matches
- Works on reactive collections

---

## How Does It Work?

### The Filter Process

```javascript
collection.filter(predicate)
    ↓
Tests each item
    ↓
Returns array of matches
```

---

## Basic Usage

### Filter by Property

```javascript
const users = ReactiveUtils.collection([
  { id: 1, name: 'John', active: true },
  { id: 2, name: 'Jane', active: false },
  { id: 3, name: 'Bob', active: true }
]);

const activeUsers = users.filter(u => u.active);
console.log(activeUsers); // [John, Bob]
```

### Filter by Condition

```javascript
const products = ReactiveUtils.collection([
  { name: 'Apple', price: 1.5 },
  { name: 'Bread', price: 2.5 },
  { name: 'Milk', price: 3.5 }
]);

const affordable = products.filter(p => p.price <= 2.5);
console.log(affordable); // [Apple, Bread]
```

### Empty Result

```javascript
const items = ReactiveUtils.collection([1, 2, 3]);

const large = items.filter(x => x > 10);
console.log(large); // []
```

---

## Simple Examples Explained

### Example 1: Task List

```javascript
const tasks = ReactiveUtils.collection([
  { id: 1, title: 'Buy milk', completed: false, priority: 'low' },
  { id: 2, title: 'Finish report', completed: false, priority: 'high' },
  { id: 3, title: 'Call client', completed: true, priority: 'medium' },
  { id: 4, title: 'Review code', completed: false, priority: 'high' }
]);

// Get incomplete tasks
const incomplete = tasks.filter(t => !t.completed);
console.log(incomplete.length); // 3

// Get high priority tasks
const urgent = tasks.filter(t => t.priority === 'high');
console.log(urgent); // [Finish report, Review code]

// Get completed tasks
const done = tasks.filter(t => t.completed);
console.log(done); // [Call client]

// Display filtered tasks
function displayTasks(filter) {
  let filtered;

  if (filter === 'active') {
    filtered = tasks.filter(t => !t.completed);
  } else if (filter === 'completed') {
    filtered = tasks.filter(t => t.completed);
  } else {
    filtered = tasks;
  }

  const list = document.getElementById('task-list');
  list.innerHTML = filtered
    .map(t => `<li>${t.title}</li>`)
    .join('');
}
```

---

### Example 2: Product Catalog

```javascript
const products = ReactiveUtils.collection([
  { id: 1, name: 'Laptop', category: 'electronics', price: 999, inStock: true },
  { id: 2, name: 'Mouse', category: 'electronics', price: 25, inStock: true },
  { id: 3, name: 'Desk', category: 'furniture', price: 299, inStock: false },
  { id: 4, name: 'Chair', category: 'furniture', price: 199, inStock: true }
]);

const filters = ReactiveUtils.state({
  category: 'all',
  maxPrice: 1000,
  inStockOnly: false
});

// Computed filtered products
const filteredProducts = ReactiveUtils.computed(() => {
  let result = products;

  // Filter by category
  if (filters.category !== 'all') {
    result = result.filter(p => p.category === filters.category);
  }

  // Filter by price
  result = result.filter(p => p.price <= filters.maxPrice);

  // Filter by stock
  if (filters.inStockOnly) {
    result = result.filter(p => p.inStock);
  }

  return result;
});

// Display products
ReactiveUtils.effect(() => {
  const list = document.getElementById('products');
  list.innerHTML = filteredProducts
    .map(p => `
      <div class="product">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <p>${p.inStock ? 'In Stock' : 'Out of Stock'}</p>
      </div>
    `)
    .join('');
});
```

---

### Example 3: User Search

```javascript
const users = ReactiveUtils.collection([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'admin' }
]);

const search = ReactiveUtils.state({
  query: '',
  role: 'all'
});

// Search users
const searchResults = ReactiveUtils.computed(() => {
  let results = users;

  // Filter by search query
  if (search.query) {
    const query = search.query.toLowerCase();
    results = results.filter(u =>
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    );
  }

  // Filter by role
  if (search.role !== 'all') {
    results = results.filter(u => u.role === search.role);
  }

  return results;
});

// Search input
document.getElementById('search').oninput = (e) => {
  search.query = e.target.value;
};

// Role filter
document.getElementById('role-filter').onchange = (e) => {
  search.role = e.target.value;
};

// Display results
ReactiveUtils.effect(() => {
  const list = document.getElementById('user-list');
  list.innerHTML = searchResults
    .map(u => `
      <div class="user">
        <h4>${u.name}</h4>
        <p>${u.email}</p>
        <span class="badge">${u.role}</span>
      </div>
    `)
    .join('');
});
```

---

## Real-World Example: E-commerce Filters

```javascript
const products = ReactiveUtils.collection([
  { id: 1, name: 'Laptop', brand: 'Dell', price: 999, rating: 4.5, tags: ['electronics', 'computers'] },
  { id: 2, name: 'Mouse', brand: 'Logitech', price: 25, rating: 4.0, tags: ['electronics', 'accessories'] },
  { id: 3, name: 'Keyboard', brand: 'Corsair', price: 89, rating: 4.8, tags: ['electronics', 'accessories'] },
  { id: 4, name: 'Monitor', brand: 'Dell', price: 299, rating: 4.3, tags: ['electronics', 'displays'] },
  { id: 5, name: 'Webcam', brand: 'Logitech', price: 79, rating: 4.2, tags: ['electronics', 'accessories'] }
]);

const filters = ReactiveUtils.state({
  searchQuery: '',
  brands: [],
  minPrice: 0,
  maxPrice: 2000,
  minRating: 0,
  tags: []
});

// Complex filtering
const filteredProducts = ReactiveUtils.computed(() => {
  return products.filter(product => {
    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      if (!product.name.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Brand filter
    if (filters.brands.length > 0) {
      if (!filters.brands.includes(product.brand)) {
        return false;
      }
    }

    // Price range
    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false;
    }

    // Minimum rating
    if (product.rating < filters.minRating) {
      return false;
    }

    // Tags
    if (filters.tags.length > 0) {
      const hasTag = filters.tags.some(tag => product.tags.includes(tag));
      if (!hasTag) {
        return false;
      }
    }

    return true;
  });
});

// Statistics
const stats = ReactiveUtils.computed(() => ({
  total: filteredProducts.length,
  avgPrice: filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredProducts.length || 0,
  avgRating: filteredProducts.reduce((sum, p) => sum + p.rating, 0) / filteredProducts.length || 0
}));

// Display products
ReactiveUtils.effect(() => {
  const container = document.getElementById('products');
  container.innerHTML = filteredProducts
    .map(p => `
      <div class="product-card">
        <h3>${p.name}</h3>
        <p class="brand">${p.brand}</p>
        <p class="price">$${p.price}</p>
        <p class="rating">⭐ ${p.rating}</p>
        <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
      </div>
    `)
    .join('');
});

// Display stats
ReactiveUtils.effect(() => {
  document.getElementById('total-products').textContent = stats.total;
  document.getElementById('avg-price').textContent = `$${stats.avgPrice.toFixed(2)}`;
  document.getElementById('avg-rating').textContent = stats.avgRating.toFixed(1);
});
```

---

## Common Patterns

### Pattern 1: Simple Filter

```javascript
const active = collection.filter(x => x.active);
```

### Pattern 2: Multiple Conditions

```javascript
const results = collection.filter(x =>
  x.price > 10 && x.inStock && x.category === 'electronics'
);
```

### Pattern 3: Filter with Computed

```javascript
const filtered = ReactiveUtils.computed(() =>
  collection.filter(x => x.status === currentStatus)
);
```

---

## Common Questions

### Q: What if no items match?

**Answer:** Returns empty array:

```javascript
const results = collection.filter(x => x.id > 1000);
console.log(results); // []
```

### Q: Does it modify the original?

**Answer:** No, returns new array:

```javascript
const filtered = collection.filter(x => x.active);
// collection unchanged
```

### Q: Can I chain filters?

**Answer:** Yes!

```javascript
const results = collection
  .filter(x => x.active)
  .filter(x => x.price > 10);
```

---

## Tips for Success

### 1. Use for Multiple Matches

```javascript
// ✅ Get all matching items
const activeUsers = users.filter(u => u.active);
```

### 2. Combine Conditions

```javascript
// ✅ Complex filtering
const results = items.filter(i =>
  i.price > 10 && i.category === 'books'
);
```

### 3. Use with Computed

```javascript
// ✅ Reactive filtered list
const filtered = ReactiveUtils.computed(() =>
  items.filter(i => i.status === filter)
);
```

---

## Summary

### What `filter()` Does:

1. ✅ Tests each item
2. ✅ Returns all matches
3. ✅ Returns array
4. ✅ Empty array if no matches
5. ✅ Doesn't modify original

### When to Use It:

- Getting multiple matches
- Filtering by criteria
- Search results
- Category filtering
- Status filtering

### The Basic Pattern:

```javascript
const collection = ReactiveUtils.collection([
  { id: 1, active: true },
  { id: 2, active: false },
  { id: 3, active: true }
]);

const active = collection.filter(x => x.active);
console.log(active); // [{ id: 1 }, { id: 3 }]
```

---

**Remember:** `filter()` returns ALL matching items as an array. Use it when you need multiple results! 🎉
