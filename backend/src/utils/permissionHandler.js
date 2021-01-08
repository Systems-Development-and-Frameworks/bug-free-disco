import jwt from 'jsonwebtoken'
import { AuthenticationError, UserInputError } from 'apollo-server'
import { rule, shield, allow, deny } from 'graphql-shield'
require('dotenv-flow').config()

const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, context, info) => {
    let token = context.req.headers.authorization
    if (token) {
      token = token.replace('Bearer ', '')

      let decodedJwt = {}
      try {
        decodedJwt = jwt.verify(
          token,
          process.env.JWT_SECRET,
          { algorithm: 'HS256' }
        )
      } catch (err) {
        return new AuthenticationError('Invalid jwt provided')
      }

      try {
        // try to find corresponding user in db
        const user = await context.dataSources.userdb.getUserById(
          decodedJwt.id
        )
        if (user) {
          context.req.user = user
          return true
        } else {
          throw new UserInputError('No matching user found. Please check your input')
        }
      } catch (err) {
        return err
      }
    } else {
      return new AuthenticationError('Invalid jwt provided')
    }
  }
)

// need to be updated
const isOwner = rule({ cache: 'contextual' })(
  async (parent, args, context, info) => {
    let token = context.req.headers.authorization
    if (token) {
      token = token.replace('Bearer ', '')

      let decodedJwt = {}
      try {
        decodedJwt = jwt.verify(
          token,
          process.env.JWT_SECRET,
          { algorithm: 'HS256' }
        )
      } catch (err) {
        return new AuthenticationError('Invalid jwt provided')
      }

      try {
        // try to find corresponding user in db
        const user = await context.dataSources.userdb.getUserById(
          decodedJwt.id
        )
        if (user) {
          // check if req.user is author of the post
          const post = await context.dataSources.postdb.getPostById(args.id)
          if (post) {
            if (post.author.id === user.id) {
              context.req.user = user
              return true
            }
          } else {
            throw new UserInputError('No matching post found. Please check your input')
          }
        }
      } catch (err) {
        return err
      }
    } else {
      return new AuthenticationError('Invalid jwt provided')
    }
  }
)

export const permissions = shield({
  Query: {
    users: isAuthenticated,
    getUser: deny,
    getPosts: deny
  },
  Mutation: {
    write: isAuthenticated,
    upvote: isAuthenticated,
    downvote: isAuthenticated,
    delete: isOwner
  }
},
{
  fallbackRule: allow
})
