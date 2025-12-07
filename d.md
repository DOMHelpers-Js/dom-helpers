
Analyze how the file **`05_dh-index-selection.js`** implements **array-based update behavior** for index-driven element updates in the Selector system. Focus specifically on how this file handles updates when multiple elements are selected.

Then inspect all modules related to **`queryAll`** , **`querySelectorAll`**,**`Collections.ClassName`**,**`Collections.tagName`** ,**`Collections.Name`**,**`ClassName`**,**`tagName`**,**`Name`** within the project. I want all of these selection functions to additionally support the same **array-based update** mechanism used in `05_dh-index-selection.js`.

Your task:

* Identify what must be added, refactored, or extended so that collections returned by `queryAll('.selector')` and `querySelectorAll('.selector')` and `Collections.ClassName`,`Collections.tagName`,`Collections.Name`,`ClassName`,`tagName`,`Name` can accept updates like the following example:

```js
const cards = querySelectorAll('.card');
// or
const cards = queryAll('.card');

// for these also `Collections.ClassName`,`Collections.tagName`,`Collections.Name`,`ClassName`,`tagName`,`Name`

cards.update({
  textContent: ['First Card', 'Second Card', 'Third Card'],
  style: {
    backgroundColor: ['#ffebee', '#e8f5e9', '#e3f2fd'],
    color: ['#c62828', '#2e7d32', '#1565c0'],
    fontWeight: 'bold',
    padding: '30px'
  }
});
```

