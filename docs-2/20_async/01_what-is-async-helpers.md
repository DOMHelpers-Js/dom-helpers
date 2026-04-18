[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# What Is the Async Helpers Module?

## Quick Start (30 seconds)

```javascript
// Debounce a search handler — wait until user stops typing
const searchDebounced = AsyncHelpers.debounce((e) => {
  fetchResults(e.target.value);
}, 400);

document.getElementById('searchInput').addEventListener('input', searchDebounced);

// Fetch with timeout and retry
const data = await AsyncHelpers.fetchJSON('/api/products', {
  timeout: 5000,
  retries: 2
});

// Pause execution
await AsyncHelpers.sleep(1000); // wait 1 second

// Wrap an async event handler with automatic loading state
button.addEventListener('click', AsyncHelpers.asyncHandler(async (e) => {
  await saveData();
}, { loadingClass: 'saving' }));
```

---

## What Is the Async Helpers Module?

`AsyncHelpers` is a collection of **async utility functions** that handle the most common asynchronous patterns in web development: rate-limiting function calls, safe fetch requests, concurrent operations, and event handling with loading states.

Think of it as your **async toolkit** — functions you'd otherwise have to write (and debug) yourself, now available as battle-tested, ready-to-use utilities.

---

## Why Does This Exist?

Common async tasks in web development have well-known solutions, but the implementations have subtle bugs that are easy to get wrong:

- **Debounce** — delay function calls, but `maxWait` is tricky to implement correctly
- **Throttle** — rate-limit calls, but leading/trailing edge logic is subtle
- **Fetch** — add timeout via AbortController, retry on failure, parse response by type
- **Parallel requests** — `Promise.all` fails fast by default; collecting all results requires `Promise.allSettled`

The Async Helpers module provides correct, configurable implementations of all these patterns so you don't have to reinvent them.

---

## Mental Model: The Async Coordinator

Think of `AsyncHelpers` as a **coordinator** in your app's async operations:

```
Without AsyncHelpers:
├── User types → 20 API calls fire in rapid succession
├── Network request hangs → user waits indefinitely
├── Fetch fails → no retry, error silently swallowed
└── Button clicked multiple times → multiple simultaneous operations

With AsyncHelpers:
├── User types → debounce waits 400ms → 1 API call fires
├── Network request hangs → timeout fires after 5s → AbortController cancels
├── Fetch fails → retries 2 times with 1s delays
└── Button click → asyncHandler manages loading state automatically
```

---

## What Does the Async Helpers Module Provide?

| Function | What it does |
|---|---|
| `debounce(func, delay, opts)` | Delay execution until calls stop |
| `throttle(func, delay, opts)` | Rate-limit to at most once per interval |
| `sanitize(input, opts)` | XSS-safe HTML/string cleaning |
| `sleep(ms)` | Promise-based delay |
| `enhancedFetch(url, opts)` | Fetch with timeout, retry, response type, hooks |
| `fetchJSON(url, opts)` | Shorthand: fetch → parse as JSON |
| `fetchText(url, opts)` | Shorthand: fetch → parse as text |
| `fetchBlob(url, opts)` | Shorthand: fetch → parse as Blob |
| `asyncHandler(fn, opts)` | Wrap async event listener with loading state |
| `parallelAll(promises, opts)` | Run promises concurrently, with progress |
| `raceWithTimeout(promises, ms)` | `Promise.race` with a built-in deadline |

---


### Accessing the API

All utilities live under `AsyncHelpers`:

```javascript
AsyncHelpers.debounce(fn, 300)
AsyncHelpers.fetchJSON('/api/data')
AsyncHelpers.sleep(1000)
```

If `Elements`, `Collections`, or `Selector` are loaded, the same utilities are also available on those namespaces:

```javascript
Elements.debounce(fn, 300)
Collections.fetchJSON('/api/data')
```

No bare globals (`window.debounce`, `window.throttle`) are written — everything is under `AsyncHelpers` to avoid naming conflicts.

---

## The Four Groups of Utilities

### Group 1: Rate Limiting (`debounce`, `throttle`)

Control how often a function is called in response to rapid events.

```javascript
// Search: wait until user stops typing for 400ms
const search = AsyncHelpers.debounce((query) => fetchResults(query), 400);

// Scroll handler: run at most once every 200ms
const onScroll = AsyncHelpers.throttle(() => updatePosition(), 200);
```

→ See [Debounce and Throttle](./02_debounce-and-throttle.md)

### Group 2: Fetch Utilities (`enhancedFetch`, `fetchJSON`, `fetchText`, `fetchBlob`)

Enhanced `fetch` with timeout, retry, response type control, and lifecycle hooks.

```javascript
const data = await AsyncHelpers.fetchJSON('/api/users', {
  timeout: 10000,
  retries: 3,
  onSuccess: (data) => console.log('Got:', data)
});
```

→ See [Enhanced Fetch](./03_enhanced-fetch.md)

### Group 3: Event Utilities (`asyncHandler`, `sleep`, `sanitize`)

Tools for async event handling and data safety.

```javascript
button.addEventListener('click', AsyncHelpers.asyncHandler(async (e) => {
  await saveData();
}));

await AsyncHelpers.sleep(500); // pause for 500ms

const safe = AsyncHelpers.sanitize(userInput); // XSS-safe
```

→ See [Async Handler, Sleep, and Sanitize](./04_async-handler-sleep-sanitize.md)

### Group 4: Concurrent Utilities (`parallelAll`, `raceWithTimeout`)

Tools for managing multiple promises at once.

```javascript
const results = await AsyncHelpers.parallelAll([
  fetchUser(), fetchOrders(), fetchPreferences()
], {
  failFast: false,
  onProgress: (done, total) => console.log(`${done}/${total} complete`)
});
```

→ See [Parallel Operations](./05_parallel-and-race.md)

---

## Form Integration

When the Form module is loaded alongside the Async module, every form accessed through `Forms` gets additional convenience methods:

```javascript
// Debounced input handler on a form field
Forms.searchForm.debounceInput('[name="q"]', (e) => {
  search(e.target.value);
}, 400);

// Throttled input handler
Forms.filterForm.throttleInput('[name="range"]', (e) => {
  updateFilter(e.target.value);
}, 200);

// Sanitize a single field in-place
Forms.commentForm.sanitizeField('content', { removeScripts: true });

// Sanitize all fields in the form
Forms.commentForm.sanitizeAll();
```

---

## Global Configuration

Configure module-wide defaults:

```javascript
AsyncHelpers.configure({
  debounceDelay: 400,    // default debounce delay
  throttleDelay: 200,    // default throttle delay
  fetchTimeout:  15000,  // default fetch timeout in ms
  fetchRetries:  1       // default number of retries
});
```

---

## Key Design Principles

1. **No bare globals** — everything is under `AsyncHelpers`; no risk of overwriting `window.debounce`
2. **Integration without monkey-patching** — attaches to `Elements`/`Collections`/`Selector` directly; no private method overrides
3. **Forms via public plugin hook** — uses `Forms.helper.addEnhancer()`, the same hook used by the form enhancement module
4. **Correct implementations** — common bugs like broken `maxWait` tracking and wrong `responseType` parsing are fixed
