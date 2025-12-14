# Understanding `sort()` - A Beginner's Guide

## What is `sort()`?

`sort()` is a method for reactive collections that sorts items in place. It works like JavaScript's array `sort()` but on reactive collections and triggers reactivity.

Think of it as **collection sorter** - organize items in order.

---

## Why Does This Exist?

### The Problem: Sorting Collections

You need to sort collections in different ways:

```javascript
// ❌ Without sort - manual sorting
const users = ReactiveUtils.collection([
  { name: 'Bob', age: 35 },
  { name: 'Alice', age: 25 },
  { name: 'Charlie', age: 30 }
]);

// Complex manual sort...

// ✅ With sort() - clean
users.sort((a, b) => a.age - b.age);
```

**Why this matters:**
- Familiar array method
- Sorts in place
- Triggers reactivity
- Easy ordering

---

## How Does It Work?

### The Sort Process

```javascript
collection.sort(compareFn)
    ↓
Sorts items using compare function
    ↓
Modifies collection in place
    ↓
Triggers reactive updates
```

---

## Basic Usage

### Sort Numbers

```javascript
const numbers = ReactiveUtils.collection([3, 1, 4, 1, 5, 9, 2]);

// Sort ascending
numbers.sort((a, b) => a - b);
console.log(numbers); // [1, 1, 2, 3, 4, 5, 9]

// Sort descending
numbers.sort((a, b) => b - a);
console.log(numbers); // [9, 5, 4, 3, 2, 1, 1]
```

### Sort Strings

```javascript
const names = ReactiveUtils.collection(['Bob', 'Alice', 'Charlie']);

// Sort alphabetically
names.sort((a, b) => a.localeCompare(b));
console.log(names); // ['Alice', 'Bob', 'Charlie']
```

### Sort Objects

```javascript
const users = ReactiveUtils.collection([
  { name: 'Bob', age: 35 },
  { name: 'Alice', age: 25 },
  { name: 'Charlie', age: 30 }
]);

// Sort by age
users.sort((a, b) => a.age - b.age);
console.log(users);
// [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 30 }, { name: 'Bob', age: 35 }]
```

---

## Simple Examples Explained

### Example 1: Product Sorting

```javascript
const products = ReactiveUtils.collection([
  { id: 1, name: 'Laptop', price: 999, rating: 4.5 },
  { id: 2, name: 'Mouse', price: 25, rating: 4.0 },
  { id: 3, name: 'Keyboard', price: 89, rating: 4.8 }
]);

const sortState = ReactiveUtils.state({
  sortBy: 'name',
  order: 'asc'
});

// Sort function
function sortProducts() {
  if (sortState.sortBy === 'name') {
    products.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortState.order === 'asc' ? comparison : -comparison;
    });
  } else if (sortState.sortBy === 'price') {
    products.sort((a, b) => {
      const comparison = a.price - b.price;
      return sortState.order === 'asc' ? comparison : -comparison;
    });
  } else if (sortState.sortBy === 'rating') {
    products.sort((a, b) => {
      const comparison = a.rating - b.rating;
      return sortState.order === 'asc' ? comparison : -comparison;
    });
  }
}

// Display products
ReactiveUtils.effect(() => {
  sortProducts();

  const container = document.getElementById('products');
  container.innerHTML = products
    .map(p => `
      <div class="product">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <p>⭐ ${p.rating}</p>
      </div>
    `)
    .join('');
});

// Sort controls
document.getElementById('sort-by').onchange = (e) => {
  sortState.sortBy = e.target.value;
};

document.getElementById('order').onchange = (e) => {
  sortState.order = e.target.value;
};
```

---

### Example 2: Task Priority

```javascript
const tasks = ReactiveUtils.collection([
  { id: 1, title: 'Buy milk', priority: 2, dueDate: '2024-01-15' },
  { id: 2, title: 'Finish report', priority: 1, dueDate: '2024-01-10' },
  { id: 3, title: 'Call client', priority: 3, dueDate: '2024-01-20' }
]);

// Sort by priority (1 = highest)
function sortByPriority() {
  tasks.sort((a, b) => a.priority - b.priority);
}

// Sort by due date
function sortByDueDate() {
  tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

// Sort by title
function sortByTitle() {
  tasks.sort((a, b) => a.title.localeCompare(b.title));
}

// Buttons
document.getElementById('sort-priority').onclick = sortByPriority;
document.getElementById('sort-date').onclick = sortByDueDate;
document.getElementById('sort-title').onclick = sortByTitle;
```

---

### Example 3: Leaderboard

```javascript
const players = ReactiveUtils.collection([
  { id: 1, name: 'Alice', score: 1500, level: 10 },
  { id: 2, name: 'Bob', score: 2000, level: 15 },
  { id: 3, name: 'Charlie', score: 1800, level: 12 }
]);

// Sort by score (highest first)
players.sort((a, b) => b.score - a.score);

// Display leaderboard
ReactiveUtils.effect(() => {
  const leaderboard = document.getElementById('leaderboard');
  leaderboard.innerHTML = players
    .map((player, index) => `
      <div class="player-rank">
        <span class="rank">${index + 1}</span>
        <span class="name">${player.name}</span>
        <span class="score">${player.score}</span>
        <span class="level">Lv ${player.level}</span>
      </div>
    `)
    .join('');
});

// Update score and re-sort
function updateScore(playerId, newScore) {
  const player = players.find(p => p.id === playerId);
  if (player) {
    player.score = newScore;
    players.sort((a, b) => b.score - a.score);
  }
}
```

