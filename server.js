const { ApolloServer, gql } = require("apollo-server");
const { sequelize } = require("./models");
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");
const contextMiddleware = require("./util/contextMiddleware");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
  subscription: { path: "/graphql" },
});

server.listen().then(({ url }) => {
  console.log(`Serever ready at ${url}`);
  sequelize
    .authenticate()
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log(err));
});
