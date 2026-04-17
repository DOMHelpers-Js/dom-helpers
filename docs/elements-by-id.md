# Accessing Elements by ID

DOM Helpers provides five ways to get a DOM element by its ID. All five return the same enhanced element — the difference is in syntax preference, safety guarantees, and the extra utilities each one bundles.

---

## Prerequisites

ID access is part of the **core** module. Load it before using any of the APIs below.

**ESM:**
```html
<script type="module">
  import { load } from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.loader.esm.min.js';
  await load('core');
</script>
```

**Classic script:**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.loader.min.js"></script>
<script>
  DOMHelpersLoader.load('core').then(function() { ... });
</script>
```

**Full bundle (all modules at once):**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.full-spa.esm.min.js"></script>
```

The `Id()` shortcut requires the **enhancers** module in addition to core:
```js
await load('core', 'enhancers'); // or just load('enhancers') — core auto-loaded
```

The enhanced `document.getElementById` requires the **native-enhance** module:
```js
await load('native-enhance'); // auto-loads core + enhancers
```

---

## The Enhanced Element

Every ID-access method returns an element enhanced with a `.update()` method. This is the primary way to modify elements in DOM Helpers — a single call that handles any combination of properties, styles, classes, attributes, and events.

```js
const btn = Elements.submitBtn;

btn.update({
  textContent: 'Save changes',
  style:       { backgroundColor: '#4CAF50', color: '#fff' },
  classList:   { add: 'active', remove: 'disabled' },
  disabled:    false
});
```

