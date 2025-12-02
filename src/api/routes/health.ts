import type { FastifyInstance } from 'fastify';

const startTime = Date.now();

export async function healthRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/health', async () => {
    return {
      status: 'healthy',
      version: '1.0.0',
      uptime: Math.floor((Date.now() - startTime) / 1000),
    };
  });

  fastify.get('/formats', async () => {
    return {
      formats: [
        {
          id: 'docx',
          name: 'Microsoft Word',
          extension: '.docx',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          features: ['styles', 'tables', 'lists', 'code-blocks'],
        },
        {
          id: 'pdf',
          name: 'PDF Document',
          extension: '.pdf',
          mimeType: 'application/pdf',
          features: ['syntax-highlight', 'page-size'],
        },
        {
          id: 'html',
          name: 'HTML Document',
          extension: '.html',
          mimeType: 'text/html',
          features: ['syntax-highlight', 'standalone'],
        },
        {
          id: 'txt',
          name: 'Plain Text',
          extension: '.txt',
          mimeType: 'text/plain',
          features: ['ascii-tables'],
        },
      ],
    };
  });
}
