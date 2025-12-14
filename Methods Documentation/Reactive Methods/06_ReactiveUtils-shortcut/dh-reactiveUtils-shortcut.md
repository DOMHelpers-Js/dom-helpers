# Standalone API - Simplified Method Calls

## Overview

The Standalone API module provides simplified function calls without namespace prefixes. Instead of writing `ReactiveUtils.state()`, you can simply write `state()`.

**Load Order:** Load this module **AFTER** all other reactive modules for full API access.

```html
<!-- Load in this order -->
<script src="01_dh-reactive.js"></script>
<script src="02_dh-reactive-array-patch.js"></script>
<script src="03_dh-reactive-collections.js"></script>
<script src="04_dh-reactive-form.js"></script>
<script src="00_dh-reactive-standalone.js"></script> <!-- Load LAST -->
```

---

## Before & After Comparison

### ❌ Before (Verbose)

```javascript
const myState = ReactiveUtils.state({ count: 0 });

ReactiveUtils.effect(() => {
  console.log(myState.count);
});

const todos = ReactiveUtils.collection([]);

ReactiveUtils.patchArray(myState, 'items');

const myForm = ReactiveUtils.form({ name: '' });
```

### ✅ After (Simplified)

```javascript
const myState = state({ count: 0 });

effect(() => {
  console.log(myState.count);
});

const todos = collection([]);

patchArray(myState, 'items');

const myForm = form({ name: '' });
```

**Much cleaner and easier to read!**

---

## Complete API Reference

### Core State Methods

| Standalone | Original | Description |
|------------|----------|-------------|
| `state({})` | `ReactiveUtils.state({})` | Create reactive state |
| `createState({}, bindings)` | `ReactiveUtils.createState({}, bindings)` | Create state with bindings |
| `effect(fn)` | `ReactiveUtils.effect(fn)` | Create reactive effect |
| `batch(fn)` | `ReactiveUtils.batch(fn)` | Batch multiple updates |

### Computed & Watch

| Standalone | Original | Description |
|------------|----------|-------------|
| `computed(state, defs)` | `ReactiveUtils.computed(state, defs)` | Add computed properties |
| `watch(state, defs)` | `ReactiveUtils.watch(state, defs)` | Watch state changes |
| `effects(defs)` | `ReactiveUtils.effects(defs)` | Multiple effects |

### Refs & Collections

| Standalone | Original | Description |
|------------|----------|-------------|
| `ref(value)` | `ReactiveUtils.ref(value)` | Create reactive reference |
| `refs(defs)` | `ReactiveUtils.refs(defs)` | Create multiple refs |
| `collection(items)` | `ReactiveUtils.collection(items)` | Create reactive collection |
| `list(items)` | `ReactiveUtils.list(items)` | Alias for collection |

### Array Patching

| Standalone | Original | Description |
|------------|----------|-------------|
| `patchArray(state, key)` | `ReactiveUtils.patchArray(state, key)` | Patch array for reactivity |

### Forms

| Standalone | Original | Description |
|------------|----------|-------------|
| `form(values, options)` | `ReactiveUtils.form(values, options)` | Create reactive form |
| `createForm(values, options)` | `ReactiveUtils.createForm(values, options)` | Alias for form |
| `validators` | `ReactiveUtils.validators` | Form validators |

### Store & Component

| Standalone | Original | Description |
|------------|----------|-------------|
| `store(state, options)` | `ReactiveUtils.store(state, options)` | Create state store |
| `component(config)` | `ReactiveUtils.component(config)` | Create reactive component |
| `reactive(state)` | `ReactiveUtils.reactive(state)` | Reactive builder pattern |

### Bindings

| Standalone | Original | Description |
|------------|----------|-------------|
| `bindings(defs)` | `ReactiveUtils.bindings(defs)` | Create DOM bindings |
| `updateAll(state, updates)` | `ReactiveUtils.updateAll(state, updates)` | Mixed state + DOM updates |

### Async State

| Standalone | Original | Description |
|------------|----------|-------------|
| `asyncState(initialValue)` | `ReactiveUtils.async(initialValue)` | Create async state |

### Utility Functions

| Standalone | Original | Description |
|------------|----------|-------------|
| `isReactive(value)` | `ReactiveUtils.isReactive(value)` | Check if reactive |
| `toRaw(value)` | `ReactiveUtils.toRaw(value)` | Get raw value |
| `notify(state, key)` | `ReactiveUtils.notify(state, key)` | Manually notify changes |
| `pause()` | `ReactiveUtils.pause()` | Pause reactivity |
| `resume(flush)` | `ReactiveUtils.resume(flush)` | Resume reactivity |
| `untrack(fn)` | `ReactiveUtils.untrack(fn)` | Run without tracking |

