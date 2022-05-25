export const articleMutation = {
  createArticle: (_, { input }, { dataSources }) => dataSources.article.create(input),

  updateArticle: (_, { id, input }, { dataSources }) => dataSources.article.update(id, input),

  deleteArticle: (_, { id }, { dataSources }) => dataSources.article.delete(id),
};
