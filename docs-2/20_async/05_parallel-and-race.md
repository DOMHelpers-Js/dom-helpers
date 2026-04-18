[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Parallel Operations and Race with Timeout

## Quick Start (30 seconds)

```javascript
// Run multiple requests concurrently
const [user, orders, settings] = await AsyncHelpers.parallelAll([
  AsyncHelpers.fetchJSON('/api/user/1'),
  AsyncHelpers.fetchJSON('/api/orders?userId=1'),
  AsyncHelpers.fetchJSON('/api/settings')
]);

// Run all, collect every result (don't fail fast)
const results = await AsyncHelpers.parallelAll([
  AsyncHelpers.fetchJSON('/api/a'),
  AsyncHelpers.fetchJSON('/api/b'),
  AsyncHelpers.fetchJSON('/api/c')
], { failFast: false });

// Use the first response that arrives, with a deadline
const data = await AsyncHelpers.raceWithTimeout([
  AsyncHelpers.fetchJSON('/api/primary'),
  AsyncHelpers.fetchJSON('/api/backup')
], 5000);
```

---

## What Is `parallelAll()`?

`parallelAll(promises, options)` runs multiple Promises **concurrently** and returns all their results. It's built on top of `Promise.all` and `Promise.allSettled`, but adds:

- **Progress tracking** — a callback that fires after each promise settles
- **`failFast` control** — choose whether one failure stops everything, or whether to collect all results

### Why Not Just Use `Promise.all`?

`Promise.all` is great, but:

- It doesn't tell you when individual promises settle — you only know when **all** are done
- If you want to collect all results (including failures) without throwing, you need `Promise.allSettled`
- `parallelAll` unifies both behaviors with one API

---

## Syntax

```javascript
const results = await AsyncHelpers.parallelAll(promises, options);
```

- `promises` — array of Promise values
- `options.failFast` — `true` (default): fail on first rejection. `false`: collect all results
- `options.onProgress` — `(completedCount, total, result) => void` — called after each promise settles

---

## Fail Fast Mode (Default)

When `failFast: true` (the default), `parallelAll` behaves like `Promise.all` — all promises run concurrently, but if **any** rejects, the whole operation rejects immediately:

```javascript
// All three run at once — if any fails, the catch block runs immediately
try {
  const [user, profile, permissions] = await AsyncHelpers.parallelAll([
    AsyncHelpers.fetchJSON('/api/users/1'),
    AsyncHelpers.fetchJSON('/api/profiles/1'),
    AsyncHelpers.fetchJSON('/api/permissions/1')
  ]);

  initializeUI(user, profile, permissions);
} catch (error) {
  console.error('One of the requests failed:', error.message);
}
```

**Use `failFast: true` when:** All results are required — if any is missing, you can't proceed.

---

## Collect All Mode

When `failFast: false`, all promises run concurrently and all results are collected — even if some fail. Each result is a `{ status, value }` or `{ status, reason }` object (same shape as `Promise.allSettled`):

```javascript
const results = await AsyncHelpers.parallelAll([
  AsyncHelpers.fetchJSON('/api/news'),
  AsyncHelpers.fetchJSON('/api/weather'),
  AsyncHelpers.fetchJSON('/api/stocks')
], { failFast: false });

// results[0] = { status: 'fulfilled', value: [...news data...] }
// results[1] = { status: 'rejected',  reason: Error('404') }
// results[2] = { status: 'fulfilled', value: {...stocks...} }

results.forEach(result => {
  if (result.status === 'fulfilled') {
    renderWidget(result.value);
  } else {
    renderErrorWidget(result.reason.message);
  }
});
```

**Use `failFast: false` when:** You want to show as much data as possible even if some sources fail (e.g., a dashboard with multiple independent widgets).

---

## Progress Tracking

The `onProgress` callback fires after each individual promise settles, giving you real-time updates:

```javascript
const total = 10;
let processed = 0;

const data = await AsyncHelpers.parallelAll(
  Array.from({ length: total }, (_, i) =>
    AsyncHelpers.fetchJSON(`/api/item/${i}`)
  ),
  {
    failFast: false,
    onProgress: (completedCount, total, result) => {
      processed = completedCount;

      // Update a progress bar
      const percent = Math.round((completedCount / total) * 100);
      Elements.progressBar.update({ style: { width: `${percent}%` } });
      Elements.progressLabel.update({ text: `${completedCount} of ${total}` });

      if (result.status === 'rejected') {
        console.warn('One request failed:', result.reason.message);
      }
    }
  }
);
```

---

## Real-World Example: Dashboard with Multiple Data Sources

```javascript
async function loadDashboard() {
  Elements.dashboardLoader.fadeIn();

  const results = await AsyncHelpers.parallelAll([
    AsyncHelpers.fetchJSON('/api/summary'),
    AsyncHelpers.fetchJSON('/api/recent-orders'),
    AsyncHelpers.fetchJSON('/api/analytics'),
    AsyncHelpers.fetchJSON('/api/notifications')
  ], {
    failFast: false,
    onProgress: (done, total) => {
      Elements.loadingProgress.update({ text: `Loading ${done}/${total}...` });
    }
  });

  await Elements.dashboardLoader.fadeOut();

  const [summary, orders, analytics, notifications] = results;

  if (summary.status   === 'fulfilled') renderSummary(summary.value);
  if (orders.status    === 'fulfilled') renderOrders(orders.value);
  if (analytics.status === 'fulfilled') renderAnalytics(analytics.value);
  if (notifications.status === 'fulfilled') renderNotifications(notifications.value);

  // Show which widgets failed to load
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      const widgetNames = ['summary', 'orders', 'analytics', 'notifications'];
      console.warn(`${widgetNames[i]} failed:`, r.reason.message);
    }
  });
}
```

---

## What Is `raceWithTimeout()`?

`raceWithTimeout(promises, timeout)` runs multiple promises and returns the value of whichever one resolves first — or throws a timeout error if none resolve within the deadline.

It's `Promise.race` with a built-in time limit.

### Syntax

```javascript
const result = await AsyncHelpers.raceWithTimeout(promises, timeout);
```

- `promises` — array of Promises
- `timeout` — milliseconds before throwing a timeout error (default: 5000)

---

## Use Cases for `raceWithTimeout`

### Primary/Fallback API

Try the primary endpoint first; if it doesn't respond fast enough, the backup takes over:

```javascript
try {
  const data = await AsyncHelpers.raceWithTimeout([
    AsyncHelpers.fetchJSON('https://api-primary.example.com/data'),
    AsyncHelpers.fetchJSON('https://api-backup.example.com/data')
  ], 3000);

  renderData(data);
} catch (error) {
  if (error.message.includes('timed out')) {
    showError('Both API endpoints are slow. Please try again later.');
  } else {
    showError('Failed to load data.');
  }
}
```

### Maximum Wait for User Action

Give the user 30 seconds to respond to a confirmation dialog — otherwise time out:

```javascript
function awaitUserConfirmation() {
  return new Promise((resolve, reject) => {
    document.getElementById('confirmBtn').onclick = () => resolve(true);
    document.getElementById('cancelBtn').onclick  = () => resolve(false);
  });
}

try {
  const confirmed = await AsyncHelpers.raceWithTimeout(
    [awaitUserConfirmation()],
    30000  // 30 second deadline
  );

  if (confirmed) processAction();
  else cancelAction();
} catch {
  console.log('User took too long — cancelling automatically');
  cancelAction();
}
```

### First Cached Response

Check cache storage and network simultaneously — use whichever returns first:

```javascript
const data = await AsyncHelpers.raceWithTimeout([
  caches.match('/api/products').then(r => r?.json()),  // cache
  AsyncHelpers.fetchJSON('/api/products')               // network
], 10000);
```

---

## Comparing `parallelAll` and `raceWithTimeout`

| | `parallelAll` | `raceWithTimeout` |
|---|---|---|
| **Returns** | All results | First result |
| **Use when** | You need every result | You need the fastest result |
| **Fail behavior** | `failFast` (configurable) | Rejects if timeout fires first |
| **Progress** | `onProgress` callback | Not applicable |

---

## Summary

### `parallelAll(promises, opts)`

- Runs all promises concurrently
- `failFast: true` (default) — stops on first failure (like `Promise.all`)
- `failFast: false` — collects all results, including failures (like `Promise.allSettled`)
- `onProgress` — fires after each individual promise settles

### `raceWithTimeout(promises, timeout)`

- Returns the first promise to resolve
- Throws an error if none resolve within the timeout
- Great for primary/fallback patterns and hard deadlines

**Simple rule:**
> Use `parallelAll` when you want **all** the results.
> Use `raceWithTimeout` when you want **the fastest** result within a time limit.
