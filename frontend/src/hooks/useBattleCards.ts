import { useQueries } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { graphqlClient } from '@/config/graphql-client';
import { GET_RANDOM_PERSON, GET_RANDOM_STARSHIP } from '@/graphql/queries';
import type { Person, Starship } from '@/generated/graphql';
// Query keys factory
const gameQueryKeys = {
  all: ['game'] as const,
  randomPerson: () => [...gameQueryKeys.all, 'randomPerson'] as const,
  randomStarship: () => [...gameQueryKeys.all, 'randomStarship'] as const,
};

interface UseBattleCardsResult {
  leftCard: UseQueryResult<Person | Starship | null, Error>;
  rightCard: UseQueryResult<Person | Starship | null, Error>;
  isLoading: boolean;
  isError: boolean;
  refetchBoth: () => void;
}

export function useBattleCards(
  resourceType: 'people' | 'starships',
  enabled: boolean = true
): UseBattleCardsResult {
  const queries = useQueries({
    queries: [
      {
        queryKey: [...gameQueryKeys.randomPerson(), 'left'],
        queryFn: async () => {
          if (resourceType !== 'people') return null;
          const data = await graphqlClient.request<{ getRandomPerson: Person }>(GET_RANDOM_PERSON);
          return data.getRandomPerson;
        },
        enabled: resourceType === 'people' && enabled,
      },
      {
        queryKey: [...gameQueryKeys.randomPerson(), 'right'],
        queryFn: async () => {
          if (resourceType !== 'people') return null;
          const data = await graphqlClient.request<{ getRandomPerson: Person }>(GET_RANDOM_PERSON);
          return data.getRandomPerson;
        },
        enabled: resourceType === 'people' && enabled,
      },
      {
        queryKey: [...gameQueryKeys.randomStarship(), 'left'],
        queryFn: async () => {
          if (resourceType !== 'starships') return null;
          const data = await graphqlClient.request<{ getRandomStarship: Starship }>(GET_RANDOM_STARSHIP);
          return data.getRandomStarship;
        },
        enabled: resourceType === 'starships' && enabled,
      },
      {
        queryKey: [...gameQueryKeys.randomStarship(), 'right'],
        queryFn: async () => {
          if (resourceType !== 'starships') return null;
          const data = await graphqlClient.request<{ getRandomStarship: Starship }>(GET_RANDOM_STARSHIP);
          return data.getRandomStarship;
        },
        enabled: resourceType === 'starships' && enabled,
      },
    ],
  });
  
  const [leftPerson, rightPerson, leftStarship, rightStarship] = queries;
  
  const leftCard = resourceType === 'people' ? leftPerson : leftStarship;
  const rightCard = resourceType === 'people' ? rightPerson : rightStarship;
  
  const refetchBoth = () => {
    leftCard.refetch();
    rightCard.refetch();
  };
  
  return {
    leftCard,
    rightCard,
    isLoading: leftCard.isLoading || rightCard.isLoading,
    isError: leftCard.isError || rightCard.isError,
    refetchBoth,
  };
}