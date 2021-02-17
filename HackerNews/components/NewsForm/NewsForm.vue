<template>
  <ValidationObserver ref="observer">
    <b-form slot-scope="{ validate }" @submit.prevent="validate().then(checkForm)">
      <ValidationProvider :rules="`required|min:8|unique:${isUnique}`" name="Name">
        <b-form-group
          id="input-group-1"
          slot-scope="{ valid, errors }"
          label="Title:"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            v-model="title"
            type="text"
            placeholder="Enter the news title"
            :state="errors[0] ? false : (valid ? true : null)"
          />
          <b-form-invalid-feedback>
            {{ errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </ValidationProvider>

      <p v-if="error" class="alert">
        <b>{{ error.name }}</b>
      </p>
      <b-button id="createNews" type="submit" variant="primary">
        Create news
      </b-button>
    </b-form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default {
  name: 'NewsForm',
  components: {
    ValidationObserver,
    ValidationProvider
  },
  props: {
    newsList: {
      type: Array,
      required: true
    }
  },
  data: () => {
    return {
      error: null,
      title: ''
    }
  },
  computed: {
    isUnique () {
      if (this.newsInNewsList(this.title)) {
        return false
      }
      return true
    }
  },
  methods: {
    checkForm () {
      this.$emit('createItem', this.title)
      this.title = ''
    },
    newsInNewsList (newsTitle) {
      return this.newsList.find(n => n.title === newsTitle)
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
</style>
