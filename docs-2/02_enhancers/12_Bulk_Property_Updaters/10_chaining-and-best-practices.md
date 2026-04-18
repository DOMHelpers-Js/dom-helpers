[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Method Chaining & Best Practices

## Quick Start (30 seconds)

```javascript
// Chain multiple bulk methods together
Elements
  .textContent({ title: "Dashboard", subtitle: "Welcome back" })
  .style({ title: { color: "navy", fontSize: "28px" } })
  .classes({ title: { add: ["active"] } })
  .hidden({ loadingSpinner: true })
  .disabled({ submitBtn: false });
```

---

## How Chaining Works

Every bulk method returns the **helper object itself** (`Elements` or the collection), which lets you call another method immediately:

```
Elements.textContent({ title: "Hello" })  → returns Elements
  .style({ title: { color: "red" } })     → returns Elements
  .classes({ title: { add: ["bold"] } })   → returns Elements
```

This works because each method ends with `return this`.

---

## Chaining on Elements

```javascript
Elements
  .textContent({
    heading: "My App",
    footer: "© 2024"
  })
  .style({
    heading: { fontSize: "32px", color: "#333" },
    footer: { fontSize: "12px", color: "#999" }
  })
  .hidden({
    loadingOverlay: true
  })
  .disabled({
    submitBtn: false,
    resetBtn: false
  });
```

---

## Chaining on Collections

```javascript
Collections.ClassName.btn
  .textContent({
    0: "Save",
    1: "Cancel",
    2: "Delete"
  })
  .style({
    0: { backgroundColor: "green" },
    1: { backgroundColor: "gray" },
    2: { backgroundColor: "red" }
  })
  .classes({
    0: { add: ["primary"] },
    2: { add: ["danger"] }
  });
```

---

## Real-World Chaining Patterns

### Pattern 1: Page Setup

```javascript
function setupDashboard(user) {
  Elements
    .textContent({
      userName: user.name,
      userEmail: user.email,
      pageTitle: "Dashboard"
    })
    .src({
      userAvatar: user.avatarUrl
    })
    .alt({
      userAvatar: `${user.name}'s photo`
    })
    .hidden({
      loginPrompt: true,
      dashboardContent: false
    });
}
```

### Pattern 2: Form State Transition

```javascript
function setFormToSubmitting() {
  Elements
    .disabled({ submitBtn: true, cancelBtn: true, nameInput: true, emailInput: true })
    .hidden({ spinner: false, submitLabel: true })
    .classes({ submitBtn: { add: ["loading"] } });
}

function setFormToReady() {
  Elements
    .disabled({ submitBtn: false, cancelBtn: false, nameInput: false, emailInput: false })
    .hidden({ spinner: true, submitLabel: false })
    .classes({ submitBtn: { remove: ["loading"] } });
}
```

### Pattern 3: Notification Card

```javascript
function showNotification(type, message) {
  Elements
    .textContent({ notificationText: message })
    .classes({
      notificationCard: `notification notification-${type}`
    })
    .hidden({ notificationCard: false })
    .style({
      notificationCard: { opacity: "1" }
    });
}

showNotification('success', 'File uploaded!');
```

---

## Best Practices

### 1. Group Related Updates Together

Update related elements in the same chain:

```javascript
// ✅ Good — related updates in one chain
Elements
  .textContent({ title: "Products", count: "42 items" })
  .style({ title: { color: "#333" }, count: { color: "#666" } });

// ❌ Less readable — same updates scattered
Elements.textContent({ title: "Products" });
Elements.style({ title: { color: "#333" } });
Elements.textContent({ count: "42 items" });
Elements.style({ count: { color: "#666" } });
```

### 2. Use Dedicated Methods Over .prop()

Prefer the specialized method when one exists:

```javascript
// ✅ Clear intent
Elements.disabled({ submitBtn: true });
Elements.textContent({ title: "Hello" });

// Less clear (but works)
Elements.prop("disabled", { submitBtn: true });
Elements.prop("textContent", { title: "Hello" });
```

### 3. Use textContent for User Input, innerHTML for Trusted Content

```javascript
// ✅ Safe — user input displayed as plain text
Elements.textContent({ commentDisplay: userComment });

