---
layout: layouts/blog.njk
title: "JWT Claims Cheat Sheet: Complete Reference Guide (exp, nbf, aud, iss)"
description: Quick reference guide to JWT claims with validation rules, code examples, and common pitfalls. Use our free JWT decoder to inspect claims instantly.
category: JWT
date: 2025-11-12
readTime: 7
tags: ["blog", "jwt"]
relatedTool: /jwt-decoder/
relatedToolName: JWT Encoder/Decoder
relatedArticles:
  - /blog/jwt-tokens-explained/
  - /blog/jwt-authorization-vs-authentication-decoding/
  - /blog/invalid-jwt-errors-fixes/
faq:
  - question: What does clock skew mean for exp/nbf?
    answer: Small time differences between systems can cause failures; allow a few seconds of leeway when validating.
---

JWT claims are the data stored inside a token's payload. Understanding what each claim means, how to validate it, and common pitfalls helps you build secure applications. Use our [JWT Encoder/Decoder](/jwt-decoder/) to inspect claims, but always verify signatures before trusting them.

## Standard Claims (RFC 7519)

### iss (Issuer)

**What it is:** Identifies who issued the token

**Format:** String (usually a URL)

**Example:**
```json
{
  "iss": "https://auth.example.com"
}
```

**Validation rules:**
- ✅ **Exact string match** - Must match configured issuer exactly
- ✅ **Case-sensitive** - `https://Auth.example.com` ≠ `https://auth.example.com`
- ✅ **Trailing slash matters** - `https://auth.example.com` ≠ `https://auth.example.com/`

**Common mistakes:**
```javascript
// BAD - Fuzzy matching
if (decoded.iss.includes('example.com')) {
  // Allows evil-example.com!
}

// BAD - Case-insensitive
if (decoded.iss.toLowerCase() === 'https://auth.example.com') {
  // Wrong!
}

// GOOD - Exact match
if (decoded.iss === 'https://auth.example.com') {
  // Correct
}
```

**Implementation:**
```javascript
function validateIssuer(decoded, expectedIssuer) {
  if (decoded.iss !== expectedIssuer) {
    throw new Error(`Invalid issuer: expected ${expectedIssuer}, got ${decoded.iss}`);
  }
  return true;
}

// Or use jwt.verify with issuer option
jwt.verify(token, secret, {
  issuer: 'https://auth.example.com'  // Automatically validates
});
```

### aud (Audience)

**What it is:** Identifies who the token is intended for (your API/client)

**Format:** String or array of strings

**Example:**
```json
{
  "aud": "my-api"
}
// or
{
  "aud": ["my-api", "my-mobile-app"]
}
```

**Validation rules:**
- ✅ **Must include your identifier** - Token must be intended for your API
- ✅ **Array handling** - Check if string is in array
- ✅ **Case-sensitive** - `my-api` ≠ `My-API`

**Common mistakes:**
```javascript
// BAD - Doesn't check if audience includes your API
if (decoded.aud) {
  // Wrong - doesn't verify it's for us
}

// GOOD - Checks audience includes your API
function validateAudience(decoded, expectedAudience) {
  if (Array.isArray(decoded.aud)) {
    if (!decoded.aud.includes(expectedAudience)) {
      throw new Error('Token not intended for this audience');
    }
  } else {
    if (decoded.aud !== expectedAudience) {
      throw new Error('Token not intended for this audience');
    }
  }
  return true;
}

// Or use jwt.verify with audience option
jwt.verify(token, secret, {
  audience: 'my-api'  // Automatically validates
});
```

### sub (Subject)

**What it is:** Identifies the subject (usually the user ID)

**Format:** String (opaque identifier)

**Example:**
```json
{
  "sub": "user-12345"
}
```

**Validation rules:**
- ✅ **Should exist** - Most tokens need a subject
- ✅ **Use for user identification** - After verification, use `sub` as user ID
- ⚠️ **Don't trust without verification** - Always verify signature first

**Implementation:**
```javascript
function getUserId(verifiedToken) {
  if (!verifiedToken.sub) {
    throw new Error('Token missing subject claim');
  }
  return verifiedToken.sub;
}

// Usage after verification
const verified = jwt.verify(token, secret);
const userId = getUserId(verified);
```

### exp (Expiration Time)

**What it is:** Unix timestamp when token expires

**Format:** Number (seconds since epoch)

**Example:**
```json
{
  "exp": 1704067200  // Jan 1, 2024 00:00:00 UTC
}
```

> 💡 **Tip:** Convert Unix timestamps to readable dates using our [Timestamp Converter](/timestamp-converter/) tool.

