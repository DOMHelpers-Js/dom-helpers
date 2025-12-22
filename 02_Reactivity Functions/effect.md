# effect()

Run side effects automatically when reactive state changes.

## Quick Start (30 seconds)

```javascript
import { state, effect } from './state.js';

// Create reactive state
const counter = state({ count: 0 });

// Effect runs immediately and whenever counter.count changes
effect(() => {
  document.getElementById('display').textContent = counter.count;
  console.log('Count updated:', counter.count);
});

// Change the count - effect automatically re-runs!
counter.count = 5;  // Updates DOM and logs "Count updated: 5"
counter.count = 10; // Updates DOM and logs "Count updated: 10"
```

**That's it!** The effect automatically tracks dependencies and re-runs when they change.

---

## Mental Model: Smart Home Automation

Think of `effect()` like **motion-activated lights**:

```
Reactive State     →  Motion Sensor (detects changes)
Effect Function    →  Light Automation Rule
Dependency Track   →  Which rooms to monitor
Auto Re-run        →  Lights turn on when motion detected
Cleanup            →  Turn off lights when leaving
```

**Just like automation:**
- Set the rule once ("when motion detected, turn on lights")
- System automatically monitors the sensors
- Action triggers whenever sensors activate
- No manual intervention needed
- Can add cleanup (turn off when done)

**Key insight:** You define **what should happen**, the system handles **when it happens**.

---

## What is effect()?

`effect()` is a **fundamental reactive function** that automatically runs code whenever reactive state it depends on changes.

```javascript
import { effect } from './state.js';

effect(() => {
  // Code here runs immediately
  // and re-runs when any accessed reactive state changes
});
```

### The Reactivity Bridge

```
┌─────────────────────────────────────────────────────────────┐
│                     REACTIVITY FLOW                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  WITHOUT effect():                                          │
│  ─────────────────                                          │
│  State Changes → Nothing Happens                            │
│                                                             │
│  const user = state({ name: 'John' });                      │
│  user.name = 'Jane';  // Change detected but ignored        │
│                                                             │
│  ❌ State is reactive but nothing reacts to it              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  WITH effect():                                             │
│  ──────────────                                             │
│  State Changes → Effect Runs → Action Happens               │
│                                                             │
│  const user = state({ name: 'John' });                      │
│                                                             │
│  effect(() => {                                             │
│    console.log(user.name);  // Tracks dependency           │
│  });                                                        │
│                                                             │
│  user.name = 'Jane';  // Effect automatically re-runs!      │
│                                                             │
│  ✅ State changes trigger automatic reactions               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Manual Approach vs effect()

### ❌ Without effect() - Manual Updates

```javascript
const user = state({
  name: 'John',
  age: 25
});

// Manually update UI
document.getElementById('name').textContent = user.name;
document.getElementById('age').textContent = user.age;

// Change state
user.name = 'Jane';
user.age = 30;

// UI is now OUT OF SYNC!
// Must manually update again:
document.getElementById('name').textContent = user.name;
document.getElementById('age').textContent = user.age;

// Every time state changes, must remember to update UI
user.name = 'Bob';
document.getElementById('name').textContent = user.name; // Tedious!

// Problems:
// - Must manually update every time
// - Easy to forget updates
// - Code scattered everywhere
// - State and UI get out of sync
```

### ✅ With effect() - Automatic Updates

```javascript
const user = state({
  name: 'John',
  age: 25
});

// Define update logic once
effect(() => {
  document.getElementById('name').textContent = user.name;
});

effect(() => {
  document.getElementById('age').textContent = user.age;
});

// Change state - UI updates automatically!
user.name = 'Jane';  // DOM updates automatically
user.age = 30;       // DOM updates automatically
user.name = 'Bob';   // DOM updates automatically

