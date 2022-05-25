import { articleQuery } from './article/query.js';
import { articleMutation } from './article/mutation.js';

export const resolvers = {
  Query: {
    ...articleQuery,
  },

  Mutation: {
    ...articleMutation,
  },
};
