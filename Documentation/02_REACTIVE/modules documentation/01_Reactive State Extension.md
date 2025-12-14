# DOM Helpers - Reactive State Extension v2.0.2

## 📚 Complete Methods Documentation

---

## 🎯 Core State Creation Methods

### 1. **state() / createReactive()**
Creates a reactive state object that automatically tracks dependencies and triggers updates.

```javascript
// Basic reactive state
const state = ReactiveUtils.state({
  count: 0,
  user: {
    name: "John",
    age: 25
  }
});

// Or using direct method
const state = Elements.state({ count: 0 });
const state = Collections.state({ count: 0 });
const state = Selector.state({ count: 0 });
```

### 2. **createState(initialState, bindingDefs)**
Creates reactive state with automatic DOM bindings.

```javascript
const state = Elements.createState(
  { count: 0, name: "John" },
  {
    '#counter': 'count',              // Bind count to #counter
    '#userName': 'name',               // Bind name to #userName
    '.status': () => state.count > 5 ? 'High' : 'Low'
  }
);

// State changes automatically update DOM
state.count = 10;  // #counter updates to "10"
state.name = "Jane";  // #userName updates to "Jane"
```

---

## 🔧 Instance Methods (Available on Reactive State)

### 3. **state.$computed(key, fn)**
Adds a computed property that automatically updates when dependencies change.

```javascript
const state = ReactiveUtils.state({
  firstName: "John",
  lastName: "Doe"
});

state.$computed('fullName', function() {
  return `${this.firstName} ${this.lastName}`;
});

console.log(state.fullName);  // "John Doe"
state.firstName = "Jane";
console.log(state.fullName);  // "Jane Doe"
```

### 4. **state.$watch(keyOrFn, callback)**
Watches for changes to a property or computed value.

```javascript
const state = ReactiveUtils.state({ count: 0 });

// Watch a specific property
const unwatch = state.$watch('count', (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`);
});

// Watch a computed value
state.$watch(
  function() { return this.count * 2; },
  (newVal, oldVal) => {
    console.log(`Double count: ${oldVal} -> ${newVal}`);
  }
);

state.count = 5;  // Triggers both watchers

// Stop watching
unwatch();
```

### 5. **state.$batch(fn)**
Batches multiple state updates into a single update cycle.

```javascript
const state = ReactiveUtils.state({ x: 0, y: 0, z: 0 });

state.$batch(function() {
  this.x = 10;
  this.y = 20;
  this.z = 30;
  // All updates happen together, effects run once
});
```

### 6. **state.$notify(key)**
Manually triggers notifications for a property (useful for nested mutations).

```javascript
const state = ReactiveUtils.state({
  items: [1, 2, 3]
});

// After direct array mutation
state.items.push(4);
state.$notify('items');  // Manually trigger update
```

### 7. **state.$raw**
Gets the raw (non-reactive) version of the state.

```javascript
const state = ReactiveUtils.state({ count: 0 });
const raw = state.$raw;

// raw is not reactive
raw.count = 10;  // Does not trigger updates
```

### 8. **state.$update(updates)**
Mixed state and DOM updates in one call.

```javascript
const state = ReactiveUtils.state({ count: 0, name: "John" });

state.$update({
  // State updates
  count: 5,
  name: "Jane",
  'user.age': 30,  // Nested property
  
  // DOM updates (selectors)
  '#counter': { textContent: 'Updated!' },
  '.status': { style: { color: 'green' } }
});
```

### 9. **state.$set(updates)**
Functional updates - values can be functions.

```javascript
const state = ReactiveUtils.state({ count: 0 });

state.$set({
  count: (oldCount) => oldCount + 1,  // Increment
  name: (oldName) => oldName.toUpperCase()
});

// Can also use regular values
state.$set({
  count: 10,
  name: "John"
});
```

### 10. **state.$bind(bindingDefs)**
Creates reactive bindings between state and DOM.

```javascript
const state = ReactiveUtils.state({ count: 0, name: "John" });

const unbind = state.$bind({
  '#counter': 'count',  // Simple property binding
  '#userName': () => state.name.toUpperCase(),  // Computed binding
  '.status': {
    textContent: () => `Count: ${state.count}`,
    style: () => ({ color: state.count > 5 ? 'red' : 'green' })
  }
});

state.count = 10;  // Automatically updates #counter and .status

// Stop bindings
unbind();
```

---

## 🏗️ Specialized State Creators

### 11. **ref(value)**
Creates a reactive reference for a single value.

```javascript
const count = ReactiveUtils.ref(0);

