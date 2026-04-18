[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Async Handler, Sleep, and Sanitize

## Quick Start (30 seconds)

```javascript
// asyncHandler — auto-manages loading state on button click
button.addEventListener('click', AsyncHelpers.asyncHandler(async (e) => {
  await AsyncHelpers.sleep(500); // wait half a second
  await saveData();
}, { loadingClass: 'saving' }));

// sleep — pause async execution
async function init() {
  showSplashScreen();
  await AsyncHelpers.sleep(2000);  // show for 2 seconds
  hideSplashScreen();
}

// sanitize — clean user input to prevent XSS
const safeHtml = AsyncHelpers.sanitize(userInput, {
  allowedTags: ['b', 'i', 'em', 'strong']
});
```

---

## `asyncHandler()` — Async Event Listeners with Loading States

### What Is It?

`asyncHandler` wraps an **async event listener** so that while the async work is running, the event's target element automatically receives a loading CSS class and a data attribute. Both are removed when the work finishes — whether it succeeded or failed.

### The Problem Without `asyncHandler`

```javascript
button.addEventListener('click', async (e) => {
  // Add loading state
  button.classList.add('loading');
  button.setAttribute('data-loading', 'true');

  try {
    await saveData();
  } catch (error) {
    console.error(error);
  } finally {
    // Remove loading state — must remember to do this in finally!
    button.classList.remove('loading');
    button.removeAttribute('data-loading');
  }
});
```

**Problems:**
❌ Boilerplate for every async event handler
❌ Easy to forget the `finally` block — loading state gets stuck
❌ Must manually reference the element

### With `asyncHandler`

```javascript
button.addEventListener('click', AsyncHelpers.asyncHandler(async (e) => {
  await saveData();
  // Loading state is removed automatically, even if this throws
}));
```

✅ Loading class and attribute managed automatically
✅ Always cleaned up in `finally` — never gets stuck
✅ Clean, focused handler code

---

### Syntax

```javascript
AsyncHelpers.asyncHandler(handler, options)
```

- `handler` — an async function `(event, ...args) => Promise`
- `options.loadingClass` — CSS class to add to the element (default: `'loading'`)
- `options.loadingAttribute` — data attribute to set (default: `'data-loading'`)
- `options.errorHandler` — function called if the handler throws `(error, event) => void`

### Examples

#### Basic Usage

```javascript
document.getElementById('saveBtn').addEventListener('click',
  AsyncHelpers.asyncHandler(async (e) => {
    await AsyncHelpers.fetchJSON('/api/save', {
      method: 'POST',
      body: Forms.myForm.values
    });
    console.log('Saved!');
  })
);
```

The button element gets `class="loading"` and `data-loading="true"` while saving, then both are removed automatically.

#### Custom Loading Class

```javascript
submitBtn.addEventListener('click',
  AsyncHelpers.asyncHandler(async (e) => {
    await processOrder();
  }, {
    loadingClass:     'btn-submitting',
    loadingAttribute: 'data-submitting'
  })
);
```

#### With Error Handling

```javascript
deleteBtn.addEventListener('click',
  AsyncHelpers.asyncHandler(async (e) => {
    if (!confirm('Are you sure?')) return;
    await deleteItem(itemId);
    item.remove();
  }, {
    errorHandler: (error, event) => {
      console.error('Delete failed:', error.message);
      showErrorBanner('Could not delete. Please try again.');
    }
  })
);
```

#### CSS for the Loading State

```css
/* Style the button while its async handler is running */
.loading {
  opacity: 0.7;
  cursor: not-allowed;
  pointer-events: none;
}

/* Or with attribute selector */
[data-loading="true"] {
  position: relative;
}
[data-loading="true"]::after {
  content: ' ⏳';
}
```

---

## `sleep()` — Promise-Based Delay

### What Is It?

`sleep(ms)` pauses async execution for a specified number of milliseconds. It's simply a `Promise` that resolves after `ms` milliseconds — the async-friendly equivalent of "wait a moment."

### Syntax

```javascript
await AsyncHelpers.sleep(milliseconds);
```

### Examples

```javascript
// Wait 1 second
await AsyncHelpers.sleep(1000);

// Show a success message for 2 seconds, then redirect
async function handleSuccess() {
  showSuccessMessage('Account created!');
  await AsyncHelpers.sleep(2000);
  window.location.href = '/onboarding';
}

// Artificial delay between animations
async function animateSteps() {
  await Elements.step1.fadeIn();
  await AsyncHelpers.sleep(500);   // pause between steps
  await Elements.step2.fadeIn();
  await AsyncHelpers.sleep(500);
  await Elements.step3.fadeIn();
}
```

### Inside Animation Chains

`sleep` is already built into the animation chain as `.delay()`, but you can use it inside `.next()` callbacks for more complex logic:

```javascript
await Elements.notification
  .animate()
  .slideDown()
  .next(async () => {
    await AsyncHelpers.sleep(500); // extra pause for complex logic
    updateNotificationContent();
  })
  .slideUp()
  .play();
```

---

## `sanitize()` — XSS-Safe Input Cleaning

### What Is It?

`sanitize(input, options)` cleans a string to remove malicious content — specifically, XSS (Cross-Site Scripting) attack vectors like `<script>` tags, `javascript:` URLs, and inline event handlers (`onclick`, `onerror`, etc.).

**Why this matters:** If your app displays user-provided content in the DOM, unsanitized input could allow an attacker to inject JavaScript that runs in your users' browsers.

### Syntax

```javascript
const safe = AsyncHelpers.sanitize(input, options);
```

### Options

```javascript
AsyncHelpers.sanitize(input, {
  allowedTags:   [],     // HTML tags to keep; all others are stripped (default: none)
  removeScripts: true,   // strip <script> tags and javascript: URLs (default: true)
  removeEvents:  true,   // strip inline event handlers like onclick (default: true)
  removeStyles:  false   // strip style attributes (default: false)
});
```

### Examples

#### Strip Everything (Default — No HTML Allowed)

```javascript
const userInput = '<script>alert("XSS!")</script> Hello!';

const safe = AsyncHelpers.sanitize(userInput);
// → '&lt;script&gt;alert(&quot;XSS!&quot;)&lt;/script&gt; Hello!'
// All HTML is entity-encoded — safe to display as text
```

#### Allow Only Specific Tags

```javascript
const content = '<b>Hello</b> <script>alert("bad")</script> <i>World</i>';

const safe = AsyncHelpers.sanitize(content, {
  allowedTags: ['b', 'i', 'em', 'strong', 'br']
});
// → '<b>Hello</b>  <i>World</i>'
// <script> is removed; <b> and <i> are kept
```

#### Rich Text (Formatting Allowed)

```javascript
const comment = '<p>Great post! <a href="javascript:steal()">Click</a></p>';

const safe = AsyncHelpers.sanitize(comment, {
  allowedTags:  ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'li'],
  removeScripts: true,
  removeEvents:  true
});
// → '<p>Great post! </p>'
// javascript: href is removed along with the link text
```

#### Remove Inline Styles

```javascript
const styled = '<div style="background:url(javascript:...)">...</div>';

const safe = AsyncHelpers.sanitize(styled, {
  allowedTags:  ['div'],
  removeStyles: true
});
// → '<div>...</div>'
```

---

### Form Integration — Sanitize Fields In-Place

When the Form module is loaded, forms get `sanitizeField` and `sanitizeAll` methods:

```javascript
// Sanitize a single field value in-place
Forms.commentForm.sanitizeField('content', {
  allowedTags: ['b', 'i', 'em', 'strong']
});
// The field's value is replaced with the sanitized version

// Sanitize all text/textarea fields in the form
Forms.profileForm.sanitizeAll();
// Every text input and textarea gets sanitized

// Sanitize with custom options
Forms.postForm.sanitizeAll({
  allowedTags: ['b', 'i', 'p', 'br'],
  removeScripts: true,
  removeEvents:  true
});
```

**When to use `sanitizeAll`:** Before displaying form values in the DOM, especially for content that users can see (comments, profile bios, post bodies).

---

### What `sanitize` Does NOT Do

`sanitize` is a **first-line defense** for common XSS patterns. It handles:
- `<script>` tags
- `javascript:` URLs
- Inline event handlers (`onclick`, `onerror`, etc.)

For a very permissive `allowedTags` list or defense-in-depth security, consider a dedicated HTML sanitization library like DOMPurify for production security-critical applications.

---

## Summary

### `asyncHandler`

- Wraps an async event listener to auto-manage loading CSS class and data attribute
- Loading state is always removed in `finally` — never gets stuck
- Options: `loadingClass`, `loadingAttribute`, `errorHandler`

### `sleep`

- `await AsyncHelpers.sleep(ms)` — pauses async execution for `ms` milliseconds
- Use it for delays between steps, minimum display times, or animation pauses

### `sanitize`

- `AsyncHelpers.sanitize(input, opts)` — removes XSS attack vectors from strings
- Default: entity-encode all HTML (safest, no HTML rendered)
- `allowedTags` — permit specific tags while stripping the rest
- Form integration: `Forms.myForm.sanitizeField(name)` / `sanitizeAll()`
