import { peopleResolvers } from './people.resolvers';
import { GraphQLContext } from '../types/graphql-context';

describe('People Resolvers', () => {
  describe('getRandomPerson', () => {
    it('should return different people on multiple calls', async () => {
      const mockPeople = [
        {
          id: 1,
          name: 'Luke Skywalker',
          mass: 77,
          height: 172,
          hairColor: 'blond',
          skinColor: 'fair',
          eyeColor: 'blue',
          birthYear: '19BBY',
          gender: 'male',
          created: new Date('2024-01-01'),
          edited: new Date('2024-01-01'),
        },
        {
          id: 2,
          name: 'Darth Vader',
          mass: 136,
          height: 202,
          hairColor: 'none',
          skinColor: 'white',
          eyeColor: 'yellow',
          birthYear: '41.9BBY',
          gender: 'male',
          created: new Date('2024-01-01'),
          edited: new Date('2024-01-01'),
        },
        {
          id: 3,
          name: 'Leia Organa',
          mass: 49,
          height: 150,
          hairColor: 'brown',
          skinColor: 'light',
          eyeColor: 'brown',
          birthYear: '19BBY',
          gender: 'female',
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
          .mockResolvedValueOnce([mockPeople[0]])
          .mockResolvedValueOnce([mockPeople[1]])
          .mockResolvedValueOnce([mockPeople[2]]),
      };

      const mockContext: GraphQLContext = {
        db: mockDb as any,
      };

      // Call the resolver multiple times
      const results = await Promise.all([
        peopleResolvers.Query.getRandomPerson(undefined, undefined, mockContext),
        peopleResolvers.Query.getRandomPerson(undefined, undefined, mockContext),
        peopleResolvers.Query.getRandomPerson(undefined, undefined, mockContext),
      ]);

      // Check we got different people
      const names = results.map(r => r.name);
      expect(names).toContain('Luke Skywalker');
      expect(names).toContain('Darth Vader');
      expect(names).toContain('Leia Organa');

      expect(mockDb.limit).toHaveBeenCalledTimes(3);
    });

    it('should throw error when no people found', async () => {
      const mockContext: GraphQLContext = {
        db: {
          select: jest.fn().mockReturnThis(),
          from: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue([]),
        } as any,
      };

      await expect(
        peopleResolvers.Query.getRandomPerson(undefined, undefined, mockContext)
      ).rejects.toThrow('No people found in database');
    });
  });
});
