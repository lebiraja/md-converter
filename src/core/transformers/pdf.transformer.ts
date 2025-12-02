import puppeteer, { type Browser, type Page } from 'puppeteer-core';
import type { Root } from 'mdast';
import type { Transformer, TransformerOptions } from '../../types/index.js';
import { HTMLTransformer } from './html.transformer.js';

const CHROME_PATHS = [
  // Linux
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/snap/bin/chromium',
  // macOS
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  // Windows
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
];

async function findChrome(): Promise<string> {
  const { existsSync } = await import('fs');

  for (const path of CHROME_PATHS) {
    if (existsSync(path)) {
      return path;
    }
  }

  // Try to find via which command on Unix
  try {
    const { execSync } = await import('child_process');
    const chromePath = execSync('which google-chrome || which chromium || which chromium-browser', {
      encoding: 'utf-8',
    }).trim();
    if (chromePath) {
      return chromePath;
    }
  } catch {
    // Ignore errors
  }

  throw new Error(
    'Chrome/Chromium not found. Please install Chrome or Chromium, or set CHROME_PATH environment variable.'
  );
}

export class PDFTransformer implements Transformer {
  private browser: Browser | null = null;
  private htmlTransformer: HTMLTransformer;

  constructor() {
    this.htmlTransformer = new HTMLTransformer();
  }

  async transform(mdast: Root, options: TransformerOptions = {}): Promise<Buffer> {
    const { pageSize = 'A4' } = options;

    // First convert to HTML
    const htmlBuffer = await this.htmlTransformer.transform(mdast, options);
    const html = htmlBuffer.toString('utf-8');

    // Then convert HTML to PDF
    return this.htmlToPdf(html, pageSize);
  }

  private async htmlToPdf(html: string, pageSize: 'A4' | 'Letter'): Promise<Buffer> {
    const browser = await this.getBrowser();
    let page: Page | null = null;

    try {
      page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: pageSize,
        printBackground: true,
        margin: {
          top: '1in',
          right: '1in',
          bottom: '1in',
          left: '1in',
        },
      });

      return Buffer.from(pdfBuffer);
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browser || !this.browser.connected) {
      const executablePath = process.env.CHROME_PATH || (await findChrome());

      this.browser = await puppeteer.launch({
        executablePath,
        headless: true,
        handleSIGINT: false,
        handleSIGTERM: false,
        handleSIGHUP: false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-background-networking',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-breakpad',
          '--disable-client-side-phishing-detection',
          '--disable-component-update',
          '--disable-default-apps',
          '--disable-extensions',
          '--disable-features=site-per-process',
          '--disable-hang-monitor',
          '--disable-ipc-flooding-protection',
          '--disable-popup-blocking',
          '--disable-prompt-on-repost',
          '--disable-renderer-backgrounding',
          '--disable-sync',
          '--disable-translate',
          '--metrics-recording-only',
          '--no-first-run',
          '--safebrowsing-disable-auto-update',
          '--enable-automation',
          '--password-store=basic',
          '--use-mock-keychain',
        ],
      });
    }

    return this.browser;
  }

  async dispose(): Promise<void> {
    if (this.browser) {
      const process = this.browser.process();
      await this.browser.close();

      // Force kill the browser process if it's still running
      if (process && !process.killed) {
        process.kill('SIGKILL');
      }

      this.browser = null;
    }
  }
}

export const pdfTransformer = new PDFTransformer();
