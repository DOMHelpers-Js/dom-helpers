[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Usage Examples and Best Practices

## Quick Start (30 seconds)

```javascript
// Theme toggle — one short call
const theme = state('light');

whenState(() => theme.value, {
  'dark':  { style: { backgroundColor: '#1a1a1a', color: '#fff' } },
  'light': { style: { backgroundColor: '#fff', color: '#000' } }
}, 'body');
```

---

## Real-World Examples

### Example 1: Status Dashboard

Multiple elements updated from different state values — shortcuts keep it clean:

```javascript
const apiStatus = state('idle');
const userRole = state('viewer');
const networkStatus = state('online');

// Status badge
whenState(() => apiStatus.value, {
  'idle':    { textContent: 'Ready', style: { color: 'gray' } },
  'loading': { textContent: 'Loading...', style: { color: 'blue' } },
  'success': { textContent: 'Done', style: { color: 'green' } },
  'error':   { textContent: 'Error', style: { color: 'red' } }
}, '#apiStatus');

// Role badge
whenState(() => userRole.value, {
  'admin':  { textContent: 'Admin', classList: { add: 'badge-admin' } },
  'editor': { textContent: 'Editor', classList: { add: 'badge-editor' } },
  'viewer': { textContent: 'Viewer', classList: { add: 'badge-viewer' } }
}, '#roleBadge');

// Network indicator
whenState(() => networkStatus.value, {
  'online':  { textContent: 'Online', style: { color: 'green' } },
  'offline': { textContent: 'Offline', style: { color: 'red' } }
}, '#networkBadge');
```

### Example 2: Form Validation with whenApply()

One-time validation result — no reactivity needed:

```javascript
const isValid = validateForm();

whenApply(isValid, {
  'true': {
    classList: { add: 'form-valid', remove: 'form-invalid' },
    style: { borderColor: 'green' }
  },
  'false': {
    classList: { add: 'form-invalid', remove: 'form-valid' },
    style: { borderColor: 'red' }
  }
}, '#submitForm');
```

### Example 3: Explicit Reactive Watch

```javascript
const cartCount = state(0);

whenWatch(() => cartCount.value, {
  '0':     { textContent: 'Cart Empty', style: { display: 'none' } },
  '1-5':   { textContent: 'Few Items', style: { display: 'block', color: 'blue' } },
  '>5':    { textContent: 'Many Items', style: { display: 'block', color: 'green' } }
}, '#cartBadge');
```

### Example 4: Batch Initial Setup

Set up multiple elements at once on page load:

```javascript
whenBatch(() => {
  whenApply(getTheme(), {
    'dark':  { style: { backgroundColor: '#1a1a1a', color: '#fff' } },
    'light': { style: { backgroundColor: '#fff', color: '#000' } }
  }, 'body');

  whenApply(getUserPlan(), {
    'premium': { textContent: 'PRO', style: { color: 'gold' } },
    'free':    { textContent: 'FREE', style: { color: 'gray' } }
  }, '#planBadge');

  whenApply(getLocale(), {
    'en': { setAttribute: { lang: 'en', dir: 'ltr' } },
    'ar': { setAttribute: { lang: 'ar', dir: 'rtl' } }
  }, 'html');
});
```

### Example 5: Temperature Display with Ranges

```javascript
const temp = state(22);

whenState(() => temp.value, {
  '<0':     { textContent: 'Freezing', style: { color: 'blue' } },
  '0-10':   { textContent: 'Cold', style: { color: 'lightblue' } },
  '11-25':  { textContent: 'Comfortable', style: { color: 'green' } },
  '>25':    { textContent: 'Hot', style: { color: 'red' } }
}, '#tempDisplay');
```

### Example 6: Using with Default Branch

If the Default Branch Extension is loaded, `'default'` works through the shortcut:

```javascript
const paymentStatus = state('pending');

whenState(() => paymentStatus.value, {
  'completed':  { textContent: 'Paid', style: { color: 'green' } },
  'failed':     { textContent: 'Failed', style: { color: 'red' } },
  'default':    { textContent: 'Processing...', style: { color: 'gray' } }
}, '#paymentBadge');

// 'pending', 'queued', 'retrying' → all show "Processing..."
```

---

## Fallback Namespace Usage

If conflicts are detected, all shortcuts are available under `CondShortcuts`:

```javascript
// When another library already uses 'whenState' globally
CondShortcuts.whenState(() => theme.value, {
  'dark':  { style: { backgroundColor: '#1a1a1a' } },
  'light': { style: { backgroundColor: '#fff' } }
}, 'body');

CondShortcuts.whenApply('active', conditions, '.btn');
CondShortcuts.whenWatch(() => count.value, conditions, '#counter');

CondShortcuts.whenBatch(() => {
  CondShortcuts.whenApply('dark', themeConditions, 'body');
  CondShortcuts.whenApply('compact', layoutConditions, '.content');
});
```

---

## Using Conditions.shortcuts Directly

Regardless of mode, `Conditions.shortcuts` always holds all four methods:

```javascript
// Works in both global mode and namespace mode
Conditions.shortcuts.whenState(() => mode.value, conditions, '.items');
Conditions.shortcuts.whenApply('active', conditions, '#btn');
```

---

## Diagnostic Helpers

### Check Current Configuration

```javascript
// See what mode is active
console.log(Conditions.extensions.shortcuts);
// { version: '1.0.0', mode: 'global', conflicts: null }
```

### Print Full Diagnostics (Development Only)

```javascript
Conditions.printShortcuts();
// [Conditions.Shortcuts] Configuration
//   Version: 1.0.0
//   Mode: global
//   Conflicts: None
//   Available methods: ['whenState', 'whenWatch', 'whenApply', 'whenBatch']
//   Reactivity: Available
```

### Remove Shortcuts

```javascript
// Clean up global shortcuts
Conditions.removeShortcuts();

// Verify removal
typeof whenState;  // 'undefined'
```

---

## Best Practices

### 1. Use Shortcuts for Readability When You Have Many Conditions Calls

```javascript
// ✅ Shortcuts shine with multiple calls
whenState(() => theme.value, themeConditions, 'body');
whenState(() => status.value, statusConditions, '#badge');
whenState(() => layout.value, layoutConditions, '.items');
whenApply('admin', roleConditions, '#profile');
```

### 2. Choose the Right Shortcut for the Job

```javascript
// ✅ whenState — auto-detects reactivity
whenState(() => reactiveValue.value, conditions, selector);

// ✅ whenWatch — explicit reactivity (always reactive)
whenWatch(() => reactiveValue.value, conditions, selector);

// ✅ whenApply — one-time, no reactivity
whenApply(staticValue, conditions, selector);
```

### 3. Use whenBatch to Group Related One-Time Setups

```javascript
// ✅ Clear grouping of initial setup
whenBatch(() => {
  whenApply(getTheme(), themeConditions, 'body');
  whenApply(getUserPlan(), planConditions, '#badge');
  whenApply(getLanguage(), langConditions, 'html');
});
```

### 4. Check for Conflicts Before Relying on Globals

```javascript
// ✅ Check the mode if you're unsure
if (Conditions.extensions.shortcuts.mode === 'global') {
  // Safe to use whenState(), whenApply(), etc.
} else {
  // Use CondShortcuts.whenState() instead
}
```

### 5. Use Conditions.shortcuts for Library Code

If you're writing reusable code or a library, prefer the always-available path:

```javascript
// ✅ Safe in any context — no dependency on global/namespace mode
Conditions.shortcuts.whenState(() => value.value, conditions, selector);
```

---

## Shortcut vs Full Namespace — Quick Reference

```javascript
// These pairs are identical:

whenState(fn, cond, sel)        ===  Conditions.whenState(fn, cond, sel)
whenWatch(fn, cond, sel)        ===  Conditions.watch(fn, cond, sel)
whenApply(val, cond, sel)       ===  Conditions.apply(val, cond, sel)
whenBatch(fn)                   ===  Conditions.batch(fn)
```

---

## Summary

| Shortcut | Maps To | Mode |
|----------|---------|------|
| `whenState()` | `Conditions.whenState()` | Auto-reactive |
| `whenWatch()` | `Conditions.watch()` | Explicitly reactive |
| `whenApply()` | `Conditions.apply()` | Static / one-time |
| `whenBatch()` | `Conditions.batch()` | Batch grouping |

| Feature | Detail |
|---------|--------|
| **Global mode** | Shortcuts on `window` directly |
| **Namespace mode** | Shortcuts on `CondShortcuts` (if conflicts) |
| **Always available** | `Conditions.shortcuts.whenState()` |
| **Cleanup** | `Conditions.removeShortcuts()` |
| **Diagnostics** | `Conditions.printShortcuts()` (dev only) |
| **Version check** | `Conditions.extensions.shortcuts` |

> **Simple Rule to Remember:** The shortcuts are just shorter names for the same methods. `whenState(...)` is `Conditions.whenState(...)`. `whenApply(...)` is `Conditions.apply(...)`. If another library already uses those names, the module automatically puts them under `CondShortcuts` instead — nothing breaks, you just use a slightly longer path.