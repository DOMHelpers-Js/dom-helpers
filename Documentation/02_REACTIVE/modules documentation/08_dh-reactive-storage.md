# AutoSave - Reactive Storage Integration

Automatic persistence for reactive objects. Save your app state to localStorage/sessionStorage without thinking about it.

## 📦 Installation

Load the scripts in this order:

```html
<script src="01_dh-reactive.js"></script>
<script src="07_dh-reactiveUtils-shortcut.js"></script>
<script src="08_dh-reactive-storage.js"></script>
```

## 🎯 Core Concepts

This module provides **two powerful concepts**:

1. **`autoSave()`** - Add automatic save/load to any reactive object
2. **`reactiveStorage()`** - Storage that triggers reactive effects

---

## 📖 API Reference

### `autoSave(reactiveObj, key, options)`

Add automatic storage persistence to any reactive object.

**Parameters:**
- `reactiveObj` (Object) - Any reactive object (state, ref, collection, form, etc.)
- `key` (String) - Storage key to save under
- `options` (Object) - Configuration options

**Returns:** The same object (enhanced with storage methods)

**Example:**
```javascript
const counter = autoSave(ref(0), 'counter');
counter.value++; // Automatically saves to localStorage
```

---

## ⚙️ Options

```javascript
autoSave(obj, key, {
  // Storage settings
  storage: 'localStorage',      // 'localStorage' or 'sessionStorage'
  namespace: '',                 // Optional namespace (e.g., 'myapp')
  debounce: 0,                   // Milliseconds to wait before saving
  expires: null,                 // Expiration time in seconds
  
  // Behavior
  autoLoad: true,                // Auto-load from storage on creation
  autoSave: true,                // Auto-save on changes
  sync: false,                   // Enable cross-tab synchronization
  
  // Callbacks
  onSave: (data) => data,        // Transform before saving
  onLoad: (data) => data,        // Transform after loading
  onSync: (data) => {},          // Called when synced from another tab
  onError: (error, context) => {}// Error handler
})
```

### Option Details

#### `storage` (String)
- **Default:** `'localStorage'`
- **Values:** `'localStorage'` | `'sessionStorage'`
- **Description:** Type of storage to use

```javascript
// Persists forever
autoSave(state({ theme: 'light' }), 'prefs', {
  storage: 'localStorage'
});

// Clears when browser closes
autoSave(state({ temp: [] }), 'session', {
  storage: 'sessionStorage'
});
```

#### `namespace` (String)
- **Default:** `''`
- **Description:** Prefix for storage keys (helps organize)

```javascript
// Saves as "myapp:preferences"
autoSave(state({ theme: 'light' }), 'preferences', {
  namespace: 'myapp'
});

// Multiple namespaces for different app versions
autoSave(state({ ... }), 'user', { namespace: 'myapp-v1' });
autoSave(state({ ... }), 'settings', { namespace: 'myapp-v1' });
```

#### `debounce` (Number)
- **Default:** `0`
- **Description:** Milliseconds to wait after last change before saving
- **Use:** Prevents excessive saves during rapid changes (e.g., typing)

```javascript
// Good for text input - saves 1 second after user stops typing
autoSave(state({ text: '' }), 'document', {
  debounce: 1000
});

// Good for settings - saves 500ms after adjustment
autoSave(state({ volume: 50 }), 'settings', {
  debounce: 500
});
```

#### `expires` (Number)
- **Default:** `null` (no expiration)
- **Description:** Expire saved data after N seconds
- **Use:** Temporary caches, session data

```javascript
// Expire after 1 hour (3600 seconds)
autoSave(state({ token: 'abc' }), 'auth', {
  expires: 3600
});
```

#### `autoLoad` (Boolean)
- **Default:** `true`
- **Description:** Automatically load from storage on creation

```javascript
// Loads saved value automatically (default)
const prefs = autoSave(state({ theme: 'light' }), 'prefs');
console.log(prefs.theme); // Value from storage if exists

// Don't load automatically
const prefs = autoSave(state({ theme: 'light' }), 'prefs', {
  autoLoad: false
});
prefs.$load(); // Load manually when ready
```

#### `autoSave` (Boolean)
- **Default:** `true`
- **Description:** Automatically save on changes

```javascript
// Auto-save enabled (default)
const state = autoSave(state({ count: 0 }), 'counter');
state.count++; // Saves automatically

// Manual save only
const state = autoSave(state({ count: 0 }), 'counter', {
  autoSave: false
});
state.count++;
state.$save(); // Must save manually
```

