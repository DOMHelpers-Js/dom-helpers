[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Bindings and DOM Integration

Bindings connect reactive state to DOM elements so the UI **automatically updates** when state changes. No manual DOM manipulation needed.

---

## Two approaches

| Approach | How it works | Best for |
|----------|-------------|---------|
| **bindings()** | Standalone function — any selector | General-purpose binding |
| **Elements.bind()** | ID-based — pass element IDs without `#` | Targeting by ID |
| **Collections.bind()** | Class-based — pass class names without `.` | Targeting by class |
| **Selector.bind()** | CSS selector — any query | Complex selectors |

---

## bindings() — Standalone function

### What is it?

`ReactiveUtils.bindings()` takes a map of CSS selectors to binding definitions and creates reactive effects that keep the DOM in sync with your data.

### Syntax

```javascript
const cleanup = ReactiveUtils.bindings({
  '#counter': () => app.count,
  '.status': {
    textContent: () => app.status,
    style: () => ({ color: app.isActive ? 'green' : 'red' })
  }
});

// Later: remove all bindings
cleanup();
```

### Simple function binding

A function that returns a value — sets the element's `textContent`:

```javascript
const app = ReactiveUtils.state({ count: 0 });

const cleanup = ReactiveUtils.bindings({
  '#counter': () => app.count
});

app.count = 42;  // #counter shows "42" automatically
```

### Object binding — multiple properties

An object where each key is a DOM property and each value is a function:

```javascript
const app = ReactiveUtils.state({ name: 'Alice', isOnline: true });

const cleanup = ReactiveUtils.bindings({
  '#userCard': {
    textContent: () => app.name,
    style: () => ({
      borderColor: app.isOnline ? 'green' : 'gray',
      opacity: app.isOnline ? '1' : '0.5'
    })
  }
});
```

### Selectors — ID, class, and CSS

```javascript
const cleanup = ReactiveUtils.bindings({
  // ID selector
  '#header': () => app.title,

  // Class selector — applies to ALL matching elements
  '.status-badge': () => app.status,

  // Any CSS selector
  'nav > a.active': {
    textContent: () => app.currentPage
  }
});
```

### Cleanup

`bindings()` returns a cleanup function. Call it to stop all reactive updates:

```javascript
const cleanup = ReactiveUtils.bindings({ /* ... */ });

// Later — stop all bindings
cleanup();
```

---

## Elements.bind() — ID-based bindings

### What is it?

When the DOMHelpers `Elements` module is loaded, `Elements.bind()` provides a shorthand for ID-based bindings. You pass element IDs **without** the `#` prefix.

### Syntax

```javascript
Elements.bind({
  counter: () => app.count,
  greeting: () => `Hello, ${app.name}!`,
  status: {
    textContent: () => app.status,
    style: () => ({ color: app.isActive ? 'green' : 'red' })
  }
});
```

### Simple binding

```javascript
const app = ReactiveUtils.state({ count: 0 });

Elements.bind({
  counter: () => app.count  // Binds to id="counter"
});

app.count = 42;  // Element with id="counter" shows "42"
```

### Multi-property binding

```javascript
Elements.bind({
  userCard: {
    textContent: () => app.userName,
    style: () => ({
      backgroundColor: app.isAdmin ? '#f0f9ff' : '#fff'
    })
  }
});
```

---

## Collections.bind() — Class-based bindings

### What is it?

When the DOMHelpers `Collections` module is loaded, `Collections.bind()` targets elements by **class name** — without the `.` prefix. The binding applies to **all elements** with that class.

### Syntax

```javascript
Collections.bind({
  'status-badge': () => app.status,   // All .status-badge elements
  'user-name': () => app.name         // All .user-name elements
});
```

### Example

```html
<span class="user-name">Loading...</span>
<span class="user-name">Loading...</span>
<span class="user-name">Loading...</span>
```

```javascript
const app = ReactiveUtils.state({ name: 'Alice' });

Collections.bind({
  'user-name': () => app.name
});

app.name = 'Bob';
// ALL three .user-name elements now show "Bob"
```

---

## Selector.bind() — CSS selector bindings

### What is it?

When the DOMHelpers `Selector` module is loaded, it provides two bind methods:

- `Selector.query.bind()` — targets the **first** matching element (like `querySelector`)
- `Selector.queryAll.bind()` — targets **all** matching elements (like `querySelectorAll`)

### Syntax

```javascript
// Single element
Selector.query.bind({
  'nav > .active': () => app.currentPage
});

// All matching elements
Selector.queryAll.bind({
  'ul.todo-list > li': {
    style: () => ({ color: app.theme === 'dark' ? '#fff' : '#000' })
  }
});
```

---

## How values are applied to elements

When a binding function returns a value, here's how it's applied to the DOM element:

### Primitive values (string, number, boolean)

```javascript
// With a property name — sets the property
Elements.bind({
  myInput: {
    value: () => app.inputValue,       // el.value = '...'
    disabled: () => app.isDisabled     // el.disabled = true/false
  }
});

// Without a property name — sets textContent
Elements.bind({
  counter: () => app.count             // el.textContent = '42'
});
```

### Objects

```javascript
// style — applies each CSS property
Elements.bind({
  box: {
    style: () => ({
      color: 'blue',
      backgroundColor: '#f0f0f0',
      fontSize: '18px'
    })
  }
});

// dataset — sets data attributes
Elements.bind({
  card: {
    dataset: () => ({
      userId: app.userId,              // data-user-id="123"
      role: app.role                   // data-role="admin"
    })
  }
});
```

### Arrays

```javascript
// classList — joins into className
Elements.bind({
  card: {
    classList: () => ['card', app.isActive && 'active', app.theme].filter(Boolean)
    // el.className = "card active dark"
  }
});

// No property — joins with comma
Elements.bind({
  tags: () => app.tags
  // el.textContent = "tag1, tag2, tag3"
});
```

### Null/undefined

```javascript
// With property — clears to empty string
// Without property — clears textContent
```

---

## createState() — State with auto-bindings

### What is it?

`ReactiveUtils.createState()` creates a reactive state and sets up bindings in one call:

```javascript
const app = ReactiveUtils.createState(
  // Initial state
  { count: 0, name: 'World' },

  // Bindings (optional)
  {
    '#counter': 'count',
    '#greeting': function() { return `Hello, ${this.name}!`; }
  }
);

app.count = 42;   // #counter updates automatically
app.name = 'Alice'; // #greeting updates automatically
```

---

## updateAll() — One-shot state + DOM update

### What is it?

`updateAll()` (also available as `global.updateAll`) updates state properties and DOM elements in a single call:

```javascript
ReactiveUtils.updateAll(app, {
  // State updates
  count: 5,
  name: 'Bob',

  // DOM updates (detected by selector syntax)
  '#header': { textContent: 'Welcome, Bob!' },
  '.badge': { style: { display: 'inline' } }
});
```

This is the functional equivalent of `app.$update()`.

---

## Best practices

### ✅ Use the right binding method

```javascript
// ✅ Targeting by ID → Elements.bind()
Elements.bind({
  counter: () => app.count
});

// ✅ Targeting by class → Collections.bind()
Collections.bind({
  'status-badge': () => app.status
});

// ✅ Complex selectors → Selector.queryAll.bind()
Selector.queryAll.bind({
  'table > tbody > tr': {
    style: () => ({ opacity: app.isLoading ? '0.5' : '1' })
  }
});
```

### ✅ Store cleanup functions

```javascript
// ✅ Store for later cleanup
const cleanup = ReactiveUtils.bindings({ /* ... */ });

// Later
cleanup();
```

### ✅ Keep binding functions simple

```javascript
// ✅ Simple and readable
Elements.bind({
  greeting: () => `Hello, ${app.name}!`
});

// ❌ Too much logic inside a binding
Elements.bind({
  greeting: () => {
    const name = app.name.trim();
    const greeting = app.timeOfDay < 12 ? 'Good morning' : 'Good afternoon';
    return `${greeting}, ${name}!`;
  }
});

// ✅ Better — use computed for complex logic
app.$computed('greetingText', function() {
  const greeting = this.timeOfDay < 12 ? 'Good morning' : 'Good afternoon';
  return `${greeting}, ${this.name.trim()}!`;
});

Elements.bind({
  greeting: () => app.greetingText
});
```

---

## Key takeaways

1. **bindings()** — standalone function, any CSS selector
2. **Elements.bind()** — ID-based, no `#` prefix
3. **Collections.bind()** — class-based, no `.` prefix
4. **Selector.bind()** — any CSS selector
5. **createState()** — state + bindings in one call
6. **updateAll()** — one-shot state + DOM update
7. Values are applied automatically based on type (string → textContent, object → style/dataset)
8. Always store and call cleanup functions to prevent memory leaks

---

## What's next?

Now let's see everything come together with real-world examples:
- Counter app
- Todo list
- Form validation
- Dashboard
- Shopping cart

Let's continue!