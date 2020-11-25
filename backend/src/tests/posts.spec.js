import { createTestClient } from 'apollo-server-testing'
import { gql } from 'apollo-server'
import Server from '../server.js'
import { MyDataSource, Post, User } from '../db.js'
import { UserInputError } from 'apollo-server-errors'

let db = new MyDataSource()
const server = new Server({ dataSources: () => ({ db }) })

const { query, mutate } = createTestClient(server)

// TEST Query Posts
describe('queries', () => {
  describe('POSTS', () => {
    const POSTS = gql`
            query {
                posts {
                    id
                    title
                }
            }
        `

    it('returns empty array', async () => {
      await expect(query({ query: POSTS }))
        .resolves
        .toMatchObject({
          errors: undefined,
          data: { posts: [] }
        })
    })

    describe('given posts in the database', () => {
      beforeEach(() => {
        db.posts = [new Post({ title: 'Test' })]
      })

      it('returns posts', async () => {
        await expect(query({ query: POSTS }))
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
                        title
                    }
                }
            }
        `

    it('returns empty array', async () => {
      await expect(query({ query: USERS }))
        .resolves
        .toMatchObject({
          errors: undefined,
          data: { users: [] }
        })
    })

    describe('given users in the database', () => {
      beforeEach(() => {
        const newPost = new Post({ title: 'Test' })
        db.posts = [newPost]
        const newUser = new User({ name: 'Peter' })
        newUser.posts.push(newPost)
        db.users = [newUser]
      })

      it('returns users', async () => {
        await expect(query({ query: USERS }))
          .resolves
          .toMatchObject({
            errors: undefined,
            data: { users: [{ name: 'Peter', posts: [{ id: expect.any(String), title: 'Test' }] }] }
          })
      })
    })
  })
})

// TEST write post
describe('mutations', () => {
  beforeEach(() => {
    db = new MyDataSource()
  })

  describe('given users in the database', () => {
    beforeEach(() => {
      const newPost = new Post({ title: 'Test' })
      const newUser = new User({ name: 'Peter' })
      newUser.posts.push(newPost)
      newPost.author = newUser
      db.posts = [newPost]
      db.users = [newUser]
    })

    describe('write post with existing user', () => {
      const action = () => mutate({ mutation: WRITE_POST, variables: { title: 'Test', author: 'Peter' } })
      const WRITE_POST = gql`
            mutation($title: String!, $author: String!) {
                write(post: { title: $title, author: { name: $author }}){title, id, author {name}}
            }
        `

      it('adds a post to db.posts', async () => {
        expect(db.posts).toHaveLength(1)
        await action()
        expect(db.posts).toHaveLength(2)
      })

      it('calls db.createPost', async () => {
        db.createPost = jest.fn(() => {
        })
        await action()
        expect(db.createPost).toHaveBeenCalledWith({ post: { title: 'Test', author: { name: 'Peter' } } })
      })

      it('responds with created post', async () => {
        await expect(action())
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
    })
    describe('write post with non existing user', () => {
      const action = () => mutate({ mutation: WRITE_POST, variables: { title: 'Test', author: 'Not existing user' } })
      const WRITE_POST = gql`
            mutation($title: String!, $author: String!) {
                write(post: { title: $title, author: { name: $author }}){title, id}
            }
        `
      it('responds user does not exist error message', async () => {
        await expect(action())
          .resolves
          .toMatchObject({
            errors: [new UserInputError("This username doesn't exist")]
          })
      })
    })

    // TEST CreateUser
    describe('createUser with a name that has not yet been assigned', () => {
      const action = () => mutate({ mutation: CREATE_USER, variables: { name: 'Sophie' } })
      const CREATE_USER = gql`
        mutation($name: String!) {
            createUser(user:{name: $name}){name, posts{id, title}}
        }
     `

      it('adds a user to db.users', async () => {
        expect(db.users).toHaveLength(1)
        await action()
        expect(db.users).toHaveLength(2)
      })

      it('calls db.createUser', async () => {
        db.createUser = jest.fn(() => {
        })
        await action()
        expect(db.createUser).toHaveBeenCalledWith({ user: { name: 'Sophie' } })
      })

      it('responds with created user', async () => {
        await expect(action())
          .resolves
          .toMatchObject({
            errors: undefined,
            data: { createUser: { name: 'Sophie', posts: [] } }
          })
      })
    })
    describe('create user with an already existing name', () => {
      const action = () => mutate({ mutation: CREATE_USER, variables: { name: 'Peter' } })
      const CREATE_USER = gql`
            mutation($name: String!) {
                createUser(user:{name: $name}){name, posts{id, title}}
            }
        `
      it('responds user already exists error message', async () => {
        await expect(action())
          .resolves
          .toMatchObject({
            errors: [new UserInputError('This username already exists')]
          })
      })
    })
    // TEST upvote
    describe('voting up a post which exists and havent been upvoted yet', () => {
      const action = () => mutate({ mutation: UPVOTE, variables: { id: db.posts[0].id, name: 'Peter' } })
      const UPVOTE = gql`
            mutation($id: ID!, $name: String!) {
                upvote(id: $id, voter: {name: $name}){id,  votes}
            }
        `

      it('votes the post up', async () => {
        expect(db.posts[0].votes).toEqual(0)
        await action()
        expect(db.posts[0].votes).toEqual(1)
      })

      it('calls db.upvote', async () => {
        db.upvote = jest.fn(() => {
        })
        await action()
        expect(db.upvote).toHaveBeenCalledWith({ id: db.posts[0].id, voter: { name: 'Peter' } })
      })

      it('responds for voting up a post successfully', async () => {
        await expect(action())
          .resolves
          .toMatchObject({
            errors: undefined,
            data: { upvote: { id: db.posts[0].id, votes: 1 } }
          })
      })
    })

    describe('vote up a post that doesnt exist', () => {
      const action = () => mutate({ mutation: UPVOTE, variables: { id: 'not existing id', name: 'Peter' } })
      const UPVOTE = gql`
            mutation($id: ID!, $name: String!) {
                upvote(id: $id, voter: {name: $name}){id,  votes}
            }
        `
      it('responds post doesnt exist error message', async () => {
        await expect(action())
          .resolves
          .toMatchObject({
            errors: [new UserInputError("This post doesn't exist")]
          })
      })
    })

    describe('vote up a post with a not existing user', () => {
      const action = () => mutate({ mutation: UPVOTE, variables: { id: db.posts[0].id, name: 'Not existing user' } })
      const UPVOTE = gql`
            mutation($id: ID!, $name: String!) {
                upvote(id: $id, voter: {name: $name}){id,  votes}
            }
        `
      it('responds user doesnt exist error message', async () => {
        await expect(action())
          .resolves
          .toMatchObject({
            errors: [new UserInputError("This username doesn't exist")]
          })
      })
    })

    describe('vote up a post for the second time', () => {
      const action = () => mutate({ mutation: UPVOTE, variables: { id: db.posts[0].id, name: 'Peter' } })
      const UPVOTE = gql`
            mutation($id: ID!, $name: String!) {
                upvote(id: $id, voter: {name: $name}){id,  votes}
            }
          `

      it('doent increase the vote a second time', async () => {
        db.posts[0].voters.push(db.users[0])
        db.posts[0].votes++
        expect(db.posts[0].votes).toEqual(1)
        await action()
        expect(db.posts[0].votes).toEqual(1)
      })
    })
  })
})
