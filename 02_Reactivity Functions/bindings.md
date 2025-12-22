# Understanding `bindings()` - A Beginner's Guide

## Quick Start (30 seconds)

Want to sync reactive state to DOM automatically? Here's how:

```js
// Create reactive state
const user = state({
  name: 'John Doe',
  email: 'john@example.com'
});

// Define DOM bindings declaratively
const cleanup = bindings({
  '#userName': () => user.name,
  '#userEmail': () => user.email
});

// Just change the state - DOM updates automatically!
user.name = 'Jane Smith'; // #userName updates to "Jane Smith"
```

**That's it!** The `bindings()` function creates declarative DOM bindings - you define once what goes where, and the DOM stays in sync with your state automatically!

---

## What is `bindings()`?

`bindings()` is a **standalone utility function** in the Reactive library that creates reactive DOM bindings from a definitions object. It automatically sets up effects that update DOM elements whenever reactive state changes, without needing to pass a state object.

Think of it as **declarative DOM synchronization** - you define which elements should display which values, and it automatically keeps the DOM in sync with your reactive state.

---

## Syntax

```js
// Using the shortcut
const cleanup = bindings(definitions)

// Using the full namespace
const cleanup = ReactiveUtils.bindings(definitions)
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`bindings()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.bindings()`) - Explicit and clear

**Parameters:**
- `definitions` (Object): An object where:
  - **Keys** are CSS selectors (ID, class, tag, attribute, or complex selectors)
  - **Values** are either:
    - A function that returns the value to display
    - An object mapping element properties to functions

**Returns:**
- A cleanup function that stops all the bindings when called

---

## Why Does This Exist?

### The Problem with Manual DOM Updates

When you want to bind state to DOM elements, you need to write effects manually:

```javascript
// Manual approach - verbose and repetitive
const user = state({
  name: 'John Doe',
  email: 'john@example.com',
  status: 'online'
});

// Create separate effects for each element
effect(() => {
  document.getElementById('userName').textContent = user.name;
});

effect(() => {
  document.getElementById('userEmail').textContent = user.email;
});

effect(() => {
  const statusEl = document.getElementById('userStatus');
  statusEl.textContent = user.status;
  statusEl.className = user.status;
});

// Too much boilerplate for simple DOM bindings!
```

**What's the Real Issue?**

```
Manual Effect-Based Binding:
┌──────────────────────┐
│ effect(() => {       │
│   get element        │
│   update content     │
│ })                   │
└──────────────────────┘
┌──────────────────────┐
│ effect(() => {       │
│   get element        │
│   update content     │
│ })                   │
└──────────────────────┘
┌──────────────────────┐
│ effect(() => {       │
│   get element        │
│   update content     │
│ })                   │
└──────────────────────┘

Repetitive!
Scattered code!
Hard to overview!
```

**Problems:**
- Must write separate `effect()` for each binding
- Must manually query DOM elements
- Repetitive `document.getElementById()` or `querySelector()` calls
- Hard to see all bindings at once
- More verbose than necessary
- No declarative structure

**Why This Becomes a Problem:**

For DOM synchronization:

❌ Too much boilerplate
❌ Repetitive element queries
❌ No clear binding definition
❌ Hard to maintain
❌ Scattered across code

In other words, **binding state to DOM requires too much manual work**. There should be a declarative way to define DOM bindings.

### The Solution with `bindings()`

When you use `bindings()`, you define all DOM bindings declaratively:

```javascript
// Clean approach - declarative and organized
const user = state({
  name: 'John Doe',
  email: 'john@example.com',
  status: 'online'
});

const cleanup = bindings({
  '#userName': () => user.name,

  '#userEmail': () => user.email,

  '#userStatus': () => user.status,

  '.status-indicator': {
    textContent: () => user.status,
    className: () => user.status
  }
});

// Clean, declarative, and automatic!
// DOM updates automatically when user changes
```

**What Just Happened?**

```
bindings() Approach:
┌──────────────────────┐
│ Define all bindings  │
│ in ONE object:       │
│                      │
│ {                    │
│   '#el1': fn,        │
│   '#el2': fn,        │ ✓ Clear!
│   '#el3': fn         │ ✓ Organized!
│ }                    │ ✓ Declarative!
└──────────────────────┘

