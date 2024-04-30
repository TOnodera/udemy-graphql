const { ApolloServer, gql } = require("apollo-server");

// HackerNewsの一つ一つの投稿
let links = [
  {
    id: "link-0",
    description: "GraphQLチュートリアルをUdemyで学ぶ",
    url: "www.udemy-graphql-tutrial.com",
  },
];

// GraphQLスキーマの定義
const typeDefs = gql`
  type Query {
    info: String! # !はnot null
    feed: [Link]!
  }
  type Link {
    id: ID!
    description: String!
    url: String!
  }
  type Mutation {
    post(url: String!, description: String!): Link!
  }
`;

// リゾルバ関数
const resolvers = {
  Query: {
    info: () => "HackerNewsクローン",
    feed: () => links,
  },
  Mutation: {
    post: (parent, args) => {
      const idCount = links.length;
      const link = {
        id: `link-${idCount}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => console.log(`server url is ${url}`));
