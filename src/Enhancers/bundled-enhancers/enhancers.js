/**
 * 01_dh-bulk-property-updaters
 * 
 * DOM Helpers - Bulk Property Updates Extension
 * Adds convenient shorthand methods for bulk element updates
 * 
 * @version 1.0.0
 * @license MIT
 */

(function(global) {
  'use strict';

  // ===== BULK PROPERTY UPDATERS =====
  
  /**
   * Create a bulk property updater function
   * @param {string} propertyName - The property to update (e.g., 'textContent', 'value')
   * @param {Function} transformer - Optional function to transform the value before applying
   * @returns {Function} - Bulk updater function
   */
  function createBulkPropertyUpdater(propertyName, transformer = null) {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn(`[DOM Helpers] ${propertyName}() requires an object with element IDs as keys`);
        return this;
      }

      Object.entries(updates).forEach(([elementId, value]) => {
        try {
          const element = this[elementId];
          
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            const finalValue = transformer ? transformer(value) : value;
            
            if (element.update && typeof element.update === 'function') {
              // Use the element's update method
              element.update({ [propertyName]: finalValue });
            } else {
              // Direct property assignment fallback
              element[propertyName] = finalValue;
            }
          } else {
            console.warn(`[DOM Helpers] Element '${elementId}' not found for ${propertyName} update`);
          }
        } catch (error) {
          console.warn(`[DOM Helpers] Error updating ${propertyName} for '${elementId}': ${error.message}`);
        }
      });

      return this; // Return for chaining
    };
  }

  /**
   * Create a bulk style updater
   */
  function createBulkStyleUpdater() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[DOM Helpers] style() requires an object with element IDs as keys');
        return this;
      }

      Object.entries(updates).forEach(([elementId, styleObj]) => {
        try {
          const element = this[elementId];
          
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (typeof styleObj !== 'object' || styleObj === null) {
              console.warn(`[DOM Helpers] style() requires style object for '${elementId}'`);
              return;
            }

            if (element.update && typeof element.update === 'function') {
              element.update({ style: styleObj });
            } else {
              // Fallback: direct style assignment
              Object.entries(styleObj).forEach(([prop, val]) => {
                if (val !== null && val !== undefined) {
                  element.style[prop] = val;
                }
              });
            }
          } else {
            console.warn(`[DOM Helpers] Element '${elementId}' not found for style update`);
          }
        } catch (error) {
          console.warn(`[DOM Helpers] Error updating style for '${elementId}': ${error.message}`);
        }
      });

      return this;
    };
  }

  /**
   * Create a bulk dataset updater
   */
  function createBulkDatasetUpdater() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[DOM Helpers] dataset() requires an object with element IDs as keys');
        return this;
      }

      Object.entries(updates).forEach(([elementId, dataObj]) => {
        try {
          const element = this[elementId];
          
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (typeof dataObj !== 'object' || dataObj === null) {
              console.warn(`[DOM Helpers] dataset() requires data object for '${elementId}'`);
              return;
            }

            if (element.update && typeof element.update === 'function') {
              element.update({ dataset: dataObj });
            } else {
              // Fallback: direct dataset assignment
              Object.entries(dataObj).forEach(([key, val]) => {
                element.dataset[key] = val;
              });
            }
          } else {
            console.warn(`[DOM Helpers] Element '${elementId}' not found for dataset update`);
          }
        } catch (error) {
          console.warn(`[DOM Helpers] Error updating dataset for '${elementId}': ${error.message}`);
        }
      });

      return this;
    };
  }

  /**
   * Create a bulk attributes updater
   */
  function createBulkAttributesUpdater() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[DOM Helpers] attrs() requires an object with element IDs as keys');
        return this;
      }

      Object.entries(updates).forEach(([elementId, attrsObj]) => {
        try {
          const element = this[elementId];
          
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (typeof attrsObj !== 'object' || attrsObj === null) {
              console.warn(`[DOM Helpers] attrs() requires attributes object for '${elementId}'`);
              return;
            }

            Object.entries(attrsObj).forEach(([attrName, attrValue]) => {
              // Handle attribute removal
              if (attrValue === null || attrValue === false) {
                element.removeAttribute(attrName);
              } else {
                element.setAttribute(attrName, String(attrValue));
              }
            });
          } else {
            console.warn(`[DOM Helpers] Element '${elementId}' not found for attrs update`);
          }
        } catch (error) {
          console.warn(`[DOM Helpers] Error updating attrs for '${elementId}': ${error.message}`);
        }
      });

      return this;
    };
  }

  /**
   * Create a bulk classList updater
   */
  function createBulkClassListUpdater() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[DOM Helpers] classes() requires an object with element IDs as keys');
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
                // Fallback: direct classList manipulation
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
                    console.warn(`[DOM Helpers] Error in classList.${method}: ${error.message}`);
                  }
                });
              }
            }
          } else {
            console.warn(`[DOM Helpers] Element '${elementId}' not found for classes update`);
          }
        } catch (error) {
          console.warn(`[DOM Helpers] Error updating classes for '${elementId}': ${error.message}`);
        }
      });

      return this;
    };
  }

  /**
   * Create a bulk generic property updater with support for nested properties
   */
  function createBulkGenericPropertyUpdater() {
    return function(propertyPath, updates = {}) {
      if (typeof propertyPath !== 'string') {
        console.warn('[DOM Helpers] prop() requires a property name as first argument');
        return this;
      }

      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[DOM Helpers] prop() requires an object with element IDs as keys');
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
                  console.warn(`[DOM Helpers] Invalid property path '${propertyPath}' for '${elementId}'`);
                  return;
                }
              }
              obj[pathParts[pathParts.length - 1]] = value;
            } else {
              // Direct property assignment
              if (propertyPath in element) {
                element[propertyPath] = value;
              } else {
                console.warn(`[DOM Helpers] Property '${propertyPath}' not found on element '${elementId}'`);
              }
            }
          } else {
            console.warn(`[DOM Helpers] Element '${elementId}' not found for prop update`);
          }
        } catch (error) {
          console.warn(`[DOM Helpers] Error updating prop '${propertyPath}' for '${elementId}': ${error.message}`);
        }
      });

      return this;
    };
  }

  /**
   * Enhance Elements helper with bulk property updaters
   */
  function enhanceElementsHelper(Elements) {
    if (!Elements) {
      console.warn('[DOM Helpers] Elements helper not found');
      return;
    }

    // Common simple properties
    Elements.textContent = createBulkPropertyUpdater('textContent');
    Elements.innerHTML = createBulkPropertyUpdater('innerHTML');
    Elements.innerText = createBulkPropertyUpdater('innerText');
    Elements.value = createBulkPropertyUpdater('value');
    Elements.placeholder = createBulkPropertyUpdater('placeholder');
    Elements.title = createBulkPropertyUpdater('title');
    Elements.disabled = createBulkPropertyUpdater('disabled');
    Elements.checked = createBulkPropertyUpdater('checked');
    Elements.readonly = createBulkPropertyUpdater('readOnly'); // Note: readOnly not readonly
    Elements.hidden = createBulkPropertyUpdater('hidden');
    Elements.selected = createBulkPropertyUpdater('selected');
    
    // Media properties
    Elements.src = createBulkPropertyUpdater('src');
    Elements.href = createBulkPropertyUpdater('href');
    Elements.alt = createBulkPropertyUpdater('alt');
    
    // Complex properties
    Elements.style = createBulkStyleUpdater();
    Elements.dataset = createBulkDatasetUpdater();
    Elements.attrs = createBulkAttributesUpdater();
    Elements.classes = createBulkClassListUpdater();
    
    // Generic property updater
    Elements.prop = createBulkGenericPropertyUpdater();

    return Elements;
  }

  /**
   * Enhance Collections helper with bulk property updaters (index-based)
   */
  function enhanceCollectionInstance(collectionInstance) {
    if (!collectionInstance || typeof collectionInstance !== 'object') {
      return collectionInstance;
    }

    // Store reference to collection for use in updaters
    const getElementByIndex = (index) => {
      if (collectionInstance._originalCollection) {
        return collectionInstance._originalCollection[index];
      } else if (collectionInstance._originalNodeList) {
        return collectionInstance._originalNodeList[index];
      } else if (typeof collectionInstance[index] !== 'undefined') {
        return collectionInstance[index];
      }
      return null;
    };

    // Create index-based updaters
    const createIndexBasedUpdater = (propertyName, transformer = null) => {
      return function(updates = {}) {
        if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
          console.warn(`[DOM Helpers] ${propertyName}() requires an object with numeric indices as keys`);
          return this;
        }

        Object.entries(updates).forEach(([index, value]) => {
          try {
            const numIndex = parseInt(index);
            if (isNaN(numIndex)) return;

            const element = getElementByIndex(numIndex);
            
            if (element && element.nodeType === Node.ELEMENT_NODE) {
              const finalValue = transformer ? transformer(value) : value;
              
              if (element.update && typeof element.update === 'function') {
                element.update({ [propertyName]: finalValue });
              } else {
                element[propertyName] = finalValue;
              }
            }
          } catch (error) {
            console.warn(`[DOM Helpers] Error updating ${propertyName} at index ${index}: ${error.message}`);
          }
        });

        return this;
      };
    };

    const createIndexBasedStyleUpdater = () => {
      return function(updates = {}) {
        Object.entries(updates).forEach(([index, styleObj]) => {
          try {
            const numIndex = parseInt(index);
            if (isNaN(numIndex)) return;

            const element = getElementByIndex(numIndex);
            
            if (element && element.nodeType === Node.ELEMENT_NODE && typeof styleObj === 'object') {
              if (element.update && typeof element.update === 'function') {
                element.update({ style: styleObj });
              } else {
                Object.entries(styleObj).forEach(([prop, val]) => {
                  if (val !== null && val !== undefined) {
                    element.style[prop] = val;
                  }
                });
              }
            }
          } catch (error) {
            console.warn(`[DOM Helpers] Error updating style at index ${index}: ${error.message}`);
          }
        });
        return this;
      };
    };

    const createIndexBasedDatasetUpdater = () => {
      return function(updates = {}) {
        Object.entries(updates).forEach(([index, dataObj]) => {
          try {
            const numIndex = parseInt(index);
            if (isNaN(numIndex)) return;

            const element = getElementByIndex(numIndex);
            
            if (element && element.nodeType === Node.ELEMENT_NODE && typeof dataObj === 'object') {
              if (element.update && typeof element.update === 'function') {
                element.update({ dataset: dataObj });
              } else {
                Object.entries(dataObj).forEach(([key, val]) => {
                  element.dataset[key] = val;
                });
              }
            }
          } catch (error) {
            console.warn(`[DOM Helpers] Error updating dataset at index ${index}: ${error.message}`);
          }
        });
        return this;
      };
    };

    const createIndexBasedClassesUpdater = () => {
      return function(updates = {}) {
        Object.entries(updates).forEach(([index, classConfig]) => {
          try {
            const numIndex = parseInt(index);
            if (isNaN(numIndex)) return;

            const element = getElementByIndex(numIndex);
            
            if (element && element.nodeType === Node.ELEMENT_NODE) {
              if (typeof classConfig === 'string') {
                element.className = classConfig;
                return;
              }

              if (typeof classConfig === 'object' && classConfig !== null) {
                if (element.update && typeof element.update === 'function') {
                  element.update({ classList: classConfig });
                } else {
                  Object.entries(classConfig).forEach(([method, classes]) => {
                    const classList = Array.isArray(classes) ? classes : [classes];
                    switch (method) {
                      case 'add': element.classList.add(...classList); break;
                      case 'remove': element.classList.remove(...classList); break;
                      case 'toggle': classList.forEach(cls => element.classList.toggle(cls)); break;
                      case 'replace': 
                        if (classList.length === 2) element.classList.replace(classList[0], classList[1]); 
                        break;
                    }
                  });
                }
              }
            }
          } catch (error) {
            console.warn(`[DOM Helpers] Error updating classes at index ${index}: ${error.message}`);
          }
        });
        return this;
      };
    };

    // Add methods to collection instance
    try {
      Object.defineProperty(collectionInstance, 'textContent', {
        value: createIndexBasedUpdater('textContent'),
        writable: false,
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(collectionInstance, 'innerHTML', {
        value: createIndexBasedUpdater('innerHTML'),
        writable: false,
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(collectionInstance, 'value', {
        value: createIndexBasedUpdater('value'),
        writable: false,
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(collectionInstance, 'style', {
        value: createIndexBasedStyleUpdater(),
        writable: false,
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(collectionInstance, 'dataset', {
        value: createIndexBasedDatasetUpdater(),
        writable: false,
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(collectionInstance, 'classes', {
        value: createIndexBasedClassesUpdater(),
        writable: false,
        enumerable: false,
        configurable: true
      });
    } catch (error) {
      // Fallback: direct assignment if defineProperty fails
      collectionInstance.textContent = createIndexBasedUpdater('textContent');
      collectionInstance.innerHTML = createIndexBasedUpdater('innerHTML');
      collectionInstance.value = createIndexBasedUpdater('value');
      collectionInstance.style = createIndexBasedStyleUpdater();
      collectionInstance.dataset = createIndexBasedDatasetUpdater();
      collectionInstance.classes = createIndexBasedClassesUpdater();
    }

    return collectionInstance;
  }

  /**
   * Wrap collection creation methods to auto-enhance instances
   */
  function wrapCollectionsHelper(Collections) {
    if (!Collections) return;

    // Store original proxy handlers
    const originalClassName = Collections.ClassName;
    const originalTagName = Collections.TagName;
    const originalName = Collections.Name;

    // Wrap ClassName
    Collections.ClassName = new Proxy(originalClassName, {
      get: (target, prop) => {
        const result = Reflect.get(target, prop);
        return enhanceCollectionInstance(result);
      },
      apply: (target, thisArg, args) => {
        const result = Reflect.apply(target, thisArg, args);
        return enhanceCollectionInstance(result);
      }
    });

    // Wrap TagName
    Collections.TagName = new Proxy(originalTagName, {
      get: (target, prop) => {
        const result = Reflect.get(target, prop);
        return enhanceCollectionInstance(result);
      },
      apply: (target, thisArg, args) => {
        const result = Reflect.apply(target, thisArg, args);
        return enhanceCollectionInstance(result);
      }
    });

    // Wrap Name
    Collections.Name = new Proxy(originalName, {
      get: (target, prop) => {
        const result = Reflect.get(target, prop);
        return enhanceCollectionInstance(result);
      },
      apply: (target, thisArg, args) => {
        const result = Reflect.apply(target, thisArg, args);
        return enhanceCollectionInstance(result);
      }
    });
  }


  // ===== AUTO-INITIALIZATION =====
  
  // Wait for DOM Helpers to be available
  function initializeBulkUpdaters() {
    if (typeof global.Elements !== 'undefined') {
      enhanceElementsHelper(global.Elements);
    }

    if (typeof global.Collections !== 'undefined') {
      wrapCollectionsHelper(global.Collections);
    }

    if (typeof global.DOMHelpers !== 'undefined') {
      global.DOMHelpers.BulkPropertyUpdaters = {
        version: '1.0.0',
        enhanceElementsHelper,
        enhanceCollectionInstance,
        wrapCollectionsHelper
      };
    }
  }

  // Initialize immediately if DOM Helpers are already loaded
  if (typeof global.Elements !== 'undefined' || typeof global.Collections !== 'undefined') {
    initializeBulkUpdaters();
  } else {
    // Wait for DOM to be ready and try again
    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeBulkUpdaters);
      } else {
        // DOM already ready, try initialization after a short delay
        setTimeout(initializeBulkUpdaters, 100);
      }
    }
  }

  // Export for different module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      enhanceElementsHelper,
      enhanceCollectionInstance,
      wrapCollectionsHelper,
      initializeBulkUpdaters
    };
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return {
        enhanceElementsHelper,
        enhanceCollectionInstance,
        wrapCollectionsHelper,
        initializeBulkUpdaters
      };
    });
  } else {
    global.BulkPropertyUpdaters = {
      enhanceElementsHelper,
      enhanceCollectionInstance,
      wrapCollectionsHelper,
      initializeBulkUpdaters
    };
  }

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
/**
 * 02_dh-collection-shortcuts
 * 
 * Collection Shortcuts for DOM Helpers (Enhanced with Index Support)
 * Provides ClassName, TagName, Name globally with index selection
 * 
 * Usage:
 *   ClassName.button              // All buttons
 *   ClassName.button[0]           // First button
 *   ClassName.button[1]           // Second button
 *   ClassName.button[-1]          // Last button
 *   ClassName['container.item'][2] // Third item in container
 * 
 * @version 2.0.1
 * @requires DOM Helpers Library (Collections helper)
 * @license MIT
 */

(function(global) {
  'use strict';

  // ===== DEPENDENCY CHECK =====
  if (typeof global.Collections === 'undefined') {
    console.error('[Global Shortcuts] Collections helper not found. Please load DOM Helpers library first.');
    return;
  }

  // ===== ENHANCED COLLECTION WRAPPER =====
  /**
   * Creates an enhanced collection wrapper with index access
   * @param {Object} collection - The original collection from Collections helper
   * @returns {Proxy} - Enhanced collection with index support
   */
  function createEnhancedCollectionWrapper(collection) {
    if (!collection) return collection;

    // If it's already a proxy or doesn't need enhancement, return as is
    if (collection._isEnhancedWrapper) {
      return collection;
    }

    // Create a proxy that intercepts numeric index access
    return new Proxy(collection, {
      get(target, prop) {
        // CRITICAL: Handle symbols BEFORE isNaN check (for Array.from, spread operator, etc.)
        if (typeof prop === 'symbol') {
          return target[prop];
        }

        // Handle special properties that should pass through directly
        if (prop === 'constructor' || 
            prop === 'prototype' ||
            prop === 'length' ||
            prop === 'toString' ||
            prop === 'valueOf' ||
            prop === 'toLocaleString' ||
            prop === '_isEnhancedWrapper' ||
            prop === '_originalCollection' ||
            prop === '_originalNodeList' ||
            prop === '_hasIndexedUpdateSupport' ||
            prop === 'update' ||
            prop === 'item' ||
            prop === 'entries' ||
            prop === 'keys' ||
            prop === 'values' ||
            prop === 'forEach' ||
            prop === 'namedItem') {
          return target[prop];
        }

        // Handle numeric indices (including negative indices)
        if (!isNaN(prop)) {
          const index = parseInt(prop);
          let element;

          // Handle negative indices (e.g., -1 for last element)
          if (index < 0) {
            const positiveIndex = target.length + index;
            element = target[positiveIndex];
          } else {
            element = target[index];
          }

          // Enhance the element with update method if available
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (global.EnhancedUpdateUtility && global.EnhancedUpdateUtility.enhanceElementWithUpdate) {
              return global.EnhancedUpdateUtility.enhanceElementWithUpdate(element);
            }
          }

          return element;
        }

        // Return the original property
        return target[prop];
      },

      set(target, prop, value) {
        // Handle symbols
        if (typeof prop === 'symbol') {
          return false;
        }

        // Allow setting numeric indices
        if (!isNaN(prop)) {
          const index = parseInt(prop);
          if (index >= 0 && index < target.length) {
            // Can't directly set elements in a live collection
            console.warn('[Global Shortcuts] Cannot set element at index in live collection');
            return false;
          }
        }
        
        // Try to set other properties
        try {
          target[prop] = value;
          return true;
        } catch (e) {
          return false;
        }
      }
    });
  }

  // ===== PROXY CREATION HELPER =====
  /**
   * Creates a global proxy that forwards to Collections[type]
   * @param {string} type - The collection type (ClassName, TagName, or Name)
   * @returns {Proxy} - Global proxy function with property access
   */
  function createGlobalCollectionProxy(type) {
    const collectionHelper = global.Collections[type];
    
    if (!collectionHelper) {
      console.warn(`[Global Shortcuts] Collections.${type} not found`);
      return null;
    }

    // Base function for function-style calls
    const baseFunction = function(value) {
      const collection = collectionHelper(value);
      return createEnhancedCollectionWrapper(collection);
    };

    // Create proxy for both function calls and property access
    return new Proxy(baseFunction, {
      /**
       * Handle property access (e.g., ClassName.button)
       */
      get: (target, prop) => {
        // Handle function intrinsics
        if (typeof prop === 'symbol' || 
            prop === 'constructor' || 
            prop === 'prototype' ||
            prop === 'apply' ||
            prop === 'call' ||
            prop === 'bind' ||
            prop === 'length' ||
            prop === 'name') {
          return target[prop];
        }

        // Handle toString/valueOf
        if (prop === 'toString' || prop === 'valueOf') {
          return target[prop];
        }

        // Get collection from Collections helper
        const collection = collectionHelper[prop];

        // Return enhanced wrapper
        return createEnhancedCollectionWrapper(collection);
      },

      /**
       * Handle function calls (e.g., ClassName('button'))
       */
      apply: (target, thisArg, args) => {
        const collection = collectionHelper(...args);
        return createEnhancedCollectionWrapper(collection);
      },

      /**
       * Handle 'in' operator
       */
      has: (target, prop) => {
        return prop in collectionHelper;
      },

      /**
       * Handle Object.keys(), for...in, etc.
       */
      ownKeys: (target) => {
        return Reflect.ownKeys(collectionHelper);
      },

      /**
       * Handle Object.getOwnPropertyDescriptor()
       */
      getOwnPropertyDescriptor: (target, prop) => {
        return Reflect.getOwnPropertyDescriptor(collectionHelper, prop);
      }
    });
  }

  // ===== CREATE GLOBAL SHORTCUTS =====

  /**
   * Global ClassName - Access elements by class name with index support
   * @example
   *   ClassName.button              // All buttons
   *   ClassName.button[0]           // First button
   *   ClassName.button[2]           // Third button
   *   ClassName.button[-1]          // Last button
   *   ClassName['container.item'][1] // Second item in container
   */
  const ClassName = createGlobalCollectionProxy('ClassName');

  /**
   * Global TagName - Access elements by tag name with index support
   * @example
   *   TagName.div              // All divs
   *   TagName.div[0]           // First div
   *   TagName.p[-1]            // Last paragraph
   */
  const TagName = createGlobalCollectionProxy('TagName');

  /**
   * Global Name - Access elements by name attribute with index support
   * @example
   *   Name.username              // All elements with name="username"
   *   Name.username[0]           // First username input
   */
  const Name = createGlobalCollectionProxy('Name');

  // ===== EXPORT TO GLOBAL SCOPE =====

  if (ClassName) global.ClassName = ClassName;
  if (TagName) global.TagName = TagName;
  if (Name) global.Name = Name;

  // ===== INTEGRATE WITH DOM HELPERS =====

  if (typeof global.DOMHelpers !== 'undefined') {
    if (ClassName) global.DOMHelpers.ClassName = ClassName;
    if (TagName) global.DOMHelpers.TagName = TagName;
    if (Name) global.DOMHelpers.Name = Name;
  }

  // ===== EXPORT FOR MODULE SYSTEMS =====

  const GlobalCollectionShortcuts = {
    ClassName,
    TagName,
    Name,
    version: '2.0.1'
  };

  // CommonJS
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlobalCollectionShortcuts;
  }

  // AMD
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return GlobalCollectionShortcuts;
    });
  }

  // Browser global
  global.GlobalCollectionShortcuts = GlobalCollectionShortcuts;

  // ===== LOGGING =====

  if (typeof console !== 'undefined' && console.log) {
    console.log('[DOM Helpers] Global shortcuts v2.0.1 loaded with index support');
    console.log('[DOM Helpers] Usage: ClassName.button[0], TagName.div[1], Name.username[-1]');
  }

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
/**
 * 03_dh-global-query
 * 
 * DOM Helpers - Global Query
 * Adds global querySelector and querySelectorAll functions with .update() support
 * 
 * IMPORTANT: Load this AFTER the main DOM helpers bundle!
 * 
 * @version 1.0.1
 * @license MIT
 */
