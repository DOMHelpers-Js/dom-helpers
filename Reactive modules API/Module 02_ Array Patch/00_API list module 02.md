[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


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