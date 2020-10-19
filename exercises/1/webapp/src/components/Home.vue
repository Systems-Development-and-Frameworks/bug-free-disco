<template>
  <div id="app">
    <div class="news-list">
      <div class="news-list-wrapper">
        <h1>{{msg}}</h1>
        <div class="news-holder" v-for="(news, index) in sortedNewsList" :key="index">
          <News :news="news" @updateItem="newsUpdateMessage" @removeItem="newsRemoveMessage"/>
        </div>
      </div>
      <NewsForm :newsList="newsList" @createItem="newsCreated"/>
    </div>
  </div>
</template>

<script>
import News from './News.vue'
import NewsForm from './NewsForm.vue'

export default {
  name: "Home",
  props: {
    msg: {
      type: String,
      required: false,
      default: 'Welcome to Hackernews'
    },
    newsTitle: {
      type: String,
      required: false,
      default: ''
    },
    newsBody: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
      return {
        errors: [],
        newNews: {
          title : "",
          body : ""
        },
        newsList: [
          {
            title : "VueJS",
            body : "VueJS is nice",
            votes : 0
          }, 
          {
            title : "Angular",
            body : "Angular is the best!",
            votes : 0
          }, 
          {
            title : "Java",
            body : "java is perfect!",
            votes : 0
          }
        ],
      }
  },
  computed: {
    sortedNewsList: function() {
      // Sort by votes
      const compare = function (a, b) {
        return b.votes - a.votes
      }
      const arrayClone = Array.from(this.newsList)
      return arrayClone.sort(compare)
    }
  },
  methods: {
      newsUpdateMessage(newsTitle, newsVotes){
        this.newsList = this.newsList.map((item) => {
          if (item.title == newsTitle) item.votes = newsVotes
          
          return item
        })      },
      newsRemoveMessage(newsTitle){
        this.newsList = this.newsList.filter((item) => item.title != newsTitle)
      },
      newsCreated(news){
        this.newsList.push({title: news.title, body: news.body, votes: 0})
      }
  },
  components: {
    News, NewsForm
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
