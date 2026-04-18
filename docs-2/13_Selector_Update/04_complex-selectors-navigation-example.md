[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Understanding Complex Selectors: The Navigation Example

## The scenario

You have a navigation bar — the row of links at the top of most websites.

```html
<nav>
  <a href="/home" aria-current="page">Home</a>
  <a href="/about">About</a>
  <a href="https://github.com/myproject">GitHub</a>
  <a href="/settings" aria-disabled="true">Settings</a>
</nav>
```

Right now all four links look identical. But they're not the same:

- One is the **current page** you're on
- One is a **normal** internal link
- One goes to an **external website**
- One is **disabled** (you can't use it yet)

Each deserves different visual treatment. That's what this code does.

```
┌──────────────────────────────────────────────────┐
│  Home    About    GitHub    Settings              │
│  (all look the same — bad UX)                    │
└──────────────────────────────────────────────────┘
```

Let's make it look and behave properly.

---

## The full code

```javascript
Selector.update({
  'nav a[aria-current="page"]': {
    style: {
      color: '#3b82f6',
      fontWeight: 'bold',
      borderBottom: '2px solid #3b82f6'
    }
  },
  'nav a[href^="http"]': {
    setAttribute: { 'data-external': 'true' },
    style: { paddingRight: '20px' }
  },
  'nav a[aria-disabled="true"]': {
    style: {
      opacity: '0.5',
      cursor: 'not-allowed',
      pointerEvents: 'none'
    }
  }
});
```

Three selectors. Three very different jobs. Let's learn each one.

---

## Selector 1: `nav a[aria-current="page"]`

```javascript
'nav a[aria-current="page"]': {
  style: {
    color: '#3b82f6',
    fontWeight: 'bold',
    borderBottom: '2px solid #3b82f6'
  }
}
```

### Breaking it apart

```
nav   a   [aria-current="page"]
 │    │            │
 │    │            └── "that has aria-current set to 'page'"
 │    └────────────── "find link elements..."
 └─────────────────── "inside the navigation..."
```

### What is `aria-current`?

`aria-current` is a special HTML attribute used to tell both the browser and assistive technologies (like screen readers) **which link represents the page you are currently on**.

```html
<!-- You're on the Home page, so: -->
<a href="/home" aria-current="page">Home</a>

<!-- These pages are NOT current: -->
<a href="/about">About</a>
<a href="/contact">Contact</a>
```

Think of it like a "You Are Here" marker on a map. Only one link has it at a time.

### The three style changes

**`color: '#3b82f6'`**  
Changes the text colour to a bright blue. `#3b82f6` is a vivid, friendly blue — easy to spot.

**`fontWeight: 'bold'`**  
Makes the text thicker. Bold text signals importance — "this is where you are."

**`borderBottom: '2px solid #3b82f6'`**  
This is a new one! Let's break it down:

```
borderBottom:  '2px    solid    #3b82f6'
                 │       │          │
                 │       │          └── Same blue as the text
                 │       └──────────── A solid line (not dashed)
                 └──────────────────── 2 pixels thick
```

It draws a **blue underline** directly beneath the link text — but not the thin default underline. A proper 2-pixel thick highlight line.

**What the user sees after this selector:**

```
┌──────────────────────────────────────────────────┐
│  Home    About    GitHub    Settings              │
│  ════                                             │
│  (bold blue text with blue underline)             │
└──────────────────────────────────────────────────┘
```

Home stands out. You can immediately see where you are.

---

## Selector 2: `nav a[href^="http"]`

```javascript
'nav a[href^="http"]': {
  setAttribute: { 'data-external': 'true' },
  style: { paddingRight: '20px' }
}
```

### Breaking it apart

```
nav   a   [href^="http"]
 │    │         │
 │    │         └── "whose href attribute STARTS WITH 'http'"
 │    └──────────── "find link elements..."
 └─────────────────"inside the navigation..."
```

### What is `^=` ?

This is a new symbol — the **"starts with" operator**.

You already know `=` means "equals exactly". The `^=` means "starts with". It's like asking:
> "Does this value begin with these characters?"

```
href="https://github.com"   →  starts with "http" ✅  (external)
href="https://twitter.com"  →  starts with "http" ✅  (external)
href="/about"               →  starts with "http" ❌  (internal)
href="/contact"             →  starts with "http" ❌  (internal)
```

Why check for `http` and not the full `https://`? Because some links use `http://` and others use `https://`. Using just `http` catches both.

### What is `setAttribute`?

`setAttribute` adds a **new attribute** to the element. In this case:

```javascript
setAttribute: { 'data-external': 'true' }
```

This adds `data-external="true"` directly to the HTML element:

```html
<!-- Before -->
<a href="https://github.com">GitHub</a>

<!-- After -->
<a href="https://github.com" data-external="true">GitHub</a>
```

### What is a `data-` attribute?

`data-` attributes are custom attributes you can invent yourself. They don't change how the element looks or works by default — but they're useful for:
- Marking elements for CSS to style later
- Storing information JavaScript can read later
- Labelling elements for testing or tracking

Here, `data-external="true"` marks the link so that CSS can show a little icon next to it (like ↗ or 🔗), indicating it opens an external website.

### What is `paddingRight: '20px'`?

Padding is the **space inside an element** between its content and its edge.

`paddingRight: '20px'` adds 20 pixels of space on the right side of the link text. This creates room for the external icon so it doesn't overlap the text.

```
Without padding:        With paddingRight: '20px':
[GitHub↗]               [GitHub    ↗]
                                  ↑
                           space for icon
```

**What the user sees after this selector:**

```
┌──────────────────────────────────────────────────┐
│  Home    About    GitHub ↗    Settings            │
│  ════                                             │
│                  (extra space + icon hint)        │
└──────────────────────────────────────────────────┘
```

Users now know GitHub opens outside the current website.

---

## Selector 3: `nav a[aria-disabled="true"]`

```javascript
'nav a[aria-disabled="true"]': {
  style: {
    opacity: '0.5',
    cursor: 'not-allowed',
    pointerEvents: 'none'
  }
}
```

### Breaking it apart

```
nav   a   [aria-disabled="true"]
 │    │            │
 │    │            └── "that has aria-disabled set to 'true'"
 │    └────────────── "find link elements..."
 └─────────────────── "inside the navigation..."
```

### What is `aria-disabled`?

Like `aria-current`, this is an accessibility attribute. `aria-disabled="true"` signals that a link **exists but is not available right now**.

Maybe the user doesn't have permission yet. Maybe a feature is coming soon. The link is visible, but shouldn't be clicked.

```html
<a href="/settings" aria-disabled="true">Settings</a>
```

Without any styling, a disabled link looks just like a normal link — confusing. This selector fixes that.

### Three style changes that together say "don't click me"

**`opacity: '0.5'`**  
Opacity controls how **transparent** an element is.

```
opacity: 1    = fully visible (default)
opacity: 0.5  = 50% see-through (faded/muted)
opacity: 0    = completely invisible
```

Setting it to `0.5` fades the link to half its normal brightness. It's still visible but clearly muted — the visual language of "unavailable."

**`cursor: 'not-allowed'`**  
This changes the **mouse cursor** that appears when you hover over the link.

By default, hovering a link shows a pointing hand (`pointer`) that invites clicking. `not-allowed` changes it to a circle with a line through it — the universal "no" symbol.

```
cursor: 'pointer'     →  👆  (click me!)
cursor: 'not-allowed' →  🚫  (you can't)
cursor: 'default'     →  ↖   (normal arrow)
```

This is purely visual — it doesn't actually stop clicks, but it communicates clearly.

**`pointerEvents: 'none'`**  
This is the one that **actually prevents clicking**. It makes the element completely ignore all mouse interaction — clicks, hover effects, everything.

Think of it like placing an invisible sheet of glass over the link. You can see it, but you can't touch it.

```
pointerEvents: 'auto'  →  Responds to mouse (default)
pointerEvents: 'none'  →  Completely ignores mouse
```

Together, these three properties make a link that:
1. **Looks** unavailable (faded)
2. **Signals** it's unavailable (🚫 cursor)
3. **Actually is** unavailable (ignores clicks)

**What the user sees after this selector:**

```
┌──────────────────────────────────────────────────┐
│  Home    About    GitHub ↗    Settings            │
│  ════                         (faded, 🚫 cursor)  │
└──────────────────────────────────────────────────┘
```

Settings is visible but clearly out of reach.

---

## The full picture: All three selectors together

Let's see the final result after all three selectors run:

```
Before:
┌──────────────────────────────────────────────────┐
│  Home    About    GitHub    Settings              │
│  (all identical, no visual difference)            │
└──────────────────────────────────────────────────┘

After:
┌──────────────────────────────────────────────────┐
│  Home    About    GitHub ↗    Settings            │
│  ════             (space      (faded, 🚫)         │
│  (blue,           for icon)                       │
│  bold)                                            │
└──────────────────────────────────────────────────┘
```

Each link now communicates its state:
- **Home** → "You are here" (blue + underline)
- **About** → Normal link, nothing special
- **GitHub ↗** → "This leaves the site"
- **Settings** → "Not available right now"

---

## Why this is better than manual styling

**The old way** — adding classes to every link by hand:

```html
<a href="/home" class="current-page">Home</a>
<a href="/about">About</a>
<a href="https://github.com" class="external-link">GitHub</a>
<a href="/settings" class="disabled-link">Settings</a>
```

Problems:
- You have to remember to add the right class every time
- If your navigation is generated dynamically, this gets messy
- Changing a page means updating two things (the link AND the class)

**The Selector.update() way** — target by meaning, not by manual labels:

```javascript
Selector.update({
  'nav a[aria-current="page"]': { /* ... */ },
  'nav a[href^="http"]': { /* ... */ },
  'nav a[aria-disabled="true"]': { /* ... */ }
});
```

The selectors **read the HTML's existing attributes** to decide what to style. You don't need to add extra classes. The meaning is already in the HTML — `Selector.update()` just acts on it.

---

## New symbols you learned in this example

| Symbol | Meaning | Example |
|--------|---------|---------|
| `^=` | Starts with | `[href^="http"]` → href begins with "http" |
| `aria-current` | Marks the current page | `aria-current="page"` |
| `aria-disabled` | Marks a disabled element | `aria-disabled="true"` |
| `data-*` | Custom data attribute | `data-external="true"` |

---

## Quick reference: The CSS `[attribute]` operators

While we're here, here's the full family of attribute operators:

```
[attr="value"]   →  Exactly equals
[attr^="value"]  →  Starts with
[attr$="value"]  →  Ends with
[attr*="value"]  →  Contains anywhere
[attr]           →  Has the attribute (any value)
```

**Examples:**

```javascript
'a[href^="https"]'   // Links starting with https
'a[href$=".pdf"]'    // Links ending in .pdf (PDF downloads)
'a[href*="twitter"]' // Links containing "twitter" anywhere
'input[required]'    // Any input that has the required attribute
```

These are incredibly powerful once you get comfortable with them.

---

## The mental model

Think of these selectors like **smart filters** on a spreadsheet:

You have a column of links. You're filtering by:
- "Show me rows where `aria-current` = `page`"
- "Show me rows where `href` starts with `http`"
- "Show me rows where `aria-disabled` = `true`"

For each filtered group, you apply specific formatting.

The selector is the filter. The update object is the formatting.

---

## The takeaway

This example shows something important about good web development:

> **Style based on meaning, not on appearance.**

Instead of adding a `.blue-underline-link` class and styling that, you target `aria-current="page"]` — because that's what the link *means*, not just what it *looks like*.

Your HTML already carries meaning through its attributes. `Selector.update()` lets you act on that meaning directly — making your code more readable, more maintainable, and more accessible all at once.