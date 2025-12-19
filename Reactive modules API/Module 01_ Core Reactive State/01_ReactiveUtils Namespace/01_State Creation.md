# Reactive Library - Teaching Documentation

## Table of Contents

### Part 1: State Creation Methods
1. [ReactiveUtils.state()](#1-reactiveutilsstate)
2. [ReactiveUtils.createState()](#2-reactiveutilscreatestate)
3. [ReactiveUtils.ref()](#3-reactiveutilsref)
4. [ReactiveUtils.refs()](#4-reactiveutilsrefs)
5. [ReactiveUtils.collection()](#5-reactiveutilscollection)
6. [ReactiveUtils.list()](#6-reactiveutilslist)
7. [ReactiveUtils.form()](#7-reactiveutilsform)
8. [ReactiveUtils.async()](#8-reactiveutilsasync)
9. [ReactiveUtils.store()](#9-reactiveutilsstore)
10. [ReactiveUtils.component()](#10-reactiveutilscomponent)
11. [ReactiveUtils.reactive()](#11-reactiveutilsreactive)

---

## Part 1: State Creation Methods

---

## 1. ReactiveUtils.state()

### The Problem in Plain JavaScript

```javascript
// Normal JavaScript object
const counter = {
  count: 0,
  doubled: 0
};

// Update the count
counter.count = 5;

// Problem: doubled doesn't update automatically!
// You have to remember to update it manually
counter.doubled = counter.count * 2;

// Problem: The DOM doesn't know anything changed
document.getElementById('count').textContent = counter.count;
document.getElementById('doubled').textContent = counter.doubled;
```

**What goes wrong:**
- JavaScript has no idea you changed `counter.count`
- Nothing happens automatically
- You must manually update everything that depends on `count`
- You must manually update the DOM
- If you forget any step, your app shows wrong data
- As your app grows, this becomes unmaintainable

### Why This Feature Exists

In a real app, one piece of data might affect:
- Other computed values
- Multiple DOM elements
- Network requests
- LocalStorage
- Analytics tracking

Manually tracking all these connections is impossible. You need JavaScript to **notice when data changes** and **automatically update everything that depends on it**.

### What ReactiveUtils.state() Is

**One sentence:** `ReactiveUtils.state()` wraps a normal JavaScript object and makes it "reactive" - it automatically tracks who reads the data and notifies them when the data changes.

### The Mental Model

Think of your state object as a **radio station**:

- When you **read** a property (like `state.count`), you're **tuning in** to that channel
- When you **write** to a property (like `state.count = 5`), the radio station **broadcasts** to everyone listening
- Code that reads the property automatically becomes a **listener**
- Listeners automatically re-run when the data they depend on changes

```
Normal Object:          Reactive State:
┌──────────┐           ┌──────────────┐
│ count: 0 │           │ count: 0     │ ← broadcasts changes
└──────────┘           │              │
     ↓                 └──────┬───────┘
  Nothing!                    ↓
                         Listeners automatically
                         update when count changes
```

### Basic Usage

```javascript
// Create reactive state
const state = ReactiveUtils.state({
  count: 0
});

// Read the value (works like normal)
console.log(state.count); // 0

// Write to it (works like normal)
state.count = 5;

// But now it's reactive!
// We can create an "effect" that automatically re-runs
ReactiveUtils.effect(() => {
  console.log('Count is:', state.count);
});
// Logs: "Count is: 5"

// Change the value
state.count = 10;
// Effect automatically re-runs!
// Logs: "Count is: 10"
```

**What just happened?**
1. We wrapped an object with `ReactiveUtils.state()`
2. We created an effect that reads `state.count`
3. When we change `state.count`, the effect **automatically re-runs**

### More Powerful Patterns

#### Pattern 1: Automatic DOM Updates

```javascript
const state = ReactiveUtils.state({
  username: '',
  age: 0
});

// This effect updates the DOM whenever state changes
ReactiveUtils.effect(() => {
  document.getElementById('username').textContent = state.username;
});

ReactiveUtils.effect(() => {
  document.getElementById('age').textContent = state.age;
});

// Change data - DOM updates automatically!
state.username = 'Alice';
state.age = 25;
```

**Why this is useful:**
- You write the update logic once
- It runs automatically forever
- No manual DOM manipulation
- No forgetting to update something

#### Pattern 2: Multiple Properties

```javascript
const state = ReactiveUtils.state({
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  city: 'New York'
});

// Effect only re-runs when firstName or lastName change
ReactiveUtils.effect(() => {
  const fullName = `${state.firstName} ${state.lastName}`;
  console.log('Full name:', fullName);
});

// This triggers the effect (uses firstName)
state.firstName = 'Jane'; // Logs: "Full name: Jane Doe"

// This does NOT trigger the effect (doesn't use city)
state.city = 'Boston'; // Nothing happens
```

**Key insight:** Effects are smart - they only re-run when the specific properties they read actually change.

#### Pattern 3: Nested Objects

```javascript
const state = ReactiveUtils.state({
  user: {
    name: 'Alice',
    profile: {
      bio: 'Developer',
      avatar: 'avatar.jpg'
    }
  }
});

// Works with nested properties too!
ReactiveUtils.effect(() => {
  console.log('Bio:', state.user.profile.bio);
});

state.user.profile.bio = 'Senior Developer';
// Effect automatically re-runs!
```

**Why this matters:** Real apps have complex nested data. Reactive state handles this automatically.

#### Pattern 4: Arrays

```javascript
const state = ReactiveUtils.state({
  todos: [
    { text: 'Learn reactive programming', done: false },
    { text: 'Build an app', done: false }
  ]
});

// Watch the entire array
ReactiveUtils.effect(() => {
  const count = state.todos.length;
  console.log(`You have ${count} todos`);
});

// Add a new todo
state.todos.push({ text: 'Deploy to production', done: false });
// Effect re-runs! Logs: "You have 3 todos"

// Modify an existing todo
state.todos[0].done = true;
// Effect re-runs if it reads that specific todo!
```

### Important Rules and Common Mistakes

#### ❌ Mistake 1: Creating state inside effects

```javascript
// WRONG - creates new state on every run!
ReactiveUtils.effect(() => {
  const state = ReactiveUtils.state({ count: 0 }); // DON'T DO THIS
  console.log(state.count);
});
```

**Why it fails:** You're creating a brand new state object every time the effect runs.

**Fix:** Create state outside, use it inside:
```javascript
// RIGHT
const state = ReactiveUtils.state({ count: 0 });

ReactiveUtils.effect(() => {
  console.log(state.count); // This is correct
});
```

#### ❌ Mistake 2: Not reading properties inside effects

```javascript
const state = ReactiveUtils.state({ count: 0 });

// This doesn't work!
const count = state.count; // Read happens OUTSIDE the effect

ReactiveUtils.effect(() => {
  console.log(count); // Using the old value, not reactive!
});

state.count = 10; // Effect won't re-run!
```

**Why it fails:** The effect never actually reads `state.count`, so it doesn't know to listen for changes.

**Fix:** Read properties inside the effect:
```javascript
ReactiveUtils.effect(() => {
  console.log(state.count); // NOW it's tracking!
});
```

#### ❌ Mistake 3: Expecting methods to be tracked

```javascript
const state = ReactiveUtils.state({
  items: [1, 2, 3],
  getTotal() {
    return this.items.reduce((sum, n) => sum + n, 0);
  }
});

ReactiveUtils.effect(() => {
  // This might not work as expected with methods
  const total = state.getTotal();
});
```

**Why it fails:** Methods can be tricky with reactivity context.

**Fix:** Access properties directly or use computed (covered later):
```javascript
ReactiveUtils.effect(() => {
  const total = state.items.reduce((sum, n) => sum + n, 0);
});
```

#### ✅ Rule 1: One state per logical unit

```javascript
// GOOD - one state for related data
const userState = ReactiveUtils.state({
  name: 'Alice',
  email: 'alice@example.com',
  age: 30
});

const cartState = ReactiveUtils.state({
  items: [],
  total: 0
});

// NOT GOOD - mixing unrelated data
const state = ReactiveUtils.state({
  userName: 'Alice',
  userEmail: 'alice@example.com',
  cartItems: [],
  cartTotal: 0,
  currentPage: 'home',
  isLoading: false
  // Too many unrelated things!
});
```

### One-Sentence Summary

`ReactiveUtils.state()` transforms a plain object into a reactive one that automatically notifies and updates any code that reads its properties whenever those properties change.

---

## 2. ReactiveUtils.createState()

### The Problem in Plain JavaScript

```javascript
// You have state
const state = {
  count: 0,
  message: ''
};

// You have DOM elements
const counterEl = document.getElementById('counter');
const messageEl = document.getElementById('message');

// You write update functions
function updateCounter() {
  counterEl.textContent = state.count;
}

function updateMessage() {
  messageEl.textContent = state.message;
}

// You update state
state.count = 5;
updateCounter(); // Must remember to call

state.message = 'Hello';
updateMessage(); // Must remember to call

// Problem: You must remember to:
// 1. Create the state
// 2. Create the update functions
// 3. Call the right update function after changing state
// 4. Connect everything manually
```

**What goes wrong:**
- You forget to call an update function → DOM shows old data
- You call the wrong update function → wrong element updates
- You have to write a lot of repetitive code
- Every new property needs its own update function
- It's tedious and error-prone

### Why This Feature Exists

90% of the time, you want to:
1. Create reactive state
2. Automatically bind it to specific DOM elements

Writing this connection manually every time is repetitive. `createState()` does both steps in one call - it creates the state AND sets up the automatic DOM bindings.

### What ReactiveUtils.createState() Is

**One sentence:** `createState()` creates a reactive state and automatically connects specific properties to specific DOM elements, so the DOM updates whenever the state changes - all in one function call.

### The Mental Model

Think of it as a **direct wire** between state and DOM:

```
Without createState():           With createState():
┌────────────┐                  ┌────────────┐
│ State      │                  │ State      │
│ count: 5   │                  │ count: 5   │───┐
└────────────┘                  └────────────┘   │
      ↓                                           │ Auto-wired!
  You write                                       │
  update code                                     ↓
      ↓                                      ┌─────────────┐
┌─────────────┐                             │ DOM Element │
│ DOM Element │                             │ #counter    │
│ #counter    │                             └─────────────┘
└─────────────┘
```

### Basic Usage

```javascript
// Old way - two steps:
const state = ReactiveUtils.state({ count: 0 });
ReactiveUtils.effect(() => {
  document.getElementById('counter').textContent = state.count;
});

// New way - one step:
const state = ReactiveUtils.createState(
  { count: 0 },           // Initial state
  { '#counter': 'count' } // Bindings: element → property
);

// Now when you change count, #counter updates automatically!
state.count = 5; // DOM updates instantly
```

**What just happened?**
1. We created reactive state with `{ count: 0 }`
2. We told it: "Connect the `count` property to the `#counter` element"
3. Now they're automatically synchronized

### Understanding the Binding Format

The second parameter is an object that maps **selectors** to **properties**:

```javascript
{
  'selector': 'propertyName'
}
```

#### Format 1: Simple Property Binding

```javascript
const state = ReactiveUtils.createState(
  { username: 'Alice' },
  { '#username': 'username' }  // #username element shows state.username
);

state.username = 'Bob'; // #username element now shows "Bob"
```

#### Format 2: Multiple Bindings

```javascript
const state = ReactiveUtils.createState(
  {
    firstName: 'John',
    lastName: 'Doe',
    age: 30
  },
  {
    '#firstName': 'firstName',  // Three elements,
    '#lastName': 'lastName',    // three properties,
    '#age': 'age'               // all auto-bound
  }
);
```

#### Format 3: Nested Property Paths

```javascript
const state = ReactiveUtils.createState(
  {
    user: {
      profile: {
        name: 'Alice'
      }
    }
  },
  {
    '#username': 'user.profile.name'  // Dot notation for nested paths
  }
);

state.user.profile.name = 'Bob'; // #username updates!
```

#### Format 4: Computed Bindings with Functions

```javascript
const state = ReactiveUtils.createState(
  {
    firstName: 'John',
    lastName: 'Doe'
  },
  {
    '#fullName': () => `${state.firstName} ${state.lastName}`
  }
);

// When either firstName or lastName changes, #fullName updates
state.firstName = 'Jane'; // #fullName shows "Jane Doe"
```

#### Format 5: Multiple Properties per Element

```javascript
const state = ReactiveUtils.createState(
  {
    isVisible: true,
    message: 'Hello'
  },
  {
    '#message': {
      textContent: 'message',           // Bind textContent to message
      style: () => ({
        display: state.isVisible ? 'block' : 'none'
      })
    }
  }
);

state.isVisible = false; // Element's display becomes 'none'
state.message = 'Hi';    // Element's textContent becomes 'Hi'
```

### More Powerful Patterns

#### Pattern 1: Form Inputs

```javascript
const state = ReactiveUtils.createState(
  {
    email: '',
    password: ''
  },
  {
    '#email': {
      value: 'email'        // Bind input value to state
    },
    '#password': {
      value: 'password'
    }
  }
);

// Set up two-way binding (user types, state updates)
document.getElementById('email').addEventListener('input', (e) => {
  state.email = e.target.value;
});

// Now when state changes, input shows it
state.email = 'test@example.com'; // Input value updates
```

#### Pattern 2: Conditional Rendering

```javascript
const state = ReactiveUtils.createState(
  {
    isLoggedIn: false,
    username: ''
  },
  {
    '#loginButton': {
      style: () => ({
        display: state.isLoggedIn ? 'none' : 'block'
      })
    },
    '#welcomeMessage': {
      textContent: () => `Welcome, ${state.username}!`,
      style: () => ({
        display: state.isLoggedIn ? 'block' : 'none'
      })
    }
  }
);

// Toggle login state
state.isLoggedIn = true;
state.username = 'Alice';
// UI automatically updates to show welcome message and hide login button
```

#### Pattern 3: Lists and Classes

```javascript
const state = ReactiveUtils.createState(
  {
    items: ['Apple', 'Banana', 'Orange'],
    selectedIndex: 0
  },
  {
    '#itemList': {
      textContent: () => state.items.join(', ')
    },
    '#selectedItem': {
      textContent: () => state.items[state.selectedIndex],
      className: () => state.selectedIndex >= 0 ? 'highlight' : ''
    }
  }
);

state.selectedIndex = 1; // #selectedItem shows "Banana" with highlight class
```

#### Pattern 4: Dynamic Attributes

```javascript
const state = ReactiveUtils.createState(
  {
    imageUrl: 'photo1.jpg',
    altText: 'First photo'
  },
  {
    '#image': {
      src: 'imageUrl',
      alt: 'altText',
      className: () => state.imageUrl ? 'loaded' : 'loading'
    }
  }
);

state.imageUrl = 'photo2.jpg';
state.altText = 'Second photo';
// Image src, alt, and class all update automatically
```

### Important Rules and Common Mistakes

#### ❌ Mistake 1: Element doesn't exist yet

```javascript
// WRONG - HTML not loaded yet
const state = ReactiveUtils.createState(
  { count: 0 },
  { '#counter': 'count' }  // #counter doesn't exist yet!
);
```

**Why it fails:** The DOM element must exist when you create the binding.

**Fix:** Wait for DOM to load:
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const state = ReactiveUtils.createState(
    { count: 0 },
    { '#counter': 'count' }  // NOW #counter exists
  );
});
```

#### ❌ Mistake 2: Typo in property name

```javascript
const state = ReactiveUtils.createState(
  { count: 0 },
  { '#counter': 'countt' }  // Typo! Property doesn't exist
);

state.count = 5; // Binding doesn't work because 'countt' doesn't exist
```

**Fix:** Double-check property names match exactly:
```javascript
const state = ReactiveUtils.createState(
  { count: 0 },
  { '#counter': 'count' }  // Correct
);
```

#### ❌ Mistake 3: Forgetting the '#' for IDs

```javascript
// WRONG
const state = ReactiveUtils.createState(
  { count: 0 },
  { 'counter': 'count' }  // Missing '#'
);
```

**Fix:** Use proper CSS selectors:
```javascript
const state = ReactiveUtils.createState(
  { count: 0 },
  { '#counter': 'count' }     // ID selector
  // or
  { '.counter': 'count' }     // Class selector
  // or
  { 'div.counter': 'count' }  // Element + class
);
```

#### ❌ Mistake 4: Circular dependencies in functions

```javascript
const state = ReactiveUtils.createState(
  { count: 0 },
  {
    '#counter': () => {
      state.count++; // DON'T modify state in binding functions!
      return state.count;
    }
  }
);
```

**Why it fails:** The binding function modifies the very state it's watching, creating an infinite loop.

**Fix:** Binding functions should only read, never write:
```javascript
const state = ReactiveUtils.createState(
  { count: 0 },
  {
    '#counter': () => state.count  // Only read
  }
);

// Modify state elsewhere
state.count++; // This is fine
```

#### ✅ Rule 1: Bindings are one-way by default

```javascript
const state = ReactiveUtils.createState(
  { count: 0 },
  { '#counter': 'count' }
);

// State → DOM works automatically
state.count = 5; // ✅ DOM updates

// DOM → State doesn't work automatically
document.getElementById('counter').textContent = '10'; 
// ❌ state.count is still 5

// For two-way binding with inputs, add event listeners
const input = document.getElementById('counter');
input.addEventListener('input', (e) => {
  state.count = e.target.value; // Manually update state
});
```

#### ✅ Rule 2: You can still use regular state methods

```javascript
const state = ReactiveUtils.createState(
  { count: 0 },
  { '#counter': 'count' }
);

// All regular state methods still work
state.$computed('doubled', function() {
  return this.count * 2;
});

state.$watch('count', (newVal) => {
  console.log('Count changed to:', newVal);
});

// Bindings AND computed/watch all work together
```

### Comparing state() vs createState()

```javascript
// Option 1: ReactiveUtils.state() - More control, more code
const state1 = ReactiveUtils.state({ count: 0 });
ReactiveUtils.effect(() => {
  document.getElementById('counter').textContent = state1.count;
});

// Option 2: ReactiveUtils.createState() - Less code, automatic
const state2 = ReactiveUtils.createState(
  { count: 0 },
  { '#counter': 'count' }
);

// Both do the same thing, createState() is just more convenient
```

**When to use each:**
- Use `state()`: When you need custom effect logic, or bindings aren't simple
- Use `createState()`: When you want simple, direct property-to-DOM connections

### One-Sentence Summary

`ReactiveUtils.createState()` creates reactive state with automatic DOM bindings in a single call, connecting state properties directly to specific elements so they update together without manual synchronization code.

---

## 3. ReactiveUtils.ref()

### The Problem in Plain JavaScript

```javascript
// You want a single reactive value
let count = 0;

// You want to update the DOM when it changes
function updateDOM() {
  document.getElementById('counter').textContent = count;
}

// You update the value
count = 5;
updateDOM(); // Must manually call

count = 10;
updateDOM(); // Must manually call again

// Problems:
// 1. JavaScript doesn't know count changed
// 2. You must manually trigger updates
// 3. You can't track who's using this value
// 4. No automatic reactivity
```

**What goes wrong:**
- Primitive values (numbers, strings, booleans) can't be "watched"
- JavaScript can't detect when you write `count = 5`
- You have to manually propagate every change
- No way to make a single value reactive by itself

### Why This Feature Exists

Sometimes you don't need a whole object - you just need **one reactive value**. But JavaScript can't watch primitive values. The solution: wrap the value in an object that has a `.value` property. Now we can detect when `.value` changes and trigger updates.

### What ReactiveUtils.ref() Is

**One sentence:** `ref()` creates a reactive container for a single value, giving you a `.value` property that triggers updates whenever you read or write to it.

### The Mental Model

Think of a ref as a **box with a glass window**:

```
Normal Variable:        Ref:
   count = 5           ┌─────────────┐
       ↓               │   .value    │ ← You can see inside
   No way to           │     5       │ ← The actual value
   watch this!         └─────────────┘
                             ↓
                       System can detect
                       reads and writes
                       through .value
```

The ref is like putting your value in a transparent box. The box itself is an object (which CAN be watched), but you interact with the value inside through the `.value` window.

### Basic Usage

```javascript
// Create a ref
const count = ReactiveUtils.ref(0);

// Read the value through .value
console.log(count.value); // 0

// Write to it through .value
count.value = 5;
console.log(count.value); // 5

// Use in an effect
ReactiveUtils.effect(() => {
  console.log('Count is:', count.value);
});
// Logs: "Count is: 5"

// Change it - effect re-runs automatically
count.value = 10;
// Logs: "Count is: 10"
```

**What just happened?**
1. We created a ref with initial value `0`
2. We access the value through `.value`
3. When we change `.value`, effects automatically re-run
4. The ref makes a primitive value reactive

### Understanding the .value Property

```javascript
const count = ReactiveUtils.ref(0);

// The ref itself is an object
console.log(typeof count); // "object"

// The value is stored in .value
console.log(typeof count.value); // "number"

// ALWAYS use .value to read or write
count.value = 5;      // ✅ Correct
count = 5;            // ❌ Wrong! Overwrites the ref itself

// .value can be any type
const name = ReactiveUtils.ref('Alice');   // String
const isActive = ReactiveUtils.ref(true);  // Boolean
const items = ReactiveUtils.ref([1,2,3]);  // Array
const user = ReactiveUtils.ref({ name: 'Bob' }); // Object
```

### More Powerful Patterns

#### Pattern 1: Counter

```javascript
const count = ReactiveUtils.ref(0);

// Bind to DOM
ReactiveUtils.effect(() => {
  document.getElementById('counter').textContent = count.value;
});

// Increment function
function increment() {
  count.value++;
}

// Decrement function
function decrement() {
  count.value--;
}

// DOM updates automatically when either button is clicked
```

#### Pattern 2: Toggle States

```javascript
const isMenuOpen = ReactiveUtils.ref(false);

ReactiveUtils.effect(() => {
  const menu = document.getElementById('menu');
  menu.style.display = isMenuOpen.value ? 'block' : 'none';
});

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

// Menu shows/hides automatically
```

#### Pattern 3: Form Input Tracking

```javascript
const searchQuery = ReactiveUtils.ref('');

// Show what user typed
ReactiveUtils.effect(() => {
  console.log('User is searching for:', searchQuery.value);
});

// Two-way binding with input
const input = document.getElementById('search');
input.addEventListener('input', (e) => {
  searchQuery.value = e.target.value;
});

// Effect runs whenever user types
```

#### Pattern 4: Computed Values from Refs

```javascript
const firstName = ReactiveUtils.ref('John');
const lastName = ReactiveUtils.ref('Doe');

// Combine refs in an effect
ReactiveUtils.effect(() => {
  const fullName = `${firstName.value} ${lastName.value}`;
  document.getElementById('fullName').textContent = fullName;
});

// Change either name - effect updates
firstName.value = 'Jane'; // DOM shows "Jane Doe"
lastName.value = 'Smith';  // DOM shows "Jane Smith"
```

#### Pattern 5: Refs with Objects

```javascript
const user = ReactiveUtils.ref({
  name: 'Alice',
  age: 30
});

// Access nested properties
console.log(user.value.name); // 'Alice'

// Update nested properties
user.value.name = 'Bob';

// Or replace the entire object
user.value = {
  name: 'Charlie',
  age: 25
};

// Effects detect both kinds of changes
ReactiveUtils.effect(() => {
  console.log('User:', user.value.name);
});
```

### Important Rules and Common Mistakes

#### ❌ Mistake 1: Forgetting .value

```javascript
const count = ReactiveUtils.ref(0);

// WRONG - accessing the ref itself
console.log(count);  // Shows the ref object, not the value
count = 5;           // Overwrites the entire ref!

// RIGHT - accessing through .value
console.log(count.value);  // 0
count.value = 5;           // Updates the value correctly
```

**Why it fails:** Without `.value`, you're working with the container, not the value inside.

#### ❌ Mistake 2: Using refs in conditionals incorrectly

```javascript
const count = ReactiveUtils.ref(5);

// WRONG
if (count) {  // This checks if the ref exists (always true!)
  console.log('Has count');
}

// RIGHT
if (count.value > 0) {  // Check the actual value
  console.log('Count is positive');
}
```

#### ❌ Mistake 3: Comparing refs directly

```javascript
const count1 = ReactiveUtils.ref(5);
const count2 = ReactiveUtils.ref(5);

// WRONG - comparing ref objects
if (count1 === count2) { // Always false! Different objects
  console.log('Same count');
}

// RIGHT - comparing values
if (count1.value === count2.value) { // True! Both are 5
  console.log('Same count');
}
```

#### ❌ Mistake 4: Not using .value inside effects

```javascript
const count = ReactiveUtils.ref(0);

// WRONG - effect never reads .value
ReactiveUtils.effect(() => {
  console.log('Effect ran');  // Never tracks count
});

// RIGHT - effect reads .value
ReactiveUtils.effect(() => {
  console.log('Count is:', count.value);  // Tracks count.value
});
```

**Why it fails:** If you don't read `.value` inside the effect, the effect doesn't know to track that ref.

#### ✅ Rule 1: Always use .value

```javascript
const count = ReactiveUtils.ref(0);

// Reading
const current = count.value;       // ✅
const current = count;             // ❌

// Writing
count.value = 10;                  // ✅
count = 10;                        // ❌

// In conditions
if (count.value > 5) {}            // ✅
if (count > 5) {}                  // ❌

// In calculations
const doubled = count.value * 2;   // ✅
const doubled = count * 2;         // ❌ (might work due to valueOf, but avoid)
```

#### ✅ Rule 2: Refs work great with primitives

```javascript
// Perfect for simple values
const count = ReactiveUtils.ref(0);
const name = ReactiveUtils.ref('Alice');
const isActive = ReactiveUtils.ref(false);

// For complex objects, consider using state() instead
const user = ReactiveUtils.state({  // Better choice
  name: 'Alice',
  age: 30,
  email: 'alice@example.com'
});
```

#### ✅ Rule 3: Refs have valueOf and toString

```javascript
const count = ReactiveUtils.ref(42);

// These helper methods exist
console.log(count.valueOf());  // 42
console.log(count.toString()); // "42"

// So some operations work without .value
console.log(count + 10);  // 52 (uses valueOf)
console.log(`Count: ${count}`);  // "Count: 42" (uses toString)

// But be explicit for clarity
console.log(count.value + 10);  // Better - clearer intent
```

### When to Use Refs vs State

```javascript
// Use ref() for single values
const count = ReactiveUtils.ref(0);
const name = ReactiveUtils.ref('Alice');
const isLoggedIn = ReactiveUtils.ref(false);

// Use state() for multiple related values
const user = ReactiveUtils.state({
  name: 'Alice',
  email: 'alice@example.com',
  age: 30,
  isActive: true
});

// Not recommended - multiple unrelated refs
const count = ReactiveUtils.ref(0);
const name = ReactiveUtils.ref('Alice');
const email = ReactiveUtils.ref('alice@example.com');
// Better to group these in a state object
```

**Rule of thumb:**
- 1 value? Use `ref()`
- Multiple related values? Use `state()`
- Form data? Use `state()` or `form()`

### One-Sentence Summary

`ReactiveUtils.ref()` wraps a single value in a reactive container with a `.value` property, making primitives and individual values reactive so they can trigger automatic updates when changed.

---

## 4. ReactiveUtils.refs()

### The Problem in Plain JavaScript

```javascript
// You need multiple reactive values
let firstName = 'John';
let lastName = 'Doe';
let age = 30;
let email = 'john@example.com';

// If you use regular refs, it's repetitive
const firstName = ReactiveUtils.ref('John');
const lastName = ReactiveUtils.ref('Doe');
const age = ReactiveUtils.ref(30);
const email = ReactiveUtils.ref('john@example.com');

// Lots of typing ReactiveUtils.ref()
// What if you have 10 values? 20?

// Problems:
// 1. Very repetitive code
// 2. Easy to forget ReactiveUtils.ref() for one value
// 3. Verbose when you have many values
// 4. No clear grouping
```

**What goes wrong:**
- You write `ReactiveUtils.ref()` dozens of times
- Code becomes hard to read
- Easy to miss one value and break reactivity
- Tedious to set up multiple refs

### Why This Feature Exists

When you need multiple independent reactive values (not a single object), creating them one by one is tedious. `refs()` lets you **create many refs at once** from a single object definition, saving typing and making the code cleaner.

### What ReactiveUtils.refs() Is

**One sentence:** `refs()` creates multiple refs at once from an object definition, returning an object where each property is a ref with a `.value` property, eliminating repetitive ref creation code.

### The Mental Model

Think of it as a **ref factory**:

```
Instead of:                With refs():
const a = ref(1);         const { a, b, c } = refs({
const b = ref(2);           a: 1,
const c = ref(3);           b: 2,
const d = ref(4);           c: 3,
                            d: 4
12 lines of code          });
vs                         
4 lines of code
```

You define what you want in one object, and `refs()` creates all the refs for you in one go.

### Basic Usage

```javascript
// Old way - one at a time
const count = ReactiveUtils.ref(0);
const name = ReactiveUtils.ref('');
const isActive = ReactiveUtils.ref(false);

// New way - all at once
const { count, name, isActive } = ReactiveUtils.refs({
  count: 0,
  name: '',
  isActive: false
});

// Now use them exactly like regular refs
console.log(count.value);      // 0
console.log(name.value);       // ''
console.log(isActive.value);   // false

// Change them
count.value = 5;
name.value = 'Alice';
isActive.value = true;
```

**What just happened?**
1. We defined initial values in one object
2. `refs()` created a ref for each property
3. We destructured them for easy access
4. Each one works exactly like a ref created with `ref()`

### Understanding the Return Value

```javascript
// refs() returns an object
const myRefs = ReactiveUtils.refs({
  count: 0,
  name: 'Alice'
});

console.log(myRefs);
// {
//   count: ref(0),    // Each property is a ref
//   name: ref('Alice')
// }

// Access like an object
console.log(myRefs.count.value);  // 0
console.log(myRefs.name.value);   // 'Alice'

// Or destructure for convenience
const { count, name } = ReactiveUtils.refs({
  count: 0,
  name: 'Alice'
});

console.log(count.value);  // 0
console.log(name.value);   // 'Alice'
```

### More Powerful Patterns

#### Pattern 1: Form Fields

```javascript
// Instead of this:
const firstName = ReactiveUtils.ref('');
const lastName = ReactiveUtils.ref('');
const email = ReactiveUtils.ref('');
const age = ReactiveUtils.ref(0);
const agreeToTerms = ReactiveUtils.ref(false);

// Write this:
const {
  firstName,
  lastName,
  email,
  age,
  agreeToTerms
} = ReactiveUtils.refs({
  firstName: '',
  lastName: '',
  email: '',
  age: 0,
  agreeToTerms: false
});

// Use in effects
ReactiveUtils.effect(() => {
  const fullName = `${firstName.value} ${lastName.value}`;
  document.getElementById('fullName').textContent = fullName;
});

// Two-way binding with inputs
document.getElementById('firstName').addEventListener('input', (e) => {
  firstName.value = e.target.value;
});
```

#### Pattern 2: UI State Flags

```javascript
const {
  isMenuOpen,
  isLoading,
  isLoggedIn,
  hasError,
  showModal
} = ReactiveUtils.refs({
  isMenuOpen: false,
  isLoading: false,
  isLoggedIn: false,
  hasError: false,
  showModal: false
});

// Toggle functions
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function startLoading() {
  isLoading.value = true;
}

function stopLoading() {
  isLoading.value = false;
}

// Effects for each flag
ReactiveUtils.effect(() => {
  document.getElementById('menu').style.display = 
    isMenuOpen.value ? 'block' : 'none';
});

ReactiveUtils.effect(() => {
  document.getElementById('loader').style.display = 
    isLoading.value ? 'block' : 'none';
});
```

#### Pattern 3: Counters and Timers

```javascript
const {
  count,
  timer,
  score,
  lives
} = ReactiveUtils.refs({
  count: 0,
  timer: 60,
  score: 0,
  lives: 3
});

// Game logic
function incrementScore() {
  score.value += 10;
}

function loseLife() {
  lives.value--;
  if (lives.value === 0) {
    console.log('Game Over');
  }
}

// Timer countdown
setInterval(() => {
  if (timer.value > 0) {
    timer.value--;
  }
}, 1000);

// Effects update UI automatically
ReactiveUtils.effect(() => {
  document.getElementById('score').textContent = score.value;
  document.getElementById('lives').textContent = lives.value;
  document.getElementById('timer').textContent = timer.value;
});
```

#### Pattern 4: Theme and Settings

```javascript
const {
  theme,
  fontSize,
  language,
  notifications
} = ReactiveUtils.refs({
  theme: 'light',
  fontSize: 16,
  language: 'en',
  notifications: true
});

// Apply theme
ReactiveUtils.effect(() => {
  document.body.className = `theme-${theme.value}`;
});

// Apply font size
ReactiveUtils.effect(() => {
  document.body.style.fontSize = `${fontSize.value}px`;
});

// Functions to update settings
function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
}

function increaseFontSize() {
  fontSize.value++;
}

function decreaseFontSize() {
  fontSize.value--;
}
```

### Important Rules and Common Mistakes

#### ❌ Mistake 1: Forgetting to destructure

```javascript
// WRONG - accessing the wrapper object
const myRefs = ReactiveUtils.refs({
  count: 0,
  name: ''
});

console.log(myRefs.count);  // This is the ref object
myRefs.count = 5;            // Overwrites the ref!

// RIGHT - destructure or use .value
const { count, name } = ReactiveUtils.refs({
  count: 0,
  name: ''
});

console.log(count.value);  // Correct
count.value = 5;            // Correct

// Or without destructuring
console.log(myRefs.count.value);  // Also correct
myRefs.count.value = 5;            // Also correct
```

#### ❌ Mistake 2: Thinking it's different from ref()

```javascript
const { count } = ReactiveUtils.refs({ count: 0 });

// Some people think refs() creates different objects
// NO! It's exactly the same as:
const count = ReactiveUtils.ref(0);

// Both work identically
count.value = 5;  // Same for both
```

**Key insight:** `refs()` is just a shortcut. Each property is a normal ref.

#### ❌ Mistake 3: Nested objects in refs()

```javascript
// This works but might not be what you want
const { user } = ReactiveUtils.refs({
  user: {
    name: 'Alice',
    age: 30
  }
});

// Now user.value is the whole object
user.value = { name: 'Bob', age: 25 };  // Replaces entire object

// If you want reactive nested properties, use state() instead
const user = ReactiveUtils.state({
  name: 'Alice',
  age: 30
});

user.name = 'Bob';  // Can update individual properties
```

#### ❌ Mistake 4: Reusing variable names

```javascript
// WRONG - naming conflict
const name = 'Alice';

const { name } = ReactiveUtils.refs({  // Error! name already exists
  name: ''
});

// RIGHT - use different names or scope properly
const { userName } = ReactiveUtils.refs({
  userName: ''
});

// Or in a different scope
function setupRefs() {
  const { name } = ReactiveUtils.refs({
    name: ''
  });
  // ...
}
```

#### ✅ Rule 1: refs() is for multiple independent values

```javascript
// GOOD - multiple unrelated values
const {
  currentPage,
  isLoading,
  errorMessage,
  userCount
} = ReactiveUtils.refs({
  currentPage: 'home',
  isLoading: false,
  errorMessage: '',
  userCount: 0
});

// NOT GOOD - related values should be in state()
// These are all about the same user, use state() instead
const {
  userName,
  userEmail,
  userAge,
  userRole
} = ReactiveUtils.refs({
  userName: '',
  userEmail: '',
  userAge: 0,
  userRole: 'guest'
});

// BETTER
const user = ReactiveUtils.state({
  name: '',
  email: '',
  age: 0,
  role: 'guest'
});
```

#### ✅ Rule 2: Each ref is independent

```javascript
const { count, name } = ReactiveUtils.refs({
  count: 0,
  name: ''
});

// Changing one doesn't affect the other
ReactiveUtils.effect(() => {
  console.log('Count:', count.value);  // Only runs when count changes
});

ReactiveUtils.effect(() => {
  console.log('Name:', name.value);    // Only runs when name changes
});

count.value = 5;  // Only first effect runs
name.value = 'Alice';  // Only second effect runs
```

#### ✅ Rule 3: Use meaningful names

```javascript
// BAD - unclear names
const { a, b, c, d } = ReactiveUtils.refs({
  a: 0,
  b: '',
  c: false,
  d: []
});

// GOOD - clear names
const {
  itemCount,
  userName,
  isActive,
  selectedItems
} = ReactiveUtils.refs({
  itemCount: 0,
  userName: '',
  isActive: false,
  selectedItems: []
});
```

### Comparing ref() vs refs()

```javascript
// When you need 1-2 values, either works
const count = ReactiveUtils.ref(0);

const { count } = ReactiveUtils.refs({ count: 0 });

// When you need 3+ values, refs() is cleaner
// Option 1: Multiple ref() calls
const firstName = ReactiveUtils.ref('');
const lastName = ReactiveUtils.ref('');
const email = ReactiveUtils.ref('');
const age = ReactiveUtils.ref(0);
const city = ReactiveUtils.ref('');

// Option 2: One refs() call
const {
  firstName,
  lastName,
  email,
  age,
  city
} = ReactiveUtils.refs({
  firstName: '',
  lastName: '',
  email: '',
  age: 0,
  city: ''
});

// Both work identically, refs() is just less typing
```

### One-Sentence Summary

`ReactiveUtils.refs()` creates multiple independent refs from a single object definition, reducing boilerplate when you need many separate reactive values.

---

## 5. ReactiveUtils.collection()

### The Problem in Plain JavaScript

```javascript
// You have a list of items
let todos = [
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: true }
];

// You want to add an item
todos.push({ id: 3, text: 'Read book', done: false });

// You want to remove an item
const index = todos.findIndex(t => t.id === 2);
todos.splice(index, 1);

// You want to update an item
const todo = todos.find(t => t.id === 1);
todo.done = true;

// You want to display the list
function updateUI() {
  const list = todos.map(t => `<li>${t.text}</li>`).join('');
  document.getElementById('todoList').innerHTML = list;
}

// Problems:
// 1. Array changes don't trigger UI updates automatically
// 2. You must manually call updateUI() after every change
// 3. Array methods (push, splice, etc.) aren't reactive
// 4. Finding and updating items is verbose
// 5. No helper methods for common operations
```

**What goes wrong:**
- Arrays are hard to make reactive
- push(), pop(), splice() don't trigger updates
- You need lots of boilerplate for common operations
- Easy to forget to update the UI
- Code becomes repetitive and error-prone

### Why This Feature Exists

Working with lists is extremely common (todo lists, shopping carts, user lists, messages, etc.), but making arrays reactive is tricky. JavaScript can't detect when you call `array.push()`. `collection()` solves this by wrapping an array in a reactive object with helper methods that automatically trigger updates.

### What ReactiveUtils.collection() Is

**One sentence:** `collection()` creates a reactive wrapper around an array that provides helpful methods (add, remove, update) and automatically triggers updates when the array changes.

### The Mental Model

Think of a collection as a **smart list** with built-in operations:

```
Normal Array:              Collection:
┌────────────┐           ┌─────────────────┐
│ [1, 2, 3]  │           │ items: [1,2,3]  │
│            │           │                 │
│ array.push │           │ $add()          │ ← Smart methods
│ array.find │           │ $remove()       │   trigger updates
│ manual     │           │ $update()       │   automatically
│ everything │           │ $clear()        │
└────────────┘           └─────────────────┘
```

Instead of raw array methods, you use collection methods that handle reactivity for you.

### Basic Usage

```javascript
// Create a collection
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: true }
]);

// Access the actual array through .items
console.log(todos.items);
// [{ id: 1, text: 'Buy milk', done: false }, ...]

// Add an item
todos.$add({ id: 3, text: 'Read book', done: false });

// Remove an item by value
todos.$remove({ id: 2, text: 'Walk dog', done: true });

// Or remove by predicate function
todos.$remove(t => t.id === 2);

// Update an item
todos.$update(t => t.id === 1, { done: true });

// Clear all items
todos.$clear();

// Auto-update UI when collection changes
ReactiveUtils.effect(() => {
  const html = todos.items
    .map(t => `<li>${t.text}</li>`)
    .join('');
  document.getElementById('todoList').innerHTML = html;
});
```

**What just happened?**
1. We created a collection with initial items
2. We used `$add()`, `$remove()`, etc. - these trigger reactivity
3. The effect automatically re-runs when the collection changes
4. No manual UI updates needed!

### Understanding Collection Structure

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Learn reactive' }
]);

// The collection is an object with:
console.log(typeof todos);  // "object"

// .items contains the actual array
console.log(Array.isArray(todos.items));  // true

// Methods are prefixed with $
todos.$add({ id: 2, text: 'Build app' });      // Add
todos.$remove(t => t.id === 1);                 // Remove
todos.$update(t => t.id === 2, { done: true }); // Update
todos.$clear();                                 // Clear

// You access items through .items
todos.items.forEach(todo => console.log(todo.text));
```

### Collection Methods

#### $add(item)
Add a single item to the end of the collection.

```javascript
const numbers = ReactiveUtils.collection([1, 2, 3]);

numbers.$add(4);
console.log(numbers.items); // [1, 2, 3, 4]

// Works with objects too
const users = ReactiveUtils.collection([]);
users.$add({ name: 'Alice', age: 30 });
users.$add({ name: 'Bob', age: 25 });
```

#### $remove(predicate)
Remove the first item that matches the predicate or value.

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk' },
  { id: 2, text: 'Walk dog' },
  { id: 3, text: 'Read book' }
]);

// Remove by predicate function
todos.$remove(t => t.id === 2);
// Now: [{ id: 1, ... }, { id: 3, ... }]

// Remove by direct value (uses indexOf)
const numbers = ReactiveUtils.collection([1, 2, 3]);
numbers.$remove(2);
// Now: [1, 3]
```

#### $update(predicate, updates)
Find an item and update its properties.

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false }
]);

// Find by predicate and update
todos.$update(
  t => t.id === 1,           // Find this item
  { done: true }              // Update these properties
);
// Now: { id: 1, text: 'Buy milk', done: true }

// You can update multiple properties
todos.$update(
  t => t.id === 1,
  { text: 'Buy organic milk', done: false }
);
```

#### $clear()
Remove all items from the collection.

```javascript
const numbers = ReactiveUtils.collection([1, 2, 3, 4, 5]);

numbers.$clear();
console.log(numbers.items); // []
console.log(numbers.items.length); // 0
```

### More Powerful Patterns

#### Pattern 1: Todo List

```javascript
let nextId = 1;

const todos = ReactiveUtils.collection([]);

// Add todo
function addTodo(text) {
  todos.$add({
    id: nextId++,
    text: text,
    done: false
  });
}

// Toggle done status
function toggleTodo(id) {
  const todo = todos.items.find(t => t.id === id);
  if (todo) {
    todos.$update(t => t.id === id, { done: !todo.done });
  }
}

// Remove todo
function removeTodo(id) {
  todos.$remove(t => t.id === id);
}

// Clear completed
function clearCompleted() {
  // Remove all done todos one by one
  // (We'll learn better ways in the collections extension)
  todos.items.filter(t => t.done).forEach(todo => {
    todos.$remove(todo);
  });
}

// Auto-render
ReactiveUtils.effect(() => {
  const html = todos.items.map(todo => `
    <li>
      <input type="checkbox" ${todo.done ? 'checked' : ''} 
             onchange="toggleTodo(${todo.id})">
      <span style="${todo.done ? 'text-decoration: line-through' : ''}">
        ${todo.text}
      </span>
      <button onclick="removeTodo(${todo.id})">Delete</button>
    </li>
  `).join('');
  
  document.getElementById('todoList').innerHTML = html;
});
```

#### Pattern 2: Shopping Cart

```javascript
const cart = ReactiveUtils.collection([]);

// Add item to cart
function addToCart(product) {
  // Check if already in cart
  const existing = cart.items.find(item => item.id === product.id);
  
  if (existing) {
    // Increase quantity
    cart.$update(
      item => item.id === product.id,
      { quantity: existing.quantity + 1 }
    );
  } else {
    // Add new item
    cart.$add({
      ...product,
      quantity: 1
    });
  }
}

// Update quantity
function setQuantity(productId, quantity) {
  if (quantity <= 0) {
    cart.$remove(item => item.id === productId);
  } else {
    cart.$update(
      item => item.id === productId,
      { quantity }
    );
  }
}

// Show cart total
ReactiveUtils.effect(() => {
  const total = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
});

// Show item count
ReactiveUtils.effect(() => {
  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cartCount').textContent = count;
});
```

#### Pattern 3: User List with Search

```javascript
const users = ReactiveUtils.collection([
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' }
]);

const searchQuery = ReactiveUtils.ref('');

// Filtered users based on search
ReactiveUtils.effect(() => {
  const query = searchQuery.value.toLowerCase();
  
  const filtered = query
    ? users.items.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      )
    : users.items;
  
  const html = filtered.map(user => `
    <div>
      <h3>${user.name}</h3>
      <p>${user.email}</p>
      <button onclick="removeUser(${user.id})">Remove</button>
    </div>
  `).join('');
  
  document.getElementById('userList').innerHTML = html;
});

function removeUser(id) {
  users.$remove(user => user.id === id);
}

// Search input binding
document.getElementById('search').addEventListener('input', (e) => {
  searchQuery.value = e.target.value;
});
```

#### Pattern 4: Message History

```javascript
const messages = ReactiveUtils.collection([]);
const MAX_MESSAGES = 100;

function addMessage(text, sender) {
  messages.$add({
    id: Date.now(),
    text,
    sender,
    timestamp: new Date()
  });
  
  // Keep only last 100 messages
  if (messages.items.length > MAX_MESSAGES) {
    messages.$remove(messages.items[0]);
  }
}

// Auto-scroll to bottom when new message arrives
ReactiveUtils.effect(() => {
  const container = document.getElementById('messages');
  
  const html = messages.items.map(msg => `
    <div class="message">
      <strong>${msg.sender}</strong>
      <p>${msg.text}</p>
      <small>${msg.timestamp.toLocaleTimeString()}</small>
    </div>
  `).join('');
  
  container.innerHTML = html;
  container.scrollTop = container.scrollHeight;
});
```

### Important Rules and Common Mistakes

#### ❌ Mistake 1: Modifying .items directly

```javascript
const todos = ReactiveUtils.collection([]);

// WRONG - doesn't trigger reactivity
todos.items.push({ text: 'Buy milk' });
todos.items.splice(0, 1);

// RIGHT - use collection methods
todos.$add({ text: 'Buy milk' });
todos.$remove(todos.items[0]);
```

**Why it fails:** Direct array mutations bypass the reactive system. Always use `$add()`, `$remove()`, etc.

#### ❌ Mistake 2: Forgetting to access .items

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk' }
]);

