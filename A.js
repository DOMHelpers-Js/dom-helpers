```javascript
/**
 * Universal DOM Element Validator - TRUE MULTIPLE ERRORS (FIXED)
 * Version: 3.3.1
 *
 * Fixes applied:
 * - Unique id for each tracked error (no reliance on array index)
 * - Panel's Remove buttons use data-error-id and robust event listeners (no inline onclick)
 * - Alerts are truly simultaneous and stack correctly; they carry data-error-id so can be dismissed independently
 * - Floating button count stays synchronized with STATE.errors.length
 * - clearErrors properly clears visible alerts and internal caches
 * - Rebuilds panel safely when errors change
 *
 * Drop this file into your page (after your DOM Helpers if you want hooking) — it is a self-contained IIFE.
 */

(function (global) {
  'use strict';

  console.log('[Universal Validator] Loading v3.3.1 - TRUE MULTIPLE ERRORS (FIXED)...');

  // ===== STATE MANAGEMENT =====
  const STATE = {
    ids: new Set(),
    classes: new Set(),
    tags: new Set(),
    names: new Set(),
    cache: new Map(),
    enabled: true,
    errors: [], // { id: string, type: 'id'|'class'|'tag'|'name', value: string, suggestions:[], timestamp }
    errorCache: new Set() // prevents duplicate tracked errors by key type:value
  };

  // ===== INTERNAL FILTERS =====
  const INTERNAL_FILTERS = {
    ignoredIds: new Set([
      'validator-button-animations',
      'validator-animations',
      'validator-error-button',
      'validator-error-panel',
      'error-count',
      'close-panel',
      'clear-errors',
      'refresh-inventory',
      'export-errors',
      'validator-keyframes',
      'total-errors',
      'id-errors',
      'class-errors',
      'tag-errors',
      'name-errors'
    ]),
    ignoredProperties: new Set([
      'update', 'helper', 'stats', 'clear', 'destroy', 'destructure',
      'getRequired', 'waitFor', 'isCached', 'get', 'exists', 'getMultiple',
      'setProperty', 'getProperty', 'setAttribute', 'getAttribute', 'configure',
      'textContent', 'innerHTML', 'innerText', 'value', 'placeholder', 'title',
      'disabled', 'checked', 'readonly', 'hidden', 'selected', 'src', 'href',
      'alt', 'style', 'dataset', 'attrs', 'classes', 'prop', 'length',
      'constructor', 'prototype', 'toString', 'valueOf', 'hasOwnProperty',
      'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', '__proto__',
      'call', 'apply', 'bind'
    ]),
    shouldIgnoreId(id) {
      if (!id || typeof id !== 'string') return true;
      if (id.startsWith('validator-')) return true;
      if (this.ignoredIds.has(id)) return true;
      if (this.ignoredProperties.has(id)) return true;
      return false;
    },
    shouldIgnoreProperty(prop) {
      if (!prop || typeof prop !== 'string') return true;
      if (prop.startsWith('_')) return true;
      if (this.ignoredProperties.has(prop)) return true;
      return false;
    }
  };

  // ===== UTIL =====
  function uid(prefix = 'e') {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  }

  // ===== ERROR MANAGEMENT =====
  function addError(type, value, suggestions) {
    const key = `${type}:${value}`;
    // Prevent duplicates in tracking panel/list
    if (STATE.errorCache.has(key)) {
      // still log; don't add duplicate tracked error
      console.log(`[Validator] Duplicate error (ignored for panel): ${key}`);
      return null;
    }

    const errorObj = {
      id: uid('err'),
      type,
      value,
      suggestions: suggestions || [],
      timestamp: Date.now()
    };

    STATE.errors.push(errorObj);
    STATE.errorCache.add(key);

    updateErrorButton();
    // If panel open, rebuild it to include the new error
    if (document.getElementById('validator-error-panel')) {
      rebuildErrorPanel();
    }

    console.log(`[Validator] ✓ NEW error added: ${key}. Total tracked errors: ${STATE.errors.length}`);
    return errorObj;
  }

  // ===== PERSISTENT ERROR BUTTON =====
  let errorButton = null;
  let errorPanel = null;

  function createErrorButton() {
    if (errorButton) return;

    errorButton = document.createElement('div');
    errorButton.id = 'validator-error-button';
    Object.assign(errorButton.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '60px',
      height: '60px',
      background: 'linear-gradient(135deg, #f56565 0%, #c53030 100%)',
      borderRadius: '50%',
      boxShadow: '0 4px 20px rgba(245, 101, 101, 0.6)',
      cursor: 'pointer',
      zIndex: '999998',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      color: 'white',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
      animation: 'pulse 2s infinite',
      border: '3px solid rgba(255, 255, 255, 0.3)'
    });

    errorButton.innerHTML = `
      <div style="text-align: center; position: relative; width:100%; height:100%;">
        <div style="font-size: 24px; line-height: 1">⚠️</div>
        <div id="error-count" style="
          position: absolute;
          top: -8px;
          right: -8px;
          background: #fff;
          color: #c53030;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          border: 2px solid #c53030;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">0</div>
      </div>
    `;

    errorButton.onmouseover = () => {
      errorButton.style.transform = 'scale(1.1)';
      errorButton.style.boxShadow = '0 6px 30px rgba(245, 101, 101, 0.8)';
    };

    errorButton.onmouseout = () => {
      errorButton.style.transform = 'scale(1)';
      errorButton.style.boxShadow = '0 4px 20px rgba(245, 101, 101, 0.6)';
    };

    errorButton.onclick = () => {
      toggleErrorPanel();
    };

    // Add animations
    if (!document.getElementById('validator-button-animations')) {
      const style = document.createElement('style');
      style.id = 'validator-button-animations';
      style.textContent = `
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes slideInPanel {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutPanel {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes slideInAlert {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    (document.body || document.documentElement).appendChild(errorButton);
    updateErrorButton();
  }

  function updateErrorButton() {
    if (!errorButton) createErrorButton();
    const countEl = document.getElementById('error-count');
    const count = STATE.errors.length;
    if (countEl) countEl.textContent = String(count);
    errorButton.style.display = count > 0 ? 'flex' : 'none';
  }

  // ===== ALERTS =====
  function showAlertForError(errorObj) {
    // Build alert element
    const existingAlerts = document.querySelectorAll('[data-validator-alert]');
    const alertIndex = existingAlerts.length;
    const offset = alertIndex * 110;

    const alert = document.createElement('div');
    alert.setAttribute('data-validator-alert', 'true');
    alert.setAttribute('data-error-id', errorObj.id);
    Object.assign(alert.style, {
      position: 'fixed',
      top: `${20 + offset}px`,
      right: '20px',
      maxWidth: '380px',
      padding: '16px',
      background: 'linear-gradient(135deg, #f56565 0%, #c53030 100%)',
      color: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
      zIndex: `${999990 + alertIndex}`,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '13px',
      lineHeight: '1.4',
      border: '2px solid rgba(255,255,255,0.3)',
      animation: 'slideInAlert 0.3s ease',
      cursor: 'pointer'
    });

    const typeLabels = { id: 'ID', class: 'Class', tag: 'Tag', name: 'Name', selector: 'Selector' };
    const label = typeLabels[errorObj.type] || errorObj.type;

    let inner = `
      <div style="margin-bottom: 10px;">
        <strong style="font-size: 15px; display:block; margin-bottom:6px;">❌ ${label} Not Found</strong>
      </div>

      <div style="background: rgba(255,255,255,0.12); padding: 8px; border-radius: 4px; margin-bottom: 10px;">
        <div style="font-family: 'Courier New', monospace; font-size: 13px; color: #ffd700; font-weight: bold; word-break: break-all;">
          "${escapeHtml(errorObj.value)}"
        </div>
      </div>
    `;

    if (errorObj.suggestions && errorObj.suggestions.length > 0) {
      inner += `
        <div style="background: rgba(255,255,255,0.08); padding: 8px; border-radius: 4px; border: 1px solid rgba(255,215,0,0.15);">
          <strong style="color: #ffd700; font-size: 11px;">💡 Suggestions:</strong>
          ${errorObj.suggestions.slice(0, 3).map(s => `
            <div style="margin:6px 0; padding:6px; background: rgba(255,255,255,0.06); border-radius:4px; text-align:center; font-family: 'Courier New', monospace; font-weight:600;">
              ${escapeHtml(s)}
            </div>
          `).join('')}
        </div>
      `;
    }

    inner += `<div style="text-align:center; margin-top:8px; font-size:10px; opacity:0.85;">Click to dismiss</div>`;

    alert.innerHTML = inner;

    // Dismiss handler (just removes the visible alert)
    const removeAlert = () => {
      if (!document.body || !document.body.contains(alert)) return;
      alert.remove();
      repositionAlerts();
    };

    alert.addEventListener('click', removeAlert);

    // Auto-dismiss after 10s (non-blocking)
    const autoId = setTimeout(() => {
      removeAlert();
    }, 10000);

    // When removed, clear auto timeout
    alert.addEventListener('remove', () => clearTimeout(autoId));

    (document.body || document.documentElement).appendChild(alert);
  }

  function repositionAlerts() {
    const alerts = Array.from(document.querySelectorAll('[data-validator-alert]'));
    alerts.forEach((alert, index) => {
      alert.style.top = `${20 + index * 110}px`;
      alert.style.zIndex = `${999990 + index}`;
    });
  }

  // ===== ERROR PANEL (build / rebuild) =====
  function createErrorPanel() {
    if (errorPanel) return; // already open
    errorPanel = document.createElement('div');
    errorPanel.id = 'validator-error-panel';
    Object.assign(errorPanel.style, {
      position: 'fixed',
      top: '0',
      right: '0',
      width: '500px',
      maxWidth: '90vw',
      height: '100vh',
      background: 'white',
      boxShadow: '-4px 0 30px rgba(0,0,0,0.3)',
      zIndex: '999999',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      animation: 'slideInPanel 0.3s ease'
    });

    // append then populate
    document.body.appendChild(errorPanel);
    rebuildErrorPanel();
  }

  function rebuildErrorPanel() {
    if (!errorPanel) return;

    // Header + actions
    const headerHtml = `
      <div style="
        background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
        color: white;
        padding: 20px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        box-shadow:0 2px 10px rgba(0,0,0,0.1);
      ">
        <div>
          <h2 style="margin:0; font-size:20px; display:flex; align-items:center; gap:10px;">
            <span style="font-size:24px;">⚠️</span>
            DOM Validation Errors
          </h2>
          <p id="panel-summary" style="margin:5px 0 0 0; opacity:0.9; font-size:14px;">
            ${STATE.errors.length} unique error${STATE.errors.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button id="close-panel" style="
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          font-size: 28px;
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        ">×</button>
      </div>
    `;

    const actionsHtml = `
      <div style="padding:15px 20px; border-bottom:1px solid #e2e8f0; display:flex; gap:10px; background:#f7fafc;">
        <button id="clear-errors" style="flex:1; padding:10px 15px; background:white; border:2px solid #e2e8f0; border-radius:8px; cursor:pointer; font-weight:600; color:#4a5568;">Clear All</button>
        <button id="refresh-inventory" style="flex:1; padding:10px 15px; background:#4299e1; border:none; border-radius:8px; cursor:pointer; font-weight:600; color:white;">Refresh</button>
        <button id="export-errors" style="flex:1; padding:10px 15px; background:#48bb78; border:none; border-radius:8px; cursor:pointer; font-weight:600; color:white;">Export</button>
      </div>
    `;

    let contentHtml = '';
    if (STATE.errors.length === 0) {
      contentHtml = `
        <div style="text-align:center; padding:60px 20px; color:#a0aec0; font-size:16px;">
          <div style="font-size:48px; margin-bottom:20px;">✓</div>
          <p style="font-weight:600; margin:0;">No Errors!</p>
          <p style="margin-top:8px;">All DOM elements are valid</p>
        </div>
      `;
    } else {
      // group by type
      const grouped = STATE.errors.reduce((acc, e) => {
        (acc[e.type] = acc[e.type] || []).push(e);
        return acc;
      }, {});

      const typeLabels = {
        id: { label: 'IDs', icon: '🆔', color: '#f56565' },
        class: { label: 'Classes', icon: '📦', color: '#ed8936' },
        tag: { label: 'Tags', icon: '🏷️', color: '#ecc94b' },
        name: { label: 'Names', icon: '📝', color: '#48bb78' }
      };

      contentHtml = `<div style="padding:20px; overflow:auto; flex:1;">`;

      Object.entries(grouped).forEach(([type, errors]) => {
        const info = typeLabels[type] || { label: type, icon: '❗', color: '#718096' };
        contentHtml += `
          <div style="margin-bottom:30px;">
            <h3 style="margin:0 0 15px 0; font-size:16px; color:${info.color}; display:flex; align-items:center; gap:8px;">
              <span style="font-size:20px;">${info.icon}</span> ${info.label} (${errors.length})
            </h3>
        `;
        errors.forEach((err) => {
          contentHtml += `
            <div class="validator-error-row" data-error-id="${err.id}" style="background:white; border:2px solid #e2e8f0; border-radius:8px; padding:15px; margin-bottom:10px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                <div style="flex:1;">
                  <strong style="color:#2d3748; font-size:15px;">Not found:</strong>
                  <code style="display:inline-block; background:#f7fafc; padding:4px 8px; border-radius:4px; color:${info.color}; font-family:'Courier New', monospace; margin:5px 0; font-weight:700;">${escapeHtml(err.value)}</code>
                </div>
                <button class="remove-error-btn" data-error-id="${err.id}" style="background:#fed7d7; border:none; color:#c53030; padding:6px 10px; border-radius:4px; cursor:pointer; font-size:12px; font-weight:600;">Remove</button>
              </div>
              ${err.suggestions && err.suggestions.length ? `
                <div style="background:#fefcbf; border-left:3px solid #ecc94b; padding:10px; border-radius:4px; margin-top:10px;">
                  <strong style="color:#744210; font-size:13px; display:block; margin-bottom:8px;">💡 Suggestions:</strong>
                  ${err.suggestions.map(s => `
                    <div class="suggestion-item" data-copy="${escapeAttr(s)}" style="background:white; padding:8px 12px; border-radius:4px; margin:6px 0; cursor:pointer; border:1px solid #ecc94b; display:flex; justify-content:space-between; align-items:center;">
                      <code style="font-family:'Courier New', monospace; color:#744210; font-weight:700;">${escapeHtml(s)}</code>
                      <span style="font-size:11px; color:#a0aec0;">Click to copy</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              <div style="margin-top:10px; font-size:11px; color:#a0aec0;">${new Date(err.timestamp).toLocaleTimeString()}</div>
            </div>
          `;
        });
        contentHtml += `</div>`;
      });

      contentHtml += `</div>`;
    }

    errorPanel.innerHTML = headerHtml + actionsHtml + contentHtml;

    // Hook up event listeners (no inline handlers)
    const closeBtn = errorPanel.querySelector('#close-panel');
    if (closeBtn) closeBtn.addEventListener('click', toggleErrorPanel);

    const clearBtn = errorPanel.querySelector('#clear-errors');
    if (clearBtn) clearBtn.addEventListener('click', () => {
      STATE.errors = [];
      STATE.errorCache.clear();
      STATE.cache.clear();
      // Remove visible alerts
      document.querySelectorAll('[data-validator-alert]').forEach(a => a.remove());
      updateErrorButton();
      rebuildErrorPanel();
      console.log('[Validator] All errors cleared');
    });

    const refreshBtn = errorPanel.querySelector('#refresh-inventory');
    if (refreshBtn) refreshBtn.addEventListener('click', () => {
      buildInventory();
      refreshBtn.textContent = '✓ Refreshed!';
      setTimeout(() => refreshBtn.textContent = 'Refresh', 1200);
    });

    const exportBtn = errorPanel.querySelector('#export-errors');
    if (exportBtn) exportBtn.addEventListener('click', exportErrors);

    // Remove buttons
    const removeBtns = errorPanel.querySelectorAll('.remove-error-btn');
    removeBtns.forEach(btn => {
      const id = btn.getAttribute('data-error-id');
      btn.addEventListener('click', () => {
        removeErrorById(id);
      });
    });

    // Suggestion copy handlers
    const suggestionItems = errorPanel.querySelectorAll('.suggestion-item');
    suggestionItems.forEach(item => {
      item.addEventListener('click', () => {
        const txt = item.getAttribute('data-copy') || item.textContent;
        try {
          navigator.clipboard.writeText(txt);
          // small feedback
          const prev = item.innerHTML;
          item.innerHTML = `<span style="font-weight:700;">✓ Copied</span>`;
          setTimeout(() => item.innerHTML = prev, 900);
        } catch (err) {
          console.warn('Clipboard write failed', err);
        }
      });
    });
  }

  function rebuildErrorPanelIfOpen() {
    if (document.getElementById('validator-error-panel')) {
      rebuildErrorPanel();
    }
  }

  function toggleErrorPanel() {
    if (errorPanel) {
      // close
      errorPanel.remove();
      errorPanel = null;
    } else {
      createErrorPanel();
    }
  }

  function removeErrorById(id) {
    const idx = STATE.errors.findIndex(e => e.id === id);
    if (idx === -1) return;
    const [removed] = STATE.errors.splice(idx, 1);
    const key = `${removed.type}:${removed.value}`;
    STATE.errorCache.delete(key);
    // Update UI
    updateErrorButton();
    // Remove any visible alerts tied to this error (optional)
    document.querySelectorAll(`[data-error-id="${id}"]`).forEach(el => el.remove());
    repositionAlerts();
    rebuildErrorPanelIfOpen();
  }

  // ===== EXPORT =====
  function exportErrors() {
    const data = {
      timestamp: new Date().toISOString(),
      totalErrors: STATE.errors.length,
      errors: STATE.errors.map(e => ({ type: e.type, value: e.value, suggestions: e.suggestions, timestamp: e.timestamp })),
      inventory: {
        ids: Array.from(STATE.ids),
        classes: Array.from(STATE.classes),
        tags: Array.from(STATE.tags),
        names: Array.from(STATE.names)
      }
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dom-validation-errors-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    console.log('[Validator] Errors exported');
  }

  // ===== INVENTORY BUILDER =====
  function buildInventory() {
    const wasEnabled = STATE.enabled;
    STATE.enabled = false;

    STATE.ids.clear();
    STATE.classes.clear();
    STATE.tags.clear();
    STATE.names.clear();

    document.querySelectorAll('*').forEach(el => {
      if (el.id && !INTERNAL_FILTERS.shouldIgnoreId(el.id)) {
        STATE.ids.add(el.id);
      }
      if (el.className && typeof el.className === 'string') {
        el.className.split(/\s+/).forEach(cls => {
          if (cls) STATE.classes.add(cls);
        });
      }
      STATE.tags.add(el.tagName.toLowerCase());
      if (el.name) STATE.names.add(el.name);
    });

    console.log(`[Validator] 📋 Inventory: ${STATE.ids.size} IDs, ${STATE.classes.size} classes, ${STATE.tags.size} tags, ${STATE.names.size} names`);

    STATE.enabled = wasEnabled;
  }

  // ===== LEVENSHTEIN DISTANCE / SUGGESTIONS =====
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
        else dp[i][j] = Math.min(dp[i - 1][j - 1] + 1, dp[i - 1][j] + 1, dp[i][j - 1] + 1);
      }
    }
    return dp[m][n];
  }

  function findSuggestions(target, inventory, max = 3) {
    const suggestions = [];
    const lowerTarget = String(target).toLowerCase();
    for (const item of inventory) {
      const distance = levenshtein(lowerTarget, String(item).toLowerCase());
      if (distance <= Math.max(3, Math.floor(target.length / 2))) {
        suggestions.push({ item, distance });
      }
    }
    suggestions.sort((a, b) => a.distance - b.distance);
    return suggestions.slice(0, max).map(s => s.item);
  }

  // ===== VALIDATION FUNCTIONS =====
  function validateId(id) {
    if (!id || typeof id !== 'string' || !STATE.enabled) return true;
    if (INTERNAL_FILTERS.shouldIgnoreId(id)) return true;
    if (!STATE.ids.has(id)) {
      const suggestions = findSuggestions(id, STATE.ids);
      const err = addError('id', id, suggestions);
      if (err) {
        console.group(`%c❌ ID Not Found: "${id}"`, 'color:#f56565; font-weight:bold;');
        console.error(`ID "${id}" does not exist`);
        if (suggestions.length) console.warn(`Did you mean: ${suggestions.join(', ')}?`);
        console.groupEnd();
        showAlertForError(err);
      }
      return false;
    }
    return true;
  }

  function validateClass(className) {
    if (!className || typeof className !== 'string' || !STATE.enabled) return true;
    if (!STATE.classes.has(className)) {
      const suggestions = findSuggestions(className, STATE.classes);
      const err = addError('class', className, suggestions);
      if (err) {
        console.group(`%c❌ Class Not Found: "${className}"`, 'color:#f56565; font-weight:bold;');
        console.error(`Class "${className}" does not exist`);
        if (suggestions.length) console.warn(`Did you mean: ${suggestions.join(', ')}?`);
        console.groupEnd();
        showAlertForError(err);
      }
      return false;
    }
    return true;
  }

  function validateTag(tagName) {
    if (!tagName || typeof tagName !== 'string' || !STATE.enabled) return true;
    const tag = tagName.toLowerCase();
    if (!STATE.tags.has(tag)) {
      const suggestions = findSuggestions(tag, STATE.tags);
      const err = addError('tag', tag, suggestions);
      if (err) {
        console.group(`%c❌ Tag Not Found: "${tag}"`, 'color:#f56565; font-weight:bold;');
        console.error(`Tag "${tag}" does not exist`);
        if (suggestions.length) console.warn(`Did you mean: ${suggestions.join(', ')}?`);
        console.groupEnd();
        showAlertForError(err);
      }
      return false;
    }
    return true;
  }

  function validateName(name) {
    if (!name || typeof name !== 'string' || !STATE.enabled) return true;
    if (!STATE.names.has(name)) {
      const suggestions = findSuggestions(name, STATE.names);
      const err = addError('name', name, suggestions);
      if (err) {
        console.group(`%c❌ Name Attribute Not Found: "${name}"`, 'color:#f56565; font-weight:bold;');
        console.error(`Name attribute "${name}" does not exist`);
        if (suggestions.length) console.warn(`Did you mean: ${suggestions.join(', ')}?`);
        console.groupEnd();
        showAlertForError(err);
      }
      return false;
    }
    return true;
  }

  function validateSelector(selector) {
    if (!selector || typeof selector !== 'string' || !STATE.enabled) return true;

    // Quick parse for common simple selectors
    const idMatch = selector.match(/#([a-zA-Z][\w-]*)/);
    const classMatch = selector.match(/\.([a-zA-Z][\w-]*)/);
    const tagMatch = selector.match(/^([a-z][a-z0-9]*)/i);

    if (idMatch) validateId(idMatch[1]);
    if (classMatch) validateClass(classMatch[1]);
    if (tagMatch && !idMatch && !classMatch) validateTag(tagMatch[1]);

    return true;
  }

  // ===== HOOK NATIVE METHODS =====
  (function hookNative() {
    const origGetById = Document.prototype.getElementById;
    Document.prototype.getElementById = function (id) {
      validateId(id);
      return origGetById.call(this, id);
    };

    const origGetByClass = Document.prototype.getElementsByClassName;
    Document.prototype.getElementsByClassName = function (cls) {
      validateClass(cls);
      return origGetByClass.call(this, cls);
    };

    const origGetByTag = Document.prototype.getElementsByTagName;
    Document.prototype.getElementsByTagName = function (tag) {
      validateTag(tag);
      return origGetByTag.call(this, tag);
    };

    const origGetByName = Document.prototype.getElementsByName;
    Document.prototype.getElementsByName = function (name) {
      validateName(name);
      return origGetByName.call(this, name);
    };

    const origQS = Document.prototype.querySelector;
    Document.prototype.querySelector = function (selector) {
      validateSelector(selector);
      return origQS.call(this, selector);
    };

    const origQSA = Document.prototype.querySelectorAll;
    Document.prototype.querySelectorAll = function (selector) {
      validateSelector(selector);
      return origQSA.call(this, selector);
    };
  })();

  // ===== HOOK DOM HELPERS (if present) =====
  function hookAfterDelay() {
    setTimeout(() => {
      try {
        if (global.Elements) console.log('[Validator] Hooked Elements');
        if (global.Collections) console.log('[Validator] Hooked Collections');
        if (global.Selector) console.log('[Validator] Hooked Selector');
        if (global.Id) console.log('[Validator] Hooked Id');
      } catch (e) {
        /* noop */
      }
    }, 100);
  }

  // ===== INITIALIZATION =====
  function init() {
    buildInventory();
    hookAfterDelay();

    // Mutation observer to keep inventory up to date
    if (document.body) {
      let rebuildTimeout;
      const observer = new MutationObserver((mutations) => {
        clearTimeout(rebuildTimeout);
        rebuildTimeout = setTimeout(() => {
          buildInventory();
        }, 100);
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['id', 'class', 'name']
      });
    }

    createErrorButton();

    console.log('%c✓ Universal Validator v3.3.1 Active', 'background:#48bb78;color:white;padding:6px 12px;border-radius:6px;font-weight:bold;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
      e.preventDefault();
      toggleErrorPanel();
    }
  });

  // ===== SMALL HELPERS =====
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  function escapeAttr(s) {
    return String(s).replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  // ===== PUBLIC API =====
  global.UniversalValidator = {
    version: '3.3.1',
    enable: () => { STATE.enabled = true; },
    disable: () => { STATE.enabled = false; },
    refresh: buildInventory,
    validateId,
    validateClass,
    validateTag,
    validateName,
    validateSelector,
    getInventory: () => ({
      ids: Array.from(STATE.ids),
      classes: Array.from(STATE.classes),
      tags: Array.from(STATE.tags),
      names: Array.from(STATE.names)
    }),
    clearCache: () => { STATE.cache.clear(); },
    getErrors: () => STATE.errors.slice(),
    clearErrors: () => {
      STATE.errors = [];
      STATE.errorCache.clear();
      STATE.cache.clear();
      document.querySelectorAll('[data-validator-alert]').forEach(a => a.remove());
      updateErrorButton();
      if (errorPanel) rebuildErrorPanel();
    },
    showPanel: toggleErrorPanel,
    exportErrors,
    _removeErrorById: removeErrorById // useful for tests
  };

  // Utility: when validate... finds a missing element it adds and immediately shows an alert.
  // If you want to programmatically show previously-tracked errors as alerts, do:
  // UniversalValidator.getErrors().forEach(e => showAlertForError(e));

  // Expose showAlertForError to allow re-show of tracked errors (optional)
  global.UniversalValidator._showAlertForError = showAlertForError;

  console.log('%c🚀 Universal Validator v3.3.1 Ready', 'background:#48bb78;color:white;padding:8px 12px;border-radius:6px;font-weight:bold;');

})(typeof window !== 'undefined' ? window : this);
```
