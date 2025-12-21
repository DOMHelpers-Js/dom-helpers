# Complete Reactive Library - All Modules Combined
## Grouped Methods by Functionality

---

## **GROUP 1: STATE CREATION & INITIALIZATION**
Methods for creating different types of reactive state

### **Basic State**
- `ReactiveUtils.state(initialState)` - Create a reactive state object (Module 01)
- `ReactiveUtils.createState(initialState, bindingDefs)` - Create state with auto-bindings (Module 01)
- `ReactiveUtils.reactive(initialState)` - Fluent builder pattern for state (Module 01)

### **References**
- `ReactiveUtils.ref(value)` - Create a reactive reference with `.value` property (Module 01)
- `ReactiveUtils.refs(defs)` - Create multiple refs from object definition (Module 01)

### **Collections**
- `ReactiveUtils.collection(items)` - Create reactive collection with $ methods (Module 01)
- `ReactiveUtils.list(items)` - Alias for collection (Module 01)
- `Collections.create(items)` - Create collection with extended methods (Module 03)
- `Collections.createWithComputed(items, computed)` - Create collection with computed properties (Module 03)
- `Collections.createFiltered(collection, predicate)` - Create filtered view that syncs with source (Module 03)
- `Collections.collection(items)` - Alias for create (Module 03)
- `Collections.list(items)` - Alias for create (Module 03)

### **Forms**
- `ReactiveUtils.form(initialValues, options)` - Create basic form state manager (Module 01)
- `Forms.create(initialValues, options)` - Create reactive form with full features (Module 04)
- `Forms.form(initialValues, options)` - Alias for create (Module 04)
- `ReactiveUtils.createForm(initialValues, options)` - Alias (Module 04)

### **Async State**
- `ReactiveUtils.async(initialValue)` - Create basic async operation state (Module 01)
- `ReactiveUtils.asyncState(initialValue)` - Create enhanced async state (Module 06)

### **Advanced State**
- `ReactiveUtils.store(initialState, options)` - Create a store with getters/actions (Module 01)
- `ReactiveUtils.component(config)` - Create a component with full lifecycle (Module 01)

---

## **GROUP 2: REACTIVITY FUNCTIONS**
Methods for creating reactive dependencies and side effects

### **Computed Properties**
- `ReactiveUtils.computed(state, defs)` - Add multiple computed properties to state (Module 01)
- `state.$computed(key, fn)` - Add computed property to instance (Module 01)

### **Watchers**
- `ReactiveUtils.watch(state, defs)` - Add multiple watchers to state (Module 01)
- `state.$watch(keyOrFn, callback)` - Watch for changes (Module 01)
- `ReactiveUtils.safeWatch(state, keyOrFn, callback, options)` - Watch with error boundary (Module 06)

### **Effects**
- `ReactiveUtils.effect(fn)` - Create single reactive effect (Module 01)
- `ReactiveUtils.effects(defs)` - Create multiple effects from object (Module 01)
- `ReactiveUtils.safeEffect(fn, options)` - Create effect with error boundary (Module 06)
- `ReactiveUtils.asyncEffect(fn, options)` - Create async effect with AbortSignal support (Module 06)

### **DOM Bindings**
- `ReactiveUtils.bindings(defs)` - Create DOM bindings with selectors (Module 01)
- `state.$bind(bindingDefs)` - Create reactive DOM bindings (Module 01)
- `Elements.bind(bindingDefs)` - ID-based bindings (uses getElementById) (Module 01)
- `Collections.bind(bindingDefs)` - Class-based bindings (uses getElementsByClassName) (Module 01)
- `Selector.query.bind(bindingDefs)` - Single element bindings (uses querySelector) (Module 01)
- `Selector.queryAll.bind(bindingDefs)` - Multiple element bindings (uses querySelectorAll) (Module 01)

---

## **GROUP 3: STATE UPDATES & MODIFICATIONS**
Methods for updating state values

