# Understanding `indexOf()` - A Beginner's Guide

## What is `indexOf()`?

`indexOf()` is a method for reactive collections that returns the first index where an item is found. It works like JavaScript's array `indexOf()` and returns `-1` if not found.

Think of it as **position finder** - where is this item located?

---

## Why Does This Exist?

### The Problem: Finding Item Position

You need to know where an item is located in a collection:

```javascript
// ❌ Without indexOf - manual search
const items = ReactiveUtils.collection(['a', 'b', 'c', 'd', 'e']);

let position = -1;
for (let i = 0; i < items.length; i++) {
  if (items[i] === 'c') {
    position = i;
    break;
  }
}
console.log(position); // 2

// ✅ With indexOf() - clean
console.log(items.indexOf('c')); // 2
```

**Why this matters:**
- Quick position lookup
- Cleaner syntax
- Familiar array method
- Returns -1 if not found

---

## How Does It Work?

### The IndexOf Process

```javascript
collection.indexOf(value)
    ↓
Searches for first occurrence
    ↓
Returns index or -1
```

---

## Basic Usage

### Find Item Index

```javascript
const items = ReactiveUtils.collection(['apple', 'banana', 'cherry']);

console.log(items.indexOf('banana')); // 1
console.log(items.indexOf('grape')); // -1 (not found)
```

### Check if Exists

```javascript
const numbers = ReactiveUtils.collection([10, 20, 30, 40]);

if (numbers.indexOf(30) !== -1) {
  console.log('Found 30');
}

// More readable
if (numbers.indexOf(50) === -1) {
  console.log('50 not found');
}
```

### With Start Index

```javascript
const items = ReactiveUtils.collection([1, 2, 3, 2, 4]);

console.log(items.indexOf(2)); // 1 (first occurrence)
console.log(items.indexOf(2, 2)); // 3 (search from index 2)
```

---

## Simple Examples Explained

### Example 1: Remove Item by Value

```javascript
const todoList = ReactiveUtils.collection([
  'Buy milk',
  'Walk dog',
  'Read book',
  'Call mom'
]);

// Remove todo by value
function removeTodo(todo) {
  const index = todoList.indexOf(todo);

  if (index !== -1) {
    todoList.splice(index, 1);
    console.log(`Removed: ${todo}`);
  } else {
    console.log(`Todo not found: ${todo}`);
  }
}

// Display todos
ReactiveUtils.effect(() => {
  const container = document.getElementById('todos');

  container.innerHTML = todoList
    .map((todo, index) => `
      <div class="todo">
        <span>${index + 1}. ${todo}</span>
        <button onclick="removeTodo('${todo}')">Remove</button>
      </div>
    `)
    .join('');
});

// Usage
removeTodo('Walk dog');
```

---

### Example 2: Reorder Items

```javascript
const playlist = ReactiveUtils.collection([
  'Song 1',
  'Song 2',
  'Song 3',
  'Song 4'
]);

// Move item up
function moveUp(song) {
  const index = playlist.indexOf(song);

  if (index > 0) {
    // Remove from current position
    playlist.splice(index, 1);
    // Insert one position earlier
    playlist.splice(index - 1, 0, song);
  }
}

// Move item down
function moveDown(song) {
  const index = playlist.indexOf(song);

  if (index !== -1 && index < playlist.length - 1) {
    // Remove from current position
    playlist.splice(index, 1);
    // Insert one position later
    playlist.splice(index + 1, 0, song);
  }
}

// Move to position
function moveTo(song, newIndex) {
  const currentIndex = playlist.indexOf(song);

  if (currentIndex !== -1) {
    playlist.splice(currentIndex, 1);
    playlist.splice(newIndex, 0, song);
  }
}

// Display playlist
ReactiveUtils.effect(() => {
  const container = document.getElementById('playlist');

  container.innerHTML = playlist
    .map((song, index) => `
      <div class="song">
        <span>${index + 1}. ${song}</span>
        <button onclick="moveUp('${song}')"
                ${index === 0 ? 'disabled' : ''}>↑</button>
        <button onclick="moveDown('${song}')"
                ${index === playlist.length - 1 ? 'disabled' : ''}>↓</button>
      </div>
    `)
    .join('');
});
```

---

### Example 3: Toggle Selection

```javascript
const availableItems = ReactiveUtils.collection(['Item A', 'Item B', 'Item C', 'Item D']);
const selectedItems = ReactiveUtils.collection([]);

// Toggle item selection
function toggleItem(item) {
  const index = selectedItems.indexOf(item);

  if (index !== -1) {
    // Already selected - remove
    selectedItems.splice(index, 1);
  } else {
    // Not selected - add
    selectedItems.push(item);
  }
}

// Check if selected
function isSelected(item) {
  return selectedItems.indexOf(item) !== -1;
}

// Display items
ReactiveUtils.effect(() => {
  const container = document.getElementById('items');

  container.innerHTML = availableItems
    .map(item => {
      const selected = isSelected(item);
      return `
        <div class="item ${selected ? 'selected' : ''}"
             onclick="toggleItem('${item}')">
          ${item}
          ${selected ? '✓' : ''}
        </div>
      `;
    })
    .join('');
});

// Display selected count
ReactiveUtils.effect(() => {
  document.getElementById('count').textContent =
    `${selectedItems.length} selected`;
});
```

---

## Real-World Example: Priority Queue Manager

