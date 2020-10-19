<template>
  <div id="app">
    <div class="news-list">
      <div class="news-list-wrapper">
        <h1>{{msg}}</h1>
        <div class="news-holder" v-for="(newsContent, index) in sortedNewsList" :key="index">
          <News :newsTitle="newsContent.title" :newsBody="newsContent.body" :newsVotes="newsContent.votes" @updateItem="mewsUpdateMessage" @removeItem="newsRemoveMessage"/>
        </div>
      </div>
      <form @submit.prevent="checkForm">
        <p v-if="errors.length" class="alert">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
          </ul>
        </p>
        <input v-model="newNews.title" placeholder="Title">
        <input v-model="newNews.body" placeholder="Body">
        <button type="submit"> Create </button>
      </form>
    </div>
  </div>
</template>

<script>
import News from './News.vue'

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
        if (a.votes < b.votes)
          return 1
        if (a.votes > b.votes)
          return -1
        return 0
      }
      const arrayClone = Array.from(this.newsList)
      return arrayClone.sort(compare)
    }
  },
  methods: {
      mewsUpdateMessage(newsTitle, newsVotes, voteChange){
        const newsId = this.newsList.findIndex((item) => item.title == newsTitle)
        if (newsId != -1) {
          console.log("New Update Message from Child (" + newsId + "), Votes: " + (newsVotes + voteChange))
          this.newsList[newsId].votes = newsVotes + voteChange
        }
        else {
          console.warn("News with title (" + newsTitle + ") not founded in the list of news")
        }
      },
      newsRemoveMessage(newsTitle){
        const newsId = this.newsList.findIndex((item) => item.title == newsTitle)
        if (newsId != -1) {
          this.newsList.splice(newsId, 1)
        }
        else {
          console.warn("News with title (" + newsTitle + ") not founded in the list of news")
        }
      },
      add(){
        this.newsList.push(
          {
            "title" : this.newNews.title,
            "body" : this.newNews.body,
            "votes" : 0
          }
        )
        this.newNews.title = ""
        this.newNews.body = ""
      },
      checkForm: function (e) {
        if (this.newNews.title && !this.newsInNewsList(this.newNews.title)) {
          this.add()
          this.errors = []
          return true
        }

        this.errors = []

        if (!this.newNews.title) {
          this.errors.push('Title required.');
        }

        if (this.newsInNewsList(this.newNews.title)) {
          this.errors.push('A news with title (' + this.newNews.title + ') is already contained in the list of news');
        }

        e.preventDefault();
      },
      newsInNewsList(newsTitle) {
        const newsId = this.newsList.findIndex((item) => item.title == newsTitle)
        if (newsId != -1)
          return true
        return false
      }
  },
  components: {
    News
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
p.alert {
  color: #a94442;
  background-color: #f2dede;
  border-color: #ebccd1;
}
a {
  color: #42b983;
}
</style>
