# Understanding `bindings()` - A Beginner's Guide

## Quick Start (30 seconds)

Want to sync reactive state to DOM automatically? Here's how:

```js
// Create reactive state
const user = state({
  name: 'John Doe',
  email: 'john@example.com'
});

// Define DOM bindings declaratively
const cleanup = bindings({
  '#userName': () => user.name,
  '#userEmail': () => user.email
});

// Just change the state - DOM updates automatically!
user.name = 'Jane Smith'; // #userName updates to "Jane Smith"
```

**That's it!** The `bindings()` function creates declarative DOM bindings - you define once what goes where, and the DOM stays in sync with your state automatically!

---

## What is `bindings()`?

`bindings()` is a **standalone utility function** in the Reactive library that creates reactive DOM bindings from a definitions object. It automatically sets up effects that update DOM elements whenever reactive state changes, without needing to pass a state object.

Think of it as **declarative DOM synchronization** - you define which elements should display which values, and it automatically keeps the DOM in sync with your reactive state.

---

## Syntax

```js
// Using the shortcut
const cleanup = bindings(definitions)

// Using the full namespace
const cleanup = ReactiveUtils.bindings(definitions)
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`bindings()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.bindings()`) - Explicit and clear

**Parameters:**
- `definitions` (Object): An object where:
  - **Keys** are CSS selectors (ID, class, tag, attribute, or complex selectors)
  - **Values** are either:
    - A function that returns the value to display
    - An object mapping element properties to functions

**Returns:**
- A cleanup function that stops all the bindings when called

---

## Why Does This Exist?

### The Problem with Manual DOM Updates

When you want to bind state to DOM elements, you need to write effects manually:

```javascript
// Manual approach - verbose and repetitive
const user = state({
  name: 'John Doe',
  email: 'john@example.com',
  status: 'online'
});

// Create separate effects for each element
effect(() => {
  document.getElementById('userName').textContent = user.name;
});

effect(() => {
  document.getElementById('userEmail').textContent = user.email;
});

effect(() => {
  const statusEl = document.getElementById('userStatus');
  statusEl.textContent = user.status;
  statusEl.className = user.status;
});

// Too much boilerplate for simple DOM bindings!
```

**What's the Real Issue?**

```
Manual Effect-Based Binding:
┌──────────────────────┐
│ effect(() => {       │
│   get element        │
│   update content     │
│ })                   │
└──────────────────────┘
┌──────────────────────┐
│ effect(() => {       │
│   get element        │
│   update content     │
│ })                   │
└──────────────────────┘
┌──────────────────────┐
│ effect(() => {       │
│   get element        │
│   update content     │
│ })                   │
└──────────────────────┘

Repetitive!
Scattered code!
Hard to overview!
```

**Problems:**
- Must write separate `effect()` for each binding
- Must manually query DOM elements
- Repetitive `document.getElementById()` or `querySelector()` calls
- Hard to see all bindings at once
- More verbose than necessary
- No declarative structure

**Why This Becomes a Problem:**

For DOM synchronization:

❌ Too much boilerplate
❌ Repetitive element queries
❌ No clear binding definition
❌ Hard to maintain
❌ Scattered across code

In other words, **binding state to DOM requires too much manual work**. There should be a declarative way to define DOM bindings.

### The Solution with `bindings()`

When you use `bindings()`, you define all DOM bindings declaratively:

```javascript
// Clean approach - declarative and organized
const user = state({
  name: 'John Doe',
  email: 'john@example.com',
  status: 'online'
});

const cleanup = bindings({
  '#userName': () => user.name,

  '#userEmail': () => user.email,

  '#userStatus': () => user.status,

  '.status-indicator': {
    textContent: () => user.status,
    className: () => user.status
  }
});

// Clean, declarative, and automatic!
// DOM updates automatically when user changes
```

**What Just Happened?**

```
bindings() Approach:
┌──────────────────────┐
│ Define all bindings  │
│ in ONE object:       │
│                      │
│ {                    │
│   '#el1': fn,        │
│   '#el2': fn,        │ ✓ Clear!
│   '#el3': fn         │ ✓ Organized!
│ }                    │ ✓ Declarative!
└──────────────────────┘

All bindings visible!
Effects created automatically!
Clean and maintainable!
```

With `bindings()`:
- All bindings defined in one object
- CSS selectors as keys
- Functions return reactive values
- Automatic DOM updates
- Single cleanup function

**Benefits:**
- ✅ Declarative syntax
- ✅ Clear structure
- ✅ Automatic reactivity
- ✅ Less boilerplate
- ✅ Easier to maintain

---

## Mental Model

Think of `bindings()` like a **smart TV guide with auto-sync**:

```
Manual Effects (Old TV):
┌────────────────────────┐
│  Channel 1 Guide       │
│  → Manually check      │
│  → Write what's on     │
│                        │
│  Channel 2 Guide       │
│  → Manually check      │
│  → Write what's on     │
│                        │
│  Channel 3 Guide       │
│  → Manually check      │
│  → Write what's on     │
└────────────────────────┘

Manual, repetitive,
easy to miss updates


