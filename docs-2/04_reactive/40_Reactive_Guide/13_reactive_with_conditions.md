[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Reactive With Conditions

## Quick Demonstration

```javascript
const status = state({ connection: 'connected' });

// Conditions.whenState watches a value and applies different DOM updates based on it
Conditions.whenState(
  () => status.connection,       // What to watch
  {
    'connected': {               // When value is "connected"
      '#status-icon': { className: 'icon icon-green' },
      '#status-text': { textContent: 'Connected' }
    },
    'disconnected': {            // When value is "disconnected"
      '#status-icon': { className: 'icon icon-red' },
      '#status-text': { textContent: 'Disconnected' }
    },
    'reconnecting': {            // When value is "reconnecting"
      '#status-icon': { className: 'icon icon-yellow spinning' },
      '#status-text': { textContent: 'Reconnecting...' }
    }
  }
);

// Just change state — the right condition fires automatically
status.connection = 'disconnected';
// → icon turns red, text shows "Disconnected"
```

---

## What is Conditions?

Conditions (`01_dh-conditional-rendering.js`) is a module that makes **declarative conditional rendering** possible. It lets you define what the DOM should look like for each possible state value — and automatically applies the right visual state when the value changes.

Think of it as a **"when this is X, show this; when it's Y, show that"** system that ties directly into the reactive state system.

Without Conditions, you write `if/else` logic inside effects manually. With Conditions, you describe each visual state as a clean configuration object — and the system handles the switching.

---

## Syntax

### `Conditions.whenState()`

```javascript
Conditions.whenState(
  getValue,   // Function: () => returns the value to watch
  conditions, // Object: { 'condition': { selector: updates } }
  selector    // Optional: default selector for all conditions
);
```

**Basic structure of the conditions object:**

```javascript
{
  // Each key is a condition matcher
  'someValue': {
    // Each inner key is a CSS selector, and value is update object
    '#element-id': { textContent: 'New text' },
    '.my-class': { className: 'active' }
  },
  'otherValue': {
    '#element-id': { textContent: 'Different text' }
  },
  default: {
    // Runs when no other condition matched
    '#element-id': { textContent: 'Default text' }
  }
}
```

### Condition Matchers

Conditions supports many matching patterns:

```javascript
{
  // Exact string match
  'active': { ... },
  'pending': { ... },

  // Quoted string (same as exact)
  '"loading"': { ... },

  // Boolean
  'true': { ... },
  'false': { ... },

  // Truthy / Falsy
  'truthy': { ... },
  'falsy': { ... },

  // Null checks
  'null': { ... },
  'undefined': { ... },
  'empty': { ... },   // null, undefined, or ''

  // Pattern matching
  'includes:error': { ... },     // String contains "error"
  'startsWith:http': { ... },    // String starts with "http"

  // Default fallback
  'default': { ... }
}
```

---

## Why Does Conditions Exist?

### The Problem: If/Else Chains in Effects

When you have multiple possible states, `effect()` with if/else works, but gets verbose:

```javascript
const connection = state({ status: 'connected' });

effect(() => {
  const status = connection.status;
  const icon = document.getElementById('status-icon');
  const text = document.getElementById('status-text');
  const panel = document.getElementById('status-panel');

  if (status === 'connected') {
    icon.className = 'icon icon-green';
    text.textContent = 'Connected';
    panel.className = 'panel panel-success';
    panel.setAttribute('aria-label', 'Connection active');
  } else if (status === 'disconnected') {
    icon.className = 'icon icon-red';
    text.textContent = 'Disconnected';
    panel.className = 'panel panel-error';
    panel.setAttribute('aria-label', 'Connection lost');
  } else if (status === 'reconnecting') {
    icon.className = 'icon icon-yellow spinning';
    text.textContent = 'Reconnecting...';
    panel.className = 'panel panel-warning';
    panel.setAttribute('aria-label', 'Attempting to reconnect');
  } else {
    icon.className = 'icon icon-gray';
    text.textContent = 'Unknown status';
    panel.className = 'panel panel-default';
    panel.setAttribute('aria-label', 'Status unknown');
  }
});
```

This works, but:
- The state/DOM relationship is **buried** in imperative logic
- Each condition touches **multiple elements** in scattered lines
- Adding a new state means adding another `else if` block
- Hard to see "what does the UI look like for status X" at a glance

### The Conditions Solution

```javascript
Conditions.whenState(
  () => connection.status,
  {
    'connected': {
      '#status-icon': { className: 'icon icon-green' },
      '#status-text': { textContent: 'Connected' },
      '#status-panel': { className: 'panel panel-success', setAttribute: { 'aria-label': 'Connection active' } }
    },
    'disconnected': {
      '#status-icon': { className: 'icon icon-red' },
      '#status-text': { textContent: 'Disconnected' },
      '#status-panel': { className: 'panel panel-error', setAttribute: { 'aria-label': 'Connection lost' } }
    },
    'reconnecting': {
      '#status-icon': { className: 'icon icon-yellow spinning' },
      '#status-text': { textContent: 'Reconnecting...' },
      '#status-panel': { className: 'panel panel-warning', setAttribute: { 'aria-label': 'Attempting to reconnect' } }
    },
    default: {
      '#status-icon': { className: 'icon icon-gray' },
      '#status-text': { textContent: 'Unknown status' },
      '#status-panel': { className: 'panel panel-default', setAttribute: { 'aria-label': 'Status unknown' } }
    }
  }
);
```

**What changed:**
- Each visual state is a **self-contained block** — you see the whole picture at once
- The connection between "status = X" and "what the UI shows" is **explicit and visible**
- Adding a new status = adding a new block — no touching existing code
- The `default` case handles anything not explicitly covered

---

## Mental Model

### A Conditional Rendering Configuration Table

Think of `Conditions.whenState()` like a **lookup table** for visual states:

```
When status is...     Show this UI:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
'connected'     →     icon: green, text: "Connected"
'disconnected'  →     icon: red, text: "Disconnected"
'reconnecting'  →     icon: yellow+spin, text: "Reconnecting..."
default         →     icon: gray, text: "Unknown"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Instead of writing the decision logic yourself (if/else chain), you write the table. The system reads it and applies the right row automatically.

### How It Connects to Reactive State

```
state({ status: 'connected' })
           ↓
Conditions.whenState(() => status.connection, { ... })
           ↓
Reactive tracks: "this watches status.connection"
           ↓
When status.connection changes:
           ↓
Conditions finds matching row in conditions object
           ↓
Applies all element updates in that row
           ↓
DOM updates to the new visual state
```

---

## How It Works Internally

`Conditions.whenState()` is built on top of the reactive system. Internally it:

1. Creates a reactive effect that reads your `getValue` function
2. When the value changes, searches the conditions object for a matching key
3. Applies the matching updates to all specified selectors using `.update()`
4. Falls back to `default` if no match is found

```
Conditions.whenState(() => myState.value, conditions)
                ↓
effect(() => {
  const value = getValue();     // Reactive — tracks this
                ↓
  const match = findMatch(value, conditions);  // Find condition
                ↓
  applyUpdates(match);  // Apply all element updates
})
```

The Conditions module handles the matching logic. You just write the table.

---

## Basic Usage: Conditions + Reactive

### Example 1 — Traffic Light

```javascript
const light = state({ color: 'red' });

Conditions.whenState(
  () => light.color,
  {
    'red': {
      '#traffic-light': { className: 'light light-red' },
      '#light-label': { textContent: 'STOP' },
      '#light-red': { style: { opacity: '1' } },
      '#light-yellow': { style: { opacity: '0.2' } },
      '#light-green': { style: { opacity: '0.2' } }
    },
    'yellow': {
      '#traffic-light': { className: 'light light-yellow' },
      '#light-label': { textContent: 'CAUTION' },
      '#light-red': { style: { opacity: '0.2' } },
      '#light-yellow': { style: { opacity: '1' } },
      '#light-green': { style: { opacity: '0.2' } }
    },
    'green': {
      '#traffic-light': { className: 'light light-green' },
      '#light-label': { textContent: 'GO' },
      '#light-red': { style: { opacity: '0.2' } },
      '#light-yellow': { style: { opacity: '0.2' } },
      '#light-green': { style: { opacity: '1' } }
    }
  }
);

// Change the light
const sequence = ['red', 'green', 'yellow'];
let index = 0;
setInterval(() => {
  index = (index + 1) % sequence.length;
  light.color = sequence[index];
}, 2000);
```

**What's happening:** Every 2 seconds, `light.color` changes. `whenState` detects the change, finds the matching condition, and applies all the updates in that block.

### Example 2 — Async Loading States

```javascript
const dataFetch = state({ status: 'idle' });

Conditions.whenState(
  () => dataFetch.status,
  {
    'idle': {
      '#loader': { hidden: true },
      '#content': { hidden: true },
      '#error-panel': { hidden: true },
      '#empty-state': { hidden: false }
    },
    'loading': {
      '#loader': { hidden: false },
      '#content': { hidden: true },
      '#error-panel': { hidden: true },
      '#empty-state': { hidden: true }
    },
    'success': {
      '#loader': { hidden: true },
      '#content': { hidden: false },
      '#error-panel': { hidden: true },
      '#empty-state': { hidden: true }
    },
    'error': {
      '#loader': { hidden: true },
      '#content': { hidden: true },
      '#error-panel': { hidden: false },
      '#empty-state': { hidden: true }
    }
  }
);

async function fetchData() {
  dataFetch.status = 'loading';
  try {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Fetch failed');
    // process data...
    dataFetch.status = 'success';
  } catch (err) {
    dataFetch.status = 'error';
  }
}
```

**What's happening:** Four possible states, each with a clear visual configuration. When `status` changes, the right elements show/hide. No if/else logic anywhere.

### Example 3 — User Role Permissions

```javascript
const auth = state({ role: 'guest' });

Conditions.whenState(
  () => auth.role,
  {
    'guest': {
      '#nav-dashboard': { hidden: true },
      '#nav-settings': { hidden: true },
      '#nav-admin': { hidden: true },
      '#nav-login': { hidden: false },
      '#welcome-msg': { textContent: 'Please log in to continue' }
    },
    'user': {
      '#nav-dashboard': { hidden: false },
      '#nav-settings': { hidden: false },
      '#nav-admin': { hidden: true },
      '#nav-login': { hidden: true },
      '#welcome-msg': { textContent: 'Welcome to your dashboard' }
    },
    'admin': {
      '#nav-dashboard': { hidden: false },
      '#nav-settings': { hidden: false },
      '#nav-admin': { hidden: false },
      '#nav-login': { hidden: true },
      '#welcome-msg': { textContent: 'Welcome, Administrator' }
    }
  }
);

// Setting role updates all navigation visibility
function loginAsAdmin() { auth.role = 'admin'; }
function loginAsUser() { auth.role = 'user'; }
function logout() { auth.role = 'guest'; }
```

### Example 4 — Form Submission State

```javascript
const form = state({ status: 'idle' });

Conditions.whenState(
  () => form.status,
  {
    'idle': {
      '#submit-btn': { textContent: 'Submit', disabled: false, className: 'btn btn-primary' },
      '#spinner': { hidden: true },
      '#success-msg': { hidden: true },
      '#error-msg': { hidden: true }
    },
    'submitting': {
      '#submit-btn': { textContent: 'Submitting...', disabled: true, className: 'btn btn-primary btn-loading' },
      '#spinner': { hidden: false },
      '#success-msg': { hidden: true },
      '#error-msg': { hidden: true }
    },
    'success': {
      '#submit-btn': { textContent: 'Submitted ✓', disabled: true, className: 'btn btn-success' },
      '#spinner': { hidden: true },
      '#success-msg': { hidden: false },
      '#error-msg': { hidden: true }
    },
    'error': {
      '#submit-btn': { textContent: 'Try Again', disabled: false, className: 'btn btn-danger' },
      '#spinner': { hidden: true },
      '#success-msg': { hidden: true },
      '#error-msg': { hidden: false }
    }
  }
);

document.getElementById('my-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  form.status = 'submitting';
  try {
    await submitData();
    form.status = 'success';
  } catch (err) {
    form.status = 'error';
  }
});
```

---

## Deep Dive: Condition Matchers in Detail

### Exact String Matching

```javascript
Conditions.whenState(() => state.color, {
  'red': { '#el': { style: { color: 'red' } } },
  'blue': { '#el': { style: { color: 'blue' } } }
});
```

### Boolean Matching

```javascript
Conditions.whenState(() => state.isActive, {
  'true': { '#el': { className: 'active' } },
  'false': { '#el': { className: 'inactive' } }
});
```

### Truthy / Falsy

```javascript
Conditions.whenState(() => state.userData, {
  'truthy': { '#profile': { hidden: false } },    // Any truthy value
  'falsy': { '#profile': { hidden: true } }        // null, undefined, '', 0, false
});
```

### Null / Empty Checks

```javascript
Conditions.whenState(() => state.errorMessage, {
  'null': { '#error': { hidden: true } },
  'empty': { '#error': { hidden: true } },         // null, undefined, or ''
  'truthy': { '#error': { hidden: false, textContent: state.errorMessage } }
});
```

### Pattern Matching

```javascript
Conditions.whenState(() => state.statusCode, {
  'startsWith:2': { '#status': { className: 'success' } },   // 200, 201, 204...
  'startsWith:4': { '#status': { className: 'error' } },     // 400, 401, 404...
  'startsWith:5': { '#status': { className: 'server-error' } },
  default: { '#status': { className: 'unknown' } }
});
```

### The `default` Case

```javascript
Conditions.whenState(() => state.level, {
  'gold': { '#badge': { className: 'badge gold' } },
  'silver': { '#badge': { className: 'badge silver' } },
  'bronze': { '#badge': { className: 'badge bronze' } },
  default: { '#badge': { className: 'badge standard' } }  // Anything else
});
```

---

## Combining Conditions With `effect()`

Conditions handles the switching logic. Effects handle anything more dynamic:

```javascript
const app = state({ status: 'loading', progress: 0, errorMessage: '' });

