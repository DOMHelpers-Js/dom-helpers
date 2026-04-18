[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Collection Shortcuts — Introduction

## Quick Start (30 seconds)

```javascript
// Instead of typing Collections.ClassName.btn...
// Just type:
ClassName.btn              // All elements with class "btn"
TagName.div                // All <div> elements
Name.email                 // All elements with name="email"

// Access specific elements by index
ClassName.btn[0]           // First button
ClassName.btn[-1]          // Last button
TagName.p[2]               // Third paragraph
```

---

## What Are Collection Shortcuts?

Collection Shortcuts are **global variables** — `ClassName`, `TagName`, and `Name` — that give you direct access to DOM collections **without** the `Collections.` prefix. They also add **index-based element selection**, including negative indices to count from the end.

Simply put, they're **shorter names** for things you already do with `Collections`, plus the ability to pick out individual elements by position.

---

## Why Do Collection Shortcuts Exist?

### The Verbose Way

With the core library, accessing collections requires the full `Collections.` prefix every time:

```javascript
// ❌ Repetitive — typing "Collections." over and over
const buttons = Collections.ClassName.btn;
const inputs = Collections.TagName.input;
const fields = Collections.Name.email;

const first = Collections.ClassName.btn[0];
const last = Collections.ClassName.btn[Collections.ClassName.btn.length - 1];
```

That's a lot of `Collections.` for something you do constantly.

### The Shortcut Way

```javascript
// ✅ Clean — globals accessible everywhere
const buttons = ClassName.btn;
const inputs = TagName.input;
const fields = Name.email;

const first = ClassName.btn[0];
const last = ClassName.btn[-1];    // Negative index — no length calculation needed
```

---

## Mental Model: A Direct Phone Line

Think of `Collections.ClassName` as going through a **switchboard** — you call the main number and ask to be connected:

```
You → Collections (switchboard) → ClassName → .btn → collection
```

Collection Shortcuts are like **direct phone lines** — you dial directly:

```
You → ClassName.btn → collection
```

Same destination, fewer steps.

---

## The Three Shortcuts

| Shortcut | Finds Elements By | Equivalent To |
|----------|------------------|---------------|
| `ClassName` | CSS class name | `Collections.ClassName` |
| `TagName` | HTML tag name | `Collections.TagName` |
| `Name` | `name` attribute | `Collections.Name` |

```javascript
// These pairs are equivalent:
ClassName.btn       ===  Collections.ClassName.btn
TagName.div         ===  Collections.TagName.div
Name.username       ===  Collections.Name.username
```

---

## Key Features at a Glance

### 1. Global Access — No Prefix Needed

```javascript
ClassName.card          // Instead of Collections.ClassName.card
TagName.button          // Instead of Collections.TagName.button
Name.email              // Instead of Collections.Name.email
```

### 2. Index Access — Pick Any Element by Position

```javascript
ClassName.btn[0]        // First element
ClassName.btn[1]        // Second element
ClassName.btn[2]        // Third element
```

### 3. Negative Indices — Count from the End

```javascript
ClassName.btn[-1]       // Last element
ClassName.btn[-2]       // Second to last
ClassName.btn[-3]       // Third from end
```

### 4. Auto-Enhancement — Elements Get .update()

```javascript
// Elements accessed by index are automatically enhanced
ClassName.btn[0].update({
  textContent: "Click Me",
  style: { backgroundColor: "blue" }
});
```

### 5. Function-Style Calls Still Work

```javascript
ClassName('btn')        // Same as ClassName.btn
TagName('div')          // Same as TagName.div
Name('username')        // Same as Name.username
```

### 6. Backwards Compatible

The original `Collections.ClassName`, `Collections.TagName`, and `Collections.Name` API remains unchanged. Shortcuts are an addition, not a replacement.

---

## How Does It Work?

When you access `ClassName.btn`, here's what happens:

```
ClassName.btn
   ↓
1️⃣ ClassName is a Proxy object
   ↓
2️⃣ Property access "btn" is intercepted
   ↓
3️⃣ Forwarded to: Collections.ClassName.btn
   ↓
4️⃣ Returns an enhanced collection wrapper
   └── Same collection, but with index support and negative indices
   ↓
5️⃣ If you access an index: ClassName.btn[0]
   ├── Positive index → returns element at that position
   ├── Negative index → calculates from end (length + index)
   └── Element is auto-enhanced with .update() method
```

---

## This Module Is an Enhancer

Collection Shortcuts is loaded as a separate script after the core library:

```html
<!-- 1. Core library first -->
<script src="01_dh-core.js"></script>

<!-- 2. Collection shortcuts enhancer -->
<script src="02_dh-collection-shortcuts.js"></script>

<!-- 3. Your code — globals are now available -->
<script>
  ClassName.btn[0].update({ textContent: "Ready!" });
</script>
```

The module requires `Collections` to exist — it builds on top of the core Collections helper.

---

## Integration with DOMHelpers

The shortcuts are also attached to the `DOMHelpers` global object:

```javascript
DOMHelpers.ClassName.btn      // Same as ClassName.btn
DOMHelpers.TagName.div        // Same as TagName.div
DOMHelpers.Name.email         // Same as Name.email
```

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | Global shortcuts for `Collections.ClassName`, `Collections.TagName`, `Collections.Name` |
| **Why** | Less typing, cleaner code |
| **Index access** | `ClassName.btn[0]` for first, `ClassName.btn[-1]` for last |
| **Auto-enhancement** | Elements accessed by index automatically have `.update()` |
| **Function calls** | `ClassName('btn')` still works alongside `ClassName.btn` |
| **Backwards compatible** | `Collections.*` API is unchanged |
| **Module type** | Enhancer — requires the core library loaded first |

> **Simple Rule to Remember:** `ClassName`, `TagName`, and `Name` are shorter versions of `Collections.ClassName`, `Collections.TagName`, and `Collections.Name`. Use `[0]` for the first element, `[-1]` for the last, and any number in between.