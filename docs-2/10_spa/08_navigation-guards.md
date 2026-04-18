[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Navigation Guards

Navigation guards run **before** a route is entered. They can allow navigation, redirect to another path, or block it entirely. The guards module (`04_dh-router-guards.js`) provides pre-built guards for common patterns plus a way to write your own.

---

## Setup

Load after the router core:

```html
<script src="01_dh-router.js"></script>
<script src="04_dh-router-guards.js"></script>
```

Guards should be registered **before** `Router.start()`:

```javascript
// Register guards first
Router.requireAuth(() => isLoggedIn(), '/login');

// Then define routes and start
Router.define([...]).mount('#app').start();
```

---

## Low-level guards — `Router.beforeEach()`

The foundation of all guards. Your function runs before every navigation:

```javascript
Router.beforeEach((to, from, next) => {
  // to   — the route being navigated to { path, params, query, _record }
  // from — the previous route (null on first load)
  // next — call this to proceed

  next();          // Allow navigation
  next('/login');  // Redirect to /login instead
  // (don't call next) — blocks navigation entirely
});
```

Calling nothing blocks the navigation permanently. This is rarely what you want — usually you redirect.

### `afterEach` — runs after navigation completes

```javascript
Router.afterEach((to, from) => {
  // Runs after every successful navigation
  // Cannot block or redirect — fire-and-forget
  analytics.page(to.path);
});
```

---

## Auth guard — `Router.requireAuth()`

Protects routes from unauthenticated users. Redirects to a login page if the auth check fails.

```javascript
Router.requireAuth(authCheckFn, redirectPath, protect);
```

| Argument | Type | Default | Description |
|---|---|---|---|
| `authCheckFn` | `() => boolean` | — | Returns `true` if the user is authenticated |
| `redirectPath` | `string` | — | Where to redirect unauthenticated users |
| `protect` | `string \| string[] \| '*'` | `'*'` | Which paths to protect |

### Protect all routes

```javascript
Router.requireAuth(
  () => !!localStorage.getItem('token'),
  '/login'
);
```

Every route requires authentication. The `/login` path is automatically excluded (infinite loop prevention).

### Protect specific paths

```javascript
Router.requireAuth(
  () => !!localStorage.getItem('token'),
  '/login',
  ['/dashboard', '/profile', '/settings']
);
```

Only paths starting with `/dashboard`, `/profile`, or `/settings` require auth. All other routes are public.

### Single protected path prefix

```javascript
Router.requireAuth(
  () => store.isLoggedIn,
  '/login',
  '/admin'
);
```

Protects `/admin`, `/admin/users`, `/admin/settings`, etc.

---

## Guest guard — `Router.requireGuest()`

The opposite of `requireAuth`. Redirects **authenticated** users away from guest-only routes (like `/login` or `/register`).

```javascript
Router.requireGuest(authCheckFn, redirectPath, guestRoutes);
```

| Argument | Type | Default | Description |
|---|---|---|---|
| `authCheckFn` | `() => boolean` | — | Returns `true` if authenticated |
| `redirectPath` | `string` | — | Where to send authenticated users |
| `guestRoutes` | `string \| string[]` | all routes | Which paths are guest-only |

### Redirect logged-in users away from /login

```javascript
Router.requireGuest(
  () => !!localStorage.getItem('token'),
  '/dashboard',
  '/login'
);
```

If an authenticated user navigates to `/login`, they're redirected to `/dashboard` automatically.

### Multiple guest routes

```javascript
Router.requireGuest(
  () => !!localStorage.getItem('token'),
  '/dashboard',
  ['/login', '/register', '/forgot-password']
);
```

---

## Auth + Guest combined

The typical pattern for an app with a login page:

```javascript
// Unauthenticated users → /login
Router.requireAuth(
  () => !!localStorage.getItem('token'),
  '/login',
  ['/dashboard', '/profile']
);

// Authenticated users → /dashboard (don't show login again)
Router.requireGuest(
  () => !!localStorage.getItem('token'),
  '/dashboard',
  '/login'
);

Router.define([
  { path: '/login',     view: '#login-template' },
  { path: '/dashboard', view: '#dashboard-template' },
  { path: '/profile',   view: '#profile-template' },
]).mount('#app').start();
```

---

## Per-route guard — `Router.guardRoute()`

Attach a custom guard to a specific route path:

```javascript
Router.guardRoute(path, guardFn);
```

```javascript
// Guard a single route
Router.guardRoute('/admin', (to, from, next) => {
  isAdmin() ? next() : next('/403');
});

// Guard with redirect back after login
Router.guardRoute('/checkout', (to, from, next) => {
  if (!isLoggedIn()) {
    next('/login?redirect=/checkout');
  } else {
    next();
  }
});
```

The guard only runs when the destination path **matches or starts with** the given path.

---

## Removing a guard — `Router.removeGuard()`

Remove a guard registered via `guardRoute()`, `requireAuth()`, or `requireGuest()`. Pass the **original function reference**:

```javascript
function myGuard(to, from, next) {
  next();
}

Router.beforeEach(myGuard);
// Later:
Router.removeGuard(myGuard);
```

For `guardRoute`:
```javascript
function checkRole(to, from, next) {
  isAdmin() ? next() : next('/403');
}

Router.guardRoute('/admin', checkRole);
// Later:
Router.removeGuard(checkRole);
```

---

## Navigation logging — `Router.enableLogging()`

Log all route transitions to the console. Useful during development:

```javascript
Router.enableLogging();
```

Output on every navigation:
```
[Router] (initial) → /dashboard { params: {} }
[Router] /dashboard → /profile { params: {} }
[Router] /profile → /user/42 { params: { id: '42' } }
```

Disable logging:

```javascript
Router.disableLogging();
```

---

## Scroll position memory — `Router.enableScrollMemory()`

Automatically saves and restores the scroll position when navigating back to a previously visited route:

```javascript
Router.enableScrollMemory();
```

```
1. User scrolls down 800px on /blog
2. User navigates to /about
3. User navigates back to /blog
4. Page scrolls back to 800px automatically
```

This is enabled once and applies to all routes. It works by:
- Saving `scrollX`/`scrollY` in a `beforeEach` guard when leaving a route
- Restoring the saved position in an `afterEach` hook after entering a known route

---

## Dynamic page titles — `Router.setTitleResolver()`

Override or extend the static `title` property on route definitions with a dynamic function:

```javascript
Router.setTitleResolver((route) => {
  const base = 'My App';
  const page = route._record.title || route.path;
  return `${base} — ${page}`;
});
```

The resolver runs after every navigation and receives the full `RouteMatch` object.

### With params in the title

```javascript
Router.setTitleResolver((route) => {
  if (route.path.startsWith('/user/')) {
    return `User ${route.params.id} — My App`;
  }
  return route._record.title || 'My App';
});
```

---

## Writing a custom `beforeEach` guard

For anything not covered by the built-in helpers:

```javascript
// Role-based access
Router.beforeEach((to, from, next) => {
  const route = to.path;
  const user = getUser();

  if (route.startsWith('/admin') && user.role !== 'admin') {
    next('/403');
    return;
  }

  if (route.startsWith('/manager') && !['admin', 'manager'].includes(user.role)) {
    next('/403');
    return;
  }

  next();
});
```

```javascript
// Unsaved changes warning
let hasUnsavedChanges = false;

Router.beforeEach((to, from, next) => {
  if (hasUnsavedChanges) {
    const confirmed = window.confirm('You have unsaved changes. Leave anyway?');
    if (confirmed) {
      hasUnsavedChanges = false;
      next();
    }
    // Don't call next() to block navigation
    return;
  }
  next();
});
```

```javascript
// Feature flag guard
Router.beforeEach((to, from, next) => {
  if (to.path === '/new-feature' && !featureFlags.newFeatureEnabled) {
    next('/coming-soon');
    return;
  }
  next();
});
```

---

## Guard execution order

When navigating, guards run in this sequence:

```
1. All beforeEach guards (in registration order)
   - Built-in: requireAuth, requireGuest, guardRoute, logging, custom
   ↓
2. If any guard redirects → navigate to redirect target (from step 1)
3. If any guard blocks → navigation cancelled
   ↓
4. onLeave() on the current route
   ↓
5. onCleanup() functions
   ↓
6. Outlet cleared, new view mounted
   ↓
7. onEnter() on the new route
   ↓
8. All afterEach guards
   - enableScrollMemory restore, setTitleResolver, custom afterEach
   ↓
9. 'change' event emitted
```

---

## Key takeaways

1. **`Router.requireAuth(fn, redirect, protect)`** — redirect unauthenticated users
2. **`Router.requireGuest(fn, redirect, routes)`** — redirect authenticated users away from guest pages
3. **`Router.guardRoute(path, fn)`** — guard a specific route with a custom function
4. **`Router.beforeEach(fn)`** — run a function before every navigation; call `next()` to proceed, `next('/path')` to redirect
5. **`Router.afterEach(fn)`** — run after every navigation; cannot block
6. **`Router.enableLogging()`** — console.log all transitions (dev mode)
7. **`Router.enableScrollMemory()`** — restore scroll position on back navigation
8. **`Router.setTitleResolver(fn)`** — dynamic `document.title` per route
9. **`Router.removeGuard(fn)`** — remove a previously registered guard

---

## What's next?

- Real-world examples combining all four modules
- Full API reference
