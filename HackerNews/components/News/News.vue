<template>
  <b-card cols="2" cols-md="1" class="b-card-news">
    <b-col>
      <b-row><p>Title: {{ news.title }}</p></b-row>
      <b-row>
        <div class="text-left">
          <p>Author: {{ news.author.name }}</p>
          <p>Votes: {{ news.votes }}</p>
        </div>
      </b-row>
      <b-row>
        <div v-if="error" class="error">
          <p class="alert">
            {{ error.message }}
          </p>
        </div>
      </b-row>
      <b-row>
        <div class="text-left">
          <b-button
            v-if="!alreadyVoted"
            id="upvoteBtn"
            class="action-button"
            :title="upvoteLabel"
            variant="success"
            @click="upVote"
          >
            Upvote
          </b-button>
          <b-button
            v-if="!alreadyVoted"
            id="downvoteBtn"
            class="action-button"
            :title="downvoteLabel"
            variant="warning"
            @click="downVote"
          >
            Downvote
          </b-button>
          <b-button
            v-if="isOwner"
            id="removeBtn"
            class="action-button"
            variant="danger"
            @click="remove"
          >
            {{ removeLabel }}
          </b-button>
        </div>
      </b-row>
    </b-col>
  </b-card>
</template>

<script>
import { UPVOTE, DOWNVOTE } from '~/graphql/mutations'

export default {
  name: 'News',
  props: {
    news: {
      type: Object,

      default () {
        return {
          id: '',
          title: '',
          votes: 0,
          author: {
            id: '',
            name: '',
            email: ''
          },
          voters: []
        }
      }
    }
  },
  data () {
    return {
      error: null,
      upvoteLabel: 'Upvote',
      downvoteLabel: 'Downvote',
      removeLabel: 'Remove',
      editLabel: 'Edit'
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

<style scoped>
p.alert {
  color: #a94442;
  background-color: #f2dede;
  border-color: #ebccd1;
}
.b-card-news {
  margin: 2px 0px;
}
</style>
