# Asset Fingerprinting Documentation

## Overview

This project uses **custom asset fingerprinting** to automatically add content-based hashes to CSS and JavaScript filenames. This ensures browsers always fetch the latest version of assets when content changes, solving cache invalidation issues.

## What is Asset Fingerprinting?

Asset fingerprinting (also called "cache busting") adds a unique hash to filenames based on file content. When a file changes, it gets a new hash, creating a new filename that browsers don't have cached.

**Example:**
- Original: `styles.css`
- Hashed: `styles.abc12345.css` (hash changes when CSS changes)
- New version: `styles.def67890.css` (new hash = new filename)

## How It Works

### 1. Build Process Flow

```
┌─────────────────────────────────────────┐
│  npm run build                          │
└──────────────┬──────────────────────────┘
               │
               ├─► 1. Tailwind builds CSS
               │   Output: _site/assets/css/styles.css
               │
               ├─► 2. Eleventy starts build
               │   └─► eleventy.before hook runs
               │       ├─► Hash CSS file
               │       ├─► Hash all JS files
               │       └─► Create hashed copies in _site/
               │
               ├─► 3. Templates processed
               │   └─► assetUrl filter converts paths
               │       /assets/css/styles.css → /assets/css/styles.abc12345.css
               │
               ├─► 4. HTML transform runs
               │   └─► Replaces any remaining hardcoded URLs
               │
               └─► 5. Build complete
                   └─► asset-manifest.json saved for reference
```

### 2. Components

#### Asset Hash Utility (`.eleventy-utils/asset-hash.js`)

Core functions for hashing files:

- **`generateHash(filePath)`** - Creates 8-character MD5 hash from file content
- **`createHashedPath(originalPath, hash)`** - Inserts hash before file extension
- **`hashAssets(srcDir, outputDir, assetPaths)`** - Processes and copies hashed files
- **`getJsFiles(dir, basePath)`** - Recursively finds all JavaScript files

#### Eleventy Configuration (`.eleventy.js`)

Three main components:

1. **`eleventy.before` Hook**
   - Runs before templates are processed
   - Hashes CSS (from `_site/` - already built by Tailwind)
   - Hashes JS files (from `src/` - copies to `_site/` with hash)
   - Creates manifest mapping original → hashed paths

2. **`assetUrl` Filter**
   - Used in templates: `{{ '/assets/css/styles.css' | assetUrl }}`
   - Looks up hashed path from manifest
   - Returns hashed path if available, original if not found

3. **`asset-urls` Transform**
   - Runs on all generated HTML files
   - Replaces hardcoded asset URLs with hashed versions
   - Acts as backup for any URLs not using the filter

### 3. Manifest File

A `asset-manifest.json` file is created in `_site/` during build:

```json
{
  "assets/css/styles.css": "assets/css/styles.abc12345.css",
  "assets/js/theme-toggle.js": "assets/js/theme-toggle.a1b2c3d4.js",
  "assets/js/tools/json-formatter.js": "assets/js/tools/json-formatter.x9y8z7w6.js",
  ...
}
```

This file is for reference/debugging - the system uses the in-memory manifest during build.

## Usage in Templates

### Base Template (`src/_includes/layouts/base.njk`)

Assets use the `assetUrl` filter:

```njk
{# CSS #}
<link rel="stylesheet" href="{{ '/assets/css/styles.css' | assetUrl }}">

{# JavaScript #}
<script src="{{ '/assets/js/theme-toggle.js' | assetUrl }}"></script>

{# Page-specific scripts #}
{% if pageScript %}
<script src="{{ pageScript | assetUrl }}" defer></script>
{% endif %}
```

### Tool Pages

Tool pages define `pageScript` in frontmatter:

```markdown
---
pageScript: /assets/js/tools/json-formatter.js
---
```

The base template automatically applies the filter, so:
- `/assets/js/tools/json-formatter.js`
- Becomes: `/assets/js/tools/json-formatter.x9y8z7w6.js`

## Files Fingerprinted

### CSS Files
- ✅ `assets/css/styles.css` → `assets/css/styles.{hash}.css`

### JavaScript Files
- ✅ `assets/js/theme-toggle.js` → `assets/js/theme-toggle.{hash}.js`
- ✅ `assets/js/tools/*.js` (all 8 tool scripts) → `assets/js/tools/*.{hash}.js`

### Not Fingerprinted
- ❌ Images (`assets/images/*`) - Use version numbers in filenames manually
- ❌ Other static files (robots.txt, _headers, etc.)

## Cache Headers

The `src/_headers` file sets long cache headers for assets:

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

