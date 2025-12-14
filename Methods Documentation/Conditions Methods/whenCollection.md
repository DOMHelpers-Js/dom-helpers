# Understanding `whenCollection()` - A Beginner's Guide

## What is `whenCollection()`?

`whenCollection()` is a **convenient alias** for `whenStateCollection()`. It does exactly the same thing but with a shorter name.

Think of it as a **nickname** for the same function - same person, different name!

---

## Why Does This Alias Exist?

### The Reason: Shorter, More Convenient

Sometimes you want a shorter name for frequently used functions:

```javascript
// Longer name (explicit)
Conditions.whenStateCollection(valueFn, conditions, selector);

// Shorter name (convenient)
Conditions.whenCollection(valueFn, conditions, selector);
```

Both do **exactly the same thing** - it's just personal preference!

---

## Which One Should I Use?

### Use `whenStateCollection()` When:

✅ **You want to be explicit and clear**
```javascript
// Very clear what this does
Conditions.whenStateCollection(
  () => state.size,
  conditions,
  '.items'
);
```

✅ **Writing documentation or examples**
```javascript
// Self-explanatory for readers
Conditions.whenStateCollection(/* ... */);
```

✅ **Working in a team with naming conventions**
```javascript
// Consistent with whenState(), apply(), etc.
Conditions.whenStateCollection(/* ... */);
```

### Use `whenCollection()` When:

✅ **You want shorter, cleaner code**
```javascript
// More concise
Conditions.whenCollection(
  () => state.size,
  conditions,
  '.items'
);
```

✅ **Writing application code (not examples)**
```javascript
// Faster to type, easier to read
Conditions.whenCollection(/* ... */);
```

✅ **You prefer brevity**
```javascript
// Personal preference
Conditions.whenCollection(/* ... */);
```

---

## They Are Identical

### Proof They're The Same

```javascript
// These are EXACTLY the same:

// Version 1
Conditions.whenStateCollection(
  () => state.mode,
  {
    'compact': {
      style: { padding: '5px' },
      0: { textContent: 'First' },
      -1: { textContent: 'Last' }
    }
  },
  '.items'
);

// Version 2
Conditions.whenCollection(
  () => state.mode,
  {
    'compact': {
      style: { padding: '5px' },
      0: { textContent: 'First' },
      -1: { textContent: 'Last' }
    }
  },
  '.items'
);

// Same parameters, same behavior, same results!
```

### Under The Hood

```javascript
// Internally, this is how it works:
Conditions.whenCollection = Conditions.whenStateCollection;

// It's literally the same function with two names!
```

---

## Basic Usage

### Syntax

```javascript
Conditions.whenCollection(valueFn, conditions, selector, options)
```

**All parameters and behavior are identical to `whenStateCollection()`.**

See the [whenStateCollection() documentation](./whenStateCollection.md) for complete details.

---

## Quick Examples

### Example 1: Simple Collection Update

```javascript
const state = Reactive.state({ size: 'normal' });

// Using the alias
Conditions.whenCollection(
  () => state.size,
  {
    'small': {
      style: { padding: '5px' },
      0: { textContent: 'First Small' },
      -1: { textContent: 'Last Small' }
    },
    'normal': {
      style: { padding: '10px' },
      0: { textContent: 'First' },
      -1: { textContent: 'Last' }
    }
  },
  '.items'
);
```

### Example 2: In Real Applications

```javascript
// Shorter code in production
const app = {
  init() {
    // Quick and clean
    Conditions.whenCollection(
      () => this.state.theme,
      this.themeConditions,
      '.cards'
    );
    
    Conditions.whenCollection(
      () => this.state.layout,
      this.layoutConditions,
      '.grid-items'
    );
  }
};
```

---

## Common Questions

### Q: Is there any difference at all?

**Answer:** No! They are **exactly the same function**.

```javascript
console.log(Conditions.whenCollection === Conditions.whenStateCollection);
// true - same function!
```

### Q: Which one is recommended?

**Answer:** Either! It's personal preference.

