# Complete Auto-Save Examples

## 1. Basic Auto-Save Pattern

```javascript
// ============================================================================
// BASIC AUTO-SAVE SETUP
// ============================================================================

// Create an auto-save manager
const autoSaver = StorageUtils.createAutoSave('myData', {
  debounce: 300,              // Wait 300ms after last change
  namespace: 'myApp',         // Namespace to avoid conflicts
  storage: 'localStorage',    // or 'sessionStorage'
  
  // Optional callbacks
  onSave: (data) => {
    console.log('✓ Saved to storage:', data);
  },
  onLoad: (data) => {
    console.log('✓ Loaded from storage:', data);
  }
});

// Save data (debounced - waits 300ms)
autoSaver.save({ count: 1 });
autoSaver.save({ count: 2 }); // Cancels previous
autoSaver.save({ count: 3 }); // Only this one will be saved after 300ms

// Save immediately (no debounce)
autoSaver.saveNow({ count: 100 });

// Load data
const data = autoSaver.load({ count: 0 }); // Default if not found

// Clear from storage
autoSaver.clear();

// Stop/resume auto-saving
autoSaver.stop();
autoSaver.start();
```

## 2. Form Auto-Save (Most Common Use Case)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Form Auto-Save Example</title>
</head>
<body>
  <form id="contactForm">
    <input type="text" id="name" placeholder="Name">
    <input type="email" id="email" placeholder="Email">
    <textarea id="message" placeholder="Message"></textarea>
    <button type="submit">Submit</button>
    <button type="button" id="clearBtn">Clear Draft</button>
  </form>
  
  <div id="status"></div>

  <script src="01_dh-core.js"></script>
  <script src="01_dh-storage-standalone.js"></script>
  <script>
    // ========================================================================
    // FORM AUTO-SAVE WITH VISUAL FEEDBACK
    // ========================================================================
    
    const form = Elements.contactForm;
    const status = Elements.status;
    
    // Create auto-save manager
    const formAutoSave = StorageUtils.createAutoSave('contactFormDraft', {
      debounce: 500,           // Save 500ms after user stops typing
      namespace: 'myApp',
      
      onSave: (data) => {
        // Show save indicator
        status.textContent = '✓ Draft saved';
        status.style.color = 'green';
        setTimeout(() => {
          status.textContent = '';
        }, 2000);
      },
      
      onLoad: (data) => {
        console.log('Draft restored:', data);
      }
    });
    
    // Load saved draft on page load
    const savedDraft = formAutoSave.load({
      name: '',
      email: '',
      message: ''
    });
    
    // Restore form values
    Elements.name.value = savedDraft.name;
    Elements.email.value = savedDraft.email;
    Elements.message.value = savedDraft.message;
    
    // Show restoration message if draft exists
    if (savedDraft.name || savedDraft.email || savedDraft.message) {
      status.textContent = 'Draft restored';
      status.style.color = 'blue';
      setTimeout(() => {
        status.textContent = '';
      }, 3000);
    }
    
    // Auto-save on every input change
    function saveFormData() {
      const formData = {
        name: Elements.name.value,
        email: Elements.email.value,
        message: Elements.message.value
      };
      
      // Show saving indicator
      status.textContent = 'Saving draft...';
      status.style.color = 'orange';
      
      // Save (debounced)
      formAutoSave.save(formData);
    }
    
    // Attach event listeners
    Elements.name.addEventListener('input', saveFormData);
    Elements.email.addEventListener('input', saveFormData);
    Elements.message.addEventListener('input', saveFormData);
    
    // Clear draft button
    Elements.clearBtn.addEventListener('click', () => {
      // Clear form
      Elements.name.value = '';
      Elements.email.value = '';
      Elements.message.value = '';
      
      // Clear storage
      formAutoSave.clear();
      
      status.textContent = 'Draft cleared';
      status.style.color = 'red';
      setTimeout(() => {
        status.textContent = '';
      }, 2000);
    });
    
    // Clear draft after successful submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Submit form data...
      console.log('Form submitted');
      
      // Clear the saved draft
      formAutoSave.clear();
      
      // Clear form
      form.reset();
      
      status.textContent = '✓ Form submitted!';
      status.style.color = 'green';
    });
  </script>
</body>
</html>
```

## 3. Auto-Save with DOM Helpers Collections

```javascript
// ============================================================================
// AUTO-SAVE MULTIPLE ITEMS WITH COLLECTIONS
// ============================================================================

