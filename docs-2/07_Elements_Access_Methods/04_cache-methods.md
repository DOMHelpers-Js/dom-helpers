[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Cache Methods — isCached() and stats()

The Elements helper maintains an internal cache to make element access fast. `isCached()` and `stats()` give you **visibility into that cache** — letting you check whether specific elements are cached and see how the cache is performing overall. These are primarily tools for **development and debugging**.

---

## Quick Start (30 Seconds)

```javascript
// Check if a specific element is in the cache
const isCached = Elements.isCached('submitBtn');
console.log(isCached); // true or false

// Get overall cache performance statistics
const stats = Elements.stats();
console.log(stats.hitRate);   // 0.857 = 85.7% cache efficiency
console.log(stats.cacheSize); // 15 = 15 elements currently cached
console.log(stats.hits);      // 150 = times served from cache
console.log(stats.misses);    // 25 = times queried from DOM
```

These methods don't change how Elements works — they just let you see inside it.

---

## What Are These Cache Methods?

`isCached()` and `stats()` are **read-only diagnostic tools**. They give you information about the cache's current state without modifying it.

| Method | Returns | Primary Use |
|--------|---------|-------------|
| `Elements.isCached(id)` | `true` or `false` | Check one specific element |
| `Elements.stats()` | Object with metrics | Overall cache health and performance |

---

## Syntax

```javascript
// Check if an element is currently cached
const inCache = Elements.isCached(id);

// Get cache statistics snapshot
const stats = Elements.stats();
```

**`Elements.isCached()` parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The element's ID to check |

**Returns:** `true` if the element is in the cache right now, `false` otherwise.

**`Elements.stats()` parameters:** None.

**Returns:** An object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `hits` | number | Total times an element was served from cache |
| `misses` | number | Total times the DOM was queried (cache didn't have it) |
| `cacheSize` | number | Number of elements currently stored in the cache |
| `hitRate` | number | Ratio of hits to total accesses (0.0 to 1.0) |
| `uptime` | number | Milliseconds since the last cache cleanup |
| `lastCleanup` | number | Timestamp of the last cleanup run |

---

## Why Do These Methods Exist?

### When Direct Element Access Is Your Focus

In normal usage, you access elements and trust the caching to work:

```javascript
// Regular usage — you don't need to think about the cache
const button = Elements.submitBtn;
const header = Elements.pageHeader;
button.update({ disabled: true });
```

This approach is **great for most code**:
✅ Clean, focused on what you're trying to do
✅ Cache works automatically in the background
✅ No extra code needed

### When Visibility Into the Cache Is Valuable

In specific situations — debugging, performance monitoring, and testing — you want to see inside the cache system. That's where `isCached()` and `stats()` shine:

```javascript
// Debugging: "Why is my element coming back differently than expected?"
console.log('Is submitBtn cached?', Elements.isCached('submitBtn'));

// Performance monitoring: "How efficient is our caching?"
const stats = Elements.stats();
const efficiency = (stats.hitRate * 100).toFixed(1);
console.log(`Cache efficiency: ${efficiency}%`);

// Testing: "Did the cache update correctly after DOM changes?"
expect(Elements.isCached('removedElement')).toBe(false);
```

**These methods are especially useful when:**
✅ Debugging unexpected element behavior during development
✅ Writing tests that verify caching works correctly
✅ Performance monitoring in development to spot inefficient patterns
✅ Understanding what's happening in the cache at a specific moment

---

## Mental Model — The "Whiteboard at Reception"

Imagine the Elements cache as a whiteboard at a front desk. When someone calls asking for "the button with ID submitBtn", the receptionist:
1. Checks the whiteboard — is it written there? (cache check)
2. If yes: gives the answer immediately from the whiteboard (cache hit)
3. If no: goes to look it up, writes it on the whiteboard for next time (cache miss → cache write)

`isCached()` is like asking: *"Is 'submitBtn' currently written on the whiteboard?"*

`stats()` is like asking: *"How many times did you answer from the whiteboard vs. had to go look it up?"*

```
isCached('submitBtn')
   ↓
  Is 'submitBtn' on the whiteboard?
  → YES: return true
  → NO:  return false

stats()
   ↓
  {
    hits: 150,      ← "I answered 150 from the whiteboard"
    misses: 25,     ← "I had to look up 25 times"
    hitRate: 0.857, ← "85.7% of answers came from the whiteboard"
    cacheSize: 18   ← "There are 18 items on the whiteboard right now"
  }
```

---

## How Does the Cache Work Internally?

Understanding the cache helps you use these methods meaningfully:

```
Internal Cache Structure: JavaScript Map
  Key:   Element ID (string)
  Value: DOM Element reference

Map {
  'submitBtn'  → <button id="submitBtn">
  'pageHeader' → <header id="pageHeader">
  'loginForm'  → <form id="loginForm">
  ... (up to maxCacheSize entries)
}

Cache Population:
  1. Element accessed via Elements.{id}
  2. Proxy checks Map for the ID
  3. [MISS] Query DOM → store in Map → return element
  4. [HIT]  Return from Map directly (no DOM query)

Cache Invalidation (automatic):
  MutationObserver watches the DOM
  When an element is removed from DOM:
    → Observer fires
    → Cache entry for that ID is deleted from the Map
    → Next access will be a cache miss (element is gone)

Cache Cleanup (automatic periodic):
  Every cleanupInterval ms (default: 30 seconds):
    → Check each cached element
    → Is it still in the DOM? If not, remove from cache
    → Keeps the cache clean even if MutationObserver missed something
```

---

## Elements.isCached() — Basic Usage

### Example 1: Checking Cache Status After Access

```javascript
// Before any access
console.log(Elements.isCached('submitBtn')); // false — not accessed yet

// Access the element
const btn = Elements.submitBtn;

// After access
console.log(Elements.isCached('submitBtn')); // true — now it's cached
```

**What's happening:**
- Before we access `submitBtn`, it's not in the cache (we've never asked for it)
- After accessing `Elements.submitBtn`, it gets stored in the cache Map
- `isCached()` reads the Map directly — it's just a check, no DOM query

---

### Example 2: Verifying Cache After DOM Removal

```javascript
// Create and access an element
document.body.innerHTML += '<div id="tempDiv">Temporary</div>';
const temp = Elements.tempDiv;

console.log(Elements.isCached('tempDiv')); // true

// Remove from DOM
temp.remove();
// MutationObserver fires → cache entry removed automatically

// A brief moment later:
console.log(Elements.isCached('tempDiv')); // false — cache auto-updated
```

**What's happening:**
- When `temp.remove()` runs, the DOM changes
- The `MutationObserver` detects the removal and deletes `'tempDiv'` from the cache Map
- `isCached()` now returns `false` because the Map entry is gone

---

### Example 3: Debugging — Why Is My Element Null?

If `Elements.someId` is returning `null` and you're not sure why, `isCached()` can help you debug:

```javascript
function debugElement(id) {
  const inCache = Elements.isCached(id);
  const element = Elements[id]; // Access it

  console.log(`=== Debugging element: #${id} ===`);
  console.log(`Was in cache before access: ${inCache}`);
  console.log(`Element found: ${element !== null}`);

  if (!element) {
    console.log(`Checking DOM directly: ${document.getElementById(id) !== null}`);
    console.log(`Conclusion: Element with ID "${id}" does not exist in DOM`);
  }
}

