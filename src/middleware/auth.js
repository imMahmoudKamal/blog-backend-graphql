import { ApolloError, AuthenticationError } from 'apollo-server-errors';
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const authorization = async (auth) => {
	try {
		// get the user token from the headers
		const [_, token] = auth.split(' ');
		if (!token) throw new Error('Authorization token must be "Bearer [token]"');

		// // check if the validation of token
		const user = await User.getToken(token);
		if (!user) throw new AuthenticationError('Invalid or expired token');

		// add the user to the context
		return { user };
	} catch (error) {
		return { error };
	}
};
