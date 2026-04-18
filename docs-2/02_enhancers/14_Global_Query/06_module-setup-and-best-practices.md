[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Module Setup, Integration, and Best Practices

## Quick Start (30 seconds)

```javascript
// Load in order: core first, then Global Query
// <script src="01_dh-core.js"></script>
// <script src="03_dh-global-query.js"></script>

// Now use the global functions
query('#title').update({ textContent: 'Ready!' });
queryAll('.card').update({ style: { padding: '16px' } });

// Also available on DOMHelpers
DOMHelpers.query('#title');
DOMHelpers.queryAll('.card');
```

---

## How to Load the Module

Global Query is an **enhancer module** — it builds on top of the core DOM Helpers library. Load it **after** the core:

```html
<!-- 1. Core library (required) -->
<script src="01_dh-core.js"></script>

<!-- 2. Global Query enhancer -->
<script src="03_dh-global-query.js"></script>

<!-- 3. Your code -->
<script>
  query('#app').update({ textContent: 'Hello!' });
</script>
```

### What Happens on Load

```
03_dh-global-query.js loads
   ↓
1️⃣ Checks for EnhancedUpdateUtility (from core)
   ↓
2️⃣ Creates query functions (querySelector, querySelectorAll, etc.)
   ↓
3️⃣ Adds them to the global scope (window)
   ↓
4️⃣ Creates GlobalQuery object with all functions
   ↓
5️⃣ Attaches to DOMHelpers if available
   ↓
Console: "[DOM Helpers] Global querySelector/querySelectorAll functions loaded"
```

### If Core Isn't Loaded First

If you load Global Query without the core library, you'll see a warning:

```
[Global Query] EnhancedUpdateUtility not found. Load main DOM helpers first!
```

The query functions will still work for **finding** elements, but the returned elements won't have the `.update()` method.

---

## Accessing Through DOMHelpers

All six query functions are also available on the `DOMHelpers` global object:

```javascript
// Global functions
query('#title');
queryAll('.card');
queryWithin('#sidebar', '.link');
queryAllWithin('#modal', 'input');

// Same functions on DOMHelpers
DOMHelpers.query('#title');
DOMHelpers.queryAll('.card');
DOMHelpers.queryWithin('#sidebar', '.link');
DOMHelpers.queryAllWithin('#modal', 'input');
```

Both approaches are identical — use whichever you prefer.

### The GlobalQuery Object

The module also exposes a `GlobalQuery` object with all functions plus two utility functions:

```javascript
GlobalQuery.version;          // "1.0.1"

// Query functions
GlobalQuery.query('#title');
GlobalQuery.queryAll('.card');
GlobalQuery.queryWithin('#sidebar', '.link');
GlobalQuery.queryAllWithin('#modal', 'input');
GlobalQuery.querySelector('#title');
GlobalQuery.querySelectorAll('.card');

// Utility functions
GlobalQuery.enhanceElement(rawElement);
GlobalQuery.enhanceNodeList(rawNodeList);
```

Also accessible via `DOMHelpers.GlobalQuery`:

```javascript
DOMHelpers.GlobalQuery.version;  // "1.0.1"
```

---

## Utility Functions

### enhanceElement(element)

Manually adds `.update()` to any raw DOM element:

```javascript
// You have a raw element from native code
const rawElement = document.getElementById('myDiv');

// Enhance it with .update()
const enhanced = GlobalQuery.enhanceElement(rawElement);

// Now you can use .update()
enhanced.update({
  textContent: 'Enhanced!',
  style: { color: 'blue' }
});
```

**How It Works:**

```
enhanceElement(rawElement)
   ↓
1️⃣ Is the element null? → Return as-is
   ↓
2️⃣ Already enhanced? (_hasGlobalQueryUpdate or _hasEnhancedUpdateMethod)
   → Return as-is (no double-enhancement)
   ↓
3️⃣ EnhancedUpdateUtility available?
   → Yes → enhanceElementWithUpdate(element)
   → No  → Return raw element unchanged
   ↓
4️⃣ Mark with _hasGlobalQueryUpdate flag
   ↓
5️⃣ Return enhanced element
```

**When to use it:** Most of the time, you don't need to call this directly — `query()`, `queryAll()`, and their variants do it automatically. Use it only when you have a raw element from external code (a third-party library, native DOM methods, etc.) and want to add `.update()`.

```javascript
// Element from a third-party library
const element = someLibrary.getElement();

// Enhance it to use .update()
const enhanced = GlobalQuery.enhanceElement(element);
enhanced.update({ classList: { add: ['styled'] } });
```

### enhanceNodeList(nodeList)

Manually wraps a raw `NodeList` into an enhanced collection:

```javascript
// You have a raw NodeList from native code
const rawList = document.querySelectorAll('.item');

// Enhance it into a full collection
const collection = GlobalQuery.enhanceNodeList(rawList);

// Now you get all collection features
collection.forEach(el => el.update({ style: { padding: '8px' } }));
collection.filter(el => el.classList.contains('active'));
collection.first();
collection.addClass('enhanced');
```

**What Gets Added:**

```
Raw NodeList
   ↓
enhanceNodeList()
   ↓
Enhanced Collection:
├── Array methods: forEach, map, filter, find, some, every, reduce
├── Navigation: first(), last(), at(), isEmpty(), toArray()
├── Helpers: addClass, removeClass, toggleClass, setStyle, on, off...
├── Index access: collection[0], collection[1], etc.
├── Iteration: for...of, spread [...]
└── .update() on the collection and each element
```

**When to use it:** Only when you have a raw `NodeList` from external code and want the full enhanced collection experience.

---

## Best Practices

### 1. Use Short Aliases

Prefer the short aliases for cleaner code:

```javascript
// ✅ Short and clean
query('#title');
queryAll('.card');

// Also correct, but longer
querySelector('#title');
querySelectorAll('.card');
```

### 2. Check for null with query()

`query()` returns `null` when nothing matches. Always check:

```javascript
// ✅ Safe — check before using
const element = query('#maybe-exists');
if (element) {
  element.update({ textContent: 'Found!' });
}

// ❌ Risky — will throw if element doesn't exist
query('#maybe-exists').update({ textContent: 'Found!' });
```

### 3. queryAll() Is Always Safe

`queryAll()` returns an empty collection (never `null`), so it's always safe to call methods on:

```javascript
// ✅ Safe — empty collection just does nothing
queryAll('.nonexistent').forEach(el => {
  el.update({ textContent: 'Hello' });
});

// ✅ Safe — .update() on empty collection is a no-op
queryAll('.nonexistent').update({ hidden: true });
```

### 4. Choose the Right Query Function

```
Need ONE element?
├── By any selector  → query('#id') or query('.class')
└── Inside container → queryWithin('#container', '.child')

Need ALL elements?
├── On whole page    → queryAll('.class')
└── Inside container → queryAllWithin('#container', '.child')
```

### 5. Use queryWithin for Repeated Structures

When your page has repeated patterns, scoped queries prevent ambiguity:

```javascript
// ✅ Clear — targets the exact section
queryWithin('#sidebar', '.title');

// Could match any .title on the page
query('.title');
```

### 6. Chain Helper Methods for Simple Operations

```javascript
// ✅ Clean chaining for multiple simple operations
queryAll('.btn')
  .addClass('primary')
  .setStyle({ padding: '10px' })
  .on('click', handleClick);
```

### 7. Use .update() for Complex Multi-Property Changes

```javascript
// ✅ When setting many properties at once
query('#card').update({
  textContent: 'Updated',
  style: { color: 'blue', padding: '16px' },
  classList: { add: ['active'], remove: ['pending'] },
  dataset: { status: 'complete' }
});
```

---

## Global Query vs Other DOM Helpers

Global Query works alongside the core helpers — each is suited for different situations:

| Approach | Best For | Example |
|----------|----------|---------|
| `Elements.myId` | Quick ID-based access | `Elements.header.update({...})` |
| `Collections.ClassName.btn` | Class/tag/name groups | `Collections.ClassName.btn` |
| `Selector.query.myElement` | Selector-based with caching | `Selector.query.myElement` |
| `query()` / `queryAll()` | CSS selector queries | `query('.nav > .active')` |

```javascript
// All valid — choose based on your situation:

// By ID — Elements is direct
Elements.header.update({ textContent: 'Hello' });

// By ID — query works too
query('#header').update({ textContent: 'Hello' });

// All items of a class — Collections approach
Collections.ClassName.card;

// All items of a class — queryAll approach
queryAll('.card');
```

---

## Complete API Reference

### Global Functions

| Function | What It Does | Returns |
|----------|-------------|---------|
| `query(selector)` | Find first matching element | Enhanced element or `null` |
| `queryAll(selector)` | Find all matching elements | Enhanced collection |
| `querySelector(selector)` | Same as `query()` | Enhanced element or `null` |
| `querySelectorAll(selector)` | Same as `queryAll()` | Enhanced collection |
| `queryWithin(container, sel)` | Find one inside container | Enhanced element or `null` |
| `queryAllWithin(container, sel)` | Find all inside container | Enhanced collection |

### DOMHelpers Integration

| Access Path | What It Is |
|-------------|-----------|
| `DOMHelpers.query()` | Same as global `query()` |
| `DOMHelpers.queryAll()` | Same as global `queryAll()` |
| `DOMHelpers.queryWithin()` | Same as global `queryWithin()` |
| `DOMHelpers.queryAllWithin()` | Same as global `queryAllWithin()` |
| `DOMHelpers.querySelector()` | Same as global `querySelector()` |
| `DOMHelpers.querySelectorAll()` | Same as global `querySelectorAll()` |
| `DOMHelpers.GlobalQuery` | The full GlobalQuery object |

### GlobalQuery Object

| Property/Method | What It Does |
|----------------|-------------|
| `.version` | Module version string |
| `.query()` | Find one element |
| `.queryAll()` | Find all elements |
| `.querySelector()` | Same as `.query()` |
| `.querySelectorAll()` | Same as `.queryAll()` |
| `.queryWithin()` | Scoped single query |
| `.queryAllWithin()` | Scoped multi query |
| `.enhanceElement(el)` | Add `.update()` to a raw element |
| `.enhanceNodeList(list)` | Wrap a raw NodeList into enhanced collection |

### Enhanced Collection Methods

| Category | Methods |
|----------|---------|
| **Array** | `.forEach()`, `.map()`, `.filter()`, `.find()`, `.some()`, `.every()`, `.reduce()` |
| **Navigation** | `.first()`, `.last()`, `.at(index)`, `.isEmpty()`, `.toArray()` |
| **Classes** | `.addClass()`, `.removeClass()`, `.toggleClass()` |
| **Properties** | `.setProperty()` |
| **Attributes** | `.setAttribute()` |
| **Styles** | `.setStyle()` |
| **Events** | `.on()`, `.off()` |
| **Bulk update** | `.update({...})` |

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **Loading** | Load `03_dh-global-query.js` after the core library |
| **Global access** | `query()`, `queryAll()`, `queryWithin()`, `queryAllWithin()` |
| **DOMHelpers access** | Same functions on `DOMHelpers.query()`, etc. |
| **GlobalQuery object** | `GlobalQuery.version`, utility functions, all query functions |
| **enhanceElement()** | Manually add `.update()` to a raw DOM element |
| **enhanceNodeList()** | Manually wrap a raw NodeList into an enhanced collection |
| **null safety** | `query()` can return `null` — always check. `queryAll()` returns empty collection — always safe |

> **Simple Rule to Remember:** Load Global Query after the core library, and six global functions become available. Use `query()` for one element, `queryAll()` for many. Everything is auto-enhanced with `.update()`. For raw elements from external code, use `GlobalQuery.enhanceElement()` to add `.update()` manually.