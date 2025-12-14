# Understanding `toggleAll()` - A Beginner's Guide

## What is `toggleAll()`?

`toggleAll()` is a method for reactive collections that toggles a boolean field on **all items** that match a condition. Unlike `toggle()` which only affects the first match, `toggleAll()` affects **every matching item**.

Think of it as **boolean mass flipper** - find all matching items and switch their boolean field.

---

## Why Does This Exist?

### The Problem: `toggle()` Only Affects One Item

The regular `toggle()` method only toggles the **first** matching item:

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: false },
  { id: 3, text: 'Read book', done: false }
]);

// ❌ toggle() - only affects the FIRST match
todos.toggle(item => item.done === false, 'done');

console.log(todos.items[0].done); // true (toggled)
console.log(todos.items[1].done); // false (unchanged)
console.log(todos.items[2].done); // false (unchanged)
// Only the first item was toggled!
```

**Problems:**
- Can't toggle multiple items at once
- Need to loop manually to toggle all
- Verbose code for common operations

### The Solution: `toggleAll()` Affects All Matches

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: false },
  { id: 3, text: 'Read book', done: false }
]);

// ✅ toggleAll() - affects ALL matches
const count = todos.toggleAll(item => item.done === false, 'done');

console.log(count); // 3 (number of items toggled)
console.log(todos.items[0].done); // true (toggled)
console.log(todos.items[1].done); // true (toggled)
console.log(todos.items[2].done); // true (toggled)
// All items were toggled!
```

**Benefits:**
- Toggles all matching items at once
- Returns count of items toggled
- Clean, simple API
- Perfect for "select all" / "mark all" features

---

## How It Works

### The Syntax

```javascript
const count = collection.toggleAll(predicate, field);
```

### Parameters

1. **`predicate`** `{Function}` - A function that returns `true` for items to toggle
   - Receives: `(item, index)` 
   - Returns: `true` to toggle this item, `false` to skip it

2. **`field`** `{String}` - The boolean field to toggle (default: `'done'`)

### Returns

- **`{Number}`** - The count of items that were toggled

### What It Does

1. Tests each item with the predicate function
2. For every item that matches, toggles the specified field: `true` → `false`, `false` → `true`
3. Returns the number of items toggled
4. Triggers reactive updates

---

## Basic Usage

### Toggle All Items

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: true },
  { id: 3, text: 'Read book', done: false }
]);

// Toggle all items (regardless of current state)
const count = todos.toggleAll(item => true, 'done');

console.log(count); // 3
console.log(todos.items[0].done); // true (was false)
console.log(todos.items[1].done); // false (was true)
console.log(todos.items[2].done); // true (was false)
```

### Toggle Matching Items Only

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: true },
  { id: 3, text: 'Read book', done: false }
]);

// Toggle only completed items
const count = todos.toggleAll(item => item.done, 'done');

console.log(count); // 1 (only one was done)
console.log(todos.items[0].done); // false (unchanged)
console.log(todos.items[1].done); // false (was true, now toggled)
console.log(todos.items[2].done); // false (unchanged)
```

### Toggle with Different Field

```javascript
const items = ReactiveUtils.collection([
  { id: 1, name: 'Item 1', selected: false, active: true },
  { id: 2, name: 'Item 2', selected: false, active: true },
  { id: 3, name: 'Item 3', selected: false, active: true }
]);

// Toggle 'selected' field for all items
items.toggleAll(item => true, 'selected');

console.log(items.items.every(i => i.selected)); // true

// Toggle 'active' field for all items
items.toggleAll(item => true, 'active');

console.log(items.items.every(i => !i.active)); // true
```

---

## Simple Examples Explained

### Example 1: Select All / Deselect All

```javascript
const files = ReactiveUtils.collection([
  { id: 1, name: 'document.pdf', selected: false },
  { id: 2, name: 'image.jpg', selected: false },
  { id: 3, name: 'video.mp4', selected: false }
]);

// Check if all selected
const allSelected = files.items.every(f => f.selected);

if (allSelected) {
  // Deselect all
  files.toggleAll(item => item.selected, 'selected');
  console.log('Deselected all files');
} else {
  // Select all
  files.toggleAll(item => !item.selected, 'selected');
  console.log('Selected all files');
}

// Display
ReactiveUtils.effect(() => {
  const selectedCount = files.items.filter(f => f.selected).length;
  document.getElementById('selection-info').textContent = 
    `${selectedCount} of ${files.length} selected`;
});
```