**Recommendation:**
- **Examples/Docs**: Use `whenStateCollection()` (clearer)
- **Production Code**: Use whichever you prefer

### Q: Can I mix them in the same project?

**Answer:** Yes, but be consistent!

```javascript
// ✅ OK but inconsistent
Conditions.whenStateCollection(/* ... */);
Conditions.whenCollection(/* ... */);

// ✅ Better - pick one and stick with it
Conditions.whenCollection(/* ... */);
Conditions.whenCollection(/* ... */);
```

### Q: Does the alias have any performance impact?

**Answer:** None whatsoever - it's the same function!

---

## Comparison Table

| Feature | `whenStateCollection()` | `whenCollection()` |
|---------|------------------------|-------------------|
| Functionality | Full ✅ | Full ✅ |
| Parameters | Same | Same |
| Return Value | Same | Same |
| Performance | Same | Same |
| Name Length | Longer | Shorter |
| Clarity | More explicit | More concise |
| Use Cases | All | All |

---

## Code Style Recommendations

### Consistent Style 1: Always Use Full Name

```javascript
// Use explicit names everywhere
Conditions.whenStateCollection(/* ... */);
Conditions.whenState(/* ... */);
Conditions.apply(/* ... */);
Conditions.watch(/* ... */);
```

**Pros:** Very clear and consistent  
**Cons:** More typing

### Consistent Style 2: Use Aliases Where Available

```javascript
// Use shorter aliases when available
Conditions.whenCollection(/* ... */);  // Alias ✓
Conditions.whenState(/* ... */);       // No alias, full name
Conditions.apply(/* ... */);           // No alias, full name
Conditions.watch(/* ... */);           // No alias, full name
```

**Pros:** Concise code  
**Cons:** Mixed naming style

### Consistent Style 3: Only Full Names in Documentation

```javascript
// Documentation examples use full names
// Example: whenStateCollection()
Conditions.whenStateCollection(/* ... */);

// But in actual code, use shorter alias
// In your app.js:
Conditions.whenCollection(/* ... */);
```

**Pros:** Clear docs, concise code  
**Cons:** Slight inconsistency

---

## Migration Between Names

### Switching is Trivial

```javascript
// Before - using full name
const cleanup = Conditions.whenStateCollection(
  valueFn,
  conditions,
  selector
);

// After - using alias (just change the name!)
const cleanup = Conditions.whenCollection(
  valueFn,
  conditions,
  selector
);
// Everything else stays the same!
```

### Search and Replace

If you want to switch in your entire codebase:

```bash
# Find and replace
whenStateCollection → whenCollection
# Or vice versa
whenCollection → whenStateCollection
```

No other changes needed!

---

## Summary

### What `whenCollection()` Is:

1. ✅ An **alias** for `whenStateCollection()`
2. ✅ **Identical** functionality
3. ✅ **Shorter** name for convenience
4. ✅ Same parameters, returns, behavior

### When to Use It:

- ✅ You prefer shorter names
- ✅ Writing application code
- ✅ Want more concise syntax
- ✅ Personal preference

### When NOT to Use It:

- Documentation examples (use full name for clarity)
- When team style guide requires full names
- If you prefer explicit naming everywhere

### Remember:

```javascript
// These are EXACTLY the same:
Conditions.whenStateCollection === Conditions.whenCollection
// true!

// Use whichever you prefer! Both are correct.
```

---

## Full Documentation Reference

For complete documentation on all features, parameters, examples, and patterns, see:

**[whenStateCollection() Documentation](./whenStateCollection.md)**

Everything documented there applies equally to `whenCollection()` because they are the same function!

---

**Quick Reference:**

```javascript
// Alias usage
Conditions.whenCollection(
  () => state.value,      // What to watch
  {
    'condition': {
      style: { /* ... */ }, // Bulk updates
      0: { /* ... */ },     // First element
      -1: { /* ... */ }     // Last element
    }
  },
  '.items'                 // Collection selector
);
```

**Remember:** It's just a shorter name - everything else is identical! Use what feels right for your project. 🎉