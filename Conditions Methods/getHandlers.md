# Understanding `getHandlers()` - A Beginner's Guide

## What is `getHandlers()`?

`getHandlers()` is a **utility method** that returns a list of all registered property handlers in the system. It's used for **inspection, debugging, and discovery** of available handlers.

Think of it as **checking your toolkit** to see what actions you can perform:
1. Shows all built-in handlers
2. Shows all custom handlers you've registered
3. Helps with debugging property application issues
4. Useful for documentation generation

It's like asking **"What properties can I configure?"** - it tells you everything available!

---

## Why Does `getHandlers()` Exist?

### The Problem: Unknown Available Handlers

As you build your application and register custom handlers, it becomes hard to remember what's available:

```javascript
// What handlers do I have? ❌
// Can I use 'animate'? Did I register it?
// What built-in handlers are there?
// Which custom handlers did my teammate add?

Conditions.whenState(
  () => state.visible,
  {
    'true': {
      animate: { /* ... */ }  // Is this handler available?
    }
  },
  selector
);
```

**Problems:**
- Don't remember what handlers are registered
- Can't verify if a handler exists
- Difficult to debug property application issues
- Hard to generate documentation
- Can't discover available handlers programmatically

### The Solution: Inspect Registered Handlers

`getHandlers()` gives you a complete list:

```javascript
// What handlers are available? ✅
const handlers = Conditions.getHandlers();
console.log(handlers);
// [
//   'style', 'classList', 'setAttribute', 'attrs',
//   'removeAttribute', 'dataset', 'addEventListener',
//   'removeEventListener', 'textContent', 'innerHTML',
//   'directProperty', 'methodCall',
//   'animate', 'tooltip', 'scrollTo'  // Your custom handlers
// ]

// Now you know what's available!
```

**Benefits:**
- ✅ See all available handlers
- ✅ Verify handler exists before using
- ✅ Debug property application
- ✅ Generate documentation
- ✅ Discover capabilities

---

## How Does It Work?

### The Concept

`getHandlers()` simply returns the **keys** from the internal handler registry:

```
Internal Registry → Extract Keys → Return Array
```

**Step by Step:**

1. **Access**: Reads the internal `propertyHandlers` object
2. **Extract**: Gets all the keys (handler names)
3. **Return**: Returns them as an array of strings
4. **Done**: You have the complete list!

### Visual Example

```javascript
// Internal structure (simplified):
const propertyHandlers = {
  'style': { test: ..., apply: ... },
  'animate': { test: ..., apply: ... },
  'tooltip': { test: ..., apply: ... }
};

// getHandlers() returns:
['style', 'animate', 'tooltip']
```

---

## Basic Usage

### Syntax

```javascript
Conditions.getHandlers()
```

**Parameters:**
- None

**Returns:**
- `Array<string>` - Array of handler names

---

## Practical Examples

### Example 1: List All Available Handlers

```javascript
// Get all handlers
const handlers = Conditions.getHandlers();

console.log('Available Handlers:');
handlers.forEach(handler => {
  console.log(`  - ${handler}`);
});

// Output:
// Available Handlers:
//   - style
//   - classList
//   - setAttribute
//   - attrs
//   - removeAttribute
//   - dataset
//   - addEventListener
//   - removeEventListener
//   - textContent
//   - innerHTML
//   - directProperty
//   - methodCall
//   - animate (custom)
//   - tooltip (custom)
//   - scrollTo (custom)
```

---

### Example 2: Check if Handler Exists

```javascript
// Helper function
function hasHandler(name) {
  return Conditions.getHandlers().includes(name);
}

// Check before using
if (hasHandler('animate')) {
  Conditions.whenState(
    () => state.visible,
    {
      'true': {
        animate: {
          keyframes: [{ opacity: 0 }, { opacity: 1 }],
          options: { duration: 300 }
        }
      }
    },
    selector
  );
} else {
  console.warn('animate handler not available - please register it');
  // Fallback to CSS classes or style
  Conditions.whenState(
    () => state.visible,
    {
      'true': { classList: { add: 'fade-in' } }
    },
    selector
  );
}
```

---

