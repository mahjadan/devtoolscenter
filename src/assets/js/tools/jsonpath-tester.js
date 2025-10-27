// JSONPath Tester (Basic Implementation)
(function() {
  const jsonInputEl = document.getElementById('json-input');
  const jsonpathInputEl = document.getElementById('jsonpath-input');
  const outputEl = document.getElementById('jsonpath-output');
  const errorEl = document.getElementById('error-message');
  const errorText = errorEl.querySelector('p');
  
  const testBtn = document.getElementById('test-btn');
  const clearBtn = document.getElementById('clear-btn');
  
  function showError(message) {
    errorText.textContent = message;
    errorEl.classList.remove('hidden');
  }
  
  function hideError() {
    errorEl.classList.add('hidden');
  }
  
  // Basic JSONPath evaluator (simplified implementation)
  function evaluateJSONPath(obj, path) {
    // Remove leading $ and trim
    path = path.trim().replace(/^\$\.?/, '');
    
    if (!path) return [obj];
    
    let current = [obj];
    const parts = path.split(/\.(?![^\[]*\])/); // Split by . but not inside brackets
    
    for (const part of parts) {
      const newCurrent = [];
      
      for (const item of current) {
        if (part === '*') {
          // Wildcard - get all values
          if (Array.isArray(item)) {
            newCurrent.push(...item);
          } else if (typeof item === 'object' && item !== null) {
            newCurrent.push(...Object.values(item));
          }
        } else if (part.startsWith('[') && part.endsWith(']')) {
          // Array accessor
          const inner = part.slice(1, -1);
          
          if (inner === '*') {
            // Array wildcard
            if (Array.isArray(item)) {
              newCurrent.push(...item);
            }
          } else if (inner.includes(',')) {
            // Multiple indices
            const indices = inner.split(',').map(i => parseInt(i.trim()));
            if (Array.isArray(item)) {
              indices.forEach(idx => {
                if (item[idx] !== undefined) {
                  newCurrent.push(item[idx]);
                }
              });
            }
          } else if (!isNaN(inner)) {
            // Single index
            const idx = parseInt(inner);
            if (Array.isArray(item) && item[idx] !== undefined) {
              newCurrent.push(item[idx]);
            }
          }
        } else {
          // Property access
          const cleanPart = part.replace(/\[['"](.+)['"]\]/, '$1');
          if (item && typeof item === 'object' && item[cleanPart] !== undefined) {
            newCurrent.push(item[cleanPart]);
          }
        }
      }
      
      current = newCurrent;
    }
    
    return current;
  }
  
  function testJSONPath() {
    hideError();
    const jsonInput = jsonInputEl.value.trim();
    const jsonpath = jsonpathInputEl.value.trim();
    
    if (!jsonInput) {
      showError('Please enter JSON data');
      return;
    }
    
    if (!jsonpath) {
      showError('Please enter a JSONPath expression');
      return;
    }
    
    try {
      const jsonData = JSON.parse(jsonInput);
      
      try {
        const result = evaluateJSONPath(jsonData, jsonpath);
        
        if (result.length === 0) {
          outputEl.value = 'No matches found';
        } else if (result.length === 1) {
          outputEl.value = JSON.stringify(result[0], null, 2);
        } else {
          outputEl.value = JSON.stringify(result, null, 2);
        }
      } catch (e) {
        showError(`Error evaluating JSONPath: ${e.message}`);
        outputEl.value = '';
      }
    } catch (e) {
      showError(`Invalid JSON: ${e.message}`);
      outputEl.value = '';
    }
  }
  
  function clearAll() {
    jsonInputEl.value = '';
    jsonpathInputEl.value = '';
    outputEl.value = '';
    hideError();
  }
  
  // Event listeners
  testBtn.addEventListener('click', testJSONPath);
  clearBtn.addEventListener('click', clearAll);
  
  // Auto-test on input (with debounce)
  let testTimeout;
  const autoTest = () => {
    clearTimeout(testTimeout);
    if (jsonInputEl.value && jsonpathInputEl.value) {
      testTimeout = setTimeout(testJSONPath, 500);
    }
  };
  
  jsonInputEl.addEventListener('input', autoTest);
  jsonpathInputEl.addEventListener('input', autoTest);
})();