(function(global) {
    "use strict";
    const hasUpdateUtility = typeof global.EnhancedUpdateUtility !== "undefined";
    if (!hasUpdateUtility) {
        console.warn("[Global Query] EnhancedUpdateUtility not found. Load main DOM helpers first!");
    }
    function enhanceElement(element) {
        if (!element || element._hasGlobalQueryUpdate || element._hasEnhancedUpdateMethod) {
            return element;
        }
        if (hasUpdateUtility && global.EnhancedUpdateUtility.enhanceElementWithUpdate) {
            const enhanced = global.EnhancedUpdateUtility.enhanceElementWithUpdate(element);
            try {
                Object.defineProperty(enhanced, "_hasGlobalQueryUpdate", {
                    value: true,
                    writable: false,
                    enumerable: false,
                    configurable: false
                });
            } catch (e) {
                enhanced._hasGlobalQueryUpdate = true;
            }
            return enhanced;
        }
        return element;
    }
    function enhanceNodeList(nodeList, selector) {
        if (!nodeList) {
            return createEmptyCollection();
        }
        if (nodeList._hasGlobalQueryUpdate || nodeList._hasEnhancedUpdateMethod) {
            return nodeList;
        }
        const collection = {
            _originalNodeList: nodeList,
            _selector: selector,
            _cachedAt: Date.now(),
            get length() {
                return nodeList.length;
            },
            item(index) {
                return enhanceElement(nodeList.item(index));
            },
            entries() {
                return nodeList.entries();
            },
            keys() {
                return nodeList.keys();
            },
            values() {
                return nodeList.values();
            },
            toArray() {
                return Array.from(nodeList).map(el => enhanceElement(el));
            },
            forEach(callback, thisArg) {
                Array.from(nodeList).forEach((el, index) => {
                    callback.call(thisArg, enhanceElement(el), index, collection);
                }, thisArg);
            },
            map(callback, thisArg) {
                return Array.from(nodeList).map((el, index) => callback.call(thisArg, enhanceElement(el), index, collection), thisArg);
            },
            filter(callback, thisArg) {
                return Array.from(nodeList).filter((el, index) => callback.call(thisArg, enhanceElement(el), index, collection), thisArg);
            },
            find(callback, thisArg) {
                return Array.from(nodeList).find((el, index) => callback.call(thisArg, enhanceElement(el), index, collection), thisArg);
            },
            some(callback, thisArg) {
                return Array.from(nodeList).some((el, index) => callback.call(thisArg, enhanceElement(el), index, collection), thisArg);
            },
            every(callback, thisArg) {
                return Array.from(nodeList).every((el, index) => callback.call(thisArg, enhanceElement(el), index, collection), thisArg);
            },
            reduce(callback, initialValue) {
                return Array.from(nodeList).reduce((acc, el, index) => callback(acc, enhanceElement(el), index, collection), initialValue);
            },
            first() {
                return nodeList.length > 0 ? enhanceElement(nodeList[0]) : null;
            },
            last() {
                return nodeList.length > 0 ? enhanceElement(nodeList[nodeList.length - 1]) : null;
            },
            at(index) {
                if (index < 0) index = nodeList.length + index;
                return index >= 0 && index < nodeList.length ? enhanceElement(nodeList[index]) : null;
            },
            isEmpty() {
                return nodeList.length === 0;
            },
            addClass(className) {
                this.forEach(el => el.classList.add(className));
                return this;
            },
            removeClass(className) {
                this.forEach(el => el.classList.remove(className));
                return this;
            },
            toggleClass(className) {
                this.forEach(el => el.classList.toggle(className));
                return this;
            },
            setProperty(prop, value) {
                this.forEach(el => el[prop] = value);
                return this;
            },
            setAttribute(attr, value) {
                this.forEach(el => el.setAttribute(attr, value));
                return this;
            },
            setStyle(styles) {
                this.forEach(el => {
                    Object.assign(el.style, styles);
                });
                return this;
            },
            on(event, handler) {
                this.forEach(el => el.addEventListener(event, handler));
                return this;
            },
            off(event, handler) {
                this.forEach(el => el.removeEventListener(event, handler));
                return this;
            }
        };
        for (let i = 0; i < nodeList.length; i++) {
            Object.defineProperty(collection, i, {
                get() {
                    return enhanceElement(nodeList[i]);
                },
                enumerable: true
            });
        }
        collection[Symbol.iterator] = function*() {
            for (let i = 0; i < nodeList.length; i++) {
                yield enhanceElement(nodeList[i]);
            }
        };
        if (hasUpdateUtility && global.EnhancedUpdateUtility.enhanceCollectionWithUpdate) {
            global.EnhancedUpdateUtility.enhanceCollectionWithUpdate(collection);
        }
        try {
            Object.defineProperty(collection, "_hasGlobalQueryUpdate", {
                value: true,
                writable: false,
                enumerable: false,
                configurable: false
            });
        } catch (e) {
            collection._hasGlobalQueryUpdate = true;
        }
        return collection;
    }
    function createEmptyCollection() {
        return enhanceNodeList([], "empty");
    }
    function querySelector(selector, context = document) {
        if (typeof selector !== "string") {
            console.warn("[Global Query] querySelector requires a string selector");
            return null;
        }
        try {
            const element = context.querySelector(selector);
            return element ? enhanceElement(element) : null;
        } catch (error) {
            console.warn(`[Global Query] Invalid selector "${selector}": ${error.message}`);
            return null;
        }
    }
    function querySelectorAll(selector, context = document) {
        if (typeof selector !== "string") {
            console.warn("[Global Query] querySelectorAll requires a string selector");
            return createEmptyCollection();
        }
        try {
            const nodeList = context.querySelectorAll(selector);
            return enhanceNodeList(nodeList, selector);
        } catch (error) {
            console.warn(`[Global Query] Invalid selector "${selector}": ${error.message}`);
            return createEmptyCollection();
        }
    }
    const query = querySelector;
    const queryAll = querySelectorAll;
    function queryWithin(container, selector) {
        const containerEl = typeof container === "string" ? document.querySelector(container) : container;
        if (!containerEl) {
            console.warn("[Global Query] Container not found");
            return null;
        }
        return querySelector(selector, containerEl);
    }
    function queryAllWithin(container, selector) {
        const containerEl = typeof container === "string" ? document.querySelector(container) : container;
        if (!containerEl) {
            console.warn("[Global Query] Container not found");
            return createEmptyCollection();
        }
        return querySelectorAll(selector, containerEl);
    }
    global.querySelector = querySelector;
    global.querySelectorAll = querySelectorAll;
    global.query = query;
    global.queryAll = queryAll;
    global.queryWithin = queryWithin;
    global.queryAllWithin = queryAllWithin;
    const GlobalQuery = {
        version: "1.0.1",
        querySelector: querySelector,
        querySelectorAll: querySelectorAll,
        query: query,
        queryAll: queryAll,
        queryWithin: queryWithin,
        queryAllWithin: queryAllWithin,
        enhanceElement: enhanceElement,
        enhanceNodeList: enhanceNodeList
    };
    if (typeof module !== "undefined" && module.exports) {
        module.exports = GlobalQuery;
    } else if (typeof define === "function" && define.amd) {
        define([], function() {
            return GlobalQuery;
        });
    } else {
        global.GlobalQuery = GlobalQuery;
    }
    if (typeof global.DOMHelpers !== "undefined") {
        global.DOMHelpers.GlobalQuery = GlobalQuery;
        global.DOMHelpers.querySelector = querySelector;
        global.DOMHelpers.querySelectorAll = querySelectorAll;
        global.DOMHelpers.query = query;
        global.DOMHelpers.queryAll = queryAll;
        global.DOMHelpers.queryWithin = queryWithin;
        global.DOMHelpers.queryAllWithin = queryAllWithin;
    }
    console.log("[DOM Helpers] Global querySelector/querySelectorAll functions loaded");
})(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);



