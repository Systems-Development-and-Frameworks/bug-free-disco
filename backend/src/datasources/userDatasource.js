import { DataSource } from 'apollo-datasource'
import { UserInputError } from 'apollo-server'
import bcrypt from 'bcrypt'
import { generateAccessToken } from '../utils/tokenGenerator'
import { User } from '../models/user'

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
      return this.users.find((user) => user.id === id)
    } else {
      throw new UserInputError(
        'No matching user found. Please check your input'
      )
    }
  }

  async getUserByName (name) {
    if (name) {
      return this.users.find((user) => user.name === name)
    } else {
      throw new UserInputError(
        'No matching user found. Please check your input'
      )
    }
  }

  async getUserByEmail (email) {
    if (email) {
      return this.users.find((user) => user.email === email)
    } else {
      throw new UserInputError(
        'No matching user found. Please check your input'
      )
    }
  }

  async getAll () {
    return this.users
  }

  async removeUser (id) {
    this.users = this.users.filter((user) => {
      return user.id !== id
    })
  }

  async signup (args) {
    const saltRounds = 10
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
    this.users.push(newUser)

    return generateAccessToken(newUser.id)
  }

  async login (args) {
    if (args.password.length < 8) {
      throw new UserInputError(
        'The password should have at least 8 characters'
      )
    }
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
