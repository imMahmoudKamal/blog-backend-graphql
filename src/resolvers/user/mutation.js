export const userMutation = {
	registerUser(_, { input }, { dataSources: { user } }) {
		return user.register(input);
	},

	loginUser(_, { input }, { dataSources: { user } }) {
		return user.login(input);
	},

	updateUser(_, { input }, { user, dataSources }) {
		return dataSources.user.update(user.id, input);
	},

	updateUserRole(_, { id, role }, { dataSources: { user } }) {
		return user.updateRole(id, role);
	},

	updateUserBlockStatus(_, { id, isBlocked }, { dataSources: { user } }) {
		return user.updateBlockStatus(id, isBlocked);
	},
};
