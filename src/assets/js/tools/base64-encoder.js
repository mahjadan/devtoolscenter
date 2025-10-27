// Base64 Encoder / Decoder
(function() {
  const inputEl = document.getElementById('base64-input');
  const outputEl = document.getElementById('base64-output');
  const errorEl = document.getElementById('error-message');
  const errorText = errorEl.querySelector('p');
  
  const encodeBtn = document.getElementById('encode-btn');
  const decodeBtn = document.getElementById('decode-btn');
  const copyBtn = document.getElementById('copy-btn');
  const clearBtn = document.getElementById('clear-btn');
  
  function showError(message) {
    errorText.textContent = message;
    errorEl.classList.remove('hidden');
  }
  
  function hideError() {
    errorEl.classList.add('hidden');
  }
  
  function encodeBase64() {
    hideError();
    const input = inputEl.value;
    
    if (!input) {
      showError('Please enter some text to encode');
      return;
    }
    
    try {
      // Use btoa with UTF-8 support
      const encoded = btoa(unescape(encodeURIComponent(input)));
      outputEl.value = encoded;
    } catch (e) {
      showError(`Error encoding: ${e.message}`);
      outputEl.value = '';
    }
  }
  
  function decodeBase64() {
    hideError();
    const input = inputEl.value.trim();
    
    if (!input) {
      showError('Please enter a Base64 string to decode');
      return;
    }
    
    try {
      // Use atob with UTF-8 support
      const decoded = decodeURIComponent(escape(atob(input)));
      outputEl.value = decoded;
    } catch (e) {
      showError(`Error decoding: ${e.message}. Make sure the input is valid Base64.`);
      outputEl.value = '';
    }
  }
  
  function copyResult() {
    const output = outputEl.value;
    
    if (!output) {
      showError('Nothing to copy');
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
    inputEl.value = '';
    outputEl.value = '';
    hideError();
  }
  
  // Event listeners
  encodeBtn.addEventListener('click', encodeBase64);
  decodeBtn.addEventListener('click', decodeBase64);
  copyBtn.addEventListener('click', copyResult);
  clearBtn.addEventListener('click', clearAll);
})();