// WRONG - todos is the collection object, not the array
todos.forEach(t => console.log(t));  // Error! forEach doesn't exist

// RIGHT - use .items
todos.items.forEach(t => console.log(t));
```

#### ❌ Mistake 3: Using $update incorrectly

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false }
]);

// WRONG - passing the full object, not predicate
todos.$update({ id: 1 }, { done: true });  // Doesn't work

// RIGHT - use a predicate function
todos.$update(t => t.id === 1, { done: true });
```

#### ❌ Mistake 4: Expecting $remove to remove all matches

```javascript
const numbers = ReactiveUtils.collection([1, 2, 3, 2, 4]);

numbers.$remove(2);  // Only removes FIRST occurrence
console.log(numbers.items); // [1, 3, 2, 4]  - one 2 remains

// To remove all matches, you need to loop (or use extension methods)
while (numbers.items.includes(2)) {
  numbers.$remove(2);
}
```

#### ✅ Rule 1: Always use $ methods for mutations

```javascript
const items = ReactiveUtils.collection([]);

// ✅ These trigger reactivity
items.$add(newItem);
items.$remove(oldItem);
items.$update(predicate, updates);
items.$clear();

// ❌ These DON'T trigger reactivity
items.items.push(newItem);
items.items.pop();
items.items.splice(0, 1);
items.items = [];  // Overwrites the array!
```

