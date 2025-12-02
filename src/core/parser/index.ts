import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Root } from 'mdast';
import type { ParseOptions, ParseResult } from '../../types/index.js';

export class MarkdownParser {
  parse(markdown: string, options: ParseOptions = {}): ParseResult {
    const { gfm = true } = options;

    const processor = unified().use(remarkParse);

    if (gfm) {
      processor.use(remarkGfm);
    }

    const mdast = processor.parse(markdown) as Root;

    return { mdast };
  }
}

export const parser = new MarkdownParser();