console.log(count.value);  // 0
count.value = 5;
console.log(count.value);  // 5

// Works with valueOf/toString
console.log(count + 1);  // 6
console.log(`Count: ${count}`);  // "Count: 5"
```

### 12. **refs(definitions)**
Creates multiple refs at once.

```javascript
const { count, name, active } = ReactiveUtils.refs({
  count: 0,
  name: "John",
  active: true
});

count.value = 10;
name.value = "Jane";
active.value = false;
```

### 13. **collection(items) / list(items)**
Creates a reactive collection with helper methods.

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: "Task 1", done: false },
  { id: 2, text: "Task 2", done: true }
]);

// Add item
todos.$add({ id: 3, text: "Task 3", done: false });

// Remove item
todos.$remove(item => item.id === 2);
// Or by value
todos.$remove(todos.items[0]);

// Update item
todos.$update(
  item => item.id === 1,
  { done: true }
);

// Clear all
todos.$clear();

console.log(todos.items);  // Access array
```

### 14. **form(initialValues)**
Creates reactive form state with validation support.

```javascript
const formState = ReactiveUtils.form({
  username: "",
  email: "",
  password: ""
});

// Set value and mark as touched
formState.$setValue('username', 'john_doe');

// Set error
formState.$setError('email', 'Invalid email format');

// Check computed properties
console.log(formState.isValid);   // false (has error)
console.log(formState.isDirty);   // true (has touched fields)

// Reset form
formState.$reset();
// Or with new values
formState.$reset({ username: "jane", email: "", password: "" });
```

### 15. **async(initialValue) / asyncState(initialValue)**
Creates async operation state with loading/error tracking.

```javascript
const apiState = ReactiveUtils.async(null);

// Execute async operation
async function fetchData() {
  await apiState.$execute(async () => {
    const response = await fetch('/api/data');
    return response.json();
  });
}

// Check state
console.log(apiState.loading);    // false/true
console.log(apiState.error);      // null or error object
console.log(apiState.data);       // null or fetched data
console.log(apiState.isSuccess);  // computed: success state
console.log(apiState.isError);    // computed: error state

// Reset
apiState.$reset();
```

### 16. **store(initialState, options)**
Creates a Vuex-style store with getters and actions.

```javascript
const counterStore = ReactiveUtils.store(
  { count: 0 },
  {
    getters: {
      double() {
        return this.count * 2;
      },
      isPositive() {
        return this.count > 0;
      }
    },
    actions: {
      increment(state, amount = 1) {
        state.count += amount;
      },
      decrement(state, amount = 1) {
        state.count -= amount;
      },
      async fetchCount(state) {
        const response = await fetch('/api/count');
        state.count = await response.json();
      }
    }
  }
);

console.log(counterStore.double);  // 0
counterStore.increment(5);
console.log(counterStore.double);  // 10
console.log(counterStore.isPositive);  // true
```

### 17. **component(config)**
Creates a component-like reactive structure.

```javascript
const myComponent = ReactiveUtils.component({
  state: {
    count: 0,
    name: "Component"
  },
  
  computed: {
    message() {
      return `${this.name}: ${this.count}`;
    }
  },
  
  watch: {
    count(newVal, oldVal) {
      console.log(`Count changed: ${oldVal} -> ${newVal}`);
    }
  },
  
  effects: {
    logChanges() {
      console.log('State changed:', this.count);
    }
  },
  
  bindings: {
    '#counter': 'count',
    '#message': 'message'
  },
  
  actions: {
    increment(state, amount = 1) {
      state.count += amount;
    }
  },
  
  mounted() {
    console.log('Component mounted');
  },
  
  unmounted() {
    console.log('Component unmounted');
  }
});

myComponent.increment(5);
myComponent.$destroy();  // Clean up
```

### 18. **reactive(initialState)**
Builder pattern for creating reactive state.

```javascript
const state = ReactiveUtils.reactive({ count: 0, name: "John" })
  .computed({
    message() {
      return `${this.name}: ${this.count}`;
    }
  })
  .watch({
    count(newVal) {
      console.log('Count:', newVal);
    }
  })
  .effect(() => {
    console.log('Effect running');
  })
  .bind({
    '#counter': 'count',
    '#name': 'name'
  })
  .action('increment', function(state, amount = 1) {
    state.count += amount;
  })
  .actions({
    decrement(state, amount = 1) {
      state.count -= amount;
    },
    reset(state) {
      state.count = 0;
    }
  })
  .build();

state.increment(5);
state.destroy();  // Clean up
```

