---
layout: layouts/tool.njk
title: Regex Tester
description: Test and debug regular expressions online. Free regex tester with match highlighting, groups, and explanation.
permalink: /regex-tester/
icon: 🔍
order: 5
pageScript: /assets/js/tools/regex-tester.js
keywords: regex tester, regular expression, regex debugger, test regex, regex validator
tags:
  - tools
  - regex
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
      name: "Regex Tester"
      item: "https://devtoolscenter.com/regex-tester/"
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

<div class="mt-12 p-6 bg-gradient-to-r from-primary-50 via-primary-100/50 to-accent-50 dark:from-gray-800 dark:via-primary-900/30 dark:to-gray-800 rounded-lg border-2 border-primary-300 dark:border-primary-500/50 shadow-md dark:shadow-lg dark:shadow-primary-900/20">
  <h2 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white">About Regex Tester</h2>
  <p class="text-gray-700 dark:text-gray-300 mb-4">
    Test and debug regular expressions with real-time feedback, match highlighting, and capture group visualization. 
    Supports global, case-insensitive, and multiline flags for flexible pattern matching.
  </p>
  <a href="/blog/mastering-regular-expressions/" class="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:underline">
    Learn more about regular expressions and best practices →
  </a>
</div>

