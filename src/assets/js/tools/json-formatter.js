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
    errorText.innerHTML = message; // Changed to innerHTML to support formatting
    errorEl.classList.remove('hidden');
  }
  
  function hideError() {
    errorEl.classList.add('hidden');
  }
  
  // Find line and column from character position
  function getLineAndColumn(text, position) {
    const lines = text.substring(0, position).split('\n');
    return {
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    };
  }
  
  // Extract position from error message
  function extractPosition(errorMessage) {
    // Try to find position in error message
    // Chrome: "position 123" or "Unexpected token at position 123"
    let posMatch = errorMessage.match(/position (\d+)/i);
    if (posMatch) {
      return parseInt(posMatch[1]);
    }
    
    // Firefox: "at line 1 column 123"
    posMatch = errorMessage.match(/line \d+ column (\d+)/i);
    if (posMatch) {
      return parseInt(posMatch[1]) - 1; // Firefox uses 1-based, we need 0-based
    }
    
    return null;
  }
  
  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Try to format JSON by fixing the error temporarily
  function formatInvalidJSON(input, errorPosition) {
    // Try to fix the JSON by removing the error character
    const fixedInput = input.slice(0, errorPosition) + input.slice(errorPosition + 1);
    
    let formatted = '';
    let currentPos = 0;
    let indent = 0;
    const indentStr = '  ';
    let inString = false;
    let escape = false;
    
    try {
      // Try to parse and format the fixed version
      const parsed = JSON.parse(fixedInput);
      const validFormatted = JSON.stringify(parsed, null, 2);
      
      // Now we need to insert the error character back into the formatted version
      // This is tricky - we need to map positions
      // Simpler approach: format manually with error highlighting
      
      for (let i = 0; i < input.length; i++) {
        const char = input[i];
        const prevChar = input[i - 1];
        const nextChar = input[i + 1];
        
        // Handle string state
        if (char === '"' && !escape) {
          inString = !inString;
        }
        escape = (char === '\\' && !escape);
        
        // Skip whitespace outside strings
        if (!inString && (char === ' ' || char === '\t' || char === '\n' || char === '\r')) {
          continue;
        }
        
        // Highlight error character
        if (i === errorPosition) {
          formatted += `<span style="background-color: #ef4444; color: white; padding: 2px 4px; font-weight: bold; border-radius: 3px;">${escapeHtml(char)}</span>`;
          continue;
        }
        
        // Format structural characters
        if (!inString) {
          if (char === '{' || char === '[') {
            formatted += escapeHtml(char);
            if (nextChar && nextChar !== '}' && nextChar !== ']') {
              indent++;
              formatted += '\n' + indentStr.repeat(indent);
            }
          } else if (char === '}' || char === ']') {
            const prevNonSpace = input.slice(0, i).replace(/\s/g, '').slice(-1);
            if (prevNonSpace !== '{' && prevNonSpace !== '[' && prevNonSpace !== ',') {
              indent = Math.max(0, indent - 1);
              formatted += '\n' + indentStr.repeat(indent);
            } else {
              indent = Math.max(0, indent - 1);
            }
            formatted += escapeHtml(char);
          } else if (char === ',') {
            formatted += escapeHtml(char);
            // Add newline after comma (unless we just highlighted an error)
            if (i !== errorPosition - 1 && i !== errorPosition + 1) {
              formatted += '\n' + indentStr.repeat(indent);
            }
          } else if (char === ':') {
            formatted += escapeHtml(char) + ' ';
          } else {
            formatted += escapeHtml(char);
          }
        } else {
          formatted += escapeHtml(char);
        }
      }
      
      return formatted;
      
    } catch (e) {
      // If fixing didn't work, just format as-is with basic indentation
      for (let i = 0; i < input.length; i++) {
        const char = input[i];
        const nextChar = input[i + 1];
        
        // Handle string state
        if (char === '"' && !escape) {
          inString = !inString;
        }
        escape = (char === '\\' && !escape);
        
        // Skip whitespace outside strings
        if (!inString && (char === ' ' || char === '\t' || char === '\n' || char === '\r')) {
          continue;
        }
        
        // Highlight error character
        if (i === errorPosition) {
          formatted += `<span style="background-color: #ef4444; color: white; padding: 2px 4px; font-weight: bold; border-radius: 3px;">${escapeHtml(char)}</span>`;
          continue;
        }
        
        // Format structural characters
        if (!inString) {
          if (char === '{' || char === '[') {
            formatted += escapeHtml(char);
            if (nextChar && nextChar !== '}' && nextChar !== ']') {
              indent++;
              formatted += '\n' + indentStr.repeat(indent);
            }
          } else if (char === '}' || char === ']') {
            if (indent > 0) {
              indent--;
              formatted += '\n' + indentStr.repeat(indent);
            }
            formatted += escapeHtml(char);
          } else if (char === ',') {
            formatted += escapeHtml(char);
            formatted += '\n' + indentStr.repeat(indent);
          } else if (char === ':') {
            formatted += escapeHtml(char) + ' ';
          } else {
            formatted += escapeHtml(char);
          }
        } else {
          formatted += escapeHtml(char);
        }
      }
      
      return formatted;
    }
  }
  
  // Format with error highlighting (returns HTML)
  function formatWithError(input, error) {
    const errorMsg = error.message;
    const position = extractPosition(errorMsg);
    
    if (position !== null) {
      // Format the JSON with the error character highlighted
      const formattedWithError = formatInvalidJSON(input, position);
      
      return {
        output: '<span style="color: #f59e0b; font-weight: bold;">⚠️ JSON with Error (formatted):</span>\n\n' + formattedWithError,
        errorMessage: `<strong>Error at position ${position + 1}:</strong> ${errorMsg}<br><small>The error character is highlighted in red above.</small>`,
        isHtml: true
      };
    } else {
      // No position info, just show the input formatted
      return {
        output: '<span style="color: #f59e0b;">⚠️ Invalid JSON:</span>\n\n' + escapeHtml(input),
        errorMessage: `<strong>Error:</strong> ${errorMsg}`,
        isHtml: true
      };
    }
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
      // Show success with green checkmark
      outputEl.innerHTML = `<span style="color: #16a34a; font-weight: bold;">✓ Valid JSON</span>\n\n` + escapeHtml(formatted);
      
      // Show temporary success message
      showError('<span style="color: #16a34a;">✓ JSON is valid and formatted successfully!</span>');
      setTimeout(hideError, 2000);
    } catch (e) {
      // Format with error highlighting
      const {output, errorMessage} = formatWithError(input, e);
      outputEl.innerHTML = output;
      showError(errorMessage);
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
      outputEl.innerHTML = `<span style="color: #16a34a; font-weight: bold;">✓ Valid JSON (Minified)</span>\n\n` + escapeHtml(minified);
      
      showError('<span style="color: #16a34a;">✓ JSON is valid and minified successfully!</span>');
      setTimeout(hideError, 2000);
    } catch (e) {
      // Show error with highlighting
      const {output, errorMessage} = formatWithError(input, e);
      outputEl.innerHTML = output;
      showError(errorMessage);
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
      outputEl.innerHTML = '<span style="color: #16a34a; font-size: 1.5rem; font-weight: bold;">✓ Valid JSON</span>';
      showError('<span style="color: #16a34a;">✓ Your JSON is valid!</span>');
      setTimeout(() => {
        outputEl.innerHTML = '';
        hideError();
      }, 3000);
    } catch (e) {
      // Show error with highlighting
      const {output, errorMessage} = formatWithError(input, e);
      outputEl.innerHTML = output;
      showError(errorMessage);
    }
  }
  
  function copyResult() {
    const output = outputEl.textContent; // Get text content instead of value
    
    if (!output) {
      showError('Nothing to copy');
      return;
    }
    
    // Remove the success indicator if present
    const cleanOutput = output.replace(/^✓ Valid JSON.*?\n\n/s, '');
    
    navigator.clipboard.writeText(cleanOutput).then(() => {
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
    outputEl.innerHTML = '';
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

