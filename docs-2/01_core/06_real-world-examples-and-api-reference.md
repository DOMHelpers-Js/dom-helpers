[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Real-World Examples and API Reference

You've learned the three helpers — `Elements`, `Collections`, and `Selector` — and the universal `.update()` method that ties them together. Now let's see them work as a team on real-world problems.

Every example below is complete and runnable. Each one deliberately uses a mix of helpers to show how they complement each other in practice.

---

## How to Read These Examples

As you go through these examples, notice three things:

1. **`Elements`** handles specific named elements (by ID)
2. **`Collections`** handles groups of elements that share a trait
3. **`Selector`** handles complex targeting — scoped searches, CSS combinators, pseudo-classes
4. **`.update()`** is used for all state changes — keeping the intent clear and readable

---

## Example 1: User Profile Page

A profile page that loads user data from an API and populates the entire UI in one call.

```html
<div id="profileCard" class="card loading">
  <img id="avatar" src="placeholder.jpg" alt="User avatar">
  <h1 id="userName">Loading...</h1>
  <p id="userEmail">Please wait</p>
  <p id="userBio">Loading biography...</p>
  <span id="userStatus" class="status">offline</span>
  <button id="followBtn" disabled>Follow</button>
  <div id="statsBar">
    <span id="postCount">-</span>
    <span id="followerCount">-</span>
    <span id="followingCount">-</span>
  </div>
</div>
```

```javascript
async function loadProfile(userId) {
  const user = await fetch('/api/users/' + userId).then(r => r.json());

  // Update all text, properties, and attributes in one call
  Elements.update({
    userName:       { textContent: user.name },
    userEmail:      { textContent: user.email },
    userBio:        { textContent: user.bio || 'No biography yet.' },
    userStatus:     {
      textContent: user.isOnline ? 'online' : 'offline',
      className:   'status ' + (user.isOnline ? 'online' : 'offline')
    },
    avatar:         { setAttribute: { src: user.avatarUrl, alt: user.name + ' avatar' } },
    followBtn:      { disabled: false, textContent: user.isFollowing ? 'Unfollow' : 'Follow' },
    postCount:      { textContent: user.stats.posts.toLocaleString() },
    followerCount:  { textContent: user.stats.followers.toLocaleString() },
    followingCount: { textContent: user.stats.following.toLocaleString() }
  });

  // Remove loading state from the card
  Elements.profileCard.update({
    classList: { remove: 'loading', add: 'loaded' }
  });
}

loadProfile(42);
```

**What's happening here:**
- One `Elements.update()` call updates 9 elements simultaneously
- `.setAttribute` handles the `<img>` tag's `src` and `alt` in one step
- The `userStatus` uses `className` to replace the entire class string
- After the data loads, the card's loading spinner is removed with a `classList` update

---

## Example 2: Multi-Step Form Wizard

A form with three steps, each with its own validation. Notice how `Collections` handles all steps at once while `Elements` and `Selector` handle individual steps.

```html
<div id="step1" class="step active">
  <input id="nameInput" name="fullName" required>
  <input id="emailInput" name="email" type="email" required>
  <button id="step1Next" class="step-btn next-btn">Next</button>
</div>

<div id="step2" class="step">
  <input id="phoneInput" name="phone">
  <select id="countrySelect" name="country"></select>
  <button id="step2Next" class="step-btn next-btn">Next</button>
  <button id="step2Back" class="step-btn back-btn">Back</button>
</div>

<div id="step3" class="step">
  <div id="reviewSummary"></div>
  <button id="submitBtn" class="step-btn">Submit</button>
</div>
```

```javascript
let currentStep = 1;

function goToStep(stepNumber) {
  // Hide all steps — Collections handles the whole group at once
  Collections.ClassName.step.update({
    classList: { remove: 'active' },
    style:     { display: 'none' }
  });

  // Show only the target step — Elements handles the specific one
  Elements['step' + stepNumber].update({
    classList: { add: 'active' },
    style:     { display: 'block' }
  });

  currentStep = stepNumber;
}

function validateCurrentStep() {
  // Selector.Scoped targets ONLY inputs inside the current step
  const required = Selector.Scoped.withinAll('#step' + currentStep, 'input[required]');
  const allFilled = required.every(input => input.value.trim() !== '');

  // Enable/disable the next button for just this step
  const nextBtn = Selector.Scoped.within('#step' + currentStep, '.next-btn');
  if (nextBtn) {
    nextBtn.update({ disabled: !allFilled });
  }

  return allFilled;
}

// Wire up events to ALL next/back buttons at once via Collections
Collections.ClassName['next-btn'].on('click', () => {
  if (validateCurrentStep()) {
    goToStep(currentStep + 1);
  }
});

Collections.ClassName['back-btn'].on('click', () => {
  goToStep(currentStep - 1);
});
```

**What's happening here:**
- `Collections.ClassName.step` hides all steps in one call
- `Elements['step' + stepNumber]` targets the specific step dynamically
- `Selector.Scoped.withinAll()` validates only the required fields *inside* the current step — not inputs on the whole page
- `Collections.ClassName['next-btn'].on()` attaches a click handler to all next buttons at once

---

## Example 3: Real-Time Search Results

A search box with debouncing, loading state, empty state handling, and dynamic result list.

```html
<input id="searchBox" type="text" placeholder="Search...">
<div id="searchStatus" class="status-msg"></div>
<div id="resultsContainer">
  <div id="emptyState" class="hidden">No results found.</div>
  <ul id="resultsList"></ul>
</div>
```

```javascript
let searchTimeout;

function handleSearch(query) {
  clearTimeout(searchTimeout);

  if (!query.trim()) {
    // Clear state when input is empty
    Elements.update({
      searchStatus: { textContent: '' },
      emptyState:   { classList: { add: 'hidden' } },
      resultsList:  { innerHTML: '' }
    });
    return;
  }

  // Show loading indicator
  Elements.searchStatus.update({
    textContent: 'Searching...',
    classList:   { add: 'loading' }
  });

  // Debounce — wait 300ms after user stops typing
  searchTimeout = setTimeout(async () => {
    const results = await fetch('/api/search?q=' + encodeURIComponent(query))
      .then(r => r.json());

    // Update result count
    Elements.searchStatus.update({
      textContent: results.length + ' result' + (results.length !== 1 ? 's' : '') + ' found',
      classList:   { remove: 'loading' }
    });

    // Show or hide the empty state
    Elements.emptyState.update({
      classList: results.length === 0 ? { remove: 'hidden' } : { add: 'hidden' }
    });

    // Render results
    Elements.resultsList.update({
      innerHTML: results.map(r =>
        `<li data-id="${r.id}">
          <strong>${r.title}</strong>
          <span class="result-meta">${r.category}</span>
        </li>`
      ).join('')
    });

    // Attach click handlers to all results — no duplicates guaranteed
    Selector.queryAll('#resultsList li').on('click', (e) => {
      const id = e.currentTarget.dataset.id;
      navigateTo(id);
    });
  }, 300);
}

// Set up the search input listener
Elements.searchBox.update({
  addEventListener: {
    input: (e) => handleSearch(e.target.value)
  }
});
```

**What's happening here:**
- Three elements are cleared in one `Elements.update()` call when the query empties
- `classList` handles showing/hiding the empty state cleanly
- `innerHTML` renders the whole result list in one operation
- `Selector.queryAll('#resultsList li').on('click', ...)` attaches a handler to every result item — safely, without duplicates

---

## Example 4: Dark Mode Toggle

A theme switch that persists to localStorage and updates the entire page at once.

```html
<button id="themeToggle" aria-label="Toggle dark mode">🌙</button>
```

```javascript
function applyTheme(theme) {
  const isDark = theme === 'dark';

  // Update the body — native classList since it's not in our helpers
  document.body.classList.toggle('theme-dark',  isDark);
  document.body.classList.toggle('theme-light', !isDark);

  // Update the toggle button
  Elements.themeToggle.update({
    textContent:  isDark ? '☀️' : '🌙',
    setAttribute: { 'aria-label': isDark ? 'Switch to light mode' : 'Switch to dark mode' },
    dataset:      { theme }
  });

  // Update all themed elements at once — Selector handles the complex targeting
  Selector.update({
    '.card':     { classList: isDark ? { add: 'dark' }    : { remove: 'dark' } },
    '.panel':    { classList: isDark ? { add: 'dark' }    : { remove: 'dark' } },
    '.nav-link': { style:     { color: isDark ? '#e0e0e0' : '#333' } },
    'code, pre': { style:     { backgroundColor: isDark ? '#1a1a2e' : '#f0f0f0' } }
  });

  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const current = localStorage.getItem('theme') || 'light';
  applyTheme(current === 'light' ? 'dark' : 'light');
}

// Apply saved preference on load
applyTheme(localStorage.getItem('theme') || 'light');

// Wire toggle button
Elements.themeToggle.update({
  addEventListener: { click: toggleTheme }
});
```

**What's happening here:**
- `Elements` handles the specific toggle button
- `Selector.update()` handles complex multi-class, multi-property updates across the page
- `dataset` sets the `data-theme` attribute cleanly
- `localStorage` persistence works as normal — DOMHelpers doesn't interfere

---

## Example 5: Data Table with Row Actions

A table that loads data, renders rows, and handles per-row edit and delete actions.

```html
<table id="dataTable">
  <thead>
    <tr><th>Name</th><th>Status</th><th>Actions</th></tr>
  </thead>
  <tbody id="tableBody"></tbody>
</table>
<div id="noDataMsg" class="hidden">No data available.</div>
```

```javascript
async function loadTable() {
  const data = await fetch('/api/records').then(r => r.json());

  // Show/hide the empty state
  Elements.noDataMsg.update({
    classList: data.length === 0 ? { remove: 'hidden' } : { add: 'hidden' }
  });

  // Render all rows
  Elements.tableBody.update({
    innerHTML: data.map(row => `
      <tr data-id="${row.id}" class="table-row">
        <td>${row.name}</td>
        <td><span class="badge badge-${row.status}">${row.status}</span></td>
        <td>
          <button class="action-btn edit-btn"   data-id="${row.id}">Edit</button>
          <button class="action-btn delete-btn" data-id="${row.id}">Delete</button>
        </td>
      </tr>
    `).join('')
  });

  // Attach handlers to ALL edit buttons at once
  Collections.ClassName['edit-btn'].on('click', (e) => {
    openEditModal(e.currentTarget.dataset.id);
  });

  // Attach handlers to ALL delete buttons at once
  Collections.ClassName['delete-btn'].on('click', (e) => {
    const id  = e.currentTarget.dataset.id;
    const row = Selector.query(`tr[data-id="${id}"]`);

    if (row) {
      row.update({ classList: { add: 'deleting' } });
      deleteRecord(id);
    }
  });
}

function deleteRecord(id) {
  fetch('/api/records/' + id, { method: 'DELETE' }).then(() => {
    // Selector finds the row by its data-id attribute
    const row = Selector.query(`tr[data-id="${id}"]`);
    row?.remove();
  });
}
```

**What's happening here:**
- `Elements.tableBody` renders the whole table in one `innerHTML` update
- `Collections.ClassName['edit-btn'].on()` attaches a handler to every edit button at once — after the rows are rendered
- `Selector.query('tr[data-id="' + id + '"]')` targets the specific row by its attribute value — something `Elements` and `Collections` can't do

---

## Example 6: Notification System

A system that shows, stacks, and auto-dismisses notifications — with animation support.

```html
<div id="notifContainer" aria-live="polite"></div>
```

```javascript
let notifCount = 0;

function showNotification(message, type = 'info', duration = 4000) {
  notifCount++;
  const id = 'notif-' + notifCount;

  // Inject the notification into the container
  const container = Elements.notifContainer;
  container.insertAdjacentHTML('beforeend', `
    <div id="${id}" class="notif notif-${type}" role="alert">
      <span class="notif-message">${message}</span>
      <button class="notif-close" data-notif="${id}" aria-label="Close">×</button>
    </div>
  `);

  // Animate in after the element is in the DOM
  requestAnimationFrame(() => {
    Elements[id].update({ classList: { add: 'visible' } });
  });

  // Wire close button — scoped inside this specific notification
  Selector.query('#' + id + ' .notif-close').update({
    addEventListener: { click: () => dismissNotification(id) }
  });

  // Auto-dismiss after duration (if duration > 0)
  if (duration > 0) {
    setTimeout(() => dismissNotification(id), duration);
  }
}

function dismissNotification(id) {
  const notif = Elements[id];
  if (!notif) return; // Already dismissed

  notif.update({ classList: { remove: 'visible', add: 'hiding' } });
  setTimeout(() => notif.remove(), 300); // Remove after CSS transition
}

// Usage
showNotification('Profile saved!', 'success');
showNotification('Connection lost — retrying...', 'warning', 0); // No auto-dismiss
showNotification('Failed to load data.', 'error');
```

**What's happening here:**
- Notifications are dynamically created with unique IDs, then accessed via `Elements[id]`
- `Selector.query('#' + id + ' .notif-close')` scopes the close button search to this specific notification
- `requestAnimationFrame` ensures the CSS transition plays correctly after the element is in the DOM
- `Elements[id]` checks gracefully return `null` if the notification was already removed

---

## Example 7: Accordion / Collapsible Panels

Click a header to expand/collapse a panel — with proper ARIA attributes.

```html
<div class="accordion">
  <div class="accordion-item">
    <button class="accordion-header" data-target="panel1">Section 1</button>
    <div id="panel1" class="accordion-panel">Content 1</div>
  </div>
  <div class="accordion-item">
    <button class="accordion-header" data-target="panel2">Section 2</button>
    <div id="panel2" class="accordion-panel">Content 2</div>
  </div>
</div>
```

```javascript
function initAccordion() {
  Collections.ClassName['accordion-header'].on('click', (e) => {
    const targetId = e.currentTarget.dataset.target;
    const panel    = Elements[targetId];
    const isOpen   = panel.classList.contains('open');

    // Close ALL panels — Collections handles the group
    Collections.ClassName['accordion-panel'].update({
      classList: { remove: 'open' },
      style:     { maxHeight: '0' }
    });
    Collections.ClassName['accordion-header'].update({
      setAttribute: { 'aria-expanded': 'false' }
    });

    // Open the clicked panel — only if it was previously closed
    if (!isOpen) {
      panel.update({
        classList: { add: 'open' },
        style:     { maxHeight: panel.scrollHeight + 'px' }
      });
      e.currentTarget.update({
        setAttribute: { 'aria-expanded': 'true' }
      });
    }
  });
}

initAccordion();
```

**What's happening here:**
- `Collections` closes all panels and all headers in two efficient calls
- `Elements[targetId]` opens the specific panel based on the button's `data-target`
- `aria-expanded` is managed correctly for screen readers using `setAttribute`
- `panel.scrollHeight` is used to animate the panel open to its natural height

---

## Complete API Reference

### Elements Helper

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `Elements.id` | `Elements.elementId` | `HTMLElement \| null` | Access element by ID via property |
| `Elements.update()` | `update(idUpdateMap)` | `Object` | Bulk update multiple elements by ID |
| `Elements.get()` | `get(id, fallback)` | `HTMLElement \| fallback` | Safe access with fallback value |
| `Elements.exists()` | `exists(id)` | `boolean` | Check if element exists in DOM |
| `Elements.destructure()` | `destructure(...ids)` | `Object` | Get multiple elements as named object |
| `Elements.getRequired()` | `getRequired(...ids)` | `Object` | Get multiple or throw if any missing |
| `Elements.waitFor()` | `waitFor(...ids)` | `Promise<Object>` | Wait up to 5s for elements to appear |
| `Elements.getMultiple()` | `getMultiple(...ids)` | `Object` | Alias for `destructure` |
| `Elements.setProperty()` | `setProperty(id, prop, val)` | `boolean` | Set a property; returns false if element missing |
| `Elements.getProperty()` | `getProperty(id, prop, fb)` | `any` | Get a property with optional fallback |
| `Elements.setAttribute()` | `setAttribute(id, attr, val)` | `boolean` | Set an attribute |
| `Elements.getAttribute()` | `getAttribute(id, attr, fb)` | `string \| null` | Get an attribute with optional fallback |
| `Elements.isCached()` | `isCached(id)` | `boolean` | Check if ID is currently in cache |
| `Elements.stats()` | `stats()` | `Object` | Cache hit/miss stats |
| `Elements.clear()` | `clear()` | `void` | Clear the element cache |
| `Elements.destroy()` | `destroy()` | `void` | Disconnect observer, clear cache |
| `Elements.configure()` | `configure(options)` | `Elements` | Update helper configuration options |

---

### Collections Helper

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `Collections.ClassName.x` | `ClassName.className` | Collection | Get elements by CSS class |
| `Collections.TagName.x` | `TagName.tagName` | Collection | Get elements by tag name |
| `Collections.Name.x` | `Name.nameValue` | Collection | Get elements by name attribute |
| `Collections.update()` | `update(identifierMap)` | `Object` | Bulk update with `class:`, `tag:`, `name:` prefixes |
| `Collections.getMultiple()` | `getMultiple(requests)` | `Object` | Get multiple typed collections |
| `Collections.waitFor()` | `waitFor(type, value, min, timeout)` | `Promise<Collection>` | Wait for collection with min element count |
| `Collections.isCached()` | `isCached(type, value)` | `boolean` | Check if collection is cached |
| `Collections.stats()` | `stats()` | `Object` | Cache performance stats |
| `Collections.clear()` | `clear()` | `void` | Clear all cached collections |
| `Collections.destroy()` | `destroy()` | `void` | Disconnect observer, clear cache |

**Collection instance methods (returned by `ClassName` / `TagName` / `Name`):**

| Method | Returns | Description |
|--------|---------|-------------|
| `.update(updateObj)` | Collection | Update all elements (with change detection) |
| `.forEach(fn)` | void | Iterate over all elements |
| `.map(fn)` | Array | Transform elements into new array |
| `.filter(fn)` | Array | Filter elements by condition |
| `.find(fn)` | HTMLElement | Find first matching element |
| `.some(fn)` | boolean | Check if any element matches |
| `.every(fn)` | boolean | Check if all elements match |
| `.reduce(fn, init)` | any | Reduce elements to a value |
| `.toArray()` | Array | Convert to plain JavaScript array |
| `.first()` | HTMLElement | First element or null |
| `.last()` | HTMLElement | Last element or null |
| `.at(index)` | HTMLElement | Element at index (supports negative) |
| `.isEmpty()` | boolean | True if no elements found |
| `.item(index)` | HTMLElement | Element at index |
| `.addClass(cls)` | Collection | Add class to all elements |
| `.removeClass(cls)` | Collection | Remove class from all elements |
| `.toggleClass(cls)` | Collection | Toggle class on all elements |
| `.setProperty(prop, val)` | Collection | Set property on all elements |
| `.setAttribute(attr, val)` | Collection | Set attribute on all elements |
| `.setStyle(stylesObj)` | Collection | Set styles on all elements |
| `.on(event, handler)` | Collection | Add event listener to all elements |
| `.off(event, handler)` | Collection | Remove event listener from all elements |
| `.visible()` | Array | Filter to visible elements |
| `.hidden()` | Array | Filter to hidden elements |
| `.enabled()` | Array | Filter to enabled elements |
| `.disabled()` | Array | Filter to disabled elements |
| `.length` | number | Number of elements |

---

### Selector Helper

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `Selector.query()` | `query(cssSelector)` | `HTMLElement \| null` | First match for CSS selector |
| `Selector.queryAll()` | `queryAll(cssSelector)` | Collection | All matches for CSS selector |
| `Selector.Scoped.within()` | `within(container, selector)` | `HTMLElement \| null` | Scoped querySelector |
| `Selector.Scoped.withinAll()` | `withinAll(container, selector)` | Collection | Scoped querySelectorAll |
| `Selector.update()` | `update(selectorUpdateMap)` | `Object` | Bulk update with CSS selectors as keys |
| `Selector.waitFor()` | `waitFor(selector, timeout)` | `Promise<HTMLElement>` | Wait for selector match |
| `Selector.waitForAll()` | `waitForAll(selector, min, timeout)` | `Promise<Collection>` | Wait for selector match with min count |
| `Selector.stats()` | `stats()` | `Object` | Cache stats with selector breakdown |
| `Selector.clear()` | `clear()` | `void` | Clear selector cache |
| `Selector.destroy()` | `destroy()` | `void` | Disconnect observer, clear cache |
| `Selector.configure()` | `configure(options)` | `Selector` | Update helper configuration options |

---

### `.update()` — All Update Types

| Key | Value type | What happens |
|-----|-----------|--------------|
| `textContent` | string | Sets text; skips if same value |
| `innerText` | string | Sets visible text; skips if same value |
| `innerHTML` | string | Sets HTML; skips if same value |
| `style` | `{ prop: value }` | Sets only changed style properties |
| `classList` | `{ add, remove, toggle, replace }` | Manages CSS classes |
| `setAttribute` | `{ attr: val }` or `[attr, val]` | Sets attributes; skips if same value |
| `removeAttribute` | string or string[] | Removes attribute(s) if they exist |
| `getAttribute` | string | Reads attribute and logs it (debug) |
| `addEventListener` | object or `[event, fn, opts]` | Adds listener; never duplicates |
| `removeEventListener` | `[event, fn, opts]` | Removes tracked listener |
| `dataset` | `{ key: val }` | Sets `data-*` attributes; skips if same value |
| Any method name | args array or single arg | Calls `element.method(...args)` |
| Any property name | value | Sets property if changed (deep equal check) |
| Unknown string key | string/number/boolean | Falls back to `setAttribute(key, value)` |

---

## Common Configuration Options

All three helpers accept an options object for tuning behavior:

```javascript
// Configure on init (defaults shown)
Elements.configure({
  enableLogging:   false,   // Log cache hits/misses to console
  autoCleanup:     true,    // Run periodic stale-entry cleanup
  cleanupInterval: 30000,   // ms between cleanups (30 seconds)
  maxCacheSize:    1000,    // Max entries before oldest is evicted
  debounceDelay:   16       // ms to debounce MutationObserver (1 animation frame)
});

Collections.configure({
  // Same options as Elements
});

Selector.configure({
  // Same options as Elements, plus:
  enableSmartCaching:   true,  // Use MutationObserver for cache invalidation
  enableEnhancedSyntax: true   // Enable proxy-based property access
});
```

---

## Choosing the Right Tool — Quick Reference

```
Need one specific element you know by ID?
   → Elements.submitBtn  (or Elements.get / exists / getRequired / waitFor)

Need all elements sharing a class?
   → Collections.ClassName.btn

Need all elements sharing a tag?
   → Collections.TagName.input

Need all elements sharing a name attribute?
   → Collections.Name.email

Need complex CSS targeting (combinators, pseudo-classes, attributes)?
   → Selector.query() / Selector.queryAll()

Need to search inside a specific container?
   → Selector.Scoped.within() / withinAll()

Need to update multiple named elements at once?
   → Elements.update({ id1: {...}, id2: {...} })

Need to update multiple collections at once?
   → Collections.update({ 'class:btn': {...}, 'tag:p': {...} })

Need to update multiple CSS-targeted groups at once?
   → Selector.update({ '.card': {...}, 'input[required]': {...} })
```

---

## Congratulations! 🎉

You've completed the DOMHelpers Core documentation. You now understand:

✅ What DOMHelpers Core is — one file, three helpers
✅ **Elements** — ID-based access with caching and `.update()`
✅ **Collections** — class/tag/name groups with array methods and DOM helpers
✅ **Selector** — full CSS selector power with scoping and async waiting
✅ **`.update()`** — 13 update types with change detection and no duplicate listeners
✅ Seven real-world examples across common UI patterns
✅ The complete API reference for all three helpers

**Next Steps:**
- Explore the `07_Elements_Access_Methods` section for a deep-dive into each Elements method with more patterns and edge cases
- See the `Collections` and `Selector` deep-dive sections for advanced usage
- The reactive layer: `ReactiveUtils` adds live data binding on top of these helpers

Happy coding! 🚀