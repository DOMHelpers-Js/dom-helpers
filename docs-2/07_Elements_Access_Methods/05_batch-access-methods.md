[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Batch Access Methods — destructure() and getMultiple()

When you need several elements at once — for initializing a component, setting up a form, or organizing page structure — batch access methods let you grab them all in one clean operation. Instead of five separate `Elements.{id}` calls, you write one.

---

## Quick Start (30 Seconds)

```javascript
// Get multiple elements at once — one call, one line
const { header, nav, main, footer } = Elements.destructure(
  'header', 'nav', 'main', 'footer'
);

// All four elements ready to use immediately
if (header) setupHeader(header);
if (nav)    setupNavigation(nav);
if (main)   loadContent(main);
if (footer) setupFooter(footer);

// getMultiple() is an alias — same behavior, different name
const elements = Elements.getMultiple('header', 'nav', 'main', 'footer');
```

**One call. Multiple elements. Clean destructuring.**

---

## What Are Batch Access Methods?

`destructure()` and `getMultiple()` are two names for the same operation: **access multiple elements by their IDs in a single call** and get them back as an object you can destructure.

| Method | Alias Of | Returns |
|--------|----------|---------|
| `Elements.destructure(...ids)` | Primary name | Object `{ id1: element, id2: element, ... }` |
| `Elements.getMultiple(...ids)` | Alias for destructure | Same object |

Both methods return an object where:
- Each **key** is the element ID you passed in
- Each **value** is the DOM element (or `null` if not found)

---

## Syntax

```javascript
// destructure() — primary name
const { id1, id2, id3 } = Elements.destructure('id1', 'id2', 'id3');

// getMultiple() — alias, same behavior
const { id1, id2, id3 } = Elements.getMultiple('id1', 'id2', 'id3');

// Store the whole object (without destructuring)
const formElements = Elements.destructure('form', 'emailInput', 'submitBtn');
formElements.form;       // The form element (or null)
formElements.emailInput; // The input element (or null)
formElements.submitBtn;  // The button element (or null)
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `...ids` | string(s) | One or more element IDs to access |

**Returns:** An object `{ id1: element|null, id2: element|null, ... }`.

**Missing elements:** If an element with the given ID isn't found, its value in the returned object is `null`. Unlike `getRequired()`, no error is thrown.

---

## Why Do These Methods Exist?

### When Accessing Elements One at a Time Works Fine

For one or two elements, separate accesses are perfectly fine:

```javascript
// Clean and readable for a few elements
const form      = Elements.loginForm;
const submitBtn = Elements.submitBtn;

form.addEventListener('submit', handleLogin);
submitBtn.disabled = false;
```

This approach is **great when you need**:
✅ One or two elements — no need for batch access
✅ Each element used in separate parts of the code
✅ Simplest possible syntax

### When destructure() Is a More Direct Approach

In scenarios where you're initializing a component or setting up several related elements together, batch access provides a more organized approach:

```javascript
// Accessing five elements separately — verbose
const modal       = Elements.modal;
const modalTitle  = Elements.modalTitle;
const modalBody   = Elements.modalBody;
const modalClose  = Elements.modalClose;
const modalSubmit = Elements.modalSubmit;

// Batch access — clean, organized, one operation
const { modal, modalTitle, modalBody, modalClose, modalSubmit } =
  Elements.destructure('modal', 'modalTitle', 'modalBody', 'modalClose', 'modalSubmit');
```

**destructure() is especially useful when:**
✅ Setting up a component that needs 3 or more elements
✅ Initializing page structure in one clear block
✅ You want to immediately see which elements a function depends on
✅ Working with related elements that belong together conceptually

**The Choice is Yours:**
- Access elements individually when there are only a few, or when they're used far apart in the code
- Use `destructure()` when you're setting up multiple related elements together
- Both approaches use the same cache and have the same performance characteristics

**Benefits of batch access:**
✅ All dependencies declared in one place — easy to see what a function needs
✅ Cleaner code when initializing components with multiple elements
✅ Same cache behavior — each element cached after first access
✅ Null-safe — missing elements are `null`, not errors

---

## Mental Model — "Grabbing Your Tools Before Starting the Job"

Imagine you're a carpenter about to build a cabinet. You could go to the toolbox and grab one tool at a time as you need each one. Or you could assess the job first, grab everything you'll need, and lay it all out on your workbench before you start.

`destructure()` is the second approach — lay out all your elements before you start the work:

```
Elements.destructure('hammer', 'saw', 'drill', 'screwdriver')
       ↓
  Go to the toolbox (the DOM / cache)
  Grab 'hammer'      → found ✅
  Grab 'saw'         → found ✅
  Grab 'drill'       → found ✅
  Grab 'screwdriver' → NOT found ❌ (null)
       ↓
  Lay them on the workbench: { hammer, saw, drill, screwdriver: null }
       ↓
  Start working — each tool is ready to use (check for null before use)
```

---

## How Does It Work?

`destructure()` (and `getMultiple()`) works by calling the same cache + Proxy system for each ID:

```
Elements.destructure('header', 'nav', 'main', 'sidebar')
       ↓
Step 1: Process each ID:
  'header'  → Check cache → MISS → getElementById → cache it → ✅ element
  'nav'     → Check cache → MISS → getElementById → cache it → ✅ element
  'main'    → Check cache → MISS → getElementById → cache it → ✅ element
  'sidebar' → Check cache → MISS → getElementById → null (not found)

Step 2: Build result object:
  {
    header:  <header id="header">,
    nav:     <nav id="nav">,
    main:    <main id="main">,
    sidebar: null
  }

Step 3: Return the object
  → Destructure it or use as-is
```

**Key point:** Each element goes through the same caching process. If `header` was already cached from a previous access, it returns from cache instantly. Fresh elements get cached for future use.

---

## Basic Usage

### Example 1: Page Structure Initialization

The most common use case — setting up the main areas of a page:

```html
<header id="header">...</header>
<nav id="mainNav">...</nav>
<main id="mainContent">...</main>
<aside id="sidebar"><!-- optional --></aside>
<footer id="footer">...</footer>
```

```javascript
function initializePage() {
  // Get all layout elements in one batch
  const { header, mainNav, mainContent, sidebar, footer } = Elements.destructure(
    'header', 'mainNav', 'mainContent', 'sidebar', 'footer'
  );

  // Required elements — stop if they're missing
  if (!header || !mainContent) {
    console.error('Core page structure missing');
    return;
  }

  // Set up each section (sidebar might be null — that's fine)
  setupHeader(header);
  setupNavigation(mainNav);
  loadContent(mainContent);

  if (sidebar) {
    setupSidebar(sidebar); // Only runs if sidebar exists
  }

  if (footer) {
    setupFooter(footer);
  }

  console.log('✅ Page initialized');
}
```

**What's happening:**
- One `destructure()` call gets all five elements at once
- Each is either a real DOM element or `null`
- We check for null before using optional elements (sidebar, footer may not be on every page)

---

### Example 2: Form Setup

Organize all form elements together before setting up event handlers:

```html
<form id="registrationForm">
  <input id="regName"     type="text"     placeholder="Full Name">
  <input id="regEmail"    type="email"    placeholder="Email">
  <input id="regPassword" type="password" placeholder="Password">
  <input id="regConfirm"  type="password" placeholder="Confirm Password">
  <button id="regSubmit"  type="submit">Create Account</button>
  <p id="regError"></p>
</form>
```

```javascript
function setupRegistrationForm() {
  const { regName, regEmail, regPassword, regConfirm, regSubmit, regError } =
    Elements.destructure(
      'regName', 'regEmail', 'regPassword', 'regConfirm', 'regSubmit', 'regError'
    );

  // All elements laid out — check the critical ones
  if (!regName || !regEmail || !regPassword || !regSubmit) {
    console.error('Registration form incomplete');
    return;
  }

  // Set up validation
  regEmail.addEventListener('blur', () => {
    if (!regEmail.value.includes('@')) {
      regError.textContent = 'Please enter a valid email';
      regError.style.display = 'block';
    }
  });

  // Set up form submission
  regSubmit.addEventListener('click', (e) => {
    e.preventDefault();

    if (regPassword.value !== regConfirm.value) {
      regError.textContent = 'Passwords do not match';
      regError.style.display = 'block';
      return;
    }

    regSubmit.update({ disabled: true, textContent: 'Creating account...' });

    submitRegistration({
      name:     regName.value,
      email:    regEmail.value,
      password: regPassword.value
    });
  });
}
```

---

### Example 3: Component Initialization

When a component depends on several DOM elements, declare them all upfront:

```javascript
class Modal {
  constructor(modalId) {
    // Declare all dependencies in one clear batch
    const elements = Elements.destructure(
      modalId,           // The main modal element
      `${modalId}Title`,
      `${modalId}Body`,
      `${modalId}Close`,
      `${modalId}Submit`
    );

    // Store elements as properties (may be null if not found)
    this.modal   = elements[modalId];
    this.title   = elements[`${modalId}Title`];
    this.body    = elements[`${modalId}Body`];
    this.close   = elements[`${modalId}Close`];
    this.submit  = elements[`${modalId}Submit`];

    if (!this.modal) {
      throw new Error(`Modal element #${modalId} not found`);
    }

    this.setupEventListeners();
  }

  setupEventListeners() {
    if (this.close) {
      this.close.addEventListener('click', () => this.hide());
    }

    if (this.submit) {
      this.submit.addEventListener('click', () => this.onSubmit());
    }

    // Close when clicking the overlay
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.hide();
    });
  }

  show(title, body) {
    if (this.title) this.title.textContent = title;
    if (this.body)  this.body.textContent  = body;

    this.modal.update({
      style:     { display: 'flex' },
      classList: { add: 'is-visible' }
    });
  }

  hide() {
    this.modal.update({
      style:     { display: 'none' },
      classList: { remove: 'is-visible' }
    });
  }
}

