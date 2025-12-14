# Conditions Cleanup Fix Module - Available Methods

This module **fixes a critical memory leak** in the Conditions system where event listeners attached via `addEventListener` weren't being properly removed when `cleanup.destroy()` was called. It patches `whenState()` and `watch()` to track all elements with listeners and ensures complete cleanup.

---

## 🎯 **What This Module Fixes**

### The Problem (Before Fix):
```javascript
// Setup conditional with event listeners
const cleanup = Conditions.whenState(
  () => state.active.value,
  {
    'true': {
      classList: { add: 'active' },
      addEventListener: {
        click: handleClick
      }
    },
    'false': {
      classList: { remove: 'active' }
    }
  },
  '.btn'
);

// Later: destroy the watcher
cleanup.destroy();

// ❌ PROBLEM: Event listeners from the LAST applied condition
// remained attached to elements - MEMORY LEAK!
```

### The Solution (After Fix):
```javascript
// Same setup
const cleanup = Conditions.whenState(
  () => state.active.value,
  {
    'true': {
      classList: { add: 'active' },
      addEventListener: {
        click: handleClick
      }
    },
    'false': {
      classList: { remove: 'active' }
    }
  },
  '.btn'
);

// Later: destroy the watcher
cleanup.destroy();

// ✅ FIXED: ALL event listeners properly removed
// No memory leaks!
```

**Key Fix:** Tracks all elements that get listeners attached, then removes all listeners on `destroy()`.

---

## 📋 **Core API Methods**

### 1. **`Conditions.whenState()` / `whenWatch()`** (Enhanced)

These methods are **automatically patched** when you load this module. No API changes - they just work better!

```javascript
// Use normally - cleanup now works properly
const cleanup = Conditions.whenState(
  () => state.status.value,
  {
    'active': {
      addEventListener: {
        click: handleClick,
        mouseover: handleHover
      }
    },
    'inactive': {
      classList: { add: 'disabled' }
    }
  },
  '.btn'
);

// All listeners tracked automatically
// When you call destroy, all listeners removed
cleanup.destroy(); // ✅ Complete cleanup
```

**What Changed:**
- Before: Last condition's listeners stayed attached
- After: All listeners from all conditions properly removed

**No Code Changes Needed:** Just load the module, existing code works better!

---

### 2. **`Conditions.checkListenerLeaks()`** (Debugging Utility)

Check for elements that still have event listeners attached. Useful for debugging memory leaks.

```javascript
// Setup some watchers
const cleanup1 = Conditions.whenState(state.a, condA, '.btn-a');
const cleanup2 = Conditions.whenState(state.b, condB, '.btn-b');

// Check for leaks (should show active listeners)
const leaks = Conditions.checkListenerLeaks();

// Console output:
// ⚠️ Found 2 element(s) with active listeners
// Element: <button class="btn-a">
//   Listeners: 1
//   Details: [{ event: 'click', handler: ƒ, options: undefined }]
// Element: <button class="btn-b">
//   Listeners: 1
//   Details: [{ event: 'click', handler: ƒ, options: undefined }]

// Cleanup
cleanup1.destroy();
cleanup2.destroy();

// Check again (should be clean)
Conditions.checkListenerLeaks();
// Console output: ✓ No listener leaks detected
```

**Parameters:** None

**Returns:** `Array` of objects with:
- `element` - DOM element
- `listenerCount` - Number of listeners
- `listeners` - Array of listener details

**Use Case:** Debugging, testing, finding memory leaks

---

### 3. **`Conditions.cleanupAllListeners()`** (Emergency Cleanup)

Nuclear option - removes ALL Conditions-attached listeners from ALL elements in the document.

```javascript
// Multiple watchers across the app
const cleanup1 = Conditions.whenState(state.a, condA, '.btn-a');
const cleanup2 = Conditions.whenState(state.b, condB, '.btn-b');
const cleanup3 = Conditions.whenState(state.c, condC, '.btn-c');

// Something went wrong, references lost...
// Emergency cleanup:
const removed = Conditions.cleanupAllListeners();

// Console output:
// [Conditions.CleanupFix] Emergency cleanup: removed listeners from 3 element(s)

console.log(removed); // 3
```

