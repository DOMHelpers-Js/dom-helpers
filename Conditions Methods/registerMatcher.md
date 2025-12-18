# Understanding `registerMatcher()` - A Beginner's Guide

## What is `registerMatcher()`?

`registerMatcher()` is a method for **creating custom condition matchers** that extend the Conditions system. It lets you define your own condition types beyond the built-in ones (boolean, string, regex, numeric, etc.).

Think of it as **adding new vocabulary** to the condition language:
1. You define what a condition looks like (test)
2. You define how to match it against values (match)
3. The system uses it automatically in all condition methods

It's like teaching the system a **new way to understand conditions** - expanding its capabilities!

---

## Why Does `registerMatcher()` Exist?

### The Problem: Built-In Matchers Don't Cover Everything

The Conditions system comes with many matchers (boolean, string, regex, numeric ranges), but sometimes you need **domain-specific conditions**:

```javascript
// Want to check if a date is a weekday? ❌ No built-in matcher
Conditions.whenState(
  () => currentDate,
  {
    'weekday': { /* ... */ },     // How to match this?
    'weekend': { /* ... */ }      // Or this?
  },
  '#calendar'
);

// Want to check credit card types? ❌ No built-in matcher
Conditions.whenState(
  () => cardNumber,
  {
    'visa': { /* ... */ },         // How to detect Visa?
    'mastercard': { /* ... */ },   // Or MasterCard?
    'amex': { /* ... */ }          // Or Amex?
  },
  '#card-icon'
);

// Want to check user permissions? ❌ No built-in matcher
Conditions.whenState(
  () => user,
  {
    'has-admin': { /* ... */ },    // Check if user has admin?
    'has-write': { /* ... */ }     // Or write permissions?
  },
  '#actions'
);
```

**Problems:**
- Domain-specific logic doesn't fit built-in matchers
- Would need complex workarounds
- Code becomes unclear and verbose
- Can't reuse custom logic across conditions

### The Solution: Create Custom Matchers

`registerMatcher()` lets you add new condition types:

```javascript
// Register weekday matcher ONCE
Conditions.registerMatcher('weekday', {
  test: (condition) => condition === 'weekday',
  match: (value) => {
    const day = new Date(value).getDay();
    return day >= 1 && day <= 5;  // Monday-Friday
  }
});

// Now use it EVERYWHERE!
Conditions.whenState(
  () => currentDate,
  {
    'weekday': {
      style: { backgroundColor: '#e3f2fd' },
      textContent: 'Workday'
    },
    'weekend': {
      style: { backgroundColor: '#fff3e0' },
      textContent: 'Weekend!'
    }
  },
  '#calendar'
);
```

**Benefits:**
- ✅ Define once, use everywhere
- ✅ Clean, declarative conditions
- ✅ Reusable across your application
- ✅ Extends the system naturally
- ✅ Easy to test and maintain

---

## How Does It Work?

### The Concept

A matcher has **two functions**:

```
Condition String → test() → Should this matcher handle it?
                    ↓
                   YES
                    ↓
Value + Condition → match() → Does the value match?
                    ↓
                TRUE/FALSE
```

**Step by Step:**

1. **test(condition)**: "Is this condition string something I can handle?"
   - Returns `true` if this matcher should process the condition
   - Returns `false` to let other matchers try

2. **match(value, condition)**: "Does this value match this condition?"
   - Returns `true` if value satisfies the condition
   - Returns `false` if it doesn't

### Visual Example

```javascript
// Register a simple matcher
Conditions.registerMatcher('even', {
  // test: Should I handle this condition?
  test: (condition) => condition === 'even',
  
  // match: Does the value match?
  match: (value) => typeof value === 'number' && value % 2 === 0
});

// When you use it:
Conditions.whenState(
  () => count,
  {
    'even': { /* config */ }  // test('even') → true, so this matcher handles it
  },
  selector
);

// How it's evaluated:
count = 4
→ test('even') → true (this matcher handles 'even')
→ match(4, 'even') → true (4 is even)
→ Apply config!
```

