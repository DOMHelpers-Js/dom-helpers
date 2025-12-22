# computed()

Add multiple cached computed properties to reactive state objects.

## Quick Start (30 seconds)

```javascript
import { state, computed } from './state.js';

// Create state
const cart = state({
  items: [
    { name: 'Laptop', price: 999, qty: 1 },
    { name: 'Mouse', price: 29, qty: 2 }
  ],
  taxRate: 0.08
});

// Add computed properties
computed(cart, {
  subtotal: s => s.items.reduce((sum, item) => sum + item.price * item.qty, 0),
  tax: s => s.subtotal * s.taxRate,
  total: s => s.subtotal + s.tax
});

console.log(cart.total);  // 1121.36
cart.items[0].qty = 2;
console.log(cart.total);  // 2120.36 (auto-updated!)
```

**That's it!** You just added three computed properties that automatically recalculate when dependencies change.

---

## Mental Model: Smart Spreadsheet with Auto-Calculating Formulas

Think of `computed()` like **Excel formulas**:

```
Regular State          →  Data Cells (you type values)
Computed Properties    →  Formula Cells (=SUM(A1:A10))
Dependency Tracking    →  Auto-recalculation
Caching                →  Only recalc when inputs change
```

**Just like Excel:**
- You define formulas once
- They auto-update when referenced cells change
- They don't recalculate unnecessarily
- You can reference other formula cells

**Key difference:** `computed()` adds multiple formulas at once, while `$computed()` adds one at a time.

---

## What is computed()?

`computed()` is a **standalone utility function** that adds multiple cached computed properties to a reactive state object in a single call.

```javascript
import { computed } from './state.js';

const enhancedState = computed(stateObject, {
  propName1: (state) => /* calculation */,
  propName2: (state) => /* calculation */,
  // ... more computed properties
});
```

### computed() vs $computed()

```
┌─────────────────────────────────────────────────────────────┐
│                   TWO WAYS TO ADD COMPUTEDS                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  METHOD STYLE: $computed()                                  │
│  ────────────────────────────────────────────              │
│  const user = state({ firstName: 'John', lastName: 'Doe' });│
│  user.$computed('fullName', s => `${s.firstName} ${s.lastName}`);│
│  user.$computed('initials', s => s.firstName[0] + s.lastName[0]);│
│                                                             │
│  ✓ Adds one property at a time                             │
│  ✓ Method chaining style                                   │
│  ✓ Good for single computeds                               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  STANDALONE STYLE: computed()                               │
│  ────────────────────────────────────────────              │
│  const user = state({ firstName: 'John', lastName: 'Doe' });│
│  computed(user, {                                           │
│    fullName: s => `${s.firstName} ${s.lastName}`,          │
│    initials: s => s.firstName[0] + s.lastName[0]           │
│  });                                                        │
│                                                             │
│  ✓ Adds multiple properties at once                        │
│  ✓ Object-based configuration                              │
│  ✓ Good for batches of computeds                           │
│  ✓ Cleaner for complex setups                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Both approaches:**
- Create the same reactive computed properties
- Use automatic dependency tracking
- Cache results until dependencies change
- Can reference other computed properties

**Choose based on style preference:**
- Use `$computed()` for one-at-a-time, fluent API style
- Use `computed()` for batch setup, configuration-driven style

---

## Manual Approach vs computed()

### ❌ Without computed() - Manual Calculations

```javascript
const cart = state({
  items: [
    { name: 'Laptop', price: 999, qty: 1 },
    { name: 'Mouse', price: 29, qty: 2 }
  ],
  taxRate: 0.08
});

