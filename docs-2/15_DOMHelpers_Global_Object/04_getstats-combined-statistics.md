[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# DOMHelpers.getStats() — Combined Statistics

## Quick Start (30 seconds)

```javascript
// Get cache performance stats for the entire library
const stats = DOMHelpers.getStats();

console.log(stats);
// {
//   elements:    { hits: 42, misses: 8, cacheSize: 8, hitRate: 0.84, ... },
//   collections: { hits: 15, misses: 3, cacheSize: 3, hitRate: 0.83, ... },
//   selector:    { hits: 27, misses: 5, cacheSize: 5, hitRate: 0.84, ... }
// }
```

---

## What is DOMHelpers.getStats()?

`DOMHelpers.getStats()` returns **performance statistics from all three helpers in one call**. It tells you how the library's caching system is performing — how many cache hits, how many misses, the current cache size, and the overall hit rate.

Simply put, it's a **dashboard** for your library's performance.

---

## Syntax

```javascript
const stats = DOMHelpers.getStats();
```

**Parameters:** None

**Returns:** An object with up to three keys:

```javascript
{
  elements:    { ... },   // Stats from the Elements helper
  collections: { ... },   // Stats from the Collections helper
  selector:    { ... }    // Stats from the Selector helper
}
```

---

## Why Does This Exist?

### The Situation Without getStats()

If you wanted to check performance across all helpers, you'd call each one separately:

```javascript
const elemStats = Elements.stats();
const collStats = Collections.stats();
const selStats = Selector.stats();

console.log('Elements:', elemStats);
console.log('Collections:', collStats);
console.log('Selector:', selStats);
```

That works, but:
- ❌ Three separate calls
- ❌ Three separate variables
- ❌ Easy to forget one

### The getStats() Way

```javascript
const stats = DOMHelpers.getStats();
console.log(stats);
```

✅ **One call** — all stats in one object
✅ **Organized** — each helper's stats are nested under a clear key
✅ **Complete picture** — nothing left out

---

## How Does It Work?

```
DOMHelpers.getStats()
   ↓
Calls Elements.stats()     → stores in stats.elements
   ↓
Calls Collections.stats()  → stores in stats.collections
   ↓
Calls Selector.stats()     → stores in stats.selector
   ↓
Returns the combined { elements, collections, selector } object
```

Behind the scenes, `getStats()` simply calls `.stats()` on each helper (if it exists) and puts the results together:

```javascript
getStats() {
  const stats = {};
  if (this.Elements && typeof this.Elements.stats === 'function') {
    stats.elements = this.Elements.stats();
  }
  if (this.Collections && typeof this.Collections.stats === 'function') {
    stats.collections = this.Collections.stats();
  }
  if (this.Selector && typeof this.Selector.stats === 'function') {
    stats.selector = this.Selector.stats();
  }
  return stats;
}
```

---

## Understanding the Stats Object

Each helper returns the same set of statistics. Here's what each field means:

### Stats Fields Explained

| Field | Type | What It Means |
|-------|------|---------------|
| `hits` | Number | How many times an element/collection was found in cache (fast lookup) |
| `misses` | Number | How many times the library had to query the DOM (slower lookup) |
| `cacheSize` | Number | How many items are currently stored in the cache |
| `hitRate` | Number (0–1) | Percentage of lookups that were cache hits. `0.85` means 85% |
| `lastCleanup` | Timestamp | When the cache was last automatically cleaned |
| `uptime` | Number (ms) | Milliseconds since the last cleanup |

The Selector helper includes one additional field:

| Field | Type | What It Means |
|-------|------|---------------|
| `selectorBreakdown` | Object | Counts of different selector types used (id, class, tag, etc.) |

---

### Example: Reading the Full Stats Object

```javascript
const stats = DOMHelpers.getStats();

// Elements stats
console.log(stats.elements.hits);       // 42 — cache hits
console.log(stats.elements.misses);     // 8  — DOM queries
console.log(stats.elements.cacheSize);  // 8  — cached elements
console.log(stats.elements.hitRate);    // 0.84 — 84% hit rate

// Collections stats
console.log(stats.collections.hits);       // 15
console.log(stats.collections.misses);     // 3
console.log(stats.collections.cacheSize);  // 3
console.log(stats.collections.hitRate);    // 0.83

// Selector stats
console.log(stats.selector.hits);       // 27
console.log(stats.selector.misses);     // 5
console.log(stats.selector.cacheSize);  // 5
console.log(stats.selector.hitRate);    // 0.84
console.log(stats.selector.selectorBreakdown);  // { id: 10, class: 12, tag: 5, complex: 5 }
```

---

## Basic Usage

### Example 1: Quick Performance Check

```javascript
function checkPerformance() {
  const stats = DOMHelpers.getStats();

  console.log('=== DOM Helpers Performance ===');
  console.log(`Elements:    ${stats.elements.hits} hits, ${stats.elements.misses} misses`);
  console.log(`Collections: ${stats.collections.hits} hits, ${stats.collections.misses} misses`);
  console.log(`Selector:    ${stats.selector.hits} hits, ${stats.selector.misses} misses`);
}

checkPerformance();
// Output:
// === DOM Helpers Performance ===
// Elements:    42 hits, 8 misses
// Collections: 15 hits, 3 misses
// Selector:    27 hits, 5 misses
```

**What's happening here:**
- We call `getStats()` once and get everything
- We read the `hits` and `misses` from each helper to see how the caching is performing
- More hits = better performance (elements are being reused from cache instead of querying the DOM)

---

### Example 2: Calculate Total Cache Efficiency

```javascript
function getCacheEfficiency() {
  const stats = DOMHelpers.getStats();

  const totalHits = (stats.elements?.hits || 0)
                  + (stats.collections?.hits || 0)
                  + (stats.selector?.hits || 0);

  const totalMisses = (stats.elements?.misses || 0)
                    + (stats.collections?.misses || 0)
                    + (stats.selector?.misses || 0);

  const totalLookups = totalHits + totalMisses;
  const overallHitRate = totalLookups > 0
    ? (totalHits / totalLookups * 100).toFixed(1)
    : 0;

  console.log(`Total lookups: ${totalLookups}`);
  console.log(`Cache hit rate: ${overallHitRate}%`);
  console.log(`Total cached items: ${
    (stats.elements?.cacheSize || 0) +
    (stats.collections?.cacheSize || 0) +
    (stats.selector?.cacheSize || 0)
  }`);
}

getCacheEfficiency();
// Output:
// Total lookups: 97
// Cache hit rate: 86.6%
// Total cached items: 16
```

**What's happening here:**
- We add up the hits and misses across all helpers to get total numbers
- We calculate an overall hit rate — anything above 70% is healthy
- We count how many items are currently cached across the whole library

---

### Example 3: Development Debug Dashboard

```javascript
function debugDashboard() {
  const stats = DOMHelpers.getStats();

  console.table({
    'Elements': {
      'Hits': stats.elements?.hits || 0,
      'Misses': stats.elements?.misses || 0,
      'Cache Size': stats.elements?.cacheSize || 0,
      'Hit Rate': ((stats.elements?.hitRate || 0) * 100).toFixed(1) + '%'
    },
    'Collections': {
      'Hits': stats.collections?.hits || 0,
      'Misses': stats.collections?.misses || 0,
      'Cache Size': stats.collections?.cacheSize || 0,
      'Hit Rate': ((stats.collections?.hitRate || 0) * 100).toFixed(1) + '%'
    },
    'Selector': {
      'Hits': stats.selector?.hits || 0,
      'Misses': stats.selector?.misses || 0,
      'Cache Size': stats.selector?.cacheSize || 0,
      'Hit Rate': ((stats.selector?.hitRate || 0) * 100).toFixed(1) + '%'
    }
  });
}

debugDashboard();
// Outputs a formatted table in the browser console
```

**What's happening here:**
- `console.table()` formats the stats as a clean, readable table in your browser's developer console
- Each row shows one helper's performance
- This is a great way to monitor caching health during development

---

### Example 4: Selector Breakdown

The Selector helper tracks which *types* of selectors you use most:

```javascript
const stats = DOMHelpers.getStats();
const breakdown = stats.selector?.selectorBreakdown;

if (breakdown) {
  console.log('Selector usage breakdown:');
  console.log(`  ID selectors (#...):      ${breakdown.id || 0}`);
  console.log(`  Class selectors (...):    ${breakdown.class || 0}`);
  console.log(`  Tag selectors:            ${breakdown.tag || 0}`);
  console.log(`  Attribute selectors:      ${breakdown.attribute || 0}`);
  console.log(`  Complex selectors:        ${breakdown.complex || 0}`);
}
// Output:
// Selector usage breakdown:
//   ID selectors (#...):      10
//   Class selectors (...):    12
//   Tag selectors:            5
//   Attribute selectors:      3
//   Complex selectors:        2
```

**What's happening here:**
- The Selector helper categorizes every query you make — ID, class, tag, attribute, descendant, child, pseudo, or complex
- This helps you understand your query patterns and optimize if needed
- For example, if you're using many complex selectors, consider using simpler ones for better cache performance

---

## Understanding Hit Rate

The `hitRate` is the most important number in the stats. Here's how to interpret it:

```
hitRate = hits / (hits + misses)
```

| Hit Rate | What It Means |
|----------|---------------|
| `0.90+` (90%+) | Excellent — cache is working great |
| `0.70 – 0.89` | Good — normal performance |
| `0.50 – 0.69` | Fair — lots of new or changing elements |
| `below 0.50` | Low — DOM changes frequently, or cache is being cleared often |

**Key Insight:** A low hit rate isn't necessarily a problem. If your DOM changes frequently (elements added/removed), the cache naturally gets more misses. The library handles this automatically through its MutationObserver-based cache invalidation.

---

## When to Use getStats()

| Scenario | Why getStats() Helps |
|----------|---------------------|
| **Debugging performance issues** | See if the cache is being used effectively |
| **Development logging** | Monitor how your app uses the library |
| **Optimizing queries** | Check if you're causing unnecessary cache misses |
| **Health monitoring** | Verify the library is running smoothly |

---

## Summary

| Aspect | Detail |
|--------|--------|
| **What** | Returns combined cache statistics from all three helpers |
| **Returns** | `{ elements: {...}, collections: {...}, selector: {...} }` |
| **Key fields** | `hits`, `misses`, `cacheSize`, `hitRate`, `lastCleanup` |
| **When to use** | Debugging, performance monitoring, development dashboards |

> **Simple Rule to Remember:** `getStats()` is your library performance dashboard. Higher `hitRate` means better caching. Call it during development to make sure things are running smoothly.