// Conditions: handle the UI state switching
Conditions.whenState(
  () => app.status,
  {
    'loading': {
      '#content': { hidden: true },
      '#loader-panel': { hidden: false },
      '#error-panel': { hidden: true }
    },
    'loaded': {
      '#content': { hidden: false },
      '#loader-panel': { hidden: true },
      '#error-panel': { hidden: true }
    },
    'error': {
      '#content': { hidden: true },
      '#loader-panel': { hidden: true },
      '#error-panel': { hidden: false }
    }
  }
);

// effect(): handle the dynamic content within each state
effect(() => {
  // Progress bar — dynamic, not a fixed set of values
  document.getElementById('progress-bar').style.width = `${app.progress}%`;
  document.getElementById('progress-text').textContent = `${app.progress}%`;
});

effect(() => {
  // Error message — dynamic string
  document.getElementById('error-message').textContent = app.errorMessage;
});
```

**The pattern:**
- Conditions → handles "which visual mode am I in?"
- Effects → handles "what are the specific dynamic values?"

---

## Real-World Example: Dashboard With Multiple States

```javascript
const dashboard = state({
  loadStatus: 'idle',   // idle | loading | loaded | error
  authStatus: 'guest',  // guest | user | admin
  sidebarState: 'open', // open | closed | mini
  theme: 'light'        // light | dark
});

