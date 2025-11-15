#!/bin/bash
# Script to generate iOS app icons and splash screens
# Requires ImageMagick: brew install imagemagick

set -e

echo "📱 Generating iOS Assets for Inkwoven"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "${YELLOW}⚠️  ImageMagick not found. Installing...${NC}"
    if command -v brew &> /dev/null; then
        brew install imagemagick
    else
        echo "Please install ImageMagick manually: https://imagemagick.org/script/download.php"
        exit 1
    fi
fi

# Check if source icon exists
SOURCE_ICON="public/icon-512.png"
if [ ! -f "$SOURCE_ICON" ]; then
    echo "${YELLOW}⚠️  Source icon not found at $SOURCE_ICON${NC}"
    echo "Please create a 512x512px icon first and place it at $SOURCE_ICON"
    exit 1
fi

# Create directories
echo "📁 Creating directories..."
mkdir -p public/icons
mkdir -p public/splash
mkdir -p public/screenshots

# Generate iOS app icons
echo ""
echo "🎨 Generating iOS app icons..."
ICON_SIZES=(57 60 72 76 114 120 144 152 180)

for size in "${ICON_SIZES[@]}"; do
    echo "  Creating apple-icon-${size}x${size}.png"
    convert "$SOURCE_ICON" -resize "${size}x${size}" "public/icons/apple-icon-${size}x${size}.png"
done

# Create fallback apple-touch-icon
echo "  Creating apple-touch-icon.png (180x180)"
cp "public/icons/apple-icon-180x180.png" "public/apple-touch-icon.png"

# Generate splash screens
echo ""
echo "🖼️  Generating splash screens..."

# iPhone SE (320x568 @2x = 640x1136)
convert "$SOURCE_ICON" -resize 640x1136 -gravity center -background white -extent 640x1136 "public/splash/iphone-se.png"

# iPhone 8 (375x667 @2x = 750x1334)
convert "$SOURCE_ICON" -resize 750x1334 -gravity center -background white -extent 750x1334 "public/splash/iphone-8.png"

# iPhone 8 Plus (414x736 @3x = 1242x2208)
convert "$SOURCE_ICON" -resize 1242x2208 -gravity center -background white -extent 1242x2208 "public/splash/iphone-8-plus.png"

# iPhone X (375x812 @3x = 1125x2436)
convert "$SOURCE_ICON" -resize 1125x2436 -gravity center -background white -extent 1125x2436 "public/splash/iphone-x.png"

# iPhone XS Max (414x896 @3x = 1242x2688)
convert "$SOURCE_ICON" -resize 1242x2688 -gravity center -background white -extent 1242x2688 "public/splash/iphone-xs-max.png"

# iPad (768x1024 @2x = 1536x2048)
convert "$SOURCE_ICON" -resize 1536x2048 -gravity center -background white -extent 1536x2048 "public/splash/ipad.png"

# iPad Pro (1024x1366 @2x = 2048x2732)
convert "$SOURCE_ICON" -resize 2048x2732 -gravity center -background white -extent 2048x2732 "public/splash/ipad-pro.png"

# Generate screenshots (placeholder - you should replace these with actual screenshots)
echo ""
echo "📸 Generating placeholder screenshots..."
echo "  ${YELLOW}Note: Replace these with actual app screenshots${NC}"

# iPhone SE screenshot (320x568)
convert "$SOURCE_ICON" -resize 320x568 -gravity center -background "#fdf9f4" -extent 320x568 "public/screenshots/iphone-se.png"

# iPad screenshot (768x1024)
convert "$SOURCE_ICON" -resize 768x1024 -gravity center -background "#fdf9f4" -extent 768x1024 "public/screenshots/ipad.png"

echo ""
echo "${GREEN}✅ iOS assets generated successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Review the generated icons and splash screens"
echo "2. Replace placeholder screenshots with actual app screenshots"
echo "3. Test the PWA on an iOS device"
echo "4. Consider using Capacitor for native iOS app (see docs/IOS_SETUP.md)"

