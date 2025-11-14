---
layout: layouts/blog.njk
title: Fix “Invalid JWT” Errors — Common Causes and Checks
description: Troubleshoot invalid JWT errors with a systematic checklist for decoding and validation.
category: JWT
date: 2025-11-12
readTime: 7
tags: ["blog", "jwt"]
relatedTool: /jwt-decoder/
relatedToolName: JWT Decoder
relatedArticles:
  - /blog/jwt-tokens-explained/
  - /blog/base64url-vs-base64-jwt-decoding/
  - /blog/jwks-kid-key-rotation-decoding/
faq:
  - question: Why does my token fail to decode?
    answer: Often due to Base64URL padding issues, malformed segments, or whitespace. Verification failures are separate from decoding.
---

Invalid JWT errors frustrate developers daily. Understanding why these errors occur and how to systematically fix them saves hours of debugging. This guide walks through common error categories, root causes, and step-by-step solutions.

## Why JWT validation fails

JWT validation can fail at two stages:

1. **Decoding stage** - Can't parse the token structure (syntax errors)
2. **Verification stage** - Token structure is valid but signature or claims are invalid (semantic errors)

Understanding which stage fails helps you fix issues faster. Use our [JWT Decoder](/jwt-decoder/) to quickly see if decoding succeeds—if it does, the problem is in verification.

## Error category 1: Parse/Decode errors

These errors happen when the token structure itself is malformed. The token can't even be decoded.

### Symptom: "Invalid token format" or "Not enough segments"

**Why it happens:**
JWTs must have exactly three segments separated by dots: `header.payload.signature`

**Common causes:**
- Token was truncated or corrupted during transmission
- Extra whitespace or newlines added
- Token split across multiple lines in config/logs
- Missing segments (only header.payload without signature)

**How to fix:**
```javascript
// Clean token before processing
function cleanToken(token) {
  return token
    .trim()                    // Remove leading/trailing whitespace
    .replace(/\s+/g, '')       // Remove all whitespace
    .replace(/['"]/g, '')      // Remove quotes if wrapped
    .replace(/\n/g, '')        // Remove newlines
    .replace(/\r/g, '');       // Remove carriage returns
}

const clean = cleanToken(rawToken);

// Verify it has three segments
const segments = clean.split('.');
if (segments.length !== 3) {
  throw new Error(`Expected 3 segments, got ${segments.length}`);
}
```

**Prevention:**
- Always trim and validate token format before processing
- Use our [JWT Decoder](/jwt-decoder/) to verify token structure
- Log token length and segment count for debugging

### Symptom: "Invalid character" or "Incorrect padding"

**Why it happens:**
JWTs use Base64URL encoding, but many decoders expect standard Base64. Base64URL replaces `+` with `-` and `/` with `_`, and often omits padding (`=`).

**How to fix:**
```javascript
function normalizeBase64URL(str) {
  // Replace URL-safe characters
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  
  // Add padding if needed (Base64 requires length multiple of 4)
  const padding = (4 - (str.length % 4)) % 4;
  return str + '='.repeat(padding);
}

function decodeSegment(segment) {
  const normalized = normalizeBase64URL(segment);
  return Buffer.from(normalized, 'base64').toString('utf8');
}
```

**Real-world example:**
```javascript
// Token segment: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9"
// This is Base64URL (no padding, uses - and _)

// If your decoder expects Base64, normalize first:
const normalized = normalizeBase64URL("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9");
// Now: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9" (adds padding if needed)
```

**Prevention:**
- Use libraries that support Base64URL natively (like `jsonwebtoken` in Node.js)
- Or normalize before decoding (see our [Base64URL guide](/blog/base64url-vs-base64-jwt-decoding/))

### Symptom: "Unexpected token" or JSON parse errors

**Why it happens:**
After Base64 decoding, the result should be valid JSON. If it's not, the segment was corrupted or incorrectly encoded.

**How to debug:**
```javascript
try {
  const decoded = Buffer.from(normalizedSegment, 'base64').toString('utf8');
  const parsed = JSON.parse(decoded);
} catch (error) {
  console.error('Failed to parse segment:', decoded);
  console.error('Raw bytes:', Buffer.from(normalizedSegment, 'base64'));
  throw error;
}
```

