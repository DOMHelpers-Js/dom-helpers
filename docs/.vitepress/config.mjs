import { defineConfig } from "vitepress";

const fundamentalsSidebar = [
  {
    text: "Introduction to DOMHelpers Core",
    collapsed: true,
    items: [
      {
        text: "What Is DOM Helpers Core",
        link: "/01_core/01_what-is-dh-core",
      },
      {
        text: "Elements Helper",
        link: "/01_core/02_elements-helper",
      },
      {
        text: "Collections Helper",
        link: "/01_core/03_collections-helper",
      },
      { text: "Selector Helper",
        link: "/01_core/04_selector-helper"
      },
      { text: "Update Method",
        link: "/01_core/05_the-update-method"
      },
      { text: "Real World Examples",
        link: "/01_core/06_real-world-examples-and-api-reference"
      },
      { text: "Create Elements",
        link: "/01_core/07_create-elements"
      },
    ],
  },

  {
    text: "Elements Access Methods",
    collapsed: true,
    items: [
      {
        text: "Introduction To Elements Access",
        link: "/07_Elements_Access_Methods/01_introduction-to-elements-access",
      },
      {
        text: "Basic Elements Id Usage",
        link: "/07_Elements_Access_Methods/02_basic-elements-id-usage",
      },
      {
        text: "Safe Access Methods",
        link: "/07_Elements_Access_Methods/03_safe-access-methods",
      },
      {
        text: "Cache Methods",
        link: "/07_Elements_Access_Methods/04_cache-methods",
      },
      {
        text: "Batch Access Methods",
        link: "/07_Elements_Access_Methods/05_batch-access-methods",
      },
      {
        text: "Required Elements",
        link: "/07_Elements_Access_Methods/06_required-elements",
      },
      {
        text: "Async Waiting",
        link: "/07_Elements_Access_Methods/07_async-waiting",
      },
      {
        text: "Best Practices",
        link: "/07_Elements_Access_Methods/08_best-practices",
      },
      {
        text: "Property And Attribute Methods",
        link: "/07_Elements_Access_Methods/09_property-and-attribute-methods",
      },
      {
        text: "Utility Methods",
        link: "/07_Elements_Access_Methods/10_utility-methods",
      },
    ],
  },

  {
    text: "Collections Access Methods",
    collapsed: true,
    items: [
      {
        text: "Introduction To Collections",
        link: "/08_Collections_Access_Methods/01_introduction-to-collections",
      },
      {
        text: "Basic Access Methods",
        link: "/08_Collections_Access_Methods/02_basic-access-methods",
      },
      {
        text: "Array Like Methods",
        link: "/08_Collections_Access_Methods/03_array-like-methods",
      },
      {
        text: "DOM Manipulation Methods",
        link: "/08_Collections_Access_Methods/04_dom-manipulation-methods",
      },
      {
        text: "Filtering Methods",
        link: "/08_Collections_Access_Methods/05_filtering-methods",
      },
      {
        text: "Utility Methods",
        link: "/08_Collections_Access_Methods/06_utility-methods",
      },
      {
        text: "Helper Methods",
        link: "/08_Collections_Access_Methods/07_helper-methods",
      },
      {
        text: "Best Practices",
        link: "/08_Collections_Access_Methods/08_best-practices",
      },
    ],
  },

  {
    text: "Selector Access Methods",
    collapsed: true,
    items: [
      {
        text: "Introduction To Selector",
        link: "/09_Selector_Access_Methods/01_introduction-to-selector",
      },
      {
        text: "Basic Query Methods",
        link: "/09_Selector_Access_Methods/02_basic-query-methods",
      },
      {
        text: "Scoped Query Methods",
        link: "/09_Selector_Access_Methods/03_scoped-query-methods",
      },
      {
        text: "Shared Methods Reference",
        link: "/09_Selector_Access_Methods/04_shared-methods-reference",
      },
      {
        text: "Async Methods",
        link: "/09_Selector_Access_Methods/05_async-methods",
      },
      {
        text: "Helper Methods",
        link: "/09_Selector_Access_Methods/06_helper-methods",
      },
      {
        text: "Best Practices",
        link: "/09_Selector_Access_Methods/07_best-practices",
      },
    ],
  },

  {
    text: "Update Method Guide",
    collapsed: true,
    items: [
      {
        text: "What Is Update And Why",
        link: "/10_Update Method Guide/01_what-is-update-and-why",
      },
      {
        text: "The Update Object Explained",
        link: "/10_Update Method Guide/02_the-update-object-explained",
      },
      {
        text: "Understanding Parameters And Returns",
        link: "/10_Update Method Guide/03_understanding-parameters-and-returns",
      },
      {
        text: "Update Properties Deep Dive",
        link: "/10_Update Method Guide/04_update-properties-deep-dive",
      },
      {
        text: "Fine Grained Updates Change Detection",
        link: "/10_Update Method Guide/05_fine-grained-updates-change-detection",
      },
      {
        text: "Method Calls Through Update",
        link: "/10_Update Method Guide/06_method-calls-through-update",
      },
      {
        text: "Advanced Patterns And Techniques",
        link: "/10_Update Method Guide/07_advanced-patterns-and-techniques",
      },
      {
        text: "Best Practices And Common Mistakes",
        link: "/10_Update Method Guide/08_best-practices-and-common-mistakes",
      },
    ],
  },

  {
    text: "Elements Update",
    collapsed: true,
    items: [
      {
        text: "What Is Elements Update",
        link: "/11_Elements_Update/01_what-is-elements.update",
      },
      {
        text: "Understanding The Basic Example",
        link: "/11_Elements_Update/02_understanding-the-basic-example",
      },
      {
        text: "Targeting By Id",
        link: "/11_Elements_Update/03_targeting-by-id",
      },
      {
        text: "Real World Examples",
        link: "/11_Elements_Update/04_real-world-examples",
      },
      {
        text: "Update Object Properties",
        link: "/11_Elements_Update/05_update-object-properties",
      },
      {
        text: "Understanding The Return Value",
        link: "/11_Elements_Update/06_understanding-the-return-value",
      },
    ],
  },

  {
    text: "Collections Update",
    collapsed: true,
    items: [
      {
        text: "What Is Collections Update",
        link: "/12_Collections_Update/01_what-is-collections.update",
      },
      {
        text: "Understanding The Basic Example",
        link: "/12_Collections_Update/02_understanding-the-basic-example",
      },
      {
        text: "Type Value Format",
        link: "/12_Collections_Update/03_type-value-format",
      },
      {
        text: "Real World Examples",
        link: "/12_Collections_Update/04_real-world-examples",
      },
      {
        text: "Update Object Properties",
        link: "/12_Collections_Update/05_update-object-properties",
      },
      {
        text: "Understanding The Return Value",
        link: "/12_Collections_Update/06_understanding-the-return-value",
      },
    ],
  },

  {
    text: "Selector Update",
    collapsed: true,
    items: [
      {
        text: "What Is Selector Update",
        link: "/13_Selector_Update/01_what-is-selector.update",
      },
      {
        text: "Understanding The Basic Example",
        link: "/13_Selector_Update/02_understanding-the-basic-example",
      },
      {
        text: "Complex Selectors The Striped Table",
        link: "/13_Selector_Update/03_complex-selectors-the-striped-table",
      },
      {
        text: "Complex Selectors Navigation Example",
        link: "/13_Selector_Update/04_complex-selectors-navigation-example",
      },
      {
        text: "Complex Selectors Form Field States",
        link: "/13_Selector_Update/05_complex-selectors-form-field-states",
      },
      {
        text: "Update Object Properties",
        link: "/13_Selector_Update/06_update-object-properties",
      },
      {
        text: "Understanding The Return Value",
        link: "/13_Selector_Update/07_understanding-the-return-value",
      },
    ],
  },

  {
    text: "Creating Elements",
    collapsed: true,
    items: [
      {
        text: "Introduction To Creating Elements",
        link: "/17_creating_elements/01_introduction-to-creating-elements",
      },
      {
        text: "The Pain Of Plain JavaScript",
        link: "/17_creating_elements/02_the-pain-of-plain-js",
      },
      {
        text: "Auto-Enhanced createElement",
        link: "/17_creating_elements/03_auto-enhanced-document-createElement",
      },
      {
        text: "createElement With Config Object",
        link: "/17_creating_elements/04_createElement-with-config-object",
      },
      {
        text: "Bulk Single Element",
        link: "/17_creating_elements/05_bulk-single-element",
      },
      {
        text: "Bulk Multiple Elements",
        link: "/17_creating_elements/06_bulk-multiple-elements",
      },
      {
        text: "Numbered Instances",
        link: "/17_creating_elements/07_numbered-instances",
      },
      {
        text: "Factory Functions",
        link: "/17_creating_elements/08_factory-functions",
      },
      {
        text: "Component Pattern",
        link: "/17_creating_elements/09_component-pattern",
      },
      {
        text: "Template-Based Creation",
        link: "/17_creating_elements/10_template-based-creation",
      },
      {
        text: "The Result Object Methods",
        link: "/17_creating_elements/11_result-object-methods",
      },
      {
        text: "Append Methods",
        link: "/17_creating_elements/12_append-methods",
      },
      {
        text: "Additional Patterns",
        link: "/17_creating_elements/13_additional-patterns",
      },
      {
        text: "Real-World Examples",
        link: "/17_creating_elements/14_real-world-examples",
      },
    ],
  },

  {
    text: "Native Enhance",
    collapsed: true,
    items: [
      {
        text: "Enhanced GetById",
        link: "/06_native-enhance/01_enhanced-getbyid",
      },
      {
        text: "Enhanced GetElementsBy",
        link: "/06_native-enhance/02_enhanced-getelementsby",
      },
      {
        text: "Enhanced Document Query",
        link: "/06_native-enhance/03_enhanced-document-query",
      },
    ],
  },

  {
    text: "DOM Helpers Global Object",
    collapsed: true,
    items: [
      {
        text: "Introduction To DOM Helpers Global",
        link: "/15_DOMHelpers_Global_Object/01_introduction-to-domhelpers-global",
      },
      {
        text: "Properties Reference",
        link: "/15_DOMHelpers_Global_Object/02_properties-reference",
      },
      {
        text: "IsReady And Version",
        link: "/15_DOMHelpers_Global_Object/03_isready-and-version",
      },
      {
        text: "GetStats Combined Statistics",
        link: "/15_DOMHelpers_Global_Object/04_getstats-combined-statistics",
      },
      {
        text: "ClearAll And DestroyAll",
        link: "/15_DOMHelpers_Global_Object/05_clearall-and-destroyall",
      },
      {
        text: "Configure Options",
        link: "/15_DOMHelpers_Global_Object/06_configure-options",
      },
      {
        text: "createElement Enhancement Control",
        link: "/15_DOMHelpers_Global_Object/07_createelement-enhancement-control",
      },
      {
        text: "Best Practices",
        link: "/15_DOMHelpers_Global_Object/08_best-practices",
      },
    ],
  },

  {
    text: "Statistics And Cache Management",
    collapsed: true,
    items: [
      {
        text: "Introduction To Stats And Cache",
        link: "/16_Statistics_and_Cache_Management/01_introduction-to-stats-and-cache",
      },
      {
        text: "Stats Method Deep Dive",
        link: "/16_Statistics_and_Cache_Management/02_stats-method-deep-dive",
      },
      {
        text: "Clear Cache Manually",
        link: "/16_Statistics_and_Cache_Management/03_clear-cache-manually",
      },
      {
        text: "Destroy Cleanup",
        link: "/16_Statistics_and_Cache_Management/04_destroy-cleanup",
      },
      {
        text: "Configure Options Reference",
        link: "/16_Statistics_and_Cache_Management/05_configure-options-reference",
      },
      {
        text: "Auto Cleanup And Mutation Observer",
        link: "/16_Statistics_and_Cache_Management/06_auto-cleanup-and-mutation-observer",
      },
      {
        text: "Practical Patterns And Debugging",
        link: "/16_Statistics_and_Cache_Management/07_practical-patterns-and-debugging",
      },
    ],
  },

];

