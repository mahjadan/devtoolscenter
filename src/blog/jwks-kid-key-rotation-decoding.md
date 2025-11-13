---
layout: layouts/blog.njk
title: JWKs and kid — How Key Rotation Affects Decoding
description: Understand how JWKS endpoints and kid selection impact JWT verification and debugging.
category: JWT
date: 2025-11-12
readTime: 6
tags: ["blog", "jwt"]
relatedTool: /jwt-decoder/
relatedToolName: JWT Decoder
relatedArticles:
  - /blog/jwt-tokens-explained/
faq:
  - question: What does the `kid` header mean?
    answer: It identifies which key in the JWKS should verify the signature; rotations change which key is valid.
---

When verification fails after key rotation, fetch the latest JWKS and ensure your verifier selects the correct key by `kid`.
 
## How JWKS works
- Issuer exposes `/.well-known/jwks.json`.
- Each entry contains `kid`, `kty`, `alg`, and key material (`n`, `e` for RSA).
 
## Rotation scenarios
- New key added with a new `kid`; old key remains until all tokens expire.
- Old key removed; tokens signed with it will fail verification.
 
## Verifier behavior
- Cache JWKS with reasonable TTL; on verification failure, refresh cache.
- Select key strictly by `kid`; do not try arbitrary keys.
 
## Node sketch
```js
if (verificationFails) {
  refreshJwks();
  retryVerification();
}
```
 
## Troubleshooting
- Multiple issuers/tenants: ensure you fetch the correct JWKS per issuer.
- Stale caches in serverless: reinitialize on cold starts or keep a small TTL.

 



