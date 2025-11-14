---
layout: layouts/blog.njk
title: JWKs and kid — How Key Rotation Affects Decoding
description: Understand how JWKS endpoints and kid selection impact JWT verification and debugging.
category: JWT
date: 2025-11-12
readTime: 7
tags: ["blog", "jwt"]
relatedTool: /jwt-decoder/
relatedToolName: JWT Decoder
relatedArticles:
  - /blog/jwt-tokens-explained/
  - /blog/hs256-vs-rs256-decoding/
  - /blog/invalid-jwt-errors-fixes/
faq:
  - question: What does the kid header mean?
    answer: It identifies which key in the JWKS should verify the signature; rotations change which key is valid.
---

When JWT verification suddenly starts failing, key rotation is often the culprit. Understanding how JSON Web Key Sets (JWKS) work and how the `kid` (key ID) header drives key selection helps you debug verification failures and implement robust retry strategies.

## What is JWKS?

**JWKS (JSON Web Key Set)** is a collection of public keys used to verify JWT signatures. Issuers expose JWKS at a well-known endpoint (typically `/.well-known/jwks.json`) so verifiers can fetch the correct keys.

### JWKS structure

A typical JWKS response looks like this:

```json
{
  "keys": [
    {
      "kty": "RSA",
      "kid": "key-2024-01",
      "use": "sig",
      "alg": "RS256",
      "n": "0vx7agoebGcQSuuPiLJXZptN9nndrQmb...",
      "e": "AQAB"
    },
    {
      "kty": "RSA",
      "kid": "key-2024-02",
      "use": "sig",
      "alg": "RS256",
      "n": "1wx8bhpfcHdTvQiLKYXZqtO0oondrRnc...",
      "e": "AQAB"
    }
  ]
}
```

**Key fields:**
- **`kty`** - Key type (`RSA`, `EC`, `oct` for symmetric)
- **`kid`** - Key ID (unique identifier)
- **`use`** - Key usage (`sig` for signatures, `enc` for encryption)
- **`alg`** - Algorithm (`RS256`, `ES256`, `HS256`, etc.)
- **`n`, `e`** - RSA public key material (modulus and exponent)
- **`x`, `y`** - EC public key material (coordinates)
- **`k`** - Symmetric key material (base64url)

### How JWKS works

1. **Issuer generates keys** - Creates public/private key pairs
2. **Issuer publishes JWKS** - Exposes public keys at `/.well-known/jwks.json`
3. **Token includes `kid`** - JWT header specifies which key was used
4. **Verifier fetches JWKS** - Downloads keys from issuer endpoint
5. **Verifier selects key** - Matches `kid` from token header to JWKS
6. **Verifier verifies signature** - Uses selected public key

### Example JWT header with kid

```json
{
  "alg": "RS256",
  "kid": "key-2024-01",
  "typ": "JWT"
}
```

The `kid` tells the verifier: "Use the key with ID `key-2024-01` from the JWKS to verify this token."

## Understanding key rotation

### Why rotate keys?

**Security reasons:**
- Compromised keys need replacement
- Regular rotation reduces attack window
- Compliance requirements (PCI DSS, SOC 2)
- Time-based rotation policies

**Operational reasons:**
- Key expiration
- Algorithm upgrades
- Multi-tenant key isolation

### Rotation scenarios

#### Scenario 1: Gradual rotation (recommended)

**What happens:**
1. New key added to JWKS (`kid: "key-2024-02"`)
2. Old key retained (`kid: "key-2024-01"`)
3. New tokens use new key
4. Old tokens still verify with old key
5. After old tokens expire, old key removed

**Timeline:**
```
Day 1:  JWKS = [key-2024-01]
Day 30: JWKS = [key-2024-01, key-2024-02]  ← New key added
Day 60: JWKS = [key-2024-01, key-2024-02]  ← Both active
Day 90: JWKS = [key-2024-02]                ← Old key removed
```

**Why this works:**
- No service interruption
- Old tokens continue working
- Smooth transition

**Implementation:**
```javascript
// Issuer adds new key but keeps old one
const jwks = {
  keys: [
    { kid: "key-2024-01", ... },  // Old key (still valid)
    { kid: "key-2024-02", ... }   // New key (active)
  ]
};
```

#### Scenario 2: Immediate rotation (risky)

