# iOS Setup Guide for Inkwoven

This guide will help you set up Inkwoven as a Progressive Web App (PWA) on iOS devices, and optionally create a native iOS app using Capacitor.

## Option 1: Install as PWA (Progressive Web App)

### Step 1: Access the App on iOS Safari

1. Open **Safari** on your iPhone or iPad
2. Navigate to your Inkwoven app URL (e.g., `https://your-domain.com`)
3. Make sure you're accessing it via HTTPS (required for PWAs)

### Step 2: Add to Home Screen

1. Tap the **Share** button (square with arrow pointing up) at the bottom of Safari
2. Scroll down and tap **"Add to Home Screen"**
3. Customize the name if desired (default: "Inkwoven")
4. Tap **"Add"** in the top right corner

### Step 3: Launch the App

1. Find the Inkwoven icon on your home screen
2. Tap it to launch the app in standalone mode
3. The app will open without Safari's browser UI

## Option 2: Create Native iOS App with Capacitor

For App Store distribution, you can wrap Inkwoven as a native iOS app using Capacitor.

### Prerequisites

- macOS with Xcode installed
- Apple Developer account ($99/year for App Store distribution)
- Node.js 20+

### Step 1: Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios
npm install --save-dev @capacitor/ios
```

### Step 2: Initialize Capacitor

```bash
npx cap init
```

When prompted:
- **App name**: Inkwoven
- **App ID**: com.yourcompany.inkwoven (use reverse domain notation)
- **Web dir**: dist

### Step 3: Build Your Web App

```bash
npm run build
```

### Step 4: Add iOS Platform

```bash
npx cap add ios
```

### Step 5: Configure iOS App

1. Open the iOS project in Xcode:
   ```bash
   npx cap open ios
   ```

2. In Xcode:
   - Select your project in the navigator
   - Go to **Signing & Capabilities**
   - Select your development team
   - Enable **Background Modes** if needed
   - Configure **App Icons** and **Launch Screen**

### Step 6: Generate App Icons

You'll need to create app icons in the following sizes:

- **App Icon**: 1024x1024px (for App Store)
- **iOS Icons**: 180x180, 152x152, 144x144, 120x120, 114x114, 76x76, 72x72, 60x60, 57x57

You can use tools like:
- [App Icon Generator](https://www.appicon.co/)
- [IconKitchen](https://icon.kitchen/)

Place the icons in:
- `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### Step 7: Configure Info.plist

Edit `ios/App/App/Info.plist` to add:

```xml
<key>UIRequiresFullScreen</key>
<true/>
<key>UIStatusBarStyle</key>
<string>UIStatusBarStyleDefault</string>
<key>UISupportedInterfaceOrientations</key>
<array>
    <string>UIInterfaceOrientationPortrait</string>
    <string>UIInterfaceOrientationLandscapeLeft</string>
    <string>UIInterfaceOrientationLandscapeRight</string>
</array>
```

### Step 8: Sync and Build

```bash
# After making changes to your web app
npm run build
npx cap sync ios
```

### Step 9: Test on Simulator or Device

1. In Xcode, select a simulator or connected device
2. Click the **Play** button to build and run
3. Test all functionality

### Step 10: Prepare for App Store

1. **Archive the app**:
   - In Xcode: Product → Archive
   - Wait for the archive to complete

2. **Distribute**:
   - Click **Distribute App**
   - Choose **App Store Connect**
   - Follow the prompts to upload

3. **App Store Connect**:
   - Go to [App Store Connect](https://appstoreconnect.apple.com/)
   - Complete app information, screenshots, and metadata
   - Submit for review

## Required Assets

### App Icons

Create icons in these sizes and place them in `public/icons/`:

- `apple-icon-57x57.png`
- `apple-icon-60x60.png`
- `apple-icon-72x72.png`
- `apple-icon-76x76.png`
- `apple-icon-114x114.png`
- `apple-icon-120x120.png`
- `apple-icon-144x144.png`
- `apple-icon-152x152.png`
- `apple-icon-180x180.png` (required for iOS 11+)

Also create `public/apple-touch-icon.png` (180x180px) as a fallback.

### Splash Screens

Create splash screens for different device sizes in `public/splash/`:

- `iphone-se.png` (640x1136px)
- `iphone-8.png` (750x1334px)
- `iphone-8-plus.png` (1242x2208px)
- `iphone-x.png` (1125x2436px)
- `iphone-xs-max.png` (1242x2688px)
- `ipad.png` (1536x2048px)
- `ipad-pro.png` (2048x2732px)

### Screenshots (for App Store)

Create screenshots in `public/screenshots/`:

- `iphone-se.png` (320x568px)
- `ipad.png` (768x1024px)

## Mobile-Specific Considerations

### Touch Interactions

The app is designed to work with touch:
- Tap to select
- Long press for context menus (if implemented)
- Swipe gestures for navigation (can be added)

### Responsive Design

The app uses Tailwind CSS with responsive breakpoints:
- Mobile-first design
- Sidebars collapse on small screens
- Touch-friendly button sizes (minimum 44x44px)

### Offline Support

The service worker (`public/sw.js`) provides basic offline caching:
- Caches essential files
- Works offline after first visit
- Updates automatically when new version is available

### iOS-Specific Features

1. **Safe Area**: The viewport meta tag includes `viewport-fit=cover` for iPhone X and newer
2. **Status Bar**: Configured to be translucent with dark content
3. **Orientation**: Supports portrait and landscape (can be restricted in manifest)

## Troubleshooting

### App Not Installing

- Ensure you're using HTTPS
- Check that the manifest.json is accessible
- Verify service worker registration in Safari Developer Tools

### Icons Not Showing

- Clear Safari cache: Settings → Safari → Clear History and Website Data
- Ensure icon files exist and are accessible
- Check file paths in manifest.json

### App Opens in Safari Instead of Standalone

- Delete the home screen icon and re-add it
- Check `display: "standalone"` in manifest.json
- Ensure you're using Safari (not Chrome on iOS)

### Capacitor Build Issues

- Run `npx cap sync ios` after every build
- Clean build folder: Product → Clean Build Folder in Xcode
- Check Xcode console for specific errors

## Additional Resources

- [Apple PWA Guidelines](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

## Next Steps

1. Generate all required icon and splash screen assets
2. Test the PWA on an actual iOS device
3. Consider implementing push notifications (requires native app)
4. Add iOS-specific features like haptic feedback
5. Optimize performance for mobile devices