/**
 * 04_dh-indexed-collection-updates
 * 
 * DOM Helpers - Indexed Collection Updates 
 * Standalone module that adds indexed update support to collections
 * 
 * IMPORTANT: Load this AFTER the main DOM helpers bundle AND global-query.js!
 * 
 * Enables syntax like:
 * querySelectorAll('.btn').update({
 *   [0]: { textContent: 'First', style: { color: 'red' } },
 *   [1]: { textContent: 'Second', style: { color: 'blue' } },
 *   classList: { add: ['shared-class'] }  // Applied to ALL elements
 * })
 * 
 * @version 1.1.0 - FIXED: Now applies both bulk and index updates
 * @license MIT
 */
(function(global) {
    "use strict";

    // ===== DEPENDENCY CHECKS =====
    const hasEnhancedUpdateUtility = typeof global.EnhancedUpdateUtility !== "undefined";
    const hasGlobalQuery = typeof global.querySelectorAll === "function" || typeof global.queryAll === "function";

    if (!hasEnhancedUpdateUtility) {
        console.warn("[Indexed Updates] EnhancedUpdateUtility not found. Load main DOM helpers first!");
    }
    if (!hasGlobalQuery) {
        console.warn("[Indexed Updates] Global query functions not found. Load global-query.js first!");
    }

    // ===== HELPER: APPLY UPDATES TO SINGLE ELEMENT =====
    /**
     * Applies updates to a single element
     */
    function applyUpdatesToElement(element, updates) {
        if (typeof global.EnhancedUpdateUtility !== "undefined" && 
            global.EnhancedUpdateUtility.applyEnhancedUpdate) {
            Object.entries(updates).forEach(([key, value]) => {
                global.EnhancedUpdateUtility.applyEnhancedUpdate(element, key, value);
            });
        } else if (typeof element.update === "function") {
            element.update(updates);
        } else {
            applyBasicUpdate(element, updates);
        }
    }

    // ===== BASIC UPDATE FALLBACK =====
    /**
     * Basic update implementation for elements without .update() method
     */
    function applyBasicUpdate(element, updates) {
        Object.entries(updates).forEach(([key, value]) => {
            try {
                if (key === "style" && typeof value === "object" && value !== null) {
                    Object.entries(value).forEach(([styleProperty, styleValue]) => {
                        if (styleValue !== null && styleValue !== undefined) {
                            element.style[styleProperty] = styleValue;
                        }
                    });
                    return;
                }

                if (key === "classList" && typeof value === "object" && value !== null) {
                    Object.entries(value).forEach(([method, classes]) => {
                        const classList = Array.isArray(classes) ? classes : [classes];
                        switch (method) {
                            case "add":
                                element.classList.add(...classList);
                                break;
                            case "remove":
                                element.classList.remove(...classList);
                                break;
                            case "toggle":
                                classList.forEach(c => element.classList.toggle(c));
                                break;
                        }
                    });
                    return;
                }

                if (key === "setAttribute") {
                    if (Array.isArray(value) && value.length >= 2) {
                        element.setAttribute(value[0], value[1]);
                    } else if (typeof value === "object") {
                        Object.entries(value).forEach(([attr, val]) => element.setAttribute(attr, val));
                    }
                    return;
                }

                if (key in element) {
                    element[key] = value;
                } else if (typeof value === "string" || typeof value === "number") {
                    element.setAttribute(key, value);
                }
            } catch (error) {
                console.warn(`[Indexed Updates] Failed to apply ${key}:`, error.message);
            }
        });
    }

    // ===== CORE: INDEXED UPDATE FUNCTION (FIXED) =====
    /**
     * Updates collection with support for indexed updates AND bulk updates
     * FIXED: Now applies both types of updates correctly
     */
    function updateCollectionWithIndices(collection, updates) {
        if (!collection) {
            console.warn("[Indexed Updates] .update() called on null collection");
            return collection;
        }

        // Extract elements from collection
        let elements = [];
        if (collection.length !== undefined) {
            try {
                elements = Array.from(collection);
            } catch (e) {
                // Fallback for non-iterable collections
                for (let i = 0; i < collection.length; i++) {
                    elements.push(collection[i]);
                }
            }
        } else if (collection._originalCollection) {
            elements = Array.from(collection._originalCollection);
        } else if (collection._originalNodeList) {
            elements = Array.from(collection._originalNodeList);
        } else {
            console.warn("[Indexed Updates] .update() called on unrecognized collection type");
            return collection;
        }

        if (elements.length === 0) {
            console.info("[Indexed Updates] .update() called on empty collection");
            return collection;
        }

        try {
            const updateKeys = Object.keys(updates);
            
            // FIXED: Separate numeric indices from bulk properties
            const indexUpdates = {};
            const bulkUpdates = {};
            let hasIndexUpdates = false;
            let hasBulkUpdates = false;

            updateKeys.forEach(key => {
                // Skip Symbol keys
                if (typeof key === 'symbol') return;
                
                const asNumber = Number(key);
                // Check if it's a valid numeric index
                if (Number.isFinite(asNumber) && 
                    Number.isInteger(asNumber) && 
                    String(asNumber) === key) {
                    indexUpdates[key] = updates[key];
                    hasIndexUpdates = true;
                } else {
                    bulkUpdates[key] = updates[key];
                    hasBulkUpdates = true;
                }
            });

            // FIXED: Apply BOTH bulk and index updates

            // 1. First, apply bulk updates to ALL elements
            if (hasBulkUpdates) {
                console.log("[Indexed Updates] Applying bulk updates to all elements");
                elements.forEach(element => {
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        applyUpdatesToElement(element, bulkUpdates);
                    }
                });
            }

            // 2. Then, apply index-specific updates (these can override bulk)
            if (hasIndexUpdates) {
                console.log("[Indexed Updates] Applying index-specific updates");
                Object.entries(indexUpdates).forEach(([key, elementUpdates]) => {
                    let index = Number(key);
                    
                    // Handle negative indices
                    if (index < 0) {
                        index = elements.length + index;
                    }

                    const element = elements[index];
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (elementUpdates && typeof elementUpdates === "object") {
                            applyUpdatesToElement(element, elementUpdates);
                        }
                    } else if (index >= 0 && index < elements.length) {
                        console.warn(`[Indexed Updates] Element at index ${key} is not a valid DOM element`);
                    } else {
                        console.warn(`[Indexed Updates] No element at index ${key} (resolved to ${index}, collection has ${elements.length} elements)`);
                    }
                });
            }

            // Log summary
            if (!hasIndexUpdates && !hasBulkUpdates) {
                console.log("[Indexed Updates] No updates applied");
            }

        } catch (error) {
            console.warn(`[Indexed Updates] Error in collection .update(): ${error.message}`);
            console.error(error);
        }

        return collection;
    }

    // ===== PATCH COLLECTION UPDATE METHOD =====
    /**
     * Patches a collection's update method to support indexed updates
     */
    function patchCollectionUpdate(collection) {
        if (!collection || collection._hasIndexedUpdateSupport) {
            return collection;
        }

        // Store reference to original update method
        const originalUpdate = collection.update;

        try {
            Object.defineProperty(collection, "update", {
                value: function(updates = {}) {
                    // Always use the fixed indexed update logic
                    return updateCollectionWithIndices(this, updates);
                },
                writable: false,
                enumerable: false,
                configurable: true
            });

            Object.defineProperty(collection, "_hasIndexedUpdateSupport", {
                value: true,
                writable: false,
                enumerable: false,
                configurable: false
            });
        } catch (e) {
            // Fallback if defineProperty fails
            collection.update = function(updates = {}) {
                return updateCollectionWithIndices(this, updates);
            };
            collection._hasIndexedUpdateSupport = true;
        }

        return collection;
    }

    // ===== PATCH GLOBAL QUERY FUNCTIONS =====

    const originalQS = global.querySelector;
    const originalQSA = global.querySelectorAll;
    const originalQSShort = global.query;
    const originalQSAShort = global.queryAll;

    function enhancedQuerySelectorAll(selector, context = document) {
        let collection;
        if (originalQSA) {
            collection = originalQSA.call(global, selector, context);
        } else if (originalQSAShort) {
            collection = originalQSAShort.call(global, selector, context);
        } else {
            console.warn("[Indexed Updates] No querySelectorAll function found");
            return null;
        }

        // Only patch if collection doesn't already have indexed update support
        if (collection && !collection._hasIndexedUpdateSupport) {
            return patchCollectionUpdate(collection);
        }
        
        return collection;
    }

    function enhancedQSA(selector, context = document) {
        return enhancedQuerySelectorAll(selector, context);
    }

    if (originalQSA) {
        global.querySelectorAll = enhancedQuerySelectorAll;
        console.log("[Indexed Updates] Enhanced querySelectorAll");
    }

    if (originalQSAShort) {
        global.queryAll = enhancedQSA;
        console.log("[Indexed Updates] Enhanced queryAll");
    }

    // ===== PATCH COLLECTIONS HELPER =====

    if (global.Collections) {
        const originalCollectionsUpdate = global.Collections.update;
        global.Collections.update = function(updates = {}) {
            // Check if using colon-based selector syntax (e.g., ".btn:0")
            const hasColonKeys = Object.keys(updates).some(key => key.includes(":"));
            if (hasColonKeys && originalCollectionsUpdate) {
                // Use original Collections update for selector syntax
                return originalCollectionsUpdate.call(this, updates);
            } else {
                // Use new indexed update logic
                return updateCollectionWithIndices(this, updates);
            }
        };
        console.log("[Indexed Updates] Patched Collections.update");
    }

    // ===== PATCH SELECTOR HELPER =====

    if (global.Selector) {
        const originalSelectorUpdate = global.Selector.update;
        global.Selector.update = function(updates = {}) {
            const firstKey = Object.keys(updates)[0];
            // Check if using selector-based syntax
            const looksLikeSelector = firstKey && (firstKey.startsWith("#") || firstKey.startsWith(".") || firstKey.includes("["));
            if (looksLikeSelector && originalSelectorUpdate) {
                return originalSelectorUpdate.call(this, updates);
            } else {
                return updateCollectionWithIndices(this, updates);
            }
        };
        console.log("[Indexed Updates] Patched Selector.update");
    }

    // ===== PATCH ENHANCED UPDATE UTILITY =====

    if (hasEnhancedUpdateUtility && global.EnhancedUpdateUtility.enhanceCollectionWithUpdate) {
        const originalEnhance = global.EnhancedUpdateUtility.enhanceCollectionWithUpdate;
        global.EnhancedUpdateUtility.enhanceCollectionWithUpdate = function(collection) {
            const enhanced = originalEnhance.call(this, collection);
            return patchCollectionUpdate(enhanced);
        };
        console.log("[Indexed Updates] Patched EnhancedUpdateUtility.enhanceCollectionWithUpdate");
    }

    // ===== EXPORTS =====

    const IndexedUpdates = {
        version: "1.1.0",
        updateCollectionWithIndices: updateCollectionWithIndices,
        patchCollectionUpdate: patchCollectionUpdate,
        patch(collection) {
            return patchCollectionUpdate(collection);
        },
        hasSupport(collection) {
            return !!(collection && collection._hasIndexedUpdateSupport);
        },
        restore() {
            if (originalQSA) global.querySelectorAll = originalQSA;
            if (originalQSAShort) global.queryAll = originalQSAShort;
            console.log("[Indexed Updates] Restored original functions");
        }
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = IndexedUpdates;
    } else if (typeof define === "function" && define.amd) {
        define([], function() {
            return IndexedUpdates;
        });
    } else {
        global.IndexedUpdates = IndexedUpdates;
    }

    if (typeof global.DOMHelpers !== "undefined") {
        global.DOMHelpers.IndexedUpdates = IndexedUpdates;
    }

    console.log("[DOM Helpers] Indexed collection updates loaded - v1.1.0 (FIXED)");
    console.log("[Indexed Updates] ✓ Now supports BOTH bulk and index-specific updates");
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
/** 
*05_dh-index-selection
*/