debugElement('submitBtn');
// === Debugging element: #submitBtn ===
// Was in cache before access: false
// Element found: false
// Checking DOM directly: false
// Conclusion: Element with ID "submitBtn" does not exist in DOM
```

---

### Example 4: Testing Cache Behavior

`isCached()` is very useful in tests to verify the caching system is working as expected:

```javascript
describe('Elements caching', () => {

  beforeEach(() => {
    Elements.clear(); // Start each test with empty cache
    document.body.innerHTML = '<button id="testBtn">Test</button>';
  });

  it('is not cached before first access', () => {
    expect(Elements.isCached('testBtn')).toBe(false);
  });

  it('is cached after first access', () => {
    Elements.testBtn; // Trigger caching
    expect(Elements.isCached('testBtn')).toBe(true);
  });

  it('is removed from cache when element is removed from DOM', (done) => {
    Elements.testBtn; // Cache it

    expect(Elements.isCached('testBtn')).toBe(true);

    document.getElementById('testBtn').remove(); // Remove from DOM

    // MutationObserver fires asynchronously
    setTimeout(() => {
      expect(Elements.isCached('testBtn')).toBe(false);
      done();
    }, 50);
  });

});
```

---

## Elements.stats() — Basic Usage

### Example 1: Reading All Stats

```javascript
// Access a few elements to generate some cache activity
const btn    = Elements.submitBtn;   // miss
const header = Elements.pageHeader;  // miss
const btn2   = Elements.submitBtn;   // hit
const btn3   = Elements.submitBtn;   // hit
const footer = Elements.footer;      // miss

