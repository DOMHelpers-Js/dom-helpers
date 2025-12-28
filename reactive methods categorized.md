[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Reactive Library - Complete Methods List (All Modules)

**Clean API Documentation - Non-$ Prefix Methods Only**

---

## Module 01: Core Reactive State (`01_dh-reactive.js`)

### ReactiveUtils Namespace

**State Creation:**
- **`ReactiveUtils.state(initialState)`** - Create a reactive state object
- **`ReactiveUtils.createState(initialState, bindingDefs)`** - Create state with auto-bindings
- **`ReactiveUtils.ref(value)`** - Create a reactive reference with `.value` property
- **`ReactiveUtils.refs(defs)`** - Create multiple refs from object definition
- **`ReactiveUtils.collection(items)`** - Create a reactive collection (core version)
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

**State Control (via Module 09):**
- **`ReactiveUtils.set(state, updates)`** - Set state values with functional updates (requires Module 09)
- **`ReactiveUtils.cleanup(state)`** - Clean up all effects and watchers (requires Module 09)
- **`ReactiveUtils.toRaw(state)`** - Get raw (non-reactive) object (requires Module 09)

### State Properties (Read/Write)

- All properties defined in `initialState` are directly accessible and reactive

### Collection Properties (Module 01 - Basic)

- **`collection.items`** - Array property containing the reactive items (read/write)

### Form Properties (Module 01 - Basic)

- **`form.values`** - Object containing form values (read/write)
- **`form.errors`** - Object containing form errors (read/write)
- **`form.touched`** - Object containing touched fields (read/write)
- **`form.isSubmitting`** - Boolean for submission state (read/write)
- **`form.isValid`** - Computed property for form validity (read-only)
- **`form.isDirty`** - Computed property for form dirty state (read-only)

### Async State Properties (Module 01 - Basic)

- **`asyncState.data`** - Property containing async data (read/write)
- **`asyncState.loading`** - Boolean for loading state (read/write)
- **`asyncState.error`** - Property containing error if any (read/write)
- **`asyncState.isSuccess`** - Computed property (data loaded, no error) (read-only)
- **`asyncState.isError`** - Computed property (has error, not loading) (read-only)

**Async State Control (via Module 09):**
- **`ReactiveUtils.execute(asyncState, fn)`** - Execute async operation (requires Module 09)
- **`ReactiveUtils.abort(asyncState)`** - Abort current async operation (requires Module 09)
- **`ReactiveUtils.reset(asyncState)`** - Reset async state (requires Module 09)
- **`ReactiveUtils.refetch(asyncState)`** - Refetch with last function (requires Module 09)

### Ref Properties

- **`ref.value`** - Property to get/set the ref value (read/write)
- **`ref.valueOf()`** - Get primitive value
- **`ref.toString()`** - Convert to string

### Builder Pattern Methods

- **`builder.state`** - Access to the created reactive state (read-only)
- **`builder.computed(defs)`** - Add computed properties (returns builder)
- **`builder.watch(defs)`** - Add watchers (returns builder)
- **`builder.effect(fn)`** - Add effect (returns builder)
- **`builder.bind(defs)`** - Add bindings (returns builder)
- **`builder.action(name, fn)`** - Add single action (returns builder)
- **`builder.actions(defs)`** - Add multiple actions (returns builder)
- **`builder.build()`** - Build and return state with destroy method
- **`builder.destroy()`** - Clean up all effects

### Component Control (via Module 09)

- **`ReactiveUtils.destroy(component)`** - Destroy component and clean up resources (requires Module 09)

### Global Functions

- **`updateAll(state, updates)`** - Global function for unified updates

---

## Module 02: Array Patch (`02_dh-reactive-array-patch.js`)

### Reactive Array Methods

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

- **`ReactiveUtils.patchArray(state, key)`** - Manually patch array property for reactivity
- **`patchReactiveArray(state, key)`** - Legacy global function name

---

## Module 03: Collections Extension (`03_dh-reactive-collections.js`)

### Collections Namespace

- **`Collections.create(items)`** - Create collection with extended methods
- **`Collections.createWithComputed(items, computed)`** - Create collection with computed properties
- **`Collections.createFiltered(collection, predicate)`** - Create filtered view that syncs with source
- **`Collections.collection(items)`** - Alias for create
- **`Collections.list(items)`** - Alias for create

### ReactiveUtils Integration

- **`ReactiveUtils.collection(items)`** - Create collection with extended methods (replaces Module 01 version)
- **`ReactiveUtils.list(items)`** - Alias for collection
- **`ReactiveUtils.createCollection(items)`** - Alias for collection

### Collection Properties

- **`collection.items`** - Array property containing the reactive items (read/write)
- **`collection.length`** - Get collection length (read-only getter)
- **`collection.first`** - Get first item (read-only getter)
- **`collection.last`** - Get last item (read-only getter)

### Basic Operations

- **`add(item)`** - Add item to collection (returns this)
- **`remove(predicate)`** - Remove item by predicate function or direct value (returns this)
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

### Forms Namespace

- **`Forms.create(initialValues, options)`** - Create reactive form
- **`Forms.form(initialValues, options)`** - Alias for create
- **`Forms.validators`** - Object containing all validators
- **`Forms.v`** - Shorthand alias for validators

### ReactiveUtils Integration

- **`ReactiveUtils.form(initialValues, options)`** - Create form with extended methods (replaces Module 01 version)
- **`ReactiveUtils.createForm(initialValues, options)`** - Alias for form
- **`ReactiveUtils.validators`** - Access validators via ReactiveUtils

### Form Properties

- **`form.values`** - Object containing form values (read/write)
- **`form.errors`** - Object containing form errors (read/write)
- **`form.touched`** - Object containing touched fields (read/write)
- **`form.isSubmitting`** - Boolean for submission state (read/write)
- **`form.submitCount`** - Number of submission attempts (read/write)
- **`form.isValid`** - Computed property for form validity (read-only)
- **`form.isDirty`** - Computed property for form dirty state (read-only)
- **`form.hasErrors`** - Computed property - check if has errors (read-only)
- **`form.touchedFields`** - Computed property - get touched fields array (read-only)
- **`form.errorFields`** - Computed property - get error fields array (read-only)

### Value Management

- **`setValue(field, value)`** - Set single field value and mark as touched (returns this)
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

- **`setTouched(field, touched)`** - Mark field as touched/untouched (returns this)
- **`setTouchedFields(fields)`** - Mark multiple fields as touched (returns this)
- **`touchAll()`** - Mark all fields as touched (returns this)
- **`isTouched(field)`** - Check if field is touched
- **`shouldShowError(field)`** - Check if should show error (touched + has error)

### Validation

- **`validateField(field)`** - Validate single field
- **`validate()`** - Validate all fields

### Reset

- **`reset(newValues)`** - Reset form to initial or new values (returns this)
- **`resetField(field)`** - Reset single field (returns this)

### Submission

- **`submit(customHandler)`** - Handle form submission (async, returns result object)

### Event Handlers

- **`handleChange(event)`** - Handle input change event
- **`handleBlur(event)`** - Handle input blur event
- **`getFieldProps(field)`** - Get field props for binding

### DOM Binding

- **`bindToInputs(selector)`** - Bind form to DOM inputs by selector (returns this)

### Serialization

- **`toObject()`** - Convert to plain object

### Built-in Validators

- **`Validators.required(message)`** - Required field validator
- **`Validators.email(message)`** - Email format validator
- **`Validators.minLength(min, message)`** - Minimum length validator
- **`Validators.maxLength(max, message)`** - Maximum length validator
- **`Validators.pattern(regex, message)`** - Pattern/regex validator
- **`Validators.min(min, message)`** - Minimum value validator
- **`Validators.max(max, message)`** - Maximum value validator
- **`Validators.match(fieldName, message)`** - Match another field validator
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

### ReactiveUtils Integration

- **`ReactiveUtils.cleanup`** - Reference to ReactiveCleanup API
- **`ReactiveUtils.collector()`** - Create cleanup collector
- **`ReactiveUtils.scope(fn)`** - Create cleanup scope

### Cleanup Collector Methods

- **`collector.add(cleanup)`** - Add cleanup function to collector (returns collector)
- **`collector.cleanup()`** - Execute all cleanup functions
- **`collector.size`** - Get number of cleanup functions (read-only getter)
- **`collector.disposed`** - Check if collector is disposed (read-only getter)

### State Cleanup (via Module 09)

- **`ReactiveUtils.cleanup(state)`** - Clean up all effects, watchers, and computed properties (requires Module 09)

---

## Module 06: Enhancements (`06_dh-reactive-enhancements.js`)

### Safe Effects

- **`ReactiveUtils.safeEffect(fn, options)`** - Create effect with error boundary (returns cleanup function)
- **`ReactiveUtils.safeWatch(state, keyOrFn, callback, options)`** - Create watch with error boundary (returns cleanup function)

### Async Effects

- **`ReactiveUtils.asyncEffect(fn, options)`** - Create async effect with AbortSignal support (returns cleanup function)

### Enhanced Async State

- **`ReactiveUtils.asyncState(initialValue, options)`** - Create enhanced async state (replaces Module 01 version)

### Enhanced Async State Properties

- **`asyncState.data`** - Property containing async data (read/write)
- **`asyncState.loading`** - Boolean for loading state (read/write)
- **`asyncState.error`** - Property containing error if any (read/write)
- **`asyncState.requestId`** - Request sequence number for race condition prevention (read/write)
- **`asyncState.abortController`** - Current AbortController instance (read/write)
- **`asyncState.isSuccess`** - Computed property (data loaded, no error) (read-only)
- **`asyncState.isError`** - Computed property (has error, not loading) (read-only)
- **`asyncState.isIdle`** - Computed property (no data, no error, not loading) (read-only)

### Enhanced Async State Control (via Module 09)

- **`ReactiveUtils.execute(asyncState, fn)`** - Execute async with AbortSignal and race condition prevention (requires Module 09)
- **`ReactiveUtils.abort(asyncState)`** - Abort current request (requires Module 09)
- **`ReactiveUtils.reset(asyncState)`** - Reset to initial state (requires Module 09)
- **`ReactiveUtils.refetch(asyncState)`** - Re-execute last function (requires Module 09)

### Error Boundaries

- **`ReactiveUtils.ErrorBoundary`** - Error boundary class constructor
- **`new ErrorBoundary(options)`** - Create error boundary instance
- **`errorBoundary.wrap(fn, context)`** - Wrap function with error handling

### Development Tools

- **`ReactiveUtils.DevTools`** - Development tools object
- **`ReactiveUtils.DevTools.enable()`** - Enable DevTools and expose globally
- **`ReactiveUtils.DevTools.disable()`** - Disable DevTools and remove global reference
- **`ReactiveUtils.DevTools.trackState(state, name)`** - Register state for tracking
- **`ReactiveUtils.DevTools.trackEffect(effect, name)`** - Register effect for tracking
- **`ReactiveUtils.DevTools.getStates()`** - Get array of all tracked states with metadata
- **`ReactiveUtils.DevTools.getHistory()`** - Get array of all logged state changes
- **`ReactiveUtils.DevTools.clearHistory()`** - Clear DevTools history
- **`ReactiveUtils.DevTools.enabled`** - Boolean indicating if DevTools is enabled (read-only)
- **`ReactiveUtils.DevTools.states`** - Map of tracked states (read-only)
- **`ReactiveUtils.DevTools.effects`** - Map of tracked effects (read-only)
- **`ReactiveUtils.DevTools.history`** - Array of change history (read-only)
- **`ReactiveUtils.DevTools.maxHistory`** - Maximum history size (default: 50) (read/write)

### Priority Constants

- **`ReactiveEnhancements.PRIORITY.COMPUTED`** - Priority level 1 (computed properties run first)
- **`ReactiveEnhancements.PRIORITY.WATCH`** - Priority level 2 (watchers run second)
- **`ReactiveEnhancements.PRIORITY.EFFECT`** - Priority level 3 (effects run last)

### Enhancements Namespace

- **`ReactiveEnhancements.batch`** - Enhanced batch function
- **`ReactiveEnhancements.queueUpdate(fn, priority)`** - Queue update with priority
- **`ReactiveEnhancements.safeEffect`** - Safe effect with error boundary
- **`ReactiveEnhancements.safeWatch`** - Safe watch with error boundary
- **`ReactiveEnhancements.ErrorBoundary`** - Error boundary class
- **`ReactiveEnhancements.asyncEffect`** - Async effect with cancellation
- **`ReactiveEnhancements.asyncState`** - Enhanced async state
- **`ReactiveEnhancements.DevTools`** - Development tools
- **`ReactiveEnhancements.PRIORITY`** - Priority constants

---

## Module 07: Shortcuts (`07_dh-reactiveUtils-shortcut.js`)

### Global Shortcuts Overview

When Module 07 is loaded, all ReactiveUtils methods become available as global functions without the `ReactiveUtils.` prefix.

### Available Global Shortcuts

**Core State:**
- **`state(initialState)`**
- **`createState(initialState, bindingDefs)`**
- **`effect(fn)`**
- **`batch(fn)`**
- **`computed(state, defs)`**
- **`watch(state, defs)`**
- **`effects(defs)`**

**References & Collections:**
- **`ref(value)`**
- **`refs(defs)`**
- **`collection(items)`**
- **`list(items)`**
- **`createCollection(items)`**
- **`createCollectionWithComputed(items, computed)`**
- **`createFilteredCollection(collection, predicate)`**

**Forms:**
- **`form(initialValues, options)`**
- **`createForm(initialValues, options)`**
- **`validators`**

**Advanced:**
- **`store(initialState, options)`**
- **`component(config)`**
- **`reactive(initialState)`**
- **`bindings(defs)`**
- **`updateAll(state, updates)`**

**Async:**
- **`asyncState(initialValue)`**

**Utilities:**
- **`isReactive(value)`**
- **`toRaw(value)`**
- **`notify(state, key)`**
- **`pause()`**
- **`resume(flush)`**
- **`untrack(fn)`**

**Array Patching:**
- **`patchArray(state, key)`**

**Storage:**
- **`autoSave(reactiveObj, key, options)`**
- **`reactiveStorage(storageType, namespace)`**
- **`watchStorage(key, callback, options)`**

**State Control:**
- **`set(state, updates)`**
- **`cleanup(state)`**
- **`getRaw(state)`**
- **`execute(asyncState, fn)`**
- **`abort(asyncState)`**
- **`reset(asyncState)`**
- **`refetch(asyncState)`**
- **`destroy(component)`**
- **`save(state)`**
- **`load(state)`**
- **`clear(state)`**
- **`exists(state)`**
- **`stopAutoSave(state)`**
- **`startAutoSave(state)`**
- **`storageInfo(state)`**

---

## Module 08: Storage/AutoSave (`08_dh-reactive-storage.js`)

### ReactiveStorage Namespace

- **`ReactiveStorage.autoSave(reactiveObj, key, options)`** - Add auto-save functionality to any reactive object
- **`ReactiveStorage.reactiveStorage(storageType, namespace)`** - Create reactive storage proxy
- **`ReactiveStorage.watch(key, callback, options)`** - Watch a storage key for changes
- **`ReactiveStorage.withStorage(reactiveObj, key, options)`** - Alias for autoSave (backward compatibility)
- **`ReactiveStorage.isStorageAvailable(type)`** - Check if storage type is available
- **`ReactiveStorage.hasLocalStorage`** - Boolean flag for localStorage availability (read-only)
- **`ReactiveStorage.hasSessionStorage`** - Boolean flag for sessionStorage availability (read-only)

### ReactiveUtils Integration

- **`ReactiveUtils.autoSave(reactiveObj, key, options)`** - Add auto-save to reactive object
- **`ReactiveUtils.reactiveStorage(storageType, namespace)`** - Create reactive storage
- **`ReactiveUtils.watchStorage(key, callback, options)`** - Watch storage key
- **`ReactiveUtils.withStorage(reactiveObj, key, options)`** - Alias for autoSave

### Storage Control (via Module 09)

- **`ReactiveUtils.save(state)`** - Force save immediately (requires Module 09)
- **`ReactiveUtils.load(state)`** - Reload from storage (requires Module 09)
- **`ReactiveUtils.clear(state)`** - Remove from storage (requires Module 09)
- **`ReactiveUtils.exists(state)`** - Check if exists in storage (requires Module 09)
- **`ReactiveUtils.stopAutoSave(state)`** - Stop automatic saving (requires Module 09)
- **`ReactiveUtils.startAutoSave(state)`** - Start automatic saving (requires Module 09)
- **`ReactiveUtils.storageInfo(state)`** - Get storage information (requires Module 09)

### Reactive Storage Proxy Methods

- **`set(key, value, options)`** - Set value in storage
- **`get(key)`** - Get value from storage
- **`remove(key)`** - Remove key from storage
- **`has(key)`** - Check if key exists
- **`keys()`** - Get all keys in namespace
- **`clear()`** - Clear all keys in namespace

---

## Module 09: Namespace Methods (`09_dh-reactive-namespace-methods.js`)

### Core State Methods

- **`ReactiveUtils.set(state, updates)`** - Set state values with functional updates
- **`ReactiveUtils.cleanup(state)`** - Clean up all effects and watchers
- **`ReactiveUtils.getRaw(state)`** - Get raw (non-reactive) object

### Async State Methods

- **`ReactiveUtils.execute(asyncState, fn)`** - Execute async operation
- **`ReactiveUtils.abort(asyncState)`** - Abort current async operation
- **`ReactiveUtils.reset(asyncState)`** - Reset async state to initial values
- **`ReactiveUtils.refetch(asyncState)`** - Refetch with last async function

### Component Methods

- **`ReactiveUtils.destroy(component)`** - Destroy component and clean up resources

### Storage Methods

- **`ReactiveUtils.save(state)`** - Force save state to storage immediately
- **`ReactiveUtils.load(state)`** - Load state from storage
- **`ReactiveUtils.clear(state)`** - Clear state from storage
- **`ReactiveUtils.exists(state)`** - Check if state exists in storage
- **`ReactiveUtils.stopAutoSave(state)`** - Stop automatic saving
- **`ReactiveUtils.startAutoSave(state)`** - Start automatic saving
- **`ReactiveUtils.storageInfo(state)`** - Get storage information

### Availability in Other Namespaces

All 14 methods above are also available via:
- **`Elements.*`** - If Elements namespace exists
- **`Collections.*`** - If Collections namespace exists
- **`Selector.*`** - If Selector namespace exists
- **Global functions** - If Module 07 (shortcuts) is loaded

---

## Summary: Total Method Count

**Module 01 (Core):** ~30 methods  
**Module 02 (Array Patch):** ~11 methods  
**Module 03 (Collections):** ~35 methods  
**Module 04 (Forms):** ~30 methods  
**Module 05 (Cleanup):** ~10 methods  
**Module 06 (Enhancements):** ~15 methods  
**Module 07 (Shortcuts):** ~50 global shortcuts  
**Module 08 (Storage):** ~13 methods  
**Module 09 (Namespace):** ~14 methods  

**Total Unique Methods: ~208 methods**


**Clean API Documentation - Non-$ Prefix Methods Only**

---

## Module 01: Core Reactive State (`01_dh-reactive.js`)

### ReactiveUtils Namespace

**State Creation:**
- **`ReactiveUtils.state(initialState)`** - Create a reactive state object
- **`ReactiveUtils.createState(initialState, bindingDefs)`** - Create state with auto-bindings
- **`ReactiveUtils.ref(value)`** - Create a reactive reference with `.value` property
- **`ReactiveUtils.refs(defs)`** - Create multiple refs from object definition
- **`ReactiveUtils.collection(items)`** - Create a reactive collection (core version)
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

**State Control (via Module 09):**
- **`ReactiveUtils.set(state, updates)`** - Set state values with functional updates (requires Module 09)
- **`ReactiveUtils.cleanup(state)`** - Clean up all effects and watchers (requires Module 09)
- **`ReactiveUtils.getRaw(state)`** - Get raw (non-reactive) object (requires Module 09)

### State Properties (Read/Write)

- All properties defined in `initialState` are directly accessible and reactive

### Collection Properties (Module 01 - Basic)

- **`collection.items`** - Array property containing the reactive items (read/write)

### Form Properties (Module 01 - Basic)

- **`form.values`** - Object containing form values (read/write)
- **`form.errors`** - Object containing form errors (read/write)
- **`form.touched`** - Object containing touched fields (read/write)
- **`form.isSubmitting`** - Boolean for submission state (read/write)
- **`form.isValid`** - Computed property for form validity (read-only)
- **`form.isDirty`** - Computed property for form dirty state (read-only)

### Async State Properties (Module 01 - Basic)

- **`asyncState.data`** - Property containing async data (read/write)
- **`asyncState.loading`** - Boolean for loading state (read/write)
- **`asyncState.error`** - Property containing error if any (read/write)
- **`asyncState.isSuccess`** - Computed property (data loaded, no error) (read-only)
- **`asyncState.isError`** - Computed property (has error, not loading) (read-only)

**Async State Control (via Module 09):**
- **`ReactiveUtils.execute(asyncState, fn)`** - Execute async operation (requires Module 09)
- **`ReactiveUtils.abort(asyncState)`** - Abort current async operation (requires Module 09)
- **`ReactiveUtils.reset(asyncState)`** - Reset async state (requires Module 09)
- **`ReactiveUtils.refetch(asyncState)`** - Refetch with last function (requires Module 09)

### Ref Properties

- **`ref.value`** - Property to get/set the ref value (read/write)
- **`ref.valueOf()`** - Get primitive value
- **`ref.toString()`** - Convert to string

### Builder Pattern Methods

- **`builder.state`** - Access to the created reactive state (read-only)
- **`builder.computed(defs)`** - Add computed properties (returns builder)
- **`builder.watch(defs)`** - Add watchers (returns builder)
- **`builder.effect(fn)`** - Add effect (returns builder)
- **`builder.bind(defs)`** - Add bindings (returns builder)
- **`builder.action(name, fn)`** - Add single action (returns builder)
- **`builder.actions(defs)`** - Add multiple actions (returns builder)
- **`builder.build()`** - Build and return state with destroy method
- **`builder.destroy()`** - Clean up all effects

### Component Control (via Module 09)

- **`ReactiveUtils.destroy(component)`** - Destroy component and clean up resources (requires Module 09)

### Global Functions

- **`updateAll(state, updates)`** - Global function for unified updates

---

## Module 02: Array Patch (`02_dh-reactive-array-patch.js`)

### Reactive Array Methods

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

- **`ReactiveUtils.patchArray(state, key)`** - Manually patch array property for reactivity
- **`patchReactiveArray(state, key)`** - Legacy global function name

---

## Module 03: Collections Extension (`03_dh-reactive-collections.js`)

### Collections Namespace

- **`Collections.create(items)`** - Create collection with extended methods
- **`Collections.createWithComputed(items, computed)`** - Create collection with computed properties
- **`Collections.createFiltered(collection, predicate)`** - Create filtered view that syncs with source
- **`Collections.collection(items)`** - Alias for create
- **`Collections.list(items)`** - Alias for create

### ReactiveUtils Integration

- **`ReactiveUtils.collection(items)`** - Create collection with extended methods (replaces Module 01 version)
- **`ReactiveUtils.list(items)`** - Alias for collection
- **`ReactiveUtils.createCollection(items)`** - Alias for collection

### Collection Properties

- **`collection.items`** - Array property containing the reactive items (read/write)
- **`collection.length`** - Get collection length (read-only getter)
- **`collection.first`** - Get first item (read-only getter)
- **`collection.last`** - Get last item (read-only getter)

### Basic Operations

- **`add(item)`** - Add item to collection (returns this)
- **`remove(predicate)`** - Remove item by predicate function or direct value (returns this)
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

### Forms Namespace

- **`Forms.create(initialValues, options)`** - Create reactive form
- **`Forms.form(initialValues, options)`** - Alias for create
- **`Forms.validators`** - Object containing all validators
- **`Forms.v`** - Shorthand alias for validators

### ReactiveUtils Integration

- **`ReactiveUtils.form(initialValues, options)`** - Create form with extended methods (replaces Module 01 version)
- **`ReactiveUtils.createForm(initialValues, options)`** - Alias for form
- **`ReactiveUtils.validators`** - Access validators via ReactiveUtils

### Form Properties

- **`form.values`** - Object containing form values (read/write)
- **`form.errors`** - Object containing form errors (read/write)
- **`form.touched`** - Object containing touched fields (read/write)
- **`form.isSubmitting`** - Boolean for submission state (read/write)
- **`form.submitCount`** - Number of submission attempts (read/write)
- **`form.isValid`** - Computed property for form validity (read-only)
- **`form.isDirty`** - Computed property for form dirty state (read-only)
- **`form.hasErrors`** - Computed property - check if has errors (read-only)
- **`form.touchedFields`** - Computed property - get touched fields array (read-only)
- **`form.errorFields`** - Computed property - get error fields array (read-only)

### Value Management

- **`setValue(field, value)`** - Set single field value and mark as touched (returns this)
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

- **`setTouched(field, touched)`** - Mark field as touched/untouched (returns this)
- **`setTouchedFields(fields)`** - Mark multiple fields as touched (returns this)
- **`touchAll()`** - Mark all fields as touched (returns this)
- **`isTouched(field)`** - Check if field is touched
- **`shouldShowError(field)`** - Check if should show error (touched + has error)

### Validation

- **`validateField(field)`** - Validate single field
- **`validate()`** - Validate all fields

### Reset

- **`reset(newValues)`** - Reset form to initial or new values (returns this)
- **`resetField(field)`** - Reset single field (returns this)

### Submission

- **`submit(customHandler)`** - Handle form submission (async, returns result object)

### Event Handlers

- **`handleChange(event)`** - Handle input change event
- **`handleBlur(event)`** - Handle input blur event
- **`getFieldProps(field)`** - Get field props for binding

### DOM Binding

- **`bindToInputs(selector)`** - Bind form to DOM inputs by selector (returns this)

### Serialization

- **`toObject()`** - Convert to plain object

### Built-in Validators

- **`Validators.required(message)`** - Required field validator
- **`Validators.email(message)`** - Email format validator
- **`Validators.minLength(min, message)`** - Minimum length validator
- **`Validators.maxLength(max, message)`** - Maximum length validator
- **`Validators.pattern(regex, message)`** - Pattern/regex validator
- **`Validators.min(min, message)`** - Minimum value validator
- **`Validators.max(max, message)`** - Maximum value validator
- **`Validators.match(fieldName, message)`** - Match another field validator
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

### ReactiveUtils Integration

- **`ReactiveUtils.cleanup`** - Reference to ReactiveCleanup API
- **`ReactiveUtils.collector()`** - Create cleanup collector
- **`ReactiveUtils.scope(fn)`** - Create cleanup scope

### Cleanup Collector Methods

- **`collector.add(cleanup)`** - Add cleanup function to collector (returns collector)
- **`collector.cleanup()`** - Execute all cleanup functions
- **`collector.size`** - Get number of cleanup functions (read-only getter)
- **`collector.disposed`** - Check if collector is disposed (read-only getter)

### State Cleanup (via Module 09)

- **`ReactiveUtils.cleanup(state)`** - Clean up all effects, watchers, and computed properties (requires Module 09)

---

## Module 06: Enhancements (`06_dh-reactive-enhancements.js`)

### Safe Effects

- **`ReactiveUtils.safeEffect(fn, options)`** - Create effect with error boundary (returns cleanup function)
- **`ReactiveUtils.safeWatch(state, keyOrFn, callback, options)`** - Create watch with error boundary (returns cleanup function)

### Async Effects

- **`ReactiveUtils.asyncEffect(fn, options)`** - Create async effect with AbortSignal support (returns cleanup function)

### Enhanced Async State

- **`ReactiveUtils.asyncState(initialValue, options)`** - Create enhanced async state (replaces Module 01 version)

### Enhanced Async State Properties

- **`asyncState.data`** - Property containing async data (read/write)
- **`asyncState.loading`** - Boolean for loading state (read/write)
- **`asyncState.error`** - Property containing error if any (read/write)
- **`asyncState.requestId`** - Request sequence number for race condition prevention (read/write)
- **`asyncState.abortController`** - Current AbortController instance (read/write)
- **`asyncState.isSuccess`** - Computed property (data loaded, no error) (read-only)
- **`asyncState.isError`** - Computed property (has error, not loading) (read-only)
- **`asyncState.isIdle`** - Computed property (no data, no error, not loading) (read-only)

### Enhanced Async State Control (via Module 09)

- **`ReactiveUtils.execute(asyncState, fn)`** - Execute async with AbortSignal and race condition prevention (requires Module 09)
- **`ReactiveUtils.abort(asyncState)`** - Abort current request (requires Module 09)
- **`ReactiveUtils.reset(asyncState)`** - Reset to initial state (requires Module 09)
- **`ReactiveUtils.refetch(asyncState)`** - Re-execute last function (requires Module 09)

### Error Boundaries

- **`ReactiveUtils.ErrorBoundary`** - Error boundary class constructor
- **`new ErrorBoundary(options)`** - Create error boundary instance
- **`errorBoundary.wrap(fn, context)`** - Wrap function with error handling

### Development Tools

- **`ReactiveUtils.DevTools`** - Development tools object
- **`ReactiveUtils.DevTools.enable()`** - Enable DevTools and expose globally
- **`ReactiveUtils.DevTools.disable()`** - Disable DevTools and remove global reference
- **`ReactiveUtils.DevTools.trackState(state, name)`** - Register state for tracking
- **`ReactiveUtils.DevTools.trackEffect(effect, name)`** - Register effect for tracking
- **`ReactiveUtils.DevTools.getStates()`** - Get array of all tracked states with metadata
- **`ReactiveUtils.DevTools.getHistory()`** - Get array of all logged state changes
- **`ReactiveUtils.DevTools.clearHistory()`** - Clear DevTools history
- **`ReactiveUtils.DevTools.enabled`** - Boolean indicating if DevTools is enabled (read-only)
- **`ReactiveUtils.DevTools.states`** - Map of tracked states (read-only)
- **`ReactiveUtils.DevTools.effects`** - Map of tracked effects (read-only)
- **`ReactiveUtils.DevTools.history`** - Array of change history (read-only)
- **`ReactiveUtils.DevTools.maxHistory`** - Maximum history size (default: 50) (read/write)

### Priority Constants

- **`ReactiveEnhancements.PRIORITY.COMPUTED`** - Priority level 1 (computed properties run first)
- **`ReactiveEnhancements.PRIORITY.WATCH`** - Priority level 2 (watchers run second)
- **`ReactiveEnhancements.PRIORITY.EFFECT`** - Priority level 3 (effects run last)

### Enhancements Namespace

- **`ReactiveEnhancements.batch`** - Enhanced batch function
- **`ReactiveEnhancements.queueUpdate(fn, priority)`** - Queue update with priority
- **`ReactiveEnhancements.safeEffect`** - Safe effect with error boundary
- **`ReactiveEnhancements.safeWatch`** - Safe watch with error boundary
- **`ReactiveEnhancements.ErrorBoundary`** - Error boundary class
- **`ReactiveEnhancements.asyncEffect`** - Async effect with cancellation
- **`ReactiveEnhancements.asyncState`** - Enhanced async state
- **`ReactiveEnhancements.DevTools`** - Development tools
- **`ReactiveEnhancements.PRIORITY`** - Priority constants

---

## Module 07: Shortcuts (`07_dh-reactiveUtils-shortcut.js`)

### Global Shortcuts Overview

When Module 07 is loaded, all ReactiveUtils methods become available as global functions without the `ReactiveUtils.` prefix.

### Available Global Shortcuts

**Core State:**
- **`state(initialState)`**
- **`createState(initialState, bindingDefs)`**
- **`effect(fn)`**
- **`batch(fn)`**
- **`computed(state, defs)`**
- **`watch(state, defs)`**
- **`effects(defs)`**

**References & Collections:**
- **`ref(value)`**
- **`refs(defs)`**
- **`collection(items)`**
- **`list(items)`**
- **`createCollection(items)`**
- **`createCollectionWithComputed(items, computed)`**
- **`createFilteredCollection(collection, predicate)`**

**Forms:**
- **`form(initialValues, options)`**
- **`createForm(initialValues, options)`**
- **`validators`**

**Advanced:**
- **`store(initialState, options)`**
- **`component(config)`**
- **`reactive(initialState)`**
- **`bindings(defs)`**
- **`updateAll(state, updates)`**

**Async:**
- **`asyncState(initialValue)`**

**Utilities:**
- **`isReactive(value)`**
- **`toRaw(value)`**
- **`notify(state, key)`**
- **`pause()`**
- **`resume(flush)`**
- **`untrack(fn)`**

**Array Patching:**
- **`patchArray(state, key)`**

**Storage:**
- **`autoSave(reactiveObj, key, options)`**
- **`reactiveStorage(storageType, namespace)`**
- **`watchStorage(key, callback, options)`**

**State Control:**
- **`set(state, updates)`**
- **`cleanup(state)`**
- **`getRaw(state)`**
- **`execute(asyncState, fn)`**
- **`abort(asyncState)`**
- **`reset(asyncState)`**
- **`refetch(asyncState)`**
- **`destroy(component)`**
- **`save(state)`**
- **`load(state)`**
- **`clear(state)`**
- **`exists(state)`**
- **`stopAutoSave(state)`**
- **`startAutoSave(state)`**
- **`storageInfo(state)`**

---

## Module 08: Storage/AutoSave (`08_dh-reactive-storage.js`)

### ReactiveStorage Namespace

- **`ReactiveStorage.autoSave(reactiveObj, key, options)`** - Add auto-save functionality to any reactive object
- **`ReactiveStorage.reactiveStorage(storageType, namespace)`** - Create reactive storage proxy
- **`ReactiveStorage.watch(key, callback, options)`** - Watch a storage key for changes
- **`ReactiveStorage.withStorage(reactiveObj, key, options)`** - Alias for autoSave (backward compatibility)
- **`ReactiveStorage.isStorageAvailable(type)`** - Check if storage type is available
- **`ReactiveStorage.hasLocalStorage`** - Boolean flag for localStorage availability (read-only)
- **`ReactiveStorage.hasSessionStorage`** - Boolean flag for sessionStorage availability (read-only)

### ReactiveUtils Integration

- **`ReactiveUtils.autoSave(reactiveObj, key, options)`** - Add auto-save to reactive object
- **`ReactiveUtils.reactiveStorage(storageType, namespace)`** - Create reactive storage
- **`ReactiveUtils.watchStorage(key, callback, options)`** - Watch storage key
- **`ReactiveUtils.withStorage(reactiveObj, key, options)`** - Alias for autoSave

### Storage Control (via Module 09)

- **`ReactiveUtils.save(state)`** - Force save immediately (requires Module 09)
- **`ReactiveUtils.load(state)`** - Reload from storage (requires Module 09)
- **`ReactiveUtils.clear(state)`** - Remove from storage (requires Module 09)
- **`ReactiveUtils.exists(state)`** - Check if exists in storage (requires Module 09)
- **`ReactiveUtils.stopAutoSave(state)`** - Stop automatic saving (requires Module 09)
- **`ReactiveUtils.startAutoSave(state)`** - Start automatic saving (requires Module 09)
- **`ReactiveUtils.storageInfo(state)`** - Get storage information (requires Module 09)

### Reactive Storage Proxy Methods

- **`set(key, value, options)`** - Set value in storage
- **`get(key)`** - Get value from storage
- **`remove(key)`** - Remove key from storage
- **`has(key)`** - Check if key exists
- **`keys()`** - Get all keys in namespace
- **`clear()`** - Clear all keys in namespace

---

## Module 09: Namespace Methods (`09_dh-reactive-namespace-methods.js`)

### Core State Methods

- **`ReactiveUtils.set(state, updates)`** - Set state values with functional updates
- **`ReactiveUtils.cleanup(state)`** - Clean up all effects and watchers
- **`ReactiveUtils.getRaw(state)`** - Get raw (non-reactive) object

### Async State Methods

- **`ReactiveUtils.execute(asyncState, fn)`** - Execute async operation
- **`ReactiveUtils.abort(asyncState)`** - Abort current async operation
- **`ReactiveUtils.reset(asyncState)`** - Reset async state to initial values
- **`ReactiveUtils.refetch(asyncState)`** - Refetch with last async function

### Component Methods

- **`ReactiveUtils.destroy(component)`** - Destroy component and clean up resources

### Storage Methods

- **`ReactiveUtils.save(state)`** - Force save state to storage immediately
- **`ReactiveUtils.load(state)`** - Load state from storage
- **`ReactiveUtils.clear(state)`** - Clear state from storage
- **`ReactiveUtils.exists(state)`** - Check if state exists in storage
- **`ReactiveUtils.stopAutoSave(state)`** - Stop automatic saving
- **`ReactiveUtils.startAutoSave(state)`** - Start automatic saving
- **`ReactiveUtils.storageInfo(state)`** - Get storage information

### Availability in Other Namespaces

All 14 methods above are also available via:
- **`Elements.*`** - If Elements namespace exists
- **`Collections.*`** - If Collections namespace exists
- **`Selector.*`** - If Selector namespace exists
- **Global functions** - If Module 07 (shortcuts) is loaded

---

## Summary: Total Method Count

**Module 01 (Core):** ~30 methods  
**Module 02 (Array Patch):** ~11 methods  
**Module 03 (Collections):** ~35 methods  
**Module 04 (Forms):** ~30 methods  
**Module 05 (Cleanup):** ~10 methods  
**Module 06 (Enhancements):** ~15 methods  
**Module 07 (Shortcuts):** ~50 global shortcuts  
**Module 08 (Storage):** ~13 methods  
**Module 09 (Namespace):** ~14 methods  

**Total Unique Methods: ~208 methods**