(function patchSelectorForBulkUpdates() {
  if (typeof Selector === 'undefined' || typeof BulkPropertyUpdaters === 'undefined') return;

  const originalQueryAll = Selector.queryAll;
  Selector.queryAll = function(...args) {
    const result = originalQueryAll.apply(this, args);
    return BulkPropertyUpdaters.enhanceCollectionInstance(result);
  };
})();
/**
 * 06_dh-global-collection-indexed-updates
 * 
 * Global Collection Indexed Updates 
 * Adds bulk indexed update support to Global Collection Shortcuts
 * 
 * Enables syntax like:
 *   ClassName.button.update({
 *     [0]: { textContent: 'First', style: { color: 'red' } },
 *     [1]: { textContent: 'Second', style: { color: 'blue' } },
 *     [-1]: { textContent: 'Last', style: { color: 'green' } },
 *     classList: { add: ['shared-class'] }  // Applied to ALL elements
 *   })
 * 
 * IMPORTANT: Load this AFTER:
 *   1. DOM Helpers Library (Collections)
 *   2. Global Collection Shortcuts
 *   3. EnhancedUpdateUtility (main DOM helpers)
 * 
 * @version 1.1.0 - FIXED: Now applies both bulk and index updates
 * @license MIT
 */

(function(global) {
  'use strict';

  // ===== DEPENDENCY CHECKS =====
  const hasCollections = typeof global.Collections !== 'undefined';
  const hasGlobalShortcuts = typeof global.ClassName !== 'undefined' || 
                              typeof global.TagName !== 'undefined' || 
                              typeof global.Name !== 'undefined';
  const hasUpdateUtility = typeof global.EnhancedUpdateUtility !== 'undefined';

  if (!hasCollections) {
    console.error('[Global Shortcuts Indexed Updates] Collections helper not found. Please load DOM Helpers library first.');
    return;
  }

  if (!hasGlobalShortcuts) {
    console.error('[Global Shortcuts Indexed Updates] Global Collection Shortcuts not found. Please load global-collection-shortcuts.js first.');
    return;
  }

  if (!hasUpdateUtility) {
    console.warn('[Global Shortcuts Indexed Updates] EnhancedUpdateUtility not found. Basic update functionality will be limited.');
  }

  // ===== CORE UPDATE LOGIC (FIXED) =====

  /**
   * Apply updates to a collection with index support
   * FIXED: Now applies BOTH bulk and index-specific updates
   * @param {Object} collection - The collection to update
   * @param {Object} updates - Update object with numeric indices or properties
   * @returns {Object} - The collection (for chaining)
   */
  function updateCollectionWithIndices(collection, updates) {
    if (!collection) {
      console.warn('[Global Shortcuts Indexed Updates] .update() called on null collection');
      return collection;
    }

    // Convert collection to array of elements
    let elements = [];
    
    if (collection.length !== undefined) {
      // It's array-like
      for (let i = 0; i < collection.length; i++) {
        elements.push(collection[i]);
      }
    } else {
      console.warn('[Global Shortcuts Indexed Updates] .update() called on unrecognized collection type');
      return collection;
    }

    if (elements.length === 0) {
      console.info('[Global Shortcuts Indexed Updates] .update() called on empty collection');
      return collection;
    }

    try {
      const updateKeys = Object.keys(updates);
      
      // FIXED: Separate numeric indices from bulk properties
      const indexUpdates = {};
      const bulkUpdates = {};
      let hasNumericIndices = false;
      let hasBulkUpdates = false;

      updateKeys.forEach(key => {
        const num = parseInt(key, 10);
        
        // Check if it's a valid numeric index
        if (!isNaN(num) && key === String(num)) {
          indexUpdates[key] = updates[key];
          hasNumericIndices = true;
        } else {
          bulkUpdates[key] = updates[key];
          hasBulkUpdates = true;
        }
      });

      // FIXED: Apply BOTH types of updates

      // 1. First, apply bulk updates to ALL elements
      if (hasBulkUpdates) {
        console.log('[Global Shortcuts Indexed Updates] Applying bulk updates to all elements');
        
        elements.forEach(element => {
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            applyUpdatesToElement(element, bulkUpdates);
          }
        });
      }

      // 2. Then, apply index-specific updates (these can override bulk)
      if (hasNumericIndices) {
        console.log('[Global Shortcuts Indexed Updates] Applying index-specific updates');
        
        Object.entries(indexUpdates).forEach(([key, elementUpdates]) => {
          let index = parseInt(key, 10);
          
          // Handle negative indices
          if (index < 0) {
            index = elements.length + index;
          }

          // Get the element at this index
          const element = elements[index];

          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (elementUpdates && typeof elementUpdates === 'object') {
              // Apply updates to this specific element
              applyUpdatesToElement(element, elementUpdates);
            }
          } else if (index >= 0 && index < elements.length) {
            console.warn(`[Global Shortcuts Indexed Updates] Element at index ${key} is not a valid DOM element`);
          } else {
            console.warn(`[Global Shortcuts Indexed Updates] No element at index ${key} (resolved to ${index}, collection has ${elements.length} elements)`);
          }
        });
      }

      // Log summary
      if (!hasNumericIndices && !hasBulkUpdates) {
        console.log('[Global Shortcuts Indexed Updates] No updates applied');
      }

    } catch (error) {
      console.error(`[Global Shortcuts Indexed Updates] Error in collection .update(): ${error.message}`);
    }

    return collection;
  }

  /**
   * Apply update object to a single element
   * @param {Element} element - DOM element to update
   * @param {Object} updates - Updates to apply
   */
  function applyUpdatesToElement(element, updates) {
    // If element has .update() method from EnhancedUpdateUtility, use it
    if (typeof element.update === 'function') {
      element.update(updates);
      return;
    }

    // Otherwise, use EnhancedUpdateUtility directly if available
    if (hasUpdateUtility && global.EnhancedUpdateUtility.applyEnhancedUpdate) {
      Object.entries(updates).forEach(([key, value]) => {
        global.EnhancedUpdateUtility.applyEnhancedUpdate(element, key, value);
      });
      return;
    }

    // Fallback to basic update
    applyBasicUpdate(element, updates);
  }

  /**
   * Basic update implementation (fallback)
   * @param {Element} element - DOM element
   * @param {Object} updates - Updates to apply
   */
  function applyBasicUpdate(element, updates) {
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
            }
          });
          return;
        }

        // Handle setAttribute
        if (key === 'setAttribute') {
          if (Array.isArray(value) && value.length >= 2) {
            element.setAttribute(value[0], value[1]);
          } else if (typeof value === 'object') {
            Object.entries(value).forEach(([attr, val]) => {
              element.setAttribute(attr, val);
            });
          }
          return;
        }

        // Handle direct properties
        if (key in element) {
          element[key] = value;
        } else if (typeof value === 'string' || typeof value === 'number') {
          element.setAttribute(key, value);
        }
      } catch (error) {
        console.warn(`[Global Shortcuts Indexed Updates] Failed to apply ${key}:`, error.message);
      }
    });
  }




  // ===== ENHANCED COLLECTION WRAPPER WITH UPDATE =====

  /**
   * Creates an enhanced collection wrapper with indexed update support
   * @param {Object} collection - The original collection
   * @returns {Proxy} - Enhanced collection with .update() method
   */
  function createEnhancedCollectionWithUpdate(collection) {
    if (!collection) return collection;

    // Check if already enhanced
    if (collection._hasIndexedUpdateSupport) {
      return collection;
    }

    // Create a wrapper object with .update() method
    const enhancedCollection = Object.create(null);
    
    // Copy length property
    Object.defineProperty(enhancedCollection, 'length', {
      get() {
        return collection.length;
      },
      enumerable: false
    });

    // Add numeric indices
    for (let i = 0; i < collection.length; i++) {
      Object.defineProperty(enhancedCollection, i, {
        get() {
          const element = collection[i];
          // Enhance individual elements if possible
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (hasUpdateUtility && global.EnhancedUpdateUtility.enhanceElementWithUpdate) {
              return global.EnhancedUpdateUtility.enhanceElementWithUpdate(element);
            }
          }
          return element;
        },
        enumerable: true
      });
    }

    // Add .update() method with FIXED logic
    Object.defineProperty(enhancedCollection, 'update', {
      value: function(updates = {}) {
        return updateCollectionWithIndices(this, updates);
      },
      writable: false,
      enumerable: false,
      configurable: false
    });

    // Mark as enhanced
    Object.defineProperty(enhancedCollection, '_hasIndexedUpdateSupport', {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    });

    // Make it iterable
    enhancedCollection[Symbol.iterator] = function*() {
      for (let i = 0; i < collection.length; i++) {
        yield enhancedCollection[i];
      }
    };

    // Add common array methods
    enhancedCollection.forEach = function(callback, thisArg) {
      for (let i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };

    enhancedCollection.map = function(callback, thisArg) {
      const result = [];
      for (let i = 0; i < this.length; i++) {
        result.push(callback.call(thisArg, this[i], i, this));
      }
      return result;
    };

    enhancedCollection.filter = function(callback, thisArg) {
      const result = [];
      for (let i = 0; i < this.length; i++) {
        if (callback.call(thisArg, this[i], i, this)) {
          result.push(this[i]);
        }
      }
      return result;
    };

    return enhancedCollection;
  }


  
  // ===== PATCH GLOBAL COLLECTION SHORTCUTS =====

  /**
   * Patch a global shortcut proxy to return enhanced collections
   * @param {Proxy} originalProxy - The original global proxy
   * @returns {Proxy} - Patched proxy
   */
  function patchGlobalShortcut(originalProxy) {
    if (!originalProxy) return originalProxy;

    return new Proxy(originalProxy, {
      get(target, prop) {
        // Get the original result
        const result = target[prop];

        // If it's a collection (has length), enhance it
        if (result && typeof result === 'object' && 'length' in result && !result._hasIndexedUpdateSupport) {
          return createEnhancedCollectionWithUpdate(result);
        }

        return result;
      },

      apply(target, thisArg, args) {
        // Handle function calls
        const result = Reflect.apply(target, thisArg, args);

        // If it's a collection, enhance it
        if (result && typeof result === 'object' && 'length' in result && !result._hasIndexedUpdateSupport) {
          return createEnhancedCollectionWithUpdate(result);
        }

        return result;
      }
    });
  }

  // ===== APPLY PATCHES =====

  let patchCount = 0;

  if (global.ClassName) {
    global.ClassName = patchGlobalShortcut(global.ClassName);
    patchCount++;
    console.log('[Global Shortcuts Indexed Updates] ✓ Patched ClassName');
  }

  if (global.TagName) {
    global.TagName = patchGlobalShortcut(global.TagName);
    patchCount++;
    console.log('[Global Shortcuts Indexed Updates] ✓ Patched TagName');
  }

  if (global.Name) {
    global.Name = patchGlobalShortcut(global.Name);
    patchCount++;
    console.log('[Global Shortcuts Indexed Updates] ✓ Patched Name');
  }

  // Also patch DOMHelpers if it exists
  if (typeof global.DOMHelpers !== 'undefined') {
    if (global.DOMHelpers.ClassName) {
      global.DOMHelpers.ClassName = global.ClassName;
    }
    if (global.DOMHelpers.TagName) {
      global.DOMHelpers.TagName = global.TagName;
    }
    if (global.DOMHelpers.Name) {
      global.DOMHelpers.Name = global.Name;
    }
  }

  // ===== EXPORT MODULE =====

  const GlobalShortcutsIndexedUpdates = {
    version: '1.1.0',
    updateCollectionWithIndices: updateCollectionWithIndices,
    createEnhancedCollectionWithUpdate: createEnhancedCollectionWithUpdate,
    patchGlobalShortcut: patchGlobalShortcut,
    
    // Utility methods
    hasSupport(collection) {
      return !!(collection && collection._hasIndexedUpdateSupport);
    }
  };

  // CommonJS
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlobalShortcutsIndexedUpdates;
  }

  // AMD
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return GlobalShortcutsIndexedUpdates;
    });
  }

  // Browser global
  global.GlobalShortcutsIndexedUpdates = GlobalShortcutsIndexedUpdates;

  // Integrate with DOMHelpers
  if (typeof global.DOMHelpers !== 'undefined') {
    global.DOMHelpers.GlobalShortcutsIndexedUpdates = GlobalShortcutsIndexedUpdates;
  }

  // ===== LOGGING =====

  console.log(`[Global Shortcuts Indexed Updates] v1.1.0 loaded - ${patchCount} shortcuts patched (FIXED)`);
  console.log('[Global Shortcuts Indexed Updates] ✓ Now supports BOTH bulk and index-specific updates');
  console.log('[Global Shortcuts Indexed Updates] Usage: ClassName.button.update({ [0]: {...}, classList: {...} })');

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
/**
 * 07_dh-bulk-properties-updater-global-query
 * 
 * bulk-properties-updater-global-query
 * 
 * DOM Helpers - Enhanced Query Selectors Extension
 * Adds querySelector/querySelectorAll with .update() support and bulk property methods
 * 
 * @version 1.0.0
 * @license MIT
 */

