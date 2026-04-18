[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Deep Reactivity for Map and Set

## What is This?

The enhancements module automatically wraps `Map` and `Set` properties inside reactive state with **reactive proxies**. This means that when you call `.set()`, `.add()`, `.delete()`, or `.clear()` on a Map or Set inside your state, reactive effects re-run automatically.

---

## The Challenge Without This Enhancement

Without the enhancement, Map and Set mutations are invisible to the reactive system:

```javascript
// Without enhancements:
const state = ReactiveUtils.state({
  users: new Map()
});

ReactiveUtils.effect(() => {
  console.log('Map size:', state.users.size);
});
// Logs: "Map size: 0"

state.users.set('alice', { name: 'Alice' });
// Nothing happens — the effect doesn't re-run
// The Map changed, but the reactive system didn't notice
```

**Why?** The reactive proxy tracks property assignments (`state.users = newMap`), but calling a method on an existing object (`state.users.set(...)`) doesn't trigger the proxy's set trap — it's just a method call on the same reference.

---

## The Enhancement

After the enhancements module loads, Map and Set properties are wrapped in reactive proxies:

```javascript
// With enhancements:
const state = ReactiveUtils.state({
  users: new Map()
});

ReactiveUtils.effect(() => {
  console.log('Map size:', state.users.size);
});
// Logs: "Map size: 0"

state.users.set('alice', { name: 'Alice' });
// Logs: "Map size: 1" ✅ — the effect re-ran!

state.users.delete('alice');
// Logs: "Map size: 0" ✅
```

---

## How It Works

When `ReactiveUtils.state()` detects a Map or Set property, it wraps it in a reactive proxy:

```
ReactiveUtils.state({ users: new Map(), tags: new Set() })
   ↓
1️⃣ Creates the reactive state (normal)
   ↓
2️⃣ Scans properties:
   ├── users is a Map → wrap with createReactiveMap()
   └── tags is a Set  → wrap with createReactiveSet()
   ↓
3️⃣ Wrapped versions intercept mutations:
   ├── .set()/.add()    → mutation + triggerUpdate()
   ├── .delete()        → mutation + triggerUpdate()
   └── .clear()         → mutation + triggerUpdate()
   ↓
4️⃣ triggerUpdate() calls state.$notify(key)
   ↓
5️⃣ Effects that depend on that key re-run
```

---

## Reactive Map

All standard Map methods work, and mutations trigger reactive effects:

### Setting and Getting Values

```javascript
const state = ReactiveUtils.state({
  settings: new Map([['theme', 'dark'], ['lang', 'en']])
});

ReactiveUtils.effect(() => {
  console.log('Theme:', state.settings.get('theme'));
});
// Logs: "Theme: dark"

state.settings.set('theme', 'light');
// Logs: "Theme: light" ✅
```

### Deleting Values

```javascript
state.settings.delete('lang');
// Effect re-runs if it depends on the Map
```

### Clearing the Map

```javascript
state.settings.clear();
// Effect re-runs
```

### Checking Size

```javascript
ReactiveUtils.effect(() => {
  console.log('Settings count:', state.settings.size);
});

state.settings.set('new-key', 'value');
// Logs: "Settings count: ..." ✅
```

### Iterating

```javascript
ReactiveUtils.effect(() => {
  state.settings.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
});

// Iteration methods available:
state.settings.keys();      // Iterator of keys
state.settings.values();    // Iterator of values
state.settings.entries();   // Iterator of [key, value] pairs
state.settings.forEach(fn); // ForEach loop
```

### Checking for Keys

```javascript
console.log(state.settings.has('theme'));  // true or false
```

---

## Reactive Set

All standard Set methods work, and mutations trigger reactive effects:

### Adding and Checking Values

```javascript
const state = ReactiveUtils.state({
  tags: new Set(['javascript', 'css'])
});

ReactiveUtils.effect(() => {
  console.log('Tags:', [...state.tags.values()].join(', '));
});
// Logs: "Tags: javascript, css"

state.tags.add('html');
// Logs: "Tags: javascript, css, html" ✅
```

### Smart Triggering

The reactive Set only triggers effects when something actually changes:

```javascript
state.tags.add('javascript');
// Does NOT trigger — 'javascript' already exists in the Set
// Set.add() with a duplicate is a no-op, so no notification
```

Similarly for `.delete()`:

```javascript
state.tags.delete('nonexistent');
// Does NOT trigger — nothing was actually removed
```

### Deleting Values

```javascript
state.tags.delete('css');
// Effect re-runs ✅ (something was actually removed)
```

### Clearing the Set

```javascript
state.tags.clear();
// Effect re-runs ✅ (if the Set had items)
```

### Checking Size and Membership

```javascript
console.log(state.tags.size);          // Number of items
console.log(state.tags.has('html'));    // true or false
```

### Iterating

```javascript
state.tags.forEach(tag => console.log(tag));

// Iteration methods:
state.tags.keys();      // Same as values() for Sets
state.tags.values();    // Iterator of values
state.tags.entries();   // Iterator of [value, value] pairs
```

---

## Accessing the Raw Collection

Both reactive Map and Set expose a `RAW` symbol to access the original, unwrapped collection:

```javascript
const RAW = Symbol('raw');  // internal symbol

// To access the raw Map:
const rawMap = state.settings[RAW];

// To check if something is reactive:
const IS_REACTIVE = Symbol('reactive');
console.log(state.settings[IS_REACTIVE]);  // true
```

In practice you rarely need the raw version, but it's available if you need to pass the collection to a library that doesn't work with proxies.

---

## What Triggers and What Doesn't

### Reactive Map

| Method | Triggers effects? | Condition |
|--------|-------------------|-----------|
| `.set(key, value)` | ✅ Yes | Always |
| `.delete(key)` | ✅ Yes | Only if the key existed |
| `.clear()` | ✅ Yes | Only if the Map had items |
| `.get(key)` | ❌ No | Read-only |
| `.has(key)` | ❌ No | Read-only |
| `.size` | ❌ No (reads) | Read-only, but triggers tracking |
| `.forEach()` | ❌ No | Read-only |
| `.keys()` / `.values()` / `.entries()` | ❌ No | Read-only |

### Reactive Set

| Method | Triggers effects? | Condition |
|--------|-------------------|-----------|
| `.add(value)` | ✅ Yes | Only if the value didn't exist |
| `.delete(value)` | ✅ Yes | Only if the value existed |
| `.clear()` | ✅ Yes | Only if the Set had items |
| `.has(value)` | ❌ No | Read-only |
| `.size` | ❌ No (reads) | Read-only, but triggers tracking |
| `.forEach()` | ❌ No | Read-only |
| `.keys()` / `.values()` / `.entries()` | ❌ No | Read-only |

---

## Practical Example: User Permissions

```javascript
const state = ReactiveUtils.state({
  permissions: new Set(['read'])
});

ReactiveUtils.effect(() => {
  const canEdit = state.permissions.has('write');
  const canDelete = state.permissions.has('delete');

  document.getElementById('editBtn').disabled = !canEdit;
  document.getElementById('deleteBtn').disabled = !canDelete;
});

// Grant write permission
state.permissions.add('write');
// Effect re-runs → edit button enabled ✅

// Revoke write permission
state.permissions.delete('write');
// Effect re-runs → edit button disabled ✅
```

---

## Practical Example: Cache with Map

```javascript
const state = ReactiveUtils.state({
  cache: new Map()
});

ReactiveUtils.effect(() => {
  console.log('Cache entries:', state.cache.size);
});

async function fetchUser(id) {
  if (state.cache.has(id)) {
    return state.cache.get(id);
  }

  const response = await fetch(`/api/users/${id}`);
  const user = await response.json();
  state.cache.set(id, user);  // Effect re-runs → cache count updated
  return user;
}
```

---

## Common Mistakes

### ❌ Expecting reactivity for Maps/Sets created after state

```javascript
const state = ReactiveUtils.state({ data: {} });

// ❌ This Map was NOT in the initial state — it won't be reactive
state.data = new Map();
state.data.set('key', 'value');  // Won't trigger effects

// ✅ Include Maps and Sets in the initial state
const state = ReactiveUtils.state({
  data: new Map()
});
state.data.set('key', 'value');  // Triggers effects ✅
```

The enhancement scans properties at creation time. Maps and Sets added later won't be wrapped automatically.

### ❌ Replacing the entire Map instead of mutating it

```javascript
// ❌ This replaces the reactive proxy with a plain Map
state.settings = new Map([['theme', 'light']]);
// The new Map is NOT reactive!

// ✅ Mutate the existing reactive Map
state.settings.clear();
state.settings.set('theme', 'light');
```

---

## Key Takeaways

1. **Map and Set mutations** (`.set()`, `.add()`, `.delete()`, `.clear()`) now trigger reactive effects
2. **Include Map/Set in initial state** — they're wrapped at creation time
3. **Smart triggering** — only notifies when something actually changes (e.g., adding a duplicate to a Set is a no-op)
4. **All read methods work** — `.get()`, `.has()`, `.size`, iteration all function normally
5. **triggerUpdate** calls `state.$notify(key)` to re-run dependent effects

---

## What's next?

Let's explore enhanced computed properties with caching and circular dependency detection, plus error boundaries for production safety.

Let's continue!