### Collections Extended (if loaded)

| Standalone | Original | Description |
|------------|----------|-------------|
| `createCollection(items, computed)` | `Collections.create(items, computed)` | Collection with computed |
| `createFilteredCollection(source, predicate)` | `Collections.createFiltered(source, predicate)` | Filtered collection |

---

## Usage Examples

### Example 1: Simple Counter (Before & After)

**❌ Before:**
```javascript
const counterState = ReactiveUtils.state({ 
  count: 0 
});

ReactiveUtils.computed(counterState, {
  doubled: function() {
    return this.count * 2;
  }
});

ReactiveUtils.effect(() => {
  document.getElementById('count').textContent = counterState.count;
  document.getElementById('doubled').textContent = counterState.doubled;
});

function increment() {
  counterState.count++;
}
```

**✅ After:**
```javascript
const counterState = state({ 
  count: 0 
});

computed(counterState, {
  doubled: function() {
    return this.count * 2;
  }
});

effect(() => {
  document.getElementById('count').textContent = counterState.count;
  document.getElementById('doubled').textContent = counterState.doubled;
});

function increment() {
  counterState.count++;
}
```

---

### Example 2: Todo List (Before & After)

**❌ Before:**
```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false }
]);

ReactiveUtils.computed(todos, {
  remaining: function() {
    return this.items.filter(t => !t.done).length;
  }
});

ReactiveUtils.effect(() => {
  const list = document.getElementById('todo-list');
  list.innerHTML = todos.items
    .map(todo => `
      <li class="${todo.done ? 'done' : ''}">
        ${todo.text}
      </li>
    `)
    .join('');
  
  document.getElementById('remaining').textContent = 
    `${todos.remaining} remaining`;
});

function addTodo(text) {
  todos.add({ id: Date.now(), text, done: false });
}
```

**✅ After:**
```javascript
const todos = collection([
  { id: 1, text: 'Buy milk', done: false }
]);

computed(todos, {
  remaining: function() {
    return this.items.filter(t => !t.done).length;
  }
});

effect(() => {
  const list = document.getElementById('todo-list');
  list.innerHTML = todos.items
    .map(todo => `
      <li class="${todo.done ? 'done' : ''}">
        ${todo.text}
      </li>
    `)
    .join('');
  
  document.getElementById('remaining').textContent = 
    `${todos.remaining} remaining`;
});

function addTodo(text) {
  todos.add({ id: Date.now(), text, done: false });
}
```

---

### Example 3: Form Handling (Before & After)

**❌ Before:**
```javascript
const loginForm = ReactiveUtils.form(
  { email: '', password: '' },
  {
    validators: {
      email: ReactiveUtils.validators.required('Email is required'),
      password: ReactiveUtils.validators.minLength(6, 'Password too short')
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(values)
      });
      return response.json();
    }
  }
);

ReactiveUtils.effect(() => {
  document.getElementById('submit-btn').disabled = 
    !loginForm.isValid || loginForm.isSubmitting;
});
```

**✅ After:**
```javascript
const loginForm = form(
  { email: '', password: '' },
  {
    validators: {
      email: validators.required('Email is required'),
      password: validators.minLength(6, 'Password too short')
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(values)
      });
      return response.json();
    }
  }
);

effect(() => {
  document.getElementById('submit-btn').disabled = 
    !loginForm.isValid || loginForm.isSubmitting;
});
```

---

### Example 4: Shopping Cart (Complete Before & After)

**❌ Before:**
```javascript
const cart = ReactiveUtils.state({
  items: [],
  discount: 0
});

ReactiveUtils.computed(cart, {
  subtotal: function() {
    return this.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0);
  },
  total: function() {
    return this.subtotal * (1 - this.discount / 100);
  },
  itemCount: function() {
    return this.items.reduce((sum, item) => 
      sum + item.quantity, 0);
  }
});

ReactiveUtils.effect(() => {
  document.getElementById('cart-count').textContent = cart.itemCount;
  document.getElementById('subtotal').textContent = 
    `$${cart.subtotal.toFixed(2)}`;
  document.getElementById('total').textContent = 
    `$${cart.total.toFixed(2)}`;
});

function addToCart(product) {
  const existing = cart.items.find(i => i.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.items.push({ ...product, quantity: 1 });
  }
}

function applyDiscount(percent) {
  cart.discount = percent;
}
```

