// UUID Generator
(function() {
  const countEl = document.getElementById('uuid-count');
  const outputEl = document.getElementById('uuid-output');
  const errorEl = document.getElementById('error-message');
  const errorText = errorEl.querySelector('p');
  const uppercaseCheck = document.getElementById('uppercase-check');
  const hyphensCheck = document.getElementById('hyphens-check');
  
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
  
  // Generate a UUID v4
  function generateUUID() {
    // Use crypto.randomUUID if available (modern browsers)
    if (crypto.randomUUID) {
      return crypto.randomUUID();
    }
    
    // Fallback to manual generation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  function formatUUID(uuid, uppercase, hyphens) {
    let formatted = uuid;
    
    if (!hyphens) {
      formatted = formatted.replace(/-/g, '');
    }
    
    if (uppercase) {
      formatted = formatted.toUpperCase();
    }
    
    return formatted;
  }
  
  function generateUUIDs() {
    hideError();
    const count = parseInt(countEl.value);
    
    if (isNaN(count) || count < 1) {
      showError('Please enter a valid number (minimum 1)');
      return;
    }
    
    if (count > 100) {
      showError('Maximum 100 UUIDs can be generated at once');
      return;
    }
    
    const uppercase = uppercaseCheck.checked;
    const hyphens = hyphensCheck.checked;
    const uuids = [];
    
    for (let i = 0; i < count; i++) {
      const uuid = generateUUID();
      uuids.push(formatUUID(uuid, uppercase, hyphens));
    }
    
    outputEl.value = uuids.join('\n');
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
  
  // Event listeners
  generateBtn.addEventListener('click', generateUUIDs);
  copyBtn.addEventListener('click', copyAll);
  clearBtn.addEventListener('click', clearAll);
  
  // Generate on Enter key
  countEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      generateUUIDs();
    }
  });
  
  // Generate one UUID on page load
  generateUUIDs();
})();

