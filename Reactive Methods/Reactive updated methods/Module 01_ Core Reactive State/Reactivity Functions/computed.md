# Understanding `computed()` - A Beginner's Guide

## What is `computed()`?

`computed()` is a function that adds **computed properties** to your reactive state - properties that automatically calculate their value based on other reactive data. They're like smart formulas that recalculate themselves whenever their dependencies change.

Think of it as **automatic calculations**:
1. You define a calculation formula
2. It calculates immediately
3. The result is cached (remembered)
4. Only recalculates when needed (when dependencies change)
5. Acts like a regular property you can read

It's like having a spreadsheet cell with a formula - it always shows the current calculated value!

---

## Why Does This Exist?

### The Old Way (Without `computed()`)

Imagine you want to show a full name from first and last names:

```javascript
const state = ReactiveUtils.state({
  firstName: 'John',
  lastName: 'Doe'
});

// Manual calculation every time you need it
function getFullName() {
  return state.firstName + ' ' + state.lastName;
}

// Use it everywhere
document.getElementById('name1').textContent = getFullName();
document.getElementById('name2').textContent = getFullName();
document.getElementById('name3').textContent = getFullName();

// After changes, recalculate everywhere again
state.firstName = 'Jane';
document.getElementById('name1').textContent = getFullName();
document.getElementById('name2').textContent = getFullName();
document.getElementById('name3').textContent = getFullName();
```

**Problems:**
- Must call function every time
- Recalculates even if values haven't changed
- No automatic updates
- Repetitive code
- Easy to forget to update somewhere

### The New Way (With `computed()`)

With `computed()`, calculation is automatic and cached:

```javascript
const state = ReactiveUtils.state({
  firstName: 'John',
  lastName: 'Doe'
});

// Add computed property
ReactiveUtils.computed(state, {
  fullName() {
    return this.firstName + ' ' + this.lastName;
  }
});

// Use it like a regular property
console.log(state.fullName);  // "John Doe"

// Automatically updates when dependencies change
state.firstName = 'Jane';
console.log(state.fullName);  // "Jane Doe" - automatically recalculated!

// Use in effects - automatic updates
ReactiveUtils.effect(() => {
  document.getElementById('display').textContent = state.fullName;
  // Automatically updates when firstName or lastName changes!
});
```

**Benefits:**
- No function calls needed - use like a property
- Automatic recalculation when dependencies change
- Smart caching - only recalculates when needed
- Cleaner, more intuitive code
- Works seamlessly with effects and bindings

---

## How Does It Work?

### The Magic Behind the Scenes

When you use `computed()`, three things happen:

1. **Tracks dependencies** - Automatically detects which properties the calculation uses
2. **Caches the result** - Remembers the calculated value
3. **Marks as dirty** - When dependencies change, marks the computed as needing recalculation
4. **Lazy recalculation** - Only recalculates when you actually access it

Think of it like this:

```
state.firstName = 'John'
state.lastName = 'Doe'
        ↓
computed: fullName() {
  return this.firstName + ' ' + this.lastName;
}
        ↓
First access: state.fullName
  → Calculates: "John Doe"
  → Caches result
        ↓
Second access: state.fullName
  → Returns cached: "John Doe" (no recalculation!)
        ↓
state.firstName = 'Jane'
  → Marks fullName as dirty
        ↓
Next access: state.fullName
  → Recalculates: "Jane Doe"
  → Caches new result
```

**Key concept:** Computed properties are **lazy** - they only recalculate when you access them after dependencies change!

---

## Simple Examples Explained

### Example 1: Full Name

**JavaScript:**
```javascript
const user = ReactiveUtils.state({
  firstName: 'John',
  lastName: 'Doe'
});

// Add computed property
ReactiveUtils.computed(user, {
  fullName() {
    return this.firstName + ' ' + this.lastName;
  }
});

// Use it like a regular property
console.log(user.fullName);  // "John Doe"

// Changes automatically update
user.firstName = 'Jane';
console.log(user.fullName);  // "Jane Doe"
user.lastName = 'Smith';
console.log(user.fullName);  // "Jane Smith"
```

**What happens:**
- `fullName` acts like a regular property
- But it's automatically calculated from `firstName` and `lastName`
- No function calls needed
- Always up-to-date

**Why this is cool:** You can use `user.fullName` everywhere as if it was stored data, but it's always calculated fresh from the latest values!

---

