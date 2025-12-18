# Understanding `isEmpty()` - A Beginner's Guide

## What is `isEmpty()`?

`isEmpty()` is a method for reactive collections that checks if the collection has no items. It's a semantic way to check for empty collections.

Think of it as **empty checker** - is this collection empty?

---

## Why Does This Exist?

### The Problem: Checking for Empty

You need to know if a collection is empty:

```javascript
// ❌ Without isEmpty - manual check
const items = ReactiveUtils.collection([]);

if (items.length === 0) {
  console.log('Empty');
}

// ✅ With isEmpty() - semantic
if (items.isEmpty()) {
  console.log('Empty');
}
```

**Why this matters:**
- Semantic meaning
- Cleaner code
- Easier to read
- Self-documenting

---

## How Does It Work?

### The IsEmpty Process

```javascript
collection.isEmpty()
    ↓
Checks if length === 0
    ↓
Returns true or false
```

---

## Basic Usage

### Check if Empty

```javascript
const items = ReactiveUtils.collection([]);

console.log(items.isEmpty()); // true

items.push(1);
console.log(items.isEmpty()); // false
```

### In Conditionals

```javascript
const todos = ReactiveUtils.collection([]);

if (todos.isEmpty()) {
  console.log('No todos yet');
} else {
  console.log(`You have ${todos.length} todos`);
}
```

### With Effects

```javascript
ReactiveUtils.effect(() => {
  const container = document.getElementById('list');

  if (items.isEmpty()) {
    container.innerHTML = '<p>No items</p>';
  } else {
    container.innerHTML = items
      .map(item => `<div>${item}</div>`)
      .join('');
  }
});
```

---

## Simple Examples Explained

### Example 1: Empty State Display

```javascript
const tasks = ReactiveUtils.collection([]);

// Display tasks or empty state
ReactiveUtils.effect(() => {
  const container = document.getElementById('tasks');

  if (tasks.isEmpty()) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No tasks yet</p>
        <button onclick="addSampleTasks()">Add Sample Tasks</button>
      </div>
    `;
  } else {
    container.innerHTML = tasks
      .map(task => `
        <div class="task">
          <span>${task.title}</span>
          <button onclick="removeTask(${task.id})">Remove</button>
        </div>
      `)
      .join('');
  }
});

function addSampleTasks() {
  tasks.push({ id: 1, title: 'Sample Task 1' });
  tasks.push({ id: 2, title: 'Sample Task 2' });
}

function removeTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
  }
}
```

---

### Example 2: Shopping Cart

```javascript
const cart = ReactiveUtils.collection([]);

// Display cart status
ReactiveUtils.effect(() => {
  const cartIcon = document.getElementById('cart-icon');
  const cartCount = document.getElementById('cart-count');

  if (cart.isEmpty()) {
    cartIcon.className = 'cart-icon empty';
    cartCount.style.display = 'none';
  } else {
    cartIcon.className = 'cart-icon filled';
    cartCount.style.display = 'block';
    cartCount.textContent = cart.length;
  }
});

