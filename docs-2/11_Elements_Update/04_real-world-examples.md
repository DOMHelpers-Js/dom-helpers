[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Real-World Examples

`Elements.update()` in action — solving real problems you'll encounter building web UIs.

---

## Quick Start (30 Seconds)

```javascript
// The pattern: one function per UI state, one Elements.update() call
function setFormLoading() {
  Elements.update({
    emailInput:    { disabled: true },
    passwordInput: { disabled: true },
    loginBtn:      { disabled: true, textContent: 'Signing in...' },
    errorMsg:      { style: { display: 'none' } }
  });
}
```

Each example below follows this pattern: one `Elements.update()` call describes one complete UI state.

---

## Example 1: Login Form State Machine

A login form that transitions through four states: idle, loading, error, and success.

```html
<input id="emailInput" type="email" />
<input id="passwordInput" type="password" />
<button id="loginBtn">Login</button>
<div id="loginError" style="display: none;"></div>
<div id="loadingSpinner" style="display: none;">Loading...</div>
```

```javascript
// State 1: Idle (ready for input)
function setFormIdle() {
  Elements.update({
    emailInput:    { disabled: false },
    passwordInput: { disabled: false },
    loginBtn:      { disabled: false, textContent: 'Login' },
    loginError:    { style: { display: 'none' } },
    loadingSpinner:{ style: { display: 'none' } }
  });
}

// State 2: Loading (waiting for response)
function setFormLoading() {
  Elements.update({
    emailInput:    { disabled: true },
    passwordInput: { disabled: true },
    loginBtn:      { disabled: true, textContent: 'Signing in...' },
    loginError:    { style: { display: 'none' } },
    loadingSpinner:{ style: { display: 'flex' } }
  });
}

// State 3: Error (invalid credentials)
function setFormError(message) {
  Elements.update({
    emailInput:    { disabled: false },
    passwordInput: { disabled: false },
    loginBtn:      { disabled: false, textContent: 'Try Again' },
    loginError: {
      textContent: message,
      style: { display: 'block', color: '#dc2626', backgroundColor: '#fef2f2' }
    },
    loadingSpinner:{ style: { display: 'none' } }
  });
}

// State 4: Success
function setFormSuccess() {
  Elements.update({
    loginBtn: {
      textContent: 'Welcome!',
      disabled: true,
      style: { backgroundColor: '#16a34a', color: 'white' }
    },
    loginError:    { style: { display: 'none' } },
    loadingSpinner:{ style: { display: 'none' } }
  });
}

// Usage
async function handleLogin(email, password) {
  setFormLoading();
  try {
    await loginUser(email, password);
    setFormSuccess();
  } catch (err) {
    setFormError(err.message);
  }
}
```

---

## Example 2: User Profile Loader

Load and display a user profile, with a loading skeleton while fetching.

```javascript
async function loadUserProfile(userId) {
  // Show loading skeleton
  Elements.update({
    profileName:   { textContent: '...' },
    profileEmail:  { textContent: '...' },
    profileBio:    { textContent: 'Loading...' },
    profileStatus: { textContent: '...', style: { color: '#9ca3af' } },
    profileAvatar: { style: { opacity: '0.4', filter: 'blur(4px)' } },
    profileSaveBtn:{ disabled: true }
  });

  try {
    const user = await fetchUser(userId);

    Elements.update({
      profileName: {
        textContent: user.name,
        style: { fontWeight: 'bold' }
      },
      profileEmail:  { textContent: user.email },
      profileBio:    { textContent: user.bio || 'No bio provided' },
      profileStatus: {
        textContent: user.isOnline ? 'Online' : `Last seen ${user.lastSeen}`,
        style: { color: user.isOnline ? '#16a34a' : '#6b7280' }
      },
      profileAvatar: {
        setAttribute: { src: user.avatarUrl, alt: `${user.name}'s avatar` },
        style: { opacity: '1', filter: 'none' }
      },
      profileSaveBtn: { disabled: false }
    });
  } catch (error) {
    Elements.update({
      profileName:   { textContent: 'Failed to load profile' },
      profileStatus: { textContent: 'Error', style: { color: '#dc2626' } },
      profileSaveBtn:{ disabled: true }
    });
  }
}
```

---

## Example 3: Shopping Cart Summary

Update the cart display whenever items change.

```javascript
function updateCartSummary(cart) {
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal  = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax       = subtotal * 0.08;
  const total     = subtotal + tax;
  const hasItems  = itemCount > 0;

  Elements.update({
    cartItemCount: {
      textContent: itemCount.toString(),
      style: { display: hasItems ? 'inline-flex' : 'none' }
    },
    cartSubtotal: { textContent: `$${subtotal.toFixed(2)}` },
    cartTax:      { textContent: `$${tax.toFixed(2)}` },
    cartTotal: {
      textContent: `$${total.toFixed(2)}`,
      style: { fontWeight: 'bold', fontSize: '20px' }
    },
    checkoutBtn: {
      disabled: !hasItems,
      textContent: hasItems ? `Checkout (${itemCount} items)` : 'Your cart is empty',
      style: {
        opacity: hasItems ? '1' : '0.5',
        cursor: hasItems ? 'pointer' : 'not-allowed'
      }
    },
    emptyCartMsg: {
      style: { display: hasItems ? 'none' : 'block' }
    }
  });
}
```

---

## Example 4: Form Validation Feedback

Display per-field validation errors and gate the submit button.

```javascript
function showValidationResults(errors) {
  const isValid = Object.keys(errors).length === 0;

  Elements.update({
    // Email field
    emailInput: {
      classList: {
        add: errors.email ? 'field-error' : 'field-valid',
        remove: errors.email ? 'field-valid' : 'field-error'
      },
      setAttribute: { 'aria-invalid': errors.email ? 'true' : 'false' }
    },
    emailErrorMsg: {
      textContent: errors.email || '',
      style: { display: errors.email ? 'block' : 'none' }
    },

    // Password field
    passwordInput: {
      classList: {
        add: errors.password ? 'field-error' : 'field-valid',
        remove: errors.password ? 'field-valid' : 'field-error'
      },
      setAttribute: { 'aria-invalid': errors.password ? 'true' : 'false' }
    },
    passwordErrorMsg: {
      textContent: errors.password || '',
      style: { display: errors.password ? 'block' : 'none' }
    },

    // Terms
    termsErrorMsg: {
      textContent: errors.terms || '',
      style: { display: errors.terms ? 'block' : 'none' }
    },

    // Submit button
    submitBtn: {
      disabled: !isValid,
      style: { opacity: isValid ? '1' : '0.6' }
    }
  });
}
```

---

## Example 5: Dashboard Live Metrics

Update a live dashboard when new data arrives.

```javascript
function updateDashboardMetrics(metrics) {
  Elements.update({
    totalUsersCount: {
      textContent: metrics.users.toLocaleString(),
      style: { color: metrics.usersGrowth > 0 ? '#16a34a' : '#dc2626' }
    },
    usersChangeLabel: {
      textContent: `${metrics.usersGrowth > 0 ? '+' : ''}${metrics.usersGrowth}% this month`,
      classList: {
        add: metrics.usersGrowth > 0 ? 'trend-up' : 'trend-down',
        remove: metrics.usersGrowth > 0 ? 'trend-down' : 'trend-up'
      }
    },
    totalRevenueAmount: {
      textContent: `$${metrics.revenue.toLocaleString()}`
    },
    activeSessionsCount: {
      textContent: metrics.activeSessions.toLocaleString()
    },
    lastUpdatedTime: {
      textContent: `Updated ${new Date().toLocaleTimeString()}`
    },
    refreshMetricsBtn: {
      disabled: false,
      textContent: 'Refresh'
    }
  });
}
```

---

## Example 6: Modal Dialog

Show and hide a modal with full accessibility attributes.

```javascript
function showModal({ title, message, type = 'info', confirmLabel = 'OK' }) {
  Elements.update({
    modalOverlay: {
      style: { display: 'flex' },
      setAttribute: { 'aria-hidden': 'false' }
    },
    modalDialog: {
      classList: { add: 'modal-open', remove: 'modal-closed' },
      setAttribute: { 'role': 'dialog', 'aria-modal': 'true' }
    },
    modalTitle:   { textContent: title },
    modalMessage: { textContent: message },
    modalIcon: {
      classList: {
        remove: ['icon-info', 'icon-success', 'icon-error', 'icon-warning'],
        add: `icon-${type}`
      }
    },
    modalConfirmBtn: {
      textContent: confirmLabel,
      classList: {
        remove: ['btn-info', 'btn-success', 'btn-error'],
        add: `btn-${type}`
      },
      focus: []  // Move focus into modal for accessibility
    }
  });
}