All bindings visible!
Effects created automatically!
Clean and maintainable!
```

With `bindings()`:
- All bindings defined in one object
- CSS selectors as keys
- Functions return reactive values
- Automatic DOM updates
- Single cleanup function

**Benefits:**
- ✅ Declarative syntax
- ✅ Clear structure
- ✅ Automatic reactivity
- ✅ Less boilerplate
- ✅ Easier to maintain

---

## Mental Model

Think of `bindings()` like a **smart TV guide with auto-sync**:

```
Manual Effects (Old TV):
┌────────────────────────┐
│  Channel 1 Guide       │
│  → Manually check      │
│  → Write what's on     │
│                        │
│  Channel 2 Guide       │
│  → Manually check      │
│  → Write what's on     │
│                        │
│  Channel 3 Guide       │
│  → Manually check      │
│  → Write what's on     │
└────────────────────────┘

Manual, repetitive,
easy to miss updates


bindings() (Smart Guide):
┌────────────────────────┐
│  📺 Auto-Sync Guide    │
│                        │
│  Channel 1: [Auto]     │
│  Channel 2: [Auto]     │
│  Channel 3: [Auto]     │
│                        │
│  Define once:          │
│  {                     │
│    ch1: → source,      │
│    ch2: → source,      │
│    ch3: → source       │
│  }                     │
│                        │
│  Guide updates         │
│  automatically!        │
└────────────────────────┘

Automatic, clean,
always in sync
```

**Key Insight:** Just like a smart TV guide automatically displays current programming from the source, `bindings()` automatically updates DOM elements from your reactive state - you define the connections once, and everything stays in sync.

---

## How Does It Work?

### Under the Hood

`bindings()` creates effects that update DOM elements:

```
bindings(definitions)
        ↓
┌──────────────────────────┐
│ For each selector:       │
│                          │
│ 1. Find DOM elements     │
│    matching selector     │
│                          │
│ 2. For each element,     │
│    create effect         │
│                          │
│ 3. Effect calls function │
│    and applies value     │
│                          │
│ 4. Store cleanup         │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Return single cleanup    │
│ function for all         │
│ bindings                 │
└──────────────────────────┘
```

**What happens:**

1. Takes a definitions object
2. For each key (selector), finds matching DOM elements:
   - ID selector (#id) → `getElementById`
   - Class selector (.class) → `getElementsByClassName`
   - Other → `querySelectorAll`
3. For each element, creates an effect
4. Effect runs the function and applies the value
5. Handles different value types (string, number, object, array)
6. Returns cleanup function to stop all effects

---

## Basic Usage

### Simple Property Binding

The simplest way to use `bindings()`:

```js
// Using the shortcut style
const app = state({
  title: 'My App',
  count: 0
});

const cleanup = bindings({
  '#appTitle': () => app.title,
  '#counter': () => app.count
});

// Or using the namespace style
const cleanup = ReactiveUtils.bindings({
  '#appTitle': () => app.title
});

app.title = 'New Title'; // #appTitle updates automatically
app.count = 5;           // #counter updates automatically

// Stop bindings
cleanup();
```

### Class Selector (Multiple Elements)

Bind to all elements with a class:

```js
const app = state({
  userName: 'John Doe',
  lastUpdate: new Date()
});

bindings({
  // Binds to ALL elements with class 'user-name'
  '.user-name': () => app.userName,

  // Binds to ALL elements with class 'timestamp'
  '.timestamp': () => app.lastUpdate.toLocaleString()
});

// All .user-name elements update when userName changes
app.userName = 'Jane Smith';
```

### Complex Selectors

Use any valid CSS selector:

```js
const data = state({
  message: 'Hello',
  count: 42
});

bindings({
  // ID selector
  '#message': () => data.message,

  // Tag selector
  'h1': () => data.message,

  // Attribute selector
  '[data-role="status"]': () => data.count,

  // Complex selector
  'div.container > p.message': () => data.message,

  // Multiple selectors (comma-separated)
  '.primary-heading, .secondary-heading': () => `${data.message} (${data.count})`
});
```

### Property-Specific Bindings

Bind to specific element properties:

```js
const form = state({
  username: '',
  isValid: false,
  isSubmitting: false
});

