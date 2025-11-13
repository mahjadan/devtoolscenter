---
layout: layouts/blog.njk
title: Fix “Invalid JWT” Errors — Common Causes and Checks
description: Troubleshoot invalid JWT errors with a systematic checklist for decoding and validation.
category: JWT
date: 2025-11-12
readTime: 5
tags: ["blog", "jwt"]
relatedTool: /jwt-decoder/
relatedToolName: JWT Decoder
relatedArticles:
  - /blog/jwt-tokens-explained/
faq:
  - question: Why does my token fail to decode?
    answer: Often due to Base64URL padding issues, malformed segments, or whitespace. Verification failures are separate from decoding.
---

Invalid JWTs usually stem from malformed segments, wrong encoding, or clock skew impacting `exp/nbf`. Decode the token first, then verify against the expected issuer, audience, and key.
 
## Error categories
1) Parse/Decode errors
- Not three segments (`a.b.c`)
- Non‑Base64URL chars or missing padding (for strict decoders)
- Whitespace/newline contamination
 
2) Verification errors
- Wrong key/secret for `alg`
- `aud`/`iss` mismatch
- `exp` in the past or `nbf` in the future
 
## Quick fixes
- Normalize Base64URL before decoding if your library expects Base64.
- Trim input, remove quotes, newlines, and trailing spaces.
- Add small clock skew tolerance when comparing time claims (e.g., ±60s).
 
## Checklist
- Read header `alg` and `kid` and verify against configuration.
- Confirm issuer base URL and audience exactly match expectations.
- For RS256: refresh JWKS and ensure you select the correct `kid`.
 
## Example: handling skew
```js
const options = { algorithms: ['RS256'], clockTolerance: 60, audience, issuer };
jwt.verify(token, publicKey, options);
```

 



