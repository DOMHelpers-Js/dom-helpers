# Understanding `at()` - A Beginner's Guide

## What is `at()`?

`at()` is a method for reactive collections that returns the item at a specific index. It supports negative indices (counting from the end) and works like JavaScript's array `at()` method.

Think of it as **smart index access** - get items from any position, forwards or backwards.

---

## Why Does This Exist?

### The Problem: Accessing Items by Index

You need flexible index access, especially from the end:

```javascript
// ❌ Without at() - awkward negative access
const items = ReactiveUtils.collection([1, 2, 3, 4, 5]);

const last = items[items.length - 1]; // 5
const secondLast = items[items.length - 2]; // 4

// ✅ With at() - clean negative indices
const last = items.at(-1); // 5
const secondLast = items.at(-2); // 4
```

**Why this matters:**
- Negative indices support
- Cleaner syntax
- Familiar array method
- Safe access

---

## How Does It Work?

### The At Process

```javascript
collection.at(index)
    ↓
If positive: returns items[index]
If negative: returns items[length + index]
    ↓
Returns item or undefined
```

---

## Basic Usage

### Positive Index

```javascript
const items = ReactiveUtils.collection(['a', 'b', 'c', 'd', 'e']);

console.log(items.at(0)); // 'a' (first)
console.log(items.at(2)); // 'c' (third)
console.log(items.at(4)); // 'e' (last)
```

### Negative Index

```javascript
const items = ReactiveUtils.collection(['a', 'b', 'c', 'd', 'e']);

console.log(items.at(-1)); // 'e' (last)
console.log(items.at(-2)); // 'd' (second last)
console.log(items.at(-5)); // 'a' (first from end)
```

### Out of Bounds

```javascript
const items = ReactiveUtils.collection([1, 2, 3]);

console.log(items.at(10)); // undefined
console.log(items.at(-10)); // undefined
```

---

## Simple Examples Explained

### Example 1: Playlist Navigation

```javascript
const playlist = ReactiveUtils.collection([
  { id: 1, title: 'Song 1', artist: 'Artist A' },
  { id: 2, title: 'Song 2', artist: 'Artist B' },
  { id: 3, title: 'Song 3', artist: 'Artist C' },
  { id: 4, title: 'Song 4', artist: 'Artist D' },
  { id: 5, title: 'Song 5', artist: 'Artist E' }
]);

const playerState = ReactiveUtils.state({
  currentIndex: 0
});

// Display current song
ReactiveUtils.effect(() => {
  const song = playlist.at(playerState.currentIndex);

  if (song) {
    document.getElementById('now-playing').innerHTML = `
      <h3>${song.title}</h3>
      <p>${song.artist}</p>
    `;
  }
});

// Navigation functions
function nextSong() {
  if (playerState.currentIndex < playlist.length - 1) {
    playerState.currentIndex++;
  }
}

function prevSong() {
  if (playerState.currentIndex > 0) {
    playerState.currentIndex--;
  }
}

function jumpToSong(index) {
  const song = playlist.at(index);
  if (song) {
    playerState.currentIndex = index;
  }
}

// Quick access
function playFirst() {
  playerState.currentIndex = 0;
}

function playLast() {
  playerState.currentIndex = playlist.length - 1;
  // Or using at():
  // if (playlist.at(-1)) {
  //   playerState.currentIndex = playlist.length - 1;
  // }
}
```

---

### Example 2: Image Gallery

```javascript
const images = ReactiveUtils.collection([
  { id: 1, url: 'image1.jpg', title: 'Sunset' },
  { id: 2, url: 'image2.jpg', title: 'Mountains' },
  { id: 3, url: 'image3.jpg', title: 'Ocean' },
  { id: 4, url: 'image4.jpg', title: 'Forest' }
]);

const galleryState = ReactiveUtils.state({
  currentIndex: 0
});

// Display current image
ReactiveUtils.effect(() => {
  const image = images.at(galleryState.currentIndex);

  if (image) {
    document.getElementById('main-image').innerHTML = `
      <img src="${image.url}" alt="${image.title}">
      <p>${image.title}</p>
      <span>${galleryState.currentIndex + 1} / ${images.length}</span>
    `;
  }
});

// Display thumbnails
ReactiveUtils.effect(() => {
  const container = document.getElementById('thumbnails');

  container.innerHTML = images
    .map((img, index) => `
      <div class="thumbnail ${index === galleryState.currentIndex ? 'active' : ''}"
           onclick="galleryState.currentIndex = ${index}">
        <img src="${img.url}" alt="${img.title}">
      </div>
    `)
    .join('');
});

// Navigation
function nextImage() {
  galleryState.currentIndex = (galleryState.currentIndex + 1) % images.length;
}

function prevImage() {
  galleryState.currentIndex =
    (galleryState.currentIndex - 1 + images.length) % images.length;
}

// Quick access using at()
function showFirstImage() {
  if (images.at(0)) {
    galleryState.currentIndex = 0;
  }
}

function showLastImage() {
  if (images.at(-1)) {
    galleryState.currentIndex = images.length - 1;
  }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') prevImage();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'Home') showFirstImage();
  if (e.key === 'End') showLastImage();
});
```

