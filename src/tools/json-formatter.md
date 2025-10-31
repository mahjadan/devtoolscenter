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
      name: "JSON Formatter"
      item: "https://devtoolscenter.com/json-formatter/"
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
    <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      Formatted Output
    </label>
    <div 
      id="json-output" 
      class="w-full min-h-[200px] p-4 font-mono text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 overflow-auto whitespace-pre-wrap break-words"
    ></div>
  </div>
</div>

<div class="mt-12 p-6 bg-gradient-to-r from-primary-50 via-primary-100/50 to-accent-50 dark:from-gray-800 dark:via-primary-900/30 dark:to-gray-800 rounded-lg border-2 border-primary-300 dark:border-primary-500/50 shadow-md dark:shadow-lg dark:shadow-primary-900/20">
  <h2 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white">About JSON Formatter</h2>
  <p class="text-gray-700 dark:text-gray-300 mb-4">
    Format, beautify, and validate JSON data with syntax highlighting and error detection. 
    This tool works entirely in your browser, keeping your data private and secure.
  </p>
  <a href="/blog/understanding-json-formatting/" class="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:underline">
    Learn more about JSON formatting and best practices →
  </a>
</div>

