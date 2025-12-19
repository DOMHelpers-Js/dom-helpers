# DOM Helpers - Reactive Utilities Shortcut API v1.0.0

## 📚 Complete Standalone API Documentation

---

## 🎯 Overview

The **Reactive Utilities Shortcut Module** provides simplified function calls without namespace prefixes, making reactive state management more convenient and readable. Instead of writing `ReactiveUtils.state({})`, you can simply write `state({})`.

**Key Benefits:**
- ✨ Cleaner, more concise syntax
- 🚀 Faster development workflow
- 📝 Less verbose code
- 🎨 More readable reactive patterns

**Requirements:**
- Must be loaded **AFTER** all reactive modules
- ReactiveUtils must be available in the global scope

---

## 🔄 Before & After Comparison

```javascript
// ❌ BEFORE (with ReactiveUtils namespace)
const myState = ReactiveUtils.state({ count: 0 });
const myRef = ReactiveUtils.ref(0);
ReactiveUtils.effect(() => console.log(myState.count));
ReactiveUtils.computed(myState, { double() { return this.count * 2; } });

// ✅ AFTER (with shortcut API)
const myState = state({ count: 0 });
const myRef = ref(0);
effect(() => console.log(myState.count));
computed(myState, { double() { return this.count * 2; } });
```

---

## 📦 Available Methods by Category

### 🎯 Core State Methods (5 methods)

### 1. **state(initialState)**
Creates a reactive state object.

```javascript
// Before
const myState = ReactiveUtils.state({ count: 0, name: "John" });

// After
const myState = state({ count: 0, name: "John" });

myState.count = 5;
console.log(myState.count);  // 5
```

### 2. **createState(initialState, bindingDefs)**
Creates reactive state with automatic DOM bindings.

```javascript
// Before
const myState = ReactiveUtils.createState(
  { count: 0 },
  { '#counter': 'count' }
);

// After
const myState = createState(
  { count: 0 },
  { '#counter': 'count' }
);

myState.count = 10;  // #counter automatically updates
```

### 3. **effect(fn)**
Creates an effect that runs when dependencies change.

```javascript
// Before
const stop = ReactiveUtils.effect(() => {
  console.log('Count:', myState.count);
});

// After
const stop = effect(() => {
  console.log('Count:', myState.count);
});

myState.count = 5;  // Effect runs
stop();  // Stop the effect
```

### 4. **batch(fn)**
Batches multiple updates into a single update cycle.

```javascript
// Before
ReactiveUtils.batch(() => {
  myState.x = 10;
  myState.y = 20;
  myState.z = 30;
});

// After
batch(() => {
  myState.x = 10;
  myState.y = 20;
  myState.z = 30;
});
```

### 5. **bindings(definitions)**
Creates reactive DOM bindings.

```javascript
// Before
const unbind = ReactiveUtils.bindings({
  '#counter': () => myState.count,
  '.status': {
    textContent: () => `Count: ${myState.count}`
  }
});

// After
const unbind = bindings({
  '#counter': () => myState.count,
  '.status': {
    textContent: () => `Count: ${myState.count}`
  }
});
```

---

### 🧮 Computed & Watch Methods (3 methods)

### 6. **computed(state, definitions)**
Adds computed properties to existing state.

```javascript
// Before
ReactiveUtils.computed(myState, {
  double() {
    return this.count * 2;
  },
  triple() {
    return this.count * 3;
  }
});

// After
computed(myState, {
  double() {
    return this.count * 2;
  },
  triple() {
    return this.count * 3;
  }
});

console.log(myState.double);  // Computed value
```

### 7. **watch(state, definitions)**
Watches state changes.

```javascript
// Before
const unwatch = ReactiveUtils.watch(myState, {
  count(newVal, oldVal) {
    console.log(`Count changed: ${oldVal} → ${newVal}`);
  },
  name(newVal, oldVal) {
    console.log(`Name changed: ${oldVal} → ${newVal}`);
  }
});

// After
const unwatch = watch(myState, {
  count(newVal, oldVal) {
    console.log(`Count changed: ${oldVal} → ${newVal}`);
  },
  name(newVal, oldVal) {
    console.log(`Name changed: ${oldVal} → ${newVal}`);
  }
});

myState.count = 5;  // Triggers watcher
unwatch();  // Stop watching
```

