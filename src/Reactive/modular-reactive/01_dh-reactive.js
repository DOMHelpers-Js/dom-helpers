/**
 * 01_dh-reactive
 * 
 * DOM Helpers - Reactive State Extension v2.0.2
 * Production-ready with all README features
 * @license MIT
 */

(function(global) {
  'use strict';

  const hasElements = !!global.Elements;
  const hasCollections = !!global.Collections;
  const hasSelector = !!global.Selector;

  // State management
  const reactiveMap = new WeakMap();
  let currentEffect = null;
  let batchDepth = 0;
  let pendingUpdates = new Set();

  const RAW = Symbol('raw');
  const IS_REACTIVE = Symbol('reactive');

  // Utilities
  function isReactive(v) {
    return !!(v && v[IS_REACTIVE]);
  }

  function toRaw(v) {
    return (v && v[RAW]) || v;
  }

  // Batching
  function batch(fn) {
    batchDepth++;
    try {
      return fn();
    } finally {
      batchDepth--;
      if (batchDepth === 0) flush();
    }
  }

  function flush() {
    if (pendingUpdates.size === 0) return;
    const updates = Array.from(pendingUpdates);
    pendingUpdates.clear();
    updates.forEach(fn => {
      try { fn(); } 
      catch (e) { console.error('[Reactive] Error:', e); }
    });
  }

  function queueUpdate(fn) {
    if (batchDepth > 0) {
      pendingUpdates.add(fn);
    } else {
      fn();
    }
  }

  // Create reactive proxy
  function createReactive(target) {
    if (!target || typeof target !== 'object') return target;
    if (isReactive(target)) return target;

    const deps = new Map();
    const computedMap = new Map();

    const proxy = new Proxy(target, {
      get(obj, key) {
        if (key === RAW) return target;
        if (key === IS_REACTIVE) return true;

        // Track dependency
        if (currentEffect && typeof key !== 'symbol') {
          if (!deps.has(key)) deps.set(key, new Set());
          deps.get(key).add(currentEffect);
          if (currentEffect.onDep) currentEffect.onDep(key);
        }

        let value = obj[key];

        // Handle computed
        if (computedMap.has(key)) {
          const comp = computedMap.get(key);
          if (comp.dirty) {
            comp.deps.clear();
            const prevEffect = currentEffect;
            currentEffect = { 
              isComputed: true,
              onDep: (k) => comp.deps.add(k)
            };
            try {
              value = comp.fn.call(proxy);
              comp.value = value;
              comp.dirty = false;
            } finally {
              currentEffect = prevEffect;
            }
          }
          value = comp.value;
          
          // Track computed as dependency
          if (currentEffect && !currentEffect.isComputed) {
            if (!deps.has(key)) deps.set(key, new Set());
            deps.get(key).add(currentEffect);
          }
          
          return value;
        }

        // Deep reactivity
        if (value && typeof value === 'object' && !isReactive(value)) {
          value = createReactive(value);
          obj[key] = value;
        }

        return value;
      },

      set(obj, key, value) {
        if (obj[key] === value) return true;
        obj[key] = toRaw(value);
        
        // Trigger updates
        const effects = deps.get(key);
        if (effects) {
          // Mark computed as dirty and notify their dependents
          computedMap.forEach((comp, compKey) => {
            if (comp.deps.has(key)) {
              comp.dirty = true;
              const compDeps = deps.get(compKey);
              if (compDeps) {
                compDeps.forEach(effect => {
                  if (effect && !effect.isComputed) {
                    queueUpdate(effect);
                  }
                });
              }
            }
          });
          
          // Schedule effect updates
          effects.forEach(effect => {
            if (effect && !effect.isComputed) {
              queueUpdate(effect);
            }
          });
        }
        
        return true;
      }
    });

    reactiveMap.set(proxy, { deps, computedMap });
    
    // Add instance methods (check if they don't already exist)
    if (!proxy.$computed) {
      Object.defineProperties(proxy, {
        $computed: {
          value: function(key, fn) {
            addComputed(this, key, fn);
            return this;
          },
          enumerable: false,
          configurable: true
        },
        $watch: {
          value: function(keyOrFn, callback) {
            return addWatch(this, keyOrFn, callback);
          },
          enumerable: false,
          configurable: true
        },
        $batch: {
          value: function(fn) {
            return batch(() => fn.call(this));
          },
          enumerable: false,
          configurable: true
        },
        $notify: {
          value: function(key) {
            notify(this, key);
          },
          enumerable: false,
          configurable: true
        },
        $raw: {
          get() { return toRaw(this); },
          enumerable: false,
          configurable: true
        },
        $update: {
          value: function(updates) {
            return updateMixed(this, updates);
          },
          enumerable: false,
          configurable: true
        },
        $set: {
          value: function(updates) {
            return setWithFunctions(this, updates);
          },
          enumerable: false,
          configurable: true
        },
        $bind: {
          value: function(bindingDefs) {
            return createBindings(this, bindingDefs);
          },
          enumerable: false,
          configurable: true
        }
      });
    }

    return proxy;
  }

  // Effect
  function effect(fn) {
    const execute = () => {
      const prevEffect = currentEffect;
      currentEffect = execute;
      try {
        fn();
      } finally {
        currentEffect = prevEffect;
      }
    };
    execute();
    return () => { currentEffect = null; };
  }

  // Computed
  function addComputed(state, key, fn) {
    const meta = reactiveMap.get(state);
    if (!meta) {
      console.error('[Reactive] Cannot add computed to non-reactive state');
      return;
    }

    const comp = {
      fn,
      value: undefined,
      dirty: true,
      deps: new Set()
    };

    meta.computedMap.set(key, comp);

    Object.defineProperty(state, key, {
      get() {
        if (comp.dirty) {
          comp.deps.clear();
          const prevEffect = currentEffect;
          currentEffect = {
            isComputed: true,
            onDep: (k) => comp.deps.add(k)
          };
          try {
            comp.value = fn.call(state);
            comp.dirty = false;
          } finally {
            currentEffect = prevEffect;
          }
        }
        
        if (currentEffect && !currentEffect.isComputed) {
          if (!meta.deps.has(key)) meta.deps.set(key, new Set());
          meta.deps.get(key).add(currentEffect);
        }
        
        return comp.value;
      },
      enumerable: true,
      configurable: true
    });
  }

  // Watch
  function addWatch(state, keyOrFn, callback) {
    let oldValue;
    if (typeof keyOrFn === 'function') {
      oldValue = keyOrFn.call(state);
      return effect(() => {
        const newValue = keyOrFn.call(state);
        if (newValue !== oldValue) {
          callback(newValue, oldValue);
          oldValue = newValue;
        }
      });
    } else {
      oldValue = state[keyOrFn];
      return effect(() => {
        const newValue = state[keyOrFn];
        if (newValue !== oldValue) {
          callback(newValue, oldValue);
          oldValue = newValue;
        }
      });
    }
  }

  // Notify
  function notify(state, key) {
    const meta = reactiveMap.get(state);
    if (!meta) return;
    
    if (key) {
      const effects = meta.deps.get(key);
      if (effects) {
        effects.forEach(e => e && !e.isComputed && queueUpdate(e));
      }
    } else {
      meta.deps.forEach(effects => {
        effects.forEach(e => e && !e.isComputed && queueUpdate(e));
      });
    }
  }

  // Bindings
  function bindings(defs) {
    const cleanups = [];
    
    Object.entries(defs).forEach(([selector, bindingDef]) => {
      let elements = [];
      
      if (selector.startsWith('#')) {
        const el = document.getElementById(selector.slice(1));
        if (el) elements = [el];
      } else if (selector.startsWith('.')) {
        elements = Array.from(document.getElementsByClassName(selector.slice(1)));
      } else {
        elements = Array.from(document.querySelectorAll(selector));
      }

      elements.forEach(el => {
        if (typeof bindingDef === 'function') {
          cleanups.push(effect(() => {
            const value = bindingDef();
            applyValue(el, null, value);
          }));
        } else if (typeof bindingDef === 'object') {
          Object.entries(bindingDef).forEach(([prop, fn]) => {
            if (typeof fn === 'function') {
              cleanups.push(effect(() => {
                const value = fn();
                applyValue(el, prop, value);
              }));
            }
          });
        }
      });
    });

    return () => cleanups.forEach(c => c());
  }

  function applyValue(el, prop, value) {
    if (value == null) {
      if (prop) el[prop] = '';
      else el.textContent = '';
      return;
    }

    const type = typeof value;
    
    if (type === 'string' || type === 'number' || type === 'boolean') {
      if (prop) {
        if (prop in el) el[prop] = value;
        else el.setAttribute(prop, String(value));
      } else {
        el.textContent = String(value);
      }
    } else if (Array.isArray(value)) {
      if (prop === 'classList' || prop === 'className') {
        el.className = value.filter(Boolean).join(' ');
      } else if (!prop) {
        el.textContent = value.join(', ');
      }
    } else if (type === 'object') {
      if (prop === 'style') {
        Object.entries(value).forEach(([k, v]) => el.style[k] = v);
      } else if (prop === 'dataset') {
        Object.entries(value).forEach(([k, v]) => el.dataset[k] = String(v));
      } else if (!prop) {
        Object.entries(value).forEach(([k, v]) => {
          if (k === 'style' && typeof v === 'object') {
            Object.entries(v).forEach(([sk, sv]) => el.style[sk] = sv);
          } else if (k in el) {
            el[k] = v;
          }
        });
      }
    }
  }

  // Helper function to set nested properties
  function setNestedProperty(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
  }

  // state.$update() - Mixed state + DOM updates
  function updateMixed(state, updates) {
    return batch(() => {
      Object.entries(updates).forEach(([key, value]) => {
        // Check if it's a DOM selector
        if (key.startsWith('#') || key.startsWith('.') || key.includes('[') || key.includes('>')) {
          updateDOMElements(key, value);
        } else {
          // It's a state update
          if (key.includes('.')) {
            setNestedProperty(state, key, value);
          } else {
            state[key] = value;
          }
        }
      });
      return state;
    });
  }

  // state.$set() - Functional updates
  function setWithFunctions(state, updates) {
    return batch(() => {
      Object.entries(updates).forEach(([key, value]) => {
        const finalValue = typeof value === 'function' 
          ? value(key.includes('.') ? getNestedProperty(state, key) : state[key])
          : value;
        
        if (key.includes('.')) {
          setNestedProperty(state, key, finalValue);
        } else {
          state[key] = finalValue;
        }
      });
      return state;
    });
  }

  // Helper to get nested property
  function getNestedProperty(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Update DOM elements by selector
  function updateDOMElements(selector, updates) {
    let elements = [];
    
    if (selector.startsWith('#')) {
      const el = document.getElementById(selector.slice(1));
      if (el) elements = [el];
    } else if (selector.startsWith('.')) {
      elements = Array.from(document.getElementsByClassName(selector.slice(1)));
    } else {
      elements = Array.from(document.querySelectorAll(selector));
    }

    elements.forEach(el => {
      if (typeof updates === 'object' && updates !== null) {
        Object.entries(updates).forEach(([prop, value]) => {
          applyValue(el, prop, value);
        });
      } else {
        applyValue(el, null, updates);
      }
    });
  }

  // Create bindings that auto-update on state changes
  function createBindings(state, bindingDefs) {
    const cleanups = [];
    
    Object.entries(bindingDefs).forEach(([selector, binding]) => {
      let elements = [];
      
      if (selector.startsWith('#')) {
        const el = document.getElementById(selector.slice(1));
        if (el) elements = [el];
      } else if (selector.startsWith('.')) {
        elements = Array.from(document.getElementsByClassName(selector.slice(1)));
      } else {
        elements = Array.from(document.querySelectorAll(selector));
      }

      elements.forEach(el => {
        if (typeof binding === 'string') {
          // Simple property binding: '#counter': 'count'
          cleanups.push(effect(() => {
            const value = binding.includes('.') 
              ? getNestedProperty(state, binding)
              : state[binding];
            applyValue(el, null, value);
          }));
        } else if (typeof binding === 'function') {
          // Computed binding: '#userName': () => state.user.name
          cleanups.push(effect(() => {
            const value = binding.call(state);
            applyValue(el, null, value);
          }));
        } else if (typeof binding === 'object') {
          // Multiple property bindings
          Object.entries(binding).forEach(([prop, value]) => {
            if (typeof value === 'function') {
              cleanups.push(effect(() => {
                const result = value.call(state);
                applyValue(el, prop, result);
              }));
            } else if (typeof value === 'string') {
              cleanups.push(effect(() => {
                const result = value.includes('.')
                  ? getNestedProperty(state, value)
                  : state[value];
                applyValue(el, prop, result);
              }));
            }
          });
        }
      });
    });

    return () => cleanups.forEach(c => c());
  }

  // createState with auto-bindings
  function createStateWithBindings(initialState, bindingDefs) {
    const state = createReactive(initialState);
    
    if (bindingDefs) {
      createBindings(state, bindingDefs);
    }
    
    return state;
  }

  // Unified updateAll
  function updateAll(state, updates) {
    return updateMixed(state, updates);
  }

  // Ref
  function ref(value) {
    const state = createReactive({ value });
    state.valueOf = function() { return this.value; };
    state.toString = function() { return String(this.value); };
    return state;
  }

  // Collection
  function collection(items = []) {
    const state = createReactive({ items });
    
    state.$add = function(item) {
      this.items.push(item);
    };
    
    state.$remove = function(predicate) {
      const idx = typeof predicate === 'function'
        ? this.items.findIndex(predicate)
        : this.items.indexOf(predicate);
      if (idx !== -1) this.items.splice(idx, 1);
    };
    
    state.$update = function(predicate, updates) {
      const idx = typeof predicate === 'function'
        ? this.items.findIndex(predicate)
        : this.items.indexOf(predicate);
      if (idx !== -1) Object.assign(this.items[idx], updates);
    };
    
    state.$clear = function() {
      this.items.length = 0;
    };
    
    return state;
  }

  // Form
  function form(initialValues = {}) {
    const state = createReactive({
      values: { ...initialValues },
      errors: {},
      touched: {},
      isSubmitting: false
    });

    addComputed(state, 'isValid', function() {
      const errorKeys = Object.keys(this.errors);
      return errorKeys.length === 0 || errorKeys.every(k => !this.errors[k]);
    });

    addComputed(state, 'isDirty', function() {
      return Object.keys(this.touched).length > 0;
    });

    state.$setValue = function(field, value) {
      this.values[field] = value;
      this.touched[field] = true;
    };

    state.$setError = function(field, error) {
      if (error) this.errors[field] = error;
      else delete this.errors[field];
    };

    state.$reset = function(newValues = initialValues) {
      this.values = { ...newValues };
      this.errors = {};
      this.touched = {};
    };

    return state;
  }

  // Async
  function asyncState(initialValue = null) {
    const state = createReactive({
      data: initialValue,
      loading: false,
      error: null
    });

    addComputed(state, 'isSuccess', function() {
      return !this.loading && !this.error && this.data !== null;
    });

    addComputed(state, 'isError', function() {
      return !this.loading && this.error !== null;
    });

    state.$execute = async function(fn) {
      this.loading = true;
      this.error = null;
      try {
        const result = await fn();
        this.data = result;
        return result;
      } catch (e) {
        this.error = e;
        throw e;
      } finally {
        this.loading = false;
      }
    };

    state.$reset = function() {
      this.data = initialValue;
      this.loading = false;
      this.error = null;
    };

    return state;
  }

  // Store
  function store(initialState, options = {}) {
    const state = createReactive(initialState);

    if (options.getters) {
      Object.entries(options.getters).forEach(([key, fn]) => {
        addComputed(state, key, fn);
      });
    }

    if (options.actions) {
      Object.entries(options.actions).forEach(([name, fn]) => {
        state[name] = function(...args) {
          return fn(this, ...args);
        };
      });
    }

    return state;
  }

  // Component
  function component(config) {
    const state = createReactive(config.state || {});

    if (config.computed) {
      Object.entries(config.computed).forEach(([key, fn]) => {
        addComputed(state, key, fn);
      });
    }

    const cleanups = [];
    
    if (config.watch) {
      Object.entries(config.watch).forEach(([key, callback]) => {
        cleanups.push(addWatch(state, key, callback));
      });
    }

    if (config.effects) {
      Object.values(config.effects).forEach(fn => {
        cleanups.push(effect(fn));
      });
    }

    if (config.bindings) {
      cleanups.push(bindings(config.bindings));
    }

    if (config.actions) {
      Object.entries(config.actions).forEach(([name, fn]) => {
        state[name] = function(...args) {
          return fn(this, ...args);
        };
      });
    }

    if (config.mounted) {
      config.mounted.call(state);
    }

    state.$destroy = function() {
      cleanups.forEach(c => c());
      if (config.unmounted) {
        config.unmounted.call(this);
      }
    };

    return state;
  }

  // Reactive builder
  function reactive(initialState) {
    const state = createReactive(initialState);
    const cleanups = [];

    const builder = {
      state,
      computed(defs) {
        Object.entries(defs).forEach(([k, fn]) => addComputed(state, k, fn));
        return this;
      },
      watch(defs) {
        Object.entries(defs).forEach(([k, cb]) => {
          cleanups.push(addWatch(state, k, cb));
        });
        return this;
      },
      effect(fn) {
        cleanups.push(effect(fn));
        return this;
      },
      bind(defs) {
        cleanups.push(bindings(defs));
        return this;
      },
      action(name, fn) {
        state[name] = function(...args) { return fn(this, ...args); };
        return this;
      },
      actions(defs) {
        Object.entries(defs).forEach(([name, fn]) => this.action(name, fn));
        return this;
      },
      build() {
        state.destroy = () => cleanups.forEach(c => c());
        return state;
      },
      destroy() {
        cleanups.forEach(c => c());
      }
    };

    return builder;
  }

  // API
  const ReactiveState = {
    create: createReactive,
    form,
    async: asyncState,
    collection
  };

  const api = {
    state: createReactive,
    createState: createStateWithBindings,
    updateAll: updateAll,
    computed: (state, defs) => {
      Object.entries(defs).forEach(([k, fn]) => addComputed(state, k, fn));
      return state;
    },
    watch: (state, defs) => {
      const cleanups = Object.entries(defs).map(([k, cb]) => addWatch(state, k, cb));
      return () => cleanups.forEach(c => c());
    },
    effect,
    effects: (defs) => {
      const cleanups = Object.values(defs).map(fn => effect(fn));
      return () => cleanups.forEach(c => c());
    },
    ref,
    refs: (defs) => {
      const result = {};
      Object.entries(defs).forEach(([k, v]) => result[k] = ref(v));
      return result;
    },
    store,
    component,
    reactive,
    bindings,
    list: collection,
    batch,
    isReactive,
    toRaw,
    notify,
    pause: () => batchDepth++,
    resume: (fl) => {
      batchDepth = Math.max(0, batchDepth - 1);
      if (fl && batchDepth === 0) flush();
    },
    untrack: (fn) => {
      const prev = currentEffect;
      currentEffect = null;
      try {
        return fn();
      } finally {
        currentEffect = prev;
      }
    }
  };

  // Integration
  if (hasElements) {
    Object.assign(global.Elements, api);
    
    // Elements.bind for ID-based bindings
    global.Elements.bind = function(bindingDefs) {
      Object.entries(bindingDefs).forEach(([id, bindingDef]) => {
        const element = document.getElementById(id);
        if (element) {
          if (typeof bindingDef === 'function') {
            effect(() => applyValue(element, null, bindingDef()));
          } else if (typeof bindingDef === 'object') {
            Object.entries(bindingDef).forEach(([prop, fn]) => {
              if (typeof fn === 'function') {
                effect(() => applyValue(element, prop, fn()));
              }
            });
          }
        }
      });
    };
  }
  
  if (hasCollections) {
    Object.assign(global.Collections, api);
    
    // Collections.bind for class-based bindings
    global.Collections.bind = function(bindingDefs) {
      Object.entries(bindingDefs).forEach(([className, bindingDef]) => {
        const elements = document.getElementsByClassName(className);
        Array.from(elements).forEach(element => {
          if (typeof bindingDef === 'function') {
            effect(() => applyValue(element, null, bindingDef()));
          } else if (typeof bindingDef === 'object') {
            Object.entries(bindingDef).forEach(([prop, fn]) => {
              if (typeof fn === 'function') {
                effect(() => applyValue(element, prop, fn()));
              }
            });
          }
        });
      });
    };
  }
  
  if (hasSelector) {
    Object.assign(global.Selector, api);
    
    // Selector.query for single element queries
    if (global.Selector.query) {
      Object.assign(global.Selector.query, api);
      
      global.Selector.query.bind = function(bindingDefs) {
        Object.entries(bindingDefs).forEach(([selector, bindingDef]) => {
          const element = document.querySelector(selector);
          if (element) {
            if (typeof bindingDef === 'function') {
              effect(() => applyValue(element, null, bindingDef()));
            } else if (typeof bindingDef === 'object') {
              Object.entries(bindingDef).forEach(([prop, fn]) => {
                if (typeof fn === 'function') {
                  effect(() => applyValue(element, prop, fn()));
                }
              });
            }
          }
        });
      };
    }
    
    // Selector.queryAll for multiple element queries
    if (global.Selector.queryAll) {
      Object.assign(global.Selector.queryAll, api);
      
      global.Selector.queryAll.bind = function(bindingDefs) {
        Object.entries(bindingDefs).forEach(([selector, bindingDef]) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            if (typeof bindingDef === 'function') {
              effect(() => applyValue(element, null, bindingDef()));
            } else if (typeof bindingDef === 'object') {
              Object.entries(bindingDef).forEach(([prop, fn]) => {
                if (typeof fn === 'function') {
                  effect(() => applyValue(element, prop, fn()));
                }
              });
            }
          });
        });
      };
    }
  }

  global.ReactiveState = ReactiveState;
  global.ReactiveUtils = api;
  
  // Global updateAll method
  global.updateAll = updateAll;

  console.log('[DOM Helpers Reactive] v2.0.2 loaded successfully');
  console.log('[DOM Helpers Reactive] New features available:');
  console.log('  - state.$update() - Mixed state + DOM updates');
  console.log('  - state.$set() - Functional updates');
  console.log('  - state.$bind() - Create reactive bindings');
  console.log('  - Elements/Collections/Selector.createState() - State with auto-bindings');
  console.log('  - Elements/Collections/Selector.updateAll() - Unified updates');
  console.log('  - Global updateAll() method');

})(typeof window !== 'undefined' ? window : global);
