# Understanding `getMatchers()` - A Beginner's Guide

## What is `getMatchers()`?

`getMatchers()` is a **utility method** that returns a list of all registered condition matchers in the system. It's used for **inspection, debugging, and discovery** of available matchers.

Think of it as **checking your toolbox** to see what tools you have:
1. Shows all built-in matchers
2. Shows all custom matchers you've registered
3. Helps with debugging condition issues
4. Useful for documentation generation

It's like asking **"What condition types can I use?"** - it tells you everything available!

---

## Why Does `getMatchers()` Exist?

### The Problem: Unknown Available Matchers

As you build your application and register custom matchers, it becomes hard to remember what's available:

```javascript
// What matchers do I have? ❌
// Can I use 'weekday'? Did I register it?
// What built-in matchers are there?
// Which custom matchers did my teammate add?

Conditions.whenState(
  () => value,
  {
    'weekday': { /* ... */ }  // Is this matcher available?
  },
  selector
);
```

**Problems:**
- Don't remember what matchers are registered
- Can't verify if a matcher exists
- Difficult to debug condition matching issues
- Hard to generate documentation
- Can't discover available matchers programmatically

### The Solution: Inspect Registered Matchers

`getMatchers()` gives you a complete list:

```javascript
// What matchers are available? ✅
const matchers = Conditions.getMatchers();
console.log(matchers);
// [
//   'booleanTrue', 'booleanFalse', 'truthy', 'falsy',
//   'null', 'undefined', 'empty', 'quoted',
//   'includes', 'startsWith', 'endsWith', 'regex',
//   'numericRange', 'numericExact', 'greaterEqual',
//   'lessEqual', 'greaterThan', 'lessThan', 'stringEquality',
//   'weekday', 'weekend', 'even', 'odd'  // Your custom matchers
// ]

// Now you know what's available!
```

**Benefits:**
- ✅ See all available matchers
- ✅ Verify matcher exists before using
- ✅ Debug condition matching
- ✅ Generate documentation
- ✅ Discover capabilities

---

## How Does It Work?

### The Concept

`getMatchers()` simply returns the **keys** from the internal matcher registry:

```
Internal Registry → Extract Keys → Return Array
```

**Step by Step:**

1. **Access**: Reads the internal `conditionMatchers` object
2. **Extract**: Gets all the keys (matcher names)
3. **Return**: Returns them as an array of strings
4. **Done**: You have the complete list!

### Visual Example

```javascript
// Internal structure (simplified):
const conditionMatchers = {
  'booleanTrue': { test: ..., match: ... },
  'weekday': { test: ..., match: ... },
  'even': { test: ..., match: ... }
};

// getMatchers() returns:
['booleanTrue', 'weekday', 'even']
```

---

## Basic Usage

### Syntax

```javascript
Conditions.getMatchers()
```

**Parameters:**
- None

**Returns:**
- `Array<string>` - Array of matcher names

---

## Practical Examples

### Example 1: List All Available Matchers

```javascript
// Get all matchers
const matchers = Conditions.getMatchers();

console.log('Available Matchers:');
matchers.forEach(matcher => {
  console.log(`  - ${matcher}`);
});

// Output:
// Available Matchers:
//   - booleanTrue
//   - booleanFalse
//   - truthy
//   - falsy
//   - null
//   - undefined
//   - empty
//   - quoted
//   - includes
//   - startsWith
//   - endsWith
//   - regex
//   - numericRange
//   - numericExact
//   - greaterEqual
//   - lessEqual
//   - greaterThan
//   - lessThan
//   - stringEquality
//   - weekday (custom)
//   - even (custom)
```

---

### Example 2: Check if Matcher Exists

```javascript
// Helper function
function hasMatcher(name) {
  return Conditions.getMatchers().includes(name);
}

// Check before using
if (hasMatcher('weekday')) {
  Conditions.whenState(
    () => currentDate,
    {
      'weekday': { /* workday config */ }
    },
    selector
  );
} else {
  console.warn('weekday matcher not available - please register it');
  // Fallback to different approach
}
```

---

### Example 3: Debugging Condition Matching

