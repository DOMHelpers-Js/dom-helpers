import 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.full-spa.esm.min.js';

import { initRouter }  from './router.js';
import { createStore } from './store.js';

const store = createStore();
initRouter(store);