#### `sync` (Boolean)
- **Default:** `false`
- **Description:** Enable cross-tab synchronization
- **Use:** Settings, shared state that should update across browser tabs

```javascript
const settings = autoSave(
  state({ theme: 'light' }),
  'settings',
  {
    sync: true,
    onSync: (newSettings) => {
      console.log('Settings updated from another tab!');
    }
  }
);

// Change in Tab 1 → automatically updates Tab 2, 3, etc.
```

#### `onSave` (Function)
- **Signature:** `(data) => transformedData`
- **Description:** Transform/filter data before saving
- **Use:** Remove sensitive data, add metadata

```javascript
autoSave(
  form({ username: '', password: '' }),
  'form',
  {
    onSave: (data) => {
      // Don't save password!
      const { password, ...safe } = data.values;
      
      // Add timestamp
      return {
        ...data,
        values: safe,
        savedAt: Date.now()
      };
    }
  }
);
```

#### `onLoad` (Function)
- **Signature:** `(data) => transformedData`
- **Description:** Transform data after loading
- **Use:** Parse dates, restore complex objects

```javascript
autoSave(
  state({ date: new Date() }),
  'state',
  {
    onSave: (data) => ({
      date: data.date.toISOString()
    }),
    onLoad: (data) => ({
      date: new Date(data.date)
    })
  }
);
```

#### `onSync` (Function)
- **Signature:** `(newData) => void`
- **Description:** Called when data syncs from another tab
- **Requires:** `sync: true`

```javascript
autoSave(state({ count: 0 }), 'counter', {
  sync: true,
  onSync: (newData) => {
    console.log('Counter updated from another tab:', newData.count);
    showNotification('Data synchronized');
  }
});
```

#### `onError` (Function)
- **Signature:** `(error, context) => void`
- **Description:** Error handler
- **Context:** `'save'` | `'load'` | `'sync'`

```javascript
autoSave(state({ data: [] }), 'state', {
  onError: (error, context) => {
    console.error(`Error during ${context}:`, error);
    
    if (context === 'save') {
      showToast('Failed to save data');
    }
  }
});
```

---

## 🔧 Methods

Objects enhanced with `autoSave()` get these methods:

### `$save()`
Force save to storage immediately (ignores debounce).

```javascript
const state = autoSave(state({ count: 0 }), 'counter', {
  debounce: 5000
});

state.count++;
state.$save(); // Save immediately, don't wait 5 seconds
```

### `$load()`
Reload data from storage.

```javascript
const state = autoSave(state({ count: 0 }), 'counter');

// Manually reload from storage
state.$load();
console.log(state.count); // Fresh from storage
```

### `$clear()`
Remove data from storage.

```javascript
const form = autoSave(form({ name: '' }), 'draft');

// After successful submission
form.$clear(); // Remove draft from storage
```

### `$exists()`
Check if data exists in storage.

```javascript
const state = autoSave(state({ data: [] }), 'state');

if (state.$exists()) {
  console.log('Data found in storage');
} else {
  console.log('No saved data');
}
```

### `$stopAutoSave()`
Pause automatic saving.

```javascript
const state = autoSave(state({ items: [] }), 'state');

state.$stopAutoSave(); // Pause auto-save

// Make bulk changes without saving
state.items.push(...manyItems);

state.$startAutoSave(); // Resume auto-save
state.$save(); // Save manually
```

### `$startAutoSave()`
Resume automatic saving.

```javascript
const state = autoSave(state({ count: 0 }), 'counter', {
  autoSave: false
});

// Later, enable auto-save
state.$startAutoSave();
```

### `$destroy()`
Complete cleanup (removes all listeners).

```javascript
const state = autoSave(state({ data: [] }), 'state');

// When done with the object
state.$destroy();
```

---

## 📝 Examples

### Example 1: Simple Counter
```javascript
const counter = autoSave(ref(0), 'counter');

counter.value++; // Auto-saves to localStorage
console.log(counter.value); // 1

// Reload page
const counter = autoSave(ref(0), 'counter');
console.log(counter.value); // 1 (restored from storage!)
```

### Example 2: User Preferences
```javascript
const prefs = autoSave(
  state({
    theme: 'light',
    fontSize: 14,
    notifications: true
  }),
  'preferences',
  {
    debounce: 500,
    namespace: 'myapp'
  }
);

// Bind to UI
document.getElementById('theme-toggle').onclick = () => {
  prefs.theme = prefs.theme === 'light' ? 'dark' : 'light';
  // Auto-saves after 500ms
};

// Apply preferences
effect(() => {
  document.body.className = prefs.theme;
  document.documentElement.style.fontSize = `${prefs.fontSize}px`;
});
```

