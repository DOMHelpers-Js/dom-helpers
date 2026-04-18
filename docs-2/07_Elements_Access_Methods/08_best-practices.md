[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Best Practices — Choosing the Right Method

You've learned all the Elements access methods. Now let's bring everything together: when should you use each method, what patterns lead to clean code, and what mistakes to avoid. This is your practical guide to writing great code with the Elements helper.

---

## Quick Start — Your Mental Checklist

Every time you need to access an element, ask yourself these four questions:

```
1. Is the element on the page RIGHT NOW, or does it appear later?
   → Later (dynamic) = waitFor()
   → Now = continue below ↓

2. Is the element CRITICAL — your app can't work without it?
   → Yes = getRequired()  (wrap in try/catch)
   → No  = continue below ↓

3. Do you need MULTIPLE elements at once?
   → Yes = destructure() or getMultiple()
   → No  = continue below ↓

4. Is the element OPTIONAL — you want a fallback if it's missing?
   → Want a fallback value = get(id, fallback)
   → Just checking if it exists = exists(id)
   → Fine to get null = Elements.{id}  ← DEFAULT
```

Most of the time, you'll end up at the last option: **`Elements.{id}`** — the direct property access. That's intentional. It's the right choice for the vast majority of situations.

---

## The 99% Rule: Start with Elements.{id}

Direct property access is your default. Use it for everything that doesn't fit a more specific scenario:

```javascript
// ✅ Clean, simple, the right choice 99% of the time
const header  = Elements.pageHeader;
const form    = Elements.loginForm;
const btn     = Elements.submitBtn;
const input   = Elements.emailInput;

// Then use them — with a null check if the element might not be there
if (btn) {
  btn.disabled = false;
  btn.textContent = 'Submit';
}

// Or with optional chaining for a one-liner
Elements.submitBtn?.update({ disabled: false });
```

**Why it's the default:**
- ✅ Zero configuration needed
- ✅ Automatic caching — subsequent accesses are instant
- ✅ Elements get `.update()` auto-attached
- ✅ Clean, readable syntax
- ✅ Returns the element or `null` — never throws

---

## Decision Tree — Full Version

Here's the complete guide to choosing the right method:

```
Need to access an element?
│
├─ 1. Does the element LOAD DYNAMICALLY (AJAX, SPA, lazy, third-party)?
│     └─ YES → await Elements.waitFor('id')
│            → Always wrap in try/catch (5s timeout)
│
├─ 2. Is the element CRITICAL — must exist or app is broken?
│     └─ YES → Elements.getRequired('id1', 'id2')
│            → Always wrap in try/catch
│
├─ 3. Need MULTIPLE elements at once?
│     └─ YES → const { a, b, c } = Elements.destructure('a', 'b', 'c')
│
├─ 4. Element is OPTIONAL and you want a FALLBACK VALUE?
│     └─ YES → Elements.get('id', fallbackValue)
│
├─ 5. Just CHECKING if an element exists (not using it)?
│     └─ YES → Elements.exists('id')  → returns true/false
│
└─ 6. EVERYTHING ELSE (the default — most common)
      └─ Elements.myElement  ← Do this
```

---

## Method Reference — When to Use Each

### Elements.{id} — The Primary Method

**Use when:** The element exists on page load and you want direct access.

```javascript
// ✅ Perfect for:
const nav     = Elements.mainNav;      // Navigation that's always there
const footer  = Elements.pageFooter;   // Static footer
const modal   = Elements.contactModal; // Modal that's in the HTML

// Add a null check if the element might not be on every page
if (nav) {
  nav.classList.add('sticky');
}

// Or use optional chaining for brevity
Elements.contactModal?.update({ style: { display: 'block' } });
```

**Avoid when:**
- Element loads dynamically → use `waitFor()`
- Must throw error if missing → use `getRequired()`

---

### Elements.get(id, fallback) — Safe Access with Fallback

**Use when:** The element is optional and you want code that works regardless of whether it's there.

```javascript
// ✅ Perfect for:

// Optional UI panels
const sidebar = Elements.get('sidebar', null);
if (sidebar) {
  initializeSidebar(sidebar);
}

// Fallback container
const targetContainer = Elements.get('customContainer', document.body);
targetContainer.appendChild(newElement); // Always safe — either the container or body

// Feature detection
const darkModeToggle = Elements.get('darkModeToggle', null);
if (darkModeToggle) {
  enableDarkModeFeature(darkModeToggle);
}
```

**Avoid when:**
- Element should always be there → just use `Elements.{id}` with a null check
- Missing element means something is wrong → use `getRequired()`

---

### Elements.exists(id) — Existence Check Only

**Use when:** You only need to know *whether* an element exists, not use it directly.

```javascript
// ✅ Perfect for:

// Conditional feature initialization
if (Elements.exists('advancedPanel')) {
  initializeAdvancedMode();
}

// Checking page type
const isLoginPage = Elements.exists('loginForm');
const isProfilePage = Elements.exists('profileContainer');

if (isLoginPage) setupLogin();
if (isProfilePage) setupProfile();

// Validating page structure before doing work
const requiredIds = ['header', 'main', 'footer'];
const pageIsValid = requiredIds.every(id => Elements.exists(id));

if (!pageIsValid) {
  console.error('Page structure incomplete');
  return;
}
```

**A common mistake to avoid:**

```javascript
// ❌ Inefficient — two lookups for the same element
if (Elements.exists('button')) {
  const button = Elements.button; // Second lookup (even if cached, it's redundant)
  button.click();
}

// ✅ Better — one lookup, check the result
const button = Elements.button;
if (button) {
  button.click();
}
```

Use `exists()` when you genuinely don't need the element itself — just the yes/no answer.

---

### Elements.destructure(...ids) — Multiple Elements at Once

**Use when:** You need several elements together — for initialization, component setup, or batch operations.

```javascript
// ✅ Perfect for:

// Page structure initialization
const { header, nav, main, aside, footer } = Elements.destructure(
  'header', 'nav', 'main', 'aside', 'footer'
);

// All elements accessed in one shot, cleanly named
if (header) setupHeader(header);
if (nav)    setupNavigation(nav);
if (main)   loadContent(main);
if (aside)  loadSidebar(aside);
if (footer) setupFooter(footer);

// Component initialization
const { modal, modalTitle, modalBody, modalClose } = Elements.destructure(
  'modal', 'modalTitle', 'modalBody', 'modalClose'
);

if (modal && modalClose) {
  modalClose.addEventListener('click', () => {
    modal.update({ style: { display: 'none' } });
  });
}
```

**Why use this instead of separate accesses?**
```javascript
// ❌ Five separate lines
const header = Elements.header;
const nav    = Elements.nav;
const main   = Elements.main;
const aside  = Elements.aside;
const footer = Elements.footer;

// ✅ One clean destructure
const { header, nav, main, aside, footer } = Elements.destructure(
  'header', 'nav', 'main', 'aside', 'footer'
);
```

Note: `destructure()` returns `null` for any element not found — none of them throw errors.

---

### Elements.getRequired(...ids) — Critical, Fail-Fast

**Use when:** Every element in the list is essential — if any are missing, you want an immediate error rather than a cryptic crash later.

```javascript
// ✅ Perfect for:

// Critical page structure
try {
  const { app, main, header } = Elements.getRequired('app', 'main', 'header');
  startApplication(app, main, header);
} catch (error) {
  showCriticalError(error.message);
}

// Payment and security-critical forms
try {
  const { paymentForm, cardInput, cvvInput, submitBtn } = Elements.getRequired(
    'paymentForm', 'cardInput', 'cvvInput', 'submitBtn'
  );
  initializePayment(paymentForm, cardInput, cvvInput, submitBtn);
} catch (error) {
  disablePaymentSection('Payment form is unavailable');
}
```

**Avoid when:**
- Some elements in the list are optional → separate required from optional
- Elements load dynamically → use `waitFor()`

---

### Elements.waitFor(...ids) — Dynamic / Async Content

**Use when:** Elements will appear in the DOM later — fetched content, SPA navigation, lazy loading, third-party scripts.

```javascript
// ✅ Perfect for:

// After an AJAX fetch
async function loadArticle(id) {
  const html = await fetchArticle(id);
  Elements.contentArea.innerHTML = html;

  try {
    const { articleTitle, articleBody } = await Elements.waitFor(
      'articleTitle', 'articleBody'
    );
    initializeArticle(articleTitle, articleBody);
  } catch (error) {
    showLoadError();
  }
}

// SPA page navigation
async function navigateTo(page) {
  await loadPage(page);

  try {
    const { pageTitle, pageContent } = await Elements.waitFor('pageTitle', 'pageContent');
    document.title = pageTitle.textContent;
    initializePageContent(pageContent);
  } catch (error) {
    showNavigationError();
  }
}
```

**Avoid when:**
- Element exists at page load → use `Elements.{id}` directly
- Element will never appear → `waitFor()` will just timeout

---

### Elements.isCached(id) / Elements.stats() — Debugging Only

**Use when:** You're investigating cache behavior or monitoring performance — not for normal application logic.

```javascript
// ✅ Development and debugging only
if (process.env.NODE_ENV === 'development') {
  // Check if something is cached
  console.log('Header cached?', Elements.isCached('header'));

  // Monitor cache performance
  const stats = Elements.stats();
  console.log(`Cache hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
  console.log(`Cached elements: ${stats.cacheSize}`);
}

