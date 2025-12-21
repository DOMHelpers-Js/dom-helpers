# Understanding `collection.$clear()` - A Beginner's Guide

## Quick Start (30 seconds)

```js
// Create a reactive shopping cart
const cart = collection([{ id: 1, name: 'Laptop' }]);

// Clear all items - UI updates automatically!
cart.$clear();

// Setup auto-update (write once, works forever)
effect(() => {
  document.querySelector('#count').textContent = cart.items.length;
});
```

**That's it!** When you `$clear()`, everything resets automatically. ✨

**Want to understand how this works?** Keep reading below!

---

## What is `collection.$clear()`?

`collection.$clear()` is a **collection instance method** that removes all items from a reactive collection created with `ReactiveUtils.collection()` or `ReactiveUtils.list()`. It provides the fastest and most semantic way to empty a collection.

Think of it as **a "clear all" button** for your arrays - instead of manually emptying arrays and remembering to update the UI, `$clear()` does both automatically with clean, semantic syntax.

---

## Syntax

```js
// Using collection instance
collection.$clear()

// Example with collection
const cart = collection([{ id: 1, name: 'Laptop' }]);
cart.$clear();
```

**Both shortcut and namespace styles work** when creating collections:
- **Shortcut style**: `collection()` - Clean and concise
- **Namespace style**: `ReactiveUtils.collection()` - Explicit and clear

**Parameters:**
- None

**Returns:**
- The collection object (for chaining)

---

## Why Does This Exist?

### The Problem: Clearing Collections in Plain JavaScript

Let's say you're building a shopping cart. After the user completes checkout, you need to empty the cart and update the UI to show it's empty.

**The Problem Visualized:**

**Without `$clear()` - Manual Updates:**
```
User completes checkout
       ↓
   Clear array ───────┐
       ↓              │
   Update counter     │  ← You must remember
       ↓              │     to do ALL of these!
   Clear display      │
       ↓              │
   Reset total    ────┘
```

**With `$clear()` - Automatic Updates:**
```
User completes checkout
       ↓
   $clear() ──────────┐
                      ↓
              ┌───────────────┐
              │  Reactivity   │
              │    System     │
              └───────┬───────┘
                      ↓
         ┌────────────┼────────────┐
         ↓            ↓            ↓
    Counter       Display      Total
    resets        clears       resets

Everything happens automatically! ✨
```

### ❌ Plain JavaScript Approach - Manual Everything

```js
// Plain JavaScript - no reactivity
let cart = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Mouse', price: 29 }
];

function checkout() {
  // Step 1: Process the order (API call, etc.)
  console.log('Processing order...');

  // Step 2: Manually clear the array
  cart = [];

  // Step 3: Manually update each part of the UI
  document.querySelector('#cart-count').textContent = '0';
  document.querySelector('#cart-total').textContent = '$0.00';
  document.querySelector('#cart-items').innerHTML = '<p>Cart is empty</p>';

  // If you forget any of these, the UI will be out of sync!
}

checkout();
```

**Code explanation:**
- `checkout()` must manually clear the array with `cart = []`
- Then manually update every UI element (counter, total, items list)
- If you forget any DOM update, the UI becomes out of sync
- Every clear operation requires remembering multiple manual update calls

**What's the Real Issue?**

**Problems:**
- When you clear an array, nothing else in your code knows about it automatically
- JavaScript doesn't notify the UI that the data was cleared
- You must manually call update functions after clearing
- Easy to forget updating parts of the UI
- The array changes, but nothing reacts to it

**Why This Becomes a Problem:**

As your app grows, this leads to several issues:
❌ Changes are invisible to the rest of your application
❌ The UI doesn't update unless you manually tell it to
❌ You end up writing extra code just to sync the UI
❌ Data and UI easily get out of sync
❌ Same clearing logic repeated everywhere

In other words, **manual array clearing requires constant vigilance**.
You clear data — **but you must remember to update everything that depends on it**.

---

## The Solution with `collection.$clear()`

`$clear()` gives you a **semantic, chainable, and safe** way to empty collections with automatic reactivity.

### ✅ Using `collection.$clear()` - Clean and Automatic

