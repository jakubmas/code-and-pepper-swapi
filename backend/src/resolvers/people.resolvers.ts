import { GraphQLContext } from '../types/graphql-context';
import { people } from '../schema';
import { sql } from 'drizzle-orm';
import type { Person } from '../types/generated';

export const peopleResolvers = {
  Query: {
    getRandomPerson: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext
    ): Promise<Person> => {
      const result = await context.db
        .select()
        .from(people)
        .orderBy(sql`RANDOM()`)
        .limit(1);

      if (result.length === 0) {
        throw new Error('No people found in database');
      }

      const person = result[0];
      return {
        ...person,
        created: person.created?.toISOString(),
        edited: person.edited?.toISOString(),
      };
    },
  },
};
