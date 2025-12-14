# Understanding `includes()` - A Beginner's Guide

## What is `includes()`?

`includes()` is a method for reactive collections that checks if an item exists. It works like JavaScript's array `includes()` method and returns `true` or `false`.

Think of it as **existence checker** - does this item exist in the collection?

---

## Why Does This Exist?

### The Problem: Checking for Item Existence

You need to know if a collection contains a specific item:

```javascript
// ❌ Without includes - manual check
const items = ReactiveUtils.collection([1, 2, 3, 4, 5]);

let found = false;
for (let item of items) {
  if (item === 3) {
    found = true;
    break;
  }
}
console.log(found); // true

// ✅ With includes() - clean
console.log(items.includes(3)); // true
```

**Why this matters:**
- Simple boolean check
- Cleaner syntax
- Familiar array method
- Works on reactive collections

---

## How Does It Work?

### The Includes Process

```javascript
collection.includes(value)
    ↓
Checks each item for equality
    ↓
Returns true if found, false otherwise
```

---

## Basic Usage

### Check Primitive Values

```javascript
const numbers = ReactiveUtils.collection([1, 2, 3, 4, 5]);

console.log(numbers.includes(3)); // true
console.log(numbers.includes(10)); // false

const names = ReactiveUtils.collection(['Alice', 'Bob', 'Charlie']);
console.log(names.includes('Bob')); // true
console.log(names.includes('David')); // false
```

### Check with Objects

```javascript
const users = ReactiveUtils.collection([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
]);

// Reference check only
const john = users[0];
console.log(users.includes(john)); // true

// Different object - false
console.log(users.includes({ id: 1, name: 'John' })); // false
```

### With fromIndex

```javascript
const items = ReactiveUtils.collection([1, 2, 3, 4, 5, 3]);

console.log(items.includes(3)); // true
console.log(items.includes(3, 3)); // true (searches from index 3)
console.log(items.includes(2, 2)); // false (searches from index 2)
```

---

## Simple Examples Explained

### Example 1: Tag Selection

```javascript
const availableTags = ReactiveUtils.collection(['javascript', 'react', 'vue', 'angular']);
const selectedTags = ReactiveUtils.collection([]);

// Toggle tag selection
function toggleTag(tag) {
  if (selectedTags.includes(tag)) {
    // Remove if already selected
    const index = selectedTags.indexOf(tag);
    selectedTags.splice(index, 1);
  } else {
    // Add if not selected
    selectedTags.push(tag);
  }
}

// Display tags
ReactiveUtils.effect(() => {
  const container = document.getElementById('tags');

  container.innerHTML = availableTags
    .map(tag => {
      const isSelected = selectedTags.includes(tag);
      return `
        <button class="tag ${isSelected ? 'selected' : ''}"
                onclick="toggleTag('${tag}')">
          ${tag}
          ${isSelected ? '✓' : ''}
        </button>
      `;
    })
    .join('');
});

// Display selected count
ReactiveUtils.effect(() => {
  document.getElementById('selected-count').textContent =
    `${selectedTags.length} selected`;
});
```

---

### Example 2: Shopping Cart

```javascript
const products = ReactiveUtils.collection([
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Mouse', price: 25 },
  { id: 3, name: 'Keyboard', price: 75 }
]);

const cart = ReactiveUtils.collection([]);

// Check if product in cart
function isInCart(productId) {
  return cart.some(item => item.id === productId);
  // Note: includes() won't work for object comparison
  // Use some() or find() instead for objects
}

// Add to cart
function addToCart(productId) {
  if (!isInCart(productId)) {
    const product = products.find(p => p.id === productId);
    if (product) {
      cart.push({ ...product, quantity: 1 });
    }
  }
}

// Remove from cart
function removeFromCart(productId) {
  const index = cart.findIndex(item => item.id === productId);
  if (index !== -1) {
    cart.splice(index, 1);
  }
}

// Display products
ReactiveUtils.effect(() => {
  const container = document.getElementById('products');

  container.innerHTML = products
    .map(product => {
      const inCart = isInCart(product.id);
      return `
        <div class="product">
          <h3>${product.name}</h3>
          <p>$${product.price}</p>
          ${inCart ? `
            <button onclick="removeFromCart(${product.id})">
              Remove from Cart
            </button>
          ` : `
            <button onclick="addToCart(${product.id})">
              Add to Cart
            </button>
          `}
        </div>
      `;
    })
    .join('');
});
```