```js
// Create a reactive collection
const cart = collection([
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Mouse', price: 29 }
]);

// Set up automatic UI updates (write once, works forever!)
effect(() => {
  const count = cart.items.length;
  if (count === 0) {
    document.querySelector('#cart-status').textContent = 'Cart is empty';
  } else {
    document.querySelector('#cart-status').textContent = `${count} items in cart`;
  }
});

// Checkout function
function checkout() {
  console.log('Processing order...');

  // Clear cart - clean and semantic
  cart.$clear();

  // Effect runs automatically!
  // UI updates without any manual calls! ✨
}

// Can also chain operations
cart.$clear()
    .$add({ id: 3, name: 'Keyboard', price: 79 })
    .$add({ id: 4, name: 'Monitor', price: 299 });
// UI updates automatically!
```

**What just happened?**
1. You cleared the cart with `$clear()`
2. The `effect()` detected the change automatically
3. The DOM updated without manual calls
4. You can chain operations after clearing

**Benefits:**

1. ✅ **Automatic** - DOM updates by itself
2. ✅ **Semantic** - Code reads as "clear this collection"
3. ✅ **Safe** - Guarantees reactivity always works
4. ✅ **Chainable** - Can chain with other operations
5. ✅ **Consistent** - Matches other methods (`$add`, `$remove`, `$update`)

---

## Mental Model: The Reset Button

Think of `collection.$clear()` like a **trash can with auto-notifications**:

**Regular trash can (plain array):**
```
You empty the trash
       ↓
Nothing happens
       ↓
You must tell everyone manually: "Hey, I emptied it!"
```

**Smart trash can (reactive collection):**
```
You empty with $clear()
       ↓
The system automatically notifies everyone
       ↓
┌──────────────┬──────────────┬──────────────┐
↓              ↓              ↓
Counter        Display        Stats
resets         clears         update
automatically! automatically! automatically!
```

**Key insight:** `$clear()` isn't just emptying an array - it's **broadcasting** the reset to everyone watching.

**Real-world analogy:** It's like pressing "Clear All" in your notifications:
- You don't manually dismiss each notification
- You don't update each app's badge count yourself
- The system does it all automatically
- Every app watching your notifications updates

With `$clear()`:
- You don't manually reset each UI element
- You don't call update functions yourself
- The reactive system does it automatically
- Every effect watching the collection updates

---

## How Does It Work?

When you call `$clear()`, here's the magic that happens automatically:

```
┌─────────────────────────────────────────────────────────────┐
│  YOU CALL:  cart.$clear()                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │  Step 1: Empty the Array         │
         │  items.length = 0                │
         └──────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │  Step 2: Trigger Reactivity      │
         │  Notify all watchers             │
         └──────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │  Step 3: Effects Auto-Run        │
         │  effect(() => { ... })           │
         └──────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │  Step 4: DOM Updates             │
         │  UI reflects empty state         │
         └──────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │  Step 5: Return Collection       │
         │  Enables method chaining         │
         └──────────────────────────────────┘
```

**What's happening behind the scenes:**

1. **Empty the array** - Sets `items.length = 0`, removing all elements
2. **Trigger reactivity** - The reactive system detects the array change
3. **Notify watchers** - All effects watching this collection are notified
4. **Effects re-run** - Each `effect()` re-executes with the empty array
5. **DOM updates** - Your UI updates automatically to show the empty state
6. **Return collection** - Returns the collection object for chaining

Think of it as: **You clear → System reacts → UI updates** - all automatic!

---

## Basic Usage

Here's how to use `$clear()` in the most common scenarios:

```js
// Create a collection
const cart = collection([
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Mouse', price: 29 }
]);

// Clear all items
cart.$clear();
console.log(cart.items);  // []

// Chain operations after clearing
cart.$clear()
    .$add({ id: 3, name: 'Keyboard', price: 79 });

// Clear in response to user action
function handleCheckout() {
  // Process checkout...
  cart.$clear();  // Empty cart after successful checkout
}
```

---

## Common Use Cases

### Use Case 1: Shopping Cart Checkout