### Example 3: Todo List
```javascript
const todos = autoSave(
  collection([]),
  'todos',
  {
    debounce: 300,
    namespace: 'myapp'
  }
);

// Add computed property
todos.$computed('completed', function() {
  return this.items.filter(t => t.done).length;
});

// Use it
todos.add({ id: 1, text: 'Buy milk', done: false });
todos.toggle(t => t.id === 1, 'done');

console.log(todos.completed); // 1
// All operations auto-save!
```

### Example 4: Form Draft (Gmail Style)
```javascript
const emailDraft = autoSave(
  form({
    to: '',
    subject: '',
    body: ''
  }),
  'email-draft',
  {
    debounce: 500,
    namespace: 'drafts',
    
    onSave: () => {
      document.getElementById('draft-badge').textContent = 'Draft saved';
    }
  }
);

// Bind to form
emailDraft.bindToInputs('input, textarea');

// After sending email
async function sendEmail() {
  await fetch('/api/send', {
    method: 'POST',
    body: JSON.stringify(emailDraft.values)
  });
  
  emailDraft.$clear(); // Remove draft after sending
}
```

### Example 5: Shopping Cart
```javascript
const cart = autoSave(
  Collections.createWithComputed(
    [],
    {
      total() {
        return this.items.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0
        );
      },
      itemCount() {
        return this.items.reduce((sum, item) => 
          sum + item.quantity, 0
        );
      }
    }
  ),
  'shopping-cart',
  {
    debounce: 300,
    namespace: 'shop'
  }
);

cart.add({ id: 1, name: 'Widget', price: 9.99, quantity: 2 });
cart.add({ id: 2, name: 'Gadget', price: 19.99, quantity: 1 });

console.log(cart.total);      // 39.97
console.log(cart.itemCount);  // 3

// Cart persists across page reloads!
```

### Example 6: Game Auto-Save
```javascript
const game = autoSave(
  state({
    level: 1,
    score: 0,
    lives: 3,
    position: { x: 0, y: 0 },
    inventory: []
  }),
  'game-save',
  {
    debounce: 2000, // Save every 2 seconds
    namespace: 'mygame',
    
    onSave: (state) => {
      state.timestamp = Date.now();
      showSaveIcon();
      return state;
    }
  }
);

// Game loop
function gameLoop() {
  game.position.x += 1;
  game.score += 10;
  
  // Auto-saves every 2 seconds
}

// Manual save button
document.getElementById('save-btn').onclick = () => {
  game.$save();
  showToast('Game saved!');
};
```

### Example 7: Cross-Tab Synced Settings
```javascript
const settings = autoSave(
  state({
    volume: 50,
    quality: 'high',
    autoplay: false
  }),
  'app-settings',
  {
    sync: true,
    throttle: 200,
    
    onSync: (newSettings) => {
      console.log('Settings updated from another tab');
      showNotification('Settings synchronized');
      applySettings(newSettings);
    }
  }
);

function applySettings(s) {
  setVolume(s.volume);
  setQuality(s.quality);
  setAutoplay(s.autoplay);
}

// Change in Tab 1 → automatically updates all tabs!
settings.volume = 75;
```

### Example 8: Multi-Step Wizard
```javascript
const wizard = autoSave(
  form({
    step: 1,
    personal: { name: '', email: '', phone: '' },
    address: { street: '', city: '', zip: '' },
    payment: { method: '' }
  }),
  'wizard-progress',
  {
    debounce: 500,
    namespace: 'forms',
    
    // Don't save sensitive payment info
    onSave: (formData) => {
      const { values } = formData;
      const { payment, ...safe } = values;
      return { ...formData, values: safe };
    }
  }
);

// Progress auto-saves as user fills form
wizard.setValue('step', 2);
wizard.setValue('personal.name', 'John Doe');

// User closes browser → progress is saved
// User returns → progress is restored!
```

### Example 9: Session Storage (Temporary)
```javascript
const sessionState = autoSave(
  state({
    filters: [],
    sortBy: 'date',
    viewMode: 'grid'
  }),
  'session-state',
  {
    storage: 'sessionStorage', // Clears when browser closes
    debounce: 300
  }
);

// Persists only during browser session
```

