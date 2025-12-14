# DOM Helpers - Reactive Array Patch v1.0.0

## 📚 Overview

The **Reactive Array Patch** makes array mutation methods (push, pop, sort, etc.) work seamlessly with the Reactive State system. Without this patch, direct array mutations don't trigger reactivity. This patch ensures all array operations automatically update reactive dependencies.

---

---

## 🎯 What Gets Patched

### Array Methods Made Reactive

The following array mutation methods are automatically patched:

1. **push()** - Add elements to end
2. **pop()** - Remove last element
3. **shift()** - Remove first element
4. **unshift()** - Add elements to beginning
5. **splice()** - Add/remove elements at index
6. **sort()** - Sort array in place
7. **reverse()** - Reverse array order
8. **fill()** - Fill array with static value
9. **copyWithin()** - Copy part of array to another location

---

## 🔧 Automatic Patching

### Basic Usage

Once loaded, **all arrays in reactive state are automatically patched**:

```javascript
// Create reactive state (arrays automatically patched)
const state = ReactiveUtils.state({
  todos: [
    { id: 1, text: "Task 1", done: false },
    { id: 2, text: "Task 2", done: true }
  ],
  numbers: [1, 2, 3, 4, 5],
  tags: ["javascript", "react", "vue"]
});

// All array methods now trigger reactivity!
state.todos.push({ id: 3, text: "Task 3", done: false });  // ✅ Triggers updates
state.numbers.sort((a, b) => b - a);  // ✅ Triggers updates
state.tags.splice(1, 1);  // ✅ Triggers updates
```

### Without Patch (Before)
```javascript
const state = ReactiveUtils.state({
  items: [1, 2, 3]
});

// ❌ This does NOT trigger reactivity
state.items.push(4);

// ✅ You had to manually reassign
state.items = [...state.items, 4];  // Triggers reactivity
```

### With Patch (After)
```javascript
const state = ReactiveUtils.state({
  items: [1, 2, 3]
});

// ✅ Now this DOES trigger reactivity!
state.items.push(4);
```

---

## 📝 Practical Examples

### Example 1: Todo List
```javascript
const state = ReactiveUtils.state({
  todos: [
    { id: 1, text: "Buy milk", done: false },
    { id: 2, text: "Walk dog", done: true }
  ]
});

// Bind to DOM
state.$bind({
  '#todoCount': () => `${state.todos.length} todos`
});

// Add todo - triggers update automatically
function addTodo(text) {
  state.todos.push({
    id: Date.now(),
    text,
    done: false
  });
  // DOM automatically updates!
}

// Remove todo - triggers update automatically
function removeTodo(id) {
  const index = state.todos.findIndex(t => t.id === id);
  if (index !== -1) {
    state.todos.splice(index, 1);
    // DOM automatically updates!
  }
}

// Sort todos - triggers update automatically
function sortTodos() {
  state.todos.sort((a, b) => a.text.localeCompare(b.text));
  // DOM automatically updates!
}
```

### Example 2: Shopping Cart
```javascript
const cart = ReactiveUtils.state({
  items: []
});

// Computed total
cart.$computed('total', function() {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

// Bind total to DOM
cart.$bind({
  '#cartTotal': () => `$${cart.total.toFixed(2)}`,
  '#itemCount': () => cart.items.length
});

// Add to cart - reactivity works!
function addToCart(product) {
  cart.items.push({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1
  });
}

// Remove from cart - reactivity works!
function removeFromCart(productId) {
  const index = cart.items.findIndex(item => item.id === productId);
  if (index !== -1) {
    cart.items.splice(index, 1);
  }
}

// Clear cart - reactivity works!
function clearCart() {
  cart.items = [];  // Or: cart.items.splice(0, cart.items.length);
}
```

### Example 3: Tag Manager
```javascript
const state = ReactiveUtils.state({
  tags: ["javascript", "html", "css"]
});

// Watch for changes
state.$watch('tags', (newTags, oldTags) => {
  console.log('Tags changed:', oldTags, '->', newTags);
});

// Bind to DOM
state.$bind({
  '#tagList': () => state.tags.join(', '),
  '#tagCount': () => `${state.tags.length} tags`
});

// Add tag
function addTag(tag) {
  if (!state.tags.includes(tag)) {
    state.tags.push(tag);  // Triggers watch + DOM update
  }
}

// Remove tag
function removeTag(tag) {
  const index = state.tags.indexOf(tag);
  if (index !== -1) {
    state.tags.splice(index, 1);  // Triggers watch + DOM update
  }
}

// Sort tags alphabetically
function sortTags() {
  state.tags.sort();  // Triggers watch + DOM update
}

// Reverse tags
function reverseTags() {
  state.tags.reverse();  // Triggers watch + DOM update
}
```

