[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Enhanced `document.getElementById`

Welcome to the Native Enhance module! This guide covers how DOMHelpers silently upgrades `document.getElementById` so that every element it returns comes pre-equipped with the full DOMHelpers power — without changing a single line of your existing code.

---

## Quick Start (30 seconds)

You already know this:

```javascript
const btn = document.getElementById('submitBtn');
btn.textContent = 'Click me';
```

Once the Native Enhance module is loaded, that same call works exactly as before — but the element you get back now also has `.update()` and every shorthand method built in:

```javascript
// Same call you've always written — nothing changes
const btn = document.getElementById('submitBtn');

// But now the element has superpowers ✨
btn.update({
  textContent: 'Saving...',
  disabled: true,
  style: { opacity: '0.7' }
});
```

No new syntax to learn. Your existing code keeps working. The element just gets better.

---

## What is the Enhanced `getElementById`?

When DOMHelpers loads the `dh-getbyid-enhance.js` module, it quietly replaces the browser's built-in `document.getElementById` with an upgraded version. This upgraded version does everything the original does — finds elements by their `id` — but it then passes the result through the DOMHelpers enhancement pipeline before handing it back to you.

The result: every element returned by `document.getElementById` automatically has:

- A `.update()` method for applying multiple changes in one call
- Shorthand methods like `.textContent()`, `.style()`, `.classes()`, `.attrs()`, `.dataset()`, and more — usable directly on the `getElementById` function itself for bulk operations
- Full compatibility with the rest of the DOMHelpers library

Think of it as **an upgrade that runs quietly in the background** — your code does not need to change, but what comes back is noticeably more capable.

---

## Syntax

```javascript
// Exactly the same call you have always written
const element = document.getElementById('someId');

// The element now has .update() automatically attached
element.update({ ... });

// The function itself also has bulk shorthand methods
document.getElementById.update({ id1: { ... }, id2: { ... } });
document.getElementById.textContent({ id1: 'Hello', id2: 'World' });
document.getElementById.style({ id1: { color: 'red' }, id2: { color: 'blue' } });
document.getElementById.classes({ id1: { add: 'active' }, id2: { remove: 'hidden' } });
document.getElementById.attrs({ id1: { disabled: true }, id2: { href: '/home' } });
document.getElementById.dataset({ id1: { userId: '42' }, id2: { role: 'admin' } });
```

There are two levels of API here:

| Level | How to use | What it does |
|-------|-----------|--------------|
| **Element level** | `document.getElementById('id').update(...)` | Enhances the single returned element |
| **Function level** | `document.getElementById.update({ id1: ..., id2: ... })` | Operates on multiple elements at once by ID |

---

## Why Does This Exist?

### When You Already Have Code Using `document.getElementById`

Consider a project that has been built over time with standard JavaScript. There may be dozens or hundreds of places where `document.getElementById` is already being called. Switching every call to `Elements.someId` would require touching each of those lines.

The Native Enhance module takes a different approach — it meets you where you are.

```javascript
// Your existing code — you don't touch this
function initPage() {
  const header = document.getElementById('header');
  const nav    = document.getElementById('nav');
  const footer = document.getElementById('footer');

  header.textContent = 'Welcome';
  nav.style.display  = 'flex';
}
```

Once the module loads, `header`, `nav`, and `footer` all come back enhanced. You can now write `.update()` calls anywhere without rewriting the access pattern:

```javascript
function initPage() {
  const header = document.getElementById('header');
  const nav    = document.getElementById('nav');
  const footer = document.getElementById('footer');

  // .update() is available — no code restructuring needed ✨
  header.update({ textContent: 'Welcome', style: { color: '#333' } });
  nav.update({ style: { display: 'flex' }, classList: { add: 'visible' } });
}
```

**This method is especially useful when:**
✅ You have existing code using `document.getElementById` that you want to gradually enhance
✅ You work in a team where some developers prefer the native API
✅ You want DOMHelpers enhancement without adopting a new access pattern everywhere
✅ You need to integrate DOMHelpers into an existing project without a refactor
✅ You want the bulk function-level shorthands as a lightweight batch update tool

**The Choice is Yours:**
- Use `Elements.id` when starting fresh or when you want caching and the full Elements feature set
- Use `document.getElementById` (enhanced) when you are working in existing code or prefer the native API feel
- Both approaches produce equally enhanced elements — the choice is about workflow, not capability

---

## Mental Model

**Think of this as upgrading your home's light switches.**

You have a house with regular light switches. They work perfectly fine. One day, an electrician quietly replaces each switch with a smart switch — same location, same feel, same on/off behavior. But now each switch also responds to voice commands, can be controlled remotely, and can dim the lights.

You didn't have to move any furniture. The switches are still where they were. Your existing habits (flip the switch) still work. But now you also have new powers available whenever you need them.

```
Before the module loads:

document.getElementById('btn')
        ↓
   <button> element
   (just a plain DOM element)


After the module loads:

document.getElementById('btn')
        ↓
   Enhanced <button> element
   ├─ .update()       ← apply multiple changes at once
   ├─ .textContent    ← shorthand
   ├─ .style()        ← shorthand
   ├─ .classList      ← shorthand
   └─ ... all other standard element properties still work
```

Nothing breaks. Everything gains.

---

## How Does It Work?

When `dh-getbyid-enhance.js` loads, it saves a reference to the original `document.getElementById`, then replaces it with a new function. That new function calls the original, takes the element it returns, passes it through the DOMHelpers enhancement pipeline, and hands the enhanced element back to your code.

```
Your code calls:  document.getElementById('submitBtn')
                          ↓
      Enhanced function intercepts the call
                          ↓
      Calls the original native getElementById internally
                          ↓
      Native browser returns the raw <button> element
                          ↓
      Enhancement check:
      Has this element already been enhanced?
      ├─ YES → Return it as-is (no double-enhancement)
      └─ NO  → Pass through EnhancedUpdateUtility pipeline
                          ↓
      Element now has .update() and all shorthand methods
                          ↓
      Your code receives the enhanced element ✅
```

### The Enhancement Pipeline

The element is passed to `EnhancedUpdateUtility.enhanceElementWithUpdate` — the same enhancer used by `Elements`, `querySelector`, and every other DOMHelpers accessor. This guarantees that every part of the library produces elements with identical capabilities, regardless of how you accessed them.

```javascript
// These all produce elements with the exact same enhancement
const a = Elements.submitBtn;                          // via Elements helper
const b = document.getElementById('submitBtn');        // via enhanced getElementById
const c = document.querySelector('#submitBtn');        // via enhanced querySelector

// All three have .update() — they are identical in capability
a.update({ textContent: 'A' });
b.update({ textContent: 'B' });
c.update({ textContent: 'C' });
```

### Already Enhanced? Skipped Automatically

If an element was already enhanced by another part of the library, the enhancer recognises it and skips the enhancement step:

```javascript
// First access — element is enhanced
const btn1 = Elements.submitBtn;                    // Enhanced by Elements ✅

// Second access via getElementById — already enhanced, skipped
const btn2 = document.getElementById('submitBtn'); // Detected as already enhanced ✅
// btn2.update() still works perfectly
```

No double-wrapping. No conflicts. No wasted work.

---

## Basic Usage

### Accessing a Single Element

```javascript
// HTML: <h1 id="pageTitle">Hello World</h1>

const title = document.getElementById('pageTitle');

// Standard DOM properties still work exactly as before
console.log(title.textContent);  // "Hello World"
console.log(title.tagName);      // "H1"

// And now .update() is available too ✨
title.update({
  textContent: 'Welcome!',
  style: { color: '#2563eb', fontWeight: 'bold' }
});
```

### Using `.update()` on a Single Element

```javascript
// HTML: <button id="saveBtn">Save</button>

const btn = document.getElementById('saveBtn');

// Apply multiple changes in one call
btn.update({
  textContent: 'Saving...',
  disabled:    true,
  style:       { opacity: '0.6', cursor: 'not-allowed' }
});

// Later — reset it
btn.update({
  textContent: 'Save',
  disabled:    false,
  style:       { opacity: '1', cursor: 'pointer' }
});
```

### Updating Classes

```javascript
const card = document.getElementById('productCard');

card.update({
  classList: {
    add:    'highlight',
    remove: 'dimmed'
  }
});
```

### Setting Attributes

```javascript
const link = document.getElementById('profileLink');

link.update({
  setAttribute: {
    href:         '/users/42',
    'aria-label': 'View profile'
  }
});
```

### Setting Data Attributes

```javascript
const row = document.getElementById('row1');

row.update({
  dataset: {
    userId: '42',
    role:   'admin'
  }
});

// The element now has data-user-id="42" and data-role="admin"
```

---

## Function-Level Bulk Operations

This is where the enhanced `getElementById` becomes particularly powerful. In addition to enhancing the element it returns, the `getElementById` function itself gains shorthand methods for updating multiple elements at once by their IDs.

Think of it as a lightweight batch tool — you pass an object where each key is an element ID and each value is what to apply.

### Bulk `.update()`

```javascript
// Update multiple elements by ID in a single call
document.getElementById.update({
  header:     { textContent: 'My App', style: { background: '#1e40af' } },
  saveBtn:    { disabled: true, textContent: 'Saving...' },
  statusMsg:  { textContent: 'Please wait...', style: { color: 'grey' } },
  cancelBtn:  { hidden: true }
});
```

**What's happening?**

```
document.getElementById.update({ header: {...}, saveBtn: {...} })
                ↓
For each key-value pair:
  document.getElementById('header')  → .update({ textContent: '...', style: {...} })
  document.getElementById('saveBtn') → .update({ disabled: true, textContent: '...' })
  ...
```

Each element is found, enhanced if needed, and updated — all in one concise statement.

### Bulk `.textContent()`

```javascript
// Set textContent for multiple elements at once
document.getElementById.textContent({
  pageTitle:   'Dashboard',
  userName:    'Jane Doe',
  userRole:    'Administrator',
  lastSeen:    'Just now',
  statusLabel: 'Active'
});
```

Much cleaner than writing five separate lines.

### Bulk `.innerHTML()`

```javascript
document.getElementById.innerHTML({
  welcomeBanner: '<strong>Welcome back!</strong> Here is your summary.',
  helpText:      'Click <a href="/help">here</a> for documentation.'
});
```

### Bulk `.value()`

```javascript
// Clear multiple form fields at once
document.getElementById.value({
  emailInput:    '',
  passwordInput: '',
  searchInput:   ''
});
```

### Bulk `.style()`

```javascript
// Apply styles to multiple elements at once
document.getElementById.style({
  header:  { background: '#1e40af', color: 'white' },
  sidebar: { width: '250px', borderRight: '1px solid #e5e7eb' },
  footer:  { padding: '1rem', textAlign: 'center' }
});
```

### Bulk `.classes()`

```javascript
// Manage classes on multiple elements at once
document.getElementById.classes({
  overlay:    { add: 'visible', remove: 'hidden' },
  modal:      { add: 'open' },
  mainContent: { add: 'blurred' }
});
```

### Bulk `.attrs()`

```javascript
// Set attributes on multiple elements at once
document.getElementById.attrs({
  submitBtn: { disabled: true, 'aria-busy': 'true' },
  formEl:    { 'aria-label': 'Login form', novalidate: true },
  userImg:   { alt: 'User avatar', src: '/images/user.png' }
});
```

### Bulk `.dataset()`

```javascript
// Set data attributes on multiple elements at once
document.getElementById.dataset({
  row1: { userId: '10', status: 'active' },
  row2: { userId: '11', status: 'inactive' },
  row3: { userId: '12', status: 'pending' }
});
```

### Bulk `.disabled()`

```javascript
// Disable or enable multiple elements at once
document.getElementById.disabled({
  submitBtn:  true,
  cancelBtn:  false,
  resetBtn:   true,
  emailInput: true
});
```

### Bulk `.hidden()`

```javascript
// Show or hide multiple elements at once
document.getElementById.hidden({
  loadingSpinner: false,  // show
  emptyState:     true,   // hide
  dataTable:      false   // show
});
```

### Bulk `.checked()`

```javascript
// Set checked state on multiple checkboxes or radios
document.getElementById.checked({
  termsCheckbox:   true,
  newsletterCheck: false,
  rememberMe:      true
});
```

### Bulk `.src()`

```javascript
// Update src on multiple images or media elements
document.getElementById.src({
  avatarImg:  '/images/users/jane.png',
  bannerImg:  '/images/banners/home.jpg',
  logoImg:    '/images/logo-dark.svg'
});
```

### Bulk `.href()`

```javascript
// Update href on multiple links at once
document.getElementById.href({
  homeLink:    '/',
  profileLink: '/users/42',
  logoutLink:  '/auth/logout'
});
```

### Bulk `.prop()` — Any Property

```javascript
// Set any arbitrary property on multiple elements
document.getElementById.prop('scrollTop', {
  mainContent: 0,
  sidebar:     0
});

document.getElementById.prop('selectedIndex', {
  countrySelect:  2,
  languageSelect: 0
});
```

`prop` accepts any dot-notation property path as the first argument and an object of `{ id: value }` pairs as the second.

---

## Full Shorthand Reference

Here is a complete list of all shorthand methods available on the `getElementById` function:

| Method | Usage | Sets |
|--------|-------|------|
| `.update({ id: {...} })` | Multi-property update | Multiple properties at once |
| `.textContent({ id: value })` | Quick text update | `element.textContent` |
| `.innerHTML({ id: value })` | Quick HTML update | `element.innerHTML` |
| `.innerText({ id: value })` | Quick visible text update | `element.innerText` |
| `.value({ id: value })` | Quick value update | `element.value` |
| `.placeholder({ id: value })` | Quick placeholder update | `element.placeholder` |
| `.title({ id: value })` | Quick title update | `element.title` |
| `.disabled({ id: bool })` | Enable/disable toggle | `element.disabled` |
| `.checked({ id: bool })` | Check/uncheck toggle | `element.checked` |
| `.readonly({ id: bool })` | Set read-only state | `element.readOnly` |
| `.hidden({ id: bool })` | Show/hide toggle | `element.hidden` |
| `.selected({ id: bool })` | Select/deselect | `element.selected` |
| `.src({ id: value })` | Update source | `element.src` |
| `.href({ id: value })` | Update link | `element.href` |
| `.alt({ id: value })` | Update alt text | `element.alt` |
| `.style({ id: {...} })` | Apply inline styles | `element.style.*` |
| `.classes({ id: {...} })` | Manage class list | `element.classList` |
| `.attrs({ id: {...} })` | Set/remove attributes | `element.setAttribute / removeAttribute` |
| `.dataset({ id: {...} })` | Set data attributes | `element.dataset.*` |
| `.prop(path, { id: value })` | Set any property | Any property path |

---

## Deep Dive: Real-World Patterns

### Pattern 1 — Form Submit Handler

```javascript
// HTML:
// <form id="loginForm">
//   <input id="emailField" type="email">
//   <input id="passwordField" type="password">
//   <button id="loginBtn">Log In</button>
//   <p id="errorMsg" hidden></p>
// </form>

async function handleLogin(event) {
  event.preventDefault();

  // Read field values
  const email    = document.getElementById('emailField').value;
  const password = document.getElementById('passwordField').value;

  // Set loading state — all at once
  document.getElementById.update({
    loginBtn:      { disabled: true, textContent: 'Logging in...' },
    emailField:    { disabled: true },
    passwordField: { disabled: true },
    errorMsg:      { hidden: true, textContent: '' }
  });

  try {
    await login(email, password);

    // Success state
    document.getElementById.update({
      loginBtn:  { textContent: 'Success!', style: { background: 'green' } },
      loginForm: { hidden: true }
    });

  } catch (err) {
    // Error state — restore form and show message
    document.getElementById.update({
      loginBtn:      { disabled: false, textContent: 'Log In' },
      emailField:    { disabled: false },
      passwordField: { disabled: false },
      errorMsg:      { hidden: false, textContent: err.message }
    });
  }
}
```

### Pattern 2 — Dashboard Data Refresh

```javascript
function refreshDashboard(data) {
  // Update all display values in one call
  document.getElementById.textContent({
    totalUsers:    data.users.toLocaleString(),
    activeUsers:   data.activeUsers.toLocaleString(),
    revenue:       `$${data.revenue.toLocaleString()}`,
    openTickets:   data.tickets.toString(),
    lastUpdated:   new Date().toLocaleTimeString()
  });

  // Update status indicators separately
  document.getElementById.classes({
    serverStatus: { add: data.serverOnline ? 'status-green' : 'status-red',
                    remove: data.serverOnline ? 'status-red' : 'status-green' },
    dbStatus:     { add: data.dbOnline ? 'status-green' : 'status-red',
                    remove: data.dbOnline ? 'status-red' : 'status-green' }
  });
}
```

### Pattern 3 — Theme Switcher

```javascript
function applyTheme(theme) {
  const isDark = theme === 'dark';

  document.getElementById.style({
    mainContent: { background: isDark ? '#0f172a' : '#ffffff',
                   color:      isDark ? '#f8fafc'  : '#0f172a' },
    sidebar:     { background: isDark ? '#1e293b' : '#f1f5f9',
                   borderColor: isDark ? '#334155' : '#e2e8f0' },
    navbar:      { background: isDark ? '#1e293b' : '#ffffff',
                   boxShadow:   isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)' }
  });

  document.getElementById.dataset({
    themeToggle: { currentTheme: theme }
  });
}
```

### Pattern 4 — Integrating with Existing Code

```javascript
// BEFORE — existing code already in your project
function updateProfile(user) {
  const nameEl   = document.getElementById('userName');
  const emailEl  = document.getElementById('userEmail');
  const avatarEl = document.getElementById('userAvatar');

  // Old-style updates — still work perfectly fine
  nameEl.textContent  = user.name;
  emailEl.textContent = user.email;
  avatarEl.src        = user.avatarUrl;
}

// AFTER — you can now use .update() on the same elements
// without changing how you access them
function updateProfile(user) {
  const nameEl   = document.getElementById('userName');
  const emailEl  = document.getElementById('userEmail');
  const avatarEl = document.getElementById('userAvatar');

  // New-style — same elements, now with .update()
  nameEl.update({
    textContent: user.name,
    dataset:     { userId: user.id }
  });
  emailEl.update({
    textContent:  user.email,
    setAttribute: { 'aria-label': `Email: ${user.email}` }
  });
  avatarEl.update({
    src: user.avatarUrl,
    alt: `${user.name}'s avatar`
  });
}

