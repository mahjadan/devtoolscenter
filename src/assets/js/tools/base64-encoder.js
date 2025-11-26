// Base64 Encoder / Decoder with Simple + Expert modes
(() => {
  const inputEl = document.getElementById('base64-input');
  const outputEl = document.getElementById('base64-output');
  const errorEl = document.getElementById('error-message');
  const errorText = errorEl?.querySelector('p');
  const statusBar = document.getElementById('status-bar');
  const pipelineText = document.getElementById('pipeline-text');
  const insightsList = document.getElementById('insights-list');
  const charsetWarning = document.getElementById('charset-warning');
  const detectedJson = document.getElementById('detected-json');
  const detectedJwt = document.getElementById('detected-jwt');
  const detectedImage = document.getElementById('detected-image');
  const detectedNone = document.getElementById('detected-none');
  const contentTypeBadge = document.getElementById('content-type-badge');
  const contentTypeText = document.getElementById('content-type-text');
  const jsonPre = detectedJson?.querySelector('pre');
  const jwtPre = detectedJwt?.querySelector('pre');
  const imagePreview = document.getElementById('image-preview');
  const showImageBtn = document.getElementById('show-image');

  const modeButtons = Array.from(document.querySelectorAll('.mode-toggle'));
  const interpretationTabs = Array.from(document.querySelectorAll('.interpretation-tab'));
  const variantChips = Array.from(document.querySelectorAll('.variant-chip'));
  const paddingToggle = document.getElementById('padding-toggle');
  const wrapToggle = document.getElementById('wrap-toggle');
  const charsetSelect = document.getElementById('charset-select');
  const expertSections = Array.from(document.querySelectorAll('.expert-only'));

  const encodeBtn = document.getElementById('encode-btn');
  const decodeBtn = document.getElementById('decode-btn');
  const copyBtn = document.getElementById('copy-btn');
  const clearBtn = document.getElementById('clear-btn');

  const state = {
    mode: 'simple',
    interpretation: 'text', // text | hex | binary
    variant: 'standard', // standard | urlsafe
    padding: true,
    wrap: false,
    charset: 'utf-8',
    lastBytes: null,
    lastBase64: '',
  };

  function setStatus(message) {
    if (statusBar) statusBar.textContent = message;
  }

  function showError(message) {
    if (!errorEl || !errorText) return;
    errorText.textContent = message;
    errorEl.classList.remove('hidden');
  }

  function hideError() {
    if (!errorEl) return;
    errorEl.classList.add('hidden');
  }

  function toggleExpertVisibility(isExpert) {
    expertSections.forEach((section) => {
      section.classList.toggle('hidden', !isExpert);
    });
    document.body.classList.toggle('expert-mode', isExpert);
  }

  function setMode(mode) {
    state.mode = mode;
    modeButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    toggleExpertVisibility(mode === 'expert');
    updatePipeline();
  }

  function setInterpretation(type) {
    state.interpretation = type;
    interpretationTabs.forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.interpretation === type);
    });
    updatePipeline();
  }

  function setVariant(variant) {
    state.variant = variant;
    variantChips.forEach((chip) => {
      chip.classList.toggle('active', chip.dataset.variant === variant);
    });
    updatePipeline();
  }

  function setPadding(on) {
    state.padding = on;
    if (paddingToggle) {
      paddingToggle.dataset.state = on ? 'on' : 'off';
      paddingToggle.textContent = on ? 'Padding on' : 'Padding off';
    }
    updatePipeline();
  }

  function setWrap(on) {
    state.wrap = on;
    if (wrapToggle) {
      wrapToggle.dataset.state = on ? 'on' : 'off';
      wrapToggle.textContent = on ? 'Wrap 76 chars' : 'No wrapping';
    }
    updatePipeline();
  }

  function setCharset(charset) {
    state.charset = charset;
    updatePipeline();
  }

  function updatePipeline() {
    if (!pipelineText) return;
    const variantLabel = state.variant === 'urlsafe' ? 'URL-safe' : 'Standard';
    const paddingLabel = state.padding ? 'padding on' : 'no padding';
    const wrapLabel = state.wrap ? 'wrap 76' : 'no wrap';
    pipelineText.textContent = `Raw bytes → [${state.charset.toUpperCase()}] → Base64 (${variantLabel}, ${paddingLabel}, ${wrapLabel})`;
  }

  function updateContentTypeBadge(type) {
    if (!contentTypeBadge || !contentTypeText) return;

    // Reset classes
    contentTypeBadge.className = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-300';

    const svgNS = 'http://www.w3.org/2000/svg';
    let icon = null;

    if (type === 'json') {
      contentTypeBadge.classList.add('border-2', 'border-primary-300', 'dark:border-primary-600', 'bg-primary-100', 'dark:bg-primary-900/40', 'text-primary-700', 'dark:text-primary-300', 'animate-pulse-once');
      contentTypeText.textContent = 'JSON';
      // Document icon
      icon = document.createElementNS(svgNS, 'svg');
      icon.setAttribute('class', 'w-3.5 h-3.5');
      icon.setAttribute('fill', 'none');
      icon.setAttribute('stroke', 'currentColor');
      icon.setAttribute('viewBox', '0 0 24 24');
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('d', 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z');
      icon.appendChild(path);
    } else if (type === 'jwt') {
      contentTypeBadge.classList.add('border-2', 'border-indigo-300', 'dark:border-indigo-600', 'bg-indigo-100', 'dark:bg-indigo-900/40', 'text-indigo-700', 'dark:text-indigo-300', 'animate-pulse-once');
      contentTypeText.textContent = 'JWT';
      // Shield icon
      icon = document.createElementNS(svgNS, 'svg');
      icon.setAttribute('class', 'w-3.5 h-3.5');
      icon.setAttribute('fill', 'none');
      icon.setAttribute('stroke', 'currentColor');
      icon.setAttribute('viewBox', '0 0 24 24');
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('d', 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z');
      icon.appendChild(path);
    } else if (type === 'image') {
      contentTypeBadge.classList.add('border-2', 'border-emerald-300', 'dark:border-emerald-600', 'bg-emerald-100', 'dark:bg-emerald-900/40', 'text-emerald-700', 'dark:text-emerald-300', 'animate-pulse-once');
      contentTypeText.textContent = 'Image';
      // Image icon
      icon = document.createElementNS(svgNS, 'svg');
      icon.setAttribute('class', 'w-3.5 h-3.5');
      icon.setAttribute('fill', 'none');
      icon.setAttribute('stroke', 'currentColor');
      icon.setAttribute('viewBox', '0 0 24 24');
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('d', 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z');
      icon.appendChild(path);
    } else {
      contentTypeBadge.classList.add('text-gray-500', 'dark:text-gray-400');
      contentTypeText.textContent = 'None';
    }

    // Clear existing icon and add new one
    const existingIcon = contentTypeBadge.querySelector('svg');
    if (existingIcon) existingIcon.remove();
    if (icon) contentTypeBadge.insertBefore(icon, contentTypeText);

    // Remove animation class after animation completes
    setTimeout(() => {
      contentTypeBadge.classList.remove('animate-pulse-once');
    }, 600);
  }

  function clearDetected() {
    if (detectedJson) detectedJson.classList.add('hidden');
    if (detectedJwt) detectedJwt.classList.add('hidden');
    if (detectedImage) detectedImage.classList.add('hidden');
    if (jsonPre) jsonPre.textContent = '';
    if (jwtPre) jwtPre.textContent = '';
    if (imagePreview) {
      imagePreview.src = '';
      imagePreview.classList.add('hidden');
    }
    if (showImageBtn) showImageBtn.classList.remove('hidden');
    if (detectedNone) detectedNone.classList.remove('hidden');
    updateContentTypeBadge(null);
  }

  function renderInsights(items) {
    if (!insightsList) return;
    insightsList.innerHTML = '';
    items.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      insightsList.appendChild(li);
    });
  }

  function flashOutput() {
    if (!outputEl) return;
    outputEl.classList.remove('base64-output-flash');
    // Force reflow so the animation can restart
    void outputEl.offsetWidth;
    outputEl.classList.add('base64-output-flash');
    outputEl.focus({ preventScroll: true });
    setTimeout(() => outputEl.classList.remove('base64-output-flash'), 1200);
  }

  function bytesToBase64(bytes) {
    let binary = '';
    const len = bytes.length;
    for (let i = 0; i < len; i += 10240) {
      const chunk = bytes.subarray(i, i + 10240);
      binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
  }

  function base64ToBytes(str) {
    const binary = atob(str);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  function wrapBase64(str) {
    return str.replace(/(.{76})/g, '$1\n');
  }

  function applyVariant(str) {
    if (state.variant !== 'urlsafe') return str;
    return str.replace(/\+/g, '-').replace(/\//g, '_');
  }

  function normalizeVariantForDecode(str) {
    return str.replace(/-/g, '+').replace(/_/g, '/');
  }

  function addPaddingIfNeeded(str) {
    const padLength = (4 - (str.length % 4)) % 4;
    if (!padLength) return str;
    return str + '='.repeat(padLength);
  }

  function validateBase64Input(raw) {
    const clean = raw.replace(/\s+/g, '');
    const regex = state.variant === 'urlsafe'
      ? /^[A-Za-z0-9\-_]+={0,2}$/
      : /^[A-Za-z0-9+/]+={0,2}$/;

    const issues = [];
    if (!regex.test(clean)) {
      issues.push('Contains characters outside selected variant.');
    }
    if (state.padding && clean.length % 4 !== 0) {
      issues.push('Length is not a multiple of 4; padding may be missing.');
    }
    return { clean, issues };
  }

  function getTextDecoder(charset, fatal) {
    try {
      return new TextDecoder(charset, { fatal });
    } catch (e) {
      // Fallback: UTF-8 decoder
      return new TextDecoder('utf-8', { fatal });
    }
  }

  function textToBytes(text) {
    if (state.charset === 'iso-8859-1') {
      const arr = new Uint8Array(text.length);
      for (let i = 0; i < text.length; i++) {
        arr[i] = text.charCodeAt(i) & 0xff;
      }
      return arr;
    }
    return new TextEncoder().encode(text);
  }

  function hexToBytes(hex) {
    const clean = hex.replace(/\s+/g, '');
    if (!clean) return new Uint8Array();
    if (!/^[0-9a-fA-F]+$/.test(clean) || clean.length % 2 !== 0) {
      throw new Error('Hex input must be even length and contain only 0-9, a-f.');
    }
    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < clean.length; i += 2) {
      bytes[i / 2] = parseInt(clean.slice(i, i + 2), 16);
    }
    return bytes;
  }

  function binaryToBytes(binary) {
    const clean = binary.replace(/\s+/g, '');
    if (!clean) return new Uint8Array();
    if (!/^[01]+$/.test(clean) || clean.length % 8 !== 0) {
      throw new Error('Binary input must be 0s and 1s, grouped in 8-bit chunks.');
    }
    const bytes = new Uint8Array(clean.length / 8);
    for (let i = 0; i < clean.length; i += 8) {
      bytes[i / 8] = parseInt(clean.slice(i, i + 8), 2);
    }
    return bytes;
  }

  function bytesToHex(bytes) {
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function bytesToBinary(bytes) {
    return Array.from(bytes)
      .map((b) => b.toString(2).padStart(8, '0'))
      .join(' ');
  }

  function decodeToText(bytes) {
    let warning = false;
    let text = '';
    try {
      text = getTextDecoder(state.charset, true).decode(bytes);
    } catch (e) {
      warning = true;
      text = getTextDecoder(state.charset, false).decode(bytes);
    }
    if (charsetWarning) charsetWarning.classList.toggle('hidden', !warning);
    return { text, warning };
  }

  function detectJson(bytes) {
    try {
      const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
      const parsed = JSON.parse(text);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return null;
    }
  }

  function decodeJwtPart(part) {
    const normalized = normalizeVariantForDecode(addPaddingIfNeeded(part));
    const bytes = base64ToBytes(normalized);
    const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    return JSON.parse(text);
  }

  function detectJwt(base64Input) {
    // Remove all whitespace from input
    const clean = base64Input.replace(/\s+/g, '');
    if (!clean.includes('.')) return null;
    const segments = clean.split('.');
    if (segments.length < 2) return null;
    try {
      const header = decodeJwtPart(segments[0]);
      const payload = decodeJwtPart(segments[1]);
      return JSON.stringify({ header, payload }, null, 2);
    } catch (e) {
      return null;
    }
  }

  function detectImage(bytes) {
    const sig = bytes.subarray(0, 12);
    const hex = bytesToHex(sig).toLowerCase();

    if (hex.startsWith('89504e470d0a1a0a')) return 'image/png';
    if (hex.startsWith('ffd8ff')) return 'image/jpeg';
    if (hex.startsWith('47494638')) return 'image/gif';
    if (hex.startsWith('52494646') && hex.includes('77656270')) return 'image/webp';
    return null;
  }

  function updateDetections(bytes, output) {
    clearDetected();

    if (!bytes) return;
    const json = detectJson(bytes);
    const jwt = detectJwt(output);
    const imageMime = detectImage(bytes);
    let shown = false;
    let detectedType = null;

    if (json && detectedJson && jsonPre) {
      detectedJson.classList.remove('hidden');
      jsonPre.textContent = json;
      shown = true;
      detectedType = 'json';
    }
    if (jwt && detectedJwt && jwtPre) {
      detectedJwt.classList.remove('hidden');
      jwtPre.textContent = jwt;
      shown = true;
      detectedType = 'jwt';
    }
    if (imageMime && detectedImage) {
      detectedImage.classList.remove('hidden');
      if (showImageBtn) showImageBtn.onclick = () => {
        const base64Data = bytesToBase64(bytes);
        const dataUrl = `data:${imageMime};base64,${base64Data}`;
        if (imagePreview) {
          imagePreview.src = dataUrl;
          imagePreview.classList.remove('hidden');
        }
        showImageBtn.classList.add('hidden');
      };
      shown = true;
      detectedType = 'image';
    }

    if (shown && detectedNone) detectedNone.classList.add('hidden');
    updateContentTypeBadge(detectedType);
  }

  function handleEncode() {
    hideError();
    charsetWarning?.classList.add('hidden');

    try {
      let bytes;
      if (state.interpretation === 'text') {
        bytes = textToBytes(inputEl.value);
      } else if (state.interpretation === 'hex') {
        bytes = hexToBytes(inputEl.value);
      } else {
        bytes = binaryToBytes(inputEl.value);
      }

      const base = bytesToBase64(bytes);
      const variantApplied = applyVariant(base);
      const withPadding = state.padding ? variantApplied : variantApplied.replace(/=+$/, '');
      const finalOutput = state.wrap ? wrapBase64(withPadding) : withPadding;

      outputEl.value = finalOutput;
      state.lastBytes = bytes;
      state.lastBase64 = finalOutput;
      setStatus(`Encoded ${bytes.length} bytes to Base64 (${state.variant === 'urlsafe' ? 'URL-safe' : 'Standard'}).`);

      renderInsights([
        `Interpretation: ${state.interpretation}`,
        `Variant: ${state.variant === 'urlsafe' ? 'URL-safe' : 'Standard'} · ${state.padding ? 'padding on' : 'no padding'} · ${state.wrap ? 'wrap 76' : 'no wrap'}`,
        `Charset: ${state.charset.toUpperCase()}`,
        `Input length: ${inputEl.value.length} chars`,
        `Encoded length: ${finalOutput.length} chars`,
      ]);
      clearDetected();
      flashOutput();
    } catch (e) {
      showError(e.message);
      setStatus('Encoding failed.');
    }
  }

  function handleDecode() {
    hideError();
    charsetWarning?.classList.add('hidden');

    const raw = inputEl.value.trim();
    if (!raw) {
      showError('Please enter Base64 to decode.');
      return;
    }

    const { clean, issues } = validateBase64Input(raw);
    if (issues.length) {
      showError(issues[0]);
    }

    try {
      const normalized = addPaddingIfNeeded(normalizeVariantForDecode(clean));
      const bytes = base64ToBytes(normalized);
      state.lastBytes = bytes;
      state.lastBase64 = clean;

      let output = '';
      let textMeta = '';
      if (state.interpretation === 'text') {
        const { text, warning } = decodeToText(bytes);
        output = text;
        if (warning) textMeta = ' (invalid sequences replaced)';
      } else if (state.interpretation === 'hex') {
        output = bytesToHex(bytes);
      } else {
        output = bytesToBinary(bytes);
      }

      outputEl.value = output;
      setStatus(`Decoded ${bytes.length} bytes${textMeta}.`);

      renderInsights([
        `Interpretation: ${state.interpretation}`,
        `Variant: ${state.variant === 'urlsafe' ? 'URL-safe' : 'Standard'} · ${state.padding ? 'padding on' : 'padding optional'}`,
        `Charset: ${state.charset.toUpperCase()}`,
        `Decoded byte length: ${bytes.length}`,
        `Output length: ${output.length} chars`,
        issues.length ? `Validation: ${issues.join(' ')}` : 'Validation: clean',
      ]);

      // Pass the decoded output for JWT detection (JWT has dots in decoded form)
      updateDetections(bytes, output);
      flashOutput();
    } catch (e) {
      showError('Decode failed. Make sure the Base64 is valid for the selected variant.');
      setStatus('Decode failed.');
    }
  }

  function copyResult() {
    hideError();
    const output = outputEl.value;
    if (!output) {
      showError('Nothing to copy.');
      return;
    }
    navigator.clipboard.writeText(output).then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = '✓ Copied';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 1600);
    }).catch(() => {
      showError('Failed to copy to clipboard.');
    });
  }

  function clearAll() {
    inputEl.value = '';
    outputEl.value = '';
    hideError();
    charsetWarning?.classList.add('hidden');
    clearDetected();
    renderInsights([]);
    setStatus('Ready.');
  }

  // Events
  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => setMode(btn.dataset.mode || 'simple'));
  });

  interpretationTabs.forEach((tab) => {
    tab.addEventListener('click', () => setInterpretation(tab.dataset.interpretation || 'text'));
  });

  variantChips.forEach((chip) => {
    chip.addEventListener('click', () => setVariant(chip.dataset.variant || 'standard'));
  });

  paddingToggle?.addEventListener('click', () => setPadding(paddingToggle.dataset.state !== 'on'));
  wrapToggle?.addEventListener('click', () => setWrap(wrapToggle.dataset.state !== 'on'));
  charsetSelect?.addEventListener('change', (e) => setCharset(e.target.value));

  encodeBtn?.addEventListener('click', handleEncode);
  decodeBtn?.addEventListener('click', handleDecode);
  copyBtn?.addEventListener('click', copyResult);
  clearBtn?.addEventListener('click', clearAll);

  // Init defaults
  setMode('simple');
  setInterpretation('text');
  setVariant('standard');
  setPadding(true);
  setWrap(false);
  setCharset('utf-8');
  updatePipeline();
  clearDetected();
})();
