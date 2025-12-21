# `state.$notify()` - Manually Trigger Reactivity for a Property

> **You are a senior JavaScript engineer teaching a beginner**

---

## The Problem: Some Array Operations Don't Trigger Reactivity

Imagine you have a reactive array of numbers. You want to sort it. You call `array.sort()` and... nothing happens! Effects don't re-run, the DOM doesn't update. Why? Because `sort()` modifies the array **in-place** without creating a new array, so reactivity doesn't detect it!

Here's what happens **WITHOUT** `$notify()`:

```javascript
const list = state({
  items: [5, 2, 8, 1, 9]
});

effect(() => {
  console.log('Items:', list.items.join(', '));
});

// Initial: Logs "Items: 5, 2, 8, 1, 9"

// Sort the array
list.items.sort((a, b) => a - b);

// Effect doesn't re-run! Still shows unsorted!
// Why? sort() modifies in-place, reactivity doesn't see it
```

**The Real Issues:**
- Some array methods modify in-place (`sort`, `reverse`)
- Direct index assignment doesn't always trigger (`arr[0] = value`)
- External libraries modify your data without reactivity knowing
- Manual data manipulation bypasses the reactive system

---

## The Solution: `$notify()` - Tell Reactivity "Hey, This Changed!"

`$notify()` manually triggers reactivity for a specific property. It's like saying "I changed this property myself, please notify all the watchers/effects!"

```javascript
const list = state({
  items: [5, 2, 8, 1, 9]
});

effect(() => {
  console.log('Items:', list.items.join(', '));
});

// Initial: Logs "Items: 5, 2, 8, 1, 9"

// Sort the array
list.items.sort((a, b) => a - b);

// ✅ Manually notify reactivity
list.$notify('items');

// Effect re-runs! Logs "Items: 1, 2, 5, 8, 9"
```

**Think of it like this:**
- **Normal change**: `list.items = [1, 2, 3]` (reactivity sees it automatically)
- **Manual change**: `list.items.sort()` + `list.$notify('items')` (you tell reactivity about it)

---

## How It Works Under the Hood

When you call `$notify(key)`:

```
state.$notify('items')
        ↓
1. Find all effects/watchers tracking 'items'
2. Mark them as "dirty" (need to re-run)
3. Trigger re-execution of effects
4. Update computed properties
5. Trigger DOM bindings
        ↓
Returns the state (for chaining)
```

**Example:**
```javascript
const app = state({ items: [1, 2, 3] });

effect(() => {
  console.log('Items changed:', app.items.length);
});

// This triggers reactivity automatically
app.items.push(4);  // Effect runs: "Items changed: 4"

// This doesn't trigger reactivity
app.items.sort();   // Effect doesn't run

// Manually notify
app.$notify('items');  // Effect runs: "Items changed: 4"
```

**The magic:** `$notify()` manually triggers the same mechanism that automatic reactivity uses!

---

## When to Use `$notify()`

### ✅ Use Case 1: Sorting Arrays

Sort reactive arrays in-place.

```javascript
const todos = state({
  items: [
    { id: 3, text: 'Finish project', priority: 'high' },
    { id: 1, text: 'Buy milk', priority: 'low' },
    { id: 2, text: 'Call dentist', priority: 'medium' }
  ]
});

effect(() => {
  const list = todos.items.map(t => `${t.id}: ${t.text}`).join(', ');
  console.log('Todos:', list);
});

// Initial: "Todos: 3: Finish project, 1: Buy milk, 2: Call dentist"

// Sort by ID
function sortById() {
  todos.items.sort((a, b) => a.id - b.id);
  todos.$notify('items');  // Trigger reactivity
}

sortById();
// "Todos: 1: Buy milk, 2: Call dentist, 3: Finish project"

// Sort by priority
function sortByPriority() {
  const priority = { high: 1, medium: 2, low: 3 };
  todos.items.sort((a, b) => priority[a.priority] - priority[b.priority]);
  todos.$notify('items');
}

sortByPriority();
// "Todos: 3: Finish project, 2: Call dentist, 1: Buy milk"
```

