import { ReactiveUtils, Router } from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.1/dist/dom-helpers.full-spa.esm.min.js';

import { initRouter }  from './router.js';
import { createStore } from './store.js';

const store = createStore(ReactiveUtils);
initRouter(store, Router);
