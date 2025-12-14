# Understanding `destroy()` (Builder) - A Beginner's Guide

## What is `destroy()`?

`destroy()` is a builder method that adds a cleanup/destroy method to your built state. It's different from `$destroy()` - this one you define yourself.

Think of it as **custom cleanup builder** - define your own cleanup logic.

---

## Why Does This Exist?

### The Problem: Custom Cleanup Logic

Sometimes you need custom cleanup beyond the built-in `$destroy()`:

```javascript
// ❌ Without builder - add manually
const state = ReactiveUtils.state({ connection: null });

state.destroy = function() {
  if (this.connection) {
    this.connection.close();
  }
  this.$destroy();
};

// ✅ With builder - define upfront
const state = ReactiveUtils.builder()
  .state({ connection: null })
  .destroy(function() {
    if (this.connection) {
      this.connection.close();
    }
  })
  .build();
```

**Why this matters:**
- Custom cleanup logic
- Define upfront
- Cleaner organization
- Built-in pattern

---

## How Does It Work?

### The Builder Chain

```javascript
ReactiveUtils.builder()
  .state({ resource: null })
  .destroy(function() {
    // Custom cleanup
    this.resource?.close();
  })
  .build();
```

---

## Basic Usage

### Simple Cleanup

```javascript
const state = ReactiveUtils.builder()
  .state({ timer: null })
  .destroy(function() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  })
  .build();

state.timer = setInterval(() => {}, 1000);

// Later
state.destroy(); // Clears timer
```

### Multiple Cleanups

```javascript
const state = ReactiveUtils.builder()
  .state({
    subscription: null,
    connection: null
  })
  .destroy(function() {
    this.subscription?.unsubscribe();
    this.connection?.close();
  })
  .build();
```

---

## Simple Examples Explained

### Example 1: WebSocket Connection

```javascript
const chat = ReactiveUtils.builder()
  .state({
    socket: null,
    messages: [],
    connected: false
  })
  .actions({
    connect(url) {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        this.connected = true;
      };

      this.socket.onmessage = (event) => {
        this.messages.push(JSON.parse(event.data));
      };

      this.socket.onclose = () => {
        this.connected = false;
      };
    },

    send(message) {
      if (this.socket && this.connected) {
        this.socket.send(JSON.stringify(message));
      }
    }
  })
  .destroy(function() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  })
  .build();

chat.connect('ws://localhost:8080');

// Later, cleanup
chat.destroy(); // Closes WebSocket
```

---

### Example 2: Event Listeners

```javascript
const interactive = ReactiveUtils.builder()
  .state({
    x: 0,
    y: 0,
    listeners: []
  })
  .actions({
    init() {
      const handleMove = (e) => {
        this.x = e.clientX;
        this.y = e.clientY;
      };

      const handleClick = () => {
        console.log(`Clicked at ${this.x}, ${this.y}`);
      };

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('click', handleClick);

      // Store for cleanup
      this.listeners = [
        { type: 'mousemove', handler: handleMove },
        { type: 'click', handler: handleClick }
      ];
    }
  })
  .destroy(function() {
    this.listeners.forEach(({ type, handler }) => {
      document.removeEventListener(type, handler);
    });
    this.listeners = [];
  })
  .build();

interactive.init();

// Later
interactive.destroy(); // Removes all listeners
```

---

### Example 3: Animation Loop

```javascript
const animator = ReactiveUtils.builder()
  .state({
    position: 0,
    animationId: null,
    running: false
  })
  .actions({
    start() {
      if (this.running) return;

      this.running = true;
      const animate = () => {
        this.position += 1;
        if (this.running) {
          this.animationId = requestAnimationFrame(animate);
        }
      };
      animate();
    },

    stop() {
      this.running = false;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }
  })
  .destroy(function() {
    this.stop();
  })
  .build();

animator.start();

// Later
animator.destroy(); // Stops animation
```

---

## Real-World Example: Media Player

