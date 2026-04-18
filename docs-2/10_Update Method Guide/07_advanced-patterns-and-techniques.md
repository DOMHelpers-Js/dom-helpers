[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Advanced Patterns & Techniques

Now that you understand the fundamentals, let's explore how to combine everything into production-quality patterns. These are the techniques experienced developers use to build maintainable, performant, and elegant UIs with `.update()`.

---

## Quick Start (30 Seconds)

```javascript
// Pattern preview: State-driven UI with factory functions
const States = {
  loading: () => ({ disabled: true, textContent: 'Loading...', classList: { add: 'loading' } }),
  ready: () => ({ disabled: false, textContent: 'Submit', classList: { remove: 'loading' } }),
  error: (msg) => ({ textContent: msg, style: { color: 'red', display: 'block' } })
};

button.update(States.loading());   // Apply loading state
errorMsg.update(States.error('Invalid email'));  // Apply error with message
button.update(States.ready());     // Reset to ready
```

This is the essence of advanced `.update()` usage: **states as data, not imperative steps**.

---

## Pattern 1: State-Driven UI Architecture

The most fundamental advanced pattern: **your UI is a function of state**.

Instead of asking "what do I need to change?", ask "what should the UI look like in this state?"

### Basic State Machine

```javascript
class UIController {
  constructor() {
    this.state = {
      loading: false,
      error: null,
      data: null
    };
  }

  setState(newState) {
    // Merge new state with existing
    this.state = { ...this.state, ...newState };
    // Always re-render — change detection handles optimization
    this.render();
  }

  render() {
    Elements.update({
      loadingSpinner: {
        style: { display: this.state.loading ? 'flex' : 'none' }
      },
      errorMessage: {
        textContent: this.state.error || '',
        style: { display: this.state.error ? 'block' : 'none' }
      },
      contentArea: {
        textContent: this.state.data
          ? JSON.stringify(this.state.data, null, 2)
          : '',
        style: { display: this.state.data ? 'block' : 'none' }
      },
      actionButton: {
        disabled: this.state.loading,
        textContent: this.state.loading ? 'Loading...' : 'Load Data'
      }
    });
  }
}

const ui = new UIController();

// Usage
ui.setState({ loading: true });

fetchData()
  .then(data => ui.setState({ loading: false, data }))
  .catch(err => ui.setState({ loading: false, error: err.message }));
```

**Benefits:**
✅ Single `render()` function describes the entire UI
✅ State is a plain object — easy to inspect and debug
✅ Change detection skips unchanged DOM properties automatically
✅ Adding new state/UI is straightforward — add to state and render

---

## Pattern 2: Update Factories

**Factories** are functions that return update objects. They make states reusable and consistent across your app.

### Basic Factory Functions

```javascript
const UpdateFactories = {
  // Button states
  button: {
    loading: (label = 'Loading...') => ({
      disabled: true,
      textContent: label,
      style: { opacity: '0.6', cursor: 'not-allowed' },
      classList: { add: 'btn-loading', remove: 'btn-ready' }
    }),

    ready: (label = 'Submit') => ({
      disabled: false,
      textContent: label,
      style: { opacity: '1', cursor: 'pointer' },
      classList: { add: 'btn-ready', remove: 'btn-loading' }
    }),

    success: (label = 'Done!') => ({
      disabled: true,
      textContent: label,
      style: { opacity: '1', cursor: 'default' },
      classList: { add: 'btn-success' }
    })
  },

  // Message states
  message: {
    error: (text) => ({
      textContent: text,
      style: {
        display: 'block',
        color: '#dc2626',
        backgroundColor: '#fef2f2',
        padding: '10px',
        borderRadius: '4px'
      },
      classList: { add: 'msg-error' },
      setAttribute: { 'role': 'alert', 'aria-live': 'assertive' }
    }),

    success: (text) => ({
      textContent: text,
      style: {
        display: 'block',
        color: '#16a34a',
        backgroundColor: '#f0fdf4',
        padding: '10px',
        borderRadius: '4px'
      },
      classList: { add: 'msg-success' },
      setAttribute: { 'role': 'status', 'aria-live': 'polite' }
    }),

    hidden: () => ({
      textContent: '',
      style: { display: 'none' },
      classList: { remove: 'msg-error', 'msg-success' }
    })
  }
};

// Usage — consistent everywhere
Elements.submitBtn.update(UpdateFactories.button.loading());
Elements.formError.update(UpdateFactories.message.error('Invalid email address'));
Elements.formError.update(UpdateFactories.message.success('Form submitted!'));
Elements.submitBtn.update(UpdateFactories.button.ready('Try Again'));
```

**Benefits:**
✅ Single source of truth for each state's appearance
✅ Reuse across components
✅ Easy to update — change the factory, all usages update
✅ Testable — factories return plain objects

---

## Pattern 3: Composition Pattern

Build complex update objects by **composing** smaller, reusable pieces:

```javascript
const Composable = {
  // Small, single-purpose building blocks
  visible: () => ({
    style: { display: 'block', opacity: '1' },
    classList: { remove: 'hidden', add: 'visible' },
    setAttribute: { 'aria-hidden': 'false' }
  }),

  hidden: () => ({
    style: { display: 'none', opacity: '0' },
    classList: { remove: 'visible', add: 'hidden' },
    setAttribute: { 'aria-hidden': 'true' }
  }),

  disabled: () => ({
    disabled: true,
    style: { opacity: '0.5', cursor: 'not-allowed' },
    setAttribute: { 'aria-disabled': 'true' }
  }),

  enabled: () => ({
    disabled: false,
    style: { opacity: '1', cursor: 'pointer' },
    setAttribute: { 'aria-disabled': 'false' }
  }),

  // Composer function — deep merges update objects
  compose(...updates) {
    return updates.reduce((merged, update) => {
      Object.keys(update).forEach(key => {
        const isNestedObject = (
          typeof update[key] === 'object' &&
          update[key] !== null &&
          !Array.isArray(update[key])
        );

        if (isNestedObject) {
          merged[key] = { ...(merged[key] || {}), ...update[key] };
        } else {
          merged[key] = update[key];
        }
      });
      return merged;
    }, {});
  }
};

// Compose complex states from simple pieces
Elements.modal.update(
  Composable.compose(
    Composable.visible(),
    { textContent: 'Confirm deletion?', classList: { add: 'modal-warning' } },
    { focus: [] }
  )
);

Elements.submitBtn.update(
  Composable.compose(
    Composable.disabled(),
    { textContent: 'Please wait...' }
  )
);
```

**Benefits:**
✅ Small, testable building blocks
✅ Flexible composition without duplication
✅ Each piece has a single responsibility

---

## Pattern 4: Conditional Updates

Build update objects dynamically based on conditions:

```javascript
function getUserCardUpdate(user) {
  // Start with base update
  const update = {
    textContent: user.name,
    dataset: { userId: user.id.toString() },
    setAttribute: { 'aria-label': `User: ${user.name}` }
  };

  // Add conditional pieces
  const classes = { add: [], remove: [] };

  if (user.isAdmin) {
    classes.add.push('admin-badge');
    update.title = 'Administrator';
  }

  if (user.isVerified) {
    classes.add.push('verified-badge');
  }

  if (user.status === 'offline') {
    update.style = { opacity: '0.5', filter: 'grayscale(100%)' };
    classes.add.push('user-offline');
    classes.remove.push('user-online');
  } else {
    update.style = { opacity: '1', filter: 'none' };
    classes.add.push('user-online');
    classes.remove.push('user-offline');
  }

  if (classes.add.length || classes.remove.length) {
    update.classList = classes;
  }

  return update;
}

// Apply
Elements.userCard.update(getUserCardUpdate(currentUser));
```

**Benefits:**
✅ Logic centralized in one function
✅ Easy to test — function returns a plain object
✅ Readable — describe state, not steps

---

## Pattern 5: Debounced Batch Updates

For high-frequency events (scroll, resize, mousemove, input), batch updates with debouncing to avoid DOM thrashing:

```javascript
class DebouncedUpdater {
  constructor(delay = 16) {  // Default ~60fps
    this.delay = delay;
    this.pending = {};
    this.timeout = null;
  }

  // Queue an update without immediately applying it
  queue(elementId, updates) {
    // Merge with any pending updates for this element
    this.pending[elementId] = {
      ...(this.pending[elementId] || {}),
      ...updates
    };

    // Cancel previous scheduled flush
    clearTimeout(this.timeout);

    // Schedule a new flush
    this.timeout = setTimeout(() => {
      this._flush();
    }, this.delay);
  }

  _flush() {
    if (Object.keys(this.pending).length > 0) {
      Elements.update(this.pending);
      this.pending = {};
    }
    this.timeout = null;
  }
}

const updater = new DebouncedUpdater(100);  // Batch at most every 100ms

// High-frequency scroll handler
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const scrollPercent = Math.round((scrollY / document.body.scrollHeight) * 100);

  // Queue updates — they'll be batched together
  updater.queue('scrollBar', {
    style: { width: `${scrollPercent}%` }
  });

  updater.queue('scrollLabel', {
    textContent: `${scrollPercent}%`
  });

  updater.queue('header', {
    classList: {
      add: scrollY > 80 ? 'header-shadow' : '',
      remove: scrollY > 80 ? '' : 'header-shadow'
    }
  });
  // All three updates merge and fire once every 100ms
});
```

**Benefits:**
✅ Reduces DOM operations from 100s/second to ~10/second
✅ Batches related updates automatically
✅ Smooth visual performance

---

## Pattern 6: Observable State

Create **reactive state** that automatically updates the UI when values change:

```javascript
class Observable {
  constructor(initialValue) {
    this._value = initialValue;
    this._subscribers = new Set();
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._notify();
    }
  }

  subscribe(callback) {
    this._subscribers.add(callback);
    // Return unsubscribe function
    return () => this._subscribers.delete(callback);
  }

  _notify() {
    this._subscribers.forEach(cb => cb(this._value));
  }
}

// Create observables
const userCount = new Observable(0);
const statusMessage = new Observable('');
const isLoading = new Observable(false);

// Bind observables to UI
userCount.subscribe(count => {
  Elements.userCounter.update({
    textContent: `${count} users online`,
    style: { color: count > 100 ? '#16a34a' : '#6b7280' }
  });
});

statusMessage.subscribe(msg => {
  Elements.status.update({
    textContent: msg,
    style: { display: msg ? 'block' : 'none' }
  });
});

isLoading.subscribe(loading => {
  Elements.update({
    loadingSpinner: { style: { display: loading ? 'flex' : 'none' } },
    actionButton: { disabled: loading, textContent: loading ? 'Loading...' : 'Refresh' }
  });
});

// Now just change the values — UI updates automatically
userCount.value = 42;         // Counter updates
statusMessage.value = 'Live'; // Status updates
isLoading.value = true;       // Spinner shows, button disables
isLoading.value = false;      // Spinner hides, button enables
```

**Benefits:**
✅ Reactive — UI updates flow automatically from state changes
✅ Clean separation: state logic vs UI rendering
✅ Testable — subscribers are just functions

---

## Pattern 7: Animation Sequences

Chain visual transitions with async/await:

```javascript
async function animateNotification(element, message) {
  // Step 1: Set content and prepare initial state
  element.update({
    textContent: message,
    style: { display: 'block', opacity: '0', transform: 'translateY(-20px)' }
  });

  // Wait a tick for display:block to take effect
  await new Promise(r => setTimeout(r, 10));

  // Step 2: Animate in
  element.update({
    style: {
      opacity: '1',
      transform: 'translateY(0)',
      transition: 'opacity 0.3s ease, transform 0.3s ease'
    }
  });

  // Step 3: Hold
  await new Promise(r => setTimeout(r, 3000));

  // Step 4: Animate out
  element.update({
    style: {
      opacity: '0',
      transform: 'translateY(-20px)'
    }
  });

  // Step 5: Hide after animation
  await new Promise(r => setTimeout(r, 300));

  element.update({
    style: { display: 'none' }
  });
}

// Usage
animateNotification(Elements.toast, 'Settings saved!');
```

**Benefits:**
✅ Clear animation sequence
✅ Async/await makes timing readable
✅ Each step is a declarative state description

---

## Pattern 8: Theme Management

Centralized theme switching across all UI elements:

```javascript
const Themes = {
  light: {
    bg: '#ffffff', fg: '#1f2937', primary: '#3b82f6',
    secondary: '#6b7280', surface: '#f9fafb', border: '#e5e7eb'
  },
  dark: {
    bg: '#111827', fg: '#f9fafb', primary: '#60a5fa',
    secondary: '#9ca3af', surface: '#1f2937', border: '#374151'
  },
  contrast: {
    bg: '#000000', fg: '#ffffff', primary: '#ffff00',
    secondary: '#ffffff', surface: '#1a1a1a', border: '#ffffff'
  }
};

function applyTheme(themeName) {
  const t = Themes[themeName];
  if (!t) return;

  // Update main structure
  Elements.update({
    appRoot: {
      style: { backgroundColor: t.bg, color: t.fg },
      dataset: { theme: themeName }
    },
    header: {
      style: { backgroundColor: t.primary, borderBottom: `1px solid ${t.border}` }
    },
    sidebar: {
      style: { backgroundColor: t.surface, borderRight: `1px solid ${t.border}` }
    },
    themeToggle: {
      textContent: themeName === 'dark' ? 'Light Mode' : 'Dark Mode',
      setAttribute: { 'aria-label': `Switch to ${themeName === 'dark' ? 'light' : 'dark'} mode` }
    }
  });

  // Update all buttons of each type
  Collections.update({
    primaryButtons: {
      style: { backgroundColor: t.primary, color: t.bg }
    },
    secondaryButtons: {
      style: { backgroundColor: t.surface, color: t.fg, border: `1px solid ${t.border}` }
    },
    textInputs: {
      style: {
        backgroundColor: t.surface,
        color: t.fg,
        border: `1px solid ${t.border}`
      }
    }
  });

  // Persist preference
  localStorage.setItem('theme', themeName);
}

// Toggle theme
Elements.themeToggle.update({
  addEventListener: ['click', () => {
    const current = document.body.dataset.theme || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }]
});

// Apply saved theme on load
applyTheme(localStorage.getItem('theme') || 'light');
```

**Benefits:**
✅ One function controls entire app appearance
✅ Consistent theming with zero duplication
✅ Easy to add new themes

---

## Pattern 9: Form Validation Pipeline

Combine update objects with validation logic for elegant form handling:

```javascript
const Validators = {
  required: value => value.trim() !== '',
  email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  minLength: min => value => value.length >= min,
  maxLength: max => value => value.length <= max,
  pattern: regex => value => regex.test(value)
};

const FieldConfig = {
  email: {
    validators: [Validators.required, Validators.email],
    messages: ['Email is required', 'Please enter a valid email']
  },
  password: {
    validators: [Validators.required, Validators.minLength(8)],
    messages: ['Password is required', 'Password must be at least 8 characters']
  }
};

function validateField(fieldId, value) {
  const config = FieldConfig[fieldId];
  if (!config) return true;

  const errors = config.validators
    .map((validator, i) => (!validator(value) ? config.messages[i] : null))
    .filter(Boolean);

  const isValid = errors.length === 0;

  Elements.update({
    [fieldId]: {
      classList: {
        add: isValid ? 'field-valid' : 'field-invalid',
        remove: isValid ? 'field-invalid' : 'field-valid'
      },
      setAttribute: { 'aria-invalid': (!isValid).toString() }
    },
    [`${fieldId}Error`]: {
      textContent: errors[0] || '',
      style: { display: errors.length > 0 ? 'block' : 'none' },
      setAttribute: { 'role': errors.length > 0 ? 'alert' : '' }
    }
  });

  return isValid;
}

// Wire up validation
['email', 'password'].forEach(fieldId => {
  Elements[fieldId].update({
    addEventListener: ['blur', (e) => validateField(fieldId, e.target.value)],
    addEventListener: ['input', (e) => {
      // Clear error on input (re-validate on blur)
      if (e.target.classList.contains('field-invalid')) {
        validateField(fieldId, e.target.value);
      }
    }]
  });
});
```

---

## Pattern 10: Component Lifecycle Manager

Manage complex UI components with initialization, update, and teardown:

```javascript
class DropdownComponent {
  constructor(triggerId, menuId) {
    this.triggerId = triggerId;
    this.menuId = menuId;
    this.isOpen = false;
    this._handleClickOutside = this._onClickOutside.bind(this);
  }

  init() {
    Elements[this.triggerId].update({
      setAttribute: { 'aria-haspopup': 'true', 'aria-expanded': 'false' },
      addEventListener: ['click', () => this.toggle()],
      addEventListener: ['keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') this.toggle();
        if (e.key === 'Escape') this.close();
      }]
    });

    Elements[this.menuId].update({
      style: { display: 'none' },
      setAttribute: { 'role': 'menu', 'aria-hidden': 'true' }
    });
  }

  open() {
    this.isOpen = true;

    Elements.update({
      [this.triggerId]: {
        setAttribute: { 'aria-expanded': 'true' },
        classList: { add: 'dropdown-open' }
      },
      [this.menuId]: {
        style: { display: 'block' },
        setAttribute: { 'aria-hidden': 'false' },
        classList: { add: 'menu-visible' }
      }
    });

    document.addEventListener('click', this._handleClickOutside);
  }

  close() {
    this.isOpen = false;

    Elements.update({
      [this.triggerId]: {
        setAttribute: { 'aria-expanded': 'false' },
        classList: { remove: 'dropdown-open' }
      },
      [this.menuId]: {
        style: { display: 'none' },
        setAttribute: { 'aria-hidden': 'true' },
        classList: { remove: 'menu-visible' }
      }
    });

    document.removeEventListener('click', this._handleClickOutside);
    Elements[this.triggerId].update({ focus: [] }); // Return focus to trigger
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  _onClickOutside(e) {
    const trigger = Elements[this.triggerId];
    const menu = Elements[this.menuId];
    if (trigger && menu && !trigger.contains(e.target) && !menu.contains(e.target)) {
      this.close();
    }
  }

  destroy() {
    document.removeEventListener('click', this._handleClickOutside);
  }
}

// Usage
const navDropdown = new DropdownComponent('navTrigger', 'navMenu');
navDropdown.init();
```

---

## Performance Optimization Techniques

### Technique 1: Virtual Update Building

Build your update object before applying it — don't mix building and applying:

```javascript
// ❌ Less efficient — individual updates
items.forEach(item => {
  Elements[`item-${item.id}`].update({
    textContent: item.name,
    dataset: { id: item.id.toString() }
  });
});

// ✅ More efficient — build first, apply once
const updates = {};
items.forEach(item => {
  updates[`item-${item.id}`] = {
    textContent: item.name,
    dataset: { id: item.id.toString() }
  };
});
Elements.update(updates);  // One call, all items
```

### Technique 2: requestAnimationFrame for Visual Updates

For smooth animations and visual changes, align with the browser's paint cycle:

```javascript
function updateVisualization(data) {
  requestAnimationFrame(() => {
    Elements.update({
      chart: { style: { height: `${data.value}%` } },
      label: { textContent: `${data.value}%` },
      bar: {
        style: {
          width: `${data.progress}%`,
          backgroundColor: data.progress > 80 ? '#16a34a' : '#3b82f6'
        }
      }
    });
  });
}
```

### Technique 3: Lazy Evaluation with Functions

Use functions as values for updates that are expensive to compute:

```javascript
element.update({
  // Function is only called when applied
  textContent: (el) => computeExpensiveLabel(el.dataset)
});
```

---

## Key Takeaways

1. **State-driven** — describe the UI state, not the mutation steps
2. **Factories** — create reusable, named state configurations
3. **Composition** — build complex updates from small, single-purpose pieces
4. **Conditional** — build update objects dynamically from your data
5. **Debouncing** — batch high-frequency updates for smooth performance
6. **Observables** — reactive UI flows from state changes automatically
7. **Animations** — async/await sequences of update states
8. **Themes** — centralized styling through bulk update patterns
9. **Validation** — combine factories with logic for clean form handling
10. **Lifecycle** — manage component state with open/close/init/destroy

These patterns work together. A real application might use state-driven architecture (Pattern 1) with factories (Pattern 2), observable state (Pattern 6), and debounced updates (Pattern 5) all at once.

---

## What's Next?

Final chapter: **Best Practices & Common Mistakes** — production-ready guidelines and the mistakes to avoid before you ship.