---
layout: layouts/blog.njk
title: When Not to Trust a Decoded JWT
description: Decoding is not validation. Learn when decoded claims are untrustworthy without signature checks.
category: JWT
date: 2025-11-12
readTime: 6
tags: ["blog", "jwt"]
relatedTool: /jwt-decoder/
relatedToolName: JWT Encoder/Decoder
relatedArticles:
  - /blog/jwt-tokens-explained/
  - /blog/jwt-decode-safely/
  - /blog/jwt-authorization-vs-authentication-decoding/
faq:
  

    answer: No. Anyone can craft claims; only signature verification and claim checks make them trustworthy.
---

Never make authorization decisions based on decoded content alone. This critical security principle prevents attackers from forging tokens and gaining unauthorized access. Understanding why decoded JWTs are untrustworthy and how to verify them properly protects your applications from common vulnerabilities.

## Why decoding isn't trust

### The fundamental problem

**Anyone can create a JWT with any claims.**

JWTs are just Base64URL-encoded JSON. There's no magic that prevents someone from creating a fake token:

```javascript
// An attacker can easily create this:
const fakeToken = createJWT({
  header: { alg: 'HS256', typ: 'JWT' },
  payload: {
    sub: 'admin',
    roles: ['superuser'],
    exp: Math.floor(Date.now() / 1000) + 3600 // Future expiration
  },
  signature: 'fake-signature' // Doesn't matter - you're not verifying!
});

// Decoding this fake token works perfectly:
const decoded = jwt.decode(fakeToken);
console.log(decoded.payload.roles); // ['superuser']
// But this token is completely fake!
```

**What decoding reveals:**
- What claims someone put in the token
- Token structure and format
- Expiration times and metadata

**What decoding doesn't prove:**
- Who created the token
- Whether claims are true
- Whether token is authentic
- Whether token is authorized for your application

### Real-world attack scenario

**The vulnerability:**
```javascript
// VULNERABLE CODE - Never do this!
app.get('/api/admin', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const decoded = jwt.decode(token); // No verification!
  
  if (decoded.roles?.includes('admin')) {
    // Grant admin access
    res.json({ secret: 'admin-only-data' });
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
});
```

**How an attacker exploits it:**
1. Attacker creates fake token with `roles: ['admin']`
2. Attacker sends token to `/api/admin`
3. Server decodes token (no verification)
4. Server sees `roles: ['admin']` and grants access
5. Attacker gains unauthorized admin access

**The fix:**
```javascript
// SECURE CODE - Always verify!
app.get('/api/admin', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  try {
    // Verify signature and claims
    const decoded = await jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      audience: 'my-app-id',
      issuer: 'https://auth.example.com'
    });
    
    if (decoded.roles?.includes('admin')) {
      res.json({ secret: 'admin-only-data' });
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

## What must be validated

### 1. Signature verification

**Why it's critical:**
The signature is cryptographic proof that the token was created by the issuer with the correct key.

**How to verify:**

**For HS256 (symmetric):**
```javascript
const jwt = require('jsonwebtoken');

// Verify with shared secret
const decoded = jwt.verify(token, process.env.JWT_SECRET, {
  algorithms: ['HS256'] // Pin algorithm!
});
```

**For RS256 (asymmetric):**
```javascript
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Setup JWKS client
const client = jwksClient({
  jwksUri: 'https://issuer.com/.well-known/jwks.json'
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    callback(null, key.getPublicKey());
  });
}

// Verify with public key from JWKS
jwt.verify(token, getKey, {
  algorithms: ['RS256'],
  audience: 'my-app-id',
  issuer: 'https://issuer.com'
});
```

**What happens if signature is invalid:**
- Verification throws an error
- Token is rejected
- No access granted

### 2. Issuer (`iss`) validation

**Why it matters:**
Ensures the token came from the expected authentication provider.

**Common mistakes:**
```javascript
// BAD - no issuer check
const decoded = jwt.verify(token, key, { algorithms: ['RS256'] });

// BAD - wrong issuer
const decoded = jwt.verify(token, key, {
  algorithms: ['RS256'],
  issuer: 'https://wrong-issuer.com' // Wrong!
});

// GOOD - correct issuer
const decoded = jwt.verify(token, key, {
  algorithms: ['RS256'],
  issuer: 'https://auth.example.com' // Must match exactly
});
```

**Why exact match matters:**
- Prevents tokens from other issuers
- Protects against issuer confusion attacks
- Ensures tokens are from trusted source

**Common pitfalls:**
- Trailing slash differences (`https://issuer.com` vs `https://issuer.com/`)
- Protocol differences (`http://` vs `https://`)
- Subdomain differences (`auth.example.com` vs `api.example.com`)

