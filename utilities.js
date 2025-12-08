/**
 * DOM Helpers - Enhancer Utilities
 * Shared utility functions for all enhancers
 * 
 * @version 2.0.0
 * @license MIT
 * 
 * Purpose:
 *   - Provides common functionality used across all enhancer modules
 *   - Ensures consistent behavior and DRY principles
 *   - Single source of truth for shared logic
 */

(function(global) {
  'use strict';

  // ===== ELEMENT ENHANCEMENT UTILITIES =====

  /**
   * Ensures an element has the .update() method
   * Uses existing enhancement if available, adds minimal version otherwise
   * 
   * @param {HTMLElement} element - Element to enhance
   * @returns {HTMLElement} Enhanced element
   */
  function ensureElementUpdate(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return element;
    }

    // Already enhanced by core or another enhancer
    if (element._hasEnhancedUpdateMethod || element._hasUpdateMethod || element.update) {
      return element;
    }

    // Add minimal update method
    try {
      Object.defineProperty(element, 'update', {
        value: function(updates = {}) {
          if (!updates || typeof updates !== 'object') {
            return this;
          }

          Object.entries(updates).forEach(([key, value]) => {
            try {
              if (key === 'style' && typeof value === 'object' && value !== null) {
                Object.assign(this.style, value);
              } else if (key === 'classList' && typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([method, classes]) => {
                  const classList = Array.isArray(classes) ? classes : [classes];
                  if (method === 'add') this.classList.add(...classList);
                  else if (method === 'remove') this.classList.remove(...classList);
                  else if (method === 'toggle') classList.forEach(c => this.classList.toggle(c));
                });
              } else if (key === 'dataset' && typeof value === 'object' && value !== null) {
                Object.assign(this.dataset, value);
              } else if (key === 'setAttribute' && typeof value === 'object') {
                Object.entries(value).forEach(([attr, val]) => this.setAttribute(attr, val));
              } else if (key in this) {
                this[key] = value;
              } else {
                this.setAttribute(key, String(value));
              }
            } catch (err) {
              console.warn(`[Enhancer Utils] Failed to apply ${key}:`, err.message);
            }
          });

          return this;
        },
        writable: false,
        enumerable: false,
        configurable: true
      });

      Object.defineProperty(element, '_hasUpdateMethod', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
    } catch (error) {
      // Fallback for environments with strict property definitions
      element.update = function(updates = {}) {
        if (!updates || typeof updates !== 'object') return this;
        Object.entries(updates).forEach(([key, value]) => {
          try {
            if (key === 'style' && typeof value === 'object' && value !== null) {
              Object.assign(this.style, value);
            } else if (key === 'classList' && typeof value === 'object' && value !== null) {
              Object.entries(value).forEach(([method, classes]) => {
                const classList = Array.isArray(classes) ? classes : [classes];
                if (method === 'add') this.classList.add(...classList);
                else if (method === 'remove') this.classList.remove(...classList);
                else if (method === 'toggle') classList.forEach(c => this.classList.toggle(c));
              });
            } else if (key === 'dataset' && typeof value === 'object' && value !== null) {
              Object.assign(this.dataset, value);
            } else if (key in this) {
              this[key] = value;
            } else {
              this.setAttribute(key, String(value));
            }
          } catch (err) {
            console.warn(`[Enhancer Utils] Failed to apply ${key}:`, err.message);
          }
        });
        return this;
      };
      element._hasUpdateMethod = true;
    }

    return element;
  }

  // ===== COLLECTION UTILITIES =====

  /**
   * Extracts elements array from any collection type
   * Handles: HTMLCollection, NodeList, custom collections, arrays
   * 
   * @param {*} collection - Collection to extract from
   * @returns {Array<HTMLElement>} Array of elements
   */
  function getCollectionElements(collection) {
    if (!collection) {
      return [];
    }

    // Custom collection with _originalCollection
    if (collection._originalCollection) {
      return Array.from(collection._originalCollection);
    }

    // Custom collection with _originalNodeList
    if (collection._originalNodeList) {
      return Array.from(collection._originalNodeList);
    }

    // Native collections
    if (collection instanceof HTMLCollection || collection instanceof NodeList) {
      return Array.from(collection);
    }

    // Array-like with length
    if (typeof collection.length === 'number') {
      return Array.from(collection);
    }

    return [];
  }

  /**
   * Gets a single element by index from a collection
   * Handles negative indices, bounds checking, and enhancement
   * 
   * @param {*} collection - Collection to access
   * @param {number} index - Index to retrieve (supports negative)
   * @returns {HTMLElement|null} Element or null
   */
  function getElementAtIndex(collection, index) {
    const elements = getCollectionElements(collection);
    
    if (elements.length === 0) {
      return null;
    }

    // Handle negative indices
    let normalizedIndex = index;
    if (normalizedIndex < 0) {
      normalizedIndex = elements.length + normalizedIndex;
    }

    // Bounds check
    if (normalizedIndex < 0 || normalizedIndex >= elements.length) {
      return null;
    }

    const element = elements[normalizedIndex];
    return element ? ensureElementUpdate(element) : null;
  }

  // ===== INDEX UTILITIES =====

  /**
   * Checks if a property key is a numeric index
   * 
   * @param {string|symbol} key - Property key to check
   * @returns {boolean} True if numeric index
   */
  function isNumericIndex(key) {
    if (typeof key === 'symbol') {
      return false;
    }

    const str = String(key);
    return /^-?\d+$/.test(str);
  }

  /**
   * Normalizes an index (handles negative values)
   * 
   * @param {number|string} index - Index to normalize
   * @param {number} length - Length of collection
   * @returns {number} Normalized index
   */
  function normalizeIndex(index, length) {
    let idx = typeof index === 'string' ? parseInt(index, 10) : index;
    
    if (isNaN(idx)) {
      return -1;
    }

    if (idx < 0) {
      idx = length + idx;
    }

    return idx;
  }

  /**
   * Checks if a property key should be treated as special/non-index
   * (for proxy handlers to avoid intercepting internal properties)
   * 
   * @param {string|symbol} prop - Property to check
   * @returns {boolean} True if special property
   */
  function isSpecialProperty(prop) {
    if (typeof prop === 'symbol') {
      return true;
    }

    const specialProps = [
      'constructor', 'prototype', 'toString', 'valueOf',
      'apply', 'call', 'bind', 'length', 'name',
      'then', 'catch', 'finally', // Promise-like
      '_originalCollection', '_originalNodeList',
      '_isEnhancedWrapper', '_hasEnhancedUpdateMethod',
      '_hasUpdateMethod', '_indexSelectionEnhanced',
      'update', 'toArray', 'forEach', 'map', 'filter',
      'first', 'last', 'at', 'item'
    ];

    return specialProps.includes(prop);
  }

  // ===== UPDATE UTILITIES =====

  /**
   * Separates indexed and bulk updates from an update object
   * 
   * @param {Object} updates - Update object to separate
   * @returns {Object} { indexUpdates, bulkUpdates, hasIndexUpdates, hasBulkUpdates }
   */
  function separateUpdates(updates) {
    const indexUpdates = {};
    const bulkUpdates = {};
    let hasIndexUpdates = false;
    let hasBulkUpdates = false;

    Object.entries(updates).forEach(([key, value]) => {
      if (isNumericIndex(key)) {
        indexUpdates[key] = value;
        hasIndexUpdates = true;
      } else {
        bulkUpdates[key] = value;
        hasBulkUpdates = true;
      }
    });

    return { indexUpdates, bulkUpdates, hasIndexUpdates, hasBulkUpdates };
  }

  /**
   * Applies updates to a single element
   * Uses EnhancedUpdateUtility if available, falls back to element.update()
   * 
   * @param {HTMLElement} element - Element to update
   * @param {Object} updates - Updates to apply
   */
  function applyUpdatesToElement(element, updates) {
    if (!element || !updates || typeof updates !== 'object') {
      return;
    }

    // Try EnhancedUpdateUtility first (from core)
    if (global.EnhancedUpdateUtility && global.EnhancedUpdateUtility.applyEnhancedUpdate) {
      Object.entries(updates).forEach(([key, value]) => {
        global.EnhancedUpdateUtility.applyEnhancedUpdate(element, key, value);
      });
      return;
    }

    // Fall back to element's update method
    const enhanced = ensureElementUpdate(element);
    if (enhanced.update) {
      enhanced.update(updates);
    }
  }

  // ===== VALIDATION UTILITIES =====

  /**
   * Validates that a value is a valid collection
   * 
   * @param {*} value - Value to validate
   * @returns {boolean} True if valid collection
   */
  function isValidCollection(value) {
    if (!value) return false;

    return (
      value instanceof HTMLCollection ||
      value instanceof NodeList ||
      (typeof value === 'object' && typeof value.length === 'number') ||
      value._originalCollection ||
      value._originalNodeList
    );
  }

  /**
   * Checks if an object is empty
   * 
   * @param {Object} obj - Object to check
   * @returns {boolean} True if empty
   */
  function isEmptyObject(obj) {
    if (!obj || typeof obj !== 'object') return true;
    return Object.keys(obj).length === 0;
  }

  // ===== EXPORT =====

  const EnhancerUtilities = {
    version: '2.0.0',

    // Element utilities
    ensureElementUpdate,

    // Collection utilities
    getCollectionElements,
    getElementAtIndex,
    isValidCollection,

    // Index utilities
    isNumericIndex,
    normalizeIndex,
    isSpecialProperty,

    // Update utilities
    separateUpdates,
    applyUpdatesToElement,

    // Validation
    isEmptyObject
  };

  // Export for different module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancerUtilities;
  } else if (typeof define === 'function' && define.amd) {
    define([], () => EnhancerUtilities);
  } else {
    global.EnhancerUtilities = EnhancerUtilities;
    
    if (global.DOMHelpers) {
      global.DOMHelpers.EnhancerUtilities = EnhancerUtilities;
    }
  }

  console.log('[Enhancer Utilities] v2.0.0 loaded');

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