**Parameters:** None

**Returns:** `number` - Count of elements cleaned

**Use Case:** 
- Emergency situations
- Testing/debugging
- Cleanup before page navigation
- When cleanup objects lost

**⚠️ Warning:** This removes ALL Conditions listeners from the entire document. Use sparingly!

---

### 4. **`Conditions.restoreCleanupFix()`** (Restoration)

Remove the cleanup fix patch and restore original behavior. Useful for testing/debugging.

```javascript
// Cleanup fix is active
const cleanup1 = Conditions.whenState(state.a, condA, '.btn');
cleanup1.destroy(); // ✅ Listeners removed properly

// Restore original (for testing)
Conditions.restoreCleanupFix();

// Now back to original behavior
const cleanup2 = Conditions.whenState(state.b, condB, '.btn');
cleanup2.destroy(); // ⚠️ Back to original (potential leak)

// Console output:
// [Conditions.CleanupFix] Original whenState() restored
// [Conditions.CleanupFix] Original watch() restored
// [Conditions.CleanupFix] Cleanup fix removed
```

**Parameters:** None

**Returns:** `undefined`

**Use Case:** Testing, debugging, verifying fix behavior

---

## 💡 **Usage Examples**

### Example 1: Basic Button with Click Handler
```javascript
const isActive = reactive(false);

const cleanup = Conditions.whenState(
  () => isActive.value,
  {
    'true': {
      classList: { add: 'active' },
      addEventListener: {
        click: () => {
          console.log('Active button clicked!');
        }
      }
    },
    'false': {
      classList: { remove: 'active' },
      addEventListener: {
        click: () => {
          console.log('Inactive button clicked');
        }
      }
    }
  },
  '#action-btn'
);

// Toggle state multiple times
isActive.value = true;  // Attaches first click handler
isActive.value = false; // Attaches second click handler
isActive.value = true;  // Attaches first click handler again

// Cleanup properly removes ALL handlers from ALL states
cleanup.destroy();

// ✅ No memory leaks
// ✅ Button has no lingering event listeners
```

---

### Example 2: Form with Multiple Event Types
```javascript
const formState = reactive('idle'); // 'idle' | 'editing' | 'submitting'

const cleanup = Conditions.whenState(
  () => formState.value,
  {
    'idle': {
      addEventListener: {
        click: handleEditStart,
        focus: handleFocus
      }
    },
    'editing': {
      addEventListener: {
        input: handleInput,
        blur: handleBlur,
        keydown: handleKeydown
      }
    },
    'submitting': {
      disabled: true,
      addEventListener: {
        // No handlers while submitting
      }
    }
  },
  '#form-input'
);

// State changes add/remove different listeners
formState.value = 'editing';    // Adds input, blur, keydown
formState.value = 'submitting'; // Should remove those listeners
formState.value = 'idle';       // Should remove all, add click, focus

// When done, cleanup removes ALL listeners from ALL states
cleanup.destroy();

// ✅ Before fix: Last state's listeners would remain
// ✅ After fix: All listeners properly removed
```

---

### Example 3: Modal with Dynamic Handlers
```javascript
const modalState = reactive('closed'); // 'closed' | 'opening' | 'open' | 'closing'

const cleanup = Conditions.whenState(
  () => modalState.value,
  {
    'closed': {
      style: { display: 'none' }
    },
    'opening': {
      style: { display: 'block' },
      classList: { add: 'modal-opening' },
      addEventListener: {
        animationend: () => {
          modalState.value = 'open';
        }
      }
    },
    'open': {
      classList: { add: 'modal-open', remove: 'modal-opening' },
      addEventListener: {
        click: handleOutsideClick,
        keydown: (e) => {
          if (e.key === 'Escape') {
            modalState.value = 'closing';
          }
        }
      }
    },
    'closing': {
      classList: { add: 'modal-closing', remove: 'modal-open' },
      addEventListener: {
        animationend: () => {
          modalState.value = 'closed';
        }
      }
    }
  },
  '.modal'
);

// Multiple state transitions create and remove many listeners
modalState.value = 'opening'; // Adds animationend
modalState.value = 'open';    // Adds click, keydown
modalState.value = 'closing'; // Adds animationend
modalState.value = 'closed';  // No listeners

// Proper cleanup removes ALL listeners from entire lifecycle
cleanup.destroy();

// ✅ Without fix: animationend, click, keydown would remain
// ✅ With fix: Everything cleaned up
```

