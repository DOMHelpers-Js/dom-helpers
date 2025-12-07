/**
 * 02_dh-bulk-property-updaters
 * 
 * DOM Helpers - Bulk Property Updates Extension
 * Adds convenient shorthand methods for bulk element updates
 * 
 * @version 1.0.0
 * @license MIT
 */
(function(global) {
    "use strict";
    function createBulkPropertyUpdater(propertyName, transformer = null) {
        return function(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn(`[DOM Helpers] ${propertyName}() requires an object with element IDs as keys`);
                return this;
            }
            Object.entries(updates).forEach(([elementId, value]) => {
                try {
                    const element = this[elementId];
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        const finalValue = transformer ? transformer(value) : value;
                        if (element.update && typeof element.update === "function") {
                            element.update({
                                [propertyName]: finalValue
                            });
                        } else {
                            element[propertyName] = finalValue;
                        }
                    } else {
                        console.warn(`[DOM Helpers] Element '${elementId}' not found for ${propertyName} update`);
                    }
                } catch (error) {
                    console.warn(`[DOM Helpers] Error updating ${propertyName} for '${elementId}': ${error.message}`);
                }
            });
            return this;
        };
    }
    function createBulkStyleUpdater() {
        return function(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn("[DOM Helpers] style() requires an object with element IDs as keys");
                return this;
            }
            Object.entries(updates).forEach(([elementId, styleObj]) => {
                try {
                    const element = this[elementId];
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (typeof styleObj !== "object" || styleObj === null) {
                            console.warn(`[DOM Helpers] style() requires style object for '${elementId}'`);
                            return;
                        }
                        if (element.update && typeof element.update === "function") {
                            element.update({
                                style: styleObj
                            });
                        } else {
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
    function createBulkDatasetUpdater() {
        return function(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn("[DOM Helpers] dataset() requires an object with element IDs as keys");
                return this;
            }
            Object.entries(updates).forEach(([elementId, dataObj]) => {
                try {
                    const element = this[elementId];
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (typeof dataObj !== "object" || dataObj === null) {
                            console.warn(`[DOM Helpers] dataset() requires data object for '${elementId}'`);
                            return;
                        }
                        if (element.update && typeof element.update === "function") {
                            element.update({
                                dataset: dataObj
                            });
                        } else {
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
    function createBulkAttributesUpdater() {
        return function(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn("[DOM Helpers] attrs() requires an object with element IDs as keys");
                return this;
            }
            Object.entries(updates).forEach(([elementId, attrsObj]) => {
                try {
                    const element = this[elementId];
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (typeof attrsObj !== "object" || attrsObj === null) {
                            console.warn(`[DOM Helpers] attrs() requires attributes object for '${elementId}'`);
                            return;
                        }
                        Object.entries(attrsObj).forEach(([attrName, attrValue]) => {
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
    function createBulkClassListUpdater() {
        return function(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn("[DOM Helpers] classes() requires an object with element IDs as keys");
                return this;
            }
            Object.entries(updates).forEach(([elementId, classConfig]) => {
                try {
                    const element = this[elementId];
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (typeof classConfig === "string") {
                            element.className = classConfig;
                            return;
                        }
                        if (typeof classConfig === "object" && classConfig !== null) {
                            if (element.update && typeof element.update === "function") {
                                element.update({
                                    classList: classConfig
                                });
                            } else {
                                Object.entries(classConfig).forEach(([method, classes]) => {
                                    try {
                                        const classList = Array.isArray(classes) ? classes : [ classes ];
                                        switch (method) {
                                          case "add":
                                            element.classList.add(...classList);
                                            break;

                                          case "remove":
                                            element.classList.remove(...classList);
                                            break;

                                          case "toggle":
                                            classList.forEach(cls => element.classList.toggle(cls));
                                            break;

                                          case "replace":
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
    function createBulkGenericPropertyUpdater() {
        return function(propertyPath, updates = {}) {
            if (typeof propertyPath !== "string") {
                console.warn("[DOM Helpers] prop() requires a property name as first argument");
                return this;
            }
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn("[DOM Helpers] prop() requires an object with element IDs as keys");
                return this;
            }
            const isNested = propertyPath.includes(".");
            const pathParts = isNested ? propertyPath.split(".") : null;
            Object.entries(updates).forEach(([elementId, value]) => {
                try {
                    const element = this[elementId];
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (isNested) {
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
    function enhanceElementsHelper(Elements) {
        if (!Elements) {
            console.warn("[DOM Helpers] Elements helper not found");
            return;
        }
        Elements.textContent = createBulkPropertyUpdater("textContent");
        Elements.innerHTML = createBulkPropertyUpdater("innerHTML");
        Elements.innerText = createBulkPropertyUpdater("innerText");
        Elements.value = createBulkPropertyUpdater("value");
        Elements.placeholder = createBulkPropertyUpdater("placeholder");
        Elements.title = createBulkPropertyUpdater("title");
        Elements.disabled = createBulkPropertyUpdater("disabled");
        Elements.checked = createBulkPropertyUpdater("checked");
        Elements.readonly = createBulkPropertyUpdater("readOnly");
        Elements.hidden = createBulkPropertyUpdater("hidden");
        Elements.selected = createBulkPropertyUpdater("selected");
        Elements.src = createBulkPropertyUpdater("src");
        Elements.href = createBulkPropertyUpdater("href");
        Elements.alt = createBulkPropertyUpdater("alt");
        Elements.style = createBulkStyleUpdater();
        Elements.dataset = createBulkDatasetUpdater();
        Elements.attrs = createBulkAttributesUpdater();
        Elements.classes = createBulkClassListUpdater();
        Elements.prop = createBulkGenericPropertyUpdater();
        return Elements;
    }
    function enhanceCollectionInstance(collectionInstance) {
        if (!collectionInstance || typeof collectionInstance !== "object") {
            return collectionInstance;
        }
        const getElementByIndex = index => {
            if (collectionInstance._originalCollection) {
                return collectionInstance._originalCollection[index];
            } else if (collectionInstance._originalNodeList) {
                return collectionInstance._originalNodeList[index];
            } else if (typeof collectionInstance[index] !== "undefined") {
                return collectionInstance[index];
            }
            return null;
        };
        const createIndexBasedUpdater = (propertyName, transformer = null) => function(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
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
                        if (element.update && typeof element.update === "function") {
                            element.update({
                                [propertyName]: finalValue
                            });
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
        const createIndexBasedStyleUpdater = () => function(updates = {}) {
            Object.entries(updates).forEach(([index, styleObj]) => {
                try {
                    const numIndex = parseInt(index);
                    if (isNaN(numIndex)) return;
                    const element = getElementByIndex(numIndex);
                    if (element && element.nodeType === Node.ELEMENT_NODE && typeof styleObj === "object") {
                        if (element.update && typeof element.update === "function") {
                            element.update({
                                style: styleObj
                            });
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
        const createIndexBasedDatasetUpdater = () => function(updates = {}) {
            Object.entries(updates).forEach(([index, dataObj]) => {
                try {
                    const numIndex = parseInt(index);
                    if (isNaN(numIndex)) return;
                    const element = getElementByIndex(numIndex);
                    if (element && element.nodeType === Node.ELEMENT_NODE && typeof dataObj === "object") {
                        if (element.update && typeof element.update === "function") {
                            element.update({
                                dataset: dataObj
                            });
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
        const createIndexBasedClassesUpdater = () => function(updates = {}) {
            Object.entries(updates).forEach(([index, classConfig]) => {
                try {
                    const numIndex = parseInt(index);
                    if (isNaN(numIndex)) return;
                    const element = getElementByIndex(numIndex);
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (typeof classConfig === "string") {
                            element.className = classConfig;
                            return;
                        }
                        if (typeof classConfig === "object" && classConfig !== null) {
                            if (element.update && typeof element.update === "function") {
                                element.update({
                                    classList: classConfig
                                });
                            } else {
                                Object.entries(classConfig).forEach(([method, classes]) => {
                                    const classList = Array.isArray(classes) ? classes : [ classes ];
                                    switch (method) {
                                      case "add":
                                        element.classList.add(...classList);
                                        break;

                                      case "remove":
                                        element.classList.remove(...classList);
                                        break;

                                      case "toggle":
                                        classList.forEach(cls => element.classList.toggle(cls));
                                        break;

                                      case "replace":
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
        try {
            Object.defineProperty(collectionInstance, "textContent", {
                value: createIndexBasedUpdater("textContent"),
                writable: false,
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(collectionInstance, "innerHTML", {
                value: createIndexBasedUpdater("innerHTML"),
                writable: false,
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(collectionInstance, "value", {
                value: createIndexBasedUpdater("value"),
                writable: false,
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(collectionInstance, "style", {
                value: createIndexBasedStyleUpdater(),
                writable: false,
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(collectionInstance, "dataset", {
                value: createIndexBasedDatasetUpdater(),
                writable: false,
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(collectionInstance, "classes", {
                value: createIndexBasedClassesUpdater(),
                writable: false,
                enumerable: false,
                configurable: true
            });
        } catch (error) {
            collectionInstance.textContent = createIndexBasedUpdater("textContent");
            collectionInstance.innerHTML = createIndexBasedUpdater("innerHTML");
            collectionInstance.value = createIndexBasedUpdater("value");
            collectionInstance.style = createIndexBasedStyleUpdater();
            collectionInstance.dataset = createIndexBasedDatasetUpdater();
            collectionInstance.classes = createIndexBasedClassesUpdater();
        }
        return collectionInstance;
    }
    function wrapCollectionsHelper(Collections) {
        if (!Collections) return;
        const originalClassName = Collections.ClassName;
        const originalTagName = Collections.TagName;
        const originalName = Collections.Name;
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
    function initializeBulkUpdaters() {
        if (typeof global.Elements !== "undefined") {
            enhanceElementsHelper(global.Elements);
        }
        if (typeof global.Collections !== "undefined") {
            wrapCollectionsHelper(global.Collections);
        }
        if (typeof global.DOMHelpers !== "undefined") {
            global.DOMHelpers.BulkPropertyUpdaters = {
                version: "1.0.0",
                enhanceElementsHelper: enhanceElementsHelper,
                enhanceCollectionInstance: enhanceCollectionInstance,
                wrapCollectionsHelper: wrapCollectionsHelper
            };
        }
    }
    if (typeof global.Elements !== "undefined" || typeof global.Collections !== "undefined") {
        initializeBulkUpdaters();
    } else {
        if (typeof document !== "undefined") {
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", initializeBulkUpdaters);
            } else {
                setTimeout(initializeBulkUpdaters, 100);
            }
        }
    }
    if (typeof module !== "undefined" && module.exports) {
        module.exports = {
            enhanceElementsHelper: enhanceElementsHelper,
            enhanceCollectionInstance: enhanceCollectionInstance,
            wrapCollectionsHelper: wrapCollectionsHelper,
            initializeBulkUpdaters: initializeBulkUpdaters
        };
    } else if (typeof define === "function" && define.amd) {
        define([], function() {
            return {
                enhanceElementsHelper: enhanceElementsHelper,
                enhanceCollectionInstance: enhanceCollectionInstance,
                wrapCollectionsHelper: wrapCollectionsHelper,
                initializeBulkUpdaters: initializeBulkUpdaters
            };
        });
    } else {
        global.BulkPropertyUpdaters = {
            enhanceElementsHelper: enhanceElementsHelper,
            enhanceCollectionInstance: enhanceCollectionInstance,
            wrapCollectionsHelper: wrapCollectionsHelper,
            initializeBulkUpdaters: initializeBulkUpdaters
        };
    }
})(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);

/**
 * 03_dh-collection-shortcuts
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
    "use strict";
    if (typeof global.Collections === "undefined") {
        console.error("[Global Shortcuts] Collections helper not found. Please load DOM Helpers library first.");
        return;
    }
    function createEnhancedCollectionWrapper(collection) {
        if (!collection) return collection;
        if (collection._isEnhancedWrapper) {
            return collection;
        }
        return new Proxy(collection, {
            get(target, prop) {
                if (typeof prop === "symbol") {
                    return target[prop];
                }
                if (prop === "constructor" || prop === "prototype" || prop === "length" || prop === "toString" || prop === "valueOf" || prop === "toLocaleString" || prop === "_isEnhancedWrapper" || prop === "_originalCollection" || prop === "_originalNodeList" || prop === "_hasIndexedUpdateSupport" || prop === "update" || prop === "item" || prop === "entries" || prop === "keys" || prop === "values" || prop === "forEach" || prop === "namedItem") {
                    return target[prop];
                }
                if (!isNaN(prop)) {
                    const index = parseInt(prop);
                    let element;
                    if (index < 0) {
                        const positiveIndex = target.length + index;
                        element = target[positiveIndex];
                    } else {
                        element = target[index];
                    }
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (global.EnhancedUpdateUtility && global.EnhancedUpdateUtility.enhanceElementWithUpdate) {
                            return global.EnhancedUpdateUtility.enhanceElementWithUpdate(element);
                        }
                    }
                    return element;
                }
                return target[prop];
            },
            set(target, prop, value) {
                if (typeof prop === "symbol") {
                    return false;
                }
                if (!isNaN(prop)) {
                    const index = parseInt(prop);
                    if (index >= 0 && index < target.length) {
                        console.warn("[Global Shortcuts] Cannot set element at index in live collection");
                        return false;
                    }
                }
                try {
                    target[prop] = value;
                    return true;
                } catch (e) {
                    return false;
                }
            }
        });
    }
    function createGlobalCollectionProxy(type) {
        const collectionHelper = global.Collections[type];
        if (!collectionHelper) {
            console.warn(`[Global Shortcuts] Collections.${type} not found`);
            return null;
        }
        const baseFunction = function(value) {
            const collection = collectionHelper(value);
            return createEnhancedCollectionWrapper(collection);
        };
        return new Proxy(baseFunction, {
            get: (target, prop) => {
                if (typeof prop === "symbol" || prop === "constructor" || prop === "prototype" || prop === "apply" || prop === "call" || prop === "bind" || prop === "length" || prop === "name") {
                    return target[prop];
                }
                if (prop === "toString" || prop === "valueOf") {
                    return target[prop];
                }
                const collection = collectionHelper[prop];
                return createEnhancedCollectionWrapper(collection);
            },
            apply: (target, thisArg, args) => {
                const collection = collectionHelper(...args);
                return createEnhancedCollectionWrapper(collection);
            },
            has: (target, prop) => prop in collectionHelper,
            ownKeys: target => Reflect.ownKeys(collectionHelper),
            getOwnPropertyDescriptor: (target, prop) => Reflect.getOwnPropertyDescriptor(collectionHelper, prop)
        });
    }
    const ClassName = createGlobalCollectionProxy("ClassName");
    const TagName = createGlobalCollectionProxy("TagName");
    const Name = createGlobalCollectionProxy("Name");
    if (ClassName) global.ClassName = ClassName;
    if (TagName) global.TagName = TagName;
    if (Name) global.Name = Name;
    if (typeof global.DOMHelpers !== "undefined") {
        if (ClassName) global.DOMHelpers.ClassName = ClassName;
        if (TagName) global.DOMHelpers.TagName = TagName;
        if (Name) global.DOMHelpers.Name = Name;
    }
    const GlobalCollectionShortcuts = {
        ClassName: ClassName,
        TagName: TagName,
        Name: Name,
        version: "2.0.1"
    };
    if (typeof module !== "undefined" && module.exports) {
        module.exports = GlobalCollectionShortcuts;
    }
    if (typeof define === "function" && define.amd) {
        define([], function() {
            return GlobalCollectionShortcuts;
        });
    }
    global.GlobalCollectionShortcuts = GlobalCollectionShortcuts;
    if (typeof console !== "undefined" && console.log) {
        console.log("[DOM Helpers] Global shortcuts v2.0.1 loaded with index support");
        console.log("[DOM Helpers] Usage: ClassName.button[0], TagName.div[1], Name.username[-1]");
    }
})(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);

/**
 * 04_dh-global-query
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
 * 05_dh-indexed-collection-updates
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
    const hasEnhancedUpdateUtility = typeof global.EnhancedUpdateUtility !== "undefined";
    const hasGlobalQuery = typeof global.querySelectorAll === "function" || typeof global.queryAll === "function";
    if (!hasEnhancedUpdateUtility) {
        console.warn("[Indexed Updates] EnhancedUpdateUtility not found. Load main DOM helpers first!");
    }
    if (!hasGlobalQuery) {
        console.warn("[Indexed Updates] Global query functions not found. Load global-query.js first!");
    }
    function applyUpdatesToElement(element, updates) {
        if (typeof global.EnhancedUpdateUtility !== "undefined" && global.EnhancedUpdateUtility.applyEnhancedUpdate) {
            Object.entries(updates).forEach(([key, value]) => {
                global.EnhancedUpdateUtility.applyEnhancedUpdate(element, key, value);
            });
        } else if (typeof element.update === "function") {
            element.update(updates);
        } else {
            applyBasicUpdate(element, updates);
        }
    }
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
                        const classList = Array.isArray(classes) ? classes : [ classes ];
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
    function updateCollectionWithIndices(collection, updates) {
        if (!collection) {
            console.warn("[Indexed Updates] .update() called on null collection");
            return collection;
        }
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
            const indexUpdates = {};
            const bulkUpdates = {};
            let hasIndexUpdates = false;
            let hasBulkUpdates = false;
            updateKeys.forEach(key => {
                if (typeof key === "symbol") return;
                const asNumber = Number(key);
                if (Number.isFinite(asNumber) && Number.isInteger(asNumber) && String(asNumber) === key) {
                    indexUpdates[key] = updates[key];
                    hasIndexUpdates = true;
                } else {
                    bulkUpdates[key] = updates[key];
                    hasBulkUpdates = true;
                }
            });
            if (hasBulkUpdates) {
                console.log("[Indexed Updates] Applying bulk updates to all elements");
                elements.forEach(element => {
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        applyUpdatesToElement(element, bulkUpdates);
                    }
                });
            }
            if (hasIndexUpdates) {
                console.log("[Indexed Updates] Applying index-specific updates");
                Object.entries(indexUpdates).forEach(([key, elementUpdates]) => {
                    let index = Number(key);
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
            if (!hasIndexUpdates && !hasBulkUpdates) {
                console.log("[Indexed Updates] No updates applied");
            }
        } catch (error) {
            console.warn(`[Indexed Updates] Error in collection .update(): ${error.message}`);
            console.error(error);
        }
        return collection;
    }
    function patchCollectionUpdate(collection) {
        if (!collection || collection._hasIndexedUpdateSupport) {
            return collection;
        }
        const originalUpdate = collection.update;
        try {
            Object.defineProperty(collection, "update", {
                value: function(updates = {}) {
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
            collection.update = function(updates = {}) {
                return updateCollectionWithIndices(this, updates);
            };
            collection._hasIndexedUpdateSupport = true;
        }
        return collection;
    }
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
    if (hasEnhancedUpdateUtility && global.EnhancedUpdateUtility.enhanceCollectionWithUpdate) {
        const originalEnhance = global.EnhancedUpdateUtility.enhanceCollectionWithUpdate;
        global.EnhancedUpdateUtility.enhanceCollectionWithUpdate = function(collection) {
            const enhanced = originalEnhance.call(this, collection);
            return patchCollectionUpdate(enhanced);
        };
        console.log("[Indexed Updates] Patched EnhancedUpdateUtility.enhanceCollectionWithUpdate");
    }
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
})(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);

(function patchSelectorForBulkUpdates() {
    if (typeof Selector === "undefined" || typeof BulkPropertyUpdaters === "undefined") return;
    const originalQueryAll = Selector.queryAll;
    Selector.queryAll = function(...args) {
        const result = originalQueryAll.apply(this, args);
        return BulkPropertyUpdaters.enhanceCollectionInstance(result);
    };
})();

/**
 * 07_dh-global-collection-indexed-updates
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
    "use strict";
    const hasCollections = typeof global.Collections !== "undefined";
    const hasGlobalShortcuts = typeof global.ClassName !== "undefined" || typeof global.TagName !== "undefined" || typeof global.Name !== "undefined";
    const hasUpdateUtility = typeof global.EnhancedUpdateUtility !== "undefined";
    if (!hasCollections) {
        console.error("[Global Shortcuts Indexed Updates] Collections helper not found. Please load DOM Helpers library first.");
        return;
    }
    if (!hasGlobalShortcuts) {
        console.error("[Global Shortcuts Indexed Updates] Global Collection Shortcuts not found. Please load global-collection-shortcuts.js first.");
        return;
    }
    if (!hasUpdateUtility) {
        console.warn("[Global Shortcuts Indexed Updates] EnhancedUpdateUtility not found. Basic update functionality will be limited.");
    }
    function updateCollectionWithIndices(collection, updates) {
        if (!collection) {
            console.warn("[Global Shortcuts Indexed Updates] .update() called on null collection");
            return collection;
        }
        let elements = [];
        if (collection.length !== undefined) {
            for (let i = 0; i < collection.length; i++) {
                elements.push(collection[i]);
            }
        } else {
            console.warn("[Global Shortcuts Indexed Updates] .update() called on unrecognized collection type");
            return collection;
        }
        if (elements.length === 0) {
            console.info("[Global Shortcuts Indexed Updates] .update() called on empty collection");
            return collection;
        }
        try {
            const updateKeys = Object.keys(updates);
            const indexUpdates = {};
            const bulkUpdates = {};
            let hasNumericIndices = false;
            let hasBulkUpdates = false;
            updateKeys.forEach(key => {
                const num = parseInt(key, 10);
                if (!isNaN(num) && key === String(num)) {
                    indexUpdates[key] = updates[key];
                    hasNumericIndices = true;
                } else {
                    bulkUpdates[key] = updates[key];
                    hasBulkUpdates = true;
                }
            });
            if (hasBulkUpdates) {
                console.log("[Global Shortcuts Indexed Updates] Applying bulk updates to all elements");
                elements.forEach(element => {
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        applyUpdatesToElement(element, bulkUpdates);
                    }
                });
            }
            if (hasNumericIndices) {
                console.log("[Global Shortcuts Indexed Updates] Applying index-specific updates");
                Object.entries(indexUpdates).forEach(([key, elementUpdates]) => {
                    let index = parseInt(key, 10);
                    if (index < 0) {
                        index = elements.length + index;
                    }
                    const element = elements[index];
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (elementUpdates && typeof elementUpdates === "object") {
                            applyUpdatesToElement(element, elementUpdates);
                        }
                    } else if (index >= 0 && index < elements.length) {
                        console.warn(`[Global Shortcuts Indexed Updates] Element at index ${key} is not a valid DOM element`);
                    } else {
                        console.warn(`[Global Shortcuts Indexed Updates] No element at index ${key} (resolved to ${index}, collection has ${elements.length} elements)`);
                    }
                });
            }
            if (!hasNumericIndices && !hasBulkUpdates) {
                console.log("[Global Shortcuts Indexed Updates] No updates applied");
            }
        } catch (error) {
            console.error(`[Global Shortcuts Indexed Updates] Error in collection .update(): ${error.message}`);
        }
        return collection;
    }
    function applyUpdatesToElement(element, updates) {
        if (typeof element.update === "function") {
            element.update(updates);
            return;
        }
        if (hasUpdateUtility && global.EnhancedUpdateUtility.applyEnhancedUpdate) {
            Object.entries(updates).forEach(([key, value]) => {
                global.EnhancedUpdateUtility.applyEnhancedUpdate(element, key, value);
            });
            return;
        }
        applyBasicUpdate(element, updates);
    }
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
                        const classList = Array.isArray(classes) ? classes : [ classes ];
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
                        Object.entries(value).forEach(([attr, val]) => {
                            element.setAttribute(attr, val);
                        });
                    }
                    return;
                }
                if (key in element) {
                    element[key] = value;
                } else if (typeof value === "string" || typeof value === "number") {
                    element.setAttribute(key, value);
                }
            } catch (error) {
                console.warn(`[Global Shortcuts Indexed Updates] Failed to apply ${key}:`, error.message);
            }
        });
    }
    function createEnhancedCollectionWithUpdate(collection) {
        if (!collection) return collection;
        if (collection._hasIndexedUpdateSupport) {
            return collection;
        }
        const enhancedCollection = Object.create(null);
        Object.defineProperty(enhancedCollection, "length", {
            get() {
                return collection.length;
            },
            enumerable: false
        });
        for (let i = 0; i < collection.length; i++) {
            Object.defineProperty(enhancedCollection, i, {
                get() {
                    const element = collection[i];
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
        Object.defineProperty(enhancedCollection, "update", {
            value: function(updates = {}) {
                return updateCollectionWithIndices(this, updates);
            },
            writable: false,
            enumerable: false,
            configurable: false
        });
        Object.defineProperty(enhancedCollection, "_hasIndexedUpdateSupport", {
            value: true,
            writable: false,
            enumerable: false,
            configurable: false
        });
        enhancedCollection[Symbol.iterator] = function*() {
            for (let i = 0; i < collection.length; i++) {
                yield enhancedCollection[i];
            }
        };
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
    function patchGlobalShortcut(originalProxy) {
        if (!originalProxy) return originalProxy;
        return new Proxy(originalProxy, {
            get(target, prop) {
                const result = target[prop];
                if (result && typeof result === "object" && "length" in result && !result._hasIndexedUpdateSupport) {
                    return createEnhancedCollectionWithUpdate(result);
                }
                return result;
            },
            apply(target, thisArg, args) {
                const result = Reflect.apply(target, thisArg, args);
                if (result && typeof result === "object" && "length" in result && !result._hasIndexedUpdateSupport) {
                    return createEnhancedCollectionWithUpdate(result);
                }
                return result;
            }
        });
    }
    let patchCount = 0;
    if (global.ClassName) {
        global.ClassName = patchGlobalShortcut(global.ClassName);
        patchCount++;
        console.log("[Global Shortcuts Indexed Updates] ✓ Patched ClassName");
    }
    if (global.TagName) {
        global.TagName = patchGlobalShortcut(global.TagName);
        patchCount++;
        console.log("[Global Shortcuts Indexed Updates] ✓ Patched TagName");
    }
    if (global.Name) {
        global.Name = patchGlobalShortcut(global.Name);
        patchCount++;
        console.log("[Global Shortcuts Indexed Updates] ✓ Patched Name");
    }
    if (typeof global.DOMHelpers !== "undefined") {
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
    const GlobalShortcutsIndexedUpdates = {
        version: "1.1.0",
        updateCollectionWithIndices: updateCollectionWithIndices,
        createEnhancedCollectionWithUpdate: createEnhancedCollectionWithUpdate,
        patchGlobalShortcut: patchGlobalShortcut,
        hasSupport(collection) {
            return !!(collection && collection._hasIndexedUpdateSupport);
        }
    };
    if (typeof module !== "undefined" && module.exports) {
        module.exports = GlobalShortcutsIndexedUpdates;
    }
    if (typeof define === "function" && define.amd) {
        define([], function() {
            return GlobalShortcutsIndexedUpdates;
        });
    }
    global.GlobalShortcutsIndexedUpdates = GlobalShortcutsIndexedUpdates;
    if (typeof global.DOMHelpers !== "undefined") {
        global.DOMHelpers.GlobalShortcutsIndexedUpdates = GlobalShortcutsIndexedUpdates;
    }
    console.log(`[Global Shortcuts Indexed Updates] v1.1.0 loaded - ${patchCount} shortcuts patched (FIXED)`);
    console.log("[Global Shortcuts Indexed Updates] ✓ Now supports BOTH bulk and index-specific updates");
    console.log("[Global Shortcuts Indexed Updates] Usage: ClassName.button.update({ [0]: {...}, classList: {...} })");
})(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);

/**
 * 08_dh-bulk-properties-updater-global-query
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
    "use strict";
    function enhanceElement(element) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
            return element;
        }
        if (element._domHelpersEnhanced) {
            return element;
        }
        Object.defineProperty(element, "_domHelpersEnhanced", {
            value: true,
            writable: false,
            enumerable: false,
            configurable: false
        });
        const updateMethod = function(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn("[DOM Helpers] update() requires an object with properties to update");
                return this;
            }
            Object.entries(updates).forEach(([key, value]) => {
                try {
                    switch (key) {
                      case "style":
                        if (typeof value === "object" && value !== null) {
                            Object.entries(value).forEach(([prop, val]) => {
                                if (val !== null && val !== undefined) {
                                    this.style[prop] = val;
                                }
                            });
                        }
                        break;

                      case "dataset":
                        if (typeof value === "object" && value !== null) {
                            Object.entries(value).forEach(([dataKey, dataVal]) => {
                                this.dataset[dataKey] = dataVal;
                            });
                        }
                        break;

                      case "classList":
                        if (typeof value === "object" && value !== null) {
                            Object.entries(value).forEach(([method, classes]) => {
                                const classList = Array.isArray(classes) ? classes : [ classes ];
                                switch (method) {
                                  case "add":
                                    this.classList.add(...classList);
                                    break;

                                  case "remove":
                                    this.classList.remove(...classList);
                                    break;

                                  case "toggle":
                                    classList.forEach(cls => this.classList.toggle(cls));
                                    break;

                                  case "replace":
                                    if (classList.length === 2) {
                                        this.classList.replace(classList[0], classList[1]);
                                    }
                                    break;
                                }
                            });
                        }
                        break;

                      case "attrs":
                      case "attributes":
                        if (typeof value === "object" && value !== null) {
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
            return this;
        };
        Object.defineProperty(element, "update", {
            value: updateMethod,
            writable: false,
            enumerable: false,
            configurable: true
        });
        return element;
    }
    function createIndexBasedPropertyUpdater(propertyName, transformer = null) {
        return function(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
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
                        if (element.update && typeof element.update === "function") {
                            element.update({
                                [propertyName]: finalValue
                            });
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
    function createIndexBasedStyleUpdater() {
        return function(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn("[DOM Helpers] style() requires an object with numeric indices as keys");
                return this;
            }
            Object.entries(updates).forEach(([index, styleObj]) => {
                try {
                    const numIndex = parseInt(index);
                    if (isNaN(numIndex)) return;
                    const element = this[numIndex];
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (typeof styleObj !== "object" || styleObj === null) {
                            console.warn(`[DOM Helpers] style() requires style object for index ${index}`);
                            return;
                        }
                        if (element.update && typeof element.update === "function") {
                            element.update({
                                style: styleObj
                            });
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
    function createIndexBasedDatasetUpdater() {
        return function(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn("[DOM Helpers] dataset() requires an object with numeric indices as keys");
                return this;
            }
            Object.entries(updates).forEach(([index, dataObj]) => {
                try {
                    const numIndex = parseInt(index);
                    if (isNaN(numIndex)) return;
                    const element = this[numIndex];
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (typeof dataObj !== "object" || dataObj === null) {
                            console.warn(`[DOM Helpers] dataset() requires data object for index ${index}`);
                            return;
                        }
                        if (element.update && typeof element.update === "function") {
                            element.update({
                                dataset: dataObj
                            });
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
    function createIndexBasedAttributesUpdater() {
        return function(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn("[DOM Helpers] attrs() requires an object with numeric indices as keys");
                return this;
            }
            Object.entries(updates).forEach(([index, attrsObj]) => {
                try {
                    const numIndex = parseInt(index);
                    if (isNaN(numIndex)) return;
                    const element = this[numIndex];
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (typeof attrsObj !== "object" || attrsObj === null) {
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
    function createIndexBasedClassListUpdater() {
        return function(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn("[DOM Helpers] classes() requires an object with numeric indices as keys");
                return this;
            }
            Object.entries(updates).forEach(([index, classConfig]) => {
                try {
                    const numIndex = parseInt(index);
                    if (isNaN(numIndex)) return;
                    const element = this[numIndex];
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (typeof classConfig === "string") {
                            element.className = classConfig;
                            return;
                        }
                        if (typeof classConfig === "object" && classConfig !== null) {
                            if (element.update && typeof element.update === "function") {
                                element.update({
                                    classList: classConfig
                                });
                            } else {
                                Object.entries(classConfig).forEach(([method, classes]) => {
                                    try {
                                        const classList = Array.isArray(classes) ? classes : [ classes ];
                                        switch (method) {
                                          case "add":
                                            element.classList.add(...classList);
                                            break;

                                          case "remove":
                                            element.classList.remove(...classList);
                                            break;

                                          case "toggle":
                                            classList.forEach(cls => element.classList.toggle(cls));
                                            break;

                                          case "replace":
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
    function createIndexBasedGenericPropertyUpdater() {
        return function(propertyPath, updates = {}) {
            if (typeof propertyPath !== "string") {
                console.warn("[DOM Helpers] prop() requires a property name as first argument");
                return this;
            }
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn("[DOM Helpers] prop() requires an object with numeric indices as keys");
                return this;
            }
            const isNested = propertyPath.includes(".");
            const pathParts = isNested ? propertyPath.split(".") : null;
            Object.entries(updates).forEach(([index, value]) => {
                try {
                    const numIndex = parseInt(index);
                    if (isNaN(numIndex)) return;
                    const element = this[numIndex];
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (isNested) {
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
    function enhanceNodeList(nodeList) {
        if (!nodeList || nodeList.length === 0) {
            const emptyArray = [];
            emptyArray.update = function() {
                return this;
            };
            const noopMethod = function() {
                return this;
            };
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
        const elements = Array.from(nodeList).map(el => enhanceElement(el));
        const enhancedCollection = Object.create(Array.prototype);
        elements.forEach((el, index) => {
            enhancedCollection[index] = el;
        });
        Object.defineProperty(enhancedCollection, "length", {
            value: elements.length,
            writable: false,
            enumerable: false,
            configurable: false
        });
        Object.defineProperty(enhancedCollection, "_originalNodeList", {
            value: nodeList,
            writable: false,
            enumerable: false,
            configurable: false
        });
        const updateMethod = function(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn("[DOM Helpers] update() requires an object with updates");
                return this;
            }
            Object.entries(updates).forEach(([key, value]) => {
                const numericIndex = parseInt(key);
                if (!isNaN(numericIndex) && numericIndex >= 0 && numericIndex < this.length) {
                    const element = this[numericIndex];
                    if (element && element.update) {
                        element.update(value);
                    }
                } else {
                    this.forEach((element, index) => {
                        if (element && element.update) {
                            element.update({
                                [key]: value
                            });
                        }
                    });
                }
            });
            return this;
        };
        const defineMethod = (name, method) => {
            try {
                Object.defineProperty(enhancedCollection, name, {
                    value: method,
                    writable: false,
                    enumerable: false,
                    configurable: true
                });
            } catch (error) {
                enhancedCollection[name] = method;
            }
        };
        defineMethod("update", updateMethod);
        defineMethod("forEach", Array.prototype.forEach);
        defineMethod("map", Array.prototype.map);
        defineMethod("filter", Array.prototype.filter);
        defineMethod("find", Array.prototype.find);
        defineMethod("findIndex", Array.prototype.findIndex);
        defineMethod("some", Array.prototype.some);
        defineMethod("every", Array.prototype.every);
        defineMethod("reduce", Array.prototype.reduce);
        defineMethod("slice", Array.prototype.slice);
        defineMethod("textContent", createIndexBasedPropertyUpdater("textContent"));
        defineMethod("innerHTML", createIndexBasedPropertyUpdater("innerHTML"));
        defineMethod("innerText", createIndexBasedPropertyUpdater("innerText"));
        defineMethod("value", createIndexBasedPropertyUpdater("value"));
        defineMethod("placeholder", createIndexBasedPropertyUpdater("placeholder"));
        defineMethod("title", createIndexBasedPropertyUpdater("title"));
        defineMethod("disabled", createIndexBasedPropertyUpdater("disabled"));
        defineMethod("checked", createIndexBasedPropertyUpdater("checked"));
        defineMethod("readonly", createIndexBasedPropertyUpdater("readOnly"));
        defineMethod("hidden", createIndexBasedPropertyUpdater("hidden"));
        defineMethod("selected", createIndexBasedPropertyUpdater("selected"));
        defineMethod("src", createIndexBasedPropertyUpdater("src"));
        defineMethod("href", createIndexBasedPropertyUpdater("href"));
        defineMethod("alt", createIndexBasedPropertyUpdater("alt"));
        defineMethod("style", createIndexBasedStyleUpdater());
        defineMethod("dataset", createIndexBasedDatasetUpdater());
        defineMethod("attrs", createIndexBasedAttributesUpdater());
        defineMethod("classes", createIndexBasedClassListUpdater());
        defineMethod("prop", createIndexBasedGenericPropertyUpdater());
        return enhancedCollection;
    }
    function querySelector(selector, context = document) {
        if (typeof selector !== "string") {
            console.warn("[DOM Helpers] querySelector requires a string selector");
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
    function querySelectorAll(selector, context = document) {
        if (typeof selector !== "string") {
            console.warn("[DOM Helpers] querySelectorAll requires a string selector");
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
    const query = querySelector;
    const queryAll = querySelectorAll;
    const EnhancedQuerySelectors = {
        querySelector: querySelector,
        querySelectorAll: querySelectorAll,
        query: query,
        queryAll: queryAll,
        enhanceElement: enhanceElement,
        enhanceNodeList: enhanceNodeList,
        version: "1.0.0"
    };
    if (typeof global !== "undefined") {
        global.querySelector = querySelector;
        global.querySelectorAll = querySelectorAll;
        global.query = query;
        global.queryAll = queryAll;
    }
    if (typeof global.DOMHelpers !== "undefined") {
        global.DOMHelpers.EnhancedQuerySelectors = EnhancedQuerySelectors;
    }
    if (typeof module !== "undefined" && module.exports) {
        module.exports = EnhancedQuerySelectors;
    } else if (typeof define === "function" && define.amd) {
        define([], function() {
            return EnhancedQuerySelectors;
        });
    } else {
        global.EnhancedQuerySelectors = EnhancedQuerySelectors;
    }
})(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);

/**
 * 09_dh-selector-update-patch
 * 
 * 
 * DOM Helpers - Selector Update Patch
 * Adds index-based access and update capabilities
 * 
 * @version 2.0.0
 * @license MIT
 */
(function(global) {
    "use strict";
    if (typeof global.Collections === "undefined" && typeof global.Selector === "undefined") {
        console.warn("[Index Selection] DOM Helpers not found.");
        return;
    }
    function ensureElementHasUpdate(element) {
        if (!element || element._hasUpdateMethod || element._hasEnhancedUpdateMethod) {
            return element;
        }
        if (typeof global.enhanceElementWithUpdate === "function") {
            return global.enhanceElementWithUpdate(element);
        }
        if (global.EnhancedUpdateUtility && global.EnhancedUpdateUtility.enhanceElementWithUpdate) {
            return global.EnhancedUpdateUtility.enhanceElementWithUpdate(element);
        }
        addBasicUpdateMethod(element);
        return element;
    }
    function addBasicUpdateMethod(element) {
        if (!element || element._hasUpdateMethod) return element;
        try {
            Object.defineProperty(element, "update", {
                value: function(updates = {}) {
                    if (!updates || typeof updates !== "object") {
                        console.warn("[Index Selection] .update() requires an object");
                        return element;
                    }
                    Object.entries(updates).forEach(([key, value]) => {
                        try {
                            if (key === "style" && typeof value === "object" && value !== null) {
                                Object.entries(value).forEach(([prop, val]) => {
                                    if (val !== null && val !== undefined) {
                                        element.style[prop] = val;
                                    }
                                });
                                return;
                            }
                            if (key === "classList" && typeof value === "object" && value !== null) {
                                Object.entries(value).forEach(([method, classes]) => {
                                    const classList = Array.isArray(classes) ? classes : [ classes ];
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

                                      case "replace":
                                        if (classes.length === 2) element.classList.replace(classes[0], classes[1]);
                                        break;
                                    }
                                });
                                return;
                            }
                            if (key === "setAttribute") {
                                if (Array.isArray(value) && value.length >= 2) {
                                    element.setAttribute(value[0], value[1]);
                                } else if (typeof value === "object" && value !== null) {
                                    Object.entries(value).forEach(([attr, val]) => element.setAttribute(attr, val));
                                }
                                return;
                            }
                            if (key === "removeAttribute") {
                                const attrs = Array.isArray(value) ? value : [ value ];
                                attrs.forEach(attr => element.removeAttribute(attr));
                                return;
                            }
                            if (key === "dataset" && typeof value === "object" && value !== null) {
                                Object.entries(value).forEach(([k, v]) => element.dataset[k] = v);
                                return;
                            }
                            if (key === "addEventListener") {
                                if (Array.isArray(value) && value.length >= 2) {
                                    element.addEventListener(value[0], value[1], value[2]);
                                } else if (typeof value === "object" && value !== null) {
                                    Object.entries(value).forEach(([event, handler]) => {
                                        if (typeof handler === "function") {
                                            element.addEventListener(event, handler);
                                        } else if (Array.isArray(handler)) {
                                            element.addEventListener(event, handler[0], handler[1]);
                                        }
                                    });
                                }
                                return;
                            }
                            if (key.startsWith("on") && typeof value === "function") {
                                element[key] = value;
                                return;
                            }
                            if (typeof element[key] === "function") {
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
                            if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
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
            Object.defineProperty(element, "_hasUpdateMethod", {
                value: true,
                writable: false,
                enumerable: false,
                configurable: false
            });
        } catch (error) {
            element.update = function(updates) {};
            element._hasUpdateMethod = true;
        }
        return element;
    }
    function createEnhancedCollectionProxy(collection) {
        if (!collection) return collection;
        return new Proxy(collection, {
            get(target, prop) {
                if (!isNaN(prop) && parseInt(prop) >= 0) {
                    const index = parseInt(prop);
                    let element;
                    if (target._originalCollection) {
                        element = target._originalCollection[index];
                    } else if (target._originalNodeList) {
                        element = target._originalNodeList[index];
                    } else if (target[index]) {
                        element = target[index];
                    }
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        return ensureElementHasUpdate(element);
                    }
                    return element;
                }
                if (prop === "at" && typeof target.at === "function") {
                    return function(index) {
                        const element = target.at.call(target, index);
                        if (element && element.nodeType === Node.ELEMENT_NODE) {
                            return ensureElementHasUpdate(element);
                        }
                        return element;
                    };
                }
                return target[prop];
            }
        });
    }
    function createIndexAwareUpdate(collection) {
        return function indexAwareUpdate(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn("[Index Selection] .update() requires an object");
                return collection;
            }
            let elements = [];
            if (collection._originalCollection) {
                elements = Array.from(collection._originalCollection);
            } else if (collection._originalNodeList) {
                elements = Array.from(collection._originalNodeList);
            } else if (collection.length !== undefined) {
                elements = Array.from(collection);
            }
            if (elements.length === 0) {
                console.info("[Index Selection] Collection is empty");
                return collection;
            }
            const length = elements.length;
            const indexUpdates = {};
            const bulkUpdates = {};
            let hasIndexUpdates = false;
            let hasBulkUpdates = false;
            Object.entries(updates).forEach(([key, value]) => {
                if (/^-?\d+$/.test(key)) {
                    indexUpdates[key] = value;
                    hasIndexUpdates = true;
                } else {
                    bulkUpdates[key] = value;
                    hasBulkUpdates = true;
                }
            });
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
    function wrapCollection(collection) {
        if (!collection || collection._indexSelectionEnhanced) {
            return collection;
        }
        const newUpdate = createIndexAwareUpdate(collection);
        try {
            Object.defineProperty(collection, "update", {
                value: newUpdate,
                writable: true,
                enumerable: false,
                configurable: true
            });
        } catch (error) {
            collection.update = newUpdate;
        }
        try {
            Object.defineProperty(collection, "_indexSelectionEnhanced", {
                value: true,
                writable: false,
                enumerable: false,
                configurable: false
            });
        } catch (error) {
            collection._indexSelectionEnhanced = true;
        }
        return createEnhancedCollectionProxy(collection);
    }
    function hookCollections() {
        if (!global.Collections || !global.Collections.helper) return;
        const helper = global.Collections.helper;
        if (helper._enhanceCollection) {
            const original = helper._enhanceCollection.bind(helper);
            helper._enhanceCollection = function(htmlCollection, type, value) {
                const collection = original(htmlCollection, type, value);
                return wrapCollection(collection);
            };
        }
        if (helper._enhanceCollectionWithUpdate) {
            const original = helper._enhanceCollectionWithUpdate.bind(helper);
            helper._enhanceCollectionWithUpdate = function(collection) {
                const enhanced = original(collection);
                return wrapCollection(enhanced);
            };
        }
    }
    function hookSelector() {
        if (!global.Selector || !global.Selector.helper) return;
        const helper = global.Selector.helper;
        if (helper._enhanceNodeList) {
            const original = helper._enhanceNodeList.bind(helper);
            helper._enhanceNodeList = function(nodeList, selector) {
                const collection = original(nodeList, selector);
                return wrapCollection(collection);
            };
        }
        if (helper._enhanceCollectionWithUpdate) {
            const original = helper._enhanceCollectionWithUpdate.bind(helper);
            helper._enhanceCollectionWithUpdate = function(collection) {
                const enhanced = original(collection);
                return wrapCollection(enhanced);
            };
        }
    }
    function initialize() {
        try {
            hookCollections();
            hookSelector();
            console.log("[Index Selection] v2.0.0 initialized - Individual element access enhanced");
            return true;
        } catch (error) {
            console.error("[Index Selection] Failed to initialize:", error);
            return false;
        }
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }
    const IndexSelection = {
        version: "2.0.0",
        enhance: wrapCollection,
        enhanceElement: ensureElementHasUpdate,
        reinitialize: initialize,
        isEnhanced: collection => collection && collection._indexSelectionEnhanced === true,
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
    if (typeof module !== "undefined" && module.exports) {
        module.exports = IndexSelection;
    } else if (typeof define === "function" && define.amd) {
        define([], () => IndexSelection);
    } else {
        global.IndexSelection = IndexSelection;
        if (global.DOMHelpers) {
            global.DOMHelpers.IndexSelection = IndexSelection;
        }
    }
})(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);

