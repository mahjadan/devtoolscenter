/**
 * Timestamp Converter Tool
 * Convert Unix timestamps, switch timezones, compare times
 */

// Time utilities (inlined to avoid ES module import path issues with asset fingerprinting)
function parseTimestamp(input) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^\d+$/.test(trimmed)) {
    const num = parseInt(trimmed, 10);
    if (trimmed.length === 10) return num * 1000;
    else if (trimmed.length === 13) return num;
    else if (trimmed.length === 16) return Math.floor(num / 1000);
    else if (trimmed.length === 19) return Math.floor(num / 1000000);
    else return num < 10000000000 ? num * 1000 : num;
  }
  const parsed = Date.parse(trimmed);
  return !isNaN(parsed) ? parsed : null;
}

function formatUnixSeconds(timestampMs) {
  return Math.floor(timestampMs / 1000).toString();
}

function formatUnixMilliseconds(timestampMs) {
  return timestampMs.toString();
}

function formatISO8601(timestampMs) {
  return new Date(timestampMs).toISOString();
}

function formatRFC2822(timestampMs) {
  return new Date(timestampMs).toUTCString();
}

function formatLocalTime(timestampMs, timezone = null) {
  const date = new Date(timestampMs);
  if (timezone) {
    return date.toLocaleString('en-US', { timeZone: timezone });
  }
  return date.toLocaleString();
}

