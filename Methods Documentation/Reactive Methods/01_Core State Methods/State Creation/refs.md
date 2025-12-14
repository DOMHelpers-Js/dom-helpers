# Understanding `refs()` - A Beginner's Guide

## What is `refs()`?

`refs()` is a **convenience function** that creates **multiple refs at once** from a single object definition. Instead of creating refs one by one, you define them all together and get back an object containing all your refs.

Think of it as a **bulk creator** for refs - one function call to make many reactive single values.

---

## Why Does `refs()` Exist?

### The Problem: Creating Many Refs is Repetitive

When you need multiple refs, creating them one by one is tedious:

```javascript
// ❌ Repetitive and verbose
const firstName = ReactiveUtils.ref('');
const lastName = ReactiveUtils.ref('');
const email = ReactiveUtils.ref('');
const age = ReactiveUtils.ref(0);
const isActive = ReactiveUtils.ref(false);
const role = ReactiveUtils.ref('user');
```

**Problems:**
- Lots of typing
- Repetitive code pattern
- Hard to see all your reactive values at a glance
- Easy to make mistakes
- Boring to write!

### The Solution: `refs()` Creates Them All at Once

```javascript
// ✅ Clean and organized
const { firstName, lastName, email, age, isActive, role } = ReactiveUtils.refs({
  firstName: '',
  lastName: '',
  email: '',
  age: 0,
  isActive: false,
  role: 'user'
});
```

**Benefits:**
- Write less code
- See all your refs in one place
- Clear initial values
- Less chance of errors
- Much faster to write

---

## How `refs()` Works

### What You Give It

You give `refs()` a **plain object** with property names and initial values:

```javascript
ReactiveUtils.refs({
  propertyName1: initialValue1,
  propertyName2: initialValue2,
  propertyName3: initialValue3
});
```

### What You Get Back

You get back an **object containing refs**:

```javascript
const myRefs = ReactiveUtils.refs({
  count: 0,
  name: 'John',
  active: true
});

// myRefs is:
// {
//   count: ref(0),
//   name: ref('John'),
//   active: ref(true)
// }
```

### Each Property Becomes a Separate Ref

```javascript
const myRefs = ReactiveUtils.refs({
  count: 0,
  message: 'Hello'
});

// Access like this:
console.log(myRefs.count.value);    // 0
console.log(myRefs.message.value);  // "Hello"

// Modify like this:
myRefs.count.value = 10;
myRefs.message.value = 'Hi';
```

---

## Basic Usage

### Creating Refs with `refs()`

```javascript
const myRefs = ReactiveUtils.refs({
  count: 0,
  name: '',
  isActive: false
});

// Each property is now a ref
console.log(myRefs.count.value);    // 0
console.log(myRefs.name.value);     // ""
console.log(myRefs.isActive.value); // false
```

### Using Destructuring (Most Common)

Most people use destructuring to get individual refs:

```javascript
const { count, name, isActive } = ReactiveUtils.refs({
  count: 0,
  name: '',
  isActive: false
});

// Now you have three separate ref variables
console.log(count.value);    // 0
console.log(name.value);     // ""
console.log(isActive.value); // false

count.value = 10;
name.value = 'John';
isActive.value = true;
```

### Without Destructuring (Keep Grouped)

Sometimes you want to keep them grouped:

```javascript
const player = ReactiveUtils.refs({
  x: 0,
  y: 0,
  health: 100,
  score: 0
});

// Access with dot notation
player.x.value = 10;
player.y.value = 20;
player.health.value -= 5;

console.log(`Position: (${player.x.value}, ${player.y.value})`);
console.log(`Health: ${player.health.value}`);
```

---

## The Equivalence

`refs()` is just a shortcut. These are **exactly the same**:

### Using `ref()` Individually

```javascript
const count = ReactiveUtils.ref(0);
const message = ReactiveUtils.ref('Hello');
const active = ReactiveUtils.ref(true);
```

### Using `refs()` Together

```javascript
const { count, message, active } = ReactiveUtils.refs({
  count: 0,
  message: 'Hello',
  active: true
});
```

**They produce the exact same refs!** Use whichever style you prefer.

---

## Practical Examples

### Example 1: Form Fields

