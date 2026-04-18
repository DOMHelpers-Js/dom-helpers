[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# .stats() — Performance Statistics Deep Dive

## Quick Start (30 seconds)

```javascript
const stats = Elements.stats();
console.log(stats);
// {
//   hits: 42,
//   misses: 8,
//   cacheSize: 8,
//   lastCleanup: 1708000000000,
//   hitRate: 0.84,
//   uptime: 15000
// }
```

---

## What is .stats()?

`.stats()` returns an object containing **performance data about the helper's cache**. It tells you:

- How many times the cache was used successfully (**hits**)
- How many times the library had to query the DOM (**misses**)
- How many items are currently stored (**cacheSize**)
- How efficient the cache is overall (**hitRate**)

Simply put, `.stats()` answers the question: **"How well is the caching system performing?"**

---

## Syntax

```javascript
// Available on every helper
Elements.stats()       // Returns stats object for Elements
Collections.stats()    // Returns stats object for Collections
Selector.stats()       // Returns stats object for Selector
```

**Parameters:** None

**Returns:** An object with performance data

---

## The Stats Object — Every Field Explained

### Common Fields (All Helpers)

| Field | Type | What It Means |
|-------|------|---------------|
| `hits` | Number | Times an element was found in cache (no DOM query needed) |
| `misses` | Number | Times the library had to query the DOM (element wasn't cached) |
| `cacheSize` | Number | How many items are currently in the cache |
| `lastCleanup` | Timestamp | When the last automatic cleanup happened (milliseconds since epoch) |
| `hitRate` | Number (0–1) | Cache efficiency: `hits / (hits + misses)`. `0.85` means 85% |
| `uptime` | Number (ms) | Milliseconds since the last cleanup |

### Selector-Only Field

| Field | Type | What It Means |
|-------|------|---------------|
| `selectorBreakdown` | Object | Counts how many times each selector type was used |

---

## How hitRate is Calculated

```
hitRate = hits / (hits + misses)
```

Every time you access an element or collection, the library does one of two things:

```
You access Elements.header
   ↓
Is "header" in the cache?
   ├── YES → hits++  (cache hit — instant return)
   └── NO  → misses++ (cache miss — DOM query, then cache it)
```

After 42 hits and 8 misses:
```
hitRate = 42 / (42 + 8) = 42 / 50 = 0.84 (84%)
```

### Reading Hit Rate

| Hit Rate | Meaning | Typical Cause |
|----------|---------|---------------|
| **0.90+** (90%+) | Excellent | App accesses the same elements repeatedly |
| **0.70–0.89** | Good | Normal usage pattern |
| **0.50–0.69** | Fair | Lots of new elements or DOM changes |
| **Below 0.50** | Low | Heavy DOM changes, cache clearing, or elements accessed only once |

**Key Insight:** A low hit rate isn't a bug. It simply means the DOM changes frequently or you're accessing many different elements. The library handles this automatically.

---

## Basic Usage

### Example 1: Quick Performance Check

```javascript
const stats = Elements.stats();
console.log(`Cache hits: ${stats.hits}`);
console.log(`Cache misses: ${stats.misses}`);
console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
console.log(`Items cached: ${stats.cacheSize}`);
// Output:
// Cache hits: 42
// Cache misses: 8
// Hit rate: 84.0%
// Items cached: 8
```

---

### Example 2: Compare All Helpers

```javascript
function showAllStats() {
  const helpers = {
    Elements: Elements.stats(),
    Collections: Collections.stats(),
    Selector: Selector.stats()
  };

  Object.entries(helpers).forEach(([name, stats]) => {
    console.log(`${name}: ${stats.hits} hits, ${stats.misses} misses, ` +
                `${(stats.hitRate * 100).toFixed(1)}% hit rate, ` +
                `${stats.cacheSize} cached`);
  });
}

showAllStats();
// Output:
// Elements: 42 hits, 8 misses, 84.0% hit rate, 8 cached
// Collections: 15 hits, 3 misses, 83.3% hit rate, 3 cached
// Selector: 27 hits, 5 misses, 84.4% hit rate, 5 cached
```

---

### Example 3: Console Table Format

```javascript
function statsDashboard() {
  console.table({
    Elements: Elements.stats(),
    Collections: Collections.stats(),
    Selector: Selector.stats()
  });
}

statsDashboard();
// Outputs a formatted table in the browser's developer console
```

**What's happening here:**
- `console.table()` displays the stats as a clean table in the browser console
- Each row is a helper, each column is a stat field
- This is the fastest way to get a visual overview during development

---

### Example 4: Track Hit Rate Over Time

```javascript
function monitorHitRate(intervalMs = 5000) {
  setInterval(() => {
    const stats = Elements.stats();
    const rate = (stats.hitRate * 100).toFixed(1);
    console.log(`[${new Date().toLocaleTimeString()}] Elements hit rate: ${rate}%`);
  }, intervalMs);
}

// Check every 5 seconds
monitorHitRate();
// Output:
// [10:30:05] Elements hit rate: 78.3%
// [10:30:10] Elements hit rate: 82.1%
// [10:30:15] Elements hit rate: 84.0%
```

**What's happening here:**
- We poll `.stats()` every 5 seconds and log the hit rate
- This lets you watch how caching efficiency changes as the user interacts with the page
- Hit rate typically starts low (many first-time lookups) and climbs as elements are reused from cache

---

## Selector-Specific: selectorBreakdown

The Selector helper tracks which **types** of CSS selectors you use:

```javascript
const stats = Selector.stats();
console.log(stats.selectorBreakdown);
// {
//   id: 10,         — #header, #footer, etc.
//   class: 12,      — .btn, .card, etc.
//   tag: 5,         — div, p, button, etc.
//   attribute: 3,   — [data-role], [type="email"], etc.
//   descendant: 2,  — .nav a, .card p, etc.
//   child: 1,       — .nav > a
//   pseudo: 0,      — :first-child, :hover, etc.
//   complex: 2      — anything else
// }
```

### Reading the Breakdown

| Type | What It Matches | Example |
|------|----------------|---------|
| `id` | `#myElement` | `Selector.query('#header')` |
| `class` | `.myClass` | `Selector.queryAll('.btn')` |
| `tag` | `div`, `p`, `button` | `Selector.queryAll('p')` |
| `attribute` | `[attr]`, `[attr="val"]` | `Selector.query('[data-role]')` |
| `descendant` | `parent child` | `Selector.queryAll('.nav a')` |
| `child` | `parent > child` | `Selector.queryAll('.nav > li')` |
| `pseudo` | `:first-child`, etc. | `Selector.query('li:first-child')` |
| `complex` | Everything else | `Selector.queryAll('.card:not(.hidden) > .title')` |

---

## Understanding Cache Size

`cacheSize` tells you how many items are stored. Each helper caches differently:

| Helper | What Gets Cached | Cache Key Example |
|--------|-----------------|-------------------|
| **Elements** | Individual elements by ID | `"header"`, `"submitBtn"` |
| **Collections** | Collections by type:value | `"className:btn"`, `"tagName:p"` |
| **Selector** | Query results by type:selector | `"single:#header"`, `"multiple:.card"` |

```javascript
// After accessing several elements:
Elements.header;
Elements.footer;
Elements.sidebar;
Elements.nav;

console.log(Elements.stats().cacheSize);  // 4 — four elements cached
```

**When does cache size decrease?**
- When the automatic cleanup removes stale entries
- When you call `.clear()`
- When `maxCacheSize` is reached and the oldest entry is evicted

---

## Understanding lastCleanup and uptime

```javascript
const stats = Elements.stats();

// When was the last cleanup?
const cleanupDate = new Date(stats.lastCleanup);
console.log(`Last cleanup: ${cleanupDate.toLocaleTimeString()}`);
// Output: "Last cleanup: 10:28:45 AM"

// How long since the last cleanup?
console.log(`Time since cleanup: ${(stats.uptime / 1000).toFixed(0)} seconds`);
// Output: "Time since cleanup: 75 seconds"
```

- `lastCleanup` is a timestamp (milliseconds since epoch) of when the cache was last automatically cleaned
- `uptime` is the difference between now and `lastCleanup` in milliseconds
- Cleanups happen automatically every `cleanupInterval` (default: 30 seconds)

---

## Stats Reset Behavior

Stats counters (`hits`, `misses`) **accumulate** over the lifetime of the helper. They don't reset automatically.

```javascript
// After some usage
Elements.stats();  // { hits: 42, misses: 8, ... }

// After more usage
Elements.stats();  // { hits: 67, misses: 12, ... }

// After clearing the cache — stats are NOT reset
Elements.clear();
Elements.stats();  // { hits: 67, misses: 12, cacheSize: 0, ... }
//                    hits and misses remain, but cacheSize is 0
```

The only way to reset stats is to **destroy and recreate** the helper, which happens when the page reloads.

---

## Real-World Example: Performance Report

```javascript
function generatePerformanceReport() {
  const report = {};

  // Gather stats from all helpers
  const elemStats = Elements.stats();
  const collStats = Collections.stats();
  const selStats = Selector.stats();

  // Calculate totals
  const totalHits = elemStats.hits + collStats.hits + selStats.hits;
  const totalMisses = elemStats.misses + collStats.misses + selStats.misses;
  const totalCached = elemStats.cacheSize + collStats.cacheSize + selStats.cacheSize;
  const totalLookups = totalHits + totalMisses;

  console.log('═══════════════════════════════════');
  console.log('  DOM Helpers Performance Report');
  console.log('═══════════════════════════════════');
  console.log(`  Total lookups:    ${totalLookups}`);
  console.log(`  Cache hits:       ${totalHits}`);
  console.log(`  Cache misses:     ${totalMisses}`);
  console.log(`  Overall hit rate: ${totalLookups > 0 ? (totalHits / totalLookups * 100).toFixed(1) : 0}%`);
  console.log(`  Items cached:     ${totalCached}`);
  console.log('═══════════════════════════════════');
}

generatePerformanceReport();
// ═══════════════════════════════════
//   DOM Helpers Performance Report
// ═══════════════════════════════════
//   Total lookups:    97
//   Cache hits:       84
//   Cache misses:     13
//   Overall hit rate: 86.6%
//   Items cached:     16
// ═══════════════════════════════════
```

---

## Summary

| Field | What It Tells You |
|-------|------------------|
| `hits` | How many times caching saved a DOM query |
| `misses` | How many times a DOM query was needed |
| `cacheSize` | How many items are stored right now |
| `hitRate` | Overall cache efficiency (0–1) |
| `lastCleanup` | When the last automatic cleanup ran |
| `uptime` | Milliseconds since last cleanup |
| `selectorBreakdown` | (Selector only) Which selector types are used most |

> **Simple Rule to Remember:** `.stats()` is read-only — it just reports data, it doesn't change anything. Call it anytime to see how the cache is performing. A hitRate above 0.70 means the cache is doing its job well.