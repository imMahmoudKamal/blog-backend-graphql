export const userQuery = {
	user(_, arg, { user, dataSources }) {
		return dataSources.user.getById(user.id);
	},

	usersByRole(_, { role }, { dataSources: { user } }) {
		return user.getByRole(role);
	},
};
