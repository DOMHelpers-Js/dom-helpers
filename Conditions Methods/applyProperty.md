# Understanding `applyProperty()` - A Beginner's Guide

## What is `applyProperty()`?

`applyProperty()` is a **low-level utility method** that applies a single property to a DOM element using the registered handlers. It's used for **manual property application, testing handlers, and building custom utilities**.

Think of it as **directly using the property handling system**:
1. Takes an element
2. Takes a property key and value
3. Finds the right handler
4. Applies the property
5. Done - one property, one action!

It's like having **direct access to the property application engine** - useful for advanced scenarios and testing!

---

## Why Does `applyProperty()` Exist?

### The Problem: Need Manual Property Application

Sometimes you need fine-grained control over property application without the full condition system:

```javascript
// Want to apply just one property manually ❌
// Do I need to set up full whenState()?
// What if I'm building a custom utility?
// How do I test handlers in isolation?

// This does too much - evaluates conditions, finds matches, etc.
Conditions.whenState(
  () => 'always',
  {
    'always': {
      style: { color: 'red' }  // Just want to apply this!
    }
  },
  element
);
```

**Problems:**
- Can't apply properties without conditions
- Hard to test handlers in isolation
- Can't build custom utilities easily
- Need fine-grained control
- Overhead of condition evaluation

### The Solution: Direct Property Application

`applyProperty()` applies properties directly:

```javascript
// Apply property directly ✅
const element = document.getElementById('myElement');

Conditions.applyProperty(element, 'style', { color: 'red', fontSize: '16px' });
// Style applied directly!

Conditions.applyProperty(element, 'classList', { add: 'active' });
// Class added directly!

Conditions.applyProperty(element, 'textContent', 'Hello World');
// Text set directly!
```

**Benefits:**
- ✅ Direct property application
- ✅ Test handlers in isolation
- ✅ Build custom utilities
- ✅ Fine-grained control
- ✅ No condition evaluation overhead

---

## How Does It Work?

### The Concept

`applyProperty()` runs through the handler registry:

```
Element + Key + Value → Find Handler → Run test() → Run apply() → Done
```

**Step by Step:**

1. **Input**: Receives element, property key, and value
2. **Search**: Iterates through registered handlers
3. **Test**: For each handler, calls `handler.test(key, value, element)`
4. **Apply**: When test returns true, calls `handler.apply(element, value, key)`
5. **Done**: Property applied!

### Visual Example

```javascript
// Call applyProperty
const element = document.getElementById('test');
Conditions.applyProperty(element, 'style', { color: 'red' });

// Internal process:
// 1. Check style handler → test('style', {...}) → true! ✓
// 2. Apply: handler.apply(element, { color: 'red' }, 'style')
// 3. Inside apply: element.style.color = 'red'
// 4. Done!
```

---

## Basic Usage

### Syntax

```javascript
Conditions.applyProperty(element, key, value)
```

**Parameters:**

1. **`element`** (HTMLElement) - The DOM element to modify
   - Must be a valid DOM element
   - The target for the property application

2. **`key`** (String) - The property name
   - Property key (e.g., 'style', 'classList', 'textContent')
   - Must match a registered handler's test condition

3. **`value`** (Any) - The value to apply
   - Type depends on the handler
   - The value to set on the element

**Returns:**
- `void` (no return value)

---

## Practical Examples

### Example 1: Apply Styles

```javascript
const element = document.getElementById('myElement');

// Apply styles directly
Conditions.applyProperty(element, 'style', {
  color: 'red',
  fontSize: '16px',
  fontWeight: 'bold',
  backgroundColor: '#f0f0f0'
});

// Result: element has all these styles
```

---

### Example 2: Manage Classes

```javascript
const button = document.getElementById('myButton');

// Add classes
Conditions.applyProperty(button, 'classList', {
  add: ['btn', 'btn-primary', 'active']
});

// Remove classes
Conditions.applyProperty(button, 'classList', {
  remove: ['btn-secondary', 'inactive']
});

// Toggle class
Conditions.applyProperty(button, 'classList', {
  toggle: 'loading'
});

// Replace all classes
Conditions.applyProperty(button, 'classList', [
  'btn', 'btn-success', 'large'
]);
```

