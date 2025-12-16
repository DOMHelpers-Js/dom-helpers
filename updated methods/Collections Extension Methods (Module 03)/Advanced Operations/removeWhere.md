# Understanding `removeWhere()` - A Beginner's Guide

## What is `removeWhere()`?

`removeWhere()` is a method for reactive collections that removes all items matching a condition. It's like `filter()` but removes instead of keeping.

Think of it as **conditional remover** - delete all matching items.

---

## Why Does This Exist?

### The Problem: Removing Multiple Items

You need to remove all items that match criteria:

```javascript
// ❌ Without removeWhere - manual removal
const items = ReactiveUtils.collection([
  { id: 1, status: 'active' },
  { id: 2, status: 'deleted' },
  { id: 3, status: 'deleted' }
]);

for (let i = items.length - 1; i >= 0; i--) {
  if (items[i].status === 'deleted') {
    items.splice(i, 1);
  }
}

// ✅ With removeWhere() - clean
items.removeWhere(item => item.status === 'deleted');
```

**Why this matters:**
- Bulk removal
- Clean syntax
- Automatic indexing
- Triggers reactivity

---

## How Does It Work?

### The RemoveWhere Process

```javascript
collection.removeWhere(predicate)
    ↓
Tests each item with predicate
    ↓
Removes all matching items
Returns removed items array
Triggers reactive updates
```

---

## Basic Usage

### Remove by Property

```javascript
const items = ReactiveUtils.collection([
  { id: 1, completed: false },
  { id: 2, completed: true },
  { id: 3, completed: true }
]);

const removed = items.removeWhere(item => item.completed);
console.log(removed); // [{ id: 2 }, { id: 3 }]
console.log(items); // [{ id: 1 }]
```

### Remove by Condition

```javascript
const numbers = ReactiveUtils.collection([1, 2, 3, 4, 5, 6]);

numbers.removeWhere(n => n > 3);
console.log(numbers); // [1, 2, 3]
```

### Remove All

```javascript
const items = ReactiveUtils.collection([1, 2, 3]);

items.removeWhere(() => true); // Remove all
console.log(items); // []
```

---

## Simple Examples Explained

### Example 1: Clear Completed Tasks

```javascript
const tasks = ReactiveUtils.collection([
  { id: 1, title: 'Buy milk', completed: false },
  { id: 2, title: 'Walk dog', completed: true },
  { id: 3, title: 'Read book', completed: true },
  { id: 4, title: 'Call mom', completed: false }
]);

function clearCompleted() {
  const removed = tasks.removeWhere(task => task.completed);
  console.log(`Removed ${removed.length} completed tasks`);
}

// Display tasks
ReactiveUtils.effect(() => {
  const container = document.getElementById('tasks');
  const completedCount = tasks.filter(t => t.completed).length;

  container.innerHTML = `
    <h3>Tasks</h3>
    ${tasks.map(task => `
      <div class="task ${task.completed ? 'completed' : ''}">
        <input type="checkbox"
               ${task.completed ? 'checked' : ''}
               onchange="task.completed = !task.completed">
        <span>${task.title}</span>
      </div>
    `).join('')}
    ${completedCount > 0 ? `
      <button onclick="clearCompleted()">
        Clear ${completedCount} completed task(s)
      </button>
    ` : ''}
  `;
});
```

---

### Example 2: Remove Expired Items

```javascript
const sessions = ReactiveUtils.collection([
  { id: 1, user: 'John', expiresAt: Date.now() + 3600000 },
  { id: 2, user: 'Jane', expiresAt: Date.now() - 1000 },
  { id: 3, user: 'Bob', expiresAt: Date.now() + 7200000 },
  { id: 4, user: 'Alice', expiresAt: Date.now() - 5000 }
]);

function removeExpiredSessions() {
  const now = Date.now();
  const removed = sessions.removeWhere(session => session.expiresAt < now);
  console.log(`Removed ${removed.length} expired sessions`);
  return removed;
}

// Auto cleanup every minute
setInterval(removeExpiredSessions, 60000);

// Display active sessions
ReactiveUtils.effect(() => {
  const container = document.getElementById('sessions');
  container.innerHTML = `
    <h3>Active Sessions (${sessions.length})</h3>
    ${sessions.map(session => {
      const remaining = Math.max(0, session.expiresAt - Date.now());
      const minutes = Math.floor(remaining / 60000);
      return `
        <div class="session">
          <strong>${session.user}</strong>
          <span>Expires in ${minutes} minutes</span>
        </div>
      `;
    }).join('')}
  `;
});
```

---

### Example 3: Bulk Delete

```javascript
const items = ReactiveUtils.collection([
  { id: 1, name: 'Item 1', selected: false },
  { id: 2, name: 'Item 2', selected: true },
  { id: 3, name: 'Item 3', selected: false },
  { id: 4, name: 'Item 4', selected: true }
]);

function deleteSelected() {
  const removed = items.removeWhere(item => item.selected);

  if (removed.length > 0) {
    alert(`Deleted ${removed.length} item(s)`);
  }
}

// Display items
ReactiveUtils.effect(() => {
  const container = document.getElementById('items');
  const selectedCount = items.filter(i => i.selected).length;

  container.innerHTML = `
    ${items.map(item => `
      <div class="item">
        <input type="checkbox"
               ${item.selected ? 'checked' : ''}
               onchange="item.selected = !item.selected">
        <span>${item.name}</span>
      </div>
    `).join('')}
    ${selectedCount > 0 ? `
      <button onclick="deleteSelected()" class="danger">
        Delete ${selectedCount} selected
      </button>
    ` : ''}
  `;
});
```

