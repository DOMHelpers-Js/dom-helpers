[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Elements Text & Content Updaters — .textContent(), .innerHTML(), .innerText()

## Quick Start (30 seconds)

```javascript
// Update text on multiple elements at once
Elements.textContent({
  heading: "Welcome to My App",
  description: "Start building amazing things",
  footer: "© 2024 Company"
});
```

---

## What Are These Methods?

These three methods let you update the **text or HTML content** of multiple elements in a single call:

| Method | What It Sets | Interprets HTML? |
|--------|-------------|-----------------|
| `.textContent()` | Plain text (safe — no HTML parsing) | ❌ No — HTML tags shown as text |
| `.innerHTML()` | HTML content (renders HTML tags) | ✅ Yes — HTML tags are rendered |
| `.innerText()` | Visible text (respects CSS visibility) | ❌ No — HTML tags shown as text |

---

## Syntax

```javascript
Elements.textContent(updates)   // Returns Elements (chainable)
Elements.innerHTML(updates)     // Returns Elements (chainable)
Elements.innerText(updates)     // Returns Elements (chainable)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `updates` | Object | Keys = element IDs, Values = new content |

---

## .textContent() — Safe Plain Text

Sets the **raw text content** of elements. HTML tags are **not** interpreted — they appear as literal text. This is the **safest** option for user-generated content.

```javascript
Elements.textContent({
  title: "Hello World",
  message: "Your order is ready",
  count: "5 items"
});
```

### HTML Is Escaped

```javascript
// HTML tags are shown as text, not rendered
Elements.textContent({
  output: "<strong>Bold?</strong>"
});
// The element displays: <strong>Bold?</strong>  (as visible text)
```

### When to Use textContent

- Displaying user input (safe from XSS attacks)
- Setting labels, headings, status text
- Any time you want plain text without HTML

---

## .innerHTML() — Rendered HTML

Sets the **HTML content** of elements. HTML tags **are** interpreted and rendered.

```javascript
Elements.innerHTML({
  container: "<h2>Section Title</h2><p>Some content here</p>",
  sidebar: "<ul><li>Item 1</li><li>Item 2</li></ul>",
  badge: "<span class='count'>5</span>"
});
```

### HTML Is Rendered

```javascript
Elements.innerHTML({
  output: "<strong>Bold!</strong>"
});
// The element displays: Bold!  (with bold formatting)
```

### When to Use innerHTML

- Inserting structured HTML content
- Rendering templates or formatted content
- Building UI sections dynamically

### Security Note

Never use `.innerHTML()` with **untrusted user input**. It can execute scripts and create security vulnerabilities:

```javascript
// ❌ Dangerous — user could inject scripts
const userInput = '<img src=x onerror="alert(1)">';
Elements.innerHTML({ output: userInput });

// ✅ Safe — use textContent for user input
Elements.textContent({ output: userInput });
// Shows the raw text, no script execution
```

---

## .innerText() — Visible Text

Sets the **visible text** of elements. Similar to `textContent`, but respects CSS visibility and layout.

```javascript
Elements.innerText({
  heading: "Welcome!",
  paragraph: "This is some text"
});
```

### textContent vs innerText

| Aspect | `.textContent()` | `.innerText()` |
|--------|-----------------|---------------|
| Hidden elements | Includes hidden text | Excludes hidden text |
| CSS awareness | Ignores CSS | Respects CSS layout |
| Performance | Faster | Slightly slower (triggers reflow) |
| Use case | General purpose | When CSS visibility matters |

For most cases, `.textContent()` is the better choice — it's faster and more predictable.

---

## Basic Examples

### Example 1: Update a Page Layout

```javascript
Elements.textContent({
  pageTitle: "Dashboard",
  userName: "Alice",
  lastLogin: "Today at 3:45 PM",
  notificationCount: "3 new"
});
```

### Example 2: Build a Card with HTML

```javascript
Elements.innerHTML({
  cardBody: `
    <h3>Product Name</h3>
    <p class="price">$29.99</p>
    <button class="btn">Add to Cart</button>
  `
});
```

### Example 3: Update Status Messages

```javascript
function showStatus(type, message) {
  if (type === 'success') {
    Elements.innerHTML({
      statusBar: `<span class="success">✅ ${message}</span>`
    });
  } else {
    Elements.innerHTML({
      statusBar: `<span class="error">❌ ${message}</span>`
    });
  }
}

showStatus('success', 'File uploaded successfully');
```

### Example 4: Clear Multiple Elements

```javascript
// Set all to empty text
Elements.textContent({
  heading: "",
  description: "",
  footer: ""
});
```

---

## How It Works Under the Hood

```
Elements.textContent({ title: "Hello", footer: "Bye" })
   ↓
For each entry in the object:
   ├── "title" → "Hello"
   │   ├── Look up: Elements.title → <h1 id="title">
   │   ├── Has .update()? → Yes
   │   └── Call: element.update({ textContent: "Hello" })
   │
   └── "footer" → "Bye"
       ├── Look up: Elements.footer → <footer id="footer">
       ├── Has .update()? → Yes
       └── Call: element.update({ textContent: "Bye" })
   ↓
Return Elements (for chaining)
```

If `.update()` isn't available on the element, the method falls back to direct assignment: `element.textContent = "Hello"`.

---

## Chaining

All three methods return `Elements`, so you can chain them with other bulk methods:

```javascript
Elements
  .textContent({ title: "Welcome" })
  .style({ title: { color: "blue", fontSize: "24px" } })
  .classes({ title: { add: ["active"] } });
```

---

## Error Handling

If an element ID doesn't exist, the method warns you and continues:

```javascript
Elements.textContent({
  realElement: "This works",
  missingOne: "Warning logged, skipped",
  anotherReal: "This also works"
});
// Console: [DOM Helpers] Element 'missingOne' not found for textContent update
```

---

## Summary

| Method | Sets | HTML Rendered? | Safe for User Input? |
|--------|------|---------------|---------------------|
| `.textContent()` | Raw text | ❌ No | ✅ Yes |
| `.innerHTML()` | HTML content | ✅ Yes | ❌ No — use with caution |
| `.innerText()` | Visible text | ❌ No | ✅ Yes |

> **Simple Rule to Remember:** Use `.textContent()` for safe plain text (most common). Use `.innerHTML()` when you need to render HTML tags. Avoid `.innerHTML()` with user input — use `.textContent()` instead.