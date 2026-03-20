# DOM Helpers — Async Module (`dh-async.js`)

> **Who is this for?**
> This guide is written for people who know basic JavaScript — functions, variables, and objects. A basic understanding of what an HTTP request is (fetching data from a server) will help for the fetch section, but is not strictly required.

---

## What does this module do?

Modern web pages need to do things asynchronously — search as the user types, load data from a server, handle image uploads, rate-limit expensive operations. All of this involves timing and waiting, which is where bugs easily hide.

This module gives you a collection of reliable, battle-tested utilities for handling that timing and those waiting patterns:

| Utility | What it solves |
|---|---|
| `debounce` | Stop a function firing too many times (e.g. every keystroke) |
| `throttle` | Limit how often a function can run (e.g. on every scroll event) |
| `sanitize` | Clean user input to prevent XSS security vulnerabilities |
| `sleep` | Pause execution for a set amount of time |
| `enhancedFetch` | HTTP requests with timeout, retry, and lifecycle callbacks |
| `fetchJSON` / `fetchText` / `fetchBlob` | Fetch shortcuts for common response types |
| `asyncHandler` | Wrap async event listeners with automatic loading states |
| `parallelAll` | Run multiple requests at the same time and track progress |
| `raceWithTimeout` | Run promises against a deadline |

> **What this module does NOT do:**
> Form validation and form messages are handled by `Form/01_dh-form.js` and `Form/02_dh-form-enhance.js`. This module focuses purely on async and timing utilities.

---

## Setup

### Load order

```html
<body>
  <!-- your page content -->

  <!-- 1. Core DOM Helpers (required) -->
  <script src="01_dh-core.js"></script>

  <!-- 2. This module -->
  <script src="Async/dh-async.js"></script>

  <!-- Optional: Form modules (load after Async if using both) -->
  <!-- <script src="Form/01_dh-form.js"></script> -->
  <!-- <script src="Form/02_dh-form-enhance.js"></script> -->

  <!-- 3. Your own script -->
  <script src="app.js"></script>
</body>
```

After loading, the `AsyncHelpers` global object is available everywhere in your JavaScript.

### Accessing the utilities

All utilities live in the `AsyncHelpers` namespace:

```js
AsyncHelpers.debounce(...)
AsyncHelpers.throttle(...)
AsyncHelpers.fetch(...)
// etc.
```

They are also available directly on `Elements`, `Collections`, and `Selector` if those are loaded:

```js
Elements.debounce(...)
Elements.fetch(...)
Collections.throttle(...)
```

> **Note:** No bare globals like `window.debounce` or `window.throttle` are created. Those are very common function names and overwriting them could silently break other scripts on your page. Always use `AsyncHelpers.debounce()`.

---

## Understanding `async` / `await`

Several utilities in this module are **async functions** — they return a Promise, meaning they run in the background while the rest of your code continues. You use `await` to pause and wait for the result.

```js
// You must be inside an async function to use await
async function loadUserData() {
  const data = await AsyncHelpers.fetchJSON('/api/user/42');
  console.log(data.name);
}
```

If you are writing code at the top level of a script tag (not inside a function), you can wrap it:

```js
(async function() {
  const data = await AsyncHelpers.fetchJSON('/api/data');
  console.log(data);
})();
```

> **A quick way to think about it:** `await` is like pressing pause on your function until the slow thing finishes. While your function is paused, the browser is free to do other things (handle clicks, animate, etc.).

---

## `debounce`

### The problem it solves

Imagine you have a search box. Every time the user types a letter, you want to search your server. But if the user types "hello", that's 5 requests fired almost simultaneously — wasteful and potentially confusing.

Debounce waits until the user **stops** typing for a specified amount of time, then fires just once.

```
User types: h  e  l  l  o
            ↓  ↓  ↓  ↓  ↓
Debounced:                 → fires ONCE (300ms after the last keystroke)
```

### Basic usage

