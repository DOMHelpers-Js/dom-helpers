[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Utilities and API Reference

A complete reference of everything available in the Reactive State module.

---

## Global exports

The module creates two global objects and one global function:

| Global | What it contains |
|--------|-----------------|
| `ReactiveState` | `create`, `form`, `async`, `collection` |
| `ReactiveUtils` | Full API (state, effect, ref, store, component, etc.) |
| `updateAll` | Global shortcut for `ReactiveUtils.updateAll()` |

---

## ReactiveUtils — Full API

### State creation

| Method | Syntax | Returns |
|--------|--------|---------|
| `state(obj)` | `ReactiveUtils.state({ count: 0 })` | Reactive proxy |
| `createState(obj, bindings?)` | `ReactiveUtils.createState({ count: 0 }, { '#el': 'count' })` | Reactive proxy with bindings |
| `ref(value)` | `ReactiveUtils.ref(0)` | Reactive `{ value }` wrapper |
| `refs(defs)` | `ReactiveUtils.refs({ a: 0, b: '' })` | Object of refs |
| `collection(items?)` | `ReactiveUtils.collection([])` | Reactive list with CRUD methods |
| `list(items?)` | Alias for `collection()` | Same as `collection()` |
| `form(values?)` | `ReactiveUtils.form({ email: '' })` | Form state with validation |
| `async(initial?)` | `ReactiveUtils.async(null)` | Async state with loading/error |
| `store(state, options?)` | `ReactiveUtils.store({}, { getters, actions })` | State with getters + actions |
| `component(config)` | `ReactiveUtils.component({ state, computed, ... })` | Full component |
| `reactive(state)` | `ReactiveUtils.reactive({ count: 0 })` | Chainable builder |
| `builder(state)` | Alias for `reactive()` | Same as `reactive()` |

### Reactivity primitives

| Method | Syntax | Returns |
|--------|--------|---------|
| `effect(fn)` | `ReactiveUtils.effect(() => { ... })` | Cleanup function |
| `effects(defs)` | `ReactiveUtils.effects({ a: fn1, b: fn2 })` | Combined cleanup function |
| `computed(state, defs)` | `ReactiveUtils.computed(app, { doubled: fn })` | The state |
| `watch(state, defs)` | `ReactiveUtils.watch(app, { count: callback })` | Combined cleanup function |
| `bindings(defs)` | `ReactiveUtils.bindings({ '#el': fn })` | Cleanup function |

### Utilities

| Method | Syntax | Description |
|--------|--------|-------------|
| `batch(fn)` | `ReactiveUtils.batch(() => { ... })` | Group changes, effects run once |
| `isReactive(obj)` | `ReactiveUtils.isReactive(app)` | Returns `true` if reactive |
| `toRaw(obj)` | `ReactiveUtils.toRaw(app)` | Returns unwrapped object |
| `notify(state, key?)` | `ReactiveUtils.notify(app, 'items')` | Manually trigger effects |
| `pause()` | `ReactiveUtils.pause()` | Pause all effect execution |
| `resume(flush?)` | `ReactiveUtils.resume(true)` | Resume effects, optionally flush |
| `untrack(fn)` | `ReactiveUtils.untrack(() => app.count)` | Read without tracking |
| `updateAll(state, updates)` | `ReactiveUtils.updateAll(app, { ... })` | Mixed state + DOM update |

---

## ReactiveState — Simplified API

| Method | Maps to |
|--------|---------|
| `ReactiveState.create(obj)` | `ReactiveUtils.state(obj)` |
| `ReactiveState.form(values)` | `ReactiveUtils.form(values)` |
| `ReactiveState.async(initial)` | `ReactiveUtils.async(initial)` |
| `ReactiveState.collection(items)` | `ReactiveUtils.collection(items)` |

---

## Instance methods (on every reactive object)

| Method | Syntax | Returns |
|--------|--------|---------|
| `$computed(key, fn)` | `app.$computed('total', fn)` | The state (chainable) |
| `$watch(keyOrFn, callback)` | `app.$watch('count', cb)` | Cleanup function |
| `$batch(fn)` | `app.$batch(function() { ... })` | Result of fn |
| `$update(updates)` | `app.$update({ count: 5, '#el': { text } })` | The state |
| `$set(updates)` | `app.$set({ count: c => c + 1 })` | The state |
| `$bind(defs)` | `app.$bind({ '#el': 'count' })` | Cleanup function |
| `$notify(key?)` | `app.$notify('items')` | `undefined` |
| `$raw` | `app.$raw` | Original unwrapped object |

---

## DOMHelpers Integration

When DOMHelpers modules are loaded, the full `ReactiveUtils` API is added to each:

```javascript
// All of these are equivalent:
ReactiveUtils.state({ count: 0 });
Elements.state({ count: 0 });
Collections.state({ count: 0 });
Selector.state({ count: 0 });
```

### Specialized bind methods

| Method | Selector format | Targets |
|--------|----------------|---------|
| `Elements.bind(defs)` | ID without `#` | `document.getElementById()` |
| `Collections.bind(defs)` | Class without `.` | `document.getElementsByClassName()` |
| `Selector.query.bind(defs)` | Any CSS selector | `document.querySelector()` |
| `Selector.queryAll.bind(defs)` | Any CSS selector | `document.querySelectorAll()` |

---

## Iteration Utilities

The module also provides two standalone utility functions for iterating over objects.

### eachEntries()

Iterates over an object's entries using `Object.entries()` and `forEach()`.

```javascript
eachEntries(obj, callback, selector?)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `obj` | `object` | The object to iterate over |
| `callback` | `function(key, value, index)` | Called for each entry |
| `selector` | `string` (optional) | CSS selector to render returned HTML |

**Returns:** Accumulated HTML string if callback returns strings, otherwise `undefined`.

```javascript
const users = { alice: 30, bob: 25, charlie: 35 };

// Simple iteration
eachEntries(users, (name, age, i) => {
  console.log(`${i}: ${name} is ${age}`);
});

// Generate HTML
const html = eachEntries(users, (name, age) => {
  return `<div>${name}: ${age}</div>`;
});
// html = "<div>alice: 30</div><div>bob: 25</div><div>charlie: 35</div>"

// Generate and render to DOM
eachEntries(users, (name, age) => {
  return `<li>${name} (${age})</li>`;
}, '#userList');
// Renders HTML into the element matching #userList
```

### mapEntries()

Maps over an object's entries using `Object.entries()` and `map()`.

```javascript
mapEntries(obj, callback, joinHTMLOrSelector?, selector?)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `obj` | `object` | The object to map over |
| `callback` | `function(key, value, index)` | Transform function — should return a value |
| `joinHTMLOrSelector` | `boolean` or `string` | If `true`, joins array as HTML. If string, treats as selector |
| `selector` | `string` (optional) | CSS selector when first param is boolean |

**Returns:** Array of transformed values, or joined HTML string.

```javascript
const prices = { apple: 1.5, banana: 0.75, cherry: 3.0 };

// Map to array
const labels = mapEntries(prices, (fruit, price) => {
  return `${fruit}: $${price}`;
});
// ['apple: $1.50', 'banana: $0.75', 'cherry: $3.00']

// Join as HTML string
const html = mapEntries(prices, (fruit, price) => {
  return `<option value="${fruit}">${fruit} - $${price}</option>`;
}, true);
// "<option value="apple">apple - $1.5</option><option..."

// Render directly to DOM
mapEntries(prices, (fruit, price) => {
  return `<li>${fruit}: $${price}</li>`;
}, '#priceList');
// Renders into #priceList
```

---

## Quick-pick guide

**"I need to..."**

| Need | Use |
|------|-----|
| Make an object reactive | `ReactiveUtils.state(obj)` |
| Wrap a single value | `ReactiveUtils.ref(value)` |
| Run code when state changes | `ReactiveUtils.effect(fn)` |
| Calculate a derived value | `app.$computed(key, fn)` |
| React when a property changes | `app.$watch(key, callback)` |
| Group multiple changes | `app.$batch(fn)` or `ReactiveUtils.batch(fn)` |
| Update state + DOM together | `app.$update({ ... })` |
| Connect state to DOM elements | `app.$bind({ ... })` or `ReactiveUtils.bindings({ ... })` |
| Manage a list | `ReactiveUtils.collection()` |
| Handle form state | `ReactiveUtils.form(initialValues)` |
| Manage async operations | `ReactiveUtils.async(initial)` |
| Build a store with actions | `ReactiveUtils.store(state, { getters, actions })` |
| Create a full component | `ReactiveUtils.component(config)` |
| Build incrementally | `ReactiveUtils.reactive(state).computed(...).build()` |
| Get the raw object | `app.$raw` or `ReactiveUtils.toRaw(app)` |
| Check if reactive | `ReactiveUtils.isReactive(obj)` |
| Manually trigger updates | `app.$notify(key)` |
| Read without tracking | `ReactiveUtils.untrack(() => app.count)` |
| Iterate an object | `eachEntries(obj, callback)` |
| Map an object | `mapEntries(obj, callback)` |

---

## Load order

```html
<!-- 1. DOMHelpers Core (optional, for integration) -->
<script src="01_dh-elements.js"></script>
<script src="02_dh-collections.js"></script>
<script src="03_dh-selector.js"></script>

<!-- 2. Reactive State -->
<script src="04_reactive/01_dh-reactive.js"></script>
```

The reactive module detects `Elements`, `Collections`, and `Selector` at load time and adds the API to each if they exist. Loading without DOMHelpers Core is fine — you'll use `ReactiveUtils` and `ReactiveState` directly.

---

## Key takeaways

1. **Two global objects:** `ReactiveUtils` (full API) and `ReactiveState` (simplified)
2. **One global function:** `updateAll()` for mixed state + DOM updates
3. **Instance methods** (`$computed`, `$watch`, `$batch`, etc.) are on every reactive object
4. **DOMHelpers integration** adds the full API to `Elements`, `Collections`, and `Selector`
5. **Specialized bind methods** on each DOMHelpers module (ID, class, CSS selector)
6. **Iteration utilities** (`eachEntries`, `mapEntries`) for object iteration with optional DOM rendering
7. **Start simple** with `state()` + `effect()` — add complexity only as needed

---

## Congratulations!

You've completed the Reactive State learning path. You now understand:

- ✅ What reactive state is and why it exists
- ✅ The Proxy system and dependency tracking
- ✅ Effects, computed properties, and watchers
- ✅ Instance methods for advanced state control
- ✅ Specialized factories (ref, collection, form, async)
- ✅ Architecture tools (store, component, builder)
- ✅ Bindings and DOM integration
- ✅ Real-world examples and patterns
- ✅ The complete API reference

**You're ready to build reactive UIs with DOMHelpers!**