const stats = Elements.stats();
console.log(stats);
/*
{
  hits:        2,           // submitBtn accessed from cache twice
  misses:      3,           // submitBtn, pageHeader, footer each queried once
  cacheSize:   3,           // 3 elements currently in cache
  hitRate:     0.4,         // 2/5 = 40% — could be better
  uptime:      3200,        // 3.2 seconds since last cleanup
  lastCleanup: 1708123456789
}
*/
```

---

### Example 2: Understanding Hit Rate

`hitRate` is the most useful metric. It tells you how efficient the cache is:

```javascript
const stats = Elements.stats();
const total  = stats.hits + stats.misses;
const hitPct = (stats.hitRate * 100).toFixed(1);

console.log(`Total element accesses: ${total}`);
console.log(`From cache: ${stats.hits} (${hitPct}%)`);
console.log(`From DOM:   ${stats.misses} (${(100 - parseFloat(hitPct)).toFixed(1)}%)`);
```

**What different hit rates mean:**

| Hit Rate | What It Means |
|----------|---------------|
| > 80% | Excellent — cache is working very well |
| 50–80% | Moderate — elements may be re-created frequently |
| < 50% | Low — could indicate lots of dynamic element replacement |
| ~0% | The cache is barely being used (very few repeated accesses) |

**Important:** A low hit rate isn't necessarily a problem. If your code accesses many unique elements once each, you'll naturally have more misses. The cache helps most when you access the same elements repeatedly.

---

### Example 3: Performance Health Check

```javascript
function checkElementsPerformance() {
  const stats = Elements.stats();
  const total  = stats.hits + stats.misses;

  if (total === 0) {
    console.log('No element accesses yet');
    return;
  }

  const hitPct = (stats.hitRate * 100).toFixed(1);

  console.log('=== Elements Cache Performance ===');
  console.log(`Efficiency: ${hitPct}% (${stats.hits} hits / ${total} total)`);
  console.log(`Cached now: ${stats.cacheSize} elements`);

  if (stats.hitRate > 0.8) {
    console.log('✅ Cache performing excellently');
  } else if (stats.hitRate > 0.5) {
    console.log('⚠️  Moderate performance — consider reducing dynamic element replacement');
  } else if (total > 20) {
    console.log('❌ Cache efficiency is low');
    console.log('   Possible causes: frequent DOM replacement, many unique element IDs');
  }
}

