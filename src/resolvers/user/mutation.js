export const userMutation = {
	registerUser(_, { input }, { dataSources: { user } }) {
		return user.register(input);
	},

	loginUser(_, { input }, { dataSources: { user } }) {
		return user.login(input);
	},

	// update user by his token // if there iw any error in auth middleware throw i5
	updateUser(_, { input }, { error, user, dataSources }) {
		if (error) throw error;
		return dataSources.user.update(user.id, input);
	},

	updateUserRole(_, { id, role }, { dataSources: { user } }) {
		return user.updateRole(id, role);
	},

	updateUserBlockStatus(_, { id, isBlocked }, { dataSources: { user } }) {
		return user.updateBlockStatus(id, isBlocked);
	},
};
