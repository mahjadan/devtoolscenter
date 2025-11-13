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

[Try the JWT Decoder](/jwt-decoder/)