## Error category 2: Verification errors

These errors happen when the token structure is valid but signature or claims don't match expectations.

### Symptom: "Invalid signature" or "Token signature invalid"

**Why it happens:**
The signature doesn't match what's expected for the given algorithm and key.

**Common causes:**

1. **Wrong algorithm**
   - Token signed with RS256 but verifying with HS256 secret
   - Solution: Decode header to see `alg` field using [JWT Decoder](/jwt-decoder/)

2. **Wrong key**
   - Using dev secret for prod token (or vice versa)
   - Using wrong public key from JWKS
   - Solution: Verify environment and key selection

3. **Key rotation**
   - Token signed with old key, JWKS only has new key
   - Solution: Refresh JWKS cache (see [key rotation guide](/blog/jwks-kid-key-rotation-decoding/))

**How to fix:**
```javascript
// Step 1: Decode header to see algorithm
const [headerSegment] = token.split('.');
const header = JSON.parse(
  Buffer.from(headerSegment, 'base64url').toString()
);

console.log('Algorithm:', header.alg);
console.log('Key ID:', header.kid);

// Step 2: Verify with correct algorithm and key
if (header.alg === 'HS256') {
  jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ['HS256'] // Pin algorithm!
  });
} else if (header.alg === 'RS256') {
  // Fetch JWKS and get correct key
  const key = await getKeyFromJwks(header.kid);
  jwt.verify(token, key, {
    algorithms: ['RS256'] // Pin algorithm!
  });
}
```

### Symptom: "jwt audience invalid" or "Invalid audience"

**Why it happens:**
The `aud` (audience) claim in the token doesn't match your application's expected audience.

**Common scenarios:**
- Token issued for different application/client ID
- Environment mismatch (dev token used in prod)
- Multiple audiences in token but yours not included

**How to fix:**
```javascript
// Decode payload to see audience
const payload = jwt.decode(token, { complete: false });
console.log('Token audience:', payload.aud);
console.log('Expected audience:', process.env.JWT_AUDIENCE);

// Verify with correct audience
jwt.verify(token, key, {
  algorithms: ['RS256'],
  audience: process.env.JWT_AUDIENCE // Must match exactly
});
```

**Debugging tip:**
- `aud` can be a string or array
- If array, your value must be included in it
- Check for trailing slashes or case sensitivity issues

### Symptom: "jwt issuer invalid" or "Invalid issuer"

**Why it happens:**
The `iss` (issuer) claim doesn't match your configured issuer URL.

**Common causes:**
- Trailing slash mismatch (`https://issuer.com` vs `https://issuer.com/`)
- Protocol mismatch (`http://` vs `https://`)
- Wrong issuer entirely (dev vs prod)

**How to fix:**
```javascript
// Decode to see issuer
const payload = jwt.decode(token, { complete: false });
console.log('Token issuer:', payload.iss);
console.log('Expected issuer:', process.env.JWT_ISSUER);

// Normalize issuer URLs (remove trailing slash)
const normalizeIssuer = (url) => url.replace(/\/$/, '');

jwt.verify(token, key, {
  algorithms: ['RS256'],
  issuer: normalizeIssuer(process.env.JWT_ISSUER)
});
```

### Symptom: "jwt expired" or "Token expired"

**Why it happens:**
The `exp` (expiration) claim indicates the token is no longer valid.

**Common causes:**
- Token genuinely expired (past `exp` time)
- Clock skew between systems (your server time is ahead)
- Token issued with very short expiration

**How to fix:**
```javascript
// Add clock tolerance to handle small time differences
jwt.verify(token, key, {
  algorithms: ['RS256'],
  clockTolerance: 60 // Allow 60 seconds of skew
});

// Or check expiration manually with tolerance
const payload = jwt.decode(token, { complete: false });
const now = Math.floor(Date.now() / 1000);
const expirationTime = payload.exp;
const tolerance = 60; // seconds

if (now > expirationTime + tolerance) {
  throw new Error('Token expired');
}
```