### **Direct Updates**
- `state.$update(updates)` - Mixed state + DOM updates (Module 01)
- `state.$set(updates)` - Functional updates with callbacks (Module 01)
- `ReactiveUtils.updateAll(state, updates)` - Unified state + DOM updates (Module 01)
- `updateAll(state, updates)` - Global function for unified updates (Module 01)

### **Manual Notifications**
- `state.$notify(key)` - Manually trigger updates for a key (Module 01)
- `ReactiveUtils.notify(state, key)` - Manually notify dependencies (Module 01)

---

## **GROUP 4: BATCH OPERATIONS**
Methods for grouping multiple state changes

### **Core Batch**
- `ReactiveUtils.batch(fn)` - Batch updates manually (Module 01)
- `state.$batch(fn)` - Batch multiple updates (Module 01)
- `ReactiveUtils.pause()` - Pause reactivity (Module 01)
- `ReactiveUtils.resume(flush)` - Resume reactivity (Module 01)
- `ReactiveUtils.untrack(fn)` - Run function without tracking dependencies (Module 01)

### **Enhanced Batch**
- `ReactiveEnhancements.batch` - Enhanced batch function (Module 06)
- `ReactiveEnhancements.queueUpdate` - Queue update with priority (Module 06)

---

## **GROUP 5: COLLECTION OPERATIONS - BASIC CRUD**
Core create, read, update, delete operations for collections

### **Module 01 - Core Collection Methods ($ prefix)**
- `collection.$add(item)` - Add item to collection (Module 01)
- `collection.$remove(predicate)` - Remove first item by predicate/value (Module 01)
- `collection.$update(predicate, updates)` - Update first item by predicate/value (Module 01)
- `collection.$clear()` - Clear all items from collection (Module 01)
- `collection.items` - Property containing the reactive array (Module 01)

### **Module 03 - Extended Collection Methods (no $ prefix)**
- `add(item)` - Add item to collection (chainable) (Module 03)
- `remove(predicate)` - Remove first item by predicate/value (chainable) (Module 03)
- `update(predicate, updates)` - Update first item by predicate/value (chainable) (Module 03)
- `clear()` - Clear all items (chainable) (Module 03)

---

## **GROUP 6: COLLECTION OPERATIONS - BULK**
Operations that affect multiple items at once

### **Bulk Removal**
- `removeWhere(predicate)` - Remove ALL matching items (Module 03)

### **Bulk Update**
- `updateWhere(predicate, updates)` - Update ALL matching items (Module 03)

### **Bulk Toggle**
- `toggle(predicate, field)` - Toggle boolean field on single item (Module 03)
- `toggleAll(predicate, field)` - Toggle boolean field on all matching items (Module 03)

### **Reset**
- `reset(newItems)` - Reset collection with new items (Module 03)

---

## **GROUP 7: COLLECTION OPERATIONS - SEARCH & QUERY**
Methods for finding and filtering items

### **Find Methods**
- `find(predicate)` - Find first item in collection (Module 03)
- `indexOf(item)` - Get index of item (Module 03)
- `at(index)` - Get item at specific index (Module 03)
- `includes(item)` - Check if collection includes item (Module 03)

### **Filter Methods**
- `filter(predicate)` - Filter items and return new array (Module 03)

---

## **GROUP 8: COLLECTION OPERATIONS - ITERATION & TRANSFORMATION**
Methods for iterating over and transforming collection items

- `forEach(fn)` - Iterate over items (Module 03)
- `map(fn)` - Map over items and return new array (Module 03)

---

## **GROUP 9: COLLECTION OPERATIONS - SORTING & ORDERING**
Methods for arranging items in collection

- `sort(compareFn)` - Sort items in place (Module 03)
- `reverse()` - Reverse items in place (Module 03)

---

## **GROUP 10: COLLECTION OPERATIONS - ARRAY-LIKE METHODS**
Native array method equivalents for collections

### **Stack Operations (End)**
- `push(...items)` - Push items to end (Module 03)
- `pop()` - Pop item from end (Module 03)

### **Queue Operations (Start)**
- `unshift(...items)` - Unshift items to start (Module 03)
- `shift()` - Shift item from start (Module 03)