bindings({
  '#username': {
    value: () => form.username,
    className: () => form.isValid ? 'valid' : 'invalid'
  },

  '#submitBtn': {
    disabled: () => !form.isValid || form.isSubmitting,
    textContent: () => form.isSubmitting ? 'Submitting...' : 'Submit'
  }
});
```

### Style Bindings

Bind to element styles:

```js
const ui = state({
  sidebarOpen: true,
  theme: 'light',
  progress: 0
});

bindings({
  '#sidebar': {
    style: () => ({
      display: ui.sidebarOpen ? 'block' : 'none',
      backgroundColor: ui.theme === 'dark' ? '#333' : '#fff'
    })
  },

  '#progressBar': {
    style: () => ({
      width: `${ui.progress}%`,
      backgroundColor: ui.progress === 100 ? 'green' : 'blue'
    })
  }
});
```

---

## Common Use Cases

### Use Case 1: User Profile Display

Display user information:

```js
const user = state({
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/images/avatar.jpg',
  bio: 'Software developer',
  followers: 1234,
  following: 567,
  isOnline: true
});

bindings({
  '.user-name': () => user.name,

  '.user-email': () => user.email,

  '#userAvatar': {
    src: () => user.avatar,
    alt: () => user.name
  },

  '#userBio': () => user.bio,

  '#followerCount': () => user.followers.toLocaleString(),

  '#followingCount': () => user.following.toLocaleString(),

  '.online-status': {
    textContent: () => user.isOnline ? 'Online' : 'Offline',
    className: () => user.isOnline ? 'status-online' : 'status-offline'
  }
});
```

### Use Case 2: Shopping Cart Display

Update cart UI:

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

bindings({
  '#cartItemCount': () => cart.items.length,

  '#cartBadge': {
    textContent: () => cart.items.length,
    style: () => ({
      display: cart.items.length > 0 ? 'inline-block' : 'none'
    })
  },

  '#subtotal': () => `$${cart.subtotal.toFixed(2)}`,

  '#tax': () => `$${cart.tax.toFixed(2)}`,

  '#shipping': () => `$${cart.shipping.toFixed(2)}`,

  '#discount': {
    textContent: () => cart.discount > 0 ? `-$${(cart.subtotal * cart.discount).toFixed(2)}` : '',
    style: () => ({
      display: cart.discount > 0 ? 'block' : 'none'
    })
  },

  '#total': () => `$${cart.total.toFixed(2)}`,

  '#checkoutBtn': {
    disabled: () => cart.items.length === 0,
    textContent: () => cart.items.length > 0 ? 'Proceed to Checkout' : 'Cart is Empty'
  },

  '#emptyCartMessage': {
    style: () => ({
      display: cart.items.length === 0 ? 'block' : 'none'
    })
  }
});
```

### Use Case 3: Form Status Indicators

Show form validation status:

```js
const form = state({
  values: {
    email: '',
    password: ''
  },
  errors: {},
  touched: {},
  isSubmitting: false,
  isValid: true
});

bindings({
  '#emailInput': {
    value: () => form.values.email,
    className: () => {
      if (!form.touched.email) return '';
      return form.errors.email ? 'invalid' : 'valid';
    }
  },

  '#emailError': {
    textContent: () => form.errors.email || '',
    style: () => ({
      display: form.errors.email ? 'block' : 'none'
    })
  },

  '#passwordInput': {
    value: () => form.values.password,
    className: () => {
      if (!form.touched.password) return '';
      return form.errors.password ? 'invalid' : 'valid';
    }
  },

  '#passwordError': {
    textContent: () => form.errors.password || '',
    style: () => ({
      display: form.errors.password ? 'block' : 'none'
    })
  },

  '#submitBtn': {
    disabled: () => !form.isValid || form.isSubmitting,
    textContent: () => form.isSubmitting ? 'Signing in...' : 'Sign In',
    className: () => form.isSubmitting ? 'btn-loading' : 'btn-primary'
  },

  '#formStatus': {
    textContent: () => {
      if (form.isSubmitting) return 'Submitting...';
      if (!form.isValid) return 'Please fix errors';
      return 'Ready to submit';
    },
    className: () => {
      if (form.isSubmitting) return 'status-loading';
      if (!form.isValid) return 'status-error';
      return 'status-ready';
    }
  }
});
```

