export const userQuery = {
	user(_, arg, { error, user, dataSources }) {
		// if there is an error during validation of token [from auth middleware]
		if (error) throw error;
		return dataSources.user.getById(user.id);
	},
	usersByRole(_, { role }, { dataSources: { user } }) {
		return user.getByRole(role);
	},
};