### Example 3: Debugging Property Application

```javascript
// When a property doesn't apply as expected
const config = {
  animate: { /* ... */ },
  customProp: 'value'
};

// Check which handlers exist
const handlers = Conditions.getHandlers();

Object.keys(config).forEach(key => {
  // Check if there's a handler for this property
  const hasHandler = handlers.some(h => {
    // Note: handlers use test() to determine if they handle a property
    // This is a simplified check
    return h === key || key.includes(h);
  });
  
  if (!hasHandler) {
    console.warn(`No handler found for property: ${key}`);
    console.log('Available handlers:', handlers);
  }
});
```

---

### Example 4: Generate Documentation

```javascript
// Auto-generate documentation for available handlers
function generateHandlerDocs() {
  const handlers = Conditions.getHandlers();
  
  console.log('# Available Property Handlers\n');
  
  // Group handlers by type
  const builtIn = [];
  const custom = [];
  
  const builtInNames = [
    'style', 'classList', 'setAttribute', 'attrs',
    'removeAttribute', 'dataset', 'addEventListener',
    'removeEventListener', 'textContent', 'innerHTML',
    'directProperty', 'methodCall'
  ];
  
  handlers.forEach(handler => {
    if (builtInNames.includes(handler)) {
      builtIn.push(handler);
    } else {
      custom.push(handler);
    }
  });
  
  console.log(`## Built-in Handlers (${builtIn.length})`);
  builtIn.forEach(h => console.log(`- \`${h}\``));
  
  console.log(`\n## Custom Handlers (${custom.length})`);
  custom.forEach(h => console.log(`- \`${h}\``));
  
  console.log(`\n**Total: ${handlers.length} handlers available**`);
}

generateHandlerDocs();
```

**Output:**
```
# Available Property Handlers

## Built-in Handlers (12)
- `style`
- `classList`
- `setAttribute`
- ...

## Custom Handlers (3)
- `animate`
- `tooltip`
- `scrollTo`

**Total: 15 handlers available**
```

---

### Example 5: Conditional Feature Loading

```javascript
// Check what handlers are available and adapt features
function initializeAnimations() {
  const handlers = Conditions.getHandlers();
  
  if (handlers.includes('animate')) {
    // Use Web Animations API handler
    console.log('✓ Using animate handler');
    return {
      fadeIn: (element) => ({
        animate: {
          keyframes: [{ opacity: 0 }, { opacity: 1 }],
          options: { duration: 300 }
        }
      })
    };
  } else {
    // Fallback to CSS classes
    console.log('ℹ Using CSS class fallback');
    return {
      fadeIn: (element) => ({
        classList: { add: 'fade-in' }
      })
    };
  }
}

const animations = initializeAnimations();

// Use animations (works regardless of handler availability)
Conditions.whenState(
  () => state.visible,
  {
    'true': animations.fadeIn()
  },
  '#element'
);
```

---

### Example 6: Development Helpers

```javascript
// Development mode: Show available handlers on page load
if (process.env.NODE_ENV === 'development') {
  console.group('🔧 Conditions System Debug Info');
  
  const handlers = Conditions.getHandlers();
  console.log(`Total handlers: ${handlers.length}`);
  console.log('Available handlers:', handlers);
  
  // Show which are custom
  const builtInHandlers = [
    'style', 'classList', 'setAttribute', 'attrs',
    'removeAttribute', 'dataset', 'addEventListener',
    'removeEventListener', 'textContent', 'innerHTML',
    'directProperty', 'methodCall'
  ];
  
  const customHandlers = handlers.filter(h => !builtInHandlers.includes(h));
  
  if (customHandlers.length > 0) {
    console.log('Custom handlers:', customHandlers);
  }
  
  console.groupEnd();
}
```

---

### Example 7: Testing Framework Integration

```javascript
// Test helper: Verify expected handlers are available
function assertHandlersAvailable(expected) {
  const available = Conditions.getHandlers();
  const missing = expected.filter(h => !available.includes(h));
  
  if (missing.length > 0) {
    throw new Error(
      `Missing handlers: ${missing.join(', ')}\n` +
      `Available: ${available.join(', ')}`
    );
  }
  
  console.log('✓ All expected handlers available');
  return true;
}

