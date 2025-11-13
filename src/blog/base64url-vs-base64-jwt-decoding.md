---
layout: layouts/blog.njk
title: Base64URL vs Base64 for JWTs — Why Decoding Fails
description: Learn how Base64URL differs from Base64 and how padding affects JWT decoding.
category: JWT
date: 2025-11-12
readTime: 5
tags: ["blog", "jwt"]
relatedTool: /jwt-decoder/
relatedToolName: JWT Decoder
relatedArticles:
  - /blog/jwt-tokens-explained/
faq:
  - question: Why does adding padding fix decoding?
    answer: JWTs use Base64URL without padding; some decoders expect `=` padding. Normalizing fixes decoding.
---

JWTs are Base64URL-encoded. If your decoder expects standard Base64, convert characters and handle padding before decoding.
 
## Base64 vs Base64URL
- Base64URL replaces `+` with `-` and `/` with `_` and typically omits `=` padding.
- Many language runtimes expect standard Base64 with `+`, `/`, and proper padding.
 
## Quick normalization
```js
function b64urlToB64(s){
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return s;
}
```
 
## Typical symptoms
- “Invalid character” or “Incorrect padding” errors
- Payload decodes but header fails (or vice versa)
 
## Recommendation
- Use libraries that support Base64URL for JWT specifically.
- If building tooling, normalize before calling `atob`/`Buffer.from(...,'base64')`.

 



