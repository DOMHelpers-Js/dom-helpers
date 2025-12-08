/**
 * DOM Helpers - Selector Module
 * querySelector/querySelectorAll with intelligent caching
 * 
 * @version 2.3.1
 * @license MIT
 * 
 * Usage:
 *   Script tag: <script src="modular/selector.js"></script>
 *   ES Module:  import Selector from './modular/selector.js';
 * 
 * Features:
 *   - query() for single elements: Selector.query('.btn')
 *   - queryAll() for collections: Selector.queryAll('.btn')
 *   - Smart caching with change detection
 *   - Enhanced .update() on results
 *   - Scoped queries within containers
 */

(function (global, factory) {
  "use strict";

  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    const exports = factory();
    global.Selector = exports.Selector;
    global.ProductionSelectorHelper = exports.ProductionSelectorHelper;
    
    if (!global.__DOMHelpersModules__) {
      global.__DOMHelpersModules__ = {};
    }
    global.__DOMHelpersModules__.Selector = exports.Selector;
  }
}(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this, function () {
  "use strict";

  // ===== SHARED UPDATE UTILITY =====
  
  const elementPreviousProps = new WeakMap();

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
        }
      } catch (error) {
        console.warn(`[DOM Helpers] Error in classList.${method}: ${error.message}`);
      }
    });
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
      }
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

  function enhanceCollectionWithUpdate(collection) {
    if (!collection || collection._hasEnhancedUpdateMethod) {
      return collection;
    }

    try {
      Object.defineProperty(collection, 'update', {
        value: function(updates = {}) {
          if (!updates || typeof updates !== 'object') {
            console.warn('[DOM Helpers] .update() called with invalid updates object');
            return collection;
          }

          let elements = [];
          if (collection._originalNodeList) {
            elements = Array.from(collection._originalNodeList);
          } else if (collection.length !== undefined) {
            elements = Array.from(collection);
          }

          if (elements.length === 0) {
            return collection;
          }

          try {
            elements.forEach(element => {
              if (element && element.nodeType === Node.ELEMENT_NODE) {
                Object.entries(updates).forEach(([key, value]) => {
                  applyEnhancedUpdate(element, key, value);
                });
              }
            });
          } catch (error) {
            console.warn(`[DOM Helpers] Error in collection .update(): ${error.message}`);
          }

          return collection;
        },
        writable: false,
        enumerable: false,
        configurable: true
      });

      Object.defineProperty(collection, '_hasEnhancedUpdateMethod', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
    } catch (error) {
      collection.update = function(updates = {}) {
        if (!updates || typeof updates !== 'object') {
          return collection;
        }

        let elements = [];
        if (collection._originalNodeList) {
          elements = Array.from(collection._originalNodeList);
        } else if (collection.length !== undefined) {
          elements = Array.from(collection);
        }

        if (elements.length === 0) {
          return collection;
        }

        elements.forEach(element => {
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            Object.entries(updates).forEach(([key, value]) => {
              applyEnhancedUpdate(element, key, value);
            });
          }
        });

        return collection;
      };
      collection._hasEnhancedUpdateMethod = true;
    }

    return collection;
  }

  // ===== SELECTOR HELPER =====

  class ProductionSelectorHelper {
    constructor(options = {}) {
      this.cache = new Map();
      this.weakCache = new WeakMap();
      this.options = {
        enableLogging: options.enableLogging ?? false,
        autoCleanup: options.autoCleanup ?? true,
        cleanupInterval: options.cleanupInterval ?? 30000,
        maxCacheSize: options.maxCacheSize ?? 1000,
        debounceDelay: options.debounceDelay ?? 16,
        enableSmartCaching: options.enableSmartCaching ?? true,
        ...options
      };

      this.stats = {
        hits: 0,
        misses: 0,
        cacheSize: 0,
        lastCleanup: Date.now(),
        selectorTypes: new Map()
      };

      this.pendingUpdates = new Set();
      this.cleanupTimer = null;
      this.isDestroyed = false;

      this._initProxies();
      this._initMutationObserver();
      this._scheduleCleanup();
    }

    _initProxies() {
      this.query = (selector) => this._getQuery('single', selector);
      this.queryAll = (selector) => this._getQuery('multiple', selector);

      this.Scoped = {
        within: (container, selector) => {
          const containerEl = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;

          if (!containerEl) return null;

          const cacheKey = `scoped:${containerEl.id || 'anonymous'}:${selector}`;
          return this._getScopedQuery(containerEl, selector, 'single', cacheKey);
        },

        withinAll: (container, selector) => {
          const containerEl = typeof container === 'string'
            ? document.querySelector(container)
            : container;

          if (!containerEl) return this._createEmptyCollection();

          const cacheKey = `scopedAll:${containerEl.id || 'anonymous'}:${selector}`;
          return this._getScopedQuery(containerEl, selector, 'multiple', cacheKey);
        }
      };
    }

    _createCacheKey(type, selector) {
      return `${type}:${selector}`;
    }

    _getQuery(type, selector) {
      if (typeof selector !== 'string') {
        this._warn(`Invalid selector type: ${typeof selector}`);
        return type === 'single' ? null : this._createEmptyCollection();
      }

      const cacheKey = this._createCacheKey(type, selector);

      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (this._isValidQuery(cached, type)) {
          this.stats.hits++;
          this._trackSelectorType(selector);
          return cached;
        } else {
          this.cache.delete(cacheKey);
        }
      }

      let result;
      try {
        if (type === 'single') {
          const element = document.querySelector(selector);
          result = enhanceElementWithUpdate(element);
        } else {
          const nodeList = document.querySelectorAll(selector);
          result = this._enhanceNodeList(nodeList, selector);
        }
      } catch (error) {
        this._warn(`Invalid selector "${selector}": ${error.message}`);
        return type === 'single' ? null : this._createEmptyCollection();
      }

      this._addToCache(cacheKey, result);
      this.stats.misses++;
      this._trackSelectorType(selector);
      return result;
    }

    _getScopedQuery(container, selector, type, cacheKey) {
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (this._isValidQuery(cached, type)) {
          this.stats.hits++;
          return cached;
        } else {
          this.cache.delete(cacheKey);
        }
      }

      let result;
      try {
        if (type === 'single') {
          result = container.querySelector(selector);
        } else {
          const nodeList = container.querySelectorAll(selector);
          result = this._enhanceNodeList(nodeList, selector);
        }
      } catch (error) {
        this._warn(`Invalid scoped selector "${selector}": ${error.message}`);
        return type === 'single' ? null : this._createEmptyCollection();
      }

      this._addToCache(cacheKey, result);
      this.stats.misses++;
      return result;
    }

    _isValidQuery(cached, type) {
      if (type === 'single') {
        return cached && cached.nodeType === Node.ELEMENT_NODE && document.contains(cached);
      } else {
        if (!cached || !cached._originalNodeList) return false;
        const nodeList = cached._originalNodeList;
        if (nodeList.length === 0) return true;
        const firstElement = nodeList[0];
        return firstElement && document.contains(firstElement);
      }
    }

    _enhanceNodeList(nodeList, selector) {
      const collection = {
        _originalNodeList: nodeList,
        _selector: selector,
        _cachedAt: Date.now(),

        get length() {
          return nodeList.length;
        },

        item(index) {
          return nodeList.item(index);
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
          return Array.from(nodeList);
        },

        forEach(callback, thisArg) {
          nodeList.forEach(callback, thisArg);
        },

        map(callback, thisArg) {
          return Array.from(nodeList).map(callback, thisArg);
        },

        filter(callback, thisArg) {
          return Array.from(nodeList).filter(callback, thisArg);
        },

        find(callback, thisArg) {
          return Array.from(nodeList).find(callback, thisArg);
        },

        some(callback, thisArg) {
          return Array.from(nodeList).some(callback, thisArg);
        },

        every(callback, thisArg) {
          return Array.from(nodeList).every(callback, thisArg);
        },

        reduce(callback, initialValue) {
          return Array.from(nodeList).reduce(callback, initialValue);
        },

        first() {
          return nodeList.length > 0 ? nodeList[0] : null;
        },

        last() {
          return nodeList.length > 0 ? nodeList[nodeList.length - 1] : null;
        },

        at(index) {
          if (index < 0) index = nodeList.length + index;
          return index >= 0 && index < nodeList.length ? nodeList[index] : null;
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
            return nodeList[i];
          },
          enumerable: true
        });
      }

      collection[Symbol.iterator] = function* () {
        for (let i = 0; i < nodeList.length; i++) {
          yield nodeList[i];
        }
      };

      return enhanceCollectionWithUpdate(collection);
    }

    _createEmptyCollection() {
      const emptyNodeList = document.querySelectorAll('nonexistent-element-that-never-exists');
      return this._enhanceNodeList(emptyNodeList, 'empty');
    }

    _trackSelectorType(selector) {
      const type = this._classifySelector(selector);
      const current = this.stats.selectorTypes.get(type) || 0;
      this.stats.selectorTypes.set(type, current + 1);
    }

    _classifySelector(selector) {
      if (/^#[a-zA-Z][\w-]*$/.test(selector)) return 'id';
      if (/^\.[a-zA-Z][\w-]*$/.test(selector)) return 'class';
      if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(selector)) return 'tag';
      if (/^\[[^\]]+\]$/.test(selector)) return 'attribute';
      return 'complex';
    }

    _addToCache(cacheKey, result) {
      if (this.cache.size >= this.options.maxCacheSize) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      this.cache.set(cacheKey, result);
      this.stats.cacheSize = this.cache.size;

      if (result && result.nodeType === Node.ELEMENT_NODE) {
        this.weakCache.set(result, {
          cacheKey,
          cachedAt: Date.now(),
          accessCount: 1
        });
      }
    }

    _initMutationObserver() {
      if (!this.options.enableSmartCaching) return;

      const debouncedUpdate = this._debounce((mutations) => {
        this._processMutations(mutations);
      }, this.options.debounceDelay);

      this.observer = new MutationObserver(debouncedUpdate);

      if (document.body) {
        this.observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['id', 'class', 'style', 'hidden', 'disabled']
        });
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          if (document.body && !this.isDestroyed) {
            this.observer.observe(document.body, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: ['id', 'class', 'style', 'hidden', 'disabled']
            });
          }
        });
      }
    }

    _processMutations(mutations) {
      if (this.isDestroyed) return;

      const affectedSelectors = new Set();

      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          affectedSelectors.add('*');
        }

        if (mutation.type === 'attributes') {
          const target = mutation.target;
          const attrName = mutation.attributeName;

          if (attrName === 'id') {
            const oldValue = mutation.oldValue;
            if (oldValue) affectedSelectors.add(`#${oldValue}`);
            if (target.id) affectedSelectors.add(`#${target.id}`);
          }

          if (attrName === 'class') {
            const oldClasses = mutation.oldValue ? mutation.oldValue.split(/\s+/) : [];
            const newClasses = target.className ? target.className.split(/\s+/) : [];
            [...oldClasses, ...newClasses].forEach(cls => {
              if (cls) affectedSelectors.add(`.${cls}`);
            });
          }

          affectedSelectors.add(`[${attrName}]`);
        }
      });

      if (affectedSelectors.has('*')) {
        this.cache.clear();
      } else {
        const keysToDelete = [];
        for (const key of this.cache.keys()) {
          const [type, selector] = key.split(':', 2);
          for (const affected of affectedSelectors) {
            if (selector.includes(affected)) {
              keysToDelete.push(key);
              break;
            }
          }
        }
        keysToDelete.forEach(key => this.cache.delete(key));
      }

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

      const staleKeys = [];

      for (const [key, value] of this.cache) {
        const [type] = key.split(':', 1);
        if (!this._isValidQuery(value, type === 'single' ? 'single' : 'multiple')) {
          staleKeys.push(key);
        }
      }

      staleKeys.forEach(key => this.cache.delete(key));

      this.stats.cacheSize = this.cache.size;
      this.stats.lastCleanup = Date.now();

      if (this.options.enableLogging && staleKeys.length > 0) {
        this._log(`Cleanup completed. Removed ${staleKeys.length} stale entries.`);
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
        console.log(`[Selector] ${message}`);
      }
    }

    _warn(message) {
      if (this.options.enableLogging) {
        console.warn(`[Selector] ${message}`);
      }
    }

    getStats() {
      return {
        ...this.stats,
        hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
        uptime: Date.now() - this.stats.lastCleanup,
        selectorBreakdown: Object.fromEntries(this.stats.selectorTypes)
      };
    }

    clearCache() {
      this.cache.clear();
      this.stats.cacheSize = 0;
      this.stats.selectorTypes.clear();
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
      this._log('Selector helper destroyed');
    }

    async waitForSelector(selector, timeout = 5000) {
      const startTime = Date.now();

      while (Date.now() - startTime < timeout) {
        const element = this.query(selector);
        if (element) {
          return element;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      throw new Error(`Timeout waiting for selector: ${selector}`);
    }

    async waitForSelectorAll(selector, minCount = 1, timeout = 5000) {
      const startTime = Date.now();

      while (Date.now() - startTime < timeout) {
        const elements = this.queryAll(selector);
        if (elements && elements.length >= minCount) {
          return elements;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      throw new Error(`Timeout waiting for selector: ${selector} (min: ${minCount})`);
    }
  }

  // Initialize helper
  const SelectorHelper = new ProductionSelectorHelper({
    enableLogging: false,
    autoCleanup: true,
    cleanupInterval: 30000,
    maxCacheSize: 1000,
    enableSmartCaching: true
  });

  const Selector = {
    query: SelectorHelper.query,
    queryAll: SelectorHelper.queryAll,
    Scoped: SelectorHelper.Scoped,

    helper: SelectorHelper,
    stats: () => SelectorHelper.getStats(),
    clear: () => SelectorHelper.clearCache(),
    destroy: () => SelectorHelper.destroy(),
    waitFor: (selector, timeout) => SelectorHelper.waitForSelector(selector, timeout),
    waitForAll: (selector, minCount, timeout) => SelectorHelper.waitForSelectorAll(selector, minCount, timeout),
    configure: (options) => {
      Object.assign(SelectorHelper.options, options);
      return Selector;
    }
  };

  Selector.update = (updates = {}) => {
    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
      console.warn('[DOM Helpers] Selector.update() requires an object with CSS selectors as keys');
      return {};
    }

    const results = {};

    Object.entries(updates).forEach(([selector, updateData]) => {
      try {
        const elements = Selector.queryAll(selector);

        if (elements && elements.length > 0) {
          if (typeof elements.update === 'function') {
            elements.update(updateData);
            results[selector] = {
              success: true,
              elements,
              elementsUpdated: elements.length
            };
          } else {
            const elementsArray = Array.from(elements);
            elementsArray.forEach(element => {
              if (element && element.nodeType === Node.ELEMENT_NODE) {
                Object.entries(updateData).forEach(([key, val]) => {
                  applyEnhancedUpdate(element, key, val);
                });
              }
            });
            results[selector] = {
              success: true,
              elements,
              elementsUpdated: elementsArray.length
            };
          }
        } else {
          results[selector] = {
            success: true,
            elements: null,
            elementsUpdated: 0,
            warning: 'No elements found matching selector'
          };
        }
      } catch (error) {
        results[selector] = {
          success: false,
          error: error.message
        };
      }
    });

    return results;
  };

  // Auto-cleanup
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      SelectorHelper.destroy();
    });
  }

  return {
    Selector,
    ProductionSelectorHelper,
    default: Selector
  };
}));
