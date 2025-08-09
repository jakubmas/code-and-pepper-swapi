import { peopleResolvers } from './people.resolvers';
import { starshipsResolvers } from './starships.resolvers';
import { battlesResolvers } from './battles.resolvers';

export const resolvers = {
  Query: {
    ...peopleResolvers.Query,
    ...starshipsResolvers.Query,
  },
  Mutation: {
    ...battlesResolvers.Mutation,
  },
};