**Best practice:**
- Always allow some clock tolerance (30-60 seconds)
- Log expiration times for debugging
- Use refresh tokens for long-lived sessions

### Symptom: "jwt not active" or "Token not yet valid"

**Why it happens:**
The `nbf` (not before) claim indicates the token isn't valid yet.

**Common causes:**
- Token issued for future use
- Clock skew (your server time is behind)
- Token issued with `nbf` set incorrectly

**How to fix:**
```javascript
jwt.verify(token, key, {
  algorithms: ['RS256'],
  clockTolerance: 60 // Also applies to nbf check
});
```

## Systematic troubleshooting checklist

When a JWT fails, follow this order:

### Step 1: Can you decode it?

Use our [JWT Decoder](/jwt-decoder/) to see if the token structure is valid.

**If decoding fails:**
- Check token format (three segments?)
- Normalize Base64URL encoding
- Remove whitespace/quotes/newlines
- See [Base64URL guide](/blog/base64url-vs-base64-jwt-decoding/)

**If decoding succeeds:**
- Note the `alg` and `kid` from header
- Check `iss`, `aud`, `exp`, `nbf` from payload
- Proceed to verification debugging

### Step 2: Check algorithm match

```javascript
const header = /* decode header */;
console.log('Token algorithm:', header.alg);
console.log('Expected algorithm:', 'RS256'); // or HS256

// Ensure they match!
```

### Step 3: Verify key selection

**For HS256:**
- Confirm you're using the correct secret
- Check environment variables (dev vs prod)
- Verify secret hasn't changed

**For RS256:**
- Fetch JWKS from issuer
- Find key matching `kid` from header
- Verify key is current (not rotated out)
- See [JWKS guide](/blog/jwks-kid-key-rotation-decoding/)

### Step 4: Validate claims

```javascript
const payload = jwt.decode(token, { complete: false });

// Check each claim
console.log('Issuer:', payload.iss);
console.log('Audience:', payload.aud);
console.log('Expires:', new Date(payload.exp * 1000));
console.log('Not before:', payload.nbf ? new Date(payload.nbf * 1000) : 'none');
```

### Step 5: Add tolerance and retry

```javascript
const options = {
  algorithms: ['RS256'],
  audience: process.env.JWT_AUDIENCE,
  issuer: process.env.JWT_ISSUER,
  clockTolerance: 60 // Allow 60s clock skew
};

try {
  jwt.verify(token, key, options);
} catch (error) {
  // Log details for debugging
  console.error('Verification failed:', error.message);
  console.error('Token payload:', jwt.decode(token, { complete: false }));
  throw error;
}
```

## Real-world debugging workflow

**Scenario:** Token works in Postman but fails in your application

1. **Decode both tokens** using [JWT Decoder](/jwt-decoder/)
   - Compare headers (alg, kid)
   - Compare payloads (iss, aud, exp)

2. **Check environment**
   - Are you using same issuer/audience?
   - Same algorithm configuration?
   - Same key/secret?

3. **Verify clock sync**
   - Check server time vs token `iat`/`exp`
   - Add clock tolerance if needed

4. **Check JWKS caching**
   - If RS256, ensure JWKS is fresh
   - Verify `kid` matches current key

## Prevention strategies

1. **Always pin algorithms** - Never accept unexpected algorithms
2. **Normalize inputs** - Clean tokens before processing
3. **Validate claims** - Don't just check signature
4. **Handle clock skew** - Add tolerance for time-based claims
5. **Cache JWKS properly** - Refresh on failure, not on every request
6. **Log token details** - Decode and log (redacted) for debugging
7. **Use our tools** - [JWT Decoder](/jwt-decoder/) for quick inspection

## Next steps

1. Try decoding your token with [JWT Decoder](/jwt-decoder/) to see structure
2. Learn about [Base64URL encoding](/blog/base64url-vs-base64-jwt-decoding/) if decode fails
3. Understand [algorithm differences](/blog/hs256-vs-rs256-decoding/) if verification fails
4. Read about [JWKS and key rotation](/blog/jwks-kid-key-rotation-decoding/) for RS256 issues
5. See [safe decoding practices](/blog/jwt-decode-safely/) before verification
