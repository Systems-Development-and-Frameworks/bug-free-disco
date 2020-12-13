import { AuthenticationError, gql, UserInputError } from 'apollo-server'
import { makeExecutableSchema } from 'graphql-tools'
import { applyMiddleware } from 'graphql-middleware'
import typeDefs from '../typeDefs'
import { resolvers } from '../resolvers'
import { permissions } from '../utils/permissionHandler'
import { PostDataSource } from '../datasources/postDatasource'
import { UserDataSource } from '../datasources/userDatasource'
import { Post } from '../models/post'
import { testClient } from './testClient'

let userdb = new UserDataSource()
let postdb = new PostDataSource()

const schema = applyMiddleware(
  makeExecutableSchema({ typeDefs, resolvers }),
  permissions
)

const { mutate, query } = testClient(
  {
    schema,
    dataSources: () => ({ userdb, postdb }),
    context: async ({ req, res }) => ({ req, res })
  },
  {
    req: { headers: { authorization: 'Bearer ' } }
  }
)

// TEST Query Posts
describe('queries', () => {
  describe('POSTS', () => {
    const POSTS = gql`
            query {
                posts {
                  id
                  title
                  votes
                }
            }
        `

    it('returns empty array', async () => {
      await expect(query({ query: POSTS, ctxArg: { req: { headers: { authorization: 'Bearer ' } } } }))
        .resolves
        .toMatchObject({
          errors: undefined,
          data: { posts: [] }
        })
    })

    describe('given posts in the database', () => {
      beforeEach(() => {
        postdb.posts = [new Post({ title: 'Test' })]
      })

      it('returns posts', async () => {
        await expect(query({ query: POSTS, ctxArg: { req: { headers: { authorization: 'Bearer ' } } } }))
          .resolves
          .toMatchObject({
            errors: undefined,
            data: { posts: [{ title: 'Test', id: expect.any(String) }] }
          })
      })
    })
  })
})

// TEST Query Users
describe('queries', () => {
  describe('USERS', () => {
    const USERS = gql`
            query {
                users {
                  name
                  posts {
                    id,
                    title,
                    votes
                  }
                }
            }
        `

    it('returns null and Not Authorized error', async () => {
      await expect(query({ query: USERS, ctxArg: { req: { headers: { authorization: 'Bearer ' } } } }))
        .resolves
        .toMatchObject({
          errors: [new AuthenticationError('Invalid jwt provided')],
          data: { users: null }
        })
    })

    describe('given users in the database', () => {
      // signup peter and login to get the jwt access key
      let newUserJwt = ''
      beforeEach(async () => {
        await userdb.signup({ name: 'Peter', email: 'peter@dada.de', password: 'ZoeRobolomais' })
        newUserJwt = await userdb.login({ email: 'peter@dada.de', password: 'ZoeRobolomais' })
      })

      it('returns users', async () => {
        await expect(query({ query: USERS, ctxArg: { req: { headers: { authorization: `Bearer ${newUserJwt}` } } } }))
          .resolves
          .toMatchObject({
            errors: undefined,
            data: { users: [{ name: 'Peter' }] }
          })
      })
    })
  })
})

