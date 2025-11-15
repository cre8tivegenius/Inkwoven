# iOS Quick Start Guide

## Install Inkwoven on Your iPhone/iPad (PWA)

### Quick Steps:

1. **Open Safari** on your iOS device (not Chrome - PWAs only work in Safari)

2. **Navigate** to your Inkwoven app URL (must be HTTPS)

3. **Add to Home Screen**:
   - Tap the Share button (square with arrow)
   - Scroll down and tap **"Add to Home Screen"**
   - Tap **"Add"**

4. **Launch** the app from your home screen

The app will now open in standalone mode without Safari's browser UI!

## Generate iOS Assets

Before deploying, generate the required iOS icons and splash screens:

```bash
# Make sure you have a 512x512px icon at public/icon-512.png
./scripts/generate-ios-assets.sh
```

This will create:
- App icons in multiple sizes
- Splash screens for different devices
- Placeholder screenshots

## Requirements

- ✅ HTTPS (required for PWAs)
- ✅ Valid manifest.json
- ✅ Service worker registered
- ✅ App icons (180x180px minimum)

## Troubleshooting

**Can't add to home screen?**
- Make sure you're using Safari (not Chrome)
- Check that the site is served over HTTPS
- Clear Safari cache and try again

**App opens in Safari instead of standalone?**
- Delete the home screen icon
- Re-add it following the steps above
- Check that `display: "standalone"` is in manifest.json

**Icons not showing?**
- Run the asset generation script
- Ensure icons are in `public/icons/` directory
- Clear Safari cache

For more details, see [iOS Setup Guide](./IOS_SETUP.md)

