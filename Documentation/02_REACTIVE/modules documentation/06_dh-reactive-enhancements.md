# Complete Usage Guide: Production-Ready Reactive Library

A comprehensive guide to using all the enhancements in your reactive library.

---

## 📦 Installation & Setup

### Load Order (Critical!)

```html
<!-- 1. Core reactive system -->
<script src="01_dh-reactive.js"></script>

<!-- 2. Array patch (optional but recommended) -->
<script src="02_dh-reactive-array-patch.js"></script>

<!-- 3. Collections (optional) -->
<script src="03_dh-reactive-collections.js"></script>

<!-- 4. Forms (optional) -->
<script src="04_dh-reactive-form.js"></script>

<!-- 5. Cleanup system (REQUIRED for production) -->
<script src="05_dh-reactive-cleanup.js"></script>

<!-- 6. Enhancements (REQUIRED for production) -->
<script src="06_dh-reactive-enhancements.js"></script>
```

### TypeScript Setup

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "types": ["./reactive.d.ts"]
  }
}

// In your code
import type { ReactiveUtils, ReactiveState } from './reactive';

const state: ReactiveState<{ count: number }> = ReactiveUtils.state({
  count: 0
});
```

---

## 🎯 Part 1: Enhanced Batching

### The Problem Without Batching

```javascript
const state = ReactiveUtils.state({
  count: 0,
  doubled: 0
});

ReactiveUtils.effect(() => {
  console.log(`count: ${state.count}, doubled: ${state.doubled}`);
});

// Without batching:
state.count = 5;    // Effect runs → "count: 5, doubled: 0" ❌
state.doubled = 10; // Effect runs → "count: 5, doubled: 10" ✅

// Problem: Effect saw inconsistent state!
```

### Solution: Automatic Priority-Based Batching

```javascript
const state = ReactiveUtils.state({
  firstName: 'John',
  lastName: 'Doe'
});

state.$computed('fullName', function() {
  return `${this.firstName} ${this.lastName}`;
});

ReactiveUtils.effect(() => {
  console.log('Full name:', state.fullName);
});

// Batch updates
state.$batch(() => {
  state.firstName = 'Jane';
  state.lastName = 'Smith';
});

// Effect runs ONCE with consistent state
// Logs: "Full name: Jane Smith"
```

### How It Works

The enhancement module ensures:
1. **Computed properties update FIRST** (priority 1)
2. **Watchers run SECOND** (priority 2)
3. **Effects run LAST** (priority 3)

This prevents you from ever seeing stale computed values.

---

## 🗺️ Part 2: Collection Support (Map & Set)

### Problem: Maps and Sets Weren't Reactive

```javascript
// BEFORE enhancements
const state = ReactiveUtils.state({
  cache: new Map()
});

ReactiveUtils.effect(() => {
  console.log('Cache size:', state.cache.size);
});

state.cache.set('key', 'value');
// ❌ No log! Map methods didn't trigger reactivity
```

### Solution: Automatic Collection Tracking

```javascript
// AFTER enhancements
const state = ReactiveUtils.state({
  cache: new Map(),
  tags: new Set()
});

// Watch Map size
ReactiveUtils.effect(() => {
  console.log('Cache has', state.cache.size, 'entries');
});

// Watch Set size
ReactiveUtils.effect(() => {
  console.log('Tags:', Array.from(state.tags).join(', '));
});

// Now these trigger effects!
state.cache.set('user:1', { name: 'Alice' });
// Logs: "Cache has 1 entries"

state.tags.add('javascript');
// Logs: "Tags: javascript"