---

### Example 4: Drag and Drop with Multiple Handlers
```javascript
const dragState = reactive('idle'); // 'idle' | 'dragging' | 'hovering'

const cleanup = Conditions.whenState(
  () => dragState.value,
  {
    'idle': {
      addEventListener: {
        dragstart: handleDragStart,
        dragover: (e) => {
          e.preventDefault();
          dragState.value = 'hovering';
        }
      }
    },
    'dragging': {
      classList: { add: 'is-dragging' },
      addEventListener: {
        drag: handleDrag,
        dragend: () => {
          dragState.value = 'idle';
        }
      }
    },
    'hovering': {
      classList: { add: 'drag-hover' },
      addEventListener: {
        drop: handleDrop,
        dragleave: () => {
          dragState.value = 'idle';
        }
      }
    }
  },
  '.drop-zone'
);

// Many state transitions during drag operations
// Each adds/removes different event listeners

// When component unmounts or drag feature disabled:
cleanup.destroy();

// ✅ All drag-related listeners properly removed
// ✅ No memory leaks from complex event chains
```

---

### Example 5: Tab System with Navigation Handlers
```javascript
const activeTab = reactive(0);

const cleanup = Conditions.whenState(
  () => activeTab.value,
  {
    '0': {
      classList: {
        add: ['tab-active', 'tab-0-active'],
        remove: ['tab-1-active', 'tab-2-active']
      },
      addEventListener: {
        click: () => console.log('Tab 0 clicked'),
        mouseenter: () => console.log('Hovering tab 0')
      }
    },
    '1': {
      classList: {
        add: ['tab-active', 'tab-1-active'],
        remove: ['tab-0-active', 'tab-2-active']
      },
      addEventListener: {
        click: () => console.log('Tab 1 clicked'),
        mouseenter: () => console.log('Hovering tab 1')
      }
    },
    '2': {
      classList: {
        add: ['tab-active', 'tab-2-active'],
        remove: ['tab-0-active', 'tab-1-active']
      },
      addEventListener: {
        click: () => console.log('Tab 2 clicked'),
        mouseenter: () => console.log('Hovering tab 2')
      }
    }
  },
  '.tab'
);

// User switches between tabs
activeTab.value = 1; // Attaches tab 1 handlers
activeTab.value = 2; // Attaches tab 2 handlers
activeTab.value = 0; // Attaches tab 0 handlers

// When tabs unmount:
cleanup.destroy();

// ✅ All handlers from all tabs removed
```

---

### Example 6: Debugging Memory Leaks
```javascript
// Setup multiple components with listeners
const cleanup1 = Conditions.whenState(state.a, {
  'active': {
    addEventListener: {
      click: handler1,
      mouseover: handler2
    }
  }
}, '.btn-a');

const cleanup2 = Conditions.whenState(state.b, {
  'enabled': {
    addEventListener: {
      submit: handleSubmit
    }
  }
}, '.form');

const cleanup3 = Conditions.whenState(state.c, {
  'open': {
    addEventListener: {
      keydown: handleKeydown,
      click: handleClick
    }
  }
}, '.modal');

// Check for active listeners
console.log('=== Before Cleanup ===');
const before = Conditions.checkListenerLeaks();
console.log(`Found ${before.length} elements with listeners`);
// Output: Found 3 elements with listeners

// Cleanup some
cleanup1.destroy();
cleanup2.destroy();

// Check again
console.log('\n=== After Partial Cleanup ===');
const middle = Conditions.checkListenerLeaks();
console.log(`Found ${middle.length} elements with listeners`);
// Output: Found 1 elements with listeners (only modal remains)

// Cleanup remaining
cleanup3.destroy();

// Final check
console.log('\n=== After Full Cleanup ===');
Conditions.checkListenerLeaks();
// Output: ✓ No listener leaks detected
```

