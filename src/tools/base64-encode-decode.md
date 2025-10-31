---
layout: layouts/tool.njk
title: Base64 Encoder / Decoder
description: Encode and decode Base64 strings. Free online Base64 encoder and decoder supporting text and file conversion.
permalink: /base64-encode-decode/
icon: 🔤
order: 7
pageScript: /assets/js/tools/base64-encoder.js
keywords: base64 encoder, base64 decoder, encode base64, decode base64, base64 converter
relatedTools:
  - /url-encode-decode/
  - /json-formatter/
  - /jwt-decoder/
schema:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Base64 Encoder / Decoder"
  operatingSystem: "Web"
  applicationCategory: "DeveloperApplication"
  url: "https://devtoolscenter.com/base64-encode-decode/"
  description: "Encode and decode Base64 strings with support for text conversion"
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
      name: "Base64 Encoder / Decoder"
      item: "https://devtoolscenter.com/base64-encode-decode/"
---

<div class="space-y-6">
  <div>
    <label for="base64-input" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      Input Text
    </label>
    <textarea 
      id="base64-input" 
      class="tool-textarea"
      placeholder="Enter text to encode or Base64 string to decode..."
    ></textarea>
  </div>
  
  <div class="flex flex-wrap gap-3">
    <button id="encode-btn" class="btn btn-primary">Encode to Base64</button>
    <button id="decode-btn" class="btn btn-primary">Decode from Base64</button>
    <button id="copy-btn" class="btn btn-accent">Copy Result</button>
    <button id="clear-btn" class="btn btn-secondary">Clear</button>
  </div>
  
  <div id="error-message" class="hidden p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg">
    <p class="text-red-700 dark:text-red-400 font-medium"></p>
  </div>
  
  <div>
    <label for="base64-output" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      Output
    </label>
    <textarea 
      id="base64-output" 
      class="tool-textarea"
      readonly
    ></textarea>
  </div>
</div>

<div class="mt-12 p-6 bg-gradient-to-r from-primary-50 via-primary-100/50 to-accent-50 dark:from-gray-800 dark:via-primary-900/30 dark:to-gray-800 rounded-lg border-2 border-primary-300 dark:border-primary-500/50 shadow-md dark:shadow-lg dark:shadow-primary-900/20">
  <h2 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white">About Base64 Encoding</h2>
  <p class="text-gray-700 dark:text-gray-300 mb-4">
    Base64 is a binary-to-text encoding scheme commonly used for email attachments, data URIs, authentication, 
    and storing binary data in text-only systems. This tool supports UTF-8 encoding and handles special characters.
  </p>
  <a href="/blog/understanding-base64-encoding/" class="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:underline">
    Learn more about Base64 encoding and best practices →
  </a>
</div>

