# Understanding Module Loaders - A Beginner's Guide

## What are Module Loaders?

Module Loaders are **utility methods** that help you **load and verify** different parts of the Conditions System. They enable **modular architecture** where you can load only what you need.

Think of them as **dependency checkers and module managers**:
1. Check if required modules are available
2. Load modules on demand
3. Report loading status
4. Ensure dependencies are met
5. Enable flexible architecture

It's like a **"module health check"** system - ensuring all the pieces are in place!

---

## Why Do Module Loaders Exist?

### The Problem: Monolithic vs Modular Loading

Without module loaders, you'd need to manually track dependencies and load everything:

```javascript
// Do I have all the modules? ❌
// Which modules are loaded?
// Are collections available?
// Did shortcuts load successfully?
// How do I load only what I need?

// You'd have to manually check each one
if (typeof ConditionsCore === 'undefined') {
  console.error('Missing core!');
}
if (typeof ConditionsCollections === 'undefined') {
  console.warn('Collections not available');
}
// Tedious and error-prone!
```

**Problems:**
- Manual dependency checking
- Can't verify module availability
- Don't know what's loaded
- Hard to debug missing modules
- Can't load modules selectively
- No standardized loading approach

### The Solution: Centralized Module Management

Module loaders provide a unified interface:

```javascript
// Check and load all modules ✅
const status = Conditions.loadAll();

console.log('Loaded:', status.loaded);     // ['core', 'default', 'collections', 'shortcuts']
console.log('Missing:', status.missing);   // []
console.log('All loaded:', status.allLoaded); // true

// Or load only what you need
Conditions.loadCore();         // Core functionality only
Conditions.loadCollections();  // Add collections support
Conditions.loadShortcuts();    // Add global shortcuts
```

**Benefits:**
- ✅ Centralized module management
- ✅ Clear loading status
- ✅ Easy dependency verification
- ✅ Flexible loading strategies
- ✅ Better error reporting
- ✅ Modular architecture support

---

## Available Module Loaders

### 1. `loadAll()` - Load Everything

**Purpose:** Load all available modules and report comprehensive status

```javascript
const status = Conditions.loadAll();

// Returns:
// {
//   loaded: ['core', 'default', 'collections', 'shortcuts'],
//   missing: [],
//   allLoaded: true
// }
```

### 2. `loadCore()` - Core Only

**Purpose:** Verify core module is loaded (required for everything)

```javascript
const success = Conditions.loadCore();
// Returns: true if core loaded, false otherwise
```

### 3. `loadDefault()` - Default Branch Support

**Purpose:** Load support for `'default'` condition branches

```javascript
const success = Conditions.loadDefault();
// Returns: true if default module loaded, false otherwise
```

### 4. `loadCollections()` - Collection Support

**Purpose:** Load collection-aware methods (`whenStateCollection`, etc.)

```javascript
const success = Conditions.loadCollections();
// Returns: true if collections module loaded, false otherwise
```

### 5. `loadShortcuts()` - Global Shortcuts

**Purpose:** Load global convenience shortcuts (`whenState`, `whenApply`, etc.)

```javascript
const success = Conditions.loadShortcuts();
// Returns: true if shortcuts module loaded, false otherwise
```

---

## Module Architecture

### The Module Hierarchy

```
conditions.js (Entry Point)
    │
    ├── conditions-core.js (REQUIRED)
    │   ├── whenState()
    │   ├── apply()
    │   ├── watch()
    │   ├── batch()
    │   ├── registerMatcher()
    │   ├── registerHandler()
    │   └── ... (all core methods)
    │
    ├── conditions-default.js (Optional)
    │   └── 'default' branch support
    │
    ├── conditions-collections.js (Optional)
    │   ├── whenStateCollection()
    │   └── whenCollection()
    │
    └── conditions-shortcuts.js (Optional)
        ├── Global whenState()
        ├── Global whenApply()
        ├── Global registerMatcher()
        └── ... (global convenience functions)
```

### Dependencies

```
Core (REQUIRED)
  ↓
Default (Optional) - Adds 'default' branch
  ↓
Collections (Optional) - Adds collection support
  ↓
Shortcuts (Optional) - Adds global functions
```

---

## Practical Examples

### Example 1: Check All Modules

