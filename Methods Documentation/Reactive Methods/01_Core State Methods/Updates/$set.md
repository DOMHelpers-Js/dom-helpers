# Understanding `$set()` - A Beginner's Guide

## What is `$set()`?

`$set()` is an **instance method on reactive state objects** that performs functional updates, where values can be functions that receive the current value and return a new value. It's perfect for updates that depend on the previous state value.

Think of it as **smart updates with transformations**:
1. Call `$set()` on your reactive state
2. Pass an object with values (regular or functions)
3. Functions receive the current value as input
4. Return the new value from the function
5. Perfect for increments, toggles, and computed updates!

It's like having a calculator built into your updates!

---

## Why Does This Exist?

### The Old Way (Without `$set()`)

You had to read the current value and update it manually:

```javascript
const state = ReactiveUtils.state({ count: 0, items: [] });

// Must read current value first
state.count = state.count + 1;

// Risk of stale values in async
setTimeout(() => {
  state.count = state.count + 1;  // Might use old value!
}, 1000);

// Verbose for transformations
state.items = [...state.items, newItem];
```

**Problems:**
- Must explicitly read current value
- Risk of stale closures in async code
- Verbose for simple transformations
- Not obvious that update depends on previous value
- No automatic batching

### The New Way (With `$set()`)

With `$set()`, use functions that receive current values:

```javascript
const state = ReactiveUtils.state({ count: 0, items: [] });

// Function receives current value
state.$set({
  count: (current) => current + 1
});

// Safe in async contexts
setTimeout(() => {
  state.$set({
    count: (current) => current + 1  // Always uses latest value
  });
}, 1000);

// Cleaner transformations
state.$set({
  items: (current) => [...current, newItem]
});
```

**Benefits:**
- Functions always get current value
- Safe in async contexts
- Cleaner, more declarative code
- Obvious that update depends on previous value
- Automatic batching
- Can mix regular values and functions

---

## How Does It Work?

`$set()` is a method available on all reactive state objects:

```javascript
const state = ReactiveUtils.state({ count: 0, name: '' });

// state.$set is available
state.$set({
  count: (current) => current + 1,  // Function
  name: 'John'                       // Regular value
});

// Internally:
// 1. Calls ReactiveUtils.setWithFunctions(this, updates)
// 2. For each property:
//    - If value is function: call it with current value
//    - If value is regular: use it directly
// 3. Updates all properties
// 4. Batches all changes
```

**Key concept:** Functions receive the current value and return the new value!

---

## Syntax

### Basic Syntax

```javascript
state.$set({
  // Regular value
  property1: newValue,
  
  // Functional update
  property2: (currentValue) => newValue,
  
  // Mix both
  property3: 'static',
  property4: (current) => current + 1
})
```

**Parameters:**
- `updates` (object) - Object with properties to update
  - Values can be regular values OR functions
  - Functions receive `(currentValue)` and return new value

**Returns:** The state object (for chaining)

---

## Simple Examples Explained

### Example 1: Counter Increment

```javascript
const counter = ReactiveUtils.state({ count: 0 });

// Regular way - must read first
counter.count = counter.count + 1;

// Functional way - cleaner
counter.$set({
  count: (current) => current + 1
});

console.log(counter.count);  // 1

// Multiple increments
counter.$set({
  count: (current) => current + 5
});

console.log(counter.count);  // 6
```

---

### Example 2: Toggle Boolean

```javascript
const settings = ReactiveUtils.state({
  darkMode: false,
  notifications: true,
  soundEnabled: false
});

// Toggle dark mode
settings.$set({
  darkMode: (current) => !current
});

console.log(settings.darkMode);  // true

// Toggle multiple settings
settings.$set({
  notifications: (current) => !current,
  soundEnabled: (current) => !current
});

console.log(settings);
// { darkMode: true, notifications: false, soundEnabled: true }
```

---

### Example 3: Array Operations

```javascript
const list = ReactiveUtils.state({
  items: [1, 2, 3],
  history: []
});

// Add item
list.$set({
  items: (current) => [...current, 4]
});

console.log(list.items);  // [1, 2, 3, 4]

// Remove item
list.$set({
  items: (current) => current.filter(x => x !== 2)
});

console.log(list.items);  // [1, 3, 4]

// Update multiple arrays
list.$set({
  items: (current) => [...current, 5],
  history: (current) => [...current, 'added 5']
});
```