### Use Case 4: Dashboard Metrics

Display analytics dashboard:

```js
const analytics = state({
  visitors: 0,
  pageViews: 0,
  bounceRate: 0,
  avgSessionTime: 0,
  revenue: 0,
  conversions: 0,
  loading: false,
  trend: 'up'
});

bindings({
  '#visitorsCount': () => analytics.visitors.toLocaleString(),

  '#pageViewsCount': () => analytics.pageViews.toLocaleString(),

  '#bounceRate': () => `${(analytics.bounceRate * 100).toFixed(1)}%`,

  '#avgSessionTime': () => {
    const minutes = Math.floor(analytics.avgSessionTime / 60);
    const seconds = analytics.avgSessionTime % 60;
    return `${minutes}m ${seconds}s`;
  },

  '#revenue': () => `$${analytics.revenue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`,

  '#conversions': () => analytics.conversions,

  '#conversionRate': () => {
    if (analytics.visitors === 0) return '0%';
    return `${((analytics.conversions / analytics.visitors) * 100).toFixed(2)}%`;
  },

  '.metric': {
    className: () => analytics.loading ? 'metric loading' : 'metric'
  },

  '#trendIndicator': {
    textContent: () => analytics.trend === 'up' ? '↑' : analytics.trend === 'down' ? '↓' : '→',
    className: () => `trend trend-${analytics.trend}`
  },

  '#loadingSpinner': {
    style: () => ({
      display: analytics.loading ? 'block' : 'none'
    })
  }
});
```

### Use Case 5: Notification System

Display notifications:

```js
const notifications = state({
  messages: [],
  unreadCount: 0,
  isOpen: false
});

bindings({
  '#notificationBadge': {
    textContent: () => notifications.unreadCount,
    style: () => ({
      display: notifications.unreadCount > 0 ? 'inline-block' : 'none'
    }),
    className: () => notifications.unreadCount > 9 ? 'badge badge-large' : 'badge'
  },

  '#notificationPanel': {
    className: () => notifications.isOpen ? 'panel panel-open' : 'panel',
    style: () => ({
      display: notifications.isOpen ? 'block' : 'none'
    })
  },

  '#notificationList': () => {
    if (notifications.messages.length === 0) {
      return '<p class="empty">No notifications</p>';
    }

    return notifications.messages.map(msg => `
      <div class="notification ${msg.read ? 'read' : 'unread'}">
        <h4>${msg.title}</h4>
        <p>${msg.message}</p>
        <span class="time">${formatTime(msg.timestamp)}</span>
      </div>
    `).join('');
  },

  '#notificationCount': () => {
    const count = notifications.messages.length;
    return count === 0 ? 'No notifications' :
           count === 1 ? '1 notification' :
           `${count} notifications`;
  }
});

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
}
```

### Use Case 6: Theme Switcher

Manage app theme with bindings:

```js
const settings = state({
  theme: 'light',
  fontSize: 14,
  highContrast: false
});

bindings({
  'body': {
    className: () => {
      const classes = ['app'];
      classes.push(`theme-${settings.theme}`);
      if (settings.highContrast) classes.push('high-contrast');
      return classes.join(' ');
    },
    style: () => ({
      fontSize: `${settings.fontSize}px`
    })
  },

  '#currentTheme': () => settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1),

  '#fontSize': () => `${settings.fontSize}px`,

  '#themeToggle': {
    textContent: () => settings.theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'
  }
});

// Update theme
function toggleTheme() {
  settings.theme = settings.theme === 'light' ? 'dark' : 'light';
}

function increaseFontSize() {
  if (settings.fontSize < 24) settings.fontSize++;
}

function decreaseFontSize() {
  if (settings.fontSize > 10) settings.fontSize--;
}
```

### Use Case 7: Progress Tracker

Track and display progress:

```js
const upload = state({
  fileName: '',
  fileSize: 0,
  uploadedBytes: 0,
  speed: 0,
  status: 'idle', // 'idle', 'uploading', 'complete', 'error'
  error: null
});

// Add computed for progress percentage
upload.$computed('progress', function() {
  return this.fileSize > 0 ? (this.uploadedBytes / this.fileSize) * 100 : 0;
});

upload.$computed('remainingTime', function() {
  if (this.speed === 0) return 'Calculating...';
  const remaining = (this.fileSize - this.uploadedBytes) / this.speed;
  const minutes = Math.floor(remaining / 60);
  const seconds = Math.floor(remaining % 60);
  return `${minutes}m ${seconds}s`;
});

bindings({
  '#fileName': () => upload.fileName || 'No file selected',

  '#fileSize': () => `${(upload.fileSize / 1024 / 1024).toFixed(2)} MB`,

  '#progressBar': {
    style: () => ({
      width: `${upload.progress}%`,
      backgroundColor: upload.status === 'error' ? 'red' :
                      upload.status === 'complete' ? 'green' : 'blue'
    })
  },

  '#progressText': () => `${upload.progress.toFixed(1)}%`,

  '#uploadSpeed': () => `${(upload.speed / 1024 / 1024).toFixed(2)} MB/s`,

  '#remainingTime': () => upload.remainingTime,

  '#uploadStatus': {
    textContent: () => {
      switch (upload.status) {
        case 'uploading': return 'Uploading...';
        case 'complete': return 'Upload complete!';
        case 'error': return `Error: ${upload.error}`;
        default: return 'Ready';
      }
    },
    className: () => `status status-${upload.status}`
  },

  '#uploadBtn': {
    disabled: () => upload.status === 'uploading',
    textContent: () => upload.status === 'uploading' ? 'Uploading...' : 'Upload'
  }
});
```

---

## Advanced Patterns

### Pattern 1: Conditional Rendering

Show/hide elements based on state:

```js
const app = state({
  isLoggedIn: false,
  user: null,
  hasNotifications: false
});

bindings({
  '#loginPanel': {
    style: () => ({
      display: !app.isLoggedIn ? 'block' : 'none'
    })
  },

  '#userPanel': {
    style: () => ({
      display: app.isLoggedIn ? 'block' : 'none'
    })
  },

  '#notificationBell': {
    className: () => app.hasNotifications ? 'bell bell-active' : 'bell'
  },

  '#userName': () => app.user ? app.user.name : 'Guest'
});
```

### Pattern 2: List Rendering

Render lists of items:

```js
const todos = state({
  items: [],
  filter: 'all'
});

bindings({
  '#todoList': () => {
    const filtered = todos.items.filter(todo => {
      if (todos.filter === 'active') return !todo.completed;
      if (todos.filter === 'completed') return todo.completed;
      return true;
    });

    return filtered.map(todo => `
      <li class="${todo.completed ? 'completed' : ''}">
        <input type="checkbox"
               ${todo.completed ? 'checked' : ''}
               onchange="toggleTodo(${todo.id})">
        <span>${todo.text}</span>
        <button onclick="removeTodo(${todo.id})">×</button>
      </li>
    `).join('');
  },

  '#todoCount': () => {
    const active = todos.items.filter(t => !t.completed).length;
    return `${active} ${active === 1 ? 'item' : 'items'} left`;
  }
});
```

### Pattern 3: Dynamic Classes

Apply classes dynamically:

```js
const ui = state({
  theme: 'light',
  sidebarOpen: true,
  isPremium: false
});

bindings({
  'body': {
    className: () => {
      const classes = ['app'];
      classes.push(`theme-${ui.theme}`);
      if (ui.sidebarOpen) classes.push('sidebar-open');
      if (ui.isPremium) classes.push('premium');
      return classes.join(' ');
    }
  },

  '#sidebar': {
    className: () => ui.sidebarOpen ? 'sidebar active' : 'sidebar'
  }
});
```

### Pattern 4: Computed Bindings

Use computed values in bindings:

```js
const order = state({
  items: [],
  taxRate: 0.1
});

order.$computed('subtotal', function() {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

order.$computed('tax', function() {
  return this.subtotal * this.taxRate;
});

order.$computed('total', function() {
  return this.subtotal + this.tax;
});

bindings({
  '#subtotal': () => `$${order.subtotal.toFixed(2)}`,
  '#tax': () => `$${order.tax.toFixed(2)}`,
  '#total': () => `$${order.total.toFixed(2)}`
});
```

### Pattern 5: Multi-Property Object Bindings

Bind multiple properties at once:

```js
const button = state({
  text: 'Click Me',
  disabled: false,
  variant: 'primary',
  loading: false
});

bindings({
  '#actionBtn': {
    textContent: () => button.loading ? 'Loading...' : button.text,
    disabled: () => button.disabled || button.loading,
    className: () => {
      const classes = ['btn', `btn-${button.variant}`];
      if (button.loading) classes.push('btn-loading');
      if (button.disabled) classes.push('btn-disabled');
      return classes.join(' ');
    },
    style: () => ({
      opacity: button.disabled ? '0.5' : '1',
      cursor: button.disabled ? 'not-allowed' : 'pointer'
    })
  }
});
```

### Pattern 6: Scoped Bindings

Create bindings for component scopes:

```js
function createComponentBindings(container, data) {
  const scope = `#${container}`;

  return bindings({
    [`${scope} .title`]: () => data.title,
    [`${scope} .description`]: () => data.description,
    [`${scope} .status`]: {
      textContent: () => data.status,
      className: () => `status-${data.status}`
    }
  });
}