function getTimezoneName(timestampMs, timezone = null) {
  if (timezone) return timezone;
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function formatTimestamp(timestampMs, format = 'iso', timezone = null) {
  const date = new Date(timestampMs);
  const options = timezone ? { timeZone: timezone } : {};
  switch (format) {
    case 'iso': return date.toISOString();
    case 'rfc': return date.toUTCString();
    case 'short': return date.toLocaleDateString('en-US', { ...options, month: 'short', day: 'numeric', year: 'numeric' });
    case 'long': return date.toLocaleDateString('en-US', { ...options, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    case 'time': return date.toLocaleTimeString('en-US', options);
    case 'date': return date.toLocaleDateString('en-US', options);
    default: return date.toISOString();
  }
}

function getTimeDifference(timestampMs1, timestampMs2) {
  const diff = timestampMs2 - timestampMs1;
  const isNegative = diff < 0;
  const absDiff = Math.abs(diff);
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);
  let text = '';
  if (days > 0) text = `${days}d ${hours}h ${minutes}m`;
  else if (hours > 0) text = `${hours}h ${minutes}m`;
  else if (minutes > 0) text = `${minutes}m ${seconds}s`;
  else text = `${seconds}s`;
  if (isNegative) text = `-${text}`;
  return { text, isNegative, days, hours, minutes, seconds, milliseconds: absDiff };
}

// DOM Elements
const simpleModeBtn = document.getElementById('simple-mode-btn');
const advancedModeBtn = document.getElementById('advanced-mode-btn');
const simpleMode = document.getElementById('simple-mode');
const advancedMode = document.getElementById('advanced-mode');

// Current Time Panel
const currentTimePanel = document.getElementById('current-time-panel');
const currentUnixSeconds = document.getElementById('current-unix-seconds');
const currentHumanReadable = document.getElementById('current-human-readable');
const useNowBtn = document.getElementById('use-now-btn');

// Simple Mode Elements
const timestampInput = document.getElementById('timestamp-input');
const timestampInputAdvanced = document.getElementById('timestamp-input-advanced');
const clearInputBtn = document.getElementById('clear-input-btn');
const inputError = document.getElementById('input-error');
const inputErrorAdvanced = document.getElementById('input-error-advanced');
const timezoneSelect = document.getElementById('timezone-select');
const quickAdjustBtns = document.querySelectorAll('.quick-adjust-btn');
const quickAdjustBtnsAdvanced = document.querySelectorAll('.quick-adjust-btn-advanced');

// Simple Mode Outputs
const outputUnixSeconds = document.getElementById('output-unix-seconds');
const outputUnixMilliseconds = document.getElementById('output-unix-milliseconds');
const outputISO8601 = document.getElementById('output-iso8601');
const outputRFC2822 = document.getElementById('output-rfc2822');
const outputLocalTime = document.getElementById('output-local-time');
const outputLocalTimezone = document.getElementById('output-local-timezone');
const outputSelectedTimezone = document.getElementById('output-selected-timezone');
const outputSelectedTimezoneName = document.getElementById('output-selected-timezone-name');

// Advanced Mode Elements - Unified Conversion Panel
const unifiedLocalTime = document.getElementById('unified-local-time');
const unifiedLocalTimezone = document.getElementById('unified-local-timezone');
const unifiedUtcTime = document.getElementById('unified-utc-time');
const unifiedSeconds = document.getElementById('unified-seconds');
const unifiedMilliseconds = document.getElementById('unified-milliseconds');
const unifiedMicroseconds = document.getElementById('unified-microseconds');
const unifiedNanoseconds = document.getElementById('unified-nanoseconds');

const fromTimezone = document.getElementById('from-timezone');
const toTimezone = document.getElementById('to-timezone');
const fromTimezoneLabel = document.getElementById('from-timezone-label');
const fromTimezoneTime = document.getElementById('from-timezone-time');
const toTimezoneLabel = document.getElementById('to-timezone-label');
const toTimezoneTime = document.getElementById('to-timezone-time');

const epochSelect = document.getElementById('epoch-select');
const formatSelect = document.getElementById('format-select');
const formattedOutput = document.getElementById('formatted-output');

const compareTimestamp = document.getElementById('compare-timestamp');
const timeDifferenceResult = document.getElementById('time-difference-result');
const differenceStatus = document.getElementById('difference-status');
const differenceText = document.getElementById('difference-text');

// State
let currentMode = 'simple';
let currentTimestamp = Date.now();
let debounceTimer = null;

// Epoch offsets
const EPOCH_OFFSETS = {
  unix: 0,
  excel: -2209161600000,
  mac: -2082844800000
};

// Unit multipliers
const UNIT_MULTIPLIERS = {
  seconds: 1000,
  milliseconds: 1,
  microseconds: 0.001,
  nanoseconds: 0.000001
};

// Initialize
function init() {
  // Initial update of current time
  updateCurrentTime();
  
  // Check URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const valueParam = urlParams.get('value');
  if (valueParam) {
    if (timestampInput) timestampInput.value = valueParam;
    if (timestampInputAdvanced) timestampInputAdvanced.value = valueParam;
    handleInput(valueParam);
  } else {
    // Initialize with current time
    currentTimestamp = Date.now();
    const value = Math.floor(currentTimestamp / 1000).toString();
    if (timestampInput) timestampInput.value = value;
    if (timestampInputAdvanced) timestampInputAdvanced.value = value;
    updateOutputs();
    updateAdvancedMode();
  }

  // Setup event listeners
  setupEventListeners();
  
  // Start current time update interval
  setInterval(updateCurrentTime, 1000);
}

function setupEventListeners() {
  // Mode switcher - use data-mode attribute like base64 tool
  const modeButtons = document.querySelectorAll('.mode-toggle');
  if (modeButtons.length === 0) {
    console.error('Mode toggle buttons not found');
    return;
  }
  
  modeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const mode = btn.dataset.mode;
      if (mode) {
        switchMode(mode);
      }
    });
  });

  // Use Now button
  useNowBtn?.addEventListener('click', handleUseNow);

  // Input handling (both simple and advanced)
  timestampInput?.addEventListener('input', (e) => {
    handleInput(e.target.value);
    // Sync with advanced input
    if (timestampInputAdvanced) {
      timestampInputAdvanced.value = e.target.value;
    }
  });

  timestampInputAdvanced?.addEventListener('input', (e) => {
    handleInput(e.target.value);
    // Sync with simple input
    if (timestampInput) {
      timestampInput.value = e.target.value;
    }
  });

  clearInputBtn?.addEventListener('click', () => {
    timestampInput.value = '';
    if (timestampInputAdvanced) timestampInputAdvanced.value = '';
    clearInputBtn.classList.add('hidden');
    hideInputError();
  });

  // Quick adjust buttons (simple mode)
  quickAdjustBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const adjust = parseInt(btn.dataset.adjust);
      adjustTimestamp(adjust);
    });
  });

  // Quick adjust buttons (advanced mode)
  quickAdjustBtnsAdvanced.forEach(btn => {
    btn.addEventListener('click', () => {
      const adjust = parseInt(btn.dataset.adjust);
      adjustTimestamp(adjust);
    });
  });

  // Timezone selector
  timezoneSelect?.addEventListener('change', (e) => {
    updateOutputs();
    // Also update advanced mode timezone conversions
    updateAdvancedMode();
    // Add visual feedback - specifically highlight the Selected Timezone card
    // Use a small delay to ensure DOM is updated first
    setTimeout(() => {
      flashSelectedTimezoneCard();
    }, 50);
    // Also flash all outputs for consistency (with delay to let Selected Timezone flash first)
    setTimeout(() => {
      flashAllOutputs();
    }, 150);
  });

  // Advanced mode listeners
  fromTimezone?.addEventListener('change', () => {
    updateTimezoneConversion();
  });

  toTimezone?.addEventListener('change', () => {
    updateTimezoneConversion();
  });

  epochSelect?.addEventListener('change', () => {
    updateFormattedOutput();
  });

  formatSelect?.addEventListener('change', () => {
    updateFormattedOutput();
  });

  compareTimestamp?.addEventListener('input', (e) => {
    handleCompareInput(e.target.value);
  });

  // Copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.dataset.copyTarget;
      copyToClipboard(targetId, btn);
    });
  });
}

