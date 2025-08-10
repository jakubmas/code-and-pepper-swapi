import { eq, and, desc, count } from 'drizzle-orm';
import { GraphQLError } from 'graphql';
import { battles } from '../schema/battles';
import type { GraphQLContext } from '../types/graphql-context';

interface SaveBattleResultArgs {
  winner: 'player' | 'computer' | 'draw';
  resourceType: 'people' | 'starships';
  players: Array<{
    id: number;
    name: string;
    value: string;
  }>;
}

interface GetBattleHistoryArgs {
  page?: number;
  limit?: number;
  resourceType?: 'people' | 'starships';
  winner?: 'player' | 'computer' | 'draw';
}

export const battlesResolvers = {
  Query: {
    getBattleHistory: async (_: unknown, args: GetBattleHistoryArgs, context: GraphQLContext) => {
      const { page = 1, limit = 10, resourceType, winner } = args;

      // Validate pagination parameters
      if (page < 1) {
        throw new GraphQLError('Page must be greater than 0');
      }

      if (limit < 1 || limit > 100) {
        throw new GraphQLError('Limit must be between 1 and 100');
      }

      const filters = [];
      if (resourceType) {
        if (!['people', 'starships'].includes(resourceType)) {
          throw new GraphQLError('Invalid resourceType. Must be "people" or "starships"');
        }
        filters.push(eq(battles.resourceType, resourceType));
      }

      if (winner) {
        if (!['player', 'computer', 'draw'].includes(winner)) {
          throw new GraphQLError('Invalid winner. Must be "player", "computer", or "draw"');
        }
        filters.push(eq(battles.winner, winner));
      }

      const whereClause = filters.length > 0 ? and(...filters) : undefined;

      try {
        // Get total count for pagination
        const [{ total }] = await context.db
          .select({ total: count() })
          .from(battles)
          .where(whereClause);

        // Calculate pagination info
        const totalCount = Number(total);
        const totalPages = Math.ceil(totalCount / limit);
        const offset = (page - 1) * limit;

        // Get paginated results
        const results = await context.db
          .select()
          .from(battles)
          .where(whereClause)
          .orderBy(desc(battles.createdAt))
          .limit(limit)
          .offset(offset);

        return {
          items: results.map(result => ({
            id: result.id,
            winner: result.winner,
            resourceType: result.resourceType,
            players: result.players,
            createdAt: result.createdAt.toISOString(),
          })),
          pageInfo: {
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            totalCount,
          },
        };
      } catch (error) {
        console.error('Error fetching battle history:', error);
        throw new GraphQLError('Failed to fetch battle history');
      }
    },

    getBattleStatistics: async (_: unknown, __: unknown, context: GraphQLContext) => {
      try {
        const [{ playerWins }] = await context.db
          .select({ playerWins: count() })
          .from(battles)
          .where(eq(battles.winner, 'player'));

        const [{ computerWins }] = await context.db
          .select({ computerWins: count() })
          .from(battles)
          .where(eq(battles.winner, 'computer'));

        return {
          playerWins: Number(playerWins),
          computerWins: Number(computerWins),
        };
      } catch (error) {
        console.error('Error fetching battle statistics:', error);
        throw new GraphQLError('Failed to fetch battle statistics');
      }
    },
  },
  Mutation: {
    saveBattleResult: async (_: unknown, args: SaveBattleResultArgs, context: GraphQLContext) => {
      const { winner, resourceType, players } = args;

      // Validate input
      if (!['player', 'computer', 'draw'].includes(winner)) {
        throw new GraphQLError('Invalid winner value. Must be "player", "computer", or "draw"');
      }

      if (!['people', 'starships'].includes(resourceType)) {
        throw new GraphQLError('Invalid resourceType. Must be "people" or "starships"');
      }

      if (!players || players.length !== 2) {
        throw new GraphQLError('Players array must contain exactly 2 players');
      }

      for (const player of players) {
        if (!player.id || !player.name || !player.value) {
          throw new GraphQLError('Each player must have id, name, and value');
        }
      }

      try {
        await context.db.insert(battles).values({
          winner,
          resourceType,
          players,
        });

        return {
          success: true,
          message: 'Battle result saved successfully',
        };
      } catch (error) {
        console.error('Error saving battle result:', error);
        throw new GraphQLError('Failed to save battle result');
      }
    },
  },
};
