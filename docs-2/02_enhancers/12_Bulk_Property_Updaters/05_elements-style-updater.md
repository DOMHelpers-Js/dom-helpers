[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Elements Style Updater — .style()

## Quick Start (30 seconds)

```javascript
// Style multiple elements in one call
Elements.style({
  header: { backgroundColor: "#333", color: "white", padding: "20px" },
  sidebar: { width: "250px", backgroundColor: "#f5f5f5" },
  footer: { textAlign: "center", padding: "10px" }
});
```

---

## What is .style()?

`.style()` lets you update **inline CSS styles** on multiple elements in a single call. Each element gets its own style object with one or more CSS properties.

Simply put, it's like writing `element.style.color = "red"` — but for **many elements and many properties at once**.

---

## Syntax

```javascript
Elements.style(updates)   // Returns Elements (chainable)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `updates` | Object | Keys = element IDs, Values = style objects |

Each value is an object of CSS properties in **camelCase**:

```javascript
Elements.style({
  elementId: {
    cssPropertyInCamelCase: "value",
    anotherProperty: "value"
  }
});
```

---

## CSS Property Names: camelCase

JavaScript uses camelCase for CSS properties. Here's a quick reference:

| CSS Property | JavaScript (camelCase) |
|-------------|----------------------|
| `background-color` | `backgroundColor` |
| `font-size` | `fontSize` |
| `text-align` | `textAlign` |
| `border-radius` | `borderRadius` |
| `z-index` | `zIndex` |
| `margin-top` | `marginTop` |
| `padding` | `padding` (no change) |
| `color` | `color` (no change) |

---

## Basic Examples

### Example 1: Style a Layout

```javascript
Elements.style({
  header: {
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "20px"
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#ecf0f1"
  },
  mainContent: {
    marginLeft: "250px",
    padding: "20px"
  }
});
```

### Example 2: Highlight an Element

```javascript
Elements.style({
  selectedRow: {
    backgroundColor: "#ffeb3b",
    fontWeight: "bold",
    border: "2px solid #f57f17"
  }
});
```

### Example 3: Single Property on Multiple Elements

```javascript
// Set the same color on multiple elements
Elements.style({
  title: { color: "blue" },
  subtitle: { color: "blue" },
  caption: { color: "blue" }
});
```

### Example 4: Reset Styles

```javascript
// Clear inline styles by setting to empty string
Elements.style({
  header: { backgroundColor: "", color: "", padding: "" }
});
```

---

## How It Works Under the Hood

```
Elements.style({ header: { color: "red", fontSize: "20px" } })
   ↓
1️⃣ Loop through entries:
   └── key: "header", value: { color: "red", fontSize: "20px" }
       ├── Look up: Elements.header → <div id="header">
       ├── Has .update()? → Yes
       └── Call: element.update({ style: { color: "red", fontSize: "20px" } })
   ↓
2️⃣ Return Elements (for chaining)
```

If `.update()` isn't available, the method falls back to setting styles directly:

```
element.style.color = "red";
element.style.fontSize = "20px";
```

---

## Real-World Examples

### Example 1: Theme Switcher

```javascript
function applyTheme(theme) {
  if (theme === 'dark') {
    Elements.style({
      body: { backgroundColor: "#1a1a1a", color: "#e0e0e0" },
      header: { backgroundColor: "#333", borderBottom: "1px solid #555" },
      sidebar: { backgroundColor: "#2a2a2a" },
      card: { backgroundColor: "#333", boxShadow: "0 2px 8px rgba(0,0,0,0.5)" }
    });
  } else {
    Elements.style({
      body: { backgroundColor: "#ffffff", color: "#333" },
      header: { backgroundColor: "#f8f8f8", borderBottom: "1px solid #ddd" },
      sidebar: { backgroundColor: "#fafafa" },
      card: { backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }
    });
  }
}
```

### Example 2: Responsive Sidebar Toggle

```javascript
function toggleSidebar(isOpen) {
  if (isOpen) {
    Elements.style({
      sidebar: { width: "250px", opacity: "1" },
      mainContent: { marginLeft: "250px" },
      overlay: { display: "block", opacity: "0.5" }
    });
  } else {
    Elements.style({
      sidebar: { width: "0px", opacity: "0" },
      mainContent: { marginLeft: "0px" },
      overlay: { display: "none", opacity: "0" }
    });
  }
}
```

### Example 3: Progress Indicator

```javascript
function updateProgress(percent) {
  Elements.style({
    progressBar: { width: `${percent}%` },
    progressLabel: { color: percent === 100 ? "green" : "#333" }
  });

  Elements.textContent({
    progressLabel: `${percent}% complete`
  });
}

updateProgress(75);
```

---

## Validation

The `.style()` method expects an **object** for each element's styles. If you pass a non-object value, you'll get a warning:

```javascript
// ❌ Wrong — style expects an object, not a string
Elements.style({
  header: "color: red"
});
// Console: [DOM Helpers] style() requires style object for 'header'

// ✅ Correct — pass an object
Elements.style({
  header: { color: "red" }
});
```

---

## Chaining

```javascript
Elements
  .style({
    header: { backgroundColor: "navy", color: "white" },
    footer: { backgroundColor: "#eee" }
  })
  .textContent({ header: "My App", footer: "© 2024" })
  .classes({ header: { add: ["sticky"] } });
```

---

## Summary

| Aspect | Detail |
|--------|--------|
| **What** | Updates inline CSS styles on multiple elements |
| **Input** | Object: keys = element IDs, values = style objects |
| **Style format** | camelCase property names: `{ backgroundColor: "red" }` |
| **Returns** | Elements (chainable) |
| **Under the hood** | Uses `element.update({ style: {...} })` |
| **Reset a style** | Set the property to empty string: `{ color: "" }` |

> **Simple Rule to Remember:** Pass an object of style objects. Each key is an element ID, each value is a `{ property: "value" }` style object using camelCase property names. Chain `.style()` with other bulk methods to fully set up elements in a single expression.