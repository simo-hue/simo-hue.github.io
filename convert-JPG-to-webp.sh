#!/bin/bash

# Convert remaining .JPG (uppercase) files to WebP
# Quality: 90 (maximum quality)

QUALITY=90
CONVERTED=0
SKIPPED=0
ERRORS=0

echo "🔄 Converting remaining .JPG files to WebP (Quality: $QUALITY)..."
echo ""

# Find all .JPG files (uppercase)
while IFS= read -r jpg_file; do
    # Create webp filename (lowercase extension)
    webp_file="${jpg_file%.JPG}.webp"
    
    # Check if WebP already exists
    if [ -f "$webp_file" ]; then
        echo "⏭️  Exists: $webp_file"
        ((SKIPPED++))
    else
        # Convert to WebP
        if cwebp -q $QUALITY "$jpg_file" -o "$webp_file" 2>/dev/null; then
            # Get file sizes
            original_size=$(stat -f%z "$jpg_file" 2>/dev/null || stat -c%s "$jpg_file" 2>/dev/null)
            webp_size=$(stat -f%z "$webp_file" 2>/dev/null || stat -c%s "$webp_file" 2>/dev/null)
            savings=$((100 - (webp_size * 100 / original_size)))
            
            echo "✅ Converted: $(basename "$jpg_file") → .webp (${savings}% smaller)"
            ((CONVERTED++))
        else
            echo "❌ Error: $jpg_file"
            ((ERRORS++))
        fi
    fi
done < <(find content static -type f -name "*.JPG" 2>/dev/null)

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Conversion Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Converted: $CONVERTED"
echo "⏭️  Skipped:   $SKIPPED"
echo "❌ Errors:    $ERRORS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Update markdown references .JPG → .webp
echo "🔄 Updating markdown references..."
echo ""

UPDATED=0
while IFS= read -r file; do
    # Backup
    cp "$file" "$file.bak"
    
    # Replace .JPG with .webp in markdown image syntax
    sed -i '' 's/\(!\[.*\]([^)]*\)\.JPG)/\1.webp)/g' "$file"
    
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
echo "🎉 All .JPG files converted and references updated!"
echo ""
echo "📝 Next: hugo --quiet && npm run dev"
