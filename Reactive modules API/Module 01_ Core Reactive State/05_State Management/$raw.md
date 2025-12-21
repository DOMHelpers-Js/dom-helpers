# Understanding `state.$raw` - A Beginner's Guide

## What is `state.$raw`?

`state.$raw` is a **state instance property getter** that returns the underlying non-reactive raw object. It allows you to access the original data without triggering reactivity or dependency tracking.

Think of it as **peeking behind the curtain** - you get access to the actual data without any reactive wrapper, useful for performance-critical operations or external integrations.

---

## Syntax

```js
const rawObject = state.$raw
```

**Parameters:**
- None (it's a property getter, not a method)

**Returns:**
- The underlying raw (non-reactive) object

---

## Why Does This Exist?

### The Problem with Always-Reactive Access

When you access reactive state, it always triggers dependency tracking:

```javascript
// Every access triggers reactivity
const data = state({
  items: [1, 2, 3, 4, 5],
  config: { theme: 'dark', lang: 'en' }
});

effect(() => {
  // This effect tracks 'items' even though we just want to log
  console.log('Items:', data.items);

  // Accessing items in a loop tracks it multiple times
  for (let i = 0; i < data.items.length; i++) {
    console.log(data.items[i]); // Tracks every access
  }
});

// Send to external API
function sendToAPI() {
  // This triggers tracking even though it shouldn't
  fetch('/api/save', {
    method: 'POST',
    body: JSON.stringify(data) // Reactive proxy serialized
  });
}
```

**What's the Real Issue?**

**Problems:**
- Unnecessary dependency tracking
- Performance overhead for read-only operations
- External libraries receive reactive proxies
- JSON serialization includes proxy metadata
- Can't do raw comparisons or operations

---

### The Solution with `$raw`

When you use `$raw`, you get the original object:

```javascript
// With $raw - no tracking
const data = state({
  items: [1, 2, 3, 4, 5],
  config: { theme: 'dark', lang: 'en' }
});

effect(() => {
  // Get raw items - no tracking
  const rawItems = data.$raw.items;

  console.log('Items:', rawItems);

  // Loop without tracking each access
  for (let i = 0; i < rawItems.length; i++) {
    console.log(rawItems[i]); // No tracking overhead
  }
});

// Send to external API
function sendToAPI() {
  // Send raw object - no proxy
  fetch('/api/save', {
    method: 'POST',
    body: JSON.stringify(data.$raw) // Clean JSON
  });
}
```

**Benefits:**
- No dependency tracking overhead
- Better performance for read-only operations
- Clean data for external libraries
- Proper JSON serialization
- Access to raw object methods

---

## How Does It Work?

### Under the Hood

`$raw` returns the original object without the reactive wrapper:

```
state.$raw
    ↓
1. Access internal raw object reference
2. Return original (non-reactive) object
3. No dependency tracking triggered
    ↓
Raw object ready for use
```

---

## Basic Usage

### Access Raw Object

```js
const user = state({
  name: 'John',
  age: 25,
  settings: { theme: 'dark' }
});

// Get reactive proxy
console.log(user); // Proxy { name: 'John', age: 25, ... }

// Get raw object
console.log(user.$raw); // { name: 'John', age: 25, ... }

// Access raw properties
console.log(user.$raw.name); // 'John' (no tracking)
console.log(user.$raw.age); // 25 (no tracking)
```

### Compare Raw vs Reactive

```js
const data = state({ value: 10 });

console.log(isReactive(data)); // true
console.log(isReactive(data.$raw)); // false

// They reference the same underlying data
data.value = 20;
console.log(data.$raw.value); // 20 (same data)
```

### Use in Effects Without Tracking

```js
const list = state({ items: [1, 2, 3, 4, 5] });

effect(() => {
  // Access raw items - doesn't track 'items' dependency
  const rawItems = list.$raw.items;

  // Perform operations without tracking
  console.log('Length:', rawItems.length);
  console.log('First:', rawItems[0]);
  console.log('Last:', rawItems[rawItems.length - 1]);
});

// Changing items won't trigger the effect
list.items.push(6); // Effect doesn't re-run
```

---

## Common Use Cases

### Use Case 1: JSON Serialization

```js
const appState = state({
  user: {
    id: 123,
    name: 'John Doe',
    email: 'john@example.com'
  },
  settings: {
    theme: 'dark',
    notifications: true
  },
  data: [1, 2, 3, 4, 5]
});

// Save to localStorage
function saveState() {
  // Use $raw for clean JSON serialization
  const rawState = appState.$raw;

  // Serialize raw object (no proxy metadata)
  const json = JSON.stringify(rawState, null, 2);

  // Save to localStorage
  localStorage.setItem('appState', json);
  console.log('State saved:', json);
}

// Load from localStorage
function loadState() {
  const json = localStorage.getItem('appState');
  if (json) {
    // Parse and update state
    const loaded = JSON.parse(json);
    Object.assign(appState, loaded);
    console.log('State loaded');
  }
}

saveState();
```

### Use Case 2: API Integration

```js
const formData = state({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
});

// Submit form to API
async function submitForm() {
  try {
    // Get raw form data (no reactive proxy)
    const raw = formData.$raw;

    // Send clean object to API
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: raw.username,
        email: raw.email,
        password: raw.password
        // Don't send confirmPassword (validation only)
      })
    });

    if (response.ok) {
      console.log('Registration successful');
    }
  } catch (error) {
    console.error('Registration failed:', error);
  }
}
```

### Use Case 3: External Library Integration

```js
const chartData = state({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Sales',
      data: [12, 19, 3, 5, 2]
    }
  ]
});

// Use with Chart.js library
function renderChart() {
  // Get raw data for external library
  const rawData = chartData.$raw;

  // Chart.js expects plain objects, not proxies
  const chart = new Chart(ctx, {
    type: 'line',
    data: rawData, // Pass raw object
    options: {
      responsive: true
    }
  });
}

// Update chart data
function updateChart() {
  chartData.datasets[0].data = [15, 22, 8, 12, 6];

  // Re-render with updated raw data
  renderChart();
}
```

### Use Case 4: Performance-Critical Loops

```js
const gameState = state({
  entities: Array(10000).fill(null).map((_, i) => ({
    id: i,
    x: Math.random() * 800,
    y: Math.random() * 600,
    health: 100
  }))
});

// Game loop update
function updateGameLoop() {
  // Get raw entities array (no tracking overhead)
  const rawEntities = gameState.$raw.entities;

  // Process thousands of entities without tracking
  for (let i = 0; i < rawEntities.length; i++) {
    const entity = rawEntities[i];

    // Update positions (no reactive overhead)
    entity.x += Math.random() * 2 - 1;
    entity.y += Math.random() * 2 - 1;

    // Keep in bounds
    entity.x = Math.max(0, Math.min(800, entity.x));
    entity.y = Math.max(0, Math.min(600, entity.y));
  }

  // After all updates, notify once
  gameState.$notify('entities');
}

// Run at 60 FPS
setInterval(updateGameLoop, 1000 / 60);
```

### Use Case 5: Deep Comparison

```js
const config = state({
  theme: 'dark',
  language: 'en',
  notifications: {
    email: true,
    push: false,
    sms: false
  }
});

// Save config snapshot
let savedConfig = null;

function saveSnapshot() {
  // Deep clone raw config (no proxy)
  savedConfig = JSON.parse(JSON.stringify(config.$raw));
  console.log('Snapshot saved');
}

function hasChanges() {
  // Compare raw objects
  const current = JSON.stringify(config.$raw);
  const saved = JSON.stringify(savedConfig);

  return current !== saved;
}

function promptSave() {
  if (hasChanges()) {
    console.log('You have unsaved changes!');
  }
}

saveSnapshot();
config.theme = 'light'; // Make changes
promptSave(); // Detects changes
```

---

## Advanced Patterns

### Pattern 1: Conditional Raw Access

```js
const data = state({ items: [], debug: false });

// Helper to get items (raw or reactive based on flag)
function getItems(reactive = true) {
  // Return reactive or raw based on flag
  return reactive ? data.items : data.$raw.items;
}

effect(() => {
  // Get reactive items - tracks dependency
  const items = getItems(true);
  console.log('Reactive items:', items.length);
});

// Log raw items without tracking
console.log('Raw items:', getItems(false));
```

### Pattern 2: Raw Snapshot for Undo

```js
const editor = state({
  content: '',
  cursor: 0
});

const history = [];
let historyIndex = -1;

// Save snapshot
function saveSnapshot() {
  // Remove any redo history
  history.splice(historyIndex + 1);

  // Clone raw state for snapshot
  const snapshot = JSON.parse(JSON.stringify(editor.$raw));
  history.push(snapshot);
  historyIndex++;

  // Limit history to 50 items
  if (history.length > 50) {
    history.shift();
    historyIndex--;
  }
}

// Undo
function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    // Restore from snapshot
    Object.assign(editor, history[historyIndex]);
  }
}

// Redo
function redo() {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    Object.assign(editor, history[historyIndex]);
  }
}
```

### Pattern 3: Export/Import

```js
const settings = state({
  theme: 'dark',
  fontSize: 14,
  shortcuts: {},
  plugins: []
});

// Export settings to file
function exportSettings() {
  // Get raw settings
  const raw = settings.$raw;

  // Create export object
  const exportData = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    settings: raw
  };

  // Convert to JSON
  const json = JSON.stringify(exportData, null, 2);

  // Create download
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'settings.json';
  a.click();
}

// Import settings from file
function importSettings(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const json = e.target.result;
    const imported = JSON.parse(json);

    // Validate version
    if (imported.version === '1.0') {
      // Apply imported settings
      Object.assign(settings, imported.settings);
      console.log('Settings imported');
    }
  };
  reader.readAsText(file);
}
```

### Pattern 4: Raw Batch Processing

```js
const data = state({ records: [] });

// Process large dataset without tracking
function processBatch(newRecords) {
  // Get raw records array
  const raw = data.$raw.records;

  // Batch process without triggering reactivity
  for (const record of newRecords) {
    // Transform and add
    raw.push({
      id: record.id,
      name: record.name.toUpperCase(),
      timestamp: Date.now()
    });
  }

  // Manually notify after all processing
  data.$notify('records');
}

// Process 1000 records efficiently
processBatch(Array(1000).fill(null).map((_, i) => ({
  id: i,
  name: `Record ${i}`
})));
```

---

## Performance Tips

### Tip 1: Use $raw for Read-Heavy Operations

```js
// GOOD - use $raw for reads
const raw = state.$raw.items;
for (let i = 0; i < raw.length; i++) {
  console.log(raw[i]); // No tracking
}

// BAD - reactive access in loop
for (let i = 0; i < state.items.length; i++) {
  console.log(state.items[i]); // Tracks every access
}
```

### Tip 2: Use $raw for External APIs

```js
// GOOD - send raw data
fetch('/api', {
  body: JSON.stringify(state.$raw)
});

// BAD - send reactive proxy
fetch('/api', {
  body: JSON.stringify(state) // May include proxy metadata
});
```

### Tip 3: Clone Raw for Snapshots

```js
// GOOD - clone raw object
const snapshot = JSON.parse(JSON.stringify(state.$raw));

// BAD - clone reactive object
const snapshot = JSON.parse(JSON.stringify(state));
```

---

## Common Pitfalls

### Pitfall 1: Modifying Raw Directly

```js
// WRONG - modify raw without notifying
state.$raw.value = 10;
// Reactivity won't detect this change!

// RIGHT - modify through reactive proxy
state.value = 10;
// Or modify raw and notify
state.$raw.value = 10;
state.$notify('value');
```

### Pitfall 2: Storing Raw References

```js
// WRONG - storing raw reference
const rawItems = state.$raw.items;
rawItems.push(1); // Modifies without tracking

// RIGHT - always access through $raw
state.$raw.items.push(1);
state.$notify('items');
```

### Pitfall 3: Expecting Reactivity on Raw

```js
// WRONG - raw object is not reactive
effect(() => {
  const raw = state.$raw;
  console.log(raw.count); // Won't track changes
});

// RIGHT - use reactive state
effect(() => {
  console.log(state.count); // Tracks changes
});
```

---

## Summary

**`state.$raw` returns the underlying non-reactive raw object.**

Key takeaways:
- ✅ **Property getter** (not a method) on state instance
- ✅ Returns **non-reactive** raw object
- ✅ **No dependency tracking** when accessed
- ✅ Great for **JSON serialization**, **API calls**, **external libraries**, **performance**
- ✅ Use for **read-heavy operations** and **deep cloning**
- ⚠️ Don't **modify raw** without notifying reactivity
- ⚠️ Raw objects are **not reactive**
- ⚠️ Use reactive state for **normal operations**

**Remember:** Use `$raw` when you need the underlying object without reactivity - for APIs, serialization, external libraries, or performance-critical operations! 🎉

➡️ Next, explore [`$update()`]($update.md) for mixed state+DOM updates or [`$set()`]($set.md) for functional updates!
