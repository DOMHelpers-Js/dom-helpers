[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# How Modules Work Together

## Each Module Has a Role in a Larger Flow

The previous sections introduced each module individually. In a real application, you will use them together. This section shows how the modules connect, what data flows between them, and what a complete interaction looks like when multiple modules all play their parts.

---

## The Data Flow

When a user interacts with a page, a chain of events unfolds. Here is how each module participates:

**The user does something** — clicks a button, submits a form, selects an option. This produces an event.

**The event handler reads or changes application state.** This might be a reactive state object, a plain variable, or a value being saved to storage. The logic layer (conditions or your own code) decides what the new state is.

**Conditions maps the state to DOM changes.** If you have defined state mappings with `Conditions.whenState()`, the conditions module detects the state change and automatically computes what the DOM should look like.

**The core applies those changes to the DOM.** Elements, Collections, and Selector do the actual work of finding elements and setting properties on them. The `.update()` method handles the details.

**Storage persists what needs to be persisted.** If the new state or user preference should survive a page reload, StorageUtils writes it to localStorage or sessionStorage.

**On the next page load, storage feeds the initial state.** StorageUtils reads the saved values. The conditions module or your initialization code applies them to the DOM before the user sees anything.

**Animation handles transitions.** When elements need to appear, disappear, or move with visual feedback, the animation module adds awaitable `fadeIn`, `fadeOut`, `slideUp`, and `slideDown` methods directly to elements.

**AsyncHelpers handles debounce, throttle, and fetch.** When user input triggers API calls, or you need retry logic and timeouts, AsyncHelpers provides those patterns without writing them by hand.

**The SPA Router handles navigation.** When the application spans multiple views, the Router intercepts navigation, mounts templates, runs lifecycle hooks, and applies transitions — without a page reload.

This flow can be described simply:

User action → Router intercepts navigation (if SPA) → state changes → conditions evaluate → core updates DOM → storage persists → animation plays

No single module handles all of this. Each one contributes its part.

---

## A Complete Example: Theme Toggle

This example shows all four modules working together. The page has a light/dark theme switch. The chosen theme should persist across page reloads and be reflected in the DOM immediately.

### The HTML

```html
<body id="body" class="theme-light">
  <header id="header">
    <button id="themeToggle">Switch to Dark Mode</button>
  </header>
  <main id="mainContent">
    <h1 id="pageTitle">Welcome</h1>
    <p id="pageSubtitle">Choose your preferred theme</p>
  </main>
</body>
```

### Step 1 — Initialize from storage (Storage → Core)

When the page loads, read the saved theme from storage and apply it to the DOM before the user sees anything.

```javascript
// Read saved theme — default to 'light' if nothing saved
const savedTheme = StorageUtils.load('theme', 'light');

// Apply it to the DOM using the core
Elements.update({
  body:         { className: 'theme-' + savedTheme },
  themeToggle:  { textContent: savedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode' }
});
```

At this point, the page renders in the correct theme without any flash of the wrong theme.

### Step 2 — Create reactive state (Conditions layer)

Define a reactive state object to track the current theme, and connect it to the DOM using Conditions.

```javascript
// Create a reactive state value
const theme = state({ value: savedTheme });

// Define what the DOM should look like for each theme state
Conditions.whenState(
  () => theme.value,
  {
    'light': {
      '#body':         { className: 'theme-light' },
      '#themeToggle':  { textContent: 'Switch to Dark Mode' },
      '#header':       { style: { backgroundColor: '#ffffff', color: '#111111' } },
      '#mainContent':  { style: { backgroundColor: '#f5f5f5' } }
    },
    'dark': {
      '#body':         { className: 'theme-dark' },
      '#themeToggle':  { textContent: 'Switch to Light Mode' },
      '#header':       { style: { backgroundColor: '#1a1a2e', color: '#ffffff' } },
      '#mainContent':  { style: { backgroundColor: '#16213e' } }
    }
  }
);
```

Now the DOM is fully described for each state. Conditions will apply the right configuration automatically whenever `theme.value` changes.

### Step 3 — Handle the toggle (Enhancer → State → Storage)

Connect the button to the state change and storage write.

```javascript
// Use the Id shortcut to access the button
Id('themeToggle').update({
  addEventListener: {
    click: () => {
      // Toggle the state
      theme.value = theme.value === 'light' ? 'dark' : 'light';

      // Persist the choice — StorageUtils handles serialization
      StorageUtils.save('theme', theme.value);
    }
  }
});
```

When the button is clicked:
1. `theme.value` changes
2. Conditions detects the change and applies the matching DOM configuration
3. StorageUtils saves the new theme to localStorage
4. On the next page load, Step 1 reads the saved value and initializes correctly

### What Each Module Did

- **Core** — applied DOM changes via `Elements.update()` during initialization and handled all element access
- **Enhancers** — `Id()` shortcut made the button access concise; `Elements.update()` applied the initial state cleanly
- **Conditions** — mapped each theme state to a complete DOM configuration; no manual `if`/`else` in the update logic
- **Storage** — persisted the chosen theme; loaded it on startup so the page initializes in the right state

---

## A Complete Example: Form Submission

This example shows a login form that transitions through multiple states: idle, loading, success, and error.

### The HTML

```html
<form id="loginForm">
  <input type="email" id="emailInput" placeholder="Email">
  <input type="password" id="passwordInput" placeholder="Password">
  <p id="errorMsg" style="display: none;"></p>
  <button type="submit" id="submitBtn">Sign In</button>
</form>
```

### Conditions for each form state

```javascript
const formStatus = state({ value: 'idle' });

Conditions.whenState(
  () => formStatus.value,
  {
    'idle': {
      '#submitBtn':      { textContent: 'Sign In', disabled: false },
      '#errorMsg':       { style: { display: 'none' } },
      '#emailInput':     { disabled: false },
      '#passwordInput':  { disabled: false }
    },
    'loading': {
      '#submitBtn':      { textContent: 'Signing in...', disabled: true },
      '#errorMsg':       { style: { display: 'none' } },
      '#emailInput':     { disabled: true },
      '#passwordInput':  { disabled: true }
    },
    'error': {
      '#submitBtn':      { textContent: 'Try Again', disabled: false },
      '#emailInput':     { disabled: false },
      '#passwordInput':  { disabled: false }
    }
  }
);
```

### The submit handler

```javascript
Id('loginForm').update({
  addEventListener: {
    submit: async (e) => {
      e.preventDefault();

      // Transition to loading — Conditions applies DOM changes automatically
      formStatus.value = 'loading';

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          body: JSON.stringify({
            email: Elements.emailInput.value,
            password: Elements.passwordInput.value
          })
        });

        const data = await response.json();

        if (data.success) {
          // Save session token — StorageUtils handles the serialization
          StorageUtils.save('sessionToken', data.token);
          StorageUtils.save('user', data.user);

          // Navigate — or update the page
          window.location.href = '/dashboard';
        } else {
          // Show the error message — then transition to error state
          Elements.errorMsg.update({
            textContent: data.message,
            style: { display: 'block', color: 'red' }
          });
          formStatus.value = 'error';
        }
      } catch {
        Elements.errorMsg.update({
          textContent: 'Connection failed. Please try again.',
          style: { display: 'block', color: 'red' }
        });
        formStatus.value = 'error';
      }
    }
  }
});
```

The DOM transitions (disabling inputs, changing button text, showing errors) are driven by state changes. You do not write DOM code inside the event handler — you change state, and Conditions applies the matching configuration. The event handler stays focused on the logic: validate, request, respond.

---

## How Enhancers Fit In

The enhancers module sits between the core and your code. It does not add new behavior — it makes accessing and updating elements shorter.

In the examples above, `Id('loginForm')` is an enhancer. So is `Id('themeToggle')`. They are convenience wrappers around `Elements.loginForm` and `Elements.themeToggle`. The core is still doing the work; the enhancer just makes the call shorter and more expressive.

Enhancers are most valuable when:

- You access an element once and move on — `Id('btn').update({...})` is shorter than finding the element first
- You need negative index access on a collection — `ClassName.items[-1]`
- You need to update the same property across many elements — `Elements.textContent({...})`
- You need to update many elements with different properties in one call — `Elements.update({...})`

They are not required. Everything an enhancer does can be done with the core alone. But used consistently, they reduce the surface area of your code and make the intent clearer.

---

## How Storage Integrates Without Coupling

Notice that in both examples, storage and the DOM never communicate directly. StorageUtils does not write to the DOM. The DOM never reads from localStorage. They are connected through application state:

```
StorageUtils.load()  →  sets initial state  →  Conditions applies to DOM
User action          →  changes state        →  Conditions applies to DOM
                                             →  StorageUtils saves the new state
```

This separation is important. If storage and the DOM were directly coupled, every storage operation would need to know about the DOM structure, and every DOM change would need to know about storage keys. As the application grows, that coupling becomes a source of bugs and makes the code hard to change.

By keeping storage and DOM updates in separate layers connected only through state, each layer stays focused on its responsibility.

---

## Summary of How Modules Work Together

The ten modules are designed to complement each other without overlapping:

- **Core** reads and writes the DOM. It is the only module that touches HTML elements directly.
- **Enhancers** make accessing and updating elements faster to write. They are optional convenience tools on top of the core.
- **Native Enhance** upgrades native `document.getElementById` / `querySelector` calls so they return enhanced elements automatically.
- **Reactive** manages state that automatically propagates changes through effects, computed values, and the DOM.
- **Conditions** maps state values to DOM configurations. It drives DOM updates by reacting to state, not by being called manually.
- **Storage** persists data and loads it on startup. It feeds initial state into the system and saves state changes as they happen.
- **DOM Form** reads form values, validates fields, and submits data — no manual wiring of each input.
- **Animation** adds awaitable, composable animations to elements and collections returned by the core.
- **Async** provides debounce, throttle, fetch with retry, sleep, and async event handler wrappers.
- **SPA Router** handles client-side navigation, view mounting, transitions, and navigation guards.

Together, they give you a structure where each concern has a home. UI logic goes in conditions. DOM access goes through the core or enhancers. Persistence goes through storage. Forms go through DOM Form. Animations go through the animation module. Navigation goes through the Router. The event handlers in your code stay focused on what they should be focused on: responding to user intent and managing state.

---

## What's Next

The next section shows a direct comparison between solving a common problem in plain JavaScript and solving the same problem with DOM Helpers, side by side.

- **[Plain JavaScript vs DOM Helpers](./07_plain-js-vs-dom-helpers.md)** — the same feature, two approaches, explained clearly