


/** 
 * Iterates over an object's entries using Object.entries() and forEach()
 * @param {Object} obj - The object to iterate over
 * @param {Function} callback - Function called for each entry (key, value, index)
 * @param {string} [selector] - Optional CSS selector to render output (e.g., '#output', '.container')
 * @returns {string|undefined} Returns accumulated HTML if callback returns strings, otherwise undefined
 */

function forEachEntry(obj, callback, selector) {
  if (obj === null || typeof obj !== 'object') {
    console.warn('forEachEntry: First argument must be an object');
    return '';
  }
  
  let html = '';
  let isReturningHTML = false;
  
  Object.entries(obj).forEach(([key, value], index) => {
    const result = callback(key, value, index);
    if (result !== undefined) {
      html += result;
      isReturningHTML = true;
    }
  });
  
  const output = isReturningHTML ? html : undefined;
  
  // Render to UI if selector provided
  if (selector && typeof selector === 'string') {
    try {
      const element = document.querySelector(selector);
      if (element) {
        element.innerHTML = output || '';
      } else {
        console.warn(`forEachEntry: Element not found for selector "${selector}"`);
      }
    } catch (error) {
      console.warn(`forEachEntry: Invalid selector "${selector}"`, error);
    }
  }
  
  return output;
}

/**
 * Maps over an object's entries using Object.entries() and map()
 * @param {Object} obj - The object to map over
 * @param {Function} callback - Function called for each entry (key, value, index) - should return new value
 * @param {boolean|string} joinHTMLOrSelector - If true, joins array as HTML. If string, treats as CSS selector and renders
 * @param {string} [selector] - Optional CSS selector when joinHTMLOrSelector is boolean
 * @returns {Array|string} Array of transformed values, or joined HTML string if joinHTML is true
 */
function mapEntries(obj, callback, joinHTMLOrSelector, selector) {
  if (obj === null || typeof obj !== 'object') {
    console.warn('mapEntries: First argument must be an object');
    const empty = (typeof joinHTMLOrSelector === 'boolean' && joinHTMLOrSelector) ? '' : [];
    return empty;
  }
  
  const result = Object.entries(obj).map(([key, value], index) => {
    return callback(key, value, index);
  });
  
  // Determine if we should join and where to render
  let joinHTML = false;
  let targetSelector = null;
  
  if (typeof joinHTMLOrSelector === 'boolean') {
    joinHTML = joinHTMLOrSelector;
    targetSelector = selector;
  } else if (typeof joinHTMLOrSelector === 'string') {
    joinHTML = true;
    targetSelector = joinHTMLOrSelector;
  }
  
  const output = joinHTML ? result.join('') : result;
  
  // Render to UI if selector provided
  if (targetSelector && typeof targetSelector === 'string') {
    try {
      const element = document.querySelector(targetSelector);
      if (element) {
        element.innerHTML = joinHTML ? output : output.join('');
      } else {
        console.warn(`mapEntries: Element not found for selector "${targetSelector}"`);
      }
    } catch (error) {
      console.warn(`mapEntries: Invalid selector "${targetSelector}"`, error);
    }
  }
  
  return output;
}