```js
const { debounce } = AsyncHelpers;

// Create a debounced search function
const debouncedSearch = debounce(function(query) {
  console.log('Searching for:', query);
  // make your API call here
}, 300); // wait 300ms of silence before firing

// Attach it to an input
document.getElementById('searchBox').addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

### All options

```js
const debouncedFn = debounce(
  myFunction,       // the function to debounce
  500,              // delay in ms — wait this long after the LAST call (default: 300)
  {
    immediate: false, // if true, fire on the FIRST call instead of the last (default: false)
    maxWait: 2000     // maximum ms to wait — forces execution even if calls keep coming (default: none)
  }
);
```

#### `immediate: true` — fire on the first call

Instead of waiting for the user to stop, fire immediately on the first call and then ignore subsequent calls until the quiet period ends.

```js
// Good for: button clicks where you want instant feedback but prevent double-clicks
const debouncedSave = debounce(saveDocument, 1000, { immediate: true });

button.addEventListener('click', debouncedSave);
// First click → fires immediately
// More clicks within 1 second → ignored
// Click after 1 second → fires again immediately
```

#### `maxWait` — guarantee a maximum delay

Without `maxWait`, if the user never stops typing, the function never fires. `maxWait` sets a ceiling — no matter how many calls come in, the function will fire at least once every `maxWait` milliseconds.

```js
// Fire at most every 2 seconds even if the user keeps typing
const debouncedAutoSave = debounce(saveToServer, 500, { maxWait: 2000 });
```

### `.cancel()` — discard a pending call

If you want to prevent the debounced function from firing, call `.cancel()`:

```js
const debouncedSearch = debounce(search, 300);

// ... user types something, debouncedSearch is scheduled ...

// User navigated away — cancel the pending search
debouncedSearch.cancel();
```

### `.flush()` — fire immediately right now

Forces the pending call to execute right now, then cancels. Useful when the user submits a form and you want to ensure any pending debounced validation runs immediately:

```js
const debouncedValidate = debounce(validate, 300);

submitButton.addEventListener('click', () => {
  debouncedValidate.flush(); // run validation NOW before submitting
  submitForm();
});
```

---

## `throttle`

### The problem it solves

Throttle is similar to debounce but works differently. Instead of waiting for silence, throttle ensures the function runs **at most once per time period**, no matter how many times it is called.

```
Scroll events: ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ (30 times per second)
Throttled:     ↓         ↓         ↓  (at most once every 200ms)
```

Use `debounce` when you want to wait for activity to stop. Use `throttle` when you want regular updates but not every single one.

### Basic usage

```js
const { throttle } = AsyncHelpers;

// Update a scroll progress bar, but at most 5 times per second
const throttledUpdateProgress = throttle(function() {
  const scrolled = window.scrollY / document.body.scrollHeight;
  Elements.progressBar.update({ style: { width: `${scrolled * 100}%` } });
}, 200); // at most once every 200ms

window.addEventListener('scroll', throttledUpdateProgress);
```

### All options

```js
const throttledFn = throttle(
  myFunction,    // the function to throttle
  200,           // minimum ms between executions (default: 200)
  {
    leading:  true, // fire on the FIRST call of a burst (default: true)
    trailing: true  // fire one more time after the LAST call of a burst (default: true)
  }
);
```

#### Understanding `leading` and `trailing`

These control what happens at the edges of a burst of calls.

| `leading` | `trailing` | Behaviour |
|---|---|---|
| `true` | `true` | Fire immediately, then once more after the burst ends *(default)* |
| `true` | `false` | Fire immediately, ignore everything until the period resets |
| `false` | `true` | Wait until the end of the first period, then fire |
| `false` | `false` | Never fires (not useful — avoid) |

```js
// For a resize handler — only care about the final size, not intermediate ones
const throttledResize = throttle(recalculateLayout, 100, {
  leading:  false, // don't fire immediately on first resize event
  trailing: true   // fire once after resizing stops
});

window.addEventListener('resize', throttledResize);
```

### `.cancel()` — cancel any pending trailing call

```js
const throttledFn = throttle(myFunction, 200);

// Cancel a trailing call that hasn't fired yet
throttledFn.cancel();
```

### Debounce vs Throttle — quick comparison

| Scenario | Use |
|---|---|
| Search box — wait until user stops typing | `debounce` |
| Auto-save — wait until user stops making changes | `debounce` |
| Scroll events — update regularly but not every pixel | `throttle` |
| Mouse move tracking — regular updates, not every movement | `throttle` |
| Window resize — recalculate layout periodically | `throttle` |
| Button click — prevent double-click | `debounce` with `immediate: true` |

---

## `sanitize`

### The problem it solves

When you display user-provided text on a page, a malicious user could inject HTML or JavaScript that runs in other users' browsers. This is called **Cross-Site Scripting (XSS)**. `sanitize` cleans strings to prevent this.

```js
// A user types this into a comment box:
const userInput = '<script>stealCookies()</script> Hello!';