```javascript
// When a condition doesn't work as expected
const value = 42;
const condition = 'even';

// Check if matcher exists
const matchers = Conditions.getMatchers();

if (!matchers.includes('even')) {
  console.error(`Matcher "${condition}" not registered!`);
  console.log('Available matchers:', matchers);
  console.log('Did you forget to register it?');
} else {
  // Test the condition
  const matches = Conditions.matchesCondition(value, condition);
  console.log(`Value ${value} matches "${condition}": ${matches}`);
}
```

---

### Example 4: Generate Documentation

```javascript
// Auto-generate documentation for available matchers
function generateMatcherDocs() {
  const matchers = Conditions.getMatchers();
  
  console.log('# Available Condition Matchers\n');
  
  // Group matchers by type
  const builtIn = [];
  const custom = [];
  
  const builtInNames = [
    'booleanTrue', 'booleanFalse', 'truthy', 'falsy',
    'null', 'undefined', 'empty', 'quoted',
    'includes', 'startsWith', 'endsWith', 'regex',
    'numericRange', 'numericExact', 'greaterEqual',
    'lessEqual', 'greaterThan', 'lessThan', 'stringEquality'
  ];
  
  matchers.forEach(matcher => {
    if (builtInNames.includes(matcher)) {
      builtIn.push(matcher);
    } else {
      custom.push(matcher);
    }
  });
  
  console.log(`## Built-in Matchers (${builtIn.length})`);
  builtIn.forEach(m => console.log(`- \`${m}\``));
  
  console.log(`\n## Custom Matchers (${custom.length})`);
  custom.forEach(m => console.log(`- \`${m}\``));
  
  console.log(`\n**Total: ${matchers.length} matchers available**`);
}

generateMatcherDocs();
```

**Output:**
```
# Available Condition Matchers

## Built-in Matchers (19)
- `booleanTrue`
- `booleanFalse`
- `truthy`
- ...

## Custom Matchers (3)
- `weekday`
- `weekend`
- `even`

**Total: 22 matchers available**
```

---

### Example 5: Conditional Feature Loading

```javascript
// Check what matchers are available and load features accordingly
function initializeApp() {
  const matchers = Conditions.getMatchers();
  
  // Check for required matchers
  const requiredMatchers = ['weekday', 'permission'];
  const missingMatchers = requiredMatchers.filter(m => !matchers.includes(m));
  
  if (missingMatchers.length > 0) {
    console.warn('Missing required matchers:', missingMatchers);
    
    // Register missing matchers
    missingMatchers.forEach(matcher => {
      if (matcher === 'weekday') {
        Conditions.registerMatcher('weekday', weekdayMatcher);
      }
      if (matcher === 'permission') {
        Conditions.registerMatcher('permission', permissionMatcher);
      }
    });
    
    console.log('✓ Registered missing matchers');
  }
  
  // Now safe to use the app
  startApp();
}

initializeApp();
```

---

### Example 6: Development Helpers

```javascript
// Development mode: Show available matchers on page load
if (process.env.NODE_ENV === 'development') {
  console.group('🔍 Conditions System Debug Info');
  
  const matchers = Conditions.getMatchers();
  console.log(`Total matchers: ${matchers.length}`);
  console.log('Available matchers:', matchers);
  
  // Show which are custom
  const customMatchers = matchers.filter(m => 
    !m.startsWith('boolean') && 
    !m.startsWith('numeric') &&
    !['truthy', 'falsy', 'null', 'undefined', 'empty', 
      'quoted', 'includes', 'startsWith', 'endsWith', 
      'regex', 'stringEquality'].includes(m)
  );
  
  if (customMatchers.length > 0) {
    console.log('Custom matchers:', customMatchers);
  }
  
  console.groupEnd();
}
```

---

### Example 7: Testing Framework Integration

```javascript
// Test helper: Verify expected matchers are available
function assertMatchersAvailable(expected) {
  const available = Conditions.getMatchers();
  const missing = expected.filter(m => !available.includes(m));
  
  if (missing.length > 0) {
    throw new Error(
      `Missing matchers: ${missing.join(', ')}\n` +
      `Available: ${available.join(', ')}`
    );
  }
  
  console.log('✓ All expected matchers available');
  return true;
}

