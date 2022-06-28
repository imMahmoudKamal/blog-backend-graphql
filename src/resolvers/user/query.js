export const userQuery = {
	user(_, arg, { user, dataSources }) {
		return dataSources.user.getById(user.id);
	},

  users(_, __, { user, dataSources }) {
    return dataSources.user.getAllUsers(user.id);
  },

	usersByRole(_, { role }, { dataSources: { user } }) {
		return user.getByRole(role);
	},
};
