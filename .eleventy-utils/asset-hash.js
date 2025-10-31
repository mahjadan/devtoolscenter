const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

/**
 * Generate a content hash for a file
 * @param {string} filePath - Path to the file
 * @returns {string} - 8-character hex hash
 */
function generateHash(filePath) {
  const content = fs.readFileSync(filePath);
  const hash = crypto.createHash("md5").update(content).digest("hex");
  return hash.substring(0, 8);
}

/**
 * Create a hashed filename by inserting the hash before the extension
 * @param {string} originalPath - Original file path (e.g., /assets/css/styles.css)
 * @param {string} hash - Content hash
 * @returns {string} - Hashed path (e.g., /assets/css/styles.abc12345.css)
 */
function createHashedPath(originalPath, hash) {
  const ext = path.extname(originalPath);
  const basename = path.basename(originalPath, ext);
  const dirname = path.dirname(originalPath);
  return path.join(dirname, `${basename}.${hash}${ext}`);
}

/**
 * Hash assets and create manifest
 * @param {string} srcDir - Source directory (src)
 * @param {string} outputDir - Output directory (_site)
 * @param {string[]} assetPaths - Array of asset paths relative to src (e.g., ['assets/css/styles.css'])
 * @returns {Object} - Manifest mapping original paths to hashed paths
 */
function hashAssets(srcDir, outputDir, assetPaths) {
  const manifest = {};
  const outputBase = outputDir;

  for (const assetPath of assetPaths) {
    const srcPath = path.join(srcDir, assetPath);
    
    // Skip if file doesn't exist (e.g., CSS might not be built yet in dev mode)
    if (!fs.existsSync(srcPath)) {
      continue;
    }

    const hash = generateHash(srcPath);
    const hashedPath = createHashedPath(assetPath, hash);
    const outputPath = path.join(outputBase, hashedPath);
    const outputDirPath = path.dirname(outputPath);

    // Ensure output directory exists
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
    }

    // Copy file with hashed name
    fs.copyFileSync(srcPath, outputPath);

    // Store in manifest
    // Use normalized paths (forward slashes) for web URLs
    const normalizedOriginal = assetPath.replace(/\\/g, "/");
    const normalizedHashed = hashedPath.replace(/\\/g, "/");
    manifest[normalizedOriginal] = normalizedHashed;

    console.log(`✓ Fingerprinted: ${normalizedOriginal} → ${normalizedHashed}`);
  }

  return manifest;
}

/**
 * Get all JavaScript files from a directory recursively
 * @param {string} dir - Directory to scan
 * @param {string} basePath - Base path for relative paths
 * @returns {string[]} - Array of relative file paths
 */
function getJsFiles(dir, basePath = "") {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(basePath, entry.name).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      files.push(...getJsFiles(fullPath, relPath));
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      files.push(relPath);
    }
  }

  return files;
}

module.exports = {
  generateHash,
  createHashedPath,
  hashAssets,
  getJsFiles,
};

