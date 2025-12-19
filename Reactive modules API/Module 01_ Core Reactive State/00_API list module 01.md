[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# Reactive Library - Complete Methods List by Module

---

## Module 01: Core Reactive State (`01_dh-reactive.js`)

### ReactiveUtils Namespace

**State Creation:**
- **`ReactiveUtils.state(initialState)`** - Create a reactive state object
- **`ReactiveUtils.createState(initialState, bindingDefs)`** - Create state with auto-bindings
- **`ReactiveUtils.ref(value)`** - Create a reactive reference with `.value` property
- **`ReactiveUtils.refs(defs)`** - Create multiple refs from object definition
- **`ReactiveUtils.collection(items)`** - Create a reactive collection (core version with $-prefixed methods)
- **`ReactiveUtils.form(initialValues)`** - Create a basic form state manager
- **`ReactiveUtils.async(initialValue)`** - Create async operation state (basic version)
- **`ReactiveUtils.store(initialState, options)`** - Create a store with getters/actions
- **`ReactiveUtils.component(config)`** - Create a component with full lifecycle
- **`ReactiveUtils.reactive(initialState)`** - Fluent builder pattern for state

**Reactivity Functions:**
- **`ReactiveUtils.computed(state, defs)`** - Add multiple computed properties to state (returns state)
- **`ReactiveUtils.watch(state, defs)`** - Add multiple watchers to state (returns cleanup function)
- **`ReactiveUtils.effect(fn)`** - Create single reactive effect (returns cleanup function)
- **`ReactiveUtils.effects(defs)`** - Create multiple effects from object (returns cleanup function)
- **`ReactiveUtils.bindings(defs)`** - Create DOM bindings with selectors (returns cleanup function)

**Batch Operations:**
- **`ReactiveUtils.batch(fn)`** - Batch updates manually (executes fn and flushes after)
- **`ReactiveUtils.pause()`** - Pause reactivity (increment batch depth)
- **`ReactiveUtils.resume(flush)`** - Resume reactivity (decrement batch depth, optionally flush)
- **`ReactiveUtils.untrack(fn)`** - Run function without tracking dependencies

**Utility Functions:**
- **`ReactiveUtils.isReactive(value)`** - Check if value is reactive
- **`ReactiveUtils.toRaw(value)`** - Get raw non-reactive value
- **`ReactiveUtils.notify(state, key)`** - Manually notify dependencies for a key or all keys
- **`ReactiveUtils.updateAll(state, updates)`** - Unified state + DOM updates

### State Instance Methods

**State Management:**
- **`state.$computed(key, fn)`** - Add computed property to instance
- **`state.$watch(keyOrFn, callback)`** - Watch for changes (returns cleanup function)
- **`state.$batch(fn)`** - Batch multiple updates
- **`state.$notify(key)`** - Manually trigger updates for a key (or all if no key)
- **`state.$raw`** - Property getter to access non-reactive raw object
- **`state.$update(updates)`** - Mixed state + DOM updates (supports selectors and nested paths)
- **`state.$set(updates)`** - Functional updates with callbacks
- **`state.$bind(bindingDefs)`** - Create reactive DOM bindings (returns cleanup function)

### Core Collection Methods (Module 01)

When using `ReactiveUtils.collection()` or `ReactiveUtils.list()`:

- **`collection.$add(item)`** - Add item to collection
- **`collection.$remove(predicate)`** - Remove item by predicate function or direct value
- **`collection.$update(predicate, updates)`** - Update item in collection by predicate or value
- **`collection.$clear()`** - Clear all items from collection
- **`collection.items`** - Property containing the reactive array

### Form Instance Methods (Module 01 - Basic)

Basic form from `ReactiveUtils.form()`:

- **`form.$setValue(field, value)`** - Set form field value and mark as touched
- **`form.$setError(field, error)`** - Set or clear field error
- **`form.$reset(newValues)`** - Reset form to initial or new values
- **`form.values`** - Property containing form values
- **`form.errors`** - Property containing form errors
- **`form.touched`** - Property containing touched fields
- **`form.isSubmitting`** - Property for submission state
- **`form.isValid`** - Computed property for form validity
- **`form.isDirty`** - Computed property for form dirty state

### Async State Instance Methods (Module 01 - Basic)

Basic async state from `ReactiveUtils.async()`:

- **`asyncState.$execute(fn)`** - Execute async operation and update state
- **`asyncState.$reset()`** - Reset async state to initial values
- **`asyncState.data`** - Property containing async data
- **`asyncState.loading`** - Property for loading state
- **`asyncState.error`** - Property containing error if any
- **`asyncState.isSuccess`** - Computed property (data loaded, no error)
- **`asyncState.isError`** - Computed property (has error, not loading)

### Component Instance Methods (Module 01)

- **`component.$destroy()`** - Clean up all effects, watchers, and bindings

### Ref Instance Methods (Module 01)

- **`ref.value`** - Property to get/set the ref value
- **`ref.valueOf()`** - Get primitive value
- **`ref.toString()`** - Convert to string

### Builder Pattern Methods (Module 01)

Returned by `ReactiveUtils.reactive()`:

- **`builder.state`** - Access to the created reactive state
- **`builder.computed(defs)`** - Add computed properties (returns builder)
- **`builder.watch(defs)`** - Add watchers (returns builder)
- **`builder.effect(fn)`** - Add effect (returns builder)
- **`builder.bind(defs)`** - Add bindings (returns builder)
- **`builder.action(name, fn)`** - Add single action (returns builder)
- **`builder.actions(defs)`** - Add multiple actions (returns builder)
- **`builder.build()`** - Build and return state with destroy method
- **`builder.destroy()`** - Clean up all effects

### Global Functions (Module 01)

- **`updateAll(state, updates)`** - Global function for unified updates

### Elements Namespace Integration

All core methods available via `Elements.*`:

**Core Methods:**
- **`Elements.state()`** - Create reactive state
- **`Elements.createState(initialState, bindingDefs)`** - Create state with bindings
- **`Elements.updateAll(state, updates)`** - Unified updates
- **`Elements.computed(state, defs)`** - Add computed properties
- **`Elements.watch(state, defs)`** - Add watchers
- **`Elements.effect(fn)`** - Create effect
- **`Elements.effects(defs)`** - Create multiple effects
- **`Elements.ref(value)`** - Create ref
- **`Elements.refs(defs)`** - Create multiple refs
- **`Elements.store(initialState, options)`** - Create store
- **`Elements.component(config)`** - Create component
- **`Elements.reactive(initialState)`** - Fluent builder
- **`Elements.bindings(defs)`** - Create bindings
- **`Elements.list(items)`** - Create collection
- **`Elements.batch(fn)`** - Batch updates
- **`Elements.isReactive(value)`** - Check reactive
- **`Elements.toRaw(value)`** - Get raw value
- **`Elements.notify(state, key)`** - Notify dependencies
- **`Elements.pause()`** - Pause reactivity
- **`Elements.resume(flush)`** - Resume reactivity
- **`Elements.untrack(fn)`** - Untrack dependencies

**Special Elements Method:**
- **`Elements.bind(bindingDefs)`** - ID-based bindings (uses getElementById)

### Collections Namespace Integration

All core methods available via `Collections.*`:

**Core Methods:**
- **`Collections.state()`** - Create reactive state
- **`Collections.createState(initialState, bindingDefs)`** - Create state with bindings
- **`Collections.updateAll(state, updates)`** - Unified updates
- **`Collections.computed(state, defs)`** - Add computed properties
- **`Collections.watch(state, defs)`** - Add watchers
- **`Collections.effect(fn)`** - Create effect
- **`Collections.effects(defs)`** - Create multiple effects
- **`Collections.ref(value)`** - Create ref
- **`Collections.refs(defs)`** - Create multiple refs
- **`Collections.store(initialState, options)`** - Create store
- **`Collections.component(config)`** - Create component
- **`Collections.reactive(initialState)`** - Fluent builder
- **`Collections.bindings(defs)`** - Create bindings
- **`Collections.list(items)`** - Create collection
- **`Collections.batch(fn)`** - Batch updates
- **`Collections.isReactive(value)`** - Check reactive
- **`Collections.toRaw(value)`** - Get raw value
- **`Collections.notify(state, key)`** - Notify dependencies
- **`Collections.pause()`** - Pause reactivity
- **`Collections.resume(flush)`** - Resume reactivity
- **`Collections.untrack(fn)`** - Untrack dependencies

**Special Collections Method:**
- **`Collections.bind(bindingDefs)`** - Class-based bindings (uses getElementsByClassName)

### Selector Namespace Integration

All core methods available via `Selector.*`:

**Core Methods:**
- **`Selector.state()`** - Create reactive state
- **`Selector.createState(initialState, bindingDefs)`** - Create state with bindings
- **`Selector.updateAll(state, updates)`** - Unified updates
- **`Selector.computed(state, defs)`** - Add computed properties
- **`Selector.watch(state, defs)`** - Add watchers
- **`Selector.effect(fn)`** - Create effect
- **`Selector.effects(defs)`** - Create multiple effects
- **`Selector.ref(value)`** - Create ref
- **`Selector.refs(defs)`** - Create multiple refs
- **`Selector.store(initialState, options)`** - Create store
- **`Selector.component(config)`** - Create component
- **`Selector.reactive(initialState)`** - Fluent builder
- **`Selector.bindings(defs)`** - Create bindings
- **`Selector.list(items)`** - Create collection
- **`Selector.batch(fn)`** - Batch updates
- **`Selector.isReactive(value)`** - Check reactive
- **`Selector.toRaw(value)`** - Get raw value
- **`Selector.notify(state, key)`** - Notify dependencies
- **`Selector.pause()`** - Pause reactivity
- **`Selector.resume(flush)`** - Resume reactivity
- **`Selector.untrack(fn)`** - Untrack dependencies

**Selector.query Methods:**
- All core methods plus:
- **`Selector.query.bind(bindingDefs)`** - Single element bindings (uses querySelector)

**Selector.queryAll Methods:**
- All core methods plus:
- **`Selector.queryAll.bind(bindingDefs)`** - Multiple element bindings (uses querySelectorAll)

---