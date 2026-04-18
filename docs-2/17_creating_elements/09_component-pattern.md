[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Component Pattern — Method 9

## Quick Start (30 seconds)

```javascript
function UserProfile(name, email, avatar) {
  // Create all elements at once
  const profile = createElement.bulk({
    ARTICLE: {
      classList: { add: ['user-profile'] },
      dataset: { userId: String(Date.now()) }
    },
    IMG: {
      setAttribute: { src: avatar, alt: name },
      style: { width: '80px', height: '80px', borderRadius: '50%' }
    },
    H2:    { textContent: name },
    EMAIL: { textContent: email, style: { color: '#666' } },
    BUTTON_edit: {
      textContent: 'Edit Profile',
      addEventListener: ['click', () => openEditor(name)]
    }
  });

  // Assemble the component
  profile.ARTICLE.append(profile.IMG, profile.H2, profile.EMAIL, profile.BUTTON_edit);

  // Return the root element
  return profile.ARTICLE;
}

// Create and use the component
Elements.sidebar.appendChild(UserProfile('Jane Doe', 'jane@example.com', 'jane.jpg'));
```

---

## What is the Component Pattern?

The component pattern is an approach to building **self-contained, reusable UI pieces** using a function that creates, assembles, and returns a complete DOM structure.

Think of a "component" as a small, complete UI unit — a user card, a comment, a product tile, a settings panel, a modal dialog. Each component:
- Contains all its own elements
- Has its own internal structure
- Manages its own behavior (event listeners)
- Returns a root element that can be placed anywhere on the page

The component pattern is a natural evolution of the factory function pattern. The key difference is **focus**: a factory function focuses on creating a simple element from data; a component function focuses on building a complete, self-sufficient UI piece with internal structure and behavior.

---

## Why Does This Exist?

### The Need for Self-Contained UI Pieces

As applications grow, different parts of the UI need to be created independently and placed dynamically. A comment thread might render dozens of comment components. A shopping cart might render one product tile per item. A dashboard might render multiple widget panels.

Without a component approach, you end up with either:
1. Duplicated creation code scattered throughout your codebase
2. One massive function that creates everything — hard to understand and maintain

The component pattern gives each logical UI piece its own home: a single function that knows everything it needs to know to produce that piece.

### The Design Philosophy

Dom Helpers does not enforce a component system. There is no base class to extend, no lifecycle hook API, no framework to learn. Instead, it gives you a toolkit — primarily `createElement.bulk()` — that makes it natural to write component-style functions in plain JavaScript.

This means you have complete freedom:
✅ Write components as regular functions — no special syntax required
✅ Share state between components however you like (closures, modules, global state)
✅ Compose components by calling one inside another
✅ Keep components in separate files if you want
✅ Mix components with non-component code freely

This method is especially useful when:
✅ You are building a self-contained UI piece with multiple elements and behaviors
✅ You need multiple instances of the same complex UI structure
✅ You want to encapsulate related elements and their interactions
✅ You are migrating toward a more organized codebase without adopting a framework
✅ You want a lightweight alternative to framework components

---

## Mental Model: A Lego Set in a Box

Think of a component function like a Lego set that comes in its own labeled box.

When you open the box, everything you need to build the model is inside — the bricks are pre-sorted, the instructions are included, and you do not need parts from other boxes.

When you call `UserProfile()`, it is like opening that box. All the elements (the bricks) are created, arranged (the instructions), and the finished model (the assembled component) is handed to you.

```
UserProfile('Jane', 'jane@example.com', 'jane.jpg')
           ↓
All elements created inside the function
           ↓
Assembled according to the internal structure
           ↓
Returns the root <article> — the finished model
           ↓
You place it wherever it belongs on the page
```

---

## How Does It Work?

```
1️⃣  Function is called with data as parameters

2️⃣  createElement.bulk() creates all internal elements at once
    → Every element is named and accessible
    → All elements are automatically enhanced with .update()

3️⃣  The function assembles the elements
    → Appends children to parents
    → Sets up internal relationships

4️⃣  Event listeners reference elements created within the function
    → Closures keep them in scope
    → Everything the events need is available internally

5️⃣  The root element is returned to the caller
    → The caller simply places it in the DOM
    → The component manages itself from that point
```

---

## Basic Usage

### Comment Component

```javascript
function Comment(author, text, timestamp) {
  const comment = createElement.bulk({
    ARTICLE: {
      className: 'comment',
      style: {
        padding: '16px',
        marginBottom: '12px',
        background: '#f8f9fa',
        borderRadius: '8px',
        borderLeft: '3px solid #007bff'
      }
    },
    HEADER: {
      className: 'comment__header',
      style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }
    },
    AUTHOR: {
      textContent: author,
      style: { fontWeight: '600', color: '#333' }
    },
    TIMESTAMP: {
      textContent: timestamp,
      style: { fontSize: '12px', color: '#999' }
    },
    BODY: {
      textContent: text,
      style: { color: '#555', lineHeight: '1.6', margin: '0' }
    }
  });

  comment.HEADER.append(comment.AUTHOR, comment.TIMESTAMP);
  comment.ARTICLE.append(comment.HEADER, comment.BODY);

  return comment.ARTICLE;
}

// Render a list of comments
const comments = [
  { author: 'Alice', text: 'Great post!', timestamp: '2 hours ago' },
  { author: 'Bob', text: 'Very helpful, thanks.', timestamp: '1 hour ago' },
  { author: 'Carol', text: 'I learned a lot from this.', timestamp: '30 min ago' }
];

comments.forEach(c => {
  Elements.commentList.appendChild(Comment(c.author, c.text, c.timestamp));
});
```

---

### Modal Dialog Component

```javascript
function ConfirmModal(title, message, onConfirm, onCancel) {
  const modal = createElement.bulk({
    OVERLAY: {
      className: 'modal-overlay',
      style: {
        position: 'fixed',
        inset: '0',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '1000'
      }
    },
    DIALOG: {
      className: 'modal-dialog',
      role: 'dialog',
      style: {
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '440px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }
    },
    TITLE: {
      textContent: title,
      style: { margin: '0 0 12px', fontSize: '1.25rem', fontWeight: '700' }
    },
    MESSAGE: {
      textContent: message,
      style: { color: '#666', lineHeight: '1.6', marginBottom: '24px' }
    },
    FOOTER: {
      style: { display: 'flex', gap: '12px', justifyContent: 'flex-end' }
    },
    BUTTON_cancel: {
      textContent: 'Cancel',
      classList: { add: ['btn', 'btn-outlined'] },
      addEventListener: ['click', () => {
        modal.OVERLAY.remove();  // Close the modal
        if (onCancel) onCancel();
      }]
    },
    BUTTON_confirm: {
      textContent: 'Confirm',
      classList: { add: ['btn', 'btn-primary'] },
      addEventListener: ['click', () => {
        modal.OVERLAY.remove();  // Close the modal
        if (onConfirm) onConfirm();
      }]
    }
  });

  // Close when clicking the overlay (outside the dialog)
  modal.OVERLAY.addEventListener('click', (e) => {
    if (e.target === modal.OVERLAY) {
      modal.OVERLAY.remove();
      if (onCancel) onCancel();
    }
  });

  // Assemble
  modal.FOOTER.append(modal.BUTTON_cancel, modal.BUTTON_confirm);
  modal.DIALOG.append(modal.TITLE, modal.MESSAGE, modal.FOOTER);
  modal.OVERLAY.appendChild(modal.DIALOG);

  return modal.OVERLAY;
}

// Use it
document.body.appendChild(
  ConfirmModal(
    'Delete Account?',
    'This action cannot be undone. All your data will be permanently deleted.',
    () => deleteAccount(),    // onConfirm
    () => console.log('Cancelled')  // onCancel
  )
);
```

---

### Full User Profile Component (from Method 9)

This is the canonical Method 9 example — a complete profile component:

```javascript
function UserProfile(name, email, avatar) {
  const profile = createElement.bulk({
    ARTICLE: {
      classList: { add: ['user-profile'] },
      dataset: { userId: Date.now().toString() }
    },
    IMG: {
      setAttribute: { src: avatar, alt: name },
      style: { width: '100px', height: '100px', borderRadius: '50%', display: 'block', margin: '0 auto 16px' }
    },
    H2: {
      textContent: name,
      style: { textAlign: 'center', margin: '0 0 4px', fontSize: '1.25rem' }
    },
    P: {
      textContent: email,
      style: { textAlign: 'center', color: '#666', margin: '0 0 20px', fontSize: '0.9rem' }
    },
    BUTTON_edit: {
      textContent: 'Edit Profile',
      classList: { add: ['btn', 'btn-outlined', 'btn-full'] },
      style: { width: '100%' },
      addEventListener: ['click', () => {
        alert(`Editing ${name}'s profile`);
      }]
    }
  });

  // Assemble component
  profile.ARTICLE.append(
    profile.IMG,
    profile.H2,
    profile.P,
    profile.BUTTON_edit
  );

  return profile.ARTICLE;
}

