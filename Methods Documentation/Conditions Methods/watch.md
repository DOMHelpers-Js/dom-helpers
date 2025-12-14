# Understanding `watch()` - A Beginner's Guide

## What is `watch()`?

`watch()` is a method for **explicit reactive watching** that forces reactive mode even when auto-detection might not work. It's essentially a convenience wrapper around `whenState()` that always uses reactivity.

Think of it as a **guaranteed reactive connector** that:
1. Ensures reactive mode is always used
2. Watches your state continuously
3. Updates elements automatically when state changes
4. Provides a clear signal that "this is reactive"

It's like putting a **"DEFINITELY REACTIVE"** label on your conditional rendering - no ambiguity!

---

## Why Does `watch()` Exist?

### The Problem: Sometimes Auto-Detection Fails

`whenState()` automatically detects if a reactive library is available and switches between reactive and static modes. But sometimes this auto-detection can be confusing or fail:

```javascript
// With whenState() - is this reactive? 🤔
Conditions.whenState(
  () => state.value,
  conditions,
  selector
);
// It MIGHT be reactive (if reactive library is loaded)
// It MIGHT be static (if reactive library is not loaded)
// You're not 100% sure!
```

### The Solution: Explicit Reactive Mode

`watch()` makes your intention crystal clear - you want reactivity, period:

```javascript
// With watch() - definitely reactive! ✨
Conditions.watch(
  () => state.value,
  conditions,
  selector
);
// ALWAYS reactive
// Fails gracefully if reactive library is missing
// Your code clearly says "I need reactivity here"
```

---

## How Does It Work?

### The Concept

`watch()` is a **thin wrapper** around `whenState()` that forces reactive mode:

```javascript
// What watch() does internally (simplified):
function watch(valueFn, conditions, selector) {
  if (!hasReactiveLibrary) {
    console.warn('[Conditions] watch() requires reactive library');
    // Falls back to apply() as a safety measure
    return this.apply(valueFn(), conditions, selector);
  }
  
  // Force reactive mode
  return this.whenState(valueFn, conditions, selector, { reactive: true });
}
```

**Step by Step:**

1. **Check**: Verifies reactive library is available
2. **Warn**: Logs warning if reactive library is missing
3. **Force**: Calls `whenState()` with `{ reactive: true }`
4. **Watch**: Sets up reactive watching
5. **Update**: Automatically updates when dependencies change

### Visual Comparison

```javascript
// These are equivalent:

// Using watch()
Conditions.watch(
  () => state.value,
  conditions,
  selector
);

// Using whenState() with explicit option
Conditions.whenState(
  () => state.value,
  conditions,
  selector,
  { reactive: true }  // Explicit reactive mode
);
```

---

## Basic Usage

### Syntax

```javascript
Conditions.watch(valueFn, conditions, selector)
```

**Parameters:**

1. **`valueFn`** (Function | Any) - What to watch
   - **Function**: `() => state.property` (watches continuously)
   - Direct value: Falls back to static mode with warning

2. **`conditions`** (Object | Function) - Condition mappings
   - Object with conditions as keys and configurations as values
   - Function returning conditions object (for dynamic conditions)

3. **`selector`** (String | Element | NodeList) - What to update
   - CSS selector: `'#myElement'`, `'.items'`, `'button'`
   - Direct element: `document.getElementById('myElement')`
   - NodeList/Array: Multiple elements

**Returns:**
- `{ update, destroy }` cleanup object (if reactive)
- `void` (if reactive library unavailable)

---

## Practical Examples

### Example 1: Explicit Reactive Status Indicator

**HTML:**
```html
<div id="status">Idle</div>
```

**JavaScript:**
```javascript
const app = Reactive.state({
  status: 'idle'
});

// Explicitly reactive - clear intent!
const cleanup = Conditions.watch(
  () => app.status,
  {
    'idle': {
      textContent: 'Ready to start',
      style: { color: '#666' }
    },
    'loading': {
      textContent: 'Loading...',
      style: { color: 'blue' },
      classList: { add: 'spinner' }
    },
    'success': {
      textContent: '✓ Complete!',
      style: { color: 'green' },
      classList: { remove: 'spinner' }
    },
    'error': {
      textContent: '✗ Error occurred',
      style: { color: 'red' },
      classList: { remove: 'spinner' }
    }
  },
  '#status'
);

// Test it - updates automatically!
setTimeout(() => app.status = 'loading', 1000);
setTimeout(() => app.status = 'success', 3000);

// Clean up when done
// cleanup.destroy();
```

