[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Debounce and Throttle

## Quick Start (30 seconds)

```javascript
// Debounce: wait until user stops typing for 400ms, then search
const handleSearch = AsyncHelpers.debounce((e) => {
  fetchResults(e.target.value);
}, 400);

document.getElementById('searchInput').addEventListener('input', handleSearch);

// Throttle: handle scroll at most once every 200ms
const handleScroll = AsyncHelpers.throttle(() => {
  updateScrollProgress();
}, 200);

window.addEventListener('scroll', handleScroll);
```

---

## The Problem They Both Solve

Some events fire many times in rapid succession: `scroll`, `resize`, `input`, `mousemove`. Without rate-limiting, your handler could fire dozens or hundreds of times per second — overwhelming the browser, flooding your server, or causing jank.

```javascript
// This fires on EVERY keystroke — potentially 10+ times per second
document.getElementById('searchInput').addEventListener('input', (e) => {
  fetch(`/api/search?q=${e.target.value}`); // 🔥 A new request every keystroke
});
```

**Debounce** and **throttle** are two different strategies for managing this:

```
Rapid calls:  ─── ─ ─── ──── ─ ──── ───── time →

Debounce:     (waits for quiet period, then fires once)
              ───────────────────────────────── FIRE!

Throttle:     (fires at most once per interval)
              FIRE! ────── FIRE! ─────── FIRE!
```

---

## What Is Debounce?

`debounce` delays the execution of a function until a specified **quiet period** has passed since the last call. If the function is called again before the timer expires, the timer resets.

**Best for:** Reacting to the *end* of a burst of activity.

- Search as you type (wait for user to stop typing)
- Window resize (wait for user to finish resizing)
- Auto-save (wait before saving)

### Syntax

```javascript
const debounced = AsyncHelpers.debounce(func, delay, options);
```

- `func` — the function to debounce
- `delay` — milliseconds to wait after the last call (default: 300)
- `options` — `{ immediate, maxWait }`

### Basic Examples

```javascript
// Search after user stops typing for 400ms
const search = AsyncHelpers.debounce(async (e) => {
  const results = await AsyncHelpers.fetchJSON(`/api/search?q=${e.target.value}`);
  renderResults(results);
}, 400);

document.getElementById('searchInput').addEventListener('input', search);
```

```javascript
// Auto-save after 2 seconds of inactivity
const autoSave = AsyncHelpers.debounce(() => {
  Forms.articleForm.submitData({ url: '/api/drafts', validate: false });
}, 2000);

document.getElementById('articleContent').addEventListener('input', autoSave);
```

```javascript
// Handle resize only after user finishes resizing
const handleResize = AsyncHelpers.debounce(() => {
  recalculateLayout();
}, 300);

window.addEventListener('resize', handleResize);
```

---

## Debounce Options

### `immediate: true` — Fire on the Leading Edge

By default, `debounce` fires at the **trailing edge** (after the quiet period). With `immediate: true`, it fires immediately on the **first** call, then ignores further calls until the quiet period passes:

```javascript
// Leading edge — fires immediately, ignores for 500ms
const handleBtnClick = AsyncHelpers.debounce(() => {
  submitForm();
}, 500, { immediate: true });

// First click fires immediately
// Subsequent clicks within 500ms are ignored
```

```
Calls:      CALL ─── CALL CALL ─────────── CALL
Leading:    FIRE ─── (ignored) ────────── FIRE
Trailing:   ─────────────────────── FIRE ─────
```

### `maxWait` — Force Execution After a Maximum Time

`maxWait` ensures the function fires eventually, even if calls keep coming in. Without `maxWait`, a continuously firing event could prevent the function from ever running:

```javascript
// Fire at most every 1000ms, even if user keeps typing
const syncDraft = AsyncHelpers.debounce(() => {
  saveDraftToServer();
}, 300, { maxWait: 1000 });

// If user types continuously for 5 seconds:
// Without maxWait: function never fires until they stop
// With maxWait:    function fires every 1000ms regardless
```

---

## The `.cancel()` and `.flush()` Methods

Every debounced function has two extra methods:

### `.cancel()` — Cancel a Pending Call

```javascript
const search = AsyncHelpers.debounce(fetchResults, 400);

// Start a search
search('javascript');

// User navigated away — cancel the pending search
search.cancel(); // fetchResults will NOT be called
```

### `.flush()` — Execute Immediately If Pending

```javascript
const autoSave = AsyncHelpers.debounce(saveToServer, 2000);

// User edited the content
autoSave(); // schedules a save in 2 seconds

// User clicked "Save Now"
autoSave.flush(); // saves immediately, cancels the timer
```

---

## What Is Throttle?

`throttle` limits a function to run **at most once per interval**. Unlike debounce (which delays until the burst stops), throttle executes at regular intervals throughout the burst.

**Best for:** Tracking *continuous* activity at a reasonable rate.

- Scroll-based animations (update at most 5x per second)
- Mouse tracking (don't track every pixel movement)
- Live chart updates (update at most once per second)

### Syntax

```javascript
const throttled = AsyncHelpers.throttle(func, delay, options);
```

- `func` — the function to throttle
- `delay` — minimum milliseconds between executions (default: 200)
- `options` — `{ leading, trailing }`

### Basic Examples

```javascript
// Update scroll indicator at most once per 100ms
const updateProgress = AsyncHelpers.throttle(() => {
  const scrolled = window.scrollY / document.body.scrollHeight;
  document.getElementById('progressBar').style.width = (scrolled * 100) + '%';
}, 100);

window.addEventListener('scroll', updateProgress);
```

```javascript
// Track mouse position at most 10 times per second
const trackMouse = AsyncHelpers.throttle((e) => {
  sendAnalytics({ x: e.clientX, y: e.clientY });
}, 100);

document.addEventListener('mousemove', trackMouse);
```

---

## Throttle Options

### `leading` and `trailing`

Control whether the function fires at the start and/or end of each interval:

```javascript
// Both leading and trailing (default)
const throttled = AsyncHelpers.throttle(fn, 200, {
  leading:  true,   // fire immediately on the first call
  trailing: true    // also fire once more after the last call
});

// Leading only — fires immediately, no trailing call
const immediate = AsyncHelpers.throttle(fn, 200, {
  leading:  true,
  trailing: false
});

// Trailing only — delays the first call, no leading fire
const delayed = AsyncHelpers.throttle(fn, 200, {
  leading:  false,
  trailing: true
});
```

### `.cancel()` — Cancel Pending Trailing Call

```javascript
const throttled = AsyncHelpers.throttle(fn, 200);

// Cancel any scheduled trailing call
throttled.cancel();
```

---

## Debounce vs Throttle: The Right Tool

| Situation | Use | Why |
|---|---|---|
| Search as you type | `debounce` | Wait for user to finish |
| Auto-save drafts | `debounce` | Wait for pause in editing |
| Window resize handler | `debounce` | React to final size |
| Scroll-based animations | `throttle` | Smooth but rate-limited |
| Real-time data sync | `throttle` | Regular intervals, not just at the end |
| Mouse/touch tracking | `throttle` | Not every pixel — just regularly |
| Button click guard | `debounce` with `immediate: true` | Fire once, ignore duplicates |

---

## Real-World Example: Combined Debounce + Throttle

```javascript
// Live search with debounced fetch AND throttled UI updates
const updateResultsUI = AsyncHelpers.throttle((results) => {
  renderSearchResults(results); // update DOM at most 10 times/sec
}, 100);

const search = AsyncHelpers.debounce(async (query) => {
  if (!query.trim()) return;
  const results = await AsyncHelpers.fetchJSON(`/api/search?q=${encodeURIComponent(query)}`);
  updateResultsUI(results); // throttled UI update
}, 400); // debounced API call

document.getElementById('searchBox').addEventListener('input', (e) => {
  search(e.target.value);
});
```

---

## Using Debounce on Forms

When the Form module is loaded, forms get `debounceInput` and `throttleInput` convenience methods:

```javascript
// Attach a debounced handler to a form field
const { cancel, flush } = Forms.searchForm.debounceInput(
  '[name="query"]',   // field selector
  (e) => { search(e.target.value); }, // handler
  400                 // delay
);

// Attach a throttled handler
Forms.liveForm.throttleInput(
  '[name="amount"]',
  (e) => { updatePreview(e.target.value); },
  200
);
```

---

## Summary

### Debounce

- Waits for quiet period after the last call, then fires once
- `immediate: true` — fire on the first call instead of the last
- `maxWait` — force execution after a maximum waiting time
- `.cancel()` — cancel a pending call
- `.flush()` — execute immediately and cancel the timer

### Throttle

- Fires at most once per delay interval
- `leading: true` (default) — fire on the first call
- `trailing: true` (default) — fire once more after the last call
- `.cancel()` — cancel any pending trailing call

**Simple rule to remember:**
> Use **debounce** when you care about the *end* of a burst.
> Use **throttle** when you want *regular* updates throughout a burst.
