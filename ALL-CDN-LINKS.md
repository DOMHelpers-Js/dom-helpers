# 🌐 All CDN Links - Standalone Modules

## 🎯 5 Standalone Modules Available

| Module | Size (gzipped) | What It Includes | Requires Core? |
|--------|----------------|------------------|----------------|
| **Full Bundle** | 37 KB | Everything | No - standalone |
| **Core** | 9.7 KB | Elements, Collections, Selector | No - standalone |
| **Enhancers** | ~8 KB | Bulk updates, shortcuts | **YES - load core first!** |
| **Conditions** | ~8 KB | Conditional rendering | **YES - load core first!** |
| **Reactive** | ~11 KB | State management | **YES - load core first!** |

---

## 📦 CDN Links (jsDelivr - npm)

### 1. Full Bundle (Everything - Standalone)
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.min.js"></script>
```

### 2. Core Only (Standalone)
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
```

### 3. Enhancers Only (Requires Core)
```html
<!-- Load Core First! -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
<!-- Then Enhancers -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.enhancers.min.js"></script>
```

### 4. Conditions Only (Requires Core)
```html
<!-- Load Core First! -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
<!-- Then Conditions -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.conditions.min.js"></script>
```

### 5. Reactive Only (Requires Core)
```html
<!-- Load Core First! -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
<!-- Then Reactive -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.reactive.min.js"></script>
```

---

## 🎨 Module Combinations

### Core + Reactive (9.7 KB + 11 KB = ~21 KB)
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.reactive.min.js"></script>
```

### Core + Enhancers (9.7 KB + 8 KB = ~18 KB)
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.enhancers.min.js"></script>
```

### Core + Conditions (9.7 KB + 8 KB = ~18 KB)
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.conditions.min.js"></script>
```

### Core + All Modules (Maximum customization)
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.enhancers.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.conditions.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.reactive.min.js"></script>
<!-- Total: ~37 KB (same as full bundle) -->
```

---

## 📋 Quick Examples

### Example 1: Core Only
```html
<!DOCTYPE html>
<html>
<body>
  <h1 id="title">Hello</h1>
  
  <script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
  <script>
    Elements.title.update({
      textContent: 'Core Module!',
      style: { color: 'blue' }
    });
  </script>
</body>
</html>
```

### Example 2: Core + Reactive
```html
<!DOCTYPE html>
<html>
<body>
  <h1 id="counter">Count: 0</h1>
  <button id="btn">Click</button>
  
  <!-- Load Core -->
  <script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
  <!-- Load Reactive -->
  <script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.reactive.min.js"></script>
  
  <script>
    const state = ReactiveUtils.state({ count: 0 });
    Elements.btn.addEventListener('click', () => {
      state.count++;
      Elements.counter.textContent = `Count: ${state.count}`;
    });
  </script>
</body>
</html>
```

### Example 3: Core + Enhancers
```html
<!DOCTYPE html>
<html>
<body>
  <h1 id="title">Title</h1>
  <p id="desc">Description</p>
  
  <!-- Load Core -->
  <script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
  <!-- Load Enhancers -->
  <script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.enhancers.min.js"></script>
  
  <script>
    // Bulk textContent update
    Elements.textContent({
      title: 'New Title',
      desc: 'New Description'
    });
    
    // Bulk style update
    Elements.style({
      title: { color: 'blue', fontSize: '32px' },
      desc: { color: 'gray' }
    });
  </script>
</body>
</html>
```

---

## 🔍 What Each Module Provides

### Core Module
- `Elements` - ID-based access
- `Collections` - Class/tag/name collections
- `Selector` - Query utilities
- `createElement` - Enhanced createElement
- `DOMHelpers` - Main namespace

### Enhancers Module (Requires Core)
- `Elements.textContent()` - Bulk textContent updates
- `Elements.style()` - Bulk style updates
- `Elements.classes()` - Bulk classList updates
- `Elements.attrs()` - Bulk attributes
- Index-based collection updates
- Global query shortcuts

### Conditions Module (Requires Core)
- Conditional rendering
- State-based DOM updates
- Matcher/handler patterns
- Batch state updates

### Reactive Module (Requires Core)
- `ReactiveUtils` - Reactive state
- `ReactiveState` - State helpers
- Forms, async state, watchers
- Computed properties
- Two-way data binding

---

## ⚠️ Important Rules

1. **Core is required** for Enhancers, Conditions, and Reactive
2. **Load Core first**, then additional modules
3. **Order matters** - Core must load before other modules
4. **Full bundle** includes everything - use if you need all features

---

## 🌍 Alternative CDNs

### unpkg
```html
<!-- Full -->
<script src="https://unpkg.com/dom-helpers-js@2.3.1/dist/dom-helpers.min.js"></script>

<!-- Core -->
<script src="https://unpkg.com/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>

<!-- Enhancers (after core) -->
<script src="https://unpkg.com/dom-helpers-js@2.3.1/dist/dom-helpers.enhancers.min.js"></script>

<!-- Conditions (after core) -->
<script src="https://unpkg.com/dom-helpers-js@2.3.1/dist/dom-helpers.conditions.min.js"></script>

<!-- Reactive (after core) -->
<script src="https://unpkg.com/dom-helpers-js@2.3.1/dist/dom-helpers.reactive.min.js"></script>
```

---

## 📊 Size Comparison

| Combination | Total Size (gzipped) |
|-------------|---------------------|
| Core only | 9.7 KB |
| Core + Reactive | ~21 KB |
| Core + Enhancers | ~18 KB |
| Core + Conditions | ~18 KB |
| Core + Reactive + Enhancers | ~29 KB |
| Full Bundle | 37 KB |

---

**Load core first, then add what you need!** 🚀
