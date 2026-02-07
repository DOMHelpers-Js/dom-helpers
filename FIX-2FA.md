# 🔐 Fix: Enable 2FA for npm Publishing

## The Issue
npm requires Two-Factor Authentication (2FA) to publish packages for security.

## ✅ Quick Fix (5 minutes)

### Step 1: Enable 2FA on npm

1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/security
2. Or click your profile → Settings → Security
3. Enable **Two-Factor Authentication**
4. Choose: **Authorization and Publishing** (recommended)
5. Scan the QR code with an authenticator app:
   - Google Authenticator (recommended)
   - Microsoft Authenticator
   - Authy
   - Or any other authenticator app

### Step 2: Publish with OTP

Now publish using your authenticator code:

```powershell
npm publish --otp=123456
```

Replace `123456` with the 6-digit code from your authenticator app.

---

## Alternative: Use Automation Token (For CI/CD)

If you want to automate publishing without 2FA each time:

### Option A: Create Automation Token
```powershell
npm token create --type=automation
```

This creates a token that bypasses 2FA.

### Option B: Publish with Token
```powershell
npm publish --auth-type=legacy
```

---

## ✅ Complete Commands

After enabling 2FA:

```powershell
# Get your 6-digit code from authenticator app
# Then publish:
npm publish --otp=YOUR_6_DIGIT_CODE
```

Example:
```powershell
npm publish --otp=123456
```

The code changes every 30 seconds, so grab a fresh one right before publishing!

---

## 🎉 After Publishing

Once successful, your package will be live at:
- https://www.npmjs.com/package/dom-helpers-js
- https://cdn.jsdelivr.net/npm/dom-helpers-js@2.3.1/dist/dom-helpers.min.js

---

## ❓ Troubleshooting

### "Invalid OTP"
- Make sure you're using a fresh code (they expire after 30 seconds)
- Check your phone's time is synced correctly

### "Token expired"
- Run `npm login` again
- Then `npm publish --otp=CODE`

---

**Ready? Enable 2FA, then run:**
```powershell
npm publish --otp=YOUR_CODE
```