### 8. **effects(definitions)**
Creates multiple effects at once.

```javascript
// Before
const stopAll = ReactiveUtils.effects({
  logCount() {
    console.log('Count:', myState.count);
  },
  logDouble() {
    console.log('Double:', myState.count * 2);
  }
});

// After
const stopAll = effects({
  logCount() {
    console.log('Count:', myState.count);
  },
  logDouble() {
    console.log('Double:', myState.count * 2);
  }
});

stopAll();  // Stop all effects
```

---

### 📊 Refs & Collections Methods (5 methods)

### 9. **ref(value)**
Creates a reactive reference for a single value.

```javascript
// Before
const count = ReactiveUtils.ref(0);

// After
const count = ref(0);

console.log(count.value);  // 0
count.value = 5;
console.log(count.value);  // 5
console.log(count + 1);    // 6 (uses valueOf)
```

### 10. **refs(definitions)**
Creates multiple refs at once.

```javascript
// Before
const { count, name, active } = ReactiveUtils.refs({
  count: 0,
  name: "John",
  active: true
});

// After
const { count, name, active } = refs({
  count: 0,
  name: "John",
  active: true
});

count.value = 10;
name.value = "Jane";
```

### 11. **collection(items)**
Creates a reactive collection with helper methods.

```javascript
// Before
const todos = ReactiveUtils.collection([
  { id: 1, text: "Task 1", done: false }
]);

// After
const todos = collection([
  { id: 1, text: "Task 1", done: false }
]);

todos.add({ id: 2, text: "Task 2", done: false });
todos.remove(item => item.id === 1);
console.log(todos.items);
```

### 12. **list(items)**
Alias for `collection()`.

```javascript
// Before
const items = ReactiveUtils.list([1, 2, 3]);

// After
const items = list([1, 2, 3]);

items.add(4);
items.clear();
```

### 13. **patchArray(state, key)**
Manually patches array for reactivity.

```javascript
// Before
ReactiveUtils.patchArray(myState, 'items');

// After
patchArray(myState, 'items');

// Now array methods trigger updates
myState.items.push(newItem);  // Reactive!
myState.items.splice(0, 1);   // Reactive!
```

---

### 📝 Forms Methods (3 methods)

### 14. **form(initialValues, options)**
Creates reactive form state with validation support.

```javascript
// Before
const loginForm = ReactiveUtils.form({
  email: "",
  password: ""
});

// After
const loginForm = form({
  email: "",
  password: ""
});

loginForm.$setValue('email', 'user@example.com');
loginForm.$setError('password', 'Too short');
console.log(loginForm.isValid);
```

### 15. **createForm(initialValues, options)**
Alias for `form()`.

```javascript
// After
const signupForm = createForm({
  username: "",
  email: "",
  password: "",
  confirmPassword: ""
});

signupForm.$reset();
```

### 16. **validators**
Built-in form validators.

```javascript
// After
const myForm = form(
  { email: "" },
  {
    validators: {
      email: [
        validators.required('Email is required'),
        validators.email('Invalid email format')
      ]
    }
  }
);

// Available validators:
// - validators.required(message)
// - validators.email(message)
// - validators.minLength(length, message)
// - validators.maxLength(length, message)
// - validators.pattern(regex, message)
// - validators.min(value, message)
// - validators.max(value, message)
```

---

### 🏗️ Advanced State Methods (3 methods)

### 17. **store(initialState, options)**
Creates a Vuex-style store with getters and actions.

```javascript
// Before
const counterStore = ReactiveUtils.store(
  { count: 0 },
  {
    getters: {
      double() { return this.count * 2; }
    },
    actions: {
      increment(state, amount = 1) {
        state.count += amount;
      }
    }
  }
);

// After
const counterStore = store(
  { count: 0 },
  {
    getters: {
      double() { return this.count * 2; }
    },
    actions: {
      increment(state, amount = 1) {
        state.count += amount;
      }
    }
  }
);

counterStore.increment(5);
console.log(counterStore.double);
```

### 18. **component(config)**
Creates a component-like reactive structure.

