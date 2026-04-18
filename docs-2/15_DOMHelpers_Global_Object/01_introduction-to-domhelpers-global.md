[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# The DOMHelpers Global Object

## Quick Start (30 seconds)

```javascript
// One object to access everything in the library
console.log(DOMHelpers.version);       // "2.3.1"
console.log(DOMHelpers.isReady());     // true

// Access any helper through DOMHelpers
DOMHelpers.Elements.myButton;
DOMHelpers.Collections.ClassName.btn;
DOMHelpers.Selector.query('#header');

// Manage the entire library with one call
DOMHelpers.clearAll();        // Clear all caches
DOMHelpers.getStats();        // Get combined statistics
DOMHelpers.configure({        // Configure all helpers at once
  enableLogging: true
});
```

---

## What is the DOMHelpers Global Object?

`DOMHelpers` is the **central hub** of the entire DOM Helpers library. It's a single object that gives you access to every helper, every method, and every configuration option — all from one place.

Simply put, if `Elements`, `Collections`, and `Selector` are individual tools in a toolbox, then `DOMHelpers` **is the toolbox itself**.

You don't *need* `DOMHelpers` to use the library — each helper (`Elements`, `Collections`, `Selector`) works perfectly on its own as a global. But `DOMHelpers` is there when you want a **single entry point** to manage, configure, or inspect the entire library.

---

## Why Does This Exist?

### The Situation Without a Central Object

Imagine you've built a large application using all three helpers. At some point, you need to:

- Check if the library loaded correctly
- Clear all cached data
- Turn on logging for debugging
- Clean up everything when your app shuts down

Without a central object, you'd do this:

```javascript
// Clearing all caches — three separate calls
Elements.clear();
Collections.clear();
Selector.clear();

// Checking stats — three separate calls
const elementsStats = Elements.stats();
const collectionsStats = Collections.stats();
const selectorStats = Selector.stats();

// Configuring — three separate calls
Elements.configure({ enableLogging: true });
Collections.configure({ enableLogging: true });
Selector.configure({ enableLogging: true });
```

That works, but notice the pattern:
- ❌ Repetitive — the same action repeated for each helper
- ❌ Easy to forget one — what if you clear two caches but miss the third?
- ❌ No single point of truth — is the library even fully loaded?

### The DOMHelpers Way

```javascript
// Clearing all caches — one call
DOMHelpers.clearAll();

// Checking stats — one call
const allStats = DOMHelpers.getStats();

// Configuring — one call
DOMHelpers.configure({ enableLogging: true });

// Is everything loaded?
if (DOMHelpers.isReady()) {
  console.log('All helpers are available!');
}
```

✅ **One call instead of three**
✅ **Nothing forgotten** — every helper is included automatically
✅ **Single point of truth** — check readiness, version, and stats in one place

---

## Mental Model: The Control Panel

Think of `DOMHelpers` as the **main control panel** of a building.

```
┌─────────────────────────────────────────┐
│           DOMHelpers (Control Panel)     │
│                                         │
│  ┌───────────┐ ┌────────────┐ ┌───────┐│
│  │ Elements  │ │Collections │ │Selector││
│  │  Helper   │ │  Helper    │ │ Helper ││
│  └───────────┘ └────────────┘ └───────┘│
│                                         │
│  [isReady]  [getStats]  [configure]     │
│  [clearAll] [destroyAll] [version]      │
│                                         │
└─────────────────────────────────────────┘
```

- Each **helper** is like a separate system in the building (lighting, heating, security)
- Each system works independently — you can control lights without touching heating
- But the **control panel** lets you manage all systems from one place
- You can check the status of everything, reset everything, or configure everything — all without walking to each system individually

---

## How Does It Work?

When the DOM Helpers library loads, here's what happens behind the scenes:

```
Library loads
   ↓
1️⃣ Creates Elements helper → exposed as global `Elements`
   ↓
2️⃣ Creates Collections helper → exposed as global `Collections`
   ↓
3️⃣ Creates Selector helper → exposed as global `Selector`
   ↓
4️⃣ Creates DOMHelpers object that references all three
   ↓
5️⃣ Attaches createElement enhancement
   ↓
6️⃣ Exposes DOMHelpers as a global
   ↓
✨ Everything is ready!
```

The `DOMHelpers` object doesn't *create* the helpers — they already exist as globals. Instead, it **holds references** to them and adds convenience methods that operate across all helpers at once.

---

## What's Inside DOMHelpers?

Here's a complete overview of everything available on the `DOMHelpers` object:

### Properties (Access Helpers)

| Property | What It Is | Same As |
|----------|-----------|---------|
| `DOMHelpers.Elements` | The Elements helper | `window.Elements` |
| `DOMHelpers.Collections` | The Collections helper | `window.Collections` |
| `DOMHelpers.Selector` | The Selector helper | `window.Selector` |
| `DOMHelpers.createElement` | Enhanced createElement | `window.createElement` |
| `DOMHelpers.version` | Library version string | — |

### Methods (Manage the Library)

| Method | What It Does |
|--------|-------------|
| `DOMHelpers.isReady()` | Checks if all helpers loaded successfully |
| `DOMHelpers.getStats()` | Returns combined cache statistics from all helpers |
| `DOMHelpers.clearAll()` | Clears all caches across all helpers |
| `DOMHelpers.destroyAll()` | Destroys all helpers and cleans up resources |
| `DOMHelpers.configure(options)` | Configures all helpers with one options object |
| `DOMHelpers.enableCreateElementEnhancement()` | Turns on the enhanced `document.createElement` |
| `DOMHelpers.disableCreateElementEnhancement()` | Restores the original `document.createElement` |

---

## Quick Comparison: Direct Globals vs DOMHelpers

You can always use the helpers directly — they're globals too:

```javascript
// ✅ Both approaches work — they reference the same helpers

// Using globals directly
Elements.myButton;
Collections.ClassName.btn;
Selector.query('#header');

// Using DOMHelpers
DOMHelpers.Elements.myButton;
DOMHelpers.Collections.ClassName.btn;
DOMHelpers.Selector.query('#header');
```

**When to use which?**

| Approach | Best For |
|----------|---------|
| Direct globals (`Elements`, `Collections`, `Selector`) | Day-to-day element access and updates — shorter, faster to type |
| `DOMHelpers` object | Library management — checking readiness, stats, clearing caches, configuring |

**Key Insight:** Use direct globals for working *with* elements. Use `DOMHelpers` for managing the *library itself*.

---

## A Real-World Example: App Initialization

Here's how you might use `DOMHelpers` in a real application:

```javascript
// App startup
function initApp() {
  // Step 1: Check if the library is ready
  if (!DOMHelpers.isReady()) {
    console.error('DOM Helpers failed to load!');
    return;
  }

  // Step 2: Configure for development
  DOMHelpers.configure({
    enableLogging: true
  });

  // Step 3: Log the version
  console.log(`DOM Helpers v${DOMHelpers.version} loaded`);

  // Step 4: Start using helpers normally
  Elements.header.update({ textContent: 'Welcome!' });
  Collections.ClassName.btn.update({
    style: { cursor: 'pointer' }
  });
}

// App shutdown
function cleanupApp() {
  // One call cleans up everything
  DOMHelpers.destroyAll();
}

// Run
initApp();
window.addEventListener('beforeunload', cleanupApp);
```

**What's happening here:**
- `isReady()` confirms the library loaded correctly before any code runs
- `configure()` turns on logging for all helpers with a single call
- `version` identifies which version is running
- `destroyAll()` handles cleanup for the entire library in one call

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | `DOMHelpers` is the central hub of the entire library |
| **Why** | One object to manage, configure, and inspect all helpers |
| **Access** | `DOMHelpers.Elements`, `.Collections`, `.Selector`, `.createElement` |
| **Manage** | `.isReady()`, `.getStats()`, `.clearAll()`, `.destroyAll()`, `.configure()` |
| **When to use** | Library management tasks — not day-to-day element access |

> **Simple Rule to Remember:** Use `Elements`, `Collections`, and `Selector` directly to *work with the DOM*. Use `DOMHelpers` to *manage the library*.