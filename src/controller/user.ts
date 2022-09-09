import { ParameterizedContext } from 'koa';
import { User } from '../models/user';
import { Access } from '../models/access';
import { JWT_SIGNATURE } from '../config';
import { sign } from 'jsonwebtoken';

const emailChecker = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const createJwtAccessToken = (user: any, access: any) => {
  const jwtPayload = {
    user: { _id: user.email, name: user.username, userRef: user._id, accessRef: access._id },
    iss: 'user@hangry.co',
  };
  const jwtOptions = { expiresIn: '120m' };
  const accessToken = sign(jwtPayload, JWT_SIGNATURE, jwtOptions);

  return accessToken;
};

export const userCreate = async (ctx: ParameterizedContext, next: Function) => {
  const { email, username, password } = ctx.request.body;
  if (!emailChecker.test(email)) {
    ctx.status = 409;
    ctx.body = { payload: 'email not valid' };
    return;
  }
  try {
    await User.create({ email, username, password });
  } catch (e) {
    ctx.status = 409;
    return;
  }
  ctx.body = { body: 'user succesfully creted' };
  return;
};

export const userLogin = async (ctx: ParameterizedContext, next: Function) => {
  const { password, email } = ctx.request.body;
  if (!emailChecker.test(email)) {
    ctx.status = 409;
    ctx.body = { payload: 'email not valid' };
    return;
  }
  const data = await User.findOne({ password, email });
  if (!data) {
    ctx.status = 401;
    return;
  }
  const access = await Access.create({ userRef: data._id, isActive: true });
  const token = createJwtAccessToken(data, access);
  ctx.body = { token };
  return;
};