### Example 4: Number Array Operations
```javascript
const state = ReactiveUtils.state({
  numbers: [5, 2, 8, 1, 9, 3]
});

state.$computed('sum', function() {
  return this.numbers.reduce((a, b) => a + b, 0);
});

state.$computed('average', function() {
  return this.numbers.length > 0 ? this.sum / this.numbers.length : 0;
});

state.$computed('max', function() {
  return Math.max(...this.numbers);
});

// Bind computeds
state.$bind({
  '#sum': () => `Sum: ${state.sum}`,
  '#average': () => `Average: ${state.average.toFixed(2)}`,
  '#max': () => `Max: ${state.max}`
});

// All these operations trigger reactivity!
state.numbers.push(10);           // Add number
state.numbers.pop();              // Remove last
state.numbers.sort((a, b) => a - b);  // Sort ascending
state.numbers.reverse();          // Reverse order
state.numbers.unshift(0);         // Add to start
state.numbers.shift();            // Remove first
```

### Example 5: Nested Arrays
```javascript
const state = ReactiveUtils.state({
  categories: {
    work: ["Task 1", "Task 2"],
    personal: ["Exercise", "Shopping"],
    urgent: ["Pay bills"]
  }
});

// Watch nested array
state.$watch('categories.work', (newTasks) => {
  console.log('Work tasks:', newTasks);
});

// Nested arrays are also patched!
state.categories.work.push("New Task");  // ✅ Triggers reactivity
state.categories.personal.sort();        // ✅ Triggers reactivity
state.categories.urgent.splice(0, 1);    // ✅ Triggers reactivity
```

### Example 6: Dynamic List Rendering
```javascript
const state = ReactiveUtils.state({
  items: ["Apple", "Banana", "Cherry"]
});

// Auto-render list on changes
ReactiveUtils.effect(() => {
  const listHTML = state.items
    .map((item, i) => `<li>${i + 1}. ${item}</li>`)
    .join('');
  
  document.getElementById('itemList').innerHTML = `<ul>${listHTML}</ul>`;
});

// All operations trigger re-render
state.items.push("Date");           // Adds item + re-renders
state.items.sort();                 // Sorts + re-renders
state.items.reverse();              // Reverses + re-renders
state.items.splice(1, 2);           // Removes items + re-renders
```

### Example 7: Form Multi-Select
```javascript
const formState = ReactiveUtils.state({
  selectedOptions: [],
  availableOptions: ["Option A", "Option B", "Option C", "Option D"]
});

formState.$computed('hasSelection', function() {
  return this.selectedOptions.length > 0;
});

formState.$bind({
  '#selectedCount': () => `${formState.selectedOptions.length} selected`,
  '#submitBtn': {
    disabled: () => !formState.hasSelection
  }
});

function toggleOption(option) {
  const index = formState.selectedOptions.indexOf(option);
  if (index === -1) {
    formState.selectedOptions.push(option);  // Add
  } else {
    formState.selectedOptions.splice(index, 1);  // Remove
  }
}

function clearSelection() {
  formState.selectedOptions.length = 0;  // Clear array
  // Or: formState.selectedOptions.splice(0, formState.selectedOptions.length);
}
```

### Example 8: History Stack
```javascript
const history = ReactiveUtils.state({
  actions: [],
  maxHistory: 10
});

history.$computed('canUndo', function() {
  return this.actions.length > 0;
});

function addAction(action) {
  history.actions.push({
    type: action.type,
    timestamp: Date.now(),
    data: action.data
  });
  
  // Limit history size
  if (history.actions.length > history.maxHistory) {
    history.actions.shift();  // Remove oldest
  }
}

function undo() {
  if (history.actions.length > 0) {
    const lastAction = history.actions.pop();
    // Perform undo logic...
    return lastAction;
  }
}

function clearHistory() {
  history.actions.splice(0, history.actions.length);
}
```

