const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");
const { getUserId } = require("./utils");

const { PrismaClient } = require("@prisma/client");

const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Link = require("./resolvers/Link");
const User = require("./resolvers/User");
const Subscription = require("./resolvers/Subscription");

// リゾルバ関数
const resolvers = {
  Link,
  Mutation,
  Query,
  Subscription,
  User,
};

// サブスクリプション実装
const { PubSub } = require("apollo-server");

// context
const pubsub = new PubSub();
const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    }; //コンテキストに渡すことでresolvers()で使えるようになる
  },
});

server.listen().then(({ url }) => console.log(`server url is ${url}`));
