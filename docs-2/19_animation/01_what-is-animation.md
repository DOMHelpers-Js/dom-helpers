[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# What Is the Animation Module?

## Quick Start (30 seconds)

```javascript
// Fade an element in
await Elements.myPanel.fadeIn();

// Slide an element up (collapse it)
await Elements.sidebar.slideUp({ duration: 400 });

// Chain animations in sequence
await Elements.notification
  .animate()
  .fadeIn({ duration: 200 })
  .delay(3000)
  .fadeOut({ duration: 300 })
  .play();

// Animate a collection with stagger
await Collections.byClass.cards.fadeIn({ duration: 300, stagger: 100 });
```

---

## What Is the Animation Module?

The Animation module adds **CSS transition-based animations** to every element and collection in the DOM Helpers library. Once loaded, elements have `fadeIn`, `fadeOut`, `slideUp`, `slideDown`, `slideToggle`, `transform`, `animate`, and `stopAnimations` methods — automatically.

Think of it as giving your DOM elements a **choreographer**. Instead of writing CSS transitions and JavaScript timing code by hand, you call methods on the element itself and it handles everything.

---

## Why Does This Exist?

### Animating Elements with Plain JavaScript

```javascript
// Fade in an element manually
const panel = document.getElementById('panel');
panel.style.opacity = '0';
panel.style.display = 'block';

// Force reflow so the transition triggers
panel.offsetHeight;

panel.style.transition = 'opacity 300ms ease';
panel.style.opacity = '1';

// Clean up inline styles after animation
panel.addEventListener('transitionend', () => {
  panel.style.removeProperty('transition');
  panel.style.removeProperty('opacity');
}, { once: true });
```

**Problems:**
❌ Every animation requires this same boilerplate
❌ `transitionend` may not fire in all browsers — you need a safety net
❌ Slide animations require measuring height, padding, and margins first
❌ Chaining animations (fade in → wait → slide out) is complex
❌ Running animations on a collection requires a loop
❌ Managing queues to prevent parallel animations is your problem

### The Animation Module Way

```javascript
// Fade in
await Elements.panel.fadeIn();

// Slide out
await Elements.panel.slideUp({ duration: 400 });

// Chain
await Elements.panel.animate()
  .fadeIn()
  .delay(2000)
  .slideUp()
  .play();
```

✅ No boilerplate — just call the method
✅ Browser compatibility handled internally (vendor prefixes + fallbacks)
✅ Slide animations measure dimensions automatically
✅ Sequential chaining with `.animate()` builder
✅ Collection animations with stagger
✅ Per-element animation queue prevents conflicts

---

## Mental Model: The Stage Director

Think of the Animation module like a **stage director** managing actors (elements):

```
Without Animation module (you are the director):
├── Tell the actor: "Start invisible"
├── Wait for them to get in position
├── Say "Now appear"
├── Watch to know when they've finished
├── Tell them to clean up their props
└── Start the next actor

With Animation module (the director is hired for you):
└── Elements.actor.fadeIn()
    → The module handles: invisible → reflow → transition → wait → cleanup
```

You give the high-level instruction. The module handles every detail.

---

## How Does It Work?

The Animation module integrates with DOM Helpers by **wrapping** the `EnhancedUpdateUtility.enhanceElementWithUpdate` and `enhanceCollectionWithUpdate` functions. This means every element and collection you access through DOM Helpers automatically receives animation methods — no extra setup needed.

```
You access: Elements.myPanel
                    ↓
EnhancedUpdateUtility.enhanceElementWithUpdate(el) runs
                    ↓
Animation module's wrapper runs after
                    ↓
_enhanceElement(el) adds: fadeIn, fadeOut, slideUp, slideDown,
                          slideToggle, transform, animate, stopAnimations
                    ↓
_wrapUpdate(el) wraps .update() to accept animation keys
                    ↓
Your element is ready with full animation API ✨
```

For forms (when the Form module is loaded), animation methods are added via `Forms.helper.addEnhancer()` — the same plugin hook used by the form enhancement module.

---

## What Can the Animation Module Do?

| Method | What it does |
|---|---|
| `.fadeIn(options)` | Fade the element from invisible to visible |
| `.fadeOut(options)` | Fade the element from visible to invisible (hides it) |
| `.slideDown(options)` | Expand the element's height into view |
| `.slideUp(options)` | Collapse the element's height out of view |
| `.slideToggle(options)` | Auto-detect and reverse the current slide state |
| `.transform(transformations, options)` | Apply CSS transforms (translate, rotate, scale, skew) |
| `.animate()` | Create an AnimationChain for sequential animations |
| `.stopAnimations()` | Clear the queue and stop active transitions |

All methods return a `Promise` that resolves when the animation completes.

---

### Accessing Animation Methods

```javascript
// On any element accessed through DOM Helpers
await Elements.myPanel.fadeIn();
await Elements.myPanel.fadeOut({ duration: 500 });

// On collections
await Collections.byClass.notifications.fadeIn({ stagger: 100 });

// On elements from query helpers (if loaded)
await query('#myPanel').fadeIn();

// On raw elements — use Animation.enhance()
const raw = document.getElementById('myPanel');
Animation.enhance(raw);
await raw.fadeIn();
```

### Using the `Animation` Global Directly

```javascript
// Apply to a raw element
await Animation.fadeIn(document.getElementById('myPanel'));

// Create a chain for a raw element
await Animation.chain(document.getElementById('myPanel'))
  .fadeIn()
  .delay(1000)
  .fadeOut()
  .play();

// Change global defaults
Animation.setDefaults({
  duration: 400,
  easing:   'ease-in-out-cubic'
});
```

---

## The Animation Options Object

Every animation method accepts an options object with these properties:

```javascript
element.fadeIn({
  duration:   300,      // animation length in milliseconds (default: 300)
  delay:      0,        // delay before animation starts in ms (default: 0)
  easing:     'ease',   // CSS easing name or cubic-bezier(...) (default: 'ease')
  cleanup:    true,     // remove inline styles after animation (default: true)
  queue:      true,     // queue this animation (default: true)
  onComplete: (el) => { console.log('Done!', el); }  // callback when finished
});
```

All options have sensible defaults — you can call any method with no arguments and it will work:

```javascript
await Elements.myPanel.fadeIn(); // uses defaults: 300ms, ease, no delay
```

---

## The Queue System

By default, animations on the same element are **queued** — they run one at a time in the order you call them:

```javascript
// These run sequentially, not in parallel
Elements.myPanel.fadeIn();   // runs first
Elements.myPanel.slideDown(); // runs after fadeIn completes
Elements.myPanel.fadeOut();  // runs after slideDown completes
```

```
fadeIn → complete → slideDown → complete → fadeOut → complete
```

To run animations in parallel instead:

```javascript
Elements.myPanel.fadeIn({ queue: false });
Elements.myPanel.slideDown({ queue: false }); // starts immediately, overlaps with fadeIn
```

---

## Browser Compatibility

The module detects CSS transition and transform support at load time and applies vendor prefixes automatically:

```
Detected at load:
├── Standard: transition, transform
├── WebKit:   -webkit-transition, -webkit-transform
├── Moz:      -moz-transition, -moz-transform
├── Opera:    -o-transition, -o-transform
└── MS:       -ms-transform
```

If transitions are not supported at all, the module falls back to a `setTimeout`-based timing mechanism, so animations still "complete" after the expected duration.

---

## What's Next?

- **Fade Animations** — `fadeIn` and `fadeOut` in depth
- **Slide Animations** — `slideDown`, `slideUp`, `slideToggle`
- **Transform Animations** — translate, rotate, scale, skew
- **Animation Chain** — building sequential animation sequences
- **Easing Curves and Advanced Options** — all 30 named easings