With fingerprinting, this works perfectly:
- ✅ Browsers cache hashed files for 1 year (immutable)
- ✅ When content changes, filename changes (new hash)
- ✅ Browsers fetch new file automatically (new URL = cache miss)

## Development vs Production

### Development Mode

When running `npm run dev`:
- Fingerprinting still runs (for consistency)
- CSS is built to `_site/assets/css/styles.css` first
- Assets are hashed during Eleventy build
- Hot reload works normally

### Production Build

When running `npm run build`:
- Full fingerprinting process runs
- All assets get unique hashes
- HTML references updated automatically
- Optimized for long-term caching

## Troubleshooting

### Assets Not Updating in Browser

**Symptom:** Changes to CSS/JS don't appear after deploying.

**Solution:**
1. Check `asset-manifest.json` in `_site/` - verify hashes changed
2. Verify templates use `assetUrl` filter (check `base.njk`)
3. Clear browser cache or hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
4. Check HTML output - URLs should have hashes: `styles.abc12345.css`

### Build Errors

**Symptom:** Build fails with "file not found" errors.

**Possible causes:**
1. CSS not built yet - ensure `build:css` runs before Eleventy
2. Missing source files - check `src/assets/js/` exists
3. Permissions issue - ensure build can write to `_site/`

**Solution:**
```bash
# Clean build
rm -rf _site
npm run build
```

### Hash Not Changing

**Symptom:** Filename hash stays same after file changes.

**Possible causes:**
1. File content didn't actually change (whitespace, comments)
2. Build cache issue

**Solution:**
```bash
# Force rebuild
rm -rf _site
npm run build
```

## Adding New Assets

### Adding a New JavaScript File

1. Create file: `src/assets/js/my-script.js`
2. Reference in template: `{{ '/assets/js/my-script.js' | assetUrl }}`
3. Build automatically fingerprints it!

### Adding a New CSS File

1. Import in `src/assets/css/styles.css` (or Tailwind config)
2. Build CSS first: `npm run build:css`
3. Reference in template: `{{ '/assets/css/styles.css' | assetUrl }}`
4. Build automatically fingerprints it!

**Note:** Only one CSS file is currently built. Multiple CSS files would need build process updates.

## Technical Details

### Hash Algorithm

- **Algorithm:** MD5 (via Node.js `crypto` module)
- **Length:** 8 characters (first 8 hex digits)
- **Collision risk:** Extremely low for file content hashing
- **Performance:** Fast (milliseconds per file)

### File Matching

The system matches asset URLs in multiple ways:
1. **Template filter:** `{{ path | assetUrl }}` - preferred method
2. **HTML transform:** Regex replacement in output HTML
3. **Normalization:** Handles paths with/without leading slashes

### Performance Impact

- **Build time:** +100-200ms (negligible)
- **Runtime:** None (happens at build time)
- **Output size:** Same (just renamed files)

## Best Practices

### ✅ Do

- Always use `assetUrl` filter in templates
- Keep asset references consistent
- Test builds locally before deploying
- Check `asset-manifest.json` after builds

### ❌ Don't

- Hardcode asset paths in templates (use filter)
- Manually edit hashed filenames
- Skip the fingerprinting process
- Cache manifest file in git (it's build output)

## Configuration

### Disabling Fingerprinting

If needed, fingerprinting can be disabled by:

1. Removing `eleventy.before` hook in `.eleventy.js`
2. Removing `assetUrl` filter usage from templates
3. Reverting to direct asset paths

**Not recommended** - fingerprinting solves cache issues automatically.

### Custom Hash Length

Edit `.eleventy-utils/asset-hash.js`:

```javascript
function generateHash(filePath) {
  const hash = crypto.createHash("md5").update(content).digest("hex");
  return hash.substring(0, 12); // Change from 8 to 12 characters
}
```

Default 8 characters is recommended (balances uniqueness and URL length).

## Related Files

- `.eleventy.js` - Main configuration with hooks and filters
- `.eleventy-utils/asset-hash.js` - Hash utility functions
- `src/_includes/layouts/base.njk` - Template using `assetUrl` filter
- `src/_headers` - Cache headers configuration
- `_site/asset-manifest.json` - Build output manifest (git-ignored)

## Summary

Asset fingerprinting automatically:
- ✅ Adds content hashes to CSS/JS filenames
- ✅ Updates all HTML references
- ✅ Enables long-term caching (1 year)
- ✅ Ensures browsers fetch updated files
- ✅ Works seamlessly in dev and production

**No manual intervention required** - just build and deploy!

---

*Last Updated: Based on implementation using Eleventy 2.0+*

