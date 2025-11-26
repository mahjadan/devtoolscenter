---
layout: layouts/tool.njk
title: JWT Encoder/Decoder
description: Encode and decode JSON Web Tokens (JWT). Free online JWT encoder/decoder with signature verification and multiple algorithms support.
permalink: /jwt-decoder/
icon: 🔐
order: 4
pageScript: /assets/js/tools/jwt-decoder.js
pageScriptModule: true
keywords: jwt decoder, jwt encoder, jwt parser, decode jwt, encode jwt, json web token, jwt debugger, jwt generator
tags:
  - tools
  - jwt
relatedTools:
  - /json-formatter/
  - /base64-encode-decode/
schema:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "JWT Encoder/Decoder"
  operatingSystem: "Web"
  applicationCategory: "DeveloperApplication"
  url: "https://devtoolscenter.com/jwt-decoder/"
  description: "Encode and decode JSON Web Tokens (JWT) with signature verification and multiple algorithms support"
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
      name: "JWT Encoder/Decoder"
      item: "https://devtoolscenter.com/jwt-decoder/"
---

<!-- Mode Switcher -->
<div class="mb-8">
  <div class="base64-mode-switcher">
    <button id="decode-mode-btn" data-mode="decode" class="mode-toggle active">
      <span class="mode-toggle__content">
        <span class="mode-toggle__icon" aria-hidden="true">◎</span>
        <span>Decode</span>
      </span>
    </button>
    <button id="encode-mode-btn" data-mode="encode" class="mode-toggle">
      <span class="mode-toggle__content">
        <span class="mode-toggle__icon" aria-hidden="true">⚡</span>
        <span>Encode</span>
      </span>
    </button>
  </div>
</div>

<!-- Global Error Message -->
<div id="global-error" class="hidden mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg">
  <div class="flex items-center gap-2">
    <span class="text-red-500">⚠️</span>
    <p class="text-red-700 dark:text-red-400 font-medium"></p>
  </div>
</div>

