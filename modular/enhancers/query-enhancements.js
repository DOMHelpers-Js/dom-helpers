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
 * - Scoped queries: queryWithin, queryAllWithin
 * - Elements.textContent({btn1: "X", btn2: "Y"}) - bulk by ID
 * - collection.textContent({0: "A", 1: "B"}) - by index
 * - Full collection methods (addClass, removeClass, on, off, etc.)
 * - Complete property shortcuts (dataset, attrs, classes, prop)
 * - Auto-enhanced collections and elements
 * 
 * REQUIRES: core-update-engine.js (for CoreUpdateEngine)
 * 
 * @version 2.0.0 - FULL PARITY
 * @license MIT
 */

(function(global) {
  'use strict';

  console.log('[Query Enhancements] v2.0.0 Loading (Full Parity)...');

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

  // ===== INDEX-BASED PROPERTY UPDATERS FOR COLLECTIONS =====

  /**
   * Create bulk property updater for collections (index-based)
   * Example: collection.textContent({0: "First", 1: "Second"})
   */
  function createIndexBasedPropertyUpdater(propertyName, transformer = null) {
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
            const finalValue = transformer ? transformer(value) : value;
            element[propertyName] = finalValue;
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
   * Create bulk dataset updater for collections
   * Example: collection.dataset({0: {id: "1"}, 1: {id: "2"}})
   */
  function createIndexBasedDatasetUpdater() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[Query Enhancements] dataset() requires an object with indices as keys');
        return this;
      }

      let elements = [];
      if (this._originalNodeList) {
        elements = Array.from(this._originalNodeList);
      } else if (this.length !== undefined) {
        elements = Array.from(this);
      }

      Object.entries(updates).forEach(([index, dataObj]) => {
        try {
          const numIndex = parseInt(index, 10);
          if (isNaN(numIndex)) return;

          const element = elements[numIndex];
          
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (typeof dataObj !== 'object' || dataObj === null) {
              console.warn(`[Query Enhancements] dataset() requires data object for index ${index}`);
              return;
            }

            if (element.update && typeof element.update === 'function') {
              element.update({ dataset: dataObj });
            } else {
              Object.entries(dataObj).forEach(([key, val]) => {
                element.dataset[key] = val;
              });
            }
          }
        } catch (error) {
          console.warn(`[Query Enhancements] Error updating dataset at index ${index}:`, error.message);
        }
      });

      return this;
    };
  }

  /**
   * Create bulk attributes updater for collections
   * Example: collection.attrs({0: {alt: "Image 1"}, 1: {alt: "Image 2"}})
   */
  function createIndexBasedAttributesUpdater() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[Query Enhancements] attrs() requires an object with indices as keys');
        return this;
      }

      let elements = [];
      if (this._originalNodeList) {
        elements = Array.from(this._originalNodeList);
      } else if (this.length !== undefined) {
        elements = Array.from(this);
      }

      Object.entries(updates).forEach(([index, attrsObj]) => {
        try {
          const numIndex = parseInt(index, 10);
          if (isNaN(numIndex)) return;

          const element = elements[numIndex];
          
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (typeof attrsObj !== 'object' || attrsObj === null) {
              console.warn(`[Query Enhancements] attrs() requires attributes object for index ${index}`);
              return;
            }

            Object.entries(attrsObj).forEach(([attrName, attrValue]) => {
              if (attrValue === null || attrValue === false) {
                element.removeAttribute(attrName);
              } else {
                element.setAttribute(attrName, String(attrValue));
              }
            });
          }
        } catch (error) {
          console.warn(`[Query Enhancements] Error updating attrs at index ${index}:`, error.message);
        }
      });

      return this;
    };
  }

  /**
   * Create bulk classList updater for collections
   * Example: collection.classes({0: "btn primary", 1: {add: ["active"]}})
   */
  function createIndexBasedClassListUpdater() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[Query Enhancements] classes() requires an object with indices as keys');
        return this;
      }

      let elements = [];
      if (this._originalNodeList) {
        elements = Array.from(this._originalNodeList);
      } else if (this.length !== undefined) {
        elements = Array.from(this);
      }

      Object.entries(updates).forEach(([index, classConfig]) => {
        try {
          const numIndex = parseInt(index, 10);
          if (isNaN(numIndex)) return;

          const element = elements[numIndex];
          
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            // Handle simple string replacement
            if (typeof classConfig === 'string') {
              element.className = classConfig;
              return;
            }

            // Handle classList operations object
            if (typeof classConfig === 'object' && classConfig !== null) {
              if (element.update && typeof element.update === 'function') {
                element.update({ classList: classConfig });
              } else {
                Object.entries(classConfig).forEach(([method, classes]) => {
                  try {
                    const classList = Array.isArray(classes) ? classes : [classes];
                    
                    switch (method) {
                      case 'add':
                        element.classList.add(...classList);
                        break;
                      case 'remove':
                        element.classList.remove(...classList);
                        break;
                      case 'toggle':
                        classList.forEach(cls => element.classList.toggle(cls));
                        break;
                      case 'replace':
                        if (classList.length === 2) {
                          element.classList.replace(classList[0], classList[1]);
                        }
                        break;
                    }
                  } catch (error) {
                    console.warn(`[Query Enhancements] Error in classList.${method}:`, error.message);
                  }
                });
              }
            }
          }
        } catch (error) {
          console.warn(`[Query Enhancements] Error updating classes at index ${index}:`, error.message);
        }
      });

      return this;
    };
  }

  /**
   * Create generic property updater for collections (supports nested paths)
   * Example: collection.prop("style.color", {0: "red", 1: "blue"})
   */
  function createIndexBasedGenericPropertyUpdater() {
    return function(propertyPath, updates = {}) {
      if (typeof propertyPath !== 'string') {
        console.warn('[Query Enhancements] prop() requires a property name as first argument');
        return this;
      }

      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[Query Enhancements] prop() requires an object with indices as keys');
        return this;
      }

      let elements = [];
      if (this._originalNodeList) {
        elements = Array.from(this._originalNodeList);
      } else if (this.length !== undefined) {
        elements = Array.from(this);
      }

      // Check if property path is nested (e.g., 'style.color')
      const isNested = propertyPath.includes('.');
      const pathParts = isNested ? propertyPath.split('.') : null;

      Object.entries(updates).forEach(([index, value]) => {
        try {
          const numIndex = parseInt(index, 10);
          if (isNaN(numIndex)) return;

          const element = elements[numIndex];
          
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (isNested) {
              // Handle nested property (e.g., style.color)
              let obj = element;
              for (let i = 0; i < pathParts.length - 1; i++) {
                obj = obj[pathParts[i]];
                if (!obj) {
                  console.warn(`[Query Enhancements] Invalid property path '${propertyPath}' at index ${index}`);
                  return;
                }
              }
              obj[pathParts[pathParts.length - 1]] = value;
            } else {
              // Direct property assignment
              if (propertyPath in element) {
                element[propertyPath] = value;
              } else {
                console.warn(`[Query Enhancements] Property '${propertyPath}' not found on element at index ${index}`);
              }
            }
          }
        } catch (error) {
          console.warn(`[Query Enhancements] Error updating prop '${propertyPath}' at index ${index}:`, error.message);
        }
      });

      return this;
    };
  }

  // ===== ID-BASED PROPERTY UPDATERS FOR ELEMENTS HELPER =====

  /**
   * Create bulk property updater for Elements helper (ID-based)
   * Example: Elements.textContent({btn1: "X", btn2: "Y"})
   */
  function createBulkPropertyUpdater(propertyName, transformer = null) {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn(`[Query Enhancements] ${propertyName}() requires an object with element IDs as keys`);
        return this;
      }

      Object.entries(updates).forEach(([elementId, value]) => {
        try {
          const element = this[elementId];
          
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            const finalValue = transformer ? transformer(value) : value;
            
            if (element.update && typeof element.update === 'function') {
              element.update({ [propertyName]: finalValue });
            } else {
              element[propertyName] = finalValue;
            }
          } else {
            console.warn(`[Query Enhancements] Element '${elementId}' not found for ${propertyName} update`);
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
        console.warn('[Query Enhancements] style() requires an object with element IDs as keys');
        return this;
      }

      Object.entries(updates).forEach(([elementId, styleObj]) => {
        try {
          const element = this[elementId];
          
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (typeof styleObj !== 'object' || styleObj === null) {
              console.warn(`[Query Enhancements] style() requires style object for '${elementId}'`);
              return;
            }

            if (element.update && typeof element.update === 'function') {
              element.update({ style: styleObj });
            } else {
              Object.entries(styleObj).forEach(([prop, val]) => {
                if (val !== null && val !== undefined) {
                  element.style[prop] = val;
                }
              });
            }
          } else {
            console.warn(`[Query Enhancements] Element '${elementId}' not found for style update`);
          }
        } catch (error) {
          console.warn(`[Query Enhancements] Error updating style for '${elementId}':`, error.message);
        }
      });

      return this;
    };
  }

  /**
   * Create bulk dataset updater for Elements helper
   * Example: Elements.dataset({div1: {id: "1"}, div2: {id: "2"}})
   */
  function createBulkDatasetUpdater() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[Query Enhancements] dataset() requires an object with element IDs as keys');
        return this;
      }

      Object.entries(updates).forEach(([elementId, dataObj]) => {
        try {
          const element = this[elementId];
          
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (typeof dataObj !== 'object' || dataObj === null) {
              console.warn(`[Query Enhancements] dataset() requires data object for '${elementId}'`);
              return;
            }

            if (element.update && typeof element.update === 'function') {
              element.update({ dataset: dataObj });
            } else {
              Object.entries(dataObj).forEach(([key, val]) => {
                element.dataset[key] = val;
              });
            }
          } else {
            console.warn(`[Query Enhancements] Element '${elementId}' not found for dataset update`);
          }
        } catch (error) {
          console.warn(`[Query Enhancements] Error updating dataset for '${elementId}':`, error.message);
        }
      });

      return this;
    };
  }

  /**
   * Create bulk attributes updater for Elements helper
   * Example: Elements.attrs({img1: {alt: "Image 1"}, img2: {alt: "Image 2"}})
   */
  function createBulkAttributesUpdater() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[Query Enhancements] attrs() requires an object with element IDs as keys');
        return this;
      }

      Object.entries(updates).forEach(([elementId, attrsObj]) => {
        try {
          const element = this[elementId];
          
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (typeof attrsObj !== 'object' || attrsObj === null) {
              console.warn(`[Query Enhancements] attrs() requires attributes object for '${elementId}'`);
              return;
            }

            Object.entries(attrsObj).forEach(([attrName, attrValue]) => {
              if (attrValue === null || attrValue === false) {
                element.removeAttribute(attrName);
              } else {
                element.setAttribute(attrName, String(attrValue));
              }
            });
          } else {
            console.warn(`[Query Enhancements] Element '${elementId}' not found for attrs update`);
          }
        } catch (error) {
          console.warn(`[Query Enhancements] Error updating attrs for '${elementId}':`, error.message);
        }
      });

      return this;
    };
  }

  /**
   * Create bulk classList updater for Elements helper
   * Example: Elements.classes({div1: "container", div2: {add: ["active"]}})
   */
  function createBulkClassListUpdater() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[Query Enhancements] classes() requires an object with element IDs as keys');
        return this;
      }

      Object.entries(updates).forEach(([elementId, classConfig]) => {
        try {
          const element = this[elementId];
          
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            // Handle simple string replacement
            if (typeof classConfig === 'string') {
              element.className = classConfig;
              return;
            }

            // Handle classList operations object
            if (typeof classConfig === 'object' && classConfig !== null) {
              if (element.update && typeof element.update === 'function') {
                element.update({ classList: classConfig });
              } else {
                Object.entries(classConfig).forEach(([method, classes]) => {
                  try {
                    const classList = Array.isArray(classes) ? classes : [classes];
                    
                    switch (method) {
                      case 'add':
                        element.classList.add(...classList);
                        break;
                      case 'remove':
                        element.classList.remove(...classList);
                        break;
                      case 'toggle':
                        classList.forEach(cls => element.classList.toggle(cls));
                        break;
                      case 'replace':
                        if (classList.length === 2) {
                          element.classList.replace(classList[0], classList[1]);
                        }
                        break;
                    }
                  } catch (error) {
                    console.warn(`[Query Enhancements] Error in classList.${method}:`, error.message);
                  }
                });
              }
            }
          } else {
            console.warn(`[Query Enhancements] Element '${elementId}' not found for classes update`);
          }
        } catch (error) {
          console.warn(`[Query Enhancements] Error updating classes for '${elementId}':`, error.message);
        }
      });

      return this;
    };
  }

  /**
   * Create bulk generic property updater for Elements helper (supports nested paths)
   * Example: Elements.prop("style.color", {div1: "red", div2: "blue"})
   */
  function createBulkGenericPropertyUpdater() {
    return function(propertyPath, updates = {}) {
      if (typeof propertyPath !== 'string') {
        console.warn('[Query Enhancements] prop() requires a property name as first argument');
        return this;
      }

      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[Query Enhancements] prop() requires an object with element IDs as keys');
        return this;
      }

      // Check if property path is nested (e.g., 'style.color')
      const isNested = propertyPath.includes('.');
      const pathParts = isNested ? propertyPath.split('.') : null;

      Object.entries(updates).forEach(([elementId, value]) => {
        try {
          const element = this[elementId];
          
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (isNested) {
              // Handle nested property (e.g., style.color)
              let obj = element;
              for (let i = 0; i < pathParts.length - 1; i++) {
                obj = obj[pathParts[i]];
                if (!obj) {
                  console.warn(`[Query Enhancements] Invalid property path '${propertyPath}' for '${elementId}'`);
                  return;
                }
              }
              obj[pathParts[pathParts.length - 1]] = value;
            } else {
              // Direct property assignment
              if (propertyPath in element) {
                element[propertyPath] = value;
              } else {
                console.warn(`[Query Enhancements] Property '${propertyPath}' not found on element '${elementId}'`);
              }
            }
          } else {
            console.warn(`[Query Enhancements] Element '${elementId}' not found for prop update`);
          }
        } catch (error) {
          console.warn(`[Query Enhancements] Error updating prop '${propertyPath}' for '${elementId}':`, error.message);
        }
      });

      return this;
    };
  }

  // ===== ENHANCED NODELIST WITH ALL FEATURES =====

  /**
   * Create enhanced NodeList with update, property shortcuts, and collection methods
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

    // ===== HELPER METHODS =====

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

    Object.defineProperty(collection, 'isEmpty', {
      value: function() {
        return elements.length === 0;
      },
      writable: false,
      enumerable: false
    });

    // ===== DOM MANIPULATION HELPERS =====

    Object.defineProperty(collection, 'addClass', {
      value: function(className) {
        this.forEach(el => el.classList.add(className));
        return this;
      },
      writable: false,
      enumerable: false
    });

    Object.defineProperty(collection, 'removeClass', {
      value: function(className) {
        this.forEach(el => el.classList.remove(className));
        return this;
      },
      writable: false,
      enumerable: false
    });

    Object.defineProperty(collection, 'toggleClass', {
      value: function(className) {
        this.forEach(el => el.classList.toggle(className));
        return this;
      },
      writable: false,
      enumerable: false
    });

    Object.defineProperty(collection, 'setProperty', {
      value: function(prop, value) {
        this.forEach(el => el[prop] = value);
        return this;
      },
      writable: false,
      enumerable: false
    });

    Object.defineProperty(collection, 'setAttribute', {
      value: function(attr, value) {
        this.forEach(el => el.setAttribute(attr, value));
        return this;
      },
      writable: false,
      enumerable: false
    });

    Object.defineProperty(collection, 'setStyle', {
      value: function(styles) {
        this.forEach(el => {
          Object.assign(el.style, styles);
        });
        return this;
      },
      writable: false,
      enumerable: false
    });

    Object.defineProperty(collection, 'on', {
      value: function(event, handler) {
        this.forEach(el => el.addEventListener(event, handler));
        return this;
      },
      writable: false,
      enumerable: false
    });

    Object.defineProperty(collection, 'off', {
      value: function(event, handler) {
        this.forEach(el => el.removeEventListener(event, handler));
        return this;
      },
      writable: false,
      enumerable: false
    });

    // Enhance with core update engine
    enhanceCollection(collection);

    // ===== ADD INDEX-BASED PROPERTY SHORTCUTS =====

    const shortcuts = {
      // Common properties
      textContent: createIndexBasedPropertyUpdater('textContent'),
      innerHTML: createIndexBasedPropertyUpdater('innerHTML'),
      innerText: createIndexBasedPropertyUpdater('innerText'),
      value: createIndexBasedPropertyUpdater('value'),
      placeholder: createIndexBasedPropertyUpdater('placeholder'),
      title: createIndexBasedPropertyUpdater('title'),
      disabled: createIndexBasedPropertyUpdater('disabled'),
      checked: createIndexBasedPropertyUpdater('checked'),
      readonly: createIndexBasedPropertyUpdater('readOnly'), // Note: DOM uses readOnly
      hidden: createIndexBasedPropertyUpdater('hidden'),
      selected: createIndexBasedPropertyUpdater('selected'),
      
      // Media properties
      src: createIndexBasedPropertyUpdater('src'),
      href: createIndexBasedPropertyUpdater('href'),
      alt: createIndexBasedPropertyUpdater('alt'),
      
      // Complex updaters
      style: createIndexBasedStyleUpdater(),
      dataset: createIndexBasedDatasetUpdater(),
      attrs: createIndexBasedAttributesUpdater(),
      classes: createIndexBasedClassListUpdater(),
      prop: createIndexBasedGenericPropertyUpdater()
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
    empty.isEmpty = function() { return true; };
    
    // Add no-op DOM methods
    ['addClass', 'removeClass', 'toggleClass', 'setProperty', 'setAttribute', 'setStyle', 'on', 'off'].forEach(method => {
      empty[method] = function() { return this; };
    });
    
    // Add no-op property shortcuts
    ['textContent', 'innerHTML', 'value', 'style', 'dataset', 'attrs', 'classes', 'readonly', 'hidden', 'selected'].forEach(prop => {
      empty[prop] = function() { return this; };
    });
    
    empty.prop = function() { return this; };
    
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

  /**
   * Query within a container (scoped query)
   */
  function queryWithin(container, selector) {
    const containerEl = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    if (!containerEl) {
      console.warn('[Query Enhancements] Container not found');
      return null;
    }
    
    return querySelector(selector, containerEl);
  }

  /**
   * Query all within a container (scoped query)
   */
  function queryAllWithin(container, selector) {
    const containerEl = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    if (!containerEl) {
      console.warn('[Query Enhancements] Container not found');
      return createEmptyCollection();
    }
    
    return querySelectorAll(selector, containerEl);
  }

  // Aliases
  const query = querySelector;
  const queryAll = querySelectorAll;

  // ===== ENHANCE ELEMENTS HELPER WITH BULK PROPERTY SHORTCUTS =====

  /**
   * Enhance Elements helper with bulk property shortcuts
   */
  function enhanceElementsHelper() {
    if (typeof global.Elements === 'undefined') {
      return;
    }

    const shortcuts = {
      // Common properties
      textContent: createBulkPropertyUpdater('textContent'),
      innerHTML: createBulkPropertyUpdater('innerHTML'),
      innerText: createBulkPropertyUpdater('innerText'),
      value: createBulkPropertyUpdater('value'),
      placeholder: createBulkPropertyUpdater('placeholder'),
      title: createBulkPropertyUpdater('title'),
      disabled: createBulkPropertyUpdater('disabled'),
      checked: createBulkPropertyUpdater('checked'),
      readonly: createBulkPropertyUpdater('readOnly'), // Note: DOM uses readOnly
      hidden: createBulkPropertyUpdater('hidden'),
      selected: createBulkPropertyUpdater('selected'),
      
      // Media properties
      src: createBulkPropertyUpdater('src'),
      href: createBulkPropertyUpdater('href'),
      alt: createBulkPropertyUpdater('alt'),
      
      // Complex updaters
      style: createBulkStyleUpdater(),
      dataset: createBulkDatasetUpdater(),
      attrs: createBulkAttributesUpdater(),
      classes: createBulkClassListUpdater(),
      prop: createBulkGenericPropertyUpdater()
    };

    Object.entries(shortcuts).forEach(([name, method]) => {
      global.Elements[name] = method;
    });

    console.log('[Query Enhancements] ✓ Elements helper enhanced with bulk property shortcuts (full set)');
  }

  // ===== REGISTER GLOBALLY =====

  global.querySelector = querySelector;
  global.querySelectorAll = querySelectorAll;
  global.query = query;
  global.queryAll = queryAll;
  global.queryWithin = queryWithin;
  global.queryAllWithin = queryAllWithin;

  console.log('[Query Enhancements] ✓ Global query functions registered (including scoped queries)');

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
    version: '2.0.0-full-parity',
    querySelector,
    querySelectorAll,
    query,
    queryAll,
    queryWithin,
    queryAllWithin,
    enhanceElement,
    enhanceNodeList,
    enhanceElementsHelper,
    createBulkPropertyUpdater,
    createIndexBasedPropertyUpdater,
    createBulkStyleUpdater,
    createIndexBasedStyleUpdater,
    createBulkDatasetUpdater,
    createIndexBasedDatasetUpdater,
    createBulkAttributesUpdater,
    createIndexBasedAttributesUpdater,
    createBulkClassListUpdater,
    createIndexBasedClassListUpdater,
    createBulkGenericPropertyUpdater,
    createIndexBasedGenericPropertyUpdater
  };

  // Add to DOMHelpers
  if (typeof global.DOMHelpers !== 'undefined') {
    global.DOMHelpers.QueryEnhancements = QueryEnhancements;
    global.DOMHelpers.querySelector = querySelector;
    global.DOMHelpers.querySelectorAll = querySelectorAll;
    global.DOMHelpers.query = query;
    global.DOMHelpers.queryAll = queryAll;
    global.DOMHelpers.queryWithin = queryWithin;
    global.DOMHelpers.queryAllWithin = queryAllWithin;
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

  console.log('[Query Enhancements] ✓ Loaded successfully - FULL FEATURE PARITY');
  console.log('[Query Enhancements] ✓ Collection methods: isEmpty, addClass, removeClass, toggleClass, setProperty, setAttribute, setStyle, on, off');
  console.log('[Query Enhancements] ✓ Scoped queries: queryWithin, queryAllWithin');
  console.log('[Query Enhancements] ✓ Full property shortcuts: textContent, value, style, dataset, attrs, classes, prop, readonly, hidden, selected');
  console.log('[Query Enhancements] Usage: querySelectorAll(".btn").addClass("active"), Elements.dataset({...}), collection.prop("style.color", {...})');

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);