---

### Example 7: Emergency Cleanup Scenario
```javascript
// App with many interactive elements
function initApp() {
  const cleanup1 = Conditions.whenState(state.nav, navConditions, '.nav');
  const cleanup2 = Conditions.whenState(state.sidebar, sidebarConditions, '.sidebar');
  const cleanup3 = Conditions.whenState(state.modal, modalConditions, '.modal');
  const cleanup4 = Conditions.whenState(state.tooltips, tooltipConditions, '.tooltip');
  
  // Store for cleanup
  window.appCleanups = [cleanup1, cleanup2, cleanup3, cleanup4];
}

initApp();

// Later: Try to cleanup
window.appCleanups?.forEach(c => c.destroy());

// But wait, did we miss something?
const leaks = Conditions.checkListenerLeaks();

if (leaks.length > 0) {
  console.warn(`⚠️ Found ${leaks.length} elements with lingering listeners`);
  
  // Emergency cleanup
  Conditions.cleanupAllListeners();
  
  // Verify
  Conditions.checkListenerLeaks();
  // Output: ✓ No listener leaks detected
}
```

---

### Example 8: Testing Cleanup Behavior
```javascript
// Test with the fix
function testWithFix() {
  const cleanup = Conditions.whenState(
    () => state.value,
    {
      'a': { addEventListener: { click: () => console.log('A') } },
      'b': { addEventListener: { click: () => console.log('B') } }
    },
    '.btn'
  );
  
  state.value = 'a'; // Attach handler A
  state.value = 'b'; // Attach handler B
  
  cleanup.destroy();
  
  const leaks = Conditions.checkListenerLeaks();
  console.log('With fix:', leaks.length === 0 ? '✅ Clean' : '❌ Leak');
}

// Test without the fix (for comparison)
function testWithoutFix() {
  // Remove the fix temporarily
  Conditions.restoreCleanupFix();
  
  const cleanup = Conditions.whenState(
    () => state.value,
    {
      'a': { addEventListener: { click: () => console.log('A') } },
      'b': { addEventListener: { click: () => console.log('B') } }
    },
    '.btn'
  );
  
  state.value = 'a'; // Attach handler A
  state.value = 'b'; // Attach handler B (A remains!)
  
  cleanup.destroy();
  
  const leaks = Conditions.checkListenerLeaks();
  console.log('Without fix:', leaks.length === 0 ? '✅ Clean' : '❌ Leak');
  
  // Cleanup manually
  Conditions.cleanupAllListeners();
}

testWithFix();    // Output: With fix: ✅ Clean
testWithoutFix(); // Output: Without fix: ❌ Leak
```

---

### Example 9: Component Lifecycle Integration
```javascript
class InteractiveComponent {
  constructor(element, state) {
    this.element = element;
    this.state = state;
    this.cleanup = null;
  }
  
  mount() {
    this.cleanup = Conditions.whenState(
      () => this.state.mode.value,
      {
        'view': {
          addEventListener: {
            click: this.handleClick.bind(this),
            dblclick: this.handleDoubleClick.bind(this)
          }
        },
        'edit': {
          addEventListener: {
            input: this.handleInput.bind(this),
            blur: this.handleBlur.bind(this),
            keydown: this.handleKeydown.bind(this)
          }
        },
        'locked': {
          disabled: true
        }
      },
      this.element
    );
    
    console.log('Component mounted');
  }
  
  unmount() {
    if (this.cleanup) {
      this.cleanup.destroy();
      console.log('Component unmounted - listeners cleaned');
      
      // Verify cleanup (in development)
      if (process.env.NODE_ENV === 'development') {
        const leaks = Conditions.checkListenerLeaks();
        if (leaks.length > 0) {
          console.warn('⚠️ Potential memory leak detected!');
        }
      }
    }
  }
  
  handleClick(e) { console.log('Click'); }
  handleDoubleClick(e) { console.log('Double click'); }
  handleInput(e) { console.log('Input'); }
  handleBlur(e) { console.log('Blur'); }
  handleKeydown(e) { console.log('Keydown'); }
}

// Usage
const component = new InteractiveComponent(element, state);
component.mount();   // Listeners attached

// Later:
component.unmount(); // ✅ All listeners removed properly
```

