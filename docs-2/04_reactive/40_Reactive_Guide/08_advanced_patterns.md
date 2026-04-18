[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Advanced Reactive Patterns

## Quick Start (30 seconds)

```javascript
// Auto-save state to localStorage
const settings = state({ theme: 'light', language: 'en' });
autoSave(settings, 'app-settings');  // Saves automatically on every change

// Cleanup scope — manage multiple effects at once
const stopAll = scope((collect) => {
  collect(effect(() => { /* effect 1 */ }));
  collect(effect(() => { /* effect 2 */ }));
  collect(watch(app, { count: (v) => console.log(v) }));
});

// Stop everything at once
stopAll();
```

---

## What Are Advanced Patterns?

Advanced patterns are techniques for building **larger, more robust reactive applications**. They go beyond creating state and effects, addressing:

- **Persistence** — saving and loading state from storage
- **Memory management** — cleaning up effects to prevent leaks
- **Error handling** — keeping the app stable when things go wrong
- **Async patterns** — handling race conditions and cancellation
- **Composition** — building complex systems from smaller pieces
- **Performance** — optimizing for large or frequently-updating state

These patterns are not needed for simple apps, but become valuable as your application grows.

---

## Pattern 1: State Persistence with `autoSave()`

### The Problem

State lives in memory. When the user refreshes the page, all state resets. For settings, preferences, or in-progress work, this is a poor experience.

### The Solution: `autoSave()`

`autoSave()` watches a reactive state object and automatically saves it to `localStorage` (or `sessionStorage`) whenever it changes. On page load, it restores the saved state.

```javascript
// Create state
const preferences = state({
  theme: 'light',
  language: 'en',
  fontSize: 16,
  notifications: true
});

// Add auto-save — saves to localStorage as 'user-preferences'
autoSave(preferences, 'user-preferences');

// Now every change is automatically saved
preferences.theme = 'dark';       // Saved to localStorage
preferences.fontSize = 18;        // Saved to localStorage

// Reload the page → preferences are automatically restored
// preferences.theme === 'dark' ← restored from localStorage
```

### Auto-Save Options

```javascript
autoSave(preferences, 'user-preferences', {
  storage: 'localStorage',  // 'localStorage' (default) or 'sessionStorage'
  debounce: 300,            // Wait 300ms after last change before saving (default: 0)
  immediate: true           // Restore from storage immediately on setup
});
```

The `debounce` option is valuable for frequently-updating state — it prevents saving on every keystroke:

```javascript
const searchState = state({ query: '', filters: {} });

// Wait 500ms after user stops typing before saving
autoSave(searchState, 'search-state', { debounce: 500 });
```

### Manual Save, Load, Clear

If you need manual control alongside auto-save, the namespace methods are available:

```javascript
const editorState = state({ content: '', lastSaved: null });
autoSave(editorState, 'editor-draft');

// Force save immediately
document.getElementById('save-btn').addEventListener('click', () => {
  save(editorState);  // Manual immediate save
  editorState.lastSaved = new Date().toISOString();
});

// Load from storage (replaces current state)
document.getElementById('load-btn').addEventListener('click', () => {
  load(editorState);
});

// Check if saved state exists
if (exists(editorState)) {
  console.log('Draft found — restoring...');
  load(editorState);
}

// Clear saved state
document.getElementById('clear-btn').addEventListener('click', () => {
  clear(editorState);
  editorState.content = '';
});

// Get storage info
const info = storageInfo(editorState);
console.log(`Saved ${info.sizeKB}KB in ${info.storage} under key "${info.key}"`);
```

### Auto-Save Patterns

```javascript
// Pattern 1: Settings that should always persist
const settings = state({ theme: 'light', language: 'en' });
autoSave(settings, 'app-settings');

// Pattern 2: Form draft that shouldn't save too aggressively
const draftForm = state({ title: '', body: '' });
autoSave(draftForm, 'post-draft', { debounce: 1000 });

// Pattern 3: Session-only state (cleared when browser closes)
const sessionData = state({ cart: [], lastVisited: null });
autoSave(sessionData, 'session-data', { storage: 'sessionStorage' });

// Pattern 4: Temporarily stop auto-save (e.g., during an import)
stopAutoSave(settings);
applyBulkSettings(importedData);
startAutoSave(settings);
```

---

## Pattern 2: Reactive Storage Proxy

### What is `reactiveStorage()`?

`reactiveStorage()` creates a special reactive object where every property maps directly to a storage key. Reading `storage.theme` reads from localStorage, and writing to it saves to localStorage — reactively.

```javascript
// Create a reactive storage proxy for localStorage
const storage = reactiveStorage('localStorage', 'myApp');

// Read from storage
console.log(storage.theme);       // Reads localStorage["myApp.theme"]

// Write to storage — saves AND triggers reactive updates
storage.theme = 'dark';           // Saves to localStorage, triggers effects

// React to storage changes
effect(() => {
  document.body.className = `theme-${storage.theme}`;
});

// storage.theme changing triggers the effect
storage.theme = 'light';         // Effect re-runs
```

### Cross-Tab Synchronization

`watchStorage()` listens for storage changes from **other browser tabs**:

```javascript
// In any tab:
watchStorage('user-theme', (newTheme, oldTheme) => {
  console.log(`Theme changed to: ${newTheme}`);
  applyTheme(newTheme);
});

// When the user changes theme in another tab,
// this callback fires in all other open tabs
```

This is powerful for keeping multiple open windows in sync without any server communication.

---

## Pattern 3: Memory Management and Cleanup

### Why Cleanup Matters

Every `effect()` and `watch()` registers a dependency. If you create effects for UI elements that are later removed, those effects continue running in the background, wasting memory and potentially causing errors.

```javascript
// ❌ Memory leak — effect never cleaned up
function renderUserCard(userId) {
  const user = state({ name: '', avatar: '' });
  loadUser(userId, user);

  const card = document.createElement('div');
  effect(() => {
    card.innerHTML = `<img src="${user.avatar}"><span>${user.name}</span>`;
  });

  return card;
  // Card is returned, but effect keeps running forever
  // Even after card is removed from DOM
}
```

### Cleanup with Stop Functions

The simplest approach: keep the stop function and call it when done.

```javascript
// ✅ Clean approach with stop function
function renderUserCard(userId) {
  const user = state({ name: '', avatar: '' });

  const card = document.createElement('div');
  const stopEffect = effect(() => {
    card.innerHTML = `<img src="${user.avatar}"><span>${user.name}</span>`;
  });

  // Attach cleanup to the element
  card.cleanup = stopEffect;

  // When card is removed: card.cleanup()
  return card;
}

// When removing:
const card = renderUserCard(123);
document.getElementById('container').appendChild(card);

// Later, when removing:
card.cleanup();  // Stop the effect
card.remove();   // Remove from DOM
```

### Cleanup with `collector()`

`collector()` groups multiple cleanups together — stop them all at once:

```javascript
function initDashboard() {
  const app = state({ users: [], revenue: 0, orders: 0 });

  // Create a collector
  const cleanup = collector();

  // Add effects to the collector
  cleanup.add(effect(() => {
    document.getElementById('user-count').textContent = app.users.length;
  }));

  cleanup.add(effect(() => {
    document.getElementById('revenue').textContent = `$${app.revenue}`;
  }));

  cleanup.add(watch(app, {
    revenue(newVal) {
      if (newVal > 10000) showMilestoneAlert();
    }
  }));

  // Return cleanup function
  return {
    app,
    destroy() {
      cleanup.cleanup();  // Stops all effects and watchers at once
    }
  };
}

const dashboard = initDashboard();

// Later when dashboard is unmounted:
dashboard.destroy();
```

### Cleanup with `scope()`

`scope()` automatically collects all effects created inside it:

```javascript
function createFeature() {
  const featureState = state({ value: 0, isVisible: true });

  // Everything inside scope() is tracked
  const stopFeature = scope((collect) => {
    collect(effect(() => {
      document.getElementById('feature-value').textContent = featureState.value;
    }));

    collect(effect(() => {
      document.getElementById('feature').hidden = !featureState.isVisible;
    }));

    collect(watch(featureState, {
      value(newVal) {
        if (newVal > 100) featureState.isVisible = false;
      }
    }));
  });

  return {
    state: featureState,
    destroy: stopFeature  // Stops all effects created in the scope
  };
}

const feature = createFeature();
feature.state.value = 50;   // Everything works

// Destroy the feature:
feature.destroy();           // All effects stop cleanly
```

### Cleanup with `cleanup(state)`

For reactive state itself, `cleanup()` removes all effects and watchers associated with a state object:

```javascript
const componentState = state({ count: 0, name: '' });

effect(() => { /* watches componentState */ });
watch(componentState, { count: (v) => console.log(v) });

// When done with this state entirely:
cleanup(componentState);  // All effects/watchers for this state are removed
```

---

## Pattern 4: Error Handling

### The Problem with Unhandled Effect Errors

If an effect throws an error, the error propagates and may break the reactive system:

```javascript
// ❌ If this throws, effect stops working
effect(() => {
  const data = parseUnreliableData(app.rawData);  // Might throw
  displayData(data);
});
```

### Using `safeEffect()`

`safeEffect()` wraps your effect with error handling — if an error occurs, it's caught and you can handle it gracefully:

```javascript
safeEffect(() => {
  const data = parseUnreliableData(app.rawData);
  displayData(data);
}, {
  errorBoundary: {
    onError(error, retry) {
      console.error('Effect failed:', error);
      document.getElementById('error-msg').textContent = 'Failed to display data';
      document.getElementById('retry-btn').onclick = retry;  // Offer retry
    },
    fallback() {
      // Render something safe when the effect fails
      document.getElementById('data-display').textContent = 'Data unavailable';
    }
  }
});
```

### Using `safeWatch()`

Similarly, `safeWatch()` handles errors in watch callbacks:

```javascript
safeWatch(dataState, 'rawData', (newData, oldData) => {
  processAndRenderData(newData);  // Might throw
}, {
  errorBoundary: {
    onError(error) {
      console.error('Watch handler failed:', error);
      showErrorToast('Failed to process data update');
    }
  }
});
```

### Using `ErrorBoundary`

For more control, `ErrorBoundary` lets you wrap groups of operations:

```javascript
const boundary = new ErrorBoundary({
  onError(error, context) {
    console.error(`Error in ${context}:`, error);
    sendErrorReport(error);
  },
  onRecover() {
    console.log('Recovered from error');
  }
});

// Wrap effects with the boundary
boundary.wrap(effect(() => {
  // If this throws, boundary catches it
  renderComplexUI(app.data);
}));
```

---

## Pattern 5: Async Patterns

### Handling Race Conditions

When multiple async operations can be in flight, earlier ones might resolve after later ones:

```javascript
const search = state({ query: '', results: [], isLoading: false });

// ❌ Race condition: slower earlier searches might overwrite faster later ones
async function searchBad(query) {
  search.isLoading = true;
  const results = await fetch(`/api/search?q=${query}`).then(r => r.json());
  search.results = results;  // Might be from an old query!
  search.isLoading = false;
}
```

The enhanced async state from module 06 handles this automatically with `AbortSignal`:

```javascript
const searchState = asyncState(null);

// Execute handles race conditions internally
document.getElementById('search-input').addEventListener('input', async (e) => {
  const query = e.target.value;

  await execute(searchState, async (signal) => {
    // signal is an AbortSignal — if a new search starts, this one is cancelled
    const response = await fetch(`/api/search?q=${query}`, { signal });
    return response.json();
  });
});

effect(() => {
  if (searchState.isLoading) {
    document.getElementById('results').textContent = 'Searching...';
  } else if (searchState.isError) {
    document.getElementById('results').textContent = 'Search failed';
  } else if (searchState.isSuccess) {
    renderResults(searchState.data);
  }
});
```

### Retry Pattern

```javascript
const apiData = state({
  data: null,
  loading: false,
  error: null,
  retryCount: 0,
  maxRetries: 3
});

async function fetchWithRetry(url) {
  while (apiData.retryCount <= apiData.maxRetries) {
    apiData.loading = true;
    try {
      const data = await fetch(url).then(r => r.json());
      batch(() => {
        apiData.data = data;
        apiData.loading = false;
        apiData.error = null;
        apiData.retryCount = 0;
      });
      return;  // Success
    } catch (err) {
      if (apiData.retryCount >= apiData.maxRetries) {
        batch(() => {
          apiData.error = err.message;
          apiData.loading = false;
        });
        return;
      }

      apiData.retryCount++;
      const delay = Math.pow(2, apiData.retryCount) * 1000;  // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

### Async Effect Pattern

`asyncEffect()` creates an effect that handles async work with automatic cancellation:

```javascript
asyncEffect(async (signal) => {
  // signal is an AbortSignal — cancelled when state changes or effect stops
  const userId = app.selectedUserId;  // Tracked dependency

  const response = await fetch(`/api/users/${userId}`, { signal });
  if (signal.aborted) return;  // Check before processing

  const user = await response.json();
  if (signal.aborted) return;  // Check again after each await

  app.currentUser = user;
}, {
  onError(error) {
    if (error.name !== 'AbortError') {
      app.userError = error.message;
    }
  }
});

// When app.selectedUserId changes, the previous fetch is automatically cancelled
// and a new one starts
app.selectedUserId = 456;  // Previous fetch (for user 123) is cancelled
```

---

## Pattern 6: Composing Multiple State Objects

### Derived State Across Multiple Stores

```javascript
// Independent stores
const cartStore = store({ items: [] }, {
  getters: {
    itemCount() { return this.items.length; },
    total() { return this.items.reduce((sum, item) => sum + item.price, 0); }
  }
});

const userStore = store({ user: null, isLoggedIn: false }, {
  getters: {
    greeting() { return this.isLoggedIn ? `Hi, ${this.user.name}` : 'Guest'; }
  }
});

const settingsStore = store({ currency: 'USD', language: 'en' });

// Compose them in an effect
effect(() => {
  const totalDisplay = cartStore.total.toLocaleString('en', {
    style: 'currency',
    currency: settingsStore.currency
  });

  document.getElementById('cart-total').textContent = totalDisplay;
  document.getElementById('greeting').textContent = userStore.greeting;
  document.getElementById('cart-badge').textContent = cartStore.itemCount;
});
```

### Reactive State Machine

```javascript
// A simple state machine pattern
const machine = state({
  current: 'idle',
  context: {}
});

computed(machine, {
  canProceed() {
    const validTransitions = {
      idle: ['loading'],
      loading: ['success', 'error'],
      success: ['idle'],
      error: ['idle', 'loading']
    };
    return validTransitions[this.current] || [];
  }
});

function transition(to, context = {}) {
  if (!machine.canProceed.includes(to)) {
    console.warn(`Invalid transition: ${machine.current} → ${to}`);
    return;
  }
  batch(() => {
    machine.current = to;
    machine.context = context;
  });
}

// State machine watches
watch(machine, {
  current(newState, oldState) {
    console.log(`[State Machine] ${oldState} → ${newState}`);
    updateUIForState(newState);
  }
});

// Use the machine
transition('loading');
// ... async work
transition('success', { data: loadedData });
// or
transition('error', { message: 'Something failed' });
```

---

## Pattern 7: DevTools for Debugging

When module 06 is loaded, `DevTools` provides debugging capabilities:

```javascript
// Enable DevTools (usually only in development)
DevTools.enable();

// Track a state object with a readable name
const cartState = state({ items: [], total: 0 });
DevTools.trackState(cartState, 'Shopping Cart');

// Now in the browser console, you can inspect:
// DevTools.inspect('Shopping Cart')  → shows current state
// DevTools.history()                  → shows state change history
// DevTools.snapshot()                 → takes a snapshot of all tracked state
```

In a real app, only enable DevTools in development:

```javascript
const isDev = window.location.hostname === 'localhost';

if (isDev) {
  DevTools.enable();
  DevTools.trackState(authStore, 'Auth');
  DevTools.trackState(cartState, 'Cart');
  DevTools.trackState(uiState, 'UI');
}
```

---

## Pattern 8: Architectural Best Practices

### Separate State by Concern

```javascript
// ❌ One giant state blob
const app = state({
  userName: '',
  userEmail: '',
  cartItems: [],
  cartTotal: 0,
  uiTheme: 'light',
  uiSidebarOpen: false,
  apiIsLoading: false,
  apiError: null
});

// ✅ Separate state by domain
const userState = state({ name: '', email: '' });
const cartState = state({ items: [], total: 0 });
const uiState = state({ theme: 'light', sidebarOpen: false });
const apiState = state({ isLoading: false, error: null });
```

### Keep Effects Focused

```javascript
// ❌ One effect doing everything
effect(() => {
  updateUserDisplay(userState.name);
  updateCartDisplay(cartState.items);
  updateTheme(uiState.theme);
  updateLoadingSpinner(apiState.isLoading);
});

// ✅ Separate effects for separate concerns
effect(() => { updateUserDisplay(userState.name); });
effect(() => { updateCartDisplay(cartState.items); });
effect(() => { updateTheme(uiState.theme); });
effect(() => { updateLoadingSpinner(apiState.isLoading); });
```

### Avoid Reading State in Callbacks (Outside Effects)

```javascript
const counter = state({ count: 0 });

// ❌ Reading in a callback — snapshot, not reactive
document.getElementById('btn').addEventListener('click', () => {
  const count = counter.count;  // Snapshot — not tracked
  updateSomethingWith(count);
});

// ✅ Reading in an effect — reactive and always fresh
effect(() => {
  const count = counter.count;  // Tracked — always fresh
  document.getElementById('display').textContent = count;
});

// ✅ When you need to read in a callback, it's fine — just know it's a snapshot
document.getElementById('btn').addEventListener('click', () => {
  // Reading for a one-time operation (not for display) is fine
  sendToServer({ count: counter.count });
});
```

### Initialize State Eagerly

```javascript
// ✅ Always provide complete initial values
const formState = state({
  name: '',           // Not undefined
  email: '',          // Not undefined
  isSubmitting: false,  // Not undefined
  error: null,          // Not undefined
  touched: {}           // Not undefined
});

// ❌ Undefined initial values cause surprises
const badState = state({
  name,      // Undefined — reactive but confusing
  // Missing properties are harder to track
});
```

### Name Your States and Effects Clearly

```javascript
// ✅ Clear, descriptive names
const shoppingCart = state({ items: [], appliedCoupon: null });
const userAuthentication = state({ user: null, isLoggedIn: false });

// ✅ Groups of effects can be labeled in comments
// --- Cart Display Effects ---
effect(() => { updateCartCount(shoppingCart.items.length); });
effect(() => { updateCartTotal(calculateTotal(shoppingCart.items)); });

// --- Auth Effects ---
effect(() => { updateNavBar(userAuthentication.isLoggedIn); });
```

---

## Common Anti-Patterns to Avoid

### 1. The Derived Value Sync Problem

```javascript
// ❌ Keeping a derived value in state — can go out of sync
const cart = state({ items: [], total: 0 });

cart.items = [...cart.items, newItem];
// Forgot to update cart.total! Now it's wrong.

// ✅ Use computed — always in sync
computed(cart, {
  total() { return this.items.reduce((sum, item) => sum + item.price, 0); }
});
```

### 2. Creating Effects Inside Callbacks

```javascript
// ❌ Creating effects in event handlers — accumulates without cleanup
document.getElementById('btn').addEventListener('click', () => {
  effect(() => {
    console.log(app.count);  // New effect created on every click!
  });
});

// ✅ Create effects once at setup time
effect(() => {
  console.log(app.count);  // One effect, always running
});
```

### 3. Not Cleaning Up Dynamic Content

```javascript
// ❌ Rendering dynamic components without cleanup
function renderItems(items) {
  items.forEach(item => {
    const el = document.createElement('div');
    effect(() => { el.textContent = item.name; });  // Never cleaned up!
    container.appendChild(el);
  });
}

// ✅ Track and clean up
const itemEffects = [];

function renderItems(items) {
  // Clean up previous effects
  itemEffects.forEach(stop => stop());
  itemEffects.length = 0;

  items.forEach(item => {
    const el = document.createElement('div');
    itemEffects.push(effect(() => { el.textContent = item.name; }));
    container.appendChild(el);
  });
}
```

---

## Summary

Advanced patterns let you build production-quality reactive applications:

| Pattern | Tools | Use Case |
|---------|-------|----------|
| Persistence | `autoSave()`, `save()`, `load()`, `clear()` | Remember user state across sessions |
| Reactive Storage | `reactiveStorage()`, `watchStorage()` | Storage-as-state, cross-tab sync |
| Memory Management | `collector()`, `scope()`, `cleanup()` | Prevent memory leaks |
| Error Handling | `safeEffect()`, `safeWatch()`, `ErrorBoundary` | Graceful failure recovery |
| Async | `asyncEffect()`, `execute()`, `abort()` | Race-condition-safe async |
| Composition | Multiple states, cross-state effects | Modular app architecture |
| Debugging | `DevTools` | Inspect and trace reactive behavior |

**The rule of thumb:**
- Start simple — `state()` + `effect()` covers most cases
- Add `computed()` when you have derived values
- Add `watch()` when you need old/new value comparisons
- Add `batch()` when making multiple related changes
- Add `autoSave()` when state needs to persist
- Add cleanup patterns when building dynamic UIs
- Add error handling when reliability is critical

The reactive system is designed to grow with you — start with the basics and add complexity only when you need it.

---

## Final Summary: The Complete Reactive API at a Glance

### Creating State
```javascript
const myState = state({ key: value });           // Plain reactive object
const myRef = ref(singleValue);                  // Single reactive value
const myForm = form({ field: defaultVal });       // Form with validation structure
const myStore = store(state, { getters, actions }); // Store with named operations
const myComponent = component({ state, computed, watch, effects, actions }); // Full component
```

### Updating State
```javascript
myState.key = newValue;                          // Direct assignment
set(myState, { key: prev => prev + 1 });         // Functional update
batch(() => { myState.a = 1; myState.b = 2; });  // Grouped update
```

### Reacting to State
```javascript
effect(() => { /* runs when dependencies change */ });
computed(myState, { derived() { return this.a + this.b; } });
watch(myState, { key(newVal, oldVal) { /* specific change callback */ } });
```

### Utilities
```javascript
isReactive(value);   // Check if reactive
getRaw(myState);     // Get plain object
notify(myState, 'key');  // Manual trigger
untrack(() => { /* read without tracking */ });
batch(() => { /* group updates */ });
```

### Persistence
```javascript
autoSave(myState, 'storage-key');      // Auto-save to localStorage
save(myState);                          // Force save
load(myState);                          // Load from storage
clear(myState);                         // Clear from storage
exists(myState);                        // Check if saved
```

### Cleanup
```javascript
const stop = effect(() => { /* ... */ });
stop();                                  // Stop one effect

const cleanup = collector();
cleanup.add(effect(() => { /* ... */ }));
cleanup.cleanup();                       // Stop all collected effects

const stop = scope((collect) => {
  collect(effect(() => { /* ... */ }));
});
stop();                                  // Stop everything in scope

cleanup(myState);                        // Clean up all effects on state
```

**And always — the shortcut API:**
```javascript
// Load 09_dh-reactiveUtils-shortcut.js and use everything without namespace:
const myState = state({});    // not ReactiveUtils.state({})
set(myState, updates);        // not ReactiveUtils.set(myState, updates)
effect(() => { /* ... */ });  // not ReactiveUtils.effect(() => { /* ... */ })
```

---

This is the end of the reactive system guide. You now have everything you need to build reactive applications from simple interactive buttons to complex multi-state single-page applications.

The reactive system is designed around one core idea: **describe how data should look, and let the system keep everything in sync**. Once you internalize that mental model, all the individual pieces — effects, computed, watch, batch, stores — fall naturally into place.