[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# DOMHelpers Global Object — Best Practices and Patterns

## When to Use DOMHelpers vs Direct Globals

The library exposes two ways to access everything — direct globals and the `DOMHelpers` object. Here's the practical guide to choosing:

### Use Direct Globals for DOM Work

```javascript
// ✅ Day-to-day element access — clean and short
Elements.header.update({ textContent: 'Welcome' });
Collections.ClassName.btn.update({ disabled: false });
Selector.query('#nav').update({ style: { display: 'flex' } });
```

### Use DOMHelpers for Library Management

```javascript
// ✅ Startup, configuration, monitoring, cleanup
DOMHelpers.isReady();
DOMHelpers.configure({ enableLogging: true });
DOMHelpers.getStats();
DOMHelpers.clearAll();
```

**Key Insight:** If you're touching DOM elements, use the direct globals. If you're managing the library itself, use `DOMHelpers`.

---

## Recommended App Lifecycle Pattern

Here's a pattern that covers the full lifecycle — from startup to shutdown:

```javascript
// ─── 1. STARTUP ───
function initApp() {
  // Check readiness
  if (!DOMHelpers.isReady()) {
    console.error('DOM Helpers failed to load');
    return;
  }

  // Configure for current environment
  const isDev = location.hostname === 'localhost';
  DOMHelpers.configure({
    enableLogging: isDev
  });

  console.log(`DOM Helpers v${DOMHelpers.version} ready`);

  // Start using helpers
  Elements.header.update({ textContent: 'App Loaded!' });
}

// ─── 2. DURING RUNTIME ───
function onContentReload() {
  // After AJAX content replacement, clear stale caches
  DOMHelpers.clearAll();
}

function debugPerformance() {
  // Check how the cache is performing
  const stats = DOMHelpers.getStats();
  console.table({
    Elements:    stats.elements,
    Collections: stats.collections,
    Selector:    stats.selector
  });
}

// ─── 3. SHUTDOWN ───
// Automatic — the library handles this on page unload
// Manual — only if you need to tear down mid-session:
function teardown() {
  DOMHelpers.destroyAll();
}
```

---

## Configuration Patterns by Environment

### Development

```javascript
if (location.hostname === 'localhost') {
  DOMHelpers.configure({
    enableLogging: true,
    cleanupInterval: 10000
  });
}
```

### Production

```javascript
DOMHelpers.configure({
  enableLogging: false,
  autoCleanup: true,
  cleanupInterval: 60000,
  maxCacheSize: 2000
});
```

---

## Quick Reference: All DOMHelpers Members

```
DOMHelpers
│
├── Properties
│   ├── .Elements              Access the Elements helper
│   ├── .Collections           Access the Collections helper
│   ├── .Selector              Access the Selector helper
│   ├── .createElement         Access enhanced createElement
│   └── .version               Library version string
│
├── Status
│   ├── .isReady()             Are all helpers available?
│   └── .getStats()            Combined cache statistics
│
├── Cache Management
│   ├── .clearAll()            Empty all caches (helpers keep running)
│   └── .destroyAll()         Full shutdown (helpers stop)
│
├── Configuration
│   └── .configure(options)    Configure all helpers
│
└── createElement Control
    ├── .enableCreateElementEnhancement()   Turn on enhanced createElement
    └── .disableCreateElementEnhancement()  Restore original createElement
```

---

## Method Quick Reference

| Method | Does | Returns | Use When |
|--------|------|---------|----------|
| `isReady()` | Checks all helpers exist | `true` / `false` | App startup |
| `getStats()` | Gets cache performance data | `{ elements, collections, selector }` | Debugging, monitoring |
| `clearAll()` | Empties all caches | `undefined` | After major DOM changes |
| `destroyAll()` | Full shutdown | `undefined` | App teardown |
| `configure(options)` | Updates settings | `DOMHelpers` | App startup, env switching |
| `enableCreateElementEnhancement()` | Enhances `document.createElement` | `DOMHelpers` | When you want `.update()` on created elements |
| `disableCreateElementEnhancement()` | Restores original `createElement` | `DOMHelpers` | Third-party library compatibility |

---

## Common Mistakes to Avoid

### Mistake 1: Using Helpers After destroyAll()

```javascript
// ❌ Helpers stop working after destroyAll()
DOMHelpers.destroyAll();
Elements.header;  // Caching and observers are shut down

// ✅ Use clearAll() if you still need the helpers
DOMHelpers.clearAll();
Elements.header;  // Works — cache is just empty, helpers rebuild it
```

### Mistake 2: Forgetting That Properties Are References

```javascript
// These are the SAME object — not copies
DOMHelpers.Elements === Elements;  // true

// Changing one changes the other
DOMHelpers.Elements.header.update({ textContent: 'Changed' });
// Elements.header.textContent is now 'Changed' too — same element
```

### Mistake 3: Over-Configuring

```javascript
// ❌ No need to configure defaults — they're already set
DOMHelpers.configure({
  enableLogging: false,   // Already false by default
  autoCleanup: true,      // Already true by default
  maxCacheSize: 1000      // Already 1000 by default
});

// ✅ Only configure what you're changing
DOMHelpers.configure({ enableLogging: true });
```

---

## Summary

| Principle | Guideline |
|-----------|-----------|
| **DOM work** | Use direct globals (`Elements`, `Collections`, `Selector`) |
| **Library management** | Use `DOMHelpers` object |
| **Startup** | Check `isReady()`, `configure()`, log `version` |
| **Runtime** | `clearAll()` after major DOM changes, `getStats()` for monitoring |
| **Shutdown** | Automatic on page unload — manual `destroyAll()` only if needed |
| **Configuration** | Only set what you're changing from defaults |