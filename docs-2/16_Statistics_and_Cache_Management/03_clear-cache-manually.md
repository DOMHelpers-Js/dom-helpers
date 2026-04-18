[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# .clear() — Clearing the Cache Manually

## Quick Start (30 seconds)

```javascript
// Clear a specific helper's cache
Elements.clear();
Collections.clear();
Selector.clear();

// Or clear all caches at once
DOMHelpers.clearAll();
```

---

## What is .clear()?

`.clear()` **empties the helper's cache completely**. Every stored element reference is removed. The next time you access any element, the library will query the DOM fresh and rebuild its cache from scratch.

Simply put, it's a **reset button** for the cache — without turning off the helper.

---

## Syntax

```javascript
Elements.clear()       // Clears the Elements cache
Collections.clear()    // Clears the Collections cache
Selector.clear()       // Clears the Selector cache
```

**Parameters:** None

**Returns:** `undefined`

---

## Why Would You Clear the Cache?

The cache works automatically in most situations. The MutationObserver and cleanup timer handle stale entries behind the scenes. However, there are a few scenarios where a manual clear is useful:

### Scenario 1: Major DOM Replacement

```javascript
// You replaced a large section of the page
document.getElementById('app').innerHTML = newHTML;

// The cache might have references to old elements
// Clear it to ensure fresh lookups
Elements.clear();
```

### Scenario 2: After AJAX Content Load

```javascript
async function loadContent(url) {
  const response = await fetch(url);
  const html = await response.text();
  document.getElementById('content').innerHTML = html;

  // Old cached elements are gone — clear the cache
  Collections.clear();
  Selector.clear();
}
```

### Scenario 3: Debugging Stale References

```javascript
// Something seems wrong — an element isn't updating?
// Clear the cache to rule out stale references
Elements.clear();

// Now try again with a fresh lookup
Elements.header.update({ textContent: 'Fixed!' });
```

---

## How Does It Work?

```
Elements.clear()
   ↓
Cache (Map) → .clear()  →  All entries removed
   ↓
cacheSize counter → reset to 0
   ↓
MutationObserver → still running (watches for DOM changes)
   ↓
Cleanup timer → still running (scheduled cleanups continue)
   ↓
Helper → fully operational (rebuilds cache on next access)
```

### What Gets Cleared

| Cleared | Details |
|---------|---------|
| ✅ Cache entries | All stored element/collection references are removed |
| ✅ Cache size counter | Reset to 0 |

### What Does NOT Get Cleared

| Kept | Details |
|------|---------|
| ✅ MutationObserver | Keeps watching for DOM changes |
| ✅ Cleanup timer | Keeps running on schedule |
| ✅ Configuration | All settings remain unchanged |
| ✅ Stats counters | `hits` and `misses` are NOT reset |

---

### Selector-Specific: Extra Cleanup

The Selector helper clears one additional thing — the **selector type tracking**:

```javascript
// Before clear
Selector.stats().selectorBreakdown;
// { id: 10, class: 12, tag: 5 }

Selector.clear();

// After clear — selector tracking is also reset
Selector.stats().selectorBreakdown;
// {}
```

---

## What Happens After clear()?

After clearing, the cache is empty. The next access triggers a fresh DOM query:

```javascript
// Before clear — cache has entries
Elements.stats().cacheSize;  // 8

// Access is a cache hit (fast)
Elements.header;  // → returned from cache

// Clear the cache
Elements.clear();
Elements.stats().cacheSize;  // 0

// Next access is a cache miss (DOM query)
Elements.header;  // → queried from DOM, then cached
Elements.stats().cacheSize;  // 1

// Subsequent access is a cache hit again
Elements.header;  // → returned from cache
Elements.stats().cacheSize;  // 1
```

```
Before clear:   header ──→ cache ──→ instant return
                                     (hit)

After clear:    header ──→ cache empty ──→ DOM query ──→ cache it ──→ return
                                          (miss)

Next access:    header ──→ cache ──→ instant return
                                     (hit again)
```

---

## Basic Usage

### Example 1: Clear After DOM Changes

```javascript
// A function that replaces page content
function switchPage(newContent) {
  document.getElementById('main').innerHTML = newContent;

  // Clear all stale references
  Elements.clear();
  Collections.clear();
  Selector.clear();

  // Now access fresh elements
  Elements.pageTitle.update({ textContent: 'New Page' });
}
```

---

### Example 2: Clear a Single Helper

```javascript
// If only class-based elements changed, clear only Collections
function onClassesChanged() {
  Collections.clear();
  // Elements and Selector caches remain intact
}
```

---

### Example 3: Clear All at Once

```javascript
// Use DOMHelpers.clearAll() to clear everything in one call
function onMajorUpdate() {
  DOMHelpers.clearAll();
  // Same as calling .clear() on all three helpers
}
```

---

### Example 4: Verify the Clear

```javascript
// Check cache before and after
console.log('Before:', Elements.stats().cacheSize);  // Before: 12

Elements.clear();

console.log('After:', Elements.stats().cacheSize);    // After: 0
```

---

## When NOT to Clear the Cache

In most cases, you **don't need to call `.clear()` manually**. The library manages the cache automatically:

- **MutationObserver** detects when elements are added, removed, or changed and invalidates the relevant cache entries
- **Cleanup timer** periodically scans for stale entries and removes them
- **Max cache size** automatically evicts the oldest entries when the limit is reached

**Clear manually only when:**
- You replace large sections of HTML at once (e.g., `innerHTML` replacement)
- You're debugging and want to rule out stale cache issues
- You're building a single-page app with major content transitions

---

## clear() vs destroy()

| Aspect | `.clear()` | `.destroy()` |
|--------|-----------|-------------|
| Cache | Emptied | Emptied |
| MutationObserver | Running | Stopped |
| Cleanup timer | Running | Stopped |
| Helper works after? | ✅ Yes | ❌ No |
| Use case | Refresh the cache | Shut down the helper |

```javascript
// ✅ Use clear() when you want to keep using the helper
Elements.clear();
Elements.header;  // Works — queries DOM fresh

// ❌ Don't use destroy() unless you're done with the helper
Elements.destroy();
Elements.header;  // Caching and observers are shut down
```

---

## Summary

| Aspect | Detail |
|--------|--------|
| **What** | Empties the helper's cache completely |
| **When to use** | After major DOM replacements, debugging, content transitions |
| **What stays** | MutationObserver, cleanup timer, configuration, stats counters |
| **What resets** | Cache entries, cache size counter (and selector tracking for Selector) |
| **Helper still works?** | ✅ Yes — rebuilds cache on next access |

> **Simple Rule to Remember:** `.clear()` is a safe reset. The helper keeps working — it just starts with an empty cache and rebuilds as you use it. Use it when you've made big DOM changes and want guaranteed fresh lookups.