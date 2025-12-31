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
- **`ReactiveUtils.list(items)`** - Alias for collection()
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

### ReactiveState Namespace

- **`ReactiveState.create(initialState)`** - Create reactive state
- **`ReactiveState.form(initialValues)`** - Create form state
- **`ReactiveState.async(initialValue)`** - Create async state
- **`ReactiveState.collection(items)`** - Create collection

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

## Module 02: Array Patch (`02_dh-reactive-array-patch.js`)

### Reactive Array Methods

When array patch extension is loaded, these array methods become reactive:

- **`push(...items)`** - Add items to end (triggers reactivity)
- **`pop()`** - Remove item from end (triggers reactivity)
- **`shift()`** - Remove item from start (triggers reactivity)
- **`unshift(...items)`** - Add items to start (triggers reactivity)
- **`splice(start, deleteCount, ...items)`** - Add/remove items (triggers reactivity)
- **`sort(compareFn)`** - Sort in place (triggers reactivity)
- **`reverse()`** - Reverse in place (triggers reactivity)
- **`fill(value, start, end)`** - Fill with value (triggers reactivity)
- **`copyWithin(target, start, end)`** - Copy within array (triggers reactivity)

### Array Patch Functions

- **`ReactiveUtils.patchArray(state, key)`** - Manually patch array property
- **`patchReactiveArray(state, key)`** - Legacy global function name
- **`Elements.patchArray(state, key)`** - Array patch via Elements namespace
- **`Collections.patchArray(state, key)`** - Array patch via Collections namespace
- **`Selector.patchArray(state, key)`** - Array patch via Selector namespace

---

## Module 03: Collections Extension (`03_dh-reactive-collections.js`)

### Collections Extension Namespace

- **`Collections.create(items)`** - Create collection with extended methods
- **`Collections.createWithComputed(items, computed)`** - Create collection with computed properties
- **`Collections.createFiltered(collection, predicate)`** - Create filtered view that syncs with source
- **`Collections.collection(items)`** - Alias for create
- **`Collections.list(items)`** - Alias for create

### Basic Operations

When using `Collections.create()`, `Collections.collection()`, or `Collections.list()`:

- **`add(item)`** - Add item to collection (returns this for chaining)
- **`remove(predicate)`** - Remove item by predicate or value (returns this)
- **`update(predicate, updates)`** - Update item by predicate or value (returns this)
- **`clear()`** - Clear all items (returns this)

### Search & Filter

- **`find(predicate)`** - Find item in collection
- **`filter(predicate)`** - Filter items and return new array
- **`map(fn)`** - Map over items and return new array
- **`forEach(fn)`** - Iterate over items (returns this)

### Sorting & Ordering

- **`sort(compareFn)`** - Sort items in place (returns this)
- **`reverse()`** - Reverse items in place (returns this)

### Getters

- **`length`** - Get collection length (getter property)
- **`first`** - Get first item (getter property)
- **`last`** - Get last item (getter property)

### Array Methods

- **`at(index)`** - Get item at index
- **`includes(item)`** - Check if includes item
- **`indexOf(item)`** - Get index of item
- **`slice(start, end)`** - Get slice of items
- **`splice(start, deleteCount, ...items)`** - Splice items (returns this)
- **`push(...items)`** - Push items to end (returns this)
- **`pop()`** - Pop item from end
- **`shift()`** - Shift item from start
- **`unshift(...items)`** - Unshift items to start (returns this)

### Advanced Operations

- **`toggle(predicate, field)`** - Toggle boolean field on single item (returns this)
- **`toggleAll(predicate, field)`** - Toggle boolean field on all matching items (returns count)
- **`removeWhere(predicate)`** - Remove all matching items (returns this)
- **`updateWhere(predicate, updates)`** - Update all matching items (returns this)
- **`reset(newItems)`** - Reset collection with new items (returns this)
- **`toArray()`** - Convert to plain array
- **`isEmpty()`** - Check if empty

---

## Module 04: Forms Extension (`04_dh-reactive-form.js`)

### Forms Extension Namespace

