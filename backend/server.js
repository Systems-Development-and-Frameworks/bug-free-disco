import { ApolloServer } from 'apollo-server'
import typeDefs from './typeDefs'
import { Post, MyDataSource, User } from './db'

const db = new MyDataSource()
db.users = [db.createUser({ user: { name: "Peter" } })]
db.posts = [db.createPost({ post: { title: "Test", author: { name: "Peter" } } })]


const dataSources = () => ({ db })

const context = ({ req, res }) => ({ req, res })

const resolvers = {
  Query: {
    //listallposts
    posts: (parent, args, context) => context.dataSources.db.posts,
    //listallusers
    users: (parent, args, context) => context.dataSources.db.users
  },
  Mutation: {
    //create a post
    write(parent, args, context) {
      return context.dataSources.db.createPost(args)
    },

    //create a user
    createUser(parent, args, context) {
      return context.dataSources.db.createUser(args)
    },

    upvote: (parent, args, context) => context.dataSources.db.upvote(args),

    downvote: (parent, args, context) => context.dataSources.db.downvote(args)
  }
}


export default class Server {
  constructor(opts) {
    const defaults = {
      typeDefs,
      resolvers,
      dataSources,
      context
    }
    return new ApolloServer({ ...defaults, ...opts })
  }
}


