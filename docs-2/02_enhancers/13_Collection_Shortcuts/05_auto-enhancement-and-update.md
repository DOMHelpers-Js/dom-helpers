[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Auto-Enhancement — Elements Get .update() Automatically

## Quick Start (30 seconds)

```javascript
// Access an element by index — it already has .update()
ClassName.btn[0].update({
  textContent: "Click Me!",
  style: { backgroundColor: "blue", color: "white" }
});

// No manual enhancement needed — it just works
TagName.input[0].update({
  value: "john@example.com",
  placeholder: "Enter your email"
});
```

---

## What is Auto-Enhancement?

When you access an element through a Collection Shortcut using an **index** (like `ClassName.btn[0]` or `TagName.div[-1]`), the element is **automatically enhanced** with the `.update()` method. You don't need to do anything special — the element comes ready to use with the full update system.

Simply put, **every element you pick by index already has `.update()` attached** — the Collection Shortcuts module handles this for you.

---

## How Does It Work?

```
ClassName.btn[0]
   ↓
1️⃣ Collection Shortcuts proxy intercepts index access
   ↓
2️⃣ Gets the raw DOM element at index 0
   ↓
3️⃣ Checks: Is EnhancedUpdateUtility available?
   ├── Yes → enhanceElementWithUpdate(element)
   │         └── Adds .update() method to the element
   └── No  → Returns the element as-is
   ↓
4️⃣ Returns the enhanced element
   ↓
You can now call: element.update({ ... })
```

---

## What Can .update() Do?

The `.update()` method on enhanced elements supports all the update types from the core library:

```javascript
const btn = ClassName.btn[0];

// Text content
btn.update({ textContent: "Click Me" });

// HTML content
btn.update({ innerHTML: "<strong>Bold</strong> text" });

// Styles
btn.update({ style: { color: "red", fontSize: "18px" } });

// Classes
btn.update({ classList: { add: ['active'], remove: ['hidden'] } });

// Attributes
btn.update({ setAttribute: { 'aria-label': 'Submit form' } });

// Data attributes
btn.update({ dataset: { action: 'submit', target: 'form1' } });

// Properties
btn.update({ disabled: true });
btn.update({ hidden: false });
btn.update({ value: "Hello" });

// Multiple updates at once
btn.update({
  textContent: "Submit",
  style: { backgroundColor: "green", color: "white" },
  classList: { add: ['primary'] },
  disabled: false
});
```

---

## Collection Access vs Index Access

Important: auto-enhancement only happens when you access by **index**, not when you get the whole collection:

```javascript
// Collection — elements are NOT individually enhanced yet
const buttons = ClassName.btn;
// buttons is a collection, not a single element

// Index access — element IS enhanced with .update()
const firstBtn = ClassName.btn[0];
firstBtn.update({ textContent: "Enhanced!" });  // ✅ Works

// Iterating — elements get enhanced when accessed by index
const buttons = ClassName.btn;
for (let i = 0; i < buttons.length; i++) {
  buttons[i].update({                            // ✅ Works — index access
    textContent: `Button ${i + 1}`
  });
}
```

### With forEach

```javascript
// forEach gives you the raw element — but you can still use .update()
// if the element was enhanced through the core library
ClassName.btn.forEach((btn, index) => {
  // btn here may or may not have .update() depending on prior access
  // For guaranteed enhancement, use index access:
});

// Guaranteed enhancement:
const buttons = ClassName.btn;
for (let i = 0; i < buttons.length; i++) {
  buttons[i].update({                // ✅ Always enhanced via index
    style: { color: i === 0 ? "red" : "blue" }
  });
}
```

---

## Real-World Examples

### Example 1: Update First and Last

```javascript
// First and last buttons — both auto-enhanced
ClassName.btn[0].update({
  textContent: "Start",
  style: { backgroundColor: "green" }
});

ClassName.btn[-1].update({
  textContent: "End",
  style: { backgroundColor: "red" }
});
```

### Example 2: Form Field Setup

```javascript
// Set up each input field
Name.firstName[0].update({
  value: "",
  placeholder: "Enter first name",
  setAttribute: { required: 'true' }
});

Name.lastName[0].update({
  value: "",
  placeholder: "Enter last name",
  setAttribute: { required: 'true' }
});

Name.email[0].update({
  value: "",
  placeholder: "you@example.com",
  setAttribute: { type: 'email', required: 'true' }
});
```

### Example 3: Dynamic Content Cards

```javascript
const cards = ClassName.card;

for (let i = 0; i < cards.length; i++) {
  cards[i].update({
    dataset: { index: String(i) },
    style: {
      animationDelay: `${i * 100}ms`
    },
    classList: { add: ['fade-in'] }
  });
}
```

### Example 4: Table Header and Rows

```javascript
// Style the header differently
TagName.th[0].update({
  style: { backgroundColor: "#2c3e50", color: "white" }
});

// Style all data cells
const cells = TagName.td;
for (let i = 0; i < cells.length; i++) {
  cells[i].update({
    style: { padding: "8px", borderBottom: "1px solid #eee" }
  });
}
```

---

## What Happens If EnhancedUpdateUtility Isn't Available?

If the update utility isn't loaded (for example, if only the Collections Shortcuts module is loaded without the full core), elements are still returned — they just won't have the `.update()` method:

```javascript
// Without EnhancedUpdateUtility:
const btn = ClassName.btn[0];
btn.textContent = "Hello";           // ✅ Regular DOM works
// btn.update({ textContent: "Hello" });  ← .update() not available

// With EnhancedUpdateUtility (normal setup):
const btn = ClassName.btn[0];
btn.update({ textContent: "Hello" }); // ✅ Works
```

In a standard DOM Helpers setup (core library loaded first), the update utility is always available.

---

## Summary

| Aspect | Detail |
|--------|--------|
| **What** | Elements accessed by index automatically get `.update()` |
| **When** | Only when accessing by index: `collection[0]`, `collection[-1]` |
| **How** | The Proxy intercepts index access and calls `enhanceElementWithUpdate()` |
| **Requirement** | Core library must be loaded for `.update()` to be available |
| **Without core** | Elements are still returned, just without `.update()` |

> **Simple Rule to Remember:** Any element you get through `ClassName.btn[0]` or `TagName.div[-1]` already has `.update()` — no extra steps needed. Just access by index and start using `.update()` immediately.