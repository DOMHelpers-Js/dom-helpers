/**
 * collection-shortcuts.js
 * 
 * DOM Helpers - Collection Shortcuts with Index Access & Property Shortcuts
 * Provides ClassName, TagName, Name, Id globally with comprehensive update capabilities
 * 
 * Features:
 * - ClassName.button / ClassName('button') - All buttons
 * - ClassName.button[0] - First button (auto-enhanced)
 * - ClassName.button[-1] - Last button (negative indices)
 * - ClassName.button.update() - Update all with bulk/index/mixed modes
 * - ClassName.button.textContent({0: "First", 1: "Second"}) - Property shortcuts
 * - Id.myButton / Id('myButton') - Direct element access by ID
 * - Selector.queryAll('.btn') - Enhanced with property shortcuts
 * 
 * REQUIRES: core-update-engine.js (for CoreUpdateEngine)
 * 
 * @version 2.2.0
 * @license MIT
 */

(function(global) {
  'use strict';

  console.log('[Collection Shortcuts] v2.2.0 Loading...');

  // ===== DEPENDENCY CHECK =====
  if (typeof global.Collections === 'undefined') {
    console.error('[Collection Shortcuts] Collections helper not found. Load DOM Helpers core first.');
    return;
  }

  const hasCoreEngine = typeof global.CoreUpdateEngine !== 'undefined' || 
                        typeof global.EnhancedUpdateUtility !== 'undefined';
  
  if (!hasCoreEngine) {
    console.warn('[Collection Shortcuts] CoreUpdateEngine not found. Update features will be limited.');
  }

  // Get core engine functions
  const enhanceElement = hasCoreEngine ? 
    (global.CoreUpdateEngine?.enhanceElement || global.EnhancedUpdateUtility?.enhanceElement) : 
    (el => el);
  
  const enhanceCollection = hasCoreEngine ?
    (global.CoreUpdateEngine?.enhanceCollection || global.EnhancedUpdateUtility?.enhanceCollection) :
    (col => col);

  // ===== PROPERTY SHORTCUT CREATORS =====

  /**
   * Create index-based property updater for collections
   */
  function createIndexBasedPropertyUpdater(propertyName) {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn(`[Collection Shortcuts] ${propertyName}() requires an object with indices as keys`);
        return this;
      }

      // Get elements
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

      Object.entries(updates).forEach(([index, value]) => {
        try {
          const numIndex = parseInt(index, 10);
          if (isNaN(numIndex)) return;

          const element = elements[numIndex];
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            element[propertyName] = value;
          }
        } catch (error) {
          console.warn(`[Collection Shortcuts] Error updating ${propertyName} at index ${index}:`, error.message);
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
        console.warn('[Collection Shortcuts] style() requires an object');
        return this;
      }

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
          console.warn(`[Collection Shortcuts] Error updating style at index ${index}:`, error.message);
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
        console.warn('[Collection Shortcuts] dataset() requires an object');
        return this;
      }

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

      Object.entries(updates).forEach(([index, dataObj]) => {
        try {
          const numIndex = parseInt(index, 10);
          if (isNaN(numIndex)) return;

          const element = elements[numIndex];
          if (element && element.nodeType === Node.ELEMENT_NODE && typeof dataObj === 'object') {
            Object.entries(dataObj).forEach(([key, val]) => {
              element.dataset[key] = val;
            });
          }
        } catch (error) {
          console.warn(`[Collection Shortcuts] Error updating dataset at index ${index}:`, error.message);
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
        console.warn('[Collection Shortcuts] attrs() requires an object');
        return this;
      }

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

      Object.entries(updates).forEach(([index, attrsObj]) => {
        try {
          const numIndex = parseInt(index, 10);
          if (isNaN(numIndex)) return;

          const element = elements[numIndex];
          if (element && element.nodeType === Node.ELEMENT_NODE && typeof attrsObj === 'object') {
            Object.entries(attrsObj).forEach(([attrName, attrValue]) => {
              if (attrValue === null || attrValue === false) {
                element.removeAttribute(attrName);
              } else {
                element.setAttribute(attrName, String(attrValue));
              }
            });
          }
        } catch (error) {
          console.warn(`[Collection Shortcuts] Error updating attrs at index ${index}:`, error.message);
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
        console.warn('[Collection Shortcuts] classes() requires an object');
        return this;
      }

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
              Object.entries(classConfig).forEach(([method, classes]) => {
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
              });
            }
          }
        } catch (error) {
          console.warn(`[Collection Shortcuts] Error updating classes at index ${index}:`, error.message);
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
        console.warn('[Collection Shortcuts] prop() requires a property name as first argument');
        return this;
      }

      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[Collection Shortcuts] prop() requires an object with indices as keys');
        return this;
      }

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
                  console.warn(`[Collection Shortcuts] Invalid property path '${propertyPath}' at index ${index}`);
                  return;
                }
              }
              obj[pathParts[pathParts.length - 1]] = value;
            } else {
              // Direct property assignment
              if (propertyPath in element) {
                element[propertyPath] = value;
              } else {
                console.warn(`[Collection Shortcuts] Property '${propertyPath}' not found on element at index ${index}`);
              }
            }
          }
        } catch (error) {
          console.warn(`[Collection Shortcuts] Error updating prop '${propertyPath}' at index ${index}:`, error.message);
        }
      });

      return this;
    };
  }

  /**
   * Add property shortcuts to collection
   */
  function addPropertyShortcutsToCollection(collection) {
    if (!collection || collection._hasPropertyShortcuts) {
      return collection;
    }

    const shortcuts = {
      // Basic properties
      textContent: createIndexBasedPropertyUpdater('textContent'),
      innerHTML: createIndexBasedPropertyUpdater('innerHTML'),
      innerText: createIndexBasedPropertyUpdater('innerText'),
      value: createIndexBasedPropertyUpdater('value'),
      placeholder: createIndexBasedPropertyUpdater('placeholder'),
      title: createIndexBasedPropertyUpdater('title'),
      disabled: createIndexBasedPropertyUpdater('disabled'),
      checked: createIndexBasedPropertyUpdater('checked'),
      readonly: createIndexBasedPropertyUpdater('readOnly'), // Note: readOnly not readonly
      hidden: createIndexBasedPropertyUpdater('hidden'),
      selected: createIndexBasedPropertyUpdater('selected'),
      
      // Media properties
      src: createIndexBasedPropertyUpdater('src'),
      href: createIndexBasedPropertyUpdater('href'),
      alt: createIndexBasedPropertyUpdater('alt'),
      
      // Complex properties
      style: createIndexBasedStyleUpdater(),
      dataset: createIndexBasedDatasetUpdater(),
      attrs: createIndexBasedAttributesUpdater(),
      classes: createIndexBasedClassListUpdater(),
      
      // Generic property updater
      prop: createIndexBasedGenericPropertyUpdater()
    };

    Object.entries(shortcuts).forEach(([name, method]) => {
      try {
        Object.defineProperty(collection, name, {
          value: method,
          writable: false,
          enumerable: false,
          configurable: true
        });
      } catch (e) {
        // Fallback if defineProperty fails
        collection[name] = method;
      }
    });

    // Mark as having property shortcuts
    try {
      Object.defineProperty(collection, '_hasPropertyShortcuts', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
    } catch (e) {
      collection._hasPropertyShortcuts = true;
    }

    return collection;
  }

  // ===== ENHANCED COLLECTION WRAPPER =====

  /**
   * Create enhanced collection with index access
   * Returns a Proxy that intercepts numeric indices and auto-enhances elements
   * 
   * @param {Object} collection - Original collection from Collections helper
   * @returns {Proxy} - Enhanced collection with index support
   */
  function createEnhancedCollectionWrapper(collection) {
    if (!collection) return collection;

    // If already enhanced, return as-is
    if (collection._isEnhancedWrapper) {
      return collection;
    }

    // Add property shortcuts before creating proxy
    addPropertyShortcutsToCollection(collection);

    // Create proxy for index access
    const proxy = new Proxy(collection, {
      get(target, prop) {
        // Handle symbols FIRST (for iterators, Array.from, spread operator)
        if (typeof prop === 'symbol') {
          return target[prop];
        }

        // Pass through special properties
        if (prop === 'constructor' || 
            prop === 'prototype' ||
            prop === 'length' ||
            prop === 'toString' ||
            prop === 'valueOf' ||
            prop === 'toLocaleString' ||
            prop === '_isEnhancedWrapper' ||
            prop === '_originalCollection' ||
            prop === '_originalNodeList' ||
            prop === '_hasCoreUpdateSupport' ||
            prop === '_hasIndexedUpdateSupport' ||
            prop === '_hasPropertyShortcuts' ||
            prop === 'update' ||
            prop === 'item' ||
            prop === 'entries' ||
            prop === 'keys' ||
            prop === 'values' ||
            prop === 'forEach' ||
            prop === 'map' ||
            prop === 'filter' ||
            prop === 'namedItem' ||
            // Property shortcuts
            prop === 'textContent' ||
            prop === 'innerHTML' ||
            prop === 'innerText' ||
            prop === 'value' ||
            prop === 'placeholder' ||
            prop === 'title' ||
            prop === 'disabled' ||
            prop === 'checked' ||
            prop === 'readonly' ||
            prop === 'hidden' ||
            prop === 'selected' ||
            prop === 'src' ||
            prop === 'href' ||
            prop === 'alt' ||
            prop === 'style' ||
            prop === 'dataset' ||
            prop === 'attrs' ||
            prop === 'classes' ||
            prop === 'prop') {
          return target[prop];
        }

        // Handle numeric indices
        if (!isNaN(prop)) {
          const index = parseInt(prop, 10);
          let element;

          // Handle negative indices
          if (index < 0) {
            const positiveIndex = target.length + index;
            element = target[positiveIndex];
          } else {
            element = target[index];
          }

          // Auto-enhance element before returning
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            return enhanceElement(element);
          }

          return element;
        }

        // Return original property
        return target[prop];
      },

      set(target, prop, value) {
        // Handle symbols
        if (typeof prop === 'symbol') {
          return false;
        }

        // Numeric indices - can't set in live collection
        if (!isNaN(prop)) {
          console.warn('[Collection Shortcuts] Cannot set element at index in live collection');
          return false;
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

    // Mark as enhanced
    try {
      Object.defineProperty(collection, '_isEnhancedWrapper', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
    } catch (e) {
      collection._isEnhancedWrapper = true;
    }

    return proxy;
  }

  // ===== GLOBAL COLLECTION PROXY =====

  /**
   * Create global proxy for collection type (ClassName, TagName, Name)
   * 
   * @param {string} type - Collection type
   * @returns {Proxy} - Global proxy with property access and function calls
   */
  function createGlobalCollectionProxy(type) {
    const collectionHelper = global.Collections[type];
    
    if (!collectionHelper) {
      console.warn(`[Collection Shortcuts] Collections.${type} not found`);
      return null;
    }

    // Base function for function-style calls
    const baseFunction = function(value) {
      let collection = collectionHelper(value);
      
      // Enhance collection with update support
      collection = enhanceCollection(collection);
      
      // Add property shortcuts
      addPropertyShortcutsToCollection(collection);
      
      // Wrap for index access
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
            prop === 'name' ||
            prop === 'toString' ||
            prop === 'valueOf') {
          return target[prop];
        }

        // Get collection from Collections helper
        let collection = collectionHelper[prop];

        // Enhance collection
        collection = enhanceCollection(collection);

        // Add property shortcuts
        addPropertyShortcutsToCollection(collection);

        // Return enhanced wrapper with index support
        return createEnhancedCollectionWrapper(collection);
      },

      /**
       * Handle function calls (e.g., ClassName('button'))
       */
      apply: (target, thisArg, args) => {
        let collection = collectionHelper(...args);
        
        // Enhance collection
        collection = enhanceCollection(collection);
        
        // Add property shortcuts
        addPropertyShortcutsToCollection(collection);
        
        // Return enhanced wrapper
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

  // ===== ID SHORTCUT IMPLEMENTATION =====

  /**
   * Create Id shortcut proxy for direct element access by ID
   * Usage: 
   *   - Id.myButton (property access)
   *   - Id('myButton') (function call)
   *   - Id.update({...}) (bulk update)
   */
  function createIdShortcutProxy() {
    const cache = new Map();

    // Base function for function-style calls
    const baseFunction = function(id) {
      if (typeof id !== 'string') {
        console.warn('[Id Shortcut] Id() requires a string ID');
        return null;
      }

      // Check cache first
      if (cache.has(id)) {
        const element = cache.get(id);
        // Verify element still exists in DOM
        if (element && document.body.contains(element)) {
          return element;
        }
        // Remove stale cache entry
        cache.delete(id);
      }

      // Get element by ID
      const element = document.getElementById(id);
      
      if (!element) {
        console.warn(`[Id Shortcut] Element with id="${id}" not found`);
        return null;
      }

      // Enhance element with update support
      const enhanced = enhanceElement(element);
      
      // Cache the enhanced element
      cache.set(id, enhanced);
      
      return enhanced;
    };

    // Create proxy for both function calls and property access
    const idProxy = new Proxy(baseFunction, {
      /**
       * Handle property access (e.g., Id.myButton)
       */
      get: (target, prop) => {
        // Handle function intrinsics and special methods
        if (typeof prop === 'symbol' || 
            prop === 'constructor' || 
            prop === 'prototype' ||
            prop === 'apply' ||
            prop === 'call' ||
            prop === 'bind' ||
            prop === 'length' ||
            prop === 'name' ||
            prop === 'toString' ||
            prop === 'valueOf') {
          return target[prop];
        }

        // Special methods
        if (prop === 'update') {
          return target.update;
        }
        if (prop === 'clearCache') {
          return target.clearCache;
        }
        if (prop === 'cacheInfo') {
          return target.cacheInfo;
        }

        // Check cache first
        if (cache.has(prop)) {
          const element = cache.get(prop);
          // Verify element still exists in DOM
          if (element && document.body.contains(element)) {
            return element;
          }
          // Remove stale cache entry
          cache.delete(prop);
        }

        // Get element by ID
        const element = document.getElementById(prop);
        
        if (!element) {
          console.warn(`[Id Shortcut] Element with id="${prop}" not found`);
          return null;
        }

        // Enhance element with update support
        const enhanced = enhanceElement(element);
        
        // Cache the enhanced element
        cache.set(prop, enhanced);
        
        return enhanced;
      },

      /**
       * Handle function calls (e.g., Id('myButton'))
       */
      apply: (target, thisArg, args) => {
        if (args.length === 0) {
          console.warn('[Id Shortcut] Id() requires an ID string argument');
          return null;
        }

        const id = args[0];
        
        if (typeof id !== 'string') {
          console.warn('[Id Shortcut] Id() requires a string ID');
          return null;
        }

        // Check cache first
        if (cache.has(id)) {
          const element = cache.get(id);
          // Verify element still exists in DOM
          if (element && document.body.contains(element)) {
            return element;
          }
          // Remove stale cache entry
          cache.delete(id);
        }

        // Get element by ID
        const element = document.getElementById(id);
        
        if (!element) {
          console.warn(`[Id Shortcut] Element with id="${id}" not found`);
          return null;
        }

        // Enhance element with update support
        const enhanced = enhanceElement(element);
        
        // Cache the enhanced element
        cache.set(id, enhanced);
        
        return enhanced;
      },

      /**
       * Handle setting properties (prevent direct assignment)
       */
      set: (target, prop, value) => {
        console.warn(`[Id Shortcut] Cannot set Id.${prop} directly. Use Id.${prop}.update() instead.`);
        return false;
      },

      /**
       * Handle 'in' operator (e.g., 'myButton' in Id)
       */
      has: (target, prop) => {
        return document.getElementById(prop) !== null;
      },

      /**
       * Handle Object.keys(), for...in
       */
      ownKeys: (target) => {
        // Return all element IDs in the document
        const ids = [];
        document.querySelectorAll('[id]').forEach(el => {
          if (el.id) ids.push(el.id);
        });
        return ids;
      },

      /**
       * Handle Object.getOwnPropertyDescriptor()
       */
      getOwnPropertyDescriptor: (target, prop) => {
        if (document.getElementById(prop)) {
          return {
            configurable: true,
            enumerable: true,
            value: this.get(target, prop),
            writable: false
          };
        }
        return undefined;
      }
    });

    // Add bulk update method
    baseFunction.update = function(updates) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[Id Shortcut] Id.update() requires an object with IDs as keys');
        return this;
      }

      Object.entries(updates).forEach(([id, updateObj]) => {
        const element = document.getElementById(id);
        if (element) {
          const enhanced = enhanceElement(element);
          if (typeof enhanced.update === 'function') {
            enhanced.update(updateObj);
          } else {
            console.warn(`[Id Shortcut] Element "${id}" cannot be updated (no update method)`);
          }
        } else {
          console.warn(`[Id Shortcut] Element with id="${id}" not found`);
        }
      });

      return this;
    };

    // Add clear cache method
    baseFunction.clearCache = function() {
      cache.clear();
      console.log('[Id Shortcut] Cache cleared');
      return this;
    };

    // Add cache info method (for debugging)
    baseFunction.cacheInfo = function() {
      return {
        size: cache.size,
        ids: Array.from(cache.keys())
      };
    };

    return idProxy;
  }

  // ===== CREATE GLOBAL SHORTCUTS =====

  const ClassName = createGlobalCollectionProxy('ClassName');
  const TagName = createGlobalCollectionProxy('TagName');
  const Name = createGlobalCollectionProxy('Name');
  const Id = createIdShortcutProxy();

  // ===== EXPORT TO GLOBAL SCOPE =====

  if (ClassName) {
    global.ClassName = ClassName;
    console.log('[Collection Shortcuts] ✓ ClassName available globally');
  }
  
  if (TagName) {
    global.TagName = TagName;
    console.log('[Collection Shortcuts] ✓ TagName available globally');
  }
  
  if (Name) {
    global.Name = Name;
    console.log('[Collection Shortcuts] ✓ Name available globally');
  }

  if (Id) {
    global.Id = Id;
    console.log('[Collection Shortcuts] ✓ Id available globally');
  }

  // ===== INTEGRATE WITH DOM HELPERS =====

  if (typeof global.DOMHelpers !== 'undefined') {
    if (ClassName) global.DOMHelpers.ClassName = ClassName;
    if (TagName) global.DOMHelpers.TagName = TagName;
    if (Name) global.DOMHelpers.Name = Name;
    if (Id) global.DOMHelpers.Id = Id;
  }

  // Also update DOMHelpers.Collections shortcuts if they exist
  if (global.DOMHelpers?.Collections) {
    if (ClassName) global.DOMHelpers.Collections.ClassName = ClassName;
    if (TagName) global.DOMHelpers.Collections.TagName = TagName;
    if (Name) global.DOMHelpers.Collections.Name = Name;
  }

  // ===== EXPORT MODULE =====

  const GlobalCollectionShortcuts = {
    ClassName,
    TagName,
    Name,
    Id,
    version: '2.2.0',
    createEnhancedCollectionWrapper,
    createGlobalCollectionProxy,
    createIdShortcutProxy,
    addPropertyShortcutsToCollection,
    // Export creators for external use
    createIndexBasedPropertyUpdater,
    createIndexBasedStyleUpdater,
    createIndexBasedDatasetUpdater,
    createIndexBasedAttributesUpdater,
    createIndexBasedClassListUpdater,
    createIndexBasedGenericPropertyUpdater
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

  // Add to DOMHelpers
  if (typeof global.DOMHelpers !== 'undefined') {
    global.DOMHelpers.GlobalCollectionShortcuts = GlobalCollectionShortcuts;
  }

  // ===== PATCH SELECTOR.QUERYALL & SELECTOR.QUERY =====

  /**
   * Patch Selector.queryAll to add property shortcuts to returned collections
   */
  function patchSelectorQueryAll() {
    if (typeof global.Selector === 'undefined' || !global.Selector.queryAll) {
      return false;
    }

    const originalQueryAll = global.Selector.queryAll;
    
    global.Selector.queryAll = function(selector) {
      // Call original method
      const collection = originalQueryAll.call(this, selector);
      
      // Add property shortcuts if not already added
      if (collection && !collection._hasPropertyShortcuts) {
        addPropertyShortcutsToCollection(collection);
      }
      
      return collection;
    };
    
    console.log('[Collection Shortcuts] ✓ Patched Selector.queryAll');
    return true;
  }

  /**
   * Patch Selector.query for consistency (single element enhancement)
   */
  function patchSelectorQuery() {
    if (typeof global.Selector === 'undefined' || !global.Selector.query) {
      return false;
    }

    const originalQuery = global.Selector.query;
    
    global.Selector.query = function(selector) {
      // Call original method
      const element = originalQuery.call(this, selector);
      
      // Enhance element if not already enhanced
      if (element && element.nodeType === Node.ELEMENT_NODE) {
        return enhanceElement(element);
      }
      
      return element;
    };
    
    console.log('[Collection Shortcuts] ✓ Patched Selector.query');
    return true;
  }

  // Apply patches (with retry logic for load order)
  const applyPatches = () => {
    const patchedQueryAll = patchSelectorQueryAll();
    const patchedQuery = patchSelectorQuery();
    
    if (patchedQueryAll || patchedQuery) {
      console.log('[Collection Shortcuts] ✓ Selector helpers patched successfully');
    }
  };

  // Try immediately
  applyPatches();

  // Also try after a short delay (in case Selector loads after collection-shortcuts)
  setTimeout(applyPatches, 50);

  console.log('[Collection Shortcuts] ✓ Loaded successfully with property shortcuts');
  console.log('[Collection Shortcuts] Usage: ClassName.button[0], Id.myBtn, Id("myBtn"), Selector.queryAll(".btn").textContent({...})');

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);