import { ReactiveUtils } from "https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.reactive.esm.min.js";
import { Router } from "https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.spa.esm.min.js";

import { initRouter } from "./router.js";
import { createStore } from "./store.js";

const store = createStore(ReactiveUtils);
initRouter(store, Router);
