# `state.$batch()` - Group Multiple Updates, Run Effects Once

> **You are a senior JavaScript engineer teaching a beginner**

---

## The Problem: Multiple Updates Trigger Effects Multiple Times

Imagine you're updating a form with data from an API. You have an effect that validates the form. If you update fields one by one, the validation effect runs after EVERY SINGLE UPDATE!

Here's what happens **WITHOUT** `$batch()`:

```javascript
const form = state({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// Effect runs validation
effect(() => {
  console.log('Validating form...');
  validateForm(form);
});

// Load user data from API
function loadUserData(userData) {
  form.username = userData.username;      // Effect runs (1)
  form.email = userData.email;            // Effect runs (2)
  form.password = '';                     // Effect runs (3)
  form.confirmPassword = '';              // Effect runs (4)
}

loadUserData({
  username: 'john_doe',
  email: 'john@example.com'
});

// Logs "Validating form..." FOUR TIMES!
// But we only needed it to run ONCE at the end!
```

**The Real Issues:**
- Effects run after **every single property** change
- Wasteful when updating multiple properties at once
- Performance hit from repeated calculations
- DOM updates multiple times unnecessarily

---

## The Solution: `$batch()` - Update Multiple Properties, Effects Run Once

`$batch()` lets you group multiple updates together. Effects wait until ALL updates are done, then run ONCE!

```javascript
const form = state({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

effect(() => {
  console.log('Validating form...');
  validateForm(form);
});

// ✅ Batch all updates together
function loadUserData(userData) {
  form.$batch(() => {
    form.username = userData.username;
    form.email = userData.email;
    form.password = '';
    form.confirmPassword = '';
  });
}

loadUserData({
  username: 'john_doe',
  email: 'john@example.com'
});

// Logs "Validating form..." ONCE!
// All four properties updated, then effects run
```

**Think of it like this:**
- **Without batch**: Update → Effect runs → Update → Effect runs → Update → Effect runs
- **With batch**: Update → Update → Update → ALL effects run once

---

## How It Works Under the Hood

When you call `$batch(fn)`:

```
state.$batch(() => { ... })
        ↓
1. Pause all effects/watchers
2. Run the function (all updates happen)
3. Collect all changes
4. Resume effects/watchers
5. Run effects ONCE with all changes
        ↓
Returns the state (for chaining)
```

**Example:**
```javascript
const app = state({ count: 0, total: 0 });

effect(() => {
  console.log('Effect ran:', app.count, app.total);
});

// Without batch
app.count = 10;  // Effect runs: "Effect ran: 10 0"
app.total = 100; // Effect runs: "Effect ran: 10 100"

// With batch
app.$batch(() => {
  app.count = 20;
  app.total = 200;
});
// Effect runs ONCE: "Effect ran: 20 200"
```

**The magic:** Effects are paused while the function runs, then all run together at the end!

---

## When to Use `$batch()`

### ✅ Use Case 1: Loading Form Data from API

Populate multiple form fields at once.

```javascript
const form = state({
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  bio: '',
  avatar: ''
});

// Effect updates display
effect(() => {
  document.getElementById('preview').innerHTML = `
    <h3>${form.firstName} ${form.lastName}</h3>
    <p>${form.bio}</p>
    <p>@${form.username}</p>
  `;
});

// Load user profile
async function loadProfile(userId) {
  const user = await fetch(`/api/users/${userId}`).then(r => r.json());

  // Update ALL fields at once
  form.$batch(() => {
    form.username = user.username;
    form.email = user.email;
    form.firstName = user.firstName;
    form.lastName = user.lastName;
    form.bio = user.bio;
    form.avatar = user.avatar;
  });

  // Effect runs ONCE with all new data
  console.log('Form populated!');
}
```

**Why this works:** All form fields update, DOM renders once with complete data. No partial/flickering UI!

---

### ✅ Use Case 2: Shopping Cart Calculations

Recalculate all cart totals together.