function switchMode(mode) {
  currentMode = mode;
  
  // Update button states
  const modeButtons = document.querySelectorAll('.mode-toggle');
  modeButtons.forEach(btn => {
    if (btn.dataset.mode === mode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  if (mode === 'simple') {
    if (simpleMode) simpleMode.classList.remove('hidden');
    if (advancedMode) advancedMode.classList.add('hidden');
    updateOutputs();
  } else if (mode === 'advanced') {
    if (simpleMode) simpleMode.classList.add('hidden');
    if (advancedMode) advancedMode.classList.remove('hidden');
    updateAdvancedMode();
  }
}

function updateCurrentTime() {
  const now = Date.now();
  const seconds = Math.floor(now / 1000);
  if (currentUnixSeconds) currentUnixSeconds.textContent = seconds;
  if (currentHumanReadable) currentHumanReadable.textContent = new Date(now).toLocaleString();
}

function handleUseNow() {
  const now = Date.now();
  currentTimestamp = now;
  const value = Math.floor(now / 1000).toString();
  if (timestampInput) timestampInput.value = value;
  if (timestampInputAdvanced) timestampInputAdvanced.value = value;
  if (clearInputBtn) clearInputBtn.classList.remove('hidden');
  updateOutputs();
  updateAdvancedMode();
  if (timestampInput) flashElement(timestampInput);
  if (timestampInputAdvanced) flashElement(timestampInputAdvanced);
  flashAllOutputs();
}

function handleInput(value) {
  if (value.trim()) {
    clearInputBtn.classList.remove('hidden');
  } else {
    clearInputBtn.classList.add('hidden');
    hideInputError();
    return;
  }

  // Debounce input
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const parsed = parseTimestamp(value);
    
    if (parsed === null) {
      showInputError('Invalid timestamp format. Try Unix seconds, milliseconds, ISO 8601, or a date string.');
      return;
    }

    hideInputError();
    currentTimestamp = parsed;
    updateOutputs();
    updateAdvancedMode();
    flashAllOutputs();
  }, 300);
}

function adjustTimestamp(ms) {
  currentTimestamp += ms;
  const value = Math.floor(currentTimestamp / 1000).toString();
  if (timestampInput) timestampInput.value = value;
  if (timestampInputAdvanced) timestampInputAdvanced.value = value;
  if (clearInputBtn) clearInputBtn.classList.remove('hidden');
  updateOutputs();
  updateAdvancedMode();
  if (timestampInput) flashElement(timestampInput);
  if (timestampInputAdvanced) flashElement(timestampInputAdvanced);
  flashAllOutputs();
}

function updateOutputs() {
  if (!currentTimestamp) {
    currentTimestamp = Date.now();
  }

  // Get the selected timezone value - handle empty string and null cases
  let selectedTz = null;
  if (timezoneSelect && timezoneSelect.value) {
    selectedTz = timezoneSelect.value === 'browser' ? null : timezoneSelect.value;
  }
  
  // Unix seconds
  if (outputUnixSeconds) outputUnixSeconds.textContent = formatUnixSeconds(currentTimestamp);
  
  // Unix milliseconds
  if (outputUnixMilliseconds) outputUnixMilliseconds.textContent = formatUnixMilliseconds(currentTimestamp);
  
  // ISO 8601
  if (outputISO8601) outputISO8601.textContent = formatISO8601(currentTimestamp);
  
  // RFC 2822
  if (outputRFC2822) outputRFC2822.textContent = formatRFC2822(currentTimestamp);
  
  // Local time
  const localTz = getTimezoneName(currentTimestamp);
  if (outputLocalTime) outputLocalTime.textContent = formatLocalTime(currentTimestamp);
  if (outputLocalTimezone) outputLocalTimezone.textContent = `(${localTz})`;
  
  // Selected timezone - always update, even if it's browser timezone
  if (selectedTz) {
    // A specific timezone was selected
    if (outputSelectedTimezone) outputSelectedTimezone.textContent = formatLocalTime(currentTimestamp, selectedTz);
    if (outputSelectedTimezoneName) outputSelectedTimezoneName.textContent = `(${selectedTz})`;
  } else {
    // Browser timezone (or no selection)
    const browserTz = getTimezoneName(currentTimestamp);
    if (outputSelectedTimezone) outputSelectedTimezone.textContent = formatLocalTime(currentTimestamp);
    if (outputSelectedTimezoneName) outputSelectedTimezoneName.textContent = `(${browserTz})`;
  }
}

function updateAdvancedMode() {
  updateUnitConversions();
  updateTimezoneConversion();
  updateFormattedOutput();
}

function updateUnitConversions() {
  if (!currentTimestamp) {
    currentTimestamp = Date.now();
  }

  // Update human-readable date/time (Priority 1)
  const date = new Date(currentTimestamp);
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Format Local Time - large, prominent display
  if (unifiedLocalTime) {
    const localDateStr = date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    unifiedLocalTime.textContent = localDateStr;
  }
  
  if (unifiedLocalTimezone) {
    unifiedLocalTimezone.textContent = `(${localTz})`;
  }
  
  // Format UTC Time - large, prominent display
  if (unifiedUtcTime) {
    // Create a date formatter for UTC
    const utcDateStr = date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    });
    unifiedUtcTime.textContent = `${utcDateStr} (UTC)`;
  }
  
  // Update numerical Unix Epoch values (Priority 2) - stacked list
  if (unifiedSeconds) unifiedSeconds.textContent = Math.floor(currentTimestamp / UNIT_MULTIPLIERS.seconds).toString();
  if (unifiedMilliseconds) unifiedMilliseconds.textContent = Math.floor(currentTimestamp / UNIT_MULTIPLIERS.milliseconds).toString();
  if (unifiedMicroseconds) unifiedMicroseconds.textContent = Math.floor(currentTimestamp / UNIT_MULTIPLIERS.microseconds).toString();
  if (unifiedNanoseconds) unifiedNanoseconds.textContent = Math.floor(currentTimestamp / UNIT_MULTIPLIERS.nanoseconds).toString();
}

