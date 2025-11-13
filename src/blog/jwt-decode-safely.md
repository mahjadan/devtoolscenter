---
layout: layouts/blog.njk
title: How to Decode JWT Safely (Header, Payload, Signature)
description: Learn how to safely decode JWTs, what each part means, and where security risks arise.
category: JWT
date: 2025-11-12
readTime: 5
tags: ["blog", "jwt"]
relatedTool: /jwt-decoder/
relatedToolName: JWT Decoder
relatedArticles:
  - /blog/jwt-tokens-explained/
faq:
  - question: Does decoding expose my token?
    answer: Decoding happens client-side on this site; never paste secrets into untrusted tools.
---

Decoding a JWT reveals its header and payload. It does not verify the signature. Use decoding to inspect metadata and claims, then verify the token with the expected key and constraints.
 
## JWT structure refresher
A JWT has three Base64URL-encoded segments separated by dots:
 
```
header.payload.signature
```
 
- Header: algorithm (`alg`), token type (`typ`), optional `kid` for key selection
- Payload: claims (e.g., `iss`, `sub`, `aud`, `exp`, `nbf`, `iat`)
- Signature: ensures integrity when verified against a key
 
## Safe decoding checklist
1) Work locally/client‑side: decode in your browser so tokens aren’t sent to servers.
2) Strip secrets: avoid pasting production tokens into untrusted tools or logs.
3) Normalize Base64URL: replace `-` → `+`, `_` → `/`, add `=` padding if a library expects standard Base64.
4) Treat claims as untrusted: never authorize using decoded claims without successful verification.
5) Redact before sharing: obfuscate `sub`, `email`, or tenant identifiers in screenshots or tickets.
 
## What to look for when decoding
- Header `alg`: confirms algorithm family (HS256 vs RS256/ES256).
- Header `kid`: maps to a specific key in the JWKS.
- Payload time claims: `exp`, `nbf`, `iat` reveal clock‑skew issues.
- Audience/issuer: `aud` and `iss` must match application expectations.
 
## Example: quick decode (Node)
```javascript
const [h, p] = token.split('.'); // ignore signature for decode-only
const b64ToStr = s => Buffer.from(s.replace(/-/g,'+').replace(/_/g,'/'),'base64').toString();
const header = JSON.parse(b64ToStr(h));
const payload = JSON.parse(b64ToStr(p));
console.log(header, payload);
```
 
## After decoding: verify
- HS256: verify with the shared secret you configured.
- RS256/ES256: fetch JWKS, select key by `kid`, build a public key and verify.
- Enforce claims: reject if `exp` in the past, `nbf` in the future, or `aud`/`iss` mismatch.
 
## Troubleshooting tips
- “Invalid token” on decode: check for whitespace, missing segments, or Base64URL normalization.
- Looks valid but rejected: verify against the correct key and confirm algorithm expectations.

 

