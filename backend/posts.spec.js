import { createTestsClient } from 'apollo-server-testing'
import server from './server'

const { query, mutate } = createTestsClient(server)
