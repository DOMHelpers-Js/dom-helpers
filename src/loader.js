/**
 * DOM Helpers JS — Module Loader
 * Loads individual modules in the correct dependency order automatically.
 * Works directly from CDN — no bundler, no npm required.
 *
 * Usage:
 *   import { load } from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@x.x.x/dist/dom-helpers.loader.esm.js';
 *   await load('reactive', 'animation');
 *
 * @version 2.10.0
 * @license MIT
 */

// ─── DEPENDENCY GRAPH ─────────────────────────────────────────────────────────
// Hard dependencies only.
// Optional enhancements (e.g. conditions using reactive when available) are NOT
// listed here — the user must request both explicitly to get the enhanced behaviour.
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
// Maps module name → built dist filename (ESM minified).
const FILE_MAP = {
  core:             'dom-helpers.core.esm.min.js',
  storage:          'dom-helpers.storage.esm.min.js',
  spa:              'dom-helpers.spa.esm.min.js',
  enhancers:        'dom-helpers.enhancers.esm.min.js',
  conditions:       'dom-helpers.conditions.esm.min.js',
  reactive:         'dom-helpers.reactive.esm.min.js',
  form:             'dom-helpers.form.esm.min.js',
  animation:        'dom-helpers.animation.esm.min.js',
  async:            'dom-helpers.async.esm.min.js',
  'native-enhance': 'dom-helpers.native-enhance.esm.min.js',
};

// ─── ALREADY-LOADED DETECTION ─────────────────────────────────────────────────
// Each check inspects the window globals that a module writes when it initialises.
// This ensures modules loaded by any means (direct <script>, previous load() call,
// full bundle) are correctly detected and never loaded twice.
const IS_LOADED = {
  core:             () => typeof window !== 'undefined' && typeof window.Elements       !== 'undefined',
  storage:          () => typeof window !== 'undefined' && typeof window.StorageUtils   !== 'undefined',
  spa:              () => typeof window !== 'undefined' && typeof window.Router         !== 'undefined',
  enhancers:        () => typeof window !== 'undefined' && typeof window.BulkPropertyUpdaters !== 'undefined',
  conditions:       () => typeof window !== 'undefined' && typeof window.Conditions     !== 'undefined',
  reactive:         () => typeof window !== 'undefined' && typeof window.ReactiveUtils  !== 'undefined',
  form:             () => typeof window !== 'undefined' && typeof window.Forms          !== 'undefined',
  animation:        () => typeof window !== 'undefined' && typeof window.Animation      !== 'undefined',
  async:            () => typeof window !== 'undefined' && typeof window.AsyncHelpers   !== 'undefined',
  // native-enhance patches native DOM methods rather than adding a named global.
  // The loader sets a flag on window after loading it so duplicate loads are avoided.
  'native-enhance': () => typeof window !== 'undefined' && window.__dhNativeEnhanced === true,
};

// ─── BASE URL ─────────────────────────────────────────────────────────────────
// Derived from the loader's own URL so it works on any CDN, any version,
// any custom host — zero hardcoding required.
// e.g. if loader is at https://cdn.../dist/dom-helpers.loader.esm.js
//      BASE_URL  →  https://cdn.../dist/
const BASE_URL = new URL('.', import.meta.url).href;

// ─── IN-PROGRESS CACHE ────────────────────────────────────────────────────────
// Stores pending import() promises by module name.
// If load() is called concurrently (e.g. two async functions both need 'core'),
// both await the same promise instead of triggering a duplicate network request.
const _inProgress = new Map();

// ─── TOPOLOGICAL SORT ─────────────────────────────────────────────────────────
/**
 * Resolve the full ordered load sequence for the requested modules.
 * Uses depth-first topological sort on the dependency graph.
 * Guarantees: dependencies always appear before the modules that need them.
 *
 * @param {string[]} modules - Module names requested by the user
 * @returns {string[]} Ordered list — deps first, no duplicates
 */
function resolve(modules) {
  const visited = new Set();
  const result  = [];

  function visit(name) {
    if (visited.has(name)) return;
    visited.add(name);
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

// ─── LOAD ONE MODULE ──────────────────────────────────────────────────────────
/**
 * Load a single module by name.
 * - Skips silently if already loaded (window global present).
 * - Returns the cached in-progress promise if a load is already underway.
 * - Sets window.__dhNativeEnhanced after loading native-enhance.
 *
 * @param {string} name - Module name
 * @returns {Promise<void>}
 */
async function loadOne(name) {
  if (IS_LOADED[name]()) return;

  if (_inProgress.has(name)) return _inProgress.get(name);

  const url = BASE_URL + FILE_MAP[name];

  const promise = import(/* @vite-ignore */ url)
    .then(() => {
      _inProgress.delete(name);
      if (name === 'native-enhance' && typeof window !== 'undefined') {
        window.__dhNativeEnhanced = true;
      }
    })
    .catch(err => {
      _inProgress.delete(name);
      throw new Error(
        `[dom-helpers/loader] Failed to load module "${name}".\n` +
        `URL: ${url}\n` +
        `Check your network connection or verify the CDN URL is reachable.\n` +
        `Original error: ${err.message}`
      );
    });

  _inProgress.set(name, promise);
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
 * await load('reactive');
 *
 * @example
 * // Load multiple modules — order of arguments does not matter
 * await load('animation', 'form', 'reactive');
 *
 * @example
 * // Standalone modules (no core needed)
 * await load('storage', 'spa');
 *
 * @example
 * // native-enhance — loader injects core + enhancers automatically
 * await load('native-enhance');
 *
 * @example
 * // conditions with reactive features — request both explicitly
 * await load('reactive', 'conditions');
 */
export async function load(...modules) {
  // ── Validation ──────────────────────────────────────────────────────────────
  if (modules.length === 0) {
    throw new Error(
      '[dom-helpers/loader] load() called with no arguments.\n' +
      `Available modules: ${Object.keys(GRAPH).join(', ')}`
    );
  }

  const invalid = modules.filter(m => !(m in GRAPH));
  if (invalid.length > 0) {
    throw new Error(
      `[dom-helpers/loader] Unknown module${invalid.length > 1 ? 's' : ''}: ` +
      `${invalid.map(m => `"${m}"`).join(', ')}.\n` +
      `Available modules: ${Object.keys(GRAPH).join(', ')}`
    );
  }

  // ── Resolve & load ──────────────────────────────────────────────────────────
  // Topological sort produces the correct load sequence including all deps.
  const sequence = resolve(modules);

  // Load sequentially — each step awaits the previous so dependencies are
  // guaranteed to be on window before the modules that rely on them initialise.
  for (const name of sequence) {
    await loadOne(name);
  }
}

// Expose on window so the loader works when loaded via <script type="module" src="...">
// without needing an inline import statement (Pattern 2 / deferred usage).
if (typeof window !== 'undefined') {
  window.DOMHelpersLoader = { load };
}
