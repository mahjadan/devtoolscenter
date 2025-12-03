---
layout: layouts/tool.njk
title: Professional UUID/GUID Generator - All Versions Supported
description: Generate UUIDs and GUIDs with comprehensive support for all versions (v1, v3, v4, v7, GUID, nil). Enterprise-grade UUID generator with orbital interface, bulk generation, and multiple output formats.
permalink: /uuid-generator/
icon: 🆔
order: 8
pageScript: /assets/js/tools/uuid-generator.js
keywords: uuid generator, guid generator, uuid v1, uuid v3, uuid v4, uuid v7, microsoft guid, nil uuid, bulk uuid generation, time-based uuid, random uuid, name-based uuid, unix epoch uuid, json uuid, csv uuid, enterprise uuid generator, orbital interface, cryptographically secure
tags:
  - tools
  - uuid
  - guid
  - microsoft
  - enterprise
relatedTools:
  - /json-formatter/
  - /base64-encode-decode/
  - /jwt-decoder/
  - /timestamp-converter/
schema:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Professional UUID/GUID Generator"
  operatingSystem: "Web"
  applicationCategory: "DeveloperApplication"
  url: "https://devtoolscenter.com/uuid-generator/"
  description: "Enterprise-grade UUID and GUID generator supporting all major versions (v1 Time-based, v3 Name-based MD5, v4 Random, v7 Unix Epoch, Microsoft GUID, Nil UUID) with advanced formatting options, bulk generation, and intuitive orbital interface"
  features: [
    "UUID v1 (Time-based with MAC address)",
    "UUID v3 (Name-based with MD5 hashing)",
    "UUID v4 (Cryptographically secure random)",
    "UUID v7 (Unix epoch for database optimization)",
    "Microsoft GUID (.NET compatibility)",
    "Nil UUID (Testing and placeholders)",
    "Bulk generation up to 100 UUIDs",
    "Multiple output formats (JSON, CSV, JavaScript)",
    "Advanced formatting (uppercase, hyphens, braces)",
    "Orbital interface for easy version selection"
  ]
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

