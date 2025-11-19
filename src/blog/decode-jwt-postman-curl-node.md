---
layout: layouts/blog.njk
title: Decode JWT in Postman, curl, and Node.js
description: Practical ways to decode JWTs using Postman, curl, and Node.js with caveats on verification.
category: JWT
date: 2025-11-12
readTime: 8
tags: ["blog", "jwt"]
relatedTool: /jwt-decoder/
relatedToolName: JWT Encoder/Decoder
relatedArticles:
  - /blog/jwt-tokens-explained/
  - /blog/base64url-vs-base64-jwt-decoding/
  - /blog/jwks-kid-key-rotation-decoding/
faq:
  - question: Can Postman verify JWT signatures?
    answer: Postman can decode tokens; signature verification must be implemented in your backend or scripts.
---

Use our in-browser [JWT Encoder/Decoder](/jwt-decoder/) for quick inspection, then automate decoding and verification with Postman tests, curl, or Node.js scripts for reproducible workflows. Understanding how to decode in different environments helps you debug authentication issues efficiently.

## Why automate JWT decoding

**Manual decoding limitations:**
- Slow for multiple tokens
- Error-prone copy-paste
- Can't integrate into workflows
- Hard to reproduce

**Automated decoding benefits:**
- Fast batch processing
- Reproducible workflows
- Integration with testing
- CI/CD pipeline support

**When to use each tool:**
- **Browser decoder**: Quick inspection, learning, one-off checks
- **Postman**: API testing, automated test suites
- **curl**: Shell scripts, CI/CD pipelines, server debugging
- **Node.js**: Application code, verification, complex workflows

## Postman: API testing workflow

Postman is excellent for testing APIs that use JWTs. You can decode tokens in test scripts and use decoded claims for assertions.

### Why Postman helps

- **Integrated testing** - Decode and verify in same tool
- **Environment variables** - Store tokens for reuse
- **Test automation** - Run decode/verify as part of test suite
- **Visual debugging** - See decoded output in console

### Basic decoding in Postman

**Setup:**
1. Store token in environment variable: `jwt`
2. Add decode script in Tests tab
3. View decoded output in Postman console

**Decode script:**
```javascript
// Get token from environment
const token = pm.environment.get('jwt');

// Normalize Base64URL to Base64
function normalizeBase64URL(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding if needed
  while (str.length % 4) {
    str += '=';
  }
  return str;
}

// Decode segment using CryptoJS (built into Postman)
function decodeSegment(segment) {
  const normalized = normalizeBase64URL(segment);
  const decoded = CryptoJS.enc.Utf8.stringify(
    CryptoJS.enc.Base64.parse(normalized)
  );
  return JSON.parse(decoded);
}

// Decode token
const [headerSegment, payloadSegment] = token.split('.');
const header = decodeSegment(headerSegment);
const payload = decodeSegment(payloadSegment);

// Log decoded parts
console.log('Header:', JSON.stringify(header, null, 2));
console.log('Payload:', JSON.stringify(payload, null, 2));

// Store decoded payload for use in other requests
pm.environment.set('decoded_sub', payload.sub);
pm.environment.set('decoded_exp', payload.exp);
```

**Why this works:**
- Postman includes CryptoJS library
- Base64URL normalization handles encoding differences
- Decoded values can be used in subsequent requests

### Advanced: Verification in Postman

**For RS256 tokens:**
```javascript
// Note: Full verification requires external API or Pre-request Script
// Postman can decode but verification needs backend or helper

// Decode to check structure
const token = pm.environment.get('jwt');
const [headerSegment] = token.split('.');
const header = decodeSegment(headerSegment);

// Check algorithm
if (header.alg !== 'RS256') {
  pm.test('Token uses RS256', () => {
    pm.expect(header.alg).to.equal('RS256');
  });
}

// Check expiration (basic check)
const payload = decodeSegment(token.split('.')[1]);
const now = Math.floor(Date.now() / 1000);
if (payload.exp) {
  pm.test('Token not expired', () => {
    pm.expect(payload.exp).to.be.above(now);
  });
}
```

**For HS256 tokens:**
```javascript
// You can verify HS256 if you have the secret
// But storing secrets in Postman is a security risk
// Better: Use backend verification endpoint
```

### Postman best practices

**1. Store tokens securely**
- Use environment variables (not hardcoded)
- Don't commit tokens to version control
- Use different environments for dev/staging/prod

**2. Decode before using**
- Decode token in Pre-request Script
- Use decoded claims in request URLs/headers
- Verify token structure before making requests

**3. Test token validity**
- Check expiration before requests
- Verify algorithm matches expectations
- Validate issuer and audience

