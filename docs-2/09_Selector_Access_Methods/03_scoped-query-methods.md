[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Scoped Query Methods — `Selector.Scoped.within()` and `Selector.Scoped.withinAll()`

## Quick Start (30 Seconds)

```javascript
// Get a container element
const modal = Elements.userModal;

// Find ONE element within that container only
const confirmBtn = Selector.Scoped.within(modal, '.btn.confirm');

// Find MULTIPLE elements within that container only
const formInputs = Selector.Scoped.withinAll(modal, 'input, select, textarea');

// Results are enhanced — all methods available
formInputs.setProperty('disabled', true);
formInputs.on('change', handleFieldChange);

if (confirmBtn) {
  confirmBtn.focus();
}
```

Scoped queries limit the search to within a specific container — faster, more precise, and perfect for component isolation.

---

## What Are Scoped Query Methods?

`Selector.Scoped.within()` and `Selector.Scoped.withinAll()` are methods that run a CSS selector search **within a specific container element** rather than searching the entire document.

Simply put: instead of looking through your entire webpage, you're telling the Selector to look only inside one particular section.

Think of it like this:

> **Global query:** "Search the entire building for a fire extinguisher."
>
> **Scoped query:** "Search only on the third floor for a fire extinguisher." — Much faster, and more precise.

This matters for two reasons:

1. **Performance** — On large pages with thousands of elements, limiting the search area is significantly faster
2. **Component isolation** — When you have multiple similar components (like several modals or cards), scoped queries ensure you only target elements inside the right one

---

## Syntax

### `Selector.Scoped.within()`

```javascript
Selector.Scoped.within(container, selector)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `container` | `Element` | The DOM element to search within |
| `selector` | `string` | Any valid CSS selector |

**Returns:** The first matching `Element` within the container, or `null` if not found.

---

### `Selector.Scoped.withinAll()`

```javascript
Selector.Scoped.withinAll(container, selector)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `container` | `Element` | The DOM element to search within |
| `selector` | `string` | Any valid CSS selector |

**Returns:** An **enhanced collection** of all matching elements within the container. Returns empty collection if none found.

---

## Why Does This Exist?

### `within()` — When Component-Specific Single Element Access Is Your Priority

In scenarios where you're working with repeatable UI components (cards, modals, panels), `Selector.Scoped.within()` ensures you target the right element inside the right component:

```javascript
// Multiple cards exist — which card's button do you want?
const cards = Collections.ClassName.card;

cards.forEach(card => {
  // WITHOUT scoped: Selector.query('.card-btn') → always finds the FIRST btn on the page
  // WITH scoped: finds the btn inside THIS specific card
  const cardBtn = Selector.Scoped.within(card, '.card-btn');

  if (cardBtn) {
    cardBtn.addEventListener('click', () => handleCardAction(card.dataset.id));
  }
});
```

This approach is **great when you need:**
✅ Access to a child element of a specific component instance
✅ Isolation between multiple instances of the same component
✅ Precise targeting without relying on complex parent-child CSS selectors

### `withinAll()` — When Gathering All Children of a Container Is Your Goal

In scenarios where you want to work with all matching elements inside a specific section, `withinAll()` gives you a clean, isolated collection:

```javascript
function setupFormSection(sectionElement) {
  // Only targets inputs within THIS section — not the entire page
  const inputs = Selector.Scoped.withinAll(sectionElement, 'input[required]');
  const labels = Selector.Scoped.withinAll(sectionElement, 'label');

  inputs.on('blur', validateField);
  labels.addClass('initialized');
}

// Call for each section independently
const sections = Collections.ClassName['form-section'];
sections.forEach(section => setupFormSection(section));
```

**This method is especially useful when:**
✅ You have multiple similar containers and need elements from just one
✅ You're building reusable component initialization functions
✅ You need all children of a section for bulk updates
✅ Performance matters on large DOMs

**The Choice Is Yours:**
- Use `within()` when you need a single child element from a specific container
- Use `withinAll()` when you need all matching children from a container
- Both cache results and return enhanced objects identical to global queries

**Benefits of scoped queries:**
✅ Faster on large DOMs — narrows the search area
✅ Component-safe — no cross-contamination between component instances
✅ Results are cached per container + selector combination
✅ Same enhanced methods available as global query results

---

## Mental Model

### Scoped Queries as a Search Within a Folder

Imagine your DOM is a file system. Global queries search the entire hard drive. Scoped queries search only within one specific folder.

```
Entire DOM (Hard Drive)
├── header/
│   ├── .nav-link         ← Global query finds ALL of these
│   └── .btn
├── main/
│   ├── modal/
│   │   ├── .btn          ← Scoped query within modal finds ONLY these
│   │   └── input
│   └── card/
│       ├── .btn          ← Scoped query within card finds ONLY these
│       └── input
└── footer/
    └── .btn
```

```javascript
// Global — finds ALL .btn elements everywhere
const allBtns = Selector.queryAll('.btn');  // header + modal + card + footer buttons

// Scoped to modal — finds ONLY modal's .btn elements
const modal = Elements.userModal;
const modalBtns = Selector.Scoped.withinAll(modal, '.btn');  // Only modal buttons
```

---

## How Does It Work?

Internally, scoped queries use `container.querySelectorAll(selector)` (on the container element directly) rather than `document.querySelectorAll(selector)`.

```
Selector.Scoped.withinAll(container, '.btn')
                    │
                    ▼
     Build cache key: container_id + selector
                    │
          ┌─────────┴──────────┐
          │                    │
       CACHED                MISS
          │                    │
          ▼                    ▼
   Return cached         container.querySelectorAll('.btn')
   collection                  │
                               ▼
                      Wrap in enhanced collection
                      (array methods + DOM methods)
                               │
                               ▼
                      Store in cache
                               │
                               ▼
                      Return enhanced collection
```

**The result is identical in capability to a global `queryAll()` result** — it has all the same array methods (`forEach`, `map`, `filter`) and DOM methods (`addClass`, `on`, `setStyle`). The only difference is the search scope.

---

## Basic Usage

### Step 1: Get Your Container Element

```javascript
// Using Elements helper (most common)
const modal = Elements.userModal;
const sidebar = Elements.mainSidebar;
const form = Elements.checkoutForm;

// Using a direct query result
const activeCard = Selector.query('.card.active');

// Using a reference you already have
function initComponent(componentElement) {
  // componentElement is your container
  const title = Selector.Scoped.within(componentElement, '.title');
}
```

---

### Step 2: Query Within the Container

```javascript
const modal = Elements.userModal;

// Single element
const title = Selector.Scoped.within(modal, '.modal-title');
const closeBtn = Selector.Scoped.within(modal, '.btn.close');

// Multiple elements
const allInputs = Selector.Scoped.withinAll(modal, 'input, select, textarea');
const allBtns   = Selector.Scoped.withinAll(modal, 'button');
const required  = Selector.Scoped.withinAll(modal, '[required]');

// Work with results
if (title) title.textContent = 'User Profile';
allInputs.setProperty('disabled', false);
allBtns.on('click', handleModalButtonClick);
```

---

### Step 3: Combine Scoped and Global Queries

```javascript
const dashboard = Elements.dashboard;

// Get scoped elements for the dashboard
const cards    = Selector.Scoped.withinAll(dashboard, '.card');
const charts   = Selector.Scoped.withinAll(dashboard, '.chart');
const controls = Selector.Scoped.withinAll(dashboard, '.control-panel button');

// Initialize each card using scoped access to card children
cards.forEach(card => {
  const header   = Selector.Scoped.within(card, '.card-header');
  const body     = Selector.Scoped.within(card, '.card-body');
  const chartEl  = Selector.Scoped.within(card, 'canvas.chart');

  if (header) header.classList.add('initialized');
  if (chartEl) renderChart(chartEl, card.dataset.chartType);
});
```

---

## Deep Dive: `Selector.Scoped.within()`

### Examples

#### Example 1: Modal Button Setup

```javascript
function openUserModal(userData) {
  const modal = Elements.userModal;

  // Find specific elements within this modal only
  const title   = Selector.Scoped.within(modal, '.modal-title');
  const nameEl  = Selector.Scoped.within(modal, '.user-name');
  const emailEl = Selector.Scoped.within(modal, '.user-email');
  const saveBtn = Selector.Scoped.within(modal, '.btn.save');
  const cancelBtn = Selector.Scoped.within(modal, '.btn.cancel');

  // Populate with data
  if (title) title.textContent = 'Edit User';
  if (nameEl) nameEl.textContent = userData.name;
  if (emailEl) emailEl.textContent = userData.email;

  // Setup buttons
  if (saveBtn) {
    saveBtn.addEventListener('click', () => saveUser(userData.id));
  }
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => closeModal(modal));
  }

  modal.classList.add('visible');
}
```

#### Example 2: Find First Invalid Field in a Section

```javascript
function validateSection(sectionElement) {
  // Find the first invalid field within this section
  const firstInvalid = Selector.Scoped.within(sectionElement, 'input:invalid');

  if (firstInvalid) {
    firstInvalid.focus();
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    sectionElement.classList.add('has-errors');
    return false;
  }

  sectionElement.classList.remove('has-errors');
  sectionElement.classList.add('valid');
  return true;
}

// Validate each section of a multi-step form
const sections = Selector.queryAll('.form-section');
const allValid = sections.every(section => validateSection(section));
```

#### Example 3: Component-Specific Navigation

```javascript
class SidebarController {
  constructor(sidebarElement) {
    this.sidebar = sidebarElement;

    // Find the active link within THIS sidebar only
    const activeLink = Selector.Scoped.within(this.sidebar, 'a.nav-link.active');
    this.currentPath = activeLink?.getAttribute('href') ?? '/';
  }

  highlightLink(path) {
    // Find and update within this sidebar
    const current = Selector.Scoped.within(this.sidebar, 'a.nav-link.active');
    if (current) current.classList.remove('active');

    const next = Selector.Scoped.within(this.sidebar, `a.nav-link[href="${path}"]`);
    if (next) {
      next.classList.add('active');
      this.currentPath = path;
    }
  }
}
```

---

## Deep Dive: `Selector.Scoped.withinAll()`

### Examples

#### Example 1: Form Manager

```javascript
class FormManager {
  constructor(formElement) {
    this.form = formElement;

    // All queries are scoped to this form only
    this.inputs   = Selector.Scoped.withinAll(formElement, 'input, textarea, select');
    this.buttons  = Selector.Scoped.withinAll(formElement, 'button');
    this.required = Selector.Scoped.withinAll(formElement, '[required]');
    this.labels   = Selector.Scoped.withinAll(formElement, 'label');
  }

  validate() {
    // Find empty required fields
    const empty = this.required.filter(field => !field.value.trim());

    if (empty.length > 0) {
      // Highlight them
      empty.forEach(field => field.classList.add('error'));

      // Focus the first one
      empty[0].focus();
      return false;
    }

    return true;
  }

  getData() {
    const data = {};
    this.inputs.forEach(input => {
      if (input.name) data[input.name] = input.value;
    });
    return data;
  }

  lock() {
    this.inputs.setProperty('disabled', true);
    this.buttons.setProperty('disabled', true);
    this.labels.addClass('locked');
  }

  unlock() {
    this.inputs.setProperty('disabled', false);
    this.buttons.setProperty('disabled', false);
    this.labels.removeClass('locked');
  }

  reset() {
    this.inputs.forEach(input => {
      input.value = '';
      input.classList.remove('error', 'success', 'dirty');
    });
  }
}

// Usage — each form is independently managed
const loginForm = new FormManager(Elements.loginForm);
const signupForm = new FormManager(Elements.signupForm);

loginForm.validate();  // Only validates loginForm's fields
signupForm.validate(); // Only validates signupForm's fields
```

#### Example 2: Tab Panel Component

```javascript
class TabPanel {
  constructor(panelElement) {
    this.panel = panelElement;

    // Find tabs and contents within this panel only
    this.tabs     = Selector.Scoped.withinAll(panelElement, '.tab-header');
    this.contents = Selector.Scoped.withinAll(panelElement, '.tab-content');

    this.currentIndex = 0;
    this.bindEvents();
  }

  bindEvents() {
    this.tabs.on('click', (e) => {
      const tabIndex = this.tabs.toArray().indexOf(e.currentTarget);
      if (tabIndex !== -1) this.showTab(tabIndex);
    });
  }

  showTab(index) {
    // Hide all
    this.contents.addClass('hidden');
    this.tabs.removeClass('active');

    // Show selected
    const content = this.contents.at(index);
    const tab     = this.tabs.at(index);

    if (content) content.classList.remove('hidden');
    if (tab)     tab.classList.add('active');

    this.currentIndex = index;
  }
}

// Multiple independent tab panels on the same page
const panels = Selector.queryAll('.tab-panel');
panels.forEach(panel => new TabPanel(panel));
```

#### Example 3: Dynamic Section Initialization

```javascript
function initializeSection(sectionEl) {
  // Find all interactive elements within this section
  const buttons    = Selector.Scoped.withinAll(sectionEl, 'button:not([disabled])');
  const links      = Selector.Scoped.withinAll(sectionEl, 'a[data-action]');
  const toggles    = Selector.Scoped.withinAll(sectionEl, '[data-toggle]');
  const dropdowns  = Selector.Scoped.withinAll(sectionEl, '.dropdown');

  // Mark all as initialized
  buttons.setAttribute('data-initialized', 'true');

  // Setup button handlers
  buttons.on('click', (e) => {
    const action = e.currentTarget.dataset.action;
    if (action) handleAction(action, sectionEl);
  });

  // Setup link handlers
  links.on('click', (e) => {
    e.preventDefault();
    const action = e.currentTarget.dataset.action;
    handleAction(action, sectionEl);
  });

  // Setup toggles
  toggles.on('click', function () {
    const target = Selector.Scoped.within(sectionEl, this.dataset.toggle);
    if (target) target.classList.toggle('active');
  });

  console.log(`Section initialized: ${buttons.length} buttons, ${links.length} links`);
}

// Initialize all sections on the page
const sections = Selector.queryAll('.page-section');
sections.forEach(section => initializeSection(section));
```

---

## Real-World Patterns

### Pattern 1: Modal Stack Manager

```javascript
class ModalManager {
  constructor() {
    this.stack = [];
  }

  open(modalElement, options = {}) {
    // Setup all interactive elements within this modal
    const closeButtons  = Selector.Scoped.withinAll(modalElement, '.close-btn, .btn-cancel');
    const confirmButton = Selector.Scoped.within(modalElement, '.btn-confirm');
    const focusable     = Selector.Scoped.withinAll(modalElement, 'input, button, select, a[href]');

    // Bind close handlers
    closeButtons.on('click', () => this.close(modalElement));

    // Bind confirm handler
    if (confirmButton && options.onConfirm) {
      confirmButton.addEventListener('click', options.onConfirm);
    }

    // Show modal
    modalElement.classList.add('visible');
    modalElement.setAttribute('aria-hidden', 'false');

    // Focus first focusable element
    const first = focusable.first();
    if (first) first.focus();

    this.stack.push(modalElement);
    console.log(`Opened modal. Stack depth: ${this.stack.length}`);
  }

  close(modalElement) {
    modalElement.classList.remove('visible');
    modalElement.setAttribute('aria-hidden', 'true');

    // Clean up events within the modal
    const allBtns = Selector.Scoped.withinAll(modalElement, 'button');
    allBtns.off('click');

    this.stack = this.stack.filter(m => m !== modalElement);
    console.log(`Closed modal. Stack depth: ${this.stack.length}`);
  }

  closeAll() {
    [...this.stack].forEach(modal => this.close(modal));
  }
}

const modals = new ModalManager();
```

### Pattern 2: Nested Navigation with Independent Sections

```javascript
function setupNavigation(navElement) {
  // All queries are scoped — each nav is independent
  const links       = Selector.Scoped.withinAll(navElement, 'a.nav-link');
  const dropdowns   = Selector.Scoped.withinAll(navElement, '.dropdown-trigger');
  const searchInput = Selector.Scoped.within(navElement, 'input.nav-search');

  // Active link tracking
  links.on('click', (e) => {
    links.removeClass('active');
    e.currentTarget.classList.add('active');
  });

  // Dropdown toggles
  dropdowns.on('click', function () {
    const menu = Selector.Scoped.within(this.parentElement, '.dropdown-menu');
    if (menu) menu.classList.toggle('open');
  });

  // Search functionality (if present)
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterNavLinks(links, e.target.value);
    });
  }
}

// Each nav section is fully independent
setupNavigation(Elements.mainNav);
setupNavigation(Elements.sideNav);
setupNavigation(Elements.footerNav);
```

### Pattern 3: Component Manager

```javascript
class ComponentManager {
  constructor(rootElement) {
    this.root = rootElement;
    this.registry = new Map();
  }

  register(name, selector) {
    const instances = Selector.Scoped.withinAll(this.root, selector);
    this.registry.set(name, instances);

    console.log(`Registered ${instances.length} "${name}" components`);
    return instances;
  }

  get(name) {
    return this.registry.get(name) ?? null;
  }

  initializeAll() {
    this.registry.forEach((instances, name) => {
      instances.forEach(instance => {
        if (instance.dataset.initialized === 'true') return;

        instance.dataset.initialized = 'true';
        instance.dispatchEvent(new CustomEvent('component:init', { bubbles: true }));
      });
    });
  }

  destroyAll() {
    this.registry.forEach((instances, name) => {
      instances.off('click').off('change').off('mouseenter');
    });
    this.registry.clear();
  }
}

const app = Elements.app;
const manager = new ComponentManager(app);

manager.register('card', '.card');
manager.register('button', 'button.interactive');
manager.register('input', 'input[data-validate]');

manager.initializeAll();
```

---

## Performance Benefits

### Why Scoped Queries Are Faster

Every `querySelectorAll()` call has to traverse DOM nodes. The more nodes in the page, the longer it takes. Scoped queries limit the search to a subtree:

```
Global query:   Checks ALL nodes in document (e.g., 10,000 nodes)
Scoped query:   Checks only nodes inside container (e.g., 150 nodes)

Speedup:        ~66x fewer nodes to check
```

### Benchmark

```javascript
// Setup: page with 5,000 elements, modal with 50 elements

// Global query — checks all 5,000
console.time('global');
for (let i = 0; i < 200; i++) {
  Selector.queryAll('.btn');  // Searches all 5,000 elements
}
console.timeEnd('global');  // ~40ms

// Scoped query — checks only 50
const modal = Elements.modal;
console.time('scoped');
for (let i = 0; i < 200; i++) {
  Selector.Scoped.withinAll(modal, '.btn');  // Searches only 50 elements
}
console.timeEnd('scoped');  // ~2ms

// Scoped is ~20x faster in this example
```

---

## Caching with Scoped Queries

Scoped queries are cached exactly like global queries — keyed by the container reference + selector string:

```javascript
const modal = Elements.modal;

// First call — queries within modal and caches
const btns1 = Selector.Scoped.withinAll(modal, '.btn');

// Second call — same container + same selector → from cache
const btns2 = Selector.Scoped.withinAll(modal, '.btn');

console.log(btns1 === btns2);  // true — same cached object
```

The cache is automatically invalidated when the DOM inside the container changes.

---

## Common Pitfalls

### Pitfall 1: Scoping to `document` or `document.body` — Unnecessary

```javascript
// ❌ Scoping to the entire document is the same as a global query — no benefit
const btns = Selector.Scoped.withinAll(document.body, '.btn');

// ✅ Just use the global query
const btns = Selector.queryAll('.btn');
```

### Pitfall 2: Using a Stale Container Reference

```javascript
// ❌ If the container was replaced in the DOM, your reference is stale
const oldContainer = Selector.query('.container');
replaceContainerInDOM();  // Container is now different
const items = Selector.Scoped.withinAll(oldContainer, '.item');  // Searches the detached old element!

// ✅ Re-query the container if the DOM has changed
const freshContainer = Selector.query('.container');
const items = Selector.Scoped.withinAll(freshContainer, '.item');
```

### Pitfall 3: Over-Scoping Simple Global Queries

```javascript
// ❌ Unnecessary scoping when the element is truly page-unique
const body = document.body;
const pageTitle = Selector.Scoped.within(body, '#page-title');

// ✅ Use Elements or a direct query
const pageTitle = Elements.pageTitle;
// or
const pageTitle = Selector.query('#page-title');
```

### Pitfall 4: Forgetting to Check `within()` for `null`

```javascript
// ❌ Will throw if element not found inside container
const modal = Elements.modal;
Selector.Scoped.within(modal, '.btn.confirm').addEventListener('click', handler);

// ✅ Check first
const confirmBtn = Selector.Scoped.within(modal, '.btn.confirm');
if (confirmBtn) {
  confirmBtn.addEventListener('click', handler);
}
```

---

## Key Takeaways

1. **`Selector.Scoped.within(container, selector)`** — Finds one element inside the container. Returns the element or `null`.

2. **`Selector.Scoped.withinAll(container, selector)`** — Finds all matching elements inside the container. Returns an enhanced collection.

3. **Component isolation** — When you have multiple instances of a component (cards, modals, forms), scoped queries prevent cross-contamination.

4. **Performance** — Scoped queries search far fewer DOM nodes on large pages — significantly faster than global queries.

5. **Same enhanced methods** — Results support all array methods (`forEach`, `map`, `filter`) and DOM methods (`addClass`, `on`, `setStyle`) just like global query results.

6. **Still cached** — Scoped query results are cached per container + selector combination.

7. **Get your container first** — Use `Elements`, `Selector.query()`, or a function parameter to obtain the container before calling scoped methods.

8. **Don't over-scope** — Scoping to `document.body` or `document` adds no benefit. Scope only to meaningful containers.