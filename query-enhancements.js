/**
 * 03_query-enhancements.js
 * 
 * DOM Helpers - Query Enhancements & Bulk Property Shortcuts
 * Enhanced querySelector/querySelectorAll with bulk property update methods
 * 
 * Consolidates:
 * - 03_dh-global-query.js (query functions)
 * - 01_dh-bulk-property-updaters.js (bulk shortcuts)
 * - 05_dh-index-selection.js (obsolete - now integrated)
 * - 07_dh-bulk-properties-updater-global-query.js (property methods)
 * 
 * Features:
 * - Global querySelector, querySelectorAll, query, queryAll
 * - Elements.textContent({btn1: "X", btn2: "Y"}) - bulk by ID
 * - collection.textContent({0: "A", 1: "B"}) - by index
 * - Auto-enhanced collections and elements
 * 
 * REQUIRES: core-update-engine.js (for CoreUpdateEngine)
 * 
 * @version 2.0.0
 * @license MIT
 */

(function(global) {
  'use strict';

  console.log('[Query Enhancements] v2.0.0 Loading...');

  // ===== DEPENDENCY CHECK =====
  const hasCoreEngine = typeof global.CoreUpdateEngine !== 'undefined' || 
                        typeof global.EnhancedUpdateUtility !== 'undefined';

  if (!hasCoreEngine) {
    console.warn('[Query Enhancements] CoreUpdateEngine not found. Update features will be limited.');
  }

  // Get core engine functions
  const enhanceElement = hasCoreEngine ? 
    (global.CoreUpdateEngine?.enhanceElement || global.EnhancedUpdateUtility?.enhanceElement) : 
    (el => el);
  
  const enhanceCollection = hasCoreEngine ?
    (global.CoreUpdateEngine?.enhanceCollection || global.EnhancedUpdateUtility?.enhanceCollection) :
    (col => col);

  // ===== ENHANCED NODELIST WITH PROPERTY SHORTCUTS =====

  /**
   * Create bulk property updater for collections (index-based)
   * Example: collection.textContent({0: "First", 1: "Second"})
   */
  function createIndexBasedPropertyUpdater(propertyName) {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn(`[Query Enhancements] ${propertyName}() requires an object with indices as keys`);
        return this;
      }

      // Get elements
      let elements = [];
      if (this._originalNodeList) {
        elements = Array.from(this._originalNodeList);
      } else if (this.length !== undefined) {
        elements = Array.from(this);
      }

      Object.entries(updates).forEach(([index, value]) => {
        try {
          const numIndex = parseInt(index, 10);
          if (isNaN(numIndex)) return;

          const element = elements[numIndex];
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            element[propertyName] = value;
          }
        } catch (error) {
          console.warn(`[Query Enhancements] Error updating ${propertyName} at index ${index}:`, error.message);
        }
      });

      return this;
    };
  }

  /**
   * Create bulk style updater for collections
   * Example: collection.style({0: {color: "red"}, 1: {color: "blue"}})
   */
  function createIndexBasedStyleUpdater() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[Query Enhancements] style() requires an object');
        return this;
      }

      let elements = [];
      if (this._originalNodeList) {
        elements = Array.from(this._originalNodeList);
      } else if (this.length !== undefined) {
        elements = Array.from(this);
      }

      Object.entries(updates).forEach(([index, styleObj]) => {
        try {
          const numIndex = parseInt(index, 10);
          if (isNaN(numIndex)) return;

          const element = elements[numIndex];
          if (element && element.nodeType === Node.ELEMENT_NODE && typeof styleObj === 'object') {
            Object.entries(styleObj).forEach(([prop, val]) => {
              if (val !== null && val !== undefined) {
                element.style[prop] = val;
              }
            });
          }
        } catch (error) {
          console.warn(`[Query Enhancements] Error updating style at index ${index}:`, error.message);
        }
      });

      return this;
    };
  }

  /**
   * Create enhanced NodeList with update and property shortcuts
   */
  function enhanceNodeList(nodeList, selector) {
    if (!nodeList) {
      return createEmptyCollection();
    }

    // Don't re-enhance
    if (nodeList._hasGlobalQueryUpdate || nodeList._hasQueryEnhancements) {
      return nodeList;
    }

    // Convert to array and enhance elements
    const elements = Array.from(nodeList).map(el => enhanceElement(el));

    // Create collection object
    const collection = Object.create(Array.prototype);
    
    // Copy elements
    elements.forEach((el, index) => {
      collection[index] = el;
    });

    // Set length
    Object.defineProperty(collection, 'length', {
      value: elements.length,
      writable: false,
      enumerable: false
    });

    // Store original NodeList
    Object.defineProperty(collection, '_originalNodeList', {
      value: nodeList,
      writable: false,
      enumerable: false
    });

    Object.defineProperty(collection, '_selector', {
      value: selector,
      writable: false,
      enumerable: false
    });

    // Make iterable
    collection[Symbol.iterator] = function*() {
      for (let i = 0; i < elements.length; i++) {
        yield elements[i];
      }
    };

    // Add array methods
    ['forEach', 'map', 'filter', 'find', 'some', 'every', 'reduce'].forEach(method => {
      Object.defineProperty(collection, method, {
        value: Array.prototype[method],
        writable: false,
        enumerable: false
      });
    });

    // Helper methods
    Object.defineProperty(collection, 'first', {
      value: function() {
        return elements[0] || null;
      },
      writable: false,
      enumerable: false
    });

    Object.defineProperty(collection, 'last', {
      value: function() {
        return elements[elements.length - 1] || null;
      },
      writable: false,
      enumerable: false
    });

    Object.defineProperty(collection, 'at', {
      value: function(index) {
        if (index < 0) index = elements.length + index;
        return elements[index] || null;
      },
      writable: false,
      enumerable: false
    });

    // Enhance with core update engine
    enhanceCollection(collection);

    // Add index-based property shortcuts
    const shortcuts = {
      textContent: createIndexBasedPropertyUpdater('textContent'),
      innerHTML: createIndexBasedPropertyUpdater('innerHTML'),
      innerText: createIndexBasedPropertyUpdater('innerText'),
      value: createIndexBasedPropertyUpdater('value'),
      placeholder: createIndexBasedPropertyUpdater('placeholder'),
      title: createIndexBasedPropertyUpdater('title'),
      disabled: createIndexBasedPropertyUpdater('disabled'),
      checked: createIndexBasedPropertyUpdater('checked'),
      src: createIndexBasedPropertyUpdater('src'),
      href: createIndexBasedPropertyUpdater('href'),
      alt: createIndexBasedPropertyUpdater('alt'),
      style: createIndexBasedStyleUpdater()
    };

    Object.entries(shortcuts).forEach(([name, method]) => {
      Object.defineProperty(collection, name, {
        value: method,
        writable: false,
        enumerable: false
      });
    });

    // Mark as enhanced
    Object.defineProperty(collection, '_hasQueryEnhancements', {
      value: true,
      writable: false,
      enumerable: false
    });

    return collection;
  }

  /**
   * Create empty collection with all methods
   */
  function createEmptyCollection() {
    const empty = [];
    empty.update = function() { return this; };
    empty.first = function() { return null; };
    empty.last = function() { return null; };
    empty.at = function() { return null; };
    
    // Add no-op property shortcuts
    ['textContent', 'innerHTML', 'value', 'style'].forEach(prop => {
      empty[prop] = function() { return this; };
    });
    
    return empty;
  }

  // ===== GLOBAL QUERY FUNCTIONS =====

  /**
   * Enhanced querySelector
   */
  function querySelector(selector, context = document) {
    if (typeof selector !== 'string') {
      console.warn('[Query Enhancements] querySelector requires a string selector');
      return null;
    }

    try {
      const element = (context || document).querySelector(selector);
      return element ? enhanceElement(element) : null;
    } catch (error) {
      console.error(`[Query Enhancements] querySelector error: ${error.message}`);
      return null;
    }
  }

  /**
   * Enhanced querySelectorAll
   */
  function querySelectorAll(selector, context = document) {
    if (typeof selector !== 'string') {
      console.warn('[Query Enhancements] querySelectorAll requires a string selector');
      return createEmptyCollection();
    }

    try {
      const nodeList = (context || document).querySelectorAll(selector);
      return enhanceNodeList(nodeList, selector);
    } catch (error) {
      console.error(`[Query Enhancements] querySelectorAll error: ${error.message}`);
      return createEmptyCollection();
    }
  }

  // Aliases
  const query = querySelector;
  const queryAll = querySelectorAll;

  // ===== BULK PROPERTY UPDATERS FOR ELEMENTS HELPER =====

  /**
   * Create bulk property updater for Elements helper (ID-based)
   * Example: Elements.textContent({btn1: "X", btn2: "Y"})
   */
  function createBulkPropertyUpdater(propertyName) {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn(`[Query Enhancements] ${propertyName}() requires an object with element IDs as keys`);
        return this;
      }

      Object.entries(updates).forEach(([elementId, value]) => {
        try {
          const element = this[elementId];
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            element[propertyName] = value;
          }
        } catch (error) {
          console.warn(`[Query Enhancements] Error updating ${propertyName} for '${elementId}':`, error.message);
        }
      });

      return this;
    };
  }

  /**
   * Create bulk style updater for Elements helper
   * Example: Elements.style({btn1: {color: "red"}, btn2: {color: "blue"}})
   */
  function createBulkStyleUpdater() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[Query Enhancements] style() requires an object');
        return this;
      }

      Object.entries(updates).forEach(([elementId, styleObj]) => {
        try {
          const element = this[elementId];
          if (element && element.nodeType === Node.ELEMENT_NODE && typeof styleObj === 'object') {
            Object.entries(styleObj).forEach(([prop, val]) => {
              if (val !== null && val !== undefined) {
                element.style[prop] = val;
              }
            });
          }
        } catch (error) {
          console.warn(`[Query Enhancements] Error updating style for '${elementId}':`, error.message);
        }
      });

      return this;
    };
  }

  /**
   * Enhance Elements helper with bulk property shortcuts
   */
  function enhanceElementsHelper() {
    if (typeof global.Elements === 'undefined') {
      return;
    }

    const shortcuts = {
      textContent: createBulkPropertyUpdater('textContent'),
      innerHTML: createBulkPropertyUpdater('innerHTML'),
      innerText: createBulkPropertyUpdater('innerText'),
      value: createBulkPropertyUpdater('value'),
      placeholder: createBulkPropertyUpdater('placeholder'),
      title: createBulkPropertyUpdater('title'),
      disabled: createBulkPropertyUpdater('disabled'),
      checked: createBulkPropertyUpdater('checked'),
      src: createBulkPropertyUpdater('src'),
      href: createBulkPropertyUpdater('href'),
      alt: createBulkPropertyUpdater('alt'),
      style: createBulkStyleUpdater()
    };

    Object.entries(shortcuts).forEach(([name, method]) => {
      global.Elements[name] = method;
    });

    console.log('[Query Enhancements] ✓ Elements helper enhanced with bulk property shortcuts');
  }

  // ===== REGISTER GLOBALLY =====

  global.querySelector = querySelector;
  global.querySelectorAll = querySelectorAll;
  global.query = query;
  global.queryAll = queryAll;

  console.log('[Query Enhancements] ✓ Global query functions registered');

  // Enhance Elements helper
  if (typeof global.Elements !== 'undefined') {
    enhanceElementsHelper();
  } else {
    // Try again after DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', enhanceElementsHelper);
    } else {
      setTimeout(enhanceElementsHelper, 100);
    }
  }

  // ===== EXPORT MODULE =====

  const QueryEnhancements = {
    version: '2.0.0',
    querySelector,
    querySelectorAll,
    query,
    queryAll,
    enhanceElement,
    enhanceNodeList,
    enhanceElementsHelper,
    createBulkPropertyUpdater,
    createIndexBasedPropertyUpdater
  };

  // Add to DOMHelpers
  if (typeof global.DOMHelpers !== 'undefined') {
    global.DOMHelpers.QueryEnhancements = QueryEnhancements;
    global.DOMHelpers.querySelector = querySelector;
    global.DOMHelpers.querySelectorAll = querySelectorAll;
    global.DOMHelpers.query = query;
    global.DOMHelpers.queryAll = queryAll;
  }

  // Module exports
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = QueryEnhancements;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return QueryEnhancements;
    });
  } else {
    global.QueryEnhancements = QueryEnhancements;
  }

  console.log('[Query Enhancements] ✓ Loaded successfully');
  console.log('[Query Enhancements] Usage: querySelectorAll(".btn").update({...}), Elements.textContent({...})');

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);