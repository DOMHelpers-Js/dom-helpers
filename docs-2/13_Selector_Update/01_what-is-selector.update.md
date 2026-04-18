[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Selector.update()

## What is it?

`Selector.update()` is the **most flexible** of the three update methods. It lets you update elements using **any CSS selector you can imagine**—the same selectors you use in your stylesheets.

Want to update "all paragraphs inside divs with class 'content'"? Done.  
Want to target "the third list item in an unordered list"? Easy.  
Want to style "all links that start with 'https'"? No problem.

If you can select it with CSS, you can update it with `Selector.update()`.

---

## Why does this exist?

You already know `Elements.update()` targets IDs and `Collections.update()` targets classes/tags/names. So why do we need a third method?

**Because sometimes your selectors are more complex than that.**

### Real examples where you need Selector.update():

**1. Attribute selectors**

```javascript
// All email inputs
'input[type="email"]';

// All external links
'a[href^="https://"]';

// All required form fields
"[required]";
```

**2. Descendant selectors**

```javascript
// Paragraphs inside articles
"article p";

// List items in the sidebar
".sidebar li";

// Buttons in the footer
"footer button";
```

**3. Pseudo-selectors**

```javascript
// Every other row
"tr:nth-child(even)";

// First paragraph
"p:first-of-type";

// Checked checkboxes
"input:checked";
```

**4. Combinators**

```javascript
// Direct children only
".container > .item";

// Adjacent siblings
"h1 + p";

// General siblings
"h2 ~ p";
```

`Elements.update()` and `Collections.update()` can't handle these. **Selector.update() can.**

---

## The power of CSS selectors

If you know CSS, you already know how to use `Selector.update()`.

Every selector you use in your stylesheets works here:

```css
/* In your CSS */
.container > .card:hover {
  background-color: #f3f4f6;
}
```

```javascript
// Same selector in Selector.update()
Selector.update({
  ".container > .card": {
    style: { backgroundColor: "#f3f4f6" },
  },
});
```

**The selectors work exactly the same way.**

---

## Syntax

```javascript
Selector.update({
  cssSelector: updateObject,
});
```

**Two parts:**

1. **CSS Selector** (as a string) — Identifies which elements to target
2. **Update Object** — Describes what changes to apply

### Basic example

```javascript
Selector.update({
  "#header": { textContent: "Welcome!" }, // ID selector
  ".btn": { disabled: true }, // Class selector
  p: { style: { lineHeight: "1.6" } }, // Tag selector
  'input[type="email"]': { placeholder: "Email" }, // Attribute selector
});
```

---

## Real example: Styling a login form

Let's say you have this HTML:

```html
<form class="login-form">
  <input type="email" name="email" />
  <input type="password" name="password" />
  <input type="checkbox" name="remember" />
  <button type="submit">Login</button>
  <button type="button" class="secondary">Cancel</button>
</form>
```

You want to style it all at once, targeting different types of elements.

### With Selector.update():

```javascript
Selector.update({
  // All email inputs get a specific placeholder and style
  'input[type="email"]': {
    placeholder: "your.email@example.com",
    style: {
      borderColor: "#3b82f6",
      padding: "10px",
      borderRadius: "4px",
    },
  },

  // All password inputs get different styling
  'input[type="password"]': {
    placeholder: "Enter your password",
    style: {
      borderColor: "#6b7280",
      padding: "10px",
      borderRadius: "4px",
    },
  },

  // Style the submit button
  'button[type="submit"]': {
    textContent: "Sign In",
    style: {
      backgroundColor: "#3b82f6",
      color: "white",
      padding: "12px 30px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
  },

  // Style secondary buttons differently
  "button.secondary": {
    style: {
      backgroundColor: "#e5e7eb",
      color: "#374151",
      padding: "12px 30px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
  },
});
```

**What happened:**

- Email inputs got blue borders
- Password inputs got gray borders
- Submit button became blue with white text
- Cancel button got a gray style

**All in one call. No loops. No repetition.**

---

## Before and After: Seeing the transformation

Let's visualize what `Selector.update()` does.

### Scenario: Highlighting validation errors

You have a form with several inputs:

```html
<form>
  <input type="text" name="username" value="" />
  <input type="email" name="email" value="invalid-email" />
  <input type="password" name="password" value="123" />
  <input type="text" name="phone" value="" />
</form>
```

**Before (default state):**

```
┌─────────────────────────────────┐
│  [          ]  username          │  ← Gray border
│  [invalid   ]  email             │  ← Gray border
│  [***       ]  password          │  ← Gray border
│  [          ]  phone             │  ← Gray border
└─────────────────────────────────┘
```

**Then validation runs and you update:**

```javascript
Selector.update({
  // All empty required fields get red borders
  'input[value=""]': {
    style: {
      borderColor: "#ef4444",
      borderWidth: "2px",
    },
    setAttribute: { "aria-invalid": "true" },
  },

  // Email input with invalid value gets special treatment
  'input[type="email"]': {
    style: {
      borderColor: "#ef4444",
      backgroundColor: "#fef2f2",
    },
  },

  // Password that's too short gets highlighted
  'input[type="password"]': {
    style: {
      borderColor: "#f59e0b",
      backgroundColor: "#fffbeb",
    },
  },
});
```

**After:**

```
┌─────────────────────────────────┐
│  [          ]  username          │  ← RED border (empty)
│  [invalid   ]  email             │  ← RED border + pink background
│  [***       ]  password          │  ← ORANGE border + yellow background
│  [          ]  phone             │  ← RED border (empty)
└─────────────────────────────────┘
```

**What happened:**

- Empty inputs (username, phone) got red borders
- Invalid email got red border + pink background
- Short password got orange border + yellow background

**You targeted each group with precise CSS selectors.**

---

## The power of complex selectors

This is where `Selector.update()` really shines—when you need surgical precision.

### Example 1: Styling alternating table rows

```javascript
Selector.update({
  // Even rows get gray background
  "table tr:nth-child(even)": {
    style: { backgroundColor: "#f9fafb" },
  },

  // Odd rows stay white
  "table tr:nth-child(odd)": {
    style: { backgroundColor: "white" },
  },

  // Header row gets special styling
  "table tr:first-child": {
    style: {
      backgroundColor: "#1f2937",
      color: "white",
      fontWeight: "bold",
    },
  },
});
```

**Result:** Striped table with styled header—no manual classes needed.

---

### Example 2: Targeting specific navigation items

```javascript
Selector.update({
  // The current page link gets highlighted
  'nav a[aria-current="page"]': {
    style: {
      color: "#3b82f6",
      fontWeight: "bold",
      borderBottom: "2px solid #3b82f6",
    },
  },

  // External links get an icon indicator
  'nav a[href^="http"]': {
    setAttribute: { "data-external": "true" },
    style: { paddingRight: "20px" },
  },

  // Disabled links get muted styling
  'nav a[aria-disabled="true"]': {
    style: {
      opacity: "0.5",
      cursor: "not-allowed",
      pointerEvents: "none",
    },
  },
});
```

**Result:** Smart navigation with visual indicators based on link state.

---

### Example 3: Form field states

```javascript
Selector.update({
  // Required fields that are empty get red borders
  "input[required]:invalid": {
    style: { borderColor: "#ef4444" },
  },

  // Valid fields get green checkmarks
  "input:valid": {
    style: { borderColor: "#10b981" },
  },

  // Disabled fields get gray background
  "input:disabled": {
    style: {
      backgroundColor: "#f3f4f6",
      cursor: "not-allowed",
    },
  },

  // Focused fields get blue glow
  "input:focus": {
    style: {
      outline: "none",
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
    },
  },
});
```

**Result:** Dynamic form with visual feedback based on field state.

---

## Comparing the three update methods

Let's see when to use each one:

| Method                   | Targets                            | Best for                   | Example                            |
| ------------------------ | ---------------------------------- | -------------------------- | ---------------------------------- |
| **Elements.update()**    | Individual elements by ID          | Specific named elements    | `{ header: {...}, footer: {...} }` |
| **Collections.update()** | Groups by class/tag/name           | Simple bulk updates        | `{ 'class:btn': {...} }`           |
| **Selector.update()**    | Anything a CSS selector can target | Complex, precise targeting | `{ 'input[type="email"]': {...} }` |

### When to use Selector.update():

✅ **Use it when:**

- You need attribute selectors (`[type="email"]`)
- You need pseudo-selectors (`:hover`, `:nth-child()`)
- You need combinators (`>`, `+`, `~`)
- You need descendant selectors (`article p`)
- Your selectors are more complex than a simple class or ID

❌ **Don't use it when:**

- You're just targeting by ID → Use `Elements.update()`
- You're just targeting by class/tag → Use `Collections.update()`
- You want the simpler, clearer syntax

**Rule of thumb:**  
Start with `Elements.update()` or `Collections.update()`. Switch to `Selector.update()` when you need the power of full CSS selectors.

---

## Return value

`Selector.update()` gives you back a detailed report, just like the other methods.

```javascript
const results = Selector.update({
  "#header": { textContent: "Welcome!" },
  ".alert": { style: { display: "block" } },
  'input[type="email"]': { placeholder: "Email" },
});

console.log(results);
```

**You get:**

```javascript
{
  '#header': {
    success: true,
    elements: EnhancedCollection,
    elementsUpdated: 1
  },
  '.alert': {
    success: true,
    elements: EnhancedCollection,
    elementsUpdated: 3
  },
  'input[type="email"]': {
    success: true,
    elements: EnhancedCollection,
    elementsUpdated: 2
  }
}
```

### Understanding the results

Each selector key has three properties:

**1. `success` (boolean)**

- `true` if the update completed (even if 0 elements found)
- `false` if something went wrong (invalid selector)

**2. `elements` (EnhancedCollection)**

- Reference to all elements that matched the selector
- You can loop through them, access individual elements, etc.

**3. `elementsUpdated` (number)**

- How many elements were actually updated
- Can be 0 (no matches), 1 (single element), or many

---

## Using the return value

### Pattern 1: Verify elements were found

```javascript
const results = Selector.update({
  "input[required]": {
    style: { borderColor: "#ef4444" },
  },
});

if (results["input[required]"].elementsUpdated === 0) {
  console.warn("No required fields found on this form");
}
```

---

### Pattern 2: Log what was updated

```javascript
const results = Selector.update({
  'a[href^="https://"]': {
    setAttribute: { target: "_blank", rel: "noopener" },
  },
});

console.log(
  `Made ${results['a[href^="https://"]'].elementsUpdated} external links open in new tab`,
);
// "Made 15 external links open in new tab"
```

---

### Pattern 3: Work with the matched elements

```javascript
const results = Selector.update({
  ".card:hover": {
    classList: { add: "elevated" },
  },
});

// Add click handlers to the same cards
results[".card:hover"].elements.forEach((card) => {
  card.addEventListener("click", handleCardClick);
});
```

---

### Pattern 4: Conditional updates based on results

```javascript
const results = Selector.update({
  'input[type="email"]:invalid': {
    style: { borderColor: "#ef4444" },
  },
});

if (results['input[type="email"]:invalid'].elementsUpdated > 0) {
  // Show error message
  alert(
    `Please fix ${results['input[type="email"]:invalid'].elementsUpdated} invalid email addresses`,
  );
}
```

---

## Real-world examples

### Example 1: Dark mode implementation

```javascript
function enableDarkMode() {
  Selector.update({
    body: {
      style: {
        backgroundColor: "#1f2937",
        color: "#f9fafb",
      },
    },

    a: {
      style: { color: "#60a5fa" },
    },

    ".card, .panel, section": {
      style: {
        backgroundColor: "#374151",
        borderColor: "#4b5563",
      },
    },

    "input, textarea, select": {
      style: {
        backgroundColor: "#111827",
        color: "#f9fafb",
        borderColor: "#4b5563",
      },
    },

    button: {
      style: {
        backgroundColor: "#1f2937",
        color: "#f9fafb",
        borderColor: "#4b5563",
      },
    },
  });
}
```

**Result:** Entire page switches to dark mode instantly.

---

### Example 2: Form accessibility improvements

```javascript
Selector.update({
  // Add labels to inputs that don't have them
  "input:not([aria-label]):not([aria-labelledby])": {
    setAttribute: {
      "aria-label": "Input field",
      role: "textbox",
    },
  },

  // Mark required fields
  "input[required], select[required], textarea[required]": {
    setAttribute: { "aria-required": "true" },
  },

  // Add keyboard focus indicators
  "a:focus, button:focus, input:focus": {
    style: {
      outline: "2px solid #3b82f6",
      outlineOffset: "2px",
    },
  },

  // Ensure buttons have proper roles
  "button:not([role])": {
    setAttribute: { role: "button" },
  },
});
```

**Result:** More accessible form with proper ARIA attributes and visual focus indicators.

---

### Example 3: Image lazy loading

```javascript
Selector.update({
  // Add lazy loading to all images
  "img:not([loading])": {
    setAttribute: { loading: "lazy" },
  },

  // Add placeholders to images without alt text
  "img:not([alt])": {
    setAttribute: { alt: "Image" },
  },

  // Make decorative images invisible to screen readers
  'img[alt=""], img.decorative': {
    setAttribute: {
      "aria-hidden": "true",
      role: "presentation",
    },
  },
});
```

**Result:** All images are lazy-loaded and accessible.

---

### Example 4: External link handling

```javascript
Selector.update({
  // Make external links open in new tab
  'a[href^="http://"], a[href^="https://"]': {
    setAttribute: {
      target: "_blank",
      rel: "noopener noreferrer",
    },
  },

  // Add download attribute to file links
  'a[href$=".pdf"], a[href$=".doc"], a[href$=".zip"]': {
    setAttribute: { download: "" },
  },

  // Style mailto links
  'a[href^="mailto:"]': {
    style: {
      color: "#059669",
      textDecoration: "underline",
    },
  },
});
```

**Result:** Smart link behavior based on link type.

---

## Advanced selector techniques

### Combining multiple conditions

```javascript
Selector.update({
  // Inputs that are both required AND empty
  'input[required][value=""]': {
    style: { borderColor: "#ef4444" },
  },

  // Links that are external AND in the navigation
  'nav a[href^="https://"]': {
    setAttribute: { "data-external": "true" },
  },
});
```

---

### Using descendant and child selectors

```javascript
Selector.update({
  // Only paragraphs directly inside articles (child selector)
  "article > p": {
    style: { fontSize: "18px" },
  },

  // All paragraphs anywhere inside articles (descendant)
  "article p": {
    style: { lineHeight: "1.6" },
  },

  // List items in the sidebar only
  ".sidebar ul li": {
    style: { paddingLeft: "20px" },
  },
});
```

---

### Using pseudo-selectors

```javascript
Selector.update({
  // First paragraph in each article
  "article p:first-child": {
    style: {
      fontSize: "20px",
      fontWeight: "500",
    },
  },

  // Every third list item
  "li:nth-child(3n)": {
    style: { backgroundColor: "#f3f4f6" },
  },

  // Last element of a type
  ".container div:last-of-type": {
    style: { marginBottom: "0" },
  },
});
```

---

## Edge cases and gotchas

### Invalid selectors fail gracefully

```javascript
const results = Selector.update({
  "invalid:::selector": { textContent: "Hello" },
});

// Returns:
// {
//   'invalid:::selector': {
//     success: false,
//     error: "Invalid selector"
//   }
// }
```

**No crash. Just a failure report.**

---

### Empty results are not errors

```javascript
const results = Selector.update({
  'input[type="date"]': { style: { borderColor: "blue" } },
});

// If no date inputs exist:
// {
//   'input[type="date"]': {
//     success: true,
//     elements: EmptyCollection,
//     elementsUpdated: 0,
//     warning: "No elements found matching selector"
//   }
// }
```

---

### Pseudo-selectors like :hover don't persist

```javascript
Selector.update({
  "button:hover": {
    style: { backgroundColor: "blue" },
  },
});
```

**This updates buttons that are CURRENTLY being hovered.** It doesn't make the hover state permanent.

**For persistent styling, use classes:**

```javascript
// Better approach
Selector.update({
  button: {
    classList: { add: "hover-effect" },
  },
});
```

Then handle :hover in CSS:

```css
button.hover-effect:hover {
  background-color: blue;
}
```

---

## Best practices

### ✅ DO: Use specific selectors

```javascript
// Good - targets exactly what you want
Selector.update({
  'form.login input[type="email"]': {
    /* ... */
  },
});
```

### ❌ DON'T: Use overly broad selectors

```javascript
// Bad - affects every div on the page
Selector.update({
  div: { style: { margin: "20px" } },
});
```

---

### ✅ DO: Combine related selectors

```javascript
// Good - updates similar elements together
Selector.update({
  'input[type="text"], input[type="email"], textarea': {
    style: { padding: "10px" },
  },
});
```

---

### ✅ DO: Check results for critical selectors

```javascript
const results = Selector.update({
  'button[type="submit"]': { disabled: false },
});

if (results['button[type="submit"]'].elementsUpdated === 0) {
  console.error("No submit button found!");
}
```

---

### ✅ DO: Use attribute selectors for semantic targeting

```javascript
// Good - targets by purpose, not appearance
Selector.update({
  '[role="alert"]': { style: { display: "block" } },
  '[aria-invalid="true"]': { style: { borderColor: "red" } },
});
```

---

## Mental model: Surgical precision

Think of the three update methods like different tools:

- **Elements.update()** = **Sniper rifle**  
  Hits one specific target at a time (IDs)

- **Collections.update()** = **Shotgun**  
  Hits groups of similar targets (classes, tags)

- **Selector.update()** = **Smart missile**  
  Hits exactly what you specify with complex targeting (CSS selectors)

You choose the tool based on how precisely you need to target.

---

## Performance considerations

### Selector caching

Good news: `Selector.update()` caches results!

```javascript
// First call - looks up elements
Selector.update({
  ".btn": { disabled: true },
});

// Second call - uses cached result (faster)
Selector.update({
  ".btn": { textContent: "Loading..." },
});
```

The selector is cached, so repeated updates are fast.

---

### Complex selectors are slower

```javascript
// Fast - simple selector
Selector.update({
  ".btn": {
    /* ... */
  },
});

// Slower - complex selector
Selector.update({
  'div.container > ul.list li:nth-child(3n+1) a[href^="https"]': {
    /* ... */
  },
});
```

**Simple selectors are faster.** Use complex selectors only when you need the precision.

---

## Key takeaways

**What `Selector.update()` does:**

- Updates elements using any CSS selector
- Handles complex targeting that other methods can't
- Returns results telling you what happened

**When to use it:**

- Attribute selectors (`[type="email"]`)
- Pseudo-selectors (`:nth-child()`, `:hover`)
- Descendant selectors (`article p`)
- Combinators (`>`, `+`, `~`)
- Any complex CSS selector

**Why it's powerful:**

- Full CSS selector support
- Surgical precision
- No manual loops
- Cached for performance

**Remember:**

> _"If you can select it in CSS, you can update it with Selector.update()."_

That's the power and the promise. Use it wisely.