// ✅ In tests — verify caching behavior
it('should cache element after first access', () => {
  Elements.header; // Access once
  expect(Elements.isCached('header')).toBe(true);
});
```

---

## Common Scenarios — Best Practices in Action

### Scenario 1: Page Initialization

```javascript
// ✅ Best practice for initializing a page

function initializePage() {

  // 1. Get multiple elements together
  const { header, nav, main, footer } = Elements.destructure(
    'header', 'nav', 'main', 'footer'
  );

  // 2. Validate the core structure
  if (!header || !main) {
    console.error('Critical page structure missing');
    return; // Stop here — can't initialize without these
  }

  // 3. Set up required parts
  setupNavigation(nav);
  loadPageContent(main);

  // 4. Set up optional parts (footer might not be on every page)
  if (footer) setupFooter(footer);

  // 5. Check for optional features
  if (Elements.exists('chatWidget')) {
    initializeChat();
  }

  console.log('✅ Page initialized');
}
```

---

### Scenario 2: Form Setup

```javascript
// ✅ Best practice for setting up a form with mixed required/optional elements

function setupContactForm() {
  try {
    // Required form elements — can't function without these
    const { contactForm, nameInput, emailInput, messageInput, submitBtn } =
      Elements.getRequired(
        'contactForm',
        'nameInput',
        'emailInput',
        'messageInput',
        'submitBtn'
      );

    // Optional enhancements — nice to have but not essential
    const charCounter   = Elements.charCounter;   // null if missing, that's fine
    const formSuccess   = Elements.formSuccess;   // null if missing
    const fileUpload    = Elements.fileUpload;    // null if missing

    // Set up the core form
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.update({ disabled: true, textContent: 'Sending...' });

      try {
        await submitForm({
          name:    nameInput.value,
          email:   emailInput.value,
          message: messageInput.value
        });

        // Show success message if the element exists
        if (formSuccess) {
          formSuccess.update({ style: { display: 'block' } });
        }

      } catch (error) {
        console.error('Form submission failed:', error.message);
        alert('Could not send message. Please try again.');

      } finally {
        submitBtn.update({ disabled: false, textContent: 'Send Message' });
      }
    });

    // Set up optional character counter if present
    if (charCounter) {
      messageInput.addEventListener('input', () => {
        charCounter.textContent = `${messageInput.value.length}/500 characters`;
      });
    }

    // Set up optional file upload if present
    if (fileUpload) {
      initializeFileUpload(fileUpload);
    }

  } catch (error) {
    // Core form elements are missing — disable the whole section
    console.error('Contact form setup failed:', error.message);
    showErrorMessage('Contact form is temporarily unavailable.');
  }
}
```

---

### Scenario 3: Dynamic / SPA Content Loading

```javascript
// ✅ Best practice for loading dynamic content

