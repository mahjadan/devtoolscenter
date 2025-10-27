// JSON Formatter & Validator
(function() {
  const inputEl = document.getElementById('json-input');
  const outputEl = document.getElementById('json-output');
  const errorEl = document.getElementById('error-message');
  const errorText = errorEl.querySelector('p');
  
  const formatBtn = document.getElementById('format-btn');
  const minifyBtn = document.getElementById('minify-btn');
  const validateBtn = document.getElementById('validate-btn');
  const copyBtn = document.getElementById('copy-btn');
  const clearBtn = document.getElementById('clear-btn');
  
  function showError(message) {
    errorText.textContent = message;
    errorEl.classList.remove('hidden');
  }
  
  function hideError() {
    errorEl.classList.add('hidden');
  }
  
  function formatJSON() {
    hideError();
    const input = inputEl.value.trim();
    
    if (!input) {
      showError('Please enter some JSON data');
      return;
    }
    
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      outputEl.value = formatted;
    } catch (e) {
      showError(`Invalid JSON: ${e.message}`);
      outputEl.value = '';
    }
  }
  
  function minifyJSON() {
    hideError();
    const input = inputEl.value.trim();
    
    if (!input) {
      showError('Please enter some JSON data');
      return;
    }
    
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      outputEl.value = minified;
    } catch (e) {
      showError(`Invalid JSON: ${e.message}`);
      outputEl.value = '';
    }
  }
  
  function validateJSON() {
    hideError();
    const input = inputEl.value.trim();
    
    if (!input) {
      showError('Please enter some JSON data');
      return;
    }
    
    try {
      JSON.parse(input);
      outputEl.value = '✓ Valid JSON';
      setTimeout(() => {
        outputEl.value = '';
      }, 2000);
    } catch (e) {
      showError(`Invalid JSON: ${e.message}`);
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
  formatBtn.addEventListener('click', formatJSON);
  minifyBtn.addEventListener('click', minifyJSON);
  validateBtn.addEventListener('click', validateJSON);
  copyBtn.addEventListener('click', copyResult);
  clearBtn.addEventListener('click', clearAll);
  
  // Format on Enter (Ctrl/Cmd + Enter)
  inputEl.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      formatJSON();
    }
  });
})();

