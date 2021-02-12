<template>
  <div id="app">
    <div v-if="isLoggedIn" class="container">
      <Home />
    </div>
    <div v-else>
      <h1>Please login first</h1>
    </div>
  </div>
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}

.container{
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

}
</style>
