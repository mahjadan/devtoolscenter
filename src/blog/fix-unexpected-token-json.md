---
layout: layouts/blog.njk
title: Fix “Unexpected token” JSON Errors
description: A quick troubleshooting guide for common JSON parsing errors.
category: JSON
date: 2025-11-12
readTime: 6
tags: ["blog", "json"]
relatedTool: /json-formatter/
relatedToolName: JSON Formatter & Validator
relatedArticles:
  - /blog/understanding-json-formatting/
  - /blog/json-validate-vs-parse/
faq:
  - question: Why does my JSON fail to parse?
    answer: Trailing commas, single quotes, and unescaped characters are common causes. Format and validate first.
---

"Unexpected token" errors frustrate developers daily. These errors occur when JSON parsers encounter syntax that doesn't match JSON's strict grammar. Understanding why these errors happen and how to fix them systematically saves debugging time.

## Why "Unexpected token" errors occur

JSON has strict syntax rules. Unlike JavaScript, JSON doesn't allow:
- Trailing commas
- Single quotes for strings
- Comments
- Unquoted keys
- Undefined values

When parsers hit these, they throw "Unexpected token" errors because they expect valid JSON syntax but find something else.

## Common causes and fixes

### Cause 1: Trailing commas

**Why it fails:**
JSON specification doesn't allow commas after the last item in objects or arrays.

**Error message:**
```
SyntaxError: Unexpected token } in JSON at position X
```

**Examples:**
```json
// ❌ Bad - trailing comma in object
{
  "name": "Alice",
  "age": 30,  // ← This comma causes error
}

// ❌ Bad - trailing comma in array
{
  "tags": ["javascript", "json",]  // ← Trailing comma
}

// ✅ Good
{
  "name": "Alice",
  "age": 30
}

// ✅ Good
{
  "tags": ["javascript", "json"]
}
```

**How to fix:**
```javascript
// Remove trailing commas before parsing
function removeTrailingCommas(jsonString) {
  // Remove trailing commas before } and ]
  return jsonString
    .replace(/,(\s*[}\]])/g, '$1');
}

const cleaned = removeTrailingCommas(userInput);
const parsed = JSON.parse(cleaned);
```

**Prevention:**
- Use JSON linters in your editor
- Configure ESLint/Prettier to catch trailing commas
- Use our [JSON Formatter](/json-formatter/) to validate before parsing

### Cause 2: Single quotes instead of double quotes

**Why it fails:**
JSON requires double quotes for strings. Single quotes are invalid.

**Error message:**
```
SyntaxError: Unexpected token ' in JSON at position X
```

**Examples:**
```json
// ❌ Bad - single quotes
{
  'name': 'Alice',
  "message": 'Hello world'
}

// ✅ Good - double quotes everywhere
{
  "name": "Alice",
  "message": "Hello world"
}
```

**How to fix:**
```javascript
// Replace single quotes with double quotes (careful with apostrophes!)
function fixQuotes(jsonString) {
  // This is simplistic - be careful with apostrophes in strings
  // Better: use a proper JSON formatter
  return jsonString.replace(/'/g, '"');
}

// Better approach: Use a formatter
// Paste into our JSON Formatter tool to fix automatically
```

**Prevention:**
- Always use double quotes in JSON
- Use JSON-aware editors that highlight syntax errors
- Validate with [JSON Formatter](/json-formatter/) before parsing

### Cause 3: Unescaped control characters

**Why it fails:**
Control characters (newlines, tabs, etc.) and backslashes must be escaped in JSON strings.

**Error message:**
```
SyntaxError: Unexpected token in JSON at position X
```

**Examples:**
```json
// ❌ Bad - unescaped newline
{
  "message": "Line 1
Line 2"
}

// ❌ Bad - unescaped backslash
{
  "path": "C:\Users\Alice"
}

// ✅ Good - escaped newline
{
  "message": "Line 1\nLine 2"
}

// ✅ Good - escaped backslash
{
  "path": "C:\\Users\\Alice"
}
```

