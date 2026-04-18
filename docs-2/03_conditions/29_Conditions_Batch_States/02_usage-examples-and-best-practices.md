[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Usage Examples and Best Practices

## Quick Start (30 seconds)

```javascript
// Dashboard — three reactive watchers, one cleanup
const cleanup = Conditions.whenWatches([
  [() => users.value,  { '>100': { textContent: 'High' },  'default': { textContent: 'Low' } },  '.traffic'],
  [() => status.value, { 'online': { style: { color: 'green' } }, 'offline': { style: { color: 'red' } } }, '#status'],
  [() => theme.value,  { 'dark': { classList: { add: 'dark' } }, 'light': { classList: { remove: 'dark' } } }, 'body']
]);

// One call cleans up everything
cleanup.destroy();
```

---

## Real-World Examples

### Example 1: Dashboard with Live Metrics

```javascript
const metrics = {
  userCount: state(150),
  revenue: state(12450),
  systemStatus: state('operational')
};

const cleanup = Conditions.whenWatches([
  // Traffic indicator
  [
    () => metrics.userCount.value,
    {
      '>100': { textContent: 'High traffic', style: { color: 'green' } },
      '50-100': { textContent: 'Moderate', style: { color: 'orange' } },
      '<50': { textContent: 'Low traffic', style: { color: 'red' } }
    },
    '.traffic-status'
  ],

  // Revenue display
  [
    () => metrics.revenue.value,
    {
      '>10000': { textContent: 'Excellent!', classList: { add: 'success' } },
      '5000-10000': { textContent: 'Good', classList: { add: 'good' } },
      'default': { textContent: 'Growing...', classList: { add: 'neutral' } }
    },
    '.revenue-status'
  ],

  // System status
  [
    () => metrics.systemStatus.value,
    {
      'operational': { textContent: 'Online', style: { color: 'green' } },
      'degraded': { textContent: 'Degraded', style: { color: 'orange' } },
      'down': { textContent: 'Offline', style: { color: 'red' } }
    },
    '.system-status'
  ]
]);
```

### Example 2: Form Validation

```javascript
const form = {
  email: state(''),
  password: state(''),
  agreed: state(false)
};

const cleanup = Conditions.whenWatches([
  // Email field
  [
    () => {
      const val = form.email.value;
      if (!val) return 'empty';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? 'valid' : 'invalid';
    },
    {
      'empty':   { style: { borderColor: '#ccc' }, classList: { remove: ['is-valid', 'is-invalid'] } },
      'valid':   { style: { borderColor: 'green' }, classList: { add: 'is-valid', remove: 'is-invalid' } },
      'invalid': { style: { borderColor: 'red' }, classList: { add: 'is-invalid', remove: 'is-valid' } }
    },
    '#emailInput'
  ],

  // Password strength
  [
    () => form.password.value.length,
    {
      '0':      { textContent: '', style: { display: 'none' } },
      '>=8':    { textContent: 'Strong', style: { display: 'block', color: 'green' } },
      '4-7':    { textContent: 'Weak', style: { display: 'block', color: 'orange' } },
      'default': { textContent: 'Too short', style: { display: 'block', color: 'red' } }
    },
    '.password-strength'
  ],

  // Submit button
  [
    () => {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value);
      return emailValid && form.password.value.length >= 8 && form.agreed.value;
    },
    {
      'true':  { disabled: false, classList: { add: 'enabled', remove: 'disabled' } },
      'false': { disabled: true, classList: { add: 'disabled', remove: 'enabled' } }
    },
    '#submitBtn'
  ]
]);
```

### Example 3: Static Page Setup with whenApplies()

One-time initialization — no reactivity needed:

```javascript
const cleanup = Conditions.whenApplies([
  // Theme based on time of day
  [
    new Date().getHours() < 18 ? 'light' : 'dark',
    {
      'light': { setAttribute: { 'data-theme': 'light' } },
      'dark':  { setAttribute: { 'data-theme': 'dark' } }
    },
    'body'
  ],

  // Language
  [
    navigator.language.startsWith('fr') ? 'fr' : 'en',
    {
      'fr': { setAttribute: { lang: 'fr' } },
      'en': { setAttribute: { lang: 'en' } }
    },
    'html'
  ],

  // Viewport
  [
    window.innerWidth < 768 ? 'mobile' : 'desktop',
    {
      'mobile':  { classList: { add: 'is-mobile' } },
      'desktop': { classList: { add: 'is-desktop' } }
    },
    'body'
  ]
]);
```

### Example 4: Mixed Mode with whenStates()

Some configs reactive, some static:

```javascript
const cleanup = Conditions.whenStates([
  // Reactive — updates when state changes
  [
    () => userCount.value,
    { '>0': { textContent: 'Has users' }, '0': { textContent: 'No users' } },
    '#userBadge',
    { reactive: true }
  ],

  // Static — applied once
  [
    'admin',
    { 'admin': { textContent: 'Admin' }, 'user': { textContent: 'User' } },
    '#roleBadge',
    { reactive: false }
  ],

  // Reactive — updates when theme changes
  [
    () => theme.value,
    { 'dark': { classList: { add: 'dark-mode' } }, 'light': { classList: { remove: 'dark-mode' } } },
    'body',
    { reactive: true }
  ]
]);
```

### Example 5: Reusable Batch with createBatchConfig()

```javascript
// Define a reusable setup
const setupStatusPanel = Conditions.createBatchConfig([
  [() => apiStatus.value, apiCond, '.api-status'],
  [() => dbStatus.value,  dbCond,  '.db-status'],
  [() => cacheStatus.value, cacheCond, '.cache-status']
], 'watch');

// Execute it — each call is independent
const panel1Cleanup = setupStatusPanel();
const panel2Cleanup = setupStatusPanel();

// Cleanup independently
panel1Cleanup.destroy();
panel2Cleanup.destroy();
```

### Example 6: Modular Organization with combineBatches()

```javascript
// Separate configs by concern
const userConfigs = [
  [() => userName.value, nameCond, '.username'],
  [() => userRole.value, roleCond, '.user-role']
];

const themeConfigs = [
  [() => theme.value,      themeCond,  'body'],
  [() => colorScheme.value, colorCond, '.color-scheme']
];

const dataConfigs = [
  [() => isLoading.value, loadCond,  '.spinner'],
  [() => hasError.value,  errorCond, '.error-msg']
];

// Combine into single batch
const cleanup = Conditions.combineBatches(
  userConfigs,
  themeConfigs,
  dataConfigs
);

// One cleanup for all
cleanup.destroy();
```

### Example 7: Shopping Cart

```javascript
const cart = {
  items: state([]),
  discount: state(0),
  shipping: state('standard')
};

const cleanup = Conditions.whenWatches([
  // Item count
  [
    () => cart.items.value.length,
    {
      '0':      { textContent: 'Cart is empty', style: { color: '#999' } },
      '1':      { textContent: '1 item', style: { color: '#333' } },
      'default': { textContent: `${cart.items.value.length} items`, style: { color: '#333' } }
    },
    '.cart-count'
  ],

  // Discount badge
  [
    () => cart.discount.value,
    {
      '0':  { style: { display: 'none' } },
      '>0': { textContent: `-$${cart.discount.value.toFixed(2)}`, style: { display: 'inline-block', color: 'green' } }
    },
    '.discount-amount'
  ],

  // Shipping method
  [
    () => cart.shipping.value,
    {
      'standard':  { textContent: '$5.99' },
      'express':   { textContent: '$12.99' },
      'overnight': { textContent: '$24.99' },
      'free':      { textContent: 'FREE', style: { color: 'green' } }
    },
    '.shipping-cost'
  ],

  // Checkout button
  [
    () => cart.items.value.length,
    {
      '0':  { disabled: true, textContent: 'Cart is empty', classList: { add: 'disabled' } },
      '>0': { disabled: false, textContent: 'Checkout', classList: { remove: 'disabled' } }
    },
    '#checkoutBtn'
  ]
]);
```

### Example 8: Programmatic Config Generation

```javascript
// Generate configs from data
const fields = ['email', 'password', 'username'];
const validators = {
  email:    { 'empty': { style: { borderColor: '#ccc' } }, 'truthy': { style: { borderColor: 'green' } } },
  password: { 'empty': { style: { borderColor: '#ccc' } }, '>=8':   { style: { borderColor: 'green' } } },
  username: { 'empty': { style: { borderColor: '#ccc' } }, 'truthy': { style: { borderColor: 'green' } } }
};

const configs = fields.map(field => [
  () => form[field].value,
  validators[field],
  `#${field}Input`
]);

