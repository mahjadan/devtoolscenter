---
layout: layouts/blog.njk
title: HS256 vs RS256 — What Changes When Decoding?
description: Understand differences between symmetric and asymmetric JWT algorithms and what you can infer at decode time.
category: JWT
date: 2025-11-12
readTime: 7
tags: ["blog", "jwt"]
relatedTool: /jwt-decoder/
relatedToolName: JWT Encoder/Decoder
relatedArticles:
  - /blog/jwt-tokens-explained/
  - /blog/jwks-kid-key-rotation-decoding/
  - /blog/jwt-decode-safely/
faq:
  - question: Can I know the algorithm from the header?
    answer: Yes. The header alg field indicates HS256, RS256, etc., but validation must match the expected algorithm server-side.
---

At decode time, you can read `alg` and `kid` from the header. Understanding why HS256 and RS256 differ—and how to verify each correctly—prevents security vulnerabilities and helps you debug authentication failures.

## Why algorithms matter

The `alg` field in the JWT header tells you which cryptographic algorithm was used to sign the token. This matters because:

1. **Different algorithms require different keys** - HS256 needs a shared secret, RS256 needs a public/private key pair
2. **Security properties differ** - Symmetric vs asymmetric cryptography have different trade-offs
3. **Verification process differs** - You can't verify an RS256 token with an HS256 secret

## HS256 vs RS256: fundamental differences

### HS256 (HMAC with SHA-256) - Symmetric

**How it works:**
- Uses a single shared secret that both signs and verifies tokens
- Same secret on both issuer and verifier sides
- Fast computation, simple implementation

**Why it's used:**
- Single-tenant applications
- Internal microservices with shared secrets
- High-performance scenarios where speed matters

**Security considerations:**
- Secret must be distributed securely to all verifiers
- If secret leaks, attacker can forge tokens
- Key rotation requires updating all services simultaneously

### RS256 (RSA Signature with SHA-256) - Asymmetric

**How it works:**
- Private key signs tokens (only issuer has this)
- Public key verifies tokens (can be distributed widely)
- Public key can be fetched from JWKS endpoint

**Why it's used:**
- Multi-tenant SaaS applications
- Public APIs where verifiers can't share secrets
- Scenarios requiring key rotation without service restarts

