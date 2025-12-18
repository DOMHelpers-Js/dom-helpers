# Understanding `whenState()` - A Beginner's Guide

## What is `whenState()`?

`whenState()` is the **main method** for conditional rendering in the Conditions system. It automatically applies different configurations to HTML elements based on the current value of your state.

Think of it as a **smart switcher** that:
1. Watches your data (state)
2. Checks which condition matches
3. Automatically updates your HTML elements
4. Keeps everything in sync as data changes

It's like having a **personal assistant** that updates your UI whenever your app's state changes!

---

## Why Does `whenState()` Exist?

### The Old Way (Manual DOM Updates)

Before `whenState()`, you had to manually update the DOM every time your state changed:

```javascript
let status = 'loading';

function updateUI() {
  const statusElement = document.getElementById('status');
  
  if (status === 'loading') {
    statusElement.textContent = 'Loading...';
    statusElement.style.color = 'blue';
    statusElement.classList.add('spinner');
  } else if (status === 'success') {
    statusElement.textContent = 'Success!';
    statusElement.style.color = 'green';
    statusElement.classList.remove('spinner');
  } else if (status === 'error') {
    statusElement.textContent = 'Error occurred';
    statusElement.style.color = 'red';
    statusElement.classList.remove('spinner');
  }
}

// You must remember to call this EVERY time status changes!
status = 'success';
updateUI(); // Don't forget!

status = 'error';
updateUI(); // Don't forget again!
```

**Problems:**
- You have to write the same update logic everywhere
- Easy to forget to call `updateUI()`
- Lots of repetitive if/else statements
- Hard to maintain and update
- Difficult to add new states
- Prone to bugs and inconsistencies

### The New Way (With `whenState()`)

With `whenState()`, you define the conditions **once** and it handles everything automatically:

```javascript
const state = Reactive.state({ status: 'loading' });

// Define conditions ONCE
Conditions.whenState(
  () => state.status,  // What to watch
  {
    'loading': {
      textContent: 'Loading...',
      style: { color: 'blue' },
      classList: { add: 'spinner' }
    },
    'success': {
      textContent: 'Success!',
      style: { color: 'green' },
      classList: { remove: 'spinner' }
    },
    'error': {
      textContent: 'Error occurred',
      style: { color: 'red' },
      classList: { remove: 'spinner' }
    }
  },
  '#status'  // What to update
);

// Just change the state - updates happen automatically!
state.status = 'success';  // UI updates instantly ✨
state.status = 'error';    // UI updates again ✨
```

**Benefits:**
- ✅ Write update logic **once**
- ✅ No need to call update functions
- ✅ Cleaner, more declarative code
- ✅ Easy to add or modify conditions
- ✅ Automatic synchronization
- ✅ Works with reactive state or static values

---

## How Does It Work?

### The Concept

`whenState()` works like a **smart mapping**:

```
Current Value → Match Condition → Apply Configuration → Update Element
```

**Step by Step:**

1. **Watch**: Monitors your state value
2. **Match**: Checks which condition matches the current value
3. **Apply**: Applies the corresponding configuration to elements
4. **Update**: Automatically updates elements when value changes
5. **Repeat**: Continues watching and updating automatically

### Visual Example

```javascript
// Your state
const state = { theme: 'light' };

// Your conditions
{
  'light': { /* light theme config */ },
  'dark': { /* dark theme config */ }
}

// When theme = 'light' → Apply light config
// When theme = 'dark' → Apply dark config
```

---

## Basic Usage

### Syntax

```javascript
Conditions.whenState(valueFn, conditions, selector, options)
```

**Parameters:**

1. **`valueFn`** (Function | Any) - What to watch
   - Function: `() => state.property` (reactive - watches changes)
   - Direct value: `'active'` (static - applies once)

2. **`conditions`** (Object | Function) - Condition mappings
   - Object with conditions as keys and configurations as values
   - Function returning conditions object (for dynamic conditions)

3. **`selector`** (String | Element | NodeList) - What to update
   - CSS selector: `'#myElement'`, `'.items'`, `'button'`
   - Direct element: `document.getElementById('myElement')`
   - NodeList/Array: Multiple elements