**Why this works:** `sort()` modifies in-place. `$notify()` tells effects to re-run with sorted data!

---

### ✅ Use Case 2: Reversing Arrays

Reverse reactive arrays.

```javascript
const messages = state({
  items: [
    { id: 1, text: 'First message' },
    { id: 2, text: 'Second message' },
    { id: 3, text: 'Third message' }
  ]
});

effect(() => {
  const list = messages.items.map(m => m.text).join(' → ');
  console.log('Messages:', list);
});

// Initial: "First message → Second message → Third message"

// Reverse message order
function reverseMessages() {
  messages.items.reverse();
  messages.$notify('items');
}

reverseMessages();
// "Third message → Second message → First message"
```

**Why this works:** `reverse()` modifies in-place. `$notify()` triggers re-render!

---

### ✅ Use Case 3: Direct Index Assignment

Update array items by index.

```javascript
const scores = state({
  items: [10, 20, 30, 40, 50]
});

effect(() => {
  console.log('Scores:', scores.items.join(', '));
  console.log('Average:', scores.items.reduce((a, b) => a + b) / scores.items.length);
});

// Initial: "Scores: 10, 20, 30, 40, 50" "Average: 30"

// Update score by index (might not trigger in all browsers)
function updateScore(index, newScore) {
  scores.items[index] = newScore;
  scores.$notify('items');  // Ensure reactivity
}

updateScore(0, 100);
// "Scores: 100, 20, 30, 40, 50" "Average: 48"
```

**Why this works:** Direct index assignment can be tricky. `$notify()` ensures effects run!

---

### ✅ Use Case 4: External Library Modifications

When external libraries modify your data.

```javascript
const chartData = state({
  labels: ['Jan', 'Feb', 'Mar'],
  values: [10, 20, 15]
});

effect(() => {
  renderChart(chartData.labels, chartData.values);
  console.log('Chart rendered');
});

// External library modifies data (doesn't trigger reactivity)
function normalizeData() {
  // Some library modifies the array directly
  externalLibrary.normalize(chartData.values);  // Modifies in-place

  // Manually notify reactivity
  chartData.$notify('values');
}

normalizeData();
// Chart re-renders with normalized data
```

**Why this works:** External code can't trigger reactivity. `$notify()` bridges the gap!

---

### ✅ Use Case 5: Batch Manual Changes

Make multiple manual changes, then notify once.

```javascript
const game = state({
  entities: [
    { id: 1, x: 0, y: 0, health: 100 },
    { id: 2, x: 50, y: 50, health: 80 },
    { id: 3, x: 100, y: 100, health: 60 }
  ]
});

effect(() => {
  console.log('Entities updated, count:', game.entities.length);
  renderEntities(game.entities);
});

// Update all entities (manual loop)
function updateAllEntities(deltaTime) {
  // Manually update each entity (bypasses reactivity)
  for (let i = 0; i < game.entities.length; i++) {
    const entity = game.entities[i];
    entity.x += entity.velocityX || 0;
    entity.y += entity.velocityY || 0;
    entity.health -= entity.damage || 0;
  }

  // Remove dead entities
  for (let i = game.entities.length - 1; i >= 0; i--) {
    if (game.entities[i].health <= 0) {
      game.entities.splice(i, 1);
    }
  }

  // Notify once after all changes
  game.$notify('entities');
}

// Called 60 times per second
setInterval(() => updateAllEntities(1/60), 1000/60);
```

**Why this works:** Manual updates are faster. Notify once after all changes for efficiency!

---

## How `$notify()` Interacts With Other Features

### With Effects - Triggers Re-execution

```javascript
const app = state({ items: [1, 2, 3] });

effect(() => {
  console.log('Effect ran:', app.items.length);
});

app.items.sort();       // Effect doesn't run
app.$notify('items');   // Effect runs!
```

**Lesson:** `$notify()` manually triggers effects tracking that property!

