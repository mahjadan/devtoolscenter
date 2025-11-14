---
layout: layouts/blog.njk
title: Regex Lookaheads and Lookbehinds Explained
description: Learn positive and negative lookarounds with real-world examples and pitfalls.
category: Regex
date: 2025-11-12
readTime: 7
tags: ["blog", "regex"]
relatedTool: /regex-tester/
relatedToolName: Regex Tester
relatedArticles:
  - /blog/mastering-regular-expressions/
  - /blog/regex-performance-traps/
faq:
  - question: Why doesn’t my lookbehind work?
    answer: Not all engines support variable-length lookbehinds; test per environment and adjust patterns.
---

Lookaheads and lookbehinds (collectively called "lookarounds") are powerful regex features that let you match patterns based on what comes before or after them, without including that context in the match. Understanding how they work and when to use them helps you write more precise and efficient regex patterns.

## Why lookarounds exist

Regular regex patterns consume characters as they match. Lookarounds let you check conditions without consuming characters, enabling:

1. **Context-aware matching** - Match X only when Y is nearby
2. **Non-consuming checks** - Verify conditions without including them in the match
3. **Complex validation** - Check multiple conditions simultaneously
4. **Precise extraction** - Extract text based on surrounding context

**The key difference:** Normal patterns consume characters; lookarounds only check conditions.

## How lookarounds work

### Positive lookahead: `X(?=Y)`

**What it does:** Matches X only if Y immediately follows X.

**Why it's useful:** You want to match something but only when it's followed by something else, without including that "something else" in the match.

**Example:**
```regex
\d+(?=px)
```
Matches numbers followed by "px" but doesn't include "px" in the match:
- `"100px"` → matches `"100"` (not `"100px"`)
- `"100em"` → no match

**Real-world use case:**
```javascript
// Extract CSS pixel values without the unit
const text = "width: 100px; height: 200px;";
const matches = text.match(/\d+(?=px)/g);
// Result: ["100", "200"]
```

### Negative lookahead: `X(?!Y)`

**What it does:** Matches X only if Y does NOT immediately follow X.

**Why it's useful:** Match something but exclude cases where it's followed by something specific.

**Example:**
```regex
\d+(?!px)
```
Matches numbers NOT followed by "px":
- `"100em"` → matches `"100"`
- `"100px"` → no match

**Real-world use case:**
```javascript
// Find numbers that aren't pixel values
const text = "100px 200em 300rem";
const matches = text.match(/\d+(?!px)/g);
// Result: ["200", "300"] (skips "100" because it's followed by "px")
```

### Positive lookbehind: `(?<=Y)X`

**What it does:** Matches X only if Y immediately precedes X.

**Why it's useful:** Match something only when it comes after something specific, without including the prefix.

**Example:**
```regex
(?<=\$)\d+
```
Matches numbers preceded by "$" but doesn't include "$" in the match:
- `"Price: $100"` → matches `"100"` (not `"$100"`)
- `"Price: 100"` → no match

**Real-world use case:**
```javascript
// Extract dollar amounts without the dollar sign
const text = "Total: $500, Tax: $50";
const matches = text.match(/(?<=\$)\d+/g);
// Result: ["500", "50"]
```

### Negative lookbehind: `(?<!Y)X`

**What it does:** Matches X only if Y does NOT immediately precede X.

**Why it's useful:** Match something but exclude cases where it's preceded by something specific.

**Example:**
```regex
(?<!\$)\d+
```
Matches numbers NOT preceded by "$":
- `"Price: 100"` → matches `"100"`
- `"Price: $100"` → no match (because "$" precedes it)

**Real-world use case:**
```javascript
// Find numbers that aren't dollar amounts
const text = "Price: $100, Quantity: 5";
const matches = text.match(/(?<!\$)\d+/g);
// Result: ["5"] (skips "100" because it's preceded by "$")
```

## Real-world examples

### Example 1: Password validation

**Requirement:** Password must have at least one digit AND one letter, minimum 8 characters.

**Why lookaheads help:** You need to check multiple conditions without consuming characters.