**✅ After:**
```javascript
const cart = state({
  items: [],
  discount: 0
});

computed(cart, {
  subtotal: function() {
    return this.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0);
  },
  total: function() {
    return this.subtotal * (1 - this.discount / 100);
  },
  itemCount: function() {
    return this.items.reduce((sum, item) => 
      sum + item.quantity, 0);
  }
});

effect(() => {
  document.getElementById('cart-count').textContent = cart.itemCount;
  document.getElementById('subtotal').textContent = 
    `$${cart.subtotal.toFixed(2)}`;
  document.getElementById('total').textContent = 
    `$${cart.total.toFixed(2)}`;
});

function addToCart(product) {
  const existing = cart.items.find(i => i.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.items.push({ ...product, quantity: 1 });
  }
}

function applyDiscount(percent) {
  cart.discount = percent;
}
```

---

### Example 5: Dynamic Arrays with Patching

**❌ Before:**
```javascript
const appState = ReactiveUtils.state({
  user: { name: 'John' }
});

// Add arrays dynamically
appState.todos = [];
appState.notes = [];

// Patch them
ReactiveUtils.patchArray(appState, 'todos');
ReactiveUtils.patchArray(appState, 'notes');

// Use them
appState.todos.push({ task: 'Buy milk', done: false });
appState.notes.push({ text: 'Meeting at 3pm' });
```

**✅ After:**
```javascript
const appState = state({
  user: { name: 'John' }
});

// Add arrays dynamically
appState.todos = [];
appState.notes = [];

// Patch them
patchArray(appState, 'todos');
patchArray(appState, 'notes');

// Use them
appState.todos.push({ task: 'Buy milk', done: false });
appState.notes.push({ text: 'Meeting at 3pm' });
```

---

## Real-World Complete Application

### Full E-Commerce Cart with Standalone API

```javascript
// ===== STATE =====
const cart = state({
  items: [],
  discount: 0,
  couponCode: ''
});

// ===== COMPUTED PROPERTIES =====
computed(cart, {
  subtotal: function() {
    return this.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0);
  },
  
  tax: function() {
    return this.subtotal * 0.1; // 10% tax
  },
  
  discountAmount: function() {
    return this.subtotal * (this.discount / 100);
  },
  
  total: function() {
    return this.subtotal + this.tax - this.discountAmount;
  },
  
  itemCount: function() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  },
  
  isEmpty: function() {
    return this.items.length === 0;
  }
});

// ===== ACTIONS =====
function addToCart(product) {
  const existing = cart.items.find(i => i.id === product.id);
  
  if (existing) {
    existing.quantity++;
  } else {
    cart.items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    });
  }
}

function removeFromCart(productId) {
  const index = cart.items.findIndex(i => i.id === productId);
  if (index !== -1) {
    cart.items.splice(index, 1);
  }
}

function updateQuantity(productId, quantity) {
  const item = cart.items.find(i => i.id === productId);
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
    }
  }
}

function applyCoupon(code) {
  const coupons = {
    'SAVE10': 10,
    'SAVE20': 20,
    'SAVE30': 30
  };
  
  if (coupons[code]) {
    cart.discount = coupons[code];
    cart.couponCode = code;
    return true;
  }
  return false;
}

function clearCart() {
  cart.items.length = 0;
  cart.discount = 0;
  cart.couponCode = '';
}

// ===== UI EFFECTS =====
effect(() => {
  // Update cart badge
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = cart.itemCount;
    badge.style.display = cart.isEmpty ? 'none' : 'block';
  }
});

effect(() => {
  // Render cart items
  const container = document.getElementById('cart-items');
  if (!container) return;
  
  if (cart.isEmpty) {
    container.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    return;
  }
  
  container.innerHTML = cart.items
    .map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-details">
          <h3>${item.name}</h3>
          <p class="price">$${item.price.toFixed(2)}</p>
        </div>
        <div class="quantity-controls">
          <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
          <input type="number" 
                 value="${item.quantity}" 
                 min="1"
                 onchange="updateQuantity(${item.id}, parseInt(this.value))">
          <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>
        <div class="item-total">
          $${(item.price * item.quantity).toFixed(2)}
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">
          Remove
        </button>
      </div>
    `)
    .join('');
});

effect(() => {
  // Update cart summary
  const summary = document.getElementById('cart-summary');
  if (!summary) return;
  
  summary.innerHTML = `
    <div class="summary-row">
      <span>Subtotal:</span>
      <span>$${cart.subtotal.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span>Tax (10%):</span>
      <span>$${cart.tax.toFixed(2)}</span>
    </div>
    ${cart.discount > 0 ? `
      <div class="summary-row discount">
        <span>Discount (${cart.discount}%):</span>
        <span>-$${cart.discountAmount.toFixed(2)}</span>
      </div>
    ` : ''}
    <div class="summary-row total">
      <span>Total:</span>
      <span>$${cart.total.toFixed(2)}</span>
    </div>
    <button class="checkout-btn" 
            ${cart.isEmpty ? 'disabled' : ''} 
            onclick="checkout()">
      Checkout
    </button>
  `;
});