// Without sanitization — dangerous if injected into the DOM:
element.innerHTML = userInput; // 💥 runs the script

// With sanitization — safe:
element.innerHTML = sanitize(userInput);
// Output: "&lt;script&gt;stealCookies()&lt;/script&gt; Hello!"
// The script tag is displayed as text, not executed
```

### Basic usage

```js
const { sanitize } = AsyncHelpers;

// Sanitize user input before displaying it
const userComment = sanitize(inputElement.value);
commentElement.textContent = userComment; // or innerHTML if you need to render some tags
```

### Options

```js
const cleaned = sanitize(userInput, {
  // Specific HTML tags you want to KEEP (everything else is stripped)
  // If empty (default), ALL HTML tags are encoded
  allowedTags: ['b', 'i', 'em', 'strong', 'a'],

  // Remove <script> tags and javascript: URLs (default: true — keep this on)
  removeScripts: true,

  // Remove inline event handlers like onclick="..." (default: true — keep this on)
  removeEvents: true,

  // Remove style="..." attributes (default: false)
  removeStyles: false
});
```

### When to use `allowedTags`

If you want users to be able to use **some** formatting (bold, italic) but not arbitrary HTML:

```js
// Allow basic formatting but nothing dangerous
const formatted = sanitize(userInput, {
  allowedTags: ['b', 'i', 'em', 'strong', 'br'],
  removeScripts: true,
  removeEvents:  true
});
```

> **Security tip:** Always sanitize on the server side as well. Client-side sanitization is a good defence-in-depth measure but should never be your only protection.

### Non-string values pass through unchanged

```js
sanitize(42)       // → 42       (number returned as-is)
sanitize(null)     // → null
sanitize(undefined)// → undefined
sanitize([1,2,3])  // → [1,2,3]  (array returned as-is)
```

---

## `sleep`

A simple utility that pauses execution for a given number of milliseconds. Must be used with `await`.

```js
const { sleep } = AsyncHelpers;

async function processItems(items) {
  for (const item of items) {
    await processOne(item);
    await sleep(500); // wait half a second between each item
  }
}
```

### Common use cases

```js
// Debounce without creating a dedicated function
async function handleInput() {
  await sleep(300);
  doSearch();
}

// Delay showing a loading spinner (avoids flash for fast responses)
async function loadData() {
  let showSpinner = true;

  sleep(200).then(() => {
    if (showSpinner) spinner.style.display = 'block';
  });

  const data = await AsyncHelpers.fetchJSON('/api/data');
  showSpinner = false;
  spinner.style.display = 'none';
  renderData(data);
}

