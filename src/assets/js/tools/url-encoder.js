// URL Encoder / Decoder
(function() {
  const inputEl = document.getElementById('url-input');
  const outputEl = document.getElementById('url-output');
  const errorEl = document.getElementById('error-message');
  const errorText = errorEl.querySelector('p');
  const parsedViewSection = document.getElementById('parsed-view-section');
  const parsedView = document.getElementById('parsed-view');
  const parsedLegend = document.getElementById('parsed-legend');
  
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
      updateParsedView(encoded);
    } catch (e) {
      showError(`Error encoding: ${e.message}`);
      outputEl.value = '';
      parsedViewSection.classList.add('hidden');
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
      updateParsedView(decoded);
    } catch (e) {
      showError(`Error decoding: ${e.message}`);
      outputEl.value = '';
      parsedViewSection.classList.add('hidden');
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
      updateParsedView(encoded);
    } catch (e) {
      showError(`Error encoding: ${e.message}`);
      outputEl.value = '';
      parsedViewSection.classList.add('hidden');
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
      updateParsedView(decoded);
    } catch (e) {
      showError(`Error decoding: ${e.message}`);
      outputEl.value = '';
      parsedViewSection.classList.add('hidden');
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
    updateParsedView('');
  }
  
  function parseURL(urlString) {
    if (!urlString || urlString.trim() === '') {
      return null;
    }
    
    try {
      // Try to parse as URL first (handles encoded URLs)
      let url;
      let decodedUrl = urlString;
      let needsProtocol = false;
      
      try {
        url = new URL(urlString);
        // Try to decode the full URL for display
        try {
          decodedUrl = decodeURI(urlString);
        } catch (e) {
          decodedUrl = urlString;
        }
      } catch (e) {
        // If URL constructor fails, try adding protocol
        try {
          url = new URL('https://' + urlString);
          needsProtocol = true;
          try {
            decodedUrl = decodeURI('https://' + urlString);
          } catch (e2) {
            decodedUrl = 'https://' + urlString;
          }
        } catch (e2) {
          return null;
        }
      }
      
      return {
        original: urlString,
        decoded: decodedUrl,
        scheme: url.protocol.replace(':', ''),
        host: url.hostname,
        port: url.port || '',
        path: url.pathname,
        query: url.search,
        queryParams: Object.fromEntries(url.searchParams),
        fragment: url.hash,
        username: url.username || '',
        password: url.password || '',
        needsProtocol: needsProtocol
      };
    } catch (e) {
      return null;
    }
  }
  
  function updateParsedView(urlString) {
    const parsed = parseURL(urlString);
    
    if (!parsed) {
      parsedViewSection.classList.add('hidden');
      return;
    }
    
    parsedViewSection.classList.remove('hidden');
    
    // Build color-coded URL display
    let html = '';
    const parts = [];
    
    // Scheme
    if (parsed.scheme) {
      parts.push({
        text: parsed.scheme + '://',
        type: 'scheme',
        decoded: parsed.scheme + '://'
      });
    }
    
    // Username/Password
    if (parsed.username) {
      parts.push({
        text: parsed.username,
        type: 'username',
        decoded: parsed.username
      });
      if (parsed.password) {
        parts.push({ text: ':', type: 'separator', decoded: ':' });
        parts.push({
          text: parsed.password,
          type: 'password',
          decoded: parsed.password
        });
      }
      parts.push({ text: '@', type: 'separator', decoded: '@' });
    }
    
    // Host
    if (parsed.host) {
      parts.push({
        text: parsed.host,
        type: 'host',
        decoded: parsed.host
      });
    }
    
    // Port
    if (parsed.port) {
      parts.push({ text: ':', type: 'separator', decoded: ':' });
      parts.push({
        text: parsed.port,
        type: 'port',
        decoded: parsed.port
      });
    }
    
    // Path
    if (parsed.path) {
      let decodedPath = parsed.path;
      try {
        decodedPath = decodeURIComponent(parsed.path);
      } catch (e) {
        // If decoding fails, use original
        decodedPath = parsed.path;
      }
      parts.push({
        text: parsed.path,
        type: 'path',
        decoded: decodedPath
      });
    }
    
    // Query
    if (parsed.query) {
      let decodedQuery = parsed.query;
      try {
        decodedQuery = decodeURIComponent(parsed.query);
      } catch (e) {
        // If decoding fails, use original
        decodedQuery = parsed.query;
      }
      parts.push({
        text: parsed.query,
        type: 'query',
        decoded: decodedQuery
      });
    }
    
    // Fragment
    if (parsed.fragment) {
      let decodedFragment = parsed.fragment;
      try {
        decodedFragment = decodeURIComponent(parsed.fragment);
      } catch (e) {
        // If decoding fails, use original
        decodedFragment = parsed.fragment;
      }
      parts.push({
        text: parsed.fragment,
        type: 'fragment',
        decoded: decodedFragment
      });
    }
    
    // Color mapping for light and dark modes
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                       document.documentElement.getAttribute('data-theme') === 'dark';
    
    const colorMap = {
      scheme: isDarkMode ? '#60a5fa' : '#2563eb',
      host: isDarkMode ? '#4ade80' : '#16a34a',
      port: isDarkMode ? '#a78bfa' : '#9333ea',
      path: isDarkMode ? '#fb923c' : '#ea580c',
      query: isDarkMode ? '#fbbf24' : '#d97706',
      fragment: isDarkMode ? '#f472b6' : '#db2777',
      username: isDarkMode ? '#5eead4' : '#0891b2',
      password: isDarkMode ? '#f87171' : '#dc2626',
      separator: isDarkMode ? '#9ca3af' : '#6b7280'
    };
    
    // Build HTML with color-coded spans and inline styles
    html = parts.map(part => {
      const className = `url-part url-part--${part.type}`;
      const color = colorMap[part.type] || '#000000';
      const fontWeight = part.type === 'scheme' || part.type === 'host' ? '600' : 
                        part.type === 'separator' ? '400' : '500';
      return `<span class="${className}" style="color: ${color} !important; font-weight: ${fontWeight};" title="${part.decoded !== part.text ? 'Decoded: ' + escapeHtml(part.decoded) : ''}">${escapeHtml(part.text)}</span>`;
    }).join('');
    
    parsedView.innerHTML = html;
    
    // Build legend
    const legendItems = [];
    const usedTypes = new Set(parts.map(p => p.type));
    
    const legendMap = {
      scheme: 'Scheme',
      host: 'Host',
      port: 'Port',
      path: 'Path',
      query: 'Query',
      fragment: 'Fragment',
      username: 'Username',
      password: 'Password'
    };
    
    // Don't show separator in legend
    usedTypes.delete('separator');
    
    for (const type of usedTypes) {
      if (legendMap[type]) {
        legendItems.push({
          type: type,
          label: legendMap[type]
        });
      }
    }
    
    const legendHtml = legendItems.map(item => {
      const color = colorMap[item.type] || '#000000';
      return `<div class="flex items-center gap-2">
        <span class="url-part url-part--${item.type} font-semibold" style="color: ${color} !important;">●</span>
        <span>${escapeHtml(item.label)}</span>
      </div>`;
    }).join('');
    
    parsedLegend.innerHTML = legendHtml || '';
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Update parsed view on input change
  inputEl.addEventListener('input', function() {
    const input = inputEl.value.trim();
    if (input) {
      updateParsedView(input);
    } else {
      parsedViewSection.classList.add('hidden');
    }
  });
  
  // Event listeners
  encodeBtn.addEventListener('click', encodeURL);
  decodeBtn.addEventListener('click', decodeURL);
  encodeComponentBtn.addEventListener('click', encodeComponent);
  decodeComponentBtn.addEventListener('click', decodeComponent);
  copyBtn.addEventListener('click', copyResult);
  clearBtn.addEventListener('click', clearAll);
  
  // Initial parse if there's a value
  if (inputEl.value.trim()) {
    updateParsedView(inputEl.value);
  }
  
  // Listen for theme changes and update parsed view
  const observer = new MutationObserver(() => {
    if (inputEl.value.trim()) {
      updateParsedView(inputEl.value);
    }
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme']
  });
})();