function updateTimezoneConversion() {
  if (!currentTimestamp) {
    currentTimestamp = Date.now();
  }

  const fromTz = fromTimezone?.value === 'browser' ? null : fromTimezone?.value || 'UTC';
  const toTz = toTimezone?.value === 'browser' ? null : toTimezone?.value || 'UTC';

  if (fromTimezoneLabel) fromTimezoneLabel.textContent = fromTz || 'Browser Timezone';
  if (toTimezoneLabel) toTimezoneLabel.textContent = toTz || 'Browser Timezone';

  if (fromTimezoneTime) fromTimezoneTime.textContent = formatLocalTime(currentTimestamp, fromTz);
  if (toTimezoneTime) toTimezoneTime.textContent = formatLocalTime(currentTimestamp, toTz);
}

function updateFormattedOutput() {
  if (!currentTimestamp) {
    currentTimestamp = Date.now();
  }

  const epoch = epochSelect?.value || 'unix';
  const format = formatSelect?.value || 'iso';
  const offset = EPOCH_OFFSETS[epoch] || 0;
  const adjustedTimestamp = currentTimestamp + offset;

  if (formattedOutput) formattedOutput.textContent = formatTimestamp(adjustedTimestamp, format);
}

function handleCompareInput(value) {
  if (!value.trim()) {
    timeDifferenceResult.classList.add('hidden');
    return;
  }

  const compareTs = parseTimestamp(value);
  if (compareTs === null) {
    timeDifferenceResult.classList.add('hidden');
    return;
  }

  const diff = getTimeDifference(currentTimestamp, compareTs);
  
  differenceText.textContent = diff.text;
  
  if (diff.isNegative) {
    differenceStatus.textContent = 'in the past';
    differenceStatus.className = 'text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400';
  } else {
    differenceStatus.textContent = 'in the future';
    differenceStatus.className = 'text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400';
  }

  timeDifferenceResult.classList.remove('hidden');
}

