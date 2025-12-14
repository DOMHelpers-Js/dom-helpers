# Understanding `actions()` (Builder) - A Beginner's Guide

## What is `actions()`?

`actions()` is a builder method that adds **multiple action methods** at once to your state. It's a shorthand for adding many actions together.

Think of it as **bulk action builder** - add many methods in one call.

---

## Why Does This Exist?

### The Problem: Adding Many Actions

Without `actions()`, you call `action()` multiple times:

```javascript
// ❌ Repetitive - many action() calls
const state = ReactiveUtils.builder() 
  .state({ count: 0 })
  .action('increment', function() { this.count++; })
  .action('decrement', function() { this.count--; })
  .action('reset', function() { this.count = 0; })
  .build();

// ✅ With actions() - all at once
const state = ReactiveUtils.builder() 
  .state({ count: 0 })
  .actions({
    increment() { this.count++; },
    decrement() { this.count--; },
    reset() { this.count = 0; }
  })
  .build();
```

**Why this matters:**
- Add many actions at once
- Less repetitive
- Cleaner code
- Better organization

---

## How Does It Work?

### The Builder Chain

```javascript
ReactiveUtils.builder() 
  .state({ count: 0 })
  .actions({
    increment() { this.count++; },
    decrement() { this.count--; }
  })
  .build();
```

---

## Basic Usage

### Multiple Actions Object

```javascript
const counter = ReactiveUtils.builder() 
  .state({ count: 0 })
  .actions({
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
    reset() {
      this.count = 0;
    },
    add(amount) {
      this.count += amount;
    }
  })
  .build();

counter.increment(); // 1
counter.add(5);      // 6
counter.decrement(); // 5
counter.reset();     // 0
```

### Mix with Single Actions

```javascript
const state = ReactiveUtils.builder() 
  .state({ value: 0 })
  .actions({
    increment() { this.value++; },
    decrement() { this.value--; }
  })
  .action('double', function() {
    this.value *= 2;
  })
  .build();
```

---

## Simple Examples Explained

### Example 1: Todo Manager

```javascript
const todos = ReactiveUtils.builder() 
  .state({
    items: [],
    filter: 'all',
    nextId: 1
  })
  .actions({
    addTodo(text) {
      this.items.push({
        id: this.nextId++,
        text: text,
        completed: false
      });
    },

    removeTodo(id) {
      const index = this.items.findIndex(t => t.id === id);
      if (index !== -1) this.items.splice(index, 1);
    },

    toggleTodo(id) {
      const todo = this.items.find(t => t.id === id);
      if (todo) todo.completed = !todo.completed;
    },

    setFilter(filter) {
      this.filter = filter;
    },

    clearCompleted() {
      this.items = this.items.filter(t => !t.completed);
    }
  })
  .computed('filteredTodos', (s) => {
    if (s.filter === 'active') return s.items.filter(t => !t.completed);
    if (s.filter === 'completed') return s.items.filter(t => t.completed);
    return s.items;
  })
  .build();

todos.addTodo('Buy milk');
todos.addTodo('Walk dog');
todos.toggleTodo(1);
todos.setFilter('active');
```

---

### Example 2: Shopping Cart

```javascript
const cart = ReactiveUtils.builder() 
  .state({
    items: [],
    couponCode: '',
    discount: 0
  })
  .actions({
    addItem(product, quantity = 1) {
      const existing = this.items.find(i => i.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({ ...product, quantity });
      }
    },

    removeItem(productId) {
      this.items = this.items.filter(i => i.id !== productId);
    },

    updateQuantity(productId, quantity) {
      const item = this.items.find(i => i.id === productId);
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId);
        } else {
          item.quantity = quantity;
        }
      }
    },

    applyCoupon(code) {
      this.couponCode = code;
      if (code === 'SAVE10') {
        this.discount = 0.1;
      } else if (code === 'SAVE20') {
        this.discount = 0.2;
      } else {
        this.discount = 0;
      }
    },

    clear() {
      this.items = [];
      this.couponCode = '';
      this.discount = 0;
    }
  })
  .computed('subtotal', (s) =>
    s.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )
  .computed('total', (s) => s.subtotal * (1 - s.discount))
  .build();
```

---

### Example 3: User Profile

```javascript
const profile = ReactiveUtils.builder() 
  .state({
    user: null,
    editing: false,
    editData: {},
    loading: false,
    error: null
  })
  .actions({
    async load(userId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`/api/users/${userId}`);
        this.user = await response.json();
      } catch (err) {
        this.error = 'Failed to load profile';
      } finally {
        this.loading = false;
      }
    },

    startEdit() {
      this.editing = true;
      this.editData = { ...this.user };
    },

    cancelEdit() {
      this.editing = false;
      this.editData = {};
    },

    updateField(field, value) {
      this.editData[field] = value;
    },

    async save() {
      this.loading = true;
      try {
        const response = await fetch(`/api/users/${this.user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.editData)
        });
        if (response.ok) {
          this.user = await response.json();
          this.editing = false;
          this.editData = {};
        }
      } catch (err) {
        this.error = 'Failed to save';
      } finally {
        this.loading = false;
      }
    }
  })
  .build();
