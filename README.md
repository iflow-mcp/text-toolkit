<div align="center">
  <img src="logo.png" alt="TextToolkit Logo" width="200"/>
  <h1>TextToolkit MCP Server</h1>
  <p>A Text Transformation & Formatting MCP Server for the Cline Marketplace that provides developers with common text manipulation functions directly within their workflow.</p>
  <p>
    <a href="https://github.com/Cicatriiz/text-toolkit"><img src="https://img.shields.io/badge/TextToolkit-MCP%20Server-blue" alt="TextToolkit"></a>
    <a href="https://github.com/Cicatriiz/text-toolkit/releases/tag/v1.0.0"><img src="https://img.shields.io/badge/version-1.0.0-green" alt="Version"></a>
    <a href="https://github.com/Cicatriiz/text-toolkit/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License"></a>
  </p>
</div>

> Transform, format, and analyze text without leaving your AI assistant workflow.

## Available Tools

| Tool | Description |
| ---- | ----------- |
| case_to_camel | Convert text to camelCase |
| case_to_pascal | Convert text to PascalCase |
| case_to_snake | Convert text to snake_case |
| case_to_kebab | Convert text to kebab-case |
| case_to_constant | Convert text to CONSTANT_CASE |
| case_to_dot | Convert text to dot.case |
| case_to_no | Convert text to no case |
| case_to_pascal_snake | Convert text to Pascal_Snake_Case |
| case_to_path | Convert text to path/case |
| case_to_sentence | Convert text to Sentence case |
| case_to_train | Convert text to Train-Case |
| case_to_capital | Convert text to Capital Case |
| encode_base64 | Encode text to Base64 |
| decode_base64 | Decode Base64 to text |
| encode_url | Encode text for URLs |
| decode_url | Decode URL-encoded text |
| encode_html | Encode HTML entities |
| decode_html | Decode HTML entities |
| format_json | Format and beautify JSON |
| format_xml | Format and beautify XML |
| format_sql | Format and beautify SQL |
| format_html | Format and beautify HTML |
| count_characters | Count characters in text |
| count_words | Count words in text |
| count_lines | Count lines in text |
| analyze_readability | Calculate readability metrics |
| string_trim | Trim whitespace from text |
| string_substring | Extract a substring |
| string_replace | Replace text |
| string_split | Split text into an array |
| string_join | Join an array into text |
| generate_uuid | Generate a UUID |
| validate_uuid | Validate a UUID |
| generate_md5 | Generate MD5 hash |
| generate_sha1 | Generate SHA-1 hash |
| generate_sha256 | Generate SHA-256 hash |
| generate_sha512 | Generate SHA-512 hash |
| generate_hmac | Generate HMAC hash |
| generate_lorem_ipsum | Generate lorem ipsum text |
| regex_test | Test a regex pattern against text |
| regex_replace | Replace text using a regex pattern |
| regex_extract | Extract matches using a regex pattern |
| regex_split | Split text using a regex pattern |

## 🌟 Features

### 🔠 Case Transformations
- Convert text between camelCase, PascalCase, snake_case, kebab-case
- Support for CONSTANT_CASE, dot.case, no case, Pascal_Snake_Case
- Additional formats: path/case, Sentence case, Train-Case, Capital Case
- Customizable with delimiter and locale options

### 🔄 String Encoding/Decoding
- Base64 encoding and decoding
- URL encoding and decoding
- HTML entity encoding and decoding
- Secure and reliable conversions

### 📝 Formatting and Beautification
- JSON formatting with customizable indentation
- XML formatting and pretty-printing
- SQL query formatting and standardization
- HTML code beautification

### 📊 Text Analysis
- Character counting (with and without spaces)
- Word counting with accurate tokenization
- Line counting for multi-line text
- Readability scoring (Flesch-Kincaid, etc.)

### ✂️ String Manipulation
- Trim whitespace (start, end, or both)
- Extract substrings with precise control
- Replace text with powerful options
- Split text into arrays and join arrays into text

### 🆔 UUID/GUID Generation
- Generate UUIDs (v1, v4, v5, or nil)
- Validate existing UUIDs
- Customizable options for all UUID versions

### 🔒 Hash Generation
- MD5 hash generation
- SHA-1, SHA-256, and SHA-512 hashing
- HMAC hash generation with custom keys
- Secure cryptographic functions

### 📄 Lorem Ipsum Generation
- Generate placeholder text
- Customizable length and format
- Control paragraph and sentence structure

### 🔍 Regex Pattern Testing
- Test regex patterns against text
- Replace text using regex patterns
- Extract matches using regex patterns
- Split text using regex patterns

## 💻 Installation

### Prerequisites

- Node.js 16.x or higher - The TextToolkit MCP server requires Node.js 16+ to run properly.

### Setup

To run the TextToolkit MCP server using Node.js npx, use the following command:

