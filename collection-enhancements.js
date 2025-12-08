/**
 * DOM Helpers - Collection Enhancements
 * Comprehensive collection enhancement system
 * 
 * @version 2.0.0
 * @license MIT
 * @requires utilities.js
 * 
 * Features:
 *   1. Bulk property updaters (textContent, innerHTML, value, style, dataset, etc.)
 *   2. Index selection (collection[0], collection[-1])
 *   3. Indexed updates (update({ [0]: {...}, [1]: {...} }))
 *   4. Enhanced proxy wrapping for all collection types
 * 
 * Combines functionality from:
 *   - 01_bulk-property-updaters.js
 *   - 04_indexed-collection-updates.js
 *   - 05_index-selection.js
 *   - 06_global-collection-indexed-updates.js
 *   - 07_bulk-properties-updater-global-query.js
 *   - 08_selector-update-patch.js
 */

(function(global) {
  'use strict';

  // ===== DEPENDENCY CHECK =====
  const Utils = global.EnhancerUtilities;
  if (!Utils) {
    console.error('[Collection Enhancements] EnhancerUtilities not found. Load utilities.js first!');
    return;
  }

  // ===== BULK PROPERTY UPDATERS =====

  /**
   * Creates index-based property updater function
   * Distributes values across collection by index
   * 
   * @param {string} property - Property name to update
   * @returns {Function} Updater function
   */
  function createIndexBasedPropertyUpdater(property) {
    return function(values) {
      const elements = Utils.getCollectionElements(this);
      
      if (elements.length === 0) {
        console.warn(`[Collection Enhancements] Cannot update ${property}: collection is empty`);
        return this;
      }

      if (Array.isArray(values)) {
        // Distribute values by index
        elements.forEach((element, index) => {
          const value = index < values.length ? values[index] : values[values.length - 1];
          if (element && value !== undefined && value !== null) {
            element[property] = value;
          }
        });
      } else {
        // Apply same value to all
        elements.forEach(element => {
          if (element && values !== undefined && values !== null) {
            element[property] = values;
          }
        });
      }

      return this;
    };
  }

  /**
   * Creates index-based style updater
   * Handles both object and array-of-objects for style updates
   */
  function createIndexBasedStyleUpdater() {
    return function(styles) {
      const elements = Utils.getCollectionElements(this);
      
      if (elements.length === 0) {
        console.warn('[Collection Enhancements] Cannot update style: collection is empty');
        return this;
      }

      if (Array.isArray(styles)) {
        // Array of style objects - distribute by index
        elements.forEach((element, index) => {
          const styleObj = index < styles.length ? styles[index] : styles[styles.length - 1];
          if (element && styleObj && typeof styleObj === 'object') {
            Object.assign(element.style, styleObj);
          }
        });
      } else if (typeof styles === 'object' && styles !== null) {
        // Single style object - apply to all
        elements.forEach(element => {
          if (element) {
            Object.assign(element.style, styles);
          }
        });
      }

      return this;
    };
  }

  /**
   * Creates index-based dataset updater
   */
  function createIndexBasedDatasetUpdater() {
    return function(data) {
      const elements = Utils.getCollectionElements(this);
      
      if (elements.length === 0) {
        console.warn('[Collection Enhancements] Cannot update dataset: collection is empty');
        return this;
      }

      if (Array.isArray(data)) {
        // Array of dataset objects - distribute by index
        elements.forEach((element, index) => {
          const dataObj = index < data.length ? data[index] : data[data.length - 1];
          if (element && dataObj && typeof dataObj === 'object') {
            Object.entries(dataObj).forEach(([key, value]) => {
              element.dataset[key] = value;
            });
          }
        });
      } else if (typeof data === 'object' && data !== null) {
        // Single dataset object - apply to all
        elements.forEach(element => {
          if (element) {
            Object.entries(data).forEach(([key, value]) => {
              element.dataset[key] = value;
            });
          }
        });
      }

      return this;
    };
  }

  /**
   * Creates index-based classList updater
   */
  function createIndexBasedClassListUpdater() {
    return function(classOperations) {
      const elements = Utils.getCollectionElements(this);
      
      if (elements.length === 0) {
        console.warn('[Collection Enhancements] Cannot update classes: collection is empty');
        return this;
      }

      if (Array.isArray(classOperations)) {
        // Array of class operations - distribute by index
        elements.forEach((element, index) => {
          const ops = index < classOperations.length ? classOperations[index] : classOperations[classOperations.length - 1];
          if (element && ops && typeof ops === 'object') {
            Object.entries(ops).forEach(([method, classes]) => {
              const classList = Array.isArray(classes) ? classes : [classes];
              if (method === 'add') element.classList.add(...classList);
              else if (method === 'remove') element.classList.remove(...classList);
              else if (method === 'toggle') classList.forEach(c => element.classList.toggle(c));
            });
          }
        });
      } else if (typeof classOperations === 'object' && classOperations !== null) {
        // Single class operations object - apply to all
        elements.forEach(element => {
          if (element) {
            Object.entries(classOperations).forEach(([method, classes]) => {
              const classList = Array.isArray(classes) ? classes : [classes];
              if (method === 'add') element.classList.add(...classList);
              else if (method === 'remove') element.classList.remove(...classList);
              else if (method === 'toggle') classList.forEach(c => element.classList.toggle(c));
            });
          }
        });
      }

      return this;
    };
  }

  /**
   * Creates index-based attributes updater
   */
  function createIndexBasedAttributesUpdater() {
    return function(attributes) {
      const elements = Utils.getCollectionElements(this);
      
      if (elements.length === 0) {
        console.warn('[Collection Enhancements] Cannot update attributes: collection is empty');
        return this;
      }

      if (Array.isArray(attributes)) {
        // Array of attribute objects - distribute by index
        elements.forEach((element, index) => {
          const attrs = index < attributes.length ? attributes[index] : attributes[attributes.length - 1];
          if (element && attrs && typeof attrs === 'object') {
            Object.entries(attrs).forEach(([attr, value]) => {
              element.setAttribute(attr, value);
            });
          }
        });
      } else if (typeof attributes === 'object' && attributes !== null) {
        // Single attributes object - apply to all
        elements.forEach(element => {
          if (element) {
            Object.entries(attributes).forEach(([attr, value]) => {
              element.setAttribute(attr, value);
            });
          }
        });
      }

      return this;
    };
  }

  /**
   * Creates generic property updater for any property
   */
  function createIndexBasedGenericPropertyUpdater() {
    return function(propertyName, values) {
      const elements = Utils.getCollectionElements(this);
      
      if (elements.length === 0 || !propertyName) {
        return this;
      }

      if (Array.isArray(values)) {
        elements.forEach((element, index) => {
          const value = index < values.length ? values[index] : values[values.length - 1];
          if (element && propertyName in element) {
            element[propertyName] = value;
          }
        });
      } else {
        elements.forEach(element => {
          if (element && propertyName in element) {
            element[propertyName] = values;
          }
        });
      }

      return this;
    };
  }

  // ===== INDEXED UPDATE SYSTEM =====

  /**
   * Creates enhanced update method that handles both bulk and indexed updates
   * Supports: update({ textContent: 'all' }) and update({ [0]: {...}, [1]: {...} })
   */
  function createEnhancedCollectionUpdate(originalUpdate) {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[Collection Enhancements] .update() requires an object');
        return this;
      }

      const elements = Utils.getCollectionElements(this);
      
      if (elements.length === 0) {
        console.warn('[Collection Enhancements] Cannot update: collection is empty');
        return this;
      }

      // Separate indexed and bulk updates
      const { indexUpdates, bulkUpdates, hasIndexUpdates, hasBulkUpdates } = Utils.separateUpdates(updates);

      // Apply bulk updates to all elements
      if (hasBulkUpdates) {
        elements.forEach(element => {
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            Utils.applyUpdatesToElement(element, bulkUpdates);
          }
        });
      }

      // Apply index-specific updates
      if (hasIndexUpdates) {
        Object.entries(indexUpdates).forEach(([indexStr, updateData]) => {
          const index = Utils.normalizeIndex(indexStr, elements.length);

          if (index >= 0 && index < elements.length) {
            const element = elements[index];
            if (element && element.nodeType === Node.ELEMENT_NODE) {
              Utils.applyUpdatesToElement(element, updateData);
            }
          } else {
            console.warn(`[Collection Enhancements] Index ${indexStr} out of bounds (length: ${elements.length})`);
          }
        });
      }

      // Call original update if available and no special handling needed
      if (!hasIndexUpdates && originalUpdate && typeof originalUpdate === 'function') {
        return originalUpdate.call(this, updates);
      }

      return this;
    };
  }

  // ===== PROXY SYSTEM FOR INDEX ACCESS =====

  /**
   * Creates enhanced proxy that intercepts numeric index access
   * Enables: collection[0], collection[-1], etc.
   */
  function createIndexAccessProxy(collection) {
    if (!collection) return collection;

    // Already proxied
    if (collection._isIndexProxied) {
      return collection;
    }

    return new Proxy(collection, {
      get(target, prop) {
        // Handle special properties normally
        if (Utils.isSpecialProperty(prop)) {
          return target[prop];
        }

        // Handle numeric index access
        if (Utils.isNumericIndex(prop)) {
          const index = parseInt(prop, 10);
          return Utils.getElementAtIndex(target, index);
        }

        // Default behavior
        return target[prop];
      },

      set(target, prop, value) {
        try {
          target[prop] = value;
          return true;
        } catch (e) {
          console.warn(`[Collection Enhancements] Failed to set ${String(prop)}:`, e.message);
          return false;
        }
      }
    });
  }

  // ===== COLLECTION ENHANCEMENT (MAIN FUNCTION) =====

  /**
   * Enhances a collection with all features:
   * - Bulk property updaters
   * - Index access proxy
   * - Enhanced update method with indexed updates
   * 
   * @param {*} collection - Collection to enhance
   * @returns {Proxy} Enhanced collection
   */
  function enhanceCollection(collection) {
    if (!collection || !Utils.isValidCollection(collection)) {
      return collection;
    }

    // Already enhanced
    if (collection._collectionEnhanced) {
      return collection;
    }

    // Add bulk property updaters
    const bulkProperties = {
      textContent: createIndexBasedPropertyUpdater('textContent'),
      innerHTML: createIndexBasedPropertyUpdater('innerHTML'),
      innerText: createIndexBasedPropertyUpdater('innerText'),
      value: createIndexBasedPropertyUpdater('value'),
      placeholder: createIndexBasedPropertyUpdater('placeholder'),
      title: createIndexBasedPropertyUpdater('title'),
      disabled: createIndexBasedPropertyUpdater('disabled'),
      checked: createIndexBasedPropertyUpdater('checked'),
      readonly: createIndexBasedPropertyUpdater('readOnly'),
      hidden: createIndexBasedPropertyUpdater('hidden'),
      selected: createIndexBasedPropertyUpdater('selected'),
      src: createIndexBasedPropertyUpdater('src'),
      href: createIndexBasedPropertyUpdater('href'),
      alt: createIndexBasedPropertyUpdater('alt'),
      style: createIndexBasedStyleUpdater(),
      dataset: createIndexBasedDatasetUpdater(),
      attrs: createIndexBasedAttributesUpdater(),
      classes: createIndexBasedClassListUpdater(),
      prop: createIndexBasedGenericPropertyUpdater()
    };

    // Add properties to collection
    Object.entries(bulkProperties).forEach(([name, updater]) => {
      try {
        Object.defineProperty(collection, name, {
          value: updater,
          writable: false,
          enumerable: false,
          configurable: true
        });
      } catch (error) {
        // Fallback
        collection[name] = updater;
      }
    });

    // Enhance update method
    const originalUpdate = collection.update;
    const enhancedUpdate = createEnhancedCollectionUpdate(originalUpdate);

    try {
      Object.defineProperty(collection, 'update', {
        value: enhancedUpdate,
        writable: true,
        enumerable: false,
        configurable: true
      });
    } catch (error) {
      collection.update = enhancedUpdate;
    }

    // Mark as enhanced
    try {
      Object.defineProperty(collection, '_collectionEnhanced', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
    } catch (error) {
      collection._collectionEnhanced = true;
    }

    // Wrap with index access proxy
    return createIndexAccessProxy(collection);
  }

  // ===== PATCHING SYSTEM =====

  /**
   * Patches Collections helper to auto-enhance all collections
   */
  function patchCollectionsHelper() {
    if (!global.Collections || !global.Collections.helper) {
      return false;
    }

    const helper = global.Collections.helper;
    let patched = false;

    // Hook _enhanceCollection
    if (helper._enhanceCollection && !helper._enhanceCollection._patched) {
      const original = helper._enhanceCollection.bind(helper);
      helper._enhanceCollection = function(htmlCollection, type, value) {
        const collection = original(htmlCollection, type, value);
        return enhanceCollection(collection);
      };
      helper._enhanceCollection._patched = true;
      patched = true;
    }

    return patched;
  }

  /**
   * Patches Selector helper to auto-enhance all query results
   */
  function patchSelectorHelper() {
    if (!global.Selector || !global.Selector.helper) {
      return false;
    }

    const helper = global.Selector.helper;
    let patched = false;

    // Hook _enhanceNodeList
    if (helper._enhanceNodeList && !helper._enhanceNodeList._patched) {
      const original = helper._enhanceNodeList.bind(helper);
      helper._enhanceNodeList = function(nodeList, selector) {
        const collection = original(nodeList, selector);
        return enhanceCollection(collection);
      };
      helper._enhanceNodeList._patched = true;
      patched = true;
    }

    return patched;
  }

  /**
   * Patches global query functions (if they exist)
   */
  function patchGlobalQueryFunctions() {
    let patched = false;

    // Patch querySelectorAll
    if (global.querySelectorAll && typeof global.querySelectorAll === 'function' && !global.querySelectorAll._patched) {
      const original = global.querySelectorAll;
      global.querySelectorAll = function(...args) {
        const result = original.apply(this, args);
        return enhanceCollection(result);
      };
      global.querySelectorAll._patched = true;
      patched = true;
    }

    // Patch queryAll
    if (global.queryAll && typeof global.queryAll === 'function' && !global.queryAll._patched) {
      const original = global.queryAll;
      global.queryAll = function(...args) {
        const result = original.apply(this, args);
        return enhanceCollection(result);
      };
      global.queryAll._patched = true;
      patched = true;
    }

    return patched;
  }

  // ===== INITIALIZATION =====

  function initialize() {
    let patchCount = 0;

    if (patchCollectionsHelper()) {
      console.log('[Collection Enhancements] ✓ Patched Collections helper');
      patchCount++;
    }

    if (patchSelectorHelper()) {
      console.log('[Collection Enhancements] ✓ Patched Selector helper');
      patchCount++;
    }

    if (patchGlobalQueryFunctions()) {
      console.log('[Collection Enhancements] ✓ Patched global query functions');
      patchCount++;
    }

    if (patchCount > 0) {
      console.log(`[Collection Enhancements] v2.0.0 initialized - ${patchCount} systems patched`);
    } else {
      console.log('[Collection Enhancements] v2.0.0 loaded (no systems found to patch)');
    }

    return patchCount > 0;
  }

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // ===== EXPORT =====

  const CollectionEnhancements = {
    version: '2.0.0',
    
    // Main enhancement function
    enhance: enhanceCollection,
    
    // Manual patching
    patchCollections: patchCollectionsHelper,
    patchSelector: patchSelectorHelper,
    patchGlobalQuery: patchGlobalQueryFunctions,
    
    // Re-initialize
    reinitialize: initialize,
    
    // Check if enhanced
    isEnhanced: (collection) => {
      return !!(collection && collection._collectionEnhanced);
    },
    
    // Direct property updaters (for manual use)
    createPropertyUpdater: createIndexBasedPropertyUpdater,
    createStyleUpdater: createIndexBasedStyleUpdater,
    createDatasetUpdater: createIndexBasedDatasetUpdater,
    createClassListUpdater: createIndexBasedClassListUpdater
  };

  // Export for different module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CollectionEnhancements;
  } else if (typeof define === 'function' && define.amd) {
    define([], () => CollectionEnhancements);
  } else {
    global.CollectionEnhancements = CollectionEnhancements;
    
    if (global.DOMHelpers) {
      global.DOMHelpers.CollectionEnhancements = CollectionEnhancements;
    }
  }

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