// Add artificial delay in development/testing
async function mockApiCall() {
  await sleep(1000); // simulate network latency
  return { name: 'Alice' };
}
```

---

## Fetch Utilities

### The problem with plain `fetch`

The browser's built-in `fetch` is powerful but low-level. You have to manually:
- Handle non-ok HTTP responses (fetch does not throw on 404, 500, etc.)
- Set up timeouts (fetch has no built-in timeout)
- Write retry logic
- Parse the response body (`await response.json()`)
- Show and hide loading indicators

`AsyncHelpers.fetch` (and its shorthands) handles all of that for you.

---

### `AsyncHelpers.fetch` — enhanced fetch

The main fetch utility. All response-type shorthands (`fetchJSON`, `fetchText`, `fetchBlob`) are built on top of this.

```js
const data = await AsyncHelpers.fetch('/api/users', {
  method: 'GET'
});
```

### Full options reference

```js
const result = await AsyncHelpers.fetch('/api/endpoint', {

  // ── Request ──────────────────────────────────────────────────────────────
  method:  'POST',          // HTTP method (default: 'GET')
  headers: {                // Additional headers (Content-Type: application/json is always set)
    'Authorization': 'Bearer my-token'
  },
  body: { name: 'Alice' },  // Request body — objects are automatically JSON-stringified

  // ── Response type ─────────────────────────────────────────────────────────
  // How to parse the response body (default: 'json')
  // 'json'        → response.json()         ← default, for API calls
  // 'text'        → response.text()         ← for HTML or plain text
  // 'blob'        → response.blob()         ← for images, files, binary data
  // 'arrayBuffer' → response.arrayBuffer()  ← for binary processing
  // 'raw'         → the Response object itself (no parsing)
  responseType: 'json',

  // ── Timeout ───────────────────────────────────────────────────────────────
  timeout: 10000,     // Cancel the request after 10 seconds (default: 10000ms, 0 = no timeout)

  // ── Retry ─────────────────────────────────────────────────────────────────
  retries:            2,     // Retry this many times after failure (default: 0)
  retryDelay:      1000,     // Wait 1 second between retries (default: 1000ms)
  exponentialBackoff: false, // true = multiply retryDelay by attempt number (1x, 2x, 3x...)

  // ── Loading indicator ─────────────────────────────────────────────────────
  // An element to show during the request and hide after
  // Works with plain DOM elements OR DOM Helpers enhanced elements
  loadingIndicator: Elements.spinner,

  // ── External abort signal ─────────────────────────────────────────────────
  // Link this request to an AbortController you control
  signal: myAbortController.signal,

  // ── Lifecycle callbacks ───────────────────────────────────────────────────
  onStart() {
    // Called just before the request is sent
    console.log('Request starting...');
  },

  onSuccess(data, response) {
    // Called when the request succeeds
    // data     = parsed response body
    // response = the raw Response object
    console.log('Got data:', data);
  },

  onError(error) {
    // Called when the request fails (after all retries)
    console.log('Request failed:', error.message);
  },

  onFinally() {
    // Called after success OR error — always runs
    console.log('Request complete');
  }
});
```

### What counts as "success" vs "failure"

The fetch throws (and triggers `onError`) in these situations:
- The server responds with a non-2xx status code (400, 404, 500, etc.)
- The request times out
- There is a network error (no connection, DNS failure, etc.)
- All retries are exhausted

It resolves successfully only on 2xx responses.

### Examples

#### Simple GET request

```js
const users = await AsyncHelpers.fetchJSON('/api/users');
console.log(users); // parsed JSON array/object
```

#### POST request with a body

```js
const newUser = await AsyncHelpers.fetch('/api/users', {
  method: 'POST',
  body:   { name: 'Alice', email: 'alice@example.com' }
});
```

#### With authentication header

```js
const profile = await AsyncHelpers.fetch('/api/me', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
});
```

#### With retry and a loading indicator

```js
const data = await AsyncHelpers.fetch('/api/flaky-endpoint', {
  retries:            3,
  retryDelay:      2000,
  exponentialBackoff: true,  // waits 2s, then 4s, then 6s between retries
  loadingIndicator: Elements.spinner,
  onError(err) {
    Elements.errorMsg.update({ textContent: 'Could not load data. Please try again.' });
  }
});
```

#### Cancellable request

```js
const controller = new AbortController();

// Start the request
const promise = AsyncHelpers.fetch('/api/long-operation', {
  signal: controller.signal,
  timeout: 0 // no timeout — we control it manually
});

// Cancel it if the user clicks a button
cancelButton.addEventListener('click', () => controller.abort());

try {
  const result = await promise;
} catch (err) {
  if (err.name === 'AbortError') {
    console.log('Request was cancelled');
  }
}
```

---

### `fetchJSON` — shorthand for JSON responses

Exactly the same as `AsyncHelpers.fetch` with `responseType: 'json'`. This is the default and most common use case.

```js
const users = await AsyncHelpers.fetchJSON('/api/users');
const user  = await AsyncHelpers.fetchJSON('/api/users/42', {
  retries: 2
});
```

---

### `fetchText` — shorthand for text responses

Use when the server returns HTML, CSV, plain text, or any non-JSON string.

```js
// Load an HTML template from the server
const html = await AsyncHelpers.fetchText('/templates/card.html');
container.innerHTML = html;

// Load a CSV file
const csv = await AsyncHelpers.fetchText('/data/report.csv');
parseCSV(csv);
```

---

### `fetchBlob` — shorthand for binary responses

Use for images, PDFs, audio files, zip files, or any binary data.

```js
// Load an image and display it without making a separate HTTP request
const blob     = await AsyncHelpers.fetchBlob('/api/avatar/42');
const imageUrl = URL.createObjectURL(blob);
Elements.avatar.update({ src: imageUrl });

