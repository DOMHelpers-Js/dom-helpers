/**
 * DOM Helpers - createElement Module
 * Enhanced element creation with automatic update methods
 * 
 * @version 2.3.1
 * @license MIT
 * 
 * Usage:
 *   Script tag: <script src="modular/createElement.js"></script>
 *   ES Module:  import createElement from './modular/createElement.js';
 * 
 * Features:
 *   - Enhanced document.createElement with .update() method
 *   - Bulk element creation: createElement.bulk()
 *   - Configuration object support
 *   - Opt-in native override
 */

(function (global, factory) {
  "use strict";

  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    const exports = factory();
    global.createElement = exports.createElement;
    
    if (!global.__DOMHelpersModules__) {
      global.__DOMHelpersModules__ = {};
    }
    global.__DOMHelpersModules__.createElement = exports.createElement;
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

      if (key === 'dataset' && typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          if (element.dataset[dataKey] !== dataValue) {
            element.dataset[dataKey] = dataValue;
          }
        });
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

  // ===== ENHANCED createElement =====

  const originalCreateElement = document.createElement.bind(document);

  function enhancedCreateElement(tagName, options) {
    const isConfigObject = options && typeof options === 'object' && !options.is &&
      (options.textContent || options.className || options.style || options.id || 
       options.classList || options.setAttribute);

    let element;

    if (isConfigObject) {
      element = originalCreateElement(tagName);
      element = enhanceElementWithUpdate(element);
      element.update(options);
    } else {
      element = originalCreateElement(tagName, options);
      element = enhanceElementWithUpdate(element);
    }

    return element;
  }

  // ===== BULK ELEMENT CREATION =====

  /**
   * Bulk element creation method
   * Creates multiple elements with configurations in a single call
   *
   * @param {Object} definitions - Object where keys are tag names and values are configuration objects
   * @returns {Object} - Object with created elements and helper methods
   *
   * @example
   * const elements = createElement.bulk({
   *   P: { textContent: 'Hello', style: { color: 'red' } },
   *   H1: { textContent: 'Title' },
   *   DIV_1: { className: 'container' },
   *   DIV_2: { className: 'sidebar' }
   * });
   */
  function createElementsBulk(definitions = {}) {
    if (!definitions || typeof definitions !== 'object') {
      console.warn('[DOM Helpers] createElement.bulk() requires an object');
      return null;
    }

    const createdElements = {};
    const elementsList = [];

    Object.entries(definitions).forEach(([tagName, config]) => {
      try {
        let actualTagName = tagName;
        const match = tagName.match(/^([A-Z]+)(_\d+)?$/i);
        if (match) {
          actualTagName = match[1];
        }

        const element = enhancedCreateElement(actualTagName);

        if (config && typeof config === 'object') {
          Object.entries(config).forEach(([key, value]) => {
            try {
              if (key === 'style' && typeof value === 'object' && value !== null) {
                Object.assign(element.style, value);
                return;
              }

              if (key === 'classList' && typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([method, classes]) => {
                  try {
                    switch (method) {
                      case 'add':
                        const addClasses = Array.isArray(classes) ? classes : [classes];
                        element.classList.add(...addClasses);
                        break;
                      case 'remove':
                        const removeClasses = Array.isArray(classes) ? classes : [classes];
                        element.classList.remove(...removeClasses);
                        break;
                      case 'toggle':
                        const toggleClasses = Array.isArray(classes) ? classes : [classes];
                        toggleClasses.forEach(cls => element.classList.toggle(cls));
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
                return;
              }

              if (key === 'setAttribute') {
                if (typeof value === 'object' && !Array.isArray(value)) {
                  Object.entries(value).forEach(([attr, attrValue]) => {
                    element.setAttribute(attr, attrValue);
                  });
                } else if (Array.isArray(value) && value.length >= 2) {
                  element.setAttribute(value[0], value[1]);
                }
                return;
              }

              if (key === 'removeAttribute') {
                if (Array.isArray(value)) {
                  value.forEach(attr => element.removeAttribute(attr));
                } else if (typeof value === 'string') {
                  element.removeAttribute(value);
                }
                return;
              }

              if (key === 'dataset' && typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                  element.dataset[dataKey] = dataValue;
                });
                return;
              }

              if (key === 'addEventListener') {
                if (Array.isArray(value) && value.length >= 2) {
                  const [eventType, handler, options] = value;
                  element.addEventListener(eventType, handler, options);
                } else if (typeof value === 'object' && value !== null) {
                  Object.entries(value).forEach(([eventType, handler]) => {
                    if (typeof handler === 'function') {
                      element.addEventListener(eventType, handler);
                    } else if (Array.isArray(handler) && handler.length >= 1) {
                      const [handlerFunc, options] = handler;
                      element.addEventListener(eventType, handlerFunc, options);
                    }
                  });
                }
                return;
              }

              if (key === 'removeEventListener' && Array.isArray(value) && value.length >= 2) {
                const [eventType, handler, options] = value;
                element.removeEventListener(eventType, handler, options);
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
                element[key] = value;
                return;
              }

              if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                element.setAttribute(key, String(value));
              }
            } catch (error) {
              console.warn(`[DOM Helpers] Failed to apply config ${key} to ${tagName}:`, error.message);
            }
          });
        }

        if (!element._hasUpdateMethod && !element._hasEnhancedUpdateMethod) {
          enhanceElementWithUpdate(element);
        }

        createdElements[tagName] = element;
        elementsList.push({ key: tagName, element });
      } catch (error) {
        console.warn(`[DOM Helpers] Failed to create element ${tagName}:`, error.message);
      }
    });

    return {
      ...createdElements,

      /**
       * Get elements as array in specified order
       * If no arguments provided, returns all elements in creation order
       * @param {...string} tagNames - Element keys to retrieve
       * @returns {Array} Array of elements
       */
      toArray(...tagNames) {
        if (tagNames.length === 0) {
          return elementsList.map(({ element }) => element);
        }
        return tagNames.map(key => createdElements[key]).filter(Boolean);
      },

      /**
       * Get elements in specified order (alias for toArray)
       * @param {...string} tagNames - Element keys to retrieve
       * @returns {Array} Array of elements in specified order
       */
      ordered(...tagNames) {
        return this.toArray(...tagNames);
      },

      /**
       * Get all elements as array (getter)
       */
      get all() {
        return elementsList.map(({ element }) => element);
      },

      /**
       * Update multiple elements at once
       * @param {Object} updates - Object where keys are element keys and values are update objects
       * @returns {Object} This object for chaining
       */
      updateMultiple(updates = {}) {
        Object.entries(updates).forEach(([tagName, updateData]) => {
          const element = createdElements[tagName];
          if (element && typeof element.update === 'function') {
            element.update(updateData);
          } else if (element) {
            Object.entries(updateData).forEach(([key, value]) => {
              try {
                if (key === 'style' && typeof value === 'object' && value !== null) {
                  Object.assign(element.style, value);
                } else if (key in element) {
                  element[key] = value;
                } else if (typeof value === 'string' || typeof value === 'number') {
                  element.setAttribute(key, value);
                }
              } catch (error) {
                console.warn(`[DOM Helpers] Failed to update ${key} on ${tagName}:`, error.message);
              }
            });
          }
        });
        return this;
      },

      /**
       * Get count of created elements (getter)
       */
      get count() {
        return elementsList.length;
      },

      /**
       * Get array of all element keys (getter)
       */
      get keys() {
        return elementsList.map(({ key }) => key);
      },

      /**
       * Check if an element exists by key
       * @param {string} key - Element key to check
       * @returns {boolean}
       */
      has(key) {
        return key in createdElements;
      },

      /**
       * Get element by key with fallback
       * @param {string} key - Element key
       * @param {*} fallback - Fallback value if element not found
       * @returns {Element|*}
       */
      get(key, fallback = null) {
        return createdElements[key] || fallback;
      },

      /**
       * Execute a callback for each element
       * @param {Function} callback - Callback function(element, key, index)
       */
      forEach(callback) {
        elementsList.forEach(({ key, element }, index) => {
          callback(element, key, index);
        });
      },

      /**
       * Map over elements
       * @param {Function} callback - Callback function(element, key, index)
       * @returns {Array}
       */
      map(callback) {
        return elementsList.map(({ key, element }, index) => {
          return callback(element, key, index);
        });
      },

      /**
       * Filter elements
       * @param {Function} callback - Callback function(element, key, index)
       * @returns {Array}
       */
      filter(callback) {
        return elementsList
          .filter(({ key, element }, index) => callback(element, key, index))
          .map(({ element }) => element);
      },

      /**
       * Append all elements to a container
       * @param {Element|string} container - Container element or selector
       * @returns {Object} This object for chaining
       */
      appendTo(container) {
        const containerEl = typeof container === 'string'
          ? document.querySelector(container)
          : container;

        if (containerEl) {
          this.all.forEach(element => containerEl.appendChild(element));
        }
        return this;
      },

      /**
       * Append specific elements to a container
       * @param {Element|string} container - Container element or selector
       * @param {...string} tagNames - Element keys to append
       * @returns {Object} This object for chaining
       */
      appendToOrdered(container, ...tagNames) {
        const containerEl = typeof container === 'string'
          ? document.querySelector(container)
          : container;

        if (containerEl) {
          this.ordered(...tagNames).forEach(element => {
            if (element) containerEl.appendChild(element);
          });
        }
        return this;
      }
    };
  }

  // Attach methods to enhanced createElement
  enhancedCreateElement.bulk = createElementsBulk;
  enhancedCreateElement.original = originalCreateElement;

  /**
   * Override native document.createElement with enhanced version
   * @returns {Function} The enhanced createElement for chaining
   */
  enhancedCreateElement.enable = function() {
    document.createElement = enhancedCreateElement;
    return this;
  };

  /**
   * Restore native document.createElement
   * @returns {Function} The enhanced createElement for chaining
   */
  enhancedCreateElement.disable = function() {
    document.createElement = originalCreateElement;
    return this;
  };

  /**
   * Alias for disable() - restores native createElement
   * @returns {Function} The enhanced createElement for chaining
   */
  enhancedCreateElement.restore = function() {
    return this.disable();
  };

  return {
    createElement: enhancedCreateElement,
    default: enhancedCreateElement
  };
}));