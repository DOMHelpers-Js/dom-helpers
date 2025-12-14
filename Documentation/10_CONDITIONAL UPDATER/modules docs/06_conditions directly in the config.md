# 🎯 Yes! You Can Skip Matchers Entirely

You're absolutely right to question this. Let me show you **two powerful alternatives** that let you write conditions **directly in the config** without needing custom matchers at all.

---

## 🔥 **Method 1: Function-Based Conditions (Dynamic Conditions)**

You can pass a **function that returns the conditions object**, and that function runs **on every evaluation**. This means you can compute conditions dynamically!

### **Example: Weekday Detection (No Custom Matcher)**

```javascript
// ❌ OLD WAY: Custom matcher
registerMatcher('weekday', {
  test: (condition) => condition === 'weekday',
  match: (value) => {
    const day = new Date(value).getDay();
    return day >= 1 && day <= 5;
  }
});

Conditions.whenState(
  () => currentDate,
  {
    'weekday': { textContent: '💼 Workday' },
    'default': { textContent: '🎉 Weekend!' }
  },
  '#badge'
);
```

```javascript
// ✅ NEW WAY: No matcher needed!
Conditions.whenState(
  () => currentDate,
  () => {
    const day = new Date(currentDate()).getDay();
    const isWeekday = day >= 1 && day <= 5;
    
    // Return dynamic conditions based on logic
    return {
      'true': isWeekday 
        ? { textContent: '💼 Workday' }
        : { textContent: '🎉 Weekend!' }
    };
  },
  '#badge'
);
```

Or even simpler:

```javascript
Conditions.whenState(
  () => {
    const day = new Date().getDay();
    return day >= 1 && day <= 5; // Returns boolean
  },
  {
    'true': { textContent: '💼 Workday' },
    'false': { textContent: '🎉 Weekend!' }
  },
  '#badge'
);
```

---

## 🎯 **Method 2: Computed Value Function**

Instead of custom matchers, compute the **value itself** to return something matchable by built-in matchers.

### **Example: Date Range Matching**

```javascript
// ❌ OLD WAY: Custom matcher for date ranges
registerMatcher('dateRange', {
  test: (condition) => condition.startsWith('range:'),
  match: (value, condition) => {
    const [start, end] = condition.slice(6).split(',');
    const date = new Date(value);
    return date >= new Date(start) && date <= new Date(end);
  }
});
```

```javascript
// ✅ NEW WAY: Compute the category directly
Conditions.whenState(
  () => {
    const now = new Date();
    const month = now.getMonth();
    
    // Return a category instead of raw date
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  },
  {
    'spring': { textContent: '🌸 Spring', style: { color: 'pink' } },
    'summer': { textContent: '☀️ Summer', style: { color: 'yellow' } },
    'fall': { textContent: '🍂 Fall', style: { color: 'orange' } },
    'winter': { textContent: '❄️ Winter', style: { color: 'blue' } }
  },
  '#season'
);
```

---

## 💡 **Method 3: Use Built-in Regex Matcher**

Conditions.js already has a **regex matcher** (`/pattern/flags`). You can use it for complex string matching without custom matchers.

### **Example: Email Validation**

```javascript
// ❌ OLD WAY: Custom matcher
registerMatcher('validEmail', {
  test: (condition) => condition === 'validEmail',
  match: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
});
```

```javascript
// ✅ NEW WAY: Use built-in regex matcher
Conditions.whenState(
  () => emailInput.value,
  {
    '/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/': {
      style: { borderColor: 'green' },
      textContent: '✓ Valid'
    },
    'default': {
      style: { borderColor: 'red' },
      textContent: '✗ Invalid'
    }
  },
  '#email-status'
);
```

---

## 🎨 **Method 4: Multi-Condition with Computed Boolean**

For complex logic with multiple checks, compute a **composite boolean**.

### **Example: Form Validation**