---

## Basic Usage

### Syntax

```javascript
Conditions.registerMatcher(name, matcher)
```

**Parameters:**

1. **`name`** (String) - Unique identifier for this matcher
   - Used for internal tracking
   - Should be descriptive (e.g., 'weekday', 'even', 'creditCard')

2. **`matcher`** (Object) - Matcher definition
   - `test(condition, value?)` - Function returning boolean
     - Receives the condition string
     - Optional: receives the value being tested
     - Returns `true` if this matcher should handle the condition
   
   - `match(value, condition)` - Function returning boolean
     - Receives the value to test
     - Receives the condition string
     - Returns `true` if value matches the condition

**Returns:**
- `Conditions` object (chainable)

---

## Practical Examples

### Example 1: Even/Odd Matcher

**The Problem:**
```javascript
// Without custom matcher - verbose ❌
Conditions.whenState(
  () => count,
  {
    '0': { textContent: 'Zero (even)' },
    '2': { textContent: 'Two (even)' },
    '4': { textContent: 'Four (even)' },
    '1': { textContent: 'One (odd)' },
    '3': { textContent: 'Three (odd)' },
    // Can't generalize!
  },
  '#number'
);
```

**The Solution:**
```javascript
// Register even matcher
Conditions.registerMatcher('even', {
  test: (condition) => condition === 'even',
  match: (value) => typeof value === 'number' && value % 2 === 0
});

// Register odd matcher
Conditions.registerMatcher('odd', {
  test: (condition) => condition === 'odd',
  match: (value) => typeof value === 'number' && value % 2 !== 0
});

// Now use them cleanly! ✅
const state = Reactive.state({ count: 0 });

Conditions.whenState(
  () => state.count,
  {
    'even': {
      textContent: `${state.count} is even`,
      style: { backgroundColor: '#e3f2fd', color: '#1976D2' }
    },
    'odd': {
      textContent: `${state.count} is odd`,
      style: { backgroundColor: '#fff3e0', color: '#F57C00' }
    }
  },
  '#number'
);

// Test it
state.count = 2;  // Shows "2 is even" in blue
state.count = 7;  // Shows "7 is odd" in orange
```

**What happens:**
1. Matchers registered once at startup
2. When `count` is 2:
   - `even.test('even')` → `true` (even matcher handles this)
   - `even.match(2, 'even')` → `true` (2 is even)
   - Applies even configuration
3. When `count` is 7:
   - `odd.test('odd')` → `true` (odd matcher handles this)
   - `odd.match(7, 'odd')` → `true` (7 is odd)
   - Applies odd configuration

---

### Example 2: Weekday/Weekend Matcher

**JavaScript:**
```javascript
// Register weekday matcher
Conditions.registerMatcher('weekday', {
  test: (condition) => condition === 'weekday',
  match: (value) => {
    const day = new Date(value).getDay();
    return day >= 1 && day <= 5;  // Monday = 1, Friday = 5
  }
});

// Register weekend matcher
Conditions.registerMatcher('weekend', {
  test: (condition) => condition === 'weekend',
  match: (value) => {
    const day = new Date(value).getDay();
    return day === 0 || day === 6;  // Sunday = 0, Saturday = 6
  }
});

// Use in application
const app = Reactive.state({
  currentDate: new Date()
});

Conditions.whenState(
  () => app.currentDate,
  {
    'weekday': {
      style: {
        backgroundColor: '#e3f2fd',
        color: '#1976D2',
        padding: '20px'
      },
      innerHTML: `
        <h2>Workday</h2>
        <p>Time to be productive! 💼</p>
      `
    },
    'weekend': {
      style: {
        backgroundColor: '#fff3e0',
        color: '#F57C00',
        padding: '20px'
      },
      innerHTML: `
        <h2>Weekend!</h2>
        <p>Time to relax! 🎉</p>
      `
    }
  },
  '#day-status'
);

// Update to tomorrow
setInterval(() => {
  app.currentDate = new Date(app.currentDate.getTime() + 24 * 60 * 60 * 1000);
}, 5000);
```

