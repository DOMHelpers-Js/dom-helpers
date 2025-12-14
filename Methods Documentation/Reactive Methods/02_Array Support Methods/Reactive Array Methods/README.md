# Reactive Array Methods - Reference Guide

## Overview

When you use arrays inside `ReactiveUtils.state()`, all standard JavaScript array methods become reactive automatically. These methods work identically to their JavaScript counterparts but trigger reactivity.

---

## Automatically Patched Methods

These methods are automatically made reactive when arrays are in state:

### Mutating Methods (trigger reactivity):
- `push()` - Add items to end
- `pop()` - Remove item from end
- `shift()` - Remove item from start
- `unshift()` - Add items to start
- `splice()` - Add/remove/replace items
- `sort()` - Sort in place
- `reverse()` - Reverse order in place
- `fill()` - Fill with value
- `copyWithin()` - Copy within array

### Non-Mutating Methods (don't trigger, return new arrays):
- `map()`, `filter()`, `slice()`, `concat()`, etc.

---

## How It Works

```javascript
const state = ReactiveUtils.state({
  items: [1, 2, 3]
});

// All these methods are automatically reactive:
state.items.push(4);        // Reactive!
state.items.pop();          // Reactive!
state.items.splice(0, 1);   // Reactive!
state.items.sort();         // Reactive!
state.items.reverse();      // Reactive!
```

---

## Detailed Documentation

For detailed documentation on how each method works, see the **Collections Methods** section:

### Basic Array Operations:
- **[push()](../../Collections%20Methods/Array%20Methods/push.md)** - Add to end
- **[pop()](../../Collections%20Methods/Array%20Methods/pop.md)** - Remove from end
- **[shift()](../../Collections%20Methods/Array%20Methods/shift.md)** - Remove from start
- **[unshift()](../../Collections%20Methods/Array%20Methods/unshift.md)** - Add to start
- **[splice()](../../Collections%20Methods/Array%20Methods/splice.md)** - Add/remove/replace

### Sorting & Ordering:
- **[sort()](../../Collections%20Methods/Sorting%20&%20Ordering/sort.md)** - Sort array
- **[reverse()](../../Collections%20Methods/Sorting%20&%20Ordering/reverse.md)** - Reverse order

### Additional Methods:
- **fill()** - Fill array with value (see below)
- **copyWithin()** - Copy elements within array (see below)

---

## Key Differences from Collections

While the methods work the same way, there are some differences:

### `ReactiveUtils.state()` Arrays:
```javascript
const state = ReactiveUtils.state({
  items: [1, 2, 3]  // Part of state object
});

state.items.push(4);  // Reactive
```

### `ReactiveUtils.collection()`:
```javascript
const items = ReactiveUtils.collection([1, 2, 3]);  // Standalone collection

items.push(4);  // Reactive
```

**Main difference:** State arrays are properties of an object, while collections are standalone reactive arrays.

---

## Quick Examples

### Example 1: Todo List

```javascript
const state = ReactiveUtils.state({
  todos: []
});

// Add todo
function addTodo(title) {
  state.todos.push({
    id: Date.now(),
    title: title,
    completed: false
  });
}

// Remove todo
function removeTodo(id) {
  const index = state.todos.findIndex(t => t.id === id);
  state.todos.splice(index, 1);
}

// Sort todos
function sortTodos() {
  state.todos.sort((a, b) => a.title.localeCompare(b.title));
}

// Display
ReactiveUtils.effect(() => {
  console.log(`${state.todos.length} todos`);
});
```

---

### Example 2: Stack Operations

```javascript
const state = ReactiveUtils.state({
  stack: []
});

function push(value) {
  state.stack.push(value);
}

function pop() {
  return state.stack.pop();
}

function peek() {
  return state.stack[state.stack.length - 1];
}

// Display stack
ReactiveUtils.effect(() => {
  console.log('Stack:', state.stack);
});
```

---

## fill() Method

The `fill()` method fills all or part of an array with a static value:

```javascript
const state = ReactiveUtils.state({
  slots: new Array(5).fill(null)
});

// Fill all with value
state.slots.fill('empty');  // ['empty', 'empty', 'empty', 'empty', 'empty']

// Fill range
state.slots.fill('full', 0, 3);  // ['full', 'full', 'full', 'empty', 'empty']
```

### Usage Example:

```javascript
const gameState = ReactiveUtils.state({
  board: new Array(9).fill(null)  // Tic-tac-toe board
});

function makeMove(position, player) {
  if (gameState.board[position] === null) {
    gameState.board[position] = player;
  }
}

function resetBoard() {
  gameState.board.fill(null);  // Clear board
}
```

---

## copyWithin() Method

The `copyWithin()` method copies part of an array to another location in the same array:

```javascript
const state = ReactiveUtils.state({
  items: [1, 2, 3, 4, 5]
});

// Copy elements 3-4 to position 0
state.items.copyWithin(0, 3, 5);  // [4, 5, 3, 4, 5]
```

### Usage Example:

```javascript
const bufferState = ReactiveUtils.state({
  buffer: new Array(10).fill(0)
});

function shiftBuffer(newValue) {
  // Shift all elements left
  bufferState.buffer.copyWithin(0, 1);

  // Add new value at end
  bufferState.buffer[bufferState.buffer.length - 1] = newValue;
}
```

---

## Best Practices

### 1. Use Built-in Methods

```javascript
// ✅ Good - use built-in methods
state.items.push(item);
state.items.splice(index, 1);

// ❌ Avoid - manual assignment
state.items = [...state.items, item];
```

### 2. Batch Operations

```javascript
// ✅ Good - single operation
state.items.push(...newItems);

// ❌ Avoid - multiple operations
newItems.forEach(item => state.items.push(item));
```

### 3. Check Arrays Exist

```javascript
// ✅ Good - check first
if (state.items && state.items.length > 0) {
  state.items.pop();
}
```

---

## Summary

### Key Points:

1. ✅ All array methods work automatically
2. ✅ Same behavior as JavaScript arrays
3. ✅ Trigger reactivity on mutation
4. ✅ No special syntax needed
5. ✅ See Collections Methods for details

### The Basic Pattern:

```javascript
const state = ReactiveUtils.state({
  items: []
});

// Use arrays normally - they're automatically reactive
state.items.push(item);
state.items.splice(0, 1);
state.items.sort();

// Works in effects
ReactiveUtils.effect(() => {
  console.log(state.items.length);
});
```

---

**Remember:** Arrays in state work exactly like JavaScript arrays, but with automatic reactivity! For detailed documentation on each method, see the Collections Methods section. 🎉
