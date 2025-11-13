---
layout: layouts/tool.njk
title: UUID Generator
description: Generate random UUIDs (Universally Unique Identifiers). Free online UUID v4 generator with bulk generation support.
permalink: /uuid-generator/
icon: 🆔
order: 8
pageScript: /assets/js/tools/uuid-generator.js
keywords: uuid generator, generate uuid, random uuid, uuid v4, unique id generator
tags:
  - tools
  - uuid
relatedTools:
  - /json-formatter/
  - /base64-encode-decode/
schema:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "UUID Generator"
  operatingSystem: "Web"
  applicationCategory: "DeveloperApplication"
  url: "https://devtoolscenter.com/uuid-generator/"
  description: "Generate random UUIDs (v4) with support for bulk generation"
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
      name: "UUID Generator"
      item: "https://devtoolscenter.com/uuid-generator/"
---

<div class="space-y-6">
  <div class="flex items-center space-x-4">
    <div class="flex-1">
      <label for="uuid-count" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        Number of UUIDs to Generate
      </label>
      <input 
        type="number" 
        id="uuid-count" 
        min="1" 
        max="100" 
        value="1"
        class="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
    </div>
    
    <div class="flex-1 flex items-center space-x-2 pt-6">
      <label class="flex items-center space-x-2">
        <input type="checkbox" id="uppercase-check" class="w-4 h-4">
        <span class="text-sm text-gray-700 dark:text-gray-300">Uppercase</span>
      </label>
      <label class="flex items-center space-x-2">
        <input type="checkbox" id="hyphens-check" class="w-4 h-4" checked>
        <span class="text-sm text-gray-700 dark:text-gray-300">Include Hyphens</span>
      </label>
    </div>
  </div>
  
  <div class="flex flex-wrap gap-3">
    <button id="generate-btn" class="btn btn-primary">Generate UUID(s)</button>
    <button id="copy-btn" class="btn btn-accent">Copy All</button>
    <button id="clear-btn" class="btn btn-secondary">Clear</button>
  </div>
  
  <div id="error-message" class="hidden p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg">
    <p class="text-red-700 dark:text-red-400 font-medium"></p>
  </div>
  
  <div>
    <label for="uuid-output" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      Generated UUIDs
    </label>
    <textarea 
      id="uuid-output" 
      class="tool-textarea font-mono"
      readonly
    ></textarea>
  </div>
</div>

<div class="mt-12 p-6 bg-gradient-to-r from-primary-50 via-primary-100/50 to-accent-50 dark:from-gray-800 dark:via-primary-900/30 dark:to-gray-800 rounded-lg border-2 border-primary-300 dark:border-primary-500/50 shadow-md dark:shadow-lg dark:shadow-primary-900/20">
  <h2 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white">About UUID Generator</h2>
  <p class="text-gray-700 dark:text-gray-300 mb-4">
    Generate cryptographically strong random UUIDs (Version 4) for database keys, session IDs, file names, and unique identifiers. 
    Generate single or bulk UUIDs with options for formatting.
  </p>
  <a href="/blog/understanding-uuid-generation/" class="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:underline">
    Learn more about UUID generation and best practices →
  </a>
</div>

