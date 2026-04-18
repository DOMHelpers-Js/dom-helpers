[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Async Waiting — Elements.waitFor()

Most of the time, elements are already on the page when your code runs. But sometimes, elements are added to the DOM later — by a fetch request, a third-party script, or a Single Page App (SPA) navigation. `Elements.waitFor()` is designed for exactly these situations: it **waits** until the elements appear, then gives them to you.

---

## Quick Start (30 Seconds)

```javascript
// Load some content via fetch, then wait for the elements it creates
async function loadArticle(id) {
  // Step 1: Fetch the HTML and insert it into the page
  const html = await fetch(`/articles/${id}`).then(r => r.text());
  document.getElementById('content').innerHTML = html;

  try {
    // Step 2: Wait for the elements that the HTML just created
    const { articleTitle, articleBody } = await Elements.waitFor(
      'articleTitle',
      'articleBody'
    );

    // Step 3: Elements are here — use them
    console.log('Loaded article:', articleTitle.textContent);
    initializeArticleFeatures(articleBody);

  } catch (error) {
    // Elements never appeared within 5 seconds
    console.error('Article failed to load:', error.message);
  }
}
```

**That's the pattern:** do your async operation (fetch, dynamic render, etc.), then `await Elements.waitFor()` to get the new elements once they appear.

---

## What is Elements.waitFor()?

`Elements.waitFor()` is an **async element access method**. It returns a Promise that:
- ✅ **Resolves** with the elements once they all appear in the DOM
- ❌ **Rejects** with an error if 5 seconds pass without all elements appearing

This makes it the right choice any time you need to access an element that doesn't exist yet when your code runs — but will exist soon.

**The key difference from regular access:**

```javascript
// Regular access — works only if element EXISTS RIGHT NOW
const elem = Elements.myElement;
// If the element doesn't exist yet: returns null

// waitFor() — works even if element DOESN'T EXIST YET
const { myElement } = await Elements.waitFor('myElement');
// Waits up to 5 seconds for the element to appear
```

---

## Syntax

```javascript
// Wait for a single element
const { elementId } = await Elements.waitFor('elementId');

// Wait for multiple elements — all must appear
const { id1, id2, id3 } = await Elements.waitFor('id1', 'id2', 'id3');

// Always use await — or handle the Promise directly
Elements.waitFor('myElement').then(({ myElement }) => {
  console.log('Got it:', myElement);
}).catch(error => {
  console.error('Timed out:', error.message);
});
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `...ids` | string(s) | One or more element IDs to wait for |

**Returns:** A `Promise` that resolves to an object containing the requested elements.

**Timeout:** 5000 ms (5 seconds) — rejects if elements don't appear in time.

**Important:** You must use `async/await` or `.then()/.catch()` because this is asynchronous.

---

## Why Does This Exist?

### The Problem: Elements That Arrive Late

Modern web apps often add content to the page dynamically — after the initial page load. Here are some common scenarios:

- A button click fetches HTML and inserts it into the page
- A SPA (Single Page App) navigates to a new "page" by replacing content
- A third-party chat widget loads asynchronously and adds its own elements
- Lazy loading brings in content when the user scrolls down

In all these cases, `Elements.{id}` returns `null` because the element doesn't exist yet when your code runs.

### Without waitFor() — The Manual Polling Problem

To work around this, developers sometimes write polling loops:

```javascript
// ❌ Manual polling — error-prone and verbose
async function waitForElement(id, timeout = 5000) {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const elem = Elements[id];
    if (elem) return elem;
    await new Promise(resolve => setTimeout(resolve, 100)); // wait 100ms
  }

  throw new Error(`Timeout waiting for #${id}`);
}

// Have to call this separately for each element
const title = await waitForElement('articleTitle');
const body  = await waitForElement('articleBody');
```

This approach works, but it's repetitive to write, easy to get wrong (what timeout? what interval?), and hard to maintain.

### With waitFor() — Clean and Built-In

```javascript
// ✅ waitFor() — clean, handles multiple elements, built-in timeout
const { articleTitle, articleBody } = await Elements.waitFor(
  'articleTitle',
  'articleBody'
);
// Done — both elements guaranteed, consistent 5s timeout
```

**Benefits:**
✅ Handles multiple elements in one call
✅ Consistent timeout across your entire app
✅ Uses `MutationObserver` internally — efficient, not a polling loop
✅ Returns elements with `.update()` auto-attached, just like regular access
✅ Works seamlessly with `async/await`

---

## Mental Model — The "Waiting Room"

Think of `Elements.waitFor()` like checking into a waiting room for a doctor's appointment.

- You go to the front desk and say "I'm here for Dr. Smith" (you call `waitFor`)
- The receptionist takes your name (the method starts watching for your element)
- You sit down and wait (your `await` pauses here)
- When Dr. Smith is ready, the receptionist calls you (element appears in DOM)
- You get called in (Promise resolves with the element)
- If no one calls you after 5 minutes (5 seconds), the receptionist tells you there's a problem (Promise rejects with timeout error)

You don't have to keep checking yourself — the receptionist (the `MutationObserver`) watches for you.

---

## How Does It Work?

Under the hood, `Elements.waitFor()` uses the browser's `MutationObserver` API — the same technology used for the cache auto-invalidation. Here's the internal flow:

```
await Elements.waitFor('articleTitle', 'articleBody')
       ↓
