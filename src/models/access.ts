import mongoose, { Schema } from 'mongoose';
// import { composeMongoose } from 'graphql-compose-mongoose';

export interface IAccessModel extends mongoose.Document {
  email: String;
  password: String;
  username: String;
}
export const accessSchema = new Schema(
  {
    userRef: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

accessSchema.index({ _id: 1 });

export const Access = mongoose.model<IAccessModel>('access', accessSchema, 'access', true);
