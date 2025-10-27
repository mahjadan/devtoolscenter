// YAML to JSON Converter (basic implementation)
(function() {
  const inputEl = document.getElementById('yaml-input');
  const outputEl = document.getElementById('yaml-output');
  const errorEl = document.getElementById('error-message');
  const errorText = errorEl.querySelector('p');
  
  const yamlToJsonBtn = document.getElementById('yaml-to-json-btn');
  const jsonToYamlBtn = document.getElementById('json-to-yaml-btn');
  const copyBtn = document.getElementById('copy-btn');
  const clearBtn = document.getElementById('clear-btn');
  
  function showError(message) {
    errorText.textContent = message;
    errorEl.classList.remove('hidden');
  }
  
  function hideError() {
    errorEl.classList.add('hidden');
  }
  
  // Basic YAML to JSON parser (handles simple cases)
  function parseYAML(yamlString) {
    const lines = yamlString.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
    const result = {};
    let currentIndent = 0;
    let stack = [result];
    
    for (const line of lines) {
      const indent = line.search(/\S/);
      const content = line.trim();
      
      if (content.includes(':')) {
        const [key, ...valueParts] = content.split(':');
        const value = valueParts.join(':').trim();
        const cleanKey = key.trim();
        
        // Adjust stack based on indentation
        while (stack.length > 1 && indent <= currentIndent) {
          stack.pop();
          currentIndent -= 2;
        }
        
        const current = stack[stack.length - 1];
        
        if (value === '') {
          // Object
          current[cleanKey] = {};
          stack.push(current[cleanKey]);
          currentIndent = indent;
        } else if (value.startsWith('[') && value.endsWith(']')) {
          // Array
          try {
            current[cleanKey] = JSON.parse(value);
          } catch {
            current[cleanKey] = value;
          }
        } else if (!isNaN(value) && value !== '') {
          // Number
          current[cleanKey] = parseFloat(value);
        } else if (value === 'true' || value === 'false') {
          // Boolean
          current[cleanKey] = value === 'true';
        } else if (value === 'null') {
          // Null
          current[cleanKey] = null;
        } else {
          // String - remove quotes if present
          current[cleanKey] = value.replace(/^["']|["']$/g, '');
        }
      }
    }
    
    return result;
  }
  
  // Basic JSON to YAML converter
  function jsonToYAML(obj, indent = 0) {
    let yaml = '';
    const spaces = '  '.repeat(indent);
    
    for (const [key, value] of Object.entries(obj)) {
      if (value === null) {
        yaml += `${spaces}${key}: null\n`;
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        yaml += `${spaces}${key}:\n`;
        yaml += jsonToYAML(value, indent + 1);
      } else if (Array.isArray(value)) {
        yaml += `${spaces}${key}: ${JSON.stringify(value)}\n`;
      } else if (typeof value === 'string') {
        yaml += `${spaces}${key}: ${value}\n`;
      } else {
        yaml += `${spaces}${key}: ${value}\n`;
      }
    }
    
    return yaml;
  }
  
  function convertYAMLtoJSON() {
    hideError();
    const input = inputEl.value.trim();
    
    if (!input) {
      showError('Please enter some YAML data');
      return;
    }
    
    try {
      const parsed = parseYAML(input);
      const json = JSON.stringify(parsed, null, 2);
      outputEl.value = json;
    } catch (e) {
      showError(`Error parsing YAML: ${e.message}`);
      outputEl.value = '';
    }
  }
  
  function convertJSONtoYAML() {
    hideError();
    const input = inputEl.value.trim();
    
    if (!input) {
      showError('Please enter some JSON data');
      return;
    }
    
    try {
      const parsed = JSON.parse(input);
      const yaml = jsonToYAML(parsed);
      outputEl.value = yaml;
    } catch (e) {
      showError(`Error parsing JSON: ${e.message}`);
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
  yamlToJsonBtn.addEventListener('click', convertYAMLtoJSON);
  jsonToYamlBtn.addEventListener('click', convertJSONtoYAML);
  copyBtn.addEventListener('click', copyResult);
  clearBtn.addEventListener('click', clearAll);
})();

