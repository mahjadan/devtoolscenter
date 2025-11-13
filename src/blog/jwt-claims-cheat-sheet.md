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

[Try the JWT Decoder](/jwt-decoder/)