const confirmModal = new Modal('confirmModal');
confirmModal.show('Delete Item', 'Are you sure you want to delete this item?');
```

---

### Example 4: Storing the Result Object

You don't have to destructure immediately — you can store the whole object:

```javascript
// Store as an object and access properties later
const formElements = Elements.getMultiple(
  'emailField',
  'passwordField',
  'rememberCheckbox',
  'loginButton',
  'forgotPasswordLink'
);

// Pass the whole object to helper functions
function setupAutoSave(fields) {
  if (!fields.emailField || !fields.passwordField) return;

  // Auto-save email to localStorage
  fields.emailField.addEventListener('change', () => {
    localStorage.setItem('savedEmail', fields.emailField.value);
  });
}

function setupForgotPassword(fields) {
  if (!fields.forgotPasswordLink) return;

  fields.forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    showForgotPasswordDialog(fields.emailField?.value || '');
  });
}

setupAutoSave(formElements);
setupForgotPassword(formElements);
```

---

## Handling Missing Elements

`destructure()` never throws — missing elements are `null`. Here are patterns for handling them:

### Pattern 1: Check Required Elements as a Group

```javascript
const { form, emailInput, submitBtn } = Elements.destructure(
  'loginForm', 'emailInput', 'submitBtn'
);

// All three are required — check them together
if (!form || !emailInput || !submitBtn) {
  console.error('Login form elements missing');
  return;
}