// Or collapse it all into one function-level call
function updateProfile(user) {
  document.getElementById.update({
    userName:  { textContent: user.name,      dataset: { userId: user.id } },
    userEmail: { textContent: user.email,     setAttribute: { 'aria-label': `Email: ${user.email}` } },
    userAvatar: { src: user.avatarUrl,         alt: `${user.name}'s avatar` }
  });
}
```

All three versions work. You choose how much to adopt based on your comfort level.

---

## Understanding the Two APIs Side by Side

```
ELEMENT LEVEL — operates on one element
─────────────────────────────────────────────────────────────
const btn = document.getElementById('submitBtn');
btn.update({ textContent: 'Go', disabled: false });
                ↑
           The enhanced element has .update() attached


FUNCTION LEVEL — operates on many elements by ID
─────────────────────────────────────────────────────────────
document.getElementById.update({
  submitBtn: { textContent: 'Go', disabled: false },
  cancelBtn: { hidden: true },
  statusMsg: { textContent: '' }
});
                ↑
           The function itself has .update() and shorthands
           Keys are element IDs — values are update objects
```

---

## Common Pitfalls

### Pitfall 1 — Calling a Shorthand on a Non-Array Value

The function-level shorthands expect an object of `{ id: value }` pairs, not a bare value:

```javascript
// ❌ This will not work
document.getElementById.textContent('Hello');

