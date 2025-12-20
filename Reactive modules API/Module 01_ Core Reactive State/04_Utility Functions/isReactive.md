# Understanding `isReactive()` - A Beginner's Guide

## What is `isReactive()`?

`isReactive()` is a **type-checking utility function** in the Reactive library that checks if a value is a reactive state object. It returns `true` if the value is reactive, `false` otherwise.

Think of it as **asking "is this reactive?"** - useful for type guards, conditional logic, and debugging.

---

## Syntax

```js
// Using the shortcut
const result = isReactive(value)

// Using the full namespace
const result = ReactiveUtils.isReactive(value)
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`isReactive()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.isReactive()`) - Explicit and clear

**Parameters:**
- `value` (Any): Value to check

**Returns:**
- `true` if reactive, `false` otherwise

---

## Basic Usage

### Checking Reactive State

```js
// Using the shortcut style
const reactive = state({ count: 0 });
const plain = { count: 0 };

console.log(isReactive(reactive)); // true
console.log(isReactive(plain));    // false

// Or using the namespace style
console.log(ReactiveUtils.isReactive(reactive)); // true
```

### Checking Primitives

```js
console.log(isReactive(123));        // false
console.log(isReactive('hello'));    // false
console.log(isReactive(true));       // false
console.log(isReactive(null));       // false
console.log(isReactive(undefined));  // false
```

### Checking Refs

```js
const count = ref(0);
const items = refs({ a: 1, b: 2 });

console.log(isReactive(count));  // true
console.log(isReactive(items));  // true
```

---

## Common Use Cases

### Use Case 1: Type Guards

```js
function processData(data) {
  if (isReactive(data)) {
    // It's reactive - use reactive methods
    data.$computed('total', function() {
      return this.items.reduce((sum, item) => sum + item.value, 0);
    });
  } else {
    // Plain object - convert to reactive
    data = state(data);
  }

  return data;
}

const myData = { items: [] };
const reactiveData = processData(myData);
```

### Use Case 2: Conditional Updates

```js
function updateValue(obj, key, value) {
  if (isReactive(obj)) {
    // Reactive - use reactive assignment
    obj[key] = value;
  } else {
    // Plain - use Object.assign
    Object.assign(obj, { [key]: value });
  }
}

updateValue(reactiveState, 'count', 10);
updateValue(plainObject, 'count', 10);
```

### Use Case 3: Debugging

```js
function debugState(label, value) {
  console.log(`[${label}]`, {
    type: isReactive(value) ? 'reactive' : 'plain',
    value: isReactive(value) ? toRaw(value) : value
  });
}

debugState('User State', userState);
// [User State] { type: 'reactive', value: { name: 'John' } }

debugState('Config', config);
// [Config] { type: 'plain', value: { theme: 'light' } }
```

### Use Case 4: API Integration

```js
async function saveToAPI(data) {
  // Convert to plain object if reactive
  const payload = isReactive(data) ? toRaw(data) : data;

  const response = await fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return response.json();
}

saveToAPI(reactiveState); // Converts to plain
saveToAPI(plainObject);   // Uses as-is
```

### Use Case 5: Library Integration

```js
function createViewModel(data) {
  // Ensure we have reactive state
  if (!isReactive(data)) {
    console.warn('Creating reactive wrapper for plain object');
    data = state(data);
  }

  // Add view model methods
  data.$computed('displayName', function() {
    return `${this.firstName} ${this.lastName}`;
  });

  return data;
}

const vm1 = createViewModel(state({ firstName: 'John' }));
const vm2 = createViewModel({ firstName: 'Jane' }); // Wrapped automatically
```

---

## Advanced Patterns

### Pattern 1: Nested Check

```js
function isDeepReactive(obj) {
  if (!isReactive(obj)) return false;

  const raw = toRaw(obj);
  return Object.values(raw).every(value => {
    if (typeof value === 'object' && value !== null) {
      return isReactive(value);
    }
    return true;
  });
}

const shallow = state({ nested: { value: 1 } });
const deep = state({ nested: state({ value: 1 }) });

console.log(isDeepReactive(shallow)); // false
console.log(isDeepReactive(deep));    // true
```

### Pattern 2: Type-Safe Wrapper

```js
function ensureReactive(data) {
  return isReactive(data) ? data : state(data);
}

function ensurePlain(data) {
  return isReactive(data) ? toRaw(data) : data;
}

const data = { count: 0 };
const reactiveData = ensureReactive(data);
const plainData = ensurePlain(reactiveData);
```

### Pattern 3: Validation

```js
function validateStateObject(obj, name) {
  if (!isReactive(obj)) {
    throw new Error(`${name} must be a reactive state object`);
  }

  if (!obj.id || !obj.name) {
    throw new Error(`${name} must have id and name properties`);
  }

  return true;
}

try {
  validateStateObject(userState, 'userState');
  console.log('Valid state object');
} catch (error) {
  console.error(error.message);
}
```

---

## Performance Tips

### Tip 1: Cache Results

```js
// Cache the check if used frequently
const IS_REACTIVE = isReactive(data);

if (IS_REACTIVE) {
  // Use reactive methods
} else {
  // Use plain methods
}
```

### Tip 2: Early Returns

```js
function processIfReactive(data, fn) {
  if (!isReactive(data)) return;
  fn(data);
}

processIfReactive(state, (s) => {
  s.count++;
});
```

---

## Common Pitfalls

### Pitfall 1: Checking After Conversion

```js
// WRONG - always false
const data = toRaw(reactiveState);
console.log(isReactive(data)); // false

// RIGHT - check before conversion
console.log(isReactive(reactiveState)); // true
```

### Pitfall 2: Assuming Arrays

```js
// WRONG - arrays are objects
const arr = [1, 2, 3];
console.log(isReactive(arr)); // false

// RIGHT - check reactive arrays
const reactiveArr = state({ items: [1, 2, 3] });
console.log(isReactive(reactiveArr)); // true
```

---

## Summary

**`isReactive()` checks if a value is a reactive state object.**

Key takeaways:
- ✅ **Type checking** utility
- ✅ Both **shortcut** (`isReactive()`) and **namespace** (`ReactiveUtils.isReactive()`) styles are valid
- ✅ Returns **boolean** (true/false)
- ✅ Works with **state**, **refs**, and **reactive objects**
- ✅ Great for **type guards** and **conditional logic**
- ⚠️ Returns `false` for **primitives** and **plain objects**
- ⚠️ Returns `false` for **raw values** from `toRaw()`

**Remember:** Use `isReactive()` to check if you're working with reactive state before using reactive-specific methods! 🎉

➡️ Next, explore [`toRaw()`](toRaw.md) to extract plain values or [`state()`](state.md) to create reactive state!
