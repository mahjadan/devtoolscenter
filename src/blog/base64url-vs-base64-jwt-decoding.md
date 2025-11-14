---
layout: layouts/blog.njk
title: Base64URL vs Base64 for JWTs — Why Decoding Fails
description: Learn how Base64URL differs from Base64 and how padding affects JWT decoding.
category: JWT
date: 2025-11-12
readTime: 7
tags: ["blog", "jwt"]
relatedTool: /jwt-decoder/
relatedToolName: JWT Decoder
relatedArticles:
  - /blog/jwt-tokens-explained/
  - /blog/understanding-base64-encoding/
  - /blog/invalid-jwt-errors-fixes/
faq:
  - question: Why does adding padding fix decoding?
    answer: JWTs use Base64URL without padding; some decoders expect = padding. Normalizing fixes decoding.
---

JWT segments (header and payload) are Base64URL-encoded. If your decoder assumes standard Base64, you'll see errors like "Incorrect padding" or "Invalid character". Understanding why Base64URL exists and how to normalize it prevents frustrating decode failures.

## Why Base64URL exists

JWTs are designed to be URL-safe. Standard Base64 uses characters (`+`, `/`) that have special meaning in URLs and require encoding. Base64URL replaces these with URL-safe alternatives (`-`, `_`) so tokens can be:
- Passed in URL query parameters without encoding
- Included in HTTP headers without escaping
- Embedded in HTML without breaking parsing

**The problem:** Most programming languages have Base64 decoders, but they expect standard Base64 format. When you try to decode Base64URL with a standard Base64 decoder, it fails.

## Base64 vs Base64URL: The differences

### Character mapping

| Standard Base64 | Base64URL | Why changed |
|----------------|-----------|-------------|
| `+` | `-` | `+` is encoded as `%2B` in URLs |
| `/` | `_` | `/` is a path separator in URLs |
| `=` (padding) | Often omitted | Padding can be inferred from length |

### Example transformation

**Standard Base64:**
```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9
```

**Base64URL (same data):**
```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9
```

In this case they're the same, but if the data contains `+` or `/`, Base64URL would use `-` and `_` instead.

## Why decoding fails

### Error 1: "Invalid character"

**Why it happens:**
Your decoder encounters `-` or `_` which aren't valid Base64 characters.

**Example:**
```javascript
// This fails
Buffer.from('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9', 'base64')
// Error: Invalid character

// Because Base64URL might have: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9
// Which contains characters that standard Base64 doesn't recognize
```

**How to fix:**
Convert Base64URL to Base64 before decoding.

### Error 2: "Incorrect padding"

**Why it happens:**
Base64 requires the input length to be a multiple of 4. Base64URL often omits padding (`=`), so the length might not be a multiple of 4.

**Example:**
```javascript
// Base64URL without padding
const segment = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9';
// Length: 36 (not a multiple of 4)

// This fails
Buffer.from(segment, 'base64')
// Error: Incorrect padding
```

**How to fix:**
Add padding (`=`) until the length is a multiple of 4.

## Normalization function explained

Here's a complete normalization function with error handling:

```javascript
function normalizeBase64URL(str) {
  if (!str || typeof str !== 'string') {
    throw new Error('Input must be a non-empty string');
  }
  
  // Step 1: Replace URL-safe characters with standard Base64 characters
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  
  // Step 2: Add padding if needed
  // Base64 requires length to be multiple of 4
  const padding = (4 - (str.length % 4)) % 4;
  str += '='.repeat(padding);
  
  return str;
}

// Usage
function decodeJWT(token) {
  const [headerSegment, payloadSegment] = token.split('.');
  
  const decodeSegment = (segment) => {
    const normalized = normalizeBase64URL(segment);
    const decoded = Buffer.from(normalized, 'base64').toString('utf8');
    return JSON.parse(decoded);
  };
  
  return {
    header: decodeSegment(headerSegment),
    payload: decodeSegment(payloadSegment)
  };
}
```

**Why this works:**
1. Character replacement converts Base64URL to Base64 format
2. Padding ensures the decoder receives valid Base64
3. The decoder can now process it normally

## Real-world examples

### Example 1: Node.js decoding

```javascript
// Token segment (Base64URL)
const segment = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9';

// Normalize
const normalized = normalizeBase64URL(segment);
// Result: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9' (adds padding if needed)

// Decode
const decoded = Buffer.from(normalized, 'base64').toString('utf8');
// Result: '{"alg":"RS256","typ":"JWT"}'

// Parse JSON
const header = JSON.parse(decoded);
// Result: { alg: 'RS256', typ: 'JWT' }
```

### Example 2: Browser decoding

```javascript
// Browser doesn't have Buffer, use atob
function normalizeBase64URL(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = (4 - (str.length % 4)) % 4;
  return str + '='.repeat(padding);
}

function decodeSegment(segment) {
  const normalized = normalizeBase64URL(segment);
  const decoded = atob(normalized);
  return JSON.parse(decoded);
}

// Usage
const [headerSegment, payloadSegment] = token.split('.');
const header = decodeSegment(headerSegment);
const payload = decodeSegment(payloadSegment);
```

