# Understanding `toArray()` - A Beginner's Guide

## What is `toArray()`?

`toArray()` is a method for reactive collections that converts the collection to a plain JavaScript array. It creates a non-reactive copy of all items.

Think of it as **plain converter** - get a plain array copy.

---

## Why Does This Exist?

### The Problem: Converting to Plain Array

You need a plain array for external APIs or libraries:

```javascript
// ❌ Without toArray - collection is still reactive
const items = ReactiveUtils.collection([1, 2, 3]);

// Sending to API - might have issues with reactive proxy
await fetch('/api/save', {
  body: JSON.stringify(items) // Reactive proxy
});

// ✅ With toArray() - plain array
await fetch('/api/save', {
  body: JSON.stringify(items.toArray()) // Plain array
});
```

**Why this matters:**
- Plain JavaScript array
- No reactive proxy
- Safe for serialization
- Compatible with libraries

---

## How Does It Work?

### The ToArray Process

```javascript
collection.toArray()
    ↓
Creates shallow copy
Removes reactive proxy
    ↓
Returns plain array
```

---

## Basic Usage

### Simple Conversion

```javascript
const items = ReactiveUtils.collection([1, 2, 3, 4, 5]);

const plainArray = items.toArray();
console.log(Array.isArray(plainArray)); // true
console.log(plainArray); // [1, 2, 3, 4, 5]

// Modifying plain array doesn't affect collection
plainArray.push(6);
console.log(items.length); // Still 5
```

### With Objects

```javascript
const users = ReactiveUtils.collection([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
]);

const plainUsers = users.toArray();
console.log(plainUsers); // Plain array of objects
```

### For JSON Serialization

```javascript
const data = ReactiveUtils.collection([
  { id: 1, value: 'A' },
  { id: 2, value: 'B' }
]);

const json = JSON.stringify(data.toArray());
console.log(json); // '["1":{"id":1,"value":"A"},"2":{"id":2,"value":"B"}]'
```

---

## Simple Examples Explained

### Example 1: Save to LocalStorage

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, title: 'Buy milk', completed: false },
  { id: 2, title: 'Walk dog', completed: true }
]);

function saveTodos() {
  const plainTodos = todos.toArray();
  localStorage.setItem('todos', JSON.stringify(plainTodos));
  console.log('Todos saved!');
}

function loadTodos() {
  const stored = localStorage.getItem('todos');
  if (stored) {
    const plainTodos = JSON.parse(stored);
    todos.reset(plainTodos);
    console.log('Todos loaded!');
  }
}

// Auto-save on changes
ReactiveUtils.effect(() => {
  // Access collection to trigger on changes
  todos.length;
  saveTodos();
});

// Load on startup
loadTodos();
```

---

### Example 2: Export to CSV

```javascript
const data = ReactiveUtils.collection([
  { name: 'John', age: 30, city: 'New York' },
  { name: 'Jane', age: 25, city: 'Los Angeles' },
  { name: 'Bob', age: 35, city: 'Chicago' }
]);

function exportToCSV() {
  const plainData = data.toArray();

  // Create CSV header
  const headers = Object.keys(plainData[0]);
  const csv = [
    headers.join(','),
    ...plainData.map(row =>
      headers.map(h => row[h]).join(',')
    )
  ].join('\n');

  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'export.csv';
  a.click();
}

document.getElementById('export-btn').onclick = exportToCSV;
```

---

### Example 3: Send to API

```javascript
const items = ReactiveUtils.collection([
  { id: 1, name: 'Item 1', quantity: 10 },
  { id: 2, name: 'Item 2', quantity: 20 }
]);

async function saveToServer() {
  try {
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.toArray() // Plain array for JSON
      })
    });

    if (response.ok) {
      alert('Saved successfully!');
    }
  } catch (error) {
    console.error('Save failed:', error);
  }
}

document.getElementById('save-btn').onclick = saveToServer;
```

---

## Real-World Example: Data Export System

```javascript
const records = ReactiveUtils.collection([
  { id: 1, date: '2024-01-01', amount: 100, category: 'Food' },
  { id: 2, date: '2024-01-02', amount: 50, category: 'Transport' },
  { id: 3, date: '2024-01-03', amount: 200, category: 'Shopping' }
]);

const exportState = ReactiveUtils.state({
  format: 'json',
  isExporting: false
});

// Export to JSON
function exportToJSON() {
  const plainData = records.toArray();
  const json = JSON.stringify(plainData, null, 2);

  const blob = new Blob([json], { type: 'application/json' });
  downloadFile(blob, 'records.json');
}

