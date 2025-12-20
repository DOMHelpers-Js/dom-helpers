# Understanding `toRaw()` - A Beginner's Guide

## What is `toRaw()`?

`toRaw()` is a **conversion utility function** in the Reactive library that extracts the raw, non-reactive value from a reactive state object. It returns the underlying plain JavaScript object without any reactive proxies.

Think of it as **unwrapping the reactive layer** - useful for serialization, API calls, comparisons, and cloning.

---

## Syntax

```js
// Using the shortcut
const rawValue = toRaw(reactiveValue)

// Using the full namespace
const rawValue = ReactiveUtils.toRaw(reactiveValue)
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`toRaw()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.toRaw()`) - Explicit and clear

**Parameters:**
- `value` (Any): Value to extract raw data from

**Returns:**
- Raw, non-reactive value (or original value if not reactive)

---

## Basic Usage

### Extracting Raw Values

```js
// Using the shortcut style
const user = state({
  name: 'John',
  email: 'john@example.com'
});

const rawUser = toRaw(user);

console.log(isReactive(user));    // true
console.log(isReactive(rawUser)); // false
console.log(rawUser);            // { name: 'John', email: 'john@example.com' }

// Or using the namespace style
const rawUser2 = ReactiveUtils.toRaw(user);
```

### Non-Reactive Values

```js
// Non-reactive values return as-is
console.log(toRaw(123));        // 123
console.log(toRaw('hello'));    // 'hello'
console.log(toRaw({ a: 1 }));   // { a: 1 }
console.log(toRaw(null));       // null
```

### Nested Objects

```js
const app = state({
  user: {
    name: 'John',
    profile: { age: 25 }
  }
});

const raw = toRaw(app);
console.log(raw.user.name); // 'John'
```

---

## Common Use Cases

### Use Case 1: API Requests

```js
const form = state({
  username: 'john',
  email: 'john@example.com',
  password: 'secret123'
});

async function submitForm() {
  // Convert to plain object for API
  const rawData = toRaw(form);

  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rawData) // Plain object, not proxy
  });

  return response.json();
}
```

### Use Case 2: localStorage

```js
const settings = state({
  theme: 'light',
  language: 'en',
  notifications: true
});

function saveSettings() {
  const rawSettings = toRaw(settings);
  localStorage.setItem('settings', JSON.stringify(rawSettings));
}

function loadSettings() {
  const saved = localStorage.getItem('settings');
  if (saved) {
    const rawSettings = JSON.parse(saved);
    Object.assign(settings, rawSettings);
  }
}
```

### Use Case 3: Deep Cloning

```js
const original = state({
  items: [1, 2, 3],
  nested: { value: 42 }
});

// Deep clone the raw data
const cloned = state(
  JSON.parse(JSON.stringify(toRaw(original)))
);

// Independent copies
cloned.items.push(4);
console.log(original.items); // [1, 2, 3]
console.log(cloned.items);   // [1, 2, 3, 4]
```

### Use Case 4: Comparison

```js
const state1 = state({ name: 'John', age: 25 });
const state2 = state({ name: 'John', age: 25 });

// Proxies are different
console.log(state1 === state2); // false

// Compare raw values
const raw1 = toRaw(state1);
const raw2 = toRaw(state2);
console.log(JSON.stringify(raw1) === JSON.stringify(raw2)); // true
```

### Use Case 5: Third-Party Libraries

```js
const chartData = state({
  labels: ['Jan', 'Feb', 'Mar'],
  values: [10, 20, 30]
});

function renderChart() {
  // Some chart libraries don't work with proxies
  const rawData = toRaw(chartData);

  new Chart(ctx, {
    type: 'line',
    data: rawData // Use raw data
  });
}
```

---

## Advanced Patterns

### Pattern 1: Snapshot Creation

```js
function createSnapshot(state) {
  return JSON.parse(JSON.stringify(toRaw(state)));
}

const app = state({ count: 0 });
const snapshot1 = createSnapshot(app);

app.count = 10;
const snapshot2 = createSnapshot(app);

console.log(snapshot1.count); // 0
console.log(snapshot2.count); // 10
```

### Pattern 2: Conditional Conversion

```js
function ensurePlain(value) {
  return isReactive(value) ? toRaw(value) : value;
}

function serialize(data) {
  const plain = ensurePlain(data);
  return JSON.stringify(plain);
}

serialize(reactiveState); // Works
serialize(plainObject);   // Works
```

### Pattern 3: Debug Helper

```js
function debugCompare(label, reactive) {
  console.log(`[${label}]`);
  console.log('Reactive:', reactive);
  console.log('Raw:', toRaw(reactive));
  console.log('Is Reactive:', isReactive(reactive));
  console.log('Raw Is Reactive:', isReactive(toRaw(reactive)));
}

debugCompare('User State', userState);
```

---

## Performance Tips

### Tip 1: Cache Raw Values

```js
// If used multiple times, cache it
const rawData = toRaw(state);

sendToAPI(rawData);
saveToLocalStorage(rawData);
logData(rawData);
```

### Tip 2: Use for Serialization Only

```js
// GOOD - use for serialization
const json = JSON.stringify(toRaw(state));

// BAD - don't use raw for updates
const raw = toRaw(state);
raw.count = 10; // Won't trigger reactivity!
```

---

## Common Pitfalls

### Pitfall 1: Modifying Raw Values

```js
// WRONG - modifying raw doesn't trigger reactivity
const raw = toRaw(state);
raw.count = 10; // No reactivity!

// RIGHT - modify the reactive state
state.count = 10; // Triggers reactivity
```

### Pitfall 2: Assuming Deep Conversion

```js
const state = state({
  nested: state({ value: 1 })
});

const raw = toRaw(state);
console.log(isReactive(raw.nested)); // Still true!

// Need to convert nested too
const deepRaw = JSON.parse(JSON.stringify(toRaw(state)));
```

### Pitfall 3: Losing Reactivity

```js
// WRONG - replacing with raw
state = toRaw(state); // Lost reactivity!

// RIGHT - keep reactive, use raw only for output
const output = toRaw(state);
sendToAPI(output);
```

---

## Summary

**`toRaw()` extracts plain values from reactive state.**

Key takeaways:
- ✅ **Extracts raw values** from reactive state
- ✅ Both **shortcut** (`toRaw()`) and **namespace** (`ReactiveUtils.toRaw()`) styles are valid
- ✅ Returns **plain JavaScript** objects
- ✅ Perfect for **API calls**, **serialization**, **localStorage**
- ✅ Use for **comparisons** and **cloning**
- ⚠️ Don't **modify** raw values - they're not reactive
- ⚠️ Returns original value if **not reactive**
- ⚠️ Nested reactive objects **stay reactive** unless deep converted

**Remember:** Use `toRaw()` when you need plain JavaScript values for APIs, storage, or external libraries! 🎉

➡️ Next, explore [`isReactive()`](isReactive.md) to check reactive status or [`state()`](state.md) to create reactive state!
