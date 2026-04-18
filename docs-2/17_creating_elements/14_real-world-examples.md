[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Real-World Examples

This file shows complete, practical applications of `createElement` in Dom Helpers. Each example combines multiple techniques from this documentation section.

---

## Example 1: Comment Thread

A complete comment thread with: a list of existing comments, the ability to add new comments, and live updating of the comment count.

```javascript
// State
let commentCount = 0;

// Render existing comments from data
function renderComments(comments) {
  const commentConfig = {};

  comments.forEach((comment, i) => {
    commentConfig[`COMMENT_${i + 1}`] = {
      className: 'comment',
      style: {
        padding: '16px',
        marginBottom: '12px',
        background: '#f8f9fa',
        borderRadius: '8px',
        borderLeft: '3px solid #007bff'
      }
    };
  });

  const commentElements = createElement.bulk(commentConfig);

  // Fill in content for each comment
  comments.forEach((comment, i) => {
    const key = `COMMENT_${i + 1}`;
    commentElements[key].innerHTML = `
      <strong>${comment.author}</strong>
      <span style="color:#999; font-size:12px; margin-left:10px">${comment.time}</span>
      <p style="margin:8px 0 0; color:#555">${comment.text}</p>
    `;
  });

  commentElements.appendTo(Elements.commentList);
  commentCount = comments.length;
  updateCommentCounter();
}

// Add a new comment
function addComment(author, text) {
  const newComment = createElement.bulk({
    ARTICLE: {
      className: 'comment comment--new',
      style: {
        padding: '16px',
        marginBottom: '12px',
        background: '#e8f5e9',  // Green tint for new comments
        borderRadius: '8px',
        borderLeft: '3px solid #28a745',
        animation: 'slideIn 0.3s ease'
      }
    }
  });

  newComment.ARTICLE.innerHTML = `
    <strong>${author}</strong>
    <span style="color:#999; font-size:12px; margin-left:10px">Just now</span>
    <p style="margin:8px 0 0; color:#555">${text}</p>
  `;

  Elements.commentList.appendChild(newComment.ARTICLE);
  commentCount++;
  updateCommentCounter();

  // Fade to normal style after 2 seconds
  setTimeout(() => {
    newComment.ARTICLE.update({
      style: { background: '#f8f9fa', borderLeft: '3px solid #007bff', animation: '' }
    });
  }, 2000);
}

function updateCommentCounter() {
  Elements.commentCount.update({
    textContent: `${commentCount} comment${commentCount !== 1 ? 's' : ''}`
  });
}

// Comment form
const commentForm = createElement.bulk({
  FORM: {
    id: 'commentForm',
    style: {
      marginTop: '24px',
      padding: '20px',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }
  },
  TITLE: {
    textContent: 'Leave a Comment',
    style: { margin: '0 0 16px', fontSize: '1.1rem', fontWeight: '600' }
  },
  INPUT_NAME: {
    type: 'text',
    placeholder: 'Your name',
    style: {
      display: 'block',
      width: '100%',
      padding: '10px',
      marginBottom: '12px',
      border: '1px solid #ddd',
      borderRadius: '6px'
    }
  },
  TEXTAREA: {
    placeholder: 'Write your comment...',
    style: {
      display: 'block',
      width: '100%',
      padding: '10px',
      height: '100px',
      marginBottom: '12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      resize: 'vertical'
    }
  },
  BUTTON_SUBMIT: {
    type: 'submit',
    textContent: 'Post Comment',
    classList: { add: ['btn', 'btn-primary'] },
    style: {
      padding: '10px 20px',
      background: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    }
  }
});

commentForm.FORM.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = commentForm.INPUT_NAME.value.trim();
  const text = commentForm.TEXTAREA.value.trim();

  if (!name || !text) return;

  addComment(name, text);

  // Reset the form
  commentForm.INPUT_NAME.value = '';
  commentForm.TEXTAREA.value = '';
});

commentForm.FORM.append(
  commentForm.TITLE,
  commentForm.INPUT_NAME,
  commentForm.TEXTAREA,
  commentForm.BUTTON_SUBMIT
);

Elements.commentSection.appendChild(commentForm.FORM);

// Initialize
renderComments([
  { author: 'Alice', text: 'Great article!', time: '2 hours ago' },
  { author: 'Bob', text: 'Very helpful, thanks.', time: '1 hour ago' }
]);
```

---

## Example 2: Product Filter and Grid

A product grid with filtering and dynamic rendering.

```javascript
// Product data
const allProducts = [
  { id: 1, name: 'Wireless Headphones', price: 89.99, category: 'audio', inStock: true },
  { id: 2, name: 'Mechanical Keyboard', price: 129.99, category: 'peripherals', inStock: true },
  { id: 3, name: 'USB-C Hub',           price: 45.99,  category: 'peripherals', inStock: false },
  { id: 4, name: 'Bluetooth Speaker',   price: 59.99,  category: 'audio',       inStock: true },
  { id: 5, name: 'Gaming Mouse',        price: 69.99,  category: 'peripherals', inStock: true },
  { id: 6, name: 'Noise Cancelling IEMs', price: 199.99, category: 'audio',    inStock: false }
];

// Filter bar
function createFilterBar() {
  const categories = ['all', ...new Set(allProducts.map(p => p.category))];

  const config = {};
  categories.forEach((cat, i) => {
    config[`BTN_${i + 1}`] = {
      textContent: cat.charAt(0).toUpperCase() + cat.slice(1),
      dataset: { filter: cat },
      classList: { add: ['filter-btn', cat === 'all' ? 'filter-btn--active' : ''] },
      style: {
        padding: '8px 18px',
        margin: '4px',
        border: '1px solid #007bff',
        borderRadius: '20px',
        cursor: 'pointer',
        background: cat === 'all' ? '#007bff' : 'transparent',
        color: cat === 'all' ? 'white' : '#007bff'
      },
      addEventListener: ['click', function(e) {
        // Deactivate all buttons
        filterBar.forEach(btn => {
          btn.update({
            style: { background: 'transparent', color: '#007bff' },
            classList: { remove: ['filter-btn--active'] }
          });
        });
        // Activate clicked button
        e.target.update({
          style: { background: '#007bff', color: 'white' },
          classList: { add: ['filter-btn--active'] }
        });
        // Filter the grid
        renderGrid(e.target.dataset.filter);
      }]
    };
  });

  const filterBar = createElement.bulk(config);
  filterBar.appendTo(Elements.filterContainer);

  return filterBar;
}

// Product card factory
function createProductCard(product) {
  const card = createElement.bulk({
    ARTICLE: {
      className: 'product-card',
      dataset: {
        productId: String(product.id),
        category: product.category,
        inStock: String(product.inStock)
      },
      style: {
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column'
      }
    },
    NAME: {
      textContent: product.name,
      style: { margin: '0 0 8px', fontWeight: '600', fontSize: '1rem', flex: '1' }
    },
    PRICE: {
      textContent: `$${product.price.toFixed(2)}`,
      style: { fontSize: '1.3rem', fontWeight: '700', color: '#007bff', margin: '8px 0' }
    },
    STATUS: {
      textContent: product.inStock ? 'In Stock' : 'Out of Stock',
      style: {
        fontSize: '0.8rem',
        padding: '2px 8px',
        borderRadius: '12px',
        display: 'inline-block',
        marginBottom: '12px',
        background: product.inStock ? '#e8f5e9' : '#ffebee',
        color: product.inStock ? '#2e7d32' : '#c62828'
      }
    },
    BUTTON: {
      textContent: product.inStock ? 'Add to Cart' : 'Notify Me',
      disabled: false,
      style: {
        padding: '10px',
        background: product.inStock ? '#007bff' : '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600'
      },
      addEventListener: ['click', () => {
        if (product.inStock) {
          addToCart(product);
        } else {
          notifyMe(product);
        }
      }]
    }
  });

  card.ARTICLE.append(card.NAME, card.PRICE, card.STATUS, card.BUTTON);
  return card.ARTICLE;
}

// Render the grid with optional filter
function renderGrid(filter = 'all') {
  Elements.productGrid.innerHTML = '';  // Clear existing

  const filtered = filter === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === filter);

  if (filtered.length === 0) {
    const empty = createElement('p', {
      textContent: 'No products found.',
      style: { textAlign: 'center', color: '#999', padding: '40px 0' }
    });
    Elements.productGrid.appendChild(empty);
    return;
  }

  filtered.forEach(product => {
    Elements.productGrid.appendChild(createProductCard(product));
  });

  Elements.productCount.update({
    textContent: `Showing ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`
  });
}

// Initialize
createFilterBar();
renderGrid();
```

---

## Example 3: Multi-Step Form Wizard

A form split into multiple steps with navigation.

```javascript
function createWizard(steps) {
  let currentStep = 0;
  const formData = {};

  // Build step indicator dots
  const dotConfig = {};
  steps.forEach((_, i) => {
    dotConfig[`DOT_${i + 1}`] = {
      className: 'wizard-dot',
      style: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: i === 0 ? '#007bff' : '#ddd',
        margin: '0 4px',
        display: 'inline-block',
        cursor: 'pointer',
        transition: 'background 0.2s'
      },
      addEventListener: ['click', () => goToStep(i)]
    };
  });

  const dots = createElement.bulk(dotConfig);

  // Main wizard structure
  const wizard = createElement.bulk({
    CONTAINER: {
      className: 'wizard',
      style: {
        maxWidth: '500px',
        margin: '40px auto',
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }
    },
    HEADER: {
      className: 'wizard__header',
      style: {
        padding: '24px',
        background: '#007bff',
        color: 'white',
        textAlign: 'center'
      }
    },
    TITLE: {
      textContent: steps[0].title,
      style: { margin: '0 0 12px', fontSize: '1.3rem', fontWeight: '600' }
    },
    DOTS_CONTAINER: {
      style: { textAlign: 'center' }
    },
    BODY: {
      className: 'wizard__body',
      style: { padding: '24px' }
    },
    STEP_CONTENT: {
      innerHTML: steps[0].content
    },
    FOOTER: {
      style: { padding: '16px 24px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee' }
    },
    BTN_BACK: {
      textContent: '← Back',
      classList: { add: ['btn', 'btn-outlined'] },
      style: { padding: '10px 20px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' },
      addEventListener: ['click', () => goToStep(currentStep - 1)]
    },
    BTN_NEXT: {
      textContent: 'Next →',
      classList: { add: ['btn', 'btn-primary'] },
      style: { padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
      addEventListener: ['click', () => {
        if (currentStep === steps.length - 1) {
          submitWizard();
        } else {
          goToStep(currentStep + 1);
        }
      }]
    }
  });

  function goToStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= steps.length) return;
    currentStep = stepIndex;

    // Update title and content
    wizard.TITLE.textContent = steps[stepIndex].title;
    wizard.STEP_CONTENT.innerHTML = steps[stepIndex].content;

    // Update dots
    dots.forEach((dot, key, i) => {
      dot.update({
        style: { background: i === stepIndex ? '#007bff' : '#ddd' }
      });
    });

    // Update navigation buttons
    wizard.BTN_BACK.update({
      style: { opacity: stepIndex === 0 ? '0.3' : '1' },
      disabled: stepIndex === 0
    });
    wizard.BTN_NEXT.update({
      textContent: stepIndex === steps.length - 1 ? 'Submit ✓' : 'Next →'
    });
  }

  function submitWizard() {
    wizard.CONTAINER.update({
      innerHTML: '<div style="padding:40px; text-align:center; color:#28a745"><h2>✓ Submitted!</h2><p>Thank you for completing the form.</p></div>'
    });
  }

  // Assemble
  wizard.DOTS_CONTAINER.append(...dots.all);
  wizard.HEADER.append(wizard.TITLE, wizard.DOTS_CONTAINER);
  wizard.BODY.appendChild(wizard.STEP_CONTENT);
  wizard.FOOTER.append(wizard.BTN_BACK, wizard.BTN_NEXT);
  wizard.CONTAINER.append(wizard.HEADER, wizard.BODY, wizard.FOOTER);

  return wizard.CONTAINER;
}

// Use it
const myWizard = createWizard([
  {
    title: 'Personal Information',
    content: '<label>Name: <input type="text" placeholder="Your name"></label><br><br><label>Email: <input type="email" placeholder="your@email.com"></label>'
  },
  {
    title: 'Account Details',
    content: '<label>Username: <input type="text" placeholder="Choose a username"></label><br><br><label>Password: <input type="password" placeholder="Strong password"></label>'
  },
  {
    title: 'Preferences',
    content: '<p>Choose your newsletter preferences:</p><label><input type="checkbox"> Product updates</label><br><label><input type="checkbox"> Tips and tutorials</label><br><label><input type="checkbox"> Security alerts</label>'
  }
]);

document.body.appendChild(myWizard);
```

---

## Example 4: Live Search Results

Dynamic search with debouncing and result rendering.

```javascript
const searchData = [
  { id: 1, name: 'Introduction to JavaScript', type: 'article' },
  { id: 2, name: 'Dom Helpers Guide', type: 'guide' },
  { id: 3, name: 'CSS Grid Layout', type: 'article' },
  { id: 4, name: 'Building Components', type: 'tutorial' },
  { id: 5, name: 'Performance Optimization', type: 'guide' },
  { id: 6, name: 'Async JavaScript', type: 'article' }
];

// Search input
const searchUI = createElement.bulk({
  WRAPPER: {
    className: 'search-wrapper',
    style: { maxWidth: '600px', margin: '0 auto', position: 'relative' }
  },
  INPUT: {
    type: 'search',
    placeholder: 'Search documentation...',
    style: {
      width: '100%',
      padding: '14px 20px',
      fontSize: '1rem',
      border: '2px solid #007bff',
      borderRadius: '8px',
      outline: 'none'
    }
  },
  RESULTS: {
    className: 'search-results',
    style: {
      position: 'absolute',
      top: '100%',
      left: '0',
      right: '0',
      background: 'white',
      borderRadius: '0 0 8px 8px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      display: 'none',
      zIndex: '100',
      maxHeight: '300px',
      overflowY: 'auto'
    }
  }
});

// Debounce helper
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Render search results
function renderResults(query) {
  searchUI.RESULTS.innerHTML = '';

  if (!query.trim()) {
    searchUI.RESULTS.style.display = 'none';
    return;
  }

  const results = searchData.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  if (results.length === 0) {
    const noResults = createElement('p', {
      textContent: 'No results found.',
      style: { padding: '16px', color: '#999', margin: '0' }
    });
    searchUI.RESULTS.appendChild(noResults);
  } else {
    // Build result items
    const resultConfig = {};
    results.forEach((item, i) => {
      resultConfig[`RESULT_${i + 1}`] = {
        className: 'search-result-item',
        style: {
          padding: '12px 20px',
          borderBottom: '1px solid #f0f0f0',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        },
        addEventListener: {
          click: () => {
            console.log(`Navigating to: ${item.name}`);
            searchUI.INPUT.value = item.name;
            searchUI.RESULTS.style.display = 'none';
          },
          mouseenter: (e) => e.target.update({ style: { background: '#f8f9fa' } }),
          mouseleave: (e) => e.target.update({ style: { background: 'white' } })
        }
      };
    });

    const resultElements = createElement.bulk(resultConfig);

    // Fill in content
    results.forEach((item, i) => {
      const key = `RESULT_${i + 1}`;
      const typeColors = { article: '#007bff', guide: '#28a745', tutorial: '#ffc107' };

      resultElements[key].innerHTML = `
        <span style="
          padding: 2px 8px;
          borderRadius: 12px;
          fontSize: 0.75rem;
          fontWeight: 600;
          background: ${typeColors[item.type] || '#6c757d'};
          color: white;
          flexShrink: 0;
        ">${item.type}</span>
        <span>${item.name}</span>
      `;
    });

    resultElements.appendTo(searchUI.RESULTS);
  }

  searchUI.RESULTS.style.display = 'block';
}

// Wire up the search input
searchUI.INPUT.addEventListener('input', debounce((e) => {
  renderResults(e.target.value);
}, 200));

// Close results when clicking outside
document.addEventListener('click', (e) => {
  if (!searchUI.WRAPPER.contains(e.target)) {
    searchUI.RESULTS.style.display = 'none';
  }
});

// Assemble and mount
searchUI.WRAPPER.append(searchUI.INPUT, searchUI.RESULTS);
Elements.searchArea.appendChild(searchUI.WRAPPER);
```

---

## What You Have Learned

By working through this documentation section, you now understand:

1. **Why** plain JavaScript element creation is painful (repetitive, verbose, fragmented)
2. **How** Dom Helpers enhances — not replaces — native APIs
3. **All 13 methods** for creating elements, from the simplest to the most advanced
4. **The result object** and all its helper methods
5. **How to append** elements to the DOM using native and bulk-specific methods
6. **How to compose** factory functions and components from smaller pieces
7. **How to use templates** for consistent, reusable configurations
8. **How to build** complete, real-world applications with the `createElement` system

The rest is practice. Take a component you have built before — in plain JavaScript or any framework — and rebuild it with Dom Helpers. You will immediately feel the difference in readability and structure.

---

## Quick Reference: Choosing the Right Method

```
I need one element, quickly:
  → createElement(tag, config)        [Method 13]

I need one element, with named access:
  → createElement.bulk({ KEY: {} })   [Method 2]

I need multiple elements for a component:
  → createElement.bulk({ A: {}, B: {}, C: {} })  [Method 3]

I need multiple of the same tag:
  → createElement.bulk({ DIV_1: {}, DIV_2: {} })  [Method 4]

I have an existing plain element that needs .update():
  → EnhancedUpdateUtility.enhanceElementWithUpdate(el)  [Method 5]

I need to update an existing HTML element:
  → Elements.myId.update({})          [Method 6]

I need a copy of an existing element:
  → clone + enhance                   [Method 7]

I need the same structure multiple times with different data:
  → factory function + createElement.bulk()  [Method 8]

I need a self-contained UI piece with internal behavior:
  → component function + createElement.bulk()  [Method 9]

I need elements from a dynamic data array:
  → loop + createElement.bulk()       [Method 10]

I need consistent styles across many elements:
  → config template + spread          [Method 11]

I need different elements for different users/states:
  → conditional config + createElement.bulk()  [Method 12]
```