```javascript
const { email, password, rememberMe } = ReactiveUtils.refs({
  email: '',
  password: '',
  rememberMe: false
});

// Bind to inputs
document.getElementById('email-input').oninput = (e) => {
  email.value = e.target.value;
};

document.getElementById('password-input').oninput = (e) => {
  password.value = e.target.value;
};

document.getElementById('remember-checkbox').onchange = (e) => {
  rememberMe.value = e.target.checked;
};

// Validate automatically
ReactiveUtils.effect(() => {
  const isValid = email.value.includes('@') && password.value.length >= 8;
  document.getElementById('submit-btn').disabled = !isValid;
});

// Submit handler
document.getElementById('login-form').onsubmit = (e) => {
  e.preventDefault();
  
  console.log({
    email: email.value,
    password: password.value,
    rememberMe: rememberMe.value
  });
};
```

### Example 2: Game Character Stats

```javascript
const player = ReactiveUtils.refs({
  x: 0,
  y: 0,
  health: 100,
  maxHealth: 100,
  mana: 50,
  maxMana: 50,
  level: 1,
  experience: 0,
  gold: 0
});

// Display stats automatically
ReactiveUtils.effect(() => {
  document.getElementById('health-bar').style.width = 
    `${(player.health.value / player.maxHealth.value) * 100}%`;
  
  document.getElementById('health-text').textContent = 
    `${player.health.value}/${player.maxHealth.value}`;
});

ReactiveUtils.effect(() => {
  document.getElementById('mana-bar').style.width = 
    `${(player.mana.value / player.maxMana.value) * 100}%`;
});

ReactiveUtils.effect(() => {
  document.getElementById('level').textContent = `Level ${player.level.value}`;
  document.getElementById('gold').textContent = `${player.gold.value} gold`;
});

// Game functions
function takeDamage(amount) {
  player.health.value = Math.max(0, player.health.value - amount);
  
  if (player.health.value === 0) {
    gameOver();
  }
}

function heal(amount) {
  player.health.value = Math.min(
    player.maxHealth.value, 
    player.health.value + amount
  );
}

function gainExperience(amount) {
  player.experience.value += amount;
  
  // Level up at 100 XP
  if (player.experience.value >= 100) {
    player.level.value++;
    player.experience.value = 0;
    player.maxHealth.value += 10;
    player.health.value = player.maxHealth.value;
  }
}

function move(dx, dy) {
  player.x.value += dx;
  player.y.value += dy;
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowUp':    move(0, -1); break;
    case 'ArrowDown':  move(0, 1); break;
    case 'ArrowLeft':  move(-1, 0); break;
    case 'ArrowRight': move(1, 0); break;
  }
});
```

### Example 3: Settings Panel

```javascript
const settings = ReactiveUtils.refs({
  volume: 50,
  brightness: 75,
  soundEnabled: true,
  musicEnabled: true,
  notificationsEnabled: true,
  language: 'en',
  autoSave: false,
  difficulty: 'normal'
});

// Bind sliders
document.getElementById('volume-slider').oninput = (e) => {
  settings.volume.value = parseInt(e.target.value);
};

document.getElementById('brightness-slider').oninput = (e) => {
  settings.brightness.value = parseInt(e.target.value);
};

// Bind checkboxes
document.getElementById('sound-toggle').onchange = (e) => {
  settings.soundEnabled.value = e.target.checked;
};

document.getElementById('music-toggle').onchange = (e) => {
  settings.musicEnabled.value = e.target.checked;
};

// Apply settings automatically
ReactiveUtils.effect(() => {
  document.getElementById('volume-display').textContent = `${settings.volume.value}%`;
  
  // Apply to audio
  if (settings.soundEnabled.value) {
    setGameVolume(settings.volume.value);
  } else {
    setGameVolume(0);
  }
});

ReactiveUtils.effect(() => {
  document.body.style.filter = `brightness(${settings.brightness.value}%)`;
});

ReactiveUtils.effect(() => {
  const music = document.getElementById('background-music');
  if (music) {
    music.muted = !settings.musicEnabled.value;
  }
});

// Save to localStorage automatically
ReactiveUtils.effect(() => {
  localStorage.setItem('settings', JSON.stringify({
    volume: settings.volume.value,
    brightness: settings.brightness.value,
    soundEnabled: settings.soundEnabled.value,
    musicEnabled: settings.musicEnabled.value,
    notificationsEnabled: settings.notificationsEnabled.value,
    language: settings.language.value,
    autoSave: settings.autoSave.value,
    difficulty: settings.difficulty.value
  }));
});

// Load from localStorage
function loadSettings() {
  const saved = localStorage.getItem('settings');
  if (saved) {
    const data = JSON.parse(saved);
    settings.volume.value = data.volume;
    settings.brightness.value = data.brightness;
    settings.soundEnabled.value = data.soundEnabled;
    settings.musicEnabled.value = data.musicEnabled;
    settings.notificationsEnabled.value = data.notificationsEnabled;
    settings.language.value = data.language;
    settings.autoSave.value = data.autoSave;
    settings.difficulty.value = data.difficulty;
  }
}

loadSettings();
```

