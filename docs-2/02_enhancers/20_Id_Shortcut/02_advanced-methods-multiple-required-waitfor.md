[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Id.multiple(), Id.required(), and Id.waitFor()

## Quick Start (30 seconds)

```javascript
// Get multiple elements at once
const { header, footer, sidebar } = Id.multiple('header', 'footer', 'sidebar');

// Get elements that MUST exist (throws if missing)
const { username, password } = Id.required('username', 'password');

// Wait for a dynamically loaded element
const modal = await Id.waitFor('modal', 3000);
modal.update({ style: { display: 'block' } });
```

---

## Id.multiple() — Get Several Elements at Once

### What Does It Do?

`Id.multiple()` takes any number of element IDs and returns them all in a single object. Instead of calling `Id()` separately for each element, you get them all at once and can use **destructuring** to assign them to variables.

### Syntax

```javascript
const result = Id.multiple('id1', 'id2', 'id3');
// result = { id1: element, id2: element, id3: element }
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `...ids` | `string[]` | Any number of element IDs |

**Returns:** An object where keys are the IDs and values are the elements (or `null` if not found).

---

### Basic Usage

```javascript
// Get three elements at once
const elements = Id.multiple('header', 'footer', 'sidebar');

// Access them from the object
elements.header.update({ textContent: 'Welcome' });
elements.footer.update({ textContent: 'Copyright 2024' });
```

### With Destructuring

The real power comes with JavaScript destructuring — pulling out named variables directly:

```javascript
const { header, footer, sidebar } = Id.multiple('header', 'footer', 'sidebar');

// Now use them directly as variables
header.update({ textContent: 'Welcome' });
footer.update({ textContent: 'Copyright 2024' });
sidebar.update({ classList: { add: ['open'] } });
```

**What's happening here?**

```
Id.multiple('header', 'footer', 'sidebar')
   ↓
Returns: { header: <element>, footer: <element>, sidebar: <element> }
   ↓
Destructuring pulls each value into a variable:
   header  ← the <element> for id="header"
   footer  ← the <element> for id="footer"
   sidebar ← the <element> for id="sidebar"
```

### Handling Missing Elements

If an ID doesn't exist in the DOM, its value is `null`:

```javascript
const { header, nonExistent } = Id.multiple('header', 'nonExistent');

console.log(header);       // <div id="header">...</div>
console.log(nonExistent);  // null

// Always check before using
if (nonExistent) {
  nonExistent.update({ textContent: 'Found!' });
}
```

### Real-World Example: Form Setup

```javascript
// Get all form elements in one call
const { nameInput, emailInput, submitBtn, resetBtn } =
  Id.multiple('nameInput', 'emailInput', 'submitBtn', 'resetBtn');

// Set up each one
if (nameInput) nameInput.update({ placeholder: 'Enter your name' });
if (emailInput) emailInput.update({ placeholder: 'Enter your email' });
if (submitBtn) submitBtn.update({ textContent: 'Submit' });
if (resetBtn) resetBtn.update({ textContent: 'Reset' });
```

---

### How It Works Under the Hood

```
Id.multiple('header', 'footer', 'sidebar')
   ↓
1️⃣ Check: Does Elements.destructure() exist?
   ├── Yes → Use Elements.destructure('header', 'footer', 'sidebar')
   └── No → Fallback: call Id() for each ID
   ↓
2️⃣ Build result object:
   {
     header:  Id('header'),   // element or null
     footer:  Id('footer'),   // element or null
     sidebar: Id('sidebar')   // element or null
   }
   ↓
3️⃣ Return the object
```

The module prefers the core `Elements.destructure()` method when available, which may have optimizations. If that's not available, it falls back to calling `Id()` individually for each ID.

---

## Id.required() — Elements That Must Exist

### What Does It Do?

`Id.required()` works like `Id.multiple()` — but with one critical difference: if **any** of the requested elements is missing from the DOM, it **throws an error**.

This is designed for **critical elements** that your page absolutely needs. If they're missing, something is seriously wrong, and you want to know immediately.

### Syntax

```javascript
const result = Id.required('id1', 'id2', 'id3');
// Throws Error if any element is missing!
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `...ids` | `string[]` | Element IDs that **must** exist |

**Returns:** An object with IDs as keys and elements as values — guaranteed to all exist.

**Throws:** `Error` if any element is not found.

---

### Basic Usage

```javascript
try {
  const { header, mainContent } = Id.required('header', 'mainContent');

  // Safe to use — both are guaranteed to exist
  header.update({ textContent: 'Welcome' });
  mainContent.update({ classList: { add: ['loaded'] } });

} catch (error) {
  console.error(error.message);
  // "Required elements not found: header, mainContent"
}
```

### Why Use required() Instead of multiple()?

Compare the two approaches:

```javascript
// With Id.multiple() — you must check each one manually
const { header, footer } = Id.multiple('header', 'footer');

if (!header) console.error('Header missing!');
if (!footer) console.error('Footer missing!');
if (!header || !footer) return;  // Can't continue

// With Id.required() — missing elements throw automatically
try {
  const { header, footer } = Id.required('header', 'footer');
  // If we reach here, BOTH exist — guaranteed
} catch (error) {
  // One or more are missing
  console.error(error.message);
}
```

**When to use which:**

| Method | Use When |
|--------|----------|
| `Id.multiple()` | Elements are **optional** — your code can handle missing ones |
| `Id.required()` | Elements are **critical** — your code cannot function without them |

### Real-World Example: App Initialization

```javascript
function initializeApp() {
  try {
    // These elements are essential for the app to work
    const { appContainer, navBar, contentArea } =
      Id.required('appContainer', 'navBar', 'contentArea');

    // Set up the app
    navBar.update({
      classList: { add: ['initialized'] }
    });

    contentArea.update({
      textContent: 'App loaded successfully!'
    });

  } catch (error) {
    // Show a clear error if critical elements are missing
    document.body.innerHTML = `
      <h1>Application Error</h1>
      <p>${error.message}</p>
    `;
  }
}
```

---

### How It Works Under the Hood

```
Id.required('header', 'footer')
   ↓
1️⃣ Check: Does Elements.getRequired() exist?
   ├── Yes → Use Elements.getRequired('header', 'footer')
   └── No → Fallback below
   ↓
2️⃣ Call Id.multiple('header', 'footer')
   → { header: <element>, footer: null }
   ↓
3️⃣ Check for missing elements:
   → ids.filter(id => !elements[id])
   → ['footer']  ← footer is null!
   ↓
4️⃣ Missing found?
   ├── Yes → throw new Error("Required elements not found: footer")
   └── No → return the elements object
```

---

## Id.waitFor() — Wait for Dynamic Elements

### What Does It Do?

`Id.waitFor()` waits for an element to **appear in the DOM**. This is useful when elements are loaded dynamically — by JavaScript frameworks, AJAX calls, or lazy loading. Instead of writing your own polling loop, `Id.waitFor()` handles it for you.

It returns a **Promise** that resolves with the element once it appears, or rejects if the timeout expires.

### Syntax

```javascript
// With async/await
const element = await Id.waitFor('elementId', timeout);

// With .then()/.catch()
Id.waitFor('elementId', timeout)
  .then(element => { /* element found */ })
  .catch(error => { /* timeout expired */ });
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `id` | `string` | — | Element ID to wait for |
| `timeout` | `number` | `5000` | Max wait time in milliseconds |

**Returns:** `Promise<HTMLElement>` — resolves with the enhanced element.

**Throws:** `Error` if timeout expires before element appears.

---

### Basic Usage with async/await

```javascript
async function setupModal() {
  try {
    // Wait up to 5 seconds (default) for the modal to appear
    const modal = await Id.waitFor('modal');

    modal.update({
      style: { display: 'block' },
      classList: { add: ['fade-in'] }
    });

  } catch (error) {
    console.error('Modal never appeared:', error.message);
  }
}
```

### With Custom Timeout

```javascript
async function loadWidget() {
  try {
    // Wait up to 10 seconds
    const widget = await Id.waitFor('dynamicWidget', 10000);
    widget.update({ classList: { add: ['loaded'] } });

  } catch (error) {
    // Timeout: "Timeout waiting for element with ID: dynamicWidget"
    console.error(error.message);
  }
}
```

### Using .then()/.catch()

```javascript
// Promise-based usage
Id.waitFor('dynamicButton', 3000)
  .then(button => {
    button.update({ textContent: 'Loaded!' });
  })
  .catch(error => {
    console.error('Button never appeared');
  });
```

### Real-World Example: Single-Page App Navigation

```javascript
async function navigateToProfile() {
  // The framework renders the profile section dynamically
  loadProfileView();

  try {
    // Wait for the profile container to be rendered
    const profileContainer = await Id.waitFor('profileContainer', 3000);

    profileContainer.update({
      classList: { add: ['active'] }
    });

    // Wait for the avatar to load too
    const avatar = await Id.waitFor('userAvatar', 2000);
    avatar.update({
      style: { border: '3px solid green' }
    });

  } catch (error) {
    console.error('Profile page failed to load:', error.message);
  }
}
```

---

### How It Works Under the Hood

```
Id.waitFor('modal', 5000)
   ↓
1️⃣ Check: Does Elements.waitFor() exist?
   ├── Yes → Use Elements.waitFor('modal') → return result['modal']
   └── No → Fallback polling below
   ↓
2️⃣ Start polling loop (every 100ms):
   ├── Check: Id('modal') returns element?
   │   ├── Yes → Resolve Promise with element ✅
   │   └── No → Wait 100ms, check again
   └── Check: Time elapsed > 5000ms?
       └── Yes → Reject with Error: "Timeout waiting for element with ID: modal" ❌
```

```
Timeline:
0ms     → Check → not found
100ms   → Check → not found
200ms   → Check → not found
...
1200ms  → Check → FOUND! → resolve(element) ✅

Or:

0ms     → Check → not found
100ms   → Check → not found
...
5000ms  → TIMEOUT → reject(Error) ❌
```

---

## Comparison: multiple vs required vs waitFor

| Method | Missing Elements | Returns | Use Case |
|--------|-----------------|---------|----------|
| `Id.multiple()` | Returns `null` for each | Object (sync) | Optional elements |
| `Id.required()` | Throws Error | Object (sync) | Critical elements |
| `Id.waitFor()` | Waits, then rejects | Promise (async) | Dynamic elements |

```javascript
// Optional — some may not exist, and that's OK
const { sidebar } = Id.multiple('sidebar');
if (sidebar) { /* use it */ }

// Required — must exist, fail loudly if not
const { header } = Id.required('header');
// header is guaranteed here

// Dynamic — doesn't exist yet, but will appear
const modal = await Id.waitFor('modal');
// modal appeared and is ready
```

---

## Summary

| Method | What It Does |
|--------|-------------|
| `Id.multiple(...ids)` | Get multiple elements as an object — missing ones are `null` |
| `Id.required(...ids)` | Get multiple elements — **throws** if any are missing |
| `Id.waitFor(id, timeout)` | Wait for an element to appear — returns a **Promise** |

> **Simple Rule to Remember:** Use `multiple()` for optional elements, `required()` for critical elements, and `waitFor()` for elements that haven't loaded yet.