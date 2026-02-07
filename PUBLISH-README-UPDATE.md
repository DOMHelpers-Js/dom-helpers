# 📝 Publish README Update to npm

## Current Status
- Current version: **2.3.1**
- Next version: **2.3.2** (patch update for README changes)

## 🚀 Quick Publish (3 Steps)

### Step 1: Update Version
```powershell
npm version patch
```
This will:
- Change version from 2.3.1 → 2.3.2
- Create a git commit
- Create a git tag v2.3.2

### Step 2: Publish to npm
```powershell
npm publish --otp=YOUR_6_DIGIT_CODE
```
Replace `YOUR_6_DIGIT_CODE` with the code from your authenticator app.

### Step 3: Push to GitHub
```powershell
git push origin main --tags
```

---

## 📋 Complete Commands (Copy & Paste)

```powershell
# 1. Update version (creates commit + tag automatically)
npm version patch

# 2. Publish to npm (get OTP from your authenticator app)
npm publish --otp=123456

# 3. Push to GitHub
git push origin main --tags
```

---

## ✅ What Will Happen

### After `npm version patch`:
- ✅ package.json updated to 2.3.2
- ✅ Git commit created: "2.3.2"
- ✅ Git tag created: v2.3.2

### After `npm publish`:
- ✅ Updated README.md published to npm
- ✅ All new standalone modules published
- ✅ Package live at: https://www.npmjs.com/package/dom-helpers-js

### After `git push`:
- ✅ GitHub updated with new version
- ✅ Tag v2.3.2 available on GitHub
- ✅ GitHub-based CDN will work with @2.3.2

---

## 🎯 What Gets Published

When you run `npm publish`, these files are included (from package.json "files" field):
- ✅ `dist/` - All build files (including new standalone modules)
- ✅ `src/` - Source files
- ✅ `README.md` - **Your updated README!**
- ✅ `LICENSE` - License file
- ✅ `package.json` - Package metadata

---

## ⚠️ Important Notes

1. **2FA Required** - Make sure you have your authenticator app ready
2. **Build Automatic** - `prepublishOnly` script runs build automatically
3. **No Manual Edits** - Don't edit version in package.json manually, use `npm version`

---

## 🔍 Verify After Publishing

### Check npm package:
https://www.npmjs.com/package/dom-helpers-js

You should see:
- ✅ Version 2.3.2
- ✅ Updated README with correct CDN links
- ✅ "Last publish: a few seconds ago"

### Test CDN:
```html
<!-- Should work immediately -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.2/dist/dom-helpers.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@latest/dist/dom-helpers.min.js"></script>
```

---

## 🐛 Troubleshooting

### "Invalid OTP"
- Get a fresh code from your authenticator app
- Codes expire every 30 seconds

### "Version already published"
- You may have already run `npm version patch`
- Check current version: `npm version`
- If already 2.3.2, just run `npm publish --otp=CODE`

### "Need to login"
```powershell
npm login
# Then try publish again
```

---

## ✨ Ready to Publish?

Run these 3 commands:

```powershell
npm version patch
npm publish --otp=YOUR_CODE
git push origin main --tags
```

**That's it! Your updated README will be live on npm!** 🎉