// Manually calculate every time
function getSubtotal() {
  return cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getTax() {
  return getSubtotal() * cart.taxRate;
}

function getTotal() {
  return getSubtotal() + getTax();
}

// Must call functions everywhere
console.log(getTotal());  // 1121.36

// Update
cart.items[0].qty = 2;

// Must remember to recalculate
console.log(getTotal());  // 2120.36

// Problems:
// - Must call functions manually
// - Calculations run every time (no caching)
// - Verbose and error-prone
// - No automatic updates
```

### ✅ With computed() - Automatic Cached Properties

```javascript
const cart = state({
  items: [
    { name: 'Laptop', price: 999, qty: 1 },
    { name: 'Mouse', price: 29, qty: 2 }
  ],
  taxRate: 0.08
});

// Define all computeds at once
computed(cart, {
  subtotal: s => s.items.reduce((sum, item) => sum + item.price * item.qty, 0),
  tax: s => s.subtotal * s.taxRate,
  total: s => s.subtotal + s.tax
});

// Use like regular properties
console.log(cart.total);  // 1121.36 (automatically calculated)

// Update
cart.items[0].qty = 2;

// Automatically recalculated
console.log(cart.total);  // 2120.36

// Benefits:
// ✓ Property access (no function calls)
// ✓ Automatic caching
// ✓ Auto-updates on changes
// ✓ Clean, declarative setup
// ✓ Can reference other computeds
```

---

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPUTED() WORKFLOW                      │
└─────────────────────────────────────────────────────────────┘

1. SETUP PHASE
   ────────────────────────────────────────────────────────
   computed(state, {
     computed1: s => s.a + s.b,
     computed2: s => s.computed1 * 2
   })

   → Adds computed properties to state object
   → Sets up dependency tracking
   → Returns enhanced state object

2. FIRST ACCESS
   ────────────────────────────────────────────────────────
   console.log(state.computed1)

   → Getter function runs
   → Dependencies tracked: state.a, state.b
   → Result cached: { value: <result>, deps: [a, b] }
   → Returns cached value

3. DEPENDENCY CHANGES
   ────────────────────────────────────────────────────────
   state.a = 10

   → Change detected in tracked dependency
   → Cache invalidated for computed1
   → Cache invalidated for computed2 (depends on computed1)
   → Next access will recalculate

4. SUBSEQUENT ACCESS
   ────────────────────────────────────────────────────────
   console.log(state.computed1)

   If dependencies unchanged:
     → Returns cached value (fast!)

   If dependencies changed:
     → Recalculates value
     → Updates cache
     → Returns new value

┌─────────────────────────────────────────────────────────────┐
│                     CACHING STRATEGY                        │
└─────────────────────────────────────────────────────────────┘

  Access #1    Access #2    Access #3    Access #4
     ↓            ↓            ↓            ↓
  [CALC]      [CACHED]     [CACHED]     [CACHED]
     ↓            ↓            ↓            ↓
  deps: []    no change    no change    no change

     └──→ state.a = 10 ───→ [CALC] ─────→ [CACHED]
                              ↓              ↓
                          deps: [a]      no change
```

---

## Common Use Cases

### 1. Shopping Cart Calculations

```javascript
const cart = state({
  items: [
    { name: 'Laptop', price: 999, qty: 1 },
    { name: 'Mouse', price: 29, qty: 2 },
    { name: 'Keyboard', price: 79, qty: 1 }
  ],
  taxRate: 0.08,
  shippingRate: 15,
  discountCode: null
});

computed(cart, {
  // Item count
  itemCount: s => s.items.reduce((sum, item) => sum + item.qty, 0),

  // Subtotal
  subtotal: s => s.items.reduce((sum, item) => sum + item.price * item.qty, 0),

  // Discount amount
  discountAmount: s => {
    if (s.discountCode === 'SAVE20') return s.subtotal * 0.2;
    if (s.discountCode === 'SAVE10') return s.subtotal * 0.1;
    return 0;
  },

  // After discount
  afterDiscount: s => s.subtotal - s.discountAmount,

  // Free shipping threshold
  qualifiesForFreeShipping: s => s.afterDiscount >= 100,

  // Shipping cost
  shipping: s => s.qualifiesForFreeShipping ? 0 : s.shippingRate,

  // Tax
  tax: s => s.afterDiscount * s.taxRate,

  // Final total
  total: s => s.afterDiscount + s.shipping + s.tax
});

console.log(cart.total);  // 1172.8
console.log(cart.itemCount);  // 4

cart.discountCode = 'SAVE20';
console.log(cart.total);  // 924.48 (20% off!)
console.log(cart.qualifiesForFreeShipping);  // true
```

### 2. Form Validation

```javascript
const form = state({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreedToTerms: false
});

computed(form, {
  // Individual field validations
  usernameValid: s => s.username.length >= 3,

  emailValid: s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email),

  passwordValid: s => s.password.length >= 8,

  passwordsMatch: s => s.password === s.confirmPassword && s.password.length > 0,

  // Overall validity
  isValid: s =>
    s.usernameValid &&
    s.emailValid &&
    s.passwordValid &&
    s.passwordsMatch &&
    s.agreedToTerms,

  // Error messages
  errors: s => {
    const errors = [];
    if (!s.usernameValid && s.username.length > 0) {
      errors.push('Username must be at least 3 characters');
    }
    if (!s.emailValid && s.email.length > 0) {
      errors.push('Invalid email address');
    }
    if (!s.passwordValid && s.password.length > 0) {
      errors.push('Password must be at least 8 characters');
    }
    if (!s.passwordsMatch && s.confirmPassword.length > 0) {
      errors.push('Passwords do not match');
    }
    return errors;
  }
});

// Use in UI
form.username = 'jo';
console.log(form.usernameValid);  // false
console.log(form.errors);  // ['Username must be at least 3 characters']

form.username = 'john';
console.log(form.usernameValid);  // true
console.log(form.errors);  // []
```

### 3. User Profile Status

```javascript
const user = state({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  avatar: null,
  bio: '',
  followers: 150,
  following: 200,
  posts: 42,
  verified: false,
  premium: true,
  lastActive: Date.now()
});

computed(user, {
  // Display name
  fullName: s => `${s.firstName} ${s.lastName}`,

  // Initials for avatar fallback
  initials: s => s.firstName[0] + s.lastName[0],

  // Profile completeness
  hasAvatar: s => s.avatar !== null,
  hasBio: s => s.bio.length > 0,
  profileComplete: s => s.hasAvatar && s.hasBio && s.verified,

  // Social metrics
  followerRatio: s => s.followers / s.following,
  isPopular: s => s.followers > 1000,
  isActive: s => Date.now() - s.lastActive < 7 * 24 * 60 * 60 * 1000, // 7 days

  // Badge system
  badges: s => {
    const badges = [];
    if (s.verified) badges.push('✓ Verified');
    if (s.premium) badges.push('⭐ Premium');
    if (s.isPopular) badges.push('🔥 Popular');
    if (s.posts > 100) badges.push('📝 Prolific');
    return badges;
  },

  // Profile summary
  summary: s => `${s.fullName} (${s.badges.join(', ')})`
});

console.log(user.fullName);  // "John Doe"
console.log(user.badges);  // ['✓ Verified', '⭐ Premium']
console.log(user.summary);  // "John Doe (✓ Verified, ⭐ Premium)"

user.followers = 1500;
console.log(user.badges);  // ['✓ Verified', '⭐ Premium', '🔥 Popular']
```

### 4. Analytics Dashboard

```javascript
const analytics = state({
  pageViews: [120, 150, 180, 200, 190, 220, 250],
  uniqueVisitors: [80, 95, 110, 125, 115, 135, 155],
  bounceRate: [0.45, 0.42, 0.38, 0.35, 0.40, 0.33, 0.30],
  conversionRate: [0.02, 0.025, 0.03, 0.028, 0.032, 0.035, 0.04],
  revenue: [450, 520, 680, 590, 720, 840, 960]
});

computed(analytics, {
  // Current period
  currentPageViews: s => s.pageViews[s.pageViews.length - 1],
  currentRevenue: s => s.revenue[s.revenue.length - 1],

  // Previous period
  previousPageViews: s => s.pageViews[s.pageViews.length - 2],
  previousRevenue: s => s.revenue[s.revenue.length - 2],

  // Totals
  totalPageViews: s => s.pageViews.reduce((sum, v) => sum + v, 0),
  totalRevenue: s => s.revenue.reduce((sum, v) => sum + v, 0),

  // Averages
  avgPageViews: s => s.totalPageViews / s.pageViews.length,
  avgRevenue: s => s.totalRevenue / s.revenue.length,

  // Growth rates
  pageViewGrowth: s =>
    ((s.currentPageViews - s.previousPageViews) / s.previousPageViews * 100).toFixed(1),
  revenueGrowth: s =>
    ((s.currentRevenue - s.previousRevenue) / s.previousRevenue * 100).toFixed(1),

  // Trends
  pageViewTrend: s => s.pageViewGrowth > 0 ? 'up' : 'down',
  revenueTrend: s => s.revenueGrowth > 0 ? 'up' : 'down',

  // Performance summary
  performanceSummary: s => ({
    views: { current: s.currentPageViews, growth: s.pageViewGrowth, trend: s.pageViewTrend },
    revenue: { current: s.currentRevenue, growth: s.revenueGrowth, trend: s.revenueTrend },
    avgConversion: (s.conversionRate.reduce((sum, v) => sum + v, 0) / s.conversionRate.length * 100).toFixed(2)
  })
});

console.log(analytics.pageViewGrowth);  // "13.6"
console.log(analytics.revenueGrowth);  // "14.3"
console.log(analytics.performanceSummary);
// {
//   views: { current: 250, growth: "13.6", trend: "up" },
//   revenue: { current: 960, growth: "14.3", trend: "up" },
//   avgConversion: "3.03"
// }
```

### 5. Game Score System

```javascript
const game = state({
  level: 1,
  score: 0,
  kills: 0,
  deaths: 0,
  assists: 0,
  hits: 0,
  misses: 0,
  timePlayed: 0, // seconds
  coinsCollected: 0,
  powerupsUsed: 0
});

computed(game, {
  // K/D ratio
  kdr: s => s.deaths === 0 ? s.kills : (s.kills / s.deaths).toFixed(2),

  // Accuracy
  accuracy: s => {
    const total = s.hits + s.misses;
    return total === 0 ? 0 : (s.hits / total * 100).toFixed(1);
  },

  // Performance rating
  performanceRating: s => {
    const kdScore = parseFloat(s.kdr) * 100;
    const accuracyScore = parseFloat(s.accuracy);
    const assistScore = s.assists * 10;
    return Math.round(kdScore + accuracyScore + assistScore);
  },

  // Rank based on performance
  rank: s => {
    if (s.performanceRating >= 1000) return 'Legendary';
    if (s.performanceRating >= 750) return 'Master';
    if (s.performanceRating >= 500) return 'Expert';
    if (s.performanceRating >= 250) return 'Intermediate';
    return 'Beginner';
  },

  // Time formatted
  timeFormatted: s => {
    const hours = Math.floor(s.timePlayed / 3600);
    const minutes = Math.floor((s.timePlayed % 3600) / 60);
    const seconds = s.timePlayed % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  },

  // Score per minute
  scorePerMinute: s => {
    const minutes = s.timePlayed / 60;
    return minutes === 0 ? 0 : Math.round(s.score / minutes);
  },

  // Next level progress
  scoreNeededForNextLevel: s => s.level * 1000,
  progressToNextLevel: s => (s.score / s.scoreNeededForNextLevel * 100).toFixed(1),

  // Overall stats summary
  statsSummary: s => `${s.rank} | K/D: ${s.kdr} | Acc: ${s.accuracy}% | Score/min: ${s.scorePerMinute}`
});

game.kills = 25;
game.deaths = 10;
game.hits = 180;
game.misses = 20;
game.assists = 15;
game.score = 3500;
game.timePlayed = 1200; // 20 minutes

console.log(game.kdr);  // "2.50"
console.log(game.accuracy);  // "90.0"
console.log(game.rank);  // "Expert"
console.log(game.statsSummary);  // "Expert | K/D: 2.50 | Acc: 90.0% | Score/min: 175"
```

### 6. Weather Dashboard

```javascript
const weather = state({
  tempCelsius: 22,
  humidity: 65,
  windSpeedKmh: 15,
  pressure: 1013,
  visibility: 10,
  uvIndex: 6,
  precipitationMm: 0
});

computed(weather, {
  // Temperature conversions
  tempFahrenheit: s => (s.tempCelsius * 9/5 + 32).toFixed(1),
  tempKelvin: s => (s.tempCelsius + 273.15).toFixed(1),

  // Wind speed conversions
  windSpeedMph: s => (s.windSpeedKmh * 0.621371).toFixed(1),
  windSpeedMs: s => (s.windSpeedKmh / 3.6).toFixed(1),

  // Comfort indices
  heatIndex: s => {
    const T = s.tempFahrenheit;
    const RH = s.humidity;
    const HI = -42.379 + 2.04901523*T + 10.14333127*RH - 0.22475541*T*RH;
    return HI.toFixed(1);
  },

  // Conditions
  isHumid: s => s.humidity > 70,
  isWindy: s => s.windSpeedKmh > 25,
  isRaining: s => s.precipitationMm > 0,

  // UV warnings
  uvWarning: s => {
    if (s.uvIndex >= 11) return 'Extreme - Avoid sun exposure';
    if (s.uvIndex >= 8) return 'Very High - Extra protection needed';
    if (s.uvIndex >= 6) return 'High - Protection required';
    if (s.uvIndex >= 3) return 'Moderate - Some protection needed';
    return 'Low - Minimal protection';
  },

  // Overall conditions
  conditions: s => {
    const conditions = [];
    if (s.isRaining) conditions.push('Rainy');
    if (s.isWindy) conditions.push('Windy');
    if (s.isHumid) conditions.push('Humid');
    return conditions.length > 0 ? conditions.join(', ') : 'Clear';
  },

  // Weather summary
  summary: s => `${s.tempCelsius}°C (${s.tempFahrenheit}°F), ${s.conditions}, UV: ${s.uvIndex}`
});

console.log(weather.tempFahrenheit);  // "71.6"
console.log(weather.uvWarning);  // "High - Protection required"
console.log(weather.summary);  // "22°C (71.6°F), Clear, UV: 6"

weather.humidity = 75;
weather.windSpeedKmh = 30;
console.log(weather.conditions);  // "Windy, Humid"
```

### 7. File Upload Manager

```javascript
const upload = state({
  files: [
    { name: 'doc.pdf', size: 2048000, uploaded: 1024000 },
    { name: 'image.jpg', size: 5120000, uploaded: 5120000 },
    { name: 'video.mp4', size: 10240000, uploaded: 2560000 }
  ],
  maxFileSize: 10485760, // 10 MB
  allowedTypes: ['pdf', 'jpg', 'png', 'mp4'],
  connectionSpeed: 1048576 // bytes per second
});

computed(upload, {
  // File count and status
  totalFiles: s => s.files.length,

  completedFiles: s => s.files.filter(f => f.uploaded === f.size).length,

  pendingFiles: s => s.files.filter(f => f.uploaded < f.size).length,

  // Size calculations
  totalSize: s => s.files.reduce((sum, f) => sum + f.size, 0),

  uploadedSize: s => s.files.reduce((sum, f) => sum + f.uploaded, 0),

  remainingSize: s => s.totalSize - s.uploadedSize,

  // Progress
  overallProgress: s => (s.uploadedSize / s.totalSize * 100).toFixed(1),

  // Time estimates
  estimatedTimeRemaining: s => {
    const seconds = s.remainingSize / s.connectionSpeed;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes}m ${secs}s`;
  },

  // Validation
  hasOversizedFiles: s => s.files.some(f => f.size > s.maxFileSize),

  oversizedFiles: s => s.files
    .filter(f => f.size > s.maxFileSize)
    .map(f => f.name),

  // Formatting helpers
  totalSizeFormatted: s => {
    const mb = s.totalSize / 1048576;
    return `${mb.toFixed(2)} MB`;
  },

  // Status summary
  statusSummary: s =>
    `${s.completedFiles}/${s.totalFiles} complete (${s.overallProgress}%) - ${s.estimatedTimeRemaining} remaining`
});

