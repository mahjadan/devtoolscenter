// JSON Formatter & Validator - Tool Shell Version
(function() {
  const inputEl = document.getElementById('json-input');
  const outputEl = document.getElementById('json-output');
  const statusEl = document.getElementById('error-message');
  const charCountEl = document.getElementById('char-count');
  const validationBadgeEl = document.getElementById('validation-badge');
  
  const formatBtn = document.getElementById('format-btn');
  const minifyBtn = document.getElementById('minify-btn');
  const validateBtn = document.getElementById('validate-btn');
  const copyBtn = document.getElementById('copy-btn');
  const clearBtn = document.getElementById('clear-btn');
  
  function showMessage(message, type = 'info') {
    statusEl.className = `notification notification--${type}`;
    statusEl.innerHTML = message;
    statusEl.classList.remove('hidden');
  }

  function scrollToOutput() {
    // Scroll to the output section smoothly
    const outputSection = document.getElementById('json-output');
    if (outputSection) {
      outputSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }
  
  function hideMessage() {
    statusEl.classList.add('hidden');
  }
  
  function updateValidationBadge(isValid, text = '') {
    if (text) {
      validationBadgeEl.className = `tool-shell__badge tool-shell__badge--${isValid ? 'json-valid' : 'json-invalid'}`;
      validationBadgeEl.textContent = text;
      validationBadgeEl.classList.remove('hidden');
    } else {
      validationBadgeEl.classList.add('hidden');
    }
  }
  
  function updateCharCount(count) {
    charCountEl.textContent = `${count.toLocaleString()} characters`;
  }
  
  function showCopyFeedback() {
    const feedback = document.createElement('div');
    feedback.className = 'copy-feedback';
    feedback.textContent = 'Copied to clipboard!';
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.parentNode.removeChild(feedback);
      }
    }, 2000);
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
  
  // Apply JSON syntax highlighting using CSS classes
  function applySyntaxHighlighting(json) {
    return json
      .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
      .replace(/"([^"]*)"(?=\s*[,\}\]])/g, '<span class="json-string">"$1"</span>')
      .replace(/:\s*(true|false)/g, ': <span class="json-boolean">$1</span>')
      .replace(/:\s*(null)/g, ': <span class="json-null">$1</span>')
      .replace(/:\s*(-?\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
      .replace(/([{}[\],])/g, '<span class="json-punctuation">$1</span>');
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
    hideMessage();
    const input = inputEl.value.trim();
    
    if (!input) {
      showMessage('Please enter some JSON data', 'warning');
      return;
    }
    
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      
      // Update output with syntax highlighting
      outputEl.innerHTML = applySyntaxHighlighting(formatted);
      outputEl.classList.add('json-valid');
      outputEl.classList.remove('json-invalid');
      
      // Update validation badge
      updateValidationBadge(true, 'Valid');
      
      // Show success message
      showMessage('✓ JSON formatted successfully!', 'success');
      setTimeout(hideMessage, 3000);
      
      // Scroll to output
      scrollToOutput();
    } catch (e) {
      // Handle invalid JSON
      const {output, errorMessage} = formatWithError(input, e);
      outputEl.innerHTML = output;
      outputEl.classList.add('json-invalid');
      outputEl.classList.remove('json-valid');
      
      // Update validation badge
      updateValidationBadge(false, 'Invalid');
      
      // Show error message
      showMessage(errorMessage, 'error');
      
      // Scroll to output
      scrollToOutput();
    }
  }
  
  function minifyJSON() {
    hideMessage();
    const input = inputEl.value.trim();
    
    if (!input) {
      showMessage('Please enter some JSON data', 'warning');
      return;
    }
    
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      
      outputEl.textContent = minified;
      outputEl.classList.add('json-valid');
      outputEl.classList.remove('json-invalid');
      
      updateValidationBadge(true, 'Valid (Minified)');
      showMessage('✓ JSON minified successfully!', 'success');
      setTimeout(hideMessage, 3000);
      
      // Scroll to output
      scrollToOutput();
    } catch (e) {
      const {output, errorMessage} = formatWithError(input, e);
      outputEl.innerHTML = output;
      outputEl.classList.add('json-invalid');
      outputEl.classList.remove('json-valid');
      
      updateValidationBadge(false, 'Invalid');
      showMessage(errorMessage, 'error');
      
      // Scroll to output
      scrollToOutput();
    }
  }
  
  function validateJSON() {
    hideMessage();
    const input = inputEl.value.trim();
    
    if (!input) {
      showMessage('Please enter some JSON data', 'warning');
      return;
    }
    
    try {
      JSON.parse(input);
      outputEl.innerHTML = '<div style="text-align: center; font-size: 1.2rem; color: var(--color-success); margin: 2rem 0;">✓ Valid JSON</div>';
      outputEl.classList.add('json-valid');
      outputEl.classList.remove('json-invalid');
      
      updateValidationBadge(true, 'Valid');
      showMessage('✓ Your JSON is valid!', 'success');
      
      // Scroll to output
      scrollToOutput();
      
      setTimeout(() => {
        outputEl.innerHTML = '';
        hideMessage();
        updateValidationBadge(false);
      }, 3000);
    } catch (e) {
      const {output, errorMessage} = formatWithError(input, e);
      outputEl.innerHTML = output;
      outputEl.classList.add('json-invalid');
      outputEl.classList.remove('json-valid');
      
      updateValidationBadge(false, 'Invalid');
      showMessage(errorMessage, 'error');
      
      // Scroll to output
      scrollToOutput();
    }
  }
  
  function copyResult() {
    const output = outputEl.textContent;
    
    if (!output) {
      showMessage('Nothing to copy', 'warning');
      return;
    }
    
    // Clean output for copying
    const cleanOutput = output.replace(/^✓.*?\n\n/s, '').trim();
    
    navigator.clipboard.writeText(cleanOutput).then(() => {
      showCopyFeedback();
      showMessage('✓ Copied to clipboard!', 'success');
      setTimeout(hideMessage, 2000);
    }).catch(() => {
      showMessage('Failed to copy to clipboard', 'error');
    });
  }
  
  function clearAll() {
    inputEl.value = '';
    outputEl.innerHTML = '';
    outputEl.classList.remove('json-valid', 'json-invalid');
    hideMessage();
    updateValidationBadge(false);
    updateCharCount(0);
  }
  
  // Event listeners
  formatBtn.addEventListener('click', formatJSON);
  minifyBtn.addEventListener('click', minifyJSON);
  validateBtn.addEventListener('click', validateJSON);
  copyBtn.addEventListener('click', copyResult);
  clearBtn.addEventListener('click', clearAll);
  
  // Update character count on input
  inputEl.addEventListener('input', (e) => {
    updateCharCount(e.target.value.length);
  });
  
  // Format on Enter (Ctrl/Cmd + Enter)
  inputEl.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      formatJSON();
    }
  });
  
  // Initialize character count
  updateCharCount(inputEl.value.length);
})();

