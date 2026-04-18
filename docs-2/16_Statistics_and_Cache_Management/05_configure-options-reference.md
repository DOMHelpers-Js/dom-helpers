[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# .configure() — Configuration Options Reference

## Quick Start (30 seconds)

```javascript
// Change settings on any helper
Elements.configure({ enableLogging: true });
Collections.configure({ maxCacheSize: 500 });
Selector.configure({ enableSmartCaching: true });

// Or configure all helpers at once
DOMHelpers.configure({ enableLogging: true });
```

---

## What is .configure()?

`.configure()` lets you **change how a helper behaves at runtime**. You can turn logging on or off, adjust cache size limits, change cleanup frequency, and toggle enhanced features — all without reloading the page.

Simply put, it's the **settings dial** for each helper.

---

## Syntax

```javascript
// Configure a specific helper
Elements.configure(options)        // Returns Elements
Collections.configure(options)     // Returns Collections
Selector.configure(options)        // Returns Selector

// Configure all helpers at once
DOMHelpers.configure(options)      // Returns DOMHelpers
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `options` | Object | Key-value pairs of settings to change |

**Returns:** The helper itself (for chaining).

---

## Complete Options Reference

### Options Available on All Helpers

```javascript
{
  enableLogging: false,       // Turn console logging on/off
  autoCleanup: true,          // Enable/disable automatic cache cleanup
  cleanupInterval: 30000,     // Milliseconds between cleanup runs
  maxCacheSize: 1000,         // Maximum number of cached items
  debounceDelay: 16           // Milliseconds to debounce mutation processing
}
```

| Option | Type | Default | What It Controls |
|--------|------|---------|-----------------|
| `enableLogging` | Boolean | `false` | Whether the helper prints messages to the console |
| `autoCleanup` | Boolean | `true` | Whether stale cache entries are removed automatically |
| `cleanupInterval` | Number (ms) | `30000` | How often the cleanup timer runs (in milliseconds) |
| `maxCacheSize` | Number | `1000` | Maximum items the cache can hold before evicting old entries |
| `debounceDelay` | Number (ms) | `16` | How long to wait before processing batched DOM mutations |

### Collections-Specific Options

```javascript
{
  enableEnhancedSyntax: true   // Enable proxy-based property access
}
```

| Option | Type | Default | What It Controls |
|--------|------|---------|-----------------|
| `enableEnhancedSyntax` | Boolean | `true` | Enables `Collections.ClassName.btn` dot-notation access and proxy features on collections |

### Selector-Specific Options

```javascript
{
  enableEnhancedSyntax: true,  // Enable proxy-based property access
  enableSmartCaching: true     // Enable MutationObserver-based cache invalidation
}
```

| Option | Type | Default | What It Controls |
|--------|------|---------|-----------------|
| `enableEnhancedSyntax` | Boolean | `true` | Enables `Selector.query.myElement` dot-notation access |
| `enableSmartCaching` | Boolean | `true` | Enables the MutationObserver that watches for DOM changes and invalidates stale cache entries |

---

## Each Option Explained

### enableLogging

Controls whether the helper prints messages to the browser console.

```javascript
// Turn logging on
Elements.configure({ enableLogging: true });

Elements.header;
// Console: (nothing on cache hit — silent)

Elements.nonExistentElement;
// Console: [Elements] Element with id 'nonExistentElement' not found

Elements.clear();
// Console: [Elements] Cache cleared manually
```

```javascript
// Turn logging off (default)
Elements.configure({ enableLogging: false });
// No console messages — completely silent
```

**When to enable:**
- During development, to see cache behavior
- When debugging stale references or missing elements
- When monitoring cleanup activity

**When to disable:**
- In production — keeps the console clean
- When performance matters — avoids `console.log` overhead

---

### autoCleanup

Controls whether the helper automatically scans for and removes stale cache entries.

```javascript
// Disable automatic cleanup
Elements.configure({ autoCleanup: false });
// The cache will only be cleaned when you call .clear() manually
// or when maxCacheSize is reached and old entries are evicted

// Enable automatic cleanup (default)
Elements.configure({ autoCleanup: true });
// Every cleanupInterval milliseconds, the helper scans its cache
// and removes entries pointing to elements no longer in the DOM
```

**How auto-cleanup works:**

```
Every 30 seconds (default):
   ↓
Scan each cache entry:
   ├── Is the element still in the DOM?
   │   ├── Yes → Keep it
   │   └── No  → Remove it (stale entry)
   ↓
Done. Stale entries removed.
```

---

### cleanupInterval

Controls how often the automatic cleanup runs (in milliseconds).

```javascript
// Clean up every 10 seconds (more aggressive)
Elements.configure({ cleanupInterval: 10000 });

// Clean up every 2 minutes (more relaxed)
Elements.configure({ cleanupInterval: 120000 });

// Default: 30 seconds
Elements.configure({ cleanupInterval: 30000 });
```

| Value | Behavior |
|-------|----------|
| `10000` (10s) | More frequent scans — cache stays very fresh, slightly more CPU |
| `30000` (30s) | Default — good balance between freshness and efficiency |
| `60000` (60s) | Less frequent — suitable for stable pages that don't change much |
| `120000` (2min) | Rare scans — for very stable, long-running apps |

---

### maxCacheSize

Controls the maximum number of items the cache can hold.

```javascript
// Small cache (50 items)
Elements.configure({ maxCacheSize: 50 });

// Large cache (5000 items)
Elements.configure({ maxCacheSize: 5000 });

// Default: 1000 items
Elements.configure({ maxCacheSize: 1000 });
```

When the cache is full and a new item needs to be added, the **oldest entry is removed** (FIFO eviction):

```
Cache (maxCacheSize: 3):
  ["header", "footer", "sidebar"]

New access: Elements.nav
   ↓
Cache is full — evict oldest ("header")
   ↓
Cache: ["footer", "sidebar", "nav"]
```

| Value | Tradeoff |
|-------|----------|
| Small (50–100) | Less memory, but more cache misses (more DOM queries) |
| Medium (500–1000) | Good balance — default is fine for most apps |
| Large (2000–5000) | More memory, but fewer cache misses (faster lookups) |

---

### debounceDelay

Controls how long the helper waits before processing DOM mutation events.

```javascript
// Faster response (8ms)
Elements.configure({ debounceDelay: 8 });

// Slower response (50ms) — fewer processing cycles
Elements.configure({ debounceDelay: 50 });

// Default: 16ms (one animation frame)
Elements.configure({ debounceDelay: 16 });
```

The MutationObserver fires every time the DOM changes. During animations or rapid updates, mutations can fire hundreds of times per second. The `debounceDelay` groups these rapid-fire events:

```
Mutation → Mutation → Mutation → Mutation → Mutation
                                                ↓
                                  (wait 16ms of quiet)
                                                ↓
                                  Process all changes once
```

| Value | Behavior |
|-------|----------|
| `8` (8ms) | Very responsive — processes changes quickly, but uses more CPU |
| `16` (16ms) | Default — aligned with 60fps animation frame timing |
| `50` (50ms) | Relaxed — groups more changes together, uses less CPU |

---

### enableEnhancedSyntax (Collections & Selector)

Controls whether proxy-based dot-notation access is enabled.

```javascript
// With enhanced syntax ON (default)
Collections.ClassName.btn;        // ✅ Works
Selector.query.myElement;         // ✅ Works

// With enhanced syntax OFF
Collections.configure({ enableEnhancedSyntax: false });
Collections.ClassName('btn');     // ✅ Still works (function call)
Collections.ClassName.btn;        // May not work as expected

Selector.configure({ enableEnhancedSyntax: false });
Selector.query('#myElement');     // ✅ Still works (function call)
Selector.query.myElement;         // Won't work
```

**When to disable:**
- If you're debugging proxy-related issues
- If enhanced syntax conflicts with other code

Collections and Selector also have dedicated methods for this:

```javascript
// These do the same thing as configure
Collections.enableEnhancedSyntax();
Collections.disableEnhancedSyntax();

Selector.enableEnhancedSyntax();
Selector.disableEnhancedSyntax();
```

---

### enableSmartCaching (Selector Only)

Controls whether the Selector helper uses a MutationObserver to automatically invalidate cache entries.

```javascript
// With smart caching ON (default)
Selector.configure({ enableSmartCaching: true });
// Cache entries are automatically invalidated when the DOM changes

// With smart caching OFF
Selector.configure({ enableSmartCaching: false });
// Cache entries stay until maxCacheSize eviction or manual .clear()
```

**When to disable:**
- If your app has very frequent DOM changes and the constant invalidation hurts performance
- If you want to control cache clearing manually

---

## Practical Configuration Examples

### Development Mode

```javascript
Elements.configure({
  enableLogging: true,
  cleanupInterval: 10000
});
```

### Production Mode

```javascript
DOMHelpers.configure({
  enableLogging: false,
  autoCleanup: true,
  cleanupInterval: 60000,
  maxCacheSize: 2000
});
```

### Large App with Many Elements

```javascript
DOMHelpers.configure({
  maxCacheSize: 5000,
  cleanupInterval: 60000
});
```

### Small Widget with Few Elements

```javascript
DOMHelpers.configure({
  maxCacheSize: 50,
  cleanupInterval: 15000
});
```

---

## Chaining

`.configure()` returns the helper, so you can chain:

```javascript
// Configure and use immediately
Elements
  .configure({ enableLogging: true })
  .clear();

// Chain on DOMHelpers
DOMHelpers
  .configure({ enableLogging: true })
  .clearAll();
```

---

## How configure() Works Internally

When you call `.configure()`, the new options are **merged** into the existing options using `Object.assign`:

```
Elements.configure({ enableLogging: true, maxCacheSize: 500 })
   ↓
Object.assign(existingOptions, { enableLogging: true, maxCacheSize: 500 })
   ↓
Result:
{
  enableLogging: true,       ← changed
  autoCleanup: true,         ← unchanged (kept from before)
  cleanupInterval: 30000,    ← unchanged
  maxCacheSize: 500,         ← changed
  debounceDelay: 16          ← unchanged
}
```

**Key Insight:** You only need to pass the options you want to **change**. Everything else stays as it was.

---

## Summary

| Option | Default | What It Does | Available On |
|--------|---------|-------------|-------------|
| `enableLogging` | `false` | Console output for debugging | All helpers |
| `autoCleanup` | `true` | Automatic stale entry removal | All helpers |
| `cleanupInterval` | `30000` | Cleanup frequency (ms) | All helpers |
| `maxCacheSize` | `1000` | Maximum cached items | All helpers |
| `debounceDelay` | `16` | Mutation processing delay (ms) | All helpers |
| `enableEnhancedSyntax` | `true` | Proxy dot-notation access | Collections, Selector |
| `enableSmartCaching` | `true` | MutationObserver cache invalidation | Selector |

> **Simple Rule to Remember:** Pass only the options you want to change — everything else stays at its current value. Use `DOMHelpers.configure()` to apply the same settings to all helpers at once.