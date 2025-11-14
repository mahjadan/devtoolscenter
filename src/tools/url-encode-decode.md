---
layout: layouts/tool.njk
title: URL Encoder / Decoder
description: Encode and decode URLs and URI components. Free online URL encoder and decoder with support for query strings and special characters.
permalink: /url-encode-decode/
icon: 🔗
order: 3
pageScript: /assets/js/tools/url-encoder.js
keywords: url encoder, url decoder, uri encode, percent encoding, url escape
tags:
  - tools
  - url
relatedTools:
  - /base64-encode-decode/
  - /json-formatter/
schema:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "URL Encoder / Decoder"
  operatingSystem: "Web"
  applicationCategory: "DeveloperApplication"
  url: "https://devtoolscenter.com/url-encode-decode/"
  description: "Encode and decode URLs and URI components with support for special characters"
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
      name: "URL Encoder / Decoder"
      item: "https://devtoolscenter.com/url-encode-decode/"
---

<div class="space-y-6">
  <div>
    <label for="url-input" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      Input Text / URL
    </label>
    <textarea 
      id="url-input" 
      class="tool-textarea"
      placeholder="https://example.com/search?q=hello world&lang=en"
    ></textarea>
  </div>
  
  <div class="flex flex-wrap gap-3">
    <button id="encode-btn" class="btn btn-primary">Encode URL</button>
    <button id="decode-btn" class="btn btn-primary">Decode URL</button>
    <button id="encode-component-btn" class="btn btn-secondary">Encode Component</button>
    <button id="decode-component-btn" class="btn btn-secondary">Decode Component</button>
    <button id="copy-btn" class="btn btn-accent">Copy Result</button>
    <button id="clear-btn" class="btn btn-secondary">Clear</button>
  </div>
  
  <div id="error-message" class="hidden p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg">
    <p class="text-red-700 dark:text-red-400 font-medium"></p>
  </div>
  
  <div>
    <label for="url-output" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      Output
    </label>
    <textarea 
      id="url-output" 
      class="tool-textarea"
      readonly
    ></textarea>
  </div>
</div>

<div class="mt-12 p-6 bg-gradient-to-r from-primary-50 via-primary-100/50 to-accent-50 dark:from-gray-800 dark:via-primary-900/30 dark:to-gray-800 rounded-lg border-2 border-primary-300 dark:border-primary-500/50 shadow-md dark:shadow-lg dark:shadow-primary-900/20">
  <h2 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white">About URL Encoder / Decoder</h2>
  <p class="text-gray-700 dark:text-gray-300 mb-4">
    URL encoding (percent-encoding) converts special characters to be safely transmitted in URLs. 
    Encode full URLs or individual components, and decode them back to readable text.
  </p>
  <a href="/blog/understanding-url-encoding/" class="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:underline">
    Learn more about URL encoding and best practices →
  </a>
</div>

