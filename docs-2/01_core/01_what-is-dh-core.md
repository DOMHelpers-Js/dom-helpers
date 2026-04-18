[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# Introduction to DOMHelpers Core

Welcome to DOMHelpers Core! If you've ever found yourself writing `document.getElementById(...)` over and over, or juggling dozens of DOM variables, this documentation is for you.

DOMHelpers Core is a single JavaScript file that gives you three smart helpers for working with HTML elements — faster, cleaner, and without the repetition that plain JavaScript requires.

---

## Quick Start (30 Seconds)

Here's the fastest way to see what it does. Instead of this:

```javascript
const title  = document.getElementById('title');
const status = document.getElementById('status');

title.textContent     = 'Welcome!';
title.style.color     = '#333';
status.textContent    = 'Ready';
status.style.color    = 'green';
```

You write this:

```javascript
Elements.update({
  title:  { textContent: 'Welcome!', style: { color: '#333' } },
  status: { textContent: 'Ready',    style: { color: 'green' } }
});
```

And instead of looping over all buttons manually:

```javascript
// Plain JavaScript — tedious loop
document.querySelectorAll('.btn').forEach(btn => {
  btn.style.background = 'blue';
  btn.style.color      = 'white';
});
```

You write this:

```javascript
// DOMHelpers — one clean call
Collections.ClassName.btn.update({ style: { background: 'blue', color: 'white' } });
```

✨ No `getElementById`, no manual loops, no repetition.

---

## What is DOMHelpers Core?

**DOMHelpers Core** is one JavaScript file that gives you **three helpers** for accessing and updating DOM elements — each designed for a different situation.

Think of it as a **toolbox** sitting between your JavaScript code and the browser. Instead of reaching into the DOM yourself every time you need an element, you have three pre-built tools that know exactly where to look — and remember what they found.

The three helpers are:

```
DOMHelpers Core
├── Elements    → Access any element by its ID
├── Collections → Access groups of elements by class, tag, or name
└── Selector    → Access elements using any CSS selector
```

Each one adds a `.update()` method to every element it finds, so you can change text, styles, classes, attributes, and events — all from one clean object.

---

## The Three Helpers at a Glance

### `Elements` — When You Know the Element's ID

When you have a single, specific element you want to work with and you know its ID, `Elements` is your tool.

```javascript
// HTML: <button id="submitBtn">Submit</button>

// Access it by ID — no getElementById needed
Elements.submitBtn.textContent = 'Saving...';

// Or update multiple things at once
Elements.submitBtn.update({
  textContent: 'Saving...',
  disabled:    true,
  style:       { opacity: '0.7' }
});
```

---

### `Collections` — When You Want to Work with a Group

When you need to affect multiple elements that share a class, tag, or name attribute, `Collections` is your tool.

```javascript
// HTML:
// <button class="btn">Save</button>
// <button class="btn">Cancel</button>
// <button class="btn">Delete</button>

// Update ALL of them at once
Collections.ClassName.btn.update({ disabled: true });

// All <p> tags:
Collections.TagName.p.update({ style: { lineHeight: '1.6' } });

// All inputs with name="email":
Collections.Name.email.update({ style: { border: '2px solid red' } });
```

---

### `Selector` — When You Need CSS Selector Power

When you need to target elements using complex CSS selectors — combinators, pseudo-classes, attribute selectors — `Selector` gives you the full power of CSS.

```javascript
// Single match
const emailInput = Selector.query('input[type="email"]');

// All matches
const requiredFields = Selector.queryAll('input[required]');

// Scoped inside a container
const formBtn = Selector.Scoped.within('#loginForm', 'button[type="submit"]');

// Bulk update with CSS selectors as keys
Selector.update({
  '#hero h1':        { textContent: 'Welcome!' },
  '.card':           { classList: { add: 'loaded' } },
  'input[required]': { classList: { add: 'required-mark' } }
});
```

---

## Why Does This Exist?

### The Problem with Plain JavaScript

Consider this common scenario: you load user data and need to update several elements on the page.

```javascript
// Vanilla JavaScript — the manual way
const nameEl    = document.getElementById('userName');
nameEl.textContent  = 'Alice Johnson';
nameEl.style.color  = '#333';
nameEl.style.fontSize = '18px';

const emailEl   = document.getElementById('userEmail');
emailEl.textContent = 'alice@example.com';

const avatarEl  = document.getElementById('userAvatar');
avatarEl.setAttribute('src', 'alice.jpg');
avatarEl.setAttribute('alt', 'Alice Johnson');

const statusEl  = document.getElementById('userStatus');
statusEl.textContent = 'Online';
statusEl.className   = 'status online';

const followBtn = document.getElementById('followBtn');
followBtn.textContent = 'Following';
followBtn.disabled    = false;
followBtn.classList.add('active');
followBtn.classList.remove('inactive');
```

At first glance, this looks fine. But there's a hidden cost.

**What's the Real Issue?**

```
Every getElementById = full DOM scan
   ↓
document.getElementById('userName')   → scans entire document
document.getElementById('userEmail')  → scans entire document again
document.getElementById('userAvatar') → scans entire document again
   ↓
6 elements = 6 full scans
   ↓
15+ separate lines for one state transition
   ↓
Hard to see what the final state looks like
```

**Problems:**
❌ `getElementById` called repeatedly — every call traverses the entire document
❌ Every property change is its own line — many lines for one state update
❌ No caching — the same element queried three times? Three DOM scans
❌ No change detection — setting `textContent` to the same value still writes to the DOM
❌ Code scattered across many lines — hard to see the intent at a glance

### The Solution with DOMHelpers Core

```javascript
// DOMHelpers Core — declarative and concise
Elements.update({
  userName:   { textContent: 'Alice Johnson', style: { color: '#333', fontSize: '18px' } },
  userEmail:  { textContent: 'alice@example.com' },
  userAvatar: { setAttribute: { src: 'alice.jpg', alt: 'Alice Johnson' } },
  userStatus: { textContent: 'Online', className: 'status online' },
  followBtn:  { textContent: 'Following', disabled: false,
                classList: { add: 'active', remove: 'inactive' } }
});
```

**What Just Happened?**

```
Elements.update({...})
   ↓
1️⃣  Looks up each element — uses cache if available (near-instant)
   ↓
2️⃣  Compares each value with the previous value
   ↓
3️⃣  Skips unchanged values — no redundant DOM writes
   ↓
4️⃣  Applies only what changed — targeted, efficient updates
   ↓
5️⃣  Caches results for the next call
```

**Benefits:**
✅ One clear block — the entire state transition in one readable place
✅ Intelligent caching — elements remembered after first lookup
✅ Change detection — same value? Nothing written to the DOM
✅ Declarative intent — you describe the *target state*, not the steps to reach it

---

## Mental Model: The Smart Receptionist

Think of your HTML page as a large office building with many rooms (elements). Without DOMHelpers Core, you wander the building yourself every time:

```
You, every time:
"I need to find Room userName..."
   → Walk through every corridor
   → Find the room
   → Make the change
   → Walk back

"Now I need Room userEmail..."
   → Walk through every corridor again
   → ...
```

**With DOMHelpers Core**, there's a smart receptionist at the front desk:

```
You: "I need userName, userEmail, and followBtn"
                           ↓
Receptionist: "userName? I know where that is" ← cache hit ✨
Receptionist: "userEmail? Let me look it up..."  ← cache miss, looked up
Receptionist: "followBtn? Right here"            ← cache hit ✨
                           ↓
"Here are all three — I've noted their current state.
 I'll only write what's actually different from last time."
```

The receptionist (DOMHelpers Core) **remembers** where things are, **notices DOM changes**, and **only reports real changes** — not ones you already made.

---

## How Does It Work? — Under the Hood

DOMHelpers Core runs on **three internal systems** working together:

### System 1: The Proxy (Magic Property Access)

When you write `Elements.title`, a JavaScript `Proxy` intercepts that property access and automatically converts it into a `getElementById('title')` call — with caching and `.update()` enhancement built in.

```
Elements.title
   ↓
Proxy intercepts: "accessed .title"
   ↓
Checks cache: is 'title' in the Map?
  [HIT]  → Return from cache instantly ✨
  [MISS] → document.getElementById('title') → store → return
```

### System 2: The Cache (Map + WeakMap)

```
First access:  Elements.title
   → getElementById('title')     ← goes to DOM
   → Stored in cache Map         ← remembered for next time

Second access: Elements.title
   → Checks cache Map            ← found!
   → Is element still in DOM?    ← verified
   → Returns from cache ✨       ← no DOM traversal
```

The cache uses a `Map` for fast lookups and a `WeakMap` for metadata. The `WeakMap` lets JavaScript automatically garbage-collect data when elements are removed from the page — so there are no memory leaks.

### System 3: The MutationObserver (Auto-Invalidation)

```
DOM changes (element added/removed)
   ↓
MutationObserver fires
   ↓
Affected IDs/classes/selectors removed from cache
   ↓
Next access does a fresh DOM lookup
```

This means the cache is always fresh. If your JavaScript dynamically adds or removes elements, DOMHelpers Core knows — you never get a stale reference.

---

## Key Insight: Everything Gets `.update()`

Here's what makes the library feel consistent: **every element or collection you get back has a `.update()` method** automatically attached to it.

```javascript
// Element from Elements helper:
const btn = Elements.submitBtn;
btn.update({ textContent: 'Submit', disabled: false });

// Collection from Collections helper:
const cards = Collections.ClassName.card;
cards.update({ classList: { add: 'loaded' } });  // applies to ALL cards

// Element from Selector helper:
const input = Selector.query('input[type="email"]');
input.update({ value: '', disabled: false });
```

**Same method. Different sources. Consistent experience.** ✨

---

## When to Use Which Helper

| Helper | Best For | Example |
|--------|---------|---------|
| **Elements** | One specific element you know by its `id` | `Elements.submitBtn` |
| **Collections** | All elements of a class, tag, or name | `Collections.ClassName.btn` |
| **Selector** | Complex CSS targeting — combinators, pseudo-classes | `Selector.query('.container > p:first-child')` |

```javascript
// Has a unique ID? → Elements
const btn = Elements.submitBtn;

// Multiple elements sharing a class? → Collections
const allCards = Collections.ClassName.card;

// Need complex CSS targeting? → Selector
const activeInput = Selector.query('form input:not([disabled])');
```

---

## Summary

Here's everything you need to remember before moving on:

1. **DOMHelpers Core** is one file — three helpers: `Elements`, `Collections`, `Selector`
2. **Elements** finds by ID — with automatic caching and `.update()` built in
3. **Collections** finds by class, tag, or name — returns smart groups with array methods
4. **Selector** wraps `querySelector`/`querySelectorAll` — with caching and `.update()`
5. **`.update()`** is universal — change text, style, classes, attributes, events in one call
6. **Smart caching** speeds up repeated access — `Map` for lookups, `WeakMap` for metadata
7. **MutationObserver** keeps the cache fresh when the DOM changes
8. **Change detection** skips writes for values that didn't actually change