// HTML:
// <div class="task-item" data-id="1">
//   <input type="checkbox" class="task-done">
//   <input type="text" class="task-text" value="Buy groceries">
// </div>
// (multiple task items...)

const taskAutoSave = StorageUtils.createAutoSave('taskList', {
  debounce: 300,
  namespace: 'todoApp',
  onSave: (data) => {
    console.log(`✓ Saved ${data.length} tasks`);
  }
});

// Load saved tasks
const savedTasks = taskAutoSave.load([]);

// Restore task states
savedTasks.forEach(task => {
  const taskItem = document.querySelector(`[data-id="${task.id}"]`);
  if (taskItem) {
    taskItem.querySelector('.task-done').checked = task.done;
    taskItem.querySelector('.task-text').value = task.text;
  }
});

// Function to gather all task data
function getAllTasks() {
  const tasks = [];
  
  // Using Collections helper
  Collections.ClassName['task-item'].forEach((item) => {
    const id = item.dataset.id;
    const done = item.querySelector('.task-done').checked;
    const text = item.querySelector('.task-text').value;
    
    tasks.push({ id, done, text });
  });
  
  return tasks;
}

// Auto-save when any task changes
function setupTaskAutoSave() {
  // Save on checkbox change
  Collections.ClassName['task-done'].forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      taskAutoSave.save(getAllTasks());
    });
  });
  
  // Save on text change
  Collections.ClassName['task-text'].forEach((input) => {
    input.addEventListener('input', () => {
      taskAutoSave.save(getAllTasks());
    });
  });
}

setupTaskAutoSave();

// Add new task
function addTask(text) {
  // Create task element...
  const newTask = document.createElement('div');
  // ... setup task ...
  
  // Re-setup auto-save for new elements
  setupTaskAutoSave();
  
  // Save immediately
  taskAutoSave.saveNow(getAllTasks());
}

// Clear all tasks
function clearAllTasks() {
  taskAutoSave.clear();
  // Remove DOM elements...
}
```

## 4. Auto-Save with Conditions Module

```javascript
// ============================================================================
// AUTO-SAVE WITH CONDITIONAL RENDERING
// ============================================================================

// State object
const editorState = {
  mode: 'edit',      // 'edit' or 'preview'
  content: '',
  lastSaved: null
};

// Auto-save manager
const editorAutoSave = StorageUtils.createAutoSave('editorContent', {
  debounce: 1000,    // Save 1 second after typing stops
  namespace: 'editor',
  
  onSave: (data) => {
    editorState.lastSaved = new Date().toLocaleTimeString();
    
    // Update UI with Conditions
    Conditions.apply(true, {
      true: {
        textContent: `Last saved: ${editorState.lastSaved}`,
        style: { color: 'green' }
      }
    }, '#saveStatus');
  }
});

// Load saved content
const savedContent = editorAutoSave.load({
  mode: 'edit',
  content: '',
  lastSaved: null
});

Object.assign(editorState, savedContent);

// Setup conditional UI
Conditions.apply(editorState.mode, {
  'edit': {
    textContent: 'Switch to Preview',
    onclick: () => {
      editorState.mode = 'preview';
      editorAutoSave.saveNow(editorState);
      updateUI();
    }
  },
  'preview': {
    textContent: 'Switch to Edit',
    onclick: () => {
      editorState.mode = 'edit';
      editorAutoSave.saveNow(editorState);
      updateUI();
    }
  }
}, '#modeToggle');

// Auto-save content on typing
Elements.editor.addEventListener('input', (e) => {
  editorState.content = e.target.value;
  
  // Show "Saving..." indicator
  Conditions.apply(true, {
    true: {
      textContent: 'Saving...',
      style: { color: 'orange' }
    }
  }, '#saveStatus');
  
  // Auto-save (debounced)
  editorAutoSave.save(editorState);
});

function updateUI() {
  // Update mode button
  Conditions.apply(editorState.mode, {
    'edit': { textContent: 'Switch to Preview' },
    'preview': { textContent: 'Switch to Edit' }
  }, '#modeToggle');
  
  // Show/hide editor
  Conditions.apply(editorState.mode, {
    'edit': { style: { display: 'block' } },
    'preview': { style: { display: 'none' } }
  }, '#editor');
  
  // Show/hide preview
  Conditions.apply(editorState.mode, {
    'edit': { style: { display: 'none' } },
    'preview': {
      style: { display: 'block' },
      innerHTML: editorState.content
    }
  }, '#preview');
}
```

## 5. Advanced: Settings Panel with Auto-Save

```javascript
// ============================================================================
// SETTINGS PANEL WITH MULTIPLE AUTO-SAVERS
// ============================================================================