### 3. Audience (`aud`) validation

**Why it matters:**
Ensures the token was issued for your specific application.

**What happens without audience check:**
```javascript
// Attacker gets token for different app
const tokenForOtherApp = getTokenFromOtherApp();

// Your app accepts it (no audience check)
const decoded = jwt.verify(tokenForOtherApp, key, {
  algorithms: ['RS256']
  // No audience check - VULNERABILITY!
});

// Attacker gains access to your app
```

**How to fix:**
```javascript
// Verify audience matches your app
const decoded = jwt.verify(token, key, {
  algorithms: ['RS256'],
  audience: 'my-app-id' // Must match
});
```

**Audience can be:**
- String: `"my-app-id"`
- Array: `["app1", "app2"]` (your app must be included)

### 4. Time window validation

**Why it matters:**
Prevents use of expired tokens or tokens not yet valid.

**Expiration (`exp`):**
```javascript
// Token expires at exp (Unix timestamp)
const now = Math.floor(Date.now() / 1000);
if (decoded.exp < now) {
  throw new Error('Token expired');
}
```

> 💡 **Tip:** Convert Unix timestamps to readable dates using our [Timestamp Converter](/timestamp-converter/) tool.

**Not Before (`nbf`):**
```javascript
// Token not valid before nbf
if (decoded.nbf && decoded.nbf > now) {
  throw new Error('Token not yet valid');
}
```

> 💡 **Tip:** Convert Unix timestamps to readable dates using our [Timestamp Converter](/timestamp-converter/) tool.

**Clock tolerance:**
```javascript
// Allow small clock differences
jwt.verify(token, key, {
  algorithms: ['RS256'],
  clockTolerance: 60 // Allow 60 seconds of skew
});
```

**Why clock tolerance:**
- Servers may have slightly different times
- Network delays can cause timing issues
- Prevents false rejections due to minor time differences

### 5. Custom constraints

**Why they matter:**
Application-specific validation prevents unauthorized access.

**Examples:**

**Tenant/Organization:**
```javascript
const decoded = jwt.verify(token, key, options);

// Verify tenant matches
if (decoded.tenant !== expectedTenant) {
  throw new Error('Invalid tenant');
}
```

**Scopes/Roles:**
```javascript
const decoded = jwt.verify(token, key, options);

// Verify required scope
if (!decoded.scope?.includes('read:users')) {
  throw new Error('Insufficient scope');
}
```

**Nonce (replay protection):**
```javascript
const decoded = jwt.verify(token, key, options);

// Check nonce hasn't been used
if (nonceCache.has(decoded.nonce)) {
  throw new Error('Token already used');
}
nonceCache.add(decoded.nonce);
```

**Token ID (`jti`):**
```javascript
const decoded = jwt.verify(token, key, options);

// Check if token was revoked
if (revokedTokens.has(decoded.jti)) {
  throw new Error('Token revoked');
}
```

## Practical guardrails

### Guardrail 1: Pin algorithms

**Why:** Prevents algorithm confusion attacks where attackers use weaker algorithms.

**How:**
```javascript
// BAD - accepts any algorithm
jwt.verify(token, key);

// GOOD - pins expected algorithm
jwt.verify(token, key, {
  algorithms: ['RS256'] // Only RS256 allowed
});
```

**What happens if you don't pin:**
- Attacker creates token with `alg: none` (no signature)
- Attacker creates token with weaker algorithm
- Your app accepts it → security breach

### Guardrail 2: Fetch JWKS securely

**Why:** JWKS contains public keys—must be fetched securely to prevent man-in-the-middle attacks.

**How:**
```javascript
// GOOD - HTTPS only
const jwksUri = 'https://issuer.com/.well-known/jwks.json';

// BAD - HTTP allows MITM attacks
const jwksUri = 'http://issuer.com/.well-known/jwks.json'; // Never!
```

**Additional security:**
```javascript
const client = jwksClient({
  jwksUri: jwksUrl,
  cache: true,
  cacheMaxAge: 3600000,
  // Verify SSL certificate
  requestAgent: new https.Agent({
    rejectUnauthorized: true // Verify certificates
  })
});
```

### Guardrail 3: Select key strictly by `kid`

**Why:** Prevents key confusion attacks.

