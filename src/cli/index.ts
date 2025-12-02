import { Command } from 'commander';
import { convertCommand } from './commands/convert.js';

const program = new Command();

program
  .name('md-converter')
  .description('Convert Markdown to DOCX, PDF, TXT, or HTML')
  .version('1.0.0');

program
  .argument('<input>', 'Input markdown file')
  .requiredOption('-f, --format <format>', 'Output format: docx, pdf, txt, html')
  .option('-o, --output <path>', 'Output file path')
  .option('--no-syntax-highlight', 'Disable code syntax highlighting')
  .option('--page-size <size>', 'PDF page size: A4 or Letter', 'A4')
  .option('-v, --verbose', 'Verbose output')
  .action(convertCommand);

program.parse();