### Example 4: Timer/Stopwatch

```javascript
const { seconds, minutes, hours, isRunning, isPaused } = ReactiveUtils.refs({
  seconds: 0,
  minutes: 0,
  hours: 0,
  isRunning: false,
  isPaused: false
});

let intervalId = null;

// Display time
ReactiveUtils.effect(() => {
  const h = String(hours.value).padStart(2, '0');
  const m = String(minutes.value).padStart(2, '0');
  const s = String(seconds.value).padStart(2, '0');
  
  document.getElementById('timer-display').textContent = `${h}:${m}:${s}`;
});

// Update button states
ReactiveUtils.effect(() => {
  document.getElementById('start-btn').disabled = isRunning.value;
  document.getElementById('pause-btn').disabled = !isRunning.value;
  document.getElementById('reset-btn').disabled = isRunning.value;
});

function start() {
  isRunning.value = true;
  isPaused.value = false;
  
  intervalId = setInterval(() => {
    seconds.value++;
    
    if (seconds.value >= 60) {
      seconds.value = 0;
      minutes.value++;
    }
    
    if (minutes.value >= 60) {
      minutes.value = 0;
      hours.value++;
    }
  }, 1000);
}

function pause() {
  isRunning.value = false;
  isPaused.value = true;
  clearInterval(intervalId);
}

function reset() {
  isRunning.value = false;
  isPaused.value = false;
  seconds.value = 0;
  minutes.value = 0;
  hours.value = 0;
  clearInterval(intervalId);
}

document.getElementById('start-btn').onclick = start;
document.getElementById('pause-btn').onclick = pause;
document.getElementById('reset-btn').onclick = reset;
```

### Example 5: Shopping Cart Summary

```javascript
const cart = ReactiveUtils.refs({
  itemCount: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  discount: 0,
  total: 0
});

// Constants
const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;

// Calculate total automatically
ReactiveUtils.effect(() => {
  cart.total.value = 
    cart.subtotal.value + 
    cart.tax.value + 
    cart.shipping.value - 
    cart.discount.value;
});

// Calculate tax automatically
ReactiveUtils.effect(() => {
  cart.tax.value = cart.subtotal.value * TAX_RATE;
});

// Calculate shipping automatically
ReactiveUtils.effect(() => {
  cart.shipping.value = 
    cart.subtotal.value >= FREE_SHIPPING_THRESHOLD 
      ? 0 
      : SHIPPING_COST;
});

// Display automatically
ReactiveUtils.effect(() => {
  document.getElementById('item-count').textContent = cart.itemCount.value;
  document.getElementById('subtotal').textContent = `$${cart.subtotal.value.toFixed(2)}`;
  document.getElementById('tax').textContent = `$${cart.tax.value.toFixed(2)}`;
  document.getElementById('shipping').textContent = 
    cart.shipping.value === 0 
      ? 'FREE' 
      : `$${cart.shipping.value.toFixed(2)}`;
  document.getElementById('discount').textContent = `$${cart.discount.value.toFixed(2)}`;
  document.getElementById('total').textContent = `$${cart.total.value.toFixed(2)}`;
});

// Free shipping progress
ReactiveUtils.effect(() => {
  const remaining = FREE_SHIPPING_THRESHOLD - cart.subtotal.value;
  const message = document.getElementById('shipping-message');
  
  if (remaining > 0) {
    message.textContent = `Add $${remaining.toFixed(2)} more for free shipping!`;
    message.className = 'info';
  } else {
    message.textContent = 'You qualify for free shipping! 🎉';
    message.className = 'success';
  }
});

// Functions to update cart
function updateCart(items) {
  cart.itemCount.value = items.length;
  cart.subtotal.value = items.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );
}

function applyDiscount(amount) {
  cart.discount.value = amount;
}

function applyCoupon(code) {
  if (code === 'SAVE10') {
    cart.discount.value = cart.subtotal.value * 0.1;
  } else if (code === 'FREESHIP') {
    cart.shipping.value = 0;
  }
}
```

