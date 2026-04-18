[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Reactive with Plain JavaScript DOM

## Quick Demonstration

```javascript
// Reactive handles state. Plain JS handles DOM. They work together naturally.
const cart = state({ items: [], isOpen: false });

// Effect: describe what the DOM should look like
effect(() => {
  // Plain JS DOM manipulation inside a reactive effect
  document.getElementById('cart-count').textContent = cart.items.length;
  document.getElementById('cart-panel').style.display = cart.isOpen ? 'block' : 'none';
  document.getElementById('checkout-btn').disabled = cart.items.length === 0;
});

// Just update state — the effect runs automatically
cart.items = [...cart.items, { id: 1, name: 'Apple', price: 1.5 }];
// ↑ DOM updates. No manual DOM calls needed anywhere else.
```

---

## What This Section Is About

This section shows **exactly how Reactive + plain JavaScript DOM manipulation works together** in practice.

You'll see:
- How effects wrap your existing DOM code
- How to keep DOM and state cleanly separated
- Real examples of common DOM tasks done the reactive way
- The difference between "reactive thinking" and "imperative thinking"
- Side-by-side comparisons of before and after adding Reactive

The DOM manipulation in all examples here is **pure vanilla JavaScript** — no extra libraries required.

---

## The Core Idea: Describe, Don't Instruct

Without Reactive, you **instruct** the DOM what to do at specific moments:

```javascript
// Imperative: you tell the DOM WHEN and WHAT to change
function updateUIAfterLogin(user) {
  document.getElementById('user-name').textContent = user.name;
  document.getElementById('user-menu').style.display = 'block';
  document.getElementById('login-btn').style.display = 'none';
  document.title = `${user.name} — Dashboard`;
}

function updateUIAfterLogout() {
  document.getElementById('user-name').textContent = '';
  document.getElementById('user-menu').style.display = 'none';
  document.getElementById('login-btn').style.display = 'block';
  document.title = 'Please Log In';
}
```

With Reactive, you **describe** what the DOM should look like for any given state:

```javascript
// Declarative: you describe WHAT the DOM should be
const auth = state({ user: null });

effect(() => {
  const isLoggedIn = auth.user !== null;

  document.getElementById('user-name').textContent = auth.user?.name || '';
  document.getElementById('user-menu').style.display = isLoggedIn ? 'block' : 'none';
  document.getElementById('login-btn').style.display = isLoggedIn ? 'none' : 'block';
  document.title = isLoggedIn ? `${auth.user.name} — Dashboard` : 'Please Log In';
});

// Now just set state — the effect handles everything
auth.user = fetchedUser;   // → all displays update automatically
auth.user = null;          // → all displays update automatically
```

**The effect is your "template"** — it always reflects the current state. You never have to remember to call it manually.

---

## How It Works Internally

```
Plain JS + Reactive together:

1. You write DOM code inside an effect()
   ↓
2. When effect runs: Reactive intercepts state reads
   ↓
3. Records which state properties were accessed
   ↓
4. When any of those properties change:
   ↓
5. Re-runs your effect — which re-runs your DOM code
   ↓
6. DOM updates to reflect new state

Your DOM code never changes.
The reactive system just calls it at the right times.
```

---

## Syntax: Plain JS Inside Effects

Any plain JavaScript DOM code works inside an effect:

```javascript
const app = state({ value: 0, isVisible: true });

effect(() => {
  // Text content
  document.getElementById('display').textContent = app.value;

  // Style
  document.getElementById('box').style.display = app.isVisible ? 'block' : 'none';
  document.getElementById('box').style.opacity = app.value / 100;

  // CSS class
  document.getElementById('status').classList.toggle('active', app.value > 0);
  document.getElementById('status').className = `status ${app.isVisible ? 'visible' : 'hidden'}`;

  // Attribute
  document.getElementById('progress').setAttribute('value', app.value);
  document.getElementById('btn').setAttribute('aria-label', `Value: ${app.value}`);

  // Property
  document.getElementById('checkbox').checked = app.isVisible;
  document.getElementById('input').disabled = app.value >= 100;

  // Multiple elements
  document.querySelectorAll('.counter').forEach(el => {
    el.textContent = app.value;
  });
});
```

Everything works. The effect runs your code. Reactive decides when to run it.

---

## Real-World Examples

### Example 1 — User Profile Card

**The problem without Reactive:**

```javascript
// Old approach — must call updateProfile() in every code path that changes user data
let currentUser = null;

function updateProfile() {
  if (!currentUser) {
    document.getElementById('profile-section').hidden = true;
    document.getElementById('guest-section').hidden = false;
    return;
  }
  document.getElementById('profile-section').hidden = false;
  document.getElementById('guest-section').hidden = true;
  document.getElementById('user-avatar').src = currentUser.avatar;
  document.getElementById('user-name').textContent = currentUser.name;
  document.getElementById('user-email').textContent = currentUser.email;
  document.getElementById('user-role').textContent = currentUser.role;
  document.getElementById('admin-badge').hidden = currentUser.role !== 'admin';
}

// Must call updateProfile() everywhere
function loginUser(user) {
  currentUser = user;
  updateProfile();  // ← must remember
}

function updateUserRole(role) {
  currentUser.role = role;
  updateProfile();  // ← must remember
}
```

**With Reactive:**

```javascript
const auth = state({ user: null });

// Describe the profile once
effect(() => {
  const user = auth.user;
  const isLoggedIn = user !== null;

  document.getElementById('profile-section').hidden = !isLoggedIn;
  document.getElementById('guest-section').hidden = isLoggedIn;

  if (isLoggedIn) {
    document.getElementById('user-avatar').src = user.avatar;
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-role').textContent = user.role;
    document.getElementById('admin-badge').hidden = user.role !== 'admin';
  }
});

// Now just update state — the effect handles the rest
function loginUser(user) {
  auth.user = user;  // Effect runs automatically
}

function updateUserRole(role) {
  auth.user = { ...auth.user, role };  // Effect runs automatically
}
```

**Why it's better:** One `effect()` describes the whole profile display. You never worry about calling update functions. The display is always correct.

---

### Example 2 — Dynamic Navigation with Active State

```html
<nav id="main-nav">
  <a href="#" data-page="home">Home</a>
  <a href="#" data-page="about">About</a>
  <a href="#" data-page="products">Products</a>
  <a href="#" data-page="contact">Contact</a>
</nav>
<div id="page-content"></div>
```

```javascript
const nav = state({ currentPage: 'home' });

const pages = {
  home: '<h1>Welcome Home</h1><p>Main page content here.</p>',
  about: '<h1>About Us</h1><p>Our story...</p>',
  products: '<h1>Our Products</h1><p>Browse our catalog.</p>',
  contact: '<h1>Contact Us</h1><p>Get in touch.</p>'
};

// Effect: always reflects current active page
effect(() => {
  const current = nav.currentPage;

  // Update active state on all links
  document.querySelectorAll('#main-nav a').forEach(link => {
    const page = link.dataset.page;
    link.classList.toggle('active', page === current);
    link.setAttribute('aria-current', page === current ? 'page' : 'false');
  });

  // Update page content
  document.getElementById('page-content').innerHTML = pages[current] || '';

  // Update document title
  document.title = `${current.charAt(0).toUpperCase() + current.slice(1)} — My Site`;
});

// Navigation just sets state
document.querySelectorAll('#main-nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    nav.currentPage = e.currentTarget.dataset.page;
  });
});
```

**What's happening:**
- The effect always makes the UI match `nav.currentPage`
- Clicking just changes `currentPage`
- The effect handles ALL the DOM work — active class, aria attributes, content, title

---

### Example 3 — Search Filter With Live Results

```html
<input id="search-input" type="text" placeholder="Search...">
<p id="result-count"></p>
<ul id="results-list"></ul>
```

```javascript
const search = state({
  query: '',
  items: [
    { id: 1, name: 'Apple', category: 'fruit' },
    { id: 2, name: 'Banana', category: 'fruit' },
    { id: 3, name: 'Carrot', category: 'vegetable' },
    { id: 4, name: 'Daikon', category: 'vegetable' },
    { id: 5, name: 'Eggplant', category: 'vegetable' }
  ]
});

computed(search, {
  filtered() {
    const q = this.query.toLowerCase().trim();
    if (!q) return this.items;
    return this.items.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }
});

// Effect: render filtered results using plain DOM
effect(() => {
  const results = search.filtered;
  const list = document.getElementById('results-list');

  // Plain JS to render results
  list.innerHTML = results.length
    ? results.map(item => `
        <li>
          <strong>${item.name}</strong>
          <span class="tag">${item.category}</span>
        </li>
      `).join('')
    : '<li class="empty">No results found</li>';

  // Update count
  document.getElementById('result-count').textContent =
    `Showing ${results.length} of ${search.items.length} items`;
});

// Input just updates state
document.getElementById('search-input').addEventListener('input', (e) => {
  search.query = e.target.value;
  // Effect automatically re-runs, filtered recomputes, DOM updates
});
```

**Key insight:** The computed property `filtered` always stays in sync with `query`. The effect always renders `filtered`. You only need to update `search.query` — everything else is automatic.

---

### Example 4 — Modal Dialog

```html
<div id="modal-overlay" class="overlay" hidden>
  <div id="modal" class="modal">
    <h2 id="modal-title"></h2>
    <div id="modal-body"></div>
    <button id="modal-confirm">Confirm</button>
    <button id="modal-cancel">Cancel</button>
  </div>
</div>
```

```javascript
const modal = state({
  isOpen: false,
  title: '',
  body: '',
  onConfirm: null,
  onCancel: null
});

// Describe the modal — always reflects state
effect(() => {
  const overlay = document.getElementById('modal-overlay');
  overlay.hidden = !modal.isOpen;

  if (modal.isOpen) {
    document.getElementById('modal-title').textContent = modal.title;
    document.getElementById('modal-body').innerHTML = modal.body;

    // Prevent scrolling body when modal is open
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Open the modal (API for other code to use)
function openModal({ title, body, onConfirm, onCancel }) {
  batch(() => {
    modal.isOpen = true;
    modal.title = title;
    modal.body = body;
    modal.onConfirm = onConfirm || null;
    modal.onCancel = onCancel || null;
  });
}

function closeModal() {
  modal.isOpen = false;
}

// Button handlers
document.getElementById('modal-confirm').addEventListener('click', () => {
  if (modal.onConfirm) modal.onConfirm();
  closeModal();
});

document.getElementById('modal-cancel').addEventListener('click', () => {
  if (modal.onCancel) modal.onCancel();
  closeModal();
});

document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();  // Click outside
});

// Usage: open modal from anywhere
document.getElementById('delete-btn').addEventListener('click', () => {
  openModal({
    title: 'Confirm Delete',
    body: 'Are you sure you want to delete this item?',
    onConfirm: () => deleteCurrentItem()
  });
});
```

---

### Example 5 — Form With Validation

```javascript
const contactForm = state({
  name: '',
  email: '',
  message: '',
  errors: {},
  isSubmitting: false,
  isSubmitted: false
});

computed(contactForm, {
  isValid() {
    return Object.keys(this.errors).length === 0 &&
           this.name.trim() !== '' &&
           this.email.trim() !== '' &&
           this.message.trim() !== '';
  }
});

// Validation rules
function validate() {
  const errors = {};
  if (!contactForm.name.trim()) errors.name = 'Name is required';
  if (!contactForm.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
    errors.email = 'Enter a valid email';
  }
  if (!contactForm.message.trim()) errors.message = 'Message is required';
  else if (contactForm.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }
  contactForm.errors = errors;
}

// Track inputs
['name', 'email', 'message'].forEach(field => {
  document.getElementById(`field-${field}`).addEventListener('input', (e) => {
    contactForm[field] = e.target.value;
    validate();
  });
});

// Effect: show/hide errors, enable/disable submit
effect(() => {
  ['name', 'email', 'message'].forEach(field => {
    const errorEl = document.getElementById(`error-${field}`);
    if (errorEl) {
      errorEl.textContent = contactForm.errors[field] || '';
      errorEl.hidden = !contactForm.errors[field];
    }
    const inputEl = document.getElementById(`field-${field}`);
    if (inputEl) {
      inputEl.classList.toggle('invalid', !!contactForm.errors[field]);
    }
  });

  document.getElementById('submit-btn').disabled =
    !contactForm.isValid || contactForm.isSubmitting;
  document.getElementById('submit-btn').textContent =
    contactForm.isSubmitting ? 'Sending...' : 'Send Message';

  document.getElementById('success-msg').hidden = !contactForm.isSubmitted;
  document.getElementById('form-section').hidden = contactForm.isSubmitted;
});

// Submit handler
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  validate();
  if (!contactForm.isValid) return;

  contactForm.isSubmitting = true;
  try {
    await submitContactForm({
      name: contactForm.name,
      email: contactForm.email,
      message: contactForm.message
    });
    contactForm.isSubmitted = true;
  } catch (err) {
    contactForm.errors = { submit: 'Failed to send. Please try again.' };
  } finally {
    contactForm.isSubmitting = false;
  }
});
```

---

## Common Patterns: Reactive + Plain JS

### Pattern 1 — innerHTML for Lists

Good for simple lists where items are known:

```javascript
const list = state({ items: [] });

effect(() => {
  document.getElementById('list').innerHTML =
    list.items.map(item => `<li data-id="${item.id}">${item.text}</li>`).join('');
});
```

**When to use:** Simple, non-interactive lists where you control the template string.

### Pattern 2 — Individual Property Updates

Good for targeted, specific updates:

```javascript
const app = state({ count: 0, label: 'Counter' });

effect(() => {
  document.getElementById('count-display').textContent = app.count;
});

effect(() => {
  document.getElementById('count-label').textContent = app.label;
});
```

**When to use:** When each DOM element needs its own focused update logic.

### Pattern 3 — querySelectorAll in Effects

Good for updating groups of elements:

```javascript
const theme = state({ color: 'blue', size: 'medium' });

effect(() => {
  document.querySelectorAll('.themed-element').forEach(el => {
    el.dataset.color = theme.color;
    el.dataset.size = theme.size;
    el.className = `themed-element color-${theme.color} size-${theme.size}`;
  });
});
```

### Pattern 4 — Conditional Sections

Good for showing/hiding entire sections:

```javascript
const ui = state({ view: 'dashboard', isLoading: false, error: null });

effect(() => {
  // Hide all sections first
  document.querySelectorAll('.view-section').forEach(s => s.hidden = true);

  // Show the right one
  if (ui.isLoading) {
    document.getElementById('loading-section').hidden = false;
  } else if (ui.error) {
    document.getElementById('error-section').hidden = false;
    document.getElementById('error-message').textContent = ui.error;
  } else {
    const section = document.getElementById(`view-${ui.view}`);
    if (section) section.hidden = false;
  }
});
```

---

## What You Gain vs Plain JavaScript (No Reactive)

| Scenario | Without Reactive | With Reactive |
|----------|-----------------|---------------|
| Update count in 3 places | Call 3 update functions | Just change `app.count` |
| New display element added | Edit multiple functions | Add one effect line |
| UI out of sync | Common bug | Impossible (effect is always current) |
| Track previous value | Manual variable | `watch()` gives you both values |
| Multiple changes at once | Can cause flicker | `batch()` makes it atomic |
| Derived values | Recompute manually | `computed()` handles it |
| Loading state | Multiple flags, easy to miss | One reactive `isLoading` flag |

---

## Limitations of Reactive + Plain JS

While this combination is powerful, there are areas where it gets repetitive:

**1. Updating many elements by ID requires many individual selectors:**
```javascript
// Gets tedious when many elements need the same pattern
effect(() => {
  document.getElementById('el1').textContent = app.value1;
  document.getElementById('el2').textContent = app.value2;
  document.getElementById('el3').textContent = app.value3;
  // ... more elements
});
```

**2. Updating all elements in a collection with different values:**
```javascript
// Distributing different values to multiple elements is manual work
const cards = document.querySelectorAll('.card');
const titles = ['Title A', 'Title B', 'Title C'];
cards.forEach((card, i) => {
  card.querySelector('h3').textContent = titles[i] || titles[titles.length - 1];
});
```

**3. Fine-grained change detection is manual:**
```javascript
// Without DOM Helpers, you update even when value didn't change
effect(() => {
  document.getElementById('el').textContent = app.value;  // Always sets, even if same
});
```

These aren't blockers — but they're exactly where **DOM Helpers Core** shines. The next section shows how adding the core module to Reactive solves these patterns elegantly.

---

## Summary

- Reactive + plain JavaScript is a **completely valid and powerful combination**
- Write your DOM manipulation code inside `effect()` — it runs when state changes
- `effect()` is your "reactive template" — it always reflects the current state
- `computed()` derives values automatically, so your effects stay simple
- `batch()` prevents intermediate DOM states when making multiple changes
- `watch()` gives you old and new values for specific property changes

**The mental model:**
```
State changes  →  Effect runs  →  DOM updates
(your code)        (automatic)    (plain JS inside effect)
```

This is the foundation. The next step adds `element.update()` from DOM Helpers Core — which makes the DOM manipulation part cleaner, more expressive, and more efficient.

Continue to: [11 — Reactive With DOM Helpers Core](./11_reactive_with_dom_helpers_core.md)