// Export to CSV
function exportToCSV() {
  const plainData = records.toArray();

  if (plainData.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = Object.keys(plainData[0]);
  const rows = plainData.map(record =>
    headers.map(h => `"${record[h]}"`).join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  downloadFile(blob, 'records.csv');
}

// Export to Excel (simplified)
function exportToExcel() {
  const plainData = records.toArray();

  const headers = Object.keys(plainData[0]);
  const rows = [
    headers.join('\t'),
    ...plainData.map(record =>
      headers.map(h => record[h]).join('\t')
    )
  ].join('\n');

  const blob = new Blob([rows], { type: 'application/vnd.ms-excel' });
  downloadFile(blob, 'records.xls');
}

// Helper to download file
function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Export handler
async function handleExport() {
  if (exportState.isExporting) return;

  exportState.isExporting = true;

  try {
    switch (exportState.format) {
      case 'json':
        exportToJSON();
        break;
      case 'csv':
        exportToCSV();
        break;
      case 'excel':
        exportToExcel();
        break;
    }
  } finally {
    exportState.isExporting = false;
  }
}

// Display export UI
ReactiveUtils.effect(() => {
  const container = document.getElementById('export-panel');

  container.innerHTML = `
    <div class="export-panel">
      <h3>Export ${records.length} records</h3>
      <div class="format-selector">
        <label>
          <input type="radio"
                 name="format"
                 value="json"
                 ${exportState.format === 'json' ? 'checked' : ''}
                 onchange="exportState.format = 'json'">
          JSON
        </label>
        <label>
          <input type="radio"
                 name="format"
                 value="csv"
                 ${exportState.format === 'csv' ? 'checked' : ''}
                 onchange="exportState.format = 'csv'">
          CSV
        </label>
        <label>
          <input type="radio"
                 name="format"
                 value="excel"
                 ${exportState.format === 'excel' ? 'checked' : ''}
                 onchange="exportState.format = 'excel'">
          Excel
        </label>
      </div>
      <button onclick="handleExport()"
              ${exportState.isExporting ? 'disabled' : ''}>
        ${exportState.isExporting ? 'Exporting...' : 'Export'}
      </button>
    </div>
  `;
});

// Preview
ReactiveUtils.effect(() => {
  const preview = document.getElementById('preview');
  const plainData = records.toArray();

  let content = '';

  switch (exportState.format) {
    case 'json':
      content = `<pre>${JSON.stringify(plainData, null, 2)}</pre>`;
      break;
    case 'csv':
      const headers = Object.keys(plainData[0] || {});
      content = `<pre>${headers.join(',')}\n${plainData.map(r =>
        headers.map(h => r[h]).join(',')
      ).join('\n')}</pre>`;
      break;
    case 'excel':
      content = '<p>Excel format (tab-separated values)</p>';
      break;
  }

  preview.innerHTML = `<div class="preview"><h4>Preview</h4>${content}</div>`;
});
```

---

## Common Patterns

### Pattern 1: Simple Conversion

```javascript
const plainArray = collection.toArray();
```

### Pattern 2: JSON Serialization

```javascript
const json = JSON.stringify(collection.toArray());
```

### Pattern 3: Save to Storage

```javascript
localStorage.setItem('data', JSON.stringify(collection.toArray()));
```

### Pattern 4: Send to API

```javascript
await fetch('/api', {
  body: JSON.stringify(collection.toArray())
});
```

---

## Common Questions

### Q: Is it a shallow or deep copy?

**Answer:** Shallow copy:

```javascript
const items = ReactiveUtils.collection([{ id: 1 }]);
const plain = items.toArray();

plain[0].id = 99; // Modifies the original object
console.log(items[0].id); // 99
```

### Q: Does it lose reactivity?

**Answer:** Yes, that's the point:

```javascript
const plain = items.toArray();
// plain is not reactive
```

### Q: Same as spreading?

**Answer:** Similar result:

```javascript
const arr1 = collection.toArray();
const arr2 = [...collection];
// Both are plain arrays
```

---

## Summary

### What `toArray()` Does:

1. ✅ Returns plain array
2. ✅ Removes reactivity
3. ✅ Shallow copy
4. ✅ Safe for serialization
5. ✅ Library compatible

### When to Use It:

- JSON serialization
- API requests
- LocalStorage
- Export data
- External libraries

### The Basic Pattern:

```javascript
const collection = ReactiveUtils.collection([1, 2, 3]);

// Get plain array
const plainArray = collection.toArray();

// Save to storage
localStorage.setItem('data', JSON.stringify(collection.toArray()));

// Send to API
await fetch('/api', {
  body: JSON.stringify(collection.toArray())
});
```

---

**Remember:** `toArray()` gives you a plain JavaScript array without reactivity! 🎉
