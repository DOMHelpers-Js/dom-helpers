[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# How Auto-Cleanup and the MutationObserver Work

## Quick Start (30 seconds)

```javascript
// You don't need to do anything — these run automatically
// But here's how to see them in action:

Elements.configure({ enableLogging: true });

// Now add an element to the DOM
const div = document.createElement('div');
div.id = 'newElement';
document.body.appendChild(div);
// Console: (MutationObserver detects the new element and caches it)

// Remove it
div.remove();
// Console: (MutationObserver detects the removal and invalidates the cache entry)
```

---

## What Are These Systems?

Every helper in DOM Helpers runs two automatic background systems that keep the cache healthy without any manual effort:

| System | What It Does | How Often |
|--------|-------------|-----------|
| **MutationObserver** | Watches for DOM changes and invalidates affected cache entries | Instantly (debounced) |
| **Cleanup Timer** | Scans the entire cache for stale entries and removes them | Every 30 seconds (default) |

Together, they ensure that the cache **never returns stale references** — elements that have been removed, moved, or changed in the DOM.

---

## Why Do These Exist?

### The Problem with Static Caching

Imagine a cache that never updates:

```javascript
// 1. Access an element — gets cached
const btn = Elements.submitBtn;  // Cached: submitBtn → <button>

// 2. Someone removes the button from the DOM
document.getElementById('submitBtn').remove();

// 3. Access it again — cache returns the OLD reference!
const btn2 = Elements.submitBtn;  // ❌ Returns a detached element!
btn2.update({ textContent: 'Click' });  // Updates a ghost element — nothing visible
```

A static cache would keep returning references to elements that no longer exist in the page. That's a bug.

### How DOM Helpers Prevents This

The MutationObserver and Cleanup Timer work together to catch these situations:

```
DOM change happens (element removed)
   ↓
MutationObserver detects it (within 16ms)
   ↓
Invalidates the cache entry for that element
   ↓
Next access queries the DOM fresh
   ↓
Returns null (element truly gone) or the new element (if replaced)
```

---

## System 1: The MutationObserver

### What It Watches

Each helper's MutationObserver watches for different things:

| Helper | Watches For | Attribute Filter |
|--------|------------|-----------------|
| **Elements** | Nodes added/removed, `id` attribute changes | `["id"]` |
| **Collections** | Nodes added/removed, `class` and `name` attribute changes | `["class", "name"]` |
| **Selector** | Nodes added/removed, `id`, `class`, `style`, `hidden`, `disabled` changes | `["id", "class", "style", "hidden", "disabled"]` |

All observers watch:
- **childList** — elements added to or removed from the DOM
- **subtree** — changes anywhere in the document, not just direct children

### How the Elements Observer Works

```
DOM Change: Element with id="header" is removed
   ↓
MutationObserver fires (debounced by 16ms)
   ↓
Scans mutation records:
   ├── removedNodes → found node with id="header"
   │   └── Add "header" to removedIds set
   ├── addedNodes → (none in this case)
   └── attribute changes → (none in this case)
   ↓
Invalidate cache:
   └── cache.delete("header")
   ↓
Cache no longer contains "header"
   ↓
Next access: Elements.header → DOM query → returns null (element is gone)
```

### How the Collections Observer Works

```
DOM Change: Element with class="btn" is added
   ↓
MutationObserver fires (debounced by 16ms)
   ↓
Scans mutation records:
   ├── addedNodes → found node with class="btn"
   │   └── Add "btn" to affectedClasses set
   └── Check children of added node for more classes
   ↓
Invalidate cache:
   └── Find all cache entries with key "className:btn" → delete them
   ↓
Next access: Collections.ClassName.btn → fresh DOM query → returns updated collection
```

### How the Selector Observer Works

The Selector observer takes a more aggressive approach:

```
DOM Change: Any childList change (element added or removed)
   ↓
MutationObserver fires (debounced by 16ms)
   ↓
Because the DOM structure changed:
   └── ALL cached query results are invalidated (cache.clear())
   ↓
Next access: Selector.query('.card') → fresh DOM query → returns current results
```

For **attribute-only changes** (no elements added/removed), the Selector observer is more selective — it only invalidates cache entries whose selectors include the changed attribute.

---

## Debouncing: Why Mutations Are Grouped

DOM changes can happen very quickly. Consider this code:

```javascript
// This creates 100 mutations in rapid succession
for (let i = 0; i < 100; i++) {
  const div = document.createElement('div');
  div.id = `item-${i}`;
  div.className = 'item';
  container.appendChild(div);
}
```

Without debouncing, the MutationObserver would fire and process cache invalidation 100 times. That's wasteful.

With debouncing (default 16ms), the library groups all those mutations:

```
Mutation 1 → Mutation 2 → Mutation 3 → ... → Mutation 100
                                                    ↓
                                         (wait 16ms of quiet)
                                                    ↓
                                         Process ALL 100 at once
```

The `debounceDelay` option controls this wait time:

```javascript
// More responsive (processes sooner, but more CPU)
Elements.configure({ debounceDelay: 8 });

// Less responsive (groups more changes, less CPU)
Elements.configure({ debounceDelay: 50 });
```

---

## System 2: The Cleanup Timer

### What It Does

The cleanup timer runs on a schedule (every 30 seconds by default) and scans the entire cache for **stale entries** — cached references to elements that are no longer in the DOM.

```
Timer fires (every 30 seconds)
   ↓
Scan each cache entry:
   ├── "header" → Is <div id="header"> still in document? → Yes → Keep
   ├── "footer" → Is <div id="footer"> still in document? → Yes → Keep
   ├── "oldWidget" → Is <div id="oldWidget"> still in document? → No → Remove
   └── "tempMsg" → Is <div id="tempMsg"> still in document? → No → Remove
   ↓
Removed 2 stale entries
   ↓
Schedule next cleanup in 30 seconds
```

### Why Is This Needed If We Have MutationObserver?

The MutationObserver catches most changes immediately. But there are edge cases where it might miss something:

- Elements removed in unusual ways (e.g., through shadow DOM manipulation)
- Elements whose `id` or `class` was changed indirectly
- Race conditions during rapid DOM updates

The cleanup timer acts as a **safety net** — it catches anything the MutationObserver might have missed.

### How the Cleanup Validates Entries

Each helper checks different things during cleanup:

**Elements helper:**
```javascript
// For each cached entry:
// Is the element valid?
element !== null
  && element.nodeType === Node.ELEMENT_NODE
  && document.contains(element)  // Still in the DOM?
  && element.id === cachedId     // ID hasn't changed?
```

**Collections helper:**
```javascript
// For each cached collection:
// Is the collection still valid?
collection._originalCollection !== null
  && (collection._originalCollection.length === 0   // Empty is OK
      || document.contains(firstElement))            // First element still in DOM?
```

**Selector helper:**
```javascript
// For single elements:
element !== null && document.contains(element)

// For collections:
nodeList._originalNodeList.length === 0              // Empty is OK
  || document.contains(firstElement)                 // First element still in DOM?
```

---

## Controlling These Systems

### Turn Off Auto-Cleanup

```javascript
// Disable the cleanup timer
Elements.configure({ autoCleanup: false });
// The timer stops — no more periodic scans
// Cache is only cleaned by MutationObserver or manual .clear()
```

### Change Cleanup Frequency

```javascript
// Clean up more often (every 10 seconds)
Elements.configure({ cleanupInterval: 10000 });

// Clean up less often (every 2 minutes)
Elements.configure({ cleanupInterval: 120000 });
```

### Turn Off Smart Caching (Selector Only)

```javascript
// Disable the MutationObserver on the Selector helper
Selector.configure({ enableSmartCaching: false });
// No automatic cache invalidation — you must call Selector.clear() manually
```

### Change Debounce Delay

```javascript
// Process mutations faster
Elements.configure({ debounceDelay: 8 });

// Process mutations less frequently (group more together)
Elements.configure({ debounceDelay: 50 });
```

---

## Seeing These Systems in Action

Turn on logging to watch the background systems work:

```javascript
Elements.configure({ enableLogging: true });

// Add an element
const div = document.createElement('div');
div.id = 'test';
document.body.appendChild(div);
// (MutationObserver detects addition — caches it silently)

// Access it
Elements.test;  // Cache miss first time

// Access again
Elements.test;  // Cache hit

// Remove it
div.remove();
// Console: (MutationObserver detects removal — invalidates cache)

// Wait for cleanup timer...
// Console: [Elements] Cleanup completed. Removed 0 stale entries.
// (0 because MutationObserver already handled it)
```

---

## How They Work Together

```
┌─────────────────────────────────────────────────────┐
│                  Cache Health System                 │
│                                                     │
│  MutationObserver (immediate, reactive)             │
│  ├── Catches: elements added/removed/changed        │
│  ├── Response time: ~16ms (debounced)               │
│  └── Invalidates specific affected cache entries     │
│                                                     │
│  Cleanup Timer (periodic, proactive)                │
│  ├── Catches: anything the observer might miss      │
│  ├── Response time: every 30 seconds                │
│  └── Scans entire cache for stale entries            │
│                                                     │
│  Max Cache Size (passive, on-demand)                │
│  ├── Catches: cache growing too large               │
│  └── Evicts oldest entry when limit reached          │
│                                                     │
│  Together: Cache is always fresh and bounded         │
└─────────────────────────────────────────────────────┘
```

---

## Summary

| System | Purpose | Speed | Configurable? |
|--------|---------|-------|--------------|
| **MutationObserver** | Reacts to DOM changes, invalidates affected cache entries | Instant (~16ms debounce) | `debounceDelay`, `enableSmartCaching` (Selector) |
| **Cleanup Timer** | Periodic safety-net scan for stale entries | Every 30s (default) | `autoCleanup`, `cleanupInterval` |
| **Max Cache Size** | Prevents unlimited cache growth | On demand | `maxCacheSize` |

> **Simple Rule to Remember:** You don't need to manage the cache manually. The MutationObserver handles most changes instantly, the cleanup timer catches the rest, and the max cache size prevents memory bloat. The system is designed to be invisible — it just works.