```javascript
// On application startup, verify all modules
console.log('🔍 Checking Conditions System modules...');

const status = Conditions.loadAll();

if (status.allLoaded) {
  console.log('✅ All modules loaded successfully!');
  console.log('   Loaded:', status.loaded.join(', '));
} else {
  console.warn('⚠️ Some modules are missing');
  console.log('   Loaded:', status.loaded.join(', '));
  console.log('   Missing:', status.missing.join(', '));
}

// Output:
// 🔍 Checking Conditions System modules...
// ✅ All modules loaded successfully!
//    Loaded: core, default, collections, shortcuts
```

---

### Example 2: Progressive Loading

```javascript
// Load modules progressively based on needs

// Step 1: Always load core
if (Conditions.loadCore()) {
  console.log('✓ Core loaded');
  
  // Step 2: Load collections if needed
  if (needsCollections) {
    if (Conditions.loadCollections()) {
      console.log('✓ Collections loaded');
    } else {
      console.warn('Collections not available - using single elements only');
    }
  }
  
  // Step 3: Load shortcuts for convenience
  if (Conditions.loadShortcuts()) {
    console.log('✓ Global shortcuts available');
    // Can now use: whenState() directly
  } else {
    console.log('Using namespaced API: Conditions.whenState()');
  }
} else {
  console.error('❌ Core module not found - cannot proceed');
}
```

---

### Example 3: Feature Detection

```javascript
// Detect and enable features based on loaded modules

function initializeApp() {
  const status = Conditions.loadAll();
  
  const features = {
    core: status.loaded.includes('core'),
    defaultBranch: status.loaded.includes('default'),
    collections: status.loaded.includes('collections'),
    shortcuts: status.loaded.includes('shortcuts')
  };
  
  // Configure app based on available features
  if (features.collections) {
    console.log('✓ Collection features enabled');
    enableCollectionUI();
  }
  
  if (features.defaultBranch) {
    console.log('✓ Default branch support enabled');
    enableFallbackHandling();
  }
  
  if (features.shortcuts) {
    console.log('✓ Global shortcuts enabled');
    updateDocumentation('Use whenState() directly');
  } else {
    updateDocumentation('Use Conditions.whenState()');
  }
  
  return features;
}

const appFeatures = initializeApp();
```

---

### Example 4: Development Mode Diagnostics

```javascript
// Comprehensive diagnostics for development

if (process.env.NODE_ENV === 'development') {
  console.group('📦 Conditions System - Module Status');
  
  const status = Conditions.loadAll();
  
  // Overall status
  console.log('Status:', status.allLoaded ? '✅ Complete' : '⚠️ Partial');
  
  // Loaded modules
  console.group('Loaded Modules');
  status.loaded.forEach(module => {
    console.log(`  ✓ ${module}`);
  });
  console.groupEnd();
  
  // Missing modules (if any)
  if (status.missing.length > 0) {
    console.group('Missing Modules');
    status.missing.forEach(module => {
      console.warn(`  ✗ ${module}`);
    });
    console.groupEnd();
  }
  
  // Available methods
  console.log('\nAvailable methods:');
  console.log('  - Core:', 
    typeof Conditions.whenState !== 'undefined' ? '✓' : '✗');
  console.log('  - Collections:', 
    typeof Conditions.whenStateCollection !== 'undefined' ? '✓' : '✗');
  console.log('  - Global shortcuts:', 
    typeof window.whenState !== 'undefined' ? '✓' : '✗');
  
  console.groupEnd();
}
```

**Output:**
```
📦 Conditions System - Module Status
  Status: ✅ Complete
  
  Loaded Modules
    ✓ core
    ✓ default
    ✓ collections
    ✓ shortcuts
  
  Available methods:
    - Core: ✓
    - Collections: ✓
    - Global shortcuts: ✓
```

---

### Example 5: Conditional Module Loading