4. **`options`** (Object) - Optional settings
   - `{ reactive: true }` - Force reactive mode
   - `{ reactive: false }` - Force static mode

**Returns:**
- Reactive mode: `{ update, destroy }` cleanup object
- Static mode: `Conditions` object (chainable)

---

## Practical Examples

### Example 1: Simple Status Indicator

**HTML:**
```html
<div id="status">Checking...</div>
```

**JavaScript:**
```javascript
const app = Reactive.state({
  status: 'idle'
});

Conditions.whenState(
  () => app.status,  // Watch status
  {
    'idle': {
      textContent: 'Ready',
      style: { color: '#666' }
    },
    'loading': {
      textContent: 'Loading...',
      style: { color: 'blue' },
      classList: { add: 'spinner' }
    },
    'success': {
      textContent: '✓ Success!',
      style: { color: 'green' }
    },
    'error': {
      textContent: '✗ Error',
      style: { color: 'red' }
    }
  },
  '#status'
);

// Test it out
app.status = 'loading';  // Shows "Loading..." in blue with spinner
app.status = 'success';  // Shows "✓ Success!" in green
app.status = 'error';    // Shows "✗ Error" in red
```

**What happens:**
1. Creates reactive state with `status` property
2. `whenState()` watches `app.status`
3. When status changes, finds matching condition
4. Applies configuration to `#status` element
5. Updates happen automatically!

---

### Example 2: Theme Switcher

**HTML:**
```html
<body>
  <button id="theme-toggle">Toggle Theme</button>
  <div class="content">Your content here</div>
</body>
```

**JavaScript:**
```javascript
const app = Reactive.state({
  theme: 'light'
});

// Apply theme to body
Conditions.whenState(
  () => app.theme,
  {
    'light': {
      style: {
        backgroundColor: '#ffffff',
        color: '#000000'
      },
      classList: { add: 'light-theme', remove: 'dark-theme' }
    },
    'dark': {
      style: {
        backgroundColor: '#1a1a1a',
        color: '#ffffff'
      },
      classList: { add: 'dark-theme', remove: 'light-theme' }
    }
  },
  'body'
);

// Update toggle button text
Conditions.whenState(
  () => app.theme,
  {
    'light': { textContent: '🌙 Dark Mode' },
    'dark': { textContent: '☀️ Light Mode' }
  },
  '#theme-toggle'
);

// Toggle handler
document.getElementById('theme-toggle').onclick = () => {
  app.theme = app.theme === 'light' ? 'dark' : 'light';
};
```

**What happens:**
1. State starts with `theme: 'light'`
2. First `whenState()` applies light theme to body
3. Second `whenState()` sets button text to "🌙 Dark Mode"
4. When button is clicked, theme toggles
5. Both `whenState()` calls automatically update their elements!

---

### Example 3: User Authentication State

**HTML:**
```html
<div id="auth-status"></div>
<div id="user-menu"></div>
```

**JavaScript:**
```javascript
const auth = Reactive.state({
  isAuthenticated: false,
  user: null
});

// Update status message
Conditions.whenState(
  () => auth.isAuthenticated,
  {
    'true': {  // Boolean true as string
      textContent: `Welcome back!`,
      style: { color: 'green' }
    },
    'false': {  // Boolean false as string
      textContent: 'Please log in',
      style: { color: 'gray' }
    }
  },
  '#auth-status'
);

// Update menu
Conditions.whenState(
  () => auth.isAuthenticated,
  {
    'true': {
      innerHTML: `
        <button onclick="viewProfile()">Profile</button>
        <button onclick="logout()">Logout</button>
      `,
      style: { display: 'block' }
    },
    'false': {
      innerHTML: `
        <button onclick="showLogin()">Login</button>
        <button onclick="showRegister()">Register</button>
      `,
      style: { display: 'block' }
    }
  },
  '#user-menu'
);

// Simulate login
function login(username) {
  auth.isAuthenticated = true;
  auth.user = { username };
  // UI updates automatically!
}

// Simulate logout
function logout() {
  auth.isAuthenticated = false;
  auth.user = null;
  // UI updates automatically!
}
```

---

### Example 4: Form Validation State

