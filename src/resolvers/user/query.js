export const userQuery = {
	user(_, arg, { error, user, dataSources }) {
		if (error) throw error;
		return dataSources.user.getById(user.id);
	},
	usersByRole(_, { role }, { dataSources: { user } }) {
		return user.getByRole(role);
	},
};
