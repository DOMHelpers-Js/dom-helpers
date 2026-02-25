/**
 * Complete DOM Helpers JS Demo — ESM Import
 * Bundler setup (Vite / Webpack):
 *   npm install dom-helpers-js
 *
 * HTML required:
 * -------------------------------------------------------
 * <div id="app">
 *
 *   <!-- Counter -->
 *   <section id="counterSection">
 *     <h2 id="counterDisplay">Count: 0</h2>
 *     <button id="incrementBtn">+1</button>
 *     <button id="decrementBtn">-1</button>
 *     <button id="resetBtn">Reset</button>
 *   </section>
 *
 *   <!-- User Profile -->
 *   <section id="profileSection">
 *     <input id="nameInput" type="text" placeholder="Enter your name" />
 *     <p id="greeting">Hello, stranger!</p>
 *     <p id="charCount">0 characters</p>
 *   </section>
 *
 *   <!-- Theme Toggle -->
 *   <button id="themeBtn">Toggle Dark Mode</button>
 *   <p id="themeLabel">Current theme: light</p>
 *
 *   <!-- Status bar -->
 *   <div id="statusBar">Ready</div>
 *
 * </div>
 * -------------------------------------------------------
 */

import { Elements, ReactiveUtils, StorageUtils } from 'dom-helpers-js';

// ============================================================================
// STATE — single source of truth for the entire page
// ============================================================================

const state = ReactiveUtils.state({
  count:  StorageUtils.load('count',  0,       { namespace: 'demo' }),
  name:   StorageUtils.load('name',   '',      { namespace: 'demo' }),
  theme:  StorageUtils.load('theme',  'light', { namespace: 'demo' }),
});

// ============================================================================
// AUTO-SAVE — persist state changes to localStorage automatically
// ============================================================================

const store = StorageUtils.createAutoSave('appState', {
  namespace: 'demo',
  debounce: 300,
  onSave: () => {
    // Flash the status bar on every save
    Elements.statusBar.update({
      textContent: '✓ Saved',
      style: { color: 'green' }
    });
    setTimeout(() => {
      Elements.statusBar.update({
        textContent: 'Ready',
        style: { color: '' }
      });
    }, 1500);
  }
});

// ============================================================================
// EFFECTS — reactive DOM updates triggered automatically on state change
// ============================================================================

// Counter display
ReactiveUtils.effect(() => {
  Elements.counterDisplay.update({
    textContent: `Count: ${state.count}`,
    style: {
      color: state.count > 0 ? 'green' : state.count < 0 ? 'red' : 'black',
      fontSize: '24px',
      fontWeight: 'bold'
    }
  });
});

// Greeting updates as name changes
ReactiveUtils.effect(() => {
  const name = state.name.trim();
  Elements.greeting.update({
    textContent: name ? `Hello, ${name}!` : 'Hello, stranger!',
    style: { fontStyle: name ? 'normal' : 'italic', color: name ? 'navy' : 'gray' }
  });
  Elements.charCount.textContent = `${state.name.length} characters`;
});

// Theme — toggle dark/light on the whole page
ReactiveUtils.effect(() => {
  const isDark = state.theme === 'dark';
  Elements.app.update({
    style: {
      background:  isDark ? '#1a1a2e' : '#ffffff',
      color:       isDark ? '#eaeaea' : '#111111',
      padding:     '20px',
      minHeight:   '100vh',
      transition:  'background 0.3s, color 0.3s'
    }
  });
  Elements.themeBtn.update({
    textContent: isDark ? '☀ Switch to Light' : '🌙 Switch to Dark',
    style: {
      background: isDark ? '#eaeaea' : '#1a1a2e',
      color:      isDark ? '#1a1a2e' : '#eaeaea',
      border:     'none',
      padding:    '8px 16px',
      cursor:     'pointer',
      borderRadius: '4px'
    }
  });
  Elements.themeLabel.textContent = `Current theme: ${state.theme}`;
});

// Persist to storage whenever any state value changes
ReactiveUtils.effect(() => {
  // Accessing these properties registers them as dependencies
  const snapshot = {
    count: state.count,
    name:  state.name,
    theme: state.theme
  };
  store.save(snapshot);

  // Also save each key individually for granular loading
  StorageUtils.save('count', snapshot.count, { namespace: 'demo' });
  StorageUtils.save('name',  snapshot.name,  { namespace: 'demo' });
  StorageUtils.save('theme', snapshot.theme, { namespace: 'demo' });
});

// ============================================================================
// EVENTS — mutate state only; effects above handle all DOM updates
// ============================================================================

// Counter buttons
Elements.incrementBtn.on('click', () => { state.count++; });
Elements.decrementBtn.on('click', () => { state.count--; });
Elements.resetBtn.on('click',     () => {
  state.count = 0;
  StorageUtils.clear('count', { namespace: 'demo' });
});

// Name input — two-way: input → state → DOM
Elements.nameInput.on('input', (e) => {
  state.name = e.target.value;
});

// Restore the input value from state on load
Elements.nameInput.value = state.name;

// Theme toggle
Elements.themeBtn.on('click', () => {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
});

// ============================================================================
// CROSS-TAB SYNC — update state if another tab changes storage
// ============================================================================

StorageUtils.watch('count', (newVal) => {
  if (newVal !== null) state.count = newVal;
}, { namespace: 'demo' });

StorageUtils.watch('theme', (newVal) => {
  if (newVal !== null) state.theme = newVal;
}, { namespace: 'demo' });