---

### Example 3: Undo/Redo System

```javascript
const history = ReactiveUtils.collection([
  { action: 'create', data: { id: 1, name: 'Item 1' } }
]);

const historyState = ReactiveUtils.state({
  currentIndex: 0,
  maxHistory: 50
});

// Add action to history
function addToHistory(action, data) {
  // Remove any actions after current index
  history.splice(historyState.currentIndex + 1);

  // Add new action
  history.push({
    action: action,
    data: data,
    timestamp: Date.now()
  });

  // Limit history size
  if (history.length > historyState.maxHistory) {
    history.shift();
  } else {
    historyState.currentIndex++;
  }
}

// Undo
function undo() {
  if (historyState.currentIndex > 0) {
    historyState.currentIndex--;

    const action = history.at(historyState.currentIndex);
    performUndo(action);
  }
}

// Redo
function redo() {
  if (historyState.currentIndex < history.length - 1) {
    historyState.currentIndex++;

    const action = history.at(historyState.currentIndex);
    performRedo(action);
  }
}

// Display current action
ReactiveUtils.effect(() => {
  const current = history.at(historyState.currentIndex);

  if (current) {
    document.getElementById('current-action').textContent =
      `Current: ${current.action}`;
  }
});

// Display history list
ReactiveUtils.effect(() => {
  const container = document.getElementById('history-list');

  container.innerHTML = history
    .map((item, index) => `
      <div class="history-item ${index === historyState.currentIndex ? 'current' : ''}
                                 ${index > historyState.currentIndex ? 'future' : ''}">
        <span>${item.action}</span>
        <small>${new Date(item.timestamp).toLocaleTimeString()}</small>
      </div>
    `)
    .join('');
});

// Enable/disable buttons
ReactiveUtils.effect(() => {
  document.getElementById('undo-btn').disabled = historyState.currentIndex <= 0;
  document.getElementById('redo-btn').disabled =
    historyState.currentIndex >= history.length - 1;
});

// Helper functions
function performUndo(action) {
  console.log(`Undoing: ${action.action}`);
  // Implement undo logic
}

function performRedo(action) {
  console.log(`Redoing: ${action.action}`);
  // Implement redo logic
}
```

---

## Real-World Example: Carousel with Preview