// Benefits:
// ✓ Write update logic once
// ✓ Automatic synchronization
// ✓ Never out of sync
// ✓ Less code, fewer bugs
// ✓ Centralized logic
```

---

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    EFFECT() WORKFLOW                        │
└─────────────────────────────────────────────────────────────┘

1. CREATION & FIRST RUN
   ────────────────────────────────────────────────────────
   effect(() => {
     console.log(user.name);  ← Reads user.name
   })

   → Effect runs immediately
   → System enters "tracking mode"
   → Accesses to reactive properties are recorded
   → Dependencies: [user.name]

2. STATE CHANGE
   ────────────────────────────────────────────────────────
   user.name = 'Jane'

   → Change detected in tracked dependency
   → Effect queued for re-run
   → Cleanup function runs (if any)

3. EFFECT RE-RUN
   ────────────────────────────────────────────────────────
   effect function executes again

   → Cleanup runs first (from previous run)
   → Effect function executes
   → Dependencies re-tracked
   → New cleanup saved (if returned)

4. STOP EFFECT
   ────────────────────────────────────────────────────────
   const stop = effect(...)
   stop()

   → Cleanup runs one final time
   → Dependencies unregistered
   → Effect will not run again

┌─────────────────────────────────────────────────────────────┐
│                  DEPENDENCY TRACKING                        │
└─────────────────────────────────────────────────────────────┘

effect(() => {
  const a = state.x;     // Tracks: state.x
  const b = state.y;     // Tracks: state.y
  if (a > 5) {
    const c = state.z;   // Tracks: state.z (conditionally)
  }
})

Dependencies are tracked DYNAMICALLY based on code execution:

  state.x changes → Effect re-runs ✓
  state.y changes → Effect re-runs ✓
  state.z changes → Effect re-runs (only if state.x > 5) ✓
  state.w changes → Effect does NOT re-run ✗
```

---

## Common Use Cases

### 1. DOM Updates

```javascript
const app = state({
  title: 'My App',
  count: 0,
  user: { name: 'John' }
});

// Update page title
effect(() => {
  document.title = app.title;
});

// Update counter display
effect(() => {
  document.getElementById('counter').textContent = app.count;
});

// Update user name
effect(() => {
  document.getElementById('userName').textContent = app.user.name;
});

// Update welcome message (multiple dependencies)
effect(() => {
  const msg = `Welcome ${app.user.name}! Count: ${app.count}`;
  document.getElementById('welcome').textContent = msg;
});

// Changes automatically update the DOM
app.title = 'Updated App';     // Document title changes
app.count = 5;                  // Counter updates
app.user.name = 'Jane';         // User name updates everywhere
```

### 2. LocalStorage Sync

```javascript
const settings = state({
  theme: 'light',
  language: 'en',
  fontSize: 16,
  notifications: true
});

// Auto-save to localStorage
effect(() => {
  const data = {
    theme: settings.theme,
    language: settings.language,
    fontSize: settings.fontSize,
    notifications: settings.notifications
  };
  localStorage.setItem('settings', JSON.stringify(data));
  console.log('Settings saved:', data);
});

// Any setting change auto-saves
settings.theme = 'dark';           // Saved to localStorage
settings.fontSize = 18;            // Saved to localStorage
settings.notifications = false;    // Saved to localStorage
```

### 3. Theme Application

```javascript
const theme = state({
  mode: 'light',
  primaryColor: '#007bff',
  fontSize: '16px'
});

// Apply theme to document
effect(() => {
  document.body.className = `theme-${theme.mode}`;
});

effect(() => {
  document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
});

effect(() => {
  document.documentElement.style.setProperty('--font-size', theme.fontSize);
});

// Composite effect: log theme changes
effect(() => {
  console.log('Theme updated:', {
    mode: theme.mode,
    primaryColor: theme.primaryColor,
    fontSize: theme.fontSize
  });
});

// Changes apply immediately
theme.mode = 'dark';                    // Body class updates
theme.primaryColor = '#ff5722';         // CSS variable updates
theme.fontSize = '18px';                // Font size updates
```

### 4. Form Validation

