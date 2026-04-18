/**
 * DOM Helpers JS — Module Loader (Classic Script)
 * Loads individual modules via <script> injection in the correct dependency order.
 * For use with classic <script> tags — no ES modules, no bundler required.
 *
 * ⚠  IIFE / UMD build only — do NOT import this file as an ES module.
 *    It uses document.currentScript (null in module context) for base URL resolution.
 *    For ES module environments use loader.js instead.
 *
 * Usage:
 *   <script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@x.x.x/dist/dom-helpers.loader.min.js"></script>
 *   <script>
 *     DOMHelpersLoader.load('reactive', 'animation').then(function() {
 *       // all modules ready — globals available on window
 *     });
 *   </script>
 *
 * @version 2.10.0
 * @license MIT
 */

// ─── BASE URL ─────────────────────────────────────────────────────────────────
// Captured synchronously at parse time — document.currentScript is only
// available during initial script execution, not inside async callbacks.
// Gives us the directory the loader was loaded from so all module URLs
// are resolved relative to it, exactly like import.meta.url in the ESM loader.
//
// Fallback: if document.currentScript is null (e.g. the loader was injected
// dynamically after initial parse), we fall back to the pinned CDN URL for
// this version so module URLs are still resolvable rather than silently broken.
const _currentScript = (typeof document !== 'undefined') ? document.currentScript : null;
const _loaderSrc     = _currentScript ? _currentScript.src : '';
const BASE_URL       = _loaderSrc
  ? _loaderSrc.replace(/[^/]+$/, '')
  : 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.10.0/dist/';

// ─── DEPENDENCY GRAPH ─────────────────────────────────────────────────────────
// Hard dependencies only.
// Optional enhancements (e.g. conditions using reactive when available) are NOT
// listed — the user must request both explicitly to get the enhanced behaviour.
const GRAPH = {
  core:             [],
  storage:          [],
  spa:              [],
  enhancers:        ['core'],
  conditions:       ['core'],
  reactive:         ['core'],
  form:             ['core'],
  animation:        ['core'],
  async:            ['core'],
  'native-enhance': ['core', 'enhancers'],
};

// ─── FILE MAP ─────────────────────────────────────────────────────────────────
// Maps module name → minified UMD dist filename (the CDN-ready builds).
const FILE_MAP = {
  core:             'dom-helpers.core.min.js',
  storage:          'dom-helpers.storage.min.js',
  spa:              'dom-helpers.spa.min.js',
  enhancers:        'dom-helpers.enhancers.min.js',
  conditions:       'dom-helpers.conditions.min.js',
  reactive:         'dom-helpers.reactive.min.js',
  form:             'dom-helpers.form.min.js',
  animation:        'dom-helpers.animation.min.js',
  async:            'dom-helpers.async.min.js',
  'native-enhance': 'dom-helpers.native-enhance.min.js',
};

// ─── ALREADY-LOADED DETECTION ─────────────────────────────────────────────────
// Checks window globals written by each module's IIFE at initialisation time.
// Detects modules loaded by any means — direct <script> tag, previous load()
// call, or the full bundle — so they are never loaded twice.
const IS_LOADED = {
  core:             () => typeof window !== 'undefined' && typeof window.Elements             !== 'undefined',
  storage:          () => typeof window !== 'undefined' && typeof window.StorageUtils         !== 'undefined',
  spa:              () => typeof window !== 'undefined' && typeof window.Router               !== 'undefined',
  enhancers:        () => typeof window !== 'undefined' && typeof window.BulkPropertyUpdaters !== 'undefined',
  conditions:       () => typeof window !== 'undefined' && typeof window.Conditions           !== 'undefined',
  reactive:         () => typeof window !== 'undefined' && typeof window.ReactiveUtils        !== 'undefined',
  form:             () => typeof window !== 'undefined' && typeof window.Forms                !== 'undefined',
  animation:        () => typeof window !== 'undefined' && typeof window.Animation            !== 'undefined',
  async:            () => typeof window !== 'undefined' && typeof window.AsyncHelpers         !== 'undefined',
  // native-enhance patches native DOM methods rather than adding a named global.
  // The loader sets a flag on window after loading it so duplicates are avoided.
  'native-enhance': () => typeof window !== 'undefined' && window.__dhNativeEnhanced === true,
};

// ─── IN-PROGRESS CACHE ────────────────────────────────────────────────────────
// If load() is called concurrently for the same module, both callers share the
// same pending promise — one <script> tag injected, no duplicate network requests.
const _inProgress = {};

