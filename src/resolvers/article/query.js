export const articleQuery = {
  article: (_, { id }, { dataSources }) => dataSources.article.getArticle(id),

  articles: (_, __, { dataSources }) => dataSources.article.getAllArticles(),
};
