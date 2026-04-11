// Library already loaded via index.html — all globals available on window
import { initRouter }  from './router.js';
import { createStore } from './store.js';

const store = createStore();
initRouter(store);
