import { GraphQLClient } from 'graphql-request';

// Use full URL for the GraphQL endpoint
const endpoint = 'http://localhost:4000/graphql';

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});