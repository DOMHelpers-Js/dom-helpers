[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Defining Routes

Routes are the map of your application — they connect URLs to views and lifecycle hooks. This page covers every option available on a route definition.

---

## The route definition object

Each route is a plain JavaScript object passed to `Router.define()`:

```javascript
Router.define([
  {
    path: '/user/:id',
    view: '#user-template',
    title: 'User Profile',
    onEnter: (params, query, onCleanup) => { /* ... */ },
    onLeave: () => { /* ... */ }
  }
]);
```

| Property | Type | Required | Description |
|---|---|---|---|
| `path` | `string` | yes | URL path pattern |
| `view` | `string` or `Function` | yes | Template selector or factory function |
| `title` | `string` | no | Sets `document.title` on navigation |
| `onEnter` | `Function` | no | Called after the view mounts |
| `onLeave` | `Function` | no | Called before the view unmounts |

---

## path

The `path` is matched against the current URL. Three forms are supported:

### Static paths

Exact string match:

```javascript
{ path: '/',       view: '#home' }
{ path: '/about',  view: '#about' }
{ path: '/contact', view: '#contact' }
```

### Named parameters

Segments prefixed with `:` become named parameters:

```javascript
{ path: '/user/:id',              view: '#user' }
{ path: '/post/:year/:month/:slug', view: '#post' }
{ path: '/category/:name/page/:num', view: '#category' }
```

The extracted values are available in `onEnter` as the `params` object:

```javascript
{
  path: '/user/:id',
  view: '#user-template',
  onEnter: (params) => {
    console.log(params.id);  // e.g. '42' for /user/42
  }
}
```

Parameter values are always **strings** — convert them if you need a number:

```javascript
onEnter: (params) => {
  const userId = Number(params.id);
}
```

### Catch-all wildcard

`'*'` matches any URL that no other route matched. Use it for 404 pages:

```javascript
{ path: '*', view: '#404-template', title: 'Not Found' }
```

**Always define the catch-all as the last route.** Routes are evaluated in order — regular routes first, catch-all last.

---

## view

The `view` property tells the router what to render in the outlet. It accepts two forms:

### CSS selector (string)

Points to a `<template>` element in your document:

```javascript
{ path: '/', view: '#home-template' }
```

```html
<template id="home-template">
  <section class="home">
    <h1>Welcome</h1>
    <p>This is the home page.</p>
  </section>
</template>
```

The router clones the template's content and appends it to the outlet. **The original `<template>` is never modified** — each navigation gets a fresh clone.

### Factory function

For dynamic views, pass a function that returns an `HTMLElement` or an HTML string:

```javascript
{
  path: '/user/:id',
  view: async (params, query) => {
    const user = await fetchUser(params.id);
    return `
      <div class="profile">
        <h1>${user.name}</h1>
        <p>${user.bio}</p>
      </div>
    `;
  }
}
```

The factory receives the same `(params, query)` arguments as `onEnter`. It may be `async`.

**Return values:**
- An **HTML string** → wrapped in a `<div>` and appended to the outlet
- An **HTMLElement** → appended directly

```javascript
// Returning an element
{
  path: '/counter',
  view: () => {
    const el = document.createElement('div');
    el.className = 'counter';
    el.textContent = 'Count: 0';
    return el;
  }
}
```

---

## title

Sets `document.title` when this route becomes active:

```javascript
{ path: '/about', view: '#about', title: 'About Us' }
```

For dynamic titles based on params, use `Router.setTitleResolver()` from the guards module instead.

---

## onEnter

Called **after** the view has been mounted into the outlet:

```javascript
{
  path: '/dashboard',
  view: '#dashboard-template',
  onEnter: (params, query, onCleanup) => {
    // params — named route parameters
    // query  — URLSearchParams for the current URL
    // onCleanup — register teardown functions
  }
}
```

### Parameters

**`params`** — an object with the extracted named parameters:

```javascript
// Route: /post/:year/:slug
// URL:   /post/2024/hello-world

onEnter: (params) => {
  console.log(params.year);  // '2024'
  console.log(params.slug);  // 'hello-world'
}
```

**`query`** — a `URLSearchParams` instance for query string values:

```javascript
// URL: /search?q=router&page=2

onEnter: (params, query) => {
  console.log(query.get('q'));     // 'router'
  console.log(query.get('page'));  // '2'
}
```

**`onCleanup`** — register functions to run when the view is unmounted:

```javascript
onEnter: (params, query, onCleanup) => {
  const interval = setInterval(updateClock, 1000);

  // This runs automatically when leaving the route
  onCleanup(() => clearInterval(interval));
}
```

### Async onEnter

`onEnter` can be `async`. The router awaits it before emitting the `change` event:

```javascript
{
  path: '/profile',
  view: '#profile-template',
  onEnter: async (params, query, onCleanup) => {
    const data = await fetchProfile();
    document.getElementById('username').textContent = data.name;
  }
}
```

---

## onLeave

Called **before** the current view is unmounted. Useful for saving state or showing a confirmation:

```javascript
{
  path: '/editor',
  view: '#editor-template',
  onLeave: () => {
    saveDraft();
  }
}
```

`onLeave` can also be `async`:

```javascript
onLeave: async () => {
  await saveToServer();
}
```

**Note:** `onLeave` runs before `onCleanup` functions. The sequence on navigation away is:
1. `onLeave()` on the current route
2. `onCleanup()` functions registered during `onEnter`
3. Outlet cleared
4. New view mounted
5. `onEnter()` on the new route

---

## Route order matters

Routes are evaluated **top to bottom**. More specific routes should come before less specific ones:

```javascript
Router.define([
  { path: '/',           view: '#home' },       // exact match first
  { path: '/user/new',   view: '#new-user' },   // specific before param
  { path: '/user/:id',   view: '#user' },        // param route second
  { path: '*',           view: '#404' },         // catch-all always last
]);
```

If you put `/user/:id` before `/user/new`, navigating to `/user/new` would match `:id` with the value `'new'` instead of hitting the intended route.

---

## Complete route examples

### Static pages

```javascript
Router.define([
  { path: '/',        view: '#home',    title: 'Home' },
  { path: '/about',   view: '#about',   title: 'About' },
  { path: '/contact', view: '#contact', title: 'Contact Us' },
  { path: '*',        view: '#404',     title: 'Not Found' },
]);
```

### Blog with dynamic posts

```javascript
Router.define([
  {
    path: '/',
    view: '#home-template',
    title: 'Blog Home'
  },
  {
    path: '/post/:slug',
    view: '#post-template',
    title: 'Post',
    onEnter: async (params, query, onCleanup) => {
      const post = await fetchPost(params.slug);
      document.getElementById('post-title').textContent = post.title;
      document.getElementById('post-body').innerHTML = post.html;
      document.title = post.title + ' — My Blog';
    }
  },
  {
    path: '*',
    view: '#404-template',
    title: 'Not Found'
  }
]);
```

### Dashboard with data fetching and cleanup

```javascript
Router.define([
  {
    path: '/dashboard',
    view: '#dashboard-template',
    onEnter: (params, query, onCleanup) => {
      // Poll for live stats
      const timer = setInterval(async () => {
        const stats = await fetchStats();
        renderStats(stats);
      }, 5000);

      // Auto-cancelled when leaving the dashboard
      onCleanup(() => clearInterval(timer));
    },
    onLeave: () => {
      console.log('Left dashboard');
    }
  }
]);
```

### Factory view with dynamic content

```javascript
Router.define([
  {
    path: '/user/:id',
    view: async (params) => {
      const user = await fetchUser(params.id);
      return `
        <div class="user-card">
          <img src="${user.avatar}" alt="${user.name}">
          <h1>${user.name}</h1>
          <p>${user.bio}</p>
        </div>
      `;
    },
    title: 'User Profile'
  }
]);
```

---

## Key takeaways

1. **`path`** supports static strings, `:named` params, and `*` wildcard
2. **`view`** is a `<template>` selector or a factory function returning HTML/element
3. **`onEnter`** receives `(params, query, onCleanup)` and can be async
4. **`onLeave`** runs before unmount and can be async
5. **`onCleanup`** — register teardown inside `onEnter` to keep cleanup colocated
6. **Route order matters** — put specific routes before generic ones, catch-all last

---

## What's next?

Now that you know how to define routes, let's look at how to navigate between them:
- Programmatic navigation with `Router.go()`, `back()`, and `forward()`
- Declarative navigation with `[data-route]` attributes
- Reading the current route with `Router.current()`
