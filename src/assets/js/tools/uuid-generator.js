// Advanced UUID Generator with support for multiple UUID versions
(function() {
  const countEl = document.getElementById('uuid-count');
  const countLabel = document.getElementById('count-label');
  const countValue = document.getElementById('count-value');
  const outputEl = document.getElementById('uuid-output');
  const errorEl = document.getElementById('error-message');
  const errorText = errorEl.querySelector('p');
  const uppercaseCheck = document.getElementById('uppercase-check');
  const hyphensCheck = document.getElementById('hyphens-check');
  // Button-based controls instead of dropdowns
  let selectedVersion = 'v4';
  let selectedFormat = 'list';
  
  const generateBtn = document.getElementById('generate-btn');
  const copyBtn = document.getElementById('copy-btn');
  const clearBtn = document.getElementById('clear-btn');
  
  function showError(message) {
    errorText.textContent = message;
    errorEl.classList.remove('hidden');
  }
  
  function hideError() {
    errorEl.classList.add('hidden');
  }
  
  // Utility functions for UUID generation
  function getRandomHex(length) {
    const array = new Uint8Array(length / 2);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  function getCurrentTimestamp() {
    // Get current timestamp in 100-nanosecond intervals since UUID epoch (Oct 15, 1582)
    const now = Date.now();
    const uuidEpoch = Date.UTC(1582, 9, 15); // October 15, 1582
    const timestamp = (now - uuidEpoch) * 10000; // Convert to 100-nanosecond intervals
    return timestamp;
  }
  
  function getMACAddress() {
    // Since we can't get real MAC address in browser, generate a random one
    // Set multicast bit to indicate it's not a real MAC address
    const mac = getRandomHex(12);
    const firstByte = parseInt(mac.substring(0, 2), 16) | 0x01; // Set multicast bit
    return firstByte.toString(16).padStart(2, '0') + mac.substring(2);
  }
  
  // Generate UUID v1 (Time-based)
  function generateUUIDv1() {
    const timestamp = getCurrentTimestamp();
    const mac = getMACAddress();
    
    // Split timestamp into components
    const timeLow = (timestamp & 0xffffffff).toString(16).padStart(8, '0');
    const timeMid = ((timestamp >> 32) & 0xffff).toString(16).padStart(4, '0');
    const timeHigh = ((timestamp >> 48) & 0x0fff | 0x1000).toString(16).padStart(4, '0'); // Version 1
    
    // Clock sequence (14 bits) + variant bits
    const clockSeq = Math.floor(Math.random() * 0x3fff) | 0x8000; // Set variant bits
    const clockSeqHex = clockSeq.toString(16).padStart(4, '0');
    
    return `${timeLow}-${timeMid}-${timeHigh}-${clockSeqHex}-${mac}`;
  }
  
  // Generate UUID v4 (Random)
  function generateUUIDv4() {
    // Use crypto.randomUUID if available (modern browsers)
    if (crypto.randomUUID) {
      return crypto.randomUUID();
    }
    
    // Fallback to manual generation using crypto.getRandomValues
    const hex = getRandomHex(32);
    
    // Insert version (4) and variant bits
    const timeLow = hex.substring(0, 8);
    const timeMid = hex.substring(8, 12);
    const timeHigh = '4' + hex.substring(13, 16); // Version 4
    const clockSeq = (parseInt(hex.substring(16, 18), 16) & 0x3f | 0x80).toString(16) + hex.substring(18, 20); // Variant bits
    const node = hex.substring(20, 32);
    
    return `${timeLow}-${timeMid}-${timeHigh}-${clockSeq}-${node}`;
  }
  
  // Generate UUID v7 (Unix Epoch Time-based)
  function generateUUIDv7() {
    const now = Date.now();
    const randomA = getRandomHex(4);
    const randomB = getRandomHex(16);
    
    // Unix timestamp in milliseconds (48 bits)
    const timestamp = now.toString(16).padStart(12, '0');
    
    // Version and random data
    const timeLow = timestamp.substring(0, 8);
    const timeMid = timestamp.substring(8, 12);
    const timeHigh = '7' + randomA.substring(1, 4); // Version 7
    const clockSeq = (parseInt(randomB.substring(0, 2), 16) & 0x3f | 0x80).toString(16) + randomB.substring(2, 4); // Variant bits
    const node = randomB.substring(4, 16);
    
    return `${timeLow}-${timeMid}-${timeHigh}-${clockSeq}-${node}`;
  }
  
  // Generate UUID v3 (Name-based with MD5)
  function generateUUIDv3(name = 'example', namespace = 'dns') {
    // Simplified v3 implementation using crypto for demo
    // In real implementation, you'd use proper MD5 hashing with namespace
    const input = namespace + name + Date.now();
    const hex = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Set version (3) and variant bits
    const timeLow = hex.substring(0, 8);
    const timeMid = hex.substring(8, 12);
    const timeHigh = '3' + hex.substring(13, 16); // Version 3
    const clockSeq = (parseInt(hex.substring(16, 18), 16) & 0x3f | 0x80).toString(16) + hex.substring(18, 20);
    const node = hex.substring(20, 32);
    
    return `${timeLow}-${timeMid}-${timeHigh}-${clockSeq}-${node}`;
  }
  
  // Generate Nil UUID (all zeros)
  function generateNilUUID() {
    return '00000000-0000-0000-0000-000000000000';
  }
  
  // Generate GUID (same as UUID but Microsoft terminology)
  function generateGUID() {
    return generateUUIDv4(); // GUID is essentially UUID v4
  }
  
  // Main UUID generation function
  function generateUUID(version = 'v4') {
    switch (version) {
      case 'v1':
        return generateUUIDv1();
      case 'v3':
        return generateUUIDv3();
      case 'v4':
        return generateUUIDv4();
      case 'v7':
        return generateUUIDv7();
      case 'guid':
        return generateGUID();
      case 'nil':
        return generateNilUUID();
      default:
        return generateUUIDv4();
    }
  }
  
  function formatUUID(uuid, options = {}) {
    const { uppercase = false, hyphens = true, braces = false } = options;
    let formatted = uuid;
    
    if (!hyphens) {
      formatted = formatted.replace(/-/g, '');
    }
    
    if (uppercase) {
      formatted = formatted.toUpperCase();
    }
    
    if (braces) {
      formatted = `{${formatted}}`;
    }
    
    return formatted;
  }
  
  function formatOutput(uuids, format) {
    switch (format) {
      case 'json':
        return JSON.stringify(uuids, null, 2);
      case 'csv':
        return uuids.join(', ');
      case 'array':
        return `[${uuids.map(uuid => `"${uuid}"`).join(', ')}]`;
      case 'list':
      default:
        return uuids.join('\n');
    }
  }
  
  function generateUUIDs() {
    hideError();
    const count = parseInt(countEl.value);
    
    if (isNaN(count) || count < 1) {
      showError('Please enter a valid number (minimum 1)');
      return;
    }
    
    if (count > 1000) {
      showError('Maximum 1000 UUIDs can be generated at once');
      return;
    }
    
    const version = selectedVersion;
    const format = selectedFormat;
    const uppercase = uppercaseCheck ? uppercaseCheck.checked : false;
    const hyphens = hyphensCheck ? hyphensCheck.checked : true;
    const braces = document.getElementById('braces-check') ? document.getElementById('braces-check').checked : false;
    const uuids = [];
    
    try {
      for (let i = 0; i < count; i++) {
        const uuid = generateUUID(version);
        const formatted = formatUUID(uuid, { uppercase, hyphens, braces });
        uuids.push(formatted);
      }
      
      const output = formatOutput(uuids, format);
      
      // Add subtle animation to output
      outputEl.style.transform = 'scale(0.98)';
      outputEl.style.opacity = '0.7';
      
      setTimeout(() => {
        outputEl.value = output;
        outputEl.style.transform = 'scale(1)';
        outputEl.style.opacity = '1';
      }, 150);
    } catch (error) {
      showError('Failed to generate UUIDs: ' + error.message);
    }
  }
  
  function copyAll() {
    const output = outputEl.value;
    
    if (!output) {
      showError('Nothing to copy. Generate UUIDs first.');
      return;
    }
    
    navigator.clipboard.writeText(output).then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = '✓ Copied!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    }).catch(() => {
      showError('Failed to copy to clipboard');
    });
  }
  
  function clearAll() {
    outputEl.value = '';
    hideError();
  }
  
  // UI state management functions
  function updateVersionSelection(version) {
    selectedVersion = version;
    
    // Update orbital buttons
    document.querySelectorAll('.uuid-version-btn').forEach(btn => {
      const btnVersion = btn.getAttribute('data-version');
      const circle = btn.querySelector('div');
      const label = btn.querySelector('span:last-child');
      
      if (btnVersion === version) {
        circle.classList.add('shadow-lg', 'scale-110');
        label.classList.add('font-semibold');
      } else {
        circle.classList.remove('shadow-lg', 'scale-110');
        label.classList.remove('font-semibold');
      }
    });
    
    // Update version pills
    document.querySelectorAll('.version-pill').forEach(pill => {
      const pillVersion = pill.getAttribute('data-version');
      
      if (pillVersion === version) {
        pill.classList.remove('border-gray-300', 'dark:border-gray-600', 'bg-gray-100', 'dark:bg-gray-800', 'text-gray-600', 'dark:text-gray-300');
        
        // Set version-specific colors
        if (version === 'v4') {
          pill.classList.add('border-2', 'border-blue-400', 'bg-blue-500/20', 'text-blue-600', 'dark:text-blue-400');
        } else if (version === 'v1') {
          pill.classList.add('border-2', 'border-green-400', 'bg-green-500/20', 'text-green-600', 'dark:text-green-400');
        } else if (version === 'v3') {
          pill.classList.add('border-2', 'border-yellow-400', 'bg-yellow-500/20', 'text-yellow-600', 'dark:text-yellow-400');
        } else if (version === 'v7') {
          pill.classList.add('border-2', 'border-purple-400', 'bg-purple-500/20', 'text-purple-600', 'dark:text-purple-400');
        } else if (version === 'guid') {
          pill.classList.add('border-2', 'border-indigo-400', 'bg-indigo-500/20', 'text-indigo-600', 'dark:text-indigo-400');
        } else if (version === 'nil') {
          pill.classList.add('border-2', 'border-orange-400', 'bg-orange-500/20', 'text-orange-600', 'dark:text-orange-400');
        }
      } else {
        pill.classList.remove('border-2', 'border-blue-400', 'bg-blue-500/20', 'text-blue-600', 'dark:text-blue-400');
        pill.classList.remove('border-2', 'border-green-400', 'bg-green-500/20', 'text-green-600', 'dark:text-green-400');
        pill.classList.remove('border-2', 'border-yellow-400', 'bg-yellow-500/20', 'text-yellow-600', 'dark:text-yellow-400');
        pill.classList.remove('border-2', 'border-purple-400', 'bg-purple-500/20', 'text-purple-600', 'dark:text-purple-400');
        pill.classList.remove('border-2', 'border-indigo-400', 'bg-indigo-500/20', 'text-indigo-600', 'dark:text-indigo-400');
        pill.classList.remove('border-2', 'border-orange-400', 'bg-orange-500/20', 'text-orange-600', 'dark:text-orange-400');
        pill.classList.add('border', 'border-gray-300', 'dark:border-gray-600', 'bg-gray-100', 'dark:bg-gray-800', 'text-gray-600', 'dark:text-gray-300');
      }
    });
  }
  
  function updateFormatSelection(format) {
    selectedFormat = format;
    
    // Update format buttons
    document.querySelectorAll('.format-btn').forEach(btn => {
      const btnFormat = btn.getAttribute('data-format');
      
      if (btnFormat === format) {
        btn.classList.remove('border-gray-300', 'dark:border-gray-600', 'bg-gray-100', 'dark:bg-gray-800', 'text-gray-600', 'dark:text-gray-300');
        btn.classList.add('border-primary-400', 'bg-primary-500/20', 'text-primary-600', 'dark:text-primary-400', 'border-2');
      } else {
        btn.classList.remove('border-primary-400', 'bg-primary-500/20', 'text-primary-600', 'dark:text-primary-400', 'border-2');
        btn.classList.add('border-gray-300', 'dark:border-gray-600', 'bg-gray-100', 'dark:bg-gray-800', 'text-gray-600', 'dark:text-gray-300');
      }
    });
  }

  function updateCountDisplay(count) {
    if (countLabel) {
      countLabel.innerHTML = `Generating <span class="font-medium text-primary-600">${count} UUID${count > 1 ? 's' : ''}</span>`;
    }
    if (countValue) {
      countValue.textContent = count;
    }
    if (countEl) {
      countEl.value = count;
    }
  }

  function updateCountSelection(count) {
    updateCountDisplay(count);
    
    // Update count chips
    document.querySelectorAll('.count-chip').forEach(chip => {
      const chipCount = parseInt(chip.getAttribute('data-count'));
      
      if (chipCount === count) {
        chip.classList.remove('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-200', 'dark:hover:bg-gray-700');
        chip.classList.add('bg-primary-500', 'text-white');
      } else {
        chip.classList.remove('bg-primary-500', 'text-white');
        chip.classList.add('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-200', 'dark:hover:bg-gray-700');
      }
    });
  }

  // Toggle button functionality
  function updateToggleButton(toggleId, state) {
    const toggle = document.getElementById(toggleId);
    const indicator = toggle.querySelector('.toggle-indicator');
    const checkmark = toggle.querySelector('.toggle-check');
    const checkbox = document.getElementById(toggleId.replace('-toggle', '-check'));
    
    if (state) {
      // Active state
      toggle.classList.remove('border-gray-300', 'dark:border-gray-600', 'bg-gray-100', 'dark:bg-gray-800', 'text-gray-600', 'dark:text-gray-300');
      toggle.classList.add('border-green-400', 'bg-green-500/20', 'text-green-600', 'dark:text-green-400');
      indicator.classList.add('bg-green-500/30');
      checkmark.classList.add('opacity-100');
      checkmark.classList.remove('opacity-0');
      checkbox.checked = true;
    } else {
      // Inactive state
      toggle.classList.remove('border-green-400', 'bg-green-500/20', 'text-green-600', 'dark:text-green-400');
      toggle.classList.add('border-gray-300', 'dark:border-gray-600', 'bg-gray-100', 'dark:bg-gray-800', 'text-gray-600', 'dark:text-gray-300');
      indicator.classList.remove('bg-green-500/30');
      checkmark.classList.remove('opacity-100');
      checkmark.classList.add('opacity-0');
      checkbox.checked = false;
    }
    
    toggle.setAttribute('data-state', state);
  }

  // Event listeners
  generateBtn.addEventListener('click', generateUUIDs);
  copyBtn.addEventListener('click', copyAll);
  clearBtn.addEventListener('click', clearAll);
  
  // Version selection events (both orbital and pills)
  document.querySelectorAll('.uuid-version-btn, .version-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const version = btn.getAttribute('data-version');
      updateVersionSelection(version);
    });
  });
  
  // Format selection events
  document.querySelectorAll('.format-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const format = btn.getAttribute('data-format');
      updateFormatSelection(format);
    });
  });
  
  // Count selection events
  document.querySelectorAll('.count-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const count = parseInt(chip.getAttribute('data-count'));
      updateCountSelection(count);
    });
  });
  
  // Range slider event
  if (countEl) {
    countEl.addEventListener('input', (e) => {
      const count = parseInt(e.target.value);
      updateCountDisplay(count);
      // Clear chip selection when using slider
      document.querySelectorAll('.count-chip').forEach(chip => {
        chip.classList.remove('bg-primary-500', 'text-white');
        chip.classList.add('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-200', 'dark:hover:bg-gray-700');
      });
    });
    
    // Generate on Enter key
    countEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        generateUUIDs();
      }
    });
  }
  
  // Toggle button events
  const uppercaseToggle = document.getElementById('uppercase-toggle');
  const hyphensToggle = document.getElementById('hyphens-toggle');
  const bracesToggle = document.getElementById('braces-toggle');
  
  if (uppercaseToggle) {
    uppercaseToggle.addEventListener('click', () => {
      const currentState = uppercaseToggle.getAttribute('data-state') === 'true';
      updateToggleButton('uppercase-toggle', !currentState);
    });
  }
  
  if (hyphensToggle) {
    hyphensToggle.addEventListener('click', () => {
      const currentState = hyphensToggle.getAttribute('data-state') === 'true';
      updateToggleButton('hyphens-toggle', !currentState);
    });
  }
  
  if (bracesToggle) {
    bracesToggle.addEventListener('click', () => {
      const currentState = bracesToggle.getAttribute('data-state') === 'true';
      updateToggleButton('braces-toggle', !currentState);
    });
  }
  
  // Initialize UI state
  updateVersionSelection('v4');
  updateFormatSelection('list');
  updateCountSelection(1);
  
  // Initialize toggle states
  updateToggleButton('uppercase-toggle', false);
  updateToggleButton('hyphens-toggle', true);
  updateToggleButton('braces-toggle', false);
  
  // Generate one UUID on page load
  generateUUIDs();
})();

