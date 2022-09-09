import mongoose, { Schema } from 'mongoose';
// import { composeMongoose } from 'graphql-compose-mongoose';

export interface IUserModel extends mongoose.Document {
  email: String;
  password: String;
  username: String;
}
export const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
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

userSchema.index({ _id: 1 });

export const User = mongoose.model<IUserModel>('User_V1', userSchema, 'User_V1', true);