// Prompt the user to download a file
const fileBlob = await AsyncHelpers.fetchBlob('/api/export/report.pdf');
const link     = document.createElement('a');
link.href      = URL.createObjectURL(fileBlob);
link.download  = 'report.pdf';
link.click();
```

---

## `asyncHandler`

### The problem it solves

When you add an `async` function as an event listener, errors inside it are silently swallowed by the browser. You also have no easy way to show a loading state while the async work runs.

```js
// ❌ Errors swallowed silently, no loading state
button.addEventListener('click', async () => {
  const data = await fetchSomething(); // if this throws, nothing happens
});
```

`asyncHandler` wraps your async listener so:
- Errors are caught and logged properly
- A `loading` CSS class is automatically added to the element while running and removed when done
- An optional `errorHandler` callback fires on failure

```js
// ✅ Proper error handling and loading state
button.addEventListener('click', AsyncHelpers.asyncHandler(async (e) => {
  const data = await fetchSomething();
  updateUI(data);
}));
```

### How the loading state works

While the async function is running, `asyncHandler` adds a CSS class and a data attribute to the element that triggered the event (`e.currentTarget`):

```
Before:  <button>Save</button>
During:  <button class="loading" data-loading="true">Save</button>
After:   <button>Save</button>
```

You style the `loading` class yourself:

```css
button.loading {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}
```

### Full options

```js
button.addEventListener('click', AsyncHelpers.asyncHandler(
  async (event) => {
    const data = await fetchData();
    updateUI(data);
  },
  {
    loadingClass:     'loading',      // CSS class while running (default: 'loading')
    loadingAttribute: 'data-loading', // data attribute while running (default: 'data-loading')
    errorHandler(error, event) {      // called if the async function throws
      alert('Something went wrong: ' + error.message);
    }
  }
));
```

### Without an error handler — errors are re-thrown

If no `errorHandler` is provided, the error is still logged to the console and re-thrown. This means you can also catch it with a `try/catch` around the outer call if needed.

### Examples

#### Save button with loading state

```js
const { asyncHandler } = AsyncHelpers;

Elements.saveBtn.addEventListener('click', asyncHandler(async (e) => {
  const response = await AsyncHelpers.fetch('/api/save', {
    method: 'POST',
    body:   Forms.editForm.values
  });
  Elements.status.update({ textContent: 'Saved!' });
}, {
  errorHandler(err) {
    Elements.status.update({ textContent: 'Save failed: ' + err.message });
  }
}));
```

#### Multiple buttons with shared handler

```js
const handleDelete = asyncHandler(async (e) => {
  const id = e.currentTarget.dataset.id;
  await AsyncHelpers.fetch(`/api/items/${id}`, { method: 'DELETE' });
  e.currentTarget.closest('.item-card').remove();
});

document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', handleDelete);
});
```

---

## `parallelAll`

### The problem it solves

Sometimes you need to load multiple pieces of data at the same time and do something when they all arrive. Running requests one after another is slow:

```js
// ❌ Sequential — takes 3 seconds total if each takes 1 second
const users    = await fetch('/api/users');
const products = await fetch('/api/products');
const orders   = await fetch('/api/orders');
```

`parallelAll` runs them all at the same time:

```js
// ✅ Parallel — takes ~1 second total
const [users, products, orders] = await AsyncHelpers.parallelAll([
  AsyncHelpers.fetchJSON('/api/users'),
  AsyncHelpers.fetchJSON('/api/products'),
  AsyncHelpers.fetchJSON('/api/orders')
]);
```

### `failFast` option

By default (`failFast: true`), if any single request fails, the whole thing rejects immediately — just like `Promise.all`.

Set `failFast: false` if you want to collect all results whether they succeed or fail — just like `Promise.allSettled`. This is useful when you want partial data and can handle individual failures gracefully.

```js
// failFast: true (default) — reject immediately on first failure
try {
  const [users, orders] = await AsyncHelpers.parallelAll([
    AsyncHelpers.fetchJSON('/api/users'),
    AsyncHelpers.fetchJSON('/api/orders')
  ]);
} catch (err) {
  // One of them failed
  console.log('A request failed:', err.message);
}