```javascript
const form = state({
  email: '',
  password: '',
  confirmPassword: ''
});

// Validate email
effect(() => {
  const emailInput = document.getElementById('email');
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  if (form.email.length > 0) {
    emailInput.classList.toggle('valid', isValid);
    emailInput.classList.toggle('invalid', !isValid);
  }
});

// Validate password match
effect(() => {
  const confirmInput = document.getElementById('confirmPassword');
  const matches = form.password === form.confirmPassword;

  if (form.confirmPassword.length > 0) {
    confirmInput.classList.toggle('valid', matches);
    confirmInput.classList.toggle('invalid', !matches);
  }
});

// Update submit button
effect(() => {
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const passwordValid = form.password.length >= 8;
  const passwordsMatch = form.password === form.confirmPassword;

  const submitBtn = document.getElementById('submit');
  submitBtn.disabled = !(emailValid && passwordValid && passwordsMatch);
});

// Type in form - validation runs automatically
form.email = 'john@example.com';   // Email validation runs
form.password = 'secret123';        // Password check runs
form.confirmPassword = 'secret123'; // Match check runs, button enables
```

### 5. API Synchronization

```javascript
const todos = state({
  items: [],
  syncEnabled: true
});

// Auto-sync to server
effect(() => {
  if (todos.syncEnabled && todos.items.length > 0) {
    fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todos.items)
    })
    .then(response => console.log('Synced:', todos.items.length, 'todos'))
    .catch(error => console.error('Sync failed:', error));
  }
});

// Add todos - automatically syncs
todos.items.push({ id: 1, text: 'Buy milk', done: false });
todos.items.push({ id: 2, text: 'Walk dog', done: false });

// Toggle sync
todos.syncEnabled = false;  // Stops syncing
todos.items.push({ id: 3, text: 'Write code', done: false }); // Doesn't sync

todos.syncEnabled = true;   // Re-enables, syncs immediately
```

### 6. Logging and Debugging

```javascript
const app = state({
  user: null,
  isLoading: false,
  error: null,
  data: []
});

// Development logger
effect(() => {
  console.group('🔍 State Update');
  console.log('User:', app.user);
  console.log('Loading:', app.isLoading);
  console.log('Error:', app.error);
  console.log('Data items:', app.data.length);
  console.log('Timestamp:', new Date().toISOString());
  console.groupEnd();
});

// Track specific state changes
effect(() => {
  if (app.error) {
    console.error('❌ Error occurred:', app.error);
  }
});

effect(() => {
  if (app.isLoading) {
    console.log('⏳ Loading started...');
  } else {
    console.log('✅ Loading complete');
  }
});

// State changes trigger logs
app.isLoading = true;           // Logs loading started
app.user = { name: 'John' };    // Logs state update
app.error = 'Network error';    // Logs error
app.isLoading = false;          // Logs loading complete
```

### 7. Conditional Effects

```javascript
const app = state({
  showDetails: false,
  user: {
    name: 'John',
    email: 'john@example.com',
    age: 25,
    bio: 'Software developer'
  }
});

// Effect with conditional dependencies
effect(() => {
  console.log('Name:', app.user.name); // Always tracked

  if (app.showDetails) {
    // These are only tracked when showDetails is true
    console.log('Email:', app.user.email);
    console.log('Age:', app.user.age);
    console.log('Bio:', app.user.bio);
  }
});

// When showDetails is false:
app.user.email = 'new@example.com';  // Effect does NOT run
app.user.age = 30;                   // Effect does NOT run
app.user.name = 'Jane';              // Effect DOES run

// Enable details
app.showDetails = true;              // Effect runs, now tracking email, age, bio

// Now these trigger the effect:
app.user.email = 'jane@example.com'; // Effect runs
app.user.age = 31;                   // Effect runs
```

### 8. Cleanup Pattern

