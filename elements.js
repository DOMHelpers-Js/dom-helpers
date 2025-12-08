/**
 * DOM Helpers - Elements Module
 * ID-based DOM access with intelligent caching and enhanced update methods
 * 
 * @version 2.3.1
 * @license MIT
 * 
 * Usage:
 *   Script tag: <script src="modular/elements.js"></script>
 *   ES Module:  import Elements from './modular/elements.js';
 * 
 * Features:
 *   - Access elements by ID: Elements.myButton
 *   - Intelligent caching with auto-cleanup
 *   - Enhanced .update() method on all elements
 *   - Mutation observer for cache invalidation
 *   - Bulk operations and utilities
 */

(function (global, factory) {
  "use strict";

  // UMD pattern for maximum compatibility
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS/Node.js
    module.exports = factory();
  } else {
    // Browser globals
    const exports = factory();
    global.Elements = exports.Elements;
    global.ProductionElementsHelper = exports.ProductionElementsHelper;
    
    // Register with global DOMHelpers registry
    if (!global.__DOMHelpersModules__) {
      global.__DOMHelpersModules__ = {};
    }
    global.__DOMHelpersModules__.Elements = exports.Elements;
  }
}(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this, function () {
  "use strict";

  // ===== SHARED UPDATE UTILITY (SELF-CONTAINED) =====
  
  const elementPreviousProps = new WeakMap();
  const elementEventListeners = new WeakMap();

  function getPreviousProps(element) {
    if (!elementPreviousProps.has(element)) {
      elementPreviousProps.set(element, {});
    }
    return elementPreviousProps.get(element);
  }

  function storePreviousProps(element, key, value) {
    const prevProps = getPreviousProps(element);
    prevProps[key] = value;
  }

  function getElementEventListeners(element) {
    if (!elementEventListeners.has(element)) {
      elementEventListeners.set(element, new Map());
    }
    return elementEventListeners.get(element);
  }

  function isEqual(value1, value2) {
    if (value1 === value2) return true;
    if (value1 == null || value2 == null) return value1 === value2;
    if (typeof value1 !== typeof value2) return false;

    if (typeof value1 === 'object') {
      if (Array.isArray(value1) && Array.isArray(value2)) {
        if (value1.length !== value2.length) return false;
        return value1.every((val, idx) => isEqual(val, value2[idx]));
      }

      const keys1 = Object.keys(value1);
      const keys2 = Object.keys(value2);
      if (keys1.length !== keys2.length) return false;
      return keys1.every(key => isEqual(value1[key], value2[key]));
    }

    return false;
  }

  function updateStyleProperties(element, newStyles) {
    const prevProps = getPreviousProps(element);
    const prevStyles = prevProps.style || {};

    Object.entries(newStyles).forEach(([property, newValue]) => {
      if (newValue === null || newValue === undefined) return;

      const currentValue = element.style[property];

      if (currentValue !== newValue && prevStyles[property] !== newValue) {
        element.style[property] = newValue;
        prevStyles[property] = newValue;
      }
    });

    prevProps.style = prevStyles;
  }

  function addEventListenerOnce(element, eventType, handler, options) {
    const listeners = getElementEventListeners(element);

    if (!listeners.has(eventType)) {
      listeners.set(eventType, new Map());
    }

    const handlersForEvent = listeners.get(eventType);
    const handlerKey = handler;

    if (!handlersForEvent.has(handlerKey)) {
      element.addEventListener(eventType, handler, options);
      handlersForEvent.set(handlerKey, { handler, options });
    }
  }

  function removeEventListenerIfPresent(element, eventType, handler, options) {
    const listeners = getElementEventListeners(element);

    if (listeners.has(eventType)) {
      const handlersForEvent = listeners.get(eventType);
      const handlerKey = handler;

      if (handlersForEvent.has(handlerKey)) {
        element.removeEventListener(eventType, handler, options);
        handlersForEvent.delete(handlerKey);

        if (handlersForEvent.size === 0) {
          listeners.delete(eventType);
        }
      }
    }
  }

  function handleClassListUpdate(element, classListUpdates) {
    Object.entries(classListUpdates).forEach(([method, classes]) => {
      try {
        switch (method) {
          case 'add':
            if (Array.isArray(classes)) {
              element.classList.add(...classes);
            } else if (typeof classes === 'string') {
              element.classList.add(classes);
            }
            break;

          case 'remove':
            if (Array.isArray(classes)) {
              element.classList.remove(...classes);
            } else if (typeof classes === 'string') {
              element.classList.remove(classes);
            }
            break;

          case 'toggle':
            if (Array.isArray(classes)) {
              classes.forEach(cls => element.classList.toggle(cls));
            } else if (typeof classes === 'string') {
              element.classList.toggle(classes);
            }
            break;

          case 'replace':
            if (Array.isArray(classes) && classes.length === 2) {
              element.classList.replace(classes[0], classes[1]);
            }
            break;

          case 'contains':
            if (Array.isArray(classes)) {
              classes.forEach(cls => {
                console.log(`[DOM Helpers] classList.contains('${cls}'):`, element.classList.contains(cls));
              });
            } else if (typeof classes === 'string') {
              console.log(`[DOM Helpers] classList.contains('${classes}'):`, element.classList.contains(classes));
            }
            break;

          default:
            console.warn(`[DOM Helpers] Unknown classList method: ${method}`);
        }
      } catch (error) {
        console.warn(`[DOM Helpers] Error in classList.${method}: ${error.message}`);
      }
    });
  }

  function createEnhancedEventHandler(originalHandler) {
    return function enhancedEventHandler(event) {
      if (event.target && !event.target.update) {
        enhanceElementWithUpdate(event.target);
      }

      if (this && this.nodeType === Node.ELEMENT_NODE && !this.update) {
        enhanceElementWithUpdate(this);
      }

      return originalHandler.call(this, event);
    };
  }

  function handleEnhancedEventListenerWithTracking(element, value) {
    if (Array.isArray(value) && value.length >= 2) {
      const [eventType, handler, options] = value;
      const enhancedHandler = createEnhancedEventHandler(handler);
      addEventListenerOnce(element, eventType, enhancedHandler, options);
      return;
    }

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.entries(value).forEach(([eventType, handler]) => {
        if (typeof handler === 'function') {
          const enhancedHandler = createEnhancedEventHandler(handler);
          addEventListenerOnce(element, eventType, enhancedHandler);
        } else if (Array.isArray(handler) && handler.length >= 1) {
          const [handlerFunc, options] = handler;
          if (typeof handlerFunc === 'function') {
            const enhancedHandler = createEnhancedEventHandler(handlerFunc);
            addEventListenerOnce(element, eventType, enhancedHandler, options);
          }
        }
      });
      return;
    }

    console.warn('[DOM Helpers] Invalid addEventListener value format');
  }

  function applyEnhancedUpdate(element, key, value) {
    try {
      const prevProps = getPreviousProps(element);

      if (key === 'textContent' || key === 'innerText') {
        if (element[key] !== value && prevProps[key] !== value) {
          element[key] = value;
          storePreviousProps(element, key, value);
        }
        return;
      }

      if (key === 'innerHTML') {
        if (element.innerHTML !== value && prevProps.innerHTML !== value) {
          element.innerHTML = value;
          storePreviousProps(element, 'innerHTML', value);
        }
        return;
      }

      if (key === 'style' && typeof value === 'object' && value !== null) {
        updateStyleProperties(element, value);
        return;
      }

      if (key === 'classList' && typeof value === 'object' && value !== null) {
        handleClassListUpdate(element, value);
        return;
      }

      if (key === 'setAttribute') {
        if (Array.isArray(value) && value.length >= 2) {
          const [attrName, attrValue] = value;
          const currentValue = element.getAttribute(attrName);
          if (currentValue !== attrValue) {
            element.setAttribute(attrName, attrValue);
          }
        } else if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([attrName, attrValue]) => {
            const currentValue = element.getAttribute(attrName);
            if (currentValue !== attrValue) {
              element.setAttribute(attrName, attrValue);
            }
          });
        }
        return;
      }

      if (key === 'removeAttribute') {
        if (Array.isArray(value)) {
          value.forEach(attr => {
            if (element.hasAttribute(attr)) {
              element.removeAttribute(attr);
            }
          });
        } else if (typeof value === 'string') {
          if (element.hasAttribute(value)) {
            element.removeAttribute(value);
          }
        }
        return;
      }

      if (key === 'getAttribute' && typeof value === 'string') {
        const attrValue = element.getAttribute(value);
        console.log(`[DOM Helpers] getAttribute('${value}'):`, attrValue);
        return;
      }

      if (key === 'addEventListener') {
        handleEnhancedEventListenerWithTracking(element, value);
        return;
      }

      if (key === 'removeEventListener' && Array.isArray(value) && value.length >= 2) {
        const [eventType, handler, options] = value;
        removeEventListenerIfPresent(element, eventType, handler, options);
        return;
      }

      if (key === 'dataset' && typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          if (element.dataset[dataKey] !== dataValue) {
            element.dataset[dataKey] = dataValue;
          }
        });
        return;
      }

      if (typeof element[key] === 'function') {
        if (Array.isArray(value)) {
          element[key](...value);
        } else {
          element[key](value);
        }
        return;
      }

      if (key in element) {
        if (!isEqual(element[key], value) && !isEqual(prevProps[key], value)) {
          element[key] = value;
          storePreviousProps(element, key, value);
        }
        return;
      }

      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        const currentValue = element.getAttribute(key);
        const stringValue = String(value);
        if (currentValue !== stringValue) {
          element.setAttribute(key, stringValue);
        }
        return;
      }

      console.warn(`[DOM Helpers] Unknown property or method: ${key}`);
    } catch (error) {
      console.warn(`[DOM Helpers] Failed to apply update ${key}: ${error.message}`);
    }
  }

  function enhanceElementWithUpdate(element) {
    if (!element || element._hasEnhancedUpdateMethod) {
      return element;
    }

    try {
      Object.defineProperty(element, 'update', {
        value: function(updates = {}) {
          if (!updates || typeof updates !== 'object') {
            console.warn('[DOM Helpers] .update() called with invalid updates object');
            return element;
          }

          try {
            Object.entries(updates).forEach(([key, value]) => {
              applyEnhancedUpdate(element, key, value);
            });
          } catch (error) {
            console.warn(`[DOM Helpers] Error in .update(): ${error.message}`);
          }

          return element;
        },
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
      element.update = function(updates = {}) {
        if (!updates || typeof updates !== 'object') {
          console.warn('[DOM Helpers] .update() called with invalid updates object');
          return element;
        }

        try {
          Object.entries(updates).forEach(([key, value]) => {
            applyEnhancedUpdate(element, key, value);
          });
        } catch (error) {
          console.warn(`[DOM Helpers] Error in .update(): ${error.message}`);
        }

        return element;
      };
      element._hasEnhancedUpdateMethod = true;
    }

    return element;
  }

  // ===== ELEMENTS HELPER =====

  class ProductionElementsHelper {
    constructor(options = {}) {
      this.cache = new Map();
      this.weakCache = new WeakMap();
      this.options = {
        enableLogging: options.enableLogging ?? false,
        autoCleanup: options.autoCleanup ?? true,
        cleanupInterval: options.cleanupInterval ?? 30000,
        maxCacheSize: options.maxCacheSize ?? 1000,
        debounceDelay: options.debounceDelay ?? 16,
        ...options
      };

      this.stats = {
        hits: 0,
        misses: 0,
        cacheSize: 0,
        lastCleanup: Date.now()
      };

      this.pendingUpdates = new Set();
      this.cleanupTimer = null;
      this.isDestroyed = false;

      this._initProxy();
      this._initMutationObserver();
      this._scheduleCleanup();
    }

    _initProxy() {
      this.Elements = new Proxy(this, {
        get: (target, prop) => {
          if (typeof prop === 'symbol' || prop.startsWith('_') || typeof target[prop] === 'function') {
            return target[prop];
          }

          return target._getElement(prop);
        },

        has: (target, prop) => target._hasElement(prop),

        ownKeys: (target) => target._getKeys(),

        getOwnPropertyDescriptor: (target, prop) => {
          if (target._hasElement(prop)) {
            return {
              enumerable: true,
              configurable: true,
              value: target._getElement(prop)
            };
          }
          return undefined;
        }
      });
    }

    _getElement(prop) {
      if (typeof prop !== 'string') {
        this._warn(`Invalid element property type: ${typeof prop}`);
        return null;
      }

      if (this.cache.has(prop)) {
        const element = this.cache.get(prop);
        if (element && element.nodeType === Node.ELEMENT_NODE && document.contains(element)) {
          this.stats.hits++;
          return enhanceElementWithUpdate(element);
        } else {
          this.cache.delete(prop);
        }
      }

      const element = document.getElementById(prop);
      if (element) {
        this._addToCache(prop, element);
        this.stats.misses++;
        return enhanceElementWithUpdate(element);
      }

      this.stats.misses++;
      if (this.options.enableLogging) {
        this._warn(`Element with id '${prop}' not found`);
      }
      return null;
    }

    _hasElement(prop) {
      if (typeof prop !== 'string') return false;

      if (this.cache.has(prop)) {
        const element = this.cache.get(prop);
        if (element && element.nodeType === Node.ELEMENT_NODE && document.contains(element)) {
          return true;
        }
        this.cache.delete(prop);
      }

      return !!document.getElementById(prop);
    }

    _getKeys() {
      const elements = document.querySelectorAll('[id]');
      return Array.from(elements).map(el => el.id).filter(id => id);
    }

    _addToCache(id, element) {
      if (this.cache.size >= this.options.maxCacheSize) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      this.cache.set(id, element);
      this.stats.cacheSize = this.cache.size;

      this.weakCache.set(element, {
        id,
        cachedAt: Date.now(),
        accessCount: 1
      });
    }

    _initMutationObserver() {
      const debouncedUpdate = this._debounce((mutations) => {
        this._processMutations(mutations);
      }, this.options.debounceDelay);

      this.observer = new MutationObserver(debouncedUpdate);

      if (document.body) {
        this.observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['id'],
          attributeOldValue: true
        });
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          if (document.body && !this.isDestroyed) {
            this.observer.observe(document.body, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: ['id'],
              attributeOldValue: true
            });
          }
        });
      }
    }

    _processMutations(mutations) {
      if (this.isDestroyed) return;

      const addedIds = new Set();
      const removedIds = new Set();

      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.id) addedIds.add(node.id);

            try {
              const childrenWithIds = node.querySelectorAll ? node.querySelectorAll('[id]') : [];
              childrenWithIds.forEach(child => {
                if (child.id) addedIds.add(child.id);
              });
            } catch (e) {}
          }
        });

        mutation.removedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.id) removedIds.add(node.id);

            try {
              const childrenWithIds = node.querySelectorAll ? node.querySelectorAll('[id]') : [];
              childrenWithIds.forEach(child => {
                if (child.id) removedIds.add(child.id);
              });
            } catch (e) {}
          }
        });

        if (mutation.type === 'attributes' && mutation.attributeName === 'id') {
          const oldId = mutation.oldValue;
          const newId = mutation.target.id;

          if (oldId && oldId !== newId) {
            removedIds.add(oldId);
          }
          if (newId && newId !== oldId) {
            addedIds.add(newId);
          }
        }
      });

      addedIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          this._addToCache(id, element);
        }
      });

      removedIds.forEach(id => {
        this.cache.delete(id);
      });

      this.stats.cacheSize = this.cache.size;
    }

    _scheduleCleanup() {
      if (!this.options.autoCleanup || this.isDestroyed) return;

      this.cleanupTimer = setTimeout(() => {
        this._performCleanup();
        this._scheduleCleanup();
      }, this.options.cleanupInterval);
    }

    _performCleanup() {
      if (this.isDestroyed) return;

      const staleIds = [];

      for (const [id, element] of this.cache) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE || !document.contains(element) || element.id !== id) {
          staleIds.push(id);
        }
      }

      staleIds.forEach(id => this.cache.delete(id));

      this.stats.cacheSize = this.cache.size;
      this.stats.lastCleanup = Date.now();

      if (this.options.enableLogging && staleIds.length > 0) {
        this._log(`Cleanup completed. Removed ${staleIds.length} stale entries.`);
      }
    }

    _debounce(func, delay) {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    }

    _log(message) {
      if (this.options.enableLogging) {
        console.log(`[Elements] ${message}`);
      }
    }

    _warn(message) {
      if (this.options.enableLogging) {
        console.warn(`[Elements] ${message}`);
      }
    }

    // Public API Methods
    getStats() {
      return {
        ...this.stats,
        hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
        uptime: Date.now() - this.stats.lastCleanup
      };
    }

    clearCache() {
      this.cache.clear();
      this.stats.cacheSize = 0;
      this._log('Cache cleared manually');
    }

    destroy() {
      this.isDestroyed = true;

      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }

      if (this.cleanupTimer) {
        clearTimeout(this.cleanupTimer);
        this.cleanupTimer = null;
      }

      this.cache.clear();
      this._log('Elements helper destroyed');
    }

    isCached(id) {
      return this.cache.has(id);
    }

    getCacheSnapshot() {
      return Array.from(this.cache.keys());
    }

    destructure(...ids) {
      const result = {};
      const missing = [];

      ids.forEach(id => {
        const element = this._getElement(id);
        if (element) {
          result[id] = element;
        } else {
          missing.push(id);
          result[id] = null;
        }
      });

      if (missing.length > 0 && this.options.enableLogging) {
        this._warn(`Missing elements during destructuring: ${missing.join(', ')}`);
      }

      return result;
    }

    getRequired(...ids) {
      const elements = this.destructure(...ids);
      const missing = ids.filter(id => !elements[id]);

      if (missing.length > 0) {
        throw new Error(`Required elements not found: ${missing.join(', ')}`);
      }

      return elements;
    }

    async waitFor(...ids) {
      const maxWait = 5000;
      const checkInterval = 100;
      const startTime = Date.now();

      while (Date.now() - startTime < maxWait) {
        const elements = this.destructure(...ids);
        const allFound = ids.every(id => elements[id]);

        if (allFound) {
          return elements;
        }

        await new Promise(resolve => setTimeout(resolve, checkInterval));
      }

      throw new Error(`Timeout waiting for elements: ${ids.join(', ')}`);
    }

    get(id, fallback = null) {
      const element = this._getElement(id);
      return element || fallback;
    }

    exists(id) {
      return !!this._getElement(id);
    }

    getMultiple(...ids) {
      return this.destructure(...ids);
    }

    setProperty(id, property, value) {
      const element = this.Elements[id];
      if (element && property in element) {
        element[property] = value;
        return true;
      }
      return false;
    }

    getProperty(id, property, fallback = undefined) {
      const element = this.Elements[id];
      if (element && property in element) {
        return element[property];
      }
      return fallback;
    }

    setAttribute(id, attribute, value) {
      const element = this.Elements[id];
      if (element) {
        element.setAttribute(attribute, value);
        return true;
      }
      return false;
    }

    getAttribute(id, attribute, fallback = null) {
      const element = this.Elements[id];
      if (element) {
        return element.getAttribute(attribute) || fallback;
      }
      return fallback;
    }
  }

  // Initialize helper
  const ElementsHelper = new ProductionElementsHelper({
    enableLogging: false,
    autoCleanup: true,
    cleanupInterval: 30000,
    maxCacheSize: 1000
  });

  const Elements = ElementsHelper.Elements;

  // Utility methods
  Elements.helper = ElementsHelper;
  Elements.stats = () => ElementsHelper.getStats();
  Elements.clear = () => ElementsHelper.clearCache();
  Elements.destroy = () => ElementsHelper.destroy();
  
  // Direct implementations to avoid proxy recursion issues
  Elements.destructure = (...ids) => {
    const obj = {};
    ids.forEach(id => {
      obj[id] = document.getElementById(id);
      if (obj[id]) enhanceElementWithUpdate(obj[id]);
    });
    return obj;
  };

  Elements.getRequired = (...ids) => {
    const elements = Elements.destructure(...ids);
    const missing = ids.filter(id => !elements[id]);
    if (missing.length > 0) {
      throw new Error(`Required elements not found: ${missing.join(', ')}`);
    }
    return elements;
  };

  Elements.waitFor = async (...ids) => {
    const maxWait = 5000;
    const checkInterval = 100;
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
      const elements = Elements.destructure(...ids);
      const allFound = ids.every(id => elements[id]);

      if (allFound) {
        return elements;
      }

      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }

    throw new Error(`Timeout waiting for elements: ${ids.join(', ')}`);
  };

  Elements.isCached = (id) => ElementsHelper.cache.has(id);
  Elements.get = (id, fallback = null) => {
    const el = document.getElementById(id);
    return el ? enhanceElementWithUpdate(el) : fallback;
  };
  Elements.exists = (id) => !!document.getElementById(id);
  Elements.getMultiple = (...ids) => Elements.destructure(...ids);
  Elements.setProperty = (id, property, value) => ElementsHelper.setProperty(id, property, value);
  Elements.getProperty = (id, property, fallback) => ElementsHelper.getProperty(id, property, fallback);
  Elements.setAttribute = (id, attribute, value) => ElementsHelper.setAttribute(id, attribute, value);
  Elements.getAttribute = (id, attribute, fallback) => ElementsHelper.getAttribute(id, attribute, fallback);
  
  Elements.configure = (options) => {
    Object.assign(ElementsHelper.options, options);
    return Elements;
  };

  /**
   * Bulk update method for Elements helper
   * Allows updating multiple elements by their IDs in a single call
   *
   * @param {Object} updates - Object where keys are element IDs and values are update objects
   * @returns {Object} - Object with results for each element ID
   */
  Elements.update = (updates = {}) => {
    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
      console.warn('[DOM Helpers] Elements.update() requires an object with element IDs as keys');
      return {};
    }

    const results = {};
    const successful = [];
    const failed = [];

    Object.entries(updates).forEach(([elementId, updateData]) => {
      try {
        const element = Elements[elementId];

        if (element && element.nodeType === Node.ELEMENT_NODE) {
          if (typeof element.update === 'function') {
            element.update(updateData);
            results[elementId] = { success: true, element };
            successful.push(elementId);
          } else {
            Object.entries(updateData).forEach(([key, value]) => {
              applyEnhancedUpdate(element, key, value);
            });
            results[elementId] = { success: true, element };
            successful.push(elementId);
          }
        } else {
          results[elementId] = {
            success: false,
            error: `Element with ID '${elementId}' not found`
          };
          failed.push(elementId);
        }
      } catch (error) {
        results[elementId] = {
          success: false,
          error: error.message
        };
        failed.push(elementId);
      }
    });

    // Log summary if logging is enabled
    if (ElementsHelper.options.enableLogging) {
      console.log(`[Elements] Bulk update completed: ${successful.length} successful, ${failed.length} failed`);
      if (failed.length > 0) {
        console.warn(`[Elements] Failed IDs:`, failed);
      }
    }

    return results;
  };

  // Auto-cleanup on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      ElementsHelper.destroy();
    });
  }

  // Return exports
  return {
    Elements,
    ProductionElementsHelper,
    default: Elements
  };
}));