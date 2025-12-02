import { readFile, writeFile } from 'fs/promises';
import { MarkdownParser } from './parser/index.js';
import { getTransformer } from './transformers/index.js';
import type { ConvertOptions, OutputFormat } from '../types/index.js';

export class Converter {
  private parser: MarkdownParser;

  constructor() {
    this.parser = new MarkdownParser();
  }

  async convert(input: string | Buffer, options: ConvertOptions): Promise<Buffer> {
    const markdown = typeof input === 'string' ? input : input.toString('utf-8');
    const { format, syntaxHighlight = true, pageSize = 'A4' } = options;

    // Parse markdown to MDAST
    const { mdast } = this.parser.parse(markdown);

    // Get appropriate transformer
    const transformer = getTransformer(format);

    // Transform to output format
    return transformer.transform(mdast, {
      syntaxHighlight,
      pageSize,
    });
  }

  async convertFile(
    inputPath: string,
    outputPath: string,
    options: ConvertOptions
  ): Promise<void> {
    const input = await readFile(inputPath);
    const output = await this.convert(input, options);
    await writeFile(outputPath, output);
  }
}

export const converter = new Converter();

// Convenience function for one-off conversions
export async function convert(
  markdown: string,
  format: OutputFormat,
  options: Partial<ConvertOptions> = {}
): Promise<Buffer> {
  return converter.convert(markdown, { format, ...options });
}
