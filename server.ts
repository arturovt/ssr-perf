import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

import bootstrap from './src/main.server';

export async function app() {
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const { Koa, Router, serveStatic, conditional, etag } = await import('./koa');
  const commonEngine = new CommonEngine();
  const app = new Koa();
  const router = new Router();

  router.get(/.*/, async ctx => {
    const { protocol, headers, originalUrl } = ctx;

    const html = await commonEngine.render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: '' }],
    });

    ctx.body = html;
  });

  app.use(conditional());
  app.use(etag());
  app.use(serveStatic(browserDistFolder));
  app.use(router.routes());

  return app;
}

async function run(): Promise<void> {
  const port = +process.env['PORT']! || 4200;

  // Start up the Node server
  const server = await app();

  server.listen(port, () => {
    console.log(`Node Koa server listening on http://localhost:${port}`);
  });
}

run();