// TEST write post
describe('mutations', () => {
  let newUserJwt = ''
  beforeEach(() => {
    userdb = new UserDataSource()
    postdb = new PostDataSource()
  })

  describe('given users in the database', () => {
    beforeEach(async (done) => {
      await userdb.signup({ name: 'Peter', email: 'peter@dada.de', password: 'ZoeRobolomais' })
      newUserJwt = await userdb.login({ email: 'peter@dada.de', password: 'ZoeRobolomais' })
      const newUser = await userdb.getUserByEmail('peter@dada.de')
      const newPost = new Post({ title: 'Init test' })
      newUser.posts.push(newPost)
      newPost.author = newUser
      postdb.posts = [newPost]
      userdb.users = [newUser]
      done()
    })

    describe('write post with existing user', () => {
      const createPostAction = () => mutate({ mutation: WRITE_POST, variables: { title: 'Test' }, ctxArg: { req: { headers: { authorization: `Bearer ${newUserJwt}` } } } })
      const createPostWithoutJwtAction = () => mutate({ mutation: WRITE_POST, variables: { title: 'Test' }, ctxArg: { req: { headers: { authorization: 'Bearer ' } } } })
      const WRITE_POST = gql`
            mutation($title: String!) {
                write(post: { title: $title}){title, id, author {name}}
            }
        `

      it('adds a post to postdb.posts with author the current logged user (authenticated)', async () => {
        expect(postdb.posts).toHaveLength(1)
        await createPostAction()
        expect(postdb.posts).toHaveLength(2)
      })

      it('responds on created post (authenticated)', async () => {
        await expect(createPostAction())
          .resolves
          .toMatchObject({
            errors: undefined,
            data: {
              write: {
                title: 'Test',
                id: expect.any(String),
                author: { name: 'Peter' }
              }
            }
          })
      })

      it('responds with not authorized error (Unauthenticated)', async () => {
        await expect(createPostWithoutJwtAction())
          .resolves
          .toMatchObject({
            errors: [new AuthenticationError('Invalid jwt provided')], // Array with error message
            data: {
              write: null
            }
          })
      })
    })

    // TEST Signup
    describe('Signup with a name that has not yet been assigned', () => {
      const signUpAction = () => mutate({ mutation: SIGNUP_USER, variables: { name: 'Sophie', email: 'sophie@popo@de', password: 'Iojjhjsjdej' }, ctxArg: { req: { headers: { authorization: 'Bearer ' } } } })

      const SIGNUP_USER = gql`
            mutation($name: String!, $email: String!, $password: String!) {
                signup(name: $name, email: $email, password: $password)
            }
        `

      it('adds a user to userdb.users', async () => {
        expect(userdb.users).toHaveLength(1)
        await signUpAction()
        expect(userdb.users).toHaveLength(2)
      })

      it('responds with jwt access key', async () => {
        await expect(signUpAction())
          .resolves
          .toMatchObject({
            errors: undefined,
            data: { signup: expect.any(String) }
          })
      })
    })
    describe('create user with an already existing name', () => {
      const signUpWithExistingEmailAction = () => mutate({ mutation: SIGNUP_USER_WITH_EXISTING_EMAIL, variables: { name: 'Peter', email: 'peter@dada.de', password: 'ZoeRobolomais98' }, ctxArg: { req: { headers: { authorization: 'Bearer ' } } } })
      const SIGNUP_USER_WITH_EXISTING_EMAIL = gql`
      mutation($name: String!, $email: String!, $password: String!) {
          signup(name: $name, email: $email, password: $password)
      }
      `
      it('responds user already exists error message', async () => {
        await expect(signUpWithExistingEmailAction())
          .resolves
          .toMatchObject({
            errors: [new UserInputError('This email already exists')]
          })
      })
    })
    // TEST upvote
    describe('voting up a post which exists and havent been upvoted yet', () => {
      const upvoteAction = () => mutate({ mutation: UPVOTE, variables: { id: postdb.posts[0].id }, ctxArg: { req: { headers: { authorization: `Bearer ${newUserJwt}` } } } })

      const UPVOTE = gql`
            mutation($id: ID!) {
              upvote(id: $id){id, votes, voters{name}}
            }
        `

      it('votes the post up', async () => {
        expect(postdb.posts[0].votes).toEqual(0)
        await upvoteAction()
        expect(postdb.posts[0].votes).toEqual(1)
      })

      it('calls postdb.upvote', async () => {
        postdb.upvote = jest.fn(() => {
        })
        await upvoteAction()
        expect(postdb.upvote).toHaveBeenCalledWith({ id: postdb.posts[0].id })
      })

      it('responds for voting up a post successfully', async () => {
        await expect(upvoteAction())
          .resolves
          .toMatchObject({
            errors: undefined,
            data: { upvote: { id: postdb.posts[0].id, votes: 1, voters: [{ name: 'Peter' }] } }
          })
      })
    })

    describe('vote up a post that doesnt exist', () => {
      const upvoteNonExistingPostAction = () => mutate({ mutation: UPVOTE, variables: { id: 'not existing id' }, ctxArg: { req: { headers: { authorization: `Bearer ${newUserJwt}` } } } })
      const UPVOTE = gql`
            mutation($id: ID!) {
              upvote(id: $id){id, votes, voters{name}}
            }
        `
      it('responds post doesnt exist error message', async () => {
        await expect(upvoteNonExistingPostAction())
          .resolves
          .toMatchObject({
            errors: [new UserInputError('This post doesn\'t exist')]
          })
      })
    })

    describe('vote up a post without jwt access key (Unauthenticated) ', () => {
      const upvoteWithoutJwtaction = () => mutate({ mutation: UPVOTE, variables: { id: postdb.posts[0].id }, ctxArg: { req: { headers: { authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5MzAzODExOGRkNGJkOTVjNDExMjYxNGM0MzQ3ZWI5IiwiaWF0IjoxNjA2OTI5MzI1fQ.G5vGaMD-q_WWLNWN5Y8ilXtVt7IsHqzCLFcEaXvKKvs' } } } })
      const UPVOTE = gql`
            mutation($id: ID!) {
              upvote(id: $id){id, votes, voters{name}}
            }
        `
      it('responds user doesnt exist error message (Unauthenticated)', async () => {
        await expect(upvoteWithoutJwtaction())
          .resolves
          .toMatchObject({
            errors: [new UserInputError('Invalid jwt provided')]
          })
      })
    })

    describe('vote up a post for the second time', () => {
      const upVoteAction = () => mutate({ mutation: UPVOTE, variables: { id: postdb.posts[0].id }, ctxArg: { req: { headers: { authorization: 'Bearer ' } } } })
      const UPVOTE = gql`
              mutation($id: ID!) {
                upvote(id: $id){id, votes, voters{name}}
              }
          `

      it('doesn\'t increase the votes a second time', async () => {
        postdb.posts[0].voters.push(userdb.users[0])
        postdb.posts[0].votes++
        expect(postdb.posts[0].votes).toEqual(1)
        await upVoteAction()
        expect(postdb.posts[0].votes).toEqual(1)
      })
    })

    // TEST downvote
    describe('voting down a post which exists and havent been upvoted yet', () => {
      const downvoteAction = () => mutate({ mutation: DOWNVOTE, variables: { id: postdb.posts[0].id }, ctxArg: { req: { headers: { authorization: `Bearer ${newUserJwt}` } } } })

      const DOWNVOTE = gql`
            mutation($id: ID!) {
              downvote(id: $id){id, votes, voters{name}}
            }
        `

      it('votes the post down', async () => {
        expect(postdb.posts[0].votes).toEqual(0)
        await downvoteAction()
        expect(postdb.posts[0].votes).toEqual(-1)
      })

      it('calls postdb.downvote', async () => {
        postdb.downvote = jest.fn(() => {
        })
        await downvoteAction()
        expect(postdb.downvote).toHaveBeenCalledWith({ id: postdb.posts[0].id })
      })

      it('responds for voting down a post successfully', async () => {
        await expect(downvoteAction())
          .resolves
          .toMatchObject({
            errors: undefined,
            data: { downvote: { id: postdb.posts[0].id, votes: -1, voters: [{ name: 'Peter' }] } }
          })
      })
    })

    describe('vote down a post that doesnt exist', () => {
      const downvoteNonExistingPostAction = () => mutate({ mutation: DOWNVOTE, variables: { id: 'not existing id' }, ctxArg: { req: { headers: { authorization: `Bearer ${newUserJwt}` } } } })
      const DOWNVOTE = gql`
            mutation($id: ID!) {
              downvote(id: $id){id, votes, voters{name}}
            }
        `
      it('responds post doesnt exist error message', async () => {
        await expect(downvoteNonExistingPostAction())
          .resolves
          .toMatchObject({
            errors: [new UserInputError('This post doesn\'t exist')]
          })
      })
    })

    describe('vote down a post without jwt access key (Unauthenticated) ', () => {
      const downvoteWithoutJwtaction = () => mutate({ mutation: DOWNVOTE, variables: { id: postdb.posts[0].id }, ctxArg: { req: { headers: { authorization: 'Bearer ' } } } })
      const DOWNVOTE = gql`
            mutation($id: ID!) {
              downvote(id: $id){id, votes, voters{name}}
            }
        `
      it('responds user doesnt exist error message', async () => {
        await expect(downvoteWithoutJwtaction())
          .resolves
          .toMatchObject({
            errors: [new AuthenticationError('Invalid jwt provided')]
          })
      })
    })

    describe('vote down a post for the second time', () => {
      const downVoteAction = () => mutate({ mutation: DOWNVOTE, variables: { id: postdb.posts[0].id }, ctxArg: { req: { headers: { authorization: 'Bearer ' } } } })
      const DOWNVOTE = gql`
            mutation($id: ID!) {
              downvote(id: $id){id, votes, voters{name}}
            }
        `

      it('doesn\'t dicrease the vote a second time', async () => {
        postdb.posts[0].voters.push(userdb.users[0])
        postdb.posts[0].votes--
        expect(postdb.posts[0].votes).toEqual(-1)
        await downVoteAction()
        expect(postdb.posts[0].votes).toEqual(-1)
      })
    })
  })
})