### **Advanced Array Methods**
- `splice(start, deleteCount, ...items)` - Splice items (Module 03)
- `slice(start, end)` - Get slice of items (Module 03)

---

## **GROUP 11: COLLECTION OPERATIONS - STATE QUERIES**
Getter properties and methods for collection state

- `length` - Get collection length (getter) (Module 03)
- `first` - Get first item (getter) (Module 03)
- `last` - Get last item (getter) (Module 03)
- `isEmpty()` - Check if collection is empty (Module 03)

---

## **GROUP 12: COLLECTION OPERATIONS - CONVERSION**
Methods for converting collections to other formats

- `toArray()` - Convert to plain array (Module 03)

---

## **GROUP 13: REACTIVE ARRAY METHODS**
Native array methods that trigger reactivity (Module 02)

### **Addition Methods**
- `push(...items)` - Add items to end (triggers reactivity) (Module 02)
- `unshift(...items)` - Add items to start (triggers reactivity) (Module 02)

### **Removal Methods**
- `pop()` - Remove item from end (triggers reactivity) (Module 02)
- `shift()` - Remove item from start (triggers reactivity) (Module 02)

### **Splice Method**
- `splice(start, deleteCount, ...items)` - Add/remove items at position (triggers reactivity) (Module 02)

### **Ordering Methods**
- `sort(compareFn)` - Sort array in place (triggers reactivity) (Module 02)
- `reverse()` - Reverse array in place (triggers reactivity) (Module 02)

### **Fill Methods**
- `fill(value, start, end)` - Fill array with value (triggers reactivity) (Module 02)
- `copyWithin(target, start, end)` - Copy array elements within array (triggers reactivity) (Module 02)

### **Manual Patching Functions**
- `ReactiveUtils.patchArray(state, key)` - Manually patch array property (Module 02)
- `patchReactiveArray(state, key)` - Legacy global function (Module 02)
- `Elements.patchArray(state, key)` - Array patch via Elements (Module 02)
- `Collections.patchArray(state, key)` - Array patch via Collections (Module 02)
- `Selector.patchArray(state, key)` - Array patch via Selector (Module 02)

---

## **GROUP 14: FORM OPERATIONS - VALUE MANAGEMENT**
Methods for getting and setting form field values

### **Single Field**
- `form.$setValue(field, value)` - Set field value and mark as touched (Module 01)
- `setValue(field, value)` - Set single field value (Module 04)
- `getValue(field)` - Get field value (Module 04)

### **Multiple Fields**
- `setValues(values)` - Set multiple field values in batch (Module 04)

---

## **GROUP 15: FORM OPERATIONS - ERROR MANAGEMENT**
Methods for handling field validation errors

### **Set Errors**
- `form.$setError(field, error)` - Set or clear field error (Module 01)
- `setError(field, error)` - Set field error (Module 04)
- `setErrors(errors)` - Set multiple errors in batch (Module 04)

### **Clear Errors**
- `clearError(field)` - Clear field error (Module 04)
- `clearErrors()` - Clear all errors (Module 04)

### **Query Errors**
- `hasError(field)` - Check if field has error (Module 04)
- `getError(field)` - Get field error message (Module 04)

---

## **GROUP 16: FORM OPERATIONS - TOUCHED STATE**
Methods for tracking which fields user has interacted with

### **Set Touched**
- `setTouched(field, touched)` - Mark field as touched (Module 04)
- `setTouchedFields(fields)` - Mark multiple fields as touched (Module 04)
- `touchAll()` - Mark all fields as touched (Module 04)

### **Query Touched**
- `isTouched(field)` - Check if field is touched (Module 04)
- `shouldShowError(field)` - Check if should show error (Module 04)

---

## **GROUP 17: FORM OPERATIONS - VALIDATION**
Methods for validating form fields

- `validateField(field)` - Validate single field (Module 04)
- `validate()` - Validate all fields (Module 04)

---

## **GROUP 18: FORM OPERATIONS - RESET**
Methods for resetting form state

- `form.$reset(newValues)` - Reset form to initial or new values (Module 01)
- `reset(newValues)` - Reset form to initial or new values (Module 04)
- `resetField(field)` - Reset single field (Module 04)

