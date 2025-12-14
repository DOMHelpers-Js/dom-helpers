# Understanding `watch()` (Builder) - A Beginner's Guide

## What is `watch()` (Builder)?

`watch()` is a builder method that adds watchers to your state before building it. It watches for changes to specific properties and runs callbacks.

Think of it as **watcher builder** - define watchers while building your state.

---

## Why Does This Exist?

### The Problem: Adding Watchers After Creation

Without builder, you add watchers separately:

```javascript
// ❌ Without builder - separate steps
const state = ReactiveUtils.state({ count: 0 });

state.$watch('count', (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`);
});

// ✅ With builder - all in one
const state = ReactiveUtils.builder() 
  .state({ count: 0 })
  .watch('count', (newVal, oldVal) => {
    console.log(`Count changed from ${oldVal} to ${newVal}`);
  })
  .build();
```

**Why this matters:**
- Define watchers upfront
- Clean builder pattern
- All setup in one place
- Better organization

---

## How Does It Work?

### The Builder Chain

```javascript
ReactiveUtils.builder() 
  .state({ name: 'John' })
  .watch('name', (newVal, oldVal) => {
    console.log(`Name: ${oldVal} → ${newVal}`);
  })
  .build();
```

---

## Basic Usage

### Watch Single Property

```javascript
const state = ReactiveUtils.builder() 
  .state({ count: 0 })
  .watch('count', (newVal, oldVal) => {
    console.log(`Count: ${oldVal} → ${newVal}`);
  })
  .build();

state.count = 5; // Logs: "Count: 0 → 5"
```

### Watch Multiple Properties

```javascript
const state = ReactiveUtils.builder() 
  .state({ x: 0, y: 0 })
  .watch('x', (newVal) => console.log('X changed:', newVal))
  .watch('y', (newVal) => console.log('Y changed:', newVal))
  .build();

state.x = 10; // Logs: "X changed: 10"
state.y = 20; // Logs: "Y changed: 20"
```

### Watch with Side Effects

```javascript
const state = ReactiveUtils.builder() 
  .state({ username: '' })
  .watch('username', async (newVal) => {
    if (newVal) {
      const available = await checkUsername(newVal);
      console.log('Username available:', available);
    }
  })
  .build();
```

---

## Simple Examples Explained

### Example 1: Auto-Save

```javascript
const document = ReactiveUtils.builder() 
  .state({
    title: '',
    content: '',
    lastSaved: null
  })
  .watch('title', () => autoSave())
  .watch('content', () => autoSave())
  .build();

let saveTimeout;
function autoSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    console.log('Saving:', document.title, document.content);
    document.lastSaved = new Date();
  }, 1000);
}

document.title = 'My Document';
document.content = 'Some content';
// Auto-saves after 1 second
```

---

### Example 2: Validation on Change

```javascript
const form = ReactiveUtils.builder() 
  .state({
    email: '',
    emailError: null
  })
  .watch('email', (newEmail) => {
    if (!newEmail) {
      form.emailError = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      form.emailError = 'Invalid email format';
    } else {
      form.emailError = null;
    }
  })
  .build();

form.email = 'invalid'; // Sets error
form.email = 'test@example.com'; // Clears error
```

---

### Example 3: Analytics Tracking

```javascript
const page = ReactiveUtils.builder() 
  .state({
    currentRoute: '/',
    scrollPosition: 0,
    timeOnPage: 0
  })
  .watch('currentRoute', (newRoute, oldRoute) => {
    trackEvent('page_view', {
      from: oldRoute,
      to: newRoute,
      timestamp: Date.now()
    });
  })
  .watch('scrollPosition', (position) => {
    if (position > 1000) {
      trackEvent('deep_scroll', { position });
    }
  })
  .build();