---

### Example 10: SPA Navigation Cleanup
```javascript
// Router-like navigation
const router = {
  currentPage: reactive('home'),
  cleanups: new Map()
};

function navigateTo(page) {
  // Cleanup old page
  const oldCleanup = router.cleanups.get(router.currentPage.value);
  if (oldCleanup) {
    oldCleanup.destroy();
    router.cleanups.delete(router.currentPage.value);
  }
  
  // Setup new page
  router.currentPage.value = page;
  
  const cleanup = setupPageListeners(page);
  router.cleanups.set(page, cleanup);
  
  // Verify no leaks (development only)
  if (process.env.NODE_ENV === 'development') {
    const leaks = Conditions.checkListenerLeaks();
    if (leaks.length > 0) {
      console.warn(`⚠️ ${leaks.length} listener leak(s) detected after navigation`);
    }
  }
}

function setupPageListeners(page) {
  const conditions = pageConditions[page];
  return Conditions.whenState(
    () => pageStates[page].value,
    conditions,
    '.page-content'
  );
}

// Navigate between pages
navigateTo('home');     // Setup home listeners
navigateTo('about');    // Cleanup home, setup about
navigateTo('contact');  // Cleanup about, setup contact

// App teardown
function teardownApp() {
  router.cleanups.forEach(cleanup => cleanup.destroy());
  router.cleanups.clear();
  
  // Final verification
  const remaining = Conditions.checkListenerLeaks();
  console.log(remaining.length === 0 ? 
    '✅ App cleaned successfully' : 
    `⚠️ ${remaining.length} leaks remain`
  );
}
```

---

## 🔍 **How It Works Internally**

### 1. Element Tracking
```javascript
// Before applying conditions, track elements
const trackedElements = new Set();

function trackElements(selector) {
  const elements = getElements(selector);
  elements.forEach(el => trackedElements.add(el));
}

// Elements stored in Set for later cleanup
```

---

### 2. Listener Cleanup Process
```javascript
function cleanupAllListeners(elements) {
  elements.forEach(element => {
    // Each element has _whenStateListeners array
    if (element._whenStateListeners) {
      element._whenStateListeners.forEach(({ event, handler, options }) => {
        element.removeEventListener(event, handler, options);
      });
      element._whenStateListeners = [];
    }
  });
}
```

---

### 3. Enhanced Destroy Method
```javascript
// Patched cleanup.destroy()
destroy() {
  // STEP 1: Cleanup all tracked listeners FIRST
  cleanupAllListeners(trackedElements);
  trackedElements.clear();
  
  // STEP 2: Call original destroy (stops effects)
  if (originalCleanup.destroy) {
    originalCleanup.destroy();
  }
  
  // STEP 3: Mark as destroyed
  isDestroyed = true;
}
```

---

### 4. Listener Storage Structure
```javascript
// Each element gets this array
element._whenStateListeners = [
  {
    event: 'click',
    handler: function() { ... },
    options: undefined
  },
  {
    event: 'keydown',
    handler: function() { ... },
    options: { passive: true }
  }
  // etc.
];

// This array tracks ALL listeners added by Conditions
// Regardless of which condition added them
```

---

## 🎯 **Debugging Utilities**

### Check for Leaks
```javascript
// Manual check
const leaks = Conditions.checkListenerLeaks();

if (leaks.length > 0) {
  console.group('Listener Leaks Detected');
  leaks.forEach(({ element, listenerCount, listeners }) => {
    console.log('Element:', element);
    console.log('Listener count:', listenerCount);
    console.log('Details:', listeners);
  });
  console.groupEnd();
}
```

---