```js
const cart = collection([]);

// Add items to cart
function addToCart(product) {
  cart.$add({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1
  });
}

// Checkout and clear cart
async function checkout() {
  // Validate cart is not empty
  if (cart.items.length === 0) {
    console.warn('Cart is empty');
    return;
  }

  try {
    // Send order to server
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart.items })
    });

    if (response.ok) {
      console.log('Order placed successfully!');
      cart.$clear();  // Clear cart after successful checkout
      console.log('Cart cleared');
    }
  } catch (error) {
    console.error('Checkout failed:', error);
  }
}

// Automatically display cart total (runs whenever cart changes)
effect(() => {
  const total = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);  // Calculate total
  }, 0);

  document.querySelector('#cart-total').textContent = `$${total.toFixed(2)}`;
});

// Usage
addToCart({ id: 1, name: 'Laptop', price: 999 });
addToCart({ id: 2, name: 'Mouse', price: 29 });
checkout();  // After success, cart clears and total shows $0.00
```

**Code explanation:**
- `checkout()` sends order to server
- On success, `cart.$clear()` empties the cart
- The `effect()` automatically recalculates total
- DOM updates to show $0.00 without manual calls

---

### Use Case 2: Clear All Todos

```js
const todos = collection([
  { id: 1, text: 'Buy milk', completed: false },
  { id: 2, text: 'Call dentist', completed: true }
]);

// Clear all todos with user confirmation
function clearAllTodos() {
  const count = todos.items.length;

  // Check if already empty
  if (count === 0) {
    console.log('No todos to clear');
    return;
  }

  // Ask user to confirm (important for destructive actions!)
  const confirmed = confirm(`Delete all ${count} todos?`);

  if (!confirmed) {
    console.log('Clear cancelled');
    return;
  }

  // Clear the todos
  todos.$clear();
  console.log('All todos deleted');
}

// Automatically track todo statistics
effect(() => {
  const total = todos.items.length;
  const completed = todos.items.filter(t => t.completed).length;
  const pending = total - completed;

  console.log(`Total: ${total}, Completed: ${completed}, Pending: ${pending}`);
});

clearAllTodos();  // After confirmation, clears and logs: "Total: 0, Completed: 0, Pending: 0"
```

**Code explanation:**
- Always confirm before clearing important data
- Check if already empty to avoid unnecessary work
- `$clear()` removes all todos
- Effect automatically recalculates statistics

---

### Use Case 3: Game Level Reset

```js
const enemies = collection([]);
const powerups = collection([]);

const game = state({
  score: 0,
  level: 1,
  lives: 3,
  gameOver: false
});

// Clear current level (removes enemies and powerups)
function clearLevel() {
  enemies.$clear();    // Remove all enemies
  powerups.$clear();   // Remove all powerups
  console.log('Level cleared');
}

// Reset entire game (clear everything and reset state)
function resetGame() {
  const confirmed = confirm('Reset game? All progress will be lost.');

  if (!confirmed) return;

  // Clear all collections
  enemies.$clear();
  powerups.$clear();

  // Reset game state
  game.score = 0;
  game.level = 1;
  game.lives = 3;
  game.gameOver = false;

  console.log('Game reset');
}

// Game over (clear everything)
function gameOver() {
  game.gameOver = true;
  enemies.$clear();
  powerups.$clear();

  console.log('Game Over!');
  console.log(`Final Score: ${game.score}`);
}

// Track enemy count (runs when enemies change)
effect(() => {
  const count = enemies.items.length;
  console.log(`Enemies remaining: ${count}`);

  // Level complete when all enemies defeated
  if (count === 0 && !game.gameOver) {
    console.log('Level complete!');
    clearLevel();
    game.level++;
  }
});

clearLevel();   // Clear level
resetGame();    // Reset entire game
```

**Code explanation:**
- `clearLevel()` empties enemies and powerups for new level
- `resetGame()` clears collections AND resets game state
- Always clear related state when clearing collections
- Effect watches enemy count for level completion

---

### Use Case 4: Form Validation Errors

