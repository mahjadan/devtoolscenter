---
layout: layouts/blog.njk
title: Decode JWT in Postman, curl, and Node.js
description: Practical ways to decode JWTs using Postman, curl, and Node.js with caveats on verification.
category: JWT
date: 2025-11-12
readTime: 6
tags: ["blog", "jwt"]
relatedTool: /jwt-decoder/
relatedToolName: JWT Decoder
relatedArticles:
  - /blog/jwt-tokens-explained/
faq:
  - question: Can Postman verify JWT signatures?
    answer: Postman can decode tokens; signature verification must be implemented in your backend or scripts.
---

Use the JWT Decoder for quick inspection, then automate with Node.js or shell scripts for repeatable verification workflows.
 
## Postman
- Use Tests tab to decode header/payload:
```javascript
const token = pm.environment.get('jwt');
function b64(s){return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(s.replace(/-/g,'+').replace(/_/g,'/')))}
const [h,p] = token.split('.');
console.log(JSON.parse(b64(h)), JSON.parse(b64(p)));
```
- For verification, call your auth server or write a pre‑request script that fetches JWKS and verifies via a helper API.
 
## curl
```bash
TOKEN="eyJhbGciOiJSUzI1NiIs..."
HEADER=$(echo "$TOKEN" | cut -d. -f1 | tr '_-' '/+' | base64 -d 2>/dev/null)
PAYLOAD=$(echo "$TOKEN" | cut -d. -f2 | tr '_-' '/+' | base64 -d 2>/dev/null)
echo "$HEADER"
echo "$PAYLOAD"
```
Verification requires a library; use a small Node/Python helper.
 
## Node.js
```javascript
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import fetch from 'node-fetch';

async function verifyRs256(token, issuer, audience){
  const { kid } = JSON.parse(Buffer.from(token.split('.')[0],'base64').toString());
  const jwks = await fetch(issuer+'/.well-known/jwks.json').then(r=>r.json());
  const jwk = jwks.keys.find(k=>k.kid===kid);
  const pem = jwkToPem(jwk);
  return jwt.verify(token, pem, { algorithms: ['RS256'], audience, issuer });
}
```

 