// Different auto-savers for different settings categories
const settingsAutoSave = {
  // Theme settings (save immediately)
  theme: StorageUtils.createAutoSave('settings_theme', {
    debounce: 0,       // No debounce - save immediately
    namespace: 'app',
    onSave: (data) => console.log('Theme saved:', data)
  }),
  
  // Editor preferences (debounce for performance)
  editor: StorageUtils.createAutoSave('settings_editor', {
    debounce: 500,
    namespace: 'app',
    onSave: (data) => console.log('Editor settings saved:', data)
  }),
  
  // Privacy settings (save immediately, critical)
  privacy: StorageUtils.createAutoSave('settings_privacy', {
    debounce: 0,
    namespace: 'app',
    onSave: (data) => console.log('Privacy settings saved:', data)
  })
};

// Settings state
const settings = {
  theme: settingsAutoSave.theme.load({ dark: true, color: 'blue' }),
  editor: settingsAutoSave.editor.load({ fontSize: 14, lineHeight: 1.5 }),
  privacy: settingsAutoSave.privacy.load({ analytics: false, cookies: false })
};

// Apply theme on load
applyTheme(settings.theme);

// Theme toggle
Elements.darkModeToggle.addEventListener('change', (e) => {
  settings.theme.dark = e.target.checked;
  
  // Save immediately (no debounce)
  settingsAutoSave.theme.saveNow(settings.theme);
  
  // Apply theme
  applyTheme(settings.theme);
});

// Editor settings
Elements.fontSizeSlider.addEventListener('input', (e) => {
  settings.editor.fontSize = parseInt(e.target.value);
  
  // Save with debounce (user might still be adjusting)
  settingsAutoSave.editor.save(settings.editor);
  
  // Apply immediately
  applyEditorSettings(settings.editor);
});

// Privacy settings
Elements.analyticsToggle.addEventListener('change', (e) => {
  settings.privacy.analytics = e.target.checked;
  
  // Save immediately (critical setting)
  settingsAutoSave.privacy.saveNow(settings.privacy);
  
  // Enable/disable analytics
  if (settings.privacy.analytics) {
    enableAnalytics();
  } else {
    disableAnalytics();
  }
});

// Reset all settings
Elements.resetButton.addEventListener('click', () => {
  if (confirm('Reset all settings to defaults?')) {
    // Clear all auto-savers
    settingsAutoSave.theme.clear();
    settingsAutoSave.editor.clear();
    settingsAutoSave.privacy.clear();
    
    // Reset to defaults
    settings.theme = { dark: true, color: 'blue' };
    settings.editor = { fontSize: 14, lineHeight: 1.5 };
    settings.privacy = { analytics: false, cookies: false };
    
    // Apply defaults
    applyTheme(settings.theme);
    applyEditorSettings(settings.editor);
    
    // Update UI
    Elements.darkModeToggle.checked = settings.theme.dark;
    Elements.fontSizeSlider.value = settings.editor.fontSize;
    Elements.analyticsToggle.checked = settings.privacy.analytics;
  }
});

function applyTheme(theme) {
  document.body.classList.toggle('dark-mode', theme.dark);
  document.body.style.setProperty('--primary-color', theme.color);
}

function applyEditorSettings(editor) {
  Elements.editor.style.fontSize = `${editor.fontSize}px`;
  Elements.editor.style.lineHeight = editor.lineHeight;
}
```

## 6. Real-World: E-commerce Cart Auto-Save

```javascript
// ============================================================================
// SHOPPING CART AUTO-SAVE
// ============================================================================

const cartAutoSave = StorageUtils.createAutoSave('shoppingCart', {
  debounce: 300,
  namespace: 'shop',
  
  onSave: (cart) => {
    // Update cart badge
    Elements.cartBadge.textContent = cart.items.length;
    Elements.cartBadge.style.display = cart.items.length > 0 ? 'block' : 'none';
    
    console.log(`✓ Cart saved: ${cart.items.length} items, $${cart.total}`);
  },
  
  onLoad: (cart) => {
    console.log(`✓ Cart restored: ${cart.items.length} items`);
  }
});

// Cart state
const cart = cartAutoSave.load({
  items: [],
  total: 0,
  currency: 'USD'
});

// Calculate total
function calculateTotal() {
  cart.total = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
}

// Add item to cart
function addToCart(productId, name, price) {
  // Check if item already exists
  const existingItem = cart.items.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.items.push({
      productId,
      name,
      price,
      quantity: 1,
      addedAt: new Date().toISOString()
    });
  }
  
  calculateTotal();
  
  // Auto-save cart
  cartAutoSave.save(cart);
  
  // Update UI
  renderCart();
  
  // Show notification
  showNotification(`${name} added to cart`);
}