async function loadDashboard() {
  // Show loading state
  const spinner = Elements.loadingSpinner;
  if (spinner) spinner.update({ style: { display: 'block' } });

  try {
    // Fetch and insert new content
    const data = await fetchDashboardData();
    Elements.appMain.innerHTML = renderDashboard(data);

    // Wait for the dynamically created elements
    const { statsPanel, chartPanel, activityFeed } = await Elements.waitFor(
      'statsPanel',
      'chartPanel',
      'activityFeed'
    );

    // Initialize each panel
    initializeStats(statsPanel, data.stats);
    initializeChart(chartPanel, data.chartData);
    initializeActivityFeed(activityFeed, data.activity);

    // Optional elements that may or may not be in the dashboard
    const notifications = Elements.notificationsPanel;
    if (notifications) {
      loadNotifications(notifications);
    }

    console.log('✅ Dashboard loaded');

  } catch (error) {
    console.error('Dashboard failed to load:', error.message);
    showDashboardError();

  } finally {
    // Always hide spinner
    if (spinner) spinner.update({ style: { display: 'none' } });
  }
}
```

---

### Scenario 4: Optional Feature Detection

```javascript
// ✅ Best practice for conditional features

function initializeFeatures() {
  // Core feature — must work
  const mainContent = Elements.mainContent;
  if (!mainContent) {
    console.error('Main content area missing — cannot initialize');
    return;
  }

  // Optional features — initialize only if elements are present

  // Search
  if (Elements.exists('searchBar')) {
    // We know it exists, now access it
    const searchBar = Elements.searchBar;
    initializeSearch(searchBar);
  }

  // Dark mode toggle
  const darkToggle = Elements.darkModeToggle; // null if missing
  if (darkToggle) {
    darkToggle.addEventListener('change', toggleDarkMode);
  }

  // Notifications
  const notifBell = Elements.get('notificationBell', null);
  if (notifBell) {
    loadNotifications(notifBell);
  }

  // Analytics (definitely optional)
  if (Elements.exists('analyticsWidget')) {
    initializeAnalytics();
  }

  console.log('✅ Features initialized');
}
```

---

## Anti-Patterns — What to Avoid

### ❌ Anti-Pattern 1: Using waitFor() for Static Content

```javascript
// Bad — these elements are always on the page
async function init() {
  const { header } = await Elements.waitFor('header');   // Unnecessary async!
  const { footer } = await Elements.waitFor('footer');   // Unnecessary!
}

