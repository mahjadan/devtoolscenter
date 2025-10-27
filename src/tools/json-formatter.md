---
layout: layouts/tool.njk
title: JSON Formatter & Validator
description: Free online JSON formatter and validator. Format, beautify, and validate JSON data with syntax highlighting and error detection.
permalink: /json-formatter/
icon: 📋
order: 1
pageScript: /assets/js/tools/json-formatter.js
keywords: json formatter, json validator, json beautifier, format json, validate json
relatedTools:
  - /yaml-to-json/
  - /base64-encode-decode/
  - /jsonpath-tester/
schema:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "JSON Formatter & Validator"
  operatingSystem: "Web"
  applicationCategory: "DeveloperApplication"
  url: "https://devtoolscenter.com/json-formatter/"
  description: "Free online JSON Formatter and Validator with syntax highlighting and error detection"
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
---

<div class="space-y-6">
  <div>
    <label for="json-input" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      Input JSON
    </label>
    <textarea 
      id="json-input" 
      class="tool-textarea"
      placeholder='{"name":"John","age":30,"city":"New York"}'
    ></textarea>
  </div>
  
  <div class="flex flex-wrap gap-3">
    <button id="format-btn" class="btn btn-primary">Format JSON</button>
    <button id="minify-btn" class="btn btn-secondary">Minify</button>
    <button id="validate-btn" class="btn btn-secondary">Validate Only</button>
    <button id="copy-btn" class="btn btn-accent">Copy Result</button>
    <button id="clear-btn" class="btn btn-secondary">Clear</button>
  </div>
  
  <div id="error-message" class="hidden p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg">
    <p class="text-red-700 dark:text-red-400 font-medium"></p>
  </div>
  
  <div>
    <label for="json-output" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      Formatted Output
    </label>
    <textarea 
      id="json-output" 
      class="tool-textarea"
      readonly
    ></textarea>
  </div>
</div>

<div class="mt-12 prose dark:prose-invert max-w-none">
  <h2>About JSON Formatter</h2>
  <p>
    This JSON formatter and validator helps you format, beautify, and validate JSON data. 
    It provides clear error messages when your JSON is invalid and can both format (prettify) 
    and minify JSON strings.
  </p>
  
  <h3>Features</h3>
  <ul>
    <li>Format and beautify JSON with proper indentation</li>
    <li>Minify JSON by removing whitespace</li>
    <li>Validate JSON syntax with detailed error messages</li>
    <li>Copy formatted output with one click</li>
    <li>Works entirely in your browser - your data stays private</li>
  </ul>
  
  <h3>How to Use</h3>
  <ol>
    <li>Paste your JSON data into the input textarea</li>
    <li>Click "Format JSON" to beautify or "Minify" to compress</li>
    <li>If there are syntax errors, they will be highlighted with line numbers</li>
    <li>Use "Copy Result" to copy the formatted JSON to your clipboard</li>
  </ol>
</div>