**Validation rules:**
- ✅ **Reject if expired** - `now >= exp`
- ✅ **Allow clock skew** - Small time differences between systems
- ✅ **Always check** - Never accept expired tokens

**Common mistakes:**
```javascript
// BAD - Doesn't check expiration
const decoded = jwt.decode(token);
if (decoded.sub) {
  // Token might be expired!
}

// GOOD - Checks expiration with clock tolerance
function validateExpiration(decoded, clockTolerance = 60) {
  const now = Math.floor(Date.now() / 1000);
  if (decoded.exp && decoded.exp < (now - clockTolerance)) {
    throw new Error('Token expired');
  }
  return true;
}

// Or use jwt.verify (automatically checks exp)
jwt.verify(token, secret, {
  clockTolerance: 60  // 60 seconds tolerance
});
```

**Implementation:**
```javascript
function isTokenExpired(decoded, clockTolerance = 60) {
  if (!decoded.exp) {
    return false;  // No expiration claim
  }
  
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < (now - clockTolerance);
}

// Check expiration
if (isTokenExpired(decoded)) {
  throw new Error('Token expired');
}
```

### nbf (Not Before)

**What it is:** Unix timestamp when token becomes valid

**Format:** Number (seconds since epoch)

**Example:**
```json
{
  "nbf": 1704067200  // Token valid after Jan 1, 2024
}
```

> 💡 **Tip:** Convert Unix timestamps to readable dates using our [Timestamp Converter](/timestamp-converter/) tool.

**Validation rules:**
- ✅ **Reject if too early** - `now < nbf` (with tolerance)
- ✅ **Allow clock skew** - Small time differences
- ⚠️ **Less common** - Not all tokens use this

**Implementation:**
```javascript
function validateNotBefore(decoded, clockTolerance = 60) {
  if (!decoded.nbf) {
    return true;  // No nbf claim, assume valid
  }
  
  const now = Math.floor(Date.now() / 1000);
  if (decoded.nbf > (now + clockTolerance)) {
    throw new Error('Token not yet valid');
  }
  return true;
}

// Or use jwt.verify (automatically checks nbf)
jwt.verify(token, secret, {
  clockTolerance: 60
});
```

### iat (Issued At)

**What it is:** Unix timestamp when token was issued

**Format:** Number (seconds since epoch)

**Example:**
```json
{
  "iat": 1704067200  // Issued on Jan 1, 2024
}
```

> 💡 **Tip:** Convert Unix timestamps to readable dates using our [Timestamp Converter](/timestamp-converter/) tool.

**Validation rules:**
- ⚠️ **Rarely enforced** - Usually for debugging/logging
- ✅ **Use for token age** - Calculate how old token is
- ✅ **Use for revocation** - Check if issued before revocation time

**Implementation:**
```javascript
function getTokenAge(decoded) {
  if (!decoded.iat) {
    return null;
  }
  
  const now = Math.floor(Date.now() / 1000);
  return now - decoded.iat;  // Age in seconds
}

// Check if token is too old
const age = getTokenAge(decoded);
if (age > 3600) {  // Older than 1 hour
  // Consider refreshing
}
```

## Registered Optional Claims

### jti (JWT ID)

**What it is:** Unique identifier for the token (like a serial number)

**Format:** String

**Example:**
```json
{
  "jti": "token-abc123xyz"
}
```

**Use cases:**
- ✅ **Token revocation** - Track revoked tokens by `jti`
- ✅ **Replay detection** - Prevent token reuse
- ✅ **Audit logging** - Track specific tokens

**Implementation:**
```javascript
// Token revocation list
const revokedTokens = new Set();

function isTokenRevoked(decoded) {
  if (!decoded.jti) {
    return false;  // No jti, can't check
  }
  return revokedTokens.has(decoded.jti);
}

// Revoke token
function revokeToken(jti) {
  revokedTokens.add(jti);
}

// Check before using token
if (isTokenRevoked(decoded)) {
  throw new Error('Token revoked');
}
```

### scope / scp (Scopes)

**What it is:** Space-separated list of permissions (OAuth style)

**Format:** String (space-separated) or array

**Example:**
```json
{
  "scope": "read:users write:posts delete:comments"
}
// or
{
  "scp": ["read:users", "write:posts", "delete:comments"]
}
```

**Validation:**
```javascript
function hasScope(decoded, requiredScope) {
  const scopes = decoded.scope 
    ? decoded.scope.split(' ')
    : decoded.scp || [];
  
  return scopes.includes(requiredScope);
}

// Check scope
if (!hasScope(decoded, 'write:posts')) {
  throw new Error('Insufficient scope');
}
```

### azp (Authorized Party)