#### ✅ Rule 2: You can read .items safely

```javascript
const todos = ReactiveUtils.collection([...]);

// ✅ Reading is fine
const count = todos.items.length;
const first = todos.items[0];
const completed = todos.items.filter(t => t.done);
const texts = todos.items.map(t => t.text);

// ✅ In effects, reading .items creates dependencies
ReactiveUtils.effect(() => {
  console.log('Todo count:', todos.items.length);
  // This effect re-runs when items are added/removed
});
```

#### ✅ Rule 3: Collection methods return the collection

```javascript
const items = ReactiveUtils.collection([]);

// Methods return the collection for chaining
items
  .$add({ id: 1, name: 'First' })
  .$add({ id: 2, name: 'Second' })
  .$add({ id: 3, name: 'Third' });

// But you usually don't need to chain
items.$add({ id: 1, name: 'First' });
items.$add({ id: 2, name: 'Second' });
```

### When to Use Collections

```javascript
// ✅ USE collection() for:
// - Lists that change over time
const todos = ReactiveUtils.collection([]);
const cartItems = ReactiveUtils.collection([]);
const messages = ReactiveUtils.collection([]);

// ❌ DON'T use collection() for:
// - Static arrays that rarely change
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']; // Just use regular array

// - Simple arrays in state
const user = ReactiveUtils.state({
  name: 'Alice',
  hobbies: ['reading', 'hiking']  // This is fine in state
});
```

**Rule of thumb:**
- Items added/removed/updated frequently? Use `collection()`
- Fixed or rarely changing? Use regular array in `state()`

### One-Sentence Summary

`ReactiveUtils.collection()` wraps an array in a reactive object with `$add()`, `$remove()`, `$update()`, and `$clear()` methods that automatically trigger updates, making list management reactive and convenient.

---

## 6. ReactiveUtils.list()

### Understanding list()

`ReactiveUtils.list()` is simply an **alias** for `ReactiveUtils.collection()`. They are exactly the same function.

```javascript
// These are identical
const todos1 = ReactiveUtils.collection([...]);
const todos2 = ReactiveUtils.list([...]);

// They work exactly the same way
todos1.$add(item);
todos2.$add(item);
```

### Why list() Exists

Some developers prefer the word "list" over "collection". The library provides both names so you can use whichever feels more natural.

### When to Use Which

```javascript
// Use "collection" if you prefer that term
const products = ReactiveUtils.collection([]);

// Use "list" if you prefer that term
const products = ReactiveUtils.list([]);

// Both work identically - it's just personal preference
```

**One-sentence summary:** `ReactiveUtils.list()` is an alias for `ReactiveUtils.collection()`, providing the same functionality with an alternative name for developer preference.

---

## 7. ReactiveUtils.form()

### The Problem in Plain JavaScript