// failFast: false — collect everything, never throws
const results = await AsyncHelpers.parallelAll([
  AsyncHelpers.fetchJSON('/api/users'),
  AsyncHelpers.fetchJSON('/api/orders')
], { failFast: false });

results.forEach(result => {
  if (result.status === 'fulfilled') {
    console.log('Got data:', result.value);
  } else {
    console.log('This one failed:', result.reason.message);
  }
});
```

### Progress tracking with `onProgress`

When you have many requests, you can show the user how many have completed:

```js
const imageUrls = ['/img/1.jpg', '/img/2.jpg', '/img/3.jpg', '/img/4.jpg'];

const blobs = await AsyncHelpers.parallelAll(
  imageUrls.map(url => AsyncHelpers.fetchBlob(url)),
  {
    failFast: false,
    onProgress(completed, total, result) {
      const percent = Math.round((completed / total) * 100);
      Elements.progressBar.update({ style: { width: `${percent}%` } });
      Elements.progressText.update({ textContent: `${completed} of ${total} loaded` });
    }
  }
);
```

### Full options

```js
const results = await AsyncHelpers.parallelAll(
  arrayOfPromises,
  {
    failFast:   true,        // true = stop on first failure, false = collect all (default: true)
    onProgress: (completed, total, result) => void  // called as each promise settles
  }
);
```

---

## `raceWithTimeout`

### The problem it solves

`Promise.race` returns as soon as the first promise resolves or rejects — but if none of them ever settle, you wait forever. `raceWithTimeout` adds a guaranteed deadline.

```js
const { raceWithTimeout } = AsyncHelpers;

// Whichever service responds first wins — but give up after 3 seconds
try {
  const result = await raceWithTimeout([
    AsyncHelpers.fetchJSON('/api/primary-server/data'),
    AsyncHelpers.fetchJSON('/api/backup-server/data')
  ], 3000);

  console.log('Got a response:', result);
} catch (err) {
  console.log('Both servers timed out or failed:', err.message);
}
```

### Parameters

```js
await raceWithTimeout(
  promises,    // Array of Promises
  timeout      // ms deadline (default: 5000)
);
```

### Use cases

```js
// Try cache first, fall back to network — accept whichever is first
const data = await raceWithTimeout([
  getFromCache(key),
  AsyncHelpers.fetchJSON('/api/data')
], 2000);

// Feature detection — does this browser support something in time?
const supported = await raceWithTimeout([
  navigator.permissions.query({ name: 'camera' }),
  new Promise(resolve => setTimeout(() => resolve({ state: 'unknown' }), 1000))
]);
```

---

## Form-specific helpers (when Form module is also loaded)

If `Form/01_dh-form.js` is loaded alongside this module, every form accessed through `Forms` automatically gains three additional methods:

### `form.debounceInput(selector, handler, delay, options)`

Attaches a debounced `input` event listener to all fields inside the form that match the CSS selector. Perfect for live search or auto-validation while the user types.

```js
// Search as user types, but wait 400ms of silence first
Forms.searchForm.debounceInput('[name="q"]', (e) => {
  performSearch(e.target.value);
}, 400);

// Returns { cancel, flush } for cleanup
const { cancel } = Forms.searchForm.debounceInput('[name="tags"]', handleTagInput);

// Cancel when done
cancel();
```

### `form.throttleInput(selector, handler, delay, options)`

Attaches a throttled `input` event listener — fires at most once per `delay` ms even if the user types continuously.

```js
// Show a character counter that updates at most 5 times per second
Forms.longTextForm.throttleInput('textarea', (e) => {
  Elements.charCount.update({
    textContent: `${e.target.value.length} / 500 characters`
  });
}, 200);
```

### `form.sanitizeField(fieldName, options)` / `form.sanitizeAll(options)`

Sanitize field values in-place — cleans the field's content directly. Useful to run before submission.

```js
// Sanitize one field
Forms.commentForm.sanitizeField('comment');

// Sanitize a specific field with options
Forms.profileForm.sanitizeField('bio', {
  allowedTags: ['b', 'i', 'em'],
  removeScripts: true
});

// Sanitize every text field in the form
Forms.contactForm.sanitizeAll();

// Chain it — sanitize then submit
Forms.contactForm
  .sanitizeAll()
  .submitData({ url: '/api/contact' });