// ✅ Always pass an object
document.getElementById.textContent({ pageTitle: 'Hello' });
```

### Pitfall 2 — Updating an Element That Does Not Exist

If an ID is not found in the DOM, a console warning is shown and the update is skipped gracefully — no error thrown:

```javascript
document.getElementById.textContent({ missingEl: 'Hello' });
// Console: [dh-getbyid] Element 'missingEl' not found
// The rest of the batch continues normally
```

### Pitfall 3 — Using Before the Module Loads

The enhancement only applies after `dh-getbyid-enhance.js` has been loaded. If your script runs before the module, elements accessed at that point will be plain DOM elements. Always ensure the module loads before your application scripts.

```html
<!-- ✅ Correct load order -->
<script src="01_dh-core.js"></script>
<script src="01_dh-bulk-property-updaters.js"></script>
<script src="06_dh-getbyid-enhance.js"></script>
<script src="my-app.js"></script> <!-- runs after — all elements are enhanced -->
```

### Pitfall 4 — Expecting Caching

Unlike `Elements`, the enhanced `getElementById` does **not** cache elements. Each call performs a real DOM lookup. This is by design — it keeps the behavior of `document.getElementById` predictable and familiar:

```javascript
// Elements — caches after first access ⚡
const a = Elements.submitBtn;  // DOM search
const b = Elements.submitBtn;  // cache hit, no DOM search