// Usage
const componentData = state({ title: 'Component', description: 'Description', status: 'active' });
const cleanup = createComponentBindings('myComponent', componentData);
```

---

## Performance Tips

### Tip 1: Use Specific Selectors

More specific selectors are faster:

```js
// ✅ Good - specific ID selector (fastest)
bindings({
  '#userName': () => user.name
});

// ❌ Less efficient - complex selector
bindings({
  'div.user > span.name': () => user.name
});
```

### Tip 2: Batch Related Bindings

Group related property updates:

```js
// ✅ More efficient - one element, multiple properties
bindings({
  '#status': {
    textContent: () => app.status,
    className: () => `status-${app.status}`,
    style: () => ({ color: app.statusColor })
  }
});

// ❌ Less efficient - separate bindings
bindings({
  '#status': () => app.status
});
bindings({
  '#status': {
    className: () => `status-${app.status}`
  }
});
```

### Tip 3: Clean Up When Done

Stop bindings when component unmounts:

```js
let cleanup;

function mountComponent() {
  cleanup = bindings({
    '#content': () => state.content
  });
}

function unmountComponent() {
  if (cleanup) {
    cleanup();
    cleanup = null;
  }
}
```

### Tip 4: Avoid Heavy Computations in Bindings

Pre-compute expensive values using `$computed`:

```js
const data = state({
  items: []
});

