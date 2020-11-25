import Server from './server'


const playground = {
  settings: {
    'schema.polling.enable': false
  }
}
const server = new Server({ playground })

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