---

### Example 3: Permissions Check

```javascript
const userPermissions = ReactiveUtils.collection([
  'read',
  'write',
  'delete'
]);

// Check single permission
function hasPermission(permission) {
  return userPermissions.includes(permission);
}

// Check multiple permissions
function hasAllPermissions(...permissions) {
  return permissions.every(p => userPermissions.includes(p));
}

function hasAnyPermission(...permissions) {
  return permissions.some(p => userPermissions.includes(p));
}

// Display UI based on permissions
ReactiveUtils.effect(() => {
  // Show edit button
  const editBtn = document.getElementById('edit-btn');
  editBtn.style.display = hasPermission('write') ? 'block' : 'none';

  // Show delete button
  const deleteBtn = document.getElementById('delete-btn');
  deleteBtn.style.display = hasPermission('delete') ? 'block' : 'none';

  // Show admin panel
  const adminPanel = document.getElementById('admin-panel');
  adminPanel.style.display =
    hasAllPermissions('read', 'write', 'delete') ? 'block' : 'none';
});

// Add permission
function grantPermission(permission) {
  if (!userPermissions.includes(permission)) {
    userPermissions.push(permission);
  }
}

// Remove permission
function revokePermission(permission) {
  const index = userPermissions.indexOf(permission);
  if (index !== -1) {
    userPermissions.splice(index, 1);
  }
}
```

---

## Real-World Example: Multi-Select Filter

```javascript
const items = ReactiveUtils.collection([
  { id: 1, name: 'Laptop', category: 'electronics', tags: ['portable', 'work'] },
  { id: 2, name: 'Mouse', category: 'electronics', tags: ['work', 'gaming'] },
  { id: 3, name: 'Desk', category: 'furniture', tags: ['work', 'home'] },
  { id: 4, name: 'Chair', category: 'furniture', tags: ['comfort', 'work'] },
  { id: 5, name: 'Monitor', category: 'electronics', tags: ['work', 'gaming'] }
]);

const filters = ReactiveUtils.state({
  selectedCategories: ReactiveUtils.collection([]),
  selectedTags: ReactiveUtils.collection([])
});

// Toggle category filter
function toggleCategory(category) {
  if (filters.selectedCategories.includes(category)) {
    const index = filters.selectedCategories.indexOf(category);
    filters.selectedCategories.splice(index, 1);
  } else {
    filters.selectedCategories.push(category);
  }
}

// Toggle tag filter
function toggleTag(tag) {
  if (filters.selectedTags.includes(tag)) {
    const index = filters.selectedTags.indexOf(tag);
    filters.selectedTags.splice(index, 1);
  } else {
    filters.selectedTags.push(tag);
  }
}

// Get filtered items
const filteredItems = ReactiveUtils.computed(() => {
  return items.filter(item => {
    // Filter by category
    if (filters.selectedCategories.length > 0) {
      if (!filters.selectedCategories.includes(item.category)) {
        return false;
      }
    }

    // Filter by tags
    if (filters.selectedTags.length > 0) {
      const hasMatchingTag = filters.selectedTags.some(tag =>
        item.tags.includes(tag)
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    return true;
  });
});

// Display category filters
ReactiveUtils.effect(() => {
  const categories = [...new Set(items.map(i => i.category))];
  const container = document.getElementById('category-filters');

  container.innerHTML = categories
    .map(cat => {
      const isSelected = filters.selectedCategories.includes(cat);
      return `
        <label class="filter-option">
          <input type="checkbox"
                 ${isSelected ? 'checked' : ''}
                 onchange="toggleCategory('${cat}')">
          ${cat}
        </label>
      `;
    })
    .join('');
});

// Display tag filters
ReactiveUtils.effect(() => {
  const allTags = [...new Set(items.flatMap(i => i.tags))];
  const container = document.getElementById('tag-filters');

  container.innerHTML = allTags
    .map(tag => {
      const isSelected = filters.selectedTags.includes(tag);
      return `
        <label class="filter-option">
          <input type="checkbox"
                 ${isSelected ? 'checked' : ''}
                 onchange="toggleTag('${tag}')">
          ${tag}
        </label>
      `;
    })
    .join('');
});

// Display filtered items
ReactiveUtils.effect(() => {
  const container = document.getElementById('items');

  if (filteredItems.length === 0) {
    container.innerHTML = '<p>No items match your filters</p>';
    return;
  }

  container.innerHTML = filteredItems
    .map(item => `
      <div class="item">
        <h3>${item.name}</h3>
        <span class="category">${item.category}</span>
        <div class="tags">
          ${item.tags.map(tag => `
            <span class="tag ${filters.selectedTags.includes(tag) ? 'highlight' : ''}">
              ${tag}
            </span>
          `).join('')}
        </div>
      </div>
    `)
    .join('');
});

// Display filter count
ReactiveUtils.effect(() => {
  document.getElementById('result-count').textContent =
    `Showing ${filteredItems.length} of ${items.length} items`;
});

// Clear all filters
function clearFilters() {
  filters.selectedCategories.splice(0, filters.selectedCategories.length);
  filters.selectedTags.splice(0, filters.selectedTags.length);
}

document.getElementById('clear-filters').onclick = clearFilters;
```