### Example 2: Shopping Cart Total

```javascript
const cart = ReactiveUtils.state({
  items: [
    { name: 'Apple', price: 1.50, quantity: 3 },
    { name: 'Banana', price: 0.75, quantity: 5 }
  ],
  taxRate: 0.1,
  discount: 0
});

// Add computed properties
ReactiveUtils.computed(cart, {
  subtotal() {
    return this.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
  },
  
  tax() {
    return this.subtotal * this.taxRate;
  },
  
  discountAmount() {
    return this.subtotal * this.discount;
  },
  
  total() {
    return this.subtotal + this.tax - this.discountAmount;
  }
});

// Use computed properties
console.log(cart.subtotal);        // 8.25
console.log(cart.tax);             // 0.825
console.log(cart.total);           // 9.075

// Change any value - all computed properties update automatically
cart.items[0].quantity = 5;
console.log(cart.subtotal);        // 11.25 (recalculated)
console.log(cart.total);           // 12.375 (also recalculated)

cart.discount = 0.1;  // 10% discount
console.log(cart.discountAmount);  // 1.125
console.log(cart.total);           // 11.25 (with discount applied)
```

**What happens:**
- Multiple computed properties that depend on each other
- `tax` uses `subtotal`
- `total` uses `subtotal`, `tax`, and `discountAmount`
- All automatically recalculate in correct order
- Change any value - everything updates

**Why this is cool:** Complex calculations with dependencies between them, all managed automatically!

---

### Example 3: Form Validation

```javascript
const form = ReactiveUtils.state({
  email: '',
  password: '',
  confirmPassword: '',
  agreedToTerms: false
});

ReactiveUtils.computed(form, {
  emailValid() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  },
  
  passwordValid() {
    return this.password.length >= 8;
  },
  
  passwordsMatch() {
    return this.password === this.confirmPassword;
  },
  
  formValid() {
    return this.emailValid && 
           this.passwordValid && 
           this.passwordsMatch && 
           this.agreedToTerms;
  }
});

// Display validation in real-time
ReactiveUtils.effect(() => {
  document.getElementById('submit-btn').disabled = !form.formValid;
});

// Check individual fields
form.email = 'test@example.com';
console.log(form.emailValid);  // true

form.password = 'short';
console.log(form.passwordValid);  // false

form.password = 'longenough123';
console.log(form.passwordValid);  // true

form.confirmPassword = 'longenough123';
console.log(form.passwordsMatch);  // true

form.agreedToTerms = true;
console.log(form.formValid);  // true - submit button enables automatically!
```

---

### Example 4: Filtered List

```javascript
const todoList = ReactiveUtils.state({
  todos: [
    { id: 1, text: 'Learn React', done: false },
    { id: 2, text: 'Build app', done: true },
    { id: 3, text: 'Deploy', done: false }
  ],
  filter: 'all'  // 'all', 'active', 'completed'
});

ReactiveUtils.computed(todoList, {
  activeTodos() {
    return this.todos.filter(todo => !todo.done);
  },
  
  completedTodos() {
    return this.todos.filter(todo => todo.done);
  },
  
  filteredTodos() {
    if (this.filter === 'active') return this.activeTodos;
    if (this.filter === 'completed') return this.completedTodos;
    return this.todos;
  },
  
  activeCount() {
    return this.activeTodos.length;
  },
  
  completedCount() {
    return this.completedTodos.length;
  }
});

// Display filtered todos
ReactiveUtils.effect(() => {
  const listEl = document.getElementById('todo-list');
  listEl.innerHTML = todoList.filteredTodos
    .map(todo => `<li>${todo.text}</li>`)
    .join('');
});

// Display counts
ReactiveUtils.effect(() => {
  document.getElementById('stats').textContent = 
    `${todoList.activeCount} active, ${todoList.completedCount} completed`;
});

// Change filter - display updates automatically
todoList.filter = 'active';  // Shows only active todos
todoList.filter = 'completed';  // Shows only completed todos

// Mark todo as done - counts update automatically
todoList.todos[0].done = true;  // activeCount and completedCount update
```

---

## Real-World Example: User Dashboard

