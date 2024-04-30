const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// リゾルバ関数
const resolvers = {
  Query: {
    info: () => "HackerNewsクローン",
    feed: async (parent, args, context) => {
      return await context.prisma.link.findMany();
    },
  },
  Mutation: {
    post: async (parent, args, context) => {
      const newLink = await context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      });
      return newLink;
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, "sma/schema.graphql"),
    "utf-8"
  ),
  resolvers,
  context: {
    prisma, //コンテキストに渡すことでresolvers()で使えるようになる
  },
});

server.listen().then(({ url }) => console.log(`server url is ${url}`));