---

## 🎨 Global Helper Methods

### 19. **computed(state, definitions)**
Adds computed properties to existing state.

```javascript
const state = ReactiveUtils.state({ x: 5, y: 10 });

ReactiveUtils.computed(state, {
  sum() {
    return this.x + this.y;
  },
  product() {
    return this.x * this.y;
  }
});

console.log(state.sum);      // 15
console.log(state.product);  // 50
```

### 20. **watch(state, definitions)**
Adds multiple watchers to state.

```javascript
const state = ReactiveUtils.state({ count: 0, name: "John" });

const unwatch = ReactiveUtils.watch(state, {
  count(newVal, oldVal) {
    console.log(`Count: ${oldVal} -> ${newVal}`);
  },
  name(newVal, oldVal) {
    console.log(`Name: ${oldVal} -> ${newVal}`);
  }
});

state.count = 5;
state.name = "Jane";

unwatch();  // Stop all watchers
```

### 21. **effect(fn)**
Creates an effect that runs when dependencies change.

```javascript
const state = ReactiveUtils.state({ count: 0 });

const stop = ReactiveUtils.effect(() => {
  console.log('Count is:', state.count);
  // Automatically re-runs when state.count changes
});

state.count = 5;  // Logs: "Count is: 5"
state.count = 10; // Logs: "Count is: 10"

stop();  // Stop the effect
```

### 22. **effects(definitions)**
Creates multiple effects at once.

```javascript
const state = ReactiveUtils.state({ x: 0, y: 0 });

const stopAll = ReactiveUtils.effects({
  logX() {
    console.log('X:', state.x);
  },
  logY() {
    console.log('Y:', state.y);
  },
  logSum() {
    console.log('Sum:', state.x + state.y);
  }
});

state.x = 5;   // Logs X and Sum
state.y = 10;  // Logs Y and Sum

stopAll();  // Stop all effects
```

### 23. **bindings(definitions)**
Creates reactive DOM bindings.

```javascript
const state = ReactiveUtils.state({ count: 0, active: false });

const unbind = ReactiveUtils.bindings({
  '#counter': () => state.count,
  
  '.status': {
    textContent: () => state.active ? 'Active' : 'Inactive',
    style: () => ({ 
      color: state.active ? 'green' : 'red' 
    })
  },
  
  'button.toggle': {
    disabled: () => state.count === 0
  }
});

state.count = 5;
state.active = true;

unbind();  // Remove all bindings
```

### 24. **batch(fn)**
Batches multiple updates into one.

```javascript
const state = ReactiveUtils.state({ x: 0, y: 0, z: 0 });

ReactiveUtils.batch(() => {
  state.x = 10;
  state.y = 20;
  state.z = 30;
  // All effects run once after this
});
```

### 25. **updateAll(state, updates)**
Global method for mixed state/DOM updates.

```javascript
const state = ReactiveUtils.state({ count: 0 });

updateAll(state, {
  // State updates
  count: 5,
  name: "John",
  
  // DOM updates
  '#counter': { textContent: 'Updated!' },
  '.status': { style: { color: 'green' } }
});

// Also available on Elements/Collections/Selector
Elements.updateAll(state, { /* ... */ });
```

---

## 🔍 Utility Methods

### 26. **isReactive(value)**
Checks if a value is reactive.

```javascript
const state = ReactiveUtils.state({ count: 0 });
const plain = { count: 0 };

console.log(ReactiveUtils.isReactive(state));  // true
console.log(ReactiveUtils.isReactive(plain));  // false
```

### 27. **toRaw(reactiveValue)**
Gets the raw (non-reactive) version of a value.

```javascript
const state = ReactiveUtils.state({ count: 0 });
const raw = ReactiveUtils.toRaw(state);

raw.count = 10;  // Does not trigger reactivity
```

### 28. **notify(state, key)**
Manually triggers change notifications.

```javascript
const state = ReactiveUtils.state({ items: [1, 2, 3] });

state.items.push(4);
ReactiveUtils.notify(state, 'items');  // Manually notify

// Or notify all properties
ReactiveUtils.notify(state);
```

### 29. **pause()**
Pauses reactive updates.

```javascript
ReactiveUtils.pause();

state.x = 10;
state.y = 20;
state.z = 30;
// No effects run yet

ReactiveUtils.resume(true);  // Resume and flush updates
```

### 30. **resume(flush)**
Resumes reactive updates.