// In tests
describe('Conditions System', () => {
  it('should have all required matchers', () => {
    assertMatchersAvailable([
      'booleanTrue', 'booleanFalse',
      'weekday', 'weekend', 'even', 'odd'
    ]);
  });
});
```

---

## Common Use Cases

### Use Case 1: Plugin System

```javascript
// Check if a plugin's required matchers are available
class ConditionsPlugin {
  constructor(requiredMatchers = []) {
    this.requiredMatchers = requiredMatchers;
  }
  
  canActivate() {
    const available = Conditions.getMatchers();
    return this.requiredMatchers.every(m => available.includes(m));
  }
  
  activate() {
    if (!this.canActivate()) {
      const missing = this.requiredMatchers.filter(
        m => !Conditions.getMatchers().includes(m)
      );
      throw new Error(`Cannot activate plugin. Missing matchers: ${missing}`);
    }
    
    // Activate plugin
    console.log('✓ Plugin activated');
  }
}

// Usage
const datePlugin = new ConditionsPlugin(['weekday', 'weekend']);
if (datePlugin.canActivate()) {
  datePlugin.activate();
} else {
  console.log('Date plugin requires additional matchers');
}
```

---

### Use Case 2: Interactive Documentation

```javascript
// Create interactive matcher explorer
function createMatcherExplorer() {
  const container = document.getElementById('matcher-explorer');
  const matchers = Conditions.getMatchers();
  
  container.innerHTML = `
    <h3>Available Matchers (${matchers.length})</h3>
    <ul>
      ${matchers.map(m => `
        <li>
          <code>${m}</code>
          <button onclick="testMatcher('${m}')">Test</button>
        </li>
      `).join('')}
    </ul>
  `;
}

function testMatcher(matcherName) {
  const testValue = prompt(`Enter a value to test against "${matcherName}":`);
  if (testValue !== null) {
    const matches = Conditions.matchesCondition(testValue, matcherName);
    alert(`Value "${testValue}" ${matches ? 'matches' : 'does not match'} "${matcherName}"`);
  }
}

// Run on page load
createMatcherExplorer();
```

---

### Use Case 3: Build-Time Validation

```javascript
// Validate that required matchers are available at build time
// (This would run in a build script)

const requiredMatchers = [
  'weekday', 'weekend',
  'permission', 'role',
  'priceRange', 'cardType'
];

function validateBuildDependencies() {
  // Simulate getting matchers (in real build, you'd analyze the codebase)
  const availableMatchers = Conditions.getMatchers();
  
  const missing = requiredMatchers.filter(
    m => !availableMatchers.includes(m)
  );
  
  if (missing.length > 0) {
    console.error('❌ Build failed: Missing required matchers');
    console.error('Missing:', missing);
    process.exit(1);
  }
  
  console.log('✓ All required matchers available');
}

validateBuildDependencies();
```

---

## Comparison with Related Methods

### `getMatchers()` vs `getHandlers()`

```javascript
// getMatchers() - Condition matchers
const matchers = Conditions.getMatchers();
// ['booleanTrue', 'weekday', 'even', ...]
// Used in: condition strings

// getHandlers() - Property handlers  
const handlers = Conditions.getHandlers();
// ['style', 'classList', 'animate', ...]
// Used in: configuration objects
```

### `getMatchers()` vs `hasMatcher()`

```javascript
// getMatchers() - Get all matcher names
const all = Conditions.getMatchers();
// ['booleanTrue', 'weekday', ...]

// hasMatcher() - Check if specific matcher exists (helper)
const exists = hasMatcher('weekday');
// true or false

