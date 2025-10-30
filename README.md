# Developer Tools Blog - Article Template

A **visually engaging and professional single-article page template** designed specifically for blogs focused on Coding Tools and Developer Technologies. This template features a modern, clean design with dark/light theme support, syntax-highlighted code blocks, and exceptional readability.

![Template Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Theme Support](https://img.shields.io/badge/Themes-Dark%20%7C%20Light-blue)
![Responsive](https://img.shields.io/badge/Design-Fully%20Responsive-orange)

## 🎨 Design Features

### Visual Theme
- **Dual Theme Support**: Seamless dark and light theme with instant toggle
- **Modern Color Palette**: 
  - Electric blue (`#00d4ff`) primary accent
  - Neon green (`#00ff88`) secondary accent
  - Deep orange (`#ff6b35`) warning/alert accent
  - Professional backgrounds (charcoal/navy for dark, crisp white for light)
- **High Contrast**: Optimized for readability with developer-focused aesthetics

### Typography
- **Technical Font**: Source Code Pro for headings and code
- **Body Font**: Inter for comfortable reading
- **Optimized Line Height**: 1.8 for body text, ensuring excellent readability
- **Responsive Sizing**: Scales beautifully across all devices

### Code Presentation
The template features **industry-leading code block styling**:
- **Syntax Highlighting**: Professional color scheme (Monokai-inspired)
- **Language Tags**: Clear badges indicating code type (JSON, JavaScript, Bash, HTTP)
- **Copy Button**: One-click code copying with visual feedback
- **Multiple Styles**: 
  - Standard code blocks
  - API request/response examples
  - Terminal commands with authentic styling (black background, green text)
- **Filename Display**: Shows file names for context
- **Line Wrapping**: Horizontal scroll for long lines

## 📋 Template Structure

### 1. Article Header
```html
- Hero Illustration (animated SVG)
- Prominent Title (gradient text effect)
- Metadata (Author, Date, Read Time with icons)
```

### 2. Content Sections
- **Lead Paragraph**: Highlighted introduction with border accent
- **Section Headings**: Icon + gradient underline
- **Key Concept Boxes**: Highlighted definitions with icon headers
- **Custom Lists**: 
  - Checkmark bullets for feature lists
  - Arrow bullets for action items
  - Numbered badges for step-by-step guides

### 3. Code Examples
Multiple code block types demonstrated:
- JSON configuration files
- JavaScript/Node.js code
- HTTP API requests
- Terminal/Bash commands

### 4. Visual Elements
- **Workflow Diagrams**: SVG-based flow charts
- **Icons**: Contextual line-art icons for sections
- **Illustrations**: Animated network diagrams
- **Concept Boxes**: Color-coded callouts (info, warning)

### 5. Call-to-Action
- **Prominent CTA Section**: Gradient background with pulse animation
- **Primary Action Button**: Download/Subscribe with hover effects
- **Secondary Links**: Newsletter, community links

## 🚀 Usage

### Quick Start

1. **Clone or Download** the template files:
   ```bash
   git clone <repository-url>
   ```

2. **Open in Browser**:
   ```bash
   open article-template.html
   ```

3. **Customize Content**:
   - Replace article title, author, and date
   - Update code examples
   - Modify sections as needed

### File Structure

```
project-root/
│
├── article-template.html    # Main HTML template
├── styles.css               # Complete stylesheet with themes
└── README.md               # This documentation
```

### Customization Guide

#### Changing Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --accent-primary: #00d4ff;      /* Main accent color */
    --accent-secondary: #0099ff;    /* Secondary accent */
    --accent-tertiary: #00ff88;     /* Tertiary accent */
    --accent-orange: #ff6b35;       /* Warning/alert color */
}
```

#### Adding New Sections

Use this template structure:

```html
<section class="content-section">
    <h2 class="section-heading">
        <svg class="heading-icon" width="32" height="32">
            <!-- SVG icon path -->
        </svg>
        Your Section Title
    </h2>
    
    <p>Your content here...</p>
</section>
```

#### Code Block Template

```html
<div class="code-block-wrapper">
    <div class="code-header">
        <span class="language-tag">LANGUAGE</span>
        <span class="code-filename">filename.ext</span>
        <button class="copy-button" onclick="copyCode(this)">
            <!-- Copy icon SVG -->
            Copy
        </button>
    </div>
    <pre class="code-content"><code>Your code here</code></pre>
</div>
```

## 🎯 Key Features

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Breakpoints**: 
  - Mobile: < 480px
  - Tablet: 480px - 768px
  - Desktop: > 768px

### Accessibility
- **Keyboard Navigation**: Full keyboard support with visible focus indicators
- **Screen Readers**: Semantic HTML with proper ARIA labels
- **Color Contrast**: WCAG 2.1 AA compliant
- **Reduced Motion**: Respects user's motion preferences

### Performance
- **Lightweight**: No external dependencies except Google Fonts
- **Fast Loading**: Optimized CSS and inline JavaScript
- **Print Friendly**: Dedicated print styles

### Interactive Elements
- **Theme Toggle**: Persistent theme selection (localStorage)
- **Copy Code**: One-click code copying
- **Smooth Scrolling**: Anchor link navigation
- **Hover Effects**: Subtle animations on interactive elements

## 🔧 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Breakpoints

| Device | Width | Adjustments |
|--------|-------|-------------|
| Mobile | < 480px | Single column, larger touch targets |
| Tablet | 480px - 768px | Adjusted typography, flexible layout |
| Desktop | > 768px | Full layout, side-by-side elements |

## 🎨 Design Elements Showcase

### Typography Scale
```
- Article Title: 3rem (48px)
- Section Headings: 2rem (32px)
- Body Text: 1.1rem (17.6px)
- Code: 0.95rem (15.2px)
```

### Spacing System
```css
--spacing-xs:  0.5rem  (8px)
--spacing-sm:  1rem    (16px)
--spacing-md:  1.5rem  (24px)
--spacing-lg:  2rem    (32px)
--spacing-xl:  3rem    (48px)
--spacing-xxl: 4rem    (64px)
```

### Border Radius
```css
--radius-sm:  4px   (subtle)
--radius-md:  8px   (standard)
--radius-lg:  12px  (prominent)
--radius-xl:  16px  (hero elements)
```

## 🌟 Best Practices

### Content Guidelines

1. **Headings**: Use descriptive, action-oriented section titles
2. **Code Examples**: Always include context and explanations
3. **Lists**: Break complex information into scannable bullet points
4. **Images**: Use SVG for icons and diagrams (scalable, theme-aware)

### Code Block Usage

- **Short Snippets**: Use inline `<code>` tags
- **Full Examples**: Use code block wrappers with language tags
- **Terminal Commands**: Use the terminal-specific styling
- **API Calls**: Use the API example variant

### Performance Tips

- Keep code blocks under 50 lines when possible
- Use lazy loading for images/diagrams in long articles
- Minimize custom fonts (currently uses 2 font families)

## 📄 License

This template is free to use for personal and commercial projects. Attribution is appreciated but not required.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Share your customizations

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Reach out via email
- Check the documentation

---

**Built with ❤️ for the Developer Community**

*Making technical content beautiful, one article at a time.*