### Automated Testing
```javascript
function testCleanup(testName, setupFn, cleanupFn) {
  console.log(`\n=== Testing: ${testName} ===`);
  
  // Clear any existing leaks
  Conditions.cleanupAllListeners();
  
  // Run setup
  const cleanup = setupFn();
  
  // Check setup created listeners
  const afterSetup = Conditions.checkListenerLeaks();
  console.log(`After setup: ${afterSetup.length} element(s) with listeners`);
  
  // Run cleanup
  if (cleanupFn) {
    cleanupFn();
  } else if (cleanup) {
    cleanup.destroy();
  }
  
  // Check cleanup worked
  const afterCleanup = Conditions.checkListenerLeaks();
  console.log(`After cleanup: ${afterCleanup.length} element(s) with listeners`);
  
  // Result
  if (afterCleanup.length === 0) {
    console.log('✅ PASS: No leaks');
  } else {
    console.log('❌ FAIL: Leaks remain');
  }
}

// Run tests
testCleanup('Simple click handler', () => {
  return Conditions.whenState(state.a, {
    'active': { addEventListener: { click: () => {} } }
  }, '.btn');
});

testCleanup('Multiple handlers', () => {
  return Conditions.whenState(state.b, {
    'enabled': {
      addEventListener: {
        click: () => {},
        mouseover: () => {},
        mouseout: () => {}
      }
    }
  }, '.btn');
});
```

---

### Memory Leak Dashboard
```javascript
class LeakMonitor {
  constructor() {
    this.history = [];
    this.checkInterval = null;
  }
  
  start(intervalMs = 5000) {
    this.checkInterval = setInterval(() => {
      const leaks = Conditions.checkListenerLeaks();
      this.history.push({
        timestamp: Date.now(),
        count: leaks.length,
        elements: leaks.map(l => l.element)
      });
      
      if (leaks.length > 0) {
        console.warn(`⚠️ [${new Date().toLocaleTimeString()}] ${leaks.length} leak(s) detected`);
      }
    }, intervalMs);
  }
  
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
  
  report() {
    console.group('Leak Monitor Report');
    console.log('Total checks:', this.history.length);
    console.log('Max leaks:', Math.max(...this.history.map(h => h.count)));
    console.log('Current leaks:', Conditions.checkListenerLeaks().length);
    
    const timeline = this.history.map(h => ({
      time: new Date(h.timestamp).toLocaleTimeString(),
      leaks: h.count
    }));
    console.table(timeline);
    console.groupEnd();
  }
}

// Usage
const monitor = new LeakMonitor();
monitor.start(5000); // Check every 5 seconds

// Later:
monitor.report();
monitor.stop();
```

---

## ⚙️ **Integration with Other Modules**

### With Batch States (File 08)
```javascript
// Batch cleanup works properly now
const cleanup = Conditions.whenStates([
  [state.a, condA, '.btn-a'],
  [state.b, condB, '.btn-b'],
  [state.c, condC, '.btn-c']
]);

// All watchers' listeners properly cleaned
cleanup.destroy();

// Verify
Conditions.checkListenerLeaks(); // ✓ No leaks
```

---

### With Shortcuts (File 05)
```javascript
// Global shortcuts work with fix
const cleanup = whenState(state.active, {
  'true': {
    addEventListener: { click: handler }
  }
}, '.btn');

cleanup.destroy(); // ✅ Properly cleaned
```

---

### With Array Support (File 07)
```javascript
// Arrays + event listeners + proper cleanup
const cleanup = Conditions.whenState(
  () => state.items.value,
  {
    'visible': {
      textContent: ['Item 1', 'Item 2', 'Item 3'],
      addEventListener: {
        click: [
          (e) => console.log('Item 1 clicked'),
          (e) => console.log('Item 2 clicked'),
          (e) => console.log('Item 3 clicked')
        ]
      }
    }
  },
  '.items'
);

// All listeners across all items cleaned properly
cleanup.destroy();
```

---

### With DOM Helpers
```javascript
// DOM Helper shortcuts work with fix
const cleanup = Conditions.whenState(
  state.active,
  conditions,
  ClassName.interactive // DOM Helper collection
);

cleanup.destroy(); // ✅ All elements cleaned
```