**What happens:**
1. Creates reactive state
2. `watch()` sets up reactive watching
3. As `status` changes, UI updates automatically
4. Cleanup function available for proper resource management

---

### Example 2: Real-Time Data Dashboard

**HTML:**
```html
<div class="dashboard">
  <div id="connection-status">Checking...</div>
  <div id="data-freshness">Unknown</div>
  <div id="server-health">Unknown</div>
</div>
```

**JavaScript:**
```javascript
const dashboard = Reactive.state({
  connectionStatus: 'disconnected',
  lastUpdate: Date.now(),
  serverHealth: 'unknown'
});

// Watch connection status - explicitly reactive
Conditions.watch(
  () => dashboard.connectionStatus,
  {
    'connected': {
      textContent: '🟢 Connected',
      style: { color: 'green', fontWeight: 'bold' }
    },
    'connecting': {
      textContent: '🟡 Connecting...',
      style: { color: 'orange' }
    },
    'disconnected': {
      textContent: '🔴 Disconnected',
      style: { color: 'red', fontWeight: 'bold' }
    },
    'error': {
      textContent: '❌ Connection Error',
      style: { color: 'red', fontWeight: 'bold' }
    }
  },
  '#connection-status'
);

// Watch data freshness
Conditions.watch(
  () => {
    const now = Date.now();
    const elapsed = now - dashboard.lastUpdate;
    
    if (elapsed < 5000) return 'fresh';
    if (elapsed < 30000) return 'recent';
    return 'stale';
  },
  {
    'fresh': {
      textContent: '✓ Data is fresh',
      style: { color: 'green' }
    },
    'recent': {
      textContent: '⚠ Data is aging',
      style: { color: 'orange' }
    },
    'stale': {
      textContent: '⚠ Data is stale',
      style: { color: 'red' }
    }
  },
  '#data-freshness'
);

// Watch server health
Conditions.watch(
  () => dashboard.serverHealth,
  {
    'healthy': {
      textContent: '✓ Server Healthy',
      style: { color: 'green' }
    },
    'degraded': {
      textContent: '⚠ Performance Degraded',
      style: { color: 'orange' }
    },
    'down': {
      textContent: '❌ Server Down',
      style: { color: 'red', fontWeight: 'bold' }
    },
    'default': {
      textContent: '? Status Unknown',
      style: { color: 'gray' }
    }
  },
  '#server-health'
);

// Simulate real-time updates
setInterval(() => {
  // Update connection status
  dashboard.connectionStatus = 
    Math.random() > 0.1 ? 'connected' : 'disconnected';
  
  // Update server health
  const rand = Math.random();
  if (rand > 0.9) dashboard.serverHealth = 'degraded';
  else if (rand > 0.95) dashboard.serverHealth = 'down';
  else dashboard.serverHealth = 'healthy';
  
  // Update timestamp for freshness calculation
  dashboard.lastUpdate = Date.now();
}, 5000);
```

**What happens:**
1. Three separate `watch()` calls monitor different state properties
2. Each updates its respective element automatically
3. Computed freshness value recalculates based on timestamp
4. Everything stays in sync without manual updates!

---

### Example 3: Live Form Validation

**HTML:**
```html
<form>
  <div>
    <input id="username" placeholder="Username">
    <span id="username-feedback"></span>
  </div>
  
  <div>
    <input id="password" type="password" placeholder="Password">
    <span id="password-feedback"></span>
  </div>
  
  <div>
    <input id="confirm" type="password" placeholder="Confirm Password">
    <span id="confirm-feedback"></span>
  </div>
  
  <button id="submit-btn">Submit</button>
</form>
```

