# Understanding `registerHandler()` - A Beginner's Guide

## What is `registerHandler()`?

`registerHandler()` is a method for **creating custom property handlers** that extend how the Conditions system applies configurations to DOM elements. It lets you define new ways to manipulate elements beyond the built-in handlers (style, classList, attributes, etc.).

Think of it as **adding new actions** the system can perform:
1. You define what properties to handle (test)
2. You define how to apply them to elements (apply)
3. The system uses it automatically in all conditions

It's like teaching the system **new tricks** for updating the DOM - expanding what it can do!

---

## Why Does `registerHandler()` Exist?

### The Problem: Built-In Handlers Don't Cover Everything

The Conditions system comes with many handlers (style, classList, setAttribute, addEventListener), but sometimes you need **custom DOM manipulation**:

```javascript
// Want to animate elements? ❌ No built-in handler
Conditions.whenState(
  () => state.visible,
  {
    'true': {
      // How to trigger animation?
      /* ??? */
    }
  },
  '#element'
);

// Want to use Web Animations API? ❌ No built-in handler
Conditions.whenState(
  () => state.status,
  {
    'loading': {
      // How to start keyframe animation?
      /* ??? */
    }
  },
  '#status'
);

// Want custom component methods? ❌ No built-in handler
Conditions.whenState(
  () => state.mode,
  {
    'expanded': {
      // How to call custom expand() method?
      /* ??? */
    }
  },
  '#accordion'
);
```

**Problems:**
- Need to use addEventListener with manual cleanup
- Can't use modern APIs declaratively
- Repetitive boilerplate code
- Not reusable across conditions
- Verbose and error-prone

### The Solution: Create Custom Handlers

`registerHandler()` lets you add new property types:

```javascript
// Register animate handler ONCE
Conditions.registerHandler('animate', {
  test: (key) => key === 'animate',
  apply: (element, animation) => {
    element.animate(animation.keyframes, animation.options);
  }
});

// Now use it EVERYWHERE!
Conditions.whenState(
  () => state.visible,
  {
    'true': {
      animate: {
        keyframes: [
          { opacity: 0, transform: 'translateY(-20px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        options: { duration: 300, easing: 'ease-out' }
      }
    },
    'false': {
      animate: {
        keyframes: [
          { opacity: 1 },
          { opacity: 0 }
        ],
        options: { duration: 200 }
      }
    }
  },
  '#element'
);
```

**Benefits:**
- ✅ Define once, use everywhere
- ✅ Clean, declarative DOM manipulation
- ✅ Reusable across your application
- ✅ Integrates with modern APIs
- ✅ Easy to test and maintain

---

## How Does It Work?

### The Concept

A handler has **two functions**:

```
Property Key + Value → test() → Should this handler process it?
                       ↓
                      YES
                       ↓
Element + Value → apply() → Manipulate the element
                   ↓
                 Done!
```

**Step by Step:**

1. **test(key, value, element?)**: "Is this property something I can handle?"
   - Returns `true` if this handler should process the property
   - Returns `false` to let other handlers try

2. **apply(element, value, key)**: "Apply this value to the element"
   - Receives the DOM element to manipulate
   - Receives the value to apply
   - Performs the DOM manipulation

### Visual Example

```javascript
// Register a scroll handler
Conditions.registerHandler('scrollTo', {
  // test: Should I handle this property?
  test: (key) => key === 'scrollTo',
  
  // apply: How to handle it
  apply: (element, value) => {
    element.scrollIntoView({ 
      behavior: value.smooth ? 'smooth' : 'auto',
      block: value.position || 'center'
    });
  }
});

// When you use it:
Conditions.whenState(
  () => state.active,
  {
    'true': {
      scrollTo: { smooth: true, position: 'center' }
    }
  },
  '#target'
);

// How it's evaluated:
state.active = true
→ test('scrollTo', {...}) → true (this handler handles 'scrollTo')
→ apply(element, {smooth: true, position: 'center'}, 'scrollTo')
→ element.scrollIntoView(...) executed!
```

---

## Basic Usage

### Syntax

```javascript
Conditions.registerHandler(name, handler)
```

**Parameters:**

1. **`name`** (String) - Unique identifier for this handler
   - Used for internal tracking
   - Should be descriptive (e.g., 'animate', 'scrollTo', 'tooltip')

