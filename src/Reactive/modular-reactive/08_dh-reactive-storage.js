/**
 * 08_dh-reactive-storage.js (PRODUCTION HARDENED)
 * 
 * Simplified Storage Integration - Production Ready
 * @license MIT
 * @version 2.1.0
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
  // STORAGE AVAILABILITY CHECK
  // ============================================================================
  
  function isStorageAvailable(type) {
    try {
      const storage = global[type];
      const test = '__storage_test__';
      storage.setItem(test, test);
      storage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  const hasLocalStorage = isStorageAvailable('localStorage');
  const hasSessionStorage = isStorageAvailable('sessionStorage');

  if (!hasLocalStorage) {
    console.warn('[autoSave] localStorage not available (private browsing?)');
  }

  // ============================================================================
  // PRODUCTION UTILITIES
  // ============================================================================

  /**
   * Safe JSON stringify with circular reference detection
   */
  function safeStringify(obj) {
    const seen = new WeakSet();
    
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return value;
    });
  }

  /**
   * Check storage quota
   */
  function getStorageSize(storage) {
    let size = 0;
    for (let key in storage) {
      if (storage.hasOwnProperty(key)) {
        size += storage[key].length + key.length;
      }
    }
    return size;
  }

  const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB warning threshold
  const LARGE_ITEM_SIZE = 100 * 1024; // 100KB warning for single item

  // ============================================================================
  // CONCEPT 1: autoSave() - Production Hardened
  // ============================================================================
  
  function autoSave(reactiveObj, key, options = {}) {
    // ========================================================================
    // INPUT VALIDATION
    // ========================================================================
    
    if (!reactiveObj || typeof reactiveObj !== 'object') {
      throw new Error('[autoSave] First argument must be a reactive object');
    }

    if (!key || typeof key !== 'string' || key.trim() === '') {
      throw new Error('[autoSave] Second argument must be a non-empty string key');
    }

    if (options && typeof options !== 'object') {
      throw new Error('[autoSave] Third argument must be an options object');
    }

    // ========================================================================
    // OPTIONS WITH VALIDATION
    // ========================================================================
    
    const {
      storage = 'localStorage',
      namespace = '',
      debounce = 0,
      autoLoad = true,
      autoSave: autoSaveEnabled = true,
      sync = false,
      onSave = null,
      onLoad = null,
      onSync = null,
      onError = null
    } = options;

    // Validate storage type
    if (storage !== 'localStorage' && storage !== 'sessionStorage') {
      throw new Error('[autoSave] storage must be "localStorage" or "sessionStorage"');
    }

    // Check storage availability
    if (storage === 'localStorage' && !hasLocalStorage) {
      console.warn('[autoSave] localStorage not available, data will not persist');
      return reactiveObj; // Return unmodified object
    }

    if (storage === 'sessionStorage' && !hasSessionStorage) {
      console.warn('[autoSave] sessionStorage not available, data will not persist');
      return reactiveObj;
    }

    // Validate debounce
    if (typeof debounce !== 'number' || debounce < 0) {
      throw new Error('[autoSave] debounce must be a non-negative number');
    }

    // Validate callbacks
    if (onSave && typeof onSave !== 'function') {
      throw new Error('[autoSave] onSave must be a function');
    }
    if (onLoad && typeof onLoad !== 'function') {
      throw new Error('[autoSave] onLoad must be a function');
    }
    if (onSync && typeof onSync !== 'function') {
      throw new Error('[autoSave] onSync must be a function');
    }
    if (onError && typeof onError !== 'function') {
      throw new Error('[autoSave] onError must be a function');
    }

    // Get storage instance
    const storageInstance = namespace
      ? Storage.namespace(namespace)
      : (storage === 'sessionStorage' ? Storage.session : Storage);

    // ========================================================================
    // HELPER: Get value with error handling
    // ========================================================================
    
    function getValue(obj) {
      try {
        let value;
        
        // Ref
        if (obj.value !== undefined && typeof obj.valueOf === 'function') {
          value = obj.value;
        }
        // Collection
        else if (obj.items !== undefined) {
          value = obj.items;
        }
        // Form
        else if (obj.values !== undefined) {
          value = {
            values: obj.values,
            errors: obj.errors || {},
            touched: obj.touched || {}
          };
        }
        // State (with $raw)
        else if (obj.$raw) {
          value = obj.$raw;
        }
        // Plain object
        else {
          value = obj;
        }

        // Validate serializability
        safeStringify(value);
        
        return value;
      } catch (error) {
        console.error('[autoSave] Error getting value:', error);
        if (onError) {
          onError(error, 'serialize');
        }
        return null;
      }
    }

    // ========================================================================
    // HELPER: Set value with validation
    // ========================================================================
    
    function setValue(obj, value) {
      if (value === null || value === undefined) {
        return;
      }

      try {
        // Ref
        if (obj.value !== undefined && typeof obj.valueOf === 'function') {
          obj.value = value;
        }
        // Collection
        else if (obj.items !== undefined) {
          if (obj.reset) {
            obj.reset(value);
          } else {
            obj.items = value;
          }
        }
        // Form
        else if (obj.values !== undefined) {
          if (value.values) {
            Object.assign(obj.values, value.values);
            if (value.errors) obj.errors = value.errors;
            if (value.touched) obj.touched = value.touched;
          }
        }
        // State or plain object
        else {
          Object.assign(obj, value);
        }
      } catch (error) {
        console.error('[autoSave] Error setting value:', error);
        if (onError) {
          onError(error, 'deserialize');
        }
      }
    }

    // ========================================================================
    // LOAD FROM STORAGE (with validation)
    // ========================================================================
    
    if (autoLoad) {
      try {
        const loaded = storageInstance.get(key);
        if (loaded !== null) {
          const processedValue = onLoad ? onLoad(loaded) : loaded;
          setValue(reactiveObj, processedValue);
        }
      } catch (error) {
        console.error('[autoSave] Load error:', error);
        if (onError) {
          onError(error, 'load');
        }
      }
    }

    // ========================================================================
    // AUTO-SAVE SETUP (Production Hardened)
    // ========================================================================
    
    let saveTimeout;
    let effectCleanup;
    let isUpdatingFromStorage = false;
    let lastSaveAttempt = 0;
    const MIN_SAVE_INTERVAL = 100; // Minimum 100ms between saves

    function save() {
      if (isUpdatingFromStorage) return;
      
      // Prevent too frequent saves
      const now = Date.now();
      if (now - lastSaveAttempt < MIN_SAVE_INTERVAL) {
        return;
      }
      lastSaveAttempt = now;
      
      if (saveTimeout) clearTimeout(saveTimeout);
      
      const doSave = () => {
        try {
          let valueToSave = getValue(reactiveObj);
          
          if (valueToSave === null) {
            console.warn('[autoSave] Skipping save - value is null');
            return;
          }
          
          // Apply user transform
          if (onSave) {
            valueToSave = onSave(valueToSave);
          }

          // Check size
          const serialized = safeStringify(valueToSave);
          const size = serialized.length;
          
          if (size > LARGE_ITEM_SIZE) {
            console.warn(`[autoSave] Large data detected (${Math.round(size / 1024)}KB) for key "${key}"`);
          }

          // Check total storage size
          const totalSize = getStorageSize(global[storage]);
          if (totalSize > MAX_STORAGE_SIZE) {
            console.warn(`[autoSave] Storage approaching limit (${Math.round(totalSize / 1024 / 1024)}MB)`);
          }
          
          // Attempt save with quota error handling
          storageInstance.set(key, valueToSave, options);
          
        } catch (error) {
          // Handle quota exceeded
          if (error.name === 'QuotaExceededError') {
            console.error('[autoSave] Storage quota exceeded');
            if (onError) {
              onError(new Error('Storage quota exceeded. Consider clearing old data.'), 'quota');
            }
          } else {
            console.error('[autoSave] Save error:', error);
            if (onError) {
              onError(error, 'save');
            }
          }
        }
      };

      if (debounce > 0) {
        saveTimeout = setTimeout(doSave, debounce);
      } else {
        doSave();
      }
    }

    // Set up auto-save
    if (autoSaveEnabled) {
      effectCleanup = effect(() => {
        const _ = getValue(reactiveObj);
        save();
      });
    }

    // ========================================================================
    // CROSS-TAB SYNC (Production Hardened)
    // ========================================================================
    
    let storageEventCleanup = null;
    let syncLock = false; // Prevent sync loops

    if (sync && typeof window !== 'undefined') {
      const handleStorageEvent = (event) => {
        if (syncLock) return; // Prevent loops
        
        const fullKey = namespace ? `${namespace}:${key}` : key;
        if (event.key !== fullKey) return;

        try {
          if (event.newValue === null) {
            return;
          }

          const data = JSON.parse(event.newValue);
          const newValue = data.value !== undefined ? data.value : data;

          syncLock = true;
          isUpdatingFromStorage = true;
          
          batch(() => {
            setValue(reactiveObj, newValue);
          });
          
          isUpdatingFromStorage = false;
          
          if (onSync) {
            onSync(newValue);
          }
          
        } catch (error) {
          console.error('[autoSave] Sync error:', error);
          if (onError) {
            onError(error, 'sync');
          }
        } finally {
          syncLock = false;
        }
      };

      window.addEventListener('storage', handleStorageEvent);
      storageEventCleanup = () => {
        window.removeEventListener('storage', handleStorageEvent);
      };
    }

    // ========================================================================
    // FLUSH ON PAGE UNLOAD (Prevent data loss)
    // ========================================================================
    
    let unloadCleanup = null;
    
    if (typeof window !== 'undefined' && autoSaveEnabled) {
      const handleUnload = () => {
        if (saveTimeout) {
          clearTimeout(saveTimeout);
          // Force immediate save
          try {
            let valueToSave = getValue(reactiveObj);
            if (valueToSave !== null && onSave) {
              valueToSave = onSave(valueToSave);
            }
            if (valueToSave !== null) {
              storageInstance.set(key, valueToSave, options);
            }
          } catch (error) {
            // Silent fail on unload
          }
        }
      };

      window.addEventListener('beforeunload', handleUnload);
      unloadCleanup = () => {
        window.removeEventListener('beforeunload', handleUnload);
      };
    }

    // ========================================================================
    // ADD STORAGE METHODS
    // ========================================================================
    
    reactiveObj.$save = function() {
      if (saveTimeout) clearTimeout(saveTimeout);
      
      try {
        let valueToSave = getValue(this);
        if (valueToSave !== null && onSave) {
          valueToSave = onSave(valueToSave);
        }
        if (valueToSave !== null) {
          storageInstance.set(key, valueToSave, options);
        }
        return true;
      } catch (error) {
        console.error('[autoSave] $save error:', error);
        if (onError) {
          onError(error, 'save');
        }
        return false;
      }
    };

    reactiveObj.$load = function() {
      try {
        const loaded = storageInstance.get(key);
        if (loaded !== null) {
          const processedValue = onLoad ? onLoad(loaded) : loaded;
          isUpdatingFromStorage = true;
          setValue(this, processedValue);
          isUpdatingFromStorage = false;
          return true;
        }
        return false;
      } catch (error) {
        console.error('[autoSave] $load error:', error);
        if (onError) {
          onError(error, 'load');
        }
        return false;
      }
    };

    reactiveObj.$clear = function() {
      try {
        storageInstance.remove(key);
        return true;
      } catch (error) {
        console.error('[autoSave] $clear error:', error);
        return false;
      }
    };

    reactiveObj.$exists = function() {
      try {
        return storageInstance.has(key);
      } catch (error) {
        return false;
      }
    };

    reactiveObj.$stopAutoSave = function() {
      if (effectCleanup) {
        effectCleanup();
        effectCleanup = null;
      }
      return this;
    };

    reactiveObj.$startAutoSave = function() {
      if (!effectCleanup && autoSaveEnabled) {
        effectCleanup = effect(() => {
          const _ = getValue(this);
          save();
        });
      }
      return this;
    };

    reactiveObj.$destroy = function() {
      if (effectCleanup) effectCleanup();
      if (storageEventCleanup) storageEventCleanup();
      if (unloadCleanup) unloadCleanup();
      if (saveTimeout) clearTimeout(saveTimeout);
    };

    // Add storage info
    reactiveObj.$storageInfo = function() {
      return {
        key,
        namespace,
        storage,
        exists: this.$exists(),
        size: this.$exists() ? safeStringify(storageInstance.get(key)).length : 0
      };
    };

    return reactiveObj;
  }

  // ============================================================================
  // CONCEPT 2: reactiveStorage() - Same as before
  // ============================================================================
  
  function reactiveStorage(storageType = 'localStorage', namespace = '') {
    // Check availability
    if (storageType === 'localStorage' && !hasLocalStorage) {
      console.warn('[reactiveStorage] localStorage not available');
    }
    if (storageType === 'sessionStorage' && !hasSessionStorage) {
      console.warn('[reactiveStorage] sessionStorage not available');
    }

    const baseStorage = namespace 
      ? Storage.namespace(namespace)
      : (storageType === 'sessionStorage' ? Storage.session : Storage);
    
    const reactiveState = global.ReactiveUtils.state({
      _version: 0,
      _keys: new Set(baseStorage.keys())
    });

    function notify() {
      batch(() => {
        reactiveState._version++;
        reactiveState._keys = new Set(baseStorage.keys());
      });
    }

    const proxy = new Proxy(baseStorage, {
      get(target, prop) {
        if (prop === 'get' || prop === 'has' || prop === 'keys') {
          const _ = reactiveState._version;
          const __ = reactiveState._keys;
        }
        
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      }
    });

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

    if (typeof window !== 'undefined' && storageType === 'localStorage') {
      window.addEventListener('storage', (event) => {
        const fullKeyPrefix = namespace ? `${namespace}:` : '';
        if (!event.key || (!namespace || event.key.startsWith(fullKeyPrefix))) {
          notify();
        }
      });
    }

    return proxy;
  }

  // ============================================================================
  // CONCEPT 3: watch() - Same as before
  // ============================================================================
  
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

    if (immediate && oldValue !== null) {
      callback(oldValue, null);
    }

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
    autoSave,
    reactiveStorage,
    watch,
    withStorage: autoSave, // Backward compat
    
    // Utility
    isStorageAvailable,
    hasLocalStorage,
    hasSessionStorage
  };

  global.ReactiveStorage = StorageIntegration;

  if (global.ReactiveUtils) {
    global.ReactiveUtils.autoSave = autoSave;
    global.ReactiveUtils.reactiveStorage = reactiveStorage;
    global.ReactiveUtils.watchStorage = watch;
    global.ReactiveUtils.withStorage = autoSave;
  }

  if (global.Storage) {
    global.Storage.autoSave = autoSave;
    global.Storage.reactive = reactiveStorage;
    global.Storage.watch = watch;
    global.Storage.withStorage = autoSave;
  }

  if (typeof global.state !== 'undefined') {
    global.autoSave = autoSave;
    global.reactiveStorage = reactiveStorage;
    global.watchStorage = watch;
  }

  console.log('[Reactive Storage] v2.1.0 PRODUCTION loaded successfully');
  console.log('');
  console.log('🎯 Production Features:');
  console.log('  ✓ Storage availability detection');
  console.log('  ✓ Quota exceeded handling');
  console.log('  ✓ Input validation');
  console.log('  ✓ Circular reference protection');
  console.log('  ✓ Size warnings');
  console.log('  ✓ beforeunload flush');
  console.log('  ✓ Race condition prevention');

})(typeof window !== 'undefined' ? window : global);