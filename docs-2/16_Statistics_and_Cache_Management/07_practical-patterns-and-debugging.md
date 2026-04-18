[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Practical Patterns and Debugging Guide

## Quick Start (30 seconds)

```javascript
// Turn on logging for debugging
DOMHelpers.configure({ enableLogging: true });

// Check what's in the cache
console.log(Elements.stats());

// Force fresh lookups
Elements.clear();

// Turn off logging when done
DOMHelpers.configure({ enableLogging: false });
```

---

## Debugging: "My Element Seems Stale"

If an element isn't showing the expected content after a DOM change, the cache might be returning an old reference.

### Step 1: Check the Stats

```javascript
const stats = Elements.stats();
console.log('Cache size:', stats.cacheSize);
console.log('Hit rate:', (stats.hitRate * 100).toFixed(1) + '%');
```

### Step 2: Enable Logging

```javascript
Elements.configure({ enableLogging: true });

// Now try accessing the element
const el = Elements.header;
console.log('Element:', el);
console.log('In DOM?', document.contains(el));
```

### Step 3: Clear and Retry

```javascript
Elements.clear();
const el = Elements.header;
console.log('Fresh element:', el);
// If this returns the correct element, it was a stale cache issue
```

### Step 4: Turn Off Logging

```javascript
Elements.configure({ enableLogging: false });
```

---

## Debugging: "Element Returns null"

If a helper returns `null` when you expect an element:

```javascript
// 1. Check if the element exists in the DOM
console.log(document.getElementById('myElement'));
// If this is null → the element doesn't exist yet (or has a different ID)

// 2. Check spelling — IDs are case-sensitive
Elements.mybutton;   // ❌ Won't match <div id="myButton">
Elements.myButton;   // ✅ Correct case

// 3. Check timing — is the element loaded yet?
Elements.waitFor('myButton').then(result => {
  console.log('Found:', result.myButton);
}).catch(err => {
  console.error('Element never appeared:', err.message);
});
```

---

## Debugging: "Collections Returns Empty"

```javascript
// 1. Check if elements with that class exist
console.log(document.getElementsByClassName('btn'));
// If this is empty → no elements have class "btn"

// 2. Clear the collections cache
Collections.clear();
const buttons = Collections.ClassName.btn;
console.log('Count:', buttons.length);

// 3. Enable logging to see what's happening
Collections.configure({ enableLogging: true });
Collections.ClassName.btn;
```

---

## Pattern: Development Debug Panel

Create a simple debug function you can call from the browser console:

```javascript
function dhDebug() {
  if (!DOMHelpers.isReady()) {
    console.error('DOMHelpers is not ready');
    return;
  }

  console.log(`DOM Helpers v${DOMHelpers.version}`);
  console.log('');

  const stats = DOMHelpers.getStats();

  // Elements
  const e = stats.elements;
  console.log(`Elements:    ${e.hits} hits, ${e.misses} misses, ` +
              `${(e.hitRate * 100).toFixed(1)}% rate, ${e.cacheSize} cached`);

  // Collections
  const c = stats.collections;
  console.log(`Collections: ${c.hits} hits, ${c.misses} misses, ` +
              `${(c.hitRate * 100).toFixed(1)}% rate, ${c.cacheSize} cached`);

  // Selector
  const s = stats.selector;
  console.log(`Selector:    ${s.hits} hits, ${s.misses} misses, ` +
              `${(s.hitRate * 100).toFixed(1)}% rate, ${s.cacheSize} cached`);

  // Totals
  const totalHits = e.hits + c.hits + s.hits;
  const totalMisses = e.misses + c.misses + s.misses;
  const total = totalHits + totalMisses;
  console.log('');
  console.log(`Total: ${total} lookups, ` +
              `${total > 0 ? (totalHits / total * 100).toFixed(1) : 0}% overall hit rate`);
}

// Call from browser console anytime:
dhDebug();
```

---

## Pattern: Performance Monitor

Track cache performance over time during development:

```javascript
function startMonitoring(intervalMs = 10000) {
  console.log('Monitoring started...');

  const timer = setInterval(() => {
    const stats = DOMHelpers.getStats();
    const e = stats.elements;
    const time = new Date().toLocaleTimeString();

    console.log(`[${time}] Elements: ${e.cacheSize} cached, ` +
                `${(e.hitRate * 100).toFixed(1)}% hit rate`);
  }, intervalMs);

  // Return stop function
  return () => {
    clearInterval(timer);
    console.log('Monitoring stopped');
  };
}

// Start
const stopMonitor = startMonitoring(5000);  // Every 5 seconds

// Stop when done
stopMonitor();
```

---

## Pattern: Before/After Major DOM Changes

```javascript
function replaceContent(containerId, newHTML) {
  // Before: Check current state
  const beforeSize = Elements.stats().cacheSize;

  // Replace content
  document.getElementById(containerId).innerHTML = newHTML;

  // After: Clear affected caches
  DOMHelpers.clearAll();

  const afterSize = Elements.stats().cacheSize;
  console.log(`Cache: ${beforeSize} → ${afterSize} entries`);
}
```

---

## Pattern: Environment-Aware Setup

```javascript
function setupDOMHelpers() {
  const isDev = location.hostname === 'localhost'
             || location.hostname === '127.0.0.1';

  if (isDev) {
    DOMHelpers.configure({
      enableLogging: true,
      cleanupInterval: 10000
    });
    console.log(`DOM Helpers v${DOMHelpers.version} [DEV MODE]`);
  } else {
    DOMHelpers.configure({
      enableLogging: false,
      cleanupInterval: 60000,
      maxCacheSize: 2000
    });
  }
}

setupDOMHelpers();
```

---

## Pattern: Safe App Lifecycle

```javascript
// ─── STARTUP ───
document.addEventListener('DOMContentLoaded', () => {
  if (!DOMHelpers.isReady()) {
    console.error('DOM Helpers failed to load');
    return;
  }

  DOMHelpers.configure({ enableLogging: false });
  initializeUI();
});

// ─── RUNTIME ───
function initializeUI() {
  Elements.header.update({ textContent: 'Welcome' });
  Collections.ClassName.btn.update({ disabled: false });
}

function onAjaxContentLoaded() {
  DOMHelpers.clearAll();
  // Re-access elements (fresh lookups)
}

// ─── SHUTDOWN ───
// Automatic — the library handles this on page unload
```

---

## Common Questions

### "How do I know if caching is actually helping?"

Check the hit rate:

```javascript
const stats = Elements.stats();
if (stats.hitRate > 0.7) {
  console.log('Caching is working well!');
} else if (stats.hits + stats.misses < 10) {
  console.log('Not enough data yet — keep using the app');
} else {
  console.log('Low hit rate — DOM may be changing frequently');
}
```

### "Should I ever disable auto-cleanup?"

Rarely. The auto-cleanup uses very little CPU and prevents memory leaks. The only reason to disable it is if you're doing precise performance benchmarking and want to eliminate all background activity.

### "What's the ideal maxCacheSize?"

It depends on your app:

| App Type | Suggested maxCacheSize |
|----------|----------------------|
| Small widget (10-20 elements) | `50` |
| Medium app (50-100 elements) | `500` |
| Large app (hundreds of elements) | `1000` (default) |
| Very large SPA | `2000–5000` |

### "Do I need to call .clear() after every DOM change?"

No. The MutationObserver handles this automatically. Only call `.clear()` when you've made **wholesale replacements** (like replacing the entire `innerHTML` of a container) where the observer might not catch every change efficiently.

---

## Quick Reference: All Cache Management Methods

```
Per Helper:
├── .stats()                  View cache performance
├── .clear()                  Empty the cache (helper keeps running)
├── .destroy()                Full shutdown (helper stops)
└── .configure(options)       Change settings

Via DOMHelpers:
├── DOMHelpers.getStats()     Combined stats from all helpers
├── DOMHelpers.clearAll()     Clear all caches at once
├── DOMHelpers.destroyAll()   Destroy all helpers at once
└── DOMHelpers.configure()    Configure all helpers at once

Configuration Options:
├── enableLogging             Console output (default: false)
├── autoCleanup               Periodic cleanup (default: true)
├── cleanupInterval           Cleanup frequency in ms (default: 30000)
├── maxCacheSize              Max cached items (default: 1000)
├── debounceDelay             Mutation debounce in ms (default: 16)
├── enableEnhancedSyntax      Dot-notation access (default: true, Collections/Selector)
└── enableSmartCaching        MutationObserver caching (default: true, Selector only)
```

---

## Summary

| Task | How |
|------|-----|
| Check performance | `Elements.stats()` or `DOMHelpers.getStats()` |
| Debug stale elements | Enable logging → clear cache → retry |
| Refresh after DOM change | `DOMHelpers.clearAll()` |
| Monitor over time | Periodic `stats()` polling |
| Configure for dev | `{ enableLogging: true, cleanupInterval: 10000 }` |
| Configure for prod | `{ enableLogging: false, cleanupInterval: 60000 }` |
| Full shutdown | `DOMHelpers.destroyAll()` (automatic on page unload) |