// hasMatcher() is just a helper:
function hasMatcher(name) {
  return Conditions.getMatchers().includes(name);
}
```

---

## Common Beginner Questions

### Q: When should I use `getMatchers()`?

**Answer:** Use it for inspection, debugging, and discovery.

**Use when:**
- ✅ Debugging why conditions don't work
- ✅ Checking if a matcher is registered
- ✅ Generating documentation
- ✅ Building development tools
- ✅ Validating dependencies

**Don't use when:**
- ❌ In production hot paths (cache the result)
- ❌ Every time you check a matcher (use helper)

---

### Q: Does it show built-in and custom matchers?

**Answer:** Yes! It shows **everything** registered.

```javascript
const all = Conditions.getMatchers();
// Includes:
// - Built-in matchers (booleanTrue, truthy, etc.)
// - Custom matchers (weekday, even, etc.)
// - All registered matchers
```

---

### Q: Can I modify the returned array?

**Answer:** Modifying the array won't affect registered matchers.

```javascript
const matchers = Conditions.getMatchers();
matchers.push('fake');  // Doesn't actually register a matcher!

// To register, use:
Conditions.registerMatcher('real', matcherDef);
```

---

### Q: Is this expensive to call?

**Answer:** No, it's just returning object keys. But you can cache it.

```javascript
// ✅ Fine to call multiple times
const matchers1 = Conditions.getMatchers();
const matchers2 = Conditions.getMatchers();

// ✅ Or cache if you prefer
const AVAILABLE_MATCHERS = Conditions.getMatchers();
// Use AVAILABLE_MATCHERS throughout your code
```

---

## Tips and Best Practices

### Tip 1: Cache in Development Tools

```javascript
// ✅ Good - cache for dev tools
class ConditionsDevTools {
  constructor() {
    this.matchers = Conditions.getMatchers();
    this.handlers = Conditions.getHandlers();
  }
  
  refresh() {
    this.matchers = Conditions.getMatchers();
    this.handlers = Conditions.getHandlers();
  }
  
  showInfo() {
    console.log('Matchers:', this.matchers);
    console.log('Handlers:', this.handlers);
  }
}
```

### Tip 2: Create Helper Functions

```javascript
// ✅ Good - reusable helpers
function hasMatcher(name) {
  return Conditions.getMatchers().includes(name);
}

function getCustomMatchers() {
  const builtIn = ['booleanTrue', 'booleanFalse', /* ... */];
  return Conditions.getMatchers().filter(m => !builtIn.includes(m));
}

function getMatcherCount() {
  return Conditions.getMatchers().length;
}
```

### Tip 3: Use in Assertions

```javascript
// ✅ Good - validate before using
function useWeekdayMatcher() {
  console.assert(
    hasMatcher('weekday'),
    'weekday matcher must be registered'
  );
  
  // Safe to use
  Conditions.whenState(/* ... */);
}
```

### Tip 4: Document Your Extensions

```javascript
// ✅ Good - document what you've added
/**
 * Custom Matchers Registered:
 * - weekday: Matches Monday-Friday
 * - weekend: Matches Saturday-Sunday
 * - even: Matches even numbers
 * - odd: Matches odd numbers
 * 
 * Verify with: Conditions.getMatchers()
 */
```

---

## Summary

### What `getMatchers()` Does:

1. ✅ Returns array of all registered matcher names
2. ✅ Includes built-in matchers
3. ✅ Includes custom matchers
4. ✅ Useful for inspection and debugging
5. ✅ No parameters needed

### When to Use It:

- Debugging condition matching issues
- Checking if a matcher is available
- Generating documentation
- Building development tools
- Validating plugin dependencies
- Testing and assertions

### The Basic Pattern:

```javascript
// Get all matchers
const matchers = Conditions.getMatchers();

// Check if specific matcher exists
if (matchers.includes('weekday')) {
  // Use it
  Conditions.whenState(
    () => date,
    { 'weekday': { /* ... */ } },
    selector
  );
}

// Or iterate
matchers.forEach(matcher => {
  console.log(`Available: ${matcher}`);
});
```

### Quick Decision Guide:

- **Need to check if matcher exists?** → Use `getMatchers().includes(name)`
- **Debugging conditions?** → Use `getMatchers()` to see what's available
- **Building dev tools?** → Use `getMatchers()` to list capabilities
- **Want to register matcher?** → Use `registerMatcher()`, not `getMatchers()`

---

**Remember:** `getMatchers()` is your inspection tool for discovering what condition matchers are available. Use it for debugging, validation, and building development tools! 🔍