import { unified } from 'unified';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { createHighlighter, type Highlighter } from 'shiki';
import type { Root } from 'mdast';
import type { Transformer, TransformerOptions } from '../../types/index.js';
import { wrapInTemplate } from '../styles/html-template.js';

let highlighterPromise: Promise<Highlighter> | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: [
        'javascript',
        'typescript',
        'python',
        'bash',
        'json',
        'html',
        'css',
        'markdown',
        'yaml',
        'sql',
        'go',
        'rust',
        'java',
        'c',
        'cpp',
      ],
    });
  }
  return highlighterPromise;
}

export class HTMLTransformer implements Transformer {
  async transform(mdast: Root, options: TransformerOptions = {}): Promise<Buffer> {
    const { syntaxHighlight = true } = options;

    const processor = unified()
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousHtml: true });

    const hast = await processor.run(mdast);
    let html = processor.stringify(hast);

    if (syntaxHighlight) {
      html = await this.highlightCodeBlocks(html);
    }

    const fullHtml = wrapInTemplate(html);
    return Buffer.from(fullHtml, 'utf-8');
  }

  private async highlightCodeBlocks(html: string): Promise<string> {
    const codeBlockRegex = /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g;
    const highlighter = await getHighlighter();

    const matches: Array<{ full: string; lang: string; code: string }> = [];
    let match;

    while ((match = codeBlockRegex.exec(html)) !== null) {
      matches.push({
        full: match[0],
        lang: match[1],
        code: this.decodeHtmlEntities(match[2]),
      });
    }

    for (const { full, lang, code } of matches) {
      try {
        const loadedLangs = highlighter.getLoadedLanguages();
        const langToUse = loadedLangs.includes(lang) ? lang : 'text';

        const highlighted = highlighter.codeToHtml(code, {
          lang: langToUse,
          theme: 'github-light',
        });
        html = html.replace(full, highlighted);
      } catch {
        // Keep original if highlighting fails
      }
    }

    return html;
  }

  private decodeHtmlEntities(str: string): string {
    return str
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }
}

export const htmlTransformer = new HTMLTransformer();