```javascript
// Load modules based on application requirements

class ConditionsManager {
  constructor(config) {
    this.config = config;
    this.status = null;
  }
  
  initialize() {
    console.log('Initializing Conditions System...');
    
    // Always require core
    if (!Conditions.loadCore()) {
      throw new Error('Core module is required');
    }
    
    // Load optional modules based on config
    const modules = [];
    
    if (this.config.useDefaultBranch) {
      if (Conditions.loadDefault()) {
        modules.push('default');
      } else {
        console.warn('Default branch requested but not available');
      }
    }
    
    if (this.config.useCollections) {
      if (Conditions.loadCollections()) {
        modules.push('collections');
      } else {
        console.warn('Collections requested but not available');
      }
    }
    
    if (this.config.useShortcuts) {
      if (Conditions.loadShortcuts()) {
        modules.push('shortcuts');
      } else {
        console.warn('Shortcuts requested but not available');
      }
    }
    
    this.status = {
      core: true,
      modules: modules
    };
    
    console.log('✓ Initialized with modules:', modules.join(', '));
    return this.status;
  }
  
  getStatus() {
    return this.status;
  }
}

// Usage
const manager = new ConditionsManager({
  useDefaultBranch: true,
  useCollections: true,
  useShortcuts: false
});

manager.initialize();
// ✓ Initialized with modules: default, collections
```

---

### Example 6: Build-Time Optimization

```javascript
// Check required modules at build time

function verifyBuildDependencies() {
  const requiredModules = ['core', 'collections'];
  const status = Conditions.loadAll();
  
  const missing = requiredModules.filter(
    module => !status.loaded.includes(module)
  );
  
  if (missing.length > 0) {
    console.error('❌ Build failed: Missing required modules');
    console.error('   Required:', requiredModules.join(', '));
    console.error('   Missing:', missing.join(', '));
    process.exit(1);
  }
  
  console.log('✓ All required modules available');
}

// Run during build
verifyBuildDependencies();
```

---

### Example 7: Runtime Module Loading

```javascript
// Dynamically load modules at runtime

async function loadConditionsModules() {
  const results = {
    core: false,
    default: false,
    collections: false,
    shortcuts: false
  };
  
  // Core (required)
  results.core = Conditions.loadCore();
  if (!results.core) {
    throw new Error('Core module is required');
  }
  
  // Optional modules
  results.default = Conditions.loadDefault();
  results.collections = Conditions.loadCollections();
  results.shortcuts = Conditions.loadShortcuts();
  
  // Report
  console.log('Module loading complete:');
  Object.entries(results).forEach(([module, loaded]) => {
    console.log(`  ${loaded ? '✓' : '✗'} ${module}`);
  });
  
  return results;
}

// Use it
loadConditionsModules().then(results => {
  if (results.collections) {
    // Use collection features
    Conditions.whenStateCollection(/* ... */);
  } else {
    // Fallback to single elements
    Conditions.whenState(/* ... */);
  }
});
```

---

### Example 8: Testing Setup

```javascript
// Setup for testing - verify all modules available

describe('Conditions System', () => {
  let moduleStatus;
  
  beforeAll(() => {
    // Verify modules before running tests
    moduleStatus = Conditions.loadAll();
    
    if (!moduleStatus.allLoaded) {
      console.warn('Not all modules loaded for testing');
      console.warn('Missing:', moduleStatus.missing);
    }
  });
  
  it('should have core module loaded', () => {
    expect(Conditions.loadCore()).toBe(true);
  });
  
  it('should have collections module loaded', () => {
    expect(Conditions.loadCollections()).toBe(true);
  });
  
  it('should load all modules successfully', () => {
    expect(moduleStatus.allLoaded).toBe(true);
  });
  
  it('should have no missing modules', () => {
    expect(moduleStatus.missing).toHaveLength(0);
  });
});
```

---

## Module Loading Strategies

### Strategy 1: All or Nothing

```javascript
// Load everything, fail if anything missing
const status = Conditions.loadAll();

if (!status.allLoaded) {
  throw new Error(
    `Missing modules: ${status.missing.join(', ')}\n` +
    `Please include all Conditions System files`
  );
}

console.log('✓ All modules loaded, full functionality available');
```

### Strategy 2: Progressive Enhancement

```javascript
// Load core, enhance with optional modules
Conditions.loadCore(); // Required

// Progressive enhancement
if (Conditions.loadCollections()) {
  console.log('+ Collections support');
}

if (Conditions.loadShortcuts()) {
  console.log('+ Global shortcuts');
}

if (Conditions.loadDefault()) {
  console.log('+ Default branch support');
}
```

### Strategy 3: Feature-Based Loading