```javascript
// You're building a form
const formData = {
  username: '',
  email: '',
  password: ''
};

const formErrors = {
  username: '',
  email: '',
  password: ''
};

const touchedFields = {
  username: false,
  email: false,
  password: false
};

// When user types
function handleInput(field, value) {
  formData[field] = value;
  touchedFields[field] = true;
  validateField(field, value);
  updateUI();
}

// Validation
function validateField(field, value) {
  if (field === 'username' && value.length < 3) {
    formErrors[field] = 'Username must be at least 3 characters';
  } else if (field === 'email' && !value.includes('@')) {
    formErrors[field] = 'Invalid email';
  } else {
    formErrors[field] = '';
  }
}

// Check if form is valid
function isFormValid() {
  return Object.values(formErrors).every(error => !error);
}

// Submit
function handleSubmit() {
  // Mark all as touched
  Object.keys(touchedFields).forEach(key => {
    touchedFields[key] = true;
  });
  
  // Validate all
  Object.keys(formData).forEach(key => {
    validateField(key, formData[key]);
  });
  
  if (isFormValid()) {
    // Submit...
  }
  
  updateUI();
}

// Update UI
function updateUI() {
  // Manually update each error message
  Object.keys(formErrors).forEach(field => {
    const errorEl = document.getElementById(`${field}Error`);
    if (touchedFields[field]) {
      errorEl.textContent = formErrors[field];
    }
  });
}

// Problems:
// 1. Managing three separate objects (data, errors, touched)
// 2. Manual validation logic everywhere
// 3. Manual UI updates
// 4. Lots of boilerplate
// 5. Easy to forget validation or UI updates
// 6. No reactivity
```

**What goes wrong:**
- Form state is spread across multiple objects
- Validation logic is manual and repetitive
- Tracking touched fields is tedious
- Checking form validity requires custom logic
- UI doesn't update automatically
- Lots of error-prone boilerplate code

### Why This Feature Exists

Forms are **everywhere** in web applications, but they require managing:
- Field values
- Validation errors
- Which fields have been touched
- Whether the form is valid
- Submit state

Doing this manually is tedious and repetitive. `form()` bundles all this into one reactive object with built-in methods for common form operations.

### What ReactiveUtils.form() Is

**One sentence:** `form()` creates a reactive form state that manages field values, errors, touched status, and validation state in one object with convenient methods for common form operations.

### The Mental Model

Think of a form state as a **smart clipboard with sections**:

```
Normal Form State:        Form State:
┌──────────────┐         ┌─────────────────────┐
│ values: {}   │         │ values: {}          │ ← Field values
│ errors: {}   │         │ errors: {}          │ ← Validation errors
│ touched: {}  │         │ touched: {}         │ ← Touched fields
│              │         │                     │
│ Manual       │         │ $setValue()         │ ← Smart methods
│ everything   │         │ $setError()         │   that manage
│              │         │ $reset()            │   everything
│              │         │                     │
│              │         │ isValid ✓           │ ← Computed
│              │         │ isDirty ✓           │   properties
└──────────────┘         └─────────────────────┘
```

Everything you need for a form in one place, with automatic reactivity.

### Basic Usage

```javascript
// Create a form with initial values
const loginForm = ReactiveUtils.form({
  username: '',
  password: ''
});

// Form structure:
console.log(loginForm.values);      // { username: '', password: '' }
console.log(loginForm.errors);      // {}
console.log(loginForm.touched);     // {}
console.log(loginForm.isSubmitting);// false

// Computed properties (automatically updated)
console.log(loginForm.isValid);  // true (no errors)
console.log(loginForm.isDirty);  // false (nothing touched)

// Set a field value
loginForm.$setValue('username', 'alice');
// Now:
// - loginForm.values.username = 'alice'
// - loginForm.touched.username = true
// - loginForm.isDirty = true

// Set an error
loginForm.$setError('username', 'Username is taken');
// Now:
// - loginForm.errors.username = 'Username is taken'
// - loginForm.isValid = false

// Clear an error
loginForm.$setError('username', null);
// or
loginForm.$setError('username', '');

// Reset the form
loginForm.$reset();
// Back to initial state
```

**What just happened?**
1. We created a form with initial field values
2. The form automatically manages values, errors, touched state
3. We use `$setValue()` and `$setError()` methods
4. Computed properties (`isValid`, `isDirty`) update automatically
5. Everything is reactive - UI can respond to changes

### Form Properties

#### values
Object containing all field values.

```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

console.log(form.values);
// { email: '', password: '' }

// Access specific value
console.log(form.values.email);  // ''

// In effects
ReactiveUtils.effect(() => {
  console.log('Email is:', form.values.email);
});
```

#### errors
Object containing validation error messages (if any).

```javascript
const form = ReactiveUtils.form({ email: '' });

// No errors initially
console.log(form.errors);  // {}

form.$setError('email', 'Invalid email');
console.log(form.errors);
// { email: 'Invalid email' }

form.$setError('email', null);  // Clear error
console.log(form.errors);  // {}
```

#### touched
Object tracking which fields the user has interacted with.

```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

// Nothing touched initially
console.log(form.touched);  // {}

form.$setValue('email', 'test@example.com');
console.log(form.touched);
// { email: true }

// Touched is used to show errors only after user interaction
```

#### isSubmitting
Boolean flag for submit state (you control this).

```javascript
const form = ReactiveUtils.form({ email: '' });

console.log(form.isSubmitting);  // false

// You set this during submit
form.isSubmitting = true;
// Show loading spinner...

// After submit completes
form.isSubmitting = false;
```

#### isValid (computed)
Automatically true when there are no errors, false otherwise.

```javascript
const form = ReactiveUtils.form({ email: '' });

console.log(form.isValid);  // true (no errors)

form.$setError('email', 'Invalid');
console.log(form.isValid);  // false

form.$setError('email', null);
console.log(form.isValid);  // true
```

#### isDirty (computed)
Automatically true when any field has been touched.

```javascript
const form = ReactiveUtils.form({ email: '' });

console.log(form.isDirty);  // false

form.$setValue('email', 'test@example.com');
console.log(form.isDirty);  // true (email was touched)
```

### Form Methods

#### $setValue(field, value)
Set a field value and mark it as touched.

```javascript
const form = ReactiveUtils.form({
  username: '',
  email: ''
});

form.$setValue('username', 'alice');
// - form.values.username = 'alice'
// - form.touched.username = true
```

#### $setError(field, error)
Set or clear a field error.

```javascript
const form = ReactiveUtils.form({ email: '' });

// Set error
form.$setError('email', 'Email is required');
console.log(form.errors.email);  // 'Email is required'

// Clear error (pass null or empty string)
form.$setError('email', null);
console.log(form.errors.email);  // undefined
```

#### $reset(newValues)
Reset form to initial or new values, clear errors and touched state.

```javascript
const form = ReactiveUtils.form({
  username: '',
  email: ''
});

form.$setValue('username', 'alice');
form.$setError('email', 'Invalid');

// Reset to initial values
form.$reset();
console.log(form.values);   // { username: '', email: '' }
console.log(form.errors);   // {}
console.log(form.touched);  // {}

// Or reset to new values
form.$reset({
  username: 'bob',
  email: 'bob@example.com'
});
```

### More Powerful Patterns

#### Pattern 1: Login Form with Validation

```javascript
const loginForm = ReactiveUtils.form({
  username: '',
  password: ''
});

// Validate on change
function handleUsernameChange(value) {
  loginForm.$setValue('username', value);
  
  if (!value) {
    loginForm.$setError('username', 'Username is required');
  } else if (value.length < 3) {
    loginForm.$setError('username', 'Username must be at least 3 characters');
  } else {
    loginForm.$setError('username', null);
  }
}

function handlePasswordChange(value) {
  loginForm.$setValue('password', value);
  
  if (!value) {
    loginForm.$setError('password', 'Password is required');
  } else if (value.length < 8) {
    loginForm.$setError('password', 'Password must be at least 8 characters');
  } else {
    loginForm.$setError('password', null);
  }
}

// Show errors only for touched fields
ReactiveUtils.effect(() => {
  if (loginForm.touched.username && loginForm.errors.username) {
    document.getElementById('usernameError').textContent = 
      loginForm.errors.username;
  } else {
    document.getElementById('usernameError').textContent = '';
  }
});

ReactiveUtils.effect(() => {
  if (loginForm.touched.password && loginForm.errors.password) {
    document.getElementById('passwordError').textContent = 
      loginForm.errors.password;
  } else {
    document.getElementById('passwordError').textContent = '';
  }
});

// Submit handler
async function handleSubmit(e) {
  e.preventDefault();
  
  // Validate all fields first
  handleUsernameChange(loginForm.values.username);
  handlePasswordChange(loginForm.values.password);
  
  if (!loginForm.isValid) {
    console.log('Form has errors');
    return;
  }
  
  loginForm.isSubmitting = true;
  
  try {
    await login(loginForm.values);
    loginForm.$reset();  // Clear form on success
  } catch (error) {
    loginForm.$setError('username', 'Invalid credentials');
  } finally {
    loginForm.isSubmitting = false;
  }
}

// Disable submit button when invalid or submitting
ReactiveUtils.effect(() => {
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = !loginForm.isValid || loginForm.isSubmitting;
});
```

#### Pattern 2: Registration Form

```javascript
const registerForm = ReactiveUtils.form({
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
});

// Email validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Email is required';
  } else if (!emailRegex.test(email)) {
    return 'Invalid email address';
  }
  return null;
}

// Password validation
function validatePassword(password) {
  if (!password) {
    return 'Password is required';
  } else if (password.length < 8) {
    return 'Password must be at least 8 characters';
  } else if (!/[A-Z]/.test(password)) {
    return 'Password must contain an uppercase letter';
  } else if (!/[0-9]/.test(password)) {
    return 'Password must contain a number';
  }
  return null;
}

// Confirm password validation
function validateConfirmPassword(confirmPassword, password) {
  if (!confirmPassword) {
    return 'Please confirm your password';
  } else if (confirmPassword !== password) {
    return 'Passwords do not match';
  }
  return null;
}

// Terms validation
function validateTerms(agreed) {
  if (!agreed) {
    return 'You must agree to the terms';
  }
  return null;
}

// Handle changes with validation
function handleChange(field, value) {
  registerForm.$setValue(field, value);
  
  let error = null;
  
  if (field === 'email') {
    error = validateEmail(value);
  } else if (field === 'password') {
    error = validatePassword(value);
    // Re-validate confirmPassword if it's been touched
    if (registerForm.touched.confirmPassword) {
      const confirmError = validateConfirmPassword(
        registerForm.values.confirmPassword,
        value
      );
      registerForm.$setError('confirmPassword', confirmError);
    }
  } else if (field === 'confirmPassword') {
    error = validateConfirmPassword(value, registerForm.values.password);
  } else if (field === 'agreeToTerms') {
    error = validateTerms(value);
  }
  
  registerForm.$setError(field, error);
}

// Auto-update error messages
ReactiveUtils.effect(() => {
  Object.keys(registerForm.values).forEach(field => {
    const errorEl = document.getElementById(`${field}Error`);
    if (errorEl) {
      if (registerForm.touched[field] && registerForm.errors[field]) {
        errorEl.textContent = registerForm.errors[field];
        errorEl.style.display = 'block';
      } else {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
    }
  });
});
```

#### Pattern 3: Multi-Step Form

```javascript
const currentStep = ReactiveUtils.ref(1);
const TOTAL_STEPS = 3;

const multiStepForm = ReactiveUtils.form({
  // Step 1
  firstName: '',
  lastName: '',
  
  // Step 2
  email: '',
  phone: '',
  
  // Step 3
  address: '',
  city: '',
  zipCode: ''
});

// Validation for each step
const stepValidators = {
  1: () => {
    const errors = [];
    if (!multiStepForm.values.firstName) {
      errors.push('firstName');
    }
    if (!multiStepForm.values.lastName) {
      errors.push('lastName');
    }
    return errors;
  },
  
  2: () => {
    const errors = [];
    if (!multiStepForm.values.email) {
      errors.push('email');
    }
    if (!multiStepForm.values.phone) {
      errors.push('phone');
    }
    return errors;
  },
  
  3: () => {
    const errors = [];
    if (!multiStepForm.values.address) {
      errors.push('address');
    }
    if (!multiStepForm.values.city) {
      errors.push('city');
    }
    if (!multiStepForm.values.zipCode) {
      errors.push('zipCode');
    }
    return errors;
  }
};

function validateCurrentStep() {
  const invalidFields = stepValidators[currentStep.value]();
  
  invalidFields.forEach(field => {
    multiStepForm.$setError(field, 'This field is required');
  });
  
  return invalidFields.length === 0;
}

function nextStep() {
  if (validateCurrentStep()) {
    currentStep.value++;
  }
}

function previousStep() {
  currentStep.value--;
}

// Show/hide steps based on currentStep
ReactiveUtils.effect(() => {
  document.querySelectorAll('.form-step').forEach((step, index) => {
    step.style.display = (index + 1) === currentStep.value ? 'block' : 'none';
  });
  
  // Show/hide buttons
  document.getElementById('prevBtn').style.display = 
    currentStep.value > 1 ? 'inline-block' : 'none';
    
  document.getElementById('nextBtn').style.display = 
    currentStep.value < TOTAL_STEPS ? 'inline-block' : 'none';
    
  document.getElementById('submitBtn').style.display = 
    currentStep.value === TOTAL_STEPS ? 'inline-block' : 'none';
});
```

### Important Rules and Common Mistakes

#### ❌ Mistake 1: Setting values directly

```javascript
const form = ReactiveUtils.form({ email: '' });

// WRONG - doesn't mark as touched
form.values.email = 'test@example.com';

// RIGHT - use $setValue
form.$setValue('email', 'test@example.com');
```

**Why it fails:** Direct assignment doesn't update the touched state.

#### ❌ Mistake 2: Not checking touched before showing errors

```javascript
// WRONG - shows errors immediately, even if user hasn't interacted
ReactiveUtils.effect(() => {
  document.getElementById('emailError').textContent = 
    form.errors.email || '';
});

// RIGHT - only show errors for touched fields
ReactiveUtils.effect(() => {
  const errorText = form.touched.email && form.errors.email 
    ? form.errors.email 
    : '';
  document.getElementById('emailError').textContent = errorText;
});
```

#### ❌ Mistake 3: Not validating before submit

```javascript
// WRONG - submits even if invalid
function handleSubmit() {
  form.isSubmitting = true;
  submitData(form.values);  // Might submit invalid data!
}

// RIGHT - validate first
function handleSubmit() {
  // Validate all fields
  Object.keys(form.values).forEach(field => {
    validateField(field);
  });
  
  if (!form.isValid) {
    console.log('Form has errors');
    return;
  }
  
  form.isSubmitting = true;
  submitData(form.values);
}
```

#### ❌ Mistake 4: Forgetting to reset after submit

```javascript
// WRONG - form keeps old data
async function handleSubmit() {
  await submitData(form.values);
  // Form still has old data
}

// RIGHT - reset on success
async function handleSubmit() {
  try {
    await submitData(form.values);
    form.$reset();  // Clear form
  } catch (error) {
    // Handle error
  }
}
```

#### ✅ Rule 1: Use $setValue for all updates

```javascript
// ✅ Always use $setValue
form.$setValue('email', value);

// ❌ Never assign directly (unless you know what you're doing)
form.values.email = value;
```

#### ✅ Rule 2: Validate on blur, not on every keystroke

```javascript
// Good UX - validate when user leaves field
input.addEventListener('blur', (e) => {
  const field = e.target.name;
  const value = e.target.value;
  form.$setValue(field, value);
  validateField(field);  // Validate on blur
});

// Or validate on change, but don't show error until touched
input.addEventListener('input', (e) => {
  const field = e.target.name;
  const value = e.target.value;
  form.$setValue(field, value);
  // Error will only show if field is touched
});
```

#### ✅ Rule 3: Form is just a reactive state

```javascript
const form = ReactiveUtils.form({ email: '' });

// You can still use all state methods
form.$watch('values', (newValues) => {
  console.log('Values changed:', newValues);
});

ReactiveUtils.effect(() => {
  console.log('Email is:', form.values.email);
});

// It's a regular reactive state with form-specific helpers
```

### One-Sentence Summary

`ReactiveUtils.form()` creates a reactive form state that manages field values, errors, touched status, and validation state with convenient methods for common form operations, making form handling automatic and consistent.

---

## 8. ReactiveUtils.async()

### The Problem in Plain JavaScript

```javascript
// You want to fetch data from an API
let data = null;
let loading = false;
let error = null;

async function fetchUser(id) {
  loading = true;
  error = null;
  updateUI();
  
  try {
    const response = await fetch(`/api/users/${id}`);
    data = await response.json();
    loading = false;
    updateUI();
  } catch (e) {
    error = e.message;
    loading = false;
    updateUI();
  }
}

function updateUI() {
  if (loading) {
    document.getElementById('content').innerHTML = 'Loading...';
  } else if (error) {
    document.getElementById('content').innerHTML = `Error: ${error}`;
  } else if (data) {
    document.getElementById('content').innerHTML = `
      <h2>${data.name}</h2>
      <p>${data.email}</p>
    `;
  }
}

// Problems:
// 1. Manually tracking three states (data, loading, error)
// 2. Must manually call updateUI() after every state change
// 3. No automatic UI updates
// 4. Easy to forget to set loading = false
// 5. No race condition handling (if two requests happen)
// 6. Lots of repetitive code for every async operation
```

