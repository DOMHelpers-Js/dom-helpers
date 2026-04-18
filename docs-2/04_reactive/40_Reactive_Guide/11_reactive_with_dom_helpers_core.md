[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Reactive With DOM Helpers Core

## Quick Demonstration

```javascript
// With DOM Helpers Core loaded, every element has .update()
const app = state({ name: 'Alice', score: 100, isActive: true });

effect(() => {
  // One chainable call — handles textContent, classList, and attribute together
  document.getElementById('profile').update({
    textContent: app.name,
    classList: { toggle: ['active', app.isActive] },
    setAttribute: { 'data-score': app.score }
  });
});

// OR — bulk update multiple elements by ID
effect(() => {
  Elements.textContent({
    'player-name': app.name,
    'player-score': app.score,
    'player-status': app.isActive ? 'Active' : 'Offline'
  });
});
```

Clean. Concise. Efficient.

---

## What is DOM Helpers Core?

DOM Helpers Core (`01_dh-core.js`) is the foundational module of the DOM Helpers library. It adds one critical feature to the browser's DOM: **the `.update()` method**.

Every element and collection gets an `.update()` method that:

- Handles **13 different update types** in one call (textContent, style, classList, attributes, events, dataset, and more)
- Uses **fine-grained change detection** — only updates the DOM when the value actually changed
- **Prevents duplicate event listeners** automatically
- **Chains cleanly** — `element.update({...}).update({...})`
- Works on **single elements** and **collections** of elements

When combined with Reactive, the `.update()` method becomes the DOM-update "language" used inside your effects.

---

## Syntax

### Loading

```html
<!-- Load in this order -->
<script src="01_dh-core.js"></script>         <!-- DOM Helpers Core -->
<script src="01_dh-reactive.js"></script>      <!-- Reactive -->
<script src="09_dh-reactiveUtils-shortcut.js"></script>  <!-- Shortcut API -->
```

### `.update()` on a single element

```javascript
document.getElementById('myElement').update({
  textContent: 'New text',
  style: { color: 'red', fontWeight: 'bold' },
  classList: { add: 'highlighted', remove: 'muted' },
  setAttribute: { 'aria-label': 'Important item' },
  dataset: { id: '42', category: 'featured' }
});
```

### `.update()` on a collection

```javascript
document.querySelectorAll('.card').update({
  classList: { add: 'loaded' },    // Applied to ALL cards
  style: { opacity: '1' }          // Applied to ALL cards
});
```

### Bulk ID-based updates with `Elements`

```javascript
// Update multiple elements by ID in one call
Elements.textContent({
  'user-name': 'Alice',
  'user-email': 'alice@example.com',
  'user-role': 'Administrator'
});
```

---

## Why Add DOM Helpers Core to Reactive?

### The Plain JS Repetition Problem

When managing many elements reactively, plain JS gets verbose:

```javascript
// Plain JS inside an effect — repetitive and fragile
effect(() => {
  document.getElementById('user-name').textContent = user.name;
  document.getElementById('user-name').className = user.isAdmin ? 'name admin' : 'name';
  document.getElementById('user-email').textContent = user.email;
  document.getElementById('user-avatar').src = user.avatarUrl;
  document.getElementById('user-avatar').alt = `${user.name}'s avatar`;
  document.getElementById('user-role').textContent = user.role;
  document.getElementById('user-role').setAttribute('data-level', user.accessLevel);
  document.getElementById('admin-badge').hidden = !user.isAdmin;
  document.getElementById('online-indicator').style.backgroundColor =
    user.isOnline ? 'green' : 'gray';
});
```

Each element needs multiple lines. Adding a new element adds more lines. The effect grows.

### The DOM Helpers Core Solution

```javascript
// Same effect — with .update() and bulk methods
effect(() => {
  document.getElementById('user-name').update({
    textContent: user.name,
    className: user.isAdmin ? 'name admin' : 'name'
  });

  document.getElementById('user-avatar').update({
    src: user.avatarUrl,
    alt: `${user.name}'s avatar`
  });

  document.getElementById('user-role').update({
    textContent: user.role,
    setAttribute: { 'data-level': user.accessLevel }
  });

  Elements.textContent({
    'user-email': user.email,
    'online-status': user.isOnline ? 'Online' : 'Offline'
  });

  document.getElementById('admin-badge').update({ hidden: !user.isAdmin });
  document.getElementById('online-indicator').update({
    style: { backgroundColor: user.isOnline ? 'green' : 'gray' }
  });
});
```

Cleaner grouping. Each element's updates are together. Adding a new property is one line.

---

## Mental Model

### `.update()` is a Smart Update Desk

Think of `.update()` as a desk clerk who handles different types of requests:

```
You hand the clerk a form:
{
  textContent: 'Hello',
  style: { color: 'blue' },
  classList: { add: 'active' }
}

The clerk checks each request:
✓ "textContent: Hello" → Is it different? Yes → Update
✓ "style.color: blue"  → Is it different? Yes → Update just that CSS property
✓ "classList: active"  → Need to add? Yes → Add the class

WITHOUT .update():
You have to be your own clerk for each property type.
Every property = different API call = different code style.

