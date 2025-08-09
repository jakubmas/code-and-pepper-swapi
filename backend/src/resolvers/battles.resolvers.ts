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

export const battlesResolvers = {
  Mutation: {
    saveBattleResult: async (
      _: unknown,
      args: SaveBattleResultArgs,
      context: GraphQLContext
    ) => {
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
        await context.db
          .insert(battles)
          .values({
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