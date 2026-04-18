[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Safe Access Methods — Elements.get() and Elements.exists()

`Elements.{id}` returns `null` when an element isn't found, and a simple null check usually works great. But there are two situations where you want something more precise:

1. You want a **fallback value** when the element is missing — use `Elements.get(id, fallback)`
2. You only want to **check if an element exists** (yes/no, without accessing it) — use `Elements.exists(id)`

---

## Quick Start (30 Seconds)

```javascript
// Elements.get() — access with a fallback value
const container = Elements.get('customContainer', document.body);
// If 'customContainer' doesn't exist, use document.body instead
container.appendChild(newElement); // Always safe — never null

// Elements.exists() — check if an element is there
if (Elements.exists('premiumFeature')) {
  initializePremiumFeature(); // Only runs if the element exists
}
```

Two clean tools for two specific scenarios — each one saves you from writing extra checking code.

---

## What Are Safe Access Methods?

Both `get()` and `exists()` are built on the same cache and Proxy system as `Elements.{id}`. The difference is in what they return and how you use that return value.

| Method | Returns | Use when |
|--------|---------|----------|
| `Elements.{id}` | Element or `null` | You'll check for null yourself |
| `Elements.get(id, fallback)` | Element or your fallback | You want a default value, not null |
| `Elements.exists(id)` | `true` or `false` | You only need the yes/no answer |

---

## Syntax

```javascript
// Elements.get()
const element = Elements.get(id, fallback);

// Elements.exists()
const doesExist = Elements.exists(id);
```

**Elements.get() parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | ✅ Yes | The element's ID to look up |
| `fallback` | any | ✅ Yes | Value to return if element is not found |

**Returns:** The DOM element if found, otherwise the `fallback` value you provided.

**Elements.exists() parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | ✅ Yes | The element's ID to check |

**Returns:** `true` if the element exists in the DOM, `false` if not.

---

## Why Do These Methods Exist?

### When Elements.{id} Already Works Great

In most cases, `Elements.{id}` with a null check is exactly what you need:

```javascript
// This is perfectly fine — clean and readable
const sidebar = Elements.sidebar;
if (sidebar) {
  initializeSidebar(sidebar);
}
```

This approach is **great when you need**:
✅ Quick, simple access with a manual null check
✅ Full control over what happens when the element is missing
✅ The flexibility to handle null in different ways

### When get() Is a More Direct Approach

In scenarios where you always need *something* to work with — either the element or a sensible default — `Elements.get()` removes the need for the null check entirely:

```javascript
// Without get() — manual null check required
const container = Elements.customContainer;
const targetContainer = container || document.body; // manual fallback

// With get() — fallback is built in
const container = Elements.get('customContainer', document.body);
// One line, no null check needed — container is always usable
```

**Elements.get() is especially useful when:**
✅ You always need *something* to work with (element or fallback)
✅ The fallback is a meaningful default (not just null)
✅ You're writing utility functions that need to be null-safe by design

### When exists() Is the Right Tool

`Elements.exists()` solves a different problem: when you need a clean yes/no answer without accessing the element at all.

```javascript
// Without exists() — access the element just to check
const advancedMenu = Elements.advancedMenu;
if (advancedMenu) {
  loadAdvancedMenuFeatures(); // Don't even need the element — just needed to know if it's there
}

// With exists() — directly expresses the intent
if (Elements.exists('advancedMenu')) {
  loadAdvancedMenuFeatures(); // Much clearer — "does this feature exist on this page?"
}
```

**Elements.exists() is especially useful when:**
✅ You only need to check, not use the element
✅ Feature detection — is a certain feature present on this page?
✅ Validation — does the expected structure exist before proceeding?
✅ Conditional loading — should we load a feature module?

**The Choice is Yours:**
- Use `Elements.{id}` + null check when you want full control
- Use `Elements.get(id, fallback)` when you need a usable default value
- Use `Elements.exists(id)` when you only need the yes/no answer

---

## Mental Model — The "Search with a Backup Plan"

**`Elements.get()`** is like searching for your favorite coffee shop. You check your first choice, but if it's closed, you already know where you'll go instead. You don't end up standing on the street wondering what to do — you have a plan B ready.

**`Elements.exists()`** is like calling ahead to ask "are you open?" before you even leave the house. You get a simple yes or no, and decide what to do from there.

```
Elements.get('preferredShop', fallbackShop)
       ↓
  Is 'preferredShop' in the DOM?
  [YES] → Return the element (your first choice)
  [NO]  → Return fallbackShop (your backup plan)
  Either way, you always have somewhere to go ☕

Elements.exists('preferredShop')
       ↓
  Is 'preferredShop' in the DOM?
  [YES] → Return true
  [NO]  → Return false
  Clean yes/no — decide what to do from there ✅
```

---

## How Does It Work?

Both methods use the same cache and DOM-lookup system as `Elements.{id}`. The only difference is in what they return when the element isn't found.

### Elements.get() — Internals

```
Elements.get('customContainer', document.body)
       ↓
Step 1: Check cache for 'customContainer'
  [HIT]  → Return cached element ⚡
  [MISS] → document.getElementById('customContainer')

Step 2: Was the element found?
  [YES] → Cache it → Attach .update() → Return element
  [NO]  → Return fallback value (document.body)
           ↑ The fallback is NOT cached — it's just returned directly
```

### Elements.exists() — Internals

```
Elements.exists('myFeature')
       ↓
Step 1: Check cache for 'myFeature'
  [HIT]  → Return true (it's in the cache, so it exists) ⚡

  [MISS] → document.getElementById('myFeature')
           [FOUND]     → Cache it → Return true
           [NOT FOUND] → Return false
           (no caching of negatives — if it's added later, we'll find it then)
```

---

## Elements.get() — Basic Usage

### Example 1: Container with Fallback

The classic use case — you prefer a specific container, but you'll use `document.body` if it's not there:

```html
<!-- This exists on some pages, not all -->
<div id="sidebarWidget"></div>
```

```javascript
// Access with fallback — always returns something usable
const container = Elements.get('sidebarWidget', document.body);

// No null check needed — container is guaranteed to be a DOM element
const notification = document.createElement('div');
notification.textContent = 'New notification!';
container.appendChild(notification);

// If 'sidebarWidget' exists → notification goes in the sidebar
// If it doesn't exist     → notification goes in the body
```

---

### Example 2: Configuration Element with Default

Some pages provide configuration in a hidden element; if it's not there, use defaults:

```html
<!-- Optional config element — only on some pages -->
<script id="pageConfig" type="application/json">
  {"theme": "dark", "layout": "wide"}
</script>
```

```javascript
// Try to get the config element — fall back to an empty span
const configEl = Elements.get('pageConfig', null);

// Parse config or use defaults
const config = configEl
  ? JSON.parse(configEl.textContent)
  : { theme: 'light', layout: 'standard' }; // defaults

applyConfiguration(config);
```

---

### Example 3: Form Fields That Might Not Exist

When a form can appear in multiple variants, some with optional fields:

```javascript
// These fields exist in all form variants
const emailInput    = Elements.emailInput;
const submitBtn     = Elements.submitBtn;

if (!emailInput || !submitBtn) return; // Required — stop if missing

// This field only exists in the "business" form variant
// Fall back to null if not present
const companyInput = Elements.get('companyInput', null);

// Set up form submission
submitBtn.addEventListener('click', () => {
  const formData = {
    email:   emailInput.value,
    company: companyInput ? companyInput.value : '' // Safe access
  };

  submitForm(formData);
});
```

---

### Example 4: Fallback Container Hierarchy

Sometimes you want to try several containers in order of preference:

```javascript
// Try each container option in order, fall back to body
function getTargetContainer() {
  // Try: primary container → secondary → app root → body
  return Elements.primaryWidget
      || Elements.get('secondaryWidget', null)
      || Elements.get('appContainer',    null)
      || document.body;
}

const container = getTargetContainer();
container.appendChild(createNotification());
```

---

## Elements.get() — Common Fallback Types

Choose your fallback based on what the calling code expects to receive:

```javascript
// DOM element fallback — when you need to append/modify something
const container = Elements.get('popupContainer', document.body);
container.appendChild(popup); // Always safe

// null fallback — when you'll check the return value
const sidebar = Elements.get('sidebar', null);
if (sidebar) {
  initializeSidebar(sidebar);
}

// Primitive fallbacks — for reading non-element data
const configText  = Elements.get('configScript', { textContent: '{}' });
const placeholder = Elements.get('placeholder',  { innerHTML: '' });
```

---

## Elements.exists() — Basic Usage

### Example 1: Feature Detection

Check if a feature is available on the current page before initializing it:

```javascript
// Only initialize these features if the elements are present
if (Elements.exists('searchBar')) {
  initializeSearch();
}

if (Elements.exists('chatWidget')) {
  loadChatModule();
}

if (Elements.exists('analyticsScript')) {
  initializeAnalytics();
}

// Clean, readable — easy to understand what's being checked
```

---

### Example 2: Page Type Detection

Different pages have different elements — use `exists()` to determine what page you're on:

```javascript
function detectPageType() {
  if (Elements.exists('loginForm'))       return 'login';
  if (Elements.exists('registrationForm')) return 'registration';
  if (Elements.exists('dashboardMain'))   return 'dashboard';
  if (Elements.exists('profileSettings')) return 'settings';
  return 'unknown';
}

const pageType = detectPageType();
console.log(`Running on: ${pageType} page`);

// Initialize page-specific features
switch (pageType) {
  case 'login':        setupLoginPage();    break;
  case 'dashboard':    setupDashboard();    break;
  case 'settings':     setupSettings();    break;
}
```

---

### Example 3: Validation Before Proceeding

Check that the expected structure exists before running initialization code:

```javascript
function initializeCheckout() {
  // Validate that all required checkout elements exist
  const requiredElements = [
    'checkoutForm',
    'orderSummary',
    'paymentSection',
    'submitOrderBtn'
  ];

  const allPresent = requiredElements.every(id => Elements.exists(id));

  if (!allPresent) {
    const missing = requiredElements.filter(id => !Elements.exists(id));
    console.error('Checkout cannot initialize — missing elements:', missing);
    return false;
  }

  // All elements confirmed — safe to proceed
  setupCheckoutForm();
  loadOrderSummary();
  initializePayment();
  return true;
}
```

---

### Example 4: Conditional Module Loading

Only load heavy modules when the page actually needs them:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // Only load the map library if there's a map element on this page
  if (Elements.exists('mapContainer')) {
    loadScript('/js/maps-library.js').then(() => {
      initializeMap('mapContainer');
    });
  }

  // Only load the video player library if needed
  if (Elements.exists('videoPlayer')) {
    loadScript('/js/video-player.js').then(() => {
      initializeVideoPlayer('videoPlayer');
    });
  }

  // Only load the chart library if charts are present
  if (Elements.exists('salesChart') || Elements.exists('userChart')) {
    loadScript('/js/charts.js').then(() => {
      initializeCharts();
    });
  }
});
```

This pattern reduces your page's JavaScript load time — you only load what's needed.

---

## Three-Way Comparison

Here's how all three approaches compare side by side:

```javascript
// Scenario: Access an optional sidebar element