// Update quantity
function updateQuantity(productId, newQuantity) {
  const item = cart.items.find(item => item.productId === productId);
  
  if (!item) return;
  
  if (newQuantity <= 0) {
    // Remove item
    cart.items = cart.items.filter(item => item.productId !== productId);
  } else {
    item.quantity = newQuantity;
  }
  
  calculateTotal();
  
  // Auto-save cart
  cartAutoSave.save(cart);
  
  // Update UI
  renderCart();
}

// Remove item
function removeFromCart(productId) {
  const item = cart.items.find(item => item.productId === productId);
  
  if (!item) return;
  
  cart.items = cart.items.filter(item => item.productId !== productId);
  
  calculateTotal();
  
  // Auto-save immediately (user action)
  cartAutoSave.saveNow(cart);
  
  // Update UI
  renderCart();
  
  showNotification(`${item.name} removed from cart`);
}

// Clear cart
function clearCart() {
  if (confirm('Clear your cart?')) {
    cart.items = [];
    cart.total = 0;
    
    // Clear from storage
    cartAutoSave.clear();
    
    // Update UI
    renderCart();
    
    showNotification('Cart cleared');
  }
}

// Render cart UI
function renderCart() {
  const cartContainer = Elements.cartItems;
  
  if (cart.items.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty</p>';
    Elements.checkoutBtn.disabled = true;
    return;
  }
  
  cartContainer.innerHTML = cart.items.map(item => `
    <div class="cart-item" data-product-id="${item.productId}">
      <span class="item-name">${item.name}</span>
      <span class="item-price">$${item.price.toFixed(2)}</span>
      <input type="number" 
             class="item-quantity" 
             value="${item.quantity}" 
             min="0"
             data-product-id="${item.productId}">
      <button class="remove-item" data-product-id="${item.productId}">Remove</button>
    </div>
  `).join('');
  
  Elements.cartTotal.textContent = `$${cart.total.toFixed(2)}`;
  Elements.checkoutBtn.disabled = false;
  
  // Attach event listeners
  Collections.ClassName['item-quantity'].forEach(input => {
    input.addEventListener('change', (e) => {
      const productId = e.target.dataset.productId;
      const newQuantity = parseInt(e.target.value);
      updateQuantity(productId, newQuantity);
    });
  });
  
  Collections.ClassName['remove-item'].forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = e.target.dataset.productId;
      removeFromCart(productId);
    });
  });
}

// Checkout
Elements.checkoutBtn.addEventListener('click', () => {
  // Process checkout...
  console.log('Proceeding to checkout with:', cart);
  
  // After successful checkout, clear cart
  cart.items = [];
  cart.total = 0;
  cartAutoSave.clear();
  renderCart();
});

// Initialize: Render saved cart
renderCart();

// Restore cart notification
if (cart.items.length > 0) {
  showNotification(`Welcome back! You have ${cart.items.length} item(s) in your cart`);
}
```

## 7. Stop/Resume Auto-Save Pattern

```javascript
// ============================================================================
// CONTROL AUTO-SAVE: STOP AND RESUME
// ============================================================================

const documentAutoSave = StorageUtils.createAutoSave('document', {
  debounce: 1000,
  namespace: 'docs'
});

// Stop auto-save when user goes offline
window.addEventListener('offline', () => {
  documentAutoSave.stop();
  
  Elements.status.update({
    textContent: '⚠️ Offline - Auto-save paused',
    style: { color: 'red' }
  });
});

// Resume auto-save when back online
window.addEventListener('online', () => {
  documentAutoSave.start();
  
  Elements.status.update({
    textContent: '✓ Online - Auto-save resumed',
    style: { color: 'green' }
  });
  
  // Save immediately when reconnected
  const content = Elements.editor.value;
  documentAutoSave.saveNow({ content, timestamp: Date.now() });
});

// Manual save button (saves even if auto-save is stopped)
Elements.saveBtn.addEventListener('click', () => {
  const content = Elements.editor.value;
  documentAutoSave.saveNow({ content, timestamp: Date.now() });
  
  Elements.status.update({
    textContent: '✓ Saved manually',
    style: { color: 'green' }
  });
});

// Check auto-save status
if (documentAutoSave.isStopped) {
  console.log('Auto-save is currently stopped');
}
```

These examples cover the most important auto-save patterns you'll need in production applications!