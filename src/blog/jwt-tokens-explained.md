---
layout: layouts/blog.njk
title: JWT Tokens Explained - Complete Guide to JSON Web Tokens
description: Learn everything about JWT tokens, how they work, when to use them, and best practices for secure implementation in your applications.
category: Security
date: 2025-10-20
readTime: 10
relatedTool: /jwt-decoder/
relatedToolName: JWT Decoder
relatedArticles:
  - /blog/understanding-json-formatting/
tags:
  - blog
  - jwt
  - authentication
  - security
  - tokens
faq:
  - question: Does decoding a JWT verify its signature?
    answer: No. Decoding only parses the header and payload. Verification checks the signature against a trusted key.
keywords: jwt tokens, json web tokens, jwt authentication, jwt security, jwt explained, jwt tutorial, jwt best practices, jwt implementation, jwt vs sessions, jwt claims, jwt algorithms
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  headline: "JWT Tokens Explained - Complete Guide to JSON Web Tokens"
  description: "Learn everything about JWT tokens, how they work, when to use them, and best practices for secure implementation in your applications."
  author:
    "@type": "Organization"
    name: "DevTools Center"
  datePublished: "2025-10-20"
  dateModified: "2025-10-20"
  publisher:
    "@type": "Organization"
    name: "DevTools Center"
    url: "https://devtoolscenter.com"
  url: "https://devtoolscenter.com/blog/jwt-tokens-explained/"
---

## What is JWT?

JWT (JSON Web Token) is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object. JWTs are compact, URL-safe tokens that can be verified and trusted because they are digitally signed.

### Why Use JWT?

JWTs are commonly used for:
- **Authentication**: Verify user identity
- **Authorization**: Control access to resources
- **Information Exchange**: Securely transmit data between parties

## JWT Structure

A JWT consists of three parts separated by dots (`.`):

```
header.payload.signature
```

### 1. Header

The header typically consists of two parts:
- Token type (JWT)
- Signing algorithm (HMAC, RSA, or ECDSA)

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### 2. Payload

The payload contains the claims - statements about an entity (typically the user) and additional data.

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622
}
```

### 3. Signature

The signature ensures the token hasn't been tampered with:

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

## Standard Claims

JWT defines several standard claims:

### Registered Claims

- **iss** (issuer): Who issued the token
- **sub** (subject): Who the token is about
- **aud** (audience): Who should accept the token
- **exp** (expiration): When the token expires
- **nbf** (not before): When the token becomes valid
- **iat** (issued at): When the token was created
- **jti** (JWT ID): Unique identifier for the token

### Custom Claims

You can add custom claims for your application:

```json
{
  "sub": "user123",
  "email": "user@example.com",
  "role": "admin",
  "permissions": ["read", "write", "delete"]
}
```

## How JWT Authentication Works

### 1. User Login

```
Client → Server: POST /login (username, password)
Server → Client: JWT token
```

### 2. Accessing Protected Resources

```
Client → Server: GET /api/data (Authorization: Bearer <token>)
Server: Validates token
Server → Client: Protected data
```

### 3. Token Validation

The server:
1. Verifies the signature
2. Checks expiration time
3. Validates claims
4. Grants or denies access

## JWT Best Practices

### Security

1. **Use Strong Secrets**
   - Use cryptographically secure random strings
   - Keep secrets in environment variables
   - Never commit secrets to version control

2. **Set Expiration Times**
   ```json
   {
     "exp": 1516242622  // 1 hour from issuance
   }
   ```

3. **Use HTTPS**
   - Always transmit JWTs over HTTPS
   - Prevents token interception

4. **Validate Everything**
   - Verify signature
   - Check expiration
   - Validate issuer and audience
   - Verify token hasn't been revoked

### Storage

**Where to Store JWTs:**

✓ **Memory (React state, Vue store)**
- Most secure
- Lost on refresh (use refresh tokens)

✓ **HttpOnly Cookies**
- Protected from XSS
- Automatically sent with requests
- Requires CSRF protection

✗ **Local Storage**
- Vulnerable to XSS attacks
- Not recommended for sensitive data

✗ **Session Storage**
- Vulnerable to XSS attacks
- Lost on tab close

### Token Design

1. **Keep Payload Small**
   - Only include necessary data
   - Smaller tokens = faster transmission

2. **Don't Store Sensitive Data**
   - Payload is Base64 encoded, not encrypted
   - Anyone can decode and read it

3. **Use Refresh Tokens**
   ```
   Access Token: Short-lived (15 min)
   Refresh Token: Long-lived (7 days)
   ```

## Common JWT Algorithms

### Symmetric (HMAC)

**HS256, HS384, HS512**
- Single secret key
- Same key for signing and verification
- Faster
- Simpler to implement

```javascript
// Signing
const token = jwt.sign(payload, 'secret', { algorithm: 'HS256' });