<div class="space-y-4 md:space-y-6 -mx-2 md:mx-0">
  <!-- UUID Version Selection with Visual Orbit -->
  <div class="p-3 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl md:rounded-2xl border border-gray-300 dark:border-gray-600 mx-2 md:mx-0">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">UUID Version</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">Choose the type of UUID to generate</p>
      </div>
      <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <div class="w-2 h-2 rounded-full bg-green-400"></div>
        <span>Cryptographically secure</span>
      </div>
    </div>
    
    <!-- UUID Constellation/Orbit Visualization - Hidden on Mobile -->
    <div class="hidden md:block relative h-48 mx-auto mb-4 overflow-hidden">
      <!-- Center UUID hub -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="relative">
          <div class="absolute inset-0 blur-3xl bg-primary-400/45 dark:bg-primary-500/25 rounded-full opacity-80"></div>
          <div class="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 rounded-full bg-primary-500/20 sm:bg-gradient-to-tr sm:from-primary-400 sm:via-primary-500 sm:to-primary-600 shadow-[0_0_45px_rgba(56,189,248,0.55),0_0_0_12px_rgba(59,130,246,0.18)] dark:shadow-[0_0_45px_rgba(56,189,248,0.6),0_0_0_12px_rgba(56,189,248,0.18)] ring-4 ring-primary-200/70 dark:ring-primary-500/45 border border-primary-300/60 dark:border-primary-500/40 flex items-center justify-center relative">
            <span class="text-xs font-semibold text-white tracking-tight drop-shadow">UUID</span>
          </div>
        </div>
      </div>
      
      <!-- Orbit rings -->
      <div class="absolute inset-0">
        <div class="absolute inset-1 sm:inset-2 md:inset-3.5 rounded-full border border-dashed border-gray-300 dark:border-gray-600"></div>
        <div class="absolute inset-3 sm:inset-4 md:inset-7 rounded-full border border-dashed border-gray-300 dark:border-gray-600 opacity-60"></div>
        <div class="absolute inset-5 sm:inset-6 md:inset-11 rounded-full border border-dashed border-gray-300 dark:border-gray-600 opacity-40"></div>
      </div>
      
      <!-- Version nodes - Hidden on Mobile -->
      <button data-version="v4" class="uuid-version-btn hidden md:flex absolute right-4 top-1/2 transform -translate-y-1/2 flex-col items-center gap-1 group">
        <div class="w-10 h-10 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center shadow-lg hover:shadow-blue-400/50 transition-all duration-200 hover:scale-110">
          <span class="text-xs font-semibold text-blue-600 dark:text-blue-400">v4</span>
        </div>
        <span class="text-xs text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Random</span>
      </button>
      
      <button data-version="v1" class="uuid-version-btn hidden md:flex absolute left-4 top-1/4 flex-col items-center gap-1 group">
        <div class="w-8 h-8 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center hover:shadow-green-400/50 transition-all duration-200 hover:scale-110">
          <span class="text-xs font-semibold text-green-600 dark:text-green-400">v1</span>
        </div>
        <span class="text-xs text-gray-600 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400">Time</span>
      </button>
      
      <button data-version="v3" class="uuid-version-btn hidden md:flex absolute left-1/4 top-2 flex-col items-center gap-1 group">
        <div class="w-8 h-8 rounded-full bg-yellow-500/20 border-2 border-yellow-400 flex items-center justify-center hover:shadow-yellow-400/50 transition-all duration-200 hover:scale-110">
          <span class="text-xs font-semibold text-yellow-600 dark:text-yellow-400">v3</span>
        </div>
        <span class="text-xs text-gray-600 dark:text-gray-300 group-hover:text-yellow-600 dark:group-hover:text-yellow-400">MD5</span>
      </button>
      
      <button data-version="v7" class="uuid-version-btn hidden md:flex absolute left-1/4 bottom-2 flex-col items-center gap-1 group">
        <div class="w-8 h-8 rounded-full bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center hover:shadow-purple-400/50 transition-all duration-200 hover:scale-110">
          <span class="text-xs font-semibold text-purple-600 dark:text-purple-400">v7</span>
        </div>
        <span class="text-xs text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">Unix</span>
      </button>
      
      <button data-version="guid" class="uuid-version-btn hidden md:flex absolute right-20 top-2 flex-col items-center gap-1 group">
        <div class="w-10 h-10 rounded-full bg-indigo-500/20 border-2 border-indigo-400 flex items-center justify-center shadow-lg hover:shadow-indigo-400/50 transition-all duration-200 hover:scale-110">
          <span class="text-xs font-semibold text-indigo-600 dark:text-indigo-400">GUID</span>
        </div>
        <span class="text-xs text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">GUID</span>
      </button>
      
      <button data-version="nil" class="uuid-version-btn hidden md:flex absolute right-1/4 bottom-2 flex-col items-center gap-1 group">
        <div class="w-8 h-8 rounded-full bg-orange-500/20 border-2 border-orange-400 flex items-center justify-center hover:shadow-orange-400/50 transition-all duration-200 hover:scale-110">
          <span class="text-xs font-semibold text-orange-600 dark:text-orange-400">nil</span>
        </div>
        <span class="text-xs text-gray-600 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">Zero</span>
      </button>
    </div>
    
    <!-- Version Pills (main selection method) -->
    <div class="grid grid-cols-2 md:flex md:flex-wrap gap-1.5 md:gap-2">
      <button data-version="v4" class="version-pill inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-1.5 rounded-full text-xs font-medium border-2 border-blue-400 bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-all justify-center md:justify-start">
        <span class="w-3 h-3 md:w-4 md:h-4 rounded-full bg-blue-500/40 text-[0.5rem] md:text-[0.6rem] flex items-center justify-center text-white">v4</span>
        <span class="hidden md:inline">Random (Recommended)</span>
        <span class="md:hidden">v4 Random</span>
        <span class="hidden md:inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-[0.65rem] font-semibold text-blue-700">Recommended</span>
      </button>
      <button data-version="v1" class="version-pill inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-1.5 rounded-full text-xs border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-green-400 hover:text-green-600 transition-all justify-center md:justify-start">
        <span class="w-3 h-3 md:w-4 md:h-4 rounded-full bg-green-500/40 text-[0.5rem] md:text-[0.6rem] flex items-center justify-center text-white">v1</span>
        <span class="hidden md:inline">Time-based</span>
        <span class="md:hidden">v1 Time</span>
      </button>
      <button data-version="v3" class="version-pill inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-1.5 rounded-full text-xs border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-yellow-400 hover:text-yellow-600 transition-all justify-center md:justify-start">
        <span class="w-3 h-3 md:w-4 md:h-4 rounded-full bg-yellow-500/40 text-[0.5rem] md:text-[0.6rem] flex items-center justify-center text-white">v3</span>
        <span class="hidden md:inline">Name-based MD5</span>
        <span class="md:hidden">v3 MD5</span>
      </button>
      <button data-version="v7" class="version-pill inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-1.5 rounded-full text-xs border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-purple-400 hover:text-purple-600 transition-all justify-center md:justify-start">
        <span class="w-3 h-3 md:w-4 md:h-4 rounded-full bg-purple-500/40 text-[0.5rem] md:text-[0.6rem] flex items-center justify-center text-white">v7</span>
        <span class="hidden md:inline">Unix Epoch</span>
        <span class="md:hidden">v7 Unix</span>
        <span class="hidden md:inline-flex items-center px-2 py-0.5 rounded-full bg-purple-100 text-[0.65rem] font-semibold text-purple-700">Sorted-friendly</span>
      </button>
      <button data-version="guid" class="version-pill inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-1.5 rounded-full text-xs border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600 transition-all justify-center md:justify-start">
        <span class="w-3 h-3 md:w-4 md:h-4 rounded-full bg-indigo-500/40 text-[0.5rem] md:text-[0.6rem] flex items-center justify-center text-white">G</span>
        <span class="hidden md:inline">GUID</span>
        <span class="md:hidden">GUID</span>
      </button>
      <button data-version="nil" class="version-pill inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-1.5 rounded-full text-xs border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-orange-400 hover:text-orange-600 transition-all justify-center md:justify-start">
        <span class="w-3 h-3 md:w-4 md:h-4 rounded-full bg-orange-500/40 text-[0.5rem] md:text-[0.6rem] flex items-center justify-center text-white">0</span>
        <span class="hidden md:inline">Nil UUID</span>
        <span class="md:hidden">Nil</span>
      </button>
    </div>

    <details class="mt-4 bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <summary class="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center justify-between">
        Version quick guide
        <span class="text-xs text-primary-600 dark:text-primary-400 font-medium">When to use each</span>
      </summary>
      <div class="px-4 pb-4 pt-2 overflow-x-auto">
        <div class="min-w-full">
          <div class="grid grid-cols-3 text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
            <span>Version</span>
            <span>Best for</span>
            <span>Property</span>
          </div>
          <div class="space-y-2 text-xs text-gray-700 dark:text-gray-200">
            <div class="grid grid-cols-3 items-center gap-2 p-2 rounded border border-blue-100 dark:border-blue-900/50 bg-blue-50/70 dark:bg-blue-900/20">
              <span class="font-semibold text-blue-700 dark:text-blue-300">v4</span>
              <span>General-purpose IDs</span>
              <span class="font-medium text-blue-700 dark:text-blue-300">Random (recommended)</span>
            </div>
            <div class="grid grid-cols-3 items-center gap-2 p-2 rounded border border-purple-100 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-900/20">
              <span class="font-semibold text-purple-700 dark:text-purple-300">v7</span>
              <span>Ordered storage/indexes</span>
              <span class="font-medium text-purple-700 dark:text-purple-300">Time-ordered</span>
            </div>
            <div class="grid grid-cols-3 items-center gap-2 p-2 rounded border border-green-100 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/20">
              <span class="font-semibold text-green-700 dark:text-green-300">v1</span>
              <span>Legacy time ordering</span>
              <span class="font-medium text-green-700 dark:text-green-300">Time-based (MAC)</span>
            </div>
            <div class="grid grid-cols-3 items-center gap-2 p-2 rounded border border-yellow-100 dark:border-yellow-900/40 bg-yellow-50/50 dark:bg-yellow-900/20">
              <span class="font-semibold text-yellow-700 dark:text-yellow-300">v3</span>
              <span>Repeatable names</span>
              <span class="font-medium text-yellow-700 dark:text-yellow-300">Deterministic (MD5)</span>
            </div>
            <div class="grid grid-cols-3 items-center gap-2 p-2 rounded border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-900/20">
              <span class="font-semibold text-indigo-700 dark:text-indigo-300">GUID</span>
              <span>.NET / Windows interop</span>
              <span class="font-medium text-indigo-700 dark:text-indigo-300">Random (.NET)</span>
            </div>
            <div class="grid grid-cols-3 items-center gap-2 p-2 rounded border border-orange-100 dark:border-orange-900/50 bg-orange-50/50 dark:bg-orange-900/20">
              <span class="font-semibold text-orange-700 dark:text-orange-300">Nil</span>
              <span>Testing / null sentinel</span>
              <span class="font-medium text-orange-700 dark:text-orange-300">All zeros</span>
            </div>
          </div>
        </div>
      </div>
    </details>
  </div>

  <!-- Output Format Selection -->
  <div class="p-4 md:p-5 border border-gray-300 dark:border-gray-600 rounded-xl mx-2 md:mx-0">
    <label class="block text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">Output Format</label>
    <div class="flex flex-wrap gap-2 md:gap-2.5">
      <button data-format="list" class="format-btn inline-flex items-center gap-2.5 px-3.5 md:px-4 py-2 md:py-2.5 rounded-lg text-sm font-semibold border-2 border-primary-400 bg-primary-500/20 text-primary-700 dark:text-primary-300 transition-all">
        <svg class="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
        </svg>
        <span class="text-sm">Lines</span>
      </button>
      <button data-format="json" class="format-btn inline-flex items-center gap-2.5 px-3.5 md:px-4 py-2 md:py-2.5 rounded-lg text-sm font-semibold border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:border-primary-400 hover:text-primary-600 transition-all">
        <svg class="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3"></path>
        </svg>
        <span class="text-sm">JSON</span>
      </button>
      <button data-format="csv" class="format-btn inline-flex items-center gap-2.5 px-3.5 md:px-4 py-2 md:py-2.5 rounded-lg text-sm font-semibold border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:border-primary-400 hover:text-primary-600 transition-all">
        <svg class="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <span class="text-sm">CSV</span>
      </button>
      <button data-format="array" class="format-btn inline-flex items-center gap-2.5 px-3.5 md:px-4 py-2 md:py-2.5 rounded-lg text-sm font-semibold border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:border-primary-400 hover:text-primary-600 transition-all">
        <svg class="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
        </svg>
        <span class="text-sm">Array</span>
      </button>
    </div>
    <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">Applies to the generated output below.</p>
  </div>

  <!-- Generation Controls -->
  <div class="p-4 md:p-5 border border-gray-300 dark:border-gray-600 rounded-xl mx-2 md:mx-0">
    <div class="space-y-4 md:space-y-5">
      <!-- Count Selection -->
      <div>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-1">
          <label class="text-base font-semibold text-gray-800 dark:text-gray-200">Number of UUIDs</label>
          <span id="count-label" class="text-sm text-gray-600 dark:text-gray-400">Generating <span class="font-semibold text-primary-600">1 UUID</span></span>
        </div>
        
        <!-- Count chips -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3">
          <div class="inline-flex items-center gap-1 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 p-1">
            <button data-count="1" class="count-chip inline-flex items-center justify-center rounded-full bg-primary-500 text-white text-sm font-semibold px-3 py-1.5 transition-all">
              1
            </button>
            <button data-count="5" class="count-chip inline-flex items-center justify-center rounded-full text-gray-700 dark:text-gray-200 text-sm font-medium px-3 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
              5
            </button>
            <button data-count="10" class="count-chip inline-flex items-center justify-center rounded-full text-gray-700 dark:text-gray-200 text-sm font-medium px-3 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
              10
            </button>
            <button data-count="25" class="count-chip inline-flex items-center justify-center rounded-full text-gray-700 dark:text-gray-200 text-sm font-medium px-3 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
              25
            </button>
            <button data-count="50" class="count-chip inline-flex items-center justify-center rounded-full text-gray-700 dark:text-gray-200 text-sm font-medium px-3 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
              50
            </button>
          </div>
          
          <!-- Range slider -->
          <div class="flex-1 flex items-center gap-2 min-w-0">
            <input 
              id="uuid-count" 
              type="range" 
              min="1" 
              max="100" 
              value="1" 
              class="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
            >
            <span class="text-sm text-gray-600 dark:text-gray-400 w-10 md:w-12 text-right flex-shrink-0">
              <span id="count-value">1</span>
            </span>
          </div>
        </div>
      </div>
      
      <!-- Formatting Options -->
      <div class="space-y-2">
        <span class="text-base font-semibold text-gray-800 dark:text-gray-200">Format Options</span>
        
        <div class="flex flex-wrap md:items-center gap-2">
          <div class="flex items-center gap-3">
            <label for="format-preset" class="text-base font-semibold text-gray-800 dark:text-gray-200">Format preset</label>
            <select id="format-preset" class="text-base font-semibold rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4 py-2.5">
              <option value="rfc">RFC 4122 (lowercase + hyphens)</option>
              <option value="compact">Compact (no hyphens)</option>
              <option value="brace">.NET brace (uppercase + braces)</option>
              <option value="custom" selected>Custom</option>
            </select>
          </div>
          <!-- Custom Toggle for Uppercase -->
          <button id="uppercase-toggle" class="toggle-btn inline-flex items-center gap-2 md:gap-2.5 px-3.5 md:px-4 py-2 md:py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:border-blue-400 hover:text-blue-600 transition-all duration-200" data-state="false">
            <div class="toggle-indicator w-4 h-4 md:w-5 md:h-5 rounded border-2 border-current flex items-center justify-center transition-all duration-200">
              <svg class="toggle-check w-2.5 h-2.5 md:w-3 md:h-3 opacity-0 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <span class="text-sm font-semibold">Uppercase</span>
          </button>
          
          <!-- Custom Toggle for Hyphens -->
          <button id="hyphens-toggle" class="toggle-btn inline-flex items-center gap-2 md:gap-2.5 px-3.5 md:px-4 py-2 md:py-2.5 rounded-lg border-2 border-green-400 bg-green-500/20 text-green-700 dark:text-green-400 transition-all duration-200" data-state="true">
            <div class="toggle-indicator w-4 h-4 md:w-5 md:h-5 rounded border-2 border-current flex items-center justify-center bg-green-500/30 transition-all duration-200">
              <svg class="toggle-check w-2.5 h-2.5 md:w-3 md:h-3 opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <span class="text-sm font-semibold">Hyphens</span>
          </button>
          
          <!-- Custom Toggle for Braces -->
          <button id="braces-toggle" class="toggle-btn inline-flex items-center gap-2 md:gap-2.5 px-3.5 md:px-4 py-2 md:py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:border-purple-400 hover:text-purple-600 transition-all duration-200" data-state="false">
            <div class="toggle-indicator w-4 h-4 md:w-5 md:h-5 rounded border-2 border-current flex items-center justify-center transition-all duration-200">
              <svg class="toggle-check w-2.5 h-2.5 md:w-3 md:h-3 opacity-0 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <span class="text-sm font-semibold">Braces</span>
          </button>
        </div>
        
        <!-- Hidden checkboxes for backward compatibility -->
        <input type="checkbox" id="uppercase-check" class="hidden">
        <input type="checkbox" id="hyphens-check" class="hidden" checked>
        <input type="checkbox" id="braces-check" class="hidden">
      </div>
    </div>
  </div>
  
  <div class="flex flex-wrap gap-2 md:gap-3 mx-2 md:mx-0">
    <button id="generate-btn" class="btn btn-primary flex-[1.5] min-w-0 text-sm md:text-base px-2 md:px-5">
      <span class="hidden sm:inline">Generate UUID(s)</span>
      <span class="sm:hidden">Generate</span>
    </button>
    <button id="copy-btn" class="btn btn-accent flex-1 min-w-0 text-sm md:text-base px-2 md:px-5">
      <span class="hidden sm:inline">Copy All</span>
      <span class="sm:hidden">Copy</span>
    </button>
    <button id="clear-btn" class="btn btn-secondary flex-1 min-w-0 text-sm md:text-base px-2 md:px-5">Clear</button>
  </div>
  
  <div id="error-message" class="hidden p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg mx-2 md:mx-0">
    <p class="text-red-700 dark:text-red-400 font-medium"></p>
  </div>
  
  <div class="mx-2 md:mx-0">
    <label for="uuid-output" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      Generated UUIDs
    </label>
    <textarea 
      id="uuid-output" 
      class="tool-textarea font-mono transition-all duration-300 ease-in-out"
      readonly
      placeholder="Generated UUIDs will appear here..."
    ></textarea>
  </div>