---

## **GROUP 19: FORM OPERATIONS - SUBMISSION**
Methods for handling form submission

- `submit(customHandler)` - Handle form submission (Module 04)

---

## **GROUP 20: FORM OPERATIONS - EVENT HANDLERS**
Methods for handling DOM events

- `handleChange(event)` - Handle input change event (Module 04)
- `handleBlur(event)` - Handle input blur event (Module 04)
- `getFieldProps(field)` - Get field props for binding (Module 04)

---

## **GROUP 21: FORM OPERATIONS - DOM BINDING**
Methods for connecting form to DOM inputs

- `bindToInputs(selector)` - Bind form to DOM inputs (Module 04)

---

## **GROUP 22: FORM OPERATIONS - SERIALIZATION**
Methods for converting form to plain objects

- `toObject()` - Convert to plain object (Module 04)

---

## **GROUP 23: FORM OPERATIONS - COMPUTED PROPERTIES**
Reactive computed properties available on form instance

### **Module 01 - Basic Form**
- `form.isValid` - Computed property for form validity (Module 01)
- `form.isDirty` - Computed property for form dirty state (Module 01)

### **Module 04 - Extended Form**
- `isValid` - Check if form is valid (Module 04)
- `isDirty` - Check if form is dirty (Module 04)
- `hasErrors` - Check if has errors (Module 04)
- `touchedFields` - Get touched fields array (Module 04)
- `errorFields` - Get error fields array (Module 04)

---

## **GROUP 24: FORM OPERATIONS - STATE PROPERTIES**
Properties containing form state data

### **Module 01 - Basic Form**
- `form.values` - Property containing form values (Module 01)
- `form.errors` - Property containing form errors (Module 01)
- `form.touched` - Property containing touched fields (Module 01)
- `form.isSubmitting` - Property for submission state (Module 01)

---

## **GROUP 25: FORM VALIDATORS**
Pre-built validation functions (Module 04)

### **Validator Access**
- `Forms.validators` - Object containing all validators (Module 04)
- `Forms.v` - Shorthand alias for validators (Module 04)
- `ReactiveUtils.validators` - Access validators via ReactiveUtils (Module 04)

### **Basic Validators**
- `Validators.required(message)` - Required field validator (Module 04)
- `Validators.email(message)` - Email format validator (Module 04)

### **Length Validators**
- `Validators.minLength(min, message)` - Minimum length validator (Module 04)
- `Validators.maxLength(max, message)` - Maximum length validator (Module 04)

### **Value Validators**
- `Validators.min(min, message)` - Minimum value validator (Module 04)
- `Validators.max(max, message)` - Maximum value validator (Module 04)

### **Pattern Validators**
- `Validators.pattern(regex, message)` - Pattern/regex validator (Module 04)

### **Comparison Validators**
- `Validators.match(fieldName, message)` - Match field validator (Module 04)

### **Custom Validators**
- `Validators.custom(validatorFn)` - Custom validator function (Module 04)
- `Validators.combine(...validators)` - Combine multiple validators (Module 04)

---

## **GROUP 26: ASYNC STATE OPERATIONS - BASIC**
Basic async state methods (Module 01)

- `asyncState.$execute(fn)` - Execute async operation and update state (Module 01)
- `asyncState.$reset()` - Reset async state to initial values (Module 01)
- `asyncState.data` - Property containing async data (Module 01)
- `asyncState.loading` - Property for loading state (Module 01)
- `asyncState.error` - Property containing error (Module 01)
- `asyncState.isSuccess` - Computed property (data loaded, no error) (Module 01)
- `asyncState.isError` - Computed property (has error, not loading) (Module 01)

---

## **GROUP 27: ASYNC STATE OPERATIONS - ENHANCED**
Enhanced async state methods (Module 06)

### **Enhanced Methods**
- `$execute(fn)` - Execute async with automatic cancellation (Module 06)
- `$abort()` - Manually abort current request (Module 06)
- `$reset()` - Reset to initial state (Module 06)
- `$refetch()` - Re-execute last function (Module 06)

