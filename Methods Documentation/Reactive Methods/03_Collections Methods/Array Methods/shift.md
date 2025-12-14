# Understanding `shift()` - A Beginner's Guide

## What is `shift()`?

`shift()` is a method for reactive collections that removes and returns the first item. It works like JavaScript's array `shift()` and triggers reactivity.

Think of it as **start remover** - remove and get the first item.

---

## Why Does This Exist?

### The Problem: Removing from Start

You need to remove the first item from a collection:

```javascript
// ❌ Without shift - manual removal
const items = ReactiveUtils.collection([1, 2, 3, 4, 5]);
const first = items[0];
for (let i = 0; i < items.length - 1; i++) {
  items[i] = items[i + 1];
}
items.length--;

// ✅ With shift() - clean
const first = items.shift();
console.log(first); // 1
console.log(items); // [2, 3, 4, 5]
```

**Why this matters:**
- Simple removal
- Returns removed item
- Modifies in place
- Triggers reactivity

---

## How Does It Work?

### The Shift Process

```javascript
collection.shift()
    ↓
Removes first item
Shifts all other items down
    ↓
Returns removed item (or undefined if empty)
Triggers reactive updates
```

---

## Basic Usage

### Remove First Item

```javascript
const items = ReactiveUtils.collection([1, 2, 3, 4, 5]);
const first = items.shift();
console.log(first); // 1
console.log(items); // [2, 3, 4, 5]
```

### Empty Collection

```javascript
const items = ReactiveUtils.collection([]);
const first = items.shift();
console.log(first); // undefined
```

### Remove Multiple from Start

```javascript
const items = ReactiveUtils.collection([1, 2, 3, 4, 5]);
const removed = [];
removed.push(items.shift()); // 1
removed.push(items.shift()); // 2
removed.push(items.shift()); // 3
console.log(items); // [4, 5]
console.log(removed); // [1, 2, 3]
```

---

## Simple Examples Explained

### Example 1: Task Queue

```javascript
const taskQueue = ReactiveUtils.collection([
  { id: 1, title: 'Process order #101' },
  { id: 2, title: 'Send email to customer' },
  { id: 3, title: 'Update inventory' }
]);

function processNextTask() {
  const task = taskQueue.shift();
  if (task) {
    console.log(`Processing: ${task.title}`);
    // Perform task...
    return task;
  }
  console.log('No tasks to process');
  return null;
}

// Display queue
ReactiveUtils.effect(() => {
  const container = document.getElementById('queue');
  container.innerHTML = taskQueue
    .map((task, index) => `
      <div class="task ${index === 0 ? 'next' : ''}">
        ${task.title}
        ${index === 0 ? ' ← Next' : ''}
      </div>
    `)
    .join('');
});

// Enable/disable process button
ReactiveUtils.effect(() => {
  document.getElementById('process-btn').disabled = taskQueue.length === 0;
});
```

---

### Example 2: Print Queue

```javascript
const printQueue = ReactiveUtils.collection([]);

function addToPrintQueue(document) {
  printQueue.push({
    id: Date.now(),
    name: document.name,
    pages: document.pages,
    status: 'queued'
  });
}

function printNext() {
  const doc = printQueue.shift();
  if (doc) {
    console.log(`Printing: ${doc.name} (${doc.pages} pages)`);
    // Simulate printing
    setTimeout(() => {
      console.log(`Printed: ${doc.name}`);
    }, 2000);
    return doc;
  }
  return null;
}

// Display queue
ReactiveUtils.effect(() => {
  const container = document.getElementById('print-queue');

  if (printQueue.length === 0) {
    container.innerHTML = '<p>No documents in queue</p>';
    return;
  }

  container.innerHTML = `
    <p>Queue: ${printQueue.length} document(s)</p>
    ${printQueue.map((doc, index) => `
      <div class="document">
        ${index + 1}. ${doc.name} (${doc.pages} pages)
      </div>
    `).join('')}
  `;
});

// Auto-print
const autoPrint = ReactiveUtils.state({ enabled: false });

ReactiveUtils.effect(() => {
  if (autoPrint.enabled && printQueue.length > 0) {
    printNext();
  }
});
```

---

### Example 3: Message Stream

```javascript
const messages = ReactiveUtils.collection([]);
const maxMessages = 5;

function addMessage(text) {
  messages.push({
    id: Date.now(),
    text: text,
    timestamp: new Date()
  });

  // Keep only last N messages
  while (messages.length > maxMessages) {
    messages.shift(); // Remove oldest
  }
}

// Display messages
ReactiveUtils.effect(() => {
  const container = document.getElementById('messages');
  container.innerHTML = messages
    .map(msg => `
      <div class="message">
        <span>${msg.text}</span>
        <small>${msg.timestamp.toLocaleTimeString()}</small>
      </div>
    `)
    .join('');
});

// Usage
addMessage('Welcome!');
addMessage('New notification');
addMessage('Another message');
// ... keeps only last 5
```