<!-- Decode Mode -->
<div id="decode-mode" class="space-y-6">
  <!-- New Layout: Flex layout with token input & content on left, token info on right -->
  <div class="flex flex-col lg:flex-row gap-2">
    <!-- Left Section: Token Input and Header/Payload -->
    <div class="flex-1 space-y-6">
      <div class="space-y-2">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">JWT Token</h3>
        <textarea 
          id="jwt-input" 
          class="tool-textarea min-h-[120px]"
          placeholder="Paste your JWT token here..."
        >eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzYzMTI4NjQxLCJleHAiOjE3NjMxMzIyNDF9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</textarea>
        <div id="decode-error" class="hidden mt-2 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-600 rounded">
          <div class="flex items-center gap-2">
            <span class="text-red-500">⚠️</span>
            <p class="text-red-700 dark:text-red-400 text-sm"></p>
          </div>
        </div>
      </div>
      
      <!-- Header and Payload sections -->
      <div class="space-y-4">
        <div class="space-y-2">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Header</h3>
          <div class="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-4 overflow-auto min-h-[120px]">
            <pre id="jwt-header" class="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap"></pre>
          </div>
        </div>
        
        <div class="space-y-2">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Payload</h3>
          <div class="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-4 overflow-auto min-h-[120px]">
            <pre id="jwt-payload" class="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap"></pre>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Right Section: Token Information Sidebar (fixed width 320px) -->
    <div id="token-info" class="hidden lg:w-[320px] flex-shrink-0">
      <div class="space-y-2">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Token Info</h3>
        <div class="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg sticky top-4">
          <div class="space-y-3">
          <!-- Algorithm -->
          <div class="px-3 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg border-l-4 border-l-blue-500">
            <div class="flex items-center gap-2 mb-1">
              <span>🛡️</span>
              <span class="font-medium text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">Algorithm</span>
            </div>
            <span id="token-alg" class="text-gray-900 dark:text-gray-100 font-mono text-sm font-semibold"></span>
          </div>
          
          <!-- Type -->
          <div class="px-3 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg border-l-4 border-l-blue-500">
            <div class="flex items-center gap-2 mb-1">
              <span>📄</span>
              <span class="font-medium text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">Type</span>
            </div>
            <span id="token-typ" class="text-gray-900 dark:text-gray-100 font-mono text-sm font-semibold"></span>
          </div>
          
          <!-- Issued At -->
          <div id="token-iat-pill" class="hidden px-3 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg border-l-4 border-l-blue-500">
            <div class="flex items-center gap-2 mb-1">
              <span>📅</span>
              <span class="font-medium text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">Issued</span>
            </div>
            <span id="token-iat" class="text-gray-900 dark:text-gray-100 text-sm font-semibold leading-tight"></span>
          </div>
          
          <!-- Expires At -->
          <div id="token-exp-pill" class="hidden px-3 py-3 rounded-lg border-l-4">
            <div class="flex items-center gap-2 mb-1">
              <span>🕒</span>
              <span class="font-medium text-xs uppercase tracking-wide">Expires</span>
            </div>
            <div class="space-y-1">
              <span id="token-exp" class="block text-sm font-semibold leading-tight"></span>
              <span id="token-exp-status" class="inline-block px-2 py-1 rounded text-xs font-semibold"></span>
            </div>
          </div>
          
          <!-- Subject -->
          <div id="token-sub-pill" class="hidden px-3 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg border-l-4 border-l-blue-500">
            <div class="flex items-center gap-2 mb-1">
              <span>👤</span>
              <span class="font-medium text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">Subject</span>
            </div>
            <span id="token-sub" class="text-gray-900 dark:text-gray-100 font-mono text-sm break-all font-semibold"></span>
          </div>
          
          <!-- Issuer -->
          <div id="token-iss-pill" class="hidden px-3 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg border-l-4 border-l-blue-500">
            <div class="flex items-center gap-2 mb-1">
              <span>🏢</span>
              <span class="font-medium text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">Issuer</span>
            </div>
            <span id="token-iss" class="text-gray-900 dark:text-gray-100 font-mono text-sm break-all font-semibold"></span>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Mobile Token Information Panel (shown first on mobile) -->
  <div id="token-info-mobile" class="lg:hidden order-first p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Token Info</h3>
    <div class="flex flex-wrap gap-2">
      <div class="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm">
        <span>🛡️</span>
        <span class="font-medium text-gray-700 dark:text-gray-300 text-xs">Algorithm:</span>
        <span id="token-alg-mobile" class="text-gray-900 dark:text-gray-100 font-mono"></span>
      </div>
      <div class="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm">
        <span>📄</span>
        <span class="font-medium text-gray-700 dark:text-gray-300 text-xs">Type:</span>
        <span id="token-typ-mobile" class="text-gray-900 dark:text-gray-100 font-mono"></span>
      </div>
      <div id="token-iat-pill-mobile" class="hidden flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm">
        <span>📅</span>
        <span class="font-medium text-gray-700 dark:text-gray-300 text-xs">Issued:</span>
        <span id="token-iat-mobile" class="text-gray-900 dark:text-gray-100 text-xs"></span>
      </div>
      <div id="token-exp-pill-mobile" class="hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded text-sm">
        <span>🕒</span>
        <span class="font-medium text-xs">Expires:</span>
        <span id="token-exp-mobile" class="text-xs"></span>
        <span id="token-exp-status-mobile" class="px-2 py-0.5 rounded text-xs font-semibold ml-1"></span>
      </div>
      <div id="token-sub-pill-mobile" class="hidden flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm">
        <span>👤</span>
        <span class="font-medium text-gray-700 dark:text-gray-300 text-xs">Subject:</span>
        <span id="token-sub-mobile" class="text-gray-900 dark:text-gray-100 text-xs break-all"></span>
      </div>
      <div id="token-iss-pill-mobile" class="hidden flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm">
        <span>🏢</span>
        <span class="font-medium text-gray-700 dark:text-gray-300 text-xs">Issuer:</span>
        <span id="token-iss-mobile" class="text-gray-900 dark:text-gray-100 text-xs break-all"></span>
      </div>
    </div>
  </div>
  
  <!-- Signature Verification Section -->
  <div id="signature-verification" class="bg-white dark:bg-gray-900 shadow-sm ring-1 ring-gray-200 dark:ring-0 dark:border dark:border-gray-600 rounded-lg">
    <button id="verify-toggle" class="w-full p-4 text-left font-medium text-gray-900 dark:text-white bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-between">
      <span>🔒 Verify Signature (Optional)</span>
      <span id="verify-chevron" class="transform transition-transform">▼</span>
    </button>
    <div id="verify-content" class="hidden p-4 border-t border-gray-300 dark:border-gray-600 space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Key Type</label>
        <div class="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg w-fit">
          <label class="cursor-pointer">
            <input type="radio" name="keyType" value="secret" class="peer hidden" checked>
            <span class="block px-4 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 transition-all duration-200 ease-in-out active:scale-95 peer-checked:bg-white dark:peer-checked:bg-gray-600 peer-checked:text-gray-900 dark:peer-checked:text-white peer-checked:shadow-sm">Secret (HMAC)</span>
          </label>
          <label class="cursor-pointer">
            <input type="radio" name="keyType" value="pem" class="peer hidden">
            <span class="block px-4 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 transition-all duration-200 ease-in-out active:scale-95 peer-checked:bg-white dark:peer-checked:bg-gray-600 peer-checked:text-gray-900 dark:peer-checked:text-white peer-checked:shadow-sm">PEM (Public Key)</span>
          </label>
          <label class="cursor-pointer">
            <input type="radio" name="keyType" value="jwk" class="peer hidden">
            <span class="block px-4 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 transition-all duration-200 ease-in-out active:scale-95 peer-checked:bg-white dark:peer-checked:bg-gray-600 peer-checked:text-gray-900 dark:peer-checked:text-white peer-checked:shadow-sm">JWK</span>
          </label>
        </div>
      </div>
      
      <div>
        <label for="verify-key" id="verify-key-label" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Secret Key
        </label>
        <textarea 
          id="verify-key" 
          class="tool-textarea min-h-[100px]"
          placeholder="Enter your secret key..."
        ></textarea>
      </div>
      
      <button id="verify-btn" class="btn btn-primary">
        🔍 Verify Signature
      </button>
      
      <div id="verify-result" class="hidden p-3 rounded border"></div>
    </div>
  </div>
