[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Full Power: Reactive + DOM Helpers Together

## What This Section Is About

You've learned each piece individually:

- **Reactive** — state that tracks changes and notifies effects
- **Core** — `.update()` with 13 update types and change detection
- **Enhancers** — bulk updates, array distribution, index targeting
- **Conditions** — declarative conditional rendering per state value

This section shows what happens when **all four work together** as one unified system — and why this combination is the recommended approach for new projects.

---

## The Full Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Application                         │
│                                                              │
│  state({ ... })          ← Define your data                 │
│  computed(state, { ... }) ← Derive values                   │
│  watch(state, { ... })    ← React to specific changes       │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                     Effect Layer                             │
│                                                              │
│  effect(() => {                                              │
│    Elements.textContent({ ... })  ← Bulk by ID              │
│    ClassName.card.update({        ← Array distribution       │
│      textContent: [...]                                      │
│    });                                                        │
│    collection.update({            ← Index-based              │
│      [0]: { ... }, [-1]: { ... } })                          │
│  });                                                          │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                   Conditions Layer                           │
│                                                              │
│  Conditions.whenState(            ← Declarative switching    │
│    () => state.status,                                       │
│    { 'loading': {...}, 'success': {...} }                    │
│  );                                                          │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                     DOM Layer                                │
│                                                              │
│  HTML elements — updated precisely, efficiently             │
│  Change detection — only what changed, never redundant       │
└─────────────────────────────────────────────────────────────┘
```

---

## Why This Combination?

### The Problem with Plain JavaScript at Scale

As applications grow, plain JavaScript DOM management hits three walls:

**Wall 1: Synchronization**
```
You change data in one place.
You must remember every place the DOM must update.
Miss one → UI is stale. No warning. Users see wrong information.
```

**Wall 2: Repetition**
```
Every property × every element = manual code
5 elements × 4 properties = 20 getElementById calls
Add one element → edit every update function
```

**Wall 3: State Complexity**
```
Multiple properties change together.
Intermediate states appear briefly.
The UI looks wrong for a frame. Users notice.
```

### Why Reactive + DOM Helpers Solves All Three

**Solves Wall 1: Synchronization**
```
Reactive tracks what each effect reads.
When state changes → only affected effects run.
DOM is always in sync. Automatically. Impossibly fast.
```

**Solves Wall 2: Repetition**
```
Elements.textContent({ id1: val1, id2: val2, id3: val3 })
ClassName.card.update({ textContent: ['A', 'B', 'C'] })
One line per update type. No loops. No boilerplate.
```

**Solves Wall 3: State Complexity**
```
batch(() => { many changes }) → one update cycle
Conditions.whenState → consistent visual states
No intermediate states. Clean transitions.
```

---

## Architecture: How They Connect

```
USER ACTION (click, input, fetch, timer)
        ↓
STATE CHANGE
  state.property = newValue
  set(state, { property: fn })
  batch(() => { multiple changes })
        ↓
REACTIVE SYSTEM
  Proxy detects change
  Finds dependent effects
  Queues updates
        ↓
EFFECTS RUN
  effect(() => {
    Elements.textContent({...})    ← Bulk ID update
    ClassName.item.update({...})   ← Collection update
    Id('element').update({...})    ← Single element
  })
        ↓
CONDITIONS CHECK (parallel)
  Conditions.whenState(...)
  Finds matching condition
  Applies condition updates
        ↓
DOM UPDATES (fine-grained)
  applyEnhancedUpdate() per property
  Change detection: only changed values touch DOM
  Event listener tracking: no duplicates
        ↓
USER SEES RESULT ✨
```

---

## Complete Application: Dashboard

Let's build a complete analytics dashboard that demonstrates everything working together.

### HTML Structure

```html
<!DOCTYPE html>
<html>
<head>
  <title>Analytics Dashboard</title>
</head>
<body>

<!-- Header -->
<header id="app-header" class="header">
  <h1 id="page-title">Dashboard</h1>
  <div id="user-info">
    <span id="user-name"></span>
    <span id="user-role-badge"></span>
  </div>
  <div id="connection-indicator">
    <span id="connection-dot"></span>
    <span id="connection-text"></span>
  </div>
</header>

<!-- Stats Row -->
<section id="stats-row">
  <div class="stat-card" id="card-users">
    <span class="stat-label">Total Users</span>
    <span class="stat-value" id="stat-users">—</span>
    <span class="stat-change" id="change-users"></span>
  </div>
  <div class="stat-card" id="card-revenue">
    <span class="stat-label">Revenue</span>
    <span class="stat-value" id="stat-revenue">—</span>
    <span class="stat-change" id="change-revenue"></span>
  </div>
  <div class="stat-card" id="card-orders">
    <span class="stat-label">Orders</span>
    <span class="stat-value" id="stat-orders">—</span>
    <span class="stat-change" id="change-orders"></span>
  </div>
</section>

<!-- Content Area -->
<main id="main-content">
  <!-- Loading state -->
  <div id="loading-panel" hidden>
    <div class="spinner"></div>
    <p>Loading dashboard data...</p>
  </div>

  <!-- Error state -->
  <div id="error-panel" hidden>
    <p id="error-message"></p>
    <button id="retry-btn">Retry</button>
  </div>

  <!-- Data table -->
  <section id="data-section" hidden>
    <div class="table-header">
      <h2>Recent Orders</h2>
      <span id="order-count-label"></span>
    </div>
    <table id="orders-table">
      <thead>
        <tr>
          <th>Order</th><th>Customer</th><th>Amount</th><th>Status</th>
        </tr>
      </thead>
      <tbody id="orders-tbody"></tbody>
    </table>
  </section>
</main>

<!-- Scripts: load in order -->
<script src="01_dh-core.js"></script>
<script src="01_dh-bulk-property-updaters.js"></script>
<script src="04_dh-indexed-collection-updates.js"></script>
<script src="10_dh-array-based-updates.js"></script>
<script src="01_dh-conditional-rendering.js"></script>
<script src="01_dh-reactive.js"></script>
<script src="09_dh-reactiveUtils-shortcut.js"></script>
<script src="dashboard.js"></script>
</body>
</html>
```

### Application State

```javascript
// dashboard.js

// ============================================================
// STATE DEFINITIONS
// ============================================================

// Authentication state
const auth = state({
  user: null,
  role: 'guest'   // guest | user | admin
});

// Connection state
const connection = state({
  status: 'connecting'  // connecting | connected | disconnected | reconnecting
});

// Dashboard data state
const dashboard = state({
  loadStatus: 'idle',  // idle | loading | loaded | error
  error: null,
  stats: {
    users: 0,
    revenue: 0,
    orders: 0,
    changes: { users: 0, revenue: 0, orders: 0 }
  },
  orders: []
});

// Derived: formatted stats
computed(dashboard, {
  formattedUsers() {
    return this.stats.users.toLocaleString();
  },
  formattedRevenue() {
    return `$${this.stats.revenue.toLocaleString()}`;
  },
  formattedOrders() {
    return this.stats.orders.toLocaleString();
  },
  changeLabels() {
    const { changes } = this.stats;
    return {
      users: changes.users >= 0 ? `+${changes.users}%` : `${changes.users}%`,
      revenue: changes.revenue >= 0 ? `+${changes.revenue}%` : `${changes.revenue}%`,
      orders: changes.orders >= 0 ? `+${changes.orders}%` : `${changes.orders}%`
    };
  }
});
```

### Conditions: Declarative Visual States

```javascript
// ============================================================
// CONDITIONS — Declarative state → UI mapping
// ============================================================

// Connection status indicator
Conditions.whenState(
  () => connection.status,
  {
    'connecting': {
      '#connection-dot': { className: 'dot dot-yellow pulsing' },
      '#connection-text': { textContent: 'Connecting...' }
    },
    'connected': {
      '#connection-dot': { className: 'dot dot-green' },
      '#connection-text': { textContent: 'Live' }
    },
    'disconnected': {
      '#connection-dot': { className: 'dot dot-red' },
      '#connection-text': { textContent: 'Offline' }
    },
    'reconnecting': {
      '#connection-dot': { className: 'dot dot-yellow spinning' },
      '#connection-text': { textContent: 'Reconnecting...' }
    }
  }
);

// Dashboard load state → show correct panel
Conditions.whenState(
  () => dashboard.loadStatus,
  {
    'idle': {
      '#loading-panel': { hidden: true },
      '#error-panel': { hidden: true },
      '#data-section': { hidden: true }
    },
    'loading': {
      '#loading-panel': { hidden: false },
      '#error-panel': { hidden: true },
      '#data-section': { hidden: true }
    },
    'loaded': {
      '#loading-panel': { hidden: true },
      '#error-panel': { hidden: true },
      '#data-section': { hidden: false }
    },
    'error': {
      '#loading-panel': { hidden: true },
      '#error-panel': { hidden: false },
      '#data-section': { hidden: true }
    }
  }
);

// User role → navigation / permissions
Conditions.whenState(
  () => auth.role,
  {
    'guest': {
      '#user-info': { hidden: true }
    },
    'user': {
      '#user-info': { hidden: false },
      '#user-role-badge': { textContent: 'User', className: 'badge badge-blue' }
    },
    'admin': {
      '#user-info': { hidden: false },
      '#user-role-badge': { textContent: 'Admin', className: 'badge badge-red' }
    }
  }
);
```

### Effects: Dynamic Content Updates

```javascript
// ============================================================
// EFFECTS — Dynamic reactive content
// ============================================================

// User name display
effect(() => {
  if (auth.user) {
    Id('user-name').update({ textContent: auth.user.name });
  }
});

// Stats — bulk update when loaded
effect(() => {
  if (dashboard.loadStatus !== 'loaded') return;

  // Bulk textContent update — all stats at once
  Elements.textContent({
    'stat-users': dashboard.formattedUsers,
    'stat-revenue': dashboard.formattedRevenue,
    'stat-orders': dashboard.formattedOrders
  });

  // Change labels — with conditional classes
  const { changes } = dashboard.stats;

  Elements.textContent({
    'change-users': dashboard.changeLabels.users,
    'change-revenue': dashboard.changeLabels.revenue,
    'change-orders': dashboard.changeLabels.orders
  });

  // Color changes based on positive/negative
  Elements.classes({
    'change-users': {
      add: changes.users >= 0 ? 'positive' : 'negative',
      remove: changes.users >= 0 ? 'negative' : 'positive'
    },
    'change-revenue': {
      add: changes.revenue >= 0 ? 'positive' : 'negative',
      remove: changes.revenue >= 0 ? 'negative' : 'positive'
    },
    'change-orders': {
      add: changes.orders >= 0 ? 'positive' : 'negative',
      remove: changes.orders >= 0 ? 'negative' : 'positive'
    }
  });
});

// Error message
effect(() => {
  if (dashboard.error) {
    Id('error-message').update({ textContent: dashboard.error });
  }
});

// Orders table — render when data loads
effect(() => {
  if (dashboard.loadStatus !== 'loaded' || !dashboard.orders.length) return;

  // Build table rows
  const tbody = document.getElementById('orders-tbody');
  tbody.innerHTML = dashboard.orders.map(order => `
    <tr class="order-row" data-status="${order.status}">
      <td class="order-id">#${order.id}</td>
      <td class="order-customer">${order.customer}</td>
      <td class="order-amount">$${order.amount.toFixed(2)}</td>
      <td class="order-status"><span class="status-badge">${order.status}</span></td>
    </tr>
  `).join('');

  // After rendering, apply array distribution for status colors
  const statusColors = dashboard.orders.map(order => {
    const colorMap = { completed: 'green', pending: 'yellow', cancelled: 'red' };
    return `badge-${colorMap[order.status] || 'gray'}`;
  });

  ClassName['status-badge'].update({
    className: statusColors.map(c => `status-badge ${c}`)
  });

  // Update count label
  Id('order-count-label').update({
    textContent: `${dashboard.orders.length} orders`
  });
});
```

### Data Loading and State Updates

```javascript
// ============================================================
// DATA LOADING
// ============================================================

async function loadDashboard() {
  dashboard.loadStatus = 'loading';

  try {
    const [statsRes, ordersRes] = await Promise.all([
      fetch('/api/stats'),
      fetch('/api/orders?limit=10')
    ]);

    if (!statsRes.ok || !ordersRes.ok) {
      throw new Error('Failed to load dashboard data');
    }

    const [stats, orders] = await Promise.all([
      statsRes.json(),
      ordersRes.json()
    ]);

    // Batch: apply all data in one update cycle
    batch(() => {
      dashboard.stats = stats;
      dashboard.orders = orders;
      dashboard.loadStatus = 'loaded';
      dashboard.error = null;
    });

  } catch (err) {
    batch(() => {
      dashboard.error = err.message;
      dashboard.loadStatus = 'error';
    });
  }
}

// ============================================================
// EVENT HANDLERS
// ============================================================

// Retry button
document.getElementById('retry-btn').addEventListener('click', loadDashboard);

// Simulate connection changes (real app: websocket events)
function simulateConnection() {
  setTimeout(() => {
    connection.status = 'connected';

    // Auto-refresh every 30 seconds
    setInterval(async () => {
      connection.status = 'reconnecting';
      await loadDashboard();
      connection.status = 'connected';
    }, 30000);
  }, 1000);
}

// ============================================================
// INITIALIZE
// ============================================================

// Simulate auth (real app: read from cookie/token)
batch(() => {
  auth.user = { name: 'Alice Johnson', id: 1 };
  auth.role = 'admin';
});

simulateConnection();
loadDashboard();
```

---

## What Just Happened? Tracing the Flow

Let's trace what happens when `loadDashboard()` completes:

```
batch(() => {
  dashboard.stats = { users: 1284, revenue: 54200, orders: 392, ... };
  dashboard.orders = [ { id: 1001, customer: 'Alice', ... }, ... ];
  dashboard.loadStatus = 'loaded';
  dashboard.error = null;
});
         ↓
Batch ends — one update cycle fires
         ↓
Reactive finds all effects that read these properties
         ↓
┌─────────────────────────────────────────────────────────┐
│  PARALLEL:                                               │
│                                                          │
│  Conditions.whenState ('loaded') fires:                  │
│  → #loading-panel.hidden = true                          │
│  → #error-panel.hidden = true                            │
│  → #data-section.hidden = false                          │
│                                                          │
│  Stats effect fires:                                     │
│  Elements.textContent({                                  │
│    'stat-users': '1,284',                               │
│    'stat-revenue': '$54,200',                           │
│    'stat-orders': '392'                                  │
│  })                                                      │
│  Elements.classes({ change colors... })                 │
│                                                          │
│  Orders effect fires:                                    │
│  → tbody.innerHTML rendered                              │
│  → ClassName['status-badge'].update({ className: [...] })│
│  → order count label updated                             │
└─────────────────────────────────────────────────────────┘
         ↓
Fine-grained change detection runs:
  "Were these values different from last time?"
  → Yes (first load) → Apply all updates
         ↓
User sees: stats visible, correct values, colored changes,
           orders table rendered, status badges colored
```

All of this from one `batch()` call. One state change. Everything coordinated.

---

## Side-by-Side: Plain JS vs Full Stack

### Updating Stats: Three Approaches

**Approach 1 — Plain JavaScript:**
```javascript
// Must update every element manually in every code path
function renderStats(stats) {
  document.getElementById('stat-users').textContent = stats.users.toLocaleString();
  document.getElementById('stat-revenue').textContent = `$${stats.revenue.toLocaleString()}`;
  document.getElementById('stat-orders').textContent = stats.orders.toLocaleString();
  document.getElementById('change-users').textContent = formatChange(stats.changes.users);
  document.getElementById('change-users').className = stats.changes.users >= 0 ? 'positive' : 'negative';
  document.getElementById('change-revenue').textContent = formatChange(stats.changes.revenue);
  document.getElementById('change-revenue').className = stats.changes.revenue >= 0 ? 'positive' : 'negative';
  document.getElementById('change-orders').textContent = formatChange(stats.changes.orders);
  document.getElementById('change-orders').className = stats.changes.orders >= 0 ? 'positive' : 'negative';
}
// Must call renderStats() everywhere data changes
```

**Approach 2 — Reactive Only:**
```javascript
const dashboard = state({ stats: null });

effect(() => {
  if (!dashboard.stats) return;
  document.getElementById('stat-users').textContent = dashboard.stats.users.toLocaleString();
  document.getElementById('stat-revenue').textContent = `$${dashboard.stats.revenue.toLocaleString()}`;
  // ... etc — still verbose DOM calls
});
```

**Approach 3 — Reactive + DOM Helpers (Recommended for new projects):**
```javascript
const dashboard = state({ stats: null });

computed(dashboard, {
  formattedStats() {
    if (!this.stats) return null;
    return {
      users: this.stats.users.toLocaleString(),
      revenue: `$${this.stats.revenue.toLocaleString()}`,
      orders: this.stats.orders.toLocaleString()
    };
  }
});

effect(() => {
  if (!dashboard.formattedStats) return;
  Elements.textContent({
    'stat-users': dashboard.formattedStats.users,
    'stat-revenue': dashboard.formattedStats.revenue,
    'stat-orders': dashboard.formattedStats.orders
  });
});
```

Each approach works. The third is cleanest, most readable, and most maintainable.

---

## When to Use Each Approach

### Reactive Standalone — For Existing Projects

```
✅ Adding to existing jQuery or vanilla JS project
✅ Minimal change required
✅ One file, works immediately
✅ DOM manipulation stays the same
✅ Prototyping or proof of concept
```

### Reactive + Core (`.update()`) — For Targeted Improvement

```
✅ Need richer update types (classList, style object, attributes)
✅ Want change detection (avoid redundant DOM writes)
✅ Replacing ad-hoc DOM update code
✅ Adding to projects gradually
```

### Reactive + Core + Enhancers — For Scale

```
✅ Multiple elements need updating together
✅ Collections need array distribution or index updates
✅ Reducing boilerplate in effects
✅ New project or major feature
```

### Full Stack (Reactive + Core + Enhancers + Conditions) — For New Projects

```
✅ Building from scratch
✅ Complex UI with multiple visual states
✅ Consistent patterns across the codebase
✅ Scalability is a priority
✅ Team project (consistent API = less confusion)
```

---

## Recommended File Load Order

For a new project using the full stack:

```html
<!-- 1. Core DOM helpers -->
<script src="01_dh-core.js"></script>

<!-- 2. Enhancers (in this order) -->
<script src="01_dh-bulk-property-updaters.js"></script>
<script src="02_dh-collection-shortcuts.js"></script>
<script src="03_dh-global-query.js"></script>
<script src="04_dh-indexed-collection-updates.js"></script>
<script src="07_dh-bulk-properties-updater-global-query.js"></script>
<script src="10_dh-array-based-updates.js"></script>

<!-- 3. Conditions -->
<script src="01_dh-conditional-rendering.js"></script>
<script src="02_dh-conditions-default.js"></script>

<!-- 4. Reactive (after all helpers so they integrate) -->
<script src="01_dh-reactive.js"></script>
<script src="09_dh-reactiveUtils-shortcut.js"></script>  <!-- Load LAST -->

<!-- 5. Your application code -->
<script src="app.js"></script>
```

---

## The Complete API at a Glance

### State (from Reactive)
```javascript
const myState = state({ ... });          // Create reactive state
set(myState, { key: prev => ... });      // Functional update
batch(() => { ... });                     // Group updates
computed(myState, { prop() { ... } });   // Derived values
watch(myState, { prop(n, o) { ... } });  // Change callbacks
effect(() => { ... });                   // Reactive side effects
```

### Element Access (from Core + Enhancers)
```javascript
Id('elementId')                 // By ID
Id.multiple('a', 'b', 'c')     // Multiple by ID
ClassName.myClass               // By class name
ClassName.myClass[0]            // First of class
ClassName.myClass[-1]           // Last of class
TagName.div[2]                  // By tag, specific index
query('#selector')              // querySelector with .update()
queryAll('.selector')           // querySelectorAll with .update()
```

### Single Element Updates (from Core)
```javascript
element.update({
  textContent: 'text',
  style: { color: 'red' },
  classList: { add: 'active', remove: 'old' },
  setAttribute: { 'aria-label': '...' },
  dataset: { id: '42' },
  disabled: true,
  hidden: false
});
```

### Bulk Updates (from Enhancers)
```javascript
Elements.textContent({ id1: val1, id2: val2 });
Elements.style({ id1: {...}, id2: {...} });
Elements.classes({ id1: {...}, id2: {...} });
Elements.attrs({ id1: {...}, id2: {...} });
Elements.dataset({ id1: {...}, id2: {...} });
```

### Collection Updates (from Enhancers)
```javascript
// Array distribution
ClassName.card.update({ textContent: ['A', 'B', 'C'] });

// Index-based
collection.update({
  [0]: { classList: { add: 'first' } },
  [-1]: { classList: { add: 'last' } },
  classList: { remove: 'loading' }  // Applied to ALL
});
```

### Conditions (from Conditions module)
```javascript
Conditions.whenState(
  () => state.status,
  {
    'loading': { '#el': { ... } },
    'success': { '#el': { ... } },
    default: { '#el': { ... } }
  }
);
```

---

## The Big Picture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        The Complete System                           │
│                                                                      │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐    │
│  │   Reactive   │   │     Core     │   │      Enhancers       │    │
│  │              │   │              │   │                      │    │
│  │ state()      │   │ .update()    │   │ Elements.bulk()      │    │
│  │ effect()     │   │ 13 handlers  │   │ ClassName.x.update() │    │
│  │ computed()   │   │ Change       │   │ Array distribution   │    │
│  │ watch()      │   │ detection    │   │ Index targeting      │    │
│  │ batch()      │   │ Listener     │   │ Global shortcuts     │    │
│  │ set()        │   │ tracking     │   │                      │    │
│  └──────┬───────┘   └──────┬───────┘   └──────────┬───────────┘    │
│         │                  │                       │               │
│         └──────────────────┴───────────────────────┘               │
│                            │                                        │
│                    ┌───────┴────────┐                              │
│                    │   Conditions   │                              │
│                    │               │                              │
│                    │ whenState()   │                              │
│                    │ Condition     │                              │
│                    │ matchers      │                              │
│                    │ Default case  │                              │
│                    └───────────────┘                              │
│                            │                                      │
│                     DOM — precise, efficient updates              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Final Summary

**The reactive system works at every level:**

| Level | What You Need | What You Get |
|-------|--------------|--------------|
| Standalone | Only `01_dh-reactive.js` | Complete reactive state, works with any DOM code |
| + Core | + `01_dh-core.js` | `.update()` method, change detection, 13 update types |
| + Enhancers | + enhancer files | Bulk updates, array distribution, index targeting, shortcuts |
| + Conditions | + condition files | Declarative state → visual state mapping |
| Full stack | All modules | The complete, recommended system for new projects |

**The core principle doesn't change at any level:**

```
Change state → Effects run → DOM updates

The sophistication of the DOM update step grows with each layer.
But the reactive core stays the same: state → effect → update.
```

**For existing projects:** Start with Reactive standalone. Add modules as needed.

**For new projects:** Load the full stack. Use the recommended patterns from the start. Your code will be more readable, maintainable, and scalable — from day one.

---

This concludes the Reactive documentation guide. You now have a complete picture of:

1. What Reactive is and how it works
2. How to create, update, and react to state
3. How computed properties and watchers enhance state management
4. The utility functions for fine-grained control
5. The specialized factories for common patterns
6. Advanced patterns like storage and cleanup
7. How to use Reactive standalone in any project
8. How Reactive + DOM Helpers Core makes DOM updates expressive
9. How Enhancers eliminate repetition for bulk and collection updates
10. How Conditions makes conditional rendering declarative
11. How the full system works together as a cohesive architecture

Build something great. 🚀