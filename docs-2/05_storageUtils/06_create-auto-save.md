[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# .createAutoSave() — Debounced Automatic Saving

## Quick Start (30 seconds)

```javascript
// Create an auto-save manager for form data
const formSaver = StorageUtils.createAutoSave('formDraft');

// Save as the user types — debounced automatically
inputField.addEventListener('input', () => {
  formSaver.save({ text: inputField.value });
  // Doesn't save to storage immediately — waits 300ms of quiet
});

// Load the saved draft
const draft = formSaver.load();
console.log(draft);  // { text: "whatever the user typed" }
```

---

## What is .createAutoSave()?

`.createAutoSave()` creates a **manager object** that handles saving data to storage with built-in **debouncing**. Instead of saving every single time you call `.save()`, it waits for a quiet period (default: 300ms) before actually writing to storage.

Simply put, it's a **smart save button** that waits for you to stop making changes before saving — preventing hundreds of unnecessary writes.

---

## Syntax

```javascript
const manager = StorageUtils.createAutoSave(key, options)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | String | Yes | The storage key to save under |
| `options` | Object | No | Configuration options (see below) |

### Options Object

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage` | String | `'localStorage'` | `'localStorage'` or `'sessionStorage'` |
| `namespace` | String | (none) | Namespace prefix for the key |
| `debounce` | Number (ms) | `300` | How long to wait (in milliseconds) after the last `.save()` call before writing |
| `onSave` | Function | (none) | Callback fired after data is actually written to storage |
| `onLoad` | Function | (none) | Callback fired after data is loaded from storage |

**Returns:** A manager object with methods to control the auto-save behavior.

---

## The Manager Object

`.createAutoSave()` returns an object with these methods and properties:

| Method/Property | What It Does |
|----------------|-------------|
| `.save(data)` | Schedule a save (debounced — waits before writing) |
| `.saveNow(data)` | Save immediately (skips debounce) |
| `.load(defaultValue)` | Load the current data from storage |
| `.clear()` | Remove the data from storage and cancel pending saves |
| `.stop()` | Pause auto-saving (calls to `.save()` are ignored) |
| `.start()` | Resume auto-saving |
| `.isStopped` | `true` if auto-saving is paused, `false` if active |

---

## Why Does This Exist?

### The Problem: Too Many Saves

Imagine saving every keystroke as a user types in a text field:

```javascript
// ❌ Saves to localStorage on EVERY keystroke
textarea.addEventListener('input', () => {
  StorageUtils.save('draft', textarea.value);
});
```

If the user types "Hello World" (11 characters), that's **11 calls to `localStorage.setItem()`** in rapid succession:

```
Keystroke: H → save "H"
Keystroke: e → save "He"
Keystroke: l → save "Hel"
Keystroke: l → save "Hell"
Keystroke: o → save "Hello"
...11 storage writes for 11 keystrokes
```

This is wasteful — only the final value matters.

### The Solution: Debounced Saving

With `createAutoSave`, the save is **delayed** until the user stops typing:

```javascript
// ✅ Debounced — waits 300ms of quiet before saving
const drafts = StorageUtils.createAutoSave('draft');

textarea.addEventListener('input', () => {
  drafts.save(textarea.value);
});
```

```
Keystroke: H → schedule save... (timer starts)
Keystroke: e → cancel timer, schedule again...
Keystroke: l → cancel timer, schedule again...
...
Keystroke: d → cancel timer, schedule again...
(user stops typing)
(300ms of quiet...)
→ ONE save: "Hello World"
```

**Result:** 11 keystrokes, but only **1 storage write**.

---

## How Does It Work?

```
manager.save(data)
   ↓
1️⃣ Is the manager stopped? → Yes → do nothing
                             → No → continue
   ↓
2️⃣ Is there a pending timer? → Yes → cancel it
   ↓
3️⃣ Start a new timer (300ms by default)
   ↓
4️⃣ (waiting... if .save() is called again, go back to step 2)
   ↓
5️⃣ Timer fires → serialize data → write to storage
   ↓
6️⃣ Call onSave callback (if provided)
```

### Visual: Debouncing in Action

```
Time (ms): 0    50   100  150  200  250  300  350  400  450  500  550  600
           │    │    │    │    │    │    │    │    │    │    │    │    │
save("H")  ├────────────────────────────┐
           │    timer: 300ms...         │
save("He") │    ├────────────────────────┐ ← timer restarted
           │    │    timer: 300ms...     │
save("Hel")│    │    ├───────────────────┐ ← timer restarted
           │    │    │   timer: 300ms... │
           │    │    │                   │
           │    │    │         (no more saves)
           │    │    │                   ├── timer fires! → write "Hel"
```

---

## Basic Usage

### Create and Use a Manager

```javascript
// Create a manager for the key 'notes'
const notes = StorageUtils.createAutoSave('notes');

// Save data (debounced)
notes.save('My first note');

// Load data
const data = notes.load();
console.log(data);  // "My first note" (after the debounce period)
```

### Save with Custom Debounce Time

```javascript
// Wait 1 second (1000ms) instead of the default 300ms
const manager = StorageUtils.createAutoSave('draft', {
  debounce: 1000
});

manager.save('some data');
// Won't write to storage until 1000ms of quiet
```

### Save Immediately

Sometimes you need to save right now — for example, when the user is about to leave the page:

```javascript
const manager = StorageUtils.createAutoSave('formData');

// Normal debounced saves during typing
input.addEventListener('input', () => {
  manager.save(input.value);
});

// Save immediately before page unload
window.addEventListener('beforeunload', () => {
  manager.saveNow(input.value);
});
```

### Clear the Data

```javascript
const manager = StorageUtils.createAutoSave('draft');
manager.save('some draft text');

// Later, after the user submits the form
manager.clear();
// Cancels any pending save AND removes the data from storage
```

---

## Stop and Start

You can pause and resume auto-saving:

```javascript
const manager = StorageUtils.createAutoSave('data');

// Pause auto-saving
manager.stop();
console.log(manager.isStopped);  // true

manager.save('this will be ignored');  // ← does nothing while stopped

// Resume auto-saving
manager.start();
console.log(manager.isStopped);  // false

manager.save('this will be saved');  // ← works again
```

---

## Callbacks: onSave and onLoad

You can get notified when data is actually saved or loaded:

### onSave Callback

```javascript
const manager = StorageUtils.createAutoSave('draft', {
  onSave: (data) => {
    console.log('Draft saved!', data);
    showSaveIndicator();  // Show "Saved" badge in UI
  }
});

manager.save({ text: 'Hello' });
// After 300ms: "Draft saved!" { text: "Hello" }
```

### onLoad Callback

```javascript
const manager = StorageUtils.createAutoSave('settings', {
  onLoad: (data) => {
    console.log('Settings loaded:', data);
  }
});

const settings = manager.load({ theme: 'light' });
// Console: "Settings loaded: { theme: 'dark' }"
```

---

## Real-World Examples

### Example 1: Auto-Save Text Editor

```javascript
const editor = StorageUtils.createAutoSave('editorContent', {
  debounce: 500,
  onSave: () => {
    document.getElementById('status').textContent = 'Saved';
  }
});

// Load previous content on page load
const textarea = document.getElementById('editor');
textarea.value = editor.load('');

// Auto-save as user types
textarea.addEventListener('input', () => {
  document.getElementById('status').textContent = 'Saving...';
  editor.save(textarea.value);
});

// Save immediately on page close
window.addEventListener('beforeunload', () => {
  editor.saveNow(textarea.value);
});
```

### Example 2: Form Draft with Multiple Fields

```javascript
const formDraft = StorageUtils.createAutoSave('contactForm', {
  debounce: 400
});

// Collect all form fields
function getFormData() {
  return {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value
  };
}

// Auto-save on any field change
document.querySelectorAll('#contactForm input, #contactForm textarea')
  .forEach(field => {
    field.addEventListener('input', () => {
      formDraft.save(getFormData());
    });
  });

// Restore draft on page load
const draft = formDraft.load({ name: '', email: '', message: '' });
document.getElementById('name').value = draft.name;
document.getElementById('email').value = draft.email;
document.getElementById('message').value = draft.message;

// Clear draft after submission
document.getElementById('contactForm').addEventListener('submit', () => {
  formDraft.clear();
});
```

### Example 3: Game State Auto-Save

```javascript
const gameSave = StorageUtils.createAutoSave('gameState', {
  debounce: 2000,  // Save every 2 seconds of quiet
  namespace: 'myGame',
  onSave: (state) => {
    console.log(`Game saved! Score: ${state.score}`);
  }
});

// Save after game events
function onScoreChange(newScore) {
  gameSave.save({
    score: newScore,
    level: currentLevel,
    lives: playerLives
  });
}

// Load saved game
const savedGame = gameSave.load({ score: 0, level: 1, lives: 3 });
```

---

## .save() vs .saveNow() vs StorageUtils.save()

| Method | Debounced? | When It Writes |
|--------|-----------|---------------|
| `manager.save(data)` | ✅ Yes | After the debounce period of quiet |
| `manager.saveNow(data)` | ❌ No | Immediately |
| `StorageUtils.save(key, data)` | ❌ No | Immediately (separate API) |

```javascript
const manager = StorageUtils.createAutoSave('key');

manager.save('A');        // Waits 300ms before writing
manager.saveNow('B');     // Writes immediately, cancels pending 'A'
StorageUtils.save('key', 'C');  // Also writes immediately (different API)
```

---

## Common Patterns

### Check Before Loading

```javascript
const manager = StorageUtils.createAutoSave('draft');
const draft = manager.load(null);

if (draft) {
  const restore = confirm('You have an unsaved draft. Restore it?');
  if (restore) {
    applyDraft(draft);
  } else {
    manager.clear();
  }
}
```

### Disable During Submission

```javascript
const formSaver = StorageUtils.createAutoSave('form');

async function submitForm(data) {
  formSaver.stop();  // Pause auto-saving during submission

  try {
    await fetch('/api/submit', { method: 'POST', body: JSON.stringify(data) });
    formSaver.clear();  // Remove draft after successful submit
  } catch (error) {
    formSaver.start();  // Resume auto-saving if submission fails
  }
}
```

---

## Summary

| Aspect | Detail |
|--------|--------|
| **What** | Creates a manager that auto-saves data with debouncing |
| **Returns** | An object with `.save()`, `.saveNow()`, `.load()`, `.clear()`, `.stop()`, `.start()` |
| **Default debounce** | 300ms — waits 300ms of quiet before writing |
| **When to use** | Text editors, form drafts, game state — anywhere data changes rapidly |
| **Key benefit** | Prevents hundreds of unnecessary storage writes during rapid changes |
| **Callbacks** | `onSave` and `onLoad` for UI feedback |

> **Simple Rule to Remember:** `createAutoSave` is for data that changes frequently. It collects rapid changes and writes once, after things quiet down. Use `.save()` during rapid updates and `.saveNow()` when you need to write immediately (like before page close).