**How:**
```javascript
// GOOD - select by kid from header
const header = jwt.decode(token, { complete: true }).header;
const key = jwks.keys.find(k => k.kid === header.kid);

// BAD - try all keys
for (const key of jwks.keys) {
  try {
    jwt.verify(token, key); // Tries all keys - insecure!
    break;
  } catch (e) {}
}
```

**Why strict selection matters:**
- Each token specifies which key to use (`kid`)
- Trying all keys allows key confusion attacks
- Must match `kid` exactly

### Guardrail 4: Reject missing or mismatched claims

**Why:** Missing claims or mismatches indicate invalid or malicious tokens.

**How:**
```javascript
const decoded = jwt.verify(token, key, {
  algorithms: ['RS256'],
  audience: 'my-app-id',
  issuer: 'https://auth.example.com'
});

// Additional validation
if (!decoded.sub) {
  throw new Error('Missing subject claim');
}

if (!decoded.roles || !Array.isArray(decoded.roles)) {
  throw new Error('Invalid roles claim');
}

if (decoded.tenant !== expectedTenant) {
  throw new Error('Tenant mismatch');
}
```

## Common vulnerabilities

### Vulnerability 1: Trusting decoded content

**The mistake:**
```javascript
// VULNERABLE
const decoded = jwt.decode(token);
if (decoded.roles.includes('admin')) {
  grantAdminAccess();
}
```

**Why it's dangerous:**
- No signature verification
- Anyone can create fake token
- Complete security bypass

**The fix:**
```javascript
// SECURE
const decoded = jwt.verify(token, key, options);
if (decoded.roles.includes('admin')) {
  grantAdminAccess();
}
```

### Vulnerability 2: Skipping claim validation

**The mistake:**
```javascript
// VULNERABLE - only checks signature
const decoded = jwt.verify(token, key, {
  algorithms: ['RS256']
  // No audience or issuer check!
});
```

**Why it's dangerous:**
- Token from different issuer accepted
- Token for different app accepted
- Cross-tenant access possible

**The fix:**
```javascript
// SECURE - validates all claims
const decoded = jwt.verify(token, key, {
  algorithms: ['RS256'],
  audience: 'my-app-id',
  issuer: 'https://auth.example.com'
});
```

### Vulnerability 3: Not checking expiration

**The mistake:**
```javascript
// VULNERABLE - no expiration check
const decoded = jwt.verify(token, key, {
  algorithms: ['RS256']
  // No exp check!
});
// Use token forever
```

**Why it's dangerous:**
- Expired tokens still work
- Revoked tokens still work
- No way to invalidate tokens

**The fix:**
```javascript
// SECURE - expiration checked automatically
const decoded = jwt.verify(token, key, {
  algorithms: ['RS256'],
  audience: 'my-app-id',
  issuer: 'https://auth.example.com'
  // exp checked automatically by jwt.verify
});
```

### Vulnerability 4: Algorithm confusion

**The mistake:**
```javascript
// VULNERABLE - no algorithm pinning
const decoded = jwt.verify(token, key);
// Accepts any algorithm!
```

**Why it's dangerous:**
- Attacker uses `alg: none` (no signature)
- Attacker uses weaker algorithm
- Signature verification bypassed

**The fix:**
```javascript
// SECURE - algorithm pinned
const decoded = jwt.verify(token, key, {
  algorithms: ['RS256'] // Only RS256 allowed
});
```

## Safer flow: Decode → Verify → Authorize

### Step 1: Decode for visibility (never for trust)

**Purpose:** Inspect token structure and claims for debugging.

**How:**
```javascript
// Decode to see what's in the token
const decoded = jwt.decode(token, { complete: true });
console.log('Algorithm:', decoded.header.alg);
console.log('Expires:', new Date(decoded.payload.exp * 1000));
console.log('User:', decoded.payload.sub);

// Use our JWT Encoder/Decoder tool for quick inspection
// /jwt-decoder/
```

**What you can learn:**
- Token structure
- Algorithm used
- Claims present
- Expiration time

**What you can't trust:**
- Any claim value
- Token authenticity
- Authorization decisions

### Step 2: Verify signature and standard claims

**Purpose:** Cryptographically prove token is authentic and valid.

**How:**
```javascript
// Verify signature and claims
const decoded = jwt.verify(token, key, {
  algorithms: ['RS256'], // Pin algorithm
  audience: 'my-app-id', // Verify audience
  issuer: 'https://auth.example.com', // Verify issuer
  clockTolerance: 60 // Allow clock skew
});

// Now decoded.payload is trustworthy
```

