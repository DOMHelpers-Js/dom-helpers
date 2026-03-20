# 🚀 DOM Helpers JS

High-performance vanilla JavaScript DOM utilities with intelligent caching, reactive state management, conditional rendering, animations, and async utilities.

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
- 🔌 **Native Enhance** - Patches `getElementById`, `getElementsBy*`, `querySelector/All` to return enhanced elements automatically
- 📋 **Form Module** - Non-reactive form handling: values, validation, serialization, enhanced submission *(v2.6.0)*
- 🎬 **Animation Module** - CSS transition animations: fadeIn/Out, slideUp/Down, transforms, chains, stagger *(v2.6.0)*
- ⚡ **Async Utilities** - debounce, throttle, sanitize, enhanced fetch, parallelAll, raceWithTimeout *(v2.6.0)*

## 📦 Installation

### Via npm
```bash
npm install dom-helpers-js
```

### Via CDN (jsDelivr) - Standalone Modules!

**Full Bundle (44.6 KB gzipped) — Everything included:**

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.min.js"></script>
```

**Mix & Match individual modules:**

```html
<!-- Core Only (9.6 KB gzipped) - Standalone, smallest -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>

<!-- Enhancers (~8.4 KB) - Requires Core first! -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.enhancers.min.js"></script>

<!-- Conditions (~7.2 KB) - Requires Core first! -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.conditions.min.js"></script>

<!-- Reactive (~11.5 KB) - Requires Core first! -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.reactive.min.js"></script>

<!-- Native Enhance (~2.1 KB) - Requires Core + Enhancers first! -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.enhancers.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.native-enhance.min.js"></script>
```

**⚠️ Important:** Enhancers, Conditions, and Reactive modules require Core to be loaded first. Native Enhance requires both Core and Enhancers. The Form, Animation, and Async modules are included in the full bundle — for source-file usage see [All CDN Links](./ALL-CDN-LINKS.md).

**📚 [See Standalone Modules Guide](./STANDALONE-MODULES-GUIDE.md)** | **[All CDN Links](./ALL-CDN-LINKS.md)** | **[Native Enhance Guide](./NATIVE-ENHANCE.md)**

### Via unpkg
```html
<script src="https://unpkg.com/dom-helpers-js@2.6.0/dist/dom-helpers.min.js"></script>
<script src="https://unpkg.com/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>
```

## 🎯 Quick Start

### Modular Loading Examples

**Core Only (Smallest - 9.6 KB):**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>
<script>
  Elements.title.update({ textContent: 'Core Only!', style: { color: 'blue' } });
  Collections.ClassName.items.update({ style: { padding: '10px' } });
</script>
```

**Core + Reactive (~21.1 KB):**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.reactive.min.js"></script>
<script>
  const state = ReactiveUtils.state({ count: 0 });
  Elements.btn.addEventListener('click', () => state.count++);
</script>
```

**Core + Enhancers (~18.0 KB):**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.enhancers.min.js"></script>
<script>
  Elements.textContent({ title: 'New Title', desc: 'New Description' });
  Elements.style({ title: { color: 'blue' }, desc: { color: 'gray' } });
</script>
```

**Full Bundle + Native Enhance (~46.7 KB):**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.native-enhance.min.js"></script>
<script>
  const btn = document.getElementById('submit-btn');
  btn.update({ textContent: 'Submit', disabled: false });

  const cards = document.querySelectorAll('.card');
  cards.update({ classList: { add: 'loaded' } });
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

  <script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.6.0/dist/dom-helpers.min.js"></script>
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
import { Elements, Selector, createElement, ReactiveUtils, Forms, Animation, AsyncHelpers } from 'dom-helpers-js';

// Update element by ID
Elements.myButton.update({
  textContent: 'Click Me',
  style: { backgroundColor: '#007bff', color: 'white' },
  addEventListener: ['click', () => alert('Clicked!')]
});

// Query selector
const header = Selector.query('#header');
header.update({ textContent: 'New Title' });

// Reactive state
const state = ReactiveUtils.state({ name: 'John', age: 30 });
state.$watch('name', (newVal) => console.log('Name changed:', newVal));
state.name = 'Jane';
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
  title:    { textContent: 'New Title', style: { fontSize: '24px' } },
  subtitle: { textContent: 'New Subtitle' },
  button:   { disabled: false }
});
```

### Collections - Class/Tag Access

```javascript
// Access by class name
Collections.ClassName.items.forEach(el => console.log(el.textContent));

// Access by tag name
Collections.TagName.div.update({ style: { border: '1px solid #ccc' } });

// Access by name attribute
Collections.Name.username.update({ placeholder: 'Enter username' });
```

### Selector - Query Selector

```javascript
// Single element
const element = Selector.query('#myId .myClass');
element.update({ textContent: 'Updated' });

