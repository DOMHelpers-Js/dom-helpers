[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Template-Based Creation — Method 11

## Quick Start (30 seconds)

```javascript
// Define the template once — a plain object
const primaryButtonTemplate = {
  BUTTON: {
    classList: { add: ['btn', 'btn-primary'] },
    style: {
      padding: '10px 20px',
      background: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    }
  }
};

// Use it multiple times — customize with the spread operator
const saveBtn = createElement.bulk({
  ...primaryButtonTemplate,
  BUTTON: { ...primaryButtonTemplate.BUTTON, textContent: 'Save' }
});

const cancelBtn = createElement.bulk({
  ...primaryButtonTemplate,
  BUTTON: { ...primaryButtonTemplate.BUTTON, textContent: 'Cancel', style: { ...primaryButtonTemplate.BUTTON.style, background: '#6c757d' } }
});

Elements.toolbar.append(saveBtn.BUTTON, cancelBtn.BUTTON);
```

---

## What is Method 11?

Method 11 is the **template-based approach** to element creation.

Simply put: you store a configuration object in a variable, and then pass that variable (or a variation of it) to `createElement.bulk()` whenever you need to create elements with that configuration.

The configuration object becomes your **template**. You define the structure and defaults once, and reuse them across your codebase.

---

## Why Does This Exist?

### The Problem: Configuration Duplication

Without templates, every time you create a similar element, you repeat its configuration:

```javascript
// First submit button
const btn1 = createElement.bulk({
  BUTTON: {
    type: 'submit',
    textContent: 'Submit Form',
    classList: { add: ['btn', 'btn-primary'] },
    style: {
      padding: '12px 24px',
      background: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px'
    }
  }
});

// Second submit button — same structure, duplicated
const btn2 = createElement.bulk({
  BUTTON: {
    type: 'submit',
    textContent: 'Create Account',
    classList: { add: ['btn', 'btn-primary'] },
    style: {
      padding: '12px 24px',
      background: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px'
    }
  }
});
```

If the design changes — say the button padding should be `14px 28px` — you have to find and update every duplicate.

### The Solution: Extract Configuration as a Template

```javascript
// Define the template once
const submitButtonConfig = {
  type: 'submit',
  classList: { add: ['btn', 'btn-primary'] },
  style: {
    padding: '12px 24px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

// Use it anywhere — customize only what changes
const btn1 = createElement.bulk({
  BUTTON: { ...submitButtonConfig, textContent: 'Submit Form' }
});

const btn2 = createElement.bulk({
  BUTTON: { ...submitButtonConfig, textContent: 'Create Account' }
});
```

When the design changes, update `submitButtonConfig` once. Every button created from that template updates automatically.

**This method is especially useful when:**
✅ You need consistent styling across many similar elements
✅ Design tokens or theme variables need to be centralized
✅ Configuration is complex and you want to avoid duplicating it
✅ You want to share element definitions across different components

---

## Mental Model: A Form Template (Like a Printed Form)

Think of configuration templates like printed forms.

A printed form has a fixed layout — boxes for name, address, phone number, signature. Each time someone fills in the form, the layout is identical but the specific information is different.

A configuration template works the same way. The template defines the layout (classes, styles, structure). Each use of the template fills in the specific information (text content, event listeners, unique IDs).

```
Template (blank form):
{
  BUTTON: {
    classList: { add: ['btn', 'btn-primary'] },
    style: { padding: '12px 24px', background: '#007bff', ... }
  }
}

Instance (filled form):
{ ...template, BUTTON: { ...template.BUTTON, textContent: 'Save Changes' } }
```

---

## Syntax Patterns

### Simple Template Reuse

```javascript
// Define
const buttonTemplate = {
  BUTTON: {
    classList: { add: ['btn'] },
    style: { padding: '10px 20px', cursor: 'pointer' }
  }
};

// Reuse directly
const result = createElement.bulk(buttonTemplate);
result.BUTTON.textContent = 'Click Me';
```

---

### Template with Spread Override

The JavaScript **spread operator** (`...`) lets you override specific properties while keeping the rest of the template:

```javascript
const baseStyle = {
  padding: '10px 20px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '600'
};

// Create variants by spreading and overriding
const primaryBtn = createElement.bulk({
  BUTTON: {
    textContent: 'Primary Action',
    style: { ...baseStyle, background: '#007bff', color: 'white' }
  }
});

const successBtn = createElement.bulk({
  BUTTON: {
    textContent: 'Confirm',
    style: { ...baseStyle, background: '#28a745', color: 'white' }
  }
});

const dangerBtn = createElement.bulk({
  BUTTON: {
    textContent: 'Delete',
    style: { ...baseStyle, background: '#dc3545', color: 'white' }
  }
});
```

---

### Parameterized Templates (Template + Function)

For more flexibility, combine templates with a function that customizes them:

```javascript
// Base template
function makeButtonConfig(label, variant = 'primary') {
  const colors = {
    primary:  { background: '#007bff', color: 'white' },
    success:  { background: '#28a745', color: 'white' },
    danger:   { background: '#dc3545', color: 'white' },
    outlined: { background: 'transparent', color: '#007bff', border: '2px solid #007bff' }
  };

  return {
    BUTTON: {
      textContent: label,
      classList: { add: ['btn', `btn-${variant}`] },
      style: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
        ...colors[variant]
      }
    }
  };
}

// Use the template function
const saveBtn     = createElement.bulk(makeButtonConfig('Save', 'primary'));
const deleteBtn   = createElement.bulk(makeButtonConfig('Delete', 'danger'));
const confirmBtn  = createElement.bulk(makeButtonConfig('Confirm', 'success'));
const cancelBtn   = createElement.bulk(makeButtonConfig('Cancel', 'outlined'));

Elements.actionBar.append(saveBtn.BUTTON, cancelBtn.BUTTON);
Elements.dangerZone.appendChild(deleteBtn.BUTTON);
```

---

## Full Template: Multi-Element Component Template

Templates are not limited to single elements. You can template entire component structures:

```javascript
// Complete card template
const cardTemplate = {
  ARTICLE: {
    className: 'card',
    style: {
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }
  },
  IMG: {
    style: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    }
  },
  BODY: {
    style: { padding: '20px' }
  },
  TITLE: {
    style: { margin: '0 0 8px', fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e' }
  },
  DESCRIPTION: {
    style: { margin: '0 0 16px', color: '#666', lineHeight: '1.5', fontSize: '0.9rem' }
  },
  BUTTON: {
    classList: { add: ['btn', 'btn-primary'] },
    style: { width: '100%', padding: '10px' }
  }
};

// Create cards from the template — customize per card
function renderCard(data) {
  const card = createElement.bulk(cardTemplate);

  card.ARTICLE.addEventListener('mouseenter', () => {
    card.ARTICLE.update({ style: { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } });
  });
  card.ARTICLE.addEventListener('mouseleave', () => {
    card.ARTICLE.update({ style: { transform: 'translateY(0)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' } });
  });

  card.IMG.setAttribute('src', data.image);
  card.IMG.setAttribute('alt', data.title);
  card.TITLE.textContent = data.title;
  card.DESCRIPTION.textContent = data.description;
  card.BUTTON.textContent = data.buttonLabel || 'View Details';
  card.BUTTON.addEventListener('click', () => data.onClick());

  card.BODY.append(card.TITLE, card.DESCRIPTION, card.BUTTON);
  card.ARTICLE.append(card.IMG, card.BODY);

  return card.ARTICLE;
}

// Render multiple cards from the same template
const articles = [
  { title: 'Getting Started', description: 'Learn the basics.', image: 'start.jpg', buttonLabel: 'Start', onClick: () => navigate('start') },
  { title: 'Advanced Patterns', description: 'Go deeper.', image: 'advanced.jpg', buttonLabel: 'Explore', onClick: () => navigate('advanced') }
];

articles.forEach(data => {
  Elements.articleGrid.appendChild(renderCard(data));
});
```

---

## Template for Repeated Identical Structures

When you need multiple copies of an element with the exact same configuration (like a row template for a table), templates are especially clean:

```javascript
// Row template
const tableRowTemplate = {
  BUTTON_edit: {
    textContent: 'Edit',
    classList: { add: ['btn', 'btn-sm', 'btn-outlined'] },
    style: { marginRight: '8px' }
  },
  BUTTON_delete: {
    textContent: 'Delete',
    classList: { add: ['btn', 'btn-sm', 'btn-danger'] }
  }
};

// Use the same template for every row
function renderTableRow(item) {
  const row = createElement.bulk(tableRowTemplate);

  // Customize the event listeners per row
  row.BUTTON_edit.addEventListener('click', () => editItem(item.id));
  row.BUTTON_delete.addEventListener('click', () => deleteItem(item.id));

  const tr = document.createElement('tr');
  const nameTd = document.createElement('td');
  nameTd.textContent = item.name;

  const actionsTd = document.createElement('td');
  actionsTd.append(row.BUTTON_edit, row.BUTTON_delete);

  tr.append(nameTd, actionsTd);
  return tr;
}
```

---

## Design System Templates

Templates are an excellent way to implement a simple design system — a set of predefined styles that keep your UI consistent:

```javascript
// Your design system — define once, use everywhere
const DS = {
  heading: {
    style: {
      fontFamily: 'Georgia, serif',
      color: '#1a1a2e',
      letterSpacing: '-0.02em'
    }
  },
  body: {
    style: {
      fontFamily: 'Inter, sans-serif',
      color: '#444',
      lineHeight: '1.7'
    }
  },
  card: {
    style: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)'
    }
  },
  primaryBtn: {
    style: {
      background: '#6c5ce7',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600'
    }
  }
};

// Use design system tokens
const heroSection = createElement.bulk({
  SECTION: { style: { padding: '80px 20px', textAlign: 'center' } },
  H1:      { textContent: 'Build Faster', style: { ...DS.heading.style, fontSize: '3rem' } },
  P:       { textContent: 'The simplest way to create UI.', style: { ...DS.body.style, fontSize: '1.2rem' } },
  BUTTON:  { textContent: 'Get Started', style: DS.primaryBtn.style }
});

heroSection.SECTION.append(heroSection.H1, heroSection.P, heroSection.BUTTON);
document.body.appendChild(heroSection.SECTION);
```

---

## Common Pitfall: Shared Object References

When you spread object literals, the spread is **shallow**. This means nested objects (like `style`) are still shared references:

```javascript
const template = {
  BUTTON: {
    style: { padding: '10px', background: 'blue' }  // ← nested object
  }
};

const btn1Config = { ...template };
const btn2Config = { ...template };

// Both btn1Config.BUTTON and btn2Config.BUTTON point to the SAME object!
// Mutating one mutates the other.
btn1Config.BUTTON.style.background = 'red';
console.log(btn2Config.BUTTON.style.background); // 'red' — oops!
```

**Safe approach: deep spread when modifying nested objects:**

```javascript
const btn1Config = {
  BUTTON: { ...template.BUTTON, style: { ...template.BUTTON.style, background: 'red' } }
};

const btn2Config = {
  BUTTON: { ...template.BUTTON, style: { ...template.BUTTON.style, background: 'green' } }
};
```

This creates new objects at every level, so mutations don't bleed across instances.

---

## Summary

Method 11 — Template-Based Creation — is the approach for **centralizing configuration** and creating consistent elements from shared definitions.

**Key points:**
- ✅ Store configuration objects in variables — these become your templates
- ✅ Use the spread operator (`...`) to reuse and customize templates
- ✅ Combine templates with functions for parameterized variants
- ✅ Templates work for single elements and entire component structures
- ✅ One change to the template propagates to every element created from it
- ✅ Design system tokens can be expressed as shared style objects

**When to reach for Method 11:**
- When the same configuration appears more than twice in your code
- When you want to implement consistent design across many elements
- When you want a single source of truth for element styling or structure
- When working on a design system or UI pattern library

---

## What's Next?

- **[11 — The Result Object](./11_result-object-methods.md)** — Complete reference for everything `createElement.bulk()` returns
- **[13 — Additional Patterns](./13_additional-patterns.md)** — Methods 5, 6, 7, 10, and 12