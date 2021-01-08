import { makeAugmentedSchema } from 'neo4j-graphql-js'
import { gql } from 'apollo-server'

const typeDefs = gql`
 type User {
   id: ID!
   name: String!
   email: String
   posts: [Post] @relation(name: "WROTE", direction: OUT)
 }
 type Post {
   id: ID!
   title: String!
   votes: Int!
   voters: [User!] @relation(name: "VOTED", direction: IN)
   author: User! @relation(name: "WROTE", direction: IN)
 }

 type Query {
   getPosts: [Post]
   getUser: [User]
 }
`

const schema = makeAugmentedSchema({
  typeDefs,
  config: {
    query: false,
    mutation: false
  }
})
export default schema