```js
const formErrors = collection([]);

// Add error
function addError(field, message) {
  formErrors.$add({
    field: field,
    message: message
  });
}

// Clear all errors
function clearAllErrors() {
  if (formErrors.items.length === 0) {
    console.log('No errors to clear');
    return;
  }

  formErrors.$clear();
  console.log('All errors cleared');
}

// Validate form (clear old errors first, then add new ones)
function validateForm() {
  // Clear existing errors before validating
  formErrors.$clear();

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  // Validate email
  if (!email) {
    addError('email', 'Email is required');
  } else if (!email.includes('@')) {
    addError('email', 'Invalid email format');
  }

  // Validate password
  if (!password) {
    addError('password', 'Password is required');
  } else if (password.length < 8) {
    addError('password', 'Password must be at least 8 characters');
  }

  // Return validation result
  return formErrors.items.length === 0;
}

// Automatically display errors in DOM
effect(() => {
  const errorContainer = document.querySelector('#errors');

  if (formErrors.items.length === 0) {
    errorContainer.innerHTML = '';  // No errors, clear container
  } else {
    // Build error HTML
    errorContainer.innerHTML = formErrors.items.map(err => {
      return `<div class="error">${err.field}: ${err.message}</div>`;
    }).join('');
  }
});

validateForm();  // Errors display automatically
```

**Code explanation:**
- Always `$clear()` old errors before validating
- Prevents mixing old and new error messages
- Effect automatically renders error list
- DOM updates when errors change

---

### Use Case 5: Reset Search Results

```js
const searchResults = collection([]);
const searchState = state({
  query: '',
  isSearching: false,
  hasSearched: false
});

// Perform search
async function search(query) {
  if (!query.trim()) {
    searchResults.$clear();
    searchState.query = '';
    searchState.hasSearched = false;
    return;
  }

  searchState.isSearching = true;
  searchState.query = query;

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    // Clear old results before adding new ones
    searchResults.$clear();
    data.results.forEach(result => {
      searchResults.$add(result);
    });

    searchState.hasSearched = true;
  } catch (error) {
    console.error('Search failed:', error);
    searchResults.$clear();
  } finally {
    searchState.isSearching = false;
  }
}

// Clear search
function clearSearch() {
  searchResults.$clear();
  searchState.query = '';
  searchState.hasSearched = false;
  document.querySelector('#search-input').value = '';
}

// Auto-display results
effect(() => {
  const resultsEl = document.querySelector('#search-results');

  if (searchState.isSearching) {
    resultsEl.innerHTML = '<div class="loading">Searching...</div>';
  } else if (searchResults.items.length === 0 && searchState.hasSearched) {
    resultsEl.innerHTML = '<div class="no-results">No results found</div>';
  } else if (searchResults.items.length > 0) {
    resultsEl.innerHTML = searchResults.items.map(r =>
      `<div class="result">${r.title}</div>`
    ).join('');
  } else {
    resultsEl.innerHTML = '';
  }
});

// Usage
search('javascript');  // Search and display results
clearSearch();         // Clear results and reset state
```

**Code explanation:**
- `clearSearch()` clears results and resets all related state
- `search()` clears old results before adding new ones
- Effect shows different UI states (loading, empty, results)
- Always clear related state when clearing collections

---

## Advanced Patterns

### Pattern 1: Undo/Redo with Clear

```js
const tasks = collection([
  { id: 1, text: 'Task 1' },
  { id: 2, text: 'Task 2' }
]);

const history = {
  snapshots: [],
  currentIndex: -1
};

// Save snapshot before clearing
function saveSnapshot() {
  const snapshot = [...tasks.items];
  history.snapshots = history.snapshots.slice(0, history.currentIndex + 1);
  history.snapshots.push(snapshot);
  history.currentIndex++;
}

// Clear with undo support
function clearWithUndo() {
  if (tasks.items.length === 0) return;

  saveSnapshot();
  tasks.$clear();
}

// Undo last clear
function undo() {
  if (history.currentIndex <= 0) {
    console.log('Nothing to undo');
    return;
  }

  history.currentIndex--;
  const snapshot = history.snapshots[history.currentIndex];

  tasks.$clear();
  snapshot.forEach(item => tasks.$add(item));
}

// Redo cleared operation
function redo() {
  if (history.currentIndex >= history.snapshots.length - 1) {
    console.log('Nothing to redo');
    return;
  }

  history.currentIndex++;
  const snapshot = history.snapshots[history.currentIndex];

  tasks.$clear();
  snapshot.forEach(item => tasks.$add(item));
}

// Usage
clearWithUndo();  // Clear with undo support
undo();           // Restore items
redo();           // Clear again
```

