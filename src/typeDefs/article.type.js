import { gql } from 'apollo-server';

export const ArticleTypeDefs = gql`
  type Article {
    id: ID
    title: String!
    permalink: String!
    imageURL: String!
    content: String
    categoryId: ID!
    userId: ID!
  }

  input CreateArticleInput {
    title: String!
    permalink: String!
    imageURL: String!
    content: String
    categoryId: ID!
    userId: ID!
  }

  input UpdateArticleInput {
    title: String!
    permalink: String!
    imageURL: String!
    content: String
  }

  extend type Query {
    article(id: ID!): Article

    articles: [Article]
  }

  extend type Mutation {
    createArticle(input: CreateArticleInput!): Article

    updateArticle(id: ID!, input: UpdateArticleInput!): Article

    deleteArticle(id: ID!): String
  }
`;
