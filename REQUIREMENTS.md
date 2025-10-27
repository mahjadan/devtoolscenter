# DevTools Center - Project Requirements

## 🎯 Goal

Build a static website offering free developer utilities (like JSON formatter, encoder/decoder, JWT decoder, etc.) to attract global developer traffic and monetize through Google AdSense.

The site should be fast, SEO-friendly, responsive, and easily deployable to Cloudflare Pages via GitHub.

**Domain:** devtoolscenter.com

## 🧩 Core Requirements

### Technical Requirements

- ✅ Entire site must be static HTML/JS/CSS (no backend)
- ✅ Each tool must be a separate page (sub-path), e.g.:
  - `/json-formatter/`
  - `/jwt-decoder/`
  - `/regex-tester/`
  - `/jsonpath-tester/`
  - `/yaml-to-json/`
  - `/url-encode-decode/`
  - `/base64-encode-decode/`
  - `/uuid-generator/`
- ✅ Build system: Eleventy (11ty) for layouts, templating, and scalability
- ✅ Deploy via Cloudflare Pages, integrated with GitHub (automatic deploy on push)

## 🧱 Structure & Content

### Project Structure

```
/src/
  /tools/           - Individual tool pages (markdown + frontmatter)
  /layouts/         - Page templates (base, tool, etc.)
  /partials/        - Reusable components (header, footer, nav)
  /assets/
    /css/           - Styles (Tailwind CSS)
    /js/            - Tool logic + utilities
    /images/        - Icons, logos
  /blog/            - Future blog posts (optional)
  /pages/           - Legal & info pages
  sitemap.xml       - Auto-generated
  robots.txt        - Search engine directives
```

## ⚙️ Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (no framework for tools)
- **Build:** Eleventy (11ty) for static generation
- **Styling:** Tailwind CSS
- **Hosting:** Cloudflare Pages (connected to GitHub)
- **Analytics:** Cloudflare Web Analytics (initially), GA4 optional
- **Ads:** Google AdSense integration (future - not in initial build)
- **Version Control:** GitHub (main branch = production)

## 🧠 SEO & Performance Best Practices

### SEO

- ✅ Clean URL paths (no subdomains for tools)
- ✅ Unique meta tags per page:
  - `<title>`: Include main keyword + site name
  - `<meta description>`: Summarize function
- ✅ Structured data (JSON-LD):
  - Use Schema.org SoftwareApplication for each tool page
  - Use WebSite schema for homepage
- ✅ Internal linking: Cross-link related tools
- ✅ Sitemap.xml & robots.txt auto-generated
- ✅ Open Graph and Twitter Card meta tags

### Performance

- ✅ Inline critical CSS, defer non-critical JS
- ✅ Use Cloudflare cache headers
- ✅ Lazy-load images (if any)
- ✅ Optimize mobile layout (responsive, fast)
- ✅ Minify HTML/CSS/JS in production

## 💰 Monetization (Future Phase)

### AdSense Preparation (To Be Added Later)

- Prepare ad placeholders (top banner, sidebar, sticky footer)
- Ensure layout compliance with AdSense policies (no intrusive ads)
- Add Privacy Policy section about ads/cookies
- Use Consent Mode for cookies (GDPR/LGPD friendly)

**Note:** AdSense integration is intentionally excluded from initial build and will be added in a future update.

## 🔐 Legal & Compliance Pages

- ✅ `/privacy-policy/` - GDPR/LGPD compliant privacy policy
- ✅ `/terms-of-service/` - Terms of use for the website
- ✅ `/about/` - About the site and mission
- ✅ `/contact/` - Contact information

Each with clean design, consistent header/footer.

## 🚀 Deployment Workflow

- ✅ Repository hosted on GitHub
- ✅ Build and deploy on Cloudflare Pages automatically
- ✅ Directory output: `_site` (Eleventy default)
- ✅ GitHub integration runs `npm run build` then publishes output
- ✅ Build command: `npm run build`
- ✅ Build output directory: `_site`
- ✅ Node version: 18 (specified in `.nvmrc`)

## 🪄 UI / Design Guidelines

- ✅ Minimalist, clean developer aesthetic
- ✅ Light/dark mode toggle
  - System preference detection + manual toggle
  - Persisted in localStorage
- ✅ Use monospace fonts for code blocks (Fira Code)
- ✅ Color palette: neutral (blue/gray background, green accent)
- ✅ No heavy animations, instant response for tool actions
- ✅ Include "copy result" button on all tools
- ✅ Keyboard shortcuts (where applicable)

## 🧮 Initial Tools

### 1. JSON Formatter & Validator ✅
- Format (beautify) JSON
- Minify JSON
- Validate with error messages
- Copy result button

### 2. YAML ↔ JSON Converter ✅
- Convert YAML to JSON
- Convert JSON to YAML
- Bidirectional conversion
- Basic YAML parser

### 3. URL Encoder / Decoder ✅
- Encode URL (encodeURI)
- Decode URL (decodeURI)
- Encode URI Component (encodeURIComponent)
- Decode URI Component (decodeURIComponent)

### 4. JWT Decoder ✅
- Decode JWT header and payload
- Display token information (algorithm, expiration)
- No signature verification (client-side only)
- Auto-decode on input

### 5. Regex Tester ✅
- Test regex patterns against text
- Support for g, i, m flags
- Highlight matches
- Display capture groups

### 6. JSONPath Tester ✅
- Test JSONPath expressions
- Query JSON data
- Basic JSONPath implementation
- Display results

### 7. Base64 Encoder / Decoder ✅
- Encode text to Base64
- Decode Base64 to text
- UTF-8 support
- Copy result button

### 8. UUID Generator ✅
- Generate UUID v4
- Bulk generation (up to 100)
- Options: uppercase, with/without hyphens
- Auto-generate on page load

## ✅ Deliverable Checklist

- [x] Static site built with Eleventy + Tailwind CSS
- [x] All 8 tools implemented and functional
- [x] Homepage with tool directory
- [x] Legal pages (Privacy, Terms, About, Contact)
- [x] SEO optimization (meta tags, structured data, sitemap)
- [x] Dark/light mode with system preference detection
- [x] Responsive design (mobile-friendly)
- [x] Deployment configuration for Cloudflare Pages
- [x] Documentation (README.md, this file)
- [x] Clean, professional design
- [x] Fast performance (client-side processing)
- [x] Privacy-focused (no data collection)

## 📝 Future Enhancements

### Phase 2 (Potential Features)
- Additional tools based on user feedback
- Blog section for SEO content
- Google AdSense integration
- Cookie consent banner
- More advanced tool features
- Keyboard shortcuts system
- Tool favorites/bookmarking
- History/recent tools
- Share tool results via URL
- Export results as files

### Additional Tools (Ideas)
- Hash Generator (MD5, SHA-1, SHA-256)
- Markdown Editor/Previewer
- Color Converter (HEX, RGB, HSL)
- Timestamp Converter
- HTML Entity Encoder/Decoder
- SQL Formatter
- CSS Minifier/Beautifier
- Image to Base64 Converter
- QR Code Generator
- Lorem Ipsum Generator

## 📊 Success Metrics (Future)

- Organic search traffic
- Tool usage statistics
- User engagement (time on site, pages per session)
- Mobile vs desktop usage
- Geographic distribution of users
- Popular tools/pages
- AdSense revenue (when implemented)

---

**Project Status:** ✅ Initial Build Complete
**Last Updated:** October 27, 2025