// Good — they're there, just access them
function init() {
  const header = Elements.header;
  const footer = Elements.footer;
}
```

`waitFor()` adds overhead. Only use it when elements genuinely arrive late.

---

### ❌ Anti-Pattern 2: Accessing Without Null Check

```javascript
// Bad — crashes if submitBtn is null
const button = Elements.submitBtn;
button.disabled = false; // TypeError: Cannot set properties of null

// Good option 1 — null check
const button = Elements.submitBtn;
if (button) {
  button.disabled = false;
}

// Good option 2 — optional chaining
Elements.submitBtn?.update({ disabled: false });

// Good option 3 — if it must exist, use getRequired
const { submitBtn } = Elements.getRequired('submitBtn');
submitBtn.disabled = false;
```

---

### ❌ Anti-Pattern 3: exists() Then Access (Double Lookup)

```javascript
// Bad — two separate lookups for the same element
if (Elements.exists('button')) {
  const button = Elements.button; // Redundant second lookup
  button.click();
}

// Good — one lookup
const button = Elements.button;
if (button) {
  button.click();
}
```

`exists()` is for when you genuinely don't need the element — just the yes/no answer. If you're about to access it anyway, just access it and check the result.

---

### ❌ Anti-Pattern 4: Storing Element Before DOM Is Ready

```javascript
// Bad — running at script load time when DOM isn't ready
const header = Elements.header; // null! DOM not built yet.

document.addEventListener('DOMContentLoaded', () => {
  header.textContent = 'Hello'; // Crash — header is null
});

// Good — access elements after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const header = Elements.header;
  if (header) {
    header.textContent = 'Hello';
  }
});
```

Always access elements inside `DOMContentLoaded`, or after the elements are known to exist.

---

### ❌ Anti-Pattern 5: Using getRequired() for Optional Elements

```javascript
// Bad — throws if sidebar is missing, even though it's optional
try {
  const { sidebar } = Elements.getRequired('sidebar');
  initializeSidebar(sidebar);
} catch (error) {
  // sidebar is optional, so we continue... but we still had an unnecessary throw
}

// Good — optional elements don't need getRequired()
const sidebar = Elements.sidebar; // null if missing, no throw
if (sidebar) {
  initializeSidebar(sidebar);
}
```

`getRequired()` is for elements that should **stop execution** if missing. If the app continues fine without it, don't use `getRequired()`.

---

### ❌ Anti-Pattern 6: Clearing Cache Unnecessarily

```javascript
// Bad — clears cache on every update, defeats the purpose
function updateButtonText(text) {
  Elements.clear(); // ❌ Why? This removes all cached elements!
  const btn = Elements.myButton;
  if (btn) btn.textContent = text;
}

