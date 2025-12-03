---
layout: layouts/tool.njk
templateEngineOverride: njk
title: Timestamp Converter
description: Convert Unix timestamps, switch timezones, compare times. Free online timestamp converter supporting Unix seconds/milliseconds, ISO 8601, RFC 2822, and timezone conversions.
permalink: /timestamp-converter/
icon: 🕐
order: 9
pageScript: /assets/js/tools/timestamp-converter.js
keywords: timestamp converter, unix timestamp, epoch converter, time converter, iso 8601 converter, rfc 2822 converter, timezone converter, unix time, epoch time, timestamp to date, date to timestamp
tags:
  - tools
  - timestamp
  - time
relatedTools:
  - /jwt-decoder/
  - /json-formatter/
schema:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Timestamp Converter"
  operatingSystem: "Web"
  applicationCategory: "DeveloperApplication"
  url: "https://devtoolscenter.com/timestamp-converter/"
  description: "Convert Unix timestamps, switch timezones, and compare times with support for Unix seconds/milliseconds, ISO 8601, RFC 2822, and timezone conversions"
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
      name: "Timestamp Converter"
      item: "https://devtoolscenter.com/timestamp-converter/"
---

<div class="space-y-5 md:space-y-6 w-full">

<!-- Mode Switcher -->
<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
  <div>
    <div class="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-sm">
      <span class="inline-flex h-2 w-2 rounded-full bg-primary-500"></span>
      Timestamp conversion tool
    </div>
    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Toggle Simple or Advanced mode for more conversion options.</p>
  </div>
  <div class="base64-mode-switcher">
    <button id="simple-mode-btn" data-mode="simple" class="mode-toggle active">
      <span class="mode-toggle__content">
        <span class="mode-toggle__icon" aria-hidden="true">◎</span>
        <span>Simple</span>
      </span>
    </button>
    <button id="advanced-mode-btn" data-mode="advanced" class="mode-toggle">
      <span class="mode-toggle__content">
        <span class="mode-toggle__icon" aria-hidden="true">⚡</span>
        <span>Advanced</span>
      </span>
    </button>
  </div>
</div>

<!-- Current Time Panel -->
<div id="current-time-panel" class="p-6 bg-gradient-to-br from-primary-50 via-primary-100/50 to-accent-50 dark:from-gray-800 dark:via-primary-900/30 dark:to-gray-800 rounded-xl border-2 border-primary-300 dark:border-primary-500/50">
  <div class="flex items-center justify-between mb-4">
    <span class="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">Current Time</span>
    <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
  </div>
  <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
    <div>
      <p id="current-unix-seconds" class="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-white tracking-tight font-mono">-</p>
      <p id="current-human-readable" class="text-sm text-gray-600 dark:text-gray-400 mt-1">-</p>
    </div>
    <button id="use-now-btn" class="btn btn-primary flex items-center gap-2">
      <span>→</span>
      <span>Use Now</span>
    </button>
  </div>
</div>