---

### Example 2: Mark All as Complete

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: false },
  { id: 3, text: 'Read book', done: true }
]);

function completeAll() {
  // Toggle all incomplete items (make them complete)
  const count = todos.toggleAll(item => !item.done, 'done');
  alert(`Marked ${count} todos as complete`);
}

function uncompleteAll() {
  // Toggle all complete items (make them incomplete)
  const count = todos.toggleAll(item => item.done, 'done');
  alert(`Marked ${count} todos as incomplete`);
}

// Display todos
ReactiveUtils.effect(() => {
  const container = document.getElementById('todos');
  const completed = todos.items.filter(t => t.done).length;

  container.innerHTML = `
    <h3>Todos (${completed}/${todos.length} completed)</h3>
    ${todos.items.map(todo => `
      <div class="todo ${todo.done ? 'completed' : ''}">
        <input type="checkbox" 
               ${todo.done ? 'checked' : ''}
               onchange="toggleTodo(${todo.id})">
        <span>${todo.text}</span>
      </div>
    `).join('')}
    <button onclick="completeAll()">Mark All Complete</button>
    <button onclick="uncompleteAll()">Mark All Incomplete</button>
  `;
});
```

---

### Example 3: Category Toggle

```javascript
const tasks = ReactiveUtils.collection([
  { id: 1, title: 'Design homepage', category: 'work', active: true },
  { id: 2, title: 'Grocery shopping', category: 'personal', active: true },
  { id: 3, title: 'Review code', category: 'work', active: true },
  { id: 4, title: 'Exercise', category: 'personal', active: true }
]);

function toggleCategory(category) {
  const count = tasks.toggleAll(
    item => item.category === category,
    'active'
  );
  console.log(`Toggled ${count} ${category} tasks`);
}

// Display tasks by category
ReactiveUtils.effect(() => {
  const workTasks = tasks.items.filter(t => t.category === 'work');
  const personalTasks = tasks.items.filter(t => t.category === 'personal');

  const workActive = workTasks.filter(t => t.active).length;
  const personalActive = personalTasks.filter(t => t.active).length;

  document.getElementById('categories').innerHTML = `
    <div class="category">
      <h4>Work (${workActive}/${workTasks.length} active)</h4>
      <button onclick="toggleCategory('work')">Toggle All Work</button>
      ${workTasks.map(t => `
        <div class="task ${t.active ? 'active' : 'inactive'}">
          ${t.title}
        </div>
      `).join('')}
    </div>
    <div class="category">
      <h4>Personal (${personalActive}/${personalTasks.length} active)</h4>
      <button onclick="toggleCategory('personal')">Toggle All Personal</button>
      ${personalTasks.map(t => `
        <div class="task ${t.active ? 'active' : 'inactive'}">
          ${t.title}
        </div>
      `).join('')}
    </div>
  `;
});

// Usage
toggleCategory('work'); // Deactivates all work tasks
toggleCategory('work'); // Reactivates all work tasks
```

---

## Real-World Example: File Manager with Bulk Selection

```javascript
const files = ReactiveUtils.collection([
  { id: 1, name: 'Report.pdf', type: 'document', selected: false, starred: false },
  { id: 2, name: 'Photo.jpg', type: 'image', selected: false, starred: false },
  { id: 3, name: 'Video.mp4', type: 'video', selected: false, starred: false },
  { id: 4, name: 'Data.xlsx', type: 'document', selected: false, starred: false },
  { id: 5, name: 'Backup.zip', type: 'archive', selected: false, starred: false }
]);

