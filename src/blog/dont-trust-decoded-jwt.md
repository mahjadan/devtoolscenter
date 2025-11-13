---
layout: layouts/blog.njk
title: When Not to Trust a Decoded JWT
description: Decoding is not validation. Learn when decoded claims are untrustworthy without signature checks.
category: JWT
date: 2025-11-12
readTime: 4
tags: ["blog", "jwt"]
relatedTool: /jwt-decoder/
relatedToolName: JWT Decoder
relatedArticles:
  - /blog/jwt-tokens-explained/
faq:
  - question: Are decoded claims safe to rely on?
    answer: No. Anyone can craft claims; only signature verification and claim checks make them trustworthy.
---

Never make authorization decisions based on decoded content alone. Always verify the signature and critical claims.
 
## Why decoding isn’t trust
- Anyone can create a JWT and fill arbitrary claims; decoding only reveals those claims.
- Trust arrives only after cryptographic verification and claim validation.
 
## What must be validated
1) Signature with the expected algorithm and key
2) `iss` (issuer) equals your configured issuer URL
3) `aud` (audience) includes your application/client ID
4) `exp`/`nbf` time windows
5) Any custom constraints (tenant, scopes, nonce)
 
## Practical guardrails
- Pin algorithms: don’t accept tokens with unexpected `alg`.
- Enforce HTTPS and fetch JWKS securely.
- Reject tokens missing required claims.
 
## Pattern: decode → verify → authorize
1) Decode for visibility and debugging
2) Verify signature and standard claims
3) Map claims to roles/permissions and authorize

 



