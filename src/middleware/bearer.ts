import { decode, Jwt, verify } from 'jsonwebtoken';
import { ParameterizedContext } from 'koa';
import {
  JWT_SIGNATURE,
  //  EXCLUDE_AUTH_GRAPHQL
} from '../config';
// import { OperationDefinitionNode, parse } from 'graphql';
import { Access } from '../models/access';

export const authentication =
  (errStatus: number = 401) =>
  async (ctx: ParameterizedContext, next: Function) => {
    // bypass auth request for adminUserVerifyGoogleSignin
    // try {
    //   if (req.body.query) {
    //     const {
    //       definitions: [firstNode],
    //     } = parse(req.body?.query, { noLocation: true });
    //     const {
    //       selectionSet: { selections },
    //     } = firstNode as OperationDefinitionNode;
    //     if (
    //       selections.length === 1 &&
    //       'name' in selections[0] &&
    //       EXCLUDE_AUTH_GRAPHQL.includes(selections[0].name.value)
    //     ) {
    //       await next();
    //       return;
    //     }
    //   }
    // } catch (e) {
    //   console.log('Error checking graphql request : ', e);
    // }
    let token;
    if (ctx.header && ctx.header['authorization']) {
      const parts = ctx.header['authorization'].split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
        if (!token) {
          ctx.status = errStatus;
          return;
        }
      }
    }
    try {
      const {
        header: { alg },
        payload: { iss },
      } = <Jwt>decode(token, { complete: true });

      if (alg !== 'HS256') {
        console.log('wrong alg', iss);
        ctx.status = errStatus;
        return;
      }

      if (iss === 'user@hangry.co') {
        const { user } = <{ user: { _id: string; name: string; userRef: string; accessRef: string } }>(
          verify(token, JWT_SIGNATURE)
        );
        const access = await Access.findOne({ _id: user.accessRef, userRef: user.userRef, isActive: true });
        if (!access) {
          ctx.status = errStatus;
          return;
        }
        ctx._auth = { user };
        await next();
      } else {
        ctx.status = errStatus;
        return;
      }
    } catch (err) {
      console.log('authentication >>> ', err);
      ctx.status = errStatus;
      return;
    }
  };
