[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Real-World Examples

These examples show the SPA Router working in realistic scenarios combining all four modules.

---

## Example 1: Portfolio site

A simple personal site with Home, Projects, and Contact pages. Hash mode, fade transitions, active nav links.

### HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>My Portfolio</title>
  <style>
    nav a { margin-right: 1rem; text-decoration: none; color: #555; }
    nav a.active { color: #0070f3; font-weight: 600; }
    #page { padding: 2rem; min-height: 60vh; }
  </style>
</head>
<body>
  <nav>
    <a data-route="/"         data-route-active-class="active" data-route-exact>Home</a>
    <a data-route="/projects" data-route-active-class="active">Projects</a>
    <a data-route="/contact"  data-route-active-class="active">Contact</a>
  </nav>

  <main id="page"></main>

  <template id="home">
    <h1>Hi, I'm Jane</h1>
    <p>I build things for the web.</p>
    <a data-route="/projects">See my work →</a>
  </template>

  <template id="projects">
    <h1>Projects</h1>
    <ul>
      <li>Project Alpha</li>
      <li>Project Beta</li>
      <li>Project Gamma</li>
    </ul>
  </template>

  <template id="contact">
    <h1>Contact</h1>
    <p>Email me at <a href="mailto:jane@example.com">jane@example.com</a></p>
  </template>

  <template id="404">
    <h1>Page Not Found</h1>
    <p><a data-route="/">Go Home</a></p>
  </template>

  <script src="01_dh-router.js"></script>
  <script src="02_dh-router-view.js"></script>
  <script src="03_dh-router-link.js"></script>
  <script>
    Router
      .define([
        { path: '/',         view: '#home',     title: 'Jane — Home' },
        { path: '/projects', view: '#projects', title: 'Jane — Projects' },
        { path: '/contact',  view: '#contact',  title: 'Jane — Contact' },
        { path: '*',         view: '#404',      title: 'Not Found' },
      ])
      .mount('#page')
      .setTransition('fade')
      .start({ mode: 'hash' });
  </script>
</body>
</html>
```

---

## Example 2: Protected dashboard app

A login → dashboard flow with auth protection, guest redirect, and scroll memory.

### JavaScript

```javascript
// Auth helpers
function isAuthenticated() {
  return !!localStorage.getItem('auth_token');
}

function login(token) {
  localStorage.setItem('auth_token', token);
}

function logout() {
  localStorage.removeItem('auth_token');
  Router.go('/login');
}

// ── Guards ──────────────────────────────────────────────────────────
// Protect /dashboard and /profile from unauthenticated access
Router.requireAuth(isAuthenticated, '/login', ['/dashboard', '/profile']);

// Redirect logged-in users away from /login
Router.requireGuest(isAuthenticated, '/dashboard', '/login');

// Enable scroll memory and navigation logging in dev
Router.enableScrollMemory();
Router.enableLogging();

// Dynamic titles
Router.setTitleResolver((route) => {
  const titles = {
    '/login':     'Login',
    '/dashboard': 'Dashboard',
    '/profile':   'My Profile',
  };
  return (titles[route.path] || 'App') + ' — My App';
});

// ── Routes ──────────────────────────────────────────────────────────
Router.define([
  {
    path: '/login',
    view: '#login-template',
    onEnter: () => {
      document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = await fakeLogin(e.target.password.value);
        login(token);
        Router.go('/dashboard');
      });
    }
  },
  {
    path: '/dashboard',
    view: '#dashboard-template',
    onEnter: async (params, query, onCleanup) => {
      const stats = await fetchStats();
      renderStats(stats);

      // Live updates every 30s — cleaned up automatically on leave
      const interval = setInterval(async () => {
        const updated = await fetchStats();
        renderStats(updated);
      }, 30000);

      onCleanup(() => clearInterval(interval));
    }
  },
  {
    path: '/profile',
    view: '#profile-template',
    onEnter: async () => {
      const user = await fetchUser();
      document.getElementById('username').textContent = user.name;
    }
  },
  {
    path: '*',
    view: '#404-template'
  }
]);

Router.mount('#app').setTransition('fade').start({ mode: 'hash' });
```

---

## Example 3: Blog with dynamic post loading

Posts are loaded from an API based on the URL slug. The view factory handles async data.

### JavaScript

```javascript
async function fetchPost(slug) {
  const res = await fetch(`/api/posts/${slug}`);
  if (!res.ok) throw new Error('Post not found');
  return res.json();
}

async function fetchPosts(page = 1) {
  const res = await fetch(`/api/posts?page=${page}`);
  return res.json();
}

Router.on('error', ({ message }) => {
  console.error('Router error:', message);
});

Router.define([
  {
    // Home — paginated post list
    path: '/',
    view: '#home-template',
    onEnter: async (params, query) => {
      const page = Number(query.get('page') || '1');
      const { posts, total, perPage } = await fetchPosts(page);

      const list = document.getElementById('post-list');
      list.innerHTML = posts
        .map(p => `<li><a data-route="/post/${p.slug}">${p.title}</a></li>`)
        .join('');

      // Refresh links so dynamic [data-route] elements get click handlers
      Router.refreshLinks();

      renderPagination(total, perPage, page);
    }
  },
  {
    // Individual post
    path: '/post/:slug',
    view: async (params) => {
      try {
        const post = await fetchPost(params.slug);
        return `
          <article>
            <h1>${post.title}</h1>
            <time>${post.date}</time>
            <div class="content">${post.html}</div>
            <a data-route="/">← Back to Blog</a>
          </article>
        `;
      } catch {
        return `
          <div class="error">
            <h1>Post Not Found</h1>
            <a data-route="/">← Back to Blog</a>
          </div>
        `;
      }
    },
    onEnter: (params) => {
      // Update title after content loads
      document.title = document.querySelector('h1')?.textContent + ' — My Blog';
      Router.refreshLinks();  // For the back link inserted by factory
    }
  },
  {
    path: '*',
    view: '#404-template',
    title: 'Not Found'
  }
]);

Router.mount('#app').setTransition('slide-left').start({ mode: 'hash' });
```

---

## Example 4: Tabbed settings page

A settings page where each tab is a sub-route with its own URL, so the user can share or bookmark a specific tab.

### HTML

```html
<template id="settings-template">
  <div class="settings">
    <nav class="tabs">
      <button data-route="/settings/account"       data-route-active-class="active">Account</button>
      <button data-route="/settings/notifications"  data-route-active-class="active">Notifications</button>
      <button data-route="/settings/security"       data-route-active-class="active">Security</button>
    </nav>
    <div id="settings-content"></div>
  </div>
</template>
```

### JavaScript

```javascript
Router.define([
  // Redirect /settings to /settings/account
  {
    path: '/settings',
    view: '#settings-template',
    onEnter: () => Router.go('/settings/account')
  },
  {
    path: '/settings/account',
    view: '#settings-template',
    onEnter: async () => {
      const user = await fetchUser();
      document.getElementById('settings-content').innerHTML = `
        <h2>Account</h2>
        <p>Name: ${user.name}</p>
        <p>Email: ${user.email}</p>
      `;
    }
  },
  {
    path: '/settings/notifications',
    view: '#settings-template',
    onEnter: async () => {
      const prefs = await fetchNotificationPrefs();
      document.getElementById('settings-content').innerHTML = `
        <h2>Notifications</h2>
        <label>
          <input type="checkbox" ${prefs.email ? 'checked' : ''}> Email notifications
        </label>
      `;
    }
  },
  {
    path: '/settings/security',
    view: '#settings-template',
    onEnter: () => {
      document.getElementById('settings-content').innerHTML = `
        <h2>Security</h2>
        <button id="change-password">Change Password</button>
      `;
    }
  },
]);
```

---

## Example 5: SPA with cleanup and reactive state

Combining the router with `ReactiveUtils` (when the full DOM Helpers bundle is loaded):

```javascript
const state = ReactiveUtils.state({
  user: null,
  notifications: 0
});

Router.define([
  {
    path: '/dashboard',
    view: '#dashboard-template',
    onEnter: async (params, query, onCleanup) => {
      // Load initial data
      state.user = await fetchUser();
      state.notifications = await fetchNotificationCount();

      // Keep notification count live
      const poll = setInterval(async () => {
        state.notifications = await fetchNotificationCount();
      }, 10000);

      onCleanup(() => {
        clearInterval(poll);
        // Reset state on leave
        state.user = null;
        state.notifications = 0;
      });
    }
  }
]);

// Reactive UI updates
ReactiveUtils.effect(() => {
  const badge = document.getElementById('notification-badge');
  if (badge) badge.textContent = state.notifications;
});
```

---

## Example 6: Analytics tracking

Track every navigation with a simple `afterEach`:

```javascript
Router.afterEach((to, from) => {
  // Skip initial load tracking if desired
  if (!from) return;

  // Google Analytics 4
  gtag('event', 'page_view', {
    page_path: to.path,
    page_title: document.title,
  });

  // Or a custom tracker
  analytics.track('Page Viewed', {
    path: to.path,
    params: to.params,
    from: from?.path,
  });
});
```

---

## Key patterns

| Pattern | Code |
|---|---|
| Auth protection | `Router.requireAuth(fn, '/login')` |
| Guest redirect | `Router.requireGuest(fn, '/dashboard', '/login')` |
| Live data with cleanup | `onEnter: (p, q, onCleanup) => { const t = setInterval(...); onCleanup(() => clearInterval(t)); }` |
| Dynamic view from API | `view: async (params) => { const data = await fetch(...); return \`<div>${data}</div>\`; }` |
| Paginated routes | `Router.go('/posts?page=3')` + `query.get('page')` in `onEnter` |
| Analytics | `Router.afterEach((to) => analytics.page(to.path))` |
| Refresh dynamic links | `onEnter: () => { buildLinks(); Router.refreshLinks(); }` |
| Sub-route tabs | Define `/settings/account`, `/settings/notifications` as separate routes |
