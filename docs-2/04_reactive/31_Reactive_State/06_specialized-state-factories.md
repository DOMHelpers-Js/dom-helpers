[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Specialized State Factories

The reactive module provides purpose-built factories for common patterns. Instead of manually setting up state + computed + methods every time, these give you a ready-to-use reactive object for a specific use case.

---

## Quick comparison

| Factory | What it creates | Built-in properties | Built-in methods |
|---------|----------------|--------------------|--------------------|
| `ref()` | Single value wrapper | `.value` | `.valueOf()`, `.toString()` |
| `collection()` | Reactive list | `.items` | `$add`, `$remove`, `$update`, `$clear` |
| `form()` | Form state | `.values`, `.errors`, `.touched`, `.isSubmitting` | `$setValue`, `$setError`, `$reset` |
| `async()` | Async operation state | `.data`, `.loading`, `.error` | `$execute`, `$reset` |

---

## ref() — Single reactive value

### What is it?

`ref()` wraps a single value in a reactive container. The value is accessed through `.value`.

### Syntax

```javascript
const count = ReactiveUtils.ref(0);

console.log(count.value);  // 0
count.value = 5;           // Triggers effects
```

### Why use it?

Reactive state requires an object. When you only need a **single value**, `ref()` provides a clean wrapper:

```javascript
// Without ref — need an object with a named property
const state = ReactiveUtils.state({ count: 0 });
state.count++;

// With ref — clean single-value container
const count = ReactiveUtils.ref(0);
count.value++;
```

### With effects

```javascript
const count = ReactiveUtils.ref(0);

ReactiveUtils.effect(() => {
  document.getElementById('counter').textContent = count.value;
});

count.value = 42;  // Counter updates automatically
```

### valueOf() and toString()

`ref()` adds `.valueOf()` and `.toString()` so the ref can be used in expressions:

```javascript
const count = ReactiveUtils.ref(10);

console.log(count + 5);       // 15 (valueOf returns count.value)
console.log(`Count: ${count}`); // "Count: 10" (toString returns String(count.value))
```

### Creating multiple refs

```javascript
const refs = ReactiveUtils.refs({
  count: 0,
  name: 'Alice',
  isActive: true
});

console.log(refs.count.value);     // 0
console.log(refs.name.value);      // 'Alice'
console.log(refs.isActive.value);  // true

refs.count.value = 5;  // Triggers effects watching refs.count
```

---

## collection() — Reactive lists

### What is it?

`collection()` creates a reactive list with built-in methods for adding, removing, updating, and clearing items.

### Syntax

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Learn Reactive', done: false },
  { id: 2, text: 'Build app', done: false }
]);
```

### The items property

Items are stored in `.items`:

```javascript
console.log(todos.items);         // [{ id: 1, ... }, { id: 2, ... }]
console.log(todos.items.length);  // 2
console.log(todos.items[0].text); // 'Learn Reactive'
```

### $add() — Add an item

```javascript
todos.$add({ id: 3, text: 'Deploy', done: false });
console.log(todos.items.length);  // 3
```

### $remove() — Remove an item

By reference:
```javascript
const item = todos.items[0];
todos.$remove(item);
```

By predicate function:
```javascript
todos.$remove(item => item.id === 2);
```

### $update() — Update an item

By reference:
```javascript
const item = todos.items[0];
todos.$update(item, { done: true });
```

By predicate function:
```javascript
todos.$update(
  item => item.id === 1,
  { done: true, text: 'Learn Reactive (done!)' }
);
```

### $clear() — Remove all items

```javascript
todos.$clear();
console.log(todos.items.length);  // 0
```

### Complete example

```javascript
const todos = ReactiveUtils.collection();

// Add items
todos.$add({ id: 1, text: 'Buy groceries', done: false });
todos.$add({ id: 2, text: 'Clean house', done: false });
todos.$add({ id: 3, text: 'Walk dog', done: false });

// Mark one as done
todos.$update(item => item.id === 2, { done: true });

// Remove completed
todos.$remove(item => item.done);

// Clear all
todos.$clear();
```

### Also available as `list()`

```javascript
const items = ReactiveUtils.list();  // Same as collection()
```

---

## form() — Form state management

### What is it?

`form()` creates a reactive state pre-configured for form handling — with values, errors, touched fields, and validation tracking.

### Syntax

```javascript
const loginForm = ReactiveUtils.form({
  email: '',
  password: ''
});
```

### What you get

```javascript
console.log(loginForm.values);       // { email: '', password: '' }
console.log(loginForm.errors);       // {}
console.log(loginForm.touched);      // {}
console.log(loginForm.isSubmitting); // false
console.log(loginForm.isValid);      // true (computed — no errors)
console.log(loginForm.isDirty);      // false (computed — no touched fields)
```

### $setValue() — Set a field value

```javascript
loginForm.$setValue('email', 'alice@example.com');