```javascript
const dashboard = ReactiveUtils.state({
  user: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'admin'
  },
  posts: [
    { id: 1, title: 'Post 1', published: true, likes: 10 },
    { id: 2, title: 'Post 2', published: false, likes: 5 },
    { id: 3, title: 'Post 3', published: true, likes: 20 }
  ],
  settings: {
    theme: 'dark',
    notifications: true
  }
});

// Add all computed properties
ReactiveUtils.computed(dashboard, {
  // User computeds
  fullName() {
    return `${this.user.firstName} ${this.user.lastName}`;
  },
  
  userInitials() {
    return this.user.firstName[0] + this.user.lastName[0];
  },
  
  isAdmin() {
    return this.user.role === 'admin';
  },
  
  // Posts computeds
  publishedPosts() {
    return this.posts.filter(post => post.published);
  },
  
  draftPosts() {
    return this.posts.filter(post => !post.published);
  },
  
  totalLikes() {
    return this.posts.reduce((sum, post) => sum + post.likes, 0);
  },
  
  averageLikes() {
    return this.publishedPosts.length > 0
      ? this.totalLikes / this.publishedPosts.length
      : 0;
  },
  
  // Stats
  postStats() {
    return {
      total: this.posts.length,
      published: this.publishedPosts.length,
      drafts: this.draftPosts.length,
      likes: this.totalLikes
    };
  }
});

// Use in UI
ReactiveUtils.effect(() => {
  document.getElementById('user-name').textContent = dashboard.fullName;
  document.getElementById('user-initials').textContent = dashboard.userInitials;
  
  if (dashboard.isAdmin) {
    document.getElementById('admin-panel').style.display = 'block';
  } else {
    document.getElementById('admin-panel').style.display = 'none';
  }
});

ReactiveUtils.effect(() => {
  const stats = dashboard.postStats;
  document.getElementById('stats').innerHTML = `
    <div>Total Posts: ${stats.total}</div>
    <div>Published: ${stats.published}</div>
    <div>Drafts: ${stats.drafts}</div>
    <div>Total Likes: ${stats.likes}</div>
    <div>Average Likes: ${dashboard.averageLikes.toFixed(1)}</div>
  `;
});

// Everything updates automatically
dashboard.user.firstName = 'Jane';  // fullName and userInitials update
dashboard.posts[1].published = true;  // postStats update
dashboard.posts[0].likes = 50;  // totalLikes and averageLikes update
```

---

## Common Beginner Questions

### Q: What's the difference between `computed` and `effect`?

**Answer:**

- **`computed`** = Returns a calculated **value** (read-only, cached)
- **`effect`** = Performs **side effects** (actions, DOM updates)

```javascript
const state = ReactiveUtils.state({ count: 0 });

// computed - returns a value
ReactiveUtils.computed(state, {
  doubled() {
    return this.count * 2;  // Returns value
  }
});
console.log(state.doubled);  // Use the value

// effect - performs action
ReactiveUtils.effect(() => {
  console.log(state.count);  // Does something, returns nothing useful
});
```

**Use computed for:** Calculations, derived data, filtering, formatting
**Use effect for:** DOM updates, logging, API calls, side effects

### Q: Can computed properties use other computed properties?

**Answer:** Yes! They work perfectly together:

```javascript
const state = ReactiveUtils.state({ price: 100, quantity: 3 });

ReactiveUtils.computed(state, {
  subtotal() {
    return this.price * this.quantity;
  },
  
  tax() {
    return this.subtotal * 0.1;  // Uses subtotal computed
  },
  
  total() {
    return this.subtotal + this.tax;  // Uses both computeds
  }
});

console.log(state.total);  // Works perfectly!
```

### Q: Are computed properties cached?

**Answer:** Yes! That's one of their main benefits:

```javascript
const state = ReactiveUtils.state({ count: 0 });

ReactiveUtils.computed(state, {
  expensive() {
    console.log('Calculating...');
    // Expensive calculation
    return this.count * 1000;
  }
});

// First access - calculates
console.log(state.expensive);  // Logs "Calculating..." then result

// Second access - uses cache
console.log(state.expensive);  // Just returns result, no log!

// Change dependency - recalculates
state.count = 1;
console.log(state.expensive);  // Logs "Calculating..." again
```

### Q: Can I set a computed property?

**Answer:** No! Computed properties are **read-only**:

```javascript
const state = ReactiveUtils.state({ firstName: 'John', lastName: 'Doe' });

ReactiveUtils.computed(state, {
  fullName() {
    return this.firstName + ' ' + this.lastName;
  }
});

// ❌ Can't set it
state.fullName = 'Jane Smith';  // Error or ignored!

// ✅ Change the underlying data instead
state.firstName = 'Jane';
state.lastName = 'Smith';
console.log(state.fullName);  // "Jane Smith"
```

