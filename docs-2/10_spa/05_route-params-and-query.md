[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Route Params and Query Strings

Dynamic routes let you encode data directly in the URL. This page explains how to define dynamic segments, extract their values, and work with query strings.

---

## Named parameters

A named parameter is a path segment prefixed with `:`. It matches any value in that position and captures it by name.

### Defining params

```javascript
Router.define([
  { path: '/user/:id',           view: '#user-template' },
  { path: '/post/:slug',         view: '#post-template' },
  { path: '/shop/:category/:id', view: '#product-template' },
]);
```

### Reading params in `onEnter`

The `params` object is the first argument to `onEnter`:

```javascript
{
  path: '/user/:id',
  view: '#user-template',
  onEnter: (params, query, onCleanup) => {
    console.log(params.id);  // '42' for /user/42
  }
}
```

### Multiple params

```javascript
{
  path: '/shop/:category/:id',
  view: '#product-template',
  onEnter: (params) => {
    // URL: /shop/electronics/99
    console.log(params.category); // 'electronics'
    console.log(params.id);       // '99'
  }
}
```

### Params are always strings

URL parameters are extracted as strings. Convert them when you need a number:

```javascript
onEnter: (params) => {
  const id = Number(params.id);         // '42' → 42
  const page = parseInt(params.page);   // '3'  → 3
}
```

---

## Reading params from `Router.current()`

Outside of `onEnter`, you can read params from the current route snapshot:

```javascript
const route = Router.current();

if (route) {
  console.log(route.path);    // '/user/42'
  console.log(route.params);  // { id: '42' }
  console.log(route.query);   // URLSearchParams
  console.log(route.title);   // 'User Profile'
}
```

---

## Query strings

Query strings appear after `?` in the URL: `/search?q=router&page=2`.

They are passed to `onEnter` as a [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) instance.

### Reading query values

```javascript
{
  path: '/search',
  view: '#search-template',
  onEnter: (params, query) => {
    // URL: /search?q=router&page=2

    const term = query.get('q');       // 'router'
    const page = query.get('page');    // '2'
    const sort = query.get('sort');    // null (not present)

    // Check if a key exists
    if (query.has('filter')) {
      applyFilter(query.get('filter'));
    }
  }
}
```

### All `URLSearchParams` methods

```javascript
query.get('key')        // Get single value, or null
query.has('key')        // Check if key exists
query.getAll('tags')    // Get all values for a key (for ?tags=a&tags=b)
query.toString()        // Serialize back to string: 'q=router&page=2'

// Iterate all entries
for (const [key, value] of query) {
  console.log(key, value);
}
```

---

## Combining params and query strings

Params and query strings can be used together:

```javascript
{
  path: '/category/:slug',
  view: '#category-template',
  onEnter: (params, query) => {
    // URL: /category/electronics?page=3&sort=price

    const category = params.slug;      // 'electronics'
    const page = Number(query.get('page') || '1');  // 3
    const sort = query.get('sort') || 'date';       // 'price'

    loadProducts(category, { page, sort });
  }
}
```

---

## Practical patterns

### Fetching data based on a param

```javascript
{
  path: '/post/:slug',
  view: '#post-template',
  onEnter: async (params, query, onCleanup) => {
    const post = await fetchPost(params.slug);

    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-body').innerHTML = post.content;
    document.title = post.title;
  }
}
```

### Pagination with query strings

```javascript
{
  path: '/articles',
  view: '#articles-template',
  onEnter: async (params, query) => {
    const page = Number(query.get('page') || '1');
    const articles = await fetchArticles({ page });

    renderArticles(articles);
    renderPagination(page);
  }
}
```

Navigate to a specific page:

```javascript
Router.go('/articles?page=3');
```

### Search with a query parameter

```javascript
{
  path: '/search',
  view: '#search-template',
  onEnter: async (params, query) => {
    const term = query.get('q') || '';

    if (!term) {
      showEmptyState();
      return;
    }

    const results = await search(term);
    renderResults(results);
  }
}
```

Trigger a search:

```javascript
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const term = e.target.querySelector('input').value;
  Router.go('/search?q=' + encodeURIComponent(term));
});
```

### Multiple values for the same key

Query strings support multiple values for the same key: `?tags=js&tags=css&tags=html`.

```javascript
onEnter: (params, query) => {
  const tags = query.getAll('tags');  // ['js', 'css', 'html']
  filterByTags(tags);
}
```

---

## Building URLs with params

The router doesn't include a URL builder, but you can construct param URLs as plain strings:

```javascript
// Static params
Router.go('/user/42');
Router.go('/post/hello-world');

// Dynamic params
const userId = 42;
Router.go(`/user/${userId}`);

// With query string
const page = 3;
Router.go(`/articles?page=${page}`);

// With URLSearchParams for complex queries
const params = new URLSearchParams({ q: 'hello world', page: 2, sort: 'date' });
Router.go('/search?' + params.toString());
// → /search?q=hello+world&page=2&sort=date
```

---

## Accessing params inside the view factory

If you use a factory function for `view`, it also receives `(params, query)`:

```javascript
{
  path: '/user/:id',
  view: async (params, query) => {
    const user = await fetchUser(params.id);
    return `
      <div class="profile">
        <h1>${user.name}</h1>
        <p>ID: ${params.id}</p>
      </div>
    `;
  }
}
```

---

## What `Router.current()` gives you

After any navigation, `Router.current()` returns:

```javascript
{
  path:   '/category/electronics?page=2',   // full path including query string
  params: { slug: 'electronics' },           // extracted named params
  query:  URLSearchParams { 'page' => '2' }, // query string
  title:  'Electronics'                      // route title (or null)
}
```

Useful for reading the current state from outside a route lifecycle:

```javascript
Router.on('change', () => {
  const route = Router.current();
  updateBreadcrumb(route.path);
  updateAnalytics(route.path, route.params);
});
```

---

## Key takeaways

1. **`:name`** in a path becomes a named parameter, captured in `params`
2. **`params`** values are always strings — convert them when needed
3. **`query`** is a `URLSearchParams` instance — use `.get()`, `.has()`, `.getAll()`
4. Both `params` and `query` are available in `onEnter` and the `view` factory
5. **`Router.current()`** gives you `{ path, params, query, title }` from anywhere
6. Build URLs as plain strings or with `URLSearchParams.toString()`

---

## What's next?

- Adding animated transitions between views
- Declarative navigation links with `[data-route]`
- Navigation guards for auth, logging, and scroll memory
