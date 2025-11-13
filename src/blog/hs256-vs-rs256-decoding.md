---
layout: layouts/blog.njk
title: HS256 vs RS256 — What Changes When Decoding?
description: Understand differences between symmetric and asymmetric JWT algorithms and what you can infer at decode time.
category: JWT
date: 2025-11-12
readTime: 5
tags: ["blog", "jwt"]
relatedTool: /jwt-decoder/
relatedToolName: JWT Decoder
relatedArticles:
  - /blog/jwt-tokens-explained/
faq:
  - question: Can I know the algorithm from the header?
    answer: Yes. The header alg field indicates HS256, RS256, etc., but validation must match the expected algorithm server-side.
---

At decode time, you can read `alg` and `kid` from the header. Verification rules differ greatly between HS256 and RS256. Always validate the signature with the correct key type.
 
## HS256 (HMAC) vs RS256 (RSA) at a glance
- HS256: symmetric; the same shared secret signs and verifies. Faster, simpler; secret sprawl risk.
- RS256: asymmetric; private key signs, public key verifies. Safer distribution, rotation via JWKS.
 
## What decode tells you
From the header:
```json
{ "alg": "RS256", "kid": "abc123", "typ": "JWT" }
```
- `alg` shows algorithm family; do not auto‑accept tokens with unexpected algorithms.
- `kid` lets verifiers pick the right key from a JWKS endpoint.
 
## Verification differences
- HS256: verify with your application secret; mismatched or weak secrets fail verification.
- RS256: fetch the issuer’s JWKS (`/.well-known/jwks.json`), select the key by `kid`, build a public key, verify.
 
## Security implications
- Algorithm confusion: never let a token pick a weaker algorithm than your configured expectation.
- Key rotation: with RS256, handle rotating keys by caching JWKS and honoring `kid`.
 
## Node verification sketch
```javascript
// HS256
jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'], audience, issuer });

// RS256
const jwks = await fetch(issuer + '/.well-known/jwks.json').then(r=>r.json());
const { kid } = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
const jwk = jwks.keys.find(k => k.kid === kid);
const pubKey = jwkToPem(jwk); // e.g., using jwk-to-pem
jwt.verify(token, pubKey, { algorithms: ['RS256'], audience, issuer });
```
 
## Common pitfalls
- Wrong `aud`/`iss` for environment (dev vs prod).
- Outdated JWKS cache after rotation.
- Accepting default algorithm lists instead of pinning expected algorithms.

 