// In tests
describe('Conditions System', () => {
  it('should have all required handlers', () => {
    assertHandlersAvailable([
      'style', 'classList',
      'animate', 'tooltip', 'scrollTo'
    ]);
  });
});
```

---

## Common Use Cases

### Use Case 1: Plugin System

```javascript
// Check if a plugin's required handlers are available
class AnimationPlugin {
  constructor(requiredHandlers = []) {
    this.requiredHandlers = requiredHandlers;
  }
  
  canActivate() {
    const available = Conditions.getHandlers();
    return this.requiredHandlers.every(h => available.includes(h));
  }
  
  activate() {
    if (!this.canActivate()) {
      const missing = this.requiredHandlers.filter(
        h => !Conditions.getHandlers().includes(h)
      );
      throw new Error(`Cannot activate plugin. Missing handlers: ${missing}`);
    }
    
    // Activate plugin
    console.log('✓ Animation plugin activated');
  }
}

// Usage
const animPlugin = new AnimationPlugin(['animate', 'transition']);
if (animPlugin.canActivate()) {
  animPlugin.activate();
} else {
  console.log('Animation plugin requires additional handlers');
}
```

---

### Use Case 2: Interactive Documentation

```javascript
// Create interactive handler explorer
function createHandlerExplorer() {
  const container = document.getElementById('handler-explorer');
  const handlers = Conditions.getHandlers();
  
  container.innerHTML = `
    <h3>Available Handlers (${handlers.length})</h3>
    <ul>
      ${handlers.map(h => `
        <li>
          <code>${h}</code>
          <button onclick="showHandlerExample('${h}')">Example</button>
        </li>
      `).join('')}
    </ul>
  `;
}

function showHandlerExample(handlerName) {
  const examples = {
    'style': '{ style: { color: "red", fontSize: "16px" } }',
    'classList': '{ classList: { add: "active" } }',
    'animate': '{ animate: { keyframes: [...], options: {...} } }',
    // Add more examples...
  };
  
  const example = examples[handlerName] || 'No example available';
  alert(`Example for "${handlerName}":\n\n${example}`);
}

// Run on page load
createHandlerExplorer();
```

---

### Use Case 3: Feature Detection

```javascript
// Determine which features to enable based on available handlers
function getAvailableFeatures() {
  const handlers = Conditions.getHandlers();
  const features = {};
  
  // Animations
  features.animations = handlers.includes('animate');
  
  // Tooltips
  features.tooltips = handlers.includes('tooltip');
  
  // Advanced scrolling
  features.smoothScroll = handlers.includes('scrollTo');
  
  // Custom data visualization
  features.charts = handlers.includes('chart');
  
  return features;
}

const features = getAvailableFeatures();

// Enable/disable UI based on available features
if (features.animations) {
  document.getElementById('animation-settings').style.display = 'block';
}

if (features.tooltips) {
  document.getElementById('help-button').style.display = 'inline-block';
}
```

---

## Comparison with Related Methods

### `getHandlers()` vs `getMatchers()`

```javascript
// getHandlers() - Property handlers
const handlers = Conditions.getHandlers();
// ['style', 'classList', 'animate', ...]
// Used in: configuration objects (what to apply)

// getMatchers() - Condition matchers
const matchers = Conditions.getMatchers();
// ['booleanTrue', 'weekday', 'even', ...]
// Used in: condition strings (when to apply)
```

### `getHandlers()` vs `hasHandler()`

```javascript
// getHandlers() - Get all handler names
const all = Conditions.getHandlers();
// ['style', 'classList', 'animate', ...]

// hasHandler() - Check if specific handler exists (helper)
const exists = hasHandler('animate');
// true or false

