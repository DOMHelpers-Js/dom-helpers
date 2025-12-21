# Understanding `state.$bind()` - A Beginner's Guide

## What is `state.$bind()`?

`state.$bind()` is a **state instance method** that creates reactive bindings between state properties and DOM elements. It automatically syncs DOM elements when state changes, supporting any CSS selector and various binding types.

Think of it as **automatic DOM sync** - define the bindings once, and the DOM updates automatically whenever state changes.

---

## Syntax

```js
const cleanup = state.$bind(bindingDefs)
```

**Parameters:**
- `bindingDefs` (Object): Binding definitions where:
  - Keys: CSS selectors (`#id`, `.class`, `tag`, `[attr]`, etc.)
  - Values: Property name (string) or binding function

**Returns:**
- Cleanup function to remove all bindings

---

## Why Does This Exist?

### The Problem with Manual DOM Updates

When state changes, you manually update the DOM:

```javascript
// Without $bind - manual DOM updates
const app = state({
  count: 0,
  message: 'Hello',
  isActive: false
});

// Update state
app.count = 10;
app.message = 'Updated';
app.isActive = true;

// Manually update DOM (repetitive!)
document.getElementById('counter').textContent = app.count;
document.querySelector('.message').textContent = app.message;
document.querySelector('.status').textContent = app.isActive ? 'Active' : 'Inactive';

// Need effects for reactivity
effect(() => {
  document.getElementById('counter').textContent = app.count;
});

effect(() => {
  document.querySelector('.message').textContent = app.message;
});

effect(() => {
  document.querySelector('.status').textContent = app.isActive ? 'Active' : 'Inactive';
});

// Lots of boilerplate for each binding!
```

**What's the Real Issue?**

**Problems:**
- Manual DOM updates for each change
- Repetitive effect creation
- Verbose and error-prone
- No cleanup management
- Hard to maintain

---

### The Solution with `$bind()`

When you use `$bind()`, DOM updates automatically:

```javascript
// With $bind() - automatic DOM sync
const app = state({
  count: 0,
  message: 'Hello',
  isActive: false
});

// Define bindings once
const cleanup = app.$bind({
  // Bind count to element with ID
  '#counter': 'count',

  // Bind message to elements with class
  '.message': 'message',

  // Bind with transformation function
  '.status': (state) => state.isActive ? 'Active' : 'Inactive',

  // Bind to multiple elements at once
  '[data-count]': 'count'
});

// Now updates happen automatically!
app.count = 10;           // #counter updates to "10"
app.message = 'Updated';  // .message updates to "Updated"
app.isActive = true;      // .status updates to "Active"

// Clean up when done
cleanup();
```

**Benefits:**
- Automatic DOM synchronization
- Declarative binding definitions
- Supports any CSS selector
- Transformation functions
- Easy cleanup
- Less boilerplate

---

## How Does It Work?

### Under the Hood

`$bind()` creates effects for each binding:

```
state.$bind(bindingDefs)
        ↓
1. Iterate through each selector-binding pair
2. Find DOM elements matching selector
3. Create effect that:
   - Watches the bound property
   - Updates element content on change
4. Store cleanup functions
        ↓
Returns cleanup function to remove all bindings
```

---

## Basic Usage

### Bind to Element by ID

```js
const app = state({ count: 0 });

// Bind count to element with id="counter"
app.$bind({
  '#counter': 'count'
});

app.count = 5; // Element updates automatically
app.count = 10; // Element updates again
```

### Bind to Elements by Class

```js
const ui = state({ message: 'Hello' });

// Bind message to all elements with class="message"
ui.$bind({
  '.message': 'message'
});

ui.message = 'World'; // All .message elements update
```

### Bind with Transformation

```js
const user = state({
  firstName: 'John',
  lastName: 'Doe'
});

// Bind computed value
user.$bind({
  '#full-name': (state) => `${state.firstName} ${state.lastName}`
});

user.firstName = 'Jane'; // Updates to "Jane Doe"
```

### Multiple Bindings

```js
const app = state({
  count: 0,
  total: 0,
  message: ''
});

// Bind multiple properties at once
const cleanup = app.$bind({
  '#count-display': 'count',
  '#total-display': 'total',
  '.message': 'message',
  '[data-count]': 'count',
  '.formatted-total': (state) => `$${state.total.toFixed(2)}`
});
```

