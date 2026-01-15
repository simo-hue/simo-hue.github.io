#!/bin/bash

# Update all markdown image references to use WebP
# Replaces .png, .jpg, .jpeg with .webp in markdown image syntax

echo "🔄 Updating image references in markdown files..."
echo ""

UPDATED=0
TOTAL=0

# Find all markdown files
while IFS= read -r file; do
    ((TOTAL++))
    
    # Create backup
    cp "$file" "$file.bak"
    
    # Replace image extensions in markdown image syntax
    sed -i '' \
        -e 's/\(!\[.*\]([^)]*\)\.png)/\1.webp)/g' \
        -e 's/\(!\[.*\]([^)]*\)\.jpg)/\1.webp)/g' \
        -e 's/\(!\[.*\]([^)]*\)\.jpeg)/\1.webp)/g' \
        "$file"
    
    # Check if file was modified
    if ! diff -q "$file" "$file.bak" > /dev/null 2>&1; then
        echo "✅ Updated: $file"
        ((UPDATED++))
        rm "$file.bak"
    else
        # Restore backup if no changes
        mv "$file.bak" "$file"
    fi
done < <(find content -type f -name "*.md")

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Update Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Files processed: $TOTAL"
echo "✅ Files updated:   $UPDATED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 All markdown files now reference WebP images!"
echo ""
echo "📝 Next steps:"
echo "   1. Test: npm run dev"
echo "   2. Check images display correctly"
echo "   3. Rebuild: hugo --quiet"
echo "   4. Commit: git add content && git commit -m 'optimize: use WebP images in markdown'"
