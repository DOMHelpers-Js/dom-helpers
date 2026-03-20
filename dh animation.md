# DOM Helpers — Animation Module (`dh-animation.js`)

> **Who is this for?**
> This guide is written for people with basic JavaScript knowledge — variables, functions, and event listeners. You don't need to know anything about CSS animations or Promises to get started.

---

## What does this module do?

Animating things on a web page in plain JavaScript is surprisingly tedious:

```js
// ❌ Plain JavaScript — a lot of code just to fade something in
element.style.opacity = '0';
element.style.display = 'block';
element.style.transition = 'opacity 300ms ease';
// Force the browser to apply the initial state before starting
element.offsetHeight;
element.style.opacity = '1';
element.addEventListener('transitionend', function cleanup() {
  element.style.removeProperty('transition');
  element.removeEventListener('transitionend', cleanup);
}, { once: true });
```

This module replaces all of that with simple, readable method calls:

```js
// ✅ With DOM Helpers Animation
await Elements.myCard.fadeIn();
```

All animations use **CSS transitions** under the hood — not JavaScript timers — which means they are hardware-accelerated, respect the user's system animation preferences, and work smoothly even on mobile devices.

---

## Setup

```html
<body>
  <!-- your page content -->

  <!-- 1. Core DOM Helpers (required) -->
  <script src="01_dh-core.js"></script>

  <!-- 2. Animation module -->
  <script src="Animation/dh-animation.js"></script>

  <!-- 3. Your own code -->
  <script src="app.js"></script>
</body>
```

After loading, every element accessed through `Elements`, `Collections`, or `Selector` automatically has animation methods added to it. You also get the `Animation` global object for advanced use.

---

## Core Concept — Animations Return Promises

Every animation method returns a **Promise** — a JavaScript object that represents work happening in the background. This matters because animations take time. You use `await` to pause your code until the animation finishes.

```js
// Without await — code continues immediately, doesn't wait for the animation
Elements.card.fadeIn();
doSomethingElse(); // runs while the fade is still happening

// With await — code waits for the fade to complete before continuing
await Elements.card.fadeIn();
doSomethingElse(); // runs AFTER the fade finishes
```

> **Quick reminder about `async`/`await`:**
> To use `await`, you must be inside an `async function`:
> ```js
> async function showCard() {
>   await Elements.card.fadeIn();
>   // ...
> }
> ```
> Or use an immediately-invoked async function at the top level:
> ```js
> (async () => {
>   await Elements.card.fadeIn();
> })();
> ```

---

## Animation Options

Every animation method accepts an optional configuration object as its last argument. All options have sensible defaults — you only need to pass what you want to change.

```js
await Elements.myElement.fadeIn({
  duration : 500,            // how long the animation takes in milliseconds (default: 300)
  delay    : 200,            // wait this many ms before starting (default: 0)
  easing   : 'ease-out-cubic', // the speed curve of the animation (default: 'ease')
  cleanup  : true,           // remove temporary inline styles when done (default: true)
  queue    : true,           // wait for previous animations to finish first (default: true)
  onComplete(element) {      // function called when the animation finishes
    console.log('Done!', element);
  }
});
```

### `duration` — how long

The total length of the animation in milliseconds. 1000ms = 1 second.

```js
await Elements.hero.fadeIn({ duration: 1000 }); // slow 1-second fade
await Elements.toast.fadeOut({ duration: 150 }); // quick 150ms fade
```

### `delay` — when to start

Waits this many milliseconds before starting. Useful for staggering effects when multiple things need to animate one after another.

```js
await Elements.title.fadeIn({ delay: 0 });    // starts immediately
await Elements.subtitle.fadeIn({ delay: 200 }); // starts 200ms later
```

### `easing` — the speed curve

