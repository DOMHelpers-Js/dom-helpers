# `state.$raw` - Access Your Data Without the Reactive Wrapper

> **You are a senior JavaScript engineer teaching a beginner**

---

## The Problem: When Reactivity Gets in the Way

Imagine you're building an app with reactive state. Every time you touch your data, the reactive system is watching, tracking dependencies, and preparing to update things. **This is usually great!** But sometimes... it gets in the way.

Here's what happens **WITHOUT** `$raw`:

```javascript
const user = state({
  name: 'John',
  age: 25,
  settings: { theme: 'dark', lang: 'en' }
});

// Scenario 1: Sending data to an API
fetch('/api/save', {
  method: 'POST',
  body: JSON.stringify(user) // ❌ Sends a Proxy object, not plain data!
});

// Scenario 2: Reading data in a loop (performance issue)
effect(() => {
  // Every single access triggers dependency tracking
  for (let i = 0; i < user.items.length; i++) {
    console.log(user.items[i]); // Tracking... tracking... tracking...
  }
  // This effect now tracks EVERY item access unnecessarily!
});

// Scenario 3: Checking equality
const backup = user;
console.log(backup === user); // ❌ Comparing Proxy objects, not the data
```

**The Real Issues:**
- JSON.stringify() on reactive state can include Proxy metadata
- Every property access triggers tracking (even when you don't want it)
- External libraries receive Proxy objects instead of plain data
- You can't do simple equality checks
- Performance overhead when you just want to READ data

---

## The Solution: `state.$raw` - Peek Behind the Curtain

`$raw` gives you access to the **original, plain JavaScript object** underneath the reactive wrapper. No tracking, no Proxy, just your data.

```javascript
const user = state({
  name: 'John',
  age: 25,
  settings: { theme: 'dark', lang: 'en' }
});

// ✅ Get the raw, non-reactive object
const rawUser = user.$raw;

console.log(user);     // Proxy { name: 'John', age: 25, ... }
console.log(rawUser);  // { name: 'John', age: 25, ... } (plain object)

// ✅ Send clean data to API
fetch('/api/save', {
  method: 'POST',
  body: JSON.stringify(user.$raw) // Clean JSON, no Proxy!
});

// ✅ Read without tracking
effect(() => {
  const rawItems = user.$raw.items; // No tracking on this access

  for (let i = 0; i < rawItems.length; i++) {
    console.log(rawItems[i]); // No tracking overhead!
  }
});

// ✅ They reference the same data
user.name = 'Jane';
console.log(user.$raw.name); // 'Jane' (same underlying data)
```

**Think of it like this:**
- `user` = Your data wearing a "reactive suit" that watches everything
- `user.$raw` = Your data without the suit, just plain clothes

---

## How It Works Under the Hood

When you create reactive state, the system wraps your object in a Proxy:

```
Your data:  { name: 'John', age: 25 }
              ↓
state() wraps it in a Proxy
              ↓
Reactive:   Proxy -> { name: 'John', age: 25 }
              ↑              ↓
          watches        actual data
```

When you access `state.$raw`:
1. The reactive system says "oh, they want the raw data"
2. It returns a reference to the **original object** (not the Proxy)
3. **No dependency tracking happens**
4. You get the same data, just without the reactive wrapper

**Important:** The raw object and reactive object share the same data in memory! Changes to one affect the other.

---

## When to Use `$raw`

### ✅ Use Case 1: Sending Data to APIs

APIs don't need reactive Proxies - they need plain JSON.

```javascript
const formData = state({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'secret123',
  confirmPassword: 'secret123' // Only needed for validation
});

async function submitForm() {
  // Get raw data (no Proxy)
  const raw = formData.$raw;

  // Send only what the API needs
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: raw.username,
      email: raw.email,
      password: raw.password
      // confirmPassword is NOT sent (validation-only field)
    })
  });

  if (response.ok) {
    console.log('Registration successful!');
  }
}
```

**Why this works:** APIs expect plain objects. Sending `user.$raw` ensures clean JSON without any reactive metadata.

---

### ✅ Use Case 2: Saving to localStorage

localStorage only stores strings. You need plain objects for JSON.stringify().

```javascript
const appSettings = state({
  theme: 'dark',
  fontSize: 16,
  notifications: true,
  lastSaved: null
});

function saveSettings() {
  // Get raw object for serialization
  const raw = appSettings.$raw;

  // Convert to JSON (clean, no Proxy)
  const json = JSON.stringify(raw, null, 2);

  // Save to localStorage
  localStorage.setItem('settings', json);
  console.log('Settings saved!');
}

function loadSettings() {
  const json = localStorage.getItem('settings');
  if (json) {
    const loaded = JSON.parse(json);

    // Update reactive state with loaded data
    Object.assign(appSettings, loaded);
    console.log('Settings loaded!');
  }
}

// Usage
appSettings.theme = 'light';
saveSettings(); // Saves clean JSON
```

**Why this works:** JSON.stringify() works best with plain objects. Using `$raw` ensures you get clean JSON without Proxy artifacts.

---

### ✅ Use Case 3: Passing Data to External Libraries

Libraries like Chart.js, D3, or game engines expect plain objects, not Proxies.

```javascript
const chartData = state({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [{
    label: 'Sales',
    data: [12, 19, 3, 5, 2]
  }]
});

function renderChart() {
  // Chart.js expects plain objects, not Proxies
  const raw = chartData.$raw;

  const chart = new Chart(document.getElementById('myChart'), {
    type: 'line',
    data: raw, // ✅ Pass raw data
    options: {
      responsive: true
    }
  });

  return chart;
}

// Update chart data
function updateSales(newData) {
  chartData.datasets[0].data = newData;

  // Re-render with new data
  renderChart();
}
```

**Why this works:** External libraries don't know about your reactive system. They need plain JavaScript objects they can work with directly.

---

### ✅ Use Case 4: Performance-Critical Loops

When processing thousands of items, avoid tracking overhead.

```javascript
const gameState = state({
  entities: Array(10000).fill(null).map((_, i) => ({
    id: i,
    x: Math.random() * 800,
    y: Math.random() * 600,
    velocity: { x: 0, y: 0 },
    health: 100
  }))
});

function updateGameLoop() {
  // Get raw array (no tracking per-item)
  const rawEntities = gameState.$raw.entities;

  // Process 10,000 entities without tracking overhead
  for (let i = 0; i < rawEntities.length; i++) {
    const entity = rawEntities[i];

    // Update physics (no reactivity overhead on each property access)
    entity.x += entity.velocity.x;
    entity.y += entity.velocity.y;

    // Bounce off edges
    if (entity.x < 0 || entity.x > 800) entity.velocity.x *= -1;
    if (entity.y < 0 || entity.y > 600) entity.velocity.y *= -1;
  }

  // After ALL updates, manually notify reactivity once
  gameState.$notify('entities');
}

// Run at 60 FPS
setInterval(updateGameLoop, 1000 / 60);
```

**Why this works:** Accessing 10,000 items through reactive state would trigger 10,000+ dependency trackings. Using `$raw` eliminates this overhead, then we manually notify once at the end.

---

### ✅ Use Case 5: Deep Comparisons and Snapshots

When you need to compare state or create snapshots.

```javascript
const editor = state({
  content: '',
  cursor: 0,
  lastSaved: ''
});

// Save a snapshot for "has changes?" detection
let savedSnapshot = null;

function saveSnapshot() {
  // Deep clone the raw object (no Proxy)
  savedSnapshot = JSON.parse(JSON.stringify(editor.$raw));
  console.log('Snapshot saved');
}

function hasUnsavedChanges() {
  // Compare current raw state with snapshot
  const current = JSON.stringify(editor.$raw);
  const saved = JSON.stringify(savedSnapshot);

  return current !== saved;
}

function promptIfUnsaved() {
  if (hasUnsavedChanges()) {
    const shouldSave = confirm('You have unsaved changes. Save before leaving?');
    if (shouldSave) {
      saveContent();
    }
  }
}

// Usage
saveSnapshot();            // Save initial state
editor.content = 'Hello';  // Make changes
promptIfUnsaved();         // Detects changes!
```

**Why this works:** JSON comparison works on plain objects. Using `$raw` lets you serialize and compare without Proxy interference.

---

## How `$raw` Interacts With Other Features

### With `effect()` - Bypasses Dependency Tracking

```javascript
const data = state({ items: [1, 2, 3], count: 0 });

effect(() => {
  // This tracks 'count'
  console.log('Count:', data.count);

  // This does NOT track 'items'
  console.log('Items:', data.$raw.items);
});

data.count = 10;  // ✅ Effect re-runs
data.items.push(4); // ❌ Effect does NOT re-run
```

**Lesson:** Accessing `$raw` inside an effect means "I want to read this, but don't track it as a dependency."

---

### With `computed()` - Use Carefully

```javascript
const cart = state({
  items: [],
  tax: 0.1
});

// ❌ BAD: computed won't track items
const badTotal = computed(() => {
  const raw = cart.$raw.items; // Not tracked!
  return raw.reduce((sum, item) => sum + item.price, 0);
});

// ✅ GOOD: access reactively
const goodTotal = computed(() => {
  return cart.items.reduce((sum, item) => sum + item.price, 0);
});

cart.items.push({ price: 10 }); // badTotal won't update, goodTotal will
```

**Lesson:** Don't use `$raw` in computed/watch unless you specifically want to avoid tracking.

---

### With Arrays - Same Patched Array

```javascript
const list = state({ items: [1, 2, 3] });

// Both reference the SAME array
console.log(list.items === list.$raw.items); // true

// Push to reactive
list.items.push(4);

// Raw sees the change
console.log(list.$raw.items); // [1, 2, 3, 4]

// Push to raw (won't trigger reactivity!)
list.$raw.items.push(5);

// Need to manually notify
list.$notify('items');
```

**Lesson:** `$raw.items` is the same array, but changes to it don't trigger reactivity automatically.

---

## When NOT to Use `$raw`

### ❌ Don't Modify Raw Objects Directly

```javascript
const user = state({ name: 'John', age: 25 });

// ❌ WRONG: Modify raw without notifying
user.$raw.age = 30;
// Reactivity doesn't know about this change!

// ✅ RIGHT: Modify through reactive state
user.age = 30;
// Reactivity tracks this automatically

// ⚠️ OKAY: Modify raw, then notify manually
user.$raw.age = 30;
user.$notify('age');
```

**Why:** The reactive system only watches changes through the Proxy. Direct raw modifications are invisible.

---

### ❌ Don't Use in Effects for Data You Want to Track

```javascript
const app = state({ count: 0, message: '' });

effect(() => {
  // ❌ WRONG: Won't track count
  console.log(app.$raw.count);
});

app.count = 10; // Effect won't re-run!

// ✅ RIGHT: Access reactively
effect(() => {
  console.log(app.count);
});

app.count = 10; // Effect re-runs!
```

**Why:** Using `$raw` inside effects defeats the purpose - you're explicitly saying "don't track this."

---

### ❌ Don't Store Raw References Long-Term

```javascript
// ❌ WRONG: Storing raw reference
const rawItems = state.$raw.items;
rawItems.push(1); // Modifies without tracking!

// ✅ RIGHT: Always access through $raw when needed
state.$raw.items.push(1);
state.$notify('items');
```

**Why:** Storing raw references makes it easy to accidentally modify data without triggering reactivity.

---

## Comparison with Related Methods

| Method | Purpose | Tracks Dependencies? |
|--------|---------|---------------------|
| `state.property` | Normal reactive access | ✅ Yes |
| `state.$raw.property` | Access without tracking | ❌ No |
| `toRaw(state)` | Get raw from any reactive object | ❌ No |
| `untrack(() => state.property)` | Read reactively but don't track | ❌ No |

**When to use which:**
- **Normal access** - 99% of the time
- **`$raw`** - APIs, localStorage, external libraries, performance loops
- **`toRaw()`** - When you don't know if something is reactive
- **`untrack()`** - When you want to read inside an effect without tracking

---

## Quick Mental Model

```javascript
const user = state({ name: 'John' });

// Think of it like this:
user       // = Your data wearing a "reactive suit" 🦸‍♂️
user.$raw  // = Your data in normal clothes 👔

// They're the same person (same data):
user.name = 'Jane';
console.log(user.$raw.name); // 'Jane'

// But the suit (Proxy) is what makes reactivity work:
effect(() => console.log(user.name));      // Tracks changes ✅
effect(() => console.log(user.$raw.name)); // Doesn't track ❌
```

---

## Summary

**`state.$raw` gives you the plain JavaScript object underneath the reactive wrapper - no tracking, no Proxy.**

**When to use it:**
- ✅ Sending data to APIs (JSON.stringify)
- ✅ Saving to localStorage
- ✅ Passing to external libraries (Chart.js, etc.)
- ✅ Performance-critical loops
- ✅ Deep comparisons and snapshots

**When NOT to use it:**
- ❌ Don't modify raw objects directly (reactivity won't see it)
- ❌ Don't use in effects for data you want to track
- ❌ Don't store raw references long-term

**One-sentence summary:**
Use `$raw` when you need your data as a plain object for APIs, storage, or performance - but remember, changes to raw data don't trigger reactivity! 🎯

---

➡️ **Next:** Learn about [`$update()`]($update.md) for combined state+DOM updates, or [`$set()`]($set.md) for functional updates!