### **Enhanced Properties**
- `data` - Property containing async data (Module 06)
- `loading` - Property for loading state (Module 06)
- `error` - Property containing error (Module 06)
- `requestId` - Property tracking request sequence (Module 06)
- `abortController` - Property containing current AbortController (Module 06)

### **Enhanced Computed Properties**
- `isSuccess` - Computed property (data loaded, no error) (Module 06)
- `isError` - Computed property (has error, not loading) (Module 06)
- `isIdle` - Computed property (no data, no error, not loading) (Module 06)

---

## **GROUP 28: ERROR HANDLING**
Methods for error boundaries and safe operations (Module 06)

### **Error Boundary Class**
- `ReactiveUtils.ErrorBoundary` - Error boundary class constructor (Module 06)
- `new ErrorBoundary(options)` - Create error boundary instance (Module 06)
- `errorBoundary.wrap(fn, context)` - Wrap function with error handling (Module 06)

### **Enhancements Namespace**
- `ReactiveEnhancements.ErrorBoundary` - Error boundary class (Module 06)

---

## **GROUP 29: CLEANUP SYSTEM**
Methods for managing cleanup and preventing memory leaks (Module 05)

### **Cleanup Creation**
- `ReactiveCleanup.collector()` - Create cleanup collector (Module 05)
- `ReactiveCleanup.scope(fn)` - Create cleanup scope that auto-collects (Module 05)
- `ReactiveUtils.collector()` - Create cleanup collector via ReactiveUtils (Module 05)
- `ReactiveUtils.scope(fn)` - Create cleanup scope via ReactiveUtils (Module 05)

### **State Patching**
- `ReactiveCleanup.patchState(state)` - Manually patch existing state (Module 05)

### **Diagnostic & Debugging**
- `ReactiveCleanup.isActive(effectFn)` - Check if effect is still active (Module 05)
- `ReactiveCleanup.getStats()` - Get diagnostic information (Module 05)
- `ReactiveCleanup.debug(enable)` - Enable or disable debug mode (Module 05)
- `ReactiveCleanup.test()` - Run test to verify cleanup system (Module 05)

### **Cleanup Collector Methods**
- `collector.add(cleanup)` - Add cleanup function to collector (Module 05)
- `collector.cleanup()` - Execute all cleanup functions (Module 05)
- `collector.size` - Get number of cleanup functions (Module 05)
- `collector.disposed` - Check if collector is disposed (Module 05)

### **Enhanced State Methods**
- `state.$cleanup()` - Remove all effects, watchers, and computed properties (Module 05)

### **Namespace Reference**
- `ReactiveUtils.cleanup` - Reference to ReactiveCleanup API (Module 05)

---

## **GROUP 30: DEVELOPMENT TOOLS**
Tools for debugging and monitoring (Module 06)

### **DevTools Namespace**
- `ReactiveUtils.DevTools` - Development tools object (Module 06)
- `ReactiveEnhancements.DevTools` - Development tools (Module 06)

### **Lifecycle Methods**
- `DevTools.enable()` - Enable DevTools and expose globally (Module 06)
- `DevTools.disable()` - Disable DevTools and remove global reference (Module 06)

### **Tracking Methods**
- `DevTools.trackState(state, name)` - Register state for tracking (Module 06)
- `DevTools.trackEffect(effect, name)` - Register effect for tracking (Module 06)

### **Query Methods**
- `DevTools.getStates()` - Get array of all tracked states (Module 06)
- `DevTools.getHistory()` - Get array of all logged state changes (Module 06)
- `DevTools.clearHistory()` - Clear DevTools history (Module 06)

### **DevTools Properties**
- `DevTools.enabled` - Property indicating if DevTools is enabled (Module 06)
- `DevTools.states` - Map of tracked states (Module 06)
- `DevTools.effects` - Map of tracked effects (Module 06)
- `DevTools.history` - Array of change history (Module 06)
- `DevTools.maxHistory` - Maximum history size (Module 06)

---