---

### Example 3: Set Attributes

```javascript
const input = document.getElementById('myInput');

// Set attributes
Conditions.applyProperty(input, 'setAttribute', {
  placeholder: 'Enter your name',
  maxlength: '50',
  'data-validated': 'true'
});

// Set data attributes
Conditions.applyProperty(input, 'dataset', {
  userId: '12345',
  role: 'admin',
  status: 'active'
});
```

---

### Example 4: Update Content

```javascript
const div = document.getElementById('content');

// Set text content
Conditions.applyProperty(div, 'textContent', 'Hello, World!');

// Set HTML content
Conditions.applyProperty(div, 'innerHTML', `
  <h2>Title</h2>
  <p>Paragraph content</p>
`);
```

---

### Example 5: Add Event Listeners

```javascript
const button = document.getElementById('actionButton');

// Add event listener
Conditions.applyProperty(button, 'addEventListener', {
  type: 'click',
  handler: () => {
    console.log('Button clicked!');
  }
});
```

---

### Example 6: Testing Custom Handlers

```javascript
// Register custom handler
Conditions.registerHandler('animate', {
  test: (key) => key === 'animate',
  apply: (element, config) => {
    element.animate(config.keyframes, config.options);
  }
});

// Test it directly
const element = document.getElementById('test');

Conditions.applyProperty(element, 'animate', {
  keyframes: [
    { opacity: 0, transform: 'translateY(-20px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ],
  options: {
    duration: 300,
    easing: 'ease-out'
  }
});

// Animation starts! Handler works! ✓
```

---

### Example 7: Building Custom Utilities

```javascript
// Build a utility using applyProperty
class ElementStyler {
  constructor(element) {
    this.element = element;
  }
  
  setStyle(styleObject) {
    Conditions.applyProperty(this.element, 'style', styleObject);
    return this;  // Chainable
  }
  
  addClass(...classes) {
    Conditions.applyProperty(this.element, 'classList', {
      add: classes
    });
    return this;
  }
  
  setText(text) {
    Conditions.applyProperty(this.element, 'textContent', text);
    return this;
  }
  
  setData(dataObject) {
    Conditions.applyProperty(this.element, 'dataset', dataObject);
    return this;
  }
}

// Use it
const styler = new ElementStyler(document.getElementById('myDiv'));

styler
  .setStyle({ color: 'blue', fontSize: '18px' })
  .addClass('highlight', 'active')
  .setText('Styled Element')
  .setData({ id: '123', type: 'featured' });
```

---

### Example 8: Programmatic Updates

```javascript
// Apply multiple properties programmatically
function applyConfiguration(element, config) {
  Object.entries(config).forEach(([key, value]) => {
    try {
      Conditions.applyProperty(element, key, value);
    } catch (error) {
      console.warn(`Failed to apply ${key}:`, error);
    }
  });
}

// Use it
const config = {
  style: { color: 'green', padding: '10px' },
  classList: { add: 'configured' },
  textContent: 'Configured Element',
  dataset: { configured: 'true' }
};

applyConfiguration(document.getElementById('target'), config);
```

---

## Advanced Use Cases

### Use Case 1: Animation System

```javascript
// Build animation system using applyProperty
class Animator {
  static fadeIn(element, duration = 300) {
    Conditions.applyProperty(element, 'animate', {
      keyframes: [
        { opacity: 0 },
        { opacity: 1 }
      ],
      options: { duration, easing: 'ease-out' }
    });
  }
  
  static fadeOut(element, duration = 300) {
    Conditions.applyProperty(element, 'animate', {
      keyframes: [
        { opacity: 1 },
        { opacity: 0 }
      ],
      options: { duration, easing: 'ease-in' }
    });
  }
  
  static slideIn(element, direction = 'top', duration = 300) {
    const transforms = {
      top: ['translateY(-20px)', 'translateY(0)'],
      bottom: ['translateY(20px)', 'translateY(0)'],
      left: ['translateX(-20px)', 'translateX(0)'],
      right: ['translateX(20px)', 'translateX(0)']
    };
    
    const [from, to] = transforms[direction];
    
    Conditions.applyProperty(element, 'animate', {
      keyframes: [
        { opacity: 0, transform: from },
        { opacity: 1, transform: to }
      ],
      options: { duration, easing: 'ease-out' }
    });
  }
}

// Use it
Animator.fadeIn(document.getElementById('modal'));
Animator.slideIn(document.getElementById('notification'), 'right');
```

