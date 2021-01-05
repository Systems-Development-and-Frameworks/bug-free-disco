import { ApolloServer } from 'apollo-server'
//  import { makeExecutableSchema } from 'graphql-tools'
import { applyMiddleware } from 'graphql-middleware'
import typeDefs from './typeDefs'
import { resolvers } from './resolvers'
import { UserDataSource } from './datasources/userDatasource'
import { PostDataSource } from './datasources/postDatasource'
import { permissions } from './utils/permissionHandler'
import neo4jSchema from './neo4j/schema'
import driver from './neo4j/driver'
import { stitchSchemas } from '@graphql-tools/stitch'


const userdb = new UserDataSource()
const postdb = new PostDataSource()

const dataSources = () => ({ userdb, postdb })

const context = ({ req, res }) => ({ req, res, driver })

const schema = applyMiddleware(
  stitchSchemas({ subschemas: [neo4jSchema], typeDefs, resolvers }),
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
