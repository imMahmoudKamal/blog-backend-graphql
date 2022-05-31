export const userQuery = {
	user(_, arg, context) {
		const id = context.user?.id;
		return context.dataSources.user.getById(id);
	},
	usersByRole(_, { role }, { dataSources: { user } }) {
		return user.getByRole(role);
	},
};