Step 1: Check if elements already exist
  → articleTitle: not found
  → articleBody: not found
  → Not all found yet — start watching

Step 2: Set up MutationObserver
  → Watch the entire DOM for new elements being added
  → Set a 5-second timeout timer

Step 3: DOM changes (fetch result inserted)
  → MutationObserver triggers
  → Check again: articleTitle found ✅, articleBody found ✅
  → All elements found!

Step 4: Clean up
  → Disconnect the MutationObserver
  → Clear the timeout timer

Step 5: Resolve the Promise
  → Return { articleTitle: <h1>, articleBody: <div> }
  → Your await continues with the elements ✅
```

**What if the timeout fires first?**
```
Step 3 (alternative): 5 seconds pass with no elements found
  → Timeout fires
  → Disconnect the MutationObserver
  → Reject the Promise
  → Your catch() block runs with an error message ❌
```

**Why MutationObserver instead of polling?**
Polling (checking every 100ms) wastes CPU cycles even when nothing has changed. `MutationObserver` only fires when the DOM actually changes — much more efficient.

---

## Basic Usage

### Example 1: After a Fetch Request

The most common use case — fetch some HTML and wait for the elements it creates:

```html
<div id="content"><!-- Empty, waiting for content --></div>
```

```javascript
async function loadUserProfile(userId) {
  // Step 1: Fetch and insert the HTML
  const response = await fetch(`/api/users/${userId}/profile`);
  const html = await response.text();

  document.getElementById('content').innerHTML = html;
  // The HTML might contain: <h2 id="userName">, <p id="userBio">, <img id="userAvatar">

  try {
    // Step 2: Wait for the elements that just got inserted
    const { userName, userBio, userAvatar } = await Elements.waitFor(
      'userName',
      'userBio',
      'userAvatar'
    );

    // Step 3: All three are here — use them
    document.title = `Profile: ${userName.textContent}`;
    userAvatar.alt = userName.textContent; // Set accessible alt text

    console.log(`Loaded profile for: ${userName.textContent}`);

  } catch (error) {
    // Profile elements never appeared
    console.error('Profile failed to load:', error.message);
    document.getElementById('content').innerHTML = '<p>Profile unavailable.</p>';
  }
}
```

**Step by step:**
1. We fetch the HTML and put it in `#content`
2. We call `waitFor()` with the IDs we expect the HTML to contain
3. The `MutationObserver` detects when those elements appear
4. We get the elements back and use them

---

### Example 2: SPA Navigation

In a Single Page App, "navigating" usually means replacing the page content with new HTML:

```javascript
async function navigateToPage(pageName) {
  // Clear current content and show loading indicator
  Elements.appContainer.innerHTML = '<div id="loadingSpinner">Loading...</div>';

  try {
    // Fetch the new page's HTML
    const html = await fetchPageContent(pageName);
    Elements.appContainer.innerHTML = html;

    // Wait for the new page's elements
    const pageElements = await Elements.waitFor('pageTitle', 'pageContent', 'pageNav');

    // Set up the new page
    document.title = pageElements.pageTitle.textContent;
    initializePageInteractions(pageElements.pageContent);
    highlightActiveNavItem(pageElements.pageNav, pageName);

    console.log(`✅ Navigated to: ${pageName}`);

  } catch (error) {
    console.error(`Navigation to ${pageName} failed:`, error.message);

    // Show error state
    Elements.appContainer.innerHTML = `
      <p>Page could not be loaded. <a href="#" onclick="history.back()">Go back</a></p>
    `;
  }
}
```

---

### Example 3: Third-Party Widget Loading

Sometimes you load a script that renders its own elements asynchronously:

```javascript
async function loadChatWidget() {
  // Load the chat script dynamically
  const script = document.createElement('script');
  script.src = 'https://chatprovider.example.com/widget.js';
  document.head.appendChild(script);

  // The script will eventually add its own elements to the DOM
  // We don't control when — we just wait

  try {
    const { chatContainer, chatToggleBtn } = await Elements.waitFor(
      'chatContainer',
      'chatToggleBtn'
    );

    console.log('✅ Chat widget loaded');

    // Customize the widget now that it's in the DOM
    chatContainer.update({
      style: { position: 'fixed', bottom: '20px', right: '20px' }
    });

    chatToggleBtn.addEventListener('click', () => {
      console.log('Chat opened by user');
      trackEvent('chat_opened');
    });

  } catch (error) {
    // Chat didn't load in time — that's okay, it's optional
    console.warn('Chat widget did not load:', error.message);
    // App continues without chat
  }
}
```

