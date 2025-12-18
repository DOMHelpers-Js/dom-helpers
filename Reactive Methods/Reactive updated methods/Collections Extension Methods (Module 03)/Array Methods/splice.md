# Understanding `splice()` - A Beginner's Guide

## What is `splice()`?

`splice()` is a method for reactive collections that adds, removes, or replaces items in place. It works like JavaScript's array `splice()` and triggers reactivity.

Think of it as **collection editor** - modify items at any position.

---

## Why Does This Exist?

### The Problem: Modifying Collections

You need to add, remove, or replace items at specific positions:

```javascript
// ❌ Without splice - complex manual work
const items = ReactiveUtils.collection([1, 2, 3, 4, 5]);

// Remove 2 items starting at index 1, add 99
const removed = [];
removed.push(items[1], items[2]);
items[1] = 99;
// This gets messy...

// ✅ With splice() - clean
const removed = items.splice(1, 2, 99); // [2, 3]
console.log(items); // [1, 99, 4, 5]
```

**Why this matters:**
- Multi-purpose method
- Modifies in place
- Returns removed items
- Triggers reactivity

---

## How Does It Work?

### The Splice Process

```javascript
collection.splice(start, deleteCount, ...itemsToAdd)
    ↓
Removes deleteCount items from start
Inserts itemsToAdd at start
    ↓
Returns array of removed items
Triggers reactive updates
```

---

## Basic Usage

### Remove Items

```javascript
const items = ReactiveUtils.collection(['a', 'b', 'c', 'd', 'e']);

const removed = items.splice(1, 2); // Remove 2 from index 1
console.log(removed); // ['b', 'c']
console.log(items); // ['a', 'd', 'e']
```

### Add Items

```javascript
const items = ReactiveUtils.collection(['a', 'b', 'e']);

items.splice(2, 0, 'c', 'd'); // Insert at index 2
console.log(items); // ['a', 'b', 'c', 'd', 'e']
```

### Replace Items

```javascript
const items = ReactiveUtils.collection(['a', 'b', 'c', 'd']);

items.splice(1, 2, 'X', 'Y'); // Replace 2 items with 2 new ones
console.log(items); // ['a', 'X', 'Y', 'd']
```

---

## Simple Examples Explained

### Example 1: Todo List Management

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, title: 'Buy milk', done: false },
  { id: 2, title: 'Walk dog', done: false },
  { id: 3, title: 'Read book', done: true }
]);

// Remove todo at index
function removeTodoAt(index) {
  const removed = todos.splice(index, 1);
  console.log(`Removed: ${removed[0].title}`);
}

// Insert todo at index
function insertTodoAt(index, todo) {
  todos.splice(index, 0, todo);
}

// Replace todo at index
function replaceTodoAt(index, newTodo) {
  todos.splice(index, 1, newTodo);
}

// Move todo to different position
function moveTodo(fromIndex, toIndex) {
  const [todo] = todos.splice(fromIndex, 1);
  todos.splice(toIndex, 0, todo);
}

// Display todos
ReactiveUtils.effect(() => {
  const container = document.getElementById('todos');
  container.innerHTML = todos
    .map((todo, index) => `
      <div class="todo ${todo.done ? 'done' : ''}">
        <span>${todo.title}</span>
        <button onclick="removeTodoAt(${index})">Remove</button>
      </div>
    `)
    .join('');
});
```

---

### Example 2: Insert/Remove in List

```javascript
const items = ReactiveUtils.collection([1, 2, 3, 4, 5]);

const editor = ReactiveUtils.state({
  selectedIndex: 0
});

// Insert before selected
function insertBefore(value) {
  items.splice(editor.selectedIndex, 0, value);
}

// Insert after selected
function insertAfter(value) {
  items.splice(editor.selectedIndex + 1, 0, value);
}

// Remove selected
function removeSelected() {
  if (items.length > 0) {
    items.splice(editor.selectedIndex, 1);
    if (editor.selectedIndex >= items.length) {
      editor.selectedIndex = items.length - 1;
    }
  }
}

