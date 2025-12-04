---
layout: layouts/blog.njk
title: Fix “Invalid JWT” Errors — Common Causes and Checks
description: Troubleshoot invalid JWT errors with a systematic checklist for decoding and validation.
category: JWT
date: 2025-11-12
readTime: 7
tags: ["blog", "jwt"]
relatedTool: /jwt-decoder/
relatedToolName: JWT Encoder/Decoder
relatedArticles:
  - /blog/jwt-tokens-explained/
  - /blog/base64url-vs-base64-jwt-decoding/
  - /blog/jwks-kid-key-rotation-decoding/
faq:
  - question: Why does my token fail to decode?
    answer: Often due to Base64URL padding issues, malformed segments, or whitespace. Verification failures are separate from decoding.
---

Invalid JWT errors frustrate developers daily. Understanding why these errors occur and how to systematically fix them saves hours of debugging. This guide walks through common error categories, root causes, and step-by-step solutions.

> **🔍 Quick Diagnosis:** Paste your invalid token into our **[JWT Encoder/Decoder](/jwt-decoder/)** tool. It will instantly show you the `EXP`, `IAT`, algorithm (`alg`), and signature status to identify the likely error before diving into code fixes. Convert Unix timestamps (`EXP`, `IAT`) to readable dates using our [Timestamp Converter](/timestamp-converter/) tool.

## Why JWT validation fails

JWT validation can fail at two stages:

1. **Decoding stage** - Can't parse the token structure (syntax errors)
2. **Verification stage** - Token structure is valid but signature or claims are invalid (semantic errors)

Understanding which stage fails helps you fix issues faster. Use our [JWT Encoder/Decoder](/jwt-decoder/) to quickly see if decoding succeeds—if it does, the problem is in verification.

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
- Use our [JWT Encoder/Decoder](/jwt-decoder/) to verify token structure
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
   - Solution: Decode header to see `alg` field using [JWT Encoder/Decoder](/jwt-decoder/)

2. **Wrong key**
   - Using dev secret for prod token (or vice versa)
   - Using wrong public key from JWKS
   - Solution: Verify environment and key selection

3. **Key rotation**
   - Token signed with old key, JWKS only has new key
   - Solution: Refresh JWKS cache (see [key rotation guide](/blog/jwks-kid-key-rotation-decoding/))

4. **JWKS and 'kid' errors**
   - Token's `kid` (Key ID) doesn't match any key in JWKS
   - Stale JWKS cache missing newly rotated keys
   - Wrong JWKS endpoint or issuer mismatch
   - Solution: See our [complete JWKS troubleshooting guide](/blog/jwks-kid-key-rotation-decoding/) for key rotation and `kid` matching issues

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

## Error category 3: Time-based errors (EXP, IAT, clock skew)

Time-based claims (`exp`, `iat`, `nbf`) are sensitive to clock differences between systems. Small time discrepancies can cause validation failures even when tokens are technically valid.

### Understanding clock skew

**The problem:**
- Your server's clock may be slightly ahead or behind the issuer's clock
- Network latency adds small delays
- Different timezones or NTP sync issues
- Container/server time drift

**Impact:**
- Tokens appear expired when they're actually valid
- Tokens appear not-yet-valid when they should be active
- `iat` (issued at) validation fails unexpectedly

### Fixing EXP (Expiration Time) errors

**Symptom:** Token rejected as expired, but `exp` timestamp looks valid

**Solution:**
```javascript
// Always add clock tolerance
jwt.verify(token, key, {
  algorithms: ['RS256'],
  clockTolerance: 60, // 60 seconds tolerance
  // ... other options
});

// Or check manually with tolerance
const payload = jwt.decode(token, { complete: false });
const now = Math.floor(Date.now() / 1000);
const exp = payload.exp;
const tolerance = 60;

if (exp && (now - tolerance) > exp) {
  throw new Error('Token expired');
}
```

### Fixing IAT (Issued At) errors

**Symptom:** Token rejected as issued in the future

**Common causes:**
- Your server clock is behind issuer's clock
- Token issued with `iat` set to future time (rare)

**Solution:**
```javascript
// Allow clock tolerance for IAT
jwt.verify(token, key, {
  algorithms: ['RS256'],
  clockTolerance: 60, // Applies to IAT check too
  // ... other options
});

// Manual check
const payload = jwt.decode(token, { complete: false });
const now = Math.floor(Date.now() / 1000);
const iat = payload.iat;
const tolerance = 60;

if (iat && (iat - tolerance) > now) {
  throw new Error('Token issued in the future');
}
```

### Best practices for time-based validation

1. **Always use clock tolerance** - 30-60 seconds recommended
2. **Sync server clocks** - Use NTP to keep clocks synchronized
3. **Log time differences** - Monitor for clock drift issues
4. **Check token age** - Use `iat` to detect very old tokens

## Error category 4: Algorithm mismatch errors

Algorithm mismatches occur when the token's signing algorithm doesn't match what your verifier expects. This is a common security issue.

### HS256 vs RS256 confusion

**The problem:**
- Token signed with `HS256` (symmetric, requires secret)
- Verifier expects `RS256` (asymmetric, requires public key)
- Or vice versa

**Why it happens:**
- Environment mismatch (dev uses HS256, prod uses RS256)
- Library defaults different from issuer
- Configuration errors