---

### Example 4: Waiting for a Single Element

You can wait for just one element too:

```javascript
async function initializeMap() {
  // Load a mapping library
  await loadScript('https://maps.example.com/api.js');

  // The library renders a map container with a known ID
  try {
    const { mapContainer } = await Elements.waitFor('mapContainer');

    // Now safe to initialize the map in the container
    const map = new Map(mapContainer, { center: [51.5, -0.1], zoom: 12 });
    console.log('✅ Map initialized');

  } catch (error) {
    console.error('Map container never appeared:', error.message);
    showMapUnavailableMessage();
  }
}
```

---

## Deep Dive — Timeout Handling

### Default Timeout: 5 Seconds

By default, `waitFor()` will wait up to 5 seconds. If the elements don't appear in 5 seconds, it rejects with an error.

```javascript
try {
  const { slowElement } = await Elements.waitFor('slowElement');
  console.log('Element appeared!');
} catch (error) {
  console.error(error.message);
  // Output: something like "Timeout: Element 'slowElement' not found"
}
```

### Custom Timeout with Promise.race()

If 5 seconds isn't the right timeout for your use case, you can use `Promise.race()` to set your own:

```javascript
function waitForWithTimeout(ids, timeoutMs) {
  const elementPromise = Elements.waitFor(...ids);

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Custom timeout after ${timeoutMs}ms`)), timeoutMs)
  );

  // The first promise to settle "wins"
  return Promise.race([elementPromise, timeoutPromise]);
}

// Wait up to 10 seconds instead of 5
try {
  const { heavyWidget } = await waitForWithTimeout(['heavyWidget'], 10000);
  console.log('Heavy widget loaded');
} catch (error) {
  console.error('Took too long:', error.message);
}
```

### Showing a Loading State During Wait

Always give users visual feedback when something is loading:

```javascript
async function loadAndShowContent() {
  // Show loading indicator
  Elements.loadingSpinner.update({ style: { display: 'block' } });

  try {
    // Do the async work
    await fetchAndInsertContent();

    // Wait for the new elements
    const { newContent } = await Elements.waitFor('newContent');

    initializeContent(newContent);

  } catch (error) {
    showErrorMessage('Content could not be loaded.');
    console.error(error.message);

  } finally {
    // ALWAYS hide the spinner, whether we succeeded or failed
    Elements.loadingSpinner.update({ style: { display: 'none' } });
  }
}
```

The `finally` block is key here — it always runs, so the spinner never gets stuck on screen.

---

## Deep Dive — Real-World Patterns

### Pattern 1: Progressive Loading (Loading in Stages)

Sometimes content loads in multiple stages. You can chain `waitFor()` calls:

```javascript
async function loadDashboard() {
  showLoadingState();

  try {
    // Stage 1: Wait for the container to appear
    const { dashboardContainer } = await Elements.waitFor('dashboardContainer');
    console.log('Stage 1: Container ready');

    // Stage 2: Load data and render widgets into the container
    const data = await fetchDashboardData();
    renderWidgets(dashboardContainer, data);

    // Stage 3: Wait for the widgets themselves to appear
    const widgets = await Elements.waitFor(
      'statsWidget',
      'chartWidget',
      'activityWidget'
    );
    console.log('Stage 2: Widgets ready');

    // Stage 4: Initialize widget interactivity
    initializeStatsWidget(widgets.statsWidget);
    initializeChartWidget(widgets.chartWidget);
    initializeActivityWidget(widgets.activityWidget);

    console.log('✅ Dashboard fully loaded');

  } catch (error) {
    console.error('Dashboard loading failed:', error.message);
    showDashboardError();

  } finally {
    hideLoadingState();
  }
}
```

---

### Pattern 2: Retry on Timeout

For elements that are particularly slow to load, you can retry a few times before giving up:

```javascript
async function waitForWithRetry(ids, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Attempt ${attempt} of ${maxAttempts}...`);
      return await Elements.waitFor(...ids);

    } catch (error) {
      if (attempt === maxAttempts) {
        // Final attempt failed — give up
        throw new Error(`Elements not found after ${maxAttempts} attempts: ${ids.join(', ')}`);
      }

      // Wait before retrying (exponential backoff: 1s, 2s, 4s...)
      const delay = Math.pow(2, attempt - 1) * 1000;
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Usage
try {
  const { unreliableWidget } = await waitForWithRetry(['unreliableWidget'], 3);
  console.log('Got it after retries!');
} catch (error) {
  console.error('Gave up:', error.message);
}
```

---

### Pattern 3: Infinite Scroll — Loading More Content

In infinite scroll, new items are added to the DOM as the user scrolls. `waitFor()` helps initialize each new batch:

```javascript
class InfiniteScrollManager {
  constructor(containerId) {
    this.container = Elements[containerId];
    this.page = 1;
    this.isLoading = false;

    window.addEventListener('scroll', () => this.handleScroll());
  }

  handleScroll() {
    const scrolledToBottom =
      window.scrollY + window.innerHeight >= document.body.scrollHeight - 200;

    if (scrolledToBottom && !this.isLoading) {
      this.loadNextPage();
    }
  }

  async loadNextPage() {
    this.isLoading = true;
    this.page++;

    // Fetch next page and add it to the list
    const html = await fetchPage(this.page);
    this.container.insertAdjacentHTML('beforeend', html);

    // Generate the IDs we expect the new page to have
    const newItemIds = Array.from(
      { length: 10 },
      (_, i) => `item-page${this.page}-${i}`
    );

    try {
      // Wait for all new items to appear
      const newItems = await Elements.waitFor(...newItemIds);
      console.log(`Page ${this.page} loaded: ${Object.keys(newItems).length} items`);

    } catch (error) {
      console.warn(`Some items from page ${this.page} didn't load:`, error.message);

    } finally {
      this.isLoading = false;
    }
  }
}
```

---

## Comparison: waitFor() vs. Other Access Methods

| Situation | Best Method |
|-----------|-------------|
| Element exists on page load | `Elements.{id}` — instant, synchronous |
| Element might or might not exist right now | `Elements.get(id, fallback)` or null check |
| Element will exist but might not yet | `Elements.waitFor()` |
| Element must exist or throw error | `Elements.getRequired()` |

```javascript
// Element always on page — use direct access
const header = Elements.pageHeader;

