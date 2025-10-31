const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const path = require("path");
const fs = require("fs");
const { hashAssets, getJsFiles } = require("./.eleventy-utils/asset-hash");

// Asset manifest - will be populated during build
let assetManifest = {};

module.exports = function(eleventyConfig) {
  // Sitemap plugin
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://devtoolscenter.com",
    },
  });

  // Syntax highlighting plugin
  eleventyConfig.addPlugin(syntaxHighlight);

  // Passthrough copy for assets
  // Note: JS files are passed through here, then hashed in afterBuild
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/_headers");

  // Create a collection for tools
  eleventyConfig.addCollection("tools", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/tools/*.md").sort((a, b) => {
      return (a.data.order || 999) - (b.data.order || 999);
    });
  });

  // Create a collection for blog posts
  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md").sort((a, b) => {
      return b.date - a.date; // Sort by date, newest first
    });
  });

  // Custom filter for JSON-LD structured data
  eleventyConfig.addFilter("jsonld", function(obj) {
    return JSON.stringify(obj);
  });

  // Custom filter for current year
  eleventyConfig.addFilter("year", () => `${new Date().getFullYear()}`);

  // Custom filter for array/collection size
  eleventyConfig.addFilter("size", function(array) {
    return array ? array.length : 0;
  });

  // Asset URL filter - returns hashed URL if available, otherwise original
  eleventyConfig.addFilter("assetUrl", function(assetPath) {
    // Normalize path (remove leading slash if present, ensure forward slashes)
    const normalized = assetPath.replace(/^\/+/, "").replace(/\\/g, "/");
    const hadLeadingSlash = assetPath.startsWith("/");
    
    // Get hashed path from manifest, or use original normalized path
    const hashedOrOriginal = assetManifest[normalized] || normalized;
    
    // Ensure leading slash if original had one
    return hadLeadingSlash ? `/${hashedOrOriginal}` : hashedOrOriginal;
  });

  // Before build hook - hash assets early so manifest is available for filters/transforms
  eleventyConfig.on("eleventy.before", function() {
    const srcDir = path.join(process.cwd(), "src");
    const outputDir = path.join(process.cwd(), "_site");
    const assetsToHash = [];
    
    // Hash JavaScript files from source
    const srcJsDir = path.join(srcDir, "assets/js");
    if (fs.existsSync(srcJsDir)) {
      const jsFiles = getJsFiles(srcJsDir, "assets/js");
      assetsToHash.push(...jsFiles.map(f => ({ srcPath: path.join(srcDir, f), assetPath: f })));
    }
    
    // Hash CSS file from output (built by Tailwind before Eleventy runs)
    const cssPath = "assets/css/styles.css";
    const cssFullPath = path.join(outputDir, cssPath);
    if (fs.existsSync(cssFullPath)) {
      assetsToHash.push({ srcPath: cssFullPath, assetPath: cssPath });
    }
    
    if (assetsToHash.length > 0) {
      console.log("\n🔐 Fingerprinting assets...");
      
      // Hash each asset and copy to output with hashed name
      for (const { srcPath, assetPath } of assetsToHash) {
        if (!fs.existsSync(srcPath)) {
          continue;
        }
        
        const { generateHash, createHashedPath } = require("./.eleventy-utils/asset-hash");
        const hash = generateHash(srcPath);
        const hashedPath = createHashedPath(assetPath, hash);
        const outputPath = path.join(outputDir, hashedPath);
        const outputDirPath = path.dirname(outputPath);
        
        // Ensure output directory exists
        if (!fs.existsSync(outputDirPath)) {
          fs.mkdirSync(outputDirPath, { recursive: true });
        }
        
        // Copy file with hashed name
        fs.copyFileSync(srcPath, outputPath);
        
        // Store in manifest
        const normalizedOriginal = assetPath.replace(/\\/g, "/");
        const normalizedHashed = hashedPath.replace(/\\/g, "/");
        assetManifest[normalizedOriginal] = normalizedHashed;
        
        console.log(`✓ Fingerprinted: ${normalizedOriginal} → ${normalizedHashed}`);
      }
      
      // Save manifest to output directory for reference
      const manifestPath = path.join(outputDir, "asset-manifest.json");
      fs.writeFileSync(manifestPath, JSON.stringify(assetManifest, null, 2));
      console.log(`✓ Asset manifest saved to ${manifestPath}\n`);
    }
  });

  // HTML Transform - replace asset URLs in output HTML (backup for any hardcoded URLs)
  eleventyConfig.addTransform("asset-urls", function(content, outputPath) {
    // Only process HTML files
    if (outputPath && outputPath.endsWith(".html") && Object.keys(assetManifest).length > 0) {
      // Replace all asset URLs with their hashed versions
      for (const [original, hashed] of Object.entries(assetManifest)) {
        // Escape special regex characters
        const escapedOriginal = original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        // Match src/href attributes with optional leading slash
        const regex = new RegExp(`(src|href)=(["'])/?${escapedOriginal}\\2`, "gi");
        content = content.replace(regex, (match, attr, quote) => {
          return `${attr}=${quote}/${hashed}${quote}`;
        });
      }
    }
    return content;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html", "xml"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};

