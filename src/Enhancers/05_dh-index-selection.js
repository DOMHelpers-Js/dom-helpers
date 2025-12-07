/**
 * 05_dh-index-selection.js
 * Enhanced version with built-in bulk array property updates
 * Supports both array syntax and object index syntax
 */

(function patchSelectorForBulkUpdates() {
  if (typeof Selector === 'undefined') return;

  // Store original queryAll method
  const originalQueryAll = Selector.queryAll;

  // Enhanced queryAll with bulk array support
  Selector.queryAll = function(...args) {
    const result = originalQueryAll.apply(this, args);
    return enhanceCollectionWithBulkArraySupport(result);
  };

  /**
   * Enhance collection to support array values in update()
   * Arrays are applied sequentially to each element
   */
  function enhanceCollectionWithBulkArraySupport(collection) {
    if (!collection || collection._hasBulkArraySupport) {
      return collection;
    }

    // Get all elements from the collection
    let elements = [];
    if (collection._originalNodeList) {
      elements = Array.from(collection._originalNodeList);
    } else if (collection._originalCollection) {
      elements = Array.from(collection._originalCollection);
    } else if (collection.length !== undefined) {
      elements = Array.from(collection);
    }

    // COMPLETELY REPLACE the update method
    try {
      Object.defineProperty(collection, 'update', {
        value: function(updates = {}) {
          if (!updates || typeof updates !== 'object') {
            console.warn('[Bulk Array] .update() called with invalid updates object');
            return collection;
          }

          if (elements.length === 0) {
            console.info('[Bulk Array] .update() called on empty collection');
            return collection;
          }

          console.log('[Bulk Array] Processing update for', elements.length, 'elements');

          // Process updates for each element
          elements.forEach((element, index) => {
            if (!element || element.nodeType !== Node.ELEMENT_NODE) {
              console.warn('[Bulk Array] Skipping non-element at index', index);
              return;
            }

            console.log(`[Bulk Array] Updating element ${index}`);

            // Build update object for this specific element
            Object.entries(updates).forEach(([key, value]) => {
              const resolvedValue = resolveValueForIndex(value, index);
              console.log(`[Bulk Array] Element ${index}, ${key}:`, resolvedValue);
              applyDirectUpdateForced(element, key, resolvedValue);
            });
          });

          return collection; // Return for chaining
        },
        writable: true,
        enumerable: false,
        configurable: true
      });

      // Add individual property methods for direct access
      // e.g., collection.textContent({ 0: "First", 1: "Second" })
      const propertiesToEnhance = [
        'textContent', 'innerHTML', 'innerText', 'value', 
        'className', 'id', 'title', 'placeholder'
      ];

      propertiesToEnhance.forEach(propName => {
        Object.defineProperty(collection, propName, {
          value: function(indexValueMap) {
            if (!indexValueMap || typeof indexValueMap !== 'object') {
              console.warn(`[Bulk Array] .${propName}() requires an object with indices as keys`);
              return collection;
            }

            console.log(`[Bulk Array] Setting ${propName} with index map:`, indexValueMap);

            // Apply values based on index
            elements.forEach((element, index) => {
              if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

              // Check if this index has a value
              if (index in indexValueMap) {
                const value = indexValueMap[index];
                console.log(`[Bulk Array] Setting element ${index} ${propName} to:`, value);
                element[propName] = value;
              }
            });

            return collection; // Return for chaining
          },
          writable: true,
          enumerable: false,
          configurable: true
        });
      });

      // Add style method for indexed style updates
      Object.defineProperty(collection, 'style', {
        value: function(indexValueMap) {
          if (!indexValueMap || typeof indexValueMap !== 'object') {
            console.warn('[Bulk Array] .style() requires an object');
            return collection;
          }

          console.log('[Bulk Array] Setting styles with index map:', indexValueMap);

          elements.forEach((element, index) => {
            if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

            // Check if this index has styles
            if (index in indexValueMap) {
              const styles = indexValueMap[index];
              if (typeof styles === 'object' && styles !== null) {
                Object.entries(styles).forEach(([styleProp, styleValue]) => {
                  if (styleValue !== null && styleValue !== undefined) {
                    console.log(`[Bulk Array] Setting element ${index} style.${styleProp} to:`, styleValue);
                    element.style[styleProp] = styleValue;
                  }
                });
              }
            }
          });

          return collection; // Return for chaining
        },
        writable: true,
        enumerable: false,
        configurable: true
      });

      // Add classList method for indexed class operations
      Object.defineProperty(collection, 'classList', {
        value: function(indexValueMap) {
          if (!indexValueMap || typeof indexValueMap !== 'object') {
            console.warn('[Bulk Array] .classList() requires an object');
            return collection;
          }

          console.log('[Bulk Array] Setting classList with index map:', indexValueMap);

          elements.forEach((element, index) => {
            if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

            // Check if this index has classList operations
            if (index in indexValueMap) {
              const operations = indexValueMap[index];
              if (typeof operations === 'object' && operations !== null) {
                Object.entries(operations).forEach(([method, classes]) => {
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
              } else if (typeof operations === 'string') {
                // Direct class name string
                element.className = operations;
              }
            }
          });

          return collection; // Return for chaining
        },
        writable: true,
        enumerable: false,
        configurable: true
      });

      // Add dataset method for indexed data attribute updates
      Object.defineProperty(collection, 'dataset', {
        value: function(indexValueMap) {
          if (!indexValueMap || typeof indexValueMap !== 'object') {
            console.warn('[Bulk Array] .dataset() requires an object');
            return collection;
          }

          console.log('[Bulk Array] Setting dataset with index map:', indexValueMap);

          elements.forEach((element, index) => {
            if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

            // Check if this index has dataset values
            if (index in indexValueMap) {
              const dataAttrs = indexValueMap[index];
              if (typeof dataAttrs === 'object' && dataAttrs !== null) {
                Object.entries(dataAttrs).forEach(([dataKey, dataValue]) => {
                  element.dataset[dataKey] = dataValue;
                });
              }
            }
          });

          return collection; // Return for chaining
        },
        writable: true,
        enumerable: false,
        configurable: true
      });

      // Mark as enhanced
      Object.defineProperty(collection, '_hasBulkArraySupport', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });

      console.log('[Bulk Array] Collection enhanced successfully with index methods');
    } catch (error) {
      console.error('[Bulk Array] Failed to enhance collection:', error);
    }

    return collection;
  }

  /**
   * Recursively resolve values for a specific index
   * Handles nested objects and arrays
   */
  function resolveValueForIndex(value, index) {
    // If value is an array, return the element at index (or last element)
    if (Array.isArray(value)) {
      const resolved = index < value.length ? value[index] : value[value.length - 1];
      console.log(`[Bulk Array] Resolved array[${index}]:`, resolved);
      return resolved;
    }

    // If value is an object (like style), recursively resolve its properties
    if (value && typeof value === 'object' && value.constructor === Object) {
      const resolved = {};
      Object.entries(value).forEach(([key, val]) => {
        resolved[key] = resolveValueForIndex(val, index);
      });
      return resolved;
    }

    // For primitive values, return as-is
    return value;
  }

  /**
   * FORCED direct update - bypasses caching and change detection
   */
  function applyDirectUpdateForced(element, key, value) {
    try {
      // Handle textContent/innerText - FORCE update
      if (key === 'textContent' || key === 'innerText') {
        console.log(`[Bulk Array] Setting ${key} to:`, value);
        element[key] = value;
        return;
      }

      // Handle innerHTML - FORCE update
      if (key === 'innerHTML') {
        element.innerHTML = value;
        return;
      }

      // Handle style object - FORCE update each property
      if (key === 'style' && typeof value === 'object' && value !== null) {
        console.log('[Bulk Array] Applying styles:', value);
        Object.entries(value).forEach(([styleProp, styleValue]) => {
          if (styleValue !== null && styleValue !== undefined) {
            console.log(`[Bulk Array] Setting style.${styleProp} to:`, styleValue);
            element.style[styleProp] = styleValue;
          }
        });
        return;
      }

      // Handle classList
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
              classList.forEach(cls => element.classList.toggle(cls));
              break;
            case 'replace':
              if (classList.length === 2) {
                element.classList.replace(classList[0], classList[1]);
              }
              break;
          }
        });
        return;
      }

      // Handle dataset
      if (key === 'dataset' && typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
        return;
      }

      // Handle setAttribute
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

      // Handle removeAttribute
      if (key === 'removeAttribute') {
        if (Array.isArray(value)) {
          value.forEach(attr => element.removeAttribute(attr));
        } else if (typeof value === 'string') {
          element.removeAttribute(value);
        }
        return;
      }

      // Handle addEventListener
      if (key === 'addEventListener' && Array.isArray(value) && value.length >= 2) {
        const [eventType, handler, options] = value;
        element.addEventListener(eventType, handler, options);
        return;
      }

      // Handle DOM methods
      if (typeof element[key] === 'function') {
        if (Array.isArray(value)) {
          element[key](...value);
        } else {
          element[key](value);
        }
        return;
      }

      // Handle regular properties - FORCE update
      if (key in element) {
        element[key] = value;
        return;
      }

      // Fallback to setAttribute
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        element.setAttribute(key, String(value));
      }
    } catch (error) {
      console.warn(`[Bulk Array] Failed to apply update ${key}:`, error);
    }
  }

})();