bindings() (Smart Guide):
┌────────────────────────┐
│  📺 Auto-Sync Guide    │
│                        │
│  Channel 1: [Auto]     │
│  Channel 2: [Auto]     │
│  Channel 3: [Auto]     │
│                        │
│  Define once:          │
│  {                     │
│    ch1: → source,      │
│    ch2: → source,      │
│    ch3: → source       │
│  }                     │
│                        │
│  Guide updates         │
│  automatically!        │
└────────────────────────┘

Automatic, clean,
always in sync
```

**Key Insight:** Just like a smart TV guide automatically displays current programming from the source, `bindings()` automatically updates DOM elements from your reactive state - you define the connections once, and everything stays in sync.

---

## How Does It Work?

### Under the Hood

`bindings()` creates effects that update DOM elements:

```
bindings(definitions)
        ↓
┌──────────────────────────┐
│ For each selector:       │
│                          │
│ 1. Find DOM elements     │
│    matching selector     │
│                          │
│ 2. For each element,     │
│    create effect         │
│                          │
│ 3. Effect calls function │
│    and applies value     │
│                          │
│ 4. Store cleanup         │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Return single cleanup    │
│ function for all         │
│ bindings                 │
└──────────────────────────┘
```

**What happens:**

1. Takes a definitions object
2. For each key (selector), finds matching DOM elements:
   - ID selector (#id) → `getElementById`
   - Class selector (.class) → `getElementsByClassName`
   - Other → `querySelectorAll`
3. For each element, creates an effect
4. Effect runs the function and applies the value
5. Handles different value types (string, number, object, array)
6. Returns cleanup function to stop all effects

---

## Basic Usage

### Simple Property Binding

The simplest way to use `bindings()`:

```js
// Using the shortcut style
const app = state({
  title: 'My App',
  count: 0
});

const cleanup = bindings({
  '#appTitle': () => app.title,
  '#counter': () => app.count
});

// Or using the namespace style
const cleanup = ReactiveUtils.bindings({
  '#appTitle': () => app.title
});

app.title = 'New Title'; // #appTitle updates automatically
app.count = 5;           // #counter updates automatically

// Stop bindings
cleanup();
```

### Class Selector (Multiple Elements)

Bind to all elements with a class:

```js
const app = state({
  userName: 'John Doe',
  lastUpdate: new Date()
});

bindings({
  // Binds to ALL elements with class 'user-name'
  '.user-name': () => app.userName,

  // Binds to ALL elements with class 'timestamp'
  '.timestamp': () => app.lastUpdate.toLocaleString()
});

// All .user-name elements update when userName changes
app.userName = 'Jane Smith';
```

### Complex Selectors

Use any valid CSS selector:

```js
const data = state({
  message: 'Hello',
  count: 42
});

bindings({
  // ID selector
  '#message': () => data.message,

  // Tag selector
  'h1': () => data.message,

  // Attribute selector
  '[data-role="status"]': () => data.count,

  // Complex selector
  'div.container > p.message': () => data.message,

  // Multiple selectors (comma-separated)
  '.primary-heading, .secondary-heading': () => `${data.message} (${data.count})`
});
```

### Property-Specific Bindings

Bind to specific element properties:

```js
const form = state({
  username: '',
  isValid: false,
  isSubmitting: false
});

bindings({
  '#username': {
    value: () => form.username,
    className: () => form.isValid ? 'valid' : 'invalid'
  },

  '#submitBtn': {
    disabled: () => !form.isValid || form.isSubmitting,
    textContent: () => form.isSubmitting ? 'Submitting...' : 'Submit'
  }
});
```

### Style Bindings

Bind to element styles:

```js
const ui = state({
  sidebarOpen: true,
  theme: 'light',
  progress: 0
});

bindings({
  '#sidebar': {
    style: () => ({
      display: ui.sidebarOpen ? 'block' : 'none',
      backgroundColor: ui.theme === 'dark' ? '#333' : '#fff'
    })
  },

  '#progressBar': {
    style: () => ({
      width: `${ui.progress}%`,
      backgroundColor: ui.progress === 100 ? 'green' : 'blue'
    })
  }
});
```

---

## Summary

**`bindings()` creates declarative reactive DOM bindings.**

Key takeaways:

✅ **Declarative DOM binding** - define all bindings in one object
✅ Both **shortcut** (`bindings()`) and **namespace** (`ReactiveUtils.bindings()`) styles are valid
✅ Supports **any CSS selector** (ID, class, tag, attribute, complex)
✅ **Function values** return reactive content
✅ **Object values** map properties to functions
✅ Returns **cleanup function** to stop all bindings
✅ Automatically **updates DOM** when state changes
✅ Handles **textContent**, **className**, **style**, **attributes**, and more
✅ Works with any reactive state (**state**, **ref**, **collection**, etc.)

**Mental Model:** Think of `bindings()` as a **smart TV guide with auto-sync** - you define once which channels (selectors) display which content (reactive values), and the guide (DOM) automatically stays in sync with the programming (state).

**Remember:** `bindings()` is perfect for declarative DOM synchronization. Define all your UI bindings in one place and let the library handle automatic updates!
