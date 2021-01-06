import { DataSource } from 'apollo-datasource'
import { UserInputError } from 'apollo-server'
import { Post } from '../models/post'
import driver from '../neo4j/driver'

export class PostDataSource extends DataSource {
  constructor (posts = []) {
    super()
    this.posts = posts
  }

  initialize ({ context }) {
    this.context = context
  }

  async getPostById (id) {
    if (id) {
      return this.posts.find((post) => post.id === id)
    } else {
      throw new UserInputError(
        'No matching post found. Please check your input'
      )
    }
  }

  async getPostByTitle (title) {
    if (title) {
      return this.posts.find((post) => post.title === title)
    } else {
      throw new UserInputError(
        'No matching post found. Please check your input'
      )
    }
  }

  async deletePost (args) {
    const postFound = this.posts.find((post) => post.id === args.id)
    if (postFound) {
      this.posts = this.posts.filter((post) => {
        return post.id !== args.id
      })
      const session = driver.session()
      const txc = session.beginTransaction()
      try {
        await txc.run(
          'MATCH (post:Post { id: $idParam }) ' +
          'Detach DELETE post', {
            idParam: postFound.id
          })

        await txc.commit()
      } catch (error) {
        console.log(error)
      } finally {
        await session.close()
      }

      return postFound
    }

    throw new UserInputError(
      'No matching post found. Please check your input'
    )
  }

  async getAll () {
    this.posts = []
    const session = driver.session()
    const txc = session.beginTransaction()
    try {
      const result = await txc.run('MATCH(p:Post) RETURN p')
      await txc.commit()
      result.records.forEach(r => { r.get(0).properties.votes = r.get(0).properties.votes.toNumber() })
      result.records.forEach(r => this.posts.push(r.get(0).properties))
    } catch (error) {
      console.log(error)
    } finally {
      await session.close()
    }

    return this.posts
  }

  async createPost (args) {
    const author = this.context.req.user
    if (!args) {
      throw new UserInputError('This username doesn\'t exist')
    }

    const newPost = new Post({
      title: args.post.title,
      author: author
    })

    const session = driver.session()
    const txc = session.beginTransaction()
    try {
      await txc.run(
        'CREATE (post:Post {id: $idParam, title: $titleParam, votes: 0, voters: []}) ' +
        'WITH post MATCH (user:User) WHERE user.id = $userParam ' +
        'CREATE (user) - [r:WROTE] -> (post)', {
          idParam: newPost.id,
          titleParam: args.post.title,
          userParam: author.id
        })

      await txc.commit()
    } catch (error) {
      console.log(error)
    } finally {
      await session.close()
    }

    author.posts.push(newPost)
    this.posts.push(newPost)
    return newPost
  }

  async upvote (args) {
    const post = this.posts.find((post) => post.id === args.id)
    if (!post) {
      throw new UserInputError('This post doesn\'t exist')
    }

    const author = this.context.req.user
    if (!post) {
      throw new UserInputError('This username doesn\'t exist')
    }

    if (!post.voters.some((user) => user.name === author.name)) {
      post.votes++
      post.voters.push(author)
      const session = this.context.driver.session()
      const txc = session.beginTransaction()
      const neo4j = require('neo4j-driver')
      try {
        await txc.run(
          'Match (post:Post) WHERE post.id = $idParam ' +
          'SET post.votes = $votesParam ' +
          'WITH post MATCH (user:User) WHERE user.id = $userParam ' +
          'CREATE (user) - [r:VOTED] -> (post)', {
            idParam: args.id,
            votesParam: neo4j.int(post.votes),
            userParam: author.id
          })

        await txc.commit()
      } catch (error) {
        console.log(error)
      } finally {
        await session.close()
      }
    }

    return post
  }

  async downvote (args) {
    const post = this.posts.find((post) => post.id === args.id)
    if (!post) {
      throw new UserInputError('This post doesn\'t exist')
    }

    const author = this.context.req.user
    if (!post) {
      throw new UserInputError('This username doesn\'t exist')
    }

    if (!post.voters.some((user) => user.name === author.name)) {
      post.votes--
      post.voters.push(author)
      const session = this.context.driver.session()
      const txc = session.beginTransaction()
      const neo4j = require('neo4j-driver')
      try {
        await txc.run(
          'Match (post:Post) WHERE post.id = $idParam ' +
          'SET post.votes = $votesParam ' +
          'WITH post MATCH (user:User) WHERE user.id = $userParam ' +
          'CREATE (user) - [r:VOTED] -> (post)', {
            idParam: args.id,
            votesParam: neo4j.int(post.votes),
            userParam: author.id
          })

        await txc.commit()
      } catch (error) {
        console.log(error)
      } finally {
        await session.close()
      }
    }

    return post
  }
}
