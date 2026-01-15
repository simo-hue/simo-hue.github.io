#!/bin/bash

# Convert ALL remaining PNG files to WebP
# Handles both .png and .PNG (case insensitive)
# Quality: 90 (maximum quality)

QUALITY=90
CONVERTED=0
SKIPPED=0
ERRORS=0
TOTAL=0

echo "🔄 Converting ALL PNG files to WebP (Quality: $QUALITY)..."
echo ""

# Function to convert image
convert_image() {
    local input="$1"
    local base="${input%.*}"
    local webp_file="${base}.webp"
    
    ((TOTAL++))
    
    # Skip if WebP already exists
    if [ -f "$webp_file" ]; then
        echo "⏭️  Exists: $(basename "$webp_file")"
        ((SKIPPED++))
        return
    fi
    
    # Convert to WebP
    if cwebp -q $QUALITY "$input" -o "$webp_file" 2>/dev/null; then
        # Get file sizes
        local original_size=$(stat -f%z "$input" 2>/dev/null || stat -c%s "$input" 2>/dev/null)
        local webp_size=$(stat -f%z "$webp_file" 2>/dev/null || stat -c%s "$webp_file" 2>/dev/null)
        local savings=$((100 - (webp_size * 100 / original_size)))
        
        echo "✅ Converted: $(basename "$input") → .webp (${savings}% smaller)"
        ((CONVERTED++))
    else
        echo "❌ Error: $input"
        ((ERRORS++))
    fi
}

# Convert .png files (lowercase)
echo "📁 Converting .png files..."
while IFS= read -r file; do
    convert_image "$file"
done < <(find content static -type f -name "*.png" 2>/dev/null)

echo ""
echo "📁 Converting .PNG files (uppercase)..."
while IFS= read -r file; do
    convert_image "$file"
done < <(find content static -type f -name "*.PNG" 2>/dev/null)

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Conversion Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Total files found: $TOTAL"
echo "✅ Converted:         $CONVERTED"
echo "⏭️  Skipped:           $SKIPPED"
echo "❌ Errors:            $ERRORS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Update markdown references .png/.PNG → .webp
echo "🔄 Updating markdown references..."
echo ""

UPDATED=0
while IFS= read -r file; do
    # Backup
    cp "$file" "$file.bak"
    
    # Replace both .png and .PNG with .webp
    sed -i '' \
        -e 's/\(!\[.*\]([^)]*\)\.png)/\1.webp)/g' \
        -e 's/\(!\[.*\]([^)]*\)\.PNG)/\1.webp)/g' \
        "$file"
    
    # Check if modified
    if ! diff -q "$file" "$file.bak" > /dev/null 2>&1; then
        echo "✅ Updated: $file"
        ((UPDATED++))
        rm "$file.bak"
    else
        mv "$file.bak" "$file"
    fi
done < <(find content -type f -name "*.md")

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Markdown Update Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Files updated: $UPDATED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 All PNG files converted and references updated!"
echo ""
echo "📝 Next: hugo --quiet && npm run dev"
