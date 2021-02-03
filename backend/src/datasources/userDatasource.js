import { DataSource } from 'apollo-datasource'
import { UserInputError } from 'apollo-server'
import bcrypt from 'bcrypt'
import { generateAccessToken } from '../utils/tokenGenerator'
import { User } from '../models/user'
import driver from '../neo4j/driver'

export class UserDataSource extends DataSource {
  constructor (users = []) {
    super()
    this.users = users
  }

  initialize ({ context }) {
    this.context = context
  }

  async getUserById (id) {
    if (id) {
      const session = driver.session()
      const txc = session.beginTransaction()
      try {
        const result = await txc.run(
          'MATCH (u:User { id: $idParam }) RETURN u', {
            idParam: id
          })
        await txc.commit()

        if (result.records[0]) {
          return result.records[0].get(0).properties
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
        'No matching user found. Please check your input'
      )
    }
  }

  async getUserByEmail (email) {
    if (email) {
      const session = driver.session()
      const txc = session.beginTransaction()
      try {
        const result = await txc.run(
          'MATCH (u:User { email: $emailParam }) RETURN u', {
            emailParam: email
          })
        await txc.commit()

        if (result.records[0]) {
          return result.records[0].get(0).properties
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
        'No matching user found. Please check your input'
      )
    }
  }

  async signup (args) {
    const saltRounds = 10
    const user = await this.getUserByEmail(args.email)

    if (user) {
      throw new UserInputError('This email already exists')
    }
    if (args.password.length < 8) {
      throw new UserInputError(
        'The password should have at least 8 characters'
      )
    }

    const newUser = new User(args)
    newUser.password = await bcrypt.hash(args.password, saltRounds)

    const session = driver.session()
    const txc = session.beginTransaction()
    try {
      await txc.run(
        'CREATE (user:User {id: $idParam, name: $nameParam, email: $emailParam, password: $passwordParam, posts: []})', {
          idParam: newUser.id,
          nameParam: args.name,
          emailParam: args.email,
          passwordParam: newUser.password
        })
      await txc.commit()
    } catch (error) {
      console.log(error)
    } finally {
      await session.close()
    }
    this.users.push(newUser)

    return generateAccessToken(newUser.id, args.name)
  }

  async login (args) {
    if (args.password.length < 8) {
      throw new UserInputError(
        'The password should have at least 8 characters'
      )
    }
    const user = await this.getUserByEmail(args.email)
    if (!user) {
      throw new UserInputError('No matching user founded in the DB')
    }

    // Compare password
    const match = await bcrypt.compare(args.password, user.password)
    if (!match) {
      throw new UserInputError('Wrong credentials')
    }

    return generateAccessToken(user.id, user.name)
  }
}
