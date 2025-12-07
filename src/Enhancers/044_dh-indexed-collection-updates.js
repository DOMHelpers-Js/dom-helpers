/**
 * 04_dh-indexed-collection-updates
 * 
 * DOM Helpers - Indexed Collection Updates with Array Support
 * Standalone module that adds indexed update support to collections
 * 
 * IMPORTANT: Load this AFTER the main DOM helpers bundle AND global-query.js!
 * 
 * Enables multiple syntaxes:
 * 
 * 1. Index object syntax:
 *    querySelectorAll('.btn').update({
 *      [0]: { textContent: 'First', style: { color: 'red' } },
 *      [1]: { textContent: 'Second', style: { color: 'blue' } }
 *    })
 * 
 * 2. Array syntax:
 *    querySelectorAll('.btn').update({
 *      textContent: ['First', 'Second', 'Third'],
 *      style: {
 *        backgroundColor: ['#ff0', '#0f0', '#00f'],
 *        padding: '10px'  // Applied to all
 *      }
 *    })
 * 
 * 3. Direct property with index object:
 *    querySelectorAll('.btn').textContent({
 *      0: 'First',
 *      1: 'Second',
 *      2: 'Third'
 *    })
 * 
 * 4. Bulk updates (applied to ALL):
 *    querySelectorAll('.btn').update({
 *      classList: { add: ['shared-class'] }
 *    })
 * 
 * @version 2.0.0 - ENHANCED: Added array-based sequential updates
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

    // ===== HELPER: CHECK IF VALUE CONTAINS ARRAYS =====
    /**
     * Check if value is array or contains arrays (nested)
     */
    function isArrayOrHasArrays(value) {
        if (Array.isArray(value)) return true;
        
        if (value && typeof value === 'object' && value.constructor === Object) {
            return Object.values(value).some(v => isArrayOrHasArrays(v));
        }
        
        return false;
    }

    // ===== HELPER: RESOLVE VALUE FOR INDEX =====
    /**
     * Recursively resolve values for a specific index
     * Handles nested objects and arrays
     */
    function resolveValueForIndex(value, index) {
        // If value is an array, return the element at index (or last element)
        if (Array.isArray(value)) {
            return index < value.length ? value[index] : value[value.length - 1];
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

    // ===== HELPER: APPLY UPDATES TO SINGLE ELEMENT =====
    /**
     * Applies updates to a single element (FORCED - bypasses caching)
     */
    function applyUpdatesToElement(element, updates) {
        Object.entries(updates).forEach(([key, value]) => {
            applyDirectUpdateForced(element, key, value);
        });
    }

    // ===== FORCED DIRECT UPDATE =====
    /**
     * FORCED direct update - bypasses caching and change detection
     */
    function applyDirectUpdateForced(element, key, value) {
        try {
            // Handle textContent/innerText - FORCE update
            if (key === 'textContent' || key === 'innerText') {
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
                Object.entries(value).forEach(([styleProp, styleValue]) => {
                    if (styleValue !== null && styleValue !== undefined) {
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
            console.warn(`[Indexed Updates] Failed to apply update ${key}:`, error);
        }
    }

    // ===== CORE: INDEXED UPDATE FUNCTION (ENHANCED WITH ARRAY SUPPORT) =====
    /**
     * Updates collection with support for:
     * - Indexed updates: { [0]: {...}, [1]: {...} }
     * - Array updates: { textContent: ['A', 'B', 'C'] }
     * - Bulk updates: { className: 'shared' }
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
            
            // Separate update types
            const indexUpdates = {};      // { [0]: {...}, [1]: {...} }
            const arrayUpdates = {};      // { textContent: ['A', 'B'], style: {...} }
            const bulkUpdates = {};       // { className: 'shared' }
            
            let hasIndexUpdates = false;
            let hasArrayUpdates = false;
            let hasBulkUpdates = false;

            updateKeys.forEach(key => {
                if (typeof key === 'symbol') return;
                
                const asNumber = Number(key);
                const value = updates[key];
                
                // Check if it's a numeric index
                if (Number.isFinite(asNumber) && 
                    Number.isInteger(asNumber) && 
                    String(asNumber) === key) {
                    indexUpdates[key] = value;
                    hasIndexUpdates = true;
                }
                // Check if value contains arrays
                else if (isArrayOrHasArrays(value)) {
                    arrayUpdates[key] = value;
                    hasArrayUpdates = true;
                }
                // Regular bulk update
                else {
                    bulkUpdates[key] = value;
                    hasBulkUpdates = true;
                }
            });

            console.log("[Indexed Updates] Update types:", {
                index: hasIndexUpdates,
                array: hasArrayUpdates,
                bulk: hasBulkUpdates
            });

            // 1. Apply array-based sequential updates FIRST
            if (hasArrayUpdates) {
                console.log("[Indexed Updates] Applying array-based updates");
                elements.forEach((element, index) => {
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        const elementUpdates = {};
                        Object.entries(arrayUpdates).forEach(([key, value]) => {
                            elementUpdates[key] = resolveValueForIndex(value, index);
                        });
                        applyUpdatesToElement(element, elementUpdates);
                    }
                });
            }

            // 2. Apply bulk updates to ALL elements
            if (hasBulkUpdates) {
                console.log("[Indexed Updates] Applying bulk updates to all elements");
                elements.forEach(element => {
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        applyUpdatesToElement(element, bulkUpdates);
                    }
                });
            }

            // 3. Apply index-specific updates LAST (these override everything)
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
                        console.warn(`[Indexed Updates] No element at index ${key}`);
                    }
                });
            }

        } catch (error) {
            console.warn(`[Indexed Updates] Error in collection .update(): ${error.message}`);
            console.error(error);
        }

        return collection;
    }

    // ===== ADD DIRECT PROPERTY METHODS =====
    /**
     * Adds direct property methods to collection
     * e.g., collection.textContent({ 0: "First", 1: "Second" })
     */
    function addDirectPropertyMethods(collection, elements) {
        const propertiesToEnhance = [
            'textContent', 'innerHTML', 'innerText', 'value', 
            'className', 'id', 'title', 'placeholder'
        ];

        propertiesToEnhance.forEach(propName => {
            // Don't override if already exists and is not a getter
            const descriptor = Object.getOwnPropertyDescriptor(collection, propName);
            if (descriptor && typeof descriptor.value === 'function') {
                return; // Already has a method
            }

            try {
                Object.defineProperty(collection, propName, {
                    value: function(indexValueMap) {
                        if (!indexValueMap || typeof indexValueMap !== 'object') {
                            console.warn(`[Indexed Updates] .${propName}() requires an object`);
                            return collection;
                        }

                        console.log(`[Indexed Updates] Setting ${propName} with index map`);

                        elements.forEach((element, index) => {
                            if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

                            if (index in indexValueMap) {
                                const value = indexValueMap[index];
                                element[propName] = value;
                            }
                        });

                        return collection;
                    },
                    writable: true,
                    enumerable: false,
                    configurable: true
                });
            } catch (e) {
                // Property might be read-only, skip
            }
        });

        // Add style method
        try {
            Object.defineProperty(collection, 'style', {
                value: function(indexValueMap) {
                    if (!indexValueMap || typeof indexValueMap !== 'object') {
                        console.warn('[Indexed Updates] .style() requires an object');
                        return collection;
                    }

                    elements.forEach((element, index) => {
                        if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

                        if (index in indexValueMap) {
                            const styles = indexValueMap[index];
                            if (typeof styles === 'object' && styles !== null) {
                                Object.entries(styles).forEach(([styleProp, styleValue]) => {
                                    if (styleValue !== null && styleValue !== undefined) {
                                        element.style[styleProp] = styleValue;
                                    }
                                });
                            }
                        }
                    });

                    return collection;
                },
                writable: true,
                enumerable: false,
                configurable: true
            });
        } catch (e) {
            // Ignore if can't add
        }

        // Add classList method
        try {
            Object.defineProperty(collection, 'classList', {
                value: function(indexValueMap) {
                    if (!indexValueMap || typeof indexValueMap !== 'object') {
                        console.warn('[Indexed Updates] .classList() requires an object');
                        return collection;
                    }

                    elements.forEach((element, index) => {
                        if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

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
                                element.className = operations;
                            }
                        }
                    });

                    return collection;
                },
                writable: true,
                enumerable: false,
                configurable: true
            });
        } catch (e) {
            // Ignore if can't add
        }

        // Add dataset method
        try {
            Object.defineProperty(collection, 'dataset', {
                value: function(indexValueMap) {
                    if (!indexValueMap || typeof indexValueMap !== 'object') {
                        console.warn('[Indexed Updates] .dataset() requires an object');
                        return collection;
                    }

                    elements.forEach((element, index) => {
                        if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

                        if (index in indexValueMap) {
                            const dataAttrs = indexValueMap[index];
                            if (typeof dataAttrs === 'object' && dataAttrs !== null) {
                                Object.entries(dataAttrs).forEach(([dataKey, dataValue]) => {
                                    element.dataset[dataKey] = dataValue;
                                });
                            }
                        }
                    });

                    return collection;
                },
                writable: true,
                enumerable: false,
                configurable: true
            });
        } catch (e) {
            // Ignore if can't add
        }
    }

    // ===== PATCH COLLECTION UPDATE METHOD =====
    /**
     * Patches a collection's update method to support all update types
     */
    function patchCollectionUpdate(collection) {
        if (!collection || collection._hasIndexedUpdateSupport) {
            return collection;
        }

        // Extract elements for direct property methods
        let elements = [];
        if (collection._originalNodeList) {
            elements = Array.from(collection._originalNodeList);
        } else if (collection._originalCollection) {
            elements = Array.from(collection._originalCollection);
        } else if (collection.length !== undefined) {
            try {
                elements = Array.from(collection);
            } catch (e) {
                for (let i = 0; i < collection.length; i++) {
                    elements.push(collection[i]);
                }
            }
        }

        try {
            // Replace update method
            Object.defineProperty(collection, "update", {
                value: function(updates = {}) {
                    return updateCollectionWithIndices(this, updates);
                },
                writable: false,
                enumerable: false,
                configurable: true
            });

            // Add direct property methods
            addDirectPropertyMethods(collection, elements);

            // Mark as enhanced
            Object.defineProperty(collection, "_hasIndexedUpdateSupport", {
                value: true,
                writable: false,
                enumerable: false,
                configurable: false
            });

            console.log("[Indexed Updates] Collection enhanced with array support");
        } catch (e) {
            // Fallback
            collection.update = function(updates = {}) {
                return updateCollectionWithIndices(this, updates);
            };
            addDirectPropertyMethods(collection, elements);
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
            const hasColonKeys = Object.keys(updates).some(key => key.includes(":"));
            if (hasColonKeys && originalCollectionsUpdate) {
                return originalCollectionsUpdate.call(this, updates);
            } else {
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
        console.log("[Indexed Updates] Patched EnhancedUpdateUtility");
    }

    // ===== EXPORTS =====

    const IndexedUpdates = {
        version: "2.0.0",
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

    console.log("[DOM Helpers] Indexed collection updates loaded - v2.0.0 (ENHANCED)");
    console.log("[Indexed Updates] ✓ Supports: index objects, arrays, direct properties, and bulk updates");
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);