const fileManager = {
  // Select/deselect all files
  toggleSelectAll() {
    const allSelected = files.items.every(f => f.selected);
    
    if (allSelected) {
      // Deselect all
      const count = files.toggleAll(item => item.selected, 'selected');
      console.log(`Deselected ${count} files`);
    } else {
      // Select all
      const count = files.toggleAll(item => !item.selected, 'selected');
      console.log(`Selected ${count} files`);
    }
  },

  // Select all of a specific type
  selectAllOfType(type) {
    const count = files.toggleAll(
      item => item.type === type && !item.selected,
      'selected'
    );
    console.log(`Selected ${count} ${type} files`);
  },

  // Deselect all of a specific type
  deselectAllOfType(type) {
    const count = files.toggleAll(
      item => item.type === type && item.selected,
      'selected'
    );
    console.log(`Deselected ${count} ${type} files`);
  },

  // Star all selected files
  starSelected() {
    const count = files.toggleAll(
      item => item.selected && !item.starred,
      'starred'
    );
    console.log(`Starred ${count} files`);
  },

  // Unstar all selected files
  unstarSelected() {
    const count = files.toggleAll(
      item => item.selected && item.starred,
      'starred'
    );
    console.log(`Unstarred ${count} files`);
  },

  // Invert selection
  invertSelection() {
    const count = files.toggleAll(item => true, 'selected');
    console.log(`Inverted selection for ${count} files`);
  },

  getSelectionInfo() {
    const selected = files.items.filter(f => f.selected);
    return {
      count: selected.length,
      types: [...new Set(selected.map(f => f.type))],
      starred: selected.filter(f => f.starred).length
    };
  }
};

