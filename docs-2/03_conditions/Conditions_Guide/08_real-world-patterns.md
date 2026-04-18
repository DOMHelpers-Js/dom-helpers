[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Real-World Patterns

This guide brings together everything from the previous chapters into complete, working examples. Each pattern represents a real UI problem and shows how Conditions, Reactive, and DOM Helpers Core work together to solve it cleanly.

---

## Pattern 1: Async Data Fetch UI

A complete fetch cycle with loading, success, error, and empty states.

```html
<div id="fetch-container">
  <button id="load-btn">Load Data</button>
  <div id="spinner" hidden></div>
  <div id="error-msg" hidden></div>
  <div id="empty-msg" hidden></div>
  <ul id="data-list" hidden></ul>
</div>
```

```javascript
const fetchState = state({
  status: 'idle',   // 'idle' | 'loading' | 'success' | 'error' | 'empty'
  error: '',
  items: []
});

// Conditions handles the visual configuration for each state
Conditions.whenState(
  () => fetchState.status,
  {
    'idle': {
      '#load-btn':  { disabled: false, textContent: 'Load Data' },
      '#spinner':   { hidden: true },
      '#error-msg': { hidden: true },
      '#empty-msg': { hidden: true },
      '#data-list': { hidden: true }
    },
    'loading': {
      '#load-btn':  { disabled: true, textContent: 'Loading…' },
      '#spinner':   { hidden: false },
      '#error-msg': { hidden: true },
      '#empty-msg': { hidden: true },
      '#data-list': { hidden: true }
    },
    'success': {
      '#load-btn':  { disabled: false, textContent: 'Reload' },
      '#spinner':   { hidden: true },
      '#error-msg': { hidden: true },
      '#empty-msg': { hidden: true },
      '#data-list': { hidden: false }
    },
    'empty': {
      '#load-btn':  { disabled: false, textContent: 'Reload' },
      '#spinner':   { hidden: true },
      '#error-msg': { hidden: true },
      '#empty-msg': { hidden: false },
      '#data-list': { hidden: true }
    },
    'error': {
      '#load-btn':  { disabled: false, textContent: 'Retry' },
      '#spinner':   { hidden: true },
      '#error-msg': { hidden: false },
      '#empty-msg': { hidden: true },
      '#data-list': { hidden: true }
    }
  }
);

// effect() handles dynamic content that changes based on data
effect(() => {
  if (fetchState.status === 'error') {
    document.getElementById('error-msg').textContent = fetchState.error || 'Something went wrong.';
  }

  if (fetchState.status === 'success') {
    const list = document.getElementById('data-list');
    list.innerHTML = fetchState.items.map(item => `<li>${item.name}</li>`).join('');
  }
});

// Event handler — drives the state machine
document.getElementById('load-btn').addEventListener('click', async () => {
  fetchState.status = 'loading';

  try {
    const response = await fetch('/api/items');
    const items = await response.json();

    batch(() => {
      fetchState.items = items;
      fetchState.status = items.length === 0 ? 'empty' : 'success';
    });
  } catch (err) {
    batch(() => {
      fetchState.error = err.message;
      fetchState.status = 'error';
    });
  }
});
```

**What to notice:**
- `whenState()` owns the structural layout — which elements are visible/hidden/enabled
- `effect()` fills in dynamic content (error messages, list items) that changes per value
- `batch()` ensures the status and data update atomically — no intermediate partial states
- Adding a new status (e.g., `'cancelled'`) means adding one new block to the conditions object, not scattering changes through the code

---

## Pattern 2: Multi-Step Form Wizard

A step-by-step form with navigation, validation indicators, and progress.

```html
<div id="wizard">
  <div class="progress-bar">
    <div id="progress-fill"></div>
  </div>
  <div id="step-1-panel"><!-- Step 1 content --></div>
  <div id="step-2-panel" hidden><!-- Step 2 content --></div>
  <div id="step-3-panel" hidden><!-- Step 3 content --></div>
  <div id="step-4-panel" hidden><!-- Step 4 content --></div>
  <button id="back-btn" disabled>Back</button>
  <button id="next-btn">Next</button>
  <div id="step-indicator"></div>
</div>
```

```javascript
const wizard = state({
  step: 1,
  totalSteps: 4
});

// Panel visibility
Conditions.whenState(
  () => wizard.step,
  {
    '1': {
      '#step-1-panel': { hidden: false },
      '#step-2-panel': { hidden: true  },
      '#step-3-panel': { hidden: true  },
      '#step-4-panel': { hidden: true  }
    },
    '2': {
      '#step-1-panel': { hidden: true  },
      '#step-2-panel': { hidden: false },
      '#step-3-panel': { hidden: true  },
      '#step-4-panel': { hidden: true  }
    },
    '3': {
      '#step-1-panel': { hidden: true  },
      '#step-2-panel': { hidden: true  },
      '#step-3-panel': { hidden: false },
      '#step-4-panel': { hidden: true  }
    },
    '4': {
      '#step-1-panel': { hidden: true  },
      '#step-2-panel': { hidden: true  },
      '#step-3-panel': { hidden: true  },
      '#step-4-panel': { hidden: false }
    }
  }
);

// Navigation buttons
Conditions.whenState(
  () => wizard.step,
  {
    '1': {
      '#back-btn': { disabled: true,  textContent: 'Back' },
      '#next-btn': { disabled: false, textContent: 'Next → Step 2' }
    },
    '2': {
      '#back-btn': { disabled: false, textContent: '← Back' },
      '#next-btn': { disabled: false, textContent: 'Next → Step 3' }
    },
    '3': {
      '#back-btn': { disabled: false, textContent: '← Back' },
      '#next-btn': { disabled: false, textContent: 'Next → Review' }
    },
    '4': {
      '#back-btn': { disabled: false, textContent: '← Back' },
      '#next-btn': { disabled: false, textContent: 'Submit ✓' }
    }
  }
);

// Progress bar — dynamic percentage via effect()
effect(() => {
  const pct = ((wizard.step - 1) / (wizard.totalSteps - 1)) * 100;
  document.getElementById('progress-fill').update({
    style: { width: `${pct}%` }
  });
  document.getElementById('step-indicator').textContent = `Step ${wizard.step} of ${wizard.totalSteps}`;
});

// Navigation
document.getElementById('next-btn').addEventListener('click', () => {
  if (wizard.step < wizard.totalSteps) wizard.step++;
  else submitForm();
});

document.getElementById('back-btn').addEventListener('click', () => {
  if (wizard.step > 1) wizard.step--;
});
```

---

## Pattern 3: User Authentication State

Navigation and UI changes based on login state and user role.

```html
<nav>
  <a id="nav-home" href="/">Home</a>
  <a id="nav-profile" href="/profile" hidden>Profile</a>
  <a id="nav-admin" href="/admin" hidden>Admin</a>
  <button id="login-btn">Log In</button>
  <button id="logout-btn" hidden>Log Out</button>
  <span id="user-greeting" hidden></span>
</nav>
<div id="admin-banner" hidden>You are viewing as Administrator</div>
```

```javascript
const auth = state({
  isLoggedIn: false,
  role: 'guest',    // 'guest' | 'user' | 'admin'
  name: ''
});

// Navigation visibility by role
Conditions.whenState(
  () => auth.role,
  {
    'guest': {
      '#nav-profile': { hidden: true  },
      '#nav-admin':   { hidden: true  },
      '#login-btn':   { hidden: false },
      '#logout-btn':  { hidden: true  },
      '#user-greeting': { hidden: true },
      '#admin-banner':  { hidden: true }
    },
    'user': {
      '#nav-profile': { hidden: false },
      '#nav-admin':   { hidden: true  },
      '#login-btn':   { hidden: true  },
      '#logout-btn':  { hidden: false },
      '#user-greeting': { hidden: false },
      '#admin-banner':  { hidden: true }
    },
    'admin': {
      '#nav-profile': { hidden: false },
      '#nav-admin':   { hidden: false },
      '#login-btn':   { hidden: true  },
      '#logout-btn':  { hidden: false },
      '#user-greeting': { hidden: false },
      '#admin-banner':  { hidden: false }
    }
  }
);

// Dynamic greeting — updates when name changes
effect(() => {
  if (auth.isLoggedIn) {
    document.getElementById('user-greeting').textContent = `Hello, ${auth.name}`;
  }
});

// Auth actions
async function login(credentials) {
  const { user } = await authService.login(credentials);
  batch(() => {
    auth.isLoggedIn = true;
    auth.role = user.role;
    auth.name = user.name;
  });
}

async function logout() {
  await authService.logout();
  batch(() => {
    auth.isLoggedIn = false;
    auth.role = 'guest';
    auth.name = '';
  });
}
```

---

## Pattern 4: Real-Time Connection Status

Displays connection status with automatic retry indication.

```html
<div id="connection-indicator">
  <span id="conn-dot"></span>
  <span id="conn-label"></span>
  <button id="conn-retry-btn" hidden>Retry</button>
</div>
```

```javascript
const connection = state({
  status: 'connecting',  // 'connecting' | 'connected' | 'disconnected' | 'error'
  retryCount: 0
});

Conditions.whenState(
  () => connection.status,
  {
    'connecting': {
      '#conn-dot':      { className: 'dot dot-yellow pulse' },
      '#conn-label':    { textContent: 'Connecting…' },
      '#conn-retry-btn': { hidden: true }
    },
    'connected': {
      '#conn-dot':      { className: 'dot dot-green' },
      '#conn-label':    { textContent: 'Connected' },
      '#conn-retry-btn': { hidden: true }
    },
    'disconnected': {
      '#conn-dot':      { className: 'dot dot-gray' },
      '#conn-label':    { textContent: 'Disconnected' },
      '#conn-retry-btn': { hidden: false }
    },
    'error': {
      '#conn-dot':      { className: 'dot dot-red' },
      '#conn-label':    { textContent: 'Connection failed' },
      '#conn-retry-btn': { hidden: false }
    }
  }
);

// Show retry count dynamically
effect(() => {
  if (connection.status === 'error' && connection.retryCount > 0) {
    document.getElementById('conn-label').textContent =
      `Connection failed (attempt ${connection.retryCount})`;
  }
});

// Retry button
document.getElementById('conn-retry-btn').addEventListener('click', () => {
  set(connection, { retryCount: prev => prev + 1 });
  connection.status = 'connecting';
  reconnect();
});

async function reconnect() {
  try {
    await webSocket.reconnect();
    connection.status = 'connected';
  } catch {
    connection.status = 'error';
  }
}
```

---

## Pattern 5: Upload with Progress

File upload with state machine and dynamic progress.

```html
<div id="upload-zone">
  <input id="file-input" type="file" hidden>
  <div id="drop-area">Drop file here or click to browse</div>
  <div id="upload-progress" hidden>
    <div id="progress-bar-fill"></div>
    <span id="progress-pct">0%</span>
    <span id="upload-filename"></span>
  </div>
  <div id="upload-success" hidden>File uploaded successfully!</div>
  <div id="upload-error" hidden></div>
  <button id="upload-btn">Choose File</button>
  <button id="cancel-btn" hidden>Cancel</button>
</div>
```

```javascript
const upload = state({
  status: 'idle',   // 'idle' | 'selected' | 'uploading' | 'done' | 'error'
  fileName: '',
  progress: 0,
  error: ''
});

// Layout and button management
Conditions.whenState(
  () => upload.status,
  {
    'idle': {
      '#drop-area':       { hidden: false },
      '#upload-progress': { hidden: true  },
      '#upload-success':  { hidden: true  },
      '#upload-error':    { hidden: true  },
      '#upload-btn':      { disabled: false, textContent: 'Choose File' },
      '#cancel-btn':      { hidden: true }
    },
    'selected': {
      '#drop-area':       { hidden: true  },
      '#upload-progress': { hidden: false },
      '#upload-success':  { hidden: true  },
      '#upload-error':    { hidden: true  },
      '#upload-btn':      { disabled: false, textContent: 'Upload' },
      '#cancel-btn':      { hidden: false }
    },
    'uploading': {
      '#drop-area':       { hidden: true  },
      '#upload-progress': { hidden: false },
      '#upload-success':  { hidden: true  },
      '#upload-error':    { hidden: true  },
      '#upload-btn':      { disabled: true, textContent: 'Uploading…' },
      '#cancel-btn':      { hidden: false }
    },
    'done': {
      '#drop-area':       { hidden: true  },
      '#upload-progress': { hidden: true  },
      '#upload-success':  { hidden: false },
      '#upload-error':    { hidden: true  },
      '#upload-btn':      { disabled: false, textContent: 'Upload Another' },
      '#cancel-btn':      { hidden: true }
    },
    'error': {
      '#drop-area':       { hidden: true  },
      '#upload-progress': { hidden: true  },
      '#upload-success':  { hidden: true  },
      '#upload-error':    { hidden: false },
      '#upload-btn':      { disabled: false, textContent: 'Try Again' },
      '#cancel-btn':      { hidden: true }
    }
  }
);

// Dynamic values — progress percentage and messages
effect(() => {
  const pct = `${upload.progress}%`;
  Elements.textContent({
    'progress-pct':    pct,
    'upload-filename': upload.fileName
  });
  document.getElementById('progress-bar-fill').update({
    style: { width: pct }
  });

  if (upload.status === 'error') {
    document.getElementById('upload-error').textContent = upload.error || 'Upload failed.';
  }
});

// File selection
document.getElementById('upload-btn').addEventListener('click', () => {
  if (upload.status === 'selected' || upload.status === 'uploading') {
    startUpload();
  } else if (upload.status === 'done' || upload.status === 'idle') {
    document.getElementById('file-input').click();
  } else if (upload.status === 'error') {
    document.getElementById('file-input').click();
  }
});

document.getElementById('file-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    batch(() => {
      upload.fileName = file.name;
      upload.progress = 0;
      upload.status = 'selected';
    });
  }
});

async function startUpload() {
  upload.status = 'uploading';
  // ... XHR with progress events updating upload.progress
}
```

---

## Pattern 6: Notification Toast System

A toast notification with multiple types and auto-dismiss.

```html
<div id="toast" hidden role="status" aria-live="polite">
  <span id="toast-icon"></span>
  <span id="toast-message"></span>
  <button id="toast-close">×</button>
</div>
```

```javascript
const toast = state({
  type: 'info',      // 'info' | 'success' | 'warning' | 'error'
  message: '',
  visible: false
});

// Toast type — controls visual appearance
Conditions.whenState(
  () => toast.type,
  {
    'info': {
      '#toast':      { className: 'toast toast-info',    setAttribute: { role: 'status' } },
      '#toast-icon': { textContent: 'ℹ️' }
    },
    'success': {
      '#toast':      { className: 'toast toast-success', setAttribute: { role: 'status' } },
      '#toast-icon': { textContent: '✅' }
    },
    'warning': {
      '#toast':      { className: 'toast toast-warning', setAttribute: { role: 'alert' } },
      '#toast-icon': { textContent: '⚠️' }
    },
    'error': {
      '#toast':      { className: 'toast toast-error',   setAttribute: { role: 'alert', 'aria-live': 'assertive' } },
      '#toast-icon': { textContent: '❌' }
    }
  }
);

// Toast visibility — separate from type
Conditions.whenState(
  () => toast.visible,
  {
    'true':  { '#toast': { hidden: false, classList: { add: 'toast-enter' } } },
    'false': { '#toast': { hidden: true,  classList: { remove: 'toast-enter' } } }
  }
);

// Dynamic message text
effect(() => {
  document.getElementById('toast-message').textContent = toast.message;
});

let dismissTimer = null;

function showToast(message, type = 'info', duration = 3000) {
  if (dismissTimer) clearTimeout(dismissTimer);

  batch(() => {
    toast.message = message;
    toast.type = type;
    toast.visible = true;
  });

  if (duration > 0) {
    dismissTimer = setTimeout(() => { toast.visible = false; }, duration);
  }
}

function dismissToast() {
  if (dismissTimer) clearTimeout(dismissTimer);
  toast.visible = false;
}

document.getElementById('toast-close').addEventListener('click', dismissToast);

// Usage
showToast('Profile saved successfully!', 'success');
showToast('Network error — check your connection', 'error', 0);  // stays until dismissed
```

---

## Pattern 7: Theme Switcher

System-aware theme with manual override.

```html
<button id="theme-toggle">Toggle Theme</button>
<span id="theme-label"></span>
```

```javascript
const theme = state({
  mode: 'auto',    // 'auto' | 'light' | 'dark'
  resolved: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
});

// Apply the resolved theme to the document
Conditions.whenState(
  () => theme.resolved,
  {
    'light': {
      'html': { setAttribute: { 'data-theme': 'light' }, className: 'theme-light' }
    },
    'dark': {
      'html': { setAttribute: { 'data-theme': 'dark'  }, className: 'theme-dark'  }
    }
  }
);

// Theme mode label
Conditions.whenState(
  () => theme.mode,
  {
    'auto':  { '#theme-label': { textContent: 'Theme: Auto (System)'       } },
    'light': { '#theme-label': { textContent: 'Theme: Light'               } },
    'dark':  { '#theme-label': { textContent: 'Theme: Dark'                } }
  }
);

// Cycle through modes: auto → light → dark → auto
document.getElementById('theme-toggle').addEventListener('click', () => {
  const modes = ['auto', 'light', 'dark'];
  const next = modes[(modes.indexOf(theme.mode) + 1) % modes.length];

  batch(() => {
    theme.mode = next;
    if (next === 'auto') {
      theme.resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      theme.resolved = next;
    }
  });
});

// Listen for system preference changes (only relevant in auto mode)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (theme.mode === 'auto') {
    theme.resolved = e.matches ? 'dark' : 'light';
  }
});
```

---

## Pattern 8: Product Card with Inventory

E-commerce product card with stock states.

```html
<div class="product-card" id="product">
  <span id="product-badge" hidden></span>
  <img id="product-img" src="" alt="">
  <h3 id="product-name"></h3>
  <p id="product-price"></p>
  <p id="product-stock-info"></p>
  <button id="add-to-cart-btn">Add to Cart</button>
</div>
```

```javascript
const product = state({
  name: '',
  price: 0,
  image: '',
  stock: 'unknown'   // 'in_stock' | 'low_stock' | 'out_of_stock' | 'preorder' | 'unknown'
});

// Stock-driven visual state
Conditions.whenState(
  () => product.stock,
  {
    'in_stock': {
      '#product-badge':     { hidden: true },
      '#add-to-cart-btn':   { disabled: false, textContent: 'Add to Cart', className: 'btn btn-primary' },
      '#product-stock-info': { textContent: 'In stock', className: 'stock-info ok' }
    },
    'low_stock': {
      '#product-badge':     { hidden: false, textContent: 'Low Stock', className: 'badge badge-orange' },
      '#add-to-cart-btn':   { disabled: false, textContent: 'Add to Cart', className: 'btn btn-primary' },
      '#product-stock-info': { textContent: 'Only a few left!', className: 'stock-info warn' }
    },
    'out_of_stock': {
      '#product-badge':     { hidden: false, textContent: 'Out of Stock', className: 'badge badge-red' },
      '#add-to-cart-btn':   { disabled: true, textContent: 'Out of Stock', className: 'btn btn-disabled' },
      '#product-stock-info': { textContent: 'Currently unavailable', className: 'stock-info out' }
    },
    'preorder': {
      '#product-badge':     { hidden: false, textContent: 'Pre-Order', className: 'badge badge-purple' },
      '#add-to-cart-btn':   { disabled: false, textContent: 'Pre-Order Now', className: 'btn btn-secondary' },
      '#product-stock-info': { textContent: 'Available for pre-order', className: 'stock-info preorder' }
    },
    default: {
      '#product-badge':     { hidden: true },
      '#add-to-cart-btn':   { disabled: true, textContent: 'Checking…', className: 'btn btn-disabled' },
      '#product-stock-info': { textContent: '', className: 'stock-info' }
    }
  }
);

// Dynamic content — name, price, image
effect(() => {
  Elements.textContent({
    'product-name':  product.name,
    'product-price': `$${product.price.toFixed(2)}`
  });
  document.getElementById('product-img').update({
    src: product.image,
    alt: product.name
  });
});

// Load product data
async function loadProduct(id) {
  const data = await fetch(`/api/products/${id}`).then(r => r.json());
  batch(() => {
    product.name  = data.name;
    product.price = data.price;
    product.image = data.image;
    product.stock = data.stock;
  });
}
```

---

## Key Takeaways from All Patterns

Looking across these examples, consistent patterns emerge:

### Division of Responsibility

```
Conditions.whenState()  →  structural layout (which elements visible/hidden/enabled)
effect()               →  dynamic content (text that changes based on specific values)
batch()                →  atomic state transitions (prevent partial renders)
```

### State Machine Approach

Every example uses a **status** or **mode** property that acts as a state machine. This is the ideal use case for Conditions:

```
idle → loading → success | error → idle
```

Each node in that graph corresponds to one block in the conditions object. The system transitions between them automatically.

### Separation Scales Well

As UI grows, new elements are simply added to each existing condition block. New states are one new block. Neither change is "risky" — it's additive, not refactoring.

### `batch()` on Multi-Property Changes

Whenever two or more reactive properties need to change together (status + data, type + message, role + name), use `batch()`. This ensures Conditions sees a single, consistent state transition rather than two intermediate ones.

---

## Summary

Real-world use of Conditions follows a simple formula:

1. **Model your UI states** — identify the distinct visual modes (idle, loading, error, etc.)
2. **Use `whenState()`** for the structural configuration — visibility, classes, labels, enabled/disabled
3. **Use `effect()`** alongside for dynamic values — the actual text content, computed strings, item counts
4. **Use `batch()`** when state changes involve multiple properties
5. **Use `default`** (with the extension loaded) to handle unexpected or catch-all states gracefully

The result: a UI where every visual state is a complete, readable, self-contained block — and the DOM always matches your state, automatically.

---

**End of Conditions Guide**

Explore related topics:
- [Reactive Guide](../../04_reactive/40_Reactive_Guide/01_reactive_introduction.md) — The reactive state system that powers `whenState()`
- [DOM Helpers Core](../../04_reactive/40_Reactive_Guide/11_reactive_with_dom_helpers_core.md) — The `.update()` method used inside condition blocks