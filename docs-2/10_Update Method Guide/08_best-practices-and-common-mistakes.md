[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Best Practices & Common Mistakes

Production-ready guidelines, common pitfalls to avoid, and the principles that separate good `.update()` usage from great usage.

---

## Quick Start: Two Questions Before You Ship

Before deploying any `.update()` usage to production, ask:

1. **"Is there user input going into `innerHTML`?"** → Change it to `textContent`
2. **"Am I calling `.update()` on critical elements without checking if they exist?"** → Use bulk form and check results

Answer those two and you've avoided the biggest mistakes.

---

## Best Practices

### 1. Group Related Updates Together

Updates that are part of the same conceptual action belong in one update object.

**✅ DO:**
```javascript
// One conceptual action: "open the modal"
Elements.loginModal.update({
  style: { display: 'flex' },
  classList: { add: 'open', remove: 'closed' },
  setAttribute: { 'aria-hidden': 'false', 'aria-modal': 'true' },
  addEventListener: ['keydown', handleModalKeydown]
});
```

**❌ DON'T:**
```javascript
// Scattered — hard to see what "opening" involves
Elements.loginModal.update({ style: { display: 'flex' } });
Elements.loginModal.update({ classList: { add: 'open' } });
Elements.loginModal.update({ classList: { remove: 'closed' } });
Elements.loginModal.update({ setAttribute: { 'aria-hidden': 'false' } });
Elements.loginModal.update({ addEventListener: ['keydown', handleModalKeydown] });
```

**Why:** A single update object is more readable, shows the complete action, and gives change detection the full picture.

---

### 2. Use Bulk Updates for Multiple Elements

When updating multiple elements as part of one action, use `Elements.update({})`.

**✅ DO:**
```javascript
function showWelcomeScreen(user) {
  Elements.update({
    welcomeTitle: { textContent: `Welcome, ${user.name}!` },
    welcomeSubtitle: { textContent: 'Here\'s what\'s new today' },
    userAvatar: { src: user.avatarUrl, alt: user.name },
    loginButton: { style: { display: 'none' } },
    userMenu: { style: { display: 'flex' } }
  });
}
```

**❌ DON'T:**
```javascript
function showWelcomeScreen(user) {
  Elements.welcomeTitle.update({ textContent: `Welcome, ${user.name}!` });
  Elements.welcomeSubtitle.update({ textContent: 'Here\'s what\'s new today' });
  Elements.userAvatar.update({ src: user.avatarUrl, alt: user.name });
  Elements.loginButton.update({ style: { display: 'none' } });
  Elements.userMenu.update({ style: { display: 'flex' } });
}
```

**Why:** Better performance, single batch conceptually, easier to understand the full picture.

---

### 3. Always Use `textContent` for User Input

This is the most important security best practice.

**✅ DO:**
```javascript
// Safe — user input displayed as literal text
Elements.commentText.update({
  textContent: userComment  // Even <script>alert('xss')</script> is safe
});
```

**❌ DON'T:**
```javascript
// DANGEROUS — user input parsed as HTML
Elements.commentText.update({
  innerHTML: userComment  // Script injection possible!
});
```

**Why:** `textContent` treats everything as plain text. `innerHTML` parses HTML tags and executes scripts. Never use `innerHTML` with content from users, URLs, APIs, or any external source.

**When `innerHTML` IS safe:** Only with hardcoded, trusted HTML from your own code:
```javascript
// ✅ Safe — hardcoded, trusted HTML
Elements.icon.update({ innerHTML: '<svg>...</svg>' });
```

---

### 4. Check Results for Critical Elements

For elements that must exist for a feature to work, verify the update succeeded.

**✅ DO:**
```javascript
async function initCheckout() {
  const results = Elements.update({
    checkoutForm: { style: { display: 'block' } },
    cardNumberInput: { value: '', disabled: false },
    expiryInput: { value: '' },
    submitOrderBtn: { disabled: false }
  });

  const allCritical = ['checkoutForm', 'cardNumberInput', 'expiryInput', 'submitOrderBtn'];
  const missing = allCritical.filter(id => !results[id]?.success);

  if (missing.length > 0) {
    console.error('Critical checkout elements missing:', missing);
    showSystemError('Checkout unavailable. Please refresh the page.');
    reportError('checkout_init_failed', { missing });
    return false;
  }

  return true;
}
```

**❌ DON'T:**
```javascript
async function initCheckout() {
  // Assumes everything exists — silent failures if not
  Elements.update({
    checkoutForm: { style: { display: 'block' } },
    cardNumberInput: { value: '', disabled: false }
  });
  // Continues even if payment form is broken
}
```

**Why:** In SPAs, dynamic UIs, and A/B tests, elements may not always be present. Silent failures in checkout flows are critical bugs.

---

### 5. Use Factory Functions for Repeated States

If the same state description appears more than once, make it a factory.

**✅ DO:**
```javascript
const ButtonStates = {
  loading: (label = 'Loading...') => ({
    disabled: true,
    textContent: label,
    style: { opacity: '0.6', cursor: 'not-allowed' },
    classList: { add: 'btn-loading' }
  }),
  ready: (label) => ({
    disabled: false,
    textContent: label,
    style: { opacity: '1', cursor: 'pointer' },
    classList: { remove: 'btn-loading' }
  })
};

// Used consistently across the app
saveBtn.update(ButtonStates.loading('Saving...'));
submitBtn.update(ButtonStates.loading('Submitting...'));
// Later:
saveBtn.update(ButtonStates.ready('Save'));
submitBtn.update(ButtonStates.ready('Submit'));
```

**❌ DON'T:**
```javascript
// Duplicated state definition — maintenance nightmare
saveBtn.update({ disabled: true, textContent: 'Saving...', style: { opacity: '0.6' } });
// ... 10 other places with the same object...
submitBtn.update({ disabled: true, textContent: 'Submitting...', style: { opacity: '0.6' } });
// When opacity should change, you edit 10+ places
```

**Why:** DRY principle. Single source of truth. One edit updates all usages.

---

### 6. Leverage Change Detection — Don't Fight It

Call `.update()` freely in render loops. Change detection handles the optimization.

**✅ DO:**
```javascript
// Simple, clear render function — called frequently
function render(state) {
  Elements.update({
    title: { textContent: state.title },
    counter: { textContent: state.count.toString() },
    badge: {
      textContent: state.notifications.toString(),
      style: { display: state.notifications > 0 ? 'flex' : 'none' }
    }
  });
}

// Call freely — only actual changes write to DOM
setInterval(() => render(getState()), 100);
```

**❌ DON'T:**
```javascript
// Manual change tracking — verbose, error-prone, unnecessary
let _lastTitle, _lastCount, _lastNotifications;
function render(state) {
  if (_lastTitle !== state.title) {
    Elements.title.update({ textContent: state.title });
    _lastTitle = state.title;
  }
  if (_lastCount !== state.count) {
    Elements.counter.update({ textContent: state.count.toString() });
    _lastCount = state.count;
  }
  // etc...
}
```

**Why:** Change detection does this automatically. Manual tracking adds code, adds bugs, and provides no benefit.

---

### 7. Use `classList` for Class Management (Not `className`)

**✅ DO:**
```javascript
element.update({
  classList: {
    add: ['primary', 'large'],
    remove: 'secondary',
    toggle: 'expanded'
  }
});
```

**❌ DON'T:**
```javascript
element.update({
  className: element.className
    .split(' ')
    .filter(c => c !== 'secondary')
    .concat(['primary', 'large'])
    .join(' ')
});
```

**Why:** `classList` is cleaner, less error-prone, and preserves classes you didn't intend to change. String manipulation can accidentally remove classes added by other code.

---

### 8. Use Semantic, Descriptive Element IDs

Your IDs become your JavaScript API. Make them meaningful.

**✅ DO:**
```html
<input id="emailInput" />
<button id="submitLoginBtn" />
<div id="loginValidationErrorMsg" />
<span id="passwordStrengthIndicator" />
```

```javascript
Elements.update({
  emailInput: { value: '' },
  submitLoginBtn: { disabled: false },
  loginValidationErrorMsg: { style: { display: 'none' } }
});
// Readable without comments
```

**❌ DON'T:**
```html
<input id="i1" />
<button id="btn" />
<div id="msg" />
```

**Why:** Descriptive IDs are self-documenting. When you read `Elements.loginValidationErrorMsg.update(...)`, you understand exactly what you're updating.

---

### 9. Include Accessibility in Every State Change

Whenever you change visual state, update the ARIA attributes too.

**✅ DO:**
```javascript
function setModalVisible(isVisible) {
  Elements.modal.update({
    style: { display: isVisible ? 'flex' : 'none' },
    setAttribute: {
      'aria-hidden': (!isVisible).toString(),
      'aria-modal': isVisible ? 'true' : 'false'
    }
  });

  if (isVisible) {
    Elements.modalCloseBtn.update({ focus: [] });  // Move focus into modal
  } else {
    Elements.modalTrigger.update({ focus: [] });   // Return focus to trigger
  }
}
```

**❌ DON'T:**
```javascript
function setModalVisible(isVisible) {
  Elements.modal.update({
    style: { display: isVisible ? 'flex' : 'none' }
    // No ARIA updates — screen readers can't tell it opened!
  });
}
```

**Why:** Visual changes without ARIA updates create an invisible experience for screen reader users. Every show/hide, expand/collapse, and state change should update matching ARIA attributes.

---

### 10. Use `finally` for Async State Cleanup

When loading states are set before async operations, always clean up in `finally`.

**✅ DO:**
```javascript
async function submitForm(formData) {
  Elements.submitBtn.update({
    disabled: true,
    textContent: 'Submitting...',
    classList: { add: 'loading' }
  });

  try {
    const result = await postToServer(formData);
    Elements.update({
      formMessage: {
        textContent: 'Submitted successfully!',
        style: { display: 'block', color: '#16a34a' }
      },
      submitBtn: { textContent: 'Submitted!' }
    });
  } catch (error) {
    Elements.formError.update({
      textContent: error.message,
      style: { display: 'block' }
    });
  } finally {
    // Always restore button — whether success or error
    Elements.submitBtn.update({
      disabled: false,
      classList: { remove: 'loading' }
    });
  }
}
```

**❌ DON'T:**
```javascript
async function submitForm(formData) {
  Elements.submitBtn.update({ disabled: true, textContent: 'Submitting...' });

  const result = await postToServer(formData);  // If this throws...

  Elements.submitBtn.update({ disabled: false }); // ...this never runs!
  // Button stays disabled forever
}
```

**Why:** Errors leave buttons disabled, spinners spinning, and UIs in broken states. `finally` guarantees cleanup.

---

## Common Mistakes

### Mistake 1: Forgetting `[]` for Method Calls

```javascript
// ❌ WRONG — undefined value, not a method call
element.update({ focus });            // Shorthand property = { focus: focus }
element.update({ focus: true });      // Assigns boolean to element.focus

// ✅ CORRECT — empty array signals "call this method"
element.update({ focus: [] });
```

**Why:** Array values are the signal for "this is a method call". Without `[]`, it's treated as a property assignment.

---

### Mistake 2: kebab-case Style Properties

```javascript
// ❌ WRONG — kebab-case doesn't work
element.update({
  style: {
    'background-color': 'red',
    'font-size': '16px',
    'border-top-left-radius': '4px'
  }
});

// ✅ CORRECT — always camelCase
element.update({
  style: {
    backgroundColor: 'red',
    fontSize: '16px',
    borderTopLeftRadius: '4px'
  }
});
```

**Why:** JavaScript style properties are camelCase (`element.style.backgroundColor`). Kebab-case only works in CSS files, not JavaScript.

---

### Mistake 3: `innerHTML` with External Content

```javascript
// ❌ DANGEROUS — XSS vulnerability
element.update({ innerHTML: apiResponse.html });     // API could inject scripts
element.update({ innerHTML: userInput });             // User could inject scripts
element.update({ innerHTML: url_param_value });       // URL could contain scripts

// ✅ SAFE — textContent for external content
element.update({ textContent: apiResponse.text });

// ✅ SAFE — innerHTML only for your own, hardcoded HTML
element.update({ innerHTML: '<span class="icon">★</span>' });
```

---

### Mistake 4: Confusing Single vs Bulk Return Types

```javascript
// ❌ WRONG — single element returns HTMLElement, not results object
const result = Elements.myButton.update({ disabled: true });
if (result.myButton.success) { /* TypeError! */ }

// ❌ WRONG — bulk returns results object, not HTMLElement
const el = Elements.update({ myButton: { disabled: true } });
el.focus();  // TypeError — el is an object, not an element

// ✅ CORRECT — single form
const el = Elements.myButton.update({ disabled: true });
el?.focus();  // el is the HTMLElement

// ✅ CORRECT — bulk form
const results = Elements.update({ myButton: { disabled: true } });
if (results.myButton.success) { /* Works! */ }
results.myButton.element?.focus();
```

---

### Mistake 5: Scattering Updates That Belong Together

```javascript
// ❌ WRONG — same element updated three times for one action
Elements.notification.update({ textContent: message });
Elements.notification.update({ style: { display: 'block' } });
Elements.notification.update({ classList: { add: 'show' } });

// ✅ CORRECT — one update, one action
Elements.notification.update({
  textContent: message,
  style: { display: 'block' },
  classList: { add: 'show' }
});
```

---

### Mistake 6: Using `scrollIntoView` Without an Array

```javascript
// ❌ WRONG — assigns object to scrollIntoView, doesn't call the method
element.update({
  scrollIntoView: { behavior: 'smooth' }  // Not an array!
});

// ✅ CORRECT — wrap the options object in an array
element.update({
  scrollIntoView: [{ behavior: 'smooth' }]  // Array of arguments
});
```

---

### Mistake 7: Not Handling the `null` Element Case

```javascript
// ❌ RISKY — element might not exist, chain will throw
Elements.optionalBanner.update({ textContent: 'Welcome' }).scrollIntoView();

// ✅ SAFE — handle potential null
const banner = Elements.optionalBanner?.update({ textContent: 'Welcome' });
banner?.scrollIntoView();

// Or use bulk form for explicit handling
const results = Elements.update({
  optionalBanner: { textContent: 'Welcome' }
});
if (results.optionalBanner.success) {
  results.optionalBanner.element.scrollIntoView();
}
```

---

## Production Checklist

Before shipping `.update()` usage to production:

### Security
- [ ] No `innerHTML` with user input, API data, or URL parameters
- [ ] All user-generated content uses `textContent`
- [ ] ARIA attributes updated alongside visual changes

### Correctness
- [ ] Critical elements use bulk form with results checking
- [ ] Method calls use `[]` syntax
- [ ] Style properties use camelCase
- [ ] Async operations have `finally` cleanup

### Performance
- [ ] Related updates grouped into single calls
- [ ] Multiple elements use bulk `Elements.update({})`
- [ ] High-frequency handlers use debouncing or throttling
- [ ] No manual change guards (change detection handles it)

### Accessibility
- [ ] `aria-hidden` updated when showing/hiding
- [ ] `aria-expanded` updated for toggleable elements
- [ ] `aria-invalid` updated for form validation
- [ ] Focus managed on modal open/close

### Code Quality
- [ ] Repeated states use factory functions
- [ ] IDs are descriptive and consistent
- [ ] Complex logic is documented
- [ ] Bulk updates reflect one conceptual action

---

## Debugging Guide

### Tip 1: Log the Update Object First

```javascript
const updates = {
  textContent: 'Hello',
  style: { color: 'red' }
};
console.log('About to apply:', updates);
element.update(updates);
```

### Tip 2: Inspect the Return Value

```javascript
// Single element
const el = Elements.myButton.update({ disabled: true });
console.log('Element exists:', el !== null);
console.log('Disabled state:', el?.disabled);

// Bulk
const results = Elements.update({ btn: { disabled: true } });
console.log('Update results:', results);
console.log('Button success:', results.btn.success);
console.log('Button error:', results.btn.error);
```

### Tip 3: Check After Applying

```javascript
element.update({ classList: { add: 'active' } });
console.log('Has active class:', element.classList.contains('active'));
console.log('All classes:', element.className);
```

### Tip 4: Performance Measurement

```javascript
console.time('bulk-update');
Elements.update({
  el1: { textContent: 'A' },
  el2: { textContent: 'B' },
  el3: { textContent: 'C' }
});
console.timeEnd('bulk-update');
```

---

## Quick Reference Card

```javascript
// ✅ GROUP related updates
element.update({ textContent: '...', disabled: true, classList: { add: 'loading' } });

// ✅ BATCH multiple elements
Elements.update({ id1: {...}, id2: {...} });

// ✅ textContent for USER INPUT (security!)
{ textContent: userInput }  // Safe

// ✅ CHECK critical elements
const r = Elements.update({ form: {...} });
if (!r.form.success) { handleError(); }

// ✅ FACTORY functions for repeated states
const States = { loading: () => ({...}), ready: () => ({...}) };
btn.update(States.loading());

// ✅ ARRAYS for method calls
{ focus: [], scrollIntoView: [{ behavior: 'smooth' }] }

// ✅ camelCase for STYLES
{ style: { backgroundColor: 'red', fontSize: '16px' } }

// ✅ classList OPERATIONS
{ classList: { add: 'active', remove: 'inactive' } }

// ✅ ARIA with visual changes
{ style: { display: 'none' }, setAttribute: { 'aria-hidden': 'true' } }

// ✅ FINALLY for async cleanup
try { await operation(); } finally { btn.update({ disabled: false }); }
```

---

## Summary: The 5 Golden Rules

If you remember nothing else, remember these:

1. **`textContent` for user input** — never `innerHTML` with external content
2. **Group related updates** — one conceptual action = one update object
3. **`[]` for method calls** — `focus: []`, not `focus: true`
4. **Check bulk results for critical paths** — don't assume elements exist
5. **Trust change detection** — call `render()` freely, skip the manual guards

---

## You're Ready!

You've completed the full `.update()` guide. You now know:

✅ **What `.update()` is** — unified declarative DOM manipulation
✅ **The update object** — how keys and values work together
✅ **Parameters and returns** — what goes in, what comes out
✅ **All property categories** — text, basic, style, classList, setAttribute, dataset, events, methods
✅ **Change detection** — automatic, fine-grained, zero configuration
✅ **Method calls** — `methodName: [args]` syntax
✅ **Advanced patterns** — state machines, factories, observables, themes
✅ **Best practices** — security, performance, accessibility, code quality

Go build clean, maintainable, performant UIs. You have everything you need.