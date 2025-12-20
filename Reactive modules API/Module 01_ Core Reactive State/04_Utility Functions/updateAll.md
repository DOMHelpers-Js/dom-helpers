# Understanding `updateAll()` - A Beginner's Guide

## What is `updateAll()`?

`updateAll()` is a **unified update function** in the Reactive library that updates both state properties and DOM elements in a single call. It automatically distinguishes between state keys and CSS selectors, allowing you to update everything at once.

Think of it as **one function for everything** - update state and DOM together without separate calls.

---

## Syntax

```js
// Using the shortcut
updateAll(state, updates)

// Using the full namespace
ReactiveUtils.updateAll(state, updates)
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`updateAll()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.updateAll()`) - Explicit and clear

**Parameters:**
- `state` (Object): The reactive state object
- `updates` (Object): Object with state keys and/or CSS selectors

**Returns:**
- The state object

---

## Basic Usage

### State and DOM Updates

```js
// Using the shortcut style
const app = state({
  count: 0,
  message: 'Hello'
});

updateAll(app, {
  // State updates (plain keys)
  count: 10,
  message: 'Updated',

  // DOM updates (CSS selectors)
  '#counter': 10,
  '#message': 'Updated',
  '.status': 'Active'
});

// Or using the namespace style
ReactiveUtils.updateAll(app, {
  count: 10,
  '#counter': 10
});
```

### How It Distinguishes

```js
updateAll(app, {
  // State properties (no special prefix)
  name: 'John',
  age: 25,

  // DOM selectors (start with #, ., or contain [ or >)
  '#userName': 'John',      // ID selector
  '.user-age': 25,          // Class selector
  '[data-role="user"]': 'John', // Attribute selector
  'div > span': 'John'      // Complex selector
});
```

### Nested State Updates

```js
const app = state({
  user: {
    name: '',
    email: ''
  }
});

updateAll(app, {
  // Nested state (dot notation)
  'user.name': 'John',
  'user.email': 'john@example.com',

  // DOM
  '#userName': 'John',
  '#userEmail': 'john@example.com'
});
```

---

## Common Use Cases

### Use Case 1: Form Sync

```js
const form = state({
  username: '',
  email: '',
  password: ''
});

function updateFormAndDisplay(data) {
  updateAll(form, {
    // Update state
    username: data.username,
    email: data.email,
    password: data.password,

    // Update display
    '#userDisplay': data.username,
    '#emailDisplay': data.email,
    '.form-status': 'Updated'
  });
}

updateFormAndDisplay({
  username: 'john',
  email: 'john@example.com',
  password: 'secret'
});
```

### Use Case 2: Dashboard Updates

```js
const dashboard = state({
  visitors: 0,
  revenue: 0,
  conversions: 0
});

function updateDashboard(data) {
  updateAll(dashboard, {
    // Update state
    visitors: data.visitors,
    revenue: data.revenue,
    conversions: data.conversions,

    // Update UI
    '#visitorsCount': data.visitors.toLocaleString(),
    '#revenueAmount': `$${data.revenue.toFixed(2)}`,
    '#conversionsCount': data.conversions,
    '.last-updated': new Date().toLocaleTimeString()
  });
}

updateDashboard({
  visitors: 1500,
  revenue: 45000,
  conversions: 125
});
```

### Use Case 3: User Profile

```js
const profile = state({
  name: '',
  email: '',
  avatar: '',
  status: 'offline'
});

function loadProfile(userData) {
  updateAll(profile, {
    // State
    name: userData.name,
    email: userData.email,
    avatar: userData.avatar,
    status: userData.status,

    // DOM
    '#profileName': userData.name,
    '#profileEmail': userData.email,
    '#profileAvatar': { src: userData.avatar },
    '.status-indicator': {
      className: `status ${userData.status}`,
      textContent: userData.status
    }
  });
}
```

### Use Case 4: Game State

```js
const game = state({
  score: 0,
  level: 1,
  health: 100,
  lives: 3
});

function updateGameState(updates) {
  updateAll(game, {
    // State
    score: updates.score,
    level: updates.level,
    health: updates.health,
    lives: updates.lives,

    // UI
    '#score': updates.score.toLocaleString(),
    '#level': `Level ${updates.level}`,
    '#healthBar': { style: { width: `${updates.health}%` } },
    '#livesCount': updates.lives
  });
}
```

### Use Case 5: Settings Panel

```js
const settings = state({
  theme: 'light',
  fontSize: 14,
  language: 'en'
});

