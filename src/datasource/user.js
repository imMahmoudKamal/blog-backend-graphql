import { DataSource } from 'apollo-datasource';
import { ApolloError } from 'apollo-server-errors';
import { User } from '../models/user.model.js';
import Dataloader from 'Dataloader';

export class userDataSource extends DataSource {
	initialize(config) {
		this.context = config.context;

		this.userLoader = new Dataloader(async (ids) => {
			const users = await User.find({ _id: { $in: ids } });
			const userMap = users.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});
			return ids.map((id) => userMap[id]);
		});
	}
	async register(input) {
		try {
			// check if an old user exsists with this email
			const isEmailExists = await User.findOne({ email: input.email });
			if (isEmailExists)
				throw new ApolloError(
					`the user is aleady registered with this email: ${input.email}`,
					'USER_ALREADY_EXISTS',
				);

			// create new user
			const createdUser = await new User(input);

			// create token for a created user
			const token = await createdUser.generateToken();

			// add token to created user
			createdUser.token = token;

			// return the saved user
			return await createdUser.save();
		} catch (error) {
			return error;
		}
	}
	async login(input) {
		try {
			const user = await User.findOne({ email: input.email });
			if (!user) throw new ApolloError('Wrong email or password', 'UNAUTHORIZED');

			const isBlocked = user.blocked;
			if (isBlocked)
				throw new ApolloError('sorry you are blocked from login', 'UNAUTHORIZED');

			const isMatch = await user.checkPassword(input.password);
			if (!isMatch) throw new ApolloError('Wrong email or password', 'UNAUTHORIZED');

			const token = await user.generateToken();
			user.token;

			return user;
		} catch (error) {
			return error;
		}
	}

	async getById(id) {
		return await this.userLoader.load(id);
	}
	async update(id, input) {
		return await User.findOneAndUpdate({ _id: id }, { $set: { ...input } }, { new: true });
	}

	async getByRole(role) {
		return await User.find({ role: role });
	}

	async updateRole(id, role) {
		return await User.findOneAndUpdate({ _id: id }, { $set: { role: role } }, { new: true });
	}

	async updateBlockStatus(id, isBlocked) {
		return await User.findOneAndUpdate(
			{ _id: id },
			{ $set: { blocked: isBlocked } },
			{ new: true },
		);
	}
}
