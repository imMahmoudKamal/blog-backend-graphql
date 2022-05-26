export const articleQuery = {
  article: (_, { id }, { dataSources }) => dataSources.article.getArticle(id),

  articlesPagination: (_, { page, limit }, { dataSources }) => dataSources.article.getAllArticles(page, limit),
};