---

## Real-World Example: Event Processing System

```javascript
const eventQueue = ReactiveUtils.collection([]);
const processingState = ReactiveUtils.state({
  isProcessing: false,
  currentEvent: null,
  processedCount: 0
});

// Add event to queue
function queueEvent(type, data) {
  eventQueue.push({
    id: Date.now(),
    type: type,
    data: data,
    timestamp: new Date()
  });

  // Auto-start processing if not already processing
  if (!processingState.isProcessing) {
    processEvents();
  }
}

// Process events
async function processEvents() {
  if (processingState.isProcessing || eventQueue.length === 0) {
    return;
  }

  processingState.isProcessing = true;

  while (eventQueue.length > 0) {
    const event = eventQueue.shift();
    processingState.currentEvent = event;

    console.log(`Processing event: ${event.type}`);

    // Simulate async processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Process based on type
    await handleEvent(event);

    processingState.processedCount++;
  }

  processingState.isProcessing = false;
  processingState.currentEvent = null;
}

// Handle different event types
async function handleEvent(event) {
  switch (event.type) {
    case 'user.login':
      console.log(`User logged in: ${event.data.username}`);
      break;
    case 'file.upload':
      console.log(`File uploaded: ${event.data.filename}`);
      break;
    case 'task.complete':
      console.log(`Task completed: ${event.data.taskId}`);
      break;
  }
}

// Display queue
ReactiveUtils.effect(() => {
  const container = document.getElementById('event-queue');

  container.innerHTML = `
    <h3>Event Queue (${eventQueue.length})</h3>
    ${eventQueue.length === 0 ? '<p>No events in queue</p>' : ''}
    ${eventQueue.map((event, index) => `
      <div class="event">
        ${index + 1}. [${event.type}] - ${event.timestamp.toLocaleTimeString()}
      </div>
    `).join('')}
  `;
});

// Display current processing
ReactiveUtils.effect(() => {
  const container = document.getElementById('current-processing');

  if (processingState.currentEvent) {
    container.innerHTML = `
      <div class="processing">
        <strong>Processing:</strong> ${processingState.currentEvent.type}
        <span class="spinner">⏳</span>
      </div>
    `;
  } else if (processingState.isProcessing) {
    container.innerHTML = '<div>Processing...</div>';
  } else {
    container.innerHTML = '<div>Idle</div>';
  }
});

// Display stats
ReactiveUtils.effect(() => {
  document.getElementById('processed-count').textContent =
    processingState.processedCount;
  document.getElementById('queue-length').textContent =
    eventQueue.length;
});

// Usage
queueEvent('user.login', { username: 'john' });
queueEvent('file.upload', { filename: 'document.pdf' });
queueEvent('task.complete', { taskId: 123 });
```

---

## Common Patterns

### Pattern 1: Remove First

```javascript
const first = collection.shift();
```

### Pattern 2: Check Before Removing

```javascript
if (collection.length > 0) {
  const first = collection.shift();
}
```

### Pattern 3: Process Queue

```javascript
while (queue.length > 0) {
  const item = queue.shift();
  process(item);
}
```

### Pattern 4: Limit Size

```javascript
if (collection.length > max) {
  collection.shift(); // Remove oldest
}
```

---

## Common Questions

### Q: What if collection is empty?

**Answer:** Returns `undefined`:

```javascript
const items = ReactiveUtils.collection([]);
console.log(items.shift()); // undefined
```

### Q: Does it modify the original?

**Answer:** Yes:

```javascript
const items = ReactiveUtils.collection([1, 2, 3]);
items.shift();
console.log(items); // [2, 3]
```

### Q: Is it slower than pop()?

**Answer:** Yes, because it shifts all elements:

```javascript
// shift() - O(n) - has to move all items
items.shift();

// pop() - O(1) - just removes last
items.pop();
```

---

## Summary

### What `shift()` Does:

1. ✅ Removes first item
2. ✅ Returns removed item
3. ✅ Returns undefined if empty
4. ✅ Modifies in place
5. ✅ Triggers reactivity

### When to Use It:

- Remove from start
- Queue operations (FIFO)
- Process in order
- Limit collection size
- Event processing

### The Basic Pattern:

```javascript
const collection = ReactiveUtils.collection([1, 2, 3, 4, 5]);

// Remove first
const first = collection.shift(); // 1
console.log(collection); // [2, 3, 4, 5]

// Process queue
while (queue.length > 0) {
  const item = queue.shift();
  process(item);
}
```

---

**Remember:** `shift()` removes from the start. Use for queues and FIFO operations! 🎉
