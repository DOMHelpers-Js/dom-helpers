[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Helper Methods — Cache Management and Configuration

## Quick Start (30 Seconds)

```javascript
// Check how the cache is performing
const stats = Selector.stats();
console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
console.log(`${stats.cacheSize} queries cached`);

// Clear cache after major DOM changes
Selector.clear();

// Configure for development — enable logging
Selector.configure({
  enableLogging: true,
  maxCacheSize: 200
});

// Clean up resources when done (SPA teardown)
Selector.destroy();
```

These methods give you visibility into the cache, control over its lifecycle, and the ability to tune performance for your specific application.

---

## What Are Helper Methods?

Helper methods are a set of **operational and configuration tools** for the Selector Helper itself — not for querying or manipulating DOM elements, but for managing the system that powers those queries.

Think of them as the **control panel** for the Selector Helper's engine:

- **`stats()`** — Check the dashboard (cache performance readings)
- **`clear()`** — Reset the cache manually
- **`destroy()`** — Shut down the engine completely
- **`configure()`** — Tune the engine settings
- **`enableEnhancedSyntax()` / `disableEnhancedSyntax()`** — Toggle advanced features

You won't use these on every line of code, but knowing when and how to use them separates good implementations from great ones.

---

## Complete Method Overview

| Method | Purpose | When to Use |
|--------|---------|-------------|
| `stats()` | Get cache statistics | Performance monitoring, debugging |
| `clear()` | Clear all cached queries | After major DOM restructures, SPA navigation |
| `destroy()` | Tear down the helper completely | Application shutdown, SPA cleanup |
| `configure(options)` | Adjust helper settings | App initialization, environment setup |
| `enableEnhancedSyntax()` | Enable property-access syntax | Advanced query style (if supported) |
| `disableEnhancedSyntax()` | Disable property-access syntax | Compatibility, debugging |

---

## Why Do These Exist?

### Cache Management — When You Need Visibility and Control

In scenarios where you need to monitor performance or explicitly control the cache lifecycle (SPA route changes, major DOM rebuilds, testing), these methods give you direct access:

```javascript
// Scenario: After a full page re-render in a SPA
function afterRouteChange() {
  document.getElementById('app').innerHTML = newPageHTML;

  // The old cache entries refer to elements that no longer exist
  // Clear them so next queries are fresh
  Selector.clear();

  initializeNewPage();
}
```

This approach is **great when you need:**
✅ To verify caching is working efficiently in production
✅ To manually reset the cache after programmatic DOM restructuring
✅ To clean up resources when unmounting a component or page

### Configuration — When You Need Environment-Specific Behavior

In scenarios where your development environment needs verbose logging, or production needs a limited cache size, `configure()` lets you adapt the Selector Helper to your needs without changing usage code:

```javascript
// Development — full visibility
if (process.env.NODE_ENV === 'development') {
  Selector.configure({
    enableLogging: true,
    cleanupInterval: 10000
  });
}

// Production — lean and quiet
if (process.env.NODE_ENV === 'production') {
  Selector.configure({
    enableLogging: false,
    maxCacheSize: 500,
    cleanupInterval: 60000
  });
}
```

**Benefits:**
✅ Monitor and tune performance for your specific application
✅ Control cache behavior explicitly when needed
✅ Adapt logging behavior per environment
✅ Safely tear down all resources without memory leaks

---

## Mental Model

Think of these helper methods like the **maintenance tools for a smart search engine**.

Imagine the Selector Helper is a librarian with an excellent memory (the cache). They remember every book you asked for. But:

- **`stats()`** — Ask the librarian: "How often do people ask for books already in your memory?"
- **`clear()`** — Say: "The library has been reorganized — please forget all previous locations."
- **`destroy()`** — The library is closing — the librarian releases all records and goes home.
- **`configure()`** — Set the rules: "Remember up to 500 books max. Write down each request in the log."

---

## `Selector.stats()` — Get Cache Statistics

### What It Does

`stats()` returns an object describing the current performance state of the Selector cache. Use it to understand how efficiently the cache is working.

### Syntax

```javascript
const stats = Selector.stats();
```

**Returns:** An object with cache performance data.

### The Stats Object

```javascript
const stats = Selector.stats();

/*
{
  hits: 312,             // Number of times cache was used (fast path)
  misses: 44,            // Number of times DOM was queried (slow path)
  cacheSize: 18,         // Number of unique selectors currently cached
  hitRate: 0.876,        // hits / (hits + misses) — 0 to 1
  uptime: 180000,        // How long the cache has been running (ms)
  lastCleanup: 1737000   // Timestamp of last automatic cleanup
}
*/
```

### Reading the Stats

```javascript
const stats = Selector.stats();

// Hit rate as a percentage
const hitPercent = (stats.hitRate * 100).toFixed(1);
console.log(`Cache efficiency: ${hitPercent}%`);

// How many DOM queries were saved by caching
const queriesSaved = stats.hits;
console.log(`Queries served from cache: ${queriesSaved}`);

// How many selectors are currently cached
console.log(`Active cache entries: ${stats.cacheSize}`);

// Uptime in seconds
console.log(`Cache running for: ${(stats.uptime / 1000).toFixed(0)}s`);
```

### What's a Good Hit Rate?

```
Hit Rate:
  > 90%  → Excellent — cache is very effective
  70-90% → Good — caching is working well
  50-70% → Fair — consider reviewing query patterns
  < 50%  → Poor — many unique selectors, cache not helping much
```

### Example: Development Monitor

```javascript
function logCacheReport() {
  const stats = Selector.stats();
  const hitPct = (stats.hitRate * 100).toFixed(1);

  console.group('Selector Cache Report');
  console.log(`Hit Rate:     ${hitPct}%`);
  console.log(`Cache Size:   ${stats.cacheSize} entries`);
  console.log(`Cache Hits:   ${stats.hits}`);
  console.log(`Cache Misses: ${stats.misses}`);
  console.log(`Uptime:       ${(stats.uptime / 1000).toFixed(0)}s`);
  console.groupEnd();
}

// Log every 30 seconds in development
if (process.env.NODE_ENV === 'development') {
  setInterval(logCacheReport, 30000);
}
```

---

## `Selector.clear()` — Clear the Cache

### What It Does

`clear()` removes **all cached query results**. The next call to any selector will re-query the DOM fresh.

### Syntax

```javascript
Selector.clear();
```

**Returns:** `undefined`

### When to Use `clear()`

The cache is automatically maintained by `MutationObserver` — so in normal use, you rarely need to call `clear()` manually.

Use it explicitly when:

```
1. SPA Route Change
   → Entire page content replaced
   → Old cache entries reference removed elements

2. Major DOM Restructuring
   → document.body.innerHTML = newHTML
   → Large sections rebuilt programmatically

3. Testing
   → Ensure each test starts with a fresh cache

4. Debugging
   → Suspect cache is returning stale data
```

### Example: SPA Navigation

```javascript
class SPARouter {
  navigate(route) {
    // Clear old page's cache entries
    Selector.clear();

    // Load new page content
    loadPageContent(route);

    // Re-initialize for new page
    initializePage(route);
  }
}
```

### Example: Major DOM Rebuild

```javascript
function rebuildDashboard(newData) {
  // Rebuild the entire dashboard
  Elements.dashboard.innerHTML = renderDashboard(newData);

  // Clear old cache — all old element references are now invalid
  Selector.clear();

  // Re-initialize with fresh queries
  initializeDashboard();
}
```

### What NOT to Do

```javascript
// ❌ Don't clear before every query — defeats the purpose of caching
function updateButton() {
  Selector.clear();  // Unnecessary! Kills performance
  const btn = Selector.query('.btn');
  btn.classList.add('active');
}

// ✅ Let the cache work automatically — only clear when truly needed
function updateButton() {
  const btn = Selector.query('.btn');  // Cache handles this
  btn.classList.add('active');
}
```

---

## `Selector.destroy()` — Clean Up Resources

### What It Does

`destroy()` completely tears down the Selector Helper — disconnects internal observers, clears all cache entries, and releases memory.

### Syntax

```javascript
Selector.destroy();
```

**Returns:** `undefined`

### What Destroy Does Internally

```
Selector.destroy()
         │
         ▼
  1. Clear all cache entries (Map cleared)
  2. Disconnect MutationObserver (stops watching DOM)
  3. Clear all internal timers (cleanup intervals)
  4. Release all internal references
  5. Helper is now in a clean, idle state
```

### When to Use `destroy()`

```javascript
// On application shutdown
window.addEventListener('beforeunload', () => {
  Selector.destroy();
});

// On SPA unmount (if component manages its own lifecycle)
class PageComponent {
  unmount() {
    Selector.destroy();
  }
}

// During testing teardown
afterEach(() => {
  Selector.destroy();
});
```

### Example: Application Lifecycle

```javascript
class App {
  start() {
    Selector.configure({
      enableLogging: process.env.NODE_ENV === 'development',
      maxCacheSize: 300
    });

    this.initialize();
    console.log('Application started');
  }

  shutdown() {
    // Log final stats before destroying
    const stats = Selector.stats();
    console.log(`Final cache efficiency: ${(stats.hitRate * 100).toFixed(1)}%`);

    // Clean up
    Selector.destroy();
    console.log('Application shut down cleanly');
  }
}

const app = new App();
app.start();

window.addEventListener('beforeunload', () => app.shutdown());
```

---

## `Selector.configure()` — Adjust Helper Settings

### What It Does

`configure()` lets you adjust the behavior of the Selector Helper without changing your query code.

### Syntax

```javascript
Selector.configure(options)
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableLogging` | `boolean` | `false` | Log each cache hit/miss to the console |
| `autoCleanup` | `boolean` | `true` | Automatically remove stale cache entries |
| `cleanupInterval` | `number` | `30000` | How often auto-cleanup runs (ms) |
| `maxCacheSize` | `number` | `1000` | Maximum number of cached selectors |
| `enableEnhancedSyntax` | `boolean` | `true` | Enable property-access query syntax |

### What Each Option Does

#### `enableLogging`

```javascript
Selector.configure({ enableLogging: true });

// Now every query logs its outcome
const buttons = Selector.queryAll('.btn');
// Console: [Selector] Cache miss: .btn → 5 elements found
// Console: [Selector] Cached: .btn

const buttons2 = Selector.queryAll('.btn');
// Console: [Selector] Cache hit: .btn
```

Use in development to verify caching is working and see how often DOM queries run.

#### `autoCleanup` and `cleanupInterval`

```javascript
// Clean up stale entries every 60 seconds
Selector.configure({
  autoCleanup: true,
  cleanupInterval: 60000
});

// Disable auto-cleanup (for special scenarios)
Selector.configure({
  autoCleanup: false
});
```

Auto-cleanup removes cache entries for selectors that haven't been accessed recently, preventing the cache from growing unboundedly.

#### `maxCacheSize`

```javascript
// Large app with many unique selectors
Selector.configure({ maxCacheSize: 2000 });

// Memory-constrained environment
Selector.configure({ maxCacheSize: 100 });
```

When the cache reaches `maxCacheSize`, the oldest (least recently used) entries are removed to make room.

### Environment-Based Configuration

```javascript
function configureSelector() {
  const isDev  = process.env.NODE_ENV === 'development';
  const isTest = process.env.NODE_ENV === 'test';

  Selector.configure({
    enableLogging:    isDev,
    cleanupInterval:  isDev ? 10000 : 60000,  // More frequent in dev
    maxCacheSize:     isTest ? 50 : 500,       // Small in tests
    autoCleanup:      !isTest                  // Manual in tests
  });
}

// Call once on app startup
configureSelector();
```

---

## `Selector.enableEnhancedSyntax()` and `Selector.disableEnhancedSyntax()`

### What They Do

These methods toggle an **advanced property-access query mode** (if supported by the implementation). When enabled, you may be able to use property-style access instead of method calls for certain patterns.

### Syntax

```javascript
Selector.enableEnhancedSyntax();   // Enable property-access syntax
Selector.disableEnhancedSyntax();  // Disable and return to standard methods
```

### When to Use `disableEnhancedSyntax()`

```javascript
// Disable when debugging — makes behavior more predictable
Selector.disableEnhancedSyntax();

// Disable for compatibility with proxied objects
Selector.disableEnhancedSyntax();

// Re-enable once done debugging
Selector.enableEnhancedSyntax();
```

The standard query methods (`query()`, `queryAll()`) always work regardless of this setting. Enhanced syntax affects whether additional property-access patterns are supported on top.

---

## Real-World Patterns

### Pattern 1: Application Bootstrap

```javascript
class AppBootstrap {
  static initialize() {
    const isDev = process.env.NODE_ENV === 'development';

    // Configure Selector for this environment
    Selector.configure({
      enableLogging:   isDev,
      cleanupInterval: isDev ? 15000 : 60000,
      maxCacheSize:    isDev ? 200 : 1000
    });

    if (isDev) {
      console.log('[App] Selector configured for development');
    }
  }

  static shutdown() {
    if (process.env.NODE_ENV === 'development') {
      const stats = Selector.stats();
      console.log('[App] Selector final stats:', {
        hitRate:   `${(stats.hitRate * 100).toFixed(1)}%`,
        queries:   stats.hits + stats.misses,
        cacheSize: stats.cacheSize
      });
    }

    Selector.destroy();
  }
}

// App startup
AppBootstrap.initialize();

// App teardown
window.addEventListener('beforeunload', () => AppBootstrap.shutdown());
```

---

### Pattern 2: Performance Monitor

```javascript
class SelectorPerformanceMonitor {
  constructor(reportInterval = 30000) {
    this.interval = null;
    this.reportInterval = reportInterval;
  }

  start() {
    if (process.env.NODE_ENV !== 'development') return;

    this.interval = setInterval(() => this.report(), this.reportInterval);
    console.log('[PerfMonitor] Started — reporting every', this.reportInterval / 1000, 'seconds');
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  report() {
    const stats = Selector.stats();
    const hitPct = (stats.hitRate * 100).toFixed(1);
    const rating = this.rateEfficiency(stats.hitRate);

    console.group('[SelectorPerformanceMonitor] Cache Report');
    console.log(`Hit Rate:    ${hitPct}% — ${rating}`);
    console.log(`Cache Size:  ${stats.cacheSize} entries`);
    console.log(`Hits:        ${stats.hits}`);
    console.log(`Misses:      ${stats.misses}`);
    console.log(`Uptime:      ${(stats.uptime / 1000).toFixed(0)}s`);
    console.groupEnd();
  }

  rateEfficiency(hitRate) {
    if (hitRate > 0.9) return 'Excellent ✅';
    if (hitRate > 0.7) return 'Good ✅';
    if (hitRate > 0.5) return 'Fair ⚠️';
    return 'Poor ❌ — consider reviewing query patterns';
  }
}

const monitor = new SelectorPerformanceMonitor(60000);
monitor.start();
```

---

### Pattern 3: SPA Navigator

```javascript
class SPANavigator {
  constructor() {
    this.currentRoute = null;
  }

  async navigate(route) {
    if (route === this.currentRoute) return;

    console.log(`[SPA] Navigating from "${this.currentRoute}" to "${route}"`);

    // Clear the cache — the DOM is about to change
    Selector.clear();

    // Load new content
    await this.loadRoute(route);

    // Wait for new page root to appear
    const pageRoot = await Selector.waitFor(`[data-page="${route}"]`, 8000);

    // Initialize new page
    await this.initializePage(pageRoot, route);

    this.currentRoute = route;
    console.log(`[SPA] Navigation to "${route}" complete`);
  }

  async loadRoute(route) {
    const response = await fetch(`/pages/${route}.html`);
    const html = await response.text();
    Elements.appRoot.innerHTML = html;
  }

  async initializePage(pageRoot, route) {
    // Each page gets its own scoped initialization
    const interactives = Selector.Scoped.withinAll(pageRoot, '[data-interactive]');
    interactives.addClass('initialized').on('click', handleInteraction);

    const forms = Selector.Scoped.withinAll(pageRoot, 'form');
    forms.on('submit', handleFormSubmit);
  }
}

const spa = new SPANavigator();
```

---

### Pattern 4: Test Suite Setup

```javascript
// In your test setup file (e.g., jest.setup.js)
beforeEach(() => {
  // Configure Selector for testing environment
  Selector.configure({
    enableLogging: false,  // Keep test output clean
    autoCleanup:   false,  // Manual control in tests
    maxCacheSize:  50      // Small — tests use limited selectors
  });
});

afterEach(() => {
  // Verify cache behavior if needed
  const stats = Selector.stats();
  if (stats.hitRate < 0.5 && stats.hits + stats.misses > 10) {
    console.warn(`[Test] Low cache hit rate: ${(stats.hitRate * 100).toFixed(0)}%`);
  }

  // Destroy and reset for next test
  Selector.destroy();
});
```

---

## Best Practices

### ✅ DO: Monitor in Development

```javascript
if (process.env.NODE_ENV === 'development') {
  Selector.configure({ enableLogging: true });

  setInterval(() => {
    const { hitRate } = Selector.stats();
    if (hitRate < 0.7) {
      console.warn('[Selector] Low cache efficiency:', `${(hitRate * 100).toFixed(0)}%`);
    }
  }, 30000);
}
```

### ✅ DO: Clear After Full DOM Rebuilds

```javascript
function refreshAppShell(newContent) {
  Elements.appShell.innerHTML = newContent;
  Selector.clear();  // Clear so next queries start fresh
  reinitializeApp();
}
```

### ✅ DO: Configure Once at App Start

```javascript
// Call this once during app initialization
function setupSelector() {
  Selector.configure({
    enableLogging:   process.env.NODE_ENV === 'development',
    maxCacheSize:    500,
    cleanupInterval: 30000
  });
}
```

### ✅ DO: Destroy on App Shutdown

```javascript
window.addEventListener('beforeunload', () => {
  Selector.destroy();  // Clean up MutationObserver and cache
});
```

---

### ❌ DON'T: Clear Cache Unnecessarily

```javascript
// Bad — clearing before every query kills performance
function updateUI() {
  Selector.clear();  // ❌ Unnecessary!
  const items = Selector.queryAll('.item');
  items.addClass('updated');
}

// Good — let the cache work
function updateUI() {
  const items = Selector.queryAll('.item');  // Cache handles this
  items.addClass('updated');
}
```

### ❌ DON'T: Enable Logging in Production

```javascript
// Bad — spams the console in production
Selector.configure({ enableLogging: true });

// Good — only in development
Selector.configure({
  enableLogging: process.env.NODE_ENV === 'development'
});
```

### ❌ DON'T: Call `destroy()` Mid-Session Without Re-initializing

```javascript
// Bad — destroying mid-session breaks all subsequent queries
function saveData() {
  Selector.destroy();  // ❌ Now Selector won't work for the rest of the session!
  saveToServer();
}

// Good — destroy only on actual shutdown
window.addEventListener('beforeunload', () => Selector.destroy());
```

---

## Key Takeaways

1. **`stats()`** — Read cache performance. Key metric is `hitRate` — above 0.7 (70%) is good, above 0.9 (90%) is excellent.

2. **`clear()`** — Reset the cache manually. Use after major DOM rebuilds or SPA navigation — not during normal operation.

3. **`destroy()`** — Full teardown. Disconnects the MutationObserver, clears cache, releases memory. Use on app shutdown or testing teardown.

4. **`configure(options)`** — Adjust logging, cache size, cleanup intervals. Call once during app initialization.

5. **`enableEnhancedSyntax()` / `disableEnhancedSyntax()`** — Toggle advanced property-access mode. Standard `query()` / `queryAll()` are always available regardless.

6. **Trust automatic cache management** — In normal use, the `MutationObserver` handles cache invalidation automatically. You rarely need `clear()`.

7. **Environment-aware configuration** — Log in development, stay quiet in production. Adjust cleanup intervals and cache size to fit your app's needs.