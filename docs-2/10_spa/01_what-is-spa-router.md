[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# SPA Router

## What is it?

The DOM Helpers SPA Router is a **client-side router** — a system that lets you build Single Page Applications where navigating between pages never causes a full browser reload.

Instead of the browser fetching a new HTML file for each URL, the router intercepts navigation, swaps out just the content that needs to change, and updates the browser's address bar — all without leaving the page.

Think of it as giving your plain HTML page **the ability to feel like a multi-page app**, with real URLs, browser history, back/forward buttons, and animated transitions — all running in a single file.

---

## Why does this exist?

Imagine you're building a small web app with three sections: Home, About, and a User profile page.

### The old-fashioned way

Without a router, you'd have three separate HTML files:

```
index.html      → http://mysite.com/
about.html      → http://mysite.com/about.html
user.html       → http://mysite.com/user.html
```

Every time the user clicks a link, the **entire page reloads**. The browser:
- Throws away all JavaScript state
- Makes a new network request
- Re-downloads and re-parses HTML, CSS, and JS
- Flashes white between navigations

**Problems:**
- ❌ Every navigation loses your JS state (open menus, loaded data, etc.)
- ❌ Page flashes and full reloads feel sluggish
- ❌ You can't animate between pages
- ❌ Dynamic URLs like `/user/42` require server-side routing config

### The SPA Router way

```javascript
Router
  .define([
    { path: '/',         view: '#home-template',  title: 'Home' },
    { path: '/about',    view: '#about-template', title: 'About' },
    { path: '/user/:id', view: '#user-template',  title: 'User Profile' },
  ])
  .mount('#app')
  .start({ mode: 'hash' });
```

Now every "page" is a `<template>` element in your HTML. Clicking a link swaps the content instantly — no reload, no flash, no lost state.

**What changed?**
- ✅ Navigation is instant — no page reload
- ✅ JavaScript state is preserved across navigations
- ✅ Real URLs with parameters like `/user/42`
- ✅ Browser back/forward buttons work correctly
- ✅ Animated transitions between pages
- ✅ Works on any static host (hash mode needs zero server config)

---

## How is this different from a plain multi-page site?

A plain site hands navigation entirely to the browser. The SPA Router **intercepts** navigation and handles it in JavaScript.

```
Plain multi-page site:
  User clicks link → Browser fetches new page → Full reload → Page is shown

SPA Router:
  User clicks link → Router intercepts → Swaps content → URL updates → No reload
```

The user experience feels identical — the URL changes, the back button works, the title updates — but under the hood, **only the content area changes**.

---

## Mental model: The TV remote

Think of the SPA Router like a **TV remote** controlling what's displayed on a screen.

```
Plain multi-page site (no remote):
├── You want to watch a different channel
├── You get up, walk to the TV, unplug it
├── Plug in a different TV
└── Sit back down — but all your snacks fell on the floor

SPA Router (with remote):
├── You want to navigate to a different page
├── You press a button on the remote
├── The screen changes instantly
└── You never left the couch — state preserved, no disruption
```

The Router is the remote. Your outlet `<div>` is the screen. Your `<template>` elements are the channels.

---

## The four modules

The SPA Router is split into four focused files, each optional beyond the core:

```
Module 1: Router Core (01_dh-router.js)                     ← required
├── Route definition and matching
├── Hash mode and history mode
├── Named params (/user/:id)
├── Navigation pipeline (go, back, forward)
├── Lifecycle hooks (onEnter, onLeave, onCleanup)
└── Event system (change, error, notfound)

Module 2: Router View (02_dh-router-view.js)                ← optional
├── Built-in CSS transitions (fade, slide-left, slide-right, scale)
├── Custom transition support
├── Outlet management (getOutlet, clearOutlet)
└── Transition presets list

Module 3: Router Link (03_dh-router-link.js)                ← optional
├── [data-route] declarative navigation on any element
├── Automatic active class management
├── [data-route-exact] for exact matching
├── Router.createLink() programmatic link creation
└── Router.refreshLinks() for dynamic content

Module 4: Router Guards (04_dh-router-guards.js)            ← optional
├── Router.requireAuth()       — auth redirect guard
├── Router.requireGuest()      — guest-only route guard
├── Router.guardRoute()        — per-route custom guard
├── Router.enableLogging()     — navigation logging
├── Router.enableScrollMemory() — scroll position restore
└── Router.setTitleResolver()  — dynamic page titles
```

You don't need all four. Start with just the core — add the others as your app grows.

---

## Hash mode vs history mode

The router supports two URL modes:

### Hash mode (`mode: 'hash'`)

```
http://mysite.com/#/about
http://mysite.com/#/user/42
```

- Works on **any static host** — GitHub Pages, Netlify, S3, etc.
- Zero server configuration required
- The `#` is visible in the URL

### History mode (`mode: 'history'`)

```
http://mysite.com/about
http://mysite.com/user/42
```

- Clean URLs with no `#`
- Requires the server to serve `index.html` for all routes (fallback config)
- Ideal for apps deployed on servers you control

**When in doubt, use hash mode.** It works everywhere with no setup.

---

## The basic anatomy

Every router setup has three parts:

### 1. Define your routes

```javascript
Router.define([
  { path: '/',      view: '#home-template'  },
  { path: '/about', view: '#about-template' },
  { path: '*',      view: '#404-template'   },
]);
```

### 2. Mount your outlet

```javascript
Router.mount('#app');
```

The outlet is the `<div>` where your views get rendered.

### 3. Start the router

```javascript
Router.start({ mode: 'hash' });
```

This attaches browser event listeners and resolves the current URL immediately.

---

## What the router manages for you

| Concern | Without router | With router |
|---|---|---|
| URL changes | Full page reload | Instant, no reload |
| Browser history | Built-in, breaks with JS | Works correctly |
| Back/forward buttons | Works (causes reload) | Works (no reload) |
| Dynamic URLs `/user/:id` | Server config needed | Built-in |
| Page transitions | CSS hacks, flicker | Smooth built-in presets |
| Auth redirects | Manual checks everywhere | One guard declaration |
| Active nav links | Manual class toggling | Automatic |
| Scroll position | Jumps to top on reload | Configurable |
| Page title | Manual `document.title` | Per-route or dynamic |

---

## Zero dependencies

The SPA Router module has **no dependencies** — not even on the rest of DOM Helpers. It's a self-contained `Router` global that you can use standalone:

```html
<!-- Standalone usage — no other DOMHelpers modules needed -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.spa.min.js"></script>
```

Or the full DOM Helpers bundle:

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.0/dist/dom-helpers.full-spa.min.js"></script>
```

When loaded with the full bundle, `Router` is also available as `DOMHelpers.Router`.

---

## When you'll use this

**Personal portfolio or docs site:**
```javascript
Router.define([
  { path: '/',        view: '#home',    title: 'Home' },
  { path: '/projects', view: '#projects', title: 'Projects' },
  { path: '/contact', view: '#contact', title: 'Contact' },
]).mount('#content').start();
```

**Dashboard with auth:**
```javascript
Router.requireAuth(() => !!localStorage.getItem('token'), '/login');

Router.define([
  { path: '/login',     view: '#login-template' },
  { path: '/dashboard', view: '#dashboard-template' },
  { path: '/profile',   view: '#profile-template' },
]).mount('#app').start();
```

**Blog with dynamic posts:**
```javascript
Router.define([
  { path: '/',          view: '#home' },
  { path: '/post/:slug', view: '#post-template',
    onEnter: (params) => loadPost(params.slug) },
]).mount('#app').start();
```

---

## The golden rule

> *"Define your routes, mount an outlet, start the router. Navigation takes care of itself."*

---

## What's next?

- How to set up your first SPA in minutes
- Defining routes with params and wildcards
- Programmatic and declarative navigation
- View transitions and animations
- Navigation guards for auth protection
