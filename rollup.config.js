import terser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';

const isDev = process.env.BUILD === 'development';
const isProd = process.env.BUILD === 'production';

const banner = `/**
 * DOM Helpers JS v2.4.2
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
    input: 'src/index.js',
    name: 'DOMHelpers',
    outputName: 'dom-helpers',
    description: 'Full bundle'
  },
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
  }
];

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
      globals: {}
    });

    // ESM build
    config.output.push({
      file: `dist/${module.outputName}.esm.js`,
      format: 'es',
      banner,
      sourcemap: true
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
      plugins: [terser(terserConfig)]
    });

    // Minified ESM build
    config.output.push({
      file: `dist/${module.outputName}.esm.min.js`,
      format: 'es',
      banner,
      sourcemap: true,
      plugins: [terser(terserConfig)]
    });
  }

  return config;
});

export default configs;
