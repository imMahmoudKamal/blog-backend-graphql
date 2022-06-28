import { gql } from 'apollo-server';

export const userTypeDefs = gql`
  enum ROLE {
    admin
    author
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    profilePicture: String
    role: ROLE!
    blocked: Boolean!
    token: String
  }

  input registerInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    profilePicture: String
  }

  input updateUserInput {
    firstName: String
    lastName: String
    email: String
    password: String
    profilePicture: String
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