```

---

## Real-World Example: Game State

```javascript
const game = ReactiveUtils.builder() 
  .state({
    score: 0,
    level: 1,
    lives: 3,
    paused: false,
    gameOver: false,
    highScore: 0
  })
  .actions({
    start() {
      this.score = 0;
      this.level = 1;
      this.lives = 3;
      this.paused = false;
      this.gameOver = false;
    },

    addPoints(points) {
      this.score += points;
      if (this.score > this.highScore) {
        this.highScore = this.score;
      }
      // Level up every 1000 points
      const newLevel = Math.floor(this.score / 1000) + 1;
      if (newLevel > this.level) {
        this.levelUp();
      }
    },

    levelUp() {
      this.level++;
      this.lives++; // Bonus life
    },

    loseLife() {
      this.lives--;
      if (this.lives <= 0) {
        this.end();
      }
    },

    togglePause() {
      this.paused = !this.paused;
    },

    end() {
      this.gameOver = true;
      this.paused = true;
      // Save high score
      localStorage.setItem('highScore', this.highScore);
    },

    reset() {
      this.start();
    }
  })
  .computed('difficulty', (s) => {
    if (s.level < 5) return 'Easy';
    if (s.level < 10) return 'Medium';
    return 'Hard';
  })
  .effect(() => {
    document.getElementById('score').textContent = game.score;
    document.getElementById('level').textContent = game.level;
    document.getElementById('lives').textContent = game.lives;
  })
  .build();

// Load saved high score
const savedHighScore = localStorage.getItem('highScore');
if (savedHighScore) {
  game.highScore = parseInt(savedHighScore);
}
```

---

## Common Patterns

### Pattern 1: Multiple Actions

```javascript
.actions({
  method1() { /* ... */ },
  method2() { /* ... */ },
  method3() { /* ... */ }
})
```

### Pattern 2: Actions with Parameters

```javascript
.actions({
  add(amount) {
    this.count += amount;
  },
  subtract(amount) {
    this.count -= amount;
  }
})
```

### Pattern 3: Async Actions

```javascript
.actions({
  async load() {
    this.data = await fetchData();
  },
  async save() {
    await saveData(this.data);
  }
})
```

---

## Common Questions

### Q: What's the difference from `action()`?

**Answer:**

- **`action()`** = Add one action
- **`actions()`** = Add multiple actions

```javascript
// action() - one at a time
.action('increment', function() { this.count++; })
.action('decrement', function() { this.count--; })

// actions() - all at once
.actions({
  increment() { this.count++; },
  decrement() { this.count--; }
})
```

### Q: Can I use arrow functions?

**Answer:** No! Use regular methods to access `this`:

```javascript
// ✅ Regular methods
.actions({
  increment() {
    this.count++;
  }
})

// ❌ Arrow functions - 'this' won't work
.actions({
  increment: () => {
    this.count++; // 'this' is wrong!
  }
})
```

### Q: Can I mix with single `action()`?

**Answer:** Yes!

```javascript
.actions({
  method1() {},
  method2() {}
})
.action('method3', function() {})
```

---

## Tips for Success

### 1. Use Regular Methods

```javascript
// ✅ Regular methods
.actions({
  method() {
    this.value = 10;
  }
})
```

### 2. Group Related Actions

```javascript
// ✅ Organize by feature
.actions({
  // User actions
  login() {},
  logout() {},
  updateProfile() {},

  // Cart actions
  addToCart() {},
  removeFromCart() {}
})
```

### 3. Keep Methods Focused

```javascript
// ✅ Single responsibility
.actions({
  add(item) {
    this.items.push(item);
  },
  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
  }
})
```

---

## Summary

### What `actions()` Does:

1. ✅ Adds multiple action methods
2. ✅ Takes object with methods
3. ✅ Methods can access state via `this`
4. ✅ Returns builder for chaining
5. ✅ Cleaner than multiple `action()` calls

### When to Use It:

- Adding multiple actions
- Organizing related methods
- Cleaner builder code
- Any time you have 2+ actions

### The Basic Pattern:

```javascript
const state = ReactiveUtils.builder() 
  .state({ count: 0 })
  .actions({
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
    reset() {
      this.count = 0;
    }
  })
  .build();

state.increment(); // Works!
```

---

**Remember:** `actions()` is shorthand for adding multiple actions at once. Use regular methods (not arrow functions) to access `this`! 🎉
