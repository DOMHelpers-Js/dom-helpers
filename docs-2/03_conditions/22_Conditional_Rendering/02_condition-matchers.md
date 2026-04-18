[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Condition Matchers — All the Ways to Match Values

## Quick Start (30 seconds)

```javascript
// String equality (default)
Conditions.apply('active', {
  'active':   { style: { color: 'green' } },
  'inactive': { style: { color: 'gray' } }
}, '#badge');

// Numeric range
Conditions.apply(75, {
  '<50':   { textContent: 'Fail',  style: { color: 'red' } },
  '50-89': { textContent: 'Pass',  style: { color: 'blue' } },
  '>=90':  { textContent: 'Great', style: { color: 'green' } }
}, '#score');

// Boolean & truthy/falsy
Conditions.apply(true, {
  'true':  { textContent: 'Yes' },
  'false': { textContent: 'No' }
}, '#answer');
```

---

## What Are Condition Matchers?

When you write a condition map like `{ 'active': { ... } }`, the key `'active'` is the **condition**. The module needs to check: does the current value match this condition?

**Condition matchers** are the rules that decide how to compare the value against each condition key. The module comes with many built-in matchers — from simple string equality to numeric ranges, regex patterns, and more.

The matchers are checked **in order** — the first one whose `test()` passes gets to decide whether the value matches.

---

## How Matching Works

```
matchesCondition(value, conditionKey)
   ↓
Walk through matchers in order:
   ├── booleanTrue.test('active')? → No, skip
   ├── booleanFalse.test('active')? → No, skip
   ├── truthy.test('active')? → No, skip
   ├── ... (more matchers)
   ├── stringEquality.test('active')? → Yes! (always true — it's the fallback)
   │   └── stringEquality.match(value, 'active')
   │       └── String(value) === 'active'? → Yes!
   └── Return true ✅
```

**Key Insight:** The matchers are tried in a specific order. More specific matchers (like `'true'`, `'>50'`, `'/regex/'`) are tested before the generic `stringEquality` fallback. This means `'true'` as a condition key matches boolean `true`, not the string `"true"`.

---

## Built-in Matchers Reference

### Boolean & Truthiness

These match against JavaScript's boolean and truthiness concepts:

```javascript
// 'true' — matches exactly boolean true
Conditions.apply(true, {
  'true':  { textContent: 'Enabled' },
  'false': { textContent: 'Disabled' }
}, '#toggle');

// 'false' — matches exactly boolean false
Conditions.apply(false, {
  'true':  { textContent: 'On' },
  'false': { textContent: 'Off' }
}, '#switch');
```

```javascript
// 'truthy' — matches any truthy value (non-empty string, number > 0, object, etc.)
Conditions.apply('hello', {
  'truthy': { textContent: 'Has value' },
  'falsy':  { textContent: 'No value' }
}, '#status');

// 'falsy' — matches any falsy value (0, '', null, undefined, false)
Conditions.apply(0, {
  'truthy': { textContent: 'Has value' },
  'falsy':  { textContent: 'Empty' }
}, '#status');
```

| Condition Key | Matches When |
|---------------|-------------|
| `'true'` | `value === true` |
| `'false'` | `value === false` |
| `'truthy'` | `!!value` is `true` |
| `'falsy'` | `!value` is `true` |

---

### Null, Undefined, and Empty

```javascript
// 'null' — matches exactly null
Conditions.apply(null, {
  'null': { textContent: 'No data', style: { color: 'gray' } },
  'truthy': { textContent: 'Has data' }
}, '#dataStatus');

// 'undefined' — matches exactly undefined
Conditions.apply(undefined, {
  'undefined': { textContent: 'Not set' },
  'truthy': { textContent: 'Set' }
}, '#configStatus');
```

```javascript
// 'empty' — matches null, undefined, empty string, empty array, empty object
Conditions.apply('', {
  'empty':  { textContent: 'Please enter a value' },
  'truthy': { textContent: 'Value received' }
}, '#feedback');
```

**What counts as "empty"?**

| Value | `'empty'` matches? |
|-------|-------------------|
| `null` | Yes |
| `undefined` | Yes |
| `''` (empty string) | Yes |
| `[]` (empty array) | Yes |
| `{}` (empty object) | Yes |
| `0` | Yes (falsy) |
| `'hello'` | No |
| `[1, 2]` | No |

---

### String Equality (Default Fallback)

The simplest and most common matcher — if none of the specialized matchers apply, the condition key is compared as a plain string:

```javascript
Conditions.apply('active', {
  'active':  { style: { color: 'green' } },
  'pending': { style: { color: 'orange' } },
  'error':   { style: { color: 'red' } }
}, '#statusDot');
// value 'active' === condition 'active' → match!
```

The value is converted to a string with `String(value)` before comparing:

```javascript
Conditions.apply(42, {
  '42': { textContent: 'Found it!' }
}, '#result');
// String(42) === '42' → match!
```

---

### Quoted String Matching

For exact string matches where the condition key might conflict with other matchers, wrap the string in quotes:

```javascript
Conditions.apply('true', {
  '"true"':  { textContent: 'The string "true"' },
  '"false"': { textContent: 'The string "false"' }
}, '#display');
// Without quotes, 'true' would match boolean true.
// With quotes, '"true"' matches the string 'true'.
```

Both single and double quotes work:

```javascript
{ "'hello'": { ... } }   // Matches string 'hello'
{ '"hello"': { ... } }   // Also matches string 'hello'
```

---

### String Pattern Matching

Match parts of a string using `includes:`, `startsWith:`, or `endsWith:`:

```javascript
// includes: — value contains the search term
Conditions.apply('Hello World', {
  'includes:World': { textContent: 'Contains "World"!' }
}, '#result');

// startsWith: — value starts with the prefix
Conditions.apply('admin_user', {
  'startsWith:admin': { classList: { add: 'admin-badge' } },
  'startsWith:guest': { classList: { add: 'guest-badge' } }
}, '#userBadge');

// endsWith: — value ends with the suffix
Conditions.apply('report.pdf', {
  'endsWith:.pdf': { classList: { add: 'file-pdf' } },
  'endsWith:.doc': { classList: { add: 'file-doc' } }
}, '#fileIcon');
```

| Condition Pattern | Matches When |
|-------------------|-------------|
| `'includes:xyz'` | `String(value).includes('xyz')` |
| `'startsWith:abc'` | `String(value).startsWith('abc')` |
| `'endsWith:xyz'` | `String(value).endsWith('xyz')` |

---

### Regex Pattern Matching

Use full regular expression patterns wrapped in `/slashes/`:

```javascript
// Match emails
Conditions.apply('user@example.com', {
  '/^[^@]+@[^@]+\\.[^@]+$/': {
    classList: { add: 'is-valid' },
    style: { borderColor: 'green' }
  },
  'truthy': {
    classList: { add: 'is-invalid' },
    style: { borderColor: 'red' }
  }
}, '#emailInput');
```

```javascript
// Match with flags
Conditions.apply('Hello World', {
  '/hello/i': { textContent: 'Found (case-insensitive)' }
}, '#result');
// The 'i' flag makes it case-insensitive
```

```javascript
// Match patterns
Conditions.apply('ABC-123', {
  '/^[A-Z]+-\\d+$/': { textContent: 'Valid code format' },
  'truthy':          { textContent: 'Invalid format' }
}, '#codeValidator');
```

**Regex format:** `/pattern/flags`

- Pattern goes between the first and last `/`
- Flags (optional) go after the last `/`: `i` (case-insensitive), `g` (global), `m` (multiline)

---

### Numeric Comparisons

When the value is a **number**, these matchers activate:

#### Exact Number

```javascript
Conditions.apply(5, {
  '0': { textContent: 'Zero' },
  '1': { textContent: 'One' },
  '5': { textContent: 'Five' }
}, '#display');
// value 5 === Number('5') → match!
```

#### Numeric Range

```javascript
Conditions.apply(75, {
  '0-49':   { textContent: 'Fail',      style: { color: 'red' } },
  '50-69':  { textContent: 'Pass',      style: { color: 'orange' } },
  '70-89':  { textContent: 'Good',      style: { color: 'blue' } },
  '90-100': { textContent: 'Excellent', style: { color: 'green' } }
}, '#gradeDisplay');
// 75 is between 70 and 89 → 'Good'
```

The range `'70-89'` means: `value >= 70 && value <= 89` (inclusive on both ends).

#### Comparison Operators

```javascript
Conditions.apply(150, {
  '<100':  { textContent: 'Under budget' },
  '>=100': { textContent: 'Over budget', style: { color: 'red' } }
}, '#budgetStatus');
```

```javascript
const score = state(42);

Conditions.whenState(
  () => score.value,
  {
    '<=0':   { textContent: 'Empty' },
    '>0':    { textContent: 'Has points' },
    '>=100': { textContent: 'Max reached!' }
  },
  '#scoreLabel'
);
```

| Condition | Matches When |
|-----------|-------------|
| `'5'` | `value === 5` (exact) |
| `'10-20'` | `value >= 10 && value <= 20` |
| `'>50'` | `value > 50` |
| `'>=50'` | `value >= 50` |
| `'<10'` | `value < 10` |
| `'<=10'` | `value <= 10` |

**Important:** Numeric matchers only activate when the value is a `number` type. If the value is a string like `'75'`, string equality is used instead.

---

## Matching Order and First-Match Rule

Conditions are checked **top to bottom**. The **first match** applies, and the rest are skipped:

```javascript
Conditions.apply(85, {
  '>=90':  { textContent: 'A' },     // 85 >= 90? No
  '>=80':  { textContent: 'B' },     // 85 >= 80? YES → applied!
  '>=70':  { textContent: 'C' },     // Skipped (already matched)
  '>=60':  { textContent: 'D' },     // Skipped
  'truthy': { textContent: 'F' }     // Skipped
}, '#grade');
// Result: 'B'
```

**This means order matters!** Put more specific conditions first:

```javascript
// ✅ Correct order — specific first, general last
{
  '>=90':  { textContent: 'Excellent' },
  '>=70':  { textContent: 'Good' },
  '>=50':  { textContent: 'Pass' },
  'truthy': { textContent: 'Fail' }
}

// ❌ Wrong order — 'truthy' matches everything, so it always wins
{
  'truthy': { textContent: 'Fail' },      // Always matches first!
  '>=90':  { textContent: 'Excellent' },   // Never reached
  '>=70':  { textContent: 'Good' }         // Never reached
}
```

---

## Real-World Examples

### Example 1: User Status Badge

```javascript
const userStatus = state('online');

Conditions.whenState(
  () => userStatus.value,
  {
    'online':  { textContent: 'Online',  style: { color: '#2ecc71' } },
    'away':    { textContent: 'Away',    style: { color: '#f39c12' } },
    'busy':    { textContent: 'Busy',    style: { color: '#e74c3c' } },
    'offline': { textContent: 'Offline', style: { color: '#95a5a6' } }
  },
  '#userStatusBadge'
);
```

### Example 2: Score Display with Ranges

```javascript
const score = state(0);

Conditions.whenState(
  () => score.value,
  {
    '0':      { textContent: 'No score yet', style: { color: 'gray' } },
    '1-49':   { textContent: 'Keep trying',  style: { color: 'red' } },
    '50-79':  { textContent: 'Getting there', style: { color: 'orange' } },
    '80-99':  { textContent: 'Almost perfect', style: { color: 'blue' } },
    '>=100':  { textContent: 'Perfect score!', style: { color: 'green', fontWeight: 'bold' } }
  },
  '#scoreMessage'
);
```

### Example 3: Input Validation with Regex

```javascript
const email = state('');

Conditions.whenState(
  () => email.value,
  {
    'empty': {
      classList: { remove: ['is-valid', 'is-invalid'] }
    },
    '/^[^@]+@[^@]+\\.[^@]+$/': {
      classList: { add: 'is-valid', remove: 'is-invalid' }
    },
    'truthy': {
      classList: { add: 'is-invalid', remove: 'is-valid' }
    }
  },
  '#emailField'
);
```

### Example 4: File Type Detection

```javascript
Conditions.apply(fileName, {
  'endsWith:.pdf':  { classList: { add: 'icon-pdf' } },
  'endsWith:.doc':  { classList: { add: 'icon-word' } },
  'endsWith:.jpg':  { classList: { add: 'icon-image' } },
  'endsWith:.png':  { classList: { add: 'icon-image' } },
  'truthy':         { classList: { add: 'icon-generic' } }
}, '#fileTypeIcon');
```

---

## Complete Matcher Reference

| Category | Condition Key | Matches When |
|----------|--------------|-------------|
| **Boolean** | `'true'` | `value === true` |
| | `'false'` | `value === false` |
| **Truthiness** | `'truthy'` | `!!value` |
| | `'falsy'` | `!value` |
| **Null/Undef** | `'null'` | `value === null` |
| | `'undefined'` | `value === undefined` |
| **Empty** | `'empty'` | null, undefined, `''`, `[]`, `{}`, or falsy |
| **Quoted** | `'"text"'` or `"'text'"` | `String(value) === 'text'` |
| **Includes** | `'includes:xyz'` | `String(value).includes('xyz')` |
| **Starts** | `'startsWith:abc'` | `String(value).startsWith('abc')` |
| **Ends** | `'endsWith:xyz'` | `String(value).endsWith('xyz')` |
| **Regex** | `'/pattern/flags'` | `new RegExp(pattern, flags).test(String(value))` |
| **Exact Number** | `'42'` | `value === 42` (when value is number) |
| **Range** | `'10-20'` | `value >= 10 && value <= 20` (when value is number) |
| **Greater** | `'>50'` | `value > 50` (when value is number) |
| **Greater/Equal** | `'>=50'` | `value >= 50` (when value is number) |
| **Less** | `'<10'` | `value < 10` (when value is number) |
| **Less/Equal** | `'<=10'` | `value <= 10` (when value is number) |
| **String Equal** | `'anytext'` | `String(value) === 'anytext'` (fallback) |

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **Matchers** | Rules that compare a value against a condition key |
| **Order** | Checked top-to-bottom; **first match wins** |
| **String** | Default fallback — `String(value) === conditionKey` |
| **Boolean** | `'true'` / `'false'` match exact boolean values |
| **Numeric** | Ranges (`'10-20'`), comparisons (`'>50'`), exact (`'5'`) — only for number values |
| **Pattern** | `includes:`, `startsWith:`, `endsWith:`, `/regex/` |
| **Empty** | Catches null, undefined, `''`, `[]`, `{}` |

> **Simple Rule to Remember:** Condition keys look like what they match — `'true'` matches true, `'>50'` matches numbers over 50, `'/pattern/'` matches regex, and plain text matches plain text. Put specific conditions first, generic ones last.