**What happens:**
1. Old key removed from JWKS
2. New key added
3. Tokens signed with old key fail verification

**Problem:**
- Active tokens become invalid
- Service disruption
- User sessions break

**When it happens:**
- Emergency key compromise
- Configuration mistakes
- Forced rotation without planning

**Example failure:**
```javascript
// Token signed with old key
const token = {
  header: { alg: "RS256", kid: "key-2024-01" },
  // ...
};

// JWKS no longer has key-2024-01
const jwks = {
  keys: [
    { kid: "key-2024-02", ... }  // Only new key
  ]
};

// Verification fails!
verify(token, jwks); // Error: Key not found
```

#### Scenario 3: Multi-tenant/issuer

**What happens:**
- Different issuers have different JWKS endpoints
- Each tenant may have separate keys
- Verifier must fetch correct JWKS per issuer

**Example:**
```javascript
// Tenant A tokens
const tenantAToken = {
  header: { kid: "tenant-a-key-1" },
  payload: { iss: "https://tenant-a.example.com" }
};

// Tenant B tokens
const tenantBToken = {
  header: { kid: "tenant-b-key-1" },
  payload: { iss: "https://tenant-b.example.com" }
};

// Different JWKS endpoints
const tenantAJwks = await fetch('https://tenant-a.example.com/.well-known/jwks.json');
const tenantBJwks = await fetch('https://tenant-b.example.com/.well-known/jwks.json');
```

## How verifiers select keys

### The kid matching process

**Step-by-step:**

1. **Decode token header** - Extract `kid` and `alg`
2. **Fetch JWKS** - Download from issuer endpoint
3. **Find matching key** - Search JWKS for `kid` match
4. **Verify algorithm** - Ensure `alg` matches expected
5. **Verify signature** - Use selected key

### Common mistakes

#### Mistake 1: Ignoring kid

**Wrong approach:**
```javascript
// BAD - tries all keys
function verifyToken(token, jwks) {
  for (const key of jwks.keys) {
    try {
      return verify(token, key);  // Tries every key!
    } catch (e) {
      continue;
    }
  }
  throw new Error('Verification failed');
}
```

**Why it's bad:**
- Security risk (wrong key might accidentally verify)
- Performance issue (tries multiple keys)
- Violates JWT spec

**Correct approach:**
```javascript
// GOOD - uses kid to select key
function verifyToken(token, jwks) {
  const header = decodeHeader(token);
  const key = jwks.keys.find(k => k.kid === header.kid);
  
  if (!key) {
    throw new Error(`Key with kid ${header.kid} not found`);
  }
  
  return verify(token, key);
}
```

#### Mistake 2: Not validating algorithm

**Wrong approach:**
```javascript
// BAD - doesn't check algorithm
function verifyToken(token, jwks) {
  const key = findKeyByKid(token, jwks);
  return verify(token, key);  // Uses whatever alg is in key
}
```

**Why it's bad:**
- Algorithm confusion attacks
- Could accept wrong algorithm
- Security vulnerability

**Correct approach:**
```javascript
// GOOD - validates algorithm
function verifyToken(token, jwks, allowedAlgorithms) {
  const header = decodeHeader(token);
  
  // Check algorithm is allowed
  if (!allowedAlgorithms.includes(header.alg)) {
    throw new Error(`Algorithm ${header.alg} not allowed`);
  }
  
  const key = findKeyByKid(token, jwks);
  
  // Ensure key algorithm matches
  if (key.alg && key.alg !== header.alg) {
    throw new Error('Algorithm mismatch');
  }
  
  return verify(token, key);
}
```

#### Mistake 3: Not caching JWKS

**Wrong approach:**
```javascript
// BAD - fetches JWKS on every request
async function verifyToken(token) {
  const jwks = await fetch('https://issuer.com/.well-known/jwks.json');
  return verify(token, jwks);
}
```

**Why it's bad:**
- Performance overhead
- Rate limiting issues
- Unnecessary network calls

**Correct approach:**
```javascript
// GOOD - caches JWKS with TTL
const jwksCache = new Map();

async function getJwks(issuer, forceRefresh = false) {
  const cacheKey = issuer;
  const cached = jwksCache.get(cacheKey);
  
  // Return cached if still valid
  if (!forceRefresh && cached && Date.now() < cached.expiresAt) {
    return cached.jwks;
  }
  
  // Fetch fresh JWKS
  const jwks = await fetch(`${issuer}/.well-known/jwks.json`).then(r => r.json());
  
  // Cache with 1 hour TTL
  jwksCache.set(cacheKey, {
    jwks,
    expiresAt: Date.now() + 3600000
  });
  
  return jwks;
}
```

