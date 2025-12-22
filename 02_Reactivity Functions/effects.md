# effects()

Create multiple reactive effects in a single batch with unified cleanup.

## Quick Start (30 seconds)

```javascript
import { state, effects } from './state.js';

// Create state
const app = state({
  count: 0,
  user: 'John',
  theme: 'light'
});

// Create multiple effects at once
const cleanup = effects({
  updateCount: () => {
    document.getElementById('count').textContent = app.count;
  },

  updateUser: () => {
    document.getElementById('user').textContent = app.user;
  },

  updateTheme: () => {
    document.body.className = app.theme;
  }
});

// Changes automatically trigger effects
app.count = 5;      // updateCount runs
app.user = 'Jane';  // updateUser runs
app.theme = 'dark'; // updateTheme runs

// Stop all effects with single cleanup
// cleanup();
```

**That's it!** All effects are created, named, and managed with a single cleanup function.

---

## Mental Model: Team Task Assignment

Think of `effects()` like **assigning tasks to a team**:

```
effect()     →  Hiring one person for one task
effects()    →  Hiring a team with assigned roles

Single hire: "John, update the counter"
Team hire:   {
  John: "Update counter",
  Sarah: "Update theme",
  Mike: "Update user display"
}
```

**Just like a team:**
- Each member has a specific role (named effect)
- All work together toward the same goal
- One command to dismiss entire team (unified cleanup)
- Clear responsibility assignments

**Key benefit:** Organized, batch management instead of individual coordination.

---

## What is effects()?

`effects()` is a **batch utility function** that creates multiple reactive effects from a single object definition.

```javascript
import { effects } from './state.js';

const cleanup = effects({
  effectName1: () => { /* runs when dependencies change */ },
  effectName2: () => { /* runs when dependencies change */ },
  effectName3: () => { /* runs when dependencies change */ }
});

// Single cleanup stops all effects
cleanup();
```

### effects() vs effect()

```
┌─────────────────────────────────────────────────────────────┐
│                 SINGLE VS BATCH EFFECTS                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SINGLE: effect()                                           │
│  ─────────────────                                          │
│  const stop1 = effect(() => {                               │
│    document.getElementById('count').textContent = app.count;│
│  });                                                        │
│                                                             │
│  const stop2 = effect(() => {                               │
│    document.getElementById('user').textContent = app.user; │
│  });                                                        │
│                                                             │
│  const stop3 = effect(() => {                               │
│    document.body.className = app.theme;                    │
│  });                                                        │
│                                                             │
│  // Must track 3 cleanup functions                         │
│  stop1(); stop2(); stop3();                                │
│                                                             │
│  ✓ Good for: Single, standalone effects                    │
│  ✓ Full control over each effect                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  BATCH: effects()                                           │
│  ─────────────────                                          │
│  const cleanup = effects({                                  │
│    updateCount: () => {                                     │
│      document.getElementById('count').textContent = app.count;│
│    },                                                       │
│    updateUser: () => {                                      │
│      document.getElementById('user').textContent = app.user;│
│    },                                                       │
│    updateTheme: () => {                                     │
│      document.body.className = app.theme;                  │
│    }                                                        │
│  });                                                        │
│                                                             │
│  // Single cleanup function                                │
│  cleanup();                                                 │
│                                                             │
│  ✓ Good for: Related effects                               │
│  ✓ Named and organized                                     │
│  ✓ Unified cleanup                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Choose based on use case:**
- Use `effect()` for single, independent effects
- Use `effects()` for batches of related effects

---

## Manual Approach vs effects()

### ❌ Without effects() - Multiple Cleanups

```javascript
const app = state({
  name: 'John',
  email: 'john@example.com',
  theme: 'light'
});

// Create effects individually
const cleanup1 = effect(() => {
  document.getElementById('name').textContent = app.name;
});

const cleanup2 = effect(() => {
  document.getElementById('email').textContent = app.email;
});

const cleanup3 = effect(() => {
  document.body.className = app.theme;
});

// Must track all cleanups manually
const cleanups = [cleanup1, cleanup2, cleanup3];

// Cleanup requires loop
function cleanupAll() {
  cleanups.forEach(fn => fn());
}

// Problems:
// - Multiple variables to track
// - No naming/organization
// - Manual cleanup management
// - Easy to forget cleanups
// - Verbose
```

### ✅ With effects() - Unified Cleanup

```javascript
const app = state({
  name: 'John',
  email: 'john@example.com',
  theme: 'light'
});

