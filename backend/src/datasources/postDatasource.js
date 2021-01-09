import { DataSource } from 'apollo-datasource'
import { UserInputError } from 'apollo-server'
import { Post } from '../models/post'
import { delegateToSchema } from '@graphql-tools/delegate'
import subschema from '../neo4j/schema'
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
      const session = driver.session()
      const txc = session.beginTransaction()
      try {
        const result = await txc.run(
          'MATCH (p:Post { id: $idParam }) RETURN p', {
            idParam: id
          })
        await txc.commit()

        if (result.records[0]) {
          result.records[0].get(0).properties.votes = result.records[0].get(0).properties.votes.toNumber()
          const post = result.records[0].get(0).properties
          return post
        } else {
          return null
        }
      } catch (error) {
        console.log(error)
      } finally {
        await session.close()
      }
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

  async getVoters (id) {
    if (id) {
      const voters = []
      const session = driver.session()
      const txc = session.beginTransaction()
      try {
        const result = await txc.run(
          'MATCH (:Post { id: $idParam })<-[:VOTED]-(user)' +
          'RETURN user.name', {
            idParam: id
          })

        await txc.commit()
        result.records.forEach(r => voters.push(r.get(0)))
        return voters
      } catch (error) {
        console.log(error)
      } finally {
        await session.close()
      }
    } else {
      throw new UserInputError(
        'No matching post found. Please check your input'
      )
    }
  }

  async getAuthorId (id) {
    if (id) {
      const session = driver.session()
      const txc = session.beginTransaction()
      try {
        const result = await txc.run(
          'MATCH (p:Post { id: $idParam })<-[:WROTE]-(user) RETURN user.id', {
            idParam: id
          })
        await txc.commit()

        if (result.records[0]) {
          return result.records[0].get(0)
        } else {
          return null
        }
      } catch (error) {
        console.log(error)
      } finally {
        await session.close()
      }
    } else {
      throw new UserInputError(
        'No matching post found. Please check your input'
      )
    }
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

  async upvote (parent, args, context, info) {
    const voters = await this.getVoters(args.id)
    const post = await this.getPostById(args.id)

    if (!post) {
      throw new UserInputError('This post doesn\'t exist')
    }

    const author = this.context.req.user
    if (!post) {
      throw new UserInputError('This username doesn\'t exist')
    }

    if (!voters.some((user) => user === author.name)) {
      post.votes++
      post.voters.push(author)
      const session = this.context.driver.session()
      const txc = session.beginTransaction()
      try {
        await txc.run(
          'Match (post:Post) WHERE post.id = $idParam ' +
          'WITH post MATCH (user:User) WHERE user.id = $userParam ' +
          'CREATE (user) - [r:VOTED] -> (post)', {
            idParam: args.id,
            userParam: author.id
          })
        await txc.commit()

        return delegateToSchema({
          schema: subschema,
          operation: 'mutation',
          fieldName: 'UpdatePost',
          args: {
            id: args.id,
            votes: post.votes
          },
          context,
          info
        })
      } catch (error) {
        console.log(error)
      } finally {
        await session.close()
      }
    }
  }

  async downvote (parent, args, context, info) {
    const voters = await this.getVoters(args.id)
    const post = await this.getPostById(args.id)

    if (!post) {
      throw new UserInputError('This post doesn\'t exist')
    }

    const author = this.context.req.user
    if (!post) {
      throw new UserInputError('This username doesn\'t exist')
    }

    if (!voters.some((user) => user === author.name)) {
      post.votes--
      post.voters.push(author)
      const session = this.context.driver.session()
      const txc = session.beginTransaction()
      try {
        await txc.run(
          'Match (post:Post) WHERE post.id = $idParam ' +
          'WITH post MATCH (user:User) WHERE user.id = $userParam ' +
          'CREATE (user) - [r:VOTED] -> (post)', {
            idParam: args.id,
            userParam: author.id
          })
        await txc.commit()

        return delegateToSchema({
          schema: subschema,
          operation: 'mutation',
          fieldName: 'UpdatePost',
          args: {
            id: args.id,
            votes: post.votes
          },
          context,
          info
        })
      } catch (error) {
        console.log(error)
      } finally {
        await session.close()
      }
    }
  }
}
