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
  mutation SaveBattleResult(
    $winner: String!
    $resourceType: String!
    $players: [BattlePlayerInput!]!
  ) {
    saveBattleResult(winner: $winner, resourceType: $resourceType, players: $players) {
      success
      message
    }
  }
`;

export const GET_BATTLE_HISTORY = gql`
  query GetBattleHistory($page: Int, $limit: Int, $resourceType: String, $winner: String) {
    getBattleHistory(page: $page, limit: $limit, resourceType: $resourceType, winner: $winner) {
      items {
        id
        winner
        resourceType
        players {
          id
          name
          value
        }
        createdAt
      }
      pageInfo {
        currentPage
        totalPages
        hasNextPage
        hasPreviousPage
        totalCount
      }
    }
  }
`;

export const GET_BATTLE_STATISTICS = gql`
  query GetBattleStatistics {
    getBattleStatistics {
      playerWins
      computerWins
    }
  }
`;