### Example 10: Filter Sensitive Data
```javascript
const userForm = autoSave(
  form({
    username: '',
    password: '',
    email: '',
    rememberMe: false
  }),
  'user-form',
  {
    debounce: 500,
    
    onSave: (formData) => {
      // Never save password to storage!
      const { values } = formData;
      const { password, ...safeValues } = values;
      
      return {
        ...formData,
        values: safeValues
      };
    },
    
    onLoad: (savedData) => {
      // Ensure password field exists (but empty)
      return {
        ...savedData,
        values: {
          ...savedData.values,
          password: ''
        }
      };
    }
  }
);
```

---

## 🌐 reactiveStorage(type, namespace)

Create a storage object that triggers reactive effects when values change.

**Parameters:**
- `type` (String) - `'localStorage'` or `'sessionStorage'`
- `namespace` (String) - Optional namespace

**Returns:** Reactive storage object

**Example:**
```javascript
const storage = reactiveStorage('localStorage', 'myapp');

// Effect automatically re-runs when storage changes
effect(() => {
  const theme = storage.get('theme');
  document.body.className = theme || 'light';
});

// This triggers the effect
storage.set('theme', 'dark');
```

### Use Cases

#### 1. Theme Switcher
```javascript
const storage = reactiveStorage('localStorage');

effect(() => {
  const theme = storage.get('theme');
  document.body.className = theme || 'light';
});

document.getElementById('theme-toggle').onclick = () => {
  const current = storage.get('theme') || 'light';
  storage.set('theme', current === 'light' ? 'dark' : 'light');
};
```

#### 2. Watch Multiple Keys
```javascript
const storage = reactiveStorage('localStorage', 'settings');

effect(() => {
  const theme = storage.get('theme');
  const fontSize = storage.get('fontSize');
  const lang = storage.get('language');
  
  // Apply all settings
  document.body.className = theme;
  document.documentElement.style.fontSize = `${fontSize}px`;
  document.documentElement.lang = lang;
});

// Any change triggers the effect
```

#### 3. Cross-Tab Notifications
```javascript
const storage = reactiveStorage('localStorage', 'notifications');

// Runs in ALL tabs when storage changes
effect(() => {
  const notifications = storage.get('new-notifications');
  
  if (notifications && notifications.length > 0) {
    notifications.forEach(n => showNotification(n));
    storage.set('new-notifications', []);
  }
});

// In another tab:
storage.set('new-notifications', [
  { message: 'New message from John' }
]);
// Effect runs in all tabs!
```

---

## 👁️ watch(key, callback, options)

Simple convenience for watching a single storage key.

**Parameters:**
- `key` (String) - Storage key to watch
- `callback` (Function) - `(newValue, oldValue) => void`
- `options` (Object) - Watch options

**Options:**
- `storage` (String) - `'localStorage'` or `'sessionStorage'`
- `namespace` (String) - Optional namespace
- `immediate` (Boolean) - Run callback immediately with current value

**Returns:** Cleanup function

**Example:**
```javascript
const cleanup = watch('theme', (newTheme, oldTheme) => {
  console.log(`Theme changed: ${oldTheme} → ${newTheme}`);
  document.body.className = newTheme;
}, { immediate: true });

// Later: cleanup();
```

### Examples

#### Watch User Login
```javascript
watch('user-id', (userId) => {
  if (userId) {
    loadUserData(userId);
    showDashboard();
  } else {
    showLoginScreen();
  }
}, { immediate: true });
```

#### Watch Cart Changes
```javascript
watch('cart-items', (items, oldItems) => {
  updateCartBadge(items.length);
  
  if (items.length > oldItems.length) {
    showNotification('Item added to cart');
  }
}, { namespace: 'shop' });
```

---

## 🎨 Best Practices

### ✅ DO

```javascript
// Use reasonable debounce for user input
autoSave(state({ text: '' }), 'doc', {
  debounce: 1000 // 1 second is good
});

// Use namespace for organization
autoSave(state({ ... }), 'key', {
  namespace: 'myapp-v1'
});

// Clear after successful submission
const form = autoSave(form({ ... }), 'draft');
async function submit() {
  await sendToServer(form.values);
  form.$clear(); // Remove draft
}

// Use sessionStorage for temporary data
autoSave(state({ temp: [] }), 'session', {
  storage: 'sessionStorage'
});

// Filter sensitive data
autoSave(form({ password: '' }), 'form', {
  onSave: (data) => {
    const { password, ...safe } = data.values;
    return { ...data, values: safe };
  }
});
```

### ❌ DON'T

