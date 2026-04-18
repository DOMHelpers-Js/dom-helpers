[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Async Methods — `waitFor()` and `waitForAll()`

## Quick Start (30 Seconds)

```javascript
// Wait for a single element to appear in the DOM
async function afterLoad() {
  try {
    const button = await Selector.waitFor('.submit-btn', 5000);
    button.disabled = false;
    button.textContent = 'Ready!';
  } catch (error) {
    console.error('Button never appeared');
  }
}

// Wait for multiple elements (minimum count required)
async function afterListLoads() {
  try {
    const items = await Selector.waitForAll('.list-item', 5, 10000);
    items.addClass('loaded').on('click', handleItemClick);
  } catch (error) {
    showEmptyState();
  }
}
```

These two methods let you pause execution until the DOM is ready — perfect for dynamic content, AJAX responses, and SPAs.

---

## What Are Async Methods?

`Selector.waitFor()` and `Selector.waitForAll()` are **Promise-based** methods that watch for elements to appear in the DOM. They return a promise that resolves when the element (or elements) show up, or rejects if the timeout expires first.

Simply put: they answer the question **"wait for this element to exist, then give it to me."**

This is essential for modern web applications where content is loaded:
- After an AJAX/fetch API call
- After a JavaScript framework renders a component
- After a user interaction triggers dynamic content
- After a SPA (Single Page Application) navigates to a new route

Without async methods, you'd have to write polling loops or complex `MutationObserver` code yourself. These methods handle all of that internally.

---

## Syntax

### `Selector.waitFor()`

```javascript
await Selector.waitFor(selector, timeout?)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `selector` | `string` | required | Any valid CSS selector |
| `timeout` | `number` | `10000` | Max wait time in milliseconds |

**Returns:** `Promise<Element>` — resolves with the found element
**Throws:** `Error` if the timeout expires before the element appears

---

### `Selector.waitForAll()`

```javascript
await Selector.waitForAll(selector, minCount?, timeout?)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `selector` | `string` | required | Any valid CSS selector |
| `minCount` | `number` | `1` | Minimum number of elements required |
| `timeout` | `number` | `10000` | Max wait time in milliseconds |

**Returns:** `Promise<EnhancedCollection>` — resolves with the found collection
**Throws:** `Error` if the timeout expires before `minCount` elements appear

---

## Why Does This Exist?

### `waitFor()` — When Synchronous Timing With Dynamic Content Is Your Priority

In scenarios where content loads asynchronously (AJAX responses, lazy rendering, SPA route transitions), calling `Selector.query()` too early returns `null` because the element doesn't exist yet. `waitFor()` elegantly handles this timing gap:

```javascript
// ❌ Race condition — might run before content renders
await fetch('/api/load-user');
const profile = Selector.query('.user-profile');  // null! Render hasn't happened yet

// ✅ Wait for it to appear
await fetch('/api/load-user');
const profile = await Selector.waitFor('.user-profile', 5000);  // Guaranteed to exist
```

This approach is **great when you need:**
✅ Safe access to elements that load after an async operation
✅ SPA navigation — waiting for the new page's key element to signal readiness
✅ Modal or dialog content that renders after a trigger action

### `waitForAll()` — When a Minimum Set of Results Must Load Before You Proceed

In scenarios where you need to wait for a collection to reach a certain size (e.g., at least 5 search results, at least 3 list items), `waitForAll()` provides a direct, clean solution:

```javascript
// ❌ No guarantee items exist yet
const items = Selector.queryAll('.list-item');  // Length might be 0

// ✅ Wait until at least 5 items have loaded
const items = await Selector.waitForAll('.list-item', 5, 8000);
// By this point, items.length is guaranteed to be >= 5
items.on('click', handleItemClick);
```

**This method is especially useful when:**
✅ You need to wait for server-rendered or framework-rendered lists
✅ You have a minimum threshold of elements required to initialize
✅ You want to handle the "no results" state cleanly (via catch)

**The Choice Is Yours:**
- Use `waitFor()` when waiting for a single element (e.g., a page header, a key button)
- Use `waitForAll()` when waiting for a group of elements (e.g., list items, search results)
- Always wrap in `try/catch` to handle the timeout gracefully

**Benefits of async waiting:**
✅ Eliminates race conditions with dynamic content
✅ Uses `MutationObserver` internally — no polling or setTimeout hacks
✅ Configurable timeouts per call
✅ Clean promise-based API — works naturally with `async/await`

---

## Mental Model

### `waitFor()` is Like Waiting for a Package Delivery

You ordered something online. You don't know exactly when it will arrive. Instead of checking the door every 5 minutes, you hire someone to watch the door and call you the moment it arrives — or tell you after 10 minutes if it hasn't shown up.

```
You (your code)
     │
     │  "Wait for .submit-btn"
     ▼
[ Selector.waitFor() ]
     │
     │  Sets up a MutationObserver to watch the DOM
     │
     │  Does element exist right now?
     │  ┌───────────────────────────┐
     │  │  YES → Resolve immediately │
     │  └───────────────────────────┘
     │
     │  NOT YET → Watch DOM for changes...
     │
     │  Element appears! → Resolve promise ✨
     │
     └─ OR: Timeout reached → Reject with Error ⚠️
```

---

## How Does It Work?

Both methods use `MutationObserver` internally — the browser's built-in way to watch for DOM changes.

```
await Selector.waitFor('.submit-btn', 5000)
                      │
                      ▼
        Check: Does .submit-btn exist right now?
                      │
          ┌───────────┴───────────┐
          │                       │
        YES                      NO
          │                       │
          ▼                       ▼
  Resolve immediately     Create MutationObserver
  with element            watching document for changes
                                  │
                          DOM changes (nodes added)
                                  │
                          Check: Does .submit-btn exist now?
                                  │
                    ┌─────────────┴──────────────┐
                    │                             │
                   YES                           NO
                    │                             │
                    ▼                             │
          Disconnect observer                     │
          Resolve with element ✨                 │
                                                  │
                                          Timer running...
                                                  │
                                          (timeout ms elapsed)
                                                  │
                                                  ▼
                                    Disconnect observer
                                    Reject with Error ⚠️
```

**For `waitForAll()`** — same flow, but the check is:
"Do at least `minCount` elements matching the selector exist right now?"

---

## Basic Usage

### Step 1: Use Inside an `async` Function

Both methods return Promises, so they must be used with `await` inside an `async` function (or with `.then()` chaining).

```javascript
// ✅ Correct — inside async function
async function initialize() {
  const header = await Selector.waitFor('.page-header');
  header.classList.add('ready');
}

// ✅ Also correct — .then() chaining
Selector.waitFor('.page-header').then(header => {
  header.classList.add('ready');
});
```

---

### Step 2: Always Use `try/catch`

If the element never appears within the timeout, the promise rejects with an `Error`. Unhandled rejections cause warnings or errors in the console — always handle them:

```javascript
async function loadContent() {
  try {
    const content = await Selector.waitFor('.content-area', 8000);
    initializeContent(content);
  } catch (error) {
    // Element didn't appear within 8 seconds
    console.error('Content never loaded:', error.message);
    showFallbackContent();
  }
}
```

---

### Step 3: Set Appropriate Timeouts

The default timeout is 10 seconds (10000ms). Set it based on how long the operation realistically takes:

```javascript
// Very fast — local JS rendering
const elem = await Selector.waitFor('.instant-render', 500);

// Normal — standard AJAX call
const data = await Selector.waitForAll('.result-item', 1, 5000);

// Slow — heavy server-side render or slow network
const heavy = await Selector.waitFor('.heavy-content', 30000);
```

---

## Deep Dive: `Selector.waitFor()`

### Example 1: After an API Fetch

```javascript
async function loadUserProfile(userId) {
  // Show loading indicator
  Elements.profileLoader.classList.remove('hidden');

  try {
    // Trigger data fetch — this updates the DOM when complete
    await fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => renderUserProfile(data));  // renderUserProfile inserts DOM

    // Wait for the profile card to appear
    const profile = await Selector.waitFor('.user-profile-card', 6000);

    // Now it's safe to work with it
    profile.classList.add('fade-in');
    console.log('Profile loaded:', profile.dataset.userId);

  } catch (error) {
    console.error('Failed to load profile:', error.message);
    Elements.profileError.classList.remove('hidden');

  } finally {
    Elements.profileLoader.classList.add('hidden');
  }
}
```

---

### Example 2: SPA Route Transition

```javascript
async function navigateTo(route) {
  // Start navigation
  await router.push(route);

  try {
    // Wait for the new page's main element to signal it's ready
    const mainContent = await Selector.waitFor('[data-page="' + route + '"]', 5000);

    console.log('Page ready:', route);

    // Initialize page-specific interactions
    initializePage(mainContent, route);

    // Update page title
    const title = Selector.Scoped.within(mainContent, 'h1.page-title');
    if (title) document.title = title.textContent;

  } catch (error) {
    console.error('Page failed to load:', route);
    navigateTo('/error');
  }
}
```

---

### Example 3: Wait for Modal to Open

```javascript
async function openAndSetupModal(modalId, data) {
  // Trigger the modal open (might have an animation)
  triggerModalOpen(modalId);

  try {
    // Wait for modal to be visible (has both ID and .visible class)
    const modal = await Selector.waitFor(`#${modalId}.visible`, 2000);

    // Modal is now open and visible — safe to interact with its contents
    const nameField = Selector.Scoped.within(modal, 'input[name="name"]');
    const emailField = Selector.Scoped.within(modal, 'input[name="email"]');

    if (nameField)  nameField.value = data.name;
    if (emailField) emailField.value = data.email;

    // Focus the first input
    const firstInput = Selector.Scoped.within(modal, 'input');
    firstInput?.focus();

  } catch (error) {
    console.error('Modal failed to open:', modalId);
  }
}
```

---

### Example 4: Graceful Degradation

```javascript
async function initializeEnhancedFeature() {
  try {
    // Try to load the enhanced component (3s timeout)
    const enhancedWidget = await Selector.waitFor('.enhanced-widget', 3000);

    // Enhanced version is available — initialize it
    initializeEnhancedWidget(enhancedWidget);
    console.log('Enhanced widget loaded');

  } catch (error) {
    // Enhanced version didn't load — fall back to basic
    console.log('Enhanced widget not available, using basic version');

    const basicWidget = Selector.query('.basic-widget');
    if (basicWidget) {
      initializeBasicWidget(basicWidget);
    }
  }
}
```

---

## Deep Dive: `Selector.waitForAll()`

### Example 1: Wait for a List to Populate

```javascript
async function loadProductList() {
  Elements.listLoader.classList.remove('hidden');

  try {
    // Fetch products — updates DOM when response arrives
    await fetchProducts();

    // Wait until at least 6 product cards exist (15s timeout)
    const products = await Selector.waitForAll('.product-card', 6, 15000);

    console.log(`Loaded ${products.length} products`);

    // Set up all product cards at once
    products
      .addClass('loaded')
      .on('click', handleProductClick)
      .on('mouseenter', showProductPreview);

    // Update count display
    Elements.productCount.textContent = `${products.length} products`;

  } catch (error) {
    console.error('Products failed to load');
    Elements.emptyState.classList.remove('hidden');

  } finally {
    Elements.listLoader.classList.add('hidden');
  }
}
```

---

### Example 2: Search Results

```javascript
async function performSearch(query) {
  // Clear old results
  const resultsContainer = Elements.searchResults;
  resultsContainer.innerHTML = '';

  // Show searching state
  Elements.searchSpinner.classList.remove('hidden');

  try {
    // Trigger search API
    await searchAPI(query);

    // Wait for at least 1 result (5s timeout)
    const results = await Selector.waitForAll('.search-result', 1, 5000);

    console.log(`Found ${results.length} results for "${query}"`);

    // Setup result interactions
    results.on('click', handleResultClick);

    // Update UI
    Elements.resultCount.textContent = `${results.length} results`;
    Elements.noResultsMsg.classList.add('hidden');

  } catch (error) {
    // No results or timeout
    console.log(`No results found for "${query}"`);
    Elements.noResultsMsg.classList.remove('hidden');
    Elements.resultCount.textContent = '0 results';

  } finally {
    Elements.searchSpinner.classList.add('hidden');
  }
}
```

---

### Example 3: Progressive Gallery Load

```javascript
async function loadGallery() {
  try {
    // Request first batch of images
    await loadImageBatch(1);

    // Wait for first batch minimum (20 images)
    const initialImages = await Selector.waitForAll('.gallery-image', 20, 12000);

    console.log(`First batch: ${initialImages.length} images`);

    // Setup lazy loading for all images
    initialImages.forEach(img => {
      img.loading = 'lazy';
      img.classList.add('lazy-ready');
    });

    // Set up intersection observer for infinite scroll
    setupInfiniteScroll();

  } catch (error) {
    console.warn('Gallery load timeout — showing available images');

    // Show whatever loaded
    const partial = Selector.queryAll('.gallery-image');
    if (!partial.isEmpty()) {
      console.log(`Showing ${partial.length} partial results`);
      partial.addClass('loaded');
    } else {
      Elements.galleryError.classList.remove('hidden');
    }
  }
}
```

---

### Example 4: Multiple Elements in Parallel

```javascript
async function initializePage() {
  try {
    // Wait for multiple different elements in parallel — all must succeed
    const [header, nav, contentSections] = await Promise.all([
      Selector.waitFor('.page-header', 5000),
      Selector.waitFor('.main-nav', 5000),
      Selector.waitForAll('.content-section', 3, 8000)
    ]);

    console.log('All page elements loaded');
    console.log(`${contentSections.length} content sections ready`);

    // Initialize each part
    setupHeader(header);
    setupNavigation(nav);

    contentSections.addClass('visible').on('scroll', trackScrollDepth);

  } catch (error) {
    console.error('Page initialization failed:', error.message);
    showErrorPage('One or more required page elements failed to load.');
  }
}
```

---

## Timeout Strategies

### Understanding Timeouts

The timeout is how long (in milliseconds) `waitFor` / `waitForAll` will wait before giving up and throwing an error.

```
Timeline:
─────────────────────────────────────────────────────────────
  t=0ms     t=500ms   t=2000ms   t=5000ms (timeout)
    │           │          │           │
  Start      Check      Element      Error
  watching    DOM       Appears!    thrown if
             again       ✨         not found