// Good — just use the cached reference
function updateButtonText(text) {
  const btn = Elements.myButton; // Gets from cache on second+ access
  if (btn) btn.textContent = text;
}
```

The cache updates itself automatically via `MutationObserver`. Only clear it when you do a major DOM restructure (like replacing large sections of the page).

---

## Performance Tips

### Tip 1: Store References You'll Use Many Times

```javascript
// Fine — the cache makes this fast either way
function animate() {
  Elements.box.style.left = getX() + 'px';
  Elements.box.style.top  = getY() + 'px';
  requestAnimationFrame(animate);
}

// Slightly better for high-frequency operations — store once outside the loop
const box = Elements.box;
function animate() {
  if (!box) return;
  box.style.left = getX() + 'px';
  box.style.top  = getY() + 'px';
  requestAnimationFrame(animate);
}
```

For most code, the cache is fast enough that it doesn't matter. But for animation loops or rapid-fire event handlers, storing the reference once is a good habit.

---

### Tip 2: Use destructure() for Component Setup

```javascript
// Fine — five separate accesses
function setupModal() {
  const modal     = Elements.modal;
  const title     = Elements.modalTitle;
  const body      = Elements.modalBody;
  const closeBtn  = Elements.modalClose;
  const submitBtn = Elements.modalSubmit;
  // ...
}

// Slightly cleaner — all at once, named clearly
function setupModal() {
  const { modal, modalTitle, modalBody, modalClose, modalSubmit } =
    Elements.destructure('modal', 'modalTitle', 'modalBody', 'modalClose', 'modalSubmit');
  // ...
}
```

---

### Tip 3: Trust the Cache

```javascript
// Don't do this — you're working against the caching system
function updateUI() {
  Elements.clear(); // Clears everything!
  const header = Elements.header; // Cache miss — goes to DOM
  const nav    = Elements.nav;    // Cache miss — goes to DOM
  // ...
}

// Do this — let the cache work for you
function updateUI() {
  const header = Elements.header; // Cache hit on second+ call
  const nav    = Elements.nav;    // Cache hit on second+ call
  // ...
}
```

---

## Summary — The Simple Rules

1. **Default to `Elements.{id}`** — it handles 99% of cases cleanly and efficiently.

2. **Add null checks** where the element might genuinely not be on every page: `if (elem) { ... }` or `elem?.update(...)`.

3. **Use `getRequired()` for critical elements** — payment forms, auth, core structure. Wrap in `try/catch`.

4. **Use `waitFor()` for dynamic content** — AJAX responses, SPA navigation, third-party scripts. Always `await` and wrap in `try/catch`.

5. **Use `destructure()` when grabbing multiple elements** — keeps code clean.

6. **Use `get()` for optional elements with fallbacks** — `Elements.get('optional', defaultValue)`.

7. **Use `exists()` for yes/no checks** — when you don't need the element itself.

8. **Trust the cache** — don't clear it unless you have a good reason (major DOM restructure).

9. **Keep `stats()` and `isCached()` for debugging** — not for production application logic.

---

## Quick Reference Card

```javascript
// 🎯 DEFAULT (99% of cases)
const elem = Elements.myElement;
if (elem) elem.update({...});

// 🔒 CRITICAL — must exist, fail-fast
try {
  const { a, b } = Elements.getRequired('a', 'b');
} catch (e) { handleError(e); }

// 📦 MULTIPLE ELEMENTS at once
const { x, y, z } = Elements.destructure('x', 'y', 'z');

// 🛡️ OPTIONAL with fallback
const container = Elements.get('optional', document.body);

// ✔️ EXISTENCE CHECK only
if (Elements.exists('feature')) initFeature();

// ⏳ DYNAMIC content — element arrives later
const { dynamic } = await Elements.waitFor('dynamic');

// 📊 DEBUG only — cache stats
const stats = Elements.stats(); // → { hits, misses, hitRate, cacheSize }
const cached = Elements.isCached('id'); // → true/false
```

---

## You're Ready!

You've covered all the Elements access methods and how to use them well:

✅ **Core access** — `Elements.{id}` and the caching system
✅ **Safe access** — `get()`, `exists()`, null checks
✅ **Batch access** — `destructure()`, `getMultiple()`
✅ **Fail-fast access** — `getRequired()` with error handling
✅ **Async access** — `waitFor()` for dynamic content
✅ **Best practices** — choosing the right method for every situation

Continue to **Property and Attribute Methods** (`09_property-and-attribute-methods.md`) →