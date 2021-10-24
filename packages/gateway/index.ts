import { ApolloGateway } from "@apollo/gateway";
import { ApolloServer } from "apollo-server";

export const serviceList = [
  {
    name: "users",
    url: process.env.USERS_PUBLIC_URL || "http://localhost:4001",
  },
  {
    name: "orders",
    url: process.env.ORDERS_PUBLIC_URL || "http://localhost:4002",
  },
];

async function buildApp() {
  const gateway = new ApolloGateway({
    serviceList,
  });

  const { schema, executor } = await gateway.load();

  return new ApolloServer({
    schema,
    executor: executor as any,
  });
}

const port = process.env.PORT || 4000;

buildApp()
  .then((server) => server.listen(port))
  .then(({ url }) => console.info(`Gateway server listening on ${url}.`));