**How to fix:**
```javascript
// JSON.stringify automatically escapes these
const obj = {
  message: "Line 1\nLine 2",
  path: "C:\\Users\\Alice"
};
const jsonString = JSON.stringify(obj); // Properly escaped

// If you have a string with unescaped chars, you need to escape them
function escapeJSONString(str) {
  return str
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/"/g, '\\"')    // Escape quotes
    .replace(/\n/g, '\\n')   // Escape newlines
    .replace(/\r/g, '\\r')   // Escape carriage returns
    .replace(/\t/g, '\\t');  // Escape tabs
}
```

**Prevention:**
- Always use `JSON.stringify()` to create JSON strings
- Never manually construct JSON strings
- Use our [JSON Formatter](/json-formatter/) to see escaped versions

### Cause 4: Comments in JSON

**Why it fails:**
JSON doesn't support comments. Comments are a JavaScript feature, not JSON.

**Error message:**
```
SyntaxError: Unexpected token / in JSON at position X
```

**Examples:**
```json
// ❌ Bad - single-line comment
{
  "name": "Alice"  // This is a comment
}

// ❌ Bad - multi-line comment
{
  /* This is a comment */
  "name": "Alice"
}

// ✅ Good - no comments
{
  "name": "Alice"
}

// ✅ Alternative - use a comment field (if you must)
{
  "_comment": "This is a comment",
  "name": "Alice"
}
```

**How to fix:**
```javascript
// Remove comments before parsing
function removeComments(jsonString) {
  // Remove single-line comments
  jsonString = jsonString.replace(/\/\/.*$/gm, '');
  
  // Remove multi-line comments
  jsonString = jsonString.replace(/\/\*[\s\S]*?\*\//g, '');
  
  return jsonString;
}

const cleaned = removeComments(jsonWithComments);
const parsed = JSON.parse(cleaned);
```

**Prevention:**
- Use JSONC (JSON with Comments) only in development
- Convert JSONC to JSON before production
- Use separate documentation files for comments

### Cause 5: Unquoted keys

**Why it fails:**
JSON requires all object keys to be quoted strings.

**Error message:**
```
SyntaxError: Unexpected token name in JSON at position X
```

**Examples:**
```json
// ❌ Bad - unquoted keys
{
  name: "Alice",
  age: 30
}

// ✅ Good - quoted keys
{
  "name": "Alice",
  "age": 30
}
```

**How to fix:**
```javascript
// This is tricky - better to use a formatter
// Our JSON Formatter tool handles this automatically
```

**Prevention:**
- Always quote object keys in JSON
- Use JSON-aware editors
- Validate with [JSON Formatter](/json-formatter/)

### Cause 6: BOM or encoding issues

**Why it fails:**
Byte Order Mark (BOM) or wrong encoding can cause parsers to fail on the first character.

**Error message:**
```
SyntaxError: Unexpected token in JSON at position 0
```

**How to fix:**
```javascript
// Remove BOM if present
function removeBOM(str) {
  if (str.charCodeAt(0) === 0xFEFF) {
    return str.slice(1);
  }
  return str;
}

// Ensure UTF-8 encoding
const cleaned = removeBOM(fileContent);
const parsed = JSON.parse(cleaned);
```

**Prevention:**
- Save files as UTF-8 without BOM
- Configure editors to use UTF-8
- Validate encoding before parsing

## Systematic debugging approach

When you get an "Unexpected token" error, follow these steps:

### Step 1: Identify the error location

```javascript
try {
  JSON.parse(jsonString);
} catch (error) {
  // Error message usually includes position
  const position = parseInt(error.message.match(/position (\d+)/)?.[1] || '0');
  console.log('Error at position:', position);
  console.log('Context:', jsonString.substring(Math.max(0, position - 20), position + 20));
}
```

### Step 2: Use a formatter to see the issue

Paste your JSON into our [JSON Formatter](/json-formatter/) tool. It will:
- Highlight syntax errors
- Show exact error locations
- Suggest fixes

### Step 3: Clean common issues

```javascript
function cleanJSON(jsonString) {
  return jsonString
    .trim()                           // Remove leading/trailing whitespace
    .replace(/\/\/.*$/gm, '')         // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/,(\s*[}\]])/g, '$1')    // Remove trailing commas
    .replace(/'/g, '"');               // Replace single quotes (careful!)
}
```

**Warning:** Automated cleaning can break valid JSON. Always validate after cleaning.

