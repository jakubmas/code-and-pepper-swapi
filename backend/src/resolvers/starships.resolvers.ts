import { GraphQLContext } from '../types/graphql-context';
import { starships } from '../schema';
import { sql } from 'drizzle-orm';

export const starshipsResolvers = {
  Query: {
    getRandomStarship: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      const result = await context.db
        .select()
        .from(starships)
        .orderBy(sql`RANDOM()`)
        .limit(1);

      if (result.length === 0) {
        throw new Error('No starships found in database');
      }

      const starship = result[0];
      return {
        ...starship,
        id: starship.id.toString(),
        created: starship.created?.toISOString(),
        edited: starship.edited?.toISOString(),
      };
    },
  },
};
