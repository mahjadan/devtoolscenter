---
layout: layouts/blog.njk
title: Pretty Print JSON in Terminal (jq, Node, Python)
description: Quickly format JSON from the command line using jq, Node.js, and Python.
category: JSON
date: 2025-11-12
readTime: 7
tags: ["blog", "json"]
relatedTool: /json-formatter/
relatedToolName: JSON Formatter & Validator
relatedArticles:
  - /blog/understanding-json-formatting/
  - /blog/json-validate-vs-parse/
  - /blog/yaml-vs-json/
faq:
  - question: Is jq installed by default?
    answer: Not usually. Install it with your package manager; or use our in-browser JSON Formatter.
---

Whether you're inspecting API responses, debugging logs, or reviewing config files, pretty-printing JSON in the terminal transforms unreadable minified data into structured, readable format. Understanding why JSON gets minified and how to format it helps you debug faster.

## Why JSON needs formatting

JSON is often minified (all whitespace removed) to reduce file size and transmission overhead. While efficient, minified JSON is nearly impossible for humans to read:

```json
{"users":[{"id":1,"name":"Alice","email":"alice@example.com","roles":["admin","user"]},{"id":2,"name":"Bob","email":"bob@example.com","roles":["user"]}]}
```

Pretty-printing adds indentation and line breaks, making structure visible:

```json
{
  "users": [
    {
      "id": 1,
      "name": "Alice",
      "email": "alice@example.com",
      "roles": ["admin", "user"]
    },
    {
      "id": 2,
      "name": "Bob",
      "email": "bob@example.com",
      "roles": ["user"]
    }
  ]
}
```

## jq: The JSON processor (recommended)

`jq` is a powerful command-line JSON processor that's become the standard tool for terminal JSON work.

### Why jq is popular

- **Fast** - Written in C, handles large files efficiently
- **Powerful** - Can filter, transform, and query JSON, not just format
- **Colorized output** - Syntax highlighting makes reading easier
- **Cross-platform** - Works on macOS, Linux, and Windows

### Installation

```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# Fedora/RHEL
sudo yum install jq

# Windows (with Chocolatey)
choco install jq

# Windows (with Scoop)
scoop install jq
```

### Basic formatting

```bash
# Format JSON from file
cat data.json | jq .

# Format JSON from API response
curl -s https://api.example.com/data | jq .

# Format JSON string directly
echo '{"a":1,"b":[2,3]}' | jq .
```

### Customization options

```bash
# Indent with 2 spaces (default is 2, but explicit is clearer)
echo '{"a":1}' | jq --indent 2 .

# Indent with tabs
echo '{"a":1}' | jq --tab .

# Compact output (minify)
echo '{"a":1,"b":2}' | jq -c .

# Colorized output (default, but explicit with -C)
echo '{"a":1}' | jq -C .

# No color (useful for scripts)
echo '{"a":1}' | jq -M .
```

### Advanced: Filtering while formatting

```bash
# Format and extract specific fields
curl -s https://api.example.com/users | jq '.users[] | {name, email}'

# Format nested objects
cat config.json | jq '.database.connection'

# Format arrays with filtering
cat logs.json | jq '.[] | select(.level == "error")'
```

### Error handling

```bash
# jq validates JSON before formatting
echo '{"invalid": json}' | jq .
# Error: parse error: Invalid numeric literal

# Check if JSON is valid
echo '{"valid": true}' | jq . > /dev/null && echo "Valid JSON" || echo "Invalid JSON"
```

## Node.js: Built-in solution

Node.js has JSON parsing built-in, making it a good option if you're already in a Node.js environment.

### One-liner approach

```bash
# Simple one-liner
echo '{"a":1,"b":[2,3]}' | node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync(0, 'utf-8')), null, 2))"

# More readable version
echo '{"a":1,"b":[2,3]}' | node -p "JSON.stringify(JSON.parse(require('fs').readFileSync(0, 'utf-8')), null, 2)"
```

**Why this works:**
- `require('fs').readFileSync(0, 'utf-8')` reads from stdin (file descriptor 0)
- `JSON.parse()` parses the JSON string
- `JSON.stringify(obj, null, 2)` formats with 2-space indentation
- `node -p` prints the result

### Reusable script

Create `ppjson.mjs`:

```javascript
#!/usr/bin/env node
// ppjson.mjs - Pretty print JSON from stdin

import { readFileSync } from 'fs';

try {
  const input = readFileSync(0, 'utf-8').trim();
  if (!input) {
    console.error('No input provided');
    process.exit(1);
  }
  
  const parsed = JSON.parse(input);
  console.log(JSON.stringify(parsed, null, 2));
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
```

Make it executable and use:

```bash
chmod +x ppjson.mjs
cat data.json | ./ppjson.mjs

# Or install globally
npm install -g ppjson
cat data.json | ppjson
```

### Why Node.js approach works

- **No external dependencies** - Uses built-in modules
- **Error handling** - Can catch and report parse errors clearly
- **Familiar** - If you write JavaScript, this feels natural
- **Extensible** - Easy to add filtering or transformation logic

## Python: Simple and reliable

Python's `json.tool` module provides a simple way to format JSON.

### Basic usage