// ─── TOPOLOGICAL SORT ─────────────────────────────────────────────────────────
/**
 * Resolve the full ordered load sequence for the requested modules.
 * Uses depth-first topological sort on the dependency graph.
 * Guarantees: dependencies always appear before the modules that need them.
 *
 * @param {string[]} modules
 * @returns {string[]} Ordered list — deps first, no duplicates
 */
function resolve(modules) {
  const visited = {};
  const result  = [];

  function visit(name) {
    if (visited[name]) return;
    visited[name] = true;
    for (const dep of GRAPH[name]) {
      visit(dep);
    }
    result.push(name);
  }

  for (const name of modules) {
    visit(name);
  }

  return result;
}

// ─── SCRIPT INJECTION ─────────────────────────────────────────────────────────
/**
 * Inject a <script> tag and return a Promise that resolves on load.
 *
 * @param {string} url
 * @returns {Promise<void>}
 */
function injectScript(url) {
  return new Promise((resolve, reject) => {
    const script  = document.createElement('script');
    script.src    = url;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(
      `[dom-helpers/loader] Failed to load script from "${url}".\n` +
      `Check your network connection or verify the URL is reachable.`
    ));
    document.head.appendChild(script);
  });
}

// ─── LOAD ONE MODULE ──────────────────────────────────────────────────────────
/**
 * Load a single module by name.
 * - Skips silently if already loaded (window global present).
 * - Returns the cached in-progress promise if a load is already underway.
 *
 * @param {string} name
 * @returns {Promise<void>}
 */
function loadOne(name) {
  if (IS_LOADED[name]()) return Promise.resolve();

  if (_inProgress[name]) return _inProgress[name];

  const url     = BASE_URL + FILE_MAP[name];
  const promise = injectScript(url)
    .then(() => {
      delete _inProgress[name];
      if (name === 'native-enhance' && typeof window !== 'undefined') {
        window.__dhNativeEnhanced = true;
      }
    })
    .catch(err => {
      delete _inProgress[name];
      throw err;
    });

  _inProgress[name] = promise;
  return promise;
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────
/**
 * Load one or more DOM Helpers modules in the correct dependency order.
 *
 * - Argument order does not matter — dependencies are resolved automatically.
 * - Already-loaded modules (by any means) are silently skipped.
 * - Missing dependencies are injected automatically (e.g. requesting
 *   'native-enhance' also loads 'core' and 'enhancers' if not already present).
 * - Optional enhancements are NOT auto-loaded. If you want conditions to gain
 *   reactive features, pass both: load('reactive', 'conditions').
 *
 * @param {...string} modules - One or more module names to load
 * @returns {Promise<void>} Resolves when all requested modules (and their deps) are ready
 *
 * @example
 * // Load a single module (core loaded automatically)
 * DOMHelpersLoader.load('reactive').then(function() { ... });
 *
 * @example
 * // Load multiple modules — order of arguments does not matter
 * DOMHelpersLoader.load('animation', 'form', 'reactive').then(function() { ... });
 *
 * @example
 * // Standalone modules (no core needed)
 * DOMHelpersLoader.load('storage', 'spa').then(function() { ... });
 *
 * @example
 * // native-enhance — loader injects core + enhancers automatically
 * DOMHelpersLoader.load('native-enhance').then(function() { ... });
 *
 * @example
 * // conditions with reactive features — request both explicitly
 * DOMHelpersLoader.load('reactive', 'conditions').then(function() { ... });
 */
export function load(...modules) {
  // ── Validation ──────────────────────────────────────────────────────────────
  if (modules.length === 0) {
    return Promise.reject(new Error(
      '[dom-helpers/loader] load() called with no arguments.\n' +
      `Available modules: ${Object.keys(GRAPH).join(', ')}`
    ));
  }

  const invalid = modules.filter(m => !(m in GRAPH));
  if (invalid.length > 0) {
    return Promise.reject(new Error(
      `[dom-helpers/loader] Unknown module${invalid.length > 1 ? 's' : ''}: ` +
      `${invalid.map(m => `"${m}"`).join(', ')}.\n` +
      `Available modules: ${Object.keys(GRAPH).join(', ')}`
    ));
  }

  // ── Resolve & load ──────────────────────────────────────────────────────────
  // Topological sort produces the correct sequence including all deps.
  const sequence = resolve(modules);

  // Load sequentially via promise chain — each module waits for the previous
  // so dependencies are guaranteed on window before dependent modules initialise.
  return sequence.reduce(
    (chain, name) => chain.then(() => loadOne(name)),
    Promise.resolve()
  );
}
