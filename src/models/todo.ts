import mongoose, { Schema } from 'mongoose';

export interface ITodoModel extends mongoose.Document {
  nameTodo: String;
  detailTodo: String;
  assigned: String;
  creator: String;
  status: Boolean;
  isRemoved: Boolean;
}
export const todoSchema = new Schema(
  {
    nameTodo: {
      type: String,
      required: true,
    },
    detailTodo: {
      type: String,
      required: true,
    },
    assigned: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    isDone: {
      type: Boolean,
      required: true,
      default: false,
    },
    isRemoved: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

todoSchema.index({ _id: 1, updatedAt: 1 });

export const Todo = mongoose.model<ITodoModel>('Todo', todoSchema, 'Todo', true);
