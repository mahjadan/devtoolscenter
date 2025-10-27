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

<div class="mt-12 prose dark:prose-invert max-w-none">
  <h2>About JWT Decoder</h2>
  <p>
    JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. 
    This tool decodes JWT tokens and displays the header and payload in a readable format.
  </p>
  
  <h3>Features</h3>
  <ul>
    <li>Decode JWT header and payload</li>
    <li>Display token algorithm and type</li>
    <li>Show expiration and issued-at timestamps</li>
    <li>Format JSON output for readability</li>
    <li>Client-side decoding - your tokens never leave your browser</li>
  </ul>
  
  <h3>Security Note</h3>
  <p>
    This tool only <strong>decodes</strong> JWT tokens - it does not verify signatures. JWT tokens are encoded, 
    not encrypted, so the header and payload can be read by anyone. Never put sensitive information in a JWT 
    without proper encryption.
  </p>
  
  <h3>JWT Structure</h3>
  <p>
    A JWT consists of three parts separated by dots (.):
  </p>
  <ul>
    <li><strong>Header:</strong> Contains token type and signing algorithm</li>
    <li><strong>Payload:</strong> Contains claims (user data, expiration, etc.)</li>
    <li><strong>Signature:</strong> Used to verify the token hasn't been tampered with</li>
  </ul>
</div>

