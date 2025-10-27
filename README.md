# DevTools Center

> Free online developer tools for formatting, validating, encoding, and testing

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](package.json)

## 🚀 Live Site

Visit [devtoolscenter.com](https://devtoolscenter.com) to use the tools.

## 📋 Overview

DevTools Center is a collection of free, privacy-focused developer utilities that run entirely in your browser. All tools are client-side, meaning your data never leaves your device.

### Available Tools

- **JSON Formatter & Validator** - Format, beautify, and validate JSON data
- **YAML to JSON Converter** - Convert between YAML and JSON formats
- **URL Encoder/Decoder** - Encode and decode URLs and URI components
- **JWT Decoder** - Decode and inspect JSON Web Tokens
- **Regex Tester** - Test and debug regular expressions
- **JSONPath Tester** - Query JSON data with JSONPath expressions
- **Base64 Encoder/Decoder** - Encode and decode Base64 strings
- **UUID Generator** - Generate random UUIDs (v4)

## 🛠️ Tech Stack

- **Static Site Generator:** [Eleventy](https://www.11ty.dev/) (11ty)
- **CSS Framework:** [Tailwind CSS](https://tailwindcss.com/)
- **JavaScript:** Vanilla JS (no frameworks)
- **Hosting:** [Cloudflare Pages](https://pages.cloudflare.com/)
- **Build Tool:** npm scripts

## 📦 Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd devtoolscenter
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

This will start:
- Eleventy dev server with live reload (port 8080)
- Tailwind CSS watcher

4. Open your browser to `http://localhost:8080`

## 🏗️ Build

To build the site for production:

```bash
npm run build
```

This will:
1. Build and minify Tailwind CSS
2. Generate static HTML with Eleventy
3. Output everything to `_site/` directory

## 📁 Project Structure

```
devtoolscenter/
├── src/
│   ├── _includes/
│   │   ├── layouts/          # Page layouts
│   │   │   ├── base.njk      # Base HTML template
│   │   │   └── tool.njk      # Tool page template
│   │   └── partials/         # Reusable components
│   │       ├── header.njk
│   │       ├── footer.njk
│   │       └── nav.njk
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css    # Tailwind input file
│   │   ├── js/
│   │   │   ├── theme-toggle.js
│   │   │   └── tools/        # Individual tool scripts
│   │   └── images/
│   ├── tools/                # Tool pages (markdown)
│   │   ├── json-formatter.md
│   │   ├── yaml-to-json.md
│   │   └── ...
│   ├── pages/                # Legal & info pages
│   │   ├── about.md
│   │   ├── contact.md
│   │   ├── privacy-policy.md
│   │   └── terms-of-service.md
│   ├── index.njk             # Homepage
│   ├── robots.txt
│   └── _headers              # Cloudflare headers
├── _site/                    # Build output (git-ignored)
├── .eleventy.js              # Eleventy config
├── tailwind.config.js        # Tailwind config
├── postcss.config.js         # PostCSS config
├── package.json
└── README.md
```

## 🎨 Customization

### Adding a New Tool

1. Create a new markdown file in `src/tools/`:

```markdown
---
layout: layouts/tool.njk
title: Your Tool Name
description: Tool description
permalink: /your-tool/
icon: 🔧
order: 9
pageScript: /assets/js/tools/your-tool.js
keywords: keyword1, keyword2
relatedTools:
  - /json-formatter/
  - /base64-encode-decode/
schema:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Your Tool Name"
  # ... more schema properties
---

<!-- Tool HTML here -->
```

2. Create the tool's JavaScript in `src/assets/js/tools/your-tool.js`

3. The tool will automatically appear on the homepage

### Styling

- Global styles: Edit `src/assets/css/styles.css`
- Tailwind config: Edit `tailwind.config.js`
- Colors, fonts, etc. can be customized in the Tailwind config

## 🚀 Deployment

### Cloudflare Pages

1. Push your code to GitHub
2. Log in to Cloudflare Dashboard
3. Go to Pages → Create a project
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `_site`
   - **Environment variables:** `NODE_VERSION=18`
6. Click "Save and Deploy"

Cloudflare will automatically deploy on every push to your main branch.

### Custom Domain

1. In Cloudflare Pages, go to your project
2. Navigate to "Custom domains"
3. Add your domain (devtoolscenter.com)
4. Follow DNS configuration instructions

## 🔒 Privacy & Security

- All tools run 100% client-side
- No data is sent to servers
- No user data is collected or stored
- Privacy-first analytics (optional)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

- Website: [devtoolscenter.com](https://devtoolscenter.com)
- Email: hello@devtoolscenter.com
- Contact Page: [devtoolscenter.com/contact](https://devtoolscenter.com/contact/)

## 🙏 Acknowledgments

- Built with [Eleventy](https://www.11ty.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Hosted on [Cloudflare Pages](https://pages.cloudflare.com/)

---

Made with ❤️ for developers worldwide

