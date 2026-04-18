[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Collection Helper Methods — addClass, setStyle, on, and More

## Quick Start (30 seconds)

```javascript
// Chainable helper methods on collections
queryAll('.btn')
  .addClass('primary')
  .setStyle({ padding: '10px', borderRadius: '4px' })
  .on('click', handleClick);
```

---

## What Are Helper Methods?

Enhanced collections from `queryAll()` include **shorthand helper methods** that apply operations to **every element** in the collection. They're designed for common tasks and are all **chainable** — each one returns the collection, so you can call the next method immediately.

---

## Class Manipulation

### .addClass(className)

Adds a class to every element:

```javascript
queryAll('.card').addClass('shadow');
// Every .card now has class "shadow"
```

### .removeClass(className)

Removes a class from every element:

```javascript
queryAll('.card').removeClass('loading');
// "loading" removed from every .card
```

### .toggleClass(className)

Toggles a class on every element — adds it if missing, removes it if present:

```javascript
queryAll('.panel').toggleClass('collapsed');
// Expanded panels collapse, collapsed panels expand
```

### Chaining Class Methods

```javascript
queryAll('.item')
  .addClass('visible')
  .removeClass('hidden')
  .toggleClass('animated');
```

---

## Property and Attribute Setting

### .setProperty(property, value)

Sets a JavaScript property on every element:

```javascript
// Disable all buttons
queryAll('.btn').setProperty('disabled', true);

// Set all textareas to readonly
queryAll('textarea').setProperty('readOnly', true);

// Clear all input values
queryAll('input').setProperty('value', '');
```

### .setAttribute(attribute, value)

Sets an HTML attribute on every element:

```javascript
// Add loading="lazy" to all images
queryAll('img').setAttribute('loading', 'lazy');

// Add aria labels
queryAll('.icon-btn').setAttribute('aria-label', 'Action button');

// Add data attributes
queryAll('.card').setAttribute('data-visible', 'true');
```

---

## Style Setting

### .setStyle(styles)

Applies an object of CSS styles to every element:

```javascript
queryAll('.card').setStyle({
  padding: '16px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
});
```

```javascript
// Highlight all active items
queryAll('.item.active').setStyle({
  backgroundColor: '#e3f2fd',
  fontWeight: 'bold'
});
```

---

## Event Handling

### .on(event, handler)

Adds an event listener to every element:

```javascript
// Add click handler to all buttons
queryAll('.btn').on('click', (e) => {
  console.log('Clicked:', e.target.textContent);
});

// Add hover effect
queryAll('.card').on('mouseenter', (e) => {
  e.target.style.transform = 'scale(1.02)';
});

queryAll('.card').on('mouseleave', (e) => {
  e.target.style.transform = 'scale(1)';
});
```

### .off(event, handler)

Removes an event listener from every element. You must pass the **same function reference** that was used with `.on()`:

```javascript
function handleClick(e) {
  console.log('Clicked');
}

// Add listeners
queryAll('.btn').on('click', handleClick);

// Later, remove them
queryAll('.btn').off('click', handleClick);
```

---

## Chaining Everything Together

All helper methods return the collection, so you can chain as many as you need:

```javascript
queryAll('.action-btn')
  .addClass('btn-primary')
  .removeClass('btn-default')
  .setStyle({ padding: '8px 16px', fontSize: '14px' })
  .setAttribute('role', 'button')
  .setProperty('disabled', false)
  .on('click', handleAction);
```

---

## Real-World Examples

### Example 1: Initialize a Form

```javascript
// Set up all form inputs at once
queryAll('#signup input')
  .addClass('form-control')
  .setAttribute('autocomplete', 'off')
  .setStyle({ marginBottom: '12px' })
  .on('focus', (e) => e.target.classList.add('focused'))
  .on('blur', (e) => e.target.classList.remove('focused'));
```

### Example 2: Gallery Setup

```javascript
queryAll('.gallery img')
  .addClass('gallery-item')
  .setAttribute('loading', 'lazy')
  .setStyle({ cursor: 'pointer', borderRadius: '4px' })
  .on('click', (e) => {
    openLightbox(e.target.src);
  });
```

### Example 3: Disable a Section

```javascript
function disableSection(sectionSelector) {
  queryAllWithin(sectionSelector, 'input, button, select')
    .setProperty('disabled', true)
    .addClass('disabled');
}

function enableSection(sectionSelector) {
  queryAllWithin(sectionSelector, 'input, button, select')
    .setProperty('disabled', false)
    .removeClass('disabled');
}
```

### Example 4: Notification Cleanup

```javascript
// Remove all notifications after 3 seconds
setTimeout(() => {
  queryAll('.notification')
    .addClass('fade-out')
    .on('animationend', (e) => {
      e.target.remove();
    });
}, 3000);
```

---

## Helper Methods vs .update()

Both can achieve similar results. Choose based on what reads better for your situation:

```javascript
// Helper methods — chainable, familiar syntax
queryAll('.btn')
  .addClass('primary')
  .setStyle({ padding: '10px' })
  .setProperty('disabled', false);

// .update() — all in one call
queryAll('.btn').update({
  classList: { add: ['primary'] },
  style: { padding: '10px' },
  disabled: false
});
```

| Use | When |
|-----|------|
| Helper methods | Simple, single operations; chaining multiple different operations |
| `.update()` | Complex multi-property updates on each element |

---

## Complete Helper Methods Reference

| Method | What It Does | Chainable |
|--------|-------------|-----------|
| `.addClass(name)` | Adds a class to all elements | ✅ |
| `.removeClass(name)` | Removes a class from all elements | ✅ |
| `.toggleClass(name)` | Toggles a class on all elements | ✅ |
| `.setProperty(prop, value)` | Sets a JS property on all elements | ✅ |
| `.setAttribute(attr, value)` | Sets an HTML attribute on all elements | ✅ |
| `.setStyle(styles)` | Applies style object to all elements | ✅ |
| `.on(event, handler)` | Adds event listener to all elements | ✅ |
| `.off(event, handler)` | Removes event listener from all elements | ✅ |

---

## Summary

| Category | Methods |
|----------|---------|
| **Classes** | `.addClass()`, `.removeClass()`, `.toggleClass()` |
| **Properties** | `.setProperty()` |
| **Attributes** | `.setAttribute()` |
| **Styles** | `.setStyle()` |
| **Events** | `.on()`, `.off()` |

> **Simple Rule to Remember:** Helper methods apply one operation to every element in the collection and return the collection for chaining. Use them for quick, single-purpose operations. Use `.update()` when you need to set multiple properties at once on each element.