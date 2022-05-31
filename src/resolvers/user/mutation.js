export const userMutation = {
	registerUser(_, { input }, { dataSources: { user } }) {
		return user.register(input);
	},

	loginUser(_, { input }, { dataSources: { user } }) {
		return user.login(input);
	},

	updateUser(_, { input }, context) {
		const id = context.user?.id;
		return context.dataSources.user.update(id, input);
	},

	updateUserRole(_, { id, role }, { dataSources: { user } }) {
		return user.updateRole(id, role);
	},

	updateUserBlockStatus(_, { id, isBlocked }, { dataSources: { user } }) {
		return user.updateBlockStatus(id, isBlocked);
	},
};
