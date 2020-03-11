import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

// const typeDefs = importSchema(`schema/typeDefs.graphql`);
const typeDefs=`
scalar Date
scalar URL

type Message {
  id: ID!
  content: String!
  createdAt: Date!
}

type Chat {
  id: ID!
  name: String!
  picture: URL
  lastMessage: Message
  messages: [Message!]!
}

type Query {
  chats: [Chat!]!
  chat(chatId: ID!): Chat
}

type Mutation {
  addMessage(chatId: ID!, content: String!): Message
}

`;



export default makeExecutableSchema({ resolvers, typeDefs });
