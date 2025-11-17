// JWT Encoder/Decoder Tool
(function() {
  // DOM Elements
  const decodeModeBtn = document.getElementById('decode-mode-btn');
  const encodeModeBtn = document.getElementById('encode-mode-btn');
  const decodeMode = document.getElementById('decode-mode');
  const encodeMode = document.getElementById('encode-mode');
  const globalError = document.getElementById('global-error');
  
  // Decode Mode Elements
  const jwtInput = document.getElementById('jwt-input');
  const decodeError = document.getElementById('decode-error');
  const tokenInfo = document.getElementById('token-info');
  const jwtHeader = document.getElementById('jwt-header');
  const jwtPayload = document.getElementById('jwt-payload');
  
  // Token info elements (desktop)
  const tokenAlg = document.getElementById('token-alg');
  const tokenTyp = document.getElementById('token-typ');
  const tokenIatPill = document.getElementById('token-iat-pill');
  const tokenIat = document.getElementById('token-iat');
  const tokenExpPill = document.getElementById('token-exp-pill');
  const tokenExp = document.getElementById('token-exp');
  const tokenExpStatus = document.getElementById('token-exp-status');
  const tokenSubPill = document.getElementById('token-sub-pill');
  const tokenSub = document.getElementById('token-sub');
  const tokenIssPill = document.getElementById('token-iss-pill');
  const tokenIss = document.getElementById('token-iss');
  
  // Token info elements (mobile)
  const tokenInfoMobile = document.getElementById('token-info-mobile');
  const tokenAlgMobile = document.getElementById('token-alg-mobile');
  const tokenTypMobile = document.getElementById('token-typ-mobile');
  const tokenIatPillMobile = document.getElementById('token-iat-pill-mobile');
  const tokenIatMobile = document.getElementById('token-iat-mobile');
  const tokenExpPillMobile = document.getElementById('token-exp-pill-mobile');
  const tokenExpMobile = document.getElementById('token-exp-mobile');
  const tokenExpStatusMobile = document.getElementById('token-exp-status-mobile');
  const tokenSubPillMobile = document.getElementById('token-sub-pill-mobile');
  const tokenSubMobile = document.getElementById('token-sub-mobile');
  const tokenIssPillMobile = document.getElementById('token-iss-pill-mobile');
  const tokenIssMobile = document.getElementById('token-iss-mobile');
  
  // Verification elements
  const verifyToggle = document.getElementById('verify-toggle');
  const verifyChevron = document.getElementById('verify-chevron');
  const verifyContent = document.getElementById('verify-content');
  const verifyBtn = document.getElementById('verify-btn');
  const verifyKey = document.getElementById('verify-key');
  const verifyKeyLabel = document.getElementById('verify-key-label');
  const verifyResult = document.getElementById('verify-result');
  
  // Encode Mode Elements
  const encodeHeader = document.getElementById('encode-header');
  const encodePayload = document.getElementById('encode-payload');
  const headerValidation = document.getElementById('header-validation');
  const headerValidationIcon = document.getElementById('header-validation-icon');
  const headerValidationText = document.getElementById('header-validation-text');
  const payloadValidation = document.getElementById('payload-validation');
  const payloadValidationIcon = document.getElementById('payload-validation-icon');
  const payloadValidationText = document.getElementById('payload-validation-text');
  
  // Signing elements
  const signingSection = document.getElementById('signing-section');
  const noSignatureMessage = document.getElementById('no-signature-message');
  const secretKeySection = document.getElementById('secret-key-section');
  const privateKeySection = document.getElementById('private-key-section');
  const encodeSecret = document.getElementById('encode-secret');
  const encodePrivateKey = document.getElementById('encode-private-key');
  const privateKeyLabel = document.getElementById('private-key-label');
  
  // Token output elements
  const tokenOutput = document.getElementById('token-output');
  const tokenPlaceholder = document.getElementById('token-placeholder');
  const tokenErrors = document.getElementById('token-errors');
  const tokenErrorList = document.getElementById('token-error-list');
  const tokenSuccess = document.getElementById('token-success');
  const generatedToken = document.getElementById('generated-token');
  const copyTokenBtn = document.getElementById('copy-token-btn');
  
  // Mobile token preview elements
  const mobileTokenPlaceholder = document.getElementById('mobile-token-placeholder');
  const mobileTokenSuccess = document.getElementById('mobile-token-success');
  const mobileGeneratedToken = document.getElementById('mobile-generated-token');
  
  // Encode mode token display elements
  const encodeTokenDisplay = document.getElementById('encode-token-display');
  const encodeTokenInfo = document.getElementById('encode-token-info');
  const encodeTokenInfoMobile = document.getElementById('encode-token-info-mobile');
  const encodeJwtHeader = document.getElementById('encode-jwt-header');
  const encodeJwtPayload = document.getElementById('encode-jwt-payload');
  
  // Encode token info elements (desktop)
  const encodeTokenAlg = document.getElementById('encode-token-alg');
  const encodeTokenTyp = document.getElementById('encode-token-typ');
  const encodeTokenIatPill = document.getElementById('encode-token-iat-pill');
  const encodeTokenIat = document.getElementById('encode-token-iat');
  const encodeTokenExpPill = document.getElementById('encode-token-exp-pill');
  const encodeTokenExp = document.getElementById('encode-token-exp');
  const encodeTokenExpStatus = document.getElementById('encode-token-exp-status');
  const encodeTokenSubPill = document.getElementById('encode-token-sub-pill');
  const encodeTokenSub = document.getElementById('encode-token-sub');
  const encodeTokenIssPill = document.getElementById('encode-token-iss-pill');
  const encodeTokenIss = document.getElementById('encode-token-iss');
  
  // Encode token info elements (mobile)
  const encodeTokenAlgMobile = document.getElementById('encode-token-alg-mobile');
  const encodeTokenTypMobile = document.getElementById('encode-token-typ-mobile');
  const encodeTokenIatPillMobile = document.getElementById('encode-token-iat-pill-mobile');
  const encodeTokenIatMobile = document.getElementById('encode-token-iat-mobile');
  const encodeTokenExpPillMobile = document.getElementById('encode-token-exp-pill-mobile');
  const encodeTokenExpMobile = document.getElementById('encode-token-exp-mobile');
  const encodeTokenExpStatusMobile = document.getElementById('encode-token-exp-status-mobile');
  const encodeTokenSubPillMobile = document.getElementById('encode-token-sub-pill-mobile');
  const encodeTokenSubMobile = document.getElementById('encode-token-sub-mobile');
  const encodeTokenIssPillMobile = document.getElementById('encode-token-iss-pill-mobile');
  const encodeTokenIssMobile = document.getElementById('encode-token-iss-mobile');
  
  // State
  let currentMode = 'decode';
  let verifyExpanded = false;
  
  // Utility Functions
  function base64UrlEncode(str) {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
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
  
  function isValidJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  function formatTimestamp(timestamp) {
    if (!timestamp) return null;
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  }
  
  function getTimeRemaining(timestamp) {
    if (!timestamp) return null;
    const now = new Date();
    const expiry = new Date(timestamp * 1000);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) {
      return { expired: true, text: 'Expired' };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return { expired: false, text: `${days}d ${hours}h` };
    } else if (hours > 0) {
      return { expired: false, text: `${hours}h ${minutes}m` };
    } else {
      return { expired: false, text: `${minutes}m` };
    }
  }
  
  function showGlobalError(message) {
    globalError.querySelector('p').textContent = message;
    globalError.classList.remove('hidden');
  }
  
  function hideGlobalError() {
    globalError.classList.add('hidden');
  }
  
  function showDecodeError(message) {
    decodeError.querySelector('p').textContent = message;
    decodeError.classList.remove('hidden');
  }
  
  function hideDecodeError() {
    decodeError.classList.add('hidden');
  }
  
  // Token Info visibility helpers (handle lg:block class for desktop)
  function showTokenInfo() {
    // Keep 'hidden' for mobile, add 'lg:block' for desktop
    // This ensures desktop version only shows on large screens
    tokenInfo.classList.add('hidden', 'lg:block');
    tokenInfoMobile.classList.remove('hidden');
    tokenInfoMobile.classList.add('block');
  }
  
  function hideTokenInfo() {
    // Hide both desktop and mobile versions
    tokenInfo.classList.add('hidden');
    tokenInfo.classList.remove('lg:block');
    tokenInfoMobile.classList.add('hidden');
    tokenInfoMobile.classList.remove('block');
  }
  
  // Mode Switching
  function switchToDecodeMode() {
    currentMode = 'decode';
    decodeModeBtn.classList.add('text-white', 'bg-primary-600', 'shadow-sm');
    decodeModeBtn.classList.remove('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-200', 'dark:hover:bg-gray-700');
    encodeModeBtn.classList.remove('text-white', 'bg-primary-600', 'shadow-sm');
    encodeModeBtn.classList.add('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-200', 'dark:hover:bg-gray-700');
    
    decodeMode.classList.remove('hidden');
    encodeMode.classList.add('hidden');
    hideGlobalError();
  }
  
  function switchToEncodeMode() {
    currentMode = 'encode';
    encodeModeBtn.classList.add('text-white', 'bg-primary-600', 'shadow-sm');
    encodeModeBtn.classList.remove('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-200', 'dark:hover:bg-gray-700');
    decodeModeBtn.classList.remove('text-white', 'bg-primary-600', 'shadow-sm');
    decodeModeBtn.classList.add('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-200', 'dark:hover:bg-gray-700');
    
    encodeMode.classList.remove('hidden');
    decodeMode.classList.add('hidden');
    hideGlobalError();
    if (encodeTokenDisplay) {
      encodeTokenDisplay.classList.add('hidden');
    }
    // Use setTimeout to ensure DOM is ready and validation UI updates properly
    setTimeout(() => {
      validateEncodeInputs();
    }, 0);
  }
  
  // Decode Functionality
  function decodeJWT() {
    hideDecodeError();
    hideGlobalError();
    const token = jwtInput.value.trim();
    
    // Clear previous results
    jwtHeader.textContent = '';
    jwtPayload.textContent = '';
    
    // Clear token info values
    tokenAlg.textContent = '';
    tokenTyp.textContent = '';
    tokenAlgMobile.textContent = '';
    tokenTypMobile.textContent = '';
    
    // Hide token info by default - will be shown only if token is valid
    hideTokenInfo();
    
    if (!token) {
      // Ensure token info is hidden when input is empty
      hideTokenInfo();
      return;
    }
    
    // JWT should have 3 parts separated by dots
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      showDecodeError('Invalid JWT format. A JWT should have 3 parts separated by dots (header.payload.signature)');
      // Hide token info when format is invalid
      hideTokenInfo();
      return;
    }
    
    try {
      // Decode header
      const headerJson = base64UrlDecode(parts[0]);
      const header = JSON.parse(headerJson);
      
      // Decode payload
      const payloadJson = base64UrlDecode(parts[1]);
      const payload = JSON.parse(payloadJson);
      
      // Validate that header and payload are objects and not empty
      const isValidToken = header && typeof header === 'object' && 
                          payload && typeof payload === 'object' &&
                          Object.keys(header).length > 0 &&
                          Object.keys(payload).length > 0;
      
      if (!isValidToken) {
        showDecodeError('Invalid JWT: Header and payload must be valid JSON objects');
        // Hide token info when validation fails
        hideTokenInfo();
        return;
      }
      
      jwtHeader.textContent = JSON.stringify(header, null, 2);
      jwtPayload.textContent = JSON.stringify(payload, null, 2);
      
      // Display token info (both desktop and mobile) - only show if token is valid
      const algValue = header.alg || 'N/A';
      const typValue = header.typ || 'JWT';
      
      tokenAlg.textContent = algValue;
      tokenTyp.textContent = typValue;
      tokenAlgMobile.textContent = algValue;
      tokenTypMobile.textContent = typValue;
      
      // Show issued at if present
      if (payload.iat) {
        const iatTime = formatTimestamp(payload.iat);
        tokenIat.textContent = iatTime;
        tokenIatMobile.textContent = iatTime;
        tokenIatPill.classList.remove('hidden');
        tokenIatPillMobile.classList.remove('hidden');
      } else {
        tokenIatPill.classList.add('hidden');
        tokenIatPillMobile.classList.add('hidden');
      }
      
      // Show expiration if present
      if (payload.exp) {
        const expTime = formatTimestamp(payload.exp);
        const remaining = getTimeRemaining(payload.exp);
        
        tokenExp.textContent = expTime;
        tokenExpMobile.textContent = expTime;
        
        if (remaining.expired) {
          const expiredClass = 'px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
          const expiredPillClass = 'px-3 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg border-l-4 border-l-red-500';
          const expiredPillMobileClass = 'flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded text-sm';
          
          tokenExpStatus.textContent = 'Expired';
          tokenExpStatusMobile.textContent = 'Expired';
          tokenExpStatus.className = expiredClass + ' inline-block';
          tokenExpStatusMobile.className = expiredClass + ' ml-1';
          tokenExpPill.className = expiredPillClass;
          tokenExpPillMobile.className = expiredPillMobileClass;
        } else {
          const validClass = 'px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
          const validPillClass = 'px-3 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg border-l-4 border-l-green-500';
          const validPillMobileClass = 'flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-sm';
          
          tokenExpStatus.textContent = remaining.text;
          tokenExpStatusMobile.textContent = remaining.text;
          tokenExpStatus.className = validClass + ' inline-block';
          tokenExpStatusMobile.className = validClass + ' ml-1';
          tokenExpPill.className = validPillClass;
          tokenExpPillMobile.className = validPillMobileClass;
        }
        
        tokenExpPill.classList.remove('hidden');
        tokenExpPillMobile.classList.remove('hidden');
      } else {
        tokenExpPill.classList.add('hidden');
        tokenExpPillMobile.classList.add('hidden');
      }
      
      // Show subject if present
      if (payload.sub) {
        const subValue = payload.sub.length > 20 ? payload.sub.substring(0, 20) + '...' : payload.sub;
        tokenSub.textContent = payload.sub;
        tokenSubMobile.textContent = subValue;
        tokenSubPill.classList.remove('hidden');
        tokenSubPillMobile.classList.remove('hidden');
      } else {
        tokenSubPill.classList.add('hidden');
        tokenSubPillMobile.classList.add('hidden');
      }
      
      // Show issuer if present
      if (payload.iss) {
        const issValue = payload.iss.length > 20 ? payload.iss.substring(0, 20) + '...' : payload.iss;
        tokenIss.textContent = payload.iss;
        tokenIssMobile.textContent = issValue;
        tokenIssPill.classList.remove('hidden');
        tokenIssPillMobile.classList.remove('hidden');
      } else {
        tokenIssPill.classList.add('hidden');
        tokenIssPillMobile.classList.add('hidden');
      }
      
      // Show token info since token is valid and header/payload are properly populated
      showTokenInfo();
      
    } catch (e) {
      showDecodeError(`Error decoding JWT: ${e.message}`);
      // Hide token info on error
      hideTokenInfo();
    }
  }
  
  // Verification functionality (basic structure - full crypto implementation would need external libraries)
  function verifySignature() {
    const token = jwtInput.value.trim();
    if (!token) {
      showVerifyResult(false, 'No token to verify');
      return;
    }
    
    const keyType = document.querySelector('input[name="keyType"]:checked').value;
    const key = verifyKey.value.trim();
    
    if (!key) {
      showVerifyResult(false, 'Please provide a key for verification');
      return;
    }
    
    // Note: This is a simplified verification - real implementation would need crypto libraries
    showVerifyResult(false, 'Signature verification requires additional cryptographic libraries. This is a demonstration interface.');
  }
  
  function showVerifyResult(isValid, message) {
    verifyResult.classList.remove('hidden');
    
    if (isValid) {
      verifyResult.className = 'p-3 rounded border bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-600 text-green-700 dark:text-green-400';
      verifyResult.innerHTML = `<div class="flex items-center gap-2"><span>✅</span><span class="font-medium">Signature Valid</span></div><p class="text-sm mt-1">${message}</p>`;
    } else {
      verifyResult.className = 'p-3 rounded border bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-600 text-red-700 dark:text-red-400';
      verifyResult.innerHTML = `<div class="flex items-center gap-2"><span>❌</span><span class="font-medium">Signature Invalid</span></div><p class="text-sm mt-1">${message}</p>`;
    }
  }
  
  // Encode Functionality
  function validateJSON(input, validationDiv, iconEl, textEl) {
    const value = input.value.trim();
    
    // Ensure validation div is visible
    validationDiv.classList.remove('hidden');
    
    if (!value) {
      validationDiv.className = 'flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
      iconEl.textContent = '⚪';
      textEl.textContent = 'Empty';
      input.className = input.className.replace(/border-red-500|border-green-500/g, 'border-gray-300 dark:border-gray-600');
      return { valid: false, json: null };
    }
    
    try {
      const parsed = JSON.parse(value);
      validationDiv.className = 'flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      iconEl.textContent = '✅';
      textEl.textContent = 'Valid JSON';
      input.className = input.className.replace(/border-red-500|border-gray-300 dark:border-gray-600/g, 'border-green-500');
      return { valid: true, json: parsed };
    } catch (e) {
      validationDiv.className = 'flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      iconEl.textContent = '❌';
      textEl.textContent = 'Invalid JSON';
      input.className = input.className.replace(/border-green-500|border-gray-300 dark:border-gray-600/g, 'border-red-500');
      return { valid: false, json: null, error: e.message };
    }
  }
  
  function updateSigningSection(algorithm) {
    if (algorithm === 'none') {
      noSignatureMessage.classList.remove('hidden');
      secretKeySection.classList.add('hidden');
      privateKeySection.classList.add('hidden');
    } else if (algorithm && (algorithm.startsWith('HS'))) {
      // HMAC algorithms
      noSignatureMessage.classList.add('hidden');
      secretKeySection.classList.remove('hidden');
      privateKeySection.classList.add('hidden');
    } else if (algorithm && (algorithm.startsWith('RS') || algorithm.startsWith('ES') || algorithm.startsWith('PS'))) {
      // RSA/ECDSA/PSS algorithms
      noSignatureMessage.classList.add('hidden');
      secretKeySection.classList.add('hidden');
      privateKeySection.classList.remove('hidden');
    } else {
      // Unknown or missing algorithm
      noSignatureMessage.classList.add('hidden');
      secretKeySection.classList.remove('hidden');
      privateKeySection.classList.add('hidden');
    }
  }
  
  function validateEncodeInputs() {
    const headerResult = validateJSON(encodeHeader, headerValidation, headerValidationIcon, headerValidationText);
    const payloadResult = validateJSON(encodePayload, payloadValidation, payloadValidationIcon, payloadValidationText);
    
    // Update signing section based on algorithm
    if (headerResult.valid && headerResult.json.alg) {
      updateSigningSection(headerResult.json.alg);
    }
    
    generateToken(headerResult, payloadResult);
  }
  
  function generateToken(headerResult, payloadResult) {
    const errors = [];
    
    // Hide all output states first
    tokenPlaceholder.classList.add('hidden');
    tokenErrors.classList.add('hidden');
    tokenSuccess.classList.add('hidden');
    if (encodeTokenDisplay) {
      encodeTokenDisplay.classList.add('hidden');
    }
    
    // Reset mobile preview
    if (mobileTokenSuccess && mobileTokenPlaceholder) {
      mobileTokenSuccess.classList.add('hidden');
      mobileTokenPlaceholder.classList.remove('hidden');
    }
    
    if (!headerResult.valid) {
      errors.push('Header must be valid JSON');
    }
    
    if (!payloadResult.valid) {
      errors.push('Payload must be valid JSON');
    }
    
    if (!headerResult.valid || !payloadResult.valid) {
      if (errors.length > 0) {
        tokenErrorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
        tokenErrors.classList.remove('hidden');
      } else {
        tokenPlaceholder.classList.remove('hidden');
      }
      return;
    }
    
    const header = headerResult.json;
    const payload = payloadResult.json;
    const algorithm = header.alg;
    
    // Check algorithm requirements
    if (algorithm === 'none') {
      // No signature needed
      const headerB64 = base64UrlEncode(JSON.stringify(header));
      const payloadB64 = base64UrlEncode(JSON.stringify(payload));
      const token = `${headerB64}.${payloadB64}.`;
      
      showGeneratedToken(token);
    } else if (algorithm && algorithm.startsWith('HS')) {
      // HMAC algorithms - generate token with or without secret
      const headerB64 = base64UrlEncode(JSON.stringify(header));
      const payloadB64 = base64UrlEncode(JSON.stringify(payload));
      
      const secret = encodeSecret.value.trim();
      let signature;
      if (secret) {
        // Note: This is a simplified implementation - real HMAC would need crypto libraries
        signature = base64UrlEncode(`mock_signature_${algorithm}_${secret.substring(0, 8)}`);
      } else {
        // Generate token with placeholder signature when secret is missing
        signature = base64UrlEncode(`placeholder_signature_${algorithm}`);
      }
      
      const token = `${headerB64}.${payloadB64}.${signature}`;
      showGeneratedToken(token);
    } else if (algorithm && (algorithm.startsWith('RS') || algorithm.startsWith('ES') || algorithm.startsWith('PS'))) {
      // RSA/ECDSA/PSS algorithms - need private key
      const privateKey = encodePrivateKey.value.trim();
      if (!privateKey) {
        errors.push('Private key is required for RSA/ECDSA algorithms');
        tokenErrorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
        tokenErrors.classList.remove('hidden');
        if (encodeTokenDisplay) {
          encodeTokenDisplay.classList.add('hidden');
        }
        // Keep mobile preview in placeholder state when there's an error
        if (mobileTokenSuccess && mobileTokenPlaceholder) {
          mobileTokenSuccess.classList.add('hidden');
          mobileTokenPlaceholder.classList.remove('hidden');
        }
        return;
      }
      
      // Note: This is a simplified implementation - real RSA would need crypto libraries
      const headerB64 = base64UrlEncode(JSON.stringify(header));
      const payloadB64 = base64UrlEncode(JSON.stringify(payload));
      const signature = base64UrlEncode(`mock_signature_${algorithm}_${privateKey.substring(0, 20).replace(/\s/g, '')}`);
      const token = `${headerB64}.${payloadB64}.${signature}`;
      
      showGeneratedToken(token);
    } else {
      errors.push(`Unsupported or missing algorithm: ${algorithm || 'none specified'}`);
      tokenErrorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
      tokenErrors.classList.remove('hidden');
      if (encodeTokenDisplay) {
        encodeTokenDisplay.classList.add('hidden');
      }
      // Keep mobile preview in placeholder state when there's an error
      if (mobileTokenSuccess && mobileTokenPlaceholder) {
        mobileTokenSuccess.classList.add('hidden');
        mobileTokenPlaceholder.classList.remove('hidden');
      }
    }
  }
  
  function showGeneratedToken(token) {
    // Update desktop token display
    if (generatedToken && tokenSuccess) {
      generatedToken.textContent = token;
      tokenSuccess.classList.remove('hidden');
    }
    
    // Update mobile token preview
    if (mobileGeneratedToken && mobileTokenPlaceholder && mobileTokenSuccess) {
      mobileGeneratedToken.textContent = token;
      mobileTokenPlaceholder.classList.add('hidden');
      mobileTokenSuccess.classList.remove('hidden');
    }
    
    // Decode and display token info
    try {
      const parts = token.split('.');
      if (parts.length >= 2) {
        // Decode header
        const headerJson = base64UrlDecode(parts[0]);
        const header = JSON.parse(headerJson);
        encodeJwtHeader.textContent = JSON.stringify(header, null, 2);
        
        // Decode payload
        const payloadJson = base64UrlDecode(parts[1]);
        const payload = JSON.parse(payloadJson);
        encodeJwtPayload.textContent = JSON.stringify(payload, null, 2);
        
        // Display token info (both desktop and mobile)
        const algValue = header.alg || 'N/A';
        const typValue = header.typ || 'JWT';
        
        encodeTokenAlg.textContent = algValue;
        encodeTokenTyp.textContent = typValue;
        encodeTokenAlgMobile.textContent = algValue;
        encodeTokenTypMobile.textContent = typValue;
        
        // Show issued at if present
        if (payload.iat) {
          const iatTime = formatTimestamp(payload.iat);
          encodeTokenIat.textContent = iatTime;
          encodeTokenIatMobile.textContent = iatTime;
          encodeTokenIatPill.classList.remove('hidden');
          encodeTokenIatPillMobile.classList.remove('hidden');
        } else {
          encodeTokenIatPill.classList.add('hidden');
          encodeTokenIatPillMobile.classList.add('hidden');
        }
        
        // Show expiration if present
        if (payload.exp) {
          const expTime = formatTimestamp(payload.exp);
          const remaining = getTimeRemaining(payload.exp);
          
          encodeTokenExp.textContent = expTime;
          encodeTokenExpMobile.textContent = expTime;
          
          if (remaining.expired) {
            const expiredClass = 'px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            const expiredPillClass = 'px-3 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg border-l-4 border-l-red-500';
            const expiredPillMobileClass = 'flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded text-sm';
            
            encodeTokenExpStatus.textContent = 'Expired';
            encodeTokenExpStatusMobile.textContent = 'Expired';
            encodeTokenExpStatus.className = expiredClass + ' inline-block';
            encodeTokenExpStatusMobile.className = expiredClass + ' ml-1';
            encodeTokenExpPill.className = expiredPillClass;
            encodeTokenExpPillMobile.className = expiredPillMobileClass;
          } else {
            const validClass = 'px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            const validPillClass = 'px-3 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg border-l-4 border-l-green-500';
            const validPillMobileClass = 'flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-sm';
            
            encodeTokenExpStatus.textContent = remaining.text;
            encodeTokenExpStatusMobile.textContent = remaining.text;
            encodeTokenExpStatus.className = validClass + ' inline-block';
            encodeTokenExpStatusMobile.className = validClass + ' ml-1';
            encodeTokenExpPill.className = validPillClass;
            encodeTokenExpPillMobile.className = validPillMobileClass;
          }
          
          encodeTokenExpPill.classList.remove('hidden');
          encodeTokenExpPillMobile.classList.remove('hidden');
        } else {
          encodeTokenExpPill.classList.add('hidden');
          encodeTokenExpPillMobile.classList.add('hidden');
        }
        
        // Show subject if present
        if (payload.sub) {
          const subValue = payload.sub.length > 20 ? payload.sub.substring(0, 20) + '...' : payload.sub;
          encodeTokenSub.textContent = payload.sub;
          encodeTokenSubMobile.textContent = subValue;
          encodeTokenSubPill.classList.remove('hidden');
          encodeTokenSubPillMobile.classList.remove('hidden');
        } else {
          encodeTokenSubPill.classList.add('hidden');
          encodeTokenSubPillMobile.classList.add('hidden');
        }
        
        // Show issuer if present
        if (payload.iss) {
          const issValue = payload.iss.length > 20 ? payload.iss.substring(0, 20) + '...' : payload.iss;
          encodeTokenIss.textContent = payload.iss;
          encodeTokenIssMobile.textContent = issValue;
          encodeTokenIssPill.classList.remove('hidden');
          encodeTokenIssPillMobile.classList.remove('hidden');
        } else {
          encodeTokenIssPill.classList.add('hidden');
          encodeTokenIssPillMobile.classList.add('hidden');
        }
        
        // Show token display container
        if (encodeTokenDisplay) {
          encodeTokenDisplay.classList.remove('hidden');
        }
        // Show token info on desktop (lg screens and up) - flexbox will handle layout
        if (encodeTokenInfo) {
          encodeTokenInfo.classList.remove('hidden');
        }
        // Show token info on mobile
        if (encodeTokenInfoMobile) {
          encodeTokenInfoMobile.classList.remove('hidden');
        }
      }
    } catch (e) {
      // If decoding fails, just hide the display
      if (encodeTokenDisplay) {
        encodeTokenDisplay.classList.add('hidden');
      }
    }
  }
  
  // Copy functionality
  function copyToken() {
    const token = generatedToken.textContent;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(token).then(() => {
        const originalText = copyTokenBtn.textContent;
        copyTokenBtn.textContent = '✅ Copied!';
        setTimeout(() => {
          copyTokenBtn.textContent = originalText;
        }, 2000);
      }).catch(() => {
        fallbackCopy(token);
      });
    } else {
      fallbackCopy(token);
    }
  }
  
  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      const originalText = copyTokenBtn.textContent;
      copyTokenBtn.textContent = '✅ Copied!';
      setTimeout(() => {
        copyTokenBtn.textContent = originalText;
      }, 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
    document.body.removeChild(textArea);
  }
  
  // Event Listeners
  decodeModeBtn.addEventListener('click', switchToDecodeMode);
  encodeModeBtn.addEventListener('click', switchToEncodeMode);
  
  // Decode mode events
  jwtInput.addEventListener('input', () => {
    const token = jwtInput.value.trim();
    
    // Immediately hide token info if input is empty
    if (!token) {
      hideTokenInfo();
      jwtHeader.textContent = '';
      jwtPayload.textContent = '';
      // Clear token info values
      tokenAlg.textContent = '';
      tokenTyp.textContent = '';
      tokenAlgMobile.textContent = '';
      tokenTypMobile.textContent = '';
      hideDecodeError();
    }
    
    clearTimeout(jwtInput.decodeTimeout);
    jwtInput.decodeTimeout = setTimeout(decodeJWT, 300);
  });
  
  // Verification toggle
  verifyToggle.addEventListener('click', () => {
    verifyExpanded = !verifyExpanded;
    if (verifyExpanded) {
      verifyContent.classList.remove('hidden');
      verifyChevron.style.transform = 'rotate(180deg)';
    } else {
      verifyContent.classList.add('hidden');
      verifyChevron.style.transform = 'rotate(0deg)';
    }
  });
  
  // Verification key type change
  document.querySelectorAll('input[name="keyType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const keyType = e.target.value;
      switch (keyType) {
        case 'secret':
          verifyKeyLabel.textContent = 'Secret Key';
          verifyKey.placeholder = 'Enter your secret key...';
          break;
        case 'pem':
          verifyKeyLabel.textContent = 'Public Key (PEM format)';
          verifyKey.placeholder = '-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----';
          break;
        case 'jwk':
          verifyKeyLabel.textContent = 'JSON Web Key';
          verifyKey.placeholder = '{"kty":"RSA","use":"sig",...}';
          break;
      }
    });
  });
  
  verifyBtn.addEventListener('click', verifySignature);
  
  // Encode mode events
  encodeHeader.addEventListener('input', () => {
    clearTimeout(encodeHeader.validateTimeout);
    encodeHeader.validateTimeout = setTimeout(validateEncodeInputs, 300);
  });
  
  encodePayload.addEventListener('input', () => {
    clearTimeout(encodePayload.validateTimeout);
    encodePayload.validateTimeout = setTimeout(validateEncodeInputs, 300);
  });
  
  encodeSecret.addEventListener('input', () => {
    clearTimeout(encodeSecret.generateTimeout);
    encodeSecret.generateTimeout = setTimeout(validateEncodeInputs, 300);
  });
  
  encodePrivateKey.addEventListener('input', () => {
    clearTimeout(encodePrivateKey.generateTimeout);
    encodePrivateKey.generateTimeout = setTimeout(validateEncodeInputs, 300);
  });
  
  // Private key type change
  document.querySelectorAll('input[name="privateKeyType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const keyType = e.target.value;
      if (keyType === 'pem') {
        privateKeyLabel.innerHTML = 'Private Key (PEM format) <span class="text-red-500">*</span>';
        encodePrivateKey.placeholder = '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----';
      } else if (keyType === 'jwk') {
        privateKeyLabel.innerHTML = 'JSON Web Key (JWK format) <span class="text-red-500">*</span>';
        encodePrivateKey.placeholder = '{"kty":"RSA","use":"sig",...}';
      }
    });
  });
  
  copyTokenBtn.addEventListener('click', copyToken);
  
  // Initialize - ensure validation runs after DOM is fully ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Trigger validation for encode mode inputs to show initial state
      validateEncodeInputs();
    });
  } else {
    // DOM is already ready, but use setTimeout to ensure UI updates properly
    setTimeout(() => {
      validateEncodeInputs();
    }, 0);
  }
  
  // Auto-decode the example token on page load if in decode mode
  if (jwtInput.value.trim()) {
    decodeJWT();
  }
})();