// ❌ Bad - expensive operation on every render
bindings({
  '#result': () => {
    return data.items
      .filter(i => i.active)
      .map(i => i.value)
      .sort()
      .join(', ');
  }
});

// ✅ Good - use computed
data.$computed('result', function() {
  return this.items
    .filter(i => i.active)
    .map(i => i.value)
    .sort()
    .join(', ');
});

bindings({
  '#result': () => data.result
});
```

---

## Common Pitfalls

### Pitfall 1: Modifying State in Bindings

**Problem:** Binding functions should only read, not write:

```js
// ❌ Wrong - modifying state
bindings({
  '#count': () => {
    state.count++; // DON'T modify in bindings!
    return state.count;
  }
});

// ✅ Right - only read
bindings({
  '#count': () => state.count
});
```

### Pitfall 2: Binding Before DOM Ready

**Problem:** Elements don't exist yet:

```js
// ❌ Bad - runs before DOM ready
bindings({
  '#myElement': () => state.value
});

// ✅ Good - wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  bindings({
    '#myElement': () => state.value
  });
});
```

### Pitfall 3: Not Returning Value

**Problem:** Forgetting to return from binding function:

```js
// ❌ Wrong - no return
bindings({
  '#message': () => {
    state.message; // Forgot return!
  }
});

