<template>
  <div>
    <h1 class="text-danger">
      {{ news.title }}({{ news.votes }})
    </h1>
    <div v-if="error" class="error">
      {{ error.message }}
    </div>
    <p>{{ news.body }}</p>
    <button v-if="!alreadyVoted" id="upvoteBtn" @click="upVote">
      Upvote
    </button>
    <button v-if="!alreadyVoted" id="downvoteBtn" @click="downVote">
      Downvote
    </button>
    <button v-if="isOwner" id="removeBtn" @click="remove">
      Remove
    </button>
    <button v-if="isOwner" id="editBtn">
      Edit
    </button>
  </div>
</template>

<script>
import { UPVOTE, DOWNVOTE } from '~/graphql/mutations'

export default {
  name: 'News',
  props: {
    news: {
      id: '',
      title: '',
      body: '',
      votes: 0,
      author: {
        id: '',
        name: '',
        email: ''
      },
      voters: []
    }

  },
  data () {
    return { error: null }
  },

  computed: {
    isOwner () {
      return this.news.author.id === this.$store.state.auth.currentUserID
    },
    alreadyVoted () {
      return !!this.news.voters.find(voter => voter.id === this.$store.state.auth.currentUserID)
    }
  },

  methods: {
    async upVote () {
      try {
        const id = this.news.id
        const res = await this.$apollo.mutate({
          mutation: UPVOTE,
          variables: { id }
        })
        const post = res.data.upvote
        if (post) {
          this.news.votes += 1
          this.$emit('updateItem', this.news.title, this.news.votes)
          this.news.voters.push({ id: this.$store.state.auth.currentUserID })
        } else {
          this.error = { message: 'Upvote request failed!' }
        }
      } catch (error) {
        console.log('error')
        this.error = { message: 'Oops..! Someting went wrong' }
      }
    },
    async downVote () {
      try {
        const id = this.news.id
        const res = await this.$apollo.mutate({
          mutation: DOWNVOTE,
          variables: { id }
        })
        const post = res.data.downvote
        if (post) {
          this.news.votes -= 1
          this.$emit('updateItem', this.news.title, this.news.votes)
          this.news.voters.push({ id: this.$store.state.auth.currentUserID })
        } else {
          this.error = { message: 'Downvote request failed!' }
        }
      } catch (error) {
        this.error = { message: 'Oops..! Someting went wrong' }
      }
    },
    remove () {
      this.$emit('removeItem', this.news.title)
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped></style>