---

### Example 4: String Transformations

```javascript
const text = ReactiveUtils.state({
  content: 'hello world',
  title: 'my document'
});

// Transform strings
text.$set({
  content: (current) => current.toUpperCase(),
  title: (current) => current
    .split(' ')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ')
});

console.log(text.content);  // "HELLO WORLD"
console.log(text.title);    // "My Document"
```

---

### Example 5: Mix Regular and Functional

```javascript
const state = ReactiveUtils.state({
  count: 0,
  name: '',
  timestamp: null
});

// Mix regular values and functions
state.$set({
  count: (current) => current + 1,      // Function
  name: 'John',                          // Regular
  timestamp: new Date()                  // Regular
});

console.log(state);
// { count: 1, name: 'John', timestamp: Date(...) }
```

---

## Real-World Example: Shopping Cart

```javascript
const cart = ReactiveUtils.state({
  items: [],
  total: 0,
  itemCount: 0,
  lastModified: null
});

function addToCart(product) {
  console.log(`\n➕ Adding ${product.name} to cart`);
  
  cart.$set({
    // Add item (depends on current items)
    items: (current) => {
      const existing = current.find(item => item.id === product.id);
      
      if (existing) {
        // Increase quantity
        return current.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        return [...current, { ...product, quantity: 1 }];
      }
    },
    
    // Update total (depends on new items)
    total: (current, state) => {
      // Note: Can't access updated items directly here
      // Calculate from product
      return current + product.price;
    },
    
    // Increment count
    itemCount: (current) => current + 1,
    
    // Set timestamp (regular value)
    lastModified: new Date()
  });
  
  console.log(`Cart now has ${cart.itemCount} items, total: $${cart.total}`);
}

function removeFromCart(productId) {
  console.log(`\n➖ Removing product ${productId}`);
  
  cart.$set({
    items: (current) => {
      const item = current.find(i => i.id === productId);
      
      if (!item) return current;
      
      if (item.quantity > 1) {
        // Decrease quantity
        return current.map(i =>
          i.id === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        );
      } else {
        // Remove item completely
        return current.filter(i => i.id !== productId);
      }
    },
    
    total: (current) => {
      const item = cart.items.find(i => i.id === productId);
      return item ? current - item.price : current;
    },
    
    itemCount: (current) => Math.max(0, current - 1),
    lastModified: new Date()
  });
  
  console.log(`Cart now has ${cart.itemCount} items, total: $${cart.total}`);
}

function clearCart() {
  console.log('\n🗑️ Clearing cart');
  
  cart.$set({
    items: [],           // Regular value
    total: 0,            // Regular value
    itemCount: 0,        // Regular value
    lastModified: new Date()
  });
}

function applyDiscount(percent) {
  console.log(`\n🎟️ Applying ${percent}% discount`);
  
  cart.$set({
    total: (current) => current * (1 - percent / 100)
  });
  
  console.log(`New total: $${cart.total.toFixed(2)}`);
}

// Test the cart
addToCart({ id: 1, name: 'Laptop', price: 999 });
addToCart({ id: 2, name: 'Mouse', price: 29 });
addToCart({ id: 1, name: 'Laptop', price: 999 });  // Increase quantity

removeFromCart(1);  // Decrease laptop quantity
applyDiscount(10);  // 10% off
```

---

## Real-World Example: Form Field Manager