// All three confirmed — safe to proceed
setupLoginForm(form, emailInput, submitBtn);
```

---

### Pattern 2: Check Each Individually for Optional Elements

```javascript
const { mainContent, sidebar, notifications, darkToggle } = Elements.destructure(
  'mainContent', 'sidebar', 'notifications', 'darkToggle'
);

// mainContent is required
if (!mainContent) return;

// Others are optional
if (sidebar)       initializeSidebar(sidebar);
if (notifications) loadNotifications(notifications);
if (darkToggle)    setupDarkMode(darkToggle);
```

---

### Pattern 3: Filter to Just the Found Elements

```javascript
const allElements = Elements.getMultiple('a', 'b', 'c', 'd', 'e');

// Get only the elements that were actually found
const foundElements = Object.entries(allElements)
  .filter(([id, element]) => element !== null)
  .reduce((obj, [id, element]) => {
    obj[id] = element;
    return obj;
  }, {});

console.log('Found:', Object.keys(foundElements).join(', '));
// "Found: a, c, d" (b and e were null)
```

---

## destructure() vs. getMultiple() — Are They Different?

No — they are exactly the same function. `getMultiple()` is an alias for `destructure()`. Use whichever name reads more clearly for your use case:

```javascript
// These are identical:
const { header, footer } = Elements.destructure('header', 'footer');
const { header, footer } = Elements.getMultiple('header', 'footer');

// Common convention:
// Use destructure() when you'll immediately destructure the result
const { form, btn } = Elements.destructure('loginForm', 'submitBtn');

// Use getMultiple() when you'll pass the object around
const formElements = Elements.getMultiple('loginForm', 'emailInput', 'submitBtn');
setupForm(formElements);
```

---

## Comparison: Batch vs. Individual Access

```javascript
// Individual access — one line each
const header  = Elements.pageHeader;
const nav     = Elements.mainNav;
const main    = Elements.mainContent;
const sidebar = Elements.sidebar;
const footer  = Elements.pageFooter;

// Batch access — one operation, same result
const { pageHeader, mainNav, mainContent, sidebar, pageFooter } =
  Elements.destructure('pageHeader', 'mainNav', 'mainContent', 'sidebar', 'pageFooter');