```javascript
// ❌ OLD WAY: Multiple custom matchers
registerMatcher('validPassword', { ... });
registerMatcher('passwordsMatch', { ... });
registerMatcher('termsAccepted', { ... });
```

```javascript
// ✅ NEW WAY: Compute validation state
Conditions.whenState(
  () => {
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    const terms = termsCheckbox.checked;
    
    // Compute all validation rules
    const validLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const passwordsMatch = password === confirm;
    const termsAccepted = terms;
    
    // Return composite state
    if (!validLength) return 'too-short';
    if (!hasNumber) return 'needs-number';
    if (!hasUpper) return 'needs-uppercase';
    if (!passwordsMatch) return 'no-match';
    if (!termsAccepted) return 'no-terms';
    return 'valid';
  },
  {
    'too-short': { 
      textContent: '❌ Password must be 8+ characters',
      style: { color: 'red' }
    },
    'needs-number': { 
      textContent: '❌ Password needs a number',
      style: { color: 'red' }
    },
    'needs-uppercase': { 
      textContent: '❌ Password needs uppercase letter',
      style: { color: 'red' }
    },
    'no-match': { 
      textContent: '❌ Passwords don\'t match',
      style: { color: 'red' }
    },
    'no-terms': { 
      textContent: '❌ Accept terms to continue',
      style: { color: 'red' }
    },
    'valid': { 
      textContent: '✓ All good!',
      style: { color: 'green' }
    }
  },
  '#validation-message'
);
```

---

## 🚀 **Method 5: Use Numeric Ranges (Built-in)**

Conditions.js already supports numeric comparisons like `>=`, `<=`, `>`, `<`, and ranges like `10-20`.

### **Example: Score-Based Badges**

```javascript
// ❌ OLD WAY: Custom matcher for score tiers
registerMatcher('scoreTier', { ... });
```

```javascript
// ✅ NEW WAY: Use built-in numeric matchers
Conditions.whenState(
  () => playerScore,
  {
    '>=1000': { 
      textContent: '🏆 Legend',
      style: { color: 'gold', fontSize: '24px' }
    },
    '>=500': { 
      textContent: '⭐ Master',
      style: { color: 'silver', fontSize: '20px' }
    },
    '>=100': { 
      textContent: '✨ Expert',
      style: { color: 'bronze', fontSize: '18px' }
    },
    '>=0': { 
      textContent: '🔰 Beginner',
      style: { color: 'gray', fontSize: '16px' }
    }
  },
  '#rank-badge'
);
```

---

## 🎯 **Method 6: String Pattern Matching (Built-in)**

Use `includes:`, `startsWith:`, `endsWith:` for string matching without custom matchers.

### **Example: File Type Detection**

```javascript
// ❌ OLD WAY: Custom matcher
registerMatcher('imageFile', {
  test: (condition) => condition === 'imageFile',
  match: (value) => /\.(jpg|png|gif|webp)$/i.test(value)
});
```

```javascript
// ✅ NEW WAY: Use built-in string matchers
Conditions.whenState(
  () => fileName,
  {
    'endsWith:.jpg': { textContent: '📷 JPEG Image' },
    'endsWith:.png': { textContent: '🖼️ PNG Image' },
    'endsWith:.gif': { textContent: '🎬 GIF Animation' },
    'endsWith:.pdf': { textContent: '📄 PDF Document' },
    'default': { textContent: '📁 File' }
  },
  '#file-icon'
);
```

---

## 📊 **Comparison: When to Use What**

| **Scenario** | **Custom Matcher** | **Direct Solution** |
|-------------|-------------------|---------------------|
| **Simple boolean logic** | ❌ Overkill | ✅ Compute in value function |
| **Reusable across codebase** | ✅ DRY principle | ❌ Repeated logic |
| **Complex domain logic** | ✅ Encapsulation | ⚠️ Can get messy |
| **One-off condition** | ❌ Unnecessary | ✅ Keep it inline |
| **Built-in matcher works** | ❌ Don't reinvent | ✅ Use what's there |
| **Team shared pattern** | ✅ Standardization | ❌ Less consistency |