---

## ⚠️ **Important Notes**

### 1. Automatic Patching
```javascript
// Once module loaded, all Conditions methods automatically fixed
// No code changes needed!

// This is automatically fixed:
const cleanup = Conditions.whenState(...);
cleanup.destroy(); // ✅ Works properly now

// This is automatically fixed:
const cleanup = Conditions.watch(...);
cleanup.destroy(); // ✅ Works properly now

// Batch methods also fixed:
const cleanup = Conditions.whenStates([...]);
cleanup.destroy(); // ✅ Works properly now
```

---

### 2. Load Order
```javascript
// ✅ Correct order:
// 1. Core Conditions (01_dh-conditional-rendering.js)
// 2. Cleanup Fix (09_dh-conditions-cleanup-fix.js) - THIS MODULE
// 3. Use Conditions normally

// ⚠️ If loaded in wrong order:
// - Fix still works but may log warnings
// - Module attempts to patch immediately
```

---

### 3. Performance Impact
```javascript
// Minimal overhead:
// - Tracks elements in a Set (O(1) add/delete)
// - Only stores references, not cloning elements
// - Cleanup loops through tracked elements once

// Before fix: Memory leaks over time (bad performance)
// After fix: Small tracking overhead (negligible)
```

---

### 4. Listener Options
```javascript
// Listener options properly preserved
const cleanup = Conditions.whenState(
  state.active,
  {
    'true': {
      addEventListener: {
        scroll: {
          handler: handleScroll,
          options: { passive: true, capture: false }
        }
      }
    }
  },
  '.container'
);

// Options stored and used during removeEventListener
cleanup.destroy();
// removeEventListener called with same options
```

---

### 5. Multiple Destroy Calls
```javascript
const cleanup = Conditions.whenState(...);

// First destroy
cleanup.destroy(); // ✅ Cleans everything

// Second destroy (safe)
cleanup.destroy(); // No error, already destroyed

// Third destroy (safe)
cleanup.destroy(); // Still no error

// Destroy is idempotent - safe to call multiple times
```

---

## 🐛 **Debugging Common Issues**

### Issue 1: Listeners Not Removed
```javascript
// Check if fix is loaded
if (!Conditions.checkListenerLeaks) {
  console.error('⚠️ Cleanup fix not loaded!');
  console.log('Load 09_dh-conditions-cleanup-fix.js');
}

// Check if elements have listeners
const leaks = Conditions.checkListenerLeaks();
if (leaks.length > 0) {
  console.warn('Listeners still attached to:', leaks);
}
```

---

### Issue 2: Cleanup Not Called
```javascript
// Store cleanup reference
let cleanup = Conditions.whenState(...);

// Check cleanup exists
if (!cleanup || typeof cleanup.destroy !== 'function') {
  console.error('⚠️ Invalid cleanup object');
}

// Call destroy in finally block
try {
  // ... use the watcher
} finally {
  cleanup?.destroy();
}
```

---

### Issue 3: Lost Cleanup References
```javascript
// Problem: Lost reference
function badSetup() {
  Conditions.whenState(...); // ❌ Lost reference!
}

// Solution 1: Return cleanup
function goodSetup() {
  return Conditions.whenState(...); // ✅ Can cleanup later
}

// Solution 2: Store globally
window.appCleanups = [];
function trackedSetup() {
  const cleanup = Conditions.whenState(...);
  window.appCleanups.push(cleanup);
  return cleanup;
}

// Solution 3: Emergency cleanup
function emergencyCleanup() {
  Conditions.cleanupAllListeners(); // Nuclear option
}
```

---

### Issue 4: Memory Leak Detection
```javascript
// Before starting app
Conditions.cleanupAllListeners(); // Start clean

// Setup monitoring
const monitor = new LeakMonitor();
monitor.start();

// Run app...

// After app runs for a while
const leaks = Conditions.checkListenerLeaks();
if (leaks.length > 0) {
  console.warn('Leaks detected!');
  
  // Investigate
  leaks.forEach(({ element, listeners }) => {
    console.log('Element:', element);
    console.log('Listeners:', listeners.map(l => l.event));
  });
}
```

