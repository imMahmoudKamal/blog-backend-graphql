import { ApolloServer } from 'apollo-server';
import { typeDefs } from './typeDefs/index.js';
import { resolvers } from './resolvers/index.js';
import { dataSource } from './datasource/index.js';
import { authorization } from './middleware/auth.js';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { isAuthDirectiveTransformer } from './directives/isAuth.directive.js';
import { isAdminDirectiveTransformer } from './directives/isAdmin.directive.js';
import { isEditorDirectiveTransformer } from './directives/isEditor.directive.js';
import dotenv from 'dotenv';

// .env
dotenv.config();
let schema = makeExecutableSchema({ typeDefs, resolvers });
schema = isAuthDirectiveTransformer(schema, 'isAuth');
schema = isAdminDirectiveTransformer(schema, 'isAdmin');
schema = isEditorDirectiveTransformer(schema, 'isEditor');

export const app = new ApolloServer({
	schema,
	context: ({ req }) => {
		const auth = req.headers.authorization;
		if (auth) return authorization(auth);
	},
	dataSources: () => ({ ...dataSource }),
});