console.log(loginForm.values.email);    // 'alice@example.com'
console.log(loginForm.touched.email);   // true (auto-marked)
console.log(loginForm.isDirty);         // true (has touched fields)
```

### $setError() — Set or clear an error

```javascript
// Set an error
loginForm.$setError('email', 'Invalid email address');
console.log(loginForm.errors.email);  // 'Invalid email address'
console.log(loginForm.isValid);       // false

// Clear an error
loginForm.$setError('email', null);
console.log(loginForm.errors.email);  // undefined
console.log(loginForm.isValid);       // true
```

### $reset() — Reset the form

```javascript
// Reset to initial values
loginForm.$reset();
console.log(loginForm.values);   // { email: '', password: '' }
console.log(loginForm.errors);   // {}
console.log(loginForm.touched);  // {}

// Reset to new values
loginForm.$reset({ email: 'new@example.com', password: '' });
```

### Computed properties

The form comes with two computed properties:

- **isValid** — `true` when there are no errors (or all errors are falsy)
- **isDirty** — `true` when at least one field has been touched

```javascript
ReactiveUtils.effect(() => {
  document.getElementById('submitBtn').disabled = !loginForm.isValid;
});
```

### Complete form example

```javascript
const signupForm = ReactiveUtils.form({
  name: '',
  email: '',
  password: ''
});

// Validation
function validate() {
  if (!signupForm.values.name) {
    signupForm.$setError('name', 'Name is required');
  } else {
    signupForm.$setError('name', null);
  }

  if (!signupForm.values.email.includes('@')) {
    signupForm.$setError('email', 'Invalid email');
  } else {
    signupForm.$setError('email', null);
  }

  if (signupForm.values.password.length < 8) {
    signupForm.$setError('password', 'Must be 8+ characters');
  } else {
    signupForm.$setError('password', null);
  }
}

// React to validation state
ReactiveUtils.effect(() => {
  document.getElementById('submitBtn').disabled =
    !signupForm.isValid || signupForm.isSubmitting;
});
```

---

## async() — Async operation state

### What is it?

`async()` creates a reactive state for managing asynchronous operations — with loading, error, and data tracking built in.

### Syntax

```javascript
const users = ReactiveUtils.async();
// Or with an initial value:
const users = ReactiveUtils.async([]);
```

### What you get

```javascript
console.log(users.data);       // null (or your initial value)
console.log(users.loading);    // false
console.log(users.error);      // null
console.log(users.isSuccess);  // false (computed)
console.log(users.isError);    // false (computed)
```

### $execute() — Run an async operation

```javascript
await users.$execute(async () => {
  const response = await fetch('/api/users');
  return response.json();
});

console.log(users.data);       // [{ id: 1, name: 'Alice' }, ...]
console.log(users.loading);    // false
console.log(users.isSuccess);  // true
```

### What $execute() does automatically

```
users.$execute(asyncFn)
   ↓
1️⃣ Set loading = true
   ↓
2️⃣ Set error = null
   ↓
3️⃣ Run the async function
   ├── Success → data = result
   └── Error → error = exception (re-throws)
   ↓
4️⃣ Set loading = false (always, via finally)
```

### $reset() — Reset to initial state

```javascript
users.$reset();
console.log(users.data);     // null (or initial value)
console.log(users.loading);  // false
console.log(users.error);    // null
```

### Computed properties

- **isSuccess** — `true` when not loading, no error, and data is not null
- **isError** — `true` when not loading and error is not null

### Complete async example

```javascript
const userList = ReactiveUtils.async([]);

// Keep UI in sync with loading state
ReactiveUtils.effect(() => {
  const spinner = document.getElementById('spinner');
  const content = document.getElementById('content');
  const errorMsg = document.getElementById('error');

  spinner.style.display = userList.loading ? 'block' : 'none';
  content.style.display = userList.isSuccess ? 'block' : 'none';
  errorMsg.style.display = userList.isError ? 'block' : 'none';

  if (userList.isError) {
    errorMsg.textContent = userList.error.message;
  }
});

// Fetch users
document.getElementById('loadBtn').addEventListener('click', async () => {
  try {
    await userList.$execute(async () => {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to load');
      return res.json();
    });
  } catch (e) {
    console.log('Failed:', e.message);
  }
});

// Retry button
document.getElementById('retryBtn').addEventListener('click', () => {
  userList.$reset();
});
```

---

## Key takeaways

1. **ref()** — single reactive value with `.value`, good for counters, flags, selections
2. **collection()** — reactive list with `$add`, `$remove`, `$update`, `$clear`
3. **form()** — form state with values, errors, touched, computed `isValid` and `isDirty`
4. **async()** — async state with data, loading, error, computed `isSuccess` and `isError`
5. All factories return **reactive objects** — they work with effects, watchers, and computed
6. Each factory provides **purpose-built methods** so you don't have to write boilerplate

---

## What's next?

Now let's explore the higher-level architecture tools:
- `store()` for state + getters + actions
- `component()` for full component definition
- `reactive()` for the chainable builder pattern

Let's continue!