console.log(upload.overallProgress);  // "43.9"
console.log(upload.statusSummary);
// "1/3 complete (43.9%) - 2m 27s remaining"
console.log(upload.totalSizeFormatted);  // "16.62 MB"

// Simulate upload progress
upload.files[0].uploaded = 2048000;
console.log(upload.overallProgress);  // "55.1"
```

### 8. Subscription Management

```javascript
const subscription = state({
  planType: 'pro', // 'free', 'pro', 'enterprise'
  billingCycle: 'monthly', // 'monthly', 'annual'
  startDate: new Date('2024-01-01'),
  users: 5,
  storageUsedGB: 45,
  apiCallsThisMonth: 8500
});

computed(subscription, {
  // Plan limits
  maxUsers: s => {
    if (s.planType === 'free') return 1;
    if (s.planType === 'pro') return 10;
    return 100; // enterprise
  },

  maxStorageGB: s => {
    if (s.planType === 'free') return 5;
    if (s.planType === 'pro') return 100;
    return 1000; // enterprise
  },

  maxApiCalls: s => {
    if (s.planType === 'free') return 1000;
    if (s.planType === 'pro') return 10000;
    return 100000; // enterprise
  },

  // Usage percentages
  userUsagePercent: s => (s.users / s.maxUsers * 100).toFixed(1),
  storageUsagePercent: s => (s.storageUsedGB / s.maxStorageGB * 100).toFixed(1),
  apiUsagePercent: s => (s.apiCallsThisMonth / s.maxApiCalls * 100).toFixed(1),

  // Warnings
  isNearUserLimit: s => s.users >= s.maxUsers * 0.8,
  isNearStorageLimit: s => s.storageUsedGB >= s.maxStorageGB * 0.8,
  isNearApiLimit: s => s.apiCallsThisMonth >= s.maxApiCalls * 0.8,

  // Pricing
  basePriceMonthly: s => {
    if (s.planType === 'free') return 0;
    if (s.planType === 'pro') return 29;
    return 99; // enterprise
  },

  discount: s => s.billingCycle === 'annual' ? 0.2 : 0,

  pricePerMonth: s => s.basePriceMonthly * (1 - s.discount),

  pricePerYear: s => s.pricePerMonth * 12,

  savingsWithAnnual: s => (s.basePriceMonthly * 12) - s.pricePerYear,

  // Subscription status
  daysActive: s => Math.floor((Date.now() - s.startDate) / (1000 * 60 * 60 * 24)),

  // Summary
  usageSummary: s => ({
    users: `${s.users}/${s.maxUsers} (${s.userUsagePercent}%)`,
    storage: `${s.storageUsedGB}/${s.maxStorageGB} GB (${s.storageUsagePercent}%)`,
    api: `${s.apiCallsThisMonth}/${s.maxApiCalls} (${s.apiUsagePercent}%)`
  })
});

