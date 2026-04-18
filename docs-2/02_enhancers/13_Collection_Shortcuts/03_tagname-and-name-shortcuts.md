[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# TagName and Name — Access Elements by Tag or Name Attribute

## Quick Start (30 seconds)

```javascript
// TagName — find elements by HTML tag
TagName.div                  // All <div> elements
TagName.button               // All <button> elements
TagName.input                // All <input> elements
TagName.p[0]                 // First <p> element
TagName.tr[-1]               // Last <tr> element

// Name — find elements by name attribute
Name.email                   // All elements with name="email"
Name.username                // All elements with name="username"
Name.email[0]                // First email field
Name.country[-1]             // Last country selector
```

---

## TagName — Find Elements by HTML Tag

### What is TagName?

`TagName` is a global shortcut for `Collections.TagName`. It returns all elements of a specific **HTML tag type** — like all `<div>` elements, all `<button>` elements, or all `<input>` elements.

### Syntax

```javascript
TagName.div                  // All <div> elements
TagName.p                    // All <p> elements
TagName.button               // All <button> elements
TagName.input                // All <input> elements
TagName.img                  // All <img> elements
TagName.a                    // All <a> elements
TagName.tr                   // All <tr> elements
TagName.li                   // All <li> elements

// Function call also works
TagName('div')               // Same as TagName.div
```

**Returns:** An enhanced collection with index and negative index support.

### Common Tag Names

| TagName | Finds |
|---------|-------|
| `TagName.div` | All `<div>` elements |
| `TagName.p` | All `<p>` paragraphs |
| `TagName.span` | All `<span>` elements |
| `TagName.button` | All `<button>` elements |
| `TagName.input` | All `<input>` elements |
| `TagName.a` | All `<a>` anchor/link elements |
| `TagName.img` | All `<img>` images |
| `TagName.li` | All `<li>` list items |
| `TagName.tr` | All `<tr>` table rows |
| `TagName.td` | All `<td>` table cells |
| `TagName.h1` | All `<h1>` headings |
| `TagName.form` | All `<form>` elements |

### TagName Examples

#### Style All Paragraphs

```javascript
const paragraphs = TagName.p;

paragraphs.forEach((p, index) => {
  p.update({
    style: { lineHeight: "1.6", marginBottom: "16px" }
  });
});
```

#### Alternate Table Row Colors

```javascript
const rows = TagName.tr;

// Skip the header row (index 0), style data rows
for (let i = 1; i < rows.length; i++) {
  rows[i].update({
    style: {
      backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#ffffff"
    }
  });
}

// Style the header row
rows[0].update({
  style: { backgroundColor: "#333", color: "white", fontWeight: "bold" }
});

// Style the footer row
rows[-1].update({
  style: { backgroundColor: "#e0e0e0", fontStyle: "italic" }
});
```

#### Lazy Load All Images

```javascript
const images = TagName.img;

images.forEach(img => {
  img.update({
    setAttribute: { loading: "lazy" }
  });
});
```

#### Disable All Buttons

```javascript
const buttons = TagName.button;

buttons.forEach(btn => {
  btn.update({ disabled: true });
});

// Re-enable just the first one
buttons[0].update({ disabled: false });
```

---

## Name — Find Elements by Name Attribute

### What is Name?

`Name` is a global shortcut for `Collections.Name`. It returns all elements that have a specific `name` attribute — commonly used for form fields, radio buttons, and other form elements.

### Syntax

```javascript
Name.username                // All elements with name="username"
Name.email                   // All elements with name="email"
Name.password                // All elements with name="password"
Name.gender                  // All elements with name="gender" (radio group)

// Function call also works
Name('email')                // Same as Name.email
```

**Returns:** An enhanced collection with index and negative index support.

### What Has a Name Attribute?

The `name` attribute is commonly found on:

| Element | Example HTML |
|---------|-------------|
| Text inputs | `<input type="text" name="username">` |
| Email inputs | `<input type="email" name="email">` |
| Radio buttons | `<input type="radio" name="gender">` |
| Checkboxes | `<input type="checkbox" name="agree">` |
| Select dropdowns | `<select name="country">` |
| Textareas | `<textarea name="message">` |
| Hidden fields | `<input type="hidden" name="token">` |

### Name Examples

#### Access Form Fields

```javascript
// Get the first (and usually only) username input
const usernameField = Name.username[0];

usernameField.update({
  value: "john_doe",
  placeholder: "Enter your username"
});
```

#### Work with Radio Button Groups

Radio buttons with the same `name` form a group:

```html
<input type="radio" name="color" value="red"> Red
<input type="radio" name="color" value="blue"> Blue
<input type="radio" name="color" value="green"> Green
```

```javascript
const colorOptions = Name.color;
console.log(colorOptions.length);  // 3

// Select the second option
colorOptions[1].update({ checked: true });

// Find which one is selected
colorOptions.forEach(radio => {
  if (radio.checked) {
    console.log('Selected:', radio.value);
  }
});
```

#### Pre-fill a Form

```javascript
function prefillForm(data) {
  if (Name.firstName.length > 0) {
    Name.firstName[0].update({ value: data.first });
  }
  if (Name.lastName.length > 0) {
    Name.lastName[0].update({ value: data.last });
  }
  if (Name.email.length > 0) {
    Name.email[0].update({ value: data.email });
  }
}

prefillForm({
  first: "Alice",
  last: "Smith",
  email: "alice@example.com"
});
```

#### Validate Form Fields

```javascript
function validateEmail() {
  const emailField = Name.email[0];
  const value = emailField.value;

  if (!value.includes('@')) {
    emailField.update({
      style: { borderColor: "red" }
    });
    return false;
  }

  emailField.update({
    style: { borderColor: "green" }
  });
  return true;
}
```

---

## TagName vs ClassName vs Name — When to Use Which

| Shortcut | Best For | Example |
|----------|---------|---------|
| `ClassName` | Finding elements by their CSS styling class | `ClassName.card`, `ClassName['btn-primary']` |
| `TagName` | Finding all elements of a specific HTML type | `TagName.input`, `TagName.tr`, `TagName.img` |
| `Name` | Finding form fields by their name attribute | `Name.email`, `Name.gender`, `Name.username` |

```javascript
// ClassName — "Find all cards"
ClassName.card

// TagName — "Find all buttons on the page"
TagName.button

// Name — "Find the email input field"
Name.email[0]
```

### Quick Decision Guide

```
What do you want to find?
   ├── Elements with a specific CSS class?  → ClassName
   ├── All elements of a specific tag?      → TagName
   └── Form fields by their name?           → Name
```

---

## All Three Share the Same Features

Everything covered in the ClassName documentation applies equally to TagName and Name:

| Feature | ClassName | TagName | Name |
|---------|----------|---------|------|
| Dot notation | ✅ `ClassName.btn` | ✅ `TagName.div` | ✅ `Name.email` |
| Bracket notation | ✅ `ClassName['nav-item']` | ✅ `TagName['div']` | ✅ `Name['user-name']` |
| Function call | ✅ `ClassName('btn')` | ✅ `TagName('div')` | ✅ `Name('email')` |
| Positive index | ✅ `[0]`, `[1]`, `[2]` | ✅ `[0]`, `[1]`, `[2]` | ✅ `[0]`, `[1]`, `[2]` |
| Negative index | ✅ `[-1]`, `[-2]` | ✅ `[-1]`, `[-2]` | ✅ `[-1]`, `[-2]` |
| Auto-enhancement | ✅ `.update()` | ✅ `.update()` | ✅ `.update()` |
| Live collection | ✅ | ✅ | ✅ |

---

## Summary

| Shortcut | What It Finds | Equivalent To |
|----------|--------------|---------------|
| `ClassName.btn` | Elements with class `"btn"` | `Collections.ClassName.btn` |
| `TagName.div` | All `<div>` elements | `Collections.TagName.div` |
| `Name.email` | Elements with `name="email"` | `Collections.Name.email` |

> **Simple Rule to Remember:** `ClassName` finds by CSS class, `TagName` finds by HTML tag, `Name` finds by the name attribute. All three support index access (`[0]`, `[-1]`) and auto-enhance elements with `.update()`.