```javascript
const form = ReactiveUtils.state({
  fields: {
    email: '',
    password: '',
    confirmPassword: ''
  },
  touched: {
    email: false,
    password: false,
    confirmPassword: false
  },
  errors: {},
  submitCount: 0,
  isValid: false
});

function handleFieldChange(fieldName, value) {
  form.$set({
    [`fields.${fieldName}`]: value,
    
    // Mark as touched
    [`touched.${fieldName}`]: true,
    
    // Clear error when typing
    [`errors.${fieldName}`]: null
  });
}

function handleFieldBlur(fieldName) {
  form.$set({
    // Mark as touched (ensure it's set)
    [`touched.${fieldName}`]: true
  });
  
  // Validate after blur
  validateField(fieldName);
}

function validateField(fieldName) {
  const value = form.fields[fieldName];
  let error = null;
  
  if (fieldName === 'email') {
    if (!value) {
      error = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Invalid email format';
    }
  } else if (fieldName === 'password') {
    if (!value) {
      error = 'Password is required';
    } else if (value.length < 8) {
      error = 'Password must be at least 8 characters';
    }
  } else if (fieldName === 'confirmPassword') {
    if (value !== form.fields.password) {
      error = 'Passwords do not match';
    }
  }
  
  form.$set({
    [`errors.${fieldName}`]: error
  });
}

function submitForm() {
  console.log('\n📝 Submitting form...');
  
  // Mark all fields as touched
  form.$set({
    'touched.email': true,
    'touched.password': true,
    'touched.confirmPassword': true,
    
    // Increment submit count
    submitCount: (current) => current + 1
  });
  
  // Validate all fields
  Object.keys(form.fields).forEach(validateField);
  
  // Check if valid
  const hasErrors = Object.values(form.errors).some(e => e);
  
  if (hasErrors) {
    console.log('❌ Form has errors');
    return;
  }
  
  console.log('✅ Form valid, submitting...');
  // Submit logic here
}

function resetForm() {
  console.log('\n🔄 Resetting form...');
  
  form.$set({
    fields: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    touched: {
      email: false,
      password: false,
      confirmPassword: false
    },
    errors: {},
    isValid: false
    // submitCount preserved
  });
}

// Test the form
handleFieldChange('email', 'test@example.com');
handleFieldChange('password', 'password123');
handleFieldChange('confirmPassword', 'password123');
handleFieldBlur('email');
submitForm();
```

---

## Real-World Example: Game Score System

```javascript
const game = ReactiveUtils.state({
  score: 0,
  multiplier: 1,
  combo: 0,
  highScore: 0,
  lives: 3,
  powerUps: [],
  stats: {
    totalPoints: 0,
    enemiesDefeated: 0,
    coinsCollected: 0
  }
});

function addPoints(points) {
  console.log(`\n💰 +${points} points`);
  
  game.$set({
    // Add points with multiplier
    score: (current) => current + (points * game.multiplier),
    
    // Increase combo
    combo: (current) => current + 1,
    
    // Update high score if needed
    highScore: (current) => {
      const newScore = game.score + (points * game.multiplier);
      return Math.max(current, newScore);
    },
    
    // Update stats
    'stats.totalPoints': (current) => current + points,
    'stats.coinsCollected': (current) => current + 1
  });
  
  console.log(`Score: ${game.score}, Combo: ${game.combo}x, High Score: ${game.highScore}`);
}

function defeatEnemy(enemyValue) {
  console.log(`\n⚔️ Enemy defeated! +${enemyValue} points`);
  
  game.$set({
    score: (current) => current + (enemyValue * game.multiplier),
    combo: (current) => current + 1,
    
    // Check for multiplier increase at combo milestones
    multiplier: (current) => {
      const newCombo = game.combo + 1;
      if (newCombo % 10 === 0) {
        console.log(`🔥 Multiplier increased to ${current + 1}x!`);
        return current + 1;
      }
      return current;
    },
    
    'stats.enemiesDefeated': (current) => current + 1,
    'stats.totalPoints': (current) => current + enemyValue
  });
}

function breakCombo() {
  console.log('\n💔 Combo broken!');
  
  game.$set({
    combo: 0,
    multiplier: 1
  });
}

function loseLife() {
  console.log('\n❤️ Lost a life!');
  
  game.$set({
    lives: (current) => Math.max(0, current - 1),
    
    // Break combo when losing life
    combo: 0,
    multiplier: 1
  });
  
  if (game.lives === 0) {
    console.log('💀 Game Over!');
  }
}

function collectPowerUp(powerUp) {
  console.log(`\n⭐ Power-up collected: ${powerUp.type}`);
  
  game.$set({
    powerUps: (current) => [...current, {
      ...powerUp,
      collectedAt: Date.now()
    }],
    
    // Some power-ups give points
    score: (current) => powerUp.points ? current + powerUp.points : current
  });
  
  // Apply power-up effects
  if (powerUp.type === 'extra-life') {
    game.$set({
      lives: (current) => current + 1
    });
  } else if (powerUp.type === 'double-points') {
    game.$set({
      multiplier: (current) => current * 2
    });
  }
}

function resetGame() {
  console.log('\n🔄 New Game');
  
  game.$set({
    score: 0,
    multiplier: 1,
    combo: 0,
    lives: 3,
    powerUps: [],
    stats: {
      totalPoints: 0,
      enemiesDefeated: 0,
      coinsCollected: 0
    }
    // highScore preserved
  });
}

// Play the game
addPoints(10);
addPoints(10);
defeatEnemy(50);
addPoints(10);
defeatEnemy(50);
collectPowerUp({ type: 'double-points', points: 100 });
addPoints(10);  // With 2x multiplier
loseLife();
breakCombo();
```

