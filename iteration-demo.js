// ===== REACTIVITY EXPLANATION =====

/*
YES! forEachEntry and mapEntries automatically trigger reactivity when used 
inside reactive effects because:

1. They call Object.entries(obj) which accesses the object
2. Inside the callback, you access obj's properties (value parameter)
3. Your reactive system tracks these property accesses
4. When properties change, effects automatically re-run

Example with your dh-reactive system:

const state = ReactiveUtils.state({
  user: { name: 'John', age: 30, city: 'NYC' }
});

// This effect will track ALL properties accessed by forEachEntry
ReactiveUtils.effect(() => {
  const html = forEachEntry(state.user, (key, value) => {
    return `<div>${key}: ${value}</div>`; // Tracks name, age, city
  });
  document.getElementById('output').innerHTML = html;
});

// Changing ANY property will trigger the effect
state.user.name = 'Jane'; // Effect re-runs!
state.user.age = 31;      // Effect re-runs!

The reactivity tracking happens automatically because:
- Object.entries() reads the object's keys
- The callback accesses each value
- Your reactive Proxy intercepts these reads
- Dependencies are registered with the current effect
*/

// ===== USAGE EXAMPLES =====

// Example 1: Backward compatible - no selector
const user = { name: 'John', age: 30, city: 'NYC' };
const html = forEachEntry(user, (key, value) => {
  return `<div>${key}: ${value}</div>`;
});
console.log(html); // Returns HTML string

// Example 2: Render directly to UI with selector
forEachEntry(user, (key, value) => {
  return `<div>${key}: ${value}</div>`;
}, '#output'); // Automatically renders to #output element

// Example 3: mapEntries with selector (as 3rd argument when joinHTML is true)
const product = { price: 99, stock: 50, rating: 4.5 };
mapEntries(product, (key, value) => {
  return `<span>${key}: ${value}</span>`;
}, true, '#product'); // Join HTML and render to #product

// Example 4: mapEntries with selector as 2nd param (shorthand)
mapEntries(product, (key, value) => {
  return `<span>${key}: ${value}</span>`;
}, '#product'); // Automatically joins and renders

// Example 5: Still works without selector
const labels = mapEntries(product, (key, value) => {
  return `${key}: ${value}`;
}); // Returns array: ['price: 99', 'stock: 50', 'rating: 4.5']

// Example 6: Reactive rendering with selector
const state = ReactiveUtils.state({
  product: { name: 'Laptop', price: 999, stock: 5 }
});

ReactiveUtils.effect(() => {
  forEachEntry(state.product, (key, value) => {
    return `<div><strong>${key}:</strong> ${value}</div>`;
  }, '#product-info'); // Auto-renders on state changes
});

state.product.price = 899; // UI updates automatically!

// Example 7: Invalid selector handling (safe with warnings)
forEachEntry(user, (key, value) => {
  return `<div>${key}: ${value}</div>`;
}, '#nonexistent'); // Warns but doesn't crash, still returns HTML

// Example 8: Class selector
mapEntries(product, (key, value) => {
  return `<li>${key}: ${value}</li>`;
}, '.product-list'); // Works with class selectors too
