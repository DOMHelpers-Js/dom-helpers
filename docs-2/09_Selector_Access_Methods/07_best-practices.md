[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Best Practices — Mastering the Selector Helper

## Quick Start: Two Questions to Guide Every Decision

Before writing any Selector code, ask yourself two questions:

**1. Which helper should I use to access my elements?**

```
Does the element have a unique ID?
    └─ Yes → Elements.id

Is it a simple class, tag, or name group?
    └─ Yes → Collections.ClassName / TagName / Name

Is the selector complex, conditional, or structural?
    └─ Yes → Selector.query() / queryAll()

Need to limit the search to a container?
    └─ Yes → Selector.Scoped.within() / withinAll()

Is the content loaded dynamically?
    └─ Yes → await Selector.waitFor() / waitForAll()
```

**2. What do I want to do with the result?**

```
Iterate each element           → .forEach()
Transform to a new array       → .map()
Filter by a condition          → .filter()
Apply class/style to all       → .addClass() / .setStyle()
Attach event listeners to all  → .on()
Check if any exist             → .isEmpty() / .some()
```

---

## The Helper Decision Tree

```
Need to access DOM elements?
│
├─ Unique ID known?
│  └─→ Elements.submitBtn               // Elements helper
│
├─ Simple class, tag, or name?
│  ├─→ Collections.ClassName.card       // Collections helper
│  ├─→ Collections.TagName.button
│  └─→ Collections.Name.color
│
├─ Complex CSS selector needed?
│  ├─ Single element?
│  │  └─→ Selector.query('.btn.primary:not(.disabled)')
│  ├─ Multiple elements?
│  │  └─→ Selector.queryAll('input[required]:not([readonly])')
│  ├─ Within a container?
│  │  ├─→ Selector.Scoped.within(modal, '.btn.confirm')
│  │  └─→ Selector.Scoped.withinAll(form, 'input[required]')
│  └─ Dynamic / async content?
│     ├─→ await Selector.waitFor('.page-header', 5000)
│     └─→ await Selector.waitForAll('.list-item', 3, 8000)
│
└─ After access, use shared methods on the result:
   └─→ .addClass() / .on() / .forEach() / .filter() / .first() / .isEmpty()
```

---

## Method Selection Guide

### Query Methods

| Scenario | Method |
|----------|--------|
| Single element, complex selector | `Selector.query(selector)` |
| Multiple elements, complex selector | `Selector.queryAll(selector)` |
| Single element, within container | `Selector.Scoped.within(container, selector)` |
| Multiple elements, within container | `Selector.Scoped.withinAll(container, selector)` |
| Single element, not yet in DOM | `await Selector.waitFor(selector, timeout)` |
| Multiple elements, not yet in DOM | `await Selector.waitForAll(selector, minCount, timeout)` |

### On-Result Methods

| Goal | Method |
|------|--------|
| Run code for each element | `.forEach(callback)` |
| Build a new array from elements | `.map(callback)` |
| Keep only elements meeting a condition | `.filter(callback)` |
| Find one specific element | `.find(callback)` |
| Apply a CSS class to all | `.addClass(name)` |
| Remove a CSS class from all | `.removeClass(name)` |
| Toggle a CSS class on all | `.toggleClass(name)` |
| Set a JS property on all | `.setProperty(prop, value)` |
| Set an HTML attribute on all | `.setAttribute(attr, value)` |
| Apply inline styles to all | `.setStyle(stylesObject)` |
| Attach events to all | `.on(event, handler)` |
| Remove events from all | `.off(event, handler?)` |
| Get only visible elements | `.visible()` |
| Get only enabled form elements | `.enabled()` |
| Get first element | `.first()` |
| Get last element | `.last()` |
| Get element at index (negative OK) | `.at(index)` |
| Check if collection is empty | `.isEmpty()` |
| Convert to plain array | `.toArray()` |

---

## Do's and Don'ts

### ✅ DO: Use Selector for Complex Selectors Only

```javascript
// ✅ Good — complex selector is exactly what Selector is for
const primary = Selector.query('.modal.visible .footer .btn.primary:not(.disabled)');
const oddRows  = Selector.queryAll('tr:nth-child(odd):not(.summary-row)');
const required = Selector.queryAll('input[required]:not([readonly]):not([disabled])');
```

```javascript
// ❌ Avoid — simple class access → use Collections instead
const cards = Selector.queryAll('.card');  // Overkill

// ✅ Better
const cards = Collections.ClassName.card;
```

```javascript
// ❌ Avoid — ID access → use Elements
const btn = Selector.query('#submitBtn');  // Overkill

// ✅ Better
const btn = Elements.submitBtn;
```

---

### ✅ DO: Always Check `query()` for Null

```javascript
// ✅ Correct — null check before use
const overlay = Selector.query('.loading-overlay');
if (overlay) {
  overlay.classList.add('hidden');
}

// ✅ Also correct — optional chaining
Selector.query('.alert')?.classList.remove('danger');

// ❌ Incorrect — will throw TypeError if element is not found
Selector.query('.overlay').style.display = 'none';
```

---

### ✅ DO: Use `isEmpty()` to Check `queryAll()` Results

```javascript
// ✅ Correct — explicit empty check
const results = Selector.queryAll('.search-result');
if (!results.isEmpty()) {
  results.addClass('visible');
  Elements.noResults.classList.add('hidden');
} else {
  Elements.noResults.classList.remove('hidden');
}

// ❌ Incorrect — truthy check always passes (empty collection is still an object)
const results = Selector.queryAll('.search-result');
if (results) {  // Always true!
  results.addClass('visible');
}
```

---

### ✅ DO: Use Scoped Queries for Component Isolation

```javascript
// ✅ Good — buttons from THIS modal only
function setupModal(modalElement) {
  const closeBtns  = Selector.Scoped.withinAll(modalElement, '.close-btn');
  const confirmBtn = Selector.Scoped.within(modalElement, '.btn-confirm');

  closeBtns.on('click', () => closeModal(modalElement));
  if (confirmBtn) {
    confirmBtn.addEventListener('click', handleConfirm);
  }
}

// ❌ Risky — might target buttons from other modals
function setupModal(modalElement) {
  const closeBtns = Selector.queryAll('.close-btn');  // Could match all modals!
}
```

---

### ✅ DO: Use `waitFor` Only for Truly Dynamic Content

```javascript
// ✅ Correct — content is loaded after an API call
async function loadUserList() {
  await fetchUsers();
  const users = await Selector.waitForAll('.user-card', 1, 8000);
  users.on('click', handleUserClick);
}

// ❌ Unnecessary — element is in the static HTML
async function init() {
  const header = await Selector.waitFor('.page-header');  // Exists on page load!

  // ✅ Just do this
  const header = Selector.query('.page-header');
}
```

---

### ✅ DO: Chain DOM Methods for Concise Updates

```javascript
// ✅ Clean and readable — one chain for multiple operations
Selector.queryAll('.notification')
  .addClass('visible')
  .setAttribute('aria-live', 'polite')
  .setStyle({ opacity: '1', transform: 'translateX(0)' })
  .on('click', dismissNotification);

// ❌ Verbose — separate statements for each operation
const notifications = Selector.queryAll('.notification');
notifications.addClass('visible');
notifications.setAttribute('aria-live', 'polite');
notifications.setStyle({ opacity: '1' });
notifications.on('click', dismissNotification);
```

---

### ❌ DON'T: Clear Cache Unnecessarily

```javascript
// ❌ Bad — destroys performance
function handleClick() {
  Selector.clear();  // Don't do this before every query!
  const btn = Selector.query('.active-btn');
  btn?.classList.remove('active');
}

// ✅ Let the cache work automatically
function handleClick() {
  const btn = Selector.query('.active-btn');
  btn?.classList.remove('active');
}
```

---

### ❌ DON'T: Mutate the DOM While Iterating

```javascript
// ❌ Dangerous — removing elements mid-iteration can cause issues
const items = Selector.queryAll('.item.expired');
items.forEach(item => {
  item.parentNode.removeChild(item);  // Modifying DOM during forEach!
});

// ✅ Collect first, then modify
const items = Selector.queryAll('.item.expired');
const toRemove = items.toArray();  // Convert to plain array
toRemove.forEach(item => item.parentNode.removeChild(item));
```

---

### ❌ DON'T: Call Collection Methods on Filter Results

```javascript
// ❌ visible(), hidden(), enabled(), disabled() return plain arrays — not collections
const inputs = Selector.queryAll('input');
inputs.visible().addClass('active');  // ERROR — plain array has no addClass()

// ✅ Use forEach on filter results
inputs.visible().forEach(input => input.classList.add('active'));
```

---

### ❌ DON'T: Skip Error Handling on Async Methods

```javascript
// ❌ Unhandled rejection if timeout expires
const content = await Selector.waitFor('.dynamic-content');

// ✅ Always handle the timeout case
try {
  const content = await Selector.waitFor('.dynamic-content', 8000);
  initialize(content);
} catch (error) {
  showFallback();
}
```

---

## Performance Optimization Guide

### 1. Use Specific Selectors

```javascript
// Slower — checks all elements, then filters by descendant
const items = Selector.queryAll('* .list-item');

// Faster — specific path
const items = Selector.queryAll('.results-container .list-item');
```

### 2. Scope to Containers on Large Pages

```javascript
// On a page with 5,000+ elements:

// Slower — global search
const inputs = Selector.queryAll('input[required]');

// Faster — scoped to the relevant section
const form   = Elements.checkoutForm;
const inputs = Selector.Scoped.withinAll(form, 'input[required]');
```

### 3. Query Once, Use Many Times

```javascript
// Slower — repeated cache lookups in a loop
items.forEach(item => {
  const buttons = Selector.queryAll('.btn');  // Lookup on every iteration
  buttons.first()?.click();
});

// Faster — single lookup, stored reference
const buttons = Selector.queryAll('.btn');
items.forEach(item => {
  buttons.first()?.click();
});
```

### 4. Use `Promise.all()` for Parallel Async Waits

```javascript
// Slower — sequential waits add up
const header = await Selector.waitFor('.header', 5000);     // Up to 5s
const sidebar = await Selector.waitFor('.sidebar', 5000);   // Up to 5s more
// Total: up to 10s

// Faster — parallel waits
const [header, sidebar] = await Promise.all([
  Selector.waitFor('.header', 5000),
  Selector.waitFor('.sidebar', 5000)
]);
// Total: up to 5s (both run simultaneously)
```

### 5. Leverage the Cache

```javascript
// The cache makes repeated access fast:
const first  = Selector.queryAll('.card');  // Cache miss → DOM query
const second = Selector.queryAll('.card');  // Cache hit → instant

// Don't defeat this by generating dynamic selectors in loops
items.forEach((item, i) => {
  const elem = Selector.query(`.item-${i}`);  // New selector each time — many misses
});

// Better — use a single broad query and index access
const allItems = Selector.queryAll('.item');
items.forEach((item, i) => {
  const elem = allItems.at(i);  // No new query — uses cached result
});
```

---

## Common Mistakes and Fixes

### Mistake 1: Using the Wrong Helper

```javascript
// ❌ Wrong helper for an ID
const btn = Selector.query('#submitBtn');

// ✅ Fix: use Elements
const btn = Elements.submitBtn;

// ❌ Wrong helper for a plain class group
const cards = Selector.queryAll('.card');

// ✅ Fix: use Collections when the selector is just a class
const cards = Collections.ClassName.card;
```

### Mistake 2: Forgetting Null Check on `query()`

```javascript
// ❌ Will crash if element is absent
Selector.query('.submit-btn').disabled = false;

// ✅ Fix: always check
const btn = Selector.query('.submit-btn');
if (btn) btn.disabled = false;
```

### Mistake 3: Truthy Check on `queryAll()` Results

```javascript
// ❌ Empty collection is truthy — always runs
const items = Selector.queryAll('.item');
if (items) { process(items); }  // Runs even when empty!

// ✅ Fix: use isEmpty()
const items = Selector.queryAll('.item');
if (!items.isEmpty()) { process(items); }
```

### Mistake 4: Calling Collection Methods on Filtering Results

```javascript
// ❌ visible() returns a plain array
const inputs = Selector.queryAll('input');
inputs.visible().addClass('focused');  // TypeError!

// ✅ Fix: use forEach on plain array results
inputs.visible().forEach(input => input.classList.add('focused'));
```

### Mistake 5: Using `waitFor()` Without `try/catch`

```javascript
// ❌ Uncaught rejection if element never appears
const modal = await Selector.waitFor('.confirm-modal.open', 3000);

// ✅ Fix: wrap in try/catch
try {
  const modal = await Selector.waitFor('.confirm-modal.open', 3000);
  setupModal(modal);
} catch {
  console.warn('Modal did not open — using fallback');
  showInlineConfirm();
}
```

---

## Production Checklist

### Query Methods

- [ ] Using `Selector` only for complex/conditional selectors
- [ ] Using `Elements` for ID-based access
- [ ] Using `Collections` for simple class/tag/name groups
- [ ] Results stored in variables when used multiple times

### Null / Empty Safety

- [ ] Every `query()` result is checked for `null` before use
- [ ] Every `queryAll()` result uses `.isEmpty()` for empty checks
- [ ] Optional chaining used where one-liner access is needed

### Scoped Queries

- [ ] Components use `Scoped.within` / `Scoped.withinAll` for isolation
- [ ] Scoped queries target meaningful containers — not `document.body`

### Async Methods

- [ ] `waitFor` / `waitForAll` used only for dynamically loaded content
- [ ] All async wait calls wrapped in `try/catch`
- [ ] Timeouts set to realistic values per operation type
- [ ] Parallel waits use `Promise.all()` where possible

### Performance

- [ ] No unnecessary `Selector.clear()` calls
- [ ] Specific selectors used — no universal `*` selectors
- [ ] Large-DOM queries scoped to relevant containers
- [ ] Queries referenced by variable — not repeated in loops

### Lifecycle

- [ ] `Selector.configure()` called once at app start
- [ ] `Selector.destroy()` called on app shutdown
- [ ] `Selector.clear()` called after full DOM rebuilds / SPA navigation
- [ ] Logging disabled in production (`enableLogging: false`)

---

## Real-World Complete Examples

### Example 1: Page Initializer

```javascript
async function initializePage() {
  // Sync elements available immediately
  const nav    = Selector.query('.main-nav');
  const footer = Selector.query('.footer');

  if (nav)    setupNavigation(nav);
  if (footer) setupFooter(footer);

  // Bulk operations on element groups
  Selector.queryAll('.btn.interactive')
    .addClass('initialized')
    .on('click', handleButtonClick);

  Selector.queryAll('input[data-validate]')
    .on('blur', validateField)
    .on('input', markDirty);

  // Wait for dynamic content
  try {
    const feed = await Selector.waitForAll('.feed-item', 3, 10000);
    feed.addClass('loaded').on('click', handleFeedItemClick);
    console.log(`Feed ready: ${feed.length} items`);
  } catch {
    Elements.feedError.classList.remove('hidden');
  }
}
```

---

### Example 2: Form Handler Class

```javascript
class FormHandler {
  constructor(formId) {
    const form = Elements[formId];
    if (!form) throw new Error(`Form not found: ${formId}`);

    this.form = form;

    // All queries scoped to this form
    this.fields   = Selector.Scoped.withinAll(form, 'input, textarea, select');
    this.required = Selector.Scoped.withinAll(form, '[required]');
    this.buttons  = Selector.Scoped.withinAll(form, 'button');

    this.bindEvents();
  }

  bindEvents() {
    this.fields.on('input', () => this.markDirty());
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submit();
    });
  }

  validate() {
    const empty = this.required.filter(f => !f.value.trim());

    if (empty.length > 0) {
      empty.forEach(f => f.classList.add('error'));
      empty[0].focus();
      return false;
    }

    this.required.forEach(f => f.classList.remove('error'));
    return true;
  }

  getData() {
    const data = {};
    this.fields.forEach(field => {
      if (field.name) data[field.name] = field.value;
    });
    return data;
  }

  async submit() {
    if (!this.validate()) return;

    this.lock();

    try {
      const data = this.getData();
      await submitFormData(data);

      Elements.successMessage.classList.remove('hidden');
    } catch (error) {
      console.error('Submit failed:', error);
      Elements.errorMessage.classList.remove('hidden');
    } finally {
      this.unlock();
    }
  }

  markDirty() {
    this.form.classList.add('dirty');
  }

  lock() {
    this.fields.setProperty('disabled', true);
    this.buttons.setProperty('disabled', true);
    this.buttons.addClass('loading');
  }

  unlock() {
    this.fields.setProperty('disabled', false);
    this.buttons.setProperty('disabled', false);
    this.buttons.removeClass('loading');
  }
}

const checkout = new FormHandler('checkoutForm');
const contact  = new FormHandler('contactForm');
```

---

### Example 3: Dynamic Content Loader

```javascript
class ContentLoader {
  constructor(containerElement) {
    this.container = containerElement;
  }

  async load(endpoint) {
    this.showLoading();

    try {
      // Fetch content
      const html = await fetch(endpoint).then(r => r.text());
      this.container.innerHTML = html;

      // Clear cache — new content just rendered
      Selector.clear();

      // Wait for key elements to appear
      const [title, items] = await Promise.all([
        Selector.waitFor('.content-title', 3000),
        Selector.waitForAll('.content-item', 1, 5000)
      ]);

      console.log(`Loaded "${title.textContent}" with ${items.length} items`);

      // Initialize the new content
      this.initializeContent(items);

    } catch (error) {
      console.error('Content load failed:', error.message);
      this.showError();
    } finally {
      this.hideLoading();
    }
  }

  initializeContent(items) {
    items
      .addClass('ready')
      .on('click', (e) => this.handleItemClick(e.currentTarget));

    // Initialize any nested interactive elements
    const nestedBtns = Selector.Scoped.withinAll(this.container, '.item-action');
    nestedBtns.on('click', (e) => {
      e.stopPropagation();
      this.handleAction(e.currentTarget.dataset.action);
    });
  }

  handleItemClick(item) {
    const id = item.dataset.id;
    console.log('Item clicked:', id);
  }

  handleAction(action) {
    console.log('Action triggered:', action);
  }

  showLoading() {
    Selector.Scoped.within(this.container, '.loading-state')?.classList.remove('hidden');
  }

  hideLoading() {
    Selector.Scoped.within(this.container, '.loading-state')?.classList.add('hidden');
  }

  showError() {
    Selector.Scoped.within(this.container, '.error-state')?.classList.remove('hidden');
  }
}

const mainLoader = new ContentLoader(Elements.mainContent);
await mainLoader.load('/api/home-content');
```

---

## Complete Quick Reference

```javascript
// ─── QUERY METHODS ───────────────────────────────────────────────────────────
const elem  = Selector.query('.btn.active');               // One element or null
const elems = Selector.queryAll('.btn:not(.disabled)');    // Enhanced collection

// ─── SCOPED QUERIES ──────────────────────────────────────────────────────────
const container = Elements.modal;
const one  = Selector.Scoped.within(container, '.title');           // One element or null
const many = Selector.Scoped.withinAll(container, 'input[required]'); // Enhanced collection

// ─── ASYNC METHODS ───────────────────────────────────────────────────────────
const single = await Selector.waitFor('.dynamic-elem', 5000);       // One element
const group  = await Selector.waitForAll('.item', 3, 8000);         // Min 3 elements

// ─── ARRAY METHODS (on results) ──────────────────────────────────────────────
elems.forEach((e, i) => console.log(i, e));
const texts = elems.map(e => e.textContent);      // plain Array
const active = elems.filter(e => e.classList.contains('active'));  // plain Array
const first  = elems.find(e => e.dataset.id === '5');
const hasBad = elems.some(e => e.classList.contains('error'));
const allOk  = elems.every(e => e.dataset.valid === 'true');
const plain  = elems.toArray();

// ─── DOM MANIPULATION METHODS (on results, chainable) ────────────────────────
elems
  .addClass('ready')
  .removeClass('loading')
  .toggleClass('selected')
  .setProperty('disabled', false)
  .setAttribute('aria-expanded', 'true')
  .setStyle({ opacity: '1', transition: 'all 0.3s' })
  .on('click', handler)
  .off('mouseenter');

// ─── FILTERING METHODS (return plain arrays) ─────────────────────────────────
const visible  = elems.visible();     // plain Array
const hidden   = elems.hidden();      // plain Array
const enabled  = elems.enabled();     // plain Array
const disabled = elems.disabled();    // plain Array
const inCards  = elems.within('.card');  // plain Array (Selector only)

// ─── UTILITY METHODS (on results) ────────────────────────────────────────────
const first    = elems.first();     // Element or undefined
const last     = elems.last();      // Element or undefined
const third    = elems.at(2);       // Element or undefined
const fromEnd  = elems.at(-1);      // Last element
const empty    = elems.isEmpty();   // Boolean

// ─── HELPER METHODS (on Selector itself) ─────────────────────────────────────
const stats = Selector.stats();                  // { hits, misses, hitRate, cacheSize }
Selector.clear();                                // Reset cache
Selector.destroy();                             // Full teardown
Selector.configure({ enableLogging: true });    // Adjust settings
```

---

## Summary

The Selector Helper is purpose-built for one thing: **giving you full CSS selector power with caching, enhanced results, and clean async support**.

**Use it when:**
- Your selector has conditions, pseudo-classes, attribute matchers, or combinators
- You need to scope a search to a specific container
- You're working with content that loads dynamically

**Trust it to:**
- Cache results automatically — no manual cache management needed in normal use
- Return enhanced results — array methods and DOM methods built right in
- Handle timing — `waitFor` and `waitForAll` use `MutationObserver`, not polling

**Remember the golden rules:**

1️⃣ Right helper for the right job: **Elements** → IDs, **Collections** → simple groups, **Selector** → complex queries

2️⃣ Always check `query()` for `null` — always use `isEmpty()` with `queryAll()`

3️⃣ Scope to containers for performance and component isolation

4️⃣ Always handle async timeouts with `try/catch`

5️⃣ Let the cache work — only `clear()` after full DOM rebuilds

Build clean, performant, component-safe interfaces with confidence.