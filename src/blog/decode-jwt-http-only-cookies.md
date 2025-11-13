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

[Try the JWT Decoder](/jwt-decoder/)



