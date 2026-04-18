[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Advanced Functions

## What are "advanced functions"?

The functions in this file come from **optional enhancement modules**. They are only available as globals if those modules were loaded before the Standalone API.

```
Module 05 (Cleanup)      → collector(), scope()
Module 06 (Enhancements) → safeEffect(), safeWatch(), asyncEffect(),
                           asyncState(), ErrorBoundary, DevTools
```

> **Quick check:** If calling one of these functions gives you `ReferenceError: X is not defined`, it means the corresponding module wasn't loaded. See the load order section at the end of this file.

---

## The cleanup system

### `collector()` — Group disposals together

#### What it does

Creates a "basket" you can toss cleanup functions into. When you're done, call `.cleanup()` on the basket and everything inside gets cleaned up at once.

#### Comes from

Module 05 (`05_dh-reactive-cleanup.js`)

#### Syntax

```javascript
const cleanup = collector();
cleanup.add(disposeFn);  // add a cleanup function
cleanup.cleanup();       // run all of them
```

#### Example

```javascript
const cleanup = collector();

// Add effects to the collector
const disposeEffect1 = effect(() => {
  document.title = 'Count: ' + counter.count;
});

const disposeEffect2 = effect(() => {
  console.log('Status:', app.status);
});

cleanup.add(disposeEffect1);
cleanup.add(disposeEffect2);

// Later, when done (e.g. user navigates away):
cleanup.cleanup();
// Both effects are now stopped and cleaned up
```

#### The mental model

```
collector() is like a recycle bag:
┌─────────────────────────────────┐
│  cleanup bag                    │
│  ├── disposeEffect1             │
│  ├── disposeEffect2             │
│  └── stopWatcher                │
└─────────────────────────────────┘
      ↓ cleanup.cleanup()
All three get cleaned up at once
```

---

### `scope()` — Auto-collecting cleanup scope

#### What it does

Runs a setup function and automatically collects all dispose functions returned by effects and watchers inside it. Returns a single cleanup function.

#### Comes from

Module 05 (`05_dh-reactive-cleanup.js`)

#### Syntax

```javascript
const cleanup = scope((collect) => {
  collect(effect(() => { /* ... */ }));
  collect(watch(state, { key: handler }));
  // return value is the cleanup function for everything collected
});

// Later:
cleanup();  // cleans up everything
```

#### Example

```javascript
function setupDashboard(data) {
  // scope() returns a single cleanup function for the entire setup
  const cleanup = scope((collect) => {
    collect(effect(() => {
      document.getElementById('userName').textContent = data.user.name;
    }));

    collect(effect(() => {
      document.getElementById('stats').textContent = data.stats.total;
    }));

    collect(watch(data, {
      theme: (newTheme) => {
        document.body.className = 'theme-' + newTheme;
      }
    }));
  });

  return cleanup;  // caller can stop everything when needed
}

const stopDashboard = setupDashboard(appData);

// When user navigates away:
stopDashboard();  // all effects and watchers stopped
```

---

## Error handling

### `safeEffect()` — Effect with error boundary

#### What it does

Like `effect()`, but catches errors thrown inside the effect instead of crashing the entire reactive system. You provide an error handler that runs if something goes wrong.

#### Comes from

Module 06 (`06_dh-reactive-enhancements.js`)

#### Syntax

```javascript
safeEffect(() => {
  // effect logic (may throw)
}, {
  errorBoundary: {
    onError: (error) => { /* handle error */ },
    fallback: () => { /* optional: show fallback UI */ },
    retry: 3  // optional: retry on error
  }
});
```

#### Example

```javascript
const userData = state({ profile: null });

safeEffect(() => {
  // This might throw if profile is null and we access a property
  const name = userData.profile.name;
  document.getElementById('profileName').textContent = name;
}, {
  errorBoundary: {
    onError: (error) => {
      console.error('Profile effect failed:', error.message);
      document.getElementById('profileName').textContent = 'Unknown user';
    }
  }
});

// Even if profile is null initially, the app doesn't crash
```

#### `safeEffect()` vs `effect()`

```
effect():
  ├── Runs immediately
  ├── Re-runs on state changes
  └── ❌ If it throws, the error propagates and may crash the app

safeEffect():
  ├── Runs immediately
  ├── Re-runs on state changes
  └── ✅ If it throws, onError is called instead — app keeps running
```

---

### `safeWatch()` — Watch with error boundary

#### What it does

Like `watch()`, but with error handling. If a watcher callback throws, the error is caught and passed to your error handler.

#### Comes from

Module 06 (`06_dh-reactive-enhancements.js`)

#### Syntax

```javascript
safeWatch(state, 'propertyName', callback, {
  errorBoundary: {
    onError: (error) => { /* handle error */ }
  }
});
```

#### Example

```javascript
const settings = state({ theme: 'light' });

safeWatch(settings, 'theme', (newTheme) => {
  // Might throw if applyTheme does something unexpected
  applyTheme(newTheme);
}, {
  errorBoundary: {
    onError: (error) => {
      console.error('Theme switch failed:', error);
      applyTheme('light');  // fallback to default
    }
  }
});
```

---

## Async effects

### `asyncEffect()` — Async effect with AbortSignal support

#### What it does

Like `effect()`, but supports `async/await`. Automatically cancels the previous async operation when the effect re-runs (preventing stale data from overwriting fresh data).

#### Comes from

Module 06 (`06_dh-reactive-enhancements.js`)

#### Syntax

```javascript
asyncEffect(async (signal) => {
  // signal is an AbortSignal — use it with fetch() for auto-cancellation
  const data = await fetch(url, { signal });
  // ...
}, {
  onError: (error) => { /* handle error */ }
});
```

#### Example

```javascript
const search = state({ query: '' });

asyncEffect(async (signal) => {
  if (!search.query) return;

  const response = await fetch(
    '/api/search?q=' + search.query,
    { signal }  // ← This is the AbortSignal
  );
  const results = await response.json();

  document.getElementById('results').textContent =
    results.length + ' results found';
}, {
  onError: (error) => {
    if (error.name !== 'AbortError') {
      // Only show error if it wasn't a deliberate cancellation
      console.error('Search failed:', error);
    }
  }
});
```

#### The cancellation flow

```
User types "h"     → asyncEffect runs → fetch starts for "h"
User types "he"    → asyncEffect runs → fetch for "h" is ABORTED
                                       → fetch starts for "he"
User types "hel"   → asyncEffect runs → fetch for "he" is ABORTED
                                       → fetch starts for "hel"
User stops typing  → fetch for "hel" completes → results shown
```

No stale "h" results ever overwrite the "hel" results.

---

## Async state

### `asyncState()` — Race-condition-safe async state

#### What it does

Creates a reactive state object specifically for async data (like API responses). Handles loading states, errors, and prevents race conditions — all automatically.

#### Comes from

Module 06 (`06_dh-reactive-enhancements.js`)

#### Syntax

```javascript
const data = asyncState(initialValue, {
  onSuccess: (result) => { /* called on success */ },
  onError: (error) => { /* called on error */ }
});
```

#### The state shape

An `asyncState` object always has:

```
data.value    → The current value (starts as initialValue)
data.loading  → true while fetching
data.error    → Error object if something went wrong, otherwise null
data.requestId → Internal counter for race condition prevention
```

#### Built-in instance methods (from Module 06)

```javascript
data.$execute(async (signal) => { /* fetch logic */ })  // run async operation
data.$abort()     // cancel current operation
data.$reset()     // reset to initial state
data.$refetch()   // re-run last operation
```

#### Example

```javascript
const posts = asyncState([], {
  onSuccess: (data) => console.log('Loaded', data.length, 'posts'),
  onError: (err) => console.error('Failed to load posts:', err)
});

// Show loading state
effect(() => {
  document.getElementById('loader').style.display =
    posts.loading ? 'block' : 'none';
});

// Show data
effect(() => {
  if (posts.value.length > 0) {
    document.getElementById('postList').innerHTML =
      posts.value.map(p => `<li>${p.title}</li>`).join('');
  }
});

// Load the data
posts.$execute(async (signal) => {
  const response = await fetch('/api/posts', { signal });
  return response.json();
});
```

---

## Error handling classes

### `ErrorBoundary` — Structured error handling

#### What it does

A class that wraps effects and watchers, catching any errors they throw. Think of it as a safety net for an entire group of reactive operations.

#### Comes from

Module 06 (`06_dh-reactive-enhancements.js`)

#### Syntax

```javascript
const boundary = new ErrorBoundary({
  onError: (error, context) => { /* handle error */ },
  fallback: () => { /* show fallback UI */ },
  retry: 3  // optional retry count
});

boundary.run(() => {
  // reactive code that might throw
  effect(() => { /* ... */ });
});
```

#### Example

```javascript
const boundary = new ErrorBoundary({
  onError: (error) => {
    console.error('Dashboard error:', error.message);
    document.getElementById('dashboard').innerHTML =
      '<p>Something went wrong. Please refresh.</p>';
  }
});

boundary.run(() => {
  // All effects inside are protected
  effect(() => {
    const user = appState.user;
    if (!user) throw new Error('No user loaded');
    document.getElementById('userName').textContent = user.name;
  });

  effect(() => {
    renderStats(appState.stats);
  });
});
```

---

## Developer tools

### `DevTools` — Debug and monitor reactive state

#### What it does

Provides development-time tools for inspecting and debugging the reactive system. Auto-enables on `localhost`.

#### Comes from

Module 06 (`06_dh-reactive-enhancements.js`)

#### Available methods

```javascript
DevTools.enable()                    // Enable DevTools
DevTools.trackState(state, 'label')  // Start tracking a state object
DevTools.getReport()                 // Get a full report of all tracked states
DevTools.clearTracking()             // Stop tracking everything
```

#### Example

```javascript
// Development only — DevTools auto-enables on localhost
const userState = state({ name: 'Alice', role: 'admin' });
const cartState = state({ items: [], total: 0 });

DevTools.trackState(userState, 'User');
DevTools.trackState(cartState, 'Cart');

// ... app runs ...

// Later, check what happened:
const report = DevTools.getReport();
console.log(report);
// Shows update counts, values, and timing for tracked states
```

#### Note

DevTools is meant for development and debugging. Disable or remove it in production builds.

---

## Forms

### `form()` and `createForm()` — Reactive form management

#### What they do

Create a reactive form with built-in validation, touched tracking, and submit handling. `createForm()` is an alias for `form()`.

#### Comes from

Module 04 (`04_dh-reactive-form.js`)

#### Syntax

```javascript
const myForm = form(initialValues, {
  validators: {
    fieldName: validatorFn
  },
  onSubmit: async (values) => { /* submit logic */ }
});
```

#### Example

```javascript
const loginForm = form(
  { email: '', password: '' },
  {
    validators: {
      email: validators.email('Please enter a valid email'),
      password: validators.minLength(8, 'Password must be 8+ characters')
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(values)
      });
      return response.json();
    }
  }
);

// Access form state
console.log(loginForm.values.email);    // ''
console.log(loginForm.isValid);          // false
console.log(loginForm.errors.email);     // validation message or null

// Use the form
loginForm.handleChange('email', 'alice@example.com');
loginForm.handleChange('password', 'mypassword123');
loginForm.submit();  // triggers onSubmit if valid
```

### `validators` — Built-in form validators

```javascript
validators.required('This field is required')
validators.email('Enter a valid email')
validators.minLength(8, 'Minimum 8 characters')
validators.maxLength(100, 'Maximum 100 characters')
validators.min(0, 'Must be positive')
validators.max(100, 'Maximum value is 100')
validators.pattern(/^[a-z]+$/, 'Only lowercase letters')
validators.match('password', 'Passwords must match')
validators.combine(validators.required(), validators.email())
```

---

## Load order quick reference

To use the advanced global functions, load modules in this order:

```html
<!-- Core (required) -->
<script src="01_dh-reactive.js"></script>

<!-- Optional enhancements (load before shortcut) -->
<script src="02_dh-reactive-ref.js"></script>          <!-- ref(), refs() -->
<script src="03_dh-reactive-collections.js"></script>  <!-- collection(), list() -->
<script src="04_dh-reactive-form.js"></script>         <!-- form(), validators -->
<script src="05_dh-reactive-cleanup.js"></script>      <!-- collector(), scope() -->
<script src="06_dh-reactive-enhancements.js"></script> <!-- safeEffect(), asyncEffect(), etc. -->
<script src="07_dh-reactive-storage.js"></script>      <!-- autoSave(), reactiveStorage() -->
<script src="08_dh-reactive-namespace-methods.js"></script>

<!-- ALWAYS LAST: -->
<script src="09_dh-reactiveUtils-shortcut.js"></script>
```

---

## Key takeaways

1. **`collector()` and `scope()`** — from Module 05; manage cleanup by grouping dispose functions
2. **`safeEffect()` and `safeWatch()`** — from Module 06; run effects with error catching
3. **`asyncEffect()`** — from Module 06; async effects with automatic previous-run cancellation
4. **`asyncState()`** — from Module 06; structured async data with loading/error state and race condition safety
5. **`ErrorBoundary`** — from Module 06; class-based error boundary for groups of effects
6. **`DevTools`** — from Module 06; development-only debugging and monitoring
7. **`form()` and `validators`** — from Module 04; complete reactive form management
8. **All conditional** — only available as globals if the parent module was loaded first

---

## What's next?

Let's look at the **storage functions** — a powerful group that lets you automatically save and sync reactive state with the browser's storage system:
- `autoSave()` — add auto-save to any state object
- `reactiveStorage()` — create a reactive proxy over localStorage/sessionStorage
- `watchStorage()` — react to changes in stored values
- `collection helpers` — create collections with computed properties and filters

Let's continue! 🚀