// Load status conditions
Conditions.whenState(
  () => dashboard.loadStatus,
  {
    'idle': {
      '#page-loader': { hidden: true },
      '#main-content': { hidden: false },
      '#error-banner': { hidden: true }
    },
    'loading': {
      '#page-loader': { hidden: false },
      '#main-content': { hidden: true },
      '#error-banner': { hidden: true }
    },
    'loaded': {
      '#page-loader': { hidden: true },
      '#main-content': { hidden: false },
      '#error-banner': { hidden: true }
    },
    'error': {
      '#page-loader': { hidden: true },
      '#main-content': { hidden: true },
      '#error-banner': { hidden: false }
    }
  }
);

// Auth conditions
Conditions.whenState(
  () => dashboard.authStatus,
  {
    'guest': {
      '#user-nav': { hidden: true },
      '#admin-nav': { hidden: true },
      '#guest-banner': { hidden: false }
    },
    'user': {
      '#user-nav': { hidden: false },
      '#admin-nav': { hidden: true },
      '#guest-banner': { hidden: true }
    },
    'admin': {
      '#user-nav': { hidden: false },
      '#admin-nav': { hidden: false },
      '#guest-banner': { hidden: true }
    }
  }
);

// Sidebar conditions
Conditions.whenState(
  () => dashboard.sidebarState,
  {
    'open': {
      '#sidebar': { className: 'sidebar sidebar-open' },
      '#main': { className: 'main content-shifted' }
    },
    'closed': {
      '#sidebar': { className: 'sidebar sidebar-closed' },
      '#main': { className: 'main' }
    },
    'mini': {
      '#sidebar': { className: 'sidebar sidebar-mini' },
      '#main': { className: 'main content-shifted-mini' }
    }
  }
);