</div>

<div class="mt-12 space-y-8">
  <div class="p-6 bg-gradient-to-r from-primary-50 via-primary-100/50 to-accent-50 dark:from-gray-800 dark:via-primary-900/30 dark:to-gray-800 rounded-lg border-2 border-primary-300 dark:border-primary-500/50 shadow-md dark:shadow-lg dark:shadow-primary-900/20">
    <h2 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Professional UUID/GUID Generator</h2>
    <p class="text-gray-700 dark:text-gray-300 mb-4">
      Generate cryptographically secure UUIDs and GUIDs with comprehensive support for all major versions. This enterprise-grade tool supports 
      <strong>UUID v1 (Time-based)</strong>, <strong>UUID v3 (Name-based MD5)</strong>, <strong>UUID v4 (Random)</strong>, 
      <strong>UUID v7 (Unix Epoch)</strong>, <strong>Microsoft GUID</strong>, and <strong>Nil UUID</strong> for testing. 
      Perfect for databases, APIs, session management, distributed systems, and enterprise applications requiring unique identifiers.
    </p>
    <p class="text-gray-700 dark:text-gray-300 mb-4">
      Features bulk generation (up to 100 UUIDs), multiple output formats (JSON, CSV, JavaScript arrays), 
      advanced formatting options (uppercase, hyphens, braces), and an intuitive orbital interface for easy version selection.
    </p>
    <a href="/blog/understanding-uuid-generation/" class="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:underline">
      Learn more about UUID generation and best practices →
    </a>
  </div>
  <div class="p-5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800/50">
    <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-green-500"></span>
      Advanced tips
    </h3>
    <div class="grid md:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
      <div class="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60">
        <p class="font-semibold text-gray-900 dark:text-white mb-1">Pick the right version</p>
        <p>Start with <strong>v4</strong>; switch to <strong>v7</strong> for sortable IDs; use <strong>v3</strong> when you need deterministic outputs from the same name.</p>
      </div>
      <div class="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60">
        <p class="font-semibold text-gray-900 dark:text-white mb-1">Format presets</p>
        <p>Use <strong>RFC 4122</strong> for APIs, <strong>.NET brace</strong> for Windows, and <strong>Compact</strong> when you need URL-safe or key-friendly strings.</p>
      </div>
    </div>
  </div>
</div>
