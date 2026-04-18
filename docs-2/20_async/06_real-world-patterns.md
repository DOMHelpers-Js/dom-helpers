[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Real-World Patterns and Best Practices

## Pattern 1: Live Search with Debounce

```javascript
const search = AsyncHelpers.debounce(async (query) => {
  if (!query.trim()) {
    Elements.searchResults.update({ html: '' });
    return;
  }

  Elements.searchSpinner.fadeIn({ duration: 150 });

  try {
    const results = await AsyncHelpers.fetchJSON(
      `/api/search?q=${encodeURIComponent(query)}`,
      { timeout: 5000 }
    );

    const html = results.map(item =>
      `<li class="result-item">${AsyncHelpers.sanitize(item.title)}</li>`
    ).join('');

    Elements.searchResults.update({ html: `<ul>${html}</ul>` });
  } catch (err) {
    Elements.searchResults.update({ text: 'Search failed. Please try again.' });
  } finally {
    Elements.searchSpinner.fadeOut({ duration: 150 });
  }
}, 400);

document.getElementById('searchInput').addEventListener('input', (e) => {
  search(e.target.value);
});
```

---

## Pattern 2: Auto-Save with Debounce + Status Indicator

```javascript
const statusEl = Elements.autoSaveStatus;

const autoSave = AsyncHelpers.debounce(async () => {
  statusEl.update({ text: 'Saving...' });

  try {
    await AsyncHelpers.fetchJSON('/api/draft', {
      method: 'PUT',
      body:   Forms.editorForm.values
    });
    statusEl.update({ text: '✓ Saved' });
    await AsyncHelpers.sleep(2000);
    statusEl.update({ text: '' });
  } catch {
    statusEl.update({ text: '⚠ Save failed' });
  }
}, 1500);

document.getElementById('editorContent').addEventListener('input', autoSave);

// Save immediately when user navigates away
window.addEventListener('beforeunload', () => autoSave.flush());
```

---

## Pattern 3: Button with Async Action and Loading State

```javascript
const saveBtn = document.getElementById('saveBtn');

saveBtn.addEventListener('click', AsyncHelpers.asyncHandler(async (e) => {
  const { isValid } = Forms.profileForm.validate({
    name:  { required: true, minLength: 2 },
    email: { required: true, email: true }
  });

  if (!isValid) return;

  const result = await AsyncHelpers.fetchJSON('/api/profile', {
    method:  'PUT',
    body:    Forms.profileForm.values,
    timeout: 10000
  });

  Forms.profileForm.update({ classes: { add: 'saved' } });
  await AsyncHelpers.sleep(1500);
  Forms.profileForm.update({ classes: { remove: 'saved' } });

}, {
  loadingClass: 'btn-saving',
  errorHandler: (err) => {
    console.error('Save failed:', err.message);
    showToast('Profile update failed. Please try again.', 'error');
  }
}));
```

```css
.btn-saving {
  opacity: 0.7;
  pointer-events: none;
}
.btn-saving::after {
  content: ' ⏳';
}
```

---

## Pattern 4: Dashboard Loading Multiple Widgets

```javascript
async function initDashboard() {
  const loadingBar = Elements.dashboardLoadingBar;
  await loadingBar.slideDown({ duration: 200 });

  const requests = [
    { key: 'stats',  url: '/api/dashboard/stats' },
    { key: 'recent', url: '/api/dashboard/recent' },
    { key: 'alerts', url: '/api/dashboard/alerts' },
    { key: 'chart',  url: '/api/dashboard/chart-data' }
  ];

  let loaded = 0;

  const results = await AsyncHelpers.parallelAll(
    requests.map(r => AsyncHelpers.fetchJSON(r.url, { timeout: 8000 })),
    {
      failFast: false,
      onProgress: (done, total) => {
        const pct = Math.round((done / total) * 100);
        loadingBar.update({ style: { width: `${pct}%` } });
      }
    }
  );

  await loadingBar.slideUp({ duration: 300 });

  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      renderWidget(requests[i].key, result.value);
    } else {
      renderWidgetError(requests[i].key, result.reason.message);
    }
  });
}
```

---

## Pattern 5: Infinite Scroll with Throttle

```javascript
let page = 1;
let isLoading = false;

const handleScroll = AsyncHelpers.throttle(async () => {
  const { scrollY, innerHeight } = window;
  const { scrollHeight } = document.body;

  // Near the bottom?
  if (scrollY + innerHeight >= scrollHeight - 200 && !isLoading) {
    isLoading = true;
    Elements.loadMoreSpinner.fadeIn({ duration: 150 });

    try {
      const newItems = await AsyncHelpers.fetchJSON(`/api/items?page=${page + 1}`);
      if (newItems.length > 0) {
        page++;
        appendItems(newItems);
      } else {
        // No more items — stop listening
        window.removeEventListener('scroll', handleScroll);
        Elements.endOfResults.slideDown();
      }
    } finally {
      isLoading = false;
      Elements.loadMoreSpinner.fadeOut({ duration: 150 });
    }
  }
}, 200);

window.addEventListener('scroll', handleScroll);
```

---

## Pattern 6: Form with Sanitized User Content

```javascript
document.getElementById('submitCommentBtn').addEventListener('click',
  AsyncHelpers.asyncHandler(async () => {
    // Sanitize all inputs before validation
    Forms.commentForm.sanitizeAll({
      allowedTags: ['b', 'i', 'em', 'strong']
    });

    const { isValid } = Forms.commentForm.validate({
      author:  { required: true },
      content: { required: true, minLength: 10 }
    });

    if (!isValid) return;

    const result = await AsyncHelpers.fetchJSON('/api/comments', {
      method:  'POST',
      body:    Forms.commentForm.values,
      timeout: 8000
    });

    // Show the new comment inline
    const commentEl = document.createElement('div');
    commentEl.className = 'comment';
    commentEl.innerHTML = `
      <strong>${AsyncHelpers.sanitize(result.author)}</strong>
      <p>${AsyncHelpers.sanitize(result.content, { allowedTags: ['b', 'i', 'em'] })}</p>
    `;
    document.getElementById('commentsList').appendChild(commentEl);

    Animation.enhance(commentEl);
    await commentEl.fadeIn({ duration: 300 });

    Forms.commentForm.reset();
  })
);
```

---

## Pattern 7: Race Between Cache and Network

```javascript
async function loadProductCached(productId) {
  const cacheKey = `product-${productId}`;
  const cached   = sessionStorage.getItem(cacheKey);

  // Build both: cached (instant) and fresh (network)
  const fromCache = cached
    ? Promise.resolve(JSON.parse(cached))
    : null;

  const fromNetwork = AsyncHelpers.fetchJSON(`/api/products/${productId}`, {
    onSuccess: (data) => sessionStorage.setItem(cacheKey, JSON.stringify(data))
  });

  const sources = fromCache
    ? [fromCache, fromNetwork]
    : [fromNetwork];

  // Use whichever is faster (usually cache)
  const data = await AsyncHelpers.raceWithTimeout(sources, 10000);

  return data;
}
```

---

## Best Practices

### 1. Debounce User Input, Throttle Ongoing Events

```javascript
// ✅ Debounce: reacts to end of user activity
const onInput = AsyncHelpers.debounce(fetchResults, 400);
input.addEventListener('input', onInput);

// ✅ Throttle: updates regularly during continuous activity
const onScroll = AsyncHelpers.throttle(updatePosition, 100);
window.addEventListener('scroll', onScroll);
```

### 2. Always Specify Timeouts on Production Fetches

```javascript
// ✅ Explicit timeout — doesn't hang forever
const data = await AsyncHelpers.fetchJSON('/api/data', { timeout: 10000 });

// ❌ No timeout — request could hang indefinitely on slow networks
const data = await AsyncHelpers.fetchJSON('/api/data');
```

### 3. Use `parallelAll` Instead of Sequential Awaits

```javascript
// ✅ Concurrent — both happen simultaneously
const [user, posts] = await AsyncHelpers.parallelAll([
  AsyncHelpers.fetchJSON('/api/user'),
  AsyncHelpers.fetchJSON('/api/posts')
]);

// ❌ Sequential — posts wait for user to finish
const user  = await AsyncHelpers.fetchJSON('/api/user');
const posts = await AsyncHelpers.fetchJSON('/api/posts');
```

### 4. Sanitize Before Displaying User Content

```javascript
// ✅ Always sanitize user-provided content before inserting into DOM
element.innerHTML = AsyncHelpers.sanitize(userComment);

// ❌ Never directly insert user content into innerHTML
element.innerHTML = userComment; // XSS risk
```

### 5. Cancel Debounced Calls When Components Unmount

```javascript
const debouncedSearch = AsyncHelpers.debounce(fetchResults, 400);
input.addEventListener('input', debouncedSearch);

// When navigating away or removing a component:
debouncedSearch.cancel(); // prevent stale updates after unmount
```

---

## Quick Reference: The Full AsyncHelpers API

```
AsyncHelpers
├── debounce(fn, delay, opts)       → debounced function with .cancel() + .flush()
├── throttle(fn, delay, opts)       → throttled function with .cancel()
├── sanitize(input, opts)           → string (XSS-safe)
├── sleep(ms)                       → Promise<void>
├── fetch(url, opts)                → Promise<data>  (alias for enhancedFetch)
├── fetchJSON(url, opts)            → Promise<object>
├── fetchText(url, opts)            → Promise<string>
├── fetchBlob(url, opts)            → Promise<Blob>
├── asyncHandler(fn, opts)          → wrapped event listener function
├── parallelAll(promises, opts)     → Promise<results[]>
├── raceWithTimeout(promises, ms)   → Promise<first result>
├── configure(opts)                 → AsyncHelpers (chainable)
└── isDOMHelpersAvailable()         → boolean

Per-form methods (when Form module is loaded):
├── form.debounceInput(sel, fn, delay, opts) → { cancel, flush }
├── form.throttleInput(sel, fn, delay, opts) → { cancel }
├── form.sanitizeField(name, opts)  → form (chainable)
└── form.sanitizeAll(opts)          → form (chainable)

Also available on Elements, Collections, Selector:
└── Elements.debounce, fetchJSON, throttle, sleep, etc. (same API)
```
