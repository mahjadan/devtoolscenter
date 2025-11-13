---
layout: layouts/blog.njk
title: JWT Claims Cheat Sheet (exp, nbf, aud, iss)
description: A quick-reference guide to the most important JWT claims and how to validate them.
category: JWT
date: 2025-11-12
readTime: 5
tags: ["blog", "jwt"]
relatedTool: /jwt-decoder/
relatedToolName: JWT Decoder
relatedArticles:
  - /blog/jwt-tokens-explained/
faq:
  - question: What does clock skew mean for exp/nbf?
    answer: Small time differences between systems can cause failures; allow a few seconds of leeway when validating.
---

Common claims include `iss`, `aud`, `sub`, `exp`, `nbf`, and `iat`. Decode to inspect, then validate each against expected values.
 
## Standard claims
- `iss`: token issuer (URL). Must match your configured issuer exactly (trailing slash matters).
- `aud`: intended audience (client ID or API identifier). Must include your app.
- `sub`: subject (user or entity ID). Treat as opaque; don’t infer PII from it.
- `exp`: expiration (seconds since epoch). Reject if now ≥ exp.
- `nbf`: not before. Reject if now < nbf (allow small skew).
- `iat`: issued at. Useful for debugging; don’t enforce strictly unless needed.
 
## Custom claims
Examples: `scope`, `roles`, `tenant`, `permissions`. Document and validate per app policy.
 
## Validation tips
```text
iss: exact string match
aud: contains expected value
exp/nbf: allow small clock tolerance (e.g., 60s)
alg: pin expected algorithm(s)
```
 
## Quick inspection flow
1) Decode and scan `iss`/`aud`/time claims
2) Verify signature with expected algorithm and key
3) Enforce authorization using roles/scopes after verification

 