**What happens:**
1. Weekday and weekend matchers registered
2. Current date is checked
3. Appropriate styling and message displayed
4. Updates automatically when date changes!

---

### Example 3: Credit Card Type Matcher

**JavaScript:**
```javascript
// Register credit card matchers
Conditions.registerMatcher('visa', {
  test: (condition) => condition === 'visa',
  match: (value) => /^4[0-9]{12}(?:[0-9]{3})?$/.test(value)
});

Conditions.registerMatcher('mastercard', {
  test: (condition) => condition === 'mastercard',
  match: (value) => /^5[1-5][0-9]{14}$/.test(value)
});

Conditions.registerMatcher('amex', {
  test: (condition) => condition === 'amex',
  match: (value) => /^3[47][0-9]{13}$/.test(value)
});

// Use in checkout form
const form = Reactive.state({
  cardNumber: ''
});

// Watch card number input
document.getElementById('card-number').oninput = (e) => {
  form.cardNumber = e.target.value.replace(/\s/g, '');
};

// Update card icon based on type
Conditions.whenState(
  () => form.cardNumber,
  {
    'visa': {
      innerHTML: '💳 Visa',
      style: {
        backgroundColor: '#1A1F71',
        color: 'white'
      }
    },
    'mastercard': {
      innerHTML: '💳 MasterCard',
      style: {
        backgroundColor: '#EB001B',
        color: 'white'
      }
    },
    'amex': {
      innerHTML: '💳 American Express',
      style: {
        backgroundColor: '#006FCF',
        color: 'white'
      }
    },
    'default': {
      innerHTML: '💳 Card Type',
      style: {
        backgroundColor: '#757575',
        color: 'white'
      }
    }
  },
  '#card-type'
);
```

**What happens:**
1. Three card matchers registered
2. As user types card number, it's checked against each matcher
3. Icon and styling update automatically based on detected card type
4. Falls back to default if no match

---

### Example 4: User Permission Matcher

**JavaScript:**
```javascript
// Register permission matchers
Conditions.registerMatcher('has-permission', {
  test: (condition) => condition.startsWith('has-permission:'),
  match: (value, condition) => {
    const permission = condition.split(':')[1];
    return value && Array.isArray(value.permissions) && 
           value.permissions.includes(permission);
  }
});

Conditions.registerMatcher('has-role', {
  test: (condition) => condition.startsWith('has-role:'),
  match: (value, condition) => {
    const role = condition.split(':')[1];
    return value && value.role === role;
  }
});

// Use in admin panel
const session = Reactive.state({
  user: {
    name: 'John Doe',
    role: 'editor',
    permissions: ['read', 'write', 'publish']
  }
});

// Admin panel visibility
Conditions.whenState(
  () => session.user,
  {
    'has-role:admin': {
      style: { display: 'block' }
    },
    'default': {
      style: { display: 'none' }
    }
  },
  '#admin-panel'
);

// Publish button
Conditions.whenState(
  () => session.user,
  {
    'has-permission:publish': {
      disabled: false,
      style: {
        opacity: '1',
        cursor: 'pointer'
      },
      textContent: '✓ Publish'
    },
    'default': {
      disabled: true,
      style: {
        opacity: '0.5',
        cursor: 'not-allowed'
      },
      textContent: '✗ No Permission'
    }
  },
  '#publish-btn'
);

// Delete button
Conditions.whenState(
  () => session.user,
  {
    'has-permission:delete': {
      disabled: false,
      style: { display: 'inline-block' }
    },
    'default': {
      style: { display: 'none' }
    }
  },
  '#delete-btn'
);
```

