[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Id Utility Methods and Bulk Operations

## Quick Start (30 seconds)

```javascript
// Check if an element exists
if (Id.exists('sidebar')) {
  Id('sidebar').update({ classList: { add: ['visible'] } });
}

// Get element with a fallback
const container = Id.get('mainContainer', document.body);

// Update multiple elements by ID in one call
Id.update({
  header: { textContent: 'Welcome', style: { color: 'blue' } },
  footer: { textContent: 'Copyright 2024' },
  sidebar: { classList: { add: ['active'] } }
});
```

---

## Id.exists() — Check If an Element Exists

### What Does It Do?

`Id.exists()` returns `true` or `false` — a simple check to see if an element with the given ID exists in the DOM. It doesn't return the element itself, just tells you whether it's there.

### Syntax

```javascript
const found = Id.exists('elementId');  // true or false
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Element ID to check |

**Returns:** `boolean` — `true` if the element exists, `false` otherwise.

---

### Basic Usage

```javascript
// Simple existence check
if (Id.exists('sidebar')) {
  Id('sidebar').update({ classList: { add: ['visible'] } });
}

// Conditional feature setup
if (Id.exists('darkModeToggle')) {
  // Only set up dark mode if the toggle button exists
  Id('darkModeToggle').update({
    onclick: () => document.body.classList.toggle('dark')
  });
}
```

### Real-World Example: Optional Features

```javascript
// Set up features only if their containers exist
function setupOptionalFeatures() {
  if (Id.exists('chatWidget')) {
    Id('chatWidget').update({ style: { display: 'block' } });
  }

  if (Id.exists('notificationBell')) {
    Id('notificationBell').update({
      dataset: { count: '3' }
    });
  }

  if (Id.exists('searchBar')) {
    Id('searchBar').update({
      placeholder: 'Search...',
      classList: { add: ['initialized'] }
    });
  }
}
```

### How It Works

```
Id.exists('sidebar')
   ↓
1️⃣ Check: Does Elements.exists() exist?
   ├── Yes → return Elements.exists('sidebar')
   └── No → Fallback: return !!Id('sidebar')
   ↓
2️⃣ Returns true or false
```

---

## Id.get() — Element with a Fallback

### What Does It Do?

`Id.get()` retrieves an element by ID, but if the element doesn't exist, it returns a **fallback value** instead of `null`. This is useful when you need to guarantee you always have *something* to work with.

### Syntax

```javascript
const element = Id.get('elementId', fallbackValue);
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `id` | `string` | — | Element ID to retrieve |
| `fallback` | `any` | `null` | Value to return if element not found |

**Returns:** The element if found, or the fallback value.

---

### Basic Usage

```javascript
// Get element, or fall back to document.body
const container = Id.get('appContainer', document.body);

// Get element, or fall back to a new element
const button = Id.get('submitBtn', document.createElement('button'));

// Get element, or fall back to a specific existing element
const target = Id.get('output', Id('fallbackOutput'));
```

### Real-World Example: Safe Container Access

```javascript
// Always have a container to append to
function renderContent(html) {
  const container = Id.get('contentArea', document.body);
  container.innerHTML = html;
}

// Works whether 'contentArea' exists or not!
renderContent('<h1>Hello</h1>');
```

### How It Works

```
Id.get('sidebar', document.body)
   ↓
1️⃣ Check: Does Elements.get() exist?
   ├── Yes → return Elements.get('sidebar', document.body)
   └── No → Fallback: return Id('sidebar') || document.body
   ↓
2️⃣ Element found?
   ├── Yes → return the element
   └── No → return document.body (the fallback)
```

---

## Id.update() — Bulk Update Multiple Elements

### What Does It Do?

`Id.update()` lets you update **multiple elements by ID** in a single call. You pass an object where each key is an element ID and each value is an update object (the same format you'd pass to `.update()` on a single element).

This is the most powerful convenience method in the Id Shortcut module.

### Syntax

```javascript
Id.update({
  elementId1: { /* update object */ },
  elementId2: { /* update object */ },
  elementId3: { /* update object */ }
});
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `updates` | `object` | Keys are element IDs, values are update objects |

**Returns:** A results object showing success/failure for each ID.

---

### Basic Usage

```javascript
// Update three elements at once
Id.update({
  header: { textContent: 'Welcome to My App' },
  footer: { textContent: '© 2024 My App' },
  sidebar: { classList: { add: ['visible'] } }
});
```

### What's Happening Step by Step

```
Id.update({
  header:  { textContent: 'Welcome' },
  footer:  { textContent: '© 2024' },
  sidebar: { classList: { add: ['visible'] } }
})
   ↓
1️⃣ For each key-value pair:
   ├── 'header'  → Id('header')  → element.update({ textContent: 'Welcome' })
   ├── 'footer'  → Id('footer')  → element.update({ textContent: '© 2024' })
   └── 'sidebar' → Id('sidebar') → element.update({ classList: { add: ['visible'] } })
   ↓
2️⃣ Return results:
   {
     header:  { success: true },
     footer:  { success: true },
     sidebar: { success: true }
   }
```

### Using the Results Object

```javascript
const results = Id.update({
  header: { textContent: 'Title' },
  missing: { textContent: 'This element does not exist' },
  footer: { textContent: 'Footer' }
});

console.log(results.header);   // { success: true }
console.log(results.missing);  // { success: false, error: 'Element not found or no update method' }
console.log(results.footer);   // { success: true }
```

### Rich Update Objects

Each element can receive any update that `.update()` supports:

```javascript
Id.update({
  pageTitle: {
    textContent: 'Dashboard',
    style: { fontSize: '28px', fontWeight: 'bold', color: '#333' }
  },

  navBar: {
    classList: { add: ['sticky', 'shadow'] },
    style: { backgroundColor: '#fff' }
  },

  userAvatar: {
    setAttribute: { src: 'avatar.png', alt: 'User' },
    style: { borderRadius: '50%', width: '40px' }
  },

  loginBtn: {
    textContent: 'Logout',
    style: { backgroundColor: 'red', color: 'white' },
    classList: { remove: ['btn-login'], add: ['btn-logout'] }
  }
});
```

---

### Real-World Examples

#### Example 1: Page Initialization

```javascript
// Set up the entire page layout in one call
function initializePage(user) {
  Id.update({
    welcomeMessage: {
      textContent: `Hello, ${user.name}!`,
      style: { color: 'green' }
    },
    userEmail: {
      textContent: user.email
    },
    loginStatus: {
      textContent: 'Online',
      classList: { add: ['status-online'] }
    }
  });
}
```

#### Example 2: Theme Switching

```javascript
function applyDarkTheme() {
  Id.update({
    navBar: {
      style: { backgroundColor: '#1a1a2e', color: '#eee' }
    },
    mainContent: {
      style: { backgroundColor: '#16213e', color: '#ddd' }
    },
    footer: {
      style: { backgroundColor: '#0f3460', color: '#ccc' }
    }
  });
}
```

#### Example 3: Form Reset

```javascript
function resetForm() {
  Id.update({
    nameInput: { value: '', placeholder: 'Enter name' },
    emailInput: { value: '', placeholder: 'Enter email' },
    phoneInput: { value: '', placeholder: 'Enter phone' },
    submitBtn: { textContent: 'Submit', disabled: false }
  });
}
```

---

### How Id.update() Works Under the Hood

```
Id.update(updates)
   ↓
1️⃣ Check: Does Elements.update() exist?
   ├── Yes → Use Elements.update(updates) directly
   └── No → Fallback implementation below
   ↓
2️⃣ For each entry in updates:
   ├── Get element: Id(id)
   ├── Element found AND has .update()?
   │   ├── Yes → element.update(updateData) → result: { success: true }
   │   └── No → result: { success: false, error: '...' }
   ↓
3️⃣ Return results object
```

---

## Comparing the Approaches

### Without Id.update() — Individual Calls

```javascript
// Six separate calls
Id('header').update({ textContent: 'Title' });
Id('subtitle').update({ textContent: 'Welcome' });
Id('navBar').update({ classList: { add: ['active'] } });
Id('sidebar').update({ style: { display: 'block' } });
Id('footer').update({ textContent: '© 2024' });
Id('statusBar').update({ textContent: 'Ready' });
```

### With Id.update() — One Call

```javascript
// One call, all elements
Id.update({
  header: { textContent: 'Title' },
  subtitle: { textContent: 'Welcome' },
  navBar: { classList: { add: ['active'] } },
  sidebar: { style: { display: 'block' } },
  footer: { textContent: '© 2024' },
  statusBar: { textContent: 'Ready' }
});
```

Both achieve the same result. `Id.update()` groups related updates together, making the code easier to read and maintain.

---

## Summary

| Method | What It Does | Returns |
|--------|-------------|---------|
| `Id.exists(id)` | Check if element exists | `true` / `false` |
| `Id.get(id, fallback)` | Get element with a fallback value | Element or fallback |
| `Id.update(updates)` | Bulk update multiple elements by ID | Results object |

> **Simple Rule to Remember:** Use `exists()` to check, `get()` to retrieve safely with a backup, and `update()` to change multiple elements in one clean call.