**JavaScript:**
```javascript
const form = Reactive.state({
  username: '',
  password: '',
  confirmPassword: '',
  usernameValid: false,
  passwordValid: false,
  passwordsMatch: false
});

// Watch username input
document.getElementById('username').oninput = (e) => {
  form.username = e.target.value;
  form.usernameValid = e.target.value.length >= 3;
};

// Watch password input
document.getElementById('password').oninput = (e) => {
  form.password = e.target.value;
  form.passwordValid = e.target.value.length >= 8;
  form.passwordsMatch = e.target.value === form.confirmPassword;
};

// Watch confirm password input
document.getElementById('confirm').oninput = (e) => {
  form.confirmPassword = e.target.value;
  form.passwordsMatch = form.password === e.target.value;
};

// Explicitly watch username validation state
Conditions.watch(
  () => form.usernameValid,
  {
    'true': {
      textContent: '✓ Valid username',
      style: { color: 'green' }
    },
    'false': {
      textContent: form.username ? '✗ Username too short (min 3 characters)' : 'Username required',
      style: { color: form.username ? 'red' : 'gray' }
    }
  },
  '#username-feedback'
);

// Watch password validation state
Conditions.watch(
  () => form.passwordValid,
  {
    'true': {
      textContent: '✓ Strong password',
      style: { color: 'green' }
    },
    'false': {
      textContent: form.password ? '✗ Password too short (min 8 characters)' : 'Password required',
      style: { color: form.password ? 'red' : 'gray' }
    }
  },
  '#password-feedback'
);

// Watch password match state
Conditions.watch(
  () => form.passwordsMatch,
  {
    'true': {
      textContent: '✓ Passwords match',
      style: { color: 'green' }
    },
    'false': {
      textContent: form.confirmPassword ? '✗ Passwords don\'t match' : 'Confirm your password',
      style: { color: form.confirmPassword ? 'red' : 'gray' }
    }
  },
  '#confirm-feedback'
);

// Watch overall form validity - enable/disable submit
Conditions.watch(
  () => form.usernameValid && form.passwordValid && form.passwordsMatch,
  {
    'true': {
      disabled: false,
      style: { 
        opacity: '1',
        cursor: 'pointer',
        backgroundColor: '#4CAF50'
      },
      textContent: 'Submit ✓'
    },
    'false': {
      disabled: true,
      style: { 
        opacity: '0.5',
        cursor: 'not-allowed',
        backgroundColor: '#ccc'
      },
      textContent: 'Complete form to submit'
    }
  },
  '#submit-btn'
);
```

**What happens:**
1. Input events update reactive state
2. Four `watch()` calls monitor different validation states
3. Feedback messages update in real-time as user types
4. Submit button enables/disables automatically
5. Everything synchronized without manual coordination!

---

### Example 4: Shopping Cart Total

**HTML:**
```html
<div id="cart">
  <div id="item-count">0 items</div>
  <div id="subtotal">$0.00</div>
  <div id="shipping">Calculating...</div>
  <div id="total">$0.00</div>
</div>
```

**JavaScript:**
```javascript
const cart = Reactive.state({
  items: [],
  shippingMethod: 'standard'
});

// Computed: item count
cart.$computed('itemCount', function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Computed: subtotal
cart.$computed('subtotal', function() {
  return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

// Computed: shipping cost
cart.$computed('shippingCost', function() {
  if (this.subtotal > 50) return 0;  // Free shipping over $50
  
  const costs = {
    'standard': 5.99,
    'express': 12.99,
    'overnight': 24.99
  };
  
  return costs[this.shippingMethod] || 0;
});

// Computed: total
cart.$computed('total', function() {
  return this.subtotal + this.shippingCost;
});

// Watch item count
Conditions.watch(
  () => cart.itemCount,
  {
    '0': {
      textContent: 'Cart is empty',
      style: { color: 'gray', fontStyle: 'italic' }
    },
    '1': {
      textContent: '1 item',
      style: { color: 'black', fontStyle: 'normal' }
    },
    'default': {
      textContent: `${cart.itemCount} items`,
      style: { color: 'black', fontStyle: 'normal' }
    }
  },
  '#item-count'
);

// Watch subtotal
Conditions.watch(
  () => cart.subtotal,
  {
    '0': {
      textContent: '$0.00',
      style: { color: 'gray' }
    },
    'default': {
      textContent: `$${cart.subtotal.toFixed(2)}`,
      style: { color: 'black', fontWeight: 'bold' }
    }
  },
  '#subtotal'
);

// Watch shipping with threshold indicator
Conditions.watch(
  () => cart.subtotal >= 50,
  {
    'true': {
      textContent: 'FREE SHIPPING! 🎉',
      style: { color: 'green', fontWeight: 'bold' }
    },
    'false': {
      textContent: `Shipping: $${cart.shippingCost.toFixed(2)} (Free over $50)`,
      style: { color: 'black' }
    }
  },
  '#shipping'
);

// Watch total
Conditions.watch(
  () => cart.total,
  {
    '0': {
      textContent: '$0.00',
      style: { color: 'gray', fontSize: '24px' }
    },
    'default': {
      textContent: `$${cart.total.toFixed(2)}`,
      style: { color: 'green', fontSize: '24px', fontWeight: 'bold' }
    }
  },
  '#total'
);

// Test it - add items
cart.items.push({ name: 'Product 1', price: 19.99, quantity: 1 });
cart.items.push({ name: 'Product 2', price: 29.99, quantity: 2 });
// All displays update automatically!
```

