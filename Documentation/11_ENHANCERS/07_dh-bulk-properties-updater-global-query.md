# DOM Helpers - Bulk Properties Updater Global Query Module

## Available Methods & Usage Guide

Here's a comprehensive list of all available methods in the `bulk-properties-updater-global-query` module:

---

## 🔍 **Core Query Functions**

### 1. `querySelector(selector, context)` / `query(selector, context)`

**Purpose:** Enhanced version of native `querySelector` that returns an element with `.update()` method attached.

**Usage:**

```javascript
// Basic usage
const button = querySelector("#myButton");
const button = query("#myButton"); // Shorthand

// With context
const container = document.getElementById("container");
const button = querySelector(".btn", container);

// Chained update
query("#title").update({
  textContent: "New Title",
  style: { color: "red", fontSize: "24px" },
});
```

---

### 2. `querySelectorAll(selector, context)` / `queryAll(selector, context)`

**Purpose:** Enhanced version of native `querySelectorAll` that returns a collection with `.update()` and bulk property methods.

**Usage:**

```javascript
// Basic usage
const buttons = querySelectorAll(".btn");
const buttons = queryAll(".btn"); // Shorthand

// With context
const form = document.getElementById("myForm");
const inputs = querySelectorAll("input", form);
```

---

## 📦 **Element Enhancement Methods**

### 3. `enhanceElement(element)`

**Purpose:** Manually enhance a single DOM element with `.update()` method.

**Usage:**

```javascript
const element = document.getElementById("myElement");
const enhanced = enhanceElement(element);

enhanced.update({
  textContent: "Updated",
  style: { color: "blue" },
});
```

---

### 4. `enhanceNodeList(nodeList)`

**Purpose:** Manually enhance a NodeList or array of elements with `.update()` and bulk methods.

**Usage:**

```javascript
const nodeList = document.querySelectorAll(".item");
const enhanced = enhanceNodeList(nodeList);

enhanced.update({
  0: { textContent: "First item" },
  1: { textContent: "Second item" },
});
```

---

## 🎯 **Single Element `.update()` Method**

### 5. `element.update(updates)`

**Purpose:** Batch update properties on a single element.

**Supported Keys:**

- `style` - Object with CSS properties
- `dataset` - Object with data attributes
- `classList` - Object with classList methods
- `attrs` / `attributes` - Object with HTML attributes
- Any direct DOM property (e.g., `textContent`, `innerHTML`, `value`)

**Usage:**

```javascript
const button = query("#myButton");

button.update({
  textContent: "Click Me",
  style: {
    backgroundColor: "blue",
    color: "white",
    padding: "10px 20px",
  },
  dataset: {
    userId: "123",
    action: "submit",
  },
  classList: {
    add: ["btn", "btn-primary"],
    remove: ["btn-old"],
  },
  attrs: {
    "data-id": "456",
    "aria-label": "Submit button",
  },
  disabled: false,
  title: "Click to submit",
});
```

---

## 🔄 **Collection `.update()` Method**

### 6. `collection.update(updates)`

**Purpose:** Batch update multiple elements in a collection.

**Two Update Modes:**

#### **Mode 1: Index-Based Updates** (Different updates per element)

```javascript
const items = queryAll(".item");

items.update({
  0: { textContent: "First", style: { color: "red" } },
  1: { textContent: "Second", style: { color: "blue" } },
  2: { textContent: "Third", style: { color: "green" } },
});
```

#### **Mode 2: Property-Wide Updates** (Same update to all elements)

```javascript
const buttons = queryAll(".btn");

buttons.update({
  style: { padding: "10px" },
  disabled: false,
});
// Applies to ALL buttons in collection
```

---

## 📝 **Bulk Property Updater Methods**

All bulk methods follow the pattern: `collection.method({ index: value })`

### 7. `collection.textContent(updates)`

**Purpose:** Update textContent of specific elements by index.

**Usage:**

