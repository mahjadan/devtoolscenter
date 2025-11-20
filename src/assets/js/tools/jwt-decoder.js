// JWT Encoder/Decoder Tool
import * as jose from 'https://cdn.jsdelivr.net/npm/jose@6.1.2/+esm';

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
const encodeSecretKey = document.getElementById('encode-secret-key');
const secretTextInput = document.getElementById('secret-text-input');
const secretPemJwkInput = document.getElementById('secret-pem-jwk-input');
const secretKeyLabel = document.getElementById('secret-key-label');
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

// Verification functionality - actual cryptographic signature verification
async function verifySignature() {
  const token = jwtInput.value.trim();
  if (!token) {
    showVerifyResult(false, 'No token to verify');
    return;
  }

  // Show loading state
  const verifyBtn = document.getElementById('verify-btn');
  const originalBtnText = verifyBtn ? verifyBtn.textContent : '';
  if (verifyBtn) {
    verifyBtn.disabled = true;
    verifyBtn.textContent = 'Verifying...';
  }

  try {
    // Parse token
    let header, algorithm, parts;
    try {
      parts = token.split('.');
      if (parts.length < 2) {
        showVerifyResult(false, 'This is not a valid JWT, the header and payload must be base64url encoded.');
        return;
      }
      const headerJson = base64UrlDecode(parts[0]);
      header = JSON.parse(headerJson);
      algorithm = header.alg;
    } catch (e) {
      showVerifyResult(false, `This is not a valid JWT, the header and payload must be base64url encoded. Error: ${e.message}`);
      return;
    }

    // Check for alg: none
    if (algorithm === 'none') {
      if (parts.length === 3 && parts[2] === '') {
        showVerifyResult(false, "This token uses 'alg': 'none', which means it is not signed, never trust this token for authentication or authorization.");
        return;
      }
    }

    // Check if alg is missing
    if (!algorithm) {
      showVerifyResult(false, "The header does not contain an 'alg' field, this is unusual for standard JWTs.");
      return;
    }

    const keyType = document.querySelector('input[name="keyType"]:checked')?.value || 'secret';
    const key = verifyKey.value.trim();

    if (!key) {
      showVerifyResult(false, 'Please provide a key for verification');
      return;
    }

    let cryptoKey;
    let verificationOptions = {
      algorithms: [algorithm]
    };

    // Import key based on type
    if (keyType === 'secret') {
      // Secret key for HMAC
      if (!algorithm || !algorithm.startsWith('HS')) {
        const suggestedFormat = algorithm && (algorithm.startsWith('RS') || algorithm.startsWith('PS'))
          ? 'PEM (Public Key) or JWK (RSA)'
          : algorithm && algorithm.startsWith('ES')
            ? 'PEM (Public Key) or JWK (EC)'
            : 'the appropriate key format';
        showVerifyResult(false, `Secret key is only valid for HMAC algorithms (HS256, HS384, HS512). This token uses ${algorithm || 'unknown'} algorithm. For ${algorithm || 'this algorithm'}, use ${suggestedFormat}.`);
        return;
      }

      // Convert text secret to Uint8Array
      // Convert text secret to Uint8Array
      const encoder = new TextEncoder();
      const secretBytes = encoder.encode(key);
      // For HMAC, we can pass the Uint8Array directly to jose functions
      cryptoKey = secretBytes;

    } else if (keyType === 'pem') {
      // PEM verification
      const pemPattern = /-----BEGIN .+ KEY-----[\s\S]*-----END .+ KEY-----/;
      if (!pemPattern.test(key)) {
        showVerifyResult(false, 'Invalid PEM format. PEM keys should start with "-----BEGIN" and end with "-----END".');
        return;
      }

      // Detect key type
      const isPublicKey = /BEGIN PUBLIC KEY/.test(key);
      const isPrivateKey = /BEGIN (RSA )?PRIVATE KEY|BEGIN EC PRIVATE KEY/.test(key);
      const isRSA = /RSA|BEGIN (PUBLIC|PRIVATE) KEY/.test(key);
      const isEC = /EC PRIVATE KEY|BEGIN (PUBLIC|PRIVATE) KEY.*EC/.test(key);

      if (algorithm && algorithm.startsWith('HS')) {
        showVerifyResult(false, `The token uses an HMAC algorithm '${algorithm}', which expects a shared secret, PEM keys are used for RSA or EC algorithms, use the original HMAC secret instead.`);
        return;
      } else if ((algorithm && (algorithm.startsWith('RS') || algorithm.startsWith('PS'))) && !isRSA) {
        showVerifyResult(false, `The token uses algorithm '${algorithm}', which is an RSA algorithm, you must verify it with an RSA PEM key.`);
        return;
      } else if (algorithm && algorithm.startsWith('ES') && !isEC) {
        showVerifyResult(false, `The token uses algorithm '${algorithm}', which is an EC algorithm, you must verify it with an EC PEM key.`);
        return;
      }

      // Import PEM key
      try {
        if (isPublicKey) {
          cryptoKey = await jose.importSPKI(key, algorithm);
        } else if (isPrivateKey) {
          // For verification, we can use private key, but typically public key is used
          cryptoKey = await jose.importPKCS8(key, algorithm);
        } else {
          showVerifyResult(false, 'Could not determine if this is a public or private key PEM.');
          return;
        }
      } catch (e) {
        showVerifyResult(false, `Failed to import PEM key: ${e.message}. Please check that the PEM format is correct.`);
        return;
      }

    } else if (keyType === 'jwk') {
      // JWK verification
      let jwk;
      try {
        jwk = JSON.parse(key);
      } catch (e) {
        showVerifyResult(false, `JWK is not valid JSON, please paste a valid JWK object. Error: ${e.message}`);
        return;
      }

      if (!jwk.kty) {
        showVerifyResult(false, 'Invalid JWK format. JWK must have a "kty" (key type) property.');
        return;
      }

      // Check algorithm compatibility
      if (algorithm && algorithm.startsWith('HS')) {
        if (jwk.kty !== 'oct') {
          showVerifyResult(false, `The token uses algorithm '${algorithm}', which is an HMAC algorithm, to verify it you must use a symmetric JWK with 'kty': 'oct' and a 'k' secret.`);
          return;
        }
        if (!jwk.k) {
          showVerifyResult(false, `The token uses algorithm '${algorithm}', which is an HMAC algorithm, to verify it you must use a symmetric JWK with 'kty': 'oct' and a 'k' secret.`);
          return;
        }
      } else if (algorithm && (algorithm.startsWith('RS') || algorithm.startsWith('PS'))) {
        if (jwk.kty !== 'RSA') {
          showVerifyResult(false, `The token uses algorithm '${algorithm}', which is an RSA algorithm, to verify it you must use an RSA JWK with 'kty': 'RSA'.`);
          return;
        }
        if (!jwk.n || !jwk.e) {
          showVerifyResult(false, `The RSA JWK is incomplete, it must contain 'n' and 'e' fields for verification.`);
          return;
        }
      } else if (algorithm && algorithm.startsWith('ES')) {
        if (jwk.kty !== 'EC') {
          showVerifyResult(false, `The token uses algorithm '${algorithm}', which is an EC algorithm, to verify it you must use an EC JWK with 'kty': 'EC'.`);
          return;
        }
        if (!jwk.crv || !jwk.x || !jwk.y) {
          showVerifyResult(false, `The EC JWK is incomplete, it must contain 'crv', 'x', and 'y' fields for verification.`);
          return;
        }

        // Check curve/algorithm match
        const curveAlgMap = {
          'P-256': 'ES256',
          'P-384': 'ES384',
          'P-521': 'ES512'
        };
        const expectedAlg = curveAlgMap[jwk.crv];
        if (expectedAlg && algorithm !== expectedAlg) {
          showVerifyResult(false, `The token uses algorithm '${algorithm}' but the JWK curve is '${jwk.crv}', use ES256 with P-256, ES384 with P-384, and ES512 with P-521.`);
          return;
        }

        // For verification, we only need the public key components (x, y)
        // Remove the private key (d) if present, as it's not needed for verification
        const publicJwk = {
          kty: jwk.kty,
          crv: jwk.crv,
          x: jwk.x,
          y: jwk.y
        };
        // Copy optional fields that don't affect verification
        if (jwk.kid) publicJwk.kid = jwk.kid;
        if (jwk.use) publicJwk.use = jwk.use;
        if (jwk.alg) publicJwk.alg = jwk.alg;

        // Import JWK (using public key only)
        try {
          cryptoKey = await jose.importJWK(publicJwk, algorithm);
        } catch (e) {
          const errorMsg = e.message || e.toString();
          showVerifyResult(false, `Failed to import EC JWK: ${errorMsg}. Ensure the 'x' and 'y' coordinates are valid base64url-encoded values for curve ${jwk.crv}.`);
          return;
        }
      } else if (algorithm === 'none') {
        showVerifyResult(false, "This token is unsigned (alg 'none'), there is no signature to verify, treat it as untrusted.");
        return;
      } else {
        showVerifyResult(false, `Unsupported algorithm '${algorithm || 'missing'}'.`);
        return;
      }

      // Import JWK (for HMAC and RSA - EC is handled above)
      if (!cryptoKey) {
        try {
          cryptoKey = await jose.importJWK(jwk, algorithm);
        } catch (e) {
          const errorMsg = e.message || e.toString();
          showVerifyResult(false, `Failed to import JWK: ${errorMsg}. Please check that the JWK format is correct and all required fields are present.`);
          return;
        }
      }
    }

    // Perform actual signature verification
    try {
      const { payload, protectedHeader } = await jose.jwtVerify(token, cryptoKey, verificationOptions);

      // Success - signature is valid
      showVerifyResult(true, `Signature verified successfully with the provided key. Token is valid and signed correctly.`);

    } catch (e) {
      // Verification failed
      if (e.code === 'ERR_JWT_EXPIRED') {
        showVerifyResult(false, `Signature verification failed: Token has expired. The signature may be valid, but the token is no longer valid due to expiration.`);
      } else if (e.code === 'ERR_JWT_CLAIM_VALIDATION_FAILED') {
        showVerifyResult(false, `Signature verification failed: Token claim validation failed. ${e.message}`);
      } else if (e.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
        showVerifyResult(false, 'Signature verification failed, this token was not signed with the provided key, check that you are using the correct key and algorithm.');
      } else {
        showVerifyResult(false, `Signature verification failed: ${e.message}`);
      }
    }

  } catch (e) {
    // General error
    showVerifyResult(false, `Verification error: ${e.message}`);
  } finally {
    // Restore button state
    if (verifyBtn) {
      verifyBtn.disabled = false;
      verifyBtn.textContent = originalBtnText;
    }
  }
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

// JWK Validation Helper Functions
function validateJWKForEncode(jwk, algorithm) {
  const errors = [];

  if (!jwk.kty) {
    errors.push("The JWK must contain the 'kty' field, which defines the key type like oct, RSA, or EC.");
    return { valid: false, errors };
  }

  if (jwk.kty === 'oct') {
    // HMAC - symmetric
    if (!jwk.k) {
      errors.push("This JWK is missing the 'k' field, which contains the secret key material, you cannot sign tokens without it.");
      return { valid: false, errors };
    }

    if (!algorithm || !algorithm.startsWith('HS')) {
      errors.push(`Algorithm '${algorithm || 'missing'}' is not compatible with an oct (symmetric) JWK, use HS256, HS384, or HS512 when signing with a symmetric JWK.`);
      return { valid: false, errors };
    }

    return { valid: true, errors: [] };

  } else if (jwk.kty === 'RSA') {
    // RSA
    if (!jwk.n || !jwk.e) {
      errors.push("This RSA JWK is incomplete, it must contain 'n' and 'e' fields for the public key.");
      return { valid: false, errors };
    }

    if (!jwk.d) {
      errors.push("This JWK only contains the RSA public key, signing a token requires the private part of the key, which is the 'd' field.");
      return { valid: false, errors };
    }

    const allowedAlgs = ['RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512'];
    if (!algorithm || !allowedAlgs.includes(algorithm)) {
      errors.push(`Algorithm '${algorithm || 'missing'}' is not compatible with an RSA JWK, use RS256, RS384, RS512, PS256, PS384, or PS512 when signing with RSA keys.`);
      return { valid: false, errors };
    }

    return { valid: true, errors: [] };

  } else if (jwk.kty === 'EC') {
    // ECDSA
    if (!jwk.crv || !jwk.x || !jwk.y) {
      errors.push("This EC JWK is incomplete, it must contain 'crv', 'x', and 'y' fields for the public key.");
      return { valid: false, errors };
    }

    if (!jwk.d) {
      errors.push("This JWK only contains the EC public key, signing a token requires the private part of the key, which is the 'd' field.");
      return { valid: false, errors };
    }

    if (!algorithm || !algorithm.startsWith('ES')) {
      errors.push(`Algorithm '${algorithm || 'missing'}' is not compatible with an EC JWK, use ES256, ES384, or ES512 when signing with EC keys.`);
      return { valid: false, errors };
    }

    // Check curve/algorithm match
    const curveAlgMap = {
      'P-256': 'ES256',
      'P-384': 'ES384',
      'P-521': 'ES512'
    };

    const expectedAlg = curveAlgMap[jwk.crv];
    if (expectedAlg && algorithm !== expectedAlg) {
      errors.push(`Algorithm '${algorithm}' does not match the EC curve '${jwk.crv}', use ES256 with P-256, ES384 with P-384, or ES512 with P-521.`);
      return { valid: false, errors };
    }

    return { valid: true, errors: [] };

  } else {
    errors.push(`The JWK key type '${jwk.kty}' is not supported by this tool for signing.`);
    return { valid: false, errors };
  }
}

function validatePEMForEncode(pem, algorithm) {
  const errors = [];

  // Check if it's a public key only
  const publicKeyPattern = /-----BEGIN PUBLIC KEY-----/;
  const privateKeyPattern = /-----BEGIN (RSA PRIVATE KEY|PRIVATE KEY|EC PRIVATE KEY)-----/;

  if (publicKeyPattern.test(pem) && !privateKeyPattern.test(pem)) {
    errors.push("You pasted a public key PEM, to sign a JWT you must use a private key PEM, public keys are only for verification.");
    return { valid: false, errors };
  }

  // Basic PEM format check
  const pemPattern = /-----BEGIN .+ KEY-----[\s\S]*-----END .+ KEY-----/;
  if (!pemPattern.test(pem)) {
    console.log('PEM pattern not test', pemPattern.test(pem));
    errors.push("The PEM key could not be parsed, check that you pasted a valid RSA or EC private key.");
    return { valid: false, errors };
  }

  // Detect key type
  // PKCS#1 format (legacy)
  const isPKCS1RSA = /-----BEGIN RSA PRIVATE KEY-----/.test(pem);
  const isPKCS1EC = /-----BEGIN EC PRIVATE KEY-----/.test(pem);

  // PKCS#8 format (modern) - doesn't specify key type in header
  const isPKCS8 = /-----BEGIN PRIVATE KEY-----/.test(pem);

  if (isPKCS1RSA) {
    // PKCS#1 RSA key
    const allowedAlgs = ['RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512'];
    if (!algorithm || !allowedAlgs.includes(algorithm)) {
      errors.push(`Algorithm '${algorithm || 'missing'}' is not compatible with an RSA private key, use RS256, RS384, RS512, PS256, PS384, or PS512 when signing with an RSA PEM key.`);
      return { valid: false, errors };
    }
    return { valid: true, errors: [] };
  } else if (isPKCS1EC) {
    // PKCS#1 EC key
    if (!algorithm || !algorithm.startsWith('ES')) {
      errors.push(`Algorithm '${algorithm || 'missing'}' is not compatible with an EC private key, use ES256, ES384, or ES512 when signing with an EC PEM key.`);
      return { valid: false, errors };
    }
    return { valid: true, errors: [] };
  } else if (isPKCS8) {
    // PKCS#8 format - determine type from algorithm
    // PKCS#8 can be either RSA or EC, so we validate based on algorithm
    if (algorithm && (algorithm.startsWith('RS') || algorithm.startsWith('PS'))) {
      // RSA algorithms - PKCS#8 RSA key
      return { valid: true, errors: [] };
    } else if (algorithm && algorithm.startsWith('ES')) {
      // EC algorithms - PKCS#8 EC key
      return { valid: true, errors: [] };
    } else {
      errors.push(`Algorithm '${algorithm || 'missing'}' is required. For PKCS#8 format keys, use RS256/RS384/RS512/PS256/PS384/PS512 for RSA keys, or ES256/ES384/ES512 for EC keys.`);
      return { valid: false, errors };
    }
  } else {
    errors.push("The PEM key could not be parsed, check that you pasted a valid RSA or EC private key. Supported formats: PKCS#1 (-----BEGIN RSA PRIVATE KEY----- or -----BEGIN EC PRIVATE KEY-----) or PKCS#8 (-----BEGIN PRIVATE KEY-----).");
    return { valid: false, errors };
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

async function generateToken(headerResult, payloadResult) {
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
    errors.push('Header is not valid JSON, please fix the JSON format before encoding.');
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

  // Check if alg is required
  if (!algorithm) {
    errors.push("The header must contain an 'alg' field, select a signing algorithm that matches the key you are using.");
    tokenErrorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
    tokenErrors.classList.remove('hidden');
    if (encodeTokenDisplay) {
      encodeTokenDisplay.classList.add('hidden');
    }
    if (mobileTokenSuccess && mobileTokenPlaceholder) {
      mobileTokenSuccess.classList.add('hidden');
      mobileTokenPlaceholder.classList.remove('hidden');
    }
    return;
  }

  // Auto-set typ if missing
  if (!header.typ) {
    header.typ = 'JWT';
  }

  // Check algorithm requirements
  if (algorithm === 'none') {
    // No signature needed
    const headerB64 = base64UrlEncode(JSON.stringify(header));
    const payloadB64 = base64UrlEncode(JSON.stringify(payload));
    const token = `${headerB64}.${payloadB64}.`;

    showGeneratedToken(token);
  } else if (algorithm && algorithm.startsWith('HS')) {
    // HMAC algorithms
    // Get the selected key type
    const secretKeyType = document.querySelector('input[name="secretKeyType"]:checked')?.value || 'text';

    // Validate based on key type
    if (secretKeyType === 'text') {
      // Text secret - sign with actual HMAC
      const secret = encodeSecret ? encodeSecret.value.trim() : '';
      if (!secret) {
        // Show placeholder if no secret
        const headerB64 = base64UrlEncode(JSON.stringify(header));
        const payloadB64 = base64UrlEncode(JSON.stringify(payload));
        const signature = base64UrlEncode(`placeholder_signature_${algorithm}`);
        const token = `${headerB64}.${payloadB64}.${signature}`;
        showGeneratedToken(token);
        return;
      }

      try {
        // Import secret key and sign
        const encoder = new TextEncoder();
        const secretBytes = encoder.encode(secret);
        // For HMAC, we can pass the Uint8Array directly to jose functions
        const key = secretBytes;

        const token = await new jose.SignJWT(payload)
          .setProtectedHeader(header)
          .sign(key);

        showGeneratedToken(token);
      } catch (e) {
        errors.push(`Failed to sign token: ${e.message}`);
        tokenErrorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
        tokenErrors.classList.remove('hidden');
        if (encodeTokenDisplay) {
          encodeTokenDisplay.classList.add('hidden');
        }
        if (mobileTokenSuccess && mobileTokenPlaceholder) {
          mobileTokenSuccess.classList.add('hidden');
          mobileTokenPlaceholder.classList.remove('hidden');
        }
      }
    } else if (secretKeyType === 'pem') {
      // PEM for HMAC - not allowed per spec
      errors.push(`PEM format is not compatible with ${algorithm} (HMAC) algorithm. For HMAC algorithms, use the "HMAC (Text)" option with a text secret key, or use JWK format with "kty":"oct" for symmetric keys.`);
      tokenErrorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
      tokenErrors.classList.remove('hidden');
      if (encodeTokenDisplay) {
        encodeTokenDisplay.classList.add('hidden');
      }
      if (mobileTokenSuccess && mobileTokenPlaceholder) {
        mobileTokenSuccess.classList.add('hidden');
        mobileTokenPlaceholder.classList.remove('hidden');
      }
      return;
    } else if (secretKeyType === 'jwk') {
      // JWK for HMAC
      const jwkText = encodeSecretKey ? encodeSecretKey.value.trim() : '';
      if (!jwkText) {
        errors.push('JWK is required for signing');
        tokenErrorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
        tokenErrors.classList.remove('hidden');
        if (encodeTokenDisplay) {
          encodeTokenDisplay.classList.add('hidden');
        }
        if (mobileTokenSuccess && mobileTokenPlaceholder) {
          mobileTokenSuccess.classList.add('hidden');
          mobileTokenPlaceholder.classList.remove('hidden');
        }
        return;
      }

      try {
        const jwk = JSON.parse(jwkText);
        const validation = validateJWKForEncode(jwk, algorithm);
        if (!validation.valid) {
          errors.push(...validation.errors);
          tokenErrorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
          tokenErrors.classList.remove('hidden');
          if (encodeTokenDisplay) {
            encodeTokenDisplay.classList.add('hidden');
          }
          if (mobileTokenSuccess && mobileTokenPlaceholder) {
            mobileTokenSuccess.classList.add('hidden');
            mobileTokenPlaceholder.classList.remove('hidden');
          }
          return;
        }

        // Valid JWK - sign token
        try {
          const key = await jose.importJWK(jwk, algorithm);
          const token = await new jose.SignJWT(payload)
            .setProtectedHeader(header)
            .sign(key);

          showGeneratedToken(token);
        } catch (e) {
          errors.push(`Failed to sign token with JWK: ${e.message}`);
          tokenErrorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
          tokenErrors.classList.remove('hidden');
          if (encodeTokenDisplay) {
            encodeTokenDisplay.classList.add('hidden');
          }
          if (mobileTokenSuccess && mobileTokenPlaceholder) {
            mobileTokenSuccess.classList.add('hidden');
            mobileTokenPlaceholder.classList.remove('hidden');
          }
        }
      } catch (e) {
        errors.push('JWK is not valid JSON, please paste a valid JWK object.');
        tokenErrorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
        tokenErrors.classList.remove('hidden');
        if (encodeTokenDisplay) {
          encodeTokenDisplay.classList.add('hidden');
        }
        if (mobileTokenSuccess && mobileTokenPlaceholder) {
          mobileTokenSuccess.classList.add('hidden');
          mobileTokenPlaceholder.classList.remove('hidden');
        }
        return;
      }
    }

  } else if (algorithm && (algorithm.startsWith('RS') || algorithm.startsWith('ES') || algorithm.startsWith('PS'))) {
    // RSA/ECDSA/PSS algorithms
    const privateKeyType = document.querySelector('input[name="privateKeyType"]:checked')?.value || 'pem';
    const privateKey = encodePrivateKey ? encodePrivateKey.value.trim() : '';

    if (!privateKey) {
      errors.push('Private key is required for RSA/ECDSA algorithms');
      tokenErrorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
      tokenErrors.classList.remove('hidden');
      if (encodeTokenDisplay) {
        encodeTokenDisplay.classList.add('hidden');
      }
      if (mobileTokenSuccess && mobileTokenPlaceholder) {
        mobileTokenSuccess.classList.add('hidden');
        mobileTokenPlaceholder.classList.remove('hidden');
      }
      return;
    }

    // Validate based on key type
    if (privateKeyType === 'pem') {
      const validation = validatePEMForEncode(privateKey, algorithm);
      if (!validation.valid) {
        errors.push(...validation.errors);
        tokenErrorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
        tokenErrors.classList.remove('hidden');
        if (encodeTokenDisplay) {
          encodeTokenDisplay.classList.add('hidden');
        }
        if (mobileTokenSuccess && mobileTokenPlaceholder) {
          mobileTokenSuccess.classList.add('hidden');
          mobileTokenPlaceholder.classList.remove('hidden');
        }
        return;
      }
    } else if (privateKeyType === 'jwk') {
      try {
        const jwk = JSON.parse(privateKey);
        const validation = validateJWKForEncode(jwk, algorithm);
        if (!validation.valid) {
          errors.push(...validation.errors);
          tokenErrorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
          tokenErrors.classList.remove('hidden');
          if (encodeTokenDisplay) {
            encodeTokenDisplay.classList.add('hidden');
          }
          if (mobileTokenSuccess && mobileTokenPlaceholder) {
            mobileTokenSuccess.classList.add('hidden');
            mobileTokenPlaceholder.classList.remove('hidden');
          }
          return;
        }
      } catch (e) {
        errors.push('JWK is not valid JSON, please paste a valid JWK object.');
        tokenErrorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
        tokenErrors.classList.remove('hidden');
        if (encodeTokenDisplay) {
          encodeTokenDisplay.classList.add('hidden');
        }
        if (mobileTokenSuccess && mobileTokenPlaceholder) {
          mobileTokenSuccess.classList.add('hidden');
          mobileTokenPlaceholder.classList.remove('hidden');
        }
        return;
      }
    }

    // Valid key - sign token
    try {
      let key;

      if (privateKeyType === 'pem') {
        // Import PEM private key
        const isPrivateKey = /BEGIN (RSA )?PRIVATE KEY|BEGIN EC PRIVATE KEY/.test(privateKey);
        if (!isPrivateKey) {
          errors.push('PEM key must be a private key for signing. Public keys are used for verification only.');
          tokenErrorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
          tokenErrors.classList.remove('hidden');
          if (encodeTokenDisplay) {
            encodeTokenDisplay.classList.add('hidden');
          }
          if (mobileTokenSuccess && mobileTokenPlaceholder) {
            mobileTokenSuccess.classList.add('hidden');
            mobileTokenPlaceholder.classList.remove('hidden');
          }
          return;
        }

        // Import PKCS8 private key
        key = await jose.importPKCS8(privateKey, algorithm);
      } else if (privateKeyType === 'jwk') {
        // Import JWK private key
        const jwk = JSON.parse(privateKey);
        key = await jose.importJWK(jwk, algorithm);
      }

      // Sign the token
      const token = await new jose.SignJWT(payload)
        .setProtectedHeader(header)
        .sign(key);

      showGeneratedToken(token);
    } catch (e) {
      errors.push(`Failed to sign token: ${e.message}`);
      tokenErrorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
      tokenErrors.classList.remove('hidden');
      if (encodeTokenDisplay) {
        encodeTokenDisplay.classList.add('hidden');
      }
      if (mobileTokenSuccess && mobileTokenPlaceholder) {
        mobileTokenSuccess.classList.add('hidden');
        mobileTokenPlaceholder.classList.remove('hidden');
      }
    }
  } else {
    errors.push(`Unsupported or missing algorithm: ${algorithm || 'none specified'}`);
    tokenErrorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
    tokenErrors.classList.remove('hidden');
    if (encodeTokenDisplay) {
      encodeTokenDisplay.classList.add('hidden');
    }
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

// Secret key type change (for HMAC)
document.querySelectorAll('input[name="secretKeyType"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    const keyType = e.target.value;
    if (keyType === 'text') {
      // Show text input, hide textarea
      if (secretTextInput) secretTextInput.classList.remove('hidden');
      if (secretPemJwkInput) secretPemJwkInput.classList.add('hidden');
    } else {
      // Show textarea, hide text input
      if (secretTextInput) secretTextInput.classList.add('hidden');
      if (secretPemJwkInput) secretPemJwkInput.classList.remove('hidden');

      // Update label and placeholder based on type
      if (secretKeyLabel) {
        if (keyType === 'pem') {
          secretKeyLabel.innerHTML = 'Secret Key (PEM format) <span class="text-red-500">*</span>';
          if (encodeSecretKey) {
            encodeSecretKey.placeholder = '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----';
          }
        } else if (keyType === 'jwk') {
          secretKeyLabel.innerHTML = 'Secret Key (JWK format) <span class="text-red-500">*</span>';
          if (encodeSecretKey) {
            encodeSecretKey.placeholder = '{"kty":"oct","k":"base64url-encoded-secret"}';
          }
        }
      }
    }
    // Trigger validation after switching
    validateEncodeInputs();
  });
});

// Secret key textarea input (for PEM/JWK)
if (encodeSecretKey) {
  encodeSecretKey.addEventListener('input', () => {
    clearTimeout(encodeSecretKey.generateTimeout);
    encodeSecretKey.generateTimeout = setTimeout(validateEncodeInputs, 300);
  });
}

encodePrivateKey.addEventListener('input', () => {
  clearTimeout(encodePrivateKey.generateTimeout);
  encodePrivateKey.generateTimeout = setTimeout(validateEncodeInputs, 300);
});

// Private key type change
document.querySelectorAll('input[name="privateKeyType"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    const keyType = e.target.value;
    if (keyType === 'pem') {
      if (privateKeyLabel) {
        privateKeyLabel.innerHTML = 'Private Key (PEM format) <span class="text-red-500">*</span>';
      }
      if (encodePrivateKey) {
        encodePrivateKey.placeholder = '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----';
      }
    } else if (keyType === 'jwk') {
      if (privateKeyLabel) {
        privateKeyLabel.innerHTML = 'JSON Web Key (JWK format) <span class="text-red-500">*</span>';
      }
      if (encodePrivateKey) {
        encodePrivateKey.placeholder = '{"kty":"RSA","use":"sig",...}';
      }
    }
    // Trigger validation after switching
    validateEncodeInputs();
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