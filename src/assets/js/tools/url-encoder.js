// URL Encoder / Decoder
(function() {
  const inputEl = document.getElementById('url-input');
  const outputEl = document.getElementById('url-output');
  const errorEl = document.getElementById('error-message');
  const errorText = errorEl.querySelector('p');
  
  const encodeBtn = document.getElementById('encode-btn');
  const decodeBtn = document.getElementById('decode-btn');
  const encodeComponentBtn = document.getElementById('encode-component-btn');
  const decodeComponentBtn = document.getElementById('decode-component-btn');
  const copyBtn = document.getElementById('copy-btn');
  const clearBtn = document.getElementById('clear-btn');
  
  function showError(message) {
    errorText.textContent = message;
    errorEl.classList.remove('hidden');
  }
  
  function hideError() {
    errorEl.classList.add('hidden');
  }
  
  function encodeURL() {
    hideError();
    const input = inputEl.value;
    
    if (!input) {
      showError('Please enter some text or URL');
      return;
    }
    
    try {
      const encoded = encodeURI(input);
      outputEl.value = encoded;
    } catch (e) {
      showError(`Error encoding: ${e.message}`);
      outputEl.value = '';
    }
  }
  
  function decodeURL() {
    hideError();
    const input = inputEl.value;
    
    if (!input) {
      showError('Please enter some encoded text');
      return;
    }
    
    try {
      const decoded = decodeURI(input);
      outputEl.value = decoded;
    } catch (e) {
      showError(`Error decoding: ${e.message}`);
      outputEl.value = '';
    }
  }
  
  function encodeComponent() {
    hideError();
    const input = inputEl.value;
    
    if (!input) {
      showError('Please enter some text');
      return;
    }
    
    try {
      const encoded = encodeURIComponent(input);
      outputEl.value = encoded;
    } catch (e) {
      showError(`Error encoding: ${e.message}`);
      outputEl.value = '';
    }
  }
  
  function decodeComponent() {
    hideError();
    const input = inputEl.value;
    
    if (!input) {
      showError('Please enter some encoded text');
      return;
    }
    
    try {
      const decoded = decodeURIComponent(input);
      outputEl.value = decoded;
    } catch (e) {
      showError(`Error decoding: ${e.message}`);
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
  encodeBtn.addEventListener('click', encodeURL);
  decodeBtn.addEventListener('click', decodeURL);
  encodeComponentBtn.addEventListener('click', encodeComponent);
  decodeComponentBtn.addEventListener('click', decodeComponent);
  copyBtn.addEventListener('click', copyResult);
  clearBtn.addEventListener('click', clearAll);
})();