</div>

<!-- Encode Mode -->
<div id="encode-mode" class="hidden space-y-6">
  <!-- Mobile Token Preview (shown first on mobile) -->
  <div id="encode-token-preview-mobile" class="lg:hidden p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Generated Token</h3>
    <div id="mobile-token-output" class="min-h-[80px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3">
      <div id="mobile-token-placeholder" class="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
        Fill in all required fields to generate a token
      </div>
      <div id="mobile-token-success" class="hidden">
        <div class="flex items-center gap-2 mb-2 text-green-600 dark:text-green-400">
          <span>✅</span>
          <span class="font-medium text-sm">Token generated</span>
        </div>
        <div class="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded p-2 max-h-24 overflow-auto">
          <pre id="mobile-generated-token" class="text-xs font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-all"></pre>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Layout: Flex layout with Header/Payload/Signing on left, Generated Token on right -->
  <div class="flex flex-col lg:flex-row gap-2">
    <!-- Left Section: Header, Payload, and Signing Configuration -->
    <div class="flex-1 space-y-6">
      <!-- Header Input -->
      <div class="bg-white dark:bg-gray-900 shadow-sm ring-1 ring-gray-200 dark:ring-0 dark:border dark:border-gray-600 rounded-lg p-4 space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Header</h3>
          <div id="header-validation" class="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold">
            <span id="header-validation-icon"></span>
            <span id="header-validation-text"></span>
          </div>
        </div>
        <textarea 
          id="encode-header" 
          class="tool-textarea min-h-[120px] font-mono text-sm"
          placeholder='{"alg": "HS256", "typ": "JWT"}'
        >{"alg": "HS256", "typ": "JWT"}</textarea>
      </div>
      
      <!-- Payload Input -->
      <div class="bg-white dark:bg-gray-900 shadow-sm ring-1 ring-gray-200 dark:ring-0 dark:border dark:border-gray-600 rounded-lg p-4 space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Payload</h3>
          <div id="payload-validation" class="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold">
            <span id="payload-validation-icon"></span>
            <span id="payload-validation-text"></span>
          </div>
        </div>
        <textarea 
          id="encode-payload" 
          class="tool-textarea min-h-[120px] font-mono text-sm"
          placeholder='{"sub": "1234567890", "name": "John Doe", "iat": 1516239022}'
        >{"sub": "1234567890", "name": "John Doe", "iat": 1763128641, "exp": 1763132241}</textarea>
      </div>
      
      <!-- Signing Configuration -->
      <div id="signing-section" class="bg-white dark:bg-gray-900 shadow-sm ring-1 ring-gray-200 dark:ring-0 dark:border dark:border-gray-600 rounded-lg p-4 space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">🔐 Signing Configuration</h3>
        
        <div id="no-signature-message" class="hidden p-3 bg-gray-100 dark:bg-gray-800 rounded border text-sm text-gray-600 dark:text-gray-400">
          No signature required (algorithm: none)
        </div>
        
        <div id="secret-key-section" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Key Type <span class="text-red-500">*</span>
            </label>
            <div class="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg w-fit">
              <label class="cursor-pointer">
                <input type="radio" name="secretKeyType" value="text" class="peer hidden" checked>
                <span class="block px-4 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 transition-all duration-200 ease-in-out active:scale-95 peer-checked:bg-white dark:peer-checked:bg-gray-600 peer-checked:text-gray-900 dark:peer-checked:text-white peer-checked:shadow-sm">HMAC (Text)</span>
              </label>
              <label class="cursor-pointer">
                <input type="radio" name="secretKeyType" value="pem" class="peer hidden">
                <span class="block px-4 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 transition-all duration-200 ease-in-out active:scale-95 peer-checked:bg-white dark:peer-checked:bg-gray-600 peer-checked:text-gray-900 dark:peer-checked:text-white peer-checked:shadow-sm">PEM</span>
              </label>
              <label class="cursor-pointer">
                <input type="radio" name="secretKeyType" value="jwk" class="peer hidden">
                <span class="block px-4 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 transition-all duration-200 ease-in-out active:scale-95 peer-checked:bg-white dark:peer-checked:bg-gray-600 peer-checked:text-gray-900 dark:peer-checked:text-white peer-checked:shadow-sm">JWK</span>
              </label>
            </div>
          </div>
          
          <!-- HMAC Text Input -->
          <div id="secret-text-input" class="space-y-2">
            <label for="encode-secret" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Secret Key <span class="text-red-500">*</span>
            </label>
            <input 
              type="password" 
              id="encode-secret" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter your secret key..."
            >
          </div>
          
          <!-- PEM/JWK Textarea -->
          <div id="secret-pem-jwk-input" class="hidden space-y-2">
            <label for="encode-secret-key" id="secret-key-label" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Secret Key (PEM format) <span class="text-red-500">*</span>
            </label>
            <textarea 
              id="encode-secret-key" 
              class="tool-textarea min-h-[120px] font-mono text-sm"
              placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
            ></textarea>
          </div>
        </div>
        
        <div id="private-key-section" class="hidden space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Key Type <span class="text-red-500">*</span>
            </label>
            <div class="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg w-fit">
              <label class="cursor-pointer">
                <input type="radio" name="privateKeyType" value="pem" class="peer hidden" checked>
                <span class="block px-4 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 transition-all duration-200 ease-in-out active:scale-95 peer-checked:bg-white dark:peer-checked:bg-gray-600 peer-checked:text-gray-900 dark:peer-checked:text-white peer-checked:shadow-sm">PEM (Private Key)</span>
              </label>
              <label class="cursor-pointer">
                <input type="radio" name="privateKeyType" value="jwk" class="peer hidden">
                <span class="block px-4 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 transition-all duration-200 ease-in-out active:scale-95 peer-checked:bg-white dark:peer-checked:bg-gray-600 peer-checked:text-gray-900 dark:peer-checked:text-white peer-checked:shadow-sm">JWK (JSON Web Key)</span>
              </label>
            </div>
          </div>
          
          <div>
            <label for="encode-private-key" id="private-key-label" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Private Key (PEM format) <span class="text-red-500">*</span>
            </label>
            <textarea 
              id="encode-private-key" 
              class="tool-textarea min-h-[120px] font-mono text-sm"
              placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Right Section: Generated Token Sidebar (fixed width 400px) -->
    <div class="hidden lg:block lg:w-[400px] flex-shrink-0">
      <div class="bg-white dark:bg-gray-900 shadow-sm ring-1 ring-gray-200 dark:ring-0 dark:border dark:border-gray-600 rounded-lg p-4 sticky top-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Generated JWT Token</h3>
        <div id="token-output" class="min-h-[500px] flex flex-col">
          <div id="token-placeholder" class="text-gray-500 dark:text-gray-400 text-sm flex-1 flex items-center justify-center text-center">
            Fill in all required fields with valid JSON to generate a token
          </div>
          <div id="token-errors" class="hidden text-red-600 dark:text-red-400 text-sm">
            <div class="flex items-center gap-2 mb-2">
              <span>⚠️</span>
              <span class="font-medium">Please fix the following issues:</span>
            </div>
            <ul id="token-error-list" class="list-disc list-inside space-y-1"></ul>
          </div>
          <div id="token-success" class="hidden flex flex-col h-full">
            <div class="flex items-center gap-2 mb-3 text-green-600 dark:text-green-400">
              <span>✅</span>
              <span class="font-medium">Token generated successfully</span>
            </div>
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 mb-3 flex-1 overflow-auto">
              <pre id="generated-token" class="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-all"></pre>
            </div>
            <button id="copy-token-btn" class="btn btn-primary btn-sm self-start">
              📋 Copy Token
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="mt-12 p-6 bg-gradient-to-r from-primary-50 via-primary-100/50 to-accent-50 dark:from-gray-800 dark:via-primary-900/30 dark:to-gray-800 rounded-lg border-2 border-primary-300 dark:border-primary-500/50 shadow-md dark:shadow-lg dark:shadow-primary-900/20">
  <h2 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white">About JWT Encoder/Decoder</h2>
  <p class="text-gray-700 dark:text-gray-300 mb-3">
    Encode and decode JSON Web Tokens (JWT) with support for multiple algorithms including HMAC (HS256/384/512), RSA (RS256/384/512), and ECDSA (ES256/384/512). 
    This comprehensive tool allows you to encode new tokens with custom headers and payloads, decode existing tokens to view their contents, and optionally verify signatures. All operations run entirely 
    in your browser, ensuring your tokens and keys remain private and secure.
  </p>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
      <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">🔍 Decode Mode</h3>
      <p class="text-sm text-blue-800 dark:text-blue-200">
        Decode any JWT token to view its header, payload, and token information. Optionally verify signatures with your secret or public key (HMAC, RSA, or EC).
      </p>
    </div>
    <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
      <h3 class="font-semibold text-green-900 dark:text-green-100 mb-2">⚙️ Encode Mode</h3>
      <p class="text-sm text-green-800 dark:text-green-200">
        Encode new JWT tokens by defining custom headers and payloads. Supports symmetric (HMAC) and asymmetric (RSA, ECDSA) signing algorithms with text secrets, PEM, or JWK keys.
      </p>
    </div>
  </div>
  <p class="text-sm text-amber-700 dark:text-amber-300 mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
    <strong>Security Note:</strong> Remember that JWT payloads are encoded, not encrypted. Never include sensitive information in the payload 
    unless additional encryption is applied. Always verify tokens on the server side.
  </p>
  <a href="/blog/jwt-tokens-explained/" class="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:underline">
    Learn more about JWT tokens and best practices →
  </a>
</div>