**HTML:**
```html
<form>
  <input id="email" type="email" placeholder="Email">
  <span id="email-feedback"></span>
  <button id="submit-btn">Submit</button>
</form>
```

**JavaScript:**
```javascript
const form = Reactive.state({
  email: '',
  emailState: 'empty'  // empty, invalid, valid
});

// Watch email input
document.getElementById('email').oninput = (e) => {
  const value = e.target.value;
  form.email = value;
  
  // Determine validation state
  if (!value) {
    form.emailState = 'empty';
  } else if (!value.includes('@') || !value.includes('.')) {
    form.emailState = 'invalid';
  } else {
    form.emailState = 'valid';
  }
};

// Update feedback message
Conditions.whenState(
  () => form.emailState,
  {
    'empty': {
      textContent: 'Email is required',
      style: { color: '#666' }
    },
    'invalid': {
      textContent: '✗ Invalid email format',
      style: { color: 'red' }
    },
    'valid': {
      textContent: '✓ Looks good!',
      style: { color: 'green' }
    }
  },
  '#email-feedback'
);

// Update input border
Conditions.whenState(
  () => form.emailState,
  {
    'empty': {
      style: { borderColor: '#ccc' }
    },
    'invalid': {
      style: { borderColor: 'red' }
    },
    'valid': {
      style: { borderColor: 'green' }
    }
  },
  '#email'
);

// Enable/disable submit button
Conditions.whenState(
  () => form.emailState,
  {
    'valid': {
      disabled: false,
      style: { opacity: '1', cursor: 'pointer' }
    },
    'default': {  // Catches 'empty' and 'invalid'
      disabled: true,
      style: { opacity: '0.5', cursor: 'not-allowed' }
    }
  },
  '#submit-btn'
);
```

**What happens:**
1. As user types, `emailState` updates based on validation
2. Feedback message updates automatically
3. Input border color changes automatically
4. Submit button enables/disables automatically
5. Everything stays in sync without manual updates!

---

## Advanced Features

### Using Functions for Dynamic Conditions

You can use a function that returns conditions for dynamic behavior:

```javascript
const app = Reactive.state({
  score: 0,
  difficulty: 'normal'
});

Conditions.whenState(
  () => app.score,
  () => {
    // Return different conditions based on difficulty
    if (app.difficulty === 'easy') {
      return {
        '>=100': { textContent: 'Amazing!', style: { color: 'gold' } },
        '>=50': { textContent: 'Great!', style: { color: 'green' } },
        'default': { textContent: 'Keep going!', style: { color: 'blue' } }
      };
    } else {
      return {
        '>=500': { textContent: 'Legendary!', style: { color: 'gold' } },
        '>=200': { textContent: 'Great!', style: { color: 'green' } },
        'default': { textContent: 'Keep trying!', style: { color: 'blue' } }
      };
    }
  },
  '#score-message'
);
```

---

### Static vs Reactive Modes

#### Reactive Mode (Default with Reactive Library)

Automatically watches for changes:

```javascript
const state = Reactive.state({ status: 'idle' });

// Automatically watches state.status
const cleanup = Conditions.whenState(
  () => state.status,
  conditions,
  '#status'
);

// Later, clean up
cleanup.destroy();
```

#### Static Mode (One-Time Application)

Applies once without watching:

```javascript
// Pass direct value (not a function)
Conditions.whenState(
  'success',  // Direct value, not () => value
  conditions,
  '#status'
);

// Or force static mode
Conditions.whenState(
  () => state.status,
  conditions,
  '#status',
  { reactive: false }  // Force static
);
```

---

### Working with Multiple Elements

Apply to multiple elements at once:

```javascript
const app = Reactive.state({
  mode: 'normal'
});

// Apply to all elements with class 'card'
Conditions.whenState(
  () => app.mode,
  {
    'compact': {
      style: { padding: '10px', fontSize: '14px' }
    },
    'normal': {
      style: { padding: '20px', fontSize: '16px' }
    },
    'expanded': {
      style: { padding: '30px', fontSize: '18px' }
    }
  },
  '.card'  // All elements with this class
);
```

---

## Cleanup and Memory Management

