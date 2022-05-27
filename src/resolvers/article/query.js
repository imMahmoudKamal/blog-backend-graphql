export const articleQuery = {
  article: (_, { id }, { dataSources }) => dataSources.article.getArticle(id),

  articlesPagination: (_, { page, limit }, { dataSources }) => dataSources.article.getAllArticles(page, limit),

  articlesByCategoryPagination: (_, { categoryID, page, limit }, { dataSources }) =>
    dataSources.article.getAllArticlesByCategory(categoryID, page, limit),

  mostViewedArticles: (_, { limit }, { dataSources }) => dataSources.article.getMostViewed(limit),

  recentArticles: (_, { limit }, { dataSources }) => dataSources.article.getRecent(limit),
};
