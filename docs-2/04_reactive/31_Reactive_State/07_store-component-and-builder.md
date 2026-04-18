[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Store, Component, and Reactive Builder

These are the higher-level architecture tools. They combine state, computed, watchers, effects, bindings, and actions into organized, self-contained units.

---

## store() — State + Getters + Actions

### What is it?

`store()` creates a reactive state with **getters** (computed properties) and **actions** (methods that modify state) defined in one configuration object.

### Syntax

```javascript
const myStore = ReactiveUtils.store(
  // Initial state
  { count: 0, items: [] },

  // Options
  {
    getters: {
      doubled() { return this.count * 2; },
      itemCount() { return this.items.length; }
    },
    actions: {
      increment(state) { state.count++; },
      addItem(state, item) { state.items.push(item); }
    }
  }
);
```

### Using the store

```javascript
// Read state
console.log(myStore.count);      // 0
console.log(myStore.doubled);    // 0 (computed)
console.log(myStore.itemCount);  // 0 (computed)

// Call actions
myStore.increment();
console.log(myStore.count);      // 1
console.log(myStore.doubled);    // 2

myStore.addItem({ name: 'Widget' });
console.log(myStore.itemCount);  // 1
```

### How actions work

Actions receive the **state** as their first argument, followed by any additional arguments you pass:

```javascript
const store = ReactiveUtils.store(
  { users: [] },
  {
    actions: {
      // state is always the first argument
      addUser(state, name, email) {
        state.users.push({ name, email });
      },
      removeUser(state, email) {
        const idx = state.users.findIndex(u => u.email === email);
        if (idx !== -1) state.users.splice(idx, 1);
      }
    }
  }
);

// Call with your arguments — state is injected automatically
store.addUser('Alice', 'alice@example.com');
store.removeUser('alice@example.com');
```

### Store with effects

```javascript
const counterStore = ReactiveUtils.store(
  { count: 0 },
  {
    getters: {
      isHigh() { return this.count > 100; }
    },
    actions: {
      increment(state) { state.count++; },
      reset(state) { state.count = 0; }
    }
  }
);

ReactiveUtils.effect(() => {
  document.getElementById('count').textContent = counterStore.count;
  document.getElementById('warning').style.display =
    counterStore.isHigh ? 'block' : 'none';
});
```

---

## component() — Full component definition

### What is it?

`component()` is the most comprehensive factory. It creates a reactive state with computed, watchers, effects, bindings, actions, and lifecycle hooks — all defined in a single config object.

### Syntax

```javascript
const myComponent = ReactiveUtils.component({
  // Initial state
  state: {
    count: 0,
    name: 'World'
  },

  // Computed properties
  computed: {
    greeting() { return `Hello, ${this.name}!`; },
    doubled() { return this.count * 2; }
  },

  // Watchers
  watch: {
    count(newVal, oldVal) {
      console.log(`count: ${oldVal} → ${newVal}`);
    }
  },

  // Effects
  effects: {
    syncTitle: () => {
      document.title = myComponent.name;
    }
  },

  // DOM bindings
  bindings: {
    '#counter': () => myComponent.count,
    '#greeting': () => myComponent.greeting
  },

  // Actions
  actions: {
    increment(state) { state.count++; },
    setName(state, name) { state.name = name; }
  },

  // Lifecycle hooks
  mounted() {
    console.log('Component mounted!');
  },
  unmounted() {
    console.log('Component unmounted!');
  }
});
```

### Using the component

```javascript
// Read state and computed
console.log(myComponent.count);     // 0
console.log(myComponent.greeting);  // 'Hello, World!'

// Call actions
myComponent.increment();
myComponent.setName('Alice');

// Destroy the component — stops all effects, watchers, bindings
myComponent.$destroy();
```

### The $destroy() method

Every component gets a `$destroy()` method that cleans up all watchers, effects, and bindings, then calls the `unmounted` hook:

```javascript
myComponent.$destroy();
// 1. All effects stopped
// 2. All watchers stopped
// 3. All bindings removed
// 4. unmounted() called
```

### Component config reference

| Key | Type | Description |
|-----|------|-------------|
| `state` | `object` | Initial state properties |
| `computed` | `object` | `{ key: function }` — computed properties |
| `watch` | `object` | `{ key: callback }` — property watchers |
| `effects` | `object` | `{ name: function }` — side effect functions |
| `bindings` | `object` | `{ selector: binding }` — DOM bindings |
| `actions` | `object` | `{ name: function(state, ...args) }` — methods |
| `mounted` | `function` | Called after component is created |
| `unmounted` | `function` | Called when `$destroy()` is invoked |

---

## reactive() / builder() — Chainable builder

### What is it?

`reactive()` returns a **builder object** with a chainable API. You build up state, computed, watchers, effects, bindings, and actions step by step, then call `.build()` to get the final state.

### Syntax

```javascript
const app = ReactiveUtils.reactive({ count: 0, name: 'World' })
  .computed({
    doubled() { return this.count * 2; }
  })
  .watch({
    count(newVal) { console.log('Count:', newVal); }
  })
  .effect(() => {
    document.getElementById('count').textContent = app.state.count;
  })
  .bind({
    '#name': () => app.state.name
  })
  .action('increment', (state) => { state.count++; })
  .build();

// app is now the reactive state object
app.count++;
app.increment();
```

### The builder methods

Each method returns the builder (for chaining):

```javascript
const builder = ReactiveUtils.reactive({ count: 0 });

// Add computed properties
builder.computed({
  doubled() { return this.count * 2; }
});

// Add watchers
builder.watch({
  count(newVal, oldVal) { console.log(newVal); }
});

// Add a single effect
builder.effect(() => {
  console.log('Count changed');
});

// Add DOM bindings
builder.bind({
  '#counter': () => builder.state.count
});

// Add a single action
builder.action('increment', (state) => { state.count++; });

// Add multiple actions
builder.actions({
  increment(state) { state.count++; },
  reset(state) { state.count = 0; }
});

// Finalize — returns the state object with a destroy() method
const app = builder.build();
```

### Accessing state during building

The builder has a `.state` property that gives you the reactive object before `.build()`:

```javascript
const builder = ReactiveUtils.reactive({ count: 0 });

// Access state through builder.state
builder.effect(() => {
  console.log(builder.state.count);
});
```

### The build() method

`.build()` finalizes the builder:
- Returns the reactive state object
- Adds a `destroy()` method to the state that cleans up all effects, watchers, and bindings

```javascript
const app = ReactiveUtils.reactive({ count: 0 })
  .computed({ doubled() { return this.count * 2; } })
  .build();

console.log(app.count);    // 0
console.log(app.doubled);  // 0

// Cleanup
app.destroy();
```

### Builder vs Component

```
builder (reactive):
├── Chainable API — build step by step
├── Flexible — add things as needed
├── .build() returns the state with destroy()
└── Good for: gradual setup, conditional features

component:
├── Config object — declare everything upfront
├── Structured — all parts defined in one place
├── Lifecycle hooks (mounted, unmounted)
└── Good for: self-contained UI components
```

Also available as `ReactiveUtils.builder()` — same function.

---

## Choosing the right tool

| Tool | Best for | Structure |
|------|---------|-----------|
| **state()** | Simple reactive data | Just an object |
| **ref()** | Single values | `{ value: x }` |
| **collection()** | Lists with CRUD | `{ items: [] }` + methods |
| **form()** | Form handling | Values + errors + touched |
| **async()** | API calls | Data + loading + error |
| **store()** | State + getters + actions | Config object |
| **component()** | Full UI components | Config with lifecycle |
| **reactive()** | Flexible building | Chainable builder |

### Rules of thumb

- **Just need reactive data?** → `state()`
- **Single value?** → `ref()`
- **Managing a list?** → `collection()`
- **Building a form?** → `form()`
- **Fetching data?** → `async()`
- **Need organized actions and getters?** → `store()`
- **Full UI component with lifecycle?** → `component()`
- **Want to build incrementally?** → `reactive()` builder

---

## Key takeaways

1. **store()** — state + getters (computed) + actions in one config
2. **component()** — everything: state, computed, watch, effects, bindings, actions, lifecycle
3. **reactive()** — chainable builder, finalize with `.build()`
4. **Actions** receive state as the first argument automatically
5. **$destroy()** cleans up all watchers, effects, and bindings
6. **Choose based on complexity** — start simple, graduate to more structure as needed

---

## What's next?

Now let's explore how bindings and DOM integration work in detail:
- The `bindings()` function
- `Elements.bind()`, `Collections.bind()`, and `Selector.bind()`
- Connecting reactive state to the DOM

Let's continue!