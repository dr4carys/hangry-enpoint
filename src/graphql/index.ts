import { schemaComposer } from 'graphql-compose';
import { getTODO } from './Todo';

schemaComposer.Query.addFields({
  getTODO,
});

schemaComposer.Mutation.addFields({});

export const graphqlSchema = schemaComposer.buildSchema();

/**
 *  running out of time and energy to finish the API using graphql , but REST should work fine
 */