```javascript
const search = state({
  query: '',
  debounceMs: 300
});

// Debounced search with cleanup
effect(() => {
  console.log('Setting up search for:', search.query);

  const timerId = setTimeout(() => {
    if (search.query.length > 0) {
      console.log('Searching for:', search.query);
      fetch(`/api/search?q=${search.query}`)
        .then(r => r.json())
        .then(results => console.log('Results:', results));
    }
  }, search.debounceMs);

  // Cleanup: cancel previous search
  return () => {
    console.log('Cleaning up previous search');
    clearTimeout(timerId);
  };
});

// Type fast - only last search executes
search.query = 'j';       // Sets timer, cleanup will cancel
search.query = 'ja';      // Cleanup runs, sets new timer
search.query = 'jav';     // Cleanup runs, sets new timer
search.query = 'java';    // Cleanup runs, sets new timer
// After 300ms: searches for 'java'
```

---

## Advanced Patterns

### 1. Effect Cleanup for Event Listeners

```javascript
const interactive = state({
  elementId: 'button1',
  enabled: true
});

effect(() => {
  if (!interactive.enabled) return;

  const element = document.getElementById(interactive.elementId);

  const handler = (e) => {
    console.log('Clicked:', interactive.elementId);
  };

  element.addEventListener('click', handler);

  // Cleanup: remove event listener
  return () => {
    element.removeEventListener('click', handler);
    console.log('Removed listener from:', interactive.elementId);
  };
});

// Change element - old listener removed, new one added
interactive.elementId = 'button2';

// Disable - listener removed
interactive.enabled = false;
```

### 2. Complex Multi-State Effects

```javascript
const user = state({
  id: 1,
  name: 'John'
});

const settings = state({
  theme: 'light',
  language: 'en'
});

const permissions = state({
  canEdit: true,
  canDelete: false
});

// Effect depending on multiple states
effect(() => {
  const config = {
    userId: user.id,
    userName: user.name,
    theme: settings.theme,
    language: settings.language,
    permissions: {
      canEdit: permissions.canEdit,
      canDelete: permissions.canDelete
    }
  };

  console.log('App configuration:', config);

  // Apply configuration
  document.body.dataset.userId = user.id;
  document.body.dataset.theme = settings.theme;
  document.body.lang = settings.language;
});

// Changes to ANY state trigger the effect
user.name = 'Jane';           // Effect runs
settings.theme = 'dark';      // Effect runs
permissions.canEdit = false;  // Effect runs
```

### 3. Effect Scheduling Pattern

```javascript
const updates = state({
  queue: [],
  processing: false
});

// Process updates one at a time
effect(() => {
  if (updates.processing || updates.queue.length === 0) {
    return;
  }

  updates.processing = true;
  const item = updates.queue[0];

  console.log('Processing:', item);

  // Simulate async work
  setTimeout(() => {
    updates.queue.shift();        // Remove processed item
    updates.processing = false;   // Allow next item
  }, 1000);
});

// Add items - processes one by one
updates.queue.push('Task 1');
updates.queue.push('Task 2');
updates.queue.push('Task 3');
```

### 4. Error Boundary Effect

```javascript
const app = state({
  error: null,
  errorCount: 0
});

// Global error handler
effect(() => {
  if (app.error) {
    console.error('Application error:', app.error);

    // Show error UI
    const errorDiv = document.getElementById('error-display');
    errorDiv.textContent = app.error.message;
    errorDiv.style.display = 'block';

    // Track errors
    app.errorCount++;

    // Auto-clear after 5 seconds
    setTimeout(() => {
      app.error = null;
      errorDiv.style.display = 'none';
    }, 5000);
  }
});

// Trigger error
try {
  throw new Error('Something went wrong!');
} catch (e) {
  app.error = e;  // Effect handles it
}
```

### 5. Performance Monitoring Effect

```javascript
const perf = state({
  operations: [],
  enabled: true
});

effect(() => {
  if (!perf.enabled) return;

  const opCount = perf.operations.length;
  const avgTime = opCount > 0
    ? perf.operations.reduce((sum, op) => sum + op.duration, 0) / opCount
    : 0;

  console.log('Performance Stats:', {
    operations: opCount,
    avgDuration: avgTime.toFixed(2) + 'ms',
    slowest: opCount > 0 ? Math.max(...perf.operations.map(op => op.duration)) : 0
  });

  // Warn if performance degrades
  if (avgTime > 100) {
    console.warn('⚠️ Average operation time exceeds 100ms');
  }
});

// Record operations
perf.operations.push({ name: 'render', duration: 45 });
perf.operations.push({ name: 'fetch', duration: 120 });
perf.operations.push({ name: 'compute', duration: 80 });
```

