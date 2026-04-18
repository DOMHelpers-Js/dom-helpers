[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Utility Methods — configure(), stats(), clear(), destroy()

These four methods handle the **maintenance and configuration** of the Elements helper itself. You won't use them for everyday element access — but they're important for performance monitoring, lifecycle management, and customizing behavior for your specific use case.

---

## Quick Start (30 Seconds)

```javascript
// Configure Elements behavior at app startup
Elements.configure({
  enableLogging:   true,   // Log cache operations (great for debugging)
  cleanupInterval: 30000   // Clean up stale cache entries every 30 seconds
});

// Check how the cache is performing
const stats = Elements.stats();
console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
console.log(`Cached:   ${stats.cacheSize} elements`);

// Clear the cache when you replace large sections of the DOM
Elements.clear();

// Clean up all resources when your app unmounts
Elements.destroy();
```

Four methods with clear, specific purposes:
- `configure()` — set options before you start using Elements
- `stats()` — see how the cache is performing
- `clear()` — flush the cache
- `destroy()` — full cleanup when you're done

---

## What Are Utility Methods?

These methods operate on the **Elements helper itself** rather than on specific DOM elements. Think of them as the control panel for the caching and observation system that makes Elements work.

| Method | Purpose | When to Use |
|--------|---------|-------------|
| `Elements.configure(options)` | Customize Elements behavior | Once at app startup |
| `Elements.stats()` | Get cache performance data | Development, monitoring |
| `Elements.clear()` | Remove all cached elements | After major DOM changes |
| `Elements.destroy()` | Full cleanup, stop all observers | App teardown |

---

## Mental Model — The "Office Building" Analogy

Imagine the Elements cache as an office building:

- **`configure()`** — setting up the building before employees arrive (work hours, security settings, cleaning schedule)
- **`stats()`** — checking the building's status report (occupancy, how many times the door opened, visitor traffic)
- **`clear()`** — clearing out a floor to rearrange the layout (all desks removed, ready for new furniture)
- **`destroy()`** — shutting down the whole building (lights off, security disabled, everyone out)

You set things up once (`configure`), check in occasionally (`stats`), clear out when needed (`clear`), and shut down properly when done (`destroy`).

---

## Elements.configure()

Customize how the Elements helper behaves. Call this **once at app startup** before you start accessing elements.

### Syntax

```javascript
Elements.configure(options);
```

### Configuration Options

```javascript
Elements.configure({
  enableLogging:   false,  // Log cache hits/misses to console (default: false)
  autoCleanup:     true,   // Periodically check and remove stale entries (default: true)
  cleanupInterval: 30000,  // How often to run cleanup, in ms (default: 30000 = 30s)
  maxCacheSize:    1000,   // Maximum number of elements to cache (default: 1000)
  observeDOM:      true,   // Watch DOM for changes with MutationObserver (default: true)
  enhanceElements: true    // Auto-attach .update() to accessed elements (default: true)
});
```

### Option Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableLogging` | boolean | `false` | Logs every cache hit and miss to the console |
| `autoCleanup` | boolean | `true` | Runs periodic validation to remove stale entries |
| `cleanupInterval` | number | `30000` | Milliseconds between cleanup runs |
| `maxCacheSize` | number | `1000` | Prevents the cache from growing too large |
| `observeDOM` | boolean | `true` | Uses `MutationObserver` to detect DOM changes |
| `enhanceElements` | boolean | `true` | Auto-attaches `.update()` to every accessed element |

### Example 1: Development vs. Production Settings

A very common pattern is configuring Elements differently based on the environment:

```javascript
// Detect development mode (adapt this to your framework's approach)
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  // Development — verbose logging, frequent cleanup
  Elements.configure({
    enableLogging:   true,   // See every cache operation in the console
    cleanupInterval: 10000   // Clean up every 10 seconds (more frequent for debugging)
  });
} else {
  // Production — no logging, optimized cleanup
  Elements.configure({
    enableLogging:   false,  // No console output
    cleanupInterval: 60000   // Clean up every 60 seconds (less frequent)
  });
}
```

**What does `enableLogging: true` show?**

```javascript
// With enableLogging: true
const button = Elements.submitBtn;
// Console output: [Elements] Cache miss: submitBtn
// Console output: [Elements] Cached: submitBtn

const button2 = Elements.submitBtn;
// Console output: [Elements] Cache hit: submitBtn
```

This is very useful for debugging — you can see exactly what's happening with your cache.

---

### Example 2: Test Environment

Unit tests need predictable behavior — no background timers, no DOM observers:

```javascript
// In your test setup file (e.g., jest.setup.js)
beforeAll(() => {
  Elements.configure({
    enableLogging:   false, // Keep test output clean
    autoCleanup:     false, // No background timers during tests
    observeDOM:      false  // No MutationObserver in test environment
  });
});

afterAll(() => {
  Elements.destroy(); // Full cleanup after all tests
});

// Between each test, clear the cache for a fresh state
beforeEach(() => {
  Elements.clear();
});
```

---

### Example 3: Device-Aware Configuration

Configure Elements based on device characteristics for optimal performance:

```javascript
function configureForDevice() {
  const isMobile = /Mobile|Android|iPhone/i.test(navigator.userAgent);
  const isLowMemory = navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;

  Elements.configure({
    // More frequent cleanup on mobile (less memory available)
    cleanupInterval: isMobile ? 15000 : 30000,

    // Smaller cache on low-memory devices
    maxCacheSize: isLowMemory ? 200 : 1000,

    // Log only in development
    enableLogging: window.location.hostname === 'localhost'
  });

  console.log(`Elements configured for ${isMobile ? 'mobile' : 'desktop'}`);
}

// Call once at startup
configureForDevice();
```

---

### When to Call configure()

```javascript
// ✅ Call once at the very start of your app — before any element access
document.addEventListener('DOMContentLoaded', () => {
  // Configure first
  Elements.configure({ enableLogging: true });

  // Then use Elements normally
  const header = Elements.header;
  initializePage();
});

// ❌ Don't reconfigure inside functions that run repeatedly
function handleButtonClick() {
  Elements.configure({ enableLogging: true }); // Called every click — wrong!
  const button = Elements.submitBtn;
  button.disabled = true;
}
```

---

## Elements.stats()

Returns a snapshot of the cache's current performance and state.

### Syntax

```javascript
const stats = Elements.stats();
```

### The Stats Object

```javascript
const stats = Elements.stats();

console.log(stats);
/*
{
  hits:        150,          // Number of times an element was served from cache
  misses:      25,           // Number of times we had to query the DOM
  cacheSize:   18,           // Number of elements currently in the cache
  hitRate:     0.857,        // Cache efficiency (hits / total accesses)
  uptime:      45000,        // Milliseconds since the last cache cleanup
  lastCleanup: 1708123456789 // Timestamp of the last cleanup run
}
*/
```

### Understanding Each Stat

**`hits`** — How many element accesses were served from cache (fast path):
```javascript
// Each of these increments hits
const btn1 = Elements.submitBtn; // miss (first access)
const btn2 = Elements.submitBtn; // hit
const btn3 = Elements.submitBtn; // hit
// stats.hits → 2, stats.misses → 1
```

**`misses`** — How many element accesses required a DOM query (slower):
```javascript
// First access to any element is a miss
const header = Elements.pageHeader; // miss — not cached yet
const nav    = Elements.mainNav;    // miss — not cached yet
const footer = Elements.footer;     // miss — not cached yet
// stats.misses → 3
```

**`cacheSize`** — Number of elements currently stored in the cache:
```javascript
const stats = Elements.stats();
console.log(`${stats.cacheSize} elements are cached`);
// "18 elements are cached"
```

**`hitRate`** — The ratio of cache hits to total accesses (0 to 1):
```javascript
// hitRate of 0.857 means 85.7% of accesses came from cache
// hitRate of 1.0 means everything came from cache (perfect)
// hitRate of 0.0 means nothing is cached (elements keep changing)
const efficiency = (stats.hitRate * 100).toFixed(1);
console.log(`Cache efficiency: ${efficiency}%`);
// "Cache efficiency: 85.7%"
```

**`uptime`** and **`lastCleanup`** — Timing information about cleanup runs.

### Example 1: Performance Health Check

```javascript
function checkCacheHealth() {
  const stats = Elements.stats();
  const total = stats.hits + stats.misses;
  const hitPct = (stats.hitRate * 100).toFixed(1);

  console.log('=== Elements Cache Health Report ===');
  console.log(`Total accesses:  ${total}`);
  console.log(`From cache:      ${stats.hits} (${hitPct}%)`);
  console.log(`From DOM:        ${stats.misses}`);
  console.log(`Currently cached: ${stats.cacheSize} elements`);

  if (stats.hitRate > 0.8) {
    console.log('✅ Cache performance: Excellent');
  } else if (stats.hitRate > 0.5) {
    console.log('⚠️  Cache performance: Moderate — elements may be recreated frequently');
  } else if (total > 10) {
    console.log('❌ Cache performance: Poor — check if elements are being replaced frequently');
  } else {
    console.log('ℹ️  Not enough accesses yet to judge performance');
  }

  return stats;
}

// Run on demand
checkCacheHealth();
```

---

### Example 2: Development Monitoring

Log cache stats periodically during development to spot issues early:

```javascript
// Only run this in development
if (process.env.NODE_ENV === 'development') {
  // Log cache stats every 30 seconds
  setInterval(() => {
    const stats = Elements.stats();

    if (stats.hits + stats.misses > 0) { // Only log if we've made accesses
      console.log('[Elements] Cache stats:', {
        hitRate:    `${(stats.hitRate * 100).toFixed(1)}%`,
        cacheSize:  stats.cacheSize,
        accesses:   stats.hits + stats.misses
      });
    }
  }, 30000);
}
```

---

### Example 3: Stats in Testing

```javascript
describe('Cache behavior', () => {
  beforeEach(() => {
    Elements.clear(); // Fresh cache before each test
    document.body.innerHTML = '<button id="testBtn">Test</button>';
  });

  it('records a miss on first access', () => {
    const btn = Elements.testBtn; // First access = miss

    const stats = Elements.stats();
    expect(stats.misses).toBe(1);
    expect(stats.hits).toBe(0);
    expect(stats.cacheSize).toBe(1);
  });

  it('records a hit on second access', () => {
    const btn1 = Elements.testBtn; // miss
    const btn2 = Elements.testBtn; // hit

    const stats = Elements.stats();
    expect(stats.misses).toBe(1);
    expect(stats.hits).toBe(1);
    expect(btn1).toBe(btn2); // Same object reference
  });

  it('has perfect hit rate after first access', () => {
    const btn1 = Elements.testBtn; // miss

    // 9 more accesses — all hits
    for (let i = 0; i < 9; i++) {
      Elements.testBtn;
    }

    const stats = Elements.stats();
    expect(stats.hitRate).toBeCloseTo(0.9); // 9 hits out of 10 total
  });
});
```

---

## Elements.clear()

Clears all elements from the cache. The next access to any element will query the DOM again.

### Syntax

```javascript
Elements.clear();
```

### When to Use It

The cache updates itself automatically via `MutationObserver` — you rarely need to call `clear()` manually. Use it when:

✅ **You replace a large section of the DOM** (e.g., `document.body.innerHTML = newHTML`) — the cache may hold references to old elements that no longer exist
✅ **A SPA navigates to a new route** that completely replaces the page content
✅ **You're writing tests** and need a clean cache state between tests
✅ **Debugging** — force all elements to be re-fetched from the DOM

❌ **Don't use it** just to "refresh" elements you've updated — the cache stores live references. Updating an element in the DOM updates it everywhere, including the cached reference.

### Example 1: SPA Route Navigation

```javascript
class Router {
  async navigateTo(route) {
    // Load new page HTML
    const html = await fetchPageHTML(route);

    // Replace all page content — old cached elements are now gone from DOM
    document.getElementById('app').innerHTML = html;

    // Clear the cache — old references are stale now
    Elements.clear();

    // Initialize the new page — fresh elements will be cached as needed
    await initializePage(route);
  }
}

const router = new Router();
router.navigateTo('/settings');
```

---

### Example 2: Complete DOM Rebuild

```javascript
function rebuildInterface(template) {
  console.log('Rebuilding interface...');

  // Replace the entire DOM with new content
  document.body.innerHTML = ''; // All old elements gone
  document.body.appendChild(buildFromTemplate(template));

  // Clear stale cache entries — all old element references are invalid
  Elements.clear();

  // Verify the cache is empty
  const stats = Elements.stats();
  console.log(`Cache cleared. Size: ${stats.cacheSize}`); // → "Cache cleared. Size: 0"

  // Re-initialize with the new structure
  initializeInterface();
}
```

---

### Example 3: What Happens After clear()

```javascript
// Access an element — it gets cached
const btn = Elements.submitBtn;         // Cache miss
const isCached = Elements.isCached('submitBtn');
console.log(isCached); // → true

// Clear the cache
Elements.clear();

const isCachedAfter = Elements.isCached('submitBtn');
console.log(isCachedAfter); // → false (removed from cache)

// Next access will query the DOM again
const btn2 = Elements.submitBtn;        // Cache miss again
console.log(btn === btn2);             // true (same DOM element, just re-fetched)
```

**Important:** `clear()` removes entries from the cache, but it doesn't remove or change elements in the DOM. The elements themselves are unaffected.

---

### clear() vs. destroy()

```javascript
// clear() — removes cached entries, keeps everything running
Elements.clear();
// After: cache is empty, MutationObserver still watching, helper still functional
// You can keep using Elements normally

// destroy() — full shutdown, removes everything
Elements.destroy();
// After: cache cleared, MutationObserver stopped, interval stopped
// The helper is no longer functional — only use at app teardown
```

---

## Elements.destroy()

Completely shuts down the Elements helper — clears the cache, stops the `MutationObserver`, and cancels all background timers.

### Syntax

```javascript
Elements.destroy();
```

### What It Does

```
Elements.destroy()
       ↓
  1. Clear the element cache (all cached entries removed)
  2. Disconnect the MutationObserver (stops watching DOM changes)
  3. Cancel the cleanup interval (no more background timers)
  4. Remove event listeners (if any)
  5. Free all resources
```

After calling `destroy()`, the Elements helper is no longer operational. Don't call `Elements.{id}` after destroying — call `configure()` to reinitialize if you need to restart.

### When to Use It

✅ **App teardown** — when your application is shutting down or unmounting
✅ **Test cleanup** — in `afterAll()` or `afterEach()` to ensure no state leaks between test suites
✅ **SPA unmounting** — when a major component that owns Elements needs to clean up
✅ **Memory management** — freeing resources in long-running applications

❌ **Don't use** just to clear the cache — use `clear()` instead
❌ **Don't use** in the middle of normal operation

### Example 1: Application Lifecycle

```javascript
class Application {
  constructor() {
    this.isRunning = false;
  }

  start() {
    console.log('Application starting...');

    // Configure Elements helper for this app
    Elements.configure({
      enableLogging: process.env.NODE_ENV === 'development',
      cleanupInterval: 30000
    });

    // Initialize the UI
    this.setupUI();
    this.isRunning = true;

    console.log('✅ Application started');
  }

  setupUI() {
    const { header, main, footer } = Elements.getRequired('header', 'main', 'footer');
    setupHeader(header);
    loadContent(main);
    setupFooter(footer);
  }

  stop() {
    if (!this.isRunning) return;

    console.log('Application shutting down...');

    // Log final performance stats before shutting down
    const stats = Elements.stats();
    console.log(`Final cache performance: ${(stats.hitRate * 100).toFixed(1)}% hit rate`);

    // Clean up the Elements helper
    Elements.destroy();

    this.isRunning = false;
    console.log('✅ Application stopped, resources freed');
  }
}

const app = new Application();
app.start();

// Listen for page unload
window.addEventListener('beforeunload', () => {
  app.stop();
});
```

---

### Example 2: Test Suite Cleanup

```javascript
// Good test setup — fresh state for each test
describe('My Application Tests', () => {

  beforeAll(() => {
    // Configure for testing — no background timers
    Elements.configure({
      enableLogging: false,
      autoCleanup:   false,
      observeDOM:    false
    });
  });

  beforeEach(() => {
    // Set up a fresh DOM
    document.body.innerHTML = `
      <header id="header"></header>
      <main id="main"></main>
      <footer id="footer"></footer>
    `;
    // Clear cache for each test
    Elements.clear();
  });

  afterAll(() => {
    // Full cleanup after all tests in this suite
    Elements.destroy();
    document.body.innerHTML = '';
  });

  it('can access the header', () => {
    const header = Elements.header;
    expect(header).not.toBeNull();
    expect(header.tagName).toBe('HEADER');
  });

  it('caches elements after first access', () => {
    Elements.header; // Access once

    const stats = Elements.stats();
    expect(stats.cacheSize).toBe(1);
    expect(stats.misses).toBe(1);
  });
});
```

---

### Example 3: React/Framework Integration

When using the Elements helper inside a component-based framework:

```javascript
// React example
import { useEffect } from 'react';

function MyApp() {
  useEffect(() => {
    // Initialize Elements when app mounts
    Elements.configure({
      enableLogging: process.env.NODE_ENV === 'development'
    });

    console.log('Elements initialized');

    // Cleanup function — runs when component unmounts
    return () => {
      Elements.destroy();
      console.log('Elements destroyed');
    };
  }, []); // Empty array = run once on mount

  return <div id="app">...</div>;
}
```

---

## The Complete Lifecycle

Here's how all four utility methods fit together in a typical application:

```
App Startup
  ↓
Elements.configure({ enableLogging: true, ... })
  ↓
Normal operation — Elements.{id}, .get(), .waitFor(), etc.
  ↓
Periodically: Elements.stats()  → check performance
  ↓
Major DOM change: Elements.clear() → flush stale cache
  ↓
Back to normal operation
  ↓
App Teardown
  ↓
Elements.destroy() → full cleanup
```

---

## Complete Manager Example

Here's a pattern that wraps all utility methods into a manager class for clean lifecycle management:

```javascript
class ElementsLifecycleManager {
  constructor(config = {}) {
    this.config = {
      enableLogging:   process.env.NODE_ENV === 'development',
      cleanupInterval: 30000,
      ...config
    };

    this._monitorInterval = null;
    this.isActive = false;
  }

  start() {
    // Configure the Elements helper
    Elements.configure(this.config);
    this.isActive = true;

    // Start monitoring if logging is on
    if (this.config.enableLogging) {
      this._startMonitoring();
    }

    console.log('✅ Elements helper initialized');
    return this;
  }

  _startMonitoring() {
    this._monitorInterval = setInterval(() => {
      const stats = Elements.stats();
      const total = stats.hits + stats.misses;

      if (total > 0) {
        console.log('[Elements Monitor]', {
          hitRate:  `${(stats.hitRate * 100).toFixed(1)}%`,
          cached:   stats.cacheSize,
          accesses: total
        });
      }
    }, 15000);
  }

  flushCache(reason = 'manual') {
    Elements.clear();
    console.log(`Cache cleared (reason: ${reason})`);
    return this;
  }

  getReport() {
    const stats = Elements.stats();
    return {
      status:      this.isActive ? 'active' : 'destroyed',
      hitRate:     `${(stats.hitRate * 100).toFixed(1)}%`,
      rating:      stats.hitRate > 0.8 ? '✅ Excellent' :
                   stats.hitRate > 0.5 ? '⚠️ Good' : '❌ Poor',
      cacheSize:   stats.cacheSize,
      totalAccesses: stats.hits + stats.misses
    };
  }

  destroy() {
    if (!this.isActive) return;

    // Log final report
    console.log('[Elements] Final report:', this.getReport());

    // Stop our monitor
    if (this._monitorInterval) {
      clearInterval(this._monitorInterval);
      this._monitorInterval = null;
    }

    // Destroy the Elements helper
    Elements.destroy();
    this.isActive = false;

    console.log('✅ Elements helper destroyed');
  }
}

// Usage
const elementsManager = new ElementsLifecycleManager({
  enableLogging: true,
  cleanupInterval: 20000
});

elementsManager.start();

// After a SPA navigation
elementsManager.flushCache('route-change');

// Before app teardown
console.log(elementsManager.getReport());
elementsManager.destroy();
```

---

## Best Practices — Summary

### configure()
✅ Call once at startup, before any element access
✅ Use different settings for development vs. production
✅ In tests: disable `autoCleanup` and `observeDOM` to prevent background timers

### stats()
✅ Use during development to monitor cache efficiency
✅ Use in tests to verify caching behavior
✅ Great for periodic health checks in long-running apps
❌ Don't use `stats()` output to make runtime decisions — it's for monitoring

### clear()
✅ Use after replacing large sections of the DOM
✅ Use in tests between test cases for a clean slate
❌ Don't use in normal element access patterns — the cache handles itself
❌ Don't call inside frequently-running functions

### destroy()
✅ Call on app teardown / component unmount
✅ Call in `afterAll()` in test suites
❌ Don't call `Elements.{id}` after destroying — initialize again with `configure()`
❌ Don't use as a substitute for `clear()` during normal operation

---

## Quick Reference

```javascript
// ⚙️ CONFIGURE — once at startup
Elements.configure({
  enableLogging:   false,
  autoCleanup:     true,
  cleanupInterval: 30000,
  maxCacheSize:    1000,
  observeDOM:      true,
  enhanceElements: true
});

// 📊 STATS — check performance
const stats = Elements.stats();
// → { hits, misses, cacheSize, hitRate, uptime, lastCleanup }

// 🗑️ CLEAR — flush cache (keep helper running)
Elements.clear();
// → Cache empty, helper still active

// 💀 DESTROY — full shutdown
Elements.destroy();
// → Cache cleared, observer stopped, all resources freed
```

---

## Summary — Key Takeaways

1. **`configure()`** sets up the Elements helper. Call it once at startup with settings appropriate for your environment (different for dev, prod, and testing).

2. **`stats()`** gives you visibility into cache performance. Use it during development and in tests. A `hitRate` above 0.8 (80%) means the cache is working well.

3. **`clear()`** empties the cache but keeps the helper running. Use it after major DOM restructuring when old cached references would be stale.

4. **`destroy()`** is the full shutdown — it clears the cache and stops all background processes. Use it on app teardown or component unmount.

5. **The cache manages itself** via `MutationObserver` — in most apps, you'll call `configure()` once and `destroy()` once, and rarely touch `clear()` or `stats()` outside of development and testing.

---

**You've completed the Elements Access Methods documentation!**

Here's what you've learned across all 10 files:

✅ `01` — Overview: The Elements helper, caching, and the Proxy system
✅ `02` — `Elements.{id}`: Direct access, the primary method
✅ `03` — `get()` and `exists()`: Safe access with fallbacks
✅ `04` — `isCached()` and `stats()`: Cache debugging tools
✅ `05` — `destructure()` and `getMultiple()`: Batch element access
✅ `06` — `getRequired()`: Fail-fast access for critical elements
✅ `07` — `waitFor()`: Async waiting for dynamic content
✅ `08` — Best practices: Choosing the right method for every situation
✅ `09` — `setProperty()`, `getProperty()`, `setAttribute()`, `getAttribute()`
✅ `10` — `configure()`, `stats()`, `clear()`, `destroy()`: Utility and lifecycle

Go build something great!