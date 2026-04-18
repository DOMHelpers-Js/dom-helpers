[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Why Modules Are Separated

## The Question Worth Asking

If all these tools serve the same purpose — working with the DOM — why are they not in one file with one global object?

This is a fair question. A single monolithic file would be simpler to set up. You include it once, and everything is available.

The answer is that a library's structure determines how it scales, how it is learned, and how it is used correctly. The separation in DOM Helpers is not about file organization. It is about keeping responsibilities distinct so that each tool stays focused, predictable, and learnable on its own terms.

---

## What Happens Without Separation

Imagine a single `DOMHelpers` object with every feature:

```javascript
DOMHelpers.getElementById('btn')
DOMHelpers.getElementsByClass('card')
DOMHelpers.querySelector('.form input')
DOMHelpers.updateTextContent({ title: 'Hello', footer: '© 2024' })
DOMHelpers.updateStyles({ header: { color: 'white' } })
DOMHelpers.saveToStorage('user', { name: 'Alice' })
DOMHelpers.loadFromStorage('user')
DOMHelpers.whenState(() => status, { loading: { ... }, done: { ... } })
DOMHelpers.createCondition(...)
DOMHelpers.watchStorage('theme', callback)
```

Everything is available, but there is no signal telling you which tools belong to which concern. DOM access and state logic and storage all look the same. When you read code written this way, you cannot tell at a glance whether a line is finding an element, changing it, reading from storage, or managing a condition.

More importantly: when something breaks, you have no clear place to look. Is it a DOM access issue? A storage issue? A condition that is not evaluating correctly? Everything is in the same namespace.

---

## What Separation Gives You

When responsibilities are separated into distinct modules, each module becomes a boundary. That boundary does two things:

**It tells you what the code is doing.** When you see `Elements.myButton`, you know you are accessing the DOM by ID. When you see `StorageUtils.save(...)`, you know you are writing to storage. When you see `Conditions.whenState(...)`, you know you are defining a state-to-DOM mapping. The module name carries meaning.

**It limits what you need to know.** When you are working on DOM access, you only need to understand the core module. You do not need to know anything about how storage works or how conditions evaluate. You can learn one thing at a time.

---

## Why Sub-Modules Exist Within Each Module

The ten modules are themselves divided into sub-modules. The enhancers module, for example, contains:

- Id Shortcut
- Collection Shortcuts
- Global Query
- Bulk Property Updaters
- Elements.update
- Collections.update
- Selector.update Patch
- Indexed Collection Updates
- Index Selection
- Array-Based Updates
- Global Collection Indexed Updates
- Bulk Properties Global Query

This might seem like a lot of pieces for what is essentially "shortcuts and extensions." But each sub-module addresses a specific pattern. They were not designed all at once and packed into one file — each one was added to solve a particular friction point.

The reason they are kept separate is the same reason the main modules are separate: so you can learn and use each one without having to understand all the others first.

---

## Selective Learning

Because each sub-module is its own documented unit, you can adopt DOM Helpers incrementally:

**Stage 1 — Learn the core first.**

Start with `Elements`, `Collections`, and `Selector`. Understand `.update()`. Build something with just these. This alone is already more structured than raw DOM manipulation.

```javascript
// Stage 1: Just the core
Elements.myTitle.update({ textContent: 'Hello' });
Collections.ClassName.cards.forEach(card => {
  card.update({ classList: { add: 'visible' } });
});
```

**Stage 2 — Add shortcuts when the core feels verbose.**

Once you know the core, add the shortcuts that make your most common operations shorter.

```javascript
// Stage 2: Shortcuts added
Id('myTitle').update({ textContent: 'Hello' });
ClassName.cards.forEach(card => {
  card.update({ classList: { add: 'visible' } });
});
```

**Stage 3 — Add bulk updaters when you see repetition.**

When you notice that you are calling `.update()` on many elements with the same property type, switch to bulk updaters.

```javascript
// Stage 3: Bulk updaters for common patterns
Elements.textContent({
  title: 'Dashboard',
  subtitle: 'Welcome back',
  footer: '© 2024'
});
```

**Stage 4 — Add conditions when state management gets complex.**

When `if`/`else` chains that update the DOM start to grow, introduce Conditions.

```javascript
// Stage 4: Conditions for state-driven UI
Conditions.whenState(
  () => appState.value,
  {
    'loading': { '#panel': { textContent: 'Loading...' } },
    'ready':   { '#panel': { textContent: 'Ready' } }
  }
);
```

**Stage 5 — Add storage when you need persistence.**

When your application needs to remember things across page loads or share state between tabs, bring in StorageUtils.

```javascript
// Stage 5: Storage for persistence
StorageUtils.save('theme', 'dark');
const savedTheme = StorageUtils.load('theme');
```

**Stage 6 — Add native-enhance when migrating existing code.**

If you have existing code that uses `document.getElementById` or `querySelector`, load the native-enhance module and those calls automatically return enhanced elements with `.update()` — no refactoring needed.

```javascript
// Stage 6: Existing code gets .update() for free
const btn = document.getElementById('submitBtn');
btn.update({ disabled: true, textContent: 'Saving...' });
```

**Stage 7 — Add dom-form when forms become complex.**

When reading, validating, and submitting forms involves too much boilerplate, bring in the Forms module.

```javascript
// Stage 7: Form handling without manual wiring
const { isValid, errors } = Forms.loginForm.validate();
await Forms.loginForm.submitData({ url: '/api/login', onSuccess: () => Router.go('/dashboard') });
```

**Stage 8 — Add animation when you need awaitable transitions.**

When you want elements to animate in/out and chain logic after the animation completes, bring in the animation module.

```javascript
// Stage 8: Awaitable animations
await Elements.notification.animate().fadeIn({ duration: 200 }).delay(3000).fadeOut({ duration: 300 }).play();
```

**Stage 9 — Add async utilities when patterns repeat.**

Debounce, throttle, fetch with retry, sleep — instead of writing these utilities by hand, use AsyncHelpers.

```javascript
// Stage 9: Async patterns without boilerplate
const search = AsyncHelpers.debounce((e) => fetchResults(e.target.value), 400);
const data = await AsyncHelpers.fetchJSON('/api/products', { timeout: 5000, retries: 2 });
```

**Stage 10 — Add the SPA router when you need client-side navigation.**

When your application needs multiple pages without full reloads, the Router module adds routing, view transitions, and navigation guards.

```javascript
// Stage 10: Client-side routing
Router.define([
  { path: '/',      view: '#home',  title: 'Home' },
  { path: '/about', view: '#about', title: 'About' }
]).mount('#app').setTransition('fade').start({ mode: 'hash' });
```

This staged approach is only possible because each part of the library is self-contained. You do not have to opt into everything at once.

---

## Separation Prevents Misuse

When tools are mixed together, it becomes easy to use them in the wrong context. A storage function called inside a DOM update callback, a DOM manipulation called from inside a condition handler — these patterns are hard to catch and hard to debug.

Separate modules make misuse visible. If you find yourself importing a storage method inside a file that is supposed to only handle DOM updates, that is a clear signal that something is in the wrong place.

This is not enforced by the library mechanically — JavaScript is a flexible language. But when each module has a name that describes its responsibility, the organization becomes self-documenting. Developers who read the code can see immediately when a responsibility has crossed into the wrong layer.

---

## Maintainability Over Time

Sub-modules also make the library itself easier to maintain. When a bug is found in the bulk property updaters, the fix is contained to that sub-module. It does not require reviewing or testing the entire enhancers module.

When a new feature is added — say, a new type of collection shortcut — it becomes its own sub-module. The existing code is not touched.

For library users, this means updates are predictable. A change in the conditions module does not affect how elements are accessed in the core. Each module has its own version of stability.

---

## The Guiding Principle

The design principle behind DOM Helpers' structure can be stated simply:

**Each module does one thing, does it well, and does not reach into another module's responsibility.**

The core accesses and updates the DOM. The enhancers make the core easier to use. Native-enhance brings `.update()` to existing native API calls. Reactive manages state that propagates changes automatically. Conditions maps state to DOM configurations. Storage manages persistence. DOM Form handles form reading, validation, and submission. Animation adds awaitable transitions. Async covers debounce, throttle, and fetch patterns. The SPA module handles client-side routing.

None of these overlap. None of them try to do each other's jobs. That is what keeps the library predictable as your project grows.

---

## What's Next

Now that you understand how the library is organized and why, the next section covers the recommended way to actually use it — the shortcuts, the update patterns, and the conventions that make DOM Helpers work best.

- **[Recommended Usage](./05_recommended-usage.md)** — shortcuts, update patterns, bulk updaters, and best practices