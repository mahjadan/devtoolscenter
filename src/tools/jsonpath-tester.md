---
layout: layouts/tool.njk
title: JSONPath Tester
description: Test JSONPath expressions against JSON data. Free online JSONPath tester and query tool.
permalink: /jsonpath-tester/
icon: 🎯
order: 6
pageScript: /assets/js/tools/jsonpath-tester.js
keywords: jsonpath tester, jsonpath query, json query, test jsonpath, jsonpath expression
tags:
  - tools
  - jsonpath
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
      name: "JSONPath Tester"
      item: "https://devtoolscenter.com/jsonpath-tester/"
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

<div class="mt-12 p-6 bg-gradient-to-r from-primary-50 via-primary-100/50 to-accent-50 dark:from-gray-800 dark:via-primary-900/30 dark:to-gray-800 rounded-lg border-2 border-primary-300 dark:border-primary-500/50 shadow-md dark:shadow-lg dark:shadow-primary-900/20">
  <h2 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white">About JSONPath Tester</h2>
  <p class="text-gray-700 dark:text-gray-300 mb-4">
    Test JSONPath expressions against JSON data in real-time. JSONPath is a query language for JSON, 
    similar to XPath for XML, making it easy to extract specific data from complex JSON structures.
  </p>
  <a href="/blog/jsonpath-expressions-guide/" class="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:underline">
    Learn more about JSONPath syntax and advanced queries →
  </a>
</div>