### Example 6: Live Search with Filters

```javascript
const search = ReactiveUtils.refs({
  query: '',
  category: 'all',
  minPrice: 0,
  maxPrice: 1000,
  sortBy: 'relevance',
  isSearching: false,
  resultCount: 0
});

// Input bindings
document.getElementById('search-input').oninput = (e) => {
  search.query.value = e.target.value;
};

document.getElementById('category-select').onchange = (e) => {
  search.category.value = e.target.value;
};

document.getElementById('min-price').oninput = (e) => {
  search.minPrice.value = parseInt(e.target.value) || 0;
};

document.getElementById('max-price').oninput = (e) => {
  search.maxPrice.value = parseInt(e.target.value) || 1000;
};

document.getElementById('sort-select').onchange = (e) => {
  search.sortBy.value = e.target.value;
};

// Debounced search
let searchTimeout;
ReactiveUtils.effect(() => {
  clearTimeout(searchTimeout);
  
  // Build search params
  const params = {
    query: search.query.value,
    category: search.category.value,
    minPrice: search.minPrice.value,
    maxPrice: search.maxPrice.value,
    sortBy: search.sortBy.value
  };
  
  if (!params.query) {
    search.resultCount.value = 0;
    return;
  }
  
  search.isSearching.value = true;
  
  searchTimeout = setTimeout(async () => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/search?${queryString}`);
      const data = await response.json();
      
      search.resultCount.value = data.results.length;
      displayResults(data.results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      search.isSearching.value = false;
    }
  }, 300);
});

// Display search status
ReactiveUtils.effect(() => {
  const status = document.getElementById('search-status');
  
  if (search.isSearching.value) {
    status.textContent = 'Searching...';
  } else if (search.resultCount.value === 0 && search.query.value) {
    status.textContent = 'No results found';
  } else if (search.resultCount.value > 0) {
    status.textContent = `Found ${search.resultCount.value} result${search.resultCount.value !== 1 ? 's' : ''}`;
  } else {
    status.textContent = '';
  }
});
```

### Example 7: Drawing Canvas State

```javascript
const canvas = ReactiveUtils.refs({
  x: 0,
  y: 0,
  isDrawing: false,
  brushSize: 5,
  brushColor: '#000000',
  opacity: 1.0,
  tool: 'brush', // 'brush', 'eraser', 'line', 'circle'
  canUndo: false,
  canRedo: false
});

// Canvas element
const ctx = document.getElementById('canvas').getContext('2d');

// Mouse events
document.getElementById('canvas').onmousedown = (e) => {
  canvas.isDrawing.value = true;
  canvas.x.value = e.offsetX;
  canvas.y.value = e.offsetY;
};

document.getElementById('canvas').onmouseup = () => {
  canvas.isDrawing.value = false;
};

document.getElementById('canvas').onmousemove = (e) => {
  if (canvas.isDrawing.value) {
    drawLine(canvas.x.value, canvas.y.value, e.offsetX, e.offsetY);
    canvas.x.value = e.offsetX;
    canvas.y.value = e.offsetY;
  }
};

// Tool controls
document.getElementById('brush-size').oninput = (e) => {
  canvas.brushSize.value = parseInt(e.target.value);
};

document.getElementById('color-picker').oninput = (e) => {
  canvas.brushColor.value = e.target.value;
};

document.getElementById('opacity-slider').oninput = (e) => {
  canvas.opacity.value = parseFloat(e.target.value);
};

