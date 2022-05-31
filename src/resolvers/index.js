import { articleQuery } from './article/query.js';
import { articleMutation } from './article/mutation.js';
import { categoryQuery } from './category/query.js';
import { categoryMutation } from './category/mutation.js';
import { userQuery } from './user/query.js';
import { userMutation } from './user/mutation.js';

export const resolvers = {
	Article: {
		category: (parent, _, { dataSources }) =>
			dataSources.category.getCategoryByID(parent.categoryId),

		// attach the User info to Article
		userId: (parent, _, { dataSources }) => dataSources.user.getById(parent.userId),
	},

	Query: {
		...articleQuery,
		...categoryQuery,
		...userQuery,
	},

	Mutation: {
		...articleMutation,
		...categoryMutation,
		...userMutation,
	},
};