// Multiple elements
const elements = Selector.queryAll('.items');
elements.update({ style: { color: 'blue' }, classList: { add: 'highlight' } });

// Scoped queries
Selector.Scoped.within('#container', '.item').update({ textContent: 'Scoped Update' });
```

### createElement - Enhanced Element Creation

```javascript
const button = createElement('button', {
  textContent: 'Click Me',
  className: 'btn btn-primary',
  style: { padding: '10px 20px' },
  addEventListener: ['click', () => alert('Clicked!')]
});

// Bulk creation
const elements = createElement.bulk({
  DIV:      { className: 'container' },
  H1:       { textContent: 'Title', style: { color: 'blue' } },
  P:        { textContent: 'Description' },
  BUTTON_1: { textContent: 'Button 1' },
  BUTTON_2: { textContent: 'Button 2' }
});
```

### Native Enhance — Patch Native DOM Methods

```javascript
// After loading dom-helpers.native-enhance.min.js:
const btn = document.getElementById('submit-btn');
btn.update({ textContent: 'Submit', disabled: false });

document.getElementById.update({
  title:   { textContent: 'Welcome!', style: { color: '#333' } },
  spinner: { hidden: true }
});

const cards = document.getElementsByClassName('card');
cards.update({ classList: { add: 'animated' } });

const inputs = document.querySelectorAll('input[required]');
inputs.update({ classList: { add: 'required-field' } });
```

**📖 [Full Native Enhance documentation](./NATIVE-ENHANCE.md)**

---

## 📋 Form Module *(v2.6.0)*

Access any form by ID and get values, validate, and submit — all in a few lines.

```javascript
// Access a form by its id attribute
const form = Forms.contactForm;

// Read all field values as a plain object
const data = form.values; // { name: 'Alice', email: 'alice@example.com', ... }

// Write values back
form.values = { name: 'Bob', email: 'bob@example.com' };

// Validate with custom rules
const result = form.validate({
  email:   { required: true, email: true },
  message: { required: true, minLength: 10 }
});

if (!result.isValid) return; // errors are shown automatically on the form

// Submit via fetch
const response = await form.submitData({
  url:       '/api/contact',
  onSuccess: (data) => console.log('Done:', data),
  onError:   (err)  => console.log('Failed:', err.message)
});
```

### Enhanced submission (with `02_dh-form-enhance.js`)

When the enhancement layer is loaded, `form.submitData()` gains a full production pipeline:

```javascript
await form.submitData({
  url:            '/api/contact',
  successMessage: 'Message sent!',
  resetOnSuccess: true,
  retryAttempts:  2,
  timeout:        15000
});
// Automatically: disables buttons, shows spinner, retries on failure,
// shows success/error message, re-enables buttons.
```

### Declarative forms — zero JavaScript required

```html
<form
  id="contactForm"
  data-enhanced
  data-submit-url="/api/contact"
  data-success-message="Message sent!"
  data-reset-on-success
>
  <input type="text"  name="name"  required>
  <input type="email" name="email" required>
  <button type="submit">Send</button>
</form>
```

### Unified validators

```javascript
const v = Forms.validators; // also at FormEnhancements.validators

form.validate({
  username: v.combine(
    v.required('Username is required'),
    v.minLength(3),
    v.pattern('^[a-zA-Z0-9_]+$', 'Letters, numbers, and _ only')
  ),
  email:    v.combine(v.required(), v.email()),
  password: v.combine(v.required(), v.minLength(8)),
  confirm:  v.match('password', 'Passwords do not match')
});
```

---

## 🎬 Animation Module *(v2.6.0)*

CSS transition animations added automatically to every element and collection.

```javascript
// Fade in/out
await Elements.modal.fadeIn({ duration: 300, easing: 'ease-out-cubic' });
await Elements.notification.fadeOut();

// Slide
await Elements.accordion.slideDown({ duration: 350 });
await Elements.menu.slideUp();
await Elements.panel.slideToggle(); // auto-detects direction

// Transform
await Elements.card.transform({ translateX: '100px', scale: 1.05 });

// Animation chains
await Elements.toast.animate()
  .fadeIn({ duration: 250, easing: 'ease-out-back' })
  .delay(3000)
  .fadeOut({ duration: 200 })
  .next(() => Elements.toast.remove())
  .play();

// Stagger collections — each element starts 80ms after the previous
await ClassName.card.fadeIn({ duration: 400, stagger: 80 });
```

### Inside `.update()`

```javascript
Elements.card.update({
  textContent: 'Updated!',
  fadeIn: { duration: 500, easing: 'ease-out-cubic' }
});
```

### Standalone functions

```javascript
await Animation.fadeIn(document.querySelector('.hero'), { duration: 600 });
await Animation.chain(anyElement).slideDown().delay(500).fadeOut().play();
Animation.enhance(rawElement); // add animation methods to any element
```

**30 named easing curves** — `ease-out-back`, `ease-in-expo`, `ease-in-out-cubic`, and more.

---

## ⚡ Async Utilities *(v2.6.0)*

```javascript
// Debounce — wait until the user stops typing
const debouncedSearch = AsyncHelpers.debounce(async (query) => {
  const results = await AsyncHelpers.fetchJSON(`/api/search?q=${query}`);
  renderResults(results);
}, 350);

searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));

// Throttle — scroll events, at most once every 16ms
const updateProgress = AsyncHelpers.throttle(() => {
  const pct = (window.scrollY / document.body.scrollHeight) * 100;
  Elements.progressBar.update({ style: { width: `${pct}%` } });
}, 16);
window.addEventListener('scroll', updateProgress, { passive: true });

// Enhanced fetch — timeout, retry, response type, lifecycle hooks
const data = await AsyncHelpers.fetch('/api/data', {
  retries:            3,
  retryDelay:      1000,
  exponentialBackoff: true,
  timeout:         10000,
  onError: (err) => console.error('All retries failed:', err.message)
});

// Parallel requests with progress tracking
const [users, orders] = await AsyncHelpers.parallelAll([
  AsyncHelpers.fetchJSON('/api/users'),
  AsyncHelpers.fetchJSON('/api/orders')
], {
  failFast:   false,
  onProgress: (done, total) => Elements.progress.update({ textContent: `${done}/${total}` })
});

// Async event handler with automatic loading state on the button
button.addEventListener('click', AsyncHelpers.asyncHandler(async (e) => {
  await saveData();
}, {
  errorHandler: (err) => alert('Save failed: ' + err.message)
}));

// Sanitize user input before rendering
const safe = AsyncHelpers.sanitize(userInput, { removeScripts: true, removeEvents: true });
```

### Form integration (when Form module is also loaded)

```javascript
// Debounced live search inside a form
Forms.searchForm.debounceInput('[name="q"]', (e) => search(e.target.value), 400);

// Throttled character counter
Forms.longForm.throttleInput('textarea', (e) => {
  Elements.charCount.update({ textContent: `${e.target.value.length} / 500` });
}, 200);

// Sanitize all text fields before submitting
Forms.commentForm.sanitizeAll();
```

---

## 🔄 Reactive State

### Basic Reactive State

```javascript
const state = ReactiveUtils.state({ count: 0, name: 'John' });

state.$watch('count', (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

state.count++; // Triggers watcher
```

### Computed Properties

```javascript
const state = ReactiveUtils.state({ firstName: 'John', lastName: 'Doe' });

state.$computed('fullName', function() {
  return `${this.firstName} ${this.lastName}`;
});

console.log(state.fullName); // "John Doe"
state.firstName = 'Jane';
console.log(state.fullName); // "Jane Doe" (auto-updated)
```

### Reactive Forms

```javascript
const form = ReactiveUtils.form({ username: '', email: '', password: '' });

Elements.username.addEventListener('input', (e) => {
  form.$setValue('username', e.target.value);
});

console.log(form.isValid);
console.log(form.isDirty);
```

### Store Pattern

```javascript
const store = ReactiveUtils.store(
  { count: 0, user: null },
  {
    getters:  { isLoggedIn() { return this.user !== null; } },
    actions:  {
      increment(state) { state.count++; },
      setUser(state, user) { state.user = user; }
    }
  }
);

store.increment();
store.setUser({ name: 'John' });
```

---

## 🔧 Update Method Reference

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
  style: { color: 'red', backgroundColor: '#f0f0f0' },

  // Classes
  classList: { add: ['class1', 'class2'], remove: 'oldClass', toggle: 'active' },

  // Attributes
  setAttribute: { 'data-id': '123', 'aria-label': 'Button' },

  // Dataset
  dataset: { userId: '123', role: 'admin' },

  // Events
  addEventListener: ['click', handleClick],

  // Animation keys (when Animation module is loaded)
  fadeIn:      true,
  fadeOut:     { duration: 200 },
  slideDown:   { easing: 'ease-out-cubic' },
  slideToggle: true,
  transform:   { transformations: { scale: 1.1 }, options: { duration: 150 } }
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
- [All CDN Links](./ALL-CDN-LINKS.md)
- [Native Enhance Guide](./NATIVE-ENHANCE.md)
- [Publishing Guide](./PUBLISHING.md)

## 💡 Why DOM Helpers JS?

- **No Learning Curve** - Intuitive API that feels natural
- **Performance First** - Intelligent caching and optimizations
- **Framework-Free** - Use with any project or framework
- **CDN-Ready** - Drop-in script tag for quick prototyping
- **Production-Ready** - Battle-tested in real applications
- **Modular** - Load only what you need
