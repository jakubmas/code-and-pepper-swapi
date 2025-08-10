import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './schema/graphql/type-defs';
import { resolvers } from './resolvers';
import { db } from './config/database';
import { GraphQLContext } from './types/graphql-context';
import http from 'http';

dotenv.config();

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const PORT = process.env.PORT || 4000;

  app.use(cors());
  app.use(express.json());

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer<GraphQLContext>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: formattedError => {
      console.error('GraphQL Error:', formattedError);
      return {
        ...formattedError,
        extensions: {
          ...formattedError.extensions,
          timestamp: new Date().toISOString(),
        },
      };
    },
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async () => ({ db }),
    })
  );

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📊 GraphQL endpoint at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