**What goes wrong:**
- You track data, loading, and error separately
- You manually update UI after every change
- Race conditions can occur (old request finishes after new one)
- Easy to have loading stuck at true if you forget to set it false
- Very repetitive for multiple async operations

### Why This Feature Exists

Async operations (API calls, file uploads, etc.) always need the same three pieces of state:
- The **data** being loaded
- A **loading** flag
- An **error** if something went wrong

Manually managing these for every async operation is tedious. `async()` bundles them into one reactive object that automatically updates the UI and provides helpful computed properties.

### What ReactiveUtils.async() Is

**One sentence:** `async()` creates a reactive state that manages data, loading, and error for asynchronous operations, with an `$execute()` method that runs async functions and automatically updates all three states.

### The Mental Model

Think of async state as a **request tracker**:

```
Manual Async:             Async State:
┌──────────────┐         ┌──────────────────┐
│ data: null   │         │ data: null       │
│ loading: F   │         │ loading: false   │
│ error: null  │         │ error: null      │
│              │         │                  │
│ Set manually │         │ $execute(fn)     │ ← One method
│ everywhere   │         │ updates all 3!   │   manages all
│              │         │                  │
│              │         │ isSuccess ✓      │ ← Computed
│              │         │ isError ✓        │   states
└──────────────┘         └──────────────────┘
```

Instead of managing three variables, you call `$execute()` and it handles everything.

### Basic Usage

```javascript
// Create async state with initial data (usually null)
const userState = ReactiveUtils.async(null);

// Initial state
console.log(userState.data);     // null
console.log(userState.loading);  // false
console.log(userState.error);    // null

// Computed properties
console.log(userState.isSuccess); // false (no data yet)
console.log(userState.isError);   // false (no error)

// Execute an async function
userState.$execute(async () => {
  const response = await fetch('/api/user/1');
  return response.json();
});

// While fetching:
// userState.loading = true
// userState.error = null

// On success:
// userState.data = { id: 1, name: 'Alice', ... }
// userState.loading = false
// userState.isSuccess = true

// On error:
// userState.error = Error object
// userState.loading = false
// userState.isError = true

// Auto-update UI
ReactiveUtils.effect(() => {
  const content = document.getElementById('content');
  
  if (userState.loading) {
    content.innerHTML = 'Loading...';
  } else if (userState.error) {
    content.innerHTML = `Error: ${userState.error.message}`;
  } else if (userState.data) {
    content.innerHTML = `
      <h2>${userState.data.name}</h2>
      <p>${userState.data.email}</p>
    `;
  }
});
```

**What just happened?**
1. We created an async state with initial value null
2. We called `$execute()` with an async function
3. Async state automatically managed loading and error states
4. The effect automatically updated the UI based on current state
5. No manual state management needed!

### Async State Properties

#### data
The result of the async operation (null initially).

```javascript
const userState = ReactiveUtils.async(null);

console.log(userState.data);  // null initially

await userState.$execute(async () => {
  return { name: 'Alice', age: 30 };
});

console.log(userState.data);
// { name: 'Alice', age: 30 }
```

#### loading
Boolean flag indicating if an operation is in progress.

```javascript
const userState = ReactiveUtils.async(null);

console.log(userState.loading);  // false

// Start loading
userState.$execute(async () => {
  // During this function, loading is true
  await new Promise(r => setTimeout(r, 1000));
  return 'data';
});

// Check in effect
ReactiveUtils.effect(() => {
  if (userState.loading) {
    console.log('Loading...');
  }
});
```

#### error
Error object if the operation failed (null otherwise).

```javascript
const userState = ReactiveUtils.async(null);

console.log(userState.error);  // null

await userState.$execute(async () => {
  throw new Error('Failed to fetch');
});

console.log(userState.error);
// Error: Failed to fetch
```

#### isSuccess (computed)
True when data is loaded successfully (has data, not loading, no error).

```javascript
const userState = ReactiveUtils.async(null);

console.log(userState.isSuccess);  // false (no data)

await userState.$execute(async () => {
  return { name: 'Alice' };
});

console.log(userState.isSuccess);  // true
```

#### isError (computed)
True when there's an error (has error, not loading).

```javascript
const userState = ReactiveUtils.async(null);

console.log(userState.isError);  // false

await userState.$execute(async () => {
  throw new Error('Oops');
});

console.log(userState.isError);  // true
```

### Async State Methods

#### $execute(asyncFn)
Execute an async function and automatically manage loading, data, and error.

```javascript
const userState = ReactiveUtils.async(null);

// Execute returns a promise
const result = await userState.$execute(async () => {
  const response = await fetch('/api/user/1');
  return response.json();
});

console.log(result);  // The returned data

// With error handling
try {
  await userState.$execute(async () => {
    throw new Error('Failed');
  });
} catch (error) {
  // userState.error is also set
  console.log(userState.error);
}
```

#### $reset()
Reset to initial state (clears data, loading, error).

```javascript
const userState = ReactiveUtils.async(null);

await userState.$execute(async () => {
  return { name: 'Alice' };
});

console.log(userState.data);  // { name: 'Alice' }

userState.$reset();
console.log(userState.data);     // null
console.log(userState.loading);  // false
console.log(userState.error);    // null
```

### More Powerful Patterns

#### Pattern 1: Data Fetching

```javascript
const postsState = ReactiveUtils.async([]);

async function loadPosts() {
  await postsState.$execute(async () => {
    const response = await fetch('/api/posts');
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return response.json();
  });
}

// Auto-render posts
ReactiveUtils.effect(() => {
  const container = document.getElementById('posts');
  
  if (postsState.loading) {
    container.innerHTML = '<div class="spinner">Loading...</div>';
  } else if (postsState.error) {
    container.innerHTML = `
      <div class="error">
        Error: ${postsState.error.message}
        <button onclick="loadPosts()">Retry</button>
      </div>
    `;
  } else if (postsState.data) {
    container.innerHTML = postsState.data.map(post => `
      <article>
        <h2>${post.title}</h2>
        <p>${post.body}</p>
      </article>
    `).join('');
  }
});

// Load on page load
loadPosts();
```

#### Pattern 2: Form Submission

```javascript
const submitState = ReactiveUtils.async(null);

async function handleSubmit(formData) {
  await submitState.$execute(async () => {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      throw new Error('Submission failed');
    }
    
    return response.json();
  });
}

// Disable button while submitting
ReactiveUtils.effect(() => {
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = submitState.loading;
  submitBtn.textContent = submitState.loading ? 'Submitting...' : 'Submit';
});

//Show success message
ReactiveUtils.effect(() => {
  const message = document.getElementById('message');
  
  if (submitState.isSuccess) {
    message.textContent = 'Submitted successfully!';
    message.className = 'success';
  } else if (submitState.isError) {
    message.textContent = `Error: ${submitState.error.message}`;
    message.className = 'error';
  } else {
    message.textContent = '';
  }
});
```

#### Pattern 3: Search with Debounce

```javascript
const searchQuery = ReactiveUtils.ref('');
const searchResults = ReactiveUtils.async([]);

let searchTimeout;

async function performSearch(query) {
  await searchResults.$execute(async () => {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    return response.json();
  });
}

// Debounced search when query changes
ReactiveUtils.effect(() => {
  const query = searchQuery.value;
  
  clearTimeout(searchTimeout);
  
  if (!query) {
    searchResults.$reset();
    return;
  }
  
  searchTimeout = setTimeout(() => {
    performSearch(query);
  }, 300);
});

// Input binding
document.getElementById('search').addEventListener('input', (e) => {
  searchQuery.value = e.target.value;
});

// Render results
ReactiveUtils.effect(() => {
  const resultsEl = document.getElementById('results');
  
  if (!searchQuery.value) {
    resultsEl.innerHTML = '';
  } else if (searchResults.loading) {
    resultsEl.innerHTML = 'Searching...';
  } else if (searchResults.error) {
    resultsEl.innerHTML = `Error: ${searchResults.error.message}`;
  } else if (searchResults.data) {
    resultsEl.innerHTML = searchResults.data.length
      ? searchResults.data.map(r => `<div>${r.title}</div>`).join('')
      : 'No results found';
  }
});
```

#### Pattern 4: Pagination

```javascript
const currentPage = ReactiveUtils.ref(1);
const pageData = ReactiveUtils.async({ items: [], totalPages: 0 });

async function loadPage(page) {
  await pageData.$execute(async () => {
    const response = await fetch(`/api/items?page=${page}`);
    return response.json();
  });
}

// Load when page changes
ReactiveUtils.effect(() => {
  loadPage(currentPage.value);
});

// Render items
ReactiveUtils.effect(() => {
  const container = document.getElementById('items');
  
  if (pageData.loading) {
    container.innerHTML = 'Loading...';
  } else if (pageData.error) {
    container.innerHTML = `Error: ${pageData.error.message}`;
  } else if (pageData.data) {
    container.innerHTML = pageData.data.items
      .map(item => `<div>${item.name}</div>`)
      .join('');
  }
});

// Render pagination
ReactiveUtils.effect(() => {
  const pagination = document.getElementById('pagination');
  
  if (!pageData.data) return;
  
  const buttons = [];
  for (let i = 1; i <= pageData.data.totalPages; i++) {
    const isActive = i === currentPage.value;
    buttons.push(`
      <button 
        class="${isActive ? 'active' : ''}"
        onclick="currentPage.value = ${i}"
        ${pageData.loading ? 'disabled' : ''}
      >
        ${i}
      </button>
    `);
  }
  
  pagination.innerHTML = buttons.join('');
});
```

### Important Rules and Common Mistakes

#### ❌ Mistake 1: Not handling errors

```javascript
// WRONG - errors crash silently
userState.$execute(async () => {
  const response = await fetch('/api/user');
  return response.json();  // Might fail!
});

// RIGHT - check response and handle errors
userState.$execute(async () => {
  const response = await fetch('/api/user');
  
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }
  
  return response.json();
});
```

#### ❌ Mistake 2: Not using $reset between operations

```javascript
// WRONG - old data shows while loading new data
async function loadUser(id) {
  await userState.$execute(async () => {
    // While this loads, old user data is still shown
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  });
}

// RIGHT - reset before loading new data
async function loadUser(id) {
  userState.$reset();  // Clear old data first
  
  await userState.$execute(async () => {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  });
}
```

#### ❌ Mistake 3: Manually setting loading/error

```javascript
// WRONG - $execute manages these automatically
userState.loading = true;
userState.$execute(async () => {
  // ...
});

// RIGHT - $execute handles everything
userState.$execute(async () => {
  // loading is automatically set to true
  // error is automatically set to null
  // ...
});
```

#### ❌ Mistake 4: Not awaiting $execute

```javascript
// WRONG - doesn't wait for completion
function loadData() {
  userState.$execute(async () => {
    // ...
  });
  console.log('Done!');  // This runs immediately!
}

// RIGHT - await if you need to know when it's done
async function loadData() {
  await userState.$execute(async () => {
    // ...
  });
  console.log('Done!');  // Now this runs after completion
}
```

#### ✅ Rule 1: Always return data from $execute

```javascript
// ✅ Return the data
userState.$execute(async () => {
  const response = await fetch('/api/user');
  return response.json();  // RETURN the data
});

// ❌ Don't set data manually
userState.$execute(async () => {
  const response = await fetch('/api/user');
  const data = await response.json();
  userState.data = data;  // Wrong! $execute does this
});
```

#### ✅ Rule 2: Use computed properties for UI logic

```javascript
// ✅ Use isSuccess, isError
ReactiveUtils.effect(() => {
  if (userState.isSuccess) {
    showUser(userState.data);
  } else if (userState.isError) {
    showError(userState.error);
  } else if (userState.loading) {
    showLoading();
  }
});

// ❌ Don't manually check conditions
ReactiveUtils.effect(() => {
  if (!userState.loading && !userState.error && userState.data) {
    // This works but isSuccess is clearer
  }
});
```

#### ✅ Rule 3: One async state per independent operation

```javascript
// ✅ Separate states for separate operations
const userState = ReactiveUtils.async(null);
const postsState = ReactiveUtils.async([]);

// ❌ Don't reuse the same async state
const state = ReactiveUtils.async(null);
state.$execute(() => fetchUser());  // User
state.$execute(() => fetchPosts()); // Overwrites user!
```

### One-Sentence Summary

`ReactiveUtils.async()` creates a reactive state that manages data, loading, and error for async operations, with an `$execute()` method that automatically handles all three states and provides computed properties for common UI patterns.

---

## 9. ReactiveUtils.store()

### The Problem in Plain JavaScript

```javascript
// You have application state
const appState = {
  user: null,
  cart: [],
  theme: 'light'
};

// You have computed values
function getCartTotal() {
  return appState.cart.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
}

function getCartCount() {
  return appState.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function isLoggedIn() {
  return appState.user !== null;
}

// You have actions that modify state
function addToCart(product) {
  appState.cart.push({
    ...product,
    quantity: 1
  });
  updateUI();
}

function removeFromCart(productId) {
  const index = appState.cart.findIndex(item => item.id === productId);
  if (index !== -1) {
    appState.cart.splice(index, 1);
  }
  updateUI();
}

function login(user) {
  appState.user = user;
  updateUI();
}

function logout() {
  appState.user = null;
  appState.cart = [];
  updateUI();
}

// Update UI manually everywhere
function updateUI() {
  // Update cart count
  document.getElementById('cartCount').textContent = getCartCount();
  
  // Update cart total
  document.getElementById('cartTotal').textContent = '$' + getCartTotal().toFixed(2);
  
  // Show/hide user menu
  document.getElementById('userMenu').style.display = 
    isLoggedIn() ? 'block' : 'none';
}

// Problems:
// 1. State, getters, and actions are scattered everywhere
// 2. No structure or organization
// 3. Must manually call updateUI() after every change
// 4. Getters are just functions - not reactive
// 5. Actions can be called from anywhere - hard to track
// 6. No encapsulation
```

**What goes wrong:**
- State logic is disorganized and scattered
- You manually recompute values and update UI
- No clear separation between data, computed values, and actions
- Hard to maintain as the app grows
- Easy to forget to update something

### Why This Feature Exists

Large applications need a **centralized way** to manage state with:
- **State**: The data
- **Getters**: Computed values based on state
- **Actions**: Functions that modify state

This pattern (called a "store") keeps everything organized. `store()` creates a reactive store where getters automatically update and actions are clearly defined.

### What ReactiveUtils.store() Is

**One sentence:** `store()` creates a reactive state with computed getters and named actions, organizing state management into a structured, maintainable pattern where getters automatically update and actions are the only way to modify state.

### The Mental Model

Think of a store as a **central data hub**:

```
Scattered State:          Store:
┌──────────────┐         ┌───────────────────┐
│ state        │         │ State             │ ← Raw data
│ scattered    │         │ - user            │
│ everywhere   │         │ - cart            │
│              │         │                   │
│ functions    │         │ Getters           │ ← Computed
│ scattered    │         │ - cartTotal       │   (auto-update)
│ everywhere   │         │ - cartCount       │
│              │         │                   │
│ actions      │         │ Actions           │ ← Methods
│ scattered    │         │ - addToCart()     │   (organized)
│ everywhere   │         │ - removeFromCart()│
└──────────────┘         └───────────────────┘
```

Everything in one place, clearly organized, automatically reactive.

### Basic Usage

```javascript
// Create a store with state, getters, and actions
const cartStore = ReactiveUtils.store(
  // Initial state
  {
    items: [],
    user: null
  },
  
  // Options
  {
    // Getters - computed values
    getters: {
      cartTotal() {
        return this.items.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);
      },
      
      cartCount() {
        return this.items.reduce((sum, item) => {
          return sum + item.quantity;
        }, 0);
      },
      
      isLoggedIn() {
        return this.user !== null;
      }
    },
    
    // Actions - methods that modify state
    actions: {
      addToCart(state, product) {
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
      
      removeFromCart(state, productId) {
        const index = state.items.findIndex(item => item.id === productId);
        if (index !== -1) {
          state.items.splice(index, 1);
        }
      },
      
      login(state, user) {
        state.user = user;
      },
      
      logout(state) {
        state.user = null;
        state.items = [];
      }
    }
  }
);

// Access state
console.log(cartStore.items);      // []
console.log(cartStore.user);       // null

// Access getters (automatically computed)
console.log(cartStore.cartTotal);  // 0
console.log(cartStore.cartCount);  // 0
console.log(cartStore.isLoggedIn); // false

// Call actions
cartStore.addToCart({ id: 1, name: 'Book', price: 10 });
cartStore.addToCart({ id: 2, name: 'Pen', price: 2 });

// Getters automatically update
console.log(cartStore.cartCount);  // 2
console.log(cartStore.cartTotal);  // 12

// Auto-update UI
ReactiveUtils.effect(() => {
  document.getElementById('cartCount').textContent = cartStore.cartCount;
});

ReactiveUtils.effect(() => {
  document.getElementById('cartTotal').textContent = 
    '$' + cartStore.cartTotal.toFixed(2);
});
```

