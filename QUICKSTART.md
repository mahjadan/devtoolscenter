# Quick Start Guide - DevTools Center

## ⚡ Get Started in 3 Minutes

### 1. Install Dependencies

```bash
npm install
```

This will install:
- Eleventy (static site generator)
- Tailwind CSS (styling)
- PostCSS & Autoprefixer
- Sitemap plugin
- Other build tools

### 2. Start Development Server

```bash
npm run dev
```

This runs two processes in parallel:
- **Eleventy dev server** with live reload on `http://localhost:8080`
- **Tailwind CSS watcher** to rebuild styles on changes

Open your browser to `http://localhost:8080` and you'll see the homepage with all 8 tools!

### 3. Make Changes

The dev server watches for file changes and automatically rebuilds:

- **Edit templates:** `src/_includes/layouts/*.njk`
- **Edit tool pages:** `src/tools/*.md`
- **Edit styles:** `src/assets/css/styles.css` or `tailwind.config.js`
- **Edit JavaScript:** `src/assets/js/**/*.js`

Changes will be reflected immediately in your browser.

### 4. Build for Production

```bash
npm run build
```

This creates optimized production files in the `_site/` directory:
- Minified CSS
- Static HTML pages
- Copied JavaScript and assets

### 5. Test Production Build Locally

You can test the production build with any static server:

```bash
# Using Python
cd _site && python -m http.server 8000

# Using Node.js http-server (install globally first)
npx http-server _site -p 8000

# Using PHP
cd _site && php -S localhost:8000
```

Then visit `http://localhost:8000`

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development with live reload |
| `npm run build` | Build for production |
| `npm run dev:eleventy` | Run only Eleventy dev server |
| `npm run dev:css` | Run only Tailwind CSS watcher |
| `npm run build:css` | Build production CSS (minified) |
| `npm run build:eleventy` | Build static HTML with Eleventy |

## 🎯 Project Structure at a Glance

```
devtoolscenter/
├── src/                    # Source files
│   ├── _includes/          # Templates and layouts
│   │   ├── layouts/        # Page layouts (base, tool)
│   │   └── partials/       # Components (header, footer)
│   ├── assets/             # Static assets
│   │   ├── css/            # Tailwind CSS
│   │   ├── js/             # JavaScript files
│   │   └── images/         # Images and favicon
│   ├── tools/              # Tool pages (8 tools)
│   ├── pages/              # Legal pages
│   └── index.njk           # Homepage
├── _site/                  # Build output (git-ignored)
├── .eleventy.js            # Eleventy config
├── tailwind.config.js      # Tailwind config
└── package.json            # Dependencies
```

## 🧰 Available Tools

1. **JSON Formatter** - `/json-formatter/`
2. **YAML Converter** - `/yaml-to-json/`
3. **URL Encoder/Decoder** - `/url-encode-decode/`
4. **JWT Decoder** - `/jwt-decoder/`
5. **Regex Tester** - `/regex-tester/`
6. **JSONPath Tester** - `/jsonpath-tester/`
7. **Base64 Encoder/Decoder** - `/base64-encode-decode/`
8. **UUID Generator** - `/uuid-generator/`

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Your custom blue shades
  },
  accent: {
    // Your custom green shades
  }
}
```

### Add a New Tool

1. Create `src/tools/my-tool.md`:
```markdown
---
layout: layouts/tool.njk
title: My Tool
description: Description
permalink: /my-tool/
icon: 🔧
order: 9
pageScript: /assets/js/tools/my-tool.js
---
<!-- Tool HTML -->
```

2. Create `src/assets/js/tools/my-tool.js`:
```javascript
(function() {
  // Your tool logic
})();
```

3. The tool automatically appears on homepage!

## 🚀 Deploy to Cloudflare Pages

### Via GitHub Integration (Recommended)

1. Push code to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Pages → Create a project → Connect to Git
4. Select your repository
5. Configure:
   - **Build command:** `npm run build`
   - **Build output:** `_site`
   - **Environment variable:** `NODE_VERSION=18`
6. Click "Save and Deploy"

Your site will be live in minutes at `https://your-project.pages.dev`

### Add Custom Domain

1. In Cloudflare Pages → Your project → Custom domains
2. Click "Set up a custom domain"
3. Enter: `devtoolscenter.com`
4. Follow DNS configuration instructions
5. Your site will be live at `https://devtoolscenter.com`

## ✅ Checklist Before First Deploy

- [ ] Test all 8 tools locally
- [ ] Check dark mode toggle works
- [ ] Test on mobile (responsive design)
- [ ] Verify all links work (header, footer, related tools)
- [ ] Check legal pages (privacy, terms, about, contact)
- [ ] Update contact email in `src/pages/contact.md`
- [ ] Review SEO meta tags in each tool page
- [ ] Run `npm run build` successfully
- [ ] Test `_site` folder with local server

## 🐛 Troubleshooting

### Port 8080 Already in Use

```bash
# Find and kill the process using port 8080
lsof -ti:8080 | xargs kill -9

# Or use a different port
npx eleventy --serve --port=3000
```

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json _site
npm install
npm run build
```

### Styles Not Loading

Make sure both processes are running with `npm run dev`:
- Eleventy (generates HTML)
- Tailwind (compiles CSS)

### Dark Mode Not Persisting

Check browser console for localStorage errors. Some browsers block localStorage in private/incognito mode.

## 📚 Learn More

- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)

## 💡 Tips

- **Use Dark Mode:** Toggle in header (persists across visits)
- **Keyboard Shortcuts:** Ctrl/Cmd + Enter to format in JSON tool
- **Copy Results:** One-click copy button on all tools
- **Mobile Friendly:** All tools work great on phones
- **Offline:** Tools work without internet (client-side processing)

---

**Need Help?** See the full [README.md](README.md) or [REQUIREMENTS.md](REQUIREMENTS.md) for detailed information.

Happy coding! 🚀

