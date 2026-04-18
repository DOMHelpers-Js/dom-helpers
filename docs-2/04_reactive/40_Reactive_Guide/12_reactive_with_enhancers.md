[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Reactive With Enhancers

## Quick Demonstration

```javascript
const leaderboard = state({
  players: ['Alice', 'Bob', 'Charlie'],
  scores: [2400, 1850, 1200]
});

effect(() => {
  // Array distribution: each player gets their name, each gets their score
  ClassName.player.update({
    textContent: leaderboard.players  // ['Alice', 'Bob', 'Charlie'] distributed across .player elements
  });

  ClassName.score.update({
    textContent: leaderboard.scores   // [2400, 1850, 1200] distributed across .score elements
  });
});

// Update player scores — all three score elements update automatically
leaderboard.scores = [2500, 1900, 1300];
```

One state change. Three elements updated. Each gets the right value from the array.

---

## What Are Enhancers?

Enhancers are modules that **extend** the DOM Helpers core with more powerful update patterns. They live in `src/02_enhancers/` and add capabilities on top of the `.update()` foundation.

The key enhancer features are:

### 1. Bulk Property Updaters
Update multiple elements by ID using a single, expressive call.

```javascript
// Instead of: 3 separate getElementById + update calls
Elements.textContent({
  'user-name': app.name,
  'user-score': app.score,
  'user-rank': app.rank
});
```

### 2. Array Distribution Across Collections
Distribute an array of values across matching elements — each element gets its own value from the array.

```javascript
// ClassName.card represents all elements with class="card"
// textContent array is distributed: card[0] gets titles[0], card[1] gets titles[1], etc.
ClassName.card.update({
  textContent: ['Product A', 'Product B', 'Product C']
});
```

### 3. Index-Based Collection Updates
Target specific elements within a collection by index — including negative indices.

```javascript
// Update only the first and last elements
ClassName.item.update({
  [0]: { classList: { add: 'first' } },
  [-1]: { classList: { add: 'last' } },
  classList: { remove: 'placeholder' }  // Applied to ALL
});
```

### 4. Global Collection Shortcuts
Access collections of elements by class, tag, or name using clean shorthand syntax.

```javascript
ClassName.button[0]   // First element with class="button"
TagName.li[-1]        // Last <li> element
Name.username[0]      // First element with name="username"
Id('myButton')        // Element with id="myButton"
```

---

## Syntax

### Global Collection Shortcuts

```javascript
// Access by class name
ClassName.card              // All elements with class="card"
ClassName.card[0]           // First .card element
ClassName.card[-1]          // Last .card element (negative index)

// Access by tag name
TagName.li                  // All <li> elements
TagName.li[2]               // Third <li>

// Access by input name attribute
Name.email                  // All elements with name="email"

// Element by ID (shorthand)
Id('myButton')              // Same as document.getElementById('myButton')
Id.multiple('a', 'b', 'c') // Get several elements
```

### Bulk Property Methods on `Elements`

```javascript
// Set textContent for multiple elements by ID
Elements.textContent({ id1: 'text', id2: 'text' });

// Set innerHTML
Elements.innerHTML({ id1: '<b>Bold</b>', id2: 'plain' });

// Set style objects per element
Elements.style({
  id1: { color: 'red', fontWeight: 'bold' },
  id2: { color: 'blue' }
});

// Set classList operations per element
Elements.classes({
  id1: { add: 'active', remove: 'inactive' },
  id2: { toggle: ['selected', true] }
});

// Set attributes per element
Elements.attrs({
  id1: { 'aria-label': 'Main button', disabled: false },
  id2: { 'data-id': '42' }
});

// Set dataset per element
Elements.dataset({
  id1: { category: 'featured', rank: '1' },
  id2: { category: 'regular', rank: '2' }
});

// Generic property
Elements.prop('disabled', {
  'submit-btn': true,
  'cancel-btn': false
});
```

### Array Distribution on Collections

```javascript
// Array values are distributed across elements in order
ClassName.item.update({
  textContent: ['First', 'Second', 'Third'],  // Each element gets its value
  style: { color: ['red', 'blue', 'green'] }  // Each element gets its color
});

// Beyond array length: last value repeats
// If there are 5 elements but only 3 values:
// element[0] → 'First', element[1] → 'Second', element[2+] → 'Third'
```

### Index-Based Updates on Collections

```javascript
// Numeric keys target specific elements; string keys are bulk
collection.update({
  [0]: { textContent: 'First item only' },
  [1]: { style: { color: 'blue' } },
  [-1]: { classList: { add: 'last-item' } },  // Last element
  classList: { remove: 'loading' }  // Applied to ALL
});
```

---

## Why Do Enhancers Exist?

### The Problem: Verbose Collection Updates

Without enhancers, updating multiple elements in a collection requires manual loops:

```javascript
// Old way — verbose and error-prone
effect(() => {
  const titles = ['Alice', 'Bob', 'Charlie'];
  const cards = document.querySelectorAll('.player-card');

  // Loop manually
  cards.forEach((card, index) => {
    const nameEl = card.querySelector('.player-name');
    if (nameEl) {
      nameEl.textContent = titles[index] || titles[titles.length - 1];
    }
  });
});
```

### The Enhancer Solution: Array Distribution

```javascript
// Enhancer way — array distribution does the work
effect(() => {
  ClassName['player-name'].update({
    textContent: leaderboard.players  // Array distributed automatically
  });
});
```

Same result. No loop. The enhancer handles distribution.

### The Problem: Repetitive Bulk ID Updates

```javascript
// Old way — one call per element
effect(() => {
  document.getElementById('user-name').textContent = user.name;
  document.getElementById('user-email').textContent = user.email;
  document.getElementById('user-role').textContent = user.role;
  document.getElementById('user-bio').textContent = user.bio;
  document.getElementById('user-joined').textContent = user.joinDate;
});
```

### The Enhancer Solution: Bulk Update

```javascript
// Enhancer way — one organized block
effect(() => {
  Elements.textContent({
    'user-name': user.name,
    'user-email': user.email,
    'user-role': user.role,
    'user-bio': user.bio,
    'user-joined': user.joinDate
  });
});
```

One structured block. Easy to read. Easy to extend.

---

## Mental Model

### Array Distribution: A Postal Route

Think of array distribution like a postal worker delivering mail:

```
.player-name elements:    [Card 1]  [Card 2]  [Card 3]  [Card 4]
                             ↓         ↓         ↓         ↓
players array:            'Alice'   'Bob'    'Charlie' 'Charlie'
                                                        ↑
                                              (repeats last value
                                               when array runs out)
```

Each element gets its value from the matching array position. When the array is shorter than the element count, the last value is used for all remaining elements.

### Index-Based Updates: Targeted Mail

```
.nav-link elements:    [link 0]  [link 1]  [link 2]  [link 3]
                          ↓
Index update [1]:        skip     update    skip      skip
                                   ↓
Bulk update:           update    update    update    update
                                   ↓
Result: link 1 gets    BOTH updates applied (index overrides bulk)
```

Index-based updates target specific elements. Bulk updates apply to all. When both are present, the bulk runs first, then indexes override.

---

## How It Works Internally

### Array Distribution Flow

```
collection.update({ textContent: ['A', 'B', 'C'] })
                    ↓
1. Detect: textContent is an array — use array distribution
                    ↓
2. For element 0: get 'A' (array[0])
   For element 1: get 'B' (array[1])
   For element 2: get 'C' (array[2])
   For element 3+: get 'C' (last value, repeated)
                    ↓
3. Apply each value to corresponding element
```

### Index-Based Update Flow

```
collection.update({ [0]: {...}, [1]: {...}, classList: {...} })
                    ↓
1. Separate: numeric keys → indexUpdates, string keys → bulkUpdates
                    ↓
2. Phase 1: Apply bulkUpdates to ALL elements
                    ↓
3. Phase 2: Apply indexUpdates to specific elements
   (Overrides bulk where index was specified)
                    ↓
4. Support negative indices: [-1] → elements.length - 1
```

---

## Basic Usage: Enhancers + Reactive

### Example 1 — Scores Leaderboard

```html
<ol id="leaderboard">
  <li class="player-row">
    <span class="player-name"></span>
    <span class="player-score"></span>
  </li>
  <!-- More rows... -->
</ol>
```

```javascript
const leaderboard = state({
  players: [
    { name: 'Alice', score: 2400 },
    { name: 'Bob', score: 1850 },
    { name: 'Charlie', score: 1200 }
  ]
});

effect(() => {
  const names = leaderboard.players.map(p => p.name);
  const scores = leaderboard.players.map(p => p.score.toLocaleString());

  // Distribute names and scores across elements
  ClassName['player-name'].update({ textContent: names });
  ClassName['player-score'].update({ textContent: scores });
});

// Update a score — display updates automatically
function updateScore(index, newScore) {
  set(leaderboard, {
    players: prev => prev.map((p, i) =>
      i === index ? { ...p, score: newScore } : p
    )
  });
}
```

### Example 2 — User Profile With Bulk Updates

```javascript
const user = state({
  name: '',
  email: '',
  bio: '',
  role: '',
  avatar: '',
  joinDate: '',
  isVerified: false,
  isAdmin: false
});

effect(() => {
  // Bulk text update — all at once
  Elements.textContent({
    'profile-name': user.name,
    'profile-email': user.email,
    'profile-bio': user.bio,
    'profile-role': user.role,
    'profile-joined': user.joinDate
  });

  // Avatar
  Id('profile-avatar').update({
    src: user.avatar,
    alt: `${user.name}'s profile photo`
  });

  // Bulk class update — verified badge, admin badge
  Elements.classes({
    'verified-badge': { toggle: ['visible', user.isVerified] },
    'admin-badge': { toggle: ['visible', user.isAdmin] },
    'profile-name': { add: user.isAdmin ? 'admin-name' : '', remove: user.isAdmin ? '' : 'admin-name' }
  });
});
```

### Example 3 — Navigation With Active State

```javascript
const router = state({ currentPage: 'home' });

