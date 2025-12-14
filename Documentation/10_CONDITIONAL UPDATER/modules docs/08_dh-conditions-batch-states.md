# Conditions Batch States Module - Available Methods

This module provides **batch methods** for handling multiple conditional updates simultaneously. Instead of calling `Conditions.whenState()` multiple times, you can declare all your conditional watchers in a single batch operation with automatic performance optimization.

---

## 🎯 **What This Module Does**

```javascript
// ❌ Without Batch States:
const cleanup1 = Conditions.whenState(state.count, countConditions, '.counter');
const cleanup2 = Conditions.whenState(state.isActive, activeConditions, '.btn');
const cleanup3 = Conditions.whenState(state.theme, themeConditions, 'body');
const cleanup4 = Conditions.whenState(state.user, userConditions, '.profile');

// Later: cleanup each individually
cleanup1.destroy();
cleanup2.destroy();
cleanup3.destroy();
cleanup4.destroy();

// ✅ With Batch States:
const cleanup = Conditions.whenStates([
  [state.count, countConditions, '.counter'],
  [state.isActive, activeConditions, '.btn'],
  [state.theme, themeConditions, 'body'],
  [state.user, userConditions, '.profile']
]);

// Later: cleanup all at once
cleanup.destroy();
```

**Key Feature:** Batch multiple conditional watchers into a single operation with unified cleanup, automatic performance optimization, and cleaner code organization.

---

## 📋 **Core API Methods**

### 1. **`Conditions.whenStates(stateConfigs)`** (Mixed Mode)

The primary batch method. Supports both reactive and non-reactive modes in the same batch.

```javascript
// Basic usage - mixed reactive modes
const cleanup = Conditions.whenStates([
  [state.count, countConditions, '.counter', { reactive: true }],
  ['active', activeConditions, '.btn', { reactive: false }],
  [() => state.user.name, nameConditions, '.username', { reactive: true }]
]);

// Each config: [valueFn, conditions, selector, options?]
// Options: { reactive: boolean }
```

**Parameters:**
- `stateConfigs` (Array): Array of configuration arrays
  - Each config: `[valueFn, conditions, selector, options?]`
  - `valueFn`: State value or function returning value
  - `conditions`: Condition mappings object
  - `selector`: Target elements (string, Element, NodeList, Array)
  - `options`: Optional `{ reactive: boolean }`

**Returns:** Combined cleanup object with:
- `update()` - Manually update all watchers
- `destroy()` - Cleanup all watchers
- `count` - Number of active cleanups
- `getCleanups()` - Get all cleanup objects

**Use Case:** When you need different reactive modes in same batch

---

### 2. **`Conditions.whenWatches(stateConfigs)`** (All Reactive)

Force reactive mode for all configurations. Automatically adds `{ reactive: true }` to every config.

```javascript
// All configurations use reactive mode
const cleanup = Conditions.whenWatches([
  [state.count, countConditions, '.counter'],
  [state.isActive, activeConditions, '.btn'],
  [() => state.user.name, nameConditions, '.username']
]);

// Equivalent to:
// Conditions.whenStates([
//   [state.count, countConditions, '.counter', { reactive: true }],
//   [state.isActive, activeConditions, '.btn', { reactive: true }],
//   [() => state.user.name, nameConditions, '.username', { reactive: true }]
// ]);
```

**Parameters:**
- `stateConfigs` (Array): Array of `[valueFn, conditions, selector]` configs
  - Note: No options parameter needed - reactive mode forced

**Returns:** Combined cleanup object (same as `whenStates`)

**Use Case:** When all watchers should be reactive (most common scenario)

---

### 3. **`Conditions.whenApplies(stateConfigs)`** (All Static)

Force non-reactive mode for all configurations. Executes once without setting up watchers.

```javascript
// All configurations execute once (no reactivity)
const cleanup = Conditions.whenApplies([
  ['active', activeConditions, '.btn'],
  [42, numberConditions, '.count'],
  ['theme-dark', themeConditions, 'body']
]);

// Each condition applies once immediately
// No reactive updates - static application only
```