const cleanup = Conditions.whenWatches(configs);
```

---

## Cleanup Object in Detail

```javascript
const cleanup = Conditions.whenWatches([...configs]);

// How many watchers are active?
console.log(cleanup.count);  // e.g., 4

// Force re-evaluate all watchers
cleanup.update();

// Get individual cleanups for advanced control
const individual = cleanup.getCleanups();
individual[0].destroy();  // Destroy just the first watcher

// Destroy everything
cleanup.destroy();
console.log(cleanup.count);  // 0
```

---

## Best Practices

### 1. Choose the Right Method

```javascript
// ✅ All reactive → use whenWatches
Conditions.whenWatches([
  [() => a.value, condA, '.a'],
  [() => b.value, condB, '.b']
]);

// ✅ All static → use whenApplies
Conditions.whenApplies([
  ['dark', themeCond, 'body'],
  ['en', langCond, 'html']
]);

// ✅ Mix of both → use whenStates
Conditions.whenStates([
  [() => a.value, condA, '.a', { reactive: true }],
  ['static', condB, '.b', { reactive: false }]
]);

// ❌ Don't use whenStates with all same mode — use the specific method instead
```

### 2. Always Store and Destroy Cleanups

```javascript
// ✅ Store the cleanup for later
const cleanup = Conditions.whenWatches([...]);

