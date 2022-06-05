import { gql } from 'apollo-server';

export const categoryTypeDefs = gql`
	type Category {
		id: ID!
		title: String!
		permalink: String!
		description: String
	}

	input CategoryInput {
		title: String!
		permalink: String!
		description: String
	}
	input UpdateCategoryInput {
		title: String
		permalink: String
		description: String
	}

	extend type Query {
		"Get a single category with category's ID or category's permalink"
		category(id: ID): Category

		"Get an array of all categories"
		categories: [Category]!
	}

	extend type Mutation {
		"Create a new category"
		createCategory(input: CategoryInput!): Category @isAdmin

		"Update an existing category with category's ID or category's permalink"
		updateCategory(id: ID!, input: UpdateCategoryInput!): Category @isAdmin

		"Delete an existing category with category's ID or category's permalink"
		deleteCategory(id: ID!): String @isAdmin
	}
`;
