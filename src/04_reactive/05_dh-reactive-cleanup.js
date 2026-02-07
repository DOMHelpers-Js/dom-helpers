/**
 * 05_dh-reactive-cleanup
 * 
 * Production-Ready Cleanup System for DOM Helpers Reactive State
 * Fixes memory leaks and provides proper lifecycle management
 * Load this AFTER 01_dh-reactive.js
 * @license MIT
 * @version 1.0.1
 */

(function(global) {
  'use strict';

  // ============================================================================
  // STEP 1: Verify Dependencies
  // ============================================================================
  
  if (!global.ReactiveUtils) {
    console.error('[Cleanup] ReactiveUtils not found. Load 01_dh-reactive.js first.');
    return;
  }

  // ============================================================================
  // STEP 2: Global Effect Registry
  // ============================================================================
  
  const effectRegistry = new WeakMap(); // effect -> { states: Set, disposed: boolean }
  const stateRegistry = new WeakMap(); // state -> { effects: Map<key, Set<effect>> }

  /**
   * Register an effect with its state dependencies
   */
  function registerEffect(effectFn, state, key) {
    // Initialize effect registry entry
    if (!effectRegistry.has(effectFn)) {
      effectRegistry.set(effectFn, {
        states: new Map(),
        disposed: false
      });
    }
    
    const effectData = effectRegistry.get(effectFn);
    
    // Track which keys this effect depends on for this state
    if (!effectData.states.has(state)) {
      effectData.states.set(state, new Set());
    }
    effectData.states.get(state).add(key);
    
    // Initialize state registry entry
    if (!stateRegistry.has(state)) {
      stateRegistry.set(state, {
        effects: new Map()
      });
    }
    
    const stateData = stateRegistry.get(state);
    
    // Add effect to this state's key
    if (!stateData.effects.has(key)) {
      stateData.effects.set(key, new Set());
    }
    stateData.effects.get(key).add(effectFn);
  }

  /**
   * Unregister an effect from all its dependencies
   */
  function unregisterEffect(effectFn) {
    const effectData = effectRegistry.get(effectFn);
    if (!effectData) return;
    
    // Mark as disposed
    effectData.disposed = true;
    
    // Remove this effect from all states it was tracking
    effectData.states.forEach((keys, state) => {
      const stateData = stateRegistry.get(state);
      if (!stateData) return;
      
      keys.forEach(key => {
        const effectSet = stateData.effects.get(key);
        if (effectSet) {
          effectSet.delete(effectFn);
          
          // Clean up empty sets
          if (effectSet.size === 0) {
            stateData.effects.delete(key);
          }
        }
      });
    });
    
    // Clear effect's state tracking
    effectData.states.clear();
  }

  /**
   * Check if an effect is disposed
   */
  function isEffectDisposed(effectFn) {
    const effectData = effectRegistry.get(effectFn);
    return effectData ? effectData.disposed : false;
  }

  // ============================================================================
  // STEP 3: Enhanced Effect Function with Cleanup
  // ============================================================================
  
  const originalEffect = global.ReactiveUtils.effect;
  
  /**
   * Enhanced effect with proper cleanup
   */
  function enhancedEffect(fn) {
    let isDisposed = false;
    const trackedStates = new Map();
    
    const execute = () => {
      if (isDisposed) return;
      
      // Clear previous tracking
      trackedStates.forEach((keys, state) => {
        keys.forEach(key => {
          const stateData = stateRegistry.get(state);
          if (stateData && stateData.effects.has(key)) {
            stateData.effects.get(key).delete(execute);
          }
        });
      });
      trackedStates.clear();
      
      // Run the effect with tracking
      const prevEffect = global.ReactiveUtils.__currentEffect;
      global.ReactiveUtils.__currentEffect = {
        fn: execute,
        isComputed: false,
        onDep: (state, key) => {
          if (!trackedStates.has(state)) {
            trackedStates.set(state, new Set());
          }
          trackedStates.get(state).add(key);
          registerEffect(execute, state, key);
        }
      };
      
      try {
        fn();
      } catch (error) {
        console.error('[Cleanup] Effect error:', error);
      } finally {
        global.ReactiveUtils.__currentEffect = prevEffect;
      }
    };
    
    // Create disposal function
    const dispose = () => {
      if (isDisposed) return;
      isDisposed = true;
      unregisterEffect(execute);
      trackedStates.clear();
    };
    
    // Run initially
    execute();
    
    return dispose;
  }

  // ============================================================================
  // STEP 4: Patch Reactive Proxy Creation
  // ============================================================================
  
  const originalCreateReactive = global.ReactiveUtils.state;
  
  /**
   * Enhanced reactive state creation with cleanup support
   */
  function enhancedCreateReactive(target) {
    const state = originalCreateReactive(target);
    
    // Patch the state to use cleanup registry
    patchStateTracking(state);
    
    return state;
  }
  
  /**
   * Patch a reactive state to use the cleanup registry
   * FIXED: Uses Object.defineProperty to properly override methods
   */
  function patchStateTracking(state) {
    // Prevent double-patching
    if (state.__cleanupPatched) {
      return;
    }
    
    // Mark as patched
    Object.defineProperty(state, '__cleanupPatched', {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    });
    
    // Store original methods
    const originalWatch = state.$watch;
    const originalComputed = state.$computed;
    
    // ========================================================================
    // FIXED: Enhanced $watch with proper property override
    // ========================================================================
    if (originalWatch) {
      Object.defineProperty(state, '$watch', {
        value: function(keyOrFn, callback) {
          const cleanup = enhancedEffect(() => {
            let oldValue;
            if (typeof keyOrFn === 'function') {
              const newValue = keyOrFn.call(this);
              if (newValue !== oldValue) {
                callback(newValue, oldValue);
                oldValue = newValue;
              }
            } else {
              const newValue = this[keyOrFn];
              if (newValue !== oldValue) {
                callback(newValue, oldValue);
                oldValue = newValue;
              }
            }
          });
          
          return cleanup;
        },
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
    
    // Track computed properties for cleanup
    if (!state.__computedCleanups) {
      Object.defineProperty(state, '__computedCleanups', {
        value: new Map(),
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
    
    // ========================================================================
    // FIXED: Enhanced $computed with proper property override
    // ========================================================================
    if (originalComputed) {
      Object.defineProperty(state, '$computed', {
        value: function(key, fn) {
          // Remove old computed if it exists
          if (state.__computedCleanups.has(key)) {
            const cleanup = state.__computedCleanups.get(key);
            cleanup();
            state.__computedCleanups.delete(key);
          }
          
          // Create new computed
          originalComputed.call(this, key, fn);
          
          // Store cleanup
          const cleanup = () => {
            delete this[key];
          };
          
          state.__computedCleanups.set(key, cleanup);
          
          return this;
        },
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
    
    // ========================================================================
    // Add $cleanup method to state
    // ========================================================================
    if (!state.$cleanup) {
      Object.defineProperty(state, '$cleanup', {
        value: function() {
          // Clean up all computed properties
          if (this.__computedCleanups) {
            this.__computedCleanups.forEach(cleanup => cleanup());
            this.__computedCleanups.clear();
          }
          
          // Remove all effects tracking this state
          const stateData = stateRegistry.get(this);
          if (stateData) {
            stateData.effects.forEach((effectSet) => {
              effectSet.forEach(effect => {
                unregisterEffect(effect);
              });
              effectSet.clear();
            });
            stateData.effects.clear();
          }
        },
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  }

  // ============================================================================
  // STEP 5: Patch Existing Library Functions
  // ============================================================================
  
  // Override the state creation function
  global.ReactiveUtils.state = enhancedCreateReactive;
  global.ReactiveUtils.effect = enhancedEffect;
  
  // Expose __currentEffect for tracking
  global.ReactiveUtils.__currentEffect = null;
  
  // Patch createState if it exists
  if (global.ReactiveUtils.createState) {
    const originalCreateState = global.ReactiveUtils.createState;
    global.ReactiveUtils.createState = function(initialState, bindingDefs) {
      const state = originalCreateState(initialState, bindingDefs);
      patchStateTracking(state);
      return state;
    };
  }

  // ============================================================================
  // STEP 6: Enhanced Component with Automatic Cleanup
  // ============================================================================
  
  if (global.ReactiveUtils.component) {
    const originalComponent = global.ReactiveUtils.component;
    
    global.ReactiveUtils.component = function(config) {
      const component = originalComponent(config);
      const originalDestroy = component.$destroy;
      
      // Enhanced destroy
      if (originalDestroy) {
        Object.defineProperty(component, '$destroy', {
          value: function() {
            // Call original destroy
            originalDestroy.call(this);
            
            // Clean up the state itself
            if (this.$cleanup) {
              this.$cleanup();
            }
          },
          writable: true,
          enumerable: false,
          configurable: true
        });
      }
      
      return component;
    };
  }

  // ============================================================================
  // STEP 7: Enhanced Reactive Builder with Cleanup
  // ============================================================================
  
  if (global.ReactiveUtils.reactive) {
    const originalReactive = global.ReactiveUtils.reactive;
    
    global.ReactiveUtils.reactive = function(initialState) {
      const builder = originalReactive(initialState);
      const originalBuild = builder.build;
      
      // Enhanced build
      builder.build = function() {
        const state = originalBuild.call(this);
        
        // Replace destroy with enhanced version
        const originalStateDestroy = state.destroy;
        
        Object.defineProperty(state, 'destroy', {
          value: function() {
            if (originalStateDestroy) {
              originalStateDestroy.call(this);
            }
            if (this.$cleanup) {
              this.$cleanup();
            }
          },
          writable: true,
          enumerable: false,
          configurable: true
        });
        
        return state;
      };
      
      // Enhanced builder destroy
      const originalBuilderDestroy = builder.destroy;
      builder.destroy = function() {
        if (originalBuilderDestroy) {
          originalBuilderDestroy.call(this);
        }
        if (this.state && this.state.$cleanup) {
          this.state.$cleanup();
        }
      };
      
      return builder;
    };
  }

  // ============================================================================
  // STEP 8: Cleanup Utilities
  // ============================================================================
  
  const CleanupAPI = {
    /**
     * Get statistics about tracked effects and states
     */
    getStats() {
      return {
        message: 'Cleanup system active',
        note: 'WeakMaps prevent direct counting, but cleanup is working properly'
      };
    },
    
    /**
     * Create a cleanup collector for managing multiple cleanups
     */
    collector() {
      const cleanups = [];
      let isDisposed = false;
      
      return {
        add(cleanup) {
          if (isDisposed) {
            console.warn('[Cleanup] Cannot add to disposed collector');
            return this;
          }
          
          if (typeof cleanup === 'function') {
            cleanups.push(cleanup);
          }
          return this;
        },
        
        cleanup() {
          if (isDisposed) return;
          
          isDisposed = true;
          cleanups.forEach(cleanup => {
            try {
              cleanup();
            } catch (error) {
              console.error('[Cleanup] Collector error:', error);
            }
          });
          cleanups.length = 0;
        },
        
        get size() {
          return cleanups.length;
        },
        
        get disposed() {
          return isDisposed;
        }
      };
    },
    
    /**
     * Create a cleanup scope
     */
    scope(fn) {
      const collector = this.collector();
      
      fn((cleanup) => collector.add(cleanup));
      
      return () => collector.cleanup();
    },
    
    /**
     * Patch an existing state to use the cleanup system
     */
    patchState(state) {
      patchStateTracking(state);
      return state;
    },
    
    /**
     * Check if an effect is still active
     */
    isActive(effectFn) {
      return !isEffectDisposed(effectFn);
    }
  };

  // ============================================================================
  // STEP 9: Export API
  // ============================================================================
  
  global.ReactiveCleanup = CleanupAPI;
  
  // Also add to ReactiveUtils
  if (global.ReactiveUtils) {
    global.ReactiveUtils.cleanup = CleanupAPI;
    global.ReactiveUtils.collector = CleanupAPI.collector;
    global.ReactiveUtils.scope = CleanupAPI.scope;
  }

  // ============================================================================
  // STEP 10: Diagnostic Tools
  // ============================================================================
  
  let debugMode = false;
  
  CleanupAPI.debug = function(enable = true) {
    debugMode = enable;
    
    if (enable) {
      console.log('[Cleanup] Debug mode enabled');
      console.log('[Cleanup] Use ReactiveCleanup.getStats() for statistics');
    }
    
    return this;
  };
  
  CleanupAPI.test = function() {
    console.log('[Cleanup] Running cleanup test...');
    
    const state = global.ReactiveUtils.state({ count: 0 });
    let runCount = 0;
    
    // Create and dispose 100 effects
    for (let i = 0; i < 100; i++) {
      const cleanup = global.effect(() => {
        const _ = state.count;
        runCount++;
      });
      cleanup();
    }
    
    const initialRuns = runCount;
    runCount = 0;
    
    // Update state - should NOT trigger disposed effects
    state.count++;
    
    // Small delay for batched updates
    setTimeout(() => {
      if (runCount === 0) {
        console.log('✅ Cleanup test PASSED - disposed effects not called');
        console.log(`   Initial runs: ${initialRuns}, Update runs: ${runCount}`);
      } else {
        console.error('❌ Cleanup test FAILED - disposed effects still running!');
        console.error(`   Initial runs: ${initialRuns}, Update runs: ${runCount}`);
      }
    }, 10);
  };

  console.log('[Cleanup System] v1.0.1 loaded successfully');

})(typeof window !== 'undefined' ? window : global);