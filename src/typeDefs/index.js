import { gql } from 'apollo-server';
import { ArticleTypeDefs } from './article.type.js';

// for global types
const baseTypeDefs = gql`
  type Query

  type Mutation
`;

export const typeDefs = [baseTypeDefs, ArticleTypeDefs];
