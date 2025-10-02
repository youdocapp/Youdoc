# Readex Pro Font Installation Guide

## Quick Setup

Your app is already configured to use Readex Pro font. You just need to add the font file.

### Step 1: Download Readex Pro Font

1. Visit Google Fonts: https://fonts.google.com/specimen/Readex+Pro
2. Click "Download family" button
3. Extract the downloaded ZIP file

### Step 2: Add Font to Your Project

1. Create a `fonts` folder in your `assets` directory:
   ```
   assets/
   └── fonts/
       └── ReadexPro-Medium.ttf
   ```

2. From the extracted Google Fonts folder, copy `ReadexPro-Medium.ttf` to `assets/fonts/`

### Step 3: Verify Installation

The font is already configured in `app/_layout.tsx`:

```typescript
const [loaded, error] = useFonts({
  'ReadexPro-Medium': require('../assets/fonts/ReadexPro-Medium.ttf'),
});
```

### Alternative: Use System Fonts (Temporary)

If you want to test the app without the custom font, you can temporarily modify `app/_layout.tsx`:

```typescript
const [loaded, error] = useFonts({
  // Comment out or remove the custom font
  // 'ReadexPro-Medium': require('../assets/fonts/ReadexPro-Medium.ttf'),
});
```

And update all `fontFamily: 'ReadexPro-Medium'` references in your components to use system fonts:
- iOS: `fontFamily: 'System'`
- Android: `fontFamily: 'Roboto'`
- Or remove the fontFamily property entirely to use the default

### Font Weights Available in Readex Pro

- ReadexPro-Light.ttf (300)
- ReadexPro-Regular.ttf (400)
- ReadexPro-Medium.ttf (500) ← Currently used
- ReadexPro-SemiBold.ttf (600)
- ReadexPro-Bold.ttf (700)

You can add more weights if needed by following the same pattern in `app/_layout.tsx`.

## Troubleshooting

If you see font-related errors:
1. Make sure the font file exists at `assets/fonts/ReadexPro-Medium.ttf`
2. Restart your development server
3. Clear the cache: `npx expo start -c`
