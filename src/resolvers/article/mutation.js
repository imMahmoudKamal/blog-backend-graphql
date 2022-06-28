export const articleMutation = {
  createArticle: (_, { input }, { dataSources, user }) => dataSources.article.create({ ...input, userId: user.id }),

  updateArticle: (_, { id, input }, { dataSources }) => dataSources.article.update(id, input),

  deleteArticle: (_, { id }, { dataSources }) => dataSources.article.delete(id),
};