// Optional element — use get() or null check
const sidebar = Elements.sidebar;
if (sidebar) initializeSidebar(sidebar);

// Dynamic content — use waitFor()
const { dynamicContent } = await Elements.waitFor('dynamicContent');

// Must exist at this point or something is broken — use getRequired()
const { loginForm } = Elements.getRequired('loginForm');
```

---

## Common Mistakes to Avoid

### ❌ Using waitFor() for Static Content

```javascript
// Unnecessary — header is always there at page load
const { header } = await Elements.waitFor('header');

// Better — just use direct access
const header = Elements.header;
```

`waitFor()` adds overhead (sets up a `MutationObserver`, starts a timer) that you don't need for elements that are already there.

### ❌ Forgetting await

```javascript
// Wrong — this doesn't wait, you get a Promise object, not an element
const { myElem } = Elements.waitFor('myElem'); // Promise, not element!
myElem.textContent; // Error: Cannot read properties of undefined

// Correct — use await
const { myElem } = await Elements.waitFor('myElem');
myElem.textContent; // Works!
```

### ❌ Not Handling the Timeout

```javascript
// Risky — if the element never appears, this throws an unhandled error
const { dynamicBtn } = await Elements.waitFor('dynamicBtn');

// Safe — always wrap in try/catch
try {
  const { dynamicBtn } = await Elements.waitFor('dynamicBtn');
  dynamicBtn.addEventListener('click', handleClick);
} catch (error) {
  console.error('Button never appeared:', error.message);
  showFallbackUI();
}
```

### ❌ Waiting for Elements You Control the Timing Of

```javascript
// Roundabout — you inserted the HTML, then wait for elements from it
const html = '<div id="myDiv">content</div>';
document.body.innerHTML = html;
const { myDiv } = await Elements.waitFor('myDiv'); // Unnecessary

// Better — use Elements.{id} immediately after synchronous DOM insertion
document.body.innerHTML = html;
const myDiv = Elements.myDiv; // It's already there!
```

`waitFor()` is designed for cases where you don't control the exact moment the element is inserted (fetched HTML, third-party scripts, lazy loading). If you insert the HTML yourself synchronously, the element exists immediately.

---

## Summary — Key Takeaways

1. **Use `waitFor()` for elements that don't exist yet but will appear** — fetched content, SPA navigation, third-party widgets, lazy loading.

2. **Always use `await`** — `waitFor()` is asynchronous and returns a Promise.

3. **Always wrap in `try/catch`** — the 5-second timeout will reject the Promise if elements never appear.

4. **Show a loading state** — use `finally` to hide it whether you succeed or fail.

5. **Don't use it for static content** — if the element is there at page load, use `Elements.{id}` directly.

6. **It's efficient** — uses `MutationObserver`, not polling, so it doesn't burn CPU while waiting.

---

## What's Next?

Now that you know all the access methods, let's look at how to choose the right one for any situation:

Continue to **Best Practices** (`08_best-practices.md`) →