[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# `createElement` with Config Object — Method 13

## Quick Start (30 seconds)

```javascript
// Create a fully configured element in one line
const button = createElement('button', {
  textContent: 'Click Me',
  classList: { add: ['btn', 'btn-primary'] },
  style: { padding: '10px 20px', background: '#007bff', color: 'white' },
  addEventListener: ['click', () => alert('Clicked!')]
});

document.body.appendChild(button);
```

One function call. One element. Fully configured.

---

## What is Method 13?

Method 13 is `createElement()` called with two parameters: the tag name and a configuration object.

```javascript
createElement(tagName, configObject)
```

This is the most compact way to create a single, fully configured element in Dom Helpers. It reads like a description of what you want — and you get back a real DOM element, ready to use.

---

## Syntax

```javascript
// Basic syntax
const element = createElement('tagName', {
  // configuration properties
});

// Examples
const div = createElement('div', {
  className: 'container',
  textContent: 'Hello!'
});

const button = createElement('button', {
  textContent: 'Submit',
  style: { background: 'blue', color: 'white' }
});

const img = createElement('img', {
  setAttribute: { src: 'photo.jpg', alt: 'A photo' }
});
```

---

## Why Does This Exist?

### When a Single Element is Your Goal

`createElement.bulk()` is designed for creating multiple elements at once. It is powerful — but when you only need one element, creating a bulk group with just one entry adds a small amount of ceremony.

Method 13 is especially useful when:
- You need exactly one element
- You want to configure it fully at creation time
- You want the element reference directly — not wrapped in a result object

```javascript
// With createElement.bulk() — creates a result object first
const result = createElement.bulk({
  BUTTON: {
    textContent: 'Click',
    style: { background: 'green' }
  }
});
const button = result.BUTTON;  // Extra step to get the element

// With Method 13 — element is returned directly
const button = createElement('button', {
  textContent: 'Click',
  style: { background: 'green' }
});
// button is the element — no extra step needed
```

This method is especially useful when:
✅ You need exactly one element and want a direct reference
✅ You are creating elements inside a function or loop
✅ You want inline element creation without managing a result object
✅ You are migrating from plain `document.createElement()` and want minimal change

**The Choice is Yours:**
- Use `createElement.bulk()` when creating multiple elements together
- Use Method 13 (`createElement(tag, config)`) when creating a single element directly
- Both approaches produce the same real DOM elements and can be combined freely

---

## Mental Model: Ordering from a Menu

Think of Method 13 like ordering a meal from a restaurant with all your customizations at once.

Instead of saying:
1. "I'd like a burger"
2. "Add cheese"
3. "Add lettuce"
4. "No onions"
5. "Toasted bun"

You say one thing:
- "I'd like a cheeseburger with lettuce, no onions, toasted bun"

Method 13 lets you say everything about your element in one expression.

---

## How Does It Work?

When you call `createElement('div', { textContent: 'Hello' })`, Dom Helpers:

```
1️⃣  Detects that a second parameter was provided

2️⃣  Checks if it's a config object (has properties like textContent, style, etc.)
    OR native options (has `is` property for custom elements)

3️⃣  If it's a config object:
    → Calls document.createElement('div') internally
    → Enhances the new element with .update()
    → Calls element.update(configObject) to apply all properties
    → Returns the fully configured, enhanced element

4️⃣  If it's native options (e.g., { is: 'my-element' }):
    → Passes options directly to document.createElement()
    → Normal browser behavior — no config applied
```

This gives you the best of both worlds: when you pass a config object, you get Dom Helpers behavior. When you pass native browser options, you get standard browser behavior. The two modes are automatically detected.

---

## Basic Usage

### Simple Text Element

```javascript
const heading = createElement('h1', {
  textContent: 'Welcome to My App',
  style: {
    color: '#333',
    fontSize: '2rem',
    textAlign: 'center'
  }
});

document.body.appendChild(heading);
```

---

### Element with Classes

```javascript
const card = createElement('div', {
  className: 'card',
  classList: { add: ['featured', 'card--large'] },
  style: {
    padding: '20px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  }
});
```

---

### Element with Event Listeners

```javascript
const button = createElement('button', {
  textContent: 'Load More',
  classList: { add: ['btn'] },
  addEventListener: ['click', (e) => {
    console.log('Load more clicked');
    e.target.update({
      textContent: 'Loading...',
      disabled: true
    });
  }]
});

document.body.appendChild(button);
```

---

### Multiple Events on One Element

```javascript
const input = createElement('input', {
  type: 'text',
  placeholder: 'Type something...',
  style: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px' },
  addEventListener: {
    focus: (e) => e.target.update({
      style: { borderColor: '#007bff' }
    }),
    blur: (e) => e.target.update({
      style: { borderColor: '#ccc' }
    }),
    input: (e) => console.log('Value:', e.target.value)
  }
});

document.body.appendChild(input);
```

When you pass an **object** as the value of `addEventListener` (instead of an array), you can register multiple events at once. Each key is an event type, and each value is the handler function.

---

### Element with Dataset

```javascript
const listItem = createElement('li', {
  textContent: 'Premium Plan',
  dataset: {
    planId: 'premium',
    price: '29.99',
    currency: 'USD'
  },
  classList: { add: ['plan-item', 'plan-item--premium'] }
});

// Result: <li class="plan-item plan-item--premium"
//              data-plan-id="premium" data-price="29.99" data-currency="USD">
//           Premium Plan
//         </li>
```

---

### Image Element with Attributes

```javascript
const avatar = createElement('img', {
  setAttribute: {
    src: 'user-avatar.jpg',
    alt: 'User Avatar',
    width: '80',
    height: '80',
    loading: 'lazy'
  },
  style: {
    borderRadius: '50%',
    border: '2px solid white'
  }
});
```

---

### Input with All Common Properties

```javascript
const emailInput = createElement('input', {
  type: 'email',
  id: 'emailInput',
  name: 'email',
  placeholder: 'Enter your email',
  required: true,
  className: 'form-input',
  style: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  }
});
```

---

## Using `.update()` After Creation

Every element created with Method 13 is enhanced — it has `.update()` available after creation too:

```javascript
const notification = createElement('div', {
  textContent: 'Connecting...',
  classList: { add: ['notification'] },
  style: { background: '#ffc107', color: '#333', padding: '10px' }
});

document.body.appendChild(notification);

// Later, update its state
setTimeout(() => {
  notification.update({
    textContent: 'Connected!',
    style: { background: '#28a745', color: 'white' }
  });
}, 2000);
```

---

## Real-World Example: Creating a Toast Notification

```javascript
function showToast(message, type = 'info') {
  const colors = {
    info:    { bg: '#007bff', color: 'white' },
    success: { bg: '#28a745', color: 'white' },
    warning: { bg: '#ffc107', color: '#333' },
    error:   { bg: '#dc3545', color: 'white' }
  };

  const { bg, color } = colors[type] || colors.info;

  const toast = createElement('div', {
    textContent: message,
    className: 'toast',
    style: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '12px 24px',
      background: bg,
      color: color,
      borderRadius: '6px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      zIndex: '1000',
      fontSize: '14px',
      fontWeight: '500'
    }
  });

  document.body.appendChild(toast);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.update({ style: { opacity: '0', transition: 'opacity 0.3s' } });
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Usage
showToast('File saved successfully', 'success');
showToast('Network error occurred', 'error');
showToast('Please fill in all fields', 'warning');
```

---

## Real-World Example: Building a Component with Multiple Single Elements

Method 13 works beautifully inside functions that build components element by element:

```javascript
function createUserCard(user) {
  // Create each element individually using Method 13
  const card = createElement('article', {
    className: 'user-card',
    dataset: { userId: user.id }
  });

  const avatar = createElement('img', {
    setAttribute: { src: user.avatar, alt: user.name },
    style: { width: '80px', height: '80px', borderRadius: '50%' }
  });

  const name = createElement('h3', {
    textContent: user.name,
    style: { margin: '10px 0 4px' }
  });

  const email = createElement('p', {
    textContent: user.email,
    style: { color: '#666', fontSize: '14px', margin: '0' }
  });

  const editButton = createElement('button', {
    textContent: 'Edit',
    classList: { add: ['btn', 'btn-sm'] },
    addEventListener: ['click', () => editUser(user.id)]
  });

  // Assemble the card
  card.append(avatar, name, email, editButton);

  return card;
}

// Use the function
const userCard = createUserCard({
  id: '123',
  name: 'Jane Smith',
  email: 'jane@example.com',
  avatar: 'jane.jpg'
});

Elements.userList.appendChild(userCard);
```

---

## Comparison: Method 13 vs Plain JavaScript

```javascript
// Plain JavaScript — 10 lines for one button
const button = document.createElement('button');
button.textContent = 'Subscribe';
button.className = 'btn btn-primary';
button.style.padding = '12px 24px';
button.style.background = '#007bff';
button.style.color = 'white';
button.style.border = 'none';
button.style.borderRadius = '6px';
button.style.cursor = 'pointer';
button.addEventListener('click', handleSubscribe);

// Method 13 — the same button, expressed as one clear unit
const button = createElement('button', {
  textContent: 'Subscribe',
  classList: { add: ['btn', 'btn-primary'] },
  style: {
    padding: '12px 24px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  addEventListener: ['click', handleSubscribe]
});
```

**Result:** same element, same behavior. The Method 13 version expresses the button's complete description in one object rather than in 10 scattered statements.

---

## Key Takeaways

| Question | Answer |
|----------|--------|
| What does it return? | The real DOM element — ready to use |
| Does it need enabling? | No — `createElement` is always available |
| Can I use `.update()` after? | Yes — the element is always enhanced |
| Does it work with events? | Yes — pass `addEventListener` in the config |
| Can I pass multiple events? | Yes — use an object format for `addEventListener` |
| Is it the same as `document.createElement`? | The result is identical — just configured |

---

## What's Next?

- **[05 — Bulk: Single Element](./05_bulk-single-element.md)** — `createElement.bulk()` for a single configured element
- **[06 — Bulk: Multiple Elements](./06_bulk-multiple-elements.md)** — The real power: creating many elements at once