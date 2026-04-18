[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# `.update()` Integration and Real-World Patterns

## Quick Start (30 seconds)

```javascript
// Use animation keys inside .update()
Elements.notification.update({
  text:   'File uploaded successfully!',
  fadeIn: { duration: 300 }
});

// Combine DOM update and animation in one call
Elements.statusBadge.update({
  text:    'Online',
  classes: { add: 'status-online' },
  slideDown: true   // slide down with default options
});

// Stop all running animations on an element
Elements.panel.stopAnimations();
```

---

## Animation Keys Inside `.update()`

The Animation module wraps the standard `.update()` method to intercept animation keys. When you include an animation key in an update call, the animation runs concurrently while the rest of the update is applied:

### Supported animation keys

```javascript
element.update({
  fadeIn:      { duration: 300 },   // options object
  fadeOut:     true,                // true = use defaults
  slideDown:   { duration: 400 },
  slideUp:     true,
  slideToggle: { easing: 'ease-out-back' },
  transform:   {
    transformations: { translateY: '-20px', scale: 1.05 },
    options:         { duration: 200 }
  },
  stopAnimations: true,             // stop all pending animations
});
```

When any animation key is present, `.update()` returns a `Promise` (so you can await it). When there are no animation keys, it returns the element as usual:

```javascript
// Returns a Promise (because of slideDown)
await Elements.notification.update({
  text:      'New message!',
  slideDown: { duration: 300 }
});

// Returns the element (no animation keys)
Elements.notification.update({ text: 'Hello' });
```

---

## Why Use `.update()` with Animation Keys?

Instead of two separate calls, combine DOM property changes and animations in one expression:

```javascript
// Two calls — verbose
Elements.toast.update({ text: 'Success!', classes: { set: 'toast-success' } });
Elements.toast.slideDown({ duration: 300 });

// One call — cleaner
await Elements.toast.update({
  text:      'Success!',
  classes:   { set: 'toast-success' },
  slideDown: { duration: 300 }
});
```

This is especially readable with the `update` key inside `Forms`:

```javascript
await Forms.myForm.update({
  values:    { status: 'Submitted' },
  classes:   { add: 'submitted' },
  slideDown: { duration: 300 }
});
```

---

## `stopAnimations()` — Cancel All Pending Animations

`.stopAnimations()` clears the animation queue for an element and removes any active transition inline styles:

```javascript
// Cancel all queued animations
Elements.panel.stopAnimations();

// As a key in .update()
Elements.panel.update({ stopAnimations: true });
```

**When to use it:**
- When the user navigates away or closes a modal before animations finish
- When you want to immediately show/hide an element that's mid-animation
- When resetting a component to a clean state

---

## Using `Animation.enhance()` for Raw Elements

Elements obtained outside of DOM Helpers (e.g., via `document.querySelector`) need to be manually enhanced:

```javascript
// Raw element — no animation methods yet
const el = document.querySelector('.my-widget');

// Enhance it
Animation.enhance(el);

// Now it has all animation methods
await el.fadeIn({ duration: 300 });
await el.slideToggle();

// Works on collections too
const cards = document.querySelectorAll('.card');
Animation.enhance({ _originalNodeList: cards });
```

---

## Real-World Pattern: Content Loading States

```javascript
async function loadSection(url) {
  const section = Elements.contentSection;

  // 1. Fade out current content
  await section.fadeOut({ duration: 200 });

  // 2. Show loading spinner while fetching
  section.update({ html: '<div class="spinner"></div>' });
  await section.fadeIn({ duration: 150 });

  // 3. Fetch new content
  const html = await fetch(url).then(r => r.text());

  // 4. Swap content with animation
  await section.fadeOut({ duration: 200 });
  section.update({ html });
  await section.fadeIn({ duration: 300, easing: 'ease-out-cubic' });
}
```

---

## Real-World Pattern: Animated Notifications

```javascript
class NotificationManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.queue = [];
  }

  async show(message, type = 'info', duration = 4000) {
    // Create notification element
    const el = document.createElement('div');
    el.className = `notification notification-${type}`;
    el.textContent = message;
    this.container.appendChild(el);

    // Enhance and animate
    Animation.enhance(el);

    await el.slideDown({ duration: 300, easing: 'ease-out-back' });
    await new Promise(r => setTimeout(r, duration));
    await el.fadeOut({ duration: 400 });

    el.remove();
  }
}

const notifications = new NotificationManager('notificationArea');
notifications.show('File uploaded!', 'success');
notifications.show('Low disk space.', 'warning', 8000);
```

---

## Real-World Pattern: Animated Accordion

```javascript
class AnimatedAccordion {
  constructor(containerSelector) {
    this.items = document.querySelectorAll(`${containerSelector} .accordion-item`);
    this._bindEvents();
  }

  _bindEvents() {
    this.items.forEach(item => {
      const header  = item.querySelector('.accordion-header');
      const content = item.querySelector('.accordion-content');
      const arrow   = item.querySelector('.accordion-arrow');

      // Enhance the raw elements
      Animation.enhance(content);
      Animation.enhance(arrow);

      // Start hidden
      content.style.display = 'none';

      header.addEventListener('click', async () => {
        const isOpen = item.classList.contains('is-open');

        // Close any other open items
        this.items.forEach(other => {
          if (other !== item && other.classList.contains('is-open')) {
            this._close(other);
          }
        });

        // Toggle this item
        isOpen ? this._close(item) : this._open(item);
      });
    });
  }

  async _open(item) {
    item.classList.add('is-open');
    const content = Animation.enhance(item.querySelector('.accordion-content'));
    const arrow   = Animation.enhance(item.querySelector('.accordion-arrow'));

    await Promise.all([
      content.slideDown({ duration: 300, easing: 'ease-out-cubic' }),
      arrow.transform({ rotate: '180deg' }, { duration: 250, cleanup: false })
    ]);
  }

  async _close(item) {
    item.classList.remove('is-open');
    const content = item.querySelector('.accordion-content');
    const arrow   = item.querySelector('.accordion-arrow');

    await Promise.all([
      content.slideUp({ duration: 250, easing: 'ease-in-cubic' }),
      arrow.transform({ rotate: '0deg' }, { duration: 200, cleanup: false })
    ]);
  }
}

new AnimatedAccordion('#myAccordion');
```

---

## Real-World Pattern: Animated Page Transitions

```javascript
const mainContent = Elements.mainContent;
const pageLoader  = Elements.pageLoader;

// Link click → animated page transition
document.querySelectorAll('a[data-spa]').forEach(link => {
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');

    // Show loader, fade out content
    await Promise.all([
      mainContent.fadeOut({ duration: 250 }),
      pageLoader.fadeIn({ duration: 150 })
    ]);

    // Navigate
    history.pushState({}, '', href);
    const html = await fetch(href).then(r => r.text());
    document.querySelector('#mainContent').innerHTML = html;

    // Hide loader, fade in new content
    await Promise.all([
      pageLoader.fadeOut({ duration: 150 }),
      mainContent.fadeIn({ duration: 350, easing: 'ease-out-cubic' })
    ]);
  });
});
```

---

## Best Practices

### 1. Always `await` Sequential Animations

```javascript
// ✅ Sequential — each step waits for the previous
await Elements.panel.fadeOut();
await Elements.panel.update({ html: newContent });
await Elements.panel.fadeIn();

// ❌ Wrong — all three start at the same time
Elements.panel.fadeOut();
Elements.panel.update({ html: newContent });
Elements.panel.fadeIn();
```

### 2. Use `Promise.all` for Truly Parallel Animations

```javascript
// ✅ Both run at the same time
await Promise.all([
  Elements.leftPanel.slideOut(),
  Elements.rightPanel.slideIn()
]);
```

### 3. Use `stopAnimations()` Before Re-triggering

```javascript
// ✅ Cancel any pending animations before starting new ones
document.getElementById('resetBtn').addEventListener('click', () => {
  Elements.animatedPanel.stopAnimations();
  Elements.animatedPanel.fadeIn({ duration: 200 });
});
```

### 4. Check Support Before Transform-Heavy UIs

```javascript
if (Animation.isSupported('transforms')) {
  // Use transform-based animations
  Elements.card.transform({ translateY: '-8px' });
} else {
  // Fallback to simpler change
  Elements.card.update({ style: { marginTop: '-8px' } });
}
```

### 5. Keep Durations Consistent

Set global defaults once and only override when needed:

```javascript
// Set your project's animation language globally
Animation.setDefaults({
  duration: 300,
  easing:   'ease-out-cubic'
});

// Only override when this specific animation needs to differ
Elements.hero.fadeIn({ duration: 600 }); // slower for the hero
```

---

## Quick Reference: The Full Animation API

```
Animation global:
  Animation.fadeIn(el, opts)       → Promise
  Animation.fadeOut(el, opts)      → Promise
  Animation.slideDown(el, opts)    → Promise
  Animation.slideUp(el, opts)      → Promise
  Animation.slideToggle(el, opts)  → Promise
  Animation.transform(el, obj, opts) → Promise
  Animation.chain(el)              → AnimationChain
  Animation.enhance(target)        → enhanced element/collection
  Animation.clearQueue(el)         → Animation (chainable)
  Animation.setDefaults(config)    → Animation (chainable)
  Animation.getDefaults()          → config object
  Animation.isSupported(feature)   → boolean
  Animation.easing                 → { name: 'cubic-bezier(...)' }

Per-element (auto-added to all Elements / Collections):
  element.fadeIn(opts)             → Promise
  element.fadeOut(opts)            → Promise
  element.slideDown(opts)          → Promise
  element.slideUp(opts)            → Promise
  element.slideToggle(opts)        → Promise
  element.transform(obj, opts)     → Promise
  element.animate()                → AnimationChain
  element.stopAnimations()         → element

.update() animation keys:
  { fadeIn, fadeOut, slideDown, slideUp, slideToggle, transform, stopAnimations }
```
