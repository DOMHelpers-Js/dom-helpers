[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Understanding Complex Selectors: Form Field States

## The scenario

You have a signup form with several input fields:

```html
<form>
  <input type="text" required placeholder="Full name">
  <input type="email" required placeholder="Email address">
  <input type="text" value="john_doe" placeholder="Username">
  <input type="text" disabled placeholder="Account ID (auto-generated)">
</form>
```

Right now, every field looks exactly the same — a plain white box with a gray border. But each field is in a completely different **state**:

- One is **empty and required** (the user must fill it in)
- One has **valid content** (correctly filled)
- One is **disabled** (the user can't interact with it)
- One is **focused** (the user is currently typing in it)

A good form **communicates these states visually**. Without that feedback, the user has no idea what's wrong, what's right, or what they can even interact with.

```
Before — all fields look identical:
┌─────────────────────┐
│ Full name           │  ← Looks fine... but it's empty and required
├─────────────────────┤
│ Email address       │  ← Looks fine... but the email is invalid
├─────────────────────┤
│ john_doe            │  ← Looks fine... and it actually is valid
├─────────────────────┤
│ Account ID          │  ← Looks fine... but you can't click it
└─────────────────────┘
```

This code fixes all of that — in one call.

---

## The full code

```javascript
Selector.update({
  'input[required]:invalid': {
    style: { borderColor: '#ef4444' }
  },
  'input:valid': {
    style: { borderColor: '#10b981' }
  },
  'input:disabled': {
    style: {
      backgroundColor: '#f3f4f6',
      cursor: 'not-allowed'
    }
  },
  'input:focus': {
    style: {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    }
  }
});
```

Four selectors. Four states. Let's go through each one.

---

## A new concept: State selectors (pseudo-classes)

Before we dive in, there's something important to understand.

All four selectors in this example end with something starting with `:` — like `:invalid`, `:valid`, `:disabled`, `:focus`.

These are called **pseudo-classes** — but don't let the name scare you. They simply describe the **current state or condition** of an element.

Think of it like describing a person:
- A person **who is sleeping** → `person:sleeping`
- A person **who is working** → `person:working`
- A person **who is tired** → `person:tired`

The person is the same, but their state changes. CSS pseudo-classes work exactly the same way for HTML elements. The element is the same input field — but its state changes based on what's happening.

---

## Selector 1: `input[required]:invalid`

```javascript
'input[required]:invalid': {
  style: { borderColor: '#ef4444' }
}
```

### Breaking it apart

```
input   [required]   :invalid
  │          │           │
  │          │           └── "that is currently in an invalid state"
  │          └───────────── "that has the required attribute"
  └──────────────────────── "find input elements..."
```

This selector is a **combination** — two conditions that must both be true at the same time.

Think of it as: *"Find inputs that are REQUIRED and also INVALID."*

### What does `[required]` mean?

You already know `[attribute="value"]` from the previous example. But notice something here — there's no `="value"` part. Just `[required]` on its own.

This means: *"Has the `required` attribute — any value, or even no value at all."*

```html
<input required>                    ← ✅ has [required]
<input required="required">         ← ✅ has [required]
<input type="text" placeholder="x"> ← ❌ no [required]
```

In HTML, some attributes just need to exist to do their job. `required` is one of them — its presence alone means "this field must be filled in."

### What does `:invalid` mean?

`:invalid` is a **state** the browser assigns automatically.

The browser constantly watches your inputs and decides:
- Is this field filled in correctly? → `:valid`
- Is this field empty when it shouldn't be, or filled in wrongly? → `:invalid`

This happens automatically. You don't set it — the browser does.

```
Empty required field    → :invalid  (it should have content)
Wrong email format      → :invalid  (email must have @ and .)
Correctly filled field  → :valid    (all good!)
```

### Combining them: `input[required]:invalid`

This selector is smart — it only targets fields that are **both** required **and** invalid. A field that isn't required can be empty without being "wrong." This selector ignores those.

```
<input required value="">     ← ✅ TARGETED (required + empty = invalid)
<input required value="hi">   ← ❌ NOT targeted (required + filled = valid)
<input value="">              ← ❌ NOT targeted (not required, so being empty is fine)
```

### What does `borderColor: '#ef4444'` do?

`borderColor` changes the colour of the **border** — the thin line around the edge of the input field.

`#ef4444` is a strong, clear red. The colour of warning and error. 

**What the user sees:**

```
┌─────────────────────┐
│ Full name           │  ← Red border (empty + required = error!)
└─────────────────────┘
```

The red border says: *"Something is wrong here. Please fill this in."*

---

## Selector 2: `input:valid`

```javascript
'input:valid': {
  style: { borderColor: '#10b981' }
}
```

### Breaking it apart

```
input   :valid
  │       │
  │       └── "that is currently in a valid state"
  └────────── "find input elements..."
```

### What does `:valid` mean?

The opposite of `:invalid`. The browser assigns this state when a field is filled in correctly.

- An email input with `user@example.com` → `:valid`
- A required field with content → `:valid`
- An optional field (empty is fine) → `:valid`

### What does `borderColor: '#10b981'` do?

`#10b981` is a fresh, confident green — the colour of success and confirmation.

**What the user sees:**

```
┌─────────────────────┐
│ john_doe            │  ← Green border (filled correctly = success!)
└─────────────────────┘
```

The green border says: *"This looks good. Keep going."*

---

## Selector 3: `input:disabled`

```javascript
'input:disabled': {
  style: {
    backgroundColor: '#f3f4f6',
    cursor: 'not-allowed'
  }
}
```

### Breaking it apart

```
input   :disabled
  │         │
  │         └── "that is currently disabled"
  └──────────── "find input elements..."
```

### What does `:disabled` mean?

A disabled input exists on the page but **cannot be interacted with**. The user cannot click it, type in it, or change it in any way.

```html
<input type="text" disabled placeholder="Account ID">
```

The `disabled` attribute on the HTML element is what triggers the `:disabled` state.

### What does `backgroundColor: '#f3f4f6'` do?

While `borderColor` changes the line *around* an input, `backgroundColor` fills the **inside** of the input with a colour.

`#f3f4f6` is a soft, cool light gray — noticeably different from white but not harsh. This is the universal visual language for "unavailable."

Think of a greyed-out button in any app you've ever used. That grey says: *"I exist, but I'm not yours to use right now."*

### What does `cursor: 'not-allowed'` do?

You already learned this from the previous example! It changes the mouse cursor to a 🚫 symbol when the user hovers over the element.

Together, these two properties deliver a clear message:

| Property | What it says |
|----------|-------------|
| `backgroundColor: '#f3f4f6'` | "I look unavailable" |
| `cursor: 'not-allowed'` | "You can't click me" |

**What the user sees:**

```
┌─────────────────────┐
│ Account ID          │  ← Gray fill + 🚫 cursor on hover
└─────────────────────┘
```

---

## Selector 4: `input:focus`

```javascript
'input:focus': {
  style: {
    outline: 'none',
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  }
}
```

This is the most interesting one. Three style properties working together to create a "glow" effect.

### What does `:focus` mean?

`:focus` describes the state of an element that is **currently active** — the one the user is typing into right now.

When you click on an input or tab into it, it becomes "focused." Only one element on the page can be focused at a time.

Think of a spotlight on a stage. The actor in the spotlight is "focused." When another actor steps into the light, the first one loses focus.

### Property 1: `outline: 'none'`

By default, browsers add their own focus indicator — usually a blue or orange glowing outline. It's helpful but can look inconsistent across different browsers.

Setting `outline: 'none'` **removes** the browser's default style so you can replace it with your own custom look.

**Important:** Removing the outline without replacing it is bad for accessibility — users who navigate by keyboard need to see which element is focused. The next two properties are what replace it.

### Property 2: `borderColor: '#3b82f6'`

Same blue as the current page link from the previous example — `#3b82f6`. Changes the border of the focused field to bright blue.

This tells the user: *"You're here. This is the active field."*

### Property 3: `boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'`

This is the most complex value in the whole guide. Let's break it down carefully.

`boxShadow` creates a **shadow around an element**. But here it's being used as a subtle glow, not a shadow.

```
boxShadow: '0    0    0    3px   rgba(59, 130, 246, 0.1)'
            │    │    │     │              │
            │    │    │     │              └── The colour of the glow
            │    │    │     └──────────────── How thick the glow is
            │    │    └────────────────────── How blurry (0 = sharp edge)
            │    └─────────────────────────── Vertical position (0 = centered)
            └──────────────────────────────── Horizontal position (0 = centered)
```

**In plain English:** *"Draw a sharp, 3-pixel ring around this element in a very light transparent blue."*

#### What is `rgba`?

`rgba` is another way to write a colour — similar to hex codes like `#3b82f6`, but with an extra option: **transparency**.

```
rgba(  59,   130,   246,   0.1  )
       │       │      │      │
       │       │      │      └── Opacity: 0 = invisible, 1 = fully visible
       │       │      └───────── Blue amount (0–255)
       │       └──────────────── Green amount (0–255)
       └──────────────────────── Red amount (0–255)
```

`rgba(59, 130, 246, 0.1)` is the same blue as `#3b82f6`, but at only 10% opacity — almost transparent. This creates a soft halo effect rather than a harsh ring.

**The visual effect of all three properties together:**

```
Before focus:                 After focus:
┌─────────────────────┐      ╔═════════════════════╗
│ Email address       │      ║ Email address       ║  ← Blue border
└─────────────────────┘      ╚═════════════════════╝
                               ~~~~~~~~~~~~~~~~~~~~~~~~  ← Soft blue glow ring
```

The field appears to "light up" — the active field is unmistakable.

---

## The full picture: All four states at once

Let's look at a form with all states visible simultaneously:

```
After Selector.update() runs:

┌─────────────────────┐
│ Full name           │  ← 🔴 Red border  (empty + required = error)
└─────────────────────┘

╔═════════════════════╗
║ Email address  |    ║  ← 🔵 Blue border + glow (currently focused)
╚═════════════════════╝
  ~~~~~~~~~~~~~~~~~~~~

┌─────────────────────┐
│ john_doe            │  ← 🟢 Green border (valid content)
└─────────────────────┘

░░░░░░░░░░░░░░░░░░░░░░
░ Account ID          ░  ← ⬜ Gray fill + 🚫 cursor (disabled)
░░░░░░░░░░░░░░░░░░░░░░
```

**At a glance, the user knows everything:**
- The name field needs attention (red)
- The email field is where they're typing (blue glow)
- The username is correct (green)
- Account ID is managed by the system (gray)

No instructions needed. The form speaks for itself.

---

## How the browser assigns these states automatically

Here's something remarkable about this approach: **you didn't have to write any logic to detect these states.**

You didn't write:
```javascript
if (field.value === '') {
  field.style.borderColor = 'red';
}
```

The browser already knows these states. It tracks them constantly. The selectors simply **read** what the browser already knows and apply styles accordingly.

```
The browser tracks:              Your selector reads it:
field is empty + required   →    :invalid
field is filled correctly   →    :valid
field has disabled attr     →    :disabled
field is being typed into   →    :focus
```

You're not telling the browser what state things are in. You're asking it to act on the states it already knows.

---

## Why this matters for real users

**Users don't read documentation.** They figure out how your form works by looking at it. Every colour, cursor shape, and border tells a story.

- Red border: *"Fix this before you continue."*
- Green border: *"This is correct. Move on."*
- Gray fill: *"Don't bother trying to change this."*
- Blue glow: *"This is where your keyboard is."*

These are instincts people already have from decades of using software. Your form should speak that language.

---

## New concepts learned in this example

| Concept | What it means |
|---------|---------------|
| `:invalid` | Browser-assigned state: field fails validation |
| `:valid` | Browser-assigned state: field passes validation |
| `:disabled` | Browser-assigned state: field cannot be interacted with |
| `:focus` | Browser-assigned state: field is currently active |
| `[required]` | Attribute exists (no value needed) |
| `backgroundColor` | Fills the inside of an element with colour |
| `outline: 'none'` | Removes the browser's default focus ring |
| `boxShadow` | Adds a shadow or glow effect around an element |
| `rgba(r, g, b, a)` | Colour with adjustable transparency |

---

## The cheat sheet: Common state selectors

```
:focus      →  Currently active / being typed into
:hover      →  Mouse is over the element
:valid      →  Passes HTML validation rules
:invalid    →  Fails HTML validation rules
:disabled   →  Cannot be interacted with
:checked    →  Checkbox or radio is selected
:empty      →  Contains no content
:required   →  Has the required attribute
```

These work on more than just inputs. `:hover` works on any element. `:checked` works on checkboxes. `:empty` works on any container. Once you know these, you'll find uses for them everywhere.

---

## The takeaway

This example teaches a deeper principle:

> **The browser already knows the state of your elements. You just have to listen.**

Instead of writing JavaScript to detect errors, manage focus, or track disabled fields — you can use selectors to directly respond to the states the browser is already tracking.

Your code becomes shorter. Your logic becomes simpler. And your form becomes smarter, more accessible, and more intuitive — all at once.