// Later: clean up properly
cleanup.destroy();

// ❌ Don't lose the reference
Conditions.whenWatches([...]);  // No variable — can't cleanup, memory leak!
```

### 3. Organize Configs by Feature

```javascript
// ✅ Separate by concern, combine at the end
const userConfigs = [...];
const uiConfigs = [...];
const dataConfigs = [...];

const cleanup = Conditions.combineBatches(userConfigs, uiConfigs, dataConfigs);

// ❌ Don't mix unrelated configs in one big array
```

### 4. Use createBatchConfig for Repeatable Patterns

```javascript
// ✅ Create once, use many times
const setupPanel = Conditions.createBatchConfig(panelConfigs, 'watch');

const cleanup1 = setupPanel();  // Independent instance
const cleanup2 = setupPanel();  // Independent instance
```

### 5. Use Descriptive Variable Names

```javascript
// ✅ Clear purpose
const dashboardCleanup = Conditions.whenWatches([...]);
const formCleanup = Conditions.whenWatches([...]);

// ❌ Generic names
const c1 = Conditions.whenWatches([...]);
const c2 = Conditions.whenWatches([...]);
```

### 6. Generate Configs Programmatically When Possible

```javascript
// ✅ DRY — generate from data
const fields = ['email', 'password', 'name'];
const configs = fields.map(f => [() => form[f].value, validators[f], `#${f}`]);
const cleanup = Conditions.whenWatches(configs);

// ❌ Repetitive — same pattern written three times manually
```

---

## Summary

| Method | Mode | Use Case |
|--------|------|----------|
| `whenWatches([...])` | All reactive | Live dashboards, reactive forms, auto-updating UI |
| `whenApplies([...])` | All static | Page initialization, one-time setup, server-rendered pages |
| `whenStates([...])` | Mixed | Some reactive + some static in the same batch |
| `createBatchConfig(configs, mode)` | Reusable | Component patterns, repeated setups |
| `combineBatches(...arrays)` | Merge | Modular organization by feature |

| Cleanup Method | What It Does |
|----------------|-------------|
| `cleanup.update()` | Re-evaluates all watchers (they stay active) |
| `cleanup.destroy()` | Stops all watchers permanently |
| `cleanup.count` | Number of active cleanups |
| `cleanup.getCleanups()` | Array of individual cleanup objects |

> **Simple Rule to Remember:** Use `whenWatches` when everything is reactive, `whenApplies` when everything is static, and `whenStates` when you need a mix. Always store the cleanup object and call `destroy()` when you're done. Organize related configs into separate arrays and merge them with `combineBatches` for clean, maintainable code.