```javascript
const slides = ReactiveUtils.collection([
  { id: 1, image: 'slide1.jpg', title: 'Welcome', description: 'Get started' },
  { id: 2, image: 'slide2.jpg', title: 'Features', description: 'Explore features' },
  { id: 3, image: 'slide3.jpg', title: 'Pricing', description: 'Choose plan' },
  { id: 4, image: 'slide4.jpg', title: 'Contact', description: 'Get in touch' },
  { id: 5, image: 'slide5.jpg', title: 'FAQ', description: 'Find answers' }
]);

const carouselState = ReactiveUtils.state({
  currentIndex: 0,
  autoPlay: false,
  autoPlayInterval: null
});

// Display main slide
ReactiveUtils.effect(() => {
  const slide = slides.at(carouselState.currentIndex);

  if (slide) {
    document.getElementById('main-slide').innerHTML = `
      <div class="slide">
        <img src="${slide.image}" alt="${slide.title}">
        <h2>${slide.title}</h2>
        <p>${slide.description}</p>
      </div>
    `;
  }
});

// Display preview slides (previous and next)
ReactiveUtils.effect(() => {
  const container = document.getElementById('preview-slides');

  const prevSlide = slides.at(carouselState.currentIndex - 1);
  const nextSlide = slides.at(carouselState.currentIndex + 1);

  container.innerHTML = `
    <div class="preview-container">
      ${prevSlide ? `
        <div class="preview prev" onclick="prevSlide()">
          <img src="${prevSlide.image}" alt="${prevSlide.title}">
          <span>${prevSlide.title}</span>
        </div>
      ` : '<div class="preview disabled"></div>'}

      <div class="current-indicator">
        ${carouselState.currentIndex + 1} / ${slides.length}
      </div>

      ${nextSlide ? `
        <div class="preview next" onclick="nextSlide()">
          <img src="${nextSlide.image}" alt="${nextSlide.title}">
          <span>${nextSlide.title}</span>
        </div>
      ` : '<div class="preview disabled"></div>'}
    </div>
  `;
});

// Navigation functions
function nextSlide() {
  if (carouselState.currentIndex < slides.length - 1) {
    carouselState.currentIndex++;
  } else if (carouselState.autoPlay) {
    carouselState.currentIndex = 0; // Loop
  }
}

function prevSlide() {
  if (carouselState.currentIndex > 0) {
    carouselState.currentIndex--;
  } else if (carouselState.autoPlay) {
    carouselState.currentIndex = slides.length - 1; // Loop
  }
}

function goToSlide(index) {
  const slide = slides.at(index);
  if (slide) {
    carouselState.currentIndex = index;
  }
}

// Auto-play controls
function startAutoPlay() {
  if (!carouselState.autoPlay) {
    carouselState.autoPlay = true;
    carouselState.autoPlayInterval = setInterval(nextSlide, 3000);
  }
}

function stopAutoPlay() {
  if (carouselState.autoPlay) {
    carouselState.autoPlay = false;
    clearInterval(carouselState.autoPlayInterval);
  }
}

// Indicator dots
ReactiveUtils.effect(() => {
  const dots = document.getElementById('indicator-dots');

  dots.innerHTML = slides
    .map((_, index) => `
      <span class="dot ${index === carouselState.currentIndex ? 'active' : ''}"
            onclick="goToSlide(${index})"></span>
    `)
    .join('');
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});
```

---

## Common Patterns

### Pattern 1: Positive Index

```javascript
const item = collection.at(0); // First
const item = collection.at(2); // Third
```

### Pattern 2: Negative Index

```javascript
const last = collection.at(-1); // Last
const secondLast = collection.at(-2); // Second last
```

### Pattern 3: Safe Access

```javascript
const item = collection.at(index);
if (item) {
  console.log(item.name);
}
```

### Pattern 4: Dynamic Index

```javascript
const item = collection.at(state.currentIndex);
```

---

## Common Questions

### Q: What if index is out of bounds?

**Answer:** Returns `undefined`:

```javascript
const items = ReactiveUtils.collection([1, 2, 3]);
console.log(items.at(10)); // undefined
console.log(items.at(-10)); // undefined
```

### Q: Difference from bracket notation?

**Answer:** `at()` supports negative indices:

```javascript
const items = ReactiveUtils.collection([1, 2, 3]);

// Bracket notation - no negative support
console.log(items[-1]); // undefined

// at() - negative support
console.log(items.at(-1)); // 3
```

### Q: Is it reactive?

**Answer:** The collection is reactive:

```javascript
ReactiveUtils.effect(() => {
  console.log(items.at(0));
});

items[0] = 99; // Effect runs
```

---

## Tips for Success

### 1. Use Negative Indices

```javascript
// ✅ Clean access from end
const last = items.at(-1);
const secondLast = items.at(-2);
```

### 2. Always Check Result

```javascript
// ✅ Safe access
const item = items.at(index);
if (item) {
  console.log(item.name);
}
```

### 3. Use for Navigation

```javascript
// ✅ Index-based navigation
const current = items.at(currentIndex);
const next = items.at(currentIndex + 1);
const prev = items.at(currentIndex - 1);
```

---

## Summary

### What `at()` Does:

1. ✅ Returns item at index
2. ✅ Supports negative indices
3. ✅ Returns undefined if out of bounds
4. ✅ Works like array at()
5. ✅ Clean syntax

### When to Use It:

- Index-based access
- Negative index access
- Carousel navigation
- Gallery systems
- History tracking

### The Basic Pattern:

```javascript
const collection = ReactiveUtils.collection([1, 2, 3, 4, 5]);

// Positive index
console.log(collection.at(0)); // 1 (first)
console.log(collection.at(2)); // 3 (third)

// Negative index
console.log(collection.at(-1)); // 5 (last)
console.log(collection.at(-2)); // 4 (second last)
```

---

**Remember:** `at()` is perfect for flexible index access, especially with negative indices! 🎉