// Display cart contents
ReactiveUtils.effect(() => {
  const container = document.getElementById('cart-contents');

  if (cart.isEmpty()) {
    container.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty</p>
        <button onclick="browseCatalog()">Start Shopping</button>
      </div>
    `;
  } else {
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    container.innerHTML = `
      <h3>Cart (${cart.length} items)</h3>
      ${cart.map(item => `
        <div class="cart-item">
          <span>${item.name}</span>
          <span>$${item.price}</span>
        </div>
      `).join('')}
      <div class="cart-total">Total: $${total.toFixed(2)}</div>
      <button onclick="checkout()">Checkout</button>
    `;
  }
});
```

---

### Example 3: Search Results

```javascript
const searchResults = ReactiveUtils.collection([]);

const searchState = ReactiveUtils.state({
  query: '',
  isSearching: false
});

async function search(query) {
  searchState.query = query;
  searchState.isSearching = true;

  try {
    const response = await fetch(`/api/search?q=${query}`);
    const results = await response.json();
    searchResults.reset(results);
  } finally {
    searchState.isSearching = false;
  }
}

// Display results
ReactiveUtils.effect(() => {
  const container = document.getElementById('results');

  if (searchState.isSearching) {
    container.innerHTML = '<p>Searching...</p>';
    return;
  }

  if (!searchState.query) {
    container.innerHTML = '<p>Enter a search query</p>';
    return;
  }

  if (searchResults.isEmpty()) {
    container.innerHTML = `
      <div class="no-results">
        <p>No results found for "${searchState.query}"</p>
        <p>Try a different search term</p>
      </div>
    `;
  } else {
    container.innerHTML = `
      <p>Found ${searchResults.length} result(s)</p>
      ${searchResults.map(result => `
        <div class="result">
          <h4>${result.title}</h4>
          <p>${result.description}</p>
        </div>
      `).join('')}
    `;
  }
});
```

---

## Real-World Example: Notification Center

```javascript
const notifications = ReactiveUtils.collection([]);

const notificationState = ReactiveUtils.state({
  filter: 'all', // 'all', 'unread', 'important'
  showPanel: false
});

// Add notification
function addNotification(message, type = 'info', important = false) {
  notifications.push({
    id: Date.now(),
    message: message,
    type: type,
    important: important,
    read: false,
    timestamp: new Date()
  });
}

// Mark as read
function markAsRead(id) {
  const notif = notifications.find(n => n.id === id);
  if (notif) {
    notif.read = true;
  }
}

// Mark all as read
function markAllAsRead() {
  notifications.forEach(n => n.read = true);
}

// Clear all
function clearAll() {
  if (confirm('Clear all notifications?')) {
    notifications.reset([]);
  }
}

// Get filtered notifications
const filteredNotifications = ReactiveUtils.computed(() => {
  switch (notificationState.filter) {
    case 'unread':
      return notifications.filter(n => !n.read);
    case 'important':
      return notifications.filter(n => n.important);
    default:
      return notifications;
  }
});

// Display notification badge
ReactiveUtils.effect(() => {
  const badge = document.getElementById('notification-badge');
  const unreadCount = notifications.filter(n => !n.read).length;

  if (notifications.isEmpty() || unreadCount === 0) {
    badge.style.display = 'none';
  } else {
    badge.style.display = 'block';
    badge.textContent = unreadCount;
  }
});

// Display notification panel
ReactiveUtils.effect(() => {
  const panel = document.getElementById('notification-panel');

  if (!notificationState.showPanel) {
    panel.style.display = 'none';
    return;
  }

  panel.style.display = 'block';

  const unreadCount = notifications.filter(n => !n.read).length;

  panel.innerHTML = `
    <div class="notification-header">
      <h3>Notifications</h3>
      <button onclick="notificationState.showPanel = false">×</button>
    </div>

    <div class="notification-filters">
      <button class="${notificationState.filter === 'all' ? 'active' : ''}"
              onclick="notificationState.filter = 'all'">
        All (${notifications.length})
      </button>
      <button class="${notificationState.filter === 'unread' ? 'active' : ''}"
              onclick="notificationState.filter = 'unread'">
        Unread (${unreadCount})
      </button>
      <button class="${notificationState.filter === 'important' ? 'active' : ''}"
              onclick="notificationState.filter = 'important'">
        Important
      </button>
    </div>

    <div class="notification-actions">
      ${!notifications.isEmpty() && unreadCount > 0 ? `
        <button onclick="markAllAsRead()">Mark all read</button>
      ` : ''}
      ${!notifications.isEmpty() ? `
        <button onclick="clearAll()" class="danger">Clear all</button>
      ` : ''}
    </div>

    <div class="notification-list">
      ${filteredNotifications.isEmpty() ? `
        <div class="empty-notifications">
          <p>${notificationState.filter === 'unread'
            ? 'No unread notifications'
            : notificationState.filter === 'important'
            ? 'No important notifications'
            : 'No notifications'
          }</p>
        </div>
      ` : filteredNotifications.map(notif => `
        <div class="notification notification-${notif.type} ${notif.read ? 'read' : 'unread'}">
          ${notif.important ? '<span class="important-badge">!</span>' : ''}
          <p>${notif.message}</p>
          <small>${notif.timestamp.toLocaleTimeString()}</small>
          ${!notif.read ? `
            <button onclick="markAsRead(${notif.id})">Mark read</button>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;
});

// Toggle panel
document.getElementById('notification-btn').onclick = () => {
  notificationState.showPanel = !notificationState.showPanel;
};

// Usage examples
addNotification('Welcome back!', 'success');
addNotification('You have a new message', 'info', true);
addNotification('Low disk space', 'warning', true);
```

---

## Common Patterns

### Pattern 1: Simple Check

```javascript
if (collection.isEmpty()) {
  // Handle empty state
}
```

### Pattern 2: Empty State Rendering

```javascript
ReactiveUtils.effect(() => {
  container.innerHTML = collection.isEmpty()
    ? '<p>No items</p>'
    : renderItems(collection);
});
```

### Pattern 3: Conditional Actions

```javascript
document.getElementById('clear-btn').disabled = items.isEmpty();
```

### Pattern 4: Negation Check

```javascript
if (!collection.isEmpty()) {
  // Has items
}
```

---

## Common Questions

### Q: Same as checking length?

**Answer:** Yes, but more semantic:

```javascript
// Same result
items.isEmpty()
items.length === 0

// isEmpty() is more readable
```

### Q: Is it reactive?

**Answer:** Yes, when used in effects:

```javascript
ReactiveUtils.effect(() => {
  console.log(items.isEmpty());
});
items.push(1); // Effect runs
```

### Q: What about non-empty check?

**Answer:** Use negation:

```javascript
if (!items.isEmpty()) {
  console.log('Has items');
}
```

---

## Summary

### What `isEmpty()` Does:

1. ✅ Checks if empty
2. ✅ Returns boolean
3. ✅ Same as length === 0
4. ✅ More semantic
5. ✅ Reactive

### When to Use It:

- Empty state display
- Conditional rendering
- Button states
- Validation
- UI feedback

### The Basic Pattern:

```javascript
const collection = ReactiveUtils.collection([]);

// Check if empty
if (collection.isEmpty()) {
  console.log('No items');
}

// Empty state rendering
ReactiveUtils.effect(() => {
  if (collection.isEmpty()) {
    container.innerHTML = '<p>No items</p>';
  } else {
    container.innerHTML = renderItems();
  }
});
```

---

**Remember:** `isEmpty()` is the semantic way to check for empty collections! 🎉
