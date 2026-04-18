[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Property, Attribute, and Cache Management

## Quick Start (30 seconds)

```javascript
// Set and get properties
Id.setProperty('myInput', 'value', 'Hello World');
const text = Id.getProperty('myDiv', 'textContent', 'default');

// Set and get attributes
Id.setAttribute('myImage', 'src', 'photo.png');
const href = Id.getAttribute('myLink', 'href', '#');

// Cache management
const stats = Id.stats();         // Get cache statistics
Id.isCached('myButton');          // Check if element is cached
Id.clearCache();                  // Clear the cache
```

---

## Property Methods

### What Are Properties?

In the DOM, **properties** are the JavaScript object properties on an element. Things like `element.value`, `element.textContent`, `element.disabled`, and `element.checked` are all properties. They represent the **current state** of an element in JavaScript.

The Id Shortcut gives you two methods to work with properties by ID — without needing to get the element first.

---

### Id.setProperty(id, property, value)

Sets a JavaScript property on an element, identified by its ID.

**Syntax:**

```javascript
Id.setProperty('elementId', 'propertyName', value);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Element ID |
| `property` | `string` | Property name to set |
| `value` | `any` | Value to assign |

**Returns:** `true` if successful, `false` if element not found or property doesn't exist.

**Examples:**

```javascript
// Set text content
Id.setProperty('pageTitle', 'textContent', 'Welcome');

// Set input value
Id.setProperty('nameInput', 'value', 'John Doe');

// Set disabled state
Id.setProperty('submitBtn', 'disabled', true);

// Set innerHTML
Id.setProperty('container', 'innerHTML', '<p>New content</p>');

// Set checked state
Id.setProperty('agreeCheckbox', 'checked', true);
```

---

### Id.getProperty(id, property, fallback)

Gets a JavaScript property from an element, with an optional fallback if the element or property doesn't exist.

**Syntax:**

```javascript
const value = Id.getProperty('elementId', 'propertyName', fallbackValue);
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `id` | `string` | — | Element ID |
| `property` | `string` | — | Property name to read |
| `fallback` | `any` | `undefined` | Value to return if not found |

**Returns:** The property value, or the fallback.

**Examples:**

```javascript
// Get input value
const name = Id.getProperty('nameInput', 'value', '');
console.log(name);  // 'John Doe' (or '' if element missing)

// Get text content
const title = Id.getProperty('pageTitle', 'textContent', 'Untitled');

// Get disabled state
const isDisabled = Id.getProperty('submitBtn', 'disabled', false);

// Get checked state
const isChecked = Id.getProperty('agreeCheckbox', 'checked', false);
```

### Real-World Example: Reading Form Data

```javascript
function getFormData() {
  return {
    name: Id.getProperty('nameInput', 'value', ''),
    email: Id.getProperty('emailInput', 'value', ''),
    message: Id.getProperty('messageArea', 'value', ''),
    subscribe: Id.getProperty('subscribeCheckbox', 'checked', false)
  };
}

const data = getFormData();
console.log(data);
// { name: 'John', email: 'john@example.com', message: 'Hi!', subscribe: true }
```

---

### How Property Methods Work

```
Id.setProperty('myInput', 'value', 'Hello')
   ↓
1️⃣ Check: Does Elements.setProperty() exist?
   ├── Yes → Use Elements.setProperty('myInput', 'value', 'Hello')
   └── No → Fallback below
   ↓
2️⃣ Get element: Id('myInput')
   ↓
3️⃣ Element found AND property exists on element?
   ├── Yes → element.value = 'Hello' → return true
   └── No → return false
```

```
Id.getProperty('myInput', 'value', '')
   ↓
1️⃣ Check: Does Elements.getProperty() exist?
   ├── Yes → Use Elements.getProperty('myInput', 'value', '')
   └── No → Fallback below
   ↓
2️⃣ Get element: Id('myInput')
   ↓
3️⃣ Element found AND property exists?
   ├── Yes → return element.value
   └── No → return '' (the fallback)
```

---

## Attribute Methods

### What Are Attributes?

**Attributes** are the values written in HTML tags — like `src="image.png"`, `href="https://example.com"`, `data-role="admin"`, etc. They're the HTML-level values, accessed via `element.setAttribute()` and `element.getAttribute()`.

**Properties vs Attributes — What's the difference?**

```html
<input id="nameInput" type="text" value="John">
```

```javascript
// Attribute: the initial HTML value
Id.getAttribute('nameInput', 'value');  // 'John' (always the original)

// Property: the current JavaScript value
Id.getProperty('nameInput', 'value');   // Could be 'Jane' if user typed
```

Simply put: **attributes** are what's in the HTML, **properties** are the live JavaScript state.

---

### Id.setAttribute(id, attribute, value)

Sets an HTML attribute on an element.

**Syntax:**

```javascript
Id.setAttribute('elementId', 'attributeName', 'value');
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Element ID |
| `attribute` | `string` | Attribute name |
| `value` | `string` | Attribute value |

**Returns:** `true` if successful, `false` if element not found.

**Examples:**

```javascript
// Set image source
Id.setAttribute('myImage', 'src', 'photo.png');

// Set link URL
Id.setAttribute('myLink', 'href', 'https://example.com');

// Set custom data attribute
Id.setAttribute('myDiv', 'data-role', 'admin');

// Set aria attribute
Id.setAttribute('navMenu', 'aria-expanded', 'true');

// Set input placeholder
Id.setAttribute('searchInput', 'placeholder', 'Search...');
```

---

### Id.getAttribute(id, attribute, fallback)

Gets an HTML attribute from an element, with a fallback if not found.

**Syntax:**

```javascript
const value = Id.getAttribute('elementId', 'attributeName', fallback);
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `id` | `string` | — | Element ID |
| `attribute` | `string` | — | Attribute name |
| `fallback` | `any` | `null` | Value if attribute or element not found |

**Returns:** The attribute value (string), or the fallback.

**Examples:**

```javascript
// Get image source
const src = Id.getAttribute('myImage', 'src', 'default.png');

// Get link URL
const href = Id.getAttribute('myLink', 'href', '#');

// Get custom data attribute
const role = Id.getAttribute('myDiv', 'data-role', 'user');

// Get aria state
const expanded = Id.getAttribute('navMenu', 'aria-expanded', 'false');
```

### Real-World Example: Dynamic Image Gallery

```javascript
function updateGalleryImage(imageId, newSrc) {
  // Save the old source as a data attribute
  const oldSrc = Id.getAttribute(imageId, 'src', '');
  Id.setAttribute(imageId, 'data-previous-src', oldSrc);

  // Set the new source
  Id.setAttribute(imageId, 'src', newSrc);
  Id.setAttribute(imageId, 'alt', 'Updated image');
}
```

---

### How Attribute Methods Work

```
Id.setAttribute('myImage', 'src', 'photo.png')
   ↓
1️⃣ Check: Does Elements.setAttribute() exist?
   ├── Yes → Use Elements.setAttribute(...)
   └── No → Fallback below
   ↓
2️⃣ Get element: Id('myImage')
   ↓
3️⃣ Element found?
   ├── Yes → element.setAttribute('src', 'photo.png') → return true
   └── No → return false
```

---

## Cache Management

### Why Does Caching Matter?

Every time you call `document.getElementById()`, the browser searches through the DOM tree. The core Elements helper avoids this by **caching** elements after the first lookup — subsequent accesses return the cached reference instantly.

Since `Id()` uses the Elements helper internally, it benefits from this same cache. The cache management methods let you inspect and control this caching behavior.

---

### Id.stats()

Gets statistics about the cache — how many lookups, how many were cache hits, etc.

**Syntax:**

```javascript
const stats = Id.stats();
```

**Returns:** An object with cache performance metrics (structure depends on the core Elements helper).

**Example:**

```javascript
// Check cache performance
const stats = Id.stats();
console.log(stats);
// Example output (depends on Elements helper implementation):
// { hitRate: 0.85, totalLookups: 100, cacheHits: 85, cacheMisses: 15 }
```

### Real-World Example: Performance Monitoring

```javascript
function logCachePerformance() {
  const stats = Id.stats();
  console.log('Cache Statistics:');
  console.log('  Hit rate:', stats.hitRate);
  console.log('  Total lookups:', stats.totalLookups);
}
```

---

### Id.isCached(id)

Checks whether a specific element is currently stored in the cache.

**Syntax:**

```javascript
const cached = Id.isCached('elementId');  // true or false
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Element ID to check |

**Returns:** `true` if the element is in the cache, `false` otherwise.

**Example:**

```javascript
// Check if an element has been cached
if (Id.isCached('heavyComponent')) {
  console.log('Already cached — access will be instant');
} else {
  console.log('Not cached yet — first access will do a DOM lookup');
}
```

---

### Id.clearCache()

Clears the entire Elements cache. This is useful after **major DOM changes** — like removing many elements, loading a completely new page section, or resetting the application state.

**Syntax:**

```javascript
Id.clearCache();
```

**Example:**

```javascript
// After dynamically removing and recreating elements
function resetPage() {
  document.getElementById('app').innerHTML = newPageHTML;

  // Old cached references are now stale — clear them
  Id.clearCache();

  // Now Id() will do fresh lookups
  Id('newHeader').update({ textContent: 'Fresh Page' });
}
```

### When to Clear the Cache

| Scenario | Should You Clear? |
|----------|------------------|
| Normal page usage | No — cache handles this |
| Element removed and re-created with same ID | Yes |
| Large section of DOM replaced | Yes |
| Single element updated | No — same reference still valid |
| Page navigation in SPA | Yes |

---

### How Cache Methods Work

```
Id.stats()
   ↓
Check: Does Elements.stats() exist?
   ├── Yes → return Elements.stats()
   └── No → return {}

Id.isCached('myButton')
   ↓
Check: Does Elements.isCached() exist?
   ├── Yes → return Elements.isCached('myButton')
   └── No → return false

Id.clearCache()
   ↓
Check: Does Elements.clear() exist?
   ├── Yes → Elements.clear()
   └── No → (no-op)
```

All cache methods delegate to the core Elements helper. If the helper doesn't support a specific cache method, the Id Shortcut provides safe fallbacks (empty object, `false`, or no-op).

---

## Id.Elements — Direct Access

The `Id.Elements` property gives you direct access to the underlying Elements helper:

```javascript
// Access the core Elements helper
Id.Elements;  // Same as the global Elements object

// These are equivalent:
Id('myButton');
Id.Elements.myButton;
Elements.myButton;
```

This is useful if you need access to Elements helper methods that aren't exposed through the Id Shortcut.

---

## Complete API Reference

| Method | What It Does | Returns |
|--------|-------------|---------|
| `Id(id)` | Get element by ID | Element or `null` |
| `Id.multiple(...ids)` | Get multiple elements | Object `{id: element}` |
| `Id.required(...ids)` | Get elements (throws if missing) | Object `{id: element}` |
| `Id.waitFor(id, timeout)` | Wait for element to appear | `Promise<Element>` |
| `Id.exists(id)` | Check if element exists | `boolean` |
| `Id.get(id, fallback)` | Get element with fallback | Element or fallback |
| `Id.update(updates)` | Bulk update by ID | Results object |
| `Id.setProperty(id, prop, val)` | Set a JavaScript property | `boolean` |
| `Id.getProperty(id, prop, fb)` | Get a JavaScript property | Value or fallback |
| `Id.setAttribute(id, attr, val)` | Set an HTML attribute | `boolean` |
| `Id.getAttribute(id, attr, fb)` | Get an HTML attribute | Value or fallback |
| `Id.stats()` | Cache statistics | Stats object |
| `Id.isCached(id)` | Check if element is cached | `boolean` |
| `Id.clearCache()` | Clear the element cache | `void` |
| `Id.Elements` | Direct Elements helper reference | Elements object |

---

## Best Practices

### 1. Use the Right Method for the Job

```javascript
// Need the element itself? → Id()
const btn = Id('submitBtn');
btn.update({ textContent: 'Submit' });

// Just checking existence? → Id.exists()
if (Id.exists('optionalWidget')) { /* ... */ }

// Need a guaranteed non-null value? → Id.get()
const container = Id.get('app', document.body);

// Updating multiple elements? → Id.update()
Id.update({
  header: { textContent: 'Title' },
  footer: { textContent: 'Footer' }
});
```

### 2. Use Fallbacks for Robustness

```javascript
// Property access with safe defaults
const username = Id.getProperty('nameInput', 'value', 'Anonymous');
const role = Id.getAttribute('userBadge', 'data-role', 'guest');
```

### 3. Clear Cache After Major DOM Changes

```javascript
function loadNewSection(html) {
  Id('contentArea').innerHTML = html;
  Id.clearCache();  // Stale references are gone
}
```

### 4. Use Id.required() for Critical App Setup

```javascript
function bootApp() {
  try {
    const { app, nav, main } = Id.required('app', 'nav', 'main');
    // All three guaranteed to exist
  } catch (e) {
    console.error('App cannot start:', e.message);
  }
}
```

---

## Summary

| Category | Methods | Key Takeaway |
|----------|---------|-------------|
| **Property access** | `setProperty`, `getProperty` | Read/write JavaScript properties by ID |
| **Attribute access** | `setAttribute`, `getAttribute` | Read/write HTML attributes by ID |
| **Cache management** | `stats`, `isCached`, `clearCache` | Inspect and control the Elements cache |
| **Direct access** | `Id.Elements` | Reference to the underlying Elements helper |

> **Simple Rule to Remember:** Use `setProperty`/`getProperty` for JavaScript properties (`.value`, `.textContent`, `.disabled`), use `setAttribute`/`getAttribute` for HTML attributes (`src`, `href`, `data-*`), and clear the cache when you've made major DOM changes.