console.log(subscription.pricePerMonth);  // 29
console.log(subscription.usageSummary);
// {
//   users: "5/10 (50.0%)",
//   storage: "45/100 GB (45.0%)",
//   api: "8500/10000 (85.0%)"
// }
console.log(subscription.isNearApiLimit);  // true

subscription.billingCycle = 'annual';
console.log(subscription.pricePerMonth);  // 23.2
console.log(subscription.savingsWithAnnual);  // 69.6
```

---

## Advanced Patterns

### 1. Complex Nested Dependencies

```javascript
const business = state({
  revenue: 100000,
  costs: 60000,
  taxRate: 0.25,
  employees: 10,
  avgSalary: 50000
});

computed(business, {
  // Level 1: Basic calculations
  profit: s => s.revenue - s.costs,
  totalSalaries: s => s.employees * s.avgSalary,

  // Level 2: Depends on Level 1
  profitMargin: s => (s.profit / s.revenue * 100).toFixed(2),
  taxAmount: s => s.profit * s.taxRate,

  // Level 3: Depends on Level 2
  netProfit: s => s.profit - s.taxAmount,
  netProfitMargin: s => (s.netProfit / s.revenue * 100).toFixed(2),

  // Level 4: Complex cross-dependencies
  profitPerEmployee: s => s.netProfit / s.employees,
  salaryToRevenueRatio: s => (s.totalSalaries / s.revenue * 100).toFixed(2),

  // Level 5: Business intelligence
  financialHealth: s => {
    const margin = parseFloat(s.netProfitMargin);
    const salaryRatio = parseFloat(s.salaryToRevenueRatio);

    if (margin > 20 && salaryRatio < 40) return 'Excellent';
    if (margin > 10 && salaryRatio < 60) return 'Good';
    if (margin > 0) return 'Fair';
    return 'Poor';
  }
});

console.log(business.financialHealth);  // "Fair"
console.log(business.netProfitMargin);  // "30.00"

business.costs = 50000;
console.log(business.financialHealth);  // "Excellent"
```

### 2. Conditional Computed Logic

```javascript
const app = state({
  user: null,
  theme: 'light',
  language: 'en',
  isOnline: true,
  features: {
    darkMode: true,
    notifications: true,
    analytics: false
  }
});

computed(app, {
  // Conditional based on user state
  isAuthenticated: s => s.user !== null,

  userName: s => s.isAuthenticated ? s.user.name : 'Guest',

  userRole: s => s.isAuthenticated ? s.user.role : 'visitor',

  // Conditional based on features
  shouldShowNotifications: s =>
    s.features.notifications && s.isAuthenticated && s.isOnline,

  canAccessDarkMode: s =>
    s.features.darkMode && s.isAuthenticated,

  // Complex conditional logic
  availableFeatures: s => {
    const features = [];

    if (s.isAuthenticated) {
      features.push('Profile');
      features.push('Settings');

      if (s.userRole === 'admin') {
        features.push('Admin Panel');
        features.push('User Management');
      }

      if (s.features.analytics) {
        features.push('Analytics');
      }
    }

    if (s.canAccessDarkMode) {
      features.push('Dark Mode');
    }

    if (s.shouldShowNotifications) {
      features.push('Notifications');
    }

    return features;
  },

  // Status message with conditions
  statusMessage: s => {
    if (!s.isOnline) return 'You are offline';
    if (!s.isAuthenticated) return 'Please log in';
    return `Welcome, ${s.userName}!`;
  }
});

// Guest state
console.log(app.statusMessage);  // "Please log in"
console.log(app.availableFeatures);  // []

// Login
app.user = { name: 'Alice', role: 'admin' };
console.log(app.statusMessage);  // "Welcome, Alice!"
console.log(app.availableFeatures);
// ['Profile', 'Settings', 'Admin Panel', 'User Management', 'Dark Mode', 'Notifications']
```

### 3. Array and Collection Computeds

```javascript
const store = state({
  products: [
    { id: 1, name: 'Laptop', price: 999, category: 'Electronics', inStock: true, rating: 4.5 },
    { id: 2, name: 'Mouse', price: 29, category: 'Electronics', inStock: true, rating: 4.2 },
    { id: 3, name: 'Desk', price: 299, category: 'Furniture', inStock: false, rating: 4.8 },
    { id: 4, name: 'Chair', price: 199, category: 'Furniture', inStock: true, rating: 4.6 }
  ],
  filters: {
    category: null,
    minPrice: 0,
    maxPrice: Infinity,
    inStockOnly: false,
    minRating: 0
  }
});

computed(store, {
  // Filter products
  filteredProducts: s => s.products.filter(p => {
    if (s.filters.category && p.category !== s.filters.category) return false;
    if (p.price < s.filters.minPrice || p.price > s.filters.maxPrice) return false;
    if (s.filters.inStockOnly && !p.inStock) return false;
    if (p.rating < s.filters.minRating) return false;
    return true;
  }),

  // Aggregate computeds
  productCount: s => s.filteredProducts.length,

  totalValue: s => s.filteredProducts.reduce((sum, p) => sum + p.price, 0),

  avgPrice: s => s.productCount > 0 ? s.totalValue / s.productCount : 0,

  avgRating: s => {
    if (s.productCount === 0) return 0;
    const sum = s.filteredProducts.reduce((sum, p) => sum + p.rating, 0);
    return (sum / s.productCount).toFixed(2);
  },

  // Categorization
  categories: s => [...new Set(s.filteredProducts.map(p => p.category))],

  productsByCategory: s => {
    const grouped = {};
    s.filteredProducts.forEach(p => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });
    return grouped;
  },

  // Sorting
  topRatedProduct: s => {
    if (s.productCount === 0) return null;
    return s.filteredProducts.reduce((top, p) =>
      p.rating > top.rating ? p : top
    );
  },

  cheapestProduct: s => {
    if (s.productCount === 0) return null;
    return s.filteredProducts.reduce((cheap, p) =>
      p.price < cheap.price ? p : cheap
    );
  }
});

console.log(store.productCount);  // 4
console.log(store.avgPrice);  // 381.5