---

## Real-World Example: Text Editor State

```javascript
const editor = ReactiveUtils.state({
  content: '',
  selection: { start: 0, end: 0 },
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,
  wordCount: 0,
  charCount: 0,
  isSaved: true,
  lastSaved: null
});

function insertText(text) {
  editor.$set({
    // Add to history before changing
    history: (current) => {
      const newHistory = current.slice(0, editor.historyIndex + 1);
      return [...newHistory, editor.content];
    },
    
    historyIndex: (current) => current + 1,
    
    // Insert text
    content: (current) => {
      const start = editor.selection.start;
      return current.slice(0, start) + text + current.slice(editor.selection.end);
    },
    
    // Update selection
    selection: (current) => ({
      start: current.start + text.length,
      end: current.start + text.length
    }),
    
    // Update counts
    wordCount: (current) => {
      const newContent = editor.content.slice(0, editor.selection.start) + 
                        text + 
                        editor.content.slice(editor.selection.end);
      return newContent.split(/\s+/).filter(Boolean).length;
    },
    
    charCount: (current) => current + text.length,
    
    // Mark as unsaved
    isSaved: false,
    canUndo: true,
    canRedo: false
  });
}

function undo() {
  if (!editor.canUndo) return;
  
  console.log('\n↩️ Undo');
  
  editor.$set({
    historyIndex: (current) => current - 1,
    
    content: editor.history[editor.historyIndex - 1] || '',
    
    canUndo: (current, state) => editor.historyIndex - 1 > 0,
    canRedo: true,
    
    wordCount: (current) => {
      const content = editor.history[editor.historyIndex - 1] || '';
      return content.split(/\s+/).filter(Boolean).length;
    },
    
    charCount: (current) => {
      const content = editor.history[editor.historyIndex - 1] || '';
      return content.length;
    }
  });
}

function redo() {
  if (!editor.canRedo) return;
  
  console.log('\n↪️ Redo');
  
  editor.$set({
    historyIndex: (current) => current + 1,
    
    content: editor.history[editor.historyIndex + 1],
    
    canUndo: true,
    canRedo: (current, state) => 
      editor.historyIndex + 1 < editor.history.length - 1,
    
    wordCount: (current) => {
      const content = editor.history[editor.historyIndex + 1];
      return content.split(/\s+/).filter(Boolean).length;
    },
    
    charCount: (current) => {
      const content = editor.history[editor.historyIndex + 1];
      return content.length;
    }
  });
}

function saveDocument() {
  console.log('\n💾 Saving...');
  
  editor.$set({
    isSaved: true,
    lastSaved: new Date()
  });
  
  console.log('✅ Saved');
}

// Test the editor
insertText('Hello ');
insertText('World');
insertText('!');
console.log('Content:', editor.content);
console.log('Words:', editor.wordCount);
console.log('Characters:', editor.charCount);

undo();
console.log('After undo:', editor.content);

redo();
console.log('After redo:', editor.content);

saveDocument();
```

---

## Common Beginner Questions

### Q: When should I use `$set()` vs regular assignment?

**Answer:**

```javascript
const state = ReactiveUtils.state({ count: 0 });

// Regular assignment - when you know the new value
state.count = 10;

// $set() - when new value depends on current value
state.$set({
  count: (current) => current + 1
});

// $set() is safer in async contexts
setTimeout(() => {
  state.$set({
    count: (current) => current + 1  // Always gets latest value
  });
}, 1000);
```

