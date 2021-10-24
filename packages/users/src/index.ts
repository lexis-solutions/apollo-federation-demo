import "reflect-metadata";
import { buildSchema, createResolversMap } from "type-graphql";
import { ApolloServer } from "apollo-server";
import { buildFederatedSchema, printSchema } from "@apollo/federation";
import gql from "graphql-tag";
import path from "path";

async function buildApp() {
  const schema = await buildSchema({
    resolvers: [path.resolve(__dirname, "resolvers/**/*-resolver.ts")],
  });

  const federatedSchema = buildFederatedSchema({
    typeDefs: gql(printSchema(schema)),
    resolvers: createResolversMap(schema) as any,
  });

  return new ApolloServer({
    schema: federatedSchema,
  });
}

const port = process.env.PORT || 4001;

buildApp()
  .then((server) => server.listen(port))
  .then(({ url }) => console.info(`Users server listening on ${url}.`));