---

## 🎪 **Real-World Example: E-commerce Cart**

Let's see both approaches side-by-side:

### **Without Custom Matchers (Direct Approach)**

```javascript
// Compute everything in value function
Conditions.whenState(
  () => {
    const total = cart.total;
    const itemCount = cart.items.length;
    const hasPromo = cart.promoCode !== null;
    
    // Complex business logic computed here
    if (total === 0) return 'empty';
    if (total < 25) return 'below-minimum';
    if (total >= 25 && total < 50) return 'standard';
    if (total >= 50 && total < 100) return 'free-shipping';
    if (total >= 100 && hasPromo) return 'vip-promo';
    if (total >= 100) return 'vip';
    
    return 'unknown';
  },
  {
    'empty': {
      textContent: '🛒 Your cart is empty',
      style: { color: 'gray' }
    },
    'below-minimum': {
      textContent: `📦 Add $${25 - cart.total} for free shipping`,
      style: { color: 'orange' }
    },
    'standard': {
      textContent: '📦 Standard shipping applies',
      style: { color: 'blue' }
    },
    'free-shipping': {
      textContent: '🎉 Free shipping unlocked!',
      style: { color: 'green' }
    },
    'vip-promo': {
      textContent: '⭐ VIP discount + Free shipping!',
      style: { color: 'gold', fontWeight: 'bold' }
    },
    'vip': {
      textContent: '👑 VIP Member - Free shipping',
      style: { color: 'purple', fontWeight: 'bold' }
    }
  },
  '#cart-status'
);
```

### **With Custom Matchers (If Reused Everywhere)**

```javascript
// Only makes sense if this logic is used in 10+ places
registerMatcher('cartTier', {
  test: (condition) => condition.startsWith('tier:'),
  match: (cart, condition) => {
    const tier = condition.slice(5);
    const total = cart.total;
    const hasPromo = cart.promoCode !== null;
    
    switch(tier) {
      case 'empty': return total === 0;
      case 'below-minimum': return total > 0 && total < 25;
      case 'standard': return total >= 25 && total < 50;
      case 'free-shipping': return total >= 50 && total < 100;
      case 'vip-promo': return total >= 100 && hasPromo;
      case 'vip': return total >= 100;
      default: return false;
    }
  }
});

// Then everywhere in your app:
Conditions.whenState(
  () => cart,
  {
    'tier:empty': { /* config */ },
    'tier:below-minimum': { /* config */ },
    'tier:vip': { /* config */ }
  },
  '#cart-status'
);
```

---

## ✅ **The Verdict**

### **Use Custom Matchers When:**
- ✅ Logic is **reused across 5+ places** in your codebase
- ✅ You want **team-wide standardization** (e.g., "everyone uses `validEmail`")
- ✅ Complex domain logic needs **encapsulation** (e.g., `eligibleForLoan`)
- ✅ Building a **library/framework** for others
- ✅ Pattern is **stable and unlikely to change**

### **Skip Matchers When:**
- ✅ It's a **one-off condition** used in one place
- ✅ Built-in matchers **already cover it** (`>=`, regex, `includes:`)
- ✅ Logic is **simple enough** to compute in value function
- ✅ Requirements **change frequently** (easier to update inline)
- ✅ You're **prototyping** or in early development

---

## 🎯 **My Recommendation**

**Start without custom matchers.** If you find yourself copying the same logic 3+ times, *then* extract it into a custom matcher. This keeps your code simple and prevents premature abstraction.

```javascript
// Start here (inline logic)
Conditions.whenState(
  () => {
    const day = new Date().getDay();
    return day >= 1 && day <= 5;
  },
  {
    'true': { textContent: 'Workday' },
    'false': { textContent: 'Weekend' }
  },
  '#badge'
);

// Only after you use this pattern 3+ times in different files:
registerMatcher('weekday', { ... });
```

**The beauty of Conditions.js**: You can choose your level of abstraction based on your needs! 🎨
