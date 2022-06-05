import { gql } from 'apollo-server';

export const userTypeDefs = gql`
	enum ROLE {
		admin
		author
	}

	type User {
		token: String
		id: ID
		fristName: String
		lastName: String
		email: String
		role: ROLE
		blocked: Boolean
	}

	input registerInput {
		fristName: String!
		lastName: String!
		email: String!
		password: String!
	}

	input updateUserInput {
		fristName: String
		lastName: String
		email: String
		password: String
	}

	input loginInput {
		email: String!
		password: String!
	}

	extend type Query {
		# get user's data by token
		user: User @isAuth

		# admin can get users by them roles
		usersByRole(role: ROLE!): [User] @isAdmin
	}

	extend type Mutation {
		# register
		registerUser(input: registerInput!): User

		# login
		loginUser(input: loginInput!): User

		# each user can update his own data by token
		updateUser(input: updateUserInput!): User @isAuth

		# admin can update user's role by id  and return the updated user
		updateUserRole(id: ID!, role: ROLE!): User @isAdmin

		# admin can block or unblock a user by id and return block status
		updateUserBlockStatus(id: ID!, isBlocked: Boolean!): User @isAdmin
	}
`;