- **`Forms.create(initialValues, options)`** - Create reactive form
- **`Forms.form(initialValues, options)`** - Alias for create
- **`Forms.validators`** - Object containing all validators
- **`Forms.v`** - Shorthand alias for validators

### ReactiveUtils Integration

- **`ReactiveUtils.form(initialValues, options)`** - Create form via ReactiveUtils
- **`ReactiveUtils.createForm(initialValues, options)`** - Alias
- **`ReactiveUtils.validators`** - Access validators via ReactiveUtils

### Value Management

When using `Forms.create()` or `Forms.form()`:

- **`setValue(field, value)`** - Set single field value (returns this)
- **`setValues(values)`** - Set multiple field values in batch (returns this)
- **`getValue(field)`** - Get field value

### Error Management

- **`setError(field, error)`** - Set field error (returns this)
- **`setErrors(errors)`** - Set multiple errors in batch (returns this)
- **`clearError(field)`** - Clear field error (returns this)
- **`clearErrors()`** - Clear all errors (returns this)
- **`hasError(field)`** - Check if field has error
- **`getError(field)`** - Get field error message

### Touched State Management

- **`setTouched(field, touched)`** - Mark field as touched (returns this)
- **`setTouchedFields(fields)`** - Mark multiple fields as touched (returns this)
- **`touchAll()`** - Mark all fields as touched (returns this)
- **`isTouched(field)`** - Check if field is touched
- **`shouldShowError(field)`** - Check if should show error (touched + has error)

### Validation

- **`validateField(field)`** - Validate single field (returns boolean)
- **`validate()`** - Validate all fields (returns boolean)

### Reset

- **`reset(newValues)`** - Reset form to initial or new values (returns this)
- **`resetField(field)`** - Reset single field (returns this)

### Submission

- **`submit(customHandler)`** - Handle form submission (async, returns result object)

### Event Handlers

- **`handleChange(event)`** - Handle input change event
- **`handleBlur(event)`** - Handle input blur event
- **`getFieldProps(field)`** - Get field props for binding (returns object with name, value, onChange, onBlur)

### DOM Binding

- **`bindToInputs(selector)`** - Bind form to DOM inputs (returns this)

### Serialization

- **`toObject()`** - Convert to plain object

### Computed Properties (Forms Extension)

- **`isValid`** - Check if form is valid (computed property)
- **`isDirty`** - Check if form is dirty (computed property)
- **`hasErrors`** - Check if has errors (computed property)
- **`touchedFields`** - Get touched fields array (computed property)
- **`errorFields`** - Get error fields array (computed property)

### Built-in Validators

- **`Validators.required(message)`** - Required field validator
- **`Validators.email(message)`** - Email format validator
- **`Validators.minLength(min, message)`** - Minimum length validator
- **`Validators.maxLength(max, message)`** - Maximum length validator
- **`Validators.pattern(regex, message)`** - Pattern/regex validator
- **`Validators.min(min, message)`** - Minimum value validator
- **`Validators.max(max, message)`** - Maximum value validator
- **`Validators.match(fieldName, message)`** - Match field validator
- **`Validators.custom(validatorFn)`** - Custom validator function
- **`Validators.combine(...validators)`** - Combine multiple validators

---

## Module 05: Cleanup System (`05_dh-reactive-cleanup.js`)

### Cleanup Namespace

- **`ReactiveCleanup.collector()`** - Create cleanup collector for managing multiple cleanups
- **`ReactiveCleanup.scope(fn)`** - Create cleanup scope that auto-collects and cleans up
- **`ReactiveCleanup.patchState(state)`** - Manually patch existing state to use cleanup system
- **`ReactiveCleanup.isActive(effectFn)`** - Check if an effect is still active (not disposed)
- **`ReactiveCleanup.getStats()`** - Get diagnostic information about cleanup system
- **`ReactiveCleanup.debug(enable)`** - Enable or disable debug mode for cleanup operations
- **`ReactiveCleanup.test()`** - Run test to verify cleanup system is working properly

### Cleanup via ReactiveUtils

