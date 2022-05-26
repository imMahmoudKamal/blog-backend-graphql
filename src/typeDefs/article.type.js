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

  type Paginator {
    totalArticles: Int
    limit: Int
    totalPages: Int
    currentPage: Int
    pagingCounter: Int
    hasPrevPage: Boolean
    hasNextPage: Boolean
    prev: Int
    next: Int
  }

  type ArticlePagination {
    articles: [Article]!
    paginator: Paginator!
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
    "Get a single article with article's ID or article's permalink"
    article(id: ID!): Article

    "Get an array of articles (You can pass a page number and limit of items you want)"
    articlesPagination(page: Int, limit: Int): ArticlePagination!
  }

  extend type Mutation {
    "Create a new article"
    createArticle(input: CreateArticleInput!): Article

    "Update an existing article"
    updateArticle(id: ID!, input: UpdateArticleInput!): Article

    "Delete an existing article"
    deleteArticle(id: ID!): String
  }
`;
