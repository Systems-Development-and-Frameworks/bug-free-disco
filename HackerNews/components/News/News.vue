<template>
  <div>
    <h1 class="text-danger">
      {{ news.title }}({{ news.votes }})
    </h1>
    <p>{{ news.body }}</p>
    <button id="upvoteBtn" v-if="!alreadyVoted" @click="upVote">
      Upvote
    </button>
    <button id="downvoteBtn" v-if="!alreadyVoted" @click="downVote">
      Downvote
    </button>
    <button id="removeBtn" v-if="isOwner" @click="remove">
      Remove
    </button>
    <button id="editBtn" v-if="isOwner">
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
        }
      } catch (error) {
        console.log(JSON.stringify(error, null, 2))
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
        }
      } catch (error) {
        console.log(JSON.stringify(error, null, 2))
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