// Option 1: Elements.{id} + null check — full control
const sidebar = Elements.sidebar;
if (sidebar) {
  sidebar.classList.add('initialized');
}

// Option 2: Elements.get() + fallback — always has a value
const container = Elements.get('sidebar', document.querySelector('.main-content'));
container.classList.add('initialized'); // Always safe — never null

// Option 3: Elements.exists() — just checking
if (Elements.exists('sidebar')) {
  // Note: we still need to access the element if we want to use it
  Elements.sidebar.classList.add('initialized');
}
```

**When to use which:**

| Scenario | Best Choice |
|----------|-------------|
| Standard access, you'll null-check yourself | `Elements.{id}` |
| Need the element OR a meaningful default | `Elements.get(id, fallback)` |
| Only checking if it exists (not using it) | `Elements.exists(id)` |
| Element MUST exist or throw an error | `Elements.getRequired(id)` |

---

## Common Patterns in Real Projects

### Pattern 1: Optional UI Panel with Initialization

```javascript
function setupPage() {
  // Required — use direct access + null guard
  const mainContent = Elements.mainContent;
  if (!mainContent) {
    console.error('Main content missing — cannot initialize');
    return;
  }

  // Optional panel — use get() with fallback
  const sidePanel = Elements.get('sidePanel', null);
  if (sidePanel) {
    initializeSidePanel(sidePanel);
  }

  // Feature check — use exists() for conditional loading
  if (Elements.exists('darkModeToggle')) {
    enableDarkModeFeature();
  }

  if (Elements.exists('notificationBell')) {
    loadNotifications();
  }
}
```

---

### Pattern 2: Dynamic Content Destination

Choose where to put dynamic content based on what's available:

```javascript
function showAnnouncement(message) {
  // Try to find a dedicated announcement area, fall back to the top of the page
  const targetArea = Elements.get('announcementBanner', document.body.firstElementChild);

  const announcement = document.createElement('div');
  announcement.textContent = message;
  announcement.className   = 'announcement';

  targetArea.prepend(announcement);
}
```

---

### Pattern 3: Multi-Environment Setup

The same code runs in different environments (admin vs. user, mobile vs. desktop) where different elements exist:

```javascript
function initializeNavigation() {
  // Desktop navigation
  if (Elements.exists('desktopNav')) {
    const desktopNav = Elements.desktopNav;
    setupDesktopNav(desktopNav);
  }

  // Mobile navigation (hamburger menu)
  if (Elements.exists('mobileMenuBtn')) {
    const btn     = Elements.mobileMenuBtn;
    const mobileNav = Elements.get('mobileNav', null);
    setupMobileNav(btn, mobileNav);
  }

  // Admin navigation (only for admin users)
  if (Elements.exists('adminNavBar')) {
    setupAdminNav();
  }
}
```

---

## Best Practices

### ✅ DO: Use get() When You Need a Real Fallback

```javascript
// Good — the fallback is meaningful and immediately usable
const target = Elements.get('specificContainer', document.body);
target.appendChild(content);
```

### ✅ DO: Use exists() for Yes/No Checks Without Accessing the Element

```javascript
// Good — clearly expresses intent: "does this feature exist?"
if (Elements.exists('premiumDashboard')) {
  showPremiumFeatures();
}
```

### ✅ DO: Use All Three Appropriately Together

```javascript
// Good — mix of approaches for different needs in the same function
function initializePage() {
  // Regular access — will null-check manually
  const main    = Elements.mainContent;
  if (!main) return;

  // Feature detection — just checking
  if (Elements.exists('sidePanel')) loadSidePanel();

  // Need a default container — use get()
  const target = Elements.get('notificationArea', main);
  loadNotifications(target);
}
```

### ❌ DON'T: Use exists() When You're About to Access the Element Anyway

```javascript
// Inefficient — exists() and then accessing again is two operations
if (Elements.exists('myButton')) {
  const btn = Elements.myButton; // Second lookup (even if cached)
  btn.click();
}

