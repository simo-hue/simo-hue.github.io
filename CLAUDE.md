# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hugo-based website built with the Hugoplate theme, using TailwindCSS for styling. The site uses Hugo modules for extended functionality and is configured for multilingual support (though currently set to English only).

## Development Commands

### Local Development
- `npm run dev` - Start Hugo development server with live reload
- `npm run preview` - Start production preview server with minification

### Building
- `npm run build` - Build production site with minification and optimization
- `npm run format` - Format code using Prettier

### Utility Scripts
- `npm run project-setup` - Initialize new project setup
- `npm run theme-setup` - Setup theme configuration
- `npm run update-theme` - Update to latest theme version
- `npm run update-modules` - Update Hugo modules
- `npm run remove-darkmode` - Remove dark mode functionality

## Architecture

### Site Structure
- **content/english/**: All content files organized by sections (blog, pages, etc.)
- **config/_default/**: Hugo configuration split into multiple files
- **assets/**: Static assets including images, icons, and CSS
- **themes/hugoplate/**: Theme files with layouts and theme-specific assets
- **data/**: Site data files (theme.json, social.json)

### Configuration Architecture
Hugo configuration is split across multiple files:
- `hugo.toml` - Main site configuration
- `config/_default/params.toml` - Theme parameters and feature toggles
- `config/_default/languages.toml` - Multilingual configuration
- `config/_default/menus.en.toml` - Navigation menus
- `config/_default/module.toml` - Hugo module configuration

### Theme System
The site uses Hugo modules extensively for functionality:
- Core theme: `themes/hugoplate/`
- Extended modules from `github.com/gethugothemes/hugo-modules/` including:
  - Search functionality
  - SEO tools
  - Social sharing
  - Image processing
  - Modal/accordion components

### Content Organization
- Content is organized under `content/english/` with sections for:
  - Blog posts
  - Static pages
  - Author information
  - Homepage sections
- Supports taxonomies (categories, tags)
- Multi-author support enabled

### CV/Resume Functionality
- **Homepage "View My CV / Resume" button**: Opens PDF in new tab (`docs/Resume.pdf`)
- **Navigation "Download my Personal Resume" button**: Downloads PDF file directly
- PDF stored in `static/docs/Resume.pdf` for direct Hugo serving
- Custom templates with proper URL handling:
  - `layouts/index.html`: Custom homepage template with target="_blank" support
  - `layouts/partials/essentials/header.html`: Custom header with download attribute
- Use relative paths (without leading slash) for proper baseURL handling

### Styling
- TailwindCSS as primary CSS framework
- Custom CSS in `assets/css/custom.css`
- Theme uses custom Tailwind plugins in `tailwind-plugin/`
- Dark mode support with theme switcher

## Key Files to Modify

### Content
- `content/english/_index.md` - Homepage content
- `content/english/blog/` - Blog posts
- `content/english/pages/` - Static pages
- `content/english/sections/` - Homepage sections

### Configuration
- `config/_default/params.toml` - Site features, contact forms, SEO
- `config/_default/menus.en.toml` - Navigation structure
- `data/social.json` - Social media links
- `hugo.toml` - Base URL, site title, basic settings

### Styling
- `assets/css/custom.css` - Custom styles
- `tailwind-plugin/tw-theme.js` - Theme configuration

## Hugo Module System

This site uses Hugo modules for extended functionality. To work with modules:
- `hugo mod get -u ./...` - Update all modules
- `hugo mod tidy` - Clean up module dependencies
- Module configurations are in `config/_default/module.toml`
- Dependencies defined in `go.mod`

## Deployment

The site is configured for multiple deployment platforms:
- **GitHub Pages**:
  - Repository: `https://github.com/simo-hue/simo-hue.github.io` (main site)
  - Base URL: `https://simo-hue.github.io`
  - Workflow: `.github/workflows/hugo.yml`
  - Requires GitHub Pages to be enabled in repository settings
- **Netlify**: Configuration in `netlify.toml`
- **Vercel**: Configuration in `vercel.json` with build script `vercel-build.sh`
- **AWS Amplify**: Configuration in `amplify.yml`

### GitHub Pages Setup Requirements
1. Repository settings → Pages → Source: "GitHub Actions"
2. Ensure repository is public or has GitHub Pro/Team for private repos
3. Workflow will automatically deploy on push to main branch

## Content Management

- Content files use Hugo's front matter (YAML/TOML)
- Images should be placed in `assets/images/` or `static/images/`
- Icons are stored in `assets/icons/` as SVG files
- Use Hugo shortcodes for enhanced content (buttons, notices, etc.)