<!-- Simple Mode -->
<div id="simple-mode" class="space-y-6">
  <!-- Input Section -->
  <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/70 shadow-sm p-4 md:p-5 space-y-3">
    <div class="flex items-center justify-between gap-2">
      <label for="timestamp-input" class="text-base font-semibold text-gray-900 dark:text-white">
        Enter timestamp or date (auto-detected)
      </label>
    </div>
    <div class="relative">
      <input 
        type="text" 
        id="timestamp-input" 
        class="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
        placeholder="1699999999 or 2024-01-15T10:30:00Z"
      />
      <button id="clear-input-btn" class="hidden absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
        ✕
      </button>
    </div>
    <div id="input-error" class="hidden mt-2 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-600 rounded text-sm text-red-700 dark:text-red-400"></div>
    
    <!-- Quick Adjust Buttons -->
    <div class="mt-4">
      <span class="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Quick adjust:</span>
      <div class="flex flex-wrap gap-2">
        <button class="quick-adjust-btn px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" data-adjust="-3600000">-1h</button>
        <button class="quick-adjust-btn px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" data-adjust="-86400000">-1d</button>
        <button class="quick-adjust-btn px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" data-adjust="-604800000">-1w</button>
        <button class="quick-adjust-btn px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" data-adjust="3600000">+1h</button>
        <button class="quick-adjust-btn px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" data-adjust="86400000">+1d</button>
        <button class="quick-adjust-btn px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" data-adjust="604800000">+1w</button>
      </div>
    </div>
  </div>

  <!-- Timezone Selector -->
  <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/70 shadow-sm p-4 md:p-5 space-y-3">
    <label for="timezone-select" class="text-base font-semibold text-gray-900 dark:text-white">
      Display Timezone
    </label>
    <select id="timezone-select" class="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all">
      <option value="UTC">UTC</option>
      <option value="browser" selected>Browser Timezone</option>
      <option value="America/New_York">New York (EST)</option>
      <option value="America/Los_Angeles">Los Angeles (PST)</option>
      <option value="America/Chicago">Chicago (CST)</option>
      <option value="America/Denver">Denver (MST)</option>
      <option value="Europe/London">London (GMT)</option>
      <option value="Europe/Paris">Paris (CET)</option>
      <option value="Europe/Berlin">Berlin (CET)</option>
      <option value="Asia/Tokyo">Tokyo (JST)</option>
      <option value="Australia/Sydney">Sydney (AEST)</option>
      <option value="Asia/Dubai">Dubai (GST)</option>
      <option value="Asia/Singapore">Singapore (SGT)</option>
      <option value="Asia/Kolkata">Mumbai (IST)</option>
      <option value="America/Sao_Paulo">São Paulo (BRT)</option>
      <option value="Asia/Hong_Kong">Hong Kong (HKT)</option>
    </select>
  </div>

  <!-- Output Cards -->
  <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/70 shadow-sm p-4 md:p-5">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/70 shadow-sm p-4 min-h-[100px] flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Unix Timestamp (s)</span>
          <button class="copy-btn text-xs text-primary-600 dark:text-primary-400 hover:underline" data-copy-target="unix-seconds">Copy</button>
        </div>
        <p id="output-unix-seconds" class="text-base font-medium text-gray-900 dark:text-white font-mono break-all flex-1"></p>
      </div>

      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/70 shadow-sm p-4 min-h-[100px] flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Unix Timestamp (ms)</span>
          <button class="copy-btn text-xs text-primary-600 dark:text-primary-400 hover:underline" data-copy-target="unix-milliseconds">Copy</button>
        </div>
        <p id="output-unix-milliseconds" class="text-base font-medium text-gray-900 dark:text-white font-mono break-all flex-1"></p>
      </div>

      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/70 shadow-sm p-4 min-h-[100px] flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">ISO 8601</span>
          <button class="copy-btn text-xs text-primary-600 dark:text-primary-400 hover:underline" data-copy-target="iso8601">Copy</button>
        </div>
        <p id="output-iso8601" class="text-base font-medium text-gray-900 dark:text-white font-mono break-all flex-1"></p>
      </div>

      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/70 shadow-sm p-4 min-h-[100px] flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">RFC 2822</span>
          <button class="copy-btn text-xs text-primary-600 dark:text-primary-400 hover:underline" data-copy-target="rfc2822">Copy</button>
        </div>
        <p id="output-rfc2822" class="text-base font-medium text-gray-900 dark:text-white font-mono break-all flex-1"></p>
      </div>

      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/70 shadow-sm p-4 min-h-[100px] flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Local Time</span>
          <button class="copy-btn text-xs text-primary-600 dark:text-primary-400 hover:underline" data-copy-target="local-time">Copy</button>
        </div>
        <p id="output-local-time" class="text-base font-medium text-gray-900 dark:text-white font-mono break-all flex-1"></p>
        <p id="output-local-timezone" class="text-xs text-gray-500 dark:text-gray-400 mt-1"></p>
      </div>

      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/70 shadow-sm p-4 min-h-[100px] flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Selected Timezone</span>
          <button class="copy-btn text-xs text-primary-600 dark:text-primary-400 hover:underline" data-copy-target="selected-timezone">Copy</button>
        </div>
        <p id="output-selected-timezone" class="text-base font-medium text-gray-900 dark:text-white font-mono break-all flex-1"></p>
        <p id="output-selected-timezone-name" class="text-xs text-gray-500 dark:text-gray-400 mt-1"></p>
      </div>
    </div>
  </div>
</div>