// Create all effects at once
const cleanup = effects({
  updateName: () => {
    document.getElementById('name').textContent = app.name;
  },

  updateEmail: () => {
    document.getElementById('email').textContent = app.email;
  },

  updateTheme: () => {
    document.body.className = app.theme;
  }
});

// Single cleanup
cleanup();

// Benefits:
// ✓ One variable to track
// ✓ Named effects
// ✓ Organized in object
// ✓ Single cleanup call
// ✓ Clear and concise
```

---

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    EFFECTS() WORKFLOW                       │
└─────────────────────────────────────────────────────────────┘

1. SETUP PHASE
   ────────────────────────────────────────────────────────
   effects({
     effect1: () => { ... },
     effect2: () => { ... },
     effect3: () => { ... }
   })

   → Iterates over definitions object
   → Creates effect() for each function
   → Collects cleanup functions

2. EXECUTION
   ────────────────────────────────────────────────────────
   Each effect:
   → Runs immediately
   → Tracks dependencies automatically
   → Re-runs when dependencies change

3. CLEANUP
   ────────────────────────────────────────────────────────
   cleanup()

   → Calls all collected cleanup functions
   → Stops all effects at once
   → Cleans up all subscriptions

┌─────────────────────────────────────────────────────────────┐
│                     INTERNAL STRUCTURE                      │
└─────────────────────────────────────────────────────────────┘

effects({ a: fn1, b: fn2, c: fn3 })
   ↓
cleanups = [
  effect(fn1),  // Returns cleanup for effect a
  effect(fn2),  // Returns cleanup for effect b
  effect(fn3)   // Returns cleanup for effect c
]
   ↓
return () => cleanups.forEach(cleanup => cleanup())
```

---

## Common Use Cases

### 1. Dashboard Updates

```javascript
const dashboard = state({
  visitors: 1234,
  pageViews: 5678,
  revenue: 9876.50,
  conversions: 45,
  loading: false
});

effects({
  visitorsWidget: () => {
    const el = document.getElementById('visitors');
    el.textContent = dashboard.visitors.toLocaleString();
  },

  pageViewsWidget: () => {
    const el = document.getElementById('pageViews');
    el.textContent = dashboard.pageViews.toLocaleString();
  },

  revenueWidget: () => {
    const el = document.getElementById('revenue');
    el.textContent = `$${dashboard.revenue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  },

  conversionsWidget: () => {
    document.getElementById('conversions').textContent = dashboard.conversions;
  },

  loadingIndicator: () => {
    const spinner = document.getElementById('spinner');
    spinner.style.display = dashboard.loading ? 'block' : 'none';
  }
});

// Update dashboard data
dashboard.visitors = 1500;    // visitorsWidget updates
dashboard.revenue = 10250.75; // revenueWidget updates
dashboard.loading = true;     // loadingIndicator updates
```

### 2. Form Field Sync

```javascript
const form = state({
  username: '',
  email: '',
  password: '',
  agreedToTerms: false,
  errors: {},
  isValid: false
});

effects({
  usernamePreview: () => {
    document.getElementById('usernameDisplay').textContent =
      form.username || '(not set)';
  },

  emailPreview: () => {
    document.getElementById('emailDisplay').textContent =
      form.email || '(not set)';
  },

  passwordStrength: () => {
    const strength = calculateStrength(form.password);
    const meter = document.getElementById('strengthMeter');
    meter.style.width = `${strength}%`;
    meter.className = strength > 75 ? 'strong' :
                      strength > 50 ? 'medium' : 'weak';
  },

  validationErrors: () => {
    const container = document.getElementById('errors');
    container.innerHTML = Object.values(form.errors)
      .map(err => `<div class="error">${err}</div>`)
      .join('');
  },

  submitButton: () => {
    const btn = document.getElementById('submit');
    btn.disabled = !form.isValid;
  }
});

function calculateStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  return strength;
}
```

### 3. Notification System

```javascript
const notifications = state({
  items: [],
  unreadCount: 0,
  sound: true
});

effects({
  notificationBadge: () => {
    const badge = document.getElementById('notifBadge');
    badge.textContent = notifications.unreadCount;
    badge.style.display = notifications.unreadCount > 0 ? 'inline' : 'none';
  },

  notificationList: () => {
    const list = document.getElementById('notifList');
    list.innerHTML = notifications.items.map(notif => `
      <div class="notification ${notif.read ? 'read' : 'unread'}">
        <h4>${notif.title}</h4>
        <p>${notif.message}</p>
        <time>${new Date(notif.time).toLocaleTimeString()}</time>
      </div>
    `).join('');
  },

  documentTitle: () => {
    const count = notifications.unreadCount;
    document.title = count > 0 ? `(${count}) Notifications` : 'Notifications';
  },

  playSound: (() => {
    let previousCount = 0;
    return () => {
      if (notifications.sound && notifications.unreadCount > previousCount) {
        new Audio('/sounds/notification.mp3').play();
      }
      previousCount = notifications.unreadCount;
    };
  })()
});

