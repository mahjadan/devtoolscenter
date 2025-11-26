---
layout: layouts/tool.njk
title: Base64 Encoder / Decoder
description: Encode and decode Base64 strings. Free online Base64 encoder and decoder supporting text and file conversion.
permalink: /base64-encode-decode/
icon: 🔤
order: 7
pageScript: /assets/js/tools/base64-encoder.js
keywords: base64 encoder, base64 decoder, encode base64, decode base64, base64 converter
tags:
  - tools
  - base64
templateEngineOverride: njk
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

<div class="space-y-5 md:space-y-6 w-full">
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
    <div>
      <div class="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-sm">
        <span class="inline-flex h-2 w-2 rounded-full bg-primary-500"></span>
        Minimal, premium Base64 lab
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Toggle Simple or Expert mode to reveal more controls and diagnostics.</p>
    </div>
    <div class="base64-mode-switcher">
      <button id="mode-simple" data-mode="simple" class="mode-toggle active">
        <span class="mode-toggle__content">
          <span class="mode-toggle__icon" aria-hidden="true">◎</span>
          <span>Simple</span>
        </span>
      </button>
      <button id="mode-expert" data-mode="expert" class="mode-toggle">
        <span class="mode-toggle__content">
          <span class="mode-toggle__icon" aria-hidden="true">⚡</span>
          <span>Expert</span>
        </span>
      </button>
    </div>
  </div>

  <div class="space-y-4 w-full">
    <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/70 shadow-sm p-4 md:p-5 space-y-3">
      <div class="flex items-center justify-between gap-2">
        <div>
          <label for="base64-input" class="text-base font-semibold text-gray-900 dark:text-white">Input</label>
          <p class="text-xs text-gray-500 dark:text-gray-400">Type text, hex, or binary. Decode expects Base64.</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="hidden sm:flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <span class="lucide lucide-info w-4 h-4" aria-hidden="true"></span>
            <span>Base64 encodes, not encrypts.</span>
          </div>
        </div>
      </div>

      <!-- Interpretation tabs -->
      <div class="flex flex-wrap gap-2">
        <button class="interpretation-tab active" data-interpretation="text">Text ⇄ Base64</button>
        <button class="interpretation-tab" data-interpretation="hex">Hex ⇄ Base64</button>
        <button class="interpretation-tab" data-interpretation="binary">Binary ⇄ Base64</button>
      </div>

      <textarea 
        id="base64-input" 
        class="tool-textarea h-44"
        placeholder="Enter text to encode or Base64 to decode. In Hex mode, use pairs like 4d5a..."
      ></textarea>

      <!-- Expert-only options -->
      <div class="space-y-3 expert-only">
        <div class="flex flex-wrap gap-2">
          <div class="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200">
            Encoding
          </div>
          <button class="variant-chip active" data-variant="standard">Standard</button>
          <button class="variant-chip" data-variant="urlsafe">URL-safe</button>
          <button id="padding-toggle" class="option-chip" data-state="on">Padding on</button>
          <button id="wrap-toggle" class="option-chip" data-state="off">Wrap 76 chars</button>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div class="flex items-center gap-2">
            <label for="charset-select" class="text-sm font-semibold text-gray-800 dark:text-gray-200">Charset</label>
            <select id="charset-select" class="text-sm font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-2">
              <option value="utf-8" selected>UTF-8 (default)</option>
              <option value="iso-8859-1">ISO-8859-1</option>
            </select>
          </div>
          <div class="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-300">
            <span class="lucide lucide-alert-triangle w-4 h-4" aria-hidden="true"></span>
            <span id="charset-warning" class="hidden">Invalid sequence detected for chosen charset.</span>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-3 text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2">
          <span class="lucide lucide-pipeline w-4 h-4" aria-hidden="true"></span>
          <div class="space-y-0.5">
            <div class="font-semibold text-gray-800 dark:text-gray-100 text-sm">Pipeline</div>
            <p id="pipeline-text" class="text-xs">Raw bytes → [UTF-8] → Base64 (Standard, padding on)</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap gap-2">
        <button id="encode-btn" class="btn btn-primary flex-1 min-w-[140px]">Encode</button>
        <button id="decode-btn" class="btn btn-primary flex-1 min-w-[140px]">Decode</button>
        <button id="copy-btn" class="btn btn-accent flex-1 min-w-[140px]">Copy output</button>
        <button id="clear-btn" class="btn btn-secondary flex-1 min-w-[120px]">Clear</button>
      </div>

      <div id="error-message" class="hidden p-3 bg-red-50 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
        <p class="text-sm text-red-700 dark:text-red-300 font-medium"></p>
      </div>
    </div>

    <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/70 shadow-sm p-4 md:p-5 space-y-3">
      <div class="flex items-center justify-between gap-2">
        <label for="base64-output" class="text-base font-semibold text-gray-900 dark:text-white">Output</label>
        <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span class="lucide lucide-shield-check w-4 h-4" aria-hidden="true"></span>
          <span id="status-bar">Ready.</span>
        </div>
      </div>
      <textarea 
        id="base64-output" 
        class="tool-textarea h-44 font-mono"
        readonly
        placeholder="Result will appear here."
      ></textarea>

      <!-- Expert-only Insights section -->
      <div class="expert-only">
        <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70 p-3 space-y-2">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">Insights</h3>
            <span class="text-xs text-gray-500 dark:text-gray-400">Validation & metadata</span>
          </div>
          <ul id="insights-list" class="space-y-1 text-xs text-gray-700 dark:text-gray-300"></ul>
        </div>
      </div>

      <!-- Detected content section (visible in both Simple and Expert modes) -->
      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70 p-3 space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">Detected content</h3>
          <div id="content-type-badge" class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 transition-all duration-300">
            <span id="content-type-text">None</span>
          </div>
        </div>
        <div id="detected-json" class="hidden">
          <pre class="text-[0.7rem] bg-white/60 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg p-2 overflow-auto max-h-28"></pre>
        </div>
        <div id="detected-jwt" class="hidden">
          <pre class="text-[0.7rem] bg-white/60 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg p-2 overflow-auto max-h-28"></pre>
        </div>
        <div id="detected-image" class="hidden space-y-2">
          <button id="show-image" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-emerald-300 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-semibold text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-200 shadow-sm hover:shadow-md">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span>Show Preview</span>
          </button>
          <img id="image-preview" alt="Decoded preview" class="hidden mt-2 w-full max-w-md rounded-lg border-2 border-gray-200 dark:border-gray-700 object-contain shadow-lg" />
        </div>
        <p id="detected-none" class="text-xs text-gray-500 dark:text-gray-400">No special content detected yet.</p>
      </div>
    </div>
  </div>

  <div class="rounded-2xl p-5 bg-gradient-to-r from-primary-50 via-primary-100/50 to-accent-50 dark:from-gray-800 dark:via-primary-900/30 dark:to-gray-800 border-2 border-primary-200 dark:border-primary-700 shadow-sm">
    <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">Base64 at a glance</h2>
    <p class="text-sm text-gray-700 dark:text-gray-300">
      Base64 is a binary-to-text encoding scheme for safe transport of bytes across systems that expect text. It is not encryption. Use Expert mode to tune URL-safe variants, padding, charset, MIME line wrapping, and to view diagnostics on invalid characters or padding issues.
    </p>
  </div>
</div>
