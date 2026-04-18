[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Recommended Usage

## What This Section Covers

DOM Helpers gives you multiple ways to access and update elements. Most of them lead to the same result — but some are more readable, more concise, and better suited to how the library is designed to be used.

This section explains the recommended patterns: which access style to prefer, when to use direct property changes versus `.update()`, when to use `Elements.update()` for multiple elements, and when to reach for bulk property updaters.

These are not strict rules enforced by the library. They are conventions that result in cleaner, more maintainable code as your project grows.

---

## Rule 1 — Use Shortcuts for Element Access

DOM Helpers provides several ways to access the same element. The recommended approach is to use the shortest form that is still clear.

### Accessing Elements by ID

You have three options. All three return the same element with `.update()` attached:

```javascript
// Option A — Id() shortcut (most concise, recommended for quick access)
Id('submitBtn')

// Option B — Elements proxy (recommended for repeated use in the same scope)
Elements.submitBtn

// Option C — bracket notation (use when the ID is dynamic or stored in a variable)
Elements['submitBtn']
const myId = 'submitBtn';
Elements[myId]
```

**When to use each:**

- Use `Id('elementId')` when you are doing a quick, one-off access — reading a value, triggering an update, chaining immediately.
- Use `Elements.myId` when you are accessing the same element several times in the same block of code. It reads more naturally as a property access and makes clear you are working with a named, known element.
- Use `Elements['myId']` when the ID is stored in a variable or computed dynamically.

```javascript
// Quick one-off — Id() reads well
Id('loginBtn').update({ disabled: true });

// Repeated access in a function — Elements.prop reads well
function resetForm() {
  Elements.emailInput.update({ value: '' });
  Elements.passwordInput.update({ value: '' });
  Elements.submitBtn.update({ disabled: false, textContent: 'Sign In' });
  Elements.errorMsg.update({ style: { display: 'none' } });
}

// Dynamic ID — bracket notation is necessary
function highlightField(fieldId) {
  Elements[fieldId].update({ classList: { add: 'highlighted' } });
}
```

---

## Rule 2 — Use Collection Shortcuts for Groups

When you need to access elements by class name, tag name, or `name` attribute, use the shortcut globals directly instead of the full `Collections.` prefix.

```javascript
// Recommended — shortcut globals
ClassName.btn
TagName.input
Name.email

// Verbose alternative — still works, but longer than necessary
Collections.ClassName.btn
Collections.TagName.input
Collections.Name.email
```

The shortcut globals also support negative index access, which `Collections` does not provide directly:

```javascript
// First and last element of a group
ClassName.btn[0]    // first
ClassName.btn[-1]   // last — no length calculation needed
TagName.li[-2]      // second to last
```

```javascript
// Practical example
function disableAllButtons() {
  ClassName.btn.forEach(btn => btn.update({ disabled: true }));
}

function highlightLastItem() {
  TagName.li[-1].update({ classList: { add: 'active' } });
}
```

---

## Rule 3 — Use `querySelector()` and `querySelectorAll()` for CSS Selector Access

When you need to find an element by a CSS selector (not by ID or class directly), use the global `querySelector()` and `querySelectorAll()` functions from the Global Query enhancer. These are also available as the shorter aliases `query()` and `queryAll()` — both names work identically.

```javascript
// Single element — recommended form (mirrors browser API name)
querySelector('#sidebar .toggle-btn').update({ classList: { toggle: 'open' } });

// Short alias — identical behavior
query('#sidebar .toggle-btn').update({ classList: { toggle: 'open' } });

// Multiple elements — recommended form
querySelectorAll('form input[required]').update({
  setAttribute: { 'aria-required': 'true' }
});

// Short alias — identical behavior
queryAll('form input[required]').update({
  setAttribute: { 'aria-required': 'true' }
});

// Scoped to a container
queryWithin('#myForm', 'input').update({ disabled: false });
```

These mirror the browser's native `document.querySelector` and `document.querySelectorAll` names intentionally — the naming is familiar, and every result already has `.update()` attached with collections coming with array methods.

---

## Rule 4 — Single Property Change vs `.update()`

This is one of the most important decisions in day-to-day usage. When should you set a property directly, and when should you use `.update()`?

### Direct property access — for a single, simple change

When you are changing exactly one property on an element, direct assignment is perfectly fine:

```javascript
Elements.myTitle.textContent = 'Hello World';
Elements.myInput.value = '';
Elements.myBtn.disabled = true;
```

This is clear, concise, and requires no overhead. Use it when the intent is a single, obvious change.

### `.update()` — for multiple properties at once

When you need to change more than one property on an element in the same operation, `.update()` is the right tool. It groups all changes into a single, readable block:

```javascript
// Multiple changes — use .update()
Elements.myButton.update({
  textContent: 'Loading...',
  disabled: true,
  style: { opacity: '0.7' },
  classList: { add: 'loading', remove: 'ready' }
});
```

The benefit of `.update()` is not just brevity. It makes the intent clear: these changes belong together. They describe a single transition — the button is entering a loading state. That relationship is visible in the code.

### The decision rule

```
One property changing?   → Direct assignment is fine
Two or more properties?  → Use .update()
```

```javascript
// One change — direct assignment
Elements.statusDot.className = 'dot online';

// Multiple changes — .update()
Elements.statusPanel.update({
  textContent: 'Connected',
  className: 'panel online',
  setAttribute: { 'aria-label': 'Connection status: online' }
});
```

---

## Rule 5 — Use `Elements.update()` for Multiple Elements

When several elements need to be updated as part of the same operation, use `Elements.update()`. This is the **multi-element updater** — one call, one object, each key an element ID.

```javascript
// Multiple elements updated together — use Elements.update()
Elements.update({
  userName:     { textContent: user.name },
  userAvatar:   { setAttribute: { src: user.avatar, alt: user.name } },
  loginBtn:     { style: { display: 'none' } },
  logoutBtn:    { style: { display: 'block' } },
  welcomeMsg:   { textContent: 'Welcome back, ' + user.name }
});
```

This is different from calling `.update()` on a single element. `Elements.update()` addresses multiple elements by their IDs in a single, declarative block. The result is a map of element IDs to their new configurations — readable at a glance.

**When to use `Elements.update()`:**

- When a user action or state change requires updating three or more separate elements
- When the updates are logically connected and should be visible together in code
- When you want a clear record of "what happens to which elements when this event occurs"

```javascript
// Login success — update everything in one place
function onLoginSuccess(user) {
  Elements.update({
    pageTitle:    { textContent: 'Dashboard' },
    headerUser:   { textContent: user.name },
    loginForm:    { style: { display: 'none' } },
    dashboard:    { style: { display: 'block' } },
    statusBadge:  { textContent: 'Signed in', className: 'badge active' }
  });
}
```

---

## Rule 6 — Use Bulk Property Updaters for Same-Property Updates

When you need to update the **same type of property** across several elements, bulk property updaters are the most concise option.

```javascript
// Updating textContent on multiple elements — use Elements.textContent()
Elements.textContent({
  title:     'Welcome Back',
  subtitle:  'Your dashboard is ready',
  footer:    '© 2024 MyApp',
  greeting:  'Good morning'
});

// Updating styles on multiple elements — use Elements.style()
Elements.style({
  header:   { backgroundColor: '#1a1a2e', color: 'white' },
  sidebar:  { width: '260px' },
  main:     { marginLeft: '260px' }
});

// Updating classes on multiple elements — use Elements.classes()
Elements.classes({
  loginForm:  { remove: 'visible', add: 'hidden' },
  dashboard:  { remove: 'hidden', add: 'visible' }
});
```

**The key difference from `Elements.update()`:**

- `Elements.update()` — each element gets its own full update object (different properties per element)
- `Elements.textContent()`, `Elements.style()`, etc. — every element in the call gets the **same type of property** changed

```javascript
// Use Elements.update() when each element gets different property types
Elements.update({
  title:  { textContent: 'Hello' },         // textContent
  btn:    { disabled: true },               // disabled
  panel:  { style: { display: 'flex' } }   // style
});

// Use Elements.textContent() when all elements get the same property
Elements.textContent({
  title:   'Hello',
  btn:     'Submit',
  footer:  'Done'
});
```

---

## Choosing the Right Tool

Here is a summary of when to use each access and update pattern:

| Situation | Recommended |
|---|---|
| Access one element by ID, one-off | `Id('myId')` |
| Access one element by ID, used several times | `Elements.myId` |
| Access element with dynamic/variable ID | `Elements[dynamicId]` |
| Access elements by class | `ClassName.myClass` |
| Access elements by tag | `TagName.div` |
| Access elements by name attribute | `Name.fieldName` |
| Access by CSS selector | `querySelector(selector)` / `querySelectorAll(selector)` |
| Change one property on one element | Direct: `Elements.myId.textContent = 'x'` |
| Change multiple properties on one element | `Elements.myId.update({ ... })` |
| Change multiple elements with different properties | `Elements.update({ id1: {...}, id2: {...} })` |
| Change same property across many elements | `Elements.textContent({...})` / `Elements.style({...})` |

---

## What's Next

Now that you know how to access elements and choose the right update pattern, the next section shows how the enhancers, conditions, and storage modules work together with the core — and what a complete, real interaction looks like.

- **[How Modules Work Together](./06_how-modules-work-together.md)** — combining core, enhancers, conditions, and storage in practice