# md-converter

Convert Markdown files to **DOCX**, **PDF**, **HTML**, and **TXT** formats with full GitHub Flavored Markdown support.

## Features

- 📄 **Multiple Output Formats**: DOCX, PDF, HTML, TXT
- 🎨 **Preserves Formatting**: Headings, bold, italic, strikethrough
- 📊 **GitHub Flavored Markdown**: Tables, task lists, code blocks
- 🎯 **Syntax Highlighting**: Beautiful code blocks in HTML and PDF
- 🚀 **Fast & Easy**: Simple CLI commands
- 🌐 **Web API**: REST API for integration

## Installation

### Prerequisites

- **Node.js 18+**
- **Chrome/Chromium** (for PDF generation)

### Install via npm

```bash
npm install -g md-converter
```

### Verify Installation

```bash
md-converter --version
```

## Usage

### Basic Command

```bash
md-converter <input.md> -f <format>
```

### Examples

**Convert to Word Document**
```bash
md-converter document.md -f docx
```

**Convert to PDF**
```bash
md-converter document.md -f pdf
```

**Convert to HTML**
```bash
md-converter document.md -f html
```

**Convert to Plain Text**
```bash
md-converter document.md -f txt
```

**Specify Output File**
```bash
md-converter document.md -f pdf -o report.pdf
```

**Verbose Output**
```bash
md-converter document.md -f docx -v
```

### Command Options

| Option | Description | Default |
|--------|-------------|---------|
| `-f, --format <format>` | Output format: `docx`, `pdf`, `html`, `txt` | *Required* |
| `-o, --output <path>` | Output file path | Same name as input |
| `--no-syntax-highlight` | Disable code syntax highlighting | Enabled |
| `--page-size <size>` | PDF page size: `A4` or `Letter` | `A4` |
| `-v, --verbose` | Show detailed output | Disabled |
| `-h, --help` | Display help | |
| `-V, --version` | Show version number | |

## Supported Markdown Features

✅ Headings (H1-H6)
✅ **Bold**, *italic*, ~~strikethrough~~
✅ Code blocks with syntax highlighting
✅ `Inline code`
✅ Tables
✅ Task lists `[ ]` and `[x]`
✅ Ordered and unordered lists
✅ Blockquotes
✅ Links and images
✅ Horizontal rules

## Web API

Start the server:

```bash
# Clone the repository
git clone https://github.com/jabezpauls/md-converter.git
cd md-converter
npm install
npm run server
```

Server runs on `http://localhost:3000`

### API Endpoints

#### POST /api/v1/convert
Convert markdown via JSON body

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/convert \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Hello\n\nWorld", "format": "docx"}' \
  --output output.docx
```

**Request Body:**
```json
{
  "markdown": "# Your markdown here",
  "format": "docx",
  "options": {
    "syntaxHighlight": true,
    "pageSize": "A4"
  }
}
```

#### POST /api/v1/convert/file
Convert uploaded markdown file

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/convert/file \
  -F "file=@document.md" \
  -F "format=pdf" \
  --output output.pdf
```

#### GET /api/v1/health
Health check endpoint

#### GET /api/v1/formats
List all supported formats

## Programmatic Usage

```javascript
import { convert } from 'md-converter';

const markdown = '# Hello World\n\nThis is **bold** text.';
const buffer = await convert(markdown, 'docx');

// Write to file
import { writeFile } from 'fs/promises';
await writeFile('output.docx', buffer);
```

## Output Styling

### DOCX
- Heading styles: Heading1, Heading2, Heading3 (orange color)
- Body text with proper spacing
- Tables with borders
- Code blocks with monospace font (Consolas)

### PDF
- Rendered via Chrome for high fidelity
- Syntax highlighted code blocks
- Configurable page size (A4/Letter)
- 1-inch margins

### HTML
- Clean, responsive design
- Syntax highlighted code blocks
- Mobile-friendly
- Print-optimized CSS

### TXT
- Plain text extraction
- ASCII table formatting
- Preserved structure

## Examples

See the `examples/` directory for sample markdown files and their converted outputs.

## Requirements

- **Node.js**: Version 18 or higher
- **Chrome/Chromium**: Required for PDF generation
  - Linux: `apt install chromium-browser` or `apt install google-chrome-stable`
  - macOS: Install Chrome from official website
  - Windows: Install Chrome from official website

## Troubleshooting

### Chrome not found for PDF generation

Set the `CHROME_PATH` environment variable:

```bash
export CHROME_PATH=/path/to/chrome
md-converter document.md -f pdf
```

### Permission errors on Linux

If you get permission errors, ensure Chrome can run in sandboxed mode or install required dependencies:

```bash
sudo apt-get install -y \
  libgbm1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libgtk-3-0 \
  libnss3
```

## Development

```bash
# Clone repository
git clone https://github.com/jabezpauls/md-converter.git
cd md-converter

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Start development mode
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

Created by Jabez Pauls

## Links

- **GitHub**: https://github.com/jabezpauls/md-converter
- **Issues**: https://github.com/jabezpauls/md-converter/issues
- **npm**: https://www.npmjs.com/package/md-converter

---

**Made with ❤️ using Node.js and TypeScript**