```bash
# Format JSON
echo '{"a":1,"b":[2,3]}' | python -m json.tool

# Format from file
python -m json.tool data.json

# Format with custom indentation (Python 3.9+)
echo '{"a":1}' | python -m json.tool --indent 2
```

### Why Python's approach works

- **Built-in module** - No installation needed if Python is available
- **Validates JSON** - Fails clearly on invalid input
- **Simple syntax** - Easy to remember and use
- **Cross-platform** - Works wherever Python runs

### Custom Python script

```python
#!/usr/bin/env python3
# ppjson.py - Pretty print JSON with error handling

import json
import sys

try:
    data = json.load(sys.stdin)
    json.dump(data, sys.stdout, indent=2, ensure_ascii=False)
    print()  # Add trailing newline
except json.JSONDecodeError as e:
    print(f"Invalid JSON: {e}", file=sys.stderr)
    sys.exit(1)
```

Usage:
```bash
chmod +x ppjson.py
cat data.json | ./ppjson.py
```

## Real-world scenarios

### Scenario 1: Debugging API responses

**Problem:** API returns minified JSON that's hard to inspect

**Solution:**
```bash
# Format API response
curl -s https://api.example.com/users | jq .

# Or with authentication
curl -s -H "Authorization: Bearer $TOKEN" https://api.example.com/users | jq .

# Extract specific fields while formatting
curl -s https://api.example.com/users | jq '.users[] | {id, name}'
```

### Scenario 2: Inspecting log files

**Problem:** Application logs contain JSON that's hard to read

**Solution:**
```bash
# Format JSON logs
tail -f app.log | grep "json" | jq .

# Filter and format error logs
cat app.log | jq 'select(.level == "error")'

# Format specific log entries
grep "request" app.log | jq -r '.request.body' | jq .
```

### Scenario 3: Validating config files

**Problem:** Need to verify JSON config files are valid and readable

**Solution:**
```bash
# Format and validate
cat config.json | jq . > config-formatted.json

# Check for syntax errors
cat config.json | jq . > /dev/null && echo "Valid" || echo "Invalid"

# Compare formatted versions
diff <(jq -S . file1.json) <(jq -S . file2.json)  # -S sorts keys
```

### Scenario 4: CI/CD pipeline validation

**Problem:** Want to validate JSON in CI without external tools

**Solution:**
```bash
# In CI script
if ! python3 -m json.tool config.json > /dev/null 2>&1; then
  echo "Invalid JSON in config.json"
  exit 1
fi

# Or with Node.js
if ! node -e "JSON.parse(require('fs').readFileSync('config.json'))" 2>/dev/null; then
  echo "Invalid JSON"
  exit 1
fi
```

## Performance considerations

**For large files:**
- `jq` is fastest (C implementation)
- Node.js is fast for most use cases
- Python can be slower for very large files

**For streaming:**
- `jq` handles streaming well
- Node.js can stream with `readline` module
- Python's `json.tool` reads entire input first

**Memory usage:**
- All tools load entire JSON into memory
- For huge files, consider streaming parsers or chunked processing

## Browser alternative

When you're not in a terminal, use our [JSON Formatter & Validator](/json-formatter/) tool:

- **Client-side** - All processing happens in your browser
- **Instant** - No network delay
- **Secure** - Your data never leaves your device
- **Feature-rich** - Format, validate, minify, and tree view

Perfect for:
- Quick JSON inspection during development
- Validating JSON before committing
- Formatting JSON for documentation
- Debugging API responses in browser DevTools

## Best practices

1. **Validate before formatting** - Catch errors early
   ```bash
   cat data.json | jq . > /dev/null && cat data.json | jq .
   ```

2. **Use consistent indentation** - 2 spaces is standard
   ```bash
   jq --indent 2 .
   ```

3. **Handle errors gracefully** - Don't let invalid JSON break scripts
   ```bash
   cat data.json | jq . || echo "Invalid JSON"
   ```

4. **Format in CI/CD** - Ensure config files are readable
   ```bash
   # Pre-commit hook
   jq . config.json > config.json.tmp && mv config.json.tmp config.json
   ```

5. **Compare formatted versions** - Use sorted keys for diffs
   ```bash
   jq -S . file1.json > file1-sorted.json
   jq -S . file2.json > file2-sorted.json
   diff file1-sorted.json file2-sorted.json
   ```

## Troubleshooting

**Problem:** "command not found: jq"
- **Solution:** Install jq using your package manager (see installation above)

**Problem:** "Invalid JSON" error
- **Solution:** Validate JSON first using our [JSON Formatter](/json-formatter/) to see exact error location

**Problem:** Large files are slow
- **Solution:** Use `jq` (fastest) or process in chunks for very large files

**Problem:** Need to preserve original formatting
- **Solution:** Use `jq -c .` to minify, or `jq .` to standardize formatting

## Next steps

1. Install `jq` for the best terminal experience
2. Try formatting JSON with our [JSON Formatter](/json-formatter/) in your browser
3. Learn about [JSON validation vs parsing](/blog/json-validate-vs-parse/) for production code
4. Read our guide on [fixing JSON parse errors](/blog/fix-unexpected-token-json/) when things go wrong
5. Compare JSON with [YAML format](/blog/yaml-vs-json/) for configuration files