---

### Pattern 2: Clear with Confirmation and Backup

```js
const importantData = collection([
  { id: 1, value: 'Critical data' },
  { id: 2, value: 'Important info' }
]);

const backup = state({
  lastCleared: null,
  timestamp: null
});

// Clear with automatic backup
function clearWithBackup(confirmMessage = 'Clear all data?') {
  if (importantData.items.length === 0) {
    console.log('Already empty');
    return false;
  }

  const confirmed = confirm(confirmMessage);
  if (!confirmed) {
    console.log('Clear cancelled');
    return false;
  }

  // Backup before clearing
  backup.lastCleared = [...importantData.items];
  backup.timestamp = new Date();

  importantData.$clear();
  console.log('Data cleared and backed up');
  return true;
}

// Restore from backup
function restoreBackup() {
  if (!backup.lastCleared || backup.lastCleared.length === 0) {
    console.log('No backup available');
    return false;
  }

  const timeSinceBackup = Date.now() - backup.timestamp.getTime();
  const minutesAgo = Math.floor(timeSinceBackup / 60000);

  const confirmed = confirm(
    `Restore backup from ${minutesAgo} minute(s) ago?`
  );

  if (!confirmed) return false;

  importantData.$clear();
  backup.lastCleared.forEach(item => importantData.$add(item));

  console.log('Backup restored');
  return true;
}

// Usage
clearWithBackup();    // Clear with backup
restoreBackup();      // Restore if needed
```

---

### Pattern 3: Conditional Clear with Batch Operations

```js
const activeItems = collection([]);
const completedItems = collection([]);
const archivedItems = collection([]);

// Clear all collections conditionally
function resetAllCollections(options = {}) {
  const {
    clearActive = true,
    clearCompleted = true,
    clearArchived = false,
    confirm = true
  } = options;

  const itemCount =
    (clearActive ? activeItems.items.length : 0) +
    (clearCompleted ? completedItems.items.length : 0) +
    (clearArchived ? archivedItems.items.length : 0);

  if (itemCount === 0) {
    console.log('Nothing to clear');
    return;
  }

  if (confirm) {
    const confirmed = window.confirm(
      `Clear ${itemCount} item(s)?`
    );
    if (!confirmed) return;
  }

  // Use batch to clear multiple collections efficiently
  batch(() => {
    if (clearActive) activeItems.$clear();
    if (clearCompleted) completedItems.$clear();
    if (clearArchived) archivedItems.$clear();
  });

  console.log('Collections cleared');
}

// Auto-display total count
effect(() => {
  const total =
    activeItems.items.length +
    completedItems.items.length +
    archivedItems.items.length;

  console.log(`Total items: ${total}`);
});

// Usage
resetAllCollections({ clearArchived: true });  // Clear all including archived
resetAllCollections({ clearCompleted: true, clearActive: false });  // Only clear completed
```

---

### Pattern 4: Clear with Transition and Animation State

```js
const notifications = collection([
  { id: 1, message: 'Message 1' },
  { id: 2, message: 'Message 2' }
]);

const uiState = state({
  isClearing: false,
  showClearButton: true
});

// Clear with animation
async function clearWithAnimation() {
  if (notifications.items.length === 0) return;

  // Step 1: Set clearing state (triggers fade-out animation)
  uiState.isClearing = true;
  uiState.showClearButton = false;

  // Step 2: Wait for animation to complete
  await new Promise(resolve => setTimeout(resolve, 300));

  // Step 3: Actually clear the collection
  notifications.$clear();

  // Step 4: Reset UI state
  uiState.isClearing = false;
  uiState.showClearButton = true;
}

// Auto-apply animation classes
effect(() => {
  const container = document.querySelector('#notifications');
  if (!container) return;

  if (uiState.isClearing) {
    container.classList.add('fade-out');
  } else {
    container.classList.remove('fade-out');
  }
});

// Auto-show/hide clear button
effect(() => {
  const button = document.querySelector('#clear-btn');
  if (!button) return;

  const hasItems = notifications.items.length > 0;
  const show = hasItems && uiState.showClearButton;

  button.style.display = show ? 'block' : 'none';
});

// Usage
clearWithAnimation();  // Smooth fade-out, then clear
```

