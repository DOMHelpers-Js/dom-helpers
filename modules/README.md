# DOM Helpers - Modular Edition

**Version 2.3.1**

Four fully isolated, load-only-what-you-need modules extracted from the original monolithic core.

## 📦 Modules

### 1. **Elements** (`elements.js`)
ID-based DOM access with intelligent caching.

```html
<script src="modular/elements.js"></script>
<script>
  // Access elements by ID
  Elements.myButton.textContent = 'Click me!';
  
  // Use enhanced update method
  Elements.myButton.update({
    textContent: 'Updated!',
    style: { color: 'red' }
  });
</script>
```

### 2. **Collections** (`collections.js`)
Class/Tag/Name-based DOM access with caching.

```html
<script src="modular/collections.js"></script>
<script>
  // Access by class name
  Collections.ClassName.btn.forEach(el => {
    el.style.color = 'blue';
  });
  
  // Access by tag name
  Collections.TagName.div[0].textContent = 'First div';
  
  // Bulk update
  Collections.update({
    'class:btn': { style: { padding: '10px' } }
  });
</script>
```

### 3. **Selector** (`selector.js`)
querySelector/querySelectorAll with smart caching.

```html
<script src="modular/selector.js"></script>
<script>
  // Query single element
  const btn = Selector.query('.primary-btn');
  btn.textContent = 'Primary';
  
  // Query multiple elements
  const items = Selector.queryAll('.list-item');
  items.forEach(item => {
    item.classList.add('active');
  });
  
  // Bulk update
  Selector.update({
    '.btn': { style: { borderRadius: '5px' } }
  });
</script>
```

### 4. **createElement** (`createElement.js`)
Enhanced element creation with automatic update methods.

```html
<script src="modular/createElement.js"></script>
<script>
  // Create element with config
  const div = createElement('div', {
    textContent: 'Hello!',
    className: 'container',
    style: { padding: '20px' }
  });
  
  // Bulk creation
  const elements = createElement.bulk({
    H1: { textContent: 'Title' },
    P: { textContent: 'Paragraph' },
    BUTTON: { textContent: 'Click' }
  });
  
  elements.appendTo(document.body);
</script>
```

## 🎯 Key Features

### ✅ **Independence**
Each module works standalone. Load only what you need:

```html
<!-- Just Elements -->
<script src="modular/elements.js"></script>

<!-- Just Collections -->
<script src="modular/collections.js"></script>

<!-- Or pick any combination -->
<script src="modular/elements.js"></script>
<script src="modular/selector.js"></script>
```

### ✅ **Interoperability**
Modules work seamlessly together:

```html
<!-- Load multiple modules -->
<script src="modular/elements.js"></script>
<script src="modular/collections.js"></script>
<script src="modular/selector.js"></script>
<script src="modular/createElement.js"></script>

<script>
  // All work together without conflicts
  const el = Elements.myId;
  const coll = Collections.ClassName.btn;
  const sel = Selector.query('.item');
  const created = createElement('div');
</script>
```

### ✅ **No Conflicts**
- Shared utilities are duplicated in each module (self-contained)
- Global registry prevents double-registration
- Module loading order doesn't matter

## 📖 Usage Modes

### **A. Script Tags (Browser Globals)**

```html
<!DOCTYPE html>
<html>
<head>
  <script src="modular/elements.js"></script>
</head>
<body>
  <div id="myDiv">Hello</div>
  
  <script>
    Elements.myDiv.update({
      textContent: 'Updated!',
      style: { color: 'blue' }
    });
  </script>
</body>
</html>
```

### **B. ES Modules**

```javascript
// Import individual modules
import Elements from './modular/elements.js';
import Collections from './modular/collections.js';
import Selector from './modular/selector.js';
import createElement from './modular/createElement.js';

// Use them
Elements.myButton.textContent = 'Click';
Collections.ClassName.btn.forEach(el => el.click());
const item = Selector.query('.item');
const div = createElement('div');
```

### **C. CommonJS/Node.js**

```javascript
const { Elements } = require('./modular/elements.js');
const { Collections } = require('./modular/collections.js');
const { Selector } = require('./modular/selector.js');
const { createElement } = require('./modular/createElement.js');
```

### **D. AMD/RequireJS**

```javascript
require(['modular/elements', 'modular/collections'], function(Elements, Collections) {
  // Use modules
});
```

## 🔧 API Reference

### **Elements Module**

```javascript
// Access by ID
Elements.myId
Elements['my-id']

// Utility methods
Elements.get('myId', fallback)
Elements.exists('myId')
Elements.destructure('id1', 'id2', 'id3')
Elements.stats()
Elements.clear()
Elements.configure({ enableLogging: true })

// Bulk update
Elements.update({
  btn1: { textContent: 'Button 1' },
  btn2: { textContent: 'Button 2' }
})
```

### **Collections Module**

