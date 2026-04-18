[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Elements Form & State Updaters — .value(), .placeholder(), .disabled(), .checked(), .readonly(), .hidden(), .selected()

## Quick Start (30 seconds)

```javascript
// Fill form fields
Elements.value({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com"
});

// Disable buttons while processing
Elements.disabled({
  submitBtn: true,
  cancelBtn: true
});
```

---

## What Are These Methods?

These methods let you update **form-related properties and element states** across multiple elements in one call. They cover input values, placeholders, and boolean states like disabled, checked, hidden, and more.

---

## Method Reference

| Method | Property It Sets | Value Type | Typical Elements |
|--------|-----------------|-----------|-----------------|
| `.value()` | `value` | String | `<input>`, `<textarea>`, `<select>` |
| `.placeholder()` | `placeholder` | String | `<input>`, `<textarea>` |
| `.disabled()` | `disabled` | Boolean | `<button>`, `<input>`, `<select>` |
| `.checked()` | `checked` | Boolean | `<input type="checkbox">`, `<input type="radio">` |
| `.readonly()` | `readOnly` | Boolean | `<input>`, `<textarea>` |
| `.hidden()` | `hidden` | Boolean | Any element |
| `.selected()` | `selected` | Boolean | `<option>` |
| `.title()` | `title` | String | Any element (tooltip text) |

---

## Syntax

```javascript
Elements.value(updates)        // Returns Elements
Elements.placeholder(updates)  // Returns Elements
Elements.disabled(updates)     // Returns Elements
Elements.checked(updates)      // Returns Elements
Elements.readonly(updates)     // Returns Elements
Elements.hidden(updates)       // Returns Elements
Elements.selected(updates)     // Returns Elements
Elements.title(updates)        // Returns Elements
```

All take an object where keys are element IDs and values are the new property values.

---

## .value() — Set Input Values

Updates the `value` property of form elements:

```javascript
Elements.value({
  username: "john_doe",
  email: "john@example.com",
  age: "25"
});
```

### Pre-filling a Form

```javascript
function prefillForm(userData) {
  Elements.value({
    firstName: userData.first,
    lastName: userData.last,
    email: userData.email,
    phone: userData.phone
  });
}

prefillForm({
  first: "Alice",
  last: "Smith",
  email: "alice@example.com",
  phone: "555-0123"
});
```

### Clearing Form Fields

```javascript
Elements.value({
  firstName: "",
  lastName: "",
  email: "",
  phone: ""
});
```

---

## .placeholder() — Set Placeholder Text

Updates the placeholder text that appears when an input is empty:

```javascript
Elements.placeholder({
  searchBox: "Search products...",
  emailInput: "Enter your email",
  passwordInput: "Enter password"
});
```

### Localized Placeholders

```javascript
function setLanguage(lang) {
  const placeholders = {
    en: { searchBox: "Search...", emailInput: "Your email" },
    es: { searchBox: "Buscar...", emailInput: "Tu correo" },
    fr: { searchBox: "Chercher...", emailInput: "Votre email" }
  };

  Elements.placeholder(placeholders[lang]);
}

setLanguage('es');
```

---

## .disabled() — Enable/Disable Elements

Controls whether elements are interactive. `true` disables, `false` enables:

```javascript
Elements.disabled({
  submitBtn: true,    // Disable — user can't click
  cancelBtn: false,   // Enable — user can click
  inputField: true    // Disable — user can't type
});
```

### Form Submission Pattern

```javascript
// Disable form while submitting
function onSubmit() {
  Elements.disabled({
    submitBtn: true,
    cancelBtn: true,
    nameInput: true,
    emailInput: true
  });

  // After submission completes, re-enable
  submitData().then(() => {
    Elements.disabled({
      submitBtn: false,
      cancelBtn: false,
      nameInput: false,
      emailInput: false
    });
  });
}
```

---

## .checked() — Set Checkbox/Radio State

Controls whether checkboxes and radio buttons are checked:

```javascript
Elements.checked({
  agreeTerms: true,    // Check the box
  newsletter: false,   // Uncheck the box
  optionB: true        // Select this radio
});
```

### Setting Default Options

```javascript
function setDefaultPreferences() {
  Elements.checked({
    notifications: true,
    darkMode: false,
    autoSave: true,
    shareData: false
  });
}
```

---

## .readonly() — Set Read-Only State

Makes input fields read-only (visible but not editable):

```javascript
Elements.readonly({
  usernameInput: true,   // Can't edit
  emailInput: false      // Can edit
});
```

**Note:** The method is called `.readonly()` (lowercase) but it sets the JavaScript property `readOnly` (camelCase). The module handles this mapping for you.

### Locked Profile Fields

```javascript
// Lock sensitive fields after verification
function lockVerifiedFields() {
  Elements.readonly({
    verifiedEmail: true,
    verifiedPhone: true
  });
}
```

---

## .hidden() — Show/Hide Elements

Controls element visibility using the HTML `hidden` attribute. `true` hides, `false` shows:

```javascript
Elements.hidden({
  loadingSpinner: false,  // Show (hidden = false)
  mainContent: true,      // Hide (hidden = true)
  errorMessage: true      // Hide
});
```

### Loading State Pattern

```javascript
function showLoading() {
  Elements.hidden({
    loadingSpinner: false,  // Show spinner
    mainContent: true,      // Hide content
    errorMessage: true      // Hide errors
  });
}

function showContent() {
  Elements.hidden({
    loadingSpinner: true,   // Hide spinner
    mainContent: false,     // Show content
    errorMessage: true      // Keep errors hidden
  });
}

function showError() {
  Elements.hidden({
    loadingSpinner: true,   // Hide spinner
    mainContent: true,      // Hide content
    errorMessage: false     // Show error
  });
}
```

---

## .selected() — Set Option Selection

Controls which `<option>` elements are selected in a dropdown:

```javascript
Elements.selected({
  option1: true,
  option2: false
});
```

---

## .title() — Set Tooltip Text

Sets the `title` attribute, which appears as a tooltip when the user hovers over an element:

```javascript
Elements.title({
  helpIcon: "Click for help",
  deleteBtn: "Delete this item permanently",
  saveBtn: "Save all changes"
});
```

---

## Real-World Examples

### Example 1: Form State Manager

```javascript
function setFormState(state) {
  if (state === 'editing') {
    Elements.disabled({ submitBtn: false, resetBtn: false });
    Elements.readonly({ nameInput: false, emailInput: false });
    Elements.hidden({ editHint: false });
  }

  if (state === 'locked') {
    Elements.disabled({ submitBtn: true, resetBtn: true });
    Elements.readonly({ nameInput: true, emailInput: true });
    Elements.hidden({ editHint: true });
  }
}

setFormState('editing');
```

### Example 2: Settings Panel

```javascript
function loadSettings(settings) {
  // Set toggle states
  Elements.checked({
    darkModeToggle: settings.darkMode,
    notificationsToggle: settings.notifications,
    autoSaveToggle: settings.autoSave
  });

  // Set input values
  Elements.value({
    displayName: settings.name,
    emailField: settings.email
  });

  // Set tooltips
  Elements.title({
    darkModeToggle: settings.darkMode ? "Click to disable" : "Click to enable",
    notificationsToggle: "Get alerts for new messages"
  });
}
```

---

## All Methods Are Chainable

```javascript
Elements
  .value({ nameInput: "Alice", emailInput: "alice@test.com" })
  .placeholder({ nameInput: "Your name", emailInput: "Your email" })
  .disabled({ submitBtn: false })
  .hidden({ successMessage: true });
```

---

## Summary

| Method | Property | Value Type | Common Use |
|--------|----------|-----------|-----------|
| `.value()` | `value` | String | Fill form inputs |
| `.placeholder()` | `placeholder` | String | Set input hints |
| `.disabled()` | `disabled` | Boolean | Enable/disable interactive elements |
| `.checked()` | `checked` | Boolean | Toggle checkboxes/radios |
| `.readonly()` | `readOnly` | Boolean | Lock/unlock inputs |
| `.hidden()` | `hidden` | Boolean | Show/hide elements |
| `.selected()` | `selected` | Boolean | Select/deselect options |
| `.title()` | `title` | String | Set hover tooltips |

> **Simple Rule to Remember:** For boolean methods (`.disabled()`, `.checked()`, `.readonly()`, `.hidden()`, `.selected()`), pass `true` to activate the state and `false` to deactivate it. For string methods (`.value()`, `.placeholder()`, `.title()`), pass the text you want to set.