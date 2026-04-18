[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Understanding autoSave

Let's break down exactly what happens when you call `autoSave`, step by step.

---

## The Full Example

```javascript
const todos = Collections.create([
  { id: 1, text: 'Buy milk', done: false }
]);

ReactiveUtils.autoSave(todos, 'my-todos');

// Add a todo — automatically saved
todos.add({ id: 2, text: 'Walk dog', done: false });

// Refresh the page → both todos are still there ✨
```

Now let's understand each part.

---

## Step-by-Step Breakdown

### 1️⃣ Calling autoSave

```javascript
ReactiveUtils.autoSave(todos, 'my-todos');
```

**What happens immediately:**

```
autoSave(todos, 'my-todos')
   ↓
1️⃣ Validates arguments:
   ├── todos is an object? ✅
   └── 'my-todos' is a string? ✅
   ↓
2️⃣ Parses options (using defaults):
   ├── storage: 'localStorage'
   ├── namespace: ''
   ├── debounce: 0
   ├── autoLoad: true
   ├── autoSave: true
   ├── sync: false
   └── expires: null
   ↓
3️⃣ Checks storage availability:
   └── localStorage available? ✅
   ↓
4️⃣ Creates a StorageWrapper:
   └── new StorageWrapper('localStorage', '')
   ↓
5️⃣ AUTO-LOAD: Checks localStorage for key 'my-todos'
   ├── Found? → Parse JSON → restore into state
   └── Not found? → Skip (use initial values)
   ↓
6️⃣ Sets up AUTO-SAVE effect:
   └── effect(() => { getValue(todos); save(); })
   ↓
7️⃣ Attaches methods to todos:
   ├── todos.$save()
   ├── todos.$load()
   ├── todos.$clear()
   ├── todos.$exists()
   ├── todos.$stopAutoSave()
   ├── todos.$startAutoSave()
   ├── todos.$destroy()
   └── todos.$storageInfo()
   ↓
8️⃣ Returns the reactive object (todos)
```

---

### 2️⃣ The Auto-Load Phase

When `autoLoad` is `true` (the default), autoSave immediately checks localStorage:

```javascript
// What autoSave does internally:
const loaded = store.get('my-todos');

if (loaded !== null) {
  // Data found — restore it into the reactive state
  setValue(todos, loaded);
}
```

**How the StorageWrapper stores data:**

```json
{
  "value": [
    { "id": 1, "text": "Buy milk", "done": false },
    { "id": 2, "text": "Walk dog", "done": false }
  ],
  "timestamp": 1708041600000
}
```

Every stored item is wrapped in an object with `value` and `timestamp`. If `expires` is set, there's also an `expires` field.

---

### 3️⃣ The Auto-Save Effect

```javascript
effectCleanup = effect(() => {
  const _ = getValue(reactiveObj);  // Read the state (triggers dependency tracking)
  save();                           // Save to storage
});
```

**This is the magic.** By reading the state inside an `effect()`, the effect registers as a dependency. Whenever the state changes, the effect re-runs and saves.

**What `getValue()` returns depends on the state type:**

```
getValue(reactiveObj)
   ↓
Is it a ref? (has .value)
   → return obj.value

Is it a collection? (has .items)
   → return obj.items

Is it a form? (has .values)
   → return { values, errors, touched }

Is it a state? (has .$raw)
   → return obj.$raw

Otherwise:
   → return obj
```

---

### 4️⃣ When State Changes

```javascript
todos.add({ id: 2, text: 'Walk dog', done: false });
```

**What happens:**

```
todos.add(item)
   ↓
items array changes (reactive)
   ↓
Auto-save effect re-runs:
   ↓
1️⃣ getValue(todos) → reads todos.items → [item1, item2]
   ↓
2️⃣ save() is called:
   ├── Check: is this a save from storage sync? No → proceed
   ├── Check: was the last save < 100ms ago? No → proceed
   ├── Debounce? (debounce = 0) → save immediately
   ↓
3️⃣ doSave():
   ├── Get value to save
   ├── Run onSave callback (if provided)
   ├── Stringify with circular reference protection
   ├── Check size (warn if > 100KB)
   ├── Check total storage size (warn if > 5MB)
   └── store.set('my-todos', value, { expires })
   ↓
4️⃣ localStorage now contains:
   key: 'my-todos'
   value: '{"value":[...items...],"timestamp":1708041600000}'
```

---

### 5️⃣ On Page Refresh

When the page loads again and `autoSave` is called:

```
Page loads → autoSave(todos, 'my-todos') called
   ↓
Auto-load phase:
   ↓
store.get('my-todos')
   ↓
1️⃣ Reads from localStorage
   ↓
2️⃣ JSON.parse the stored string
   ↓
3️⃣ Checks expiration:
   ├── Has expires field?
   │   ├── YES → Is Date.now() > expires?
   │   │         ├── YES → Remove from storage, return null (expired)
   │   │         └── NO  → Continue
   │   └── NO  → Continue
   ↓
4️⃣ Returns the stored value
   ↓
5️⃣ setValue(todos, loadedValue):
   └── todos is a collection → calls todos.reset(loadedValue)
   ↓
6️⃣ State is restored ✅
```

---

## How Different State Types Are Saved and Loaded

### Reactive State

```javascript
const state = ReactiveUtils.state({ name: 'Alice', age: 30 });
ReactiveUtils.autoSave(state, 'user');

// Saved: { name: 'Alice', age: 30 }
// Loaded: Object.assign(state, savedValue)
```

### Ref

```javascript
const count = ReactiveUtils.ref(0);
ReactiveUtils.autoSave(count, 'counter');

// Saved: 0 (the .value)
// Loaded: count.value = savedValue
```

### Collection

```javascript
const todos = Collections.create([]);
ReactiveUtils.autoSave(todos, 'todos');

// Saved: [...items]
// Loaded: todos.reset(savedItems)
```

### Form

```javascript
const form = Forms.create({ name: '', email: '' });
ReactiveUtils.autoSave(form, 'draft');

// Saved: { values: {...}, errors: {...}, touched: {...} }
// Loaded: Object.assign(form.values, saved.values), etc.
```

---

## The Save Throttle

To prevent excessive writes, saves are throttled to a minimum of 100ms apart:

```
state.x = 1;  // Save! (first save)
state.y = 2;  // Save attempted, but < 100ms → skipped
state.z = 3;  // Save attempted, but < 100ms → skipped

... 100ms pass ...

state.w = 4;  // Save! (enough time has passed)
```

This is separate from the `debounce` option. The throttle is always active as a safety net.

---

## The Flush on Unload

If the user closes the tab while a debounced save is pending, `autoSave` registers a `beforeunload` handler to flush it:

```
User closes tab
   ↓
beforeunload event fires
   ↓
Is there a pending debounced save? (saveTimeout exists?)
├── YES → Clear timeout, save immediately
└── NO  → Nothing to do
```

This ensures that the very last state change is always persisted, even with debouncing.

---

## Common Mistakes

### ❌ Calling autoSave before the state is set up

```javascript
// ❌ autoSave loads data IMMEDIATELY — so set up your state first
const state = ReactiveUtils.state({});
ReactiveUtils.autoSave(state, 'data');
// Loaded data may have keys that weren't in the initial state

// ✅ Define all expected keys upfront
const state = ReactiveUtils.state({ name: '', email: '', theme: 'dark' });
ReactiveUtils.autoSave(state, 'data');
```

### ❌ Using the same key for different states

```javascript
// ❌ Both states overwrite each other's data
ReactiveUtils.autoSave(settings, 'app-data');
ReactiveUtils.autoSave(todos, 'app-data');  // Same key!

// ✅ Use unique keys
ReactiveUtils.autoSave(settings, 'settings');
ReactiveUtils.autoSave(todos, 'todos');

// ✅ Or use namespaces
ReactiveUtils.autoSave(settings, 'settings', { namespace: 'myApp' });
ReactiveUtils.autoSave(todos, 'todos', { namespace: 'myApp' });
// Stored as: 'myApp:settings' and 'myApp:todos'
```

### ❌ Storing non-serializable data

```javascript
// ❌ Functions, DOM elements, and class instances can't be JSON-serialized
const state = ReactiveUtils.state({
  handler: () => console.log('hi'),  // Function — can't serialize
  element: document.body              // DOM node — can't serialize
});
ReactiveUtils.autoSave(state, 'data');

// ✅ Only store plain, serializable data
const state = ReactiveUtils.state({
  name: 'Alice',
  score: 100,
  tags: ['js', 'css']
});
```

### ❌ Forgetting to call $destroy when removing dynamic components

```javascript
// ❌ Event listeners and effects leak
function createWidget() {
  const state = ReactiveUtils.state({ count: 0 });
  ReactiveUtils.autoSave(state, 'widget');
  return state;
}
// Widget is removed, but the effect and listeners are still active

// ✅ Call $destroy when done
function createWidget() {
  const state = ReactiveUtils.state({ count: 0 });
  ReactiveUtils.autoSave(state, 'widget');
  return state;
}

const widget = createWidget();
// Later, when removing:
widget.$destroy();  // Cleans up effect, storage listener, unload listener
```

---

## Key Takeaways

1. **Auto-load happens first** — saved data is restored before any effects run
2. **Auto-save uses an effect** — reading the state inside the effect triggers dependency tracking
3. **getValue/setValue** detect the state type (ref, collection, form, state) automatically
4. **Save throttle** — minimum 100ms between saves as a safety net
5. **Flush on unload** — pending debounced saves are flushed when the tab closes
6. **StorageWrapper** wraps data with `{ value, timestamp, expires }` for expiration support
7. **Methods added** — `$save`, `$load`, `$clear`, `$exists`, `$destroy`, etc.

---

## What's next?

Let's explore all the options, methods, and production hardening features of autoSave.

Let's continue!