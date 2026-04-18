[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Why DOM Helpers Exists

## The Starting Point

Building interfaces with plain JavaScript is entirely possible. The browser gives you everything you need: `document.getElementById`, `addEventListener`, `classList`, `style`, `localStorage`. These are stable, well-documented, and universally supported.

For a page with a few elements, plain JavaScript works well. You write a few lines, things work, you move on.

The problems begin when the page grows.

---

## What Happens as a Project Grows

Consider a real scenario: a web application with a login page, a dashboard, a settings panel, and a notification system. Each section has multiple elements. Each element needs to respond to user actions, data changes, and application state.

This is where certain patterns in plain JavaScript start creating friction.

---

## Problem 1 — Repeated DOM Queries

Every time you want to touch an element, you have to find it first. The browser has to search the DOM each time. If the ID changes, every reference breaks.

**Plain JavaScript:**

```javascript
// First interaction
document.getElementById('submitBtn').disabled = true;

// Later in a different function
document.getElementById('submitBtn').textContent = 'Saving...';

// Later still, in another function
document.getElementById('submitBtn').disabled = false;
document.getElementById('submitBtn').textContent = 'Save';
```

**DOM Helpers:**

```javascript
// Accessed once, cached automatically — same element every time
Elements.submitBtn.disabled = true;

// Later
Elements.submitBtn.textContent = 'Saving...';

// Later still
Elements.submitBtn.update({ disabled: false, textContent: 'Save' });
```

`Elements.submitBtn` looks up the element once and caches it. Every subsequent access returns the same reference instantly — no repeated DOM traversal.

---

## Problem 2 — Scattered Updates

When a user logs in, many things on the page need to change. In plain JavaScript, those updates are scattered across DOM queries, direct assignments, and storage calls — all in the same function.

**Plain JavaScript:**

```javascript
function onLoginSuccess(user) {
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userAvatar').src = user.avatar;
  document.getElementById('loginBtn').style.display = 'none';
  document.getElementById('logoutBtn').style.display = 'block';
  document.getElementById('welcomeMsg').textContent = 'Welcome, ' + user.name;
  document.getElementById('lastLogin').textContent = user.lastSeen;
  document.getElementById('accountStatus').textContent = 'Active';
  document.getElementById('accountStatus').className = 'status active';
  localStorage.setItem('currentUser', JSON.stringify(user));
  localStorage.setItem('loginTime', new Date().toISOString());
}
```

**DOM Helpers:**

```javascript
function onLoginSuccess(user) {
  // All DOM updates in one structured call
  Elements.update({
    userName:      { textContent: user.name },
    userAvatar:    { setAttribute: { src: user.avatar } },
    loginBtn:      { style: { display: 'none' } },
    logoutBtn:     { style: { display: 'block' } },
    welcomeMsg:    { textContent: 'Welcome, ' + user.name },
    lastLogin:     { textContent: user.lastSeen },
    accountStatus: { textContent: 'Active', className: 'status active' }
  });

  // Storage handled cleanly — no JSON.stringify, no manual keys
  StorageUtils.save('currentUser', user);
  StorageUtils.save('loginTime', new Date().toISOString());
}
```

All DOM updates are grouped in one call. The structure makes it clear exactly what changes on login. Storage is one line per value — no serialization boilerplate.

---

## Problem 3 — Mixed Responsibilities

Plain JavaScript does not enforce any structure. Logic, DOM manipulation, API calls, and storage writes end up tangled in the same function.

**Plain JavaScript:**

```javascript
function handleFormSubmit(event) {
  event.preventDefault();

  const email    = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;

  if (!email || !password) {
    document.getElementById('errorMsg').textContent = 'Please fill in all fields';
    document.getElementById('errorMsg').style.display = 'block';
    return;
  }

  document.getElementById('submitBtn').disabled = true;
  document.getElementById('submitBtn').textContent = 'Signing in...';
  document.getElementById('spinner').style.display = 'block';

  fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    .then(res => res.json())
    .then(data => {
      document.getElementById('submitBtn').disabled = false;
      document.getElementById('submitBtn').textContent = 'Sign In';
      document.getElementById('spinner').style.display = 'none';
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/dashboard';
    });
}
```

**DOM Helpers:**

```javascript
// Declare what the DOM looks like for each state — once, outside the handler
const formStatus = state({ value: 'idle' });

Conditions.whenState(() => formStatus.value, {
  'idle': {
    '#submitBtn': { disabled: false, textContent: 'Sign In' },
    '#spinner':   { style: { display: 'none' } },
    '#errorMsg':  { style: { display: 'none' } }
  },
  'loading': {
    '#submitBtn': { disabled: true, textContent: 'Signing in...' },
    '#spinner':   { style: { display: 'block' } },
    '#errorMsg':  { style: { display: 'none' } }
  },
  'error': {
    '#submitBtn': { disabled: false, textContent: 'Sign In' },
    '#spinner':   { style: { display: 'none' } }
  }
});

// The handler only manages logic and state — DOM changes happen automatically
Id('loginForm').update({
  addEventListener: {
    submit: async (e) => {
      e.preventDefault();

      if (!Elements.emailInput.value || !Elements.passwordInput.value) {
        Elements.errorMsg.update({ textContent: 'Please fill in all fields', style: { display: 'block' } });
        formStatus.value = 'error';
        return;
      }

      formStatus.value = 'loading';  // DOM updates automatically

      const data = await AsyncHelpers.fetchJSON('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email: Elements.emailInput.value, password: Elements.passwordInput.value })
      });

      StorageUtils.save('token', data.token);
      StorageUtils.save('user', data.user);
      Router.go('/dashboard');
    }
  }
});
```

The handler is now focused on logic only. DOM state transitions (loading spinner, disabled button) are declared once in `Conditions.whenState()` and applied automatically when `formStatus.value` changes.

---

## Problem 4 — No Shared Language for Updates

In plain JavaScript, every type of update has a different syntax. Text content, styles, attributes, classes, and event listeners each follow a different pattern.

**Plain JavaScript:**

```javascript
// Direct assignment
element.textContent = 'Hello';
element.className = 'active';
element.disabled = true;

// Method calls
element.setAttribute('aria-label', 'Close');
element.classList.add('visible');
element.classList.remove('hidden');

// Style object
element.style.backgroundColor = '#333';
element.style.display = 'flex';

// Event listener — completely different pattern
element.addEventListener('click', handler);
```

**DOM Helpers:**

```javascript
// One consistent pattern for everything
element.update({
  textContent:    'Hello',
  className:      'active',
  disabled:       true,
  setAttribute:   { 'aria-label': 'Close' },
  classList:      { add: 'visible', remove: 'hidden' },
  style:          { backgroundColor: '#333', display: 'flex' },
  addEventListener: { click: handler }
});
```

One pattern. One method. Any combination of changes in a single call.

---

## Problem 5 — No Reuse of Found Elements

`document.getElementById` returns a plain DOM element with no built-in helpers, no caching, and no structured way to apply multiple changes at once.

**Plain JavaScript:**

```javascript
// Have to find the element again for every operation
const btn = document.getElementById('submitBtn');
btn.disabled = true;
btn.textContent = 'Saving...';
btn.style.opacity = '0.6';
btn.setAttribute('aria-busy', 'true');
// btn.addEventListener has to be wired separately
```

**DOM Helpers:**

```javascript
// Element comes pre-equipped with .update() and all DOM Helpers methods
Elements.submitBtn.update({
  disabled:     true,
  textContent:  'Saving...',
  style:        { opacity: '0.6' },
  setAttribute: { 'aria-busy': 'true' },
  addEventListener: { click: handler }
});
```

Or with the native-enhance module, your existing `document.getElementById` calls automatically return enhanced elements — no migration needed:

```javascript
// Your existing code — unchanged
const btn = document.getElementById('submitBtn');

// But now .update() is available
btn.update({ disabled: true, textContent: 'Saving...', style: { opacity: '0.6' } });
```

---

## Problem 6 — No Structure for Forms

Reading form values, validating fields, and submitting data in plain JavaScript requires manual wiring for every input.

**Plain JavaScript:**

```javascript
const form = document.getElementById('loginForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Read each field manually
  const email    = document.getElementById('emailInput').value.trim();
  const password = document.getElementById('passwordInput').value;

  // Validate manually
  const errors = {};
  if (!email)    errors.email    = 'Email is required';
  if (!password) errors.password = 'Password is required';

  if (Object.keys(errors).length > 0) {
    document.getElementById('emailError').textContent    = errors.email    || '';
    document.getElementById('passwordError').textContent = errors.password || '';
    return;
  }

  // Submit manually
  try {
    const res  = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }), headers: { 'Content-Type': 'application/json' } });
    const data = await res.json();
    window.location.href = '/dashboard';
  } catch (err) {
    document.getElementById('formError').textContent = err.message;
  }
});
```

**DOM Helpers:**

```javascript
// Read all values at once
const data = Forms.loginForm.values;
// → { email: 'user@example.com', password: 'secret' }

// Validate in one call
const { isValid, errors } = Forms.loginForm.validate();

// Submit with built-in success/error handling
await Forms.loginForm.submitData({
  url:       '/api/login',
  onSuccess: () => Router.go('/dashboard'),
  onError:   (err) => Elements.formError.update({ textContent: err.message })
});
```

---

## Problem 7 — No Structure for Animations

Animating elements in plain JavaScript requires managing timers, CSS class toggling, and `transitionend` events manually.

**Plain JavaScript:**

```javascript
// Fade in
notification.style.opacity = '0';
notification.style.display = 'block';
notification.style.transition = 'opacity 200ms';
requestAnimationFrame(() => {
  notification.style.opacity = '1';
});

// Wait 3 seconds, then fade out
setTimeout(() => {
  notification.style.transition = 'opacity 300ms';
  notification.style.opacity = '0';
  notification.addEventListener('transitionend', () => {
    notification.style.display = 'none';
  }, { once: true });
}, 3000);
```

**DOM Helpers:**

```javascript
// Fully awaitable — no timers, no transitionend
await Elements.notification
  .animate()
  .fadeIn({ duration: 200 })
  .delay(3000)
  .fadeOut({ duration: 300 })
  .play();

Elements.notification.update({ style: { display: 'none' } });
```

---

## Problem 8 — No Structure for Routing

Building a multi-page experience in plain JavaScript means managing `history.pushState`, `popstate` listeners, manual template rendering, and scroll state by hand.

**Plain JavaScript:**

```javascript
// Manual routing setup
window.addEventListener('popstate', handleRoute);

function handleRoute() {
  const path = window.location.hash.replace('#', '') || '/';

  document.getElementById('app').innerHTML = '';

  if (path === '/') {
    document.getElementById('app').appendChild(document.getElementById('home-template').content.cloneNode(true));
    document.title = 'Home';
  } else if (path === '/about') {
    document.getElementById('app').appendChild(document.getElementById('about-template').content.cloneNode(true));
    document.title = 'About';
  } else {
    document.getElementById('app').appendChild(document.getElementById('404-template').content.cloneNode(true));
    document.title = 'Not Found';
  }
}

function navigate(path) {
  window.location.hash = path;
}

handleRoute(); // Run on load
```

**DOM Helpers:**

```javascript
Router
  .define([
    { path: '/',      view: '#home-template',  title: 'Home' },
    { path: '/about', view: '#about-template', title: 'About' },
    { path: '*',      view: '#404-template',   title: 'Not Found' }
  ])
  .mount('#app')
  .setTransition('fade')
  .start({ mode: 'hash' });

// Auth protection in one line
Router.requireAuth(() => !!localStorage.getItem('token'), '/login');
```

---

## What DOM Helpers Addresses

DOM Helpers does not replace how the browser works. It does not introduce a virtual DOM, a compilation step, or a framework runtime. It works directly with the same DOM APIs you already know.

What it does is provide **a consistent structure** for the things that every DOM-heavy application eventually needs to manage:

- **Finding elements** — with caching so the same element is not searched for repeatedly
- **Updating elements** — with a single unified syntax that works for text, styles, attributes, classes, events, and more
- **Managing groups of elements** — with helpers for working with collections instead of one element at a time
- **Reactive state** — objects that automatically propagate changes through effects, computed values, and the DOM
- **State-driven DOM rendering** — declarative mappings from state values to DOM configurations
- **Browser storage** — persistence with a clean interface that handles serialization and cross-tab sync
- **Form handling** — reading, validating, and submitting forms without boilerplate
- **Animations** — awaitable, composable animations directly on elements
- **Async utilities** — debounce, throttle, fetch with timeout and retry, and async event handler wrappers
- **Client-side routing** — a full SPA router with history, transitions, and navigation guards

These responsibilities are separated into ten modules. Each module has a clear, limited purpose. They can be used independently or together.

---

## What's Next

The next section explains how those ten modules are organized and what each one is responsible for.

- **[Architecture Overview](./03_architecture-overview.md)** — the ten modules and how they divide responsibility