```javascript
const paragraphs = queryAll("p");

paragraphs.textContent({
  0: "First paragraph",
  1: "Second paragraph",
  2: "Third paragraph",
});
```
---

### 8. `collection.innerHTML(updates)`

**Purpose:** Update innerHTML of specific elements by index.

**Usage:**

```javascript
const divs = queryAll(".content");

divs.innerHTML({
  0: "<strong>Bold text</strong>",
  1: "<em>Italic text</em>",
});
```

---

### 9. `collection.innerText(updates)`

**Purpose:** Update innerText of specific elements by index.

**Usage:**

```javascript
const spans = queryAll(".label");

spans.innerText({
  0: "Label 1",
  1: "Label 2",
});
```

---

### 10. `collection.value(updates)`

**Purpose:** Update value property of form elements by index.

**Usage:**

```javascript
const inputs = queryAll('input[type="text"]');

inputs.value({
  0: "John Doe",
  1: "john@example.com",
  2: "555-1234",
});
```

---

### 11. `collection.placeholder(updates)`

**Purpose:** Update placeholder attribute by index.

**Usage:**

```javascript
const inputs = queryAll("input");

inputs.placeholder({
  0: "Enter your name",
  1: "Enter your email",
  2: "Enter your phone",
});
```

---

### 12. `collection.title(updates)`

**Purpose:** Update title attribute by index.

**Usage:**

```javascript
const buttons = queryAll(".btn");

buttons.title({
  0: "Save document",
  1: "Delete item",
  2: "Share content",
});
```

---

### 13. `collection.disabled(updates)`

**Purpose:** Update disabled property by index.

**Usage:**

```javascript
const buttons = queryAll(".btn");

buttons.disabled({
  0: true, // Disable first button
  1: false, // Enable second button
  2: true, // Disable third button
});
```

---

### 14. `collection.checked(updates)`

**Purpose:** Update checked property of checkboxes/radios by index.

**Usage:**

```javascript
const checkboxes = queryAll('input[type="checkbox"]');

checkboxes.checked({
  0: true, // Check first
  1: false, // Uncheck second
  2: true, // Check third
});
```

---

### 15. `collection.readonly(updates)`

**Purpose:** Update readOnly property by index.

**Usage:**

```javascript
const inputs = queryAll("input");

inputs.readonly({
  0: true, // Make readonly
  1: false, // Make editable
});
```

---

### 16. `collection.hidden(updates)`

**Purpose:** Update hidden property by index.

**Usage:**

```javascript
const sections = queryAll(".section");

sections.hidden({
  0: false, // Show
  1: true, // Hide
  2: false, // Show
});
```

---

### 17. `collection.selected(updates)`

**Purpose:** Update selected property of options by index.

**Usage:**

```javascript
const options = queryAll("option");

options.selected({
  0: false,
  1: true, // Select this option
  2: false,
});
```

---

### 18. `collection.src(updates)`

**Purpose:** Update src attribute of images/media by index.

**Usage:**

```javascript
const images = queryAll("img");

images.src({
  0: "image1.jpg",
  1: "image2.jpg",
  2: "image3.jpg",
});
```

---

### 19. `collection.href(updates)`

**Purpose:** Update href attribute of links by index.

**Usage:**

```javascript
const links = queryAll("a");

links.href({
  0: "/page1",
  1: "/page2",
  2: "/page3",
});
```

---

### 20. `collection.alt(updates)`

**Purpose:** Update alt attribute of images by index.

**Usage:**

```javascript
const images = queryAll("img");

images.alt({
  0: "Product image 1",
  1: "Product image 2",
  2: "Product image 3",
});
```

---

### 21. `collection.style(updates)`

**Purpose:** Update style properties by index.

**Usage:**

```javascript
const divs = queryAll(".box");

divs.style({
  0: {
    backgroundColor: "red",
    padding: "20px",
  },
  1: {
    backgroundColor: "blue",
    padding: "30px",
  },
  2: {
    backgroundColor: "green",
    padding: "40px",
  },
});
```