---

### Use Case 2: Theme Manager

```javascript
// Theme manager using applyProperty
class ThemeManager {
  static themes = {
    light: {
      style: {
        backgroundColor: '#ffffff',
        color: '#000000'
      },
      dataset: { theme: 'light' }
    },
    dark: {
      style: {
        backgroundColor: '#1a1a1a',
        color: '#ffffff'
      },
      dataset: { theme: 'dark' }
    },
    blue: {
      style: {
        backgroundColor: '#1976D2',
        color: '#ffffff'
      },
      dataset: { theme: 'blue' }
    }
  };
  
  static applyTheme(element, themeName) {
    const theme = this.themes[themeName];
    
    if (!theme) {
      console.warn(`Unknown theme: ${themeName}`);
      return;
    }
    
    Object.entries(theme).forEach(([key, value]) => {
      Conditions.applyProperty(element, key, value);
    });
  }
}

// Use it
ThemeManager.applyTheme(document.body, 'dark');
```

---

### Use Case 3: Form Field Validator

```javascript
// Visual validation using applyProperty
class FieldValidator {
  static markValid(field) {
    Conditions.applyProperty(field, 'classList', {
      add: 'valid',
      remove: ['invalid', 'neutral']
    });
    
    Conditions.applyProperty(field, 'style', {
      borderColor: 'green'
    });
    
    Conditions.applyProperty(field, 'dataset', {
      valid: 'true'
    });
  }
  
  static markInvalid(field, message) {
    Conditions.applyProperty(field, 'classList', {
      add: 'invalid',
      remove: ['valid', 'neutral']
    });
    
    Conditions.applyProperty(field, 'style', {
      borderColor: 'red'
    });
    
    Conditions.applyProperty(field, 'dataset', {
      valid: 'false',
      error: message
    });
  }
  
  static reset(field) {
    Conditions.applyProperty(field, 'classList', {
      add: 'neutral',
      remove: ['valid', 'invalid']
    });
    
    Conditions.applyProperty(field, 'style', {
      borderColor: '#ccc'
    });
    
    Conditions.applyProperty(field, 'dataset', {
      valid: '',
      error: ''
    });
  }
}

// Use it
const emailField = document.getElementById('email');

FieldValidator.reset(emailField);
// User types...
if (isValidEmail(emailField.value)) {
  FieldValidator.markValid(emailField);
} else {
  FieldValidator.markInvalid(emailField, 'Invalid email format');
}
```

---

## Testing with `applyProperty()`

### Unit Testing Handlers

```javascript
describe('Custom Handlers', () => {
  describe('animate handler', () => {
    it('should apply animation', () => {
      const element = document.createElement('div');
      
      // Spy on animate method
      const animateSpy = jest.spyOn(element, 'animate');
      
      // Apply property
      Conditions.applyProperty(element, 'animate', {
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
        options: { duration: 300 }
      });
      
      // Assert
      expect(animateSpy).toHaveBeenCalledWith(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 300 }
      );
    });
  });
  
  describe('tooltip handler', () => {
    it('should create tooltip', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      
      // Apply property
      Conditions.applyProperty(element, 'tooltip', {
        text: 'Test tooltip',
        position: 'top'
      });
      
      // Assert
      const tooltip = element.querySelector('.custom-tooltip');
      expect(tooltip).not.toBeNull();
      expect(tooltip.textContent).toBe('Test tooltip');
      
      document.body.removeChild(element);
    });
  });
});
```

---

## Common Beginner Questions

### Q: When should I use `applyProperty()` vs `whenState()`?

**Answer:**

- **`applyProperty()`**: Manual, one-time, low-level control
- **`whenState()`**: Automatic, reactive, high-level declarative