(function(global) {
  'use strict';

  // ===== ENHANCED ELEMENT WITH UPDATE METHOD =====
  
  /**
   * Enhance a single element with .update() method
   * @param {HTMLElement} element - DOM element to enhance
   * @returns {HTMLElement} - Enhanced element
   */
  function enhanceElement(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return element;
    }

    // Don't re-enhance if already enhanced
    if (element._domHelpersEnhanced) {
      return element;
    }

    // Mark as enhanced
    Object.defineProperty(element, '_domHelpersEnhanced', {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    });

    /**
     * Update method for batch property updates
     * @param {Object} updates - Object containing properties to update
     */
    const updateMethod = function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[DOM Helpers] update() requires an object with properties to update');
        return this;
      }

      Object.entries(updates).forEach(([key, value]) => {
        try {
          switch (key) {
            case 'style':
              if (typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([prop, val]) => {
                  if (val !== null && val !== undefined) {
                    this.style[prop] = val;
                  }
                });
              }
              break;

            case 'dataset':
              if (typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([dataKey, dataVal]) => {
                  this.dataset[dataKey] = dataVal;
                });
              }
              break;

            case 'classList':
              if (typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([method, classes]) => {
                  const classList = Array.isArray(classes) ? classes : [classes];
                  switch (method) {
                    case 'add':
                      this.classList.add(...classList);
                      break;
                    case 'remove':
                      this.classList.remove(...classList);
                      break;
                    case 'toggle':
                      classList.forEach(cls => this.classList.toggle(cls));
                      break;
                    case 'replace':
                      if (classList.length === 2) {
                        this.classList.replace(classList[0], classList[1]);
                      }
                      break;
                  }
                });
              }
              break;

            case 'attrs':
            case 'attributes':
              if (typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([attrName, attrValue]) => {
                  if (attrValue === null || attrValue === false) {
                    this.removeAttribute(attrName);
                  } else {
                    this.setAttribute(attrName, String(attrValue));
                  }
                });
              }
              break;

            default:
              // Direct property assignment
              if (key in this) {
                this[key] = value;
              } else {
                console.warn(`[DOM Helpers] Property '${key}' not found on element`);
              }
          }
        } catch (error) {
          console.warn(`[DOM Helpers] Error updating property '${key}': ${error.message}`);
        }
      });

      return this; // Return for chaining
    };

    // Add update method
    Object.defineProperty(element, 'update', {
      value: updateMethod,
      writable: false,
      enumerable: false,
      configurable: true
    });

    return element;
  }

  // ===== BULK PROPERTY UPDATERS FOR COLLECTIONS =====

  /**
   * Create index-based bulk property updater
   */
  function createIndexBasedPropertyUpdater(propertyName, transformer = null) {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn(`[DOM Helpers] ${propertyName}() requires an object with numeric indices as keys`);
        return this;
      }

      Object.entries(updates).forEach(([index, value]) => {
        try {
          const numIndex = parseInt(index);
          if (isNaN(numIndex)) return;

          const element = this[numIndex];
          
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            const finalValue = transformer ? transformer(value) : value;
            
            if (element.update && typeof element.update === 'function') {
              element.update({ [propertyName]: finalValue });
            } else {
              element[propertyName] = finalValue;
            }
          }
        } catch (error) {
          console.warn(`[DOM Helpers] Error updating ${propertyName} at index ${index}: ${error.message}`);
        }
      });

      return this;
    };
  }

  /**
   * Create index-based style updater
   */
  function createIndexBasedStyleUpdater() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[DOM Helpers] style() requires an object with numeric indices as keys');
        return this;
      }

      Object.entries(updates).forEach(([index, styleObj]) => {
        try {
          const numIndex = parseInt(index);
          if (isNaN(numIndex)) return;

          const element = this[numIndex];
          
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (typeof styleObj !== 'object' || styleObj === null) {
              console.warn(`[DOM Helpers] style() requires style object for index ${index}`);
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
          }
        } catch (error) {
          console.warn(`[DOM Helpers] Error updating style at index ${index}: ${error.message}`);
        }
      });

      return this;
    };
  }

  /**
   * Create index-based dataset updater
   */
  function createIndexBasedDatasetUpdater() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[DOM Helpers] dataset() requires an object with numeric indices as keys');
        return this;
      }

      Object.entries(updates).forEach(([index, dataObj]) => {
        try {
          const numIndex = parseInt(index);
          if (isNaN(numIndex)) return;

          const element = this[numIndex];
          
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (typeof dataObj !== 'object' || dataObj === null) {
              console.warn(`[DOM Helpers] dataset() requires data object for index ${index}`);
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
          console.warn(`[DOM Helpers] Error updating dataset at index ${index}: ${error.message}`);
        }
      });

      return this;
    };
  }

  /**
   * Create index-based attributes updater
   */
  function createIndexBasedAttributesUpdater() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[DOM Helpers] attrs() requires an object with numeric indices as keys');
        return this;
      }

      Object.entries(updates).forEach(([index, attrsObj]) => {
        try {
          const numIndex = parseInt(index);
          if (isNaN(numIndex)) return;

          const element = this[numIndex];
          
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (typeof attrsObj !== 'object' || attrsObj === null) {
              console.warn(`[DOM Helpers] attrs() requires attributes object for index ${index}`);
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
          console.warn(`[DOM Helpers] Error updating attrs at index ${index}: ${error.message}`);
        }
      });

      return this;
    };
  }

  /**
   * Create index-based classList updater
   */
  function createIndexBasedClassListUpdater() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[DOM Helpers] classes() requires an object with numeric indices as keys');
        return this;
      }

      Object.entries(updates).forEach(([index, classConfig]) => {
        try {
          const numIndex = parseInt(index);
          if (isNaN(numIndex)) return;

          const element = this[numIndex];
          
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
                    console.warn(`[DOM Helpers] Error in classList.${method}: ${error.message}`);
                  }
                });
              }
            }
          }
        } catch (error) {
          console.warn(`[DOM Helpers] Error updating classes at index ${index}: ${error.message}`);
        }
      });

      return this;
    };
  }

  /**
   * Create index-based generic property updater
   */
  function createIndexBasedGenericPropertyUpdater() {
    return function(propertyPath, updates = {}) {
      if (typeof propertyPath !== 'string') {
        console.warn('[DOM Helpers] prop() requires a property name as first argument');
        return this;
      }

      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[DOM Helpers] prop() requires an object with numeric indices as keys');
        return this;
      }

      // Check if property path is nested (e.g., 'style.color')
      const isNested = propertyPath.includes('.');
      const pathParts = isNested ? propertyPath.split('.') : null;

      Object.entries(updates).forEach(([index, value]) => {
        try {
          const numIndex = parseInt(index);
          if (isNaN(numIndex)) return;

          const element = this[numIndex];
          
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (isNested) {
              // Handle nested property (e.g., style.color)
              let obj = element;
              for (let i = 0; i < pathParts.length - 1; i++) {
                obj = obj[pathParts[i]];
                if (!obj) {
                  console.warn(`[DOM Helpers] Invalid property path '${propertyPath}' at index ${index}`);
                  return;
                }
              }
              obj[pathParts[pathParts.length - 1]] = value;
            } else {
              // Direct property assignment
              if (propertyPath in element) {
                element[propertyPath] = value;
              } else {
                console.warn(`[DOM Helpers] Property '${propertyPath}' not found on element at index ${index}`);
              }
            }
          }
        } catch (error) {
          console.warn(`[DOM Helpers] Error updating prop '${propertyPath}' at index ${index}: ${error.message}`);
        }
      });

      return this;
    };
  }

  // ===== ENHANCED NODELIST WITH UPDATE AND BULK METHODS =====
  
  /**
   * Create an enhanced NodeList-like object with .update() method and bulk property methods
   * @param {NodeList|Array} nodeList - Original NodeList or array of elements
   * @returns {Object} - Enhanced collection
   */
  function enhanceNodeList(nodeList) {
    if (!nodeList || nodeList.length === 0) {
      // Return empty enhanced array with methods
      const emptyArray = [];
      emptyArray.update = function() { return this; };
      
      // Add bulk property methods that do nothing but return for chaining
      const noopMethod = function() { return this; };
      emptyArray.textContent = noopMethod;
      emptyArray.innerHTML = noopMethod;
      emptyArray.innerText = noopMethod;
      emptyArray.value = noopMethod;
      emptyArray.placeholder = noopMethod;
      emptyArray.title = noopMethod;
      emptyArray.disabled = noopMethod;
      emptyArray.checked = noopMethod;
      emptyArray.readonly = noopMethod;
      emptyArray.hidden = noopMethod;
      emptyArray.selected = noopMethod;
      emptyArray.src = noopMethod;
      emptyArray.href = noopMethod;
      emptyArray.alt = noopMethod;
      emptyArray.style = noopMethod;
      emptyArray.dataset = noopMethod;
      emptyArray.attrs = noopMethod;
      emptyArray.classes = noopMethod;
      emptyArray.prop = noopMethod;
      
      return emptyArray;
    }

    // Convert NodeList to array and enhance each element
    const elements = Array.from(nodeList).map(el => enhanceElement(el));

    // Create proxy object that acts like an array
    const enhancedCollection = Object.create(Array.prototype);
    
    // Copy array elements
    elements.forEach((el, index) => {
      enhancedCollection[index] = el;
    });

    // Set length
    Object.defineProperty(enhancedCollection, 'length', {
      value: elements.length,
      writable: false,
      enumerable: false,
      configurable: false
    });

    // Store original NodeList reference
    Object.defineProperty(enhancedCollection, '_originalNodeList', {
      value: nodeList,
      writable: false,
      enumerable: false,
      configurable: false
    });

    /**
     * Bulk update method for collections
     * Supports both index-based and array-wide updates
     * @param {Object} updates - Updates object
     */
    const updateMethod = function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[DOM Helpers] update() requires an object with updates');
        return this;
      }

      Object.entries(updates).forEach(([key, value]) => {
        // Check if key is numeric (index-based update)
        const numericIndex = parseInt(key);
        
        if (!isNaN(numericIndex) && numericIndex >= 0 && numericIndex < this.length) {
          // Index-based update: apply nested updates to specific element
          const element = this[numericIndex];
          if (element && element.update) {
            element.update(value);
          }
        } else {
          // Property-wide update: apply same property to all elements
          this.forEach((element, index) => {
            if (element && element.update) {
              element.update({ [key]: value });
            }
          });
        }
      });

      return this; // Return for chaining
    };

    // Define methods using Object.defineProperty for non-enumerable properties
    const defineMethod = (name, method) => {
      try {
        Object.defineProperty(enhancedCollection, name, {
          value: method,
          writable: false,
          enumerable: false,
          configurable: true
        });
      } catch (error) {
        // Fallback: direct assignment if defineProperty fails
        enhancedCollection[name] = method;
      }
    };

    // Add update method
    defineMethod('update', updateMethod);

    // Add Array methods if not inherited properly
    defineMethod('forEach', Array.prototype.forEach);
    defineMethod('map', Array.prototype.map);
    defineMethod('filter', Array.prototype.filter);
    defineMethod('find', Array.prototype.find);
    defineMethod('findIndex', Array.prototype.findIndex);
    defineMethod('some', Array.prototype.some);
    defineMethod('every', Array.prototype.every);
    defineMethod('reduce', Array.prototype.reduce);
    defineMethod('slice', Array.prototype.slice);

    // ===== ADD BULK PROPERTY UPDATER METHODS =====

    // Common simple properties
    defineMethod('textContent', createIndexBasedPropertyUpdater('textContent'));
    defineMethod('innerHTML', createIndexBasedPropertyUpdater('innerHTML'));
    defineMethod('innerText', createIndexBasedPropertyUpdater('innerText'));
    defineMethod('value', createIndexBasedPropertyUpdater('value'));
    defineMethod('placeholder', createIndexBasedPropertyUpdater('placeholder'));
    defineMethod('title', createIndexBasedPropertyUpdater('title'));
    defineMethod('disabled', createIndexBasedPropertyUpdater('disabled'));
    defineMethod('checked', createIndexBasedPropertyUpdater('checked'));
    defineMethod('readonly', createIndexBasedPropertyUpdater('readOnly')); // Note: readOnly not readonly
    defineMethod('hidden', createIndexBasedPropertyUpdater('hidden'));
    defineMethod('selected', createIndexBasedPropertyUpdater('selected'));
    
    // Media properties
    defineMethod('src', createIndexBasedPropertyUpdater('src'));
    defineMethod('href', createIndexBasedPropertyUpdater('href'));
    defineMethod('alt', createIndexBasedPropertyUpdater('alt'));
    
    // Complex properties
    defineMethod('style', createIndexBasedStyleUpdater());
    defineMethod('dataset', createIndexBasedDatasetUpdater());
    defineMethod('attrs', createIndexBasedAttributesUpdater());
    defineMethod('classes', createIndexBasedClassListUpdater());
    
    // Generic property updater
    defineMethod('prop', createIndexBasedGenericPropertyUpdater());

    return enhancedCollection;
  }

  // ===== ENHANCED QUERY SELECTOR FUNCTIONS =====

  /**
   * Enhanced querySelector - returns element with .update() method
   * @param {string} selector - CSS selector
   * @param {HTMLElement} [context=document] - Context element for query
   * @returns {HTMLElement|null} - Enhanced element or null
   */
  function querySelector(selector, context = document) {
    if (typeof selector !== 'string') {
      console.warn('[DOM Helpers] querySelector requires a string selector');
      return null;
    }

    try {
      const element = (context || document).querySelector(selector);
      return element ? enhanceElement(element) : null;
    } catch (error) {
      console.error(`[DOM Helpers] querySelector error: ${error.message}`);
      return null;
    }
  }

  /**
   * Enhanced querySelectorAll - returns collection with .update() method and bulk property methods
   * @param {string} selector - CSS selector
   * @param {HTMLElement} [context=document] - Context element for query
   * @returns {Object} - Enhanced NodeList-like collection
   */
  function querySelectorAll(selector, context = document) {
    if (typeof selector !== 'string') {
      console.warn('[DOM Helpers] querySelectorAll requires a string selector');
      return enhanceNodeList([]);
    }

    try {
      const nodeList = (context || document).querySelectorAll(selector);
      return enhanceNodeList(nodeList);
    } catch (error) {
      console.error(`[DOM Helpers] querySelectorAll error: ${error.message}`);
      return enhanceNodeList([]);
    }
  }

  /**
   * Shorthand alias: query
   */
  const query = querySelector;

  /**
   * Shorthand alias: queryAll
   */
  const queryAll = querySelectorAll;

  // ===== EXPORT AND GLOBAL REGISTRATION =====

  const EnhancedQuerySelectors = {
    querySelector,
    querySelectorAll,
    query,
    queryAll,
    enhanceElement,
    enhanceNodeList,
    version: '1.0.0'
  };

  // Register globally
  if (typeof global !== 'undefined') {
    global.querySelector = querySelector;
    global.querySelectorAll = querySelectorAll;
    global.query = query;
    global.queryAll = queryAll;
  }

  // Register with DOMHelpers if available
  if (typeof global.DOMHelpers !== 'undefined') {
    global.DOMHelpers.EnhancedQuerySelectors = EnhancedQuerySelectors;
  }

  // Export for different module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedQuerySelectors;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return EnhancedQuerySelectors;
    });
  } else {
    global.EnhancedQuerySelectors = EnhancedQuerySelectors;
  }

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
/**
 * 08_dh-selector-update-patch
 * 
 * 
 * DOM Helpers - Selector Update Patch
 * Adds index-based access and update capabilities
 * 
 * @version 2.0.0
 * @license MIT
 */

