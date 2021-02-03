<template>
  <b-container class="bv-example-row">
    <Home />
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Home from '../components/Home/Home.vue'

export default {
  name: 'App',
  components: {
    Home
  },
  computed: {
    ...mapGetters('auth', ['isLoggedIn'])
  },
  methods: {
    //   ...mapMutations('auth', ['SET_TOKEN']),

  }
}

</script>

<style>

</style>
