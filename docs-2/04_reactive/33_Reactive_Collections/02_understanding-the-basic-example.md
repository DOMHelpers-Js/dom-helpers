[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Understanding the Basic Example

Let's break down a simple todo list example step by step so you understand exactly how reactive collections work.

---

## The scenario

You have a todo list where users can add tasks, mark them done, and see a count:

```html
<input id="todoInput" placeholder="Add a task...">
<button id="addBtn">Add</button>
<ul id="todoList"></ul>
<span id="count">0 items</span>
```

---

## The code

```javascript
// Step 1: Create the collection
const todos = Collections.create([
  { id: 1, text: 'Buy groceries', done: false },
  { id: 2, text: 'Walk the dog', done: false }
]);

// Step 2: Set up automatic UI updates
ReactiveUtils.effect(() => {
  document.getElementById('todoList').innerHTML = todos.items
    .map(t => `<li>${t.done ? '✅' : '⬜'} ${t.text}</li>`)
    .join('');

  document.getElementById('count').textContent = `${todos.length} items`;
});

// Step 3: Add a new todo
document.getElementById('addBtn').addEventListener('click', () => {
  const input = document.getElementById('todoInput');
  todos.add({ id: Date.now(), text: input.value, done: false });
  input.value = '';
});
```

Let's break this down **part by part**.

---

## Part 1: Creating the collection

```javascript
const todos = Collections.create([
  { id: 1, text: 'Buy groceries', done: false },
  { id: 2, text: 'Walk the dog', done: false }
]);
```

### What happens inside

```
Collections.create([...])
   ↓
1️⃣ The initial items are copied into a new array
   → items: [{ id: 1, ... }, { id: 2, ... }]
   ↓
2️⃣ A reactive state is created: { items: [...] }
   → The items array is now tracked by the Proxy
   ↓
3️⃣ All collection methods are attached to the reactive object
   → .add(), .remove(), .update(), .toggle(), .clear(), etc.
   ↓
4️⃣ Getters are defined: .length, .first, .last
   ↓
5️⃣ The collection is returned
```

### What the collection object looks like

```javascript
console.log(todos.items);   // [{ id: 1, text: 'Buy groceries', done: false }, ...]
console.log(todos.length);  // 2
console.log(todos.first);   // { id: 1, text: 'Buy groceries', done: false }
console.log(todos.last);    // { id: 2, text: 'Walk the dog', done: false }
```

It looks and behaves like a regular object, but with reactive superpowers and built-in methods.

---

## Part 2: Setting up the effect

```javascript
ReactiveUtils.effect(() => {
  document.getElementById('todoList').innerHTML = todos.items
    .map(t => `<li>${t.done ? '✅' : '⬜'} ${t.text}</li>`)
    .join('');

  document.getElementById('count').textContent = `${todos.length} items`;
});
```

### What happens

```
1️⃣ The effect runs immediately
   ↓
2️⃣ It reads todos.items → dependency tracked
   ↓
3️⃣ It reads todos.length (via the getter) → dependency tracked
   ↓
4️⃣ The DOM updates:
   ├── todoList shows:
   │   ⬜ Buy groceries
   │   ⬜ Walk the dog
   └── count shows: "2 items"
```

Now, any change to `todos.items` will re-run this effect and update the DOM.

---

## Part 3: Adding an item

```javascript
document.getElementById('addBtn').addEventListener('click', () => {
  const input = document.getElementById('todoInput');
  todos.add({ id: Date.now(), text: input.value, done: false });
  input.value = '';
});
```

### What happens when the button is clicked

```
todos.add({ id: 3, text: 'Clean house', done: false })
   ↓
1️⃣ .add() calls this.items.push(item)
   → Array now has 3 items
   ↓
2️⃣ The push triggers reactivity (via the array patch)
   → Effects depending on "items" are queued
   ↓
3️⃣ The effect re-runs
   ├── todoList shows:
   │   ⬜ Buy groceries
   │   ⬜ Walk the dog
   │   ⬜ Clean house       ← New item!
   └── count shows: "3 items" ← Updated!
   ↓
4️⃣ .add() returns the collection (for chaining)
```

---

## The complete flow

**Initial state:**

```
┌──────────────────────────────┐
│  ⬜ Buy groceries            │
│  ⬜ Walk the dog             │
│                              │
│  2 items                     │
│                              │
│  [____________] [Add]        │
└──────────────────────────────┘
```

**After adding "Clean house":**

```
┌──────────────────────────────┐
│  ⬜ Buy groceries            │
│  ⬜ Walk the dog             │
│  ⬜ Clean house              │  ← New
│                              │
│  3 items                     │  ← Updated
│                              │
│  [____________] [Add]        │
└──────────────────────────────┘
```

**After removing "Walk the dog":**

```javascript
todos.remove(t => t.id === 2);
```

```
┌──────────────────────────────┐
│  ⬜ Buy groceries            │
│  ⬜ Clean house              │
│                              │
│  2 items                     │  ← Updated
│                              │
│  [____________] [Add]        │
└──────────────────────────────┘
```

**After toggling "Buy groceries":**

```javascript
todos.toggle(t => t.id === 1, 'done');
```

```
┌──────────────────────────────┐
│  ✅ Buy groceries            │  ← Toggled!
│  ⬜ Clean house              │
│                              │
│  2 items                     │
│                              │
│  [____________] [Add]        │
└──────────────────────────────┘
```

---

## Chaining in action

Multiple operations in one statement:

```javascript
todos
  .add({ id: 4, text: 'Read book', done: false })
  .add({ id: 5, text: 'Exercise', done: false })
  .sort((a, b) => a.text.localeCompare(b.text));
```

Each method returns the collection, so you can chain the next call.

---

## The two kinds of predicates

Most collection methods accept a **predicate** to find the right item. A predicate can be either:

### 1. A value — exact match

```javascript
const numbers = Collections.create([1, 2, 3, 4, 5]);

numbers.remove(3);      // Removes the number 3
numbers.includes(2);    // true
numbers.indexOf(4);     // position of 4
```

### 2. A function — conditional match

```javascript
const todos = Collections.create([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Clean house', done: true }
]);

todos.remove(t => t.id === 1);          // Remove by condition
todos.find(t => t.done);                // Find first done item
todos.update(t => t.id === 2, { text: 'Deep clean' }); // Update by condition
```

---

## Common beginner mistakes

### ❌ Mistake 1: Accessing items without .items

```javascript
const list = Collections.create([1, 2, 3]);

// WRONG — the collection is not the array
console.log(list[0]);        // undefined
console.log(list.length);    // 3 (this works — it's a getter)

// RIGHT — access through .items
console.log(list.items[0]);  // 1
console.log(list.at(0));     // 1 (or use .at())
```

### ❌ Mistake 2: Forgetting that .items is the source of truth

```javascript
// WRONG — this creates a copy, doesn't modify the collection
const copy = list.toArray();
copy.push(4);  // Modifies the copy, not the collection

// RIGHT — use the collection methods
list.add(4);   // Modifies the collection, triggers effects
```

### ❌ Mistake 3: Forgetting the field name in toggle

```javascript
const todos = Collections.create([
  { id: 1, text: 'Task', done: false }
]);

// WRONG — no field specified, defaults to 'done' (which may be fine)
todos.toggle(t => t.id === 1);  // Toggles .done

// RIGHT when the field has a different name
todos.toggle(t => t.id === 1, 'active');  // Toggles .active
```

---

## Key takeaways

1. **Create** with `Collections.create(initialItems)` or `ReactiveUtils.collection(initialItems)`
2. **Data lives in** `.items` — an array tracked by the reactive system
3. **Methods are chainable** — `.add().remove().sort()` all return the collection
4. **Predicates** accept a value (exact match) or a function (conditional match)
5. **Effects re-run** whenever `.items` changes through any method
6. **Convenience getters** — `.length`, `.first`, `.last` for quick reads

---

## What's next?

Let's explore every collection method in detail — CRUD operations, queries, iteration, and more.

Let's continue!