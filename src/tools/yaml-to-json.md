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
breadcrumbSchema:
  "@context": "https://schema.org"
  "@type": "BreadcrumbList"
  itemListElement:
    - "@type": "ListItem"
      position: 1
      name: "Home"
      item: "https://devtoolscenter.com/"
    - "@type": "ListItem"
      position: 2
      name: "YAML to JSON Converter"
      item: "https://devtoolscenter.com/yaml-to-json/"
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

<div class="mt-12 p-6 bg-gradient-to-r from-primary-50 via-primary-100/50 to-accent-50 dark:from-gray-800 dark:via-primary-900/30 dark:to-gray-800 rounded-lg border-2 border-primary-300 dark:border-primary-500/50 shadow-md dark:shadow-lg dark:shadow-primary-900/20">
  <h2 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white">About YAML to JSON Converter</h2>
  <p class="text-gray-700 dark:text-gray-300 mb-4">
    Convert between YAML and JSON formats bidirectionally with automatic format detection and validation. 
    Perfect for configuration files and data transformation between formats.
  </p>
  <a href="/blog/yaml-vs-json/" class="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:underline">
    Learn more about YAML vs JSON and when to use each →
  </a>
</div>