// Better — one lookup, check the result
const btn = Elements.myButton;
if (btn) {
  btn.click();
}
```

`exists()` is for when you genuinely don't need the element — just the boolean answer. If you're going to access it right after anyway, skip `exists()` and use direct access.

### ❌ DON'T: Use null as a Fallback When You Mean to Use the Element

```javascript
// Risky — if get() returns null, you'll crash on the next line
const container = Elements.get('myContainer', null);
container.appendChild(content); // TypeError if container is null!

// Better — provide a real fallback, or null-check after
const container = Elements.get('myContainer', document.body);
container.appendChild(content); // Always safe ✅

// Or if null is intentional:
const sidebar = Elements.get('sidebar', null);
if (sidebar) {
  sidebar.appendChild(content); // Explicit null check ✅
}
```

---

## Summary — Key Takeaways

1. **`Elements.get(id, fallback)`** — returns the element if found, or your fallback value if not. Perfect when you always need *something* to work with.

2. **`Elements.exists(id)`** — returns `true` or `false`. Perfect for feature detection, page-type checking, and conditional loading.

3. **Both use the same cache** as `Elements.{id}` — cache hits and misses work identically.

4. **`Elements.get()` doesn't cache the fallback** — only real DOM elements get cached.

5. **Choose based on intent:**
   - Need the element or a default? → `get(id, fallback)`
   - Only need yes/no? → `exists(id)`
   - Standard access with manual null check? → `Elements.{id}`

---

## What's Next?

Now let's look at the cache system in more detail — understanding `isCached()` and `stats()`:

Continue to **Cache Methods** (`04_cache-methods.md`) →