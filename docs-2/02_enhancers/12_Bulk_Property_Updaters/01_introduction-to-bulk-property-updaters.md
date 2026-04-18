[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Bulk Property Updaters — Introduction

## Quick Start (30 seconds)

```javascript
// Update text on multiple elements in one call
Elements.textContent({
  title: "Welcome Back",
  subtitle: "Your dashboard is ready",
  footer: "© 2024 MyApp"
});

// Update styles on multiple elements in one call
Elements.style({
  header: { backgroundColor: "#333", color: "white" },
  sidebar: { width: "250px" }
});
```

---

## What Are Bulk Property Updaters?

Bulk Property Updaters are **shorthand methods** that let you update the **same type of property** across **multiple elements** in a single call. Instead of updating elements one at a time, you pass an object where each key is an element ID (or collection index) and each value is the new property value.

Simply put, instead of saying "update this element, then that element, then that element," you say **"update all of these at once."**

---

## Why Do Bulk Property Updaters Exist?

### The Repetitive Pattern

When you need to update the same property on several elements, the code gets repetitive:

```javascript
// ❌ Repetitive — same operation, repeated for each element
Elements.title.update({ textContent: "Welcome Back" });
Elements.subtitle.update({ textContent: "Your dashboard is ready" });
Elements.footer.update({ textContent: "© 2024 MyApp" });
Elements.status.update({ textContent: "Online" });
```

Each line follows the exact same pattern: access an element, call `.update()`, set `textContent`. That's a lot of repeated structure.

### The Bulk Way

```javascript
// ✅ One call — same result, less code
Elements.textContent({
  title: "Welcome Back",
  subtitle: "Your dashboard is ready",
  footer: "© 2024 MyApp",
  status: "Online"
});
```

**Same result, but cleaner and more readable.** You can see at a glance exactly which elements get which text.

---

## Mental Model: A Broadcast System

Think of bulk updaters like a **radio broadcast**:

```
Without bulk updaters (individual calls):
┌─────────┐     ┌─────────┐
│  You     │────→│ Element1 │  "Update your text"
└─────────┘     └─────────┘
┌─────────┐     ┌─────────┐
│  You     │────→│ Element2 │  "Update your text"
└─────────┘     └─────────┘
┌─────────┐     ┌─────────┐
│  You     │────→│ Element3 │  "Update your text"
└─────────┘     └─────────┘

With bulk updaters (one broadcast):
                ┌─────────┐
            ┌──→│ Element1 │  "Welcome Back"
┌─────────┐│   └─────────┘
│  You     │┤   ┌─────────┐
│(textContent)├──→│ Element2 │  "Your dashboard is ready"
└─────────┘│   └─────────┘
            └──→┌─────────┐
                │ Element3 │  "© 2024 MyApp"
                └─────────┘
```

One call, multiple elements updated — each with its own value.

---

## How Does It Work?

When you call a bulk updater like `Elements.textContent({...})`, here's what happens:

```
Elements.textContent({ title: "Hello", footer: "Bye" })
   ↓
1️⃣ Loop through each key-value pair:
   ├── key: "title", value: "Hello"
   │   ├── Look up element: Elements.title → <h1 id="title">
   │   ├── Has .update()? → Yes
   │   └── Call: element.update({ textContent: "Hello" })
   │
   └── key: "footer", value: "Bye"
       ├── Look up element: Elements.footer → <footer id="footer">
       ├── Has .update()? → Yes
       └── Call: element.update({ textContent: "Bye" })
   ↓
2️⃣ Return Elements (for chaining)
```

Each bulk updater internally uses the `.update()` method you already know. It's a convenience layer — not a new system.

---

## Two Systems: Elements and Collections

Bulk Property Updaters work on **two helpers**, each with a different key scheme:

### Elements — Keys Are Element IDs

```javascript
// Keys = element IDs
Elements.textContent({
  header: "Welcome",      // Updates <div id="header">
  footer: "Goodbye"       // Updates <footer id="footer">
});
```

### Collections — Keys Are Numeric Indices

```javascript
// Keys = element indices (0, 1, 2, ...)
const buttons = Collections.ClassName.btn;

buttons.textContent({
  0: "First Button",     // Updates the 1st .btn element
  1: "Second Button",    // Updates the 2nd .btn element
  2: "Third Button"      // Updates the 3rd .btn element
});
```

---

## Complete Method Overview

### Elements Bulk Methods

| Category | Methods |
|----------|---------|
| **Text & Content** | `textContent()`, `innerHTML()`, `innerText()` |
| **Form & State** | `value()`, `placeholder()`, `disabled()`, `checked()`, `readonly()`, `hidden()`, `selected()` |
| **Media & Links** | `src()`, `href()`, `alt()`, `title()` |
| **Styling** | `style()`, `classes()` |
| **Data & Attributes** | `dataset()`, `attrs()` |
| **Generic** | `prop()` — update any property, including nested ones |

### Collections Bulk Methods

| Method | What It Does |
|--------|-------------|
| `textContent()` | Update text by index |
| `innerHTML()` | Update HTML by index |
| `value()` | Update input values by index |
| `style()` | Update styles by index |
| `dataset()` | Update data attributes by index |
| `classes()` | Update CSS classes by index |

---

## Key Features

### All Methods Are Chainable

Every bulk method returns the helper or collection, so you can chain calls:

```javascript
Elements
  .textContent({ title: "Hello" })
  .style({ title: { color: "blue" } })
  .classes({ title: { add: ["active"] } });
```

### Safe Error Handling

If an element ID doesn't exist, the method logs a warning and continues with the remaining elements — it doesn't throw an error:

```javascript
Elements.textContent({
  realElement: "This works",
  missingElement: "This is skipped with a warning",
  anotherReal: "This also works"
});
// Console: [DOM Helpers] Element 'missingElement' not found for textContent update
```

### Uses .update() Under the Hood

Bulk updaters use the same `.update()` method internally. If `.update()` isn't available on an element, the method falls back to direct property assignment:

```
Has .update()? → Yes → element.update({ textContent: value })
                 No  → element.textContent = value (fallback)
```

---

## This Module Is an Enhancer

Bulk Property Updaters is an **enhancer module** — it extends the core DOM Helpers library with additional methods. It's loaded as a separate script after the core:

```html
<!-- 1. Load the core library first -->
<script src="01_dh-core.js"></script>

<!-- 2. Load the bulk property updaters enhancer -->
<script src="01_dh-bulk-property-updaters.js"></script>
```

Once loaded, the bulk methods are automatically available on `Elements` and `Collections`.

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | Shorthand methods for updating the same property on multiple elements |
| **Elements** | Keys are element IDs: `Elements.textContent({ myId: "text" })` |
| **Collections** | Keys are numeric indices: `collection.textContent({ 0: "text" })` |
| **Chainable** | All methods return the helper for chaining |
| **Under the hood** | Uses `.update()` internally — same system you already know |
| **Error handling** | Warns on missing elements, continues with the rest |
| **Module type** | Enhancer — loads after the core library |

> **Simple Rule to Remember:** Bulk updaters let you update the same property type across many elements in one call. Pass an object where keys are element IDs (or indices) and values are the new property values. Chain methods together to update different properties in sequence.