```

**Are there performance differences?**

Minimal. Both approaches use the same cache. The difference is organizational:

| Approach | Best When |
|----------|-----------|
| Individual `Elements.{id}` | 1-2 elements, used far apart in code |
| `destructure()` | 3+ related elements, used together in one function |

---

## Real-World Patterns

### Pattern: Admin Panel Setup

```javascript
function setupAdminPanel() {
  const {
    adminPanel,
    userTable,
    searchInput,
    filterSelect,
    exportBtn,
    paginationNav
  } = Elements.destructure(
    'adminPanel',
    'userTable',
    'searchInput',
    'filterSelect',
    'exportBtn',
    'paginationNav'
  );

  if (!adminPanel || !userTable) {
    console.error('Admin panel requires adminPanel and userTable');
    return;
  }

  // Set up search
  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      filterTable(userTable, searchInput.value);
    }, 300));
  }

  // Set up filter
  if (filterSelect) {
    filterSelect.addEventListener('change', () => {
      applyFilter(userTable, filterSelect.value);
    });
  }

  // Set up export
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportTableData(userTable);
    });
  }

  // Set up pagination
  if (paginationNav) {
    setupPagination(userTable, paginationNav);
  }

  // Load initial data
  loadUsers(userTable);

  adminPanel.classList.add('admin-ready');
  console.log('✅ Admin panel initialized');
}
```

---

### Pattern: Dashboard Widgets

```javascript
async function initializeDashboard() {
  // Get all widget containers in one batch
  const {
    statsWidget,
    revenueChart,
    usersWidget,
    activityFeed,
    notificationsPanel
  } = Elements.destructure(
    'statsWidget',
    'revenueChart',
    'usersWidget',
    'activityFeed',
    'notificationsPanel'
  );

  // Load data for all widgets in parallel
  const [stats, revenue, users, activity] = await Promise.all([
    statsWidget      ? fetchStats()    : Promise.resolve(null),
    revenueChart     ? fetchRevenue()  : Promise.resolve(null),
    usersWidget      ? fetchUsers()    : Promise.resolve(null),
    activityFeed     ? fetchActivity() : Promise.resolve(null)
  ]);

  // Render each widget with its data
  if (statsWidget && stats)          renderStats(statsWidget, stats);
  if (revenueChart && revenue)       renderRevenueChart(revenueChart, revenue);
  if (usersWidget && users)          renderUsers(usersWidget, users);
  if (activityFeed && activity)      renderActivity(activityFeed, activity);
  if (notificationsPanel)            loadNotifications(notificationsPanel);

  console.log('✅ Dashboard ready');
}
```

---

## Best Practices

### ✅ DO: Use for Related Elements That Belong Together

```javascript
// Good — these elements are all part of the same form
const { form, nameField, emailField, submitBtn } = Elements.destructure(
  'contactForm', 'contactName', 'contactEmail', 'contactSubmit'
);
```

### ✅ DO: Null-Check Before Using

```javascript
// Good — destructure, then check what you need
const { header, sidebar } = Elements.destructure('header', 'sidebar');

if (!header) return; // Required
if (sidebar) initializeSidebar(sidebar); // Optional
```

### ✅ DO: Use for Component Dependencies

```javascript
// Good — clearly declares what a component needs
function initializeVideoPlayer() {
  const { videoContainer, playBtn, pauseBtn, progressBar, volumeSlider } =
    Elements.destructure(
      'videoContainer', 'playBtn', 'pauseBtn', 'progressBar', 'volumeSlider'
    );

  if (!videoContainer || !playBtn) {
    console.error('Video player missing required elements');
    return;
  }
  // ... setup ...
}
```

### ❌ DON'T: Use for Just One or Two Elements

```javascript
// Unnecessary complexity for a single element
const { submitBtn } = Elements.destructure('submitBtn');

// Much cleaner
const submitBtn = Elements.submitBtn;
```

### ❌ DON'T: Forget to Null-Check

```javascript
// Bad — sidebar might be null
const { sidebar } = Elements.destructure('sidebar');
sidebar.classList.add('active'); // TypeError if sidebar is null!

// Good — check first
const { sidebar } = Elements.destructure('sidebar');
if (sidebar) {
  sidebar.classList.add('active');
}
```

---

## Summary — Key Takeaways

1. **`Elements.destructure(...ids)`** and **`Elements.getMultiple(...ids)`** are aliases — the same method with two names.

2. **Returns an object** where keys are your IDs and values are elements (or `null` if not found).

3. **No errors thrown** — missing elements are `null`, not exceptions. Use `getRequired()` if you want an error on missing elements.

4. **Same cache system** — each element access goes through the same cache as `Elements.{id}`.

5. **Best for 3+ related elements** — especially during component initialization and page setup.

6. **Always null-check** — destructuring doesn't guarantee elements exist.

---

## What's Next?

Now let's look at what happens when you need all elements to exist — or want an error if any are missing:

Continue to **Required Elements** (`06_required-elements.md`) →