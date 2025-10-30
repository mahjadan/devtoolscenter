---
layout: layouts/tool.njk
title: JWT Decoder
description: Decode and verify JSON Web Tokens (JWT). Free online JWT decoder with header and payload inspection.
permalink: /jwt-decoder/
icon: 🔐
order: 4
pageScript: /assets/js/tools/jwt-decoder.js
keywords: jwt decoder, jwt parser, decode jwt, json web token, jwt debugger
relatedTools:
  - /json-formatter/
  - /base64-encode-decode/
schema:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "JWT Decoder"
  operatingSystem: "Web"
  applicationCategory: "DeveloperApplication"
  url: "https://devtoolscenter.com/jwt-decoder/"
  description: "Decode and inspect JSON Web Tokens (JWT) with header and payload visualization"
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
---

<div class="space-y-6">
  <div>
    <label for="jwt-input" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      JWT Token
    </label>
    <textarea 
      id="jwt-input" 
      class="tool-textarea"
      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    ></textarea>
  </div>
  
  <div class="flex flex-wrap gap-3">
    <button id="decode-btn" class="btn btn-primary">Decode JWT</button>
    <button id="clear-btn" class="btn btn-secondary">Clear</button>
  </div>
  
  <div id="error-message" class="hidden p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg">
    <p class="text-red-700 dark:text-red-400 font-medium"></p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label for="jwt-header" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        Header
      </label>
      <textarea 
        id="jwt-header" 
        class="tool-textarea"
        readonly
      ></textarea>
    </div>
    
    <div>
      <label for="jwt-payload" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        Payload
      </label>
      <textarea 
        id="jwt-payload" 
        class="tool-textarea"
        readonly
      ></textarea>
    </div>
  </div>
  
  <div id="token-info" class="hidden p-4 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 rounded-lg">
    <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">Token Information</h3>
    <div class="space-y-1 text-sm text-blue-800 dark:text-blue-200">
      <p><strong>Algorithm:</strong> <span id="token-alg"></span></p>
      <p><strong>Type:</strong> <span id="token-typ"></span></p>
      <p id="token-exp-line" class="hidden"><strong>Expires:</strong> <span id="token-exp"></span></p>
      <p id="token-iat-line" class="hidden"><strong>Issued At:</strong> <span id="token-iat"></span></p>
    </div>
  </div>
</div>

<div class="mt-12 p-6 bg-gradient-to-r from-primary-50 via-primary-100/50 to-accent-50 dark:from-gray-800 dark:via-primary-900/30 dark:to-gray-800 rounded-lg border-2 border-primary-300 dark:border-primary-500/50 shadow-md dark:shadow-lg dark:shadow-primary-900/20">
  <h2 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white">About JWT Decoder</h2>
  <p class="text-gray-700 dark:text-gray-300 mb-3">
    Decode and inspect JSON Web Tokens (JWT) to view header and payload information. This tool runs entirely in your browser, 
    ensuring your tokens remain private and secure.
  </p>
  <p class="text-sm text-amber-700 dark:text-amber-300 mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
    <strong>Security Note:</strong> This tool only decodes JWT tokens - it does not verify signatures. 
    Remember that JWT payloads are encoded, not encrypted.
  </p>
  <a href="/blog/jwt-tokens-explained/" class="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:underline">
    Learn more about JWT tokens and best practices →
  </a>
</div>