// Theme conditions
Conditions.whenState(
  () => dashboard.theme,
  {
    'light': {
      'body': { className: 'theme-light' }
    },
    'dark': {
      'body': { className: 'theme-dark' }
    }
  }
);

// Now changing any state value triggers the right condition automatically
dashboard.authStatus = 'admin';   // Nav updates
dashboard.sidebarState = 'mini';  // Sidebar collapses
dashboard.theme = 'dark';         // Theme switches
```

---

## Summary

- `Conditions.whenState()` watches a reactive value and applies predefined DOM updates when it changes
- Each condition is a **self-contained block** showing what the UI looks like for that state value
- Supports many **condition matchers**: exact strings, booleans, truthy/falsy, null checks, pattern matching, and `default`
- Works **on top of the reactive system** — no additional event wiring needed
- Best for **finite, enumerable states** like `loading | success | error`, `guest | user | admin`, `open | closed`
- For **dynamic content** within a state, use `effect()` alongside Conditions
- The `default` key handles any value not explicitly matched

**The pattern:**
```
state.status = 'loading'
      ↓
whenState reads the new value
      ↓
Finds 'loading' in conditions table
      ↓
Applies all DOM updates for 'loading'
      ↓
UI switches to loading state ✨
```

---

## What's Next?

You've now seen every layer of the DOM Helpers system:
- **Reactive** — state management
- **Core** — `.update()` and fine-grained change detection
- **Enhancers** — bulk updates, array distribution, index-based targeting
- **Conditions** — declarative conditional rendering

The final section brings it all together in a complete, real-world application showing the **full power of Reactive + DOM Helpers** working as one cohesive system.

Continue to: [14 — Full Power: Reactive + DOM Helpers Together](./14_full_power_reactive_dom_helpers.md)