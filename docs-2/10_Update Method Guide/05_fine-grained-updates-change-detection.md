[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Fine-Grained Updates & Change Detection

One of the most powerful — and automatic — features of `.update()` is its built-in **change detection**. It quietly skips DOM writes when nothing has actually changed, keeping your app fast without any extra effort.

---

## Quick Start (30 Seconds)

```javascript
// Call update as many times as you want
// It only writes to the DOM when values actually change

element.update({ textContent: 'Hello' });  // ✅ DOM write — first time
element.update({ textContent: 'Hello' });  // ⚡ Skipped — same value
element.update({ textContent: 'World' });  // ✅ DOM write — value changed
element.update({ textContent: 'World' });  // ⚡ Skipped — same value again
```

That's change detection in a nutshell. No configuration needed — it just works.

---

## What Is Change Detection?

**Change detection** is the system inside `.update()` that compares the value you're trying to set against the value that was set last time. If they're the same, it skips the DOM write entirely.

Think of it as a **smart gate** before each property update:

```
You call:  element.update({ color: 'red' })
                       │
                       ▼
          ┌─────────────────────────────┐
          │  Was color 'red' last time? │
          └─────────────────────────────┘
               │              │
              YES              NO
               │              │
               ▼              ▼
           ⚡ Skip        ✅ Write to DOM
         (no DOM write)  element.style.color = 'red'
```

This happens for **every single property** in every update object, automatically.

---

## Syntax

Change detection is **not a feature you enable** — it's always running:

```javascript
// No special syntax needed
element.update({ textContent: 'value' });
// Change detection is always active

// You can call this safely in loops, rapid events, render cycles
function render(state) {
  Elements.update({
    counter: { textContent: state.count.toString() },
    status: { textContent: state.status }
  });
}

// Safe to call every 16ms — only changed values write to DOM
setInterval(() => render(getState()), 16);
```

---

## Why Does This Exist?

### When Calling `render()` Frequently Is Your Pattern

In modern UIs, you often call a render function repeatedly — on every state change, on every tick, or in response to frequent events like scroll or input:

```javascript
// A simple render function called frequently
function renderCounter(count) {
  Elements.counter.update({ textContent: count.toString() });
}

// Called on every keystroke
input.addEventListener('input', () => {
  renderCounter(currentCount);  // Re-renders even if count hasn't changed
});
```

Without change detection, every call to `.update()` would write to the DOM — even when nothing changed. DOM writes are expensive: they can trigger **layout recalculation**, **repainting**, and **reflows** — all of which slow down the browser.

### When Automatic Optimization Is Your Goal

Change detection turns every update into a **safe, idempotent operation** — calling it with the same values twice has the same effect as calling it once:

```javascript
// All three of these produce identical DOM state
// Only the first one actually writes
Elements.status.update({ textContent: 'Loading' });
Elements.status.update({ textContent: 'Loading' });
Elements.status.update({ textContent: 'Loading' });
```

**This is especially useful when:**
✅ You have a `render()` function called from multiple places
✅ You're running updates inside animation loops (`requestAnimationFrame`)
✅ You're responding to frequent events (scroll, resize, input, mousemove)
✅ Multiple parts of your code update the same element independently
✅ You want to simplify your code by removing manual "did-it-change?" checks

**The Choice Is Yours:**
- Write manual change guards (`if (lastValue !== newValue)`) when you need explicit control
- Rely on built-in change detection when you want automatic optimization
- Both approaches are valid — change detection just removes the boilerplate

**Benefits of built-in change detection:**
✅ Zero extra code required
✅ Fine-grained (per-property, not per-element)
✅ Automatic DOM write skipping
✅ Works transparently in render loops
✅ Eliminates entire category of manual tracking bugs

---

## Mental Model: The Traffic Light Filter

Imagine `.update()` is a **traffic control system** at a road intersection. Every property update is a car trying to pass through.

Before any car (update) enters the intersection (DOM), it goes through a **filter checkpoint**:

```
Car (update value) arrives
         │
         ▼
┌────────────────────────────────┐
│  Is this the same car that     │
│  went through last time?       │
│  (Same value as before?)       │
└────────────────────────────────┘
         │
    ┌────┴────┐
    YES       NO
    │         │
    ▼         ▼
  🔴 STOP   🟢 GO
  (skip)   (write)
```

The checkpoint has a **memory** — it remembers what went through last time. Only new cars (changed values) get to pass. Repeat cars (same values) are stopped at the gate.

---

## How Does It Work?

### The Storage Mechanism: WeakMap

Change detection uses a **WeakMap** — a JavaScript data structure that maps objects (DOM elements) to stored data, and automatically cleans up when elements are removed from memory.

```
WeakMap<HTMLElement, Map<propertyKey, lastValue>>

Example state:
{
  <button#submitBtn>: {
    "textContent": "Submit",
    "disabled": false,
    "style.color": "blue"
  },
  <div#status>: {
    "textContent": "Ready",
    "style.display": "block"
  }
}
```

Every time `.update()` writes a value to the DOM, it also stores that value in the WeakMap. On the next call, it checks the WeakMap before writing.

### The Comparison Logic

```
1. Receive update: element.update({ textContent: 'Hello' })
         │
         ▼
2. For each key in update object:
   - key = "textContent", value = "Hello"
         │
         ▼
3. Look up stored value in WeakMap:
   - weakMap.get(element).get("textContent") → "Hello" (previously stored)
         │
         ▼
4. Compare: "Hello" === "Hello"?
   - YES → Skip DOM write, move to next key
   - NO  → Write to DOM, update stored value in WeakMap
         │
         ▼
5. After all keys processed: return element
```

### Strict Equality (`===`)

Change detection uses **strict equality** for comparison:

```javascript
element.update({ disabled: false });   // Stores: false
element.update({ disabled: false });   // false === false → Skip ✓
element.update({ disabled: 0 });       // 0 === false → NO (type mismatch) → Write
element.update({ textContent: '' });   // Stores: ''
element.update({ textContent: '' });   // '' === '' → Skip ✓
```

### Deep Comparison for Objects and Arrays

For nested objects (like `style`) and arrays, strict equality would always fail (since `{} !== {}`). So change detection uses **deep comparison** instead:

```javascript
// Objects — deep comparison
element.update({ style: { color: 'red', fontSize: '16px' } });
// Stores: { color: 'red', fontSize: '16px' }

element.update({ style: { color: 'red', fontSize: '16px' } });
// Deep equal: ✓ Skip — same properties, same values

element.update({ style: { color: 'blue', fontSize: '16px' } });
// Deep equal fails: ✗ Write — color changed
```

---

## How Fine-Grained Is It?

Change detection is applied **per property**, not per element or per update call.

This means:

```javascript
element.update({
  textContent: 'Hello',   // ✅ Changed → writes
  disabled: false,        // ⚡ Same → skips
  style: { color: 'red' } // ⚡ Same → skips
});
```

Even though 3 keys are in the update object, only **1 DOM write** happens. Each property is checked independently.

### Per-Style-Property Granularity

For `style`, change detection goes even deeper — it tracks **each CSS property individually**:

```javascript
// First call
element.update({ style: { color: 'red', fontSize: '16px', display: 'block' } });
// Writes: color, fontSize, display

// Second call — only color changed
element.update({ style: { color: 'blue', fontSize: '16px', display: 'block' } });
// Writes: color only
// Skips:  fontSize, display
```

---

## Practical Impact: How Much Does It Help?

Consider a counter that updates every 100ms:

```javascript
let count = 0;
setInterval(() => {
  Elements.counter.update({
    textContent: count.toString(),   // Changes every tick
    style: { color: count > 10 ? 'red' : 'black' }  // Only changes at 11
  });
  count++;
}, 100);
```

Over 60 seconds (600 ticks):
- `textContent` DOM writes: 600 (changes every tick)
- `style.color` DOM writes: 1 (only changes when count reaches 11)

Without change detection, `style.color` would be written 600 times. With it: just 1.

---

## Patterns Enabled by Change Detection

### Pattern 1: Simple Render Function

```javascript
// Call this function whenever state changes
// No need to track what changed — change detection handles it
function render(state) {
  Elements.update({
    counter: { textContent: state.count.toString() },
    statusText: { textContent: state.message },
    submitBtn: { disabled: state.isLoading },
    errorMsg: {
      textContent: state.error || '',
      style: { display: state.error ? 'block' : 'none' }
    }
  });
}

// State management
let state = { count: 0, message: 'Ready', isLoading: false, error: null };

function setState(updates) {
  state = { ...state, ...updates };
  render(state);  // Re-render everything — change detection optimizes it
}
```

### Pattern 2: Animation Loops

```javascript
function animationLoop() {
  const progress = getAnimationProgress();

  // Safe to call every 16ms — only changed values trigger DOM writes
  Elements.progressBar.update({
    style: {
      width: `${progress * 100}%`,
      backgroundColor: progress > 0.8 ? '#16a34a' : '#3b82f6'
    }
  });

  if (progress < 1) {
    requestAnimationFrame(animationLoop);
  }
}

requestAnimationFrame(animationLoop);
```

### Pattern 3: Reactive State with Observer

```javascript
class ReactiveState {
  constructor(initialState) {
    this._state = initialState;
  }

  set(updates) {
    this._state = { ...this._state, ...updates };
    this._render();  // Always re-render; change detection does the optimization
  }

  _render() {
    Elements.update({
      header: { textContent: this._state.title },
      userCount: { textContent: `${this._state.count} users` },
      badge: {
        textContent: this._state.badge,
        classList: {
          add: this._state.isNew ? 'new-badge' : 'old-badge',
          remove: this._state.isNew ? 'old-badge' : 'new-badge'
        }
      }
    });
  }
}

const appState = new ReactiveState({ title: 'My App', count: 0, badge: '', isNew: false });

// Call set() freely — only actual changes hit the DOM
appState.set({ count: 1 });   // Only userCount writes
appState.set({ count: 1 });   // Nothing writes (same state)
appState.set({ title: 'New Title' });  // Only header writes
```

### Pattern 4: High-Frequency Event Handling

```javascript
// Scroll handler — fires constantly
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const scrollPercent = Math.round((scrollY / document.body.scrollHeight) * 100);

  // Safe to call on every scroll event
  // DOM writes only happen when scrollPercent actually changes
  Elements.scrollIndicator.update({
    style: { width: `${scrollPercent}%` }
  });

  Elements.scrollLabel.update({
    textContent: `${scrollPercent}%`
  });

  // Header shadow: only changes when crossing 50px threshold
  Elements.header.update({
    classList: {
      add: scrollY > 50 ? 'shadow' : '',
      remove: scrollY > 50 ? '' : 'shadow'
    }
  });
});
```

### Pattern 5: Eliminating Manual Change Tracking

Before change detection, you'd write:

```javascript
// ❌ Manual tracking — verbose and error-prone
let lastCount = null;
let lastMessage = null;
let lastError = null;

function render(state) {
  if (lastCount !== state.count) {
    Elements.counter.update({ textContent: state.count.toString() });
    lastCount = state.count;
  }
  if (lastMessage !== state.message) {
    Elements.status.update({ textContent: state.message });
    lastMessage = state.message;
  }
  if (lastError !== state.error) {
    Elements.error.update({
      textContent: state.error || '',
      style: { display: state.error ? 'block' : 'none' }
    });
    lastError = state.error;
  }
}
```

With change detection:

```javascript
// ✅ Let change detection handle it — clean and simple
function render(state) {
  Elements.update({
    counter: { textContent: state.count.toString() },
    status: { textContent: state.message },
    error: {
      textContent: state.error || '',
      style: { display: state.error ? 'block' : 'none' }
    }
  });
}
// That's it — no manual tracking variables, no if-statements, no bugs
```

---

## Edge Cases and Gotchas

### Gotcha 1: First Call Always Writes

The first time you update a property, there's no stored "previous value" yet — so it always writes on the first call:

```javascript
// First call — always writes (no previous value stored)
element.update({ textContent: 'Hello' });  // ✅ DOM write

// Second call with same value — skips
element.update({ textContent: 'Hello' });  // ⚡ Skip
```

This is the expected behavior — you always want the first call to apply.

### Gotcha 2: New Object References

For style and other object values, a new object with the same content is detected as "no change" (deep comparison):

```javascript
const styleA = { color: 'red' };
const styleB = { color: 'red' };  // Different object, same content

element.update({ style: styleA });  // ✅ Writes
element.update({ style: styleB });  // ⚡ Skip — deep comparison: same content
```

### Gotcha 3: DOM Mutations Don't Reset Detection

If something else changes the DOM directly (outside of `.update()`), change detection won't know about it:

```javascript
element.update({ textContent: 'Hello' });    // Stores: 'Hello'
element.textContent = 'Direct mutation!';     // DOM changed — but not stored!
element.update({ textContent: 'Hello' });    // Sees stored 'Hello' === 'Hello' → Skip!
// DOM still shows 'Direct mutation!' — not updated!
```

**Best practice:** Always use `.update()` consistently. Don't mix `.update()` with direct DOM manipulation on the same properties.

### Gotcha 4: classList and toggle

Change detection for `classList.toggle` can be tricky because the "same" toggle instruction might produce different results depending on the current class state:

```javascript
element.update({ classList: { toggle: 'open' } });  // Adds 'open'
element.update({ classList: { toggle: 'open' } });  // Skips! (same instruction stored)
// But you wanted to toggle it off!
```

For toggling, it's better to use the `force` option or use add/remove based on state:

```javascript
// ✅ Better — explicit state-based add/remove
element.update({ classList: { add: isOpen ? 'open' : '', remove: isOpen ? '' : 'open' } });

// Or use force toggle
element.update({ classList: { toggle: { class: 'open', force: shouldBeOpen } } });
```

---

## Understanding "Fine-Grained"

The term "fine-grained" refers to the **granularity level** at which change detection operates.

```
Coarse-grained:      Fine-grained:
─────────────────    ─────────────────────────────────
Update entire        Update individual
component → DOM      properties → DOM only if changed
write always         write if changed

Coarser:             Finer:
re-render component  re-render specific CSS property
```

`.update()` is "fine-grained" because it doesn't just check "did the whole update object change?" — it checks **each individual property** within the update object. This means:

```javascript
element.update({
  textContent: 'Same',            // ⚡ Skip (unchanged)
  disabled: false,                 // ⚡ Skip (unchanged)
  style: {
    color: 'red',                  // ⚡ Skip (unchanged)
    fontSize: '18px',              // ✅ Write (changed!)
    backgroundColor: 'white'       // ⚡ Skip (unchanged)
  },
  classList: { add: 'active' }     // ⚡ Skip (already has class)
});
// Result: Only 1 DOM write happens (fontSize), despite 5+ keys in update object
```

---

## Summary

Fine-grained change detection is one of `.update()`'s most valuable automatic features:

- **Always active** — no configuration needed
- **Per-property** — each key checked independently, not the whole object
- **Per-style-property** — even CSS properties are tracked individually
- **Strict equality** for primitives, **deep comparison** for objects/arrays
- **WeakMap storage** — memory-safe, automatically cleaned up
- **Transparent** — works the same whether you call update once or 1000 times
- **Eliminates manual tracking** — no more `if (lastValue !== newValue)` guards
- **Enables render patterns** — call `render()` freely; change detection optimizes

The practical result: **write simpler, more declarative code** and let change detection handle the optimization.

---

## What's Next?

Next chapter: **Method Calls Through Update** — how to call DOM methods like `focus()`, `scrollIntoView()`, and `animate()` directly from an update object.