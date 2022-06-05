import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { ApolloError } from 'apollo-server-errors';
import { defaultFieldResolver } from 'graphql';

export function isAdminDirectiveTransformer(schema, directiveName) {
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
					if (context.user?.role === 'admin') {
						return await resolve(source, args, context, info);
					} else throw new ApolloError('You are not Admin', 'UNAUTHENTICATED');
				};
				return fieldConfig;
			}
		},
	});
}