**Example workflow:**
```javascript
// Pre-request Script
const token = pm.environment.get('jwt');
const payload = decodeJWT(token).payload;

// Use decoded claims
pm.request.url.addQueryParams([
  { key: 'userId', value: payload.sub }
]);

// Tests Script
pm.test('Token is valid', () => {
  const payload = decodeJWT(pm.environment.get('jwt')).payload;
  pm.expect(payload.exp).to.be.above(Math.floor(Date.now() / 1000));
});
```

## curl: Command-line decoding

curl is perfect for shell scripts, CI/CD pipelines, and server-side debugging where you need to decode tokens without a browser.

### Why curl helps

- **Server-friendly** - Works in SSH sessions, containers
- **Scriptable** - Easy to automate in bash scripts
- **No dependencies** - Uses standard Unix tools
- **CI/CD integration** - Works in any pipeline

### Basic decoding with curl

**Simple decode:**
```bash
#!/bin/bash
TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.signature"

# Extract and decode header
HEADER=$(echo "$TOKEN" | cut -d. -f1)
HEADER_DECODED=$(echo "$HEADER" | tr '_-' '/+' | base64 -d 2>/dev/null)
echo "Header: $HEADER_DECODED"

# Extract and decode payload
PAYLOAD=$(echo "$TOKEN" | cut -d. -f2)
PAYLOAD_DECODED=$(echo "$PAYLOAD" | tr '_-' '/+' | base64 -d 2>/dev/null)
echo "Payload: $PAYLOAD_DECODED"
```

**Why this works:**
- `cut -d. -f1` extracts first segment (header)
- `tr '_-' '/+'` normalizes Base64URL to Base64
- `base64 -d` decodes Base64 string

### Improved decode function

**More robust version:**
{% raw %}
```bash
#!/bin/bash

decode_jwt_segment() {
  local segment=$1
  # Normalize Base64URL
  segment=$(echo "$segment" | tr '_-' '/+')
  # Add padding if needed
  local padding=$((4 - ${#segment} % 4))
  if [ $padding -ne 4 ]; then
    segment="${segment}$(printf '=%.0s' $(seq 1 $padding))"
  fi
  # Decode
  echo "$segment" | base64 -d 2>/dev/null
}

decode_jwt() {
  local token=$1
  IFS='.' read -r header_seg payload_seg signature <<< "$token"
  
  echo "Header:"
  decode_jwt_segment "$header_seg" | jq . 2>/dev/null || decode_jwt_segment "$header_seg"
  
  echo ""
  echo "Payload:"
  decode_jwt_segment "$payload_seg" | jq . 2>/dev/null || decode_jwt_segment "$payload_seg"
}

# Usage
TOKEN="your.token.here"
decode_jwt "$TOKEN"
```
{% endraw %}

**Why this is better:**
- Handles padding correctly
- Uses `jq` for pretty JSON (if available)
- Falls back gracefully if `jq` not installed
- More robust error handling

### Using with API requests

**Decode token from API response:**
```bash
#!/bin/bash

# Get token from API
RESPONSE=$(curl -s -X POST https://api.example.com/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}')

TOKEN=$(echo "$RESPONSE" | jq -r '.token')

# Decode token
HEADER=$(echo "$TOKEN" | cut -d. -f1 | tr '_-' '/+' | base64 -d)
PAYLOAD=$(echo "$TOKEN" | cut -d. -f2 | tr '_-' '/+' | base64 -d)

echo "User ID: $(echo "$PAYLOAD" | jq -r '.sub')"
echo "Expires: $(echo "$PAYLOAD" | jq -r '.exp' | xargs -I {} date -d @{})"

# Use token in subsequent request
curl -H "Authorization: Bearer $TOKEN" https://api.example.com/protected
```

### curl limitations

**What curl can't do:**
- Verify signatures (needs cryptographic libraries)
- Fetch JWKS automatically
- Handle complex verification logic

**What to use instead:**
- Node.js or Python scripts for verification
- Backend verification endpoints
- Our [JWT Encoder/Decoder](/jwt-decoder/) for quick checks

## Node.js: Full decoding and verification

Node.js provides the most complete solution for decoding and verifying JWTs programmatically.

### Why Node.js is powerful

- **Full JWT libraries** - `jsonwebtoken`, `jose`, etc.
- **JWKS support** - Automatic key fetching and rotation
- **Verification** - Complete signature and claim validation
- **Integration** - Works in any Node.js application

### Basic decoding

**Simple decode:**
```javascript
const jwt = require('jsonwebtoken');

const token = 'eyJhbGciOiJSUzI1NiIs...';

// Decode without verification (inspection only)
const decoded = jwt.decode(token, { complete: true });

console.log('Header:', decoded.header);
console.log('Payload:', decoded.payload);
console.log('Signature:', decoded.signature);
```