```javascript
// Before
const myComponent = ReactiveUtils.component({
  state: { count: 0 },
  computed: {
    message() {
      return `Count: ${this.count}`;
    }
  },
  actions: {
    increment(state) {
      state.count++;
    }
  }
});

// After
const myComponent = component({
  state: { count: 0 },
  computed: {
    message() {
      return `Count: ${this.count}`;
    }
  },
  actions: {
    increment(state) {
      state.count++;
    }
  }
});

myComponent.increment();
```

### 19. **reactive(initialState)**
Builder pattern for creating reactive state.

```javascript
// Before
const myState = ReactiveUtils.reactive({ count: 0 })
  .computed({
    double() { return this.count * 2; }
  })
  .watch({
    count(val) { console.log(val); }
  })
  .build();

// After
const myState = reactive({ count: 0 })
  .computed({
    double() { return this.count * 2; }
  })
  .watch({
    count(val) { console.log(val); }
  })
  .build();

myState.count = 5;
```

---

### 🔧 Utility Methods (7 methods)

### 20. **isReactive(value)**
Checks if a value is reactive.

```javascript
// Before
const check = ReactiveUtils.isReactive(myState);

// After
const check = isReactive(myState);

console.log(isReactive(myState));  // true
console.log(isReactive({ plain: 'object' }));  // false
```

### 21. **toRaw(reactiveValue)**
Gets the raw (non-reactive) version of a value.

```javascript
// Before
const raw = ReactiveUtils.toRaw(myState);

// After
const raw = toRaw(myState);

raw.count = 10;  // Does not trigger reactivity
console.log(raw);  // Plain object
```

### 22. **notify(state, key)**
Manually triggers change notifications.

```javascript
// Before
myState.items.push(4);
ReactiveUtils.notify(myState, 'items');

// After
myState.items.push(4);
notify(myState, 'items');

// Notify all properties
notify(myState);
```

### 23. **pause()**
Pauses reactive updates globally.

```javascript
// Before
ReactiveUtils.pause();

// After
pause();

myState.x = 10;
myState.y = 20;
// No effects run yet

resume(true);  // Resume and flush updates
```

### 24. **resume(flush)**
Resumes reactive updates.

```javascript
// After
pause();
// ... make multiple changes ...
myState.a = 1;
myState.b = 2;
myState.c = 3;

resume(true);  // true = flush all pending updates
```

### 25. **untrack(fn)**
Runs a function without tracking dependencies.

```javascript
// Before
ReactiveUtils.effect(() => {
  console.log('Tracked:', myState.count);
  ReactiveUtils.untrack(() => {
    console.log('Not tracked:', myState.temp);
  });
});

// After
effect(() => {
  console.log('Tracked:', myState.count);
  untrack(() => {
    console.log('Not tracked:', myState.temp);
  });
});

myState.count = 5;  // Effect runs
myState.temp = 100; // Effect does NOT run
```

### 26. **updateAll(state, updates)**
Mixed state and DOM updates in one call.

```javascript
// Before
ReactiveUtils.updateAll(myState, {
  count: 5,
  name: "John",
  '#counter': { textContent: '5' },
  '.status': { style: { color: 'green' } }
});

// After
updateAll(myState, {
  count: 5,
  name: "John",
  '#counter': { textContent: '5' },
  '.status': { style: { color: 'green' } }
});
```

### 27. **asyncState(initialValue)**
Creates async operation state with loading/error tracking.

```javascript
// After
const apiData = asyncState(null);

async function fetchData() {
  await apiData.$execute(async () => {
    const response = await fetch('/api/data');
    return response.json();
  });
}

console.log(apiData.loading);   // true/false
console.log(apiData.error);     // null or error
console.log(apiData.data);      // fetched data
console.log(apiData.isSuccess); // computed property
```

---

### 🎨 Collections Extended API (3 methods)

### 28. **createCollection(items)**
Creates a basic reactive collection (if Collections module loaded).

```javascript
// Before
const todos = Collections.create([
  { id: 1, text: "Task 1", done: false },
  { id: 2, text: "Task 2", done: true }
]);

// After
const todos = createCollection([
  { id: 1, text: "Task 1", done: false },
  { id: 2, text: "Task 2", done: true }
]);

// Use collection methods
todos.add({ id: 3, text: "Task 3", done: false });
todos.remove(item => item.id === 2);
todos.update(item => item.id === 1, { done: true });
console.log(todos.items);
```

