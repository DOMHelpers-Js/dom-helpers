// Pattern 2 — Src Attribute (Deferred)
// Entry point: DOMHelpersLoader is already on window (set by the loader script tag
// in index.html), so no import needed — just call DOMHelpersLoader.load() directly.

import { createStore } from './store.js';
import { initUI }      from './ui.js';

// Loader was loaded via <script type="module" src="..."> in index.html.
// Both module scripts are deferred and run in document order, so
// DOMHelpersLoader is guaranteed to be on window by the time this runs.
await DOMHelpersLoader.load('reactive');

// Library globals are available from here onwards
const store = createStore();
initUI(store);
