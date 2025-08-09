import { gql } from 'graphql-request';

export const GET_RANDOM_PERSON = gql`
  query GetRandomPerson {
    getRandomPerson {
      name
      mass
    }
  }
`;

export const GET_RANDOM_STARSHIP = gql`
  query GetRandomStarship {
    getRandomStarship {
      name
      crew
    }
  }
`;