**Pattern:**
```regex
^(?=.*\d)(?=.*[A-Za-z]).{8,}$
```

**How it works:**
- `^` - Start of string
- `(?=.*\d)` - Positive lookahead: must contain at least one digit
- `(?=.*[A-Za-z])` - Positive lookahead: must contain at least one letter
- `.{8,}` - At least 8 characters
- `$` - End of string

**Why this works:**
- Each lookahead checks a condition without consuming characters
- The `.*` inside lookaheads scans the entire string
- After both conditions pass, `.{8,}` matches the actual password

**Test it:**
```javascript
const pattern = /^(?=.*\d)(?=.*[A-Za-z]).{8,}$/;
pattern.test("password123"); // true
pattern.test("password");    // false (no digit)
pattern.test("12345678");    // false (no letter)
pattern.test("pass123");     // false (too short)
```

Use our [Regex Tester](/regex-tester/) to experiment with this pattern.

### Example 2: Extract numbers without units

**Requirement:** Find all numbers that aren't followed by "px" or "em".

**Pattern:**
```regex
\d+(?!px|em)
```

**How it works:**
- `\d+` - One or more digits
- `(?!px|em)` - Negative lookahead: NOT followed by "px" or "em"

**Example:**
```javascript
const text = "100px 200em 300rem 400";
const matches = text.match(/\d+(?!px|em)/g);
// Result: ["300", "400"]
```

### Example 3: Extract text after a label

**Requirement:** Extract the value after "User:" label.

**Pattern:**
```regex
(?<=User:)\s*\w+
```

**How it works:**
- `(?<=User:)` - Positive lookbehind: preceded by "User:"
- `\s*` - Optional whitespace
- `\w+` - One or more word characters

**Example:**
```javascript
const text = "User: john_doe Email: john@example.com";
const match = text.match(/(?<=User:)\s*\w+/);
// Result: [" john_doe"] (includes leading space, or use \s* outside)
```

**Better pattern (excludes whitespace):**
```regex
(?<=User:\s*)\w+
```

### Example 4: Validate email format (basic)

**Requirement:** Email must have @ symbol, but not at start or end.

**Pattern:**
```regex
^(?!@)(?=.*@)(?!.*@$).+$
```

**How it works:**
- `^` - Start
- `(?!@)` - Negative lookahead: doesn't start with "@"
- `(?=.*@)` - Positive lookahead: contains "@"
- `(?!.*@$)` - Negative lookahead: doesn't end with "@"
- `.+` - One or more characters
- `$` - End

**Note:** This is a basic check. For real email validation, see our [email regex guide](/blog/email-regex-that-works/).

### Example 5: Extract words not in quotes

**Requirement:** Find all words that aren't inside quotes.

**Pattern:**
```regex
\b\w+\b(?![^"]*"[^"]*"[^"]*$)
```

**How it works:**
- `\b\w+\b` - Word boundaries
- `(?![^"]*"[^"]*"[^"]*$)` - Negative lookahead: not followed by an odd number of quotes

**Simpler approach:** Use a parser instead of regex for complex cases like this.

## Common pitfalls

### Pitfall 1: Variable-length lookbehinds

**Problem:** Some engines don't support variable-length lookbehinds.

**What fails:**
```regex
(?<=\w+)\d+  // Variable length - may not work
```

**What works:**
```regex
(?<=\w)\d+   // Fixed length - works in more engines
```

**Solution:** Check your regex engine's capabilities. JavaScript (ES2018+) supports variable-length lookbehinds, but older engines don't.

### Pitfall 2: Performance with `.*` in lookarounds

**Problem:** `.*` inside lookarounds can cause performance issues.

**What's slow:**
```regex
(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}
```

**Why:** Each `.*` scans the entire string, causing multiple passes.

**Better approach:**
```regex
^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$
```

**Why better:** Anchors (`^`, `$`) limit the search space.

### Pitfall 3: Confusing lookahead direction

**Problem:** Developers confuse lookahead vs lookbehind direction.

**Remember:**
- **Lookahead** (`?=`, `?!`) - checks what comes AFTER
- **Lookbehind** (`?<=`, `?<!`) - checks what comes BEFORE