```javascript
const cart = state({
  items: [],
  subtotal: 0,
  discount: 0,
  tax: 0,
  shipping: 0,
  total: 0
});

// Effect updates cart display
effect(() => {
  document.getElementById('cart-total').textContent = `$${cart.total.toFixed(2)}`;
  console.log('Cart display updated');
});

// Recalculate all totals
function recalculateCart() {
  cart.$batch(() => {
    // Calculate subtotal
    cart.subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Calculate discount (10% off over $100)
    cart.discount = cart.subtotal > 100 ? cart.subtotal * 0.1 : 0;

    // Calculate tax
    cart.tax = (cart.subtotal - cart.discount) * 0.1;

    // Calculate shipping
    cart.shipping = cart.subtotal > 50 ? 0 : 5.99;

    // Calculate total
    cart.total = cart.subtotal - cart.discount + cart.tax + cart.shipping;
  });

  // Effect runs ONCE with final total
}

// Add item to cart
cart.items.push({ name: 'Laptop', price: 999, quantity: 1 });
recalculateCart();
```

**Why this works:** All calculations happen together, display updates once with final values. No intermediate states visible!

---

### ✅ Use Case 3: Bulk List Updates

Update multiple list items at once.

```javascript
const todoList = state({
  items: [
    { id: 1, text: 'Buy milk', done: false },
    { id: 2, text: 'Call dentist', done: false },
    { id: 3, text: 'Finish project', done: false }
  ]
});

// Effect re-renders list
effect(() => {
  const todoHTML = todoList.items.map(todo => `
    <li class="${todo.done ? 'done' : ''}">
      ${todo.text}
    </li>
  `).join('');

  document.getElementById('todo-list').innerHTML = todoHTML;
  console.log('List re-rendered');
});

// Mark all as complete
function completeAll() {
  todoList.$batch(() => {
    todoList.items.forEach(todo => {
      todo.done = true;
    });
  });

  // Effect runs ONCE, renders complete list
  console.log('All todos marked complete!');
}

// Toggle multiple todos
function toggleMultiple(ids) {
  todoList.$batch(() => {
    ids.forEach(id => {
      const todo = todoList.items.find(t => t.id === id);
      if (todo) todo.done = !todo.done;
    });
  });

  // Effect runs ONCE
}
```

**Why this works:** Multiple items update, list renders once with all changes. Smooth, no flickering!

---

### ✅ Use Case 4: Animation Frame Updates

Update game state 60 times per second.

```javascript
const game = state({
  player: {
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    health: 100,
    score: 0
  },
  enemies: [],
  time: 0
});

// Effect renders game
effect(() => {
  renderGame(game.player, game.enemies);
  console.log('Frame rendered');
});

// Game loop (60 FPS)
function gameLoop() {
  game.$batch(() => {
    // Update player position
    game.player.x += game.player.velocityX;
    game.player.y += game.player.velocityY;

    // Apply gravity
    game.player.velocityY += 0.5;

    // Update enemies
    game.enemies.forEach(enemy => {
      enemy.x += enemy.velocityX;
      enemy.y += enemy.velocityY;
    });

    // Update time
    game.time += 1/60;

    // Check collisions, update score, etc.
  });

  // Effect runs ONCE per frame
  requestAnimationFrame(gameLoop);
}
```

**Why this works:** All game state updates happen together, render happens once per frame. 60 FPS smooth!

---

### ✅ Use Case 5: Resetting Multiple Fields

Clear form or reset state.

```javascript
const editor = state({
  title: '',
  content: '',
  tags: [],
  isDraft: true,
  lastSaved: null,
  wordCount: 0,
  charCount: 0
});

// Effect auto-saves
effect(() => {
  if (editor.isDraft && editor.content) {
    saveToLocalStorage(editor);
  }
});

// Reset editor
function resetEditor() {
  editor.$batch(() => {
    editor.title = '';
    editor.content = '';
    editor.tags = [];
    editor.isDraft = true;
    editor.lastSaved = null;
    editor.wordCount = 0;
    editor.charCount = 0;
  });

  // Effect runs ONCE with reset state
  console.log('Editor reset!');
}

// Load template
function loadTemplate(template) {
  editor.$batch(() => {
    editor.title = template.title;
    editor.content = template.content;
    editor.tags = [...template.tags];
    editor.isDraft = true;
    editor.wordCount = template.content.split(' ').length;
    editor.charCount = template.content.length;
  });

  // Effect runs ONCE
}
```

**Why this works:** All fields reset together, effects run once with fresh state!

---

## How `$batch()` Interacts With Other Features

### With Effects - Effects Run Once After Batch