// Apply filters
store.filters.category = 'Electronics';
console.log(store.productCount);  // 2
console.log(store.avgPrice);  // 514

store.filters.inStockOnly = true;
console.log(store.productCount);  // 2
console.log(store.topRatedProduct.name);  // "Laptop"
```

### 4. Time-Based Computeds

```javascript
const event = state({
  startTime: new Date('2025-12-25T10:00:00'),
  duration: 120, // minutes
  now: Date.now()
});

// Update 'now' every second
setInterval(() => event.now = Date.now(), 1000);

computed(event, {
  // Calculate end time
  endTime: s => new Date(s.startTime.getTime() + s.duration * 60000),

  // Time until start
  timeUntilStart: s => s.startTime - s.now,

  // Time until end
  timeUntilEnd: s => s.endTime - s.now,

  // Status
  hasStarted: s => s.timeUntilStart <= 0,
  hasEnded: s => s.timeUntilEnd <= 0,
  isInProgress: s => s.hasStarted && !s.hasEnded,

  // Format time remaining
  formattedTimeUntilStart: s => {
    if (s.hasStarted) return 'Started';
    const ms = s.timeUntilStart;
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  },

  // Progress percentage
  progressPercent: s => {
    if (!s.hasStarted) return 0;
    if (s.hasEnded) return 100;
    const elapsed = s.now - s.startTime;
    const total = s.duration * 60000;
    return (elapsed / total * 100).toFixed(1);
  },

  // Status message
  status: s => {
    if (s.hasEnded) return 'Event ended';
    if (s.isInProgress) return `In progress (${s.progressPercent}%)`;
    return `Starts in ${s.formattedTimeUntilStart}`;
  }
});

console.log(event.status);  // "Starts in 2d 5h" (or similar)
console.log(event.formattedTimeUntilStart);  // "2d 5h"

// Live updates as 'now' changes every second
```

### 5. Memoization with External Data

```javascript
const api = state({
  userId: 123,
  cacheTimestamp: null,
  cachedData: null,
  cacheDuration: 5 * 60 * 1000 // 5 minutes
});

// External data source (simulated)
const fetchUserData = (userId) => {
  console.log(`Fetching data for user ${userId}...`);
  return { id: userId, name: 'John', email: 'john@example.com' };
};

computed(api, {
  // Check if cache is valid
  isCacheValid: s => {
    if (!s.cacheTimestamp) return false;
    return (Date.now() - s.cacheTimestamp) < s.cacheDuration;
  },

  // Get user data (with caching)
  userData: s => {
    // If cache is valid and userId matches, return cached data
    if (s.isCacheValid && s.cachedData?.id === s.userId) {
      return s.cachedData;
    }

    // Otherwise fetch new data
    const data = fetchUserData(s.userId);

    // Update cache (use effects in real app, this is for demo)
    setTimeout(() => {
      api.cachedData = data;
      api.cacheTimestamp = Date.now();
    }, 0);

    return data;
  },

  // Derived from cached data
  displayName: s => s.userData?.name || 'Loading...',
  userEmail: s => s.userData?.email || ''
});

console.log(api.displayName);  // "John" (fetches on first access)
console.log(api.displayName);  // "John" (uses cache)

// Change userId
api.userId = 456;
console.log(api.displayName);  // "John" (fetches new data for user 456)
```

### 6. Cross-State Computeds

```javascript
// Multiple related states
const cart = state({
  items: [
    { id: 1, productId: 101, qty: 2 },
    { id: 2, productId: 102, qty: 1 }
  ]
});

const products = state({
  items: [
    { id: 101, name: 'Laptop', price: 999 },
    { id: 102, name: 'Mouse', price: 29 },
    { id: 103, name: 'Keyboard', price: 79 }
  ]
});

const user = state({
  membershipLevel: 'gold', // 'bronze', 'silver', 'gold'
  points: 500
});

// Add computeds that reference multiple states
computed(cart, {
  // Enrich cart items with product details
  enrichedItems: s => s.items.map(item => {
    const product = products.items.find(p => p.id === item.productId);
    return {
      ...item,
      name: product.name,
      price: product.price,
      subtotal: product.price * item.qty
    };
  }),

  // Calculate total referencing enriched items
  subtotal: s => s.enrichedItems.reduce((sum, item) => sum + item.subtotal, 0),

  // Apply user-specific discount
  discount: s => {
    if (user.membershipLevel === 'gold') return s.subtotal * 0.15;
    if (user.membershipLevel === 'silver') return s.subtotal * 0.10;
    if (user.membershipLevel === 'bronze') return s.subtotal * 0.05;
    return 0;
  },

  // Points earned
  pointsEarned: s => Math.floor(s.subtotal / 10),

  // Final total with discount
  total: s => s.subtotal - s.discount,

  // Summary
  summary: s => ({
    items: s.enrichedItems.length,
    subtotal: s.subtotal,
    discount: s.discount,
    total: s.total,
    pointsEarned: s.pointsEarned,
    membershipLevel: user.membershipLevel
  })
});

console.log(cart.summary);
// {
//   items: 2,
//   subtotal: 2027,
//   discount: 304.05,
//   total: 1722.95,
//   pointsEarned: 202,
//   membershipLevel: "gold"
// }

// Change membership level
user.membershipLevel = 'bronze';
console.log(cart.discount);  // 101.35 (5% instead of 15%)
```

### 7. Dynamic Computed Definitions

```javascript
// Helper to create computed definitions dynamically
function createStatsComputeds(metricNames) {
  const computeds = {};

  metricNames.forEach(metric => {
    // Average
    computeds[`${metric}Avg`] = s =>
      s[metric].reduce((sum, v) => sum + v, 0) / s[metric].length;

    // Min
    computeds[`${metric}Min`] = s => Math.min(...s[metric]);

    // Max
    computeds[`${metric}Max`] = s => Math.max(...s[metric]);

    // Trend
    computeds[`${metric}Trend`] = s => {
      const len = s[metric].length;
      if (len < 2) return 'stable';
      const current = s[metric][len - 1];
      const previous = s[metric][len - 2];
      return current > previous ? 'up' : current < previous ? 'down' : 'stable';
    };
  });

  return computeds;
}

const stats = state({
  sales: [100, 120, 115, 130, 145],
  visitors: [500, 520, 510, 550, 580],
  signups: [10, 12, 11, 15, 18]
});

// Dynamically create computeds for all metrics
computed(stats, createStatsComputeds(['sales', 'visitors', 'signups']));

console.log(stats.salesAvg);  // 122
console.log(stats.salesTrend);  // "up"
console.log(stats.visitorsMin);  // 500
console.log(stats.signupsMax);  // 18
```

### 8. Recursive and Self-Referencing Computeds

```javascript
const tree = state({
  nodes: [
    { id: 1, label: 'Root', parentId: null },
    { id: 2, label: 'Child 1', parentId: 1 },
    { id: 3, label: 'Child 2', parentId: 1 },
    { id: 4, label: 'Grandchild 1', parentId: 2 },
    { id: 5, label: 'Grandchild 2', parentId: 2 }
  ],
  selectedNodeId: null
});

