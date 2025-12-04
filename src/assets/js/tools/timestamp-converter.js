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

function getTimezoneOffset(timestampMs, timezone = null) {
  const date = new Date(timestampMs);
  let offsetMinutes;
  
  if (timezone) {
    // Calculate offset by comparing UTC time with timezone time
    // Create a date formatter for the target timezone
    const utcFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const tzFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    const utcTime = utcFormatter.format(date);
    const tzTime = tzFormatter.format(date);
    
    // Parse times (HH:MM format)
    const [utcHours, utcMinutes] = utcTime.split(':').map(Number);
    const [tzHours, tzMinutes] = tzTime.split(':').map(Number);
    
    // Calculate difference in minutes
    const utcTotal = utcHours * 60 + utcMinutes;
    const tzTotal = tzHours * 60 + tzMinutes;
    let diff = tzTotal - utcTotal;
    
    // Handle day rollover (if difference is more than 12 hours, adjust)
    if (diff > 12 * 60) diff -= 24 * 60;
    if (diff < -12 * 60) diff += 24 * 60;
    
    offsetMinutes = diff;
  } else {
    offsetMinutes = -date.getTimezoneOffset();
  }
  
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const hours = Math.floor(Math.abs(offsetMinutes) / 60);
  const minutes = Math.abs(offsetMinutes) % 60;
  
  if (minutes === 0) {
    return `${sign}${hours}`;
  }
  return `${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
}

function formatTimezoneWithOffset(timestampMs, timezone = null) {
  const tzName = getTimezoneName(timestampMs, timezone);
  const offset = getTimezoneOffset(timestampMs, timezone);
  return `${tzName}, UTC${offset}`;
}

function detectInputUnit(value) {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  
  // Check if it's a pure number
  if (/^\d+$/.test(trimmed)) {
    const num = parseInt(trimmed, 10);
    if (trimmed.length === 10) return 'Seconds';
    else if (trimmed.length === 13) return 'Milliseconds';
    else if (trimmed.length === 16) return 'Microseconds';
    else if (trimmed.length === 19) return 'Nanoseconds';
    else if (num < 10000000000) return 'Seconds';
    else return 'Milliseconds';
  }
  
  // Check for ISO 8601 format
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return 'ISO 8601';
  
  // Check for RFC 2822 format
  if (/^\w{3},\s\d{1,2}\s\w{3}\s\d{4}/.test(trimmed)) return 'RFC 2822';
  
  // Try to parse as date
  const parsed = Date.parse(trimmed);
  if (!isNaN(parsed)) return 'Date String';
  
  return null;
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
const inputUnitIndicator = document.getElementById('input-unit-indicator');
const inputUnitIndicatorAdvanced = document.getElementById('input-unit-indicator-advanced');
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
    if (timestampInput) {
      timestampInput.value = valueParam;
      updateUnitIndicator(valueParam, inputUnitIndicator, clearInputBtn);
    }
    if (timestampInputAdvanced) {
      timestampInputAdvanced.value = valueParam;
      updateUnitIndicator(valueParam, inputUnitIndicatorAdvanced, null);
    }
    handleInput(valueParam);
  } else {
    // Initialize with current time
    currentTimestamp = Date.now();
    const value = Math.floor(currentTimestamp / 1000).toString();
    if (timestampInput) {
      timestampInput.value = value;
      updateUnitIndicator(value, inputUnitIndicator, clearInputBtn);
    }
    if (timestampInputAdvanced) {
      timestampInputAdvanced.value = value;
      updateUnitIndicator(value, inputUnitIndicatorAdvanced, null);
    }
    if (clearInputBtn) clearInputBtn.classList.remove('hidden');
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
    updateUnitIndicator(e.target.value, inputUnitIndicator, clearInputBtn);
    handleInput(e.target.value);
    // Sync with advanced input
    if (timestampInputAdvanced) {
      timestampInputAdvanced.value = e.target.value;
      updateUnitIndicator(e.target.value, inputUnitIndicatorAdvanced, null);
    }
  });

  timestampInputAdvanced?.addEventListener('input', (e) => {
    updateUnitIndicator(e.target.value, inputUnitIndicatorAdvanced, null);
    handleInput(e.target.value);
    // Sync with simple input
    if (timestampInput) {
      timestampInput.value = e.target.value;
      updateUnitIndicator(e.target.value, inputUnitIndicator, clearInputBtn);
    }
  });

  clearInputBtn?.addEventListener('click', () => {
    timestampInput.value = '';
    if (timestampInputAdvanced) timestampInputAdvanced.value = '';
    clearInputBtn.classList.add('hidden');
    hideInputError();
    if (inputUnitIndicator) {
      inputUnitIndicator.classList.add('hidden');
    }
    if (inputUnitIndicatorAdvanced) {
      inputUnitIndicatorAdvanced.classList.add('hidden');
    }
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
    // Add visual feedback - only highlight the Selected Timezone card
    // Use a small delay to ensure DOM is updated first
    setTimeout(() => {
      flashSelectedTimezoneCard();
    }, 50);
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

function updateUnitIndicator(value, indicator, clearBtn) {
  if (!indicator) return;
  
  if (!value || !value.trim()) {
    indicator.classList.add('hidden');
    return;
  }
  
  const unit = detectInputUnit(value);
  if (unit) {
    indicator.textContent = `Interpreted as ${unit}`;
    // Show indicator only when clear button is hidden
    if (clearBtn && !clearBtn.classList.contains('hidden')) {
      // Position indicator to the left of clear button (clear button is at right-4 = 16px, so indicator at 32px)
      indicator.style.right = '32px';
    } else {
      // Position indicator at right-14 (56px) with additional margin
      indicator.style.right = '56px';
    }
    indicator.classList.remove('hidden');
  } else {
    indicator.classList.add('hidden');
  }
}

function handleInput(value) {
  const isSimpleMode = currentMode === 'simple';
  const activeInput = isSimpleMode ? timestampInput : timestampInputAdvanced;
  const activeIndicator = isSimpleMode ? inputUnitIndicator : inputUnitIndicatorAdvanced;
  
  if (value.trim()) {
    if (clearInputBtn && isSimpleMode) {
      clearInputBtn.classList.remove('hidden');
    }
    // Update unit indicator
    if (activeIndicator) {
      updateUnitIndicator(value, activeIndicator, isSimpleMode ? clearInputBtn : null);
    }
  } else {
    if (clearInputBtn && isSimpleMode) {
      clearInputBtn.classList.add('hidden');
    }
    hideInputError();
    if (inputUnitIndicator) inputUnitIndicator.classList.add('hidden');
    if (inputUnitIndicatorAdvanced) inputUnitIndicatorAdvanced.classList.add('hidden');
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
  if (outputLocalTimezone) outputLocalTimezone.textContent = `(${formatTimezoneWithOffset(currentTimestamp)})`;
  
  // Selected timezone - always update, even if it's browser timezone
  if (selectedTz) {
    // A specific timezone was selected
    if (outputSelectedTimezone) outputSelectedTimezone.textContent = formatLocalTime(currentTimestamp, selectedTz);
    if (outputSelectedTimezoneName) outputSelectedTimezoneName.textContent = `(${formatTimezoneWithOffset(currentTimestamp, selectedTz)})`;
  } else {
    // Browser timezone (or no selection)
    const browserTz = getTimezoneName(currentTimestamp);
    if (outputSelectedTimezone) outputSelectedTimezone.textContent = formatLocalTime(currentTimestamp);
    if (outputSelectedTimezoneName) outputSelectedTimezoneName.textContent = `(${formatTimezoneWithOffset(currentTimestamp)})`;
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
    unifiedLocalTimezone.textContent = `(${formatTimezoneWithOffset(currentTimestamp)})`;
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
    unifiedUtcTime.textContent = `${utcDateStr} (UTC, UTC+0)`;
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

  if (fromTimezoneLabel) {
    const fromTzName = fromTz || 'Browser Timezone';
    const fromTzOffset = fromTz ? getTimezoneOffset(currentTimestamp, fromTz) : getTimezoneOffset(currentTimestamp);
    fromTimezoneLabel.textContent = `${fromTzName}, UTC${fromTzOffset}`;
  }
  if (toTimezoneLabel) {
    const toTzName = toTz || 'Browser Timezone';
    const toTzOffset = toTz ? getTimezoneOffset(currentTimestamp, toTz) : getTimezoneOffset(currentTimestamp);
    toTimezoneLabel.textContent = `${toTzName}, UTC${toTzOffset}`;
  }

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
  
  // Debug logging
  console.log('🔍 flashOutputCard called for element:', {
    tagName: element.tagName,
    classes: Array.from(element.classList),
    hasDataAdjust: element.hasAttribute('data-adjust'),
    dataAdjust: element.getAttribute('data-adjust'),
    id: element.id,
    textContent: element.textContent?.substring(0, 50),
    selector: element.matches ? element.matches('button[data-adjust]') : 'N/A'
  });
  
  // Explicitly skip buttons - they should never be animated
  // Check multiple ways: tag name, classes, and data attribute
  const isButton = element.tagName === 'BUTTON';
  const hasQuickAdjustClass = element.classList.contains('quick-adjust-btn') || element.classList.contains('quick-adjust-btn-advanced');
  const hasDataAdjust = element.hasAttribute('data-adjust');
  const isInsideButton = element.closest('button[data-adjust]');
  
  if (isButton || hasQuickAdjustClass || hasDataAdjust || isInsideButton) {
    console.log('❌ Element EXCLUDED from animation:', {
      reason: isButton ? 'is BUTTON tag' : 
              hasQuickAdjustClass ? 'has quick-adjust class' :
              hasDataAdjust ? 'has data-adjust attribute' :
              isInsideButton ? 'inside button with data-adjust' : 'unknown',
      element: element
    });
    return;
  }
  
  console.log('✅ Element WILL BE ANIMATED:', {
    tagName: element.tagName,
    classes: Array.from(element.classList),
    id: element.id
  });
  
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

// Store preview state to avoid duplicate flashes
let previewFlashActive = false;
let previewFlashElements = [];

function previewOutputFlash() {
  // Don't add duplicate preview if already active
  if (previewFlashActive) return;
  previewFlashActive = true;
  previewFlashElements = [];

  // Get theme colors
  const primaryColor = '#0ea5e9'; // primary-500
  const primaryColorDark = '#38bdf8'; // primary-400 for dark mode
  const isDark = document.documentElement.classList.contains('dark') || 
                 document.documentElement.getAttribute('data-theme') === 'dark';
  const borderColor = isDark ? primaryColorDark : primaryColor;
  const shadowColor = isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(14, 165, 233, 0.25)';

  // Preview effect on all output cards in simple mode
  const outputCards = document.querySelectorAll('#simple-mode .rounded-xl');
  outputCards.forEach((card) => {
    if (card) {
      // Store original styles
      const originalBorderColor = card.style.borderColor;
      const originalBoxShadow = card.style.boxShadow;
      const originalTransform = card.style.transform;
      const originalTransition = card.style.transition;
      
      // Apply preview effect using inline styles (overrides Tailwind)
      card.style.borderColor = borderColor;
      card.style.boxShadow = `0 0 0 3px ${shadowColor}`;
      card.style.transform = 'scale(1.01)';
      card.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease';
      card.classList.add('timestamp-output-focus');
      
      // Store element with original styles for cleanup
      previewFlashElements.push({
        element: card,
        originalBorderColor,
        originalBoxShadow,
        originalTransform,
        originalTransition
      });
    }
  });

  // Preview effect on advanced mode outputs
  if (currentMode === 'advanced') {
    // Preview unified conversion panel items (Unix Epoch Values - exclude buttons)
    // Use a more specific selector that targets only the epoch value rows, not buttons
    // Only select divs with rounded-lg.border that are direct children of .space-y-2
    const unifiedItems = document.querySelectorAll('#advanced-mode .space-y-2 > div.rounded-lg.border');
    unifiedItems.forEach((item) => {
      if (item) {
        // Explicitly exclude buttons: check if element is a button, has button classes, data-adjust attribute, or is inside button container
        if (item.tagName === 'BUTTON' || 
            item.classList.contains('quick-adjust-btn') || 
            item.classList.contains('quick-adjust-btn-advanced') ||
            item.hasAttribute('data-adjust') ||
            item.closest('button[data-adjust], .quick-adjust-btn, .quick-adjust-btn-advanced, .flex.flex-wrap.gap-2') ||
            item.querySelector('.quick-adjust-btn, .quick-adjust-btn-advanced, button[data-adjust]')) {
          return;
        }
        
        const originalBorderColor = item.style.borderColor;
        const originalBoxShadow = item.style.boxShadow;
        const originalTransform = item.style.transform;
        const originalTransition = item.style.transition;
        
        item.style.borderColor = borderColor;
        item.style.boxShadow = `0 0 0 3px ${shadowColor}`;
        item.style.transform = 'scale(1.01)';
        item.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease';
        item.classList.add('timestamp-output-focus');
        
        previewFlashElements.push({
          element: item,
          originalBorderColor,
          originalBoxShadow,
          originalTransform,
          originalTransition
        });
      }
    });

    // Preview timezone conversion card
    const timezoneCard = document.querySelector('#advanced-mode .p-4.bg-gray-50, #advanced-mode .p-4.bg-gray-900');
    if (timezoneCard && timezoneCard.querySelector('#from-timezone-time')) {
      const originalBorderColor = timezoneCard.style.borderColor;
      const originalBoxShadow = timezoneCard.style.boxShadow;
      const originalTransform = timezoneCard.style.transform;
      const originalTransition = timezoneCard.style.transition;
      
      timezoneCard.style.borderColor = borderColor;
      timezoneCard.style.boxShadow = `0 0 0 3px ${shadowColor}`;
      timezoneCard.style.transform = 'scale(1.01)';
      timezoneCard.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease';
      timezoneCard.classList.add('timestamp-output-focus');
      
      previewFlashElements.push({
        element: timezoneCard,
        originalBorderColor,
        originalBoxShadow,
        originalTransform,
        originalTransition
      });
    }

    // Preview formatted output card
    const formattedOutputEl = document.getElementById('formatted-output');
    if (formattedOutputEl) {
      const formattedCard = formattedOutputEl.closest('.p-4');
      if (formattedCard) {
        const originalBorderColor = formattedCard.style.borderColor;
        const originalBoxShadow = formattedCard.style.boxShadow;
        const originalTransform = formattedCard.style.transform;
        const originalTransition = formattedCard.style.transition;
        
        formattedCard.style.borderColor = borderColor;
        formattedCard.style.boxShadow = `0 0 0 3px ${shadowColor}`;
        formattedCard.style.transform = 'scale(1.01)';
        formattedCard.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease';
        formattedCard.classList.add('timestamp-output-focus');
        
        previewFlashElements.push({
          element: formattedCard,
          originalBorderColor,
          originalBoxShadow,
          originalTransform,
          originalTransition
        });
      }
    }
  }
}

function removePreviewFlash() {
  if (!previewFlashActive) return;
  previewFlashActive = false;
  
  // Remove preview effect from all elements and restore original styles
  previewFlashElements.forEach((item) => {
    if (item && item.element) {
      // Restore original styles
      item.element.style.borderColor = item.originalBorderColor;
      item.element.style.boxShadow = item.originalBoxShadow;
      item.element.style.transform = item.originalTransform;
      item.element.style.transition = item.originalTransition;
      item.element.classList.remove('timestamp-output-focus');
    }
  });
  previewFlashElements = [];
}

function flashAllOutputs() {
  console.log('🚀 flashAllOutputs called, currentMode:', currentMode);
  
  // Flash all output cards in simple mode (exclude buttons)
  const outputCards = document.querySelectorAll('#simple-mode .rounded-xl');
  console.log('📦 Simple mode: Found', outputCards.length, 'cards with .rounded-xl');
  outputCards.forEach((card, index) => {
    // Skip if it's a button or contains buttons
    const hasQuickAdjustClass = card.classList.contains('quick-adjust-btn');
    const containsQuickAdjust = card.querySelector('.quick-adjust-btn');
    
    if (hasQuickAdjustClass || containsQuickAdjust) {
      console.log('❌ Simple mode card EXCLUDED:', {
        index,
        hasQuickAdjustClass,
        containsQuickAdjust,
        element: card
      });
      return;
    }
    setTimeout(() => {
      flashOutputCard(card);
    }, index * 50); // Stagger the flashes for a nice effect
  });

  // Flash advanced mode outputs
  if (currentMode === 'advanced') {
    console.log('🔧 Advanced mode: Starting to find elements...');
    
    // Flash unified conversion panel items (Unix Epoch Values - exclude buttons)
    // Use a more specific selector that targets only the epoch value rows, not buttons
    // Exclude the button container explicitly
    // Use a more specific selector that excludes buttons entirely
    // Only select divs with rounded-lg.border that are inside the epoch values container
    const unifiedItems = document.querySelectorAll('#advanced-mode .space-y-2 > div.rounded-lg.border');
    console.log('📊 Advanced mode: Found', unifiedItems.length, 'items with selector: #advanced-mode .space-y-2 > div.rounded-lg.border');
    
    unifiedItems.forEach((item, index) => {
      console.log(`🔍 Checking item ${index}:`, {
        tagName: item.tagName,
        classes: Array.from(item.classList),
        hasDataAdjust: item.hasAttribute('data-adjust'),
        id: item.id,
        textContent: item.textContent?.substring(0, 50)
      });
      
      // Explicitly exclude buttons: check if element is a button, has button classes, data-adjust attribute, or is inside button container
      const isButton = item.tagName === 'BUTTON';
      const hasQuickAdjustClass = item.classList.contains('quick-adjust-btn') || item.classList.contains('quick-adjust-btn-advanced');
      const hasDataAdjust = item.hasAttribute('data-adjust');
      const isInsideButton = item.closest('button[data-adjust], .quick-adjust-btn, .quick-adjust-btn-advanced, .flex.flex-wrap.gap-2');
      const containsButton = item.querySelector('.quick-adjust-btn, .quick-adjust-btn-advanced, button[data-adjust]');
      
      if (isButton || hasQuickAdjustClass || hasDataAdjust || isInsideButton || containsButton) {
        console.log(`❌ Advanced mode item ${index} EXCLUDED:`, {
          isButton,
          hasQuickAdjustClass,
          hasDataAdjust,
          isInsideButton: !!isInsideButton,
          containsButton: !!containsButton,
          element: item
        });
        return;
      }
      
      console.log(`✅ Advanced mode item ${index} WILL BE ANIMATED`);
      setTimeout(() => {
        flashOutputCard(item);
      }, index * 50);
    });
    
    // Flash timezone conversion card
    const timezoneCard = document.querySelector('#advanced-mode .p-4.bg-gray-50, #advanced-mode .p-4.bg-gray-900');
    console.log('🌍 Timezone card found:', !!timezoneCard);
    if (timezoneCard && timezoneCard.querySelector('#from-timezone-time')) {
      console.log('✅ Timezone card WILL BE ANIMATED');
      setTimeout(() => {
        flashOutputCard(timezoneCard);
      }, 200);
    }

    // Flash formatted output card (find parent of formatted-output element)
    const formattedOutputEl = document.getElementById('formatted-output');
    console.log('📝 Formatted output element found:', !!formattedOutputEl);
    if (formattedOutputEl) {
      const formattedCard = formattedOutputEl.closest('.p-4');
      console.log('📝 Formatted card found:', !!formattedCard);
      if (formattedCard) {
        console.log('✅ Formatted card WILL BE ANIMATED');
        setTimeout(() => {
          flashOutputCard(formattedCard);
        }, 250);
      }
    }
    
    // Also check if there are any other selectors that might be catching buttons
    const allRoundedLgBorder = document.querySelectorAll('#advanced-mode .rounded-lg.border');
    console.log('⚠️  WARNING: Found', allRoundedLgBorder.length, 'total elements with .rounded-lg.border in advanced mode');
    allRoundedLgBorder.forEach((el, idx) => {
      if (el.tagName === 'BUTTON' || el.hasAttribute('data-adjust')) {
        console.log('🚨 BUTTON FOUND in .rounded-lg.border selector at index', idx, ':', {
          tagName: el.tagName,
          classes: Array.from(el.classList),
          dataAdjust: el.getAttribute('data-adjust'),
          textContent: el.textContent?.substring(0, 30),
          parent: el.parentElement?.className
        });
      }
    });
    
    // Check all buttons in advanced mode
    const allButtons = document.querySelectorAll('#advanced-mode button');
    console.log('🔘 Total buttons in advanced mode:', allButtons.length);
    allButtons.forEach((btn, idx) => {
      if (btn.hasAttribute('data-adjust')) {
        console.log(`🔘 Quick adjust button ${idx}:`, {
          classes: Array.from(btn.classList),
          dataAdjust: btn.getAttribute('data-adjust'),
          textContent: btn.textContent,
          parent: btn.parentElement?.className,
          matchesRoundedLgBorder: btn.matches('.rounded-lg.border')
        });
      }
    });
  }
}

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

