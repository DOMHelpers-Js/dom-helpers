/**
 * 08_dh-reactive-storage.js
 * 
 * Simplified Storage Integration for DOM Helpers Reactive State
 * Just TWO powerful concepts: withStorage() and reactiveStorage()
 * Load this AFTER 01_dh-reactive.js and dh-storage.js
 * 
 * @license MIT
 * @version 2.0.0
 */

(function(global) {
  'use strict';

  // ============================================================================
  // VERIFY DEPENDENCIES
  // ============================================================================
  
  if (!global.ReactiveUtils) {
    console.error('[Storage Integration] ReactiveUtils not found. Load 01_dh-reactive.js first.');
    return;
  }

  if (!global.Storage) {
    console.error('[Storage Integration] Storage not found. Load dh-storage.js first.');
    return;
  }

  const { effect, batch } = global.ReactiveUtils;
  const Storage = global.Storage;

  // ============================================================================
  // CONCEPT 1: autoSave() - Add auto-save to ANY reactive object
  // ============================================================================
  
  /**
   * Add automatic storage persistence to ANY reactive object
   * Works with: state, ref, collection, form, component, store, anything!
   * 
   * @param {Object} reactiveObj - Any reactive object
   * @param {string} key - Storage key
   * @param {Object} options - Storage options
   * @returns {Object} The same object (enhanced with storage methods)
   * 
   * @example
   * // Create any reactive object
   * const state = state({ count: 0 });
   * const ref = ref(0);
   * const todos = collection([]);
   * const form = form({ name: '' });
   * 
   * // Add auto-save to any of them
   * autoSave(state, 'my-state');
   * autoSave(ref, 'my-ref');
   * autoSave(todos, 'my-todos');
   * autoSave(form, 'my-form');
   * 
   * // Now they all auto-save to localStorage!
   * state.count++;
   * ref.value++;
   * todos.add('item');
   * form.setValue('name', 'John');
   */
  function autoSave(reactiveObj, key, options = {}) {
    const {
      storage = 'localStorage',
      namespace = '',
      debounce = 0,
      autoLoad = true,
      autoSave = true,
      sync = false,  // Enable cross-tab synchronization
      onSave = null,
      onLoad = null,
      onSync = null,
      onError = null
    } = options;

    // Get storage instance
    const storageInstance = namespace
      ? Storage.namespace(namespace)
      : (storage === 'sessionStorage' ? Storage.session : Storage);

    // ========================================================================
    // HELPER: Get value from reactive object
    // ========================================================================
    function getValue(obj) {
      // Ref
      if (obj.value !== undefined && typeof obj.valueOf === 'function') {
        return obj.value;
      }
      // Collection
      if (obj.items !== undefined) {
        return obj.items;
      }
      // Form
      if (obj.values !== undefined) {
        return {
          values: obj.values,
          errors: obj.errors || {},
          touched: obj.touched || {}
        };
      }
      // State (with $raw)
      if (obj.$raw) {
        return obj.$raw;
      }
      // Plain object
      return obj;
    }

    // ========================================================================
    // HELPER: Set value to reactive object
    // ========================================================================
    function setValue(obj, value) {
      // Ref
      if (obj.value !== undefined && typeof obj.valueOf === 'function') {
        obj.value = value;
        return;
      }
      // Collection
      if (obj.items !== undefined) {
        if (obj.reset) {
          obj.reset(value);
        } else {
          obj.items = value;
        }
        return;
      }
      // Form
      if (obj.values !== undefined) {
        if (value.values) {
          Object.assign(obj.values, value.values);
          if (value.errors) obj.errors = value.errors;
          if (value.touched) obj.touched = value.touched;
        }
        return;
      }
      // State or plain object
      Object.assign(obj, value);
    }

    // ========================================================================
    // LOAD FROM STORAGE
    // ========================================================================
    if (autoLoad) {
      const loaded = storageInstance.get(key);
      if (loaded !== null) {
        try {
          const processedValue = onLoad ? onLoad(loaded) : loaded;
          setValue(reactiveObj, processedValue);
        } catch (error) {
          if (onError) {
            onError(error, 'load');
          } else {
            console.error('[withStorage] Load error:', error);
          }
        }
      }
    }

    // ========================================================================
    // AUTO-SAVE SETUP
    // ========================================================================
    let saveTimeout;
    let effectCleanup;
    let isUpdatingFromStorage = false;

    function save() {
      if (isUpdatingFromStorage) return;
      
      if (saveTimeout) clearTimeout(saveTimeout);
      
      const doSave = () => {
        try {
          let valueToSave = getValue(reactiveObj);
          
          if (onSave) {
            valueToSave = onSave(valueToSave);
          }
          
          storageInstance.set(key, valueToSave, options);
        } catch (error) {
          if (onError) {
            onError(error, 'save');
          } else {
            console.error('[withStorage] Save error:', error);
          }
        }
      };

      if (debounce > 0) {
        saveTimeout = setTimeout(doSave, debounce);
      } else {
        doSave();
      }
    }

    if (autoSave) {
      effectCleanup = effect(() => {
        // Track changes based on object type
        const _ = getValue(reactiveObj);
        save();
      });
    }

    // ========================================================================
    // CROSS-TAB SYNC (if enabled)
    // ========================================================================
    let storageEventCleanup = null;

    if (sync && typeof window !== 'undefined') {
      const handleStorageEvent = (event) => {
        const fullKey = namespace ? `${namespace}:${key}` : key;
        if (event.key !== fullKey) return;

        try {
          if (event.newValue === null) {
            // Key was removed
            return;
          }

          const data = JSON.parse(event.newValue);
          const newValue = data.value !== undefined ? data.value : data;

          // Update without triggering save
          isUpdatingFromStorage = true;
          batch(() => {
            setValue(reactiveObj, newValue);
          });
          isUpdatingFromStorage = false;

          // Call sync callback
          if (onSync) {
            onSync(newValue);
          }
        } catch (error) {
          if (onError) {
            onError(error, 'sync');
          } else {
            console.error('[withStorage] Sync error:', error);
          }
        }
      };

      window.addEventListener('storage', handleStorageEvent);
      storageEventCleanup = () => {
        window.removeEventListener('storage', handleStorageEvent);
      };
    }

    // ========================================================================
    // ADD STORAGE METHODS TO THE OBJECT
    // ========================================================================
    
    // Force save now
    reactiveObj.$save = function() {
      save();
      return this;
    };

    // Reload from storage
    reactiveObj.$load = function() {
      const loaded = storageInstance.get(key);
      if (loaded !== null) {
        try {
          const processedValue = onLoad ? onLoad(loaded) : loaded;
          isUpdatingFromStorage = true;
          setValue(this, processedValue);
          isUpdatingFromStorage = false;
        } catch (error) {
          if (onError) {
            onError(error, 'load');
          } else {
            console.error('[withStorage] Load error:', error);
          }
        }
      }
      return this;
    };

    // Clear from storage
    reactiveObj.$clear = function() {
      storageInstance.remove(key);
      return this;
    };

    // Check if exists in storage
    reactiveObj.$exists = function() {
      return storageInstance.has(key);
    };

    // Stop auto-save
    reactiveObj.$stopAutoSave = function() {
      if (effectCleanup) {
        effectCleanup();
        effectCleanup = null;
      }
      return this;
    };

    // Resume auto-save
    reactiveObj.$startAutoSave = function() {
      if (!effectCleanup && autoSave) {
        effectCleanup = effect(() => {
          const _ = getValue(this);
          save();
        });
      }
      return this;
    };

    // Cleanup everything
    reactiveObj.$destroy = function() {
      if (effectCleanup) effectCleanup();
      if (storageEventCleanup) storageEventCleanup();
      if (saveTimeout) clearTimeout(saveTimeout);
    };

    return reactiveObj;
  }

  // ============================================================================
  // CONCEPT 2: reactiveStorage() - Storage that triggers effects
  // ============================================================================
  
  /**
   * Create a storage object that triggers reactive effects when values change
   * Perfect for watching storage keys and reacting to changes
   * 
   * @param {string} storageType - 'localStorage' or 'sessionStorage'
   * @param {string} namespace - Optional namespace
   * @returns {Object} Reactive storage object
   * 
   * @example
   * const storage = reactiveStorage('localStorage', 'myapp');
   * 
   * // Effects automatically re-run when storage changes
   * effect(() => {
   *   const theme = storage.get('theme');
   *   document.body.className = theme || 'light';
   * });
   * 
   * // This triggers the effect
   * storage.set('theme', 'dark');
   * 
   * // Works across tabs too! (for localStorage)
   * // Change in Tab 1 → effect runs in Tab 2
   */
  function reactiveStorage(storageType = 'localStorage', namespace = '') {
    const baseStorage = namespace 
      ? Storage.namespace(namespace)
      : (storageType === 'sessionStorage' ? Storage.session : Storage);
    
    // Create a reactive state to track changes
    const reactiveState = global.ReactiveUtils.state({
      _version: 0,  // Increment this to trigger updates
      _keys: new Set(baseStorage.keys())
    });

    // Trigger reactive updates
    function notify() {
      batch(() => {
        reactiveState._version++;
        reactiveState._keys = new Set(baseStorage.keys());
      });
    }

    // Create proxy that tracks access
    const proxy = new Proxy(baseStorage, {
      get(target, prop) {
        // Track reactive dependencies
        if (prop === 'get' || prop === 'has' || prop === 'keys') {
          // Access the reactive version to establish dependency
          const _ = reactiveState._version;
          const __ = reactiveState._keys;
        }
        
        const value = target[prop];
        
        // Bind methods
        if (typeof value === 'function') {
          return value.bind(target);
        }
        
        return value;
      }
    });

    // Override mutating methods to trigger updates
    const originalSet = baseStorage.set.bind(baseStorage);
    proxy.set = function(key, value, options) {
      const result = originalSet(key, value, options);
      if (result) notify();
      return result;
    };

    const originalRemove = baseStorage.remove.bind(baseStorage);
    proxy.remove = function(key) {
      const result = originalRemove(key);
      if (result) notify();
      return result;
    };

    const originalClear = baseStorage.clear.bind(baseStorage);
    proxy.clear = function() {
      const result = originalClear();
      if (result) notify();
      return result;
    };

    const originalSetMultiple = baseStorage.setMultiple.bind(baseStorage);
    proxy.setMultiple = function(obj, options) {
      const result = originalSetMultiple(obj, options);
      notify();
      return result;
    };

    const originalRemoveMultiple = baseStorage.removeMultiple.bind(baseStorage);
    proxy.removeMultiple = function(keys) {
      const result = originalRemoveMultiple(keys);
      notify();
      return result;
    };

    // Listen for storage events (cross-tab changes)
    if (typeof window !== 'undefined' && storageType === 'localStorage') {
      window.addEventListener('storage', (event) => {
        const fullKeyPrefix = namespace ? `${namespace}:` : '';
        
        if (!event.key) {
          // Storage was cleared
          notify();
        } else if (!namespace || event.key.startsWith(fullKeyPrefix)) {
          // Our key was changed
          notify();
        }
      });
    }

    return proxy;
  }

  // ============================================================================
  // CONVENIENCE: watch() - Simple storage watcher
  // ============================================================================
  
  /**
   * Watch a storage key and run callback when it changes
   * Simpler alternative to using reactiveStorage + effect
   * 
   * @param {string} key - Storage key to watch
   * @param {Function} callback - Called when value changes
   * @param {Object} options - Watch options
   * @returns {Function} Cleanup function
   * 
   * @example
   * const cleanup = watch('theme', (newTheme, oldTheme) => {
   *   document.body.className = newTheme;
   * }, { immediate: true });
   * 
   * // Later: cleanup();
   */
  function watch(key, callback, options = {}) {
    const {
      storage = 'localStorage',
      namespace = '',
      immediate = false
    } = options;

    const storageInstance = namespace
      ? Storage.namespace(namespace)
      : (storage === 'sessionStorage' ? Storage.session : Storage);

    let oldValue = storageInstance.get(key);

    // Call immediately if requested
    if (immediate && oldValue !== null) {
      callback(oldValue, null);
    }

    // Use reactive storage for watching
    const reactiveStore = reactiveStorage(storage, namespace);
    
    const cleanup = effect(() => {
      const newValue = reactiveStore.get(key);
      
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        callback(newValue, oldValue);
        oldValue = newValue;
      }
    });

    return cleanup;
  }

  // ============================================================================
  // EXPORT API
  // ============================================================================

  const StorageIntegration = {
    // Core concepts
    autoSave,
    reactiveStorage,
    watch,
    
    // Backward compatibility alias
    withStorage: autoSave
  };

  // Add to global
  global.ReactiveStorage = StorageIntegration;

  // Add to ReactiveUtils
  if (global.ReactiveUtils) {
    global.ReactiveUtils.autoSave = autoSave;
    global.ReactiveUtils.reactiveStorage = reactiveStorage;
    global.ReactiveUtils.watchStorage = watch;
    global.ReactiveUtils.withStorage = autoSave; // Backward compat
  }

  // Add to Storage
  if (global.Storage) {
    global.Storage.autoSave = autoSave;
    global.Storage.reactive = reactiveStorage;
    global.Storage.watch = watch;
    global.Storage.withStorage = autoSave; // Backward compat
  }

  // Add as global functions (if shortcut module loaded)
  if (typeof global.state !== 'undefined') {
    global.autoSave = autoSave;
    global.reactiveStorage = reactiveStorage;
    global.watchStorage = watch;
  }

  console.log('[Reactive Storage] v2.0.0 loaded - SIMPLIFIED');
  console.log('');
  console.log('🎯 Two Core Concepts:');
  console.log('');
  console.log('1. autoSave(reactiveObj, key, options)');
  console.log('   → Add auto-save to ANY reactive object');
  console.log('   → Works with state, ref, collection, form, anything!');
  console.log('');
  console.log('2. reactiveStorage(type, namespace)');
  console.log('   → Storage that triggers effects when changed');
  console.log('   → Perfect for watching storage keys');
  console.log('');
  console.log('3. watch(key, callback, options)');
  console.log('   → Simple convenience for watching a single key');
  console.log('');
  console.log('📚 Usage:');
  console.log('  const state = state({ count: 0 });');
  console.log('  autoSave(state, "my-state");  // Auto-saves!');
  console.log('');
  console.log('  const storage = reactiveStorage();');
  console.log('  effect(() => console.log(storage.get("theme")));');
  console.log('  storage.set("theme", "dark");  // Triggers effect!');

})(typeof window !== 'undefined' ? window : global);