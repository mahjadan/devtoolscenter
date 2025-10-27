---
layout: layouts/tool.njk
title: YAML to JSON Converter
description: Convert between YAML and JSON formats instantly. Free online YAML to JSON and JSON to YAML converter with validation.
permalink: /yaml-to-json/
icon: 🔄
order: 2
pageScript: /assets/js/tools/yaml-converter.js
keywords: yaml to json, json to yaml, yaml converter, convert yaml, yaml parser
relatedTools:
  - /json-formatter/
  - /base64-encode-decode/
schema:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "YAML to JSON Converter"
  operatingSystem: "Web"
  applicationCategory: "DeveloperApplication"
  url: "https://devtoolscenter.com/yaml-to-json/"
  description: "Convert between YAML and JSON formats with validation"
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
---

<div class="space-y-6">
  <div>
    <label for="yaml-input" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      Input (YAML or JSON)
    </label>
    <textarea 
      id="yaml-input" 
      class="tool-textarea"
      placeholder="name: John&#10;age: 30&#10;city: New York"
    ></textarea>
  </div>
  
  <div class="flex flex-wrap gap-3">
    <button id="yaml-to-json-btn" class="btn btn-primary">YAML → JSON</button>
    <button id="json-to-yaml-btn" class="btn btn-primary">JSON → YAML</button>
    <button id="copy-btn" class="btn btn-accent">Copy Result</button>
    <button id="clear-btn" class="btn btn-secondary">Clear</button>
  </div>
  
  <div id="error-message" class="hidden p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg">
    <p class="text-red-700 dark:text-red-400 font-medium"></p>
  </div>
  
  <div>
    <label for="yaml-output" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      Output
    </label>
    <textarea 
      id="yaml-output" 
      class="tool-textarea"
      readonly
    ></textarea>
  </div>
</div>

<div class="mt-12 prose dark:prose-invert max-w-none">
  <h2>About YAML to JSON Converter</h2>
  <p>
    This tool converts between YAML and JSON formats bidirectionally. YAML (YAML Ain't Markup Language) 
    is a human-readable data serialization format commonly used for configuration files.
  </p>
  
  <h3>Features</h3>
  <ul>
    <li>Convert YAML to JSON format</li>
    <li>Convert JSON to YAML format</li>
    <li>Automatic format detection</li>
    <li>Syntax validation and error reporting</li>
    <li>Preserves data types and structure</li>
  </ul>
  
  <h3>How to Use</h3>
  <ol>
    <li>Paste your YAML or JSON data into the input field</li>
    <li>Click "YAML → JSON" or "JSON → YAML" depending on your conversion direction</li>
    <li>The converted output will appear in the output field</li>
    <li>Click "Copy Result" to copy to your clipboard</li>
  </ol>
  
  <h3>Note</h3>
  <p>
    This is a basic YAML converter using a simple parser. For complex YAML features like anchors, 
    aliases, or multi-line strings, you may need a more advanced parser.
  </p>
</div>

