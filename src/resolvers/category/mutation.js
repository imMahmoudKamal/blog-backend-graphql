export const categoryMutation = {
  createCategory: (_, { input }, { dataSources }) => dataSources.category.create(input),

  updateCategory: (_, { id, input }, { dataSources }) => dataSources.category.update(id, input),

  deleteCategory: (_, { id }, { dataSources }) => dataSources.category.delete(id),
};