## **GROUP 31: PRIORITY SYSTEM**
Constants for controlling effect execution order (Module 06)

- `ReactiveEnhancements.PRIORITY` - Priority constants object (Module 06)
- `PRIORITY.COMPUTED` - Priority level 1 (computed properties run first) (Module 06)
- `PRIORITY.WATCH` - Priority level 2 (watchers run second) (Module 06)
- `PRIORITY.EFFECT` - Priority level 3 (effects run last) (Module 06)

---

## **GROUP 32: COMPONENT & BUILDER METHODS**
Methods for components and builder pattern (Module 01)

### **Component Methods**
- `component.$destroy()` - Clean up all effects, watchers, and bindings (Module 01)

### **Builder Pattern Methods**
- `builder.state` - Access to the created reactive state (Module 01)
- `builder.computed(defs)` - Add computed properties (Module 01)
- `builder.watch(defs)` - Add watchers (Module 01)
- `builder.effect(fn)` - Add effect (Module 01)
- `builder.bind(defs)` - Add bindings (Module 01)
- `builder.action(name, fn)` - Add single action (Module 01)
- `builder.actions(defs)` - Add multiple actions (Module 01)
- `builder.build()` - Build and return state with destroy method (Module 01)
- `builder.destroy()` - Clean up all effects (Module 01)

---

## **GROUP 33: REF METHODS**
Methods for reactive references (Module 01)

- `ref.value` - Property to get/set the ref value (Module 01)
- `ref.valueOf()` - Get primitive value (Module 01)
- `ref.toString()` - Convert to string (Module 01)

---

## **GROUP 34: UTILITY FUNCTIONS**
Helper methods for working with reactive state (Module 01)

- `ReactiveUtils.isReactive(value)` - Check if value is reactive (Module 01)
- `ReactiveUtils.toRaw(value)` - Get raw non-reactive value (Module 01)
- `state.$raw` - Property getter to access non-reactive raw object (Module 01)

---

## **GROUP 35: GLOBAL SHORTCUTS**
Global aliases for all core methods (Module 07)

### **Core State**
- `state(initialState)` - Global shortcut for ReactiveUtils.state (Module 07)
- `createState(initialState, bindingDefs)` - Global shortcut (Module 07)
- `effect(fn)` - Global shortcut (Module 07)
- `batch(fn)` - Global shortcut (Module 07)
- `computed(state, defs)` - Global shortcut (Module 07)
- `watch(state, defs)` - Global shortcut (Module 07)
- `effects(defs)` - Global shortcut (Module 07)

### **References & Collections**
- `ref(value)` - Global shortcut (Module 07)
- `refs(defs)` - Global shortcut (Module 07)
- `collection(items)` - Global shortcut (Module 07)
- `list(items)` - Global shortcut (Module 07)
- `createCollection(items)` - Global shortcut (Module 07)
- `createFilteredCollection(collection, predicate)` - Global shortcut (Module 07)

### **Forms**
- `form(initialValues, options)` - Global shortcut (Module 07)
- `createForm(initialValues, options)` - Global shortcut (Module 07)
- `validators` - Global shortcut to validators object (Module 07)

### **Advanced**
- `store(initialState, options)` - Global shortcut (Module 07)
- `component(config)` - Global shortcut (Module 07)
- `reactive(initialState)` - Global shortcut (Module 07)
- `bindings(defs)` - Global shortcut (Module 07)
- `updateAll(state, updates)` - Global shortcut (Module 07)

### **Async**
- `asyncState(initialValue)` - Global shortcut (Module 07)

### **Utilities**
- `isReactive(value)` - Global shortcut (Module 07)
- `toRaw(value)` - Global shortcut (Module 07)
- `notify(state, key)` - Global shortcut (Module 07)
- `pause()` - Global shortcut (Module 07)
- `resume(flush)` - Global shortcut (Module 07)
- `untrack(fn)` - Global shortcut (Module 07)

### **Array Patching**
- `patchArray(state, key)` - Global shortcut (Module 07)

---

## **SUMMARY BY CATEGORY**

