/**
 * 01_core-update-engine.js
 * 
 * DOM Helpers - Core Update Engine
 * Single source of truth for all element and collection update logic
 * 
 * Consolidates logic from:
 * - 01_dh-bulk-property-updaters.js
 * - 04_dh-indexed-collection-updates.js
 * - 06_dh-global-collection-indexed-updates.js
 * - 07_dh-bulk-properties-updater-global-query.js
 * - 08_dh-selector-update-patch.js
 * 
 * @version 2.0.0
 * @license MIT
 */

(function(global) {
  'use strict';

  console.log('[Core Update Engine] v2.0.0 Loading...');

  // ===== CORE UPDATE LOGIC =====

  /**
   * Apply updates to a single element
   * Single implementation used everywhere - no duplication
   * 
   * @param {HTMLElement} element - DOM element to update
   * @param {Object} updates - Updates to apply
   */
  function applyUpdatesToElement(element, updates) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    Object.entries(updates).forEach(([key, value]) => {
      try {
        // Handle style object
        if (key === 'style' && typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([styleProperty, styleValue]) => {
            if (styleValue !== null && styleValue !== undefined) {
              element.style[styleProperty] = styleValue;
            }
          });
          return;
        }

        // Handle classList operations
        if (key === 'classList' && typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([method, classes]) => {
            const classList = Array.isArray(classes) ? classes : [classes];
            switch (method) {
              case 'add':
                element.classList.add(...classList);
                break;
              case 'remove':
                element.classList.remove(...classList);
                break;
              case 'toggle':
                classList.forEach(c => element.classList.toggle(c));
                break;
              case 'replace':
                if (classList.length === 2) {
                  element.classList.replace(classList[0], classList[1]);
                }
                break;
            }
          });
          return;
        }

        // Handle dataset
        if (key === 'dataset' && typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([dataKey, dataVal]) => {
            element.dataset[dataKey] = dataVal;
          });
          return;
        }

        // Handle setAttribute (object or array form)
        if (key === 'setAttribute') {
          if (Array.isArray(value) && value.length >= 2) {
            element.setAttribute(value[0], value[1]);
          } else if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([attr, val]) => {
              element.setAttribute(attr, val);
            });
          }
          return;
        }

        // Handle attrs/attributes (alias for setAttribute)
        if ((key === 'attrs' || key === 'attributes') && typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([attrName, attrValue]) => {
            if (attrValue === null || attrValue === false) {
              element.removeAttribute(attrName);
            } else {
              element.setAttribute(attrName, String(attrValue));
            }
          });
          return;
        }

        // Handle removeAttribute
        if (key === 'removeAttribute') {
          const attrs = Array.isArray(value) ? value : [value];
          attrs.forEach(attr => element.removeAttribute(attr));
          return;
        }

        // Handle addEventListener
        if (key === 'addEventListener') {
          if (Array.isArray(value) && value.length >= 2) {
            element.addEventListener(value[0], value[1], value[2]);
          } else if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([event, handler]) => {
              if (typeof handler === 'function') {
                element.addEventListener(event, handler);
              } else if (Array.isArray(handler)) {
                element.addEventListener(event, handler[0], handler[1]);
              }
            });
          }
          return;
        }

        // Handle event properties (onclick, onchange, etc.)
        if (key.startsWith('on') && typeof value === 'function') {
          element[key] = value;
          return;
        }

        // Handle methods
        if (typeof element[key] === 'function') {
          if (Array.isArray(value)) {
            element[key](...value);
          } else {
            element[key](value);
          }
          return;
        }

        // Handle direct properties
        if (key in element) {
          element[key] = value;
          return;
        }

        // Fallback to setAttribute for unknown properties
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          element.setAttribute(key, String(value));
        }

      } catch (error) {
        console.warn(`[Core Update Engine] Failed to apply ${key}:`, error.message);
      }
    });
  }

  // ===== ELEMENT ENHANCEMENT =====

  /**
   * Enhance a single element with .update() method
   * 
   * @param {HTMLElement} element - DOM element to enhance
   * @returns {HTMLElement} - Enhanced element
   */
  function enhanceElement(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return element;
    }

    // Don't re-enhance
    if (element._hasEnhancedUpdateMethod || element._domHelpersEnhanced || element._hasUpdateMethod) {
      return element;
    }

    // Create update method
    const updateMethod = function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[Core Update Engine] element.update() requires an object');
        return this;
      }

      applyUpdatesToElement(this, updates);
      return this; // Return for chaining
    };

    // Add update method
    try {
      Object.defineProperty(element, 'update', {
        value: updateMethod,
        writable: false,
        enumerable: false,
        configurable: true
      });

      Object.defineProperty(element, '_hasEnhancedUpdateMethod', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
    } catch (error) {
      // Fallback if defineProperty fails
      element.update = updateMethod;
      element._hasEnhancedUpdateMethod = true;
    }

    return element;
  }

  // ===== COLLECTION ENHANCEMENT =====

  /**
   * Detect if updates contain numeric indices (for index-specific updates)
   * 
   * @param {Object} updates - Update object
   * @returns {Object} - { hasIndices: boolean, indexUpdates: {}, bulkUpdates: {} }
   */
  function separateIndexAndBulkUpdates(updates) {
    const indexUpdates = {};
    const bulkUpdates = {};
    let hasIndices = false;
    let hasBulk = false;

    Object.keys(updates).forEach(key => {
      // Skip symbols
      if (typeof key === 'symbol') return;

      // Check if it's a valid numeric index
      const num = parseInt(key, 10);
      if (!isNaN(num) && String(num) === key) {
        indexUpdates[key] = updates[key];
        hasIndices = true;
      } else {
        bulkUpdates[key] = updates[key];
        hasBulk = true;
      }
    });

    return { hasIndices, hasBulk, indexUpdates, bulkUpdates };
  }

  /**
   * Create enhanced update method for collections
   * Handles three modes:
   * 1. Bulk updates: { textContent: 'Same for all' }
   * 2. Index-specific: { [0]: {...}, [1]: {...} }
   * 3. Mixed: { [0]: {...}, classList: {...} } - bulk applies to all, then index overrides
   * 
   * @param {Object} collection - Collection object
   * @returns {Function} - Enhanced update method
   */
  function createCollectionUpdateMethod(collection) {
    return function collectionUpdate(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[Core Update Engine] collection.update() requires an object');
        return this;
      }

      // Get elements from collection
      let elements = [];
      if (this._originalCollection) {
        elements = Array.from(this._originalCollection);
      } else if (this._originalNodeList) {
        elements = Array.from(this._originalNodeList);
      } else if (this.length !== undefined) {
        try {
          elements = Array.from(this);
        } catch (e) {
          for (let i = 0; i < this.length; i++) {
            elements.push(this[i]);
          }
        }
      }

      if (elements.length === 0) {
        console.info('[Core Update Engine] Collection is empty');
        return this;
      }

      const length = elements.length;
      const { hasIndices, hasBulk, indexUpdates, bulkUpdates } = separateIndexAndBulkUpdates(updates);

      try {
        // Apply bulk updates to ALL elements first
        if (hasBulk) {
          elements.forEach(element => {
            if (element && element.nodeType === Node.ELEMENT_NODE) {
              applyUpdatesToElement(element, bulkUpdates);
            }
          });
        }

        // Then apply index-specific updates (can override bulk)
        if (hasIndices) {
          Object.entries(indexUpdates).forEach(([indexStr, elementUpdates]) => {
            let index = parseInt(indexStr, 10);
            
            // Handle negative indices
            if (index < 0) {
              index = length + index;
            }

            if (index >= 0 && index < length) {
              const element = elements[index];
              if (element && element.nodeType === Node.ELEMENT_NODE) {
                if (elementUpdates && typeof elementUpdates === 'object') {
                  applyUpdatesToElement(element, elementUpdates);
                }
              }
            } else {
              console.warn(`[Core Update Engine] Index ${indexStr} out of bounds (length: ${length})`);
            }
          });
        }

      } catch (error) {
        console.error(`[Core Update Engine] Error in collection.update():`, error);
      }

      return this; // Return for chaining
    };
  }

  /**
   * Enhance a collection with .update() method
   * 
   * @param {Object} collection - Collection to enhance (NodeList, HTMLCollection, or custom)
   * @returns {Object} - Enhanced collection
   */
  function enhanceCollection(collection) {
    if (!collection) {
      return collection;
    }

    // Don't re-enhance
    if (collection._hasCoreUpdateSupport) {
      return collection;
    }

    // Create and attach update method
    const updateMethod = createCollectionUpdateMethod(collection);

    try {
      Object.defineProperty(collection, 'update', {
        value: updateMethod,
        writable: true, // Allow override by other enhancers
        enumerable: false,
        configurable: true
      });

      Object.defineProperty(collection, '_hasCoreUpdateSupport', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
    } catch (error) {
      // Fallback if defineProperty fails
      collection.update = updateMethod;
      collection._hasCoreUpdateSupport = true;
    }

    return collection;
  }

  /**
   * Get element from collection at index (handles negative indices)
   * 
   * @param {Object} collection - Collection
   * @param {number} index - Index (can be negative)
   * @returns {HTMLElement|null} - Element or null
   */
  function getElementAtIndex(collection, index) {
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

    // Handle negative indices
    if (index < 0) {
      index = elements.length + index;
    }

    if (index >= 0 && index < elements.length) {
      const element = elements[index];
      if (element && element.nodeType === Node.ELEMENT_NODE) {
        return enhanceElement(element);
      }
    }

    return null;
  }

  // ===== ENHANCED UPDATE UTILITY (for compatibility) =====

  const EnhancedUpdateUtility = {
    version: '2.0.0',
    
    // Core functions
    applyEnhancedUpdate: applyUpdatesToElement,
    applyUpdatesToElement: applyUpdatesToElement,
    
    // Element enhancement
    enhanceElementWithUpdate: enhanceElement,
    enhanceElement: enhanceElement,
    
    // Collection enhancement
    enhanceCollectionWithUpdate: enhanceCollection,
    enhanceCollection: enhanceCollection,
    createCollectionUpdateMethod: createCollectionUpdateMethod,
    
    // Utilities
    getElementAtIndex: getElementAtIndex,
    separateIndexAndBulkUpdates: separateIndexAndBulkUpdates,
    
    // Check if enhanced
    hasSupport(elementOrCollection) {
      return !!(elementOrCollection && 
        (elementOrCollection._hasEnhancedUpdateMethod || 
         elementOrCollection._hasCoreUpdateSupport));
    }
  };

  // ===== EXPORT =====

  // Make available globally
  if (typeof global.EnhancedUpdateUtility === 'undefined') {
    global.EnhancedUpdateUtility = EnhancedUpdateUtility;
  } else {
    // Merge with existing if present
    Object.assign(global.EnhancedUpdateUtility, EnhancedUpdateUtility);
  }

  // Export as CoreUpdateEngine
  global.CoreUpdateEngine = EnhancedUpdateUtility;

  // Add to DOMHelpers if available
  if (typeof global.DOMHelpers !== 'undefined') {
    global.DOMHelpers.CoreUpdateEngine = EnhancedUpdateUtility;
    global.DOMHelpers.EnhancedUpdateUtility = EnhancedUpdateUtility;
  }

  // Module exports
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedUpdateUtility;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return EnhancedUpdateUtility;
    });
  }

  console.log('[Core Update Engine] ✓ Loaded successfully');
  console.log('[Core Update Engine] Provides: element.update(), collection.update()');

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);