**Why this works:**
- `jwt.decode()` doesn't verify signature
- `complete: true` returns header, payload, and signature
- Useful for inspection and debugging

### HS256 verification

**Symmetric algorithm:**
```javascript
const jwt = require('jsonwebtoken');

async function verifyHS256(token, secret, options = {}) {
  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ['HS256'], // Pin algorithm - critical!
      audience: options.audience,
      issuer: options.issuer,
      clockTolerance: 60 // Allow 60s clock skew
    });
    return { valid: true, payload: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// Usage
const result = await verifyHS256(
  token,
  process.env.JWT_SECRET,
  {
    audience: 'my-app-id',
    issuer: 'https://auth.example.com'
  }
);

if (result.valid) {
  console.log('User:', result.payload.sub);
} else {
  console.error('Verification failed:', result.error);
}
```

### RS256 verification with JWKS

**Asymmetric algorithm (most common):**
```javascript
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const fetch = require('node-fetch');

async function verifyRS256(token, issuer, audience) {
  try {
    // Step 1: Decode header to get kid
    const [headerSegment] = token.split('.');
    const header = JSON.parse(
      Buffer.from(headerSegment, 'base64url').toString()
    );

    if (!header.kid) {
      throw new Error('Token missing kid in header');
    }

    // Step 2: Fetch JWKS
    const jwksUri = `${issuer}/.well-known/jwks.json`;
    const jwksResponse = await fetch(jwksUri);
    const jwks = await jwksResponse.json();

    // Step 3: Find matching key
    const jwk = jwks.keys.find(k => k.kid === header.kid);
    if (!jwk) {
      throw new Error(`Key with kid ${header.kid} not found in JWKS`);
    }

    // Step 4: Convert JWK to PEM
    const jwkToPem = require('jwk-to-pem');
    const publicKey = jwkToPem(jwk);

    // Step 5: Verify token
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ['RS256'], // Pin algorithm
      audience: audience,
      issuer: issuer,
      clockTolerance: 60
    });

    return { valid: true, payload: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// Usage
const result = await verifyRS256(
  token,
  'https://auth.example.com',
  'my-app-id'
);
```

### Using jwks-rsa library (recommended)

**Better approach with caching:**
```javascript
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Setup JWKS client with caching
const client = jwksClient({
  jwksUri: 'https://auth.example.com/.well-known/jwks.json',
  cache: true,
  cacheMaxAge: 3600000, // 1 hour
  rateLimit: true,
  jwksRequestsPerMinute: 5
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

async function verifyToken(token, issuer, audience) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        algorithms: ['RS256'],
        audience: audience,
        issuer: issuer
      },
      (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      }
    );
  });
}

// Usage
try {
  const payload = await verifyToken(
    token,
    'https://auth.example.com',
    'my-app-id'
  );
  console.log('Verified:', payload);
} catch (error) {
  console.error('Verification failed:', error.message);
}
```

**Why this is better:**
- Automatic JWKS caching (reduces requests)
- Rate limiting (prevents abuse)
- Handles key rotation automatically
- Production-ready error handling

### Node.js best practices

**1. Always pin algorithms**
```javascript
// BAD - accepts any algorithm
jwt.verify(token, key);

// GOOD - pins expected algorithm
jwt.verify(token, key, { algorithms: ['RS256'] });
```

**2. Handle JWKS caching**
```javascript
// Cache JWKS to reduce requests
const client = jwksClient({
  jwksUri: jwksUrl,
  cache: true,
  cacheMaxAge: 3600000 // 1 hour
});
```

**3. Validate all claims**
```javascript
jwt.verify(token, key, {
  algorithms: ['RS256'],
  audience: 'my-app-id', // Must match
  issuer: 'https://auth.example.com', // Must match exactly
  clockTolerance: 60 // Allow clock skew
});
```

**4. Handle errors gracefully**
```javascript
try {
  const decoded = await verifyToken(token, issuer, audience);
  // Use decoded payload
} catch (error) {
  if (error.name === 'TokenExpiredError') {
    // Handle expiration
  } else if (error.name === 'JsonWebTokenError') {
    // Handle invalid token
  } else {
    // Handle other errors
  }
}
```

## Real-world workflows

### Workflow 1: API testing with Postman

**Scenario:** Testing authenticated API endpoints

**Steps:**
1. Login request stores token in environment
2. Pre-request script decodes token
3. Use decoded claims in request URLs/headers
4. Test script verifies token validity