**What happens:**
1. Four `watch()` calls monitor computed values
2. When items change, computed values recalculate
3. When computed values change, `watch()` triggers updates
4. All displays stay synchronized automatically!

---

## When to Use `watch()` vs `whenState()`

### Use `watch()` When:

✅ **You want to be explicit about reactivity**
```javascript
// Clear intent - this MUST be reactive
Conditions.watch(() => state.value, conditions, selector);
```

✅ **Working in a team and want clarity**
```javascript
// Other developers immediately know this is reactive
Conditions.watch(() => state.status, conditions, '#status');
```

✅ **Debugging reactive behavior**
```javascript
// If this doesn't work, you know the problem is with reactive library
Conditions.watch(() => state.value, conditions, selector);
```

✅ **Want to catch missing reactive library early**
```javascript
// Will warn if reactive library is not loaded
Conditions.watch(() => state.value, conditions, selector);
// Console: [Conditions] watch() requires reactive library
```

### Use `whenState()` When:

✅ **You want flexibility (reactive OR static)**
```javascript
// Works with or without reactive library
Conditions.whenState(() => state.value, conditions, selector);
```

✅ **Writing library code that should work in both modes**
```javascript
// Adapts to environment automatically
Conditions.whenState(() => getValue(), conditions, selector);
```

✅ **You might need static mode sometimes**
```javascript
// Can force static with options
Conditions.whenState(
  () => state.value,
  conditions,
  selector,
  { reactive: false }
);
```

---

## The Relationship Between Methods

Here's how they relate:

```javascript
// 1. watch() - Always reactive (or warns)
Conditions.watch(
  () => state.value,
  conditions,
  selector
);
// ↓ Internally calls ↓

// 2. whenState() with reactive: true
Conditions.whenState(
  () => state.value,
  conditions,
  selector,
  { reactive: true }
);
// ↓ Which is ↓

// 3. whenState() with auto-detection
Conditions.whenState(
  () => state.value,
  conditions,
  selector
);
// ↓ Falls back to ↓

// 4. apply() if no reactive library
Conditions.apply(
  currentValue,
  conditions,
  selector
);
```

---

## Cleanup and Memory Management

### Always Clean Up Watchers

`watch()` creates reactive watchers that must be cleaned up:

```javascript
// BAD - Memory leak! ❌
function createWidget() {
  const state = Reactive.state({ active: false });
  
  Conditions.watch(
    () => state.active,
    conditions,
    '.widget'
  );
  // No cleanup! Watcher keeps running forever
}

// GOOD - Proper cleanup ✅
function createWidget() {
  const state = Reactive.state({ active: false });
  
  const cleanup = Conditions.watch(
    () => state.active,
    conditions,
    '.widget'
  );
  
  return {
    state,
    destroy() {
      cleanup.destroy();  // Clean up when widget is destroyed
    }
  };
}

const widget = createWidget();
// Later...
widget.destroy();  // Properly cleaned up!
```

### Cleanup in Component Lifecycle

```javascript
class MyComponent {
  constructor() {
    this.state = Reactive.state({ status: 'idle' });
    this.cleanups = [];
    
    // Store cleanup function
    this.cleanups.push(
      Conditions.watch(
        () => this.state.status,
        conditions,
        this.element
      )
    );
  }
  
  destroy() {
    // Clean up all watchers
    this.cleanups.forEach(cleanup => cleanup.destroy());
    this.cleanups = [];
  }
}
```

---

## Common Patterns

### Pattern 1: Multiple Watchers on Same State

```javascript
const app = Reactive.state({
  userRole: 'guest'
});

// Watch for header
Conditions.watch(
  () => app.userRole,
  {
    'admin': { /* admin header */ },
    'user': { /* user header */ },
    'guest': { /* guest header */ }
  },
  'header'
);

// Watch for sidebar
Conditions.watch(
  () => app.userRole,
  {
    'admin': { /* admin sidebar */ },
    'user': { /* user sidebar */ },
    'guest': { /* no sidebar */ }
  },
  '#sidebar'
);

// Watch for footer
Conditions.watch(
  () => app.userRole,
  {
    'admin': { /* admin footer */ },
    'user': { /* user footer */ },
    'guest': { /* guest footer */ }
  },
  'footer'
);

// One state change updates all three! ✨
app.userRole = 'admin';
```