// Run in development
checkElementsPerformance();
```

---

### Example 4: Stats in Tests — Verifying Cache Behavior

```javascript
describe('Cache statistics', () => {

  beforeEach(() => {
    Elements.clear();
    document.body.innerHTML = '<div id="testDiv"></div>';
  });

  it('starts with zero hits and misses', () => {
    const stats = Elements.stats();
    expect(stats.hits).toBe(0);
    expect(stats.misses).toBe(0);
    expect(stats.cacheSize).toBe(0);
  });

  it('records a miss on first access', () => {
    Elements.testDiv; // First access — miss
    const stats = Elements.stats();
    expect(stats.misses).toBe(1);
    expect(stats.hits).toBe(0);
    expect(stats.cacheSize).toBe(1);
  });

  it('records a hit on subsequent access', () => {
    Elements.testDiv;  // miss
    Elements.testDiv;  // hit
    Elements.testDiv;  // hit

    const stats = Elements.stats();
    expect(stats.misses).toBe(1);
    expect(stats.hits).toBe(2);
    expect(stats.hitRate).toBeCloseTo(2/3);
  });

});
```

---

## Development Monitoring Pattern

One useful pattern is to log stats periodically during development:

```javascript
// Add this during development — remove before production
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const stats = Elements.stats();
    const total  = stats.hits + stats.misses;

    if (total > 0) {
      console.log('[Elements Cache]', {
        hitRate:  `${(stats.hitRate * 100).toFixed(0)}%`,
        cached:   stats.cacheSize,
        accesses: total
      });
    }
  }, 30000); // Log every 30 seconds
}
```

---

## Common Questions

**Q: Does checking `isCached()` count as a cache access?**

No. `isCached()` reads the Map directly without incrementing `hits` or `misses`. It's a pure read with no side effects.

**Q: Does `stats()` affect performance?**

Negligibly. It reads a few counters and returns an object. It's safe to call in production code, though it's most valuable in development.

**Q: Why does `isCached()` return `false` right after I accessed an element?**

If the element wasn't found in the DOM (i.e., `Elements.submitBtn` returned `null`), nothing gets cached — you can't cache a null value. So `isCached('submitBtn')` would return `false` because there's no element to store.

**Q: What does `hitRate` of 0 mean when I've accessed elements many times?**

It can happen in two scenarios:
1. You're always accessing unique element IDs that you've never accessed before (all misses, no repeats)
2. The cache is being cleared very frequently

A hitRate of 0 with many accesses isn't necessarily bad — it just means you're not accessing the same IDs repeatedly.

---

## Best Practices

### ✅ DO: Use isCached() for Debugging and Testing

```javascript
// Good — verifying cache behavior in a test
const elem = Elements.myElement;
expect(Elements.isCached('myElement')).toBe(true);
```

### ✅ DO: Use stats() for Development Performance Monitoring

```javascript
// Good — checking how efficient the cache is during development
const stats = Elements.stats();
console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
```

### ✅ DO: Gate Monitoring Code Behind Environment Checks

```javascript
// Good — monitoring only runs in development
if (process.env.NODE_ENV === 'development') {
  const stats = Elements.stats();
  console.log('[Dev] Elements cache:', stats);
}
```

### ❌ DON'T: Use isCached() to Decide Whether to Access an Element

```javascript
// Bad — unnecessary; just access the element directly
if (Elements.isCached('button')) {
  const btn = Elements.button;
  btn.click();
} else {
  const btn = Elements.button; // Same thing — both paths do the same thing
  btn.click();
}

// Good — just access and null-check
const btn = Elements.button;
if (btn) btn.click();
```

`isCached()` tells you what's in the cache — it doesn't tell you whether the element exists or can be used. Always access elements through `Elements.{id}` and check for null.

### ❌ DON'T: Make Business Logic Depend on Cache State

```javascript
// Bad — business logic should not depend on cache internals
function processForm() {
  if (!Elements.isCached('submitBtn')) {
    return; // Wrong — the button might exist, just not cached yet
  }
  // ...
}

// Good — check if the element exists, not if it's cached
function processForm() {
  const submitBtn = Elements.submitBtn;
  if (!submitBtn) return;
  // ...
}
```

Whether something is cached is an internal implementation detail. Your business logic should always use element existence (null check), not cache state.

---

## Summary — Key Takeaways

1. **`Elements.isCached(id)`** — returns `true/false` to tell you if a specific element is currently in the cache Map.

2. **`Elements.stats()`** — returns a snapshot of cache performance metrics: hits, misses, hit rate, and current cache size.

3. **Both are read-only** — they observe the cache without changing it.

4. **Primary use: development and debugging** — for everyday production code, you don't need to think about the cache.

5. **Hit rate interpretation:** Above 80% is excellent; below 50% may indicate frequent element replacement (which is not necessarily a bug).

6. **Combine with `clear()` in tests** — `clear()` flushes the cache; `stats()` and `isCached()` verify the result.

---

## What's Next?

Now let's look at batch element access — how to grab multiple elements in one call:

Continue to **Batch Access Methods** (`05_batch-access-methods.md`) →