// Update cursor
ReactiveUtils.effect(() => {
  const canvasEl = document.getElementById('canvas');
  canvasEl.style.cursor = canvas.isDrawing.value ? 'crosshair' : 'default';
});

// Display current settings
ReactiveUtils.effect(() => {
  document.getElementById('brush-size-display').textContent = canvas.brushSize.value;
  document.getElementById('opacity-display').textContent = 
    `${Math.round(canvas.opacity.value * 100)}%`;
});

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = canvas.brushColor.value;
  ctx.lineWidth = canvas.brushSize.value;
  ctx.globalAlpha = canvas.opacity.value;
  ctx.lineCap = 'round';
  ctx.stroke();
}
```

---

## Destructuring vs Not Destructuring

### With Destructuring (Separate Variables)

```javascript
const { count, name, active } = ReactiveUtils.refs({
  count: 0,
  name: '',
  active: false
});

// Use as separate variables
count.value = 10;
name.value = 'John';
active.value = true;
```

**Use when:**
- Refs are independent
- You want simpler variable names
- Using them in different parts of code

### Without Destructuring (Grouped)

```javascript
const player = ReactiveUtils.refs({
  x: 0,
  y: 0,
  health: 100
});

// Use as grouped object
player.x.value = 10;
player.y.value = 20;
player.health.value = 80;
```

**Use when:**
- Refs are related/grouped
- You want namespace organization
- Passing to functions as a group

---

## Common Patterns

### Pattern 1: Form State

```javascript
const form = ReactiveUtils.refs({
  email: '',
  password: '',
  confirmPassword: '',
  agree: false
});
```

### Pattern 2: UI State

```javascript
const ui = ReactiveUtils.refs({
  sidebarOpen: false,
  modalOpen: false,
  loading: false,
  theme: 'light'
});
```

### Pattern 3: Game State

```javascript
const game = ReactiveUtils.refs({
  score: 0,
  lives: 3,
  level: 1,
  paused: false,
  gameOver: false
});
```

### Pattern 4: Position/Dimensions

```javascript
const element = ReactiveUtils.refs({
  x: 0,
  y: 0,
  width: 100,
  height: 100
});
```

### Pattern 5: Media Player

```javascript
const player = ReactiveUtils.refs({
  currentTime: 0,
  duration: 0,
  volume: 50,
  playing: false,
  muted: false
});
```

---

## Common Beginner Questions

### Q: What's the difference between `ref()` and `refs()`?

**Answer:** They create the same thing - `refs()` is just a convenience for creating multiple refs:

```javascript
// These are equivalent:

// Using ref() multiple times
const count = ReactiveUtils.ref(0);
const name = ReactiveUtils.ref('');
const active = ReactiveUtils.ref(false);

// Using refs() once
const { count, name, active } = ReactiveUtils.refs({
  count: 0,
  name: '',
  active: false
});

// Both produce identical refs!
```

### Q: Do I always need to destructure?

**Answer:** No! You can keep them grouped:

```javascript
// Without destructuring
const player = ReactiveUtils.refs({
  x: 0,
  y: 0
});

player.x.value = 10;
player.y.value = 20;

// With destructuring
const { x, y } = ReactiveUtils.refs({
  x: 0,
  y: 0
});

x.value = 10;
y.value = 20;

// Both work - choose what makes sense!
```

### Q: Can I add more refs later?

**Answer:** No, `refs()` creates refs at creation time. If you need more, create them separately:

```javascript
const { count, name } = ReactiveUtils.refs({
  count: 0,
  name: ''
});

// Later, need another ref
const age = ReactiveUtils.ref(0);

// Now you have count, name, and age
```

### Q: Should I use `refs()` or `state()` for related data?

**Answer:**

Use `refs()` when you have **multiple independent single values**:

```javascript
// ✅ Good for refs() - independent values
const { width, height, x, y } = ReactiveUtils.refs({
  width: 100,
  height: 50,
  x: 0,
  y: 0
});
```

Use `state()` when you have **related properties in an object**:

```javascript
// ✅ Better with state() - related object properties
const user = ReactiveUtils.state({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  address: {
    street: '123 Main St',
    city: 'Springfield'
  }
});
```

**Key difference:**
- `refs()` - Each property is a **separate ref** (access with `.value`)
- `state()` - Properties are **reactive object properties** (access directly)

### Q: Can I watch individual refs created with `refs()`?

**Answer:** Yes! Each ref can be watched individually:

```javascript
const { count, name } = ReactiveUtils.refs({
  count: 0,
  name: ''
});

