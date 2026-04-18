[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Real-World Examples, Availability, and API Reference

## Example 1: Managing App State with Namespace Style

```javascript
const app = ReactiveUtils.state({ theme: 'dark', count: 0 });
ReactiveUtils.autoSave(app, 'app-state');

// Namespace style throughout
ReactiveUtils.set(app, { count: prev => prev + 1 });
ReactiveUtils.set(app, { theme: 'light' });
ReactiveUtils.save(app);

// Check storage info
const info = ReactiveUtils.storageInfo(app);
console.log(`Stored: ${info.sizeKB}KB`);

// Clean up when done
ReactiveUtils.cleanup(app);
```

---

## Example 2: Async Data with Namespace Style

```javascript
const users = ReactiveUtils.asyncState([]);

// Fetch data
await ReactiveUtils.execute(users, async (signal) => {
  const res = await fetch('/api/users', { signal });
  return res.json();
});

// Display data
ReactiveUtils.effect(() => {
  if (users.isSuccess) {
    renderUsers(users.data);
  }
});

// Refresh
document.getElementById('refresh').onclick = () => {
  ReactiveUtils.refetch(users);
};

// Cancel
document.getElementById('cancel').onclick = () => {
  ReactiveUtils.abort(users);
};

// Reset
document.getElementById('reset').onclick = () => {
  ReactiveUtils.reset(users);
};
```

---

## Example 3: Component Lifecycle with Namespace Style

```javascript
const widget = ReactiveUtils.component({
  state: { count: 0, label: 'Counter' },
  actions: {
    increment() { this.count++; }
  }
});

// Use namespace methods
ReactiveUtils.set(widget, { label: 'My Counter' });

const raw = ReactiveUtils.getRaw(widget);
console.log(raw);  // Plain object

// Destroy when removing from the page
ReactiveUtils.destroy(widget);
```

---

## Example 4: Storage Control with Namespace Style

```javascript
const draft = ReactiveUtils.state({ title: '', body: '' });
ReactiveUtils.autoSave(draft, 'blog-draft', { debounce: 1000 });

// Pause auto-save during bulk edit
ReactiveUtils.stopAutoSave(draft);

ReactiveUtils.set(draft, {
  title: 'New Post',
  body: 'Content here...'
});

// Resume and force save
ReactiveUtils.startAutoSave(draft);
ReactiveUtils.save(draft);

// Check if draft exists
if (ReactiveUtils.exists(draft)) {
  console.log('Draft saved');
}

// Publish → clear the draft
async function publish() {
  await sendToServer(draft);
  ReactiveUtils.clear(draft);
}
```

---

## Example 5: Using Global Shortcuts

When `effect()` is available as a global, all 14 methods are also available as globals:

```javascript
// No namespace needed — just call the function
const state = ReactiveUtils.state({ count: 0 });
autoSave(state, 'counter');

set(state, { count: 10 });
save(state);

if (exists(state)) {
  load(state);
}

const info = storageInfo(state);
console.log(info.sizeKB);

cleanup(state);
```

This is the shortest possible syntax. Use it when brevity is important and global namespace collisions aren't a concern.

---

## Example 6: Mixing Styles

You can freely mix instance and namespace styles in the same codebase:

```javascript
const state = ReactiveUtils.state({ x: 0, y: 0 });
ReactiveUtils.autoSave(state, 'position');

// Instance style for quick, inline operations
state.$set({ x: 100 });

// Namespace style for utility functions
function saveAndReport(s) {
  ReactiveUtils.save(s);
  const info = ReactiveUtils.storageInfo(s);
  console.log(`Saved ${info.sizeKB}KB`);
}

saveAndReport(state);
```

**When namespace style shines:** In utility functions that accept any state as a parameter. You don't need to know which specific `$` methods the state has — the namespace method validates internally.

---

## Where Every Method Is Available

The module copies all 14 methods to every available namespace:

```
┌────────────────────────────────────────────────────────────────┐
│  Method          │ ReactiveUtils │ Elements │ Collections │ Selector │ Global │
├──────────────────┼───────────────┼──────────┼─────────────┼──────────┼────────┤
│ set              │      ✅       │    ✅    │     ✅      │    ✅    │   ✅   │
│ cleanup          │      ✅       │    ✅    │     ✅      │    ✅    │   ✅   │
│ getRaw           │      ✅       │    ✅    │     ✅      │    ✅    │   ✅   │
│ execute          │      ✅       │    ✅    │     ✅      │    ✅    │   ✅   │
│ abort            │      ✅       │    ✅    │     ✅      │    ✅    │   ✅   │
│ reset            │      ✅       │    ✅    │     ✅      │    ✅    │   ✅   │
│ refetch          │      ✅       │    ✅    │     ✅      │    ✅    │   ✅   │
│ destroy          │      ✅       │    ✅    │     ✅      │    ✅    │   ✅   │
│ save             │      ✅       │    ✅    │     ✅      │    ✅    │   ✅   │
│ load             │      ✅       │    ✅    │     ✅      │    ✅    │   ✅   │
│ clear            │      ✅       │    ✅    │     ✅      │    ✅    │   ✅   │
│ exists           │      ✅       │    ✅    │     ✅      │    ✅    │   ✅   │
│ stopAutoSave     │      ✅       │    ✅    │     ✅      │    ✅    │   ✅   │
│ startAutoSave    │      ✅       │    ✅    │     ✅      │    ✅    │   ✅   │
│ storageInfo      │      ✅       │    ✅    │     ✅      │    ✅    │   ✅   │
└──────────────────┴───────────────┴──────────┴─────────────┴──────────┴────────┘

Note: Elements, Collections, Selector are only available if those modules are loaded.
      Globals are only available if effect() is a global function.
```

---

## Complete API Reference

### Core State

| Namespace Method | Instance Equivalent | Returns |
|-----------------|-------------------|---------|
| `ReactiveUtils.set(state, updates)` | `state.$set(updates)` | State |
| `ReactiveUtils.cleanup(state)` | `state.$cleanup()` | undefined |
| `ReactiveUtils.getRaw(state)` | `state.$raw` | Plain object |

### Async State

| Namespace Method | Instance Equivalent | Returns |
|-----------------|-------------------|---------|
| `ReactiveUtils.execute(async, fn)` | `asyncState.$execute(fn)` | Promise |
| `ReactiveUtils.abort(async)` | `asyncState.$abort()` | undefined |
| `ReactiveUtils.reset(async)` | `asyncState.$reset()` | undefined |
| `ReactiveUtils.refetch(async)` | `asyncState.$refetch()` | Promise |

### Component

| Namespace Method | Instance Equivalent | Returns |
|-----------------|-------------------|---------|
| `ReactiveUtils.destroy(comp)` | `component.$destroy()` | undefined |

### Storage

| Namespace Method | Instance Equivalent | Returns |
|-----------------|-------------------|---------|
| `ReactiveUtils.save(state)` | `state.$save()` | Boolean |
| `ReactiveUtils.load(state)` | `state.$load()` | Boolean |
| `ReactiveUtils.clear(state)` | `state.$clear()` | Boolean |
| `ReactiveUtils.exists(state)` | `state.$exists()` | Boolean |
| `ReactiveUtils.stopAutoSave(state)` | `state.$stopAutoSave()` | State |
| `ReactiveUtils.startAutoSave(state)` | `state.$startAutoSave()` | State |
| `ReactiveUtils.storageInfo(state)` | `state.$storageInfo()` | Object |

---

## Load Order

```html
<!-- 1. Reactive Core (required) -->
<script src="04_reactive/01_dh-reactive.js"></script>

<!-- 2. Other reactive modules (load the ones you need) -->
<script src="04_reactive/02_dh-reactive-array-patch.js"></script>
<script src="04_reactive/03_dh-reactive-collections.js"></script>
<script src="04_reactive/04_dh-reactive-form.js"></script>
<script src="04_reactive/05_dh-reactive-cleanup.js"></script>
<script src="04_reactive/06_dh-reactive-enhancements.js"></script>
<script src="04_reactive/07_dh-reactive-storage.js"></script>

<!-- 3. Namespace Methods (load LAST — wraps everything above) -->
<script src="04_reactive/08_dh-reactive-namespace-methods.js"></script>
```

**Order matters:** This module wraps `$` methods added by previous modules, so it must load after all of them.

---

## Congratulations!

You've completed the Reactive Namespace Methods learning path. You now understand:

- ✅ What namespace methods are — aliases for `$` instance methods
- ✅ All 14 methods with examples and their instance equivalents
- ✅ How validation works — safe to call on any object
- ✅ Where methods are available — ReactiveUtils, Elements, Collections, Selector, globals
- ✅ When to use namespace style vs instance style

**Use whichever style fits your code best!**