- **`ReactiveUtils.cleanup`** - Reference to ReactiveCleanup API
- **`ReactiveUtils.collector()`** - Create cleanup collector
- **`ReactiveUtils.scope(fn)`** - Create cleanup scope

### Cleanup Collector Methods

Returned by `ReactiveCleanup.collector()`:

- **`collector.add(cleanup)`** - Add cleanup function to collector (returns collector)
- **`collector.cleanup()`** - Execute all cleanup functions
- **`collector.size`** - Get number of cleanup functions (getter property)
- **`collector.disposed`** - Check if collector is disposed (getter property)

### Enhanced State Methods (added by Cleanup)

- **`state.$cleanup()`** - Remove all effects, watchers, and computed properties associated with the state

---

## Module 06: Enhancements (`06_dh-reactive-enhancements.js`)

### Safe Effects

- **`ReactiveUtils.safeEffect(fn, options)`** - Create effect with error boundary (returns cleanup function)
- **`ReactiveUtils.safeWatch(state, keyOrFn, callback, options)`** - Create watch with error boundary (returns cleanup function)

### Async Effects

- **`ReactiveUtils.asyncEffect(fn, options)`** - Create async effect with AbortSignal support (returns cleanup function)

### Enhanced Async State

When using `ReactiveUtils.asyncState()` from enhancements module:

**Enhanced Methods:**
- **`$execute(fn)`** - Execute async with automatic cancellation (receives AbortSignal)
- **`$abort()`** - Manually abort current request
- **`$reset()`** - Reset to initial state
- **`$refetch()`** - Re-execute last function

**Enhanced Properties:**
- **`data`** - Property containing async data
- **`loading`** - Property for loading state
- **`error`** - Property containing error if any
- **`requestId`** - Property tracking request sequence
- **`abortController`** - Property containing current AbortController

**Enhanced Computed Properties:**
- **`isSuccess`** - Computed property (data loaded, no error)
- **`isError`** - Computed property (has error, not loading)
- **`isIdle`** - Computed property (no data, no error, not loading)

### Error Boundaries

- **`ReactiveUtils.ErrorBoundary`** - Error boundary class constructor
- **`new ErrorBoundary(options)`** - Create error boundary instance
- **`errorBoundary.wrap(fn, context)`** - Wrap function with error handling

### Development Tools

**DevTools Namespace:**
- **`ReactiveUtils.DevTools`** - Development tools object
- **`DevTools.enable()`** - Enable DevTools and expose globally
- **`DevTools.disable()`** - Disable DevTools and remove global reference
- **`DevTools.trackState(state, name)`** - Register state for tracking
- **`DevTools.trackEffect(effect, name)`** - Register effect for tracking
- **`DevTools.getStates()`** - Get array of all tracked states with metadata
- **`DevTools.getHistory()`** - Get array of all logged state changes
- **`DevTools.clearHistory()`** - Clear DevTools history
- **`DevTools.enabled`** - Property indicating if DevTools is enabled
- **`DevTools.states`** - Map of tracked states
- **`DevTools.effects`** - Map of tracked effects
- **`DevTools.history`** - Array of change history
- **`DevTools.maxHistory`** - Maximum history size

### Priority Constants

Available as `ReactiveEnhancements.PRIORITY`:

- **`PRIORITY.COMPUTED`** - Priority level 1 (computed properties run first)
- **`PRIORITY.WATCH`** - Priority level 2 (watchers run second)
- **`PRIORITY.EFFECT`** - Priority level 3 (effects run last)

### Enhancements Namespace

- **`ReactiveEnhancements.batch`** - Enhanced batch function
- **`ReactiveEnhancements.queueUpdate`** - Queue update with priority
- **`ReactiveEnhancements.safeEffect`** - Safe effect with error boundary
- **`ReactiveEnhancements.safeWatch`** - Safe watch with error boundary
- **`ReactiveEnhancements.ErrorBoundary`** - Error boundary class
- **`ReactiveEnhancements.asyncEffect`** - Async effect with cancellation
- **`ReactiveEnhancements.asyncState`** - Enhanced async state
- **`ReactiveEnhancements.DevTools`** - Development tools
- **`ReactiveEnhancements.PRIORITY`** - Priority constants

