[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Collection Bulk Property Methods

## Quick Start (30 seconds)

```javascript
const inputs = queryAll('input');

// Set different placeholders by index
inputs.placeholder({
  0: 'Your name',
  1: 'Your email',
  2: 'Your phone'
});

// Set different styles by index
inputs.style({
  0: { borderColor: 'green' },
  1: { borderColor: 'blue' },
  2: { borderColor: 'red' }
});
```

---

## How Bulk Property Methods Work

Every collection from `queryAll()` gets **19 bulk property methods**. Each method takes an object where **keys are numeric indices** and **values are what to set** on that element:

```javascript
collection.methodName({
  0: valueForFirstElement,
  1: valueForSecondElement,
  2: valueForThirdElement
});
```

All methods are **chainable** — they return the collection so you can call the next method immediately.

---

## Text and Content Methods

### .textContent({ index: value })

```javascript
queryAll('.card-title').textContent({
  0: 'Featured Product',
  1: 'Best Seller',
  2: 'New Arrival'
});
```

### .innerHTML({ index: value })

```javascript
queryAll('.container').innerHTML({
  0: '<strong>Bold content</strong>',
  1: '<em>Italic content</em>'
});
```

### .innerText({ index: value })

```javascript
queryAll('.label').innerText({
  0: 'Label One',
  1: 'Label Two'
});
```

---

## Form Property Methods

### .value({ index: value })

```javascript
queryAll('input[type="text"]').value({
  0: 'John Doe',
  1: 'john@example.com',
  2: '555-0123'
});
```

### .placeholder({ index: value })

```javascript
queryAll('input').placeholder({
  0: 'Enter your name',
  1: 'Enter your email',
  2: 'Enter your phone'
});
```

### .disabled({ index: value })

```javascript
queryAll('.btn').disabled({
  0: false,  // Enable first button
  1: true,   // Disable second button
  2: false   // Enable third button
});
```

### .checked({ index: value })

```javascript
queryAll('input[type="checkbox"]').checked({
  0: true,   // Check first
  1: false,  // Uncheck second
  2: true    // Check third
});
```

### .readonly({ index: value })

```javascript
queryAll('input').readonly({
  0: true,   // Make readonly
  1: false   // Make editable
});
```

### .hidden({ index: value })

```javascript
queryAll('.section').hidden({
  0: false,  // Show
  1: true,   // Hide
  2: false   // Show
});
```

### .selected({ index: value })

```javascript
queryAll('option').selected({
  0: false,
  1: true,   // Select this option
  2: false
});
```

### .title({ index: value })

```javascript
queryAll('.btn').title({
  0: 'Save document',
  1: 'Delete item',
  2: 'Share content'
});
```

---

## Media Property Methods

### .src({ index: value })

```javascript
queryAll('img').src({
  0: 'images/photo1.jpg',
  1: 'images/photo2.jpg',
  2: 'images/photo3.jpg'
});
```

### .href({ index: value })

```javascript
queryAll('a.nav-link').href({
  0: '/home',
  1: '/products',
  2: '/about',
  3: '/contact'
});
```

### .alt({ index: value })

```javascript
queryAll('img').alt({
  0: 'Product front view',
  1: 'Product side view',
  2: 'Product detail'
});
```

---

## Complex Property Methods

### .style({ index: styleObject })

Each value is a CSS style object:

```javascript
queryAll('.box').style({
  0: { backgroundColor: 'red', padding: '20px' },
  1: { backgroundColor: 'blue', padding: '30px' },
  2: { backgroundColor: 'green', padding: '40px' }
});
```

### .dataset({ index: dataObject })

Each value is an object of data-* attributes:

```javascript
queryAll('.item').dataset({
  0: { id: '101', category: 'electronics' },
  1: { id: '102', category: 'clothing' },
  2: { id: '103', category: 'books' }
});
```

### .attrs({ index: attributeObject })

Each value is an object of HTML attributes. Use `null` or `false` to remove an attribute:

```javascript
queryAll('input').attrs({
  0: {
    'aria-label': 'First name',
    'data-id': '1',
    required: true
  },
  1: {
    'aria-label': 'Last name',
    'data-id': '2',
    disabled: null  // Removes the disabled attribute
  }
});
```

### .classes({ index: classConfig })

Two formats — **string** replaces the entire className, **object** uses classList operations:

**String format:**

```javascript
queryAll('.box').classes({
  0: 'card active featured',
  1: 'card standard'
});
```

**Object format:**

```javascript
queryAll('.box').classes({
  0: { add: ['active', 'highlighted'], remove: ['inactive'] },
  1: { toggle: ['visible'] },
  2: { replace: ['old-class', 'new-class'] }
});
```

---

## Chaining Bulk Methods

All methods return the collection, so you can chain them fluently:

```javascript
queryAll('.card')
  .textContent({ 0: 'Featured', 1: 'Standard', 2: 'Basic' })
  .style({
    0: { border: '2px solid gold' },
    1: { border: '1px solid gray' },
    2: { border: '1px solid gray' }
  })
  .classes({
    0: { add: ['featured'] }
  })
  .dataset({
    0: { tier: 'premium' },
    1: { tier: 'standard' },
    2: { tier: 'basic' }
  });
```

---

## Real-World Examples

### Form Setup

```javascript
queryAll('#registrationForm input')
  .placeholder({
    0: 'Full name',
    1: 'Email address',
    2: 'Password',
    3: 'Confirm password'
  })
  .attrs({
    0: { 'aria-label': 'Full name', required: true },
    1: { 'aria-label': 'Email', required: true, type: 'email' },
    2: { 'aria-label': 'Password', required: true, type: 'password' },
    3: { 'aria-label': 'Confirm password', required: true, type: 'password' }
  });
```

### Image Gallery

```javascript
queryAll('img.gallery')
  .src({
    0: 'photos/landscape.jpg',
    1: 'photos/portrait.jpg',
    2: 'photos/abstract.jpg'
  })
  .alt({
    0: 'Mountain landscape',
    1: 'Portrait photo',
    2: 'Abstract art'
  })
  .style({
    0: { border: '3px solid gold' },
    1: { border: '1px solid gray' },
    2: { border: '1px solid gray' }
  });
```

### Button Group

```javascript
queryAll('.action-btn')
  .textContent({ 0: 'Save', 1: 'Cancel', 2: 'Delete' })
  .title({ 0: 'Save changes', 1: 'Discard changes', 2: 'Delete item' })
  .style({
    0: { backgroundColor: '#28a745', color: 'white' },
    1: { backgroundColor: '#6c757d', color: 'white' },
    2: { backgroundColor: '#dc3545', color: 'white' }
  })
  .disabled({ 2: true });
```

---

## Empty Collections

Empty collections handle all methods gracefully — methods do nothing and return the collection for chaining:

```javascript
queryAll('.nonexistent')
  .textContent({ 0: 'Hello' })
  .style({ 0: { color: 'red' } })
  .classes({ 0: { add: ['active'] } });
// No errors — all no-ops that return safely
```

---

## Complete Bulk Methods Reference

| Method | Value Type | What It Sets |
|--------|-----------|-------------|
| `.textContent({...})` | String | `element.textContent` |
| `.innerHTML({...})` | String | `element.innerHTML` |
| `.innerText({...})` | String | `element.innerText` |
| `.value({...})` | String | `element.value` |
| `.placeholder({...})` | String | `element.placeholder` |
| `.title({...})` | String | `element.title` |
| `.disabled({...})` | Boolean | `element.disabled` |
| `.checked({...})` | Boolean | `element.checked` |
| `.readonly({...})` | Boolean | `element.readOnly` |
| `.hidden({...})` | Boolean | `element.hidden` |
| `.selected({...})` | Boolean | `element.selected` |
| `.src({...})` | String | `element.src` |
| `.href({...})` | String | `element.href` |
| `.alt({...})` | String | `element.alt` |
| `.style({...})` | Object | `element.style` properties |
| `.dataset({...})` | Object | `element.dataset` properties |
| `.attrs({...})` | Object | HTML attributes (null/false removes) |
| `.classes({...})` | String or Object | `className` or classList operations |
| `.prop(name, {...})` | Any | Any property, including nested paths |

> **Simple Rule to Remember:** Every bulk method takes `{ index: value }` objects — the key is the element position, the value is what to set. All 19 methods are chainable. Use simple property methods for one property at a time, or `.update()` for multiple properties on the same element.