// Enhanced getElementById — no cache, consistent with native behavior
const c = document.getElementById('submitBtn');  // DOM search
const d = document.getElementById('submitBtn');  // DOM search again
```

If caching matters for your use case, `Elements` is the better choice. If you are working in existing code that already uses `getElementById`, the enhanced version gives you all the DOMHelpers methods without any other changes.

---

## Quick Comparison

| | Plain `document.getElementById` | Enhanced `document.getElementById` | `Elements` helper |
|--|--|--|--|
| **Syntax** | `document.getElementById('id')` | `document.getElementById('id')` | `Elements.id` |
| **Returns** | Plain element | Enhanced element | Enhanced element |
| **`.update()` on element** | ❌ | ✅ | ✅ |
| **Bulk function shorthands** | ❌ | ✅ | ✅ via `Elements.update()` |
| **Caching** | ❌ | ❌ | ✅ |
| **Zero code change needed** | — | ✅ (drop-in) | ❌ (new syntax) |
| **Best for** | Existing plain JS | Gradual adoption | New code |

---

## Plain JavaScript vs Enhanced `getElementById`

This section puts both approaches side by side on real scenarios — so you can see exactly what the library eliminates and what it gives you in return.

---

### Scenario 1 — Update a button's loading state

**Plain JavaScript**

```javascript
const btn = document.getElementById('submitBtn');

