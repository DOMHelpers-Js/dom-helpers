[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers - Reactive State Extension v2.0.2 - Complete Method List

## Core State Creation

- **`state(initialState)`** - Create a reactive state object
- **`createState(initialState, bindingDefs)`** - Create state with auto-bindings
- **`ref(value)`** - Create a reactive reference with `.value` property
- **`refs(defs)`** - Create multiple refs from object definition
- **`collection(items)`** - Create a reactive collection/list (core version with $ methods)
- **`list(items)`** - Alias for collection()
- **`form(initialValues)`** - Create a form state manager
- **`async(initialValue)`** - Create async operation state
- **`store(initialState, options)`** - Create a store with getters/actions
- **`component(config)`** - Create a component with full lifecycle
- **`reactive(initialState)`** - Fluent builder pattern for state

## Instance Methods (on reactive state objects)

### State Management
- **`$computed(key, fn)`** - Add computed property
- **`$watch(keyOrFn, callback)`** - Watch for changes
- **`$batch(fn)`** - Batch multiple updates
- **`$notify(key)`** - Manually trigger updates for a key (or all if no key)
- **`$raw`** - Property getter to access non-reactive raw object
- **`$update(updates)`** - Mixed state + DOM updates (supports selectors and nested paths)
- **`$set(updates)`** - Functional updates with callbacks
- **`$bind(bindingDefs)`** - Create reactive DOM bindings

## Collection Instance Methods

### Core Collection Methods (ReactiveUtils.collection / list)
When using the built-in `collection()` or `list()` function from core reactive library:

- **`$add(item)`** - Add item to collection
- **`$remove(predicate)`** - Remove item by predicate function or direct value
- **`$update(predicate, updates)`** - Update item in collection by predicate or value
- **`$clear()`** - Clear all items from collection
- **`items`** - Property containing the reactive array

### Collections Extension Methods (Collections.create)
When using `Collections.create()` from the collections extension module:

#### Basic Operations
- **`add(item)`** - Add item to collection (returns this for chaining)
- **`remove(predicate)`** - Remove item by predicate or value (returns this)
- **`update(predicate, updates)`** - Update item by predicate or value (returns this)
- **`clear()`** - Clear all items (returns this)

#### Search & Filter
- **`find(predicate)`** - Find item in collection
- **`filter(predicate)`** - Filter items and return new array
- **`map(fn)`** - Map over items and return new array
- **`forEach(fn)`** - Iterate over items (returns this)

#### Sorting & Ordering
- **`sort(compareFn)`** - Sort items in place (returns this)
- **`reverse()`** - Reverse items in place (returns this)

#### Getters
- **`length`** - Get collection length (property)
- **`first`** - Get first item (property)
- **`last`** - Get last item (property)

#### Array Methods
- **`at(index)`** - Get item at index
- **`includes(item)`** - Check if includes item
- **`indexOf(item)`** - Get index of item
- **`slice(start, end)`** - Get slice of items
- **`splice(start, deleteCount, ...items)`** - Splice items (returns this)
- **`push(...items)`** - Push items to end (returns this)
- **`pop()`** - Pop item from end
- **`shift()`** - Shift item from start
- **`unshift(...items)`** - Unshift items to start (returns this)

#### Advanced Operations
- **`toggle(predicate, field)`** - Toggle boolean field on item (returns this)
- **`removeWhere(predicate)`** - Remove all matching items (returns this)
- **`updateWhere(predicate, updates)`** - Update all matching items (returns this)
- **`reset(newItems)`** - Reset collection with new items (returns this)
- **`toArray()`** - Convert to plain array
- **`isEmpty()`** - Check if empty

## Form Instance Methods

- **`$setValue(field, value)`** - Set form field value and mark as touched
- **`$setError(field, error)`** - Set or clear field error
- **`$reset(newValues)`** - Reset form to initial or new values
- **`values`** - Property containing form values
- **`errors`** - Property containing form errors
- **`touched`** - Property containing touched fields
- **`isSubmitting`** - Property for submission state
- **`isValid`** - Computed property for form validity
- **`isDirty`** - Computed property for form dirty state

### Forms Extension Methods (Forms.create)
When using `Forms.create()` from the forms extension module:

#### Value Management
- **`setValue(field, value)`** - Set single field value (returns this)
- **`setValues(values)`** - Set multiple field values (returns this)
- **`getValue(field)`** - Get field value

#### Error Management
- **`setError(field, error)`** - Set field error (returns this)
- **`setErrors(errors)`** - Set multiple errors (returns this)
- **`clearError(field)`** - Clear field error (returns this)
- **`clearErrors()`** - Clear all errors (returns this)
- **`hasError(field)`** - Check if field has error
- **`getError(field)`** - Get field error message

#### Touched State Management
- **`setTouched(field, touched)`** - Mark field as touched (returns this)
- **`setTouchedFields(fields)`** - Mark multiple fields as touched (returns this)
- **`touchAll()`** - Mark all fields as touched (returns this)
- **`isTouched(field)`** - Check if field is touched
- **`shouldShowError(field)`** - Check if should show error (touched + has error)

#### Validation
- **`validateField(field)`** - Validate single field
- **`validate()`** - Validate all fields

#### Reset
- **`reset(newValues)`** - Reset form to initial or new values (returns this)
- **`resetField(field)`** - Reset single field (returns this)

#### Submission
- **`submit(customHandler)`** - Handle form submission (async)

#### Event Handlers
- **`handleChange(event)`** - Handle input change event
- **`handleBlur(event)`** - Handle input blur event
- **`getFieldProps(field)`** - Get field props for binding

#### DOM Binding
- **`bindToInputs(selector)`** - Bind form to DOM inputs (returns this)

#### Serialization
- **`toObject()`** - Convert to plain object

#### Computed Properties (Forms Extension)
- **`isValid`** - Check if form is valid (computed property)
- **`isDirty`** - Check if form is dirty (computed property)
- **`hasErrors`** - Check if has errors (computed property)
- **`touchedFields`** - Get touched fields array (computed property)
- **`errorFields`** - Get error fields array (computed property)

## Async State Instance Methods

- **`$execute(fn)`** - Execute async operation and update state
- **`$reset()`** - Reset async state to initial values
- **`data`** - Property containing async data
- **`loading`** - Property for loading state
- **`error`** - Property containing error if any
- **`isSuccess`** - Computed property (data loaded, no error)
- **`isError`** - Computed property (has error, not loading)

## Component Instance Methods

- **`$destroy()`** - Clean up all effects, watchers, and bindings

## Ref Instance Methods

- **`value`** - Property to get/set the ref value
- **`valueOf()`** - Get primitive value
- **`toString()`** - Convert to string

## Reactivity Functions

- **`computed(state, defs)`** - Add multiple computed properties to state
- **`watch(state, defs)`** - Add multiple watchers to state
- **`effect(fn)`** - Create single reactive effect
- **`effects(defs)`** - Create multiple effects from object
- **`bindings(defs)`** - Create DOM bindings with selectors

## Batch Operations

- **`batch(fn)`** - Batch updates manually (executes fn and flushes after)
- **`pause()`** - Pause reactivity (increment batch depth)
- **`resume(flush)`** - Resume reactivity (decrement batch depth, optionally flush)
- **`untrack(fn)`** - Run function without tracking dependencies

## Utility Functions

- **`isReactive(value)`** - Check if value is reactive
- **`toRaw(value)`** - Get raw non-reactive value (handles nested RAW symbol)
- **`notify(state, key)`** - Manually notify dependencies for a key or all keys
- **`updateAll(state, updates)`** - Unified state + DOM updates

## Array Patch Methods (Array Support Extension)

When the array patch extension is loaded, these array methods become reactive:

- **`push(...items)`** - Add items to end (triggers reactivity)
- **`pop()`** - Remove item from end (triggers reactivity)
- **`shift()`** - Remove item from start (triggers reactivity)
- **`unshift(...items)`** - Add items to start (triggers reactivity)
- **`splice(start, deleteCount, ...items)`** - Add/remove items (triggers reactivity)
- **`sort(compareFn)`** - Sort in place (triggers reactivity)
- **`reverse()`** - Reverse in place (triggers reactivity)
- **`fill(value, start, end)`** - Fill with value (triggers reactivity)
- **`copyWithin(target, start, end)`** - Copy within array (triggers reactivity)

### Global Array Patch Function
- **`patchReactiveArray(state, key)`** - Manually patch array property to make it reactive

## Integration Methods (Elements namespace)

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
- **`Elements.bind(bindingDefs)`** - ID-based bindings (special)

## Integration Methods (Collections namespace)

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
- **`Collections.bind(bindingDefs)`** - Class-based bindings (special)

### Collections Extension Specific
- **`Collections.create(items)`** - Create collection with extended methods
- **`Collections.createWithComputed(items, computed)`** - Create collection with computed properties
- **`Collections.createFiltered(collection, predicate)`** - Create filtered view
- **`Collections.collection(items)`** - Alias for create
- **`Collections.list(items)`** - Alias for create

## Integration Methods (Selector namespace)

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

### Selector.query Methods
- **`Selector.query.state()`** - All core methods (same as above)
- **`Selector.query.bind(bindingDefs)`** - Single element bindings (special)

### Selector.queryAll Methods
- **`Selector.queryAll.state()`** - All core methods (same as above)
- **`Selector.queryAll.bind(bindingDefs)`** - Multiple element bindings (special)

## Forms Extension Namespace

- **`Forms.create(initialValues, options)`** - Create reactive form
- **`Forms.form(initialValues, options)`** - Alias for create
- **`Forms.validators`** - Object containing all validators
- **`Forms.v`** - Shorthand alias for validators

## Validators (Forms Extension)

### Built-in Validators
- **`validators.required(message)`** - Required field validator
- **`validators.email(message)`** - Email format validator
- **`validators.minLength(min, message)`** - Minimum length validator
- **`validators.maxLength(max, message)`** - Maximum length validator
- **`validators.pattern(regex, message)`** - Pattern/regex validator
- **`validators.min(min, message)`** - Minimum value validator
- **`validators.max(max, message)`** - Maximum value validator
- **`validators.match(fieldName, message)`** - Match field validator
- **`validators.custom(validatorFn)`** - Custom validator function
- **`validators.combine(...validators)`** - Combine multiple validators

### Validator Aliases (shorthand via Forms.v)
- **`v.required(message)`** - Alias for validators.required
- **`v.email(message)`** - Alias for validators.email
- **`v.minLength(min, message)`** - Alias for validators.minLength
- **`v.maxLength(max, message)`** - Alias for validators.maxLength
- **`v.pattern(regex, message)`** - Alias for validators.pattern
- **`v.min(min, message)`** - Alias for validators.min
- **`v.max(max, message)`** - Alias for validators.max
- **`v.match(fieldName, message)`** - Alias for validators.match
- **`v.custom(validatorFn)`** - Alias for validators.custom
- **`v.combine(...validators)`** - Alias for validators.combine

## Builder Pattern Methods (reactive() return value)

- **`.state`** - Access to the created reactive state
- **`.computed(defs)`** - Add computed properties, returns builder
- **`.watch(defs)`** - Add watchers, returns builder
- **`.effect(fn)`** - Add effect, returns builder
- **`.bind(defs)`** - Add bindings, returns builder
- **`.action(name, fn)`** - Add single action, returns builder
- **`.actions(defs)`** - Add multiple actions, returns builder
- **`.build()`** - Build and return state with destroy method
- **`.destroy()`** - Clean up all effects

## Global Objects

- **`ReactiveState.create(initialState)`** - Create reactive state
- **`ReactiveState.form(initialValues)`** - Create form state
- **`ReactiveState.async(initialValue)`** - Create async state
- **`ReactiveState.collection(items)`** - Create collection
- **`ReactiveState.list(items)`** - Alias for collection
- **`ReactiveUtils`** - Object containing all core API methods
- **`updateAll(state, updates)`** - Global unified updates function
- **`patchReactiveArray(state, key)`** - Global array patching function (when array patch loaded)
- **`Collections`** - Global collections namespace (when collections extension loaded)
- **`Forms`** - Global forms namespace (when forms extension loaded)

## Internal Symbols (not for direct use)

- **`RAW`** - Symbol for accessing raw object
- **`IS_REACTIVE`** - Symbol for checking reactivity

## Store Options (for store() function)

- **`getters`** - Object of getter functions (become computed properties)
- **`actions`** - Object of action functions

## Component Config (for component() function)

- **`state`** - Initial state object
- **`computed`** - Object of computed property functions
- **`watch`** - Object of watcher functions
- **`effects`** - Object/array of effect functions
- **`bindings`** - Object of DOM bindings
- **`actions`** - Object of action functions
- **`mounted`** - Lifecycle hook called after setup
- **`unmounted`** - Lifecycle hook called on destroy

---

**Total Methods:** 150+ methods including all namespace integrations, extensions, and variations

**Module Structure:**
- **Core:** `01_dh-reactive.js` - Base reactive system with state, computed, watch, effects, bindings
- **Array Patch:** `02_dh-reactive-array-patch.js` - Makes array methods reactive
- **Collections:** `03_dh-reactive-collections.js` - Extended collection management
- **Forms:** `04_dh-reactive-form.js` - Form state and validation management