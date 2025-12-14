# Understanding `$destroy()` - A Beginner's Guide

## What is `$destroy()`?

`$destroy()` is a method that cleans up a reactive component and removes all its effects, watchers, and bindings. It prevents memory leaks by stopping all reactive tracking.

Think of it as your **cleanup manager** - it properly disposes of reactive components.

---

## Why Does This Exist?

### The Problem: Memory Leaks in Dynamic UIs

When you create reactive components dynamically, they need proper cleanup:

```javascript
// ❌ Without cleanup - memory leak!
function createUserCard(user) {
  const state = ReactiveUtils.state({ user: user });

  ReactiveUtils.effect(() => {
    console.log('User:', state.user.name);
  });

  // Effect keeps running even after card is removed!
  // Memory leak!
}

// Create and remove many cards
for (let i = 0; i < 100; i++) {
  createUserCard({ name: `User ${i}` });
}
// All 100 effects still running!

// ✅ With $destroy() - proper cleanup
function createUserCard(user) {
  const state = ReactiveUtils.state({ user: user });

  ReactiveUtils.effect(() => {
    console.log('User:', state.user.name);
  });

  return {
    state,
    destroy: () => state.$destroy() // Clean up!
  };
}

// Create card
const card = createUserCard({ name: 'John' });

// Later, remove card
card.destroy(); // All effects stopped, memory freed!
```

**Why this matters:**
- Prevents memory leaks
- Stops unnecessary computations
- Cleans up event listeners
- Proper component lifecycle
- Better performance

---

## How Does It Work?

### The Simple Process

When you call `$destroy()`:

1. **Stops all effects** - All reactive effects are stopped
2. **Removes watchers** - All watchers are disconnected
3. **Clears bindings** - DOM bindings are removed
4. **Frees memory** - References are cleared

Think of it like this:

```
state.$destroy()
    ↓
Stop all effects
    ↓
Remove all watchers
    ↓
Clear all bindings
    ↓
Component cleaned up!
```

---

## Basic Usage

### Clean Up Component

```javascript
const state = ReactiveUtils.state({ count: 0 });

// Create effect
ReactiveUtils.effect(() => {
  console.log('Count:', state.count);
});

// Later, clean up
state.$destroy();

// Effect no longer runs
state.count = 10; // Nothing logged
```

### Clean Up Dynamic Component

```javascript
function createCounter() {
  const state = ReactiveUtils.state({ count: 0 });

  ReactiveUtils.effect(() => {
    document.getElementById('display').textContent = state.count;
  });

  return {
    increment: () => state.count++,
    destroy: () => state.$destroy()
  };
}

const counter = createCounter();
counter.increment(); // Works

// Remove component
counter.destroy(); // Clean up!
```

### Clean Up Multiple Components

```javascript
const components = [];

for (let i = 0; i < 10; i++) {
  const state = ReactiveUtils.state({ id: i });
  components.push(state);
}

// Later, clean up all
components.forEach(component => component.$destroy());
```

---

## Simple Examples Explained

### Example 1: Dynamic List with Cleanup

```javascript
class TodoItem {
  constructor(text) {
    this.state = ReactiveUtils.state({
      text: text,
      completed: false
    });

    this.element = document.createElement('li');

    // Reactive effect for UI updates
    ReactiveUtils.effect(() => {
      this.element.textContent = this.state.text;
      this.element.classList.toggle('completed', this.state.completed);
    });
  }

  destroy() {
    // Clean up reactive effects
    this.state.$destroy();

    // Remove from DOM
    this.element.remove();
  }
}

// Create todo list
const todos = [];

function addTodo(text) {
  const todo = new TodoItem(text);
  todos.push(todo);
  document.getElementById('todo-list').appendChild(todo.element);
}

function removeTodo(index) {
  const todo = todos[index];

  // Proper cleanup!
  todo.destroy();

  todos.splice(index, 1);
}

// Add todos
addTodo('Buy milk');
addTodo('Walk dog');

// Remove first todo (with cleanup!)
removeTodo(0);
```

**What happens:**

1. Each todo has reactive state
2. Effect updates UI automatically
3. When removing todo, `$destroy()` stops effects
4. Prevents memory leaks
5. Can add/remove many todos safely

---

### Example 2: Modal Component with Cleanup

```javascript
class Modal {
  constructor(content) {
    this.state = ReactiveUtils.state({
      isOpen: false,
      content: content
    });

    this.element = document.createElement('div');
    this.element.className = 'modal';

    // Reactive effect for visibility
    ReactiveUtils.effect(() => {
      this.element.style.display = this.state.isOpen ? 'block' : 'none';
    });

    // Reactive effect for content
    ReactiveUtils.effect(() => {
      this.element.innerHTML = `
        <div class="modal-content">
          ${this.state.content}
          <button id="close-modal">Close</button>
        </div>
      `;
    });

    // Event listener
    this.element.addEventListener('click', (e) => {
      if (e.target.id === 'close-modal') {
        this.close();
      }
    });

    document.body.appendChild(this.element);
  }

  open() {
    this.state.isOpen = true;
  }

  close() {
    this.state.isOpen = false;
  }

  destroy() {
    // Clean up reactive effects
    this.state.$destroy();

    // Remove from DOM
    this.element.remove();
  }
}

// Create modal
const modal = new Modal('<h2>Welcome!</h2><p>This is a modal.</p>');
modal.open();

// Later, destroy modal properly
setTimeout(() => {
  modal.destroy(); // Clean cleanup!
}, 3000);
```