### Cleanup Bindings

```js
const data = state({ value: 0 });

// Create bindings
const cleanup = data.$bind({
  '#display': 'value'
});

// Later, remove bindings
cleanup();

// Now changes don't update DOM
data.value = 100; // No DOM update
```

---

## Common Use Cases

### Use Case 1: Counter Application

```js
const counter = state({
  count: 0,
  step: 1
});

// Bind counter to UI
counter.$bind({
  // Display count in multiple places
  '#counter-value': 'count',
  '.count-display': 'count',
  '[data-counter]': 'count',

  // Show count with formatting
  '#formatted-count': (state) => `Count: ${state.count}`,

  // Show doubled value
  '#doubled': (state) => state.count * 2,

  // Show current step
  '#step-display': 'step',

  // Status message
  '.status': (state) => {
    if (state.count === 0) return 'Start counting!';
    if (state.count > 0) return 'Positive';
    return 'Negative';
  }
});

// Increment counter
function increment() {
  counter.count += counter.step;
  // All bound elements update automatically!
}

// Decrement counter
function decrement() {
  counter.count -= counter.step;
}

// Change step
function setStep(newStep) {
  counter.step = newStep;
}
```

### Use Case 2: User Profile Display

```js
const profile = state({
  user: {
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Software developer',
    avatar: '/default-avatar.png'
  },
  stats: {
    posts: 42,
    followers: 1234,
    following: 567
  },
  isOnline: false
});

// Bind profile data to UI
profile.$bind({
  // Basic user info
  '#profile-name': (state) => state.user.name,
  '#profile-email': (state) => state.user.email,
  '.bio-text': (state) => state.user.bio,

  // Profile image
  '#avatar': (state) => state.user.avatar,

  // Stats with formatting
  '#post-count': (state) => state.stats.posts.toLocaleString(),
  '#follower-count': (state) => {
    const count = state.stats.followers;
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  },
  '#following-count': (state) => state.stats.following.toLocaleString(),

  // Online status
  '.online-status': (state) => state.isOnline ? 'Online' : 'Offline',
  '.status-indicator': (state) => state.isOnline ? '🟢' : '⚫',

  // Full display
  '.user-summary': (state) =>
    `${state.user.name} - ${state.stats.posts} posts, ${state.stats.followers} followers`
});

// Update profile
profile.user.name = 'Jane Doe';
profile.isOnline = true;
// All UI elements update automatically!
```

### Use Case 3: Shopping Cart

```js
const cart = state({
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 5.99,
  total: 0,
  couponCode: '',
  discount: 0
});

// Computed properties
cart.$computed('subtotal', function() {
  return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

cart.$computed('discount', function() {
  return this.couponCode === 'SAVE10' ? this.subtotal * 0.1 : 0;
});

cart.$computed('tax', function() {
  return (this.subtotal - this.discount) * 0.1;
});

cart.$computed('shipping', function() {
  return this.subtotal > 50 ? 0 : 5.99;
});

cart.$computed('total', function() {
  return this.subtotal - this.discount + this.tax + this.shipping;
});

// Bind cart to UI
cart.$bind({
  // Item count
  '#item-count': (state) => state.items.length,
  '.cart-badge': (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),

  // Financial displays with formatting
  '#cart-subtotal': (state) => `$${state.subtotal.toFixed(2)}`,
  '#cart-discount': (state) => state.discount > 0
    ? `-$${state.discount.toFixed(2)}`
    : '$0.00',
  '#cart-tax': (state) => `$${state.tax.toFixed(2)}`,
  '#cart-shipping': (state) => state.shipping > 0
    ? `$${state.shipping.toFixed(2)}`
    : 'FREE',
  '#cart-total': (state) => `$${state.total.toFixed(2)}`,

  // Status messages
  '.free-shipping-message': (state) => {
    if (state.subtotal >= 50) return 'You have free shipping!';
    const needed = 50 - state.subtotal;
    return `Add $${needed.toFixed(2)} more for free shipping`;
  },

  '.discount-status': (state) =>
    state.discount > 0
      ? `Discount applied: -$${state.discount.toFixed(2)}`
      : 'No discount applied'
});

// Add item to cart
function addToCart(product, quantity) {
  cart.items.push({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: quantity
  });
  // All displays update automatically!
}
```

