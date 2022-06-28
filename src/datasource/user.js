import { DataSource } from 'apollo-datasource';
import { ApolloError, AuthenticationError } from 'apollo-server-errors';
import { User } from '../models/user.model.js';
import Dataloader from '../../node_modules/dataloader/index.js';
import { isPasswordSecure, isEmailValid } from '../middleware/checkRequired.js';

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
        return new ApolloError(`The user is aleady registered with this email: ${input.email}`, 'BAD_USER_INPUT');

      // check if the password secure or not
      const isSecure = isPasswordSecure(input.password);
      if (!isSecure)
        return new ApolloError(
          `The password must contain at least one number, one special(!@#$%^&*), lowercase, uppercase character and eight characters or longer`,
          'GRAPHQL_VALIDATION_FAILED'
        );

      // check if the email valid or not
      const isValid = isEmailValid(input.email);
      if (!isValid) return new ApolloError(`The email is invalid email: ${input.email}`, 'GRAPHQL_VALIDATION_FAILED');

      // create new user
      const createdUser = await new User(input);

      // save new created user
      const user = await createdUser.save();

      // create token for a created user
      const token = await createdUser.generateToken();

      // attach tokent to user object
      user.token = token;

      return user;
    } catch (error) {
      return error;
    }
  }

  async login(input) {
    try {
      // check if there is a user with this inputted email
      const user = await User.findOne({ email: input.email });
      if (!user) return new AuthenticationError('Wrong email or password');

      // check if the inputted password match the user password in the DB
      const isMatch = await user.checkPassword(input.password);
      if (!isMatch) return new AuthenticationError('Wrong email or password');

      // check if the user is blocked or not
      const isBlocked = user.blocked;
      if (isBlocked) return new AuthenticationError('sorry you are blocked from login');

      // generate a new token for user
      const token = await user.generateToken();

      // attach the token to user object
      user.token = token;

      return user;
    } catch (error) {
      return error;
    }
  }

  async getById(id) {
    return await this.userLoader.load(id);
  }

  async getAllUsers(id) {
    try {
      const allUsers = await User.find({ _id: { $ne: id } });
      if (!allUsers) throw new ApolloError('Internal Server Error Please try again later!', 'INTERNAL_SERVER_ERROR');

      return allUsers;
    } catch (error) {
      return error;
    }
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
    return await User.findOneAndUpdate({ _id: id }, { $set: { blocked: isBlocked } }, { new: true });
  }
}
