# Understanding `unshift()` - A Beginner's Guide

## What is `unshift()`?

`unshift()` is a method for reactive collections that adds one or more items to the beginning. It works like JavaScript's array `unshift()` and triggers reactivity.

Think of it as **start adder** - add items to the beginning.

---

## Why Does This Exist?

### The Problem: Adding to Start

You need to add items to the beginning of a collection:

```javascript
// ❌ Without unshift - complex manual addition
const items = ReactiveUtils.collection([3, 4, 5]);
// Need to shift everything and insert at start...

// ✅ With unshift() - clean
items.unshift(1, 2);
console.log(items); // [1, 2, 3, 4, 5]
```

**Why this matters:**
- Simple prepending
- Multiple items at once
- Returns new length
- Triggers reactivity

---

## How Does It Work?

### The Unshift Process

```javascript
collection.unshift(...items)
    ↓
Shifts existing items right
Inserts new items at start
    ↓
Returns new length
Triggers reactive updates
```

---

## Basic Usage

### Add Single Item

```javascript
const items = ReactiveUtils.collection([2, 3, 4]);
const newLength = items.unshift(1);
console.log(items); // [1, 2, 3, 4]
console.log(newLength); // 4
```

### Add Multiple Items

```javascript
const items = ReactiveUtils.collection(['c', 'd', 'e']);
items.unshift('a', 'b');
console.log(items); // ['a', 'b', 'c', 'd', 'e']
```

### Add Objects

```javascript
const notifications = ReactiveUtils.collection([]);
notifications.unshift({
  id: 1,
  message: 'New notification',
  type: 'info'
});
console.log(notifications.length); // 1
```

---

## Simple Examples Explained

### Example 1: Recent Activity Feed

```javascript
const activities = ReactiveUtils.collection([]);

function addActivity(action, user) {
  activities.unshift({
    id: Date.now(),
    action: action,
    user: user,
    timestamp: new Date()
  });

  // Keep only last 20
  if (activities.length > 20) {
    activities.pop(); // Remove oldest from end
  }
}

// Display activities (newest first)
ReactiveUtils.effect(() => {
  const container = document.getElementById('activities');
  container.innerHTML = activities
    .map(activity => `
      <div class="activity">
        <strong>${activity.user}</strong> ${activity.action}
        <small>${activity.timestamp.toLocaleTimeString()}</small>
      </div>
    `)
    .join('');
});

// Usage
addActivity('logged in', 'John');
addActivity('uploaded file', 'Jane');
addActivity('commented', 'Bob');
```

---

### Example 2: Priority Queue

```javascript
const tasks = ReactiveUtils.collection([
  { id: 2, title: 'Normal task', priority: 'normal' },
  { id: 3, title: 'Low priority', priority: 'low' }
]);

function addTask(title, priority) {
  const task = {
    id: Date.now(),
    title: title,
    priority: priority
  };

  if (priority === 'urgent') {
    // Add urgent tasks to front
    tasks.unshift(task);
  } else {
    // Add normal tasks to end
    tasks.push(task);
  }
}

// Display tasks
ReactiveUtils.effect(() => {
  const container = document.getElementById('tasks');
  container.innerHTML = tasks
    .map((task, index) => `
      <div class="task priority-${task.priority}">
        ${index + 1}. ${task.title}
        <span class="badge">${task.priority}</span>
      </div>
    `)
    .join('');
});

// Usage
addTask('Fix critical bug', 'urgent'); // Goes to front
addTask('Update docs', 'normal'); // Goes to end
```

---

### Example 3: Notification System

```javascript
const notifications = ReactiveUtils.collection([]);

function notify(message, type = 'info') {
  notifications.unshift({
    id: Date.now(),
    message: message,
    type: type,
    read: false,
    timestamp: new Date()
  });
}

// Display notifications (newest first)
ReactiveUtils.effect(() => {
  const container = document.getElementById('notifications');

  if (notifications.length === 0) {
    container.innerHTML = '<p>No notifications</p>';
    return;
  }

  container.innerHTML = notifications
    .map(notif => `
      <div class="notification notification-${notif.type} ${notif.read ? 'read' : 'unread'}">
        <span>${notif.message}</span>
        <small>${notif.timestamp.toLocaleTimeString()}</small>
      </div>
    `)
    .join('');
});

// Display unread count
ReactiveUtils.effect(() => {
  const unreadCount = notifications.filter(n => !n.read).length;
  document.getElementById('unread-count').textContent = unreadCount;
});

// Usage
notify('New message received', 'info');
notify('Warning: Low disk space', 'warning');
notify('Error: Connection failed', 'error');
```

