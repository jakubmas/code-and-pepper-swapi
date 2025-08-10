export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string | number };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type BattleHistoryResponse = {
  items: Array<BattleResult>;
  pageInfo: PageInfo;
};

export type BattlePlayer = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type BattlePlayerInput = {
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type BattleResult = {
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  players: Array<BattlePlayer>;
  resourceType: Scalars['String']['output'];
  winner: Scalars['String']['output'];
};

export type BattleStatistics = {
  computerWins: Scalars['Int']['output'];
  playerWins: Scalars['Int']['output'];
};

export type Mutation = {
  saveBattleResult: MutationResponse;
};

export type MutationSaveBattleResultArgs = {
  players: Array<BattlePlayerInput>;
  resourceType: Scalars['String']['input'];
  winner: Scalars['String']['input'];
};

export type MutationResponse = {
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type PageInfo = {
  currentPage: Scalars['Int']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Person = {
  birthYear?: Maybe<Scalars['String']['output']>;
  created?: Maybe<Scalars['String']['output']>;
  edited?: Maybe<Scalars['String']['output']>;
  eyeColor?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  hairColor?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  mass: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  skinColor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  getBattleHistory: BattleHistoryResponse;
  getBattleStatistics: BattleStatistics;
  getRandomPerson: Person;
  getRandomStarship: Starship;
};

export type QueryGetBattleHistoryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  resourceType?: InputMaybe<Scalars['String']['input']>;
  winner?: InputMaybe<Scalars['String']['input']>;
};

export type Starship = {
  MGLT?: Maybe<Scalars['Int']['output']>;
  cargoCapacity?: Maybe<Scalars['Float']['output']>;
  consumables?: Maybe<Scalars['String']['output']>;
  costInCredits?: Maybe<Scalars['Float']['output']>;
  created?: Maybe<Scalars['String']['output']>;
  crew: Scalars['Int']['output'];
  edited?: Maybe<Scalars['String']['output']>;
  hyperdriveRating?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  length?: Maybe<Scalars['Float']['output']>;
  manufacturer?: Maybe<Scalars['String']['output']>;
  maxAtmospheringSpeed?: Maybe<Scalars['Int']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  passengers?: Maybe<Scalars['Int']['output']>;
  starshipClass?: Maybe<Scalars['String']['output']>;
};

export type GetRandomPersonQueryVariables = Exact<{ [key: string]: never }>;

export type GetRandomPersonQuery = { getRandomPerson: { name: string; mass: number } };

export type GetRandomStarshipQueryVariables = Exact<{ [key: string]: never }>;

export type GetRandomStarshipQuery = { getRandomStarship: { name: string; crew: number } };

export type SaveBattleResultMutationVariables = Exact<{
  winner: Scalars['String']['input'];
  resourceType: Scalars['String']['input'];
  players: Array<BattlePlayerInput> | BattlePlayerInput;
}>;

export type SaveBattleResultMutation = {
  saveBattleResult: { success: boolean; message?: string | null };
};

export type GetBattleHistoryQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  resourceType?: InputMaybe<Scalars['String']['input']>;
  winner?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetBattleHistoryQuery = {
  getBattleHistory: {
    items: Array<{
      id: string | number;
      winner: string;
      resourceType: string;
      createdAt: string;
      players: Array<{ id: number; name: string; value: string }>;
    }>;
    pageInfo: {
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      totalCount: number;
    };
  };
};

export type GetBattleStatisticsQueryVariables = Exact<{ [key: string]: never }>;

export type GetBattleStatisticsQuery = {
  getBattleStatistics: { playerWins: number; computerWins: number };
};
