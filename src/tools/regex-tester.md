---
layout: layouts/tool.njk
title: Regex Tester
description: Test and debug regular expressions online. Free regex tester with match highlighting, groups, and explanation.
permalink: /regex-tester/
icon: 🔍
order: 5
pageScript: /assets/js/tools/regex-tester.js
keywords: regex tester, regular expression, regex debugger, test regex, regex validator
relatedTools:
  - /json-formatter/
  - /url-encode-decode/
schema:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Regex Tester"
  operatingSystem: "Web"
  applicationCategory: "DeveloperApplication"
  url: "https://devtoolscenter.com/regex-tester/"
  description: "Test and debug regular expressions with match highlighting and groups"
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
---

<div class="space-y-6">
  <div>
    <label for="regex-pattern" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      Regular Expression Pattern
    </label>
    <input 
      type="text"
      id="regex-pattern" 
      class="w-full p-3 font-mono text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      placeholder="^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$"
    />
  </div>
  
  <div class="flex flex-wrap gap-3">
    <label class="flex items-center space-x-2">
      <input type="checkbox" id="flag-g" class="w-4 h-4" checked>
      <span class="text-sm text-gray-700 dark:text-gray-300">Global (g)</span>
    </label>
    <label class="flex items-center space-x-2">
      <input type="checkbox" id="flag-i" class="w-4 h-4">
      <span class="text-sm text-gray-700 dark:text-gray-300">Case Insensitive (i)</span>
    </label>
    <label class="flex items-center space-x-2">
      <input type="checkbox" id="flag-m" class="w-4 h-4">
      <span class="text-sm text-gray-700 dark:text-gray-300">Multiline (m)</span>
    </label>
  </div>
  
  <div>
    <label for="test-string" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      Test String
    </label>
    <textarea 
      id="test-string" 
      class="tool-textarea"
      placeholder="Enter your test string here..."
    ></textarea>
  </div>
  
  <div class="flex flex-wrap gap-3">
    <button id="test-btn" class="btn btn-primary">Test Regex</button>
    <button id="clear-btn" class="btn btn-secondary">Clear</button>
  </div>
  
  <div id="error-message" class="hidden p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg">
    <p class="text-red-700 dark:text-red-400 font-medium"></p>
  </div>
  
  <div id="matches-section" class="hidden">
    <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Matches</h3>
    <div id="matches-output" class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600">
    </div>
  </div>
  
  <div id="groups-section" class="hidden">
    <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Capture Groups</h3>
    <div id="groups-output" class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600">
    </div>
  </div>
</div>

<div class="mt-12 prose dark:prose-invert max-w-none">
  <h2>About Regex Tester</h2>
  <p>
    A regular expression (regex) is a sequence of characters that defines a search pattern. This tool helps you 
    test and debug your regular expressions with real-time feedback and match highlighting.
  </p>
  
  <h3>Features</h3>
  <ul>
    <li>Test regex patterns against sample text</li>
    <li>Support for global, case-insensitive, and multiline flags</li>
    <li>Highlight all matches in the test string</li>
    <li>Display capture groups and their values</li>
    <li>Real-time pattern validation</li>
  </ul>
  
  <h3>Common Regex Patterns</h3>
  <ul>
    <li><strong>Email:</strong> <code>^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$</code></li>
    <li><strong>URL:</strong> <code>https?://[\w\-]+(\.[\w\-]+)+[/#?]?.*$</code></li>
    <li><strong>Phone:</strong> <code>^\+?[\d\s\-()]+$</code></li>
    <li><strong>Hex Color:</strong> <code>^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$</code></li>
  </ul>
</div>