const pages = ['home', 'about', 'products', 'contact'];

effect(() => {
  // For each nav link: is it the current page?
  const activeStates = pages.map(page => ({
    classList: {
      toggle: ['active', page === router.currentPage]
    },
    setAttribute: {
      'aria-current': page === router.currentPage ? 'page' : 'false'
    }
  }));

  // Apply per-element updates using index-based approach
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.update(
    activeStates.reduce((acc, update, i) => {
      acc[i] = update;
      return acc;
    }, {})
  );
});

// Click any nav link
document.querySelectorAll('.nav-link').forEach((link, index) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    router.currentPage = pages[index];
  });
});
```

### Example 4 — Product Grid

```html
<div id="product-grid">
  <div class="product-card">
    <img class="product-img" src="" alt="">
    <h3 class="product-title"></h3>
    <p class="product-price"></p>
    <span class="product-tag"></span>
  </div>
  <!-- More cards... -->
</div>
```

```javascript
const catalog = state({ products: [] });

effect(() => {
  const { products } = catalog;

  if (!products.length) return;

  // Distribute each data field across all product card elements
  ClassName['product-title'].update({
    textContent: products.map(p => p.name)
  });

  ClassName['product-price'].update({
    textContent: products.map(p => `$${p.price.toFixed(2)}`)
  });

  ClassName['product-tag'].update({
    textContent: products.map(p => p.tag || ''),
    hidden: products.map(p => !p.tag)
  });

  // Update images with both src and alt per element
  const images = document.querySelectorAll('.product-img');
  images.update({
    src: products.map(p => p.image),
    alt: products.map(p => `Photo of ${p.name}`)
  });
});

