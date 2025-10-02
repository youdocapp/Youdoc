# Font Setup Instructions

## The app requires the ReadexPro-Medium font to run properly.

### Quick Setup (3 steps):

1. **Download the font:**
   - Go to: https://fonts.google.com/specimen/Readex+Pro
   - Click "Download family"
   - Extract the ZIP file

2. **Copy the font file:**
   - Locate `ReadexPro-Medium.ttf` in the extracted folder
   - Copy it to: `assets/fonts/ReadexPro-Medium.ttf`

3. **Restart the server:**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm start
   ```

---

## Alternative: Use System Font Instead

If you prefer not to use a custom font, you can remove it:

### Step 1: Edit `app/_layout.tsx`
Remove or comment out lines 71-73:
```typescript
// const [loaded, error] = useFonts({
//   'ReadexPro-Medium': require('../assets/fonts/ReadexPro-Medium.ttf'),
// });
```

And update the return condition (lines 75-81):
```typescript
// if (!loaded && !error) {
//   return null;
// }
```

### Step 2: Remove font references from components
Search for `fontFamily: 'ReadexPro-Medium'` in all files and remove those lines.

Files that use the font:
- `components/auth/SignUpScreen.tsx`
- `components/auth/SignInScreen.tsx`
- `components/auth/EmailVerificationScreen.tsx`
- `components/auth/ForgotPasswordScreen.tsx`
- `components/auth/NewPasswordScreen.tsx`
- `components/onboarding/WelcomeScreen.tsx`
- `components/onboarding/WellnessScreen.tsx`
- `components/onboarding/CarepointScreen.tsx`
- `components/onboarding/AuthScreen.tsx`

---

## Troubleshooting

**Error: "Font file not found"**
- Make sure the file is named exactly: `ReadexPro-Medium.ttf`
- Make sure it's in the correct location: `assets/fonts/`
- Restart the development server

**App won't load / stuck on splash screen**
- The font loading is blocking the app
- Either add the font file or remove the font loading code (see Alternative above)

---

## Why ReadexPro?

ReadexPro is a modern, readable font designed for digital interfaces. It provides:
- Excellent readability on mobile screens
- Professional appearance
- Good support for various font weights

However, you can use any font you prefer by replacing the font file and updating the font name in the code.