// Verifying
const decoded = jwt.verify(token, 'secret');
```

### Asymmetric (RSA, ECDSA)

**RS256, RS384, RS512, ES256, ES384, ES512**
- Public/private key pair
- Private key for signing
- Public key for verification
- More secure for distributed systems

```javascript
// Signing with private key
const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

// Verifying with public key
const decoded = jwt.verify(token, publicKey);
```

## JWT vs Session Authentication

### JWT Advantages

✓ Stateless - no server-side storage  
✓ Scalable - works across multiple servers  
✓ Mobile-friendly - works with native apps  
✓ Cross-domain - easy CORS handling  
✓ Decoupled - separates auth from backend  

### JWT Disadvantages

✗ Larger size - increases bandwidth  
✗ Cannot invalidate - until expiration  
✗ Security concerns - if secret compromised  
✗ Payload visible - anyone can decode  

### Sessions Advantages

✓ Can be invalidated immediately  
✓ Smaller - just session ID  
✓ Server controls data  
✓ Mature and well-tested  

### Sessions Disadvantages

✗ Requires server-side storage  
✗ Harder to scale horizontally  
✗ CORS complications  
✗ Mobile app challenges  

## Implementing JWT

### Node.js Example

```javascript
const jwt = require('jsonwebtoken');

// Generate token
function generateToken(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h',
    issuer: 'myapp.com'
  });
}

// Verify token middleware
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Protected route
app.get('/api/profile', verifyToken, (req, res) => {
  res.json({ user: req.user });
});
```

### Python Example

```python
import jwt
from datetime import datetime, timedelta

# Generate token
def generate_token(user):
    payload = {
        'sub': user['id'],
        'email': user['email'],
        'exp': datetime.utcnow() + timedelta(hours=1),
        'iat': datetime.utcnow()
    }
    
    return jwt.encode(payload, 'secret', algorithm='HS256')

# Verify token
def verify_token(token):
    try:
        decoded = jwt.decode(token, 'secret', algorithms=['HS256'])
        return decoded
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
```

## Common JWT Pitfalls

### 1. Using "none" Algorithm

Never accept tokens with `alg: "none"`:

```javascript
// Bad - vulnerable to attack
jwt.verify(token, null, { algorithms: ['none', 'HS256'] });

// Good - specify exact algorithm
jwt.verify(token, secret, { algorithms: ['HS256'] });
```

### 2. Not Checking Expiration

Always validate the `exp` claim:

```javascript
try {
  const decoded = jwt.verify(token, secret);
  // Token is valid and not expired
} catch (err) {
  if (err.name === 'TokenExpiredError') {
    // Handle expired token
  }
}
```

### 3. Storing Secrets in Code

```javascript
// Bad
const token = jwt.sign(payload, 'mysecret123');

// Good
const token = jwt.sign(payload, process.env.JWT_SECRET);
```

### 4. Not Rotating Secrets

- Rotate secrets periodically
- Have a strategy for key rotation
- Support multiple valid secrets during transition

## Refresh Token Strategy

### Implementation Pattern

1. **Login**: Return both access and refresh tokens
2. **Access Token**: Short-lived (15 min)
3. **Refresh Token**: Long-lived (7 days)
4. **When Access Token Expires**: Use refresh token to get new access token
5. **When Refresh Token Expires**: Re-authenticate

```javascript
// Refresh token endpoint
app.post('/api/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = await getUserById(decoded.sub);
    
    const newAccessToken = generateAccessToken(user);
    
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});
```

## JWT Security Checklist

✓ Use strong, random secrets  
✓ Set appropriate expiration times  
✓ Validate signature and claims  
✓ Use HTTPS for transmission  
✓ Implement refresh token rotation  
✓ Never store secrets in code  
✓ Specify exact algorithms  
✓ Handle token expiration gracefully  
✓ Consider token revocation strategy  
✓ Monitor for suspicious activity  

## Conclusion

JWT is a powerful tool for modern authentication and authorization. When implemented correctly with proper security measures, it provides a stateless, scalable solution for protecting your applications.

Key takeaways:
- Understand the three parts: header, payload, signature
- Use appropriate expiration times
- Never store sensitive data in payload
- Implement refresh token strategy
- Follow security best practices
- Choose the right algorithm for your use case

Whether you're building a REST API, microservices, or a mobile app, JWT provides a standardized way to handle authentication that scales with your application.

