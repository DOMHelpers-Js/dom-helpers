[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Usage Examples and Best Practices

## Quick Start (30 seconds)

```javascript
// Load the module — existing code is automatically fixed
// No API changes, no rewrites needed

const cleanup = Conditions.whenState(
  () => isActive.value,
  {
    'true':  { addEventListener: { click: handleClick, mouseover: handleHover } },
    'false': { classList: { add: 'disabled' } }
  },
  '.btn'
);

// destroy() now removes ALL event listeners properly
cleanup.destroy();

// Verify — no lingering listeners
Conditions.checkListenerLeaks();  // ✓ No listener leaks detected
```

---

## Real-World Examples

### Example 1: Toggle Button with Click Handler

```javascript
const isActive = state(false);

const cleanup = Conditions.whenState(
  () => isActive.value,
  {
    'true': {
      textContent: 'ON',
      style: { backgroundColor: 'green' },
      addEventListener: {
        click: () => { isActive.value = false; }
      }
    },
    'false': {
      textContent: 'OFF',
      style: { backgroundColor: 'gray' },
      addEventListener: {
        click: () => { isActive.value = true; }
      }
    }
  },
  '#toggleBtn'
);

// Toggle multiple times — listeners swap cleanly
isActive.value = true;   // ON click handler attached
isActive.value = false;  // OFF click handler attached
isActive.value = true;   // ON click handler attached

// Complete cleanup — no lingering handlers
cleanup.destroy();
```

### Example 2: Form with Multiple Event Types

```javascript
const formMode = state('idle');

const cleanup = Conditions.whenState(
  () => formMode.value,
  {
    'idle': {
      addEventListener: {
        click: () => { formMode.value = 'editing'; },
        focus: () => console.log('Field focused')
      }
    },
    'editing': {
      addEventListener: {
        input: (e) => console.log('Typing:', e.target.value),
        blur: () => { formMode.value = 'idle'; },
        keydown: (e) => {
          if (e.key === 'Enter') formMode.value = 'submitting';
        }
      }
    },
    'submitting': {
      disabled: true
    }
  },
  '#formInput'
);

// State transitions add/remove different listener sets
formMode.value = 'editing';     // input, blur, keydown attached
formMode.value = 'submitting';  // those removed, disabled set
formMode.value = 'idle';        // click, focus attached

// All listeners from ALL states properly removed
cleanup.destroy();
```

### Example 3: Modal with Keyboard Shortcuts

```javascript
const modalOpen = state(false);

const cleanup = Conditions.whenState(
  () => modalOpen.value,
  {
    'true': {
      style: { display: 'flex' },
      classList: { add: 'modal-visible' },
      addEventListener: {
        click: (e) => {
          if (e.target.classList.contains('modal-backdrop')) {
            modalOpen.value = false;
          }
        },
        keydown: (e) => {
          if (e.key === 'Escape') modalOpen.value = false;
        }
      }
    },
    'false': {
      style: { display: 'none' },
      classList: { remove: 'modal-visible' }
    }
  },
  '.modal'
);

// Open and close multiple times
modalOpen.value = true;   // click + keydown attached
modalOpen.value = false;  // listeners removed by core
modalOpen.value = true;   // click + keydown attached again

// Final cleanup removes everything
cleanup.destroy();
```

### Example 4: Tab Navigation

```javascript
const activeTab = state('home');

const cleanup = Conditions.whenState(
  () => activeTab.value,
  {
    'home': {
      classList: { add: 'active' },
      addEventListener: {
        click: () => console.log('Home tab clicked')
      }
    },
    'settings': {
      classList: { add: 'active' },
      addEventListener: {
        click: () => console.log('Settings tab clicked')
      }
    },
    'profile': {
      classList: { add: 'active' },
      addEventListener: {
        click: () => console.log('Profile tab clicked')
      }
    }
  },
  '.tab-btn'
);

// Switch tabs — handlers swap each time
activeTab.value = 'settings';
activeTab.value = 'profile';
activeTab.value = 'home';

// When tabs are removed from the page
cleanup.destroy();
// All click handlers from all tabs properly removed
```

### Example 5: Drag and Drop Zone

```javascript
const dragState = state('idle');

const cleanup = Conditions.whenState(
  () => dragState.value,
  {
    'idle': {
      classList: { remove: ['drag-over', 'dragging'] },
      addEventListener: {
        dragover: (e) => {
          e.preventDefault();
          dragState.value = 'over';
        }
      }
    },
    'over': {
      classList: { add: 'drag-over' },
      addEventListener: {
        drop: (e) => {
          e.preventDefault();
          handleDrop(e);
          dragState.value = 'idle';
        },
        dragleave: () => {
          dragState.value = 'idle';
        }
      }
    }
  },
  '.drop-zone'
);

// Many drag operations create many listener swaps
// Each transition attaches/removes different handlers

// When the drop zone feature is disabled
cleanup.destroy();
// All dragover, drop, dragleave handlers properly removed
```

### Example 6: Debugging Listener Leaks

```javascript
// Set up several watchers with event listeners
const cleanup1 = Conditions.whenState(
  () => stateA.value,
  { 'active': { addEventListener: { click: handler1 } } },
  '.btn-a'
);

const cleanup2 = Conditions.whenState(
  () => stateB.value,
  { 'enabled': { addEventListener: { submit: handler2 } } },
  '.form'
);

// Check for active listeners
const before = Conditions.checkListenerLeaks();
console.log(before.length);  // 2 elements with listeners

// Clean up one
cleanup1.destroy();

// Check again
const middle = Conditions.checkListenerLeaks();
console.log(middle.length);  // 1 element remaining

// Clean up the other
cleanup2.destroy();

// Final check
Conditions.checkListenerLeaks();
// Console: ✓ No listener leaks detected
```

### Example 7: Emergency Cleanup in SPA

```javascript
// Multiple components set up watchers
function initDashboard() {
  return Conditions.whenState(stateA, condA, '.dashboard');
}

function initSidebar() {
  return Conditions.whenState(stateB, condB, '.sidebar');
}

function initNotifications() {
  return Conditions.whenState(stateC, condC, '.notifications');
}

// Set up the page
const cleanups = [initDashboard(), initSidebar(), initNotifications()];

// Normal cleanup
cleanups.forEach(c => c.destroy());

// But let's verify nothing was missed
const leaks = Conditions.checkListenerLeaks();

if (leaks.length > 0) {
  console.warn(`Found ${leaks.length} lingering listener(s)`);
  // Emergency cleanup
  Conditions.cleanupAllListeners();
}
```

### Example 8: Component Lifecycle

```javascript
class InteractiveWidget {
  constructor(selector) {
    this.selector = selector;
    this.cleanup = null;
    this.mode = state('view');
  }

  mount() {
    this.cleanup = Conditions.whenState(
      () => this.mode.value,
      {
        'view': {
          addEventListener: {
            click: () => { this.mode.value = 'edit'; },
            mouseenter: () => this.showTooltip()
          }
        },
        'edit': {
          addEventListener: {
            input: (e) => this.handleInput(e),
            blur: () => { this.mode.value = 'view'; }
          }
        }
      },
      this.selector
    );
  }

  unmount() {
    if (this.cleanup) {
      this.cleanup.destroy();
      this.cleanup = null;
    }
  }

  showTooltip() { /* ... */ }
  handleInput(e) { /* ... */ }
}

// Usage
const widget = new InteractiveWidget('#myWidget');
widget.mount();    // Listeners attached and tracked

// Later
widget.unmount();  // All listeners properly removed
```

---

## Using checkListenerLeaks() for Debugging

### Basic Leak Check

```javascript
const leaks = Conditions.checkListenerLeaks();

if (leaks.length === 0) {
  console.log('No leaks — everything is clean');
} else {
  leaks.forEach(({ element, listenerCount, listeners }) => {
    console.log('Element:', element);
    console.log('  Listener count:', listenerCount);
    listeners.forEach(l => {
      console.log(`  - ${l.event}`, l.handler);
    });
  });
}
```

### Development-Only Monitoring

```javascript
// Add to your app's initialization
if (isDev) {
  setInterval(() => {
    const leaks = Conditions.checkListenerLeaks();
    if (leaks.length > 0) {
      console.warn(`Listener leaks: ${leaks.length} element(s)`);
    }
  }, 10000);  // Check every 10 seconds
}
```

---

## Using cleanupAllListeners() Safely

```javascript
// Before page transitions in a SPA
function onPageLeave() {
  Conditions.cleanupAllListeners();
}

// Before app teardown
function teardownApp() {
  // First try normal cleanup
  appCleanups.forEach(c => c.destroy());

  // Then verify with emergency cleanup
  const remaining = Conditions.cleanupAllListeners();
  if (remaining > 0) {
    console.log(`Emergency cleaned ${remaining} element(s)`);
  }
}
```

---

## Idempotent destroy()

The enhanced `destroy()` is safe to call multiple times:

```javascript
const cleanup = Conditions.whenState(
  () => status.value,
  {
    'active': { addEventListener: { click: handler } }
  },
  '.btn'
);

// All of these are safe
cleanup.destroy();  // First call — full cleanup
cleanup.destroy();  // No-op — already destroyed
cleanup.destroy();  // Still no-op — no errors
```

This is especially useful when cleanup might be triggered from multiple places (e.g., both a timer and a user action).

---

## Best Practices

### 1. Always Store Cleanup References

```javascript
// ✅ Store the reference
const cleanup = Conditions.whenState(
  () => active.value,
  { 'true': { addEventListener: { click: handler } } },
  '.btn'
);

// Later
cleanup.destroy();

// ❌ Lost reference — can't clean up
Conditions.whenState(
  () => active.value,
  { 'true': { addEventListener: { click: handler } } },
  '.btn'
);
```

### 2. Clean Up in Component Teardown

```javascript
// ✅ Tie cleanup to component lifecycle
class MyComponent {
  mount() {
    this.cleanup = Conditions.whenState(/*...*/);
  }

  unmount() {
    this.cleanup?.destroy();
  }
}

// ❌ No teardown — listeners accumulate
class LeakyComponent {
  mount() {
    Conditions.whenState(/*...*/);  // No reference, no cleanup
  }
}
```

### 3. Use checkListenerLeaks() During Development

```javascript
// ✅ Verify cleanup works during development
cleanup.destroy();

if (isDev) {
  const leaks = Conditions.checkListenerLeaks();
  if (leaks.length > 0) {
    console.warn('Potential memory leak:', leaks);
  }
}
```

### 4. Use cleanupAllListeners() as a Safety Net

```javascript
// ✅ Use as a last resort, not the primary cleanup strategy
function onAppShutdown() {
  // First: normal cleanup
  allCleanups.forEach(c => c.destroy());

  // Second: safety net
  Conditions.cleanupAllListeners();
}

// ❌ Don't rely on it as the only cleanup
function onAppShutdown() {
  Conditions.cleanupAllListeners();  // Too broad — removes everything
}
```

### 5. Load the Module Last

```javascript
// ✅ Load after all other Conditions modules
// 01_dh-conditional-rendering.js
// 02_dh-conditions-default.js
// 03_dh-conditions-collection-extension.js
// 05_dh-conditions-global-shortcut.js
// 08_dh-conditions-batch-states.js
// 09_dh-conditions-cleanup-fix.js  ← Last

// ❌ Loading before other modules may miss their patches
```

### 6. Don't Fear Multiple destroy() Calls

```javascript
// ✅ Safe — idempotent destroy
function cleanupOnTimeout() {
  cleanup.destroy();
}

function cleanupOnUserAction() {
  cleanup.destroy();  // Safe even if timeout already triggered
}

setTimeout(cleanupOnTimeout, 5000);
button.addEventListener('click', cleanupOnUserAction);
```

---

## Summary

| Pattern | When to Use |
|---------|------------|
| **Normal cleanup** | `cleanup.destroy()` — always the primary approach |
| **Leak checking** | `Conditions.checkListenerLeaks()` — during development |
| **Emergency cleanup** | `Conditions.cleanupAllListeners()` — lost references, safety net |
| **Restoration** | `Conditions.restoreCleanupFix()` — testing, debugging |
| **Multiple destroy** | Safe — call `destroy()` as many times as needed |

| Feature | Behavior |
|---------|----------|
| **Automatic patching** | No code changes needed — just load the file |
| **Element tracking** | Uses `Set` for O(1) add/delete |
| **Listener removal** | Reads `_whenStateListeners` array, calls `removeEventListener` for each |
| **Idempotent destroy** | `isDestroyed` flag prevents double-cleanup |
| **Integration** | Updates Elements, Collections, Selector, and global shortcuts |
| **Performance** | Minimal overhead — small `Set` per watcher, one cleanup pass |

| Method | Purpose |
|--------|---------|
| `Conditions.checkListenerLeaks()` | Find elements with active listeners |
| `Conditions.cleanupAllListeners()` | Remove all Conditions listeners from all elements |
| `Conditions.restoreCleanupFix()` | Remove the patch, restore originals |

> **Simple Rule to Remember:** Load this module after the core Conditions module, and `destroy()` will properly clean up all event listeners. Store your cleanup references, call `destroy()` when done, and use `checkListenerLeaks()` during development to verify everything is clean. The fix is transparent — your existing code works exactly the same, just without memory leaks.