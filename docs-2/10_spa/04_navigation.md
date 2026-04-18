[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Navigation

The router gives you two ways to navigate: **programmatic** (from JavaScript code) and **declarative** (from HTML attributes). Both are covered here.

---

## Programmatic navigation

### `Router.go(path)`

Navigate to any path:

```javascript
Router.go('/about');
Router.go('/user/42');
Router.go('/search?q=hello');
```

Returns `Router` for chaining.

```javascript
// From a button click
document.getElementById('go-home').addEventListener('click', () => {
  Router.go('/');
});

// After a form submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await saveData();
  Router.go('/dashboard');
});

// After a timed redirect
setTimeout(() => Router.go('/home'), 3000);
```

### `Router.back()`

Go one step back in browser history — equivalent to clicking the browser's back button:

```javascript
Router.back();
```

```javascript
document.getElementById('back-btn').addEventListener('click', () => {
  Router.back();
});
```

### `Router.forward()`

Go one step forward in browser history:

```javascript
Router.forward();
```

Both `back()` and `forward()` use the native `history.back()` and `history.forward()`, so they respect the full browser history stack including pages visited before your app loaded.

---

## Declarative navigation

Load `03_dh-router-link.js` to enable declarative navigation via HTML attributes.

### `[data-route]`

Add `data-route` to **any element** to make it navigate on click:

```html
<a data-route="/">Home</a>
<button data-route="/about">About</button>
<li data-route="/settings">Settings</li>
<div data-route="/dashboard">Go to Dashboard</div>
```

- Works on `<a>`, `<button>`, `<li>`, `<div>` — any HTML element
- Prevents default `<a>` browser navigation automatically
- Ignores Ctrl+Click / Cmd+Click (allows open-in-new-tab)

### `[data-route-active-class]`

Add a CSS class to the element when its route is the current active path:

```html
<a data-route="/" data-route-active-class="active">Home</a>
<a data-route="/about" data-route-active-class="active">About</a>
```

When the user is on `/about`, the second link gets the `active` class added automatically.

### `[data-route-exact]`

By default, active matching is **prefix-based**: a link for `/blog` is active for `/blog`, `/blog/post-1`, `/blog/2024/my-post`, etc.

Add `data-route-exact` to require an **exact match**:

```html
<!-- Active only when path is exactly /blog -->
<a data-route="/blog" data-route-active-class="active" data-route-exact>Blog</a>

<!-- Active for /blog AND /blog/anything -->
<a data-route="/blog" data-route-active-class="active">Blog</a>
```

The `/` path is always treated as exact — it never prefix-matches everything.

### Full nav example

```html
<nav>
  <a data-route="/"        data-route-active-class="nav-active" data-route-exact>Home</a>
  <a data-route="/blog"    data-route-active-class="nav-active">Blog</a>
  <a data-route="/about"   data-route-active-class="nav-active">About</a>
  <a data-route="/contact" data-route-active-class="nav-active">Contact</a>
</nav>
```

```css
.nav-active {
  font-weight: bold;
  border-bottom: 2px solid currentColor;
}
```

---

## Programmatic link creation

`Router.createLink()` creates a `[data-route]` element from JavaScript:

```javascript
const link = Router.createLink(path, label, activeClass, tag);
```

| Argument | Type | Default | Description |
|---|---|---|---|
| `path` | string | — | The route path |
| `label` | string | — | Inner text content |
| `activeClass` | string | — | Active CSS class |
| `tag` | string | `'a'` | HTML element tag |

```javascript
// Create an <a> link
const homeLink = Router.createLink('/', 'Home', 'active');
nav.appendChild(homeLink);

// Create a <button>
const aboutBtn = Router.createLink('/about', 'About', 'is-active', 'button');
toolbar.appendChild(aboutBtn);
```

### Refreshing links after dynamic insertion

If you insert `[data-route]` elements into the DOM after the router has started, call `Router.refreshLinks()` to apply active states immediately:

```javascript
const link = Router.createLink('/new-page', 'New Page', 'active');
document.querySelector('nav').appendChild(link);
Router.refreshLinks();  // Apply active class if /new-page is current
```

---

## Reading the current route

### `Router.current()`

Returns a snapshot of the active route, or `null` before the first navigation:

```javascript
const route = Router.current();

// route is:
// {
//   path:   '/user/42',
//   params: { id: '42' },
//   query:  URLSearchParams { 'tab' => 'profile' },
//   title:  'User Profile'
// }
```

```javascript
// Practical usage
function showBreadcrumb() {
  const route = Router.current();
  if (!route) return;
  breadcrumb.textContent = route.path;
}

Router.on('change', showBreadcrumb);
```

---

## Navigation events

Subscribe to router events with `Router.on()`:

### `'change'`

Fires after every successful navigation:

```javascript
Router.on('change', ({ to, from }) => {
  console.log('Navigated from', from?.path ?? '(start)', 'to', to.path);
  analytics.track(to.path);
});
```

`from` is `null` on the initial page load.

### `'notfound'`

Fires when no route matched the current path (and no `*` catch-all is defined):

```javascript
Router.on('notfound', ({ path }) => {
  console.warn('No route matched:', path);
});
```

### `'error'`

Fires when an error occurs inside a lifecycle hook, view factory, or guard:

```javascript
Router.on('error', (err) => {
  console.error('Router error:', err);
  showErrorToast('Navigation failed');
});
```

### Unsubscribing

```javascript
function onChange(data) { /* ... */ }

Router.on('change', onChange);
// Later:
Router.off('change', onChange);
```

---

## Configuring the router at runtime

### `Router.configure(options)`

Change options after `start()` has been called:

```javascript
Router.configure({ scrollToTop: false });
Router.configure({ base: '/app' });
```

Available options:

| Option | Type | Default | Description |
|---|---|---|---|
| `mode` | `'hash'` \| `'history'` | `'hash'` | URL mode |
| `scrollToTop` | `boolean` | `true` | Scroll to (0,0) after each navigation |
| `base` | `string` | `''` | Base path prefix for history mode |

### Disabling scroll-to-top

By default the router scrolls to the top of the page after every navigation. Disable it globally:

```javascript
Router.start({ mode: 'hash', scrollToTop: false });
```

Or disable it at runtime:

```javascript
Router.configure({ scrollToTop: false });
```

---

## Navigation lock

The router prevents **overlapping navigations**. If a navigation is in progress (e.g. an async `onEnter` is running), any new `Router.go()` calls are silently ignored until the current navigation completes.

This protects you from race conditions when clicking links rapidly.

---

## History mode and the base option

In history mode, if your app lives at a sub-path (e.g. `/app/`), configure `base`:

```javascript
Router.start({ mode: 'history', base: '/app' });
```

Now internal URLs like `/home` are resolved as `/app/home` in the browser.

---

## Complete navigation example

```javascript
// Programmatic navigation after async operation
async function handleLogin(e) {
  e.preventDefault();

  try {
    await loginUser(getFormData(e.target));
    Router.go('/dashboard');
  } catch (err) {
    showError(err.message);
  }
}

// Conditional navigation
function checkOnboarding() {
  const user = getUser();
  if (!user.onboardingComplete) {
    Router.go('/onboarding');
  } else {
    Router.go('/dashboard');
  }
}

// Navigate and listen
Router.on('change', ({ to }) => {
  document.title = to.title || 'My App';
});

Router.go('/home');
```

---

## Key takeaways

1. **`Router.go(path)`** — navigate programmatically from any JS code
2. **`Router.back()` / `Router.forward()`** — browser history navigation
3. **`[data-route]`** — declarative navigation on any HTML element (requires module 3)
4. **`[data-route-active-class]`** — auto active state on nav links
5. **`Router.current()`** — snapshot of the active route
6. **`Router.on('change')`** — listen for navigation events
7. The router ignores concurrent navigations to prevent race conditions

---

## What's next?

- How to access route params and query strings inside `onEnter`
- View transitions and animations
- Navigation guards for auth protection
