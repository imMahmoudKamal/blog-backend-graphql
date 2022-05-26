export const articleQuery = {
  article: (_, { id }, { dataSources }) => dataSources.article.getArticle(id),

  articlesPagination: (_, { page, limit }, { dataSources }) => dataSources.article.getAllArticles(page, limit),

  mostViewedArticles: (_, { limit }, { dataSources }) => dataSources.article.getMostViewed(limit),
};
