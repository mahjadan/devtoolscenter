---
layout: layouts/tool.njk
title: URL Encoder / Decoder
description: Encode and decode URLs and URI components. Free online URL encoder and decoder with support for query strings and special characters.
permalink: /url-encode-decode/
icon: 🔗
order: 3
pageScript: /assets/js/tools/url-encoder.js
keywords: url encoder, url decoder, uri encode, percent encoding, url escape
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

<div class="mt-12 prose dark:prose-invert max-w-none">
  <h2>About URL Encoder / Decoder</h2>
  <p>
    URL encoding (also known as percent-encoding) is a mechanism for encoding information in a Uniform Resource 
    Identifier (URI). This tool helps you encode and decode URLs and URI components.
  </p>
  
  <h3>Features</h3>
  <ul>
    <li>Encode full URLs with <code>encodeURI()</code></li>
    <li>Decode full URLs with <code>decodeURI()</code></li>
    <li>Encode URI components with <code>encodeURIComponent()</code></li>
    <li>Decode URI components with <code>decodeURIComponent()</code></li>
    <li>Handles special characters and UTF-8 encoding</li>
  </ul>
  
  <h3>When to Use</h3>
  <ul>
    <li><strong>Encode URL:</strong> When you need to encode a complete URL (preserves :, /, ?, &, =)</li>
    <li><strong>Encode Component:</strong> When encoding query parameters or path segments (encodes all special chars)</li>
    <li><strong>Decode URL:</strong> To decode a complete encoded URL</li>
    <li><strong>Decode Component:</strong> To decode individual URI components</li>
  </ul>
  
  <h3>Examples</h3>
  <p><strong>Original:</strong> <code>hello world & special chars!</code></p>
  <p><strong>Encoded Component:</strong> <code>hello%20world%20%26%20special%20chars!</code></p>
</div>

