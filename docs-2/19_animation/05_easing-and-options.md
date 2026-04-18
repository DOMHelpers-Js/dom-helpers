[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Easing Curves and Animation Options

## Quick Start (30 seconds)

```javascript
// Standard CSS easings
await Elements.panel.fadeIn({ easing: 'ease-in-out' });

// Named curves — bounce-like entry
await Elements.modal.slideDown({ easing: 'ease-out-back' });

// Fast deceleration
await Elements.toast.slideDown({ easing: 'ease-out-expo' });

// Change global defaults for all animations
Animation.setDefaults({
  duration: 400,
  easing:   'ease-out-cubic'
});
```

---

## The Options Object

Every animation method accepts an options object with these properties:

```javascript
element.fadeIn({
  duration:   300,          // number  — animation length in milliseconds
  delay:      0,            // number  — delay before starting, in milliseconds
  easing:     'ease',       // string  — easing name or cubic-bezier(...)
  cleanup:    true,         // boolean — remove inline styles after animation
  queue:      true,         // boolean — queue this animation on the element
  onComplete: (el) => {}   // function — called when the animation finishes
});
```

---

## `duration` — How Long the Animation Runs

```javascript
// Very fast (subtle micro-interaction)
element.fadeIn({ duration: 100 });

// Default
element.fadeIn({ duration: 300 });

// Slow and dramatic
element.fadeIn({ duration: 1000 });

// No animation — instant change
element.fadeIn({ duration: 0 });
```

**Guideline:**
- `100–150ms` — micro-interactions (button press, tooltip)
- `200–300ms` — standard UI transitions (default range)
- `400–600ms` — content transitions, modals
- `700ms+` — dramatic reveals, page transitions

---

## `delay` — When to Start

```javascript
// Start immediately (default)
element.fadeIn({ delay: 0 });

// Start after 500ms
element.fadeIn({ delay: 500 });

// Combine with stagger on collections
Collections.byClass.cards.fadeIn({ duration: 300, delay: 100, stagger: 80 });
// Each card starts at: 100ms, 180ms, 260ms, 340ms...
```

---

## `easing` — How the Animation Accelerates

Easing defines the rhythm of the animation — how it speeds up and slows down over its duration.

### Standard CSS Keywords

These pass through directly to CSS:

```javascript
element.fadeIn({ easing: 'ease' });          // default: slow start, fast middle, slow end
element.fadeIn({ easing: 'ease-in' });       // slow start, fast end
element.fadeIn({ easing: 'ease-out' });      // fast start, slow end
element.fadeIn({ easing: 'ease-in-out' });   // slow start and end, fast middle
element.fadeIn({ easing: 'linear' });        // constant speed
```

### Named Cubic-Bezier Curves

The module includes 30 named easing curves mapped to `cubic-bezier()` values:

#### Quadratic

```javascript
element.fadeIn({ easing: 'ease-in-quad' });
element.fadeIn({ easing: 'ease-out-quad' });
element.fadeIn({ easing: 'ease-in-out-quad' });
```

*Slightly stronger than the standard CSS `ease-in` / `ease-out`.*

#### Cubic

```javascript
element.fadeIn({ easing: 'ease-in-cubic' });
element.fadeIn({ easing: 'ease-out-cubic' });
element.fadeIn({ easing: 'ease-in-out-cubic' });
```

*Noticeably stronger acceleration/deceleration.*

#### Quartic

```javascript
element.fadeIn({ easing: 'ease-in-quart' });
element.fadeIn({ easing: 'ease-out-quart' });
element.fadeIn({ easing: 'ease-in-out-quart' });
```

*Strong, punchy feel.*

#### Quintic

```javascript
element.fadeIn({ easing: 'ease-in-quint' });
element.fadeIn({ easing: 'ease-out-quint' });
element.fadeIn({ easing: 'ease-in-out-quint' });
```

*Very strong acceleration — dramatic effect.*

#### Sine

```javascript
element.fadeIn({ easing: 'ease-in-sine' });
element.fadeIn({ easing: 'ease-out-sine' });
element.fadeIn({ easing: 'ease-in-out-sine' });
```

*Subtle, gentle — smoother than the standard CSS `ease`.*

#### Exponential

```javascript
element.fadeIn({ easing: 'ease-in-expo' });
element.fadeIn({ easing: 'ease-out-expo' });
element.fadeIn({ easing: 'ease-in-out-expo' });
```

*Almost instant acceleration/deceleration — great for snappy UI elements.*

#### Circular

```javascript
element.fadeIn({ easing: 'ease-in-circ' });
element.fadeIn({ easing: 'ease-out-circ' });
element.fadeIn({ easing: 'ease-in-out-circ' });
```

*Quarter-circle curve — smooth and natural-looking.*

#### Back (with overshoot)

```javascript
element.slideDown({ easing: 'ease-in-back' });
element.slideDown({ easing: 'ease-out-back' });
element.slideDown({ easing: 'ease-in-out-back' });
```

*Overshoots the target slightly before settling — great for playful, bouncy entry animations like modals sliding in.*

---

## Choosing the Right Easing

Here are common UI patterns and their recommended easings:

| Animation type | Recommended easing | Why |
|---|---|---|
| Elements entering the screen | `ease-out-cubic` or `ease-out-back` | Fast start, gradual landing |
| Elements leaving the screen | `ease-in-cubic` | Slow start, fast exit |
| Elements moving within the screen | `ease-in-out-cubic` | Smooth both ways |
| Subtle fades | `ease` or `ease-in-out-sine` | Gentle and natural |
| Snappy UI feedback | `ease-out-expo` | Instant feel |
| Playful/bouncy modals | `ease-out-back` | Fun overshoot |
| Progress bars | `linear` | Consistent speed |

```javascript
// Modal appearing (snappy entry)
Elements.modal.slideDown({ easing: 'ease-out-back', duration: 350 });

// Modal disappearing (fast exit)
Elements.modal.slideUp({ easing: 'ease-in-cubic', duration: 250 });

// Toast notification entering
Elements.toast.slideDown({ easing: 'ease-out-expo', duration: 300 });

// Content crossfade
Promise.all([
  Elements.oldContent.fadeOut({ easing: 'ease-in', duration: 200 }),
  Elements.newContent.fadeIn({ easing: 'ease-out', duration: 200 })
]);
```

---

## Custom `cubic-bezier()` Values

If none of the named curves fit, pass a raw `cubic-bezier()` string:

```javascript
element.fadeIn({ easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
// This is a spring-like bounce curve
```

---

## `queue` — Sequential vs Parallel

By default, animations on the same element are queued:

```javascript
// Sequential (default — queue: true)
Elements.panel.fadeIn();   // starts immediately
Elements.panel.slideDown(); // waits for fadeIn to finish
```

Set `queue: false` to bypass the queue and run animations in parallel:

```javascript
// Parallel — start both at the same time
Elements.panel.fadeIn({ queue: false });
Elements.panel.slideDown({ queue: false });
```

For most use cases, the default queue is what you want. Use `queue: false` only when you intentionally want animations to overlap.

---

## `cleanup` — Keeping or Removing Inline Styles

After an animation completes, inline styles added during the animation are removed by default (`cleanup: true`). This keeps your DOM clean and lets your CSS take over:

```javascript
// After this, no inline opacity or transition styles remain
await Elements.panel.fadeIn({ cleanup: true }); // default
```

Use `cleanup: false` when you want the final state to persist as inline styles:

```javascript
// Rotate an icon and keep it rotated
await Elements.arrow.transform(
  { rotate: '180deg' },
  { cleanup: false }   // keep the transform applied
);
```

---

## `onComplete` — Callback When Animation Finishes

```javascript
Elements.spinner.fadeOut({
  duration: 200,
  onComplete: (el) => {
    console.log('Spinner hidden, element:', el.id);
    // Trigger something after the animation
    loadData();
  }
});
```

`onComplete` is called with the element as the argument. You can use `await` instead for cleaner code:

```javascript
await Elements.spinner.fadeOut({ duration: 200 });
loadData(); // runs after fadeOut completes
```

---

## Global Defaults

Set defaults that apply to all subsequent animations:

```javascript
Animation.setDefaults({
  duration : 400,
  delay    : 0,
  easing   : 'ease-out-cubic',
  cleanup  : true,
  queue    : true,
});
```

Read current defaults:

```javascript
const defaults = Animation.getDefaults();
console.log(defaults);
// → { duration: 400, delay: 0, easing: 'ease-out-cubic', cleanup: true, queue: true }
```

Individual options always override the global defaults:

```javascript
// Global says 400ms, but this specific call overrides to 600ms
Elements.hero.fadeIn({ duration: 600 });
```

---

## The Full Easing Reference

```javascript
// Standard CSS keywords
'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'

// Named curves
'ease-in-quad',       'ease-out-quad',       'ease-in-out-quad'
'ease-in-cubic',      'ease-out-cubic',      'ease-in-out-cubic'
'ease-in-quart',      'ease-out-quart',      'ease-in-out-quart'
'ease-in-quint',      'ease-out-quint',      'ease-in-out-quint'
'ease-in-sine',       'ease-out-sine',       'ease-in-out-sine'
'ease-in-expo',       'ease-out-expo',       'ease-in-out-expo'
'ease-in-circ',       'ease-out-circ',       'ease-in-out-circ'
'ease-in-back',       'ease-out-back',       'ease-in-out-back'

// Access the full map
Animation.easing // → { 'ease-in-quad': 'cubic-bezier(...)', ... }
```

---

## Summary

| Option | Default | What it controls |
|---|---|---|
| `duration` | `300` | How long the animation runs (ms) |
| `delay` | `0` | How long to wait before starting (ms) |
| `easing` | `'ease'` | Acceleration/deceleration curve |
| `cleanup` | `true` | Remove inline styles after animation |
| `queue` | `true` | Queue or parallel mode |
| `onComplete` | `null` | Callback when animation finishes |
