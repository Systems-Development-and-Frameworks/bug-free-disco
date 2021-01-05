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
    await this.getAll()
    if (id) {
      return this.users.find((user) => user.id === id)
    } else {
      throw new UserInputError(
        'No matching user found. Please check your input'
      )
    }
  }

  async getUserByName (name) {
    await this.getAll()
    if (name) {
      return this.users.find((user) => user.name === name)
    } else {
      throw new UserInputError(
        'No matching user found. Please check your input'
      )
    }
  }

  async getUserByEmail (email) {
    await this.getAll()
    if (email) {
      return this.users.find((user) => user.email === email)
    } else {
      throw new UserInputError(
        'No matching user found. Please check your input'
      )
    }
  }

  async getAll () {
    this.users = []
    const session = driver.session()
    const txc = session.beginTransaction()

    try {
      const result = await txc.run('MATCH(u:User) RETURN u')
      await txc.commit()
      result.records.forEach(r => this.users.push(r.get(0).properties))
    } catch (error) {
      console.log(error)
    } finally {
      await session.close()
    }

    return this.users
  }

  async removeUser (id) {
    this.users = this.users.filter((user) => {
      return user.id !== id
    })
  }

  async signup (args) {
    const saltRounds = 10
    await this.getAll()

    if (this.users.some((user) => user.email === args.email)) {
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
      const result = await txc.run(
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

    return generateAccessToken(newUser.id)
  }

  async login (args) {
    if (args.password.length < 8) {
      throw new UserInputError(
        'The password should have at least 8 characters'
      )
    }
    await this.getAll()
    const user = this.users.find((user) => user.email === args.email)
    if (!user) {
      throw new UserInputError('No matching user founded in the DB')
    }

    // Compare password
    const match = await bcrypt.compare(args.password, user.password)
    if (!match) {
      throw new UserInputError('Wrong credentials')
    }

    return generateAccessToken(user.id)
  }
}