function hideModal() {
  Elements.update({
    modalOverlay: {
      style: { display: 'none' },
      setAttribute: { 'aria-hidden': 'true' }
    },
    modalDialog: {
      classList: { add: 'modal-closed', remove: 'modal-open' }
    }
  });
}
```

---

## Example 7: File Upload Progress

Track and display upload status.

```javascript
function updateUploadState({ filename, progress, status, error }) {
  Elements.update({
    uploadFilename: {
      textContent: filename || 'No file selected'
    },
    uploadProgressBar: {
      style: { width: `${progress}%` },
      setAttribute: { 'aria-valuenow': progress.toString() }
    },
    uploadProgressLabel: {
      textContent: `${progress}%`
    },
    uploadStatusMsg: {
      textContent: status === 'uploading' ? 'Uploading...'
                 : status === 'complete'  ? 'Upload complete!'
                 : status === 'error'     ? error
                 : 'Ready to upload',
      style: {
        color: status === 'complete' ? '#16a34a'
             : status === 'error'    ? '#dc2626'
             : '#6b7280'
      }
    },
    cancelUploadBtn: {
      style: { display: status === 'uploading' ? 'inline-flex' : 'none' }
    },
    retryUploadBtn: {
      style: { display: status === 'error' ? 'inline-flex' : 'none' }
    }
  });
}
```

---

## Example 8: Search Results Interface

Update the search UI based on query and results.

```javascript
function updateSearchInterface(query, results) {
  const hasQuery   = query.trim().length > 0;
  const hasResults = results.length > 0;

  Elements.update({
    searchQueryLabel: {
      textContent: hasQuery ? `Results for "${query}"` : 'Search results',
      style: { display: hasQuery ? 'block' : 'none' }
    },
    searchResultCount: {
      textContent: hasResults
        ? `${results.length} result${results.length === 1 ? '' : 's'} found`
        : 'No results found'
    },
    resultsContainer: {
      style: { display: hasResults ? 'block' : 'none' }
    },
    noResultsMessage: {
      style: { display: !hasResults && hasQuery ? 'block' : 'none' }
    },
    clearSearchBtn: {
      style: { display: hasQuery ? 'inline-flex' : 'none' }
    }
  });
}
```

---

## Example 9: Notification Toast

Show auto-dismissing notifications.

```javascript
function showNotification(message, type = 'info', duration = 4000) {
  const colorMap = {
    info:    '#3b82f6',
    success: '#16a34a',
    warning: '#d97706',
    error:   '#dc2626'
  };

  Elements.update({
    notificationToast: {
      textContent: message,
      style: { display: 'flex', backgroundColor: colorMap[type] || colorMap.info, color: 'white' },
      classList: { add: 'toast-visible', remove: 'toast-hidden' },
      setAttribute: {
        'role': type === 'error' ? 'alert' : 'status',
        'aria-live': type === 'error' ? 'assertive' : 'polite'
      }
    }
  });

  setTimeout(() => {
    Elements.update({
      notificationToast: {
        classList: { add: 'toast-hidden', remove: 'toast-visible' },
        style: { display: 'none' }
      }
    });
  }, duration);
}

