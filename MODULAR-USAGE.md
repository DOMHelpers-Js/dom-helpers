# 📦 Modular Usage Guide

DOM Helpers JS is built as separate modules so you can include only what you need!

## 📊 Module Sizes

| Module | Minified | Gzipped | Description |
|--------|----------|---------|-------------|
| **Full Bundle** | 186 KB | 37 KB | Everything (all modules) |
| **Core** | 53 KB | 9.7 KB | Elements, Collections, Selector, createElement |
| **Enhancers** | 99 KB | 17.5 KB | Core + Bulk updates, shortcuts |
| **Conditions** | 93 KB | 18 KB | Core + Conditional rendering |
| **Reactive** | 99 KB | 21 KB | Core + Reactive state management |

## 🌐 CDN Links (jsDelivr)

### Full Bundle (All Features)
```html
<!-- Minified (Production) -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.min.js"></script>

<!-- Unminified (Development) -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.umd.js"></script>
```

### Core Module Only (Smallest)
```html
<!-- Just Elements, Collections, Selector, createElement -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.core.min.js"></script>
```

### Core + Enhancers
```html
<!-- Core + Bulk updates, shortcuts, indexed updates -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.enhancers.min.js"></script>
```

### Core + Conditions
```html
<!-- Core + Conditional rendering -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.conditions.min.js"></script>
```

### Core + Reactive
```html
<!-- Core + Reactive state management -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.reactive.min.js"></script>
```

## 📌 Usage Examples

### Example 1: Core Only (Smallest Bundle - 9.7 KB gzipped)
Perfect for simple DOM manipulation without reactive features.

```html
<!DOCTYPE html>
<html>
<head>
  <title>Core Only Example</title>
</head>
<body>
  <h1 id="title">Hello</h1>
  <button id="btn">Click Me</button>
  <div class="items">Item 1</div>

  <script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.core.min.js"></script>
  <script>
    // Simple DOM updates
    Elements.title.update({
      textContent: 'Welcome!',
      style: { color: 'blue' }
    });

    // Update collections
    Collections.ClassName.items.update({
      style: { padding: '10px' }
    });

    // Create elements
    const newDiv = createElement('div', {
      textContent: 'Dynamic Content'
    });
    document.body.appendChild(newDiv);
  </script>
</body>
</html>
```

### Example 2: Core + Reactive (21 KB gzipped)
For apps needing reactive state management.

```html
<!DOCTYPE html>
<html>
<head>
  <title>Reactive Example</title>
</head>
<body>
  <h1 id="counter">Count: 0</h1>
  <button id="increment">+</button>
  <input id="name" type="text" placeholder="Enter name">
  <p id="greeting"></p>

  <script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.reactive.min.js"></script>
  <script>
    // Create reactive state
    const state = ReactiveUtils.state({
      count: 0,
      name: ''
    });

    // Auto-bind to DOM
    state.$bind({
      '#counter': () => `Count: ${state.count}`,
      '#greeting': () => state.name ? `Hello, ${state.name}!` : ''
    });

    // Event handlers
    Elements.increment.addEventListener('click', () => {
      state.count++;
    });

    Elements.name.addEventListener('input', (e) => {
      state.name = e.target.value;
    });
  </script>
</body>
</html>
```

### Example 3: Core + Enhancers (17.5 KB gzipped)
For bulk operations and shortcuts.

```html
<!DOCTYPE html>
<html>
<head>
  <title>Enhancers Example</title>
</head>
<body>
  <h1 id="title">Title</h1>
  <p id="desc">Description</p>
  <button id="btn">Button</button>

  <script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.enhancers.min.js"></script>
  <script>
    // Bulk property updates
    Elements.textContent({
      title: 'New Title',
      desc: 'New Description',
      btn: 'Click Me'
    });

    // Bulk style updates
    Elements.style({
      title: { color: 'blue', fontSize: '32px' },
      desc: { color: 'gray', lineHeight: '1.6' },
      btn: { padding: '10px 20px', backgroundColor: '#007bff' }
    });

    // Bulk classList updates
    Elements.classes({
      btn: { add: ['btn', 'btn-primary'] }
    });
  </script>
</body>
</html>
```

### Example 4: Combining Modules Manually
You can load core + specific modules:

```html
<!-- Load Core first -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.core.min.js"></script>

<!-- Then load additional modules (they all include core, so this works but has duplication) -->
<!-- Better to use pre-combined builds above -->
```