(function(global) {
  'use strict';

  if (typeof global.Collections === 'undefined' && typeof global.Selector === 'undefined') {
    console.warn('[Index Selection] DOM Helpers not found.');
    return;
  }

  /**
   * Enhance element with update method if not already enhanced
   */
  function ensureElementHasUpdate(element) {
    if (!element || element._hasUpdateMethod || element._hasEnhancedUpdateMethod) {
      return element;
    }

    // Check if global enhancement function exists
    if (typeof global.enhanceElementWithUpdate === 'function') {
      return global.enhanceElementWithUpdate(element);
    }

    if (global.EnhancedUpdateUtility && global.EnhancedUpdateUtility.enhanceElementWithUpdate) {
      return global.EnhancedUpdateUtility.enhanceElementWithUpdate(element);
    }

    // Fallback: add basic update method
    addBasicUpdateMethod(element);
    return element;
  }

  /**
   * Add basic update method to element
   */
  function addBasicUpdateMethod(element) {
    if (!element || element._hasUpdateMethod) return element;

    try {
      Object.defineProperty(element, 'update', {
        value: function(updates = {}) {
          if (!updates || typeof updates !== 'object') {
            console.warn('[Index Selection] .update() requires an object');
            return element;
          }

          Object.entries(updates).forEach(([key, value]) => {
            try {
              // Handle style object
              if (key === 'style' && typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([prop, val]) => {
                  if (val !== null && val !== undefined) {
                    element.style[prop] = val;
                  }
                });
                return;
              }

              // Handle classList
              if (key === 'classList' && typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([method, classes]) => {
                  const classList = Array.isArray(classes) ? classes : [classes];
                  switch (method) {
                    case 'add': element.classList.add(...classList); break;
                    case 'remove': element.classList.remove(...classList); break;
                    case 'toggle': classList.forEach(c => element.classList.toggle(c)); break;
                    case 'replace': 
                      if (classes.length === 2) element.classList.replace(classes[0], classes[1]); 
                      break;
                  }
                });
                return;
              }

              // Handle setAttribute
              if (key === 'setAttribute') {
                if (Array.isArray(value) && value.length >= 2) {
                  element.setAttribute(value[0], value[1]);
                } else if (typeof value === 'object' && value !== null) {
                  Object.entries(value).forEach(([attr, val]) => element.setAttribute(attr, val));
                }
                return;
              }

              // Handle removeAttribute
              if (key === 'removeAttribute') {
                const attrs = Array.isArray(value) ? value : [value];
                attrs.forEach(attr => element.removeAttribute(attr));
                return;
              }

              // Handle dataset
              if (key === 'dataset' && typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([k, v]) => element.dataset[k] = v);
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

              // Handle properties
              if (key in element) {
                element[key] = value;
                return;
              }

              // Fallback to setAttribute
              if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                element.setAttribute(key, String(value));
              }
            } catch (err) {
              console.warn(`[Index Selection] Failed to apply ${key}:`, err.message);
            }
          });

          return element;
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
      // Fallback
      element.update = function(updates) { /* same implementation */ };
      element._hasUpdateMethod = true;
    }

    return element;
  }

  /**
   * Create enhanced collection with index access that returns enhanced elements
   */
  function createEnhancedCollectionProxy(collection) {
    if (!collection) return collection;

    // Create proxy that intercepts numeric index access
    return new Proxy(collection, {
      get(target, prop) {
        // Check if accessing by numeric index
        if (!isNaN(prop) && parseInt(prop) >= 0) {
          const index = parseInt(prop);
          let element;

          // Get element from appropriate source
          if (target._originalCollection) {
            element = target._originalCollection[index];
          } else if (target._originalNodeList) {
            element = target._originalNodeList[index];
          } else if (target[index]) {
            element = target[index];
          }

          // Enhance element before returning
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            return ensureElementHasUpdate(element);
          }

          return element;
        }

        // For negative indices via at() method
        if (prop === 'at' && typeof target.at === 'function') {
          return function(index) {
            const element = target.at.call(target, index);
            if (element && element.nodeType === Node.ELEMENT_NODE) {
              return ensureElementHasUpdate(element);
            }
            return element;
          };
        }

        // Return original property
        return target[prop];
      }
    });
  }

  /**
   * Enhanced update method with index selection support
   */
  function createIndexAwareUpdate(collection) {
    return function indexAwareUpdate(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[Index Selection] .update() requires an object');
        return collection;
      }

      // Get elements array
      let elements = [];
      if (collection._originalCollection) {
        elements = Array.from(collection._originalCollection);
      } else if (collection._originalNodeList) {
        elements = Array.from(collection._originalNodeList);
      } else if (collection.length !== undefined) {
        elements = Array.from(collection);
      }

      if (elements.length === 0) {
        console.info('[Index Selection] Collection is empty');
        return collection;
      }

      const length = elements.length;
      const indexUpdates = {};
      const bulkUpdates = {};
      let hasIndexUpdates = false;
      let hasBulkUpdates = false;

      // Separate index-based and bulk updates
      Object.entries(updates).forEach(([key, value]) => {
        if (/^-?\d+$/.test(key)) {
          indexUpdates[key] = value;
          hasIndexUpdates = true;
        } else {
          bulkUpdates[key] = value;
          hasBulkUpdates = true;
        }
      });

      // Apply bulk updates
      if (hasBulkUpdates) {
        elements.forEach(element => {
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            const enhanced = ensureElementHasUpdate(element);
            if (enhanced.update) {
              enhanced.update(bulkUpdates);
            }
          }
        });
      }

      // Apply index-specific updates
      if (hasIndexUpdates) {
        Object.entries(indexUpdates).forEach(([indexStr, updateData]) => {
          let index = parseInt(indexStr, 10);
          if (index < 0) index = length + index;

          if (index >= 0 && index < length) {
            const element = elements[index];
            if (element && element.nodeType === Node.ELEMENT_NODE) {
              const enhanced = ensureElementHasUpdate(element);
              if (enhanced.update) {
                enhanced.update(updateData);
              }
            }
          } else {
            console.warn(`[Index Selection] Index ${indexStr} out of bounds (length: ${length})`);
          }
        });
      }

      return collection;
    };
  }

  /**
   * Wrap collection with both proxy (for index access) and enhanced update
   */
  function wrapCollection(collection) {
    if (!collection || collection._indexSelectionEnhanced) {
      return collection;
    }

    // First, wrap update method
    const newUpdate = createIndexAwareUpdate(collection);
    
    try {
      Object.defineProperty(collection, 'update', {
        value: newUpdate,
        writable: true,
        enumerable: false,
        configurable: true
      });
    } catch (error) {
      collection.update = newUpdate;
    }

    // Mark as enhanced
    try {
      Object.defineProperty(collection, '_indexSelectionEnhanced', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
    } catch (error) {
      collection._indexSelectionEnhanced = true;
    }

    // Then wrap with proxy for enhanced index access
    return createEnhancedCollectionProxy(collection);
  }

  /**
   * Hook Collections helper
   */
  function hookCollections() {
    if (!global.Collections || !global.Collections.helper) return;

    const helper = global.Collections.helper;

    // Hook _enhanceCollection
    if (helper._enhanceCollection) {
      const original = helper._enhanceCollection.bind(helper);
      helper._enhanceCollection = function(htmlCollection, type, value) {
        const collection = original(htmlCollection, type, value);
        return wrapCollection(collection);
      };
    }

    // Hook _enhanceCollectionWithUpdate
    if (helper._enhanceCollectionWithUpdate) {
      const original = helper._enhanceCollectionWithUpdate.bind(helper);
      helper._enhanceCollectionWithUpdate = function(collection) {
        const enhanced = original(collection);
        return wrapCollection(enhanced);
      };
    }
  }

  /**
   * Hook Selector helper
   */
  function hookSelector() {
    if (!global.Selector || !global.Selector.helper) return;

    const helper = global.Selector.helper;

    // Hook _enhanceNodeList
    if (helper._enhanceNodeList) {
      const original = helper._enhanceNodeList.bind(helper);
      helper._enhanceNodeList = function(nodeList, selector) {
        const collection = original(nodeList, selector);
        return wrapCollection(collection);
      };
    }

    // Hook _enhanceCollectionWithUpdate
    if (helper._enhanceCollectionWithUpdate) {
      const original = helper._enhanceCollectionWithUpdate.bind(helper);
      helper._enhanceCollectionWithUpdate = function(collection) {
        const enhanced = original(collection);
        return wrapCollection(enhanced);
      };
    }
  }

  /**
   * Initialize
   */
  function initialize() {
    try {
      hookCollections();
      hookSelector();
      console.log('[Index Selection] v2.0.0 initialized - Individual element access enhanced');
      return true;
    } catch (error) {
      console.error('[Index Selection] Failed to initialize:', error);
      return false;
    }
  }

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Export API
  const IndexSelection = {
    version: '2.0.0',
    
    enhance: wrapCollection,
    
    enhanceElement: ensureElementHasUpdate,
    
    reinitialize: initialize,
    
    isEnhanced: (collection) => {
      return collection && collection._indexSelectionEnhanced === true;
    },
    
    at: (collection, index) => {
      let elements = [];
      if (collection._originalCollection) {
        elements = Array.from(collection._originalCollection);
      } else if (collection._originalNodeList) {
        elements = Array.from(collection._originalNodeList);
      } else if (collection.length !== undefined) {
        elements = Array.from(collection);
      }
      
      if (index < 0) index = elements.length + index;
      const element = elements[index] || null;
      
      return element ? ensureElementHasUpdate(element) : null;
    },

    update: (collection, updates) => {
      const enhanced = wrapCollection(collection);
      return enhanced.update(updates);
    }
  };

  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = IndexSelection;
  } else if (typeof define === 'function' && define.amd) {
    define([], () => IndexSelection);
  } else {
    global.IndexSelection = IndexSelection;
    if (global.DOMHelpers) {
      global.DOMHelpers.IndexSelection = IndexSelection;
    }
  }

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
/**
 * 09_dh-idShortcut.js
 *  DOM Helpers - Id Shortcut Module
 * 
 * Provides a shortcut function Id() that wraps Elements helper
 * Usage: Id('myButton') instead of Elements.myButton or document.getElementById('myButton')
 * 
 * Features:
 * - Automatic .update() method enhancement
 * - Full compatibility with core Elements helper
 * - Intelligent caching integration
 * - TypeScript-friendly design
 * 
 * @version 1.0.0
 * @license MIT
 * @requires dh-core.js (Elements helper)
 */

