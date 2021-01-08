import { delegateToSchema } from '@graphql-tools/delegate'
import subschema from './neo4j/schema'

export const resolvers = {
  Query: {
    // listallposts
    posts: async (parent, args, context, info) => {
      return delegateToSchema({
        schema: subschema,
        operation: 'query',
        fieldName: 'getPosts',
        context,
        info
      })
    },
    // listallusers
    users: async (parent, args, context, info) => {
      return delegateToSchema({
        schema: subschema,
        operation: 'query',
        fieldName: 'getUser',
        context,
        info
      })
    }
  },
  Mutation: {
    // signup
    signup: async (parent, args, context) => {
      return context.dataSources.userdb.signup(args)
        .catch((err) => {
          return err
        })
    },
    // login
    login: async (parent, args, context) => {
      return context.dataSources.userdb.login(args)
        .catch((err) => {
          return err
        })
    },
    // create a post
    write: async (parent, args, context) => {
      return context.dataSources.postdb.createPost(args)
        .catch((err) => {
          return err
        })
    },

    upvote: async (parent, args, context) => {
      return context.dataSources.postdb.upvote(args)
        .catch((err) => {
          return err
        })
    },

    downvote: async (parent, args, context) => {
      return context.dataSources.postdb.downvote(args)
        .catch((err) => {
          return err
        })
    },

    delete: async (parent, args, context) => {
      return context.dataSources.postdb.deletePost(args)
        .catch((err) => {
          return err
        })
    }
  }
}
