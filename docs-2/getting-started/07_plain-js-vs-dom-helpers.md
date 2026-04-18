[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Plain JavaScript vs DOM Helpers

## What This Comparison Shows

This section presents the same feature built twice — once in plain JavaScript and once using DOM Helpers. The feature is a user profile panel: it loads saved user data on page load, lets the user edit their display name, and saves the updated data back to storage.

Reading both versions side by side makes visible what DOM Helpers changes structurally, not just syntactically.

---

## The HTML

Both versions use the same HTML:

```html
<div id="profilePanel">
  <img id="userAvatar" src="" alt="User avatar">
  <h2 id="displayName"></h2>
  <p id="userEmail"></p>
  <p id="memberSince"></p>
  <span id="statusBadge"></span>

  <div id="editSection" style="display: none;">
    <input type="text" id="nameInput" placeholder="Enter display name">
    <p id="editError" style="display: none;"></p>
    <button id="saveBtn">Save</button>
    <button id="cancelBtn">Cancel</button>
  </div>

  <button id="editBtn">Edit Profile</button>
</div>
```

---

## Version 1 — Plain JavaScript

```javascript
// Load saved user from localStorage
let user;
try {
  user = JSON.parse(localStorage.getItem('currentUser')) || {
    name: 'Guest',
    email: '',
    avatar: '/default-avatar.png',
    joined: '',
    status: 'offline'
  };
} catch (e) {
  user = { name: 'Guest', email: '', avatar: '/default-avatar.png', joined: '', status: 'offline' };
}

// Find all elements
const userAvatarEl  = document.getElementById('userAvatar');
const displayNameEl = document.getElementById('displayName');
const userEmailEl   = document.getElementById('userEmail');
const memberSinceEl = document.getElementById('memberSince');
const statusBadgeEl = document.getElementById('statusBadge');
const editSectionEl = document.getElementById('editSection');
const nameInputEl   = document.getElementById('nameInput');
const editErrorEl   = document.getElementById('editError');
const saveBtnEl     = document.getElementById('saveBtn');
const cancelBtnEl   = document.getElementById('cancelBtn');
const editBtnEl     = document.getElementById('editBtn');

// Populate the profile
userAvatarEl.src      = user.avatar;
userAvatarEl.alt      = user.name + ' avatar';
displayNameEl.textContent = user.name;
userEmailEl.textContent   = user.email;
memberSinceEl.textContent = 'Member since ' + user.joined;
statusBadgeEl.textContent = user.status;
statusBadgeEl.className   = 'badge ' + user.status;

// Edit button — show the edit section
editBtnEl.addEventListener('click', () => {
  editSectionEl.style.display = 'block';
  editBtnEl.style.display     = 'none';
  nameInputEl.value           = user.name;
  editErrorEl.style.display   = 'none';
  editErrorEl.textContent     = '';
});

// Cancel button — hide the edit section
cancelBtnEl.addEventListener('click', () => {
  editSectionEl.style.display = 'none';
  editBtnEl.style.display     = 'block';
  nameInputEl.value           = '';
  editErrorEl.style.display   = 'none';
});

// Save button — validate and save
saveBtnEl.addEventListener('click', () => {
  const newName = nameInputEl.value.trim();

  if (!newName) {
    editErrorEl.textContent     = 'Name cannot be empty.';
    editErrorEl.style.display   = 'block';
    editErrorEl.style.color     = 'red';
    return;
  }

  if (newName.length > 50) {
    editErrorEl.textContent     = 'Name must be 50 characters or fewer.';
    editErrorEl.style.display   = 'block';
    editErrorEl.style.color     = 'red';
    return;
  }

  // Update user object
  user.name = newName;

  // Update DOM
  displayNameEl.textContent   = user.name;
  userAvatarEl.alt            = user.name + ' avatar';
  editSectionEl.style.display = 'none';
  editBtnEl.style.display     = 'block';
  nameInputEl.value           = '';
  editErrorEl.style.display   = 'none';

  // Save to localStorage
  try {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user:', e);
  }
});
```

### What to notice in the plain JavaScript version

The function doing the save has to know about six DOM elements. It reads the input, validates, updates four separate elements, resets two more, then writes to localStorage. All of that lives in one block of code. The DOM update is tangled with the validation logic and the storage write.

Finding elements requires `document.getElementById` repeated eleven times. If an element is renamed, you find all the places it appears by searching manually.

`localStorage` requires manual `JSON.stringify` on write and `JSON.parse` on read, wrapped in `try/catch` because a corrupted storage value would throw.

There is no shared pattern for what "updating an element" looks like. Some updates use `.textContent`, some use `.src`, some use `.style.display`, some use `.className`. Every type of change has its own syntax.

---

## Version 2 — DOM Helpers

```javascript
// Load saved user — StorageUtils handles JSON parsing and defaults
const user = StorageUtils.load('currentUser', {
  name: 'Guest',
  email: '',
  avatar: '/default-avatar.png',
  joined: '',
  status: 'offline'
});

// Populate the profile — one call, all elements at once
Elements.update({
  userAvatar:   { setAttribute: { src: user.avatar, alt: user.name + ' avatar' } },
  displayName:  { textContent: user.name },
  userEmail:    { textContent: user.email },
  memberSince:  { textContent: 'Member since ' + user.joined },
  statusBadge:  { textContent: user.status, className: 'badge ' + user.status }
});

// Create a reactive state to track editing mode
const editMode = state({ value: 'idle' });

// Describe what the DOM looks like in each state
Conditions.whenState(
  () => editMode.value,
  {
    'idle': {
      '#editSection': { style: { display: 'none' } },
      '#editBtn':     { style: { display: 'block' } },
      '#editError':   { style: { display: 'none' } }
    },
    'editing': {
      '#editSection': { style: { display: 'block' } },
      '#editBtn':     { style: { display: 'none' } },
      '#editError':   { style: { display: 'none' } }
    },
    'error': {
      '#editSection': { style: { display: 'block' } },
      '#editBtn':     { style: { display: 'none' } }
    }
  }
);

// Edit button — just change state
Id('editBtn').update({
  addEventListener: {
    click: () => {
      Elements.nameInput.value = user.name;
      editMode.value = 'editing';
    }
  }
});

// Cancel button — just change state
Id('cancelBtn').update({
  addEventListener: {
    click: () => {
      Elements.nameInput.value = '';
      editMode.value = 'idle';
    }
  }
});

// Save button — validate, update, persist, change state
Id('saveBtn').update({
  addEventListener: {
    click: () => {
      const newName = Elements.nameInput.value.trim();

      if (!newName) {
        Elements.editError.update({
          textContent: 'Name cannot be empty.',
          style: { display: 'block', color: 'red' }
        });
        editMode.value = 'error';
        return;
      }

      if (newName.length > 50) {
        Elements.editError.update({
          textContent: 'Name must be 50 characters or fewer.',
          style: { display: 'block', color: 'red' }
        });
        editMode.value = 'error';
        return;
      }

      // Update the user object
      user.name = newName;

      // Update the profile display
      Elements.update({
        displayName: { textContent: user.name },
        userAvatar:  { setAttribute: { alt: user.name + ' avatar' } }
      });

      // Save to storage — StorageUtils handles serialization
      StorageUtils.save('currentUser', user);

      // Reset to idle state
      Elements.nameInput.value = '';
      editMode.value = 'idle';
    }
  }
});
```

### What to notice in the DOM Helpers version

**Element access is not repeated.** There is no list of `document.getElementById` calls at the top. Elements are accessed by name through `Elements.`, `Id()`, or by selector — only when needed.

**Initialization is a single, readable call.** `Elements.update()` populates all five profile fields in one object. The relationship between element IDs and their values is visible at a glance.

**State drives the UI.** The edit section showing or hiding is not managed by explicit `style.display = 'block'/'none'` calls scattered across multiple event handlers. It is defined once in the Conditions map and applied automatically when `editMode.value` changes.

**Each event handler has a single focus.** The edit button handler sets the input value and changes state. The cancel button handler clears the input and changes state. The save button handler validates, updates the DOM for the change that matters, saves to storage, and changes state. None of them manage the visibility of other elements — Conditions does that.

**Storage is one line.** `StorageUtils.save('currentUser', user)` handles serialization. `StorageUtils.load('currentUser', defaultValue)` handles parsing and provides a safe default. No try/catch, no `JSON.stringify`, no manual type coercion.

**Update syntax is consistent.** Whether you are setting text, a style, an attribute, or a class, the syntax is the same: a key-value pair inside an update object. There is one pattern to learn.

---

## What the Comparison Shows

The plain JavaScript version and the DOM Helpers version produce identical results in the browser. The differences are structural:

| Concern | Plain JavaScript | DOM Helpers |
|---|---|---|
| Element access | `document.getElementById(...)` × 11 | By name or shortcut, accessed on demand |
| Initial population | 6 separate property assignments | One `Elements.update()` call |
| State-driven UI | Explicit show/hide in each handler | Declared once in `Conditions.whenState()` |
| Storage | Manual `JSON.stringify`/`parse` + `try/catch` | `StorageUtils.save()` / `.load()` |
| Update syntax | Mixed: `.textContent`, `.style.x`, `.className`, `.setAttribute()` | Consistent: `{ property: value }` in `.update()` |
| Event handler focus | Mixed: logic + DOM + storage | Logic + state change only |

Neither approach is wrong for small pages. The differences become meaningful as the number of elements grows, as more states need to be managed, and as more developers work on the same code.

---

## What's Next

The following section points you toward the individual module documentation and explains what to learn first.

- **[What to Learn Next](./08_whats-next.md)** — a guided path through the documentation