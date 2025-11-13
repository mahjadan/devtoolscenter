---
layout: layouts/blog.njk
title: Decode JWT from HTTP-only Cookies — What You Can and Can’t See
description: Learn the limits of decoding tokens stored in HTTP-only cookies and how to debug safely.
category: JWT
date: 2025-11-12
readTime: 4
tags: ["blog", "jwt"]
relatedTool: /jwt-decoder/
relatedToolName: JWT Decoder
relatedArticles:
  - /blog/jwt-tokens-explained/
faq:
  - question: Can client-side code read HTTP-only cookies?
    answer: No. They’re protected from JS. Decode tokens you obtain from server logs or endpoints during debugging.
---

HTTP-only cookies protect tokens from JavaScript. For debugging, copy a token from a trusted server response and decode it locally.
 
## What you can’t do
- Read HTTP‑only cookies from `document.cookie` (by design).
- Decode tokens directly in client‑side code when they’re stored as HTTP‑only.
 
## Safe debugging approaches
- Temporarily log a redacted token server‑side in a secure environment.
- Duplicate the request in a dev environment and capture the `Set-Cookie` header.
- Use your backend to extract and validate, then expose non‑sensitive claim summaries.
 
## Production guidance
- Keep tokens HTTP‑only for XSS protection.
- Prefer short‑lived access tokens and rotate via refresh tokens.

 