## 📦 npm Installation (Modular)

```bash
npm install dom-helpers-js
```

### Import Full Bundle
```javascript
import { Elements, Selector, ReactiveUtils } from 'dom-helpers-js';
```

### Import Core Only
```javascript
import { Elements, Selector } from 'dom-helpers-js/dist/dom-helpers.core.esm.js';
```

### Import Specific Modules
```javascript
// Core + Reactive
import { Elements, ReactiveUtils } from 'dom-helpers-js/dist/dom-helpers.reactive.esm.js';

// Core + Enhancers
import { Elements } from 'dom-helpers-js/dist/dom-helpers.enhancers.esm.js';

// Core + Conditions
import { Elements } from 'dom-helpers-js/dist/dom-helpers.conditions.esm.js';
```

## 🎯 Which Module Should I Use?

### Use **Core** if:
- ✅ Simple DOM manipulation
- ✅ Element access and updates
- ✅ No reactive state needed
- ✅ Smallest bundle size priority
- **Size: 9.7 KB gzipped**

### Use **Core + Reactive** if:
- ✅ Need reactive state management
- ✅ Forms with validation
- ✅ Async state handling
- ✅ Two-way data binding
- **Size: 21 KB gzipped**

### Use **Core + Enhancers** if:
- ✅ Bulk property updates
- ✅ Shortcuts for common operations
- ✅ Index-based collection updates
- **Size: 17.5 KB gzipped**

### Use **Core + Conditions** if:
- ✅ Conditional rendering
- ✅ State-based DOM updates
- ✅ Matcher/handler patterns
- **Size: 18 KB gzipped**

### Use **Full Bundle** if:
- ✅ Need all features
- ✅ Don't care about bundle size
- ✅ Building a complex app
- **Size: 37 KB gzipped**

## 🔗 All CDN Links

### Latest Version (Auto-updates)
```html
<!-- Full -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@latest/dist/dom-helpers.min.js"></script>

<!-- Core Only -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@latest/dist/dom-helpers.core.min.js"></script>

<!-- Enhancers -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@latest/dist/dom-helpers.enhancers.min.js"></script>

<!-- Conditions -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@latest/dist/dom-helpers.conditions.min.js"></script>

<!-- Reactive -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@latest/dist/dom-helpers.reactive.min.js"></script>
```

### Specific Version (Recommended for production)
```html
<!-- Replace 2.3.1 with your version -->
<!-- Full -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.min.js"></script>

<!-- Core Only -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.core.min.js"></script>

<!-- Enhancers -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.enhancers.min.js"></script>

<!-- Conditions -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.conditions.min.js"></script>

<!-- Reactive -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.reactive.min.js"></script>
```

### Via npm CDN
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.enhancers.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.conditions.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.reactive.min.js"></script>
```

### Via unpkg
```html
<script src="https://unpkg.com/dom-helpers-js@2.3.1/dist/dom-helpers.min.js"></script>
<script src="https://unpkg.com/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
<script src="https://unpkg.com/dom-helpers-js@2.3.1/dist/dom-helpers.enhancers.min.js"></script>
<script src="https://unpkg.com/dom-helpers-js@2.3.1/dist/dom-helpers.conditions.min.js"></script>
<script src="https://unpkg.com/dom-helpers-js@2.3.1/dist/dom-helpers.reactive.min.js"></script>
```

## ⚡ Performance Tips

1. **Use Core-only** for maximum performance (9.7 KB gzipped)
2. **Lazy load modules** - Load reactive only when needed
3. **Version-lock in production** - Use specific version URLs
4. **Enable HTTP/2** - Modern browsers parallelize downloads
5. **Use CDN** - jsDelivr has global edge caching

## 🎓 Migration Guide

### From Full Bundle to Core Only
```html
<!-- Before: Full bundle (37 KB) -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.min.js"></script>

<!-- After: Core only (9.7 KB) -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.core.min.js"></script>

<!-- Remove reactive features from your code -->
<!-- ReactiveUtils, ReactiveState no longer available -->
```

### Adding Reactive Later
```html
<!-- Start with core -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.core.min.js"></script>

<!-- Later, when you need reactive features, replace with: -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.reactive.min.js"></script>
```

## 📞 Support

- [GitHub Issues](https://github.com/DOMHelpers-Js/dom-helpers/issues)
- [Full Documentation](./README.md)
- [Publishing Guide](./PUBLISHING.md)
