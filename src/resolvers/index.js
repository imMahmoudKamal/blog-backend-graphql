import { articleQuery } from './article/query.js';
import { articleMutation } from './article/mutation.js';
import { categoryQuery } from './category/query.js';
import { categoryMutation } from './category/mutation.js';

export const resolvers = {
  Article: {
    category: (parent, _, { dataSources }) => dataSources.category.getCategoryByID(parent.categoryId),
  },

  Query: {
    ...articleQuery,
    ...categoryQuery,
  },

  Mutation: {
    ...articleMutation,
    ...categoryMutation,
  },
};