Controls whether the animation starts fast and slows down, starts slow and speeds up, or moves at a constant rate. See the [full easing reference](#easing-curves) below.

```js
await Elements.card.slideDown({ easing: 'ease-out-back' }); // overshoots slightly, then settles
await Elements.menu.slideUp({ easing: 'ease-in-cubic' });    // starts slow, ends fast
```

### `queue` — sequential or parallel

When `true` (the default), if you call multiple animations on the same element, they run **one after another**. When `false`, they start at the same time.

```js
// Sequential (default) — fades out, THEN slides up
Elements.card.fadeOut();
Elements.card.slideUp(); // waits for fadeOut to finish

// Parallel — both start at the same time
Elements.card.fadeOut({ queue: false });
Elements.card.slideUp({ queue: false }); // starts immediately alongside fadeOut
```

### `onComplete` — callback when done

A function that runs after the animation finishes. Receives the element as its argument.

```js
await Elements.notification.fadeOut({
  onComplete(element) {
    element.remove(); // remove from DOM after it fades out
  }
});
```

---

## `fadeIn`

Makes a hidden element gradually appear by animating its opacity from 0 to 1. If the element has `display: none`, it is automatically shown before the animation starts.

```js
await Elements.modal.fadeIn();

// With options
await Elements.modal.fadeIn({
  duration: 400,
  easing:   'ease-out',
  onComplete(el) {
    el.querySelector('input').focus();
  }
});
```

**What it does step by step:**
1. If the element is hidden (`display: none`), shows it
2. Sets `opacity` to `0`
3. Starts a CSS transition to `opacity: 1`
4. Waits for the transition to finish
5. Cleans up the temporary styles
6. Calls `onComplete` if provided

---

## `fadeOut`

Makes a visible element gradually disappear by animating its opacity from 1 to 0. By default, hides the element with `display: none` after it fades out.

```js
await Elements.notification.fadeOut();

// Keep the space (don't set display:none — just make it invisible)
await Elements.placeholder.fadeOut({ hide: false });
```

### The `hide` option

- `hide: true` (default) — sets `display: none` after the animation, removing the element from the flow
- `hide: false` — element stays in place but is invisible (`opacity: 0`)

```js
// Fade out and preserve layout space
await Elements.skeleton.fadeOut({ hide: false });
```

---

## `slideUp`

Collapses an element to zero height, hiding it. Animates `height`, `padding`, and `margin` simultaneously so the surrounding content flows together cleanly.

```js
await Elements.accordion.slideUp();

await Elements.menu.slideUp({
  duration: 200,
  easing:   'ease-in-quad'
});
```

**What it animates:**
- `height` → `0`
- `padding-top` and `padding-bottom` → `0`
- `margin-top` and `margin-bottom` → `0`

All at the same time, so there is no visual jump. After the animation, the element is set to `display: none`.

---

## `slideDown`

Expands a hidden element from zero height to its natural height. The reverse of `slideUp`. Correctly restores the element's original `display` value — works with `flex`, `grid`, `inline-block`, and table elements, not just `block`.

```js
await Elements.accordion.slideDown();

await Elements.details.slideDown({
  duration: 350,
  easing:   'ease-out-cubic'
});
```

---

## `slideToggle`

Automatically detects whether the element is visible or hidden and runs `slideDown` or `slideUp` accordingly. Perfect for expand/collapse toggles where you don't need to track state yourself.

```js
// No need to track open/closed state — slideToggle figures it out
expandButton.addEventListener('click', async () => {
  await Elements.content.slideToggle();
});
```

---

## `transform`

Applies CSS transforms (move, rotate, scale, skew) with a smooth transition. After the animation, the transform style is removed by default (`cleanup: true`).

```js
// Move an element 100px to the right
await Elements.panel.transform({ translateX: '100px' });

// Rotate 45 degrees
await Elements.icon.transform({ rotate: '45deg' });

// Scale up to 1.2x size
await Elements.card.transform({ scale: 1.2 });

// Combine multiple transforms at once
await Elements.badge.transform({
  translateY: '-10px',
  scale:       1.1
});
```

### All supported transform properties

| Property | Example value | What it does |
|---|---|---|
| `translateX` | `'100px'` or `'2rem'` | Move horizontally |
| `translateY` | `'-50px'` | Move vertically |
| `translateZ` | `'20px'` | Move along Z axis (3D) |
| `translate` | `'10px'` or `['10px', '20px']` | Move on X and Y |
| `translate3d` | `['10px', '20px', '5px']` | Move in 3D space |
| `scale` | `1.5` or `'1.5'` | Scale uniformly |
| `scaleX` | `2` | Scale horizontally |
| `scaleY` | `0.5` | Scale vertically |
| `rotate` | `'90deg'` | Rotate on Z axis |
| `rotateX` | `'45deg'` | Rotate on X axis (3D) |
| `rotateY` | `'180deg'` | Rotate on Y axis (3D) |
| `skew` | `'10deg'` | Skew on both axes |
| `skewX` | `'15deg'` | Skew horizontally |
| `skewY` | `'5deg'` | Skew vertically |

### Keeping the transform after animation

By default `cleanup: true` removes the transform style when the animation ends, so the element snaps back to its original position. Set `cleanup: false` to keep it in the new position permanently.

```js
// Slide in from the left and KEEP it there
await Elements.sidebar.transform(
  { translateX: '0px' },
  { cleanup: false }
);
```

---

## `stopAnimations`

Cancels all queued and active animations on an element immediately. The element stays in whatever visual state it was in at the moment of cancellation.

```js
// Stop everything on this element
Elements.card.stopAnimations();

// Common pattern — stop before starting a new animation sequence
Elements.loader.stopAnimations();
await Elements.loader.fadeIn({ duration: 200 });
```

---

## `animate()` — Animation Chains

For complex multi-step sequences, the `animate()` method returns an `AnimationChain` object. You add steps one by one using its methods, then call `.play()` to run them all in order.

```js
// Run a sequence: fade in, wait, fade out
await Elements.notification.animate()
  .fadeIn({ duration: 300 })
  .delay(2000)           // pause for 2 seconds
  .fadeOut({ duration: 300 })
  .play();               // always call .play() at the end

// More complex sequence
await Elements.card.animate()
  .slideDown({ duration: 400, easing: 'ease-out-back' })
  .delay(100)
  .transform({ scale: 1.02 }, { duration: 150 })
  .delay(50)
  .transform({ scale: 1 }, { duration: 100 })
  .play();
```

### Chain methods

All the same animation methods are available on the chain. Each one returns the chain so you can keep adding steps:

```js
const chain = Elements.myElement.animate();

chain.fadeIn(options)                    // → chain
chain.fadeOut(options)                   // → chain
chain.slideUp(options)                   // → chain
chain.slideDown(options)                 // → chain
chain.slideToggle(options)               // → chain
chain.transform(transformations, options) // → chain
chain.delay(ms)                          // → chain (pause between steps)
chain.next(callback)                     // → chain (run arbitrary code between steps)
chain.play()                             // → Promise (starts everything)
```

### `.next()` — run code between steps

Insert any code between animation steps using `.next()`. The chain waits for the callback to finish (including if it returns a Promise) before continuing.

```js
await Elements.form.animate()
  .slideUp()
  .next(async (element) => {
    // Do something between steps — this runs AFTER slideUp and BEFORE fadeIn
    await saveFormData();
    element.innerHTML = '<p>Saved!</p>';
  })
  .fadeIn()
  .play();
```

> **Why `.next()` and not `.then()`?**
> In JavaScript, any object with a `.then()` method is treated as a Promise. Naming the method `.then()` would confuse the runtime and cause silent bugs when used with `await`. The method was renamed `.next()` to avoid this collision entirely.

---

## Using Animations Inside `.update()`

Since animation methods integrate with the DOM Helpers `.update()` system, you can trigger animations as part of a standard `.update()` call. This is useful when you want to combine a DOM change with an animation in one statement.

```js
// Combine a style change with an animation in one call
Elements.card.update({
  textContent: 'Updated!',
  style: { backgroundColor: '#f0f0f0' },
  fadeIn: true              // animation option — true uses defaults
});

// With custom options
Elements.card.update({
  fadeIn: { duration: 500, easing: 'ease-out-cubic' }
});
```

When animation keys are present, `.update()` returns a Promise that resolves when all animations finish. When there are no animation keys, it returns the element as usual.

### Supported animation keys in `.update()`

```js
element.update({
  fadeIn:      true | { ...options },
  fadeOut:     true | { ...options },
  slideUp:     true | { ...options },
  slideDown:   true | { ...options },
  slideToggle: true | { ...options },
  transform: {
    transformations: { translateX: '100px' },
    options: { duration: 300 }
  },
  stopAnimations: true     // stop all animations immediately
});
```

---

## Collection Animations

When you access a collection through `Collections` or `ClassName`, all animation methods work on **every element in the collection simultaneously**.

```js
// Fade in all elements with class 'card'
await ClassName.card.fadeIn({ duration: 400 });

// Slide up all items in a list
await ClassName.listItem.slideUp();
```

### Stagger — animate elements one after another

The `stagger` option adds an increasing delay to each element based on its position in the collection. Pass a number of milliseconds to offset each element.

```js
// Each card starts its animation 80ms after the previous one
await ClassName.card.fadeIn({
  duration: 300,
  stagger:  80   // element 0: 0ms delay, element 1: 80ms, element 2: 160ms, etc.
});
```

This creates a wave-like ripple effect without any extra code.

```js
// Slide down a list of items with a 50ms stagger
await ClassName.menuItem.slideDown({
  duration: 250,
  easing:   'ease-out-quad',
  stagger:  50
});
```

---

## Easing Curves

Easing controls the speed curve — whether the animation accelerates, decelerates, or overshoots. Use the name as the `easing` option.

### Standard CSS easings

| Name | Feel |
|---|---|
| `linear` | Constant speed — mechanical, rarely natural-looking |
| `ease` | Slight slow start, then fast, then slow end *(default)* |
| `ease-in` | Starts slow, ends fast — good for elements leaving the screen |
| `ease-out` | Starts fast, ends slow — good for elements entering the screen |
| `ease-in-out` | Slow start and end, fast middle — smooth and balanced |

### Extended easing curves

These go beyond the standard CSS keywords and map to `cubic-bezier()` values.

**Quadratic** — subtle curves, natural-feeling:

| Name | Feel |
|---|---|
| `ease-in-quad` | Gentle acceleration |
| `ease-out-quad` | Gentle deceleration |
| `ease-in-out-quad` | Gentle both ends |

**Cubic / Quartic / Quintic** — progressively stronger curves:

| Name | Feel |
|---|---|
| `ease-in-cubic` | Moderate acceleration |
| `ease-out-cubic` | Moderate deceleration |
| `ease-in-out-cubic` | Moderate both ends |
| `ease-in-quart` | Strong acceleration |
| `ease-out-quart` | Strong deceleration |
| `ease-in-quint` | Very strong acceleration |
| `ease-out-quint` | Very strong deceleration |

**Sine** — smooth wave-like curves:

| Name | Feel |
|---|---|
| `ease-in-sine` | Very gentle start |
| `ease-out-sine` | Very gentle end |
| `ease-in-out-sine` | Smoothest possible curve |

**Exponential** — dramatic curves with extreme contrast:

| Name | Feel |
|---|---|
| `ease-in-expo` | Almost stationary start, then explosion |
| `ease-out-expo` | Explosion of speed, then abrupt stop |
| `ease-in-out-expo` | Dramatic slow-fast-slow |

**Circular** — based on a circular arc:

| Name | Feel |
|---|---|
| `ease-in-circ` | Curved acceleration |
| `ease-out-circ` | Curved deceleration |
| `ease-in-out-circ` | Very smooth arc |

**Back** — slight overshoot (element goes past its destination then returns):

| Name | Feel |
|---|---|
| `ease-in-back` | Pulls back before moving — rubber-band start |
| `ease-out-back` | Overshoots, then settles — bouncy arrival |
| `ease-in-out-back` | Both pullback and overshoot |

### General guidance

| Use case | Recommended easing |
|---|---|
| Modal / dialog appearing | `ease-out-cubic` |
| Modal / dialog disappearing | `ease-in-cubic` |
| Dropdown opening | `ease-out-quad` |
| Accordion expanding | `ease-out-cubic` |
| Card hover effect | `ease-out-back` |
| Toast notification arriving | `ease-out-back` |
| Loading skeleton fading | `ease-in-out-sine` |

You can also pass a raw `cubic-bezier()` string directly:

```js
await Elements.element.fadeIn({
  easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
});
```

---

## Global Defaults — `Animation.setDefaults()`

Set defaults once at the start of your application so you don't have to repeat options on every call.

```js
Animation.setDefaults({
  duration: 400,
  easing:   'ease-out-cubic'
});

// Now every animation uses these defaults unless overridden
await Elements.card.fadeIn();                      // 400ms, ease-out-cubic
await Elements.modal.slideDown({ duration: 600 }); // 600ms (override), ease-out-cubic
```

Read the current defaults:

```js
const defaults = Animation.getDefaults();
console.log(defaults);
// { duration: 400, delay: 0, easing: 'ease-out-cubic', cleanup: true, queue: true }
```

---

## Standalone Use — `Animation.*`

Every animation function is also available directly on the `Animation` object, without requiring an enhanced element. Useful for animating elements you grabbed with `document.querySelector`.

```js
const el = document.querySelector('.my-element');

await Animation.fadeIn(el, { duration: 300 });
await Animation.slideUp(el);
await Animation.transform(el, { rotate: '90deg' });
```

### `Animation.enhance(element)`

Manually add animation methods to any element obtained outside the DOM Helpers system:

```js
const raw = document.querySelector('.my-element');

// Enhance it — adds .fadeIn(), .slideUp(), .animate(), etc.
const el = Animation.enhance(raw);

// Now you can use the shorthand methods
await el.fadeIn();
await el.animate().slideDown().delay(500).fadeOut().play();
```

### `Animation.chain(element)`

Create an `AnimationChain` for any element:

```js
const el = document.querySelector('.hero');

await Animation.chain(el)
  .fadeIn({ duration: 600 })
  .delay(1000)
  .transform({ translateY: '-20px' }, { duration: 400 })
  .play();
```

### `Animation.clearQueue(element)`

Clear the animation queue for an element without affecting the currently running animation:

```js
// Clear pending animations (the one currently running continues)
Animation.clearQueue(Elements.spinner);
```

### `Animation.isSupported(feature)`

Check browser support before using a feature:

```js
if (Animation.isSupported('transforms')) {
  await Elements.card.transform({ scale: 1.05 });
} else {
  // Fallback for very old browsers
  Elements.card.update({ style: { border: '2px solid blue' } });
}
```

| Feature | What it checks |
|---|---|
| `'transitions'` | CSS transitions (supported in all modern browsers) |
| `'transforms'` | CSS transforms (supported in all modern browsers) |

---

## Complete Working Examples

### Example 1 — Show/hide a modal

```html
<button id="openBtn">Open Modal</button>

<div id="modal" style="display:none; position:fixed; top:50%; left:50%;
     transform:translate(-50%,-50%); background:white; padding:2rem; border-radius:8px;">
  <p>Hello from the modal!</p>
  <button id="closeBtn">Close</button>
</div>

<div id="overlay" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5);"></div>
```

```js
Elements.openBtn.addEventListener('click', async () => {
  // Show overlay and modal together
  await Promise.all([
    Elements.overlay.fadeIn({ duration: 200 }),
    Elements.modal.fadeIn({ duration: 300, easing: 'ease-out-back' })
  ]);
  Elements.modal.querySelector('input')?.focus();
});

Elements.closeBtn.addEventListener('click', async () => {
  await Promise.all([
    Elements.overlay.fadeOut({ duration: 200 }),
    Elements.modal.fadeOut({ duration: 200 })
  ]);
});
```

---

### Example 2 — Accordion expand/collapse

```html
<div class="accordion-item">
  <button class="accordion-trigger" data-target="section1">Section 1 ▼</button>
  <div id="section1" class="accordion-content" style="display:none;">
    <p>Content goes here.</p>
  </div>
</div>
```

```js
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', async () => {
    const targetId = trigger.dataset.target;
    const content  = Elements[targetId];

    // Toggle the clicked section
    await content.slideToggle({ duration: 300, easing: 'ease-out-cubic' });

    // Update the trigger arrow
    const isOpen = content.style.display !== 'none';
    trigger.textContent = trigger.textContent.replace(/[▼▲]/, isOpen ? '▲' : '▼');
  });
});
```

---

### Example 3 — Staggered card entrance

```html
<div class="card">Card 1</div>
<div class="card">Card 2</div>
<div class="card">Card 3</div>
<div class="card">Card 4</div>
```

```css
.card { display: none; /* start hidden */ }
```

```js
// Animate all cards in with a stagger
document.addEventListener('DOMContentLoaded', async () => {
  await ClassName.card.fadeIn({
    duration: 400,
    easing:   'ease-out-cubic',
    stagger:  100  // each card starts 100ms after the previous
  });
});
```

---

### Example 4 — Notification toast

```js
async function showToast(message, type = 'info') {
  // Create the toast element
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  toast.style.display = 'none';
  document.body.appendChild(toast);

  // Enhance it manually (it was created outside the DOM Helpers system)
  Animation.enhance(toast);

  // Animate in, hold, animate out, remove
  await toast.animate()
    .fadeIn({ duration: 250, easing: 'ease-out-back' })
    .delay(3000)                             // visible for 3 seconds
    .fadeOut({ duration: 200 })
    .next(() => toast.remove())              // remove from DOM
    .play();
}

// Usage
showToast('Settings saved!', 'success');
showToast('Connection lost.', 'error');
```

---

### Example 5 — Slide-in sidebar navigation

```css
#sidebar {
  position: fixed;
  top: 0; left: 0; height: 100%;
  width: 280px;
  transform: translateX(-280px); /* starts off-screen */
  display: block;
}
```

```js
let sidebarOpen = false;

Elements.menuBtn.addEventListener('click', async () => {
  sidebarOpen = !sidebarOpen;

  await Elements.sidebar.transform(
    { translateX: sidebarOpen ? '0px' : '-280px' },
    {
      duration : 350,
      easing   : sidebarOpen ? 'ease-out-cubic' : 'ease-in-cubic',
      cleanup  : false  // keep the transform so the sidebar stays open/closed
    }
  );
});
```

---

### Example 6 — Animated form submission feedback

```js
Elements.submitBtn.addEventListener('click', async () => {
  const form = Forms.contactForm;

  // Validate first
  const result = form.validate({
    email:   { required: true, email: true },
    message: { required: true, minLength: 10 }
  });

  if (!result.isValid) {
    // Shake the form to indicate an error
    await Elements.formContainer.animate()
      .transform({ translateX: '-8px' }, { duration: 60, easing: 'ease-out', cleanup: false })
      .transform({ translateX:  '8px' }, { duration: 60, easing: 'ease-out', cleanup: false })
      .transform({ translateX: '-5px' }, { duration: 60, easing: 'ease-out', cleanup: false })
      .transform({ translateX:  '0px' }, { duration: 60, easing: 'ease-out', cleanup: false })
      .play();
    return;
  }

  // Submit and show success feedback
  try {
    await form.submitData({ url: '/api/contact' });

    // Fade out the form, fade in a success message
    await Elements.formContainer.fadeOut({ duration: 300 });
    await Elements.successMessage.fadeIn({ duration: 400, easing: 'ease-out-back' });
  } catch (err) {
    console.error('Submit failed:', err);
  }
});
```

---

### Example 7 — Using `Animation.*` standalone functions

```js
// Animate any element grabbed directly from the DOM
const elements = document.querySelectorAll('.product-card');

async function revealProducts() {
  for (let i = 0; i < elements.length; i++) {
    // Stagger manually — no collection needed
    await Animation.fadeIn(elements[i], {
      duration: 300,
      delay:    i * 80,
      easing:   'ease-out-quad'
    });
  }
}

revealProducts();
```

---

## API Quick Reference

### Element methods (added automatically to all enhanced elements)

| Method | Signature | Returns |
|---|---|---|
| `fadeIn` | `(options?)` | `Promise<element>` |
| `fadeOut` | `(options?)` | `Promise<element>` |
| `slideUp` | `(options?)` | `Promise<element>` |
| `slideDown` | `(options?)` | `Promise<element>` |
| `slideToggle` | `(options?)` | `Promise<element>` |
| `transform` | `(transformations, options?)` | `Promise<element>` |
| `animate` | `()` | `AnimationChain` |
| `stopAnimations` | `()` | `element` (synchronous) |

### Collection methods (added to all enhanced collections)

All the same methods as elements, plus:

| Option | Type | Description |
|---|---|---|
| `stagger` | `number` | Offset each element's delay by this many ms × index |

### AnimationChain methods

| Method | Returns |
|---|---|
| `.fadeIn(options?)` | `AnimationChain` |
| `.fadeOut(options?)` | `AnimationChain` |
| `.slideUp(options?)` | `AnimationChain` |
| `.slideDown(options?)` | `AnimationChain` |
| `.slideToggle(options?)` | `AnimationChain` |
| `.transform(transformations, options?)` | `AnimationChain` |
| `.delay(ms)` | `AnimationChain` |
| `.next(callback)` | `AnimationChain` |
| `.play()` | `Promise<element>` |

### Animation namespace

| Method | Signature | Description |
|---|---|---|
| `Animation.fadeIn` | `(element, options?)` | Standalone fade in |
| `Animation.fadeOut` | `(element, options?)` | Standalone fade out |
| `Animation.slideUp` | `(element, options?)` | Standalone slide up |
| `Animation.slideDown` | `(element, options?)` | Standalone slide down |
| `Animation.slideToggle` | `(element, options?)` | Standalone slide toggle |
| `Animation.transform` | `(element, transformations, options?)` | Standalone transform |
| `Animation.chain` | `(element)` | Create an AnimationChain |
| `Animation.enhance` | `(element or collection)` | Manually add animation methods |
| `Animation.clearQueue` | `(element)` | Clear queued animations |
| `Animation.setDefaults` | `(config)` | Set global defaults |
| `Animation.getDefaults` | `()` | Read current defaults |
| `Animation.isSupported` | `('transitions' or 'transforms')` | Check browser support |

### Options reference

| Option | Type | Default | Description |
|---|---|---|---|
| `duration` | `number` | `300` | Animation length in ms |
| `delay` | `number` | `0` | Wait before starting in ms |
| `easing` | `string` | `'ease'` | Speed curve name or `cubic-bezier(…)` |
| `cleanup` | `boolean` | `true` | Remove inline styles when done |
| `queue` | `boolean` | `true` | Run sequentially on same element |
| `onComplete` | `function` | `undefined` | Called when animation finishes |
| `hide` | `boolean` | `true` | `fadeOut` only — set `display:none` after |
| `stagger` | `number` | `undefined` | Collections only — ms delay between elements |

---

## Frequently Asked Questions

**Q: The animation runs but the element snaps back to its original position at the end. Why?**

`cleanup: true` (the default) removes the inline styles that were set during the animation, which means the element returns to whatever its CSS says. For `fadeIn`/`slideDown` this is fine because the animation brings the element to a natural state. For `transform`, if you want to keep the element in its new position, use `cleanup: false`.

```js
await Elements.sidebar.transform(
  { translateX: '0px' },
  { cleanup: false }  // keep the transform applied
);
```

---

**Q: I want multiple elements to animate at the same time. How do I do that?**

Use `Promise.all()` to run multiple animations concurrently:

```js
await Promise.all([
  Elements.overlay.fadeIn(),
  Elements.modal.slideDown()
]);
```

Or use the collection system with `stagger: 0`:

```js
await ClassName.card.fadeIn({ stagger: 0 }); // all at once
```

---

**Q: `slideDown` is showing my element as `display: block` but it should be `display: flex`. How do I fix this?**

This is handled automatically. `slideDown` restores the element's natural `display` value. If you ran `slideUp` first, the original `display` was saved. If this is the first time you're using `slideDown` on an element, the module reads the `display` from your CSS stylesheet.

Make sure the element has its `display` set in your CSS (not as an inline style), and `slideDown` will restore it correctly.

---

**Q: Can I use these animations with AJAX-loaded content?**

Yes. Any element accessed through `Elements`, `Collections`, or `Selector` after the DOM has updated is automatically enhanced. You can also call `Animation.enhance(element)` on any element you've created or received dynamically.

---

**Q: My animation flickers or jumps at the start. What is happening?**

This is usually a browser rendering issue when changing `display` and `opacity` or `height` in the same tick. The module forces a "reflow" (`element.offsetHeight`) between setting the initial state and starting the transition to prevent this. If you still see it, check that you're not setting conflicting styles via external CSS at the same moment the animation starts.

---

**Q: How do I stop all animations on the page?**

```js
// Stop a specific element
Elements.myElement.stopAnimations();

// Stop all elements in a collection
ClassName.card.stopAnimations();

// Stop a manually-enhanced element
Animation.clearQueue(rawElement);
```

There is no built-in "stop everything on the page" method, but you can call `stopAnimations()` on any element or collection you have a reference to.