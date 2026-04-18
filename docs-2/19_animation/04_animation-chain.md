[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Animation Chain

## Quick Start (30 seconds)

```javascript
// Build a sequence of animations, then play them
await Elements.notification
  .animate()
  .slideDown({ duration: 300, easing: 'ease-out-back' })
  .delay(3000)
  .fadeOut({ duration: 400 })
  .play();

// With a callback between steps
await Elements.banner
  .animate()
  .fadeIn({ duration: 200 })
  .next(el => el.update({ text: 'Welcome!' }))
  .delay(2000)
  .slideUp({ duration: 300 })
  .play();
```

---

## What Is AnimationChain?

`AnimationChain` is a **fluent builder** — a pattern that lets you add animation steps one by one, then execute them all in sequence when you're ready.

Think of it like writing a **movie script** for your element:

```
"First, slide down.
 Then wait 3 seconds.
 Then fade out.
 Action!"
```

```javascript
await Elements.notification
  .animate()           // start writing the script
  .slideDown()         // scene 1: slide down
  .delay(3000)         // scene 2: wait 3 seconds
  .fadeOut()           // scene 3: fade out
  .play();             // action! run the script
```

Nothing runs until you call `.play()`. Until then, you're just describing what should happen.

---

## Why Does This Exist?

### Chaining Animations with `await`

You can absolutely use `await` directly for sequences:

```javascript
await Elements.notification.slideDown();
await new Promise(r => setTimeout(r, 3000));
await Elements.notification.fadeOut();
```

This approach is great for simple sequences. AnimationChain is especially useful when:
- You want to **build the sequence** before deciding to run it
- You want to **pass the sequence** to a function
- You want a **clean, readable** description of a complex animation sequence
- You want to add **conditional steps** before playing

```javascript
// Build once, decide later
const entryAnimation = Elements.hero.animate()
  .fadeIn({ duration: 500 })
  .next(el => el.update({ classes: { add: 'is-loaded' } }));

// Play immediately on some pages
if (isHomePage) {
  entryAnimation.play();
}

// Or trigger on scroll
observer.onVisible(() => entryAnimation.play());
```

---

## How to Use AnimationChain

### Step 1: Start the chain

Call `.animate()` on any enhanced element to get a new `AnimationChain`:

```javascript
const chain = Elements.myElement.animate();
// or from the Animation namespace (for raw elements)
const chain = Animation.chain(rawElement);
```

### Step 2: Add steps

Each step method returns the same chain so you can keep adding:

```javascript
chain
  .fadeIn({ duration: 300 })        // step 1
  .delay(1000)                       // step 2
  .transform({ scale: 1.2 })        // step 3
  .delay(500)                        // step 4
  .slideUp({ duration: 400 });       // step 5
```

### Step 3: Play it

```javascript
await chain.play(); // runs all steps in order
```

Or in one expression:

```javascript
await Elements.card
  .animate()
  .fadeIn()
  .delay(500)
  .fadeOut()
  .play();
```

---

## All Chain Methods

### `.fadeIn(options)` / `.fadeOut(options)`

```javascript
await Elements.panel
  .animate()
  .fadeIn({ duration: 200 })
  .delay(2000)
  .fadeOut({ duration: 300 })
  .play();
```

### `.slideDown(options)` / `.slideUp(options)` / `.slideToggle(options)`

```javascript
await Elements.dropdown
  .animate()
  .slideDown({ duration: 300, easing: 'ease-out-cubic' })
  .delay(5000)
  .slideUp({ duration: 250 })
  .play();
```

### `.transform(transformations, options)`

```javascript
await Elements.card
  .animate()
  .transform({ translateY: '-10px', scale: 1.05 }, { duration: 200 })
  .delay(1000)
  .transform({ translateY: '0', scale: 1 }, { duration: 200 })
  .play();
```

### `.delay(ms)` — Pause Between Steps

```javascript
await Elements.notification
  .animate()
  .slideDown()
  .delay(3000)     // wait 3 seconds before the next step
  .fadeOut()
  .play();
```

### `.next(callback)` — Run Logic Between Steps

`.next(callback)` inserts an arbitrary function call between animation steps. The function receives the element as an argument and can return a Promise (the chain will wait for it to resolve):

```javascript
await Elements.wizard
  .animate()
  .fadeOut({ duration: 200 })
  .next(el => {
    // Change content while element is invisible
    el.update({ html: newStepContent });
  })
  .fadeIn({ duration: 200 })
  .play();
```

```javascript
// Async callback — chain waits for the Promise
await Elements.form
  .animate()
  .slideUp()
  .next(async (el) => {
    // Fetch new data while form is hidden
    const data = await fetch('/api/next-step').then(r => r.json());
    el.update({ values: data });
  })
  .slideDown()
  .play();
```

---

## Building Reusable Animations

Because chains are just objects, you can build them ahead of time and reuse them:

```javascript
// Create a "toast" animation factory
function createToastAnimation(element, duration = 3000) {
  return element
    .animate()
    .slideDown({ duration: 300, easing: 'ease-out-back' })
    .delay(duration)
    .fadeOut({ duration: 400 });
}

// Use it anywhere
async function showToast(message, type) {
  const toast = Elements.toastNotification;
  toast.update({
    text:    message,
    classes: { set: `toast toast-${type}` }
  });

  await createToastAnimation(toast, 4000).play();
}

showToast('File saved!', 'success');
showToast('Could not connect.', 'error');
```

---

## Real-World Example: Page Transition

```javascript
async function navigateTo(newUrl) {
  // Fade out current content
  await Elements.pageContent
    .animate()
    .fadeOut({ duration: 300 })
    .next(async () => {
      // Load new content while page is invisible
      const html = await fetch(newUrl).then(r => r.text());
      document.getElementById('pageContent').innerHTML = html;
    })
    .fadeIn({ duration: 400 })
    .play();
}
```

---

## Real-World Example: Onboarding Sequence

```javascript
async function playOnboarding() {
  // Step 1: Welcome
  await Elements.welcomeOverlay
    .animate()
    .fadeIn({ duration: 500 })
    .delay(1000)
    .play();

  // Step 2: Highlight the main feature
  await Elements.featureHighlight
    .animate()
    .slideDown({ duration: 400, easing: 'ease-out-back' })
    .delay(2500)
    .slideUp({ duration: 300 })
    .play();

  // Step 3: Show CTA button
  await Elements.ctaButton
    .animate()
    .fadeIn({ duration: 400 })
    .transform({ scale: 1.1 }, { duration: 200 })
    .delay(200)
    .transform({ scale: 1 }, { duration: 150, cleanup: false })
    .play();
}
```

---

## Important: Call `.play()` to Run the Chain

The chain does not run automatically. You must call `.play()`:

```javascript
// ✅ Correct — .play() returns a Promise you can await
await Elements.panel.animate().fadeIn().delay(1000).fadeOut().play();

// ❌ Wrong — nothing runs, steps are just added to the chain
Elements.panel.animate().fadeIn().delay(1000).fadeOut();

// ❌ Wrong — do not await the chain itself (only await .play())
await Elements.panel.animate().fadeIn();  // awaiting the chain, not the promise
```

---

## Summary

| Method | What it adds to the chain |
|---|---|
| `.fadeIn(opts)` | Fade the element in |
| `.fadeOut(opts)` | Fade the element out |
| `.slideDown(opts)` | Slide the element down (reveal) |
| `.slideUp(opts)` | Slide the element up (hide) |
| `.slideToggle(opts)` | Toggle slide state |
| `.transform(obj, opts)` | Apply a CSS transform |
| `.delay(ms)` | Pause for `ms` milliseconds |
| `.next(callback)` | Run a function (can be async) |
| `.play()` | Execute all steps in order, returns a Promise |

**Key rule:** Build the chain → call `.play()` → await the result.