```

---

## `AsyncHelpers.configure()`

Sets default values used across the module. Call this once at the start of your application.

```js
AsyncHelpers.configure({
  debounceDelay: 400,    // default delay for debounce() (default: 300ms)
  throttleDelay: 250,    // default delay for throttle() (default: 200ms)
  fetchTimeout:  15000,  // default timeout for fetch (default: 10000ms)
  fetchRetries:  2       // default retries for fetch (default: 0)
});
```

> **Note:** `configure()` stores defaults in `AsyncHelpers.defaults` for reference. However, the utility functions (`debounce`, `throttle`, `fetch`) still require you to pass values explicitly — the defaults are informational. Future versions may auto-apply them.

---

## Complete Working Examples

### Example 1 — Live search with debounce

```html
<input type="text" id="searchInput" placeholder="Search users..." />
<div id="results"></div>
```

```js
const debouncedSearch = AsyncHelpers.debounce(async (query) => {
  if (!query.trim()) {
    Elements.results.update({ innerHTML: '' });
    return;
  }

  try {
    const users = await AsyncHelpers.fetchJSON(`/api/users?q=${encodeURIComponent(query)}`, {
      timeout: 5000
    });

    const html = users.map(u => `<div class="result">${u.name}</div>`).join('');
    Elements.results.update({ innerHTML: html });
  } catch (err) {
    Elements.results.update({ textContent: 'Search failed. Please try again.' });
  }
}, 350);

document.getElementById('searchInput').addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

---

### Example 2 — Scroll progress bar with throttle

```html
<div id="progressBar" style="position:fixed;top:0;left:0;height:3px;background:#0066ff;width:0;"></div>
```

```js
const updateProgress = AsyncHelpers.throttle(() => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const percent   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  Elements.progressBar.update({
    style: { width: `${percent.toFixed(1)}%` }
  });
}, 16); // ~60fps

window.addEventListener('scroll', updateProgress, { passive: true });
```

---

### Example 3 — Dashboard that loads multiple data sources in parallel

```html
<div id="userCount">-</div>
<div id="orderCount">-</div>
<div id="revenue">-</div>
<div id="loadingProgress">Loading...</div>
```

```js
async function loadDashboard() {
  let loaded = 0;

  const [usersResult, ordersResult, revenueResult] = await AsyncHelpers.parallelAll([
    AsyncHelpers.fetchJSON('/api/stats/users'),
    AsyncHelpers.fetchJSON('/api/stats/orders'),
    AsyncHelpers.fetchJSON('/api/stats/revenue')
  ], {
    failFast: false,
    onProgress(completed, total) {
      Elements.loadingProgress.update({
        textContent: `Loading ${completed} of ${total}...`
      });
    }
  });

  Elements.loadingProgress.update({ style: { display: 'none' } });

  if (usersResult.status  === 'fulfilled') Elements.userCount.update({ textContent: usersResult.value.count });
  if (ordersResult.status === 'fulfilled') Elements.orderCount.update({ textContent: ordersResult.value.count });
  if (revenueResult.status=== 'fulfilled') Elements.revenue.update({ textContent: `$${revenueResult.value.total}` });
}

loadDashboard();
```

---

### Example 4 — Async button with full loading state

```html
<button id="deleteBtn" data-id="42">Delete Item</button>
<p id="statusMsg"></p>
```

```css
#deleteBtn.loading {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

```js
const { asyncHandler } = AsyncHelpers;

Elements.deleteBtn.addEventListener('click', asyncHandler(async (e) => {
  const id = e.currentTarget.dataset.id;

  const confirmed = confirm(`Delete item #${id}?`);
  if (!confirmed) return;

  await AsyncHelpers.fetch(`/api/items/${id}`, { method: 'DELETE' });

  Elements.statusMsg.update({ textContent: 'Item deleted successfully.' });
  e.currentTarget.remove();

}, {
  errorHandler(err) {
    Elements.statusMsg.update({ textContent: `Delete failed: ${err.message}` });
  }
}));
```

---

### Example 5 — Input sanitization before submission

```js
document.getElementById('commentForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Sanitize all text fields before reading values
  Forms.commentForm.sanitizeAll();

  const values = Forms.commentForm.values;

  const result = await AsyncHelpers.fetch('/api/comments', {
    method: 'POST',
    body:   values
  });

  if (result.id) {
    appendComment(result);
    Forms.commentForm.reset();
  }
});
```

---

### Example 6 — Race multiple servers for fastest response

```js
async function loadWithFallback(primaryUrl, backupUrl) {
  try {
    const data = await AsyncHelpers.raceWithTimeout([
      AsyncHelpers.fetchJSON(primaryUrl,  { timeout: 0 }),
      AsyncHelpers.fetchJSON(backupUrl,   { timeout: 0 })
    ], 8000); // give up entirely after 8 seconds

    return data;
  } catch (err) {
    console.error('All servers failed or timed out');
    return null;
  }
}