```javascript
// DON'T: No debounce for user input (too many saves!)
autoSave(state({ text: '' }), 'doc', {
  debounce: 0
});

// DON'T: Save passwords without filtering
autoSave(form({ password: '' }), 'form');

// DON'T: Use tiny debounce (defeats the purpose)
autoSave(state({ text: '' }), 'doc', {
  debounce: 10
});
```

---

## 🔗 Access Points

The API is available through multiple namespaces:

```javascript
// Direct (if shortcut module loaded)
autoSave(obj, key, options)
reactiveStorage(type, namespace)
watchStorage(key, callback, options)

// Via ReactiveStorage
ReactiveStorage.autoSave(obj, key, options)
ReactiveStorage.reactiveStorage(type, namespace)
ReactiveStorage.watch(key, callback, options)

// Via ReactiveUtils
ReactiveUtils.autoSave(obj, key, options)
ReactiveUtils.reactiveStorage(type, namespace)
ReactiveUtils.watchStorage(key, callback, options)

// Via Storage
Storage.autoSave(obj, key, options)
Storage.reactive(type, namespace)
Storage.watch(key, callback, options)
```

---

## 🐛 Debugging

### Check if Data Exists
```javascript
const state = autoSave(state({ count: 0 }), 'counter');

if (state.$exists()) {
  console.log('Data found in storage');
}
```

### View Saved Data
```javascript
// Check localStorage directly
console.log(localStorage.getItem('counter'));

// With namespace
console.log(localStorage.getItem('myapp:counter'));
```

### Debug Callbacks
```javascript
autoSave(state({ count: 0 }), 'counter', {
  onSave: (data) => {
    console.log('Saving:', data);
    return data;
  },
  onLoad: (data) => {
    console.log('Loading:', data);
    return data;
  },
  onError: (error, context) => {
    console.error(`Error during ${context}:`, error);
  }
});
```

### Force Save for Testing
```javascript
const state = autoSave(state({ count: 0 }), 'counter', {
  debounce: 5000
});

state.count++;
state.$save(); // Save immediately for testing
```

---

## ❓ FAQ

### Q: Does it load from storage automatically?
**A:** Yes! By default (`autoLoad: true`), it loads saved data on creation.

### Q: What happens if storage is full?
**A:** The `onError` callback is called. You can handle it gracefully.

### Q: Can I use sessionStorage instead of localStorage?
**A:** Yes! Set `storage: 'sessionStorage'` in options.

### Q: Does it work across browser tabs?
**A:** Yes, with `sync: true` option. Changes in one tab sync to all tabs.

### Q: How do I stop auto-saving?
**A:** Call `$stopAutoSave()` or set `autoSave: false` in options.

### Q: Can I filter what gets saved?
**A:** Yes! Use `onSave` callback to transform/filter data before saving.

### Q: What if I need to save complex objects like Maps or Sets?
**A:** Use `onSave` and `onLoad` to serialize/deserialize custom objects.

### Q: Does it work with all reactive APIs?
**A:** Yes! Works with `state`, `ref`, `refs`, `collection`, `form`, `store`, `component`, anything reactive!

### Q: How do I know when it saves?
**A:** Use `onSave` callback to get notified when data is saved.

### Q: Can I use multiple namespaces?
**A:** Yes! Great for organizing different parts of your app or different versions.

---

## 📊 Summary

| Feature | Description |
|---------|-------------|
| `autoSave()` | Add auto-save to any reactive object |
| `reactiveStorage()` | Storage that triggers effects |
| `watch()` | Simple storage watcher |
| Auto-load | ✅ Loads from storage automatically |
| Auto-save | ✅ Saves on changes (with debounce) |
| Cross-tab sync | ✅ Optional sync across browser tabs |
| sessionStorage | ✅ Supports both local and session storage |
| Namespaces | ✅ Organize storage keys |
| Expiration | ✅ Auto-expire old data |
| Callbacks | ✅ Transform data before save/after load |

---

## 🚀 Quick Start

```javascript
// 1. Load scripts
<script src="01_dh-reactive.js"></script>
<script src="07_dh-reactiveUtils-shortcut.js"></script>
<script src="dh-storage.js"></script>
<script src="09_dh-reactive-storage-simple.js"></script>

// 2. Create reactive object with auto-save
const todos = autoSave(collection([]), 'todos', {
  debounce: 300
});

// 3. Use it normally - it just saves!
todos.add({ text: 'Buy milk', done: false });

// 4. Reload page - data is automatically restored! 🎉
```

That's it! Your app now has automatic persistence. 💾✨