---

## Real-World Example: Chat with Pinned Messages

```javascript
const messages = ReactiveUtils.collection([]);
const pinnedMessages = ReactiveUtils.collection([]);

function sendMessage(text, user = 'Me') {
  const message = {
    id: Date.now(),
    text: text,
    user: user,
    timestamp: new Date(),
    pinned: false
  };

  messages.push(message);

  // Keep only last 50
  if (messages.length > 50) {
    messages.shift();
  }
}

function pinMessage(messageId) {
  const message = messages.find(m => m.id === messageId);
  if (message && !message.pinned) {
    message.pinned = true;
    // Add to front of pinned messages
    pinnedMessages.unshift(message);
  }
}

function unpinMessage(messageId) {
  const index = pinnedMessages.findIndex(m => m.id === messageId);
  if (index !== -1) {
    pinnedMessages[index].pinned = false;
    pinnedMessages.splice(index, 1);
  }
}

// Display pinned messages (at top)
ReactiveUtils.effect(() => {
  const container = document.getElementById('pinned-messages');

  if (pinnedMessages.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  container.innerHTML = `
    <h4>Pinned Messages</h4>
    ${pinnedMessages.map(msg => `
      <div class="message pinned">
        <strong>${msg.user}:</strong> ${msg.text}
        <button onclick="unpinMessage(${msg.id})">Unpin</button>
      </div>
    `).join('')}
  `;
});

// Display regular messages
ReactiveUtils.effect(() => {
  const container = document.getElementById('messages');
  container.innerHTML = messages
    .map(msg => `
      <div class="message ${msg.pinned ? 'is-pinned' : ''}">
        <strong>${msg.user}:</strong> ${msg.text}
        <small>${msg.timestamp.toLocaleTimeString()}</small>
        ${!msg.pinned ? `
          <button onclick="pinMessage(${msg.id})">Pin</button>
        ` : '<span class="pinned-indicator">📌</span>'}
      </div>
    `)
    .join('');
});

// Usage
sendMessage('Hello everyone!', 'John');
sendMessage('Important: Meeting at 3 PM', 'Admin');
pinMessage(2); // Pin the admin message
sendMessage('Got it!', 'Jane');
```

---

## Common Patterns

### Pattern 1: Add to Start

```javascript
collection.unshift(item);
```

### Pattern 2: Add Multiple

```javascript
collection.unshift(item1, item2, item3);
```

### Pattern 3: Add from Array

```javascript
collection.unshift(...otherArray);
```

### Pattern 4: Priority Addition

```javascript
if (priority === 'high') {
  collection.unshift(item);
} else {
  collection.push(item);
}
```

---

## Common Questions

### Q: Does it modify the original?

**Answer:** Yes:

```javascript
const items = ReactiveUtils.collection([2, 3]);
items.unshift(1);
console.log(items); // [1, 2, 3]
```

### Q: What does it return?

**Answer:** New length:

```javascript
const length = items.unshift(0);
console.log(length); // 4
```

### Q: Is it slower than push()?

**Answer:** Yes, because it shifts all elements:

```javascript
// unshift() - O(n) - has to move all items
items.unshift(1);

// push() - O(1) - just adds to end
items.push(1);
```

---

## Summary

### What `unshift()` Does:

1. ✅ Adds to beginning
2. ✅ Accepts multiple items
3. ✅ Returns new length
4. ✅ Modifies in place
5. ✅ Triggers reactivity

### When to Use It:

- Add to start
- Newest first display
- Priority items
- Recent activity
- Notifications

### The Basic Pattern:

```javascript
const collection = ReactiveUtils.collection([3, 4, 5]);

// Add single
collection.unshift(2); // [2, 3, 4, 5]

// Add multiple
collection.unshift(0, 1); // [0, 1, 2, 3, 4, 5]
```

---

**Remember:** `unshift()` adds to the beginning and triggers reactivity! 🎉