function trackEvent(name, data) {
  console.log('Event:', name, data);
}
```

---

## Real-World Example: Settings Manager

```javascript
const settings = ReactiveUtils.builder() 
  .state({
    theme: 'light',
    fontSize: 16,
    notifications: true,
    autoSave: true,
    language: 'en'
  })
  .watch('theme', (newTheme) => {
    document.body.className = `theme-${newTheme}`;
    localStorage.setItem('theme', newTheme);
  })
  .watch('fontSize', (size) => {
    document.documentElement.style.fontSize = `${size}px`;
    localStorage.setItem('fontSize', size);
  })
  .watch('notifications', (enabled) => {
    if (enabled) {
      requestNotificationPermission();
    }
    localStorage.setItem('notifications', enabled);
  })
  .watch('language', async (lang) => {
    await loadTranslations(lang);
    localStorage.setItem('language', lang);
  })
  .build();

// Change theme
settings.theme = 'dark'; // Updates UI and saves

// Change font size
settings.fontSize = 18; // Updates CSS and saves

async function loadTranslations(lang) {
  console.log('Loading translations for:', lang);
}

function requestNotificationPermission() {
  console.log('Requesting notification permission');
}
```

---

## Common Patterns

### Pattern 1: Simple Watch

```javascript
const state = ReactiveUtils.builder() 
  .state({ value: 0 })
  .watch('value', (newVal) => console.log(newVal))
  .build();
```

### Pattern 2: Watch with Old Value

```javascript
const state = ReactiveUtils.builder() 
  .state({ status: 'idle' })
  .watch('status', (newVal, oldVal) => {
    console.log(`Status: ${oldVal} → ${newVal}`);
  })
  .build();
```

### Pattern 3: Multiple Watchers

```javascript
const state = ReactiveUtils.builder() 
  .state({ a: 1, b: 2 })
  .watch('a', () => console.log('A changed'))
  .watch('b', () => console.log('B changed'))
  .build();
```

---

## Common Questions

### Q: Can I watch computed properties?

**Answer:** Yes!

```javascript
const state = ReactiveUtils.builder() 
  .state({ a: 1, b: 2 })
  .computed('sum', (s) => s.a + s.b)
  .watch('sum', (newSum) => console.log('Sum:', newSum))
  .build();
```

### Q: Can I have multiple watchers on same property?

**Answer:** Yes, they all run:

```javascript
.watch('count', () => console.log('Watcher 1'))
.watch('count', () => console.log('Watcher 2'))
```

### Q: When does watcher run?

**Answer:** After the property changes:

```javascript
state.count = 10; // Watcher runs immediately after
```

---

## Tips for Success

### 1. Use for Side Effects

```javascript
// ✅ Perfect for side effects
.watch('data', (newData) => {
  saveToServer(newData);
  updateUI();
})
```

### 2. Don't Modify State in Watcher

```javascript
// ❌ Can cause infinite loops
.watch('count', () => {
  state.count++; // Don't do this!
})

// ✅ Modify different property
.watch('input', (val) => {
  state.output = processInput(val); // OK
})
```

### 3. Use for Persistence

```javascript
// ✅ Save to localStorage
.watch('settings', (settings) => {
  localStorage.setItem('settings', JSON.stringify(settings));
})
```

---

## Summary

### What `watch()` Does:

1. ✅ Adds watcher to builder
2. ✅ Takes property name and callback
3. ✅ Callback receives new and old values
4. ✅ Returns builder for chaining
5. ✅ Runs on property change

### When to Use It:

- Side effects on changes
- Saving to localStorage
- API calls on changes
- Analytics tracking
- Validation

### The Basic Pattern:

```javascript
const state = ReactiveUtils.builder() 
  .state({ value: 0 })
  .watch('value', (newVal, oldVal) => {
    console.log(`Changed: ${oldVal} → ${newVal}`);
  })
  .build();

state.value = 10; // Watcher runs
```

---

**Remember:** `watch()` is for side effects when properties change. Use it in the builder to set up watchers upfront! 🎉
