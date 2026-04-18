[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# API Reference

Complete reference for all methods and properties across the four SPA Router modules.

---

## Module 1 — Router Core (`01_dh-router.js`)

Global: `Router` / `DOMHelpers.Router`

---

### `Router.define(routes)`

Register all application routes. Must be called before `Router.start()`.

```javascript
Router.define(routes: RouteDefinition[]) → Router
```

**`RouteDefinition`:**

| Property | Type | Required | Description |
|---|---|---|---|
| `path` | `string` | yes | URL path. Supports `:param` and `*` wildcard. |
| `view` | `string \| Function` | yes | CSS selector for a `<template>`, or factory `(params, query) => HTMLElement \| string` |
| `title` | `string` | no | Sets `document.title` on navigation |
| `onEnter` | `Function` | no | `(params, query, onCleanup) => void \| Promise` — runs after view mounts |
| `onLeave` | `Function` | no | `() => void \| Promise` — runs before view unmounts |

```javascript
Router.define([
  { path: '/',       view: '#home',           title: 'Home' },
  { path: '/user/:id', view: '#user',         onEnter: (p) => load(p.id) },
  { path: '*',       view: '#404',            title: 'Not Found' },
]);
```

---

### `Router.mount(selectorOrElement)`

Set the outlet element where views will be rendered.

```javascript
Router.mount(selectorOrElement: string | HTMLElement) → Router
```

```javascript
Router.mount('#app');
Router.mount(document.getElementById('app'));
```

---

### `Router.start(options?)`

Attach browser event listeners and resolve the current URL. Call once after `define()` and `mount()`.

```javascript
Router.start(options?: StartOptions) → Router
```

**`StartOptions`:**

| Option | Type | Default | Description |
|---|---|---|---|
| `mode` | `'hash' \| 'history'` | `'hash'` | URL mode |
| `scrollToTop` | `boolean` | `true` | Scroll to (0,0) after each navigation |
| `base` | `string` | `''` | Base path prefix for history mode |

```javascript
Router.start({ mode: 'hash' });
Router.start({ mode: 'history', base: '/app', scrollToTop: false });
```

---

### `Router.go(path)`

Navigate programmatically to a path.

```javascript
Router.go(path: string) → Router
```

```javascript
Router.go('/about');
Router.go('/user/42');
Router.go('/search?q=hello');
```

---

### `Router.back()`

Go one step back in browser history.

```javascript
Router.back() → Router
```

---

### `Router.forward()`

Go one step forward in browser history.

```javascript
Router.forward() → Router
```

---

### `Router.current()`

Return a snapshot of the currently active route, or `null` before the first navigation.

```javascript
Router.current() → RouteMatch | null
```

**`RouteMatch`:**

| Property | Type | Description |
|---|---|---|
| `path` | `string` | The matched URL path |
| `params` | `Object` | Named route parameters |
| `query` | `URLSearchParams` | Query string |
| `title` | `string \| null` | Route title |

```javascript
const route = Router.current();
// { path: '/user/42', params: { id: '42' }, query: URLSearchParams, title: 'User' }
```

---

### `Router.configure(options)`

Update runtime options after `start()` has been called.

```javascript
Router.configure(options: Partial<StartOptions>) → Router
```

```javascript
Router.configure({ scrollToTop: false });
Router.configure({ base: '/v2' });
```

---

### `Router.on(event, handler)`

Subscribe to a router event.

```javascript
Router.on(event: 'change' | 'error' | 'notfound', handler: Function) → Router
```

| Event | Handler signature | Fires when |
|---|---|---|
| `'change'` | `({ to, from }) => void` | Navigation completes successfully |
| `'notfound'` | `({ path }) => void` | No route matched (no `*` catch-all) |
| `'error'` | `(error: Error) => void` | Any error in a hook, factory, or guard |

```javascript
Router.on('change', ({ to, from }) => {
  console.log(from?.path, '→', to.path);
});

Router.on('error', (err) => {
  console.error(err);
});
```

---

### `Router.off(event, handler)`

Unsubscribe from a router event.

```javascript
Router.off(event: string, handler: Function) → Router
```

---

### `Router.beforeEach(fn)`

Register a navigation guard that runs before every route change.

```javascript
Router.beforeEach(fn: (to, from, next) => void) → Router
```

- Call `next()` to allow navigation
- Call `next('/path')` to redirect
- Don't call `next()` to block navigation

```javascript
Router.beforeEach((to, from, next) => {
  isLoggedIn() ? next() : next('/login');
});
```

---

### `Router.afterEach(fn)`

Register a hook that runs after every successful navigation. Cannot block or redirect.

```javascript
Router.afterEach(fn: (to, from) => void) → Router
```

```javascript
Router.afterEach((to) => {
  analytics.page(to.path);
});
```

---

## Module 2 — Router View (`02_dh-router-view.js`)

Adds transition and outlet utilities to the `Router` object.

---

### `Router.setTransition(preset)`

Configure view transitions.

```javascript
Router.setTransition(preset: string | TransitionConfig | false) → Router
```

**String presets:** `'fade'`, `'slide-left'`, `'slide-right'`, `'scale'`, `'none'`

**`TransitionConfig`:**

| Option | Type | Description |
|---|---|---|
| `enterClass` | `string` | CSS class added to outlet after mount |
| `leaveClass` | `string` | CSS class added to outlet before unmount |
| `duration` | `number` | Milliseconds for the leave animation |
| `css` | `string` | CSS injected into `<head>` |

```javascript
Router.setTransition('fade');
Router.setTransition({ enterClass: 'my-in', leaveClass: 'my-out', duration: 300 });
Router.setTransition(false);  // Disable
```

---

### `Router.transitions()`

Returns an array of available built-in preset names.

```javascript
Router.transitions() → string[]
// ['fade', 'slide-left', 'slide-right', 'scale']
```

---

### `Router.getOutlet()`

Returns the current outlet element.

```javascript
Router.getOutlet() → HTMLElement | null
```

---

### `Router.clearOutlet()`

Manually empty the outlet's contents.

```javascript
Router.clearOutlet() → Router
```

---

## Module 3 — Router Link (`03_dh-router-link.js`)

Adds declarative navigation and link utilities to the `Router` object.

---

### `[data-route]` attribute

Makes any element navigate on click:

```html
<a data-route="/path">Link</a>
<button data-route="/path">Button</button>
```

---

### `[data-route-active-class]` attribute

CSS class applied when the element's route is active:

```html
<a data-route="/about" data-route-active-class="active">About</a>
```

---

### `[data-route-exact]` attribute

Require exact path match for the active class (default is prefix matching):

```html
<a data-route="/blog" data-route-active-class="active" data-route-exact>Blog</a>
```

---

### `Router.createLink(path, label?, activeClass?, tag?)`

Programmatically create a `[data-route]` element.

```javascript
Router.createLink(
  path: string,
  label?: string,
  activeClass?: string,
  tag?: string   // default: 'a'
) → HTMLElement
```

```javascript
const link = Router.createLink('/home', 'Home', 'active');
const btn  = Router.createLink('/about', 'About', 'is-active', 'button');
```

---

### `Router.refreshLinks()`

Re-scan and update active states on all `[data-route]` elements. Use after dynamic DOM insertion.

```javascript
Router.refreshLinks() → Router
```

---

## Module 4 — Router Guards (`04_dh-router-guards.js`)

Adds guard factories and utilities to the `Router` object.

---

### `Router.requireAuth(authFn, redirectPath, protect?)`

Guard requiring authentication. Redirects unauthenticated users.

```javascript
Router.requireAuth(
  authFn: () => boolean,
  redirectPath: string,
  protect?: string | string[] | '*'   // default: '*' (all routes)
) → Router
```

```javascript
Router.requireAuth(() => !!localStorage.getItem('token'), '/login');
Router.requireAuth(() => isLoggedIn(), '/login', ['/dashboard', '/admin']);
```

---

### `Router.requireGuest(authFn, redirectPath, guestRoutes?)`

Redirect authenticated users away from guest-only routes.

```javascript
Router.requireGuest(
  authFn: () => boolean,
  redirectPath: string,
  guestRoutes?: string | string[]   // default: all routes
) → Router
```

```javascript
Router.requireGuest(() => isLoggedIn(), '/dashboard', '/login');
Router.requireGuest(() => isLoggedIn(), '/dashboard', ['/login', '/register']);
```

---

### `Router.guardRoute(path, guardFn)`

Attach a custom guard to a specific route path.

```javascript
Router.guardRoute(
  path: string,
  guardFn: (to, from, next) => void
) → Router
```

```javascript
Router.guardRoute('/admin', (to, from, next) => {
  isAdmin() ? next() : next('/403');
});
```

---

### `Router.removeGuard(fn)`

Remove a guard by its original function reference.

```javascript
Router.removeGuard(fn: Function) → Router
```

Works with guards registered via `guardRoute()`, `requireAuth()`, `requireGuest()`, or `beforeEach()`.

---

### `Router.enableLogging()`

Enable console logging of all route transitions.

```javascript
Router.enableLogging() → Router
```

Output: `[Router] /from → /to { params: {...} }`

---

### `Router.disableLogging()`

Disable route transition logging.

```javascript
Router.disableLogging() → Router
```

---

### `Router.enableScrollMemory()`

Automatically save and restore scroll position when revisiting routes.

```javascript
Router.enableScrollMemory() → Router
```

---

### `Router.setTitleResolver(titleFn)`

Register a function that generates `document.title` dynamically on every navigation.

```javascript
Router.setTitleResolver(titleFn: (route: RouteMatch) => string) → Router
```

```javascript
Router.setTitleResolver((route) => `${route._record.title || route.path} — My App`);
```

---

## Load order summary

```html
<!-- 1. Core — always first, always required -->
<script src="01_dh-router.js"></script>

<!-- 2. Optional modules — any order after core -->
<script src="02_dh-router-view.js"></script>
<script src="03_dh-router-link.js"></script>
<script src="04_dh-router-guards.js"></script>

<!-- 3. Your app code — always last -->
<script src="app.js"></script>
```

---

## Chaining

All methods that return `Router` can be chained:

```javascript
Router
  .define([...])
  .mount('#app')
  .setTransition('fade')
  .start({ mode: 'hash' });
```

```javascript
Router
  .requireAuth(isLoggedIn, '/login')
  .enableLogging()
  .enableScrollMemory()
  .define([...])
  .mount('#app')
  .start();
```

---

## Type reference

```typescript
interface RouteDefinition {
  path: string;
  view: string | ((params: object, query: URLSearchParams) => HTMLElement | string | Promise<HTMLElement | string>);
  title?: string;
  onEnter?: (params: object, query: URLSearchParams, onCleanup: (fn: () => void) => void) => void | Promise<void>;
  onLeave?: () => void | Promise<void>;
}

interface RouteMatch {
  path: string;
  params: Record<string, string>;
  query: URLSearchParams;
  title: string | null;
}

interface StartOptions {
  mode?: 'hash' | 'history';
  scrollToTop?: boolean;
  base?: string;
}

interface TransitionConfig {
  enterClass?: string;
  leaveClass?: string;
  duration?: number;
  css?: string;
}
```