**What just happened?**
1. We defined state (items, user)
2. We defined getters (cartTotal, cartCount, isLoggedIn)
3. We defined actions (addToCart, removeFromCart, etc.)
4. Getters automatically compute and update when state changes
5. Actions are methods we can call to modify state
6. UI automatically updates through effects

### Store Structure

```javascript
const store = ReactiveUtils.store(
  // State - the raw data
  {
    count: 0,
    items: []
  },
  
  {
    // Getters - computed values
    getters: {
      // Getter functions have access to state via 'this'
      doubled() {
        return this.count * 2;
      }
    },
    
    // Actions - methods to modify state
    actions: {
      // Action functions receive state as first parameter
      increment(state) {
        state.count++;
      },
      
      incrementBy(state, amount) {
        state.count += amount;
      }
    }
  }
);

// Access state directly
store.count;        // 0
store.items;        // []

// Access getters (no parentheses - they're properties)
store.doubled;      // 0 (computed from count)

// Call actions (they're methods)
store.increment();
store.incrementBy(5);
```

### Understanding Getters

Getters are **computed properties** that automatically update:

```javascript
const userStore = ReactiveUtils.store(
  {
    firstName: 'John',
    lastName: 'Doe',
    age: 30
  },
  {
    getters: {
      // Getters use 'this' to access state
      fullName() {
        return `${this.firstName} ${this.lastName}`;
      },
      
      isAdult() {
        return this.age >= 18;
      },
      
      // Getters can use other getters
      greeting() {
        return `Hello, ${this.fullName}!`;
      }
    }
  }
);

// Access getters like properties (no ())
console.log(userStore.fullName);  // "John Doe"
console.log(userStore.isAdult);   // true
console.log(userStore.greeting);  // "Hello, John Doe!"

// Change state - getters automatically update
userStore.firstName = 'Jane';
console.log(userStore.fullName);  // "Jane Doe" - auto-updated!
console.log(userStore.greeting);  // "Hello, Jane Doe!" - auto-updated!
```

### Understanding Actions

Actions are **methods** that modify state:

```javascript
const counterStore = ReactiveUtils.store(
  {
    count: 0,
    history: []
  },
  {
    actions: {
      // Actions receive state as first parameter
      increment(state) {
        state.count++;
        state.history.push(`Incremented to ${state.count}`);
      },
      
      // Actions can accept additional parameters
      incrementBy(state, amount) {
        state.count += amount;
        state.history.push(`Incremented by ${amount} to ${state.count}`);
      },
      
      // Actions can be async
      async incrementAfterDelay(state, delay) {
        await new Promise(resolve => setTimeout(resolve, delay));
        state.count++;
      },
      
      // Actions can call other actions
      reset(state) {
        state.count = 0;
        state.history = [];
      }
    }
  }
);

// Call actions
counterStore.increment();
counterStore.incrementBy(5);
await counterStore.incrementAfterDelay(1000);
counterStore.reset();
```

### More Powerful Patterns

#### Pattern 1: Shopping Cart Store

```javascript
const cartStore = ReactiveUtils.store(
  // State
  {
    items: [],
    discount: 0,
    taxRate: 0.08
  },
  
  {
    // Getters
    getters: {
      subtotal() {
        return this.items.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);
      },
      
      discountAmount() {
        return this.subtotal * this.discount;
      },
      
      taxAmount() {
        return (this.subtotal - this.discountAmount) * this.taxRate;
      },
      
      total() {
        return this.subtotal - this.discountAmount + this.taxAmount;
      },
      
      itemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
      },
      
      isEmpty() {
        return this.items.length === 0;
      }
    },
    
    // Actions
    actions: {
      addItem(state, product) {
        const existing = state.items.find(item => item.id === product.id);
        
        if (existing) {
          existing.quantity++;
        } else {
          state.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
          });
        }
      },
      
      removeItem(state, productId) {
        const index = state.items.findIndex(item => item.id === productId);
        if (index !== -1) {
          state.items.splice(index, 1);
        }
      },
      
      updateQuantity(state, productId, quantity) {
        const item = state.items.find(item => item.id === productId);
        if (item) {
          if (quantity <= 0) {
            this.removeItem(state, productId);
          } else {
            item.quantity = quantity;
          }
        }
      },
      
      applyDiscount(state, discountPercent) {
        state.discount = Math.min(Math.max(discountPercent, 0), 1);
      },
      
      clearCart(state) {
        state.items = [];
        state.discount = 0;
      }
    }
  }
);

// Use the store
cartStore.addItem({ id: 1, name: 'Book', price: 20 });
cartStore.addItem({ id: 2, name: 'Pen', price: 2 });
cartStore.addItem({ id: 1, name: 'Book', price: 20 }); // Increases quantity

console.log(cartStore.itemCount);  // 3
console.log(cartStore.subtotal);   // 42
console.log(cartStore.total);      // 45.36 (with tax)

cartStore.applyDiscount(0.1); // 10% off
console.log(cartStore.total);      // 40.82

// Auto-update cart UI
ReactiveUtils.effect(() => {
  const cartEl = document.getElementById('cart');
  
  if (cartStore.isEmpty) {
    cartEl.innerHTML = '<p>Your cart is empty</p>';
  } else {
    cartEl.innerHTML = `
      <ul>
        ${cartStore.items.map(item => `
          <li>
            ${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
            <button onclick="cartStore.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
            <button onclick="cartStore.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            <button onclick="cartStore.removeItem(${item.id})">Remove</button>
          </li>
        `).join('')}
      </ul>
      <div>
        <p>Subtotal: $${cartStore.subtotal.toFixed(2)}</p>
        <p>Discount: -$${cartStore.discountAmount.toFixed(2)}</p>
        <p>Tax: $${cartStore.taxAmount.toFixed(2)}</p>
        <p><strong>Total: $${cartStore.total.toFixed(2)}</strong></p>
      </div>
    `;
  }
});
```

#### Pattern 2: User Authentication Store

```javascript
const authStore = ReactiveUtils.store(
  // State
  {
    user: null,
    token: null,
    loading: false,
    error: null
  },
  
  {
    // Getters
    getters: {
      isAuthenticated() {
        return this.user !== null && this.token !== null;
      },
      
      userRole() {
        return this.user?.role || 'guest';
      },
      
      isAdmin() {
        return this.userRole === 'admin';
      },
      
      userName() {
        return this.user?.name || 'Guest';
      }
    },
    
    // Actions
    actions: {
      async login(state, credentials) {
        state.loading = true;
        state.error = null;
        
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
          });
          
          if (!response.ok) {
            throw new Error('Login failed');
          }
          
          const data = await response.json();
          state.user = data.user;
          state.token = data.token;
          
          // Save to localStorage
          localStorage.setItem('token', data.token);
        } catch (error) {
          state.error = error.message;
        } finally {
          state.loading = false;
        }
      },
      
      logout(state) {
        state.user = null;
        state.token = null;
        state.error = null;
        localStorage.removeItem('token');
      },
      
      async checkAuth(state) {
        const token = localStorage.getItem('token');
        
        if (!token) return;
        
        state.loading = true;
        
        try {
          const response = await fetch('/api/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const user = await response.json();
            state.user = user;
            state.token = token;
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          state.error = error.message;
        } finally {
          state.loading = false;
        }
      }
    }
  }
);

// Check auth on page load
authStore.checkAuth();

// Auto-update UI based on auth state
ReactiveUtils.effect(() => {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userMenu = document.getElementById('userMenu');
  
  if (authStore.isAuthenticated) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    userMenu.style.display = 'block';
    userMenu.textContent = `Welcome, ${authStore.userName}!`;
  } else {
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    userMenu.style.display = 'none';
  }
});

// Admin-only content
ReactiveUtils.effect(() => {
  const adminPanel = document.getElementById('adminPanel');
  adminPanel.style.display = authStore.isAdmin ? 'block' : 'none';
});
```

#### Pattern 3: Todo List Store

```javascript
const todoStore = ReactiveUtils.store(
  // State
  {
    todos: [],
    filter: 'all', // 'all' | 'active' | 'completed'
    nextId: 1
  },
  
  {
    // Getters
    getters: {
      filteredTodos() {
        if (this.filter === 'active') {
          return this.todos.filter(t => !t.done);
        } else if (this.filter === 'completed') {
          return this.todos.filter(t => t.done);
        }
        return this.todos;
      },
      
      activeCount() {
        return this.todos.filter(t => !t.done).length;
      },
      
      completedCount() {
        return this.todos.filter(t => t.done).length;
      },
      
      allCompleted() {
        return this.todos.length > 0 && this.activeCount === 0;
      }
    },
    
    // Actions
    actions: {
      addTodo(state, text) {
        state.todos.push({
          id: state.nextId++,
          text,
          done: false
        });
      },
      
      removeTodo(state, id) {
        const index = state.todos.findIndex(t => t.id === id);
        if (index !== -1) {
          state.todos.splice(index, 1);
        }
      },
      
      toggleTodo(state, id) {
        const todo = state.todos.find(t => t.id === id);
        if (todo) {
          todo.done = !todo.done;
        }
      },
      
      editTodo(state, id, newText) {
        const todo = state.todos.find(t => t.id === id);
        if (todo) {
          todo.text = newText;
        }
      },
      
      clearCompleted(state) {
        state.todos = state.todos.filter(t => !t.done);
      },
      
      toggleAll(state) {
        const allCompleted = state.todos.every(t => t.done);
        state.todos.forEach(t => {
          t.done = !allCompleted;
        });
      },
      
      setFilter(state, filter) {
        state.filter = filter;
      }
    }
  }
);

// Use the store
todoStore.addTodo('Learn reactive programming');
todoStore.addTodo('Build an app');
todoStore.toggleTodo(1);

// Auto-render todos
ReactiveUtils.effect(() => {
  const list = document.getElementById('todoList');
  
  list.innerHTML = todoStore.filteredTodos.map(todo => `
    <li class="${todo.done ? 'completed' : ''}">
      <input type="checkbox" 
             ${todo.done ? 'checked' : ''}
             onchange="todoStore.toggleTodo(${todo.id})">
      <span>${todo.text}</span>
      <button onclick="todoStore.removeTodo(${todo.id})">Delete</button>
    </li>
  `).join('');
});

// Auto-update counts
ReactiveUtils.effect(() => {
  document.getElementById('activeCount').textContent = todoStore.activeCount;
  document.getElementById('completedCount').textContent = todoStore.completedCount;
});

// Auto-update filters
ReactiveUtils.effect(() => {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === todoStore.filter);
  });
});
```

### Important Rules and Common Mistakes

#### ❌ Mistake 1: Modifying state directly instead of using actions

```javascript
const store = ReactiveUtils.store(
  { count: 0 },
  {
    actions: {
      increment(state) {
        state.count++;
      }
    }
  }
);

// WRONG - bypassing actions
store.count++;

// RIGHT - use actions
store.increment();
```

**Why it matters:** Actions centralize logic. Direct mutation makes code harder to maintain.

#### ❌ Mistake 2: Calling getters with parentheses

```javascript
const store = ReactiveUtils.store(
  { count: 0 },
  {
    getters: {
      doubled() {
        return this.count * 2;
      }
    }
  }
);

// WRONG - getters are properties, not methods
console.log(store.doubled());  // Error!

// RIGHT - access as property
console.log(store.doubled);  // Correct
```

#### ❌ Mistake 3: Not using 'this' in getters

```javascript
// WRONG - state is not accessible without 'this'
const store = ReactiveUtils.store(
  { count: 0 },
  {
    getters: {
      doubled() {
        return count * 2;  // Error! count is undefined
      }
    }
  }
);

// RIGHT - use 'this'
const store = ReactiveUtils.store(
  { count: 0 },
  {
    getters: {
      doubled() {
        return this.count * 2;  // Correct
      }
    }
  }
);
```

#### ❌ Mistake 4: Not receiving state parameter in actions

```javascript
// WRONG - trying to use 'this' in actions
const store = ReactiveUtils.store(
  { count: 0 },
  {
    actions: {
      increment() {
        this.count++;  // 'this' might not be what you expect
      }
    }
  }
);

// RIGHT - use state parameter
const store = ReactiveUtils.store(
  { count: 0 },
  {
    actions: {
      increment(state) {
        state.count++;  // Correct
      }
    }
  }
);
```

#### ✅ Rule 1: Getters use 'this', Actions use state parameter

```javascript
const store = ReactiveUtils.store(
  { count: 0 },
  {
    getters: {
      doubled() {
        return this.count * 2;  // Use 'this'
      }
    },
    actions: {
      increment(state) {
        state.count++;  // Use 'state' parameter
      }
    }
  }
);
```

#### ✅ Rule 2: Getters should be pure (no side effects)

```javascript
// ✅ GOOD - pure getter
getters: {
  cartTotal() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
}

// ❌ BAD - getter with side effects
getters: {
  cartTotal() {
    console.log('Calculating total');  // Side effect!
    this.lastCalculated = Date.now();  // Modifying state!
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
}
```

#### ✅ Rule 3: Actions can be async

```javascript
const store = ReactiveUtils.store(
  { users: [] },
  {
    actions: {
      // ✅ Async actions work fine
      async loadUsers(state) {
        const response = await fetch('/api/users');
        state.users = await response.json();
      }
    }
  }
);

// Call async actions with await
await store.loadUsers();
```

### When to Use Stores

```javascript
// ✅ USE store() for:
// - Global application state
const appStore = ReactiveUtils.store({ theme: 'light', user: null }, {...});

// - Feature-specific state with complex logic
const cartStore = ReactiveUtils.store({ items: [] }, {...});

// ❌ DON'T use store() for:
// - Simple local component state
const count = ReactiveUtils.ref(0);  // Better for simple values

// - One-time data that doesn't change
const CONFIG = { apiUrl: '/api' };  // Just use a constant
```

**Rule of thumb:**
- Complex state with computed values and actions? Use `store()`
- Simple values or local state? Use `ref()` or `state()`

### One-Sentence Summary

`ReactiveUtils.store()` creates a structured reactive state with computed getters and named actions, organizing state management into a maintainable pattern where getters automatically update based on state changes and actions centralize state modification logic.

---

## 10. ReactiveUtils.component()

### The Problem in Plain JavaScript

```javascript
// You're building a counter component
let count = 0;
let doubled = 0;

// Setup function
function setupCounter() {
  // Initialize
  count = 0;
  doubled = 0;
  
  // Create watchers
  function updateDoubled() {
    doubled = count * 2;
    document.getElementById('doubled').textContent = doubled;
  }
  
  // Create effects
  function updateCountDisplay() {
    document.getElementById('count').textContent = count;
  }
  
  // Create actions
  window.increment = function() {
    count++;
    updateDoubled();
    updateCountDisplay();
  };
  
  window.decrement = function() {
    count--;
    updateDoubled();
    updateCountDisplay();
  };
  
  // Initial render
  updateDoubled();
  updateCountDisplay();
  
  // Bind events
  document.getElementById('incrementBtn').onclick = increment;
  document.getElementById('decrementBtn').onclick = decrement;
}

// Cleanup function (often forgotten!)
function cleanupCounter() {
  document.getElementById('incrementBtn').onclick = null;
  document.getElementById('decrementBtn').onclick = null;
  // What about watchers? Effects? Memory leaks!
}

// Problems:
// 1. State, computed, watchers, actions scattered everywhere
// 2. No clear component structure
// 3. Manual initialization
// 4. Manual cleanup (often forgotten = memory leaks)
// 5. No lifecycle hooks
// 6. Hard to reuse or compose
// 7. Global pollution (window.increment, window.decrement)
```

**What goes wrong:**
- Everything is scattered - state, computed values, effects, actions
- No clear initialization or cleanup lifecycle
- Memory leaks from forgotten cleanup
- Hard to organize and maintain
- Can't easily create multiple instances
- Global namespace pollution

### Why This Feature Exists

Components are **self-contained units** of state + logic + lifecycle. Every framework has them (React, Vue, etc.) because they:
- Organize related code together
- Have clear initialization and cleanup phases
- Prevent memory leaks with automatic cleanup
- Can be easily reused and composed

`component()` provides this structure in a simple, framework-free way.

### What ReactiveUtils.component() Is

**One sentence:** `component()` creates a self-contained reactive unit with state, computed properties, watchers, effects, bindings, actions, and lifecycle hooks (mounted/unmounted), with automatic cleanup to prevent memory leaks.

### The Mental Model

Think of a component as a **mini-application** with its own lifecycle:

```
Scattered Code:           Component:
┌──────────────┐         ┌─────────────────────┐
│ state        │         │ state: {...}        │ ← State
│ computed     │         │                     │
│ watchers     │         │ computed: {...}     │ ← Computed
│ effects      │         │                     │
│ actions      │         │ watch: {...}        │ ← Watchers
│ bindings     │         │                     │
│ setup()      │         │ effects: {...}      │ ← Effects
│ cleanup()    │         │                     │
│ scattered    │         │ bindings: {...}     │ ← Bindings
│ everywhere   │         │                     │
│              │         │ actions: {...}      │ ← Actions
│              │         │                     │
│              │         │ mounted() {...}     │ ← Lifecycle
│              │         │ unmounted() {...}   │
│              │         │                     │
│              │         │ $destroy()          │ ← Auto-cleanup
└──────────────┘         └─────────────────────┘
```