showNotification('Settings saved!', 'success');
showNotification('Invalid email address', 'error');
```

---

## Example 10: Theme Switcher

Toggle between light and dark themes.

```javascript
function applyTheme(theme) {
  const isDark = theme === 'dark';

  Elements.update({
    appHeader: {
      style: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
      }
    },
    mainContent: {
      style: {
        backgroundColor: isDark ? '#111827' : '#f9fafb',
        color: isDark ? '#f3f4f6' : '#1f2937'
      }
    },
    sidebarPanel: {
      style: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderRight: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
      }
    },
    themeToggleBtn: {
      textContent: isDark ? 'Switch to Light' : 'Switch to Dark',
      setAttribute: {
        'aria-label': `Switch to ${isDark ? 'light' : 'dark'} mode`,
        'data-theme': theme
      }
    }
  });

  localStorage.setItem('preferred-theme', theme);
}

applyTheme(localStorage.getItem('preferred-theme') || 'light');
```

---

## Common Patterns Summary

### Pattern 1: State Functions

```javascript
function setLoadingState() { Elements.update({ /* loading state */ }); }
function setErrorState(msg) { Elements.update({ /* error state */ }); }
function setSuccessState()  { Elements.update({ /* success state */ }); }
```

### Pattern 2: Data-Driven Updates

```javascript
async function refreshData() {
  const data = await fetchData();
  Elements.update({
    metricA: { textContent: data.a.toString() },
    metricB: { textContent: data.b.toString() }
  });
}
```

### Pattern 3: Show/Hide Toggle

```javascript
function setLoading(isLoading) {
  Elements.update({
    spinner:   { style: { display: isLoading ? 'flex' : 'none' } },
    content:   { style: { display: isLoading ? 'none' : 'block' } },
    actionBtn: { disabled: isLoading }
  });
}
```

---

## Key Takeaways

1. **One function per state** — each UI state has one `Elements.update()` call
2. **All changes visible** — the complete state change is in one block
3. **Works for everything** — forms, dashboards, modals, notifications, themes
4. **Accessibility included** — add ARIA attributes alongside visual updates
5. **Always handle errors** — loading, success, and error are all first-class states

---

## What's Next?

- **Chapter 5**: Update object properties — every property type in detail
- **Chapter 6**: The return value — verifying updates and using element references