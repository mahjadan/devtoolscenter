// Enhanced JSON Formatter with Tree View - Tool Shell Version
(function() {
  const inputEl = document.getElementById('json-input');
  const statusEl = document.getElementById('error-message');
  const charCountEl = document.getElementById('char-count');
  
  const formatBtn = document.getElementById('format-btn');
  const minifyBtn = document.getElementById('minify-btn');
  const validateBtn = document.getElementById('validate-btn');
  const copyBtn = document.getElementById('copy-btn');
  const clearBtn = document.getElementById('clear-btn');
  
  // Tree view container
  let treeViewContainer;
  let treeViewInstance = null;
  let currentData = null;
  let currentDisplayMode = 'tree'; // 'tree' | 'minified'
  let minifiedText = null;

  // Initialize enhanced UI
  function initializeEnhancedUI() {
    // Get reference to existing tree view container
    treeViewContainer = document.getElementById('json-tree-container');
    
    // Ensure tree view panel is visible (it should be by default now)
    const treePanel = document.getElementById('tree-view-panel');
    if (treePanel) {
      treePanel.classList.remove('hidden');
    }
  }



  function renderTreeView(data) {
    if (!window.JsonTreeView) {
      console.error('JsonTreeView component not loaded');
      return;
    }
    
    // Clear existing content
    treeViewContainer.innerHTML = '';
    treeViewContainer.className = 'tool-shell__output';
    
    // Create new tree view instance
    treeViewInstance = new JsonTreeView(treeViewContainer, {
      collapsed: false,
      showTypes: false,
      showLength: false,
      indent: 20
    });
    
    // Apply dark theme if needed
    const isDark = document.documentElement.classList.contains('dark') || 
                   document.body.classList.contains('dark') ||
                   document.querySelector('html').getAttribute('data-theme') === 'dark';
    
    if (isDark) {
      treeViewContainer.classList.add('dark');
    } else {
      treeViewContainer.classList.remove('dark');
    }
    
    // Render the data
    treeViewInstance.render(data);
    
    // Update tree validation badge
    updateTreeValidationBadge(true, 'Valid');
  }

  function showMinifiedText(minifiedJson) {
    // Clear existing content and external controls
    treeViewContainer.innerHTML = '';
    const externalControls = document.getElementById('tree-controls-container');
    if (externalControls) {
      externalControls.innerHTML = '';
    }
    
    // Reset container class to just output
    treeViewContainer.className = 'tool-shell__output';
    
    // Create text display
    const textDisplay = document.createElement('div');
    textDisplay.style.cssText = `
      font-family: var(--font-mono);
      font-size: var(--font-size-sm);
      line-height: 1.6;
      background: var(--color-subtle);
      border: 1px solid rgba(var(--shadow-color-base-rgb), 0.16);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      color: var(--color-text);
      white-space: pre-wrap;
      word-break: break-all;
      overflow-wrap: break-word;
      max-height: 500px;
      overflow-y: auto;
    `;
    textDisplay.textContent = minifiedJson;
    
    treeViewContainer.appendChild(textDisplay);
  }

  function updateTreeValidationBadge(isValid, text = '') {
    // Tree validation badge has been replaced with controls
    // This function is kept for compatibility but does nothing
  }

  function showMessage(message, type = 'info') {
    statusEl.className = `notification notification--${type}`;
    statusEl.innerHTML = message;
    statusEl.classList.remove('hidden');
  }

  function scrollToOutput() {
    const targetElement = document.getElementById('tool-shell-actions');
      
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
  
  function hideMessage() {
    statusEl.classList.add('hidden');
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
    let posMatch = errorMessage.match(/position (\d+)/i);
    if (posMatch) {
      return parseInt(posMatch[1]);
    }
    
    posMatch = errorMessage.match(/line \d+ column (\d+)/i);
    if (posMatch) {
      return parseInt(posMatch[1]) - 1;
    }
    
    return null;
  }
  
  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  
  // Format with error highlighting (returns HTML)
  function formatWithError(input, error) {
    const errorMsg = error.message;
    const position = extractPosition(errorMsg);
    
    if (position !== null) {
      const beforeError = escapeHtml(input.slice(0, position));
      const errorChar = escapeHtml(input.slice(position, position + 1));
      const afterError = escapeHtml(input.slice(position + 1));
      
      const formattedWithError = beforeError + 
        `<span style="background-color: #ef4444; color: white; padding: 2px 4px; font-weight: bold; border-radius: 3px;">${errorChar}</span>` + 
        afterError;
      
      return {
        output: '<span style="color: #f59e0b; font-weight: bold;">⚠️ JSON with Error:</span>\n\n' + formattedWithError,
        errorMessage: `<strong>Error at position ${position + 1}:</strong> ${errorMsg}<br><small>The error character is highlighted in red above.</small>`,
        isHtml: true
      };
    } else {
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
      
      // Store parsed data for tree view
      currentData = parsed;
      
      // Update validation badges
      updateTreeValidationBadge(true, 'Valid');
      
      // Always render tree view
      renderTreeView(parsed);
      currentDisplayMode = 'tree';
      minifiedText = null;
      
      // Show success message
      showMessage('✓ JSON formatted successfully!', 'success');
      setTimeout(hideMessage, 3000);
      
      // Scroll to output
      scrollToOutput();
    } catch (e) {
      // Handle invalid JSON
      currentData = null;
      
      // Update validation badges
      updateTreeValidationBadge(false, 'Invalid');
      
      // Clear tree view
      if (treeViewContainer) {
        treeViewContainer.innerHTML = '<div style="text-align: center; color: #e53e3e; padding: 2rem;">Invalid JSON - cannot display tree view</div>';
      }
      
      // Show error message
      const {errorMessage} = formatWithError(input, e);
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
      
      // Store parsed data for tree view
      currentData = parsed;
      
      updateTreeValidationBadge(true, 'Valid');
      
      // Show minified text instead of tree view
      showMinifiedText(minified);
      currentDisplayMode = 'minified';
      minifiedText = minified;
      
      showMessage('✓ JSON minified successfully!', 'success');
      setTimeout(hideMessage, 3000);
      
      scrollToOutput();
    } catch (e) {
      currentData = null;
      
      updateTreeValidationBadge(false, 'Invalid');
      
      if (treeViewContainer) {
        treeViewContainer.innerHTML = '<div style="text-align: center; color: #e53e3e; padding: 2rem;">Invalid JSON - cannot display tree view</div>';
      }
      
      const {errorMessage} = formatWithError(input, e);
      showMessage(errorMessage, 'error');
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
      const parsed = JSON.parse(input);
      currentData = parsed;
      
      updateTreeValidationBadge(true, 'Valid');
      
      // Always render tree view
      renderTreeView(parsed);
      currentDisplayMode = 'tree';
      minifiedText = null;
      
      showMessage('✓ Your JSON is valid!', 'success');
      scrollToOutput();
      
      setTimeout(() => {
        hideMessage();
      }, 3000);
    } catch (e) {
      currentData = null;
      
      updateTreeValidationBadge(false, 'Invalid');
      
      if (treeViewContainer) {
        treeViewContainer.innerHTML = '<div style="text-align: center; color: #e53e3e; padding: 2rem;">Invalid JSON - cannot display tree view</div>';
      }
      
      const {errorMessage} = formatWithError(input, e);
      showMessage(errorMessage, 'error');
      scrollToOutput();
    }
  }
  
  function copyResult() {
    if (!currentData) {
      showMessage('Nothing to copy', 'warning');
      return;
    }
    
    // Copy the appropriate format based on current display mode
    let output;
    if (currentDisplayMode === 'minified' && minifiedText) {
      output = minifiedText;
    } else {
      // Default to formatted JSON for tree view
      output = JSON.stringify(currentData, null, 2);
    }
    
    navigator.clipboard.writeText(output).then(() => {
      const message = currentDisplayMode === 'minified' ? 
        '✓ Minified JSON copied to clipboard!' : 
        '✓ Formatted JSON copied to clipboard!';
      showMessage(message, 'success');
      setTimeout(hideMessage, 2000);
    }).catch(() => {
      showMessage('Failed to copy to clipboard', 'error');
    });
  }
  
  function clearAll() {
    inputEl.value = '';
    if (treeViewContainer) {
      treeViewContainer.innerHTML = '';
    }
    // Clear external controls as well
    const externalControls = document.getElementById('tree-controls-container');
    if (externalControls) {
      externalControls.innerHTML = '';
    }
    hideMessage();
    updateCharCount(0);
    currentData = null;
    currentDisplayMode = 'tree';
    minifiedText = null;
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
  
  // Initialize enhanced UI when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEnhancedUI);
  } else {
    initializeEnhancedUI();
  }
  
  // Initialize character count
  updateCharCount(inputEl.value.length);
})();