### Step 4: Validate and parse

```javascript
function safeParse(jsonString) {
  // Clean first
  const cleaned = cleanJSON(jsonString);
  
  // Try to parse
  try {
    return {
      success: true,
      data: JSON.parse(cleaned)
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      position: error.message.match(/position (\d+)/)?.[1]
    };
  }
}
```

## Real-world scenarios

### Scenario 1: API response has trailing comma

**Problem:** Third-party API returns JSON with trailing comma

**Solution:**
```javascript
async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  let jsonText = await response.text();
  
  // Remove trailing commas
  jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1');
  
  return JSON.parse(jsonText);
}
```

### Scenario 2: Config file has comments

**Problem:** Developer added comments to config.json (JSONC format)

**Solution:**
```javascript
// Development: Allow comments
function loadConfigDev() {
  const content = fs.readFileSync('config.jsonc', 'utf8');
  const cleaned = content
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  return JSON.parse(cleaned);
}

// Production: Use strict JSON
function loadConfigProd() {
  return JSON.parse(fs.readFileSync('config.json', 'utf8'));
}
```

### Scenario 3: Copy-paste introduced errors

**Problem:** JSON copied from documentation has formatting issues

**Solution:**
1. Paste into [JSON Formatter](/json-formatter/)
2. Tool highlights errors
3. Fix errors or use formatted output
4. Copy corrected JSON

## Prevention strategies

### 1. Use JSON linters

**VS Code:**
- Install "JSON" extension (built-in)
- Install "JSONLint" for stricter validation

**ESLint:**
```json
{
  "extends": ["plugin:json/recommended"]
}
```

### 2. Validate in CI/CD

```bash
#!/bin/bash
# Validate all JSON files
for file in $(find . -name "*.json"); do
  if ! python3 -m json.tool "$file" > /dev/null 2>&1; then
    echo "Invalid JSON: $file"
    exit 1
  fi
done
```

### 3. Use proper JSON generation

**Never manually construct JSON:**
```javascript
// ❌ Bad
const json = '{"name": "' + userName + '"}';  // Breaks if userName has quotes!

// ✅ Good
const json = JSON.stringify({ name: userName });
```

### 4. Format before committing

```bash
# Pre-commit hook
jq . config.json > config.json.tmp && mv config.json.tmp config.json
```

## Tools for fixing JSON errors

### Browser tool (recommended)

Our [JSON Formatter & Validator](/json-formatter/) provides:
- **Instant validation** - See errors immediately
- **Error highlighting** - Exact error locations
- **Auto-formatting** - Fixes common issues automatically
- **Client-side** - Your data stays private
- **Tree view** - Visual structure inspection

### Command-line tools

```bash
# jq validates and formats
cat data.json | jq .

# Python validates
python3 -m json.tool data.json

# Node.js validates
node -e "JSON.parse(require('fs').readFileSync('data.json'))"
```

## Common error patterns

| Error Pattern | Cause | Fix |
|--------------|-------|-----|
| `Unexpected token }` | Trailing comma | Remove comma before `}` |
| `Unexpected token '` | Single quotes | Replace with double quotes |
| `Unexpected token /` | Comments | Remove comments |
| `Unexpected token name` | Unquoted key | Quote the key |
| `Unexpected end of JSON` | Incomplete JSON | Check for missing closing braces |
| `Unexpected token in JSON at position 0` | BOM or encoding | Remove BOM, ensure UTF-8 |

## Best practices

1. **Always validate** - Use [JSON Formatter](/json-formatter/) before parsing
2. **Use proper tools** - Don't manually construct JSON strings
3. **Handle errors gracefully** - Catch parse errors and show helpful messages
4. **Log context** - Include position and surrounding text in error logs
5. **Use linters** - Catch errors before runtime
6. **Keep it JSON** - Don't use JSON5/JSONC in production

## Next steps

1. Try validating your JSON with our [JSON Formatter](/json-formatter/) tool
2. Learn about [JSON validation vs parsing](/blog/json-validate-vs-parse/) for production code
3. Read our guide on [formatting JSON in terminal](/blog/pretty-print-json-terminal/) for CI/CD
4. Understand [JSON formatting basics](/blog/understanding-json-formatting/) for better practices