// ===== CHECKOUT FORM =====
const checkoutForm = form(
  {
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: ''
  },
  {
    validators: {
      name: validators.required('Name is required'),
      email: validators.combine(
        validators.required('Email is required'),
        validators.email('Invalid email address')
      ),
      address: validators.required('Address is required'),
      city: validators.required('City is required'),
      zipCode: validators.pattern(/^\d{5}$/, 'Invalid ZIP code'),
      cardNumber: validators.pattern(/^\d{16}$/, 'Invalid card number')
    },
    onSubmit: async (values) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Order placed:', {
        customer: values,
        items: cart.items,
        total: cart.total
      });
      
      // Clear cart after successful checkout
      clearCart();
      
      return { success: true, orderId: Date.now() };
    }
  }
);

effect(() => {
  // Update checkout button state
  const btn = document.getElementById('checkout-submit');
  if (btn) {
    btn.disabled = !checkoutForm.isValid || checkoutForm.isSubmitting;
    btn.textContent = checkoutForm.isSubmitting 
      ? 'Processing...' 
      : 'Place Order';
  }
});

// ===== EXPOSED FUNCTIONS =====
async function checkout() {
  const result = await checkoutForm.submit();
  
  if (result.success) {
    alert('Order placed successfully! Order ID: ' + result.result.orderId);
    window.location.href = '/order-confirmation';
  }
}

// Make functions global for onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.applyCoupon = applyCoupon;
window.clearCart = clearCart;
window.checkout = checkout;
```

**Notice:** The entire application uses simplified function calls - no `ReactiveUtils.` prefix anywhere!

---

## Benefits

### ✅ Cleaner Code
```javascript
// Before: 20 characters
ReactiveUtils.state({})

// After: 7 characters  
state({})
```

### ✅ Less Typing
Write code faster without constantly typing `ReactiveUtils.`

### ✅ Better Readability
Code is easier to scan and understand without namespace clutter.

### ✅ Familiar Syntax
Matches popular frameworks like Vue.js (`ref()`, `reactive()`) and React (`useState()`).

### ✅ No Breaking Changes
Original `ReactiveUtils.*` methods still work - this is purely additive!

---

## Common Questions

### Q: Do I have to use the standalone API?

**Answer:** No! It's completely optional. Both styles work:

```javascript
// Both work fine
const state1 = state({});
const state2 = ReactiveUtils.state({});
```

Use whichever you prefer!

---

### Q: What if there's a naming conflict?

**Answer:** The standalone API won't override existing globals. If `state` is already defined, use `ReactiveUtils.state()` instead.

---

### Q: Can I mix both styles?

**Answer:** Yes! You can use both in the same application:

```javascript
// Mix and match as needed
const cart = state({});
const form = ReactiveUtils.form({});
```

---

### Q: Which style should I use?

**Answer:** 

- **Standalone (`state()`)** - Cleaner, modern, less typing
- **Namespaced (`ReactiveUtils.state()`)** - More explicit, no conflicts

**Recommendation:** Use standalone for new projects, namespaced if you have naming conflicts.

---

## Summary

### What Standalone API Provides:

1. ✅ Simplified function calls
2. ✅ No namespace prefixes needed
3. ✅ Cleaner, more readable code
4. ✅ Faster development
5. ✅ Familiar modern syntax
6. ✅ Backward compatible

### Load Order:

```html
<script src="01_dh-reactive.js"></script>
<script src="02_dh-reactive-array-patch.js"></script>
<script src="03_dh-reactive-collections.js"></script>
<script src="04_dh-reactive-form.js"></script>
<script src="00_dh-reactive-standalone.js"></script> <!-- LAST -->
```

### Quick Reference:

| Old | New |
|-----|-----|
| `ReactiveUtils.state()` | `state()` |
| `ReactiveUtils.effect()` | `effect()` |
| `ReactiveUtils.computed()` | `computed()` |
| `ReactiveUtils.collection()` | `collection()` |
| `ReactiveUtils.patchArray()` | `patchArray()` |
| `ReactiveUtils.form()` | `form()` |

**Remember:** Both styles work! Choose what makes your code cleanest and most maintainable. 🎉