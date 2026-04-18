[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# What to Learn Next

## You Have the Foundation

At this point, you understand:

- Why DOM Helpers exists and what problems it addresses
- How the ten modules are organized and what each one is responsible for
- Why modules and sub-modules are kept separate
- The recommended patterns for accessing and updating elements
- How core, enhancers, conditions, storage, and the other modules work together
- What a structured DOM Helpers codebase looks like compared to plain JavaScript

This is the orientation layer. You know the map before exploring the territory.

Now it is time to learn each module in depth, starting from the foundation and working outward.

---

## The Recommended Learning Order

Learning in this order ensures that each new concept builds on something you already understand. Skipping ahead is possible, but you may encounter API references to things you have not yet learned.

---

### Step 1 — The Core Module

Start here. Everything else in DOM Helpers connects back to the core.

The core introduces the three helpers — Elements, Collections, Selector — and the `.update()` method that every element carries. Once you understand these, you understand the fundamental pattern that runs through the entire library.

**Start with:**

- [Introduction to DOM Helpers Core](../01_core/01_what-is-dh-core.md) — what the core provides and how the three helpers differ
- [Elements Helper](../01_core/02_elements-helper.md) — ID-based element access, caching, and all Elements methods
- [Collections Helper](../01_core/03_collections-helper.md) — group access by class, tag, and name; collection methods
- [Selector Helper](../01_core/04_selector-helper.md) — CSS selector access for complex queries
- [The Update Method](../01_core/05_the-update-method.md) — all 13 update types, change detection, chaining
- [Create Elements](../01_core/07_create-elements.md) — `createElement` and `createElement.bulk()` for building DOM programmatically

---

### Step 2 — Deep-Dive Access Guides

After the core overview, the access guides cover each helper in exhaustive detail. These are reference-level documentation organized by specific method or pattern.

**Elements access:**

- [Introduction to Elements Access](../07_Elements_Access_Methods/01_introduction-to-elements-access.md)
- [Basic ID Usage](../07_Elements_Access_Methods/02_basic-elements-id-usage.md)
- [Safe Access Methods](../07_Elements_Access_Methods/03_safe-access-methods.md) — `exists()`, `get()`, `getRequired()`
- [Cache Methods](../07_Elements_Access_Methods/04_cache-methods.md)
- [Batch Access](../07_Elements_Access_Methods/05_batch-access-methods.md)
- [Async Waiting](../07_Elements_Access_Methods/07_async-waiting.md) — `waitFor()`
- [Property and Attribute Methods](../07_Elements_Access_Methods/09_property-and-attribute-methods.md)

**Collections access:**

- [Introduction to Collections](../08_Collections_Access_Methods/01_introduction-to-collections.md)
- [Basic Access Methods](../08_Collections_Access_Methods/02_basic-access-methods.md)
- [Array-Like Methods](../08_Collections_Access_Methods/03_array-like-methods.md) — `forEach`, `map`, `filter`, `find`, `reduce`
- [DOM Manipulation Methods](../08_Collections_Access_Methods/04_dom-manipulation-methods.md) — `addClass`, `setStyle`, `on`, `off`
- [Filtering Methods](../08_Collections_Access_Methods/05_filtering-methods.md) — `visible`, `hidden`, `enabled`, `disabled`

**Selector access:**

- [Introduction to Selector](../09_Selector_Access_Methods/01_introduction-to-selector.md)
- [Basic Query Methods](../09_Selector_Access_Methods/02_basic-query-methods.md)
- [Scoped Query Methods](../09_Selector_Access_Methods/03_scoped-query-methods.md)
- [Async Methods](../09_Selector_Access_Methods/05_async-methods.md) — `waitFor`, `waitForAll`

---

### Step 3 — The Update Method in Depth

The `.update()` method is central to how DOM Helpers works. After you understand the core, study the full update method guide to learn every update type and when to use each one.

- [What Is Update and Why](../10_Update%20Method%20Guide/01_what-is-update-and-why.md)
- [The Update Object Explained](../10_Update%20Method%20Guide/02_the-update-object-explained.md)
- [Update Properties Deep Dive](../10_Update%20Method%20Guide/04_update-properties-deep-dive.md)
- [Fine-Grained Change Detection](../10_Update%20Method%20Guide/05_fine-grained-updates-change-detection.md)

**Multi-element updaters:**

- [What Is Elements.update](../11_Elements_Update/01_what-is-elements.update.md)
- [What Is Collections.update](../12_Collections_Update/01_what-is-collections.update.md)
- [What Is Selector.update](../13_Selector_Update/01_what-is-selector.update.md)

---

### Step 4 — Enhancers

Once you are comfortable with the core, enhancers will feel natural. They all follow the same patterns you already know — they just make common operations shorter.

Learn them in the order that matches how you use the library:

**Shortcuts for quicker access:**

- [Id Shortcut](../02_enhancers/20_Id_Shortcut/01_introduction-to-id-shortcut.md) — the `Id()` function
- [Collection Shortcuts](../02_enhancers/13_Collection_Shortcuts/01_introduction-to-collection-shortcuts.md) — `ClassName`, `TagName`, `Name`
- [Global Query](../02_enhancers/14_Global_Query/01_introduction-to-global-query.md) — `querySelector()`, `querySelectorAll()` (also available as `query()`, `queryAll()`)

**Updaters for more concise updates:**

- [Bulk Property Updaters](../02_enhancers/12_Bulk_Property_Updaters/01_introduction-to-bulk-property-updaters.md) — `Elements.textContent()`, `Elements.style()`, etc.
- [Indexed Collection Updates](../02_enhancers/15_Indexed_Collection_Updates/01_introduction-to-indexed-collection-updates.md)
- [Array-Based Updates](../02_enhancers/21_Array_Based_Updates/01_introduction-to-array-based-updates.md)

---

### Step 5 — Reactive

The reactive module introduces state management with automatic propagation. When state changes, effects re-run, computed values update, and the DOM reflects the new state — all without any manual calls.

Always use the shortcut form — `state()`, `effect()`, `computed()`, `watch()`, `batch()`, `ref()`, `refs()` — not the `ReactiveUtils.` prefix.

**Start with the overview:**

- [Reactive (Getting Started)](./09_reactive.md) — shortcuts, core functions, and how reactive connects to core, conditions, and storage

**Then the full documentation:**

- [What Is Reactive State](../04_reactive/31_Reactive_State/01_what-is-reactive-state.md)
- [Reactive Utils Shortcut](../04_reactive/39_Reactive_Utils_Shortcut/01_what-is-the-standalone-api.md) — the complete shortcut API
- [Reactive Guide](../04_reactive/40_Reactive_Guide/01_reactive_introduction.md) — full walkthrough from basics to advanced
- [Reactive with DOM Helpers Core](../04_reactive/40_Reactive_Guide/11_reactive_with_dom_helpers_core.md)
- [Reactive with Conditions](../04_reactive/40_Reactive_Guide/13_reactive_with_conditions.md)

---

### Step 6 — Conditions

After you are fluent in accessing and updating elements, Conditions introduces the next structural level: instead of writing update calls in event handlers, you declare what the DOM should look like for each state.

- [What Is Conditions](../03_conditions/Conditions_Guide/01_what-is-conditions.md)
- [WhenState Syntax and Basic Usage](../03_conditions/Conditions_Guide/02_whenState-syntax-and-basic-usage.md)
- [Condition Matchers](../03_conditions/Conditions_Guide/03_condition-matchers.md)
- [Property Handlers](../03_conditions/Conditions_Guide/04_property-handlers.md)
- [Apply and Watch](../03_conditions/Conditions_Guide/05_apply-and-watch.md)

---

### Step 7 — Storage

StorageUtils can be learned at any point. It does not depend on the core, reactive, or conditions — it is a standalone utility. But understanding it after the core and reactive lets you see immediately how it connects: storage holds persisted state, reactive state holds the live version, and watchers keep them in sync.

- [Introduction to StorageUtils](../05_storageUtils/01_introduction-to-storage-utils.md)
- [Save and Load](../05_storageUtils/02_save-and-load.md)
- [Namespaces](../05_storageUtils/04_namespaces.md)
- [Watch and Cross-Tab Sync](../05_storageUtils/05_watch-cross-tab-sync.md)
- [Auto-Save](../05_storageUtils/06_create-auto-save.md)

---

### Step 8 — createElement

`createElement` and `createElement.bulk()` are used when you need to build DOM elements from scratch in JavaScript. They are not required for working with existing HTML, but they are essential for dynamic UIs that create elements on demand.

- [What Is createElement](../06_createElement/01_what-is-createElement.md)
- [Enhanced createElement](../06_createElement/02_enhanced-createElement.md)
- [Bulk Element Creation](../06_createElement/03_bulk-element-creation.md)
- [Bulk Result Methods](../06_createElement/04_bulk-result-methods.md)
- [Configuration Object](../06_createElement/05_configuration-object.md)

---

### Step 9 — Native Enhance

The native-enhance module is ideal if you have an existing project that already uses `document.getElementById`, `document.getElementsByClassName`, or `querySelector`. Load it and those calls automatically return elements with full DOM Helpers power — no refactoring required.

- [What Is Native Enhance](../native-enhance/01_what-is-native-enhance.md)

---

### Step 10 — DOM Form

The DOM Form module (`Forms`) gives every form a structured API for reading values, validating fields, and submitting data. Learn this when your project involves forms that go beyond a simple one-off submission.

- [What Is DOM Form](../dom-form/01_what-is-dom-form.md)

---

### Step 11 — Animation

The animation module extends every element and collection returned by the core with `fadeIn`, `fadeOut`, `slideUp`, `slideDown`, `transform`, and a chainable `.animate()` builder. All animations are promises — you can `await` them.

- [What Is Animation](../animation/01_what-is-animation.md)

---

### Step 12 — Async

`AsyncHelpers` covers the async utility patterns that appear in nearly every project: debounce, throttle, fetch with timeout and retry, sleep, parallel execution, and async event handler wrappers.

- [What Is AsyncHelpers](../async/01_what-is-async.md)

---

### Step 13 — SPA Router

The SPA Router is the most complete module in the library. It handles client-side navigation, view mounting from `<template>` elements, animated transitions, declarative links, and navigation guards — all without a page reload.

- [What Is SPA Router](../10_spa/01_what-is-spa-router.md)
- [Getting Started with the Router](../10_spa/02_getting-started.md)
- [Defining Routes](../10_spa/03_defining-routes.md)
- [Navigation](../10_spa/04_navigation.md)
- [Route Params and Query](../10_spa/05_route-params-and-query.md)
- [View Transitions](../10_spa/06_view-transitions.md)
- [Router Links](../10_spa/07_router-links.md)
- [Navigation Guards](../10_spa/08_navigation-guards.md)
- [Real-World Examples](../10_spa/09_real-world-examples.md)
- [API Reference](../10_spa/10_api-reference.md)

---

## A Note on Learning Pace

There is no requirement to learn everything before you start building. The core module alone — Elements, Collections, Selector, and `.update()` — is enough to build real, structured pages. Add enhancers when repetition appears. Add reactive when you need state that automatically propagates changes. Add Conditions when state-driven UI mapping gets complex. Add Storage when persistence is needed. Add DOM Form, Animation, Async, and the Router as your project's requirements grow.

The library is layered intentionally so you can adopt it at your own pace without hitting walls.

---

## Begin Here

If you have not started yet, the first place to go is the core module introduction:

- **[What Is DOM Helpers Core](../01_core/01_what-is-dh-core.md)**