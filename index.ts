import { App } from './src';
import { ApolloServer } from 'apollo-server-koa';
import { graphqlSchema } from './src/graphql';
import dotenv from 'dotenv';
import Router from 'koa-router';
import koaBody from 'koa-body';


dotenv.config();

const router = new Router();
const server = new ApolloServer({
  schema: graphqlSchema,
  context: (req) => ({
    requestContext: req.ctx,
    headers: req.ctx.headers,
  }),
});

server.start().then(() => {
  router.post('/graphql', server.getMiddleware());
  App.use(koaBody());
  App.use(router.routes());
  console.log(`server listening on port 3000 on`);
  App.listen(process.env.PORT);
});

