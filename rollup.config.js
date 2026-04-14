import terser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';

const isDev = process.env.BUILD === 'development';
const isProd = process.env.BUILD === 'production';

const banner = `/**
 * DOM Helpers JS v2.9.2
 * High-performance vanilla JavaScript DOM utilities
 * @license MIT
 * @repository https://github.com/DOMHelpers-Js/dom-helpers
 */`;

// Terser configuration for minification
const terserConfig = {
  compress: {
    pure_getters: true,
    unsafe: true,
    unsafe_comps: true,
    drop_console: false,        // handled selectively via pure_funcs below
    pure_funcs: [
      'console.log',
      'console.debug',
      'console.info'
    ],
    drop_debugger: true,
    passes: 2
  },
  mangle: {
    properties: false
  },
  output: {
    comments: /^!/
  }
};

// Build configurations for different modules
const modules = [
  {
    input: 'src/core.js',
    name: 'DOMHelpers',
    outputName: 'dom-helpers.core',
    description: 'Core only'
  },
  {
    input: 'src/enhancers-only.js',
    name: 'DOMHelpers',
    outputName: 'dom-helpers.enhancers',
    description: 'Enhancers only (requires core)'
  },
  {
    input: 'src/conditions-only.js',
    name: 'DOMHelpers',
    outputName: 'dom-helpers.conditions',
    description: 'Conditions only (requires core)'
  },
  {
    input: 'src/reactive-only.js',
    name: 'DOMHelpers',
    outputName: 'dom-helpers.reactive',
    description: 'Reactive only (requires core)'
  },
  {
    input: 'src/storage-only.js',
    name: 'StorageUtils',
    outputName: 'dom-helpers.storage',
    description: 'Storage utilities (standalone)'
  },
  {
    input: 'src/native-enhance-only.js',
    name: 'DOMHelpers',
    outputName: 'dom-helpers.native-enhance',
    description: 'Native enhance only (requires core + enhancers)'
  },
  {
    input: 'src/form-only.js',
    name: 'Forms',
    outputName: 'dom-helpers.form',
    description: 'Form module only (requires core)'
  },
  {
    input: 'src/animation-only.js',
    name: 'Animation',
    outputName: 'dom-helpers.animation',
    description: 'Animation module only (requires core)'
  },
  {
    input: 'src/async-only.js',
    name: 'AsyncHelpers',
    outputName: 'dom-helpers.async',
    description: 'Async utilities only (requires core)'
  },
  {
    input: 'src/spa-only.js',
    name: 'Router',
    outputName: 'dom-helpers.spa',
    description: 'SPA Router (standalone — no other DOM Helpers modules required)'
  },
  {
    input: 'src/spa.js',
    name: 'DOMHelpers',
    outputName: 'dom-helpers.full-spa',
    description: 'Full DOM Helpers bundle + SPA Router'
  }
];

// Loader (classic <script>) — IIFE only.
// Uses document.currentScript for base URL and <script> injection for loading.
// No import.meta.url or dynamic import() — works in any browser without type="module".
const loaderUmdConfigs = [];

if (isDev || !isProd) {
  loaderUmdConfigs.push({
    input: 'src/loader-umd.js',
    output: {
      file: 'dist/dom-helpers.loader.js',
      format: 'iife',
      name: 'DOMHelpersLoader',
      banner,
      sourcemap: true,
      exports: 'named'
    },
    plugins: [filesize()]
  });
}

if (isProd || !isDev) {
  loaderUmdConfigs.push({
    input: 'src/loader-umd.js',
    output: {
      file: 'dist/dom-helpers.loader.min.js',
      format: 'iife',
      name: 'DOMHelpersLoader',
      banner,
      sourcemap: true,
      exports: 'named',
      plugins: [terser(terserConfig)]
    },
    plugins: [filesize()]
  });
}

// Loader — ESM only (uses import.meta.url and dynamic import, incompatible with UMD/CJS)
const loaderConfigs = [];

if (isDev || !isProd) {
  loaderConfigs.push({
    input: 'src/loader.js',
    output: {
      file: 'dist/dom-helpers.loader.esm.js',
      format: 'es',
      banner,
      sourcemap: true,
      exports: 'named'
    },
    plugins: [filesize()]
  });
}

if (isProd || !isDev) {
  loaderConfigs.push({
    input: 'src/loader.js',
    output: {
      file: 'dist/dom-helpers.loader.esm.min.js',
      format: 'es',
      banner,
      sourcemap: true,
      exports: 'named',
      plugins: [terser(terserConfig)]
    },
    plugins: [filesize()]
  });
}

// Generate configurations for all modules
const configs = modules.map(module => {
  const config = {
    input: module.input,
    output: [],
    plugins: [filesize()]
  };

  // Development builds (unminified)
  if (isDev || !isProd) {
    // UMD build
    config.output.push({
      file: `dist/${module.outputName}.umd.js`,
      format: 'umd',
      name: module.name,
      banner,
      sourcemap: true,
      exports: 'named',
      globals: {}
    });

    // ESM build
    config.output.push({
      file: `dist/${module.outputName}.esm.js`,
      format: 'es',
      banner,
      sourcemap: true,
      exports: 'named'
    });

    // CommonJS build
    config.output.push({
      file: `dist/${module.outputName}.cjs.js`,
      format: 'cjs',
      banner,
      sourcemap: true,
      exports: 'auto'
    });
  }

  // Production builds (minified)
  if (isProd || !isDev) {
    // Minified UMD build (for CDN)
    config.output.push({
      file: `dist/${module.outputName}.min.js`,
      format: 'umd',
      name: module.name,
      banner,
      sourcemap: true,
      exports: 'named',
      plugins: [terser(terserConfig)]
    });

    // Minified ESM build
    config.output.push({
      file: `dist/${module.outputName}.esm.min.js`,
      format: 'es',
      banner,
      sourcemap: true,
      exports: 'named',
      plugins: [terser(terserConfig)]
    });
  }

  return config;
});

export default [...configs, ...loaderUmdConfigs, ...loaderConfigs];
