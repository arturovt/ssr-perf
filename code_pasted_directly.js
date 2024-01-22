import { fileURLToPath } from 'url';
import { dirname as dirname2, join as join2, resolve as resolve2 } from 'path';
import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
const etag = __require('etag');
async function app() {
  const serverDistFolder = dirname2(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve2(serverDistFolder, '../browser');
  const indexHtml = join2(serverDistFolder, 'index.server.html');

  const elysia = new Elysia();
  const commonEngine = new CommonEngine();

  elysia.use(
    staticPlugin({
      resolve: () => browserDistFolder,
      alwaysStatic: true,
      indexHTML: false,
      prefix: '/',
      assets: browserDistFolder,
    })
  );

  elysia.get('*', async ctx => {
    const html = await commonEngine.render({
      bootstrap: main_server_default,
      documentFilePath: indexHtml,
      url: ctx.request.url,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: '' }],
    });
    ctx.set.headers['content-type'] = 'text/html; charset=utf-8';
    ctx.set.headers['etag'] = etag(html, { weak: true });
    return html;
  });
  return elysia;
}
async function run() {
  const port = +process.env['PORT'] || 4200;
  const server = await app();
  server.listen(port);
}
run();