const data = await loadWithFallback('/api/primary/config', '/api/backup/config');
```

---

## API Quick Reference

### `AsyncHelpers` namespace

| Method | Signature | Returns |
|---|---|---|
| `debounce` | `(fn, delay?, options?)` | Debounced function |
| `throttle` | `(fn, delay?, options?)` | Throttled function |
| `sanitize` | `(input, options?)` | Cleaned string |
| `sleep` | `(ms)` | `Promise<void>` |
| `fetch` | `(url, options?)` | `Promise<any>` |
| `fetchJSON` | `(url, options?)` | `Promise<object>` |
| `fetchText` | `(url, options?)` | `Promise<string>` |
| `fetchBlob` | `(url, options?)` | `Promise<Blob>` |
| `asyncHandler` | `(fn, options?)` | Wrapped listener |
| `parallelAll` | `(promises[], options?)` | `Promise<array>` |
| `raceWithTimeout` | `(promises[], timeout?)` | `Promise<any>` |
| `configure` | `(options)` | `AsyncHelpers` |

### Debounced function methods

| Method | Description |
|---|---|
| `.cancel()` | Discard pending call without executing |
| `.flush(...args)` | Execute immediately and cancel |

### Throttled function methods

| Method | Description |
|---|---|
| `.cancel()` | Cancel any pending trailing call |

### Form-specific methods (requires `Form/01_dh-form.js`)

| Method | Signature | Description |
|---|---|---|
| `form.debounceInput` | `(selector, fn, delay?, opts?)` | Debounced input listener on matched fields |
| `form.throttleInput` | `(selector, fn, delay?, opts?)` | Throttled input listener on matched fields |
| `form.sanitizeField` | `(fieldName, opts?)` | Sanitize a single field in-place |
| `form.sanitizeAll` | `(opts?)` | Sanitize all text fields in-place |

---

## Frequently Asked Questions

**Q: Why use `AsyncHelpers.fetch` instead of plain `fetch`?**

Plain `fetch` does not throw on HTTP errors (404, 500 etc.) — you have to check `response.ok` yourself. It also has no built-in timeout, no retry, and no response body parsing shortcut. `AsyncHelpers.fetch` handles all of that and integrates loading indicators from the rest of the library.

**Q: Can I use `debounce` with async functions?**

Yes. The debounced function will call your async function and return its return value. However, because of how debouncing works (the function is called after a timer), the return value is hard to use. For async debounced functions, use the `onSuccess`/`onError` pattern inside the function itself rather than trying to `await` the debounced wrapper.

**Q: What is the difference between `parallelAll` with `failFast: false` and `Promise.allSettled`?**

They have the same behaviour when you don't pass `onProgress`. With `onProgress`, `parallelAll` gives you incremental callbacks as each promise settles, which `Promise.allSettled` does not do natively.

**Q: Does `sanitize` protect against all XSS attacks?**

`sanitize` handles the most common XSS vectors (script tags, event handlers, `javascript:` URLs). For a high-security application, use a dedicated library like DOMPurify on top. Never rely on client-side sanitization alone — always sanitize on the server too.

**Q: My `debounce` fires at the wrong time. What do I check?**

Check whether you need `immediate: true` (fire on first call) versus the default trailing behaviour (fire after the last call). Also verify your delay value — 300ms feels fast but is actually quite short for slow typists.

**Q: Can I cancel a fetch request?**

Yes — use the `signal` option with an `AbortController`:

```js
const controller = new AbortController();
AsyncHelpers.fetch('/api/data', { signal: controller.signal });
controller.abort(); // cancel it
```