export default defineConfig({
  title: "DOM Helpers ",
  description: "A JavaScript-first DOM utility library",
  base: '/DOMHelpers-Core/',
  ignoreDeadLinks: true,

  themeConfig: {

    socialLinks: [
      { icon: 'github', link: 'https://github.com/giovanni1707/DOMHelpers-Core' }
    ],

nav: [
      {
        text: "Getting Started",
        link: "/getting-started/01_what-is-dom-helpers-core",
      },

      { text: "CDN", link: "/ALL-CDN-LINKS" },

      { text: "Core", link: "/01_core/01_what-is-dh-core" },

      { text: "Enhancers", link: "/02_enhancers/12_Bulk_Property_Updaters/01_introduction-to-bulk-property-updaters" },

      { text: "Conditions", link: "/03_conditions/Conditions_Guide/01_what-is-conditions" },

      { text: "Reactive", link: "/04_reactive/31_Reactive_State/01_what-is-reactive-state" },

      { text: "SPA Router", link: "/10_spa/01_what-is-spa-router" },

      {
        text: "Extras",
        items: [
          { text: "Storage Utils", link: "/05_storageUtils/01_introduction-to-storage-utils" },
          { text: "DOM Form", link: "/18_dom-form/01_what-is-forms" },
          { text: "Animation", link: "/19_animation/01_what-is-animation" },
          { text: "Async", link: "/20_async/01_what-is-async-helpers" },
        ],
      },

            {
        text: "About",
        items: [
          { text: "The Creator", link: "/creator/creator" },
          { text: "Sponsor", link: "/sponsor/sponsor" },
          { text: "Contributing Guidelines", link: "/creator/contributing" },
        ],
      },

      {
        text: "More Libraries",
        items: [
          { text: "DOMHelpers Reactive", link: "https://giovanni1707.github.io/DOMHelpers-Reactive/" },
          { text: "DOMHelpers ReactivePlus", link: "https://giovanni1707.github.io/DOMHelpers-ReactivePlus/" },
        ],
      },

     ],


    sidebar: {
    "/ALL-CDN-LINKS": [
      {
        text: "CDN Links",
        items: [
          { text: "All CDN Links", link: "/ALL-CDN-LINKS" },
        ],
      },
    ],

    "/getting-started/": [
        {
          text: "Getting Started",
          collapsed: false,
          items: [
            {
              text: "What Is DOM Helpers",
              link: "/getting-started/01_what-is-dom-helpers-core",
            },
            {
              text: "Why DOM Helpers Exists",
              link: "/getting-started/02_why-dom-helpers-exists",
            },
            {
              text: "Architecture Overview",
              link: "/getting-started/03_architecture-overview",
            },
            {
              text: "Why Modules Are Separated",
              link: "/getting-started/04_why-modules-are-separated",
            },
            {
              text: "Recommended Usage",
              link: "/getting-started/05_recommended-usage",
            },
            {
              text: "How Modules Work Together",
              link: "/getting-started/06_how-modules-work-together",
            },
            {
              text: "Plain JS vs DOM Helpers",
              link: "/getting-started/07_plain-js-vs-dom-helpers",
            },
            {
              text: "Reactive",
              link: "/getting-started/09_reactive",
            },
            {
              text: "What to Learn Next",
              link: "/getting-started/08_whats-next",
            },
            { text: "Installation", link: "/getting-started/installation" },
          ],
        },

        { text: "DOM Helpers Reactive", link: "https://example" },

      ],

      // All these routes share the fundamentals sidebar
      "/01_core/": fundamentalsSidebar,
      "/07_Elements_Access_Methods/": fundamentalsSidebar,
      "/08_Collections_Access_Methods/": fundamentalsSidebar,
      "/09_Selector_Access_Methods/": fundamentalsSidebar,
      "/10_Update Method Guide/": fundamentalsSidebar,
      "/11_Elements_Update/": fundamentalsSidebar,
      "/12_Collections_Update/": fundamentalsSidebar,
      "/13_Selector_Update/": fundamentalsSidebar,
      "/17_creating_elements/": fundamentalsSidebar,
      "/15_DOMHelpers_Global_Object/": fundamentalsSidebar,
      "/16_Statistics_and_Cache_Management/": fundamentalsSidebar,
      "/06_native-enhance/": fundamentalsSidebar,

      "/10_spa/": [
        {
          text: "SPA Router",
          collapsed: false,
          items: [
            { text: "What Is SPA Router", link: "/10_spa/01_what-is-spa-router" },
            { text: "Getting Started", link: "/10_spa/02_getting-started" },
            { text: "Defining Routes", link: "/10_spa/03_defining-routes" },
            { text: "Navigation", link: "/10_spa/04_navigation" },
            { text: "Route Params And Query", link: "/10_spa/05_route-params-and-query" },
            { text: "View Transitions", link: "/10_spa/06_view-transitions" },
            { text: "Router Links", link: "/10_spa/07_router-links" },
            { text: "Navigation Guards", link: "/10_spa/08_navigation-guards" },
            { text: "Real-World Examples", link: "/10_spa/09_real-world-examples" },
            { text: "API Reference", link: "/10_spa/10_api-reference" },
          ],
        },
      ],

      "/02_enhancers/": [
        {
          text: "Bulk Property Updaters",
          collapsed: true,
          items: [
            {
              text: "Bulk Property Updaters",
              link: "/02_enhancers/12_Bulk_Property_Updaters/01_introduction-to-bulk-property-updaters",
            },
            {
              text: "Elements Text And Content",
              link: "/02_enhancers/12_Bulk_Property_Updaters/02_elements-text-and-content-updaters",
            },
            {
              text: "Form And state",
              link: "/02_enhancers/12_Bulk_Property_Updaters/03_elements-form-and-state-updaters",
            },

            {
              text: "Media And links",
              link: "/02_enhancers/12_Bulk_Property_Updaters/04_elements-media-and-link-updaters",
            },
            {
              text: "Elements Style",
              link: "/02_enhancers/12_Bulk_Property_Updaters/05_elements-style-updater",
            },
            {
              text: "Dataset And Attributes",
              link: "/02_enhancers/12_Bulk_Property_Updaters/06_elements-dataset-and-attrs-updaters",
            },
            {
              text: "Elements classes",
              link: "/02_enhancers/12_Bulk_Property_Updaters/07_elements-classes-updater",
            },
            {
              text: "Elements Prop",
              link: "/02_enhancers/12_Bulk_Property_Updaters/08_elements-prop-updater",
            },
            {
              text: "Collection Bulk Updaters",
              link: "/02_enhancers/12_Bulk_Property_Updaters/09_collections-bulk-updaters",
            },
            {
              text: "Chaining And Best Practices",
              link: "/02_enhancers/12_Bulk_Property_Updaters/10_chaining-and-best-practices",
            }, 

          ],
        },

        {
          text: "Collection Shortcuts",
          collapsed: true,
          items: [
            {
              text: "What Are Collection Shortcuts",
              link: "/02_enhancers/13_Collection_Shortcuts/01_introduction-to-collection-shortcuts",
            },
            {
              text: "ClassName Shortcut",
              link: "/02_enhancers/13_Collection_Shortcuts/02_classname-shortcut",
            },
            {
              text: "Tagname And Name Shortcuts",
              link: "/02_enhancers/13_Collection_Shortcuts/03_tagname-and-name-shortcuts",
            },
            {
              text: "Index Access And Negative Indices",
              link: "/02_enhancers/13_Collection_Shortcuts/04_index-access-and-negative-indices",
            },
            {
              text: "Auto Enhancement And Update",
              link: "/02_enhancers/13_Collection_Shortcuts/05_auto-enhancement-and-update",
            },
            {
              text: "Practical Patterns And Best Practices",
              link: "/02_enhancers/13_Collection_Shortcuts/06_practical-patterns-and-best-practices",
            },
          ],
        },

        {
          text: "Global Query",
          collapsed: true,
          items: [
            {
              text: "Introduction To Global Query",
              link: "/02_enhancers/14_Global_Query/01_introduction-to-global-query",
            },
            {
              text: "Query And QueryAll",
              link: "/02_enhancers/14_Global_Query/02_query-and-queryall",
            },
            {
              text: "Scoped Queries QueryWithin",
              link: "/02_enhancers/14_Global_Query/03_scoped-queries-querywithin",
            },
            {
              text: "Enhanced Collections",
              link: "/02_enhancers/14_Global_Query/04_enhanced-collections",
            },
            {
              text: "Collection Helper Methods",
              link: "/02_enhancers/14_Global_Query/05_collection-helper-methods",
            },
            {
              text: "Module Setup And Best Practices",
              link: "/02_enhancers/14_Global_Query/06_module-setup-and-best-practices",
            },
          ],
        },

        {
          text: "Indexed Collection Updates",
          collapsed: true,
          items: [
            {
              text: "Introduction To Indexed Collection Updates",
              link: "/02_enhancers/15_Indexed_Collection_Updates/01_introduction-to-indexed-collection-updates",
            },
            {
              text: "Bulk Vs Indexed Updates",
              link: "/02_enhancers/15_Indexed_Collection_Updates/02_bulk-vs-indexed-updates",
            },
            {
              text: "Negative Indices",
              link: "/02_enhancers/15_Indexed_Collection_Updates/03_negative-indices",
            },
            {
              text: "Override Pattern Bulk Then Index",
              link: "/02_enhancers/15_Indexed_Collection_Updates/04_override-pattern-bulk-then-index",
            },
            {
              text: "Patching And Utility Methods",
              link: "/02_enhancers/15_Indexed_Collection_Updates/05_patching-and-utility-methods",
            },
            {
              text: "Integration And Best Practices",
              link: "/02_enhancers/15_Indexed_Collection_Updates/06_integration-and-best-practices",
            },
          ],
        },

        {
          text: "Index Selection",
          collapsed: true,
          items: [
            {
              text: "Introduction To Index Selection",
              link: "/02_enhancers/16_Index_Selection/01_introduction-to-index-selection",
            },
            {
              text: "What Gets Enhanced",
              link: "/02_enhancers/16_Index_Selection/02_what-gets-enhanced",
            },
            {
              text: "Usage Examples And Best Practices",
              link: "/02_enhancers/16_Index_Selection/03_usage-examples-and-best-practices",
            },
          ],
        },

        {
          text: "Global Collection Indexed Updates",
          collapsed: true,
          items: [
            {
              text: "Introduction To Global Collection Indexed Updates",
              link: "/02_enhancers/17_Global_Collection_Indexed_Updates/01_introduction-to-global-collection-indexed-updates",
            },
            {
              text: "Indexed Updates On ClassName Tagname Name",
              link: "/02_enhancers/17_Global_Collection_Indexed_Updates/02_indexed-updates-on-classname-tagname-name",
            },
            {
              text: "Enhanced Collection Features",
              link: "/02_enhancers/17_Global_Collection_Indexed_Updates/03_enhanced-collection-features",
            },
            {
              text: "Utility Methods And Best Practices",
              link: "/02_enhancers/17_Global_Collection_Indexed_Updates/04_utility-methods-and-best-practices",
            },
          ],
        },

        {
          text: "Bulk Properties Global Query",
          collapsed: true,
          items: [
            {
              text: "Introduction To Bulk Properties Global Query",
              link: "/02_enhancers/18_Bulk_Properties_Global_Query/01_introduction-to-bulk-properties-global-query",
            },
            {
              text: "Query Functions And Element Update",
              link: "/02_enhancers/18_Bulk_Properties_Global_Query/02_query-functions-and-element-update",
            },
            {
              text: "Collection Bulk Property Methods",
              link: "/02_enhancers/18_Bulk_Properties_Global_Query/03_collection-bulk-property-methods",
            },
            {
              text: "Prop Method And Best Practices",
              link: "/02_enhancers/18_Bulk_Properties_Global_Query/04_prop-method-and-best-practices",
            },
          ],
        },

        {
          text: "Selector Update Patch",
          collapsed: true,
          items: [
            {
              text: "Introduction To Selector Update Patch",
              link: "/02_enhancers/19_Selector_Update_Patch/01_introduction-to-selector-update-patch",
            },
            {
              text: "Enhanced Index Access And Update",
              link: "/02_enhancers/19_Selector_Update_Patch/02_enhanced-index-access-and-update",
            },
            {
              text: "Utility Methods And Best Practices",
              link: "/02_enhancers/19_Selector_Update_Patch/03_utility-methods-and-best-practices",
            },
          ],
        },

        {
          text: "Id Shortcut",
          collapsed: true,
          items: [
            {
              text: "Introduction To Id Shortcut",
              link: "/02_enhancers/20_Id_Shortcut/01_introduction-to-id-shortcut",
            },
            {
              text: "Advanced Methods Multiple Required WaitFor",
              link: "/02_enhancers/20_Id_Shortcut/02_advanced-methods-multiple-required-waitfor",
            },
            {
              text: "Utility And Bulk Operations",
              link: "/02_enhancers/20_Id_Shortcut/03_utility-and-bulk-operations",
            },
            {
              text: "Property Attribute And Cache Management",
              link: "/02_enhancers/20_Id_Shortcut/04_property-attribute-and-cache-management",
            },
          ],
        },

        {
          text: "Array Based Updates",
          collapsed: true,
          items: [
            {
              text: "Introduction To Array Based Updates",
              link: "/02_enhancers/21_Array_Based_Updates/01_introduction-to-array-based-updates",
            },
            {
              text: "Array Distribution And How It Works",
              link: "/02_enhancers/21_Array_Based_Updates/02_array-distribution-and-how-it-works",
            },
            {
              text: "Supported Properties And Advanced Patterns",
              link: "/02_enhancers/21_Array_Based_Updates/03_supported-properties-and-advanced-patterns",
            },
            {
              text: "Utility Methods And Best Practices",
              link: "/02_enhancers/21_Array_Based_Updates/04_utility-methods-and-best-practices",
            },
          ],
        },

      ],

      "/03_conditions/": [
        {
          text: "Conditions Guide",
          collapsed: true,
          items: [
            {
              text: "What Is Conditions",
              link: "/03_conditions/Conditions_Guide/01_what-is-conditions",
            },
            {
              text: "WhenState Syntax And Basic Usage",
              link: "/03_conditions/Conditions_Guide/02_whenState-syntax-and-basic-usage",
            },
            {
              text: "Condition Matchers",
              link: "/03_conditions/Conditions_Guide/03_condition-matchers",
            },
            {
              text: "Property Handlers",
              link: "/03_conditions/Conditions_Guide/04_property-handlers",
            },
            {
              text: "Apply And Watch",
              link: "/03_conditions/Conditions_Guide/05_apply-and-watch",
            },
            {
              text: "Default Branch",
              link: "/03_conditions/Conditions_Guide/06_default-branch",
            },
            {
              text: "Extending Conditions",
              link: "/03_conditions/Conditions_Guide/07_extending-conditions",
            },
            {
              text: "Real World Patterns",
              link: "/03_conditions/Conditions_Guide/08_real-world-patterns",
            },
            {
              text: "Default Branch Extension",
              link: "/03_conditions/Conditions_Guide/09_default-branch-extension",
            },
            {
              text: "Collection Extension",
              link: "/03_conditions/Conditions_Guide/10_collection-extension",
            },
          ],
        },

        {
          text: "Conditional Rendering",
          collapsed: true,
          items: [
            {
              text: "Introduction To Conditional Rendering",
              link: "/03_conditions/22_Conditional_Rendering/01_introduction-to-conditional-rendering",
            },
            {
              text: "Condition Matchers",
              link: "/03_conditions/22_Conditional_Rendering/02_condition-matchers",
            },
            {
              text: "Property Handlers And Config",
              link: "/03_conditions/22_Conditional_Rendering/03_property-handlers-and-config",
            },
            {
              text: "Reactive Mode And Watch",
              link: "/03_conditions/22_Conditional_Rendering/04_reactive-mode-and-watch",
            },
            {
              text: "Extensibility And Best Practices",
              link: "/03_conditions/22_Conditional_Rendering/05_extensibility-and-best-practices",
            },
          ],
        },

        {
          text: "Conditions Default",
          collapsed: true,
          items: [
            {
              text: "Introduction To Conditions Default",
              link: "/03_conditions/23_Conditions_Default/01_introduction-to-conditions-default",
            },
            {
              text: "Usage Examples And Best Practices",
              link: "/03_conditions/23_Conditions_Default/02_usage-examples-and-best-practices",
            },
          ],
        },

        {
          text: "Conditions Collection",
          collapsed: true,
          items: [
            {
              text: "Introduction To Conditions Collection",
              link: "/03_conditions/24_Conditions_Collection/01_introduction-to-conditions-collection",
            },
            {
              text: "Usage Examples And Best Practices",
              link: "/03_conditions/24_Conditions_Collection/02_usage-examples-and-best-practices",
            },
          ],
        },

        {
          text: "Conditions Apply Standalone",
          collapsed: true,
          items: [
            {
              text: "Introduction To Conditions Apply Standalone",
              link: "/03_conditions/25_Conditions_Apply_Standalone/01_introduction-to-conditions-apply-standalone",
            },
            {
              text: "Usage Examples And Best Practices",
              link: "/03_conditions/25_Conditions_Apply_Standalone/02_usage-examples-and-best-practices",
            },
          ],
        },

        {
          text: "Conditions Global Shortcut",
          collapsed: true,
          items: [
            {
              text: "Introduction To Conditions Global Shortcut",
              link: "/03_conditions/26_Conditions_Global_Shortcut/01_introduction-to-conditions-global-shortcut",
            },
            {
              text: "Usage Examples And Best Practices",
              link: "/03_conditions/26_Conditions_Global_Shortcut/02_usage-examples-and-best-practices",
            },
          ],
        },

        {
          text: "Matchers Handlers Shortcut",
          collapsed: true,
          items: [
            {
              text: "Introduction To Matchers Handlers Shortcut",
              link: "/03_conditions/27_Matchers_Handlers_Shortcut/01_introduction-to-matchers-handlers-shortcut",
            },
            {
              text: "Usage Examples And Best Practices",
              link: "/03_conditions/27_Matchers_Handlers_Shortcut/02_usage-examples-and-best-practices",
            },
          ],
        },

        {
          text: "Conditions Array Support",
          collapsed: true,
          items: [
            {
              text: "Introduction To Conditions Array Support",
              link: "/03_conditions/28_Conditions_Array_Support/01_introduction-to-conditions-array-support",
            },
            {
              text: "Usage Examples And Best Practices",
              link: "/03_conditions/28_Conditions_Array_Support/02_usage-examples-and-best-practices",
            },
          ],
        },

        {
          text: "Conditions Batch States",
          collapsed: true,
          items: [
            {
              text: "Introduction To Conditions Batch States",
              link: "/03_conditions/29_Conditions_Batch_States/01_introduction-to-conditions-batch-states",
            },
            {
              text: "Usage Examples And Best Practices",
              link: "/03_conditions/29_Conditions_Batch_States/02_usage-examples-and-best-practices",
            },
          ],
        },

        {
          text: "Conditions Cleanup Fix",
          collapsed: true,
          items: [
            {
              text: "Introduction To Conditions Cleanup Fix",
              link: "/03_conditions/30_Conditions_Cleanup_Fix/01_introduction-to-conditions-cleanup-fix",
            },
            {
              text: "Usage Examples And Best Practices",
              link: "/03_conditions/30_Conditions_Cleanup_Fix/02_usage-examples-and-best-practices",
            },
          ],
        },
      ],

      "/04_reactive/": [
        {
          text: "Reactive State",
          collapsed: true,
          items: [
            {
              text: "What Is Reactive State",
              link: "/04_reactive/31_Reactive_State/01_what-is-reactive-state",
            },
            {
              text: "Understanding The Basic Example",
              link: "/04_reactive/31_Reactive_State/02_understanding-the-basic-example",
            },
            {
              text: "Creating Reactive State And The Proxy System",
              link: "/04_reactive/31_Reactive_State/03_creating-reactive-state-and-the-proxy-system",
            },
            {
              text: "Effects Computed And Watch",
              link: "/04_reactive/31_Reactive_State/04_effects-computed-and-watch",
            },
            {
              text: "Instance Methods",
              link: "/04_reactive/31_Reactive_State/05_instance-methods",
            },
            {
              text: "Specialized State Factories",
              link: "/04_reactive/31_Reactive_State/06_specialized-state-factories",
            },
            {
              text: "Store Component And Builder",
              link: "/04_reactive/31_Reactive_State/07_store-component-and-builder",
            },
            {
              text: "Bindings And DOM Integration",
              link: "/04_reactive/31_Reactive_State/08_bindings-and-dom-integration",
            },
            {
              text: "Real World Examples",
              link: "/04_reactive/31_Reactive_State/09_real-world-examples",
            },
            {
              text: "Utilities And API Reference",
              link: "/04_reactive/31_Reactive_State/10_utilities-and-api-reference",
            },
          ],
        },

        {
          text: "Reactive Array Patch",
          collapsed: true,
          items: [
            {
              text: "What Is Reactive Array Patch",
              link: "/04_reactive/32_Reactive_Array_Patch/01_what-is-reactive-array-patch",
            },
            {
              text: "Understanding The Basic Example",
              link: "/04_reactive/32_Reactive_Array_Patch/02_understanding-the-basic-example",
            },
            {
              text: "Real World Examples And Best Practices",
              link: "/04_reactive/32_Reactive_Array_Patch/03_real-world-examples-and-best-practices",
            },
            {
              text: "Manual Patching And API Reference",
              link: "/04_reactive/32_Reactive_Array_Patch/04_manual-patching-and-api-reference",
            },
          ],
        },

        {
          text: "Reactive Collections",
          collapsed: true,
          items: [
            {
              text: "What Is Reactive Collections",
              link: "/04_reactive/33_Reactive_Collections/01_what-is-reactive-collections",
            },
            {
              text: "Understanding The Basic Example",
              link: "/04_reactive/33_Reactive_Collections/02_understanding-the-basic-example",
            },
            {
              text: "Collection Methods Deep Dive",
              link: "/04_reactive/33_Reactive_Collections/03_collection-methods-deep-dive",
            },
            {
              text: "Real World Examples And Best Practices",
              link: "/04_reactive/33_Reactive_Collections/04_real-world-examples-and-best-practices",
            },
            {
              text: "Advanced Features And API Reference",
              link: "/04_reactive/33_Reactive_Collections/05_advanced-features-and-api-reference",
            },
          ],
        },

        {
          text: "Reactive Form",
          collapsed: true,
          items: [
            {
              text: "What Is Reactive Form",
              link: "/04_reactive/34_Reactive_Form/01_what-is-reactive-form",
            },
            {
              text: "Understanding The Basic Example",
              link: "/04_reactive/34_Reactive_Form/02_understanding-the-basic-example",
            },
            {
              text: "Form Methods Deep Dive",
              link: "/04_reactive/34_Reactive_Form/03_form-methods-deep-dive",
            },
            {
              text: "Built-In Validators",
              link: "/04_reactive/34_Reactive_Form/04_built-in-validators",
            },
            {
              text: "Real World Examples And Best Practices",
              link: "/04_reactive/34_Reactive_Form/05_real-world-examples-and-best-practices",
            },
            {
              text: "DOM Binding Event Handling And API Reference",
              link: "/04_reactive/34_Reactive_Form/06_dom-binding-event-handling-and-api-reference",
            },
          ],
        },

        {
          text: "Reactive Cleanup",
          collapsed: true,
          items: [
            {
              text: "What Is Reactive Cleanup",
              link: "/04_reactive/35_Reactive_Cleanup/01_what-is-reactive-cleanup",
            },
            {
              text: "Understanding The Basic Example",
              link: "/04_reactive/35_Reactive_Cleanup/02_understanding-the-basic-example",
            },
            {
              text: "Cleanup Methods Deep Dive",
              link: "/04_reactive/35_Reactive_Cleanup/03_cleanup-methods-deep-dive",
            },
            {
              text: "Real World Examples Diagnostics And API Reference",
              link: "/04_reactive/35_Reactive_Cleanup/04_real-world-examples-diagnostics-and-api-reference",
            },
          ],
        },

        {
          text: "Reactive Enhancements",
          collapsed: true,
          items: [
            {
              text: "What Is Reactive Enhancements",
              link: "/04_reactive/36_Reactive_Enhancements/01_what-is-reactive-enhancements",
            },
            {
              text: "Enhanced Batching And Priority Queue",
              link: "/04_reactive/36_Reactive_Enhancements/02_enhanced-batching-and-priority-queue",
            },
            {
              text: "Deep Reactivity For Map And Set",
              link: "/04_reactive/36_Reactive_Enhancements/03_deep-reactivity-for-map-and-set",
            },
            {
              text: "Enhanced Computed And Error Boundaries",
              link: "/04_reactive/36_Reactive_Enhancements/04_enhanced-computed-and-error-boundaries",
            },
            {
              text: "Async Effects And Enhanced Async State",
              link: "/04_reactive/36_Reactive_Enhancements/05_async-effects-and-enhanced-async-state",
            },
            {
              text: "DevTools Real World Examples And API Reference",
              link: "/04_reactive/36_Reactive_Enhancements/06_devtools-real-world-examples-and-api-reference",
            },
          ],
        },

        {
          text: "Reactive Storage",
          collapsed: true,
          items: [
            {
              text: "What Is Reactive Storage",
              link: "/04_reactive/37_Reactive_Storage/01_what-is-reactive-storage",
            },
            {
              text: "Understanding AutoSave",
              link: "/04_reactive/37_Reactive_Storage/02_understanding-autosave",
            },
            {
              text: "AutoSave Options Methods And Production Features",
              link: "/04_reactive/37_Reactive_Storage/03_autosave-options-methods-and-production-features",
            },
            {
              text: "Reactive Storage Watch And Cross Tab Sync",
              link: "/04_reactive/37_Reactive_Storage/04_reactive-storage-watch-and-cross-tab-sync",
            },
            {
              text: "Real World Examples Best Practices And API Reference",
              link: "/04_reactive/37_Reactive_Storage/05_real-world-examples-best-practices-and-api-reference",
            },
          ],
        },

        {
          text: "Reactive Namespace Methods",
          collapsed: true,
          items: [
            {
              text: "What Is Namespace Methods",
              link: "/04_reactive/38_Reactive_Namespace_Methods/01_what-is-namespace-methods",
            },
            {
              text: "All 14 Methods Explained",
              link: "/04_reactive/38_Reactive_Namespace_Methods/02_all-14-methods-explained",
            },
            {
              text: "Real World Examples Availability And API Reference",
              link: "/04_reactive/38_Reactive_Namespace_Methods/03_real-world-examples-availability-and-api-reference",
            },
          ],
        },

        {
          text: "Reactive Utils Shortcut",
          collapsed: true,
          items: [
            {
              text: "What Is The Standalone API",
              link: "/04_reactive/39_Reactive_Utils_Shortcut/01_what-is-the-standalone-api",
            },
            {
              text: "Understanding Global Functions",
              link: "/04_reactive/39_Reactive_Utils_Shortcut/02_understanding-global-functions",
            },
            {
              text: "Core Functions Deep Dive",
              link: "/04_reactive/39_Reactive_Utils_Shortcut/03_core-functions-deep-dive",
            },
            {
              text: "Advanced Functions",
              link: "/04_reactive/39_Reactive_Utils_Shortcut/04_advanced-functions",
            },
            {
              text: "Storage And Collection Functions",
              link: "/04_reactive/39_Reactive_Utils_Shortcut/05_storage-and-collection-functions",
            },
            {
              text: "Real World Examples And API Reference",
              link: "/04_reactive/39_Reactive_Utils_Shortcut/06_real-world-examples-and-api-reference",
            },
          ],
        },

        {
          text: "Reactive Guide",
          collapsed: true,
          items: [
            {
              text: "Reactive Introduction",
              link: "/04_reactive/40_Reactive_Guide/01_reactive_introduction",
            },
            {
              text: "Creating State",
              link: "/04_reactive/40_Reactive_Guide/02_creating_state",
            },
            {
              text: "Updating State",
              link: "/04_reactive/40_Reactive_Guide/03_updating_state",
            },
            {
              text: "Effects",
              link: "/04_reactive/40_Reactive_Guide/04_effects",
            },
            {
              text: "Computed And Watch",
              link: "/04_reactive/40_Reactive_Guide/05_computed_and_watch",
            },
            {
              text: "Batch Ref And Utilities",
              link: "/04_reactive/40_Reactive_Guide/06_batch_ref_and_utilities",
            },
            {
              text: "Specialized State",
              link: "/04_reactive/40_Reactive_Guide/07_specialized_state",
            },
            {
              text: "Advanced Patterns",
              link: "/04_reactive/40_Reactive_Guide/08_advanced_patterns",
            },
            {
              text: "Reactive Standalone Usage",
              link: "/04_reactive/40_Reactive_Guide/09_reactive_standalone_usage",
            },
            {
              text: "Reactive With Plain JS DOM",
              link: "/04_reactive/40_Reactive_Guide/10_reactive_with_plain_js_dom",
            },
            {
              text: "Reactive With DOM Helpers Core",
              link: "/04_reactive/40_Reactive_Guide/11_reactive_with_dom_helpers_core",
            },
            {
              text: "Reactive With Enhancers",
              link: "/04_reactive/40_Reactive_Guide/12_reactive_with_enhancers",
            },
            {
              text: "Reactive With Conditions",
              link: "/04_reactive/40_Reactive_Guide/13_reactive_with_conditions",
            },
            {
              text: "Full Power Reactive DOM Helpers",
              link: "/04_reactive/40_Reactive_Guide/14_full_power_reactive_dom_helpers",
            },
          ],
        },
      ],

      "/05_storageUtils/": [
        {
          text: "Storage Utils",
          collapsed: true,
          items: [
            {
              text: "Introduction To Storage Utils",
              link: "/05_storageUtils/01_introduction-to-storage-utils",
            },
            {
              text: "Save And Load",
              link: "/05_storageUtils/02_save-and-load",
            },
            {
              text: "Clear And Exists",
              link: "/05_storageUtils/03_clear-and-exists",
            },
            {
              text: "Namespaces",
              link: "/05_storageUtils/04_namespaces",
            },
            {
              text: "Watch And Cross Tab Sync",
              link: "/05_storageUtils/05_watch-cross-tab-sync",
            },
            {
              text: "Create Auto Save",
              link: "/05_storageUtils/06_create-auto-save",
            },
            {
              text: "GetInfo And ClearAll",
              link: "/05_storageUtils/07_getinfo-and-clearall",
            },
            {
              text: "Integration And Best Practices",
              link: "/05_storageUtils/08_integration-and-best-practices",
            },
          ],
        },
      ],

      "/06_createElement/": [
        {
          text: "Create Element",
          collapsed: true,
          items: [
            {
              text: "What Is createElement",
              link: "/06_createElement/01_what-is-createElement",
            },
            {
              text: "Enhanced createElement",
              link: "/06_createElement/02_enhanced-createElement",
            },
            {
              text: "Bulk Element Creation",
              link: "/06_createElement/03_bulk-element-creation",
            },
            {
              text: "Bulk Result Methods",
              link: "/06_createElement/04_bulk-result-methods",
            },
            {
              text: "Configuration Object",
              link: "/06_createElement/05_configuration-object",
            },
            {
              text: "Real World Examples And API Reference",
              link: "/06_createElement/06_real-world-examples-and-api-reference",
            },
            {
              text: "Ways To Create",
              link: "/06_createElement/07_createElement-Ways-to-create",
            },
            {
              text: "Append Methods",
              link: "/06_createElement/08_appendMethods",
            },
            {
              text: "More Guide On Bulk Creation",
              link: "/06_createElement/09_more guide on bulk creation",
            },
            {
              text: "createElement Note",
              link: "/06_createElement/10_createElementNote",
            },
            {
              text: "The Second Parameter",
              link: "/06_createElement/11_The Second Parameter",
            },
            {
              text: "createElement Demo Code",
              link: "/06_createElement/12_createElementDemoCode",
            },
          ],
        },
      ],

      "/18_dom-form/": [
        {
          text: "DOM Form",
          collapsed: true,
          items: [
            {
              text: "What Is Forms",
              link: "/18_dom-form/01_what-is-forms",
            },
            {
              text: "Values GetField SetField",
              link: "/18_dom-form/02_values-getfield-setfield",
            },
            {
              text: "Validate And Serialize",
              link: "/18_dom-form/03_validate-and-serialize",
            },
            {
              text: "Submit And Reset",
              link: "/18_dom-form/04_submit-and-reset",
            },
            {
              text: "Form Enhance And Validators",
              link: "/18_dom-form/05_form-enhance-and-validators",
            },
            {
              text: "Real World Patterns",
              link: "/18_dom-form/06_real-world-patterns",
            },
          ],
        },
      ],

      "/19_animation/": [
        {
          text: "Animation",
          collapsed: true,
          items: [
            {
              text: "What Is Animation",
              link: "/19_animation/01_what-is-animation",
            },
            {
              text: "Fade And Slide",
              link: "/19_animation/02_fade-and-slide",
            },
            {
              text: "Transform",
              link: "/19_animation/03_transform",
            },
            {
              text: "Animation Chain",
              link: "/19_animation/04_animation-chain",
            },
            {
              text: "Easing And Options",
              link: "/19_animation/05_easing-and-options",
            },
            {
              text: "Update Integration And Patterns",
              link: "/19_animation/06_update-integration-and-patterns",
            },
          ],
        },
      ],

      "/20_async/": [
        {
          text: "Async Helpers",
          collapsed: true,
          items: [
            {
              text: "What Is Async Helpers",
              link: "/20_async/01_what-is-async-helpers",
            },
            {
              text: "Debounce And Throttle",
              link: "/20_async/02_debounce-and-throttle",
            },
            {
              text: "Enhanced Fetch",
              link: "/20_async/03_enhanced-fetch",
            },
            {
              text: "Async Handler Sleep Sanitize",
              link: "/20_async/04_async-handler-sleep-sanitize",
            },
            {
              text: "Parallel And Race",
              link: "/20_async/05_parallel-and-race",
            },
            {
              text: "Real World Patterns",
              link: "/20_async/06_real-world-patterns",
            },
          ],
        },
      ],

      "/creator/": [
        {
          text: "The Creator",
          collapsed: true,
          items: [
            { text: "About Me", link: "/creator/creator" },
            { text: "Approach & Philosophy", link: "/creator/approach-and-philosophy" },
            { text: "Contact And Support", link: "/creator/contact-info" },
            { text: "Contributing Guidelines", link: "/creator/contributing" },
          ],
        },
      ],

      "/sponsor/": [
        {
          text: "Sponsor The Project",
          collapsed: true,
          items: [
            { text: "sponsor", link: "/sponsor/sponsor" },
            { text: "developer note", link: "/sponsor/note" },
          ],
        },
      ],
    },
  },
});