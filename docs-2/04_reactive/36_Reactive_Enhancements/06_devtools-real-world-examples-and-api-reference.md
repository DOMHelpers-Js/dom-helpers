[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# DevTools, Real-World Examples, and API Reference

## Part 1: DevTools

### What Are DevTools?

The DevTools provide visibility into the reactive system — you can track states, log changes, and inspect history. They auto-enable on `localhost` and `127.0.0.1` so you get debugging tools in development without any setup.

---

### Auto-Enabling

```javascript
// DevTools auto-enable if you're on localhost:
if (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1') {
  DevTools.enable();
  // Console: [DevTools] Enabled - inspect with window.__REACTIVE_DEVTOOLS__
}
```

To manually enable or disable:

```javascript
ReactiveUtils.DevTools.enable();   // Enable
ReactiveUtils.DevTools.disable();  // Disable
```

---

### Tracking States

Register a state with a name so it shows up in DevTools:

```javascript
const appState = ReactiveUtils.state({ count: 0 });
ReactiveUtils.DevTools.trackState(appState, 'App State');

const userState = ReactiveUtils.state({ name: 'Alice' });
ReactiveUtils.DevTools.trackState(userState, 'User');
```

---

### Logging Changes

Log state changes for debugging:

```javascript
ReactiveUtils.DevTools.logChange(appState, 'count', 0, 5);
// Records: { stateId: 1, stateName: 'App State', key: 'count',
//            oldValue: 0, newValue: 5, timestamp: ... }
```

---

### Viewing Tracked States

```javascript
const states = ReactiveUtils.DevTools.getStates();
console.table(states);
// [
//   { id: 1, name: 'App State', created: ..., updates: [...], state: Proxy },
//   { id: 2, name: 'User', created: ..., updates: [...], state: Proxy }
// ]
```

---

### Viewing Change History

```javascript
const history = ReactiveUtils.DevTools.getHistory();
console.table(history);
// [
//   { stateId: 1, stateName: 'App State', key: 'count',
//     oldValue: 0, newValue: 5, timestamp: ... },
//   ...
// ]
```

History is capped at 50 entries by default (configurable via `DevTools.maxHistory`).

---

### Clearing History

```javascript
ReactiveUtils.DevTools.clearHistory();
// Clears both global history and per-state update logs
```

---

### Inspecting from the Console

Because DevTools are exposed on `window.__REACTIVE_DEVTOOLS__`, you can inspect everything from the browser console:

```javascript
// In the browser console:
__REACTIVE_DEVTOOLS__.getStates()    // All tracked states
__REACTIVE_DEVTOOLS__.getHistory()   // Change history
__REACTIVE_DEVTOOLS__.clearHistory() // Clear all logs
```

---

### DevTools API Summary

| Method | Description |
|--------|-------------|
| `.enable()` | Enable DevTools, expose on `window.__REACTIVE_DEVTOOLS__` |
| `.disable()` | Disable DevTools, remove from `window` |
| `.trackState(state, name)` | Register a state for tracking |
| `.trackEffect(effect, name)` | Register an effect for tracking |
| `.logChange(state, key, old, new)` | Log a state change |
| `.getStates()` | Get all tracked states |
| `.getHistory()` | Get change history (max 50 entries) |
| `.clearHistory()` | Clear all history |

---

## Part 2: Real-World Examples

### Example 1: Search with Debounced Fetch

```javascript
const state = ReactiveUtils.state({ query: '' });
const results = ReactiveUtils.asyncState([]);

// Async effect that re-runs whenever query changes
const stop = ReactiveUtils.asyncEffect(async (signal) => {
  const query = state.query;
  if (!query) return;

  // Wait 300ms before fetching (debounce)
  await new Promise(resolve => setTimeout(resolve, 300));

  // If aborted during the wait, stop here
  if (signal.aborted) return;

  const response = await fetch(`/api/search?q=${query}`, { signal });
  const data = await response.json();
  results.data = data;
});

// UI updates reactively
ReactiveUtils.effect(() => {
  document.getElementById('results').innerHTML = results.loading
    ? '<p>Searching...</p>'
    : (results.data || []).map(r => `<div>${r.name}</div>`).join('');
});
```

**Key patterns:** `asyncEffect` with signal, debounce via setTimeout, AbortSignal cancels both the timeout and the fetch

---

### Example 2: Dashboard with Safe Effects

```javascript
const dashboard = ReactiveUtils.state({
  metrics: new Map(),
  alerts: new Set()
});

// Track for DevTools
ReactiveUtils.DevTools.trackState(dashboard, 'Dashboard');

// Safe effect — won't crash if the DOM element is missing
ReactiveUtils.safeEffect(() => {
  const el = document.getElementById('metric-count');
  el.textContent = dashboard.metrics.size;
}, {
  errorBoundary: {
    onError: (err) => console.warn('Dashboard render failed:', err.message),
    fallback: () => { /* silently continue */ }
  }
});

// Reactive Map — effects trigger on mutations
dashboard.metrics.set('cpu', 45);
dashboard.metrics.set('memory', 72);

// Reactive Set — effects trigger on add/delete
dashboard.alerts.add('High CPU usage');
```

**Key patterns:** Reactive Map/Set, `safeEffect` for resilient UI, DevTools tracking

---

### Example 3: Data Table with Computed and Caching

```javascript
const table = ReactiveUtils.state({
  rows: [],
  sortBy: 'name',
  filterText: ''
});

// Computed properties — cached, only recalculate when dependencies change
table.$computed('filteredRows', function() {
  if (!this.filterText) return this.rows;
  const text = this.filterText.toLowerCase();
  return this.rows.filter(r =>
    Object.values(r).some(v => String(v).toLowerCase().includes(text))
  );
});

table.$computed('sortedRows', function() {
  const field = this.sortBy;
  return [...this.filteredRows].sort((a, b) =>
    String(a[field]).localeCompare(String(b[field]))
  );
});

table.$computed('rowCount', function() {
  return this.filteredRows.length;
});

// Multiple effects read sortedRows — computed only runs once per tick
ReactiveUtils.effect(() => {
  renderTable(table.sortedRows);
});

ReactiveUtils.effect(() => {
  document.getElementById('count').textContent =
    `${table.rowCount} of ${table.rows.length} rows`;
});
```

**Key patterns:** Chained computed properties (filteredRows → sortedRows), caching prevents redundant calculations

---

### Example 4: User Profile with Async State

```javascript
const profile = ReactiveUtils.asyncState(null, {
  onSuccess: (data) => console.log('Profile loaded:', data.name),
  onError: (error) => console.error('Failed to load profile')
});

// Load profile
async function loadProfile(userId) {
  await profile.$execute(async (signal) => {
    const response = await fetch(`/api/users/${userId}`, { signal });
    if (!response.ok) throw new Error('User not found');
    return response.json();
  });
}

// Reactive UI
ReactiveUtils.effect(() => {
  const el = document.getElementById('profile');

  if (profile.isIdle) {
    el.innerHTML = '<p>Select a user</p>';
  } else if (profile.loading) {
    el.innerHTML = '<p>Loading profile...</p>';
  } else if (profile.isError) {
    el.innerHTML = `<p>Error: ${profile.error.message}</p>
                    <button onclick="profile.$refetch()">Retry</button>`;
  } else if (profile.isSuccess) {
    el.innerHTML = `<h2>${profile.data.name}</h2>
                    <p>${profile.data.email}</p>`;
  }
});

// Load user 1, then quickly switch to user 2
loadProfile(1);
loadProfile(2);  // User 1 request is aborted, user 2 loads
```

**Key patterns:** `asyncState` with computed status properties, `$refetch` for retry, race condition prevention

---

## Part 3: Complete API Reference

### ReactiveEnhancements (Global)

| Property/Method | Description |
|-----------------|-------------|
| `.batch(fn)` | Enhanced batch function |
| `.queueUpdate(fn, priority)` | Queue a function at a specific priority |
| `.safeEffect(fn, opts)` | Effect with error boundary |
| `.safeWatch(state, key, fn, opts)` | Watcher with error boundary |
| `.asyncEffect(fn, opts)` | Async effect with AbortSignal |
| `.asyncState(initial, opts)` | Async state with race prevention |
| `.ErrorBoundary` | Error boundary class |
| `.DevTools` | Development tools |
| `.PRIORITY` | Priority constants: `{ COMPUTED: 1, WATCH: 2, EFFECT: 3 }` |

### Also Available on ReactiveUtils

| Method | Description |
|--------|-------------|
| `ReactiveUtils.safeEffect(fn, opts)` | Effect with error boundary |
| `ReactiveUtils.safeWatch(state, key, fn, opts)` | Watcher with error boundary |
| `ReactiveUtils.asyncEffect(fn, opts)` | Async effect with AbortSignal |
| `ReactiveUtils.asyncState(initial, opts)` | Async state |
| `ReactiveUtils.ErrorBoundary` | Error boundary class |
| `ReactiveUtils.DevTools` | Development tools |

### Transparent Patches

| What changed | Enhancement |
|-------------|-------------|
| `ReactiveUtils.state()` | Wraps Map/Set in reactive proxies |
| `state.$computed()` | Caching + circular dependency detection |

### asyncEffect(fn, options?)

| Parameter | Type | Description |
|-----------|------|-------------|
| `fn` | `async (signal) => {}` | Async function receiving AbortSignal |
| `options.onError` | Function | Called for non-abort errors |
| **Returns** | Function | Dispose function (stops effect + aborts) |

### asyncState(initialValue, options?)

| Parameter | Type | Description |
|-----------|------|-------------|
| `initialValue` | any | Initial data value |
| `options.onSuccess` | Function | Called on successful fetch |
| `options.onError` | Function | Called on failed fetch |

**State properties:**

| Property | Type | Description |
|----------|------|-------------|
| `.data` | any | Fetched data |
| `.loading` | Boolean | Request in progress |
| `.error` | Error/null | Last error |
| `.requestId` | Number | Current request counter |
| `.isSuccess` | Boolean (computed) | Data loaded, no error |
| `.isError` | Boolean (computed) | Has error, not loading |
| `.isIdle` | Boolean (computed) | No data, no error, not loading |

**Methods:**

| Method | Returns | Description |
|--------|---------|-------------|
| `.$execute(fn)` | Promise | Run async function with cancellation |
| `.$abort()` | — | Cancel current request |
| `.$reset()` | — | Reset to initial state (also aborts) |
| `.$refetch()` | Promise | Re-run the last function |

**$execute return values:**

| Result | Shape |
|--------|-------|
| Success | `{ success: true, data: ... }` |
| Validation failed (stale) | `{ success: false, stale: true }` |
| Aborted | `{ success: false, aborted: true }` |
| Error | `{ success: false, error: Error }` |

### safeEffect(fn, options?)

| Parameter | Type | Description |
|-----------|------|-------------|
| `fn` | Function | The effect function |
| `options.errorBoundary` | Object | ErrorBoundary options |
| **Returns** | Function | Dispose function |

### safeWatch(state, keyOrFn, callback, options?)

| Parameter | Type | Description |
|-----------|------|-------------|
| `state` | Reactive state | State to watch |
| `keyOrFn` | String/Function | Property key or getter |
| `callback` | Function | Called when value changes |
| `options.errorBoundary` | Object | ErrorBoundary options |
| **Returns** | Function | Dispose function |

### ErrorBoundary

```javascript
new ReactiveUtils.ErrorBoundary(options)
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onError` | Function | console.error | Error handler |
| `fallback` | Function | undefined | Fallback value provider |
| `retry` | Boolean | `true` | Whether to retry |
| `maxRetries` | Number | `3` | Max retry attempts |
| `retryDelay` | Number | `0` | Delay between retries (ms) |

**Methods:**

| Method | Description |
|--------|-------------|
| `.wrap(fn, context)` | Returns a wrapped function with error handling |

### DevTools

| Method | Description |
|--------|-------------|
| `.enable()` | Enable and expose on `window.__REACTIVE_DEVTOOLS__` |
| `.disable()` | Disable and remove from `window` |
| `.trackState(state, name)` | Register a state |
| `.trackEffect(effect, name)` | Register an effect |
| `.logChange(state, key, old, new)` | Record a change |
| `.getStates()` | Get all tracked states |
| `.getHistory()` | Get change history |
| `.clearHistory()` | Clear all history |

| Property | Default | Description |
|----------|---------|-------------|
| `.enabled` | `false` (auto on localhost) | Whether DevTools are active |
| `.maxHistory` | `50` | Max history entries |

---

## Load Order

```html
<!-- 1. Reactive Core (required) -->
<script src="04_reactive/01_dh-reactive.js"></script>

<!-- 2. Array Patch (recommended) -->
<script src="04_reactive/02_dh-reactive-array-patch.js"></script>

<!-- 3. Collections, Forms (optional) -->
<script src="04_reactive/03_dh-reactive-collections.js"></script>
<script src="04_reactive/04_dh-reactive-form.js"></script>

<!-- 4. Cleanup System (recommended, load before enhancements) -->
<script src="04_reactive/05_dh-reactive-cleanup.js"></script>

<!-- 5. Enhancements (load LAST) -->
<script src="04_reactive/06_dh-reactive-enhancements.js"></script>
```

**Order matters:** Enhancements patch `ReactiveUtils.state()` and `$computed`, so they must load after everything else.

---

## Congratulations!

You've completed the Reactive Enhancements learning path. You now understand:

- ✅ Priority-based batching with infinite loop detection
- ✅ Deep reactivity for Map and Set
- ✅ Smart computed caching with circular dependency detection
- ✅ Error boundaries with retry and fallback
- ✅ Async effects with AbortSignal cancellation
- ✅ Async state with race condition prevention
- ✅ DevTools for debugging reactive systems
- ✅ The complete API reference

**Your reactive system is production-ready!**