#!/bin/bash

# Image Optimization Script for Hugo Site
# This script optimizes all JPG, JPEG, and PNG images in the content directory
# Reduces file size while maintaining good quality

set -e

echo "🖼️  Image Optimization Script"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo -e "${RED}❌ ImageMagick not found!${NC}"
    echo "Installing ImageMagick..."
    if command -v brew &> /dev/null; then
        brew install imagemagick
    else
        echo -e "${RED}Please install Homebrew first: https://brew.sh${NC}"
        exit 1
    fi
fi

# Check if jpegoptim is installed
if ! command -v jpegoptim &> /dev/null; then
    echo -e "${YELLOW}Installing jpegoptim...${NC}"
    brew install jpegoptim
fi

# Check if optipng is installed
if ! command -v optipng &> /dev/null; then
    echo -e "${YELLOW}Installing optipng...${NC}"
    brew install optipng
fi

echo -e "${GREEN}✅ All required tools installed!${NC}"
echo ""

# Base directory
BASE_DIR="/Users/simo/Downloads/DEV/simo-hue.github.io"
CONTENT_DIR="$BASE_DIR/content"
ASSETS_DIR="$BASE_DIR/assets"

# Create backup directory
BACKUP_DIR="$BASE_DIR/backup-images-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📁 Creating backup in: $BACKUP_DIR"
echo ""

# Statistics
TOTAL_ORIGINAL_SIZE=0
TOTAL_OPTIMIZED_SIZE=0
FILES_PROCESSED=0

# Function to get file size in bytes
get_size() {
    stat -f%z "$1" 2>/dev/null || stat -c%s "$1" 2>/dev/null
}

# Function to format bytes to human readable
format_size() {
    local size=$1
    if [ $size -ge 1073741824 ]; then
        echo "$(echo "scale=2; $size/1073741824" | bc)GB"
    elif [ $size -ge 1048576 ]; then
        echo "$(echo "scale=2; $size/1048576" | bc)MB"
    elif [ $size -ge 1024 ]; then
        echo "$(echo "scale=2; $size/1024" | bc)KB"
    else
        echo "${size}B"
    fi
}

# Function to optimize JPG/JPEG
optimize_jpg() {
    local file="$1"
    local original_size=$(get_size "$file")

    # Backup original
    cp "$file" "$BACKUP_DIR/"

    # Resize if too large (max 1920px width)
    convert "$file" -resize '1920x1920>' -quality 85 -strip "$file"

    # Further optimize with jpegoptim
    jpegoptim --max=85 --strip-all --preserve --quiet "$file" 2>/dev/null || true

    local new_size=$(get_size "$file")
    local saved=$((original_size - new_size))
    local percent=0

    if [ $original_size -gt 0 ]; then
        percent=$((100 * saved / original_size))
    fi

    echo -e "${GREEN}✓${NC} $(basename "$file"): $(format_size $original_size) → $(format_size $new_size) (${percent}% saved)"

    TOTAL_ORIGINAL_SIZE=$((TOTAL_ORIGINAL_SIZE + original_size))
    TOTAL_OPTIMIZED_SIZE=$((TOTAL_OPTIMIZED_SIZE + new_size))
    FILES_PROCESSED=$((FILES_PROCESSED + 1))
}

# Function to optimize PNG
optimize_png() {
    local file="$1"
    local original_size=$(get_size "$file")

    # Backup original
    cp "$file" "$BACKUP_DIR/"

    # Resize if too large (max 1920px width)
    convert "$file" -resize '1920x1920>' -strip "$file"

    # Optimize with optipng
    optipng -quiet -o2 -strip all "$file" 2>/dev/null || true

    local new_size=$(get_size "$file")
    local saved=$((original_size - new_size))
    local percent=0

    if [ $original_size -gt 0 ]; then
        percent=$((100 * saved / original_size))
    fi

    echo -e "${GREEN}✓${NC} $(basename "$file"): $(format_size $original_size) → $(format_size $new_size) (${percent}% saved)"

    TOTAL_ORIGINAL_SIZE=$((TOTAL_ORIGINAL_SIZE + original_size))
    TOTAL_OPTIMIZED_SIZE=$((TOTAL_OPTIMIZED_SIZE + new_size))
    FILES_PROCESSED=$((FILES_PROCESSED + 1))
}

echo "🔍 Finding images to optimize..."
echo ""

# Process JPG/JPEG files in content
echo "📸 Optimizing JPG/JPEG images..."
while IFS= read -r -d '' file; do
    optimize_jpg "$file"
done < <(find "$CONTENT_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.JPG" -o -iname "*.JPEG" \) -print0)

echo ""
echo "🖼️  Optimizing PNG images..."
while IFS= read -r -d '' file; do
    optimize_png "$file"
done < <(find "$CONTENT_DIR" -type f \( -iname "*.png" -o -iname "*.PNG" \) -print0)

# Process assets if they exist
if [ -d "$ASSETS_DIR" ]; then
    echo ""
    echo "📦 Optimizing assets images..."
    while IFS= read -r -d '' file; do
        optimize_jpg "$file"
    done < <(find "$ASSETS_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.JPG" -o -iname "*.JPEG" \) -print0 2>/dev/null)

    while IFS= read -r -d '' file; do
        optimize_png "$file"
    done < <(find "$ASSETS_DIR" -type f \( -iname "*.png" -o -iname "*.PNG" \) -print0 2>/dev/null)
fi

echo ""
echo "=============================="
echo -e "${GREEN}🎉 OPTIMIZATION COMPLETE!${NC}"
echo "=============================="
echo ""
echo "📊 Statistics:"
echo "   Files processed: $FILES_PROCESSED"
echo "   Original size:   $(format_size $TOTAL_ORIGINAL_SIZE)"
echo "   Optimized size:  $(format_size $TOTAL_OPTIMIZED_SIZE)"
echo "   Space saved:     $(format_size $((TOTAL_ORIGINAL_SIZE - TOTAL_OPTIMIZED_SIZE)))"

if [ $TOTAL_ORIGINAL_SIZE -gt 0 ]; then
    TOTAL_PERCENT=$((100 * (TOTAL_ORIGINAL_SIZE - TOTAL_OPTIMIZED_SIZE) / TOTAL_ORIGINAL_SIZE))
    echo "   Reduction:       ${TOTAL_PERCENT}%"
fi

echo ""
echo "💾 Original images backed up to:"
echo "   $BACKUP_DIR"
echo ""
echo -e "${GREEN}✅ Done! Your images are now optimized!${NC}"
echo ""
