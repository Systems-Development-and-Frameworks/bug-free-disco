<template>
  <div id="app">
    <div class="news-list">
      <div class="news-list-wrapper">
        <h1>{{ msg }}</h1>
        <button @click="switchSortOrder">
          reverse sort
        </button>
        <h2 v-if="isEmpty()">
          The list is empty :(
        </h2>
        <div
          v-for="(news, index) in sortedNewsList"
          :key="index"
          class="news-holder"
        >
          <News
            :news="news"
            @updateItem="newsUpdateMessage"
            @removeItem="newsRemoveMessage"
          />
        </div>
      </div>
      <NewsForm :news-list="newsList" @createItem="newsCreated" />
    </div>
  </div>
</template>

<script>
import News from '../News/News.vue'
import NewsForm from '../NewsForm/NewsForm.vue'

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
    },
    newsListInput: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      errors: [],
      newNews: {
        title: '',
        body: ''
      },
      newsList: [],
      sortOrder: SortOrder.ASCENDING
    }
  },
  computed: {
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
  beforeMount () {
    this.newsList = this.newsListInput
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
    newsUpdateMessage (newsTitle, newsVotes) {
      this.newsList = this.newsList.map((item) => {
        if (item.title === newsTitle) {
          return {
            ...item,
            votes: newsVotes
          }
        }

        return item
      })
    },
    newsRemoveMessage (newsTitle) {
      this.newsList = this.newsList.filter(item => item.title !== newsTitle)
    },
    newsCreated (news) {
      this.newsList.push({
        title: news.title,
        body: news.body,
        votes: 0
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