### 29. **createCollectionWithComputed(items, computed)**
Creates collection with computed properties (if Collections module loaded).

```javascript
// Before
const todos = Collections.createWithComputed(
  [
    { id: 1, text: "Task 1", done: false },
    { id: 2, text: "Task 2", done: true }
  ],
  {
    remaining() {
      return this.items.filter(t => !t.done).length;
    },
    completed() {
      return this.items.filter(t => t.done).length;
    },
    total() {
      return this.items.length;
    }
  }
);

// After
const todos = createCollectionWithComputed(
  [
    { id: 1, text: "Task 1", done: false },
    { id: 2, text: "Task 2", done: true }
  ],
  {
    remaining() {
      return this.items.filter(t => !t.done).length;
    },
    completed() {
      return this.items.filter(t => t.done).length;
    },
    total() {
      return this.items.length;
    }
  }
);

console.log(todos.remaining);  // 1
console.log(todos.completed);  // 1
console.log(todos.total);      // 2
```

### 30. **createFilteredCollection(sourceCollection, filterFn)**
Creates a filtered view of a collection that automatically syncs (if Collections module loaded).

```javascript
// Before
const allTodos = Collections.create([
  { id: 1, done: false },
  { id: 2, done: true },
  { id: 3, done: false }
]);

const activeTodos = Collections.createFiltered(
  allTodos,
  todo => !todo.done
);

// After
const allTodos = createCollection([
  { id: 1, done: false },
  { id: 2, done: true },
  { id: 3, done: false }
]);

const activeTodos = createFilteredCollection(
  allTodos,
  todo => !todo.done
);

console.log(activeTodos.items);  // [{ id: 1, done: false }, { id: 3, done: false }]

// Automatically updates when source changes
allTodos.update(t => t.id === 1, { done: true });
console.log(activeTodos.items);  // [{ id: 3, done: false }]
```

---

## 📝 Practical Examples

### Example 1: Simple Counter (Shortened Syntax)

```javascript
// Create reactive state
const counter = state({ count: 0 });

// Add computed property
computed(counter, {
  double() {
    return this.count * 2;
  },
  isEven() {
    return this.count % 2 === 0;
  }
});

// Watch for changes
watch(counter, {
  count(newVal, oldVal) {
    console.log(`Count: ${oldVal} → ${newVal}`);
  }
});

// Create bindings
bindings({
  '#counter': () => counter.count,
  '#double': () => counter.double,
  '#status': {
    textContent: () => counter.isEven ? 'Even' : 'Odd',
    style: () => ({
      color: counter.isEven ? 'green' : 'red'
    })
  }
});

// Update
counter.count++;  // All updates happen automatically
```

### Example 2: Todo List with Collections

```javascript
// Create todo collection
const todos = collection([]);

// Add computed properties
computed(todos, {
  remaining() {
    return this.items.filter(t => !t.done).length;
  },
  completed() {
    return this.items.filter(t => t.done).length;
  },
  all() {
    return this.items.length;
  }
});

// Add todo function
function addTodo(text) {
  todos.add({
    id: Date.now(),
    text,
    done: false,
    createdAt: new Date()
  });
}

// Toggle todo
function toggleTodo(id) {
  const todo = todos.items.find(t => t.id === id);
  if (todo) {
    todos.update(t => t.id === id, { done: !todo.done });
  }
}

// Remove todo
function removeTodo(id) {
  todos.remove(t => t.id === id);
}

// Bind to DOM
bindings({
  '#todoCount': () => `${todos.remaining} of ${todos.all} remaining`,
  '#completedCount': () => `${todos.completed} completed`,
  '#clearBtn': {
    disabled: () => todos.completed === 0
  }
});

// Add initial todos
addTodo('Learn reactive state');
addTodo('Build awesome app');
addTodo('Ship to production');
```

### Example 3: Todo List with Computed Collections

