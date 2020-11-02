<template>
  <div>
    <h1 class="text-danger">{{ news.title }}({{ news.votes }})</h1>
    <p>{{ news.body }}</p>
    <button @click="upVote">Upvote</button>
    <button @click="downVote">Downvote</button>
    <button @click="remove">Remove</button>
  </div>
</template>

<script>
export default {
  name: "News",
  props: {
    news: {
      title: "",
      body: "",
      votes: 0
    }
  },

  methods: {
    upVote() {
      this.news.votes += 1;
      this.$emit("updateItem", this.news.title, this.news.votes);
    },
    downVote() {
      this.news.votes -= 1;
      this.$emit("updateItem", this.news.title, this.news.votes);
    },
    remove() {
      this.$emit("removeItem", this.news.title);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
