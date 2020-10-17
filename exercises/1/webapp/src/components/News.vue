<template>
    <div>
        <h1 class="text-danger">{{newsTitle}}({{newsVotes}})</h1>
        <p>{{newsBody}}</p>
        <button @click="upVote"> Upvote </button><button @click="downVote"> Downvote </button><button @click="remove"> Remove </button>
    </div>
</template>

<script>
export default {
    name: "News",
    props: {
        newsTitle: {
            type: String,
            required: false,
            default: ''
        },
        newsBody: {
            type: String,
            required: false,
            default: ''
        },
        newsVotes: {
            type: Number
        }
    },

    methods: {
        upVote(){
            this.$emit('updateItem', this.newsTitle, this.newsVotes, 1)
        },
        downVote(){
            this.$emit('updateItem', this.newsTitle, this.newsVotes, -1)
        },
        remove(){
          this.$emit('removeItem', this.newsTitle)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