Everything organized in one place, with automatic lifecycle management.

### Basic Usage

```javascript
// Create a component
const counter = ReactiveUtils.component({
  // Initial state
  state: {
    count: 0
  },
  
  // Computed properties
  computed: {
    doubled() {
      return this.count * 2;
    }
  },
  
  // Watchers
  watch: {
    count(newValue, oldValue) {
      console.log(`Count changed from ${oldValue} to ${newValue}`);
    }
  },
  
  // Effects
  effects: {
    updateDisplay() {
      document.getElementById('count').textContent = this.count;
    }
  },
  
  // DOM bindings
  bindings: {
    '#doubled': () => counter.doubled
  },
  
  // Actions
  actions: {
    increment(state) {
      state.count++;
    },
    
    decrement(state) {
      state.count--;
    }
  },
  
  // Lifecycle: runs after component is created
  mounted() {
    console.log('Counter component mounted!');
    console.log('Initial count:', this.count);
  },
  
  // Lifecycle: runs when component is destroyed
  unmounted() {
    console.log('Counter component cleaned up!');
  }
});

// Use the component
console.log(counter.count);   // 0
console.log(counter.doubled); // 0

counter.increment();
console.log(counter.count);   // 1
console.log(counter.doubled); // 2

// Clean up when done (calls unmounted, removes all effects/watchers)
counter.$destroy();
```

**What just happened?**
1. We defined all component parts in one object
2. State, computed, watchers, effects all set up automatically
3. `mounted()` ran after initialization
4. `$destroy()` cleaned up everything, ran `unmounted()`
5. No memory leaks!

### Component Structure

```javascript
const myComponent = ReactiveUtils.component({
  // 1. State - initial reactive state
  state: {
    count: 0,
    name: ''
  },
  
  // 2. Computed - computed properties
  computed: {
    doubled() {
      return this.count * 2;
    }
  },
  
  // 3. Watch - watchers for state changes
  watch: {
    count(newVal, oldVal) {
      console.log('Count changed');
    }
  },
  
  // 4. Effects - reactive effects
  effects: {
    logCount() {
      console.log('Current count:', this.count);
    }
  },
  
  // 5. Bindings - DOM bindings
  bindings: {
    '#count': 'count',
    '#doubled': () => this.doubled
  },
  
  // 6. Actions - methods to modify state
  actions: {
    increment(state) {
      state.count++;
    }
  },
  
  // 7. Mounted - lifecycle hook (runs after creation)
  mounted() {
    console.log('Component ready!');
  },
  
  // 8. Unmounted - lifecycle hook (runs on destroy)
  unmounted() {
    console.log('Component destroyed!');
  }
});

// Access state and computed
myComponent.count;
myComponent.doubled;

// Call actions
myComponent.increment();

// Destroy (automatic cleanup)
myComponent.$destroy();
```

### Component Sections Explained

#### state
Initial reactive state for the component.

```javascript
const component = ReactiveUtils.component({
  state: {
    count: 0,
    name: 'Alice',
    items: []
  }
});

// Access state
console.log(component.count);  // 0
console.log(component.name);   // 'Alice'

// Modify state
component.count = 5;
component.name = 'Bob';
```

#### computed
Computed properties that automatically update.

```javascript
const component = ReactiveUtils.component({
  state: {
    firstName: 'John',
    lastName: 'Doe'
  },
  
  computed: {
    // Use 'this' to access state
    fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    
    // Can use other computed properties
    greeting() {
      return `Hello, ${this.fullName}!`;
    }
  }
});

console.log(component.fullName);   // "John Doe"
console.log(component.greeting);   // "Hello, John Doe!"

component.firstName = 'Jane';
console.log(component.fullName);   // "Jane Doe" - auto-updated!
```

#### watch
Watchers that run when specific properties change.

```javascript
const component = ReactiveUtils.component({
  state: {
    count: 0,
    name: ''
  },
  
  watch: {
    // Watch a single property
    count(newValue, oldValue) {
      console.log(`Count: ${oldValue} → ${newValue}`);
    },
    
    // Watch another property
    name(newValue, oldValue) {
      console.log(`Name: ${oldValue} → ${newValue}`);
    }
  }
});

component.count = 5;  // Logs: "Count: 0 → 5"
component.name = 'Alice';  // Logs: "Name:  → Alice"
```

#### effects
Reactive effects that run automatically.

```javascript
const component = ReactiveUtils.component({
  state: {
    count: 0
  },
  
  effects: {
    // Runs initially and whenever count changes
    logCount() {
      console.log('Current count:', this.count);
    },
    
    // Another effect
    updateTitle() {
      document.title = `Count: ${this.count}`;
    }
  }
});

// Effects run immediately
// Logs: "Current count: 0"

component.count = 5;
// Effects re-run automatically
// Logs: "Current count: 5"
// Title changes to "Count: 5"
```

#### bindings
DOM bindings for automatic UI updates.

```javascript
const component = ReactiveUtils.component({
  state: {
    message: 'Hello',
    count: 0
  },
  
  computed: {
    doubled() {
      return this.count * 2;
    }
  },
  
  bindings: {
    // Bind state to DOM
    '#message': 'message',
    '#count': 'count',
    
    // Bind computed to DOM
    '#doubled': () => component.doubled,
    
    // Multiple properties
    '#info': {
      textContent: () => `${component.message} - ${component.count}`,
      className: () => component.count > 5 ? 'high' : 'low'
    }
  }
});

// DOM updates automatically when state changes
component.count = 10;
```

#### actions
Methods to modify state (like store actions).

```javascript
const component = ReactiveUtils.component({
  state: {
    count: 0,
    history: []
  },
  
  actions: {
    // Actions receive state as first parameter
    increment(state) {
      state.count++;
      state.history.push(`Incremented to ${state.count}`);
    },
    
    incrementBy(state, amount) {
      state.count += amount;
      state.history.push(`Incremented by ${amount}`);
    },
    
    reset(state) {
      state.count = 0;
      state.history = [];
    }
  }
});

// Call actions
component.increment();
component.incrementBy(5);
component.reset();
```

#### mounted()
Lifecycle hook that runs after component is created.

```javascript
const component = ReactiveUtils.component({
  state: {
    count: 0
  },
  
  mounted() {
    // 'this' is the component state
    console.log('Component mounted!');
    console.log('Initial count:', this.count);
    
    // Good place to:
    // - Fetch initial data
    // - Set up external listeners
    // - Initialize third-party libraries
    
    // Example: fetch data
    fetch('/api/initial-count')
      .then(r => r.json())
      .then(data => {
        this.count = data.count;
      });
  }
});
```

#### unmounted()
Lifecycle hook that runs when component is destroyed.

```javascript
const component = ReactiveUtils.component({
  state: {
    intervalId: null
  },
  
  mounted() {
    // Start an interval
    this.intervalId = setInterval(() => {
      console.log('Tick');
    }, 1000);
  },
  
  unmounted() {
    // Clean up the interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
      console.log('Interval cleaned up');
    }
    
    // Good place to:
    // - Clear timers/intervals
    // - Remove external event listeners
    // - Cancel pending requests
    // - Clean up third-party libraries
  }
});

// Later...
component.$destroy();  // Runs unmounted()
```

#### $destroy()
Method to clean up the component and prevent memory leaks.

```javascript
const component = ReactiveUtils.component({
  state: { count: 0 },
  
  effects: {
    logCount() {
      console.log('Count:', this.count);
    }
  },
  
  unmounted() {
    console.log('Cleaning up...');
  }
});

// Use component...
component.count = 5;

// Clean up when done
component.$destroy();
// - Runs unmounted()
// - Removes all effects
// - Removes all watchers
// - Removes all bindings
// - Prevents memory leaks
```

### More Powerful Patterns

#### Pattern 1: Timer Component

```javascript
const timerComponent = ReactiveUtils.component({
  state: {
    seconds: 0,
    isRunning: false,
    intervalId: null
  },
  
  computed: {
    minutes() {
      return Math.floor(this.seconds / 60);
    },
    
    displaySeconds() {
      return this.seconds % 60;
    },
    
    formattedTime() {
      const m = String(this.minutes).padStart(2, '0');
      const s = String(this.displaySeconds).padStart(2, '0');
      return `${m}:${s}`;
    }
  },
  
  watch: {
    seconds(newVal) {
      // Play sound every 60 seconds
      if (newVal > 0 && newVal % 60 === 0) {
        console.log('Minute passed!');
      }
    }
  },
  
  effects: {
    updateDisplay() {
      document.getElementById('timer').textContent = this.formattedTime;
    }
  },
  
  bindings: {
    '#startBtn': {
      textContent: () => timerComponent.isRunning ? 'Pause' : 'Start'
    }
  },
  
  actions: {
    start(state) {
      if (state.isRunning) return;
      
      state.isRunning = true;
      state.intervalId = setInterval(() => {
        state.seconds++;
      }, 1000);
    },
    
    pause(state) {
      if (!state.isRunning) return;
      
      state.isRunning = false;
      if (state.intervalId) {
        clearInterval(state.intervalId);
        state.intervalId = null;
      }
    },
    
    reset(state) {
      this.pause(state);
      state.seconds = 0;
    },
    
    toggle(state) {
      if (state.isRunning) {
        this.pause(state);
      } else {
        this.start(state);
      }
    }
  },
  
  mounted() {
    console.log('Timer component mounted');
    
    // Bind buttons
    document.getElementById('startBtn').onclick = () => this.toggle();
    document.getElementById('resetBtn').onclick = () => this.reset();
  },
  
  unmounted() {
    // Clean up interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    // Remove event listeners
    document.getElementById('startBtn').onclick = null;
    document.getElementById('resetBtn').onclick = null;
    
    console.log('Timer component cleaned up');
  }
});

// Use the timer
timerComponent.start();

// Later... clean up
timerComponent.$destroy();
```

#### Pattern 2: Search Component with Debounce

```javascript
const searchComponent = ReactiveUtils.component({
  state: {
    query: '',
    results: [],
    loading: false,
    error: null,
    searchTimeout: null
  },
  
  computed: {
    hasQuery() {
      return this.query.trim().length > 0;
    },
    
    hasResults() {
      return this.results.length > 0;
    },
    
    isEmpty() {
      return !this.loading && !this.error && !this.hasResults && this.hasQuery;
    }
  },
  
  watch: {
    query(newQuery) {
      // Clear previous timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      
      // Reset if empty
      if (!newQuery.trim()) {
        this.results = [];
        this.error = null;
        return;
      }
      
      // Debounce search
      this.searchTimeout = setTimeout(() => {
        this.performSearch();
      }, 300);
    }
  },
  
  effects: {
    renderResults() {
      const container = document.getElementById('searchResults');
      
      if (this.loading) {
        container.innerHTML = '<div class="loading">Searching...</div>';
      } else if (this.error) {
        container.innerHTML = `<div class="error">${this.error}</div>`;
      } else if (this.isEmpty) {
        container.innerHTML = '<div class="empty">No results found</div>';
      } else if (this.hasResults) {
        container.innerHTML = this.results.map(result => `
          <div class="result">
            <h3>${result.title}</h3>
            <p>${result.description}</p>
          </div>
        `).join('');
      } else {
        container.innerHTML = '';
      }
    }
  },
  
  bindings: {
    '#searchInput': {
      value: 'query'
    }
  },
  
  actions: {
    async performSearch(state) {
      state.loading = true;
      state.error = null;
      
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(state.query)}`
        );
        
        if (!response.ok) {
          throw new Error('Search failed');
        }
        
        const data = await response.json();
        state.results = data.results;
      } catch (error) {
        state.error = error.message;
        state.results = [];
      } finally {
        state.loading = false;
      }
    },
    
    clearSearch(state) {
      state.query = '';
      state.results = [];
      state.error = null;
    }
  },
  
  mounted() {
    const input = document.getElementById('searchInput');
    
    // Two-way binding
    input.addEventListener('input', (e) => {
      this.query = e.target.value;
    });
    
    // Clear button
    document.getElementById('clearBtn').onclick = () => {
      this.clearSearch();
    };
    
    console.log('Search component mounted');
  },
  
  unmounted() {
    // Clear any pending timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    console.log('Search component cleaned up');
  }
});
```

#### Pattern 3: Form Component

```javascript
const formComponent = ReactiveUtils.component({
  state: {
    values: {
      email: '',
      password: '',
      rememberMe: false
    },
    
    errors: {
      email: '',
      password: ''
    },
    
    touched: {
      email: false,
      password: false
    },
    
    submitting: false
  },
  
  computed: {
    isValid() {
      return !this.errors.email && !this.errors.password;
    },
    
    canSubmit() {
      return this.isValid && 
             this.values.email && 
             this.values.password &&
             !this.submitting;
    }
  },
  
  watch: {
    'values.email'(newEmail) {
      if (this.touched.email) {
        this.validateEmail(newEmail);
      }
    },
    
    'values.password'(newPassword) {
      if (this.touched.password) {
        this.validatePassword(newPassword);
      }
    }
  },
  
  effects: {
    renderErrors() {
      // Email error
      const emailError = document.getElementById('emailError');
      emailError.textContent = 
        this.touched.email ? this.errors.email : '';
      
      // Password error
      const passwordError = document.getElementById('passwordError');
      passwordError.textContent = 
        this.touched.password ? this.errors.password : '';
    },
    
    updateSubmitButton() {
      const submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = !this.canSubmit;
      submitBtn.textContent = this.submitting ? 'Submitting...' : 'Submit';
    }
  },
  
  actions: {
    validateEmail(state, email) {
      if (!email) {
        state.errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        state.errors.email = 'Invalid email address';
      } else {
        state.errors.email = '';
      }
    },
    
    validatePassword(state, password) {
      if (!password) {
        state.errors.password = 'Password is required';
      } else if (password.length < 8) {
        state.errors.password = 'Password must be at least 8 characters';
      } else {
        state.errors.password = '';
      }
    },
    
    async submit(state) {
      // Mark all as touched
      state.touched.email = true;
      state.touched.password = true;
      
      // Validate all
      this.validateEmail(state, state.values.email);
      this.validatePassword(state, state.values.password);
      
      if (!this.isValid) {
        console.log('Form has errors');
        return;
      }
      
      state.submitting = true;
      
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: state.values.email,
            password: state.values.password,
            rememberMe: state.values.rememberMe
          })
        });
        
        if (!response.ok) {
          throw new Error('Login failed');
        }
        
        const data = await response.json();
        console.log('Login successful!', data);
        
        // Reset form
        state.values = { email: '', password: '', rememberMe: false };
        state.errors = { email: '', password: '' };
        state.touched = { email: false, password: false };
      } catch (error) {
        state.errors.email = error.message;
      } finally {
        state.submitting = false;
      }
    }
  },
  
  mounted() {
    const form = document.getElementById('loginForm');
    
    // Email input
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', (e) => {
      this.values.email = e.target.value;
    });
    emailInput.addEventListener('blur', () => {
      this.touched.email = true;
      this.validateEmail(this.values.email);
    });
    
    // Password input
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', (e) => {
      this.values.password = e.target.value;
    });
    passwordInput.addEventListener('blur', () => {
      this.touched.password = true;
      this.validatePassword(this.values.password);
    });
    
    // Remember me checkbox
    const rememberMeInput = document.getElementById('rememberMe');
    rememberMeInput.addEventListener('change', (e) => {
      this.values.rememberMe = e.target.checked;
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submit();
    });
    
    console.log('Form component mounted');
  },
  
  unmounted() {
    console.log('Form component cleaned up');
  }
});
```

### Important Rules and Common Mistakes

#### ❌ Mistake 1: Forgetting to call $destroy()

```javascript
const component = ReactiveUtils.component({
  state: { count: 0 },
  effects: {
    logCount() {
      console.log('Count:', this.count);
    }
  }
});

// Use component...

// WRONG - never destroyed, effects keep running = memory leak!
// Component is gone but effects still exist

// RIGHT - destroy when done
component.$destroy();
```

#### ❌ Mistake 2: Using arrow functions for computed/actions

```javascript
// WRONG - arrow functions don't have the right 'this'
const component = ReactiveUtils.component({
  state: { count: 0 },
  
  computed: {
    doubled: () => this.count * 2  // 'this' is wrong!
  },
  
  actions: {
    increment: (state) => state.count++  // Actually this works for actions
  }
});

// RIGHT - use regular functions for computed
const component = ReactiveUtils.component({
  state: { count: 0 },
  
  computed: {
    doubled() {  // Regular function
      return this.count * 2;
    }
  }
});
```

#### ❌ Mistake 3: Not cleaning up in unmounted()

```javascript
// WRONG - leaves interval running
const component = ReactiveUtils.component({
  state: { intervalId: null },
  
  mounted() {
    this.intervalId = setInterval(() => {
      console.log('Tick');
    }, 1000);
  }
  
  // Missing unmounted()!
});

component.$destroy();  // Interval still running!

