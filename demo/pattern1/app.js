// Pattern 1 — Inline Import
// Entry point: imports load from the ESM loader, then imports app modules.

import { load }        from '../../dist/dom-helpers.loader.esm.min.js';
import { createStore } from './store.js';
import { initUI }      from './ui.js';

// Load only what this page needs — core is resolved automatically by the loader
await load('reactive');

// Library globals are available from here onwards
const store = createStore();
initUI(store);