**What it is:** Identifies the party authorized to use the token (OIDC)

**Format:** String

**Example:**
```json
{
  "azp": "mobile-app-client-id"
}
```

**Use case:** Multi-client scenarios where one client gets token for another

## Custom Claims

### Common Custom Claims

**Roles:**
```json
{
  "roles": ["admin", "user"]
}
```

**Permissions:**
```json
{
  "permissions": ["create", "read", "update", "delete"]
}
```

**Tenant/Organization:**
```json
{
  "tenant": "acme-corp",
  "orgId": "org-123"
}
```

**Email:**
```json
{
  "email": "user@example.com"
}
```

### Validating Custom Claims

**Always validate custom claims after verification:**

```javascript
function validateCustomClaims(verified) {
  // Check required custom claims exist
  if (!verified.tenant) {
    throw new Error('Missing tenant claim');
  }
  
  // Validate format
  if (typeof verified.roles !== 'object' || !Array.isArray(verified.roles)) {
    throw new Error('Invalid roles claim format');
  }
  
  // Validate values
  const allowedRoles = ['admin', 'user', 'moderator'];
  for (const role of verified.roles) {
    if (!allowedRoles.includes(role)) {
      throw new Error(`Invalid role: ${role}`);
    }
  }
  
  return true;
}
```

### PII (Personally Identifiable Information) Warning

**⚠️ Don't put sensitive PII in tokens:**
- ❌ Full credit card numbers
- ❌ Social security numbers
- ❌ Passwords
- ❌ Full addresses

**✅ Safe to include:**
- ✅ User ID (`sub`)
- ✅ Email (if necessary)
- ✅ Roles/permissions
- ✅ Organization ID

**Why:** Tokens are often logged, cached, or exposed in URLs

## Complete Validation Flow

### Step-by-Step Implementation

```javascript
async function validateToken(token, options = {}) {
  const {
    secret,
    issuer,
    audience,
    algorithms = ['HS256'],
    clockTolerance = 60,
    requiredClaims = [],
    customValidators = {}
  } = options;
  
  // Step 1: Decode to inspect (optional, for debugging)
  const decoded = jwt.decode(token, { complete: true });
  
  if (!decoded) {
    throw new Error('Invalid token format');
  }
  
  // Step 2: Verify signature
  let verified;
  try {
    verified = jwt.verify(token, secret, {
      issuer,
      audience,
      algorithms,
      clockTolerance
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token signature');
    }
    throw error;
  }
  
  // Step 3: Validate required claims
  for (const claim of requiredClaims) {
    if (!verified[claim]) {
      throw new Error(`Missing required claim: ${claim}`);
    }
  }
  
  // Step 4: Run custom validators
  for (const [claim, validator] of Object.entries(customValidators)) {
    if (verified[claim] !== undefined) {
      const result = validator(verified[claim], verified);
      if (result !== true) {
        throw new Error(`Invalid ${claim}: ${result}`);
      }
    }
  }
  
  return verified;
}

// Usage
try {
  const verified = await validateToken(token, {
    secret: process.env.JWT_SECRET,
    issuer: 'https://auth.example.com',
    audience: 'my-api',
    algorithms: ['HS256'],
    clockTolerance: 60,
    requiredClaims: ['sub', 'tenant'],
    customValidators: {
      roles: (roles) => {
        if (!Array.isArray(roles)) {
          return 'Roles must be an array';
        }
        const allowed = ['admin', 'user'];
        if (!roles.every(r => allowed.includes(r))) {
          return 'Invalid role';
        }
        return true;
      }
    }
  });
  
  // Token is valid and verified
  console.log('User ID:', verified.sub);
  console.log('Roles:', verified.roles);
} catch (error) {
  console.error('Token validation failed:', error.message);
}
```

## Quick Reference Table

| Claim | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `iss` | string | Usually | Exact match | Trailing slash matters |
| `aud` | string/array | Usually | Must include your API | Case-sensitive |
| `sub` | string | Usually | Should exist | Use as user ID after verification |
| `exp` | number | Usually | `now < exp` | Always check with tolerance |
| `nbf` | number | Rarely | `now >= nbf` | Less common |
| `iat` | number | Optional | For logging | Rarely enforced |
| `jti` | string | Optional | For revocation | Track in database |
| `scope` | string | Optional | Check includes required | OAuth style |
| `roles` | array | Custom | Validate against whitelist | Custom claim |
| `tenant` | string | Custom | Validate format | Custom claim |

## Common Validation Patterns

### Pattern 1: Basic Token Validation

