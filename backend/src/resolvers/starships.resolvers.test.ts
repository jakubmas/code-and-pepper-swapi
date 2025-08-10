import { starshipsResolvers } from './starships.resolvers';
import { GraphQLContext } from '../types/graphql-context';

describe('Starships Resolvers', () => {
  describe('getRandomStarship', () => {
    it('should return different starships on multiple calls', async () => {
      const mockStarships = [
        {
          id: 1,
          name: 'X-wing',
          model: 'T-65 X-wing',
          manufacturer: 'Incom Corporation',
          costInCredits: 149999,
          length: '12.5',
          maxAtmospheringSpeed: 1050,
          crew: 1,
          passengers: 0,
          cargoCapacity: 110,
          consumables: '1 week',
          hyperdriveRating: '1.0',
          MGLT: 100,
          starshipClass: 'Starfighter',
          created: new Date('2024-01-01'),
          edited: new Date('2024-01-01'),
        },
        {
          id: 2,
          name: 'Millennium Falcon',
          model: 'YT-1300 light freighter',
          manufacturer: 'Corellian Engineering Corporation',
          costInCredits: 100000,
          length: '34.37',
          maxAtmospheringSpeed: 1050,
          crew: 4,
          passengers: 6,
          cargoCapacity: 100000,
          consumables: '2 months',
          hyperdriveRating: '0.5',
          MGLT: 75,
          starshipClass: 'Light freighter',
          created: new Date('2024-01-01'),
          edited: new Date('2024-01-01'),
        },
        {
          id: 3,
          name: 'Death Star',
          model: 'DS-1 Orbital Battle Station',
          manufacturer: 'Imperial Department of Military Research',
          costInCredits: 1000000000000,
          length: '120000',
          maxAtmospheringSpeed: null,
          crew: 342953,
          passengers: 843342,
          cargoCapacity: 1000000000000,
          consumables: '3 years',
          hyperdriveRating: '4.0',
          MGLT: 10,
          starshipClass: 'Deep Space Mobile Battlestation',
          created: new Date('2024-01-01'),
          edited: new Date('2024-01-01'),
        },
      ];

      const mockDb = {
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest
          .fn()
          .mockResolvedValueOnce([mockStarships[0]])
          .mockResolvedValueOnce([mockStarships[1]])
          .mockResolvedValueOnce([mockStarships[2]]),
      };

      const mockContext: GraphQLContext = {
        db: mockDb as any,
      };

      // Call the resolver multiple times
      const results = await Promise.all([
        starshipsResolvers.Query.getRandomStarship(undefined, undefined, mockContext),
        starshipsResolvers.Query.getRandomStarship(undefined, undefined, mockContext),
        starshipsResolvers.Query.getRandomStarship(undefined, undefined, mockContext),
      ]);

      // Check we got different starships
      const names = results.map(r => r.name);
      expect(names).toContain('X-wing');
      expect(names).toContain('Millennium Falcon');
      expect(names).toContain('Death Star');

      expect(mockDb.limit).toHaveBeenCalledTimes(3);
    });

    it('should throw error when no starships found', async () => {
      const mockContext: GraphQLContext = {
        db: {
          select: jest.fn().mockReturnThis(),
          from: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue([]),
        } as any,
      };

      await expect(
        starshipsResolvers.Query.getRandomStarship(undefined, undefined, mockContext)
      ).rejects.toThrow('No starships found in database');
    });
  });
});