```javascript
// Load modules based on required features
function loadForFeatures(features) {
  // Core always required
  if (!Conditions.loadCore()) {
    throw new Error('Core module required');
  }
  
  if (features.includes('collections')) {
    if (!Conditions.loadCollections()) {
      throw new Error('Collections module required for this feature');
    }
  }
  
  if (features.includes('shortcuts')) {
    if (!Conditions.loadShortcuts()) {
      console.warn('Shortcuts not available, using namespaced API');
    }
  }
}

// Use it
loadForFeatures(['collections', 'shortcuts']);
```

---

## Understanding Return Values

### `loadAll()` Return Object

```javascript
const status = Conditions.loadAll();

// Structure:
{
  loaded: ['core', 'default', 'collections', 'shortcuts'],  // Array of loaded module names
  missing: [],                                               // Array of missing module names
  allLoaded: true                                           // Boolean: true if no missing modules
}
```

### Individual Loader Return Values

```javascript
// Each loader returns boolean
const coreLoaded = Conditions.loadCore();         // true or false
const defaultLoaded = Conditions.loadDefault();   // true or false
const collectionsLoaded = Conditions.loadCollections(); // true or false
const shortcutsLoaded = Conditions.loadShortcuts();     // true or false
```

---

## Console Output

### Successful Loading

```javascript
Conditions.loadAll();

// Console output:
// [Conditions System] Core module loaded
// [Conditions System] Default branch support loaded
// [Conditions System] Collections support loaded
// [Conditions System] Global shortcuts loaded
// [Conditions System] Loaded modules: core, default, collections, shortcuts
```

### Partial Loading

```javascript
// If some modules are missing
Conditions.loadAll();

// Console output:
// [Conditions System] Core module loaded
// [Conditions System] Default branch support loaded
// [Conditions System] Collections module not found
// [Conditions System] Shortcuts module not found
// [Conditions System] Missing modules: collections, shortcuts
// [Conditions System] Loaded modules: core, default
```

---

## Common Use Cases

### Use Case 1: Application Initialization

```javascript
// Standard app initialization
function initializeApp() {
  console.log('Starting application...');
  
  // Verify Conditions System
  const status = Conditions.loadAll();
  
  if (status.allLoaded) {
    console.log('✓ Conditions System ready');
    startApp();
  } else {
    console.error('Missing modules:', status.missing);
    showErrorScreen('Some features unavailable');
  }
}

initializeApp();
```

### Use Case 2: Plugin System

```javascript
// Plugin verifies required modules
class ConditionsPlugin {
  constructor(requiredModules = ['core']) {
    this.requiredModules = requiredModules;
  }
  
  canActivate() {
    const status = Conditions.loadAll();
    
    return this.requiredModules.every(module =>
      status.loaded.includes(module)
    );
  }
  
  activate() {
    if (!this.canActivate()) {
      const status = Conditions.loadAll();
      const missing = this.requiredModules.filter(
        m => !status.loaded.includes(m)
      );
      
      throw new Error(
        `Cannot activate plugin. Missing modules: ${missing.join(', ')}`
      );
    }
    
    console.log('✓ Plugin activated');
  }
}

// Use it
const plugin = new ConditionsPlugin(['core', 'collections']);
if (plugin.canActivate()) {
  plugin.activate();
}
```

### Use Case 3: Documentation Generator

```javascript
// Generate documentation based on available modules
function generateDocs() {
  const status = Conditions.loadAll();
  
  let docs = '# Conditions System API\n\n';
  
  docs += '## Available Modules\n\n';
  status.loaded.forEach(module => {
    docs += `- ✓ ${module}\n`;
  });
  
  if (status.missing.length > 0) {
    docs += '\n## Missing Modules\n\n';
    status.missing.forEach(module => {
      docs += `- ✗ ${module}\n`;
    });
  }
  
  docs += '\n## Available Methods\n\n';
  
  if (status.loaded.includes('core')) {
    docs += '### Core Methods\n';
    docs += '- `whenState()`\n';
    docs += '- `apply()`\n';
    docs += '- `watch()`\n';
    docs += '- `batch()`\n\n';
  }
  
  if (status.loaded.includes('collections')) {
    docs += '### Collection Methods\n';
    docs += '- `whenStateCollection()`\n';
    docs += '- `whenCollection()`\n\n';
  }
  
  return docs;
}

console.log(generateDocs());
```