```javascript
const player = ReactiveUtils.builder()
  .state({
    audio: null,
    playing: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    updateInterval: null
  })
  .actions({
    load(url) {
      this.audio = new Audio(url);

      this.audio.addEventListener('loadedmetadata', () => {
        this.duration = this.audio.duration;
      });

      this.audio.addEventListener('ended', () => {
        this.playing = false;
        this.stop();
      });
    },

    play() {
      if (this.audio) {
        this.audio.play();
        this.playing = true;

        // Update current time
        this.updateInterval = setInterval(() => {
          if (this.audio) {
            this.currentTime = this.audio.currentTime;
          }
        }, 100);
      }
    },

    pause() {
      if (this.audio) {
        this.audio.pause();
        this.playing = false;
        this.stop();
      }
    },

    stop() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      }
    },

    seek(time) {
      if (this.audio) {
        this.audio.currentTime = time;
        this.currentTime = time;
      }
    },

    setVolume(vol) {
      this.volume = Math.max(0, Math.min(1, vol));
      if (this.audio) {
        this.audio.volume = this.volume;
      }
    }
  })
  .destroy(function() {
    this.stop();

    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
  })
  .build();

// Usage
player.load('song.mp3');
player.play();

// Later, cleanup
player.destroy(); // Stops playback, clears resources
```

---

## Common Patterns

### Pattern 1: Clear Timers

```javascript
.destroy(function() {
  clearInterval(this.interval);
  clearTimeout(this.timeout);
})
```

### Pattern 2: Close Connections

```javascript
.destroy(function() {
  this.socket?.close();
  this.connection?.disconnect();
})
```

### Pattern 3: Remove Listeners

```javascript
.destroy(function() {
  this.listeners.forEach(remove);
  this.listeners = [];
})
```

### Pattern 4: Stop Animations

```javascript
.destroy(function() {
  cancelAnimationFrame(this.animId);
  this.running = false;
})
```

---

## Common Questions

### Q: What's the difference from `$destroy()`?

**Answer:**

- **`destroy()`** (builder) = Your custom cleanup
- **`$destroy()`** (built-in) = Framework cleanup

```javascript
const state = ReactiveUtils.builder()
  .destroy(function() {
    // Your cleanup
    this.socket?.close();
  })
  .build();

state.destroy(); // Calls your custom cleanup
state.$destroy(); // Calls framework cleanup
```

### Q: Should I call `$destroy()` in my `destroy()`?

**Answer:** Usually yes, for complete cleanup:

```javascript
.destroy(function() {
  // Custom cleanup
  this.socket?.close();

  // Then framework cleanup
  this.$destroy();
})
```

### Q: Do I need both?

**Answer:** Only if you have custom resources:

```javascript
// No custom resources - just use $destroy()
state.$destroy();

// With custom resources - define destroy()
.destroy(function() {
  this.connection.close();
  this.$destroy();
})
```

---

## Tips for Success

### 1. Clean Up All Resources

```javascript
// ✅ Complete cleanup
.destroy(function() {
  clearInterval(this.timer);
  this.socket?.close();
  this.listeners.forEach(remove);
  this.$destroy();
})
```

### 2. Use Regular Functions

```javascript
// ✅ Regular function
.destroy(function() {
  this.cleanup();
})

// ❌ Arrow function - 'this' won't work
.destroy(() => {
  this.cleanup(); // Wrong 'this'!
})
```

### 3. Check Before Cleanup

```javascript
// ✅ Safe cleanup
.destroy(function() {
  if (this.socket) {
    this.socket.close();
  }
})
```

### 4. Clear References

```javascript
// ✅ Clear references
.destroy(function() {
  this.socket?.close();
  this.socket = null; // Clear reference
})
```

---

## Summary

### What `destroy()` Does:

1. ✅ Adds custom destroy method
2. ✅ Takes cleanup function
3. ✅ Called when destroying state
4. ✅ For your custom resources
5. ✅ Should often call `$destroy()` too

### When to Use It:

- Custom resource cleanup
- Timers/intervals
- Event listeners
- Network connections
- Animation frames

### The Basic Pattern:

```javascript
const state = ReactiveUtils.builder()
  .state({ timer: null })
  .destroy(function() {
    // Custom cleanup
    if (this.timer) {
      clearInterval(this.timer);
    }

    // Framework cleanup
    this.$destroy();
  })
  .build();

// Later
state.destroy(); // Calls your cleanup
```

---

**Remember:** `destroy()` (builder) is for YOUR custom cleanup. Don't confuse it with `$destroy()` (built-in). Use regular functions, not arrow functions! 🎉