function applySettings(newSettings) {
  updateAll(settings, {
    // State
    theme: newSettings.theme,
    fontSize: newSettings.fontSize,
    language: newSettings.language,

    // DOM
    'body': { className: newSettings.theme },
    '#fontSize': `${newSettings.fontSize}px`,
    '[data-lang]': newSettings.language
  });
}
```

---

## Advanced Patterns

### Pattern 1: Conditional Updates

```js
function smartUpdate(state, updates, updateDOM = true) {
  const stateUpdates = {};
  const domUpdates = {};

  Object.entries(updates).forEach(([key, value]) => {
    if (key.startsWith('#') || key.startsWith('.')) {
      if (updateDOM) domUpdates[key] = value;
    } else {
      stateUpdates[key] = value;
    }
  });

  updateAll(state, { ...stateUpdates, ...domUpdates });
}
```

### Pattern 2: Transformation Pipeline

```js
function updateWithTransform(state, data, transformer) {
  const transformed = transformer(data);

  updateAll(state, {
    ...transformed.state,
    ...transformed.dom
  });
}

updateWithTransform(app, apiData, (data) => ({
  state: {
    count: data.count,
    total: data.total
  },
  dom: {
    '#count': data.count.toLocaleString(),
    '#total': `$${data.total.toFixed(2)}`
  }
}));
```

### Pattern 3: Validation Before Update

```js
function validatedUpdateAll(state, updates, validator) {
  const errors = validator(updates);

  if (errors.length > 0) {
    console.error('Validation errors:', errors);
    return state;
  }

  return updateAll(state, updates);
}

validatedUpdateAll(app, {
  count: -1,
  '#count': -1
}, (updates) => {
  const errors = [];
  if (updates.count < 0) errors.push('Count must be positive');
  return errors;
});
```

---

## Performance Tips

### Tip 1: Batch Related Updates

```js
// GOOD - one updateAll call
updateAll(state, {
  count: 10,
  total: 100,
  '#count': 10,
  '#total': 100
});

// BAD - multiple calls
state.count = 10;
state.total = 100;
// Then update DOM separately
```

### Tip 2: Use for Complex Updates

```js
// GOOD - use updateAll for complex scenarios
updateAll(state, {
  'user.name': 'John',
  'user.email': 'john@example.com',
  '#userName': 'John',
  '.user-info': 'Updated'
});

// Simple updates - use direct assignment
state.count = 10;
```

---

## Common Pitfalls

### Pitfall 1: Wrong Selector Format

```js
// WRONG - no selector prefix
updateAll(state, {
  userName: 'John' // Treated as state property!
});

// RIGHT - use CSS selector
updateAll(state, {
  '#userName': 'John' // DOM element
});
```

### Pitfall 2: Mixing Concerns

```js
// BAD - unclear intent
updateAll(state, {
  count: 10,
  '#count': 10,
  total: 100,
  name: 'John',
  '#name': 'John'
});

// GOOD - group logically
updateAll(state, {
  // State updates
  count: 10,
  total: 100,
  name: 'John',

  // DOM updates
  '#count': 10,
  '#name': 'John'
});
```

### Pitfall 3: Forgetting State Parameter

```js
// WRONG - no state parameter
updateAll({
  count: 10,
  '#count': 10
});

// RIGHT - provide state
updateAll(myState, {
  count: 10,
  '#count': 10
});
```

---

## Summary

**`updateAll()` updates state and DOM in one unified call.**

Key takeaways:
- ✅ **Unified updates** for state and DOM
- ✅ Both **shortcut** (`updateAll()`) and **namespace** (`ReactiveUtils.updateAll()`) styles are valid
- ✅ Auto-detects **state keys** vs **CSS selectors**
- ✅ Supports **nested state** with dot notation
- ✅ Returns the **state object**
- ✅ Great for **form sync**, **dashboards**, **complex updates**
- ⚠️ Use **CSS selectors** for DOM (#, ., [, >)
- ⚠️ Use **plain keys** for state
- ⚠️ Must provide **state object** as first parameter

**Remember:** Use `updateAll()` when you need to update both state and DOM together in a single, clean operation! 🎉

➡️ Next, explore [`state()`](state.md) for reactive state or [`bindings()`](bindings.md) for declarative DOM binding!
