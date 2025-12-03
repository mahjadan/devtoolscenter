/**
 * Shared Time Utilities
 * Used by Timestamp Converter and JWT Decoder tools
 */

/**
 * Parse a timestamp input (Unix seconds, Unix milliseconds, ISO 8601, or date string)
 * @param {string} input - The timestamp input
 * @returns {number|null} - Timestamp in milliseconds, or null if invalid
 */
export function parseTimestamp(input) {
  if (!input || typeof input !== 'string') return null;
  
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Check if it's a pure number (Unix timestamp)
  if (/^\d+$/.test(trimmed)) {
    const num = parseInt(trimmed, 10);
    // Auto-detect seconds vs milliseconds by length
    if (trimmed.length === 10) {
      // Unix seconds
      return num * 1000;
    } else if (trimmed.length === 13) {
      // Unix milliseconds
      return num;
    } else if (trimmed.length === 16) {
      // Microseconds
      return Math.floor(num / 1000);
    } else if (trimmed.length === 19) {
      // Nanoseconds
      return Math.floor(num / 1000000);
    } else {
      // Default: assume seconds if < 13 digits, milliseconds if >= 13
      return num < 10000000000 ? num * 1000 : num;
    }
  }

  // Try parsing as ISO 8601 or date string
  const parsed = Date.parse(trimmed);
  if (!isNaN(parsed)) {
    return parsed;
  }

  return null;
}

/**
 * Format timestamp to Unix seconds
 * @param {number} timestampMs - Timestamp in milliseconds
 * @returns {string}
 */
export function formatUnixSeconds(timestampMs) {
  return Math.floor(timestampMs / 1000).toString();
}

/**
 * Format timestamp to Unix milliseconds
 * @param {number} timestampMs - Timestamp in milliseconds
 * @returns {string}
 */
export function formatUnixMilliseconds(timestampMs) {
  return timestampMs.toString();
}

/**
 * Format timestamp to ISO 8601
 * @param {number} timestampMs - Timestamp in milliseconds
 * @returns {string}
 */
export function formatISO8601(timestampMs) {
  return new Date(timestampMs).toISOString();
}

/**
 * Format timestamp to RFC 2822
 * @param {number} timestampMs - Timestamp in milliseconds
 * @returns {string}
 */
export function formatRFC2822(timestampMs) {
  return new Date(timestampMs).toUTCString();
}

/**
 * Format timestamp to local time string
 * @param {number} timestampMs - Timestamp in milliseconds
 * @param {string} timezone - IANA timezone (optional)
 * @returns {string}
 */
export function formatLocalTime(timestampMs, timezone = null) {
  const date = new Date(timestampMs);
  if (timezone) {
    return date.toLocaleString('en-US', { timeZone: timezone });
  }
  return date.toLocaleString();
}

/**
 * Get timezone name for a date
 * @param {number} timestampMs - Timestamp in milliseconds
 * @param {string} timezone - IANA timezone (optional)
 * @returns {string}
 */
export function getTimezoneName(timestampMs, timezone = null) {
  if (timezone) {
    return timezone;
  }
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Format timestamp with custom format
 * @param {number} timestampMs - Timestamp in milliseconds
 * @param {string} format - Format type ('iso', 'rfc', 'short', 'long', 'time', 'date')
 * @param {string} timezone - IANA timezone (optional)
 * @returns {string}
 */
export function formatTimestamp(timestampMs, format = 'iso', timezone = null) {
  const date = new Date(timestampMs);
  const options = timezone ? { timeZone: timezone } : {};

  switch (format) {
    case 'iso':
      return date.toISOString();
    case 'rfc':
      return date.toUTCString();
    case 'short':
      return date.toLocaleDateString('en-US', { ...options, month: 'short', day: 'numeric', year: 'numeric' });
    case 'long':
      return date.toLocaleDateString('en-US', { ...options, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    case 'time':
      return date.toLocaleTimeString('en-US', options);
    case 'date':
      return date.toLocaleDateString('en-US', options);
    default:
      return date.toISOString();
  }
}

/**
 * Convert timestamp between timezones
 * @param {number} timestampMs - Timestamp in milliseconds
 * @param {string} fromTimezone - Source timezone (IANA)
 * @param {string} toTimezone - Target timezone (IANA)
 * @returns {number} - Timestamp in milliseconds (same value, different representation)
 */
export function convertTimezone(timestampMs, fromTimezone, toTimezone) {
  // Timestamp is absolute, timezone conversion is just formatting
  // Return the same timestamp value
  return timestampMs;
}

/**
 * Get human-readable time difference
 * @param {number} timestampMs1 - First timestamp in milliseconds
 * @param {number} timestampMs2 - Second timestamp in milliseconds
 * @returns {object} - { text: string, isNegative: boolean, days: number, hours: number, minutes: number, seconds: number }
 */
export function getTimeDifference(timestampMs1, timestampMs2) {
  const diff = timestampMs2 - timestampMs1;
  const isNegative = diff < 0;
  const absDiff = Math.abs(diff);

  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

  let text = '';
  if (days > 0) {
    text = `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    text = `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    text = `${minutes}m ${seconds}s`;
  } else {
    text = `${seconds}s`;
  }

  if (isNegative) {
    text = `-${text}`;
  }

  return {
    text,
    isNegative,
    days,
    hours,
    minutes,
    seconds,
    milliseconds: absDiff
  };
}

/**
 * Common timezones list
 */
export const COMMON_TIMEZONES = [
  { label: 'UTC', value: 'UTC' },
  { label: 'Browser Timezone', value: null },
  { label: 'New York (EST)', value: 'America/New_York' },
  { label: 'Los Angeles (PST)', value: 'America/Los_Angeles' },
  { label: 'Chicago (CST)', value: 'America/Chicago' },
  { label: 'Denver (MST)', value: 'America/Denver' },
  { label: 'London (GMT)', value: 'Europe/London' },
  { label: 'Paris (CET)', value: 'Europe/Paris' },
  { label: 'Berlin (CET)', value: 'Europe/Berlin' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Sydney (AEST)', value: 'Australia/Sydney' },
  { label: 'Dubai (GST)', value: 'Asia/Dubai' },
  { label: 'Singapore (SGT)', value: 'Asia/Singapore' },
  { label: 'Mumbai (IST)', value: 'Asia/Kolkata' },
  { label: 'São Paulo (BRT)', value: 'America/Sao_Paulo' },
  { label: 'Hong Kong (HKT)', value: 'Asia/Hong_Kong' },
];

/**
 * Epoch types
 */
export const EPOCH_TYPES = [
  { label: 'Unix (1970)', value: 'unix', epoch: 0 },
  { label: 'Excel (1900)', value: 'excel', epoch: -2209161600000 },
  { label: 'Mac (1904)', value: 'mac', epoch: -2082844800000 },
];

/**
 * Format presets
 */
export const FORMAT_PRESETS = [
  { label: 'ISO 8601', format: 'iso' },
  { label: 'RFC 2822', format: 'rfc' },
  { label: 'Short Date', format: 'short' },
  { label: 'Long Date', format: 'long' },
  { label: 'Time Only', format: 'time' },
  { label: 'Date Only', format: 'date' },
];


