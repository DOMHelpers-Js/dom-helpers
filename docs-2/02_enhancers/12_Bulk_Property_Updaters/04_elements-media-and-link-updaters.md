[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Elements Media & Link Updaters — .src(), .href(), .alt()

## Quick Start (30 seconds)

```javascript
// Update image sources
Elements.src({
  profilePic: "images/user.jpg",
  bannerImage: "images/banner.png"
});

// Update link destinations
Elements.href({
  homeLink: "/home",
  profileLink: "/profile/123"
});

// Update alt text for accessibility
Elements.alt({
  profilePic: "User profile photo",
  bannerImage: "Summer sale banner"
});
```

---

## What Are These Methods?

These three methods handle **media sources, link destinations, and accessibility text** across multiple elements in one call:

| Method | Property | Typical Elements |
|--------|----------|-----------------|
| `.src()` | `src` | `<img>`, `<video>`, `<audio>`, `<iframe>`, `<source>` |
| `.href()` | `href` | `<a>`, `<link>` |
| `.alt()` | `alt` | `<img>` |

---

## Syntax

```javascript
Elements.src(updates)    // Returns Elements (chainable)
Elements.href(updates)   // Returns Elements (chainable)
Elements.alt(updates)    // Returns Elements (chainable)
```

All take an object where keys are element IDs and values are the new string values.

---

## .src() — Update Media Sources

Sets the `src` property on elements like images, videos, and iframes:

```javascript
Elements.src({
  profilePic: "images/user.jpg",
  bannerImage: "images/banner.png",
  videoFrame: "videos/intro.mp4"
});
```

### Swapping Images

```javascript
function setThemeImages(theme) {
  if (theme === 'dark') {
    Elements.src({
      logo: "images/logo-white.svg",
      heroImage: "images/hero-dark.jpg",
      bgPattern: "images/pattern-dark.png"
    });
  } else {
    Elements.src({
      logo: "images/logo-black.svg",
      heroImage: "images/hero-light.jpg",
      bgPattern: "images/pattern-light.png"
    });
  }
}
```

### Loading User Avatars

```javascript
function loadUserProfiles(users) {
  const srcUpdates = {};
  users.forEach(user => {
    srcUpdates[`avatar_${user.id}`] = user.avatarUrl;
  });
  Elements.src(srcUpdates);
}
```

---

## .href() — Update Link Destinations

Sets the `href` property on anchor (`<a>`) elements:

```javascript
Elements.href({
  homeLink: "/home",
  profileLink: "/profile/123",
  logoutLink: "/logout"
});
```

### Dynamic Navigation Links

```javascript
function updateNavForUser(user) {
  Elements.href({
    profileLink: `/users/${user.id}`,
    settingsLink: `/users/${user.id}/settings`,
    dashboardLink: `/dashboard`
  });
}
```

### External Links

```javascript
Elements.href({
  docsLink: "https://docs.example.com",
  supportLink: "https://support.example.com",
  githubLink: "https://github.com/myproject"
});
```

---

## .alt() — Update Alt Text

Sets the `alt` attribute on images for **accessibility**. Screen readers use this text to describe images to users who can't see them:

```javascript
Elements.alt({
  logo: "Company Logo",
  heroImage: "Hero banner showing summer products",
  teamPhoto: "The development team at the annual meetup"
});
```

### Descriptive Alt Text

```javascript
function updateProductImages(product) {
  Elements.src({
    productMain: product.imageUrl,
    productThumb: product.thumbnailUrl
  });

  // Always update alt text when changing images
  Elements.alt({
    productMain: `${product.name} - ${product.description}`,
    productThumb: `${product.name} thumbnail`
  });
}
```

---

## Real-World Examples

### Example 1: Image Gallery

```javascript
function showGalleryImage(index, gallery) {
  const image = gallery[index];

  Elements.src({ mainImage: image.url });
  Elements.alt({ mainImage: image.caption });

  // Update navigation links
  Elements.href({
    prevLink: index > 0 ? `#image-${index - 1}` : "#",
    nextLink: index < gallery.length - 1 ? `#image-${index + 1}` : "#"
  });
}
```

### Example 2: User Profile Card

```javascript
function renderProfileCard(user) {
  Elements.src({
    userAvatar: user.photo || "images/default-avatar.png"
  });

  Elements.alt({
    userAvatar: `${user.name}'s profile photo`
  });

  Elements.href({
    userProfile: `/users/${user.id}`,
    userEmail: `mailto:${user.email}`
  });

  Elements.textContent({
    userName: user.name,
    userBio: user.bio
  });
}
```

### Example 3: Media Player

```javascript
function loadTrack(track) {
  Elements.src({
    audioPlayer: track.audioUrl,
    albumArt: track.coverUrl
  });

  Elements.alt({
    albumArt: `Album cover for ${track.album}`
  });

  Elements.textContent({
    trackTitle: track.title,
    trackArtist: track.artist
  });
}
```

---

## Chaining with Other Methods

```javascript
Elements
  .src({ productImage: "images/widget.jpg" })
  .alt({ productImage: "Blue Widget - Premium Edition" })
  .title({ productImage: "Click to enlarge" })
  .style({ productImage: { border: "2px solid #333" } });
```

---

## Summary

| Method | Property | Use Case |
|--------|----------|---------|
| `.src()` | `src` | Images, videos, iframes — media sources |
| `.href()` | `href` | Links — navigation destinations |
| `.alt()` | `alt` | Images — accessibility descriptions |

> **Simple Rule to Remember:** `.src()` sets where media comes from, `.href()` sets where links go, `.alt()` describes what images show. When changing images with `.src()`, always update `.alt()` too for accessibility.