2. **`handler`** (Object) - Handler definition
   - `test(key, value, element?)` - Function returning boolean
     - Receives the property key
     - Receives the property value
     - Optional: receives the target element
     - Returns `true` if this handler should process the property
   
   - `apply(element, value, key)` - Function that manipulates element
     - Receives the DOM element to modify
     - Receives the value to apply
     - Receives the property key
     - Performs the DOM manipulation

**Returns:**
- `Conditions` object (chainable)

---

## Practical Examples

### Example 1: Web Animations API Handler

**The Problem:**
```javascript
// Without custom handler - verbose ❌
Conditions.whenState(
  () => state.visible,
  {
    'true': {
      addEventListener: {
        type: 'transitionend',
        handler: () => {
          element.animate([...], {...});
        },
        once: true
      }
      // Complex and manual!
    }
  },
  '#element'
);
```

**The Solution:**
```javascript
// Register animate handler
Conditions.registerHandler('animate', {
  test: (key) => key === 'animate',
  apply: (element, config) => {
    if (config && config.keyframes && config.options) {
      element.animate(config.keyframes, config.options);
    }
  }
});

// Now use it cleanly! ✅
const state = Reactive.state({ status: 'idle' });

Conditions.whenState(
  () => state.status,
  {
    'loading': {
      animate: {
        keyframes: [
          { transform: 'rotate(0deg)' },
          { transform: 'rotate(360deg)' }
        ],
        options: {
          duration: 1000,
          iterations: Infinity,
          easing: 'linear'
        }
      }
    },
    'success': {
      animate: {
        keyframes: [
          { opacity: 0, transform: 'scale(0.8)' },
          { opacity: 1, transform: 'scale(1.1)' },
          { opacity: 1, transform: 'scale(1)' }
        ],
        options: {
          duration: 300,
          easing: 'ease-out'
        }
      }
    }
  },
  '#status-icon'
);

// Test it
state.status = 'loading';  // Starts spinning animation
state.status = 'success';  // Bounce animation
```

**What happens:**
1. Handler registered once at startup
2. When `status` is 'loading':
   - `test('animate', {...})` → `true`
   - `apply(element, config)` → Starts infinite rotation
3. When `status` is 'success':
   - Handler applies bounce animation
4. Clean, declarative animations!

---

### Example 2: Tooltip Handler

**JavaScript:**
```javascript
// Register tooltip handler
Conditions.registerHandler('tooltip', {
  test: (key) => key === 'tooltip',
  apply: (element, config) => {
    // Create or update tooltip
    let tooltip = element.querySelector('.custom-tooltip');
    
    if (!tooltip && config) {
      tooltip = document.createElement('div');
      tooltip.className = 'custom-tooltip';
      element.style.position = 'relative';
      element.appendChild(tooltip);
    }
    
    if (tooltip) {
      if (config === false || config === null) {
        // Remove tooltip
        tooltip.remove();
      } else if (typeof config === 'string') {
        // Simple string tooltip
        tooltip.textContent = config;
        tooltip.style.display = 'block';
      } else if (typeof config === 'object') {
        // Configured tooltip
        tooltip.textContent = config.text || '';
        tooltip.style.display = 'block';
        tooltip.style.backgroundColor = config.bgColor || '#333';
        tooltip.style.color = config.color || 'white';
        tooltip.style.padding = config.padding || '5px 10px';
        
        if (config.position === 'top') {
          tooltip.style.bottom = '100%';
          tooltip.style.top = 'auto';
        } else if (config.position === 'bottom') {
          tooltip.style.top = '100%';
          tooltip.style.bottom = 'auto';
        }
      }
    }
  }
});

// Use in application
const app = Reactive.state({ 
  helpMode: false,
  userLevel: 'beginner'
});

Conditions.whenState(
  () => app.helpMode,
  {
    'true': {
      tooltip: {
        text: 'Click here to save your work',
        position: 'top',
        bgColor: '#2196F3',
        color: 'white'
      }
    },
    'false': {
      tooltip: null  // Remove tooltip
    }
  },
  '#save-button'
);

// Toggle help mode
document.getElementById('help-toggle').onclick = () => {
  app.helpMode = !app.helpMode;
};
```

**What happens:**
1. Tooltip handler creates/updates/removes tooltips
2. When help mode is on, tooltips appear
3. When help mode is off, tooltips are removed
4. Fully declarative - no manual DOM manipulation!