**Parameters:**
- `stateConfigs` (Array): Array of `[value, conditions, selector]` configs
  - Use direct values, not functions (since it's non-reactive)

**Returns:** Combined cleanup object with:
- `update()` - Re-execute all applies
- `destroy()` - No-op (nothing to cleanup in static mode)
- `count` - Number of configs

**Use Case:** Initial page setup, one-time conditional styling, static configurations

---

### 4. **`Conditions.createBatchConfig(configs, mode)`**

Create a reusable batch configuration function. Useful for repeated patterns.

```javascript
// Define a reusable dashboard setup
const setupDashboard = Conditions.createBatchConfig([
  [state.userCount, userConditions, '.user-count'],
  [state.revenue, revenueConditions, '.revenue'],
  [state.activeUsers, activeConditions, '.active-users']
], 'watch'); // Mode: 'state' | 'watch' | 'apply'

// Execute multiple times
const cleanup1 = setupDashboard();
const cleanup2 = setupDashboard(); // Same config, new instance

// Each execution is independent
cleanup1.destroy();
cleanup2.destroy();
```

**Parameters:**
- `configs` (Array): Configuration array
- `mode` (string): Execution mode
  - `'state'` - Use `whenStates()` (default)
  - `'watch'` - Use `whenWatches()` (all reactive)
  - `'apply'` - Use `whenApplies()` (all static)

**Returns:** Function that executes the batch config

**Use Case:** Reusable patterns, component initialization, dynamic page sections

---

### 5. **`Conditions.combineBatches(...configArrays)`**

Combine multiple separate configuration arrays into a single batch.

```javascript
// Define separate concerns
const userConfigs = [
  [state.userName, nameConditions, '.username'],
  [state.userAvatar, avatarConditions, '.avatar']
];

const themeConfigs = [
  [state.theme, themeConditions, 'body'],
  [state.colorScheme, colorConditions, '.color-scheme']
];

const layoutConfigs = [
  [state.sidebarOpen, sidebarConditions, '.sidebar'],
  [state.layout, layoutConditions, '.main-content']
];

// Combine into single batch
const cleanup = Conditions.combineBatches(
  userConfigs,
  themeConfigs,
  layoutConfigs
);

// All watchers managed together
cleanup.destroy();
```

**Parameters:**
- `...configArrays` (Array[]): Multiple configuration arrays to combine

**Returns:** Combined cleanup object

**Use Case:** Organizing configs by feature, modular setup, separation of concerns

---

## 💡 **Usage Examples**

### Example 1: Basic Dashboard Setup
```javascript
const state = {
  userCount: reactive(150),
  activeNow: reactive(42),
  revenue: reactive(12450),
  status: reactive('operational')
};

const cleanup = Conditions.whenWatches([
  // User count display
  [
    () => state.userCount.value,
    {
      '>100': { 
        textContent: 'High traffic',
        style: { color: 'green' }
      },
      '50-100': { 
        textContent: 'Moderate',
        style: { color: 'orange' }
      },
      '<50': { 
        textContent: 'Low traffic',
        style: { color: 'red' }
      }
    },
    '.traffic-status'
  ],
  
  // Revenue display
  [
    () => state.revenue.value,
    {
      '>10000': {
        textContent: '🎉 Excellent!',
        classList: { add: 'success' }
      },
      '5000-10000': {
        textContent: '✓ Good',
        classList: { add: 'good' }
      },
      default: {
        textContent: 'Growing...',
        classList: { add: 'neutral' }
      }
    },
    '.revenue-status'
  ],
  
  // System status
  [
    () => state.status.value,
    {
      'operational': {
        textContent: '● Online',
        style: { color: '#2ecc71' }
      },
      'degraded': {
        textContent: '◐ Degraded',
        style: { color: '#f39c12' }
      },
      'down': {
        textContent: '✖ Offline',
        style: { color: '#e74c3c' }
      }
    },
    '.system-status'
  ]
]);

// Later: cleanup all watchers
cleanup.destroy();
```

---

### Example 2: Form Validation States
```javascript
const form = {
  email: reactive(''),
  password: reactive(''),
  confirm: reactive(''),
  agreed: reactive(false)
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const cleanup = Conditions.whenWatches([
  // Email validation
  [
    () => form.email.value,
    {
      'empty': {
        classList: { add: 'pristine', remove: 'valid invalid' },
        setAttribute: { 'aria-invalid': null }
      },
      'truthy': {
        classList: {
          add: () => isValidEmail(form.email.value) ? 'valid' : 'invalid',
          remove: () => isValidEmail(form.email.value) ? 'invalid' : 'valid'
        }
      }
    },
    '#email'
  ],
  
  // Password strength
  [
    () => form.password.value,
    {
      'empty': {
        textContent: '',
        style: { display: 'none' }
      },
      '>=8': {
        textContent: 'Strong password ✓',
        style: { color: 'green', display: 'block' }
      },
      '4-7': {
        textContent: 'Weak password ⚠',
        style: { color: 'orange', display: 'block' }
      },
      default: {
        textContent: 'Too short ✗',
        style: { color: 'red', display: 'block' }
      }
    },
    '.password-strength'
  ],
  
  // Confirm password match
  [
    () => form.confirm.value === form.password.value && form.confirm.value !== '',
    {
      'true': {
        classList: { add: 'valid', remove: 'invalid' },
        textContent: '✓ Passwords match'
      },
      'false': {
        classList: { add: 'invalid', remove: 'valid' },
        textContent: form.confirm.value ? '✗ Passwords don\'t match' : ''
      }
    },
    '.confirm-status'
  ],
  
  // Submit button state
  [
    () => isValidEmail(form.email.value) && 
         form.password.value.length >= 8 && 
         form.confirm.value === form.password.value && 
         form.agreed.value,
    {
      'true': {
        disabled: false,
        classList: { add: 'enabled', remove: 'disabled' }
      },
      'false': {
        disabled: true,
        classList: { add: 'disabled', remove: 'enabled' }
      }
    },
    '#submit-btn'
  ]
]);
```

---

### Example 3: Theme Switcher with Preferences
```javascript
const preferences = {
  theme: reactive('light'),
  fontSize: reactive('medium'),
  highContrast: reactive(false),
  animations: reactive(true)
};

const cleanup = Conditions.whenWatches([
  // Theme
  [
    () => preferences.theme.value,
    {
      'light': {
        setAttribute: { 'data-theme': 'light' },
        style: {
          '--bg-color': '#ffffff',
          '--text-color': '#333333'
        }
      },
      'dark': {
        setAttribute: { 'data-theme': 'dark' },
        style: {
          '--bg-color': '#1a1a1a',
          '--text-color': '#e0e0e0'
        }
      },
      'auto': {
        setAttribute: { 'data-theme': 'auto' }
      }
    },
    'body'
  ],
  
  // Font size
  [
    () => preferences.fontSize.value,
    {
      'small': { style: { fontSize: '14px' } },
      'medium': { style: { fontSize: '16px' } },
      'large': { style: { fontSize: '18px' } },
      'xlarge': { style: { fontSize: '20px' } }
    },
    'body'
  ],
  
  // High contrast
  [
    () => preferences.highContrast.value,
    {
      'true': {
        classList: { add: 'high-contrast' },
        style: { '--border-width': '2px' }
      },
      'false': {
        classList: { remove: 'high-contrast' },
        style: { '--border-width': '1px' }
      }
    },
    'body'
  ],
  
  // Animations
  [
    () => preferences.animations.value,
    {
      'true': {
        classList: { remove: 'no-animations' }
      },
      'false': {
        classList: { add: 'no-animations' },
        style: { '--transition-duration': '0s' }
      }
    },
    'body'
  ]
]);
```

---

### Example 4: Multi-Step Form Progress
```javascript
const formState = {
  currentStep: reactive(1),
  stepsCompleted: reactive([false, false, false, false])
};

const cleanup = Conditions.whenWatches([
  // Step indicators
  [
    () => formState.currentStep.value,
    {
      '1': {
        classList: {
          add: ['step-1-active', 'step-2-pending', 'step-3-pending', 'step-4-pending']
        },
        dataset: {
          currentStep: ['1', '2', '3', '4']
        }
      },
      '2': {
        classList: {
          add: ['step-1-complete', 'step-2-active', 'step-3-pending', 'step-4-pending']
        }
      },
      '3': {
        classList: {
          add: ['step-1-complete', 'step-2-complete', 'step-3-active', 'step-4-pending']
        }
      },
      '4': {
        classList: {
          add: ['step-1-complete', 'step-2-complete', 'step-3-complete', 'step-4-active']
        }
      }
    },
    '.step-indicator'
  ],
  
  // Progress bar
  [
    () => formState.currentStep.value,
    {
      '1': { style: { width: '0%' } },
      '2': { style: { width: '33%' } },
      '3': { style: { width: '66%' } },
      '4': { style: { width: '100%' } }
    },
    '.progress-bar-fill'
  ],
  
  // Back button visibility
  [
    () => formState.currentStep.value,
    {
      '1': { 
        disabled: true,
        style: { display: 'none' }
      },
      default: { 
        disabled: false,
        style: { display: 'inline-block' }
      }
    },
    '#back-btn'
  ],
  
  // Next/Submit button
  [
    () => formState.currentStep.value,
    {
      '4': {
        textContent: 'Submit',
        classList: { add: 'submit-btn' }
      },
      default: {
        textContent: 'Next',
        classList: { remove: 'submit-btn' }
      }
    },
    '#next-btn'
  ]
]);
```

---

### Example 5: Shopping Cart Summary
```javascript
const cart = {
  items: reactive([]),
  discount: reactive(0),
  shippingMethod: reactive('standard')
};

const cleanup = Conditions.whenWatches([
  // Item count
  [
    () => cart.items.value.length,
    {
      '0': {
        textContent: 'Cart is empty',
        style: { color: '#999' }
      },
      '1': {
        textContent: '1 item',
        style: { color: '#333' }
      },
      default: {
        textContent: () => `${cart.items.value.length} items`,
        style: { color: '#333' }
      }
    },
    '.cart-count'
  ],
  
  // Subtotal
  [
    () => cart.items.value.reduce((sum, item) => sum + item.price, 0),
    {
      '>0': {
        textContent: () => `$${cart.items.value.reduce((sum, item) => sum + item.price, 0).toFixed(2)}`
      },
      default: {
        textContent: '$0.00'
      }
    },
    '.subtotal'
  ],
  
  // Discount badge
  [
    () => cart.discount.value,
    {
      '0': {
        style: { display: 'none' }
      },
      '>0': {
        textContent: () => `-$${cart.discount.value.toFixed(2)}`,
        style: { display: 'inline-block', color: '#2ecc71' }
      }
    },
    '.discount-amount'
  ],
  
  // Shipping cost
  [
    () => cart.shippingMethod.value,
    {
      'standard': {
        textContent: '$5.99',
        dataset: { cost: '5.99' }
      },
      'express': {
        textContent: '$12.99',
        dataset: { cost: '12.99' }
      },
      'overnight': {
        textContent: '$24.99',
        dataset: { cost: '24.99' }
      },
      'free': {
        textContent: 'FREE',
        style: { color: '#2ecc71' },
        dataset: { cost: '0' }
      }
    },
    '.shipping-cost'
  ],
  
  // Checkout button
  [
    () => cart.items.value.length,
    {
      '0': {
        disabled: true,
        textContent: 'Cart is empty',
        classList: { add: 'disabled' }
      },
      '>0': {
        disabled: false,
        textContent: 'Proceed to Checkout',
        classList: { remove: 'disabled' }
      }
    },
    '#checkout-btn'
  ]
]);
```

---

### Example 6: Reusable Component Setup
```javascript
// Define reusable configurations
const setupUserCard = Conditions.createBatchConfig([
  [
    () => user.status.value,
    {
      'online': { 
        classList: { add: 'status-online' },
        textContent: 'Online'
      },
      'away': { 
        classList: { add: 'status-away' },
        textContent: 'Away'
      },
      'offline': { 
        classList: { add: 'status-offline' },
        textContent: 'Offline'
      }
    },
    '.user-status'
  ],
  [
    () => user.verified.value,
    {
      'true': {
        style: { display: 'inline' },
        textContent: '✓'
      },
      'false': {
        style: { display: 'none' }
      }
    },
    '.verified-badge'
  ]
], 'watch');

// Use for multiple users
const user1Cleanup = setupUserCard();
const user2Cleanup = setupUserCard();

// Later: cleanup individually
user1Cleanup.destroy();
user2Cleanup.destroy();
```

---

### Example 7: Game State Management
```javascript
const game = {
  health: reactive(100),
  score: reactive(0),
  level: reactive(1),
  isPaused: reactive(false),
  isGameOver: reactive(false)
};

const cleanup = Conditions.whenWatches([
  // Health bar
  [
    () => game.health.value,
    {
      '75-100': {
        style: {
          width: () => `${game.health.value}%`,
          backgroundColor: '#2ecc71'
        }
      },
      '25-74': {
        style: {
          width: () => `${game.health.value}%`,
          backgroundColor: '#f39c12'
        }
      },
      '1-24': {
        style: {
          width: () => `${game.health.value}%`,
          backgroundColor: '#e74c3c',
          animation: 'pulse 0.5s infinite'
        }
      },
      '0': {
        style: {
          width: '0%',
          backgroundColor: '#c0392b'
        }
      }
    },
    '.health-bar'
  ],
  
  // Score display
  [
    () => game.score.value,
    {
      default: {
        textContent: () => game.score.value.toLocaleString(),
        style: {
          fontSize: game.score.value > 1000 ? '24px' : '18px',
          color: game.score.value > 500 ? '#f39c12' : '#333'
        }
      }
    },
    '.score'
  ],
  
  // Level badge
  [
    () => game.level.value,
    {
      default: {
        textContent: () => `Level ${game.level.value}`,
        classList: {
          add: () => game.level.value >= 5 ? 'high-level' : 'normal-level'
        }
      }
    },
    '.level-badge'
  ],
  
  // Pause overlay
  [
    () => game.isPaused.value,
    {
      'true': {
        style: { display: 'flex' }
      },
      'false': {
        style: { display: 'none' }
      }
    },
    '.pause-overlay'
  ],
  
  // Game over screen
  [
    () => game.isGameOver.value,
    {
      'true': {
        style: { display: 'flex' },
        textContent: () => `Game Over! Final Score: ${game.score.value}`
      },
      'false': {
        style: { display: 'none' }
      }
    },
    '.game-over-screen'
  ]
]);
```

---

### Example 8: Static Initial Setup (whenApplies)
```javascript
// One-time page initialization
const cleanup = Conditions.whenApplies([
  // Set initial theme based on time
  [
    new Date().getHours() < 18 ? 'light' : 'dark',
    {
      'light': {
        setAttribute: { 'data-theme': 'light' }
      },
      'dark': {
        setAttribute: { 'data-theme': 'dark' }
      }
    },
    'body'
  ],
  
  // Set language
  [
    navigator.language.startsWith('fr') ? 'french' : 'english',
    {
      'french': {
        setAttribute: { 'lang': 'fr' }
      },
      'english': {
        setAttribute: { 'lang': 'en' }
      }
    },
    'html'
  ],
  
  // Set viewport class based on screen size
  [
    window.innerWidth < 768 ? 'mobile' : 'desktop',
    {
      'mobile': {
        classList: { add: 'is-mobile' }
      },
      'desktop': {
        classList: { add: 'is-desktop' }
      }
    },
    'body'
  ]
]);

// No reactive updates - just initial setup
```

---

### Example 9: Combined Batches (Modular Organization)
```javascript
// User-related states
const userStates = [
  [state.userName, nameConditions, '.username'],
  [state.userRole, roleConditions, '.user-role'],
  [state.isLoggedIn, loginConditions, '.login-status']
];

// UI-related states
const uiStates = [
  [state.sidebarOpen, sidebarConditions, '.sidebar'],
  [state.modalOpen, modalConditions, '.modal'],
  [state.theme, themeConditions, 'body']
];

// Data-related states
const dataStates = [
  [state.isLoading, loadingConditions, '.loading-spinner'],
  [state.hasError, errorConditions, '.error-message'],
  [state.data, dataConditions, '.data-container']
];

// Combine all states
const cleanup = Conditions.combineBatches(
  userStates,
  uiStates,
  dataStates
);

// All managed together
cleanup.destroy();
```

---

### Example 10: Complex Dashboard with All Features
```javascript
const dashboard = {
  metrics: reactive({
    users: 1250,
    revenue: 45600,
    growth: 12.5
  }),
  alerts: reactive([]),
  isLoading: reactive(false)
};

const cleanup = Conditions.whenStates([
  // User metric (reactive)
  [
    () => dashboard.metrics.value.users,
    {
      '>1000': {
        textContent: () => `${dashboard.metrics.value.users.toLocaleString()} users`,
        classList: { add: 'metric-high' },
        style: { color: '#2ecc71' }
      },
      '500-1000': {
        textContent: () => `${dashboard.metrics.value.users.toLocaleString()} users`,
        classList: { add: 'metric-medium' },
        style: { color: '#f39c12' }
      },
      default: {
        textContent: () => `${dashboard.metrics.value.users.toLocaleString()} users`,
        classList: { add: 'metric-low' },
        style: { color: '#e74c3c' }
      }
    },
    '.user-count',
    { reactive: true }
  ],
  
  // Revenue metric (reactive)
  [
    () => dashboard.metrics.value.revenue,
    {
      '>50000': {
        textContent: () => `$${(dashboard.metrics.value.revenue / 1000).toFixed(1)}k`,
        style: { 
          fontSize: '32px',
          color: '#2ecc71',
          fontWeight: 'bold'
        }
      },
      default: {
        textContent: () => `$${(dashboard.metrics.value.revenue / 1000).toFixed(1)}k`,
        style: { 
          fontSize: '24px',
          color: '#333'
        }
      }
    },
    '.revenue-amount',
    { reactive: true }
  ],
  
  // Growth indicator (reactive)
  [
    () => dashboard.metrics.value.growth,
    {
      '>10': {
        textContent: () => `↑ ${dashboard.metrics.value.growth}%`,
        style: { color: '#2ecc71' }
      },
      '0-10': {
        textContent: () => `→ ${dashboard.metrics.value.growth}%`,
        style: { color: '#f39c12' }
      },
      '<0': {
        textContent: () => `↓ ${Math.abs(dashboard.metrics.value.growth)}%`,
        style: { color: '#e74c3c' }
      }
    },
    '.growth-indicator',
    { reactive: true }
  ],
  
  // Alerts badge (reactive)
  [
    () => dashboard.alerts.value.length,
    {
      '0': {
        style: { display: 'none' }
      },
      '>0': {
        textContent: () => dashboard.alerts.value.length.toString(),
        style: { display: 'inline-block' },
        classList: {
          add: () => dashboard.alerts.value.length > 5 ? 'many-alerts' : 'few-alerts'
        }
      }
    },
    '.alerts-badge',
    { reactive: true }
  ],
  
  // Loading overlay (reactive)
  [
    () => dashboard.isLoading.value,
    {
      'true': {
        style: { display: 'flex' }
      },
      'false': {
        style: { display: 'none' }
      }
    },
    '.loading-overlay',
    { reactive: true }
  ]
]);

// Update metrics (triggers all reactive watchers)
dashboard.metrics.value = {
  users: 1350,
  revenue: 52000,
  growth: 14.2
};

// Later: cleanup
cleanup.destroy();
```

---

## 🔧 **Advanced Features**

### Feature 1: Cleanup Management
```javascript
const cleanup = Conditions.whenStates([...configs]);

// Get count of active watchers
console.log(cleanup.count); // e.g., 5

// Manually trigger update
cleanup.update(); // Re-executes all watchers

// Get individual cleanups (advanced)
const cleanups = cleanup.getCleanups();
console.log(cleanups); // Array of cleanup objects

// Destroy all
cleanup.destroy();
console.log(cleanup.count); // 0 (all destroyed)
```

---

### Feature 2: Error Handling
```javascript
const cleanup = Conditions.whenStates([
  // Valid config
  [state.count, countConditions, '.counter'],
  
  // Invalid config (missing selector) - will be skipped
  [state.name, nameConditions],
  
  // Valid config
  [state.active, activeConditions, '.btn']
]);

// Console output:
// [Conditions.BatchStates] Config at index 1: selector is required
// [Conditions.BatchStates] ✓ Initialized 2 state watchers

console.log(cleanup.count); // 2 (invalid config skipped)
```

---

### Feature 3: Mixed Reactive/Static in Same Batch
```javascript
const cleanup = Conditions.whenStates([
  // Reactive: Auto-updates when state changes
  [state.count, countConditions, '.counter', { reactive: true }],
  
  // Static: Applied once, no watching
  ['active', activeConditions, '.btn', { reactive: false }],
  
  // Reactive with function
  [() => state.user.name, nameConditions, '.username', { reactive: true }],
  
  // Static with direct value
  [42, numberConditions, '.magic-number', { reactive: false }]
]);

// Reactive configs update automatically
state.count.value = 10; // Updates .counter

// Static configs don't update
// Would need manual cleanup.update() to re-apply
```

---

### Feature 4: Dynamic Config Generation
```javascript
// Generate configs programmatically
const fields = ['email', 'password', 'username'];
const validators = {
  email: emailConditions,
  password: passwordConditions,
  username: usernameConditions
};

const configs = fields.map(field => [
  () => form[field].value,
  validators[field],
  `.${field}-field`
]);

const cleanup = Conditions.whenWatches(configs);

// All fields now have reactive validation
```

---

### Feature 5: Conditional Batch Execution
```javascript
// Only setup watchers if feature enabled
const cleanup = featureFlags.dashboardMetrics 
  ? Conditions.whenWatches([...metricConfigs])
  : null;

// Later: safe cleanup
cleanup?.destroy();
```

---

### Feature 6: Nested Batch Configurations
```javascript
// Create modular batches
const setupUsers = Conditions.createBatchConfig(userConfigs, 'watch');
const setupTheme = Conditions.createBatchConfig(themeConfigs, 'watch');
const setupLayout = Conditions.createBatchConfig(layoutConfigs, 'watch');

// Execute all
const cleanups = [
  setupUsers(),
  setupTheme(),
  setupLayout()
];

// Cleanup all
cleanups.forEach(c => c.destroy());
```

---

## 🎯 **Cleanup Object API**

Every batch method returns a cleanup object with these methods:

```javascript
const cleanup = Conditions.whenStates([...]);

// Properties
cleanup.count           // Number of active cleanups (number)
cleanup.getCleanups()   // Get all cleanup objects (Array)

// Methods
cleanup.update()        // Manually update all watchers
cleanup.destroy()       // Cleanup all watchers

// Usage examples
console.log(`Active watchers: ${cleanup.count}`);

// Force update all
cleanup.update();

// Get individual cleanups for advanced control
const individual = cleanup.getCleanups();
individual[0].destroy(); // Destroy just the first one

// Destroy all at once
cleanup.destroy();
```

---

## 📊 **Mode Comparison**

| Method | Mode | When to Use | Reactive | Example |
|--------|------|-------------|----------|---------|
| `whenStates()` | Mixed | Different needs per config | Optional per config | Form with some static, some reactive fields |
| `whenWatches()` | All Reactive | Everything updates automatically | Yes, all | Dashboard with live metrics |
| `whenApplies()` | All Static | One-time setup, no updates | No, none | Initial page setup |
| `createBatchConfig()` | Reusable | Repeated patterns | Depends on mode param | Component initialization |
| `combineBatches()` | Mixed | Organize by feature | Per individual config | Modular app setup |

---

## ⚙️ **Integration with Other Modules**

### With Shortcuts (File 05)
```javascript
// If shortcuts loaded, batch methods available globally
const cleanup = whenStates([...configs]);
// Or: Conditions.whenStates([...configs])

const cleanup2 = whenWatches([...configs]);
// Or: Conditions.whenWatches([...configs])

const cleanup3 = whenApplies([...configs]);
// Or: Conditions.whenApplies([...configs])
```

---

### With Array Support (File 07)
```javascript
// Arrays work in batch configs
const cleanup = Conditions.whenWatches([
  [
    () => state.items.value,
    {
      'visible': {
        textContent: ['Item 1', 'Item 2', 'Item 3'],
        style: {
          color: ['red', 'blue', 'green']
        }
      }
    },
    '.items'
  ]
]);

// Each .items element gets its array value
```

---

### With DOM Helpers
```javascript
// Use DOM Helper shortcuts in selectors
const cleanup = Conditions.whenWatches([
  [state.count, countConditions, '.counter'],
  [state.active, activeConditions, ClassName.btn], // DOM Helper
  [state.theme, themeConditions, Elements.body]     // DOM Helper
]);
```

---

### With Reactive State
```javascript
// Reactive state automatically triggers updates
const state = {
  count: reactive(0),
  active: reactive(false)
};

const cleanup = Conditions.whenWatches([
  [() => state.count.value, countConditions, '.counter'],
  [() => state.active.value, activeConditions, '.btn']
]);

// Changes trigger updates
state.count.value = 10;   // Updates .counter
state.active.value = true; // Updates .btn

// Cleanup
cleanup.destroy();
```

---

## ⚠️ **Important Notes**

### 1. Config Validation
```javascript
// ✅ Valid config
[valueFn, conditions, selector, options?]

// ❌ Invalid: Missing selector
[valueFn, conditions]

// ❌ Invalid: Wrong types
['value', 'not an object', '.selector']

// ❌ Invalid: Null/undefined
[null, conditions, '.selector']

// Invalid configs are skipped with warnings
```

---

### 2. Cleanup Order
```javascript
const cleanup = Conditions.whenStates([...]);

// When destroy() called:
// 1. Each individual cleanup.destroy() runs
// 2. All event listeners removed
// 3. All reactive effects stopped
// 4. cleanup.count becomes 0

cleanup.destroy();
```

---

### 3. Performance Optimization
```javascript
// Batch execution uses Conditions.batch() internally
// This optimizes reactive effect execution

// Without batch:
Conditions.whenState(state.a, condA, '.a'); // Creates effect
Conditions.whenState(state.b, condB, '.b'); // Creates effect
Conditions.whenState(state.c, condC, '.c'); // Creates effect
// Multiple separate effects

// With batch:
Conditions.whenStates([
  [state.a, condA, '.a'],
  [state.b, condB, '.b'],
  [state.c, condC, '.c']
]);
// All created in single batch operation (more efficient)
```

---

### 4. Memory Management
```javascript
// Always cleanup when done
const cleanup = Conditions.whenWatches([...]);

// In component lifecycle
onUnmount(() => {
  cleanup.destroy();
});

// Or with timeout
const cleanup = Conditions.whenWatches([...]);
setTimeout(() => cleanup.destroy(), 5000);

// Forgetting cleanup can cause memory leaks
```

---

### 5. Update vs Destroy
```javascript
const cleanup = Conditions.whenStates([...]);

// update() - Re-evaluates without destroying
cleanup.update(); // All watchers re-execute
// Watchers still active

// destroy() - Stops all watchers permanently
cleanup.destroy();
cleanup.update(); // ❌ Won't work, already destroyed
```

---

## 🐛 **Debugging**

### Check Active Watchers
```javascript
const cleanup = Conditions.whenStates([...configs]);

console.log(`Active watchers: ${cleanup.count}`);

// Get details
const cleanups = cleanup.getCleanups();
console.log('Individual cleanups:', cleanups);
```

---

### Validate Config
```javascript
// Manually check config before batch
function isValidConfig(config) {
  return Array.isArray(config) && 
         config.length >= 3 &&
         config[0] !== null &&
         config[0] !== undefined &&
         (typeof config[1] === 'object' || typeof config[1] === 'function') &&
         config[2];
}

const myConfigs = [
  [state.count, countConditions, '.counter'],
  [null, badConditions, '.bad'], // Invalid
  [state.name, nameConditions, '.name']
];

const valid = myConfigs.filter(isValidConfig);
console.log(`Valid configs: ${valid.length}/${myConfigs.length}`);

const cleanup = Conditions.whenStates(valid);
```

---

### Error Handling
```javascript
try {
  const cleanup = Conditions.whenStates([...configs]);
  
  // Store cleanup for later
  window.myCleanup = cleanup;
} catch (error) {
  console.error('Batch setup failed:', error);
}
```

---

## 📚 **Best Practices**

### 1. Organize by Feature
```javascript
// ✅ Good: Separate by concern
const userConfigs = [...];
const uiConfigs = [...];
const dataConfigs = [...];

const cleanup = Conditions.combineBatches(
  userConfigs,
  uiConfigs,
  dataConfigs
);

// ❌ Avoid: Everything mixed together
const cleanup = Conditions.whenStates([
  [state.userName, ...],
  [state.modalOpen, ...],
  [state.isLoading, ...],
  [state.userRole, ...],
  [state.theme, ...]
  // Hard to maintain
]);
```

---

### 2. Use Descriptive Variable Names
```javascript
// ✅ Good: Clear purpose
const dashboardCleanup = Conditions.whenWatches([...]);
const formValidationCleanup = Conditions.whenWatches([...]);
const themeCleanup = Conditions.whenWatches([...]);

// ❌ Avoid: Generic names
const cleanup1 = Conditions.whenWatches([...]);
const cleanup2 = Conditions.whenWatches([...]);
const c = Conditions.whenWatches([...]);
```

---

### 3. Always Cleanup
```javascript
// ✅ Good: Cleanup in lifecycle
function initDashboard() {
  const cleanup = Conditions.whenWatches([...]);
  
  return cleanup; // Return for later cleanup
}

const dashboardCleanup = initDashboard();

// Later:
onUnmount(() => {
  dashboardCleanup.destroy();
});

// ❌ Avoid: No cleanup
Conditions.whenWatches([...]); // Lost reference, can't cleanup
```

---

### 4. Choose Right Mode
```javascript
// ✅ Good: Use whenWatches for reactive needs
const cleanup = Conditions.whenWatches([
  [state.count, countConditions, '.counter'],
  [state.active, activeConditions, '.btn']
]);

// ✅ Good: Use whenApplies for static setup
const cleanup = Conditions.whenApplies([
  ['dark', themeConditions, 'body'],
  ['en', langConditions, 'html']
]);

// ❌ Avoid: whenStates with all same mode
const cleanup = Conditions.whenStates([
  [state.a, condA, '.a', { reactive: true }],
  [state.b, condB, '.b', { reactive: true }],
  [state.c, condC, '.c', { reactive: true }]
]);
// Use whenWatches instead
```

---

### 5. Reuse Common Patterns
```javascript
// ✅ Good: Create reusable configs
const createValidationBatch = (fields) => {
  return fields.map(field => [
    () => form[field].value,
    validationConditions[field],
    `#${field}`
  ]);
};