computed(tree, {
  // Build hierarchy
  rootNodes: s => s.nodes.filter(n => n.parentId === null),

  // Get children for any node
  getChildren: s => (nodeId) => s.nodes.filter(n => n.parentId === nodeId),

  // Count descendants recursively
  getDescendantCount: s => (nodeId) => {
    const children = s.getChildren(nodeId);
    return children.reduce((count, child) => {
      return count + 1 + s.getDescendantCount(child.id);
    }, 0);
  },

  // Build tree structure recursively
  treeStructure: s => {
    const buildTree = (nodeId) => {
      const node = s.nodes.find(n => n.id === nodeId);
      const children = s.getChildren(nodeId);
      return {
        ...node,
        children: children.map(child => buildTree(child.id)),
        descendantCount: s.getDescendantCount(nodeId)
      };
    };

    return s.rootNodes.map(root => buildTree(root.id));
  },

  // Selected node path
  selectedNodePath: s => {
    if (!s.selectedNodeId) return [];

    const path = [];
    let currentId = s.selectedNodeId;

    while (currentId !== null) {
      const node = s.nodes.find(n => n.id === currentId);
      path.unshift(node);
      currentId = node.parentId;
    }

    return path;
  },

  // Breadcrumb
  breadcrumb: s => s.selectedNodePath.map(n => n.label).join(' > ')
});

tree.selectedNodeId = 4;
console.log(tree.breadcrumb);  // "Root > Child 1 > Grandchild 1"
console.log(tree.treeStructure[0].descendantCount);  // 4
```

---

## Performance Tips

### 1. Keep Computed Functions Pure
```javascript
// ❌ BAD: Side effects in computed
computed(state, {
  total: s => {
    console.log('Calculating total...');  // Side effect!
    logToAnalytics(s.value);  // Side effect!
    return s.price * s.quantity;
  }
});

// ✅ GOOD: Pure computation
computed(state, {
  total: s => s.price * s.quantity
});
```

### 2. Avoid Expensive Operations
```javascript
// ❌ BAD: Heavy computation on every access
computed(state, {
  sorted: s => {
    // Sorting 10,000 items every time
    return s.items.slice().sort((a, b) => a.price - b.price);
  }
});

// ✅ GOOD: Cache or use pagination
computed(state, {
  // Only sort visible items
  visibleSorted: s => {
    const visible = s.items.slice(s.pageStart, s.pageEnd);
    return visible.sort((a, b) => a.price - b.price);
  }
});
```

### 3. Break Down Complex Computeds
```javascript
// ❌ BAD: One giant computed
computed(state, {
  report: s => {
    const filtered = s.items.filter(/* complex filter */);
    const grouped = /* complex grouping */;
    const aggregated = /* complex aggregation */;
    return /* complex formatting */;
  }
});

// ✅ GOOD: Chain of smaller computeds
computed(state, {
  filteredItems: s => s.items.filter(/* complex filter */),
  groupedItems: s => /* group s.filteredItems */,
  aggregatedData: s => /* aggregate s.groupedItems */,
  report: s => /* format s.aggregatedData */
});
```

### 4. Avoid Creating New Objects Unnecessarily
```javascript
// ❌ BAD: Creates new object on every access
computed(state, {
  config: s => ({
    timeout: 5000,
    retries: 3,
    url: s.apiUrl  // Only this changes
  })
});

// ✅ GOOD: Only computed parts that change
computed(state, {
  apiConfig: s => ({
    timeout: 5000,
    retries: 3,
    url: s.apiUrl
  })
});
// Or even better: use multiple specific computeds
computed(state, {
  apiUrl: s => s.baseUrl + s.endpoint,
  timeout: s => 5000,
  retries: s => 3
});
```

### 5. Leverage Automatic Dependency Tracking
```javascript
// ✅ Dependencies are tracked automatically
computed(state, {
  // Only recalculates when price or quantity change
  total: s => s.price * s.quantity,

  // Only recalculates when items array changes
  itemCount: s => s.items.length,

  // Only recalculates when relevant fields change
  displayName: s => `${s.firstName} ${s.lastName}`
});
```

---

## Common Pitfalls

### 1. Modifying State Inside Computed
```javascript
// ❌ WRONG: Mutating state in computed
computed(cart, {
  total: s => {
    s.lastCalculated = Date.now();  // NEVER DO THIS!
    return s.items.reduce((sum, item) => sum + item.price, 0);
  }
});

// ✅ CORRECT: Pure computation only
computed(cart, {
  total: s => s.items.reduce((sum, item) => sum + item.price, 0)
});

// Use effects for side effects
effect(() => {
  const total = cart.total;  // Access triggers computation
  cart.lastCalculated = Date.now();  // Update in effect
});
```

### 2. Circular Dependencies
```javascript
// ❌ WRONG: Circular dependency
computed(state, {
  a: s => s.b + 1,
  b: s => s.a + 1  // ERROR: a depends on b, b depends on a
});

// ✅ CORRECT: One-way dependencies
computed(state, {
  a: s => s.value + 1,
  b: s => s.a + 1  // OK: linear dependency chain
});
```

### 3. Forgetting Computed is Cached
```javascript
const data = state({ timestamp: Date.now() });

// ❌ WRONG: Expecting timestamp to update
computed(data, {
  formattedTime: s => new Date(s.timestamp).toLocaleTimeString()
});

// This won't update until s.timestamp changes!
setInterval(() => {
  console.log(data.formattedTime);  // Same value
}, 1000);

// ✅ CORRECT: Update the tracked dependency
setInterval(() => {
  data.timestamp = Date.now();  // Now formattedTime will recalculate
  console.log(data.formattedTime);
}, 1000);
```

### 4. Using Non-Reactive External Data
```javascript
let externalValue = 10;

// ❌ WRONG: External value changes won't trigger updates
computed(state, {
  total: s => s.price * externalValue  // Won't update when externalValue changes
});

externalValue = 20;
console.log(state.total);  // Still uses 10!

// ✅ CORRECT: Put external values in state
const config = state({ multiplier: 10 });

computed(state, {
  total: s => s.price * config.multiplier
});

config.multiplier = 20;
console.log(state.total);  // Updates correctly!
```

### 5. Overwriting Computed Properties
```javascript
const user = state({ firstName: 'John', lastName: 'Doe' });

computed(user, {
  fullName: s => `${s.firstName} ${s.lastName}`
});

console.log(user.fullName);  // "John Doe"

// ❌ WRONG: Trying to overwrite
user.fullName = 'Jane Smith';  // Will be ignored or error

// ✅ CORRECT: Update the source properties
user.firstName = 'Jane';
user.lastName = 'Smith';
console.log(user.fullName);  // "Jane Smith"
```

### 6. Not Returning Values
```javascript
// ❌ WRONG: Forgot to return
computed(state, {
  total: s => {
    const sum = s.items.reduce((sum, item) => sum + item.price, 0);
    // Forgot to return!
  }
});

console.log(state.total);  // undefined

// ✅ CORRECT: Always return
computed(state, {
  total: s => {
    return s.items.reduce((sum, item) => sum + item.price, 0);
  }
});

// Or use implicit return
computed(state, {
  total: s => s.items.reduce((sum, item) => sum + item.price, 0)
});
```

### 7. Computing Heavy Operations Synchronously
```javascript
// ❌ WRONG: Heavy operation blocks UI
computed(state, {
  processedData: s => {
    // Synchronously processing 100,000 items
    return s.hugeArray.map(item => expensiveTransform(item));
  }
});