// Load products
async function loadProducts() {
  const data = await fetch('/api/products').then(r => r.json());
  catalog.products = data;
}
```

### Example 5 — Form with Index-Based Validation

```javascript
const form = state({
  fields: ['', '', ''],  // 3 input fields
  errors: ['', '', ''],  // One error per field
  labels: ['Name', 'Email', 'Message']
});

effect(() => {
  // Set labels on all label elements
  ClassName['field-label'].update({
    textContent: form.labels  // Array distributed
  });

  // Set error messages — each field gets its own error
  ClassName['field-error'].update({
    textContent: form.errors,
    hidden: form.errors.map(e => !e)  // Hidden if empty
  });

  // Highlight invalid fields
  ClassName['field-input'].update({
    classList: {
      // Can't use array in classList toggle directly — use index updates
    }
  });

  // Use index-based updates for per-field class toggling
  const inputs = document.querySelectorAll('.field-input');
  inputs.update(
    form.errors.reduce((updates, error, i) => {
      updates[i] = { classList: { toggle: ['invalid', !!error] } };
      return updates;
    }, {})
  );
});
```

---

## Deep Dive: First, Last, and Middle Elements

### Targeting Specific Collection Elements

```javascript
// Style the first and last items specially — leave middle untouched
ClassName.item.update({
  style: { padding: '10px' },      // ALL items
  [0]: {                           // First item only
    style: { borderRadius: '8px 8px 0 0', marginTop: '0' },
    classList: { add: 'first-item' }
  },
  [-1]: {                          // Last item only
    style: { borderRadius: '0 0 8px 8px', marginBottom: '0' },
    classList: { add: 'last-item' }
  }
});
```

### Reacting to Collection Size Changes

```javascript
const list = state({ items: [] });