```javascript
// Create todo collection WITH computed properties built-in
const todos = createCollectionWithComputed(
  [],
  {
    remaining() {
      return this.items.filter(t => !t.done).length;
    },
    completed() {
      return this.items.filter(t => t.done).length;
    },
    all() {
      return this.items.length;
    },
    percentComplete() {
      if (this.all === 0) return 0;
      return Math.round((this.completed / this.all) * 100);
    }
  }
);

// Create filtered views
const activeTodos = createFilteredCollection(todos, t => !t.done);
const completedTodos = createFilteredCollection(todos, t => t.done);

// Add todos
todos.add({ id: 1, text: 'Buy groceries', done: false });
todos.add({ id: 2, text: 'Walk dog', done: true });
todos.add({ id: 3, text: 'Write code', done: false });

// Check computed properties
console.log(todos.remaining);        // 2
console.log(todos.completed);        // 1
console.log(todos.percentComplete);  // 33

// Check filtered collections
console.log(activeTodos.items.length);    // 2
console.log(completedTodos.items.length); // 1

// Bind to DOM
bindings({
  '#todoCount': () => `${todos.remaining} remaining`,
  '#progress': () => `${todos.percentComplete}% complete`,
  '#activeCount': () => activeTodos.items.length,
  '#completedCount': () => completedTodos.items.length
});
```

### Example 4: Form with Validation

```javascript
// Create form with validators
const loginForm = form(
  {
    email: '',
    password: ''
  },
  {
    validators: {
      email: [
        validators.required('Email is required'),
        validators.email('Invalid email format')
      ],
      password: [
        validators.required('Password is required'),
        validators.minLength(8, 'Password must be at least 8 characters')
      ]
    }
  }
);

// Watch for validation
watch(loginForm, {
  'values.email'(newVal) {
    console.log('Email changed:', newVal);
  },
  'errors.email'(error) {
    console.log('Email error:', error);
  }
});

// Bind to DOM
bindings({
  '#email': {
    value: () => loginForm.values.email,
    classList: () => loginForm.touched.email && loginForm.errors.email ? ['error'] : []
  },
  '#password': {
    value: () => loginForm.values.password,
    classList: () => loginForm.touched.password && loginForm.errors.password ? ['error'] : []
  },
  '#emailError': {
    textContent: () => loginForm.errors.email || '',
    hidden: () => !loginForm.touched.email || !loginForm.errors.email
  },
  '#passwordError': {
    textContent: () => loginForm.errors.password || '',
    hidden: () => !loginForm.touched.password || !loginForm.errors.password
  },
  '#submitBtn': {
    disabled: () => !loginForm.isValid || loginForm.isSubmitting
  }
});

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();
  
  if (!loginForm.isValid) return;
  
  loginForm.isSubmitting = true;
  
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm.values)
    });
    
    if (response.ok) {
      console.log('Login successful!');
      loginForm.$reset();
    } else {
      loginForm.$setError('email', 'Invalid credentials');
    }
  } catch (error) {
    loginForm.$setError('email', 'Network error');
  } finally {
    loginForm.isSubmitting = false;
  }
}
```

### Example 5: Async Data with Loading States

```javascript
// Create async state
const userData = asyncState(null);
const postsData = asyncState([]);

// Fetch user data
async function loadUser(userId) {
  await userData.$execute(async () => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  });
  
  // Load posts after user loads
  if (userData.isSuccess) {
    await loadPosts(userId);
  }
}

// Fetch user posts
async function loadPosts(userId) {
  await postsData.$execute(async () => {
    const response = await fetch(`/api/users/${userId}/posts`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  });
}

// Bind loading states to DOM
bindings({
  '#loadingUser': {
    hidden: () => !userData.loading
  },
  '#loadingPosts': {
    hidden: () => !postsData.loading
  },
  '#userError': {
    hidden: () => !userData.error,
    textContent: () => userData.error?.message || ''
  },
  '#postsError': {
    hidden: () => !postsData.error,
    textContent: () => postsData.error?.message || ''
  },
  '#userCard': {
    hidden: () => !userData.isSuccess,
    innerHTML: () => userData.data 
      ? `
        <h2>${userData.data.name}</h2>
        <p>${userData.data.email}</p>
      `
      : ''
  },
  '#postsList': {
    hidden: () => !postsData.isSuccess || postsData.data.length === 0,
    innerHTML: () => postsData.data
      .map(post => `
        <div class="post">
          <h3>${post.title}</h3>
          <p>${post.body}</p>
        </div>
      `)
      .join('')
  }
});

// Load data
loadUser(123);
```

### Example 6: Store with Actions and Getters