// hasHandler() is just a helper:
function hasHandler(name) {
  return Conditions.getHandlers().includes(name);
}
```

---

## Common Beginner Questions

### Q: When should I use `getHandlers()`?

**Answer:** Use it for inspection, debugging, and discovery.

**Use when:**
- ✅ Debugging why properties don't apply
- ✅ Checking if a handler is registered
- ✅ Generating documentation
- ✅ Building development tools
- ✅ Feature detection

**Don't use when:**
- ❌ In production hot paths (cache the result)
- ❌ Every time you check a handler (use helper)

---

### Q: Does it show built-in and custom handlers?

**Answer:** Yes! It shows **everything** registered.

```javascript
const all = Conditions.getHandlers();
// Includes:
// - Built-in handlers (style, classList, etc.)
// - Custom handlers (animate, tooltip, etc.)
// - All registered handlers
```

---

### Q: Can I modify the returned array?

**Answer:** Modifying the array won't affect registered handlers.

```javascript
const handlers = Conditions.getHandlers();
handlers.push('fake');  // Doesn't actually register a handler!

// To register, use:
Conditions.registerHandler('real', handlerDef);
```

---

### Q: Is this expensive to call?

**Answer:** No, it's just returning object keys. But you can cache it.

```javascript
// ✅ Fine to call multiple times
const handlers1 = Conditions.getHandlers();
const handlers2 = Conditions.getHandlers();

// ✅ Or cache if you prefer
const AVAILABLE_HANDLERS = Conditions.getHandlers();
// Use AVAILABLE_HANDLERS throughout your code
```

---

## Tips and Best Practices

### Tip 1: Cache in Development Tools

```javascript
// ✅ Good - cache for dev tools
class ConditionsDevTools {
  constructor() {
    this.matchers = Conditions.getMatchers();
    this.handlers = Conditions.getHandlers();
  }
  
  refresh() {
    this.matchers = Conditions.getMatchers();
    this.handlers = Conditions.getHandlers();
  }
  
  showInfo() {
    console.log('Matchers:', this.matchers);
    console.log('Handlers:', this.handlers);
  }
}
```

### Tip 2: Create Helper Functions

```javascript
// ✅ Good - reusable helpers
function hasHandler(name) {
  return Conditions.getHandlers().includes(name);
}

function getCustomHandlers() {
  const builtIn = ['style', 'classList', /* ... */];
  return Conditions.getHandlers().filter(h => !builtIn.includes(h));
}

function getHandlerCount() {
  return Conditions.getHandlers().length;
}
```

### Tip 3: Use in Assertions

```javascript
// ✅ Good - validate before using
function useAnimateHandler() {
  console.assert(
    hasHandler('animate'),
    'animate handler must be registered'
  );
  
  // Safe to use
  Conditions.whenState(/* ... */);
}
```

### Tip 4: Document Your Extensions

```javascript
// ✅ Good - document what you've added
/**
 * Custom Handlers Registered:
 * - animate: Web Animations API integration
 * - tooltip: Dynamic tooltip management
 * - scrollTo: Smooth scrolling behavior
 * - chart: Chart.js integration
 * 
 * Verify with: Conditions.getHandlers()
 */
```

---

## Summary

### What `getHandlers()` Does:

1. ✅ Returns array of all registered handler names
2. ✅ Includes built-in handlers
3. ✅ Includes custom handlers
4. ✅ Useful for inspection and debugging
5. ✅ No parameters needed

### When to Use It:

- Debugging property application issues
- Checking if a handler is available
- Generating documentation
- Building development tools
- Feature detection
- Testing and assertions

### The Basic Pattern:

```javascript
// Get all handlers
const handlers = Conditions.getHandlers();

// Check if specific handler exists
if (handlers.includes('animate')) {
  // Use it
  Conditions.whenState(
    () => state.visible,
    {
      'true': {
        animate: { /* ... */ }
      }
    },
    selector
  );
}

// Or iterate
handlers.forEach(handler => {
  console.log(`Available: ${handler}`);
});
```

### Quick Decision Guide:

- **Need to check if handler exists?** → Use `getHandlers().includes(name)`
- **Debugging properties?** → Use `getHandlers()` to see what's available
- **Building dev tools?** → Use `getHandlers()` to list capabilities
- **Want to register handler?** → Use `registerHandler()`, not `getHandlers()`

---

**Remember:** `getHandlers()` is your inspection tool for discovering what property handlers are available. Use it for debugging, validation, and building development tools! 🔧