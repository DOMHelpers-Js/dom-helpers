[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Indexed Updates on ClassName, TagName, and Name

## Quick Start (30 seconds)

```javascript
// ClassName — by class name
ClassName.card.update({
  style: { padding: '16px' },
  [0]: { classList: { add: ['featured'] } }
});

// TagName — by tag name
TagName.li.update({
  style: { padding: '8px' },
  [0]: { classList: { add: ['first'] } },
  [-1]: { classList: { add: ['last'] } }
});

// Name — by name attribute
Name.email.update({
  classList: { add: ['form-control'] },
  [0]: { placeholder: 'Primary email' }
});
```

---

## ClassName — Collections by Class

Access all elements with a specific CSS class, then update them with bulk and index-specific properties:

### Basic Example

```javascript
ClassName.btn.update({
  // ALL .btn elements
  style: { padding: '10px 20px', borderRadius: '4px' },
  classList: { add: ['btn-styled'] },

  // Specific buttons
  [0]: {
    textContent: 'Save',
    style: { backgroundColor: '#28a745', color: 'white' }
  },
  [1]: {
    textContent: 'Cancel',
    style: { backgroundColor: '#dc3545', color: 'white' }
  }
});
```

### Bracket Notation for Hyphenated Classes

Class names with hyphens require bracket notation:

```javascript
ClassName['nav-link'].update({
  style: { textDecoration: 'none', color: '#333' },

  [0]: {
    classList: { add: ['active'] },
    style: { color: '#007bff', fontWeight: 'bold' }
  }
});

ClassName['menu-item'].update({
  classList: { add: ['item'] },
  [-1]: { classList: { add: ['last-item'] } }
});
```

---

## TagName — Collections by Tag

Access all elements of a specific HTML tag:

### Basic Example

```javascript
TagName.p.update({
  // ALL <p> elements
  style: { lineHeight: '1.6', color: '#333' },

  // First paragraph — special intro styling
  [0]: {
    style: { fontSize: '20px', fontWeight: 'bold' },
    classList: { add: ['intro'] }
  }
});
```

### Table Rows

```javascript
TagName.tr.update({
  // ALL rows
  style: { height: '40px' },

  // Header row
  [0]: {
    style: { backgroundColor: '#f8f9fa', fontWeight: 'bold' },
    classList: { add: ['header-row'] }
  },

  // Last row
  [-1]: {
    style: { borderBottom: '2px solid #333' }
  }
});
```

### List Items

```javascript
TagName.li.update({
  style: { padding: '8px', margin: '4px 0' },

  [0]: { classList: { add: ['first-item'] } },
  [-1]: { classList: { add: ['last-item'] } }
});
```

---

## Name — Collections by Name Attribute

Access all elements with a specific `name` attribute — especially useful for form fields:

### Form Fields

```javascript
Name.username.update({
  // ALL elements with name="username"
  classList: { add: ['form-control'] },

  // First one gets special treatment
  [0]: {
    placeholder: 'Enter your username',
    required: true
  }
});
```

### Radio Buttons

```javascript
Name.gender.update({
  // ALL radio buttons named "gender"
  classList: { add: ['radio-input'] },

  // Pre-select the first option
  [0]: { checked: true }
});
```

### Multiple Inputs with Same Name

```javascript
Name.email.update({
  classList: { add: ['form-control'] },

  [0]: { placeholder: 'Primary email address' },
  [1]: { placeholder: 'Secondary email (optional)' }
});
```

---

## Negative Indices

All three shortcuts support negative indices for counting from the end:

```javascript
// ClassName with negative indices
ClassName.step.update({
  style: { color: '#999' },
  [0]: { style: { color: 'green' }, classList: { add: ['completed'] } },
  [-1]: { style: { color: '#333' }, classList: { add: ['current'] } }
});

// TagName with negative indices
TagName.li.update({
  style: { borderBottom: '1px solid #eee' },
  [-1]: { style: { borderBottom: 'none' } }
});
```

| Index | Means |
|-------|-------|
| `[0]` | First element |
| `[1]` | Second element |
| `[-1]` | Last element |
| `[-2]` | Second to last |

---

## The Override Pattern

Bulk updates run first, index updates run second — so index values can override bulk values:

```javascript
ClassName.card.update({
  // Step 1: ALL cards → gray border
  style: { border: '1px solid #ccc' },

  // Step 2: First card → gold border (overrides gray)
  [0]: { style: { border: '2px solid gold' } }
});

// Result:
// card[0] → border: '2px solid gold'  (index override)
// card[1] → border: '1px solid #ccc'  (bulk only)
// card[2] → border: '1px solid #ccc'  (bulk only)
```

---

## Real-World Examples

### Navigation with Active State

```javascript
ClassName['nav-link'].update({
  style: {
    padding: '8px 16px',
    textDecoration: 'none',
    color: '#333'
  },
  classList: { remove: ['active'] },

  [0]: {
    classList: { add: ['active'] },
    style: { color: '#007bff', fontWeight: 'bold' }
  }
});
```

### Button Group

```javascript
ClassName.btn.update({
  style: {
    padding: '10px 20px',
    border: 'none',
    cursor: 'pointer'
  },
  classList: { add: ['btn-base'] },

  [0]: {
    textContent: 'Save',
    style: { backgroundColor: '#28a745', color: 'white' },
    classList: { add: ['btn-success'] }
  },
  [1]: {
    textContent: 'Cancel',
    style: { backgroundColor: '#dc3545', color: 'white' },
    classList: { add: ['btn-danger'] }
  },
  [2]: {
    textContent: 'Reset',
    style: { backgroundColor: '#6c757d', color: 'white' },
    classList: { add: ['btn-secondary'] }
  }
});
```

### Featured Card

```javascript
ClassName.card.update({
  style: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px'
  },

  [0]: {
    style: {
      border: '2px solid gold',
      backgroundColor: '#fffacd',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    classList: { add: ['card-featured'] }
  }
});
```

---

## Out-of-Range Indices

Invalid indices are skipped with a warning:

```javascript
ClassName.btn.update({
  [0]: { textContent: 'First' },     // ✅ Applied
  [999]: { textContent: 'Missing' }  // ⚠️ Skipped
});
// Console: No element at index 999 (resolved to 999, collection has 3 elements)
```

Empty collections are handled gracefully:

```javascript
ClassName.nonexistent.update({
  [0]: { textContent: 'Test' }
});
// Console: .update() called on empty collection
```

---

## Summary

| Shortcut | Access By | Example |
|----------|----------|---------|
| `ClassName.btn` | CSS class name | `ClassName.btn.update({...})` |
| `ClassName['nav-link']` | Hyphenated class | `ClassName['nav-link'].update({...})` |
| `TagName.div` | HTML tag | `TagName.div.update({...})` |
| `TagName.li` | HTML tag | `TagName.li.update({...})` |
| `Name.email` | `name` attribute | `Name.email.update({...})` |

| Feature | Works? |
|---------|--------|
| Bulk updates (string keys) | ✅ Applied to all elements |
| Index updates (numeric keys) | ✅ Applied to specific elements |
| Negative indices | ✅ `[-1]` = last element |
| Override pattern | ✅ Index overrides bulk |
| Out-of-range safety | ✅ Warning, no error |

> **Simple Rule to Remember:** `ClassName.btn.update()`, `TagName.div.update()`, and `Name.email.update()` all work the same way — string keys for shared properties, numeric keys for individual elements. Use `[-1]` for the last element.