```

### Choosing the Right Timeout

```javascript
// Immediate renders (JS-only, no network)
const elem = await Selector.waitFor('.js-rendered', 500);

// Fast AJAX (~200–800ms typical)
const data = await Selector.waitFor('.ajax-content', 3000);

// Slower API calls or heavy rendering
const list = await Selector.waitForAll('.list-item', 1, 10000);

// Very slow operations (uploads, heavy processing)
const result = await Selector.waitFor('.upload-complete', 60000);
```

### Timeout Per Environment

```javascript
const TIMEOUTS = {
  development: 30000,  // Slower local server, more forgiving
  test:        5000,   // Fast tests, fail early
  production:  10000   // Production standard
};

const timeout = TIMEOUTS[process.env.NODE_ENV] ?? 10000;
const content = await Selector.waitFor('.page-content', timeout);
```

---

## Real-World Patterns

### Pattern 1: Loading Manager

```javascript
class ContentLoader {
  constructor() {
    this.timeouts = {
      instant: 500,
      fast:    3000,
      normal:  10000,
      slow:    30000
    };
  }

  async waitForOne(selector, speed = 'normal') {
    const ms = this.timeouts[speed] ?? this.timeouts.normal;

    try {
      return await Selector.waitFor(selector, ms);
    } catch (err) {
      console.error(`[ContentLoader] Timeout (${speed}): "${selector}"`);
      throw err;
    }
  }

