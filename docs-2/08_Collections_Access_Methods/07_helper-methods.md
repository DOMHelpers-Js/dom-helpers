[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Helper Methods — Advanced Features

## Quick Start (30 Seconds)

```javascript
// Check cache performance
const stats = Collections.stats();
console.log(`Cache hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
// Output: "Cache hit rate: 87.3%"

// Clear cache after major DOM changes
Collections.clear();

// Wait for dynamically loaded elements
const items = await Collections.waitFor('class', 'item', 5);
console.log(`${items.length} items loaded`);

// Configure behavior
Collections.configure({ enableLogging: true });

// Get multiple collections at once
const collections = Collections.getMultiple([
  { type: 'class', value: 'btn' },
  { type: 'class', value: 'card' },
  { type: 'tag', value: 'input' }
]);
```

Advanced tools for cache management, diagnostics, and working with dynamic content.

---

## What Are Helper Methods?

Helper methods are **management-level tools** for the Collections system itself — not for the elements inside a collection, but for the system that manages collections.

Think of them in two groups:

**Group 1 — Cache Management:**
- `stats()` — See how the cache is performing
- `clear()` — Reset the cache manually
- `destroy()` — Full cleanup and shutdown
- `isCached()` — Check if something is currently cached

**Group 2 — Advanced Access:**
- `getMultiple()` — Fetch several collections at once
- `waitFor()` — Wait for elements that don't exist yet
- `configure()` — Customize how Collections behaves

---

## Syntax Reference

```javascript
// Called on the Collections object itself (not on a collection)
Collections.stats()
Collections.clear()
Collections.destroy()
Collections.isCached('class', 'btn')           // or 'tag', 'name'
Collections.getMultiple([                       // Array of requests
  { type: 'class', value: 'btn' },
  { type: 'tag', value: 'input' }
])
await Collections.waitFor('class', 'item')      // Async
await Collections.waitFor('class', 'item', 5)   // Wait for at least 5
await Collections.waitFor('class', 'item', 5, 10000)  // With timeout
Collections.configure({
  enableLogging: false,
  autoCleanup: true,
  cleanupInterval: 30000,
  maxCacheSize: 1000
})
```

---

## Why These Methods Exist?

### When You Need to Look Under the Hood

The Collections system is mostly automatic — it caches, auto-invalidates, and stays out of your way. But real applications have situations where you need more control:

- **Dynamic content**: A SPA loads new page content via AJAX. The cache has stale entries. You need to clear it.
- **Unknown timing**: An AJAX call populates the page but you don't know exactly when. You need to wait for the elements.
- **Debugging**: Your app is slow. You want to check if the cache is working efficiently.
- **Initialization**: You need several collections ready before your app starts. Fetching them one at a time is verbose.
- **Development mode**: You want verbose logging during development, but not in production.

Each helper method addresses one of these real-world needs.

---

## Complete Method Overview

| Method | Purpose | When to Use |
|--------|---------|-------------|
| `stats()` | Get cache performance data | Performance monitoring, debugging |
| `clear()` | Clear all cached collections | After major DOM changes, SPA navigation |
| `destroy()` | Clean up all resources | App shutdown, lifecycle cleanup |
| `isCached(type, value)` | Check if a specific collection is cached | Debugging, conditional logic |
| `getMultiple(requests)` | Fetch multiple collections at once | Page initialization, batch setup |
| `waitFor(type, value, min, timeout)` | Wait for dynamic elements to appear | After AJAX loads, dynamic content |
| `configure(options)` | Set configuration options | App startup, environment-specific setup |

---

## Group 1: Cache Management Methods

### 1. Collections.stats() — Get Cache Statistics

Returns an object with detailed information about how the cache is performing. Useful for monitoring and debugging.

#### Syntax

```javascript
const stats = Collections.stats()
```

**Returns:** Object with cache statistics

---

#### The Stats Object

```javascript
const stats = Collections.stats();

console.log(stats);
// Output:
// {
//   hits: 245,          // How many times cache returned a stored result
//   misses: 38,         // How many times cache had to query the DOM
//   cacheSize: 15,      // How many collections are currently stored
//   hitRate: 0.866,     // Ratio: hits / (hits + misses) — 86.6% here
//   uptime: 120000,     // Milliseconds since last cleanup
//   lastCleanup: 1234567890  // Timestamp of last cleanup
// }
```

**What these numbers mean:**
- `hits` — Good! Cache returned instantly without touching the DOM
- `misses` — First time accessing something, or cache was cleared
- `hitRate` — Above 0.8 (80%) is excellent; below 0.5 (50%) may indicate cache issues
- `cacheSize` — How many different collections are currently stored
- `uptime` — Time since the cache last cleaned up old entries

---

#### Basic Usage

```javascript
const stats = Collections.stats();

// Print a human-readable summary
console.log(`
Collections Cache Report:
  Hit rate:    ${(stats.hitRate * 100).toFixed(1)}%
  Cache hits:  ${stats.hits}
  Cache misses: ${stats.misses}
  Cached:      ${stats.cacheSize} collections
  Uptime:      ${(stats.uptime / 1000).toFixed(0)} seconds
`);
```

---

#### Examples

**Example 1: Performance Monitor**

```javascript
function monitorCachePerformance() {
  const stats = Collections.stats();
  const total = stats.hits + stats.misses;

  const report = {
    hitRate: `${(stats.hitRate * 100).toFixed(1)}%`,
    efficiency: stats.hitRate > 0.8 ? '✅ Excellent' :
                stats.hitRate > 0.5 ? '⚠️ Good' : '❌ Poor',
    totalAccesses: total,
    cachedCollections: stats.cacheSize,
    recommendation: stats.hitRate < 0.5
      ? 'Consider storing collection references in variables'
      : 'Cache is working well'
  };

  console.table(report);
  return report;
}

// Run in development
if (process.env.NODE_ENV === 'development') {
  setInterval(monitorCachePerformance, 60000); // Every 60 seconds
}
```

**What's happening:** We compute a rich report from the raw stats. The `efficiency` field gives a human-readable rating. The `recommendation` helps diagnose if hit rate is low.

---

**Example 2: Debug Output**

```javascript
function debugCollectionsCache() {
  const stats = Collections.stats();

  console.group('Collections Cache Diagnostics');
  console.log('Hit Rate:', `${(stats.hitRate * 100).toFixed(1)}%`);
  console.log('Cache Hits:', stats.hits);
  console.log('Cache Misses:', stats.misses);
  console.log('Cached Collections:', stats.cacheSize);
  console.log('Uptime:', `${(stats.uptime / 1000).toFixed(1)} seconds`);

  if (stats.hitRate < 0.5) {
    console.warn('Low hit rate — are you storing collection references?');
  }
  console.groupEnd();
}
```

---

### 2. Collections.clear() — Clear the Cache

Manually clears all cached collections. The next access for each collection will re-query the DOM.

#### Syntax

```javascript
Collections.clear()
```

**Returns:** `undefined`

---

#### When to Clear Cache

```
✅ Clear cache when:
  - Major DOM restructuring (innerHTML replaced, large content reload)
  - SPA navigation: user moved to a new "page" and DOM changed completely
  - After running a test that modified DOM structure
  - After calling document.body.innerHTML = newHTML

✅ Usually NOT needed:
  - Cache auto-invalidates on DOM mutations (via MutationObserver)
  - For small DOM changes like adding/removing a few elements
  - Just to "be safe" — unnecessary clears hurt performance
```

---

#### Basic Usage

```javascript
// Clear all cached collections
Collections.clear();
console.log('Cache cleared');

// The next access for each collection will re-query the DOM
const buttons = Collections.ClassName.btn; // Fresh DOM query
```

---

#### Examples

**Example 1: After SPA Navigation**

```javascript
async function navigateToPage(route) {
  console.log('Navigating to:', route);

  // Load new page content (replaces current DOM)
  const html = await fetchPageContent(route);
  document.getElementById('main-content').innerHTML = html;

  // Cache is now stale — DOM structure changed completely
  Collections.clear();
  console.log('Cache cleared after navigation');

  // Now re-initialize the new page
  initializePage(route);
}
```

**What's happening:** After replacing large sections of the DOM with new HTML, the cached collections are stale — they reference old elements that no longer exist. Clearing the cache ensures the next access gets fresh results.

---

**Example 2: After Dynamic Content Reload**

```javascript
async function reloadProductList() {
  const container = Elements.productContainer;

  // Show loading state
  container.innerHTML = '<div class="loading">Loading products...</div>';

  try {
    // Fetch and render new content
    const products = await fetchProducts();
    container.innerHTML = renderProducts(products);

    // Clear cache — old '.product-card' collection is now stale
    Collections.clear();

    // Access fresh collections
    const cards = Collections.ClassName['product-card'];
    const buttons = Collections.ClassName['add-to-cart'];

    // Set up interactions
    cards.on('click', handleCardClick);
    buttons.on('click', handleAddToCart);

    console.log(`Loaded ${cards.length} products`);
  } catch (error) {
    container.innerHTML = '<div class="error">Failed to load products</div>';
    console.error('Product load failed:', error);
  }
}
```

---

**Example 3: Manual Refresh**

```javascript
function refreshCollections() {
  // Clear and immediately re-warm the cache with fresh data
  Collections.clear();

  // Access the collections we know we'll need soon
  const buttons = Collections.ClassName.btn;
  const cards = Collections.ClassName.card;
  const inputs = Collections.TagName.input;

  console.log('Collections refreshed:');
  console.log(`  ${buttons.length} buttons`);
  console.log(`  ${cards.length} cards`);
  console.log(`  ${inputs.length} inputs`);
}
```

---

### 3. Collections.destroy() — Clean Up All Resources

Performs a complete cleanup of the Collections helper — clears all cached data, removes the `MutationObserver`, clears timers, and resets statistics. Use this for application shutdown or when the Collections helper is no longer needed.

#### Syntax

```javascript
Collections.destroy()
```

**Returns:** `undefined`

---

#### What destroy() Does

```
1. Clears all cached collections from memory
2. Disconnects the MutationObserver (no more DOM change watching)
3. Clears the periodic cleanup timer
4. Resets all statistics (hits, misses, hitRate back to 0)
5. Prepares for garbage collection
```

After calling `destroy()`, the Collections helper is in a clean, uninitialized state. You'd need to re-initialize it to use it again (or simply access a collection, which will restart the system).

---

#### Basic Usage

```javascript
// Shut down Collections when done
Collections.destroy();
console.log('Collections helper destroyed');
```

---

#### Examples

**Example 1: Application Shutdown**

```javascript
class Application {
  initialize() {
    // Configure Collections for this app
    Collections.configure({
      enableLogging: process.env.NODE_ENV === 'development',
      cleanupInterval: 30000
    });

    // Set up collections
    this.buttons = Collections.ClassName.btn;
    this.cards = Collections.ClassName.card;

    // Register shutdown handler
    window.addEventListener('beforeunload', () => this.shutdown());

    console.log('Application initialized');
  }

  shutdown() {
    // Log final stats
    const stats = Collections.stats();
    console.log(`Final cache hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);

    // Clean up Collections resources
    Collections.destroy();

    console.log('Application shut down');
  }
}

const app = new Application();
app.initialize();
```

---

**Example 2: Component Lifecycle**

```javascript
class Dashboard {
  mount() {
    this.initialize();
    console.log('Dashboard mounted');
  }

  initialize() {
    this.items = Collections.ClassName['dashboard-item'];
    this.clickHandler = this.handleItemClick.bind(this);

    this.items.on('click', this.clickHandler);
    this.items.addClass('initialized');
  }

  handleItemClick(e) {
    const item = e.currentTarget;
    console.log('Dashboard item clicked:', item.dataset.id);
  }

  unmount() {
    // Remove event listeners to prevent memory leaks
    if (this.items) {
      this.items.off('click', this.clickHandler);
    }

    // If this is the last component, destroy Collections
    Collections.destroy();

    console.log('Dashboard unmounted and cleaned up');
  }
}
```

---

### 4. Collections.isCached(type, value) — Check Cache Status

Returns `true` if a specific collection is currently in the cache, `false` if it's not cached and will require a DOM query on next access.

#### Syntax

```javascript
Collections.isCached('class', 'btn')    // By class
Collections.isCached('tag', 'input')    // By tag
Collections.isCached('name', 'email')   // By name
```

**Parameters:**
- `type` (string) — `'class'`, `'tag'`, or `'name'`
- `value` (string) — The class name, tag name, or name attribute

**Returns:** `boolean`

---

#### Basic Usage

```javascript
// Before accessing
console.log(Collections.isCached('class', 'btn')); // false

// After accessing
const buttons = Collections.ClassName.btn;
console.log(Collections.isCached('class', 'btn')); // true

// After clearing
Collections.clear();
console.log(Collections.isCached('class', 'btn')); // false again
```

---

#### Examples

**Example 1: Cache Debugging**

```javascript
function debugCacheState() {
  const toCheck = [
    { type: 'class', value: 'btn' },
    { type: 'class', value: 'card' },
    { type: 'class', value: 'item' },
    { type: 'tag', value: 'input' }
  ];

  console.group('Cache State');
  toCheck.forEach(({ type, value }) => {
    const cached = Collections.isCached(type, value);
    console.log(`  ${type}:${value} → ${cached ? '✅ cached' : '❌ not cached'}`);
  });
  console.groupEnd();
}

// Call before and after operations to see cache behavior
debugCacheState();

const buttons = Collections.ClassName.btn;
const cards = Collections.ClassName.card;

debugCacheState();
// Shows btn and card as cached, others as not cached
```

---

**Example 2: Conditional Access**

```javascript
function getButtonsOptimized() {
  // Log whether this will be a cache hit or miss
  const willBeCacheHit = Collections.isCached('class', 'btn');

  if (!willBeCacheHit) {
    console.log('Cache miss — querying DOM for buttons...');
  }

  const buttons = Collections.ClassName.btn;

  console.log(`Got ${buttons.length} buttons (${willBeCacheHit ? 'from cache' : 'fresh query'})`);
  return buttons;
}
```

---

## Group 2: Advanced Access Methods

### 5. Collections.getMultiple(requests) — Get Multiple Collections at Once

Fetches multiple collections in a single call. Useful for page initialization when you need several collections upfront.

#### Syntax

```javascript
const collections = Collections.getMultiple([
  { type: 'class', value: 'btn' },
  { type: 'tag', value: 'input' },
  { type: 'name', value: 'email' }
])
```

**Parameters:**
- `requests` (array) — Array of objects, each with `type` and `value`
  - `type`: `'class'`, `'tag'`, or `'name'`
  - `value`: the class name, tag name, or name attribute

**Returns:** Object where keys are `'type:value'` strings, values are the collections

---

#### Return Format

```javascript
const result = Collections.getMultiple([
  { type: 'class', value: 'btn' },
  { type: 'tag', value: 'p' },
  { type: 'name', value: 'email' }
]);

// result looks like:
// {
//   'class:btn':   [button, button, button],
//   'tag:p':       [p, p, p, p],
//   'name:email':  [input]
// }

// Access individual collections:
const buttons = result['class:btn'];
const paragraphs = result['tag:p'];
const emailInputs = result['name:email'];
```

---

#### Basic Usage

```javascript
// Fetch multiple collections at once
const collections = Collections.getMultiple([
  { type: 'class', value: 'btn' },
  { type: 'class', value: 'card' },
  { type: 'tag', value: 'input' }
]);

// Use them
collections['class:btn'].on('click', handleClick);
collections['class:card'].setStyle({ transition: 'all 0.3s' });
collections['tag:input'].setAttribute('autocomplete', 'off');
```

---

#### Examples

**Example 1: Page Initialization**

```javascript
function initializePage() {
  // Fetch all collections needed for this page in one call
  const collections = Collections.getMultiple([
    { type: 'class', value: 'nav-link' },
    { type: 'class', value: 'card' },
    { type: 'class', value: 'btn' },
    { type: 'tag', value: 'input' },
    { type: 'tag', value: 'img' }
  ]);

  // Set up navigation
  const navLinks = collections['class:nav-link'];
  navLinks.on('click', function() {
    navLinks.removeClass('active');
    this.classList.add('active');
  });

  // Set up cards
  const cards = collections['class:card'];
  cards.setStyle({ cursor: 'pointer', transition: 'transform 0.2s' })
       .on('mouseenter', function() { this.style.transform = 'translateY(-4px)'; })
       .on('mouseleave', function() { this.style.transform = 'translateY(0)'; });

  // Set up buttons
  collections['class:btn']
    .addClass('initialized')
    .on('click', handleButtonClick);

  // Set up inputs
  collections['tag:input']
    .on('input', handleInputChange)
    .on('blur', validateInput);

  // Lazy load images
  collections['tag:img'].setAttribute('loading', 'lazy');

  console.log('Page initialized:', {
    navLinks: navLinks.length,
    cards: cards.length,
    buttons: collections['class:btn'].length,
    inputs: collections['tag:input'].length,
    images: collections['tag:img'].length
  });
}

initializePage();
```

---

**Example 2: Bulk Processing Report**

```javascript
function generatePageReport() {
  const collections = Collections.getMultiple([
    { type: 'class', value: 'error' },
    { type: 'class', value: 'warning' },
    { type: 'class', value: 'success' },
    { type: 'tag', value: 'a' },
    { type: 'tag', value: 'img' }
  ]);

  const report = {
    errors:   collections['class:error'].length,
    warnings: collections['class:warning'].length,
    successes: collections['class:success'].length,
    totalLinks: collections['tag:a'].length,
    externalLinks: collections['tag:a'].filter(a => {
      const href = a.getAttribute('href') || '';
      return href.startsWith('http');
    }).length,
    imagesWithoutAlt: collections['tag:img'].filter(img =>
      !img.getAttribute('alt')
    ).length
  };

  console.table(report);
  return report;
}

const report = generatePageReport();
if (report.imagesWithoutAlt > 0) {
  console.warn(`Accessibility issue: ${report.imagesWithoutAlt} images missing alt text`);
}
```

---

### 6. Collections.waitFor() — Wait for Dynamic Elements

Returns a Promise that resolves when the specified elements appear in the DOM. Useful when content is loaded asynchronously (AJAX, lazy loading, etc.) and you need to wait for it before initializing.

#### Syntax

```javascript
// Minimum 1 element (default), timeout 10 seconds (default)
const collection = await Collections.waitFor('class', 'item')

// Wait for at least 5 elements
const collection = await Collections.waitFor('class', 'item', 5)

// Custom timeout (5 seconds)
const collection = await Collections.waitFor('class', 'item', 1, 5000)
```

**Parameters:**
- `type` (string) — `'class'`, `'tag'`, or `'name'`
- `value` (string) — Class name, tag name, or name attribute
- `minCount` (number, optional) — Minimum elements required (default: 1)
- `timeout` (number, optional) — Milliseconds before timeout error (default: 10000)

**Returns:** `Promise` that resolves with the collection, or rejects on timeout

---

#### How waitFor() Works Internally

```
Collections.waitFor('class', 'item', 5, 10000)
    ↓
Check now: are there 5+ elements with class="item"?
    ↓ No
Set up MutationObserver watching for DOM changes
    ↓
Each time DOM changes, re-check element count
    ↓ 5+ elements found
Resolve Promise with the collection ✅

If 10 seconds pass without finding 5+ elements:
    ↓
Reject Promise with timeout error ❌
```

---

#### Basic Usage

```javascript
async function initAfterLoad() {
  try {
    // Wait for product items to appear (AJAX loaded)
    const items = await Collections.waitFor('class', 'product-item');
    console.log(`${items.length} product items loaded`);

    // Now it's safe to initialize them
    items.on('click', handleProductClick);
    items.setStyle({ transition: 'transform 0.2s' });

  } catch (error) {
    console.error('Products did not load in time:', error.message);
    showErrorMessage('Failed to load products. Please refresh the page.');
  }
}

initAfterLoad();
```

---

#### Examples

**Example 1: After AJAX Content Load**

```javascript
async function loadAndInitializeProducts() {
  // Trigger loading
  showLoadingSpinner();
  await fetchAndRenderProducts(); // Your AJAX call

  // Wait for the rendered items
  try {
    const items = await Collections.waitFor('class', 'product-card', 1, 5000);

    hideLoadingSpinner();
    console.log(`Loaded ${items.length} products`);

    // Initialize all product cards
    items.forEach((card, index) => {
      card.dataset.index = index;
    });

    items.on('click', handleCardClick)
         .setStyle({ cursor: 'pointer' });

  } catch (error) {
    hideLoadingSpinner();
    showError('Products could not be loaded. Please try again.');
    console.error('waitFor timeout:', error);
  }
}
```

---

**Example 2: SPA Route Change**

```javascript
async function navigateTo(route) {
  // Load the new page's HTML
  await loadRoute(route);

  // Wait for critical elements before declaring the page ready
  try {
    const [header, content, footer] = await Promise.all([
      Collections.waitFor('class', 'page-header', 1, 5000),
      Collections.waitFor('class', 'page-content', 1, 5000),
      Collections.waitFor('class', 'page-footer', 1, 5000)
    ]);

    console.log('Page fully loaded:', {
      header: header.length,
      content: content.length,
      footer: footer.length
    });

    // Initialize new page
    initializePage();

  } catch (error) {
    console.error(`Page "${route}" failed to load:`, error.message);
    showErrorPage();
  }
}
```

**What's happening:** We use `Promise.all` to wait for three critical elements simultaneously. If ALL three appear within 5 seconds, the page is initialized. If any one fails to appear, the catch handles it.

---

**Example 3: Progressive Enhancement**

```javascript
async function applyEnhancementsWhenReady() {
  try {
    // Wait for enhanced widgets to load (may be deferred/lazy)
    const widgets = await Collections.waitFor('class', 'widget', 1, 3000);

    console.log(`${widgets.length} widgets found — applying enhancements`);
    widgets.addClass('enhanced').on('click', handleWidgetClick);

  } catch (error) {
    // Widgets didn't load — use basic fallback
    console.log('Widgets not available — using basic version');
    useBasicVersion();
  }
}

// Start the progressive enhancement process
applyEnhancementsWhenReady();
```

---

**Example 4: Wait for Minimum Count**

```javascript
async function waitForAllProducts() {
  try {
    // We know there should be at least 10 products
    const products = await Collections.waitFor('class', 'product', 10, 8000);

    console.log(`All ${products.length} products loaded`);
    renderProductGrid(products);

  } catch (error) {
    // Less than 10 products appeared in 8 seconds
    const existing = Collections.ClassName.product;
    if (!existing.isEmpty()) {
      // Some loaded — use what we have
      console.warn(`Only ${existing.length} products loaded (expected 10+)`);
      renderProductGrid(existing);
    } else {
      showEmptyState();
    }
  }
}
```

---

## Group 3: Configuration

### 7. Collections.configure(options) — Customize Collections Behavior

Configures the Collections helper with custom options. Call this early in your app's lifecycle to set behavior for the entire session.

#### Syntax

```javascript
Collections.configure({
  enableLogging: false,       // Enable debug logging to console
  autoCleanup: true,          // Automatically clean up old cache entries
  cleanupInterval: 30000,     // How often to run cleanup (ms)
  maxCacheSize: 1000,         // Max number of collections to cache
  enableEnhancedSyntax: true  // Enable property access syntax (ClassName.btn)
})
```

**Parameters:** Object with configuration options (all are optional)

**Returns:** `undefined`

---

#### Configuration Options Explained

```
enableLogging (default: false)
  When true, logs cache hits/misses and operations to the console.
  Useful for debugging. Always disable in production.

autoCleanup (default: true)
  When true, the system automatically removes stale cache entries
  on a schedule. Keep this enabled — it prevents memory growth.

cleanupInterval (default: 30000 — 30 seconds)
  How frequently the auto-cleanup runs. Lower in development to
  see cleanup behavior. Higher in production to reduce overhead.

maxCacheSize (default: 1000)
  Maximum number of collections that can be cached simultaneously.
  When this limit is reached, oldest entries are evicted.

enableEnhancedSyntax (default: true)
  Enables the proxy-based property access: Collections.ClassName.btn
  Disable only if your environment doesn't support Proxy.
```

---

#### Basic Usage

```javascript
// Development configuration
if (process.env.NODE_ENV === 'development') {
  Collections.configure({
    enableLogging: true,
    cleanupInterval: 10000  // More frequent cleanup to see behavior
  });
}

// Production configuration
if (process.env.NODE_ENV === 'production') {
  Collections.configure({
    enableLogging: false,
    autoCleanup: true,
    cleanupInterval: 60000, // Less frequent — lower overhead
    maxCacheSize: 500
  });
}
```

---

#### Examples

**Example 1: Environment-Based Configuration**

```javascript
function setupCollections() {
  const isDev = process.env.NODE_ENV === 'development';

  Collections.configure({
    enableLogging: isDev,
    autoCleanup: true,
    cleanupInterval: isDev ? 10000 : 60000,  // 10s dev, 60s prod
    maxCacheSize: isDev ? 100 : 500           // Smaller in dev for easier debugging
  });

  console.log(`Collections configured for ${isDev ? 'development' : 'production'}`);
}

// Call at app startup
setupCollections();
```

---

**Example 2: Enable Logging During a Debug Session**

```javascript
// When you're debugging a specific issue, enable logging temporarily
function enableDebugMode() {
  Collections.configure({ enableLogging: true });
  console.log('Collections debug mode ON');

  // Now every access is logged:
  const buttons = Collections.ClassName.btn;
  // Console: [Collections] Cache miss: class:btn
  // Console: [Collections] Found 3 elements, caching...

  const buttons2 = Collections.ClassName.btn;
  // Console: [Collections] Cache hit: class:btn
}

function disableDebugMode() {
  Collections.configure({ enableLogging: false });
  console.log('Collections debug mode OFF');
}
```

---

**Example 3: Test Configuration**

```javascript
// In test setup files
function setupCollectionsForTests() {
  Collections.configure({
    enableLogging: false,    // Keep test output clean
    autoCleanup: false,      // Prevent automatic cleanup during tests
    maxCacheSize: 50         // Small cache — tests should be isolated anyway
  });
}

function teardownCollections() {
  Collections.clear(); // Clean between tests
}

// In your test framework
beforeAll(setupCollectionsForTests);
afterEach(teardownCollections);
afterAll(() => Collections.destroy());
```

---

## Real-World Integration Patterns

### Pattern 1: Complete Application Bootstrap

```javascript
class AppBootstrap {
  static async initialize() {
    console.log('Bootstrapping application...');

    // Step 1: Configure based on environment
    const isDev = process.env.NODE_ENV === 'development';
    Collections.configure({
      enableLogging: isDev,
      autoCleanup: true,
      cleanupInterval: isDev ? 15000 : 30000
    });

    // Step 2: Wait for critical DOM elements
    try {
      const critical = await Promise.all([
        Collections.waitFor('class', 'app-header', 1, 5000),
        Collections.waitFor('class', 'main-content', 1, 5000),
        Collections.waitFor('class', 'app-nav', 1, 5000)
      ]);

      console.log('Critical elements loaded:', {
        header: critical[0].length,
        content: critical[1].length,
        nav: critical[2].length
      });

    } catch (error) {
      console.error('Critical element load failed:', error.message);
      throw new Error('App cannot initialize — missing critical elements');
    }

    // Step 3: Pre-warm important collections
    const collections = Collections.getMultiple([
      { type: 'class', value: 'btn' },
      { type: 'class', value: 'nav-link' },
      { type: 'tag', value: 'input' }
    ]);

    console.log('Pre-warmed collections:', {
      buttons: collections['class:btn'].length,
      navLinks: collections['class:nav-link'].length,
      inputs: collections['tag:input'].length
    });

    // Step 4: Log initial stats
    const stats = Collections.stats();
    console.log(`Initial cache: ${stats.cacheSize} collections, hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);

    console.log('Application bootstrapped successfully');
    return true;
  }

  static shutdown() {
    const stats = Collections.stats();
    console.log(`Shutdown stats: ${(stats.hitRate * 100).toFixed(1)}% hit rate over ${stats.hits + stats.misses} accesses`);

    Collections.destroy();
    console.log('Application shutdown complete');
  }
}

// Start app
AppBootstrap.initialize()
  .then(() => startApplication())
  .catch(error => showCriticalError(error));

// Handle page unload
window.addEventListener('beforeunload', AppBootstrap.shutdown);
```

---

### Pattern 2: SPA Navigation Handler

```javascript
class SPANavigator {
  constructor() {
    this.currentRoute = null;
  }

  async navigate(route) {
    console.log(`Navigating to: ${route}`);

    // Step 1: Clean up current page
    this.cleanupCurrentPage();

    // Step 2: Load new content
    await this.loadPageContent(route);

    // Step 3: Clear stale cache
    Collections.clear();
    console.log('Cache cleared for new page');

    // Step 4: Wait for critical page elements
    try {
      await Collections.waitFor('class', 'page-ready', 1, 8000);
      console.log(`Page "${route}" is ready`);

      // Step 5: Initialize new page
      this.initializePage(route);
      this.currentRoute = route;

    } catch (error) {
      console.error(`Page "${route}" failed to initialize:`, error.message);
      this.showNavigationError(route);
    }
  }

  cleanupCurrentPage() {
    // Remove event listeners, clean up state
    console.log('Cleaning up current page...');
  }

  async loadPageContent(route) {
    // Fetch and inject new HTML
    const html = await fetch(`/pages/${route}`).then(r => r.text());
    document.getElementById('app').innerHTML = html;
  }

  initializePage(route) {
    // Set up the new page's collections and interactions
    console.log(`Initializing page: ${route}`);
  }

  showNavigationError(route) {
    Elements.errorMessage.textContent = `Failed to load "${route}"`;
    Elements.errorMessage.style.display = 'block';
  }
}
```

---

## Best Practices

### ✅ Monitor in Development, Disable in Production

```javascript
Collections.configure({
  enableLogging: process.env.NODE_ENV === 'development'
});
```

### ✅ Clear Cache After Major DOM Replacements

```javascript
// After replacing large DOM sections
container.innerHTML = newHTML;
Collections.clear(); // Cache is now stale
```

### ✅ Use waitFor() for Dynamic Content

```javascript
// Wait for content to appear before initializing
try {
  const items = await Collections.waitFor('class', 'item', 1, 8000);
  items.on('click', handler);
} catch (e) {
  showFallback();
}
```

### ✅ Use getMultiple() for Page Initialization

```javascript
// Fetch multiple collections at once — cleaner than sequential access
const cols = Collections.getMultiple([
  { type: 'class', value: 'btn' },
  { type: 'class', value: 'card' }
]);
cols['class:btn'].on('click', handleClick);
cols['class:card'].setStyle({ cursor: 'pointer' });
```

### ❌ Don't Clear Cache Unnecessarily

```javascript
// ❌ Bad — hurts performance, cache auto-updates on small changes
function updateButton() {
  Collections.clear(); // Unnecessary!
  Collections.ClassName.btn.first().textContent = 'Updated';
}

// ✅ Good — just access and use
function updateButton() {
  Collections.ClassName.btn.first().textContent = 'Updated';
}
```

### ❌ Don't Destroy Collections Mid-Application

```javascript
// ❌ Bad — destroying when other code may still use Collections
function hideMenu() {
  Collections.ClassName['menu-item'].addClass('hidden');
  Collections.destroy(); // Wrong — other code uses Collections too!
}

// ✅ Good — destroy only on full app shutdown
window.addEventListener('beforeunload', () => {
  Collections.destroy(); // Appropriate — app is done
});
```

---

## Key Takeaways

1. **stats()** — Monitor cache performance (hitRate, hits, misses, cacheSize)
2. **clear()** — Clear all cached collections (after major DOM changes, SPA navigation)
3. **destroy()** — Full cleanup of Collections resources (app shutdown, testing)
4. **isCached(type, value)** — Check if a specific collection is in cache (debugging)
5. **getMultiple(requests)** — Get several collections in one call (page initialization)
6. **waitFor(type, value, min, timeout)** — Wait for async content to appear in DOM
7. **configure(options)** — Customize logging, cleanup intervals, cache size
8. **Trust the auto-cache** — The system auto-invalidates on DOM changes; manual clearing is rarely needed

---

## What's Next?

You've learned all the Collections methods. Now let's put it all together with best practices, decision guides, and production-ready patterns:

- **Decision tree** — Which method to use when
- **Performance tips** — Getting the most out of the cache
- **Common mistakes** — And how to avoid them
- **Production checklist** — Before you ship

Continue to **Best Practices** →