// ✅ BETTER: Paginate or limit scope
computed(state, {
  visibleProcessedData: s => {
    // Only process visible items
    const visible = s.hugeArray.slice(s.start, s.end);
    return visible.map(item => expensiveTransform(item));
  }
});

// ✅ OR: Use async processing with effects
const cache = state({ processedData: [] });

effect(async () => {
  const data = await processInBackground(state.hugeArray);
  cache.processedData = data;
});
```

---

## Real-World Example: E-Commerce Dashboard

```javascript
import { state, computed, bindings } from './state.js';

// Main application state
const app = state({
  // Products
  products: [
    { id: 1, name: 'Laptop', price: 999, category: 'Electronics', stock: 5, sales: 12 },
    { id: 2, name: 'Mouse', price: 29, category: 'Electronics', stock: 50, sales: 45 },
    { id: 3, name: 'Desk', price: 299, category: 'Furniture', stock: 0, sales: 8 },
    { id: 4, name: 'Chair', price: 199, category: 'Furniture', stock: 15, sales: 22 }
  ],

  // Cart
  cartItems: [
    { productId: 1, quantity: 1 },
    { productId: 2, quantity: 2 }
  ],

  // User
  user: {
    name: 'Alice',
    membershipLevel: 'gold',
    points: 500
  },

  // Settings
  taxRate: 0.08,
  shippingCost: 15,
  freeShippingThreshold: 100,

  // UI State
  selectedCategory: null,
  sortBy: 'name',
  sortOrder: 'asc'
});