**What happens:**

1. Modal has reactive state for open/closed
2. Effects update visibility and content
3. When destroying, `$destroy()` stops all effects
4. Removes DOM element
5. Complete cleanup

---

### Example 3: Component Manager

```javascript
class ComponentManager {
  constructor() {
    this.components = new Map();
  }

  register(id, component) {
    // Destroy old component if exists
    if (this.components.has(id)) {
      this.components.get(id).destroy();
    }

    this.components.set(id, component);
  }

  unregister(id) {
    const component = this.components.get(id);
    if (component) {
      component.destroy();
      this.components.delete(id);
    }
  }

  destroyAll() {
    this.components.forEach(component => component.destroy());
    this.components.clear();
  }
}

// Component class
class Widget {
  constructor(name) {
    this.state = ReactiveUtils.state({
      name: name,
      active: true
    });

    ReactiveUtils.effect(() => {
      console.log(`Widget ${this.state.name} active:`, this.state.active);
    });
  }

  destroy() {
    this.state.$destroy();
  }
}

// Usage
const manager = new ComponentManager();

// Register widgets
manager.register('widget1', new Widget('First'));
manager.register('widget2', new Widget('Second'));
manager.register('widget3', new Widget('Third'));

// Replace widget1 (old one auto-destroyed)
manager.register('widget1', new Widget('First Updated'));

// Destroy specific widget
manager.unregister('widget2');

// Destroy all widgets
manager.destroyAll();
```

**What happens:**

1. Manager tracks all components
2. Replacing component auto-destroys old one
3. Can destroy individual components
4. Can destroy all at once
5. Prevents memory leaks

---

## Real-World Example: Single Page Application

```javascript
class Page {
  constructor(name) {
    this.name = name;
    this.state = ReactiveUtils.state({
      title: name,
      isActive: false,
      data: null,
      loading: false
    });

    this.element = document.createElement('div');
    this.element.className = 'page';

    // Effect for visibility
    ReactiveUtils.effect(() => {
      this.element.style.display = this.state.isActive ? 'block' : 'none';
    });

    // Effect for content
    ReactiveUtils.effect(() => {
      if (this.state.loading) {
        this.element.innerHTML = '<div class="loading">Loading...</div>';
      } else if (this.state.data) {
        this.element.innerHTML = `
          <h1>${this.state.title}</h1>
          <div>${this.renderContent()}</div>
        `;
      }
    });
  }

  renderContent() {
    // Override in subclasses
    return 'Content';
  }

  activate() {
    this.state.isActive = true;
    this.loadData();
  }

  deactivate() {
    this.state.isActive = false;
  }

  async loadData() {
    this.state.loading = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.state.data = { loaded: true };
    this.state.loading = false;
  }

  destroy() {
    this.state.$destroy();
    this.element.remove();
  }
}

class HomePage extends Page {
  constructor() {
    super('Home');
  }

  renderContent() {
    return '<p>Welcome to the home page!</p>';
  }
}

class AboutPage extends Page {
  constructor() {
    super('About');
  }

  renderContent() {
    return '<p>About us page content.</p>';
  }
}

class Router {
  constructor() {
    this.pages = new Map();
    this.currentPage = null;
  }

  registerPage(route, PageClass) {
    const page = new PageClass();
    this.pages.set(route, page);
    document.getElementById('app').appendChild(page.element);
  }

  navigate(route) {
    // Deactivate current page
    if (this.currentPage) {
      this.currentPage.deactivate();
    }

    // Activate new page
    const page = this.pages.get(route);
    if (page) {
      page.activate();
      this.currentPage = page;
    }
  }

  destroyPage(route) {
    const page = this.pages.get(route);
    if (page) {
      page.destroy(); // Proper cleanup!
      this.pages.delete(route);
    }
  }

  destroy() {
    // Clean up all pages
    this.pages.forEach(page => page.destroy());
    this.pages.clear();
  }
}

// Create router
const router = new Router();

// Register pages
router.registerPage('/', HomePage);
router.registerPage('/about', AboutPage);

// Navigate
router.navigate('/'); // Home page active

// Later
router.navigate('/about'); // About page active, home deactivated

// Clean up router (all pages destroyed)
// router.destroy();
```

**What happens:**
- Each page has reactive state
- Effects handle visibility and content
- Switching pages deactivates old one
- `$destroy()` ensures proper cleanup
- Prevents memory leaks in SPA
- Can destroy individual pages or all pages