### Pattern 2: Computed Value Watching

```javascript
const state = Reactive.state({
  firstName: 'John',
  lastName: 'Doe'
});

// Watch computed full name
Conditions.watch(
  () => `${state.firstName} ${state.lastName}`,
  {
    'John Doe': {
      textContent: 'Welcome back, John!',
      style: { color: 'green' }
    },
    'default': {
      textContent: `Hello, ${state.firstName} ${state.lastName}!`,
      style: { color: 'blue' }
    }
  },
  '#greeting'
);

// Updates when either name changes!
state.firstName = 'Jane';  // Updates!
state.lastName = 'Smith';  // Updates again!
```

### Pattern 3: Conditional Display with Animation

```javascript
const modal = Reactive.state({
  isOpen: false,
  content: ''
});

// Watch modal state with animation classes
Conditions.watch(
  () => modal.isOpen,
  {
    'true': {
      style: { display: 'block' },
      classList: { add: 'fade-in', remove: 'fade-out' }
    },
    'false': {
      classList: { add: 'fade-out', remove: 'fade-in' }
    }
  },
  '#modal'
);

// Watch content
Conditions.watch(
  () => modal.content,
  {
    'default': {
      innerHTML: modal.content
    }
  },
  '#modal-content'
);

// Open modal with content
modal.content = '<h2>Hello!</h2><p>Modal content here</p>';
modal.isOpen = true;
```

### Pattern 4: Progressive Loading States

```javascript
const data = Reactive.state({
  loadingProgress: 0,  // 0-100
  loadingState: 'idle'  // idle, loading, success, error
});

// Watch progress percentage
Conditions.watch(
  () => {
    const progress = data.loadingProgress;
    if (progress === 0) return 'not-started';
    if (progress < 50) return 'starting';
    if (progress < 100) return 'almost-done';
    return 'complete';
  },
  {
    'not-started': {
      textContent: 'Ready to load',
      style: { width: '0%', backgroundColor: 'gray' }
    },
    'starting': {
      textContent: `Loading... ${data.loadingProgress}%`,
      style: { width: `${data.loadingProgress}%`, backgroundColor: 'blue' }
    },
    'almost-done': {
      textContent: `Almost there... ${data.loadingProgress}%`,
      style: { width: `${data.loadingProgress}%`, backgroundColor: 'orange' }
    },
    'complete': {
      textContent: '✓ Complete!',
      style: { width: '100%', backgroundColor: 'green' }
    }
  },
  '#progress-bar'
);

// Simulate loading
let progress = 0;
const interval = setInterval(() => {
  progress += 10;
  data.loadingProgress = progress;
  
  if (progress >= 100) {
    clearInterval(interval);
    data.loadingState = 'success';
  }
}, 300);
```

---

## Common Beginner Questions

### Q: Is `watch()` the same as `$watch()` on state objects?

**Answer:** No! They're different but related concepts.

```javascript
const state = Reactive.state({ count: 0 });

// state.$watch() - watches a property, runs callback
state.$watch('count', (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

// Conditions.watch() - watches state, updates DOM
Conditions.watch(
  () => state.count,
  {
    '0': { textContent: 'Zero' },
    '1': { textContent: 'One' },
    'default': { textContent: `Count: ${state.count}` }
  },
  '#counter'
);
```

**`state.$watch()`**: React to changes with custom code  
**`Conditions.watch()`**: React to changes by updating DOM elements

---

### Q: What happens if the reactive library is not loaded?

**Answer:** `watch()` will warn you and fall back to static mode.

```javascript
// Without reactive library loaded:
Conditions.watch(() => state.value, conditions, selector);

// Console output:
// [Conditions] watch() requires reactive library

// Falls back to:
Conditions.apply(valueFn(), conditions, selector);
// Applies once statically
```

**Why this is good:** Fails gracefully rather than breaking your app!

---

### Q: Can I watch multiple properties at once?

**Answer:** Yes! Just access all properties in your function.

```javascript
const state = Reactive.state({
  firstName: 'John',
  lastName: 'Doe',
  age: 30
});

// Watches all three properties!
Conditions.watch(
  () => {
    const name = `${state.firstName} ${state.lastName}`;
    const adult = state.age >= 18;
    
    if (adult) return `adult-${name}`;
    return `minor-${name}`;
  },
  {
    'adult-John Doe': { /* ... */ },
    'minor-John Doe': { /* ... */ },
    'default': { /* ... */ }
  },
  '#profile'
);

// Changes to ANY of these trigger updates:
state.firstName = 'Jane';  // Updates!
state.lastName = 'Smith';  // Updates!
state.age = 17;           // Updates!
```

