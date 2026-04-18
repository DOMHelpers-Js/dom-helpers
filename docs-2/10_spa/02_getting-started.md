[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Getting Started

Let's build your first SPA from scratch — a three-page app with working navigation in under 30 lines of code.

---

## What we're building

A simple app with three pages: Home, About, and a 404 page. Clicking the nav links swaps the content without reloading the page.

---

## Step 1: The HTML structure

You need three things in your HTML:
1. A navigation bar with links
2. An outlet `<div>` where views will render
3. `<template>` elements — one per "page"

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My App</title>
</head>
<body>

  <!-- Navigation -->
  <nav>
    <a data-route="/" data-route-active-class="active">Home</a>
    <a data-route="/about" data-route-active-class="active">About</a>
  </nav>

  <!-- Outlet — views render here -->
  <div id="app"></div>

  <!-- Page templates — hidden by default -->
  <template id="home-template">
    <h1>Home</h1>
    <p>Welcome to my app!</p>
  </template>

  <template id="about-template">
    <h1>About</h1>
    <p>This is the about page.</p>
  </template>

  <template id="404-template">
    <h1>Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
  </template>

  <!-- Scripts -->
  <script src="dom-helpers.spa.min.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

### Why `<template>` elements?

`<template>` elements are **inert** — their content is not rendered by the browser, not executed, and not displayed. They're a perfect holding place for view content that the router will clone and inject on demand.

---

## Step 2: Define and start the router

In your `app.js`:

```javascript
Router
  .define([
    {
      path: '/',
      view: '#home-template',
      title: 'Home'
    },
    {
      path: '/about',
      view: '#about-template',
      title: 'About'
    },
    {
      path: '*',
      view: '#404-template',
      title: 'Not Found'
    }
  ])
  .mount('#app')
  .start({ mode: 'hash' });
```

That's it. Your app now has:
- Working navigation between three pages
- Browser back/forward buttons
- `document.title` updated on each navigation
- Active link highlighting on the nav items
- A catch-all 404 page

---

## Understanding each part

### `Router.define(routes)`

Registers your route definitions. Each route is an object with:

| Property | Required | Description |
|---|---|---|
| `path` | yes | The URL path. Use `*` for 404. |
| `view` | yes | CSS selector for a `<template>`, or a factory function. |
| `title` | no | Sets `document.title` on navigation. |
| `onEnter` | no | Runs after the view mounts. |
| `onLeave` | no | Runs before the view unmounts. |

### `Router.mount(selector)`

Tells the router which element to use as the **outlet** — the container where views will be injected.

```javascript
Router.mount('#app');           // CSS selector
Router.mount(document.body);   // Or a direct element reference
```

### `Router.start(options)`

Attaches browser event listeners and immediately resolves the current URL.

```javascript
Router.start({ mode: 'hash' });    // http://site.com/#/about
Router.start({ mode: 'history' }); // http://site.com/about (needs server config)
```

**Methods chain** — you can write them fluently:

```javascript
Router.define([...]).mount('#app').start({ mode: 'hash' });
```

---

## Step 3: Load order for modules

If you use the optional modules, the load order matters:

```html
<!-- Core — always first -->
<script src="01_dh-router.js"></script>

<!-- Optional — any order after core -->
<script src="02_dh-router-view.js"></script>   <!-- transitions -->
<script src="03_dh-router-link.js"></script>   <!-- [data-route] links -->
<script src="04_dh-router-guards.js"></script>  <!-- auth guards -->

<!-- Your app code — always last -->
<script src="app.js"></script>
```

Each module checks for `Router` and logs a clear error if the core wasn't loaded first.

---

## Adding a transition

Add the view module and call `setTransition` before `start`:

```javascript
// After loading 02_dh-router-view.js

Router
  .define([...])
  .mount('#app')
  .setTransition('fade')   // ← one line adds a fade animation
  .start({ mode: 'hash' });
```

Built-in presets: `'fade'`, `'slide-left'`, `'slide-right'`, `'scale'`.

---

## Adding auth protection

Add the guards module and call `requireAuth` before `start`:

```javascript
// After loading 04_dh-router-guards.js

Router.requireAuth(
  () => !!localStorage.getItem('token'),  // auth check
  '/login'                                 // redirect if not authed
);

Router
  .define([
    { path: '/login',     view: '#login-template' },
    { path: '/dashboard', view: '#dashboard-template' },
  ])
  .mount('#app')
  .start({ mode: 'hash' });
```

---

## What happens on first load?

When `Router.start()` is called:

```
1. Browser event listeners are attached (hashchange or popstate)
   ↓
2. Router reads the current URL
   ↓
3. Router matches it against your defined routes
   ↓
4. The matching view is cloned from its <template> and injected into the outlet
   ↓
5. The onEnter hook runs (if defined)
   ↓
6. document.title is updated (if defined)
   ↓
7. Active classes are applied to [data-route] links
```

This happens in milliseconds — the user sees the correct page immediately.

---

## Common beginner mistakes

### ❌ Calling start() before define()

```javascript
// WRONG — no routes are registered yet
Router.mount('#app').start();
Router.define([...]);
```

```javascript
// RIGHT — define routes first
Router.define([...]).mount('#app').start();
```

### ❌ Missing the outlet element

```javascript
Router.mount('#app');  // Fine
```

```html
<!-- WRONG — no element with id="app" exists -->
<div id="main"></div>
```

```html
<!-- RIGHT — selector matches an element -->
<div id="app"></div>
```

### ❌ Referencing a template that doesn't exist

```javascript
{ path: '/', view: '#home-template' }
```

```html
<!-- WRONG — id doesn't match -->
<template id="home"></template>
```

```html
<!-- RIGHT — id matches exactly -->
<template id="home-template"></template>
```

### ❌ Forgetting the catch-all route

Without a `path: '*'` route, navigating to an unknown URL triggers a `notfound` event but shows nothing.

```javascript
// Always add a catch-all as the last route
{ path: '*', view: '#404-template' }
```

---

## The minimal working setup

```html
<div id="app"></div>
<template id="home"><h1>Home</h1></template>
<template id="404"><h1>Not Found</h1></template>
<script src="dom-helpers.spa.min.js"></script>
<script>
  Router.define([
    { path: '/', view: '#home' },
    { path: '*', view: '#404' }
  ]).mount('#app').start();
</script>
```

This is the smallest possible working router. Everything else is optional.

---

## What's next?

Now that you have a working router, let's explore:
- Defining routes with named parameters and wildcards
- Running code when a route is entered or left
- Programmatic navigation with `Router.go()`
- View transitions and animations
