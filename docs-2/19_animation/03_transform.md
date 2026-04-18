[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Transform Animations

## Quick Start (30 seconds)

```javascript
// Slide an element to the right
await Elements.panel.transform({ translateX: '100px' });

// Rotate an icon
await Elements.arrowIcon.transform({ rotate: '180deg' });

// Scale a button up on hover
await Elements.buyBtn.transform({ scale: 1.1 }, { duration: 150 });

// Multiple transforms at once
await Elements.card.transform({
  translateY: '-20px',
  scale: 1.05
}, { duration: 300 });
```

---

## What Is `.transform()`?

`.transform(transformations, options)` applies CSS `transform` properties to an element with a smooth transition. It supports all common CSS transform functions: translate, rotate, scale, and skew.

Think of it as saying: **"Move/rotate/scale this element by this amount, and animate the change smoothly."**

---

## Why Does This Exist?

### Applying CSS Transforms Manually

```javascript
const card = document.getElementById('card');

// Apply transition first
card.style.transition = 'transform 300ms ease';

// Apply the transform
card.style.transform = 'translateY(-20px) scale(1.05)';

// Clean up after animation
card.addEventListener('transitionend', () => {
  card.style.removeProperty('transition');
  card.style.removeProperty('transform');
}, { once: true });
```

**Problems:**
❌ Building the transform string manually is error-prone
❌ You must clean up inline styles yourself
❌ Vendor prefixes (WebkitTransform, etc.) must be handled per browser
❌ No automatic queue — parallel calls fight over the `transform` property

### The Transform Method Way

```javascript
await Elements.card.transform({ translateY: '-20px', scale: 1.05 });
```

✅ Pass an object — the module builds the CSS string
✅ Inline styles cleaned up automatically (when `cleanup: true`)
✅ Vendor prefixes applied automatically
✅ Queued by default to prevent conflicts

---

## Syntax

```javascript
await element.transform(transformations, options);

// or via Animation namespace (for raw elements)
await Animation.transform(element, transformations, options);
```

**`transformations`** — an object where keys are CSS transform functions:

```javascript
{
  translateX: '100px',
  translateY: '-50%',
  translateZ: '0',
  translate:  ['10px', '20px'],   // shorthand for translateX + translateY
  translate3d: ['0', '0', '-100px'],

  scale:  1.2,
  scaleX: 0.5,
  scaleY: 2,

  rotate:  '90deg',
  rotateX: '45deg',
  rotateY: '30deg',
  rotateZ: '-15deg',

  skew:  '10deg',
  skewX: '15deg',
  skewY: '-5deg'
}
```

---

## Transform Examples

### Translate (Move)

```javascript
// Move right by 100px
await Elements.panel.transform({ translateX: '100px' });

// Move up by 50%
await Elements.card.transform({ translateY: '-50%' });

// Move diagonally
await Elements.element.transform({
  translateX: '30px',
  translateY: '-30px'
});

// 2D shorthand (pass an array)
await Elements.element.transform({ translate: ['30px', '-30px'] });

// 3D translate
await Elements.element.transform({ translate3d: ['0', '0', '-100px'] });
```

### Rotate

```javascript
// Rotate clockwise 90 degrees
await Elements.arrowIcon.transform({ rotate: '90deg' });

// Rotate counter-clockwise
await Elements.refreshIcon.transform({ rotate: '-360deg' });

// Flip chevron arrow (common accordion pattern)
await Elements.chevron.transform({
  rotate: isOpen ? '180deg' : '0deg'
}, { duration: 200 });

// 3D rotations
await Elements.cube.transform({ rotateY: '45deg' });
```

### Scale

```javascript
// Grow slightly on hover
await Elements.button.transform({ scale: 1.1 }, { duration: 150 });

// Shrink on press
await Elements.button.transform({ scale: 0.95 }, { duration: 100 });

// Scale back to normal
await Elements.button.transform({ scale: 1 });

// Scale on one axis only
await Elements.divider.transform({ scaleX: 0 }); // collapse width
await Elements.divider.transform({ scaleX: 1 }); // restore width
```

### Skew

```javascript
// Italic-like tilt effect
await Elements.label.transform({ skewX: '15deg' });

// Reset skew
await Elements.label.transform({ skewX: '0deg' });
```

### Combining Multiple Transforms

When you pass multiple keys, they all apply together as a single transform:

```javascript
// Rise and grow at the same time (card hover effect)
await Elements.card.transform({
  translateY: '-8px',
  scale: 1.03
}, { duration: 200 });

// Rotate and scale simultaneously
await Elements.icon.transform({
  rotate: '45deg',
  scale:  0.8
}, { duration: 300 });
```

---

## The `cleanup` Option

By default, `cleanup: true` removes the inline `transform` style after the animation completes. This means the element returns to wherever it was positioned by CSS:

```javascript
// After this, the element snaps back to its original CSS position
await Elements.panel.transform({ translateX: '50px' });
// transform style is removed — element returns to original position

// To keep the final state, use cleanup: false
await Elements.panel.transform(
  { translateX: '50px' },
  { cleanup: false }
);
// transform stays applied — element remains at the new position
```

This is an important distinction:

```
cleanup: true  (default)
├── Animate to transform
├── Wait for transition
├── Remove transform style
└── Element returns to CSS-defined position

cleanup: false
├── Animate to transform
├── Wait for transition
├── Keep transform style
└── Element stays at new position
```

---

## Real-World Examples

### Accordion Arrow

```javascript
let isOpen = false;

document.getElementById('accordionHeader').addEventListener('click', async () => {
  isOpen = !isOpen;

  // Rotate the arrow icon based on state
  await Elements.accordionArrow.transform(
    { rotate: isOpen ? '180deg' : '0deg' },
    { duration: 250, cleanup: false }  // keep the state
  );

  // Toggle the content
  await Elements.accordionContent.slideToggle({ duration: 300 });
});
```

### Button Press Effect

```javascript
const btn = Elements.submitButton;

btn.addEventListener('mousedown', () => {
  Elements.submitButton.transform({ scale: 0.96 }, { duration: 80, cleanup: false });
});

btn.addEventListener('mouseup', () => {
  Elements.submitButton.transform({ scale: 1 }, { duration: 100, cleanup: false });
});
```

### Card Hover Effect with CSS + Transform

```javascript
document.querySelectorAll('.product-card').forEach(card => {
  const enhanced = Animation.enhance(card);

  card.addEventListener('mouseenter', () => {
    enhanced.transform(
      { translateY: '-6px', scale: 1.02 },
      { duration: 200, cleanup: false }
    );
  });

  card.addEventListener('mouseleave', () => {
    enhanced.transform(
      { translateY: '0px', scale: 1 },
      { duration: 200, cleanup: false }
    );
  });
});
```

### Shake Animation (Error Feedback)

```javascript
async function shakeElement(element) {
  const steps = [
    { translateX: '-10px' },
    { translateX: '10px' },
    { translateX: '-8px' },
    { translateX: '8px' },
    { translateX: '0px' }
  ];

  for (const step of steps) {
    await element.transform(step, { duration: 60, easing: 'ease-in-out', cleanup: false });
  }

  // Final cleanup
  await element.transform({ translateX: '0px' }, { duration: 60, cleanup: true });
}

// Usage:
shakeElement(Elements.loginForm);
```

---

## Browser Support Detection

```javascript
// Check if transforms are supported
if (Animation.isSupported('transforms')) {
  console.log('CSS transforms are available');
}

// If not supported, the transform method:
// - Logs a warning
// - Waits for the expected duration (so your code flow still works)
// - Does not apply any styles
```

---

## Summary

| Transform | Example value | What it does |
|---|---|---|
| `translateX` | `'100px'`, `'-50%'` | Horizontal movement |
| `translateY` | `'-20px'`, `'100%'` | Vertical movement |
| `translateZ` | `'-100px'` | Depth (3D) |
| `translate` | `['10px', '20px']` | X + Y shorthand |
| `translate3d` | `['0', '0', '-50px']` | X + Y + Z |
| `scale` | `1.1`, `0.8` | Uniform scale |
| `scaleX` / `scaleY` | `0.5`, `2` | Single-axis scale |
| `rotate` | `'45deg'`, `'-180deg'` | 2D rotation |
| `rotateX/Y/Z` | `'30deg'` | 3D rotation |
| `skewX` / `skewY` | `'15deg'` | Skew/shear |

**Key options:**
- `cleanup: false` — keep the final transform applied
- `cleanup: true` (default) — remove inline styles after animation
- `queue: false` — skip the animation queue (run in parallel)
