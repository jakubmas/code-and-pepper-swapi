import { GraphQLContext } from '../types/graphql-context';
import { starships } from '../schema';
import { sql } from 'drizzle-orm';
import type { Starship } from '../types/generated';

export const starshipsResolvers = {
  Query: {
    getRandomStarship: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext
    ): Promise<Starship> => {
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
        length: starship.length ? parseFloat(starship.length) : null,
        hyperdriveRating: starship.hyperdriveRating ? parseFloat(starship.hyperdriveRating) : null,
        created: starship.created?.toISOString(),
        edited: starship.edited?.toISOString(),
      };
    },
  },
};
