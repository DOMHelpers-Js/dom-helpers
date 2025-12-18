[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


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