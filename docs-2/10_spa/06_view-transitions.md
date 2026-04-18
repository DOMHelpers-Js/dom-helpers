[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# View Transitions

The Router View module (`02_dh-router-view.js`) adds animated transitions between pages. One line of code gives you professional-looking animations on every navigation.

---

## Setup

Load the view module **after** the router core:

```html
<script src="01_dh-router.js"></script>
<script src="02_dh-router-view.js"></script>
```

Then call `Router.setTransition()` before or after `start()`:

```javascript
Router
  .define([...])
  .mount('#app')
  .setTransition('fade')
  .start({ mode: 'hash' });
```

---

## Built-in presets

Four transition presets are available out of the box:

### `'fade'`

The new view fades in, the old view fades out.

```javascript
Router.setTransition('fade');
```

```
Old view: opacity 1 → 0
New view: opacity 0 → 1
Duration: 250ms
```

### `'slide-left'`

The new view slides in from the right; the old view exits to the left. Feels like forward navigation.

```javascript
Router.setTransition('slide-left');
```

```
Old view: slides out to the left
New view: slides in from the right
Duration: 300ms
```

### `'slide-right'`

The new view slides in from the left; the old view exits to the right. Feels like back navigation.

```javascript
Router.setTransition('slide-right');
```

```
Old view: slides out to the right
New view: slides in from the left
Duration: 300ms
```

### `'scale'`

The new view scales in from slightly smaller; the old scales out slightly larger. Subtle and elegant.

```javascript
Router.setTransition('scale');
```

```
Old view: scale(1) → scale(1.05), opacity 0
New view: scale(0.95) → scale(1), opacity 1
Duration: 250ms
```

---

## Listing available presets

```javascript
Router.transitions();
// ['fade', 'slide-left', 'slide-right', 'scale']
```

---

## Disabling transitions

```javascript
Router.setTransition('none');
// or
Router.setTransition(false);
```

---

## Custom transitions

Pass a configuration object instead of a preset name:

```javascript
Router.setTransition({
  enterClass: 'my-enter',
  leaveClass: 'my-leave',
  duration: 400,
  css: `
    .my-enter { animation: myFadeIn 400ms ease both; }
    .my-leave { animation: myFadeOut 400ms ease both; }
    @keyframes myFadeIn  { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes myFadeOut { from { opacity: 1; } to { opacity: 0; } }
  `
});
```

| Option | Type | Description |
|---|---|---|
| `enterClass` | string | CSS class added to the outlet after mounting the new view |
| `leaveClass` | string | CSS class added to the outlet before unmounting the current view |
| `duration` | number | Milliseconds to wait for the leave animation |
| `css` | string | CSS injected into `<head>` (once, auto-replaced on re-call) |

### Using your own existing CSS

If you already have transition CSS in your stylesheet, omit `css` and just provide the class names:

```css
/* your-styles.css */
.view-in  { animation: slideIn 300ms ease both; }
.view-out { animation: slideOut 300ms ease both; }

@keyframes slideIn  { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideOut { from { opacity: 1; } to { opacity: 0; } }
```

```javascript
Router.setTransition({
  enterClass: 'view-in',
  leaveClass: 'view-out',
  duration: 300
});
```

---

## How transitions work

The transition lifecycle on each navigation:

```
1. User navigates (Router.go() or link click)
   ↓
2. beforeEach guards run
   ↓
3. onLeave() on the current route
   ↓
4. onCleanup() functions run
   ↓
5. Outlet is cleared (old view removed)
   ↓
6. New view is mounted into the outlet
   ↓
7. 'change' event fires
   ↓
8. Router View module adds enterClass to the outlet
   ↓
9. CSS animation plays
   ↓
10. enterClass is removed after duration + 50ms
```

The enter animation plays as the new content appears. The module uses CSS classes and `@keyframes` animations — no JavaScript animation loop, no GSAP dependency.

---

## Controlling transition duration via CSS variable

All built-in presets respect the `--dh-transition-duration` CSS variable:

```css
:root {
  --dh-transition-duration: 500ms;  /* Slow down all transitions */
}
```

Or set it on the outlet element specifically:

```css
#app {
  --dh-transition-duration: 200ms;
}
```

---

## Outlet utilities

The view module also adds two outlet helper methods:

### `Router.getOutlet()`

Returns the current outlet element:

```javascript
const outlet = Router.getOutlet();  // HTMLElement or null
outlet.style.minHeight = '400px';
```

### `Router.clearOutlet()`

Manually empties the outlet. Normally the router handles this — use only in custom flows:

```javascript
Router.clearOutlet();
```

---

## Complete example

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    #app { min-height: 200px; }
    nav a { margin-right: 1rem; cursor: pointer; }
    .active { font-weight: bold; text-decoration: underline; }
  </style>
</head>
<body>
  <nav>
    <a data-route="/" data-route-active-class="active">Home</a>
    <a data-route="/about" data-route-active-class="active">About</a>
    <a data-route="/contact" data-route-active-class="active">Contact</a>
  </nav>

  <div id="app"></div>

  <template id="home">
    <h1>Home</h1><p>Welcome!</p>
  </template>
  <template id="about">
    <h1>About</h1><p>Learn more about us.</p>
  </template>
  <template id="contact">
    <h1>Contact</h1><p>Get in touch.</p>
  </template>

  <script src="01_dh-router.js"></script>
  <script src="02_dh-router-view.js"></script>
  <script src="03_dh-router-link.js"></script>
  <script>
    Router
      .define([
        { path: '/',        view: '#home',    title: 'Home' },
        { path: '/about',   view: '#about',   title: 'About' },
        { path: '/contact', view: '#contact', title: 'Contact' },
      ])
      .mount('#app')
      .setTransition('fade')
      .start({ mode: 'hash' });
  </script>
</body>
</html>
```

---

## Key takeaways

1. Load `02_dh-router-view.js` after the router core to enable transitions
2. **`Router.setTransition(preset)`** — use `'fade'`, `'slide-left'`, `'slide-right'`, or `'scale'`
3. **Custom transitions** — pass `{ enterClass, leaveClass, duration, css }`
4. The `--dh-transition-duration` CSS variable controls animation speed
5. **`Router.getOutlet()`** — access the outlet element directly
6. **`Router.clearOutlet()`** — manually clear the outlet if needed

---

## What's next?

- Declarative navigation links with `[data-route]` in depth
- Navigation guards for authentication, logging, and scroll memory
- Real-world examples combining all modules