**Example:**
```javascript
// Pre-request Script
const token = pm.environment.get('jwt');
const payload = decodeJWT(token).payload;

// Add user ID to request
pm.request.url.addQueryParams([
  { key: 'userId', value: payload.sub }
]);

// Tests Script
pm.test('Token is valid', () => {
  const payload = decodeJWT(pm.environment.get('jwt')).payload;
  const now = Math.floor(Date.now() / 1000);
  pm.expect(payload.exp).to.be.above(now);
  pm.expect(payload.aud).to.include('my-app-id');
});
```

### Workflow 2: CI/CD pipeline with curl

**Scenario:** Automated testing in CI/CD

**Steps:**
1. Get token from test environment
2. Decode to verify structure
3. Use token in API tests
4. Verify responses

**Example:**
```bash
#!/bin/bash
set -e

# Get token
TOKEN=$(curl -s -X POST "$AUTH_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$TEST_USER\",\"password\":\"$TEST_PASS\"}" \
  | jq -r '.token')

# Decode and verify structure
PAYLOAD=$(echo "$TOKEN" | cut -d. -f2 | tr '_-' '/+' | base64 -d)
EXP=$(echo "$PAYLOAD" | jq -r '.exp')
NOW=$(date +%s)

if [ "$EXP" -lt "$NOW" ]; then
  echo "Token expired"
  exit 1
fi

# Use token in tests
curl -H "Authorization: Bearer $TOKEN" "$API_URL/protected"
```

### Workflow 3: Application middleware with Node.js

**Scenario:** Verify JWTs in Express middleware

**Steps:**
1. Extract token from request
2. Verify signature and claims
3. Attach decoded payload to request
4. Handle errors appropriately

**Example:**
```javascript
const express = require('express');
const { verifyToken } = require('./jwt-utils');

const app = express();

// Middleware to verify JWT
async function verifyJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(
      token,
      process.env.JWT_ISSUER,
      process.env.JWT_AUDIENCE
    );

    // Attach decoded payload to request
    req.user = payload;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Protected route
app.get('/api/protected', verifyJWT, (req, res) => {
  res.json({ user: req.user.sub, message: 'Access granted' });
});
```

## Tips and pitfalls

### Tip 1: Normalize Base64URL before raw decodes

**Problem:** Raw Base64 decoders fail on Base64URL

**Solution:**
```javascript
// Always normalize first
function normalizeBase64URL(str) {
  return str.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - str.length % 4) % 4);
}
```

### Tip 2: Don't treat decoding as verification

**Problem:** Developers trust decoded content

**Solution:**
```javascript
// BAD
const decoded = jwt.decode(token);
if (decoded.roles.includes('admin')) {
  grantAccess(); // UNSAFE!
}

// GOOD
const decoded = jwt.verify(token, key, options);
if (decoded.roles.includes('admin')) {
  grantAccess(); // Safe - verified
}
```

### Tip 3: Refresh JWKS on verification failure

**Problem:** Key rotation causes verification failures

**Solution:**
```javascript
let decoded;
try {
  decoded = await verifyToken(token, issuer, audience);
} catch (error) {
  if (error.name === 'JsonWebTokenError') {
    // Refresh JWKS cache and retry
    await client.getSigningKey(header.kid, { forceRefresh: true });
    decoded = await verifyToken(token, issuer, audience);
  } else {
    throw error;
  }
}
```

### Tip 4: Match iss/aud exactly

**Problem:** Trailing slashes or case differences cause failures

**Solution:**
```javascript
// Normalize issuer URLs
const normalizeIssuer = (url) => url.replace(/\/$/, '');

jwt.verify(token, key, {
  issuer: normalizeIssuer(process.env.JWT_ISSUER),
  audience: process.env.JWT_AUDIENCE
});
```

## Comparison: When to use each tool

| Tool | Best For | Limitations |
|------|----------|-------------|
| **Browser Decoder** | Quick inspection, learning | Manual, one token at a time |
| **Postman** | API testing, test automation | Limited verification capabilities |
| **curl** | Shell scripts, CI/CD | No signature verification |
| **Node.js** | Application code, full verification | Requires Node.js environment |

## Next steps

1. Try quick decoding with our [JWT Encoder/Decoder](/jwt-decoder/) for instant inspection
2. Learn about [Base64URL encoding](/blog/base64url-vs-base64-jwt-decoding/) for manual decodes
3. Understand [JWKS and key rotation](/blog/jwks-kid-key-rotation-decoding/) for RS256 verification
4. Read our [troubleshooting guide](/blog/invalid-jwt-errors-fixes/) for common issues
5. See [safe decoding practices](/blog/jwt-decode-safely/) before verification
