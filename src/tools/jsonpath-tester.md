---
layout: layouts/tool.njk
title: JSONPath Tester
description: Test JSONPath expressions against JSON data. Free online JSONPath tester and query tool.
permalink: /jsonpath-tester/
icon: 🎯
order: 6
pageScript: /assets/js/tools/jsonpath-tester.js
keywords: jsonpath tester, jsonpath query, json query, test jsonpath, jsonpath expression
relatedTools:
  - /json-formatter/
  - /regex-tester/
schema:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "JSONPath Tester"
  operatingSystem: "Web"
  applicationCategory: "DeveloperApplication"
  url: "https://devtoolscenter.com/jsonpath-tester/"
  description: "Test JSONPath expressions against JSON data with real-time results"
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
---

<div class="space-y-6">
  <div>
    <label for="json-input" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      JSON Data
    </label>
    <textarea 
      id="json-input" 
      class="tool-textarea"
      placeholder='{"users":[{"name":"John","age":30},{"name":"Jane","age":25}]}'
    ></textarea>
  </div>
  
  <div>
    <label for="jsonpath-input" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      JSONPath Expression
    </label>
    <input 
      type="text"
      id="jsonpath-input" 
      class="w-full p-3 font-mono text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      placeholder="$.users[*].name"
    />
  </div>
  
  <div class="flex flex-wrap gap-3">
    <button id="test-btn" class="btn btn-primary">Test JSONPath</button>
    <button id="clear-btn" class="btn btn-secondary">Clear</button>
  </div>
  
  <div id="error-message" class="hidden p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg">
    <p class="text-red-700 dark:text-red-400 font-medium"></p>
  </div>
  
  <div>
    <label for="jsonpath-output" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      Result
    </label>
    <textarea 
      id="jsonpath-output" 
      class="tool-textarea"
      readonly
    ></textarea>
  </div>
  
  <div class="p-4 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 rounded-lg">
    <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">Common JSONPath Expressions</h3>
    <div class="space-y-1 text-sm text-blue-800 dark:text-blue-200 font-mono">
      <p><strong>$</strong> - Root object</p>
      <p><strong>$.store.book[*].author</strong> - All authors</p>
      <p><strong>$..author</strong> - All authors (recursive)</p>
      <p><strong>$.store.*</strong> - All things in store</p>
      <p><strong>$..book[0,1]</strong> - First two books</p>
      <p><strong>$..book[?(@.price < 10)]</strong> - Books cheaper than 10</p>
    </div>
  </div>
</div>

<div class="mt-12 prose dark:prose-invert max-w-none">
  <h2>About JSONPath</h2>
  <p>
    JSONPath is a query language for JSON, similar to XPath for XML. It allows you to extract specific 
    data from JSON documents using path expressions.
  </p>
  
  <h3>Features</h3>
  <ul>
    <li>Test JSONPath expressions against JSON data</li>
    <li>Real-time query evaluation</li>
    <li>Support for basic JSONPath syntax</li>
    <li>Clear error messages for invalid queries</li>
    <li>Formatted JSON output</li>
  </ul>
  
  <h3>JSONPath Syntax</h3>
  <ul>
    <li><strong>$</strong> - Root element</li>
    <li><strong>@</strong> - Current element (in filters)</li>
    <li><strong>.</strong> or <strong>[]</strong> - Child operator</li>
    <li><strong>..</strong> - Recursive descent</li>
    <li><strong>*</strong> - Wildcard (all elements)</li>
    <li><strong>[]</strong> - Array subscript</li>
    <li><strong>[,]</strong> - Array indices or names</li>
    <li><strong>[start:end:step]</strong> - Array slice</li>
  </ul>
  
  <h3>Note</h3>
  <p>
    This is a basic JSONPath implementation. Advanced features like filters and complex expressions 
    may have limited support. For production use, consider using a full-featured JSONPath library.
  </p>
</div>

