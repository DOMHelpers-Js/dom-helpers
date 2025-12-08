/**
 * 04_array-based-updates.js
 * 
 * DOM Helpers - Array-Based Update Distribution
 * Enables distributing array values across collection elements
 * 
 * Consolidates:
 * - 10_dh-array-based-updates.js (cleaned and optimized)
 * 
 * Features:
 * - collection.update({textContent: ["A", "B", "C"]}) - distribute values
 * - collection.update({style: [{color: "red"}, {color: "blue"}]}) - per-element styles
 * - Smart fallback to last value if array shorter than collection
 * - Works with nested arrays (classList, style properties, etc.)
 * 
 * REQUIRES: core-update-engine.js (for CoreUpdateEngine)
 * 
 * @version 2.0.0
 * @license MIT
 */

(function(global) {
  'use strict';

  console.log('[Array Updates] v2.0.0 Loading...');

  // ===== ARRAY DETECTION =====

  /**
   * Check if value is distributable array
   */
  function isDistributableArray(value) {
    return Array.isArray(value) && value.length > 0;
  }

  /**
   * Check if updates object contains any array values
   */
  function containsArrayValues(obj) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
      return false;
    }
    
    for (const value of Object.values(obj)) {
      if (Array.isArray(value)) return true;
      
      // Check nested objects (style, dataset, etc.)
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (containsArrayValues(value)) return true;
      }
    }
    
    return false;
  }

  // ===== VALUE DISTRIBUTION =====

  /**
   * Get value for specific element index from array
   * Falls back to last value if index exceeds array length
   */
  function getValueForIndex(value, elementIndex, totalElements) {
    if (!Array.isArray(value)) {
      return value;
    }
    
    if (elementIndex < value.length) {
      return value[elementIndex];
    }
    
    // Fallback to last value
    return value[value.length - 1];
  }

  /**
   * Process updates object for specific element index
   * Distributes array values, keeps non-array values as-is
   */
  function processUpdatesForElement(updates, elementIndex, totalElements) {
    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
      return updates;
    }

    const processed = {};

    Object.entries(updates).forEach(([key, value]) => {
      // Handle nested objects (style, dataset)
      if (key === 'style' || key === 'dataset') {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Recursively process nested object
          processed[key] = processUpdatesForElement(value, elementIndex, totalElements);
        } else if (Array.isArray(value)) {
          // Array of style/dataset objects
          processed[key] = getValueForIndex(value, elementIndex, totalElements);
        } else {
          processed[key] = value;
        }
      }
      // Handle classList (special case)
      else if (key === 'classList') {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          const processedClassList = {};
          Object.entries(value).forEach(([method, classes]) => {
            processedClassList[method] = getValueForIndex(classes, elementIndex, totalElements);
          });
          processed[key] = processedClassList;
        } else {
          processed[key] = value;
        }
      }
      // All other properties
      else {
        processed[key] = getValueForIndex(value, elementIndex, totalElements);
      }
    });

    return processed;
  }

  // ===== APPLY UPDATES WITH ARRAY DISTRIBUTION =====

  /**
   * Apply array-based updates to collection
   * Uses CoreUpdateEngine for actual element updates
   */
  function applyArrayBasedUpdates(collection, updates) {
    // Get elements from collection
    let elements = [];
    
    if (collection._originalCollection) {
      elements = Array.from(collection._originalCollection);
    } else if (collection._originalNodeList) {
      elements = Array.from(collection._originalNodeList);
    } else if (collection.length !== undefined) {
      try {
        elements = Array.from(collection);
      } catch (e) {
        for (let i = 0; i < collection.length; i++) {
          elements.push(collection[i]);
        }
      }
    }

    if (elements.length === 0) {
      console.info('[Array Updates] Collection is empty');
      return collection;
    }

    const totalElements = elements.length;
    const hasArrays = containsArrayValues(updates);

    // If no arrays, use standard bulk update
    if (!hasArrays) {
      elements.forEach(element => {
        if (element && element.nodeType === Node.ELEMENT_NODE) {
          // Use CoreUpdateEngine if available
          if (global.CoreUpdateEngine?.applyUpdatesToElement) {
            global.CoreUpdateEngine.applyUpdatesToElement(element, updates);
          } else if (element.update) {
            element.update(updates);
          }
        }
      });
      return collection;
    }

    console.log(`[Array Updates] Distributing array values across ${totalElements} elements`);

    // Process and apply updates for each element
    elements.forEach((element, index) => {
      if (!element || element.nodeType !== Node.ELEMENT_NODE) return;
      
      const elementUpdates = processUpdatesForElement(updates, index, totalElements);
      
      // Apply using CoreUpdateEngine if available
      if (global.CoreUpdateEngine?.applyUpdatesToElement) {
        global.CoreUpdateEngine.applyUpdatesToElement(element, elementUpdates);
      } else if (element.update) {
        element.update(elementUpdates);
      }
    });

    return collection;
  }

  // ===== ENHANCED UPDATE METHOD WITH ARRAY SUPPORT =====

  /**
   * Create enhanced update method that detects and handles arrays
   * Wraps existing update method from CoreUpdateEngine
   */
  function createArrayAwareUpdateMethod(originalUpdate) {
    return function arrayAwareUpdate(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[Array Updates] update() requires an object');
        return this;
      }

      // Check for numeric indices (index-based updates)
      const keys = Object.keys(updates);
      const hasNumericIndices = keys.some(key => {
        const num = parseInt(key, 10);
        return !isNaN(num) && String(num) === key;
      });

      // If has numeric indices, use standard index-based update
      if (hasNumericIndices) {
        if (originalUpdate && typeof originalUpdate === 'function') {
          return originalUpdate.call(this, updates);
        }
        return this;
      }

      // Check for array values
      const hasArrayValues = containsArrayValues(updates);

      // If has arrays, use array distribution
      if (hasArrayValues) {
        return applyArrayBasedUpdates(this, updates);
      }

      // Otherwise, use standard bulk update
      if (originalUpdate && typeof originalUpdate === 'function') {
        return originalUpdate.call(this, updates);
      }

      return this;
    };
  }

  /**
   * Enhance collection with array-aware update support
   * Wraps existing update method
   */
  function enhanceCollectionWithArraySupport(collection) {
    if (!collection) return collection;
    
    // Don't re-enhance
    if (collection._hasArrayUpdateSupport) {
      return collection;
    }

    // Store original update method
    const originalUpdate = collection.update;

    // Create array-aware wrapper
    const arrayAwareUpdate = createArrayAwareUpdateMethod(originalUpdate);

    // Replace update method
    try {
      Object.defineProperty(collection, 'update', {
        value: arrayAwareUpdate,
        writable: true,
        enumerable: false,
        configurable: true
      });

      Object.defineProperty(collection, '_hasArrayUpdateSupport', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
    } catch (error) {
      collection.update = arrayAwareUpdate;
      collection._hasArrayUpdateSupport = true;
    }

    return collection;
  }

  // ===== PATCHING STRATEGY =====

  /**
   * Patch Selector helper
   */
  function patchSelectorHelper() {
    if (!global.Selector?.queryAll) return false;

    const originalQA = global.Selector.queryAll;
    global.Selector.queryAll = function(...args) {
      const result = originalQA.apply(this, args);
      return enhanceCollectionWithArraySupport(result);
    };
    
    console.log('[Array Updates] ✓ Patched Selector.queryAll');
    return true;
  }

  /**
   * Patch global query functions
   */
  function patchGlobalQueryFunctions() {
    let count = 0;

    if (global.querySelectorAll) {
      const originalQSA = global.querySelectorAll;
      global.querySelectorAll = function(selector, context) {
        const result = originalQSA.call(this, selector, context);
        return enhanceCollectionWithArraySupport(result);
      };
      count++;
      console.log('[Array Updates] ✓ Patched querySelectorAll');
    }

    if (global.queryAll) {
      const originalQA = global.queryAll;
      global.queryAll = function(selector, context) {
        const result = originalQA.call(this, selector, context);
        return enhanceCollectionWithArraySupport(result);
      };
      count++;
      console.log('[Array Updates] ✓ Patched queryAll');
    }

    return count > 0;
  }

  /**
   * Patch Collections shortcuts
   */
  function patchCollectionsShortcuts() {
    if (!global.Collections) return false;
    let count = 0;

    ['ClassName', 'TagName', 'Name'].forEach(type => {
      if (global.Collections[type]) {
        const original = global.Collections[type];
        global.Collections[type] = new Proxy(original, {
          get(target, prop) {
            const result = Reflect.get(target, prop);
            if (result && typeof result === 'object' && 'length' in result) {
              return enhanceCollectionWithArraySupport(result);
            }
            return result;
          },
          apply(target, thisArg, args) {
            const result = Reflect.apply(target, thisArg, args);
            if (result && typeof result === 'object' && 'length' in result) {
              return enhanceCollectionWithArraySupport(result);
            }
            return result;
          }
        });
        count++;
      }
    });

    if (count > 0) {
      console.log(`[Array Updates] ✓ Patched ${count} Collections shortcuts`);
    }
    return count > 0;
  }

  /**
   * Patch global shortcuts
   */
  function patchGlobalShortcuts() {
    let count = 0;

    ['ClassName', 'TagName', 'Name'].forEach(type => {
      if (global[type]) {
        const original = global[type];
        global[type] = new Proxy(original, {
          get(target, prop) {
            const result = Reflect.get(target, prop);
            if (result && typeof result === 'object' && 'length' in result) {
              return enhanceCollectionWithArraySupport(result);
            }
            return result;
          },
          apply(target, thisArg, args) {
            const result = Reflect.apply(target, thisArg, args);
            if (result && typeof result === 'object' && 'length' in result) {
              return enhanceCollectionWithArraySupport(result);
            }
            return result;
          }
        });
        count++;
      }
    });

    if (count > 0) {
      console.log(`[Array Updates] ✓ Patched ${count} global shortcuts`);
    }
    return count > 0;
  }

  // ===== INITIALIZATION =====

  /**
   * Initialize array-based updates with retry logic
   */
  function initialize() {
    let totalPatches = 0;
    
    if (patchSelectorHelper()) totalPatches++;
    if (patchGlobalQueryFunctions()) totalPatches++;
    if (patchCollectionsShortcuts()) totalPatches++;
    if (patchGlobalShortcuts()) totalPatches++;

    if (totalPatches > 0) {
      console.log(`[Array Updates] ✓ Initialized - ${totalPatches} systems patched`);
    } else {
      console.warn('[Array Updates] No systems found to patch. Load after other enhancers.');
    }
    
    return totalPatches > 0;
  }

  // Try immediately
  const immediate = initialize();

  // Also try after DOM ready
  if (!immediate && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[Array Updates] Retrying after DOMContentLoaded...');
      initialize();
    });
  }

  // And after a short delay (for dynamic loading)
  if (!immediate) {
    setTimeout(() => {
      console.log('[Array Updates] Retrying after delay...');
      initialize();
    }, 100);
  }

  // ===== EXPORT MODULE =====

  const ArrayBasedUpdates = {
    version: '2.0.0',
    
    // Core functions
    applyArrayBasedUpdates,
    processUpdatesForElement,
    getValueForIndex,
    isDistributableArray,
    containsArrayValues,
    
    // Enhancement
    enhanceCollectionWithArraySupport,
    createArrayAwareUpdateMethod,
    
    // Management
    initialize,
    reinitialize: initialize,
    
    // Utilities
    hasSupport(collection) {
      return !!(collection && collection._hasArrayUpdateSupport);
    },
    
    enhance(collection) {
      return enhanceCollectionWithArraySupport(collection);
    }
  };

  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArrayBasedUpdates;
  } else if (typeof define === 'function' && define.amd) {
    define([], () => ArrayBasedUpdates);
  } else {
    global.ArrayBasedUpdates = ArrayBasedUpdates;
  }

  if (typeof global.DOMHelpers !== 'undefined') {
    global.DOMHelpers.ArrayBasedUpdates = ArrayBasedUpdates;
  }

  console.log('[Array Updates] ✓ Loaded successfully');
  console.log('[Array Updates] Usage: collection.update({ textContent: ["A", "B", "C"] })');

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);