---

## Common Patterns

### Pattern 1: Component Cleanup

```javascript
const state = ReactiveUtils.state({ data: {} });
// ... create effects, watchers
state.$destroy(); // Clean up
```

### Pattern 2: Destroy Method

```javascript
class Component {
  constructor() {
    this.state = ReactiveUtils.state({});
  }

  destroy() {
    this.state.$destroy();
  }
}
```

### Pattern 3: Cleanup on Unmount

```javascript
function mountComponent() {
  const state = ReactiveUtils.state({});
  // ... setup

  return () => state.$destroy(); // Return cleanup function
}

const cleanup = mountComponent();
// Later: cleanup();
```

### Pattern 4: Manager Pattern

```javascript
class Manager {
  constructor() {
    this.components = [];
  }

  add(component) {
    this.components.push(component);
  }

  destroyAll() {
    this.components.forEach(c => c.$destroy());
    this.components = [];
  }
}
```

---

## Common Beginner Questions

### Q: When should I call `$destroy()`?

**Answer:**

When removing components or cleaning up:

```javascript
// When removing from DOM
component.element.remove();
component.state.$destroy(); // Also destroy reactive state

// When replacing components
oldComponent.state.$destroy();
newComponent = createComponent();

// On page unload
window.addEventListener('beforeunload', () => {
  appState.$destroy();
});
```

### Q: What happens if I don't call it?

**Answer:**

Memory leaks! Effects keep running:

```javascript
// Without destroy - leak!
for (let i = 0; i < 1000; i++) {
  const state = ReactiveUtils.state({ id: i });
  ReactiveUtils.effect(() => console.log(state.id));
}
// 1000 effects still running!

// With destroy - clean
for (let i = 0; i < 1000; i++) {
  const state = ReactiveUtils.state({ id: i });
  ReactiveUtils.effect(() => console.log(state.id));
  state.$destroy(); // Clean!
}
```

### Q: Can I use the state after `$destroy()`?

**Answer:**

You can access values but effects won't run:

```javascript
const state = ReactiveUtils.state({ count: 0 });

ReactiveUtils.effect(() => {
  console.log(state.count);
});

state.$destroy();

state.count = 10; // No effect runs
console.log(state.count); // 10 (value accessible)
```

### Q: Does it remove the state object?

**Answer:**

No, just stops reactive tracking:

```javascript
const state = ReactiveUtils.state({ name: 'John' });
state.$destroy();

console.log(state.name); // 'John' (still accessible)
// But reactive effects are stopped
```

### Q: Do I need to destroy simple states?

**Answer:**

If they're short-lived or app-level, no. For dynamic components, yes:

```javascript
// App-level state - no need to destroy
const appState = ReactiveUtils.state({ user: null });

// Dynamic component - should destroy
function createWidget() {
  const state = ReactiveUtils.state({ data: {} });
  return { state, destroy: () => state.$destroy() };
}
```

---

## Tips for Success

### 1. Always Provide Destroy Method

```javascript
// ✅ Always include cleanup
class Component {
  constructor() {
    this.state = ReactiveUtils.state({});
  }

  destroy() {
    this.state.$destroy();
  }
}
```

### 2. Clean Up in Component Managers

```javascript
// ✅ Manager handles cleanup
class ComponentManager {
  destroyAll() {
    this.components.forEach(c => c.$destroy());
  }
}
```

### 3. Return Cleanup Functions

```javascript
// ✅ Return cleanup function
function createEffect() {
  const state = ReactiveUtils.state({});
  // ... setup
  return () => state.$destroy();
}

const cleanup = createEffect();
// Later: cleanup();
```

### 4. Clean Up on Navigation

```javascript
// ✅ Clean up when leaving page
function onPageLeave() {
  currentPageState.$destroy();
}
```

### 5. Destroy Before Replacing

```javascript
// ✅ Destroy old before creating new
if (oldComponent) {
  oldComponent.state.$destroy();
}
newComponent = createComponent();
```

---

## Summary

### What `$destroy()` Does:

1. ✅ Stops all reactive effects
2. ✅ Removes all watchers
3. ✅ Clears all bindings
4. ✅ Prevents memory leaks
5. ✅ Proper component cleanup
6. ✅ Frees up resources

### When to Use It:

- Removing dynamic components (most common)
- Unmounting components
- Replacing components
- Cleaning up pages in SPA
- Component manager cleanup
- Memory leak prevention

### The Basic Pattern:

```javascript
// Create component with state
class Component {
  constructor() {
    this.state = ReactiveUtils.state({ data: {} });

    ReactiveUtils.effect(() => {
      // Reactive logic
    });
  }

  destroy() {
    // Clean up!
    this.state.$destroy();
  }
}

// Usage
const component = new Component();

// Later, clean up
component.destroy();
```

---

**Remember:** `$destroy()` is essential for preventing memory leaks in dynamic UIs. Always call it when removing components! Create a `destroy()` method for every component class. 🎉
