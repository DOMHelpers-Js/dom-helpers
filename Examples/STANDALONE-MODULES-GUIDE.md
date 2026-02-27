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
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.enhancers.min.js"></script>
```

### 4️⃣ Conditions (~8 KB)
**⚠️ Requires Core to be loaded first!**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.conditions.min.js"></script>
```

### 5️⃣ Reactive (~11 KB)
**⚠️ 1. This module works independently and does not require the Core.**
**⚠️ 2. When used together with Core, Enhancers, and Conditions, it gains access to extended capabilities and advanced features.**
```html
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

1. **Core is Foundation** - Enhancers, Conditions depend on Core module
2. **Load Order Matters** - Always load Core before other modules
3. **Full Bundle Alternative** - If you need everything, just use the full bundle
4. **No Duplication** - Don't load both full bundle and individual modules
5. **Reactive module** - Can be used independently or combined with other modules in the following order:  
`core → enhancers → conditions → reactive`

---

## ❌ Common Mistakes

### ❌ Wrong: Loading Reactive without Core
```html
<!-- This will fail! -->
<script src=".../dom-helpers.enhancers.min.js"></script>
```

### ✅ Correct: Load Core First
```html
<script src=".../dom-helpers.core.min.js"></script>
<script src=".../dom-helpers.enhancers.min.js"></script>
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
<script src=".../dom-helpers.enhancers.min.js"></script>
<script src=".../dom-helpers.conditions.min.js"></script>
<script src=".../dom-helpers.reactive.min.js"></script>
```


### ❌ Wrong: Loading order is not correct
```html
<!-- This will not work! -->
<script src=".../dom-helpers.core.min.js"></script> 
<script src=".../dom-helpers.reactive.min.js"></script>
<script src=".../dom-helpers.conditions.min.js"></script>
<script src=".../dom-helpers.enhancers.min.js"></script>
```

### ✅ Loading Rules
Modules must be loaded in the following order:
1. **core**
2. **enhancers**
3. **conditions**
4. **reactive**

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

**Load core first, then add what you need!** 🚀