---

### Example 3: Scroll Into View Handler

**JavaScript:**
```javascript
// Register scrollTo handler
Conditions.registerHandler('scrollTo', {
  test: (key) => key === 'scrollTo',
  apply: (element, config) => {
    if (config === true) {
      // Simple scroll with defaults
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (typeof config === 'object') {
      // Configured scroll
      element.scrollIntoView({
        behavior: config.smooth ? 'smooth' : 'auto',
        block: config.block || 'center',
        inline: config.inline || 'nearest'
      });
    }
  }
});

// Use in wizard steps
const wizard = Reactive.state({ currentStep: 1 });

for (let step = 1; step <= 5; step++) {
  Conditions.whenState(
    () => wizard.currentStep,
    {
      [step]: {
        classList: { add: 'active-step' },
        scrollTo: { smooth: true, block: 'center' }
      },
      'default': {
        classList: { remove: 'active-step' }
      }
    },
    `#step-${step}`
  );
}

// Navigation
document.getElementById('next-btn').onclick = () => {
  if (wizard.currentStep < 5) {
    wizard.currentStep++;
    // Active step automatically scrolls into view!
  }
};
```

---

### Example 4: Custom Component Methods Handler

**JavaScript:**
```javascript
// Register method call handler
Conditions.registerHandler('callMethod', {
  test: (key) => key === 'callMethod',
  apply: (element, config) => {
    if (typeof config === 'string') {
      // Simple method name
      if (typeof element[config] === 'function') {
        element[config]();
      }
    } else if (typeof config === 'object') {
      // Method with arguments
      const { method, args = [] } = config;
      if (typeof element[method] === 'function') {
        element[method](...args);
      }
    }
  }
});

// Use with custom elements/components
class AccordionElement extends HTMLElement {
  expand() {
    this.setAttribute('expanded', 'true');
    this.style.height = this.scrollHeight + 'px';
  }
  
  collapse() {
    this.setAttribute('expanded', 'false');
    this.style.height = '0';
  }
  
  toggle() {
    if (this.getAttribute('expanded') === 'true') {
      this.collapse();
    } else {
      this.expand();
    }
  }
}

customElements.define('custom-accordion', AccordionElement);

// Now control it declaratively
const app = Reactive.state({ accordionExpanded: false });

Conditions.whenState(
  () => app.accordionExpanded,
  {
    'true': {
      callMethod: 'expand'
    },
    'false': {
      callMethod: 'collapse'
    }
  },
  'custom-accordion'
);

// Toggle
document.getElementById('toggle-btn').onclick = () => {
  app.accordionExpanded = !app.accordionExpanded;
};
```

---

### Example 5: Data Visualization Handler

**JavaScript:**
```javascript
// Register chart handler (using Chart.js)
Conditions.registerHandler('chart', {
  test: (key) => key === 'chart',
  apply: (element, config) => {
    // Destroy existing chart if any
    if (element.chartInstance) {
      element.chartInstance.destroy();
    }
    
    if (!config) return;
    
    // Create canvas if needed
    let canvas = element.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      element.appendChild(canvas);
    }
    
    // Create new chart
    element.chartInstance = new Chart(canvas, {
      type: config.type || 'bar',
      data: config.data,
      options: config.options || {}
    });
  }
});

// Use with reactive data
const dashboard = Reactive.state({
  dataView: 'monthly',
  data: {
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr'],
      datasets: [{
        label: 'Sales',
        data: [12, 19, 3, 17]
      }]
    },
    quarterly: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{
        label: 'Sales',
        data: [34, 45, 38, 52]
      }]
    }
  }
});

