import { ParameterizedContext } from 'koa';
import { Todo } from '../models/todo';

export const createTodo = async (ctx: ParameterizedContext, next: Function) => {
  const { nameTodo, detailTodo, assignedUserRef } = ctx.request.body;
  const { userRef } = ctx._auth.user;

  try {
    await Todo.create({ nameTodo, detailTodo, assigned: assignedUserRef, creator: userRef });
  } catch (e) {
    console.log(e);
    ctx.status = 409;
    return;
  }
  ctx.body = { payload: 'succesfully create todo' };
  return;
};

export const getTodo = async (ctx: ParameterizedContext, next: Function) => {
  const { limit, sort, cursor, assigned } = ctx._pagingRequest;
  const query = cursor
    ? {
        createdAt: sort === 'DESC' ? { $lt: new Date(cursor * 1000) } : { $gt: new Date(cursor * 1000) },
        assigned,
        isRemoved: false,
      }
    : {};
  const todoData = await Todo.find(query)
    .sort(sort === 'DESC' ? { createdAt: -1 } : { createdAt: 1 })
    .limit(parseInt(limit) + 1);
  ctx.body = { payload: todoData };
  return next();
};

export const updatedTodo = async (ctx: ParameterizedContext, next: Function) => {
  const { id, status } = ctx.request.query;
  const { userRef } = ctx._auth.user;
  const todoData = await Todo.findOneAndUpdate({ _id: id, creator: userRef }, { isDone: status ? true : false });
  if (!todoData) {
    ctx.status = 409;
    ctx.body = { payload: 'failed because not authroized' };
    return;
  }
  ctx.body = { payload: 'succesfully updated todo' };
  return;
};

export const deleteTodo = async (ctx: ParameterizedContext, next: Function) => {
  const { id } = ctx.request.query;
  const { userRef } = ctx._auth.user;
  const todoData = await Todo.findOneAndUpdate({ _id: id, creator: userRef }, { isRemoved: true });
  if (!todoData) {
    ctx.status = 409;
    ctx.body = { payload: 'failed because not authroized' };
    return;
  }
  ctx.body = { payload: 'succesfully deleted todo' };
  return;
};