// Watch count
count.$watch('value', (newVal, oldVal) => {
  console.log(`Count: ${oldVal} → ${newVal}`);
});

// Watch name
name.$watch('value', (newVal, oldVal) => {
  console.log(`Name: ${oldVal} → ${newVal}`);
});

count.value = 5;
// Logs: "Count: 0 → 5"

name.value = 'John';
// Logs: "Name:  → John"
```

---

## Tips for Beginners

### 1. Use `refs()` for Multiple Related Singles

```javascript
// ✅ Good - multiple single values
const { width, height, x, y } = ReactiveUtils.refs({
  width: 100,
  height: 50,
  x: 0,
  y: 0
});

// ❌ Overkill - use state() instead
const config = ReactiveUtils.refs({
  user: { name: 'John', age: 25 },
  settings: { theme: 'dark', lang: 'en' }
});
```

### 2. Group Related Refs

```javascript
// ✅ Keep related refs grouped
const player = ReactiveUtils.refs({
  x: 0,
  y: 0,
  health: 100,
  mana: 50
});

// ❌ Don't scatter unrelated refs
const misc = ReactiveUtils.refs({
  playerX: 0,
  userName: '',
  volume: 50,
  themeColor: '#000'
});
```

### 3. Use Descriptive Names

```javascript
// ❌ Unclear
const { a, b, c } = ReactiveUtils.refs({
  a: 0,
  b: '',
  c: false
});

// ✅ Clear
const { retryCount, errorMessage, isLoading } = ReactiveUtils.refs({
  retryCount: 0,
  errorMessage: '',
  isLoading: false
});
```

### 4. Remember `.value` on Every Ref

```javascript
const { count, name } = ReactiveUtils.refs({
  count: 0,
  name: ''
});

// ❌ Wrong - missing .value
count = 5;
name = 'John';

// ✅ Correct - with .value
count.value = 5;
name.value = 'John';
```

### 5. Choose the Right Tool

```javascript
// ✅ Single value → ref()
const count = ReactiveUtils.ref(0);

// ✅ Multiple singles → refs()
const { x, y, z } = ReactiveUtils.refs({ x: 0, y: 0, z: 0 });

// ✅ Object with properties → state()
const user = ReactiveUtils.state({ name: 'John', age: 25 });

// ✅ List of items → collection()
const todos = ReactiveUtils.collection([]);
```

---

## Summary

### What `refs()` Does:

1. ✅ Creates multiple refs from one object definition
2. ✅ Saves you from repetitive code
3. ✅ Organizes related single values
4. ✅ Each property becomes a separate ref
5. ✅ Can be destructured or kept grouped
6. ✅ Perfect for forms, settings, coordinates, etc.

### The Basic Pattern:

```javascript
// Create multiple refs at once
const { ref1, ref2, ref3 } = ReactiveUtils.refs({
  ref1: initialValue1,
  ref2: initialValue2,
  ref3: initialValue3
});

// Each is a separate ref with .value
ref1.value = newValue;
ref2.value = anotherValue;

// Use in effects
ReactiveUtils.effect(() => {
  console.log(ref1.value, ref2.value);
});
```

### When to Use `refs()`:

- ✅ Multiple related single values
- ✅ Form fields (email, password, etc.)
- ✅ Game state (score, lives, level)
- ✅ Coordinates (x, y, z)
- ✅ Settings/preferences
- ✅ Any time you'd create 3+ refs

### When NOT to Use `refs()`:

- ❌ Single value (use `ref()`)
- ❌ Objects with nested structure (use `state()`)
- ❌ Arrays of items (use `collection()`)
- ❌ Complex forms (use `form()`)

---

**Remember:** `refs()` is a **convenience tool** for creating multiple refs at once. It's perfect when you have several related single values that each need their own reactive container. Just remember that each one is still a ref, so you always need `.value`! 🎉