/**
 * 02_collection-shortcuts.js
 * 
 * DOM Helpers - Collection Shortcuts with Index Access
 * Provides ClassName, TagName, Name globally with index selection
 * 
 * Consolidates:
 * - 02_dh-collection-shortcuts.js (complete)
 * - Parts of 06_dh-global-collection-indexed-updates.js (proxy logic)
 * 
 * Features:
 * - ClassName.button - All buttons
 * - ClassName.button[0] - First button (auto-enhanced)
 * - ClassName.button[-1] - Last button (negative indices)
 * - ClassName.button.update() - Update all with bulk/index/mixed modes
 * 
 * REQUIRES: core-update-engine.js (for CoreUpdateEngine)
 * 
 * @version 2.0.0
 * @license MIT
 */

(function(global) {
  'use strict';

  console.log('[Collection Shortcuts] v2.0.0 Loading...');

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
            prop === 'update' ||
            prop === 'item' ||
            prop === 'entries' ||
            prop === 'keys' ||
            prop === 'values' ||
            prop === 'forEach' ||
            prop === 'map' ||
            prop === 'filter' ||
            prop === 'namedItem') {
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

  // ===== CREATE GLOBAL SHORTCUTS =====

  const ClassName = createGlobalCollectionProxy('ClassName');
  const TagName = createGlobalCollectionProxy('TagName');
  const Name = createGlobalCollectionProxy('Name');

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

  // ===== INTEGRATE WITH DOM HELPERS =====

  if (typeof global.DOMHelpers !== 'undefined') {
    if (ClassName) global.DOMHelpers.ClassName = ClassName;
    if (TagName) global.DOMHelpers.TagName = TagName;
    if (Name) global.DOMHelpers.Name = Name;
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
    version: '2.0.0',
    createEnhancedCollectionWrapper,
    createGlobalCollectionProxy
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

  console.log('[Collection Shortcuts] ✓ Loaded successfully');
  console.log('[Collection Shortcuts] Usage: ClassName.button[0], TagName.div[-1], Name.username[2]');

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);