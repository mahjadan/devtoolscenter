---
layout: layouts/tool.njk
title: UUID Generator
description: Generate random UUIDs (Universally Unique Identifiers). Free online UUID v4 generator with bulk generation support.
permalink: /uuid-generator/
icon: 🆔
order: 8
pageScript: /assets/js/tools/uuid-generator.js
keywords: uuid generator, generate uuid, random uuid, uuid v4, unique id generator
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

<div class="mt-12 prose dark:prose-invert max-w-none">
  <h2>About UUID Generator</h2>
  <p>
    A UUID (Universally Unique Identifier) is a 128-bit number used to uniquely identify information 
    in computer systems. This tool generates random UUIDs using the Version 4 specification.
  </p>
  
  <h3>Features</h3>
  <ul>
    <li>Generate single or multiple UUIDs (up to 100 at once)</li>
    <li>UUID Version 4 (random) generation</li>
    <li>Option to generate with or without hyphens</li>
    <li>Option for uppercase or lowercase format</li>
    <li>Cryptographically strong random number generation</li>
    <li>Copy all UUIDs to clipboard</li>
  </ul>
  
  <h3>UUID Version 4 Format</h3>
  <p>
    UUID v4 uses random or pseudo-random numbers. The format is:
  </p>
  <p class="font-mono text-sm">
    xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  </p>
  <p>
    Where each <code>x</code> is a random hexadecimal digit (0-9, a-f) and <code>y</code> is one of 8, 9, a, or b.
  </p>
  
  <h3>Common Use Cases</h3>
  <ul>
    <li><strong>Database Keys:</strong> Primary keys for distributed databases</li>
    <li><strong>Session IDs:</strong> Unique session identifiers</li>
    <li><strong>File Names:</strong> Unique file or resource names</li>
    <li><strong>API Keys:</strong> Unique identifiers for API requests</li>
    <li><strong>Tracking:</strong> Event or transaction tracking IDs</li>
  </ul>
  
  <h3>Example</h3>
  <p class="font-mono text-sm">
    550e8400-e29b-41d4-a716-446655440000
  </p>
</div>

