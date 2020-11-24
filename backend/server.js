import { ApolloServer } from 'apollo-server'
import typeDefs from './typeDefs'

const resolvers = {
  Query: {
    posts: () => posts,
    users: () => users
  }
}

const user = {
  name: 'Hans'
}

const posts = [
  {
    id: 2,
    title: 'Zzdszd',
    votes: 4,
    author: user
  }
]

export default class Server {
  constructor (opts) {
    return new ApolloServer({ typeDefs, resolvers })
  }
}
