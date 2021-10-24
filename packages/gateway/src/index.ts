import { ApolloGateway } from "@apollo/gateway";
import { ApolloServer } from "apollo-server-express";
import waitOn from "wait-on";
import express from "express";

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

const app = express();

app.listen(port, () => {
  console.info(`started gateway server on http://localhost:${port}`);
  console.info("waiting for services to come online...");
  waitOn({
    resources: serviceList.map((service) => service.url),
    validateStatus: () => true,
    timeout: 60 * 1000,
  })
    .then(buildApp)
    .then(async (server) => {
      await server.start();

      server.applyMiddleware({
        app,
        path: "/",
      });
    })
    .then(() => console.info(`gateway set up successfully`));
});
