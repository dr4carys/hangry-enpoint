import { Todo } from '../models/todo';
import { composeMongoose } from 'graphql-compose-mongoose';

const TodoTC = composeMongoose(Todo);
export const getTODO = TodoTC.mongooseResolvers
  .connection({ defaultLimit: 3 })
  .addSortArg({
    name: '_createdAt_ASC',
    value: {
      AvailableRoom: 1,
    },
  })
  .addSortArg({
    name: '_createdAt_DESC',
    value: {
      AvailableRoom: -1,
    },
  });