effect(() => {
  const { items } = list;

  if (items.length === 0) {
    document.getElementById('empty-state').hidden = false;
    document.getElementById('list-container').hidden = true;
    return;
  }

  document.getElementById('empty-state').hidden = true;
  document.getElementById('list-container').hidden = false;

  // Re-render list items
  document.getElementById('list-container').innerHTML =
    items.map(item => `<div class="list-item">${item.text}</div>`).join('');

  // After re-render, style first and last
  ClassName['list-item'].update({
    [0]: { classList: { add: 'first' } },
    [-1]: { classList: { add: 'last' } }
  });
});
```

---

## Deep Dive: Mixed Updates (Bulk + Index)

The real power comes from combining bulk and index updates in one call:

```javascript
const quiz = state({
  questions: [
    { text: 'What is 2+2?', answered: false, correct: null },
    { text: 'Capital of France?', answered: true, correct: true },
    { text: 'Speed of light?', answered: true, correct: false }
  ]
});

effect(() => {
  const { questions } = quiz;

  // BULK: Set question text for all
  ClassName['question-text'].update({
    textContent: questions.map(q => q.text)
  });

  // BULK + INDEX combined: base classes for all, special for answered ones
  const questionCards = document.querySelectorAll('.question-card');
  const updates = {
    // Bulk: remove all status classes first
    classList: { remove: ['answered-correct', 'answered-wrong', 'unanswered'] }
  };

  // Add index-based updates for answered questions
  questions.forEach((q, i) => {
    if (q.answered) {
      updates[i] = {
        classList: {
          add: q.correct ? 'answered-correct' : 'answered-wrong'
        }
      };
    } else {
      updates[i] = { classList: { add: 'unanswered' } };
    }
  });

  questionCards.update(updates);
});
```

---

## Summary

The enhancer modules add three major capabilities to Reactive + Core:

### Bulk Property Methods (`Elements.*`)
```javascript
Elements.textContent({ id1: val1, id2: val2 });  // Many IDs, one block
Elements.style({ id1: {...}, id2: {...} });
Elements.classes({ id1: {...}, id2: {...} });
```
**Best for:** Updating many elements by ID in effects — replaces multiple getElementById calls.

### Array Distribution (on collections)
```javascript
ClassName.card.update({
  textContent: ['Value A', 'Value B', 'Value C']  // Each card gets its value
});
```
**Best for:** Distributing reactive state arrays across multiple DOM elements without loops.

### Index-Based Updates (on collections)
```javascript
collection.update({
  classList: { remove: 'loading' },  // ALL elements
  [0]: { classList: { add: 'first' } },   // First only
  [-1]: { classList: { add: 'last' } }    // Last only
});
```
**Best for:** Applying different updates to specific positions in a collection while also setting a base state for all elements.

### Global Shortcuts
```javascript
ClassName.button[0]   // First .button element
TagName.li[-1]        // Last <li>
Id('submit-btn')      // Element by ID
```
**Best for:** Cleaner element access syntax without verbose `document.getElementsByClassName` calls.

---

## What's Next?

Enhancers make updating the DOM expressive and efficient. The final piece is **Conditions** — a system for declaratively rendering different DOM states based on reactive state values.

Continue to: [13 — Reactive With Conditions](./13_reactive_with_conditions.md)