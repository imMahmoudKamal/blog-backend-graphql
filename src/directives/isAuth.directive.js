import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { ApolloError, AuthenticationError, ForbiddenError } from 'apollo-server-errors';

import { defaultFieldResolver } from 'graphql';
import { User } from '../models/user.model.js';

export function isAuthDirectiveTransformer(schema, directiveName) {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const upperDirective = getDirective(schema, fieldConfig, directiveName)?.[0];

      if (upperDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;

        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source, args, context, info) {
          const token = context.req.headers.authorization?.split(' ')[1];
          if (!token || token === '') return new AuthenticationError('Your request missing token');

          // verify token
          const user = await User.verifyToken(token);
          if (user.expired === true || user.payload === null)
            return new ForbiddenError(`You do not have permissions to access: ${info.fieldName}`);

          // authorized user
          context.user = user.payload;
          return await resolve(source, args, context, info);
        };
        return fieldConfig;
      }
    },
  });
}