## Robust retry strategy

### The problem

When key rotation happens:
1. Your cached JWKS is stale
2. Token verification fails
3. You need fresh JWKS
4. Retry verification

### Implementation

**Basic retry pattern:**
```javascript
async function verifyTokenWithRetry(token, issuer) {
  try {
    // First attempt with cached JWKS
    const jwks = await getJwks(issuer);
    return verifyToken(token, jwks);
  } catch (error) {
    // If verification fails, refresh JWKS and retry once
    if (error.message.includes('Key not found') || 
        error.message.includes('kid')) {
      const freshJwks = await getJwks(issuer, forceRefresh = true);
      return verifyToken(token, freshJwks);
    }
    throw error;  // Re-throw if not a key issue
  }
}
```

**Enhanced retry with logging:**
```javascript
async function verifyTokenWithRetry(token, issuer, options = {}) {
  const maxRetries = options.maxRetries || 1;
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const forceRefresh = attempt > 0;  // Refresh on retry
      const jwks = await getJwks(issuer, forceRefresh);
      return verifyToken(token, jwks);
    } catch (error) {
      lastError = error;
      
      // Only retry on key-related errors
      if (error.message.includes('Key not found') || 
          error.message.includes('kid') ||
          error.message.includes('signature')) {
        
        if (attempt < maxRetries) {
          console.warn(`Verification failed, retrying (attempt ${attempt + 1})`, {
            issuer,
            kid: decodeHeader(token).kid,
            error: error.message
          });
          continue;
        }
      }
      
      // Don't retry for other errors
      throw error;
    }
  }
  
  throw lastError;
}
```

### When to retry

**Retry on:**
- ✅ Key not found (`kid` missing from JWKS)
- ✅ Signature verification failure (might be stale key)
- ✅ JWKS fetch errors (network issues)

**Don't retry on:**
- ❌ Token expired (`exp` claim)
- ❌ Invalid token format
- ❌ Algorithm not allowed
- ❌ Issuer mismatch

## Real-world implementation examples

### Node.js with jwks-rsa

**Using `jwks-rsa` library:**
```javascript
const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');

const client = jwksClient({
  jwksUri: 'https://issuer.com/.well-known/jwks.json',
  cache: true,
  cacheMaxAge: 3600000,  // 1 hour
  rateLimit: true,
  jwksRequestsPerMinute: 5
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    callback(null, key.getPublicKey());
  });
}

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {
      algorithms: ['RS256'],  // Pin allowed algorithms
      issuer: 'https://issuer.com',
      audience: 'my-api'
    }, (err, decoded) => {
      if (err) {
        // Retry logic could go here
        return reject(err);
      }
      resolve(decoded);
    });
  });
}
```

### Python with PyJWT

**Using `PyJWT` with `cryptography`:**
```python
import jwt
import requests
from functools import lru_cache
from datetime import datetime, timedelta

@lru_cache(maxsize=1)
def get_jwks(issuer, ttl=3600):
    """Fetch and cache JWKS with TTL"""
    response = requests.get(f"{issuer}/.well-known/jwks.json")
    response.raise_for_status()
    return response.json()

def get_signing_key(token, issuer):
    """Get signing key from JWKS based on kid"""
    header = jwt.get_unverified_header(token)
    kid = header.get('kid')
    
    if not kid:
        raise ValueError('Token missing kid header')
    
    jwks = get_jwks(issuer)
    
    # Find key by kid
    for key in jwks.get('keys', []):
        if key.get('kid') == kid:
            return key
    
    raise ValueError(f'Key with kid {kid} not found in JWKS')

def verify_token_with_retry(token, issuer, max_retries=1):
    """Verify token with JWKS retry on key rotation"""
    for attempt in range(max_retries + 1):
        try:
            key = get_signing_key(token, issuer)
            decoded = jwt.decode(
                token,
                key,
                algorithms=['RS256'],
                issuer=issuer,
                audience='my-api'
            )
            return decoded
        except (jwt.InvalidTokenError, ValueError) as e:
            if attempt < max_retries and 'kid' in str(e):
                # Clear cache and retry
                get_jwks.cache_clear()
                continue
            raise
```