---

## When to Use Something Else

`$clear()` is perfect for removing all items, but here are some alternatives for specific situations:

### For Removing Some Items (Not All)

`$clear()` removes everything. If you only want to remove specific items, use `$remove()` instead:

**Wrong approach:**
```js
// ❌ BAD - removes ALL todos!
function removeCompleted() {
  todos.$clear();  // Oops! Removes incomplete todos too!
}
```

**Right approach:**
```js
// ✅ GOOD - removes only completed todos
function removeCompleted() {
  todos.$remove(todo => todo.completed);
}
```

**Rule of thumb:**
- **Remove ALL items?** Use `$clear()`
- **Remove SOME items?** Use `$remove(predicate)`

---

### For Clearing Multiple Collections

When clearing multiple collections that share effects, use `batch()` to avoid UI flicker:

**Less efficient (but works):**
```js
collection1.$clear();  // Effect runs
collection2.$clear();  // Effect runs again
collection3.$clear();  // Effect runs again
// Total: 3 updates (UI might flicker!)
```

**More efficient:**
```js
batch(() => {
  collection1.$clear();
  collection2.$clear();
  collection3.$clear();
});
// Total: 1 update (smooth!)
```

**Why?** `batch()` groups all the clears together, so effects only run once. The UI updates smoothly instead of flickering three times!

---

### Performance Tips

**Tip 1: Clear Before Re-populating**

When replacing all items with new data, clear first:

```js
// ✅ EFFICIENT - clear then add
async function refreshData() {
  const newData = await fetchData();

  batch(() => {
    items.$clear();  // Remove all old items (fast!)
    newData.forEach(item => items.$add(item));  // Add new items
  });
}

// ⚠️ LESS EFFICIENT - remove one by one
async function refreshData() {
  const newData = await fetchData();

  while (items.items.length > 0) {
    items.$remove(items.items[0]);  // Slow!
  }

  newData.forEach(item => items.$add(item));
}
```

**Tip 2: Check Before Clearing**

Avoid unnecessary work by checking if already empty:

```js
function resetCart() {
  // Check first
  if (cart.items.length === 0) {
    console.log('Cart already empty');
    return;
  }

  cart.$clear();
}
```

**Tip 3: Always Reset Related State**

When clearing a collection, reset any state that depends on it:

```js
function resetGame() {
  // Clear collections
  batch(() => {
    enemies.$clear();
    powerups.$clear();
  });

  // Reset related state
  gameState.score = 0;
  gameState.level = 1;
  gameState.selectedItem = null;
}
```

---

## Common Pitfalls

### Pitfall 1: Forgetting to Confirm Destructive Actions

**Problem:**
```js
// User clicks button, all data is gone!
function clearAll() {
  todos.$clear();  // No confirmation!
}
```

**Solution:**
```js
function clearAll() {
  const confirmed = confirm('Delete all todos? This cannot be undone.');

  if (confirmed) {
    todos.$clear();
  }
}
```

---

### Pitfall 2: Not Resetting Related State

**Problem:**
```js
const selectedId = ref(1);
const items = collection([{ id: 1 }, { id: 2 }]);

items.$clear();
// selectedId still refers to deleted item!
```

**Solution:**
```js
function clearItems() {
  items.$clear();
  selectedId.value = null;  // Reset related state
}
```

---

### Pitfall 3: Clearing When You Need Selective Removal

**Problem:**
```js
// Want to remove completed todos, but this removes ALL todos!
function removeCompleted() {
  todos.$clear();  // WRONG - removes everything!
}
```

**Solution:**
```js
function removeCompleted() {
  todos.$remove(todo => todo.completed);  // Remove only completed
}
```

---

### Pitfall 4: Not Preserving Data Before Clearing

**Problem:**
```js
// Data is lost forever!
function reset() {
  importantData.$clear();  // No backup!
}
```