// Create instances
const user1 = UserProfile('Alice Johnson', 'alice@example.com', 'alice.jpg');
const user2 = UserProfile('Bob Smith',     'bob@example.com',   'bob.jpg');

Elements.profileGrid.append(user1, user2);
```

---

### Notification Component with Auto-Dismiss

Components can manage their own behavior over time:

```javascript
function Toast(message, type = 'info', duration = 4000) {
  const config = {
    info:    { icon: 'ℹ️', bg: '#e3f2fd', color: '#1565c0' },
    success: { icon: '✅', bg: '#e8f5e9', color: '#2e7d32' },
    warning: { icon: '⚠️', bg: '#fff8e1', color: '#f57f17' },
    error:   { icon: '❌', bg: '#ffebee', color: '#c62828' }
  };

  const { icon, bg, color } = config[type] || config.info;

  const toast = createElement.bulk({
    ASIDE: {
      className: 'toast',
      role: 'alert',
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        background: bg,
        color: color,
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        marginBottom: '8px',
        maxWidth: '360px',
        animation: 'slideIn 0.3s ease'
      }
    },
    ICON: {
      textContent: icon,
      style: { fontSize: '1.2rem', flexShrink: '0' }
    },
    TEXT: {
      textContent: message,
      style: { flex: '1', fontSize: '0.9rem', fontWeight: '500' }
    },
    CLOSE: {
      textContent: '×',
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.2rem',
        color: 'inherit',
        lineHeight: '1',
        padding: '0'
      },
      addEventListener: ['click', () => dismiss()]
    }
  });

  // Internal dismiss function — shared between close button and auto-dismiss
  function dismiss() {
    toast.ASIDE.update({
      style: { opacity: '0', transform: 'translateX(100%)', transition: 'all 0.3s ease' }
    });
    setTimeout(() => toast.ASIDE.remove(), 300);
  }

  toast.ASIDE.append(toast.ICON, toast.TEXT, toast.CLOSE);

  // Auto-dismiss after specified duration
  setTimeout(dismiss, duration);

  return toast.ASIDE;
}