WITH .update():
One call. One style. One desk. Clerk handles everything.
```

### Fine-Grained Change Detection

The core module tracks what each element's previous values were:

```
First effect run:
  element.update({ textContent: 'Hello' })
  → Record: element's textContent was set to 'Hello'

Second effect run (textContent didn't change):
  element.update({ textContent: 'Hello' })
  → Check: is 'Hello' different from recorded 'Hello'?
  → No change → Skip DOM update ← Important!

Third effect run (textContent changed):
  element.update({ textContent: 'World' })
  → Check: is 'World' different from recorded 'Hello'?
  → Yes → Update DOM → Record: 'World'
```

Without this, effects update the DOM on every run even when values are identical. With it, the DOM is only touched when something actually changed.

---

## How `.update()` Works Internally

When you call `element.update({ key: value })`, the system runs through a decision tree:

```
applyEnhancedUpdate(element, key, value)
          ↓
Is key "textContent" or "innerText"?
  → Compare with previous → Update if changed

Is key "innerHTML"?
  → Compare with previous → Update if changed

Is key "style"?
  → Object of CSS properties
  → Update each property individually (granular)

Is key "classList"?
  → { add, remove, toggle, replace }
  → Call appropriate classList method

Is key "setAttribute" or "removeAttribute"?
  → Call setAttribute/removeAttribute

Is key "addEventListener"?
  → Check if listener already added (prevent duplicates)
  → Add if new

Is key "dataset"?
  → Assign each data-* attribute

Is key a method name (e.g., "focus", "click")?
  → Call as method with args

Otherwise?
  → Direct property assignment (with change check)
```

This is why `.update()` is so expressive — one call, many possible update types.

---

## Basic Usage: Core + Reactive

### Step 1 — Simple Element Update in Effect

```javascript
const counter = state({ count: 0 });

effect(() => {
  document.getElementById('counter').update({
    textContent: counter.count,
    classList: { toggle: ['zero', counter.count === 0] },
    style: { color: counter.count > 10 ? 'green' : 'inherit' }
  });
});

document.getElementById('inc-btn').addEventListener('click', () => {
  set(counter, { count: prev => prev + 1 });
});
```

**What's happening:** The effect uses `.update()` to set text, toggle a CSS class, and conditionally change color — all in one call. The DOM is only updated when values actually change.

### Step 2 — Bulk Updates with `Elements`

```javascript
const dashboard = state({
  users: 1284,
  revenue: 54200,
  orders: 392,
  newToday: 47
});

effect(() => {
  // Update 4 elements in one organized block
  Elements.textContent({
    'stat-users': dashboard.users.toLocaleString(),
    'stat-revenue': `$${dashboard.revenue.toLocaleString()}`,
    'stat-orders': dashboard.orders.toLocaleString(),
    'stat-new-today': dashboard.newToday
  });
});
```

**What's happening:** `Elements.textContent({...})` takes an object where keys are element IDs and values are the text content. Four elements, one line structure.

### Step 3 — Collection Updates

```javascript
const nav = state({ currentPage: 'home' });

effect(() => {
  // Get all nav links
  const links = document.querySelectorAll('.nav-link');

  // Update the collection
  links.update({
    // classList.remove 'active' from ALL
    classList: { remove: 'active' }
  });

  // Then handle the specific active link
  const activeLink = document.querySelector(`[data-page="${nav.currentPage}"]`);
  if (activeLink) {
    activeLink.update({
      classList: { add: 'active' },
      setAttribute: { 'aria-current': 'page' }
    });
  }
});
```

### Step 4 — Multiple Update Types in One Call

```javascript
const notification = state({
  message: '',
  type: 'info',  // 'info', 'success', 'error', 'warning'
  isVisible: false,
  count: 0
});

effect(() => {
  document.getElementById('notification').update({
    textContent: notification.message,
    hidden: !notification.isVisible,
    className: `notification notification-${notification.type}`,
    setAttribute: {
      role: 'alert',
      'aria-live': notification.type === 'error' ? 'assertive' : 'polite'
    },
    dataset: {
      type: notification.type,
      count: notification.count
    }
  });
});

function showNotification(message, type = 'info') {
  batch(() => {
    notification.message = message;
    notification.type = type;
    notification.isVisible = true;
    set(notification, { count: prev => prev + 1 });
  });

  setTimeout(() => { notification.isVisible = false; }, 3000);
}
```

---

## Deep Dive: The 13 Update Types

DOM Helpers Core handles these update types through `.update()`:

### 1. `textContent` / `innerText`

```javascript
element.update({ textContent: 'New text here' });
element.update({ innerText: 'Formatted text' });
```
Compares with previous value — only updates if changed.

### 2. `innerHTML`

```javascript
element.update({ innerHTML: '<strong>Bold</strong> text' });
```
Compares before updating — avoids unnecessary DOM reflows.

### 3. `style` (granular CSS)

```javascript
element.update({
  style: {
    color: 'red',
    backgroundColor: '#f0f0f0',
    fontSize: '16px',
    display: 'flex',
    opacity: '0.8'
  }
});
```
Updates each CSS property individually — only changed properties are touched.

### 4. `classList` (add, remove, toggle, replace)

```javascript
element.update({
  classList: {
    add: 'active',              // Add one class
    remove: ['old', 'outdated'], // Remove multiple
    toggle: ['visible', isVisible], // Toggle with condition
    replace: ['old-class', 'new-class']
  }
});
```

### 5. `setAttribute` / `removeAttribute`

```javascript
element.update({
  setAttribute: {
    'data-id': '42',
    'aria-label': 'Profile picture',
    role: 'img'
  },
  removeAttribute: ['disabled', 'readonly']
});
```

### 6. `addEventListener` (with duplicate prevention)

```javascript
element.update({
  addEventListener: {
    click: handleClick,
    mouseover: handleHover
  }
});
```
The system tracks which handlers have been added — calling this multiple times does NOT add duplicate listeners.

### 7. `removeEventListener`

```javascript
element.update({
  removeEventListener: {
    click: handleClick
  }
});
```

### 8. `dataset`

```javascript
element.update({
  dataset: {
    userId: '123',
    category: 'premium',
    score: 95
  }
});
```
Maps to `element.dataset.userId`, `element.dataset.category`, etc.

### 9. Direct properties

```javascript
element.update({
  disabled: true,
  hidden: false,
  checked: true,
  value: 'current text',
  placeholder: 'Enter value...',
  src: '/images/photo.jpg'
});
```
Compares before updating.

### 10. `className`

```javascript
element.update({ className: 'card card-featured active' });
```
Replaces the full class string.

---

## Real-World Example: Product Card

```html
<div id="product-card" class="card">
  <img id="product-image" alt="">
  <h3 id="product-name"></h3>
  <p id="product-price"></p>
  <span id="product-badge"></span>
  <button id="add-to-cart-btn">Add to Cart</button>
</div>
```

```javascript
const product = state({
  id: null,
  name: '',
  price: 0,
  image: '',
  inStock: true,
  isNew: false,
  isSale: false,
  salePercent: 0
});

computed(product, {
  displayPrice() {
    if (this.isSale) {
      return `$${(this.price * (1 - this.salePercent / 100)).toFixed(2)}`;
    }
    return `$${this.price.toFixed(2)}`;
  },
  badgeText() {
    if (!this.inStock) return 'Out of Stock';
    if (this.isNew) return 'New';
    if (this.isSale) return `-${this.salePercent}%`;
    return '';
  },
  badgeClass() {
    if (!this.inStock) return 'badge badge-gray';
    if (this.isNew) return 'badge badge-blue';
    if (this.isSale) return 'badge badge-red';
    return '';
  }
});

effect(() => {
  // Image
  document.getElementById('product-image').update({
    src: product.image,
    alt: product.name
  });

  // Text content — bulk update
  Elements.textContent({
    'product-name': product.name,
    'product-price': product.displayPrice
  });

  // Badge — text + class together
  document.getElementById('product-badge').update({
    textContent: product.badgeText,
    className: product.badgeClass,
    hidden: !product.badgeText
  });

  // Button
  document.getElementById('add-to-cart-btn').update({
    disabled: !product.inStock,
    textContent: product.inStock ? 'Add to Cart' : 'Out of Stock',
    classList: { toggle: ['btn-disabled', !product.inStock] }
  });
});

// Load product
async function loadProduct(id) {
  const data = await fetch(`/api/products/${id}`).then(r => r.json());
  batch(() => {
    product.id = data.id;
    product.name = data.name;
    product.price = data.price;
    product.image = data.image;
    product.inStock = data.inStock;
    product.isNew = data.isNew;
    product.isSale = data.isSale;
    product.salePercent = data.salePercent || 0;
  });
}
```

---

## Comparison: Plain JS vs `.update()` Inside Effects

| Task | Plain JS | `.update()` |
|------|---------|------------|
| Set text + class + attribute | 3 separate lines, 3 different APIs | One `.update({})` call |
| Update CSS property | `el.style.color = 'red'` | `.update({ style: { color: 'red' } })` |
| Toggle class with condition | `el.classList.toggle('active', cond)` | `.update({ classList: { toggle: ['active', cond] } })` |
| Multiple elements by ID | Loop or 4 individual querySelector calls | `Elements.textContent({...})` |
| Change detection | Manual — always updates | Automatic — only if changed |
| Duplicate event listeners | Manual tracking required | Handled automatically |

---

## Summary

- **DOM Helpers Core adds `.update()`** to every element and collection
- `.update()` handles **13 update types** in one call — text, styles, classes, attributes, events, dataset
- **Fine-grained change detection** means the DOM only updates when values actually changed
- **`Elements.textContent({...})`** and similar bulk methods let you update many elements by ID in one clean block
- Inside `effect()`, `.update()` replaces verbose plain JS with expressive, organized update calls
- **Duplicate event listeners** are tracked automatically — no accidental re-registrations

**The combination:**
```
Reactive (state layer) + DOM Helpers Core (update layer) =
  Change state → Effect runs → .update() applies only what changed → Clean, efficient DOM
```

Continue to: [12 — Reactive With Enhancers](./12_reactive_with_enhancers.md)