---

## Common Patterns

### Pattern 1: Simple Check

```javascript
if (collection.includes(value)) {
  console.log('Found!');
}
```

### Pattern 2: Toggle Item

```javascript
if (collection.includes(item)) {
  const index = collection.indexOf(item);
  collection.splice(index, 1);
} else {
  collection.push(item);
}
```

### Pattern 3: Conditional Rendering

```javascript
ReactiveUtils.effect(() => {
  button.className = collection.includes(item) ? 'selected' : '';
});
```

### Pattern 4: Multiple Checks

```javascript
const hasAll = items.every(item => collection.includes(item));
const hasAny = items.some(item => collection.includes(item));
```

---

## Common Questions

### Q: Does it work with objects?

**Answer:** Only by reference:

```javascript
const obj = { id: 1 };
const items = ReactiveUtils.collection([obj]);

console.log(items.includes(obj)); // true (same reference)
console.log(items.includes({ id: 1 })); // false (different reference)
```

### Q: Can I specify start index?

**Answer:** Yes, second parameter:

```javascript
const items = ReactiveUtils.collection([1, 2, 3, 4, 5]);
console.log(items.includes(3, 3)); // false (starts from index 3)
```

### Q: Is it case-sensitive?

**Answer:** Yes, for strings:

```javascript
const names = ReactiveUtils.collection(['Alice', 'Bob']);
console.log(names.includes('alice')); // false
console.log(names.includes('Alice')); // true
```

---

## Tips for Success

### 1. Use for Primitive Values

```javascript
// ✅ Works great with primitives
const ids = ReactiveUtils.collection([1, 2, 3]);
console.log(ids.includes(2)); // true
```

### 2. Use find() for Objects

```javascript
// ✅ For object comparison
const exists = items.find(i => i.id === targetId) !== undefined;
// Or use some()
const exists = items.some(i => i.id === targetId);
```

### 3. Toggle Pattern

```javascript
// ✅ Toggle items in/out
function toggle(item) {
  if (collection.includes(item)) {
    collection.splice(collection.indexOf(item), 1);
  } else {
    collection.push(item);
  }
}
```

---

## Summary

### What `includes()` Does:

1. ✅ Checks if item exists
2. ✅ Returns boolean
3. ✅ Uses strict equality
4. ✅ Accepts start index
5. ✅ Works like array includes()

### When to Use It:

- Checking existence
- Toggle selections
- Permission checks
- Filter states
- Multi-select systems

### The Basic Pattern:

```javascript
const collection = ReactiveUtils.collection([1, 2, 3, 4, 5]);

if (collection.includes(3)) {
  console.log('Found 3');
}

// Toggle pattern
if (collection.includes(item)) {
  // Remove
} else {
  // Add
}
```

---

**Remember:** `includes()` is perfect for simple existence checks with primitive values! 🎉
