[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Elements Classes Updater — .classes()

## Quick Start (30 seconds)

```javascript
// Replace all classes with a string
Elements.classes({
  header: "navbar navbar-dark bg-primary",
  sidebar: "sidebar collapsed"
});

// Or use classList operations (add, remove, toggle, replace)
Elements.classes({
  header: { add: ["active", "highlighted"] },
  sidebar: { toggle: "collapsed" },
  footer: { remove: ["hidden"] }
});
```

---

## What is .classes()?

`.classes()` lets you update **CSS classes** on multiple elements in one call. It supports two modes:

1. **String mode** — Replace all classes at once
2. **Object mode** — Fine-grained `add`, `remove`, `toggle`, and `replace` operations

---

## Syntax

```javascript
Elements.classes(updates)   // Returns Elements (chainable)
```

Each value can be either a **string** or an **object**:

```javascript
Elements.classes({
  elementId: "class1 class2",                    // String — replaces all classes
  elementId: { add: [...], remove: [...], ... }  // Object — classList operations
});
```

---

## Mode 1: String Replacement

Pass a **string** to completely replace all classes on an element:

```javascript
Elements.classes({
  header: "navbar navbar-dark bg-primary",
  sidebar: "sidebar collapsed",
  card: "card shadow-sm"
});
```

This sets `element.className` directly — any existing classes are replaced.

```
Before: <div id="header" class="old-class another-class">
After:  <div id="header" class="navbar navbar-dark bg-primary">
```

---

## Mode 2: classList Operations

Pass an **object** with specific operations for fine-grained control:

### add — Add Classes

```javascript
Elements.classes({
  header: { add: ["active", "highlighted"] },
  card: { add: ["visible"] }
});
```

```
Before: <div id="header" class="navbar">
After:  <div id="header" class="navbar active highlighted">
```

### remove — Remove Classes

```javascript
Elements.classes({
  header: { remove: ["hidden", "disabled"] },
  sidebar: { remove: ["collapsed"] }
});
```

```
Before: <div id="header" class="navbar hidden disabled">
After:  <div id="header" class="navbar">
```

### toggle — Toggle Classes On/Off

```javascript
Elements.classes({
  sidebar: { toggle: "collapsed" },
  menu: { toggle: "open" }
});
```

If the class is present, it's removed. If it's absent, it's added:

```
Before: <div id="sidebar" class="sidebar collapsed">
After:  <div id="sidebar" class="sidebar">   (collapsed removed)

Before: <div id="menu" class="menu">
After:  <div id="menu" class="menu open">    (open added)
```

You can toggle multiple classes:

```javascript
Elements.classes({
  panel: { toggle: ["expanded", "active"] }
});
```

### replace — Swap One Class for Another

```javascript
Elements.classes({
  alert: { replace: ["alert-warning", "alert-success"] }
});
```

The `replace` value is an array of two strings: `[oldClass, newClass]`.

```
Before: <div id="alert" class="alert alert-warning">
After:  <div id="alert" class="alert alert-success">
```

---

## Combining Multiple Operations

You can use multiple operations on the same element:

```javascript
Elements.classes({
  header: {
    add: ["sticky", "shadow"],
    remove: ["transparent"]
  },
  sidebar: {
    add: ["visible"],
    remove: ["hidden"],
    toggle: "expanded"
  }
});
```

---

## Real-World Examples

### Example 1: Navigation Active State

```javascript
function setActiveNav(activePage) {
  // Remove active from all, add to current
  Elements.classes({
    navHome: activePage === 'home' ? { add: ["active"] } : { remove: ["active"] },
    navAbout: activePage === 'about' ? { add: ["active"] } : { remove: ["active"] },
    navContact: activePage === 'contact' ? { add: ["active"] } : { remove: ["active"] }
  });
}

setActiveNav('about');
```

### Example 2: Form Validation Visual Feedback

```javascript
function showValidation(results) {
  Elements.classes({
    nameInput: results.name
      ? { remove: ["is-invalid"], add: ["is-valid"] }
      : { remove: ["is-valid"], add: ["is-invalid"] },

    emailInput: results.email
      ? { remove: ["is-invalid"], add: ["is-valid"] }
      : { remove: ["is-valid"], add: ["is-invalid"] }
  });
}

showValidation({ name: true, email: false });
```

### Example 3: Dark Mode Toggle

```javascript
function toggleDarkMode() {
  Elements.classes({
    body: { toggle: "dark-mode" },
    header: { toggle: "dark-header" },
    sidebar: { toggle: "dark-sidebar" },
    card: { toggle: "dark-card" }
  });
}
```

### Example 4: Loading State with Class Swap

```javascript
function setLoading(isLoading) {
  if (isLoading) {
    Elements.classes({
      submitBtn: { add: ["loading"], remove: ["ready"] },
      spinner: { remove: ["hidden"] },
      form: { add: ["disabled-look"] }
    });
  } else {
    Elements.classes({
      submitBtn: { remove: ["loading"], add: ["ready"] },
      spinner: { add: ["hidden"] },
      form: { remove: ["disabled-look"] }
    });
  }
}
```

---

## String vs Object: When to Use Which

| Scenario | Use |
|----------|-----|
| Replace ALL classes entirely | String: `"class1 class2"` |
| Add a class without removing existing ones | Object: `{ add: ["new"] }` |
| Remove specific classes | Object: `{ remove: ["old"] }` |
| Toggle a class on/off | Object: `{ toggle: "active" }` |
| Swap one class for another | Object: `{ replace: ["old", "new"] }` |

---

## How It Works Under the Hood

```
Elements.classes({ header: { add: ["active"], remove: ["hidden"] } })
   ↓
1️⃣ Look up element: Elements.header → <div id="header">
   ↓
2️⃣ Value is an object → use classList operations
   ↓
3️⃣ Has .update()? → Yes
   └── Call: element.update({ classList: { add: ["active"], remove: ["hidden"] } })
   ↓
4️⃣ If .update() not available → fallback:
   ├── element.classList.add("active")
   └── element.classList.remove("hidden")
   ↓
5️⃣ Return Elements (for chaining)
```

For string values:

```
Elements.classes({ header: "navbar dark" })
   ↓
element.className = "navbar dark"  (replaces all classes)
```

---

## Chaining

```javascript
Elements
  .classes({
    header: { add: ["sticky"] },
    sidebar: { toggle: "collapsed" }
  })
  .style({
    header: { position: "fixed", top: "0" }
  })
  .textContent({
    header: "My App"
  });
```

---

## Summary

| Mode | Format | What It Does |
|------|--------|-------------|
| **String** | `"class1 class2"` | Replaces all classes |
| **add** | `{ add: ["class1"] }` | Adds classes (keeps existing) |
| **remove** | `{ remove: ["class1"] }` | Removes specific classes |
| **toggle** | `{ toggle: "class1" }` | Adds if missing, removes if present |
| **replace** | `{ replace: ["old", "new"] }` | Swaps one class for another |

> **Simple Rule to Remember:** Use a string to replace all classes at once. Use an object with `add`, `remove`, `toggle`, or `replace` for precise class manipulation. You can combine multiple operations in a single object.