// Replace selected
function replaceSelected(value) {
  items.splice(editor.selectedIndex, 1, value);
}

// Display
ReactiveUtils.effect(() => {
  const container = document.getElementById('items');
  container.innerHTML = items
    .map((item, index) => `
      <div class="item ${index === editor.selectedIndex ? 'selected' : ''}"
           onclick="editor.selectedIndex = ${index}">
        ${item}
      </div>
    `)
    .join('');
});
```

---

## Real-World Example: Drag and Drop Reordering

```javascript
const tasks = ReactiveUtils.collection([
  { id: 1, title: 'Task 1', status: 'pending' },
  { id: 2, title: 'Task 2', status: 'pending' },
  { id: 3, title: 'Task 3', status: 'pending' },
  { id: 4, title: 'Task 4', status: 'pending' }
]);

const dragState = ReactiveUtils.state({
  draggedIndex: null,
  draggedOver: null
});

// Start dragging
function handleDragStart(index) {
  dragState.draggedIndex = index;
}

// Dragging over
function handleDragOver(index) {
  dragState.draggedOver = index;
}

// Drop
function handleDrop(targetIndex) {
  if (dragState.draggedIndex !== null && dragState.draggedIndex !== targetIndex) {
    // Remove from original position
    const [task] = tasks.splice(dragState.draggedIndex, 1);

    // Insert at new position
    const newIndex = targetIndex > dragState.draggedIndex
      ? targetIndex - 1
      : targetIndex;

    tasks.splice(newIndex, 0, task);
  }

  dragState.draggedIndex = null;
  dragState.draggedOver = null;
}

// Display tasks
ReactiveUtils.effect(() => {
  const container = document.getElementById('tasks');
  container.innerHTML = tasks
    .map((task, index) => `
      <div class="task ${dragState.draggedOver === index ? 'drag-over' : ''}"
           draggable="true"
           ondragstart="handleDragStart(${index})"
           ondragover="event.preventDefault(); handleDragOver(${index})"
           ondrop="handleDrop(${index})">
        <span class="handle">☰</span>
        <span>${task.title}</span>
      </div>
    `)
    .join('');
});
```

---

## Common Patterns

### Pattern 1: Remove N Items

```javascript
collection.splice(index, count);
```

### Pattern 2: Insert Items

```javascript
collection.splice(index, 0, ...items);
```

### Pattern 3: Replace Items

```javascript
collection.splice(index, count, ...newItems);
```

### Pattern 4: Clear All

```javascript
collection.splice(0, collection.length);
// Or: collection.length = 0
```

---

## Common Questions

### Q: Does it modify the original?

**Answer:** Yes, modifies in place:

```javascript
const items = ReactiveUtils.collection([1, 2, 3]);
items.splice(1, 1);
console.log(items); // [1, 3] - modified
```

### Q: What does it return?

**Answer:** Array of removed items:

```javascript
const removed = items.splice(1, 2);
console.log(removed); // [2, 3]
```

### Q: Is it reactive?

**Answer:** Yes, triggers updates:

```javascript
ReactiveUtils.effect(() => {
  console.log(items.length);
});
items.splice(0, 1); // Effect runs
```

---

## Summary

### What `splice()` Does:

1. ✅ Removes items
2. ✅ Adds items
3. ✅ Replaces items
4. ✅ Modifies in place
5. ✅ Returns removed items

### When to Use It:

- Remove at position
- Insert at position
- Replace items
- Reorder items
- Batch modifications

### The Basic Pattern:

```javascript
const collection = ReactiveUtils.collection([1, 2, 3, 4, 5]);

// Remove
collection.splice(1, 2); // [1, 4, 5]

// Insert
collection.splice(1, 0, 99); // [1, 99, 4, 5]

// Replace
collection.splice(1, 1, 88); // [1, 88, 4, 5]
```

---

**Remember:** `splice()` modifies the collection and triggers reactivity! 🎉