```javascript
// Create shopping cart store
const cartStore = store(
  {
    items: [],
    discount: 0
  },
  {
    getters: {
      subtotal() {
        return this.items.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);
      },
      discountAmount() {
        return this.subtotal * (this.discount / 100);
      },
      total() {
        return this.subtotal - this.discountAmount;
      },
      itemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
      }
    },
    actions: {
      addItem(state, product) {
        const existing = state.items.find(item => item.id === product.id);
        
        if (existing) {
          existing.quantity++;
        } else {
          state.items.push({
            ...product,
            quantity: 1
          });
        }
      },
      
      removeItem(state, productId) {
        const index = state.items.findIndex(item => item.id === productId);
        if (index > -1) {
          state.items.splice(index, 1);
        }
      },
      
      updateQuantity(state, { productId, quantity }) {
        const item = state.items.find(item => item.id === productId);
        if (item) {
          item.quantity = Math.max(1, quantity);
        }
      },
      
      applyDiscount(state, percent) {
        state.discount = Math.min(100, Math.max(0, percent));
      },
      
      clearCart(state) {
        state.items = [];
        state.discount = 0;
      }
    }
  }
);

// Patch items array for reactivity
patchArray(cartStore, 'items');

// Bind to DOM
bindings({
  '#cartCount': () => cartStore.itemCount,
  '#subtotal': () => `$${cartStore.subtotal.toFixed(2)}`,
  '#discount': () => `${cartStore.discount}%`,
  '#discountAmount': () => `-$${cartStore.discountAmount.toFixed(2)}`,
  '#total': () => `$${cartStore.total.toFixed(2)}`,
  '#emptyCart': {
    hidden: () => cartStore.items.length > 0
  },
  '#cartItems': {
    hidden: () => cartStore.items.length === 0
  }
});

// Use store actions
cartStore.addItem({ id: 1, name: 'Widget', price: 29.99 });
cartStore.addItem({ id: 2, name: 'Gadget', price: 49.99 });
cartStore.applyDiscount(10);
cartStore.updateQuantity({ productId: 1, quantity: 3 });
```

### Example 7: Component Pattern

```javascript
// Create a timer component
const timerComponent = component({
  state: {
    seconds: 0,
    minutes: 0,
    hours: 0,
    isRunning: false,
    intervalId: null
  },
  
  computed: {
    formattedTime() {
      const pad = (n) => String(n).padStart(2, '0');
      return `${pad(this.hours)}:${pad(this.minutes)}:${pad(this.seconds)}`;
    },
    totalSeconds() {
      return this.hours * 3600 + this.minutes * 60 + this.seconds;
    }
  },
  
  watch: {
    totalSeconds(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log('Time changed:', this.formattedTime);
      }
    }
  },
  
  bindings: {
    '#timer': 'formattedTime',
    '#startBtn': {
      disabled: () => this.isRunning
    },
    '#stopBtn': {
      disabled: () => !this.isRunning
    },
    '#resetBtn': {
      disabled: () => this.totalSeconds === 0
    }
  },
  
  actions: {
    start(state) {
      if (state.isRunning) return;
      
      state.isRunning = true;
      state.intervalId = setInterval(() => {
        this.tick();
      }, 1000);
    },
    
    stop(state) {
      if (!state.isRunning) return;
      
      state.isRunning = false;
      if (state.intervalId) {
        clearInterval(state.intervalId);
        state.intervalId = null;
      }
    },
    
    reset(state) {
      this.stop();
      state.seconds = 0;
      state.minutes = 0;
      state.hours = 0;
    },
    
    tick(state) {
      state.seconds++;
      
      if (state.seconds >= 60) {
        state.seconds = 0;
        state.minutes++;
      }
      
      if (state.minutes >= 60) {
        state.minutes = 0;
        state.hours++;
      }
    }
  },
  
  mounted() {
    console.log('Timer component mounted');
  },
  
  unmounted() {
    console.log('Timer component unmounted');
    this.stop();
  }
});

// Use the component
timerComponent.start();

// Clean up when done
// timerComponent.$destroy();
```

---

## 🎯 Best Practices