**What happens:**
1. Permission and role matchers registered
2. User object contains role and permissions array
3. UI elements show/hide and enable/disable based on permissions
4. Updates automatically when user permissions change!

---

### Example 5: Price Range Matcher

**JavaScript:**
```javascript
// Register price range matcher
Conditions.registerMatcher('price-range', {
  test: (condition) => condition.startsWith('price:'),
  match: (value, condition) => {
    const range = condition.split(':')[1];  // e.g., "0-50"
    const [min, max] = range.split('-').map(Number);
    return value >= min && value <= max;
  }
});

// Use in product filtering
const filters = Reactive.state({
  selectedPriceRange: 'price:0-50'
});

Conditions.whenState(
  () => filters.selectedPriceRange,
  {
    'price:0-50': {
      classList: { add: 'budget-range', remove: ['mid-range', 'premium-range'] },
      innerHTML: '💰 Budget: $0-$50'
    },
    'price:51-200': {
      classList: { add: 'mid-range', remove: ['budget-range', 'premium-range'] },
      innerHTML: '💰💰 Mid-Range: $51-$200'
    },
    'price:201-1000': {
      classList: { add: 'premium-range', remove: ['budget-range', 'mid-range'] },
      innerHTML: '💰💰💰 Premium: $201-$1000'
    }
  },
  '#price-filter-display'
);

// Filter products
const products = [
  { name: 'Widget A', price: 25 },
  { name: 'Widget B', price: 75 },
  { name: 'Widget C', price: 350 }
];

products.forEach((product, index) => {
  Conditions.whenState(
    () => filters.selectedPriceRange,
    {
      [`price:${Math.floor(product.price / 50) * 50}-${Math.floor(product.price / 50) * 50 + 49}`]: {
        style: { display: 'block' }
      },
      'default': {
        style: { display: 'none' }
      }
    },
    `#product-${index}`
  );
});
```

---

## Advanced Matcher Patterns

### Pattern 1: Prefix Matchers

Match conditions that start with a specific prefix:

```javascript
Conditions.registerMatcher('min', {
  test: (condition) => condition.startsWith('min:'),
  match: (value, condition) => {
    const min = Number(condition.split(':')[1]);
    return value >= min;
  }
});

Conditions.registerMatcher('max', {
  test: (condition) => condition.startsWith('max:'),
  match: (value, condition) => {
    const max = Number(condition.split(':')[1]);
    return value <= max;
  }
});

// Use them
Conditions.whenState(
  () => state.value,
  {
    'min:10': { /* value >= 10 */ },
    'max:100': { /* value <= 100 */ }
  },
  selector
);
```

### Pattern 2: Complex Object Matchers

Match against object properties:

```javascript
Conditions.registerMatcher('user-status', {
  test: (condition) => condition.startsWith('status:'),
  match: (value, condition) => {
    const status = condition.split(':')[1];
    return value && value.status === status && value.verified === true;
  }
});

// Use it
Conditions.whenState(
  () => currentUser,
  {
    'status:active': { /* active + verified */ },
    'status:pending': { /* pending + verified */ }
  },
  selector
);
```

### Pattern 3: Multi-Value Matchers

Match against arrays or multiple values:

```javascript
Conditions.registerMatcher('includes', {
  test: (condition) => condition.startsWith('includes:'),
  match: (value, condition) => {
    const search = condition.split(':')[1];
    if (Array.isArray(value)) {
      return value.includes(search);
    }
    if (typeof value === 'string') {
      return value.includes(search);
    }
    return false;
  }
});

// Use it
Conditions.whenState(
  () => state.tags,
  {
    'includes:important': { /* array includes 'important' */ },
    'includes:urgent': { /* array includes 'urgent' */ }
  },
  selector
);
```

### Pattern 4: Using Value in test()

Sometimes you need the value to decide if matcher applies:

```javascript
Conditions.registerMatcher('divisible-by', {
  test: (condition, value) => {
    // Only handle if value is a number and condition format matches
    return typeof value === 'number' && condition.startsWith('divisible:');
  },
  match: (value, condition) => {
    const divisor = Number(condition.split(':')[1]);
    return value % divisor === 0;
  }
});
```

---

## Helper Functions

### `createSimpleMatcher()` - Quick Matcher Creation

For simple equality matchers:

```javascript
// Instead of:
Conditions.registerMatcher('premium', {
  test: (condition) => condition === 'premium',
  match: (value) => value.tier === 'premium'
});

