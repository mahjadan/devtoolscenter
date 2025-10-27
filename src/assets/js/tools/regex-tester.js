// Regex Tester
(function() {
  const patternEl = document.getElementById('regex-pattern');
  const testStringEl = document.getElementById('test-string');
  const errorEl = document.getElementById('error-message');
  const errorText = errorEl.querySelector('p');
  const matchesSection = document.getElementById('matches-section');
  const matchesOutput = document.getElementById('matches-output');
  const groupsSection = document.getElementById('groups-section');
  const groupsOutput = document.getElementById('groups-output');
  
  const flagG = document.getElementById('flag-g');
  const flagI = document.getElementById('flag-i');
  const flagM = document.getElementById('flag-m');
  
  const testBtn = document.getElementById('test-btn');
  const clearBtn = document.getElementById('clear-btn');
  
  function showError(message) {
    errorText.textContent = message;
    errorEl.classList.remove('hidden');
    matchesSection.classList.add('hidden');
    groupsSection.classList.add('hidden');
  }
  
  function hideError() {
    errorEl.classList.add('hidden');
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function testRegex() {
    hideError();
    const pattern = patternEl.value;
    const testString = testStringEl.value;
    
    if (!pattern) {
      showError('Please enter a regex pattern');
      return;
    }
    
    if (!testString) {
      showError('Please enter a test string');
      return;
    }
    
    try {
      // Build flags
      let flags = '';
      if (flagG.checked) flags += 'g';
      if (flagI.checked) flags += 'i';
      if (flagM.checked) flags += 'm';
      
      const regex = new RegExp(pattern, flags);
      const matches = [...testString.matchAll(regex)];
      
      if (matches.length === 0) {
        matchesOutput.innerHTML = '<p class="text-gray-600 dark:text-gray-400">No matches found</p>';
        matchesSection.classList.remove('hidden');
        groupsSection.classList.add('hidden');
        return;
      }
      
      // Display matches with highlighting
      let highlightedText = escapeHtml(testString);
      let offset = 0;
      
      matches.forEach(match => {
        const start = match.index + offset;
        const end = start + match[0].length;
        const matchText = escapeHtml(match[0]);
        const highlighted = `<mark class="bg-yellow-300 dark:bg-yellow-600 px-1 rounded">${matchText}</mark>`;
        
        highlightedText = 
          highlightedText.slice(0, start) + 
          highlighted + 
          highlightedText.slice(end);
        
        offset += highlighted.length - matchText.length;
      });
      
      matchesOutput.innerHTML = `
        <div class="mb-4">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Found ${matches.length} match${matches.length !== 1 ? 'es' : ''}
          </p>
          <pre class="whitespace-pre-wrap font-mono text-sm text-gray-900 dark:text-gray-100">${highlightedText}</pre>
        </div>
      `;
      matchesSection.classList.remove('hidden');
      
      // Display capture groups
      if (matches.length > 0 && matches[0].length > 1) {
        let groupsHtml = '<div class="space-y-3">';
        
        matches.forEach((match, matchIndex) => {
          groupsHtml += `<div class="border-b border-gray-300 dark:border-gray-600 pb-2">`;
          groupsHtml += `<p class="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">Match ${matchIndex + 1}:</p>`;
          groupsHtml += `<div class="pl-4 space-y-1">`;
          groupsHtml += `<p class="text-sm font-mono text-gray-900 dark:text-gray-100">Full match: <span class="text-primary-600 dark:text-primary-400">${escapeHtml(match[0])}</span></p>`;
          
          for (let i = 1; i < match.length; i++) {
            if (match[i] !== undefined) {
              groupsHtml += `<p class="text-sm font-mono text-gray-900 dark:text-gray-100">Group ${i}: <span class="text-accent-600 dark:text-accent-400">${escapeHtml(match[i])}</span></p>`;
            }
          }
          groupsHtml += `</div></div>`;
        });
        
        groupsHtml += '</div>';
        groupsOutput.innerHTML = groupsHtml;
        groupsSection.classList.remove('hidden');
      } else {
        groupsSection.classList.add('hidden');
      }
      
    } catch (e) {
      showError(`Invalid regex pattern: ${e.message}`);
    }
  }
  
  function clearAll() {
    patternEl.value = '';
    testStringEl.value = '';
    hideError();
    matchesSection.classList.add('hidden');
    groupsSection.classList.add('hidden');
  }
  
  // Event listeners
  testBtn.addEventListener('click', testRegex);
  clearBtn.addEventListener('click', clearAll);
  
  // Test on input (with debounce)
  let testTimeout;
  const autoTest = () => {
    clearTimeout(testTimeout);
    if (patternEl.value && testStringEl.value) {
      testTimeout = setTimeout(testRegex, 500);
    }
  };
  
  patternEl.addEventListener('input', autoTest);
  testStringEl.addEventListener('input', autoTest);
  flagG.addEventListener('change', () => {
    if (patternEl.value && testStringEl.value) testRegex();
  });
  flagI.addEventListener('change', () => {
    if (patternEl.value && testStringEl.value) testRegex();
  });
  flagM.addEventListener('change', () => {
    if (patternEl.value && testStringEl.value) testRegex();
  });
})();