### 6. State Persistence Effect

```javascript
const appState = state({
  user: null,
  settings: { theme: 'light' },
  data: [],
  lastSaved: null
});

// Auto-save to localStorage with debouncing
let saveTimer = null;

effect(() => {
  // Clear previous timer
  if (saveTimer) clearTimeout(saveTimer);

  // Debounce: save after 1 second of no changes
  saveTimer = setTimeout(() => {
    const toSave = {
      user: appState.user,
      settings: appState.settings,
      data: appState.data,
      lastSaved: new Date().toISOString()
    };

    localStorage.setItem('appState', JSON.stringify(toSave));
    appState.lastSaved = toSave.lastSaved;
    console.log('State saved to localStorage');
  }, 1000);

  return () => {
    clearTimeout(saveTimer);
  };
});

// Make rapid changes - saves once after they stop
appState.settings.theme = 'dark';
appState.user = { name: 'John' };
appState.data = [1, 2, 3];
// Saves once, 1 second after last change
```

### 7. Animation Effect

```javascript
const animation = state({
  running: false,
  progress: 0
});

effect(() => {
  if (!animation.running) return;

  console.log('Animation started');
  const startTime = Date.now();
  const duration = 2000; // 2 seconds

  const animate = () => {
    const elapsed = Date.now() - startTime;
    animation.progress = Math.min(elapsed / duration, 1);

    if (animation.progress < 1) {
      requestAnimationFrame(animate);
    } else {
      console.log('Animation complete');
      animation.running = false;
    }
  };

  const frameId = requestAnimationFrame(animate);

  // Cleanup: cancel animation
  return () => {
    cancelAnimationFrame(frameId);
    console.log('Animation cancelled');
  };
});

// Watch progress
effect(() => {
  console.log('Progress:', (animation.progress * 100).toFixed(1) + '%');
});

// Start animation
animation.running = true;

// Stop early
// animation.running = false;
```

### 8. Resource Loading Effect

```javascript
const resource = state({
  url: null,
  data: null,
  loading: false,
  error: null
});

effect(() => {
  if (!resource.url) return;

  console.log('Loading resource:', resource.url);
  resource.loading = true;
  resource.error = null;

  const controller = new AbortController();

  fetch(resource.url, { signal: controller.signal })
    .then(r => r.json())
    .then(data => {
      resource.data = data;
      resource.loading = false;
      console.log('Resource loaded:', resource.url);
    })
    .catch(err => {
      if (err.name !== 'AbortError') {
        resource.error = err.message;
        resource.loading = false;
        console.error('Load failed:', err);
      }
    });

  // Cleanup: abort fetch on URL change
  return () => {
    controller.abort();
    console.log('Aborted previous request');
  };
});

// Load different resources - previous requests cancelled
resource.url = '/api/users';
setTimeout(() => resource.url = '/api/posts', 100);  // Cancels users request
setTimeout(() => resource.url = '/api/comments', 200); // Cancels posts request
```

---

## Performance Tips

### 1. Keep Effects Small and Focused

```javascript
// ❌ BAD: One large effect
effect(() => {
  document.getElementById('name').textContent = user.name;
  document.getElementById('email').textContent = user.email;
  document.getElementById('age').textContent = user.age;
  document.getElementById('city').textContent = user.city;
});
// Re-runs for ANY property change

// ✅ GOOD: Separate effects
effect(() => {
  document.getElementById('name').textContent = user.name;
});

effect(() => {
  document.getElementById('email').textContent = user.email;
});
// Each effect only re-runs when its specific dependency changes
```

### 2. Avoid Unnecessary Reads