### Example 3: Python decoding

```python
import base64
import json

def normalize_base64url(s):
    # Replace URL-safe characters
    s = s.replace('-', '+').replace('_', '/')
    # Add padding
    padding = (4 - len(s) % 4) % 4
    return s + '=' * padding

def decode_segment(segment):
    normalized = normalize_base64url(segment)
    decoded = base64.b64decode(normalized).decode('utf-8')
    return json.loads(decoded)

# Usage
header_segment, payload_segment, _ = token.split('.')
header = decode_segment(header_segment)
payload = decode_segment(payload_segment)
```

## Common symptoms and fixes

### Symptom: "Invalid character" error

**What you see:**
```
Error: Invalid character in base64 encoding
```

**Why it happens:**
Decoder encountered `-` or `_` which aren't valid Base64 characters.

**How to fix:**
```javascript
// Before decoding, normalize
const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
const decoded = Buffer.from(normalized, 'base64');
```

**Prevention:**
Always normalize Base64URL before decoding, or use our [JWT Decoder](/jwt-decoder/) which handles this automatically.

### Symptom: "Incorrect padding" error

**What you see:**
```
Error: Incorrect padding
```

**Why it happens:**
Base64URL segment length isn't a multiple of 4 (padding was omitted).

**How to fix:**
```javascript
// Add padding
while (segment.length % 4) {
  segment += '=';
}
const decoded = Buffer.from(segment, 'base64');
```

**Prevention:**
Use the normalization function above which handles padding automatically.

### Symptom: Header decodes but payload fails

**What you see:**
Header decodes fine, but payload throws an error.

**Why it happens:**
One segment might have been normalized while the other wasn't, or one segment has different Base64URL characteristics.

**How to fix:**
```javascript
// Normalize both segments consistently
const normalize = (s) => {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return s;
};

const header = JSON.parse(Buffer.from(normalize(headerSegment), 'base64').toString());
const payload = JSON.parse(Buffer.from(normalize(payloadSegment), 'base64').toString());
```

**Prevention:**
Use a consistent normalization function for all segments.

## Why libraries handle this automatically

Most JWT libraries (like `jsonwebtoken` in Node.js) handle Base64URL normalization internally. They know JWTs use Base64URL and convert it automatically.

**When you need manual normalization:**
- Building custom decoders
- Using raw Base64 decoding APIs
- Debugging decode failures
- Working with tokens in non-JWT contexts

## Best practices

### 1. Use JWT-aware libraries when possible

**Good:**
```javascript
const jwt = require('jsonwebtoken');
const decoded = jwt.decode(token); // Handles Base64URL automatically
```

**Why:** Libraries handle normalization, padding, and edge cases for you.

### 2. Normalize before raw decoding

**If you must decode manually:**
```javascript
function safeDecode(segment) {
  const normalized = normalizeBase64URL(segment);
  return Buffer.from(normalized, 'base64').toString('utf8');
}
```

### 3. Test with real tokens

Use our [JWT Decoder](/jwt-decoder/) to see how real tokens decode, then replicate that logic in your code.

### 4. Handle errors gracefully

```javascript
function decodeSegment(segment) {
  try {
    const normalized = normalizeBase64URL(segment);
    const decoded = Buffer.from(normalized, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (error) {
    if (error.message.includes('Invalid character')) {
      throw new Error('Base64URL normalization failed. Check for invalid characters.');
    }
    if (error.message.includes('padding')) {
      throw new Error('Padding error. Ensure segment length is multiple of 4.');
    }
    throw error;
  }
}
```

## Debugging workflow

When you encounter Base64URL decode errors:

1. **Inspect the segment** - Use our [JWT Decoder](/jwt-decoder/) to see if it decodes there
2. **Check character set** - Look for `-` or `_` that need conversion
3. **Verify padding** - Ensure length is multiple of 4
4. **Normalize consistently** - Apply same normalization to all segments
5. **Test incrementally** - Decode header first, then payload

## Tools that help

### Browser tool

Our [JWT Decoder](/jwt-decoder/) handles Base64URL normalization automatically:
- No manual conversion needed
- Instant decoding with error highlighting
- Client-side processing (your tokens stay private)

### Command-line debugging

```bash
# Decode Base64URL segment manually
echo 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9' | \
  sed 's/-/+/g; s/_/\//g' | \
  awk '{while(length($0)%4)$0=$0"="}1' | \
  base64 -d
```

## Next steps

1. Try decoding a token with our [JWT Decoder](/jwt-decoder/) to see Base64URL in action
2. Learn about [safe JWT decoding practices](/blog/jwt-decode-safely/) before verification
3. Read our [troubleshooting guide](/blog/invalid-jwt-errors-fixes/) for common decode errors
4. Understand [Base64 encoding basics](/blog/understanding-base64-encoding/) for deeper context