```javascript
const tasks = ReactiveUtils.collection([
  { id: 1, title: 'Fix bug', priority: 'high' },
  { id: 2, title: 'Update docs', priority: 'low' },
  { id: 3, title: 'Review PR', priority: 'medium' },
  { id: 4, title: 'Deploy', priority: 'high' }
]);

// Find task index by ID
function findTaskIndex(taskId) {
  // Note: indexOf won't work for objects, use findIndex
  return tasks.findIndex(t => t.id === taskId);
}

// Move task to top
function moveToTop(taskId) {
  const index = findTaskIndex(taskId);

  if (index > 0) {
    const task = tasks[index];
    tasks.splice(index, 1);
    tasks.unshift(task);
  }
}

// Move task to bottom
function moveToBottom(taskId) {
  const index = findTaskIndex(taskId);

  if (index !== -1 && index < tasks.length - 1) {
    const task = tasks[index];
    tasks.splice(index, 1);
    tasks.push(task);
  }
}

// Change priority (affects position)
function changePriority(taskId, newPriority) {
  const index = findTaskIndex(taskId);

  if (index !== -1) {
    tasks[index].priority = newPriority;

    // Re-sort by priority
    sortByPriority();
  }
}

// Sort by priority
function sortByPriority() {
  const priorityOrder = { high: 0, medium: 1, low: 2 };

  tasks.sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

// Display tasks
ReactiveUtils.effect(() => {
  const container = document.getElementById('tasks');

  container.innerHTML = tasks
    .map((task, index) => `
      <div class="task priority-${task.priority}">
        <span class="position">#${index + 1}</span>
        <span class="title">${task.title}</span>
        <span class="priority">${task.priority}</span>
        <div class="actions">
          <button onclick="moveToTop(${task.id})"
                  ${index === 0 ? 'disabled' : ''}>Top</button>
          <button onclick="moveToBottom(${task.id})"
                  ${index === tasks.length - 1 ? 'disabled' : ''}>Bottom</button>
          <select onchange="changePriority(${task.id}, this.value)">
            <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
            <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
          </select>
        </div>
      </div>
    `)
    .join('');
});

// For primitive arrays, indexOf works directly
const simpleList = ReactiveUtils.collection(['A', 'B', 'C']);

function moveItemUp(value) {
  const index = simpleList.indexOf(value);
  if (index > 0) {
    simpleList.splice(index, 1);
    simpleList.splice(index - 1, 0, value);
  }
}
```

---

## Common Patterns

### Pattern 1: Check Existence

```javascript
if (collection.indexOf(item) !== -1) {
  console.log('Found');
}

// Or use includes()
if (collection.includes(item)) {
  console.log('Found');
}
```

### Pattern 2: Remove Item

```javascript
const index = collection.indexOf(item);
if (index !== -1) {
  collection.splice(index, 1);
}
```

### Pattern 3: Replace Item

```javascript
const index = collection.indexOf(oldItem);
if (index !== -1) {
  collection[index] = newItem;
}
```

### Pattern 4: Toggle Selection

```javascript
const index = selected.indexOf(item);
if (index !== -1) {
  selected.splice(index, 1);
} else {
  selected.push(item);
}
```

---

## Common Questions

### Q: What if not found?

**Answer:** Returns `-1`:

```javascript
const items = ReactiveUtils.collection([1, 2, 3]);
console.log(items.indexOf(99)); // -1
```

### Q: Does it work with objects?

**Answer:** Only by reference:

```javascript
const obj = { id: 1 };
const items = ReactiveUtils.collection([obj]);

console.log(items.indexOf(obj)); // 0 (same reference)
console.log(items.indexOf({ id: 1 })); // -1 (different reference)

// Use findIndex for objects
const index = items.findIndex(i => i.id === 1); // 0
```

### Q: Find all occurrences?

**Answer:** Use loop with start index:

```javascript
const items = ReactiveUtils.collection([1, 2, 3, 2, 4]);
const indices = [];
let index = -1;

while ((index = items.indexOf(2, index + 1)) !== -1) {
  indices.push(index);
}
console.log(indices); // [1, 3]
```

---

## Tips for Success

### 1. Use for Primitive Values

```javascript
// ✅ Works great with primitives
const ids = ReactiveUtils.collection([1, 2, 3]);
const index = ids.indexOf(2);
```

### 2. Use findIndex for Objects

```javascript
// ✅ For object comparison
const index = items.findIndex(i => i.id === targetId);
```

### 3. Always Check Result

```javascript
// ✅ Check for -1
const index = items.indexOf(value);
if (index !== -1) {
  items.splice(index, 1);
}
```

---

## Summary

### What `indexOf()` Does:

1. ✅ Returns first index
2. ✅ Returns -1 if not found
3. ✅ Accepts start index
4. ✅ Uses strict equality
5. ✅ Works like array indexOf()

### When to Use It:

- Finding position
- Removing items
- Checking existence
- Reordering items
- Toggle selections

### The Basic Pattern:

```javascript
const collection = ReactiveUtils.collection(['a', 'b', 'c', 'd']);

// Find index
const index = collection.indexOf('c'); // 2

// Check if exists
if (collection.indexOf('e') === -1) {
  console.log('Not found');
}

// Remove by value
const index = collection.indexOf('b');
if (index !== -1) {
  collection.splice(index, 1);
}
```

---

**Remember:** `indexOf()` returns the position or -1. Always check for -1 before using the result! 🎉