// RIGHT - clean up properly
const component = ReactiveUtils.component({
  state: { intervalId: null },
  
  mounted() {
    this.intervalId = setInterval(() => {
      console.log('Tick');
    }, 1000);
  },
  
  unmounted() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
});
```

#### ❌ Mistake 4: Accessing component reference before it's created

```javascript
// WRONG - component doesn't exist yet
const component = ReactiveUtils.component({
  state: { count: 0 },
  
  bindings: {
    '#count': () => component.count  // component is undefined!
  }
});

// RIGHT - use 'this' inside functions
const component = ReactiveUtils.component({
  state: { count: 0 },
  
  effects: {
    updateCount() {
      document.getElementById('count').textContent = this.count;
    }
  }
});
```

#### ✅ Rule 1: One component per logical UI unit

```javascript
// ✅ GOOD - separate components for separate concerns
const timerComponent = ReactiveUtils.component({...});
const searchComponent = ReactiveUtils.component({...});
const formComponent = ReactiveUtils.component({...});

// ❌ BAD - one giant component for everything
const appComponent = ReactiveUtils.component({
  state: {
    timerSeconds: 0,
    searchQuery: '',
    formValues: {},
    // Too much unrelated state!
  }
});
```

#### ✅ Rule 2: Always destroy components when done

```javascript
// Create component
const component = ReactiveUtils.component({...});

// Use it...

// Destroy it
component.$destroy();

// For single-page apps, destroy on navigation
function navigateAway() {
  component.$destroy();
  // Navigate to new page...
}
```

#### ✅ Rule 3: Use mounted() for initialization

```javascript
const component = ReactiveUtils.component({
  state: {
    data: null
  },
  
  mounted() {
    // ✅ Good place for:
    // - Fetching initial data
    fetch('/api/data')
      .then(r => r.json())
      .then(data => {
        this.data = data;
      });
    
    // - Setting up event listeners
    window.addEventListener('resize', this.handleResize);
    
    // - Initializing third-party libraries
    // initializeMap(this.$el);
  },
  
  unmounted() {
    // ✅ Clean up what you set up
    window.removeEventListener('resize', this.handleResize);
  }
});
```

### One-Sentence Summary

`ReactiveUtils.component()` creates a self-contained reactive unit that organizes state, computed properties, watchers, effects, bindings, actions, and lifecycle hooks into a structured pattern with automatic cleanup via `$destroy()` to prevent memory leaks.

---

## 11. ReactiveUtils.reactive()

### The Problem in Plain JavaScript

```javascript
// You want to build state gradually
const state = ReactiveUtils.state({ count: 0 });

// Add computed
ReactiveUtils.computed(state, {
  doubled() {
    return this.count * 2;
  }
});

// Add watchers
ReactiveUtils.watch(state, {
  count(newVal) {
    console.log('Count:', newVal);
  }
});

// Add effects
ReactiveUtils.effect(() => {
  document.getElementById('count').textContent = state.count;
});

// Add bindings
ReactiveUtils.bindings({
  '#doubled': () => state.doubled
});

// Add actions
state.increment = function() {
  this.count++;
};

// Problems:
// 1. No clear structure
// 2. Must call many separate functions
// 3. No method chaining
// 4. Hard to read the flow
// 5. No cleanup method
// 6. Verbose and repetitive
```

**What goes wrong:**
- You call many separate functions to build up your state
- No fluent, chainable API
- Hard to see the overall structure
- No automatic cleanup

### Why This Feature Exists

Sometimes you want to build state **step by step** with a **fluent API** (method chaining). Instead of calling separate functions, you chain methods together. This makes the code more readable and provides a clear flow. `reactive()` is a **builder pattern** for creating reactive state.

### What ReactiveUtils.reactive() Is

**One sentence:** `reactive()` provides a fluent builder API for creating reactive state by chaining methods like `.computed()`, `.watch()`, `.effect()`, `.bind()`, and `.actions()`, then calling `.build()` to get the final state with a `destroy()` method.

### The Mental Model

Think of reactive() as a **construction assembly line**:

```
Multiple Calls:           Builder Pattern:
┌──────────────┐         ┌─────────────────────┐
│ state()      │         │ reactive(state)     │
│ computed()   │         │   .computed({...})  │ ← Chain
│ watch()      │         │   .watch({...})     │   methods
│ effect()     │         │   .effect(() => {}) │   together
│ bindings()   │         │   .bind({...})      │
│ actions()    │         │   .actions({...})   │
│              │         │   .build()          │ ← Get result
│ Separate     │         │                     │
│ calls        │         │ One fluent chain    │
└──────────────┘         └─────────────────────┘
```

You build up the state piece by piece, then call `.build()` to get the final result.

### Basic Usage

```javascript
// Create a builder
const counterBuilder = ReactiveUtils.reactive({
  count: 0
});

// Chain methods to add features
counterBuilder
  .computed({
    doubled() {
      return this.count * 2;
    }
  })
  .watch({
    count(newVal, oldVal) {
      console.log(`Count: ${oldVal} → ${newVal}`);
    }
  })
  .effect(() => {
    document.getElementById('count').textContent = counterBuilder.state.count;
  })
  .bind({
    '#doubled': () => counterBuilder.state.doubled
  })
  .actions({
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    }
  });

// Build to get the final state
const counter = counterBuilder.build();

// Use the state
console.log(counter.count);    // 0
console.log(counter.doubled);  // 0

counter.increment();
console.log(counter.count);    // 1
console.log(counter.doubled);  // 2

// Clean up when done
counter.destroy();
```

**What just happened?**
1. We started with `reactive({ count: 0 })`
2. We chained methods to add computed, watch, effects, etc.
3. We called `.build()` to get the final state
4. We used the state normally
5. We called `.destroy()` to clean up

### Builder Methods

#### .state
Access to the underlying reactive state during building.

```javascript
const builder = ReactiveUtils.reactive({ count: 0 });

// Access state during building
console.log(builder.state.count);  // 0
builder.state.count = 5;
console.log(builder.state.count);  // 5
```

#### .computed(defs)
Add computed properties.

```javascript
const builder = ReactiveUtils.reactive({ count: 0 });

builder.computed({
  doubled() {
    return this.count * 2;
  },
  tripled() {
    return this.count * 3;
  }
});

const state = builder.build();
console.log(state.doubled);  // 0
console.log(state.tripled);  // 0
```

#### .watch(defs)
Add watchers.

```javascript
const builder = ReactiveUtils.reactive({ count: 0 });

builder.watch({
  count(newVal, oldVal) {
    console.log(`Count changed: ${oldVal} → ${newVal}`);
  }
});

const state = builder.build();
state.count = 5;  // Logs: "Count changed: 0 → 5"
```

#### .effect(fn)
Add a single reactive effect.

```javascript
const builder = ReactiveUtils.reactive({ count: 0 });

builder.effect(() => {
  console.log('Current count:', builder.state.count);
});

const state = builder.build();
// Logs: "Current count: 0"

state.count = 5;
// Logs: "Current count: 5"
```

#### .bind(defs)
Add DOM bindings.

```javascript
const builder = ReactiveUtils.reactive({ count: 0 });

builder.bind({
  '#count': 'count',
  '#doubled': () => builder.state.count * 2
});

const state = builder.build();
state.count = 5;  // DOM updates automatically
```

#### .action(name, fn) or .actions(defs)
Add named actions.

```javascript
const builder = ReactiveUtils.reactive({ count: 0 });

// Single action
builder.action('increment', (state) => {
  state.count++;
});

// Multiple actions
builder.actions({
  decrement(state) {
    state.count--;
  },
  reset(state) {
    state.count = 0;
  }
});

const state = builder.build();
state.increment();
state.decrement();
state.reset();
```

#### .build()
Build and return the final state with a `destroy()` method.

```javascript
const builder = ReactiveUtils.reactive({ count: 0 })
  .computed({ doubled() { return this.count * 2; } })
  .actions({ increment(state) { state.count++; } });

// Build to get final state
const state = builder.build();

// Now you can use it
console.log(state.count);
console.log(state.doubled);
state.increment();

// And destroy it when done
state.destroy();
```

#### .destroy()
Clean up the builder (if you don't call `.build()`).

```javascript
const builder = ReactiveUtils.reactive({ count: 0 })
  .effect(() => console.log(builder.state.count));

// If you decide not to build, destroy the builder
builder.destroy();
```

### More Powerful Patterns

#### Pattern 1: Building a Counter

```javascript
const counter = ReactiveUtils.reactive({ count: 0 })
  .computed({
    doubled() {
      return this.count * 2;
    },
    isEven() {
      return this.count % 2 === 0;
    }
  })
  .watch({
    count(newVal) {
      if (newVal > 10) {
        console.log('Count is getting high!');
      }
    }
  })
  .effect(() => {
    const el = document.getElementById('count');
    if (el) {
      el.textContent = counter.state.count;
      el.className = counter.state.isEven ? 'even' : 'odd';
    }
  })
  .actions({
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    },
    incrementBy(state, amount) {
      state.count += amount;
    },
    reset(state) {
      state.count = 0;
    }
  })
  .build();

// Use it
counter.increment();
counter.incrementBy(5);
counter.reset();

// Clean up
counter.destroy();
```

#### Pattern 2: Todo List Builder

```javascript
let nextId = 1;

const todos = ReactiveUtils.reactive({ items: [] })
  .computed({
    activeCount() {
      return this.items.filter(t => !t.done).length;
    },
    completedCount() {
      return this.items.filter(t => t.done).length;
    },
    allCompleted() {
      return this.items.length > 0 && this.activeCount === 0;
    }
  })
  .watch({
    'items.length'(newLen, oldLen) {
      console.log(`Todo count: ${oldLen} → ${newLen}`);
    }
  })
  .effect(() => {
    const list = document.getElementById('todoList');
    if (!list) return;
    
    list.innerHTML = todos.state.items.map(todo => `
      <li class="${todo.done ? 'done' : ''}">
        <input type="checkbox" ${todo.done ? 'checked' : ''}
               onchange="todos.toggle(${todo.id})">
        <span>${todo.text}</span>
        <button onclick="todos.remove(${todo.id})">Delete</button>
      </li>
    `).join('');
  })
  .effect(() => {
    const counter = document.getElementById('todoCount');
    if (counter) {
      counter.textContent = `${todos.state.activeCount} active`;
    }
  })
  .actions({
    add(state, text) {
      state.items.push({
        id: nextId++,
        text,
        done: false
      });
    },
    remove(state, id) {
      const index = state.items.findIndex(t => t.id === id);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    },
    toggle(state, id) {
      const todo = state.items.find(t => t.id === id);
      if (todo) {
        todo.done = !todo.done;
      }
    },
    clearCompleted(state) {
      state.items = state.items.filter(t => !t.done);
    }
  })
  .build();

// Use it
todos.add('Learn reactive programming');
todos.add('Build an app');
todos.toggle(1);

// Clean up when done
todos.destroy();
```

#### Pattern 3: Search with Async

```javascript
const search = ReactiveUtils.reactive({
  query: '',
  results: [],
  loading: false,
  error: null
})
  .computed({
    hasQuery() {
      return this.query.trim().length > 0;
    },
    hasResults() {
      return this.results.length > 0;
    }
  })
  .watch({
    query(newQuery) {
      if (!newQuery.trim()) {
        this.results = [];
        return;
      }
      
      // Debounced search would go here
      search.performSearch(newQuery);
    }
  })
  .effect(() => {
    const resultsEl = document.getElementById('results');
    if (!resultsEl) return;
    
    if (search.state.loading) {
      resultsEl.innerHTML = 'Loading...';
    } else if (search.state.error) {
      resultsEl.innerHTML = `Error: ${search.state.error}`;
    } else if (search.state.hasResults) {
      resultsEl.innerHTML = search.state.results
        .map(r => `<div>${r.title}</div>`)
        .join('');
    } else if (search.state.hasQuery) {
      resultsEl.innerHTML = 'No results found';
    } else {
      resultsEl.innerHTML = '';
    }
  })
  .actions({
    async performSearch(state, query) {
      state.loading = true;
      state.error = null;
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error('Search failed');
        }
        
        const data = await response.json();
        state.results = data.results;
      } catch (error) {
        state.error = error.message;
      } finally {
        state.loading = false;
      }
    },
    clearSearch(state) {
      state.query = '';
      state.results = [];
      state.error = null;
    }
  })
  .build();

// Use it
search.query = 'react';

// Clean up
search.destroy();
```

### Important Rules and Common Mistakes

#### ❌ Mistake 1: Forgetting to call .build()

```javascript
// WRONG - builder, not state
const counter = ReactiveUtils.reactive({ count: 0 })
  .computed({ doubled() { return this.count * 2; } });

counter.count++;  // Doesn't work! It's still a builder

// RIGHT - call .build()
const counter = ReactiveUtils.reactive({ count: 0 })
  .computed({ doubled() { return this.count * 2; } })
  .build();  // Now it's state

counter.count++;  // Works!
```

#### ❌ Mistake 2: Accessing final state before build()

```javascript
// WRONG - state doesn't exist yet
const builder = ReactiveUtils.reactive({ count: 0 });

builder.computed({
  doubled() {
    return builder.count * 2;  // builder.count doesn't exist!
  }
});

// RIGHT - use builder.state or 'this'
const builder = ReactiveUtils.reactive({ count: 0 });

builder.computed({
  doubled() {
    return this.count * 2;  // 'this' refers to the state
  }
});

// Or access builder.state
builder.effect(() => {
  console.log(builder.state.count);
});
```

#### ❌ Mistake 3: Not calling destroy()

```javascript
const state = ReactiveUtils.reactive({ count: 0 })
  .effect(() => console.log('Count:', state.state.count))
  .build();

// Use state...

// WRONG - never destroyed
// Effects keep running = memory leak

// RIGHT - call destroy when done
state.destroy();
```

#### ❌ Mistake 4: Calling methods after build()

```javascript
const state = ReactiveUtils.reactive({ count: 0 })
  .computed({ doubled() { return this.count * 2; } })
  .build();

// WRONG - can't chain after build()
state.watch({  // Error! watch is not a method on state
  count(newVal) {
    console.log(newVal);
  }
});

// RIGHT - chain before build()
const state = ReactiveUtils.reactive({ count: 0 })
  .computed({ doubled() { return this.count * 2; } })
  .watch({
    count(newVal) {
      console.log(newVal);
    }
  })
  .build();
```

#### ✅ Rule 1: Chain methods, then build

```javascript
// ✅ Correct flow
const state = ReactiveUtils.reactive({ count: 0 })
  .computed({...})      // Chain
  .watch({...})         // Chain
  .effect(() => {...})  // Chain
  .actions({...})       // Chain
  .build();             // Build to get final state

// ❌ Wrong - calling methods separately
const builder = ReactiveUtils.reactive({ count: 0 });
builder.computed({...});
builder.watch({...});
const state = builder.build();
// This works but defeats the purpose of the builder pattern
```

#### ✅ Rule 2: Store builder or state, not both

```javascript
// ✅ Option 1: Store only the builder, build at the end
const builder = ReactiveUtils.reactive({ count: 0 })
  .computed({...})
  .actions({...});

// Later...
const state = builder.build();

// ✅ Option 2: Build immediately and store state
const state = ReactiveUtils.reactive({ count: 0 })
  .computed({...})
  .actions({...})
  .build();

// ❌ Don't store both
const builder = ReactiveUtils.reactive({ count: 0 });
const state = builder.build();  // Confusing!
```

#### ✅ Rule 3: reactive() vs component()

```javascript
// Use reactive() when:
// - You want fluent API / method chaining
// - You're building simple state programmatically
// - You don't need lifecycle hooks

const state = ReactiveUtils.reactive({ count: 0 })
  .computed({...})
  .build();

// Use component() when:
// - You need lifecycle hooks (mounted/unmounted)
// - You want everything in one config object
// - You're building a UI component

const component = ReactiveUtils.component({
  state: { count: 0 },
  computed: {...},
  mounted() {...},
  unmounted() {...}
});
```

### One-Sentence Summary

`ReactiveUtils.reactive()` provides a fluent builder API for constructing reactive state by chaining methods like `.computed()`, `.watch()`, `.effect()`, `.bind()`, and `.actions()` before calling `.build()` to get the final state with automatic cleanup via `destroy()`.

---

## Summary Table

| Method | Purpose | Returns | Use When |
|--------|---------|---------|----------|
| `state()` | Create reactive state | Reactive state | You need a reactive object |
| `createState()` | Create state + auto-bindings | Reactive state | You want automatic DOM bindings |
| `ref()` | Create single reactive value | Ref with `.value` | You need one reactive primitive |
| `refs()` | Create multiple refs at once | Object of refs | You need many independent values |
| `collection()` | Create reactive array wrapper | Collection | You have a list that changes |
| `list()` | Alias for collection() | Collection | Same as collection() |
| `form()` | Create form state manager | Form state | You're building a form |
| `async()` | Create async operation state | Async state | You're fetching data |
| `store()` | Create structured state + getters + actions | Store | You need organized state management |
| `component()` | Create full component with lifecycle | Component | You need a complete UI component |
| `reactive()` | Builder pattern for state | Builder → State | You want fluent API / chaining |

**Congratulations!** You now understand all 11 state creation methods in the Reactive Library. Each one solves specific problems and makes reactive programming more convenient and organized.