---

### 22. `collection.dataset(updates)`

**Purpose:** Update data attributes by index.

**Usage:**

```javascript
const items = queryAll(".item");

items.dataset({
  0: {
    userId: "123",
    role: "admin",
  },
  1: {
    userId: "456",
    role: "user",
  },
});
```

---

### 23. `collection.attrs(updates)`

**Purpose:** Update HTML attributes by index.

**Usage:**

```javascript
const inputs = queryAll("input");

inputs.attrs({
  0: {
    "data-id": "1",
    "aria-label": "First name",
    required: true,
  },
  1: {
    "data-id": "2",
    "aria-label": "Last name",
    disabled: null, // Removes attribute
  },
});
```

---

### 24. `collection.classes(updates)`

**Purpose:** Update CSS classes by index.

**Two Formats:**

#### **Format 1: String replacement**

```javascript
const divs = queryAll(".box");

divs.classes({
  0: "new-class another-class",
  1: "different-class",
});
```

#### **Format 2: classList operations**

```javascript
const divs = queryAll(".box");

divs.classes({
  0: {
    add: ["active", "highlighted"],
    remove: ["inactive"],
  },
  1: {
    toggle: "visible",
    replace: ["old-class", "new-class"],
  },
});
```

---

### 25. `collection.prop(propertyPath, updates)`

**Purpose:** Generic property updater for any property or nested property.

**Usage:**

#### **Simple property:**

```javascript
const inputs = queryAll("input");

inputs.prop("maxLength", {
  0: 50,
  1: 100,
  2: 200,
});
```

#### **Nested property:**

```javascript
const divs = queryAll(".box");

divs.prop("style.backgroundColor", {
  0: "red",
  1: "blue",
  2: "green",
});

divs.prop("dataset.userId", {
  0: "123",
  1: "456",
});
```

---

## 📋 **Complete Example**

```javascript
// Query elements
const form = query("#myForm");
const inputs = queryAll('input[type="text"]', form);
const buttons = queryAll(".btn");
const images = queryAll("img.gallery");

// Update form
form.update({
  style: { padding: "20px" },
  dataset: { validated: "false" },
});

// Update inputs with different values
inputs
  .value({
    0: "John Doe",
    1: "john@example.com",
    2: "555-1234",
  })
  .placeholder({
    0: "Full name",
    1: "Email address",
    2: "Phone number",
  });

// Update buttons
buttons
  .textContent({
    0: "Submit",
    1: "Cancel",
    2: "Reset",
  })
  .style({
    0: { backgroundColor: "green" },
    1: { backgroundColor: "red" },
    2: { backgroundColor: "gray" },
  });

// Update images
images
  .src({
    0: "photo1.jpg",
    1: "photo2.jpg",
    2: "photo3.jpg",
  })
  .alt({
    0: "First photo",
    1: "Second photo",
    2: "Third photo",
  });

// Mixed update using .update()
inputs.update({
  0: {
    value: "Alice",
    style: { borderColor: "green" },
  },
  1: {
    value: "alice@example.com",
    style: { borderColor: "blue" },
  },
});
```

---

## 🎯 **Key Features**

1. **Method Chaining:** All bulk methods return the collection for chaining
2. **Index-Based Updates:** Target specific elements by their index
3. **Auto-Enhancement:** Elements are automatically enhanced with `.update()`
4. **Empty Collections:** Safe handling of empty collections (methods do nothing but return for chaining)
5. **Error Handling:** Comprehensive error handling with console warnings

---

## ⚠️ **Important Notes**

1. **Indices are strings:** Object keys are always strings, but the module parses them as numbers
2. **Property names:** Use exact DOM property names (e.g., `readOnly` not `readonly`)
3. **Null values in attrs:** Setting an attribute to `null` or `false` removes it
4. **Non-existent indices:** Updating non-existent indices is silently ignored
5. **Chaining works:** All methods return the collection for fluent API usage