```javascript
// applyProperty - manual application
Conditions.applyProperty(element, 'style', { color: 'red' });

// whenState - automatic with conditions
Conditions.whenState(
  () => state.active,
  {
    'true': { style: { color: 'red' } }
  },
  element
);
```

---

### Q: Can I use `applyProperty()` with custom handlers?

**Answer:** Yes! It works with all registered handlers (built-in and custom).

```javascript
// Register custom handler
Conditions.registerHandler('myHandler', handlerDef);

// Use it with applyProperty
Conditions.applyProperty(element, 'myHandler', value);
```

---

### Q: What if no handler matches the property?

**Answer:** The `directProperty` handler acts as a fallback, setting properties directly.

```javascript
// No specific handler for 'value'
// Falls back to direct property assignment
Conditions.applyProperty(input, 'value', 'Hello');
// Same as: input.value = 'Hello'
```

---

### Q: Is it safe to use in production?

**Answer:** Yes, but prefer higher-level methods (`whenState()`, `apply()`) for most cases.

```javascript
// ✅ Good for: Custom utilities, testing, special cases
Conditions.applyProperty(element, 'style', styles);

// ✅ Better for: Normal application logic
Conditions.whenState(
  () => state.value,
  conditions,
  selector
);
```

---

## Tips and Best Practices

### Tip 1: Use for Testing

```javascript
// ✅ Good - test handlers in isolation
function testAnimateHandler() {
  const element = document.createElement('div');
  
  Conditions.applyProperty(element, 'animate', {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    options: { duration: 300 }
  });
  
  // Verify animation was applied
  console.log('Handler test passed');
}
```

### Tip 2: Build Utilities

```javascript
// ✅ Good - build reusable utilities
function setElementState(element, state) {
  const stateMap = {
    loading: {
      style: { opacity: '0.5' },
      classList: { add: 'loading' },
      disabled: true
    },
    success: {
      style: { opacity: '1' },
      classList: { add: 'success', remove: 'loading' },
      disabled: false
    },
    error: {
      style: { opacity: '1' },
      classList: { add: 'error', remove: 'loading' },
      disabled: false
    }
  };
  
  const config = stateMap[state];
  Object.entries(config).forEach(([key, value]) => {
    Conditions.applyProperty(element, key, value);
  });
}
```

### Tip 3: Error Handling

```javascript
// ✅ Good - handle errors gracefully
function safeApplyProperty(element, key, value) {
  try {
    Conditions.applyProperty(element, key, value);
    return true;
  } catch (error) {
    console.warn(`Failed to apply ${key}:`, error);
    return false;
  }
}
```

### Tip 4: Prefer High-Level Methods

```javascript
// ❌ Overkill for simple cases
Conditions.applyProperty(element, 'style', { color: 'red' });

// ✅ Better - use whenState for reactive updates
Conditions.whenState(
  () => state.color,
  {
    'red': { style: { color: 'red' } },
    'blue': { style: { color: 'blue' } }
  },
  element
);

// ✅ Or apply for static updates
Conditions.apply('red', conditions, element);
```

---

## Summary

### What `applyProperty()` Does:

1. ✅ Applies a single property to an element
2. ✅ Uses registered handlers
3. ✅ Low-level, manual control
4. ✅ No condition evaluation
5. ✅ Useful for testing and utilities

### When to Use It:

- Testing handlers in isolation
- Building custom utilities
- Need fine-grained control
- One-off property applications
- Advanced scenarios

### The Basic Pattern:

```javascript
// Get element
const element = document.getElementById('myElement');

// Apply property directly
Conditions.applyProperty(element, 'style', {
  color: 'red',
  fontSize: '16px'
});

// Apply another property
Conditions.applyProperty(element, 'classList', {
  add: 'active'
});

// Done!
```

### Quick Decision Guide:

- **Testing handlers?** → Use `applyProperty()`
- **Building utilities?** → Use `applyProperty()`
- **Normal app logic?** → Use `whenState()` or `apply()`
- **Need reactivity?** → Use `whenState()`, not `applyProperty()`

---

**Remember:** `applyProperty()` is your low-level tool for direct property application. It's powerful but use higher-level methods (`whenState()`, `apply()`) for most application logic! 🔧