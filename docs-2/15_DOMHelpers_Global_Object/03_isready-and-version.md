[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# DOMHelpers.isReady() and DOMHelpers.version

## Quick Start (30 seconds)

```javascript
// Check if the library is fully loaded
if (DOMHelpers.isReady()) {
  console.log('All helpers are available!');
  console.log('Version:', DOMHelpers.version);  // "2.3.1"
}
```

---

## What is DOMHelpers.isReady()?

`DOMHelpers.isReady()` is a **health check** for the entire library. It returns `true` if all three core helpers — `Elements`, `Collections`, and `Selector` — are available and ready to use.

Simply put, it answers one question: **"Did everything load correctly?"**

---

## Syntax

```javascript
DOMHelpers.isReady()    // returns true or false
DOMHelpers.version      // returns a string like "2.3.1"
```

| Member | Type | Returns |
|--------|------|---------|
| `isReady()` | Method | `true` if all helpers exist, `false` otherwise |
| `version` | Property | Version string (e.g., `"2.3.1"`) |

---

## Why Does isReady() Exist?

### The Situation It Solves

The DOM Helpers library creates three separate helpers. In most cases, they all load fine. But in certain scenarios, something might go wrong:

- A script loading error could prevent the full library from initializing
- A content security policy (CSP) might block parts of the code
- The library might be loaded in pieces in a modular setup
- The script might run before the DOM is available

Without `isReady()`, you'd have to check each helper individually:

```javascript
// Without isReady() — checking each one manually
if (typeof Elements !== 'undefined' &&
    typeof Collections !== 'undefined' &&
    typeof Selector !== 'undefined') {
  console.log('All good!');
}
```

That's verbose and easy to forget.

### The isReady() Way

```javascript
// With isReady() — one simple check
if (DOMHelpers.isReady()) {
  console.log('All good!');
}
```

✅ **One call** instead of three checks
✅ **Clear intent** — anyone reading the code knows what it means
✅ **Future-proof** — if new helpers are added, the check can expand

---

## How Does isReady() Work?

Here's what happens behind the scenes when you call `DOMHelpers.isReady()`:

```
DOMHelpers.isReady()
   ↓
Checks: Does this.Elements exist?    → Yes/No
   ↓
Checks: Does this.Collections exist? → Yes/No
   ↓
Checks: Does this.Selector exist?    → Yes/No
   ↓
Returns: true (all exist) or false (one or more missing)
```

The actual implementation is simple:

```javascript
isReady() {
  return !!(this.Elements && this.Collections && this.Selector);
}
```

**What's the `!!` doing?** It converts the value to a strict boolean. If all three helpers exist, the result is `true`. If even one is `null`, `undefined`, or `false`, the result is `false`.

---

## Basic Usage: isReady()

### Example 1: Safe App Initialization

```javascript
function startApp() {
  // Always check before using the library
  if (!DOMHelpers.isReady()) {
    console.error('DOM Helpers did not load correctly.');
    return;
  }

  // Safe to use all helpers
  Elements.header.update({ textContent: 'App Started!' });
  Collections.ClassName.btn.update({ disabled: false });
}

startApp();
```

**What's happening here:**
- Before using any helper, we ask `isReady()` if everything loaded
- If it returns `false`, we stop and log an error — no crashes
- If it returns `true`, we proceed confidently

---

### Example 2: Conditional Feature Loading

```javascript
// Only enable advanced features if the library is fully available
if (DOMHelpers.isReady()) {
  // Full library available — use all features
  Elements.header.update({ textContent: 'Full Mode' });
  Collections.ClassName.feature.update({ style: { display: 'block' } });
} else {
  // Fallback — use plain JavaScript
  document.getElementById('header').textContent = 'Basic Mode';
}
```

**What's happening here:**
- We use `isReady()` to decide between the enhanced library and plain JavaScript
- This is useful for progressive enhancement — your app still works even if the library fails to load

---

### Example 3: Waiting for Readiness

```javascript
// If the library loads asynchronously, you might need to wait
function waitForDOMHelpers(callback, maxWait = 5000) {
  const start = Date.now();

  function check() {
    if (typeof DOMHelpers !== 'undefined' && DOMHelpers.isReady()) {
      callback();
    } else if (Date.now() - start < maxWait) {
      setTimeout(check, 100);
    } else {
      console.error('DOM Helpers did not become ready in time');
    }
  }

  check();
}

// Usage
waitForDOMHelpers(() => {
  console.log('Ready! Running app...');
  Elements.header.update({ textContent: 'Loaded!' });
});
```

**What's happening here:**
- If the library script loads asynchronously (e.g., with `async` or `defer`), it might not be ready immediately
- This utility function polls `isReady()` every 100ms until the library is available
- After 5 seconds, it gives up and logs an error

---

## Basic Usage: version

### Example 1: Simple Version Logging

```javascript
console.log(`DOM Helpers v${DOMHelpers.version}`);
// Output: "DOM Helpers v2.3.1"
```

---

### Example 2: Startup Banner

```javascript
function logStartupInfo() {
  if (DOMHelpers.isReady()) {
    console.log('─────────────────────────────');
    console.log(`  DOM Helpers v${DOMHelpers.version}`);
    console.log('  Status: Ready ✅');
    console.log('─────────────────────────────');
  }
}

logStartupInfo();
// Output:
// ─────────────────────────────
//   DOM Helpers v2.3.1
//   Status: Ready ✅
// ─────────────────────────────
```

---

### Example 3: Version Checking

```javascript
function requireMinVersion(minVersion) {
  const current = DOMHelpers.version.split('.').map(Number);
  const required = minVersion.split('.').map(Number);

  // Compare major.minor.patch
  for (let i = 0; i < 3; i++) {
    if ((current[i] || 0) > (required[i] || 0)) return true;
    if ((current[i] || 0) < (required[i] || 0)) return false;
  }

  return true; // Versions are equal
}

// Usage
if (requireMinVersion('2.3.0')) {
  console.log('Version requirement met!');
} else {
  console.warn('Please update DOM Helpers to at least v2.3.0');
}
```

**What's happening here:**
- We split the version string into `[major, minor, patch]` numbers
- We compare each part to ensure the current version meets a minimum requirement
- This is useful when your code depends on features added in a specific version

---

## Using isReady() and version Together

### A Complete Initialization Pattern

```javascript
function initializeApp() {
  // Step 1: Check if DOMHelpers global exists
  if (typeof DOMHelpers === 'undefined') {
    console.error('DOM Helpers library is not loaded.');
    return false;
  }

  // Step 2: Check if all helpers are ready
  if (!DOMHelpers.isReady()) {
    console.error('DOM Helpers loaded partially — some helpers are missing.');
    return false;
  }

  // Step 3: Log version info
  console.log(`DOM Helpers v${DOMHelpers.version} — all systems ready`);

  // Step 4: Proceed with app setup
  Elements.header.update({ textContent: 'Application Ready' });

  return true;
}

const appReady = initializeApp();
```

**Step by step:**

1️⃣ First, we check if the `DOMHelpers` global even exists — if the script failed to load at all, this would be `undefined`

2️⃣ Then, we check `isReady()` — the script might have loaded partially but some helpers didn't initialize

3️⃣ We log the version so we know exactly what's running

4️⃣ Only then do we start using the library

---

## Common Questions

### "What causes isReady() to return false?"

The most common scenarios:

| Scenario | Why isReady() Returns False |
|----------|----------------------------|
| Script error during load | Library code threw an exception before all helpers were created |
| Partial import | Only some modules were imported in a modular setup |
| Load order issue | Code runs before the library script has executed |
| CSP restriction | Content Security Policy blocks the library from initializing |

In typical usage (loading the full library via a `<script>` tag), `isReady()` will almost always return `true`.

---

### "Can version change at runtime?"

No. `DOMHelpers.version` is set when the library is built and doesn't change during execution. It's a simple string property:

```javascript
version: "2.3.1"
```

---

## Summary

| Member | What It Does | Returns |
|--------|-------------|---------|
| `isReady()` | Checks if all three helpers (`Elements`, `Collections`, `Selector`) are available | `true` or `false` |
| `version` | Reports the library version | String like `"2.3.1"` |

> **Simple Rule to Remember:** Call `isReady()` before using the library in situations where loading might fail. Check `version` when you need to log or verify compatibility.