// ✅ Right - return value
bindings({
  '#message': () => state.message
});
```

### Pitfall 4: Using Non-Reactive Values

**Problem:** Binding to non-reactive values:

```js
const nonReactive = { count: 0 };

// ❌ Bad - not reactive
bindings({
  '#count': () => nonReactive.count // Won't update!
});

// ✅ Good - use reactive state
const reactive = state({ count: 0 });
bindings({
  '#count': () => reactive.count // Updates automatically
});
```

### Pitfall 5: Arrow Functions with Wrong Context

**Problem:** Using arrow functions when `this` context matters:

```js
const obj = state({
  firstName: 'John',
  lastName: 'Doe'
});

// ❌ May not work as expected with `this`
obj.getFullName = () => `${this.firstName} ${this.lastName}`;

// ✅ Use regular function for methods
obj.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

bindings({
  '#fullName': () => obj.getFullName()
});
```

---

## Real-World Example: Complete Dashboard

Here's a complete dashboard using `bindings()`:

```js
// Application state
const dashboard = state({
  user: {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/avatar.jpg',
    role: 'Admin'
  },
  stats: {
    users: 1234,
    revenue: 45678.90,
    orders: 890,
    growth: 12.5
  },
  notifications: {
    count: 5,
    unread: 3,
    isOpen: false
  },
  ui: {
    sidebarOpen: true,
    theme: 'light',
    loading: false
  }
});

// Create all bindings
const cleanup = bindings({
  // User info
  '#userName': () => dashboard.user.name,
  '#userEmail': () => dashboard.user.email,
  '#userRole': () => dashboard.user.role,
  '#userAvatar': {
    src: () => dashboard.user.avatar,
    alt: () => dashboard.user.name
  },

  // Stats
  '#usersCount': () => dashboard.stats.users.toLocaleString(),
  '#revenue': () => `$${dashboard.stats.revenue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`,
  '#ordersCount': () => dashboard.stats.orders.toLocaleString(),
  '#growthRate': {
    textContent: () => `${dashboard.stats.growth > 0 ? '+' : ''}${dashboard.stats.growth}%`,
    className: () => dashboard.stats.growth > 0 ? 'growth positive' : 'growth negative'
  },

  // Notifications
  '#notificationCount': {
    textContent: () => dashboard.notifications.count,
    style: () => ({
      display: dashboard.notifications.count > 0 ? 'inline-block' : 'none'
    })
  },
  '#notificationPanel': {
    className: () => dashboard.notifications.isOpen ? 'panel open' : 'panel'
  },
  '#unreadIndicator': {
    textContent: () => `${dashboard.notifications.unread} unread`,
    style: () => ({
      display: dashboard.notifications.unread > 0 ? 'block' : 'none'
    })
  },

  // UI state
  'body': {
    className: () => {
      const classes = ['dashboard'];
      classes.push(`theme-${dashboard.ui.theme}`);
      if (dashboard.ui.sidebarOpen) classes.push('sidebar-open');
      if (dashboard.ui.loading) classes.push('loading');
      return classes.join(' ');
    }
  },
  '#sidebar': {
    className: () => dashboard.ui.sidebarOpen ? 'sidebar active' : 'sidebar'
  },
  '#loadingOverlay': {
    style: () => ({
      display: dashboard.ui.loading ? 'flex' : 'none'
    })
  },
  '#themeToggle': {
    textContent: () => dashboard.ui.theme === 'light' ? '🌙' : '☀️'
  }
});

// Functions to modify state
function toggleSidebar() {
  dashboard.ui.sidebarOpen = !dashboard.ui.sidebarOpen;
}

function toggleTheme() {
  dashboard.ui.theme = dashboard.ui.theme === 'light' ? 'dark' : 'light';
}

function toggleNotifications() {
  dashboard.notifications.isOpen = !dashboard.notifications.isOpen;
}

function loadDashboardData() {
  dashboard.ui.loading = true;

  fetch('/api/dashboard')
    .then(res => res.json())
    .then(data => {
      dashboard.stats.users = data.users;
      dashboard.stats.revenue = data.revenue;
      dashboard.stats.orders = data.orders;
      dashboard.stats.growth = data.growth;
    })
    .finally(() => {
      dashboard.ui.loading = false;
    });
}

