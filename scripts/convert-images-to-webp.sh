#!/bin/bash

# Script to convert all non-WebP images to WebP and update references
# Usage: ./convert-images-to-webp.sh

set -e

CONTENT_DIR="/Users/simo/Downloads/simo-hue.github.io/content"
CONVERTED_COUNT=0
UPDATED_FILES_COUNT=0

echo "🔍 Searching for non-WebP image references in index.md files..."

# Find all index.md files with non-WebP image references
grep -rl --include="index.md" -E '\.(jpg|JPG|png|PNG)' "$CONTENT_DIR" | while read -r md_file; do
    echo "📄 Processing: $md_file"
    
    # Get the directory of the index.md file
    md_dir=$(dirname "$md_file")
    
    # Find all image references in this file
    grep -oE '[^/[:space:]"]+\.(jpg|JPG|png|PNG)' "$md_file" | sort -u | while read -r img_name; do
        # Check if it's a URL (skip external images)
        if [[ $img_name == http* ]]; then
            echo "  ⏭️  Skipping external image: $img_name"
            continue
        fi
        
        # Construct full path to the image
        img_path="$md_dir/$img_name"
        
        # Check if image exists
        if [ -f "$img_path" ]; then
            # Get base name without extension
            base_name="${img_name%.*}"
            webp_name="${base_name}.webp"
            webp_path="$md_dir/$webp_name"
            
            # Check if WebP version already exists
            if [ ! -f "$webp_path" ]; then
                echo "  🔄 Converting $img_name to WebP..."
                
                # Convert to WebP with quality 90
                if command -v cwebp &> /dev/null; then
                    cwebp -q 90 "$img_path" -o "$webp_path"
                    CONVERTED_COUNT=$((CONVERTED_COUNT + 1))
                    echo "  ✅ Created: $webp_name"
                elif command -v magick &> /dev/null; then
                    magick "$img_path" -quality 90 "$webp_path"
                    CONVERTED_COUNT=$((CONVERTED_COUNT + 1))
                    echo "  ✅ Created: $webp_name (using ImageMagick)"
                else
                    echo "  ⚠️  Neither cwebp nor ImageMagick found. Skipping conversion."
                    echo "  💡 Install with: brew install webp imagemagick"
                    continue
                fi
            else
                echo "  ✓ WebP version already exists: $webp_name"
            fi
            
            # Update reference in markdown file (case-sensitive for the original extension)
            if grep -q "$img_name" "$md_file"; then
                # Create backup
                cp "$md_file" "$md_file.backup"
                
                # Replace the image reference
                sed -i '' "s/${img_name}/${webp_name}/g" "$md_file"
                echo "  📝 Updated reference: $img_name → $webp_name"
                UPDATED_FILES_COUNT=$((UPDATED_FILES_COUNT + 1))
            fi
        else
            echo "  ❌ Image not found: $img_path"
        fi
    done
done

echo ""
echo "✅ Conversion complete!"
echo "📊 Statistics:"
echo "   - Images converted: $CONVERTED_COUNT"
echo "   - Files updated: $UPDATED_FILES_COUNT"
echo ""
echo "💡 Next steps:"
echo "   1. Review changes: git diff"
echo "   2. Test build: npm run build"
echo "   3. Commit: git add . && git commit -m 'perf: convert all images to WebP'"