// Use toasts
Elements.toastContainer.appendChild(Toast('Profile saved successfully', 'success'));
Elements.toastContainer.appendChild(Toast('Session expires in 5 minutes', 'warning', 6000));
```

---

### Stateful Component with Internal Methods

A component can expose internal methods through the returned object:

```javascript
function SearchBar(onSearch) {
  let currentQuery = '';

  const bar = createElement.bulk({
    WRAPPER: {
      className: 'search-bar',
      style: { display: 'flex', gap: '8px' }
    },
    INPUT: {
      type: 'search',
      placeholder: 'Search...',
      classList: { add: ['search-input'] },
      style: { flex: '1', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px' },
      addEventListener: {
        input: (e) => { currentQuery = e.target.value; },
        keydown: (e) => { if (e.key === 'Enter') triggerSearch(); }
      }
    },
    BUTTON: {
      textContent: '🔍 Search',
      classList: { add: ['btn', 'btn-primary'] },
      addEventListener: ['click', () => triggerSearch()]
    }
  });

  function triggerSearch() {
    if (currentQuery.trim()) {
      onSearch(currentQuery.trim());
    }
  }

  bar.WRAPPER.append(bar.INPUT, bar.BUTTON);

  // Return both the element AND some methods for external use
  return {
    element: bar.WRAPPER,
    clear() {
      currentQuery = '';
      bar.INPUT.value = '';
    },
    focus() {
      bar.INPUT.focus();
    },
    setValue(query) {
      currentQuery = query;
      bar.INPUT.value = query;
    }
  };
}

// Use it
const searchBar = SearchBar((query) => {
  console.log('Searching for:', query);
  loadResults(query);
});

Elements.pageHeader.appendChild(searchBar.element);

// Control the search bar from outside
searchBar.focus();
searchBar.setValue('dom helpers');
```

---

## Component Pattern vs Factory Function

That's a very good question — let's break it down.

Both patterns use `createElement.bulk()` and both return DOM elements. The difference is **scope and complexity**:

| Factory Function | Component Pattern |
|------------------|-------------------|
| Creates simple elements from data | Creates complete UI pieces |
| Minimal internal logic | Internal state, events, multiple sub-elements |
| Returns the element directly | May return element + interface object |
| Focuses on one type of element | Encapsulates a logical UI section |
| Example: `createButton(label, onClick)` | Example: `SearchBar(onSearch)` |

**Simple rule:**
- Start with a factory function when you need to create elements from data
- Evolve to a component pattern when the element grows to have significant internal logic or multiple sub-elements

---

## Key Takeaways

**1. Name components with PascalCase** — to distinguish them from regular functions:
```javascript
function createCard(data) { ... }   // Factory — creates simple element
function UserProfile(data) { ... }  // Component — encapsulated UI piece
```

**2. Closures capture internal references** — elements created with `bulk` remain accessible to all event handlers inside the function.

**3. Components are composable** — call one component function inside another to build bigger UIs from smaller pieces.

**4. Return what the caller needs** — usually just the root element; sometimes a small interface object with methods.

---

## Summary

Method 9 — Component Pattern — is the approach for building **self-contained, reusable UI pieces** with Dom Helpers.

**Key points:**
- ✅ One function encapsulates all elements, structure, and behavior of a UI piece
- ✅ `createElement.bulk()` creates all internal elements in one call
- ✅ Closures give event handlers access to all internal elements
- ✅ Components can manage their own state and dismiss themselves
- ✅ Components compose — small components build into larger ones
- ✅ No framework required — plain JavaScript, plain DOM

---

## What's Next?

- **[10 — Template-Based Creation](./10_template-based-creation.md)** — Using configuration objects as reusable templates
- **[11 — The Result Object](./11_result-object-methods.md)** — Master all the methods on the `createElement.bulk()` result