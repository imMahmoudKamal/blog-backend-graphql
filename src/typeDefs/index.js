import { gql } from 'apollo-server';
import { articleTypeDefs } from './article.type.js';
import { categoryTypeDefs } from './category.type.js';

// for global types
const baseTypeDefs = gql`
  type Query

  type Mutation
`;

export const typeDefs = [baseTypeDefs, articleTypeDefs, categoryTypeDefs];
