<template>
  <form @submit.prevent="checkForm">
    <p v-if="errors.length" class="alert">
      <b>Please correct the following error(s):</b>
    </p>

    <ul>
      <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
    </ul>

    <label for="Title">Title</label>
    <input v-model="news.title" id="Title" />
    <label for="Body">Body</label>
    <input v-model="news.body" id="Body" />
    <button type="submit">Create</button>
  </form>
</template>

<script>
export default {
  name: "NewsForm",
  props: {
    newsList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      errors: [],
      news: {
        title: "",
        body: ""
      }
    };
  },
  methods: {
    checkForm(e) {
      if (this.news.title && !this.newsInNewsList(this.news.title)) {
        this.errors = [];
        this.$emit("createItem", this.news);
        this.news = { title: "", body: "" };
        return true;
      }

      this.errors = [];

      if (!this.news.title) {
        this.errors.push("Title required.");
      }

      if (this.newsInNewsList(this.news.title)) {
        this.errors.push(
          "A news with title (" +
            this.news.title +
            ") is already contained in the list of news"
        );
      }

      e.preventDefault();
    },
    newsInNewsList(newsTitle) {
      return this.newsList.map(n => n.title).includes(newsTitle);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
p.alert {
  color: #a94442;
  background-color: #f2dede;
  border-color: #ebccd1;
}
</style>