---

## Real-World Example: Data Table

```javascript
const data = ReactiveUtils.collection([
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, status: 'active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, status: 'inactive' }
]);

const tableState = ReactiveUtils.state({
  sortColumn: 'name',
  sortDirection: 'asc'
});

// Sort by column
function sortByColumn(column) {
  if (tableState.sortColumn === column) {
    // Toggle direction
    tableState.sortDirection = tableState.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    tableState.sortColumn = column;
    tableState.sortDirection = 'asc';
  }

  // Sort data
  data.sort((a, b) => {
    let comparison = 0;

    if (column === 'name' || column === 'email' || column === 'status') {
      comparison = a[column].localeCompare(b[column]);
    } else if (column === 'age' || column === 'id') {
      comparison = a[column] - b[column];
    }

    return tableState.sortDirection === 'asc' ? comparison : -comparison;
  });
}

// Display table
ReactiveUtils.effect(() => {
  const table = document.getElementById('data-table');
  const sortIcon = tableState.sortDirection === 'asc' ? '▲' : '▼';

  table.innerHTML = `
    <table>
      <thead>
        <tr>
          <th onclick="sortByColumn('id')">
            ID ${tableState.sortColumn === 'id' ? sortIcon : ''}
          </th>
          <th onclick="sortByColumn('name')">
            Name ${tableState.sortColumn === 'name' ? sortIcon : ''}
          </th>
          <th onclick="sortByColumn('email')">
            Email ${tableState.sortColumn === 'email' ? sortIcon : ''}
          </th>
          <th onclick="sortByColumn('age')">
            Age ${tableState.sortColumn === 'age' ? sortIcon : ''}
          </th>
          <th onclick="sortByColumn('status')">
            Status ${tableState.sortColumn === 'status' ? sortIcon : ''}
          </th>
        </tr>
      </thead>
      <tbody>
        ${data.map(row => `
          <tr>
            <td>${row.id}</td>
            <td>${row.name}</td>
            <td>${row.email}</td>
            <td>${row.age}</td>
            <td>${row.status}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
});

// Make sortByColumn global
window.sortByColumn = sortByColumn;
```

---

## Common Patterns

### Pattern 1: Sort Numbers

```javascript
numbers.sort((a, b) => a - b); // Ascending
numbers.sort((a, b) => b - a); // Descending
```

### Pattern 2: Sort Strings

```javascript
strings.sort((a, b) => a.localeCompare(b));
```

### Pattern 3: Sort by Property

```javascript
items.sort((a, b) => a.price - b.price);
```

### Pattern 4: Multi-level Sort

```javascript
items.sort((a, b) => {
  const diff = a.category.localeCompare(b.category);
  return diff !== 0 ? diff : a.price - b.price;
});
```

---

## Common Questions

### Q: Does it modify the original?

**Answer:** Yes! Sorts in place:

```javascript
const arr = ReactiveUtils.collection([3, 1, 2]);
arr.sort((a, b) => a - b);
console.log(arr); // [1, 2, 3] - modified!
```

### Q: Is it reactive?

**Answer:** Yes! Triggers updates:

```javascript
ReactiveUtils.effect(() => {
  console.log(items);
});

items.sort(); // Effect runs
```

### Q: How to sort descending?

**Answer:** Reverse comparison:

```javascript
// Ascending
items.sort((a, b) => a - b);

// Descending
items.sort((a, b) => b - a);
```

---

## Tips for Success

### 1. Always Return Number

```javascript
// ✅ Numbers: use subtraction
items.sort((a, b) => a.value - b.value);

// ✅ Strings: use localeCompare
items.sort((a, b) => a.name.localeCompare(b.name));
```

### 2. Sorts in Place

```javascript
// ✅ Modifies collection
items.sort((a, b) => a - b);

// To keep original, copy first
const sorted = [...items].sort((a, b) => a - b);
```

### 3. Handle Null/Undefined

```javascript
// ✅ Safe sorting
items.sort((a, b) => {
  if (!a.value) return 1;
  if (!b.value) return -1;
  return a.value - b.value;
});
```

---

## Summary

### What `sort()` Does:

1. ✅ Sorts collection in place
2. ✅ Uses compare function
3. ✅ Triggers reactivity
4. ✅ Returns sorted collection
5. ✅ Modifies original

### When to Use It:

- Ordering items
- Table sorting
- Leaderboards
- Product listings
- Prioritization

### The Basic Pattern:

```javascript
const collection = ReactiveUtils.collection([3, 1, 4, 1, 5]);

// Sort ascending
collection.sort((a, b) => a - b);
console.log(collection); // [1, 1, 3, 4, 5]

// Sort descending
collection.sort((a, b) => b - a);
console.log(collection); // [5, 4, 3, 1, 1]
```

---

**Remember:** `sort()` modifies the collection in place and triggers reactivity. Perfect for ordering data! 🎉
