[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Enhanced Fetch

## Quick Start (30 seconds)

```javascript
// Simple JSON fetch with timeout
const data = await AsyncHelpers.fetchJSON('/api/users');

// With timeout and retry
const data = await AsyncHelpers.fetchJSON('/api/products', {
  timeout: 8000,
  retries: 2,
  retryDelay: 1000
});

// Fetch with lifecycle hooks
const users = await AsyncHelpers.fetchJSON('/api/users', {
  onStart:   () => showSpinner(),
  onSuccess: (data) => console.log('Got', data.length, 'users'),
  onError:   (err) => showError(err.message),
  onFinally: () => hideSpinner()
});

// Fetch text (HTML, CSV, plain text)
const html = await AsyncHelpers.fetchText('/api/template');

// Fetch binary (images, files)
const blob = await AsyncHelpers.fetchBlob('/api/export.pdf');
```

---

## What Is `enhancedFetch`?

`enhancedFetch` is a wrapper around the browser's native `fetch` API that adds:

- **Timeout** — automatically cancels the request if it takes too long (via `AbortController`)
- **Retry** — automatically retries failed requests with configurable delay
- **Response type** — parse the response as JSON, text, blob, ArrayBuffer, or get the raw `Response`
- **Loading indicator** — show/hide a DOM element automatically
- **Lifecycle hooks** — callbacks for `onStart`, `onSuccess`, `onError`, `onFinally`

---

## Why Does This Exist?

### Fetch with Timeout in Plain JavaScript

```javascript
const controller = new AbortController();
const timeoutId  = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch('/api/data', { signal: controller.signal });
  clearTimeout(timeoutId);

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();

  return data;
} catch (error) {
  if (error.name === 'AbortError') console.error('Request timed out');
  else console.error('Fetch failed:', error);
}
```

**Problems:**
❌ AbortController boilerplate every single time
❌ Timeout management is easy to get wrong
❌ No built-in retry
❌ No hooks for loading states
❌ Must remember to clear the timeout on success

### The Same Request with `enhancedFetch`

```javascript
const data = await AsyncHelpers.fetchJSON('/api/data', {
  timeout:   5000,
  onError:   (err) => console.error('Failed:', err.message)
});
```

✅ Timeout handled internally
✅ AbortController managed for you
✅ Timeout cleared automatically on success

---

## `enhancedFetch` — Full Options Reference

```javascript
const data = await AsyncHelpers.enhancedFetch(url, {
  // Request
  method:    'GET',               // HTTP method (default: 'GET')
  headers:   {},                  // additional headers
  body:      null,                // request body; objects are auto-JSON-stringified

  // Reliability
  timeout:   10000,               // ms before aborting (0 = no timeout)
  retries:   0,                   // number of retries after first failure
  retryDelay: 1000,               // ms between retries
  exponentialBackoff: false,      // multiply retryDelay by attempt number

  // Response parsing
  responseType: 'json',           // 'json' | 'text' | 'blob' | 'arrayBuffer' | 'raw'

  // Loading indicator (optional)
  loadingIndicator: spinnerElement, // show() on start, hide() on finish

  // Lifecycle hooks
  onStart:   () => {},            // called before the request starts
  onSuccess: (data, response) => {}, // called with parsed data on success
  onError:   (error) => {},       // called on failure
  onFinally: () => {},            // called after success OR failure

  // External abort signal (for cancellation from outside)
  signal: abortController.signal,
});
```

---

## Response Types

Use `responseType` to control how the response body is parsed:

```javascript
// JSON (default) — returns parsed JavaScript object/array
const user = await AsyncHelpers.enhancedFetch('/api/user', { responseType: 'json' });

// Text — returns a plain string
const html  = await AsyncHelpers.enhancedFetch('/templates/card.html', { responseType: 'text' });
const csv   = await AsyncHelpers.enhancedFetch('/export.csv',          { responseType: 'text' });

// Blob — returns a Blob object (images, PDFs, binary files)
const blob = await AsyncHelpers.enhancedFetch('/avatar.png', { responseType: 'blob' });
const url  = URL.createObjectURL(blob);
img.src = url;

// ArrayBuffer — returns raw binary data
const buffer = await AsyncHelpers.enhancedFetch('/audio.mp3', { responseType: 'arrayBuffer' });

// Raw — returns the Response object without parsing the body
const response = await AsyncHelpers.enhancedFetch('/api/stream', { responseType: 'raw' });
// response.body is a ReadableStream
```

---

## Shorthand Functions

Three convenience wrappers that force a specific `responseType`:

```javascript
// Always parses as JSON
const data = await AsyncHelpers.fetchJSON('/api/data');

// Always parses as text
const text = await AsyncHelpers.fetchText('/docs/intro.md');

// Always parses as Blob
const blob = await AsyncHelpers.fetchBlob('/image.jpg');
```

All accept the same options as `enhancedFetch` (except `responseType` which is set for you).

---

## Retry Configuration

### Fixed Delay (Default)

```javascript
const data = await AsyncHelpers.fetchJSON('/api/data', {
  retries:    3,       // try up to 3 more times after the first failure
  retryDelay: 1000,    // wait 1000ms between each attempt
});

// Attempt timeline:
// Attempt 1: 0ms   — fails
// Attempt 2: 1000ms — fails
// Attempt 3: 2000ms — fails
// Attempt 4: 3000ms — either succeeds or throws the last error
```

### Exponential Backoff

```javascript
const data = await AsyncHelpers.fetchJSON('/api/data', {
  retries:            3,
  retryDelay:         1000,
  exponentialBackoff: true  // retryDelay * attempt number
});

// Attempt timeline:
// Attempt 1: 0ms   — fails
// Attempt 2: 1000ms (1000 × 1) — fails
// Attempt 3: 2000ms (1000 × 2) — fails
// Attempt 4: 3000ms (1000 × 3) — either succeeds or throws
```

**Note:** AbortErrors (timeouts or external cancellation) are not retried — they stop the retry loop immediately.

---

## Lifecycle Hooks

```javascript
const users = await AsyncHelpers.fetchJSON('/api/users', {
  onStart: () => {
    // Called immediately before the first fetch attempt
    showSpinner();
    console.log('Fetching users...');
  },
  onSuccess: (data, response) => {
    // Called with the parsed data AND the Response object
    console.log(`Loaded ${data.length} users`);
    console.log('Status:', response.status);
  },
  onError: (error) => {
    // Called if all attempts fail
    console.error('Failed to load users:', error.message);
    showErrorBanner('Could not load users. Please try again.');
  },
  onFinally: () => {
    // Called after success OR error — always runs
    hideSpinner();
  }
});
```

---

## Loading Indicator

Pass any DOM element (or DOMHelpers-enhanced element) as `loadingIndicator`. The module shows it when the request starts and hides it when it finishes:

```javascript
const spinner = document.getElementById('loadingSpinner');

const data = await AsyncHelpers.fetchJSON('/api/data', {
  loadingIndicator: spinner
});

// If using Elements:
const data = await AsyncHelpers.fetchJSON('/api/data', {
  loadingIndicator: Elements.loadingSpinner  // uses .update({ style: { display } })
});
```

---

## External Cancellation via AbortController

Link an external `AbortController` to cancel the request from outside:

```javascript
const controller = new AbortController();

// Start a request
const fetchPromise = AsyncHelpers.fetchJSON('/api/large-dataset', {
  timeout: 0,    // no automatic timeout
  signal: controller.signal
});

// Cancel it from a button
document.getElementById('cancelBtn').addEventListener('click', () => {
  controller.abort();
});

try {
  const data = await fetchPromise;
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request was cancelled by the user');
  }
}
```

---

## Real-World Examples

### Loading User Profile

```javascript
async function loadProfile(userId) {
  const profile = await AsyncHelpers.fetchJSON(`/api/users/${userId}`, {
    timeout:   8000,
    retries:   2,
    onStart:   () => Elements.profileLoader.fadeIn(),
    onSuccess: (data) => updateProfileUI(data),
    onError:   (err) => showProfileError(err.message),
    onFinally: () => Elements.profileLoader.fadeOut()
  });

  return profile;
}
```

### Submitting a Form Manually

```javascript
async function submitOrder() {
  const values = Forms.orderForm.values;

  const result = await AsyncHelpers.enhancedFetch('/api/orders', {
    method:  'POST',
    body:    values,                 // auto-JSON-stringified
    timeout: 15000,
    retries: 1,
    onError: (err) => {
      Forms.orderForm.update({ text: 'Order failed: ' + err.message });
    }
  });

  return result;
}
```

### Downloading a File

```javascript
async function downloadReport(reportId) {
  const blob = await AsyncHelpers.fetchBlob(`/api/reports/${reportId}/download`, {
    timeout: 30000,  // reports can be large
    onStart: () => showDownloadProgress()
  });

  // Create a download link
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href     = url;
  a.download = `report-${reportId}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
```

---

## Summary

| Method | Response type | Use when |
|---|---|---|
| `fetchJSON(url, opts)` | Parsed JSON | Loading data from an API |
| `fetchText(url, opts)` | String | Loading HTML, CSV, plain text |
| `fetchBlob(url, opts)` | Blob | Downloading images, files, binary data |
| `enhancedFetch(url, opts)` | Configurable | Full control over response type |

**Key options:**
- `timeout` — milliseconds before the request is cancelled
- `retries` + `retryDelay` — auto-retry on failure
- `exponentialBackoff` — increase delay with each retry
- `responseType` — `'json'` | `'text'` | `'blob'` | `'arrayBuffer'` | `'raw'`
- `onStart` / `onSuccess` / `onError` / `onFinally` — lifecycle hooks
