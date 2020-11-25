import { DataSource } from 'apollo-datasource';
import { UserInputError } from 'apollo-server';
import crypto from 'crypto'

export class Post {
    constructor(data) {
        this.title = data.title
        this.votes = 0
        this.voters = []
        this.id = crypto.randomBytes(16).toString('hex')
        this.author = data.author
    }
}

export class User {
    constructor(data) {
        this.posts = []
        this.name = data.name
    }
}


export class MyDataSource extends DataSource {
    constructor() {
        super()
        this.posts = []
        this.users = []

    }
    createPost(data) {
        const author = this.users.find(user => user.name === data.post.author.name)
        if (author == null) {
            throw new UserInputError("This username doesn't exist")
        }
        
        const newPost = new Post({
            title: data.post.title,
            author: author})

        author.posts.push(newPost)
        this.posts.push(newPost)
        return newPost
    }

    createUser(data) {
        if (this.users.some(user => user.name === data.user.name)) {
            throw new UserInputError("This username already exists")
        }
        const newUser = new User({name: data.user.name})
        this.users.push(newUser)
        return newUser
    }

    upvote(data) {
        const post = this.posts.find(post => post.id === data.id)
        if (post == null) {
            throw new UserInputError("This post doesn't exist")
        }

        const author = this.users.find(user => user.name === data.voter.name)
        if (author == null) {
            throw new UserInputError("This username doesn't exist")
        }

        if (!(post.voters.some(user => user.name === author.name))) {
            post.votes++
            post.voters.push(author)
        }
        return post
    }


    downvote(data) {
        const post = this.posts.find(post => post.id === data.id)
        if (post == null) {
            throw new UserInputError("This post doesn't exist")
        }

        const author = this.users.find(user => user.name === data.voter.name)
        if (author == null) {
            throw new UserInputError("This username doesn't exist")
        }

        if (!(post.voters.some(user => user.name === author.name))) {
            post.votes--
            post.voters.push(author)
        }
        return post
    }

}