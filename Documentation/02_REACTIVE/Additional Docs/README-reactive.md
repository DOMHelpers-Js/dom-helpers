[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers - Reactive State System

## Overview

The Reactive State extension brings modern, declarative reactivity to DOM Helpers while maintaining its vanilla JavaScript philosophy. Built on native Proxy APIs, it provides automatic DOM updates when state changes, with intelligent dependency tracking and efficient updates.

## Features

✅ **Reactive State** - Proxy-based reactivity for objects and arrays  
✅ **Nested Reactivity** - Deep object/array tracking  
✅ **Unified Binding API** - Consistent across Elements, Collections, and Selector  
✅ **Smart Updates** - Only updates changed values (fine-grained diffing)  
✅ **Dependency Tracking** - Only re-runs affected bindings  
✅ **Auto Cleanup** - WeakMap + MutationObserver for memory safety  
✅ **100% Vanilla JS** - No frameworks, no virtual DOM  

---

## Installation

Include the reactive extension after the core library:

```html
<!-- Load core first -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers.min.js"></script>

<!-- Then load Reactive module -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers-reactive.min.js"></script>

```

---

## Basic Usage

### 1. Create Reactive State

```javascript
const state = Elements.state({
  count: 0,
  user: { name: "Alice", age: 25 },
  todos: ["Buy milk", "Read book"]
});
```

### 2. Bind to DOM Elements

```javascript
// Bind by ID
Elements.bind({
  counter: () => state.count,
  userName: () => state.user.name
});

// Bind by class name (all elements with class)
Collections.bind({
  'status-text': () => state.user.name
});

// Bind by CSS selector (first match)
Selector.query.bind({
  '.user-display': () => state.user.name
});

// Bind by CSS selector (all matches)
Selector.queryAll.bind({
  '.counter-display': () => state.count
});
```

### 3. Update State (DOM updates automatically!)

```javascript
state.count++;                    // Updates all bound elements
state.user.name = "Bob";          // Updates user name displays
state.todos.push("New task");     // Updates todo lists
```

---

## Binding Rules

The reactive system intelligently handles different return types:

### Primitives → textContent

```javascript
Elements.bind({
  myElement: () => state.count  // Sets textContent to "5"
});
```

### Arrays → join + textContent

```javascript
Elements.bind({
  listElement: () => state.todos  // Sets textContent to "Buy milk, Read book"
});
```

### Objects → Multiple Properties

```javascript
Elements.bind({
  myElement: () => ({
    textContent: state.user.name,
    title: `User: ${state.user.name}`,
    style: {
      color: 'blue',
      fontSize: '16px'
    },
    className: state.isActive ? 'active' : 'inactive'
  })
});
```

### DOM Nodes → Replace Children

```javascript
Elements.bind({
  container: () => {
    const div = document.createElement('div');
    div.className = 'user-card';
    div.innerHTML = `<h3>${state.user.name}</h3>`;
    return div;
  }
});
```

### Property-Specific Binding

```javascript
Elements.bind({
  myElement: {
    textContent: () => state.count,
    title: () => `Count: ${state.count}`,
    style: () => ({ color: state.isActive ? 'green' : 'red' })
  }
});
```

---

## Advanced Examples

### Nested Objects & Arrays

```javascript
const state = Elements.state({
  user: {
    profile: {
      name: "Alice",
      settings: {
        theme: "dark"
      }
    }
  },
  todos: [
    { id: 1, text: "Task 1", done: false },
    { id: 2, text: "Task 2", done: true }
  ]
});

// All levels are reactive
state.user.profile.settings.theme = "light";  // ✅ Updates
state.todos[0].done = true;                   // ✅ Updates
state.todos.push({ id: 3, text: "Task 3" }); // ✅ Updates
```

### Computed Values

```javascript
const state = Elements.state({
  firstName: "John",
  lastName: "Doe",
  price: 100,
  quantity: 2
});

Elements.bind({
  fullName: () => `${state.firstName} ${state.lastName}`,
  total: () => `$${state.price * state.quantity}`,
  discount: () => {
    const total = state.price * state.quantity;
    return total > 200 ? '20% off!' : 'No discount';
  }
});
```

### Conditional Rendering

```javascript
const state = Elements.state({
  isLoggedIn: false,
  user: { name: "Alice" }
});

Elements.bind({
  loginStatus: () => {
    if (state.isLoggedIn) {
      return {
        textContent: `Welcome, ${state.user.name}!`,
        style: { color: 'green' }
      };
    } else {
      return {
        textContent: 'Please log in',
        style: { color: 'gray' }
      };
    }
  }
});

// Toggle login
state.isLoggedIn = true;  // Updates loginStatus element
```

### Dynamic Lists

```javascript
const state = Elements.state({
  items: ['Apple', 'Banana', 'Orange']
});

Elements.bind({
  itemList: () => {
    const ul = document.createElement('ul');
    state.items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    });
    return ul;
  }
});

// List updates automatically
state.items.push('Grape');
state.items.sort();
```

### Multiple Bindings Per Element

```javascript
const state = Elements.state({
  status: 'active',
  message: 'System operational'
});

// Multiple bindings on same element
Elements.bind({
  statusIndicator: {
    textContent: () => state.message,
    className: () => `status-${state.status}`,
    style: () => ({
      backgroundColor: state.status === 'active' ? '#4caf50' : '#f44336',
      color: 'white'
    })
  }
});
```

---

## Cleanup & Unbinding

### Automatic Cleanup

The system automatically cleans up bindings when elements are removed from the DOM using MutationObserver.

### Manual Unbinding

```javascript
// Unbind by ID
Elements.unbind('myElement');

// Unbind by class name
Collections.unbind('counter-display');

// Unbind by selector
Selector.query.unbind('.user-display');
Selector.queryAll.unbind('.counter-display');
```

---

## Performance Optimization

### Fine-Grained Updates

The system only updates DOM when values actually change:

```javascript
const state = Elements.state({ count: 5 });

Elements.bind({
  counter: () => state.count
});

state.count = 5;  // ✅ No DOM update (value unchanged)
state.count = 6;  // ✅ DOM updated (value changed)
```

### Dependency Tracking

Only affected bindings are re-run:

```javascript
const state = Elements.state({
  count: 0,
  name: "Alice"
});

Elements.bind({
  counter: () => state.count,    // Only tracks 'count'
  userName: () => state.name     // Only tracks 'name'
});

state.count++;  // ✅ Only 'counter' binding runs
state.name = "Bob";  // ✅ Only 'userName' binding runs
```

### Batched Updates

Multiple state changes trigger updates efficiently:

```javascript
// All updates batched and applied once
state.user.name = "Bob";
state.user.age = 30;
state.user.email = "bob@example.com";

// or use
state.user = { 
  name: "Bob", 
  age: 30, 
  email: "bob@example.com" 
  };


```
---

## API Reference

### Elements.state(initialState)

Creates a reactive proxy for the given object.

```javascript
const state = Elements.state({ count: 0 });
```

**Returns:** Reactive proxy object

### Elements.bind(bindings)

Binds reactive functions to elements by ID.

```javascript
Elements.bind({
  elementId: () => state.value,
  // or with properties
  elementId: {
    textContent: () => state.value,
    title: () => state.tooltip
  }
});
```

### Collections.bind(bindings)

Binds reactive functions to all elements with the given class name.

```javascript
Collections.bind({
  'className': () => state.value
});
```

### Selector.query.bind(bindings)

Binds reactive functions to the first element matching the selector.

```javascript
Selector.query.bind({
  '.css-selector': () => state.value
});
```

### Selector.queryAll.bind(bindings)

Binds reactive functions to all elements matching the selector.

```javascript
Selector.queryAll.bind({
  '.css-selector': () => state.value
});
```

### Unbinding Methods

```javascript
Elements.unbind(id)
Collections.unbind(className)
Selector.query.unbind(selector)
Selector.queryAll.unbind(selector)
```

---

## Best Practices

### 1. Keep Binding Functions Pure

```javascript
// ✅ Good - pure function
Elements.bind({
  counter: () => state.count
});

// ❌ Avoid - side effects
Elements.bind({
  counter: () => {
    console.log('Update!');  // Side effect
    return state.count;
  }
});
```

### 2. Use Computed Values

```javascript
// ✅ Good - compute in binding
Elements.bind({
  total: () => state.price * state.quantity
});

// ❌ Avoid - storing computed values in state
state.total = state.price * state.quantity;  // Needs manual updates
```

### 3. Avoid Circular Dependencies

```javascript
// ❌ Avoid - circular dependency
Elements.bind({
  a: () => state.b,
  b: () => state.a  // Circular!
});
```

### 4. Batch State Updates

```javascript
// ✅ Good - batch updates
function updateUser(data) {
  state.user.name = data.name;
  state.user.age = data.age;
  state.user.email = data.email;
}

// ✅ Also good - object spread
Object.assign(state.user, data);
```

---

## Integration with Core Library

The reactive system works seamlessly with core DOM Helpers features:

```javascript
// Combine with .update() method
Elements.myButton.update({
  addEventListener: ['click', () => state.count++]
});

// Use with collections
Collections.ClassName['item'].forEach(el => {
  el.addEventListener('click', () => state.selected = el.dataset.id);
});

// Combine with selector queries
const items = Selector.queryAll('.item');
items.forEach(item => {
  item.addEventListener('click', () => {
    state.activeItem = item.textContent;
  });
});
```

---

## Browser Compatibility

The reactive system requires:
- **Proxy** (ES6)
- **WeakMap** (ES6)
- **MutationObserver** (Modern browsers)

**Supported browsers:**
- Chrome 49+
- Firefox 18+
- Safari 10+
- Edge 12+

---

## Troubleshooting

### Binding Not Updating

```javascript
// Make sure element exists
const el = document.getElementById('myElement');
console.log(el);  // Should not be null

// Check if binding was created
Elements.bind({ myElement: () => state.count });
console.log('Binding created');
```

### State Not Reactive

```javascript
// ✅ Correct - use Elements.state()
const state = Elements.state({ count: 0 });

// ❌ Wrong - plain object
const state = { count: 0 };  // Not reactive!
```

### Performance Issues

```javascript
// Avoid expensive operations in bindings
Elements.bind({
  // ❌ Expensive operation on every update
  result: () => {
    return expensiveComputation(state.data);
  }
});

// ✅ Memoize or compute only when needed
let cachedResult;
let lastData;
Elements.bind({
  result: () => {
    if (state.data !== lastData) {
      lastData = state.data;
      cachedResult = expensiveComputation(state.data);
    }
    return cachedResult;
  }
});
```

---

## Examples

See `Examples_Test/reactive-state-test.html` for comprehensive examples including:
- Basic counter
- Nested objects
- Array mutations
- Collections binding
- Selector binding
- Object return values
- DOM node rendering
- Performance testing

---

## License

MIT License - Same as DOM Helpers core library
