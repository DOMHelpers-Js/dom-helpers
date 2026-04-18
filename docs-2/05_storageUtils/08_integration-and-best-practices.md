[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Integration with DOM Helpers & Best Practices

## Quick Start (30 seconds)

```javascript
// StorageUtils works standalone
StorageUtils.save('theme', 'dark');

// It also attaches to DOM Helpers automatically
Elements.Storage.save('theme', 'dark');       // Same as above
Collections.Storage.save('theme', 'dark');    // Same as above
Selector.Storage.save('theme', 'dark');       // Same as above
```

---

## How Integration Works

When the DOM Helpers core library is loaded **before** StorageUtils, the module automatically attaches itself as a `.Storage` property on each helper:

```
Script loading order:
1. 01_dh-core.js loads → creates Elements, Collections, Selector
2. 01_dh-storage-standalone.js loads → creates StorageUtils
   ↓
   Checks: Does Elements exist? → Yes → Elements.Storage = StorageUtils
   Checks: Does Collections exist? → Yes → Collections.Storage = StorageUtils
   Checks: Does Selector exist? → Yes → Selector.Storage = StorageUtils
```

### They're All the Same Object

`Elements.Storage`, `Collections.Storage`, `Selector.Storage`, and `StorageUtils` are all **the exact same object**:

```javascript
console.log(Elements.Storage === StorageUtils);      // true
console.log(Collections.Storage === StorageUtils);    // true
console.log(Selector.Storage === StorageUtils);       // true
```

There's no difference in behavior — it's a convenience so you can access storage from whatever helper you're already using.

### Without DOM Helpers

StorageUtils works perfectly fine on its own. If the DOM Helpers core isn't loaded, the integration step is simply skipped — no errors, no warnings:

```javascript
// If only StorageUtils is loaded (no DOM Helpers core):
StorageUtils.save('key', 'value');     // ✅ Works
StorageUtils.load('key');              // ✅ Works

// Elements.Storage would not exist — that's fine
```

---

## Coexistence with Reactive Storage

If you're using the Reactive module (which has its own storage features), StorageUtils detects it and coexists peacefully in a separate namespace:

```javascript
// Reactive storage (if loaded)
ReactiveUtils.autoSave('key', data);

// StorageUtils (separate module)
StorageUtils.save('key', data);

// Both work independently — no conflicts
```

---

## serialize() and deserialize() — Low-Level Utilities

StorageUtils exposes its serialization functions for advanced use cases:

### serialize()

Converts any value to a JSON string:

```javascript
StorageUtils.serialize({ name: 'Alice' });
// '{"name":"Alice"}'

StorageUtils.serialize(42);
// '42'

StorageUtils.serialize([1, 2, 3]);
// '[1,2,3]'

StorageUtils.serialize('hello');
// '"hello"'
```

Returns `null` if the value can't be serialized:

```javascript
const circular = {};
circular.self = circular;

StorageUtils.serialize(circular);  // null (circular reference)
```

### deserialize()

Converts a JSON string back to a value:

```javascript
StorageUtils.deserialize('{"name":"Alice"}');
// { name: 'Alice' }

StorageUtils.deserialize('42');
// 42

StorageUtils.deserialize(null, 'fallback');
// 'fallback' (null input → returns default)

StorageUtils.deserialize('invalid json', 'fallback');
// 'fallback' (parse error → returns default)
```

### When Are These Useful?

Most of the time you don't need these directly — `save()` and `load()` handle serialization for you. But they're useful when:

```javascript
// Checking if data can be serialized before saving
const data = getSomeData();
if (StorageUtils.serialize(data) !== null) {
  StorageUtils.save('key', data);
} else {
  console.log('Data cannot be saved — not serializable');
}

// Working with raw localStorage alongside StorageUtils
const raw = localStorage.getItem('externalKey');
const parsed = StorageUtils.deserialize(raw, {});
```

---

## Best Practices

### 1. Always Use Default Values in .load()

```javascript
// ❌ No default — returns null if missing
const theme = StorageUtils.load('theme');
document.body.className = theme;  // Could be null!

// ✅ With default — always returns a usable value
const theme = StorageUtils.load('theme', 'light');
document.body.className = theme;  // "light" at minimum
```

### 2. Use Namespaces for Organized Apps

```javascript
// ❌ Flat keys — risk of collision
StorageUtils.save('name', 'Alice');
StorageUtils.save('settings', { ... });

// ✅ Namespaced — organized and collision-free
StorageUtils.save('name', 'Alice', { namespace: 'user' });
StorageUtils.save('settings', { ... }, { namespace: 'app' });
```

### 3. Save Immediately Before Page Unload

Debounced auto-save might not fire before the page closes. Always save immediately on unload:

```javascript
const autoSave = StorageUtils.createAutoSave('draft');

// Debounced saves during normal use
input.addEventListener('input', () => {
  autoSave.save(input.value);
});

// Immediate save before the page closes
window.addEventListener('beforeunload', () => {
  autoSave.saveNow(input.value);
});
```

### 4. Clean Up Watchers

Always stop watchers when they're no longer needed:

```javascript
const stop = StorageUtils.watch('key', callback);

// When done (component unmount, section change, etc.)
stop();
```

### 5. Check Save Success for Critical Data

```javascript
const saved = StorageUtils.save('importantData', data);
if (!saved) {
  // Handle the failure — maybe storage is full
  alert('Could not save your data. Storage may be full.');
}
```

### 6. Use sessionStorage for Temporary Data

```javascript
// ✅ Auth tokens — should disappear when the tab closes
StorageUtils.save('token', 'abc', { storage: 'sessionStorage' });

// ✅ User preferences — should persist across sessions
StorageUtils.save('theme', 'dark');  // localStorage by default
```

---

## Complete API Quick Reference

### Basic Operations

```javascript
StorageUtils.save(key, data, options)       // → true/false
StorageUtils.load(key, defaultValue, options) // → data or default
StorageUtils.clear(key, options)            // → true/false
StorageUtils.exists(key, options)           // → true/false
```

### Advanced Operations

```javascript
StorageUtils.watch(key, callback, options)  // → cleanup function
StorageUtils.createAutoSave(key, options)   // → manager object
```

### Utilities

```javascript
StorageUtils.getInfo(options)               // → { available, keys, size, storageType }
StorageUtils.clearAll(options)              // → number of keys removed
StorageUtils.serialize(value)               // → JSON string or null
StorageUtils.deserialize(str, default)      // → parsed value or default
```

### Properties

```javascript
StorageUtils.version                        // "1.0.0"
```

### Options Object (Used by Most Methods)

```javascript
{
  storage: 'localStorage',     // or 'sessionStorage'
  namespace: 'myApp'           // optional prefix for keys
}
```

### createAutoSave Manager Methods

```javascript
manager.save(data)            // Debounced save
manager.saveNow(data)         // Immediate save
manager.load(defaultValue)    // Load from storage
manager.clear()               // Remove data and cancel pending saves
manager.stop()                // Pause auto-saving
manager.start()               // Resume auto-saving
manager.isStopped             // true/false
```

---

## Common Patterns

### Settings Manager Pattern

```javascript
const DEFAULTS = {
  theme: 'light',
  fontSize: 14,
  sidebar: true,
  language: 'en'
};

function getSettings() {
  return StorageUtils.load('settings', DEFAULTS, { namespace: 'app' });
}

function updateSettings(changes) {
  const current = getSettings();
  const updated = Object.assign({}, current, changes);
  StorageUtils.save('settings', updated, { namespace: 'app' });
  return updated;
}

// Usage
const settings = getSettings();
updateSettings({ theme: 'dark' });
```

### Feature Flag Pattern

```javascript
function isFeatureEnabled(featureName) {
  return StorageUtils.load(featureName, false, { namespace: 'features' });
}

function enableFeature(featureName) {
  StorageUtils.save(featureName, true, { namespace: 'features' });
}

// Usage
if (isFeatureEnabled('darkMode')) {
  enableDarkMode();
}
```

### Recent Items Pattern

```javascript
function addRecent(item, maxItems = 10) {
  const recent = StorageUtils.load('recent', []);

  // Remove if already in list
  const filtered = recent.filter(r => r.id !== item.id);

  // Add to front
  filtered.unshift(item);

  // Trim to max
  const trimmed = filtered.slice(0, maxItems);

  StorageUtils.save('recent', trimmed);
  return trimmed;
}

// Usage
addRecent({ id: 1, name: 'Home Page' });
addRecent({ id: 2, name: 'Settings' });
const recent = StorageUtils.load('recent', []);
```

---

## Summary

| Topic | Key Takeaway |
|-------|-------------|
| **Integration** | StorageUtils automatically attaches to `Elements.Storage`, `Collections.Storage`, `Selector.Storage` |
| **Standalone** | Works perfectly without DOM Helpers core |
| **All the same** | `Elements.Storage === StorageUtils` — they're the same object |
| **Coexistence** | Lives peacefully alongside Reactive storage in separate namespace |
| **serialize/deserialize** | Low-level utilities exposed for advanced use — usually not needed directly |
| **Best practices** | Use defaults in `.load()`, namespaces for organization, `.saveNow()` before unload, clean up watchers |

> **Simple Rule to Remember:** StorageUtils is a standalone module that plays nicely with DOM Helpers. Use `StorageUtils` directly, or access it through any helper via `.Storage`. Always use defaults, always use namespaces, and always clean up watchers.