const emailFields = createValidationBatch(['email', 'confirmEmail']);
const passwordFields = createValidationBatch(['password', 'confirmPassword']);

const cleanup = Conditions.combineBatches(
  emailFields,
  passwordFields
);

// ❌ Avoid: Duplicate code
const cleanup = Conditions.whenWatches([
  [() => form.email.value, emailValidation, '#email'],
  [() => form.confirmEmail.value, emailValidation, '#confirmEmail'],
  [() => form.password.value, passwordValidation, '#password'],
  [() => form.confirmPassword.value, passwordValidation, '#confirmPassword']
  // Repetitive
]);
```

---

## 📦 **Module Information**

```javascript
// Check if loaded
console.log(Conditions.whenStates); // Function
console.log(Conditions.whenWatches); // Function
console.log(Conditions.whenApplies); // Function

// Check version
console.log(Conditions.extensions?.batchStates);
// {
//   version: '1.0.0',
//   methods: ['whenStates', 'whenWatches', 'whenApplies', 'createBatchConfig', 'combineBatches']
// }

// Available globally (if shortcuts loaded)
console.log(typeof whenStates === 'function');   // true
console.log(typeof whenWatches === 'function');  // true
console.log(typeof whenApplies === 'function');  // true
```

---

## 🎯 **Key Features**

1. ✅ **Unified cleanup** - Single destroy() for all watchers
2. ✅ **Performance optimized** - Auto-batched execution
3. ✅ **Mixed modes** - Combine reactive and static in same batch
4. ✅ **Error handling** - Invalid configs skipped with warnings
5. ✅ **Chainable** - All methods return cleanup objects
6. ✅ **Reusable configs** - Create templates with createBatchConfig()
7. ✅ **Modular** - Organize with combineBatches()
8. ✅ **Count tracking** - Know how many watchers active
9. ✅ **Manual updates** - Force re-evaluation with update()
10. ✅ **Integration ready** - Works with all Conditions features

---

## 🚀 **Getting Started**

```javascript
// 1. Load dependencies
// <script src="01_dh-conditional-rendering.js"></script>
// <script src="08_dh-conditions-batch-states.js"></script>

// 2. Define your state
const state = {
  count: reactive(0),
  active: reactive(false),
  theme: reactive('light')
};

// 3. Setup batch watchers
const cleanup = Conditions.whenWatches([
  [() => state.count.value, countConditions, '.counter'],
  [() => state.active.value, activeConditions, '.btn'],
  [() => state.theme.value, themeConditions, 'body']
]);

// 4. State changes trigger updates automatically
state.count.value = 10;   // Updates .counter
state.active.value = true; // Updates .btn
state.theme.value = 'dark'; // Updates body

// 5. Cleanup when done
cleanup.destroy();
```

---

Batch your conditional updates for cleaner code and better performance! 🎯✨