state.tags.add('reactive');
// Logs: "Tags: javascript, reactive"
```

### Real-World Example: LRU Cache

```javascript
function createLRUCache(maxSize = 100) {
  const state = ReactiveUtils.state({
    cache: new Map(),
    hits: 0,
    misses: 0
  });
  
  state.$computed('size', function() {
    return this.cache.size;
  });
  
  state.$computed('hitRate', function() {
    const total = this.hits + this.misses;
    return total === 0 ? 0 : (this.hits / total * 100).toFixed(2);
  });
  
  // Watch for size changes
  ReactiveUtils.effect(() => {
    if (state.size > maxSize) {
      // Remove oldest entry (first key in Map)
      const firstKey = state.cache.keys().next().value;
      state.cache.delete(firstKey);
    }
  });
  
  return {
    state,
    
    get(key) {
      if (state.cache.has(key)) {
        state.hits++;
        const value = state.cache.get(key);
        // Move to end (most recently used)
        state.cache.delete(key);
        state.cache.set(key, value);
        return value;
      } else {
        state.misses++;
        return null;
      }
    },
    
    set(key, value) {
      if (state.cache.has(key)) {
        state.cache.delete(key);
      }
      state.cache.set(key, value);
    }
  };
}

// Usage
const cache = createLRUCache(3);

cache.set('a', 1);
cache.set('b', 2);
cache.set('c', 3);

console.log(cache.state.size); // 3

cache.set('d', 4); // Triggers eviction
console.log(cache.state.size); // 3 (still)
console.log(cache.state.cache.has('a')); // false (evicted)
```

---

## 💾 Part 3: Enhanced Computed Caching

### Problem: Computed Properties Recalculated Too Often

```javascript
// BEFORE enhancements
const state = ReactiveUtils.state({
  items: Array.from({ length: 10000 }, (_, i) => ({ id: i, value: i * 2 }))
});

state.$computed('total', function() {
  console.log('Computing total...'); // Called multiple times!
  return this.items.reduce((sum, item) => sum + item.value, 0);
});

// Two effects access the same computed
ReactiveUtils.effect(() => {
  console.log('Effect 1:', state.total);
});
// Logs: "Computing total..."

ReactiveUtils.effect(() => {
  console.log('Effect 2:', state.total);
});
// Logs: "Computing total..." ← COMPUTED AGAIN! ❌
```

### Solution: Cross-Effect Caching

```javascript
// AFTER enhancements
const state = ReactiveUtils.state({
  items: Array.from({ length: 10000 }, (_, i) => ({ id: i, value: i * 2 }))
});

state.$computed('total', function() {
  console.log('Computing total...');
  return this.items.reduce((sum, item) => sum + item.value, 0);
});

ReactiveUtils.effect(() => {
  console.log('Effect 1:', state.total);
});
// Logs: "Computing total..."

ReactiveUtils.effect(() => {
  console.log('Effect 2:', state.total);
});
// Uses cached value! No "Computing total..." log ✅

// Only recomputes when dependencies change
state.items.push({ id: 10000, value: 20000 });
// NOW it logs: "Computing total..."
```

### Cycle Detection

```javascript
// This would cause an infinite loop
const state = ReactiveUtils.state({ value: 1 });

state.$computed('a', function() {
  return this.b * 2; // Depends on b
});

state.$computed('b', function() {
  return this.a * 2; // Depends on a → CYCLE!
});

// BEFORE: Infinite recursion → stack overflow
// AFTER: Clear error message
try {
  console.log(state.a);
} catch (e) {
  // Error: Circular dependency: a → b → a
}
```

---

## 🛡️ Part 4: Error Boundaries

### Problem: One Bad Effect Crashes Everything

```javascript
// BEFORE error boundaries
const state = ReactiveUtils.state({ count: 0 });

ReactiveUtils.effect(() => {
  console.log('Good effect 1:', state.count);
});

ReactiveUtils.effect(() => {
  throw new Error('Oops!'); // This crashes...
});

ReactiveUtils.effect(() => {
  console.log('Good effect 2:', state.count); // ...and this never runs
});
```

### Solution: Safe Effects with Error Isolation

```javascript
// AFTER error boundaries
const state = ReactiveUtils.state({ count: 0 });