// Add comprehensive computed properties
computed(app, {
  // === PRODUCT COMPUTEDS ===

  // Filter by category
  filteredProducts: s => {
    if (!s.selectedCategory) return s.products;
    return s.products.filter(p => p.category === s.selectedCategory);
  },

  // Sort products
  sortedProducts: s => {
    const sorted = [...s.filteredProducts];
    sorted.sort((a, b) => {
      let compareA = a[s.sortBy];
      let compareB = b[s.sortBy];

      if (s.sortOrder === 'asc') {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });
    return sorted;
  },

  // Product statistics
  totalProducts: s => s.products.length,
  inStockProducts: s => s.products.filter(p => p.stock > 0).length,
  outOfStockProducts: s => s.products.filter(p => p.stock === 0).length,
  lowStockProducts: s => s.products.filter(p => p.stock > 0 && p.stock < 10),

  totalInventoryValue: s =>
    s.products.reduce((sum, p) => sum + p.price * p.stock, 0),

  totalSales: s =>
    s.products.reduce((sum, p) => sum + p.sales, 0),

  totalRevenue: s =>
    s.products.reduce((sum, p) => sum + p.price * p.sales, 0),

  // === CART COMPUTEDS ===

  // Enrich cart items with product details
  enrichedCartItems: s => s.cartItems.map(item => {
    const product = s.products.find(p => p.id === item.productId);
    return {
      ...item,
      product,
      subtotal: product.price * item.quantity
    };
  }),

  // Cart metrics
  cartItemCount: s => s.cartItems.reduce((sum, item) => sum + item.quantity, 0),

  cartSubtotal: s =>
    s.enrichedCartItems.reduce((sum, item) => sum + item.subtotal, 0),

  // Discounts
  membershipDiscount: s => {
    const rate = {
      bronze: 0.05,
      silver: 0.10,
      gold: 0.15,
      platinum: 0.20
    }[s.user.membershipLevel] || 0;

    return s.cartSubtotal * rate;
  },

  cartAfterDiscount: s => s.cartSubtotal - s.membershipDiscount,

  // Shipping
  qualifiesForFreeShipping: s => s.cartAfterDiscount >= s.freeShippingThreshold,

  shippingFee: s => s.qualifiesForFreeShipping ? 0 : s.shippingCost,

  // Tax
  taxAmount: s => s.cartAfterDiscount * s.taxRate,

  // Total
  cartTotal: s => s.cartAfterDiscount + s.shippingFee + s.taxAmount,

  // Points
  pointsEarned: s => Math.floor(s.cartTotal / 10),

  totalPointsAfterPurchase: s => s.user.points + s.pointsEarned,

  // === CART SUMMARY ===

  cartSummary: s => ({
    itemCount: s.cartItemCount,
    subtotal: s.cartSubtotal.toFixed(2),
    discount: s.membershipDiscount.toFixed(2),
    shipping: s.shippingFee.toFixed(2),
    tax: s.taxAmount.toFixed(2),
    total: s.cartTotal.toFixed(2),
    pointsEarned: s.pointsEarned,
    freeShipping: s.qualifiesForFreeShipping
  }),

  // === DASHBOARD METRICS ===

  dashboardMetrics: s => ({
    products: {
      total: s.totalProducts,
      inStock: s.inStockProducts,
      outOfStock: s.outOfStockProducts,
      lowStock: s.lowStockProducts.length
    },
    inventory: {
      value: s.totalInventoryValue.toFixed(2),
      avgValue: (s.totalInventoryValue / s.totalProducts).toFixed(2)
    },
    sales: {
      total: s.totalSales,
      revenue: s.totalRevenue.toFixed(2),
      avgPerProduct: (s.totalRevenue / s.totalProducts).toFixed(2)
    },
    cart: s.cartSummary,
    user: {
      name: s.user.name,
      level: s.user.membershipLevel,
      points: s.user.points,
      pointsAfterPurchase: s.totalPointsAfterPurchase
    }
  })
});

// Setup DOM bindings
bindings(app, {
  // Product list
  '#product-count': s => `${s.sortedProducts.length} Products`,
  '#low-stock-alert': s => s.lowStockProducts.length > 0 ? 'visible' : 'hidden',

  // Cart
  '#cart-count': s => s.cartItemCount,
  '#cart-subtotal': s => `$${s.cartSubtotal.toFixed(2)}`,
  '#cart-discount': s => `-$${s.membershipDiscount.toFixed(2)}`,
  '#cart-shipping': s => s.qualifiesForFreeShipping ? 'FREE' : `$${s.shippingFee.toFixed(2)}`,
  '#cart-tax': s => `$${s.taxAmount.toFixed(2)}`,
  '#cart-total': s => `$${s.cartTotal.toFixed(2)}`,

  // Points
  '#points-current': s => s.user.points,
  '#points-earned': s => `+${s.pointsEarned}`,
  '#points-after': s => s.totalPointsAfterPurchase,

  // Dashboard
  '#total-revenue': s => `$${s.totalRevenue.toFixed(2)}`,
  '#total-sales': s => s.totalSales,
  '#inventory-value': s => `$${s.totalInventoryValue.toFixed(2)}`,
  '#out-of-stock': s => s.outOfStockProducts
});

// Example usage
console.log(app.dashboardMetrics);
/*
{
  products: { total: 4, inStock: 3, outOfStock: 1, lowStock: 1 },
  inventory: { value: "14733.00", avgValue: "3683.25" },
  sales: { total: 87, revenue: "32311.00", avgPerProduct: "8077.75" },
  cart: {
    itemCount: 3,
    subtotal: "1057.00",
    discount: "158.55",
    shipping: "0.00",
    tax: "71.88",
    total: "970.33",
    pointsEarned: 97,
    freeShipping: true
  },
  user: {
    name: "Alice",
    level: "gold",
    points: 500,
    pointsAfterPurchase: 597
  }
}
*/

// Add to cart
app.cartItems.push({ productId: 3, quantity: 1 });
console.log(app.cartTotal);  // Auto-updates!

// Change category filter
app.selectedCategory = 'Electronics';
console.log(app.sortedProducts.length);  // 2

// Sort by price
app.sortBy = 'price';
app.sortOrder = 'desc';
console.log(app.sortedProducts[0].name);  // "Laptop"
```

---

## API Reference

### computed(stateObject, definitions)

Adds multiple cached computed properties to a reactive state object.

**Parameters:**
- `stateObject` (Object): A reactive state object created with `state()`, `ref()`, etc.
- `definitions` (Object): Object mapping property names to getter functions
  - Each getter receives the state object as parameter
  - Each getter should return the computed value
  - Getters are automatically tracked for dependencies

**Returns:**
- The enhanced state object (for chaining)

**Example:**
```javascript
const cart = state({ items: [], tax: 0.08 });

computed(cart, {
  subtotal: s => s.items.reduce((sum, item) => sum + item.price, 0),
  tax: s => s.subtotal * s.taxRate,
  total: s => s.subtotal + s.tax
});
```

---

## Frequently Asked Questions

### When should I use computed() vs $computed()?

**Use `computed()`** when:
- You want to add multiple related computed properties at once
- You prefer object-based configuration style
- You're setting up computeds during initialization
- You want a clear separation between setup and usage

**Use `$computed()`** when:
- You're adding one computed property
- You prefer method chaining style
- You're adding computeds incrementally
- You want fluent API style

Both create identical reactive computed properties.

### Can computed properties reference other computed properties?

Yes! Computed properties can reference other computeds, and dependencies are tracked automatically:

```javascript
computed(state, {
  a: s => s.value * 2,
  b: s => s.a + 10,      // References computed 'a'
  c: s => s.b * s.a      // References both 'a' and 'b'
});
```

Just avoid circular dependencies (a depends on b, b depends on a).

### How do I know when a computed will recalculate?

A computed recalculates when:
1. You access it AND
2. Any of its tracked dependencies have changed since last calculation

Dependencies are automatically tracked - any reactive property accessed during the getter function becomes a dependency.

```javascript
computed(state, {
  // Depends on: firstName, lastName
  fullName: s => `${s.firstName} ${s.lastName}`
});

state.firstName = 'John';  // Marks fullName as dirty
console.log(state.fullName);  // Recalculates and caches
console.log(state.fullName);  // Returns cached value
```

### Can I use async functions in computed properties?

No, computed getters must be synchronous. For async operations, use effects or manual state updates:

```javascript
// ❌ WRONG
computed(state, {
  data: async s => await fetch(s.url)  // Don't do this!
});

// ✅ CORRECT: Use effects
const cache = state({ data: null });

effect(async () => {
  const response = await fetch(state.url);
  cache.data = await response.json();
});

// Access cached data
computed(cache, {
  processedData: s => s.data ? processData(s.data) : null
});
```

### How do I debug which dependencies are tracked?

Access the computed property and check which state properties are read during execution:

```javascript
computed(state, {
  summary: s => {
    console.log('Computing summary...');
    return `${s.firstName} ${s.lastName}, Age: ${s.age}`;
  }
});

// First access
console.log(state.summary);
// Logs: "Computing summary..."
// Dependencies tracked: firstName, lastName, age

state.email = 'new@example.com';  // Not a dependency
console.log(state.summary);  // Returns cached value (no log)

state.age = 31;  // IS a dependency
console.log(state.summary);  // Logs: "Computing summary..." (recalculates)
```

### Can I modify state inside a computed?

**No!** Computed properties must be pure functions - they should only compute and return values, never modify state:

```javascript
// ❌ WRONG
computed(state, {
  total: s => {
    s.lastCalculated = Date.now();  // NEVER modify state!
    return s.price * s.qty;
  }
});

// ✅ CORRECT: Use effects for side effects
computed(state, {
  total: s => s.price * s.qty
});

effect(() => {
  const total = state.total;  // Access computed
  state.lastCalculated = Date.now();  // Update in effect
});
```

### How do I remove or update a computed property?

Computed properties are defined once and cannot be removed. To "update" logic, redefine the property:

```javascript
const obj = state({ value: 10 });

computed(obj, {
  double: s => s.value * 2
});

// To change logic, redefine
computed(obj, {
  double: s => s.value * 3  // Now triples instead
});
```

However, this is uncommon - computed logic usually stays constant. If you need dynamic logic, use conditional computeds:

```javascript
const config = state({ multiplier: 2 });

computed(obj, {
  result: s => s.value * config.multiplier
});

// Change behavior by updating config
config.multiplier = 3;
```

### What's the performance cost of computed properties?

**Very low:**

- **First access**: Runs getter function, tracks dependencies, caches result
- **Subsequent accesses**: Returns cached value (just a property lookup)
- **After dependency changes**: Next access recalculates

Computed properties are actually faster than manual calculations because of caching:

```javascript
// Without computed: recalculates every time
function getTotal() {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// With computed: calculates once, caches until items change
computed(state, {
  total: s => s.items.reduce((sum, item) => sum + item.price, 0)
});
```

### Can I use computed() with non-state objects?

No, `computed()` requires reactive state objects created with `state()`, `ref()`, `refs()`, or similar:

```javascript
// ❌ WRONG: Plain object
const plain = { value: 10 };
computed(plain, {
  double: s => s.value * 2  // Won't work!
});

// ✅ CORRECT: Reactive state
const reactive = state({ value: 10 });
computed(reactive, {
  double: s => s.value * 2  // Works!
});
```

### How do I pass parameters to computed properties?

You can't directly - computed properties are getters, not functions. Instead, use patterns like:

**1. Store parameter in state:**
```javascript
const app = state({
  items: [...],
  filterCategory: 'Electronics'
});

computed(app, {
  filteredItems: s => s.items.filter(item => item.category === s.filterCategory)
});

// "Pass parameter" by updating state
app.filterCategory = 'Furniture';
```

**2. Return a function (advanced):**
```javascript
computed(app, {
  getItemsByCategory: s => (category) =>
    s.items.filter(item => item.category === category)
});

// Usage
const electronics = app.getItemsByCategory('Electronics');
```

Note: Returning functions doesn't cache per parameter, so use sparingly.

---

## Related Functions

- [state()](../01_State%20Creation/01_state.md) - Create reactive state objects
- [bindings()](./bindings.md) - Declarative DOM synchronization
- [effect()](./effect.md) - Run side effects reactively
- [watch()](./watch.md) - Observe state changes with callbacks

---

## Summary

**computed()** adds multiple cached computed properties to reactive state:

✅ **Automatic caching** - Only recalculates when dependencies change
✅ **Batch setup** - Define multiple computeds in one call
✅ **Dependency tracking** - Automatically tracks accessed properties
✅ **Chainable dependencies** - Computeds can reference other computeds
✅ **Clean syntax** - Object-based configuration style
✅ **Performance** - Cached results, minimal overhead

Perfect for deriving values, calculations, filtering, formatting, and complex state transformations!
