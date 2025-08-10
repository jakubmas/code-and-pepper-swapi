import { GraphQLResolveInfo } from 'graphql';
import { GraphQLContext } from './graphql-context';
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
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
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
  id: Scalars['Int']['output'];
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
  id: Scalars['Int']['output'];
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
  id: Scalars['Int']['output'];
  length?: Maybe<Scalars['Float']['output']>;
  manufacturer?: Maybe<Scalars['String']['output']>;
  maxAtmospheringSpeed?: Maybe<Scalars['Int']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  passengers?: Maybe<Scalars['Int']['output']>;
  starshipClass?: Maybe<Scalars['String']['output']>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  BattleHistoryResponse: ResolverTypeWrapper<BattleHistoryResponse>;
  BattlePlayer: ResolverTypeWrapper<BattlePlayer>;
  BattlePlayerInput: BattlePlayerInput;
  BattleResult: ResolverTypeWrapper<BattleResult>;
  BattleStatistics: ResolverTypeWrapper<BattleStatistics>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  MutationResponse: ResolverTypeWrapper<MutationResponse>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Person: ResolverTypeWrapper<Person>;
  Query: ResolverTypeWrapper<{}>;
  Starship: ResolverTypeWrapper<Starship>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BattleHistoryResponse: BattleHistoryResponse;
  BattlePlayer: BattlePlayer;
  BattlePlayerInput: BattlePlayerInput;
  BattleResult: BattleResult;
  BattleStatistics: BattleStatistics;
  Boolean: Scalars['Boolean']['output'];
  Float: Scalars['Float']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  MutationResponse: MutationResponse;
  PageInfo: PageInfo;
  Person: Person;
  Query: {};
  Starship: Starship;
  String: Scalars['String']['output'];
};

export type BattleHistoryResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['BattleHistoryResponse'] = ResolversParentTypes['BattleHistoryResponse'],
> = {
  items?: Resolver<Array<ResolversTypes['BattleResult']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BattlePlayerResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['BattlePlayer'] = ResolversParentTypes['BattlePlayer'],
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BattleResultResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['BattleResult'] = ResolversParentTypes['BattleResult'],
> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  players?: Resolver<Array<ResolversTypes['BattlePlayer']>, ParentType, ContextType>;
  resourceType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  winner?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BattleStatisticsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['BattleStatistics'] = ResolversParentTypes['BattleStatistics'],
> = {
  computerWins?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  playerWins?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = {
  saveBattleResult?: Resolver<
    ResolversTypes['MutationResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationSaveBattleResultArgs, 'players' | 'resourceType' | 'winner'>
  >;
};

export type MutationResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['MutationResponse'] = ResolversParentTypes['MutationResponse'],
> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo'],
> = {
  currentPage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PersonResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Person'] = ResolversParentTypes['Person'],
> = {
  birthYear?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  edited?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  eyeColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  gender?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hairColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  height?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  mass?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  skinColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  getBattleHistory?: Resolver<
    ResolversTypes['BattleHistoryResponse'],
    ParentType,
    ContextType,
    RequireFields<QueryGetBattleHistoryArgs, 'limit' | 'page'>
  >;
  getBattleStatistics?: Resolver<ResolversTypes['BattleStatistics'], ParentType, ContextType>;
  getRandomPerson?: Resolver<ResolversTypes['Person'], ParentType, ContextType>;
  getRandomStarship?: Resolver<ResolversTypes['Starship'], ParentType, ContextType>;
};

export type StarshipResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Starship'] = ResolversParentTypes['Starship'],
> = {
  MGLT?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  cargoCapacity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  consumables?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  costInCredits?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  created?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  crew?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  edited?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hyperdriveRating?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  length?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  manufacturer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  maxAtmospheringSpeed?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  model?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  passengers?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  starshipClass?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  BattleHistoryResponse?: BattleHistoryResponseResolvers<ContextType>;
  BattlePlayer?: BattlePlayerResolvers<ContextType>;
  BattleResult?: BattleResultResolvers<ContextType>;
  BattleStatistics?: BattleStatisticsResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  MutationResponse?: MutationResponseResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Person?: PersonResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Starship?: StarshipResolvers<ContextType>;
};
