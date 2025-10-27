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

<div class="mt-12 prose dark:prose-invert max-w-none">
  <h2>About Base64 Encoding</h2>
  <p>
    Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. 
    It's commonly used to encode binary data for transmission over media designed to handle text.
  </p>
  
  <h3>Features</h3>
  <ul>
    <li>Encode text to Base64 format</li>
    <li>Decode Base64 strings back to text</li>
    <li>Support for UTF-8 encoding</li>
    <li>Handle special characters and unicode</li>
    <li>Copy results with one click</li>
  </ul>
  
  <h3>Common Use Cases</h3>
  <ul>
    <li><strong>Email Attachments:</strong> MIME email attachments are encoded in Base64</li>
    <li><strong>Data URIs:</strong> Embedding images in CSS or HTML</li>
    <li><strong>Authentication:</strong> HTTP Basic Authentication uses Base64</li>
    <li><strong>APIs:</strong> Some APIs require Base64-encoded data</li>
    <li><strong>Storage:</strong> Storing binary data in text-only systems</li>
  </ul>
  
  <h3>How It Works</h3>
  <p>
    Base64 encoding converts binary data into a set of 64 ASCII characters (A-Z, a-z, 0-9, +, /). 
    Every 3 bytes of binary data are represented by 4 Base64 characters. If the input length isn't 
    divisible by 3, padding characters (=) are added.
  </p>
  
  <h3>Example</h3>
  <p><strong>Original:</strong> <code>Hello, World!</code></p>
  <p><strong>Base64:</strong> <code>SGVsbG8sIFdvcmxkIQ==</code></p>
</div>