ReactiveUtils.safeEffect(() => {
  console.log('Good effect 1:', state.count);
});

ReactiveUtils.safeEffect(() => {
  throw new Error('Oops!'); // This crashes BUT...
});

ReactiveUtils.safeEffect(() => {
  console.log('Good effect 2:', state.count); // ...this STILL runs! ✅
});

// All effects execute, errors are logged but isolated
```

### Custom Error Handling

```javascript
const errorLog = [];

ReactiveUtils.safeEffect(
  () => {
    // Risky operation
    const data = JSON.parse(state.jsonString);
    processData(data);
  },
  {
    errorBoundary: {
      onError: (error, context) => {
        errorLog.push({
          error: error.message,
          timestamp: Date.now(),
          attempt: context.attempt
        });
      },
      retry: true,
      maxRetries: 3,
      retryDelay: 1000, // Wait 1s between retries
      fallback: (error) => {
        // Use default value on failure
        return { default: true };
      }
    }
  }
);
```

### Real-World Example: API Call with Retry

```javascript
function createApiCall(url) {
  const state = ReactiveUtils.state({
    data: null,
    error: null,
    retries: 0
  });
  
  ReactiveUtils.safeEffect(
    async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      state.data = await response.json();
      state.error = null;
    },
    {
      errorBoundary: {
        onError: (error, context) => {
          state.error = error.message;
          state.retries = context.attempt;
          console.log(`Retry ${context.attempt}/${context.maxRetries}`);
        },
        retry: true,
        maxRetries: 3,
        retryDelay: 2000
      }
    }
  );
  
  return state;
}
```

---

## ⚡ Part 5: Async Effects & Enhanced Async State

### Problem: Manual Cancellation is Hard

```javascript
// BEFORE async enhancements
let currentRequest = null;

ReactiveUtils.effect(async () => {
  // Cancel previous request? How?
  const userId = state.selectedUserId;
  const data = await fetchUser(userId);
  state.userData = data;
});

// Race condition: Fast-typing user triggers multiple requests
// Results arrive out of order → wrong data displayed
```

### Solution: Async Effects with Auto-Cancellation

```javascript
const state = ReactiveUtils.state({
  selectedUserId: null,
  userData: null
});

ReactiveUtils.asyncEffect(async (signal) => {
  const userId = state.selectedUserId;
  
  if (!userId) return;
  
  // Fetch with AbortSignal
  const response = await fetch(`/api/users/${userId}`, { signal });
  const data = await response.json();
  
  state.userData = data;
  
  // Return cleanup function (optional)
  return () => {
    console.log('Effect cleaned up');
  };
});

// When selectedUserId changes:
// 1. Previous fetch is automatically cancelled
// 2. Cleanup function runs
// 3. New fetch starts
// Result: No race conditions! ✅
```

### Enhanced Async State

```javascript
const userState = ReactiveUtils.asyncState(null, {
  onSuccess: (data) => {
    console.log('User loaded:', data.name);
  },
  onError: (error) => {
    console.error('Failed to load user:', error);
  }
});

// Computed helpers
console.log(userState.isIdle);    // true
console.log(userState.isSuccess); // false
console.log(userState.isError);   // false

// Execute async operation
const result = await userState.$execute(async (signal) => {
  const response = await fetch('/api/user', { signal });
  return response.json();
});

if (result.success) {
  console.log('Data:', result.data);
}

// Later, cancel if needed
userState.$abort();