### Use Case 4: Form Validation

```js
const form = state({
  fields: {
    email: '',
    password: '',
    confirmPassword: ''
  },
  errors: {},
  touched: {},
  isSubmitting: false
});

// Bind form state to UI
form.$bind({
  // Error messages
  '#email-error': (state) => state.errors.email || '',
  '#password-error': (state) => state.errors.password || '',
  '#confirm-error': (state) => state.errors.confirmPassword || '',

  // Field validity classes
  '.email-field': (state) => {
    if (!state.touched.email) return '';
    return state.errors.email ? 'invalid' : 'valid';
  },
  '.password-field': (state) => {
    if (!state.touched.password) return '';
    return state.errors.password ? 'invalid' : 'valid';
  },

  // Submit button state
  '#submit-btn': (state) => {
    if (state.isSubmitting) return 'Submitting...';
    if (Object.keys(state.errors).length > 0) return 'Fix errors';
    return 'Submit';
  },

  // Form status
  '.form-status': (state) => {
    if (state.isSubmitting) return 'Submitting your information...';
    const errorCount = Object.keys(state.errors).length;
    if (errorCount > 0) return `${errorCount} error(s) found`;
    return 'Ready to submit';
  }
});

// Validate email
function validateEmail(email) {
  form.fields.email = email;
  form.touched.email = true;

  if (!email) {
    form.errors.email = 'Email is required';
  } else if (!email.includes('@')) {
    form.errors.email = 'Invalid email';
  } else {
    delete form.errors.email;
  }
  // UI updates automatically!
}
```

### Use Case 5: Real-Time Dashboard

```js
const dashboard = state({
  metrics: {
    activeUsers: 0,
    totalRevenue: 0,
    conversionRate: 0,
    avgResponseTime: 0
  },
  status: {
    server: 'online',
    database: 'online',
    api: 'online'
  },
  lastUpdate: null
});

// Bind dashboard to UI
dashboard.$bind({
  // Metrics with formatting
  '#active-users': (state) => state.metrics.activeUsers.toLocaleString(),
  '#total-revenue': (state) => `$${state.metrics.totalRevenue.toLocaleString()}`,
  '#conversion-rate': (state) => `${state.metrics.conversionRate.toFixed(2)}%`,
  '#response-time': (state) => `${state.metrics.avgResponseTime}ms`,

  // Status indicators
  '.server-status': (state) => {
    const s = state.status;
    const all = [s.server, s.database, s.api];
    const online = all.filter(x => x === 'online').length;
    return `${online}/3 services online`;
  },

  '.server-indicator': (state) => state.status.server === 'online' ? '🟢' : '🔴',
  '.db-indicator': (state) => state.status.database === 'online' ? '🟢' : '🔴',
  '.api-indicator': (state) => state.status.api === 'online' ? '🟢' : '🔴',

  // Last update time
  '.last-updated': (state) =>
    state.lastUpdate ? state.lastUpdate.toLocaleTimeString() : 'Never',

  // Health score
  '#health-score': (state) => {
    const statuses = Object.values(state.status);
    const onlineCount = statuses.filter(s => s === 'online').length;
    return `${(onlineCount / statuses.length * 100).toFixed(0)}%`;
  }
});

// Fetch metrics from API
async function refreshDashboard() {
  const data = await fetch('/api/metrics').then(r => r.json());

  // Update state - all bindings update automatically
  dashboard.metrics = data.metrics;
  dashboard.status = data.status;
  dashboard.lastUpdate = new Date();
}

// Auto-refresh every 30 seconds
setInterval(refreshDashboard, 30000);
```

---

## Advanced Patterns

### Pattern 1: Conditional Bindings

```js
const app = state({
  showDetails: false,
  data: {}
});

let detailsCleanup = null;

// Toggle details view
app.$watch('showDetails', function(show) {
  if (show) {
    // Create bindings when details shown
    detailsCleanup = this.$bind({
      '#detail-view': (state) => JSON.stringify(state.data, null, 2)
    });
  } else {
    // Remove bindings when hidden
    if (detailsCleanup) {
      detailsCleanup();
      detailsCleanup = null;
    }
  }
});
```

### Pattern 2: Scoped Bindings