function copyToClipboard(targetId, button) {
  let text = '';
  
  // Map target IDs to text content
  const textMap = {
    'unix-seconds': outputUnixSeconds?.textContent,
    'unix-milliseconds': outputUnixMilliseconds?.textContent,
    'iso8601': outputISO8601?.textContent,
    'rfc2822': outputRFC2822?.textContent,
    'local-time': outputLocalTime?.textContent,
    'selected-timezone': outputSelectedTimezone?.textContent,
    'unified-seconds': unifiedSeconds?.textContent,
    'unified-milliseconds': unifiedMilliseconds?.textContent,
    'unified-microseconds': unifiedMicroseconds?.textContent,
    'unified-nanoseconds': unifiedNanoseconds?.textContent,
    'formatted-output': formattedOutput?.textContent
  };

  text = textMap[targetId] || '';

  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    // Show feedback
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.classList.add('text-green-600', 'dark:text-green-400');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('text-green-600', 'dark:text-green-400');
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

function showInputError(message) {
  if (inputError) {
    inputError.textContent = message;
    inputError.classList.remove('hidden');
    timestampInput?.classList.add('error');
  }
}

function hideInputError() {
  inputError?.classList.add('hidden');
  timestampInput?.classList.remove('error');
}

function flashElement(element) {
  if (!element) return;
  element.classList.add('base64-output-flash');
  setTimeout(() => {
    element.classList.remove('base64-output-flash');
  }, 300);
}

function flashOutputCard(element) {
  if (!element) return;
  // Apply focus effect similar to input field (border-primary-500, ring-2, ring-primary-500/20)
  element.classList.add('timestamp-output-focus');
  setTimeout(() => {
    element.classList.remove('timestamp-output-focus');
  }, 600); // Keep the effect visible longer for better feedback
}

function flashSelectedTimezoneCard() {
  // Find the Selected Timezone card using multiple methods
  let selectedTimezoneCard = null;
  
  // Method 1: Find by the output element's parent (most reliable)
  if (outputSelectedTimezone) {
    selectedTimezoneCard = outputSelectedTimezone.closest('.rounded-xl');
  }
  
  // Method 2: Direct querySelector for the card containing the output-selected-timezone
  if (!selectedTimezoneCard) {
    selectedTimezoneCard = document.querySelector('#output-selected-timezone')?.closest('.rounded-xl');
  }
  
  // Method 3: Search all cards for the one containing "Selected Timezone" label
  if (!selectedTimezoneCard) {
    const allCards = document.querySelectorAll('#simple-mode .rounded-xl');
    for (const card of allCards) {
      const spans = card.querySelectorAll('span');
      for (const span of spans) {
        if (span.textContent && span.textContent.trim().toUpperCase() === 'SELECTED TIMEZONE') {
          selectedTimezoneCard = card;
          break;
        }
      }
      if (selectedTimezoneCard) break;
    }
  }
  
  // Method 4: Find by the last card in the grid (Selected Timezone is the 6th card)
  if (!selectedTimezoneCard) {
    const allCards = document.querySelectorAll('#simple-mode .rounded-xl');
    if (allCards.length >= 6) {
      selectedTimezoneCard = allCards[5]; // 6th card (0-indexed)
    }
  }
  
  if (selectedTimezoneCard) {
    // Use inline styles to override Tailwind classes - this is more reliable
    const primaryColor = '#0ea5e9'; // primary-500
    const primaryColorDark = '#38bdf8'; // primary-400 for dark mode
    const isDark = document.documentElement.classList.contains('dark') || 
                   document.documentElement.getAttribute('data-theme') === 'dark';
    const borderColor = isDark ? primaryColorDark : primaryColor;
    const shadowColor = isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(14, 165, 233, 0.25)';
    
    // Store original styles to restore later
    const originalBorderColor = selectedTimezoneCard.style.borderColor;
    const originalBoxShadow = selectedTimezoneCard.style.boxShadow;
    const originalTransform = selectedTimezoneCard.style.transform;
    const originalTransition = selectedTimezoneCard.style.transition;
    
    // Apply the focus effect using inline styles (overrides Tailwind)
    selectedTimezoneCard.style.borderColor = borderColor;
    selectedTimezoneCard.style.boxShadow = `0 0 0 3px ${shadowColor}`;
    selectedTimezoneCard.style.transform = 'scale(1.01)';
    selectedTimezoneCard.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease';
    selectedTimezoneCard.classList.add('timestamp-output-focus');
    
    // Remove the effect after 800ms
    setTimeout(() => {
      selectedTimezoneCard.style.borderColor = originalBorderColor;
      selectedTimezoneCard.style.boxShadow = originalBoxShadow;
      selectedTimezoneCard.style.transform = originalTransform;
      selectedTimezoneCard.style.transition = originalTransition;
      selectedTimezoneCard.classList.remove('timestamp-output-focus');
    }, 800);
    
    // Apply a second flash for extra emphasis
    setTimeout(() => {
      selectedTimezoneCard.style.borderColor = borderColor;
      selectedTimezoneCard.style.boxShadow = `0 0 0 3px ${shadowColor}`;
      selectedTimezoneCard.style.transform = 'scale(1.01)';
      selectedTimezoneCard.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease';
      selectedTimezoneCard.classList.add('timestamp-output-focus');
      
      setTimeout(() => {
        selectedTimezoneCard.style.borderColor = originalBorderColor;
        selectedTimezoneCard.style.boxShadow = originalBoxShadow;
        selectedTimezoneCard.style.transform = originalTransform;
        selectedTimezoneCard.style.transition = originalTransition;
        selectedTimezoneCard.classList.remove('timestamp-output-focus');
      }, 400);
    }, 400);
  } else {
    // Fallback: flash all cards if we can't find the specific one
    flashAllOutputs();
  }
}

function flashAllOutputs() {
  // Flash all output cards in simple mode
  const outputCards = document.querySelectorAll('#simple-mode .rounded-xl');
  outputCards.forEach((card, index) => {
    setTimeout(() => {
      flashOutputCard(card);
    }, index * 50); // Stagger the flashes for a nice effect
  });

  // Flash advanced mode outputs
  if (currentMode === 'advanced') {
    // Flash unified conversion panel items
    const unifiedItems = document.querySelectorAll('#advanced-mode .rounded-lg.border');
    unifiedItems.forEach((item, index) => {
      setTimeout(() => {
        flashOutputCard(item);
      }, index * 50);
    });

    // Flash timezone conversion card
    const timezoneCard = document.querySelector('#advanced-mode .p-4.bg-gray-50, #advanced-mode .p-4.bg-gray-900');
    if (timezoneCard && timezoneCard.querySelector('#from-timezone-time')) {
      setTimeout(() => {
        flashOutputCard(timezoneCard);
      }, 200);
    }

    // Flash formatted output card (find parent of formatted-output element)
    const formattedOutputEl = document.getElementById('formatted-output');
    if (formattedOutputEl) {
      const formattedCard = formattedOutputEl.closest('.p-4');
      if (formattedCard) {
        setTimeout(() => {
          flashOutputCard(formattedCard);
        }, 250);
      }
    }
  }
}

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

