# Understanding `reset()` - A Beginner's Guide

## What is `reset()`?

`reset()` is a method for reactive collections that replaces all items with new ones. It's like clearing and refilling in one operation.

Think of it as **collection replacer** - replace everything at once.

---

## Why Does This Exist?

### The Problem: Replacing All Items

You need to completely replace collection contents:

```javascript
// ❌ Without reset - manual clearing and adding
const items = ReactiveUtils.collection([1, 2, 3]);

items.splice(0, items.length); // Clear
items.push(4, 5, 6); // Add new

// ✅ With reset() - clean
items.reset([4, 5, 6]);
console.log(items); // [4, 5, 6]
```

**Why this matters:**
- Single operation
- Clean syntax
- Atomic replacement
- Triggers reactivity once

---

## How Does It Work?

### The Reset Process

```javascript
collection.reset(newItems)
    ↓
Clears all existing items
Adds all new items
    ↓
Triggers single reactive update
```

---

## Basic Usage

### Replace with New Array

```javascript
const items = ReactiveUtils.collection([1, 2, 3]);

items.reset([10, 20, 30]);
console.log(items); // [10, 20, 30]
```

### Reset to Empty

```javascript
const items = ReactiveUtils.collection([1, 2, 3]);

items.reset([]);
console.log(items); // []
```

### Reset with Objects

```javascript
const users = ReactiveUtils.collection([
  { id: 1, name: 'John' }
]);

users.reset([
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Bob' }
]);
```

---

## Simple Examples Explained

### Example 1: Filter Reset

```javascript
const allItems = [
  { id: 1, category: 'A', name: 'Item 1' },
  { id: 2, category: 'B', name: 'Item 2' },
  { id: 3, category: 'A', name: 'Item 3' },
  { id: 4, category: 'C', name: 'Item 4' }
];

const displayedItems = ReactiveUtils.collection([...allItems]);

function filterByCategory(category) {
  if (category === 'all') {
    displayedItems.reset(allItems);
  } else {
    displayedItems.reset(allItems.filter(i => i.category === category));
  }
}

// Display
ReactiveUtils.effect(() => {
  const container = document.getElementById('items');
  container.innerHTML = displayedItems
    .map(item => `<div>${item.name}</div>`)
    .join('');
});
```

---

### Example 2: Search Results

```javascript
const allProducts = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Mouse', price: 25 },
  { id: 3, name: 'Keyboard', price: 75 }
];

const searchResults = ReactiveUtils.collection([...allProducts]);

function search(query) {
  if (!query) {
    searchResults.reset(allProducts);
    return;
  }

  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );
  searchResults.reset(filtered);
}

// Display results
ReactiveUtils.effect(() => {
  const container = document.getElementById('results');
  container.innerHTML = `
    <p>${searchResults.length} result(s)</p>
    ${searchResults.map(p => `
      <div class="product">
        <h4>${p.name}</h4>
        <span>$${p.price}</span>
      </div>
    `).join('')}
  `;
});

// Search input
document.getElementById('search').oninput = (e) => {
  search(e.target.value);
};
```

---

### Example 3: Refresh Data

```javascript
const data = ReactiveUtils.collection([]);

async function loadData() {
  try {
    const response = await fetch('/api/data');
    const newData = await response.json();

    // Replace all data
    data.reset(newData);
  } catch (error) {
    console.error('Failed to load data:', error);
  }
}

// Display data
ReactiveUtils.effect(() => {
  const container = document.getElementById('data');

  if (data.length === 0) {
    container.innerHTML = '<p>No data</p>';
    return;
  }

  container.innerHTML = data
    .map(item => `<div>${item.name}</div>`)
    .join('');
});

// Load initial data
loadData();

// Refresh button
document.getElementById('refresh').onclick = loadData;
```

---

## Real-World Example: Data Table with Sorting