---

### Q: How is `watch()` different from `effect()`?

**Answer:** Different purposes!

```javascript
// Reactive.effect() - Run any code when dependencies change
Reactive.effect(() => {
  console.log('Count is:', state.count);
  // Can do ANYTHING here
  doSomething();
  updateSomethingElse();
});

// Conditions.watch() - Update DOM elements when state changes
Conditions.watch(
  () => state.count,
  {
    '0': { textContent: 'Zero' },
    'default': { textContent: `Count: ${state.count}` }
  },
  '#counter'
);
```

**`Reactive.effect()`**: General-purpose reactive function  
**`Conditions.watch()`**: Specific to DOM updates with conditions

---

## Tips and Best Practices

### Tip 1: Use Descriptive Names for Clarity

```javascript
// ✅ Good - clear what's being watched
const statusWatcher = Conditions.watch(
  () => app.connectionStatus,
  statusConditions,
  '#status'
);

const themeWatcher = Conditions.watch(
  () => app.theme,
  themeConditions,
  'body'
);

// Later - clear what you're destroying
statusWatcher.destroy();
themeWatcher.destroy();
```

### Tip 2: Group Related Watches

```javascript
// Create a manager for related watches
class DashboardWatchers {
  constructor(state) {
    this.state = state;
    this.watchers = [];
    
    this.watchers.push(
      Conditions.watch(() => state.status, statusConditions, '#status')
    );
    
    this.watchers.push(
      Conditions.watch(() => state.data, dataConditions, '#data')
    );
    
    this.watchers.push(
      Conditions.watch(() => state.errors, errorConditions, '#errors')
    );
  }
  
  destroy() {
    this.watchers.forEach(w => w.destroy());
    this.watchers = [];
  }
}

const dashboard = new DashboardWatchers(state);
// Later...
dashboard.destroy();
```

### Tip 3: Use Default Branch for Safety

```javascript
// ✅ Always provide a default fallback
Conditions.watch(
  () => state.value,
  {
    'expected1': { /* ... */ },
    'expected2': { /* ... */ },
    'default': { /* safe fallback */ }
  },
  selector
);
```

### Tip 4: Keep Watch Functions Simple

```javascript
// ❌ Bad - complex logic in watch function
Conditions.watch(
  () => {
    const x = calculateSomething(state.a);
    const y = transformData(state.b);
    const z = combineResults(x, y);
    return processEverything(z);
  },
  conditions,
  selector
);

// ✅ Good - use computed properties
state.$computed('result', function() {
  const x = calculateSomething(this.a);
  const y = transformData(this.b);
  const z = combineResults(x, y);
  return processEverything(z);
});

Conditions.watch(
  () => state.result,
  conditions,
  selector
);
```

---

## Summary

### What `watch()` Does:

1. ✅ Forces reactive mode explicitly
2. ✅ Warns if reactive library is missing
3. ✅ Watches state continuously
4. ✅ Updates DOM automatically on changes
5. ✅ Provides cleanup for memory management

### When to Use It:

- You want explicit reactive behavior
- Working in a team (clarity for others)
- Debugging reactive issues
- Need to catch missing reactive library early
- Want clear intent in your code

### The Basic Pattern:

```javascript
// 1. Create reactive state
const state = Reactive.state({ property: 'value' });

// 2. Set up explicit watcher
const cleanup = Conditions.watch(
  () => state.property,  // What to watch (MUST be function)
  {
    'condition1': { /* config */ },
    'condition2': { /* config */ },
    'default': { /* fallback */ }
  },
  '#element'  // What to update
);

// 3. Changes update automatically
state.property = 'newValue';  // Updates instantly! ✨

// 4. Clean up when done
cleanup.destroy();
```

### Quick Decision Guide:

- **Want explicit reactivity?** → Use `watch()`
- **Need flexibility?** → Use `whenState()`
- **One-time update?** → Use `apply()`
- **Missing reactive library okay?** → Use `whenState()`
- **Missing reactive library NOT okay?** → Use `watch()` (will warn)

---

**Remember:** `watch()` is your explicit, "I definitely need reactivity" method. It's perfect when you want to be clear about your intentions and catch configuration issues early. Use it when clarity matters! 🎉