### Automatic Cleanup (Reactive Mode)

When using reactive mode, `whenState()` returns a cleanup object:

```javascript
const cleanup = Conditions.whenState(
  () => state.value,
  conditions,
  selector
);

// When you're done (component unmounted, page changed, etc.)
cleanup.destroy();
```

### Why Cleanup Matters

```javascript
// BAD - Memory leak! ❌
function createWidget() {
  const state = Reactive.state({ active: false });
  
  Conditions.whenState(
    () => state.active,
    conditions,
    '.widget'
  );
  // No cleanup! Watcher keeps running even after widget is removed
}

// GOOD - Proper cleanup ✅
function createWidget() {
  const state = Reactive.state({ active: false });
  
  const cleanup = Conditions.whenState(
    () => state.active,
    conditions,
    '.widget'
  );
  
  return {
    destroy() {
      cleanup.destroy();  // Clean up when widget is destroyed
    }
  };
}

const widget = createWidget();
// Later...
widget.destroy();  // Properly cleaned up!
```

---

## Common Patterns

### Pattern 1: Loading States

```javascript
const app = Reactive.state({
  loadingState: 'idle'  // idle, loading, success, error
});

Conditions.whenState(
  () => app.loadingState,
  {
    'idle': {
      textContent: 'Click to load',
      classList: { remove: ['loading', 'success', 'error'] }
    },
    'loading': {
      textContent: 'Loading...',
      classList: { add: 'loading', remove: ['success', 'error'] },
      disabled: true
    },
    'success': {
      textContent: '✓ Loaded',
      classList: { add: 'success', remove: ['loading', 'error'] },
      disabled: false
    },
    'error': {
      textContent: '✗ Failed',
      classList: { add: 'error', remove: ['loading', 'success'] },
      disabled: false
    }
  },
  '#load-button'
);
```

### Pattern 2: Visibility Toggle

```javascript
const app = Reactive.state({
  showModal: false
});

Conditions.whenState(
  () => app.showModal,
  {
    'true': {
      style: { display: 'block' },
      classList: { add: 'visible' }
    },
    'false': {
      style: { display: 'none' },
      classList: { remove: 'visible' }
    }
  },
  '#modal'
);
```

### Pattern 3: Multi-Step Form

```javascript
const form = Reactive.state({
  step: 1  // 1, 2, 3
});

// Show/hide steps
[1, 2, 3].forEach(stepNum => {
  Conditions.whenState(
    () => form.step,
    {
      [stepNum]: { style: { display: 'block' } },
      'default': { style: { display: 'none' } }
    },
    `#step-${stepNum}`
  );
});

// Update navigation buttons
Conditions.whenState(
  () => form.step,
  {
    '1': { style: { display: 'none' } },
    'default': { style: { display: 'inline-block' } }
  },
  '#prev-button'
);

Conditions.whenState(
  () => form.step,
  {
    '3': { style: { display: 'none' } },
    'default': { style: { display: 'inline-block' } }
  },
  '#next-button'
);
```

---

## Common Beginner Questions

### Q: What's the difference between `whenState()` and `apply()`?

**Answer:**

- **`whenState()`** = Reactive (watches for changes) OR static (one-time)
- **`apply()`** = Always static (one-time only)

```javascript
// whenState - watches for changes
Conditions.whenState(() => state.value, conditions, selector);
// Updates automatically when state.value changes ✨

// apply - applies once
Conditions.apply('active', conditions, selector);
// Does NOT watch for changes
```

**When to use each:**
- Use `whenState()` when working with reactive state
- Use `apply()` for one-time static updates

---

### Q: Can I use `whenState()` without a reactive library?

**Answer:** Yes! It works in static mode.

```javascript
// Without reactive library - static mode
let status = 'loading';

function updateStatus(newStatus) {
  status = newStatus;
  
  // Apply manually
  Conditions.whenState(
    status,  // Direct value
    conditions,
    '#status'
  );
}

updateStatus('success');  // Apply once
updateStatus('error');    // Apply again
```

But it's much better with reactivity:

```javascript
// With reactive library - automatic mode
const state = Reactive.state({ status: 'loading' });

