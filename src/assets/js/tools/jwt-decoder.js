// JWT Decoder
(function() {
  const inputEl = document.getElementById('jwt-input');
  const headerEl = document.getElementById('jwt-header');
  const payloadEl = document.getElementById('jwt-payload');
  const errorEl = document.getElementById('error-message');
  const errorText = errorEl.querySelector('p');
  const tokenInfo = document.getElementById('token-info');
  
  const decodeBtn = document.getElementById('decode-btn');
  const clearBtn = document.getElementById('clear-btn');
  
  function showError(message) {
    errorText.textContent = message;
    errorEl.classList.remove('hidden');
    tokenInfo.classList.add('hidden');
  }
  
  function hideError() {
    errorEl.classList.add('hidden');
  }
  
  function base64UrlDecode(str) {
    // Replace URL-safe characters
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // Pad with '=' to make length multiple of 4
    while (str.length % 4) {
      str += '=';
    }
    
    try {
      return decodeURIComponent(
        atob(str)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch (e) {
      throw new Error('Invalid Base64 encoding');
    }
  }
  
  function formatTimestamp(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString() + (date < new Date() ? ' (Expired)' : ' (Valid)');
  }
  
  function decodeJWT() {
    hideError();
    const token = inputEl.value.trim();
    
    if (!token) {
      showError('Please enter a JWT token');
      return;
    }
    
    // JWT should have 3 parts separated by dots
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      showError('Invalid JWT format. A JWT should have 3 parts separated by dots (header.payload.signature)');
      headerEl.value = '';
      payloadEl.value = '';
      return;
    }
    
    try {
      // Decode header
      const headerJson = base64UrlDecode(parts[0]);
      const header = JSON.parse(headerJson);
      headerEl.value = JSON.stringify(header, null, 2);
      
      // Decode payload
      const payloadJson = base64UrlDecode(parts[1]);
      const payload = JSON.parse(payloadJson);
      payloadEl.value = JSON.stringify(payload, null, 2);
      
      // Display token info
      document.getElementById('token-alg').textContent = header.alg || 'N/A';
      document.getElementById('token-typ').textContent = header.typ || 'JWT';
      
      // Show expiration if present
      if (payload.exp) {
        document.getElementById('token-exp').textContent = formatTimestamp(payload.exp);
        document.getElementById('token-exp-line').classList.remove('hidden');
      } else {
        document.getElementById('token-exp-line').classList.add('hidden');
      }
      
      // Show issued at if present
      if (payload.iat) {
        document.getElementById('token-iat').textContent = formatTimestamp(payload.iat);
        document.getElementById('token-iat-line').classList.remove('hidden');
      } else {
        document.getElementById('token-iat-line').classList.add('hidden');
      }
      
      tokenInfo.classList.remove('hidden');
      
    } catch (e) {
      showError(`Error decoding JWT: ${e.message}`);
      headerEl.value = '';
      payloadEl.value = '';
    }
  }
  
  function clearAll() {
    inputEl.value = '';
    headerEl.value = '';
    payloadEl.value = '';
    hideError();
    tokenInfo.classList.add('hidden');
  }
  
  // Event listeners
  decodeBtn.addEventListener('click', decodeJWT);
  clearBtn.addEventListener('click', clearAll);
  
  // Decode on paste or input (with debounce)
  let decodeTimeout;
  inputEl.addEventListener('input', () => {
    clearTimeout(decodeTimeout);
    decodeTimeout = setTimeout(decodeJWT, 500);
  });
})();

