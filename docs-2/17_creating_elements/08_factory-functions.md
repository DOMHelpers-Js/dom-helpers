[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Dynamic Element Factory Functions — Method 8

## Quick Start (30 seconds)

```javascript
// Define a factory once
function createProductCard(product) {
  const elements = createElement.bulk({
    ARTICLE: {
      className: "product-card",
      dataset: { productId: product.id },
    },
    H3: { textContent: product.name },
    PRICE: { textContent: `$${product.price}`, className: "price" },
    BUTTON: {
      textContent: "Add to Cart",
      addEventListener: [
        "click",() => console.log( `${product.name} added to cart and the price is $${product.price}`),
      ],
    },
  });

  elements.ARTICLE.append(elements.H3, elements.PRICE, elements.BUTTON);
  return elements.ARTICLE;
}

// Use it as many times as you need
const products = [
  { id: 1, name: "Wireless Mouse", price: 29.99 },
  { id: 2, name: "Mechanical Keyboard", price: 79.99 },
  { id: 3, name: "USB-C Hub", price: 39.99 },
];

products.forEach((product) => {
  Elements.productGrid.appendChild(createProductCard(product));
});
```

Then in your html

```html
<div id="productGrid"></div>
```

---

## What is a Factory Function?

A factory function is a regular JavaScript function that **creates and returns** a DOM element (or a group of elements).

The key idea: instead of creating elements inline wherever you need them, you define a function that knows how to create a specific type of UI piece — and then call that function as many times as you need, with different data each time.

```
function createXxx(data) {
    ↓
  Build elements using createElement.bulk()
    ↓
  Assemble the structure
    ↓
  return the root element
}

// Then use it:
const thing1 = createXxx(data1);
const thing2 = createXxx(data2);
const thing3 = createXxx(data3);
```

The result is the same kind of element each time — but customized with different data.

---

## Why Does This Exist?

### The Problem: Duplicated Creation Logic

Without factory functions, every time you need a "card" or a "list item" or a "notification", you write the same creation code again:

```javascript
// First card — inline
const card1 = createElement.bulk({
  DIV: { className: "card" },
  H3: { textContent: "Product A" },
  P: { textContent: "$19.99" },
  BUTTON: { textContent: "Buy", addEventListener: ["click", () => buy(1)] },
});
card1.DIV.append(card1.H3, card1.P, card1.BUTTON);
Elements.grid.appendChild(card1.DIV);

// Second card — same structure, duplicated
const card2 = createElement.bulk({
  DIV: { className: "card" },
  H3: { textContent: "Product B" },
  P: { textContent: "$39.99" },
  BUTTON: { textContent: "Buy", addEventListener: ["click", () => buy(2)] },
});
card2.DIV.append(card2.H3, card2.P, card2.BUTTON);
Elements.grid.appendChild(card2.DIV);
```

The structure is the same. Only the data changes. If you need to update the card layout — add a new element, change a class — you have to find and update every duplicate in your code.

### The Solution: Extract the Pattern

```javascript
function createCard(id, name, price) {
  const elements = createElement.bulk({
    DIV: { className: "card" },
    H3: { textContent: name },
    P: { textContent: `$${price}` },
    BUTTON: { textContent: "Buy", addEventListener: ["click", () => buy(id)] },
  });

  elements.DIV.append(elements.H3, elements.P, elements.BUTTON);
  return elements.DIV;
}

// Now it is one line per card
Elements.grid.appendChild(createCard(1, "Product A", 19.99));
Elements.grid.appendChild(createCard(2, "Product B", 39.99));
```

The creation logic exists in exactly one place. If you ever need to change the card structure, you change it once.

### Why This Method is Especially Useful

Factory functions are especially useful when:
✅ The same type of element needs to be created multiple times
✅ The element has a consistent structure but variable content
✅ You want to encapsulate the creation logic so it can be tested or shared
✅ You are working with a list of data items that each need their own UI element
✅ You want to keep your page-setup code clean and readable

---

## Mental Model: A Cookie Cutter

Think of a factory function like a cookie cutter.

The cookie cutter defines the **shape** (the element structure — the tags, classes, layout). The dough going in is the **data** (the content, the IDs, the event handlers). Every time you press the cutter, you get the same shape — but the specific cookie depends on the dough.

```
Factory function = Cookie Cutter (fixed shape)
Data parameters  = Dough (variable content)
Returned element = Cookie (unique instance)

createProductCard({ name: 'Widget A', price: 9.99 })
  → <article class="product-card">
      <h3>Widget A</h3>
      <span class="price">$9.99</span>
      ...
    </article>

createProductCard({ name: 'Gadget B', price: 49.99 })
  → <article class="product-card">
      <h3>Gadget B</h3>
      <span class="price">$49.99</span>
      ...
    </article>
```

Same shape. Different content. Same cookie cutter.

---

## How Does It Work?

```
1️⃣  You define a function that accepts data as parameters

2️⃣  Inside the function, use createElement.bulk() with the data
    → The configuration object uses the parameters directly

3️⃣  Assemble the element structure
    → Append child elements to their parent

4️⃣  Return the root element

5️⃣  The caller receives a fully built, ready-to-use DOM element
    → The caller appends it wherever needed
```

The factory function is responsible for creation and assembly. The caller is responsible for placement.

---

## Basic Usage

### Simple Text Item Factory

```javascript
function createListItem(text) {
  const result = createElement.bulk({
    LI: {
      textContent: text,
      classList: { add: ["list-item"] },
      style: {
        padding: "8px 16px",
        borderBottom: "1px solid #eee",
        cursor: "pointer",
      },
    },
  });

  return result.LI;
}

// Create a list
const items = ["Home", "About", "Services", "Contact"];
const ul = document.createElement("ul");
items.forEach((text) => ul.appendChild(createListItem(text)));
Elements.sidebar.appendChild(ul);
```

---

### Card Factory with Image

```javascript
function createMediaCard(title, description, imageSrc) {
  const elements = createElement.bulk({
    CARD: {
      className: "media-card",
      style: {
        background: "white",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      },
    },
    IMG: {
      setAttribute: {
        src: imageSrc,
        alt: title,
        loading: "lazy",
      },
      style: { width: "100%", height: "200px", objectFit: "cover" },
    },
    BODY: {
      className: "media-card__body",
      style: { padding: "16px" },
    },
    TITLE: {
      textContent: title,
      style: { margin: "0 0 8px", fontSize: "18px", fontWeight: "600" },
    },
    DESC: {
      textContent: description,
      style: { margin: "0", color: "#666", lineHeight: "1.5" },
    },
  });

  elements.BODY.append(elements.TITLE, elements.DESC);
  elements.CARD.append(elements.IMG, elements.BODY);

  return elements.CARD;
}

// Use it
const card1 = createMediaCard(
  "Ocean View",
  "A stunning coastal scene",
  "ocean.jpg",
);
const card2 = createMediaCard(
  "Mountain Peak",
  "High altitude adventure",
  "mountain.jpg",
);

Elements.gallery.append(card1, card2);
```

---

### Interactive Button Factory

```javascript
function createActionButton(label, type, onClick) {
  const styles = {
    primary: { background: "#007bff", color: "white" },
    success: { background: "#28a745", color: "white" },
    danger: { background: "#dc3545", color: "white" },
    outlined: {
      background: "transparent",
      color: "#007bff",
      border: "2px solid #007bff",
    },
  };

  const result = createElement.bulk({
    BUTTON: {
      textContent: label,
      classList: { add: ["btn", `btn--${type}`] },
      style: {
        padding: "10px 20px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
        transition: "opacity 0.2s",
        ...(styles[type] || styles.primary),
      },
      addEventListener: {
        click: onClick,
        mouseenter: (e) => e.target.update({ style: { opacity: "0.85" } }),
        mouseleave: (e) => e.target.update({ style: { opacity: "1" } }),
      },
    },
  });

  return result.BUTTON;
}

// Create different button types
Elements.toolbar.append(
  createActionButton("Save", "primary", handleSave),
  createActionButton("Cancel", "outlined", handleCancel),
  createActionButton("Delete", "danger", handleDelete),
);
```

---

### Factory that Returns Multiple Elements

Sometimes you need the factory to return more than one element (for example, a label and its input):

```javascript
function createFormField(id, label, type = "text") {
  const elements = createElement.bulk({
    LABEL: {
      textContent: label,
      setAttribute: { for: id },
      style: { display: "block", fontWeight: "600", marginBottom: "6px" },
    },
    INPUT: {
      type: type,
      id: id,
      name: id,
      classList: { add: ["form-input"] },
      style: {
        display: "block",
        width: "100%",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        marginBottom: "16px",
      },
    },
  });

  return elements; // Return the full result object, not just one element
}

// Use the result object
const nameField = createFormField("name", "Full Name");
const emailField = createFormField("email", "Email Address", "email");
const passField = createFormField("password", "Password", "password");

Elements.registrationForm.append(
  nameField.LABEL,
  nameField.INPUT,
  emailField.LABEL,
  emailField.INPUT,
  passField.LABEL,
  passField.INPUT,
);

// You can still access them later
console.log(emailField.INPUT.value);
```

---

### Data-Driven Factory

```javascript
function createUserRow(user) {
  const statusColors = {
    active: "#28a745",
    inactive: "#dc3545",
    pending: "#ffc107",
  };

  const elements = createElement.bulk({
    TR: { className: "user-row" },
    TD_NAME: {
      textContent: user.name,
      style: { padding: "12px", borderBottom: "1px solid #eee" },
    },
    TD_EMAIL: {
      textContent: user.email,
      style: { padding: "12px", borderBottom: "1px solid #eee", color: "#666" },
    },
    TD_STATUS: {
      style: { padding: "12px", borderBottom: "1px solid #eee" },
    },
    STATUS_BADGE: {
      textContent: user.status,
      style: {
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "12px",
        background: statusColors[user.status] || "#999",
        color: "white",
        fontSize: "12px",
        fontWeight: "600",
        textTransform: "capitalize",
      },
    },
    TD_ACTIONS: {
      style: { padding: "12px", borderBottom: "1px solid #eee" },
    },
    BUTTON_EDIT: {
      textContent: "Edit",
      classList: { add: ["btn", "btn-sm"] },
      addEventListener: ["click", () => editUser(user.id)],
      style: { marginRight: "8px" },
    },
    BUTTON_DELETE: {
      textContent: "Delete",
      classList: { add: ["btn", "btn-sm", "btn-danger"] },
      addEventListener: ["click", () => deleteUser(user.id)],
    },
  });

  elements.TD_STATUS.appendChild(elements.STATUS_BADGE);
  elements.TD_ACTIONS.append(elements.BUTTON_EDIT, elements.BUTTON_DELETE);
  elements.TR.append(
    elements.TD_NAME,
    elements.TD_EMAIL,
    elements.TD_STATUS,
    elements.TD_ACTIONS,
  );

  return elements.TR;
}

// Render a table of users
const users = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    status: "active",
  },
  { id: 2, name: "Bob Smith", email: "bob@example.com", status: "inactive" },
  { id: 3, name: "Carol White", email: "carol@example.com", status: "pending" },
];

users.forEach((user) => {
  Elements.usersTableBody.appendChild(createUserRow(user));
});
```

---

## Composing Factories

Factory functions can call other factory functions — building complex UI by composing smaller pieces:

```javascript
// Small piece factory
function createStat(label, value, color) {
  const elements = createElement.bulk({
    DIV: {
      className: "stat-card",
      style: { textAlign: "center", padding: "20px" },
    },
    VALUE: {
      textContent: value,
      style: { fontSize: "2rem", fontWeight: "bold", color: color },
    },
    LABEL: {
      textContent: label,
      style: { fontSize: "0.85rem", color: "#888", marginTop: "4px" },
    },
  });

  elements.DIV.append(elements.VALUE, elements.LABEL);
  return elements.DIV;
}

// Larger component factory — composed from smaller pieces
function createDashboardSummary(stats) {
  const container = createElement("div", {
    className: "stats-row",
    style: { display: "flex", gap: "20px" },
  });

  container.appendChild(createStat("Total Users", stats.users, "#007bff"));
  container.appendChild(createStat("Active Today", stats.active, "#28a745"));
  container.appendChild(createStat("Revenue", `$${stats.revenue}`, "#ffc107"));
  container.appendChild(
    createStat("Support Tickets", stats.tickets, "#dc3545"),
  );

  return container;
}

// Use it
const summary = createDashboardSummary({
  users: 1240,
  active: 387,
  revenue: "12,450",
  tickets: 23,
});

Elements.dashboardTop.appendChild(summary);
```

---

## Best Practices for Factory Functions

**1. Return the root element, not a collection**

Unless the caller genuinely needs multiple separate elements, return the assembled root:

```javascript
// ✅ Most factory functions should return the assembled root element
function createCard(data) {
  const elements = createElement.bulk({ ... });
  elements.WRAPPER.append(elements.TITLE, elements.BODY);
  return elements.WRAPPER;
}
```

**2. Keep factories focused**

Each factory should create one logical piece of UI:

```javascript
// ✅ Focused — creates one type of component
function createNotification(message, type) { ... }
function createUserAvatar(user) { ... }
function createPriceTag(price, currency) { ... }
```

**3. Accept data, not DOM elements**

Factories should accept plain data and create DOM elements from it:

```javascript
// ✅ Accepts plain data
function createCard(title, description, imageUrl) { ... }

// ❌ Don't pass DOM elements into factories — that mixes concerns
function createCard(titleElement, descriptionElement) { ... }
```

**4. Name factories with `create` prefix**

The naming convention `createXxx` immediately tells any reader that the function produces a DOM element:

```javascript
createCard();
createUserRow();
createNotification();
createSearchResult();
createFormField();
```

---

## Summary

Method 8 — Dynamic Element Factory Functions — is the pattern for **reusing element creation logic** across multiple instances.

**Key points:**

- ✅ A factory function accepts data and returns a DOM element
- ✅ Inside the factory, `createElement.bulk()` handles element creation
- ✅ The same structure is generated for every call, with different data each time
- ✅ Factories can be composed — small factories build bigger components
- ✅ A single change to the factory updates every instance everywhere

**When to reach for Method 8:**

- When you need the same type of element in multiple places
- When you are rendering a list of data items
- When you want to keep creation logic separate from page setup logic
- When you want to make your code easier to test and maintain

---

## What's Next?

- **[09 — Component Pattern](./09_component-pattern.md)** — Taking factory functions further with encapsulation and lifecycle management