// Display file manager
ReactiveUtils.effect(() => {
  const container = document.getElementById('file-manager');
  const info = fileManager.getSelectionInfo();
  const allSelected = files.items.every(f => f.selected);

  container.innerHTML = `
    <div class="file-manager">
      <div class="toolbar">
        <label>
          <input type="checkbox" 
                 ${allSelected ? 'checked' : ''}
                 onchange="fileManager.toggleSelectAll()">
          Select All
        </label>
        <span class="selection-info">
          ${info.count} selected
          ${info.count > 0 ? `(${info.types.join(', ')})` : ''}
        </span>
        <div class="actions">
          <button onclick="fileManager.starSelected()" 
                  ${info.count === 0 ? 'disabled' : ''}>
            Star Selected
          </button>
          <button onclick="fileManager.invertSelection()">
            Invert Selection
          </button>
        </div>
      </div>

      <div class="type-filters">
        <button onclick="fileManager.selectAllOfType('document')">
          Select All Documents
        </button>
        <button onclick="fileManager.selectAllOfType('image')">
          Select All Images
        </button>
        <button onclick="fileManager.selectAllOfType('video')">
          Select All Videos
        </button>
      </div>

      <div class="file-list">
        ${files.items.map(file => `
          <div class="file ${file.selected ? 'selected' : ''}">
            <input type="checkbox" 
                   ${file.selected ? 'checked' : ''}
                   onchange="toggleFile(${file.id})">
            <span class="file-icon">${getFileIcon(file.type)}</span>
            <span class="file-name">${file.name}</span>
            <span class="file-type">${file.type}</span>
            ${file.starred ? '<span class="star">⭐</span>' : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
});

function getFileIcon(type) {
  const icons = {
    document: '📄',
    image: '🖼️',
    video: '🎥',
    archive: '📦'
  };
  return icons[type] || '📁';
}

function toggleFile(id) {
  files.toggle(f => f.id === id, 'selected');
}

// Usage examples
fileManager.toggleSelectAll(); // Select all files
fileManager.selectAllOfType('document'); // Select all documents
fileManager.starSelected(); // Star selected files
fileManager.invertSelection(); // Invert selection
```

---

## Advanced Example: Smart Toggle

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: true },
  { id: 3, text: 'Read book', done: false },
  { id: 4, text: 'Exercise', done: true }
]);

// Smart toggle: if all done, mark all as incomplete; otherwise mark all as complete
function smartToggleAll() {
  const allDone = todos.items.every(t => t.done);
  
  if (allDone) {
    // All are complete, so mark all as incomplete
    const count = todos.toggleAll(item => item.done, 'done');
    console.log(`Marked ${count} todos as incomplete`);
  } else {
    // Not all complete, so mark all as complete
    const count = todos.toggleAll(item => !item.done, 'done');
    console.log(`Marked ${count} todos as complete`);
  }
}

// Display with smart toggle button
ReactiveUtils.effect(() => {
  const container = document.getElementById('todos');
  const allDone = todos.items.every(t => t.done);
  const completed = todos.items.filter(t => t.done).length;

  container.innerHTML = `
    <div class="todo-app">
      <h3>Todos (${completed}/${todos.length} completed)</h3>
      <button onclick="smartToggleAll()">
        ${allDone ? '↩️ Mark All Incomplete' : '✓ Mark All Complete'}
      </button>
      <ul>
        ${todos.items.map(todo => `
          <li class="${todo.done ? 'done' : ''}">
            <input type="checkbox" 
                   ${todo.done ? 'checked' : ''}
                   onchange="toggleTodo(${todo.id})">
            ${todo.text}
          </li>
        `).join('')}
      </ul>
    </div>
  `;
});

function toggleTodo(id) {
  todos.toggle(t => t.id === id, 'done');
}

// Usage
smartToggleAll(); // Marks all incomplete items as complete
smartToggleAll(); // Marks all complete items as incomplete
```

---

## Comparison: `toggle()` vs `toggleAll()`

### `toggle()` - Affects FIRST Match Only

```javascript
const items = ReactiveUtils.collection([
  { id: 1, active: false },
  { id: 2, active: false },
  { id: 3, active: false }
]);

// Only toggles the FIRST item
items.toggle(item => item.active === false, 'active');

console.log(items.items[0].active); // true (toggled)
console.log(items.items[1].active); // false (unchanged)
console.log(items.items[2].active); // false (unchanged)
```

### `toggleAll()` - Affects ALL Matches

```javascript
const items = ReactiveUtils.collection([
  { id: 1, active: false },
  { id: 2, active: false },
  { id: 3, active: false }
]);

// Toggles ALL matching items
const count = items.toggleAll(item => item.active === false, 'active');

console.log(count); // 3
console.log(items.items[0].active); // true (toggled)
console.log(items.items[1].active); // true (toggled)
console.log(items.items[2].active); // true (toggled)
```

### When to Use Each

**Use `toggle()` when:**
- ✅ Toggling a specific item by unique ID
- ✅ You want to toggle only one item
- ✅ Working with individual item interactions

```javascript
// Toggle ONE specific item
todos.toggle(item => item.id === 5, 'done');
```

**Use `toggleAll()` when:**
- ✅ "Select All" / "Deselect All" functionality
- ✅ "Mark all as complete" features
- ✅ Bulk operations on matching items
- ✅ Category-based toggling

```javascript
// Toggle ALL matching items
todos.toggleAll(item => item.category === 'work', 'done');
```

---

## Common Patterns

### Pattern 1: Select All / Deselect All

```javascript
const allSelected = items.items.every(i => i.selected);

if (allSelected) {
  items.toggleAll(item => item.selected, 'selected');
} else {
  items.toggleAll(item => !item.selected, 'selected');
}
```

### Pattern 2: Mark All as Complete

```javascript
// Mark all incomplete items as complete
const count = todos.toggleAll(item => !item.done, 'done');
```

### Pattern 3: Category Toggle

```javascript
// Toggle all items in a specific category
const count = items.toggleAll(
  item => item.category === targetCategory,
  'active'
);
```

### Pattern 4: Invert Selection

```javascript
// Toggle all items (inverts selection)
const count = items.toggleAll(item => true, 'selected');
```

### Pattern 5: Conditional Bulk Toggle

```javascript
// Toggle all items meeting multiple conditions
const count = items.toggleAll(
  item => item.priority === 'high' && !item.archived,
  'urgent'
);
```

---

## Common Questions

### Q: Does it modify the original collection?

**Answer:** Yes, it toggles items in place:

```javascript
const items = ReactiveUtils.collection([
  { id: 1, done: false },
  { id: 2, done: false }
]);

items.toggleAll(item => true, 'done');

console.log(items.items[0].done); // true (modified)
console.log(items.items[1].done); // true (modified)
```

### Q: What does it return?

**Answer:** Returns the count of items toggled:

```javascript
const count = items.toggleAll(item => item.active, 'active');
console.log(count); // Number of items that were toggled
```

### Q: What if no items match?

**Answer:** Returns 0:

```javascript
const count = items.toggleAll(item => item.id === 999, 'done');
console.log(count); // 0 (no items matched)
```

### Q: Is it reactive?

**Answer:** Yes! Triggers reactive updates:

```javascript
ReactiveUtils.effect(() => {
  console.log('Items changed:', items.length);
});

items.toggleAll(item => true, 'selected'); // Effect runs
```

### Q: Can I toggle different fields?

**Answer:** Yes! Specify any boolean field:

```javascript
items.toggleAll(item => true, 'selected');
items.toggleAll(item => true, 'active');
items.toggleAll(item => true, 'starred');
items.toggleAll(item => true, 'archived');
```

### Q: What if the field doesn't exist?

**Answer:** It will be created and set to `true`:

```javascript
const items = ReactiveUtils.collection([
  { id: 1, name: 'Item 1' } // No 'selected' field
]);

items.toggleAll(item => true, 'selected');

console.log(items.items[0].selected); // true (created)
```

---

## Tips for Success

### 1. Use with Smart Logic

```javascript
// ✅ Check current state before toggling
const allDone = todos.items.every(t => t.done);

if (allDone) {
  todos.toggleAll(item => item.done, 'done');
} else {
  todos.toggleAll(item => !item.done, 'done');
}
```

### 2. Combine with Other Methods

```javascript
// ✅ Chain operations
todos
  .toggleAll(item => item.priority === 'low', 'done')
  .sort((a, b) => a.id - b.id);
```

### 3. Use Return Value

```javascript
// ✅ Check how many were toggled
const count = items.toggleAll(item => item.active, 'active');

if (count > 0) {
  console.log(`Toggled ${count} items`);
} else {
  console.log('No items to toggle');
}
```

### 4. Conditional Predicates

```javascript
// ✅ Complex conditions
const count = tasks.toggleAll(
  item => item.status === 'pending' && 
          item.priority === 'high' &&
          !item.archived,
  'urgent'
);
```

### 5. Don't Forget to Specify the Field

```javascript
// ✅ Specify field explicitly
items.toggleAll(item => true, 'selected');

// ⚠️ Without field, defaults to 'done'
items.toggleAll(item => true); // Toggles 'done' field
```

---

## Installation

Add this extension after loading the collections module:

```javascript
// Load the toggleAll extension
<script src="path/to/toggleAll-extension.js"></script>

// Now available on all collections
const items = ReactiveUtils.collection([]);
items.toggleAll(item => true, 'selected'); // Works!
```

---

## Summary

### What `toggleAll()` Does:

1. ✅ Toggles **all** items that match the predicate
2. ✅ Returns the count of items toggled
3. ✅ Accepts any boolean field name
4. ✅ Triggers reactive updates
5. ✅ Perfect for bulk operations
6. ✅ Works with any predicate condition

### The Basic Pattern:

```javascript
const collection = ReactiveUtils.collection([
  { id: 1, done: false },
  { id: 2, done: false },
  { id: 3, done: false }
]);

// Toggle all items
const count = collection.toggleAll(item => true, 'done');

console.log(count); // 3
console.log(collection.items.every(i => i.done)); // true

// Toggle matching items only
const count2 = collection.toggleAll(item => item.done, 'done');

console.log(count2); // 3
console.log(collection.items.every(i => !i.done)); // true
```

### Key Differences from `toggle()`:

| Feature | `toggle()` | `toggleAll()` |
|---------|-----------|---------------|
| Affects | First match only | All matches |
| Returns | Collection (`this`) | Count (number) |
| Use case | Single item | Bulk operations |
| Example | Toggle specific todo | Select all / Mark all complete |

### When to Use It:

- ✅ "Select All" / "Deselect All" buttons
- ✅ "Mark all as complete" functionality
- ✅ Bulk selection operations
- ✅ Category-based toggling
- ✅ Invert selection features
- ✅ Smart toggle (all on/all off)

---

**Remember:** `toggleAll()` is your go-to method for bulk boolean operations. It toggles **all matching items** at once and returns the count, making it perfect for "Select All", "Mark All Complete", and other bulk operations! 🎉