// Set up once
Conditions.whenState(
  () => state.status,
  conditions,
  '#status'
);

// Just change the value - updates automatically!
state.status = 'success';
state.status = 'error';
```

---

### Q: What if no condition matches?

**Answer:** Nothing happens (element stays unchanged), unless you use a `'default'` condition.

```javascript
Conditions.whenState(
  () => state.value,
  {
    'option1': { /* config */ },
    'option2': { /* config */ },
    'default': { /* fallback config */ }  // Catches everything else
  },
  selector
);
```

---

### Q: Can I update multiple elements with one `whenState()` call?

**Answer:** Yes! Use a selector that matches multiple elements.

```javascript
// Updates all elements with class 'item'
Conditions.whenState(
  () => state.theme,
  conditions,
  '.item'  // Matches multiple elements
);
```

---

### Q: Can I use `whenState()` on elements that don't exist yet?

**Answer:** The elements must exist when `whenState()` is called. If elements are added dynamically, call `whenState()` after they're added.

```javascript
// BAD - elements don't exist yet ❌
Conditions.whenState(() => state.value, conditions, '.dynamic-item');
// Then add elements later...

// GOOD - add elements first, then set up conditions ✅
// Add elements to DOM
document.getElementById('container').innerHTML = '<div class="dynamic-item"></div>';

// Now set up conditions
Conditions.whenState(() => state.value, conditions, '.dynamic-item');
```

---

## Tips and Best Practices

### Tip 1: Use Descriptive State Values

```javascript
// BAD - unclear ❌
const state = Reactive.state({ s: 0 });  // What does 0 mean?

// GOOD - clear ✅
const state = Reactive.state({ status: 'idle' });
```

### Tip 2: Group Related Conditions

```javascript
// Organize conditions by feature
const STATUS_CONDITIONS = {
  'loading': { /* ... */ },
  'success': { /* ... */ },
  'error': { /* ... */ }
};

const THEME_CONDITIONS = {
  'light': { /* ... */ },
  'dark': { /* ... */ }
};

Conditions.whenState(() => state.status, STATUS_CONDITIONS, '#status');
Conditions.whenState(() => state.theme, THEME_CONDITIONS, 'body');
```

### Tip 3: Clean Up Properly

```javascript
// Store cleanup functions
const cleanups = [];

cleanups.push(
  Conditions.whenState(/* ... */)
);

// Later, clean up all at once
cleanups.forEach(cleanup => cleanup.destroy());
```

### Tip 4: Use Default Branch for Safety

```javascript
Conditions.whenState(
  () => state.value,
  {
    'expected1': { /* ... */ },
    'expected2': { /* ... */ },
    'default': { /* safe fallback */ }  // Always provide a fallback!
  },
  selector
);
```

---

## Summary

### What `whenState()` Does:

1. ✅ Watches reactive state (or applies static values)
2. ✅ Matches conditions to current value
3. ✅ Applies configurations to HTML elements
4. ✅ Updates automatically when state changes
5. ✅ Provides cleanup for memory management

### When to Use It:

- Updating UI based on application state
- Conditional rendering (show/hide, enable/disable)
- Theme switching
- Loading states
- Form validation feedback
- User authentication states
- Multi-step workflows

### The Basic Pattern:

```javascript
// 1. Create reactive state
const state = Reactive.state({ property: 'value' });

// 2. Set up conditions
const cleanup = Conditions.whenState(
  () => state.property,  // What to watch
  {
    'condition1': { /* config */ },
    'condition2': { /* config */ },
    'default': { /* fallback */ }
  },
  '#element'  // What to update
);

// 3. Just change the state - updates happen automatically!
state.property = 'newValue';

// 4. Clean up when done
cleanup.destroy();
```

### Quick Decision Guide:

- **Need automatic updates?** → Use `whenState()` with reactive state
- **One-time update?** → Use `whenState()` with static value or `apply()`
- **Multiple elements?** → Use class selector or query selector
- **Need cleanup?** → Always call `cleanup.destroy()`

---

**Remember:** `whenState()` is your main tool for declarative, reactive UI updates. Define your conditions once, and let the system handle all the updates automatically. It's the professional way to build dynamic interfaces! 🎉