### 1. **Always Load After Reactive Modules**
```javascript
<!-- Load order matters! -->
<script src="dh-reactiveUtils-core.js"></script>
<script src="dh-reactiveUtils-forms.js"></script>
<script src="dh-reactiveUtils-collections.js"></script>
<script src="dh-reactiveUtils-shortcut.js"></script> <!-- Last! -->
```

### 2. **Use Shortcuts for Cleaner Code**
```javascript
// ❌ Verbose
const myState = ReactiveUtils.state({ count: 0 });
ReactiveUtils.effect(() => console.log(myState.count));
ReactiveUtils.computed(myState, { double() { return this.count * 2; } });

// ✅ Clean
const myState = state({ count: 0 });
effect(() => console.log(myState.count));
computed(myState, { double() { return this.count * 2; } });
```

### 3. **Combine with Batching for Performance**
```javascript
// Batch multiple updates
batch(() => {
  myState.x = 10;
  myState.y = 20;
  myState.z = 30;
  // All effects run once
});
```

### 4. **Use `pause()` and `resume()` for Bulk Operations**
```javascript
// Pause reactivity during bulk updates
pause();

for (let i = 0; i < 1000; i++) {
  collection.add({ id: i, value: Math.random() });
}

resume(true);  // Resume and flush all updates at once
```

### 5. **Clean Up Resources**
```javascript
// Always stop effects/watchers when done
const stopEffect = effect(() => console.log(state.count));
const unwatch = watch(state, { count: () => {} });
const unbind = bindings({ '#counter': () => state.count });

// Later...
stopEffect();
unwatch();
unbind();
```

---

## ⚠️ Important Notes

1. **Module Loading Order**: The shortcut module MUST be loaded after all reactive modules
2. **Global Namespace**: All shortcuts are added to the global scope (window/global)
3. **No Conflicts**: If you have other libraries with same-named functions, conflicts may occur
4. **ReactiveUtils Still Available**: The original `ReactiveUtils` namespace remains accessible
5. **Console Info**: Loading the module logs available shortcuts to the console

---

## 🔍 Checking What's Available

After loading the shortcut module, check the console for available functions:

```javascript
// The module logs this on load:
// [Standalone API] v1.0.0 loaded successfully
// [Standalone API] Simplified functions available:
// 
// Core:
//   state(), effect(), batch(), computed(), watch()
// 
// Data Structures:
//   ref(), refs(), collection(), list()
// 
// Arrays:
//   patchArray()
// 
// Forms:
//   form(), createForm(), validators
// 
// Advanced:
//   store(), component(), reactive(), bindings()
// 
// Utilities:
//   isReactive(), toRaw(), notify(), pause(), resume(), untrack()
// 
// Collections (if Collections module loaded):
//   createCollection(), createCollectionWithComputed(), createFilteredCollection()
```

---

## 📦 Full API Quick Reference

```javascript
// State Creation
state({ })                               // Create reactive state
createState({ }, { })                    // Create state with bindings
ref(value)                               // Create reactive reference
refs({ })                                // Create multiple refs
collection([])                           // Create reactive collection
list([])                                 // Alias for collection
form({ })                                // Create reactive form
store({ }, { })                          // Create Vuex-style store
component({ })                           // Create component
reactive({ }).build()                    // Builder pattern

// Reactivity
effect(() => {})                         // Create effect
batch(() => {})                          // Batch updates
computed(state, { })                     // Add computed properties
watch(state, { })                        // Watch state changes
effects({ })                             // Multiple effects
bindings({ })                            // DOM bindings

// Arrays
patchArray(state, 'key')                 // Patch array for reactivity

// Forms
validators.required(msg)                 // Validator: required
validators.email(msg)                    // Validator: email
validators.minLength(n, msg)             // Validator: min length
// ... more validators

// Utilities
isReactive(value)                        // Check if reactive
toRaw(value)                             // Get raw value
notify(state, 'key')                     // Manual notification
pause()                                  // Pause reactivity
resume(flush)                            // Resume reactivity
untrack(() => {})                        // Run without tracking
updateAll(state, { })                    // Mixed updates

// Async
asyncState(initialValue)                 // Async state management

// Collections (if Collections module loaded)
createCollection([])                     // Basic collection
createCollectionWithComputed([], { })    // Collection with computed
createFilteredCollection(col, fn)        // Filtered collection
```

---

This shortcut API makes reactive state management more enjoyable and productive! 🚀✨