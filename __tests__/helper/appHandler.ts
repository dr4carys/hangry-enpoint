import Koa from 'koa';
import router from '../../src/router';

export default function startServer() {
  const app = new Koa();
  app.use(router.allowedMethods());
  app.use(router.routes());

  return app;
}
