[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Practical Patterns & Best Practices

## Quick Reference

```javascript
// Three global shortcuts
ClassName.btn           // By CSS class
TagName.div             // By HTML tag
Name.email              // By name attribute

// Index access (all three)
collection[0]           // First element
collection[-1]          // Last element

// Function calls (all three)
ClassName('btn')        // Same as ClassName.btn
TagName('div')          // Same as TagName.div
Name('email')           // Same as Name.email
```

---

## Common Patterns

### Pattern 1: First / Last Element

The most common use of negative indices — targeting the first and last items:

```javascript
// First and last buttons
ClassName.btn[0].update({ textContent: "Start" });
ClassName.btn[-1].update({ textContent: "End" });

// First and last table rows
TagName.tr[0].update({ style: { fontWeight: "bold" } });
TagName.tr[-1].update({ style: { fontStyle: "italic" } });
```

### Pattern 2: Loop with Index Access

Use a `for` loop with index access to get auto-enhanced elements:

```javascript
const items = ClassName.item;

for (let i = 0; i < items.length; i++) {
  items[i].update({
    textContent: `Item ${i + 1}`,
    dataset: { position: String(i) }
  });
}
```

### Pattern 3: Conditional Updates Based on Position

```javascript
const cards = ClassName.card;

for (let i = 0; i < cards.length; i++) {
  if (i === 0) {
    // First card — featured
    cards[i].update({
      classList: { add: ['featured'] },
      style: { border: "2px solid gold" }
    });
  } else if (i === cards.length - 1) {
    // Last card — "see more"
    cards[i].update({
      textContent: "View All →",
      style: { opacity: "0.7" }
    });
  } else {
    // Middle cards — standard
    cards[i].update({
      classList: { add: ['standard'] }
    });
  }
}
```

### Pattern 4: Safe Access with Length Check

```javascript
const results = ClassName.result;

if (results.length > 0) {
  results[0].update({ classList: { add: ['first'] } });
}

if (results.length > 1) {
  results[-1].update({ classList: { add: ['last'] } });
}
```

### Pattern 5: Building a Navigation

```javascript
function setupNav(activeIndex) {
  const navItems = ClassName['nav-item'];

  for (let i = 0; i < navItems.length; i++) {
    if (i === activeIndex) {
      navItems[i].update({
        classList: { add: ['active'] },
        setAttribute: { 'aria-current': 'page' }
      });
    } else {
      navItems[i].update({
        classList: { remove: ['active'] },
        setAttribute: { 'aria-current': null }
      });
    }
  }
}
```

---

## Live Collections

Collections from shortcuts are **live** — they automatically reflect changes to the DOM:

```javascript
const buttons = ClassName.btn;
console.log(buttons.length);  // 3

// Add a new button
const newBtn = document.createElement('button');
newBtn.className = 'btn';
document.body.appendChild(newBtn);

// Collection automatically includes it
console.log(buttons.length);  // 4
buttons[-1].update({ textContent: "I'm new!" });
```

This is useful because you don't need to re-query after DOM changes — the collection stays current.

---

## Bracket Notation for Special Class Names

| Class Name | Syntax |
|-----------|--------|
| Simple name | `ClassName.btn` |
| Dashed name | `ClassName['nav-item']` |
| Multiple classes | `ClassName['btn primary']` |
| Dot-separated | `ClassName['btn.primary']` |

```javascript
// ✅ Correct
ClassName['nav-item']
ClassName['btn-primary']
ClassName['card-body']

// ❌ Wrong — JavaScript interprets the dash as subtraction
// ClassName.nav-item
```

---

## Comparison: Shortcuts vs Collections

### Before Shortcuts

```javascript
// Verbose — always typing "Collections."
const firstBtn = Collections.ClassName.btn[0];
const lastRow = Collections.TagName.tr[Collections.TagName.tr.length - 1];
const emailField = Collections.Name.email[0];
```

### With Shortcuts

```javascript
// Clean and concise
const firstBtn = ClassName.btn[0];
const lastRow = TagName.tr[-1];
const emailField = Name.email[0];
```

---

## Loading the Module

```html
<!-- 1. Core library (required) -->
<script src="01_dh-core.js"></script>

<!-- 2. Collection Shortcuts enhancer -->
<script src="02_dh-collection-shortcuts.js"></script>

<!-- 3. Your code -->
<script>
  // ClassName, TagName, Name are now global
  ClassName.btn[0].update({ textContent: "Ready!" });
</script>
```

**Requirement:** The `Collections` helper from the core library must be loaded first. Without it, the shortcuts module won't initialize.

---

## API Quick Reference

### ClassName

```javascript
ClassName.btn              // All .btn elements (collection)
ClassName.btn[0]           // First .btn element (auto-enhanced)
ClassName.btn[-1]          // Last .btn element (auto-enhanced)
ClassName['nav-item']      // Bracket notation for dashed names
ClassName['btn primary']   // Elements with both classes
ClassName('btn')           // Function call (same as .btn)
```

### TagName

```javascript
TagName.div                // All <div> elements
TagName.input              // All <input> elements
TagName.div[0]             // First <div>
TagName.tr[-1]             // Last <tr>
TagName('button')          // Function call
```

### Name

```javascript
Name.email                 // All name="email" elements
Name.username              // All name="username" elements
Name.email[0]              // First email field
Name.gender[-1]            // Last gender radio
Name('email')              // Function call
```

### DOMHelpers Integration

```javascript
DOMHelpers.ClassName.btn   // Same as ClassName.btn
DOMHelpers.TagName.div     // Same as TagName.div
DOMHelpers.Name.email      // Same as Name.email
```

---

## Summary

| Feature | Detail |
|---------|--------|
| **Three globals** | `ClassName`, `TagName`, `Name` — no prefix needed |
| **Positive index** | `[0]`, `[1]`, `[2]` — count from start |
| **Negative index** | `[-1]`, `[-2]` — count from end |
| **Auto-enhancement** | Index access gives elements `.update()` |
| **Live collections** | Automatically reflect DOM changes |
| **Bracket notation** | Required for dashed names: `ClassName['nav-item']` |
| **Function calls** | `ClassName('btn')` works alongside `ClassName.btn` |
| **Backwards compatible** | `Collections.ClassName` still works unchanged |

> **Simple Rule to Remember:** `ClassName`, `TagName`, and `Name` are direct-access globals. Use `[0]` for first, `[-1]` for last. Elements picked by index are auto-enhanced with `.update()`. Use bracket notation for class names that have dashes.