---

## Common Beginner Questions

### Q: Do I need to call module loaders?

**Answer:** Not usually! Modules load automatically. Loaders are mainly for verification and diagnostics.

```javascript
// ❌ Usually not needed
Conditions.loadAll();
Conditions.whenState(/* ... */);

// ✅ Just use the methods directly
Conditions.whenState(/* ... */);

// ✅ Use loaders for verification in special cases
if (process.env.NODE_ENV === 'development') {
  Conditions.loadAll(); // Verify everything is loaded
}
```

---

### Q: What if a module is missing?

**Answer:** The loader returns `false` and logs a warning. The system continues with available modules.

```javascript
const hasCollections = Conditions.loadCollections();

if (hasCollections) {
  // Use collection features
  Conditions.whenStateCollection(/* ... */);
} else {
  // Fallback
  console.warn('Collections not available, using single elements');
  Conditions.whenState(/* ... */);
}
```

---

### Q: Can I load modules multiple times?

**Answer:** Yes, it's safe. Loaders just check availability and won't reload or cause errors.

```javascript
// Safe to call multiple times
Conditions.loadCore();
Conditions.loadCore();
Conditions.loadCore();
// Just checks each time, no side effects
```

---

### Q: Which modules do I need?

**Answer:**

- **Core** (Required) - Basic functionality
- **Default** (Optional) - Use `'default'` branches
- **Collections** (Optional) - Work with multiple elements
- **Shortcuts** (Optional) - Use global functions

```javascript
// Minimum (core only)
<script src="conditions-core.js"></script>

// Full (all modules)
<script src="conditions-core.js"></script>
<script src="conditions-default.js"></script>
<script src="conditions-collections.js"></script>
<script src="conditions-shortcuts.js"></script>
<script src="conditions.js"></script>
```

---

## Tips and Best Practices

### Tip 1: Use in Development Mode

```javascript
// ✅ Good - verify during development
if (process.env.NODE_ENV === 'development') {
  const status = Conditions.loadAll();
  console.log('Conditions System:', status);
}
```

### Tip 2: Check Before Using Optional Features

```javascript
// ✅ Good - verify before using collections
if (Conditions.loadCollections()) {
  useCollectionFeatures();
} else {
  useSingleElementFeatures();
}
```

### Tip 3: Don't Call in Hot Paths

```javascript
// ❌ Bad - checking every time
function updateUI() {
  if (Conditions.loadCore()) {
    Conditions.whenState(/* ... */);
  }
}

// ✅ Good - check once at startup
let hasCore = false;

function init() {
  hasCore = Conditions.loadCore();
}

function updateUI() {
  if (hasCore) {
    Conditions.whenState(/* ... */);
  }
}
```

### Tip 4: Use for Build Verification

```javascript
// ✅ Good - verify at build time
// build.js
const status = Conditions.loadAll();

if (!status.allLoaded) {
  console.error('Build failed: Missing modules');
  process.exit(1);
}
```

---

## Summary

### What Module Loaders Do:

1. ✅ Verify module availability
2. ✅ Report loading status
3. ✅ Enable modular architecture
4. ✅ Provide diagnostics
5. ✅ Support progressive enhancement

### When to Use Them:

- Development diagnostics
- Build-time verification
- Plugin systems
- Feature detection
- Progressive enhancement
- Testing setup

### The Basic Pattern:

```javascript
// Check all modules
const status = Conditions.loadAll();

if (status.allLoaded) {
  // Full functionality available
  useAllFeatures();
} else {
  // Partial functionality
  console.warn('Missing:', status.missing);
  useAvailableFeatures(status.loaded);
}

// Or check individual modules
if (Conditions.loadCollections()) {
  // Collections available
}
```

### Quick Decision Guide:

- **Need to verify modules?** → Use `loadAll()`
- **Building a plugin?** → Check required modules
- **Development mode?** → Show module status
- **Just using the system?** → Don't need loaders, just use methods

---

**Remember:** Module loaders are mainly for verification and diagnostics. In most cases, you don't need to call them - just use the Conditions methods directly! They're there when you need fine-grained control over module loading and verification. 📦