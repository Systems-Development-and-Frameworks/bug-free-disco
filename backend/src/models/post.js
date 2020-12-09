import crypto from 'crypto'

export class Post {
  constructor (post) {
    this.votes = 0
    this.voters = []
    this.id = crypto.randomBytes(16).toString('hex')
    Object.assign(this, post)
  }
}