## Troubleshooting common issues

### Issue 1: Wrong issuer URL

**Symptom:**
```
Error: Key with kid "key-123" not found in JWKS
```

**Cause:**
- Fetching JWKS from wrong endpoint
- Issuer URL mismatch

**Solution:**
```javascript
// Extract issuer from token
const payload = decodePayload(token);
const issuer = payload.iss;  // Use exact issuer from token

// Fetch JWKS from issuer's well-known endpoint
const jwksUri = `${issuer}/.well-known/jwks.json`;
const jwks = await fetch(jwksUri).then(r => r.json());
```

**Common mistakes:**
- Hardcoding issuer URL
- Not handling trailing slashes
- Using wrong environment (dev vs prod)

### Issue 2: Stale JWKS cache

**Symptom:**
```
Verification fails after key rotation
```

**Cause:**
- Cached JWKS doesn't have new key
- TTL too long

**Solution:**
```javascript
// Shorter TTL during rotation windows
const jwksCache = {
  ttl: 300000,  // 5 minutes instead of 1 hour
  // ...
};

// Or implement cache invalidation
function invalidateJwksCache(issuer) {
  jwksCache.delete(issuer);
}
```

### Issue 3: Algorithm mismatch

**Symptom:**
```
Error: Algorithm not allowed
```

**Cause:**
- Token uses different algorithm than expected
- Key algorithm doesn't match token algorithm

**Solution:**
```javascript
// Pin allowed algorithms
const allowedAlgorithms = ['RS256'];  // Only RS256

// Verify algorithm matches
const header = decodeHeader(token);
if (!allowedAlgorithms.includes(header.alg)) {
  throw new Error(`Algorithm ${header.alg} not allowed`);
}

// Ensure key algorithm matches
const key = findKeyByKid(token, jwks);
if (key.alg && key.alg !== header.alg) {
  throw new Error('Algorithm mismatch between token and key');
}
```

### Issue 4: Multiple issuers/tenants

**Symptom:**
```
Verification fails for some tenants but not others
```

**Cause:**
- Using wrong JWKS for tenant
- Not isolating keys per tenant

**Solution:**
```javascript
// Cache JWKS per issuer
const jwksCache = new Map();

async function getJwksForIssuer(issuer) {
  if (!jwksCache.has(issuer)) {
    const jwks = await fetch(`${issuer}/.well-known/jwks.json`).then(r => r.json());
    jwksCache.set(issuer, jwks);
  }
  return jwksCache.get(issuer);
}

// Use issuer from token
function verifyToken(token) {
  const payload = decodePayload(token);
  const issuer = payload.iss;
  const jwks = await getJwksForIssuer(issuer);
  return verifyToken(token, jwks);
}
```

## Best practices summary

1. **Cache JWKS with TTL** - Reduce network calls, refresh periodically
2. **Select key by kid** - Never try all keys, always match `kid`
3. **Pin allowed algorithms** - Prevent algorithm confusion attacks
4. **Implement retry logic** - Refresh JWKS on verification failure
5. **Handle multiple issuers** - Cache JWKS per issuer
6. **Log key rotation events** - Monitor for rotation issues
7. **Validate issuer** - Ensure `iss` claim matches expected
8. **Use libraries** - `jwks-rsa`, `PyJWT` handle edge cases

## Debugging with JWT Decoder

Our [JWT Decoder](/jwt-decoder/) helps you:
- Inspect `kid` in token header
- View `iss` claim to identify issuer
- Check `alg` to verify algorithm
- Decode without verification (for debugging)

**Example debugging flow:**
1. Decode token to see `kid` and `iss`
2. Fetch JWKS from `iss/.well-known/jwks.json`
3. Check if `kid` exists in JWKS
4. Verify algorithm matches
5. Test signature verification

## Next steps

1. Decode tokens with our [JWT Decoder](/jwt-decoder/) to inspect `kid` and `iss`
2. Learn about [HS256 vs RS256](/blog/hs256-vs-rs256-decoding/) algorithms
3. Understand [JWT errors and fixes](/blog/invalid-jwt-errors-fixes/) for common issues
4. Read [JWT tokens explained](/blog/jwt-tokens-explained/) for fundamentals
