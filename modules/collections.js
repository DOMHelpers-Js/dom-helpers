/**
 * DOM Helpers - Collections Module
 * Class/Tag/Name-based DOM access with intelligent caching
 * 
 * @version 2.3.1
 * @license MIT
 * 
 * Usage:
 *   Script tag: <script src="modular/collections.js"></script>
 *   ES Module:  import Collections from './modular/collections.js';
 * 
 * Features:
 *   - Access by class: Collections.ClassName.btn
 *   - Access by tag: Collections.TagName.div
 *   - Access by name: Collections.Name.username
 *   - Enhanced .update() on all collections
 *   - Smart caching with mutation observers
 */

(function (global, factory) {
  "use strict";

  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    const exports = factory();
    global.Collections = exports.Collections;
    global.ProductionCollectionHelper = exports.ProductionCollectionHelper;
    
    if (!global.__DOMHelpersModules__) {
      global.__DOMHelpersModules__ = {};
    }
    global.__DOMHelpersModules__.Collections = exports.Collections;
  }
}(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this, function () {
  "use strict";

  // ===== SHARED UPDATE UTILITY =====
  
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
          if (collection._originalCollection) {
            elements = Array.from(collection._originalCollection);
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
        if (collection._originalCollection) {
          elements = Array.from(collection._originalCollection);
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

  // ===== COLLECTIONS HELPER =====

  class ProductionCollectionHelper {
    constructor(options = {}) {
      this.cache = new Map();
      this.weakCache = new WeakMap();
      this.options = {
        enableLogging: options.enableLogging ?? false,
        autoCleanup: options.autoCleanup ?? true,
        cleanupInterval: options.cleanupInterval ?? 30000,
        maxCacheSize: options.maxCacheSize ?? 1000,
        debounceDelay: options.debounceDelay ?? 16,
        enableEnhancedSyntax: options.enableEnhancedSyntax ?? true,
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

      this._initProxies();
      this._initMutationObserver();
      this._scheduleCleanup();
    }

    _initProxies() {
      this.ClassName = this._createCollectionProxy('className');
      this.TagName = this._createCollectionProxy('tagName');
      this.Name = this._createCollectionProxy('name');
    }

    _createCollectionProxy(type) {
      const baseFunction = (value) => {
        const collection = this._getCollection(type, value);
        if (this.options.enableEnhancedSyntax) {
          return this._createEnhancedCollectionProxy(collection);
        }
        return collection;
      };

      return new Proxy(baseFunction, {
        get: (target, prop) => {
          if (typeof prop === 'symbol' || prop === 'constructor' || prop === 'prototype' || 
              prop === 'apply' || prop === 'call' || prop === 'bind' || 
              typeof target[prop] === 'function') {
            return target[prop];
          }

          const collection = this._getCollection(type, prop);
          if (this.options.enableEnhancedSyntax) {
            return this._createEnhancedCollectionProxy(collection);
          }
          return collection;
        },

        apply: (target, thisArg, args) => {
          if (args.length > 0) {
            return target(args[0]);
          }
          return this._createEmptyCollection();
        }
      });
    }

    _createEnhancedCollectionProxy(collection) {
      if (!collection || !this.options.enableEnhancedSyntax) return collection;

      return new Proxy(collection, {
        get: (target, prop) => {
          if (!isNaN(prop) && parseInt(prop) >= 0) {
            const index = parseInt(prop);
            return target[index];
          }
          return target[prop];
        },

        set: (target, prop, value) => {
          try {
            target[prop] = value;
            return true;
          } catch (e) {
            return false;
          }
        }
      });
    }

    _createCacheKey(type, value) {
      return `${type}:${value}`;
    }

    _getCollection(type, value) {
      if (typeof value !== 'string') {
        this._warn(`Invalid ${type} property type: ${typeof value}`);
        return this._createEmptyCollection();
      }

      const cacheKey = this._createCacheKey(type, value);

      if (this.cache.has(cacheKey)) {
        const cachedCollection = this.cache.get(cacheKey);
        if (this._isValidCollection(cachedCollection)) {
          this.stats.hits++;
          return cachedCollection;
        } else {
          this.cache.delete(cacheKey);
        }
      }

      let htmlCollection;
      try {
        switch (type) {
          case 'className':
            htmlCollection = document.getElementsByClassName(value);
            break;
          case 'tagName':
            htmlCollection = document.getElementsByTagName(value);
            break;
          case 'name':
            htmlCollection = document.getElementsByName(value);
            break;
          default:
            this._warn(`Unknown collection type: ${type}`);
            return this._createEmptyCollection();
        }
      } catch (error) {
        this._warn(`Error getting ${type} collection for "${value}": ${error.message}`);
        return this._createEmptyCollection();
      }

      const collection = this._enhanceCollection(htmlCollection, type, value);
      this._addToCache(cacheKey, collection);
      this.stats.misses++;
      return collection;
    }

    _isValidCollection(collection) {
      if (!collection || !collection._originalCollection) return false;

      const live = collection._originalCollection;
      if (live.length === 0) return true;

      const firstElement = live[0];
      return firstElement && firstElement.nodeType === Node.ELEMENT_NODE && document.contains(firstElement);
    }

    _enhanceCollection(htmlCollection, type, value) {
      const collection = {
        _originalCollection: htmlCollection,
        _type: type,
        _value: value,
        _cachedAt: Date.now(),

        get length() {
          return htmlCollection.length;
        },

        item(index) {
          return htmlCollection.item(index);
        },

        toArray() {
          return Array.from(htmlCollection);
        },

        forEach(callback, thisArg) {
          Array.from(htmlCollection).forEach(callback, thisArg);
        },

        map(callback, thisArg) {
          return Array.from(htmlCollection).map(callback, thisArg);
        },

        filter(callback, thisArg) {
          return Array.from(htmlCollection).filter(callback, thisArg);
        },

        find(callback, thisArg) {
          return Array.from(htmlCollection).find(callback, thisArg);
        },

        some(callback, thisArg) {
          return Array.from(htmlCollection).some(callback, thisArg);
        },

        every(callback, thisArg) {
          return Array.from(htmlCollection).every(callback, thisArg);
        },

        reduce(callback, initialValue) {
          return Array.from(htmlCollection).reduce(callback, initialValue);
        },

        first() {
          return htmlCollection.length > 0 ? htmlCollection[0] : null;
        },

        last() {
          return htmlCollection.length > 0 ? htmlCollection[htmlCollection.length - 1] : null;
        },

        at(index) {
          if (index < 0) index = htmlCollection.length + index;
          return index >= 0 && index < htmlCollection.length ? htmlCollection[index] : null;
        },

        isEmpty() {
          return htmlCollection.length === 0;
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
        },

        // Filtering helpers
        visible() {
          return this.filter(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && 
                   style.visibility !== 'hidden' && 
                   style.opacity !== '0';
          });
        },

        hidden() {
          return this.filter(el => {
            const style = window.getComputedStyle(el);
            return style.display === 'none' || 
                   style.visibility === 'hidden' || 
                   style.opacity === '0';
          });
        },

        enabled() {
          return this.filter(el => !el.disabled && !el.hasAttribute('disabled'));
        },

        disabled() {
          return this.filter(el => el.disabled || el.hasAttribute('disabled'));
        }
      };

      for (let i = 0; i < htmlCollection.length; i++) {
        Object.defineProperty(collection, i, {
          get() {
            return htmlCollection[i];
          },
          enumerable: true
        });
      }

      collection[Symbol.iterator] = function* () {
        for (let i = 0; i < htmlCollection.length; i++) {
          yield htmlCollection[i];
        }
      };

      return enhanceCollectionWithUpdate(collection);
    }

    _createEmptyCollection() {
      const emptyCollection = {
        length: 0,
        item: () => null
      };
      return this._enhanceCollection(emptyCollection, 'empty', '');
    }

    _addToCache(cacheKey, collection) {
      if (this.cache.size >= this.options.maxCacheSize) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      this.cache.set(cacheKey, collection);
      this.stats.cacheSize = this.cache.size;

      this.weakCache.set(collection, {
        cacheKey,
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
          attributeFilter: ['class', 'name'],
          attributeOldValue: true
        });
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          if (document.body && !this.isDestroyed) {
            this.observer.observe(document.body, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: ['class', 'name'],
              attributeOldValue: true
            });
          }
        });
      }
    }

    _processMutations(mutations) {
      if (this.isDestroyed) return;

      const affectedClasses = new Set();
      const affectedNames = new Set();
      const affectedTags = new Set();

      mutations.forEach(mutation => {
        [...mutation.addedNodes, ...mutation.removedNodes].forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.className) {
              node.className.split(/\s+/).forEach(cls => {
                if (cls) affectedClasses.add(cls);
              });
            }

            if (node.name) {
              affectedNames.add(node.name);
            }

            affectedTags.add(node.tagName.toLowerCase());

            try {
              const children = node.querySelectorAll ? node.querySelectorAll('*') : [];
              children.forEach(child => {
                if (child.className) {
                  child.className.split(/\s+/).forEach(cls => {
                    if (cls) affectedClasses.add(cls);
                  });
                }
                if (child.name) {
                  affectedNames.add(child.name);
                }
                affectedTags.add(child.tagName.toLowerCase());
              });
            } catch (e) {}
          }
        });

        if (mutation.type === 'attributes') {
          const target = mutation.target;

          if (mutation.attributeName === 'class') {
            const oldClasses = mutation.oldValue ? mutation.oldValue.split(/\s+/) : [];
            const newClasses = target.className ? target.className.split(/\s+/) : [];

            [...oldClasses, ...newClasses].forEach(cls => {
              if (cls) affectedClasses.add(cls);
            });
          }

          if (mutation.attributeName === 'name') {
            if (mutation.oldValue) affectedNames.add(mutation.oldValue);
            if (target.name) affectedNames.add(target.name);
          }
        }
      });

      const keysToDelete = [];

      for (const key of this.cache.keys()) {
        const [type, value] = key.split(':', 2);

        if ((type === 'className' && affectedClasses.has(value)) ||
            (type === 'name' && affectedNames.has(value)) ||
            (type === 'tagName' && affectedTags.has(value))) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach(key => this.cache.delete(key));
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

      for (const [key, collection] of this.cache) {
        if (!this._isValidCollection(collection)) {
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
        console.log(`[Collections] ${message}`);
      }
    }

    _warn(message) {
      if (this.options.enableLogging) {
        console.warn(`[Collections] ${message}`);
      }
    }

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
      this._log('Collections helper destroyed');
    }
  }

  // Initialize helper
  const CollectionHelper = new ProductionCollectionHelper({
    enableLogging: false,
    autoCleanup: true,
    cleanupInterval: 30000,
    maxCacheSize: 1000,
    enableEnhancedSyntax: true
  });

  const Collections = {
    ClassName: CollectionHelper.ClassName,
    TagName: CollectionHelper.TagName,
    Name: CollectionHelper.Name,

    helper: CollectionHelper,
    stats: () => CollectionHelper.getStats(),
    clear: () => CollectionHelper.clearCache(),
    destroy: () => CollectionHelper.destroy(),
    configure: (options) => {
      Object.assign(CollectionHelper.options, options);
      return Collections;
    }
  };

  Collections.update = (updates = {}) => {
    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
      console.warn('[DOM Helpers] Collections.update() requires an object');
      return {};
    }

    const results = {};

    Object.entries(updates).forEach(([identifier, updateData]) => {
      try {
        let type, value, collection;

        if (identifier.includes(':')) {
          [type, value] = identifier.split(':', 2);

          switch (type.toLowerCase()) {
            case 'class':
            case 'classname':
              collection = Collections.ClassName[value];
              break;
            case 'tag':
            case 'tagname':
              collection = Collections.TagName[value];
              break;
            case 'name':
              collection = Collections.Name[value];
              break;
            default:
              results[identifier] = {
                success: false,
                error: `Unknown collection type: ${type}`
              };
              return;
          }
        } else {
          collection = Collections.ClassName[identifier];
          value = identifier;
        }

        if (collection && collection.length > 0) {
          if (typeof collection.update === 'function') {
            collection.update(updateData);
            results[identifier] = {
              success: true,
              collection,
              elementsUpdated: collection.length
            };
          } else {
            const elements = Array.from(collection);
            elements.forEach(element => {
              if (element && element.nodeType === Node.ELEMENT_NODE) {
                Object.entries(updateData).forEach(([key, val]) => {
                  applyEnhancedUpdate(element, key, val);
                });
              }
            });
            results[identifier] = {
              success: true,
              collection,
              elementsUpdated: elements.length
            };
          }
        } else if (collection) {
          results[identifier] = {
            success: true,
            collection,
            elementsUpdated: 0,
            warning: 'Collection is empty'
          };
        } else {
          results[identifier] = {
            success: false,
            error: `Collection '${identifier}' not found`
          };
        }
      } catch (error) {
        results[identifier] = {
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
      CollectionHelper.destroy();
    });
  }

  return {
    Collections,
    ProductionCollectionHelper,
    default: Collections
  };
}));