// Add notification
notifications.items.push({
  title: 'New Message',
  message: 'You have a new message',
  time: Date.now(),
  read: false
});
notifications.unreadCount++;
```

### 4. Shopping Cart UI

```javascript
const cart = state({
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0,
  coupon: null
});

effects({
  cartItems: () => {
    const container = document.getElementById('cartItems');

    if (cart.items.length === 0) {
      container.innerHTML = '<p class="empty">Your cart is empty</p>';
      return;
    }

    container.innerHTML = cart.items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="details">
          <h3>${item.name}</h3>
          <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
        </div>
        <div class="subtotal">$${(item.price * item.quantity).toFixed(2)}</div>
      </div>
    `).join('');
  },

  cartSummary: () => {
    document.getElementById('subtotal').textContent = `$${cart.subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${cart.tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${cart.total.toFixed(2)}`;
  },

  cartBadge: () => {
    const badge = document.getElementById('cartBadge');
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = itemCount;
    badge.style.display = itemCount > 0 ? 'inline' : 'none';
  },

  couponDisplay: () => {
    const el = document.getElementById('couponStatus');
    if (cart.coupon) {
      el.textContent = `Coupon "${cart.coupon}" applied`;
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  },

  checkoutButton: () => {
    const btn = document.getElementById('checkout');
    btn.disabled = cart.items.length === 0;
  }
});
```

### 5. Game HUD

```javascript
const game = state({
  score: 0,
  lives: 3,
  level: 1,
  health: 100,
  ammo: 30,
  time: 0,
  paused: false,
  gameOver: false
});

effects({
  scoreDisplay: () => {
    document.getElementById('score').textContent =
      game.score.toLocaleString();
  },

  livesDisplay: () => {
    document.getElementById('lives').innerHTML =
      '❤️ '.repeat(game.lives);
  },

  levelIndicator: () => {
    document.getElementById('level').textContent =
      `Level ${game.level}`;
  },

  healthBar: () => {
    const bar = document.getElementById('healthBar');
    bar.style.width = `${game.health}%`;
    bar.className = game.health > 50 ? 'healthy' :
                     game.health > 25 ? 'warning' : 'critical';
  },

  ammoCounter: () => {
    const counter = document.getElementById('ammo');
    counter.textContent = game.ammo;
    counter.className = game.ammo === 0 ? 'empty' :
                        game.ammo < 10 ? 'low' : '';
  },

  timer: () => {
    const mins = Math.floor(game.time / 60);
    const secs = game.time % 60;
    document.getElementById('timer').textContent =
      `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  pauseOverlay: () => {
    document.getElementById('pauseOverlay').style.display =
      game.paused ? 'flex' : 'none';
  },

  gameOverScreen: () => {
    const screen = document.getElementById('gameOverScreen');
    screen.style.display = game.gameOver ? 'flex' : 'none';
    if (game.gameOver) {
      screen.querySelector('.final-score').textContent = game.score.toLocaleString();
    }
  }
});
```

### 6. User Profile Display

```javascript
const user = state({
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/images/avatar.jpg',
  status: 'online',
  bio: 'Developer',
  followers: 1234,
  following: 567
});

effects({
  nameDisplay: () => {
    document.querySelectorAll('.user-name').forEach(el => {
      el.textContent = user.name;
    });
  },

  emailDisplay: () => {
    document.getElementById('userEmail').textContent = user.email;
  },

  avatarImage: () => {
    document.querySelectorAll('.user-avatar').forEach(img => {
      img.src = user.avatar;
      img.alt = user.name;
    });
  },

  statusIndicator: () => {
    const indicator = document.getElementById('statusIndicator');
    indicator.className = `status-${user.status}`;
    indicator.textContent = user.status.charAt(0).toUpperCase() + user.status.slice(1);
  },

  bioDisplay: () => {
    document.getElementById('userBio').textContent = user.bio || 'No bio';
  },

  followerStats: () => {
    document.getElementById('followers').textContent =
      user.followers.toLocaleString();
    document.getElementById('following').textContent =
      user.following.toLocaleString();

    const ratio = (user.followers / user.following).toFixed(2);
    document.getElementById('followerRatio').textContent = ratio;
  }
});
```

### 7. Settings Panel

```javascript
const settings = state({
  theme: 'light',
  fontSize: 16,
  language: 'en',
  notifications: true,
  autoSave: true,
  soundEnabled: true
});

effects({
  themeApplication: () => {
    document.body.dataset.theme = settings.theme;
    localStorage.setItem('theme', settings.theme);
  },

  fontSizeApplication: () => {
    document.documentElement.style.fontSize = `${settings.fontSize}px`;
    localStorage.setItem('fontSize', settings.fontSize);
  },

  languageUpdate: () => {
    document.documentElement.lang = settings.language;
    localStorage.setItem('language', settings.language);
  },

  notificationToggle: () => {
    const toggle = document.getElementById('notifToggle');
    if (toggle) toggle.checked = settings.notifications;
    localStorage.setItem('notifications', settings.notifications);
  },

  autoSaveToggle: () => {
    const toggle = document.getElementById('autoSaveToggle');
    if (toggle) toggle.checked = settings.autoSave;
    localStorage.setItem('autoSave', settings.autoSave);
  },

  soundToggle: () => {
    const toggle = document.getElementById('soundToggle');
    if (toggle) toggle.checked = settings.soundEnabled;
    localStorage.setItem('soundEnabled', settings.soundEnabled);
  }
});
```

### 8. Analytics Dashboard

```javascript
const analytics = state({
  pageViews: 0,
  uniqueVisitors: 0,
  bounceRate: 0,
  avgSessionTime: 0,
  topPages: [],
  traffic Sources: {}
});

effects({
  pageViewsChart: () => {
    updateChart('pageViewsChart', analytics.pageViews);
  },

  visitorsMetric: () => {
    document.getElementById('uniqueVisitors').textContent =
      analytics.uniqueVisitors.toLocaleString();
  },

  bounceRateIndicator: () => {
    const el = document.getElementById('bounceRate');
    el.textContent = `${(analytics.bounceRate * 100).toFixed(1)}%`;
    el.className = analytics.bounceRate > 0.5 ? 'high' : 'normal';
  },

  sessionTimeDisplay: () => {
    const mins = Math.floor(analytics.avgSessionTime / 60);
    const secs = analytics.avgSessionTime % 60;
    document.getElementById('avgSession').textContent =
      `${mins}m ${secs}s`;
  },

  topPagesList: () => {
    const list = document.getElementById('topPages');
    list.innerHTML = analytics.topPages.map((page, i) => `
      <div class="page-item">
        <span class="rank">${i + 1}</span>
        <span class="path">${page.path}</span>
        <span class="views">${page.views}</span>
      </div>
    `).join('');
  },

  trafficSourcesChart: () => {
    updatePieChart('trafficSources', analytics.trafficSources);
  }
});

function updateChart(id, data) {
  // Chart update logic
}

function updatePieChart(id, data) {
  // Pie chart update logic
}
```

---

## Advanced Patterns

### 1. Conditional Effect Creation

```javascript
function createAppEffects(config = {}) {
  const effectDefs = {};

  // Always include core effects
  effectDefs.coreUI = () => {
    document.getElementById('app').textContent = state.value;
  };

  // Conditional effects
  if (config.enableLogging) {
    effectDefs.logging = () => {
      console.log('[State]', state.value);
    };
  }

  if (config.enableAnalytics) {
    effectDefs.analytics = () => {
      trackEvent('state_change', { value: state.value });
    };
  }

  if (config.enablePersistence) {
    effectDefs.persistence = () => {
      localStorage.setItem('appState', JSON.stringify(state));
    };
  }

  return effects(effectDefs);
}

// Create effects based on config
const cleanup = createAppEffects({
  enableLogging: true,
  enableAnalytics: false,
  enablePersistence: true
});
```

### 2. Effect Groups

```javascript
const app = state({ /* ... */ });

const effectGroups = {
  ui: null,
  analytics: null,
  persistence: null
};

function enableUIEffects() {
  effectGroups.ui = effects({
    header: () => updateHeader(app),
    sidebar: () => updateSidebar(app),
    footer: () => updateFooter(app)
  });
}

function enableAnalytics() {
  effectGroups.analytics = effects({
    pageView: () => trackPageView(app),
    userAction: () => trackAction(app)
  });
}

function disableGroup(groupName) {
  if (effectGroups[groupName]) {
    effectGroups[groupName]();
    effectGroups[groupName] = null;
  }
}

function disableAll() {
  Object.keys(effectGroups).forEach(disableGroup);
}

// Usage
enableUIEffects();
enableAnalytics();

// Later
disableGroup('analytics');  // Stop only analytics
disableAll();               // Stop everything
```

### 3. Debounced/Throttled Effects

```javascript
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, limit) {
  let waiting = false;
  return function(...args) {
    if (!waiting) {
      fn.apply(this, args);
      waiting = true;
      setTimeout(() => waiting = false, limit);
    }
  };
}

const search = state({
  query: '',
  scrollY: 0
});

effects({
  // Debounced search
  performSearch: debounce(() => {
    if (search.query.length > 0) {
      fetch(`/api/search?q=${search.query}`)
        .then(r => r.json())
        .then(results => displayResults(results));
    }
  }, 300),

  // Throttled scroll indicator
  updateScrollIndicator: throttle(() => {
    const percent = (search.scrollY / document.body.scrollHeight) * 100;
    document.getElementById('scrollIndicator').style.width = `${percent}%`;
  }, 100)
});
```

### 4. Named Effect Management

```javascript
const effectRegistry = new Map();

function registerEffects(name, definitions) {
  const cleanup = effects(definitions);
  effectRegistry.set(name, cleanup);
  return cleanup;
}

function unregisterEffects(name) {
  const cleanup = effectRegistry.get(name);
  if (cleanup) {
    cleanup();
    effectRegistry.delete(name);
  }
}

// Register different effect sets
registerEffects('dashboard', {
  updateCharts: () => { /* ... */ },
  updateMetrics: () => { /* ... */ }
});

registerEffects('notifications', {
  updateBadge: () => { /* ... */ },
  updateList: () => { /* ... */ }
});

// Later: unregister specific set
unregisterEffects('dashboard');
```

---

## Performance Tips

### 1. Batch Related Effects

```javascript
// ❌ BAD: Separate effects that could be combined
effects({
  updateName: () => {
    document.getElementById('name').textContent = user.name;
  },
  updateEmail: () => {
    document.getElementById('email').textContent = user.email;
  }
});

// ✅ GOOD: Combine when they update together
effects({
  updateUserInfo: () => {
    document.getElementById('name').textContent = user.name;
    document.getElementById('email').textContent = user.email;
  }
});
```

### 2. Use Computed for Heavy Calculations

```javascript
// ❌ BAD: Heavy calculation in effect
effects({
  updateList: () => {
    const sorted = [...data.items].sort((a, b) => b.value - a.value);
    renderList(sorted);
  }
});

// ✅ GOOD: Use computed property
computed(data, {
  sortedItems: s => [...s.items].sort((a, b) => b.value - a.value)
});

effects({
  updateList: () => {
    renderList(data.sortedItems);  // Uses cached value
  }
});
```

### 3. Clean Up When Done

```javascript
// Component lifecycle
let effectCleanup = null;

function mountComponent() {
  effectCleanup = effects({
    updateUI: () => { /* ... */ }
  });
}

function unmountComponent() {
  if (effectCleanup) {
    effectCleanup();
    effectCleanup = null;
  }
}
```

---

## Common Pitfalls

### 1. Infinite Loops

```javascript
// ❌ WRONG: Effect modifies its dependency
effects({
  increment: () => {
    console.log(counter.value);
    counter.value++;  // Infinite loop!
  }
});

// ✅ CORRECT: Only read dependencies
effects({
  display: () => {
    console.log(counter.value);  // Just read
  }
});
```

### 2. Forgetting Cleanup

```javascript
// ❌ WRONG: No cleanup
function createWidget() {
  effects({
    update: () => { /* ... */ }
  });
  // Effects keep running even after widget removed!
}

// ✅ CORRECT: Return cleanup
function createWidget() {
  const cleanup = effects({
    update: () => { /* ... */ }
  });

  return {
    destroy: cleanup
  };
}
```

### 3. Reading Outside Effect

```javascript
// ❌ WRONG: Read outside effect
const userName = user.name;  // Not reactive

effects({
  display: () => {
    document.getElementById('name').textContent = userName;  // Won't update!
  }
});

// ✅ CORRECT: Read inside effect
effects({
  display: () => {
    document.getElementById('name').textContent = user.name;  // Reactive!
  }
});
```

---

## Real-World Example: Todo App Effects

```javascript
import { state, effects, computed } from './state.js';

const app = state({
  todos: [],
  filter: 'all',
  newTodo: ''
});

computed(app, {
  filteredTodos: s => {
    if (s.filter === 'active') return s.todos.filter(t => !t.done);
    if (s.filter === 'completed') return s.todos.filter(t => t.done);
    return s.todos;
  },
  activeCount: s => s.todos.filter(t => !t.done).length,
  completedCount: s => s.todos.filter(t => t.done).length
});

const cleanup = effects({
  // Render todo list
  todoList: () => {
    const list = document.getElementById('todoList');
    list.innerHTML = app.filteredTodos.map(todo => `
      <li class="${todo.done ? 'completed' : ''}">
        <input type="checkbox" ${todo.done ? 'checked' : ''} data-id="${todo.id}">
        <span>${todo.text}</span>
        <button data-id="${todo.id}">Delete</button>
      </li>
    `).join('');
  },

  // Update counters
  counters: () => {
    document.getElementById('activeCount').textContent = app.activeCount;
    document.getElementById('completedCount').textContent = app.completedCount;
    document.getElementById('totalCount').textContent = app.todos.length;
  },

  // Update filter buttons
  filterButtons: () => {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === app.filter);
    });
  },

  // Save to localStorage
  persistence: () => {
    localStorage.setItem('todos', JSON.stringify(app.todos));
  },

  // Clear input after adding
  inputField: () => {
    document.getElementById('newTodo').value = app.newTodo;
  }
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

// Load saved todos
const saved = localStorage.getItem('todos');
if (saved) app.todos = JSON.parse(saved);
```

---

## API Reference

### effects(definitions)

Creates multiple reactive effects from an object definition.

**Parameters:**
- `definitions` (Object): Object mapping effect names to effect functions
  - Keys: Effect names (for organization)
  - Values: Functions that run when dependencies change

**Returns:**
- `Function`: Cleanup function that stops all effects

**Example:**
```javascript
const cleanup = effects({
  effect1: () => console.log(state.value),
  effect2: () => document.title = state.title
});

// Stop all effects
cleanup();
```

---

## Frequently Asked Questions

### When should I use effects() vs effect()?

**Use `effects()`** when:
- Creating multiple related effects
- Want organized, named effects
- Need unified cleanup
- Setting up UI synchronization

**Use `effect()`** when:
- Creating a single effect
- Need individual cleanup control
- Effect is standalone

### Can I mix effects() and effect()?

Yes! Use them together:

```javascript
// Batch effects
const batchCleanup = effects({
  ui1: () => { /* ... */ },
  ui2: () => { /* ... */ }
});

// Individual effect
const singleCleanup = effect(() => {
  console.log('Standalone effect');
});

// Clean up both
batchCleanup();
singleCleanup();
```

### Do effect names matter?

Effect names are for organization only - they don't affect functionality:

```javascript
effects({
  myEffect: () => { /* ... */ },      // Name for clarity
  x: () => { /* ... */ },             // Any name works
  updateUI: () => { /* ... */ }       // Descriptive is better
});
```

### Can I add/remove effects dynamically?

No, once created, you can't modify the set. Instead, create new sets:

```javascript
let cleanup = effects({ effect1: () => { /* ... */ } });

// To change: stop old, create new
cleanup();
cleanup = effects({
  effect1: () => { /* ... */ },
  effect2: () => { /* ... */ }  // Added new effect
});
```

### How do I stop just one effect?

You can't stop individual effects from `effects()`. Use separate `effect()` calls if you need individual control:

```javascript
// If you need individual control
const cleanup1 = effect(() => { /* ... */ });
const cleanup2 = effect(() => { /* ... */ });

cleanup1();  // Stop just this one
```

---

## Related Functions

- [effect()](./effect.md) - Create single reactive effect
- [computed()](./computed.md) - Create cached derived values
- [bindings()](./bindings.md) - Declarative DOM synchronization

---

## Summary

**effects()** creates multiple reactive effects in one batch:

✅ **Batch creation** - Define multiple effects at once
✅ **Named organization** - Give effects meaningful names
✅ **Unified cleanup** - Single function stops all effects
✅ **Automatic tracking** - Dependencies tracked automatically
✅ **Perfect for UI sync** - Update multiple DOM elements
✅ **Clean code** - Organized and readable

⚠️ **No individual cleanup** - All effects stop together
⚠️ **Avoid infinite loops** - Don't modify dependencies
⚠️ **Always cleanup** - Prevent memory leaks

Perfect for organizing related effects, synchronizing UIs, and managing cleanup in one place!
