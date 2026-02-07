# 🧩 Standalone Modules Guide

## ✅ 5 Independent Modules

Your library is now split into **5 standalone modules** that users can mix and match!

### 1️⃣ Full Bundle (37 KB)
**Everything included - No dependencies**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.min.js"></script>
```

### 2️⃣ Core (9.7 KB) 
**Standalone - No dependencies**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
```

### 3️⃣ Enhancers (~8 KB)
**⚠️ Requires Core to be loaded first!**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.enhancers.min.js"></script>
```

### 4️⃣ Conditions (~8 KB)
**⚠️ Requires Core to be loaded first!**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.conditions.min.js"></script>
```

### 5️⃣ Reactive (~11 KB)
**⚠️ Requires Core to be loaded first!**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.reactive.min.js"></script>
```

---

## 🎨 Common Combinations

### Minimal Setup (9.7 KB)
Just basic DOM manipulation
```html
<script src=".../dom-helpers.core.min.js"></script>
```

### With State Management (21 KB)
Core + reactive state
```html
<script src=".../dom-helpers.core.min.js"></script>
<script src=".../dom-helpers.reactive.min.js"></script>
```

### With Bulk Updates (18 KB)
Core + enhancers for bulk operations
```html
<script src=".../dom-helpers.core.min.js"></script>
<script src=".../dom-helpers.enhancers.min.js"></script>
```

### Kitchen Sink (37 KB)
Everything! (same as full bundle)
```html
<script src=".../dom-helpers.core.min.js"></script>
<script src=".../dom-helpers.enhancers.min.js"></script>
<script src=".../dom-helpers.conditions.min.js"></script>
<script src=".../dom-helpers.reactive.min.js"></script>
```

---

## ⚠️ Critical Rules

1. **Core is Foundation** - Enhancers, Conditions, and Reactive all depend on Core
2. **Load Order Matters** - Always load Core before other modules
3. **Full Bundle Alternative** - If you need everything, just use the full bundle
4. **No Duplication** - Don't load both full bundle and individual modules

---

## ❌ Common Mistakes

### ❌ Wrong: Loading Reactive without Core
```html
<!-- This will fail! -->
<script src=".../dom-helpers.reactive.min.js"></script>
```

### ✅ Correct: Load Core First
```html
<script src=".../dom-helpers.core.min.js"></script>
<script src=".../dom-helpers.reactive.min.js"></script>
```

### ❌ Wrong: Mixing Full Bundle with Modules
```html
<!-- Wasteful duplication! -->
<script src=".../dom-helpers.min.js"></script>
<script src=".../dom-helpers.reactive.min.js"></script>
```

### ✅ Correct: Use One Approach
```html
<!-- Either this -->
<script src=".../dom-helpers.min.js"></script>

<!-- OR this -->
<script src=".../dom-helpers.core.min.js"></script>
<script src=".../dom-helpers.reactive.min.js"></script>
```

---

## 📊 Size Optimizer

| Your Needs | Load These | Total Size |
|------------|------------|------------|
| Basic DOM | Core | 9.7 KB |
| + State | Core + Reactive | ~21 KB |
| + Bulk Ops | Core + Enhancers | ~18 KB |
| + Conditionals | Core + Conditions | ~18 KB |
| Everything | Full Bundle | 37 KB |

---

## 🎯 Decision Tree

**Do you need reactive state management?**
- Yes → Load Core + Reactive
- No → Continue...

**Do you need bulk update methods?**
- Yes → Load Core + Enhancers
- No → Continue...

**Do you need conditional rendering?**
- Yes → Load Core + Conditions
- No → Load Core only

**Need everything?**
- Just use Full Bundle (dom-helpers.min.js)

---

## 🧪 Test Files

We've created test files to verify module combinations:
- `test-core-reactive.html` - Tests Core + Reactive
- `test-core-enhancers.html` - Tests Core + Enhancers
- `test-npm-cdn.html` - Tests full bundle
- `test-local.html` - Tests local build

---

**Remember: Core first, then add what you need!** 🚀
