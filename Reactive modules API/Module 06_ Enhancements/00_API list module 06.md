[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

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