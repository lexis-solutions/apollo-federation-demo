import { ApolloGateway } from "@apollo/gateway";
import { ApolloServer } from "apollo-server";
import waitOn from "wait-on";

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

console.info("waiting for services to come online...");

waitOn({
  resources: serviceList.map((service) => service.url),
  validateStatus: () => true,
  timeout: 60 * 1000,
})
  .then(buildApp)
  .then((server) => server.listen(port))
  .then(({ url }) => console.info(`Gateway server listening on ${url}.`));
