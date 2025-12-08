/**
 * DOM Helpers - Array Distribution
 * Distributes array values across collection elements
 * 
 * @version 2.0.0
 * @license MIT
 * @requires utilities.js
 * @requires collection-enhancements.js
 * 
 * Purpose:
 *   Enables array-based value distribution in update() calls
 *   Example: collection.update({ textContent: ['First', 'Second', 'Third'] })
 *   Each element gets its corresponding array value
 * 
 * Combines and simplifies:
 *   - 10_dh-array-based-updates.js
 */

(function(global) {
  'use strict';

  console.log('[Array Distribution] v2.0.0 Loading...');

  // ===== DEPENDENCY CHECK =====
  const Utils = global.EnhancerUtilities;
  if (!Utils) {
    console.error('[Array Distribution] EnhancerUtilities not found. Load utilities.js first!');
    return;
  }

  // ===== ARRAY DETECTION =====

  /**
   * Checks if a value is a distributable array
   * 
   * @param {*} value - Value to check
   * @returns {boolean} True if distributable array
   */
  function isDistributableArray(value) {
    return Array.isArray(value) && value.length > 0;
  }

  /**
   * Checks if an object contains any array values
   * (recursively checks nested objects)
   * 
   * @param {Object} obj - Object to check
   * @returns {boolean} True if contains arrays
   */
  function containsArrayValues(obj) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
      return false;
    }
    
    for (const value of Object.values(obj)) {
      if (Array.isArray(value)) {
        return true;
      }
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (containsArrayValues(value)) {
          return true;
        }
      }
    }
    
    return false;
  }

  // ===== VALUE DISTRIBUTION =====

  /**
   * Gets the appropriate value for a given element index
   * If index exceeds array length, uses last value
   * 
   * @param {*} value - Value (may be array or single value)
   * @param {number} elementIndex - Element index
   * @param {number} totalElements - Total elements in collection
   * @returns {*} Value for this element
   */
  function getValueForIndex(value, elementIndex, totalElements) {
    if (!Array.isArray(value)) {
      return value;
    }
    
    if (elementIndex < value.length) {
      return value[elementIndex];
    }
    
    // Use last value for remaining elements
    return value[value.length - 1];
  }

  /**
   * Processes an updates object for a specific element index
   * Converts array values to single values appropriate for that index
   * 
   * @param {Object} updates - Updates object (may contain arrays)
   * @param {number} elementIndex - Element index
   * @param {number} totalElements - Total elements
   * @returns {Object} Processed updates for this element
   */
  function processUpdatesForElement(updates, elementIndex, totalElements) {
    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
      return updates;
    }

    const processed = {};

    Object.entries(updates).forEach(([key, value]) => {
      // Special handling for nested objects (style, dataset)
      if (key === 'style' || key === 'dataset') {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Recursively process nested object
          processed[key] = processUpdatesForElement(value, elementIndex, totalElements);
        } else if (Array.isArray(value)) {
          // Array of objects for style/dataset
          processed[key] = getValueForIndex(value, elementIndex, totalElements);
        } else {
          processed[key] = value;
        }
      }
      // Special handling for classList
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

  // ===== ARRAY-BASED UPDATE APPLICATION =====

  /**
   * Applies updates with array distribution to a collection
   * 
   * @param {*} collection - Collection to update
   * @param {Object} updates - Updates object (may contain arrays)
   * @returns {*} The collection (for chaining)
   */
  function applyArrayBasedUpdates(collection, updates) {
    const elements = Utils.getCollectionElements(collection);
    
    if (elements.length === 0) {
      console.warn('[Array Distribution] Cannot update: collection is empty');
      return collection;
    }

    const totalElements = elements.length;

    // Process and apply updates for each element
    elements.forEach((element, index) => {
      if (element && element.nodeType === Node.ELEMENT_NODE) {
        const processedUpdates = processUpdatesForElement(updates, index, totalElements);
        Utils.applyUpdatesToElement(element, processedUpdates);
      }
    });

    return collection;
  }

  // ===== ENHANCED UPDATE METHOD =====

  /**
   * Creates enhanced update method that detects and handles array values
   * This wraps the existing update method to add array distribution
   * 
   * @param {Function} originalUpdate - Original update method
   * @returns {Function} Enhanced update method
   */
  function createArrayAwareUpdate(originalUpdate) {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[Array Distribution] .update() requires an object');
        return this;
      }

      // Check if updates contain numeric indices (priority: indexed updates)
      const keys = Object.keys(updates);
      const hasNumericIndices = keys.some(key => {
        const num = parseInt(key, 10);
        return !isNaN(num) && String(num) === key;
      });

      if (hasNumericIndices) {
        // Let indexed update system handle this
        if (originalUpdate && typeof originalUpdate === 'function') {
          return originalUpdate.call(this, updates);
        }
      }

      // Check for array values
      const hasArrayValues = containsArrayValues(updates);

      if (hasArrayValues) {
        // Use array distribution
        return applyArrayBasedUpdates(this, updates);
      }

      // No arrays - use original update
      if (originalUpdate && typeof originalUpdate === 'function') {
        return originalUpdate.call(this, updates);
      }

      // Fallback: apply as bulk update
      const elements = Utils.getCollectionElements(this);
      elements.forEach(element => {
        if (element && element.update && typeof element.update === 'function') {
          element.update(updates);
        }
      });

      return this;
    };
  }

  /**
   * Enhances a collection with array distribution support
   * 
   * @param {*} collection - Collection to enhance
   * @returns {*} Enhanced collection
   */
  function enhanceCollectionWithArraySupport(collection) {
    if (!collection || !Utils.isValidCollection(collection)) {
      return collection;
    }

    // Already enhanced with array support
    if (collection._hasArraySupport) {
      return collection;
    }

    // Get existing update method
    const originalUpdate = collection.update;

    // Create enhanced update with array awareness
    const enhancedUpdate = createArrayAwareUpdate(originalUpdate);

    // Replace update method
    try {
      Object.defineProperty(collection, 'update', {
        value: enhancedUpdate,
        writable: true,
        enumerable: false,
        configurable: true
      });

      Object.defineProperty(collection, '_hasArraySupport', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
    } catch (error) {
      collection.update = enhancedUpdate;
      collection._hasArraySupport = true;
    }

    return collection;
  }

  // ===== PATCHING SYSTEM =====

  /**
   * Patches Selector helper to add array support
   */
  function patchSelectorHelper() {
    if (!global.Selector || !global.Selector.helper) {
      return false;
    }

    const helper = global.Selector.helper;

    // Hook _enhanceNodeList (after collection-enhancements.js)
    if (helper._enhanceNodeList && !helper._enhanceNodeList._arrayPatched) {
      const original = helper._enhanceNodeList.bind(helper);
      helper._enhanceNodeList = function(nodeList, selector) {
        const collection = original(nodeList, selector);
        return enhanceCollectionWithArraySupport(collection);
      };
      helper._enhanceNodeList._arrayPatched = true;
      return true;
    }

    return false;
  }

  /**
   * Patches Collections helper to add array support
   */
  function patchCollectionsHelper() {
    if (!global.Collections || !global.Collections.helper) {
      return false;
    }

    const helper = global.Collections.helper;

    // Hook _enhanceCollection (after collection-enhancements.js)
    if (helper._enhanceCollection && !helper._enhanceCollection._arrayPatched) {
      const original = helper._enhanceCollection.bind(helper);
      helper._enhanceCollection = function(htmlCollection, type, value) {
        const collection = original(htmlCollection, type, value);
        return enhanceCollectionWithArraySupport(collection);
      };
      helper._enhanceCollection._arrayPatched = true;
      return true;
    }

    return false;
  }

  /**
   * Patches global query functions
   */
  function patchGlobalQuery() {
    let patched = false;

    if (global.querySelectorAll && !global.querySelectorAll._arrayPatched) {
      const original = global.querySelectorAll;
      global.querySelectorAll = function(...args) {
        const result = original.apply(this, args);
        return enhanceCollectionWithArraySupport(result);
      };
      global.querySelectorAll._arrayPatched = true;
      patched = true;
    }

    if (global.queryAll && !global.queryAll._arrayPatched) {
      const original = global.queryAll;
      global.queryAll = function(...args) {
        const result = original.apply(this, args);
        return enhanceCollectionWithArraySupport(result);
      };
      global.queryAll._arrayPatched = true;
      patched = true;
    }

    return patched;
  }

  /**
   * Patches global shortcuts (ClassName, TagName, Name)
   */
  function patchGlobalShortcuts() {
    let patched = 0;

    ['ClassName', 'TagName', 'Name'].forEach(type => {
      if (global[type] && !global[type]._arrayPatched) {
        const original = global[type];
        global[type] = new Proxy(original, {
          get(target, prop) {
            const result = Reflect.get(target, prop);
            if (result && Utils.isValidCollection(result)) {
              return enhanceCollectionWithArraySupport(result);
            }
            return result;
          },
          apply(target, thisArg, args) {
            const result = Reflect.apply(target, thisArg, args);
            if (result && Utils.isValidCollection(result)) {
              return enhanceCollectionWithArraySupport(result);
            }
            return result;
          }
        });
        global[type]._arrayPatched = true;
        patched++;
      }
    });

    return patched > 0;
  }

  // ===== INITIALIZATION =====

  function initialize() {
    console.log('[Array Distribution] Initializing...');
    
    let patchCount = 0;
    const patches = [];

    if (patchSelectorHelper()) {
      patches.push('Selector');
      patchCount++;
    }

    if (patchCollectionsHelper()) {
      patches.push('Collections');
      patchCount++;
    }

    if (patchGlobalQuery()) {
      patches.push('Global Query');
      patchCount++;
    }

    if (patchGlobalShortcuts()) {
      patches.push('Global Shortcuts');
      patchCount++;
    }

    if (patchCount > 0) {
      console.log(`[Array Distribution] ✓ Initialized - Patched: ${patches.join(', ')}`);
      console.log('[Array Distribution] Usage: collection.update({ textContent: ["A", "B", "C"] })');
    } else {
      console.log('[Array Distribution] v2.0.0 loaded (no systems found to patch)');
    }

    return patchCount > 0;
  }

  // Auto-initialize with delay (after collection-enhancements.js)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initialize, 50);
    });
  } else {
    setTimeout(initialize, 50);
  }

  // ===== EXPORT =====

  const ArrayDistribution = {
    version: '2.0.0',
    
    // Core functions
    applyArrayBasedUpdates,
    processUpdatesForElement,
    getValueForIndex,
    
    // Detection
    isDistributableArray,
    containsArrayValues,
    
    // Enhancement
    enhance: enhanceCollectionWithArraySupport,
    
    // Patching
    patchSelector: patchSelectorHelper,
    patchCollections: patchCollectionsHelper,
    patchGlobalQuery,
    patchGlobalShortcuts,
    
    // Utilities
    initialize,
    reinitialize: initialize,
    
    hasSupport(collection) {
      return !!(collection && collection._hasArraySupport);
    }
  };

  // Export for different module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArrayDistribution;
  } else if (typeof define === 'function' && define.amd) {
    define([], () => ArrayDistribution);
  } else {
    global.ArrayDistribution = ArrayDistribution;
    
    if (global.DOMHelpers) {
      global.DOMHelpers.ArrayDistribution = ArrayDistribution;
    }
  }

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