```bash
npx -y text-toolkit@latest
```

### Client-Specific Installation

#### Cursor

To add this server to Cursor IDE:

1. Go to Cursor Settings > MCP
2. Click + Add new Global MCP Server
3. Add the following configuration to your global `.cursor/mcp.json` file:

```json
{
  "mcpServers": {
    "text-toolkit": {
      "command": "npx",
      "args": [
        "-y",
        "text-toolkit"
      ]
    }
  }
}
```

See the [Cursor documentation](https://cursor.sh/docs/mcp) for more details.

#### Windsurf

To set up MCP with Cascade, navigate to Windsurf - Settings > Advanced Settings or Command Palette > Open Windsurf Settings Page.

Scroll down to the Cascade section and add the TextToolkit MCP server directly in `mcp_config.json`:

```json
{
  "mcpServers": {
    "text-toolkit": {
      "command": "npx",
      "args": [
        "-y",
        "text-toolkit"
      ]
    }
  }
}
```

#### Cline

Add the following JSON manually to your `cline_mcp_settings.json` via Cline MCP Server setting:

```json
{
  "mcpServers": {
    "text-toolkit": {
      "command": "npx",
      "args": [
        "-y",
        "text-toolkit"
      ]
    }
  }
}
```

#### Roo Code

Access the MCP settings by clicking Edit MCP Settings in Roo Code settings or using the Roo Code: Open MCP Config command in VS Code's command palette:

```json
{
  "mcpServers": {
    "text-toolkit": {
      "command": "npx",
      "args": [
        "-y",
        "text-toolkit"
      ]
    }
  }
}
```

#### Claude

Add the following to your `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "text-toolkit": {
      "command": "npx",
      "args": [
        "-y",
        "text-toolkit"
      ]
    }
  }
}
```

See the [Claude Desktop documentation](https://claude.ai/docs/mcp) for more details.

#### CLI

You can also run it as CLI by running the following command:

```bash
npx -y text-toolkit@latest
```

### Alternative Installation Methods

#### Install from npm

```bash
# Install globally from npm
npm install -g text-toolkit

# Run the server
text-toolkit
```

#### Manual Installation

```bash
# Clone the repository
git clone https://github.com/Cicatriiz/text-toolkit.git
cd text-toolkit

# Install dependencies
npm install

# Build the project
npm run build

# Run the server
node dist/index.js
```

## 💬 Usage

### Command Line

```bash
# Start in stdio mode (default)
text-toolkit

# Start in SSE mode on a specific port
text-toolkit --sse --port=8000

# Display version
text-toolkit --version
```

### Testing with MCP Inspector

You can test the TextToolkit MCP server using the MCP Inspector:

```bash
# Install the MCP Inspector
npm install -g @modelcontextprotocol/inspector

# Run the inspector against your server
mcp-inspector text-toolkit
```

### Examples

The repository includes example scripts demonstrating how to use the TextToolkit MCP server:

```bash
# Run the case transformation example
node examples/case-transform-example.js
```

This example demonstrates how to:

1. Connect to the TextToolkit MCP server
2. List available tools
3. Transform text to different cases
4. Use custom options for transformations

## 🔧 Available Tools

### 1. case_to_camel

Converts text to camelCase.

**Parameters:**
- `text`: The text to transform
- `delimiter` (optional): The character to use between words
- `locale` (optional): Locale for case conversion
- `mergeAmbiguousCharacters` (optional): Whether to merge ambiguous characters

**Example:**
```json
{
  "text": "hello world test"
}
```

**Response:**
```json
{
  "result": "helloWorldTest"
}
```

### 2. case_to_pascal

Converts text to PascalCase.

**Parameters:**
- `text`: The text to transform
- `delimiter` (optional): The character to use between words
- `locale` (optional): Locale for case conversion
- `mergeAmbiguousCharacters` (optional): Whether to merge ambiguous characters

**Example:**
```json
{
  "text": "hello world test"
}
```

**Response:**
```json
{
  "result": "HelloWorldTest"
}
```

### 3. encode_base64

Encodes text to Base64.

**Parameters:**
- `text`: The text to encode

**Example:**
```json
{
  "text": "hello world"
}
```

**Response:**
```json
{
  "result": "aGVsbG8gd29ybGQ="
}
```

### 4. decode_base64

Decodes Base64 to text.

**Parameters:**
- `text`: The Base64 string to decode

**Example:**
```json
{
  "text": "aGVsbG8gd29ybGQ="
}
```

**Response:**
```json
{
  "result": "hello world"
}
```

### 5. format_json

Formats and beautifies JSON.

**Parameters:**
- `text`: The JSON text to format
- `indent_size` (optional): Number of spaces for indentation (1-8). Defaults to 2.

**Example:**
```json
{
  "text": "{\"name\":\"John\",\"age\":30,\"city\":\"New York\"}",
  "indent_size": 4
}
```

**Response:**
```json
{
  "result": "{\n    \"name\": \"John\",\n    \"age\": 30,\n    \"city\": \"New York\"\n}"
}
```

### 6. count_characters

Counts characters in text.

**Parameters:**
- `text`: The text to analyze

**Example:**
```json
{
  "text": "hello world"
}
```

**Response:**
```json
{
  "total_characters": 11,
  "characters_without_spaces": 10
}
```

### 7. string_replace

Replaces text.

**Parameters:**
- `text`: The text to perform replacements on
- `search`: The string to search for
- `replace`: The string to replace with
- `replace_all` (optional): Whether to replace all occurrences. Defaults to true.

**Example:**
```json
{
  "text": "hello world",
  "search": "world",
  "replace": "universe"
}
```

**Response:**
```json
{
  "result": "hello universe"
}
```

### 8. generate_uuid

Generates a UUID.

**Parameters:**
- `version` (optional): UUID version to generate (v1, v4, v5, nil). Defaults to v4.
- `namespace` (optional): Namespace for v5 UUID (required for v5)
- `name` (optional): Name for v5 UUID (required for v5)
- `uppercase` (optional): Whether to return the UUID in uppercase. Defaults to false.

**Example:**
```json
{
  "version": "v4"
}
```

**Response:**
```json
{
  "uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}
```

### 9. generate_lorem_ipsum

Generates lorem ipsum text.

**Parameters:**
- `count` (optional): Number of units to generate. Defaults to 5.
- `units` (optional): Type of units to generate (words, sentences, paragraphs). Defaults to sentences.
- `paragraphLowerBound` (optional): Minimum sentences per paragraph. Defaults to 3.
- `paragraphUpperBound` (optional): Maximum sentences per paragraph. Defaults to 7.
- `sentenceLowerBound` (optional): Minimum words per sentence. Defaults to 5.
- `sentenceUpperBound` (optional): Maximum words per sentence. Defaults to 15.
- `format` (optional): Output format (plain, html). Defaults to plain.

**Example:**
```json
{
  "count": 2,
  "units": "sentences"
}
```

**Response:**
```json
{
  "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut hendrerit ipsum in nulla euismod, vel ultrices nisi tincidunt."
}
```

### 10. regex_test

Tests a regex pattern against text.

**Parameters:**
- `text`: The text to test against the pattern
- `pattern`: The regex pattern to test
- `flags` (optional): Regex flags (e.g., 'g', 'i', 'gi'). Defaults to 'g'.

**Example:**
```json
{
  "text": "hello world",
  "pattern": "\\w+",
  "flags": "g"
}
```

**Response:**
```json
{
  "matches": ["hello", "world"],
  "match_count": 2,
  "is_match": true
}
```

## 💬 Example Queries in Claude Desktop

- "Convert 'hello world' to camelCase"
- "Encode 'hello world' to Base64"
- "Format this JSON: {\"name\":\"John\",\"age\":30}"
- "Count the characters in 'hello world'"
- "Replace 'world' with 'universe' in 'hello world'"
- "Generate a UUID"
- "Generate 2 sentences of lorem ipsum"
- "Test if 'hello world' matches the regex pattern '\\w+'"
- "Convert 'Hello World' to snake_case"
- "Decode this Base64 string: aGVsbG8gd29ybGQ="

## 💻 Technical Details

### Architecture

TextToolkit is built using the Model Context Protocol (MCP) specification, which allows it to integrate seamlessly with Claude Desktop and other MCP-compatible clients. The server is implemented in TypeScript and uses the following architecture:

- **Core Services**: Implements text transformation, encoding/decoding, and formatting
- **MCP Server**: Handles JSON-RPC requests from clients
- **Utility Functions**: Provides helper functions for text operations
- **Testing Framework**: Includes comprehensive test scripts for verifying functionality

### Dependencies

- **change-case** - For case transformation operations
- **crypto-js** - For hash generation
- **js-beautify** - For code formatting and beautification
- **uuid** - For UUID generation and validation
- **lorem-ipsum** - For placeholder text generation
- **@modelcontextprotocol/sdk** - For MCP server implementation

### Requirements

- Node.js 16.x or higher
- npm 7.x or higher

## 📝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔍 Testing

TextToolkit includes comprehensive test scripts that can be used to verify the functionality of the MCP server. The test scripts can be used to test both stdio and SSE modes.

### Running Tests

```bash
# Test stdio mode
node test-comprehensive.js

# Test SSE mode
node test-sse-comprehensive.js
```

## 🔒 Privacy & Security

TextToolkit processes all data locally and does not send any information to external servers. Your text data and queries remain private on your device.

## 📃 License

MIT

## 👨‍💻 Author

Cicatriz 