btn.textContent         = 'Saving...';
btn.disabled            = true;
btn.style.opacity       = '0.6';
btn.style.cursor        = 'not-allowed';
btn.setAttribute('aria-busy', 'true');
```

5 separate statements. Every property is its own line. The intent — "put the button into a loading state" — is buried in implementation details.

**Enhanced `getElementById`**

```javascript
document.getElementById('submitBtn').update({
  textContent:  'Saving...',
  disabled:     true,
  style:        { opacity: '0.6', cursor: 'not-allowed' },
  setAttribute: { 'aria-busy': 'true' }
});
```

One call. One intention. Reads exactly like what it does.

---

### Scenario 2 — Update five dashboard counters

**Plain JavaScript**

```javascript
document.getElementById('totalUsers').textContent   = data.users.toLocaleString();
document.getElementById('activeUsers').textContent  = data.activeUsers.toLocaleString();
document.getElementById('revenue').textContent      = '$' + data.revenue.toLocaleString();
document.getElementById('openTickets').textContent  = data.tickets.toString();
document.getElementById('lastUpdated').textContent  = new Date().toLocaleTimeString();
```

`document.getElementById` typed five times. 5 × 26 characters of boilerplate before you even get to the value. Reading this, you have to parse every line individually to understand what changed and where.

**Enhanced `getElementById`**

```javascript
document.getElementById.textContent({
  totalUsers:  data.users.toLocaleString(),
  activeUsers: data.activeUsers.toLocaleString(),
  revenue:     '$' + data.revenue.toLocaleString(),
  openTickets: data.tickets.toString(),
  lastUpdated: new Date().toLocaleTimeString()
});
```

One call. The structure itself tells you: "these are all text updates, here is what each element gets." No repeated method names. No repeated `document.getElementById`. The data is the code.

---

### Scenario 3 — Reset a login form after an error

**Plain JavaScript**

```javascript
const loginBtn      = document.getElementById('loginBtn');
const emailField    = document.getElementById('emailField');
const passwordField = document.getElementById('passwordField');
const errorMsg      = document.getElementById('errorMsg');