**Mnemonic:** "Ahead" = forward, "Behind" = backward.

### Pitfall 4: Multiple conditions order

**Problem:** Order of multiple lookaheads matters for performance.

**Less efficient:**
```regex
(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}
```

**More efficient:**
```regex
(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}
```

**Why:** Check simpler conditions first (digits are easier to find than letters).

## Compatibility across languages

### JavaScript

**Support:**
- ✅ Lookaheads: Full support (all versions)
- ✅ Lookbehinds: ES2018+ (fixed and variable length)
- ⚠️ Older browsers: May not support lookbehinds

**Check support:**
```javascript
try {
  new RegExp('(?<=test)');
  console.log('Lookbehind supported');
} catch (e) {
  console.log('Lookbehind not supported');
}
```

### Python

**Support:**
- ✅ Lookaheads: Full support
- ✅ Lookbehinds: Full support (fixed length)
- ✅ Variable-length lookbehinds: Supported in `regex` module (not `re`)

**Example:**
```python
import re

# Fixed-length lookbehind (works)
pattern = r'(?<=\$)\d+'
re.findall(pattern, 'Price: $100')

# Variable-length (needs regex module)
import regex
pattern = r'(?<=\w+)\d+'
regex.findall(pattern, 'abc123')
```

### Java

**Support:**
- ✅ Lookaheads: Full support
- ✅ Lookbehinds: Full support (fixed length only)
- ❌ Variable-length lookbehinds: Not supported

### PHP

**Support:**
- ✅ Lookaheads: Full support
- ✅ Lookbehinds: Full support (fixed length only)
- ❌ Variable-length lookbehinds: Not supported

## Performance best practices

### 1. Keep lookarounds specific

**Avoid:**
```regex
(?=.*something)  // Scans entire string
```

**Prefer:**
```regex
(?=something)    // Checks immediate context
```

### 2. Use anchors when possible

**Better:**
```regex
^(?=.*\d)(?=.*[a-z]).{8,}$
```

**Why:** Anchors limit the search space.

### 3. Order conditions efficiently

**Check simpler conditions first:**
```regex
(?=.*\d)(?=.*[a-z])(?=.*[A-Z])  // Digits first
```

### 4. Avoid nested lookarounds

**Avoid:**
```regex
(?=(?=.*\d).*[a-z])  // Nested lookaheads
```

**Prefer:**
```regex
(?=.*\d)(?=.*[a-z])  // Sequential lookaheads
```

## Debugging tips

### 1. Test incrementally

Build your pattern step by step:

```javascript
// Step 1: Basic pattern
/\d+/

// Step 2: Add lookahead
/\d+(?=px)/

// Step 3: Add more conditions
/\d+(?=px|em)/
```

### 2. Use our Regex Tester

Our [Regex Tester](/regex-tester/) lets you:
- Test patterns interactively
- See matches in real-time
- Understand what each part does
- Debug complex lookarounds

### 3. Check engine compatibility

Before using lookbehinds, verify your environment supports them:

```javascript
function supportsLookbehind() {
  try {
    new RegExp('(?<=test)');
    return true;
  } catch (e) {
    return false;
  }
}
```

## When to use lookarounds

**Use lookarounds when:**
- ✅ You need to check conditions without consuming characters
- ✅ You want to validate multiple conditions simultaneously
- ✅ You need to extract text based on context
- ✅ You want to exclude specific patterns

**Don't use lookarounds when:**
- ❌ Simple patterns work (don't overcomplicate)
- ❌ Performance is critical (they can be slower)
- ❌ Your engine doesn't support them (check compatibility)
- ❌ A parser would be better (for complex structures)

## Next steps

1. Try lookarounds with our [Regex Tester](/regex-tester/) to see them in action
2. Learn about [regex performance traps](/blog/regex-performance-traps/) to avoid slowdowns
3. Master [regular expressions basics](/blog/mastering-regular-expressions/) for deeper understanding
4. Read our [email regex guide](/blog/email-regex-that-works/) for practical examples