// Or refetch
userState.$refetch();
```

### Real-World Example: Search with Debounce

```javascript
function createSearchBox() {
  const state = ReactiveUtils.state({
    query: '',
    debouncedQuery: ''
  });
  
  const searchState = ReactiveUtils.asyncState([]);
  
  // Debounce query changes
  let debounceTimer;
  state.$watch('query', (newQuery) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      state.debouncedQuery = newQuery;
    }, 300);
  });
  
  // Search when debounced query changes
  ReactiveUtils.asyncEffect(async (signal) => {
    const query = state.debouncedQuery;
    
    if (!query) {
      searchState.data = [];
      return;
    }
    
    await searchState.$execute(async (signal) => {
      const response = await fetch(`/api/search?q=${query}`, { signal });
      return response.json();
    });
  });
  
  return {
    state,
    searchState,
    
    setQuery(value) {
      state.query = value;
    }
  };
}

// Usage
const search = createSearchBox();

// Bind to input
document.querySelector('#search').addEventListener('input', (e) => {
  search.setQuery(e.target.value);
});

// Display results
ReactiveUtils.effect(() => {
  const results = search.searchState.data || [];
  const resultsEl = document.querySelector('#results');
  
  if (search.searchState.loading) {
    resultsEl.innerHTML = '<div>Loading...</div>';
  } else if (search.searchState.error) {
    resultsEl.innerHTML = '<div>Error: ' + search.searchState.error.message + '</div>';
  } else {
    resultsEl.innerHTML = results.map(r => 
      `<div>${r.title}</div>`
    ).join('');
  }
});
```

---

## 🔍 Part 6: DevTools

### Enable DevTools

```javascript
// Auto-enabled on localhost
// Manual control:
ReactiveUtils.DevTools.enable();
// Or disable:
ReactiveUtils.DevTools.disable();
```

### Track Custom States

```javascript
const appState = ReactiveUtils.state({ user: null });
ReactiveUtils.DevTools.trackState(appState, 'AppState');

const cartState = ReactiveUtils.state({ items: [] });
ReactiveUtils.DevTools.trackState(cartState, 'ShoppingCart');
```

### Inspect in Console

```javascript
// Get all tracked states
const states = window.__REACTIVE_DEVTOOLS__.getStates();
console.log(states);
// [
//   { id: 1, name: 'AppState', created: 1234567890, state: {...} },
//   { id: 2, name: 'ShoppingCart', created: 1234567891, state: {...} }
// ]

// Get change history
const history = window.__REACTIVE_DEVTOOLS__.getHistory();
console.log(history);
// [
//   { stateId: 1, stateName: 'AppState', key: 'user', oldValue: null, newValue: {...}, timestamp: ... },
//   { stateId: 2, stateName: 'ShoppingCart', key: 'items', oldValue: [], newValue: [...], timestamp: ... }
// ]

