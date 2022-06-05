import { gql } from 'apollo-server';
import { articleTypeDefs } from './article.type.js';
import { categoryTypeDefs } from './category.type.js';
import { userTypeDefs } from './user.type.js';

// for global types
const baseTypeDefs = gql`
	directive @isAuth on FIELD_DEFINITION
	directive @isAdmin on FIELD_DEFINITION
	type Query

	type Mutation
`;

export const typeDefs = [baseTypeDefs, articleTypeDefs, categoryTypeDefs, userTypeDefs];