**Security considerations:**
- Public key distribution is safer (can't forge tokens with public key)
- Key rotation via JWKS without code changes
- More complex implementation but better for distributed systems

## What decoding reveals

When you decode a JWT header, you see:

```json
{
  "alg": "RS256",
  "kid": "abc123",
  "typ": "JWT"
}
```

**`alg` field:**
- Shows which algorithm was used
- **Critical**: Must match your application's expected algorithm
- Never auto-accept tokens with unexpected algorithms (algorithm confusion attack)

**`kid` field (Key ID):**
- Identifies which key from JWKS should verify this token
- Essential for key rotation scenarios
- Only present for RS256/ES256 (asymmetric algorithms)

Use our [JWT Encoder/Decoder](/jwt-decoder/) to quickly inspect the header and see which algorithm a token uses.

## Verification differences explained

### HS256 verification

**Why it's simple:**
You already have the secret, so verification is straightforward—just use the same secret that signed it.

**How to verify:**
```javascript
const jwt = require('jsonwebtoken');

// Verify with shared secret
const decoded = jwt.verify(token, process.env.JWT_SECRET, {
  algorithms: ['HS256'], // Pin algorithm - critical!
  audience: 'your-app-id',
  issuer: 'https://your-issuer.com'
});

console.log('User:', decoded.sub);
```

**Common mistakes:**
- Not pinning algorithms (allows algorithm confusion attacks)
- Using wrong secret (dev vs prod environments)
- Not validating `aud` and `iss` claims

### RS256 verification

**Why it's more complex:**
You need to fetch the public key from the issuer's JWKS endpoint, select the right key by `kid`, convert it to PEM format, then verify.

**How to verify:**
```javascript
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Decode header to get kid
const [headerSegment] = token.split('.');
const header = JSON.parse(
  Buffer.from(headerSegment, 'base64url').toString()
);

// Setup JWKS client
const client = jwksClient({
  jwksUri: `${issuer}/.well-known/jwks.json`,
  cache: true,
  cacheMaxAge: 86400000 // 24 hours
});

// Get signing key
const key = await client.getSigningKey(header.kid);
const publicKey = key.getPublicKey();

// Verify token
const decoded = jwt.verify(token, publicKey, {
  algorithms: ['RS256'], // Pin algorithm
  audience: 'your-app-id',
  issuer: issuer
});
```

**Why JWKS is needed:**
- Issuers rotate keys periodically for security
- Multiple keys can be active simultaneously (old tokens still valid)
- `kid` tells you which key to use from the JWKS set

## Real-world scenarios

### Scenario 1: Algorithm mismatch error

**Problem:** Token decodes fine but verification fails with "invalid signature"

**Why it happens:**
- Token was signed with RS256 but you're verifying with HS256 secret
- Or vice versa

**How to fix:**
1. Decode the header to see `alg` field using [JWT Encoder/Decoder](/jwt-decoder/)
2. Match your verification code to the algorithm in the header
3. For RS256, ensure you're fetching JWKS and using public key
4. For HS256, ensure you're using the correct shared secret

### Scenario 2: Key rotation failure

**Problem:** Tokens that worked yesterday now fail verification

**Why it happens:**
- Issuer rotated keys and removed old key from JWKS
- Your JWKS cache is stale
- Token signed with old key but JWKS only has new key

**How to fix:**
```javascript
// Refresh JWKS on verification failure
let decoded;
try {
  decoded = jwt.verify(token, cachedPublicKey, options);
} catch (error) {
  if (error.name === 'JsonWebTokenError') {
    // Refresh JWKS and retry
    await client.getSigningKey(header.kid, (err, key) => {
      if (err) throw err;
      const freshPublicKey = key.getPublicKey();
      decoded = jwt.verify(token, freshPublicKey, options);
    });
  } else {
    throw error;
  }
}
```

### Scenario 3: Multi-tenant application

**Problem:** Need to verify tokens from multiple issuers

**Why RS256 helps:**
- Each tenant can have their own JWKS endpoint
- Public keys can be fetched independently
- No shared secrets to manage

**How to implement:**
```javascript
// Determine issuer from token
const { iss } = jwt.decode(token, { complete: false });

// Get JWKS client for this issuer
const client = getJwksClientForIssuer(iss);

// Verify with issuer-specific key
const key = await client.getSigningKey(header.kid);
const decoded = jwt.verify(token, key.getPublicKey(), {
  algorithms: ['RS256'],
  issuer: iss
});
```

## Security best practices

### 1. Always pin algorithms

**Never do this:**
```javascript
// BAD - accepts any algorithm
jwt.verify(token, secret);
```

**Always do this:**
```javascript
// GOOD - pins expected algorithm
jwt.verify(token, secret, { algorithms: ['HS256'] });
```

**Why:** Prevents algorithm confusion attacks where an attacker creates a token with `alg: none` or a weaker algorithm.

### 2. Validate all claims

Don't just verify the signature—check claims too:

```javascript
jwt.verify(token, key, {
  algorithms: ['RS256'],
  audience: 'your-app-id', // Must match
  issuer: 'https://issuer.com', // Must match exactly
  clockTolerance: 60 // Allow 60s clock skew
});
```

### 3. Handle key rotation gracefully

```javascript
// Cache JWKS but refresh on failure
const client = jwksClient({
  jwksUri: jwksUrl,
  cache: true,
  cacheMaxAge: 3600000, // 1 hour
  rateLimit: true,
  jwksRequestsPerMinute: 5
});
```

## Choosing the right algorithm

**Use HS256 when:**
- Single application or trusted microservices
- Performance is critical
- You can securely distribute secrets
- Key rotation can be coordinated across services

**Use RS256 when:**
- Multi-tenant SaaS applications
- Public APIs with many verifiers
- Need key rotation without downtime
- Verifiers can't share secrets securely

## Debugging tips

1. **Decode first** - Use [JWT Encoder/Decoder](/jwt-decoder/) to see `alg` and `kid` before debugging verification
2. **Check algorithm match** - Ensure your verification code uses the same algorithm as the token header
3. **Verify JWKS access** - For RS256, ensure you can fetch `/.well-known/jwks.json` from the issuer
4. **Check key selection** - For RS256, verify `kid` in header matches a key in JWKS
5. **Validate claims** - Signature verification can pass but claims might be invalid (wrong `aud`, expired `exp`)

## Next steps

1. Decode a token with our [JWT Encoder/Decoder](/jwt-decoder/) to see the `alg` field
2. Learn about [JWKS and key rotation](/blog/jwks-kid-key-rotation-decoding/) for RS256
3. Understand [safe decoding practices](/blog/jwt-decode-safely/) before verification
4. Read our [troubleshooting guide](/blog/invalid-jwt-errors-fixes/) for common errors