**Solution:**
```js
const backup = state({ lastCleared: null });

function reset() {
  backup.lastCleared = [...importantData.items];  // Backup first
  importantData.$clear();
}

function undo() {
  if (backup.lastCleared) {
    backup.lastCleared.forEach(item => importantData.$add(item));
  }
}
```

---

## Real-World Example

Here's a shopping cart checkout flow using `$clear()`:

```js
const cart = collection([]);

// Auto-update cart UI
effect(() => {
  const total = cart.items.reduce((sum, item) => sum + item.price, 0);
  document.querySelector('#total').textContent = `$${total}`;
  document.querySelector('#count').textContent = cart.items.length;
});

// Checkout and clear cart
async function checkout() {
  if (cart.items.length === 0) return;

  const confirmed = confirm('Proceed with checkout?');
  if (!confirmed) return;

  try {
    await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ items: cart.items })
    });

    cart.$clear();  // Empties cart, UI updates automatically! ✨
    alert('Order placed!');
  } catch (error) {
    alert('Checkout failed');
  }
}

// Usage
cart.$add({ id: 1, name: 'Laptop', price: 999 });
cart.$add({ id: 2, name: 'Mouse', price: 29 });
checkout();  // Cart cleared after successful order
```

**What this demonstrates:**
- Clearing after successful operation
- User confirmation before clearing
- Automatic UI updates via effects
- Clean, simple code

---

## Common Questions

### Q: Can I undo a `$clear()` operation?

**A:** Not automatically. Save a backup first if you need undo:

```js
const backup = { items: null };

function clearWithUndo() {
  backup.items = [...cart.items];  // Backup first
  cart.$clear();
}

function undo() {
  if (backup.items) {
    backup.items.forEach(item => cart.$add(item));
  }
}
```

### Q: What's the difference between `$clear()` and `items.length = 0`?

**A:** Both work! They both empty the array and trigger reactivity. Use `$clear()` for:
- Semantic, readable code
- Method chaining
- Consistency with other collection methods

### Q: Does `$clear()` affect other collections?

**A:** No, it only clears the specific collection you call it on:

```js
const cart = collection([1, 2, 3]);
const wishlist = collection([4, 5, 6]);

cart.$clear();  // Only cart is cleared
// cart.items = []
// wishlist.items = [4, 5, 6] (unchanged)
```

### Q: Should I always confirm before clearing?

**A:** Yes, for important data! For temporary data (like search results), confirmation isn't needed:

```js
// Important data - confirm first
function clearTodos() {
  if (confirm('Delete all todos?')) {
    todos.$clear();
  }
}

// Temporary data - no confirmation needed
function clearSearch() {
  searchResults.$clear();
}
```

### Q: Can I clear multiple collections at once?

**A:** Yes! Use `batch()` for better performance:

```js
// Without batch - effects run 3 times
collection1.$clear();
collection2.$clear();
collection3.$clear();

// With batch - effects run once
batch(() => {
  collection1.$clear();
  collection2.$clear();
  collection3.$clear();
});
```

---

## Summary

**`collection.$clear()` provides a semantic, safe way to remove all items from reactive collections.**

**Key benefits:**
- ✅ **Automatic** - DOM updates by itself without manual calls
- ✅ **Semantic** - Code reads as "clear this collection"
- ✅ **Safe** - Guarantees reactivity always works
- ✅ **Chainable** - Returns collection for method chaining
- ✅ **Consistent** - Matches other collection methods (`$add`, `$remove`, `$update`)
- ✅ **Efficient** - Single operation, works with `batch()` for multiple clears
- ✅ Perfect for **checkout workflows**, **form resets**, **game state cleanup**, **search clearing**

**Important warnings:**
- ⚠️ **Always confirm** before clearing important data
- ⚠️ **Create backups** if undo functionality is needed
- ⚠️ **Reset related state** (selected items, filters, etc.) after clearing
- ⚠️ **Use `$remove()`** instead if you need selective removal, not clearing everything

**Remember:** `$clear()` is for removing ALL items. If you need to remove specific items, use `$remove()` instead!

➡️ Next, explore [`collection.$add()`](collection_$add.md) to add items, [`collection.$remove()`]($remove.md) to remove items, or [`collection.$update()`]($update.md) to update items!