```javascript
// ❌ BAD: Reading unused properties
effect(() => {
  const name = user.name;     // Tracked
  const email = user.email;   // Tracked but unused
  const age = user.age;       // Tracked but unused

  document.getElementById('display').textContent = name;
});

// ✅ GOOD: Only read what you use
effect(() => {
  document.getElementById('display').textContent = user.name;
});
```

### 3. Use Batching for Multiple Updates

```javascript
// ❌ BAD: Multiple updates trigger multiple effect runs
user.name = 'Jane';
user.email = 'jane@example.com';
user.age = 30;
// Effect runs 3 times

// ✅ GOOD: Batch updates
user.$batch(() => {
  user.name = 'Jane';
  user.email = 'jane@example.com';
  user.age = 30;
});
// Effect runs once
```

### 4. Use Computed for Derived Values

```javascript
// ❌ BAD: Computing in effects
effect(() => {
  const total = cart.items.reduce((sum, item) => sum + item.price, 0);
  document.getElementById('total').textContent = total;
});

// ✅ GOOD: Use computed + effect
computed(cart, {
  total: s => s.items.reduce((sum, item) => sum + item.price, 0)
});

effect(() => {
  document.getElementById('total').textContent = cart.total;
});
```

### 5. Debounce Expensive Operations

```javascript
// ❌ BAD: Expensive operation on every change
effect(() => {
  expensiveAPICall(search.query);  // Runs on every keystroke
});

// ✅ GOOD: Debounce
let timer;
effect(() => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    expensiveAPICall(search.query);
  }, 300);

  return () => clearTimeout(timer);
});
```

---

## Common Pitfalls

### 1. Infinite Loops

```javascript
// ❌ WRONG: Modifying tracked state
const counter = state({ count: 0 });

effect(() => {
  console.log(counter.count);
  counter.count++;  // Triggers effect again → infinite loop!
});

// ✅ CORRECT: Use conditions or don't modify tracked state
effect(() => {
  console.log(counter.count);

  if (counter.count < 10) {
    counter.count++;  // Only increments until 10
  }
});
```

### 2. Reading State Outside Effect

```javascript
// ❌ WRONG: Captured value, not reactive
const name = user.name;  // Captured once

effect(() => {
  document.getElementById('name').textContent = name; // Won't update!
});

// ✅ CORRECT: Read inside effect
effect(() => {
  document.getElementById('name').textContent = user.name; // Reactive!
});
```

### 3. Forgetting Cleanup

```javascript
// ❌ WRONG: Memory leak
function setupLogger(userId) {
  effect(() => {
    console.log('User:', users[userId].name);
  });
}

setupLogger(1);
setupLogger(2);
setupLogger(3);
// Creates 3 effects that never stop!

// ✅ CORRECT: Stop old effects
let currentEffect = null;

function setupLogger(userId) {
  if (currentEffect) {
    currentEffect();  // Stop previous
  }

  currentEffect = effect(() => {
    console.log('User:', users[userId].name);
  });
}
```

### 4. Creating Effects in Effects

```javascript
// ❌ WRONG: Creates new effects exponentially
effect(() => {
  console.log(outer.value);

  effect(() => {  // New inner effect every time!
    console.log(inner.value);
  });
});

// ✅ CORRECT: Create effects at same level
effect(() => {
  console.log(outer.value);
});

effect(() => {
  console.log(inner.value);
});
```

### 5. Async Effects Without Cleanup

```javascript
// ❌ WRONG: Race conditions
effect(async () => {
  const data = await fetch(`/api/user/${userId.value}`);
  user.data = await data.json();
});
// If userId changes, previous request may complete after new one

// ✅ CORRECT: Use cleanup to cancel
effect(() => {
  const controller = new AbortController();

  fetch(`/api/user/${userId.value}`, { signal: controller.signal })
    .then(r => r.json())
    .then(data => user.data = data)
    .catch(err => {
      if (err.name !== 'AbortError') {
        console.error(err);
      }
    });

  return () => controller.abort();
});
```

### 6. Not Stopping Effects