```javascript
ReactiveUtils.pause();
// ... make changes ...
ReactiveUtils.resume(true);  // true = flush pending updates
```

### 31. **untrack(fn)**
Runs a function without tracking dependencies.

```javascript
const state = ReactiveUtils.state({ count: 0, temp: 0 });

ReactiveUtils.effect(() => {
  console.log('Count:', state.count);
  
  // This access won't trigger re-run
  ReactiveUtils.untrack(() => {
    console.log('Temp:', state.temp);
  });
});

state.count = 5;  // Effect runs
state.temp = 100; // Effect does NOT run
```

---

## 🎯 Integration-Specific Methods

### 32. **Elements.bind(bindingDefs)**
ID-based bindings for Elements helper.

```javascript
const state = ReactiveUtils.state({ count: 0 });

Elements.bind({
  counter: () => state.count,  // Binds to #counter
  userName: () => state.name,  // Binds to #userName
  status: {
    textContent: () => state.active ? 'Active' : 'Inactive',
    style: () => ({ color: state.active ? 'green' : 'red' })
  }
});
```

### 33. **Collections.bind(bindingDefs)**
Class-based bindings for Collections helper.

```javascript
const state = ReactiveUtils.state({ count: 0 });

Collections.bind({
  counter: () => state.count,  // Binds to all .counter elements
  'status-badge': {
    textContent: () => `Count: ${state.count}`,
    classList: () => state.count > 5 ? ['high'] : ['low']
  }
});
```

### 34. **Selector.query.bind(bindingDefs)**
Single-element query bindings.

```javascript
const state = ReactiveUtils.state({ count: 0 });

Selector.query.bind({
  '#counter': () => state.count,
  'div.status': {
    textContent: () => `Status: ${state.active ? 'On' : 'Off'}`
  }
});
```

### 35. **Selector.queryAll.bind(bindingDefs)**
Multiple-element query bindings.

```javascript
const state = ReactiveUtils.state({ theme: 'dark' });

Selector.queryAll.bind({
  '.theme-element': {
    className: () => `theme-${state.theme}`,
    dataset: () => ({ theme: state.theme })
  }
});
```

---

## 📝 Practical Examples

### Example 1: Counter Application
```javascript
const counter = Elements.createState(
  { count: 0 },
  { '#counter': 'count' }
);

counter.$computed('double', function() {
  return this.count * 2;
});

counter.$watch('count', (newVal) => {
  if (newVal > 10) alert('Count exceeded 10!');
});

// Update via buttons
Elements.btnIncrement.addEventListener('click', () => {
  counter.count++;
});

Elements.btnDecrement.addEventListener('click', () => {
  counter.count--;
});
```

### Example 2: Form with Validation
```javascript
const loginForm = ReactiveUtils.form({
  email: "",
  password: ""
});

// Validate on change
loginForm.$watch('email', (email) => {
  if (!email.includes('@')) {
    loginForm.$setError('email', 'Invalid email');
  } else {
    loginForm.$setError('email', null);
  }
});

// Bind to DOM
loginForm.$bind({
  '#email': 'values.email',
  '#password': 'values.password',
  '.error-email': 'errors.email',
  '#submitBtn': {
    disabled: () => !loginForm.isValid
  }
});
```

### Example 3: Todo List
```javascript
const todos = ReactiveUtils.collection([]);

todos.$computed('remaining', function() {
  return this.items.filter(t => !t.done).length;
});

// Add todo
function addTodo(text) {
  todos.$add({
    id: Date.now(),
    text,
    done: false
  });
}

// Toggle todo
function toggleTodo(id) {
  todos.$update(
    t => t.id === id,
    { done: !todos.items.find(t => t.id === id).done }
  );
}

// Bind to DOM
todos.$bind({
  '#todoCount': () => `${todos.remaining} remaining`
});
```

### Example 4: API Data Fetching
```javascript
const userData = ReactiveUtils.async(null);

async function loadUser(id) {
  await userData.$execute(async () => {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  });
}

// Bind loading states
userData.$bind({
  '#loading': {
    hidden: () => !userData.loading
  },
  '#error': {
    hidden: () => !userData.error,
    textContent: () => userData.error?.message || ''
  },
  '#userData': {
    hidden: () => !userData.isSuccess,
    innerHTML: () => userData.data 
      ? `<h2>${userData.data.name}</h2>`
      : ''
  }
});
```

This module provides a complete reactive state management system deeply integrated with DOM Helpers!