---

## 🔧 Manual Patching

### patchReactiveArray(state, key)

For cases where you need to manually patch an array (rare):

```javascript
const state = ReactiveUtils.state({
  items: []
});

// Manually patch a specific array property
patchReactiveArray(state, 'items');

// Now array methods are reactive
state.items.push(1, 2, 3);
```

**Note:** This is rarely needed since arrays are auto-patched on creation.

---

## 🎭 Edge Cases & Notes

### 1. **Array Replacement**
Replacing an entire array automatically re-patches:

```javascript
const state = ReactiveUtils.state({ items: [1, 2, 3] });

// Replace array - automatically re-patched
state.items = [4, 5, 6];

// New array methods are reactive
state.items.push(7);  // ✅ Works!
```

### 2. **Nested Arrays**
Nested arrays in objects are automatically detected and patched:

```javascript
const state = ReactiveUtils.state({
  data: {
    lists: {
      todos: [1, 2, 3],
      done: [4, 5, 6]
    }
  }
});

// Nested arrays are patched
state.data.lists.todos.push(4);  // ✅ Reactive
state.data.lists.done.sort();    // ✅ Reactive
```

### 3. **Array of Objects**
Works with complex array structures:

```javascript
const state = ReactiveUtils.state({
  users: [
    { id: 1, name: "John", active: true },
    { id: 2, name: "Jane", active: false }
  ]
});

// Mutating the array triggers updates
state.users.push({ id: 3, name: "Bob", active: true });

// Modifying object properties also works
state.users[0].active = false;  // ✅ Reactive
```

### 4. **Immutable Methods**
Non-mutating array methods still work normally:

```javascript
const state = ReactiveUtils.state({ items: [1, 2, 3] });

// These don't need patching (they return new arrays)
const doubled = state.items.map(x => x * 2);     // [2, 4, 6]
const filtered = state.items.filter(x => x > 1);  // [2, 3]
const first = state.items.find(x => x === 2);     // 2

// To make these reactive, you need to reassign
state.items = state.items.map(x => x * 2);  // ✅ Reactive
```

### 5. **Performance Considerations**
Each mutation triggers reactivity, so batch when needed:

```javascript
const state = ReactiveUtils.state({ items: [] });

// Multiple mutations = multiple updates
state.items.push(1);  // Update 1
state.items.push(2);  // Update 2
state.items.push(3);  // Update 3

// Better: Batch updates
state.$batch(function() {
  this.items.push(1);
  this.items.push(2);
  this.items.push(3);
  // Single update after batch
});
```

---

## ⚡ Before vs After Comparison

### ❌ Before (Without Patch)
```javascript
const state = ReactiveUtils.state({ items: [1, 2, 3] });

state.$watch('items', () => console.log('Changed!'));

state.items.push(4);     // ❌ Does NOT trigger watch
state.items.sort();      // ❌ Does NOT trigger watch
state.items.reverse();   // ❌ Does NOT trigger watch

// You had to do this:
state.items = [...state.items, 4];           // ✅ Triggers
state.items = [...state.items].sort();       // ✅ Triggers
state.items = [...state.items].reverse();    // ✅ Triggers
```

### ✅ After (With Patch)
```javascript
const state = ReactiveUtils.state({ items: [1, 2, 3] });

state.$watch('items', () => console.log('Changed!'));

state.items.push(4);     // ✅ Triggers watch
state.items.sort();      // ✅ Triggers watch
state.items.reverse();   // ✅ Triggers watch

// Natural array API just works!
```

---

## 🚨 Important Notes

1. **Load Order Matters**
   - Must load AFTER reactive-state.js
   - Patches existing ReactiveUtils.state

2. **Automatic Patching**
   - All arrays are automatically patched on state creation
   - Nested arrays are recursively patched
   - Array replacement re-patches automatically

3. **Works with All Reactive Features**
   - Computed properties update
   - Watchers trigger
   - Effects re-run
   - DOM bindings update

4. **Non-Breaking**
   - Doesn't break existing reactive state code
   - Only enhances array behavior
   - Can be loaded or removed without issues

5. **Method Preservation**
   - Original array methods still work exactly the same
   - Only difference: they now trigger reactivity

This patch makes working with arrays in reactive state natural and intuitive, matching the expected behavior from frameworks like Vue.js!