// Use shorthand:
createSimpleMatcher('premium', 'premium', (value) => value.tier === 'premium');
```

### Batch Registration

Register multiple matchers at once:

```javascript
registerMatchers({
  'even': {
    test: (c) => c === 'even',
    match: (v) => v % 2 === 0
  },
  'odd': {
    test: (c) => c === 'odd',
    match: (v) => v % 2 !== 0
  },
  'positive': {
    test: (c) => c === 'positive',
    match: (v) => v > 0
  }
});
```

---

## Testing Your Matchers

### Manual Testing

```javascript
// Register your matcher
Conditions.registerMatcher('weekday', weekdayMatcher);

// Test it manually
console.log(Conditions.matchesCondition(new Date('2024-12-04'), 'weekday'));
// true if Wednesday

console.log(Conditions.matchesCondition(new Date('2024-12-07'), 'weekday'));
// false if Saturday
```

### Unit Testing Pattern

```javascript
// Define matcher
const evenMatcher = {
  test: (condition) => condition === 'even',
  match: (value) => typeof value === 'number' && value % 2 === 0
};

// Test it
console.assert(evenMatcher.test('even') === true, 'Should handle "even"');
console.assert(evenMatcher.test('odd') === false, 'Should not handle "odd"');
console.assert(evenMatcher.match(2, 'even') === true, '2 should be even');
console.assert(evenMatcher.match(3, 'even') === false, '3 should not be even');

// Register after testing
Conditions.registerMatcher('even', evenMatcher);
```

---

## Common Beginner Questions

### Q: When should I create a custom matcher?

**Answer:** When you have domain-specific conditions that you'll use multiple times.

**Create a matcher when:**
- ✅ The condition is used in 3+ places
- ✅ It represents domain logic (weekday, permission, price range)
- ✅ Built-in matchers don't fit cleanly
- ✅ You want to reuse the logic

**Don't create a matcher when:**
- ❌ One-time use (just use existing matchers or computed values)
- ❌ The logic is too simple (use built-in matchers)
- ❌ It's better as a computed property

---

### Q: Can I override built-in matchers?

**Answer:** You can register with the same name, but it's not recommended.

```javascript
// ❌ Bad - overriding built-in
Conditions.registerMatcher('true', myCustomMatcher);

// ✅ Good - use unique names
Conditions.registerMatcher('my-special-true', myCustomMatcher);
```

---

### Q: What if multiple matchers match the same condition?

**Answer:** The **first matching** matcher wins (order matters).

```javascript
// Matchers are tested in registration order
Conditions.registerMatcher('a', {
  test: (c) => c.startsWith('special'),
  match: () => true
});

Conditions.registerMatcher('b', {
  test: (c) => c === 'special-case',
  match: () => false
});

// condition: 'special-case'
// Matcher 'a' tests first, matches, returns true
// Matcher 'b' never runs!
```

**Best practice:** Make test() functions specific!

---

### Q: Can matchers be async?

**Answer:** No, matchers must be synchronous.

```javascript
// ❌ Won't work - async not supported
Conditions.registerMatcher('api-check', {
  test: (c) => c === 'api-check',
  match: async (value) => {
    const response = await fetch('/api/check');
    return response.ok;
  }
});

// ✅ Solution: Use computed properties with async data
const state = Reactive.state({ apiStatus: 'unknown' });

async function checkAPI() {
  const response = await fetch('/api/check');
  state.apiStatus = response.ok ? 'ok' : 'error';
}

