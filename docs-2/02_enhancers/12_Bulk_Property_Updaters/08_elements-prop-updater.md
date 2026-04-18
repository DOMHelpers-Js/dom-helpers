[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Elements Generic Property Updater — .prop()

## Quick Start (30 seconds)

```javascript
// Update any property on multiple elements
Elements.prop("disabled", {
  btn1: true,
  btn2: false
});

// Update nested properties (like style.color)
Elements.prop("style.color", {
  title: "red",
  subtitle: "blue",
  footer: "gray"
});
```

---

## What is .prop()?

`.prop()` is the **generic property updater**. It can set **any element property** — including **nested properties** — on multiple elements at once. While the other bulk methods (`.textContent()`, `.disabled()`, `.style()`, etc.) are specialized for specific properties, `.prop()` can handle any property you name.

Simply put, `.prop()` is the **catch-all** — if there's no dedicated method for the property you need, `.prop()` has you covered.

---

## Syntax

```javascript
Elements.prop(propertyPath, updates)   // Returns Elements (chainable)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `propertyPath` | String | The property name (e.g., `"disabled"`) or nested path (e.g., `"style.color"`) |
| `updates` | Object | Keys = element IDs, Values = new property values |

---

## How Does It Work?

### Simple Properties

```
Elements.prop("disabled", { btn1: true, btn2: false })
   ↓
For each entry:
   ├── "btn1" → true
   │   ├── Look up element → <button id="btn1">
   │   ├── "disabled" in element? → Yes
   │   └── Set: element.disabled = true
   │
   └── "btn2" → false
       ├── Look up element → <button id="btn2">
       ├── "disabled" in element? → Yes
       └── Set: element.disabled = false
   ↓
Return Elements (for chaining)
```

### Nested Properties

```
Elements.prop("style.fontSize", { title: "24px", body: "16px" })
   ↓
For each entry:
   ├── "title" → "24px"
   │   ├── Look up element → <h1 id="title">
   │   ├── Split path: ["style", "fontSize"]
   │   ├── Navigate: element → element.style
   │   └── Set: element.style.fontSize = "24px"
   │
   └── "body" → "16px"
       └── ... same process ...
   ↓
Return Elements (for chaining)
```

---

## Basic Examples

### Simple Property

```javascript
// Set a simple property
Elements.prop("disabled", {
  submitBtn: true,
  resetBtn: false,
  inputField: true
});
```

### Nested Property: style

```javascript
// Set a specific style property
Elements.prop("style.color", {
  title: "red",
  subtitle: "blue",
  footer: "gray"
});

Elements.prop("style.fontSize", {
  heading: "24px",
  paragraph: "16px",
  caption: "12px"
});
```

### Nested Property: dataset

```javascript
// Set a specific data attribute
Elements.prop("dataset.status", {
  card1: "active",
  card2: "inactive",
  card3: "pending"
});
```

---

## When to Use .prop() vs Dedicated Methods

| Task | Dedicated Method | .prop() Equivalent |
|------|-----------------|-------------------|
| Set text | `Elements.textContent({...})` | `Elements.prop("textContent", {...})` |
| Set value | `Elements.value({...})` | `Elements.prop("value", {...})` |
| Disable | `Elements.disabled({...})` | `Elements.prop("disabled", {...})` |
| Set one style | No dedicated method for single styles | `Elements.prop("style.color", {...})` |

**When to use `.prop()`:**
- You need to set a property that **doesn't have a dedicated method** (like `tabIndex`, `contentEditable`, `draggable`)
- You want to set a **single nested property** directly (like `style.color` without passing a full style object)
- You're building a **dynamic updater** where the property name comes from a variable

### Properties Without Dedicated Methods

```javascript
// tabIndex — no dedicated .tabIndex() method
Elements.prop("tabIndex", {
  firstBtn: 1,
  secondBtn: 2,
  thirdBtn: 3
});

// contentEditable
Elements.prop("contentEditable", {
  editArea: "true",
  readOnlyArea: "false"
});

// draggable
Elements.prop("draggable", {
  card1: true,
  card2: true,
  card3: false
});
```

---

## Real-World Examples

### Example 1: Dynamic Property Updates

When the property name comes from a variable:

```javascript
function bulkUpdate(property, updates) {
  Elements.prop(property, updates);
}

// Usage
bulkUpdate("textContent", { title: "Hello", footer: "Bye" });
bulkUpdate("style.color", { title: "red", footer: "gray" });
```

### Example 2: Set Multiple Style Properties

```javascript
Elements.prop("style.backgroundColor", {
  card1: "#f0f0f0",
  card2: "#e0e0e0",
  card3: "#d0d0d0"
});

Elements.prop("style.borderRadius", {
  card1: "8px",
  card2: "8px",
  card3: "8px"
});
```

### Example 3: Tab Order Management

```javascript
function setTabOrder(order) {
  const updates = {};
  order.forEach((elementId, index) => {
    updates[elementId] = index + 1;
  });
  Elements.prop("tabIndex", updates);
}

setTabOrder(['nameInput', 'emailInput', 'submitBtn']);
// nameInput: tabIndex=1, emailInput: tabIndex=2, submitBtn: tabIndex=3
```

---

## Error Handling

### Invalid Property Path

If the property doesn't exist on the element, you'll get a warning:

```javascript
Elements.prop("nonExistent", { myElement: "value" });
// Console: [DOM Helpers] Property 'nonExistent' not found on element 'myElement'
```

### Invalid Nested Path

If a nested path leads to something that doesn't exist:

```javascript
Elements.prop("style.nonExistent.deep", { myElement: "value" });
// Console: [DOM Helpers] Invalid property path 'style.nonExistent.deep' for 'myElement'
```

### Missing First Argument

```javascript
Elements.prop({ title: "Hello" });  // ❌ Missing property name
// Console: [DOM Helpers] prop() requires a property name as first argument
```

---

## Chaining

```javascript
Elements
  .prop("style.color", { title: "navy", subtitle: "gray" })
  .prop("style.fontSize", { title: "28px", subtitle: "18px" })
  .textContent({ title: "Welcome", subtitle: "To the app" });
```

---

## Summary

| Aspect | Detail |
|--------|--------|
| **What** | Updates any property (including nested) on multiple elements |
| **Syntax** | `Elements.prop(propertyPath, { id: value })` |
| **Simple path** | `"disabled"`, `"textContent"`, `"tabIndex"` |
| **Nested path** | `"style.color"`, `"style.fontSize"`, `"dataset.status"` |
| **When to use** | Properties without dedicated methods, dynamic property names, single nested properties |
| **Returns** | Elements (chainable) |

> **Simple Rule to Remember:** `.prop()` is the universal updater — it can set any property on any element. Use dot notation for nested properties (`"style.color"`). Prefer dedicated methods (`.textContent()`, `.style()`) when they exist, and fall back to `.prop()` for everything else.