(function(global) {
  'use strict';

  // Verify Elements helper is available
  if (typeof global.Elements === 'undefined') {
    console.error('[Id Shortcut] Elements helper not found. Please load dh-core.js first.');
    return;
  }

  /**
   * Id Shortcut Function
   * Direct wrapper around Elements helper with enhanced element return
   * 
   * @param {string} id - Element ID to retrieve
   * @returns {HTMLElement|null} Enhanced element with .update() method or null if not found
   * 
   * @example
   * // Basic usage
   * const button = Id('submitBtn');
   * 
   * @example
   * // With chaining
   * Id('myButton').update({
   *   textContent: 'Click Me',
   *   style: { color: 'blue' }
   * });
   * 
   * @example
   * // Null-safe operations
   * const header = Id('header');
   * if (header) {
   *   header.textContent = 'Welcome!';
   * }
   */
  function Id(id) {
    // Validate input
    if (typeof id !== 'string') {
      console.warn('[Id] Invalid ID type. Expected string, got:', typeof id);
      return null;
    }

    // Trim whitespace
    id = id.trim();

    // Check for empty string
    if (id === '') {
      console.warn('[Id] Empty ID string provided');
      return null;
    }

    // Use Elements helper to get the element (leverages caching)
    return global.Elements[id];
  }

  // ===== ADVANCED FEATURES =====

  /**
   * Get multiple elements by ID at once
   * Returns an object with IDs as keys and elements as values
   * 
   * @param {...string} ids - Element IDs to retrieve
   * @returns {Object} Object with ID keys and element values
   * 
   * @example
   * const { header, footer, sidebar } = Id.multiple('header', 'footer', 'sidebar');
   * 
   * @example
   * // With destructuring and null checks
   * const elements = Id.multiple('btn1', 'btn2', 'btn3');
   * if (elements.btn1 && elements.btn2) {
   *   elements.btn1.textContent = 'First';
   *   elements.btn2.textContent = 'Second';
   * }
   */
  Id.multiple = function(...ids) {
    // Use Elements.destructure if available
    if (typeof global.Elements.destructure === 'function') {
      return global.Elements.destructure(...ids);
    }

    // Fallback implementation
    const result = {};
    ids.forEach(id => {
      result[id] = Id(id);
    });
    return result;
  };

  /**
   * Get required elements by ID (throws error if not found)
   * Useful for critical elements that must exist
   * 
   * @param {...string} ids - Element IDs that must exist
   * @returns {Object} Object with ID keys and element values
   * @throws {Error} If any required element is not found
   * 
   * @example
   * try {
   *   const { header, mainContent } = Id.required('header', 'mainContent');
   *   // Safe to use - guaranteed to exist
   *   header.textContent = 'Welcome';
   * } catch (error) {
   *   console.error('Required elements missing:', error.message);
   * }
   */
  Id.required = function(...ids) {
    // Use Elements.getRequired if available
    if (typeof global.Elements.getRequired === 'function') {
      return global.Elements.getRequired(...ids);
    }

    // Fallback implementation
    const elements = Id.multiple(...ids);
    const missing = ids.filter(id => !elements[id]);
    
    if (missing.length > 0) {
      throw new Error(`Required elements not found: ${missing.join(', ')}`);
    }
    
    return elements;
  };

  /**
   * Wait for element to appear in DOM
   * Useful for dynamically loaded content
   * 
   * @param {string} id - Element ID to wait for
   * @param {number} timeout - Maximum wait time in milliseconds (default: 5000)
   * @returns {Promise<HTMLElement>} Promise that resolves with element
   * @throws {Error} If timeout is reached
   * 
   * @example
   * // Wait for dynamic content
   * Id.waitFor('dynamicButton', 3000)
   *   .then(button => {
   *     button.textContent = 'Loaded!';
   *   })
   *   .catch(error => {
   *     console.error('Element never appeared:', error);
   *   });
   * 
   * @example
   * // With async/await
   * async function setupDynamicContent() {
   *   try {
   *     const modal = await Id.waitFor('modal');
   *     modal.style.display = 'block';
   *   } catch (error) {
   *     console.error('Modal not found');
   *   }
   * }
   */
  Id.waitFor = async function(id, timeout = 5000) {
    // Use Elements.waitFor if available
    if (typeof global.Elements.waitFor === 'function') {
      const result = await global.Elements.waitFor(id);
      return result[id];
    }

    // Fallback implementation
    const maxWait = timeout;
    const checkInterval = 100;
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWait) {
      const element = Id(id);
      if (element) {
        return element;
      }
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
    
    throw new Error(`Timeout waiting for element with ID: ${id}`);
  };

  /**
   * Check if element exists by ID
   * 
   * @param {string} id - Element ID to check
   * @returns {boolean} True if element exists
   * 
   * @example
   * if (Id.exists('optionalFeature')) {
   *   Id('optionalFeature').classList.add('active');
   * }
   */
  Id.exists = function(id) {
    // Use Elements.exists if available
    if (typeof global.Elements.exists === 'function') {
      return global.Elements.exists(id);
    }

    // Fallback
    return !!Id(id);
  };

  /**
   * Get element with fallback value
   * 
   * @param {string} id - Element ID to retrieve
   * @param {*} fallback - Fallback value if element not found (default: null)
   * @returns {HTMLElement|*} Element or fallback value
   * 
   * @example
   * const button = Id.get('submitBtn', document.createElement('button'));
   * // Always returns a button element
   */
  Id.get = function(id, fallback = null) {
    // Use Elements.get if available
    if (typeof global.Elements.get === 'function') {
      return global.Elements.get(id, fallback);
    }

    // Fallback
    return Id(id) || fallback;
  };

  /**
   * Bulk update multiple elements by ID
   * 
   * @param {Object} updates - Object where keys are element IDs and values are update objects
   * @returns {Object} Results object with success/failure for each ID
   * 
   * @example
   * Id.update({
   *   header: { textContent: 'New Title', style: { color: 'red' } },
   *   footer: { textContent: 'Copyright 2024' },
   *   sidebar: { classList: { add: 'active' } }
   * });
   */
  Id.update = function(updates = {}) {
    // Use Elements.update if available
    if (typeof global.Elements.update === 'function') {
      return global.Elements.update(updates);
    }

    // Fallback implementation
    const results = {};
    Object.entries(updates).forEach(([id, updateData]) => {
      const element = Id(id);
      if (element && typeof element.update === 'function') {
        element.update(updateData);
        results[id] = { success: true };
      } else {
        results[id] = { success: false, error: 'Element not found or no update method' };
      }
    });
    return results;
  };

  /**
   * Set property on element by ID
   * 
   * @param {string} id - Element ID
   * @param {string} property - Property name
   * @param {*} value - Property value
   * @returns {boolean} True if successful
   * 
   * @example
   * Id.setProperty('myInput', 'value', 'Hello World');
   * Id.setProperty('myDiv', 'textContent', 'Updated text');
   */
  Id.setProperty = function(id, property, value) {
    // Use Elements.setProperty if available
    if (typeof global.Elements.setProperty === 'function') {
      return global.Elements.setProperty(id, property, value);
    }

    // Fallback
    const element = Id(id);
    if (element && property in element) {
      element[property] = value;
      return true;
    }
    return false;
  };

  /**
   * Get property from element by ID
   * 
   * @param {string} id - Element ID
   * @param {string} property - Property name
   * @param {*} fallback - Fallback value if property doesn't exist
   * @returns {*} Property value or fallback
   * 
   * @example
   * const value = Id.getProperty('myInput', 'value', '');
   * const text = Id.getProperty('myDiv', 'textContent', 'default');
   */
  Id.getProperty = function(id, property, fallback = undefined) {
    // Use Elements.getProperty if available
    if (typeof global.Elements.getProperty === 'function') {
      return global.Elements.getProperty(id, property, fallback);
    }

    // Fallback
    const element = Id(id);
    if (element && property in element) {
      return element[property];
    }
    return fallback;
  };

  /**
   * Set attribute on element by ID
   * 
   * @param {string} id - Element ID
   * @param {string} attribute - Attribute name
   * @param {string} value - Attribute value
   * @returns {boolean} True if successful
   * 
   * @example
   * Id.setAttribute('myImage', 'src', 'image.png');
   * Id.setAttribute('myLink', 'href', 'https://example.com');
   */
  Id.setAttribute = function(id, attribute, value) {
    // Use Elements.setAttribute if available
    if (typeof global.Elements.setAttribute === 'function') {
      return global.Elements.setAttribute(id, attribute, value);
    }

    // Fallback
    const element = Id(id);
    if (element) {
      element.setAttribute(attribute, value);
      return true;
    }
    return false;
  };

  /**
   * Get attribute from element by ID
   * 
   * @param {string} id - Element ID
   * @param {string} attribute - Attribute name
   * @param {*} fallback - Fallback value if attribute doesn't exist
   * @returns {string|*} Attribute value or fallback
   * 
   * @example
   * const src = Id.getAttribute('myImage', 'src', 'default.png');
   * const href = Id.getAttribute('myLink', 'href', '#');
   */
  Id.getAttribute = function(id, attribute, fallback = null) {
    // Use Elements.getAttribute if available
    if (typeof global.Elements.getAttribute === 'function') {
      return global.Elements.getAttribute(id, attribute, fallback);
    }

    // Fallback
    const element = Id(id);
    if (element) {
      return element.getAttribute(attribute) || fallback;
    }
    return fallback;
  };

  /**
   * Access to underlying Elements helper
   * Useful for advanced features and statistics
   */
  Id.Elements = global.Elements;

  /**
   * Get statistics from Elements helper
   * 
   * @returns {Object} Statistics object with cache hits, misses, etc.
   * 
   * @example
   * const stats = Id.stats();
   * console.log('Cache hit rate:', stats.hitRate);
   */
  Id.stats = function() {
    if (typeof global.Elements.stats === 'function') {
      return global.Elements.stats();
    }
    return {};
  };

  /**
   * Check if element is cached
   * 
   * @param {string} id - Element ID to check
   * @returns {boolean} True if element is in cache
   * 
   * @example
   * if (Id.isCached('myButton')) {
   *   console.log('Element is in cache - fast access!');
   * }
   */
  Id.isCached = function(id) {
    if (typeof global.Elements.isCached === 'function') {
      return global.Elements.isCached(id);
    }
    return false;
  };

  /**
   * Clear Elements cache
   * Useful for testing or after major DOM changes
   * 
   * @example
   * // After removing many elements
   * Id.clearCache();
   */
  Id.clearCache = function() {
    if (typeof global.Elements.clear === 'function') {
      global.Elements.clear();
    }
  };

  // ===== EXPORT =====

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    // Node.js/CommonJS
    module.exports = Id;
  } else if (typeof define === 'function' && define.amd) {
    // AMD/RequireJS
    define([], function() {
      return Id;
    });
  } else {
    // Browser globals
    global.Id = Id;
  }

  // Add to DOMHelpers if available
  if (typeof global.DOMHelpers !== 'undefined') {
    global.DOMHelpers.Id = Id;
  }

  // Development mode logging
  if (typeof console !== 'undefined' && console.log) {
    const isDevelopment = (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') ||
                          (typeof location !== 'undefined' && location.hostname === 'localhost');
    
    if (isDevelopment) {
      console.log('[Id Shortcut] Module loaded successfully. Usage: Id("elementId")');
    }
  }

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
/**
 * 10_dh-array-based-updates.js (UPDATED FOR BUNDLED ENHANCERS)
 * 
 * DOM Helpers - Array-Based Update Core
 * More aggressive patching for compatibility with bundled enhancers
 * 
 * @version 1.1.0 (FIXED)
 * @license MIT
 */

(function(global) {
  'use strict';

  console.log('[Array Updates] v1.1.0 Loading...');

  // ===== CORE ARRAY DISTRIBUTION LOGIC =====

  function isDistributableArray(value) {
    return Array.isArray(value) && value.length > 0;
  }

  function getValueForIndex(value, elementIndex, totalElements) {
    if (!Array.isArray(value)) return value;
    if (elementIndex < value.length) return value[elementIndex];
    return value[value.length - 1];
  }

  function processUpdatesForElement(updates, elementIndex, totalElements) {
    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
      return updates;
    }

    const processed = {};

    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'style' || key === 'dataset') {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          processed[key] = processUpdatesForElement(value, elementIndex, totalElements);
        } else if (Array.isArray(value)) {
          processed[key] = getValueForIndex(value, elementIndex, totalElements);
        } else {
          processed[key] = value;
        }
      } else if (key === 'classList') {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          const processedClassList = {};
          Object.entries(value).forEach(([method, classes]) => {
            processedClassList[method] = getValueForIndex(classes, elementIndex, totalElements);
          });
          processed[key] = processedClassList;
        } else {
          processed[key] = value;
        }
      } else {
        processed[key] = getValueForIndex(value, elementIndex, totalElements);
      }
    });

    return processed;
  }

  function containsArrayValues(obj) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
    
    for (const value of Object.values(obj)) {
      if (Array.isArray(value)) return true;
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (containsArrayValues(value)) return true;
      }
    }
    return false;
  }

  function applyUpdatesToElement(element, updates) {
    Object.entries(updates).forEach(([key, value]) => {
      try {
        if (key === 'style' && typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([prop, val]) => {
            if (val !== null && val !== undefined) {
              element.style[prop] = val;
            }
          });
        } else if (key === 'classList' && typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([method, classes]) => {
            const classList = Array.isArray(classes) ? classes : [classes];
            switch (method) {
              case 'add': element.classList.add(...classList); break;
              case 'remove': element.classList.remove(...classList); break;
              case 'toggle': classList.forEach(c => element.classList.toggle(c)); break;
            }
          });
        } else if (key === 'dataset' && typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([k, v]) => element.dataset[k] = v);
        } else if (key in element) {
          element[key] = value;
        } else {
          element.setAttribute(key, value);
        }
      } catch (error) {
        console.warn(`[Array Updates] Failed to apply ${key}:`, error.message);
      }
    });
  }

  function applyArrayBasedUpdates(collection, updates) {
    let elements = [];
    
    try {
      elements = Array.from(collection);
    } catch (e) {
      for (let i = 0; i < collection.length; i++) {
        elements.push(collection[i]);
      }
    }

    if (elements.length === 0) return collection;

    const totalElements = elements.length;
    const hasArrays = containsArrayValues(updates);

    if (!hasArrays) {
      // No arrays - bulk update
      elements.forEach(element => {
        if (element && element.nodeType === Node.ELEMENT_NODE) {
          applyUpdatesToElement(element, updates);
        }
      });
      return collection;
    }

    console.log(`[Array Updates] Distributing across ${totalElements} elements`);

    elements.forEach((element, index) => {
      if (!element || element.nodeType !== Node.ELEMENT_NODE) return;
      
      const elementUpdates = processUpdatesForElement(updates, index, totalElements);
      applyUpdatesToElement(element, elementUpdates);
    });

    return collection;
  }

  // ===== ENHANCED UPDATE METHOD =====

  function createEnhancedUpdateMethod(originalUpdate) {
    return function enhancedUpdate(updates = {}) {
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

      if (hasNumericIndices) {
        console.log('[Array Updates] Numeric indices detected, using index-based');
        if (originalUpdate && typeof originalUpdate === 'function') {
          return originalUpdate.call(this, updates);
        }
      }

      // Check for array values
      const hasArrayValues = containsArrayValues(updates);

      if (hasArrayValues) {
        return applyArrayBasedUpdates(this, updates);
      }

      // Bulk update
      if (originalUpdate && typeof originalUpdate === 'function') {
        return originalUpdate.call(this, updates);
      }

      if (this.forEach && typeof this.forEach === 'function') {
        this.forEach(element => {
          if (element && element.update && typeof element.update === 'function') {
            element.update(updates);
          }
        });
      }

      return this;
    };
  }

  function enhanceCollectionWithArrayUpdates(collection) {
    if (!collection) return collection;
    
    // ALWAYS re-enhance to override bundled enhancers
    const originalUpdate = collection.update;
    const enhancedUpdate = createEnhancedUpdateMethod(originalUpdate);

    try {
      Object.defineProperty(collection, 'update', {
        value: enhancedUpdate,
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
      collection.update = enhancedUpdate;
      collection._hasArrayUpdateSupport = true;
    }

    return collection;
  }

  // ===== AGGRESSIVE PATCHING =====

  function patchWithRetry(patchFn, name) {
    // Try immediately
    const immediate = patchFn();
    
    // Also try after DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        console.log(`[Array Updates] Re-patching ${name} after DOMContentLoaded`);
        patchFn();
      });
    }
    
    // And after a short delay (for dynamic loading)
    setTimeout(() => {
      console.log(`[Array Updates] Re-patching ${name} after delay`);
      patchFn();
    }, 100);
    
    return immediate;
  }

  function patchSelectorHelper() {
    if (!global.Selector || !global.Selector.queryAll) return 0;

    const originalQA = global.Selector.queryAll;
    global.Selector.queryAll = function(...args) {
      const result = originalQA.apply(this, args);
      return enhanceCollectionWithArrayUpdates(result);
    };
    
    console.log('[Array Updates] ✓ Patched Selector.queryAll');
    return 1;
  }

  function patchGlobalQueryFunctions() {
    let count = 0;

    if (global.querySelectorAll) {
      const originalQSA = global.querySelectorAll;
      global.querySelectorAll = function(selector, context) {
        const result = originalQSA.call(this, selector, context);
        return enhanceCollectionWithArrayUpdates(result);
      };
      count++;
      console.log('[Array Updates] ✓ Patched querySelectorAll');
    }

    if (global.queryAll) {
      const originalQA = global.queryAll;
      global.queryAll = function(selector, context) {
        const result = originalQA.call(this, selector, context);
        return enhanceCollectionWithArrayUpdates(result);
      };
      count++;
      console.log('[Array Updates] ✓ Patched queryAll');
    }

    return count;
  }

  function patchCollectionsShortcuts() {
    if (!global.Collections) return 0;
    let count = 0;

    ['ClassName', 'TagName', 'Name'].forEach(type => {
      if (global.Collections[type]) {
        const original = global.Collections[type];
        global.Collections[type] = new Proxy(original, {
          get(target, prop) {
            const result = Reflect.get(target, prop);
            if (result && typeof result === 'object' && 'length' in result) {
              return enhanceCollectionWithArrayUpdates(result);
            }
            return result;
          },
          apply(target, thisArg, args) {
            const result = Reflect.apply(target, thisArg, args);
            if (result && typeof result === 'object' && 'length' in result) {
              return enhanceCollectionWithArrayUpdates(result);
            }
            return result;
          }
        });
        count++;
        console.log(`[Array Updates] ✓ Patched Collections.${type}`);
      }
    });

    return count;
  }

  function patchGlobalShortcuts() {
    let count = 0;

    ['ClassName', 'TagName', 'Name'].forEach(type => {
      if (global[type]) {
        const original = global[type];
        global[type] = new Proxy(original, {
          get(target, prop) {
            const result = Reflect.get(target, prop);
            if (result && typeof result === 'object' && 'length' in result) {
              return enhanceCollectionWithArrayUpdates(result);
            }
            return result;
          },
          apply(target, thisArg, args) {
            const result = Reflect.apply(target, thisArg, args);
            if (result && typeof result === 'object' && 'length' in result) {
              return enhanceCollectionWithArrayUpdates(result);
            }
            return result;
          }
        });
        count++;
        console.log(`[Array Updates] ✓ Patched ${type}`);
      }
    });

    return count;
  }

  // ===== INITIALIZE WITH RETRY =====

  function initialize() {
    console.log('[Array Updates] Initializing with retry logic...');
    
    let totalPatches = 0;
    
    // Patch with retry for each system
    totalPatches += patchWithRetry(patchSelectorHelper, 'Selector');
    totalPatches += patchWithRetry(patchGlobalQueryFunctions, 'Global Query');
    totalPatches += patchWithRetry(patchCollectionsShortcuts, 'Collections');
    totalPatches += patchWithRetry(patchGlobalShortcuts, 'Global Shortcuts');

    console.log(`[Array Updates] ✓✓✓ Initialization complete - ${totalPatches} systems patched`);
    console.log('[Array Updates] Usage: collection.update({ textContent: ["A", "B", "C"] })');
    
    return totalPatches > 0;
  }

  // ===== EXPORT MODULE =====

  const ArrayBasedUpdates = {
    version: '1.1.0-fixed',
    applyArrayBasedUpdates,
    processUpdatesForElement,
    getValueForIndex,
    isDistributableArray,
    containsArrayValues,
    enhanceCollectionWithArrayUpdates,
    createEnhancedUpdateMethod,
    initialize,
    reinitialize: initialize,
    
    hasSupport(collection) {
      return !!(collection && collection._hasArrayUpdateSupport);
    },
    
    // Manual enhance function
    enhance(collection) {
      return enhanceCollectionWithArrayUpdates(collection);
    }
  };

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

  // Initialize immediately AND with retry
  initialize();

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
