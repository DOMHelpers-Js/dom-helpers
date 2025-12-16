# Understanding `first` - A Beginner's Guide

## What is `first`?

`first` is a reactive property of collections that returns the first item. It provides quick access to the beginning of the collection and updates automatically.

Think of it as **first item getter** - always get the first element.

---

## Why Does This Exist?

### The Problem: Accessing First Item

You often need the first item in a collection:

```javascript
// ❌ Without first - manual access
const items = ReactiveUtils.collection([1, 2, 3, 4, 5]);

const firstItem = items.length > 0 ? items[0] : undefined;
console.log(firstItem); // 1

// ✅ With first - clean
console.log(items.first); // 1
```

**Why this matters:**
- Cleaner syntax
- Built-in safety
- Reactive updates
- Semantic meaning

---

## How Does It Work?

### The First Property

```javascript
collection.first
    ↓
Returns items[0] or undefined
    ↓
Updates automatically when collection changes
```

---

## Basic Usage

### Get First Item

```javascript
const numbers = ReactiveUtils.collection([1, 2, 3, 4, 5]);

console.log(numbers.first); // 1

numbers.unshift(0);
console.log(numbers.first); // 0
```

### Check if Empty

```javascript
const items = ReactiveUtils.collection([]);

if (items.first === undefined) {
  console.log('Collection is empty');
}

items.push('item');
console.log(items.first); // 'item'
```

### Display First Item

```javascript
const tasks = ReactiveUtils.collection([
  { title: 'Buy milk', priority: 'high' },
  { title: 'Walk dog', priority: 'low' }
]);

ReactiveUtils.effect(() => {
  const display = document.getElementById('next-task');

  if (tasks.first) {
    display.textContent = `Next: ${tasks.first.title}`;
  } else {
    display.textContent = 'No tasks';
  }
});
```

---

## Simple Examples Explained

### Example 1: Next Task Display

```javascript
const taskQueue = ReactiveUtils.collection([
  { id: 1, title: 'Write report', priority: 'high' },
  { id: 2, title: 'Check email', priority: 'low' },
  { id: 3, title: 'Team meeting', priority: 'medium' }
]);

// Display next task
ReactiveUtils.effect(() => {
  const nextTask = document.getElementById('next-task');

  if (taskQueue.first) {
    nextTask.innerHTML = `
      <div class="task-card priority-${taskQueue.first.priority}">
        <h3>Next Task</h3>
        <p>${taskQueue.first.title}</p>
        <span class="priority">${taskQueue.first.priority}</span>
      </div>
    `;
  } else {
    nextTask.innerHTML = '<p>All tasks completed! 🎉</p>';
  }
});

// Complete current task
function completeTask() {
  if (taskQueue.first) {
    taskQueue.shift(); // Remove first task
  }
}

document.getElementById('complete-btn').onclick = completeTask;
```

---

### Example 2: Queue System

```javascript
const customerQueue = ReactiveUtils.collection([
  { id: 1, name: 'John Doe', ticketNumber: 101 },
  { id: 2, name: 'Jane Smith', ticketNumber: 102 },
  { id: 3, name: 'Bob Johnson', ticketNumber: 103 }
]);

// Display now serving
ReactiveUtils.effect(() => {
  const display = document.getElementById('now-serving');

  if (customerQueue.first) {
    display.innerHTML = `
      <div class="now-serving">
        <h2>Now Serving</h2>
        <p class="ticket-number">${customerQueue.first.ticketNumber}</p>
        <p class="customer-name">${customerQueue.first.name}</p>
      </div>
    `;
  } else {
    display.innerHTML = '<p>No customers in queue</p>';
  }
});

// Display queue count
ReactiveUtils.effect(() => {
  document.getElementById('queue-count').textContent =
    `${customerQueue.length} customers waiting`;
});

// Call next customer
function callNext() {
  if (customerQueue.first) {
    console.log(`Calling customer: ${customerQueue.first.name}`);
    customerQueue.shift();
  }
}

// Add customer to queue
function addCustomer(name) {
  const ticketNumber = customerQueue.length > 0
    ? customerQueue[customerQueue.length - 1].ticketNumber + 1
    : 101;

  customerQueue.push({
    id: Date.now(),
    name: name,
    ticketNumber: ticketNumber
  });
}

document.getElementById('call-next').onclick = callNext;
```

---

### Example 3: Playlist Player

```javascript
const playlist = ReactiveUtils.collection([
  { id: 1, title: 'Song 1', artist: 'Artist A', duration: '3:45' },
  { id: 2, title: 'Song 2', artist: 'Artist B', duration: '4:20' },
  { id: 3, title: 'Song 3', artist: 'Artist C', duration: '3:10' }
]);

const playerState = ReactiveUtils.state({
  isPlaying: false
});

// Display now playing
ReactiveUtils.effect(() => {
  const display = document.getElementById('now-playing');

  if (playlist.first) {
    display.innerHTML = `
      <div class="now-playing">
        <h3>${playlist.first.title}</h3>
        <p>${playlist.first.artist}</p>
        <span class="duration">${playlist.first.duration}</span>
      </div>
    `;
  } else {
    display.innerHTML = '<p>Playlist is empty</p>';
  }
});

// Display playlist
ReactiveUtils.effect(() => {
  const list = document.getElementById('playlist');

  list.innerHTML = playlist
    .map((song, index) => `
      <div class="song ${index === 0 ? 'active' : ''}">
        <span class="number">${index + 1}</span>
        <span class="title">${song.title}</span>
        <span class="artist">${song.artist}</span>
        <span class="duration">${song.duration}</span>
      </div>
    `)
    .join('');
});

// Play/Pause
function togglePlay() {
  if (playlist.first) {
    playerState.isPlaying = !playerState.isPlaying;
  }
}

// Next song
function nextSong() {
  if (playlist.first) {
    playlist.shift(); // Remove first song
    playerState.isPlaying = playlist.length > 0;
  }
}

// Skip to song
function skipToSong(index) {
  playlist.splice(0, index);
}

document.getElementById('play-pause').onclick = togglePlay;
document.getElementById('next').onclick = nextSong;
```