```javascript
const app = state({ a: 0, b: 0, c: 0 });

effect(() => {
  console.log('Effect:', app.a, app.b, app.c);
});

// Without batch: effect runs 3 times
app.a = 1;  // Effect: 1 0 0
app.b = 2;  // Effect: 1 2 0
app.c = 3;  // Effect: 1 2 3

// With batch: effect runs ONCE
app.$batch(() => {
  app.a = 10;
  app.b = 20;
  app.c = 30;
});
// Effect: 10 20 30 (once!)
```

**Lesson:** Batch defers effects until all updates complete!

---

### With Computed - Computes Once with Final Values

```javascript
const cart = state({ items: [] });

cart.$computed('total', function() {
  console.log('Computing total...');
  return this.items.reduce((sum, i) => sum + i.price, 0);
});

effect(() => {
  console.log('Total:', cart.total);
});

// Without batch
cart.items.push({ price: 10 });  // Computes, logs "Total: 10"
cart.items.push({ price: 20 });  // Computes, logs "Total: 30"

// With batch
cart.$batch(() => {
  cart.items.push({ price: 30 });
  cart.items.push({ price: 40 });
});
// Computes ONCE, logs "Total: 100" (once!)
```

**Lesson:** Computed properties recalculate once with final values!

---

### With Watchers - Watchers Run Once

```javascript
const app = state({ count: 0, message: '' });

app.$watch('count', (newVal) => {
  console.log('Count changed to:', newVal);
});

// Without batch
app.count = 5;   // Logs: "Count changed to: 5"
app.count = 10;  // Logs: "Count changed to: 10"

// With batch
app.$batch(() => {
  app.count = 15;
  app.count = 20;
  app.count = 25;
});
// Logs: "Count changed to: 25" (ONCE, with final value!)
```

**Lesson:** Watchers run once with the final value after batch!

---

## When NOT to Use `$batch()`

### ❌ Don't Use for Single Updates

```javascript
// ❌ Unnecessary batch
app.$batch(() => {
  app.count = 10;
});

// ✅ Just assign directly
app.count = 10;
```

**Why:** Batching adds overhead. Only use for multiple updates!

---

### ❌ Don't Nest Batches

```javascript
// ❌ BAD: Nested batches
app.$batch(() => {
  app.count = 10;

  app.$batch(() => {  // Inner batch unnecessary
    app.total = 100;
  });
});

// ✅ GOOD: Single batch
app.$batch(() => {
  app.count = 10;
  app.total = 100;
});
```

**Why:** Nesting doesn't add benefit, just complexity!

---

## Comparison with Global `batch()`

| Method | Scope | Usage |
|--------|-------|-------|
| `batch(() => {...})` | Global | Works with any reactive state |
| `state.$batch(() => {...})` | Instance | Works with specific state instance |

**Example:**
```javascript
const state1 = state({ a: 0 });
const state2 = state({ b: 0 });

// Global batch (affects all reactive objects)
batch(() => {
  state1.a = 10;
  state2.b = 20;
});

// Instance batch (only affects state1)
state1.$batch(() => {
  state1.a = 10;
  // Can still update state2, but not batched
  state2.b = 20;
});
```

**When to use which:**
- **Global `batch()`** - Multiple reactive objects
- **`state.$batch()`** - Single state instance

---

## Quick Mental Model

Think of batch as **"pause effects, do work, resume and run once"**:

```javascript
// Without batch:
app.a = 1;  // Effects run
app.b = 2;  // Effects run
app.c = 3;  // Effects run

// With batch:
app.$batch(() => {
  app.a = 1;  // Effects paused
  app.b = 2;  // Effects paused
  app.c = 3;  // Effects paused
});
// Effects resume and run ONCE
```

**Remember:**
- Batch groups updates
- Effects run once at the end
- Use for multiple related updates
- Don't nest batches

---

## Summary

**`state.$batch()` groups multiple property updates and runs effects once at the end.**

**When to use it:**
- ✅ Loading data from APIs
- ✅ Recalculating multiple values
- ✅ Bulk list updates
- ✅ Animation frames
- ✅ Resetting/clearing state

**When NOT to use it:**
- ❌ Single property updates
- ❌ Don't nest batches
- ❌ Not needed if no effects are tracking

**One-sentence summary:**
Use `$batch()` when updating multiple properties together to run effects once instead of after every change - better performance! 🎯

---

➡️ **Next:** Learn about [`$notify()`]($notify.md) for manual reactivity triggers!
