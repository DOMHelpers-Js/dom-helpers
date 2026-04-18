[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# DOMHelpers Properties — Accessing the Helpers

## Quick Start (30 seconds)

```javascript
// Access any helper through DOMHelpers
const button = DOMHelpers.Elements.submitBtn;
const buttons = DOMHelpers.Collections.ClassName.btn;
const header = DOMHelpers.Selector.query('#header');
const newDiv = DOMHelpers.createElement('div');

// Check the library version
console.log(DOMHelpers.version);  // "2.3.1"
```

---

## What Are the DOMHelpers Properties?

The `DOMHelpers` object holds **references** to every helper in the library. Think of these properties as **named doors** — each one leads to a different helper.

```
DOMHelpers
├─→ .Elements        →  ID-based element access
├─→ .Collections     →  Class/Tag/Name-based group access
├─→ .Selector        →  CSS selector-based access
├─→ .createElement   →  Enhanced element creation
└─→ .version         →  Library version string
```

These properties point to the **exact same objects** as the global variables. `DOMHelpers.Elements` and `Elements` are the same thing.

---

## DOMHelpers.Elements

The Elements helper — access individual DOM elements by their ID.

```javascript
// These two are identical
DOMHelpers.Elements.myButton;
Elements.myButton;

// Access and update through DOMHelpers
DOMHelpers.Elements.header.update({
  textContent: 'Welcome Back!',
  style: { color: '#333' }
});

// Use any Elements method
DOMHelpers.Elements.get('myButton', null);
DOMHelpers.Elements.exists('header');
DOMHelpers.Elements.getMultiple('header', 'footer', 'sidebar');
```

**What's happening here:**
- `DOMHelpers.Elements` is the same `Elements` proxy that maps property names to `document.getElementById()` calls
- Every method available on `Elements` — `.get()`, `.exists()`, `.update()`, `.waitFor()` — works exactly the same way through `DOMHelpers.Elements`
- The element you get back still has the `.update()` method attached

---

## DOMHelpers.Collections

The Collections helper — access groups of elements by class name, tag name, or name attribute.

```javascript
// These two are identical
DOMHelpers.Collections.ClassName.btn;
Collections.ClassName.btn;

// Access collections through DOMHelpers
const allButtons = DOMHelpers.Collections.ClassName.btn;
const allParagraphs = DOMHelpers.Collections.TagName.p;
const emailFields = DOMHelpers.Collections.Name.email;

// Use collection methods
allButtons.forEach(btn => console.log(btn.textContent));
allButtons.update({ disabled: true });
```

**What's happening here:**
- `DOMHelpers.Collections` is the same `Collections` object with its three sub-proxies: `ClassName`, `TagName`, and `Name`
- Every collection method — `.forEach()`, `.map()`, `.filter()`, `.update()`, `.addClass()` — works the same way
- The collections you get back have all the enhanced array-like methods

---

## DOMHelpers.Selector

The Selector helper — query elements using CSS selectors with intelligent caching.

```javascript
// These two are identical
DOMHelpers.Selector.query('#header');
Selector.query('#header');

// Single element query
const nav = DOMHelpers.Selector.query('nav.main-nav');

// Multiple elements query
const cards = DOMHelpers.Selector.queryAll('.card');

// Scoped queries
const navLinks = DOMHelpers.Selector.Scoped.withinAll('nav', 'a');

// Update via selector
DOMHelpers.Selector.update({
  '.btn': { style: { padding: '10px' } }
});
```

**What's happening here:**
- `DOMHelpers.Selector` is the same `Selector` object with `.query()`, `.queryAll()`, and `.Scoped`
- Every method — `.waitFor()`, `.waitForAll()`, `.update()` — works the same way
- Results come back with `.update()` methods and enhanced collection features

---

## DOMHelpers.createElement

The enhanced `createElement` function — create elements with configuration objects and bulk creation.

```javascript
// These two are identical
DOMHelpers.createElement('div');
createElement('div');

// Create with configuration
const button = DOMHelpers.createElement('button', {
  textContent: 'Click Me',
  className: 'btn primary',
  style: { padding: '10px 20px' }
});

// Bulk creation
const elements = DOMHelpers.createElement.bulk({
  H1: { textContent: 'Hello World' },
  P: { textContent: 'Welcome to my app' },
  BUTTON: { textContent: 'Get Started', className: 'btn' }
});

// Access the created elements
elements.H1;       // The <h1> element
elements.P;        // The <p> element
elements.BUTTON;   // The <button> element
elements.all;      // Array of all three elements
```

**What's happening here:**
- `DOMHelpers.createElement` is the enhanced version of `document.createElement`
- It automatically adds the `.update()` method to every created element
- The `.bulk()` method lets you create multiple elements with configuration in one call
- The result object has helper methods like `.toArray()`, `.appendTo()`, `.forEach()`

---

## DOMHelpers.version

A simple string property that tells you which version of the library is loaded.

```javascript
console.log(DOMHelpers.version);  // "2.3.1"

// Useful for debugging
console.log(`Running DOM Helpers v${DOMHelpers.version}`);

// Check minimum version if needed
function checkVersion() {
  const [major, minor] = DOMHelpers.version.split('.').map(Number);

  if (major < 2 || (major === 2 && minor < 3)) {
    console.warn('Please update DOM Helpers to v2.3+');
  }
}
```

**What's happening here:**
- `DOMHelpers.version` returns a string like `"2.3.1"`
- It's read-only and set at build time by the library
- Useful for logging, debugging, or verifying compatibility

---

## How It Works Under the Hood

When the library loads, it creates each helper independently and then assembles the `DOMHelpers` object:

```
Library IIFE starts
   ↓
Creates Elements helper   →   window.Elements = Elements
   ↓
Creates Collections helper →   window.Collections = Collections
   ↓
Creates Selector helper    →   window.Selector = Selector
   ↓
Builds DOMHelpers object:
   {
     Elements:      → same reference as window.Elements
     Collections:   → same reference as window.Collections
     Selector:      → same reference as window.Selector
     version:       → "2.3.1"
     isReady()      → checks all three exist
     getStats()     → calls .stats() on each
     clearAll()     → calls .clear() on each
     destroyAll()   → calls .destroy() on each
     configure()    → calls .configure() on each
   }
   ↓
window.DOMHelpers = DOMHelpers
   ↓
Creates enhanced createElement → window.createElement
   ↓
DOMHelpers.createElement = enhancedCreateElement
```

**Key Insight:** `DOMHelpers` doesn't *own* the helpers — it *references* them. Modifying `DOMHelpers.Elements.myButton` is exactly the same as modifying `Elements.myButton`. There's no copy, no wrapper — they're the same object.

---

## When to Use DOMHelpers Properties vs Direct Globals

Both approaches give you the same result. Here's when each makes sense:

### Use Direct Globals (Recommended for Most Code)

```javascript
// ✅ Shorter, cleaner for everyday use
Elements.header.update({ textContent: 'Hello' });
Collections.ClassName.btn.update({ disabled: false });
Selector.query('#nav').update({ style: { display: 'block' } });
```

### Use DOMHelpers Properties (For Library Management)

```javascript
// ✅ Makes sense when managing the library as a whole
if (DOMHelpers.isReady()) {
  console.log(`v${DOMHelpers.version} — all systems go`);
}

// ✅ Useful when passing the library to another module
function initModule(lib) {
  const header = lib.Elements.header;
  const buttons = lib.Collections.ClassName.btn;
  // ...
}
initModule(DOMHelpers);
```

### Use DOMHelpers Properties (When You Need a Single Namespace)

```javascript
// ✅ If you prefer not to rely on multiple globals
const { Elements, Collections, Selector } = DOMHelpers;

Elements.header.update({ textContent: 'Hello' });
Collections.ClassName.btn.update({ disabled: false });
```

---

## Summary

| Property | What It Provides | Same Global |
|----------|-----------------|-------------|
| `DOMHelpers.Elements` | ID-based element access + `.update()` | `Elements` |
| `DOMHelpers.Collections` | Class/Tag/Name collection access | `Collections` |
| `DOMHelpers.Selector` | CSS selector queries + caching | `Selector` |
| `DOMHelpers.createElement` | Enhanced element creation + `.bulk()` | `createElement` |
| `DOMHelpers.version` | Library version string | — |

> **Simple Rule to Remember:** Every property on `DOMHelpers` is the **same object** as the corresponding global. `DOMHelpers.Elements === Elements` is always `true`.