---

### With Computed - Marks as Dirty

```javascript
const list = state({ items: [3, 1, 2] });

list.$computed('sorted', function() {
  console.log('Computing sorted...');
  return [...this.items].sort();
});

effect(() => {
  console.log('Sorted:', list.sorted);
});

list.items.sort();      // Computed doesn't recalculate
list.$notify('items');  // Computed recalculates!
```

**Lesson:** Computed properties recalculate when you notify their dependencies!

---

### With Bindings - Updates DOM

```javascript
const app = state({ items: [5, 2, 8] });

app.$bind({
  '#list': (state) => state.items.join(', ')
});

app.items.sort();       // DOM doesn't update
app.$notify('items');   // DOM updates!
```

**Lesson:** DOM bindings update when you notify!

---

## When NOT to Use `$notify()`

### ❌ Don't Use for Normal Array Methods

```javascript
// ❌ WRONG: push() already triggers reactivity
list.items.push(1);
list.$notify('items');  // Unnecessary!

// ✅ RIGHT: Just use push()
list.items.push(1);  // Reactivity automatic!
```

**Why:** Methods like `push`, `pop`, `splice`, `shift`, `unshift` already trigger reactivity!

---

### ❌ Don't Use for Property Assignment

```javascript
// ❌ WRONG: Assignment already triggers
app.count = 10;
app.$notify('count');  // Unnecessary!

// ✅ RIGHT: Just assign
app.count = 10;  // Reactivity automatic!
```

**Why:** Normal property assignment triggers reactivity automatically!

---

### ❌ Don't Overuse It

```javascript
// ❌ BAD: Notifying unnecessarily
function addItem(item) {
  list.items.push(item);  // Already triggers
  list.$notify('items');   // Triggers again!
}

// ✅ GOOD: Let reactivity work automatically
function addItem(item) {
  list.items.push(item);  // That's it!
}
```

**Why:** Overusing `$notify()` wastes CPU and triggers effects multiple times!

---

## When to Use vs Not Use

| Operation | Triggers Automatically? | Need $notify()? |
|-----------|------------------------|-----------------|
| `arr.push()` | ✅ Yes | ❌ No |
| `arr.pop()` | ✅ Yes | ❌ No |
| `arr.splice()` | ✅ Yes | ❌ No |
| `arr.sort()` | ❌ No | ✅ Yes |
| `arr.reverse()` | ❌ No | ✅ Yes |
| `arr[0] = value` | ⚠️ Maybe | ✅ Use to be safe |
| `obj.prop = value` | ✅ Yes | ❌ No |
| External library | ❌ No | ✅ Yes |

---

## Quick Mental Model

Think of `$notify()` as **"manual trigger button"**:

```javascript
// Automatic reactivity (built-in)
list.items.push(1);  // ✅ Triggers automatically

// Manual reactivity (you trigger)
list.items.sort();   // ❌ Doesn't trigger
list.$notify('items'); // ✅ You trigger it
```

**Remember:**
- Use for in-place mutations (`sort`, `reverse`)
- Use for direct index assignment
- Use after external library modifications
- DON'T use for normal array methods or assignments

---

## Summary

**`state.$notify()` manually triggers reactivity for a specific property when automatic detection doesn't work.**

**When to use it:**
- ✅ After `array.sort()`
- ✅ After `array.reverse()`
- ✅ After direct index assignment `arr[i] = value`
- ✅ After external library modifications
- ✅ For batch manual updates

**When NOT to use it:**
- ❌ After `push`, `pop`, `splice` (automatic!)
- ❌ After property assignment (automatic!)
- ❌ Don't overuse it

**One-sentence summary:**
Use `$notify()` when you modify data in ways that bypass automatic reactivity detection - like sorting, reversing, or external modifications! 🎯

---

➡️ **Next:** Learn about collection methods like [`$add()`]($add.md), [`$remove()`]($remove.md), [`$update()`](collection_$update.md), and [`$clear()`]($clear.md)!
