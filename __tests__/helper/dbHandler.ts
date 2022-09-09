import { MongoMemoryServer } from 'mongodb-memory-server-core';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

export const connect = async () => {
  mongod = new MongoMemoryServer();

  const uri = await mongod.getUri();
  console.log(uri);
  // if (!process.env.IGH_RO_MONGODB_URL) process.env.IGH_RO_MONGODB_URL = uri;
  mongoose.set('debug',true)
  await mongoose.connect(uri);
};

export const disconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (!!mongod) await mongod.stop();
};

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