```javascript
const rawData = [
  { id: 1, name: 'John', age: 30, department: 'IT' },
  { id: 2, name: 'Jane', age: 25, department: 'HR' },
  { id: 3, name: 'Bob', age: 35, department: 'IT' },
  { id: 4, name: 'Alice', age: 28, department: 'Sales' }
];

const displayData = ReactiveUtils.collection([...rawData]);

const tableState = ReactiveUtils.state({
  sortBy: 'name',
  sortOrder: 'asc',
  filterDepartment: 'all'
});

// Update display based on state
function updateDisplay() {
  let filtered = [...rawData];

  // Filter by department
  if (tableState.filterDepartment !== 'all') {
    filtered = filtered.filter(item =>
      item.department === tableState.filterDepartment
    );
  }

  // Sort
  filtered.sort((a, b) => {
    const aVal = a[tableState.sortBy];
    const bVal = b[tableState.sortBy];

    if (typeof aVal === 'string') {
      return tableState.sortOrder === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    } else {
      return tableState.sortOrder === 'asc'
        ? aVal - bVal
        : bVal - aVal;
    }
  });

  // Reset display data
  displayData.reset(filtered);
}

// Sort by column
function sortBy(column) {
  if (tableState.sortBy === column) {
    tableState.sortOrder = tableState.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    tableState.sortBy = column;
    tableState.sortOrder = 'asc';
  }
  updateDisplay();
}

// Filter by department
function filterByDepartment(dept) {
  tableState.filterDepartment = dept;
  updateDisplay();
}

// Display table
ReactiveUtils.effect(() => {
  const container = document.getElementById('table');

  container.innerHTML = `
    <div class="table-controls">
      <label>
        Department:
        <select onchange="filterByDepartment(this.value)">
          <option value="all">All</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Sales">Sales</option>
        </select>
      </label>
      <span>Showing ${displayData.length} of ${rawData.length} records</span>
    </div>
    <table>
      <thead>
        <tr>
          <th onclick="sortBy('name')">
            Name ${tableState.sortBy === 'name' ? (tableState.sortOrder === 'asc' ? '↑' : '↓') : ''}
          </th>
          <th onclick="sortBy('age')">
            Age ${tableState.sortBy === 'age' ? (tableState.sortOrder === 'asc' ? '↑' : '↓') : ''}
          </th>
          <th onclick="sortBy('department')">
            Department ${tableState.sortBy === 'department' ? (tableState.sortOrder === 'asc' ? '↑' : '↓') : ''}
          </th>
        </tr>
      </thead>
      <tbody>
        ${displayData.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>${item.age}</td>
            <td>${item.department}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
});

// Initialize
updateDisplay();
```

---

## Common Patterns

### Pattern 1: Replace All

```javascript
collection.reset(newArray);
```

### Pattern 2: Clear

```javascript
collection.reset([]);
```

### Pattern 3: Filter and Reset

```javascript
const filtered = items.filter(predicate);
displayItems.reset(filtered);
```

### Pattern 4: Fetch and Reset

```javascript
const data = await fetchData();
collection.reset(data);
```

---

## Common Questions

### Q: Does it modify the original?

**Answer:** Yes, replaces all items:

```javascript
const items = ReactiveUtils.collection([1, 2, 3]);
items.reset([4, 5]);
console.log(items); // [4, 5]
```

### Q: What does it return?

**Answer:** Returns the collection:

```javascript
const result = items.reset([1, 2, 3]);
console.log(result === items); // true
```

### Q: Triggers reactivity?

**Answer:** Yes, single update:

```javascript
ReactiveUtils.effect(() => {
  console.log(items.length);
});
items.reset([1, 2, 3]); // Effect runs once
```

---

## Summary

### What `reset()` Does:

1. ✅ Replaces all items
2. ✅ Single operation
3. ✅ Returns collection
4. ✅ Triggers once
5. ✅ Atomic replacement

### When to Use It:

- Complete replacement
- Filter updates
- Search results
- Data refresh
- Clear and refill

### The Basic Pattern:

```javascript
const collection = ReactiveUtils.collection([1, 2, 3]);

// Replace all
collection.reset([10, 20, 30]);

// Clear
collection.reset([]);

// From filter
const filtered = allItems.filter(i => i.active);
collection.reset(filtered);
```

---

**Remember:** `reset()` replaces everything in one atomic operation! 🎉
