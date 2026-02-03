# Youdoc Production & TestFlight Guide

This guide contains everything you need to know to submit Youdoc to TestFlight and the App Store successfully.

## 🚀 1. Final Configuration Check

I have already updated your `app.json` with professional identifiers:

- **Bundle ID:** `com.youdoc.app`
- **Package Name:** `com.youdoc.app`
- **Permissions:** Professional strings for Camera, Photo Library, and Microphone access.

## 🔑 2. Environment Variables (CRITICAL)

When building for production with EAS, you MUST add your `.env` variables to the Expo dashboard so they are included in the build:

1. Go to [expo.dev](https://expo.dev)
2. Select your project: `youdoc`
3. Go to **Settings** > **Environment Variables**
4. Add the following:
   - `EXPO_PUBLIC_API_BASE_URL`: `https://youdoc.onrender.com`
   - `EXPO_PUBLIC_SUPABASE_URL`: (Your Supabase URL)
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: (Your Supabase Anon Key)

## 📦 3. Building for TestFlight

Run these commands in your terminal:

```bash
# 1. Install EAS CLI if you haven't
npm install -g eas-cli

# 2. Log in to Expo
eas login

# 3. Configure the project (Select 'Yes' to all prompts)
eas build:configure

# 4. Run the production build
eas build --platform ios --profile production
```

## 🛠️ 4. Handling "App Not Installed"

If you get this error on your phone, it is almost always a **duplicate package conflict**.

- **Fix:** **Uninstall ALL previous versions of Youdoc and Expo Go** from your phone before installing a new standalone build.
- Standalone builds cannot "overwrite" Expo Go or builds signed with different keys.

## ⚠️ 5. Backend "Cold Starts"

Since your backend is on **Render.com**, it "sleeps" after inactivity.

- I have increased the app's timeout to **60 seconds** to wait for the wake-up.
- **Recommendation:** If you plan to go live, consider upgrading Render to a "Web Service" tier that doesn't sleep ($7/mo) to ensure the App Store reviewers don't reject the app for being "slow to load."

## 🍏 6. Apple Review Notes

- **Apple Health / Google Fit:** These are currently in "Coming Soon" status. If the App Store reviewers ask about them, tell them they are planned for the next version.
- **Support URL:** Make sure you have a simple landing page or support email ready for the App Store form.

Your app is now cleanly configured and ready for the clouds! 🚀