// Initialize
loadDashboardData();
```

---

## FAQ

**Q: When should I use `bindings()` vs `$bind()`?**

A: Use `bindings()` for **standalone** DOM binding without a specific state object. Use `$bind()` when you want to bind **to a specific state object**:

```js
// bindings() - standalone, any reactive state
const user = state({ name: 'John' });
bindings({
  '#name': () => user.name
});

// $bind() - bound to specific state
const user = state({ name: 'John' });
user.$bind({
  '#name': 'name'
});
```

**Q: Can I bind to elements that don't exist yet?**

A: No. Ensure DOM elements exist before creating bindings. If elements are added dynamically, create bindings after adding them:

```js
// ❌ Element doesn't exist yet
bindings({ '#dynamic': () => state.value });

// ✅ Create element first
document.body.innerHTML += '<div id="dynamic"></div>';
bindings({ '#dynamic': () => state.value });
```

**Q: How do I update innerHTML or HTML content?**

A: Return the HTML string from the binding function:

```js
bindings({
  '#container': () => `
    <div class="content">
      <h1>${state.title}</h1>
      <p>${state.description}</p>
    </div>
  `
});
```

**Q: Can I bind to attributes like data-* attributes?**

A: Yes! Use object syntax with the attribute name:

```js
bindings({
  '#element': {
    'data-status': () => state.status,
    'data-id': () => state.id
  }
});
```

**Q: Does `bindings()` work with SVG elements?**

A: Yes! It works with any DOM element including SVG:

```js
bindings({
  'circle': {
    cx: () => state.x,
    cy: () => state.y,
    r: () => state.radius,
    fill: () => state.color
  }
});
```

**Q: How do I bind to input values bidirectionally?**

A: `bindings()` is one-way (state → DOM). For two-way binding, add event listeners:

```js
const form = state({ email: '' });

// One-way binding: state → DOM
bindings({
  '#email': {
    value: () => form.email
  }
});

// Two-way: DOM → state
document.getElementById('email').oninput = (e) => {
  form.email = e.target.value;
};
```

**Q: Can I stop and restart bindings?**

A: Yes! Call the cleanup function to stop, then create new bindings:

```js
let cleanup = bindings({ '#el': () => state.value });

// Stop
cleanup();

// Restart
cleanup = bindings({ '#el': () => state.value });
```

**Q: What happens if my binding function throws an error?**

A: The error will be caught and logged, but won't break other bindings. Check console for errors.

**Q: Can I use bindings with refs?**

A: Yes! Use `.value` to access ref values:

```js
const count = ref(0);
const message = ref('Hello');

bindings({
  '#count': () => count.value,
  '#message': () => message.value
});
```

---

## Summary

**`bindings()` creates declarative reactive DOM bindings.**

Key takeaways:

✅ **Declarative DOM binding** - define all bindings in one object
✅ Both **shortcut** (`bindings()`) and **namespace** (`ReactiveUtils.bindings()`) styles are valid
✅ Supports **any CSS selector** (ID, class, tag, attribute, complex)
✅ **Function values** return reactive content
✅ **Object values** map properties to functions
✅ Returns **cleanup function** to stop all bindings
✅ Automatically **updates DOM** when state changes
✅ Handles **textContent**, **className**, **style**, **attributes**, and more
✅ Works with any reactive state (**state**, **ref**, **collection**, etc.)

**Mental Model:** Think of `bindings()` as a **smart TV guide with auto-sync** - you define once which channels (selectors) display which content (reactive values), and the guide (DOM) automatically stays in sync with the programming (state).

**Remember:** `bindings()` is perfect for declarative DOM synchronization. Define all your UI bindings in one place and let the library handle automatic updates!

**Next Steps:**
- Learn about [`effect()`](effect.md) for custom reactive side effects
- Explore [`$bind()`](../01_State Creation/02_createState.md) for state-specific binding
- Check out [`computed()`](computed.md) for derived reactive values
- Master [`watch()`](watch.md) for observing state changes
