[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Real-World Examples

## What This Chapter Covers

This chapter puts `Collections.update()` to work in the kinds of scenarios you'll encounter in real web development. Each example follows the same clear format:

- **Scenario** — the situation you're in
- **HTML** — what the markup looks like
- **Solution** — the `Collections.update()` call
- **What happens** — what changes in the browser

By the end, you'll have 10 working patterns you can adapt immediately.

---

## Example 1: Dark Mode Toggle

### Scenario

Your site has a dark mode toggle button. When clicked, the entire page should switch to dark colors — backgrounds, text, borders, and link colors all at once.

### HTML

```html
<body>
  <header class="header">Site Header</header>
  <aside class="sidebar">Navigation</aside>
  <main>
    <div class="card">Card content</div>
    <div class="card">Card content</div>
    <a href="#">A link</a>
    <a href="#">Another link</a>
  </main>
  <footer class="footer">Footer content</footer>
</body>
```

### Solution

```javascript
function enableDarkMode() {
  Collections.update({
    'tag:body': {
      style: { backgroundColor: '#0f172a', color: '#f1f5f9' }
    },
    'header': {
      style: { backgroundColor: '#1e293b', borderBottom: '1px solid #334155' }
    },
    'card': {
      style: { backgroundColor: '#1e293b', color: '#e2e8f0', borderColor: '#334155' }
    },
    'sidebar': {
      style: { backgroundColor: '#0f172a', borderRight: '1px solid #334155' }
    },
    'footer': {
      style: { backgroundColor: '#1e293b', borderTop: '1px solid #334155' }
    },
    'tag:a': {
      style: { color: '#60a5fa' }
    }
  });
}

function enableLightMode() {
  Collections.update({
    'tag:body': {
      style: { backgroundColor: '#ffffff', color: '#1f2937' }
    },
    'header': {
      style: { backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }
    },
    'card': {
      style: { backgroundColor: '#ffffff', color: '#1f2937', borderColor: '#e5e7eb' }
    },
    'sidebar': {
      style: { backgroundColor: '#f9fafb', borderRight: '1px solid #e5e7eb' }
    },
    'footer': {
      style: { backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }
    },
    'tag:a': {
      style: { color: '#2563eb' }
    }
  });
}

// Wire up the toggle
document.querySelector('.theme-toggle').addEventListener('click', () => {
  const isDark = document.body.style.backgroundColor === 'rgb(15, 23, 42)';
  isDark ? enableLightMode() : enableDarkMode();
});
```

### What happens

Six different groups of elements update simultaneously. Instead of six separate loops and DOM queries, both theme states are captured in two clear, readable functions. Adding a new element type to the theme is as simple as adding one more key.

---

## Example 2: Form Validation Feedback

### Scenario

A user submits a form. Some fields are empty or invalid. You need to highlight the invalid ones visually and show error messages, while keeping valid fields marked green.

### HTML

```html
<form id="contact-form">
  <input class="input" name="name" value="">
  <input class="input valid" name="email" value="alice@example.com">
  <input class="input" name="phone" value="">
  <span class="error-message">Name is required</span>
  <span class="error-message">Phone is required</span>
</form>
```

### Solution

```javascript
function showValidationErrors() {
  Collections.update({
    // All input fields start with the invalid state
    'input': {
      style: {
        borderColor: '#ef4444',
        borderWidth: '2px',
        backgroundColor: '#fef2f2'
      },
      setAttribute: { 'aria-invalid': 'true' }
    },

    // Override: inputs that already have the 'valid' class get green treatment
    'valid': {
      style: {
        borderColor: '#10b981',
        borderWidth: '2px',
        backgroundColor: '#f0fdf4'
      },
      setAttribute: { 'aria-invalid': 'false' }
    },

    // Make the error message spans visible
    'error-message': {
      style: {
        display: 'block',
        color: '#dc2626',
        fontSize: '0.875rem',
        marginTop: '4px'
      }
    }
  });
}

function clearValidationErrors() {
  Collections.update({
    'input': {
      style: { borderColor: '#d1d5db', borderWidth: '1px', backgroundColor: '#ffffff' },
      setAttribute: { 'aria-invalid': 'false' }
    },
    'valid': {
      style: { borderColor: '#d1d5db', borderWidth: '1px', backgroundColor: '#ffffff' }
    },
    'error-message': {
      style: { display: 'none' }
    }
  });
}
```

### What happens

The `'input'` collection marks everything as invalid. Then the `'valid'` collection — which targets elements that have both `input` and `valid` classes — overrides back to green for the already-correct fields. This approach uses CSS class membership as the data that drives which visual state each input shows.

---

## Example 3: Loading State Management

### Scenario

A user clicks "Submit" on a long form. Everything must disable instantly and show loading indicators. When the server responds, everything re-enables.

### HTML

```html
<form>
  <input class="form-field" type="text" name="name">
  <input class="form-field" type="email" name="email">
  <textarea class="form-field" name="message"></textarea>
  <select class="form-field" name="topic">...</select>

  <button class="btn-submit" type="submit">Submit</button>
  <button class="btn-cancel" type="button">Cancel</button>
</form>
```

### Solution

```javascript
function setLoadingState() {
  Collections.update({
    'form-field': {
      disabled: true,
      style: { opacity: '0.6', cursor: 'not-allowed' }
    },
    'btn-submit': {
      disabled: true,
      textContent: 'Submitting...',
      style: { backgroundColor: '#9ca3af', cursor: 'not-allowed' },
      classList: { add: 'loading' }
    },
    'btn-cancel': {
      disabled: true,
      style: { opacity: '0.5', cursor: 'not-allowed' }
    }
  });
}

function clearLoadingState() {
  Collections.update({
    'form-field': {
      disabled: false,
      style: { opacity: '1', cursor: 'auto' }
    },
    'btn-submit': {
      disabled: false,
      textContent: 'Submit',
      style: { backgroundColor: '#3b82f6', cursor: 'pointer' },
      classList: { remove: 'loading' }
    },
    'btn-cancel': {
      disabled: false,
      style: { opacity: '1', cursor: 'pointer' }
    }
  });
}

// Usage
document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  setLoadingState();

  try {
    await fetch('/api/contact', { method: 'POST' });
    clearLoadingState();
  } catch (error) {
    clearLoadingState();
    // handle error
  }
});
```

### What happens

`setLoadingState()` freezes every interactive element in one call. `clearLoadingState()` unfreezes everything in one call. The pair of functions makes the before/after states immediately readable in code review.

---

## Example 4: Accessibility Improvements

### Scenario

You want to bulk-apply accessibility improvements across the page — lazy loading on images, security attributes on external links, and ARIA roles on interactive elements.

### Solution

```javascript
function improveAccessibility() {
  Collections.update({
    // Lazy load all images to improve performance
    'tag:img': {
      setAttribute: {
        loading: 'lazy',
        decoding: 'async'
      }
    },

    // Add security and UX attributes to all external links
    'tag:a': {
      setAttribute: {
        rel: 'noopener noreferrer'
      }
    },

    // Ensure all buttons have explicit type to prevent accidental form submissions
    'tag:button': {
      setAttribute: {
        type: 'button'
      }
    },

    // Give all form inputs autocomplete="off" on sensitive pages
    'name:password': {
      setAttribute: { autocomplete: 'new-password' }
    },
    'name:confirm-password': {
      setAttribute: { autocomplete: 'new-password' }
    }
  });
}
```

### What happens

A single call applies multiple accessibility and security best practices across every matching element on the page. This pattern works well as a page initialization step that runs once on load.

---

## Example 5: Bulk Card Animation

### Scenario

A product grid loads data and you want cards to fade in smoothly rather than appearing all at once.

### HTML

```html
<div class="product-grid">
  <div class="product-card">Product 1</div>
  <div class="product-card">Product 2</div>
  <div class="product-card">Product 3</div>
  <div class="product-card">Product 4</div>
</div>
```

### Solution

```javascript
function animateCardsIn() {
  // Step 1: Prepare cards for animation (invisible, shifted down)
  Collections.update({
    'product-card': {
      style: {
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease'
      }
    }
  });

  // Step 2: Trigger the animation on the next frame
  requestAnimationFrame(() => {
    setTimeout(() => {
      Collections.update({
        'product-card': {
          style: {
            opacity: '1',
            transform: 'translateY(0)'
          }
        }
      });
    }, 50); // small delay to let the browser register the initial state
  });
}

function animateCardsOut() {
  Collections.update({
    'product-card': {
      style: {
        opacity: '0',
        transform: 'translateY(10px)'
      }
    }
  });
}
```

### What happens

All cards become invisible and shift down slightly. Then the second `Collections.update()` call removes those styles, triggering the CSS transition on every card simultaneously. The result is a coordinated fade-in across the whole grid.

---

## Example 6: Multi-Step Form Management

### Scenario

A multi-step form wizard — you need to hide all steps and show only the current one.

### HTML

```html
<form class="wizard-form">
  <div class="form-step step-1">Step 1: Personal Info</div>
  <div class="form-step step-2">Step 2: Contact Details</div>
  <div class="form-step step-3">Step 3: Review & Submit</div>
</form>
```

### Solution

```javascript
function goToStep(stepNumber) {
  // Hide all steps first
  Collections.update({
    'form-step': {
      style: { display: 'none' },
      classList: { remove: 'active' },
      setAttribute: { 'aria-hidden': 'true' }
    }
  });

  // Show only the target step
  Collections.update({
    [`step-${stepNumber}`]: {
      style: { display: 'block' },
      classList: { add: 'active' },
      setAttribute: { 'aria-hidden': 'false' }
    }
  });
}

// Usage
goToStep(1); // Show only step 1
goToStep(2); // Show only step 2
goToStep(3); // Show only step 3
```

### What happens

The first call hides all steps simultaneously. The second call reveals just the target step. Dynamic computed property names (`[`step-${stepNumber}`]`) let you generate the class key at runtime, making the function work for any step number.

---

## Example 7: Table Row Highlighting

### Scenario

A data table where you want to clear all highlights, then highlight selected rows differently from hovered ones.

### HTML

```html
<table>
  <tr class="table-row">Row 1</tr>
  <tr class="table-row selected">Row 2 (selected)</tr>
  <tr class="table-row">Row 3</tr>
  <tr class="table-row selected">Row 4 (selected)</tr>
</table>
```

### Solution

```javascript
function clearAllHighlights() {
  Collections.update({
    'table-row': {
      style: { backgroundColor: 'transparent', fontWeight: 'normal' },
      classList: { remove: ['highlighted', 'selected'] }
    }
  });
}

function highlightSelectedRows() {
  Collections.update({
    'selected': {
      style: { backgroundColor: '#dbeafe', fontWeight: '600' },
      setAttribute: { 'aria-selected': 'true' }
    }
  });
}

function dimUnselectedRows() {
  Collections.update({
    'table-row': {
      style: { opacity: '0.5' }
    },
    'selected': {
      style: { opacity: '1' }
    }
  });
}
```

### What happens

`clearAllHighlights()` resets every row in one call. `highlightSelectedRows()` applies the selected state to only the rows with class `selected`. Calling them in sequence creates a clean, intentional state transition.

---

## Example 8: Notification System

### Scenario

Multiple notification banners that need to appear, disappear, and auto-dismiss.

### HTML

```html
<div class="notification success">File saved successfully</div>
<div class="notification error">Connection failed</div>
<div class="notification warning">Your session expires in 5 minutes</div>
```

### Solution

```javascript
function showAllNotifications() {
  Collections.update({
    'notification': {
      style: { display: 'flex', opacity: '1', animation: 'slideDown 0.3s ease' }
    }
  });
}

function hideAllNotifications() {
  Collections.update({
    'notification': {
      style: { animation: 'slideUp 0.3s ease' }
    }
  });

  setTimeout(() => {
    Collections.update({
      'notification': {
        style: { display: 'none' }
      }
    });
  }, 300); // wait for slide animation to finish
}

function hideErrorsOnly() {
  Collections.update({
    'error': {
      style: { display: 'none' }
    }
  });
}

function hideSuccessMessages() {
  Collections.update({
    'success': {
      style: { opacity: '0', transition: 'opacity 0.5s ease' }
    }
  });

  setTimeout(() => {
    Collections.update({
      'success': { style: { display: 'none' } }
    });
  }, 500);
}
```

### What happens

Each function targets a different class subset of notifications. `hideErrorsOnly()` targets only notifications with the `error` class, leaving `success` and `warning` visible. This pattern works because CSS classes serve double duty — they provide both styling and group membership for `Collections.update()` targeting.

---

## Example 9: Print Preparation

### Scenario

Before printing, you want to hide navigation and interactive elements, simplify card borders for print, and ensure links show their text color clearly in black-and-white.

### Solution

```javascript
function prepareForPrint() {
  Collections.update({
    // Hide interactive chrome
    'tag:nav': { style: { display: 'none' } },
    'tag:button': { style: { display: 'none' } },
    'sidebar': { style: { display: 'none' } },
    'notification': { style: { display: 'none' } },

    // Simplify cards for print readability
    'card': {
      style: {
        border: '1px solid #000000',
        boxShadow: 'none',
        pageBreakInside: 'avoid',
        marginBottom: '20px'
      }
    },

    // Ensure links are readable in black and white
    'tag:a': {
      style: { color: '#000000', textDecoration: 'underline' }
    },

    // Make body suitable for print
    'tag:body': {
      style: { backgroundColor: '#ffffff', color: '#000000', fontSize: '12pt' }
    }
  });
}

function restoreAfterPrint() {
  Collections.update({
    'tag:nav': { style: { display: '' } },
    'tag:button': { style: { display: '' } },
    'sidebar': { style: { display: '' } },
    'notification': { style: { display: '' } },
    'tag:a': { style: { color: '', textDecoration: '' } },
    'tag:body': { style: { backgroundColor: '', color: '', fontSize: '' } }
  });
}

// Wire to browser print events
window.addEventListener('beforeprint', prepareForPrint);
window.addEventListener('afterprint', restoreAfterPrint);
```

### What happens

Seven different groups of elements prepare simultaneously before the print dialog opens. Setting inline style values to empty strings (`''`) in `restoreAfterPrint()` removes the inline style overrides, allowing the original CSS to take over again.

---

## Example 10: Game State Management

### Scenario

A browser game with multiple UI states — initial (waiting), playing, paused, and game over. Each state requires a different visual configuration across multiple groups of elements.

### HTML

```html
<div class="game">
  <button class="game-button start-btn">Start</button>
  <button class="game-button pause-btn">Pause</button>
  <button class="game-button reset-btn">Reset</button>

  <div class="game-tile">Tile 1</div>
  <div class="game-tile">Tile 2</div>
  <div class="game-tile">Tile 3</div>

  <div class="score-display">Score: 0</div>
</div>
```

### Solution

```javascript
const gameStates = {
  initial() {
    Collections.update({
      'game-button': { disabled: true, style: { opacity: '0.4' } },
      'start-btn': { disabled: false, style: { opacity: '1' } },
      'game-tile': {
        classList: { remove: ['active', 'paused'] },
        style: { opacity: '0.4', cursor: 'default' }
      },
      'score-display': { textContent: 'Score: 0', style: { color: '#6b7280' } }
    });
  },

  playing() {
    Collections.update({
      'game-button': { disabled: false, style: { opacity: '1' } },
      'start-btn': { disabled: true, style: { opacity: '0.4' } },
      'game-tile': {
        classList: { add: 'active', remove: 'paused' },
        style: { opacity: '1', cursor: 'pointer' }
      },
      'score-display': { style: { color: '#059669' } }
    });
  },

  paused() {
    Collections.update({
      'game-tile': {
        classList: { add: 'paused', remove: 'active' },
        style: { opacity: '0.6', cursor: 'default' }
      },
      'game-button': { disabled: false }
    });
  },

  gameOver() {
    Collections.update({
      'game-tile': {
        classList: { remove: ['active', 'paused'] },
        style: { opacity: '0.3', cursor: 'default' }
      },
      'game-button': { disabled: true, style: { opacity: '0.4' } },
      'reset-btn': { disabled: false, style: { opacity: '1' } },
      'score-display': { style: { color: '#ef4444' } }
    });
  }
};

// Usage
gameStates.initial();
// ... later
gameStates.playing();
// ... user pauses
gameStates.paused();
// ... game ends
gameStates.gameOver();
```

### What happens

Each state function is a single `Collections.update()` call that precisely defines which elements change and how. The state logic reads like a declaration: "When the game is playing, buttons are enabled, tiles are active and clickable, and the score shows green." This is much cleaner than scattered `if/else` blocks across the codebase.

---

## Common Patterns Summary

These four patterns appear across nearly all real-world `Collections.update()` usage:

### Pattern 1: Paired State Functions

```javascript
function activate() {
  Collections.update({
    'element-group': { /* active state */ }
  });
}

function deactivate() {
  Collections.update({
    'element-group': { /* inactive state */ }
  });
}
```

Define the "on" and "off" states as named functions. Toggle between them by calling the appropriate one.

### Pattern 2: Coordinated Multi-Group State Change

```javascript
Collections.update({
  'group-a': { /* changes for group A */ },
  'group-b': { /* changes for group B */ },
  'tag:input': { /* changes for all inputs */ }
});
```

When multiple groups need to change simultaneously (like a theme switch or loading state), bundle them in one call for atomicity and readability.

### Pattern 3: Override Pattern (General → Specific)

```javascript
Collections.update({
  'form-field': { style: { borderColor: '#ef4444' } },  // mark all invalid
  'valid': { style: { borderColor: '#10b981' } }         // override valid ones
});
```

Apply a general state to all, then let more specific class membership override back for exceptions. The order of keys in the object determines the order of application.

### Pattern 4: Prepare → Reveal Animation

```javascript
// Step 1: Set invisible state
Collections.update({
  'card': { style: { opacity: '0', transform: 'translateY(10px)', transition: '...' } }
});

// Step 2: Trigger the transition
setTimeout(() => {
  Collections.update({
    'card': { style: { opacity: '1', transform: 'translateY(0)' } }
  });
}, 50);
```

Set the starting state, then apply the ending state in a timeout. CSS transitions handle the animation between the two.

---

## Key Takeaways

1. **One call can update dozens of elements.** Every example above uses one or two `Collections.update()` calls where plain JavaScript would need multiple loops.

2. **Pair your state functions.** Always write the "undo" function alongside the "do" function (`enableDarkMode` / `enableLightMode`, `setLoadingState` / `clearLoadingState`).

3. **CSS classes are both style and data.** When you add a `valid` or `selected` class to an element, you're also making it targetable by name in future `Collections.update()` calls.

4. **Mixing class, tag, and name types** in one call is normal and encouraged — it's how you coordinate changes across semantically different element groups.

5. **Dynamic keys work.** Template literals like `` `step-${n}` `` as collection keys let you build programmatic update calls.

---

**Up next:** A complete reference to every property you can include in an update object — all 8 categories with full examples.