**Use `$set()`** when the new value depends on the current value
**Use regular assignment** when you know the exact new value

---

### Q: Can I access other properties in the function?

**Answer:** The function only receives the current value of that specific property:

```javascript
const state = ReactiveUtils.state({ count: 0, multiplier: 2 });

// ❌ Can't access other properties in update function
state.$set({
  count: (current) => current * this.multiplier  // 'this' is undefined
});

// ✅ Read other properties before calling $set
const { multiplier } = state;
state.$set({
  count: (current) => current * multiplier
});
```

---

### Q: Does it batch updates?

**Answer:** Yes! All updates in one `$set()` call are batched:

```javascript
const state = ReactiveUtils.state({ a: 0, b: 0, c: 0 });

let effectRuns = 0;
ReactiveUtils.effect(() => {
  effectRuns++;
  console.log(state.a, state.b, state.c);
});

state.$set({
  a: (current) => current + 1,
  b: (current) => current + 2,
  c: (current) => current + 3
});

console.log('Effect runs:', effectRuns);  // 2 (initial + 1 batched update)
```

---

### Q: Can I use it with nested properties?

**Answer:** Yes, use dot notation:

```javascript
const state = ReactiveUtils.state({
  user: {
    profile: {
      age: 25
    }
  }
});

state.$set({
  'user.profile.age': (current) => current + 1
});

console.log(state.user.profile.age);  // 26
```

---

### Q: What if the function returns undefined?

**Answer:** The property will be set to undefined:

```javascript
const state = ReactiveUtils.state({ value: 10 });

state.$set({
  value: (current) => {
    // Oops, forgot to return!
  }
});

console.log(state.value);  // undefined
```

Always return a value from your update functions!

---

## Tips for Beginners

### 1. Use for Increment/Decrement

```javascript
// ✅ Clean increment
state.$set({
  count: (current) => current + 1
});

// ❌ Verbose
state.count = state.count + 1;
```

---

### 2. Use for Toggle

```javascript
// ✅ Clean toggle
state.$set({
  isActive: (current) => !current
});

// ❌ Verbose
state.isActive = !state.isActive;
```

---

### 3. Use for Array Transformations

```javascript
// ✅ Clean array operations
state.$set({
  items: (current) => [...current, newItem],
  favorites: (current) => current.filter(x => x.starred),
  sorted: (current) => [...current].sort()
});
```

---

### 4. Mix Regular and Functional

```javascript
// You can mix both!
state.$set({
  count: (current) => current + 1,  // Functional
  name: 'John',                      // Regular
  timestamp: new Date()              // Regular
});
```

---

### 5. Use in Async Contexts

```javascript
// ✅ Safe - always uses latest value
async function asyncIncrement() {
  await delay(1000);
  state.$set({
    count: (current) => current + 1  // Gets latest value
  });
}

// ❌ Risky - might use stale value
async function asyncIncrementRisky() {
  const oldCount = state.count;  // Captured value
  await delay(1000);
  state.count = oldCount + 1;    // Might be stale!
}
```

---

## Summary

### What `$set()` Does:

1. ✅ Performs functional updates
2. ✅ Method on reactive state objects
3. ✅ Functions receive current value
4. ✅ Safe in async contexts
5. ✅ Batches all updates
6. ✅ Can mix regular values and functions

### When to Use It:

- Increments/decrements
- Toggle boolean values
- Array transformations (add, remove, filter)
- String transformations
- Any update that depends on current value
- Async contexts where closure might be stale

### The Basic Pattern:

```javascript
state.$set({
  // Functional update
  property: (currentValue) => newValue,
  
  // Multiple functional updates
  count: (current) => current + 1,
  items: (current) => [...current, newItem],
  
  // Mix with regular values
  timestamp: new Date()
});
```

### Quick Reference:

```javascript
// Increment
state.$set({ count: (c) => c + 1 });

// Toggle
state.$set({ active: (a) => !a });

// Array add
state.$set({ items: (i) => [...i, item] });

// Array filter
state.$set({ items: (i) => i.filter(x => x.id !== id) });

// Transform
state.$set({ text: (t) => t.toUpperCase() });
```

**Remember:** `$set()` is your functional updater - perfect when your new value depends on the current value. Always get the latest value, never deal with stale closures! 🎉