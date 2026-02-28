[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers Library - Complete Method Reference

## 🎯 Core Helpers

### 1. **Elements Helper** (ID-based DOM access)
Access elements by their ID with automatic caching and the `.update()` method.

#### Access Methods
- `Elements.{id}` - Get element by ID (e.g., `Elements.myButton`)
- `Elements.get(id, fallback)` - Safe access with fallback
- `Elements.exists(id)` - Check if element exists
- `Elements.isCached(id)` - Check if element is cached
- `Elements.getMultiple(...ids)` - Get multiple elements
- `Elements.destructure(...ids)` - Destructure multiple elements into object
- `Elements.getRequired(...ids)` - Get required elements (throws if missing)
- `Elements.waitFor(...ids)` - Wait for elements to appear (async)

#### Property Methods
- `Elements.setProperty(id, property, value)` - Set element property
- `Elements.getProperty(id, property, fallback)` - Get element property
- `Elements.setAttribute(id, attribute, value)` - Set attribute
- `Elements.getAttribute(id, attribute, fallback)` - Get attribute

#### Bulk Operations
- `Elements.update(updates)` - Update multiple elements by ID

#### Utility Methods
- `Elements.stats()` - Get cache statistics
- `Elements.clear()` - Clear cache
- `Elements.destroy()` - Destroy helper
- `Elements.configure(options)` - Configure helper

---

### 2. **Collections Helper** (Class/Tag/Name-based access)
Access collections of elements by class, tag name, or name attribute.

#### Access Methods
- `Collections.ClassName.{className}` or `Collections.ClassName(className)`
- `Collections.TagName.{tagName}` or `Collections.TagName(tagName)`
- `Collections.Name.{name}` or `Collections.Name(name)`

#### Bulk Operations
- `Collections.update(updates)` - Update multiple collections

#### Array-like Methods (on collections)
- `.toArray()` - Convert to array
- `.forEach(callback, thisArg)` - Iterate
- `.map(callback, thisArg)` - Map
- `.filter(callback, thisArg)` - Filter
- `.find(callback, thisArg)` - Find element
- `.some(callback, thisArg)` - Test if some match
- `.every(callback, thisArg)` - Test if all match
- `.reduce(callback, initialValue)` - Reduce

#### Utility Methods (on collections)
- `.first()` - Get first element
- `.last()` - Get last element
- `.at(index)` - Get element at index (supports negative)
- `.isEmpty()` - Check if empty
- `.item(index)` - Get element by index
- `.namedItem(name)` - Get element by name

#### DOM Manipulation (on collections)
- `.addClass(className)` - Add class to all
- `.removeClass(className)` - Remove class from all
- `.toggleClass(className)` - Toggle class on all
- `.setProperty(prop, value)` - Set property on all
- `.setAttribute(attr, value)` - Set attribute on all
- `.setStyle(styles)` - Set styles on all
- `.on(event, handler)` - Add event listener to all
- `.off(event, handler)` - Remove event listener from all

#### Filtering Methods (on collections)
- `.visible()` - Filter visible elements
- `.hidden()` - Filter hidden elements
- `.enabled()` - Filter enabled elements
- `.disabled()` - Filter disabled elements

#### Helper Methods
- `Collections.stats()` - Get statistics
- `Collections.clear()` - Clear cache
- `Collections.destroy()` - Destroy helper
- `Collections.isCached(type, value)` - Check if cached
- `Collections.getMultiple(requests)` - Get multiple collections
- `Collections.waitFor(type, value, minCount, timeout)` - Wait for elements (async)
- `Collections.enableEnhancedSyntax()` - Enable enhanced syntax
- `Collections.disableEnhancedSyntax()` - Disable enhanced syntax
- `Collections.configure(options)` - Configure helper

---

### 3. **Selector Helper** (querySelector/querySelectorAll with caching)
Query elements using CSS selectors with intelligent caching.

#### Query Methods
- `Selector.query(selector)` - querySelector (single element)
- `Selector.query.{property}` - Property-based access (enhanced syntax)
- `Selector.queryAll(selector)` - querySelectorAll (multiple elements)
- `Selector.queryAll.{property}` - Property-based collection access

#### Scoped Query Methods
- `Selector.Scoped.within(container, selector)` - Query within container (single)
- `Selector.Scoped.withinAll(container, selector)` - Query within container (multiple)

#### Bulk Operations
- `Selector.update(updates)` - Update multiple selectors

#### Array-like Methods (on queryAll results)
Same as Collections: `.toArray()`, `.forEach()`, `.map()`, `.filter()`, `.find()`, `.some()`, `.every()`, `.reduce()`, `.first()`, `.last()`, `.at()`, `.isEmpty()`

#### DOM Manipulation (on queryAll results)
Same as Collections: `.addClass()`, `.removeClass()`, `.toggleClass()`, `.setProperty()`, `.setAttribute()`, `.setStyle()`, `.on()`, `.off()`

#### Filtering Methods (on queryAll results)
Same as Collections: `.visible()`, `.hidden()`, `.enabled()`, `.disabled()`, plus `.within(selector)`

#### Async Methods
- `Selector.waitFor(selector, timeout)` - Wait for selector (async)
- `Selector.waitForAll(selector, minCount, timeout)` - Wait for multiple (async)

#### Utility Methods
- `Selector.stats()` - Get statistics
- `Selector.clear()` - Clear cache
- `Selector.destroy()` - Destroy helper
- `Selector.enableEnhancedSyntax()` - Enable enhanced syntax
- `Selector.disableEnhancedSyntax()` - Disable enhanced syntax
- `Selector.configure(options)` - Configure helper

---

## 4. 🔄 Universal `.update()` Method
Available on all elements and collections.

### Property Updates
- `textContent` - Set text content
- `innerHTML` - Set HTML content
- `id`, `className`, `value`, etc. - Set any DOM property

### Style Updates
```javascript
style: { color: 'red', fontSize: '16px' }
```

### classList Operations
```javascript
classList: {
  add: ['class1', 'class2'],
  remove: 'oldClass',
  toggle: 'active',
  replace: ['old', 'new'],
  contains: 'someClass' // for debugging
}
```

### Attribute Operations
```javascript
setAttribute: { src: 'image.png', alt: 'Description' }
// or legacy: setAttribute: ['src', 'image.png']
removeAttribute: ['disabled', 'hidden']
// or single: removeAttribute: 'disabled'
getAttribute: 'data-id' // for debugging
```

### Dataset Operations
```javascript
dataset: { userId: '123', action: 'submit' }
```

### Event Listener Operations
```javascript
addEventListener: ['click', handler, options]
// or object format:
addEventListener: {
  click: handler,
  mouseover: [handler, { passive: true }]
}
removeEventListener: ['click', handler, options]
```

### Method Calls
```javascript
focus: []
scrollIntoView: [{ behavior: 'smooth' }]
click: []
```

---

## 5. 🏗️ createElement Enhancement

### Basic Creation
- `document.createElement(tagName, options)` - Enhanced if enabled
- `createElement(tagName, options)` - Global shortcut

### Bulk Creation
- `createElement.bulk(definitions)` - Create multiple elements
- `createElement.update(definitions)` - Alias for bulk

#### Bulk Result Object Methods
- `.toArray(...tagNames)` - Get elements as array
- `.ordered(...tagNames)` - Get in specific order
- `.all` - All elements array (getter)
- `.updateMultiple(updates)` - Update multiple elements
- `.count` - Element count (getter)
- `.keys` - Array of keys (getter)
- `.has(key)` - Check if element exists
- `.get(key, fallback)` - Get with fallback
- `.forEach(callback)` - Iterate
- `.map(callback)` - Map
- `.filter(callback)` - Filter
- `.appendTo(container)` - Append all to container
- `.appendToOrdered(container, ...tagNames)` - Append specific elements

### Configuration
- `DOMHelpers.enableCreateElementEnhancement()` - Enable enhancement
- `DOMHelpers.disableCreateElementEnhancement()` - Disable enhancement

---

## 6. 🌐 DOMHelpers Global Object

### Properties
- `DOMHelpers.Elements` - Elements helper
- `DOMHelpers.Collections` - Collections helper
- `DOMHelpers.Selector` - Selector helper
- `DOMHelpers.createElement` - Enhanced createElement
- `DOMHelpers.version` - Library version

### Methods
- `DOMHelpers.isReady()` - Check if all helpers available
- `DOMHelpers.getStats()` - Get combined statistics
- `DOMHelpers.clearAll()` - Clear all caches
- `DOMHelpers.destroyAll()` - Destroy all helpers
- `DOMHelpers.configure(options)` - Configure all helpers
- `DOMHelpers.enableCreateElementEnhancement()` - Enable createElement
- `DOMHelpers.disableCreateElementEnhancement()` - Disable createElement

---

## 7. 📊 Statistics & Cache Management

### Available on all helpers:
- `.stats()` - Get performance statistics (hits, misses, hit rate, cache size)
- `.clear()` - Clear cache manually
- `.destroy()` - Clean up and remove observers
- `.configure(options)` - Update configuration

### Configuration Options
```javascript
{
  enableLogging: false,
  autoCleanup: true,
  cleanupInterval: 30000,
  maxCacheSize: 1000,
  debounceDelay: 16,
  enableEnhancedSyntax: true,
  enableSmartCaching: true
}
```

---

**Total Methods: 150+** across all helpers and utilities! 🎉