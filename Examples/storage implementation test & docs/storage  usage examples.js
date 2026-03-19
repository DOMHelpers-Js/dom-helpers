// ============================================================================
// BASIC USAGE
// ============================================================================

// Save data
StorageUtils.save('userData', { name: 'John', age: 30 });

// Load data
const userData = StorageUtils.load('userData', { name: 'Guest' });

// Check existence
if (StorageUtils.exists('userData')) {
  console.log('User data exists');
}

// Clear data
StorageUtils.clear('userData');

// ============================================================================
// WITH OPTIONS
// ============================================================================

// Use sessionStorage instead of localStorage
StorageUtils.save('tempData', { count: 1 }, { storage: 'sessionStorage' });

// Use namespace to avoid key collisions
StorageUtils.save('config', { theme: 'dark' }, { namespace: 'myApp' });

// ============================================================================
// WATCHING FOR CHANGES (Cross-tab sync)
// ============================================================================

const unwatch = StorageUtils.watch('userData', (newVal, oldVal) => {
  console.log('User data changed:', newVal);
}, { immediate: true });

// Stop watching
unwatch();

// ============================================================================
// AUTO-SAVE WITH DEBOUNCING
// ============================================================================

const autoSaver = StorageUtils.createAutoSave('formData', {
  debounce: 500,
  namespace: 'myApp',
  onSave: (data) => console.log('Saved:', data),
  onLoad: (data) => console.log('Loaded:', data)
});

// Save (debounced)
autoSaver.save({ email: 'user@example.com' });
autoSaver.save({ email: 'user@example.com', name: 'John' }); // Only this saves

// Save immediately
autoSaver.saveNow({ email: 'urgent@example.com' });

// Load
const formData = autoSaver.load({ email: '' });

// Stop auto-saving
autoSaver.stop();

// Resume
autoSaver.start();

// ============================================================================
// STORAGE INFO
// ============================================================================

const info = StorageUtils.getInfo({ namespace: 'myApp' });
console.log('Keys:', info.keys);
console.log('Total:', info.size);

// Clear all in namespace
const cleared = StorageUtils.clearAll({ namespace: 'myApp' });
console.log(`Cleared ${cleared} keys`);


/////////////////////////////////////////////////////////////////

 // Integration with Conditions Module

// If you want to save condition states
const conditionState = {
  isActive: true,
  mode: 'edit'
};

// Save when state changes
Conditions.apply(conditionState.isActive, {
  true: {
    onclick: () => {
      conditionState.mode = 'view';
      StorageUtils.save('conditionState', conditionState);
    }
  }
}, '.toggle-button');

// Load on page load
const savedState = StorageUtils.load('conditionState', { isActive: false, mode: 'view' });


///////////////////////////////////////////////////////////////////

// Coexistence Verification
// If both modules are loaded, they work independently:

// Standalone (manual)
StorageUtils.save('data', { count: 1 });

// Reactive (automatic)
if (global.ReactiveUtils) {
  const state = ReactiveUtils.state({ count: 0 });
  ReactiveUtils.autoSave(state, 'reactiveData');
  state.count = 1; // Auto-saves
}

// No conflicts - different namespaces and keys

/////////////////////////////////////////////////////////////////////