**How to diagnose:**
```javascript
// Step 1: Decode header to see actual algorithm
const [headerSegment] = token.split('.');
const header = JSON.parse(
  Buffer.from(headerSegment, 'base64url').toString()
);

console.log('Token algorithm:', header.alg);
console.log('Expected algorithm:', 'RS256'); // or HS256

// Use our JWT Decoder tool to inspect instantly
```

**How to fix:**
```javascript
// BAD - doesn't check algorithm
jwt.verify(token, secret);

// GOOD - pins expected algorithm
jwt.verify(token, secret, {
  algorithms: ['HS256'] // Only accept HS256
});

// For RS256
jwt.verify(token, publicKey, {
  algorithms: ['RS256'] // Only accept RS256
});
```

### Algorithm confusion attacks

**Security risk:**
Attackers might try to change `alg: "none"` or switch algorithms to bypass verification.

**Prevention:**
```javascript
// ALWAYS pin algorithms - never trust header
jwt.verify(token, key, {
  algorithms: ['RS256'], // Explicitly allow only RS256
  // Never use: algorithms: ['none', 'HS256', 'RS256']
});
```

### Common algorithm mismatches

| Token Algorithm | Verifier Expects | Error |
|----------------|------------------|-------|
| `HS256` | `RS256` | "Invalid signature" or "Algorithm not allowed" |
| `RS256` | `HS256` | "Invalid signature" (wrong key type) |
| `ES256` | `RS256` | "Algorithm not allowed" |
| `none` | Any | Security vulnerability if not blocked |

**Solution:** Always decode header first, then verify with matching algorithm.

## Error category 5: Library-specific errors

Different JWT libraries have different error messages and behaviors. Understanding library-specific issues helps debug faster.

### Node.js: jsonwebtoken (Passport.js)

**Common errors:**

1. **"invalid signature"**
   - Wrong secret/key
   - Algorithm mismatch
   - Token corrupted

2. **"jwt malformed"**
   - Invalid token format
   - Missing segments
   - Base64URL issues

3. **"jwt expired"**
   - `exp` claim passed
   - Clock skew (add `clockTolerance`)

**Example fixes:**
```javascript
const jwt = require('jsonwebtoken');

// Fix: Add clock tolerance
try {
  const decoded = jwt.verify(token, secret, {
    algorithms: ['HS256'],
    clockTolerance: 60, // Fixes clock skew
    audience: 'my-api',
    issuer: 'https://auth.example.com'
  });
} catch (error) {
  if (error.name === 'TokenExpiredError') {
    // Handle expiration
  } else if (error.name === 'JsonWebTokenError') {
    // Handle invalid token
  }
}
```

### Python: PyJWT

**Common errors:**

1. **`InvalidSignatureError`**
   - Wrong key or algorithm mismatch
   - Solution: Check `alg` header, use correct key

2. **`ExpiredSignatureError`**
   - Token expired
   - Solution: Add `leeway` parameter

3. **`InvalidKeyError`**
   - Wrong key format
   - Solution: Ensure PEM format for RSA keys

**Example fixes:**
```python
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidSignatureError

try:
    decoded = jwt.decode(
        token,
        key,
        algorithms=['RS256'],
        audience='my-api',
        issuer='https://auth.example.com',
        leeway=60  # Fixes clock skew
    )
except ExpiredSignatureError:
    # Handle expiration
except InvalidSignatureError:
    # Handle invalid signature
```

### Java: JJWT

**Common errors:**

1. **`ExpiredJwtException`**
   - Token expired
   - Solution: Add clock skew allowance

2. **`SignatureException`**
   - Invalid signature
   - Solution: Check algorithm and key

3. **`MalformedJwtException`**
   - Invalid token format
   - Solution: Verify token structure

**Example fixes:**
```java
import io.jsonwebtoken.*;

try {
    Claims claims = Jwts.parserBuilder()
        .setSigningKey(key)
        .requireAudience("my-api")
        .requireIssuer("https://auth.example.com")
        .setAllowedClockSkewSeconds(60) // Fixes clock skew
        .build()
        .parseClaimsJws(token)
        .getBody();
} catch (ExpiredJwtException e) {
    // Handle expiration
} catch (SignatureException e) {
    // Handle invalid signature
}
```

### Library-specific debugging tips

1. **Check library documentation** - Error names vary by library
2. **Enable debug logging** - Most libraries support verbose error messages
3. **Use our decoder tool** - Decode token first to see structure before library verification
4. **Test with minimal code** - Isolate the issue from your application logic

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

Use our [JWT Encoder/Decoder](/jwt-decoder/) to see if the token structure is valid.

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

1. **Decode both tokens** using [JWT Encoder/Decoder](/jwt-decoder/)
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
7. **Use our tools** - [JWT Encoder/Decoder](/jwt-decoder/) for quick inspection

## Next steps

1. **Diagnose instantly** - Paste your token into our [JWT Encoder/Decoder](/jwt-decoder/) to see structure and identify errors
2. **Fix decode errors** - Learn about [Base64URL encoding](/blog/base64url-vs-base64-jwt-decoding/) if decode fails
3. **Fix algorithm issues** - Understand [algorithm differences](/blog/hs256-vs-rs256-decoding/) if verification fails
4. **Fix JWKS errors** - Read about [JWKS and key rotation](/blog/jwks-kid-key-rotation-decoding/) for RS256 and `kid` issues
5. **Safe practices** - See [safe decoding practices](/blog/jwt-decode-safely/) before verification