---

## Module 07: Shortcuts (`07_dh-reactiveUtils-shortcut.js`)

### Global Shortcuts

When `07_dh-reactiveUtils-shortcut.js` is loaded, all methods available as globals:

**Core State:**
- **`state(initialState)`** - Global shortcut for ReactiveUtils.state
- **`createState(initialState, bindingDefs)`** - Global shortcut
- **`effect(fn)`** - Global shortcut
- **`batch(fn)`** - Global shortcut
- **`computed(state, defs)`** - Global shortcut
- **`watch(state, defs)`** - Global shortcut
- **`effects(defs)`** - Global shortcut

**References & Collections:**
- **`ref(value)`** - Global shortcut
- **`refs(defs)`** - Global shortcut
- **`collection(items)`** - Global shortcut
- **`list(items)`** - Global shortcut
- **`createCollection(items)`** - Global shortcut (from Collections extension)
- **`createFilteredCollection(collection, predicate)`** - Global shortcut (from Collections extension)

**Forms:**
- **`form(initialValues, options)`** - Global shortcut
- **`createForm(initialValues, options)`** - Global shortcut
- **`validators`** - Global shortcut to validators object

**Advanced:**
- **`store(initialState, options)`** - Global shortcut
- **`component(config)`** - Global shortcut
- **`reactive(initialState)`** - Global shortcut
- **`bindings(defs)`** - Global shortcut
- **`updateAll(state, updates)`** - Global shortcut

**Async:**
- **`asyncState(initialValue)`** - Global shortcut (if enhancements loaded)

**Utilities:**
- **`isReactive(value)`** - Global shortcut
- **`toRaw(value)`** - Global shortcut
- **`notify(state, key)`** - Global shortcut
- **`pause()`** - Global shortcut
- **`resume(flush)`** - Global shortcut
- **`untrack(fn)`** - Global shortcut

**Array Patching:**
- **`patchArray(state, key)`** - Global shortcut

---

## Summary by Module

### Module 01 (Core): ~50 methods
- Base reactive system with state, effects, computed, watchers
- Collections (4 basic methods with `$` prefix)
- Forms (6 basic methods)
- Async state (5 basic methods)
- Store, component, builder patterns
- Integration with Elements, Collections, Selector namespaces

### Module 02 (Array Patch): ~14 methods
- 9 reactive array mutation methods
- 5 manual patching functions across namespaces

### Module 03 (Collections Extension): ~40 methods
- 4 basic operations (no `$` prefix)
- 4 search/filter methods
- 2 sorting methods
- 3 getter properties
- 12 array methods
- 7 advanced operations
- 4 namespace methods

### Module 04 (Forms Extension): ~35 methods
- 3 namespace methods
- 3 value management methods
- 6 error management methods
- 5 touched state methods
- 2 validation methods
- 2 reset methods
- 1 submission method
- 3 event handlers
- 1 DOM binding method
- 1 serialization method
- 5 computed properties
- 10 built-in validators

### Module 05 (Cleanup): ~10 methods
- 7 cleanup namespace methods
- 3 collector methods
- 1 enhanced state method

### Module 06 (Enhancements): ~25 methods
- 3 safe effect methods
- 1 async effect method
- 7 enhanced async state methods
- 3 error boundary methods
- 10 DevTools methods
- 3 priority constants

### Module 07 (Shortcuts): ~30+ methods
- Global aliases for all core methods
- Makes entire API available without namespace prefixes

---

## Total Public Methods: 200+ methods

**Module Breakdown:**
- **Core (01):** ~50 methods - Base reactive system
- **Array Patch (02):** ~14 methods - Reactive array operations
- **Collections (03):** ~40 methods - Extended collection management
- **Forms (04):** ~35 methods - Form state and validation
- **Cleanup (05):** ~10 methods - Memory management
- **Enhancements (06):** ~25 methods - Production features
- **Shortcuts (07):** ~30+ methods - Global aliases

---