import { useQueries } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { graphqlClient } from '@/config/graphql-client';
import { GET_RANDOM_PERSON, GET_RANDOM_STARSHIP } from '@/graphql/queries';
import type { Person, Starship } from '@/generated/graphql';

interface UseBattleCardsResult {
  leftCard: UseQueryResult<Person | Starship, Error>;
  rightCard: UseQueryResult<Person | Starship, Error>;
  isLoading: boolean;
  isError: boolean;
  refetchBoth: () => void;
}

export function useBattleCards(
  resourceType: 'people' | 'starships',
  enabled: boolean = true
): UseBattleCardsResult {
  
  const queryFn = async () => {
    if (resourceType === 'people') {
      const data = await graphqlClient.request<{ getRandomPerson: Person }>(GET_RANDOM_PERSON);
      return data.getRandomPerson;
    } else {
      const data = await graphqlClient.request<{ getRandomStarship: Starship }>(GET_RANDOM_STARSHIP);
      return data.getRandomStarship;
    }
  };

  const queries = useQueries({
    queries: [
      {
        queryKey: ['game', resourceType, 'left'],
        queryFn,
        enabled,
      },
      {
        queryKey: ['game', resourceType, 'right'],
        queryFn,
        enabled,
      },
    ],
  });
  
  const [leftCard, rightCard] = queries;
  
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