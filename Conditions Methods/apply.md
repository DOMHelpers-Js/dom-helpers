# Understanding `apply()` - A Beginner's Guide

## What is `apply()`?

`apply()` is a method for **one-time, static conditional rendering**. It applies different configurations to HTML elements based on a current value, **without watching for future changes**.

Think of it as a **snapshot applier** that:
1. Takes a current value
2. Matches it against conditions
3. Applies the matching configuration **once**
4. Stops there (doesn't watch for changes)

It's like taking a **photo** of your state and applying styles based on that moment - it doesn't create a video that updates automatically!

---

## Why Does `apply()` Exist?

### When You DON'T Need Reactivity

Sometimes you just want to apply styles or configurations **once** based on a current value, without the overhead of watching for changes:

```javascript
// Scenario: Apply initial theme from URL parameter
const urlTheme = new URLSearchParams(window.location.search).get('theme');

// Just apply it once - no need to watch
Conditions.apply(
  urlTheme || 'light',  // 'light' or 'dark'
  {
    'light': { style: { background: '#fff', color: '#000' } },
    'dark': { style: { background: '#000', color: '#fff' } }
  },
  'body'
);
```

### The Difference

**With `whenState()` (Reactive):**
```javascript
// Watches for changes continuously
const state = Reactive.state({ theme: 'light' });

Conditions.whenState(
  () => state.theme,  // Function - watches this
  conditions,
  'body'
);

state.theme = 'dark';  // Updates automatically ✨
state.theme = 'light'; // Updates again ✨
```

**With `apply()` (Static):**
```javascript
// Applies once, no watching
let theme = 'light';

Conditions.apply(
  theme,  // Direct value - no watching
  conditions,
  'body'
);

theme = 'dark';  // No update! You must call apply() again manually
```

---

## How Does It Work?

### The Concept

`apply()` works like a **one-time matcher**:

```
Current Value → Match Condition → Apply Configuration → Done!
```

**Step by Step:**

1. **Receive**: Takes a static value (not a function)
2. **Match**: Checks which condition matches the value
3. **Apply**: Applies the matching configuration to elements
4. **Stop**: Doesn't set up any watchers or listeners
5. **Done**: That's it! One and done.

### Visual Example

```javascript
// Current value
let status = 'success';

// Apply once
Conditions.apply(status, conditions, '#status');

// Later...
status = 'error';  // Nothing happens!
// Must call apply() again manually:
Conditions.apply(status, conditions, '#status');
```

---

## Basic Usage

### Syntax

```javascript
Conditions.apply(value, conditions, selector)
```

**Parameters:**

1. **`value`** (Any) - Current value to match
   - **Not a function** - just the direct value
   - String: `'active'`, `'dark'`, `'success'`
   - Number: `42`, `100`, `0`
   - Boolean: `true`, `false`
   - Any value that can be compared

2. **`conditions`** (Object | Function) - Condition mappings
   - Object with conditions as keys and configurations as values
   - Function returning conditions object
   - **Supports `'default'` branch** for fallback

3. **`selector`** (String | Element | NodeList) - What to update
   - CSS selector: `'#myElement'`, `'.items'`, `'button'`
   - Direct element: `document.getElementById('myElement')`
   - NodeList/Array: Multiple elements

**Returns:**
- `Conditions` object (chainable)

---

## Practical Examples

### Example 1: Apply Initial State

**HTML:**
```html
<div id="welcome-message"></div>
```

**JavaScript:**
```javascript
// Get user type from somewhere (localStorage, URL, etc.)
const userType = localStorage.getItem('userType') || 'guest';

// Apply once based on user type
Conditions.apply(
  userType,
  {
    'admin': {
      textContent: 'Welcome, Administrator!',
      style: { 
        color: 'red',
        fontWeight: 'bold'
      }
    },
    'member': {
      textContent: 'Welcome back, Member!',
      style: { 
        color: 'green',
        fontWeight: 'normal'
      }
    },
    'guest': {
      textContent: 'Welcome, Guest! Please sign in.',
      style: { 
        color: 'gray',
        fontWeight: 'normal'
      }
    }
  },
  '#welcome-message'
);
```

**What happens:**
1. Gets `userType` from localStorage
2. Matches it against conditions
3. Applies the matching configuration
4. Done! No watching for changes.

---

### Example 2: URL-Based Configuration

**HTML:**
```html
<body>
  <div class="content">Your content here</div>
</body>
```

**JavaScript:**
```javascript
// Get theme from URL parameter
// Example: https://example.com?theme=dark
const params = new URLSearchParams(window.location.search);
const theme = params.get('theme') || 'light';

// Apply theme once based on URL
Conditions.apply(
  theme,
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
    },
    'high-contrast': {
      style: {
        backgroundColor: '#000000',
        color: '#ffff00'
      },
      classList: { add: 'high-contrast-theme' }
    }
  },
  'body'
);
```

---

### Example 3: Device-Based Layout

**JavaScript:**
```javascript
// Detect device type
function getDeviceType() {
  const width = window.innerWidth;
  
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

const deviceType = getDeviceType();

// Apply layout based on device
Conditions.apply(
  deviceType,
  {
    'mobile': {
      style: {
        padding: '10px',
        fontSize: '14px'
      },
      classList: { add: 'mobile-layout' }
    },
    'tablet': {
      style: {
        padding: '20px',
        fontSize: '16px'
      },
      classList: { add: 'tablet-layout' }
    },
    'desktop': {
      style: {
        padding: '30px',
        fontSize: '18px'
      },
      classList: { add: 'desktop-layout' }
    }
  },
  '.container'
);
```

---

### Example 4: Form Result Display

**HTML:**
```html
<div id="result"></div>
```

**JavaScript:**
```javascript
// Form submission handler
document.getElementById('myForm').onsubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: new FormData(e.target)
    });
    
    if (response.ok) {
      // Show success
      Conditions.apply(
        'success',
        {
          'success': {
            textContent: '✓ Form submitted successfully!',
            style: { 
              color: 'green',
              padding: '15px',
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              borderRadius: '4px',
              display: 'block'
            }
          }
        },
        '#result'
      );
    } else {
      // Show error
      Conditions.apply(
        'error',
        {
          'error': {
            textContent: '✗ Submission failed. Please try again.',
            style: { 
              color: 'red',
              padding: '15px',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              display: 'block'
            }
          }
        },
        '#result'
      );
    }
  } catch (error) {
    // Show network error
    Conditions.apply(
      'network-error',
      {
        'network-error': {
          textContent: '✗ Network error. Check your connection.',
          style: { 
            color: 'orange',
            padding: '15px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
            display: 'block'
          }
        }
      },
      '#result'
    );
  }
};
```

**What happens:**
1. Form submits
2. Based on the result (success/error/network-error), calls `apply()`
3. Shows appropriate message with styling
4. No need for reactivity - it's a one-time result display

---

## Using Default Branch

The `'default'` branch is a **safety net** that catches any value that doesn't match other conditions.

### Example: Safe Fallback

```javascript
const status = 'unknown-status';  // Oops, unexpected value!

Conditions.apply(
  status,
  {
    'success': {
      textContent: 'Success!',
      style: { color: 'green' }
    },
    'error': {
      textContent: 'Error!',
      style: { color: 'red' }
    },
    'default': {  // Catches 'unknown-status' and anything else
      textContent: 'Status unknown',
      style: { color: 'gray' }
    }
  },
  '#status'
);
```

**Without default:**
```javascript
Conditions.apply(
  'unknown-status',
  {
    'success': { /* ... */ },
    'error': { /* ... */ }
    // No default! Element stays unchanged
  },
  '#status'
);
// Nothing happens! Element doesn't update at all.
```

---

## Chaining Multiple `apply()` Calls

`apply()` returns the `Conditions` object, so you can **chain multiple calls**:

```javascript
Conditions
  .apply('dark', themeConditions, 'body')
  .apply('premium', planConditions, '#plan-badge')
  .apply('success', statusConditions, '#status')
  .apply('expanded', layoutConditions, '.sidebar');
```

This is useful for applying multiple independent configurations in one go.

---

## Manual Updates

Since `apply()` doesn't watch for changes, you need to **call it again manually** when values change:

```javascript
let currentTheme = 'light';

// Initial application
Conditions.apply(currentTheme, themeConditions, 'body');

// User clicks theme toggle
document.getElementById('theme-toggle').onclick = () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  // Must call apply() again manually!
  Conditions.apply(currentTheme, themeConditions, 'body');
};
```

**Compare with reactive approach:**
```javascript
const state = Reactive.state({ theme: 'light' });

// Set up once with whenState()
Conditions.whenState(() => state.theme, themeConditions, 'body');

// User clicks theme toggle
document.getElementById('theme-toggle').onclick = () => {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  // Updates automatically! No need to call anything ✨
};
```

---

## When to Use `apply()` vs `whenState()`

### Use `apply()` When:

✅ **One-time initialization**
```javascript
// Apply initial theme from URL
const theme = new URLSearchParams(location.search).get('theme') || 'light';
Conditions.apply(theme, conditions, 'body');
```

✅ **No reactive library available**
```javascript
// Plain JavaScript project
let status = 'loading';
Conditions.apply(status, conditions, '#status');
```

✅ **Event-driven updates** (you control when updates happen)
```javascript
button.onclick = () => {
  const result = processClick();
  Conditions.apply(result, conditions, '#result');
};
```

✅ **Performance-critical code** (avoid watcher overhead)
```javascript
// Thousands of elements, updated rarely
elements.forEach((el, i) => {
  Conditions.apply(getStatusFor(i), conditions, el);
});
```

### Use `whenState()` When:

✅ **Working with reactive state**
```javascript
const state = Reactive.state({ theme: 'light' });
Conditions.whenState(() => state.theme, conditions, 'body');
```

✅ **Need automatic synchronization**
```javascript
// Updates automatically when state changes
state.count++;  // UI updates instantly
```

✅ **Multiple parts of UI depend on same state**
```javascript
Conditions.whenState(() => state.theme, headerConditions, 'header');
Conditions.whenState(() => state.theme, bodyConditions, 'body');
Conditions.whenState(() => state.theme, footerConditions, 'footer');
// All three update automatically when state.theme changes!
```

---

## Common Patterns

### Pattern 1: Configuration from Data Attributes

```javascript
// HTML: <div id="widget" data-mode="compact"></div>

const element = document.getElementById('widget');
const mode = element.dataset.mode;

Conditions.apply(
  mode,
  {
    'compact': {
      style: { padding: '5px', fontSize: '12px' }
    },
    'normal': {
      style: { padding: '10px', fontSize: '14px' }
    },
    'expanded': {
      style: { padding: '20px', fontSize: '16px' }
    }
  },
  element
);
```

### Pattern 2: Apply to Multiple Elements

```javascript
const items = document.querySelectorAll('.item');

items.forEach((item, index) => {
  const priority = item.dataset.priority;
  
  Conditions.apply(
    priority,
    {
      'high': {
        style: { 
          borderLeft: '4px solid red',
          backgroundColor: '#ffebee'
        }
      },
      'medium': {
        style: { 
          borderLeft: '4px solid orange',
          backgroundColor: '#fff3e0'
        }
      },
      'low': {
        style: { 
          borderLeft: '4px solid green',
          backgroundColor: '#e8f5e9'
        }
      }
    },
    item
  );
});
```

### Pattern 3: Progressive Enhancement

```javascript
// Check if feature is supported
const hasLocalStorage = typeof localStorage !== 'undefined';

Conditions.apply(
  hasLocalStorage,
  {
    'true': {
      textContent: 'Settings will be saved',
      style: { color: 'green' }
    },
    'false': {
      textContent: 'Settings will not be saved (localStorage unavailable)',
      style: { color: 'orange' }
    }
  },
  '#storage-notice'
);
```

### Pattern 4: Dynamic Form Creation

```javascript
const fieldTypes = ['text', 'email', 'password', 'number'];

fieldTypes.forEach(type => {
  const input = document.createElement('input');
  input.type = type;
  
  Conditions.apply(
    type,
    {
      'email': {
        placeholder: 'Enter your email',
        setAttribute: { 'pattern': '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$' }
      },
      'password': {
        placeholder: 'Enter password',
        setAttribute: { 'minlength': '8' }
      },
      'number': {
        placeholder: 'Enter number',
        setAttribute: { 'min': '0', 'max': '100' }
      },
      'default': {
        placeholder: 'Enter text'
      }
    },
    input
  );
  
  document.getElementById('form').appendChild(input);
});
```

---

## Common Beginner Questions

### Q: Why would I use `apply()` instead of just using if/else?

**Answer:** `apply()` is more declarative and maintainable.

**Traditional if/else:**
```javascript
// ❌ Imperative, repetitive, hard to maintain
const element = document.getElementById('status');

if (status === 'success') {
  element.textContent = 'Success!';
  element.style.color = 'green';
  element.classList.add('success');
  element.classList.remove('error', 'loading');
} else if (status === 'error') {
  element.textContent = 'Error!';
  element.style.color = 'red';
  element.classList.add('error');
  element.classList.remove('success', 'loading');
} else if (status === 'loading') {
  element.textContent = 'Loading...';
  element.style.color = 'blue';
  element.classList.add('loading');
  element.classList.remove('success', 'error');
}
```

**With `apply()`:**
```javascript
// ✅ Declarative, clean, maintainable
Conditions.apply(
  status,
  {
    'success': {
      textContent: 'Success!',
      style: { color: 'green' },
      classList: { add: 'success', remove: ['error', 'loading'] }
    },
    'error': {
      textContent: 'Error!',
      style: { color: 'red' },
      classList: { add: 'error', remove: ['success', 'loading'] }
    },
    'loading': {
      textContent: 'Loading...',
      style: { color: 'blue' },
      classList: { add: 'loading', remove: ['success', 'error'] }
    }
  },
  '#status'
);
```

---

### Q: Can I use `apply()` with a function?

**Answer:** Technically yes, but it will only call the function **once** to get the value. It won't watch it.

```javascript
// This calls getValue() ONCE
Conditions.apply(
  getValue(),  // Function is called immediately
  conditions,
  selector
);

// This is the same as:
const currentValue = getValue();
Conditions.apply(currentValue, conditions, selector);
```

If you want to watch a function, use `whenState()` instead:
```javascript
Conditions.whenState(
  () => getValue(),  // This is watched for changes
  conditions,
  selector
);
```

---

### Q: What happens if I `apply()` to the same element multiple times?

**Answer:** Each `apply()` overwrites previous configurations.

```javascript
// First apply
Conditions.apply('success', conditions, '#status');
// Element has success styling

// Second apply - overwrites first
Conditions.apply('error', conditions, '#status');
// Element now has error styling (success styling is gone)
```

---

### Q: Do I need to clean up `apply()`?

**Answer:** No! Since `apply()` doesn't create watchers or listeners, there's nothing to clean up.

```javascript
// No cleanup needed
Conditions.apply(value, conditions, selector);

// Compare with whenState():
const cleanup = Conditions.whenState(() => state.value, conditions, selector);
cleanup.destroy();  // Needs cleanup!
```

---

## Tips and Best Practices

### Tip 1: Always Use Default Branch

```javascript
// ✅ Good - safe fallback
Conditions.apply(value, {
  'expected1': { /* ... */ },
  'expected2': { /* ... */ },
  'default': { /* safe fallback */ }
}, selector);

// ❌ Bad - no safety net
Conditions.apply(value, {
  'expected1': { /* ... */ },
  'expected2': { /* ... */ }
  // What if value is unexpected? Element won't update!
}, selector);
```

### Tip 2: Reuse Condition Objects

```javascript
// Define once, reuse many times
const STATUS_CONDITIONS = {
  'success': { textContent: '✓ Success', style: { color: 'green' } },
  'error': { textContent: '✗ Error', style: { color: 'red' } },
  'loading': { textContent: 'Loading...', style: { color: 'blue' } }
};

// Use in different places
Conditions.apply(status1, STATUS_CONDITIONS, '#status1');
Conditions.apply(status2, STATUS_CONDITIONS, '#status2');
Conditions.apply(status3, STATUS_CONDITIONS, '#status3');
```

### Tip 3: Document Your Conditions

```javascript
/**
 * User role conditions
 * Possible values: 'admin', 'moderator', 'user', 'guest'
 */
const ROLE_CONDITIONS = {
  'admin': {
    style: { color: 'red', fontWeight: 'bold' },
    textContent: 'Administrator'
  },
  'moderator': {
    style: { color: 'orange', fontWeight: 'bold' },
    textContent: 'Moderator'
  },
  'user': {
    style: { color: 'green' },
    textContent: 'User'
  },
  'guest': {
    style: { color: 'gray' },
    textContent: 'Guest'
  }
};
```

### Tip 4: Validate Values Before Applying

```javascript
// ✅ Validate before applying
const validStatuses = ['success', 'error', 'loading', 'idle'];
const status = getStatus();

if (validStatuses.includes(status)) {
  Conditions.apply(status, conditions, '#status');
} else {
  console.warn(`Unknown status: ${status}`);
  Conditions.apply('idle', conditions, '#status');  // Safe fallback
}
```

---

## Summary

### What `apply()` Does:

1. ✅ Takes a current value (static, not watched)
2. ✅ Matches it against conditions
3. ✅ Applies the matching configuration **once**
4. ✅ Returns chainable `Conditions` object
5. ✅ No cleanup needed (no watchers created)

### When to Use It:

- One-time initialization
- URL-based configuration
- Event-driven updates
- No reactive library available
- Performance-critical code with rare updates

### The Basic Pattern:

```javascript
// Get current value
const value = getCurrentValue();

// Apply once
Conditions.apply(
  value,  // Direct value, not a function
  {
    'condition1': { /* config */ },
    'condition2': { /* config */ },
    'default': { /* fallback */ }
  },
  '#element'
);

// If value changes later, must call apply() again manually
```

### Quick Decision Guide:

- **One-time setup?** → Use `apply()`
- **Need automatic updates?** → Use `whenState()`
- **No reactive library?** → Use `apply()`
- **Working with reactive state?** → Use `whenState()`

---

**Remember:** `apply()` is perfect for static, one-time conditional rendering. It's simpler than `whenState()` when you don't need reactivity. Just call it whenever you need to update based on current values, and you're done! 🎉