<!-- Advanced Mode -->
<div id="advanced-mode" class="hidden space-y-6">
  <!-- Input Section (shared with Simple Mode) -->
  <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/70 shadow-sm p-4 md:p-5 space-y-3">
    <div class="flex items-center justify-between gap-2">
      <label for="timestamp-input-advanced" class="text-base font-semibold text-gray-900 dark:text-white">
        Enter timestamp or date (auto-detected)
      </label>
    </div>
    <div class="relative">
      <input 
        type="text" 
        id="timestamp-input-advanced" 
        class="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
        placeholder="1699999999 or 2024-01-15T10:30:00Z"
      />
    </div>
    <div id="input-error-advanced" class="hidden mt-2 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-600 rounded text-sm text-red-700 dark:text-red-400"></div>
    
    <!-- Quick Adjust Buttons -->
    <div class="mt-4">
      <span class="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Quick adjust:</span>
      <div class="flex flex-wrap gap-2">
        <button class="quick-adjust-btn-advanced px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" data-adjust="-3600000">-1h</button>
        <button class="quick-adjust-btn-advanced px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" data-adjust="-86400000">-1d</button>
        <button class="quick-adjust-btn-advanced px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" data-adjust="-604800000">-1w</button>
        <button class="quick-adjust-btn-advanced px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" data-adjust="3600000">+1h</button>
        <button class="quick-adjust-btn-advanced px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" data-adjust="86400000">+1d</button>
        <button class="quick-adjust-btn-advanced px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" data-adjust="604800000">+1w</button>
      </div>
    </div>
  </div>

  <!-- Unified Conversion Panel -->
  <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/70 shadow-sm p-4 md:p-6 space-y-6">
    <!-- Priority 1: Human-Readable Date/Time (Large, Prominent) -->
    <div class="space-y-4">
      <div class="pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">Human-Readable Date & Time</h3>
        <div class="space-y-3">
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Local Time</p>
            <p id="unified-local-time" class="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white"></p>
            <p id="unified-local-timezone" class="text-sm text-gray-500 dark:text-gray-400 mt-1"></p>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">UTC</p>
            <p id="unified-utc-time" class="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white"></p>
          </div>
        </div>
      </div>
    </div>

    <!-- Priority 2: Numerical Unix Epoch Values (Stacked List) -->
    <div class="space-y-3">
      <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Unix Epoch Values</h3>
      <div class="space-y-2">
        <div class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Seconds:</span>
            <span id="unified-seconds" class="text-sm font-mono text-gray-900 dark:text-white truncate flex-1"></span>
          </div>
          <button class="copy-btn ml-3 px-3 py-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors whitespace-nowrap" data-copy-target="unified-seconds">Copy</button>
        </div>
        <div class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Milliseconds:</span>
            <span id="unified-milliseconds" class="text-sm font-mono text-gray-900 dark:text-white truncate flex-1"></span>
          </div>
          <button class="copy-btn ml-3 px-3 py-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors whitespace-nowrap" data-copy-target="unified-milliseconds">Copy</button>
        </div>
        <div class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Microseconds:</span>
            <span id="unified-microseconds" class="text-sm font-mono text-gray-900 dark:text-white truncate flex-1"></span>
          </div>
          <button class="copy-btn ml-3 px-3 py-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors whitespace-nowrap" data-copy-target="unified-microseconds">Copy</button>
        </div>
        <div class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Nanoseconds:</span>
            <span id="unified-nanoseconds" class="text-sm font-mono text-gray-900 dark:text-white truncate flex-1"></span>
          </div>
          <button class="copy-btn ml-3 px-3 py-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors whitespace-nowrap" data-copy-target="unified-nanoseconds">Copy</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Timezone Conversion -->
  <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/70 shadow-sm p-4 md:p-5 space-y-3">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
      <span>🌍</span>
      <span>Timezone Conversion</span>
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label for="from-timezone" class="text-base font-semibold text-gray-900 dark:text-white">From</label>
        <select id="from-timezone" class="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all">
          <option value="UTC">UTC</option>
          <option value="browser" selected>Browser Timezone</option>
          <option value="America/New_York">New York (EST)</option>
          <option value="America/Los_Angeles">Los Angeles (PST)</option>
          <option value="Europe/London">London (GMT)</option>
          <option value="Asia/Tokyo">Tokyo (JST)</option>
        </select>
      </div>
      <div>
        <label for="to-timezone" class="text-base font-semibold text-gray-900 dark:text-white">To</label>
        <select id="to-timezone" class="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all">
          <option value="UTC">UTC</option>
          <option value="browser">Browser Timezone</option>
          <option value="America/New_York" selected>New York (EST)</option>
          <option value="America/Los_Angeles">Los Angeles (PST)</option>
          <option value="Europe/London">London (GMT)</option>
          <option value="Asia/Tokyo">Tokyo (JST)</option>
        </select>
      </div>
    </div>
    <div class="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg">
      <div class="flex items-center justify-between">
        <div>
          <span id="from-timezone-label" class="text-xs text-gray-600 dark:text-gray-400 block"></span>
          <span id="from-timezone-time" class="text-sm font-mono text-gray-900 dark:text-white"></span>
        </div>
        <span class="text-gray-500 dark:text-gray-400">→</span>
        <div class="text-right">
          <span id="to-timezone-label" class="text-xs text-gray-600 dark:text-gray-400 block"></span>
          <span id="to-timezone-time" class="text-sm font-mono text-gray-900 dark:text-white"></span>
        </div>
      </div>
    </div>
  </div>

  <!-- Epoch & Format -->
  <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/70 shadow-sm p-4 md:p-5 space-y-3">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
      <span>📅</span>
      <span>Epoch & Format</span>
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label for="epoch-select" class="text-base font-semibold text-gray-900 dark:text-white">Epoch Type</label>
        <select id="epoch-select" class="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all">
          <option value="unix" selected>Unix (1970)</option>
          <option value="excel">Excel (1900)</option>
          <option value="mac">Mac (1904)</option>
        </select>
      </div>
      <div>
        <label for="format-select" class="text-base font-semibold text-gray-900 dark:text-white">Output Format</label>
        <select id="format-select" class="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all">
          <option value="iso" selected>ISO 8601</option>
          <option value="rfc">RFC 2822</option>
          <option value="short">Short Date</option>
          <option value="long">Long Date</option>
          <option value="time">Time Only</option>
          <option value="date">Date Only</option>
        </select>
      </div>
    </div>
    <div class="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg">
      <div class="flex items-center justify-between">
        <span id="formatted-output" class="text-sm font-mono text-gray-900 dark:text-white"></span>
        <button class="copy-btn text-xs text-primary-600 dark:text-primary-400 hover:underline" data-copy-target="formatted-output">Copy</button>
      </div>
    </div>
  </div>

  <!-- Time Difference Tool -->
  <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/70 shadow-sm p-4 md:p-5 space-y-3">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
      <span>⚖️</span>
      <span>Time Difference</span>
    </h3>
    <label for="compare-timestamp" class="text-base font-semibold text-gray-900 dark:text-white">Compare with timestamp</label>
    <input 
      type="text" 
      id="compare-timestamp" 
      class="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all mb-4"
      placeholder="Enter timestamp to compare"
    />
    <div id="time-difference-result" class="hidden p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs text-gray-600 dark:text-gray-400">Difference</span>
        <span id="difference-status" class="text-xs px-2 py-0.5 rounded-full"></span>
      </div>
      <span id="difference-text" class="text-lg font-medium text-gray-900 dark:text-white"></span>
    </div>
  </div>
