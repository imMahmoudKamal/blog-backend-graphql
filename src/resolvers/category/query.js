export const categoryQuery = {
  category: (_, { id }, { dataSources }) => dataSources.category.getCategory(id),

  categories: (_, __, { dataSources }) => dataSources.category.getAllCategories(),
};
