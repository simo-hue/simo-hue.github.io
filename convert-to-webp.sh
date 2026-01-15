#!/bin/bash

# WebP Conversion Script - High Quality (90)
# Converts all PNG/JPG/JPEG to WebP format

QUALITY=90
CONVERTED=0
SKIPPED=0
ERRORS=0

echo "🔄 Starting WebP conversion (Quality: $QUALITY)..."
echo ""

# Function to convert image
convert_image() {
    local input="$1"
    local output="${input%.*}.webp"
    
    # Skip if WebP already exists
    if [ -f "$output" ]; then
        echo "⏭️  Skipped: $input (WebP exists)"
        ((SKIPPED++))
        return
    fi
    
    # Convert with high quality
    if cwebp -q $QUALITY "$input" -o "$output" 2>/dev/null; then
        # Get file sizes
        local original_size=$(stat -f%z "$input" 2>/dev/null || stat -c%s "$input" 2>/dev/null)
        local webp_size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
        local savings=$((100 - (webp_size * 100 / original_size)))
        
        echo "✅ Converted: $input → $output (${savings}% smaller)"
        ((CONVERTED++))
    else
        echo "❌ Error: $input"
        ((ERRORS++))
    fi
}

# Convert images in static/
echo "📁 Converting static/images..."
find static -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) | while read img; do
    convert_image "$img"
done

# Convert images in content/
echo ""
echo "📁 Converting content/ images..."
find content -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) | while read img; do
    convert_image "$img"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Conversion Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Converted: $CONVERTED"
echo "⏭️  Skipped:   $SKIPPED"
echo "❌ Errors:    $ERRORS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 Conversion complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Test the site: npm run dev"
echo "   2. Check images display correctly"
echo "   3. Optional: Delete original PNG/JPG files"
echo "   4. Commit changes: git add . && git commit -m 'optimize: convert images to WebP'"
