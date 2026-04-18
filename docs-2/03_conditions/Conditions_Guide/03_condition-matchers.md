[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Condition Matchers

## Quick Start (30 seconds)

```javascript
const app = state({ count: 0, status: 'idle', email: '', role: 'guest' });

// String equality (default)
Conditions.whenState(() => app.status, {
  'idle':    { '#msg': { textContent: 'Waiting…' } },
  'loading': { '#msg': { textContent: 'Loading…' } }
});

// Numeric comparison
Conditions.whenState(() => app.count, {
  '0':   { '#badge': { hidden: true } },
  '>0':  { '#badge': { hidden: false } },
  '>99': { '#badge': { textContent: '99+' } }
});

// Pattern matching
Conditions.whenState(() => app.email, {
  'includes:@': { '#email-hint': { hidden: true  } },
  'truthy':     { '#email-hint': { hidden: false } }
});

// Role-based
Conditions.whenState(() => app.role, {
  'admin': { '#admin-panel': { hidden: false } },
  'user':  { '#admin-panel': { hidden: true  } }
});
```

One system. Every kind of comparison.

---

## What Are Condition Matchers?

When Conditions evaluates a key in your conditions object — `'loading'`, `'>10'`, `'includes:@'`, `'/^err/i'` — it doesn't hard-code how to interpret those strings. Instead, it runs each key through a **registry of matchers**.

Each matcher in the registry:
1. **Tests** whether it can handle a key format (e.g., "does this key start with `>`?")
2. **Matches** a key against the current value (e.g., "is `value > 10`?")

This is the **strategy pattern** — the system tries matchers in priority order until one claims the key, then delegates the comparison to that matcher.

```
Value: 42, Key: '>10'

Try booleanTrue matcher  → does '>10' === 'true'?  No
Try booleanFalse matcher → does '>10' === 'false'? No
Try truthy matcher       → does '>10' === 'truthy'? No
...
Try greaterThan matcher  → does '>10' start with '>'? YES
  → Run comparison: 42 > 10? YES → MATCH
```

This design means the system is completely **open to extension** — you can register your own custom matchers (covered in the Extending Conditions guide).

---

## All Built-In Matchers

Here is the complete list of built-in condition matchers, in the order they are tested:

### Priority Order

```
1.  booleanTrue    — exact key 'true'
2.  booleanFalse   — exact key 'false'
3.  truthy         — key 'truthy'
4.  falsy          — key 'falsy'
5.  null           — key 'null'
6.  undefined      — key 'undefined'
7.  empty          — key 'empty'
8.  quotedString   — key starts with "'" or '"'
9.  includes       — key starts with 'includes:'
10. startsWith     — key starts with 'startsWith:'
11. endsWith       — key starts with 'endsWith:'
12. regex          — key starts with '/'
13. numericRange   — key matches '5-10' pattern
14. numericExact   — key is a plain number string like '42'
15. greaterThan    — key starts with '>'
16. lessThan       — key starts with '<'
17. stringEquality — fallback, matches value === key
```

---

## 1. `booleanTrue` — Key: `'true'`

Matches when the value is the boolean `true`.

```javascript
const toggle = state({ isOn: false });

Conditions.whenState(
  () => toggle.isOn,
  {
    'true':  { '#indicator': { className: 'dot dot-green', textContent: 'ON'  } },
    'false': { '#indicator': { className: 'dot dot-gray',  textContent: 'OFF' } }
  }
);

toggle.isOn = true;   // → matches 'true' block
toggle.isOn = false;  // → matches 'false' block
```

**Important:** The key is the string `'true'`, but it matches the **boolean** `true`, not the string `"true"`. The matcher uses `value === true`.

---

## 2. `booleanFalse` — Key: `'false'`

Matches when the value is the boolean `false`.

```javascript
const auth = state({ isLoggedIn: false });

Conditions.whenState(
  () => auth.isLoggedIn,
  {
    'true':  {
      '#login-btn':  { hidden: true  },
      '#logout-btn': { hidden: false }
    },
    'false': {
      '#login-btn':  { hidden: false },
      '#logout-btn': { hidden: true  }
    }
  }
);
```

Uses `value === false`.

---

## 3. `truthy` — Key: `'truthy'`

Matches when the value is **truthy** — any value that would be `true` in an `if` statement: non-empty strings, non-zero numbers, objects, arrays, `true`.

```javascript
const search = state({ query: '' });

Conditions.whenState(
  () => search.query,
  {
    'truthy': { '#clear-btn': { hidden: false } },  // query has content
    'falsy':  { '#clear-btn': { hidden: true  } }   // query is empty
  }
);

search.query = 'hello';  // → matches 'truthy', shows clear button
search.query = '';       // → matches 'falsy', hides clear button
```

Uses `!!value === true`.

---

## 4. `falsy` — Key: `'falsy'`

Matches when the value is **falsy** — `false`, `0`, `''`, `null`, `undefined`, `NaN`.

```javascript
const form = state({ name: '' });

Conditions.whenState(
  () => form.name,
  {
    'truthy': { '#name-label': { className: 'label floating' } },
    'falsy':  { '#name-label': { className: 'label' } }
  }
);
```

Uses `!!value === false`. Useful for "is anything here?" style checks.

---

## 5. `null` — Key: `'null'`

Matches when the value is strictly `null`.

```javascript
const profile = state({ avatar: null });

Conditions.whenState(
  () => profile.avatar,
  {
    'null':   { '#avatar': { src: '/default-avatar.png' } },
    'truthy': { '#avatar': { src: profile.avatar } }    // uses effect for dynamic src
  }
);
```

Uses `value === null`.

---

## 6. `undefined` — Key: `'undefined'`

Matches when the value is strictly `undefined`.

```javascript
const data = state({ result: undefined });

Conditions.whenState(
  () => data.result,
  {
    'undefined': { '#placeholder': { hidden: false } },
    'null':      { '#placeholder': { hidden: false } },
    'truthy':    { '#placeholder': { hidden: true  } }
  }
);
```

Uses `value === undefined`.

---

## 7. `empty` — Key: `'empty'`

Matches when the value is an **empty string** (`''`), **empty array** (`[]`), or **empty object** (`{}`).

```javascript
const list = state({ items: [] });

Conditions.whenState(
  () => list.items,
  {
    'empty':  { '#empty-state': { hidden: false }, '#list-container': { hidden: true  } },
    'truthy': { '#empty-state': { hidden: true  }, '#list-container': { hidden: false } }
  }
);

list.items = ['a', 'b'];  // → matches 'truthy'
list.items = [];          // → matches 'empty'
```

**How `empty` is determined:**
- `''` — empty string
- Array with `.length === 0`
- Object with no own keys (`Object.keys(value).length === 0`)

---

## 8. `quotedString` — Key: `"'value'"` or `'"value"'`

Matches when the value equals the string inside the quotes. Useful when your values look like numbers or booleans but are actually strings, and you want to be explicit.

```javascript
const page = state({ code: '200' });  // notice: string '200', not number 200

Conditions.whenState(
  () => page.code,
  {
    "'200'": { '#status': { className: 'status ok'       } },
    "'404'": { '#status': { className: 'status not-found' } },
    "'500'": { '#status': { className: 'status error'     } }
  }
);
```

**When to use:** Primarily for disambiguation — when a value like `'true'` is the actual string `"true"` (not boolean `true`), use `"'true'"` as the key to make this explicit.

```javascript
// The value is a string "true", not boolean true
const config = state({ mode: 'true' });  // string

Conditions.whenState(
  () => config.mode,
  {
    "'true'": { '#panel': { hidden: false } }  // matches string 'true'
    // vs:
    // 'true':  { ... }  — this matches boolean true, not the string 'true'
  }
);
```

---

## 9. `includes` — Key: `'includes:substring'`

Matches when the value **contains** the specified substring.

```javascript
const input = state({ email: '' });

Conditions.whenState(
  () => input.email,
  {
    'includes:@':       { '#email-hint': { hidden: true,  textContent: '' } },
    'includes:.':       { '#email-hint': { hidden: true,  textContent: '' } },
    'truthy':           { '#email-hint': { hidden: false, textContent: 'Enter a valid email' } },
    'falsy':            { '#email-hint': { hidden: true,  textContent: '' } }
  }
);
```

**Format:** `'includes:THE_SUBSTRING'`

```javascript
// Does value include 'error'?
'includes:error': { ... }

// Does value include a space?
'includes: ': { ... }

// Does value include '/'?
'includes:/': { ... }
```

Uses `value.includes(substring)`.

---

## 10. `startsWith` — Key: `'startsWith:prefix'`

Matches when the value **starts with** the specified prefix.

```javascript
const route = state({ path: '/dashboard' });

Conditions.whenState(
  () => route.path,
  {
    'startsWith:/dashboard': {
      '#nav-dashboard': { classList: { add: 'active' } }
    },
    'startsWith:/profile': {
      '#nav-profile': { classList: { add: 'active' } }
    },
    'startsWith:/settings': {
      '#nav-settings': { classList: { add: 'active' } }
    }
  }
);
```

**Format:** `'startsWith:PREFIX'`

Uses `value.startsWith(prefix)`.

---

## 11. `endsWith` — Key: `'endsWith:suffix'`

Matches when the value **ends with** the specified suffix.

```javascript
const file = state({ name: 'report.pdf' });

Conditions.whenState(
  () => file.name,
  {
    'endsWith:.pdf':  { '#file-icon': { className: 'icon icon-pdf'   } },
    'endsWith:.docx': { '#file-icon': { className: 'icon icon-word'  } },
    'endsWith:.xlsx': { '#file-icon': { className: 'icon icon-excel' } },
    'truthy':         { '#file-icon': { className: 'icon icon-file'  } }
  }
);
```

**Format:** `'endsWith:SUFFIX'`

Uses `value.endsWith(suffix)`.

---

## 12. `regex` — Key: `'/pattern/'` or `'/pattern/flags'`

Matches when the value matches the **regular expression** specified in the key.

```javascript
const input = state({ text: '' });

Conditions.whenState(
  () => input.text,
  {
    '/^\\d{4}-\\d{2}-\\d{2}$/': {
      '#date-hint': { textContent: 'Valid date format', className: 'hint valid' }
    },
    '/^\\d+$/': {
      '#date-hint': { textContent: 'Numbers only — add dashes', className: 'hint warn' }
    },
    'truthy': {
      '#date-hint': { textContent: 'Format: YYYY-MM-DD', className: 'hint info' }
    },
    'falsy': {
      '#date-hint': { textContent: '', className: 'hint' }
    }
  }
);
```

**Format:** `'/pattern/'` or `'/pattern/flags'`

```javascript
// Case-insensitive
'/^error/i': { ... }

// Multi-line
'/^start/m': { ... }

// With global flag (still tests, doesn't capture)
'/[aeiou]/g': { ... }

// Email pattern
'/^[^@]+@[^@]+\\.[^@]+$/': { '#valid-icon': { hidden: false } }
```

The key is parsed: the content between the outer slashes becomes the pattern, and any characters after the closing `/` become the flags. Uses `new RegExp(pattern, flags).test(value)`.

---

## 13. `numericRange` — Key: `'min-max'`

Matches when the numeric value falls **within a range** (inclusive on both ends).

```javascript
const score = state({ value: 0 });

Conditions.whenState(
  () => score.value,
  {
    '0-59':   { '#grade': { textContent: 'F', className: 'grade f' } },
    '60-69':  { '#grade': { textContent: 'D', className: 'grade d' } },
    '70-79':  { '#grade': { textContent: 'C', className: 'grade c' } },
    '80-89':  { '#grade': { textContent: 'B', className: 'grade b' } },
    '90-100': { '#grade': { textContent: 'A', className: 'grade a' } }
  }
);

score.value = 85;  // → matches '80-89', shows 'B'
```

**Format:** `'MIN-MAX'` where both are numeric.

```javascript
// Password strength by length
'0-5':   { '#strength': { textContent: 'Too Short',  className: 'strength weak'   } },
'6-9':   { '#strength': { textContent: 'Weak',       className: 'strength weak'   } },
'10-15': { '#strength': { textContent: 'Good',       className: 'strength good'   } },
'16-99': { '#strength': { textContent: 'Strong',     className: 'strength strong' } }
```

Uses `value >= min && value <= max`.

---

## 14. `numericExact` — Key: `'42'` (plain number string)

Matches when the numeric value is **exactly equal** to the number in the key.

```javascript
const steps = state({ current: 1 });

Conditions.whenState(
  () => steps.current,
  {
    '1': { '#step1': { classList: { add: 'active' } }, '#step2': { classList: { remove: 'active' } } },
    '2': { '#step1': { classList: { remove: 'active' } }, '#step2': { classList: { add: 'active' } } },
    '3': { '#step1': { classList: { remove: 'active' } }, '#step3': { classList: { add: 'active' } } }
  }
);
```

**Format:** A plain number string like `'1'`, `'42'`, `'100'`.

Uses `value === Number(key)`. Handles coercion — value of `42` matches key `'42'`.

---

## 15. `greaterThan` and `greaterThanOrEqual` — Keys: `'>N'`, `'>=N'`

Matches when the numeric value is **greater than** (or equal to) the number in the key.

```javascript
const cart = state({ itemCount: 0 });

Conditions.whenState(
  () => cart.itemCount,
  {
    '0':   { '#cart-badge': { hidden: true } },
    '>0':  { '#cart-badge': { hidden: false } },
    '>99': { '#cart-badge': { textContent: '99+' } }
  }
);

cart.itemCount = 5;   // → matches '>0' (first match wins; 0 doesn't match)
cart.itemCount = 150; // → matches '>0', but WAIT — '>99' also matches...
```

**Important note about first-match behavior:**

Since the system returns the **first match**, put more specific conditions before less specific ones:

```javascript
// ✅ Specific before general
{
  '0':   { '#badge': { hidden: true } },
  '>99': { '#badge': { textContent: '99+', hidden: false } },  // checked before '>0'
  '>0':  { '#badge': { hidden: false } }
}

// When count is 150:
//   '0'   → no match
//   '>99' → match! → applies '99+' label
//   '>0'  → never checked
```

**Format:** `'>N'` or `'>=N'`

```javascript
'>0':   { ... }   // value > 0
'>=1':  { ... }   // value >= 1
'>100': { ... }   // value > 100
'>=18': { ... }   // value >= 18 (legal adult check)
```

---

## 16. `lessThan` and `lessThanOrEqual` — Keys: `'<N'`, `'<=N'`

Matches when the numeric value is **less than** (or equal to) the number in the key.

```javascript
const timer = state({ secondsLeft: 60 });

Conditions.whenState(
  () => timer.secondsLeft,
  {
    '0':    { '#timer': { className: 'timer expired', textContent: 'Time is up!' } },
    '<10':  { '#timer': { className: 'timer urgent'   } },
    '<30':  { '#timer': { className: 'timer warning'  } },
    '>=30': { '#timer': { className: 'timer normal'   } }
  }
);
```

**Format:** `'<N'` or `'<=N'`

```javascript
'<0':   { ... }   // value < 0 (negative)
'<=0':  { ... }   // value <= 0
'<100': { ... }   // value < 100
'<=18': { ... }   // value <= 18
```

---

## 17. `stringEquality` — Fallback (any plain string)

The **last resort** matcher. If no other matcher claims a key, this one handles it with a strict string equality comparison.

```javascript
const status = state({ code: 'success' });

Conditions.whenState(
  () => status.code,
  {
    'success': { '#panel': { className: 'panel success' } },
    'error':   { '#panel': { className: 'panel error'   } },
    'loading': { '#panel': { className: 'panel loading' } }
  }
);
```

This is the most common matcher you'll use — and the default for everyday string state values.

Uses `value === key` (strict equality, coerced to string).

---

## Quick Reference Table

| Key Format | Matcher | Example Key | Matches When |
|------------|---------|-------------|--------------|
| `'true'` | booleanTrue | `'true'` | `value === true` |
| `'false'` | booleanFalse | `'false'` | `value === false` |
| `'truthy'` | truthy | `'truthy'` | `!!value` |
| `'falsy'` | falsy | `'falsy'` | `!value` |
| `'null'` | null | `'null'` | `value === null` |
| `'undefined'` | undefined | `'undefined'` | `value === undefined` |
| `'empty'` | empty | `'empty'` | empty string/array/object |
| `"'str'"` | quotedString | `"'hello'"` | `value === 'hello'` |
| `'includes:x'` | includes | `'includes:@'` | `value.includes('@')` |
| `'startsWith:x'` | startsWith | `'startsWith:/api'` | `value.startsWith('/api')` |
| `'endsWith:x'` | endsWith | `'endsWith:.pdf'` | `value.endsWith('.pdf')` |
| `'/pattern/'` | regex | `'/^\\d+$/'` | `/^\d+$/.test(value)` |
| `'5-10'` | numericRange | `'1-100'` | `value >= 1 && value <= 100` |
| `'42'` | numericExact | `'42'` | `value === 42` |
| `'>N'` / `'>=N'` | greaterThan | `'>0'` | `value > 0` |
| `'<N'` / `'<=N'` | lessThan | `'<10'` | `value < 10` |
| `'anything'` | stringEquality | `'loading'` | `value === 'loading'` |

---

## Mixing Matchers in One `whenState()`

You can freely mix different matcher types in a single conditions object:

```javascript
const password = state({ value: '' });

Conditions.whenState(
  () => password.value.length,  // watch the length
  {
    '0':    { '#strength': { textContent: '', className: 'strength' } },
    '1-5':  { '#strength': { textContent: 'Too short', className: 'strength weak' } },
    '6-11': { '#strength': { textContent: 'Weak',      className: 'strength weak' } },
    '>=12': { '#strength': { textContent: 'Strong',    className: 'strength strong' } }
  }
);

// And separately, validate the content pattern
Conditions.whenState(
  () => password.value,
  {
    '/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%])/.test(value)': { ... },
    // Better — use regex key directly:
    '/[A-Z]/': { '#has-upper': { className: 'req met' } },
    'falsy':   { '#has-upper': { className: 'req' } }
  }
);
```

Each call to `whenState()` independently watches and matches — mix and match freely.

---

## Practical Examples

### User Permissions by Role

```javascript
const auth = state({ role: 'guest' });

Conditions.whenState(
  () => auth.role,
  {
    'admin': {
      '#admin-nav':  { hidden: false },
      '#user-nav':   { hidden: false },
      '#guest-nav':  { hidden: true  }
    },
    'user': {
      '#admin-nav':  { hidden: true  },
      '#user-nav':   { hidden: false },
      '#guest-nav':  { hidden: true  }
    },
    'guest': {
      '#admin-nav':  { hidden: true  },
      '#user-nav':   { hidden: true  },
      '#guest-nav':  { hidden: false }
    }
  }
);
```

### File Type Icon

```javascript
const upload = state({ fileName: '' });

Conditions.whenState(
  () => upload.fileName,
  {
    'endsWith:.pdf':   { '#icon': { className: 'icon-pdf'   } },
    'endsWith:.doc':   { '#icon': { className: 'icon-word'  } },
    'endsWith:.docx':  { '#icon': { className: 'icon-word'  } },
    'endsWith:.xls':   { '#icon': { className: 'icon-excel' } },
    'endsWith:.xlsx':  { '#icon': { className: 'icon-excel' } },
    'endsWith:.jpg':   { '#icon': { className: 'icon-image' } },
    'endsWith:.png':   { '#icon': { className: 'icon-image' } },
    'truthy':          { '#icon': { className: 'icon-file'  } },
    'falsy':           { '#icon': { className: 'icon-empty' } }
  }
);
```

### Count Badge

```javascript
const notifications = state({ count: 0 });

Conditions.whenState(
  () => notifications.count,
  {
    '0':   { '#badge': { hidden: true } },
    '>99': { '#badge': { hidden: false, textContent: '99+' } },
    '>0':  { '#badge': { hidden: false, textContent: String(notifications.count) } }
  }
);

// Note: for truly dynamic text, use effect() alongside:
effect(() => {
  if (notifications.count > 0 && notifications.count <= 99) {
    document.getElementById('badge').textContent = notifications.count;
  }
});
```

### Email Validation Feedback

```javascript
const form = state({ email: '' });

Conditions.whenState(
  () => form.email,
  {
    'falsy':                       { '#hint': { textContent: '', className: 'hint' } },
    '/^[^@]+@[^@]+\\.[^@]+$/':    { '#hint': { textContent: '✓ Valid email', className: 'hint valid' } },
    'includes:@':                  { '#hint': { textContent: 'Add a domain', className: 'hint warn' } },
    'truthy':                      { '#hint': { textContent: 'Include @', className: 'hint warn' } }
  }
);
```

### Async Status with Progress

```javascript
const upload = state({ status: 'idle', progress: 0 });

Conditions.whenState(
  () => upload.status,
  {
    'idle': {
      '#upload-btn':  { disabled: false, textContent: 'Upload' },
      '#progress':    { hidden: true },
      '#result':      { hidden: true }
    },
    'uploading': {
      '#upload-btn':  { disabled: true,  textContent: 'Uploading…' },
      '#progress':    { hidden: false },
      '#result':      { hidden: true }
    },
    'done': {
      '#upload-btn':  { disabled: false, textContent: 'Upload Another' },
      '#progress':    { hidden: true },
      '#result':      { hidden: false }
    },
    'error': {
      '#upload-btn':  { disabled: false, textContent: 'Retry' },
      '#progress':    { hidden: true },
      '#result':      { hidden: true }
    }
  }
);

// Track progress dynamically alongside
effect(() => {
  if (upload.status === 'uploading') {
    document.getElementById('progress-bar').update({
      style: { width: `${upload.progress}%` },
      setAttribute: { 'aria-valuenow': upload.progress }
    });
  }
});
```

---

## Understanding Matcher Priority

A key insight: the system tests matchers in a **fixed priority order** (1–17 above). This means if you write a key that could technically match multiple matchers, the **higher priority** one wins.

```javascript
// Key: '0'
// Could be: numericExact (matches 0 === 0)
// Could be: stringEquality (matches value === '0')
// Priority: numericExact (14) runs before stringEquality (17)
// → numericExact wins: matches value === 0 (number)

// Key: 'true'
// Could be: booleanTrue (matches true === true)
// Could be: stringEquality (matches value === 'true')
// Priority: booleanTrue (1) runs before stringEquality (17)
// → booleanTrue wins: matches boolean true, not string 'true'
```

If you need to force string matching for a value that looks like a number or boolean, use the **quotedString** matcher:

```javascript
// Force string equality for the string '0':
"'0'": { ... }   // matches the string '0', not the number 0

// Force string equality for the string 'true':
"'true'": { ... }  // matches the string 'true', not boolean true
```

---

## Summary

- Conditions uses a **strategy-pattern matcher registry** — each key in your conditions object is tested against matchers in priority order, and the first matcher that recognizes the key format handles the comparison
- **17 built-in matchers** cover: booleans, truthy/falsy, null/undefined/empty, quoted strings, substring tests, regex, numeric ranges, numeric exact, greater/less than, and plain string equality
- **Priority order matters** — `'true'` matches boolean `true` (not string), `'42'` matches number `42` (not string), because more specialized matchers run first
- Use **quotedString** (`"'value'"`) when you need to force string equality for values that look like numbers or booleans
- **Condition key order in your object matters** — first match wins, so put specific conditions before general ones
- **Mix and match** freely — one `whenState()` call can use regex, numeric, truthy, and string matchers all at once

---

Continue to: [04 — Property Handlers](./04_property-handlers.md)