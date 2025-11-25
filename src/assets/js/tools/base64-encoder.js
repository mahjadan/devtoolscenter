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
    if (!base64Input.includes('.')) return null;
    const segments = base64Input.split('.');
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

  function updateDetections(bytes, base64Input) {
    clearDetected();

    if (!bytes || state.mode === 'simple') return;
    const json = detectJson(bytes);
    const jwt = detectJwt(base64Input);
    const imageMime = detectImage(bytes);
    let shown = false;

    if (json && detectedJson && jsonPre) {
      detectedJson.classList.remove('hidden');
      jsonPre.textContent = json;
      shown = true;
    }
    if (jwt && detectedJwt && jwtPre) {
      detectedJwt.classList.remove('hidden');
      jwtPre.textContent = jwt;
      shown = true;
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
    }

    if (shown && detectedNone) detectedNone.classList.add('hidden');
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

      updateDetections(bytes, clean);
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
