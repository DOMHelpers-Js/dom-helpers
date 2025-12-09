/**
 * 01_dh-form
 * 
 * DOM Helpers - Form Module
 * Specialized form handling utilities that integrate with the main DOM Helpers library
 * 
 * Features:
 * - Forms object for accessing forms by ID
 * - Automatic form value extraction and setting
 * - Declarative form handling with .update() method
 * - Seamless integration with Elements, Collections, and Selector
 * - Enhanced form validation and submission handling
 * 
 * @version 1.0.0
 * @license MIT
 */

(function(global) {
  'use strict';

  // Check if main DOM Helpers library is loaded
  if (typeof global.Elements === 'undefined' && typeof Elements === 'undefined') {
    console.warn('[DOM Helpers Form] Main DOM Helpers library must be loaded before the Form module');
    return;
  }

  /**
   * Enhanced form element wrapper that adds form-specific functionality
   */
  function enhanceFormWithFormMethods(form) {
    if (!form || form._hasFormMethods) {
      return form;
    }

    // Protect against double enhancement
    Object.defineProperty(form, '_hasFormMethods', {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    });

    // Add values getter/setter
    Object.defineProperty(form, 'values', {
      get: function() {
        return getFormValues(form);
      },
      set: function(values) {
        setFormValues(form, values);
      },
      enumerable: true,
      configurable: true
    });

    // Add enhanced reset method
    const originalReset = form.reset;
    form.reset = function(options = {}) {
      if (options.clearCustom !== false) {
        // Clear any custom validation messages
        clearFormValidation(form);
      }
      
      // Call original reset
      originalReset.call(form);
      
      // Trigger custom reset event
      form.dispatchEvent(new CustomEvent('formreset', { 
        detail: { form: form },
        bubbles: true 
      }));
      
      return form;
    };

    // Add validation methods
    form.validate = function(rules = {}) {
      return validateForm(form, rules);
    };

    form.clearValidation = function() {
      clearFormValidation(form);
      return form;
    };

    // Add submission helper
    form.submitData = function(options = {}) {
      return submitFormData(form, options);
    };

    // Add field access helpers
    form.getField = function(name) {
      return getFormField(form, name);
    };

    form.setField = function(name, value) {
      setFormField(form, name, value);
      return form;
    };

    // Add serialization methods
    form.serialize = function(format = 'object') {
      return serializeForm(form, format);
    };

    return form;
  }

  /**
   * Get all form values as an object
   */
  function getFormValues(form) {
    const values = {};
    const formData = new FormData(form);
    
    // Handle regular form fields
    for (const [name, value] of formData.entries()) {
      if (values[name]) {
        // Handle multiple values (checkboxes, multi-select)
        if (Array.isArray(values[name])) {
          values[name].push(value);
        } else {
          values[name] = [values[name], value];
        }
      } else {
        values[name] = value;
      }
    }

    // Handle unchecked checkboxes and radio buttons
    const inputs = form.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    inputs.forEach(input => {
      if (!input.checked && input.name && !values.hasOwnProperty(input.name)) {
        if (input.type === 'checkbox') {
          values[input.name] = false;
        }
        // Radio buttons without selection are omitted
      }
    });

    return values;
  }

  /**
   * Set form values from an object
   */
  function setFormValues(form, values) {
    if (!values || typeof values !== 'object') {
      console.warn('[DOM Helpers Form] Invalid values object provided to setFormValues');
      return;
    }

    Object.entries(values).forEach(([name, value]) => {
      setFormField(form, name, value);
    });
  }

  /**
   * Get a specific form field
   */
  function getFormField(form, name) {
    // Try by name first
    let field = form.querySelector(`[name="${name}"]`);
    
    // Try by id if name doesn't work
    if (!field) {
      field = form.querySelector(`#${name}`);
    }
    
    return field;
  }

  /**
   * Set a specific form field value
   */
  function setFormField(form, name, value) {
    const fields = form.querySelectorAll(`[name="${name}"]`);
    
    if (fields.length === 0) {
      // Try by ID if name doesn't work
      const field = form.querySelector(`#${name}`);
      if (field) {
        setFieldValue(field, value);
      }
      return;
    }

    if (fields.length === 1) {
      setFieldValue(fields[0], value);
    } else {
      // Handle multiple fields (radio buttons, checkboxes)
      fields.forEach(field => {
        if (field.type === 'radio') {
          field.checked = field.value === String(value);
        } else if (field.type === 'checkbox') {
          if (Array.isArray(value)) {
            field.checked = value.includes(field.value);
          } else {
            field.checked = Boolean(value);
          }
        } else {
          setFieldValue(field, value);
        }
      });
    }
  }

  /**
   * Set individual field value based on field type
   */
  function setFieldValue(field, value) {
    if (!field) return;

    switch (field.type) {
      case 'checkbox':
        field.checked = Boolean(value);
        break;
      case 'radio':
        field.checked = field.value === String(value);
        break;
      case 'file':
        // File inputs can't be set programmatically for security reasons
        console.warn('[DOM Helpers Form] Cannot set file input values programmatically');
        break;
      case 'select-multiple':
        if (Array.isArray(value)) {
          Array.from(field.options).forEach(option => {
            option.selected = value.includes(option.value);
          });
        }
        break;
      default:
        field.value = value;
        break;
    }

    // Trigger change event
    field.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /**
   * Validate form with optional rules
   */
  function validateForm(form, rules = {}) {
    const errors = {};
    const values = getFormValues(form);

    // Clear previous validation
    clearFormValidation(form);

    // Built-in HTML5 validation
    const isValid = form.checkValidity();
    if (!isValid) {
      const invalidFields = form.querySelectorAll(':invalid');
      invalidFields.forEach(field => {
        if (field.name) {
          errors[field.name] = field.validationMessage || 'Invalid value';
          markFieldInvalid(field, errors[field.name]);
        }
      });
    }

    // Custom validation rules
    Object.entries(rules).forEach(([fieldName, rule]) => {
      const value = values[fieldName];
      const field = getFormField(form, fieldName);

      if (typeof rule === 'function') {
        const result = rule(value, values, field);
        if (result !== true && result !== undefined) {
          errors[fieldName] = result || 'Invalid value';
          if (field) markFieldInvalid(field, errors[fieldName]);
        }
      } else if (typeof rule === 'object') {
        // Rule object with multiple validators
        Object.entries(rule).forEach(([ruleName, ruleValue]) => {
          if (errors[fieldName]) return; // Skip if already invalid

          let isInvalid = false;
          let message = '';

          switch (ruleName) {
            case 'required':
              if (ruleValue && (!value || (typeof value === 'string' && value.trim() === ''))) {
                isInvalid = true;
                message = 'This field is required';
              }
              break;
            case 'minLength':
              if (value && value.length < ruleValue) {
                isInvalid = true;
                message = `Minimum length is ${ruleValue} characters`;
              }
              break;
            case 'maxLength':
              if (value && value.length > ruleValue) {
                isInvalid = true;
                message = `Maximum length is ${ruleValue} characters`;
              }
              break;
            case 'pattern':
              if (value && !new RegExp(ruleValue).test(value)) {
                isInvalid = true;
                message = 'Invalid format';
              }
              break;
            case 'email':
              if (ruleValue && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                isInvalid = true;
                message = 'Invalid email address';
              }
              break;
            case 'custom':
              if (typeof ruleValue === 'function') {
                const result = ruleValue(value, values, field);
                if (result !== true && result !== undefined) {
                  isInvalid = true;
                  message = result || 'Invalid value';
                }
              }
              break;
          }

          if (isInvalid) {
            errors[fieldName] = message;
            if (field) markFieldInvalid(field, message);
          }
        });
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors,
      values: values
    };
  }

  /**
   * Mark field as invalid with error message
   */
  function markFieldInvalid(field, message) {
    field.classList.add('form-invalid');
    field.setAttribute('aria-invalid', 'true');

    // Create or update error message element
    let errorElement = field.parentNode.querySelector('.form-error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'form-error-message';
      errorElement.style.color = '#dc3545';
      errorElement.style.fontSize = '0.875em';
      errorElement.style.marginTop = '0.25rem';
      field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  /**
   * Clear form validation messages
   */
  function clearFormValidation(form) {
    // Remove invalid classes and attributes
    const invalidFields = form.querySelectorAll('.form-invalid');
    invalidFields.forEach(field => {
      field.classList.remove('form-invalid');
      field.removeAttribute('aria-invalid');
    });

    // Remove error messages
    const errorMessages = form.querySelectorAll('.form-error-message');
    errorMessages.forEach(msg => msg.remove());
  }

  /**
   * Submit form data with enhanced options
   */
  async function submitFormData(form, options = {}) {
    const {
      url = form.action || window.location.href,
      method = form.method || 'POST',
      validate = true,
      validationRules = {},
      beforeSubmit = null,
      onSuccess = null,
      onError = null,
      transform = null
    } = options;

    try {
      // Validate if requested
      if (validate) {
        const validation = validateForm(form, validationRules);
        if (!validation.isValid) {
          if (onError) onError(new Error('Validation failed'), validation.errors);
          return { success: false, errors: validation.errors };
        }
      }

      // Get form data
      let data = getFormValues(form);

      // Transform data if function provided
      if (typeof transform === 'function') {
        data = transform(data);
      }

      // Call beforeSubmit hook
      if (typeof beforeSubmit === 'function') {
        const shouldContinue = await beforeSubmit(data, form);
        if (shouldContinue === false) {
          return { success: false, cancelled: true };
        }
      }

      // Prepare request
      const requestOptions = {
        method: method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (method.toUpperCase() !== 'GET') {
        requestOptions.body = JSON.stringify(data);
      }

      // Make request
      const response = await fetch(url, requestOptions);
      const result = await response.json();

      if (response.ok) {
        if (onSuccess) onSuccess(result, data);
        return { success: true, data: result };
      } else {
        throw new Error(result.message || 'Submission failed');
      }

    } catch (error) {
      if (onError) onError(error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Serialize form data in different formats
   */
  function serializeForm(form, format = 'object') {
    const values = getFormValues(form);

    switch (format) {
      case 'json':
        return JSON.stringify(values);
      case 'formdata':
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => formData.append(key, v));
          } else {
            formData.append(key, value);
          }
        });
        return formData;
      case 'urlencoded':
        return new URLSearchParams(values).toString();
      case 'object':
      default:
        return values;
    }
  }

  /**
   * Enhanced form update method that handles form-specific operations
   */
  function createFormUpdateMethod(form) {
    const originalUpdate = form.update;

    return function formUpdate(updates = {}) {
      if (!updates || typeof updates !== 'object') {
        console.warn('[DOM Helpers Form] .update() called with invalid updates object');
        return form;
      }

      // Handle form-specific updates first
      const formUpdates = { ...updates };
      
      // Handle values setting
      if (formUpdates.values) {
        setFormValues(form, formUpdates.values);
        delete formUpdates.values;
      }

      // Handle validation
      if (formUpdates.validate) {
        const rules = formUpdates.validate === true ? {} : formUpdates.validate;
        validateForm(form, rules);
        delete formUpdates.validate;
      }

      // Handle reset
      if (formUpdates.reset) {
        const resetOptions = formUpdates.reset === true ? {} : formUpdates.reset;
        form.reset(resetOptions);
        delete formUpdates.reset;
      }

      // Handle submission
      if (formUpdates.submit) {
        const submitOptions = formUpdates.submit === true ? {} : formUpdates.submit;
        form.submitData(submitOptions);
        delete formUpdates.submit;
      }

      // Handle remaining updates with original update method
      if (Object.keys(formUpdates).length > 0) {
        return originalUpdate.call(form, formUpdates);
      }

      return form;
    };
  }

  /**
   * Production Forms Helper Class
   */
  class ProductionFormsHelper {
    constructor(options = {}) {
      this.cache = new Map();
      this.options = {
        enableLogging: options.enableLogging ?? false,
        autoCleanup: options.autoCleanup ?? true,
        cleanupInterval: options.cleanupInterval ?? 30000,
        maxCacheSize: options.maxCacheSize ?? 500,
        autoValidation: options.autoValidation ?? false,
        ...options
      };

      this.stats = {
        hits: 0,
        misses: 0,
        cacheSize: 0,
        lastCleanup: Date.now()
      };

      this.cleanupTimer = null;
      this.isDestroyed = false;

      this._initProxy();
      this._initMutationObserver();
      this._scheduleCleanup();
    }

    _initProxy() {
      this.Forms = new Proxy(this, {
        get: (target, prop) => {
          // Handle internal methods and symbols
          if (typeof prop === 'symbol' || 
              prop.startsWith('_') || 
              typeof target[prop] === 'function') {
            return target[prop];
          }
          
          return target._getForm(prop);
        },
        
        has: (target, prop) => target._hasForm(prop),
        
        ownKeys: (target) => target._getKeys(),
        
        getOwnPropertyDescriptor: (target, prop) => {
          if (target._hasForm(prop)) {
            return { 
              enumerable: true, 
              configurable: true, 
              value: target._getForm(prop) 
            };
          }
          return undefined;
        }
      });
    }

    _getForm(prop) {
      if (typeof prop !== 'string') {
        this._warn(`Invalid form property type: ${typeof prop}`);
        return null;
      }

      // Check cache first
      if (this.cache.has(prop)) {
        const form = this.cache.get(prop);
        if (form && form.nodeType === Node.ELEMENT_NODE && document.contains(form)) {
          this.stats.hits++;
          // Return cached form without re-enhancing to avoid circular references
          return form._isEnhancedForm ? form : this._enhanceForm(form);
        } else {
          this.cache.delete(prop);
        }
      }

      // Get form by ID
      const form = document.getElementById(prop);
      if (form && form.tagName.toLowerCase() === 'form') {
        // Check if already enhanced before adding to cache
        const enhancedForm = form._isEnhancedForm ? form : this._enhanceForm(form);
        this._addToCache(prop, enhancedForm);
        this.stats.misses++;
        return enhancedForm;
      }

      this.stats.misses++;
      if (this.options.enableLogging) {
        this._warn(`Form with id '${prop}' not found`);
      }
      return null;
    }

    _hasForm(prop) {
      if (typeof prop !== 'string') return false;
      
      if (this.cache.has(prop)) {
        const form = this.cache.get(prop);
        if (form && form.nodeType === Node.ELEMENT_NODE && document.contains(form)) {
          return true;
        }
        this.cache.delete(prop);
      }
      
      const form = document.getElementById(prop);
      return form && form.tagName.toLowerCase() === 'form';
    }

    _getKeys() {
      // Return all form IDs in the document
      const forms = document.querySelectorAll("form[id]");
      return Array.from(forms).map(form => form.id).filter(id => id);
    }

    _enhanceForm(form) {
      if (!form || form._isEnhancedForm) {
        return form;
      }

      // First enhance with standard DOM helpers functionality
      try {
        if (global.Elements && global.Elements.helper) {
          form = global.Elements.helper._enhanceElementWithUpdate(form);
        } else if (typeof Elements !== 'undefined' && Elements.helper) {
          form = Elements.helper._enhanceElementWithUpdate(form);
        }
      } catch (error) {
        console.warn('[DOM Helpers Form] Could not enhance with Elements helper:', error.message);
      }

      // Then add form-specific enhancements
      form = enhanceFormWithFormMethods(form);

      // Add or replace update method with form-aware version
      if (form.update) {
        // Replace existing update method with form-aware version
        form.update = createFormUpdateMethod(form);
      } else {
        // Create a basic update method if none exists
        form.update = function(updates = {}) {
          if (!updates || typeof updates !== 'object') {
            console.warn('[DOM Helpers Form] .update() called with invalid updates object');
            return form;
          }

          // Handle form-specific updates
          const formUpdates = { ...updates };
          
          // Handle values setting
          if (formUpdates.values) {
            setFormValues(form, formUpdates.values);
            delete formUpdates.values;
          }

          // Handle validation
          if (formUpdates.validate) {
            const rules = formUpdates.validate === true ? {} : formUpdates.validate;
            validateForm(form, rules);
            delete formUpdates.validate;
          }

          // Handle reset
          if (formUpdates.reset) {
            const resetOptions = formUpdates.reset === true ? {} : formUpdates.reset;
            form.reset(resetOptions);
            delete formUpdates.reset;
          }

          // Handle submission
          if (formUpdates.submit) {
            const submitOptions = formUpdates.submit === true ? {} : formUpdates.submit;
            form.submitData(submitOptions);
            delete formUpdates.submit;
          }

          // Handle addEventListener with enhanced functionality
          if (formUpdates.addEventListener) {
            if (typeof handleEnhancedEventListener === 'function') {
              handleEnhancedEventListener(form, formUpdates.addEventListener);
            } else {
              // Fallback to basic event handling
              if (typeof formUpdates.addEventListener === 'object') {
                Object.entries(formUpdates.addEventListener).forEach(([eventType, handler]) => {
                  if (typeof handler === 'function') {
                    form.addEventListener(eventType, handler);
                  }
                });
              }
            }
            delete formUpdates.addEventListener;
          }

          // Handle remaining basic DOM updates
          Object.entries(formUpdates).forEach(([key, value]) => {
            try {
              if (key in form) {
                form[key] = value;
              } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                form.setAttribute(key, value);
              }
            } catch (error) {
              console.warn(`[DOM Helpers Form] Could not set ${key}:`, error.message);
            }
          });

          return form;
        };
      }

      // Mark as enhanced
      Object.defineProperty(form, '_isEnhancedForm', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });

      return form;
    }

    _addToCache(id, form) {
      if (this.cache.size >= this.options.maxCacheSize) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      this.cache.set(id, form);
      this.stats.cacheSize = this.cache.size;
    }

    _initMutationObserver() {
      this.observer = new MutationObserver((mutations) => {
        this._processMutations(mutations);
      });
      
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
        // Handle added nodes
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'form' && node.id) {
            addedIds.add(node.id);
          }
        });

        // Handle removed nodes
        mutation.removedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'form' && node.id) {
            removedIds.add(node.id);
          }
        });

        // Handle ID attribute changes
        if (mutation.type === 'attributes' && mutation.attributeName === 'id') {
          const target = mutation.target;
          if (target.tagName.toLowerCase() === 'form') {
            const oldId = mutation.oldValue;
            const newId = target.id;
            
            if (oldId && oldId !== newId) {
              removedIds.add(oldId);
            }
            if (newId && newId !== oldId) {
              addedIds.add(newId);
            }
          }
        }
      });

      // Update cache
      addedIds.forEach(id => {
        const form = document.getElementById(id);
        if (form && form.tagName.toLowerCase() === 'form') {
          this._addToCache(id, form);
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

      for (const [id, form] of this.cache) {
        if (!form || 
            form.nodeType !== Node.ELEMENT_NODE || 
            !document.contains(form) ||
            form.id !== id ||
            form.tagName.toLowerCase() !== 'form') {
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

    _log(message) {
      if (this.options.enableLogging) {
        console.log(`[Forms] ${message}`);
      }
    }

    _warn(message) {
      if (this.options.enableLogging) {
        console.warn(`[Forms] ${message}`);
      }
    }

    // Public API
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
      this._log('Forms helper destroyed');
    }

    // Utility methods
    getAllForms() {
      const forms = document.querySelectorAll('form[id]');
      return Array.from(forms).map(form => {
        // Don't re-enhance if already enhanced to avoid circular references
        if (form._isEnhancedForm) {
          return form;
        }
        return this._enhanceForm(form);
      });
    }

    validateAll(rules = {}) {
      const results = {};
      this.getAllForms().forEach(form => {
        if (form.id) {
          results[form.id] = form.validate(rules[form.id] || {});
        }
      });
      return results;
    }

    resetAll() {
      this.getAllForms().forEach(form => form.reset());
    }
  }

  // Auto-initialize with sensible defaults
  const FormsHelper = new ProductionFormsHelper({
    enableLogging: false,
    autoCleanup: true,
    cleanupInterval: 30000,
    maxCacheSize: 500
  });

  // Global API - Clean and intuitive
  const Forms = FormsHelper.Forms;

  // Additional utilities
  Forms.helper = FormsHelper;
  Forms.stats = () => FormsHelper.getStats();
  Forms.clear = () => FormsHelper.clearCache();
  Forms.destroy = () => FormsHelper.destroy();
  Forms.getAllForms = () => FormsHelper.getAllForms();
  Forms.validateAll = (rules) => FormsHelper.validateAll(rules);
  Forms.resetAll = () => FormsHelper.resetAll();
  Forms.configure = (options) => {
    Object.assign(FormsHelper.options, options);
    return Forms;
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    // Node.js/CommonJS
    module.exports = { Forms, ProductionFormsHelper };
  } else if (typeof define === 'function' && define.amd) {
    // AMD/RequireJS
    define([], function() {
      return { Forms, ProductionFormsHelper };
    });
  } else {
    // Browser globals
    global.Forms = Forms;
    global.ProductionFormsHelper = ProductionFormsHelper;
  }

  // Auto-cleanup on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      FormsHelper.destroy();
    });
  }

  // Add Forms to the main DOMHelpers object if it exists
  if (global.DOMHelpers) {
    global.DOMHelpers.Forms = Forms;
    global.DOMHelpers.ProductionFormsHelper = ProductionFormsHelper;
  }

  console.log('[DOM Helpers Form] Form module loaded successfully');

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