```javascript
// ❌ WRONG: Effects accumulate
document.getElementById('showUser').onclick = () => {
  effect(() => {
    console.log(user.name);  // Creates new effect each click!
  });
};

// ✅ CORRECT: Track and stop
let userEffect = null;

document.getElementById('showUser').onclick = () => {
  if (userEffect) userEffect();

  userEffect = effect(() => {
    console.log(user.name);
  });
};
```

### 7. Side Effects in Computed

```javascript
// ❌ WRONG: Side effects in computed
computed(state, {
  total: s => {
    console.log('Computing...');  // Side effect in computed!
    return s.price * s.qty;
  }
});

// ✅ CORRECT: Side effects in effect
computed(state, {
  total: s => s.price * s.qty  // Pure
});

effect(() => {
  console.log('Total:', state.total);  // Side effect in effect
});
```

---

## Real-World Example: Todo App

```javascript
import { state, effect, computed } from './state.js';

// App state
const app = state({
  todos: [],
  filter: 'all', // 'all', 'active', 'completed'
  newTodo: ''
});

// Computed properties
computed(app, {
  filteredTodos: s => {
    if (s.filter === 'active') return s.todos.filter(t => !t.done);
    if (s.filter === 'completed') return s.todos.filter(t => t.done);
    return s.todos;
  },

  activeCount: s => s.todos.filter(t => !t.done).length,
  completedCount: s => s.todos.filter(t => t.done).length
});

// Effect 1: Render todo list
effect(() => {
  const list = document.getElementById('todoList');
  list.innerHTML = '';

  app.filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.className = todo.done ? 'completed' : '';
    li.innerHTML = `
      <input type="checkbox" ${todo.done ? 'checked' : ''} data-id="${todo.id}">
      <span>${todo.text}</span>
      <button data-id="${todo.id}">Delete</button>
    `;
    list.appendChild(li);
  });
});

// Effect 2: Update counters
effect(() => {
  document.getElementById('activeCount').textContent = app.activeCount;
  document.getElementById('completedCount').textContent = app.completedCount;
  document.getElementById('totalCount').textContent = app.todos.length;
});

// Effect 3: Update filter buttons
effect(() => {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === app.filter);
  });
});

// Effect 4: Save to localStorage
effect(() => {
  localStorage.setItem('todos', JSON.stringify(app.todos));
  console.log('Saved', app.todos.length, 'todos');
});

// Effect 5: Clear input after adding
effect(() => {
  document.getElementById('newTodo').value = app.newTodo;
});

// Event handlers
document.getElementById('addTodo').onclick = () => {
  if (app.newTodo.trim()) {
    app.todos.push({
      id: Date.now(),
      text: app.newTodo,
      done: false
    });
    app.newTodo = '';
  }
};

document.getElementById('todoList').onclick = (e) => {
  const id = parseInt(e.target.dataset.id);

  if (e.target.type === 'checkbox') {
    const todo = app.todos.find(t => t.id === id);
    if (todo) todo.done = !todo.done;
  }

  if (e.target.tagName === 'BUTTON') {
    const index = app.todos.findIndex(t => t.id === id);
    if (index !== -1) app.todos.splice(index, 1);
  }
};

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.onclick = () => {
    app.filter = btn.dataset.filter;
  };
});

// Load saved todos
const saved = localStorage.getItem('todos');
if (saved) {
  app.todos = JSON.parse(saved);
}
```

---

## API Reference

### effect(fn)

Creates a reactive effect that automatically re-runs when dependencies change.

**Parameters:**
- `fn` (Function): Effect function to run
  - Runs immediately when effect is created
  - Re-runs when any accessed reactive state changes
  - Can return a cleanup function

**Returns:**
- `Function`: Stop function to disable the effect

**Example:**
```javascript
const stop = effect(() => {
  console.log(user.name);

  return () => {
    console.log('Cleanup');
  };
});

// Later: stop the effect
stop();
```

---

## Frequently Asked Questions

### When should I use effect() vs computed()?

**Use `effect()`** for:
- DOM updates
- Logging
- API calls
- Side effects
- LocalStorage sync
- Anything with external impact