| **Category** | **Method Count** | **Primary Modules** |
|--------------|------------------|---------------------|
| State Creation & Initialization | 18 methods | 01, 03, 04, 06 |
| Reactivity Functions | 12 methods | 01, 06 |
| State Updates & Modifications | 6 methods | 01 |
| Batch Operations | 7 methods | 01, 06 |
| Collection CRUD | 10 methods | 01, 03 |
| Collection Bulk Operations | 5 methods | 03 |
| Collection Search & Query | 5 methods | 03 |
| Collection Iteration & Transform | 2 methods | 03 |
| Collection Sorting & Ordering | 2 methods | 03 |
| Collection Array-like Methods | 6 methods | 03 |
| Collection State Queries | 4 methods | 03 |
| Collection Conversion | 1 method | 03 |
| Reactive Array Methods | 14 methods | 02 |
| Form Value Management | 4 methods | 01, 04 |
| Form Error Management | 8 methods | 01, 04 |
| Form Touched State | 5 methods | 04 |
| Form Validation | 2 methods | 04 |
| Form Reset | 3 methods | 01, 04 |
| Form Submission | 1 method | 04 |
| Form Event Handlers | 3 methods | 04 |
| Form DOM Binding | 1 method | 04 |
| Form Serialization | 1 method | 04 |
| Form Computed Properties | 7 properties | 01, 04 |
| Form State Properties | 4 properties | 01 |
| Form Validators | 13 validators | 04 |
| Async State Basic | 7 methods | 01 |
| Async State Enhanced | 11 methods | 06 |
| Error Handling | 5 methods | 06 |
| Cleanup System | 15 methods | 05 |
| Development Tools | 14 methods | 06 |
| Priority System | 4 constants | 06 |
| Component & Builder | 10 methods | 01 |
| Ref Methods | 3 methods | 01 |
| Utility Functions | 3 methods | 01 |
| Global Shortcuts | 30+ methods | 07 |

---

## **TOTAL METHOD COUNT: 250+ METHODS**

### **By Module:**
- **Module 01 (Core):** ~60 methods
- **Module 02 (Array Patch):** ~14 methods
- **Module 03 (Collections):** ~34 methods
- **Module 04 (Forms):** ~46 methods
- **Module 05 (Cleanup):** ~15 methods
- **Module 06 (Enhancements):** ~38 methods
- **Module 07 (Shortcuts):** ~30+ methods (aliases)

### **By Functionality:**
- **State Management:** ~40 methods
- **Collections:** ~50 methods
- **Forms:** ~70 methods
- **Async Operations:** ~18 methods
- **Error Handling:** ~8 methods
- **Cleanup:** ~15 methods
- **Development Tools:** ~14 methods
- **Utilities:** ~35 methods

---

## **QUICK REFERENCE: MOST COMMON OPERATIONS**

### **Create State**
```js
const state = ReactiveUtils.state({ count: 0 });
// or
const state = state({ count: 0 }); // Global shortcut
```

### **Create Collection**
```js
// Basic ($ methods)
const todos = ReactiveUtils.collection([]);
// Extended (no $ prefix)
const todos = Collections.create([]);
```

### **Create Form**
```js
// Basic
const form = ReactiveUtils.form({ email: '' });
// Extended with validation
const form = Forms.create({ email: '' }, {
  validators: { email: Forms.v.email() }
});
```

### **Create Effect**
```js
// Basic
ReactiveUtils.effect(() => console.log(state.count));
// Safe
ReactiveUtils.safeEffect(() => { }, { onError: handleError });
// Async
ReactiveUtils.asyncEffect(async (signal) => { }, { deps: () => state.query });
```

### **Cleanup**
```js
// Auto cleanup
const cleanup = ReactiveCleanup.collector();
cleanup.add(effect1);
cleanup.cleanup();

// State cleanup
state.$cleanup();
```

### **Debug**
```js
ReactiveUtils.DevTools.enable();
ReactiveUtils.DevTools.trackState(state, 'MyState');
```

---

This comprehensive grouping shows all 250+ methods organized by their related functionality across all 7 modules of your reactive library!