// Then use regular matcher on the state
Conditions.whenState(
  () => state.apiStatus,
  {
    'ok': { /* ... */ },
    'error': { /* ... */ }
  },
  selector
);
```

---

### Q: How do I debug matchers?

**Answer:** Use logging and `matchesCondition()`:

```javascript
// Add logging to your matcher
Conditions.registerMatcher('debug-weekday', {
  test: (condition) => {
    const result = condition === 'weekday';
    console.log('test:', condition, '→', result);
    return result;
  },
  match: (value, condition) => {
    const day = new Date(value).getDay();
    const result = day >= 1 && day <= 5;
    console.log('match:', value, 'day:', day, '→', result);
    return result;
  }
});

// Or test manually
const testDate = new Date();
console.log(Conditions.matchesCondition(testDate, 'weekday'));
```

---

## Tips and Best Practices

### Tip 1: Make test() Specific

```javascript
// ❌ Bad - too broad
{
  test: (condition) => condition.includes(':'),
  // Many conditions have colons!
}

// ✅ Good - specific
{
  test: (condition) => condition.startsWith('price:'),
  // Only handles price: prefix
}
```

### Tip 2: Validate Input in match()

```javascript
// ✅ Good - defensive
{
  match: (value, condition) => {
    // Check value type
    if (typeof value !== 'number') return false;
    
    // Check condition format
    if (!condition.includes('-')) return false;
    
    // Then do the actual matching
    const [min, max] = condition.split('-').map(Number);
    return value >= min && value <= max;
  }
}
```

### Tip 3: Use Descriptive Names

```javascript
// ❌ Bad - unclear
Conditions.registerMatcher('x', matcher);

// ✅ Good - clear purpose
Conditions.registerMatcher('is-weekday', matcher);
```

### Tip 4: Document Your Matchers

```javascript
/**
 * Credit Card Type Matcher
 * 
 * Detects credit card type from card number
 * 
 * Supported conditions:
 * - 'visa': Visa cards (starting with 4)
 * - 'mastercard': MasterCard (starting with 51-55)
 * - 'amex': American Express (starting with 34 or 37)
 * 
 * @example
 * Conditions.whenState(
 *   () => cardNumber,
 *   {
 *     'visa': { innerHTML: 'Visa' },
 *     'mastercard': { innerHTML: 'MasterCard' }
 *   },
 *   '#card-type'
 * );
 */
Conditions.registerMatcher('visa', {
  test: (condition) => condition === 'visa',
  match: (value) => /^4[0-9]{12}(?:[0-9]{3})?$/.test(value)
});
```

---

## Summary

### What `registerMatcher()` Does:

1. ✅ Creates custom condition matchers
2. ✅ Extends the Conditions system
3. ✅ Enables domain-specific conditions
4. ✅ Reusable across all condition methods
5. ✅ Integrates seamlessly with built-in matchers

### When to Use It:

- Need domain-specific conditions (weekday, permissions, card types)
- Logic will be reused multiple times
- Want cleaner, more declarative conditions
- Built-in matchers don't fit your use case
- Building reusable condition libraries

### The Basic Pattern:

```javascript
// 1. Register your matcher
Conditions.registerMatcher('my-condition', {
  // Does this matcher handle this condition string?
  test: (condition, value?) => boolean,
  
  // Does the value match this condition?
  match: (value, condition) => boolean
});

// 2. Use it in conditions
Conditions.whenState(
  () => state.value,
  {
    'my-condition': { /* config */ }
  },
  selector
);

// 3. It works automatically! ✨
```

### Quick Decision Guide:

- **Need domain-specific conditions?** → Create custom matcher
- **One-time logic?** → Use existing matchers or computed
- **Complex object checks?** → Create custom matcher
- **Simple equality?** → Use built-in matchers

---

**Remember:** Custom matchers are your way to teach the Conditions system new tricks. Define them once, use them everywhere, and your conditions become cleaner and more expressive! 🎉