import { ApolloServer } from 'apollo-server'
import { makeExecutableSchema } from 'graphql-tools'
import { applyMiddleware } from 'graphql-middleware'
import typeDefs from './typeDefs'
import { resolvers } from './resolvers'
import { UserDataSource } from './datasources/userDatasource'
import { PostDataSource } from './datasources/postDatasource'
import { permissions } from './utils/permissionHandler'

const userdb = new UserDataSource()
const postdb = new PostDataSource()

const dataSources = () => ({ userdb, postdb })

const context = ({ req, res }) => ({ req, res })

const schema = applyMiddleware(
  makeExecutableSchema({ typeDefs, resolvers }),
  permissions
)

export default class Server {
  constructor (opts) {
    const defaults = {
      schema,
      dataSources,
      context
    }
    return new ApolloServer({ ...defaults, ...opts })
  }
}