// ⚠️ Only for trusted HTML
Elements.innerHTML({ templateArea: trustedTemplate });
```

### 4. Create Reusable State Functions

Group your updates into named functions for common states:

```javascript
function showLoadingState() {
  Elements
    .hidden({ spinner: false, content: true, error: true })
    .disabled({ submitBtn: true })
    .textContent({ statusText: "Loading..." });
}

function showContentState() {
  Elements
    .hidden({ spinner: true, content: false, error: true })
    .disabled({ submitBtn: false })
    .textContent({ statusText: "" });
}

function showErrorState(message) {
  Elements
    .hidden({ spinner: true, content: true, error: false })
    .disabled({ submitBtn: false })
    .textContent({ errorText: message });
}
```

### 5. Keep Update Objects Small and Focused

```javascript
// ✅ Focused — each method handles one concern
Elements
  .textContent({ title: "Hello", subtitle: "World" })
  .style({ title: { color: "blue" } });

// ❌ Avoid mixing too many unrelated elements in one call
Elements.textContent({
  title: "Hello",
  subtitle: "World",
  footerLeft: "Links",
  footerRight: "© 2024",
  sidebarTitle: "Menu",
  sidebarSubtitle: "Navigation",
  // ... 20 more elements
});
```

---

## Loading the Enhancer

The Bulk Property Updaters module is loaded as a separate script after the DOM Helpers core:

```html
<!-- 1. Core library first -->
<script src="01_dh-core.js"></script>

<!-- 2. Bulk Property Updaters enhancer -->
<script src="01_dh-bulk-property-updaters.js"></script>

<!-- 3. Your code -->
<script>
  // Bulk methods are now available
  Elements.textContent({ title: "Ready!" });
</script>
```

The enhancer auto-initializes. If the core library is already loaded, methods are available immediately. If not, it waits for `DOMContentLoaded` before initializing.

---

## Quick Reference: All Bulk Methods

### Elements Methods (by ID)

| Method | Value Type | Example |
|--------|-----------|---------|
| `.textContent()` | String | `{ id: "text" }` |
| `.innerHTML()` | String (HTML) | `{ id: "<b>html</b>" }` |
| `.innerText()` | String | `{ id: "text" }` |
| `.value()` | String | `{ id: "input value" }` |
| `.placeholder()` | String | `{ id: "hint text" }` |
| `.title()` | String | `{ id: "tooltip" }` |
| `.disabled()` | Boolean | `{ id: true }` |
| `.checked()` | Boolean | `{ id: true }` |
| `.readonly()` | Boolean | `{ id: true }` |
| `.hidden()` | Boolean | `{ id: true }` |
| `.selected()` | Boolean | `{ id: true }` |
| `.src()` | String (URL) | `{ id: "image.jpg" }` |
| `.href()` | String (URL) | `{ id: "/page" }` |
| `.alt()` | String | `{ id: "description" }` |
| `.style()` | Object | `{ id: { color: "red" } }` |
| `.dataset()` | Object | `{ id: { key: "value" } }` |
| `.attrs()` | Object | `{ id: { attr: "value" } }` |
| `.classes()` | String or Object | `{ id: "cls" }` or `{ id: { add: ["cls"] } }` |
| `.prop()` | Any | `Elements.prop("path", { id: value })` |

### Collections Methods (by Index)

| Method | Value Type |
|--------|-----------|
| `.textContent()` | `{ 0: "text" }` |
| `.innerHTML()` | `{ 0: "<b>html</b>" }` |
| `.value()` | `{ 0: "value" }` |
| `.style()` | `{ 0: { color: "red" } }` |
| `.dataset()` | `{ 0: { key: "val" } }` |
| `.classes()` | `{ 0: "cls" }` or `{ 0: { add: [...] } }` |

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **Chaining** | Every bulk method returns the helper — chain as many as you need |
| **Readability** | Group related updates together in a single chain |
| **Safety** | Use `.textContent()` for user input, `.innerHTML()` only for trusted HTML |
| **Reusability** | Create named functions for common UI states |
| **Dedicated methods** | Prefer `.disabled()` over `.prop("disabled")` when available |
| **Loading** | Load the enhancer script after the core library |

> **Simple Rule to Remember:** Chain bulk methods to set up or transition entire UI states in a single expression. Each method handles one property type — combine them to fully configure multiple elements at once. Keep chains focused and readable.