[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Collections Bulk Updaters — Index-Based Updates

## Quick Start (30 seconds)

```javascript
// Get a collection of elements
const buttons = Collections.ClassName.btn;

// Update text by index
buttons.textContent({
  0: "First Button",
  1: "Second Button",
  2: "Third Button"
});

// Update styles by index
buttons.style({
  0: { backgroundColor: "green" },
  1: { backgroundColor: "blue" },
  2: { backgroundColor: "red" }
});
```

---

## What Are Collections Bulk Updaters?

Collections bulk updaters work the same way as Elements bulk updaters, with one key difference: instead of using **element IDs** as keys, they use **numeric indices** (0, 1, 2, ...) to target specific elements within a collection.

Simply put, Elements bulk methods say **"update the element with this ID."** Collections bulk methods say **"update the element at this position in the collection."**

---

## Elements vs Collections: Key Difference

```
Elements (by ID):                    Collections (by index):

Elements.textContent({               buttons.textContent({
  header: "Hello",                     0: "First",
  footer: "Bye"                        1: "Second",
})                                     2: "Third"
                                     })
```

---

## Available Collection Methods

| Method | What It Updates |
|--------|---------------|
| `.textContent()` | Text content by index |
| `.innerHTML()` | HTML content by index |
| `.value()` | Input values by index |
| `.style()` | Inline styles by index |
| `.dataset()` | Data attributes by index |
| `.classes()` | CSS classes by index |

---

## Syntax

All collection bulk methods follow the same pattern:

```javascript
collection.methodName({
  0: value,     // First element
  1: value,     // Second element
  2: value      // Third element
});
```

**Returns:** The collection (for chaining).

---

## Getting a Collection

Before using bulk methods, you need a collection:

```javascript
// By class name
const buttons = Collections.ClassName.btn;
const cards = Collections.ClassName.card;

// By tag name
const inputs = Collections.TagName.input;
const divs = Collections.TagName.div;

// By name attribute
const fields = Collections.Name.userField;
```

---

## .textContent() — Update Text by Index

```javascript
const items = Collections.ClassName.listItem;

items.textContent({
  0: "First item",
  1: "Second item",
  2: "Third item"
});
```

---

## .innerHTML() — Update HTML by Index

```javascript
const containers = Collections.ClassName.container;

containers.innerHTML({
  0: "<h2>Section 1</h2><p>Content here</p>",
  1: "<h2>Section 2</h2><p>More content</p>",
  2: "<h2>Section 3</h2><p>Even more</p>"
});
```

---

## .value() — Update Input Values by Index

```javascript
const inputs = Collections.TagName.input;

inputs.value({
  0: "John",
  1: "Doe",
  2: "john@example.com"
});
```

---

## .style() — Update Styles by Index

Each value is a style object:

```javascript
const cards = Collections.ClassName.card;

cards.style({
  0: { backgroundColor: "#f0f0f0", padding: "10px" },
  1: { backgroundColor: "#e0e0e0", padding: "15px" },
  2: { backgroundColor: "#d0d0d0", padding: "20px" }
});
```

---

## .dataset() — Update Data Attributes by Index

Each value is an object of data attributes:

```javascript
const cards = Collections.ClassName.card;

cards.dataset({
  0: { id: "card-1", status: "active" },
  1: { id: "card-2", status: "inactive" },
  2: { id: "card-3", status: "pending" }
});
```

---

## .classes() — Update CSS Classes by Index

Supports both string replacement and classList operations:

```javascript
const items = Collections.ClassName.item;

// String replacement
items.classes({
  0: "item active highlighted",
  1: "item disabled"
});

// classList operations
items.classes({
  0: { add: ["active", "selected"], remove: ["disabled"] },
  1: { toggle: "collapsed" },
  2: { replace: ["old-state", "new-state"] }
});
```

---

## You Don't Have to Update Every Index

You can update just the indices you need — others are left unchanged:

```javascript
const buttons = Collections.ClassName.btn;

// Only update the first and third buttons
buttons.textContent({
  0: "Updated First",
  2: "Updated Third"
});
// Button at index 1 is untouched
```

---

## Real-World Examples

### Example 1: Styled Button Group

```javascript
const buttons = Collections.ClassName.btn;

buttons
  .textContent({
    0: "Success",
    1: "Info",
    2: "Danger"
  })
  .style({
    0: { backgroundColor: "green", color: "white" },
    1: { backgroundColor: "blue", color: "white" },
    2: { backgroundColor: "red", color: "white" }
  });
```

### Example 2: Table Row Styling

```javascript
const rows = Collections.TagName.tr;

// Alternate row colors
rows.style({
  0: { backgroundColor: "#fff" },
  1: { backgroundColor: "#f9f9f9" },
  2: { backgroundColor: "#fff" },
  3: { backgroundColor: "#f9f9f9" }
});
```

### Example 3: Form Fields from Data

```javascript
const inputs = Collections.ClassName.formField;

function prefillFromData(data) {
  inputs.value({
    0: data.firstName,
    1: data.lastName,
    2: data.email,
    3: data.phone
  });
}

prefillFromData({
  firstName: "Alice",
  lastName: "Smith",
  email: "alice@example.com",
  phone: "555-0123"
});
```

### Example 4: Status Badges

```javascript
const badges = Collections.ClassName.badge;

badges
  .textContent({
    0: "Active",
    1: "Pending",
    2: "Closed"
  })
  .classes({
    0: "badge badge-success",
    1: "badge badge-warning",
    2: "badge badge-danger"
  });
```

---

## Method Chaining

All collection bulk methods are chainable:

```javascript
Collections.ClassName.btn
  .textContent({ 0: "Click Me", 1: "Submit" })
  .style({ 0: { backgroundColor: "blue" } })
  .classes({ 0: { add: ["primary"] } });
```

---

## How It Works Under the Hood

```
buttons.textContent({ 0: "First", 2: "Third" })
   ↓
For each entry:
   ├── index: 0, value: "First"
   │   ├── Parse index → 0
   │   ├── Get element at index 0 from collection
   │   ├── Has .update()? → Yes
   │   └── Call: element.update({ textContent: "First" })
   │
   └── index: 2, value: "Third"
       ├── Parse index → 2
       ├── Get element at index 2 from collection
       ├── Has .update()? → Yes
       └── Call: element.update({ textContent: "Third" })
   ↓
Return collection (for chaining)
```

The collection accesses elements from its internal `_originalCollection` or `_originalNodeList` by the numeric index.

---

## Error Handling

Invalid indices are silently skipped — non-numeric keys are ignored:

```javascript
const buttons = Collections.ClassName.btn;

buttons.textContent({
  0: "This works",
  "abc": "This is skipped (non-numeric)",
  99: "This is skipped (index out of range)",
  1: "This also works"
});
```

---

## Summary

| Aspect | Detail |
|--------|--------|
| **What** | Update properties on collection elements by their position (index) |
| **Keys** | Numeric indices: `0`, `1`, `2`, ... |
| **Methods** | `.textContent()`, `.innerHTML()`, `.value()`, `.style()`, `.dataset()`, `.classes()` |
| **Partial updates** | You only need to specify the indices you want to update |
| **Chainable** | All methods return the collection for chaining |
| **Under the hood** | Uses `.update()` on each element (falls back to direct assignment) |

> **Simple Rule to Remember:** Collections bulk methods work exactly like Elements bulk methods, but use **numeric indices** instead of element IDs. Index `0` is the first element, `1` is the second, and so on. You only need to update the indices you care about.