```javascript
function validateBasicToken(token) {
  const verified = jwt.verify(token, secret, {
    issuer: 'https://auth.example.com',
    audience: 'my-api',
    algorithms: ['HS256'],
    clockTolerance: 60
  });
  
  // Check required claims
  if (!verified.sub) {
    throw new Error('Missing subject');
  }
  
  return verified;
}
```

### Pattern 2: Multi-Tenant Validation

```javascript
function validateTenantToken(token, expectedTenant) {
  const verified = jwt.verify(token, secret, {
    issuer: 'https://auth.example.com',
    algorithms: ['HS256']
  });
  
  // Validate tenant claim
  if (!verified.tenant) {
    throw new Error('Missing tenant claim');
  }
  
  if (verified.tenant !== expectedTenant) {
    throw new Error('Tenant mismatch');
  }
  
  return verified;
}
```

### Pattern 3: Role-Based Validation

```javascript
function validateRoleToken(token, requiredRole) {
  const verified = jwt.verify(token, secret, {
    issuer: 'https://auth.example.com',
    algorithms: ['HS256']
  });
  
  // Check roles
  if (!verified.roles || !Array.isArray(verified.roles)) {
    throw new Error('Missing or invalid roles claim');
  }
  
  if (!verified.roles.includes(requiredRole)) {
    throw new Error(`Missing required role: ${requiredRole}`);
  }
  
  return verified;
}
```

### Pattern 4: Scope-Based Validation

```javascript
function validateScopeToken(token, requiredScope) {
  const verified = jwt.verify(token, secret, {
    issuer: 'https://auth.example.com',
    algorithms: ['HS256']
  });
  
  // Parse scopes
  const scopes = verified.scope 
    ? verified.scope.split(' ')
    : verified.scp || [];
  
  if (!scopes.includes(requiredScope)) {
    throw new Error(`Missing required scope: ${requiredScope}`);
  }
  
  return verified;
}
```

## Debugging Claims

### Using JWT Encoder/Decoder

Our [JWT Encoder/Decoder](/jwt-decoder/) helps you:
- Inspect all claims without verification
- See expiration times in human-readable format
- Check issuer and audience
- View custom claims
- Debug validation failures

**Validation failing?** If your token claims look correct but validation still fails, see our [complete guide on fixing invalid JWT errors](/blog/invalid-jwt-errors-fixes/) for systematic troubleshooting of signature, algorithm, and claim validation issues.

### Common Issues and Solutions

**Issue: "Token expired" but exp looks fine**
```javascript
// Check clock skew
const now = Math.floor(Date.now() / 1000);
const exp = decoded.exp;
const skew = exp - now;

console.log('Current time:', new Date(now * 1000));
console.log('Expires at:', new Date(exp * 1000));
console.log('Time difference:', skew, 'seconds');
```

**Issue: "Invalid issuer" but iss looks correct**
```javascript
// Check exact match (including trailing slash)
const expected = 'https://auth.example.com';
const actual = decoded.iss;

console.log('Expected:', JSON.stringify(expected));
console.log('Actual:', JSON.stringify(actual));
console.log('Match:', expected === actual);
```

**Issue: "Wrong audience" but aud includes your API**
```javascript
// Check audience format
const expected = 'my-api';
const actual = decoded.aud;

if (Array.isArray(actual)) {
  console.log('Audience is array:', actual);
  console.log('Includes expected:', actual.includes(expected));
} else {
  console.log('Audience is string:', actual);
  console.log('Matches expected:', actual === expected);
}
```

## Best Practices Summary

1. **Always verify signature first** - Never trust decoded claims without verification
2. **Validate all required claims** - Check `iss`, `aud`, `exp`, `sub` at minimum
3. **Use exact matching** - No fuzzy matching for `iss` or `aud`
4. **Allow clock tolerance** - Handle small time differences (60s recommended)
5. **Pin algorithms** - Never trust `alg` from token header
6. **Validate custom claims** - Check format and values
7. **Don't store PII** - Avoid sensitive data in tokens
8. **Use `jti` for revocation** - Track revoked tokens
9. **Document custom claims** - Make validation rules clear
10. **Test edge cases** - Expired tokens, missing claims, wrong formats

## Next Steps

1. **Inspect claims instantly** - Decode tokens with our [free JWT Encoder/Decoder](/jwt-decoder/) to see all claims
2. **Fix validation errors** - Use our [complete troubleshooting guide](/blog/invalid-jwt-errors-fixes/) for common JWT errors
3. **Master fundamentals** - Learn [JWT tokens explained](/blog/jwt-tokens-explained/) for the basics
4. **Understand security** - See [authentication vs authorization](/blog/jwt-authorization-vs-authentication-decoding/) for security best practices
