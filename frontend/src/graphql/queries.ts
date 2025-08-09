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

export const SAVE_BATTLE_RESULT = gql`
  mutation SaveBattleResult($winner: String!, $resourceType: String!, $players: [BattlePlayerInput!]!) {
    saveBattleResult(winner: $winner, resourceType: $resourceType, players: $players) {
      success
      message
    }
  }
`;