```js
const app = state({ sections: {} });

// Create bindings for specific section
function bindSection(sectionId, sectionState) {
  return sectionState.$bind({
    [`#${sectionId} .title`]: 'title',
    [`#${sectionId} .content`]: 'content',
    [`#${sectionId} .status`]: (state) => state.isActive ? 'Active' : 'Inactive'
  });
}

// Use scoped bindings
const section1Cleanup = bindSection('section-1', app.sections.section1);
const section2Cleanup = bindSection('section-2', app.sections.section2);
```

### Pattern 3: Dynamic Attribute Binding

```js
const theme = state({
  primaryColor: '#007bff',
  fontSize: 16,
  isDark: false
});

// Bind to element attributes/styles
theme.$bind({
  // CSS custom properties
  ':root': (state) => {
    document.documentElement.style.setProperty('--primary-color', state.primaryColor);
    document.documentElement.style.setProperty('--font-size', `${state.fontSize}px`);
    return '';
  },

  // Body class
  'body': (state) => {
    document.body.className = state.isDark ? 'dark-mode' : 'light-mode';
    return '';
  }
});
```

### Pattern 4: List Rendering

```js
const todos = state({
  items: []
});

// Bind list to container
todos.$bind({
  '#todo-list': (state) => {
    // Render list items
    return state.items.map(todo => `
      <li class="${todo.completed ? 'completed' : ''}">
        ${todo.text}
      </li>
    `).join('');
  },

  // Item count
  '#todo-count': (state) => `${state.items.length} items`
});

// Add todo - list re-renders automatically
todos.items.push({ text: 'New task', completed: false });
```

---

## Performance Tips

### Tip 1: Use Specific Selectors

```js
// GOOD - specific selector
state.$bind({
  '#counter': 'count'
});

// BAD - expensive selector
state.$bind({
  'div > ul > li:first-child': 'count'
});
```

### Tip 2: Clean Up Unused Bindings

```js
// GOOD - clean up when done
const cleanup = state.$bind({ '#display': 'value' });
// Later:
cleanup();

// BAD - never clean up (memory leak)
state.$bind({ '#display': 'value' });
```

### Tip 3: Batch Binding Creation

```js
// GOOD - create all bindings at once
state.$bind({
  '#a': 'propA',
  '#b': 'propB',
  '#c': 'propC'
});

// BAD - multiple $bind calls
state.$bind({ '#a': 'propA' });
state.$bind({ '#b': 'propB' });
state.$bind({ '#c': 'propC' });
```

---

## Common Pitfalls

### Pitfall 1: Binding Before DOM Ready

```js
// WRONG - elements don't exist yet
const cleanup = state.$bind({
  '#my-element': 'value'
});

// RIGHT - wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  const cleanup = state.$bind({
    '#my-element': 'value'
  });
});
```

### Pitfall 2: Not Cleaning Up

```js
// WRONG - memory leak
function createComponent() {
  state.$bind({ '#display': 'value' });
  // Can't clean up later!
}

// RIGHT - return cleanup
function createComponent() {
  const cleanup = state.$bind({ '#display': 'value' });
  return cleanup;
}
```

### Pitfall 3: Binding to Non-Existent Elements

```js
// WRONG - selector doesn't match anything
state.$bind({
  '#does-not-exist': 'value'
  // Silently does nothing
});

// RIGHT - verify element exists
if (document.querySelector('#my-element')) {
  state.$bind({
    '#my-element': 'value'
  });
}
```

---

## Summary

**`state.$bind()` creates reactive DOM bindings.**

Key takeaways:
- ✅ **Automatic DOM sync** when state changes
- ✅ Supports **any CSS selector** (#id, .class, tag, [attr])
- ✅ **Transformation functions** for computed bindings
- ✅ Returns **cleanup function** to remove bindings
- ✅ Great for **counters**, **dashboards**, **forms**, **profiles**
- ⚠️ Wait for **DOM ready** before binding
- ⚠️ Always **clean up** bindings when done
- ⚠️ Use **specific selectors** for performance

**Remember:** Use `$bind()` to automatically sync state to DOM - define once, updates happen automatically! 🎉

➡️ Next, explore [`$update()`]($update.md) for mixed updates or [`$set()`]($set.md) for functional updates!
