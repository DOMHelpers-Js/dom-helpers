[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Elements.update()

`Elements.update()` lets you update **multiple DOM elements by their IDs** in a single, clean, declarative call. Instead of reaching for each element one at a time, you describe the desired state of every named element together — and the library handles all the updates at once.

---

## Quick Start (30 Seconds)

```javascript
// Update multiple elements by ID — one call, complete transformation
Elements.update({
  pageTitle:  { textContent: 'Welcome back, Sarah!' },
  statusBadge:{ textContent: 'Online', style: { color: '#16a34a' } },
  submitBtn:  { disabled: false, textContent: 'Get Started' },
  errorMsg:   { style: { display: 'none' } }
});
```

Four elements updated, zero repetition, one glance to understand the full state change.

---

## What Is `Elements.update()`?

Simply put, `Elements.update()` is the **bulk ID-based updater**. You give it an object where each key is an element's `id` attribute and each value is an update object describing what to change on that element.

It's the bridge between your application state and your named DOM elements — the specific, meaningful parts of your page that have IDs.

---

## Syntax

```javascript
// Basic form
Elements.update({
  elementId: { /* update object */ },
  anotherId:  { /* update object */ }
});

// Capture the results object
const results = Elements.update({
  elementId: { /* update object */ }
});
// results.elementId.success  — was the element found and updated?
// results.elementId.element  — the actual HTMLElement reference
// results.elementId.error    — error message if not found
```

---

## Why Does This Exist?

### When Individual Element Updates Are Your Starting Point

When you know exactly which elements you need to change — `#emailInput`, `#loginBtn`, `#errorMsg` — vanilla JavaScript has you writing:

```javascript
const emailInput = document.getElementById('emailInput');
emailInput.disabled = false;

const passwordInput = document.getElementById('passwordInput');
passwordInput.disabled = false;

const loginBtn = document.getElementById('loginBtn');
loginBtn.disabled = false;
loginBtn.textContent = 'Sign In';

const errorMsg = document.getElementById('errorMsg');
errorMsg.textContent = '';
errorMsg.style.display = 'none';
```

That's 8 statements for one conceptual action: "enable the login form." It works perfectly well. But there's a structural limitation: **the updates are scattered**. Nothing in the code communicates "these 8 lines are a single, cohesive action."

### When a Unified Named-Element Update Is Your Goal

`Elements.update()` is designed for exactly this scenario — when you know the specific IDs and want to express all the changes as one cohesive unit:

```javascript
Elements.update({
  emailInput:    { disabled: false },
  passwordInput: { disabled: false },
  loginBtn:      { disabled: false, textContent: 'Sign In' },
  errorMsg:      { textContent: '', style: { display: 'none' } }
});
```

**This is especially useful when:**
✅ You're managing UI state transitions (loading → error → success → ready)
✅ You're initializing a page or component with data from an API
✅ You're updating 2+ specific named elements as part of one action
✅ You want the code to read as "here's what the UI looks like in this state"
✅ You need to verify which specific elements were found and updated

**The Choice Is Yours:**
- Use `Elements.elementId.update({})` for updating a single element directly
- Use **`Elements.update({})`** when updating 2+ specific named elements together
- Use `Collections.update({})` when updating groups of similar elements by class/tag
- Use `Selector.update({})` when you need complex CSS selector targeting

**Benefits of `Elements.update()`:**
✅ All related named-element changes described in one place
✅ Self-documenting — the object reads like a UI state declaration
✅ Results object tells you exactly what was found and what wasn't
✅ No repeated `getElementById` calls
✅ Change detection automatically skips DOM writes when values haven't changed

---

## Mental Model: The Update Manifest

Think of `Elements.update()` like a **manifest** you hand to the library — a complete list of specific named items and what to do with each one:

```
┌──────────────────────────────────────────────┐
│  UPDATE MANIFEST                             │
│                                              │
│  ▸ emailInput    → enable it                 │
│  ▸ passwordInput → enable it                 │
│  ▸ loginBtn      → enable + text "Sign In"   │
│  ▸ errorMsg      → clear + hide              │
└──────────────────────────────────────────────┘
         │
         ▼
  Library processes each entry
         │
         ▼
┌──────────────────────────────────────────────┐
│  RECEIPT                                     │
│  ▸ emailInput    → success: true  ✅         │
│  ▸ passwordInput → success: true  ✅         │
│  ▸ loginBtn      → success: true  ✅         │
│  ▸ errorMsg      → success: false ❌ (missing)│
└──────────────────────────────────────────────┘
```

Each named entry gets its own instructions. You get back a receipt showing what was processed and whether each element was found.

---

## How Does It Work?

### Internal Flow

```
Elements.update({ header: {...}, footer: {...} })
         │
         ▼
┌────────────────────────────────────────────────────┐
│  For each key in the object:                       │
│    1. Key = element ID (e.g., "header")            │
│    2. Look up: document.getElementById("header")   │
│    3. Found → apply update object                  │
│       (with change detection, all property types)  │
│    4. Record: { success: true, element: el }       │
│    5. Not found → record:                          │
│       { success: false, error: 'Not found: header'}│
└────────────────────────────────────────────────────┘
         │
         ▼
Return results object:
{
  header: { success: true, element: HTMLElement },
  footer: { success: false, error: 'Not found: footer' }
}
```

Each ID is resolved independently. Found elements have their full update applied with change detection. Missing elements are recorded as failures — they never crash your app.

---

## Basic Usage

### Step 1: Identify Your Elements by ID

Ensure the target elements have `id` attributes in your HTML:

```html
<h1 id="pageTitle">Loading...</h1>
<p id="pageSubtitle">Please wait...</p>
<button id="actionBtn" disabled>...</button>
<div id="errorBanner" style="display: none;"></div>
```

### Step 2: Describe the Desired State

```javascript
Elements.update({
  pageTitle: {
    textContent: 'Dashboard'
  },
  pageSubtitle: {
    textContent: 'Your data is ready'
  },
  actionBtn: {
    textContent: 'View Reports',
    disabled: false
  },
  errorBanner: {
    style: { display: 'none' }
  }
});
```

### Step 3: Capture and Check Results for Critical Elements

```javascript
const results = Elements.update({
  pageTitle:   { textContent: 'Dashboard' },
  actionBtn:   { disabled: false },
  errorBanner: { style: { display: 'none' } }
});

// Check elements that must exist for the feature to work
if (!results.actionBtn.success) {
  console.error('Action button not found — check your HTML');
}

// Use the element reference for follow-up operations
if (results.pageTitle.success) {
  results.pageTitle.element.scrollIntoView({ behavior: 'smooth' });
}
```

---

## What You Can Update

Every update object supports the full set of property categories:

```javascript
Elements.update({
  myElement: {
    // Text content
    textContent: 'Safe plain text',
    innerHTML: '<strong>Trusted HTML</strong>',

    // Basic DOM properties
    disabled: false,
    value: 'input value',
    checked: true,
    placeholder: 'Enter text...',

    // Styles (always camelCase)
    style: {
      color: '#1f2937',
      backgroundColor: '#f9fafb',
      fontSize: '16px',
      display: 'block'
    },

    // Class management
    classList: {
      add: ['active', 'visible'],
      remove: 'hidden',
      toggle: 'selected'
    },

    // HTML attributes
    setAttribute: {
      'aria-label': 'Submit the form',
      'aria-hidden': 'false',
      'role': 'button'
    },

    // Data attributes (camelCase → data-kebab-case)
    dataset: {
      userId: '42',      // Sets data-user-id="42"
      section: 'header'  // Sets data-section="header"
    },

    // Events
    addEventListener: ['click', handleClick],

    // DOM method calls (array = arguments)
    focus: [],
    scrollIntoView: [{ behavior: 'smooth' }]
  }
});
```

---

## How It Compares to Other Update Methods

| Method | Targets | Best For |
|--------|---------|----------|
| `Elements.myId.update({})` | One specific element | Single targeted change |
| **`Elements.update({})`** | **Multiple elements by ID** | **Named element groups, state transitions** |
| `Collections.update({})` | Groups of similar elements | Elements sharing a class/tag |
| `Selector.update({})` | CSS selector matches | Complex or dynamic targeting |

### Use `Elements.update()` When:

✅ Updating 2+ specific named elements in one action
✅ Page or component initialization with API data
✅ UI state transitions (loading, error, success, ready)
✅ Form management (enable, disable, clear, validate feedback)
✅ Dashboard metrics and named content slots

---

## Key Principles

### 1. One ID = One Entry in the Object

```javascript
Elements.update({
  header: { /* changes for header */ },
  footer: { /* changes for footer */ }
});
```

### 2. IDs Must Match HTML Exactly (Case-Sensitive)

```html
<div id="myElement"></div>
```

```javascript
Elements.update({
  myElement: { /* ✅ matches */ },
  MyElement: { /* ❌ wrong case */ },
  my_element: { /* ❌ underscore format */ }
});
```

### 3. Missing Elements Report Failure, Not Crash

```javascript
const results = Elements.update({
  realElement:    { textContent: 'Hello' },
  missingElement: { textContent: 'Oops' }  // Not in DOM
});

results.realElement.success    // true
results.missingElement.success // false — app continues normally
results.missingElement.error   // "Element not found: missingElement"
```

### 4. Each Entry Gets Independent, Unique Updates

Unlike `Collections.update()` which applies the same update to all matched elements, each entry here can have a completely different update object:

```javascript
Elements.update({
  pageTitle: { textContent: 'Dashboard', style: { fontSize: '32px' } },
  footerNote: { textContent: '© 2026',   style: { fontSize: '12px' } }
});
```

---

## The Declarative Mindset

The real power of `Elements.update()` is not just fewer lines — it's a **shift in how you think** about UI updates.

```
Imperative (step-by-step):         Declarative (state description):
──────────────────────────         ────────────────────────────────
Get button → disable it.           Elements.update({
Get spinner → show it.               loginBtn: { disabled: true },
Get input → clear it.                spinner:  { style: { display:'block' } },
Get error div → hide it.             errorMsg: { style: { display:'none' } }
                                   });
```

You describe the **destination**, not the **journey**. The code reads like documentation of the UI state.

---

## Summary

`Elements.update()` is purpose-built for the most common multi-element update scenario: you know the IDs, you have related updates to apply, and you want to express it as one cohesive description.

- **Input**: Object — keys are element IDs, values are update objects
- **Output**: Results object — `{ elementId: { success, element, error } }` per ID
- **Change detection**: Automatically skips DOM writes when values haven't changed
- **Error handling**: Missing elements reported gracefully, app never crashes
- **Update objects**: Full property support — text, style, classList, attributes, dataset, events, methods

---

## What's Next?

- **Chapter 2**: Breaking down a complete example step by step
- **Chapter 3**: Targeting by ID — naming conventions and best practices
- **Chapter 4**: Real-world patterns — forms, dashboards, modals, notifications
- **Chapter 5**: Update object properties — every category in detail
- **Chapter 6**: The return value — verification, element references, error handling