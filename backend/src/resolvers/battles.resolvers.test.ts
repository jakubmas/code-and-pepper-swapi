import { battlesResolvers } from './battles.resolvers';
import { GraphQLError } from 'graphql';

describe('Battles Resolvers', () => {
  describe('Query', () => {
    describe('getBattleHistory', () => {
      let mockDb: any;
      let mockContext: any;

      beforeEach(() => {
        mockDb = {
          select: jest.fn().mockReturnThis(),
          from: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          offset: jest.fn().mockResolvedValue([]),
        };

        mockContext = {
          db: mockDb,
        };
      });

      it('should return paginated battle history', async () => {
        const mockBattles = [
          {
            id: 1,
            winner: 'player',
            resourceType: 'people',
            players: [
              { id: 1, name: 'Luke', value: '77 kg' },
              { id: 2, name: 'Vader', value: '136 kg' }
            ],
            createdAt: new Date('2024-01-01T00:00:00Z'),
          },
        ];

        // Mock count query
        mockDb.select.mockImplementationOnce(() => ({
          from: jest.fn().mockReturnThis(),
          where: jest.fn().mockResolvedValue([{ total: 1 }]),
        }));

        // Mock data query  
        mockDb.offset.mockResolvedValue(mockBattles);

        const args = { page: 1, limit: 10 };
        const result = await battlesResolvers.Query.getBattleHistory(
          undefined,
          args,
          mockContext
        );

        expect(result).toEqual({
          items: [{
            id: 1,
            winner: 'player',
            resourceType: 'people',
            players: mockBattles[0].players,
            createdAt: '2024-01-01T00:00:00.000Z',
          }],
          pageInfo: {
            currentPage: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
            totalCount: 1,
          },
        });
      });

      it('should apply resourceType filter', async () => {
        // Mock count query
        mockDb.select.mockImplementationOnce(() => ({
          from: jest.fn().mockReturnThis(),
          where: jest.fn().mockResolvedValue([{ total: 0 }]),
        }));

        const args = { page: 1, limit: 10, resourceType: 'starships' as const };
        await battlesResolvers.Query.getBattleHistory(undefined, args, mockContext);

        expect(mockDb.where).toHaveBeenCalled();
      });

      it('should apply winner filter', async () => {
        // Mock count query
        mockDb.select.mockImplementationOnce(() => ({
          from: jest.fn().mockReturnThis(),
          where: jest.fn().mockResolvedValue([{ total: 0 }]),
        }));

        const args = { page: 1, limit: 10, winner: 'computer' as const };
        await battlesResolvers.Query.getBattleHistory(undefined, args, mockContext);

        expect(mockDb.where).toHaveBeenCalled();
      });

      it('should throw error for invalid page', async () => {
        const args = { page: 0, limit: 10 };
        await expect(
          battlesResolvers.Query.getBattleHistory(undefined, args, mockContext)
        ).rejects.toThrow('Page must be greater than 0');
      });

      it('should throw error for invalid limit', async () => {
        const args = { page: 1, limit: 101 };
        await expect(
          battlesResolvers.Query.getBattleHistory(undefined, args, mockContext)
        ).rejects.toThrow('Limit must be between 1 and 100');
      });

      it('should throw error for invalid resourceType', async () => {
        const args = { page: 1, limit: 10, resourceType: 'invalid' as any };
        await expect(
          battlesResolvers.Query.getBattleHistory(undefined, args, mockContext)
        ).rejects.toThrow('Invalid resourceType. Must be "people" or "starships"');
      });

      it('should throw error for invalid winner', async () => {
        const args = { page: 1, limit: 10, winner: 'invalid' as any };
        await expect(
          battlesResolvers.Query.getBattleHistory(undefined, args, mockContext)
        ).rejects.toThrow('Invalid winner. Must be "player", "computer", or "draw"');
      });

      it('should handle database errors gracefully', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        
        mockDb.select.mockImplementationOnce(() => {
          throw new Error('Database error');
        });

        const args = { page: 1, limit: 10 };
        await expect(
          battlesResolvers.Query.getBattleHistory(undefined, args, mockContext)
        ).rejects.toThrow('Failed to fetch battle history');

        expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching battle history:', expect.any(Error));
        consoleErrorSpy.mockRestore();
      });
    });
  });

  describe('Mutation', () => {
    describe('saveBattleResult', () => {
      let mockDb: any;
      let mockContext: any;

      beforeEach(() => {
        mockDb = {
          insert: jest.fn().mockReturnThis(),
          values: jest.fn().mockResolvedValue(undefined),
        };

        mockContext = {
          db: {
            insert: jest.fn(() => mockDb),
          },
        };
      });

      it('should save a valid battle result', async () => {
        const args = {
          winner: 'player' as const,
          resourceType: 'people' as const,
          players: [
            { id: 1, name: 'Luke Skywalker', value: '77 kg' },
            { id: 2, name: 'Darth Vader', value: '136 kg' },
          ],
        };

        const result = await battlesResolvers.Mutation.saveBattleResult(
          undefined,
          args,
          mockContext
        );

        expect(mockContext.db.insert).toHaveBeenCalledWith(expect.anything());
        expect(mockDb.values).toHaveBeenCalledWith({
          winner: 'player',
          resourceType: 'people',
          players: args.players,
        });
        expect(result).toEqual({
          success: true,
          message: 'Battle result saved successfully',
        });
      });

      it('should accept computer as winner', async () => {
        const args = {
          winner: 'computer' as const,
          resourceType: 'starships' as const,
          players: [
            { id: 1, name: 'X-Wing', value: '4 crew members' },
            { id: 2, name: 'TIE Fighter', value: '1 crew members' },
          ],
        };

        const result = await battlesResolvers.Mutation.saveBattleResult(
          undefined,
          args,
          mockContext
        );

        expect(result).toEqual({
          success: true,
          message: 'Battle result saved successfully',
        });
      });

      it('should accept draw as winner', async () => {
        const args = {
          winner: 'draw' as const,
          resourceType: 'people' as const,
          players: [
            { id: 1, name: 'Han Solo', value: '80 kg' },
            { id: 2, name: 'Leia Organa', value: '80 kg' },
          ],
        };

        const result = await battlesResolvers.Mutation.saveBattleResult(
          undefined,
          args,
          mockContext
        );

        expect(result).toEqual({
          success: true,
          message: 'Battle result saved successfully',
        });
      });

      it('should throw error for invalid winner value', async () => {
        const args = {
          winner: 'invalid' as any,
          resourceType: 'people' as const,
          players: [
            { id: 1, name: 'Luke', value: '77 kg' },
            { id: 2, name: 'Vader', value: '136 kg' },
          ],
        };

        await expect(
          battlesResolvers.Mutation.saveBattleResult(undefined, args, mockContext)
        ).rejects.toThrow(GraphQLError);

        await expect(
          battlesResolvers.Mutation.saveBattleResult(undefined, args, mockContext)
        ).rejects.toThrow('Invalid winner value. Must be "player", "computer", or "draw"');
      });

      it('should throw error for invalid resourceType', async () => {
        const args = {
          winner: 'player' as const,
          resourceType: 'invalid' as any,
          players: [
            { id: 1, name: 'Luke', value: '77 kg' },
            { id: 2, name: 'Vader', value: '136 kg' },
          ],
        };

        await expect(
          battlesResolvers.Mutation.saveBattleResult(undefined, args, mockContext)
        ).rejects.toThrow(GraphQLError);

        await expect(
          battlesResolvers.Mutation.saveBattleResult(undefined, args, mockContext)
        ).rejects.toThrow('Invalid resourceType. Must be "people" or "starships"');
      });

      it('should throw error if players array does not have exactly 2 players', async () => {
        const args = {
          winner: 'player' as const,
          resourceType: 'people' as const,
          players: [{ id: 1, name: 'Luke', value: '77 kg' }],
        };

        await expect(
          battlesResolvers.Mutation.saveBattleResult(undefined, args, mockContext)
        ).rejects.toThrow('Players array must contain exactly 2 players');

        const args3Players = {
          winner: 'player' as const,
          resourceType: 'people' as const,
          players: [
            { id: 1, name: 'Luke', value: '77 kg' },
            { id: 2, name: 'Vader', value: '136 kg' },
            { id: 3, name: 'Yoda', value: '17 kg' },
          ],
        };

        await expect(
          battlesResolvers.Mutation.saveBattleResult(undefined, args3Players, mockContext)
        ).rejects.toThrow('Players array must contain exactly 2 players');
      });

      it('should throw error if player is missing required fields', async () => {
        const argsMissingName = {
          winner: 'player' as const,
          resourceType: 'people' as const,
          players: [
            { id: 1, name: '', value: '77 kg' },
            { id: 2, name: 'Vader', value: '136 kg' },
          ],
        };

        await expect(
          battlesResolvers.Mutation.saveBattleResult(undefined, argsMissingName, mockContext)
        ).rejects.toThrow('Each player must have id, name, and value');

        const argsMissingValue = {
          winner: 'player' as const,
          resourceType: 'people' as const,
          players: [
            { id: 1, name: 'Luke', value: '' },
            { id: 2, name: 'Vader', value: '136 kg' },
          ],
        };

        await expect(
          battlesResolvers.Mutation.saveBattleResult(undefined, argsMissingValue, mockContext)
        ).rejects.toThrow('Each player must have id, name, and value');
      });

      it('should handle database errors gracefully', async () => {
        // Mock console.error to suppress expected error output
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // Override the default mock to simulate an error
        mockDb.values.mockRejectedValue(new Error('Database error'));

        const args = {
          winner: 'player' as const,
          resourceType: 'people' as const,
          players: [
            { id: 1, name: 'Luke', value: '77 kg' },
            { id: 2, name: 'Vader', value: '136 kg' },
          ],
        };

        await expect(
          battlesResolvers.Mutation.saveBattleResult(undefined, args, mockContext)
        ).rejects.toThrow('Failed to save battle result');

        // Verify console.error was called and restore it
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error saving battle result:', expect.any(Error));
        consoleErrorSpy.mockRestore();
      });
    });
  });
});