  async waitForMany(selector, minCount = 1, speed = 'normal') {
    const ms = this.timeouts[speed] ?? this.timeouts.normal;

    try {
      return await Selector.waitForAll(selector, minCount, ms);
    } catch (err) {
      console.error(`[ContentLoader] Timeout (${speed}): "${selector}" (min ${minCount})`);
      throw err;
    }
  }
}

const loader = new ContentLoader();

// Usage
const btn = await loader.waitForOne('.submit-btn', 'fast');
const items = await loader.waitForMany('.list-item', 5, 'slow');
```

---

### Pattern 2: Retry with Fallback

```javascript
async function waitWithRetry(selector, maxRetries = 3, timeout = 4000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[waitWithRetry] Attempt ${attempt}/${maxRetries}: "${selector}"`);
      return await Selector.waitFor(selector, timeout);

    } catch (err) {
      if (attempt === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts: "${selector}"`);
      }

      console.warn(`[waitWithRetry] Attempt ${attempt} failed. Retrying in 1s...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Usage
try {
  const element = await waitWithRetry('.dynamic-content', 3, 3000);
  initialize(element);
} catch (error) {
  showError(error.message);
}
```

---

### Pattern 3: SPA Page Lifecycle

```javascript
class SPANavigator {
  async navigateTo(route, options = {}) {
    const startTime = Date.now();

    // Show transition
    Elements.pageTransition.classList.add('active');

    try {
      // Execute the route change
      await router.navigate(route);

      // Wait for the new page's ready signal
      const pageRoot = await Selector.waitFor(
        `[data-route="${route}"][data-status="ready"]`,
        options.timeout ?? 8000
      );

      const loadTime = Date.now() - startTime;
      console.log(`Navigation to "${route}" completed in ${loadTime}ms`);

      // Run page initializer
      if (options.onLoad) {
        await options.onLoad(pageRoot);
      }

      return pageRoot;

    } catch (error) {
      console.error(`Navigation to "${route}" failed:`, error.message);
      this.showNavigationError(route);
      throw error;

    } finally {
      Elements.pageTransition.classList.remove('active');
    }
  }

  showNavigationError(route) {
    Elements.errorMessage.textContent = `Failed to load page: ${route}`;
    Elements.errorMessage.classList.remove('hidden');
  }
}

// Usage
const navigator = new SPANavigator();

await navigator.navigateTo('/dashboard', {
  timeout: 10000,
  onLoad: async (page) => {
    const widgets = await Selector.waitForAll('.dashboard-widget', 3, 5000);
    widgets.addClass('initialized');
  }
});
```

---

## Best Practices

### ✅ DO: Use for Truly Dynamic Content

```javascript
// Good — content genuinely loads after async operation
async function afterAPICall() {
  await fetchData();
  const content = await Selector.waitFor('.api-content', 8000);
  renderContent(content);
}
```

### ✅ DO: Always Handle the Timeout Error

```javascript
// Good — graceful error handling
try {
  const modal = await Selector.waitFor('.confirm-modal.visible', 3000);
  setupModal(modal);
} catch (error) {
  console.error('Modal did not open in time');
  fallbackAction();
}
```

### ✅ DO: Use `Promise.all` for Parallel Waits

```javascript
// Good — wait for multiple elements simultaneously
try {
  const [header, sidebar, main] = await Promise.all([
    Selector.waitFor('.header', 5000),
    Selector.waitFor('.sidebar', 5000),
    Selector.waitForAll('.main-section', 2, 5000)
  ]);
  initializePage(header, sidebar, main);
} catch (error) {
  showLoadError();
}
```

### ✅ DO: Set Realistic Timeouts

```javascript
// Good — timeout based on actual operation speed
const fastLoad = await Selector.waitFor('.instant', 1000);    // Local JS: 1s
const apiLoad  = await Selector.waitForAll('.result', 1, 8000); // API call: 8s
```

---

### ❌ DON'T: Use for Static Content

```javascript
// Bad — element is in the initial HTML, no need to wait
const header = await Selector.waitFor('.page-header');

// Good — direct query
const header = Selector.query('.page-header');
```

### ❌ DON'T: Use Extremely Long Timeouts Without Reason

```javascript
// Bad — effectively "wait forever"
const elem = await Selector.waitFor('.elem', 999999999);

// Good — reasonable max wait
const elem = await Selector.waitFor('.elem', 30000);
```

### ❌ DON'T: Skip Error Handling

```javascript
// Bad — unhandled rejection if timeout
const items = await Selector.waitForAll('.item', 5);  // Will crash if not found

// Good — always handle
try {
  const items = await Selector.waitForAll('.item', 5, 8000);
  process(items);
} catch {
  showEmptyState();
}
```

### ❌ DON'T: Use Inside Tight Loops

```javascript
// Bad — waiting on every iteration is very slow
for (const id of ids) {
  const elem = await Selector.waitFor(`[data-id="${id}"]`);  // Slow!
  process(elem);
}

// Good — wait for all at once, then process
const allElems = await Selector.waitForAll('[data-loaded]', ids.length, 10000);
allElems.forEach(elem => process(elem));
```

---

## Common Mistakes and Fixes

### Mistake 1: Awaiting Outside `async` Function

```javascript
// ❌ SyntaxError — await outside async
const btn = await Selector.waitFor('.btn');  // ERROR at top level (in non-module context)

// ✅ Wrap in async function
async function init() {
  const btn = await Selector.waitFor('.btn');
}
init();

// ✅ Or use IIFE
(async () => {
  const btn = await Selector.waitFor('.btn');
})();
```

### Mistake 2: Not Checking `waitForAll()` Min Count Reality

```javascript
// ❌ waitForAll resolves when minCount is met — there may be MORE elements
const items = await Selector.waitForAll('.item', 5);
// items.length might be 8, 12, or more — not exactly 5
// This is correct behavior — it means "at least 5"

// ✅ Use items.length after the fact to know the actual count
const items = await Selector.waitForAll('.item', 5);
console.log(`Got ${items.length} items`);  // Could be 5 or more
```

### Mistake 3: Race Condition with Immediate Re-query

```javascript
// ❌ Re-querying immediately might return the stale cached version
const container = await Selector.waitFor('.container');
const items = Selector.queryAll('.item');  // Might be cached from before content loaded

// ✅ Use scoped query on the fresh container
const container = await Selector.waitFor('.container');
const items = Selector.Scoped.withinAll(container, '.item');  // Fresh, scoped query
```

---

## Key Takeaways

1. **`waitFor(selector, timeout?)`** — Returns a Promise resolving with a single element. Use for one key element that signals page readiness.

2. **`waitForAll(selector, minCount?, timeout?)`** — Returns a Promise resolving with an enhanced collection. Resolves when at least `minCount` elements are found.

3. **Always use `try/catch`** — Both methods reject if the timeout expires. Unhandled rejections cause warnings or crashes.

4. **Use inside `async` functions** — Both methods require `await` (or `.then()`).

5. **Set realistic timeouts** — Match the timeout to the actual operation speed: fast for local JS, longer for API calls.

6. **Use for truly dynamic content only** — For elements in the initial HTML, use `Selector.query()` or `Selector.queryAll()` directly.

7. **Use `Promise.all()` for parallel waits** — Waiting for multiple elements simultaneously is faster than sequential awaits.

8. **`MutationObserver` under the hood** — No polling loops. The methods watch for actual DOM changes and respond immediately when elements appear.