**What verification proves:**
- Token was created by issuer
- Token hasn't been tampered with
- Token is for your application
- Token hasn't expired

### Step 3: Authorize based on roles/scopes (after verification)

**Purpose:** Make authorization decisions based on verified claims.

**How:**
```javascript
// After verification, check authorization
const decoded = jwt.verify(token, key, options);

// Now safe to check roles/scopes
if (decoded.roles?.includes('admin')) {
  // Grant admin access
} else if (decoded.scope?.includes('read:users')) {
  // Grant read access
} else {
  // Deny access
}
```

**Why this order matters:**
- Verification proves authenticity
- Authorization uses verified claims
- No security bypass possible

## Real-world examples

### Example 1: API endpoint protection

**Vulnerable implementation:**
```javascript
// VULNERABLE - trusts decoded content
app.get('/api/users', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const decoded = jwt.decode(token); // No verification!
  
  if (decoded.scope?.includes('read:users')) {
    res.json(getAllUsers());
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
});
```

**Secure implementation:**
```javascript
// SECURE - verifies before authorizing
app.get('/api/users', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  try {
    // Step 1: Verify
    const decoded = await jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      audience: 'my-app-id',
      issuer: 'https://auth.example.com'
    });
    
    // Step 2: Authorize (after verification)
    if (decoded.scope?.includes('read:users')) {
      res.json(getAllUsers());
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

### Example 2: Multi-tenant application

**Vulnerable implementation:**
```javascript
// VULNERABLE - no tenant validation
app.get('/api/data', (req, res) => {
  const decoded = jwt.decode(req.headers.authorization);
  const data = getDataForTenant(decoded.tenant); // No verification!
  res.json(data);
});
```

**Secure implementation:**
```javascript
// SECURE - verifies tenant claim
app.get('/api/data', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  try {
    // Verify token
    const decoded = await jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      audience: 'my-app-id',
      issuer: 'https://auth.example.com'
    });
    
    // Validate tenant (after verification)
    if (!decoded.tenant) {
      return res.status(403).json({ error: 'Missing tenant' });
    }
    
    // Get data for verified tenant
    const data = getDataForTenant(decoded.tenant);
    res.json(data);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

### Example 3: Role-based access control

**Vulnerable implementation:**
```javascript
// VULNERABLE - trusts decoded roles
function isAdmin(token) {
  const decoded = jwt.decode(token);
  return decoded.roles?.includes('admin'); // No verification!
}
```

**Secure implementation:**
```javascript
// SECURE - verifies before checking roles
async function isAdmin(token, publicKey) {
  try {
    // Verify token first
    const decoded = await jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      audience: 'my-app-id',
      issuer: 'https://auth.example.com'
    });
    
    // Check roles after verification
    return decoded.roles?.includes('admin');
  } catch (error) {
    return false; // Invalid token = not admin
  }
}
```

## Best practices summary

1. **Never trust decoded content** - Always verify signatures
2. **Pin algorithms** - Never accept unexpected algorithms
3. **Validate all claims** - Check `iss`, `aud`, `exp`, `nbf`
4. **Verify custom claims** - Tenant, roles, scopes after verification
5. **Use secure JWKS fetching** - HTTPS only, verify certificates
6. **Select keys by `kid`** - Don't try all keys
7. **Handle errors gracefully** - Don't expose internal details
8. **Decode for debugging** - Use our [JWT Encoder/Decoder](/jwt-decoder/) for inspection

## Debugging workflow

When debugging authentication issues:

1. **Decode first** - Use our [JWT Encoder/Decoder](/jwt-decoder/) to inspect structure
2. **Check claims** - Verify `iss`, `aud`, `exp` match expectations
3. **Verify in code** - Use proper verification with all checks
4. **Debug failures** - See our [troubleshooting guide](/blog/invalid-jwt-errors-fixes/)

## Next steps

1. Try decoding a token with our [JWT Encoder/Decoder](/jwt-decoder/) to see structure
2. Learn about [safe decoding practices](/blog/jwt-decode-safely/) before verification
3. Understand [authentication vs authorization](/blog/jwt-authorization-vs-authentication-decoding/) in JWT flows
4. Read our [troubleshooting guide](/blog/invalid-jwt-errors-fixes/) for verification issues
5. See [JWT claims cheat sheet](/blog/jwt-claims-cheat-sheet/) for claim validation
