[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Elements Dataset & Attributes Updaters — .dataset() and .attrs()

## Quick Start (30 seconds)

```javascript
// Set data-* attributes on multiple elements
Elements.dataset({
  userCard: { userId: "123", role: "admin", status: "active" },
  productItem: { productId: "456", price: "29.99" }
});

// Set HTML attributes on multiple elements
Elements.attrs({
  submitBtn: { type: "submit", name: "action" },
  image: { width: "300", height: "200", loading: "lazy" }
});
```

---

## What Are These Methods?

| Method | What It Sets | HTML Example |
|--------|-------------|-------------|
| `.dataset()` | `data-*` attributes | `<div data-user-id="123">` |
| `.attrs()` | Any HTML attribute | `<img width="300" loading="lazy">` |

Both let you set **multiple attributes on multiple elements** in a single call.

---

## .dataset() — Data Attributes

### What Are Data Attributes?

Data attributes (`data-*`) let you store custom data directly on HTML elements. They're commonly used to attach metadata — like IDs, statuses, or configuration — to elements without using hidden inputs or global variables.

```html
<!-- In HTML -->
<div id="userCard" data-user-id="123" data-role="admin"></div>
```

```javascript
// In JavaScript
element.dataset.userId;   // "123"
element.dataset.role;     // "admin"
```

### Syntax

```javascript
Elements.dataset(updates)   // Returns Elements (chainable)
```

Each value is an object of data attributes. Keys use **camelCase** (JavaScript automatically converts them to `data-kebab-case` in HTML):

| JavaScript (camelCase) | HTML Result |
|----------------------|------------|
| `userId` | `data-user-id` |
| `productName` | `data-product-name` |
| `status` | `data-status` |

### Basic Usage

```javascript
Elements.dataset({
  userCard: {
    userId: "123",
    role: "admin",
    status: "active"
  },
  productItem: {
    productId: "456",
    price: "29.99",
    category: "electronics"
  }
});
```

After this call:

```html
<div id="userCard" data-user-id="123" data-role="admin" data-status="active">
<div id="productItem" data-product-id="456" data-price="29.99" data-category="electronics">
```

### Reading Data Attributes Back

```javascript
// After setting with .dataset()
const card = document.getElementById('userCard');
console.log(card.dataset.userId);   // "123"
console.log(card.dataset.role);     // "admin"
console.log(card.dataset.status);   // "active"
```

### Real-World Example: Tagging Elements for Event Handling

```javascript
// Tag buttons with metadata
Elements.dataset({
  editBtn: { action: "edit", targetId: "42" },
  deleteBtn: { action: "delete", targetId: "42" },
  shareBtn: { action: "share", targetId: "42" }
});

// Later, in an event handler
document.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  const id = e.target.dataset.targetId;

  if (action === 'edit') editItem(id);
  if (action === 'delete') deleteItem(id);
  if (action === 'share') shareItem(id);
});
```

---

## .attrs() — HTML Attributes

### What It Does

`.attrs()` sets **any HTML attribute** on elements — not just data attributes. This includes standard attributes like `type`, `name`, `maxlength`, `required`, `width`, `loading`, and any custom attributes.

### Syntax

```javascript
Elements.attrs(updates)   // Returns Elements (chainable)
```

Each value is an object of attribute name-value pairs.

### Basic Usage

```javascript
Elements.attrs({
  submitBtn: {
    type: "submit",
    name: "submitAction",
    value: "send"
  },
  inputField: {
    maxlength: "100",
    pattern: "[A-Za-z]+",
    required: true
  },
  image: {
    width: "300",
    height: "200",
    loading: "lazy"
  }
});
```

### Removing Attributes

Set an attribute to `null` or `false` to remove it:

```javascript
Elements.attrs({
  submitBtn: {
    disabled: null    // Removes the disabled attribute
  },
  inputField: {
    required: false   // Removes the required attribute
  }
});
```

### How Removal Works

```
Attribute value:
├── null  → removeAttribute('disabled')
├── false → removeAttribute('required')
└── any other value → setAttribute('name', String(value))
```

---

## .attrs() — Real-World Examples

### Example 1: Form Validation Attributes

```javascript
Elements.attrs({
  nameInput: { required: true, minlength: "2", maxlength: "50" },
  emailInput: { required: true, type: "email" },
  ageInput: { type: "number", min: "18", max: "120" }
});
```

### Example 2: Lazy Loading Images

```javascript
Elements.attrs({
  heroImage: { loading: "eager" },
  sidebarImage: { loading: "lazy" },
  footerImage: { loading: "lazy" }
});
```

### Example 3: ARIA Accessibility Attributes

```javascript
Elements.attrs({
  navMenu: { role: "navigation", "aria-label": "Main navigation" },
  searchInput: { role: "searchbox", "aria-placeholder": "Search..." },
  alertBox: { role: "alert", "aria-live": "polite" }
});
```

### Example 4: Conditional Attribute Toggle

```javascript
function setFormRequired(isRequired) {
  if (isRequired) {
    Elements.attrs({
      nameField: { required: true },
      emailField: { required: true }
    });
  } else {
    Elements.attrs({
      nameField: { required: null },   // Remove required
      emailField: { required: null }   // Remove required
    });
  }
}
```

---

## .dataset() vs .attrs() — When to Use Which

| Scenario | Use |
|----------|-----|
| Storing custom metadata (IDs, statuses, config) | `.dataset()` |
| Setting standard HTML attributes (type, required, loading) | `.attrs()` |
| ARIA accessibility attributes | `.attrs()` |
| Custom data for JavaScript event handling | `.dataset()` |
| Form validation attributes (min, max, pattern) | `.attrs()` |

```javascript
// dataset — custom data for your app
Elements.dataset({
  card: { itemId: "42", category: "books" }
});

// attrs — standard HTML attributes
Elements.attrs({
  image: { loading: "lazy", width: "300" }
});
```

---

## Chaining

Both methods return `Elements` for chaining:

```javascript
Elements
  .dataset({
    userCard: { userId: "123", role: "admin" }
  })
  .attrs({
    editBtn: { "aria-label": "Edit user 123" }
  })
  .textContent({
    userName: "Alice"
  });
```

---

## Summary

| Method | Sets | Key Format | Removal |
|--------|------|-----------|---------|
| `.dataset()` | `data-*` attributes | camelCase (`userId` → `data-user-id`) | Not directly — set to empty string |
| `.attrs()` | Any HTML attribute | Exact attribute name | Set to `null` or `false` |

> **Simple Rule to Remember:** Use `.dataset()` for custom data (`data-*` attributes) and `.attrs()` for standard HTML attributes. To remove an attribute with `.attrs()`, set its value to `null` or `false`.