loginBtn.disabled            = false;
loginBtn.textContent         = 'Log In';
emailField.disabled          = false;
passwordField.disabled       = false;
errorMsg.hidden              = false;
errorMsg.textContent         = 'Invalid credentials. Please try again.';
errorMsg.style.color         = '#ef4444';
```

4 variable declarations just to access 4 elements. Then 7 property assignments. 11 statements total to express one logical action: "restore the form to its error state."

**Enhanced `getElementById`**

```javascript
document.getElementById.update({
  loginBtn:      { disabled: false, textContent: 'Log In' },
  emailField:    { disabled: false },
  passwordField: { disabled: false },
  errorMsg:      { hidden: false, textContent: 'Invalid credentials. Please try again.', style: { color: '#ef4444' } }
});
```

1 statement. 4 elements. Every change grouped by element. You read it top to bottom and understand the full picture immediately.

---

### Scenario 4 — Apply a theme to several layout elements

**Plain JavaScript**

```javascript
const mainContent = document.getElementById('mainContent');
const sidebar     = document.getElementById('sidebar');
const navbar      = document.getElementById('navbar');
const footer      = document.getElementById('footer');

mainContent.style.background = '#0f172a';
mainContent.style.color      = '#f8fafc';
sidebar.style.background     = '#1e293b';
sidebar.style.borderColor    = '#334155';
navbar.style.background      = '#1e293b';
navbar.style.boxShadow       = 'none';
footer.style.background      = '#0f172a';
footer.style.color           = '#94a3b8';
```

4 variable declarations. 8 style assignments. The theming logic is completely invisible — all you see is property assignments.

**Enhanced `getElementById`**

```javascript
document.getElementById.style({
  mainContent: { background: '#0f172a', color: '#f8fafc' },
  sidebar:     { background: '#1e293b', borderColor: '#334155' },
  navbar:      { background: '#1e293b', boxShadow: 'none' },
  footer:      { background: '#0f172a', color: '#94a3b8' }
});
```

One call. The structure maps directly to the design decision: "each layout region gets these styles." Maintainable — adding a new element is one new line. Readable — a designer could almost understand this without knowing JavaScript.

---

### Scenario 5 — Toggle visibility of multiple UI sections

**Plain JavaScript**

```javascript
document.getElementById('loadingSpinner').hidden = false;
document.getElementById('emptyState').hidden     = true;
document.getElementById('dataTable').hidden      = true;
document.getElementById('errorBanner').hidden    = true;
document.getElementById('pagination').hidden     = true;
```

`document.getElementById` five times. Five separate statements to express one idea: "show the spinner, hide everything else."

**Enhanced `getElementById`**

```javascript
document.getElementById.hidden({
  loadingSpinner: false,  // show
  emptyState:     true,   // hide
  dataTable:      true,   // hide
  errorBanner:    true,   // hide
  pagination:     true    // hide
});
```

One call. The intent is right there in the method name: `.hidden()`. The comments become optional because the structure says it all.

---

### What the pattern shows

```
Plain JavaScript                    Enhanced getElementById
────────────────────────────────    ──────────────────────────────────────
Repeat document.getElementById      Write it once — as the function call itself
  for every element
One statement per property          Group all properties per element
  assignment                          in one object
Variable declarations just          No intermediate variables needed
  to hold references                  for bulk updates
Intent buried in mechanics          Intent visible in structure
More lines = harder to review       Fewer lines = easier to review,
  and maintain                         change, and understand
```

The library does not change what your code does. It changes how clearly your code says what it does.

---

## Summary

1. **Drop-in upgrade** — loading `dh-getbyid-enhance.js` silently upgrades `document.getElementById` with no code changes required
2. **Element-level enhancement** — every element returned by `getElementById` automatically has `.update()` and all shorthand methods
3. **Function-level bulk shorthands** — `document.getElementById.update(...)`, `.textContent(...)`, `.style(...)`, and 17 more let you update many elements by ID in a single call
4. **Consistent with the library** — the same enhancement pipeline as `Elements`, `querySelector`, and every other DOMHelpers accessor
5. **No double-enhancement** — if an element was already enhanced by another part of the library, the module detects it and skips re-processing
6. **Gradual adoption friendly** — you can use it alongside existing plain `getElementById` code, adopting `.update()` and bulk shorthands only where it makes sense
