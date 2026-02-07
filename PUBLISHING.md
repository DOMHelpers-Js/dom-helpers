# Publishing Guide for DOM Helpers JS

## 📦 Publishing to npm

### First-Time Setup

1. **Create an npm account** (if you don't have one):
   ```bash
   npm adduser
   ```
   Or sign up at https://www.npmjs.com/signup

2. **Login to npm**:
   ```bash
   npm login
   ```

### Publishing Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the library**:
   ```bash
   npm run build:prod
   ```
   This creates optimized files in `dist/`:
   - `dom-helpers.min.js` (UMD, minified for CDN)
   - `dom-helpers.umd.js` (UMD, unminified)
   - `dom-helpers.esm.js` (ES Module)
   - `dom-helpers.cjs.js` (CommonJS)

3. **Test the build locally** (optional but recommended):
   ```bash
   npm link
   cd /path/to/test-project
   npm link dom-helpers-js
   ```

4. **Update version** (if needed):
   ```bash
   npm version patch  # 2.3.1 -> 2.3.2
   npm version minor  # 2.3.1 -> 2.4.0
   npm version major  # 2.3.1 -> 3.0.0
   ```

5. **Publish to npm**:
   ```bash
   npm publish
   ```

   **For scoped package** (if using @DOMHelpers-Js/dom-helpers-js):
   ```bash
   npm publish --access public
   ```

6. **Verify publication**:
   ```bash
   npm view dom-helpers-js
   ```
   Or visit: https://www.npmjs.com/package/dom-helpers-js

### Update Existing Package

```bash
# Make your changes
npm run build:prod
npm version patch  # or minor/major
npm publish
git push --follow-tags
```

---

## 🌐 Using jsDelivr CDN

jsDelivr automatically pulls from your **GitHub repository** (not npm). Once you push to GitHub, jsDelivr will serve your files.

### CDN Links

#### Latest Version (Auto-updates)
```html
<!-- UMD Bundle (Minified) - Recommended for production -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@latest/dist/dom-helpers.min.js"></script>

<!-- UMD Bundle (Unminified) - For development -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@latest/dist/dom-helpers.umd.js"></script>

<!-- ES Module -->
<script type="module">
  import { DOMHelpers, Elements, Selector } from 'https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@latest/dist/dom-helpers.esm.js';
</script>
```

#### Specific Version (Locked, recommended for production)
```html
<!-- Replace 2.3.1 with your version -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.min.js"></script>
```

#### NPM-based CDN (alternative, requires npm publish first)
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@latest/dist/dom-helpers.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.min.js"></script>
```

#### unpkg CDN (alternative)
```html
<script src="https://unpkg.com/dom-helpers-js@latest/dist/dom-helpers.min.js"></script>
<script src="https://unpkg.com/dom-helpers-js@2.3.1/dist/dom-helpers.min.js"></script>
```

---

## 📝 Usage Examples

### 📌 Via CDN (Browser)

```html
<!DOCTYPE html>
<html>
<head>
  <title>DOM Helpers CDN Example</title>
</head>
<body>
  <h1 id="title">Hello</h1>
  <div class="items">Item 1</div>
  <div class="items">Item 2</div>
  <button id="myBtn">Click Me</button>

  <!-- Load from CDN -->
  <script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.min.js"></script>
  
  <script>
    // Global variables are now available
    console.log(DOMHelpers); // Main namespace
    console.log(Elements);   // ID-based access
    console.log(Selector);   // Query selector
    console.log(Collections); // Class/tag access

    // Update element by ID
    Elements.title.update({
      textContent: 'Welcome!',
      style: { color: 'blue', fontSize: '32px' }
    });

    // Update all elements with class "items"
    Collections.ClassName.items.update({
      style: { padding: '10px', background: '#f0f0f0' }
    });

    // Query and update
    Selector.query('#myBtn').update({
      textContent: 'Clicked!',
      addEventListener: ['click', () => alert('Hello!')]
    });

    // Create element
    const newDiv = createElement('div', {
      textContent: 'Dynamic Content',
      style: { color: 'green' }
    });
    document.body.appendChild(newDiv);

    // Reactive state
    const state = ReactiveUtils.state({ count: 0 });
    Elements.myBtn.addEventListener('click', () => {
      state.count++;
      Elements.title.textContent = `Count: ${state.count}`;
    });
  </script>
</body>
</html>
```

### 📌 Via npm (Module Bundler)

#### Installation
```bash
npm install dom-helpers-js
```

#### ES Module Import
```javascript
import { DOMHelpers, Elements, Selector, createElement, ReactiveUtils } from 'dom-helpers-js';

// Update element
Elements.myButton.update({
  textContent: 'Click Me',
  style: { backgroundColor: '#007bff', color: 'white' }
});

// Query selector
const header = Selector.query('#header');
header.update({ textContent: 'Welcome!' });

// Create element
const div = createElement('div', {
  className: 'container',
  textContent: 'Hello World'
});

// Reactive state
const state = ReactiveUtils.state({ name: 'John' });
state.$watch('name', (newVal) => {
  console.log('Name changed:', newVal);
});
```

#### CommonJS (Node.js)
```javascript
const { DOMHelpers, Elements, Selector } = require('dom-helpers-js');

Elements.title.update({ textContent: 'Hello from Node!' });
```

#### TypeScript
```typescript
import { DOMHelpers, Elements, Selector } from 'dom-helpers-js';

// Update with type safety
Elements.title?.update({
  textContent: 'Typed Content',
  style: { color: 'red' }
});
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ 1. Forgetting to Build Before Publishing
```bash
# WRONG - Publishing without building
npm publish

# CORRECT
npm run build:prod
npm publish
```

### ❌ 2. Wrong Global Variable Names in Browser
```javascript
// WRONG
window.domHelpers  // undefined

// CORRECT
window.DOMHelpers
window.Elements
window.Selector
window.Collections
window.createElement
```

### ❌ 3. Using Wrong CDN Path
```html
<!-- WRONG -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers/dom-helpers.min.js"></script>

<!-- CORRECT -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@latest/dist/dom-helpers.min.js"></script>
```

### ❌ 4. Not Specifying Version in Production
```html
<!-- RISKY - May break on updates -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@latest/dist/dom-helpers.min.js"></script>

<!-- SAFE - Locked version -->
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.min.js"></script>
```

### ❌ 5. Mixing Module Systems
```javascript
// WRONG - Don't mix ESM and CommonJS
import { Elements } from 'dom-helpers-js';
const { Selector } = require('dom-helpers-js');

// CORRECT - Use one system
import { Elements, Selector } from 'dom-helpers-js';
```

### ❌ 6. Accessing DOM Before Load (CDN)
```html
<script src="https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@2.3.1/dist/dom-helpers.min.js"></script>
<script>
  // WRONG - DOM might not be ready
  Elements.title.update({ textContent: 'Hello' });
</script>

<!-- CORRECT -->
<script>
  document.addEventListener('DOMContentLoaded', () => {
    Elements.title.update({ textContent: 'Hello' });
  });
</script>
```

### ❌ 7. Forgetting to Push Git Tags
```bash
npm version patch
npm publish
# WRONG - Tags not on GitHub, jsDelivr won't update

# CORRECT
npm version patch
npm publish
git push --follow-tags  # Push version tags to GitHub
```

---

## 🔄 Complete Publishing Workflow

```bash
# 1. Make changes to src/
# 2. Build
npm run build:prod

# 3. Test locally (optional)
npm link
cd /path/to/test
npm link dom-helpers-js
# Test your changes

# 4. Commit changes
git add .
git commit -m "feat: add new feature"

# 5. Update version
npm version patch  # or minor/major

# 6. Publish to npm
npm publish

# 7. Push to GitHub (for jsDelivr)
git push origin main --follow-tags

# 8. Verify
# npm: https://www.npmjs.com/package/dom-helpers-js
# jsDelivr: https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@latest/
```

---

## 📊 Build Output Reference

After running `npm run build:prod`, you'll have:

```
dist/
├── dom-helpers.min.js        # UMD minified (CDN primary)
├── dom-helpers.min.js.map    # Source map
├── dom-helpers.umd.js        # UMD unminified
├── dom-helpers.umd.js.map    # Source map
├── dom-helpers.esm.js        # ES Module
├── dom-helpers.esm.js.map    # Source map
├── dom-helpers.esm.min.js    # ES Module minified
├── dom-helpers.esm.min.js.map # Source map
├── dom-helpers.cjs.js        # CommonJS
└── dom-helpers.cjs.js.map    # Source map
```

**File Sizes (approximate):**
- UMD Minified: ~25-35 KB (gzipped: ~8-12 KB)
- ESM Minified: ~24-34 KB (gzipped: ~7-11 KB)

---

## 🎯 Quick Reference

| Distribution | Command | Link |
|--------------|---------|------|
| npm | `npm install dom-helpers-js` | https://npmjs.com/package/dom-helpers-js |
| jsDelivr (GitHub) | `<script src="...">` | https://cdn.jsdelivr.net/gh/DOMHelpers-Js/dom-helpers@latest/ |
| jsDelivr (npm) | `<script src="...">` | https://cdn.jsdelivr.net/npm/dom-helpers-js@latest/ |
| unpkg | `<script src="...">` | https://unpkg.com/dom-helpers-js@latest/ |

**Global Variables (Browser):**
- `DOMHelpers` - Main namespace
- `Elements` - ID-based element access
- `Collections` - Class/tag-based collections
- `Selector` - Query selector utilities
- `createElement` - Enhanced createElement
- `ReactiveState` - Reactive state management
- `ReactiveUtils` - Reactive utilities

---

## 📞 Support

- GitHub Issues: https://github.com/DOMHelpers-Js/dom-helpers/issues
- npm Package: https://www.npmjs.com/package/dom-helpers-js
- License: MIT
