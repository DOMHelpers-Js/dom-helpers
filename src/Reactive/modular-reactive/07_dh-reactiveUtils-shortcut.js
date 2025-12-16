/**
 * dh-reactiveUtils-shortcut.js
 * 
 * Standalone API Module v1.0.0
 * Provides simplified function calls without namespace prefixes
 * 
 * Allows:
 *   const myState = state({}) instead of ReactiveUtils.state({})
 *   patchArray(state, 'items') instead of ReactiveUtils.patchArray(state, 'items')
 *   effect(() => {}) instead of ReactiveUtils.effect(() => {})
 * 
 * Load this AFTER all reactive modules for full API access
 * @license MIT
 */

(function(global) {
  'use strict';

  // Check if ReactiveUtils exists
  if (!global.ReactiveUtils) {
    console.warn('[Standalone API] ReactiveUtils not found. Load reactive modules first.');
    return;
  }

  const ReactiveUtils = global.ReactiveUtils;

  // ============================================================
  // CORE STATE METHODS
  // ============================================================

  /**
   * Create reactive state
   * @example const myState = state({ count: 0 });
   */
  global.state = ReactiveUtils.state || ReactiveUtils.create;

  /**
   * Create state with bindings
   * @example const myState = createState({ count: 0 }, { '#counter': 'count' });
   */
  global.createState = ReactiveUtils.createState;

  /**
   * Create reactive effect
   * @example effect(() => console.log(state.count));
   */
  global.effect = ReactiveUtils.effect;

  /**
   * Batch multiple updates
   * @example batch(() => { state.a = 1; state.b = 2; });
   */
  global.batch = ReactiveUtils.batch;

  // ============================================================
  // COMPUTED & WATCH
  // ============================================================

  /**
   * Add computed properties to state
   * @example computed(state, { total: function() { return this.a + this.b; } });
   */
  global.computed = ReactiveUtils.computed;

  /**
   * Watch state changes
   * @example watch(state, { count: (newVal, oldVal) => console.log(newVal) });
   */
  global.watch = ReactiveUtils.watch;

  /**
   * Multiple effects
   * @example effects({ log: () => console.log(state.count) });
   */
  global.effects = ReactiveUtils.effects;

  // ============================================================
  // REFS & COLLECTIONS
  // ============================================================

  /**
   * Create reactive reference
   * @example const count = ref(0);
   */
  global.ref = ReactiveUtils.ref;

  /**
   * Create multiple refs
   * @example const { count, name } = refs({ count: 0, name: '' });
   */
  global.refs = ReactiveUtils.refs;

  /**
   * Create reactive collection
   * @example const items = collection([1, 2, 3]);
   */
  global.collection = ReactiveUtils.collection || ReactiveUtils.list;

  /**
   * Alias for collection
   * @example const items = list([1, 2, 3]);
   */
  global.list = ReactiveUtils.list || ReactiveUtils.collection;

  // ============================================================
  // ARRAY PATCHING
  // ============================================================

  /**
   * Manually patch array for reactivity
   * @example patchArray(state, 'items');
   */
  global.patchArray = ReactiveUtils.patchArray || global.patchReactiveArray;

  // ============================================================
  // FORMS
  // ============================================================

  if (ReactiveUtils.form || ReactiveUtils.createForm) {
    /**
     * Create reactive form
     * @example const myForm = form({ name: '', email: '' }, { validators: {...} });
     */
    global.form = ReactiveUtils.form || ReactiveUtils.createForm;

    /**
     * Alias for form
     * @example const myForm = createForm({ name: '' });
     */
    global.createForm = ReactiveUtils.createForm || ReactiveUtils.form;
  }

  if (ReactiveUtils.validators) {
    /**
     * Form validators
     * @example validators.required('This field is required')
     */
    global.validators = ReactiveUtils.validators;
  }

  // ============================================================
  // STORE & COMPONENT
  // ============================================================

  /**
   * Create state store
   * @example const myStore = store({ count: 0 }, { getters: {...}, actions: {...} });
   */
  global.store = ReactiveUtils.store;

  /**
   * Create reactive component
   * @example const myComponent = component({ state: {...}, computed: {...} });
   */
  global.component = ReactiveUtils.component;

  /**
   * Reactive builder pattern
   * @example const builder = reactive({ count: 0 }).computed({...}).build();
   */
  global.reactive = ReactiveUtils.reactive;

  // ============================================================
  // BINDINGS
  // ============================================================

  /**
   * Create DOM bindings
   * @example bindings({ '#counter': () => state.count });
   */
  global.bindings = ReactiveUtils.bindings;

  /**
   * Update all (mixed state + DOM)
   * @example updateAll(state, { count: 5, '#counter': { textContent: '5' } });
   */
  global.updateAll = ReactiveUtils.updateAll || global.updateAll;

  // ============================================================
  // ASYNC STATE
  // ============================================================

  if (ReactiveUtils.async) {
    /**
     * Create async state
     * @example const data = asyncState(null);
     */
    global.asyncState = ReactiveUtils.async;
  }

  // ============================================================
  // UTILITY FUNCTIONS
  // ============================================================

  /**
   * Check if value is reactive
   * @example if (isReactive(state)) { ... }
   */
  global.isReactive = ReactiveUtils.isReactive;

  /**
   * Get raw (non-reactive) value
   * @example const raw = toRaw(state);
   */
  global.toRaw = ReactiveUtils.toRaw;

  /**
   * Manually notify changes
   * @example notify(state, 'count');
   */
  global.notify = ReactiveUtils.notify;

  /**
   * Pause reactivity
   * @example pause();
   */
  global.pause = ReactiveUtils.pause;

  /**
   * Resume reactivity
   * @example resume(true);
   */
  global.resume = ReactiveUtils.resume;

  /**
   * Run function without tracking
   * @example untrack(() => console.log(state.count));
   */
  global.untrack = ReactiveUtils.untrack;

  // ============================================================
  // COLLECTIONS EXTENDED API (if Collections module loaded)
  // ============================================================

  if (global.Collections) {
    /**
     * Create collection with computed
     * @example const items = createCollection([1, 2, 3], { total: function() { ... } });
     */
    global.createCollection = global.Collections.create || global.Collections.collection;

    /**
     * Create filtered collection
     * @example const active = createFilteredCollection(todos, t => !t.done);
     */
    if (global.Collections.createFiltered) {
      global.createFilteredCollection = global.Collections.createFiltered;
    }
  }

  // ============================================================
  // SUMMARY
  // ============================================================

  console.log('[Standalone API] v1.0.0 loaded successfully');
  console.log('[Standalone API] Simplified functions available:');
  console.log('');
  console.log('Core:');
  console.log('  state(), effect(), batch(), computed(), watch()');
  console.log('');
  console.log('Data Structures:');
  console.log('  ref(), refs(), collection(), list()');
  console.log('');
  console.log('Arrays:');
  console.log('  patchArray()');
  console.log('');
  console.log('Forms:');
  console.log('  form(), createForm(), validators');
  console.log('');
  console.log('Advanced:');
  console.log('  store(), component(), reactive(), bindings()');
  console.log('');
  console.log('Utilities:');
  console.log('  isReactive(), toRaw(), notify(), pause(), resume(), untrack()');
  console.log('');
  console.log('✨ You can now use simplified syntax:');
  console.log('   const myState = state({}) // instead of ReactiveUtils.state({})');
  console.log('   effect(() => {}) // instead of ReactiveUtils.effect(() => {})');
  console.log('   patchArray(state, "items") // instead of ReactiveUtils.patchArray(state, "items")');

})(typeof window !== 'undefined' ? window : global);