// Clear history
window.__REACTIVE_DEVTOOLS__.clearHistory();
```

---

## 🎯 Complete Real-World Example: Todo App

```javascript
// Create todo app with all enhancements
function createTodoApp() {
  // State with Map for fast lookups
  const state = ReactiveUtils.state({
    todos: new Map(),
    filter: 'all', // 'all', 'active', 'completed'
    nextId: 1
  });
  
  // Track in DevTools
  ReactiveUtils.DevTools.trackState(state, 'TodoApp');
  
  // Computed: filtered todos
  state.$computed('filteredTodos', function() {
    const todos = Array.from(this.todos.values());
    
    switch (this.filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  });
  
  // Computed: counts
  state.$computed('activeCount', function() {
    return Array.from(this.todos.values())
      .filter(t => !t.completed).length;
  });
  
  state.$computed('completedCount', function() {
    return Array.from(this.todos.values())
      .filter(t => t.completed).length;
  });
  
  // Async: Save to server
  const saveState = ReactiveUtils.asyncState();
  
  // Cleanup collector
  const cleanups = ReactiveCleanup.collector();
  
  // Render todos
  cleanups.add(
    ReactiveUtils.safeEffect(() => {
      const container = document.querySelector('#todo-list');
      if (!container) return;
      
      container.innerHTML = state.filteredTodos
        .map(todo => `
          <div class="todo ${todo.completed ? 'completed' : ''}">
            <input type="checkbox" 
                   data-id="${todo.id}"
                   ${todo.completed ? 'checked' : ''}>
            <span>${todo.text}</span>
            <button data-id="${todo.id}" class="delete">×</button>
          </div>
        `)
        .join('');
    })
  );
  
  // Render stats
  cleanups.add(
    ReactiveUtils.effect(() => {
      const stats = document.querySelector('#stats');
      if (!stats) return;
      
      stats.textContent = `${state.activeCount} active, ${state.completedCount} completed`;
    })
  );
  
  // Auto-save when todos change
  cleanups.add(
    ReactiveUtils.asyncEffect(async (signal) => {
      const todos = Array.from(state.todos.values());
      
      await saveState.$execute(async (signal) => {
        const response = await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(todos),
          signal
        });
        
        if (!response.ok) throw new Error('Save failed');
        return response.json();
      });
    })
  );
  
  return {
    state,
    saveState,
    
    addTodo(text) {
      const id = state.nextId++;
      state.todos.set(id, {
        id,
        text,
        completed: false,
        createdAt: Date.now()
      });
    },
    
    toggleTodo(id) {
      const todo = state.todos.get(id);
      if (todo) {
        todo.completed = !todo.completed;
        state.todos.set(id, todo); // Trigger reactivity
      }
    },
    
    deleteTodo(id) {
      state.todos.delete(id);
    },
    
    setFilter(filter) {
      state.filter = filter;
    },
    
    clearCompleted() {
      state.$batch(() => {
        for (const [id, todo] of state.todos.entries()) {
          if (todo.completed) {
            state.todos.delete(id);
          }
        }
      });
    },
    
    destroy() {
      cleanups.cleanup();
    }
  };
}

// Initialize app
const app = createTodoApp();

// Wire up events
document.querySelector('#add-todo').addEventListener('click', () => {
  const input = document.querySelector('#todo-input');
  if (input.value.trim()) {
    app.addTodo(input.value);
    input.value = '';
  }
});

document.querySelector('#todo-list').addEventListener('click', (e) => {
  const id = parseInt(e.target.dataset.id);
  
  if (e.target.type === 'checkbox') {
    app.toggleTodo(id);
  } else if (e.target.classList.contains('delete')) {
    app.deleteTodo(id);
  }
});

// Filter buttons
document.querySelectorAll('[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    app.setFilter(btn.dataset.filter);
  });
});
```

---

## 📋 Quick Reference

### When to Use Each Feature

| Feature | Use When |
|---------|----------|
| **safeEffect** | Effect might throw errors |
| **asyncEffect** | Effect does async work (fetch, timers) |
| **asyncState** | Managing API calls or async operations |
| **Map/Set** | Need fast lookups or unique collections |
| **Cleanup collector** | Managing multiple lifecycle cleanups |
| **DevTools** | Debugging reactive behavior |
| **Error boundaries** | Production apps that need resilience |

### Performance Tips

1. **Use computed for derived values** - They cache automatically
2. **Batch updates** - Use `state.$batch()` for multiple changes
3. **Use Map for large collections** - O(1) lookups vs O(n) for arrays
4. **Cleanup effects** - Prevent memory leaks in long-running apps
5. **Use asyncEffect for fetches** - Automatic cancellation prevents race conditions

---

## 🚀 What You've Gained

With these enhancements, your reactive library now has:

✅ **No race conditions** - Priority-based batching
✅ **No memory leaks** - Proper cleanup system
✅ **Full collection support** - Maps and Sets work perfectly
✅ **Smart caching** - Computed properties optimize automatically
✅ **Resilient effects** - Error boundaries prevent cascading failures
✅ **Modern async** - Auto-cancellation and race condition prevention
✅ **Developer tools** - Inspect and debug reactive behavior
✅ **Type safety** - Full TypeScript support

Your reactive library is now **production-ready**! 🎉
