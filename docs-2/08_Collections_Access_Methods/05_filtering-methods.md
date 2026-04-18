[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Filtering Methods

## Quick Start (30 Seconds)

```javascript
const inputs = Collections.TagName.input;

// Get only the visible inputs
const visibleInputs = inputs.visible();
console.log('Visible:', visibleInputs.length);

// Get only the hidden inputs
const hiddenInputs = inputs.hidden();
console.log('Hidden:', hiddenInputs.length);

// Get only the enabled inputs (not disabled)
const enabledInputs = inputs.enabled();
console.log('Enabled:', enabledInputs.length);

// Get only the disabled inputs
const disabledInputs = inputs.disabled();
console.log('Disabled:', disabledInputs.length);
```

One-word methods that replace complex visibility and state checks.

---

## What Are Filtering Methods?

Filtering methods are **shortcuts** built into Collections that filter elements based on their **current visual or state conditions** — whether they're visible, hidden, enabled, or disabled.

They save you from writing manual condition checks each time you need a subset based on these common states.

```
Without filtering methods:
  inputs.filter(input =>
    input.offsetParent !== null &&
    window.getComputedStyle(input).visibility !== 'hidden' &&
    window.getComputedStyle(input).opacity !== '0'
  )

With filtering methods:
  inputs.visible()
```

Same result. Much less to write and remember.

---

## Syntax Reference

```javascript
collection.visible()    // Returns array of visible elements
collection.hidden()     // Returns array of hidden elements
collection.enabled()    // Returns array of enabled form elements
collection.disabled()   // Returns array of disabled form elements
```

**Important:** These return **plain arrays**, not Collections. Use array methods like `forEach` on the result, not bulk Collection methods like `addClass`.

---

## Why Do These Methods Exist?

### When Visibility Checks Are Repetitive

In real applications, you often need to work with only the **visible** or **enabled** elements — not all of them. For example:

- Animate only the elements currently on screen
- Validate only the form fields that aren't hidden by conditional logic
- Collect values only from enabled inputs (skip the read-only/disabled ones)

The challenge: writing accurate visibility detection in vanilla JavaScript is verbose and easy to get wrong.

```javascript
// The "manual" way — complex, easy to miss conditions
const inputs = Collections.TagName.input;

// Get visible, enabled inputs (the verbose manual way)
const activeInputs = inputs.filter(input => {
  // Is it not hidden via display:none?
  const style = window.getComputedStyle(input);
  const isVisible = (
    input.offsetParent !== null &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0'
  );
  // Is it enabled?
  const isEnabled = !input.disabled;

  return isVisible && isEnabled;
});
```

**The Collections way — readable and concise:**

```javascript
const inputs = Collections.TagName.input;

// Get visible inputs, then filter to enabled ones
const activeInputs = inputs
  .visible()
  .filter(input => !input.disabled);

// Or use the enabled() method directly
const enabledInputs = inputs.enabled();
const visibleEnabled = inputs.visible().filter(i => !i.disabled);
```

**Benefits:**
✅ One-word methods replace multi-condition checks
✅ Accurate — handles `display:none`, `visibility:hidden`, and `opacity:0`
✅ Readable — intent is immediately clear
✅ Composable — chain with `.filter()` for custom combinations

---

## Complete Method Overview

| Method | What It Returns | How It Detects |
|--------|----------------|----------------|
| `visible()` | Elements that are currently visible | `offsetParent !== null`, visibility != hidden, opacity != 0 |
| `hidden()` | Elements that are currently hidden | Opposite of visible |
| `enabled()` | Form elements that are not disabled | `element.disabled === false` |
| `disabled()` | Form elements that are disabled | `element.disabled === true` |

---

## 1. visible() — Get Only Visible Elements

Returns a new array containing only the elements that are currently visible to the user.

### Syntax

```javascript
collection.visible()
// Returns: plain array of visible elements
```

---

### What Makes an Element "Visible"?

An element is considered visible when ALL of these are true:
1. `offsetParent` is not `null` — meaning it doesn't have `display: none` applied
2. `visibility` is not `'hidden'` — computed style check
3. `opacity` is not `'0'` — computed style check

```
Element visibility check:
    ↓
offsetParent !== null?     (not display:none)
    ↓ yes
visibility !== 'hidden'?   (not visibility:hidden)
    ↓ yes
opacity !== '0'?           (not fully transparent)
    ↓ yes
→ Element is VISIBLE ✅

Any condition fails → Element is HIDDEN
```

---

### Basic Usage

```javascript
const cards = Collections.ClassName.card;

// Get only the cards that are currently visible
const visibleCards = cards.visible();

console.log(`Total cards: ${cards.length}`);
console.log(`Visible cards: ${visibleCards.length}`);
console.log(`Hidden cards: ${cards.hidden().length}`);
```

---

### Examples

**Example 1: Process Only What's on Screen**

```javascript
const sections = Collections.ClassName.section;

// When the page loads, only animate visible sections
function animateVisibleSections() {
  const visible = sections.visible();

  visible.forEach((section, index) => {
    // Stagger the animation delay so they fade in one by one
    setTimeout(() => {
      section.classList.add('fade-in');
    }, index * 150); // 0ms, 150ms, 300ms, 450ms...
  });

  console.log(`Animating ${visible.length} visible sections`);
}

animateVisibleSections();
```

**What's happening:** We only animate sections that are currently visible. Sections that are hidden (collapsed, off-screen, etc.) are ignored — their animation will happen when they become visible.

---

**Example 2: Count Visible vs Hidden**

```javascript
function getVisibilityStats() {
  const cards = Collections.ClassName.card;
  const buttons = Collections.ClassName.btn;

  const stats = {
    cards: {
      total: cards.length,
      visible: cards.visible().length,
      hidden: cards.hidden().length
    },
    buttons: {
      total: buttons.length,
      visible: buttons.visible().length,
      hidden: buttons.hidden().length
    }
  };

  console.table(stats);
  return stats;
}

getVisibilityStats();
// Output table:
//         │ total │ visible │ hidden
// cards   │   10  │    7    │   3
// buttons │    5  │    5    │   0
```

---

**Example 3: Apply Numbering to Visible Items**

```javascript
const items = Collections.ClassName.item;

// Renumber items based on their visible position
function renumberVisibleItems() {
  const visible = items.visible();

  visible.forEach((item, index) => {
    const counter = item.querySelector('.counter');
    if (counter) {
      counter.textContent = index + 1; // 1, 2, 3...
    }
    item.dataset.visibleIndex = index;
  });

  console.log(`Renumbered ${visible.length} visible items`);
}
```

---

**Example 4: Scroll to First Visible Match**

```javascript
const results = Collections.ClassName['search-result'];

function scrollToFirstResult() {
  const visible = results.visible();

  if (visible.length > 0) {
    visible[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    visible[0].classList.add('highlighted');
    console.log('Scrolled to first result');
  } else {
    console.log('No visible results to scroll to');
  }
}
```

---

## 2. hidden() — Get Only Hidden Elements

Returns a new array containing only the elements that are currently hidden from the user. The exact inverse of `visible()`.

### Syntax

```javascript
collection.hidden()
// Returns: plain array of hidden elements
```

---

### What Makes an Element "Hidden"?

An element is hidden if ANY of these is true:
1. `offsetParent` is `null` — has `display: none`
2. `visibility` is `'hidden'`
3. `opacity` is `'0'`

---

### Basic Usage

```javascript
const modals = Collections.ClassName.modal;

// Get only the modals that are currently hidden
const hiddenModals = modals.hidden();

console.log(`Total modals: ${modals.length}`);
console.log(`Hidden modals: ${hiddenModals.length}`);
```

---

### Examples

**Example 1: Show All Hidden Elements**

```javascript
function showAllHidden() {
  const cards = Collections.ClassName.card;
  const hidden = cards.hidden();

  if (hidden.length === 0) {
    console.log('No hidden cards to show');
    return;
  }

  hidden.forEach(card => {
    card.style.display = 'block';    // Restore display
    card.classList.remove('hidden'); // Remove hidden class
    card.classList.add('revealed');  // Add reveal class
  });

  console.log(`Showed ${hidden.length} hidden cards`);
}
```

---

**Example 2: Clean Up Hidden Temporary Elements**

```javascript
function cleanUpHiddenItems() {
  // Elements with class 'temp-item' are safe to remove if hidden
  const tempItems = Collections.ClassName['temp-item'];
  const hiddenTemps = tempItems.hidden();

  if (hiddenTemps.length > 0) {
    console.log(`Removing ${hiddenTemps.length} hidden temporary items...`);
    hiddenTemps.forEach(item => item.remove());
  } else {
    console.log('No hidden temporary items to clean up');
  }
}

// Run cleanup every 30 seconds
setInterval(cleanUpHiddenItems, 30000);
```

---

**Example 3: Swap Visible and Hidden**

```javascript
function toggleVisibleAndHidden() {
  const elements = Collections.ClassName.toggleable;
  const hidden = elements.hidden();
  const visible = elements.visible();

  // Hide the visible ones
  visible.forEach(el => el.classList.add('hidden'));

  // Show the hidden ones
  hidden.forEach(el => el.classList.remove('hidden'));

  console.log(`Swapped: ${hidden.length} shown, ${visible.length} hidden`);
}
```

---

**Example 4: Pre-load Hidden Sections**

```javascript
// Before the user clicks to show a section, pre-populate it
const sections = Collections.ClassName['data-section'];

function preloadHiddenSections() {
  const hiddenSections = sections.hidden();

  hiddenSections.forEach(section => {
    if (!section.dataset.loaded) {
      loadSectionData(section.dataset.id)
        .then(data => {
          renderSectionContent(section, data);
          section.dataset.loaded = 'true';
        });
    }
  });

  console.log(`Pre-loading ${hiddenSections.length} hidden sections`);
}
```

---

## 3. enabled() — Get Only Enabled Form Elements

Returns a new array containing only the form elements that are **not disabled** (i.e., `element.disabled` is `false`).

### Syntax

```javascript
collection.enabled()
// Returns: plain array of enabled (non-disabled) elements
```

---

### What Makes a Form Element "Enabled"?

A form element is enabled when:
- Its `disabled` property is `false`
- It is NOT inside a `<fieldset disabled>` that disables it

**Note:** `enabled()` is most meaningful for form elements: `<input>`, `<button>`, `<select>`, `<textarea>`. Non-form elements don't have a `disabled` property, so they're always returned as "enabled".

---

### Basic Usage

```javascript
const inputs = Collections.TagName.input;

// Get only enabled inputs
const enabledInputs = inputs.enabled();

// Get their values for form submission
const values = enabledInputs.map(input => ({
  name: input.name,
  value: input.value
}));

console.log(`Enabled inputs: ${enabledInputs.length}`);
console.log('Values:', values);
```

---

### Why enabled() Instead of filter()?

```javascript
const inputs = Collections.TagName.input;

// Manual filter — works but verbose
const enabled = inputs.filter(input => !input.disabled);

// enabled() — more readable
const enabled = inputs.enabled();

// The intent is immediately clear from the method name
```

---

### Examples

**Example 1: Validate Only Enabled Fields**

```javascript
const inputs = Collections.ClassName['form-input'];

function validateForm() {
  // Skip disabled fields — they're not part of the submission
  const enabled = inputs.enabled();

  const invalid = enabled.filter(input => !input.validity.valid);

  // Highlight invalid enabled fields
  invalid.forEach(input => {
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
  });

  if (invalid.length > 0) {
    console.error(`${invalid.length} fields need correction`);
    return false;
  }

  console.log('All enabled fields are valid');
  return true;
}
```

**What's happening:** We validate only the enabled fields. Disabled fields are pre-filled or read-only — they don't need validation and aren't included in the submission.

---

**Example 2: Collect Only Active Form Data**

```javascript
function getFormData() {
  const inputs = Collections.TagName.input;
  const selects = Collections.TagName.select;

  const data = {};

  // Collect enabled input values
  inputs.enabled().forEach(input => {
    if (input.name && input.type !== 'checkbox' && input.type !== 'radio') {
      data[input.name] = input.value;
    } else if (input.type === 'checkbox' && input.checked) {
      // For checkboxes, only include if checked
      data[input.name] = input.value;
    } else if (input.type === 'radio' && input.checked) {
      // For radios, only include the checked one
      data[input.name] = input.value;
    }
  });

  // Collect enabled select values
  selects.enabled().forEach(select => {
    if (select.name) {
      data[select.name] = select.value;
    }
  });

  return data;
}

console.log('Form data:', getFormData());
```

---

**Example 3: Focus the First Enabled Field**

```javascript
function focusFirstEnabled() {
  const inputs = Collections.ClassName['form-field'];
  const enabled = inputs.enabled();

  if (enabled.length > 0) {
    enabled[0].focus();
    console.log('Focused:', enabled[0].name || enabled[0].id);
  } else {
    console.log('No enabled fields to focus');
  }
}

// Focus the first enabled field when the form loads
document.addEventListener('DOMContentLoaded', focusFirstEnabled);
```

---

**Example 4: Count Form Completion**

```javascript
function getFormCompletion() {
  const allInputs = Collections.ClassName['required-input'];
  const enabled = allInputs.enabled();
  const filled = enabled.filter(input => input.value.trim() !== '');

  const progress = {
    total: allInputs.length,
    enabled: enabled.length,
    disabled: allInputs.disabled().length,
    filled: filled.length,
    remaining: enabled.length - filled.length,
    percent: enabled.length > 0
      ? Math.round((filled.length / enabled.length) * 100)
      : 0
  };

  console.log(`Form completion: ${progress.percent}% (${progress.filled}/${progress.enabled} enabled fields filled)`);
  return progress;
}
```

---

## 4. disabled() — Get Only Disabled Form Elements

Returns a new array containing only the form elements that are **disabled** (`element.disabled === true`).

### Syntax

```javascript
collection.disabled()
// Returns: plain array of disabled elements
```

---

### Basic Usage

```javascript
const buttons = Collections.TagName.button;

// Find all disabled buttons
const disabledButtons = buttons.disabled();

console.log(`Disabled buttons: ${disabledButtons.length}`);

// Check which ones are disabled and why
disabledButtons.forEach(btn => {
  console.log(`Disabled: ${btn.textContent} (reason: ${btn.dataset.disabledReason || 'unknown'})`);
});
```

---

### Examples

**Example 1: Re-enable All Disabled Inputs**

```javascript
function enableAllDisabled() {
  const inputs = Collections.TagName.input;
  const disabled = inputs.disabled();

  if (disabled.length === 0) {
    console.log('No disabled inputs found');
    return;
  }

  disabled.forEach(input => {
    input.disabled = false;
    input.classList.remove('disabled');
    input.removeAttribute('aria-disabled');
  });

  console.log(`Re-enabled ${disabled.length} inputs`);
}
```

---

**Example 2: Style All Disabled Elements Consistently**

```javascript
function styleDisabledElements() {
  const inputs = Collections.TagName.input;
  const buttons = Collections.TagName.button;
  const selects = Collections.TagName.select;

  // Get disabled elements from each type
  const disabledInputs = inputs.disabled();
  const disabledButtons = buttons.disabled();
  const disabledSelects = selects.disabled();

  // Apply consistent disabled styling
  [...disabledInputs, ...disabledButtons, ...disabledSelects].forEach(el => {
    el.style.backgroundColor = '#f3f4f6';
    el.style.color = '#9ca3af';
    el.style.cursor = 'not-allowed';
    el.setAttribute('aria-disabled', 'true');
    el.setAttribute('title', 'This field is currently disabled');
  });

  const total = disabledInputs.length + disabledButtons.length + disabledSelects.length;
  console.log(`Styled ${total} disabled elements`);
}
```

---

**Example 3: Report Disabled Fields**

```javascript
function reportDisabledFields() {
  const inputs = Collections.ClassName['form-input'];
  const disabled = inputs.disabled();

  if (disabled.length === 0) {
    console.log('No disabled form fields');
    return;
  }

  console.group(`Disabled Fields (${disabled.length})`);
  disabled.forEach((input, index) => {
    console.log(`  ${index + 1}. ${input.name || input.id || 'unnamed'}: "${input.value}"`);
  });
  console.groupEnd();
}

reportDisabledFields();
// Output:
// Disabled Fields (2)
//   1. email: "admin@example.com"
//   2. role: "Administrator"
```

---

**Example 4: Skip Disabled in Keyboard Navigation**

```javascript
const buttons = Collections.ClassName.btn;
let currentFocusIndex = 0;

function focusNextEnabled() {
  const enabled = buttons.enabled();

  if (enabled.length === 0) {
    console.log('No enabled buttons to navigate');
    return;
  }

  currentFocusIndex = (currentFocusIndex + 1) % enabled.length;
  enabled[currentFocusIndex].focus();
  console.log('Focused button:', enabled[currentFocusIndex].textContent);
}

// Press Tab-like navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'F2') { // Custom keyboard shortcut
    focusNextEnabled();
  }
});
```

---

## Combining Filtering Methods

Filtering methods return plain arrays, so you can chain them with standard array `filter()` for more specific conditions.

### Example 1: Visible AND Enabled

```javascript
const inputs = Collections.TagName.input;

// Get inputs that are both visible AND enabled
const activeInputs = inputs
  .visible()
  .filter(input => !input.disabled);

// Or equivalently:
const activeInputs2 = inputs
  .enabled()
  .filter(input => input.offsetParent !== null);

console.log(`Active (visible & enabled) inputs: ${activeInputs.length}`);
```

---

### Example 2: Hidden OR Disabled (Unavailable Fields)

```javascript
const fields = Collections.ClassName.field;

const hidden = fields.hidden();
const disabled = fields.disabled();

// Combine and deduplicate using Set
const unavailable = [...new Set([...hidden, ...disabled])];

console.log(`Total unavailable fields: ${unavailable.length}`);
console.log(`  - Hidden: ${hidden.length}`);
console.log(`  - Disabled: ${disabled.length}`);
console.log(`  - Both hidden and disabled: ${hidden.length + disabled.length - unavailable.length}`);
```

---

### Example 3: Visible, Enabled, and Non-Empty

```javascript
const inputs = Collections.ClassName.input;

// The "active and filled" inputs — the ones we care about for submission
const filledActiveInputs = inputs
  .visible()
  .filter(input => !input.disabled && input.value.trim() !== '');

console.log(`Filled active inputs: ${filledActiveInputs.length}`);

const formData = filledActiveInputs.reduce((data, input) => {
  if (input.name) data[input.name] = input.value.trim();
  return data;
}, {});

console.log('Submission data:', formData);
```

---

## Real-World Patterns

### Pattern 1: Smart Form Submission

```javascript
class SmartForm {
  constructor(formClass) {
    this.inputs = Collections.ClassName[`${formClass}-input`];
  }

  validate() {
    // Only validate what's currently visible and enabled
    const toValidate = this.inputs
      .visible()
      .filter(input => !input.disabled);

    const errors = [];

    toValidate.forEach(input => {
      if (input.hasAttribute('required') && !input.value.trim()) {
        errors.push({ field: input.name, message: 'Required field is empty' });
        input.classList.add('error');
      } else if (!input.validity.valid) {
        errors.push({ field: input.name, message: input.validationMessage });
        input.classList.add('error');
      } else {
        input.classList.remove('error');
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      fieldCount: toValidate.length
    };
  }

  getData() {
    // Only collect data from visible, enabled inputs
    const active = this.inputs
      .visible()
      .filter(input => !input.disabled);

    return active.reduce((data, input) => {
      if (input.name) data[input.name] = input.value;
      return data;
    }, {});
  }

  async submit() {
    const { valid, errors } = this.validate();

    if (!valid) {
      console.error('Validation failed:', errors);
      return false;
    }

    const data = this.getData();
    console.log('Submitting:', data);
    // ... actual submission logic
    return true;
  }
}
```

### Pattern 2: Conditional Field Management

```javascript
class ConditionalForm {
  constructor() {
    this.conditionalFields = Collections.ClassName['conditional-field'];
  }

  // Show/hide fields based on a condition value
  updateFields(conditionValue) {
    this.conditionalFields.forEach(field => {
      const showWhen = field.dataset.showWhen;

      if (showWhen === conditionValue) {
        // Show this field
        field.classList.remove('hidden');

        // Re-enable its inputs
        const fieldInputs = Array.from(field.querySelectorAll('input, select, textarea'));
        fieldInputs.forEach(input => {
          input.disabled = false;
          input.removeAttribute('aria-hidden');
        });
      } else {
        // Hide this field
        field.classList.add('hidden');

        // Disable its inputs (so they're skipped during validation)
        const fieldInputs = Array.from(field.querySelectorAll('input, select, textarea'));
        fieldInputs.forEach(input => {
          input.disabled = true;
          input.value = '';
          input.setAttribute('aria-hidden', 'true');
        });
      }
    });

    // Report state
    const visible = this.conditionalFields.visible().length;
    const hidden = this.conditionalFields.hidden().length;
    console.log(`Fields: ${visible} visible, ${hidden} hidden`);
  }

  getActiveData() {
    // Get data from visible, enabled fields only
    const allInputs = Collections.TagName.input;
    return allInputs
      .visible()
      .filter(i => !i.disabled)
      .reduce((data, input) => {
        if (input.name) data[input.name] = input.value;
        return data;
      }, {});
  }
}
```

### Pattern 3: Progressive Form Wizard

```javascript
class FormWizard {
  constructor() {
    this.steps = Collections.ClassName['wizard-step'];
    this.currentStep = 0;
  }

  getProgress() {
    const visible = this.steps.visible();
    const total = this.steps.length;
    return {
      current: this.currentStep + 1,
      total,
      percent: Math.round(((this.currentStep + 1) / total) * 100)
    };
  }

  validateCurrentStep() {
    // Get the current visible step's inputs
    const currentStep = this.steps.visible()[0];
    if (!currentStep) return true;

    const stepInputs = Array.from(currentStep.querySelectorAll('input, select, textarea'));
    const enabled = stepInputs.filter(input => !input.disabled);

    return enabled.every(input => {
      if (input.hasAttribute('required') && !input.value.trim()) return false;
      return input.validity.valid;
    });
  }

  nextStep() {
    if (!this.validateCurrentStep()) {
      console.warn('Please complete all fields before continuing');
      return false;
    }

    const hidden = this.steps.hidden();
    const visible = this.steps.visible();

    if (hidden.length > 0) {
      // Hide current step
      if (visible[0]) visible[0].classList.add('hidden');

      // Show next step
      hidden[0].classList.remove('hidden');
      this.currentStep++;

      const progress = this.getProgress();
      console.log(`Step ${progress.current} of ${progress.total} (${progress.percent}%)`);
      return true;
    }

    console.log('Already on the last step');
    return false;
  }
}
```

---

## Performance Considerations

### Cache Filter Results When Used Multiple Times

```javascript
const cards = Collections.ClassName.card;

// ❌ Calling visible() twice — runs the check twice
cards.visible().forEach(card => process(card));
cards.visible().forEach(card => update(card));

// ✅ Cache the result
const visibleCards = cards.visible();
visibleCards.forEach(card => process(card));
visibleCards.forEach(card => update(card));
```

### Combine Conditions in One Filter for Large Collections

```javascript
const inputs = Collections.TagName.input;

// ❌ Two passes over the collection
const visible = inputs.visible();
const enabledVisible = visible.filter(i => !i.disabled);

// ✅ One pass with combined conditions
const activeInputs = inputs.filter(input =>
  input.offsetParent !== null &&    // visible check
  !input.disabled                   // enabled check
);
```

For small collections (under 100 elements), the difference is negligible. For large collections, the single-pass approach is noticeably faster.

---

## Best Practices

### ✅ Use Filtering Methods for Readable Code

```javascript
// Clear intent — what you're doing is obvious
const visible = items.visible();
visible.forEach(item => animate(item));
```

### ✅ Cache Filter Results

```javascript
// Good — compute once, use multiple times
const enabled = inputs.enabled();
const allFilled = enabled.every(i => i.value.trim() !== '');
const count = enabled.length;
```

### ✅ Combine with filter() for Complex Conditions

```javascript
// Combining built-in method with custom condition
const activeRequired = inputs
  .visible()
  .filter(input => !input.disabled && input.hasAttribute('required'));
```

### ❌ Don't Use Collection Methods on Filter Results

```javascript
const visible = items.visible(); // Returns plain ARRAY, not Collection

// ❌ Won't work — plain array doesn't have addClass
visible.addClass('processed'); // TypeError!

// ✅ Use forEach on the plain array
visible.forEach(item => item.classList.add('processed'));
```

### ❌ Don't Assume the Result Is a Collection

```javascript
// Always remember: visible(), hidden(), enabled(), disabled()
// return plain arrays — not Collections.

// You CAN use: forEach, map, filter, find, some, every, reduce, length, [index]
// You CANNOT use: addClass, setStyle, setProperty, on, off
```

---

## Key Takeaways

1. **Four filtering methods** — `visible()`, `hidden()`, `enabled()`, `disabled()`
2. **All return plain arrays** — not Collections; use `forEach`, `map`, `filter` on the result
3. **visible()** — elements with `offsetParent !== null`, not `visibility:hidden`, not `opacity:0`
4. **hidden()** — the exact inverse of `visible()`
5. **enabled()** — form elements where `disabled === false`
6. **disabled()** — form elements where `disabled === true`
7. **Combinable** — chain with `.filter()` for complex conditions like "visible AND enabled AND non-empty"
8. **Cache results** — store in a variable when you'll use the result multiple times

---

## What's Next?

Now let's explore utility methods for accessing specific elements within a collection:

- **first(), last()** — Get the first or last element
- **at(index)** — Get by index with negative index support
- **isEmpty()** — Check if the collection is empty
- **item(), namedItem()** — Legacy access methods

Continue to **Utility Methods** →