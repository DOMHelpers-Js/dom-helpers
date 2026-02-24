/**
 * DOM Helpers JS - Main Entry Point
 * @version 2.4.0
 * @license MIT
 */

// Import all modules in order
import './01_core/01_dh-core.js';
import './02_enhancers/01_dh-bulk-property-updaters.js';
import './02_enhancers/02_dh-collection-shortcuts.js';
import './02_enhancers/03_dh-global-query.js';
import './02_enhancers/04_dh-indexed-collection-updates.js';
import './02_enhancers/05_dh-index-selection.js';
import './02_enhancers/06_dh-global-collection-indexed-updates.js';
import './02_enhancers/07_dh-bulk-properties-updater-global-query.js';
import './02_enhancers/08_dh-selector-update-patch.js';
import './02_enhancers/09_dh-idShortcut.js';
import './02_enhancers/10_dh-array-based-updates.js';
import './03_conditions/01_dh-conditional-rendering.js';
import './03_conditions/02_dh-conditions-default.js';
import './03_conditions/03_dh-conditions-collection-extension.js';
import './03_conditions/04_dh-conditions-apply-index-support.js';
import './03_conditions/05_dh-conditions-global-shortcut.js';
import './03_conditions/06_dh-matchers-handlers-shortcut.js';
import './03_conditions/07_dh-conditions-array-support.js';
import './03_conditions/08_dh-conditions-batch-states.js';
import './03_conditions/09_dh-conditions-cleanup-fix.js';
import './04_reactive/01_dh-reactive.js';
import './04_reactive/02_dh-reactive-array-patch.js';
import './04_reactive/03_dh-reactive-collections.js';
import './04_reactive/04_dh-reactive-form.js';
import './04_reactive/05_dh-reactive-cleanup.js';
import './04_reactive/06_dh-reactive-enhancements.js';
import './04_reactive/07_dh-reactive-storage.js';
import './04_reactive/08_dh-reactive-namespace-methods.js';
import './04_reactive/09_dh-reactiveUtils-shortcut.js';
import './05_storage/01_dh-storage-standalone.js';

// Export global APIs (these are set by the modules on window/global)
export const DOMHelpers = typeof window !== 'undefined' ? window.DOMHelpers : {};
export const Elements = typeof window !== 'undefined' ? window.Elements : {};
export const Collections = typeof window !== 'undefined' ? window.Collections : {};
export const Selector = typeof window !== 'undefined' ? window.Selector : {};
export const createElement = typeof window !== 'undefined' ? window.createElement : {};
export const ReactiveState = typeof window !== 'undefined' ? window.ReactiveState : {};
export const ReactiveUtils = typeof window !== 'undefined' ? window.ReactiveUtils : {};
export const StorageUtils = typeof window !== 'undefined' ? window.StorageUtils : {};

// Default export
export default typeof window !== 'undefined' ? window.DOMHelpers : {};