### Q: How do I add computed properties to existing state?

**Answer:** Just call `computed()` on the state object:

```javascript
// Create state first
const state = ReactiveUtils.state({ count: 0 });

// Use it...
state.count = 5;

// Add computed properties later
ReactiveUtils.computed(state, {
  doubled() { return this.count * 2; }
});

// Works!
console.log(state.doubled);  // 10
```

### Q: Can I use `computed()` with methods like `$computed()`?

**Answer:** Yes! They do the same thing:

```javascript
const state = ReactiveUtils.state({ count: 0 });

// Method 1: ReactiveUtils.computed()
ReactiveUtils.computed(state, {
  doubled() { return this.count * 2; }
});

// Method 2: state.$computed()
state.$computed('tripled', function() {
  return this.count * 3;
});

// Both work!
console.log(state.doubled);   // Uses ReactiveUtils.computed()
console.log(state.tripled);   // Uses $computed()
```

---

## Tips for Beginners

### 1. Keep Computed Properties Pure

Computed should only calculate - no side effects:

```javascript
// ❌ Bad - has side effects
ReactiveUtils.computed(state, {
  doubled() {
    console.log('Calculating...');  // Side effect!
    document.getElementById('x').textContent = this.count;  // Side effect!
    return this.count * 2;
  }
});

// ✅ Good - pure calculation
ReactiveUtils.computed(state, {
  doubled() {
    return this.count * 2;  // Just returns value
  }
});

// Use effect for side effects
ReactiveUtils.effect(() => {
  console.log('Doubled:', state.doubled);
  document.getElementById('x').textContent = state.doubled;
});
```

### 2. Use Descriptive Names

Make it clear what's being computed:

```javascript
// ❌ Unclear
ReactiveUtils.computed(state, {
  val() { return this.price * this.qty; },
  x() { return this.val * 0.1; }
});

// ✅ Clear
ReactiveUtils.computed(state, {
  subtotal() { return this.price * this.quantity; },
  tax() { return this.subtotal * 0.1; }
});
```

### 3. Break Complex Computations into Steps

Create intermediate computed properties:

```javascript
// ❌ One complex computed
ReactiveUtils.computed(state, {
  result() {
    const a = this.items.filter(i => i.active);
    const b = a.map(i => i.price * i.qty);
    const c = b.reduce((sum, v) => sum + v, 0);
    return c * 1.1;
  }
});

// ✅ Multiple clear computeds
ReactiveUtils.computed(state, {
  activeItems() {
    return this.items.filter(i => i.active);
  },
  
  itemTotals() {
    return this.activeItems.map(i => i.price * i.qty);
  },
  
  subtotal() {
    return this.itemTotals.reduce((sum, v) => sum + v, 0);
  },
  
  total() {
    return this.subtotal * 1.1;
  }
});
```

### 4. Computed is Perfect for Filtering

Use computed for filtered lists:

```javascript
const todos = ReactiveUtils.state({
  items: [...],
  searchTerm: ''
});

ReactiveUtils.computed(todos, {
  filteredItems() {
    if (!this.searchTerm) return this.items;
    
    return this.items.filter(item =>
      item.text.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
});

// Use in effect - automatically updates when searchTerm or items change
ReactiveUtils.effect(() => {
  displayList(todos.filteredItems);
});
```

---

## Summary

### What `computed()` Does:

1. ✅ Adds calculated properties to reactive state
2. ✅ Automatically tracks dependencies
3. ✅ Caches results for performance
4. ✅ Only recalculates when dependencies change
5. ✅ Acts like a regular property (read-only)
6. ✅ Works with effects and bindings

### When to Use It:

- Derived data (full name from first/last)
- Calculations (totals, averages, percentages)
- Filtering and sorting lists
- Formatting data for display
- Validation checks
- Complex conditions

### The Basic Pattern:

```javascript
const state = ReactiveUtils.state({ /* data */ });

ReactiveUtils.computed(state, {
  computedPropertyName() {
    // Calculate using this.someData
    return calculatedValue;
  }
});

// Use like a regular property
console.log(state.computedPropertyName);
```

**Remember:** Computed properties are like smart formulas in a spreadsheet - they automatically recalculate when their inputs change, and they cache results for performance. Perfect for any value that can be calculated from other data! 🎉