See the [Working with Elements](#working-with-elements) section for the full `.update()` reference.

---

## Method 1 — `Elements.id` (Proxy Access)

The primary API. Access any element by writing its ID as a property name directly on `Elements`.

```js
const header  = Elements.header;
const saveBtn = Elements.saveBtn;
const modal   = Elements['my-modal']; // bracket notation for IDs with hyphens
```

**Returns:** `HTMLElement` with `.update()` — or `null` if not found.

**Caching:** Results are stored in an internal Map. Subsequent accesses return the cached element instantly without hitting the DOM. The cache is automatically invalidated by a MutationObserver when elements are added, removed, or have their `id` attribute changed.

```js
Elements.saveBtn;  // DOM lookup + cached
Elements.saveBtn;  // cache hit — no DOM lookup
```

**When to use:** Everyday element access. Fastest option for repeated access to the same element.

---

## Method 2 — `Id('id')` (Shortcut Function)

A function wrapper around `Elements` that adds input validation and a rich set of utility methods. Requires the **enhancers** module.

```js
const btn = Id('saveBtn');
```

**Returns:** `HTMLElement` with `.update()` — or `null` if not found.

**Input validation:**
```js
Id(123);     // warns: "[Id] Invalid ID type. Expected string, got: number" → returns null
Id('');      // warns: "[Id] Empty ID string provided" → returns null
Id('  btn'); // whitespace trimmed → looks up 'btn'
```

### Id utility methods

All the power of `Id()` comes from the methods it exposes.

---

#### `Id.multiple(...ids)`

Get several elements at once. Returns an object you can destructure.

```js
const { header, footer, sidebar } = Id.multiple('header', 'footer', 'sidebar');
```

**Returns:** `{ id: HTMLElement | null, ... }` for every ID requested.

---

#### `Id.required(...ids)`

Like `Id.multiple()` but throws if any element is missing. Use this when your code cannot continue without the elements.

```js
const { form, submitBtn } = Id.required('form', 'submitBtn');
// throws: "Required elements not found: submitBtn" if submitBtn does not exist
```

**Returns:** Object of elements.
**Throws:** `Error` listing every missing ID.

---

#### `Id.exists(id)`

Check whether an element with the given ID exists in the DOM — without retrieving it.

```js
if (Id.exists('welcomeBanner')) {
  Id('welcomeBanner').update({ hidden: false });
}
```

**Returns:** `boolean`

---

#### `Id.get(id, fallback = null)`

Get an element with a fallback value if it is not found. Avoids null checks in calling code.

```js
const panel = Id.get('sidePanel', document.createElement('div'));
panel.update({ textContent: 'Default content' });
```

**Returns:** `HTMLElement` or the fallback value.

---

#### `Id.waitFor(id, timeout = 5000)`

Wait asynchronously for an element to appear in the DOM. Useful for elements injected by third-party scripts, animations, or async rendering.

```js
// Waits up to 5 seconds (default)
const el = await Id.waitFor('dynamicSection');

// Custom timeout
const el = await Id.waitFor('lazyWidget', 3000);
el.update({ textContent: 'Loaded' });
```

**Returns:** `Promise<HTMLElement>`
**Throws:** Error after timeout — `"Timeout waiting for element with ID: dynamicSection"`
**Check interval:** Every 100ms.

---

#### `Id.update(updates)`

Update multiple elements by ID in a single call.

```js
Id.update({
  pageTitle:   { textContent: 'Welcome back, Alice' },
  userAvatar:  { src: '/avatars/alice.png', alt: 'Alice' },
  statusBadge: { textContent: 'Online', style: { color: 'green' } }
});
```

**Returns:** `{ id: { success: true|false, error? }, ... }`

---

#### `Id.setProperty(id, property, value)`

Set a single property on an element found by ID.

```js
Id.setProperty('emailInput', 'value', 'alice@example.com');
Id.setProperty('submitBtn',  'disabled', true);
```

**Returns:** `boolean` — `true` if successful, `false` if element not found or property invalid.

---

#### `Id.getProperty(id, property, fallback = undefined)`

Get a single property from an element found by ID.

```js
const currentValue = Id.getProperty('emailInput', 'value', '');
const isDisabled   = Id.getProperty('submitBtn',  'disabled', false);
```

**Returns:** Property value or fallback.

---

#### `Id.setAttribute(id, attribute, value)`

Set an HTML attribute on an element found by ID.

```js
Id.setAttribute('profileImg', 'src',  '/images/avatar.png');
Id.setAttribute('mainLink',   'href', '/dashboard');
Id.setAttribute('tooltip',    'aria-label', 'Close dialog');
```

**Returns:** `boolean`

---

#### `Id.getAttribute(id, attribute, fallback = null)`

Get an HTML attribute from an element found by ID.

```js
const href  = Id.getAttribute('mainLink',  'href',  '#');
const label = Id.getAttribute('tooltip',   'aria-label', 'No label');
```

**Returns:** Attribute string or fallback.

---

#### `Id.isCached(id)`

Check whether an element is currently in the Elements cache.

```js
console.log(Id.isCached('header')); // true after first access
```

**Returns:** `boolean`

---

#### `Id.clearCache()`

Manually clear the Elements cache. Useful after major DOM restructuring.

```js
Id.clearCache();
```

---

#### `Id.stats()`

Get cache performance statistics.

```js
const stats = Id.stats();
// {
//   hits:      150,
//   misses:     23,
//   cacheSize:  18,
//   hitRate:   0.87,
//   uptime:  43200
// }
```

---

#### `Id.Elements`

Direct reference to the underlying `Elements` helper for advanced use.

```js
Id.Elements.configure({ enableLogging: true });
```

---

## Method 3 — `Elements.*()` (Static Utility Methods)

Static methods that sit directly on the `Elements` object. These are the same operations as `Id.*()` but accessed through `Elements` directly.

```js
// Single element with fallback
const panel = Elements.get('sidePanel', null);

// Multiple at once
const { nav, main, footer } = Elements.destructure('nav', 'main', 'footer');

// Required elements
const { form, btn } = Elements.getRequired('contactForm', 'submitBtn');

// Wait for dynamic content
const section = await Elements.waitFor('lazySection');

// Bulk update
Elements.update({
  title:    { textContent: 'Dashboard' },
  subtitle: { textContent: 'Welcome back' }
});

// Utilities
Elements.exists('optionalBanner');          // boolean
Elements.isCached('header');                // boolean
Elements.setProperty('input', 'value', ''); // boolean
Elements.getProperty('input', 'value', ''); // string
Elements.setAttribute('img', 'alt', 'Logo');// boolean
Elements.getAttribute('link', 'href', '#'); // string
Elements.stats();                           // stats object
Elements.clear();                           // clear cache
```

All of these are identical to their `Id.*()` equivalents. `Id.*()` delegates to `Elements.*()` internally — they share the same cache and the same results.

**Additional methods only on `Elements`:**

```js
// Alias for destructure
Elements.getMultiple('id1', 'id2', 'id3');

// Configure the Elements helper
Elements.configure({
  enableLogging:   false,  // log cache hits/misses
  autoCleanup:     true,   // periodic stale entry cleanup
  cleanupInterval: 30000,  // ms between cleanup runs
  maxCacheSize:    1000,   // max cached entries
  debounceDelay:   16      // ms to debounce MutationObserver
});

// Get all currently cached IDs
Elements.getCacheSnapshot(); // ['header', 'footer', 'nav', ...]

// Destroy the helper (disconnects MutationObserver, clears timers)
Elements.destroy();
```

---

## Method 4 — `document.getElementById()` (Enhanced Native)

When the **native-enhance** module is loaded, `document.getElementById` is seamlessly replaced with an enhanced version. It behaves identically to the native method but returns an element with `.update()` attached.

```js
// Exactly like native — no API change
const btn = document.getElementById('saveBtn');
btn.update({ textContent: 'Saving...', disabled: true });
```

**This is a drop-in enhancement.** Existing code that calls `document.getElementById` gains `.update()` automatically — no changes required.

### Bulk methods on `document.getElementById`

The enhanced function gains static bulk methods for updating multiple elements at once by ID.

#### `.update(updates)`

```js
document.getElementById.update({
  pageTitle:   { textContent: 'My App' },
  description: { textContent: 'Welcome', style: { color: 'grey' } }
});
```

#### Property shorthands

Each method takes an object of `{ id: value }` pairs:

```js
// Text content
document.getElementById.textContent({ heading: 'Hello', subheading: 'World' });
document.getElementById.innerHTML({   hero: '<em>Featured</em>' });
document.getElementById.innerText({   preview: 'Plain text only' });

// Form inputs
document.getElementById.value({       emailInput: 'user@example.com' });
document.getElementById.placeholder({ emailInput: 'Enter your email' });
document.getElementById.checked({     agreeBox: true });
document.getElementById.disabled({    submitBtn: false });
document.getElementById.readonly({    nameField: true });
document.getElementById.selected({    firstOption: true });

// Media and links
document.getElementById.src({  avatar: '/images/user.png' });
document.getElementById.href({ homeLink: '/dashboard' });
document.getElementById.alt({  avatar: 'User avatar' });

// Visibility
document.getElementById.hidden({ banner: false, overlay: true });
document.getElementById.title({  saveBtn: 'Click to save your changes' });
```

#### Style shorthand

```js
document.getElementById.style({
  header: { backgroundColor: '#333', color: '#fff', padding: '16px' },
  footer: { borderTop: '1px solid #ccc', marginTop: '24px' }
});
```

#### Classes shorthand

```js
// Replace className entirely
document.getElementById.classes({ btn: 'btn btn-primary active' });

// Fine-grained class manipulation
document.getElementById.classes({
  btn: { add: 'loading', remove: 'idle' }
});

// Add/remove multiple classes at once
document.getElementById.classes({
  card: { add: ['shadow', 'elevated'], remove: ['flat', 'muted'] }
});
```

#### Attributes shorthand

```js
document.getElementById.attrs({
  profileImg: { src: '/new.png', alt: 'New image', loading: 'lazy' },
  externalLink: { target: '_blank', rel: 'noopener' }
});

// Set attribute to null or false to remove it
document.getElementById.attrs({
  btn: { 'aria-expanded': null }  // removes the attribute
});
```

#### Dataset shorthand

```js
document.getElementById.dataset({
  card:   { userId: '42', role: 'admin' },
  widget: { loaded: 'true', version: '2' }
});
// Sets data-user-id="42", data-role="admin" etc.
```

#### Nested property path

```js
// Set any nested property path using dot notation
document.getElementById.prop('style.color', {
  heading:  'navy',
  subheading: 'grey'
});

document.getElementById.prop('dataset.loaded', {
  widget: 'true'
});
```

---

## Method 5 — `document.querySelector('#id')`

When the **native-enhance** module is loaded, `document.querySelector` also returns enhanced elements. You can use an ID selector the same way you always would.

```js
const btn = document.querySelector('#saveBtn');
btn.update({ textContent: 'Saved' });
```

**Returns:** `HTMLElement` with `.update()` — or `null`.

**Note:** This method uses the selector engine and does not benefit from the Elements ID cache. For ID access, prefer `Elements.id`, `Id()` or `document.getElementById` which are faster and cache-aware.

Use `querySelector` when you are already working with CSS selectors and the ID is part of a more complex query:

```js
// Selecting by ID is just one part of the query
document.querySelector('#sidebar .nav-item.active');
document.querySelector('#form input[required]');
```

---

## Working with Elements

All five methods return an element with `.update()`. Here is the full reference for what `.update()` accepts.

### `.update(updates)`

A single method that handles every kind of DOM modification. Pass an object where each key is a property type.

```js
element.update({
  // Text and HTML
  textContent: 'Hello world',
  innerHTML:   '<strong>Bold text</strong>',
  innerText:   'Visible text only',

  // Inline styles — object of CSS properties
  style: {
    color:           '#333',
    backgroundColor: '#f5f5f5',
    fontSize:        '16px',
    display:         'flex'
  },

  // Class manipulation
  classList: {
    add:     'active',           // string or array
    remove:  ['disabled', 'muted'],
    toggle:  'expanded',
    replace: ['old-theme', 'new-theme']
  },

  // HTML attributes
  setAttribute: { 'aria-expanded': 'true', 'data-id': '42' },
  removeAttribute: 'aria-hidden',    // string or array

  // Dataset (data-* attributes)
  dataset: { userId: '42', role: 'admin' },

  // Form inputs
  value:    'alice@example.com',
  checked:  true,
  disabled: false,
  selected: true,

  // Media
  src: '/images/photo.png',
  alt: 'Profile photo',

  // Links
  href: '/dashboard',

  // Events
  addEventListener: ['click', function handleClick(e) { ... }],

  // Any other element property
  hidden:      false,
  tabIndex:    0,
  placeholder: 'Enter your name'
});
```

**Change detection:** `.update()` compares new values against the previously set value. Properties that have not changed are skipped — no unnecessary DOM writes.

**Chaining:** `.update()` returns the element, so calls can be chained:

```js
Elements.header
  .update({ textContent: 'Dashboard' })
  .update({ style: { backgroundColor: '#1a1a2e' } });
```

---

## The Caching System

`Elements`, `Id()`, and `document.getElementById` all share one cache. Understanding it helps you write more performant code.

### How it works

1. First access — looks up element with `document.getElementById`, stores it in a `Map`.
2. Subsequent accesses — returns the cached reference immediately, no DOM lookup.
3. MutationObserver watches for DOM changes. When an element's `id` attribute changes or the element is removed, its cache entry is invalidated automatically.
4. Periodic cleanup runs every 30 seconds (configurable) to remove any stale entries that the MutationObserver may have missed.

### Cache statistics

```js
const stats = Elements.stats();
// or
const stats = Id.stats();

// {
//   hits:      243,   — accesses served from cache
//   misses:     31,   — accesses that required a DOM lookup
//   cacheSize:  18,   — elements currently cached
//   hitRate:  0.89,   — hits / (hits + misses)
//   uptime:  86400    — seconds since helper initialised
// }
```

### Configuration

```js
Elements.configure({
  enableLogging:   true,   // log cache activity to console
  autoCleanup:     true,   // run periodic stale-entry cleanup
  cleanupInterval: 30000,  // ms between cleanup runs (default 30s)
  maxCacheSize:    1000,   // max entries before oldest are evicted
  debounceDelay:   16      // ms to debounce MutationObserver callbacks
});
```

### Manual cache control

```js
Elements.isCached('header');     // check before deciding how to access
Elements.getCacheSnapshot();     // ['header', 'nav', 'footer', ...]
Elements.clear();                // clear all entries
Id.clearCache();                 // same — clears the shared cache
```

---

## Practical Patterns

### Standard access

```js
// Single element
const btn = Elements.saveBtn;
btn.update({ textContent: 'Save', disabled: false });

// With null check
const banner = Elements.announcementBanner;
if (banner) {
  banner.update({ hidden: false });
}
```

### Multiple elements at once

```js
// Destructure
const { nav, main, footer } = Elements.destructure('nav', 'main', 'footer');

// Or with Id
const { nav, main, footer } = Id.multiple('nav', 'main', 'footer');
```

### Required elements (throws on missing)

```js
// Use at app initialisation — fails fast if HTML is missing expected elements
const { loginForm, emailInput, submitBtn } = Elements.getRequired(
  'loginForm', 'emailInput', 'submitBtn'
);
```

### Bulk updates across multiple elements

```js
// Update many elements in one call
Id.update({
  pageTitle:    { textContent: 'My Dashboard' },
  userGreeting: { textContent: `Hello, ${user.name}` },
  userAvatar:   { src: user.avatarUrl, alt: user.name },
  logoutBtn:    { hidden: false }
});
```

### Waiting for dynamic content

```js
// Element injected by a third-party script or async render
const widget = await Id.waitFor('chatWidget', 10000);
widget.update({ style: { bottom: '80px' } });

// Multiple elements
const { hero, cta } = await Elements.waitFor('hero', 'cta');
```

### Safe access with fallback

```js
const panel = Id.get('optionalSidebar', null);
if (panel) {
  panel.update({ classList: { add: 'visible' } });
}
```

### Checking existence before access

```js
if (Id.exists('cookieBanner')) {
  Id('cookieBanner').update({ hidden: true });
}
```

### Bulk DOM updates using `document.getElementById`

When native-enhance is loaded, bulk-update multiple elements without retrieving them first:

```js
// Update text across the page in one call
document.getElementById.textContent({
  welcomeMessage: `Hello, ${user.name}`,
  itemCount:      `${cart.items.length} items`,
  totalPrice:     `$${cart.total.toFixed(2)}`
});

// Toggle states
document.getElementById.disabled({
  submitBtn: form.hasErrors,
  cancelBtn: false
});

document.getElementById.hidden({
  loadingSpinner: false,
  mainContent:    true
});
```

### Reactive updates with the store

When using the `reactive` module, drive element updates from state automatically:

```js
await load('reactive');

const state = ReactiveUtils.state({ count: 0, loading: false });

ReactiveUtils.effect(() => {
  Id.update({
    counter:    { textContent: String(state.count) },
    submitBtn:  { disabled: state.loading, textContent: state.loading ? 'Saving...' : 'Save' },
    spinner:    { hidden: !state.loading }
  });
});

Elements.incrementBtn.addEventListener('click', () => state.count++);
```

---

## Choosing the Right Method

| Situation | Recommended method |
|---|---|
| Everyday element access | `Elements.myId` |
| Need input validation + rich utilities | `Id('myId')` |
| Getting multiple elements at once | `Id.multiple()` or `Elements.destructure()` |
| Element must exist or app should fail fast | `Id.required()` or `Elements.getRequired()` |
| Element may not exist, need a fallback | `Id.get(id, fallback)` |
| Element injected dynamically | `Id.waitFor()` or `Elements.waitFor()` |
| Updating many elements in one call | `Id.update()` or `Elements.update()` |
| Existing code using native getElementById | `document.getElementById` (enhanced) |
| Complex CSS selector that includes an ID | `document.querySelector('#id ...')` |

---

## Module Requirements Summary

| Method | Requires |
|---|---|
| `Elements.id`, `Elements.*()` | `core` |
| `Id()`, `Id.*()` | `core` + `enhancers` |
| `document.getElementById` enhanced | `core` + `enhancers` + `native-enhance` |
| `document.querySelector` enhanced | `core` + `enhancers` + `native-enhance` |