Conditions.whenState(
  () => dashboard.dataView,
  {
    'monthly': {
      chart: {
        type: 'line',
        data: dashboard.data.monthly,
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: 'Monthly Sales' }
          }
        }
      }
    },
    'quarterly': {
      chart: {
        type: 'bar',
        data: dashboard.data.quarterly,
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: 'Quarterly Sales' }
          }
        }
      }
    }
  },
  '#chart-container'
);
```

---

## Advanced Handler Patterns

### Pattern 1: Cleanup in Handlers

Handlers that create resources should clean up:

```javascript
Conditions.registerHandler('interval', {
  test: (key) => key === 'interval',
  apply: (element, config) => {
    // Clear existing interval
    if (element._interval) {
      clearInterval(element._interval);
      element._interval = null;
    }
    
    // Set new interval
    if (config && config.fn && config.delay) {
      element._interval = setInterval(config.fn, config.delay);
    }
  }
});
```

### Pattern 2: Validation in Handlers

Validate input before applying:

```javascript
Conditions.registerHandler('validate', {
  test: (key) => key === 'validate',
  apply: (element, config) => {
    // Validate config structure
    if (!config || typeof config !== 'object') {
      console.warn('Invalid validate config');
      return;
    }
    
    // Validate value type
    if (config.type === 'number' && isNaN(element.value)) {
      element.classList.add('invalid');
    } else {
      element.classList.remove('invalid');
    }
  }
});
```

### Pattern 3: Element Type Checking

Check element type before applying:

```javascript
Conditions.registerHandler('videoControl', {
  test: (key) => key === 'videoControl',
  apply: (element, action) => {
    // Only work with video elements
    if (!(element instanceof HTMLVideoElement)) {
      console.warn('videoControl only works with <video> elements');
      return;
    }
    
    if (action === 'play') element.play();
    else if (action === 'pause') element.pause();
    else if (action === 'restart') {
      element.currentTime = 0;
      element.play();
    }
  }
});
```

### Pattern 4: Progressive Enhancement

Feature detect before using:

```javascript
Conditions.registerHandler('vibrate', {
  test: (key) => key === 'vibrate',
  apply: (element, pattern) => {
    // Feature detection
    if (!navigator.vibrate) {
      console.log('Vibration API not supported');
      return;
    }
    
    // Apply vibration
    navigator.vibrate(pattern);
  }
});
```

---

## Helper Functions

### `createSimpleHandler()` - Quick Handler Creation

For simple single-property handlers:

```javascript
// Instead of:
Conditions.registerHandler('focus', {
  test: (key) => key === 'focus',
  apply: (element, shouldFocus) => {
    if (shouldFocus) element.focus();
  }
});

// Use shorthand:
createSimpleHandler('focus', 'focus', (element, shouldFocus) => {
  if (shouldFocus) element.focus();
});
```

### Batch Registration

Register multiple handlers at once:

```javascript
registerHandlers({
  'focus': {
    test: (key) => key === 'focus',
    apply: (el, val) => { if (val) el.focus(); }
  },
  'blur': {
    test: (key) => key === 'blur',
    apply: (el, val) => { if (val) el.blur(); }
  },
  'select': {
    test: (key) => key === 'select',
    apply: (el, val) => { if (val) el.select(); }
  }
});
```

---

## Testing Your Handlers

### Manual Testing

```javascript
// Register your handler
Conditions.registerHandler('myHandler', myHandlerDef);

// Test it manually
const testElement = document.getElementById('test');
Conditions.applyProperty(testElement, 'myHandler', testValue);

// Check result
console.log('Handler applied successfully');
```

### Unit Testing Pattern

```javascript
// Define handler
const tooltipHandler = {
  test: (key) => key === 'tooltip',
  apply: (element, config) => {
    // Implementation
  }
};

// Test it
const mockElement = document.createElement('div');

console.assert(tooltipHandler.test('tooltip') === true, 'Should handle tooltip');
console.assert(tooltipHandler.test('other') === false, 'Should not handle other');

// Test apply
tooltipHandler.apply(mockElement, 'Test tooltip');
console.assert(
  mockElement.querySelector('.custom-tooltip') !== null,
  'Should create tooltip element'
);

// Register after testing
Conditions.registerHandler('tooltip', tooltipHandler);
```

---

## Common Beginner Questions

### Q: When should I create a custom handler?

**Answer:** When you need to perform custom DOM manipulation that built-in handlers don't support.

**Create a handler when:**
- ✅ Using modern APIs (Web Animations, Intersection Observer, etc.)
- ✅ Working with custom elements/web components
- ✅ Need complex DOM manipulation
- ✅ Logic will be reused multiple times
- ✅ Want declarative API for custom features

**Don't create a handler when:**
- ❌ Built-in handlers work fine (use style, classList, etc.)
- ❌ One-time use (just use addEventListener)
- ❌ Better done in component lifecycle

---

### Q: Can handlers access element state?

**Answer:** Yes! The element parameter is the actual DOM element.

```javascript
Conditions.registerHandler('toggle', {
  test: (key) => key === 'toggle',
  apply: (element, property) => {
    // Access element properties
    const currentValue = element[property];
    element[property] = !currentValue;
  }
});
```

---

### Q: What if multiple handlers match?

**Answer:** The **first matching** handler wins (order matters).

```javascript
// Handlers tested in registration order
Conditions.registerHandler('a', {
  test: (key) => key.startsWith('custom'),
  apply: () => console.log('Handler A')
});