---

## 📊 **Module Information**

```javascript
// Check if loaded
console.log(Conditions.checkListenerLeaks); // function
console.log(Conditions.cleanupAllListeners); // function
console.log(Conditions.restoreCleanupFix); // function

// Check version
console.log(Conditions.extensions?.cleanupFix);
// {
//   version: '1.0.0',
//   fixed: [
//     'Event listener cleanup on destroy()',
//     'Memory leak prevention',
//     'Proper cleanup for reactive and non-reactive modes'
//   ],
//   utilities: [
//     'Conditions.cleanupAllListeners()',
//     'Conditions.checkListenerLeaks()',
//     'Conditions.restoreCleanupFix()'
//   ]
// }

// Check if original methods stored
console.log(Conditions._originalWhenState); // function (original)
console.log(Conditions._originalWatch);     // function (original)
```

---

## 📚 **Best Practices**

### 1. Always Destroy Cleanups
```javascript
// ✅ Good: Store and destroy
const cleanup = Conditions.whenState(...);

// Later:
cleanup.destroy();

// ❌ Bad: No cleanup
Conditions.whenState(...); // Memory leak potential
```

---

### 2. Use Finally Blocks
```javascript
// ✅ Good: Guaranteed cleanup
const cleanup = Conditions.whenState(...);

try {
  // Use the watcher
  await doSomething();
} finally {
  cleanup.destroy(); // Always runs
}
```

---

### 3. Component Lifecycle
```javascript
// ✅ Good: Tie to lifecycle
class Component {
  mount() {
    this.cleanup = Conditions.whenState(...);
  }
  
  unmount() {
    this.cleanup?.destroy();
  }
}

// ❌ Bad: No unmount
class BadComponent {
  mount() {
    Conditions.whenState(...); // Lost reference
  }
}
```

---

### 4. Check for Leaks in Development
```javascript
// ✅ Good: Monitor in dev
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const leaks = Conditions.checkListenerLeaks();
    if (leaks.length > 0) {
      console.warn(`⚠️ ${leaks.length} listener leak(s)`);
    }
  }, 10000); // Check every 10 seconds
}
```

---

### 5. Emergency Cleanup Before Navigation
```javascript
// ✅ Good: Cleanup before leaving
window.addEventListener('beforeunload', () => {
  Conditions.cleanupAllListeners();
});

// Or in SPA router
router.beforeEach(() => {
  Conditions.cleanupAllListeners();
});
```

---

## 🎯 **Key Features**

1. ✅ **Automatic fix** - No code changes needed
2. ✅ **Complete cleanup** - All listeners removed on destroy()
3. ✅ **Memory leak prevention** - Tracks all elements with listeners
4. ✅ **Debug utilities** - `checkListenerLeaks()` and `cleanupAllListeners()`
5. ✅ **Idempotent destroy** - Safe to call destroy() multiple times
6. ✅ **Options preservation** - Listener options properly handled
7. ✅ **Backward compatible** - Existing code works without changes
8. ✅ **Performance optimized** - Minimal overhead
9. ✅ **Restoration support** - Can restore original for testing
10. ✅ **Integration ready** - Works with all Conditions features

---

## 🚀 **Getting Started**

```javascript
// 1. Load core Conditions
// <script src="01_dh-conditional-rendering.js"></script>

// 2. Load cleanup fix (THIS MODULE)
// <script src="09_dh-conditions-cleanup-fix.js"></script>

// 3. Use Conditions normally - fix is automatic!
const cleanup = Conditions.whenState(
  () => state.active.value,
  {
    'true': {
      addEventListener: {
        click: handleClick,
        mouseover: handleHover
      }
    }
  },
  '.btn'
);

// 4. Cleanup properly removes ALL listeners
cleanup.destroy();

// 5. Verify (optional)
Conditions.checkListenerLeaks(); // ✓ No leaks

// That's it! Your memory leaks are fixed! ✨
```

---

**This module is essential for production apps using event listeners in Conditions!** 🛡️✨