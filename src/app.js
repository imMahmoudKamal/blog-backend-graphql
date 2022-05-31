import { ApolloServer } from 'apollo-server';
import { typeDefs } from './typeDefs/index.js';
import { resolvers } from './resolvers/index.js';
import { dataSource } from './datasource/index.js';
import { authorization } from './middleware/auth.js';
import dotenv from 'dotenv';

// .env
dotenv.config();

export const app = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => {
		const auth = req.headers.authorization;
		if (auth) return authorization(auth);
	},
	dataSources: () => ({ ...dataSource }),
});
