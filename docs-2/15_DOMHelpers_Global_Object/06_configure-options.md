[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# DOMHelpers.configure() — Configuring All Helpers

## Quick Start (30 seconds)

```javascript
// Configure all helpers at once
DOMHelpers.configure({
  enableLogging: true,
  maxCacheSize: 500
});

// Or configure each helper differently
DOMHelpers.configure({
  elements:    { enableLogging: true, maxCacheSize: 200 },
  collections: { enableLogging: false, maxCacheSize: 300 },
  selector:    { enableLogging: true, enableSmartCaching: true }
});
```

---

## What is DOMHelpers.configure()?

`DOMHelpers.configure()` lets you **change configuration options for all helpers with a single call**. Instead of configuring each helper one by one, you pass one options object and every helper gets updated.

Simply put, it's the **settings panel** for the entire library.

---

## Syntax

```javascript
// Apply the same options to all helpers
DOMHelpers.configure(options);

// Apply different options per helper
DOMHelpers.configure({
  elements:    { /* Elements-specific options */ },
  collections: { /* Collections-specific options */ },
  selector:    { /* Selector-specific options */ }
});
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `options` | Object | Configuration options to apply |

**Returns:** The `DOMHelpers` object itself (for chaining).

---

## Why Does This Exist?

### The Situation Without Central Configuration

Without `configure()`, you'd set options on each helper separately:

```javascript
// Turning on logging for all helpers — three calls
Elements.configure({ enableLogging: true });
Collections.configure({ enableLogging: true });
Selector.configure({ enableLogging: true });
```

- ❌ Three separate calls for one goal
- ❌ Easy to miss one helper
- ❌ Repetitive

### The configure() Way

```javascript
// One call does it all
DOMHelpers.configure({ enableLogging: true });
```

✅ **One call** applies to all helpers
✅ **Nothing forgotten** — every helper is configured
✅ **Chainable** — returns `DOMHelpers` for further calls

---

## How Does It Work?

### When You Pass a Flat Options Object

```
DOMHelpers.configure({ enableLogging: true, maxCacheSize: 500 })
   ↓
Calls Elements.configure({ enableLogging: true, maxCacheSize: 500 })
   ↓
Calls Collections.configure({ enableLogging: true, maxCacheSize: 500 })
   ↓
Calls Selector.configure({ enableLogging: true, maxCacheSize: 500 })
   ↓
Returns DOMHelpers (for chaining)
```

When you pass a flat object (no `elements`, `collections`, or `selector` keys), the **same options** are applied to **all three helpers**.

### When You Pass a Per-Helper Options Object

```
DOMHelpers.configure({
  elements:    { enableLogging: true },
  collections: { maxCacheSize: 500 },
  selector:    { enableSmartCaching: false }
})
   ↓
Calls Elements.configure({ enableLogging: true })
   ↓
Calls Collections.configure({ maxCacheSize: 500 })
   ↓
Calls Selector.configure({ enableSmartCaching: false })
   ↓
Returns DOMHelpers (for chaining)
```

When your object has `elements`, `collections`, or `selector` keys, each helper gets its **own specific options**.

---

## Available Configuration Options

Here are all the options you can set, and which helpers support them:

### Common Options (All Helpers)

| Option | Type | Default | What It Does |
|--------|------|---------|-------------|
| `enableLogging` | Boolean | `false` | Turns on console logging for cache hits, misses, cleanups |
| `autoCleanup` | Boolean | `true` | Enables automatic periodic cache cleanup |
| `cleanupInterval` | Number (ms) | `30000` | How often automatic cleanup runs (in milliseconds) |
| `maxCacheSize` | Number | `1000` | Maximum number of items in the cache |
| `debounceDelay` | Number (ms) | `16` | Delay before processing DOM mutations (in milliseconds) |

### Collections-Specific Options

| Option | Type | Default | What It Does |
|--------|------|---------|-------------|
| `enableEnhancedSyntax` | Boolean | `true` | Enables proxy-based property access on collections |

### Selector-Specific Options

| Option | Type | Default | What It Does |
|--------|------|---------|-------------|
| `enableSmartCaching` | Boolean | `true` | Enables MutationObserver-based cache invalidation |
| `enableEnhancedSyntax` | Boolean | `true` | Enables proxy-based property access (`Selector.query.myId`) |

---

## Basic Usage

### Example 1: Enable Logging for Debugging

```javascript
// Turn on logging to see what the library is doing
DOMHelpers.configure({ enableLogging: true });

// Now when you access elements, you'll see console messages:
Elements.header;
// Console: [Elements] Cache miss for 'header'

Elements.header;
// Console: (no message — cache hit, silent)

// Turn it off when done debugging
DOMHelpers.configure({ enableLogging: false });
```

**What's happening here:**
- Setting `enableLogging: true` makes all helpers print messages to the console
- Cache misses, cleanups, and warnings all become visible
- This is useful during development to understand how the caching behaves
- Set it back to `false` for production to keep the console clean

---

### Example 2: Adjust Cache Size

```javascript
// For a small app with few elements — reduce cache size
DOMHelpers.configure({ maxCacheSize: 100 });

// For a large app with many elements — increase cache size
DOMHelpers.configure({ maxCacheSize: 5000 });
```

**What's happening here:**
- `maxCacheSize` controls how many items each helper keeps in its cache
- When the cache is full, the oldest entry is removed to make room (FIFO eviction)
- Smaller cache = less memory, but more DOM queries
- Larger cache = more memory, but faster lookups

---

### Example 3: Change Cleanup Frequency

```javascript
// Clean up stale cache entries more often (every 10 seconds)
DOMHelpers.configure({ cleanupInterval: 10000 });

// Or less often (every 2 minutes) for a stable page
DOMHelpers.configure({ cleanupInterval: 120000 });
```

**What's happening here:**
- The library automatically scans its caches for stale entries (elements no longer in the DOM)
- `cleanupInterval` controls how often this scan happens
- Faster cleanup = fresher cache, but slightly more CPU usage
- Slower cleanup = less CPU, but stale entries linger longer

---

### Example 4: Configure Helpers Differently

```javascript
// Different settings for different helpers
DOMHelpers.configure({
  elements: {
    enableLogging: true,     // Log Elements activity
    maxCacheSize: 200        // Smaller cache for IDs
  },
  collections: {
    enableLogging: false,    // Keep Collections quiet
    maxCacheSize: 100        // Even smaller for collections
  },
  selector: {
    enableLogging: true,     // Log Selector activity
    maxCacheSize: 500,       // Larger cache for selectors
    enableSmartCaching: true // Keep smart caching on
  }
});
```

**What's happening here:**
- Each helper gets its own tailored configuration
- `Elements` and `Selector` have logging turned on, but `Collections` doesn't
- Each helper has a different cache size suited to its usage pattern

---

### Example 5: Chaining with Other Methods

```javascript
// configure() returns DOMHelpers, so you can chain
DOMHelpers
  .configure({ enableLogging: true })
  .clearAll();

console.log(`v${DOMHelpers.version} configured and caches cleared`);
```

**What's happening here:**
- `configure()` returns the `DOMHelpers` object, so you can immediately call another method
- Here we configure logging and then clear all caches in one statement

---

## Understanding Each Option in Detail

### enableLogging

```javascript
DOMHelpers.configure({ enableLogging: true });
```

When enabled, helpers print messages to the console:

| Event | Example Console Output |
|-------|----------------------|
| Cache miss | `[Elements] Element with id 'header' not found` |
| Cleanup | `[Elements] Cleanup completed. Removed 3 stale entries.` |
| Cache cleared | `[Elements] Cache cleared manually` |
| Cache invalidation | `[Collections] Invalidated 2 cache entries due to DOM changes` |

> **Tip:** Keep logging **off** in production. It adds unnecessary console output and can slightly impact performance.

---

### autoCleanup

```javascript
// Disable automatic cleanup
DOMHelpers.configure({ autoCleanup: false });
```

When `autoCleanup` is `true` (the default), each helper periodically scans its cache and removes entries for elements that no longer exist in the DOM.

```
autoCleanup: true
   ↓
Every 30 seconds (default):
   ↓
Scan cache → Find stale entries → Remove them
   ↓
Repeat
```

When `autoCleanup` is `false`, stale entries stay in the cache until you manually call `clearAll()` or the `maxCacheSize` is reached and old entries are evicted.

---

### debounceDelay

```javascript
DOMHelpers.configure({ debounceDelay: 50 });
```

The library uses MutationObservers to watch for DOM changes. When elements are added, removed, or their attributes change, the observer triggers.

But DOM changes can happen rapidly (hundreds per second during animations). The `debounceDelay` groups these rapid changes and processes them once:

```
DOM change → DOM change → DOM change → DOM change
                                           ↓
                                  (wait 16ms of quiet)
                                           ↓
                                  Process all changes once
```

- Lower delay = faster response to DOM changes, but more processing
- Higher delay = less processing, but cache updates lag behind

The default of `16ms` (one animation frame) is well-suited for most applications.

---

## Real-World Configuration Patterns

### Development Configuration

```javascript
// During development — maximum visibility
DOMHelpers.configure({
  enableLogging: true,
  cleanupInterval: 10000  // Clean up more often to catch issues
});
```

### Production Configuration

```javascript
// In production — optimized for performance
DOMHelpers.configure({
  enableLogging: false,
  autoCleanup: true,
  cleanupInterval: 60000,  // Less frequent cleanup
  maxCacheSize: 2000       // Larger cache for better hit rates
});
```

### Memory-Constrained Configuration

```javascript
// On devices with limited memory
DOMHelpers.configure({
  maxCacheSize: 50,         // Very small cache
  cleanupInterval: 15000    // Frequent cleanup
});
```

---

## Summary

| Aspect | Detail |
|--------|--------|
| **What** | Configures all helpers with one call |
| **Syntax** | `DOMHelpers.configure(options)` |
| **Flat options** | Applied to all three helpers equally |
| **Per-helper options** | Use `{ elements: {...}, collections: {...}, selector: {...} }` |
| **Returns** | `DOMHelpers` (chainable) |
| **Key options** | `enableLogging`, `autoCleanup`, `cleanupInterval`, `maxCacheSize`, `debounceDelay` |

> **Simple Rule to Remember:** Pass a flat object to configure **all helpers the same way**. Pass an object with `elements`, `collections`, and `selector` keys to configure **each helper differently**.