---

## Real-World Example: Inbox Management

```javascript
const emails = ReactiveUtils.collection([
  { id: 1, from: 'john@example.com', subject: 'Hello', read: false, spam: false, starred: false },
  { id: 2, from: 'spam@ads.com', subject: 'Buy now!', read: false, spam: true, starred: false },
  { id: 3, from: 'jane@work.com', subject: 'Report', read: true, spam: false, starred: true },
  { id: 4, from: 'spam@junk.com', subject: 'Win money!', read: false, spam: true, starred: false }
]);

// Remove spam
function removeSpam() {
  const removed = emails.removeWhere(email => email.spam);
  console.log(`Removed ${removed.length} spam emails`);
}

// Remove read emails
function removeRead() {
  const removed = emails.removeWhere(email => email.read && !email.starred);
  console.log(`Removed ${removed.length} read emails (kept starred)`);
}

// Empty trash (remove all non-starred)
function emptyTrash() {
  if (confirm('Empty trash? This cannot be undone.')) {
    const removed = emails.removeWhere(email => !email.starred);
    console.log(`Removed ${removed.length} emails`);
  }
}

// Remove older than date
function removeOlderThan(days) {
  const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
  const removed = emails.removeWhere(email =>
    email.timestamp < cutoff && !email.starred
  );
  return removed.length;
}

// Display emails
ReactiveUtils.effect(() => {
  const container = document.getElementById('inbox');
  const stats = {
    total: emails.length,
    unread: emails.filter(e => !e.read).length,
    spam: emails.filter(e => e.spam).length,
    starred: emails.filter(e => e.starred).length
  };

  container.innerHTML = `
    <div class="inbox-header">
      <h3>Inbox (${stats.unread} unread)</h3>
      <div class="actions">
        ${stats.spam > 0 ? `
          <button onclick="removeSpam()">
            Remove ${stats.spam} spam
          </button>
        ` : ''}
        <button onclick="removeRead()">Clean up read</button>
        <button onclick="emptyTrash()" class="danger">Empty trash</button>
      </div>
    </div>
    <div class="email-list">
      ${emails.map(email => `
        <div class="email ${email.read ? 'read' : 'unread'} ${email.spam ? 'spam' : ''}">
          <div class="email-header">
            <strong>${email.from}</strong>
            ${email.starred ? '⭐' : ''}
            ${email.spam ? '🚫' : ''}
          </div>
          <div class="email-subject">${email.subject}</div>
          <div class="email-actions">
            <button onclick="email.starred = !email.starred">
              ${email.starred ? 'Unstar' : 'Star'}
            </button>
            <button onclick="email.spam = true">Mark spam</button>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="inbox-stats">
      Total: ${stats.total} | Unread: ${stats.unread} | Starred: ${stats.starred}
    </div>
  `;
});
```

---

## Common Patterns

### Pattern 1: Remove by Property

```javascript
collection.removeWhere(item => item.deleted);
```

### Pattern 2: Remove by Condition

```javascript
collection.removeWhere(item => item.score < 50);
```

### Pattern 3: Remove and Count

```javascript
const removed = collection.removeWhere(predicate);
console.log(`Removed ${removed.length} items`);
```

### Pattern 4: Remove with Confirmation

```javascript
if (confirm('Delete all?')) {
  collection.removeWhere(() => true);
}
```

---

## Common Questions

### Q: Does it modify the original?

**Answer:** Yes, removes in place:

```javascript
const items = ReactiveUtils.collection([1, 2, 3, 4]);
items.removeWhere(n => n > 2);
console.log(items); // [1, 2]
```

### Q: What does it return?

**Answer:** Array of removed items:

```javascript
const removed = items.removeWhere(i => i.completed);
console.log(removed); // Array of removed items
```

### Q: Is it reactive?

**Answer:** Yes:

```javascript
ReactiveUtils.effect(() => {
  console.log(items.length);
});
items.removeWhere(i => i.old); // Effect runs
```

---

## Summary

### What `removeWhere()` Does:

1. ✅ Removes matching items
2. ✅ Tests with predicate
3. ✅ Returns removed array
4. ✅ Modifies in place
5. ✅ Triggers reactivity

### When to Use It:

- Bulk deletion
- Clear completed
- Remove expired
- Delete selected
- Cleanup operations

### The Basic Pattern:

```javascript
const collection = ReactiveUtils.collection([
  { id: 1, active: true },
  { id: 2, active: false },
  { id: 3, active: false }
]);

// Remove inactive
const removed = collection.removeWhere(item => !item.active);
console.log(removed.length); // 2
console.log(collection); // [{ id: 1, active: true }]
```

---

**Remember:** `removeWhere()` removes all matching items and returns them! 🎉
