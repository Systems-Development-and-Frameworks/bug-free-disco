<template>
  <b-row v-if="isLoggedIn" cols="1" cols-lg="3">
    <b-col md class="item text-center">
      <b-card cols="2" cols-md="1" class="b-card-news">
        <b-col>
          <b-row><h2>Actions</h2></b-row>
          <b-row>
            <div class="text-left">
              <NewsForm id="newsForm" :news-list="newsList" @createItem="newsCreated" />
            </div>
          </b-row>
          <b-row>
            <div class="text-left">
              <b-button id="switchOrderBtn" class="action-button" @click="switchSortOrder">
                Reverse sort
              </b-button>
            </div>
          </b-row>
        </b-col>
      </b-card>
    </b-col>
    <b-col v-for="(news, index) in sortedNewsList" :key="index" md class="item text-center">
      <News
        :news="news"
        @updateItem="newsUpdateMessage"
        @removeItem="newsRemoveMessage"
      />
    </b-col>
    <b-col v-if="isEmpty()" md class="item text-center">
      <p>The list is empty :(</p>
    </b-col>
  </b-row>
  <b-row v-else cols="1" cols-lg="3">
    <h1>Please login first</h1>
  </b-row>
</template>

<script>
import { mapGetters } from 'vuex'
import News from '../News/News.vue'
import NewsForm from '../NewsForm/NewsForm.vue'
import { GET_POSTS } from '~/graphql/queries'
import { WRITE, DELETE, DOWNVOTE, UPVOTE } from '~/graphql/mutations'

const SortOrder = {
  ASCENDING: 0,
  DESCENDING: 1
}

export default {
  name: 'Home',
  components: {
    News,
    NewsForm
  },
  props: {
    msg: {
      type: String,
      required: false,
      default: 'Welcome to Hackernews'
    }
  },
  data () {
    return {
      errors: [],
      newsList: [],
      sortOrder: SortOrder.ASCENDING
    }
  },

  computed: {
    ...mapGetters('auth', ['isLoggedIn']),
    sortedNewsList () {
      // Sort by votes
      const compareAscendent = function (a, b) {
        return b.votes - a.votes
      }
      const compareDescendent = function (a, b) {
        return a.votes - b.votes
      }
      const arrayClone = Array.from(this.newsList)
      return arrayClone.sort(
        this.sortOrder === SortOrder.ASCENDING
          ? compareAscendent
          : compareDescendent
      )
    }
  },

  async created () {
    try {
      const res = await this.$apollo.query({
        query: GET_POSTS
      })
      const posts = res.data.posts
      if (!posts) {
        this.newsList = []
      } else {
        this.newsList = posts
      }
    } catch (error) {
      this.errors.push(error)
    }
  },

  methods: {
    switchSortOrder () {
      if (this.sortOrder === SortOrder.ASCENDING) {
        this.sortOrder = SortOrder.DESCENDING
      } else {
        this.sortOrder = SortOrder.ASCENDING
      }
    },
    isEmpty () {
      return this.newsList.length <= 0
    },
    async newsUpdateMessage (newsTitle, newsVotes) {
      try {
        const news = this.newsList.find(n => n.title === newsTitle)
        const res = await this.$apollo.mutate({
          mutation: news.votes > newsVotes ? DOWNVOTE : UPVOTE,
          variables: { id: news.id }
        })

        const post = news.votes > newsVotes ? res.data.downvote : res.data.upvote

        if (post) {
          this.newsList = this.newsList.map((item) => {
            if (item.title === post.title) {
              return {
                ...item,
                votes: post.votes
              }
            }
            return item
          })
        }
      } catch (error) {
        this.errors.push(error)
      }
    },
    async newsRemoveMessage (newsTitle) {
      try {
        const news = this.newsList.find(n => n.title === newsTitle)
        const res = await this.$apollo.mutate({
          mutation: DELETE,
          variables: { id: news.id }
        })

        const post = res.data.delete

        if (post) {
          this.newsList = this.newsList.filter(item => item.title !== post.title)
        }
      } catch (error) {
        this.errors.push(error)
      }
    },
    async newsCreated (news) {
      try {
        const res = await this.$apollo.mutate({
          mutation: WRITE,
          variables: { title: news }
        })

        const post = res.data.write

        if (post) {
          this.newsList.push({
            id: post.id,
            title: post.title,
            body: '',
            votes: 0,
            author: post.author,
            voters: []
          })
        }
      } catch (error) {
        this.errors.push(error)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.b-card-news {
  margin: 2px 0px;
}
</style>
