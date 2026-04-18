[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Router Links

The Router Link module (`03_dh-router-link.js`) lets you add navigation to any HTML element using a `data-route` attribute, and automatically manages active CSS classes as the route changes.

---

## Setup

Load after the router core:

```html
<script src="01_dh-router.js"></script>
<script src="03_dh-router-link.js"></script>
```

No additional configuration is needed. The module attaches a delegated click listener to `document` automatically.

---

## Basic usage

Add `data-route` to any element to make it navigate on click:

```html
<a data-route="/">Home</a>
<a data-route="/about">About</a>
<a data-route="/contact">Contact</a>
```

The module intercepts clicks and calls `Router.go()` with the path. Default `<a>` navigation (full page reload) is prevented automatically.

---

## Active state — `[data-route-active-class]`

Add `data-route-active-class` to specify a CSS class that gets added when the link's route is active:

```html
<a data-route="/"      data-route-active-class="active">Home</a>
<a data-route="/about" data-route-active-class="active">About</a>
```

When on `/about`:
- The `/about` link gets `class="active"` added
- The `/` link has `active` removed
- `aria-current="page"` is set on the active link automatically

Active states are updated on every navigation — you never manage them manually.

---

## Exact matching — `[data-route-exact]`

By default, active matching is **prefix-based**:

- A link with `data-route="/blog"` is active for `/blog`, `/blog/post-1`, `/blog/category/news`, etc.
- This is the correct behavior for section-level nav items.

Add `data-route-exact` to require the path to match **exactly**:

```html
<!-- Active only when path === '/blog' -->
<a data-route="/blog" data-route-active-class="active" data-route-exact>Blog</a>

<!-- Active for /blog AND /blog/* -->
<a data-route="/blog" data-route-active-class="active">Blog</a>
```

The `/` path is **always treated as exact** — it never prefix-matches all routes.

---

## Works on any element

You're not limited to `<a>` tags. `data-route` works on any HTML element:

```html
<!-- Button -->
<button data-route="/settings" data-route-active-class="is-active">
  Settings
</button>

<!-- List item -->
<li data-route="/profile" data-route-active-class="selected">
  My Profile
</li>

<!-- Div -->
<div data-route="/dashboard" data-route-active-class="current">
  Dashboard
</div>

<!-- Nested content — click bubbles up correctly -->
<a data-route="/features" data-route-active-class="active">
  <span class="icon">★</span>
  <span class="label">Features</span>
</a>
```

Clicks on child elements (like the `<span>` inside an `<a>`) bubble up and are correctly handled.

---

## Sidebar navigation example

```html
<nav class="sidebar">
  <a data-route="/"          data-route-active-class="nav-active" data-route-exact>
    Home
  </a>
  <a data-route="/dashboard" data-route-active-class="nav-active">
    Dashboard
  </a>
  <a data-route="/users"     data-route-active-class="nav-active">
    Users
  </a>
  <a data-route="/settings"  data-route-active-class="nav-active">
    Settings
  </a>
</nav>
```

```css
.nav-active {
  color: var(--accent);
  font-weight: 600;
  background: var(--active-bg);
}
```

---

## Tab navigation example

```html
<div class="tabs">
  <button data-route="/overview"  data-route-active-class="tab-active">Overview</button>
  <button data-route="/activity"  data-route-active-class="tab-active">Activity</button>
  <button data-route="/settings"  data-route-active-class="tab-active">Settings</button>
</div>
```

```css
.tab-active {
  border-bottom: 2px solid blue;
}
```

---

## Breadcrumb with partial active states

Since prefix matching is the default, you can build breadcrumbs where each level highlights:

```html
<!-- URL: /docs/guides/getting-started -->

<nav aria-label="breadcrumb">
  <a data-route="/docs"                 data-route-active-class="active">Docs</a>
  /
  <a data-route="/docs/guides"          data-route-active-class="active">Guides</a>
  /
  <a data-route="/docs/guides/getting-started" data-route-active-class="active" data-route-exact>
    Getting Started
  </a>
</nav>
```

All three links would be "active" on that URL — the first two via prefix match, the last via exact match.

---

## Programmatic link creation — `Router.createLink()`

Create `[data-route]` elements from JavaScript:

```javascript
const link = Router.createLink(path, label, activeClass, tag);
```

```javascript
// <a data-route="/home" data-route-active-class="active">Home</a>
const homeLink = Router.createLink('/home', 'Home', 'active');

// <button data-route="/about" data-route-active-class="is-active">About</button>
const aboutBtn = Router.createLink('/about', 'About', 'is-active', 'button');

// Append to nav
document.querySelector('nav').appendChild(homeLink);
```

### Dynamic nav generation

```javascript
const navItems = [
  { path: '/',        label: 'Home' },
  { path: '/blog',    label: 'Blog' },
  { path: '/contact', label: 'Contact' },
];

const nav = document.querySelector('nav');

navItems.forEach(({ path, label }) => {
  const link = Router.createLink(path, label, 'active');
  nav.appendChild(link);
});
```

---

## Refreshing links after dynamic insertion

If you insert `[data-route]` elements into the DOM **after** the router has started (e.g. inside an `onEnter` hook), call `Router.refreshLinks()` to immediately apply the correct active state:

```javascript
{
  path: '/dashboard',
  view: '#dashboard-template',
  onEnter: () => {
    // Add a dynamic link inside the mounted view
    const link = Router.createLink('/dashboard/reports', 'Reports', 'active');
    document.querySelector('.sub-nav').appendChild(link);

    // Apply active state immediately
    Router.refreshLinks();
  }
}
```

---

## Keyboard and modifier key behaviour

The click handler automatically ignores **modified clicks**:

| Key held | Behaviour |
|---|---|
| Ctrl+Click | Ignored — browser opens in new tab |
| Cmd+Click (Mac) | Ignored — browser opens in new tab |
| Shift+Click | Ignored — browser may open in new window |
| Alt+Click | Ignored — browser may download the link |

Only plain clicks trigger `Router.go()`.

---

## Accessibility

When a link is active, the module sets `aria-current="page"` on the element automatically. This is the correct ARIA attribute for indicating the current page in a navigation list and is read by screen readers.

```html
<!-- After navigating to /about -->
<a data-route="/about" data-route-active-class="active" aria-current="page" class="active">
  About
</a>
```

When the link becomes inactive, `aria-current` is removed.

---

## Key takeaways

1. **`data-route="/path"`** — makes any element navigate on click
2. **`data-route-active-class="class"`** — auto-adds a CSS class when the route is active
3. **`data-route-exact`** — require exact path match for active state (default is prefix)
4. **Works on any element** — `<a>`, `<button>`, `<li>`, `<div>`, etc.
5. **`Router.createLink(path, label, class, tag)`** — create link elements from JS
6. **`Router.refreshLinks()`** — re-apply active states after dynamic DOM insertion
7. **`aria-current="page"`** is set automatically on the active link

---

## What's next?

- Navigation guards for authentication and route protection
- Real-world examples combining all four modules
- Full API reference
