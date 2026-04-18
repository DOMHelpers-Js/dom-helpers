[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Fade and Slide Animations

## Quick Start (30 seconds)

```javascript
// Fade in
await Elements.myPanel.fadeIn({ duration: 300 });

// Fade out (hides element after)
await Elements.myPanel.fadeOut({ duration: 300 });

// Slide down (show by expanding height)
await Elements.dropdown.slideDown();

// Slide up (hide by collapsing height)
await Elements.dropdown.slideUp();

// Toggle based on current state
await Elements.sidebar.slideToggle();

// With a stagger on a collection
await Collections.byClass.cards.fadeIn({ duration: 300, stagger: 80 });
```

---

## `fadeIn()` — Show an Element by Fading In

`fadeIn()` transitions the element's opacity from `0` to `1`. If the element is currently hidden (`display: none`), it makes it visible first.

### Syntax

```javascript
await element.fadeIn(options);

// or
await Animation.fadeIn(element, options);
```

### What Happens Internally

```
element.fadeIn()
        ↓
Is element hidden (display: none)?
   └── Yes: set display to natural value (e.g. 'block', 'flex')
        ↓
Set opacity: 0
Force reflow (so transition sees the start state)
        ↓
Set transition: opacity 300ms ease
Set opacity: 1
        ↓
Wait for transitionend event (with 50ms safety-net timeout)
        ↓
Clean up: remove transition + opacity inline styles
        ↓
Promise resolves → element is fully visible ✅
```

### Basic Examples

```javascript
// Simple fade in
await Elements.welcomeBanner.fadeIn();

// Slower fade
await Elements.heroImage.fadeIn({ duration: 800 });

// Fade in with a delay (useful for staggered entry without a collection)
await Elements.subtitle.fadeIn({ delay: 200, duration: 500 });

// Fade in and do something after
await Elements.modal.fadeIn({ duration: 300 });
console.log('Modal is now visible');

// Fade in with a callback inside the options
Elements.notification.fadeIn({
  duration:   300,
  onComplete: (el) => console.log('Faded in:', el.id)
});
```

### Starting From a Hidden Element

```javascript
// If your element starts hidden via CSS or inline style
// <div id="panel" style="display:none">...</div>

// fadeIn automatically reveals it
await Elements.panel.fadeIn();
// → display is restored to its natural value (block, flex, etc.)
```

---

## `fadeOut()` — Hide an Element by Fading Out

`fadeOut()` transitions opacity from its current value to `0`, then sets `display: none` to fully hide the element.

### Syntax

```javascript
await element.fadeOut(options);

// or
await Animation.fadeOut(element, options);
```

### Basic Examples

```javascript
// Simple fade out
await Elements.toast.fadeOut();

// Fade out without hiding (keep display, just go transparent)
await Elements.overlay.fadeOut({ hide: false });

// Fade out quickly
await Elements.tooltip.fadeOut({ duration: 150 });
```

### The `hide` Option

By default, `fadeOut` sets `display: none` after the fade completes. Use `hide: false` to keep the element in the layout (occupying space) but invisible:

```javascript
// Hides the element completely (default)
await Elements.notification.fadeOut();
// → opacity: 0, display: none

// Just makes it invisible, keeps its space
await Elements.placeholder.fadeOut({ hide: false });
// → opacity: 0, display still 'block' (or whatever it was)
```

---

## `slideDown()` — Show an Element by Expanding Height

`slideDown()` reveals a hidden element by expanding its height (and restoring padding/margins) from `0` to the element's natural height. It's the classic "accordion open" animation.

### Syntax

```javascript
await element.slideDown(options);

// or
await Animation.slideDown(element, options);
```

### What Happens Internally

```
element.slideDown()
        ↓
Determine natural display value
(flex? grid? inline-block? — restores the right display type)
        ↓
Set display to natural value (reveal in DOM)
Measure natural height, padding, margins
        ↓
Collapse to: height:0, padding:0, margin:0, overflow:hidden
Force reflow
        ↓
Set transition on height + padding-top + padding-bottom + margin-top + margin-bottom
Animate to natural values
        ↓
Wait for transition
        ↓
Clean up inline styles — element fills its natural space ✅
```

### Basic Examples

```javascript
// Open a dropdown
await Elements.dropdownMenu.slideDown();

// Open with custom duration
await Elements.accordion.slideDown({ duration: 500, easing: 'ease-out-cubic' });

// Show details section
document.getElementById('detailsToggle').addEventListener('click', async () => {
  await Elements.detailsPanel.slideDown({ duration: 300 });
});
```

### Natural Display Restoration ✨

A key design detail: `slideDown` restores the element's **natural** display value — not just `'block'`. If your element was a `flex` container before hiding, it becomes `flex` again after `slideDown`:

```javascript
// <div id="flexContainer" style="display: flex">...</div>
Elements.flexContainer.slideUp(); // collapses it

// Later:
Elements.flexContainer.slideDown();
// → restores display: flex (not display: block!)
```

---

## `slideUp()` — Hide an Element by Collapsing Height

`slideUp()` hides an element by animating its height (and padding/margins) to `0`, then setting `display: none`.

### Syntax

```javascript
await element.slideUp(options);

// or
await Animation.slideUp(element, options);
```

### Basic Examples

```javascript
// Close a dropdown
await Elements.dropdownMenu.slideUp();

// Close with duration
await Elements.expandedSection.slideUp({ duration: 400 });

// Close and act on completion
await Elements.panel.slideUp();
Elements.panel.update({ text: 'Section hidden' });
```

---

## `slideToggle()` — Automatically Toggle Slide State

`slideToggle()` detects whether the element is currently visible or hidden and calls `slideDown` or `slideUp` accordingly. This is perfect for toggle buttons:

```javascript
// Automatically opens if closed, closes if open
document.getElementById('toggleBtn').addEventListener('click', async () => {
  await Elements.sidebar.slideToggle({ duration: 300 });
});
```

### How Visibility Is Detected

The element is considered **visible** if:
- Its computed `display` is not `'none'`
- Its `offsetHeight` is greater than `0`

If either condition is false, the element is considered hidden and `slideDown` runs. Otherwise, `slideUp` runs.

---

## Collection Animations

All fade and slide methods work on collections, running the animation on every element concurrently:

### Basic Collection Animation

```javascript
// Fade in all elements with class "card"
await Collections.byClass.cards.fadeIn({ duration: 300 });

// Slide up all accordion panels
await Collections.byClass.panels.slideUp({ duration: 250 });
```

### Stagger — Cascade Effect

The `stagger` option adds an increasing delay to each element in the collection, creating a cascade effect:

```javascript
await Collections.byClass.cards.fadeIn({
  duration: 300,
  stagger:  100   // each element starts 100ms after the previous one
});

// First card:  starts at 0ms
// Second card: starts at 100ms
// Third card:  starts at 200ms
// Fourth card: starts at 300ms
```

```
┌────────────────────────────────────────────────────────┐
│ Card 1 ══════════ fadeIn (0ms → 300ms)                 │
│ Card 2     ══════════ fadeIn (100ms → 400ms)           │
│ Card 3         ══════════ fadeIn (200ms → 500ms)       │
│ Card 4             ══════════ fadeIn (300ms → 600ms)   │
└────────────────────────────────────────────────────────┘
```

```javascript
// Stagger with an initial delay
await Collections.byClass.menuItems.slideDown({
  duration: 200,
  delay:    100,     // all start after 100ms
  stagger:  50       // then stagger by 50ms each
});
```

---

## Awaiting Animations

All methods return Promises, so you can chain logic after the animation completes:

```javascript
// Sequential using await
await Elements.oldContent.fadeOut();
await Elements.newContent.fadeIn();
console.log('Content swap complete');

// Or using .then()
Elements.notification.fadeIn()
  .then(() => {
    // Do something after fade in
    setTimeout(() => Elements.notification.fadeOut(), 3000);
  });
```

### Parallel Animations

Run multiple independent animations at the same time using `Promise.all`:

```javascript
// Fade out two elements simultaneously
await Promise.all([
  Elements.headerPanel.fadeOut(),
  Elements.footerPanel.fadeOut()
]);

console.log('Both hidden at the same time');
```

---

## Real-World Example: Animated Modal

```javascript
const modal    = Elements.myModal;
const overlay  = Elements.modalOverlay;
const closeBtn = document.getElementById('closeModal');

// Open the modal
async function openModal() {
  await Promise.all([
    overlay.fadeIn({ duration: 200 }),
    modal.slideDown({ duration: 350, easing: 'ease-out-back' })
  ]);
}

// Close the modal
async function closeModal() {
  await Promise.all([
    modal.slideUp({ duration: 250 }),
    overlay.fadeOut({ duration: 200 })
  ]);
}

closeBtn.addEventListener('click', closeModal);
```

---

## Real-World Example: Toast Notification

```javascript
async function showToast(message) {
  const toast = Elements.toastNotification;
  toast.update({ text: message });

  // Slide down to show
  await toast.slideDown({ duration: 300, easing: 'ease-out-back' });

  // Wait 3 seconds
  await new Promise(r => setTimeout(r, 3000));

  // Fade out to hide
  await toast.fadeOut({ duration: 400 });
}

showToast('Settings saved successfully!');
```

---

## Summary

| Method | What it does | Hides after? |
|---|---|---|
| `fadeIn()` | opacity 0 → 1, reveals display | ✗ |
| `fadeOut()` | opacity 1 → 0, hides element | ✅ (default) |
| `fadeOut({ hide: false })` | opacity 1 → 0, keeps display | ✗ |
| `slideDown()` | height 0 → natural, reveals element | ✗ |
| `slideUp()` | height natural → 0, hides element | ✅ |
| `slideToggle()` | auto-detects state, reverses it | depends |

All accept `{ duration, delay, easing, queue, cleanup, onComplete }` options.
Collections additionally accept `{ stagger }` for cascading effects.
