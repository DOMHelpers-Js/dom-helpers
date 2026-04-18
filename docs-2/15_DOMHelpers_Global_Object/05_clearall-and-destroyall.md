[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# DOMHelpers.clearAll() and DOMHelpers.destroyAll()

## Quick Start (30 seconds)

```javascript
// Clear all caches — helpers keep working
DOMHelpers.clearAll();

// Destroy everything — full cleanup, helpers stop working
DOMHelpers.destroyAll();
```

---

## What Are clearAll() and destroyAll()?

These are two **cleanup methods** that operate across all helpers at once.

| Method | What It Does | Helpers Still Work? |
|--------|-------------|---------------------|
| `clearAll()` | Empties all caches | ✅ Yes — they rebuild caches as needed |
| `destroyAll()` | Shuts down all helpers completely | ❌ No — helpers stop working |

Think of it this way:

- **`clearAll()`** is like clearing your browser history — the browser still works, it just has to reload things fresh
- **`destroyAll()`** is like closing the browser entirely — it stops running and releases all resources

---

## Syntax

```javascript
DOMHelpers.clearAll()       // returns undefined
DOMHelpers.destroyAll()     // returns undefined
```

**Parameters:** None for either method.

**Returns:** Neither method returns a value.

---

## Why Do These Exist?

### The Situation Without Central Cleanup

Without these methods, cleaning up requires calling each helper separately:

```javascript
// Clearing all caches — three separate calls
Elements.clear();
Collections.clear();
Selector.clear();

// Or destroying everything — three separate calls
Elements.destroy();
Collections.destroy();
Selector.destroy();
```

- ❌ Three calls every time
- ❌ Easy to forget one
- ❌ No guarantee you cleaned everything

### The DOMHelpers Way

```javascript
// One call clears everything
DOMHelpers.clearAll();

// One call destroys everything
DOMHelpers.destroyAll();
```

✅ **One call** handles all helpers
✅ **Nothing forgotten** — every helper is cleaned up
✅ **Clean, readable** code

---

## How Do They Work?

### clearAll() Flow

```
DOMHelpers.clearAll()
   ↓
Calls Elements.clear()
   → Empties the Elements cache (Map)
   → Resets cache size counter
   ↓
Calls Collections.clear()
   → Empties the Collections cache (Map)
   → Resets cache size counter
   ↓
Calls Selector.clear()
   → Empties the Selector cache (Map)
   → Resets cache size counter and selector type tracking
   ↓
Done. All caches empty, all helpers still active.
```

After `clearAll()`, the next time you access any element, it will be fetched fresh from the DOM and cached again. The helpers, MutationObservers, and cleanup timers all keep running normally.

---

### destroyAll() Flow

```
DOMHelpers.destroyAll()
   ↓
Calls Elements.destroy()
   → Sets isDestroyed = true
   → Disconnects MutationObserver
   → Clears cleanup timer
   → Empties cache
   ↓
Calls Collections.destroy()
   → Sets isDestroyed = true
   → Disconnects MutationObserver
   → Clears cleanup timer
   → Empties cache
   ↓
Calls Selector.destroy()
   → Sets isDestroyed = true
   → Disconnects MutationObserver
   → Clears cleanup timer
   → Empties cache
   ↓
Done. All helpers are shut down completely.
```

After `destroyAll()`, the helpers **stop working**. MutationObservers are disconnected, timers are cleared, and caches are emptied. This is a full shutdown.

---

## DOMHelpers.clearAll() — Deep Dive

### What Gets Cleared?

When you call `clearAll()`, each helper's **cache** is emptied:

```
Before clearAll():
┌─────────────────────────────────┐
│ Elements cache:                 │
│   "header"  → <div id="header"> │
│   "footer"  → <div id="footer"> │
│   "sidebar" → <div id="sidebar">│
├─────────────────────────────────┤
│ Collections cache:              │
│   "className:btn"  → [3 buttons]│
│   "tagName:p"      → [5 paragraphs]│
├─────────────────────────────────┤
│ Selector cache:                 │
│   "single:#header" → <div>      │
│   "multiple:.card" → [4 cards]  │
└─────────────────────────────────┘

After clearAll():
┌─────────────────────────────────┐
│ Elements cache:     (empty)     │
├─────────────────────────────────┤
│ Collections cache:  (empty)     │
├─────────────────────────────────┤
│ Selector cache:     (empty)     │
└─────────────────────────────────┘
```

### What Does NOT Get Cleared?

- ✅ MutationObservers **keep running** — they'll cache new elements as they appear
- ✅ Cleanup timers **keep running** — automatic cleanup continues
- ✅ Configuration options **stay the same** — nothing is reconfigured
- ✅ The helpers **still work** — next access just queries the DOM fresh

---

### Example 1: Force Fresh Lookups

```javascript
// You've made big DOM changes and want to ensure fresh results
function onMajorDOMChange() {
  // Clear all cached elements/collections
  DOMHelpers.clearAll();

  // Now all lookups will query the DOM fresh
  const header = Elements.header;     // Fresh DOM query
  const buttons = Collections.ClassName.btn;  // Fresh DOM query
}
```

**What's happening here:**
- After a major DOM change (like loading new HTML content), cached references might point to old elements
- `clearAll()` forces every next lookup to go straight to the DOM
- The results get cached again automatically

---

### Example 2: After Dynamic Content Load

```javascript
// After an AJAX call replaces page content
async function loadNewPage(url) {
  const response = await fetch(url);
  const html = await response.text();

  // Replace page content
  document.getElementById('app').innerHTML = html;

  // Clear stale cache entries
  DOMHelpers.clearAll();

  // Now safely access new elements
  Elements.newHeader.update({ textContent: 'New Page Loaded!' });
}
```

**What's happening here:**
- We replaced the page content with new HTML
- The old cached elements no longer exist in the DOM
- `clearAll()` ensures the library doesn't return stale references
- New lookups find the fresh elements

---

### Example 3: Periodic Cache Reset

```javascript
// Reset caches every 5 minutes in a long-running app
setInterval(() => {
  DOMHelpers.clearAll();
  console.log('Caches cleared — fresh start');
}, 5 * 60 * 1000);
```

**What's happening here:**
- In a long-running single-page application, caches can grow large
- Periodic clearing keeps memory usage reasonable
- The library automatically rebuilds the cache as elements are accessed

> **Note:** The library already has **automatic cleanup** via MutationObserver and scheduled cleanup timers. You typically don't need manual periodic clearing. This is just an option for specific scenarios.

---

## DOMHelpers.destroyAll() — Deep Dive

### What Gets Destroyed?

`destroyAll()` performs a **complete shutdown** of every helper:

| Resource | What Happens |
|----------|-------------|
| **Cache** | Emptied completely |
| **MutationObserver** | Disconnected — stops watching for DOM changes |
| **Cleanup timer** | Cleared — stops scheduled cache cleanup |
| **isDestroyed flag** | Set to `true` — helper knows it's shut down |

---

### Example 1: App Shutdown Cleanup

```javascript
// Clean shutdown when the app is done
function shutdownApp() {
  // Save any pending data
  saveUserData();

  // Clean up DOM Helpers
  DOMHelpers.destroyAll();

  console.log('App shut down cleanly');
}
```

**What's happening here:**
- When your application is shutting down, you want to release all resources
- `destroyAll()` disconnects all MutationObservers, clears all timers, and empties all caches
- This prevents memory leaks and unnecessary background processing

---

### Example 2: Single-Page App Route Change

```javascript
// If your SPA completely tears down a section
function unloadSection() {
  // Destroy helpers for this section
  DOMHelpers.destroyAll();

  // Remove the section's DOM
  document.getElementById('section').remove();
}
```

---

### Example 3: Automatic Cleanup on Page Unload

The library already does this automatically:

```javascript
// This is built into the library — you don't need to add it
window.addEventListener('beforeunload', () => {
  DOMHelpers.destroyAll();
});
```

**Key Insight:** The library automatically calls `destroyAll()` when the page unloads. You only need to call it manually if you're doing a mid-session cleanup (like unloading a major section of your app).

---

## clearAll() vs destroyAll() — When to Use Which

```
                  clearAll()                    destroyAll()
                ┌────────────┐               ┌──────────────┐
  Caches:       │  Emptied   │               │   Emptied    │
  Observers:    │  Running   │               │  Stopped     │
  Timers:       │  Running   │               │  Stopped     │
  Helpers work? │   ✅ Yes   │               │   ❌ No      │
  Use case:     │  Refresh   │               │  Shutdown    │
                └────────────┘               └──────────────┘
```

| Scenario | Use |
|----------|-----|
| DOM content was replaced, need fresh lookups | `clearAll()` |
| Cache is getting large, want a fresh start | `clearAll()` |
| App is shutting down | `destroyAll()` |
| Unmounting a major section in an SPA | `destroyAll()` |
| Debugging stale cache issues | `clearAll()` |
| Memory leak investigation | `destroyAll()` |

---

## Common Pitfall: Using Helpers After destroyAll()

```javascript
// ❌ Don't do this — helpers won't work after destroyAll()
DOMHelpers.destroyAll();
Elements.header.update({ textContent: 'Hello' });  // Won't work properly!

// ✅ Use clearAll() if you still need the helpers
DOMHelpers.clearAll();
Elements.header.update({ textContent: 'Hello' });  // Works fine!
```

**Why?** After `destroyAll()`, the MutationObservers are disconnected and the internal `isDestroyed` flag is set to `true`. The helpers won't process new mutations or schedule cleanups. While basic lookups may still technically query the DOM, the caching and auto-cleanup systems are shut down.

---

## Summary

| Method | What It Does | Helpers Still Work? | When to Use |
|--------|-------------|---------------------|-------------|
| `clearAll()` | Empties all caches | ✅ Yes | Refresh caches after DOM changes |
| `destroyAll()` | Full shutdown — caches, observers, timers | ❌ No | App shutdown or section teardown |

> **Simple Rule to Remember:** `clearAll()` is a **refresh** — the library keeps running with empty caches. `destroyAll()` is a **shutdown** — the library stops working entirely.