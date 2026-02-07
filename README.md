# 🚀 DOM Helpers JS

High-performance vanilla JavaScript DOM utilities with intelligent caching, reactive state management, and conditional rendering.

[![npm version](https://img.shields.io/npm/v/dom-helpers-js.svg)](https://www.npmjs.com/package/dom-helpers-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![jsDelivr](https://data.jsdelivr.com/v1/package/gh/DOMHelpers-Js/dom-helpers/badge)](https://www.jsdelivr.com/package/gh/DOMHelpers-Js/dom-helpers)

## ✨ Features

- 🎯 **Smart Element Access** - ID, class, and tag-based DOM access with automatic caching
- 🔄 **Reactive State** - Vue-like reactivity system with computed properties and watchers
- 🎨 **Chainable Updates** - Fluent API for updating multiple properties at once
- 🏎️ **High Performance** - Intelligent caching and fine-grained change detection
- 📦 **Zero Dependencies** - Pure vanilla JavaScript
- 🌐 **CDN Ready** - Use via npm or drop-in `<script>` tag
- 🔧 **TypeScript Ready** - Full type definitions included

## 📦 Installation

### Via npm
```bash
npm install dom-helpers-js
```

### Via CDN (jsDelivr) - Standalone Modules!

**5 Independent Modules - Mix & Match:**

```html
<!-- 1. Full Bundle (37 KB gzipped) - Everything included -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.min.js"></script>

<!-- 2. Core Only (9.7 KB gzipped) - Standalone, smallest -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>

<!-- 3. Enhancers Only (~8 KB) - Requires Core first! -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.enhancers.min.js"></script>

<!-- 4. Conditions Only (~8 KB) - Requires Core first! -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.conditions.min.js"></script>

<!-- 5. Reactive Only (~11 KB) - Requires Core first! -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.reactive.min.js"></script>
```

**⚠️ Important:** Enhancers, Conditions, and Reactive modules require Core to be loaded first!

**📚 [See Standalone Modules Guide](./STANDALONE-MODULES-GUIDE.md)** | **[All CDN Links](./ALL-CDN-LINKS.md)**

### Via unpkg
```html
<script src="https://unpkg.com/dom-helpers-js@2.3.1/dist/dom-helpers.min.js"></script>
<script src="https://unpkg.com/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
```

## 🎯 Quick Start

### Modular Loading Examples

**Core Only (Smallest - 9.7 KB):**
```html
<!-- Load just the essentials -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
<script>
  Elements.title.update({ textContent: 'Core Only!', style: { color: 'blue' } });
  Collections.ClassName.items.update({ style: { padding: '10px' } });
</script>
```

**Core + Reactive (~21 KB):**
```html
<!-- Load Core first, then Reactive -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.reactive.min.js"></script>
<script>
  const state = ReactiveUtils.state({ count: 0 });
  Elements.btn.addEventListener('click', () => state.count++);
</script>
```

**Core + Enhancers (~18 KB):**
```html
<!-- Load Core first, then Enhancers -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.enhancers.min.js"></script>
<script>
  // Bulk updates available!
  Elements.textContent({ title: 'New Title', desc: 'New Description' });
  Elements.style({ title: { color: 'blue' }, desc: { color: 'gray' } });
</script>
```

### CDN Usage (Browser Globals)

```html
<!DOCTYPE html>
<html>
<head>
  <title>DOM Helpers Example</title>
</head>
<body>
  <h1 id="title">Hello</h1>
  <button id="counter">Count: 0</button>
  <div class="items">Item 1</div>
  <div class="items">Item 2</div>

  <script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.min.js"></script>
  <script>
    // Access elements by ID
    Elements.title.update({
      textContent: 'Welcome!',
      style: { color: 'blue', fontSize: '32px' }
    });

    // Update all elements with class
    Collections.ClassName.items.update({
      style: { padding: '10px', background: '#f0f0f0' }
    });

    // Reactive counter
    const state = ReactiveUtils.state({ count: 0 });
    
    Elements.counter.addEventListener('click', () => {
      state.count++;
      Elements.counter.textContent = `Count: ${state.count}`;
    });
  </script>
</body>
</html>
```

### npm/Module Usage

```javascript
import { Elements, Selector, createElement, ReactiveUtils } from 'dom-helpers-js';

// Update element by ID
Elements.myButton.update({
  textContent: 'Click Me',
  style: { backgroundColor: '#007bff', color: 'white' },
  addEventListener: ['click', () => alert('Clicked!')]
});

// Query selector
const header = Selector.query('#header');
header.update({ textContent: 'New Title' });

// Create element
const div = createElement('div', {
  className: 'container',
  textContent: 'Hello World',
  style: { padding: '20px' }
});
document.body.appendChild(div);

// Reactive state
const state = ReactiveUtils.state({ name: 'John', age: 30 });
state.$watch('name', (newVal) => console.log('Name changed:', newVal));
state.name = 'Jane'; // Triggers watcher
```

## 📚 Core APIs

### Elements - ID-based Access

```javascript
// Direct access by ID
Elements.myButton.textContent = 'Click Me';
Elements.myButton.style.color = 'red';

// Chainable updates
Elements.myButton.update({
  textContent: 'Submit',
  style: { color: 'white', backgroundColor: '#007bff' },
  disabled: false,
  addEventListener: ['click', handleClick]
});

// Bulk updates
Elements.update({
  title: { textContent: 'New Title', style: { fontSize: '24px' } },
  subtitle: { textContent: 'New Subtitle' },
  button: { disabled: false }
});
```

### Collections - Class/Tag Access

```javascript
// Access by class name
Collections.ClassName.items.forEach(el => {
  console.log(el.textContent);
});

// Access by tag name
Collections.TagName.div.update({
  style: { border: '1px solid #ccc' }
});

// Access by name attribute
Collections.Name.username.update({
  placeholder: 'Enter username'
});

// Bulk update collections
Collections.update({
  'class:btn': { style: { padding: '10px 20px' } },
  'tag:p': { style: { lineHeight: '1.6' } }
});
```

### Selector - Query Selector

```javascript
// Single element
const element = Selector.query('#myId .myClass');
element.update({ textContent: 'Updated' });

// Multiple elements
const elements = Selector.queryAll('.items');
elements.update({
  style: { color: 'blue' },
  classList: { add: 'highlight' }
});

// Scoped queries
Selector.Scoped.within('#container', '.item').update({
  textContent: 'Scoped Update'
});

// Bulk updates
Selector.update({
  '#header': { textContent: 'Header' },
  '.btn': { style: { padding: '10px' } },
  'input[type="text"]': { placeholder: 'Enter text...' }
});
```

### createElement - Enhanced Element Creation

```javascript
// Create single element
const button = createElement('button', {
  textContent: 'Click Me',
  className: 'btn btn-primary',
  style: { padding: '10px 20px' },
  addEventListener: ['click', () => alert('Clicked!')]
});

// Bulk creation
const elements = createElement.bulk({
  DIV: { className: 'container' },
  H1: { textContent: 'Title', style: { color: 'blue' } },
  P: { textContent: 'Description' },
  BUTTON_1: { textContent: 'Button 1' },
  BUTTON_2: { textContent: 'Button 2' }
});

// Access created elements
document.body.appendChild(elements.DIV);
elements.DIV.appendChild(elements.H1);
elements.DIV.appendChild(elements.P);

// Get as array
const allElements = elements.all; // [div, h1, p, button, button]
const ordered = elements.ordered('H1', 'P'); // [h1, p]
```

## 🔄 Reactive State

### Basic Reactive State

```javascript
const state = ReactiveUtils.state({ 
  count: 0, 
  name: 'John' 
});

// Watch changes
state.$watch('count', (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

state.count++; // Triggers watcher
```

### Computed Properties

```javascript
const state = ReactiveUtils.state({ 
  firstName: 'John', 
  lastName: 'Doe' 
});

state.$computed('fullName', function() {
  return `${this.firstName} ${this.lastName}`;
});

console.log(state.fullName); // "John Doe"
state.firstName = 'Jane';
console.log(state.fullName); // "Jane Doe" (auto-updated)
```

### Reactive Forms

```javascript
const form = ReactiveUtils.form({
  username: '',
  email: '',
  password: ''
});

// Bind to inputs
Elements.username.addEventListener('input', (e) => {
  form.$setValue('username', e.target.value);
});

// Validate
form.$setError('email', form.values.email ? null : 'Email required');

// Check state
console.log(form.isValid);  // Computed property
console.log(form.isDirty);  // Computed property
```

### Async State

```javascript
const userState = ReactiveUtils.async(null);

userState.$execute(async () => {
  const response = await fetch('/api/user');
  return response.json();
});

console.log(userState.loading);   // true during fetch
console.log(userState.data);      // Response data when complete
console.log(userState.error);     // Error if failed
console.log(userState.isSuccess); // Computed: !loading && !error
```

### Two-Way Data Binding

```javascript
const state = ReactiveUtils.state({ message: 'Hello' });

// Auto-bind to DOM
state.$bind({
  '#output': 'message',  // Simple binding
  '#count': () => state.count * 2,  // Computed binding
  '#status': {
    textContent: () => `Status: ${state.status}`,
    style: () => ({ color: state.active ? 'green' : 'red' })
  }
});

state.message = 'World';  // Auto-updates #output
```

## 🎨 Advanced Features

### Batch Updates

```javascript
ReactiveUtils.batch(() => {
  state.count++;
  state.name = 'Jane';
  state.active = true;
  // All updates batched together, triggers effects once
});
```

### Component Pattern

```javascript
const counter = ReactiveUtils.component({
  state: { count: 0 },
  
  computed: {
    doubled() { return this.count * 2; }
  },
  
  watch: {
    count(newVal) { console.log('Count:', newVal); }
  },
  
  actions: {
    increment(state) { state.count++; },
    decrement(state) { state.count--; }
  },
  
  bindings: {
    '#counter': () => counter.count,
    '#doubled': () => counter.doubled
  },
  
  mounted() {
    console.log('Component mounted');
  }
});

counter.increment();
```

### Store Pattern

```javascript
const store = ReactiveUtils.store(
  { count: 0, user: null },
  {
    getters: {
      isLoggedIn() { return this.user !== null; }
    },
    actions: {
      increment(state) { state.count++; },
      setUser(state, user) { state.user = user; }
    }
  }
);

store.increment();
store.setUser({ name: 'John' });
```

## 🔧 Update Method Reference

The `.update()` method supports all DOM properties and special handlers:

```javascript
element.update({
  // Text content
  textContent: 'Text',
  innerHTML: '<b>HTML</b>',
  
  // Properties
  value: 'input value',
  disabled: true,
  checked: true,
  
  // Styles
  style: {
    color: 'red',
    backgroundColor: '#f0f0f0',
    padding: '10px'
  },
  
  // Classes
  classList: {
    add: ['class1', 'class2'],
    remove: 'oldClass',
    toggle: 'active'
  },
  
  // Attributes
  setAttribute: {
    'data-id': '123',
    'aria-label': 'Button'
  },
  
  // Dataset
  dataset: {
    userId: '123',
    role: 'admin'
  },
  
  // Events
  addEventListener: ['click', handleClick],
  // Or multiple events
  addEventListener: {
    click: handleClick,
    mouseover: handleHover
  },
  
  // Method calls
  focus: [],
  scrollIntoView: [{ behavior: 'smooth' }]
});
```

## 📊 Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Opera: Latest 2 versions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © DOMHelpers-Js

## 🔗 Links

- [GitHub Repository](https://github.com/DOMHelpers-Js/dom-helpers)
- [npm Package](https://www.npmjs.com/package/dom-helpers-js)
- [Full Documentation](https://github.com/DOMHelpers-Js/dom-helpers#readme)
- [Publishing Guide](./PUBLISHING.md)

## 💡 Why DOM Helpers JS?

- **No Learning Curve** - Intuitive API that feels natural
- **Performance First** - Intelligent caching and optimizations
- **Small Bundle Size** - ~30KB minified, ~10KB gzipped
- **Framework-Free** - Use with any project or framework
- **CDN-Ready** - Drop-in script tag for quick prototyping
- **Production-Ready** - Battle-tested in real applications

## 🎓 More Examples

See [PUBLISHING.md](./PUBLISHING.md) for comprehensive usage examples and publishing instructions.