</div>

<div class="mt-12 p-6 bg-gradient-to-r from-primary-50 via-primary-100/50 to-accent-50 dark:from-gray-800 dark:via-primary-900/30 dark:to-gray-800 rounded-lg border-2 border-primary-300 dark:border-primary-500/50 shadow-md dark:shadow-lg dark:shadow-primary-900/20">
  <h2 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white">About Timestamp Converter</h2>
  <p class="text-gray-700 dark:text-gray-300 mb-3">
    Convert Unix timestamps, switch timezones, and compare times with precision. This comprehensive tool supports Unix seconds and milliseconds, 
    ISO 8601, RFC 2822, and timezone conversions. All operations run entirely in your browser, ensuring your data remains private and secure.
  </p>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
      <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">🕐 Simple Mode</h3>
      <p class="text-sm text-blue-800 dark:text-blue-200">
        Quick conversions with auto-detection of Unix seconds, milliseconds, ISO 8601, and date strings. Includes quick adjust buttons and timezone selector.
      </p>
    </div>
    <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
      <h3 class="font-semibold text-green-900 dark:text-green-100 mb-2">⚙️ Advanced Mode</h3>
      <p class="text-sm text-green-800 dark:text-green-200">
        Unit conversion (seconds, milliseconds, microseconds, nanoseconds), timezone conversion, epoch selection, format presets, and time difference calculator.
      </p>
    </div>
  </div>
  <p class="text-sm text-amber-700 dark:text-amber-300 mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
    <strong>Tip:</strong> Click any "Copy" button to copy the value to your clipboard. The tool automatically detects whether your input is Unix seconds, milliseconds, or a date string.
  </p>
</div>

</div>

