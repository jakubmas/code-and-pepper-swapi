import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Person {
    id: ID!
    name: String!
    height: Int
    mass: Int!
    hairColor: String
    skinColor: String
    eyeColor: String
    birthYear: String
    gender: String
    created: String
    edited: String
  }
  
  type Starship {
    id: ID!
    name: String!
    model: String
    manufacturer: String
    costInCredits: Float
    length: Float
    maxAtmospheringSpeed: Int
    crew: Int!
    passengers: Int
    cargoCapacity: Float
    consumables: String
    hyperdriveRating: Float
    MGLT: Int
    starshipClass: String
    created: String
    edited: String
  }
  
  type BattlePlayer {
    id: Int!
    name: String!
    value: String!
  }

  input BattlePlayerInput {
    id: Int!
    name: String!
    value: String!
  }

  type BattleResult {
    id: ID!
    winner: String!
    resourceType: String!
    players: [BattlePlayer!]!
    createdAt: String!
  }

  type PageInfo {
    currentPage: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    totalCount: Int!
  }

  type BattleHistoryResponse {
    items: [BattleResult!]!
    pageInfo: PageInfo!
  }

  type MutationResponse {
    success: Boolean!
    message: String
  }

  type Query {
    getRandomPerson: Person!
    getRandomStarship: Starship!
    getBattleHistory(
      page: Int = 1
      limit: Int = 10
      resourceType: String
      winner: String
    ): BattleHistoryResponse!
  }

  type Mutation {
    saveBattleResult(
      winner: String!
      resourceType: String!
      players: [BattlePlayerInput!]!
    ): MutationResponse!
  }
`;