/**
 * DOM Helpers - Global Shortcuts
 * Convenient global functions for DOM access
 * 
 * @version 2.0.0
 * @license MIT
 * @requires utilities.js
 * 
 * Purpose:
 *   Provides convenient shortcut functions at global scope
 *   All shortcuts delegate to core DOM Helpers modules
 * 
 * Combines and simplifies:
 *   - 02_dh-collection-shortcuts.js (ClassName, TagName, Name)
 *   - 03_dh-global-query.js (querySelector, querySelectorAll)
 *   - 09_dh-idShortcut.js (Id function)
 */

(function(global) {
  'use strict';

  // ===== DEPENDENCY CHECK =====
  const Utils = global.EnhancerUtilities;
  if (!Utils) {
    console.warn('[Shortcuts] EnhancerUtilities not found. Some features may be limited.');
  }

  // ===== ID SHORTCUT =====

  /**
   * Id() - Shortcut for accessing elements by ID
   * Delegates to Elements helper for caching and enhancement
   * 
   * @param {string} id - Element ID
   * @returns {HTMLElement|null} Enhanced element or null
   * 
   * @example
   * const button = Id('submitBtn');
   * Id('header').update({ textContent: 'Welcome!' });
   */
  function Id(id) {
    // Validate input
    if (typeof id !== 'string') {
      console.warn('[Id] Invalid ID type. Expected string, got:', typeof id);
      return null;
    }

    // Use Elements helper if available
    if (global.Elements && global.Elements[id] !== undefined) {
      return global.Elements[id];
    }

    // Fallback to native
    const element = document.getElementById(id);
    return element && Utils ? Utils.ensureElementUpdate(element) : element;
  }

  /**
   * Id.exists() - Check if element exists by ID
   */
  Id.exists = function(id) {
    if (global.Elements && typeof global.Elements.exists === 'function') {
      return global.Elements.exists(id);
    }
    return !!document.getElementById(id);
  };

  /**
   * Id.get() - Get element with fallback value
   */
  Id.get = function(id, fallback = null) {
    if (global.Elements && typeof global.Elements.get === 'function') {
      return global.Elements.get(id, fallback);
    }
    return Id(id) || fallback;
  };

  /**
   * Id.update() - Bulk update multiple elements by ID
   */
  Id.update = function(updates = {}) {
    if (global.Elements && typeof global.Elements.update === 'function') {
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
   * Id.waitFor() - Async wait for element to appear
   */
  Id.waitFor = async function(id, timeout = 5000) {
    if (global.Elements && typeof global.Elements.waitFor === 'function') {
      const result = await global.Elements.waitFor(id);
      return result[id];
    }

    // Fallback implementation
    const startTime = Date.now();
    const checkInterval = 100;
    
    while (Date.now() - startTime < timeout) {
      const element = Id(id);
      if (element) {
        return element;
      }
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
    
    throw new Error(`Timeout waiting for element with ID: ${id}`);
  };

  // ===== COLLECTION SHORTCUTS =====

  /**
   * Creates a global collection proxy for ClassName, TagName, or Name
   * Delegates to Collections helper and adds index access
   * 
   * @param {string} type - Collection type ('ClassName', 'TagName', 'Name')
   * @returns {Proxy} Proxy for collection access
   */
  function createCollectionShortcut(type) {
    if (!global.Collections) {
      console.warn(`[Shortcuts] Collections helper not found. ${type} shortcut unavailable.`);
      return null;
    }

    const collectionHelper = global.Collections[type];
    if (!collectionHelper) {
      console.warn(`[Shortcuts] Collections.${type} not found.`);
      return null;
    }

    // Create base function
    const baseFunction = function(value) {
      return collectionHelper(value);
    };

    // Create proxy for both function calls and property access
    return new Proxy(baseFunction, {
      /**
       * Handle property access (e.g., ClassName.button)
       */
      get: (target, prop) => {
        // Handle function intrinsics and special properties
        if (Utils && Utils.isSpecialProperty(prop)) {
          return target[prop];
        }

        // Delegate to Collections helper
        const collection = collectionHelper[prop];
        return collection;
      },

      /**
       * Handle function calls (e.g., ClassName('button'))
       */
      apply: (target, thisArg, args) => {
        return collectionHelper(...args);
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

  // Create collection shortcuts
  const ClassName = createCollectionShortcut('ClassName');
  const TagName = createCollectionShortcut('TagName');
  const Name = createCollectionShortcut('Name');

  // ===== QUERY SHORTCUTS =====

  /**
   * querySelector() - Global shortcut for Selector.query()
   * 
   * @param {string} selector - CSS selector
   * @param {HTMLElement} context - Optional context element
   * @returns {HTMLElement|null} Enhanced element or null
   * 
   * @example
   * const button = querySelector('.btn-primary');
   * querySelector('#header').update({ textContent: 'Hello' });
   */
  function querySelector(selector, context = document) {
    if (typeof selector !== 'string') {
      console.warn('[querySelector] Invalid selector type');
      return null;
    }

    // Use Selector helper if available
    if (global.Selector && typeof global.Selector.query === 'function') {
      return context === document ? global.Selector.query(selector) : context.querySelector(selector);
    }

    // Fallback to native
    try {
      const element = (context || document).querySelector(selector);
      return element && Utils ? Utils.ensureElementUpdate(element) : element;
    } catch (error) {
      console.warn('[querySelector] Invalid selector:', selector, error.message);
      return null;
    }
  }

  /**
   * querySelectorAll() - Global shortcut for Selector.queryAll()
   * 
   * @param {string} selector - CSS selector
   * @param {HTMLElement} context - Optional context element
   * @returns {NodeList|Array} Enhanced collection
   * 
   * @example
   * const buttons = querySelectorAll('.btn');
   * querySelectorAll('.item').update({ style: { color: 'red' } });
   */
  function querySelectorAll(selector, context = document) {
    if (typeof selector !== 'string') {
      console.warn('[querySelectorAll] Invalid selector type');
      return [];
    }

    // Use Selector helper if available
    if (global.Selector && typeof global.Selector.queryAll === 'function') {
      return context === document ? global.Selector.queryAll(selector) : context.querySelectorAll(selector);
    }

    // Fallback to native
    try {
      const nodeList = (context || document).querySelectorAll(selector);
      return nodeList;
    } catch (error) {
      console.warn('[querySelectorAll] Invalid selector:', selector, error.message);
      return [];
    }
  }

  /**
   * queryAll() - Alias for querySelectorAll()
   */
  function queryAll(selector, context = document) {
    return querySelectorAll(selector, context);
  }

  // ===== EXPORT TO GLOBAL SCOPE =====

  // Export Id shortcut
  if (!global.Id) {
    global.Id = Id;
  }

  // Export collection shortcuts
  if (ClassName && !global.ClassName) {
    global.ClassName = ClassName;
  }
  if (TagName && !global.TagName) {
    global.TagName = TagName;
  }
  if (Name && !global.Name) {
    global.Name = Name;
  }

  // Export query shortcuts
  if (!global.querySelector) {
    global.querySelector = querySelector;
  }
  if (!global.querySelectorAll) {
    global.querySelectorAll = querySelectorAll;
  }
  if (!global.queryAll) {
    global.queryAll = queryAll;
  }

  // ===== INTEGRATE WITH DOM HELPERS =====

  if (global.DOMHelpers) {
    global.DOMHelpers.Id = Id;
    if (ClassName) global.DOMHelpers.ClassName = ClassName;
    if (TagName) global.DOMHelpers.TagName = TagName;
    if (Name) global.DOMHelpers.Name = Name;
    global.DOMHelpers.querySelector = querySelector;
    global.DOMHelpers.querySelectorAll = querySelectorAll;
    global.DOMHelpers.queryAll = queryAll;
  }

  // ===== EXPORT FOR MODULE SYSTEMS =====

  const Shortcuts = {
    version: '2.0.0',
    
    // ID shortcuts
    Id,
    
    // Collection shortcuts
    ClassName,
    TagName,
    Name,
    
    // Query shortcuts
    querySelector,
    querySelectorAll,
    queryAll
  };

  // CommonJS
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Shortcuts;
  }

  // AMD
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return Shortcuts;
    });
  }

  // Browser global
  global.DOMShortcuts = Shortcuts;

  // ===== LOGGING =====

  const loadedShortcuts = [];
  if (global.Id) loadedShortcuts.push('Id()');
  if (global.ClassName) loadedShortcuts.push('ClassName');
  if (global.TagName) loadedShortcuts.push('TagName');
  if (global.Name) loadedShortcuts.push('Name');
  if (global.querySelector) loadedShortcuts.push('querySelector()');
  if (global.querySelectorAll) loadedShortcuts.push('querySelectorAll()');

  console.log('[Shortcuts] v2.0.0 loaded');
  console.log(`[Shortcuts] Available: ${loadedShortcuts.join(', ')}`);
  console.log('[Shortcuts] Examples:');
  console.log('  - Id("myButton").update({ textContent: "Click me" })');
  console.log('  - ClassName.btn[0].style.color = "red"');
  console.log('  - querySelectorAll(".item").update({ classList: { add: "active" } })');

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