Conditions.registerHandler('b', {
  test: (key) => key === 'custom-prop',
  apply: () => console.log('Handler B')
});

// key: 'custom-prop'
// Handler 'a' tests first, matches, runs
// Handler 'b' never runs!
```

**Best practice:** Make test() functions specific!

---

### Q: Can handlers be async?

**Answer:** No, handlers must be synchronous. For async operations, update state separately.

```javascript
// ❌ Won't work - async not supported
Conditions.registerHandler('fetchData', {
  test: (key) => key === 'fetchData',
  apply: async (element, url) => {
    const data = await fetch(url);
    element.textContent = await data.text();
  }
});

// ✅ Solution: Separate async logic from handler
const state = Reactive.state({ data: '' });

async function loadData(url) {
  const response = await fetch(url);
  state.data = await response.text();
}

Conditions.whenState(
  () => state.data,
  {
    'default': { textContent: state.data }
  },
  '#element'
);
```

---

## Tips and Best Practices

### Tip 1: Clean Up Resources

```javascript
// ✅ Good - cleanup existing resources
{
  apply: (element, config) => {
    // Clean up old
    if (element._myResource) {
      element._myResource.destroy();
    }
    
    // Create new
    if (config) {
      element._myResource = createResource(config);
    }
  }
}
```

### Tip 2: Validate Input

```javascript
// ✅ Good - defensive programming
{
  apply: (element, config) => {
    // Validate config
    if (!config || typeof config !== 'object') {
      console.warn('Invalid config');
      return;
    }
    
    // Validate element type
    if (!(element instanceof HTMLVideoElement)) {
      console.warn('Wrong element type');
      return;
    }
    
    // Safe to proceed
    element.play();
  }
}
```

### Tip 3: Use Descriptive Names

```javascript
// ❌ Bad - unclear
Conditions.registerHandler('x', handler);

// ✅ Good - clear purpose
Conditions.registerHandler('scrollIntoView', handler);
```

### Tip 4: Document Your Handlers

```javascript
/**
 * Tooltip Handler
 * 
 * Adds configurable tooltips to elements
 * 
 * Supported configs:
 * - String: Simple tooltip text
 * - Object: { text, position, bgColor, color }
 * - null/false: Remove tooltip
 * 
 * @example
 * Conditions.whenState(
 *   () => helpMode,
 *   {
 *     'true': {
 *       tooltip: {
 *         text: 'Help text',
 *         position: 'top'
 *       }
 *     }
 *   },
 *   '#button'
 * );
 */
Conditions.registerHandler('tooltip', tooltipHandler);
```

---

## Summary

### What `registerHandler()` Does:

1. ✅ Creates custom property handlers
2. ✅ Extends DOM manipulation capabilities
3. ✅ Enables modern API integration
4. ✅ Reusable across all conditions
5. ✅ Integrates seamlessly with built-in handlers

### When to Use It:

- Need custom DOM manipulation
- Using modern web APIs (animations, observers, etc.)
- Working with custom elements/components
- Want declarative API for complex operations
- Building reusable handler libraries

### The Basic Pattern:

```javascript
// 1. Register your handler
Conditions.registerHandler('my-handler', {
  // Should this handler process this property?
  test: (key, value?, element?) => boolean,
  
  // How to apply it to the element
  apply: (element, value, key) => void
});

// 2. Use it in conditions
Conditions.whenState(
  () => state.value,
  {
    'condition': {
      'my-handler': value  // Handled by your custom handler
    }
  },
  selector
);

// 3. It works automatically! ✨
```

### Quick Decision Guide:

- **Built-in handlers work?** → Use built-in
- **Need custom DOM manipulation?** → Create handler
- **Using modern APIs?** → Create handler
- **One-time operation?** → Use addEventListener or direct manipulation

---

**Remember:** Custom handlers teach the Conditions system new DOM manipulation tricks. Define them once, use them everywhere, and your configurations become more powerful and expressive! 🎉