---

## Real-World Example: Notification Queue

```javascript
const notifications = ReactiveUtils.collection([]);

const notificationState = ReactiveUtils.state({
  autoHideDuration: 5000,
  isVisible: false
});

// Add notification
function addNotification(message, type = 'info') {
  notifications.push({
    id: Date.now(),
    message: message,
    type: type,
    timestamp: new Date()
  });

  showNextNotification();
}

// Show next notification
function showNextNotification() {
  if (!notificationState.isVisible && notifications.first) {
    notificationState.isVisible = true;

    setTimeout(() => {
      dismissCurrentNotification();
    }, notificationState.autoHideDuration);
  }
}

// Dismiss current notification
function dismissCurrentNotification() {
  if (notifications.first) {
    notifications.shift();
  }

  notificationState.isVisible = false;

  // Show next if available
  if (notifications.length > 0) {
    setTimeout(showNextNotification, 300);
  }
}

// Display current notification
ReactiveUtils.effect(() => {
  const display = document.getElementById('notification-display');

  if (notificationState.isVisible && notifications.first) {
    const notif = notifications.first;

    display.innerHTML = `
      <div class="notification notification-${notif.type} show">
        <div class="notification-content">
          <strong>${getTypeIcon(notif.type)}</strong>
          <span>${notif.message}</span>
        </div>
        <button class="close-btn" onclick="dismissCurrentNotification()">×</button>
      </div>
    `;
  } else {
    display.innerHTML = '';
  }
});

// Display queue count
ReactiveUtils.effect(() => {
  const badge = document.getElementById('queue-badge');

  if (notifications.length > 0) {
    badge.style.display = 'block';
    badge.textContent = notifications.length;
  } else {
    badge.style.display = 'none';
  }
});

// Helper function
function getTypeIcon(type) {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };
  return icons[type] || icons.info;
}

// Usage examples
addNotification('Welcome back!', 'success');
addNotification('You have 3 new messages', 'info');
addNotification('Low disk space', 'warning');
```

---

## Common Patterns

### Pattern 1: Simple Access

```javascript
const first = collection.first;
```

### Pattern 2: Safe Access

```javascript
if (collection.first) {
  console.log(collection.first.name);
}
```

### Pattern 3: Display First

```javascript
ReactiveUtils.effect(() => {
  element.textContent = collection.first?.title || 'Empty';
});
```

### Pattern 4: Process First

```javascript
function processNext() {
  if (collection.first) {
    handleItem(collection.first);
    collection.shift();
  }
}
```

---

## Common Questions

### Q: What if collection is empty?

**Answer:** Returns `undefined`:

```javascript
const empty = ReactiveUtils.collection([]);
console.log(empty.first); // undefined
```

### Q: Is it reactive?

**Answer:** Yes! Updates automatically:

```javascript
const items = ReactiveUtils.collection([1, 2, 3]);

ReactiveUtils.effect(() => {
  console.log(items.first); // Logs: 1
});

items.unshift(0); // Effect runs, logs: 0
```

### Q: Same as items[0]?

**Answer:** Similar, but safer:

```javascript
// Both work the same
console.log(items.first);
console.log(items[0]);

// But first is clearer and more semantic
```

---

## Tips for Success

### 1. Always Check for Undefined

```javascript
// ✅ Safe access
if (items.first) {
  console.log(items.first.name);
}

// ✅ Or use optional chaining
console.log(items.first?.name);
```

### 2. Use for Queue Operations

```javascript
// ✅ Process queue
while (queue.first) {
  processItem(queue.first);
  queue.shift();
}
```

### 3. Display Current Item

```javascript
// ✅ Show first item
ReactiveUtils.effect(() => {
  display.textContent = items.first?.title || 'No items';
});
```

---

## Summary

### What `first` Does:

1. ✅ Returns first item
2. ✅ Returns undefined if empty
3. ✅ Updates automatically
4. ✅ Reactive property
5. ✅ Semantic access

### When to Use It:

- Queue systems
- Next item display
- Current task
- Playlist player
- Processing first item

### The Basic Pattern:

```javascript
const collection = ReactiveUtils.collection([1, 2, 3, 4, 5]);

console.log(collection.first); // 1

collection.unshift(0);
console.log(collection.first); // 0

// Reactive display
ReactiveUtils.effect(() => {
  element.textContent = collection.first || 'Empty';
});
```

---

**Remember:** `first` is a reactive property that always returns the first item or undefined. Perfect for queue systems! 🎉
