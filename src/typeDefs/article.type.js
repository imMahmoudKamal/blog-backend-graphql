import { gql } from 'apollo-server';

export const articleTypeDefs = gql`
  type Article {
    id: ID!
    title: String!
    permalink: String!
    imageURL: String!
    imageDescription: String!
    description: String
    content: String
    createdAt: String!
    category: Category!
    user: User!
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

  type ArticlesPagination {
    articles: [Article]!
    paginator: Paginator!
  }

  type ArticlesByCategoryPagination {
    articles: [Article]!
    paginator: Paginator!
  }

  input CreateArticleInput {
    title: String!
    permalink: String!
    imageURL: String!
    imageDescription: String
    description: String
    content: String
    categoryId: ID!
  }

  input UpdateArticleInput {
    title: String
    permalink: String
    imageURL: String
    imageDescription: String
    description: String
    content: String
    categoryId: ID
  }

  extend type Query {
    "Get a single article with article's ID or article's permalink"
    article(id: ID!): Article

    "Get an array of articles (You can pass a page number and limit of items you want)"
    articlesPagination(page: Int, limit: Int): ArticlesPagination!

    "Get most viewed articles (Default limit is 5)"
    mostViewedArticles(limit: Int): [Article]!

    "Get recent articles (Default limit is 5)"
    recentArticles(limit: Int): [Article]!

    "Get an array of articles by category"
    articlesByCategoryPagination(categoryID: ID!, page: Int, limit: Int): ArticlesByCategoryPagination!

    "Get an array of articles by search keyword"
    articlesSearchPagination(keyword: String!, page: Int, limit: Int): ArticlesPagination!
  }

  extend type Mutation {
    "Create a new article"
    createArticle(input: CreateArticleInput!): Article @isAuth

    "Update an existing article with article's ID or article's permalink"
    updateArticle(id: ID!, input: UpdateArticleInput!): Article @isAuth

    "Delete an existing article with article's ID or article's permalink"
    deleteArticle(id: ID!): String @isAdmin
  }
`;