```javascript
// Access collections
Collections.ClassName.myClass
Collections.TagName.div
Collections.Name.username

// Collection methods
collection.forEach(callback)
collection.map(callback)
collection.filter(callback)
collection.first()
collection.last()
collection.toArray()

// Utility methods
Collections.stats()
Collections.clear()
Collections.configure({ enableLogging: true })

// Bulk update
Collections.update({
  'class:btn': { style: { color: 'red' } },
  'tag:p': { style: { fontSize: '14px' } }
})
```

### **Selector Module**

```javascript
// Query elements
Selector.query('.selector')
Selector.queryAll('.selector')

// Scoped queries
Selector.Scoped.within('#container', '.item')
Selector.Scoped.withinAll('#container', '.item')

// Wait for elements
await Selector.waitFor('.dynamic-element')
await Selector.waitForAll('.items', 3)

// Utility methods
Selector.stats()
Selector.clear()
Selector.configure({ enableSmartCaching: true })

// Bulk update
Selector.update({
  '.btn': { style: { padding: '10px' } },
  '#header': { textContent: 'Welcome' }
})
```

### **createElement Module**

```javascript
// Create element
const el = createElement('div')
const el2 = createElement('div', { textContent: 'Hello' })

// Bulk creation
const elements = createElement.bulk({
  H1: { textContent: 'Title', className: 'header' },
  P: { textContent: 'Content' },
  DIV_1: { className: 'container' },
  DIV_2: { className: 'sidebar' }
})

// Access created elements
elements.H1
elements.P
elements.all
elements.toArray()
elements.appendTo(document.body)

// Optional: Override native createElement
createElement.enable()   // Override document.createElement
createElement.disable()  // Restore original
```

## 🎨 Enhanced Update Method

All modules provide elements/collections with an enhanced `.update()` method:

```javascript
element.update({
  // Text content
  textContent: 'New text',
  innerHTML: '<b>Bold</b>',
  
  // Styles
  style: {
    color: 'red',
    fontSize: '16px',
    padding: '10px'
  },
  
  // Classes
  classList: {
    add: ['active', 'highlight'],
    remove: 'hidden',
    toggle: 'visible'
  },
  
  // Attributes
  setAttribute: {
    'data-id': '123',
    'aria-label': 'Button'
  },
  removeAttribute: 'disabled',
  
  // Dataset
  dataset: {
    userId: '42',
    action: 'submit'
  },
  
  // Events
  addEventListener: ['click', handler],
  // or multiple events:
  addEventListener: {
    click: handler1,
    mouseenter: handler2
  },
  
  // Regular properties
  value: 'input value',
  disabled: false,
  
  // Method calls
  focus: [],
  scrollIntoView: [{ behavior: 'smooth' }]
})
```

## 📊 Performance Features

### **Intelligent Caching**
- Elements are cached on first access
- Automatic cache invalidation via MutationObserver
- Configurable cache size limits
- Periodic cleanup of stale entries

### **Fine-Grained Updates**
- Change detection prevents unnecessary DOM updates
- Only changed properties are applied
- Event listener deduplication
- Style property comparison

### **Statistics & Monitoring**

```javascript
// Get cache statistics
Elements.stats()
// => { hits: 150, misses: 20, hitRate: 0.88, cacheSize: 45 }

Collections.stats()
Selector.stats()
```

## 🔄 Migration from Monolithic Core

If you're using the original `01_dh-core.js`:

### Before (Monolithic)
```html
<script src="Core/01_dh-core.js"></script>
<script>
  Elements.myId.textContent = 'Hello';
  Collections.ClassName.btn[0].click();
  Selector.query('.item');
</script>
```

### After (Modular - Load All)
```html
<script src="modular/elements.js"></script>
<script src="modular/collections.js"></script>
<script src="modular/selector.js"></script>
<script>
  // Same API, no changes needed!
  Elements.myId.textContent = 'Hello';
  Collections.ClassName.btn[0].click();
  Selector.query('.item');
</script>
```

### After (Modular - Selective)
```html
<!-- Only load what you need -->
<script src="modular/elements.js"></script>
<script>
  // Only Elements is available
  Elements.myId.textContent = 'Hello';
</script>
```

## 🎓 Examples

See the `examples/modular/` directory for:
- `test-independent.html` - Each module working independently
- `test-combined.html` - All modules working together
- `test-esm.html` - ES module usage
- Performance comparisons and benchmarks

## 📝 License

MIT License - Same as the main DOM Helpers library

## 🤝 Contributing

These modules are extracted from the main DOM Helpers core. Any improvements should maintain:
1. **Independence** - Each module must work standalone
2. **Interoperability** - Modules must work together seamlessly
3. **API Compatibility** - Maintain the same API as the monolithic core
4. **Performance** - No degradation in caching or update performance

## 📚 Further Reading

- [Full DOM Helpers Documentation](../../Documentation/)
- [Core Methods Reference](../../Documentation/01_CORE/)
- [Performance Guide](../../Documentation/01_CORE/Advanced%20concepts/)