**Use `computed()`** for:
- Deriving values from state
- Calculations
- Filtering/mapping data
- Pure transformations
- Values you want to cache

```javascript
// ✅ Computed: derive value
computed(cart, {
  total: s => s.items.reduce((sum, item) => sum + item.price, 0)
});

// ✅ Effect: update DOM
effect(() => {
  document.getElementById('total').textContent = cart.total;
});
```

### How do I stop an effect from running?

Call the function returned by `effect()`:

```javascript
const stop = effect(() => {
  console.log(state.value);
});

// Later...
stop();  // Effect stops running
```

### Can effects be async?

Effects can't be async functions, but can contain async code:

```javascript
// ❌ WRONG
effect(async () => {
  const data = await fetch('/api');  // Can't be async
});

// ✅ CORRECT
effect(() => {
  fetch('/api')
    .then(r => r.json())
    .then(data => state.data = data);
});

// ✅ ALSO CORRECT
effect(() => {
  (async () => {
    const r = await fetch('/api');
    state.data = await r.json();
  })();
});
```

### How do I debug which dependencies are tracked?

Add logging inside the effect:

```javascript
effect(() => {
  console.log('Effect running');
  console.log('Dependencies:', {
    name: user.name,
    age: user.age
  });
});

// When effect runs, you'll see which values it accesses
```

### Can I have conditional dependencies?

Yes! Dependencies are tracked dynamically:

```javascript
effect(() => {
  console.log(state.name);  // Always tracked

  if (state.showDetails) {
    console.log(state.email);  // Only tracked when showDetails is true
  }
});
```

### What's the execution order of effects?

Effects run in the order they're created, and re-run in the same order when dependencies change:

```javascript
effect(() => console.log('Effect 1'));  // Runs first
effect(() => console.log('Effect 2'));  // Runs second
effect(() => console.log('Effect 3'));  // Runs third

state.value = 10;  // All re-run in same order
```

### How do I prevent infinite loops?

Don't modify tracked state without conditions:

```javascript
// ❌ Infinite loop
effect(() => {
  counter.count++;  // Reads and writes counter.count
});

// ✅ Safe
effect(() => {
  if (counter.count < 10) {
    counter.count++;  // Stops at 10
  }
});

// ✅ Better: don't modify tracked state
effect(() => {
  console.log(counter.count);  // Just read
});
```

### Can I nest effects?

Technically yes, but avoid it:

```javascript
// ❌ BAD: Creates memory leak
effect(() => {
  effect(() => {  // New effect created every run!
    console.log(inner.value);
  });
  console.log(outer.value);
});

// ✅ GOOD: Create at same level
effect(() => console.log(outer.value));
effect(() => console.log(inner.value));
```

### How do cleanup functions work?

Cleanup runs before re-run and on stop:

```javascript
effect(() => {
  console.log('Setup');

  return () => {
    console.log('Cleanup');
  };
});

// Logs: "Setup"
state.value = 10;
// Logs: "Cleanup", then "Setup"
```

### Do effects run immediately?

Yes, effects run immediately when created:

```javascript
const user = state({ name: 'John' });

effect(() => {
  console.log(user.name);  // Logs "John" immediately
});
```

---

## Related Functions

- [computed()](./computed.md) - Create cached derived values
- [watch()](./watch.md) - Observe specific state changes with callbacks
- [bindings()](./bindings.md) - Declarative DOM synchronization

---

## Summary

**effect()** is the bridge between reactive state and reactive behavior:

✅ **Auto-runs** when dependencies change
✅ **Automatic tracking** - no manual configuration
✅ **Perfect for side effects** - DOM, logging, API, storage
✅ **Cleanup support** - manage resources properly
✅ **Stoppable** - returns stop function
✅ **Dynamic dependencies** - tracks based on execution
✅ **Immediate execution** - runs on creation

⚠️ **Avoid infinite loops** - don't modify tracked state without conditions
⚠️ **Clean up effects** - prevent memory leaks
⚠️ **Keep effects focused** - one responsibility per effect

Perfect for keeping your application synchronized, reactive, and responsive to state changes!
