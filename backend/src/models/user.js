import crypto from 'crypto'

export class User {
  constructor (user) {
    this.posts = []
    this.id = crypto.randomBytes(16).toString('hex')
    Object.assign(this, user)
  }
}
